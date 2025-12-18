import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminCouponTable = ({ coupons = [], onDelete }) => {
  const navigate = useNavigate();

  if (!coupons || coupons.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>등록된 쿠폰이 없습니다.</div>;
  }

  return (
    <div className="table-container" style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f8f9fa' }}>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>쿠폰명</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>코드</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>할인</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>상태</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon._id || coupon.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px', color: '#666', fontSize: '13px' }}>
                #{coupon._id ? coupon._id.slice(-6) : (coupon.id ? coupon.id.slice(-6) : '')}
              </td>
              
              {/* 🟢 [1] 쿠폰명 클릭 -> 상세 페이지 이동 */}
              <td style={{ padding: '12px' }}>
                <span 
                  onClick={() => navigate(`/admin/coupons/${coupon._id || coupon.id}`)}
                  style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {coupon.name}
                </span>
              </td>

              <td style={{ padding: '12px' }}>
                <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px' }}>
                    {coupon.code}
                </span>
              </td>
              <td style={{ padding: '12px', color: '#2563eb', fontWeight: 'bold' }}>
                {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `${coupon.discountValue}원`}
              </td>
              <td style={{ padding: '12px' }}>
                 {coupon.status === 'active' 
                    ? <span style={{ color: 'green', fontWeight: 'bold', fontSize: '13px' }}>활성</span> 
                    : <span style={{ color: '#999', fontSize: '13px' }}>비활성</span>}
              </td>
              <td style={{ padding: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* 🟢 [2] 수정 버튼 -> 수정 페이지 이동 */}
                  <button 
                    onClick={() => navigate(`/admin/coupons/${coupon._id || coupon.id}/edit`)}
                    className="btn btn-sm btn-primary"
                    style={{ padding: '4px 8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    수정
                  </button>
                  <button 
                    onClick={() => onDelete(coupon._id || coupon.id)}
                    className="btn btn-sm btn-danger"
                    style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCouponTable;