import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';

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
