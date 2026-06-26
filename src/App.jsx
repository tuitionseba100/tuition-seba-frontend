import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import DayStartedRoute from './pages/DayStartedRoute';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { axiosWithFallback } from './services/fetchWithFallback';
import { isTokenExpired } from './utilities/authUtils';

// Global Axios configuration
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const path = window.location.pathname;

    // Only for admin pages (excluding login), if token is missing or expired, logout.
    if (path.startsWith('/admin') && path !== '/admin/login' && (!token || isTokenExpired(token))) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      window.location.href = '/admin/login';
      return Promise.reject(new Error('Token missing or expired for admin request'));
    }

    if (token) {
      config.headers.Authorization = token;
    }
    if (username) {
      config.headers['x-user-name'] = username;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const path = window.location.pathname;
    // Only logout on admin pages — never touch public pages
    if (
      path.startsWith('/admin') &&
      path !== '/admin/login' &&
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Apply same auth interceptor to axiosWithFallback instance
axiosWithFallback.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token) {
      config.headers.Authorization = token;
    }
    if (username) {
      config.headers['x-user-name'] = username;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

import LandingPage from './pages/public/LandingPage';
import PaymentRefundPage from './pages/public/PaymentRefundPage';
import Loginpage from './pages/Loginpage';
import Tuitionmenu from './pages/Tuitionmenu';
import UserPage from './pages/UserPage';
import PaymentPage from './pages/PaymentPage';
import TeacherPaymentPage from './pages/TeacherPaymentPage';
import GuardianApplyPage from './pages/guardianApplyPage';
import TaskPage from './pages/TaskPage';
import AttendancePage from './pages/AttendancePage';
import TuitionApply from './pages/TuitionApplyPage';
import RefundPage from './pages/RefundPage';
import PremiumTeacherPage from './pages/PremiumTeacherPage';
import SpamBestPage from './pages/SpamBestPage';
import PrivateRoute from './pages/PrivateRoute';
import NotFoundPage from './pages/public/NotFoundPage';
import Dashboard from './pages/Dashboard';
import AvailableTuitions from './pages/public/AvailableTuitions';
import FindTutorPage from './pages/public/FindTutorPage';
import TeacherRegistration from './pages/public/TeacherRegistration';
import OurTeacher from './pages/public/OurTeacher';
import LeadPage from './pages/LeadPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import Rules from './pages/public/Rules';
import GeneralPage from './pages/GeneralPage';
import IncomeExpensePage from './pages/IncomeExpensePage';
import ActivityLogPage from './pages/ActivityLogPage';
import SettingsPage from './pages/SettingsPage';
import ApplyUpdates from './pages/public/ApplyUpdates';

const AppRedirect = () => {
  React.useEffect(() => {
    window.location.replace("https://play.google.com/store/apps/details?id=com.tuitionseba.forumv2&pcampaignid=web_share");
  }, []);
  return null;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/index" element={<LandingPage />} />
        <Route path="/tuitions" element={<AvailableTuitions />} />
        <Route path="/payment" element={<PaymentRefundPage />} />
        <Route path="/findTutor" element={<FindTutorPage />} />
        <Route path="/teacherRegistration" element={<TeacherRegistration />} />
        <Route path="/OurTeachers" element={<OurTeacher />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/apply-updates" element={<ApplyUpdates />} />
        <Route path="/admin/login" element={<Loginpage />} />
        <Route path="/app" element={<AppRedirect />} />

        <Route path="/admin" element={<PrivateRoute />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="attendance" element={<AttendancePage />} />

          <Route element={<DayStartedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tuition" element={<Tuitionmenu />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="teacherPayment" element={<TeacherPaymentPage />} />
            <Route path="refund" element={<RefundPage />} />
            <Route path="guardianApply" element={<GuardianApplyPage />} />
            <Route path="task" element={<TaskPage />} />
            <Route path="tuitionApply" element={<TuitionApply />} />
            <Route path="premiumTeacher" element={<PremiumTeacherPage />} />
            <Route path="spamBest" element={<SpamBestPage />} />
            <Route path="lead" element={<LeadPage />} />
            <Route path="general" element={<GeneralPage />} />

          </Route>

          <Route element={<PrivateRoute role="superadmin" />}>
            <Route path="user" element={<UserPage />} />
            <Route path="finance" element={<IncomeExpensePage />} />
            <Route path="activity-log" element={<ActivityLogPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
