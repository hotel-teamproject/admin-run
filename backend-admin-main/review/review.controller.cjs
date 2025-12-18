const Review = require('./review.model.cjs'); 
const User = require('../models/User.cjs');
const Hotel = require('../models/Hotel.cjs'); 
const bcrypt = require('bcryptjs');

// 1. 전체 리뷰 목록 조회
exports.getAllReviews = async (req, res) => {
    try {
        let reviews = await Review.find().sort({ createdAt: -1 });

        // 리뷰가 없으면 자동 생성 로직 실행
        if (reviews.length === 0) {
            console.log("⚠️ 리뷰 데이터가 없어서 자동 생성을 시작합니다...");

            let hotel = await Hotel.findOne();
            if (!hotel) {
                hotel = await Hotel.create({
                    name: "그랜드 하얏트 서울",
                    address: "서울 용산구",
                    price: 250000,
                    status: "active",
                    rating: 4.5
                });
            }

            let users = await User.find();
            if (users.length === 0) {
                const salt = await bcrypt.genSalt(10);
                const hashedPw = await bcrypt.hash('1234', salt);
                users = await User.create([
                    { name: "김민수", email: "minsu@test.com", password: hashedPw, role: "user", phone: "010-1111-2222" },
                    { name: "임우진", email: "woojin@test.com", password: hashedPw, role: "user", phone: "010-3333-4444" },
                    { name: "김병수", email: "byeongsoo@test.com", password: hashedPw, role: "user", phone: "010-5555-6666" }
                ]);
            }

            const dummyReviews = [
                {
                    hotelId: hotel._id,
                    userId: users[0]._id, 
                    hotelName: hotel.name,
                    userName: users[0].name,
                    rating: 5,
                    content: "직원분들이 너무 친절하고 방도 깨끗해서 좋았어요! 다음에 또 올게요.",
                    createdAt: new Date()
                },
                {
                    hotelId: hotel._id,
                    userId: users[1] ? users[1]._id : users[0]._id, 
                    hotelName: hotel.name,
                    userName: users[1] ? users[1].name : users[0].name,
                    rating: 4,
                    content: "뷰는 정말 좋았는데 주차장이 조금 좁네요. 그래도 만족합니다.",
                    createdAt: new Date(Date.now() - 86400000)
                },
                {
                    hotelId: hotel._id,
                    userId: users[2] ? users[2]._id : users[0]._id,
                    hotelName: hotel.name,
                    userName: users[2] ? users[2].name : users[0].name,
                    rating: 3,
                    content: "기대보다는 평범했습니다. 조식은 맛있었어요.",
                    createdAt: new Date(Date.now() - 172800000)
                },
                {
                    hotelId: hotel._id,
                    userId: users[0]._id,
                    hotelName: hotel.name,
                    userName: users[0].name,
                    rating: 5,
                    content: "가족들과 함께 갔는데 최고의 휴가였습니다. 강추합니다!",
                    createdAt: new Date(Date.now() - 259200000)
                },
                {
                    hotelId: hotel._id,
                    userId: users[1] ? users[1]._id : users[0]._id,
                    hotelName: hotel.name,
                    userName: users[1] ? users[1].name : users[0].name,
                    rating: 1,
                    content: "방음이 너무 안 됩니다. 옆방 소리가 다 들려요.",
                    createdAt: new Date(Date.now() - 345600000)
                }
            ];

            await Review.insertMany(dummyReviews);
            reviews = await Review.find().sort({ createdAt: -1 });
            console.log(`✅ 리뷰 5개 생성 완료!`);
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error("리뷰 조회 에러:", error);
        res.status(500).json({ message: '서버 에러 발생', error: error.message });
    }
};

// 2. [추가됨] 리뷰 상세 조회 (이게 없어서 에러가 났던 것)
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
        }
        res.status(200).json(review);
    } catch (error) {
        console.error("상세 조회 에러:", error);
        res.status(500).json({ message: '서버 에러 발생' });
    }
};

// 3. 리뷰 삭제
exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: '삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '에러 발생' });
    }
};