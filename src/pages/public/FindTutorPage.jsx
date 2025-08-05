import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import ApplySuccessModal from '../../components/modals/ApplySuccessModal';
import { toast } from 'react-toastify';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

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
        }
    };

    // Common inline styles for inputs/select/textarea for identical look
    const inputStyle = {
        borderColor: '#0d6efd',
        borderWidth: '2px',
        borderRadius: 0,
        height: '42px',
        fontSize: '1rem',
        boxShadow: 'none',
        transition: 'border-color 0.3s ease',
    };

    const textareaStyle = {
        ...inputStyle,
        height: '100px',
        resize: 'vertical',
        paddingTop: '8px',
        paddingBottom: '8px',
    };

    return (
        <>
            <NavBar />
            <section style={{ backgroundColor: '#f4f7f9', padding: '3rem 0' }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={7}>
                            <p
                                className="text-center fw-bold text-primary fs-5 mb-4"
                                style={{ letterSpacing: '0.02em' }}
                            >
                                গৃহশিক্ষক/শিক্ষিকা খুঁজছেন? নিচের ফর্মটি পূরণ করুন অথবা কল করুন{' '}
                                <span style={{ color: '#dc3545' }}>01891-644064</span>
                            </p>

                            <Card
                                className="shadow"
                                style={{
                                    borderRadius: 0,
                                    border: '2px solid #0d6efd',
                                    boxShadow:
                                        '0 4px 8px rgba(13,110,253,0.15), 0 6px 20px rgba(13,110,253,0.1)',
                                }}
                            >
                                <Card.Header
                                    className="text-white text-center"
                                    style={{
                                        backgroundColor: '#0d6efd',
                                        fontWeight: '700',
                                        fontSize: '1.3rem',
                                        borderTopLeftRadius: 0,
                                        borderTopRightRadius: 0,
                                        padding: '1rem 1.5rem',
                                        letterSpacing: '0.03em',
                                        userSelect: 'none',
                                    }}
                                >
                                    Apply for a Tutor
                                </Card.Header>

                                <Form noValidate validated={validated} onSubmit={handleSubmit} id="applyForm">
                                    <Card.Body style={{ padding: '1.5rem 2rem' }}>
                                        {/* Name */}
                                        <Form.Group className="mb-4" controlId="name">
                                            <Form.Label className="fw-semibold">অনুগ্রহ করে আপনার নাম লিখুন</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.name}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                placeholder="আপনার নাম লিখুন"
                                            />
                                        </Form.Group>

                                        {/* Phone */}
                                        <Form.Group className="mb-4" controlId="phone">
                                            <Form.Label className="fw-semibold">আপনার সচল মোবাইল নাম্বার লিখুন <sup style={{ color: '#dc3545' }}>*</sup></Form.Label>
                                            <Form.Control
                                                type="tel"
                                                required
                                                value={form.phone}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                placeholder="০১xxxxxxxxx"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                সঠিক ফোন নাম্বার লিখুন।
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Address */}
                                        <Form.Group className="mb-4" controlId="address">
                                            <Form.Label className="fw-semibold">আপনার বাসার ঠিকানা লিখুন</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.address}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                placeholder="ঠিকানা লিখুন"
                                            />
                                        </Form.Group>

                                        {/* Student Class */}
                                        <Form.Group className="mb-4" controlId="studentClass">
                                            <Form.Label className="fw-semibold">ছাত্র/ছাত্রী কোন ক্লাসে পড়ে?</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.studentClass}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                placeholder="ক্লাস লিখুন"
                                            />
                                        </Form.Group>

                                        {/* Teacher Gender */}
                                        <Form.Group className="mb-4" controlId="teacherGender">
                                            <Form.Label className="fw-semibold">ছেলে শিক্ষক নাকি মেয়ে শিক্ষক চান?</Form.Label>
                                            <Form.Select
                                                value={form.teacherGender}
                                                onChange={handleChange}
                                                style={{ ...inputStyle, height: '42px' }}
                                            >
                                                <option value="" disabled>
                                                    নির্বাচন করুন
                                                </option>
                                                <option value="male">ছেলে</option>
                                                <option value="female">মেয়ে</option>
                                                <option value="male/female">যে কোনো</option>
                                            </Form.Select>
                                        </Form.Group>

                                        {/* Characteristics */}
                                        <Form.Group className="mb-4" controlId="characteristics">
                                            <Form.Label className="fw-semibold">কেমন শিক্ষক খুঁজছেন সংক্ষেপে নিচে লিখুন</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                maxLength={500}
                                                value={form.characteristics}
                                                onChange={handleChange}
                                                style={textareaStyle}
                                                placeholder="শিক্ষকের বৈশিষ্ট্য লিখুন"
                                            />
                                        </Form.Group>
                                    </Card.Body>

                                    <Card.Footer
                                        className="d-flex justify-content-between align-items-center"
                                        style={{ backgroundColor: '#fff', borderTop: '2px solid #0d6efd', borderRadius: 0, padding: '1rem 2rem' }}
                                    >
                                        <Button
                                            variant="outline-primary"
                                            onClick={handleReset}
                                            style={{
                                                borderRadius: 0,
                                                fontWeight: 600,
                                                padding: '0.5rem 2rem',
                                                letterSpacing: '0.02em',
                                            }}
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            style={{
                                                borderRadius: 0,
                                                fontWeight: 700,
                                                padding: '0.5rem 2.5rem',
                                                letterSpacing: '0.03em',
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    </Card.Footer>
                                </Form>
                            </Card>
                        </Col>
                    </Row>

                    {showSuccess && (
                        <ApplySuccessModal show={showSuccess} onHide={() => setShowSuccess(false)} />
                    )}
                </Container>
            </section>
            <Footer />
        </>
    );
};

export default ApplyTutorPage;
