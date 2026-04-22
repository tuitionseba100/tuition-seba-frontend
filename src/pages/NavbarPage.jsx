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
            // Finance and Users are strictly superadmin
            if (to === "/admin/finance" || to === "/admin/user") return null;

            // Other items require specific permission if key is provided
            if (permissionKey && !permissions.includes(permissionKey)) {
                return null;
            }
        }

        return (
            <li className="nav-item">
                <Link
                    className={`nav-link text-white fw-bold px-3 ${isActive ? 'active' : ''}`}
                    to={to}
                >
                    {label}
                </Link>
            </li>
        );
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark admin-navbar shadow-lg">
            <div className="container-fluid px-4">
                <Link className="navbar-brand fw-bold text-white fs-3" to="/admin">
                    <i className="fas fa-graduation-cap me-2"></i>
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
                                {renderNavItem("/admin/tuition", "Tuitions", "tuition")}
                                {renderNavItem("/admin/user", "Users")}
                                {renderNavItem("/admin/finance", "Finance")}
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
                            <button className="btn btn-light text-primary fw-bold rounded-pill px-4 py-2 ms-2" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt me-1"></i>
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