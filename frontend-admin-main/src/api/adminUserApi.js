import axiosClient from "./axiosClient";

export const adminUserApi = {
  // 목록
  getUsers: (params) => {
    return axiosClient.get("/admin/users", { params });
  },
  // 상세
  getUserById: (userId) => {
    return axiosClient.get(`/admin/users/${userId}`);
  },
  // 수정
  updateUser: (userId, data) => {
    return axiosClient.put(`/admin/users/${userId}`, data);
  },
  // [중요] 삭제 (DELETE /admin/users/:id)
  deleteUser: (userId) => {
    return axiosClient.delete(`/admin/users/${userId}`);
  },
  // [중요] 상태 변경 (PUT /admin/users/:id/status)
  updateUserStatus: (userId, status) => {
    return axiosClient.put(`/admin/users/${userId}/status`, { status });
  },
  // 사업자
  getBusinessUsers: (params) => {
    return axiosClient.get("/admin/users/business", { params });
  },
};

export default adminUserApi;