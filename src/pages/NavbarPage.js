import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-primary bg-primary shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold text-white fs-4">Tuition Seba Forum</Link>
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
                            <Link className="nav-link fw-bold text-white px-3 mx-2 rounded hover-effect" to="/tuition">
                                Tuitions
                            </Link>
                        </li>
                        {localStorage.getItem('role') === 'superadmin' && (
                            <li className="nav-item">
                                <Link className="nav-link fw-bold text-white px-3 mx-2 rounded hover-effect" to="/user">
                                    Users
                                </Link>
                            </li>
                        )}
                        <li className="nav-item">
                            <Link className="nav-link fw-bold text-white px-3 mx-2 rounded hover-effect" to="/payment">
                                Payments
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-bold text-white px-3 mx-2 rounded hover-effect" to="/refund">
                                Refund
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-bold text-white px-3 mx-2 rounded hover-effect" to="/guardianApply">
                                Guardian
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-bold text-white px-3 mx-2 rounded hover-effect" to="/task">
                                Task
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-bold text-white px-3 mx-2 rounded hover-effect" to="/attendance">
                                Attendance
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-bold text-white px-3 mx-2 rounded hover-effect" to="/tuitionApply">
                                Tuition Apply
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-bold text-white px-3 mx-2 rounded hover-effect" to="/premiumTeacher">
                                Premium Teachers
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-bold text-white px-3 mx-2 rounded hover-effect" to="/spamBest">
                                Spam/Best
                            </Link>
                        </li>
                        <li className="nav-item">
                            <button
                                onClick={handleLogout}
                                className="btn fw-bold btn-outline-light px-3 mx-2 rounded-pill"
                            >
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
