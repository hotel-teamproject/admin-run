const User = require('../models/User.cjs');
const bcrypt = require('bcryptjs');

// 1. 전체 회원 목록 조회 (무조건 데이터 나오게 함)
exports.getAllUsers = async (req, res) => {
    try {
        // 1. 현재 DB에 회원이 몇 명인지 확인
        const count = await User.countDocuments();
        console.log(`🔎 현재 등록된 회원 수: ${count}명`);

        // 2. [핵심] 0명이면 강제로 데이터를 넣습니다. (기다릴 필요 없이 바로 실행)
        if (count === 0) {
            console.log("⚠️ 회원이 한 명도 없어서 자동으로 생성합니다...");

            const salt = await bcrypt.genSalt(10);
            const hashedPw = await bcrypt.hash('1234', salt); // 비밀번호 1234

            // 요청하신 멤버 리스트
            const dummyUsers = [
                { name: "김민수", email: "minsu@test.com", password: hashedPw, role: "user", status: "active", phone: "010-3333-4444" },
                { name: "임우진", email: "woojin@test.com", password: hashedPw, role: "user", status: "active", phone: "010-5555-6666" },
                { name: "김병수", email: "byeongsoo@test.com", password: hashedPw, role: "user", status: "active", phone: "010-4567-8901" },
                { name: "조용준", email: "yongjun@test.com", password: hashedPw, role: "user", status: "suspended", phone: "010-7777-8888" },
                { name: "강승범", email: "seungbeom@test.com", password: hashedPw, role: "user", status: "active", phone: "010-2345-6789" },
                { name: "이현석", email: "hyunseok@test.com", password: hashedPw, role: "user", status: "inactive", phone: "010-1234-5678" },
                // 관리자 계정도 없으면 같이 넣어줌
                { name: "관리자", email: "hotel1@hotel.com", password: hashedPw, role: "admin", status: "active", phone: "010-1111-2222" }
            ];

            await User.insertMany(dummyUsers);
            console.log("✅ 회원 7명 자동 생성 완료!");
        }

        // 3. 다시 조회해서 화면에 보냄 (이제 무조건 데이터가 있음)
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        
        res.status(200).json(users);

    } catch (error) {
        console.error("전체 조회 에러:", error);
        res.status(500).json({ message: '서버 에러 발생' });
    }
};

// 2. 상세 조회
exports.getUserDetail = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: '사용자 없음' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: '서버 에러' });
    }
};

// 3. 상태 변경
exports.updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, { status }, { new: true });
        res.status(200).json({ message: '변경 완료', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: '에러 발생' });
    }
};