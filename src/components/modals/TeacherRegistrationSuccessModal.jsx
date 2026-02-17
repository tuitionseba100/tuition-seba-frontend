import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle, FaUserGraduate } from 'react-icons/fa';

const TeacherRegistrationSuccessModal = ({ show, handleClose }) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            className="teacher-success-modal"
            dialogClassName="modal-dialog-centered modal-sm-custom" // Custom class for width control if needed
        >
            <Modal.Header
                closeButton
                className="border-0 pb-0"
                style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    borderRadius: '20px 20px 0 0'
                }}
            >
            </Modal.Header>

            <Modal.Body
                className="text-center pt-0 px-4 pb-4"
                style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '0 0 20px 20px'
                }}
            >
                <div className="mb-4 mt-n4">
                    <div
                        className="d-inline-flex justify-content-center align-items-center"
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'white',
                            boxShadow: '0 10px 25px rgba(40, 167, 69, 0.2)',
                            padding: '10px'
                        }}
                    >
                        <FaCheckCircle className="text-success" size={60} />
                    </div>
                </div>

                <h4 className="fw-bold mb-3" style={{ color: '#004085' }}>
                    ✅ আবেদন সফল!
                </h4>

                <div className="mb-4">
                    <p className="text-muted mb-1 small">
                        আপনার আবেদনটি সফলভাবে রিসিভ করা হয়েছে এবং যাচাই প্রক্রিয়ায় যুক্ত হয়েছে।
                    </p>
                </div>

                <div
                    className="p-3 rounded-3 text-center mx-auto mb-4"
                    style={{
                        backgroundColor: '#e7f1ff',
                        borderLeft: '4px solid #004085',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                >
                    <p className="mb-1 text-dark fw-bold small">
                        আমাদের প্রতিনিধি <span className="text-danger">২৪ ঘণ্টার</span> মধ্যে যোগাযোগ করবেন।
                    </p>
                    <p className="mb-0 text-primary small fw-bold">
                        ফোন সচল রাখুন।
                    </p>
                </div>

                <p className="text-muted small mb-4 fst-italic">
                    <FaUserGraduate className="me-1" />
                    Tuition Seba Forum–এর সাথে যুক্ত হওয়ার জন্য ধন্যবাদ।
                </p>

                <Button
                    onClick={handleClose}
                    className="w-100 rounded-pill fw-bold py-2"
                    style={{
                        background: 'linear-gradient(135deg, #004085 0%, #0066cc 100%)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0, 64, 133, 0.3)'
                    }}
                >
                    ঠিক আছে
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default TeacherRegistrationSuccessModal;
