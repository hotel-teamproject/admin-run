const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../shared/utils/response.cjs');

// Booking 모델 초기화 (기존 코드 유지)
let Booking;
if (mongoose.models.Booking) {
    Booking = mongoose.models.Booking;
} else {
    const bookingSchema = new mongoose.Schema({}, { strict: false });
    Booking = mongoose.model("Booking", bookingSchema);
}

// 1. 모든 예약 목록 가져오기
exports.getAllReservations = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, status, dateFrom, dateTo } = req.query;
        const query = {};

        // 검색 필터
        if (search) {
            query.$or = [
                { hotelName: { $regex: search, $options: 'i' } },
                { userName: { $regex: search, $options: 'i' } },
                { userEmail: { $regex: search, $options: 'i' } }
            ];
        }

        // 상태 필터
        if (status && status !== '전체') {
            query.status = status;
        }

        // 날짜 필터
        if (dateFrom) {
            query.createdAt = { ...query.createdAt, $gte: new Date(dateFrom) };
        }
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            query.createdAt = { ...query.createdAt, $lte: toDate };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Booking.countDocuments(query);
        const totalPages = Math.ceil(total / parseInt(limit));

        // 프론트엔드 포맷 맞춤
        const formattedBookings = bookings.map((booking) => ({
            ...booking,
            id: booking._id.toString(), // _id를 id로 변환
        }));

        return res.json(successResponse('예약 목록 조회 성공', {
            bookings: formattedBookings,
            totalPages,
            currentPage: parseInt(page),
            total
        }));
    } catch (error) {
        console.error('reservation.getAllReservations error', error);
        return res.status(500).json(errorResponse('예약 목록 조회 실패', error, 500));
    }
};

// 2. [추가됨] 예약 상세 조회 (이게 없어서 에러가 났습니다!)
exports.getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).lean();

        if (!booking) {
            return res.status(404).json(errorResponse('예약 정보를 찾을 수 없습니다', null, 404));
        }

        // _id -> id 변환
        const formattedBooking = {
            ...booking,
            id: booking._id.toString()
        };

        return res.json(successResponse('예약 상세 조회 성공', formattedBooking));
    } catch (error) {
        console.error('reservation.getReservationById error', error);
        return res.status(500).json(errorResponse('예약 상세 조회 실패', error, 500));
    }
};

// 3. 예약 상태 변경하기
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json(errorResponse('예약을 찾을 수 없습니다', null, 404));
        }

        return res.json(successResponse('예약 상태 변경 성공', updatedBooking));
    } catch (error) {
        console.error('reservation.updateStatus error', error);
        return res.status(500).json(errorResponse('상태 변경 실패', error, 500));
    }
};

// 4. [필요시] 예약 삭제 (취소)
exports.deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        await Booking.findByIdAndDelete(id);
        return res.json(successResponse('예약 삭제 성공'));
    } catch (error) {
        return res.status(500).json(errorResponse('삭제 실패', error, 500));
    }
};