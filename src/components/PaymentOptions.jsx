import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const paymentOptions = [
    {
        title: 'বিকাশ সেন্ড মানি',
        number: '01633920928',
        image: '/img/bkash.png',
    },
    {
        title: 'বিকাশ পেমেন্ট',
        number: '01714045039',
        image: '/img/bkash.png',
    },
    {
        title: 'নগদ সেন্ড মানি',
        number: '01633920928',
        image: '/img/nagad.png',
    },
    {
        title: 'রকেট সেন্ড মানি',
        number: '016339209284',
        image: '/img/rocket main ogo.jpg',
    },
];

const PaymentOptions = () => {
    return (
        <div
            style={{
                width: '100%',
                padding: '80px 20px',
                background: 'linear-gradient(to right, #e3f2fd, #f1f9ff)',
            }}
        >
            <Container fluid>
                <h2
                    className="text-center mb-5"
                    style={{
                        fontWeight: '900',
                        fontSize: '2.4rem',
                        color: '#0b3d91',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                    }}
                >
                    💳 WE ACCEPT
                </h2>
                <Row className="gx-4 gy-4 justify-content-center">
                    {paymentOptions.map((option, index) => (
                        <Col key={index} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
                            <Card
                                style={{
                                    width: '100%',
                                    maxWidth: '320px',
                                    border: 'none',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 35px rgba(0, 123, 255, 0.15)',
                                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                    backgroundColor: '#ffffff',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = '0 14px 40px rgba(0, 123, 255, 0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 35px rgba(0, 123, 255, 0.15)';
                                }}
                            >
                                <div style={{ width: '100%', height: '160px', overflow: 'hidden' }}>
                                    <img
                                        src={option.image}
                                        alt={option.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block',
                                        }}
                                    />
                                </div>
                                <Card.Body className="text-center">
                                    <Card.Title
                                        style={{
                                            fontSize: '1.2rem',
                                            fontWeight: '700',
                                            color: '#0a2f74',
                                            marginBottom: '12px',
                                        }}
                                    >
                                        {option.title}
                                    </Card.Title>
                                    <Card.Text
                                        style={{
                                            fontSize: '1rem',
                                            color: '#007bff',
                                            backgroundColor: '#e8f4ff',
                                            borderRadius: '12px',
                                            padding: '8px 14px',
                                            fontWeight: '600',
                                            display: 'inline-block',
                                        }}
                                    >
                                        {option.number}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default PaymentOptions;
