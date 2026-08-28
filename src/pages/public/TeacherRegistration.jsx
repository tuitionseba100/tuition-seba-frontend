import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    ProgressBar,
    Card,
    Modal,
} from 'react-bootstrap';
import {
    FaGraduationCap,
    FaPhoneAlt,
    FaInfoCircle,
    FaUser,
    FaBook,
    FaUniversity,
    FaAward,
    FaHeart,
    FaMapMarkerAlt,
    FaComments,
    FaHome,
    FaFacebookF,
    FaWhatsapp,
    FaEnvelope,
    FaClock,
    FaTransgender,
    FaGlobe,
    FaCalendarAlt,
    FaExclamationTriangle,
    FaUserPlus,
} from 'react-icons/fa';

import { Formik } from 'formik';
import * as Yup from 'yup';

import InfoModal from '../../components/modals/TeacherBenefitInfoModal';
import SuccessModal from '../../components/modals/TeacherRegistrationSuccessModal';
import ProcessingModal from '../../components/modals/ProcessingModal';
import ErrorModal from '../../components/modals/ErrorSubmitModal';
import RegistrationSteps from '../../components/modals/RegistrationSteps';
import locationData from '../../data/locations.json';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

import { fetchWithFallback } from '../../services/fetchWithFallback';
const getPhoneErrorMessage = (label, value) => {
    if (!value) return '';
    const trimmed = value.trim();
    if (/[^\d+]/g.test(trimmed)) {
        return `${label} নম্বরটি সঠিক নয় (নম্বরে কোনো অক্ষর, স্পেস বা প্রতীক থাকা যাবে না)। যেমন: 017xxxxxxxx এভাবে দিন।`;
    }
    if (trimmed.length < 11) {
        return `${label} নম্বরটি সঠিক নয় (১১ ডিজিটের কম দেওয়া হয়েছে)। যেমন: 017xxxxxxxx এভাবে দিন।`;
    }
    if (trimmed.length > 15) {
        return `${label} নম্বরটি সঠিক নয় (১৫ ডিজিটের বেশি দেওয়া হয়েছে)। যেমন: 017xxxxxxxx এভাবে দিন।`;
    }
    return `${label} নম্বরটি সঠিক নয়। যেমন: 017xxxxxxxx এভাবে দিন।`;
};

const PhoneRequiredModal = ({ show, handleClose, validationErrors = [] }) => (
    <Modal show={show} onHide={handleClose} centered style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <Modal.Header closeButton className="bg-danger text-white border-0">
            <Modal.Title className="fw-bold">
                <FaExclamationTriangle className="me-2" />
                {validationErrors.length > 0 ? 'ভুল তথ্য সংশোধন করুন' : 'যোগাযোগের তথ্য প্রয়োজন'}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4 px-4" style={{ backgroundColor: '#fffdfd' }}>
            <div className="mb-3">
                <FaExclamationTriangle size={60} className="text-danger animate__animated animate__shakeX" />
            </div>
            {validationErrors.length > 0 ? (
                <>
                    <h5 className="fw-bold text-dark mb-3">নিম্নোক্ত তথ্যগুলো সঠিকভাবে পূরণ করা হয়নি:</h5>
                    <div className="text-start mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {validationErrors.map((err, i) => (
                            <div key={i} className="d-flex align-items-center bg-danger bg-opacity-10 border-start border-danger border-3 p-3 rounded mb-2 shadow-sm">
                                <FaExclamationTriangle className="text-danger me-3 fs-5" />
                                <span className="text-danger fw-semibold" style={{ fontSize: '0.95rem' }}>{err}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                        দয়া করে লাল চিহ্নিত নম্বরগুলো যাচাই করে আবার চেষ্টা করুন।
                    </p>
                </>
            ) : (
                <>
                    <h5 className="fw-bold text-dark mb-3">ফোন অথবা হোয়াটসঅ্যাপ নম্বর প্রয়োজন</h5>
                    <p className="text-muted mb-4" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                        আপনার সাথে যোগাযোগের জন্য কমপক্ষে একটি নম্বর প্রদান করা আবশ্যক। <br />
                        দয়া করে <strong>ফোন</strong> অথবা <strong>হোয়াটসঅ্যাপ</strong> ঘরটি পূরণ করুন।
                    </p>
                    <div className="bg-warning bg-opacity-10 border-start border-warning border-3 p-3 rounded text-start shadow-sm mb-2">
                        <span className="text-warning-emphasis fw-semibold" style={{ fontSize: '0.9rem' }}>
                            * রেজিস্ট্রেশন সম্পন্ন করতে অন্তত যেকোনো একটি চালু নম্বর দিন।
                        </span>
                    </div>
                </>
            )}
        </Modal.Body>
        <Modal.Footer className="border-0 bg-light justify-content-center">
            <Button
                variant={validationErrors.length > 0 ? "danger" : "warning"}
                className="px-4 py-2 fw-bold text-white"
                onClick={handleClose}
                style={{ borderRadius: '8px' }}
            >
                ঠিক আছে
            </Button>
        </Modal.Footer>
    </Modal>
);

const TeacherRegistrationForm = () => {
    const [progress, setProgress] = useState(0);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showStepsModal, setShowStepsModal] = useState(false);
    const [showPhoneRequiredModal, setShowPhoneRequiredModal] = useState(false);
    const [phoneModalErrors, setPhoneModalErrors] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [areas, setAreas] = useState([]);

    const cityOptions = locationData.cityOptions;
    const areaOptions = locationData.areaOptions;

    const fieldConfig = [
        { name: 'name', label: 'Name', col: 6, group: 'Personal Info', icon: <FaUser /> },
        { name: 'gender', label: 'Gender', col: 6, group: 'Personal Info', type: 'select', options: ['male', 'female'], icon: <FaTransgender /> },
        { name: 'phone', label: 'Phone', col: 6, group: 'Personal Info', icon: <FaPhoneAlt /> },
        { name: 'alternativePhone', label: 'Alternative Phone', col: 6, group: 'Personal Info', icon: <FaPhoneAlt /> },
        { name: 'whatsapp', label: 'WhatsApp', col: 6, group: 'Personal Info', icon: <FaWhatsapp /> },
        { name: 'email', label: 'Email', col: 6, group: 'Personal Info', icon: <FaEnvelope /> },
        { name: 'facebookLink', label: 'Facebook Link', col: 6, group: 'Personal Info', icon: <FaFacebookF /> },
        { name: 'familyPhone', label: 'Family Phone', col: 6, group: 'Personal Info', icon: <FaPhoneAlt /> },
        { name: 'friendPhone', label: 'Friend Phone', col: 6, group: 'Personal Info', icon: <FaPhoneAlt /> },
        { name: 'city', label: 'City', col: 6, group: 'Personal Info', type: 'city', icon: <FaMapMarkerAlt /> },
        { name: 'currentArea', label: 'Current Area', col: 6, group: 'Personal Info', type: 'area', icon: <FaMapMarkerAlt /> },
        { name: 'fullAddress', label: 'Full Address', col: 6, group: 'Personal Info', icon: <FaHome /> },

        { name: 'academicYear', label: 'Academic Year', col: 6, group: 'Academic Info', type: 'select', options: ['1st', '2nd', '3rd', '4th', '5th/masters', 'completed'], icon: <FaCalendarAlt /> },
        { name: 'medium', label: 'Medium', col: 6, group: 'Academic Info', icon: <FaGlobe /> },
        { name: 'mastersDept', label: 'Masters Dept', col: 6, group: 'Academic Info', icon: <FaGraduationCap /> },
        { name: 'mastersUniversity', label: 'Masters University', col: 6, group: 'Academic Info', icon: <FaUniversity /> },
        { name: 'honorsDept', label: 'Honours Dept', col: 6, group: 'Academic Info', icon: <FaGraduationCap /> },
        { name: 'honorsUniversity', label: 'Honours University', col: 6, group: 'Academic Info', icon: <FaUniversity /> },
        { name: 'hscGroup', label: 'HSC Group', col: 6, group: 'Academic Info', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Vocational'], icon: <FaBook /> },
        { name: 'hscResult', label: 'HSC Result', col: 6, group: 'Academic Info', icon: <FaAward /> },
        { name: 'college', label: 'HSC College', col: 12, group: 'Academic Info', icon: <FaUniversity /> },
        { name: 'sscGroup', label: 'SSC Group', col: 6, group: 'Academic Info', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Vocational'], icon: <FaBook /> },
        { name: 'sscResult', label: 'SSC Result', col: 6, group: 'Academic Info', icon: <FaAward /> },
        { name: 'school', label: 'SSC School', col: 12, group: 'Academic Info', icon: <FaUniversity /> },

        { name: 'experience', label: 'Experience', col: 6, group: 'Teaching Profile', icon: <FaClock /> },
        { name: 'favoriteSubject', label: 'Favorite Subject', col: 6, group: 'Teaching Profile', icon: <FaHeart /> },
        { name: 'expectedTuitionAreas', label: 'Expected Tuition Areas', col: 6, group: 'Teaching Profile', icon: <FaMapMarkerAlt /> },
        { name: 'commentFromTeacher', label: 'Comment From Teacher', col: 6, group: 'Teaching Profile', icon: <FaComments /> },
        {
            name: 'isResultShow', label: 'SSC ও HSC রেজাল্ট Our Teachers পেজে দেখাতে চাইলে এই বক্সে টিক দিন',
            col: 12,
            group: 'Academic Info',
            type: 'checkbox'
        },
    ];

    const groupFields = fieldConfig.reduce((acc, field) => {
        if (!acc[field.group]) acc[field.group] = [];
        acc[field.group].push(field);
        return acc;
    }, {});

    const initialValues = {};
    fieldConfig.forEach(({ name, type }) => {
        if (type === 'checkbox') initialValues[name] = false;
        else initialValues[name] = '';
    });

    const validationSchemaFields = {};
    fieldConfig.forEach(({ name, label }) => {
        if (name === 'phone' || name === 'whatsapp' || name === 'alternativePhone' || name === 'familyPhone' || name === 'friendPhone' || name === 'referPersonPhone') {
            const labelMap = {
                phone: 'ফোন',
                whatsapp: 'হোয়াটসঅ্যাপ',
                alternativePhone: 'বিকল্প ফোন',
                familyPhone: 'পারিবারিক ফোন',
                friendPhone: 'বন্ধুর ফোন',
                referPersonPhone: 'রেফার ব্যক্তির ফোন'
            };
            const displayLabel = labelMap[name] || label;
            validationSchemaFields[name] = Yup.string()
                .test('phone-format', function (value) {
                    if (!value || value.trim() === '') return true;
                    const isValid = /^\+?\d{7,15}$/.test(value.trim());
                    if (!isValid) {
                        return this.createError({ message: getPhoneErrorMessage(displayLabel, value) });
                    }
                    return true;
                })
                .nullable();
        } else if (name === 'email') {
            validationSchemaFields[name] = Yup.string()
                .email('সঠিক ইমেইল এড্রেস দিন')
                .nullable();
        } else {
            validationSchemaFields[name] = Yup.string().nullable();
        }
    });

    const validationSchema = Yup.object(validationSchemaFields);

    return (
        <>
            <NavBar />
            <div style={{ backgroundColor: '#f4f7f9' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #004085 0%, #0066cc 100%)',
                    color: 'white',
                    padding: '4rem 0 6rem', // Increased bottom padding for wave
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <Container style={{ position: 'relative', zIndex: 2 }}>
                        <Row className="align-items-center">
                            <Col lg={8}>
                                <h1 className="display-4 fw-bold mb-3">
                                    <FaGraduationCap className="me-3" /> Teacher Registration
                                </h1>
                                <p className="lead mb-4">
                                    Join our verified teacher community and get access to premium tuition opportunities
                                </p>
                                <div className="d-flex flex-wrap gap-3 mb-4">
                                    <div className="d-flex align-items-center">
                                        <FaPhoneAlt className="me-2" />
                                        <span className="fw-semibold">Call Us: 01633920928</span>
                                    </div>
                                    <Button
                                        variant="light"
                                        size="lg"
                                        style={{ color: '#004085', fontWeight: 'bold' }}
                                        onClick={() => setShowStepsModal(true)}
                                    >
                                        <FaInfoCircle className="me-2" /> আপনাদের থেকে টিউশন পাওয়ার সিস্টেম কী?
                                    </Button>
                                </div>
                            </Col>
                            <Col lg={4} className="text-center d-none d-lg-block">
                                <div className="bg-white bg-opacity-10 rounded-circle p-5 d-inline-block">
                                    <FaUser className="display-1" />
                                </div>
                            </Col>
                        </Row>
                    </Container>

                    {/* Wave Separator */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        overflow: 'hidden',
                        lineHeight: 0,
                        zIndex: 1
                    }}>
                        <svg
                            viewBox="0 0 1200 120"
                            preserveAspectRatio="none"
                            style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '60px' }}
                        >
                            <path
                                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                                fill="#f4f7f9" // Matches page background
                            ></path>
                        </svg>
                    </div>
                </div>

                <Container className="my-5">
                    <Card className="p-4 p-md-5 shadow-lg" style={{ borderRadius: '20px' }}>
                        <div className="text-center mb-5">
                            <h2 className="fw-bold text-primary mb-3">Registration Form</h2>
                            <p className="text-muted">অনুগ্রহ করে সব তথ্য দিন যদি সম্ভব হয়, শুধু ফোন অথবা হোয়াটসঅ্যাপের মধ্যে যেকোনো একটি দিয়ে আবেদন করতে পারবেন।</p>
                            <ProgressBar now={progress} style={{ height: '6px' }} />
                        </div>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { resetForm, setSubmitting }) => {
                                // Collect phone-related validation errors
                                const phoneFields = ['phone', 'whatsapp', 'alternativePhone', 'familyPhone', 'friendPhone', 'referPersonPhone'];
                                const phoneFieldLabels = {
                                    phone: 'ফোন',
                                    whatsapp: 'হোয়াটসঅ্যাপ',
                                    alternativePhone: 'বিকল্প ফোন',
                                    familyPhone: 'পারিবারিক ফোন',
                                    friendPhone: 'বন্ধুর ফোন',
                                    referPersonPhone: 'রেফার ব্যক্তির ফোন',
                                };
                                const phoneErrors = [];
                                for (const fieldName of phoneFields) {
                                    const val = values[fieldName];
                                    if (val && val.trim() !== '') {
                                        const isValid = /^\+?\d{7,15}$/.test(val.trim());
                                        if (!isValid) {
                                            phoneErrors.push(getPhoneErrorMessage(phoneFieldLabels[fieldName], val));
                                        }
                                    }
                                }

                                // Check if at least phone or whatsapp is provided
                                if (!values.phone && !values.whatsapp) {
                                    setPhoneModalErrors([]);
                                    setShowPhoneRequiredModal(true);
                                    setSubmitting(false);
                                    return;
                                }

                                // Show phone format errors in modal
                                if (phoneErrors.length > 0) {
                                    setPhoneModalErrors(phoneErrors);
                                    setShowPhoneRequiredModal(true);
                                    setSubmitting(false);
                                    return;
                                }

                                try {
                                    const res = await fetchWithFallback('https://tuition-seba-backend-1.onrender.com/api/regTeacher/add', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(values),
                                    });

                                    if (res.ok) {
                                        resetForm();
                                        setAreas([]);
                                        setShowSuccessModal(true);
                                    } else if (res.status === 400) {
                                        const data = await res.json();
                                        const fieldMap = {
                                            phone: 'ফোন নাম্বার',
                                            alternativePhone: 'Alternative ফোন নাম্বার',
                                            whatsapp: 'হোয়াটসঅ্যাপ নাম্বার',
                                        };
                                        const duplicateNames = (data.duplicates || [])
                                            .map((field) => fieldMap[field] || field)
                                            .join(', ');
                                        const fullMessage = duplicateNames
                                            ? `একই ${duplicateNames} দিয়ে ইতোমধ্যে আবেদন করা হয়েছে।`
                                            : data.message || 'একই তথ্য দিয়ে ইতোমধ্যে আবেদন করা হয়েছে।';
                                        setErrorMessage(fullMessage);
                                        setShowErrorModal(true);
                                    } else {
                                        setErrorMessage('আবেদন জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
                                        setShowErrorModal(true);
                                    }
                                } catch (error) {
                                    setErrorMessage('নেটওয়ার্ক ত্রুটি: ' + error.message);
                                    setShowErrorModal(true);
                                }
                                setSubmitting(false);
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                                setFieldValue,
                                validateForm,
                            }) => {
                                // Update areas when city changes
                                useEffect(() => {
                                    if (values.city) {
                                        setAreas(areaOptions[values.city] || []);
                                        setFieldValue('currentArea', '');
                                    }
                                }, [values.city]);

                                // Calculate progress
                                useEffect(() => {
                                    const filled = fieldConfig.filter(f => values[f.name]?.toString().trim()).length;
                                    setProgress((filled / fieldConfig.length) * 100);
                                }, [values]);

                                const handleFormSubmit = (e) => {
                                    e.preventDefault();
                                    validateForm().then((formErrors) => {
                                        const phoneFields = ['phone', 'whatsapp', 'alternativePhone', 'familyPhone', 'friendPhone', 'referPersonPhone'];
                                        const phoneFieldLabels = {
                                            phone: 'ফোন',
                                            whatsapp: 'হোয়াটসঅ্যাপ',
                                            alternativePhone: 'বিকল্প ফোন',
                                            familyPhone: 'পারিবারিক ফোন',
                                            friendPhone: 'বন্ধুর ফোন',
                                            referPersonPhone: 'রেফার ব্যক্তির ফোন',
                                        };
                                        const phoneErrors = [];

                                        for (const fieldName of phoneFields) {
                                            const val = values[fieldName];
                                            if (val && val.trim() !== '') {
                                                const isValid = /^\+?\d{7,15}$/.test(val.trim());
                                                if (!isValid) {
                                                    phoneErrors.push(getPhoneErrorMessage(phoneFieldLabels[fieldName], val));
                                                }
                                            }
                                        }

                                        const isPhoneEmpty = !values.phone || values.phone.trim() === '';
                                        const isWhatsappEmpty = !values.whatsapp || values.whatsapp.trim() === '';

                                        if (isPhoneEmpty && isWhatsappEmpty) {
                                            setPhoneModalErrors([]);
                                            setShowPhoneRequiredModal(true);
                                        } else if (phoneErrors.length > 0) {
                                            setPhoneModalErrors(phoneErrors);
                                            setShowPhoneRequiredModal(true);
                                        } else {
                                            handleSubmit(e);
                                        }
                                    });
                                };

                                return (
                                    <>
                                        <Form noValidate onSubmit={handleFormSubmit}>
                                            {Object.entries(groupFields).map(([groupName, fields], i) => (
                                                <div className={i === Object.keys(groupFields).length - 1 ? "mb-3" : "mb-5"} key={groupName}>
                                                    <div
                                                        className="p-3 mb-4"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #004085 0%, #0066cc 100%)',
                                                            color: 'white',
                                                            borderRadius: '10px',
                                                            boxShadow: '0 4px 15px rgba(0, 64, 133, 0.2)'
                                                        }}
                                                    >
                                                        <h5 className="mb-0">
                                                            {i === 0 ? <FaUser className="me-2" /> : i === 1 ? <FaBook className="me-2" /> : <FaGraduationCap className="me-2" />} {groupName}
                                                        </h5>
                                                    </div>
                                                    <Row className="g-3">
                                                        {fields.map((field) => {
                                                            const hasError = touched[field.name] && !!errors[field.name];

                                                            return (
                                                                <Col md={field.col || 6} key={field.name}>
                                                                    <div
                                                                        style={field.name === 'referPersonPhone' ? {
                                                                            background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                                                                            border: '1px solid #a5d6a7',
                                                                            borderLeft: '4px solid #2e7d32',
                                                                            borderRadius: '12px',
                                                                            padding: '16px',
                                                                            marginTop: '4px',
                                                                            boxShadow: '0 2px 8px rgba(46, 125, 50, 0.1)'
                                                                        } : {}}
                                                                    >
                                                                        <Form.Group controlId={field.name}>
                                                                            {field.type === 'checkbox' ? (
                                                                                <Form.Check
                                                                                    type="checkbox"
                                                                                    id={field.name}
                                                                                    name={field.name}
                                                                                    checked={values[field.name]}
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    isInvalid={touched[field.name] && !!errors[field.name]}
                                                                                    className="mb-3"
                                                                                    label={
                                                                                        <span className="fw-bold" style={{ fontSize: '1rem', color: '#333' }}>
                                                                                            {field.label}
                                                                                        </span>
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <Form.Label className="fw-semibold" style={field.name === 'referPersonPhone' ? { color: '#2e7d32' } : {}}>
                                                                                        {field.icon} {field.label}
                                                                                        {(field.name === 'phone' || field.name === 'whatsapp') && (
                                                                                            <span className="text-danger ms-1">*</span>
                                                                                        )}
                                                                                    </Form.Label>

                                                                                    {field.type === 'select' ? (
                                                                                        <Form.Select
                                                                                            size="lg"
                                                                                            name={field.name}
                                                                                            value={values[field.name]}
                                                                                            onChange={handleChange}
                                                                                            onBlur={handleBlur}
                                                                                            isInvalid={hasError}
                                                                                            aria-describedby={`${field.name}-feedback`}
                                                                                        >
                                                                                            <option value="">Select {field.label}</option>
                                                                                            {field.options.map((opt) => (
                                                                                                <option key={opt} value={opt}>
                                                                                                    {opt}
                                                                                                </option>
                                                                                            ))}
                                                                                        </Form.Select>
                                                                                    ) : field.type === 'city' ? (
                                                                                        <Form.Select
                                                                                            size="lg"
                                                                                            name={field.name}
                                                                                            value={values[field.name]}
                                                                                            onChange={handleChange}
                                                                                            onBlur={handleBlur}
                                                                                            isInvalid={hasError}
                                                                                            aria-describedby={`${field.name}-feedback`}
                                                                                        >
                                                                                            <option value="">Select City</option>
                                                                                            {cityOptions.map((opt) => (
                                                                                                <option key={opt.value} value={opt.value}>
                                                                                                    {opt.label}
                                                                                                </option>
                                                                                            ))}
                                                                                        </Form.Select>
                                                                                    ) : field.type === 'area' ? (
                                                                                        <Form.Select
                                                                                            size="lg"
                                                                                            name={field.name}
                                                                                            value={values[field.name]}
                                                                                            onChange={handleChange}
                                                                                            onBlur={handleBlur}
                                                                                            isInvalid={hasError}
                                                                                            aria-describedby={`${field.name}-feedback`}
                                                                                        >
                                                                                            <option value="">Select Area</option>
                                                                                            {areas.map((area) => (
                                                                                                <option key={area} value={area}>
                                                                                                    {area}
                                                                                                </option>
                                                                                            ))}
                                                                                        </Form.Select>
                                                                                    ) : (
                                                                                        <Form.Control
                                                                                            size="lg"
                                                                                            type="text"
                                                                                            name={field.name}
                                                                                            value={values[field.name]}
                                                                                            onChange={handleChange}
                                                                                            onBlur={handleBlur}
                                                                                            placeholder={field.name === 'referPersonPhone' ? 'যেমন: 017xxxxxxxx' : `Enter ${field.label.toLowerCase()}`}
                                                                                            isInvalid={hasError}
                                                                                            aria-describedby={`${field.name}-feedback`}
                                                                                            style={field.name === 'referPersonPhone' ? { borderColor: '#66bb6a' } : {}}
                                                                                        />
                                                                                    )}

                                                                                    <Form.Control.Feedback type="invalid" id={`${field.name}-feedback`}>
                                                                                        {errors[field.name]}
                                                                                    </Form.Control.Feedback>

                                                                                    {field.name === 'referPersonPhone' && (
                                                                                        <small style={{ color: '#558b2f', fontSize: '0.8rem', marginTop: '6px', display: 'block' }}>
                                                                                            <FaInfoCircle className="me-1" />
                                                                                            কেউ যদি আপনাকে রেফার করে থাকেন, তাহলে তার ফোন নম্বরটি দিন।
                                                                                        </small>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </Form.Group>
                                                                    </div>
                                                                </Col>
                                                            );
                                                        })}
                                                    </Row>

                                                </div>
                                            ))}

                                            {/* Refer Person Phone - Standalone Section */}
                                            <div
                                                className="mb-3 mt-1"
                                                style={{
                                                    background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                                                    border: '1px solid #a5d6a7',
                                                    borderLeft: '4px solid #2e7d32',
                                                    borderRadius: '12px',
                                                    padding: '12px 16px',
                                                    boxShadow: '0 2px 6px rgba(46, 125, 50, 0.08)'
                                                }}
                                            >
                                                <Form.Group controlId="referPersonPhone">
                                                    <Form.Label className="fw-semibold" style={{ color: '#2e7d32', fontSize: '1rem', marginBottom: '6px' }}>
                                                        <FaUserPlus className="me-2" /> রেফার ব্যক্তির নম্বর (যার মাধ্যমে রেফার হয়েছেন)
                                                    </Form.Label>
                                                    <Form.Control
                                                        size="lg"
                                                        type="text"
                                                        name="referPersonPhone"
                                                        value={values.referPersonPhone}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        placeholder="যেমন: 017xxxxxxxx"
                                                        isInvalid={touched.referPersonPhone && !!errors.referPersonPhone}
                                                        style={{ borderColor: '#66bb6a' }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.referPersonPhone}
                                                    </Form.Control.Feedback>
                                                    <small style={{ color: '#558b2f', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                                                        <FaInfoCircle className="me-1" />
                                                        কেউ যদি আপনাকে রেফার করে থাকেন, তাহলে তার ফোন নম্বরটি দিন।
                                                    </small>
                                                </Form.Group>
                                            </div>
                                            <div className="text-center mt-3">
                                                <p className="text-muted mb-2">
                                                    <small>* ফোন বা হোয়াটসঅ্যাপের মধ্যে অন্তত একটি অবশ্যই দিতে হবে, তারপরই আবেদন করতে পারবেন।</small>
                                                </p>
                                                <Button
                                                    type="submit"
                                                    className="btn btn-lg px-5 py-3"
                                                    disabled={isSubmitting}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #004085 0%, #0066cc 100%)',
                                                        border: 'none',
                                                        boxShadow: '0 4px 15px rgba(0, 64, 133, 0.3)',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    <FaGraduationCap className="me-2" /> Submit Registration
                                                </Button>
                                            </div>
                                        </Form>
                                        <ProcessingModal show={isSubmitting} />
                                    </>
                                );
                            }}
                        </Formik>
                    </Card>
                </Container>

                <InfoModal show={showInfoModal} handleClose={() => setShowInfoModal(false)} />
                <SuccessModal show={showSuccessModal} handleClose={() => setShowSuccessModal(false)} />
                <ErrorModal show={showErrorModal} handleClose={() => setShowErrorModal(false)} message={errorMessage} />
                <RegistrationSteps show={showStepsModal} handleClose={() => setShowStepsModal(false)} />
                <PhoneRequiredModal show={showPhoneRequiredModal} handleClose={() => setShowPhoneRequiredModal(false)} validationErrors={phoneModalErrors} />

                {/* Find the isSubmitting state from Formik context if needed, or pass it down. 
                    Since we are inside the component but outside Formik here, we can't access isSubmitting directly easiest way.
                    Let's use a local state wrapper or similar if needed, OR just put it inside Formik content? 
                    Actually, we can see the Formik component above wraps the form. 
                    Wait, `isSubmitting` is inside Formik's render prop. 
                    We need to lift the loading state or render the modal inside Formik. 
                    Let's render it inside Formik for simplicity.
                */}
            </div >
            <Footer />
        </>
    );
};

export default TeacherRegistrationForm;