import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Row, Col } from 'react-bootstrap';
import {
    FaEdit,
    FaWhatsapp,
    FaCopy,
    FaCheckCircle,
    FaUserCircle,
    FaExpandAlt,
    FaIdCard,
    FaFileAlt,
    FaGraduationCap,
    FaAward,
    FaImages,
    FaExternalLinkAlt,
    FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { usePublicSettings } from '../../context/PublicSettingsContext';

export const statusStyles = {
    "pending": { bg: "#FFD966", color: "#000" }, // yellow
    "under review": { bg: "#9DDCF9", color: "#000" }, // sky
    "pending payment": { bg: "#6FA8DC", color: "#fff" }, // blue
    "Must Advance": { bg: "#FF9900", color: "#fff" }, // orange
    "After Confirmation": { bg: "#009688", color: "#fff" }, // teal
    "After Salary": { bg: "#673AB7", color: "#fff" }, // deep purple
    "30% Advance": { bg: "#795548", color: "#fff" }, // brown
    "Free - Must Advance": { bg: "#35ebccff", color: "#000" }, // brown
    "verified": { bg: "#4CAF50", color: "#fff" }, // green
    "rejected": { bg: "#F44336", color: "#fff" }, // red
    "suspended": { bg: "#424242", color: "#fff" }, // dark gray
    "Not interested": { bg: "#6c757d", color: "#fff" }, // gray
    "Premium": { bg: "#0d6efd", color: "#fff" }, // royal blue
    "premium": { bg: "#0d6efd", color: "#fff" },
    "Elite": { bg: "#6f42c1", color: "#fff" }, // purple
    "elite": { bg: "#6f42c1", color: "#fff" },
};

export const teacherFieldConfig = [
    // Personal Info
    { name: 'name', label: 'Name', col: 6, group: 'Personal Info' },
    { name: 'gender', label: 'Gender', col: 6, group: 'Personal Info', type: 'select', options: ['male', 'female'] },
    { name: 'phone', label: 'Phone', col: 6, group: 'Personal Info' },
    { name: 'alternativePhone', label: 'Alternative Phone', col: 6, group: 'Personal Info' },
    { name: 'whatsapp', label: 'WhatsApp', col: 6, group: 'Personal Info' },
    { name: 'email', label: 'Email', col: 6, group: 'Personal Info' },
    { name: 'facebookLink', label: 'Facebook Link', col: 6, group: 'Personal Info' },
    { name: 'familyPhone', label: 'Family Phone', col: 6, group: 'Personal Info' },
    { name: 'friendPhone', label: 'Friend Phone', col: 6, group: 'Personal Info' },
    { name: 'city', label: 'City', col: 6, group: 'Personal Info' },
    { name: 'currentArea', label: 'Current Area', col: 6, group: 'Personal Info' },
    { name: 'fullAddress', label: 'Full Address', col: 6, group: 'Personal Info' },
    { name: 'division', label: 'Division', col: 6, group: 'Personal Info' },
    { name: 'district', label: 'District', col: 6, group: 'Personal Info' },
    { name: 'thana', label: 'Thana', col: 6, group: 'Personal Info' },

    // Academic Info
    { name: 'academicYear', label: 'Academic Year', type: 'select', options: ['1st', '2nd', '3rd', '4th', '5th/masters', 'completed'], col: 6, group: 'Academic Info' },
    { name: 'medium', label: 'Medium', col: 6, group: 'Academic Info' },
    { name: 'mastersDept', label: 'Masters Dept', col: 6, group: 'Academic Info' },
    { name: 'mastersUniversity', label: 'Masters University', col: 6, group: 'Academic Info' },
    { name: 'honorsDept', label: 'Honors Dept', col: 6, group: 'Academic Info' },
    { name: 'honorsUniversity', label: 'Honors University', col: 6, group: 'Academic Info' },
    { name: 'college', label: 'HSC College', col: 6, group: 'Academic Info' },
    { name: 'hscGroup', label: 'HSC Group', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Vocational'], col: 6, group: 'Academic Info' },
    { name: 'hscResult', label: 'HSC Result', col: 6, group: 'Academic Info' },
    { name: 'school', label: 'SSC School', col: 6, group: 'Academic Info' },
    { name: 'sscGroup', label: 'SSC Group', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Vocational'], col: 6, group: 'Academic Info' },
    { name: 'sscResult', label: 'SSC Result', col: 6, group: 'Academic Info' },
    { name: 'isResultShow', label: 'Show SSC & HSC Result?', col: 12, group: 'Academic Info', type: 'checkbox' },

    // Teaching Profile
    { name: 'experience', label: 'Experience', col: 6, group: 'Teaching Profile' },
    { name: 'favoriteSubject', label: 'Favorite Subject', col: 6, group: 'Teaching Profile' },
    { name: 'expectedTuitionAreas', label: 'Expected Tuition Areas', col: 6, group: 'Teaching Profile' },
    { name: 'commentFromTeacher', label: 'Comment From Teacher', col: 6, group: 'Teaching Profile' },

    // Subscription & Payment Details
    { name: 'premiumCode', label: 'Premium Code', col: 6, group: 'Subscription & Payment Details' },
    { name: 'password', label: 'Password', col: 6, group: 'Subscription & Payment Details' },
    { name: 'status', label: 'Subscription Status', type: 'select', col: 6, options: ['pending', 'under review', 'pending payment', 'Must Advance', 'After Confirmation', 'After Salary', '30% Advance', 'rejected', 'Free - Must Advance', 'verified', 'suspended', 'Not interested', 'Premium', 'Elite'], group: 'Subscription & Payment Details' },
    { name: 'uniCode', label: 'Uni Code', type: 'select', col: 6, options: ['CMC', 'CUET', 'CU Science', 'CU Arts', 'CU Commerce', 'CVASU', 'Private Science', 'Private Commerce', 'Private Arts', 'National Science', 'National Arts', 'National Commerce', 'Arabic', 'NC English', 'BC English', 'Special'], group: 'Subscription & Payment Details' },
    { name: 'transactionId', label: 'Transaction ID', col: 6, group: 'Subscription & Payment Details' },
    { name: 'paymentType', label: 'Payment Method', col: 6, group: 'Subscription & Payment Details' },
    { name: 'amount', label: 'Amount Paid', col: 6, group: 'Subscription & Payment Details' },
    { name: 'paymentDate', label: 'Payment Date', type: 'date', col: 6, group: 'Subscription & Payment Details' },
    { name: 'isBiodataShow', label: 'Show Biodata?', col: 6, group: 'Subscription & Payment Details', type: 'checkbox' },
    { name: 'isInfoVerified', label: 'Info Verified?', col: 6, group: 'Subscription & Payment Details', type: 'checkbox' },

    // Notes & Feedback
    { name: 'comment', label: 'Comment from agent', col: 6, group: 'Notes & Feedback' },
    { name: 'rating', label: 'Rating', col: 6, group: 'Notes & Feedback', type: 'star-rating' },

    // Referral Info
    { name: 'referPersonPhone', label: 'Refer Person Phone', col: 6, group: 'Referral Info' },
    { name: 'referStatus', label: 'Refer Status', type: 'select', col: 6, options: ['pending', 'in review', 'canceled', 'spam', 'paid'], group: 'Referral Info' },
    { name: 'referComment', label: 'Refer Comment', col: 6, group: 'Referral Info' },
];

export const formatTeacherCvText = (teacherDetails, whatsappNumber) => {
    if (!teacherDetails) return '';
    const hasValue = (v) => v !== undefined && v !== null && String(v).trim() !== '';

    const lines = [
        `টিউশন সেবা ফোরাম (আস্থা ও বিশ্বস্ততায় একধাপ এগিয়ে)`,
        `যোগাযোগ: ${whatsappNumber || '01633920928'}`,
        `ওয়েবসাইট: www.tuitionsebaforum.com`,
        ``,
        `*Verified Premium Tutor*`,
        `Premium Code: *${teacherDetails.premiumCode || 'N/A'}*`,
        ``,
        `*Teacher CV*`,
        `Name: *${teacherDetails.name || 'N/A'}*`,
        `Area: *${teacherDetails.currentArea || 'N/A'}*`,
        ``,
        `*Academic Qualifications*`,

        ...(hasValue(teacherDetails.mastersUniversity) ? [`Masters University: *${teacherDetails.mastersUniversity}*`] : []),
        ...(hasValue(teacherDetails.mastersDept) ? [`Masters Department: *${teacherDetails.mastersDept}*`] : []),
        `Honours University: *${teacherDetails.honorsUniversity || 'N/A'}*`,
        `Academic Year: *${teacherDetails.academicYear || 'N/A'}*`,
        `Department: *${teacherDetails.honorsDept || 'N/A'}*`,
    ];

    if (hasValue(teacherDetails.college)) {
        lines.push(`College (HSC): *${teacherDetails.college}*`);
    }

    if (hasValue(teacherDetails.hscGroup) || hasValue(teacherDetails.hscResult)) {
        lines.push(
            `HSC - Group: *${teacherDetails.hscGroup || 'N/A'}*, Result: *${teacherDetails.hscResult || 'N/A'}*`
        );
    }

    if (hasValue(teacherDetails.school)) {
        lines.push(`School (SSC): *${teacherDetails.school}*`);
    }

    if (hasValue(teacherDetails.sscGroup) || hasValue(teacherDetails.sscResult)) {
        lines.push(
            `SSC - Group: *${teacherDetails.sscGroup || 'N/A'}*, Result: *${teacherDetails.sscResult || 'N/A'}*`
        );
    }

    lines.push(
        ``,
        `*Experience*: ${teacherDetails.experience || 'N/A'}`,
        `*Address*: ${teacherDetails.fullAddress || 'N/A'}`,
        `*Favorite Subject*: ${teacherDetails.favoriteSubject || 'N/A'}`
    );

    return lines.join('\n');
};

const formatPhoneForWhatsApp = (rawPhone) => {
    if (!rawPhone) return '';
    const digits = String(rawPhone).replace(/\D/g, '');
    if (!digits) return '';

    if (digits.startsWith('880')) {
        return digits;
    }
    if (digits.startsWith('0')) {
        return '88' + digits;
    }
    if (digits.startsWith('88')) {
        return '880' + digits.slice(2);
    }
    if (digits.startsWith('1')) {
        return '880' + digits;
    }
    return digits;
};

const TeacherDetailsModal = ({
    show,
    onHide,
    teacher,
    onEdit
}) => {
    const { whatsappNumber } = usePublicSettings();
    const [enlargedImage, setEnlargedImage] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && enlargedImage) {
                setEnlargedImage(null);
            }
        };
        if (enlargedImage) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [enlargedImage]);

    if (!teacher) return null;

    const handleShare = () => {
        const message = formatTeacherCvText(teacher, whatsappNumber);
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleCopyCv = async () => {
        const text = formatTeacherCvText(teacher, whatsappNumber);
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            toast.success("Teacher CV copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy CV:", err);
            toast.error("Failed to copy CV to clipboard");
        }
    };

    return (
        <>
            <style>{`
                .teacher-details-modal-full {
                    max-width: 96vw !important;
                    width: 96vw !important;
                    margin: 10px auto !important;
                    padding: 0 !important;
                }
                .teacher-details-modal-full .modal-content {
                    height: calc(100vh - 20px) !important;
                    max-height: calc(100vh - 20px) !important;
                    border-radius: 14px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    overflow: hidden !important;
                }
                .teacher-details-modal-full .modal-body {
                    flex: 1 1 auto !important;
                    max-height: none !important;
                    overflow-y: auto !important;
                }
            `}</style>

            <Modal
                show={show}
                onHide={onHide}
                dialogClassName="teacher-details-modal-full"
                centered
                scrollable
            >
                <Modal.Header closeButton className="border-bottom-0 pb-2">
                    <Modal.Title className="fw-bold fs-4">Teacher Details</Modal.Title>
                </Modal.Header>

                <Modal.Body className="px-4 py-3">
                    <Card className="mb-3 border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        {/* Top Header: Compact summary & actions */}
                        <div className="px-3 py-2 bg-light border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2">
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <h5 className="fw-bold mb-0 text-dark">{teacher.name || 'Unnamed Teacher'}</h5>
                                <span className="badge bg-primary px-2 py-1" style={{ fontSize: '0.78rem' }}>
                                    Code: {teacher.premiumCode || 'N/A'}
                                </span>
                                <span
                                    className="badge text-uppercase px-2 py-1"
                                    style={{
                                        fontSize: '0.75rem',
                                        backgroundColor: statusStyles[teacher.status]?.bg || '#6c757d',
                                        color: statusStyles[teacher.status]?.color || '#fff'
                                    }}
                                >
                                    {teacher.status || 'Pending'}
                                </span>
                                {teacher.isInfoVerified && (
                                    <span
                                        className="badge bg-success px-2 py-1 d-inline-flex align-items-center gap-1"
                                        style={{ fontSize: '0.75rem' }}
                                    >
                                        <FaCheckCircle size={10} /> Info Verified
                                    </span>
                                )}
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                {onEdit && (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="d-flex align-items-center gap-1 py-1 px-2"
                                        style={{ fontSize: '0.8rem' }}
                                        onClick={() => {
                                            onHide();
                                            onEdit(teacher);
                                        }}
                                    >
                                        <FaEdit size={12} /> Edit Teacher
                                    </Button>
                                )}
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="d-flex align-items-center gap-1 py-1 px-2"
                                    style={{ fontSize: '0.8rem' }}
                                    onClick={handleCopyCv}
                                    title="Copy Teacher CV in WhatsApp format"
                                >
                                    <FaCopy size={13} /> Copy CV
                                </Button>
                                <Button
                                    variant="outline-success"
                                    size="sm"
                                    className="d-flex align-items-center gap-1 py-1 px-2"
                                    style={{ fontSize: '0.8rem' }}
                                    onClick={handleShare}
                                    title="Share CV directly on WhatsApp"
                                >
                                    <FaWhatsapp size={13} /> Share CV
                                </Button>
                            </div>
                        </div>

                        <Card.Body className="p-3">
                            {/* Profile Photo + Teacher Details Row */}
                            <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3 mb-3">
                                {/* Profile Photo Thumbnail */}
                                <div className="flex-shrink-0 text-center">
                                    <div
                                        className="position-relative shadow-sm rounded overflow-hidden"
                                        style={{
                                            width: '105px',
                                            height: '110px',
                                            backgroundColor: '#f8fafc',
                                            border: teacher.photo ? '2px solid #0d6efd' : '2px dashed #cbd5e1',
                                            cursor: teacher.photo ? 'pointer' : 'default',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => {
                                            if (teacher.photo) {
                                                setEnlargedImage({
                                                    url: teacher.photo,
                                                    title: `${teacher.name || 'Teacher'} - Profile Photo`
                                                });
                                            }
                                        }}
                                        title={teacher.photo ? 'Click to enlarge full-screen' : 'No photo uploaded'}
                                    >
                                        {teacher.photo ? (
                                            <>
                                                <img
                                                    src={teacher.photo}
                                                    alt={teacher.name || 'Profile'}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <div
                                                    className="position-absolute bottom-0 start-0 end-0 text-white text-center py-1"
                                                    style={{
                                                        background: 'rgba(0,0,0,0.65)',
                                                        fontSize: '0.68rem',
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    <FaExpandAlt className="me-1" size={9} /> Enlarge
                                                </div>
                                            </>
                                        ) : (
                                            <div className="d-flex flex-column align-items-center justify-content-center text-muted p-1">
                                                <FaUserCircle style={{ fontSize: '2.5rem', color: '#94a3b8' }} />
                                                <span style={{ fontSize: '0.68rem', color: '#64748b' }} className="fw-semibold mt-1">No Photo</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-1" style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '500' }}>
                                        Profile Photo
                                    </div>
                                </div>

                                {/* Teacher Core Attributes */}
                                <div className="flex-grow-1 w-100">
                                    {/* Badges */}
                                    <div className="d-flex flex-wrap gap-1 mb-2">
                                        {teacher.gender && (
                                            <span className="badge bg-light text-dark border text-capitalize px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                {teacher.gender}
                                            </span>
                                        )}
                                        {teacher.uniCode && (
                                            <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                Uni: {teacher.uniCode}
                                            </span>
                                        )}
                                        {teacher.city && (
                                            <span className="badge bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                {teacher.city}
                                            </span>
                                        )}
                                        {teacher.currentArea && (
                                            <span className="badge bg-light text-secondary border px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                {teacher.currentArea}
                                            </span>
                                        )}
                                    </div>

                                    {/* Contact & Info Grid */}
                                    <div className="row g-1 small text-secondary">
                                        {teacher.phone && (
                                            <div className="col-12 col-md-6 d-flex align-items-center gap-2 py-1">
                                                <span className="text-muted fw-semibold">Phone:</span>
                                                <span className="fw-bold text-dark">{teacher.phone}</span>
                                                {formatPhoneForWhatsApp(teacher.whatsapp || teacher.phone) && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-success py-0 px-2 d-inline-flex align-items-center gap-1"
                                                        style={{ fontSize: '0.72rem', height: '22px' }}
                                                        onClick={() => {
                                                            const target = formatPhoneForWhatsApp(teacher.whatsapp || teacher.phone);
                                                            window.open(`https://api.whatsapp.com/send?phone=${target}`, '_blank');
                                                        }}
                                                    >
                                                        <FaWhatsapp /> WhatsApp
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {teacher.whatsapp && teacher.whatsapp !== teacher.phone && (
                                            <div className="col-12 col-md-6 d-flex align-items-center gap-2 py-1">
                                                <span className="text-muted fw-semibold">WhatsApp:</span>
                                                <span className="fw-bold text-dark">{teacher.whatsapp}</span>
                                                {formatPhoneForWhatsApp(teacher.whatsapp) && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-success py-0 px-2 d-inline-flex align-items-center gap-1"
                                                        style={{ fontSize: '0.72rem', height: '22px' }}
                                                        onClick={() => {
                                                            const target = formatPhoneForWhatsApp(teacher.whatsapp);
                                                            window.open(`https://api.whatsapp.com/send?phone=${target}`, '_blank');
                                                        }}
                                                    >
                                                        <FaWhatsapp /> Chat
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {teacher.honorsUniversity && (
                                            <div className="col-12 col-md-6 py-1">
                                                <span className="text-muted fw-semibold">University:</span>{' '}
                                                <span className="text-dark fw-medium">
                                                    {teacher.honorsUniversity} {teacher.honorsDept ? `(${teacher.honorsDept})` : ''}
                                                </span>
                                            </div>
                                        )}

                                        {teacher.academicYear && (
                                            <div className="col-12 col-md-6 py-1">
                                                <span className="text-muted fw-semibold">Academic Year:</span>{' '}
                                                <span className="text-dark fw-medium">{teacher.academicYear}</span>
                                            </div>
                                        )}

                                        {teacher.experience && (
                                            <div className="col-12 col-md-6 py-1">
                                                <span className="text-muted fw-semibold">Experience:</span>{' '}
                                                <span className="text-dark fw-medium">{teacher.experience}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Documents Strip */}
                            <div className="pt-2 border-top">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="fw-semibold text-secondary d-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                                        <FaIdCard className="text-primary" /> Verification & Academic Documents
                                    </span>
                                    <span className="badge bg-light text-secondary border" style={{ fontSize: '0.72rem' }}>
                                        {[teacher.nidPhoto || teacher.nidFront, teacher.nidBack, teacher.sscMarksheet, teacher.hscMarksheet, teacher.universityIdCard, teacher.otherDoc1, teacher.otherDoc2, teacher.otherDoc3].filter(Boolean).length} of 8 Attached
                                    </span>
                                </div>

                                <Row className="g-2">
                                    {[
                                        { label: 'NID Front / Birth Reg', key: 'nidPhoto', fallbackKey: 'nidFront', icon: <FaIdCard style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                        { label: 'NID Back Part', key: 'nidBack', icon: <FaIdCard style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                        { label: 'SSC Marksheet', key: 'sscMarksheet', icon: <FaFileAlt style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                        { label: 'HSC Marksheet', key: 'hscMarksheet', icon: <FaFileAlt style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                        { label: 'University ID / Slip', key: 'universityIdCard', icon: <FaGraduationCap style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                        { label: 'Other Certificate 1', key: 'otherDoc1', icon: <FaAward style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                        { label: 'Other Certificate 2', key: 'otherDoc2', icon: <FaAward style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                        { label: 'Other Certificate 3', key: 'otherDoc3', icon: <FaAward style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                    ].map(doc => {
                                        const docUrl = teacher[doc.key] || (doc.fallbackKey ? teacher[doc.fallbackKey] : null);
                                        return (
                                            <Col xs={6} sm={4} md={3} lg={3} key={doc.key}>
                                                <div
                                                    className="h-100 p-2 rounded d-flex flex-column justify-content-between"
                                                    style={{
                                                        backgroundColor: docUrl ? '#ffffff' : '#f8fafc',
                                                        border: docUrl ? '1px solid #cbd5e1' : '1px dashed #e2e8f0',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: docUrl ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                                                    }}
                                                >
                                                    {/* Document Preview Box */}
                                                    <div
                                                        className="w-100 rounded overflow-hidden position-relative d-flex align-items-center justify-content-center mb-1"
                                                        style={{
                                                            height: '80px',
                                                            backgroundColor: docUrl ? '#ffffff' : '#f1f5f9',
                                                            cursor: docUrl ? 'pointer' : 'default',
                                                            border: docUrl ? '1px solid #e2e8f0' : 'none'
                                                        }}
                                                        onClick={() => {
                                                            if (docUrl) {
                                                                setEnlargedImage({
                                                                    url: docUrl,
                                                                    title: `${teacher.name || 'Teacher'} - ${doc.label}`
                                                                });
                                                            }
                                                        }}
                                                        title={docUrl ? `Click to enlarge ${doc.label}` : `No ${doc.label} attached`}
                                                    >
                                                        {docUrl ? (
                                                            <>
                                                                <img
                                                                    src={docUrl}
                                                                    alt={doc.label}
                                                                    style={{
                                                                        maxWidth: '100%',
                                                                        maxHeight: '100%',
                                                                        objectFit: 'contain',
                                                                        display: 'block'
                                                                    }}
                                                                />
                                                                <div
                                                                    className="position-absolute bottom-0 start-0 end-0 text-white text-center py-1"
                                                                    style={{
                                                                        background: 'rgba(0,0,0,0.65)',
                                                                        fontSize: '0.65rem',
                                                                        lineHeight: 1
                                                                    }}
                                                                >
                                                                    <FaExpandAlt className="me-1" size={8} /> Click to Enlarge
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="d-flex flex-column align-items-center justify-content-center text-muted p-1">
                                                                {doc.icon}
                                                                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }} className="mt-1">Not Attached</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Label & Status Pill */}
                                                    <div className="text-center w-100">
                                                        <div
                                                            className="fw-semibold text-dark text-truncate"
                                                            style={{ fontSize: '0.72rem' }}
                                                            title={doc.label}
                                                        >
                                                            {doc.label}
                                                        </div>
                                                        <span
                                                            className={`badge ${docUrl ? 'bg-success text-white' : 'bg-light text-muted border'} px-2 py-0 mt-1`}
                                                            style={{ fontSize: '0.65rem' }}
                                                        >
                                                            {docUrl ? 'Attached' : 'Empty'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>

                    {teacher?.password && (
                        <div className="mb-4">
                            <div
                                className="w-100 rounded bg-primary text-white d-flex justify-content-center align-items-center shadow-sm"
                                style={{ height: '60px', fontSize: '1.25rem', fontWeight: '600' }}
                            >
                                Premium Code: <span className="ms-3">{teacher.premiumCode}</span>
                            </div>
                        </div>
                    )}

                    {Object.entries(
                        teacherFieldConfig.reduce((groups, field) => {
                            (groups[field.group] = groups[field.group] || []).push(field);
                            return groups;
                        }, {})
                    ).map(([groupName, fields]) => (
                        <section key={groupName} className="mb-4">
                            <h5 className="border-bottom pb-2 mb-3 text-primary fw-semibold">{groupName}</h5>
                            <div className="row gx-4 gy-4">
                                {fields.map(({ name, label, type }) => {
                                    const value = teacher[name];
                                    let displayValue;
                                    if (type === 'password') {
                                        displayValue = '••••••';
                                    } else if (type === 'checkbox') {
                                        displayValue = value ? 'Yes' : 'No';
                                    } else if (type === 'star-rating') {
                                        displayValue = (
                                            <div className="d-flex align-items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        style={{
                                                            color: value >= star ? '#ffc107' : '#ddd',
                                                            fontSize: '16px'
                                                        }}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                                <span className="ms-2">{value || '0'} star{value !== 1 ? 's' : ''}</span>
                                            </div>
                                        );
                                    } else if (type === 'date' && value) {
                                        try {
                                            const iso = String(value);
                                            const [datePart, timePart] = iso.split('T');
                                            const [year, month, day] = datePart.split('-');
                                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                            const dateStr = `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
                                            if (timePart) {
                                                const [hh, mm] = timePart.replace('Z', '').split(':');
                                                const h = parseInt(hh);
                                                const ampm = h >= 12 ? 'PM' : 'AM';
                                                const h12 = h % 12 === 0 ? 12 : h % 12;
                                                displayValue = `${dateStr}, ${h12}:${mm} ${ampm} (UTC)`;
                                            } else {
                                                displayValue = dateStr;
                                            }
                                        } catch {
                                            displayValue = String(value);
                                        }
                                    } else {
                                        displayValue = value !== undefined && value !== null && value !== '' ? String(value).trim() : 'N/A';
                                    }

                                    return (
                                        <div
                                            key={name}
                                            className="col-12 col-sm-6 col-md-4 col-lg-3"
                                        >
                                            <div className="border rounded bg-white p-3 h-100 shadow-sm d-flex flex-column">
                                                <small
                                                    className="mb-2 text-primary"
                                                    style={{
                                                        fontWeight: 900,
                                                        letterSpacing: '0.02em',
                                                    }}
                                                >
                                                    {label}
                                                </small>

                                                <div
                                                    className="flex-grow-1 text-break"
                                                    style={{
                                                        fontWeight: type === 'password' ? '700' : '400',
                                                        fontSize: '1rem',
                                                        color: type === 'password' ? '#444' : '#222',
                                                        userSelect: 'text',
                                                    }}
                                                    title={type === 'password' ? value : undefined}
                                                >
                                                    {displayValue}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </Modal.Body>

                <Modal.Footer className="border-top-0">
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Lightbox for Enlarged Image inside Modal */}
            {enlargedImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 99999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px'
                    }}
                    onClick={() => setEnlargedImage(null)}
                >
                    {/* Top Bar */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 24px',
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)',
                            color: '#fff',
                            zIndex: 100000
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="d-flex align-items-center gap-2">
                            <FaImages className="text-info fs-5" />
                            <span className="fw-bold fs-6 text-white text-truncate" style={{ maxWidth: '60vw' }}>
                                {enlargedImage.title || 'Document Preview'}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <a
                                href={enlargedImage.url}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                                style={{ fontSize: '0.8rem' }}
                                title="Open original image in new tab"
                            >
                                <FaExternalLinkAlt size={11} /> New Tab
                            </a>
                            <button
                                type="button"
                                className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: '34px', height: '34px', fontSize: '16px' }}
                                onClick={() => setEnlargedImage(null)}
                                title="Close (or press Esc to return to modal)"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    {/* Image Canvas */}
                    <div
                        style={{
                            maxWidth: '92vw',
                            maxHeight: '84vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={enlargedImage.url}
                            alt={enlargedImage.title || 'Enlarged Preview'}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '84vh',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
                            }}
                        />
                    </div>

                    <div
                        className="text-white-50 small mt-2 d-flex align-items-center gap-1"
                        style={{ fontSize: '0.78rem' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        Click background or press <kbd className="bg-secondary text-white px-1 rounded">Esc</kbd> to return to modal
                    </div>
                </div>
            )}
        </>
    );
};

export default TeacherDetailsModal;
