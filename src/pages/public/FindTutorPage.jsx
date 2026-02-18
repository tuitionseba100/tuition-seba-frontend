import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import ApplySuccessModal from '../../components/modals/ApplySuccessModal';
import { toast } from 'react-toastify';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import ProcessingModal from '../../components/modals/ProcessingModal';

const ApplyTutorPage = () => {
    const defaultForm = {
        name: '',
        phone: '',
        address: '',
        studentClass: '',
        teacherGender: '',
        characteristics: '',
    };

    const [form, setForm] = useState(defaultForm);
    const [showSuccess, setShowSuccess] = useState(false);
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm({ ...form, [id]: value });
    };

    const handleReset = () => {
        setForm(defaultForm);
        setValidated(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formElement = e.currentTarget;
        if (!formElement.checkValidity()) {
            setValidated(true);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('https://tuition-seba-backend-1.onrender.com/api/guardianApply/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                setShowSuccess(true);
                handleReset();
                toast.success('Application submitted successfully!');
            } else {
                toast.error('Error submitting application');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            background: '#f8fafc',
            padding: '0 0 60px',
            fontFamily: '"Inter", sans-serif',
        },
        header: {
            padding: '20px 0 80px', // Very compact header
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
            marginBottom: '0',
            borderRadius: '0',
            zIndex: 1
        },
        headerContent: {
            position: 'relative',
            zIndex: 2,
            marginBottom: '20px' // Less space below text
        },
        title: {
            color: '#ffffff',
            fontSize: '1.5rem', // Smaller title for compactness
            fontWeight: '700',
            marginBottom: '6px',
            marginTop: '10px',
            fontFamily: '"Poppins", sans-serif',
        },
        subtitle: {
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.9rem',
            fontWeight: '400',
            marginBottom: '0',
            maxWidth: '600px',
            margin: '0 auto'
        },
        contactHighlight: {
            color: '#fbbf24',
            fontWeight: '600',
            marginTop: '4px',
            fontSize: '0.95rem'
        },
        card: {
            border: '2px dashed #2563eb', // Theme border added
            borderRadius: '0',
            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            background: '#ffffff',
            marginTop: '-50px', // Overlap header
            marginBottom: '40px',
            position: 'relative',
            zIndex: 10
        },
        cardHeader: {
            background: '#f0f9ff', // Very light blue background for form header
            padding: '1rem 2rem',
            borderBottom: '1px solid #bfdbfe',
            textAlign: 'center'
        },
        cardTitle: {
            fontSize: '1.1rem',
            fontWeight: '700',
            margin: 0,
            color: '#1e40af',
            letterSpacing: '-0.01em',
            textTransform: 'uppercase'
        },
        input: {
            borderColor: '#cbd5e1',
            borderWidth: '1px',
            borderRadius: '0',
            height: '44px',
            fontSize: '0.9rem',
            boxShadow: 'none',
            backgroundColor: '#fff',
            color: '#334155',
            transition: 'border-color 0.2s ease',
            paddingLeft: '12px'
        },
        textarea: {
            borderColor: '#cbd5e1',
            borderWidth: '1px',
            borderRadius: '0',
            minHeight: '100px',
            resize: 'vertical',
            padding: '12px',
            fontSize: '0.9rem',
            backgroundColor: '#fff',
            color: '#334155'
        },
        label: {
            fontWeight: '600',
            color: '#475569',
            marginBottom: '6px',
            fontSize: '0.85rem'
        },
        submitBtn: {
            background: '#2563eb',
            border: 'none',
            borderRadius: '0',
            padding: '12px 40px',
            fontSize: '0.95rem',
            fontWeight: '600',
            letterSpacing: '0.02em',
            transition: 'background 0.2s ease',
            textTransform: 'uppercase'
        },
        resetBtn: {
            borderColor: '#cbd5e1',
            color: '#64748b',
            borderRadius: '0',
            padding: '12px 30px',
            fontSize: '0.95rem',
            fontWeight: '500',
            background: 'transparent',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
        }
    };

    return (
        <>
            <NavBar />
            <div style={styles.container}>
                {/* Compact Header */}
                <div style={styles.header}>
                    <Container>
                        <div style={styles.headerContent}>
                            <h1 style={styles.title}>গৃহশিক্ষক/শিক্ষিকা খুঁজছেন?</h1>
                            <p style={styles.subtitle}>
                                নিচের ফর্মটি পূরণ করুন অথবা কল করুন <span style={styles.contactHighlight}>01891-644064</span>
                            </p>
                        </div>
                    </Container>

                    {/* Wave Separator */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        overflow: 'hidden',
                        lineHeight: 0,
                        zIndex: 1
                    }}>
                        <svg
                            viewBox="0 0 1200 120"
                            preserveAspectRatio="none"
                            style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '40px' }}
                        >
                            <path
                                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                                fill="#f8fafc"
                            ></path>
                        </svg>
                    </div>
                </div>

                {/* Form Section */}
                <Container style={{ position: 'relative', zIndex: 10 }}>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6}>
                            <Card className="shadow-lg" style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <h2 style={styles.cardTitle}>Apply for a Tutor</h2>
                                </div>

                                <Form noValidate validated={validated} onSubmit={handleSubmit} id="applyForm">
                                    <Card.Body style={{ padding: '2rem 2.5rem' }}>
                                        {/* Name */}
                                        <Form.Group className="mb-3" controlId="name">
                                            <Form.Label style={styles.label}>অনুগ্রহ করে আপনার নাম লিখুন</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.name}
                                                onChange={handleChange}
                                                style={styles.input}
                                                placeholder="আপনার নাম লিখুন"
                                                onFocus={(e) => { e.target.style.borderColor = '#2563eb'; }}
                                                onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; }}
                                            />
                                        </Form.Group>

                                        {/* Phone */}
                                        <Form.Group className="mb-3" controlId="phone">
                                            <Form.Label style={styles.label}>আপনার সচল মোবাইল নাম্বার লিখুন <sup style={{ color: '#ef4444' }}>*</sup></Form.Label>
                                            <Form.Control
                                                type="tel"
                                                required
                                                value={form.phone}
                                                onChange={handleChange}
                                                style={styles.input}
                                                placeholder="০১xxxxxxxxx"
                                                onFocus={(e) => { e.target.style.borderColor = '#2563eb'; }}
                                                onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; }}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                সঠিক ফোন নাম্বার লিখুন।
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Address */}
                                        <Form.Group className="mb-3" controlId="address">
                                            <Form.Label style={styles.label}>আপনার বাসার ঠিকানা লিখুন</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.address}
                                                onChange={handleChange}
                                                style={styles.input}
                                                placeholder="বাসা নং, রোড নং, এলাকা..."
                                                onFocus={(e) => { e.target.style.borderColor = '#2563eb'; }}
                                                onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; }}
                                            />
                                        </Form.Group>

                                        <Row>
                                            <Col md={6}>
                                                {/* Student Class */}
                                                <Form.Group className="mb-3" controlId="studentClass">
                                                    <Form.Label style={styles.label}>ছাত্র/ছাত্রী কোন ক্লাসে পড়ে?</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={form.studentClass}
                                                        onChange={handleChange}
                                                        style={styles.input}
                                                        placeholder="উদাহরণ: ক্লাস ৫"
                                                        onFocus={(e) => { e.target.style.borderColor = '#2563eb'; }}
                                                        onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                {/* Teacher Gender */}
                                                <Form.Group className="mb-3" controlId="teacherGender">
                                                    <Form.Label style={styles.label}>শিক্ষক পছন্দ</Form.Label>
                                                    <Form.Select
                                                        value={form.teacherGender}
                                                        onChange={handleChange}
                                                        style={styles.input}
                                                        onFocus={(e) => { e.target.style.borderColor = '#2563eb'; }}
                                                        onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; }}
                                                    >
                                                        <option value="" disabled>নির্বাচন করুন</option>
                                                        <option value="male">ছেলে শিক্ষক</option>
                                                        <option value="female">মেয়ে শিক্ষক</option>
                                                        <option value="male/female">যে কোনো</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* Characteristics */}
                                        <Form.Group className="mb-4" controlId="characteristics">
                                            <Form.Label style={styles.label}>কেমন শিক্ষক খুঁজছেন সংক্ষেপে নিচে লিখুন</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                maxLength={500}
                                                value={form.characteristics}
                                                onChange={handleChange}
                                                style={styles.textarea}
                                                placeholder="শিক্ষকের যোগ্যতা, অভিজ্ঞতা বা অন্য কোনো বিশেষ চাহিদা থাকলে এখানে উল্লেখ করুন..."
                                                onFocus={(e) => { e.target.style.borderColor = '#2563eb'; }}
                                                onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; }}
                                            />
                                        </Form.Group>
                                    </Card.Body>

                                    <Card.Footer
                                        className="d-flex justify-content-between align-items-center"
                                        style={{ backgroundColor: '#ffffff', borderTop: 'none', padding: '0 2.5rem 2rem' }}
                                    >
                                        <Button
                                            variant="outline-secondary"
                                            onClick={handleReset}
                                            style={styles.resetBtn}
                                            onMouseEnter={(e) => { e.target.style.borderColor = '#94a3b8'; e.target.style.color = '#475569'; }}
                                            onMouseLeave={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.color = '#64748b'; }}
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            style={styles.submitBtn}
                                            onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                                            onMouseLeave={(e) => e.target.style.background = '#2563eb'}
                                        >
                                            Submit
                                        </Button>
                                    </Card.Footer>
                                </Form>
                            </Card>
                        </Col>
                    </Row>

                    {showSuccess && (
                        <ApplySuccessModal
                            show={showSuccess}
                            handleClose={() => setShowSuccess(false)}
                            title="শিক্ষক খোঁজার আবেদন সফল!"
                            message="আপনার শিক্ষক খোঁজার আবেদনটি সফলভাবে জমা হয়েছে।"
                        />
                    )}
                    <ProcessingModal show={loading} />
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default ApplyTutorPage;
