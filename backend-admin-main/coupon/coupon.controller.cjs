const Coupon = require('../models/Coupon.cjs');
const { successResponse, errorResponse } = require('../shared/utils/response.cjs');

// 1. 쿠폰 목록 조회
exports.getAllCoupons = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const query = {};
        
        // 검색 기능
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // 목록 가져오기
        const coupons = await Coupon.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();
            
        const total = await Coupon.countDocuments(query);
        const totalPages = Math.ceil(total / parseInt(limit));

        // 프론트엔드 호환성을 위해 _id -> id 변환 (선택사항이지만 권장)
        const formattedCoupons = coupons.map(c => ({ ...c, id: c._id }));

        return res.json(successResponse('쿠폰 목록 조회 성공', {
            coupons: formattedCoupons,
            totalPages,
            currentPage: parseInt(page),
            total
        }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorResponse('쿠폰 목록 조회 실패', error));
    }
};

// 🟢 [2. 상세 조회] - 이게 없어서 상세 페이지/수정 페이지가 안 떴던 것!
exports.getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json(errorResponse('쿠폰을 찾을 수 없습니다.', null, 404));
        }
        return res.json(successResponse('쿠폰 상세 조회 성공', coupon));
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorResponse('쿠폰 상세 조회 실패', error));
    }
};

// 3. 쿠폰 생성
exports.createCoupon = async (req, res) => {
    try {
        // init-data.cjs와 모델 스키마에 맞춰서 필드명을 통일했습니다.
        // 프론트엔드에서 보낸 데이터를 DB 필드명에 맞게 매핑
        const { 
            name, 
            code, 
            discountType, 
            discountValue, 
            validFrom, 
            validUntil, 
            usageLimit, 
            status 
        } = req.body;

        const newCoupon = await Coupon.create({
            name,
            code,
            discountType,   // 'percentage' or 'amount'
            discountValue,  // 숫자
            validFrom,      // 날짜
            validUntil,     // 날짜 (init-data랑 맞춤)
            usageLimit,     // 숫자
            status          // 'active' or 'inactive'
        });

        return res.status(201).json(successResponse('쿠폰 생성 성공', newCoupon, 201));
    } catch (error) {
        console.error('coupon.createCoupon error', error);
        return res.status(500).json(errorResponse('쿠폰 생성 실패', error, 500));
    }
};

// 🟢 [4. 쿠폰 수정] - 이게 없어서 수정 저장이 안 됐던 것!
exports.updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // 업데이트된 최신 데이터 반환
        );

        if (!updatedCoupon) {
            return res.status(404).json(errorResponse('수정할 쿠폰을 찾을 수 없습니다.', null, 404));
        }

        return res.json(successResponse('쿠폰 수정 성공', updatedCoupon));
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorResponse('쿠폰 수정 실패', error));
    }
};

// 5. 쿠폰 삭제
exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        return res.json(successResponse('쿠폰 삭제 완료', null));
    } catch (error) {
        return res.status(500).json(errorResponse('쿠폰 삭제 실패', error));
    }
};