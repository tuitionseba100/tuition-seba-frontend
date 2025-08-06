import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';

const TutorSection = () => {
    const navigate = useNavigate();

    const sectionStyle = {
        position: 'relative',
        overflow: 'hidden',
        padding: '60px 10px',
        color: 'white',
        textAlign: 'center',
        background: '#55b3e7',
    };

    const titleStyle = {
        fontWeight: '700',
        fontSize: '2.8rem',
        marginBottom: '20px',
        position: 'relative',
        display: 'inline-block',
    };

    const subtitleStyle = {
        fontWeight: '400',
        fontSize: '1.2rem',
        marginBottom: '40px',
        opacity: 0.95,
    };

    const buttonStyle = {
        fontWeight: '700',
        borderRadius: '30px',
        padding: '12px 30px',
        fontSize: '1rem',
        transition: 'all 0.3s ease-in-out',
        minWidth: '200px',
    };

    const bubbleVariants = {
        animate: {
            y: [0, -30, 0],
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <motion.section style={sectionStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>


            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    variants={bubbleVariants}
                    animate="animate"
                    style={{
                        position: 'absolute',
                        bottom: `${Math.random() * 30}%`,
                        left: `${Math.random() * 100}%`,
                        width: `${20 + Math.random() * 30}px`,
                        height: `${20 + Math.random() * 30}px`,
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '50%',
                        filter: 'blur(2px)',
                        zIndex: 0,
                    }}
                />
            ))}

            <Container>

                <motion.h2
                    style={titleStyle}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <span style={{ position: 'relative', zIndex: 2 }}>
                        Find the perfect tutor or tuition services
                    </span>
                    <motion.span
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: '100%',
                            background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                            transform: 'skewX(-20deg)',
                            zIndex: 1,
                            pointerEvents: 'none',
                        }}
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                </motion.h2>

                <motion.p
                    style={subtitleStyle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1 }}
                >
                    Connect with expert tutors tailored to your educational needs
                </motion.p>

                <Row className="justify-content-center gy-3">
                    <Col xs="auto">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(255,255,255,0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                ...buttonStyle,
                                backgroundColor: 'white',
                                color: '#222',
                                border: 'none',
                            }}
                            onClick={() => navigate('/tuitions')}
                        >
                            AVAILABLE TUITIONS
                        </motion.button>
                    </Col>
                    <Col xs="auto">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(255,255,255,0.6)' }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                ...buttonStyle,
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
            </Container>
        </motion.section>
    );
};

export default TutorSection;
