import React from 'react';
import NavBar from '../../components/NavBar';
import Banner from '../../components/Banner';
import Features from '../../components/Features';
import TuitionSection from '../../components/TuitionSection';
import HappyClients from '../../components/HappyClients';
import About from '../../components/About';
import PaymentOptions from '../../components/PaymentOptions';
import Footer from '../../components/Footer';

const LandingPage = () => {
    return (
        <>
            <NavBar />
            <Banner />
            <Features />
            <TuitionSection />
            <HappyClients />
            <About />
            <PaymentOptions />
            <Footer />
        </>
    );
};

export default LandingPage;
