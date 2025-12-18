import React, { useState, useEffect } from "react";
import AdminStatsCards from "../../components/admin/dashboard/AdminStatsCards";
import AdminChartArea from "../../components/admin/dashboard/AdminChartArea";
import AdminRecentTable from "../../components/admin/dashboard/AdminRecentTable";
import { adminStatsApi } from "../../api/adminStatsApi"; // API 연동
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // [수정됨] 실제 서버 API 호출
      const data = await adminStatsApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("대시보드 데이터 로딩 실패:", err);
      setError("대시보드 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboardStats} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">관리자 대시보드</h1>
        <span className="text-sm text-gray-500">
          오늘 날짜: {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* 1. 통계 카드 (매출, 예약, 호텔, 유저 수) */}
      <AdminStatsCards stats={stats} />

      {/* 2. 매출 차트 */}
      <AdminChartArea data={stats?.chartData || []} />
      
      {/* 3. 최근 활동 테이블 (예약, 유저, 리뷰) */}
      <AdminRecentTable
        bookings={stats?.recentBookings || []}
        users={stats?.recentUsers || []}
        reviews={stats?.recentReviews || []}
      />
    </div>
  );
};

export default AdminDashboardPage;