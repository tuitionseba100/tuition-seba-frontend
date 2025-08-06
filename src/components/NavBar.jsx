import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const NavbarComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleAboutUsClick = (e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/');
            setTimeout(() => {
                document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    };

    const navbarStyle = { backgroundColor: '#3c81e1' };
    const logoStyle = { width: 40, height: 40, marginRight: 10, borderRadius: '50%', objectFit: 'cover' };
    const brandStyle = { fontWeight: 700, color: 'white', fontSize: 18 };
    const navLinkStyle = { color: 'white', fontWeight: 500, marginRight: 16, whiteSpace: 'nowrap', cursor: 'pointer' };
    const iconLinkStyle = { color: 'white', fontSize: 16, marginLeft: 10 };

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
            href: 'https://wa.me/8801540376020',
            icon: <FaWhatsapp />,
            key: 'whatsapp',
        },
    ];

    return (
        <Navbar style={navbarStyle} expand="lg" variant="dark" sticky="top">
            <Container>
                <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
                    <img src="/img/favicon.png" alt="Logo" style={logoStyle} />
                    <span style={brandStyle}>Tuition Seba Forum</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto align-items-center">
                        {navLinks.map(({ label, to, isSpecial }) =>
                            !isSpecial ? (
                                <Nav.Link key={label} as={NavLink} to={to} style={navLinkStyle}>
                                    {label}
                                </Nav.Link>
                            ) : (
                                <Nav.Link key={label} onClick={handleAboutUsClick} style={navLinkStyle}>
                                    {label}
                                </Nav.Link>
                            )
                        )}

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
