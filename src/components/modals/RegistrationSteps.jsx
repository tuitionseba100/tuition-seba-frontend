import React from "react";
import { Modal, Button } from "react-bootstrap";
import {
    FaChalkboardTeacher,
    FaWhatsapp,
    FaUserEdit,
    FaCheckCircle,
    FaInfoCircle,
    FaIdCard,
    FaGift,
    FaExclamationTriangle,
    FaBullseye,
    FaShieldAlt
} from "react-icons/fa";
import { usePublicSettings } from "../../context/PublicSettingsContext";

const RegistrationSteps = ({ show, handleClose }) => {
    const { whatsappNumber, getWhatsAppUrl } = usePublicSettings();

    const steps = [
        {
            icon: <FaUserEdit />,
            title: "ধাপ ১: বায়োডাটা পূরণ",
            color: "#0066cc",
            content: (
                <div>
                    <p className="mb-2 text-dark">আপনার প্রয়োজনীয় তথ্য দিয়ে Teacher Biodata/Profile সম্পূর্ণ করুন।</p>
                    <div>
                        <a
                            href="https://www.tuitionsebaforum.com/teacherRegistration"
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-primary fw-bold rounded-pill px-3 py-1 shadow-sm"
                        >
                            👉 বায়োডাটা পূরণ করুন
                        </a>
                    </div>
                </div>
            )
        },
        {
            icon: <FaWhatsapp />,
            title: "ধাপ ২: ভেরিফিকেশন",
            color: "#25D366",
            content: (
                <div>
                    <p className="mb-1 text-dark">
                        যদি ওয়েবসাইটে/ Apps-এ ডকুমেন্টস সাবমিট করে না থাকেন তাহলে WhatsApp-এ আপনার প্রয়োজনীয় শিক্ষাগত ও পরিচয় সংক্রান্ত তথ্য/ডকুমেন্ট জমা দিন।
                    </p>
                    <p className="mb-2 text-secondary fw-semibold small">
                        আমাদের টিম আপনার তথ্য যাচাই করে Verified Teacher Profile তৈরি করবে।
                    </p>
                    {whatsappNumber && (
                        <div>
                            <a
                                href={getWhatsAppUrl ? getWhatsAppUrl("আসসালামু আলাইকুম, আমি শিক্ষক ভেরিফিকেশনের জন্য প্রয়োজনীয় ডকুমেন্ট পাঠাতে চাই।") : `https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-success fw-bold rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 shadow-sm"
                            >
                                <FaWhatsapp /> WhatsApp-এ ডকুমেন্ট জমা দিন ({whatsappNumber})
                            </a>
                        </div>
                    )}
                </div>
            )
        },
        {
            icon: <FaGift />,
            title: "ধাপ ৩: কোনো Membership Fee নেই",
            color: "#198754",
            content: (
                <div style={{ background: '#f0fdf4', padding: '12px 14px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                    <div className="fw-bold text-success mb-1">🎉 নতুন শিক্ষকদের জন্য Membership সম্পূর্ণ ফ্রি।</div>
                    <div className="text-dark small mb-1">
                        <span className="text-success fw-bold me-1">✅</span> কোনো Registration Fee নেই<br />
                        <span className="text-success fw-bold me-1">✅</span> কোনো Advance Media Fee নেই
                    </div>
                    <div className="text-muted small">
                        আপনাকে টিউশন পাওয়ার আগে কোনো Membership বা Media Fee দিতে হবে না।
                    </div>
                </div>
            )
        },
        {
            icon: <FaIdCard />,
            title: "ধাপ ৪: Teacher Code",
            color: "#6f42c1",
            content: (
                <div>
                    <p className="mb-1 text-dark">
                        ভেরিফিকেশন ও প্রোফাইল সম্পন্ন হলে আপনি একটি <strong>Unique Teacher Code</strong> পাবেন।
                    </p>
                    <p className="mb-0 text-muted small">
                        এই Teacher Code ব্যবহার করে আপনি আমাদের টিউশনগুলোতে আবেদন করতে পারবেন এবং ভবিষ্যতে আপনার প্রোফাইল সহজেই শনাক্ত করা যাবে।
                    </p>
                </div>
            )
        }
    ];

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" className="premium-modal">
            <Modal.Header
                closeButton
                style={{
                    background: "linear-gradient(135deg, #004085 0%, #0066cc 100%)",
                    color: "white",
                    border: "none",
                    padding: "1.25rem 1.75rem"
                }}
            >
                <Modal.Title className="d-flex align-items-center">
                    <div className="bg-white rounded-circle p-2 me-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '42px', height: '42px' }}>
                        <FaChalkboardTeacher style={{ color: "#004085", fontSize: '20px' }} />
                    </div>
                    <div>
                        <span className="fw-bold fs-5">কীভাবে শিক্ষক হিসেবে যুক্ত হবেন?</span>
                        <div className="text-white-50 small" style={{ fontSize: '0.78rem' }}>Tuition Seba Forum - Teacher Guidelines</div>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
                style={{
                    maxHeight: "75vh",
                    overflowY: "auto",
                    padding: "1.75rem",
                    backgroundColor: "#fcfdfe"
                }}
            >
                {/* Intro Section */}
                <div className="text-center mb-4">
                    <h5 style={{ color: "#004085", fontWeight: '700' }} className="mb-2">আসসালামু আলাইকুম</h5>
                    <p style={{ fontSize: "1rem", color: "#444", marginBottom: 0 }}>
                        নিচের ধাপগুলো সম্পন্ন করলেই আপনি আমাদের শিক্ষক প্ল্যাটফর্মে যুক্ত হতে পারবেন:
                    </p>
                    <hr style={{ width: '60px', margin: '0.75rem auto', borderTop: '3px solid #0066cc', borderRadius: '3px' }} />
                </div>

                {/* Steps Section */}
                <div className="steps-container px-2 mb-4">
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
                                        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                                        border: `1.5px solid ${step.color}33`
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
                                        opacity: 0.25,
                                        zIndex: 1,
                                    }}
                                ></div>
                            )}

                            <div className="ms-3 flex-grow-1">
                                <h6 className="fw-bold mb-1" style={{ color: "#333", fontSize: '1.05rem' }}>{step.title}</h6>
                                <div style={{ fontSize: '0.92rem', lineHeight: '1.55' }}>{step.content}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Media Fee Policy */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #f0fdf4 0%, #e8f7ee 100%)",
                        border: "1px solid #86efac",
                        borderLeft: "6px solid #22c55e",
                        padding: "1.25rem",
                        borderRadius: "12px",
                        marginBottom: "1.25rem",
                        boxShadow: "0 4px 15px rgba(34, 197, 94, 0.08)"
                    }}
                >
                    <h6 className="fw-bold d-flex align-items-center text-success mb-2" style={{ fontSize: '1.05rem' }}>
                        <span className="me-2">🟢</span> আমাদের Media Fee Policy
                    </h6>
                    <p className="mb-2 text-dark" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                        আপনি টিউশন কনফার্ম করে অথবা বেতন পাওয়ার পর নির্ধারিত Media Fee পরিশোধ করবেন। (শর্তসাপেক্ষে)
                    </p>
                    <div 
                        className="p-2 px-3 my-2 text-center rounded-3 fw-bold text-dark shadow-sm" 
                        style={{ background: '#bbf7d0', fontSize: '0.86rem', letterSpacing: '0.3px', border: '1px dashed #22c55e' }}
                    >
                        NO ADVANCE | NO MEMBERSHIP FEE | MEDIA FEE AFTER CONFIRM/ AFTER SALARY
                    </div>
                    <p className="mb-0 text-muted small">
                        অর্থাৎ, টিউশন পাওয়ার আগে শুধু Membership বা Media Fee-এর জন্য কোনো টাকা দিতে হবে না।
                    </p>
                </div>

                {/* Important Notice */}
                <div
                    style={{
                        background: "#fffbeb",
                        border: "1px solid #fde68a",
                        borderLeft: "6px solid #f59e0b",
                        padding: "1.25rem",
                        borderRadius: "12px",
                        marginBottom: "1.5rem",
                        boxShadow: "0 4px 15px rgba(245, 158, 11, 0.08)"
                    }}
                >
                    <h6 className="fw-bold d-flex align-items-center text-warning-emphasis mb-2" style={{ fontSize: '1.05rem' }}>
                        <FaExclamationTriangle className="text-warning me-2" /> গুরুত্বপূর্ণ
                    </h6>
                    <ul className="mb-0 text-dark ps-3" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                        <li className="mb-1">Membership ফ্রি হলেও আমাদের প্ল্যাটফর্মের নিয়ম-কানুন মেনে চলা বাধ্যতামূলক।</li>
                        <li className="mb-1">অভিভাবকের নম্বর পাওয়ার পর দ্রুত যোগাযোগ ও টিউশনের সর্বশেষ আপডেট প্রদান করতে হবে।</li>
                        <li className="text-danger fw-semibold">টিউশন কনফার্ম হওয়ার পর কোনো ধরনের অনিয়ম, ভুল তথ্য প্রদান বা নিয়ম ভঙ্গ করলে আপনার Teacher Profile-এর বিরুদ্ধে ব্যবস্থা নেওয়া হতে পারে।</li>
                    </ul>
                </div>

                {/* Why Join Tuition Seba Forum */}
                <div
                    style={{
                        background: "#f8faff",
                        border: "1px solid #dbeafe",
                        padding: "1.35rem",
                        borderRadius: "12px",
                        marginBottom: "1rem"
                    }}
                >
                    <h6 className="fw-bold text-primary mb-3 d-flex align-items-center" style={{ fontSize: '1.05rem' }}>
                        <FaBullseye className="me-2 text-danger" /> কেন Tuition Seba Forum-এ যুক্ত হবেন?
                    </h6>
                    <div className="row g-2">
                        {[
                            "Free Teacher Membership",
                            "Verified Teacher Profile",
                            "নিয়মিত টিউশন সুযোগ",
                            "Tuition Information & Updates",
                            "Profile Promotion সুবিধা",
                            "After-Confirm/ Salary Media Fee",
                            "Teacher Support",
                            "সহজে টিউশনে Apply করার সুবিধা",
                            "Tuition Alert SMS"
                        ].map((item, idx) => (
                            <div key={idx} className="col-12 col-md-6">
                                <div className="d-flex align-items-center p-2 rounded-2 bg-white border border-light shadow-sm">
                                    <FaCheckCircle className="text-success me-2 flex-shrink-0" />
                                    <span className="small fw-semibold text-secondary">{item}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Branding */}
                <div className="text-center pt-3 border-top mt-3">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                        <FaShieldAlt className="text-primary" />
                        <h6 className="fw-bold text-primary mb-0">Tuition Seba Forum</h6>
                    </div>
                    <p className="text-muted small mb-0 fst-italic">Fast | Trusted | Secured Tuition Service</p>
                </div>
            </Modal.Body>
            <Modal.Footer style={{ border: 'none', padding: '1rem 1.75rem', backgroundColor: '#fcfdfe' }}>
                <Button
                    variant="primary"
                    onClick={handleClose}
                    style={{
                        borderRadius: '10px',
                        padding: '8px 26px',
                        fontWeight: '600'
                    }}
                >
                    বুঝেছি, বন্ধ করুন
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RegistrationSteps;
