import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';

const getServiceChargeWhatsAppMessage = (sc) => {
    const tuitionCode = sc.tuitionCode || '';
    const amount = sc.amount || '0';
    const status = (sc.status || 'completed').toLowerCase();

    const formatDate = (dateVal) => {
        if (!dateVal) return '';
        const d = new Date(dateVal);
        return !isNaN(d.getTime())
            ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d)
            : dateVal;
    };

    const paymentDate = formatDate(sc.date) || formatDate(new Date());
    const nextPaymentDate = formatDate(sc.nextPaymentDate) || paymentDate;

    // 1. Completed / Received Status
    if (status === 'completed') {
        return `Dear Respected Teacher,

We would like to confirm that your Service Charge for Tuition Code: ${tuitionCode} has been successfully received.

Payment Status: Completed
Received Amount: ${amount} BDT
Payment Date: ${paymentDate}

Thank you for your cooperation and timely payment. Your support helps us continue providing quality service and verified tuition opportunities.

For any questions or assistance, please contact us or call directly at 01633920928.

Regards,
Payment Department
Tuition Seba Forum`;
    }

    // 2. Cancelled Status
    if (status === 'cancelled') {
        return `Dear Respected Teacher,

This is to inform you that the Service Charge notice for Tuition Code: ${tuitionCode} has been cancelled.

Payment Status: Cancelled
Amount: ${amount} BDT

If you have any questions or need further clarification, please feel free to contact us or call directly at 01633920928.

Regards,
Payment Department
Tuition Seba Forum`;
    }

    // 3. Pending / Due Status (Default fallback)
    return `Dear Respected Teacher,

This is to inform you that your Service Charge is currently due for Tuition Code: ${tuitionCode}.

Payment Status: Due

Remaining Due Amount: ${amount} BDT
Due Payment Date: ${nextPaymentDate}

Please clear the outstanding Service Charge within the mentioned date.

Your service charge helps us continue providing verified tuition opportunities, dedicated support, and quality service to our teachers.

Thank you for your cooperation and continued support.

For any questions or assistance, please contact us or call directly at 01633920928.

Regards,
Payment Department
Tuition Seba Forum`;
};

const WhatsAppServiceChargeModal = ({ show, onHide, scData }) => {
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (scData && show) {
            setPhone(scData.personalPhone || '');
            setMessage(getServiceChargeWhatsAppMessage(scData));
        }
    }, [scData, show]);

    const handleSend = () => {
        if (!phone) {
            toast.error('Please enter a phone number.');
            return;
        }
        const formattedPhone = phone.startsWith('+') ? phone : `+88${phone}`;
        const url = `https://wa.me/${formattedPhone.replace(/[^\d+]/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton className="bg-success text-white">
                <Modal.Title className="fw-bold">
                    <FaWhatsapp className="me-2" />
                    Share Service Charge Notice via WhatsApp
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number (e.g. 01XXXXXXXXX)"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label className="fw-bold">Message</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={12}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ fontSize: '0.9rem', resize: 'vertical' }}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
                <Button variant="success" onClick={handleSend}>
                    <FaWhatsapp className="me-1" /> Send via WhatsApp
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WhatsAppServiceChargeModal;
