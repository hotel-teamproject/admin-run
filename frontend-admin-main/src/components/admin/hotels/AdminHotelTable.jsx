import React from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../../common/StatusBadge'

const AdminHotelTable = ({ hotels = [], onApprove, onReject, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  if (hotels.length === 0) {
    return (
      <div className="table-empty-state">
        <p>등록된 호텔이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-container mobile-card-view">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>호텔명</th>
            <th>주소</th>
            <th>등급</th>
            <th>가격</th>
            <th>상태</th>
            <th>등록일</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            /* 1. key 값 변경: hotel.id -> hotel._id */
            <tr key={hotel._id}>
              {/* 2. 화면 표시용 ID 변경 */}
              <td data-label="ID" title={hotel._id}>#{hotel._id.slice(-6)}</td>
              <td data-label="호텔명">
                <button
                  className="link-button"
                  /* 3. 상세 페이지 이동 링크 변경 */
                  onClick={() => navigate(`/admin/hotels/${hotel._id}`)}
                >
                  {hotel.name || '-'}
                </button>
              </td>
              <td data-label="주소">{hotel.address || '-'}</td>
              <td data-label="등급">
                {hotel.rating
                  ? '⭐'.repeat(Math.floor(hotel.rating))
                  : '-'}
              </td>
              <td data-label="가격">{formatCurrency(hotel.price)}</td>
              <td data-label="상태">
                <StatusBadge status={hotel.status} type="hotel" />
              </td>
              <td data-label="등록일">{formatDate(hotel.createdAt)}</td>
              <td data-label="작업">
                <div className="table-actions">
                  {hotel.status === 'pending' && (
                    <>
                      <button
                        className="btn btn-sm btn-success"
                        /* 4. 승인 버튼 핸들러 변경 */
                        onClick={() => onApprove(hotel._id)}
                        title="승인"
                      >
                        승인
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        /* 5. 거부 버튼 핸들러 변경 */
                        onClick={() => onReject(hotel._id)}
                        title="거부"
                      >
                        거부
                      </button>
                    </>
                  )}
                  {(hotel.status === 'approved' || hotel.status === 'active' || hotel.status === 'inactive') && (
                    <button
                      className="btn btn-sm btn-secondary"
                      /* 6. 수정 버튼 핸들러 변경 (여기가 핵심 문제입니다!) */
                      onClick={() => navigate(`/admin/hotels/${hotel._id}/edit`)}
                      title="수정"
                    >
                      수정
                    </button>
                  )}
                  {hotel.status !== 'pending' && (
                    <button
                      className="btn btn-sm btn-danger"
                      /* 7. 삭제 버튼 핸들러 변경 */
                      onClick={() => onDelete(hotel._id)}
                      title="삭제"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHotelTable