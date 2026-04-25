import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';

const getRefundWhatsAppMessage = (refund) => {
    const tuitionCode = refund.tuitionCode || 'XXXX';
    const amount = refund.amount || '0';
    const status = (refund.status || '').toLowerCase();
    let formattedReturnDate = '';
    if (refund.returnDate) {
        const d = new Date(refund.returnDate);
        if (!isNaN(d.getTime())) {
            formattedReturnDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
        } else {
            formattedReturnDate = refund.returnDate;
        }
    }
    const returnDateStr = formattedReturnDate ? `\nReturn Date: ${formattedReturnDate}` : '';

    if (status === 'completed') {
        return `Dear Respected Teacher,\n\nWe would like to inform you regarding your payment for Tuition Code: ${tuitionCode}.\n\nDue to unavoidable circumstances, this tuition has been cancelled, and your paid amount has been successfully refunded.\n\nRefund Amount: ${amount} BDT\nRefund Status: Completed${returnDateStr}\n\nThe amount has been sent to your provided account. Kindly check and confirm once received.\n\nWe sincerely apologize for any inconvenience caused and appreciate your understanding.\n\nIf you have any questions or need assistance, please feel free to contact us or call directly at 01633920928.\n\nRegards,\nPayment Department\nTuition Seba Forum`;
    }

    if (status === 'approved') {
        return `Dear Respected Teacher,\n\nWe would like to inform you that your refund request for Tuition Code: ${tuitionCode} has been approved.\n\nRefund Amount: ${amount} BDT\nRefund Status: Approved${returnDateStr}\n\nThe refund will be processed shortly and sent to your provided account. Please allow some time for the transaction to complete.\n\nIf you have any questions or need assistance, please feel free to contact us or call directly at 01633920928.\n\nRegards,\nPayment Department\nTuition Seba Forum`;
    }

    if (status === 'pending') {
        return `Dear Respected Teacher,\n\nWe have received your refund request for Tuition Code: ${tuitionCode}.\n\nRefund Amount: ${amount} BDT\nRefund Status: Pending${returnDateStr}\n\nYour request is currently in queue and will be reviewed shortly. We will keep you updated on the progress.\n\nIf you have any questions or need assistance, please feel free to contact us or call directly at 01633920928.\n\nRegards,\nPayment Department\nTuition Seba Forum`;
    }

    if (status === 'under review') {
        return `Dear Respected Teacher,\n\nWe would like to update you regarding your refund request for Tuition Code: ${tuitionCode}.\n\nRefund Amount: ${amount} BDT\nRefund Status: Under Review${returnDateStr}\n\nYour request is currently being reviewed by our team. We will notify you once a decision has been made.\n\nIf you have any questions or need assistance, please feel free to contact us or call directly at 01633920928.\n\nRegards,\nPayment Department\nTuition Seba Forum`;
    }

    if (status === 'rejected') {
        return `Dear Respected Teacher,\n\nWe regret to inform you that your refund request for Tuition Code: ${tuitionCode} has been rejected after review.\n\nRefund Amount Requested: ${amount} BDT\nRefund Status: Rejected\n\nUnfortunately, your request does not meet the criteria for a refund based on our refund policy.\n\nIf you believe this is an error or have further queries, please feel free to contact us or call directly at 01633920928.\n\nRegards,\nPayment Department\nTuition Seba Forum`;
    }

    if (status === 'cancelled') {
        return `Dear Respected Teacher,\n\nWe would like to inform you that your refund request for Tuition Code: ${tuitionCode} has been cancelled.\n\nRefund Amount: ${amount} BDT\nRefund Status: Cancelled${returnDateStr}\n\nIf this was done in error or you wish to resubmit a request, please feel free to contact us or call directly at 01633920928.\n\nRegards,\nPayment Department\nTuition Seba Forum`;
    }

    // Default fallback
    return `Dear Respected Teacher,\n\nThis is regarding your refund request for Tuition Code: ${tuitionCode}.\n\nRefund Amount: ${amount} BDT\nRefund Status: ${refund.status || 'N/A'}${returnDateStr}\n\nIf you have any questions or need assistance, please feel free to contact us or call directly at 01633920928.\n\nRegards,\nPayment Department\nTuition Seba Forum`;
};

const WhatsAppRefundModal = ({ show, onHide, refundData }) => {
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (refundData && show) {
            setPhone(refundData.personalPhone || '');
            setMessage(getRefundWhatsAppMessage(refundData));
        }
    }, [refundData, show]);

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
                    Share Refund Update via WhatsApp
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

export default WhatsAppRefundModal;
