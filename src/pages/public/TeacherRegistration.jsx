import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    ProgressBar,
    Card,
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
} from 'react-icons/fa';

import { Formik } from 'formik';
import * as Yup from 'yup';

import InfoModal from '../../components/modals/TeacherBenefitInfoModal';
import SuccessModal from '../../components/modals/ApplySuccessModal';
import ErrorModal from '../../components/modals/ErrorSubmitModal';
import locationData from '../../data/locations.json';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const TeacherRegistrationForm = () => {
    const [progress, setProgress] = useState(0);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
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
        { name: 'mastersDept', label: 'Masters Dept', col: 6, group: 'Academic Info', optional: true, icon: <FaGraduationCap /> },
        { name: 'mastersUniversity', label: 'Masters University', col: 6, group: 'Academic Info', optional: true, icon: <FaUniversity /> },
        { name: 'honorsDept', label: 'Honours Dept', col: 6, group: 'Academic Info', optional: true, icon: <FaGraduationCap /> },
        { name: 'honorsUniversity', label: 'Honours University', col: 6, group: 'Academic Info', optional: true, icon: <FaUniversity /> },
        { name: 'hscGroup', label: 'HSC Group', col: 6, group: 'Academic Info', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Vocational'], icon: <FaBook /> },
        { name: 'hscResult', label: 'HSC Result', col: 6, group: 'Academic Info', icon: <FaAward /> },
        { name: 'sscGroup', label: 'SSC Group', col: 6, group: 'Academic Info', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Vocational'], icon: <FaBook /> },
        { name: 'sscResult', label: 'SSC Result', col: 6, group: 'Academic Info', icon: <FaAward /> },

        { name: 'experience', label: 'Experience', col: 6, group: 'Teaching Profile', icon: <FaClock /> },
        { name: 'favoriteSubject', label: 'Favorite Subject', col: 6, group: 'Teaching Profile', icon: <FaHeart /> },
        { name: 'expectedTuitionAreas', label: 'Expected Tuition Areas', col: 6, group: 'Teaching Profile', icon: <FaMapMarkerAlt /> },
        { name: 'commentFromTeacher', label: 'Comment From Teacher', col: 6, group: 'Teaching Profile', icon: <FaComments />, optional: true },
    ];

    const groupFields = fieldConfig.reduce((acc, field) => {
        if (!acc[field.group]) acc[field.group] = [];
        acc[field.group].push(field);
        return acc;
    }, {});

    const initialValues = {};
    fieldConfig.forEach(({ name }) => {
        initialValues[name] = '';
    });

    const validationSchemaFields = {};
    fieldConfig.forEach(({ name, label, optional, type }) => {
        if (optional) {
            validationSchemaFields[name] = Yup.string().nullable();
            return;
        }

        switch (name) {
            case 'email':
                validationSchemaFields[name] = Yup.string()
                    .email('Invalid email address')
                    .required(`${label} is required`);
                break;
            case 'phone':
            case 'alternativePhone':
            case 'whatsapp':
            case 'familyPhone':
            case 'friendPhone':
                validationSchemaFields[name] = Yup.string()
                    .matches(/^\+?\d{7,15}$/, `${label} must be a valid phone number`)
                    .required(`${label} is required`);
                break;
            case 'gender':
            case 'academicYear':
            case 'hscGroup':
            case 'sscGroup':
            case 'city':
            case 'currentArea':
                validationSchemaFields[name] = Yup.string()
                    .required(`Please select your ${label.toLowerCase()}`);
                break;
            default:
                validationSchemaFields[name] = Yup.string()
                    .required(`${label} is required`);
        }
    });
    const validationSchema = Yup.object(validationSchemaFields);

    return (
        <>
            <NavBar />
            <div style={{ backgroundColor: '#f4f7f9' }}>
                <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '3rem 0' }}>
                    <Container>
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
                                    <Button variant="light" size="lg" onClick={() => setShowInfoModal(true)}>
                                        <FaInfoCircle className="me-2" /> Benefits & Terms
                                    </Button>
                                </div>
                            </Col>
                            <Col lg={4} className="text-center">
                                <div className="bg-white bg-opacity-10 rounded-circle p-5 d-inline-block">
                                    <FaUser className="display-1" />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <Container className="my-5">
                    <Card className="p-4 p-md-5 shadow-lg" style={{ borderRadius: '20px' }}>
                        <div className="text-center mb-5">
                            <h2 className="fw-bold text-primary mb-3">Registration Form</h2>
                            <p className="text-muted">Please fill out all required fields to complete your registration</p>
                            <ProgressBar now={progress} style={{ height: '6px' }} />
                        </div>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { resetForm, setSubmitting }) => {
                                try {
                                    const res = await fetch('https://tuition-seba-backend-1.onrender.com/api/regTeacher/add', {
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
                                            ? `একই ${duplicateNames} দিয়ে ইতোমধ্যে আবেদন করা হয়েছে।`
                                            : data.message || 'একই তথ্য দিয়ে ইতোমধ্যে আবেদন করা হয়েছে।';
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
                            }) => {
                                // Update areas when city changes
                                useEffect(() => {
                                    if (values.city) {
                                        setAreas(areaOptions[values.city] || []);
                                        // Clear currentArea if city changes
                                        setFieldValue('currentArea', '');
                                    }
                                }, [values.city, setFieldValue]);

                                // Calculate progress
                                useEffect(() => {
                                    const requiredFields = fieldConfig.filter(f => !f.optional);
                                    const filled = requiredFields.filter(f => values[f.name]?.toString().trim()).length;
                                    setProgress((filled / requiredFields.length) * 100);
                                }, [values]);

                                return (
                                    <Form noValidate onSubmit={handleSubmit}>
                                        {Object.entries(groupFields).map(([groupName, fields], i) => (
                                            <div className="mb-5" key={groupName}>
                                                <div
                                                    className="p-3 mb-4"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        color: 'white',
                                                        borderRadius: '10px',
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
                                                                <Form.Group controlId={field.name}>
                                                                    <Form.Label className="fw-semibold">
                                                                        {field.icon} {field.label}
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
                                                                            placeholder={`Enter ${field.label.toLowerCase()}`}
                                                                            isInvalid={hasError}
                                                                            aria-describedby={`${field.name}-feedback`}
                                                                        />
                                                                    )}

                                                                    <Form.Control.Feedback type="invalid" id={`${field.name}-feedback`}>
                                                                        {errors[field.name]}
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Col>
                                                        );
                                                    })}
                                                </Row>
                                            </div>
                                        ))}
                                        <div className="text-center mt-5">
                                            <Button type="submit" className="btn btn-primary btn-lg px-5 py-3" disabled={isSubmitting}>
                                                <FaGraduationCap className="me-2" /> Submit Registration
                                            </Button>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </Card>
                </Container>

                <InfoModal show={showInfoModal} handleClose={() => setShowInfoModal(false)} />
                <SuccessModal show={showSuccessModal} handleClose={() => setShowSuccessModal(false)} />
                <ErrorModal show={showErrorModal} handleClose={() => setShowErrorModal(false)} message={errorMessage} />
            </div>
            <Footer />
        </>
    );
};

export default TeacherRegistrationForm;
