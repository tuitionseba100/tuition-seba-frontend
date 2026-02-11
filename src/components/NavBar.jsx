import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const NavbarComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [hovered, setHovered] = useState(null);

    const handleAboutUsClick = (e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' });
            window.history.replaceState(null, '', '#about-us');
        } else {
            navigate('/');
            setTimeout(() => {
                document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' });
                window.history.replaceState(null, '', '#about-us');
            }, 300);
        }
    };

    const navbarStyle = {
        background: 'linear-gradient(135deg, #004085 0%, #0066cc 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', // Subtle separator
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)', // Stronger shadow for depth
        zIndex: 1000 // Ensure it stays on top
    };

    const logoStyle = {
        width: 120,
        height: 60,
        marginRight: 10,
        objectFit: 'contain',
        filter: 'brightness(0) invert(1)' // Make logo white if it's black/colored, assuming it's transparent png
    };

    const baseNavLinkStyle = {
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        position: 'relative',
        paddingBottom: 6,
        textDecoration: 'none',
        marginRight: 16,
        fontSize: 16,
        letterSpacing: '0.5px',
        transition: 'color 0.3s ease'
    };

    const iconLinkStyle = {
        color: 'white',
        fontSize: 18,
        marginLeft: 12,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        padding: 7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 36,
        minHeight: 36,
        transition: 'all 0.3s ease'
    };

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Available Tuitions', to: '/tuitions' },
        { label: 'Find Tutor', to: '/findTutor' },
        { label: 'Our Teachers', to: '/OurTeachers' },
        { label: 'About Us', to: '#about-us', isSpecial: true },
        { label: 'Payment', to: '/payment' },
        { label: 'Registration', to: '/teacherRegistration' },
    ];

    const iconLinks = [
        {
            href: 'https://facebook.com/groups/1003753066957594/',
            icon: <FaFacebookF />,
            key: 'facebook',
        },
        {
            href: 'https://wa.me/+8801571305804',
            icon: <FaWhatsapp />,
            key: 'whatsapp',
        },
    ];

    const getUnderlineStyle = (activeOrHovered) => ({
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 3,
        backgroundColor: '#61dafb', // Cyan accent from footer
        width: activeOrHovered ? '100%' : 0,
        transition: 'width 0.3s ease',
        borderRadius: '2px',
        boxShadow: activeOrHovered ? '0 0 10px rgba(97, 218, 251, 0.5)' : 'none'
    });

    return (
        <Navbar style={navbarStyle} expand="lg" variant="dark" sticky="top">
            <Container fluid="md" className="px-3 px-sm-4">
                <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
                    <img src="/img/TUITION SEBA FORUM TF.png" alt="Logo" style={logoStyle} />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" style={{ border: '1px solid rgba(255,255,255,0.5)' }} />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto align-items-center" style={{ flexWrap: 'wrap', gap: 10 }}>
                        {navLinks.map(({ label, to, isSpecial }) => {
                            if (!isSpecial) {
                                return (
                                    <Nav.Link
                                        key={label}
                                        as={NavLink}
                                        to={to}
                                        style={baseNavLinkStyle}
                                        onMouseEnter={(e) => {
                                            setHovered(label);
                                            e.currentTarget.style.color = '#ffffff';
                                        }}
                                        onMouseLeave={(e) => {
                                            setHovered(null);
                                            if (!e.currentTarget.classList.contains('active')) {
                                                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                                            }
                                        }}
                                        className={({ isActive }) => (isActive ? 'active text-white' : '')}
                                    >
                                        {label}
                                        <div style={getUnderlineStyle(hovered === label || location.pathname === to)} />
                                    </Nav.Link>
                                );
                            } else {
                                const isActive = location.hash === '#about-us';
                                return (
                                    <Nav.Link
                                        key={label}
                                        onClick={handleAboutUsClick}
                                        style={{ ...baseNavLinkStyle, color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)' }}
                                        onMouseEnter={(e) => {
                                            setHovered(label);
                                            e.currentTarget.style.color = '#ffffff';
                                        }}
                                        onMouseLeave={(e) => {
                                            setHovered(null);
                                            if (!isActive) e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                                        }}
                                    >
                                        {label}
                                        <div style={getUnderlineStyle(hovered === label || isActive)} />
                                    </Nav.Link>
                                );
                            }
                        })}

                        {iconLinks.map(({ href, icon, key }) => (
                            <Nav.Link
                                key={key}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={iconLinkStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.color = '#004085';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {icon}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
