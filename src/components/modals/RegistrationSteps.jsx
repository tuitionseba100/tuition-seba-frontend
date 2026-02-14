import React from "react";
import { Modal, Button } from "react-bootstrap";
import {
    FaChalkboardTeacher,
    FaWhatsapp,
    FaUserEdit,
    FaMoneyBill,
    FaCheckCircle,
    FaInfoCircle,
} from "react-icons/fa";

const PremiumTeacherModal = ({ show, handleClose }) => {
    const steps = [
        {
            icon: <FaWhatsapp />,
            title: "ধাপ ১: ভেরিফিকেশন",
            text: "WhatsApp-এ আপনার বর্তমান শিক্ষা প্রতিষ্ঠানের আইডি কার্ড বা ভর্তি রসিদের ছবি পাঠাতে হবে। আমরা এটি সতর্কতার সাথে যাচাই করবো।",
            color: "#25D366"
        },
        {
            icon: <FaUserEdit />,
            title: "ধাপ ২: বায়োডাটা পূরণ",
            text: (
                <>
                    আমাদের ওয়েবসাইটে আপনার তথ্যবহুল বায়োডাটা পূরণ করুন 👉{" "}
                    <a
                        href="https://www.tuitionsebaforum.com/teacherRegistration"
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontWeight: "600", color: "#0066cc", textDecoration: 'none' }}
                    >
                        রেজিস্ট্রেশন লিঙ্ক
                    </a>{" "}
                </>
            ),
            color: "#0066cc"
        },
        {
            icon: <FaMoneyBill />,
            title: "ধাপ ৩: মেম্বারশিপ ফি",
            text: (
                <div style={{ background: 'rgba(0, 0, 0, 0.03)', padding: '10px', borderRadius: '8px', marginTop: '5px' }}>
                    <div className="mb-1">ফি: <strong>২০০ টাকা</strong> (অফেরতযোগ্য)</div>
                    <div style={{ fontSize: '0.9rem' }}>
                        <span className="badge bg-primary me-1">Personal</span> 01633920928 (Bkash/Nagad)<br />
                        <span className="badge bg-success me-1">Merchant</span> 01714045039 (Bkash App)
                    </div>
                </div>
            ),
            color: "#FFD700"
        },
        {
            icon: <FaCheckCircle />,
            title: "ধাপ ৪: মেম্বার কোড",
            text: "রেজিস্ট্রেশন সম্পন্ন হলে আপনি একটি ইউনিক মেম্বার কোড পাবেন। এটি ব্যবহার করে যেকোনো টিউশনে সহজেই আবেদন করতে পারবেন।",
            color: "#28a745"
        },
    ];

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" className="premium-modal">
            <Modal.Header
                closeButton
                style={{
                    background: "linear-gradient(135deg, #004085 0%, #0066cc 100%)",
                    color: "white",
                    border: "none",
                    padding: "1.5rem 2rem"
                }}
            >
                <Modal.Title className="d-flex align-items-center">
                    <div className="bg-white rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <FaChalkboardTeacher style={{ color: "#004085", fontSize: '20px' }} />
                    </div>
                    <span className="fw-bold">প্রিমিয়াম রেজিস্টার টিচার মেম্বারশিপ</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
                style={{
                    maxHeight: "75vh",
                    overflowY: "auto",
                    padding: "2rem",
                    backgroundColor: "#fcfdfe"
                }}
            >
                <div className="text-center mb-4">
                    <h4 style={{ color: "#004085", fontWeight: '700' }} className="mb-3">আসসালামু আলাইকুম</h4>
                    <p className="lead" style={{ fontSize: "1.05rem", color: "#444" }}>
                        আমরা চাই আপনাদের সর্বোচ্চ মানের সেবা প্রদান করতে, তাই বর্তমানে আমরা শুধুমাত্র
                        <strong className="text-primary mx-1">প্রিমিয়াম রেজিস্টার টিচারদের</strong> টিউশন দিয়ে থাকি।
                    </p>
                    <hr style={{ width: '50px', margin: '1.5rem auto', borderTop: '3px solid #0066cc', borderRadius: '3px' }} />
                </div>

                <div className="mb-4">
                    <p style={{ color: "#555", lineHeight: '1.6' }}>
                        বিগত ৫ বছর ধরে টিউশন মিডিয়া হিসেবে বিশ্বস্তর সাথে কাজ করে আমরা অভিভাবক ও শিক্ষকদের প্রচুর ভালোবাসা পেয়েছি। মেম্বারশিপ নিলে আপনি আজীবনের জন্য আমাদের সম্মানিত শিক্ষক হিসেবে যুক্ত থাকবেন।
                    </p>
                </div>

                <div
                    style={{
                        background: "linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%)",
                        borderLeft: "5px solid #0066cc",
                        padding: "1.2rem",
                        borderRadius: "8px",
                        marginBottom: "2.5rem",
                        boxShadow: "0 4px 12px rgba(0, 102, 204, 0.05)"
                    }}
                >
                    <div className="d-flex align-items-center mb-2">
                        <FaInfoCircle className="text-primary me-2" />
                        <strong className="text-dark">কিভাবে মেম্বারশিপ নেবেন?</strong>
                    </div>
                    <p className="mb-0 text-muted" style={{ fontSize: '0.95rem' }}>নিচের সহজ ধাপগুলো অনুসরণ করে আজই যুক্ত হোন আমাদের সাথে:</p>
                </div>

                <div className="steps-container px-2">
                    {steps.map((step, i) => (
                        <div key={i} className="d-flex mb-4 position-relative">
                            <div className="step-icon-wrapper" style={{ zIndex: 2 }}>
                                <div
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "15px",
                                        background: "white",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: step.color,
                                        fontSize: "22px",
                                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                                        border: `1px solid ${step.color}22`
                                    }}
                                >
                                    {step.icon}
                                </div>
                            </div>

                            {i < steps.length - 1 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "50px",
                                        left: "24px",
                                        width: "2px",
                                        height: "calc(100% - 10px)",
                                        background: "linear-gradient(to bottom, #0066cc 20%, transparent 100%)",
                                        opacity: 0.2,
                                        zIndex: 1,
                                    }}
                                ></div>
                            )}

                            <div className="ms-4 flex-grow-1">
                                <h6 className="fw-bold mb-1" style={{ color: "#333", fontSize: '1.1rem' }}>{step.title}</h6>
                                <div className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{step.text}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        background: "#fff9e6",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        marginTop: "2rem",
                        border: "1px dashed #ffd966",
                        boxShadow: "0 4px 15px rgba(255, 217, 102, 0.1)"
                    }}
                >
                    <div className="d-flex mb-2">
                        <span className="badge bg-warning text-dark me-2 d-flex align-items-center">বিঃদ্রঃ</span>
                        <p className="mb-0 fw-semibold text-dark">মেম্বারশিপ ছাড়াও টিউশন সম্ভব!</p>
                    </div>
                    <p className="mb-2" style={{ fontSize: '0.9rem', color: '#665c33' }}>
                        এ ক্ষেত্রে <strong>৬০% মিডিয়া ফি অগ্রিম</strong> দিতে হবে। আর মেম্বারশিপ থাকলে সুবিধা পাচ্ছেন <strong>৩০% অগ্রিম এবং বাকি ৩০% প্রথম মাসের বেতন পাওয়ার পর</strong>।
                    </p>
                    <div className="mt-3 pt-2 border-top border-warning border-opacity-25">
                        <small className="text-muted">📌 বিস্তারিত জানতে ভিজিট করুন: </small>
                        <a href="https://www.tuitionsebaforum.com" target="_blank" rel="noreferrer" className="text-decoration-none fw-bold text-primary">
                            www.tuitionsebaforum.com
                        </a>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer style={{ border: 'none', padding: '1.5rem', backgroundColor: '#fcfdfe' }}>
                <Button
                    variant="light"
                    onClick={handleClose}
                    style={{
                        borderRadius: '10px',
                        padding: '10px 30px',
                        fontWeight: '600',
                        color: '#666',
                        border: '1px solid #eee'
                    }}
                >
                    বন্ধ করুন
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PremiumTeacherModal;
