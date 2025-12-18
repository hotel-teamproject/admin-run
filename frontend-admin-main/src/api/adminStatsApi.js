import axiosClient from "./axiosClient";
import { mockStatsApi } from "./mockApi";

// 🟢 [수정] 가짜 데이터 끄기
const USE_MOCK = false;

export const adminStatsApi = {
  // 대시보드 통계 조회
  getDashboardStats: () => {
    if (USE_MOCK) return mockStatsApi.getDashboardStats();
    // 🟢 [수정] 백엔드 경로에 맞게 수정 (/admin/stats/dashboard -> /dashboard/overview)
    return axiosClient.get("/dashboard/overview");
  },

  // 매출 통계 조회
  getRevenueStats: (params) => {
    if (USE_MOCK) return mockStatsApi.getRevenueStats(params);
    // 🟢 [수정]
    return axiosClient.get("/dashboard/revenue", { params });
  },

  // 예약 통계 조회 (백엔드에 최근 예약 기능이 있으므로 연결)
  getBookingStats: (params) => {
    if (USE_MOCK) return mockStatsApi.getBookingStats(params);
    return axiosClient.get("/dashboard/recent-bookings", { params });
  },

  // 사용자 통계 (백엔드 미구현 시 에러 방지를 위해 일단 둡니다)
  getUserStats: (params) => {
    if (USE_MOCK) return mockStatsApi.getUserStats(params);
    return axiosClient.get("/admin/users", { params }); // 임시 연결
  },

  // 호텔 통계
  getHotelStats: (params) => {
    if (USE_MOCK) return mockStatsApi.getHotelStats(params);
    return axiosClient.get("/admin/hotels", { params }); // 임시 연결
  },
};

export default adminStatsApi;