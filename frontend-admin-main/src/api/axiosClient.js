import axios from "axios";

// 환경에 따른 baseURL 설정
// 개발 환경: Vite proxy 사용 (/api)
// 배포 환경: nginx proxy 사용 (/api) 또는 직접 백엔드 URL
const getBaseURL = () => {
  // 환경 변수가 있으면 사용 (배포 환경)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // 개발 환경에서는 Vite proxy 사용
  return "/api";
};

const axiosClient = axios.create({
  baseURL: getBaseURL(),
  
  // 타임아웃 시간 증가 (배포 환경에서 네트워크 지연 대비)
  timeout: 30000, // 30초로 증가
  
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
    
    // 타임아웃 에러 처리
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return Promise.reject(new Error('요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.'));
    }
    
    // 네트워크 에러 처리
    if (error.message === 'Network Error' || !error.response) {
      return Promise.reject(new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.'));
    }
    
    // 에러 메시지 추출
    const errorMessage = error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.';
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosClient;