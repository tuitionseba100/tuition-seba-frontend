import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const GeneralPaymentRecordModal = ({ show, onHide, editingId, initialData, onSave }) => {
    const [paymentData, setPaymentData] = useState({
        tuitionCode: '',
        tuitionId: '',
        paymentReceivedDate: '',
        duePayDate: '',
        tutorName: '',
        tutorNumber: '',
        paymentNumber: '',
        paymentType: '',
        receivedTk: '',
        totalReceivedTk: '',
        duePayment: '',
        paymentStatus: '',
        comment: '',
        comment1: '',
        comment2: '',
        comment3: '',
    });

    useEffect(() => {
        if (show) {
            if (editingId && initialData) {
                setPaymentData(initialData);
            } else {
                setPaymentData({
                    tuitionCode: '',
                    tuitionId: '',
                    paymentReceivedDate: '',
                    duePayDate: '',
                    tutorName: '',
                    tutorNumber: '',
                    paymentNumber: '',
                    paymentType: '',
                    receivedTk: '',
                    totalReceivedTk: '',
                    duePayment: '',
                    paymentStatus: '',
                    comment: '',
                    comment1: '',
                    comment2: '',
                    comment3: '',
                });
            }
        }
    }, [show, editingId, initialData]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setPaymentData(prev => ({ ...prev, [id]: value }));
    };

    const handleDateChange = (id, value) => {
        if (!value) {
            setPaymentData(prev => ({ ...prev, [id]: '' }));
        } else {
            const localDate = new Date(value);
            const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
            setPaymentData(prev => ({ ...prev, [id]: utcDate.toISOString() }));
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #004299 100%)', color: 'white' }}>
                <Modal.Title className="fw-bold">{editingId ? "✏️ Edit Payment Record" : "➕ Create Payment Record"}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-light p-4">
                <Form>
                    {/* Section: Basic Information */}
                    <div className="bg-white p-3 rounded shadow-sm mb-4 border-start border-primary border-4">
                        <h5 className="text-primary mb-3 fw-bold border-bottom pb-2">📋 Basic Information</h5>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="tuitionId">
                                    <Form.Label className="fw-bold">Tuition Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={paymentData.tuitionId}
                                        onChange={handleChange}
                                        placeholder="Enter Tuition Code"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="tutorName">
                                    <Form.Label className="fw-bold">Tutor Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={paymentData.tutorName}
                                        onChange={handleChange}
                                        placeholder="Enter Tutor Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="tutorNumber">
                                    <Form.Label className="fw-bold">Tutor Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={paymentData.tutorNumber}
                                        onChange={handleChange}
                                        placeholder="Enter Tutor Phone"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="paymentNumber">
                                    <Form.Label className="fw-bold">Payment Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={paymentData.paymentNumber}
                                        onChange={handleChange}
                                        placeholder="Enter Transaction Phone"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    {/* Section: Financial Details */}
                    <div className="bg-white p-3 rounded shadow-sm mb-4 border-start border-success border-4">
                        <h5 className="text-success mb-3 fw-bold border-bottom pb-2">💰 Financial Details</h5>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="receivedTk">
                                    <Form.Label className="fw-bold">Received TK</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={paymentData.receivedTk}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="duePayment">
                                    <Form.Label className="fw-bold">Due Payment</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={paymentData.duePayment}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="totalReceivedTk">
                                    <Form.Label className="fw-bold">Total Received</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={paymentData.totalReceivedTk}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="paymentType">
                                    <Form.Label className="fw-bold">Payment Method</Form.Label>
                                    <Form.Select
                                        value={paymentData.paymentType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Method</option>
                                        <option value="bkash">Bkash</option>
                                        <option value="nagad">Nagad</option>
                                        <option value="rocket">Rocket</option>
                                        <option value="cash">Cash</option>
                                        <option value="bank">Bank</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="transactionId">
                                    <Form.Label className="fw-bold">Transaction ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={paymentData.transactionId}
                                        onChange={handleChange}
                                        placeholder="Optional"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    {/* Section: Status & Dates */}
                    <div className="bg-white p-3 rounded shadow-sm mb-4 border-start border-warning border-4">
                        <h5 className="text-warning mb-3 fw-bold border-bottom pb-2">📅 Status & Deadlines</h5>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="paymentStatus">
                                    <Form.Label className="fw-bold">Status</Form.Label>
                                    <Form.Select
                                        value={paymentData.paymentStatus}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="pending payment">Pending Payment</option>
                                        <option value="pending due">Pending Due</option>
                                        <option value="fully paid">Fully Paid</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="paymentReceivedDate">
                                    <Form.Label className="fw-bold">Received Date</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={paymentData.paymentReceivedDate ? paymentData.paymentReceivedDate.slice(0, 16) : ''}
                                        onChange={(e) => handleDateChange('paymentReceivedDate', e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="duePayDate">
                                    <Form.Label className="fw-bold">Due Pay Date</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={paymentData.duePayDate ? paymentData.duePayDate.slice(0, 16) : ''}
                                        onChange={(e) => handleDateChange('duePayDate', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    {/* Section: Comments */}
                    <div className="bg-white p-3 rounded shadow-sm mb-4 border-start border-info border-4">
                        <h5 className="text-info mb-3 fw-bold border-bottom pb-2">💬 Comments & Notes</h5>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="comment">
                                    <Form.Label className="fw-bold">General Comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={paymentData.comment}
                                        onChange={handleChange}
                                        placeholder="Main comment..."
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="comment1">
                                    <Form.Label className="fw-bold">Comment 1</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={paymentData.comment1}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="comment2">
                                    <Form.Label className="fw-bold">Comment 2</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={paymentData.comment2}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="comment3">
                                    <Form.Label className="fw-bold">Comment 3</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={paymentData.comment3}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-light">
                <Button variant="outline-secondary" onClick={onHide}>Close</Button>
                <Button variant="primary" className="px-5 shadow-sm" onClick={() => onSave(paymentData)}>
                    {editingId ? "Update Record" : "Save Record"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default React.memo(GeneralPaymentRecordModal);
