import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import PaymentTermsModal from '../../components/modals/PaymentTermsModal';
import RefundTermsModal from '../../components/modals/RefundTermsModal';

const PaymentModal = ({ show, handleClose }) => {
    const defaultForm = {
        tuitionCode: '', paymentType: '', paymentNumber: '', transactionId: '',
        amount: '', name: '', personalPhone: '', note: '', agreeTerms: false, agreeRefund: false
    };
    const [form, setForm] = useState(defaultForm);

    const [showPaymentTerms, setShowPaymentTerms] = useState(false);
    const [showRefundTerms, setShowRefundTerms] = useState(false);

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.agreeTerms || !form.agreeRefund) {
            return toast.error('Please agree to all terms.');
        }

        try {
            const res = await fetch('https://tuition-seba-backend-1.onrender.com/api/teacherPayment/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                toast.success('Payment submitted!');
                setForm(defaultForm);
                handleClose();
            } else toast.error('Submission failed.');
        } catch {
            toast.error('Something went wrong.');
        }
    };

    const renderField = (label, name, type = 'text', required = true) => (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type={type}
                name={name}
                value={form[name]}
                onChange={handleInput}
                required={required}
            />
        </Form.Group>
    );

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Payment Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {renderField('Tuition Code', 'tuitionCode')}
                        <Form.Group className="mb-3">
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Select name="paymentType" value={form.paymentType} onChange={handleInput} required>
                                <option value="">Select method</option>
                                <option value="bkash">Bkash personal</option>
                                <option value="nagad">Nagad personal</option>
                                <option value="cash">Cash</option>
                            </Form.Select>
                        </Form.Group>
                        {renderField('Number (Bkash/Nagad)', 'paymentNumber', 'text', false)}
                        {renderField('Transaction ID', 'transactionId', 'text', false)}
                        {renderField('Amount', 'amount', 'number')}
                        {renderField('Your Name', 'name')}
                        {renderField('Contact Number/Whatsapp', 'personalPhone')}
                        <Form.Group className="mb-3">
                            <Form.Label>Note</Form.Label>
                            <Form.Control as="textarea" rows={3} name="note" value={form.note} onChange={handleInput} maxLength={500} />
                        </Form.Group>

                        <div className="mb-2 d-flex align-items-start">
                            <Form.Check
                                type="checkbox"
                                name="agreeTerms"
                                id="agreeTerms"
                                checked={form.agreeTerms}
                                onChange={handleInput}
                                className="me-2"
                            />
                            <div>
                                <label htmlFor="agreeTerms" className="mb-0">
                                    I agree to the{' '}
                                    <span
                                        style={{ color: '#0d6efd', textDecoration: 'underline', cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowPaymentTerms(true);
                                        }}
                                    >
                                        Payment Terms
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="mb-3 d-flex align-items-start">
                            <Form.Check
                                type="checkbox"
                                name="agreeRefund"
                                id="agreeRefund"
                                checked={form.agreeRefund}
                                onChange={handleInput}
                                className="me-2"
                            />
                            <div>
                                <label htmlFor="agreeRefund" className="mb-0">
                                    I agree to the{' '}
                                    <span
                                        style={{ color: '#0d6efd', textDecoration: 'underline', cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowRefundTerms(true);
                                        }}
                                    >
                                        Refund Terms
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" size="sm" onClick={() => setForm(defaultForm)}>Reset</Button>
                            <Button type="submit" size="sm" variant="success">Submit</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Terms Modals */}
            <PaymentTermsModal show={showPaymentTerms} handleClose={() => setShowPaymentTerms(false)} />
            <RefundTermsModal show={showRefundTerms} handleClose={() => setShowRefundTerms(false)} />
        </>
    );
};

export default PaymentModal;
