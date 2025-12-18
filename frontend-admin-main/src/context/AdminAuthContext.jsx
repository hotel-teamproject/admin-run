import { createContext, useState, useEffect } from "react";
import adminAuthApi from "../api/adminAuthApi";

export const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (token) {
        const data = await adminAuthApi.getMyInfo();
        // 🟢 [수정] 백엔드에서 받은 데이터 중 'user' 정보만 쏙 빼서 저장해야 합니다.
        // (data 전체를 넣으면 { success: true, user: {...} } 형태라 화면에서 깨짐)
        setAdminInfo(data.user || data);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("adminToken");
      setAdminInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const data = await adminAuthApi.login(credentials);
    localStorage.setItem("adminToken", data.token);
    // 🟢 [확인] 여기는 data.user로 아주 잘 하셨습니다!
    setAdminInfo(data.user || data);
  };

  const logout = async () => {
    try {
      await adminAuthApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminToken");
      setAdminInfo(null);
      // 강제로 로그인 페이지로 이동 (깔끔한 초기화)
      window.location.href = "/admin/login";
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{ adminInfo, loading, login, logout, checkAuth }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;