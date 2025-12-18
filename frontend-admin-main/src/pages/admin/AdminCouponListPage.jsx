import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminCouponTable from "../../components/admin/coupons/AdminCouponTable";
import { adminCouponApi } from "../../api/adminCouponApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminCouponListPage = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await adminCouponApi.getCoupons();
      console.log("쿠폰 데이터:", data);

      // 🟢 [수정됨] 백엔드가 배열을 주든 객체를 주든 알아서 처리
      if (Array.isArray(data)) {
        setCoupons(data);
      } else if (data && Array.isArray(data.coupons)) {
        setCoupons(data.coupons);
      } else if (data && Array.isArray(data.data)) {
        setCoupons(data.data);
      } else {
        setCoupons([]);
      }
    } catch (err) {
      console.error(err);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (couponId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await adminCouponApi.deleteCoupon(couponId);
      fetchCoupons(); // 목록 새로고침
    } catch (err) {
      alert("삭제에 실패했습니다: " + err.message);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCoupons} />;

  return (
    <div className="admin-coupon-list-page" style={{ padding: '20px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>쿠폰 관리</h1>
        <button
          onClick={() => navigate("/admin/coupons/new")}
          className="btn btn-primary"
          style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + 쿠폰 생성
        </button>
      </div>

      <AdminCouponTable coupons={coupons} onDelete={handleDelete} />
    </div>
  );
};

export default AdminCouponListPage;