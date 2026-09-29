import React, { useState, useEffect } from "react";
import { Form, Toast, ToastContainer } from "react-bootstrap";
import { axiosWithFallback as axios } from "../services/fetchWithFallback";
import { useNavigate } from "react-router-dom";
import { 
    FaUser, 
    FaLock, 
    FaEye, 
    FaEyeSlash, 
    FaArrowRight, 
    FaSun, 
    FaMoon, 
    FaCloudSun, 
    FaExclamationTriangle
} from "react-icons/fa";
import { Formik } from "formik";
import * as Yup from "yup";
import "./LoginPage.css";

const Login = () => {
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockActive, setCapsLockActive] = useState(false);
    const [greeting, setGreeting] = useState({ text: "Welcome", icon: <FaSun /> });
    const navigate = useNavigate();

    // Time-based smart greeting
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            setGreeting({ text: "Good morning", icon: <FaSun className="greeting-icon sun" /> });
        } else if (hour >= 12 && hour < 17) {
            setGreeting({ text: "Good afternoon", icon: <FaCloudSun className="greeting-icon cloud-sun" /> });
        } else if (hour >= 17 && hour < 22) {
            setGreeting({ text: "Good evening", icon: <FaMoon className="greeting-icon moon" /> });
        } else {
            setGreeting({ text: "Good night", icon: <FaMoon className="greeting-icon moon" /> });
        }
    }, []);

    const validationSchema = Yup.object({
        username: Yup.string().trim().required("Username is required"),
        password: Yup.string().required("Password is required"),
    });

    const handleLogin = async (values) => {
        setLoading(true);
        setError("");
        setShowError(false);
        try {
            const response = await axios.post(
                "https://tuition-seba-backend-1.onrender.com/api/user/login",
                {
                    username: values.username.trim(),
                    password: values.password,
                }
            );
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("permissions", JSON.stringify(response.data.permissions || []));
            navigate("/admin/dashboard");
        } catch (err) {
            const message = err.response?.data?.message || "Invalid username or password";
            setError(message);
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    const checkCapsLock = (e) => {
        if (e.getModifierState) {
            setCapsLockActive(e.getModifierState("CapsLock"));
        }
    };

    return (
        <div className="login-root">
            {/* Ambient Background Accents */}
            <div className="bg-glow top-left" />
            <div className="bg-glow bottom-right" />
            <div className="bg-grid-overlay" />

            <div className="login-card-shell">
                {/* Glowing Animated Border Frame */}
                <div className="card-border-glow" />

                <div className="login-card-inner">
                    {/* Brand Banner with Floating Badge */}
                    <div className="login-brand-header">
                        <div className="logo-container">
                            <img
                                src="/img/TSF LOGO.png"
                                alt="Tuition Seba Forum"
                                className="brand-logo"
                            />
                        </div>

                        <div className="greeting-row">
                            {greeting.icon}
                            <span className="greeting-text">{greeting.text}, Admin</span>
                        </div>
                    </div>

                    {/* Formik Form */}
                    <Formik
                        initialValues={{ username: "", password: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleLogin}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            errors,
                            touched,
                        }) => (
                            <Form noValidate onSubmit={handleSubmit} className="login-form">
                                {/* Username */}
                                <div className="form-group-unique">
                                    <label htmlFor="username-input" className="field-label">
                                        Username
                                    </label>
                                    <div className={`input-box ${touched.username && errors.username ? 'input-error' : ''}`}>
                                        <FaUser className="input-leading-icon" />
                                        <input
                                            id="username-input"
                                            type="text"
                                            name="username"
                                            placeholder="Enter username"
                                            autoComplete="username"
                                            autoFocus
                                            value={values.username}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="field-input"
                                        />
                                    </div>
                                    {touched.username && errors.username && (
                                        <div className="field-error-msg">{errors.username}</div>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="form-group-unique">
                                    <div className="label-row">
                                        <label htmlFor="password-input" className="field-label">
                                            Password
                                        </label>
                                        {capsLockActive && (
                                            <span className="caps-alert">
                                                <FaExclamationTriangle /> Caps Lock ON
                                            </span>
                                        )}
                                    </div>
                                    <div className={`input-box ${touched.password && errors.password ? 'input-error' : ''}`}>
                                        <FaLock className="input-leading-icon" />
                                        <input
                                            id="password-input"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="••••••••••••"
                                            autoComplete="current-password"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            onKeyDown={checkCapsLock}
                                            onKeyUp={checkCapsLock}
                                            className="field-input"
                                        />
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            className="eye-toggle-btn"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {touched.password && errors.password && (
                                        <div className="field-error-msg">{errors.password}</div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="login-action-btn"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="btn-loading-content">
                                            <span className="spinner-ring" />
                                            <span>Signing In...</span>
                                        </div>
                                    ) : (
                                        <div className="btn-content">
                                            <span>Sign In</span>
                                            <div className="btn-arrow-circle">
                                                <FaArrowRight />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            {/* Error Toast */}
            <ToastContainer position="top-end" className="p-3 login-toast-root">
                <Toast
                    onClose={() => setShowError(false)}
                    show={showError}
                    delay={4000}
                    autohide
                    bg="danger"
                    className="error-toast"
                >
                    <Toast.Body className="d-flex align-items-center justify-content-between text-white py-2 px-3">
                        <span className="fw-medium">{error}</span>
                        <button
                            type="button"
                            className="btn-close btn-close-white ms-2"
                            onClick={() => setShowError(false)}
                            aria-label="Close"
                        />
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default Login;