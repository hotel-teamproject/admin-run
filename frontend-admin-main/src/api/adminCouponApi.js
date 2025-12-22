import axiosClient from "./axiosClient";

/**
 * 서버 데이터를 UI 형식으로 변환 (Mapping)
 * DB: validFrom, validUntil, status -> UI: startDate, endDate, isActive
 */
const transformToUI = (coupon) => {
  if (!coupon) return null;
  return {
    ...coupon,
    id: coupon._id || coupon.id,
    startDate: coupon.validFrom || coupon.startDate,
    endDate: coupon.validUntil || coupon.endDate,
    isActive: coupon.status === "active" || coupon.isActive === true,
    discountType: coupon.discountType === "amount" ? "fixed" : coupon.discountType
  };
};

export const adminCouponApi = {
  getCoupons: async (params) => {
    const response = await axiosClient.get("/admin/coupons", { params });
    if (response.data?.data?.coupons) {
      response.data.data.coupons = response.data.data.coupons.map(transformToUI);
    }
    return response;
  },

  getCouponById: async (id) => {
    const response = await axiosClient.get(`/admin/coupons/${id}`);
    if (response.data?.data) {
      response.data.data = transformToUI(response.data.data);
    }
    return response;
  },

  createCoupon: (data) => {
    return axiosClient.post("/admin/coupons", data);
  },

  updateCoupon: (id, data) => {
    return axiosClient.put(`/admin/coupons/${id}`, data);
  },

  deleteCoupon: (id) => {
    return axiosClient.delete(`/admin/coupons/${id}`);
  },
};

export default adminCouponApi;