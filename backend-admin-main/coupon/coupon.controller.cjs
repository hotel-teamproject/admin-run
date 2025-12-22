const Coupon = require('../models/Coupon.cjs');
const { successResponse, errorResponse } = require('../shared/utils/response.cjs');

/**
 * 1. 쿠폰 목록 조회
 * DB의 validFrom, status 등을 프론트엔드가 기대하는 startDate, isActive로 변환하여 반환합니다.
 */
exports.getAllCoupons = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const coupons = await Coupon.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Coupon.countDocuments(query);
        
        // 프론트엔드 UI 호환성을 위해 필드 매핑 및 ID 변환
        const formattedCoupons = coupons.map(c => ({
            ...c,
            id: c._id,
            startDate: c.validFrom,
            endDate: c.validUntil,
            isActive: c.status === 'active',
            discountType: c.discountType === 'amount' ? 'fixed' : c.discountType
        }));

        return res.json(successResponse('쿠폰 목록 조회 성공', {
            coupons: formattedCoupons,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            total
        }));
    } catch (error) {
        console.error('getAllCoupons error:', error);
        return res.status(500).json(errorResponse('쿠폰 목록 조회 실패', error));
    }
};

/**
 * 2. 상세 조회
 */
exports.getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id).lean();
        if (!coupon) {
            return res.status(404).json(errorResponse('쿠폰을 찾을 수 없습니다.', null, 404));
        }

        // UI 형식으로 매핑하여 반환
        const formatted = {
            ...coupon,
            id: coupon._id,
            startDate: coupon.validFrom,
            endDate: coupon.validUntil,
            isActive: coupon.status === 'active',
            discountType: coupon.discountType === 'amount' ? 'fixed' : coupon.discountType
        };

        return res.json(successResponse('쿠폰 상세 조회 성공', formatted));
    } catch (error) {
        console.error('getCouponById error:', error);
        return res.status(500).json(errorResponse('쿠폰 상세 조회 실패', error));
    }
};

/**
 * 3. 쿠폰 생성 (500 에러 해결 핵심 로직)
 * 프론트엔드 필드명을 DB 필드명으로 매핑합니다.
 */
exports.createCoupon = async (req, res) => {
    try {
        const { 
            name, code, discountType, discountValue, 
            startDate, endDate, usageLimit, isActive 
        } = req.body;

        // DB 모델 Coupon.cjs 스키마에 맞춰 매핑하여 생성
        const newCoupon = await Coupon.create({
            name,
            code,
            // 프론트엔드의 'fixed'를 DB의 'amount'로 변환
            discountType: discountType === 'fixed' ? 'amount' : discountType,
            discountValue: Number(discountValue),
            validFrom: startDate,  // startDate -> validFrom
            validUntil: endDate,   // endDate -> validUntil
            usageLimit: usageLimit || 100,
            status: isActive ? 'active' : 'inactive' // boolean -> string
        });

        return res.status(201).json(successResponse('쿠폰 생성 성공', newCoupon, 201));
    } catch (error) {
        console.error('coupon.createCoupon error:', error);
        // 중복 코드 에러 처리
        if (error.code === 11000) {
            return res.status(400).json(errorResponse('이미 존재하는 쿠폰 코드입니다.', null, 400));
        }
        return res.status(500).json(errorResponse('쿠폰 생성 실패', error.message, 500));
    }
};

/**
 * 4. 쿠폰 수정
 * 수정 시에도 동일하게 필드 매핑을 적용합니다.
 */
exports.updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, code, discountType, discountValue, 
            startDate, endDate, usageLimit, isActive 
        } = req.body;

        const updateData = {
            name,
            code,
            discountType: discountType === 'fixed' ? 'amount' : discountType,
            discountValue: Number(discountValue),
            validFrom: startDate,
            validUntil: endDate,
            usageLimit: Number(usageLimit),
            status: isActive ? 'active' : 'inactive'
        };

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedCoupon) {
            return res.status(404).json(errorResponse('수정할 쿠폰을 찾을 수 없습니다.', null, 404));
        }

        return res.json(successResponse('쿠폰 수정 성공', updatedCoupon));
    } catch (error) {
        console.error('updateCoupon error:', error);
        return res.status(500).json(errorResponse('쿠폰 수정 실패', error.message));
    }
};

/**
 * 5. 쿠폰 삭제
 */
exports.deleteCoupon = async (req, res) => {
    try {
        const result = await Coupon.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json(errorResponse('삭제할 쿠폰을 찾을 수 없습니다.', null, 404));
        }
        return res.json(successResponse('쿠폰 삭제 완료', null));
    } catch (error) {
        console.error('deleteCoupon error:', error);
        return res.status(500).json(errorResponse('쿠폰 삭제 실패', error));
    }
};