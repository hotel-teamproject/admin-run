import axiosClient from "./axiosClient";

export const adminReviewApi = {
  // 1. 목록 조회 (GET /admin/reviews)
  getReviews: (params) => {
    return axiosClient.get("/admin/reviews", { params });
  },

  // 2. 삭제 (DELETE /admin/reviews/:id)
  deleteReview: (id) => {
    return axiosClient.delete(`/admin/reviews/${id}`);
  },

  // (필요하다면 유지) 상세 조회
  getReviewById: (id) => {
    if (!id) return Promise.reject(new Error("ID Required"));
    return axiosClient.get(`/admin/reviews/${id}`);
  },

  // (필요하다면 유지) 리뷰 작성
  createReview: (data) => {
    return axiosClient.post("/admin/reviews", data);
  },
};

export default adminReviewApi;