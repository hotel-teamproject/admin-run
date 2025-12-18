import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminCouponApi } from '../../api/adminCouponApi';
import Loader from '../../components/common/Loader';

const AdminCouponDetailPage = () => {
  const { couponId } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        setLoading(true);
        const response = await adminCouponApi.getCouponById(couponId);
        // 백엔드 응답이 { data: ... } 형태일 수도 있고 바로 객체일 수도 있음
        setCoupon(response.data || response); 
      } catch (error) {
        console.error(error);
        alert("쿠폰 정보를 불러오지 못했습니다.");
        navigate('/admin/coupons');
      } finally {
        setLoading(false);
      }
    };
    fetchCoupon();
  }, [couponId, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("정말 이 쿠폰을 삭제하시겠습니까?")) return;
    try {
      await adminCouponApi.deleteCoupon(couponId);
      alert("삭제되었습니다.");
      navigate('/admin/coupons');
    } catch (err) {
      alert("삭제 실패");
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!coupon) return <div>데이터가 없습니다.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>쿠폰 상세 정보</h2>
        <button onClick={() => navigate('/admin/coupons')} style={{ padding: '8px 16px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
          목록으로
        </button>
      </div>

      {/* 상세 카드 */}
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>쿠폰명</label>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>{coupon.name}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>쿠폰 코드</label>
            <div style={{ fontSize: '18px', fontFamily: 'monospace', background: '#f1f5f9', display: 'inline-block', padding: '4px 10px', borderRadius: '4px' }}>
              {coupon.code}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>할인 혜택</label>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
               {coupon.discountType === 'percentage' ? `${coupon.discountValue}% 할인` : `${coupon.discountValue}원 할인`}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>상태</label>
            <div>
              {coupon.status === 'active' 
                ? <span style={{ color: 'green', fontWeight: 'bold', background: '#dcfce7', padding: '4px 10px', borderRadius: '20px' }}>활성</span> 
                : <span style={{ color: 'gray', background: '#f3f4f6', padding: '4px 10px', borderRadius: '20px' }}>비활성</span>}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>유효 기간</label>
            <div style={{ fontSize: '16px' }}>
              {new Date(coupon.validFrom).toLocaleDateString()} ~ {new Date(coupon.validUntil).toLocaleDateString()}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>사용 현황</label>
            <div style={{ fontSize: '16px' }}>
              {coupon.usedCount} / {coupon.usageLimit} 매 사용됨
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
          <button 
            onClick={() => navigate(`/admin/coupons/${couponId}/edit`)} // 수정 페이지로 이동
            style={{ padding: '10px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            수정하기
          </button>
          <button 
            onClick={handleDelete} 
            style={{ padding: '10px 24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            삭제하기
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminCouponDetailPage;