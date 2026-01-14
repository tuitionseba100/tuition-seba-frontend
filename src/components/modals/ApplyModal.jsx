import React, { useRef, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApplySuccessModal from '../../components/modals/ApplySuccessModal';
import CustomErrorModal from '../../components/modals/CustomErrorModal';

const spinnerStyle = {
    width: 24,
    height: 24,
    border: '3px solid #3c81e1',
    borderTop: '3px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: 8,
};

const ApplyModal = ({ show, onClose, tuitionCode, tuitionId }) => {
    const modalBodyRef = useRef(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [teacherData, setTeacherData] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);

    const verificationSchema = Yup.object({
        premiumCode: Yup.string().required('Please enter your premium code'),
        tuitionCode: Yup.string().required('Tuition Code is required'),
        phone: Yup.string()
            .required('Phone is required')
            .matches(/^\+?\d{7,15}$/, 'Phone number is not valid'),
    });

    const fullValidationSchema = Yup.object({
        premiumCode: Yup.string().required('Please enter your premium code'),
        tuitionCode: Yup.string().required('Tuition Code is required'),
        name: Yup.string().required('Name is required'),
        institute: Yup.string().required('Institute is required'),
        department: Yup.string().required('Department is required'),
        address: Yup.string().required('Address is required'),
        phone: Yup.string()
            .required('Phone is required')
            .matches(/^\+?\d{7,15}$/, 'Phone number is not valid'),
        comment: Yup.string(),
    });

    useEffect(() => {
        document.body.style.overflow = show ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [show]);

    const handleVerification = async (values, setFieldValue) => {
        setIsVerifying(true);
        try {
            const checkRes = await fetch(
                'https://tuition-seba-backend-1.onrender.com/api/regTeacher/check-apply-possible',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        premiumCode: values.premiumCode,
                        phone: values.phone,
                    }),
                }
            );
            const checkData = await checkRes.json();

            if (!checkRes.ok) {
                setErrorMessage(checkData.message || 'Invalid premium code or phone');
                setIsVerifying(false);
                return;
            }

            // Verification successful - auto-populate fields
            setTeacherData(checkData.data.data);
            setIsVerified(true);

            // Auto-populate fields from teacher data
            const teacher = checkData.data.data;
            setFieldValue('name', teacher.name || '');
            setFieldValue('institute', teacher.university || teacher.honorsUniversity || teacher.mastersUniversity || '');
            setFieldValue('department', teacher.department || teacher.honorsDept || teacher.mastersDept || '');

            let combinedAddress = teacher.fullAddress || '';
            if (teacher.currentArea) {
                combinedAddress = combinedAddress ? `${combinedAddress}. Area: ${teacher.currentArea}` : `Area: ${teacher.currentArea}`;
            }
            setFieldValue('address', combinedAddress);

            toast.success('যাচাইকরণ সফল হয়েছে! এখন আবেদন সম্পূর্ণ করুন।');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsVerifying(false);
        }
    };

    if (!show) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1050,
                padding: 16,
            }}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white"
                style={{
                    width: '100%',
                    maxWidth: 600,
                    height: '90vh',
                    border: '2px solid #3c81e1',
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(60,129,225,0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'white',
                        padding: '16px 48px 16px 16px',
                        borderBottom: '4px solid #3c81e1',
                        zIndex: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: '700',
                        fontSize: 20,
                    }}
                >
                    <span style={{ flex: 1, textAlign: 'center' }}>📩 Application for Tuition</span>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        style={{
                            position: 'absolute',
                            right: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            border: 'none',
                            background: 'transparent',
                            fontSize: 28,
                            fontWeight: 'bold',
                            color: '#3c81e1',
                            cursor: 'pointer',
                            lineHeight: 1,
                        }}
                    >
                        &times;
                    </button>
                </div>

                <Formik
                    initialValues={{
                        premiumCode: '',
                        tuitionCode: tuitionCode || '',
                        tuitionId: tuitionId || '',
                        name: '',
                        institute: '',
                        department: '',
                        address: '',
                        phone: '',
                        comment: '',
                    }}
                    enableReinitialize
                    validationSchema={isVerified ? fullValidationSchema : verificationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        if (!isVerified) {
                            // This shouldn't happen, but just in case
                            setSubmitting(false);
                            return;
                        }

                        try {
                            const res = await fetch(
                                'https://tuition-seba-backend-1.onrender.com/api/tuitionApply/add',
                                {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(values),
                                }
                            );
                            const data = await res.json();
                            if (res.ok) {
                                setShowSuccess(true);
                            } else {
                                setErrorMessage(data.message || 'Submission failed');
                            }
                        } catch (error) {
                            setErrorMessage(error.message);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting, errors, submitCount, values, setFieldValue }) => {
                        useEffect(() => {
                            if (Object.keys(errors).length > 0 && submitCount > 0) {
                                const firstErrorKey = Object.keys(errors)[0];
                                const el = document.getElementsByName(firstErrorKey)[0];
                                if (el && modalBodyRef.current) {
                                    modalBodyRef.current.scrollTo({
                                        top: el.offsetTop - 80,
                                        behavior: 'smooth',
                                    });
                                    el.focus();
                                }
                                toast.error(errors[firstErrorKey]);
                            }
                        }, [errors, submitCount]);

                        return (
                            <>
                                <Form
                                    noValidate
                                    ref={modalBodyRef}
                                    style={{
                                        flex: 1,
                                        overflowY: 'auto',
                                        padding: '16px 24px',
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#3c81e1 #e0e0e0',
                                    }}
                                    className="custom-scrollbar"
                                >
                                    {/* Tuition Code - moved to top and designed beautifully */}
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            padding: '20px',
                                            margin: '10px 0 20px 0',
                                            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '18px',
                                            position: 'relative',
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            backgroundColor: '#ff6b6b',
                                            color: 'white',
                                            padding: '5px 15px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                        }}>
                                            TUITION APPLICATION
                                        </div>
                                        <div style={{ marginTop: '10px' }}>
                                            <span style={{ display: 'block', fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>TUITION CODE</span>
                                            <span style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>{values.tuitionCode}</span>
                                        </div>
                                    </div>

                                    {/* Info Note in Bangla */}
                                    <div
                                        style={{
                                            backgroundColor: '#e3f2fd',
                                            border: '1px solid #3c81e1',
                                            borderRadius: 6,
                                            padding: '10px 12px',
                                            marginBottom: 16,
                                            fontSize: 13,
                                            color: '#1565c0',
                                        }}
                                    >
                                        <strong>দ্রষ্টব্য:</strong> প্রথমে আপনার প্রিমিয়াম কোড এবং ফোন নম্বর দিয়ে যাচাই করুন। যাচাইকরণ সফল হলে বাকি তথ্য স্বয়ংক্রিয়ভাবে পূরণ হবে।
                                    </div>

                                    {/* Registration Code */}
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="premiumCode">
                                            Registration Code (Premium Code)
                                            <span className="text-danger">*</span>
                                            <small style={{ fontWeight: '600', marginLeft: 8, color: '#555' }}>
                                                (অ্যাপলাই করতে অবশ্যই প্রিমিয়াম টিচার হতে হবে)
                                            </small>
                                        </label>
                                        <Field
                                            name="premiumCode"
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter your premium code"
                                            disabled={isVerified}
                                            style={{
                                                border: '1.5px solid #3c81e1',
                                                borderRadius: 6,
                                                padding: '8px 12px',
                                                transition: 'border-color 0.3s',
                                                backgroundColor: isVerified ? '#f5f5f5' : 'white',
                                            }}
                                        />
                                        <ErrorMessage
                                            name="premiumCode"
                                            component="div"
                                            className="text-danger small"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="phone">
                                            Phone
                                            <span className="text-danger">*</span>
                                        </label>
                                        <Field
                                            name="phone"
                                            type="text"
                                            className="form-control"
                                            placeholder="+8801XXXXXXXXX"
                                            disabled={isVerified}
                                            style={{
                                                border: '1.5px solid #3c81e1',
                                                borderRadius: 6,
                                                padding: '8px 12px',
                                                transition: 'border-color 0.3s',
                                                backgroundColor: isVerified ? '#f5f5f5' : 'white',
                                            }}
                                        />
                                        <ErrorMessage
                                            name="phone"
                                            component="div"
                                            className="text-danger small"
                                        />
                                    </div>

                                    {/* Show "Verify and Continue" button if not verified */}
                                    {!isVerified && (
                                        <div className="mb-4">
                                            <button
                                                type="button"
                                                className="btn btn-primary w-100"
                                                onClick={() => handleVerification(values, setFieldValue)}
                                                disabled={isVerifying || !values.premiumCode || !values.phone}
                                                style={{
                                                    padding: '10px',
                                                    fontWeight: '600',
                                                    fontSize: 16,
                                                }}
                                            >
                                                {isVerifying && <span style={spinnerStyle} />}
                                                {isVerifying ? 'Verifying...Please Wait' : 'Verify and Continue'}
                                            </button>
                                        </div>
                                    )}

                                    {/* Rest of the fields - only shown after verification */}
                                    {isVerified && (
                                        <>
                                            {[
                                                {
                                                    name: 'name',
                                                    label: 'Name',
                                                    placeholder: 'Enter your name',
                                                    required: true,
                                                },
                                                {
                                                    name: 'institute',
                                                    label: 'Institute',
                                                    placeholder: 'Your institute',
                                                    required: true,
                                                },
                                                {
                                                    name: 'department',
                                                    label: 'Department',
                                                    placeholder: 'Your department',
                                                    required: true,
                                                },
                                                {
                                                    name: 'address',
                                                    label: 'Address',
                                                    placeholder: 'Your address',
                                                    required: true,
                                                },
                                            ].map((field) => (
                                                <div className="mb-3" key={field.name}>
                                                    <label className="form-label" htmlFor={field.name}>
                                                        {field.label}
                                                        {field.required && <span className="text-danger">*</span>}
                                                    </label>
                                                    <Field
                                                        name={field.name}
                                                        type="text"
                                                        className="form-control"
                                                        placeholder={field.placeholder}
                                                        style={{
                                                            border: '1.5px solid #3c81e1',
                                                            borderRadius: 6,
                                                            padding: '8px 12px',
                                                            transition: 'border-color 0.3s',
                                                        }}
                                                    />
                                                    <ErrorMessage
                                                        name={field.name}
                                                        component="div"
                                                        className="text-danger small"
                                                    />
                                                </div>
                                            ))}

                                            <div className="mb-3">
                                                <label htmlFor="comment" className="form-label">
                                                    Comment (Optional)
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    name="comment"
                                                    className="form-control"
                                                    rows="3"
                                                    placeholder="Additional info or remarks"
                                                    style={{
                                                        border: '1.5px solid #3c81e1',
                                                        borderRadius: 6,
                                                        padding: '8px 12px',
                                                        resize: 'vertical',
                                                        transition: 'border-color 0.3s',
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div
                                        style={{
                                            position: 'sticky',
                                            bottom: 0,
                                            backgroundColor: 'white',
                                            paddingTop: 12,
                                            paddingBottom: 16,
                                            borderTop: '4px solid #3c81e1',
                                            zIndex: 10,
                                        }}
                                    >
                                        <div className="d-flex justify-content-between">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={onClose}
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </button>
                                            {isVerified && (
                                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                                    {isSubmitting && <span style={spinnerStyle} />}
                                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </Form>

                                {(isSubmitting || isVerifying) && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'rgba(255, 255, 255, 0.85)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            zIndex: 1000,
                                            pointerEvents: 'none',
                                            userSelect: 'none',
                                        }}
                                    >
                                        <div style={spinnerStyle} />
                                        <div
                                            style={{
                                                marginTop: 16,
                                                fontWeight: '600',
                                                fontSize: 18,
                                                color: '#3c81e1',
                                            }}
                                        >
                                            {isVerifying ? 'Verifying your information...' : 'Applying for tuition, please wait...'}
                                        </div>
                                    </div>
                                )}
                            </>
                        );
                    }}
                </Formik>

                <ToastContainer />
                {showSuccess && (
                    <ApplySuccessModal
                        show={showSuccess}
                        handleClose={() => {
                            setShowSuccess(false);
                            onClose();
                        }}
                    />
                )}
                <CustomErrorModal
                    show={!!errorMessage}
                    message={errorMessage}
                    onClose={() => setErrorMessage('')}
                />
            </div>

            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e0e0e0;
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #3c81e1;
          border-radius: 5px;
          border: 2px solid #e0e0e0;
        }
      `}</style>
        </div>
    );
};

export default ApplyModal;