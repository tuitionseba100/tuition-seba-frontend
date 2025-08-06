import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkDayStarted } from '../utilities/checkDayStarted';
import { Spinner } from 'react-bootstrap';

const DayStartedRoute = () => {
    const location = useLocation();
    const role = localStorage.getItem("role");
    const [allowed, setAllowed] = useState(null);

    useEffect(() => {
        const verify = async () => {
            if (role === "superadmin") {
                setAllowed(true);
            } else {
                const isStarted = await checkDayStarted();
                if (!isStarted) {
                    toast.warn("You must start your day first", { autoClose: 3000 });
                    setAllowed(false);
                } else {
                    setAllowed(true);
                }
            }
        };
        verify();
    }, [role]);

    if (allowed === null) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
                <div className="mt-3 text-muted fw-semibold fs-5">
                    Checking if your day has started...
                </div>
            </div>
        );
    }

    if (!allowed) {
        return <Navigate to="/admin/attendance" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default DayStartedRoute;
