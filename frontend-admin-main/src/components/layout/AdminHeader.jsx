import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { adminInfo, logout } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="admin-header">
      <div className="admin-header-inner">
        <div className="header-left">
          <h2>관리자 대시보드</h2>
        </div>
        <div className="header-right">
          <span>{adminInfo?.name || "Admin"}</span>
          <button onClick={handleLogout} className="btn btn-outline">
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
