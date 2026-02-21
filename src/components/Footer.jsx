import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div style={{ position: 'relative', marginTop: 'auto', overflow: 'visible' }}>
            {/* Wave Animation Styles */}
            <style>
                {`
                @keyframes wave-move {
                    0% { transform: translateX(0); }
                    50% { transform: translateX(-5%); }
                    100% { transform: translateX(0); }
                }
                .sea-wave {
                    animation: wave-move 10s ease-in-out infinite;
                    will-change: transform;
                }
                .sea-wave-delayed {
                    animation: wave-move 15s ease-in-out infinite;
                    animation-delay: -2s;
                    will-change: transform;
                }
                
                .social-icon-btn {
                    width: 45px;
                    height: 45px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    color: white;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .social-icon-btn:hover {
                    background: white;
                    color: #004085;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }

                .footer-links li {
                    margin-bottom: 12px;
                }
                .footer-links a {
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    transition: all 0.3s ease;
                    display: inline-block;
                }
                .footer-links a:hover {
                    color: #ffffff;
                    transform: translateX(5px);
                    text-shadow: 0 0 10px rgba(255,255,255,0.5);
                }

                .icon-wrapper {
                    min-width: 35px;
                    height: 35px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #61dafb;
                    font-size: 0.9rem;
                }

                .contact-info a:hover {
                    color: white !important;
                }
                `}
            </style>

            {/* Top Sea Tide Area (Animated Waves) */}
            <div style={{
                position: 'absolute',
                top: '-51px',
                left: 0,
                width: '100%',
                height: '55px',
                overflow: 'hidden',
                lineHeight: 0,
                transform: 'rotate(180deg)',
                zIndex: 3,
                pointerEvents: 'none',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
            }}>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" shapeRendering="geometricPrecision" style={{ position: 'absolute', width: '120%', height: '100%', left: '-10%', top: '-2px' }} className="sea-wave-delayed">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#004085" opacity="0.4" />
                </svg>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" shapeRendering="geometricPrecision" style={{ position: 'absolute', width: '115%', height: '100%', left: '-7.5%', top: '-1px' }} className="sea-wave">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#004085" opacity="0.6" />
                </svg>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" shapeRendering="geometricPrecision" style={{ position: 'absolute', width: '110%', height: '100%', left: '-5%', top: '-0.5px' }}>
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#004085" />
                </svg>
            </div>

            <footer style={{ background: "linear-gradient(135deg, #004085 0%, #0066cc 100%)", color: "#e0e6ed", paddingTop: "80px", paddingBottom: "30px", position: 'relative', zIndex: 1 }}>
                <Container>
                    <Row className="gy-5">
                        {/* Column 1: Brand */}
                        <Col lg={4} md={6}>
                            <div className="mb-4">
                                <h2 className="text-white fw-bold mb-3" style={{ letterSpacing: '1px' }}>Tuition Seba Forum</h2>
                                <div style={{ width: '60px', height: '4px', backgroundColor: '#61dafb', borderRadius: '2px' }}></div>
                            </div>
                            <p className="mb-4 text-white-50" style={{ lineHeight: "1.8", fontSize: '0.95rem' }}>
                                Connecting students with the perfect tutors. We are dedicated to providing quality education support through our platform.
                            </p>
                            <div className="d-flex gap-3">
                                <a href="https://facebook.com/groups/1003753066957594/" target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                                    <FaFacebookF />
                                </a>
                                <a href="https://wa.me/+8801571305804" target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                                    <FaWhatsapp />
                                </a>
                                <a href="https://tuitionsebaforum.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                                    <FaGlobe />
                                </a>
                            </div>
                        </Col>

                        {/* Column 2: Quick Links */}
                        <Col lg={2} md={6}>
                            <h5 className="text-white fw-bold mb-4">Quick Links</h5>
                            <ul className="list-unstyled footer-links">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/tuitions">Tuition Jobs</Link></li>
                                <li><Link to="/findTutor">Hire a Tutor</Link></li>
                                <li><Link to="/OurTeachers">Our Teachers</Link></li>
                                <li><Link to="/teacherRegistration">Become a Tutor</Link></li>
                            </ul>
                        </Col>

                        {/* Column 3: Support */}
                        <Col lg={2} md={6}>
                            <h5 className="text-white fw-bold mb-4">Support</h5>
                            <ul className="list-unstyled footer-links">
                                <li><Link to="/rules">Rules</Link></li>
                                <li><Link to="/privacy">Privacy Policy</Link></li>
                                <li><Link to="/payment">Payment Methods</Link></li>
                                <li><Link to="/#about-us">About Us</Link></li>
                            </ul>
                        </Col>

                        {/* Column 4: Contact */}
                        <Col lg={4} md={6}>
                            <h5 className="text-white fw-bold mb-4">Contact Us</h5>
                            <ul className="list-unstyled contact-info">
                                <li className="d-flex mb-3">
                                    <div className="icon-wrapper me-3">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <span className="text-white-50">২ নাম্বার গেইট, বিপ্লব উদ্যানের বিপরীতে, মোশারফ মার্কেট (৩য় তলা), চট্টগ্রাম।</span>
                                </li>
                                <li className="d-flex mb-3">
                                    <div className="icon-wrapper me-3">
                                        <FaPhoneAlt />
                                    </div>
                                    <a href="tel:01891644064" className="text-white-50 text-decoration-none">01891-644064</a>
                                </li>
                                <li className="d-flex mb-3">
                                    <div className="icon-wrapper me-3">
                                        <FaEnvelope />
                                    </div>
                                    <a href="mailto:info@tuitionsebaforum.com" className="text-white-50 text-decoration-none">info@tuitionsebaforum.com</a>
                                </li>
                            </ul>
                        </Col>
                    </Row>

                    <hr className="my-5" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                    <div className="row align-items-center copyright-section">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            <p className="mb-0 small text-white-50">
                                &copy; {new Date().getFullYear()} <span className="text-white fw-bold">Tuition Seba Forum</span>. All rights reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <ul className="list-inline mb-0">
                                <li className="list-inline-item mx-2"><a href="#" className="text-white-50 small text-decoration-none">Terms</a></li>
                                <li className="list-inline-item mx-2"><a href="#" className="text-white-50 small text-decoration-none">Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                </Container>


            </footer>
        </div>
    );
};

export default Footer;
