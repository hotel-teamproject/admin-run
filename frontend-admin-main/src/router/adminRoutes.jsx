import { Navigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import AdminLoginPage from "../pages/auth/AdminLoginPage";
import AdminForgotPasswordPage from "../pages/auth/AdminForgotPasswordPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";

// 호텔
import AdminHotelListPage from "../pages/admin/AdminHotelListPage";
import AdminHotelCreatePage from "../pages/admin/AdminHotelCreatePage";
import AdminHotelEditPage from "../pages/admin/AdminHotelEditPage";
import AdminHotelDetailPage from "../pages/admin/AdminHotelDetailPage"; 

// 예약
import AdminBookingListPage from "../pages/admin/AdminBookingListPage";
import AdminBookingDetailPage from "../pages/admin/AdminBookingDetailPage";

// 회원
import AdminUserListPage from "../pages/admin/AdminUserListPage";
import AdminUserDetailPage from "../pages/admin/AdminUserDetailPage";

// 리뷰
import AdminReviewListPage from "../pages/admin/AdminReviewListPage";
import AdminReviewDetailPage from "../pages/admin/AdminReviewDetailPage";
import AdminReviewWrite from "../pages/admin/AdminReviewWrite"; 

// 쿠폰 (Detail 페이지 import 추가!)
import AdminCouponListPage from "../pages/admin/AdminCouponListPage";
import AdminCouponCreatePage from "../pages/admin/AdminCouponCreatePage";
import AdminCouponEditPage from "../pages/admin/AdminCouponEditPage"; 
import AdminCouponDetailPage from "../pages/admin/AdminCouponDetailPage"; // 🟢 [1] 추가됨

import AdminSettingsPage from "../pages/admin/AdminSettingsPage";

const adminRoutes = [
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/forgot-password",
    element: <AdminForgotPasswordPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboardPage /> },
      
      // 호텔
      { path: "hotels", element: <AdminHotelListPage /> },
      { path: "hotels/new", element: <AdminHotelCreatePage /> },
      { path: "hotels/:id", element: <AdminHotelDetailPage /> },
      { path: "hotels/:hotelId/edit", element: <AdminHotelEditPage /> },

      // 예약
      { path: "bookings", element: <AdminBookingListPage /> },
      { path: "bookings/:bookingId", element: <AdminBookingDetailPage /> },

      // 회원
      { path: "users", element: <AdminUserListPage /> },
      { path: "users/:userId", element: <AdminUserDetailPage /> },
      
      // 리뷰
      { path: "reviews", element: <AdminReviewListPage /> },
      { path: "reviews/write", element: <AdminReviewWrite /> },
      { path: "reviews/:reviewId", element: <AdminReviewDetailPage /> },

      // --- 쿠폰 관리 ---
      { path: "coupons", element: <AdminCouponListPage /> },
      { path: "coupons/new", element: <AdminCouponCreatePage /> },
      // 🟢 [2] 상세 페이지 라우트 추가 (순서 중요: edit보다 위에 두는 게 안전)
      { path: "coupons/:couponId", element: <AdminCouponDetailPage /> },
      { path: "coupons/:couponId/edit", element: <AdminCouponEditPage /> },

      // 설정
      { path: "settings", element: <AdminSettingsPage /> },
    ],
  },
];

export default adminRoutes;