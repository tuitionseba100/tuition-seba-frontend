import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaSun, FaCloudSun, FaMoon } from 'react-icons/fa';
import NavBarPage from './NavbarPage';

const Dashboard = () => {
    return (
        <>
            <NavBarPage />
            <Container fluid style={{ padding: '20px' }}>
                {/* Welcome Message Section */}
                <Row className="mb-4 mt-2">
                    <Col>
                        <Card style={{
                            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '24px',
                            padding: '40px',
                            color: 'white',
                            boxShadow: '0 20px 40px rgba(37, 117, 252, 0.25)',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    display: 'inline-block',
                                    padding: '6px 15px',
                                    borderRadius: '50px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    marginBottom: '15px',
                                    backdropFilter: 'blur(5px)'
                                }}>
                                    Dashboard Overview
                                </div>
                                <h1 style={{ fontWeight: 800, fontSize: '2.8rem', marginBottom: '10px', letterSpacing: '-1px' }}>
                                    {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}, {localStorage.getItem('username') || 'Admin'}! 👋
                                </h1>
                                <p style={{ fontSize: '1.2rem', opacity: 0.9, fontWeight: 500, marginBottom: 0 }}>
                                    We're glad to see you back. Have a productive day!
                                </p>
                            </div>

                            {/* Time-based Icon */}
                            <div style={{
                                position: 'relative',
                                zIndex: 1,
                                fontSize: '6rem',
                                opacity: 0.8,
                                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {new Date().getHours() < 12 ? <FaSun /> : new Date().getHours() < 18 ? <FaCloudSun /> : <FaMoon />}
                            </div>

                            {/* Floating Decorative Elements */}
                            <div style={{
                                position: 'absolute',
                                right: '-30px',
                                top: '-30px',
                                width: '180px',
                                height: '180px',
                                background: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: '50%',
                                pointerEvents: 'none'
                            }} />
                            <div style={{
                                position: 'absolute',
                                left: '10%',
                                bottom: '-30px',
                                width: '120px',
                                height: '120px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '50%',
                                pointerEvents: 'none'
                            }} />
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Dashboard;
