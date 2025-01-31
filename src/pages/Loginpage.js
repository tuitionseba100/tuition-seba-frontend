import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Card, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa'; // FontAwesome icons
import { Formik } from 'formik'; // Formik for better form management
import * as Yup from 'yup'; // Validation with Yup
import logo from '../img/favicon.png';


const Login = () => {
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    // Form validation schema using Yup
    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleLogin = async (values) => {
        try {
            const response = await axios.post('https://tuition-seba-backend.onrender.com/api/user/login', {
                username: values.username,
                password: values.password,
            });
            localStorage.setItem('token', response.data.token); // Store token
            navigate('/tuition');
        } catch (err) {
            setError('Invalid username or password');
            setShowError(true);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient">
            <Row className="w-100 justify-content-center">
                <Col xs={12} md={6} lg={4}>
                    <Card className="shadow-lg rounded-4 p-5">
                        <Card.Body>
                            <div className="text-center mb-4">
                                {/* Logo Placeholder */}
                                <img src={logo} alt="Company Logo" className="mb-3" style={{ width: '150px' }} />
                                <h2 className="font-weight-bold text-primary">Welcome</h2>
                            </div>
                            <Formik
                                initialValues={{ username: '', password: '' }}
                                validationSchema={validationSchema}
                                onSubmit={handleLogin}
                            >
                                {({ handleSubmit, handleChange, values, errors, touched }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group controlId="formBasicUsername" className="mb-4">
                                            <Form.Label className="text-muted">Username</Form.Label>
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><FaUser /></span>
                                                </div>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter username"
                                                    value={values.username}
                                                    onChange={handleChange}
                                                    name="username"
                                                    isInvalid={touched.username && errors.username}
                                                    className="form-control-lg"
                                                />
                                                {touched.username && errors.username && (
                                                    <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                                                )}
                                            </div>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicPassword" className="mb-4">
                                            <Form.Label className="text-muted">Password</Form.Label>
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><FaLock /></span>
                                                </div>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Enter password"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    name="password"
                                                    isInvalid={touched.password && errors.password}
                                                    className="form-control-lg"
                                                />
                                                {touched.password && errors.password && (
                                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                                )}
                                            </div>
                                        </Form.Group>

                                        <Button variant="primary" type="submit" className="w-100 mt-4 rounded-pill py-3">
                                            Login
                                        </Button>
                                    </Form>
                                )}
                            </Formik>

                            {/* Error Toast notification */}
                            <ToastContainer position="top-center">
                                <Toast onClose={() => setShowError(false)} show={showError} delay={3000} autohide>
                                    <Toast.Body className="text-danger">{error}</Toast.Body>
                                </Toast>
                            </ToastContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
