import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { BsExclamationTriangle, BsXCircleFill, BsTelephoneFill, BsXCircle } from 'react-icons/bs';

const ErrorModal = ({ show, handleClose, message }) => {
    return (
        <Modal show={show} onHide={handleClose} centered className="premium-modal">
            <Modal.Header
                closeButton
                style={{
                    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.2rem 1.5rem'
                }}
            >
                <Modal.Title className="fw-bold d-flex align-items-center">
                    <BsExclamationTriangle className="me-2" /> আবেদন ব্যর্থ হয়েছে
                </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ padding: '2.5rem 2rem', backgroundColor: '#fffdfd' }}>
                <div className="text-center mb-4">
                    <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3" style={{ border: '1px solid rgba(220, 53, 69, 0.2)' }}>
                        <BsXCircleFill className="text-danger" style={{ fontSize: '3.5rem' }} />
                    </div>
                    <h5 className="text-dark fw-bold mb-3">{message}</h5>
                    <p className="text-muted small px-3">অনুগ্রহ করে উপরের তথ্য সঠিকভাবে পূরণ করে পুনরায় চেষ্টা করুন অথবা আমাদের টিমের সাহায্য নিন।</p>
                </div>

                <div className="p-3 rounded-3" style={{ background: '#f8f9fa', border: '1px solid #eee' }}>
                    <div className="d-flex align-items-center justify-content-center">
                        <span className="text-muted me-2">সহযোগিতার জন্য:</span>
                        <a
                            href="tel:+8801571305804"
                            className="text-decoration-none fw-bold text-danger d-flex align-items-center"
                        >
                            <BsTelephoneFill className="me-2" /> 01540-376020
                        </a>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer style={{ border: 'none', backgroundColor: '#fffdfd', padding: '1rem 1.5rem 2rem' }}>
                <Button
                    variant="outline-danger"
                    onClick={handleClose}
                    className="w-100 py-2 fw-bold"
                    style={{ borderRadius: '10px' }}
                >
                    <BsXCircle className="me-2" /> বন্ধ করুন
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ErrorModal;
