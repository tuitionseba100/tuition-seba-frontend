import React, { useState } from 'react';
import { FaPhoneAlt, FaWhatsapp, FaCopy } from 'react-icons/fa';

const OFFICE_PHONE = '+8801633920928';
const WHATSAPP_NUMBER = '8801571305804';

const SuspendedWarningModal = ({ show, onClose }) => {
    const [copied, setCopied] = useState(false);

    if (!show) return null;

    const copyPhone = () => {
        navigator.clipboard.writeText(OFFICE_PHONE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const openWhatsApp = () => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1200,
                padding: 16,
            }}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: 20,
                    maxWidth: 480,
                    width: '100%',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
                    overflow: 'hidden',
                    fontFamily: "'Hind Siliguri', 'SolaimanLipi', sans-serif",
                    animation: 'modalPop 0.25s ease',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, #b91c1c, #dc2626)',
                        padding: '28px 24px 20px',
                        textAlign: 'center',
                        color: '#fff',
                    }}
                >
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 14px',
                            border: '2px solid rgba(255,255,255,0.4)',
                        }}
                    >
                        <FaPhoneAlt size={26} color="#fff" />
                    </div>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: 0.5 }}>
                        অফিসে যোগাযোগ করুন
                    </h2>
                    <p style={{ margin: '8px 0 0', fontSize: 14, opacity: 0.85, fontWeight: 400 }}>
                        Please Contact Office
                    </p>
                </div>

                {/* Body */}
                <div style={{ padding: '28px 28px 16px', textAlign: 'center' }}>
                    <p
                        style={{
                            fontSize: 18,
                            color: '#b91c1c',
                            lineHeight: 1.8,
                            marginBottom: 6,
                            fontWeight: 700,
                        }}
                    >
                        দুঃখিত! 😔
                    </p>
                    <p
                        style={{
                            fontSize: 16,
                            color: '#1f1f1f',
                            lineHeight: 1.85,
                            marginBottom: 20,
                            fontWeight: 500,
                        }}
                    >
                        আপনার টিউশন অ্যাপ্লাই নেওয়া হচ্ছে না।
                        অনুগ্রহ করে আমাদের অফিসে যোগাযোগ করুন।
                    </p>

                    {/* Office contact box */}
                    <div
                        style={{
                            backgroundColor: '#fef2f2',
                            border: '1.5px solid #fca5a5',
                            borderRadius: 14,
                            padding: '18px 20px',
                            marginBottom: 20,
                        }}
                    >
                        <p
                            style={{
                                fontSize: 13,
                                color: '#7f1d1d',
                                fontWeight: 600,
                                marginBottom: 12,
                                textTransform: 'uppercase',
                                letterSpacing: 0.8,
                            }}
                        >
                            📞 অফিস যোগাযোগ
                        </p>

                        {/* Phone copy button */}
                        <button
                            onClick={copyPhone}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '10px 18px',
                                borderRadius: 10,
                                backgroundColor: copied ? '#dcfce7' : '#fff',
                                border: `1.5px solid ${copied ? '#86efac' : '#dc2626'}`,
                                cursor: 'pointer',
                                fontWeight: 700,
                                color: copied ? '#166534' : '#dc2626',
                                fontSize: 17,
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 8px rgba(220,38,38,0.12)',
                                marginBottom: 12,
                            }}
                        >
                            <FaPhoneAlt size={15} />
                            {copied ? '✅ কপি হয়েছে!' : OFFICE_PHONE}
                            <FaCopy size={14} style={{ opacity: 0.6 }} />
                        </button>

                        {/* WhatsApp button */}
                        <div>
                            <button
                                onClick={openWhatsApp}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '10px 20px',
                                    borderRadius: 10,
                                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: 15,
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 14px rgba(34,197,94,0.35)',
                                    transition: 'transform 0.15s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                <FaWhatsapp size={18} />
                                WhatsApp-এ যোগাযোগ করুন
                            </button>
                        </div>
                    </div>

                    <p style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.7 }}>
                        আমাদের টিম আপনার সমস্যা সমাধানে সর্বদা প্রস্তুত।
                        অফিস টাইম: <strong>সকাল ৯টা – রাত ১০টা</strong>
                    </p>
                </div>

                {/* Footer */}
                <div
                    style={{
                        padding: '0 28px 28px',
                        textAlign: 'center',
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            padding: '12px 40px',
                            border: 'none',
                            borderRadius: 12,
                            backgroundColor: '#1e3a8a',
                            color: '#fff',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: 15,
                            letterSpacing: 0.4,
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e40af')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1e3a8a')}
                    >
                        বন্ধ করুন
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes modalPop {
                    from { transform: scale(0.88); opacity: 0; }
                    to   { transform: scale(1);    opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SuspendedWarningModal;
