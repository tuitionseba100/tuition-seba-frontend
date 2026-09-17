import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle, FaUserGraduate, FaCopy, FaCheck, FaKey, FaBookmark, FaInfoCircle } from 'react-icons/fa';

const TeacherRegistrationSuccessModal = ({ show, handleClose, teacherCode }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyCode = () => {
        if (!teacherCode) return;
        navigator.clipboard.writeText(teacherCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            className="teacher-success-modal"
            size="md"
        >
            <Modal.Header
                closeButton
                className="border-0 pb-0"
                style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    borderRadius: '20px 20px 0 0'
                }}
            />

            <Modal.Body
                className="text-center pt-0 px-4 pb-4"
                style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '0 0 20px 20px'
                }}
            >
                <div className="mb-3 mt-n4">
                    <div
                        className="d-inline-flex justify-content-center align-items-center"
                        style={{
                            width: '76px',
                            height: '76px',
                            borderRadius: '50%',
                            background: 'white',
                            boxShadow: '0 10px 25px rgba(40, 167, 69, 0.25)',
                            padding: '10px'
                        }}
                    >
                        <FaCheckCircle className="text-success" size={54} />
                    </div>
                </div>

                <h4 className="fw-bold mb-1" style={{ color: '#004085' }}>
                    নিবন্ধন সফল হয়েছে! 🎉
                </h4>
                <p className="text-muted small mb-3">
                    টিউশন সেবা ফোরামে আপনাকে স্বাগতম। আপনার শিক্ষক প্রোফাইল নিবন্ধিত হয়েছে।
                </p>

                {/* Highlighted Teacher Code Box */}
                {teacherCode && (
                    <div
                        className="p-3 rounded-4 mb-3 text-center position-relative shadow-sm"
                        style={{
                            background: 'linear-gradient(135deg, #0d3b66 0%, #004085 50%, #0066cc 100%)',
                            color: '#fff',
                            border: '2px solid #38bdf8'
                        }}
                    >
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                            <FaKey className="text-warning" size={16} />
                            <span className="text-uppercase fw-bold" style={{ fontSize: '0.85rem', letterSpacing: '1px', color: '#bae6fd' }}>
                                আপনার টিচার কোড (Teacher Code)
                            </span>
                        </div>

                        <div className="d-flex align-items-center justify-content-center gap-3 my-2">
                            <span
                                className="fw-bolder px-3 py-1 rounded-3"
                                style={{
                                    fontSize: '1.75rem',
                                    letterSpacing: '2px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    color: '#ffffff',
                                    fontFamily: 'monospace',
                                    border: '1px dashed #7dd3fc'
                                }}
                            >
                                {teacherCode}
                            </span>
                            <Button
                                variant={copied ? 'success' : 'light'}
                                size="sm"
                                onClick={handleCopyCode}
                                className="fw-bold d-flex align-items-center gap-1 shadow-sm px-3 py-2"
                                style={{ borderRadius: '8px' }}
                                title="Copy Code"
                            >
                                {copied ? (
                                    <>
                                        <FaCheck className="text-white" /> কপি হয়েছে
                                    </>
                                ) : (
                                    <>
                                        <FaCopy /> কপি করুন
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="small mt-2 p-2 rounded-2" style={{ backgroundColor: 'rgba(0,0,0,0.25)', color: '#fef08a', fontSize: '0.85rem' }}>
                            <FaBookmark className="me-1" />
                            <strong>গুরুত্বপূর্ণ:</strong> কোডটি অবশ্যই কোথাও লিখে বা কপি করে যত্নসহকারে সংরক্ষণ করে রাখুন!
                        </div>
                    </div>
                )}

                {/* Apply Instructions Card */}
                <div
                    className="p-3 rounded-3 text-start mb-3"
                    style={{
                        backgroundColor: '#ecfdf5',
                        borderLeft: '4px solid #10b981',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                >
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <FaInfoCircle className="text-success" />
                        <span className="fw-bold text-success" style={{ fontSize: '0.92rem' }}>
                            ভবিষ্যতে টিউশনে আবেদনের নিয়ম:
                        </span>
                    </div>
                    <p className="mb-0 text-dark small" style={{ lineHeight: '1.6' }}>
                        এখন থেকে ওয়েবসাইটের যেকোনো টিউশন পোস্টে আপনার <strong>ফোন নম্বর</strong> এবং এই <strong>টিচার কোড ({teacherCode || 'Code'})</strong> ব্যবহার করে আবেদন করতে পারবেন।
                    </p>
                </div>

                {/* Follow-up Note */}
                <div
                    className="p-2 rounded-3 text-center mb-3"
                    style={{
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #e2e8f0'
                    }}
                >
                    <p className="mb-0 text-muted small">
                        আমাদের প্রতিনিধি শীঘ্রই আপনার প্রোফাইল যাচাই করবেন। ফোন সচল রাখুন।
                    </p>
                </div>

                <p className="text-muted small mb-3 fst-italic">
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
                    ঠিক আছে, বুঝেছি
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default TeacherRegistrationSuccessModal;
