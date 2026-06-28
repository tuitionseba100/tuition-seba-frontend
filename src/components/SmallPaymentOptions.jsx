import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaCopy, FaCheck, FaMobileAlt, FaStore, FaWallet, FaRocket, FaUniversity } from 'react-icons/fa';

const mfsOptions = [
    {
        title: 'BKash Personal',
        number: '01633920928',
        image: '/img/bkash.png',
        icon: FaMobileAlt
    },
    {
        title: 'BKash Merchant',
        number: '01973920728',
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

const bankOption = {
    title: 'Brac Bank PLC',
    number: '2079470810001',
    accountName: 'TUITION SEBA FORUM.COM',
    branch: 'Chawkbazar Branch',
    image: '/img/brac-bank-logo.png',
    icon: FaUniversity
};

const SmallPaymentOptions = () => {
    const [copiedMfs, setCopiedMfs] = useState(null);
    const [copiedBank, setCopiedBank] = useState(false);

    const handleCopyMfs = (number, index) => {
        navigator.clipboard.writeText(number);
        setCopiedMfs(index);
        setTimeout(() => setCopiedMfs(null), 2000);
    };

    const handleCopyBank = (number) => {
        navigator.clipboard.writeText(number);
        setCopiedBank(true);
        setTimeout(() => setCopiedBank(false), 2000);
    };

    const cardBase = {
        background: 'linear-gradient(160deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid rgba(0,0,0,0.08)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 6px 25px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)'
    };

    const numberPill = {
        background: 'rgba(255,255,255,0.8)',
        border: '1px solid rgba(0,0,0,0.15)',
        borderRadius: '20px',
        padding: '6px 12px',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#212529',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
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

                {/* Row 1 — MFS Cards */}
                <Row className="g-3 justify-content-center mx-0 mb-3">
                    {mfsOptions.map((option, index) => {
                        const Icon = option.icon;
                        const isCopied = copiedMfs === index;
                        return (
                            <Col key={index} xs={6} sm={6} md={3} lg={3} className="d-flex">
                                <div
                                    className="w-100 p-3 text-center rounded-4 position-relative overflow-hidden"
                                    style={{ ...cardBase, minHeight: '130px' }}
                                    onClick={() => handleCopyMfs(option.number, index)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-7px) scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.15), 0 6px 20px rgba(0,0,0,0.12)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)';
                                    }}
                                >
                                    <div>
                                        <div className="d-flex justify-content-center mb-2">
                                            <div className="position-relative">
                                                <img src={option.image} alt={option.title}
                                                    style={{ maxWidth: '45px', maxHeight: '30px', objectFit: 'contain', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.1))' }}
                                                    className="payment-icon"
                                                />
                                                <div style={{ position: 'absolute', top: '-3px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', borderRadius: '50%', background: 'radial-gradient(circle, #4CAF50, #2E7D32)', opacity: '0.8' }}></div>
                                            </div>
                                        </div>
                                        <div className="mb-2" style={{ fontSize: '0.9rem', fontWeight: '700', color: '#212529' }}>
                                            {option.title}
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center gap-2 mt-auto" style={numberPill}>
                                        <span style={{ letterSpacing: '0.5px', fontSize: '0.78rem' }}>{option.number}</span>
                                        {isCopied ? <FaCheck size={10} color="#198754" /> : <FaCopy size={10} color="#6c757d" />}
                                    </div>
                                    {isCopied && (
                                        <div className="position-absolute" style={{ top: '8px', right: '8px', backgroundColor: 'rgba(25,135,84,0.95)', color: '#fff', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '20px', zIndex: 10, fontWeight: '600', animation: 'fadeInScale 0.3s ease-out' }}>
                                            Copied!
                                        </div>
                                    )}
                                </div>
                            </Col>
                        );
                    })}
                </Row>

                {/* Row 2 — Bank Payment (full-width centered) */}
                <Row className="g-3 justify-content-center mx-0">
                    <Col xs={12} sm={10} md={8} lg={6}>
                        <div
                            className="w-100 p-4 text-center rounded-4 position-relative overflow-hidden"
                            style={{
                                ...cardBase,
                                border: '2px solid #0d6efd55',
                                background: 'linear-gradient(135deg, #fff 75%, #e8f0ff 100%)',
                                minHeight: '140px'
                            }}
                            onClick={() => handleCopyBank(bankOption.number)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-7px) scale(1.01)';
                                e.currentTarget.style.boxShadow = '0 12px 35px rgba(13,110,253,0.15), 0 6px 20px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)';
                            }}
                        >
                            <div>
                                <div className="d-flex justify-content-center mb-2">
                                    <img src={bankOption.image} alt={bankOption.title}
                                        style={{ maxWidth: '80px', maxHeight: '40px', objectFit: 'contain', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.1))' }}
                                    />
                                </div>
                                <div className="mb-2" style={{ fontSize: '1rem', fontWeight: '700', color: '#212529' }}>
                                    {bankOption.title}
                                </div>

                                {/* Badge */}
                                <div className="mb-3 text-center">
                                    <span style={{
                                        backgroundColor: '#0d6efd',
                                        color: '#ffffff',
                                        padding: '5px 14px',
                                        borderRadius: '50px',
                                        fontWeight: 'bold',
                                        fontSize: '0.7rem',
                                        display: 'inline-block',
                                        boxShadow: '0 2px 6px rgba(13,110,253,0.35)'
                                    }}>
                                        🏦 ব্যাংক পেমেন্ট (Bank Payment)
                                    </span>
                                </div>

                                {/* Bank Details */}
                                <div className="text-start text-muted border-top pt-2 mb-2" style={{ fontSize: '0.8rem' }}>
                                    <div className="d-flex justify-content-between mb-1 gap-2">
                                        <span>A/C Name:</span>
                                        <span className="fw-bold text-dark text-end">{bankOption.accountName}</span>
                                    </div>
                                    <div className="d-flex justify-content-between gap-2 mb-2">
                                        <span>Branch:</span>
                                        <span className="fw-bold text-dark text-end">{bankOption.branch}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-center gap-2 mt-auto" style={numberPill}>
                                <span style={{ letterSpacing: '0.5px' }}>{bankOption.number}</span>
                                {copiedBank ? <FaCheck size={10} color="#198754" /> : <FaCopy size={10} color="#6c757d" />}
                            </div>

                            {copiedBank && (
                                <div className="position-absolute" style={{ top: '10px', right: '10px', backgroundColor: 'rgba(25,135,84,0.95)', color: '#fff', fontSize: '0.75rem', padding: '5px 10px', borderRadius: '25px', zIndex: 10, fontWeight: '600', animation: 'fadeInScale 0.3s ease-out' }}>
                                    Copied!
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>

            <style>{`
                @keyframes fadeInScale {
                    0% { opacity: 0; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default SmallPaymentOptions;