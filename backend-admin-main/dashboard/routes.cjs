const express = require('express');
const router = express.Router();

// 🟢 [핵심] 문제 생기는 controller 대신, 잘 작동하는 service를 직접 연결합니다.
const service = require('./service.cjs'); 

// 1. 대시보드 요약 정보
router.get('/overview', service.getOverview);

// 2. 일별 수익
router.get('/revenue', service.getRevenueByDays);

// 3. 최근 예약
router.get('/recent-bookings', service.getRecentBookings);

module.exports = router;