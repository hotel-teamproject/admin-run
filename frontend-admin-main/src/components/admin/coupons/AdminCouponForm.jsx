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

  // 랜덤 쿠폰 코드 생성 함수
  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    // 8자리 랜덤 코드 생성
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // coupon이 변경될 때 formData 업데이트
  useEffect(() => {
    if (coupon) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setFormData({
        code: coupon.code || "",
        name: coupon.name || "",
        discountType: coupon.discountType || "percentage",
        discountValue: coupon.discountValue || "",
        startDate: formatDateForInput(coupon.startDate),
        endDate: formatDateForInput(coupon.endDate),
        usageLimit: coupon.usageLimit || "",
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
      });
    } else {
      // 새 쿠폰 생성 시 자동으로 랜덤 코드 생성
      setFormData((prev) => ({
        ...prev,
        code: generateRandomCode(),
      }));
    }
  }, [coupon]);

  const handleGenerateCode = () => {
    setFormData((prev) => ({
      ...prev,
      code: generateRandomCode(),
    }));
    // 에러 초기화
    if (errors.code) {
      setErrors((prev) => ({
        ...prev,
        code: "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // 쿠폰 코드는 자동으로 대문자로 변환
    const processedValue =
      name === "code" ? value.toUpperCase().replace(/[^A-Z0-9]/g, "") : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : processedValue,
    }));
    // 에러 초기화
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "쿠폰 코드를 입력해주세요.";
    } else if (formData.code.length < 4) {
      newErrors.code = "쿠폰 코드는 최소 4자 이상이어야 합니다.";
    } else if (formData.code.length > 20) {
      newErrors.code = "쿠폰 코드는 20자를 초과할 수 없습니다.";
    }

    if (!formData.name.trim()) {
      newErrors.name = "쿠폰명을 입력해주세요.";
    }

    if (!formData.discountType) {
      newErrors.discountType = "할인 타입을 선택해주세요.";
    }

    if (!formData.discountValue) {
      newErrors.discountValue = "할인 값을 입력해주세요.";
    } else {
      const value = parseFloat(formData.discountValue);
      if (isNaN(value) || value <= 0) {
        newErrors.discountValue = "올바른 할인 값을 입력해주세요.";
      } else if (formData.discountType === "percentage" && value > 100) {
        newErrors.discountValue = "할인율은 100%를 초과할 수 없습니다.";
      }
    }

    if (!formData.startDate) {
      newErrors.startDate = "시작일을 선택해주세요.";
    }

    if (!formData.endDate) {
      newErrors.endDate = "종료일을 선택해주세요.";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = "종료일은 시작일보다 늦어야 합니다.";
      }
    }

    if (formData.usageLimit && (isNaN(formData.usageLimit) || formData.usageLimit < 1)) {
      newErrors.usageLimit = "사용 제한은 1 이상의 숫자여야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !onSubmit) return;

    try {
      setLoading(true);
      const submitData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
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
          <h3 className="form-section-title">기본 정보</h3>

          <div className="form-group">
            <label htmlFor="code">쿠폰 코드 *</label>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <input
                id="code"
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="WELCOME2024"
                required
                style={{ 
                  textTransform: "uppercase",
                  flex: 1
                }}
              />
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleGenerateCode}
                style={{ 
                  whiteSpace: "nowrap",
                  fontSize: "0.875rem",
                  padding: "0.5rem 1rem"
                }}
                title="새로운 랜덤 코드 생성"
              >
                🎲 랜덤 생성
              </button>
            </div>
            {errors.code && <span className="error">{errors.code}</span>}
            <p className="form-help-text">
              영문 대문자와 숫자만 사용 가능합니다. 랜덤 생성 버튼을 클릭하여 자동으로 생성할 수 있습니다.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="name">쿠폰명 *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="신규 가입 환영 쿠폰"
              required
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">할인 정보</h3>

          <div className="form-group">
            <label htmlFor="discountType">할인 타입 *</label>
            <select
              id="discountType"
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              required
            >
              <option value="percentage">퍼센트 할인 (%)</option>
              <option value="fixed">정액 할인 (원)</option>
            </select>
            {errors.discountType && (
              <span className="error">{errors.discountType}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="discountValue">
              할인 값 * ({formData.discountType === "percentage" ? "%" : "원"})
            </label>
            <input
              id="discountValue"
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              placeholder={
                formData.discountType === "percentage" ? "10" : "50000"
              }
              min="0"
              max={formData.discountType === "percentage" ? "100" : undefined}
              step={formData.discountType === "percentage" ? "1" : "1000"}
              required
            />
            {errors.discountValue && (
              <span className="error">{errors.discountValue}</span>
            )}
            {formData.discountType === "percentage" && (
              <p className="form-help-text">
                할인율은 0부터 100까지 입력할 수 있습니다.
              </p>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">사용 기간</h3>

          <div className="form-group">
            <label htmlFor="startDate">시작일 *</label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            {errors.startDate && (
              <span className="error">{errors.startDate}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="endDate">종료일 *</label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || undefined}
              required
            />
            {errors.endDate && <span className="error">{errors.endDate}</span>}
            <p className="form-help-text">
              종료일은 시작일보다 늦어야 합니다.
            </p>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">사용 제한</h3>

          <div className="form-group">
            <label htmlFor="usageLimit">사용 제한 (선택)</label>
            <input
              id="usageLimit"
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              placeholder="1000"
              min="1"
            />
            {errors.usageLimit && (
              <span className="error">{errors.usageLimit}</span>
            )}
            <p className="form-help-text">
              쿠폰 사용 가능 횟수를 제한합니다. 비워두면 제한이 없습니다.
            </p>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">상태</h3>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span>쿠폰 활성화</span>
            </label>
            <p className="form-help-text">
              활성화된 쿠폰만 사용자에게 표시되고 사용할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              취소
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "저장 중..." : coupon ? "수정하기" : "등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCouponForm;