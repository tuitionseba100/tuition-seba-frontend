import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Loginpage from './pages/Loginpage';
import Tuitionmenu from './pages/Tuitionmenu';
import UserPage from './pages/UserPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/tuition" element={<Tuitionmenu />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </Router>
  );
};

export default App;
