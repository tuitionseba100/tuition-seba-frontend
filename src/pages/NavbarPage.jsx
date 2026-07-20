import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { checkDayStarted } from '../utilities/checkDayStarted';
import '../components/DashboardNavbar.css'; // Import admin navbar styles
import ResponseGuidelineWidget from '../components/modals/ResponseGuidelineWidget';
import { FaSearch, FaCog } from 'react-icons/fa';
import GlobalSearchModal from '../components/modals/GlobalSearchModal';

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
    const [showSearchModal, setShowSearchModal] = useState(false);

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
            // Finance, Users, Logs, Settings, and Status History are strictly superadmin
            if (to === "/admin/finance" || to === "/admin/user" || to === "/admin/activity-log" || to === "/admin/settings" || to === "/admin/reports") return null;

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

    const getTopicColorClass = (topic) => {
        if (!topic) return 'text-dark';
        const lowerTopic = topic.toLowerCase();
        if (lowerTopic.includes('refund')) return 'text-danger';
        if (lowerTopic.includes('payment')) return 'text-success';
        if (lowerTopic.includes('tuition') || lowerTopic.includes('apply')) return 'text-primary';
        return 'text-dark';
    };

    return (
        <>
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
                                    <li className="nav-item">
                                        <button className="btn btn-light text-primary fw-bold rounded-pill px-3 py-2 ms-2" onClick={() => setShowSearchModal(true)} title="Global Search">
                                            <FaSearch size={18} />
                                        </button>
                                    </li>
                                    {role === "superadmin" && (
                                        <li className="nav-item">
                                            <Link className="btn btn-light text-primary fw-bold rounded-pill px-3 py-2 ms-2 d-inline-flex align-items-center justify-content-center" to="/admin/settings" title="Settings">
                                                <FaCog size={18} />
                                            </Link>
                                        </li>
                                    )}
                                    {renderNavItem("/admin/tuition", "Tuitions", "tuition")}
                                    {renderNavItem("/admin/user", "Users")}
                                    {renderNavItem("/admin/finance", "Expense")}
                                    {renderNavItem("/admin/activity-log", "Logs")}
                                    {renderNavItem("/admin/reports", "Reports")}
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
                                    {renderNavItem("/admin/complaints", "Complaints")}
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
            {/* Modular Response Helper Widget (isolated states for top-tier rendering performance) */}
            <ResponseGuidelineWidget />
            <GlobalSearchModal show={showSearchModal} onHide={() => setShowSearchModal(false)} />
        </>
    );
};

export default Navbar;