import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const DuplicateAlertModal = ({ show, handleClose, message }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header
                closeButton
                style={{
                    background: 'linear-gradient(135deg, #e53935 0%, #ef9a9a 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.2rem 1.5rem'
                }}
            >
                <Modal.Title className="fw-bold">ডুপ্লিকেট আবেদন!</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ padding: '2rem 1.8rem', backgroundColor: '#fffafa' }}>
                {/* Icon + heading */}
                <div className="text-center mb-4">
                    <div
                        className="d-inline-flex p-4 mb-3 rounded-circle"
                        style={{ backgroundColor: '#fdecea', border: '1px solid #f5c6cb' }}
                    >
                        <FaExclamationTriangle style={{ fontSize: '3rem', color: '#c62828' }} />
                    </div>
                    <h5 className="fw-bold" style={{ color: '#b71c1c' }}>আবেদন গ্রহণ করা হয়নি</h5>
                </div>

                {/* Duplicate reason message */}
                <div
                    className="p-3 mb-4 rounded-3 text-center"
                    style={{ backgroundColor: '#fff3e0', border: '1px solid #ffcc80', color: '#4e342e', fontSize: '0.92rem', lineHeight: '1.6' }}
                >
                    <p className="mb-0">{message || 'এই তথ্য দিয়ে আগেই রিফান্ড আবেদন করা হয়েছে। একই তথ্য দিয়ে দুইবার আবেদন করা যাবে না।'}</p>
                </div>

                {/* Contact us section */}
                <div
                    className="p-3 rounded-3 d-flex align-items-center gap-2"
                    style={{ backgroundColor: '#e3f2fd', border: '1px solid #90caf9', fontSize: '0.88rem', color: '#1a237e' }}
                >
                    <span style={{ fontSize: '1.3rem' }}>📞</span>
                    <span>
                        Need help? Feel free to <strong>contact us</strong> for any assistance —{' '}
                        <a
                            href="tel:01633920928"
                            style={{ color: '#c62828', fontWeight: 700, textDecoration: 'none' }}
                        >
                            01633920928
                        </a>{' '}
                        (Call / WhatsApp)
                    </span>
                </div>
            </Modal.Body>

            <Modal.Footer style={{ border: 'none', backgroundColor: '#fffafa', padding: '0.5rem 1.5rem 1.5rem' }}>
                <Button
                    variant="danger"
                    onClick={handleClose}
                    className="w-100 py-2 fw-bold"
                    style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(198, 40, 40, 0.2)' }}
                >
                    ঠিক আছে
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DuplicateAlertModal;
