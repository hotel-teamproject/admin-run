import AdminSystemConfigForm from "../../components/admin/settings/AdminSystemConfigForm";

const AdminSettingsPage = () => {
  const config = {
    siteName: "Hotel Booking",
    siteEmail: "admin@hotel.com",
    maintenanceMode: false,
    bookingEnabled: true,
    reviewEnabled: true,
  };

  const handleSubmit = async (formData) => {
    try {
      // TODO: API 연결
      alert("설정이 저장되었습니다.");
    } catch (err) {
      alert(err.message || "저장에 실패했습니다.");
    }
  };

  return (
    <div className="admin-settings-page">
      <div className="page-header">
        <h1>시스템 설정</h1>
      </div>

      <AdminSystemConfigForm config={config} onSubmit={handleSubmit} />
    </div>
  );
};

export default AdminSettingsPage;
