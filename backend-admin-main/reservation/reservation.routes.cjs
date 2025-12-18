const express = require('express');
const router = express.Router();

const reservationController = require('./reservation.controller.cjs');

// 1. 목록 조회
router.get('/', reservationController.getAllReservations);

// 2. [추가됨] 상세 조회 (GET /api/admin/bookings/:id)
// 주의: /:id 라우트는 항상 구체적인 라우트(예: /search)보다 뒤에 있어야 안전하지만, 지금은 괜찮습니다.
router.get('/:id', reservationController.getReservationById);

// 3. 상태 변경
router.put('/:id/status', reservationController.updateStatus);

// 4. 삭제 (필요 시)
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;