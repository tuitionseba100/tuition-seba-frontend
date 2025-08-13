import React from 'react';
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

const LandingPage = () => {
    return (
        <>
            <NavBar />
            <Banner />
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
