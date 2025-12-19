const corsOptions = {
    // [수정됨] 로컬 개발 및 배포 도메인 모두 허용
    origin: [
        'http://localhost',
        'http://localhost:5173',
        'http://localhost:5174',
        'https://kbutest.store',
        'http://kbutest.store',
        process.env.FRONT_ORIGIN
    ].filter(Boolean), // undefined 값 제거
    
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
};

module.exports = { corsOptions };