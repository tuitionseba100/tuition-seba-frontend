import React, { useState } from 'react';
import {
    FaCopy,
    FaCheck,
    FaMobileAlt,
    FaStore,
    FaWallet,
    FaRocket
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

                <div className="row g-4">
                    {paymentOptions.map((option, index) => {
                        const Icon = option.icon;
                        const isCopied = copiedIndex === index;

                        return (
                            <div key={index} className="col-12 col-sm-6 col-lg-3">
                                <div
                                    className="p-4 text-center shadow rounded-4"
                                    style={{
                                        background: '#fff',
                                        transition: 'transform 0.3s',
                                        cursor: 'pointer',
                                        height: '100%',
                                        border: '1px solid #e0e0e0'
                                    }}
                                    onClick={() => handleCopy(option.number, index)}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.transform = 'translateY(-6px)')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.transform = 'translateY(0)')
                                    }
                                >
                                    {/* Icon */}
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

                                    {/* Image */}
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

                                    {/* Title */}
                                    <h5 className="fw-semibold mb-2" style={{ fontSize: '1rem' }}>
                                        {option.title}
                                    </h5>

                                    {/* Number with Copy Icon */}
                                    <div
                                        className="d-flex align-items-center justify-content-center gap-2 px-3 py-2 rounded-pill"
                                        style={{
                                            background: '#f0f2f5',
                                            border: '1px solid #ddd',
                                            fontFamily: 'monospace',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {option.number}
                                        {isCopied ? (
                                            <FaCheck size={14} color="#198754" />
                                        ) : (
                                            <FaCopy size={14} color="#888" />
                                        )}
                                    </div>

                                    {/* Tooltip Feedback */}
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

            {/* CSS animation style */}
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
            `}</style>
        </div>
    );
};

export default PaymentOptions;
