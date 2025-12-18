const express = require('express');
const router = express.Router();

// 컨트롤러 파일 불러오기
const usersController = require('./users.controller.cjs'); 

// [디버깅] 서버 실행 시 터미널에 컨트롤러 내용이 출력됩니다. 
// 만약 {} 라고 나오면 컨트롤러 파일이 잘못된 것입니다.
console.log('불러온 usersController:', usersController);

// 1. 전체 회원 목록 조회 
// (GET /api/admin/users)
router.get('/', usersController.getAllUsers);

// 2. 특정 회원 상세 조회 
// (GET /api/admin/users/:userId)
// 주의: 컨트롤러에서 req.params.userId를 쓰므로 여기도 :userId여야 합니다.
router.get('/:userId', usersController.getUserDetail);

// 3. 회원 상태 변경 
// (PUT /api/admin/users/:userId/status)
router.put('/:userId/status', usersController.updateUserStatus);

module.exports = router;