import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const NavbarComponent = () => {
    const navbarStyle = {
        backgroundColor: '#3c81e1',
        height: '60px',
    };

    const logoStyle = {
        width: '40px',
        height: '40px',
        marginRight: '8px',
        borderRadius: '50%',
        objectFit: 'cover',
    };

    const brandStyle = {
        fontWeight: '700',
        color: 'white',
        fontSize: '18px',
    };

    const navLinkStyle = {
        color: 'white',
        marginRight: '18px',
        fontWeight: '500',
    };

    return (
        <Navbar style={navbarStyle} expand="lg" variant="dark">
            <Container>
                <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
                    <img
                        src="/img/favicon.png"
                        alt="Logo"
                        style={logoStyle}
                    />
                    <span style={brandStyle}>Tuition Seba Forum</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={NavLink} to="/tuitions" style={navLinkStyle}>
                            Available Tuitions
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/findTutor" style={navLinkStyle}>
                            Find Tutor
                        </Nav.Link>
                        <Nav.Link href="#about-us" style={navLinkStyle}>
                            About Us
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/payment" style={navLinkStyle}>
                            Payment
                        </Nav.Link>
                        <Nav.Link href="#" style={navLinkStyle}>
                            Registration
                        </Nav.Link>
                        <Nav.Link href="https://facebook.com/groups/1003753066957594/" style={{ color: 'white', marginRight: '10px' }}>
                            <FaFacebookF />
                        </Nav.Link>
                        <Nav.Link href="whatsapp://send?phone=+8801540376020" style={{ color: 'white' }}>
                            <FaWhatsapp />
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
