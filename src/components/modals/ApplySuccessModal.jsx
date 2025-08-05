import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ApplySuccessModal = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-primary">Success</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="text-center">
                    <i
                        className="bi bi-check-circle"
                        style={{ color: 'green', fontSize: '2rem' }}
                        aria-hidden="true"
                    ></i>
                    <h4 style={{ color: 'green', marginTop: '10px' }}>আপনার আবেদন সফল হয়েছে!</h4>
                </div>

                <p className="mt-3 mb-3 text-center">
                    দ্রুত সময়ের মধ্যে আমাদের একজন এজেন্ট আপনার সঙ্গে যোগাযোগ করবেন।
                </p>

                <hr />

                <p className="text-center mb-0">Tuition Seba Forum-এর সাথে থাকার জন্য ধন্যবাদ।</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


export default ApplySuccessModal;
