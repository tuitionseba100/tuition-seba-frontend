import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { BsExclamationTriangle, BsXCircleFill, BsTelephoneFill, BsXCircle } from 'react-icons/bs';

const ErrorModal = ({ show, handleClose, message }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <div className="modal-content border border-danger">
                <Modal.Header closeButton style={{ backgroundColor: '#dc3545', color: 'white' }}>
                    <Modal.Title>
                        <BsExclamationTriangle className="me-2" />
                        আবেদন ব্যর্থ হয়েছে
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="text-center">
                    <div className="mb-3">
                        <BsXCircleFill className="text-danger" style={{ fontSize: '4rem' }} />
                    </div>

                    <h5 className="text-danger">{message}</h5>

                    <p
                        className="text-muted mt-3 mb-0"
                        style={{ fontSize: '0.95rem', lineHeight: 1.4 }}
                    >
                        অনুগ্রহ করে উপরের তথ্য সঠিকভাবে পূরণ করে পুনরায় চেষ্টা করুন।
                        <br />
                        যদি কোনো সমস্যা হয়, আমাদের টিমের সাথে যোগাযোগ করুন:
                        <a
                            href="tel:+8801540376020"
                            className="text-decoration-none fw-semibold text-primary"
                            style={{ marginLeft: '4px' }}
                        >
                            <BsTelephoneFill className="me-1" />
                            01540-376020
                        </a>
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        <BsXCircle className="me-2" />
                        Close
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
};

export default ErrorModal;
