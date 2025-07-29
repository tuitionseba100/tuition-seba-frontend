import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === '/admin/login') return null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/admin/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-primary bg-primary shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold text-white fs-4" to="/admin">Tuition Seba Forum</Link>
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
                        <li className="nav-item">
                            <Link className="nav-link text-white fw-bold px-3" to="/admin/tuition">Tuitions</Link>
                        </li>
                        {localStorage.getItem('role') === 'superadmin' && (
                            <li className="nav-item">
                                <Link className="nav-link text-white fw-bold px-3" to="/admin/user">Users</Link>
                            </li>
                        )}
                        <li className="nav-item">
                            <Link className="nav-link text-white fw-bold px-3" to="/admin/payment">Payments</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white fw-bold px-3" to="/admin/refund">Refund</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white fw-bold px-3" to="/admin/guardianApply">Guardian</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white fw-bold px-3" to="/admin/task">Task</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white fw-bold px-3" to="/admin/attendance">Attendance</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white fw-bold px-3" to="/admin/tuitionApply">Tuition Apply</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white fw-bold px-3" to="/admin/premiumTeacher">Premium</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white fw-bold px-3" to="/admin/spamBest">Spam/Best</Link>
                        </li>
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
