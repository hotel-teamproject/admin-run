import axios from "axios";

const axiosClient = axios.create({
  // 🔴 [수정 완료] 
  // http://localhost:5000 을 지우고 '/api'만 남깁니다.
  // 이렇게 해야 vite.config.js의 proxy 설정을 타고 백엔드로 연결됩니다.
  baseURL: "/api", 
  
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosClient.interceptors.response.use(
  (response) => {
    // 1. 백엔드가 { success: true, data: [...] } 로 줄 때
    if (response.data && response.data.data) {
      return response.data.data;
    }
    // 2. 백엔드가 바로 배열 [...] 을 줄 때 (현재 작성하신 컨트롤러가 이 방식임)
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
    // 에러 메시지 추출
    const errorMessage = error.response?.data?.message || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosClient;