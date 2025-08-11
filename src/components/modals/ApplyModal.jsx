import React, { useRef, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApplySuccessModal from '../../components/modals/ApplySuccessModal';

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

    const validationSchema = Yup.object({
        premiumCode: Yup.string(),
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
                        disabled={false}
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
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting, setErrors }) => {
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
                                toast.error(data.message || 'Submission failed');
                            }
                        } catch (error) {
                            toast.error(error.message);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting, errors, submitCount }) => {
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
                                    {[
                                        {
                                            name: 'premiumCode',
                                            label: 'Registration Code',
                                            placeholder: '',
                                            hint: ' (ভেরিফায়েড টিচার না হলে এটি খালি রাখুন)',
                                        },
                                        {
                                            name: 'tuitionCode',
                                            label: 'Tuition Code',
                                            placeholder: '',
                                            disabled: true,
                                            required: true,
                                        },
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
                                        {
                                            name: 'phone',
                                            label: 'Phone',
                                            placeholder: '+8801XXXXXXXXX',
                                            required: true,
                                        },
                                    ].map((field) => (
                                        <div className="mb-3" key={field.name}>
                                            <label className="form-label" htmlFor={field.name}>
                                                {field.label}
                                                {field.required && <span className="text-danger">*</span>}
                                                {field.hint && (
                                                    <small style={{ fontWeight: '600' }}>{field.hint}</small>
                                                )}
                                            </label>
                                            <Field
                                                name={field.name}
                                                type="text"
                                                className="form-control"
                                                placeholder={field.placeholder}
                                                disabled={field.disabled}
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
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                                {isSubmitting && <span style={spinnerStyle} />}
                                                {isSubmitting ? 'Submitting...' : 'Submit'}
                                            </button>
                                        </div>
                                    </div>
                                </Form>

                                {isSubmitting && (
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
                                            Applying for tuition, please wait...
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
            </div>

            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        /* For webkit browsers scrollbar styling */
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
