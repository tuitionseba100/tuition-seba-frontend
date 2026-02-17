import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const ProcessingModal = ({ show }) => {
    return (
        <Modal
            show={show}
            centered
            backdrop="static"
            keyboard={false}
            dialogClassName="processing-modal"
            contentClassName="bg-transparent border-0 shadow-none"
        >
            <Modal.Body className="d-flex flex-column align-items-center justify-content-center">
                <div
                    className="p-4 rounded-4 bg-white shadow-lg text-center position-relative overflow-hidden"
                    style={{
                        minWidth: '280px',
                        maxWidth: '90vw'
                    }}
                >
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-light opacity-50 z-0"></div>

                    <div className="position-relative z-1">
                        <div className="mb-4 position-relative d-inline-block">
                            <Spinner
                                animation="border"
                                variant="primary"
                                style={{ width: '3rem', height: '3rem', borderWidth: '0.25rem' }}
                            />
                            <div
                                className="position-absolute top-50 start-50 translate-middle bg-white rounded-circle"
                                style={{ width: '2rem', height: '2rem', padding: '0.4rem' }}
                            >
                                <img
                                    src="/favicon.ico"
                                    alt=""
                                    className="w-100 h-100 object-fit-contain"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        </div>

                        <h5 className="fw-bold mb-2 text-dark">আবেদন জমা দেওয়া হচ্ছে...</h5>
                        <p className="text-muted mb-0 small">অনুগ্রহ করে অপেক্ষা করুন</p>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ProcessingModal;
