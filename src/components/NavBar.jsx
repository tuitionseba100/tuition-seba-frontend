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
        backgroundColor: 'white',
        borderBottom: '2px solid #3c81e1',
    };

    const logoStyle = {
        width: 120,
        height: 60,
        marginRight: 10,
        objectFit: 'contain',
    };

    const baseNavLinkStyle = {
        color: '#3c81e1',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        position: 'relative',
        paddingBottom: 6,
        textDecoration: 'none',
        marginRight: 16,
        fontSize: 16,
    };

    const iconLinkStyle = {
        color: '#3c81e1',
        fontSize: 18,
        marginLeft: 12,
        border: '2px solid #3c81e1',
        borderRadius: '50%',
        padding: 7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 34,
        minHeight: 34,
    };

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Available Tuitions', to: '/tuitions' },
        { label: 'Find Tutor', to: '/findTutor' },
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
            href: 'https://wa.me/8801633920928',
            icon: <FaWhatsapp />,
            key: 'whatsapp',
        },
    ];

    const getUnderlineStyle = (activeOrHovered) => ({
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 2,
        backgroundColor: '#3c81e1',
        width: activeOrHovered ? '100%' : 0,
        transition: 'width 0.3s ease',
    });

    return (
        <Navbar style={navbarStyle} expand="lg" variant="light" sticky="top">
            <Container fluid="md" className="px-3 px-sm-4">
                <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
                    <img src="/img/TUITION SEBA FORUM TF.png" alt="Logo" style={logoStyle} />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />
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
                                        onMouseEnter={() => setHovered(label)}
                                        onMouseLeave={() => setHovered(null)}
                                        className={({ isActive }) => (isActive ? 'active' : '')}
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
                                        style={baseNavLinkStyle}
                                        onMouseEnter={() => setHovered(label)}
                                        onMouseLeave={() => setHovered(null)}
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
