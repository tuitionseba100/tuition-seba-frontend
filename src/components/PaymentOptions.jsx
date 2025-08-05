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
        <Container style={{ padding: '40px 15px', backgroundColor: '#f9fbff' }}>
            <h2 className="text-center mb-5" style={{ fontWeight: '700', color: '#2c3e50' }}>
                We Accept
            </h2>
            <Row>
                {paymentOptions.map((option, index) => (
                    <Col key={index} xs={12} sm={6} md={3} className="d-flex">
                        <Card
                            style={{
                                width: '100%',
                                border: 'none',
                                borderRadius: '15px',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                backgroundColor: '#ffffff',
                            }}
                            className="mb-4 p-3 text-center"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
                            }}
                        >
                            <img
                                src={option.image}
                                alt={option.title}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginBottom: '15px',
                                }}
                            />
                            <Card.Title style={{ fontSize: '1.1rem', fontWeight: '600', color: '#34495e' }}>
                                {option.title}
                            </Card.Title>
                            <Card.Text style={{ fontSize: '1rem', color: '#7f8c8d' }}>
                                {option.number}
                            </Card.Text>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default PaymentOptions;
