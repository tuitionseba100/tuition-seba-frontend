import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Loginpage from './pages/Loginpage';
import Tuitionmenu from './pages/Tuitionmenu';
import UserPage from './pages/UserPage';
import PaymentPage from './pages/PaymentPage';
import PrivateRoute from './pages/PrivateRoute'; // Import PrivateRoute
import 'bootstrap/dist/css/bootstrap.min.css';
import GuardianApplyPage from './pages/guardianApplyPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Loginpage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/tuition" element={<Tuitionmenu />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/guardianApply" element={<GuardianApplyPage />} />
          <Route element={<PrivateRoute role="superadmin" />}>
            <Route path="/user" element={<UserPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
