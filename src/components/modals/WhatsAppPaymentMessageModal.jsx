import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppPaymentMessageModal = ({ show, onHide, paymentData, formatDate }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (paymentData && show) {
            // Ensure phone number starts with 88 for Bangladesh if not present
            let tNumber = paymentData.tutorNumber || '';
            if (tNumber.startsWith('0')) {
                tNumber = '+88' + tNumber;
            } else if (tNumber.startsWith('880')) {
                tNumber = '+' + tNumber;
            } else if (!tNumber.startsWith('+880')) {
                tNumber = '+880' + tNumber;
            }
            setPhoneNumber(tNumber);

            const isDue = (paymentData.paymentStatus === 'pending due' || parseInt(paymentData.duePayment) > 0);
            
            let numDiscount = parseInt(paymentData.discount) || 0;
            let numDue = parseInt(paymentData.duePayment) || 0;

            let discountLine = numDiscount > 0 ? `\nDiscount: ${numDiscount} BDT` : '';

            let msg = '';
            if (isDue) {
                msg = `Dear Respected Teacher,

Please find below the detailed payment information for Tuition Code: ${paymentData.tuitionCode || ''}

Payment Status: Pending Due

Tuition Salary: ${paymentData.tuitionSalary || 0} BDT
Total Media Fee: ${paymentData.totalPaymentTk || 0} BDT
Received Payment: ${paymentData.totalReceivedTk || 0} BDT${discountLine}

Remaining Due Amount: ${numDue} BDT

Due Payment Date: ${formatDate ? formatDate(paymentData.duePayDate).split(',')[0] : (paymentData.duePayDate || '')}

Kindly complete the remaining payment within the mentioned date.
If you face any issues or need assistance, please contact us or call directly at 01633920928

Regards,
Payment Department
Tuition Seba Forum`;
            } else {
                msg = `Dear Respected Teacher,

Please find below the detailed payment information for Tuition Code: ${paymentData.tuitionCode || ''}

Payment Status: Fully Paid

Tuition Salary: ${paymentData.tuitionSalary || 0} BDT
Total Media Fee: ${paymentData.totalPaymentTk || 0} BDT
Received Payment: ${paymentData.totalReceivedTk || 0} BDT${discountLine}

Remaining Due Amount: 00 BDT

Thank you for your timely payment and continued trust in Tuition Seba Forum. We truly appreciate your cooperation.

If you need any further assistance, feel free to contact us anytime.

Regards,
Payment Department
Tuition Seba Forum`;
            }

            setMessage(msg);
        }
    }, [paymentData, show, formatDate]);

    const handleSend = () => {
        if (!phoneNumber) return;
        // encode the message
        const encodedMessage = encodeURIComponent(message);
        // remove any non-digit chars from phone except '+'
        const cleanedPhone = phoneNumber.replace(/[^\d+]/g, '');
        window.open(`https://wa.me/${cleanedPhone}?text=${encodedMessage}`, '_blank');
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton style={{ background: '#25D366', color: 'white' }}>
                <Modal.Title className="fw-bold"><FaWhatsapp className="me-2" />Send WhatsApp Message</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Target Phone Number</Form.Label>
                        <Form.Control
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="e.g. +8801XXXXXXXXX"
                        />
                        <Form.Text className="text-muted">
                            Ensure the number includes the country code (e.g. +880).
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Message Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={15}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-light">
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleSend} style={{ background: '#25D366', borderColor: '#25D366' }}>
                    <FaWhatsapp className="me-2" />
                    Confirm & Send
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default React.memo(WhatsAppPaymentMessageModal);
