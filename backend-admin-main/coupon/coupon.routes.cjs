const express = require('express');
const router = express.Router();
const couponController = require('./coupon.controller.cjs');

// 1. 목록 조회
router.get('/', couponController.getAllCoupons);

// 2. 상세 조회
router.get('/:id', couponController.getCouponById);

// 3. 생성
router.post('/', couponController.createCoupon);

// 4. 수정
router.put('/:id', couponController.updateCoupon);

// 5. 삭제
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;