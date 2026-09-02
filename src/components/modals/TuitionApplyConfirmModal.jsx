import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import {
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimes,
    FaChalkboardTeacher,
    FaUsers,
    FaUniversity,
    FaBook,
    FaLanguage,
    FaBookOpen,
    FaCalendarDay,
    FaClock,
    FaMoneyBillWave,
    FaMapMarkerAlt,
    FaCalendarCheck,
    FaInfoCircle
} from 'react-icons/fa';

const TuitionApplyConfirmModal = ({
    show,
    onClose,
    onConfirm,
    tuition = {},
    initialComment = '',
    isLoading = false,
}) => {
    const [comment, setComment] = React.useState('');

    React.useEffect(() => {
        if (show) {
            setComment(initialComment || '');
        } else {
            setComment('');
        }
    }, [show, initialComment]);

    if (!show) return null;

    const formattedSalary = tuition.salary && /taka|tk/i.test(tuition.salary.toString())
        ? tuition.salary
        : (tuition.salary ? `${tuition.salary.toString().trim()} টাকা` : '');

    const locationText = `${tuition.location || ''}${tuition.area ? (tuition.location ? ', ' : '') + tuition.area : ''}`.trim();

    // Formatted helper values
    const classAndMedium = [
        tuition.class ? `Class ${tuition.class}` : '',
        tuition.medium ? `(${tuition.medium})` : ''
    ].filter(Boolean).join(' ');

    const dayAndTime = [
        tuition.day ? `${tuition.day} Days` : '',
        tuition.time || ''
    ].filter(Boolean).join(' • ');

    const salaryAndFee = [
        formattedSalary,
        tuition.mediaFee && tuition.mediaFee.trim() !== '' ? `(Media Fee: ${tuition.mediaFee})` : ''
    ].filter(Boolean).join(' ');

    const compactRow = (icon, label, value, highlight = false, fullWidth = false) => {
        if (!value) return null;
        return (
            <div className={fullWidth ? "col-12" : "col-12 col-md-6"}>
                <div
                    className="d-flex align-items-center justify-content-between py-1.5 px-2.5 rounded-2 h-100"
                    style={{
                        backgroundColor: highlight ? '#ecfdf5' : '#f8fafc',
                        border: highlight ? '1px solid #a7f3d0' : '1px solid #edf2f7',
                        minHeight: '30px',
                    }}
                >
                    <div className="d-flex align-items-center gap-1.5 text-muted me-2 flex-shrink-0" style={{ fontSize: '0.82rem' }}>
                        <span style={{ color: highlight ? '#059669' : '#0284c7', fontSize: '0.9rem' }}>{icon}</span>
                        <span className="fw-semibold">{label}:</span>
                    </div>
                    <div
                        className={`text-end fw-bold ${highlight ? 'text-success' : 'text-dark'}`}
                        style={{ fontSize: '0.85rem', wordBreak: 'break-word' }}
                    >
                        {value}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Modal
            show={show}
            onHide={isLoading ? undefined : onClose}
            centered
            backdrop="static"
            keyboard={!isLoading}
            size="lg"
            className="tuition-apply-confirm-modal"
            style={{ fontFamily: "'Hind Siliguri', 'Inter', sans-serif", zIndex: 1100 }}
        >
            <Modal.Header
                style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                    color: '#ffffff',
                    borderBottom: 'none',
                    padding: '10px 14px',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                }}
            >
                <div className="d-flex align-items-center justify-content-between w-100 flex-nowrap gap-1">
                    <div className="d-flex align-items-center gap-1.5 flex-nowrap flex-shrink-1 overflow-hidden" style={{ minWidth: 0 }}>
                        <FaExclamationTriangle className="text-warning flex-shrink-0" style={{ fontSize: '1.05rem' }} />
                        <span className="fw-bold text-truncate" style={{ fontSize: 'clamp(0.9rem, 3.8vw, 1.15rem)', whiteSpace: 'nowrap' }}>
                            আবেদন নিশ্চিতকরণ
                        </span>
                    </div>
                    <div className="d-flex align-items-center gap-1.5 flex-nowrap flex-shrink-0">
                        {tuition.tuitionCode && (
                            <span
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.78rem',
                                    fontWeight: '700',
                                    letterSpacing: '0.5px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Code: {tuition.tuitionCode}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            aria-label="Close"
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                color: '#ffffff',
                                borderRadius: '50%',
                                width: '26px',
                                height: '26px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                padding: 0,
                                outline: 'none',
                                flexShrink: 0
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.35)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        >
                            <FaTimes style={{ fontSize: '0.8rem' }} />
                        </button>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body style={{ padding: '14px 18px', backgroundColor: '#f1f5f9', maxHeight: '80vh', overflowY: 'auto' }}>
                {/* Check prompt header */}
                <div className="text-center mb-2">
                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.02rem' }}>
                        আপনি কি টিউশনের সব বিবরণ চেক করেছেন?
                    </h6>
                </div>

                {/* Compact Merged Tuition Details Card */}
                <div
                    className="p-2 p-sm-2.5 mb-2 bg-white rounded-3"
                    style={{
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                    }}
                >
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-1.5 mb-2 px-1">
                        <span className="fw-bold text-primary" style={{ fontSize: '0.88rem' }}>
                            <FaInfoCircle className="me-1" /> টিউশনের বিবরণ:
                        </span>
                        {tuition.tuitionCode && (
                            <span className="badge bg-primary bg-opacity-10 text-primary fw-bold" style={{ fontSize: '0.8rem' }}>
                                {tuition.tuitionCode}
                            </span>
                        )}
                    </div>

                    <div className="row g-1.5">
                        {compactRow(<FaChalkboardTeacher />, 'Wanted Teacher', tuition.wantedTeacher)}
                        {compactRow(<FaUsers />, 'Students', tuition.student)}
                        {compactRow(<FaBook />, 'Class', tuition.class ? (tuition.class.toString().toLowerCase().includes('class') ? tuition.class : `Class ${tuition.class}`) : '')}
                        {compactRow(<FaLanguage />, 'Medium', tuition.medium)}
                        {tuition.institute && compactRow(<FaUniversity />, 'Institute', tuition.institute)}
                        {tuition.joining && compactRow(<FaCalendarCheck />, 'Joining', tuition.joining)}
                        {compactRow(<FaCalendarDay />, 'Day & Time', dayAndTime)}
                        {compactRow(<FaMoneyBillWave />, 'Salary', salaryAndFee, true)}
                        {compactRow(<FaBookOpen />, 'Subject', tuition.subject, false, true)}
                        {compactRow(<FaMapMarkerAlt />, 'Location', locationText, false, true)}
                    </div>
                </div>

                {/* Warning Notice */}
                <div
                    className="p-2.5 px-3 rounded-3 mb-2"
                    style={{
                        backgroundColor: '#fff7ed',
                        border: '1px solid #fed7aa',
                        color: '#9a3412',
                        fontSize: '0.82rem',
                        lineHeight: '1.45'
                    }}
                >
                    <div className="d-flex align-items-start gap-2">
                        <FaExclamationTriangle
                            className="text-danger mt-0.5 flex-shrink-0"
                            style={{ fontSize: '1rem' }}
                        />
                        <div>
                            <span className="fw-bold text-danger me-1">জরুরি সতর্কতা:</span>
                            টিউশনের সকল বিবরণ (বেতন, লোকেশন ও সময়) আপনার অনুকূলে থাকলেই আবেদন করুন, নয়তো আমাদের অন্যান্য টিউশনগুলো দেখুন। অভিভাবক আপনার সিভি পছন্দ করার পর <strong>'বেতন কম'</strong> বা <strong>'দূরত্ব বেশি'</strong> ইত্যাদি কারণে নিজে থেকে টিউশন বাতিল করলে <strong>সার্ভিস চার্জ প্রযোজ্য হবে</strong>। কারণ এইসব অজুহাতের কারণে অভিভাবকরা টিউশন বাতিল করেন এবং আমাদের প্রতিষ্ঠানের সুনাম ক্ষুণ্ণ হয়।
                        </div>
                    </div>
                </div>

                {/* Comment Input */}
                <div className="bg-white p-2 px-2.5 rounded-3" style={{ border: '1px solid #e2e8f0' }}>
                    <div className="d-flex align-items-center justify-content-between mb-1" style={{ fontSize: '0.78rem' }}>
                        <span className="fw-bold text-muted">💬 Comment / বিশেষ বক্তব্য বা চাওয়া (Optional):</span>
                    </div>
                    <textarea
                        id="modalApplyComment"
                        rows={2}
                        className="form-control"
                        placeholder="যদি আপনার কোনো চাওয়া বা নেগোসিয়েশন (যেমন: বেতন/সময়) থাকে, তবে এখানে লিখুন..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{
                            fontSize: '0.84rem',
                            borderRadius: '6px',
                            borderColor: '#cbd5e1',
                            padding: '6px 10px',
                            resize: 'vertical'
                        }}
                    />
                </div>
            </Modal.Body>

            <Modal.Footer
                style={{
                    backgroundColor: '#ffffff',
                    borderTop: '1px solid #e2e8f0',
                    padding: '10px 18px',
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                }}
            >
                <div className="d-flex justify-content-end gap-2 w-100">
                    <Button
                        variant="outline-secondary"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-3 py-1.5 fw-bold"
                        style={{ borderRadius: '8px', fontSize: '0.86rem' }}
                    >
                        <FaTimes className="me-1" /> ফিরে যান
                    </Button>

                    <Button
                        variant="primary"
                        onClick={() => onConfirm(comment)}
                        disabled={isLoading}
                        className="px-4 py-1.5 fw-bold"
                        style={{
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                            fontSize: '0.86rem'
                        }}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                                প্রসেসিং...
                            </>
                        ) : (
                            <>
                                <FaCheckCircle className="me-1" /> হ্যাঁ, নিশ্চিত আবেদন করুন
                            </>
                        )}
                    </Button>
                </div>
            </Modal.Footer>

            <style>{`
                @media (min-width: 577px) {
                    .tuition-apply-confirm-modal .modal-dialog {
                        max-width: 660px !important;
                    }
                }
                @media (max-width: 576px) {
                    .tuition-apply-confirm-modal .modal-dialog {
                        margin: 12px auto !important;
                        max-width: calc(100% - 24px) !important;
                        width: 100% !important;
                    }
                    .tuition-apply-confirm-modal .modal-content {
                        border-radius: 12px !important;
                        border: none !important;
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
                        overflow: hidden;
                    }
                }
            `}</style>
        </Modal>
    );
};

export default TuitionApplyConfirmModal;
