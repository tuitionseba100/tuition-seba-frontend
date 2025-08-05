import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import RefundTermsModal from './RefundTermsModal';

const RefundModal = ({ show, handleClose }) => {
    const defaultForm = {
        tuitionCode: '', paymentType: '', paymentNumber: '',
        amount: '', name: '', personalPhone: '', note: '', agreeRefund: false
    };
    const [form, setForm] = useState(defaultForm);
    const [showRefundTerms, setShowRefundTerms] = useState(false);

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.agreeRefund) {
            return toast.error('Please agree to refund terms.');
        }

        try {
            const res = await fetch('https://tuition-seba-backend-1.onrender.com/api/refund/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                toast.success('Refund requested!');
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
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>Refund Form</Modal.Title>
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
                        {renderField('Number (Bkash/Nagad)', 'paymentNumber')}
                        {renderField('Amount', 'amount', 'number')}
                        {renderField('Your Name', 'name')}
                        {renderField('Contact Number/Whatsapp', 'personalPhone')}
                        <Form.Group className="mb-3">
                            <Form.Label>Note</Form.Label>
                            <Form.Control as="textarea" rows={3} name="note" value={form.note} onChange={handleInput} maxLength={500} />
                        </Form.Group>

                        {/* Refund terms agreement */}
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
                            <Button type="submit" size="sm" variant="danger">Submit</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Refund Terms Modal */}
            <RefundTermsModal show={showRefundTerms} handleClose={() => setShowRefundTerms(false)} />
        </>
    );
};

export default RefundModal;
