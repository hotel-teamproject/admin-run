import React, { useState, useEffect } from "react";

const AdminCouponForm = ({ coupon = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (coupon) {
      const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split("T")[0] : "";
      setFormData({
        code: coupon.code || "",
        name: coupon.name || "",
        discountType: coupon.discountType || "percentage",
        discountValue: coupon.discountValue || "",
        startDate: formatDate(coupon.startDate),
        endDate: formatDate(coupon.endDate),
        usageLimit: coupon.usageLimit || "",
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
      });
    } else {
      setFormData(prev => ({ ...prev, code: Math.random().toString(36).substring(2, 10).toUpperCase() }));
    }
  }, [coupon]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : (name === "code" ? value.toUpperCase().replace(/[^A-Z0-9]/g, "") : value);
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSubmit) return;

    try {
      setLoading(true);
      const submitData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : 100,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };
      await onSubmit(submitData);
    } catch (err) {
      console.error("쿠폰 저장 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-container">
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-section">
          <h3>기본 정보</h3>
          <div className="form-group">
            <label>쿠폰 코드 *</label>
            <input name="code" value={formData.code} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>쿠폰명 *</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-section">
          <h3>할인 정보</h3>
          <div className="form-group">
            <label>할인 타입 *</label>
            <select name="discountType" value={formData.discountType} onChange={handleChange}>
              <option value="percentage">퍼센트 할인 (%)</option>
              <option value="fixed">정액 할인 (원)</option>
            </select>
          </div>
          <div className="form-group">
            <label>할인 값 *</label>
            <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-section">
          <h3>사용 기간 및 제한</h3>
          <div className="form-group">
            <label>시작일 *</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>종료일 *</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>사용 제한 횟수</label>
            <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
            활성화 여부
          </label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel}>취소</button>
          <button type="submit" disabled={loading}>{loading ? "저장 중..." : (coupon ? "수정하기" : "등록하기")}</button>
        </div>
      </form>
    </div>
  );
};

export default AdminCouponForm;