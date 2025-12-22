const Coupon = require('../models/Coupon.cjs');
const { successResponse, errorResponse } = require('../shared/utils/response.cjs');

// 1. 쿠폰 목록 조회
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
        const coupons = await Coupon.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();
        const total = await Coupon.countDocuments(query);
        const totalPages = Math.ceil(total / parseInt(limit));

        // UI 호환성을 위해 변환하여 반환
        const formattedCoupons = coupons.map(c => ({
            ...c,
            id: c._id,
            startDate: c.validFrom,
            endDate: c.validUntil,
            isActive: c.status === 'active'
        }));

        return res.json(successResponse('쿠폰 목록 조회 성공', {
            coupons: formattedCoupons,
            totalPages,
            currentPage: parseInt(page),
            total
        }));
    } catch (error) {
        return res.status(500).json(errorResponse('쿠폰 목록 조회 실패', error));
    }
};

// 2. 상세 조회
exports.getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id).lean();
        if (!coupon) return res.status(404).json(errorResponse('쿠폰을 찾을 수 없습니다.', null, 404));

        // UI 형식으로 변환
        const formatted = {
            ...coupon,
            id: coupon._id,
            startDate: coupon.validFrom,
            endDate: coupon.validUntil,
            isActive: coupon.status === 'active'
        };
        return res.json(successResponse('쿠폰 상세 조회 성공', formatted));
    } catch (error) {
        return res.status(500).json(errorResponse('쿠폰 상세 조회 실패', error));
    }
};

// 3. 쿠폰 생성 (필드 매핑)
exports.createCoupon = async (req, res) => {
    try {
        const { name, code, discountType, discountValue, startDate, endDate, usageLimit, isActive } = req.body;

        const newCoupon = await Coupon.create({
            name,
            code,
            discountType: discountType === 'fixed' ? 'amount' : discountType, // fixed -> amount 변환
            discountValue,
            validFrom: startDate, // startDate -> validFrom
            validUntil: endDate,  // endDate -> validUntil
            usageLimit: usageLimit || 100,
            status: isActive ? 'active' : 'inactive' // boolean -> string 변환
        });

        return res.status(201).json(successResponse('쿠폰 생성 성공', newCoupon, 201));
    } catch (error) {
        console.error('coupon.createCoupon error', error);
        return res.status(500).json(errorResponse('쿠폰 생성 실패', error, 500));
    }
};

// 4. 쿠폰 수정 (필드 매핑)
exports.updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, discountType, discountValue, startDate, endDate, usageLimit, isActive } = req.body;

        const updateData = {
            name,
            code,
            discountType: discountType === 'fixed' ? 'amount' : discountType,
            discountValue,
            validFrom: startDate,
            validUntil: endDate,
            usageLimit,
            status: isActive ? 'active' : 'inactive'
        };

        const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedCoupon) return res.status(404).json(errorResponse('수정할 쿠폰을 찾을 수 없습니다.', null, 404));

        return res.json(successResponse('쿠폰 수정 성공', updatedCoupon));
    } catch (error) {
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