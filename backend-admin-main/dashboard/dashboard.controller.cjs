// dashboard/dashboard.controller.cjs

// [1] 모델 불러오기
// ※ 주의: 만약 에러가 난다면 파일 경로('../models/...')가 실제 폴더 위치와 맞는지 확인해주세요.
const User = require('../models/User.cjs');
const Hotel = require('../models/Hotel.cjs');
const Reservation = require('../models/Reservation.cjs');
const Review = require('../review/review.model.cjs'); // 리뷰 모델 경로 확인 필요

exports.getDashboardStats = async (req, res) => {
    try {
        console.log("[Dashboard] 실시간 DB 데이터 집계 중...");

        // 1. 총 매출 (예약 상태가 confirmed 또는 completed인 것만 합산)
        const salesData = await Reservation.aggregate([
            { $match: { status: { $in: ['confirmed', 'completed'] } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalSales = salesData.length > 0 ? salesData[0].total : 0;

        // 2. 전체 카운트 조회
        // Promise.all로 동시에 실행하여 속도 향상
        const [totalBookings, activeHotels, newUsers] = await Promise.all([
            Reservation.countDocuments(),
            Hotel.countDocuments(), // 필요시 { status: 'active' } 조건 추가
            User.countDocuments({ role: 'user' })
        ]);

        // 3. 최근 예약 데이터 (5개) - 유저와 호텔 정보 포함(populate)
        const recentBookings = await Reservation.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email') // 예약자 이름, 이메일 가져오기
            .populate('hotel', 'name')      // 호텔 이름 가져오기
            .lean();

        // 4. 최근 가입 회원 (5명)
        const recentUsers = await User.find({ role: 'user' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email role status createdAt') // 비밀번호 제외하고 가져오기
            .lean();

        // 5. 최근 리뷰 (5개)
        // 리뷰 모델이 없거나 에러가 나도 대시보드는 켜져야 하므로 try-catch 감쌈
        let recentReviews = [];
        try {
            recentReviews = await Review.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('user', 'name')
                .lean();
        } catch (e) {
            console.log("리뷰 데이터 로딩 패스 (경로 확인 필요)");
        }

        // 6. 차트 데이터 (월별 매출)
        // 실제 월별 집계 쿼리는 복잡하므로, 현재는 예시 데이터에 '이번 달' 데이터만 합쳐서 보냄
        const chartData = [
            { name: "1월", sales: 400000, bookings: 4 },
            { name: "2월", sales: 300000, bookings: 3 },
            { name: "3월", sales: 550000, bookings: 5 },
            { name: "4월", sales: 480000, bookings: 4 },
            { name: "5월", sales: 600000, bookings: 6 },
            { name: "6월", sales: totalSales, bookings: totalBookings }, // 현재 총합을 6월에 표시 (예시)
        ];

        // 데이터 응답
        res.status(200).json({
            success: true,
            data: {
                totalSales,
                totalBookings,
                activeHotels,
                newUsers,
                chartData,
                recentBookings,
                recentUsers,
                recentReviews
            }
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ success: false, message: "대시보드 데이터를 불러오지 못했습니다." });
    }
};