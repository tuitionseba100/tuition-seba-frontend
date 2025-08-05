import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ role }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (role && role !== userRole) {
        return <Navigate to="/admin/tuition" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
