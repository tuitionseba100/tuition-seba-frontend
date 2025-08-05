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

    return (
        <>
            <NavBar />
            <section className="py-5 mt-4 mb-3" style={{ backgroundColor: '#f4f7f9' }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={7}>
                            <div className="text-center mb-4">
                                <p className="fw-bold text-primary fs-5">
                                    গৃহশিক্ষক/শিক্ষিকা খুঁজছেন? নিচের ফর্মটি পূরণ করুন অথবা কল করুন <span className="text-danger">01891-644064</span>
                                </p>
                            </div>
                            <Card className="shadow-sm border-0 rounded-4">
                                <Card.Header
                                    className="text-white text-center rounded-top-4"
                                    style={{ background: 'linear-gradient(45deg, #007bff, #0056b3)' }}
                                >
                                    <h5 className="mb-0 fw-bold">Apply for a Tutor</h5>
                                </Card.Header>

                                <Form noValidate validated={validated} onSubmit={handleSubmit} id="applyForm">
                                    <Card.Body className="px-4 py-3">
                                        <Form.Group className="mb-3" controlId="name">
                                            <Form.Label>আপনার নাম</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.name}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="phone">
                                            <Form.Label className="fw-semibold">মোবাইল নাম্বার</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                required
                                                value={form.phone}
                                                onChange={handleChange}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                সঠিক ফোন নাম্বার লিখুন।
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="address">
                                            <Form.Label>ঠিকানা</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.address}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="studentClass">
                                            <Form.Label>ক্লাস</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.studentClass}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="teacherGender">
                                            <Form.Label>শিক্ষকের ধরণ</Form.Label>
                                            <Form.Select
                                                value={form.teacherGender}
                                                onChange={handleChange}
                                            >
                                                <option value="">নির্বাচন করুন</option>
                                                <option value="male">ছেলে</option>
                                                <option value="female">মেয়ে</option>
                                                <option value="male/female">যে কোনো</option>
                                            </Form.Select>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="characteristics">
                                            <Form.Label>শিক্ষকের বৈশিষ্ট্য</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                maxLength={500}
                                                value={form.characteristics}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Card.Body>

                                    <Card.Footer className="d-flex justify-content-between bg-white border-0 px-4 pb-4">
                                        <Button variant="outline-secondary" onClick={handleReset}>
                                            Reset
                                        </Button>
                                        <Button variant="primary" type="submit">
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
