const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    // 쿠폰 이름
    name: { type: String, required: true },
    
    // 쿠폰 코드 (중복 불가)
    code: { type: String, required: true, unique: true },
    
    // 할인 타입 (percentage / amount)
    discountType: { type: String, enum: ['percentage', 'amount'], required: true },
    
    // 할인 값 (discountValue)
    discountValue: { type: Number, required: true }, 

    // 사용 기간 필드 (validFrom, validUntil)
    validFrom: { type: Date, required: true, default: Date.now },
    validUntil: { type: Date, required: true }, 
    
    // 사용 제한 (usageLimit)
    usageLimit: { type: Number, default: 100 },
    
    // 사용된 횟수
    usedCount: { type: Number, default: 0 },
    
    // 상태 (status: 'active' 또는 'inactive')
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', couponSchema);