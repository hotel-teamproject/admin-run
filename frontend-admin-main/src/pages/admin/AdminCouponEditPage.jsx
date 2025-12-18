import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminCouponApi } from '../../api/adminCouponApi'; 
import Loader from '../../components/common/Loader';

const AdminCouponEditPage = () => {
  const { couponId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  
  // 폼 데이터 초기값
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    validFrom: '',
    validUntil: '',
    usageLimit: 0,
    status: 'active' // 기본값
  });

  // 날짜 변환 함수 (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        setLoading(true);
        // API 호출
        const response = await adminCouponApi.getCouponById(couponId);
        
        // 데이터 구조 처리 (data.data 또는 data)
        const coupon = response.data || response;

        // 받아온 데이터로 폼 채우기
        setFormData({
            name: coupon.name || '',
            code: coupon.code || '',
            discountType: coupon.discountType || 'percentage',
            // 🔴 [핵심] 백엔드랑 이름 맞춤 (discountValue)
            discountValue: coupon.discountValue || 0, 
            validFrom: formatDate(coupon.validFrom),
            validUntil: formatDate(coupon.validUntil),
            usageLimit: coupon.usageLimit || 0,
            status: coupon.status || 'active'
        });
      } catch (error) {
        console.error(error);
        alert("데이터를 불러오지 못했습니다.");
        navigate('/admin/coupons');
      } finally {
        setLoading(false);
      }
    };

    if (couponId) fetchCoupon();
  }, [couponId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminCouponApi.updateCoupon(couponId, formData);
      alert("수정되었습니다!");
      navigate('/admin/coupons');
    } catch (error) {
      alert("수정 실패: " + error.message);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>쿠폰 수정</h2>
      
      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 쿠폰명 */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>쿠폰명</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required 
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
            </div>

            {/* 코드 (수정불가) */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>쿠폰 코드</label>
              <input type="text" name="code" value={formData.code} readOnly 
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', background: '#f3f4f6' }} />
            </div>

            {/* 할인 설정 */}
            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>할인 타입</label>
                    <select name="discountType" value={formData.discountType} onChange={handleChange} 
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
                        <option value="percentage">퍼센트(%)</option>
                        <option value="amount">금액(원)</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>할인 값</label>
                    <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} required 
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
            </div>

            {/* 기간 설정 */}
            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>시작일</label>
                    <input type="date" name="validFrom" value={formData.validFrom} onChange={handleChange} required 
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>종료일</label>
                    <input type="date" name="validUntil" value={formData.validUntil} onChange={handleChange} required 
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
            </div>

            {/* 제한 및 상태 */}
            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>발행량</label>
                    <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleChange} required 
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
                
                {/* 🟢 [상태 변경] 여기서 '활성'을 선택하면 됩니다! */}
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>상태</label>
                    <select name="status" value={formData.status} onChange={handleChange} 
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
                        <option value="active">활성 (Active)</option>
                        <option value="inactive">비활성 (Inactive)</option>
                    </select>
                </div>
            </div>

            {/* 버튼 */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => navigate('/admin/coupons')} 
                    style={{ padding: '10px 20px', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}>취소</button>
                <button type="submit" 
                    style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>수정 저장</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCouponEditPage;