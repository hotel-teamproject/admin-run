import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../common/StatusBadge";
import { adminUserApi } from "../../../api/adminUserApi";
import ConfirmDialog from "../../common/ConfirmDialog";

const AdminUserDetail = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  if (!user) {
    return (
      <div className="table-empty-state">
        <p>사용자 정보를 불러올 수 없습니다.</p>
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

  const getRoleLabel = (role) => {
    const roleMap = {
      admin: "관리자",
      business: "사업자",
      user: "일반 사용자",
    };
    return roleMap[role] || role;
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      active: "활성",
      inactive: "비활성",
      suspended: "정지",
    };
    return statusMap[status] || status;
  };

  const getAvailableStatuses = () => {
    const allStatuses = ["active", "inactive", "suspended"];
    return allStatuses.filter((status) => status !== user.status);
  };

  const handleStatusChange = async () => {
    if (!newStatus) return;

    try {
      setLoading(true);
      await adminUserApi.updateUserStatus(user.id, newStatus);
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

  const handleDelete = async () => {
    try {
      setLoading(true);
      await adminUserApi.deleteUser(user.id);
      alert("사용자가 삭제되었습니다.");
      navigate("/admin/users");
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
    <div className="admin-user-detail">
      {/* 기본 정보 섹션 */}
      <div className="admin-form-container">
        <div className="detail-section">
          <h3 className="form-section-title">기본 정보</h3>

          <div className="detail-row">
            <div className="label">사용자 ID</div>
            <div className="value">#{user.id}</div>
          </div>

          <div className="detail-row">
            <div className="label">이름</div>
            <div className="value">{user.name || "-"}</div>
          </div>

          <div className="detail-row">
            <div className="label">이메일</div>
            <div className="value">{user.email || "-"}</div>
          </div>

          <div className="detail-row">
            <div className="label">전화번호</div>
            <div className="value">{user.phone || "-"}</div>
          </div>

          <div className="detail-row">
            <div className="label">역할</div>
            <div className="value">
              <span className="badge badge-info">{getRoleLabel(user.role)}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="label">상태</div>
            <div className="value">
              <StatusBadge status={user.status} type="user" />
            </div>
          </div>

          <div className="detail-row">
            <div className="label">가입일</div>
            <div className="value">{formatDate(user.createdAt)}</div>
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
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                  상태 변경
                </label>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {getAvailableStatuses().map((status) => (
                    <button
                      key={status}
                      className="btn btn-outline"
                      onClick={() => openStatusDialog(status)}
                      disabled={loading}
                    >
                      {getStatusLabel(status)}로 변경
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 삭제 버튼 */}
            <div>
              <button
                className="btn btn-danger"
                onClick={() => setShowDeleteDialog(true)}
                disabled={loading}
              >
                사용자 삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 상태 변경 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showStatusDialog}
        title="상태 변경 확인"
        message={`사용자 상태를 "${getStatusLabel(newStatus)}"로 변경하시겠습니까?`}
        onConfirm={handleStatusChange}
        onCancel={() => {
          setShowStatusDialog(false);
          setNewStatus("");
        }}
      />

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="사용자 삭제 확인"
        message={`정말 "${user.name}" 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default AdminUserDetail;