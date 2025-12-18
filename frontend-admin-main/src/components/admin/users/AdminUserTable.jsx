import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../common/StatusBadge'; // 경로가 맞는지 확인해주세요

const AdminUserTable = ({ users = [], onStatusChange, onDelete }) => {
  const navigate = useNavigate();

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  // 변경 가능한 상태 옵션 (현재 상태 제외)
  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['active', 'inactive', 'suspended'];
    return allStatuses.filter((status) => status !== currentStatus);
  };

  // 상태 한글명 변환
  const getStatusLabel = (status) => {
    const statusMap = {
      active: '활성',
      inactive: '비활성',
      suspended: '정지',
    };
    return statusMap[status] || status;
  };

  // 데이터가 없을 때 표시
  if (!users || users.length === 0) {
    return (
      <div className="table-empty-state">
        <p>등록된 사용자가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>역할</th>
            <th>상태</th>
            <th>가입일</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const availableStatuses = getStatusOptions(user.status);
            
            return (
              <tr key={user._id}>
                {/* ID: 뒤 6자리만 표시 */}
                <td title={user._id}>#{user._id ? user._id.slice(-6) : '-'}</td>
                
                {/* 이름: 클릭 시 상세 페이지 이동 */}
                <td>
                  <button
                    className="link-button"
                    onClick={() => navigate(`/admin/users/${user._id}`)}
                    style={{ fontWeight: 'bold', color: '#2563eb' }}
                  >
                    {user.name || '-'}
                  </button>
                </td>
                
                {/* 이메일 & 전화번호 */}
                <td>{user.email || '-'}</td>
                <td>{user.phone || '-'}</td>
                
                {/* 역할 (DB 데이터: admin, user) */}
                <td>
                  {user.role === 'admin' && <span className="badge badge-purple">관리자</span>}
                  {user.role === 'user' && <span className="badge badge-gray">일반회원</span>}
                  {!['admin', 'user'].includes(user.role) && '-'}
                </td>
                
                {/* 상태 (DB 데이터: active, inactive, suspended) */}
                <td>
                  <StatusBadge status={user.status} type="user" />
                </td>
                
                {/* 가입일 */}
                <td>{formatDate(user.createdAt)}</td>
                
                {/* 작업 버튼 영역 */}
                <td>
                  <div className="table-actions">
                    {/* 상태 변경 드롭다운 */}
                    <select
                      className="status-select"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          onStatusChange(user._id, e.target.value);
                          e.target.value = ''; // 선택 초기화
                        }
                      }}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        marginRight: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">상태 변경</option>
                      {availableStatuses.map((status) => (
                        <option key={status} value={status}>
                          {getStatusLabel(status)}
                        </option>
                      ))}
                    </select>

                    {/* 상세 버튼 */}
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => navigate(`/admin/users/${user._id}`)}
                      title="상세보기"
                      style={{ marginRight: '4px' }}
                    >
                      상세
                    </button>

                    {/* 삭제 버튼 */}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(user._id)}
                      title="삭제"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserTable;