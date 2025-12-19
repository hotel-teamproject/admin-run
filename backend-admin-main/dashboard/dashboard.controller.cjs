const User = require('../models/User.cjs');
const Hotel = require('../models/Hotel.cjs');
const Reservation = require('../models/Reservation.cjs'); // 위에서 수정한 파일

// Review 모델 경로 안전하게 불러오기
let Review;
try {
    Review = require('../review/review.model.cjs');
} catch (e) {
    try { Review = require('../models/Review.cjs'); } catch (e2) {}
}

exports.getDashboardStats = async (req, res) => {
    try {
        console.log("📊 [Dashboard] 데이터 집계 시작...");

        // 1. 총 매출 계산 (한글 '예약확정', '완료' 포함 필수)
        const salesData = await Reservation.aggregate([
            { 
                $match: { 
                    status: { $in: ['confirmed', 'completed', '예약확정', '완료'] } 
                } 
            },
            // DB 필드명에 따라 totalPrice 합산
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalSales = salesData.length > 0 ? salesData[0].total : 0;

        // 2. 전체 카운트 조회
        const [totalBookings, activeHotels, newUsers] = await Promise.all([
            Reservation.countDocuments(),
            Hotel.countDocuments({ status: 'active' }),
            User.countDocuments({ role: 'user' })
        ]);

        // 3. 최근 예약 데이터 (5개)
        const recentBookings = await Reservation.find()
            .sort({ createdAt: -1 })
            .limit(5)
            // ▼ [핵심 수정] 스키마 필드명(userId, hotelId)을 정확히 써야 이름이 나옵니다.
            .populate('userId', 'name email') 
            .populate('hotelId', 'name')      
            .lean();

        // 4. 최근 가입 회원 (5명)
        const recentUsers = await User.find({ role: 'user' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email role status createdAt')
            .lean();

        // 5. 최근 리뷰 (5개)
        let recentReviews = [];
        if (Review) {
            try {
                recentReviews = await Review.find()
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .populate('userId', 'name')
                    .lean();
            } catch (e) {
                console.log("리뷰 로딩 건너뜀");
            }
        }

        // 6. 차트 데이터 (실제 DB 기반 월별 매출)
        const monthlyStats = await Reservation.aggregate([
            { 
                $match: { 
                    status: { $in: ['confirmed', 'completed', '예약확정', '완료'] } 
                } 
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    sales: { $sum: "$totalPrice" },
                    bookings: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 1~12월 기본 데이터 생성
        const chartData = Array.from({ length: 12 }, (_, i) => ({
            name: `${i + 1}월`,
            sales: 0,
            bookings: 0
        }));

        // DB 데이터 덮어쓰기
        monthlyStats.forEach(stat => {
            const index = stat._id - 1;
            if (chartData[index]) {
                chartData[index].sales = stat.sales;
                chartData[index].bookings = stat.bookings;
            }
        });

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
        console.error("❌ Dashboard Error:", error);
        res.status(500).json({ success: false, message: "대시보드 데이터를 불러오지 못했습니다." });
    }
};