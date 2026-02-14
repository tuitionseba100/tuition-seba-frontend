import React from 'react';
import { Modal, Button } from 'react-bootstrap';

import { FaCheckCircle } from 'react-icons/fa';

const ApplySuccessModal = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered className="premium-modal">
            <Modal.Header
                closeButton
                style={{
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.2rem 1.5rem'
                }}
            >
                <Modal.Title className="fw-bold">আবেদন সফল!</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ padding: '2.5rem 2rem', backgroundColor: '#fcfdfc' }}>
                <div className="text-center mb-4">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3" style={{ border: '1px solid rgba(40, 167, 69, 0.2)' }}>
                        <FaCheckCircle className="text-success" style={{ fontSize: '3.5rem' }} />
                    </div>
                    <h3 className="fw-bold" style={{ color: '#1e7e34' }}>ধন্যবাদ!</h3>
                    <h5 className="text-dark">আপনার আবেদনটি সফলভাবে জমা হয়েছে।</h5>
                </div>

                <div className="p-3 rounded-3 text-center" style={{ backgroundColor: '#f0fff4', border: '1px solid #c6f6d5', color: '#2f855a' }}>
                    <p className="mb-0 fw-medium">খুব দ্রুত আমাদের একজন প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।</p>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-muted small">Tuition Seba Forum-এর সাথে ক্যারিয়ার গড়ার জন্য আমরা আপনার সিদ্ধান্তের প্রশংসা করি।</p>
                </div>
            </Modal.Body>

            <Modal.Footer style={{ border: 'none', backgroundColor: '#fcfdfc', padding: '1rem 1.5rem 2rem' }}>
                <Button
                    variant="success"
                    onClick={handleClose}
                    className="w-100 py-2 fw-bold"
                    style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(40, 167, 69, 0.2)' }}
                >
                    ঠিক আছে
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


export default ApplySuccessModal;
