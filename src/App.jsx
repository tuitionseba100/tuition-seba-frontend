import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import DayStartedRoute from './pages/DayStartedRoute';
import { ToastContainer } from 'react-toastify';


import LandingPage from './pages/public/LandingPage';
import PaymentRefundPage from './pages/public/PaymentRefundPage';
import Loginpage from './pages/Loginpage';
import Tuitionmenu from './pages/Tuitionmenu';
import UserPage from './pages/UserPage';
import PaymentPage from './pages/PaymentPage';
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
        <Route path="/OurTeacher" element={<OurTeacher />} />
        <Route path="/admin/login" element={<Loginpage />} />

        <Route path="/admin" element={<PrivateRoute />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="attendance" element={<AttendancePage />} />

          <Route element={<DayStartedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tuition" element={<Tuitionmenu />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="refund" element={<RefundPage />} />
            <Route path="guardianApply" element={<GuardianApplyPage />} />
            <Route path="task" element={<TaskPage />} />
            <Route path="tuitionApply" element={<TuitionApply />} />
            <Route path="premiumTeacher" element={<PremiumTeacherPage />} />
            <Route path="spamBest" element={<SpamBestPage />} />
            <Route path="lead" element={<LeadPage />} />
          </Route>

          <Route element={<PrivateRoute role="superadmin" />}>
            <Route path="user" element={<UserPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
