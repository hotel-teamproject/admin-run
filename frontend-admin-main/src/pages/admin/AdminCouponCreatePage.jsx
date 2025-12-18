import { useNavigate } from "react-router-dom";
import AdminCouponForm from "../../components/admin/coupons/AdminCouponForm";
import { adminCouponApi } from "../../api/adminCouponApi";

const AdminCouponCreatePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await adminCouponApi.createCoupon(formData);
      alert("쿠폰이 생성되었습니다.");
      navigate("/admin/coupons");
    } catch (err) {
      alert(err.message || "생성에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/admin/coupons");
  };

  return (
    <div className="admin-coupon-create-page">
      <div className="page-header">
        <h1>쿠폰 생성</h1>
      </div>

      <AdminCouponForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default AdminCouponCreatePage;
