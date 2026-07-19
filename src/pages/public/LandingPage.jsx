import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaBullhorn } from 'react-icons/fa';
import NavBar from '../../components/NavBar';
import Banner from '../../components/Banner';
import Features from '../../components/Features';
import TuitionSection from '../../components/TuitionSection';
import HappyClients from '../../components/HappyClients';
import About from '../../components/About';
import PaymentOptions from '../../components/PaymentOptions';
import CountSection from '../../components/CountSection';
import Footer from '../../components/Footer';
import FloatingWhatsAppIcon from '../../components/FloatingWhatsAppIcon';

const SmallComplaintBanner = () => {
    const navigate = useNavigate();
    return (
        <div style={{ background: '#ffffff', padding: '15px 0', borderBottom: '1px solid #eee', marginTop: '-10px', position: 'relative', zIndex: 2 }}>
            <Container className="d-flex justify-content-center align-items-center gap-3 flex-wrap text-center">
                <div className="d-flex align-items-center gap-2">
                    <FaBullhorn className="text-danger" size={18} />
                    <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>
                        আপনার কোনো অভিযোগ বা পরামর্শ থাকলে আমাদের জানান!
                    </span>
                </div>
                <Button 
                    variant="danger" 
                    size="sm" 
                    className="rounded-pill px-3 fw-bold shadow-sm"
                    onClick={() => navigate('/complaint-suggestion')}
                    style={{ fontSize: '13px' }}
                >
                    এখানে ক্লিক করুন
                </Button>
            </Container>
        </div>
    );
};

const LandingPage = () => {
    return (
        <>
            <NavBar />
            <Banner />
            <SmallComplaintBanner />
            <Features />
            <TuitionSection />
            <HappyClients />
            <CountSection />
            <About />
            <PaymentOptions />
            <Footer />
            <FloatingWhatsAppIcon />
        </>
    );
};

export default LandingPage;
