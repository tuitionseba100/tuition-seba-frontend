import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Loginpage from './pages/Loginpage';
import Tuitionmenu from './pages/Tuitionmenu';
import UserPage from './pages/UserPage';
import PrivateRoute from './pages/PrivateRoute'; // Import PrivateRoute
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  console.log('Role from localStorage:', localStorage.getItem('role'));
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Loginpage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/tuition" element={<Tuitionmenu />} />

          {localStorage.getItem('role') === 'superadmin' && (
            <Route path="/user" element={<UserPage />} />
          )}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

