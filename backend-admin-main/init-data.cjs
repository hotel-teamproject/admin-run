require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ▼▼▼ [수정됨] 환경 변수가 있으면 쓰고, 없으면 로컬 주소(127.0.0.1) 사용
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hotel-project";

const initData = async () => {
  let connection = null;
  try {
    connection = await mongoose.connect(MONGO_URI);
    console.log(`-------------------------------------------`);
    console.log(`🎯 [데이터 통합 초기화] hotel-project DB`);
    console.log(`📡 주소: ${MONGO_URI}`);
    console.log(`-------------------------------------------`);

    // ====================================================
    // 🛠️ 1. 모델 정의
    // ====================================================
    
    // 1-1. User
    const userSchema = new mongoose.Schema({
        name: String, email: String, password: String, phone: String, role: String, status: String, createdAt: { type: Date, default: Date.now }
    });
    const User = mongoose.models.User || mongoose.model("User", userSchema);

    // 1-2. Hotel
    const hotelSchema = new mongoose.Schema({
        name: String, address: String, price: Number, description: String, imageUrl: String, rating: Number, class: Number, status: String, createdAt: { type: Date, default: Date.now }
    });
    const Hotel = mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);

    // 1-3. Booking
    const bookingSchema = new mongoose.Schema({
        userId: mongoose.Schema.Types.ObjectId,
        hotelId: mongoose.Schema.Types.ObjectId,
        hotelName: String,
        userName: String,
        userEmail: String,
        checkIn: Date,
        checkOut: Date,
        guests: Number,
        adults: Number,
        children: Number,
        totalPrice: Number,
        amount: Number,
        status: String,
        createdAt: { type: Date, default: Date.now }
    });
    const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

    // 1-4. Review
    const reviewSchema = new mongoose.Schema({
        userId: mongoose.Schema.Types.ObjectId,
        hotelId: mongoose.Schema.Types.ObjectId,
        hotelName: String,
        userName: String,
        rating: Number,
        content: String,
        createdAt: { type: Date, default: Date.now }
    });
    const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

    // 1-5. Coupon
    const couponSchema = new mongoose.Schema({
        name: String,
        code: String,
        discountType: String, 
        discountValue: Number,
        validFrom: Date,
        validUntil: Date,
        usageLimit: Number,
        usedCount: { type: Number, default: 0 },
        status: { type: String, default: 'active' },
        createdAt: { type: Date, default: Date.now }
    });
    const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

    // ====================================================
    // 🗑️ 2. 기존 데이터 삭제
    // ====================================================
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});
    console.log("🗑️  기존 데이터(유저, 호텔, 예약, 리뷰, 쿠폰) 삭제 완료");

    // ====================================================
    // 👤 3. 유저 생성
    // ====================================================
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash("hotel1234", salt);

    const rawUsers = [
      { name: "관리자", email: "hotel1@hotel.com", password: hashedPw, phone: "010-1111-2222", role: "admin", status: "active" },
      { name: "김민수", email: "minsu@example.com", password: hashedPw, phone: "010-3333-4444", role: "user", status: "active" },
      { name: "임우진", email: "woojin@example.com", password: hashedPw, phone: "010-5555-6666", role: "user", status: "active" },
      { name: "조용준", email: "yongjun@example.com", password: hashedPw, phone: "010-7777-8888", role: "user", status: "active" },
      { name: "이현석", email: "hyunseok@example.com", password: hashedPw, phone: "010-1234-5678", role: "user", status: "active" },
      { name: "강승범", email: "seungbeom@example.com", password: hashedPw, phone: "010-2345-6789", role: "user", status: "active" },
      { name: "하다민", email: "damin@example.com", password: hashedPw, phone: "010-3456-7899", role: "user", status: "active" },
      { name: "김병수", email: "byeongsoo@example.com", password: hashedPw, phone: "010-4567-8901", role: "user", status: "active" },
    ];
    
    const createdUsers = await User.insertMany(rawUsers);
    console.log(`👤 유저 ${createdUsers.length}명 생성 완료`);

    // ====================================================
    // 🏨 4. 호텔 생성
    // ====================================================
    const rawHotels = [
        {
            name: "그랜드 하얏트 서울",
            address: "서울 용산구 소월로 322",
            price: 350000,
            description: "남산의 자연과 도심의 전경을 한눈에 감상할 수 있는 럭셔리 호텔입니다.",
            imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            rating: 4.8,
            class: 5,
            status: "active"
        },
        {
            name: "시그니엘 부산",
            address: "부산 해운대구 달맞이길 30",
            price: 420000,
            description: "해운대의 환상적인 오션뷰를 자랑하는 최고급 랜드마크 호텔입니다.",
            imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
            rating: 4.9,
            class: 5,
            status: "active"
        },
        {
            name: "제주 신라 호텔",
            address: "제주 서귀포시 중문관광로 72번길",
            price: 280000,
            description: "이국적인 분위기와 최고의 서비스를 제공하는 제주의 대표 휴양지입니다.",
            imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
            rating: 4.7,
            class: 5,
            status: "active"
        },
        {
            name: "강릉 세인트존스",
            address: "강원도 강릉시 창해로 307",
            price: 150000,
            description: "동해 바다 바로 앞에 위치한 인피니티 풀이 유명한 호텔입니다.",
            imageUrl: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?auto=format&fit=crop&w=800&q=80",
            rating: 4.2,
            class: 4,
            status: "active"
        },
        {
            name: "인천 파라다이스 시티",
            address: "인천 중구 영종해안남로 321",
            price: 320000,
            description: "예술과 엔터테인먼트가 결합된 동북아 최초의 복합 리조트입니다.",
            imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
            rating: 4.6,
            class: 5,
            status: "active"
        }
    ];

    const createdHotels = await Hotel.insertMany(rawHotels);
    console.log(`🏨 호텔 ${createdHotels.length}개 생성 완료`);


    // ====================================================
    // 📅 5. 예약 데이터 생성
    // ====================================================
    const today = new Date();
    
    const rawBookings = [
        {
            userId: createdUsers[1]._id, // 김민수
            userName: createdUsers[1].name,
            userEmail: createdUsers[1].email,
            hotelId: createdHotels[0]._id, // 하얏트
            hotelName: createdHotels[0].name,
            checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
            checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
            adults: 2, children: 1, guests: 3,
            totalPrice: createdHotels[0].price * 2, 
            amount: createdHotels[0].price * 2,
            status: "예약확정"
        },
        {
            userId: createdUsers[2]._id, // 임우진
            userName: createdUsers[2].name,
            userEmail: createdUsers[2].email,
            hotelId: createdHotels[1]._id, // 시그니엘
            hotelName: createdHotels[1].name,
            checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
            checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11),
            adults: 2, children: 0, guests: 2,
            totalPrice: createdHotels[1].price,
            amount: createdHotels[1].price,
            status: "완료"
        },
        {
            userId: createdUsers[3]._id, // 조용준
            userName: createdUsers[3].name,
            userEmail: createdUsers[3].email,
            hotelId: createdHotels[2]._id, // 제주 신라
            hotelName: createdHotels[2].name,
            checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
            checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
            adults: 2, children: 2, guests: 4,
            totalPrice: createdHotels[2].price * 2,
            amount: createdHotels[2].price * 2,
            status: "예약확정"
        },
        {
            userId: createdUsers[1]._id, // 김민수
            userName: createdUsers[1].name,
            userEmail: createdUsers[1].email,
            hotelId: createdHotels[3]._id, // 강릉
            hotelName: createdHotels[3].name,
            checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
            checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8),
            adults: 1, children: 0, guests: 1,
            totalPrice: createdHotels[3].price * 2,
            amount: createdHotels[3].price * 2,
            status: "취소"
        }
    ];

    await Booking.insertMany(rawBookings);
    console.log(`📅 예약 ${rawBookings.length}건 생성 완료`);


    // ====================================================
    // ⭐ 6. 리뷰 데이터 생성
    // ====================================================
    const rawReviews = [
        {
            userId: createdUsers[1]._id, // 김민수
            userName: createdUsers[1].name,
            hotelId: createdHotels[0]._id, // 하얏트
            hotelName: createdHotels[0].name,
            rating: 5,
            content: "역시 하얏트입니다. 야경이 정말 끝내주네요!",
            createdAt: new Date()
        },
        {
            userId: createdUsers[2]._id, // 임우진
            userName: createdUsers[2].name,
            hotelId: createdHotels[1]._id, // 시그니엘
            hotelName: createdHotels[1].name,
            rating: 5,
            content: "부산 최고의 호텔. 비싸지만 돈 값 합니다.",
            createdAt: new Date(Date.now() - 86400000)
        },
        {
            userId: createdUsers[3]._id, // 조용준
            userName: createdUsers[3].name,
            hotelId: createdHotels[2]._id, // 제주 신라
            hotelName: createdHotels[2].name,
            rating: 4,
            content: "서비스는 좋은데 시설이 살짝 노후된 느낌?",
            createdAt: new Date(Date.now() - 172800000)
        },
        {
            userId: createdUsers[4]._id, // 이현석
            userName: createdUsers[4].name,
            hotelId: createdHotels[3]._id, // 강릉
            hotelName: createdHotels[3].name,
            rating: 3,
            content: "인피니티 풀 사람 너무 많아서 물반 사람반...",
            createdAt: new Date(Date.now() - 259200000)
        },
        {
            userId: createdUsers[1]._id, // 김민수
            userName: createdUsers[1].name,
            hotelId: createdHotels[4]._id, // 파라다이스
            hotelName: createdHotels[4].name,
            rating: 5,
            content: "가족여행으로 최고입니다. 아이들이 정말 좋아해요.",
            createdAt: new Date(Date.now() - 345600000)
        }
    ];

    await Review.insertMany(rawReviews);
    console.log(`⭐ 리뷰 ${rawReviews.length}건 생성 완료`);


    // ====================================================
    // 🎟️ 7. 쿠폰 데이터 생성
    // ====================================================
    const rawCoupons = [
        {
            name: "오픈 기념 할인",
            code: "WELCOME2025",
            discountType: "percentage",
            discountValue: 10, // 10%
            validFrom: today,
            validUntil: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()),
            usageLimit: 100,
            usedCount: 12,
            status: "active"
        },
        {
            name: "여름 휴가 지원금",
            code: "SUMMER5000",
            discountType: "amount",
            discountValue: 5000, // 5000원
            validFrom: today,
            validUntil: new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()),
            usageLimit: 50,
            usedCount: 5,
            status: "active"
        },
        {
            name: "VIP 전용 쿠폰",
            code: "VIP_ONLY",
            discountType: "percentage",
            discountValue: 20,
            validFrom: today,
            validUntil: new Date(today.getFullYear(), today.getMonth() + 6, today.getDate()),
            usageLimit: 10,
            usedCount: 0,
            status: "inactive" 
        }
    ];

    await Coupon.insertMany(rawCoupons);
    console.log(`🎟️ 쿠폰 ${rawCoupons.length}개 생성 완료!`);

    console.log(`-------------------------------------------`);
    console.log(`🎉 모든 데이터 통합 생성 완료!`);
    console.log(`-------------------------------------------`);

  } catch (error) {
    console.error("❌ 에러:", error);
  } finally {
    if (connection) await mongoose.connection.close();
    process.exit(0);
  }
};

initData();