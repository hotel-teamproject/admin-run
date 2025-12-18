import axiosClient from "./axiosClient";

export const adminHotelApi = {
  // 호텔 목록 조회
  getHotels: (params) => {
    return axiosClient.get("/admin/hotels", { params });
  },

  // 호텔 상세 조회
  getHotelById: (hotelId) => {
    return axiosClient.get(`/admin/hotels/${hotelId}`);
  },

  // 호텔 등록
  createHotel: (data) => {
    return axiosClient.post("/admin/hotels", data);
  },

  // 호텔 수정
  updateHotel: (hotelId, data) => {
    return axiosClient.put(`/admin/hotels/${hotelId}`, data);
  },

  // 호텔 삭제
  deleteHotel: (hotelId) => {
    return axiosClient.delete(`/admin/hotels/${hotelId}`);
  },
  
  // (필요 시) 승인 관련 기능이 백엔드에 없다면 일단 주석 처리하거나 
  // 백엔드에 해당 라우트를 추가해야 에러가 안 납니다.
  /*
  approveHotel: (hotelId) => {
    return axiosClient.post(`/admin/hotels/${hotelId}/approve`);
  },
  rejectHotel: (hotelId, reason) => {
    return axiosClient.post(`/admin/hotels/${hotelId}/reject`, { reason });
  },
  */
};

export default adminHotelApi;