const express = require('express');
const router = express.Router();

// 🟢 [수정 후] (같은 폴더 내의 파일을 찾음)
const couponController = require('./coupon.controller.cjs');

// 1. 목록 조회
router.get('/', couponController.getAllCoupons); 
// (참고: 컨트롤러 함수 이름이 getCoupons인지 getAllCoupons인지 확인 필요, 제가 드린 코드는 getAllCoupons였습니다)

// 2. 생성
router.post('/', couponController.createCoupon);

// 🔴 [3. 상세 조회] - 이 줄이 없어서 "정보를 불러올 수 없습니다" 에러가 떴습니다!
router.get('/:id', couponController.getCouponById);

// 🔴 [4. 수정] - 이 줄이 없어서 수정이 안 됐습니다!
router.put('/:id', couponController.updateCoupon);

// 5. 삭제
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;