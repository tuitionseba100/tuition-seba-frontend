import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGooglePlay } from 'react-icons/fa';

const TutorSection = () => {
    const navigate = useNavigate();

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
                                href="https://play.google.com/store/apps/details?id=com.tuitionseba.forum"
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
