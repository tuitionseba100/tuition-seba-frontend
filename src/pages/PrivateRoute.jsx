import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { isTokenExpired } from '../utilities/authUtils';

const PrivateRoute = ({ role }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const location = useLocation();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        navigate('/admin/login', { state: { from: location }, replace: true });
    };

    useEffect(() => {
        const checkAuth = () => {
            const currentToken = localStorage.getItem('token');
            if (!currentToken || isTokenExpired(currentToken)) {
                logout();
            }
        };

        // Check on mount and when location changes
        checkAuth();

        // Listen for storage changes (e.g. logout in another tab)
        const handleStorageChange = (e) => {
            if (e.key === 'token' && !e.newValue) {
                logout();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also check periodically or on focus for extra security
        const interval = setInterval(checkAuth, 5000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [location, navigate]);

    if (!token || isTokenExpired(token)) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (role && role !== userRole) {
        return <Navigate to="/admin/tuition" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;

