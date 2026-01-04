import React, { useState } from "react";
import {
    Button,
    Form,
    Toast,
    ToastContainer,
    Spinner,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { Formik } from "formik";
import * as Yup from "yup";
import './LoginPage.css';

const Login = () => {
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required"),
    });

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(
                "https://tuition-seba-backend-1.onrender.com/api/user/login",
                {
                    username: values.username,
                    password: values.password,
                }
            );
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("username", response.data.username);
            navigate("/admin/dashboard");
        } catch (err) {
            setError("Invalid username or password");
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card premium-card">
                <img
                    src="/img/TSF LOGO.png"
                    alt="TSF Logo"
                    className="login-logo"
                />

                <h2 className="login-title">
                    Welcome Back
                </h2>
                <p className="login-subtitle">Sign in to access your dashboard</p>

                <Formik
                    initialValues={{ username: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        errors,
                        touched,
                    }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FaUser />
                                    </span>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        name="username"
                                        value={values.username}
                                        onChange={handleChange}
                                        isInvalid={touched.username && errors.username}
                                        className="form-control"
                                    />
                                </div>
                                {touched.username && errors.username && (
                                    <div className="error-feedback">{errors.username}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FaLock />
                                    </span>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        isInvalid={touched.password && errors.password}
                                        className="form-control"
                                    />
                                </div>
                                {touched.password && errors.password && (
                                    <div className="error-feedback">{errors.password}</div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="btn-login"
                                disabled={loading}
                            >
                                {loading && (
                                    <Spinner
                                        animation="border"
                                        size="sm"
                                        variant="light"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                )}
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </Form>
                    )}
                </Formik>

                <div className="login-footer">
                    <p>Need help? <a href="#">Contact Support</a></p>
                </div>
            </div>
            <ToastContainer position="top-end" className="toast-container">
                <Toast
                    onClose={() => setShowError(false)}
                    show={showError}
                    delay={3000}
                    autohide
                    bg="danger"
                >
                    <Toast.Body className="text-white">{error}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default Login;