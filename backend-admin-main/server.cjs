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
// 4000번 포트 고정 (Docker 환경 고려)
const PORT = process.env.PORT || 4000; 

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// ▼▼▼ [수정됨] DB 연결 로직 ▼▼▼
const connectDB = async () => {
    try {
        // 1. Docker Compose나 .env의 MONGO_URI를 최우선으로 사용
        // 2. 값이 없으면 Atlas 주소를 기본값(Fallback)으로 사용
        const dbUrl = process.env.MONGO_URI || "mongodb+srv://dr701050:1234@cluster0.ntbddof.mongodb.net/hotel-project?retryWrites=true&w=majority&appName=Cluster0";
        
        console.log("------------------------------------------------");
        console.log(`🎯 [DB 연결] MongoDB Atlas 연결 시도 중...`);
        console.log(`📡 타겟 서버: Cluster0 (Atlas)`);
        console.log("------------------------------------------------");
        
        await mongoose.connect(dbUrl);
        console.log("✅ MongoDB Atlas 연결 성공!");
    } catch (error) {
        console.error("❌ MongoDB 연결 실패:", error.message);
        // 연결 실패 시 서버를 시작하지 않고 프로세스 종료
        process.exit(1);
    }
};

app.get('/', (req, res) => res.json({ message: 'Server Running' }));
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

// 테스트 환경이 아닐 때만 DB 연결 후 서버 시작
if (process.env.NODE_ENV !== 'test') {
    connectDB().then(() => {
        server.listen(PORT, () => {
            console.log(`🚀 Hotel Server Started on Port: ${PORT}`);
            console.log(`🌍 API URL: http://localhost:${PORT}/api`);
        });
    });
}

// 프로세스 종료 시 DB 연결 정리
process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));