import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// 중괄호 { } 를 써서 가져옵니다.
import { adminReviewApi } from "../../api/adminReviewApi"; 

const AdminReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        // API 호출
        const data = await adminReviewApi.getReviewById(id);
        setReview(data);
      } catch (err) {
        console.error(err);
        setError("리뷰 정보를 불러오는데 실패했습니다. (이미 삭제되었거나 없는 ID일 수 있습니다)");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchReview();
    }
  }, [id]);

  // 로딩 및 에러 처리 화면
  if (loading) return <div className="p-10 text-center">데이터를 불러오는 중입니다...</div>;
  if (error) return (
    <div className="p-10 text-center text-red-500">
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-gray-200 rounded">돌아가기</button>
    </div>
  );
  if (!review) return <div className="p-10 text-center">데이터가 없습니다.</div>;

  // 정상 화면 렌더링
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto mt-10 border border-gray-100">
      
      {/* 헤더 */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-6 mb-8">
        <h2 className="text-3xl font-bold text-gray-800">리뷰 상세 정보</h2>
        <button
          onClick={() => navigate('/admin/reviews')}
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          목록으로 돌아가기
        </button>
      </div>

      {/* 내용 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 호텔명 */}
        <div className="bg-gray-50 p-5 rounded-xl">
          <label className="block text-sm font-bold text-gray-500 mb-2">호텔명</label>
          <div className="text-xl text-gray-900 font-semibold">{review.hotelName || "정보 없음"}</div>
        </div>
        
        {/* 작성자 */}
        <div className="bg-gray-50 p-5 rounded-xl">
          <label className="block text-sm font-bold text-gray-500 mb-2">작성자</label>
          <div className="text-xl text-gray-900 font-semibold">{review.userName || "정보 없음"}</div>
        </div>

        {/* 평점 */}
        <div className="bg-gray-50 p-5 rounded-xl">
          <label className="block text-sm font-bold text-gray-500 mb-2">평점</label>
          <div className="flex items-center">
            <div className="text-2xl text-yellow-400 mr-2">
                {"★".repeat(review.rating || 0)}{"☆".repeat(5 - (review.rating || 0))}
            </div>
            <span className="text-gray-600 font-medium text-lg">({review.rating}점)</span>
          </div>
        </div>

        {/* 작성일 */}
        <div className="bg-gray-50 p-5 rounded-xl">
          <label className="block text-sm font-bold text-gray-500 mb-2">작성일</label>
          <div className="text-xl text-gray-900">
            {new Date(review.createdAt).toLocaleDateString()} 
            <span className="text-sm text-gray-500 ml-2">
                {new Date(review.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        </div>

        {/* 리뷰 내용 (전체 너비) */}
        <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl min-h-[200px] border border-gray-100">
          <label className="block text-sm font-bold text-gray-500 mb-3">리뷰 내용</label>
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">
            {review.content}
          </p>
        </div>
      </div>
      
      {/* 하단 삭제 버튼 */}
      <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
        <button
            onClick={async () => {
                if(window.confirm("이 리뷰를 정말 삭제하시겠습니까? 복구할 수 없습니다.")) {
                    try {
                        await adminReviewApi.deleteReview(id);
                        alert("성공적으로 삭제되었습니다.");
                        navigate('/admin/reviews');
                    } catch (err) {
                        alert("삭제에 실패했습니다.");
                    }
                }
            }}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold shadow-md hover:shadow-lg"
        >
            리뷰 삭제하기
        </button>
      </div>
    </div>
  );
};

export default AdminReviewDetail;