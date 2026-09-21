import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { usePublicSettings } from '../../context/PublicSettingsContext';

const getServiceChargeWhatsAppMessage = (sc, contactNumber = '01633920928') => {
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

For any questions or assistance, please contact us or call directly at ${contactNumber}.

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

If you have any questions or need further clarification, please feel free to contact us or call directly at ${contactNumber}.

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

For any questions or assistance, please contact us or call directly at ${contactNumber}.

Regards,
Payment Department
Tuition Seba Forum`;
};

const WhatsAppServiceChargeModal = ({ show, onHide, scData, sc }) => {
    const { whatsappNumber } = usePublicSettings();
    const data = scData || sc;
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (data && show) {
            let rawPhone = data.personalPhone || data.paymentNumber || '';
            let formatted = rawPhone.trim();
            if (formatted.startsWith('0')) {
                formatted = '+88' + formatted;
            } else if (formatted.startsWith('880')) {
                formatted = '+' + formatted;
            } else if (formatted && !formatted.startsWith('+880')) {
                formatted = '+880' + formatted;
            }
            setPhone(formatted);
            setMessage(getServiceChargeWhatsAppMessage(data, whatsappNumber || '01633920928'));
        }
    }, [data, show, whatsappNumber]);

    const handleSend = () => {
        if (!phone) {
            toast.error('Please enter a phone number.');
            return;
        }
        const cleanDigits = phone.replace(/[^\d]/g, '');
        const url = `https://wa.me/${cleanDigits}?text=${encodeURIComponent(message)}`;
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
