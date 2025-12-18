const express = require('express');
const router = express.Router();

// 🔴 .cjs 확인!
const hotelController = require('./hotel.controller.cjs');

router.post('/', hotelController.createHotel);       // 등록
router.get('/', hotelController.getHotels);          // 전체 조회
router.get('/:id', hotelController.getHotelById);    // 상세 조회
router.put('/:id', hotelController.updateHotel);     // 수정
router.delete('/:id', hotelController.deleteHotel);  // 삭제

module.exports = router;