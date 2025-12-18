import axiosClient from "./axiosClient";
import { mockBookingApi } from "./mockApi";

const USE_MOCK = false;

export const adminBookingApi = {
  // 예약 목록 조회
  getBookings: (params) => {
    if (USE_MOCK) return mockBookingApi.getBookings(params);
    return axiosClient.get("/admin/bookings", { params });
  },

  // 예약 상세 조회
  getBookingById: (bookingId) => {
    if (USE_MOCK) return mockBookingApi.getBookingById(bookingId);
    return axiosClient.get(`/admin/bookings/${bookingId}`);
  },

  // 예약 상태 변경
  updateBookingStatus: (bookingId, status) => {
    if (USE_MOCK) return mockBookingApi.updateBookingStatus(bookingId, status);
    return axiosClient.put(`/admin/bookings/${bookingId}/status`, { status });
  },

  // 예약 취소
  cancelBooking: (bookingId, reason) => {
    if (USE_MOCK) return mockBookingApi.cancelBooking(bookingId, reason);
    return axiosClient.post(`/admin/bookings/${bookingId}/cancel`, { reason });
  },

  // 예약 삭제
  deleteBooking: (bookingId) => {
    if (USE_MOCK) return mockBookingApi.deleteBooking(bookingId);
    return axiosClient.delete(`/admin/bookings/${bookingId}`);
  },
};

export default adminBookingApi;
