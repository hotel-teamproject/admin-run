import axiosClient from "./axiosClient";

export const adminCouponApi = {
  // 1. 목록 조회
  getCoupons: (params) => {
    return axiosClient.get("/admin/coupons", { params });
  },

  // 🟢 [추가됨] 상세 조회 (이게 없어서 에러가 났던 것입니다!)
  getCouponById: (id) => {
    return axiosClient.get(`/admin/coupons/${id}`);
  },

  // 3. 생성
  createCoupon: (data) => {
    return axiosClient.post("/admin/coupons", data);
  },

  // 4. 수정
  updateCoupon: (id, data) => {
    return axiosClient.put(`/admin/coupons/${id}`, data);
  },

  // 5. 삭제
  deleteCoupon: (id) => {
    return axiosClient.delete(`/admin/coupons/${id}`);
  },
};

export default adminCouponApi;