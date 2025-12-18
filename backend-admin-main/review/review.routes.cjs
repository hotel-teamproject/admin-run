const express = require('express');
const router = express.Router();

// 컨트롤러 불러오기
const reviewController = require('./review.controller.cjs');

console.log("Review Controller 로드 상태:", reviewController);

// 1. 전체 리뷰 조회 (GET /api/admin/reviews)
router.get('/', reviewController.getAllReviews);

// 2. [추가됨] 리뷰 상세 조회 (GET /api/admin/reviews/:id)
// 주의: /:id 경로는 반드시 기본 경로보다 뒤에, 복잡한 경로보다는 앞에 두는 게 좋지만 여기선 괜찮습니다.
router.get('/:id', reviewController.getReviewById);

// 3. 리뷰 삭제 (DELETE /api/admin/reviews/:id)
router.delete('/:id', reviewController.deleteReview);

module.exports = router;