import { useState, useEffect } from "react";
import AdminReviewFilter from "../../components/admin/reviews/AdminReviewFilter"; // 경로 확인 필요
import AdminReviewTable from "../../components/admin/reviews/AdminReviewTable"; // 경로 확인 필요
import Pagination from "../../components/common/Pagination"; // 경로 확인 필요
import { adminReviewApi } from "../../api/adminReviewApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [currentPage, filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await adminReviewApi.getReviews({
        ...filters,
        page: currentPage,
      });

      console.log("🔥 [디버깅] 서버에서 받은 리뷰 데이터:", data);

      // 🟢 [핵심 수정] 데이터가 배열인지 객체인지 확인해서 처리
      if (Array.isArray(data)) {
        // 1. 백엔드가 바로 배열 [...] 을 줄 때 (현재 상태)
        setReviews(data);
        setTotalPages(1); 
      } else if (data && Array.isArray(data.reviews)) {
        // 2. 백엔드가 { reviews: [...], totalPages: 5 } 형태로 줄 때 (나중 대비)
        setReviews(data.reviews);
        setTotalPages(data.totalPages || 1);
      } else {
        // 3. 데이터가 없을 때
        setReviews([]);
      }

    } catch (err) {
      console.error("리뷰 로딩 에러:", err);
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

  const handleDelete = async (reviewId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await adminReviewApi.deleteReview(reviewId);
      alert("삭제되었습니다.");
      fetchReviews(); // 목록 새로고침
    } catch (err) {
      alert(err.message || "삭제에 실패했습니다.");
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchReviews} />;

  return (
    <div className="admin-review-list-page" style={{ padding: '20px' }}>
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>리뷰 관리</h1>
        <p style={{ color: '#666' }}>총 {reviews.length}개의 리뷰가 있습니다.</p>
      </div>

      {/* 필터 컴포넌트가 있다면 렌더링 */}
      {AdminReviewFilter && (
        <AdminReviewFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
      )}

      {/* 테이블 컴포넌트 */}
      <AdminReviewTable reviews={reviews} onDelete={handleDelete} />

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminReviewListPage;