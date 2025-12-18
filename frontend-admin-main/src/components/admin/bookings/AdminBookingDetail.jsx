import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../common/StatusBadge";
import { adminBookingApi } from "../../../api/adminBookingApi";
import ConfirmDialog from "../../common/ConfirmDialog";

const AdminBookingDetail = ({ booking }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  if (!booking) {
    return (
      <div className="table-empty-state">
        <p>예약 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  const calculateNights = () => {
    if (!booking.checkIn || !booking.checkOut) return "-";
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}박`;
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "대기",
      confirmed: "확정",
      cancelled: "취소",
      completed: "완료",
    };
    return statusMap[status] || status;
  };

  const getAvailableStatuses = () => {
    const statusFlow = {
      pending: ["confirmed"],
      confirmed: ["completed"],
    };
    return statusFlow[booking.status] || [];
  };

  const handleStatusChange = async () => {
    if (!newStatus) return;

    try {
      setLoading(true);
      await adminBookingApi.updateBookingStatus(booking.id, newStatus);
      alert("상태가 변경되었습니다.");
      window.location.reload();
    } catch (err) {
      alert(err.message || "상태 변경에 실패했습니다.");
    } finally {
      setLoading(false);
      setShowStatusDialog(false);
      setNewStatus("");
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      alert("취소 사유를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      await adminBookingApi.cancelBooking(booking.id, cancelReason);
      alert("예약이 취소되었습니다.");
      window.location.reload();
    } catch (err) {
      alert(err.message || "취소에 실패했습니다.");
    } finally {
      setLoading(false);
      setShowCancelDialog(false);
      setCancelReason("");
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await adminBookingApi.deleteBooking(booking.id);
      alert("예약이 삭제되었습니다.");
      navigate("/admin/bookings");
    } catch (err) {
      alert(err.message || "삭제에 실패했습니다.");
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const openStatusDialog = (status) => {
    setNewStatus(status);
    setShowStatusDialog(true);
  };

  return (
    <div className="admin-booking-detail">
      {/* 예약 정보 섹션 */}
      <div className="admin-form-container">
        <div className="detail-section">
          <h3 className="form-section-title">예약 정보</h3>

          <div className="detail-row">
            <div className="label">예약번호</div>
            <div className="value">#{booking.id}</div>
          </div>

          <div className="detail-row">
            <div className="label">호텔명</div>
            <div className="value">{booking.hotelName || "-"}</div>
          </div>

          <div className="detail-row">
            <div className="label">상태</div>
            <div className="value">
              <StatusBadge status={booking.status} type="booking" />
            </div>
          </div>

          <div className="detail-row">
            <div className="label">예약일</div>
            <div className="value">{formatDate(booking.createdAt)}</div>
          </div>
        </div>
      </div>

      {/* 고객 정보 섹션 */}
      <div className="admin-form-container">
        <div className="detail-section">
          <h3 className="form-section-title">고객 정보</h3>

          <div className="detail-row">
            <div className="label">고객명</div>
            <div className="value">{booking.userName || "-"}</div>
          </div>

          <div className="detail-row">
            <div className="label">이메일</div>
            <div className="value">{booking.userEmail || "-"}</div>
          </div>
        </div>
      </div>

      {/* 숙박 정보 섹션 */}
      <div className="admin-form-container">
        <div className="detail-section">
          <h3 className="form-section-title">숙박 정보</h3>

          <div className="detail-row">
            <div className="label">체크인</div>
            <div className="value">{formatDateOnly(booking.checkIn)}</div>
          </div>

          <div className="detail-row">
            <div className="label">체크아웃</div>
            <div className="value">{formatDateOnly(booking.checkOut)}</div>
          </div>

          <div className="detail-row">
            <div className="label">숙박일수</div>
            <div className="value">{calculateNights()}</div>
          </div>

          <div className="detail-row">
            <div className="label">인원</div>
            <div className="value">
              {booking.guests
                ? `성인 ${booking.guests.adults || 0}명, 아동 ${
                    booking.guests.children || 0
                  }명`
                : "-"}
            </div>
          </div>
        </div>
      </div>

      {/* 결제 정보 섹션 */}
      <div className="admin-form-container">
        <div className="detail-section">
          <h3 className="form-section-title">결제 정보</h3>

          <div className="detail-row">
            <div className="label">예약 금액</div>
            <div className="value" style={{ fontSize: "1.25rem", fontWeight: 600, color: "#14b8a6" }}>
              {formatCurrency(booking.amount)}
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼 섹션 */}
      <div className="admin-form-container">
        <div className="form-section">
          <h3 className="form-section-title">작업</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* 상태 변경 버튼들 */}
            {getAvailableStatuses().length > 0 && (
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 500,
                  }}
                >
                  상태 변경
                </label>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {getAvailableStatuses().map((status) => (
                    <button
                      key={status}
                      className="btn btn-primary"
                      onClick={() => openStatusDialog(status)}
                      disabled={loading}
                    >
                      {getStatusLabel(status)}로 변경
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 취소 버튼 */}
            {booking.status !== "cancelled" &&
              booking.status !== "completed" && (
                <div>
                  <button
                    className="btn btn-warning"
                    onClick={() => setShowCancelDialog(true)}
                    disabled={loading}
                  >
                    예약 취소
                  </button>
                </div>
              )}

            {/* 삭제 버튼 */}
            <div>
              <button
                className="btn btn-danger"
                onClick={() => setShowDeleteDialog(true)}
                disabled={loading}
              >
                예약 삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 상태 변경 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showStatusDialog}
        title="상태 변경 확인"
        message={`예약 상태를 "${getStatusLabel(newStatus)}"로 변경하시겠습니까?`}
        onConfirm={handleStatusChange}
        onCancel={() => {
          setShowStatusDialog(false);
          setNewStatus("");
        }}
      />

      {/* 취소 확인 다이얼로그 */}
      {showCancelDialog && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "500px" }}>
            <h3>예약 취소</h3>
            <p style={{ marginBottom: "1rem" }}>
              예약을 취소하시겠습니까? 취소 사유를 입력해주세요.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="취소 사유를 입력하세요"
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "0.875rem",
                marginBottom: "1rem",
                resize: "vertical",
              }}
            />
            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowCancelDialog(false);
                  setCancelReason("");
                }}
                className="btn btn-outline"
                disabled={loading}
              >
                취소
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-warning"
                disabled={loading || !cancelReason.trim()}
              >
                {loading ? "처리 중..." : "예약 취소"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="예약 삭제 확인"
        message={`정말 예약번호 #${booking.id}를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default AdminBookingDetail;