const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    // 쿠폰 이름
    name: { type: String, required: true },
    
    // 쿠폰 코드 (중복 불가)
    code: { type: String, required: true, unique: true },
    
    // 🔴 [수정] 할인 타입 (percentage / amount)
    discountType: { type: String, enum: ['percentage', 'amount'], required: true },
    
    // 🔴 [핵심 수정] 여기가 'value'가 아니라 'discountValue'여야 합니다!
    // (이게 달라서 undefined가 떴던 겁니다)
    discountValue: { type: Number, required: true }, 

    // 🔴 [수정] 날짜 필드명 통일 (validFrom, validUntil)
    validFrom: { type: Date, required: true, default: Date.now },
    validUntil: { type: Date, required: true }, 
    
    // 🔴 [수정] 사용 제한 (usesLimit -> usageLimit)
    usageLimit: { type: Number, default: 100 },
    
    // 사용된 횟수
    usedCount: { type: Number, default: 0 },
    
    // 🔴 [수정] 상태 (active: boolean -> status: string)
    // 프론트엔드 드롭다운과 맞추기 위해 'active', 'inactive' 문자열로 저장
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', couponSchema);