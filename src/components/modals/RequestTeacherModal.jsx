import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import ApplySuccessModal from './ApplySuccessModal';

export default function RequestTeacherModal({ show, onHide, teacher, onSaved }) {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
        studentClass: '',
        teacherGender: '',
        characteristics: '',
        status: '',
        comment: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (show) {
            setForm(prev => ({ ...prev, teacherGender: teacher?.gender || '' }));
        }
    }, [show, teacher]);

    const handleChange = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

    const handleSubmit = async () => {
        if (!form.phone || form.phone.trim() === '') {
            toast.error('Phone is required');
            return;
        }

        const payload = {
            ...form,
            teacherId: teacher?._id || null,
            teacherCode: teacher?.premiumCode || null
        };

        try {
            const response = await axios.post('https://tuition-seba-backend-1.onrender.com/api/guardianApply/add', payload);
            if (response && (response.status === 200 || response.status === 201)) {
                toast.success('Request submitted successfully');
                setShowSuccess(true);
                setForm({
                    name: '', phone: '', address: '', studentClass: '', teacherGender: '', characteristics: '', status: '', comment: ''
                });
                onSaved && onSaved();
            } else {
                toast.error('Error submitting request');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred. Please try again later.');
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Request Teacher</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="name">
                                    <Form.Label className="fw-bold">Name</Form.Label>
                                    <Form.Control type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="phone">
                                    <Form.Label className="fw-bold">Phone<span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mt-3">
                            <Col md={6}>
                                <Form.Group controlId="address">
                                    <Form.Label className="fw-bold">Address</Form.Label>
                                    <Form.Control type="text" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="studentClass">
                                    <Form.Label className="fw-bold">Student Class</Form.Label>
                                    <Form.Control type="text" value={form.studentClass} onChange={(e) => handleChange('studentClass', e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mt-3">
                            <Col md={6}>
                                <Form.Group controlId="characteristics">
                                    <Form.Label className="fw-bold">Characteristics</Form.Label>
                                    <Form.Control type="text" value={form.characteristics} onChange={(e) => handleChange('characteristics', e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Close</Button>
                    <Button variant="primary" onClick={handleSubmit}>Submit Request</Button>
                </Modal.Footer>
            </Modal>

            <ApplySuccessModal show={showSuccess} handleClose={() => setShowSuccess(false)} />
        </>
    );
}
