import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { checkDayStarted } from '../utilities/checkDayStarted';
import '../components/DashboardNavbar.css'; // Import admin navbar styles

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dayStarted, setDayStarted] = useState(true);
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [permissions, setPermissions] = useState(() => {
        const stored = localStorage.getItem("permissions");
        try {
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    });

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

    const renderNavItem = (to, label, permissionKey = null) => {
        const isActive = location.pathname === to;

        // Visibility logic
        if (role !== "superadmin") {
            // Finance, Users, Logs, and Settings are strictly superadmin
            if (to === "/admin/finance" || to === "/admin/user" || to === "/admin/activity-log" || to === "/admin/settings") return null;

            // Other items require specific permission if key is provided
            if (permissionKey && !permissions.includes(permissionKey)) {
                return null;
            }
        }

        return (
            <li className="nav-item">
                <Link
                    className={`nav-link fw-bold px-3 ${isActive ? 'active' : ''}`}
                    to={to}
                >
                    {label}
                </Link>
            </li>
        );
    };

    return (
        <nav className="navbar navbar-expand-xl navbar-dark admin-navbar shadow-lg">
            <div className="container-fluid px-4">
                <Link className="navbar-brand fw-bold text-white fs-3 me-4" to="/admin">
                    <img src="/img/TUITION SEBA FORUM TF.png" alt="Logo" style={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
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
                    <ul className="navbar-nav ms-auto nav-scroll-container">
                        {role === "superadmin" || dayStarted ? (
                            <>
                                {renderNavItem("/admin/tuition", "Tuitions", "tuition")}
                                {renderNavItem("/admin/user", "Users")}
                                {renderNavItem("/admin/finance", "Finance")}
                                {renderNavItem("/admin/activity-log", "Logs")}
                                {renderNavItem("/admin/settings", "Settings")}
                                {renderNavItem("/admin/payment", "Payments", "payment")}
                                {renderNavItem("/admin/teacherPayment", "Teacher Payments", "teacherPayment")}
                                {renderNavItem("/admin/refund", "Refund", "refund")}
                                {renderNavItem("/admin/guardianApply", "Guardian", "guardianApply")}
                                {renderNavItem("/admin/task", "Task", "task")}
                                {renderNavItem("/admin/tuitionApply", "Tuition Apply", "tuitionApply")}
                                {renderNavItem("/admin/premiumTeacher", "Premium", "premiumTeacher")}
                                {renderNavItem("/admin/spamBest", "Spam/Best", "spamBest")}
                                {renderNavItem("/admin/lead", "Lead", "lead")}
                                {renderNavItem("/admin/general", "Search", "general")}
                            </>
                        ) : null}

                        {renderNavItem("/admin/attendance", "Attendance")}

                        <li className="nav-item">
                            <button className="btn btn-light text-primary fw-bold rounded-pill px-3 py-2 ms-2" onClick={handleLogout} title="Logout">
                                <i className="fas fa-sign-out-alt"></i>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;