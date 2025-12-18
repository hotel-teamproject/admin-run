import axiosClient from "./axiosClient";
import { mockAuthApi } from "./mockApi";

// Mock API 사용 여부 (개발 중에는 true로 설정)
const USE_MOCK = false;

export const adminAuthApi = {
  // 로그인
  login: (credentials) => {
    if (USE_MOCK) return mockAuthApi.login(credentials);
    return axiosClient.post("/auth/login", credentials);
  },

  // 로그아웃
  logout: () => {
    if (USE_MOCK) return mockAuthApi.logout();
    return axiosClient.post("/auth/logout");
  },

  // 내 정보 조회
  getMyInfo: () => {
    if (USE_MOCK) return mockAuthApi.getMyInfo();
    return axiosClient.get("/auth/me");
  },

  // 비밀번호 변경
  changePassword: (data) => {
    if (USE_MOCK) return mockAuthApi.changePassword(data);
    return axiosClient.put("/auth/password", data);
  },

  // 비밀번호 재설정 요청
  forgotPassword: (email) => {
    if (USE_MOCK) return mockAuthApi.forgotPassword(email);
    return axiosClient.post("/auth/forgot-password", { email });
  },
};

export default adminAuthApi;
