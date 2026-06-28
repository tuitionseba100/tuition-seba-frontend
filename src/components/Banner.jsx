import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { FaGooglePlay, FaInfoCircle, FaGift, FaCheckCircle, FaExclamationTriangle, FaRocket, FaUsers } from 'react-icons/fa';

const TutorSection = () => {
    const navigate = useNavigate();
    const [showReferModal, setShowReferModal] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [referModalTab, setReferModalTab] = useState('teacher');

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTooltip(true);
        }, 4000); // Show tooltip hint after 4 seconds
        return () => clearTimeout(timer);
    }, []);

    const sectionStyle = {
        position: 'relative',
        overflow: 'hidden',
        padding: '50px 0 70px 0', // Reduced bottom padding to tighten gap
        background: 'linear-gradient(135deg, #004085 0%, #0066cc 100%)',
        color: 'white',
        textAlign: 'center',
    };

    const badgeStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '10px 24px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '100px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '600',
        letterSpacing: '0.5px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    };

    const titleStyle = {
        fontWeight: '800', // Bolder
        fontSize: 'calc(1.2rem + 1.2vw)', // Smaller responsive font
        marginBottom: '10px',
        position: 'relative',
        display: 'inline-block',
        letterSpacing: '-0.5px',
        lineHeight: '1.2',
    };

    const subtitleStyle = {
        fontWeight: '400',
        fontSize: '1rem', // Smaller subtitle
        marginBottom: '20px',
        opacity: 0.9,
        maxWidth: '700px',
        margin: '0 auto 20px auto',
    };

    const buttonBaseStyle = {
        fontWeight: '700',
        borderRadius: '50px', // More pill-shaped
        padding: '16px 40px',
        fontSize: '1.1rem',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        minWidth: '220px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    };

    const bubbleVariants = {
        animate: {
            y: [0, -60, 0], // Larger movement
            opacity: [0.3, 0.6, 0.3],
            transition: {
                duration: 8, // Slower for premium feel
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <motion.section
            style={sectionStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Background Decorative Elements */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    variants={bubbleVariants}
                    animate="animate"
                    style={{
                        position: 'absolute',
                        bottom: `${10 + Math.random() * 50}%`,
                        left: `${Math.random() * 95}%`,
                        width: `${40 + Math.random() * 80}px`, // Larger decorative elements
                        height: `${40 + Math.random() * 80}px`,
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '50%',
                        filter: 'blur(8px)',
                        zIndex: 0,
                    }}
                />
            ))}

            <Container style={{ position: 'relative', zIndex: 2 }}>
                <Row className="justify-content-center">
                    <Col lg={10}>
                        {/* Theme-Standard High-Highlight (Compact Full Bangla) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{
                                delay: 0.4,
                                duration: 1.2,
                                type: 'spring',
                                stiffness: 50,
                                damping: 20
                            }}
                            style={{
                                marginBottom: '40px',
                                display: 'flex',
                                justifyContent: 'center',
                                position: 'relative',
                            }}
                        >
                            {/* Theme Cyan Aura (Compact) */}
                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                                style={{
                                    position: 'absolute',
                                    top: '-70px',
                                    left: '-70px',
                                    right: '-70px',
                                    bottom: '-70px',
                                    background: 'radial-gradient(circle, rgba(97, 218, 251, 0.15) 0%, transparent 65%)',
                                    zIndex: -1,
                                    filter: 'blur(50px)',
                                    pointerEvents: 'none',
                                }}
                            />

                            <motion.a
                                href="https://play.google.com/store/apps/details?id=com.tuitionseba.forumv2&pcampaignid=web_share"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    padding: '1.5px',
                                    borderRadius: '100px',
                                    background: 'linear-gradient(135deg, #61dafb, #00d2ff, #61dafb, #3498db)',
                                    backgroundSize: '300% 300%',
                                    animation: 'theme-glow 6s ease infinite',
                                    boxShadow: '0 15px 40px rgba(97, 218, 251, 0.25)',
                                    position: 'relative'
                                }}
                                whileHover={{
                                    scale: 1.03,
                                    y: -4,
                                    boxShadow: '0 25px 50px rgba(97, 218, 251, 0.35)',
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <style>
                                    {`
                                        @keyframes theme-glow {
                                            0% { background-position: 0% 50%; }
                                            50% { background-position: 100% 50%; }
                                            100% { background-position: 0% 50%; }
                                        }
                                    `}
                                </style>

                                <div style={{
                                    background: 'rgba(10, 20, 35, 0.94)',
                                    backdropFilter: 'blur(30px) saturate(180%)',
                                    borderRadius: '98px',
                                    padding: '12px 32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '18px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(97, 218, 251, 0.25)',
                                }}>
                                    {/* Glass Shimmer */}
                                    <motion.div
                                        animate={{ left: ['-150%', '250%'] }}
                                        transition={{ repeat: Infinity, duration: 4, ease: 'linear', repeatDelay: 2 }}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            width: '100px',
                                            height: '100%',
                                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
                                            transform: 'skewX(-35deg)',
                                            zIndex: 1,
                                        }}
                                    />

                                    {/* Icon Package (Small) */}
                                    <div style={{
                                        position: 'relative',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                            style={{
                                                position: 'absolute',
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                background: 'rgba(61, 220, 132, 0.2)',
                                                filter: 'blur(10px)',
                                            }}
                                        />
                                        <FaGooglePlay style={{ fontSize: '2.2rem', color: '#3DDC84', zIndex: 1, filter: 'drop-shadow(0 0 10px rgba(61, 220, 132, 0.5))' }} />
                                    </div>

                                    {/* Content Area (Small Gap) */}
                                    <div style={{ textAlign: 'left', flex: 1 }}>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            fontWeight: '700',
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            marginBottom: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            gap: '8px'
                                        }}>
                                            <span style={{ opacity: 0.8 }}>আমরা এখন</span>
                                            <motion.span
                                                animate={{
                                                    boxShadow: ['0 0 10px rgba(97, 218, 251, 0.2)', '0 0 20px rgba(97, 218, 251, 0.4)', '0 0 10px rgba(97, 218, 251, 0.2)'],
                                                }}
                                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                                style={{
                                                    background: 'rgba(97, 218, 251, 0.12)',
                                                    color: '#61dafb',
                                                    padding: '3px 14px',
                                                    borderRadius: '40px',
                                                    border: '1px solid rgba(97, 218, 251, 0.3)',
                                                    fontWeight: '800',
                                                    fontSize: '0.95rem',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                গুগল প্লে স্টোরে
                                            </motion.span>
                                        </div>
                                        <div style={{
                                            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                                            fontWeight: '800',
                                            color: '#ffffff',
                                            lineHeight: '1.2',
                                            letterSpacing: '-0.3px',
                                        }}>
                                            এক ক্লিকে আবেদন করুন এবং সকল ফিচার আনলক করুন
                                        </div>
                                        <div style={{
                                            marginTop: '4px',
                                            fontSize: '0.9rem',
                                            color: '#61dafb',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '1px 8px',
                                                background: 'rgba(97, 218, 251, 0.15)',
                                                borderRadius: '3px',
                                                border: '1px solid rgba(97, 218, 251, 0.25)',
                                                fontWeight: '800'
                                            }}>নতুন</span>
                                            অফিসিয়াল অ্যাপ প্রস্তুত
                                        </div>
                                    </div>

                                    {/* Simple Arrow (Small) */}
                                    <motion.div
                                        animate={{ x: [0, 8, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                        style={{
                                            fontSize: '2rem',
                                            color: '#61dafb',
                                            opacity: 0.8
                                        }}
                                    >
                                        →
                                    </motion.div>
                                </div>
                            </motion.a>
                        </motion.div>

                        {/* Premium Referral Card */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '45px', padding: '0 15px' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                onClick={() => setShowReferModal(true)}
                                whileHover={{ scale: 1.02, y: -3, boxShadow: '0 20px 40px rgba(76, 175, 80, 0.25)' }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    background: 'rgba(10, 30, 20, 0.85)',
                                    backdropFilter: 'blur(20px) saturate(160%)',
                                    border: '1px solid rgba(76, 175, 80, 0.35)',
                                    borderRadius: '24px',
                                    padding: '16px 28px',
                                    maxWidth: '680px',
                                    width: '100%',
                                    cursor: 'pointer',
                                    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '20px',
                                    textAlign: 'left',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Glowing Aura Effect */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-50%',
                                    left: '-20%',
                                    width: '200px',
                                    height: '200px',
                                    background: 'radial-gradient(circle, rgba(76, 175, 80, 0.15) 0%, transparent 70%)',
                                    pointerEvents: 'none'
                                }} />

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
                                        width: '46px',
                                        height: '46px',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        boxShadow: '0 8px 20px rgba(76, 175, 80, 0.4)'
                                    }}>
                                        <FaGift style={{ color: '#fff', fontSize: '1.4rem' }} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#fff', letterSpacing: '-0.2px' }}>
                                                রেফারেল প্রোগ্রাম
                                            </span>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                padding: '2px 8px',
                                                background: 'rgba(76, 175, 80, 0.2)',
                                                color: '#81c784',
                                                borderRadius: '6px',
                                                border: '1px solid rgba(76, 175, 80, 0.3)',
                                                fontWeight: '700',
                                                textTransform: 'uppercase'
                                            }}>
                                                UP TO 15%
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#a5d6a7', marginTop: '3px', opacity: 0.9 }}>
                                            শিক্ষক রেফার করুন বা টিউশন রেফার করুন — দুটোতেই বোনাস উপার্জন করুন!
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', minWidth: '95px', zIndex: 2 }}>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        style={{
                                            borderRadius: '100px',
                                            padding: '8px 18px',
                                            fontSize: '0.8rem',
                                            fontWeight: '800',
                                            background: 'linear-gradient(135deg, #4caf50, #1b5e20)',
                                            border: 'none',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            boxShadow: '0 8px 15px rgba(76, 175, 80, 0.3)'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowReferModal(true);
                                        }}
                                    >
                                        <FaInfoCircle /> বিস্তারিত
                                    </Button>
                                </div>
                            </motion.div>
                        </div>

                        <Modal
                            show={showReferModal}
                            onHide={() => setShowReferModal(false)}
                            centered
                            size="lg"
                            dialogClassName="referral-modal-premium"
                        >
                            <div style={{
                                background: '#ffffff',
                                border: '1px solid rgba(76, 175, 80, 0.15)',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.15), 0 0 40px rgba(76, 175, 80, 0.04)',
                                color: '#2e4a32'
                            }}>
                                {/* Header */}
                                <div style={{
                                    padding: '18px 28px 0',
                                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(76, 175, 80, 0.02) 100%)',
                                    borderBottom: '1px solid rgba(76, 175, 80, 0.12)',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px', height: '40px', borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)'
                                            }}>
                                                <FaGift size={18} color="#fff" />
                                            </div>
                                            <div>
                                                <h5 style={{ margin: 0, fontWeight: '800', color: '#1b5e20', fontSize: '1.05rem', letterSpacing: '-0.3px' }}>
                                                    🎁 টিউশন সেবা ফোরাম – Referral Program
                                                </h5>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowReferModal(false)}
                                            style={{
                                                background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)',
                                                borderRadius: '10px', color: 'rgba(0,0,0,0.4)',
                                                width: '34px', height: '34px', fontSize: '1.2rem',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', transition: 'all 0.2s', lineHeight: 1
                                            }}
                                            onMouseEnter={(e) => { e.target.style.background = 'rgba(0,0,0,0.08)'; e.target.style.color = '#000'; }}
                                            onMouseLeave={(e) => { e.target.style.background = 'rgba(0,0,0,0.04)'; e.target.style.color = 'rgba(0,0,0,0.4)'; }}
                                        >&times;</button>
                                    </div>

                                    {/* Tab Switcher */}
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => setReferModalTab('teacher')}
                                            style={{
                                                padding: '9px 18px',
                                                borderRadius: '8px 8px 0 0',
                                                border: 'none',
                                                fontWeight: '700',
                                                fontSize: '0.82rem',
                                                cursor: 'pointer',
                                                background: referModalTab === 'teacher' ? '#2E7D32' : 'rgba(76, 175, 80, 0.1)',
                                                color: referModalTab === 'teacher' ? '#fff' : '#2e7d32',
                                                transition: 'all 0.2s',
                                                borderBottom: referModalTab === 'teacher' ? 'none' : '2px solid transparent',
                                            }}
                                        >
                                            👨‍🏫 শিক্ষক রেফার সম্পর্কে জানতে এখানে ক্লিক করুন
                                        </button>
                                        <button
                                            onClick={() => setReferModalTab('tuition')}
                                            style={{
                                                padding: '9px 18px',
                                                borderRadius: '8px 8px 0 0',
                                                border: 'none',
                                                fontWeight: '700',
                                                fontSize: '0.82rem',
                                                cursor: 'pointer',
                                                background: referModalTab === 'tuition' ? '#1565C0' : 'rgba(21, 101, 192, 0.1)',
                                                color: referModalTab === 'tuition' ? '#fff' : '#1565C0',
                                                transition: 'all 0.2s',
                                                borderBottom: referModalTab === 'tuition' ? 'none' : '2px solid transparent',
                                            }}
                                        >
                                            💼 টিউশন রেফার সম্পর্কে জানতে এখানে ক্লিক করুন
                                        </button>
                                    </div>
                                </div>

                                {/* Body */}
                                <div style={{ padding: '22px 28px', maxHeight: '62vh', overflowY: 'auto' }}>

                                    {/* ===== TEACHER REFER TAB ===== */}
                                    {referModalTab === 'teacher' && (
                                        <div>
                                            <p style={{ fontSize: '0.93rem', color: '#2e4a32', marginBottom: '18px', lineHeight: '1.7', fontWeight: '500' }}>
                                                বিশ্বস্ত শিক্ষক কমিউনিটি আরও বড় করতে এখন থেকে আপনি আপনার পরিচিত শিক্ষককে রেফার করে বোনাস উপার্জন করতে পারবেন।
                                            </p>

                                            <div style={{ marginBottom: '18px' }}>
                                                <h6 style={{ fontWeight: '700', color: '#1b5e20', marginBottom: '10px', fontSize: '1rem' }}>✅ কীভাবে কাজ করবে?</h6>
                                                <div style={{ background: '#f8faf8', border: '1px solid rgba(76, 175, 80, 0.12)', borderRadius: '12px', padding: '14px 18px' }}>
                                                    <p style={{ fontWeight: '600', marginBottom: '8px', fontSize: '0.88rem' }}>আপনার Phone Number ব্যবহার করে কোনো নতুন শিক্ষক রেজিস্ট্রেশন করলে:</p>
                                                    <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                        {['সফলভাবে রেজিস্ট্রেশন সম্পন্ন করলে', 'প্রয়োজনীয় তথ্য ও ডকুমেন্ট সাবমিট করলে', 'প্রোফাইল ভেরিফিকেশন সম্পন্ন হলে'].map((t, i) => (
                                                            <li key={i} style={{ fontSize: '0.86rem', color: '#2e4a32', display: 'flex', gap: '6px' }}><span>•</span><span>{t}</span></li>
                                                        ))}
                                                    </ul>
                                                    <p style={{ fontWeight: '600', margin: 0, fontSize: '0.88rem', color: '#1b5e20' }}>তাহলে সেটি একটি Valid Referral হিসেবে গণ্য হবে।</p>
                                                </div>
                                            </div>

                                            <div style={{ background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(46, 125, 50, 0.03) 100%)', border: '1px solid rgba(76, 175, 80, 0.15)', borderRadius: '14px', padding: '16px 22px', marginBottom: '18px', textAlign: 'center' }}>
                                                <h6 style={{ fontWeight: '800', color: '#1b5e20', marginBottom: '6px', fontSize: '1rem' }}>💰 Referral Bonus:</h6>
                                                <p style={{ fontSize: '0.95rem', color: '#2E7D32', fontWeight: '700', margin: 0 }}>প্রতিটি সফল ও ভেরিফাইড শিক্ষক রেফারেলের জন্য আপনি পাবেন ৫০ টাকা বোনাস।</p>
                                            </div>

                                            <div style={{ marginBottom: '18px' }}>
                                                <h6 style={{ fontWeight: '700', color: '#e65100', marginBottom: '10px', fontSize: '1rem' }}>📌 গুরুত্বপূর্ণ শর্তাবলী:</h6>
                                                <div style={{ background: 'rgba(230, 81, 0, 0.04)', border: '1px solid rgba(230, 81, 0, 0.12)', borderRadius: '12px', padding: '14px 18px' }}>
                                                    <ul style={{ margin: 0, paddingLeft: 0, color: '#4e342e', fontSize: '0.84rem', lineHeight: '2', listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                        {[
                                                            '১. শুধুমাত্র টিউশন সেবা ফোরাম-এর নিবন্ধিত শিক্ষকরা রেফার করতে পারবেন।',
                                                            '২. ভুয়া, ডুপ্লিকেট বা অসম্পূর্ণ অ্যাকাউন্টের ক্ষেত্রে কোনো বোনাস প্রদান করা হবে না।',
                                                            '৩. একই ব্যক্তি একাধিক অ্যাকাউন্ট খুললে referral বাতিল বলে গণ্য হবে।',
                                                            '৪. Referral bonus নির্দিষ্ট সময় পর পর বিকাশ/নগদ বা মোবাইল রিচার্জে প্রদান করা হবে।',
                                                            '৫. একজন শিক্ষক যত খুশি সংখ্যক referral করতে পারবেন।',
                                                            '৬. টিউশন সেবা ফোরাম যেকোনো সময় এই প্রোগ্রামের নিয়মাবলী পরিবর্তন বা বাতিল করার অধিকার রাখে।'
                                                        ].map((t, i) => (<li key={i}>{t}</li>))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '18px' }}>
                                                <h6 style={{ fontWeight: '700', color: '#2e7d32', marginBottom: '10px', fontSize: '1rem' }}>🚀 কীভাবে Referral করবেন?</h6>
                                                <div style={{ background: 'rgba(76,175,80,0.02)', border: '1px solid rgba(76,175,80,0.1)', borderRadius: '12px', padding: '14px 18px' }}>
                                                    <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        {[
                                                            'আপনার পরিচিতদের টিউশন সেবা ফোরাম সম্পর্কে জানান',
                                                            'আগ্রহী হলে তাদের ওয়েবসাইটে বায়োডাটা সম্পূর্ণ করতে বলুন',
                                                            'Registration Form-এর "Refer" অপশনে আপনার Phone number ব্যবহার করতে বলুন'
                                                        ].map((t, i) => (
                                                            <li key={i} style={{ fontSize: '0.86rem', color: '#2e4a32', display: 'flex', gap: '6px' }}><span>•</span><span>{t}</span></li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'center', paddingTop: '14px', borderTop: '1px solid rgba(76, 175, 80, 0.1)' }}>
                                                <div style={{ color: '#2e7d32', fontWeight: '700', fontSize: '0.9rem' }}>আজই আপনার শিক্ষক নেটওয়ার্ককে যুক্ত করুন টিউশন সেবা ফোরাম-এর সাথে।</div>
                                                <div style={{ fontSize: '0.85rem', color: '#2e4a32', fontWeight: '500', marginTop: '4px' }}>একসাথে গড়ে তুলি একটি বিশ্বস্ত ও স্মার্ট শিক্ষক কমিউনিটি।</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ===== TUITION REFER TAB ===== */}
                                    {referModalTab === 'tuition' && (
                                        <div>
                                            <div style={{ background: 'linear-gradient(135deg, rgba(21, 101, 192, 0.06) 0%, rgba(21, 101, 192, 0.01) 100%)', border: '1px solid rgba(21, 101, 192, 0.12)', borderRadius: '12px', padding: '14px 18px', marginBottom: '18px' }}>
                                                <p style={{ fontSize: '0.91rem', color: '#1a237e', fontWeight: '500', lineHeight: '1.7', margin: 0 }}>
                                                    আপনার পরিচিত কোনো অভিভাবক, শিক্ষার্থী বা প্রতিষ্ঠানের জন্য গৃহশিক্ষক প্রয়োজন?<br /><br />
                                                    এখন থেকে আপনার রেফারেন্সে কেউ যদি <strong>টিউশন সেবা ফোরাম</strong>-এর মাধ্যমে সফলভাবে শিক্ষক কনফার্ম করেন, তাহলে আপনাকে প্রদান করা হবে বিশেষ <strong>Referral Commission</strong>।
                                                </p>
                                            </div>

                                            <div style={{ background: 'linear-gradient(135deg, rgba(21, 101, 192, 0.08) 0%, rgba(21, 101, 192, 0.02) 100%)', border: '1px solid rgba(21, 101, 192, 0.15)', borderRadius: '14px', padding: '16px 22px', marginBottom: '18px', textAlign: 'center' }}>
                                                <h6 style={{ fontWeight: '800', color: '#1565C0', marginBottom: '6px', fontSize: '1rem' }}>💰 Referral Commission:</h6>
                                                <p style={{ fontSize: '0.93rem', color: '#0d47a1', fontWeight: '700', margin: 0 }}>
                                                    সফলভাবে টিউশন কনফার্ম হলে শিক্ষকের প্রথম মাসের নির্ধারিত বেতনের <span style={{ fontSize: '1.05rem', color: '#1565C0' }}>১৫% পর্যন্ত</span> Referral Bonus প্রদান করা হবে।
                                                </p>
                                            </div>

                                            <div style={{ marginBottom: '18px' }}>
                                                <h6 style={{ fontWeight: '700', color: '#1565C0', marginBottom: '10px', fontSize: '1rem' }}>📌 কীভাবে এটি কাজ করবে?</h6>
                                                <div style={{ background: 'rgba(21, 101, 192, 0.03)', border: '1px solid rgba(21, 101, 192, 0.1)', borderRadius: '12px', padding: '14px 18px' }}>
                                                    <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        {[
                                                            'আপনি অভিভাবক বা শিক্ষার্থীর তথ্য আমাদের কাছে শেয়ার করবেন',
                                                            'আমাদের টিম উপযুক্ত শিক্ষক ম্যানেজ করবে',
                                                            'শিক্ষক সফলভাবে কনফার্ম ও ক্লাস শুরু করলে আপনার referral valid হিসেবে গণ্য হবে'
                                                        ].map((t, i) => (
                                                            <li key={i} style={{ fontSize: '0.86rem', color: '#1a237e', display: 'flex', gap: '6px' }}><span style={{ color: '#1565C0', fontWeight: '700' }}>•</span><span>{t}</span></li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '18px' }}>
                                                <h6 style={{ fontWeight: '700', color: '#e65100', marginBottom: '10px', fontSize: '1rem' }}>📋 গুরুত্বপূর্ণ শর্তাবলী:</h6>
                                                <div style={{ background: 'rgba(230, 81, 0, 0.04)', border: '1px solid rgba(230, 81, 0, 0.12)', borderRadius: '12px', padding: '14px 18px' }}>
                                                    <ul style={{ margin: 0, paddingLeft: 0, color: '#4e342e', fontSize: '0.84rem', lineHeight: '2', listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                        {[
                                                            '১. যেকোনো ব্যক্তি Referral Partner হিসেবে যুক্ত হতে পারবেন।',
                                                            '২. Referral claim করার জন্য অভিভাবকের তথ্য দেওয়ার সময় অবশ্যই আপনার নাম ও মোবাইল নম্বর উল্লেখ করতে হবে।',
                                                            '৩. শুধুমাত্র সফলভাবে কনফার্ম হওয়া টিউশনের ক্ষেত্রেই Referral Commission প্রযোজ্য হবে।',
                                                            '৪. শিক্ষক ক্লাস শুরু করার পর এবং প্রথম মাসের ফি সম্পন্ন হওয়ার পর কমিশন প্রদান করা হবে।',
                                                            '৫. ভুয়া, অসম্পূর্ণ বা duplicate তথ্যের ক্ষেত্রে referral বাতিল বলে গণ্য হবে।',
                                                            '৬. Tuition cancellation, payment dispute বা early discontinuation-এর ক্ষেত্রে কমিশন সমন্বয় করার অধিকার টিউশন সেবা ফোরাম সংরক্ষণ করে।',
                                                            '৭. একজন Referral Partner যত খুশি সংখ্যক referral করতে পারবেন।'
                                                        ].map((t, i) => (<li key={i}>{t}</li>))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '18px' }}>
                                                <h6 style={{ fontWeight: '700', color: '#1565C0', marginBottom: '10px', fontSize: '1rem' }}>🚀 কীভাবে শুরু করবেন?</h6>
                                                <div style={{ background: 'rgba(21, 101, 192, 0.03)', border: '1px solid rgba(21, 101, 192, 0.1)', borderRadius: '12px', padding: '14px 18px' }}>
                                                    <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        {[
                                                            'অভিভাবকের প্রয়োজনীয় তথ্য সংগ্রহ করুন',
                                                            'Website-এ Find Tutor option ব্যবহার করুন / আমাদের অফিসিয়াল নম্বরে তথ্য পাঠান: 01633920928 / 01891644064',
                                                            'Referral হিসেবে নিজের নাম ও মোবাইল নম্বর উল্লেখ করুন',
                                                            'Tuition successfully continue হলে কমিশন গ্রহণ করুন'
                                                        ].map((t, i) => (
                                                            <li key={i} style={{ fontSize: '0.86rem', color: '#1a237e', display: 'flex', gap: '6px' }}><span style={{ color: '#1565C0', fontWeight: '700' }}>•</span><span>{t}</span></li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'center', paddingTop: '14px', borderTop: '1px solid rgba(21, 101, 192, 0.1)' }}>
                                                <div style={{ color: '#1565C0', fontWeight: '700', fontSize: '0.9rem' }}>আসুন একসাথে গড়ে তুলি একটি বিশ্বস্ত ও স্মার্ট টিউশন নেটওয়ার্ক।</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div style={{
                                    padding: '14px 28px',
                                    borderTop: `1px solid ${referModalTab === 'tuition' ? 'rgba(21, 101, 192, 0.12)' : 'rgba(76, 175, 80, 0.1)'}`,
                                    display: 'flex', justifyContent: 'flex-end',
                                    background: '#f8faf8'
                                }}>
                                    <Button
                                        style={{
                                            background: 'rgba(0,0,0,0.04)',
                                            border: '1px solid rgba(0,0,0,0.08)',
                                            borderRadius: '10px', color: 'rgba(0,0,0,0.7)',
                                            padding: '8px 20px', fontWeight: '600', fontSize: '0.82rem',
                                            transition: 'all 0.2s'
                                        }}
                                        onClick={() => setShowReferModal(false)}
                                        onMouseEnter={(e) => { e.target.style.background = 'rgba(0,0,0,0.08)'; e.target.style.color = '#000'; }}
                                        onMouseLeave={(e) => { e.target.style.background = 'rgba(0,0,0,0.04)'; e.target.style.color = 'rgba(0,0,0,0.7)'; }}
                                    >
                                        বন্ধ করুন
                                    </Button>
                                </div>
                            </div>
                        </Modal>


                        <motion.h2
                            style={titleStyle}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Find the Perfect Tutor or Tuition Services
                            <motion.span
                                style={{
                                    position: 'absolute',
                                    bottom: '-10px',
                                    left: '50%',
                                    height: '4px',
                                    width: '80px',
                                    backgroundColor: '#61dafb', // Accent color
                                    borderRadius: '2px',
                                    translateX: '-50%'
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: 80 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                            />
                        </motion.h2>

                        <motion.p
                            style={subtitleStyle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            Connect with expert tutors tailored to your educational needs and achieve your learning goals with Tuition Seba Forum.
                        </motion.p>

                        <Row className="justify-content-center g-4">
                            <Col xs="auto">
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                                        backgroundColor: '#f8f9fa'
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        ...buttonBaseStyle,
                                        backgroundColor: 'white',
                                        color: '#004085',
                                        border: 'none',
                                    }}
                                    onClick={() => navigate('/tuitions')}
                                >
                                    AVAILABLE TUITIONS
                                </motion.button>
                            </Col>
                            <Col xs="auto">
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        ...buttonBaseStyle,
                                        backgroundColor: 'transparent',
                                        color: 'white',
                                        border: '2px solid white',
                                    }}
                                    onClick={() => navigate('/findTutor')}
                                >
                                    FIND TUTOR
                                </motion.button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            {/* Wave Separator at Bottom */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                overflow: 'hidden',
                lineHeight: 0,
                zIndex: 1
            }}>
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '60px' }}
                >
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        fill="#ffffff"
                    ></path>
                </svg>
            </div>
        </motion.section>
    );
};

export default TutorSection;
