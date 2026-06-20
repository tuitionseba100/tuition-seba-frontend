import React, { useState } from 'react';
import {
    FaCopy,
    FaCheck,
    FaMobileAlt,
    FaStore,
    FaWallet,
    FaRocket,
    FaUniversity
} from 'react-icons/fa';

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
    },
    {
        title: 'Brac Bank PLC',
        number: '2079470810001',
        accountName: 'TUITION SEBA FORUM.COM',
        branch: 'Chawkbazar Branch',
        image: '/img/brac-bank-logo.png',
        icon: FaUniversity,
        isBank: true
    }
];

const PaymentOptions = () => {
    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleCopy = (number, index) => {
        navigator.clipboard.writeText(number);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div
            style={{
                background: 'linear-gradient(to bottom, #0d6efd, #ffffff)',
                padding: '60px 0'
            }}
        >
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-white mb-2">💳 Payment Methods</h2>
                    <p className="text-light">Click to copy account numbers</p>
                </div>

                <div className="row g-4 justify-content-center">
                    {paymentOptions.map((option, index) => {
                        const Icon = option.icon;
                        const isCopied = copiedIndex === index;

                        return (
                            <div key={index} className="col-12 col-sm-6 col-lg-4">
                                <div
                                    className="p-4 text-center shadow rounded-4 position-relative"
                                    style={{
                                        background: '#fff',
                                        transition: 'transform 0.3s',
                                        cursor: 'pointer',
                                        height: '100%',
                                        border: '1px solid #e0e0e0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}
                                    onClick={() => handleCopy(option.number, index)}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.transform = 'translateY(-6px)')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.transform = 'translateY(0)')
                                    }
                                >
                                    <div>
                                        <div
                                            className="mx-auto mb-3 d-flex justify-content-center align-items-center rounded-3"
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                background: '#0d6efd15',
                                                border: '1px solid #0d6efd30'
                                            }}
                                        >
                                            <Icon size={16} color="#0d6efd" />
                                        </div>

                                        <div
                                            className="mb-3 pulse-animation"
                                            style={{
                                                width: '80px',
                                                height: '40px',
                                                margin: '0 auto',
                                                overflow: 'hidden',
                                                borderRadius: '6px',
                                                background: '#f8f9fa',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '4px'
                                            }}
                                        >
                                            <img
                                                src={option.image}
                                                alt={option.title}
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        </div>

                                        <h5
                                            className="mb-2"
                                            style={{
                                                fontSize: '1.3rem',
                                                fontWeight: '700',
                                                background: 'linear-gradient(90deg, #3c81e1, #000, #3c81e1)',
                                                backgroundSize: '200% auto',
                                                color: 'transparent',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                animation: 'shineText 3s linear infinite'
                                            }}
                                        >
                                            {option.title}
                                        </h5>

                                        {option.isBank && (
                                            <div className="mb-3 text-start small text-muted border-top pt-3" style={{ fontSize: '0.85rem' }}>
                                                <div className="d-flex justify-content-between mb-1 gap-2">
                                                    <span>A/C Name:</span>
                                                    <span className="fw-bold text-dark text-end">{option.accountName}</span>
                                                </div>
                                                <div className="d-flex justify-content-between gap-2">
                                                    <span>Branch:</span>
                                                    <span className="fw-bold text-dark text-end">{option.branch}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div
                                            className="d-flex align-items-center justify-content-center gap-2 px-3 py-2 rounded-pill mt-2"
                                            style={{
                                                background: '#f0f2f5',
                                                border: '1px solid #ddd',
                                                fontFamily: "'Poppins', sans-serif",
                                                fontWeight: '700',
                                                fontSize: '0.95rem',
                                                letterSpacing: '1px',
                                            }}
                                        >
                                            {option.number}
                                            {isCopied ? (
                                                <FaCheck size={14} color="#198754" />
                                            ) : (
                                                <FaCopy size={14} color="#888" />
                                            )}
                                        </div>
                                    </div>

                                    {isCopied && (
                                        <div
                                            className="position-absolute"
                                            style={{
                                                top: '10px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                backgroundColor: '#198754',
                                                color: '#fff',
                                                fontSize: '0.75rem',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                                                zIndex: 10
                                            }}
                                        >
                                            Copied!
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .pulse-animation {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                @keyframes shineText {
                    0% {
                        background-position: 200% center;
                    }
                    100% {
                        background-position: -200% center;
                    }
                }

            `}</style>
        </div>
    );
};

export default PaymentOptions;
