import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ role }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (role && role !== userRole) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
