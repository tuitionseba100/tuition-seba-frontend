import React, { useState } from 'react';
import { FaWhatsapp, FaCopy, FaStar } from 'react-icons/fa';

const CustomErrorModal = ({ show, message, onClose }) => {
    const [copied, setCopied] = useState(false);

    if (!show) return null;

    const phoneNumber = '+8801633920928';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(phoneNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openWhatsApp = () => {
        window.open(`https://wa.me/${phoneNumber.replace(/\D/g, '')}`, '_blank');
    };

    const goToPremiumPage = () => {
        window.location.href = '/teacherRegistration';
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1100,
                padding: 16,
            }}
        >
            <div
                style={{
                    background: 'linear-gradient(135deg, #fff, #f9f9f9)',
                    padding: 32,
                    borderRadius: 20,
                    maxWidth: 500,
                    width: '100%',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                    textAlign: 'center',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                <h3 style={{ color: '#d9534f', marginBottom: 16, fontSize: 24 }}>
                    ⚠️ Error
                </h3>
                <p style={{ color: '#333', marginBottom: 24, fontSize: 16 }}>{message}</p>

                {/* Contact Section */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ color: '#555', fontSize: 14, marginBottom: 12 }}>
                        যদি কোনো সমস্যার মুখোমুখি হন, আমাদের সাথে যোগাযোগ করুন:
                    </p>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '8px 16px',
                            borderRadius: 10,
                            backgroundColor: '#e6f0ff',
                            cursor: 'pointer',
                            fontWeight: 600,
                            color: '#3c81e1',
                            fontSize: 16,
                        }}
                        onClick={copyToClipboard}
                    >
                        {copied ? '✅ কপি হয়েছে' : '+880 1633-920928'}
                        <FaWhatsapp
                            size={18}
                            color="#25D366"
                            style={{ marginLeft: 6 }}
                            onClick={e => {
                                e.stopPropagation();
                                openWhatsApp();
                            }}
                        />
                        <FaCopy size={16} style={{ marginLeft: 6 }} />
                    </div>
                </div>

                {/* Premium Member Button */}
                <div style={{ marginBottom: 24 }}>
                    <button
                        onClick={goToPremiumPage}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '12px 20px',
                            borderRadius: 12,
                            background: 'linear-gradient(90deg, #ff7f50, #ffb347)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: 16,
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <FaStar /> প্রিমিয়াম সদস্য হতে এখানে ক্লিক করুন
                    </button>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: 10,
                        backgroundColor: '#3c81e1',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: 16,
                        transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3469c7'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3c81e1'}
                >
                    বন্ধ করুন
                </button>
            </div>
        </div>
    );
};

export default CustomErrorModal;
