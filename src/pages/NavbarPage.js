import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for routing
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap

const Navbar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        // Remove token and role from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');

        // Redirect to login page
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/">Tuition Seba Forum</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/tuition">Tuitions</Link>
                        </li>
                        {localStorage.getItem('role') === 'superadmin' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/user">Users</Link>
                            </li>
                        )}
                        {/* Add logout button */}
                        <li className="nav-item">
                            <button onClick={handleLogout} className="nav-link btn btn-link">
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
