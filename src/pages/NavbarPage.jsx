import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { checkDayStarted } from '../utilities/checkDayStarted';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dayStarted, setDayStarted] = useState(true);
    const [role, setRole] = useState(localStorage.getItem("role"));

    useEffect(() => {
        const fetchDayStatus = async () => {
            if (role !== "superadmin") {
                const started = await checkDayStarted();
                setDayStarted(started);
            }
        };

        fetchDayStatus();
    }, [role]);

    if (location.pathname === '/admin/login') return null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/admin/login');
    };

    const renderNavItem = (to, label) => (
        <li className="nav-item">
            <Link className="nav-link text-white fw-bold px-3" to={to}>
                {label}
            </Link>
        </li>
    );

    return (
        <nav className="navbar navbar-expand-lg navbar-primary bg-primary shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold text-white fs-4" to="/admin">
                    Tuition Seba Forum
                </Link>
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {role === "superadmin" || dayStarted ? (
                            <>
                                {renderNavItem("/admin/tuition", "Tuitions")}
                                {role === "superadmin" && renderNavItem("/admin/user", "Users")}
                                {renderNavItem("/admin/payment", "Payments")}
                                {renderNavItem("/admin/refund", "Refund")}
                                {renderNavItem("/admin/guardianApply", "Guardian")}
                                {renderNavItem("/admin/task", "Task")}
                                {renderNavItem("/admin/tuitionApply", "Tuition Apply")}
                                {renderNavItem("/admin/premiumTeacher", "Premium")}
                                {renderNavItem("/admin/spamBest", "Spam/Best")}
                                {renderNavItem("/admin/lead", "Lead")}
                            </>
                        ) : null}

                        {renderNavItem("/admin/attendance", "Attendance")}

                        <li className="nav-item">
                            <button className="btn btn-outline-light fw-bold rounded-pill px-3" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
