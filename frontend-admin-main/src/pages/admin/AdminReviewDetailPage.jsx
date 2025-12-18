import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminReviewApi } from '../../api/adminReviewApi';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminReviewDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  
  // 1. [안전장치] URL 파라미터가 'id'인지 'reviewId'인지 몰라도 알아서 찾습니다.
  const id = params.id || params.reviewId || params.key;

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ID가 없으면 로딩을 즉시 끝내고 에러 표시
    if (!id) {
      console.error("URL 파라미터(ID)를 찾을 수 없습니다:", params);
      setError("잘못된 접근입니다. (ID 없음)");
      setLoading(false);
      return;
    }

    const fetchReviewDetail = async () => {
      try {
        setLoading(true);
        console.log(`📡 리뷰 상세 정보 요청 시작 (ID: ${id})`);
        
        const data = await adminReviewApi.getReviewById(id);
        console.log("✅ 받아온 데이터:", data);
        
        setReview(data);
      } catch (err) {
        console.error("❌ 상세 조회 실패:", err);
        setError("리뷰 정보를 불러오지 못했습니다. (서버 연결 확인)");
      } finally {
        // [중요] 성공하든 실패하든 로딩은 무조건 끕니다.
        setLoading(false);
      }
    };

    fetchReviewDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await adminReviewApi.deleteReview(id);
      alert("삭제되었습니다.");
      navigate('/admin/reviews');
    } catch (err) {
      alert("삭제 실패: " + err.message);
    }
  };

  if (loading) return <Loader />;
  if (error) return (
    <div style={{ padding: '20px' }}>
      <ErrorMessage message={error} />
      <button onClick={() => navigate('/admin/reviews')} style={{ marginTop: '10px', padding: '5px 10px' }}>
        목록으로 돌아가기
      </button>
    </div>
  );
  if (!review) return <div style={{ padding: '20px' }}>데이터가 없습니다.</div>;

  return (
    <div className="admin-detail-page" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* 상단 헤더 */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>리뷰 상세 정보</h2>
        <button 
          onClick={() => navigate('/admin/reviews')} 
          style={{ padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
        >
          목록으로
        </button>
      </div>

      {/* 상세 내용 카드 */}
      <div className="detail-card" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>호텔명</label>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{review.hotelName || '-'}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>작성자</label>
            <div>{review.userName || '익명'}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>작성일</label>
            <div>{review.createdAt ? new Date(review.createdAt).toLocaleString() : '-'}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>평점</label>
            <div style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold' }}>
               {'★'.repeat(review.rating || 0)} <span style={{ color: '#333', fontSize: '14px' }}>({review.rating}점)</span>
            </div>
          </div>
        </div>

        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>내용</label>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', lineHeight: '1.6', minHeight: '100px' }}>
            {review.content}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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

export default AdminReviewDetail;