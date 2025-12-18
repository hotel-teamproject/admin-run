// 전역 에러 핸들러
const errorHandler = (err, req, res, next) => {
    console.error('🔥 Error Log:', err.message);

    // 기본 상태 코드와 메시지
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || '서버 내부 오류';

    // 1. Mongoose 검증 에러 (필수값 누락 등)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // 2. 중복 키 에러 (이미 가입된 이메일 등)
    if (err.code === 11000) {
        statusCode = 409;
        message = '이미 존재하는 데이터입니다.';
    }

    // 3. JWT 인증 에러
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = '유효하지 않은 토큰입니다.';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = '토큰이 만료되었습니다.';
    }

    // 최종 응답 보내기
    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

// 404 (없는 주소) 핸들러
const notFoundHandler = (req, res, next) => {
    const error = new Error(`주소를 찾을 수 없습니다 - ${req.originalUrl}`);
    res.status(404);
    next(error); // 위의 errorHandler로 넘김
};

module.exports = { errorHandler, notFoundHandler };