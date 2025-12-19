require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const mongoose = require('mongoose');

const { errorHandler, notFoundHandler } = require('./shared/middleware/errorHandler.cjs');

const authRoutes = require('./auth/routes.cjs');
const usersRoutes = require('./users/users.routes.cjs');
const reservationRoutes = require('./reservation/reservation.routes.cjs');
const hotelRoutes = require('./hotel/hotel.routes.cjs');
const couponRoutes = require('./coupon/coupon.routes.cjs');
const reviewRoutes = require('./review/review.routes.cjs');
const dashboardRoutes = require('./dashboard/routes.cjs');

const app = express();
// 포트 설정 (도커 설정과 일치하도록 4000으로 기본값 설정)
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: true, // 프론트엔드에서의 요청 허용
    credentials: true // 쿠키 전송 허용
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// ----------------------------------------------------------------------
// 2. DB 연결 설정 (수정됨)
// ----------------------------------------------------------------------
const connectDB = async () => {
    try {
        // ▼▼▼ [핵심 수정] 환경 변수 우선 사용, 없으면 로컬 주소 사용 ▼▼▼
        // Docker 내부에서는 'mongodb://whotel-mongodb:27017/hotel-project'로 연결됩니다.
        const dbUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hotel-project";
        
        console.log("------------------------------------------------");
        console.log(`🎯 [DB 연결] 연결 시도 중...`);
        console.log(`📡 타겟 URL: ${dbUrl}`);
        console.log("------------------------------------------------");

        await mongoose.connect(dbUrl);

        console.log("✅ MongoDB 연결 성공! (hotel-project)");
    } catch (error) {
        console.error("❌ MongoDB 연결 실패:", error.message);
        // DB 연결 실패 시 프로세스 종료 (Docker가 재시작하도록 유도)
        process.exit(1);
    }
};

app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend Server is Running!', 
        env: process.env.NODE_ENV || 'development',
        timestamp: new Date() 
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin/users', usersRoutes);
app.use('/api/admin/hotels', hotelRoutes);
app.use('/api/admin/bookings', reservationRoutes);
app.use('/api/admin/coupons', couponRoutes);
app.use('/api/admin/reviews', reviewRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = http.createServer(app);

// 테스트 환경이 아닐 때만 서버 실행
if (process.env.NODE_ENV !== 'test') {
    connectDB().then(() => {
        server.listen(PORT, () => {
            console.log(`🚀 Hotel Server Started on Port: ${PORT}`);
        });
    });
} else {
    module.exports = app;
}

const gracefulShutdown = () => {
    console.log('SIGTERM/SIGINT received. Closing server...');
    server.close(() => {
        console.log('Http server closed.');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed.');
            process.exit(0);
        });
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);