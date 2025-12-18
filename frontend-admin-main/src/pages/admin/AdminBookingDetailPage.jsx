import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminBookingDetail from "../../components/admin/bookings/AdminBookingDetail"; // 경로 확인 필요
import { adminBookingApi } from "../../api/adminBookingApi"; // 경로 확인 필요
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminBookingDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log(`📡 예약 상세 요청: ${bookingId}`);
      const response = await adminBookingApi.getBookingById(bookingId);
      console.log("✅ 예약 상세 응답:", response);

      // 백엔드 응답 구조 처리 ({ success: true, data: { ... } } 또는 바로 객체)
      if (response && response.data) {
          setBooking(response.data);
      } else {
          setBooking(response);
      }

    } catch (err) {
      console.error(err);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchBooking} />;
  if (!booking) return <div style={{ padding: '20px', textAlign: 'center' }}>데이터가 없습니다.</div>;

  return (
    <div className="admin-booking-detail-page" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>예약 상세</h1>
        <button
          onClick={() => navigate("/admin/bookings")}
          className="btn btn-outline"
          style={{ padding: '8px 16px', background: 'white', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
        >
          목록으로
        </button>
      </div>

      <AdminBookingDetail booking={booking} />
    </div>
  );
};

export default AdminBookingDetailPage;