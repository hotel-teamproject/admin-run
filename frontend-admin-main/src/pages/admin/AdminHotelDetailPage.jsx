import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminHotelApi } from '../../api/adminHotelApi'; 
import Loader from '../../components/common/Loader';       
import ErrorMessage from '../../components/common/ErrorMessage'; 

const AdminHotelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelDetail = async () => {
      try {
        setLoading(true);
        const response = await adminHotelApi.getHotelById(id);
        
        // 데이터 구조 처리
        if (response.success && response.data) {
          setHotel(response.data);
        } else {
          setHotel(response.data || response); 
        }

      } catch (err) {
        console.error(err);
        setError("호텔 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHotelDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await adminHotelApi.deleteHotel(id);
      alert("삭제되었습니다.");
      navigate('/admin/hotels');
    } catch (err) {
      alert("삭제 실패");
    }
  };

  // 🟢 [추가됨] 별점을 아이콘으로 그려주는 함수
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} style={{ color: '#f59e0b' }}>★</span>); // 꽉 찬 별
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} style={{ color: '#f59e0b' }}>☆</span>); // 반 별 (여기선 비어있는 별로 대체)
      } else {
        stars.push(<span key={i} style={{ color: '#e2e8f0' }}>★</span>); // 회색 별
      }
    }
    return stars;
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!hotel) return <div>데이터가 없습니다.</div>;

  return (
    <div className="admin-detail-page" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>호텔 상세 정보</h2>
        <button 
          onClick={() => navigate('/admin/hotels')} 
          style={{ padding: '8px 16px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
        >
          목록으로
        </button>
      </div>

      <div className="detail-card" style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        
        {/* 이미지 영역 */}
        <div style={{ marginBottom: '30px', height: '400px', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            {hotel.imageUrl ? (
                <img src={hotel.imageUrl} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    <span style={{ fontSize: '48px', marginBottom: '10px' }}>🖼️</span>
                    <span>등록된 이미지가 없습니다</span>
                </div>
            )}
        </div>

        {/* 상세 정보 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>호텔명</label>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e293b' }}>{hotel.name}</div>
            </div>
            
            <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>호텔 등급</label>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#334155' }}>
                    {hotel.class ? <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>{hotel.class}성급</span> : '정보 없음'}
                </div>
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>1박 가격</label>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#2563eb' }}>
                    {hotel.price ? Number(hotel.price).toLocaleString() : 0}원
                </div>
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>평점</label>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
                    <div style={{ marginRight: '8px' }}>{renderStars(hotel.rating || 0)}</div>
                    <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '16px' }}>({hotel.rating} / 5.0)</span>
                </div>
            </div>

             <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>주소</label>
                <div style={{ fontSize: '16px', color: '#334155', background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                    📍 {hotel.address || '주소 정보가 없습니다.'}
                </div>
            </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '30px 0' }} />

        <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '12px' }}>호텔 소개</label>
            <div style={{ lineHeight: '1.8', color: '#475569', background: '#fff', whiteSpace: 'pre-line' }}>
                {hotel.description || "등록된 소개글이 없습니다."}
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
                onClick={handleDelete} 
                style={{ padding: '12px 24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
            >
                삭제하기
            </button>
        </div>

      </div>
    </div>
  );
};

export default AdminHotelDetailPage;