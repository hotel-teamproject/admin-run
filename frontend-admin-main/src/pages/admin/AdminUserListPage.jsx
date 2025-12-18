import { useState, useEffect } from "react";
import AdminUserFilter from "../../components/admin/users/AdminUserFilter";
import AdminUserTable from "../../components/admin/users/AdminUserTable"; // 테이블 컴포넌트 경로 확인
import Pagination from "../../components/common/Pagination";
import { adminUserApi } from "../../api/adminUserApi"; // API 경로 확인
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminUserListPage = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filters]);

  // 🔴 [수정된 핵심 부분]
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(""); // 에러 초기화

      const data = await adminUserApi.getUsers({
        ...filters,
        page: currentPage,
      });

      console.log("🔥 받아온 데이터 확인:", data); // F12 콘솔에서 확인용

      // 1. 백엔드가 배열을 바로 줄 경우 (현재 상황)
      if (Array.isArray(data)) {
        setUsers(data);
        setTotalPages(1); // 아직 페이지네이션 기능이 백엔드에 없으므로 1로 고정
      } 
      // 2. 백엔드가 { users: [...], totalPages: 5 } 형태로 줄 경우 (나중을 대비)
      else if (data && Array.isArray(data.users)) {
        setUsers(data.users);
        setTotalPages(data.totalPages || 1);
      } 
      // 3. 그 외 (데이터 없음)
      else {
        console.warn("데이터 형식이 배열이 아닙니다:", data);
        setUsers([]);
      }

    } catch (err) {
      console.error("데이터 로딩 실패:", err);
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleStatusChange = async (userId, status) => {
    try {
      await adminUserApi.updateUserStatus(userId, status);
      alert("상태가 변경되었습니다.");
      fetchUsers(); // 목록 새로고침
    } catch (err) {
      alert(err.message || "상태 변경에 실패했습니다.");
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("정말 삭제하시겠습니까? (복구 불가)")) return;

    try {
      await adminUserApi.deleteUser(userId);
      alert("삭제되었습니다.");
      fetchUsers(); // 목록 새로고침
    } catch (err) {
      alert(err.message || "삭제에 실패했습니다.");
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchUsers} />;

  return (
    <div className="admin-user-list-page" style={{ padding: '20px' }}>
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>회원 관리</h1>
        <p style={{ color: '#666' }}>총 {users.length}명의 회원이 있습니다.</p>
      </div>

      {/* 필터 컴포넌트가 있다면 표시 */}
      {AdminUserFilter && (
        <AdminUserFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
      )}

      <AdminUserTable
        users={users}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminUserListPage;