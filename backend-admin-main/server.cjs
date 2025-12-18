require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const mongoose = require('mongoose'); // mongoose 직접 사용

const { errorHandler, notFoundHandler } = require('./shared/middleware/errorHandler.cjs');

// 라우터 파일들 불러오기
const authRoutes = require('./auth/routes.cjs');
const usersRoutes = require('./users/users.routes.cjs');
const reservationRoutes = require('./reservation/reservation.routes.cjs');
const hotelRoutes = require('./hotel/hotel.routes.cjs');
const couponRoutes = require('./coupon/coupon.routes.cjs');
const reviewRoutes = require('./review/review.routes.cjs');
const dashboardRoutes = require('./dashboard/routes.cjs');

const app = express();

// CORS 설정 (프론트엔드 통신 허용)
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// ----------------------------------------------------------------------
// 🔴 [핵심 수정] DB 주소를 'hotel-project'로 강제 고정합니다.
// ----------------------------------------------------------------------
const connectDB = async () => {
    try {
        // .env 파일 무시하고 직접 주소 입력 (이게 가장 확실합니다)
        const dbUrl = "mongodb://host.docker.internal:27017/hotel-project";
        
        console.log("------------------------------------------------");
        console.log(`🎯 [목표 DB] hotel-project 연결 시도 중...`);
        console.log(`📡 주소: ${dbUrl}`);
        console.log("------------------------------------------------");

        await mongoose.connect(dbUrl);
        console.log("✅ MongoDB 연결 성공! (hotel-project)");
        
    } catch (error) {
        console.error("❌ MongoDB 연결 실패:", error);
    }
};

// DB 연결 실행
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// 기본 라우트
app.get('/', (req, res) => {
    res.json({ message: 'Backend Server is Running!', timestamp: new Date() });
});

// API 라우트 연결
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', usersRoutes);
app.use('/api/admin/hotels', hotelRoutes);
app.use('/api/admin/bookings', reservationRoutes);
app.use('/api/admin/coupons', couponRoutes);
app.use('/api/admin/reviews', reviewRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 에러 핸들러
app.use(notFoundHandler);
app.use(errorHandler);

// 서버 실행 (5000번 포트)
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`🚀 Hotel Server Started on Port: ${PORT}`);
});

process.on('SIGTERM', () => {
    server.close(() => { console.log('Process terminated'); });
});