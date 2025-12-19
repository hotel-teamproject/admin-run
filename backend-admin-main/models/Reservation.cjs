const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roomType: String,
    guestName: String,
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: Number,
    amount: Number, 
    status: { 
        type: String, 
        // ▼ [수정] '대기' 상태가 보여서 추가했습니다. (DB와 코드의 싱크 맞춤)
        enum: ['pending', 'confirmed', 'cancelled', 'completed', '예약확정', '완료', '취소', '대기'], 
        default: 'pending' 
    }
}, { 
    timestamps: true,
    // ▼ [핵심] init-data는 데이터를 'bookings'라는 이름으로 저장했으므로 반드시 맞춰야 합니다.
    collection: 'bookings' 
});

module.exports = mongoose.model('Reservation', reservationSchema);