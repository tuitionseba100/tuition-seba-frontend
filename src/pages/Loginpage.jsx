import React, { useState } from "react";
import {
    Button,
    Form,
    Container,
    Row,
    Col,
    Toast,
    ToastContainer,
    Spinner,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { Formik } from "formik";
import * as Yup from "yup";

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
        <Container
            fluid
            className="d-flex justify-content-center align-items-center min-vh-100"
            style={{
                background: "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                padding: "2rem",
            }}
        >
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={5} lg={4}>
                    <div
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: "12px",
                            padding: "2.5rem 2rem",
                            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
                            textAlign: "center",
                        }}
                    >
                        <img
                            src="/img/TSF LOGO.png"
                            alt="Logo"
                            style={{ width: 150, marginBottom: "1.5rem" }}
                        />

                        <h2
                            style={{
                                marginBottom: "2rem",
                                fontWeight: "700",
                                color: "#004085",
                                letterSpacing: "0.8px",
                            }}
                        >
                            Welcome Back
                        </h2>

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
                                    <Form.Group controlId="username" className="mb-4 text-start">
                                        <Form.Label className="fw-semibold text-secondary">
                                            Username
                                        </Form.Label>
                                        <div className="input-group">
                                            <span
                                                className="input-group-text"
                                                style={{ backgroundColor: "#e9f0ff", border: "none" }}
                                            >
                                                <FaUser color="#004085" />
                                            </span>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter username"
                                                name="username"
                                                value={values.username}
                                                onChange={handleChange}
                                                isInvalid={touched.username && errors.username}
                                                style={{ fontSize: "1rem", padding: "0.6rem 1rem" }}
                                            />
                                            <Form.Control.Feedback type="invalid" className="ps-3">
                                                {errors.username}
                                            </Form.Control.Feedback>
                                        </div>
                                    </Form.Group>

                                    <Form.Group controlId="password" className="mb-4 text-start">
                                        <Form.Label className="fw-semibold text-secondary">
                                            Password
                                        </Form.Label>
                                        <div className="input-group">
                                            <span
                                                className="input-group-text"
                                                style={{ backgroundColor: "#e9f0ff", border: "none" }}
                                            >
                                                <FaLock color="#004085" />
                                            </span>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter password"
                                                name="password"
                                                value={values.password}
                                                onChange={handleChange}
                                                isInvalid={touched.password && errors.password}
                                                style={{ fontSize: "1rem", padding: "0.6rem 1rem" }}
                                            />
                                            <Form.Control.Feedback type="invalid" className="ps-3">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </div>
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        className="w-100"
                                        disabled={loading}
                                        style={{
                                            backgroundColor: "#004085",
                                            border: "none",
                                            borderRadius: "50px",
                                            padding: "0.75rem 0",
                                            fontWeight: "600",
                                            fontSize: "1.1rem",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                        }}
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

                        <ToastContainer position="top-center" className="mt-3">
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
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
