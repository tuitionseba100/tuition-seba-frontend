import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { axiosWithFallback } from './services/fetchWithFallback';
import { isTokenExpired } from './utilities/authUtils';
import { PublicSettingsProvider } from './context/PublicSettingsContext';
import DayStartedRoute from './pages/DayStartedRoute';
import LandingPage from './pages/public/LandingPage';
import PrivateRoute from './pages/PrivateRoute';

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

// Lazy loaded public pages
const AvailableTuitions = lazy(() => import('./pages/public/AvailableTuitions'));
const FindTutorPage = lazy(() => import('./pages/public/FindTutorPage'));
const TeacherRegistration = lazy(() => import('./pages/public/TeacherRegistration'));
const OurTeacher = lazy(() => import('./pages/public/OurTeacher'));
const PaymentRefundPage = lazy(() => import('./pages/public/PaymentRefundPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/public/PrivacyPolicyPage'));
const Rules = lazy(() => import('./pages/public/Rules'));
const ReferPage = lazy(() => import('./pages/public/ReferPage'));
const ApplyUpdates = lazy(() => import('./pages/public/ApplyUpdates'));
const ComplaintSuggestionPage = lazy(() => import('./pages/public/ComplaintSuggestionPage'));
const LiveChatPage = lazy(() => import('./pages/public/LiveChatPage'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'));
const Loginpage = lazy(() => import('./pages/Loginpage'));

// Lazy loaded admin pages (Massive bundle reduction)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tuitionmenu = lazy(() => import('./pages/Tuitionmenu'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const TeacherPaymentPage = lazy(() => import('./pages/TeacherPaymentPage'));
const RefundPage = lazy(() => import('./pages/RefundPage'));
const ServiceChargePage = lazy(() => import('./pages/ServiceChargePage'));
const GuardianApplyPage = lazy(() => import('./pages/guardianApplyPage'));
const TaskPage = lazy(() => import('./pages/TaskPage'));
const TuitionApply = lazy(() => import('./pages/TuitionApplyPage'));
const PremiumTeacherPage = lazy(() => import('./pages/PremiumTeacherPage'));
const SpamBestPage = lazy(() => import('./pages/SpamBestPage'));
const LeadPage = lazy(() => import('./pages/LeadPage'));
const GeneralPage = lazy(() => import('./pages/GeneralPage'));
const ComplaintSuggestionAdminPage = lazy(() => import('./pages/ComplaintSuggestionAdminPage'));
const AdminChatConsole = lazy(() => import('./pages/AdminChatConsole'));
const SmsLogPage = lazy(() => import('./pages/SmsLogPage'));
const InternalChatPage = lazy(() => import('./pages/InternalChatPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AttendancePage = lazy(() => import('./pages/AttendancePage'));
const UserPage = lazy(() => import('./pages/UserPage'));
const ExpensePage = lazy(() => import('./pages/ExpensePage'));
const ActivityLogPage = lazy(() => import('./pages/ActivityLogPage'));
const StatusHistoryReportPage = lazy(() => import('./pages/StatusHistoryReportPage'));
const ExpenseReportPage = lazy(() => import('./pages/reports/ExpenseReportPage'));

const PageLoader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#004085' }}>
    <div className="spinner-border text-primary" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const AppRedirect = () => {
  React.useEffect(() => {
    window.location.replace("https://play.google.com/store/apps/details?id=com.tuitionseba.forumv2&pcampaignid=web_share");
  }, []);
  return null;
};

const App = () => {
  return (
    <PublicSettingsProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/refer" element={<ReferPage />} />
            <Route path="/apply-updates" element={<ApplyUpdates />} />
            <Route path="/complaint-suggestion" element={<ComplaintSuggestionPage />} />
            <Route path="/livechat" element={<LiveChatPage />} />
            <Route path="/profile-settings" element={<Navigate to="/#profile-settings" replace />} />
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
                <Route path="service-charge" element={<ServiceChargePage />} />
                <Route path="serviceCharge" element={<ServiceChargePage />} />
                <Route path="guardianApply" element={<GuardianApplyPage />} />
                <Route path="task" element={<TaskPage />} />
                <Route path="tuitionApply" element={<TuitionApply />} />
                <Route path="premiumTeacher" element={<PremiumTeacherPage />} />
                <Route path="spamBest" element={<SpamBestPage />} />
                <Route path="lead" element={<LeadPage />} />
                <Route path="general" element={<GeneralPage />} />
                <Route path="complaints" element={<ComplaintSuggestionAdminPage />} />
                <Route path="chat" element={<AdminChatConsole />} />
                <Route path="sms-logs" element={<SmsLogPage />} />
                <Route path="internal-chat" element={<InternalChatPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route element={<PrivateRoute role="superadmin" />}>
                <Route path="user" element={<UserPage />} />
                <Route path="finance" element={<ExpensePage />} />
                <Route path="activity-log" element={<ActivityLogPage />} />
                <Route path="reports" element={<StatusHistoryReportPage />} />
                <Route path="reports/status-history" element={<StatusHistoryReportPage />} />
                <Route path="reports/expense" element={<ExpenseReportPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </PublicSettingsProvider>
  );
};

export default App;
