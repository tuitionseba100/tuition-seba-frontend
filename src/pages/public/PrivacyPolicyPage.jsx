import React, { useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const PrivacyPolicyPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <NavBar />
            <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", paddingTop: "80px", paddingBottom: "40px" }}>
                <Container>
                    <Card className="shadow-sm border-0 p-4 p-md-5">
                        <h1 className="text-center mb-4 text-primary fw-bold">Privacy Policy</h1>
                        <p className="text-muted text-center mb-5">Last updated: {new Date().toLocaleDateString()}</p>

                        <div className="policy-content">
                            <section className="mb-4">
                                <h5>1. Introduction</h5>
                                <p>
                                    Welcome to <strong>Tuition Seba Forum</strong>. We respect your privacy and are committed to protecting your personal data.
                                    This privacy policy will inform you as to how we look after your personal data when you visit our website or use our application
                                    and tell you about your privacy rights and how the law protects you.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h5>2. Information We Collect</h5>
                                <p>
                                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                                </p>
                                <ul>
                                    <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                    <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                                    <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, operating system and platform.</li>
                                    <li><strong>Usage Data:</strong> includes information about how you use our website, products and services (e.g., looking for tutors or students).</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h5>3. How We Use Your Information</h5>
                                <p>
                                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                                </p>
                                <ul>
                                    <li>To register you as a new customer or tutor.</li>
                                    <li>To process and deliver your order including: Manage payments, fees and charges.</li>
                                    <li>To manage our relationship with you which will include: Notifying you about changes to our terms or privacy policy.</li>
                                    <li>To improve our website, products/services, marketing, customer relationships and experiences.</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h5>4. Data Security</h5>
                                <p>
                                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                                    In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h5>5. Data Retention</h5>
                                <p>
                                    We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h5>6. Your Legal Rights</h5>
                                <p>
                                    Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h5>7. Contact Us</h5>
                                <p>
                                    If you have any questions about this privacy policy or our privacy practices, please contact us at:
                                </p>
                                <p>
                                    <strong>Tuition Seba Forum</strong><br />
                                    No 2 Gate, Biplob Udyan, Chattogram<br />
                                    Phone: 01633920928<br />
                                    Email: tuitionsebaforum@gmail.com<br />
                                    <strong>Trade License No:</strong> TRAD/CHTG/008405/2025
                                </p>
                            </section>
                        </div>
                    </Card>
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicyPage;
