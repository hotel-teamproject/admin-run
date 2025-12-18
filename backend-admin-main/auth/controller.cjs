const User = require('../models/User.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. 회원가입
exports.register = async (req, res, next) => {
    try {
        const { email, password, name, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '이미 가입된 이메일입니다.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            role: role || 'user',
        });

        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        next(error);
    }
};

// 2. 로그인 (hotel1@hotel.com 자동 생성 기능 포함)
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1) 유저 조회
        let user = await User.findOne({ email });

        // ★★★ [긴급 처방] 요청하신 계정(hotel1@hotel.com)이 없으면, 비밀번호 'hotel1234'로 자동 생성
        if (!user && email === 'hotel1@hotel.com') {
            console.log("⚠️ 관리자 계정(hotel1@hotel.com)이 없어서 자동으로 생성합니다...");
            
            const salt = await bcrypt.genSalt(10);
            // 요청하신 비밀번호 'hotel1234'로 암호화하여 저장
            const hashedPassword = await bcrypt.hash('hotel1234', salt); 

            user = await User.create({
                email: 'hotel1@hotel.com',
                password: hashedPassword,
                name: '관리자',
                role: 'admin',
                status: 'active',
                phone: '010-1111-2222'
            });
            console.log("✅ 관리자 계정 생성 완료! (비번: hotel1234)");
        }

        // 2) 여전히 유저가 없으면 에러 (다른 이메일인 경우)
        if (!user) {
            return res.status(400).json({ success: false, message: '가입되지 않은 이메일입니다.' });
        }

        // 3) 비밀번호 확인
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: '비밀번호가 틀렸습니다.' });
        }

        // 4) 토큰 발급
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret1234',
            { expiresIn: '1d' }
        );

        // 5) 쿠키 설정
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 1일
        });

        console.log(`✅ 로그인 성공: ${user.name} (${user.email})`);

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        next(error);
    }
};

// 3. 로그아웃
exports.logout = async (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        
        res.status(200).json({ 
            success: true, 
            message: '로그아웃 되었습니다.' 
        });
    } catch (error) {
        next(error);
    }
};

// 4. 내 정보 조회
exports.me = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};