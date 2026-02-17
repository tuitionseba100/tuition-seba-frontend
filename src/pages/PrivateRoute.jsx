import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { isTokenExpired } from '../utilities/authUtils';

const PrivateRoute = ({ role }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const location = useLocation();

    if (!token || isTokenExpired(token)) {
        // Clear invalid/expired token
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (role && role !== userRole) {
        return <Navigate to="/admin/tuition" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
