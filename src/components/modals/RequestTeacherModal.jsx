import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { axiosWithFallback as axios } from '../../services/fetchWithFallback';
import { toast } from 'react-toastify';
import ApplySuccessModal from './ApplySuccessModal';
import ProcessingModal from './ProcessingModal';

export default function RequestTeacherModal({ show, onHide, teacher, onSaved }) {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
        studentClass: '',
        teacherGender: '',
        characteristics: '',
        status: '',
        comment: '',
        referPersonPhone: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

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

        setLoading(true);
        try {
            const response = await axios.post('https://tuition-seba-backend-1.onrender.com/api/guardianApply/add', payload);
            if (response && (response.status === 200 || response.status === 201)) {
                toast.success('Request submitted successfully');
                setShowSuccess(true);
                setForm({
                    name: '', phone: '', address: '', studentClass: '', teacherGender: '', characteristics: '', status: '', comment: '', referPersonPhone: ''
                });
                onSaved && onSaved();
            } else {
                toast.error('Error submitting request');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
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

                        {/* Tuition Referral */}
                        <Row className="mt-3">
                            <Col md={12}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                                    border: '1px solid #a5d6a7',
                                    borderLeft: '4px solid #2e7d32',
                                    borderRadius: '8px',
                                    padding: '12px 16px',
                                    boxShadow: '0 2px 6px rgba(46, 125, 50, 0.08)'
                                }}>
                                    <Form.Group controlId="referPersonPhone">
                                        <Form.Label className="fw-semibold" style={{ color: '#2e7d32', marginBottom: '6px' }}>
                                            🎁 রেফার ব্যক্তির ফোন নম্বর (ঐচ্ছিক)
                                        </Form.Label>
                                        <Form.Control
                                            type="tel"
                                            value={form.referPersonPhone}
                                            onChange={(e) => handleChange('referPersonPhone', e.target.value)}
                                            placeholder="যেমন: 017xxxxxxxx"
                                            style={{ borderColor: '#66bb6a' }}
                                        />
                                        <small style={{ color: '#558b2f', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                                            ℹ️ কেউ যদি এই টিউশনটি রেফার করে থাকেন, তার ফোন নম্বর দিন। 
                                        </small>
                                    </Form.Group>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={loading}>Close</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </Button>
                </Modal.Footer>
            </Modal>
            <ProcessingModal show={loading} />
            {showSuccess && (
                <ApplySuccessModal
                    show={showSuccess}
                    handleClose={() => {
                        setShowSuccess(false);
                        onHide();
                    }}
                    title="শিক্ষক অনুরোধ সফল!"
                    message="এই শিক্ষকের জন্য আপনার অনুরোধটি সফলভাবে জমা হয়েছে।"
                />
            )}
        </>
    );
}
