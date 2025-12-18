const express = require('express');
const router = express.Router();

// [기존 코드들...]
const dashboardRoutes = require('../dashboard/routes');
router.use('/dashboard', dashboardRoutes);

const reservationRoutes = require('../reservation/route');
router.use('/reservations', reservationRoutes);

const authRoutes = require('../auth/routes');
router.use('/auth', authRoutes);

const couponRoutes = require('../coupon/route');
router.use('/coupons', couponRoutes);

const hotelRoutes = require('../hotel/routes');
router.use('/hotels', hotelRoutes);

const modelsRoutes = require('../models/route');
router.use('/models', modelsRoutes);

const middlewaresRoutes = require('../middlewares/route');
router.use('/middlewares', middlewaresRoutes);

const noticeRoutes = require('../notice/route.cjs');
router.use('/notices', noticeRoutes);

// ▼▼▼ [여기 추가] ▼▼▼
// 1. user 폴더를 새로 만들고 그 안의 route 파일을 연결합니다.
// 주소가 /api/admin/users 이므로 여기서 경로를 잡아줍니다.
const userRoutes = require('../user/route'); 
router.use('/admin/users', userRoutes); 
// ▲▲▲ [여기까지] ▲▲▲

module.exports = router;