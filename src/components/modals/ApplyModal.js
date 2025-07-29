import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ApplyModal = ({ show, onClose, tuitionCode, tuitionId }) => {
    const validationSchema = Yup.object({
        registrationCode: Yup.string(),
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

    if (!show) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1050,
                padding: '15px',
            }}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white rounded shadow p-4"
                style={{ maxWidth: 520, width: '100%' }}
            >
                <h4 className="text-center mb-4" style={{ fontWeight: '700' }}>
                    📩 Application for Tuition
                </h4>

                <Formik
                    initialValues={{
                        registrationCode: '',
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
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const res = await fetch('https://tuition-seba-backend-1.onrender.com/api/tuitionApply/add', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(values),
                            });
                            const data = await res.json();
                            if (res.ok) {
                                toast.success('Application submitted successfully!');
                                onClose();
                            } else {
                                toast.error(`${data.message || 'Submission failed'}`);
                            }
                        } catch (error) {
                            toast.error(`${error.message}`);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form noValidate>
                            <div className="mb-3">
                                <label htmlFor="registrationCode" className="form-label">
                                    Registration Code
                                    <small style={{ fontWeight: '600' }}> (ভেরিফায়েড টিচার না হলে এটি খালি রাখুন)</small>
                                </label>
                                <Field
                                    name="registrationCode"
                                    type="text"
                                    className="form-control"
                                />
                                <ErrorMessage
                                    name="registrationCode"
                                    component="div"
                                    className="text-danger small"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="tuitionCode" className="form-label">
                                    Tuition Code <span className="text-danger">*</span>
                                </label>
                                <Field
                                    name="tuitionCode"
                                    type="text"
                                    className="form-control bg-light"
                                    disabled
                                />
                                <ErrorMessage
                                    name="tuitionCode"
                                    component="div"
                                    className="text-danger small"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Name <span className="text-danger">*</span>
                                </label>
                                <Field
                                    name="name"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your name"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-danger small"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="institute" className="form-label">
                                    Institute <span className="text-danger">*</span>
                                </label>
                                <Field
                                    name="institute"
                                    type="text"
                                    className="form-control"
                                    placeholder="Your institute"
                                />
                                <ErrorMessage
                                    name="institute"
                                    component="div"
                                    className="text-danger small"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="department" className="form-label">
                                    Department <span className="text-danger">*</span>
                                </label>
                                <Field
                                    name="department"
                                    type="text"
                                    className="form-control"
                                    placeholder="Your department"
                                />
                                <ErrorMessage
                                    name="department"
                                    component="div"
                                    className="text-danger small"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">
                                    Address <span className="text-danger">*</span>
                                </label>
                                <Field
                                    name="address"
                                    type="text"
                                    className="form-control"
                                    placeholder="Your address"
                                />
                                <ErrorMessage
                                    name="address"
                                    component="div"
                                    className="text-danger small"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">
                                    Phone <span className="text-danger">*</span>
                                </label>
                                <Field
                                    name="phone"
                                    type="tel"
                                    className="form-control"
                                    placeholder="+8801XXXXXXXXX"
                                />
                                <ErrorMessage
                                    name="phone"
                                    component="div"
                                    className="text-danger small"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="comment" className="form-label">
                                    Comment (Optional)
                                </label>
                                <Field
                                    name="comment"
                                    as="textarea"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Additional info or remarks"
                                />
                            </div>

                            <div className="d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>

                <ToastContainer />
            </div>
        </div>
    );
};

export default ApplyModal;
