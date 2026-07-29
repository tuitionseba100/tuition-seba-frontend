import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';

const getServiceChargeWhatsAppMessage = (sc) => {
    const amount = sc.amount || '0';
    let formattedDate = '';
    if (sc.date) {
        const d = new Date(sc.date);
        if (!isNaN(d.getTime())) {
            formattedDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
        } else {
            formattedDate = sc.date;
        }
    } else {
        formattedDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());
    }

    return `Dear Respected Teacher,

We would like to inform you that your Service Charge has been successfully received.

Amount Received: ${amount} BDT 
Payment Status: Completed
Payment Date: ${formattedDate}

Thank you for your trust and support. Your service charge helps us continue providing verified tuition opportunities, dedicated support, and a better experience for our teachers.

We sincerely appreciate your contribution and look forward to serving you with more quality tuition opportunities.

If you have any questions or need assistance, please feel free to contact us or call directly at 01633920928.

Regards,
Accounts Department
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
                    Share Service Charge Receipt via WhatsApp
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
