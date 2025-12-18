import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminReviewApi } from "../../api/adminReviewApi";

const AdminReviewWrite = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    hotelName: "",
    userName: "",
    rating: 5,
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminReviewApi.createReview(formData);
      alert("리뷰가 성공적으로 등록되었습니다!");
      navigate("/admin/reviews");
    } catch (error) {
      console.error(error);
      alert("등록 실패! (백엔드 터미널 로그를 확인해주세요)");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      {/* 헤더 섹션 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">✍️ 리뷰 수동 등록</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700 underline text-sm"
        >
          돌아가기
        </button>
      </div>

      {/* 폼 카드 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 호텔명 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  호텔 이름
                </label>
                <input
                  type="text"
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition outline-none"
                  placeholder="예: 서울 신라 호텔"
                  required
                />
              </div>

              {/* 작성자 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  작성자 (관리자 표시용)
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition outline-none"
                  placeholder="예: 관리자"
                  required
                />
              </div>
            </div>

            {/* 평점 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                평점
              </label>
              <div className="relative">
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition outline-none appearance-none bg-white"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5점 - 아주 좋아요)</option>
                  <option value="4">⭐⭐⭐⭐ (4점 - 좋아요)</option>
                  <option value="3">⭐⭐⭐ (3점 - 보통이에요)</option>
                  <option value="2">⭐⭐ (2점 - 별로예요)</option>
                  <option value="1">⭐ (1점 - 최악이에요)</option>
                </select>
                {/* 커스텀 화살표 아이콘 */}
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                리뷰 내용
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition outline-none h-40 resize-none"
                placeholder="고객의 리뷰 내용을 이곳에 입력하거나 테스트할 내용을 적어주세요."
                required
              ></textarea>
            </div>

            {/* 버튼 영역 */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-bold shadow-lg shadow-green-200"
              >
                등록 완료
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewWrite;