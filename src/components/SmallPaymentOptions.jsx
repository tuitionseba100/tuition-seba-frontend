import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaCopy, FaCheck, FaMobileAlt, FaStore, FaWallet, FaRocket } from 'react-icons/fa';

const paymentOptions = [
    {
        title: 'BKash Personal',
        number: '01633920928',
        image: '/img/bkash.png',
        icon: FaMobileAlt
    },
    {
        title: 'BKash Merchant',
        number: '01714045039',
        image: '/img/bkash.png',
        icon: FaStore
    },
    {
        title: 'Nagad Personal',
        number: '01633920928',
        image: '/img/nagad.png',
        icon: FaWallet
    },
    {
        title: 'Rocket Personal',
        number: '016339209284',
        image: '/img/rocket main ogo.jpg',
        icon: FaRocket
    }
];

const SmallPaymentOptions = () => {
    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleCopy = (number, index) => {
        navigator.clipboard.writeText(number);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div>
            <Container fluid className="px-1">
                <Row className="justify-content-center mb-3">
                    <Col xs={12} className="text-center">
                        <p className="fw-bold mb-3" style={{ color: '#dc3545', fontSize: '1rem' }}>
                            এই নাম্বার ছাড়া অন্য কোথাও লেনদেন করবেন না
                        </p>
                    </Col>
                </Row>
                <Row className="g-3 justify-content-center mx-0">
                    {paymentOptions.map((option, index) => {
                        const Icon = option.icon;
                        const isCopied = copiedIndex === index;

                        return (
                            <Col key={index} xs={12} sm={6} md={4} lg={3} xl={3} className="d-flex">
                                <div
                                    className="w-100 p-3 text-center rounded-4 position-relative overflow-hidden"
                                    style={{
                                        background: 'linear-gradient(160deg, #ffffff 0%, #f8f9fa 100%)',
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        backdropFilter: 'blur(10px)',
                                        cursor: 'pointer',
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        minHeight: '140px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        boxShadow: '0 6px 25px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)'
                                    }}
                                    onClick={() => handleCopy(option.number, index)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-7px) scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.15), 0 6px 20px rgba(0,0,0,0.12)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)';
                                    }}
                                >
                                    <div className="d-flex justify-content-center mb-2">
                                        <div className="position-relative">
                                            <img
                                                src={option.image}
                                                alt={option.title}
                                                style={{
                                                    maxWidth: '45px',
                                                    maxHeight: '30px',
                                                    objectFit: 'contain',
                                                    transition: 'transform 0.3s ease',
                                                    filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.1))'
                                                }}
                                                className="payment-icon"
                                            />
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '-3px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: 'radial-gradient(circle, #4CAF50, #2E7D32)',
                                                    opacity: '0.8'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div
                                        className="mb-2"
                                        style={{ fontSize: '1rem', fontWeight: '700', color: '#212529', textShadow: '0 1px 1px rgba(0,0,0,0.05)' }}
                                    >
                                        {option.title}
                                    </div>
                                    <div
                                        className="d-flex align-items-center justify-content-center gap-2"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            border: '1px solid rgba(0,0,0,0.15)',
                                            borderRadius: '20px',
                                            padding: '6px 12px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            color: '#212529',
                                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        <span style={{ letterSpacing: '0.5px' }}>{option.number}</span>
                                        {isCopied ? (
                                            <FaCheck size={10} color="#198754" />
                                        ) : (
                                            <FaCopy size={10} color="#6c757d" />
                                        )}
                                    </div>
                                    {isCopied && (
                                        <div
                                            className="position-absolute"
                                            style={{
                                                top: '10px',
                                                right: '10px',
                                                backgroundColor: 'rgba(25, 135, 84, 0.95)',
                                                color: '#fff',
                                                fontSize: '0.75rem',
                                                padding: '5px 10px',
                                                borderRadius: '25px',
                                                zIndex: 10,
                                                boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                                                fontWeight: '600',
                                                animation: 'fadeInScale 0.3s ease-out'
                                            }}
                                        >
                                            Copied!
                                        </div>
                                    )}
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
            <style>
                {`
                    @keyframes fadeInScale {
                        0% {
                            opacity: 0;
                            transform: scale(0.8);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default SmallPaymentOptions;