import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { axiosWithFallback as axios } from '../../services/fetchWithFallback';
import { toast } from 'react-toastify';
import locationData from '../../data/locations.json';

const fieldConfig = [
    { name: 'tuitionCode', label: 'Tuition Code', group: 'details', col: 4, type: 'text' },
    { name: 'wantedTeacher', label: 'Wanted Teacher', group: 'details', col: 4, type: 'text' },
    { name: 'student', label: 'Student', group: 'details', col: 4, type: 'text' },

    { name: 'institute', label: 'Institute', group: 'details', col: 4, type: 'text' },
    { name: 'class', label: 'Class', group: 'details', col: 4, type: 'text' },
    { name: 'medium', label: 'Medium', group: 'details', col: 4, type: 'text' },

    { name: 'subject', label: 'Subject', group: 'details', col: 4, type: 'text' },
    { name: 'day', label: 'Day', group: 'details', col: 4, type: 'text' },
    { name: 'time', label: 'Time', group: 'details', col: 4, type: 'text' },

    { name: 'salary', label: 'Salary', group: 'details', col: 4, type: 'text' },
    { name: 'city', label: 'City', group: 'details', col: 4, type: 'select' },
    { name: 'area', label: 'Area', group: 'details', col: 4, type: 'select' },

    { name: 'location', label: 'Location', group: 'details', col: 6, type: 'text' },
    { name: 'joining', label: 'Joining Date', group: 'details', col: 6, type: 'text' },
    { name: 'guardianNumber', label: 'Guardian Number', group: 'details', col: 4, type: 'text' },
    { name: 'mediaFee', label: 'Media Fee', group: 'details', col: 4, type: 'text' },

    { name: 'guardian_source_medium', label: 'গার্জিয়ান কিভাবে আমাদের সম্পর্কে জানলো', group: 'admin', col: 6, type: 'select', options: [] },
    { name: 'status', label: 'Status', group: 'admin', col: 6, type: 'select', options: ['available', 'given number', 'guardian meet', 'demo class running', 'confirm', 'cancel', 'refer BM', 'suspended', 'guardian no response', 'request for payment'] },
    { name: 'tuitionCancelReasonPublic', label: 'Tuition Cancel Reason (Public)', group: 'admin', col: 6, type: 'text' },
    { name: 'note', label: 'Guardian Demand (Agent)', group: 'admin', col: 6, type: 'text' },
    { name: 'guardianDemandForPublic', label: 'Guardian Demand (Public)', group: 'admin', col: 12, type: 'textarea' },
    { name: 'tutorNumber', label: 'Teacher Number', group: 'admin', col: 6, type: 'text' },
    { name: 'lastAvailableCheck', label: 'Last Available Check', group: 'admin', col: 6, type: 'datetime-local' },
    { name: 'lastUpdate', label: 'Last Update', group: 'admin', col: 6, type: 'datetime-local' },
    { name: 'lastUpdateComment', label: 'Last Update Comment', group: 'admin', col: 6, type: 'text' },

    { name: 'nextUpdateDate', label: 'Next Update Date', group: 'admin', col: 6, type: 'datetime-local' },
    { name: 'nextUpdateComment', label: 'Next Update Comment', group: 'admin', col: 6, type: 'text' },

    { name: 'comment1', label: 'Cancel Teacher 1', group: 'admin', col: 6, type: 'text' },
    { name: 'comment2', label: 'Cancel Teacher 2', group: 'admin', col: 6, type: 'text' },
    { name: 'tuitionCancelReason', label: 'Tuition Cancel Reason', group: 'admin', col: 6, type: 'text' },
    { name: 'guardianBehavior', label: 'Guardian Behavior', group: 'admin', col: 6, type: 'text' },
    { name: 'agentComment', label: 'Agent Comment', group: 'admin', col: 12, type: 'textarea' },

    { name: 'isPublish', label: 'Publish', group: 'admin', col: 4, type: 'switch', defaultValue: false },
    { name: 'isUrgent', label: 'Is Emergency?', group: 'admin', col: 4, type: 'switch', defaultValue: false },
    { name: 'isWhatsappApply', label: 'Apply via WhatsApp?', group: 'admin', col: 4, type: 'switch', defaultValue: false },
    { name: 'isPaymentCreated', label: 'Payment Created?', group: 'admin', col: 4, type: 'switch', defaultValue: false },
    { name: 'isReviewDone', label: 'Review Done?', group: 'admin', col: 4, type: 'switch', defaultValue: false },
    { name: 'assignedTo', label: 'Assigned To', group: 'admin', col: 6, type: 'select', options: [] }, // Options will be populated dynamically
];

const groups = fieldConfig.reduce((acc, field) => {
    acc[field.group] = acc[field.group] || [];
    acc[field.group].push(field);
    return acc;
}, {});

const modalStyles = `
    .form-control:focus,
    .form-select:focus {
        border-color: rgba(13, 110, 253, 0.6) !important;
        box-shadow: 0 0 6px rgba(13, 110, 253, 0.25) !important;
        outline: none !important;
    }
    .saving-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(255, 255, 255, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.75rem;
        z-index: 1060; /* above modal content */
        border-radius: 0.375rem;
        pointer-events: none;
        user-select: none;
    }
    .segmented-control {
        display: inline-flex;
        background-color: #f1f3f5;
        padding: 4px;
        border-radius: 999px;
        border: 1px solid #ced4da;
    }
    .segmented-btn {
        border: none;
        background: none;
        padding: 6px 22px;
        font-size: 0.85rem;
        font-weight: 700;
        border-radius: 999px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        color: #495057;
    }
    .segmented-btn.active-yes {
        background-color: #198754;
        color: white;
        box-shadow: 0 2px 5px rgba(25, 135, 84, 0.35);
    }
    .segmented-btn.active-no {
        background-color: #dc3545;
        color: white;
        box-shadow: 0 2px 5px rgba(220, 53, 69, 0.35);
    }
    .segmented-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const formatForDatetimeLocal = (isoString) => {
    if (!isoString) return '';
    return isoString.length >= 16 ? isoString.substring(0, 16) : isoString;
};

export default function TuitionModal({ show, onHide, editingData = null, editingId, fetchTuitionRecords, fetchSummaryCounts, fetchAlertData }) {
    const [formData, setFormData] = useState({});
    const [areaOptions, setAreaOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [marketingMediums, setMarketingMediums] = useState([]);
    const [saving, setSaving] = useState(false);
    const role = localStorage.getItem('role');

    const cityOptions = locationData.cityOptions.map(({ value, label }) => ({ value, label }));

    useEffect(() => {
        const fetchUsers = async () => {
            if (role === 'superadmin') {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/user/users', {
                        headers: { Authorization: token }
                    });
                    const users = response.data.map(user => ({
                        value: user.username,
                        label: `${user.name} (${user.username})`
                    }));
                    setUserOptions(users);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }
        };

        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/settings/marketing_mediums', {
                    headers: { Authorization: token }
                });
                if (response.data && response.data.value) {
                    setMarketingMediums(response.data.value.map(medium => ({
                        value: medium,
                        label: medium
                    })));
                }
            } catch (error) {
                console.error('Error fetching marketing mediums:', error);
            }
        };

        fetchUsers();
        fetchSettings();
    }, [role]);

    useEffect(() => {
        if (editingData) {
            const normalizedData = { ...editingData };

            ['lastAvailableCheck', 'lastUpdate', 'nextUpdateDate'].forEach(field => {
                if (normalizedData[field]) {
                    normalizedData[field] = formatForDatetimeLocal(normalizedData[field]);
                } else {
                    normalizedData[field] = '';
                }
            });

            if (typeof normalizedData.isPublish === 'boolean') {
                normalizedData.isPublish = normalizedData.isPublish ? true : false;
            }

            setFormData(normalizedData);

            if (normalizedData.city && locationData.areaOptions[normalizedData.city]) {
                let areas = locationData.areaOptions[normalizedData.city].map(area => ({ value: area, label: area }));
                if (normalizedData.area && !areas.some(a => a.value === normalizedData.area)) {
                    areas.push({ value: normalizedData.area, label: normalizedData.area });
                }
                setAreaOptions(areas);
            } else if (normalizedData.area) {
                setAreaOptions([{ value: normalizedData.area, label: normalizedData.area }]);
            } else {
                setAreaOptions([]);
            }
        } else {
            const initData = {};
            fieldConfig.forEach(({ name, defaultValue, type }) => {
                if (type === 'switch') {
                    initData[name] = defaultValue || false;
                } else if (name === 'mediaFee') {
                    initData[name] = '60%';
                } else {
                    initData[name] = '';
                }
            });
            setFormData(initData);
            setAreaOptions([]);
        }
    }, [editingData, show]);

    const handleInputChange = (e, field) => {
        const { name, checked, value } = e.target;
        if (field.type === 'switch') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCityChange = (selectedOption) => {
        const cityValue = selectedOption ? selectedOption.value : '';
        setFormData(prev => ({ ...prev, city: cityValue, area: '' }));

        if (cityValue && locationData.areaOptions[cityValue]) {
            setAreaOptions(locationData.areaOptions[cityValue].map(area => ({ value: area, label: area })));
        } else {
            setAreaOptions([]);
        }
    };

    const handleAreaChange = (selectedOption) => {
        const areaValue = selectedOption ? selectedOption.value : '';
        setFormData(prev => ({ ...prev, area: areaValue }));
    };

    const handleSaveTuition = async () => {
        setSaving(true);

        const username = localStorage.getItem('username');

        let guardianNumber = formData.guardianNumber ? formData.guardianNumber.toString().trim() : '';

        if (guardianNumber && guardianNumber.length < 11) {
            toast.error('Guardian number must be at least 11 digits long');
            setSaving(false);
            return;
        }

        const currentSourceMedium = formData.guardian_source_medium ? formData.guardian_source_medium.trim() : '';
        if (!editingId) {
            if (!currentSourceMedium) {
                toast.error('নতুন টিউশন যুক্ত করার সময় "গার্জিয়ান কিভাবে আমাদের সম্পর্কে জানলো" নির্বাচন করা বাধ্যতামূলক।');
                setSaving(false);
                return;
            }
        } else {
            const previousSourceMedium = editingData?.guardian_source_medium ? editingData.guardian_source_medium.trim() : '';
            if (previousSourceMedium && !currentSourceMedium) {
                toast.error('যেহেতু আগে "গার্জিয়ান কিভাবে আমাদের সম্পর্কে জানলো" নির্বাচন করা ছিল, তাই এখন এটি ফাঁকা রাখা যাবে না।');
                setSaving(false);
                return;
            }
        }

        const currentStatus = formData.status ? formData.status.toLowerCase() : 'available';

        if (currentStatus === 'cancel' || currentStatus === 'suspended') {
            if (!formData.tuitionCancelReasonPublic || !formData.tuitionCancelReasonPublic.trim()) {
                toast.error('টিউশন বাতিল বা স্থগিত হলে অবশ্যই বাতিলের কারণ (Public) উল্লেখ করতে হবে।');
                setSaving(false);
                return;
            }
        } else {
            formData.tuitionCancelReasonPublic = '';
        }

        try {
            const updatedTuitionData = {
                ...formData,
                guardianNumber: guardianNumber,
                status: currentStatus,
                updatedBy: username,
            };
            if (editingId) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/tuition/edit/${editingId}`, updatedTuitionData);
                toast.success('Tuition record updated successfully!');
            } else {
                updatedTuitionData.createdBy = username;
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/tuition/add', updatedTuitionData);
                toast.success('Tuition record created successfully!');
            }
            onHide();
            fetchTuitionRecords();
            fetchSummaryCounts();
            if (fetchAlertData) fetchAlertData();
        } catch (err) {
            console.error('Error saving tuition record:', err);
            const errorMessage = err.response?.data?.message || 'Error saving tuition record.';
            toast.error(errorMessage);
        }
        setSaving(false);
    };

    const inputBorderStyle = {
        borderRadius: '0.375rem',
        border: '1.5px solid rgba(13, 110, 253, 0.3)',
        backgroundColor: '#fff',
        boxShadow: '0 0 6px rgba(13, 110, 253, 0.12)',
        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    };

    return (
        <>
            <style>{modalStyles}</style>

            <Modal
                show={show}
                onHide={saving ? null : onHide}
                size="xl"
                centered
                backdrop="static"
                keyboard={false}
                contentClassName="shadow-lg rounded"
                style={{ maxHeight: '90vh' }}
            >
                <Modal.Header
                    closeButton={!saving}
                    style={{
                        backgroundColor: '#0d6efd',
                        color: 'white',
                        borderBottom: 'none',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1050,
                    }}
                    className="d-flex align-items-center justify-content-between"
                >
                    <Modal.Title className="fw-bold">{editingData ? 'Edit Tuition' : 'Create Tuition'}</Modal.Title>
                </Modal.Header>

                <Modal.Body
                    className="bg-light"
                    style={{
                        maxHeight: 'calc(90vh - 140px)',
                        overflowY: 'auto',
                        position: 'relative',
                        padding: '1rem 1.5rem',
                    }}
                >
                    <div className="modal-body-wrapper" style={{ position: 'relative' }}>
                        {saving && (
                            <div className="saving-overlay" aria-live="polite" aria-busy="true">
                                <Spinner animation="grow" role="status" style={{ width: '3rem', height: '3rem' }} />
                                <span className="fs-5 fw-semibold text-primary">Saving...</span>
                            </div>
                        )}

                        <Form>
                            {Object.entries(groups).map(([groupName, fields]) => (
                                <div
                                    key={groupName}
                                    className="mb-5 p-3 rounded"
                                    style={{
                                        backgroundColor: groupName === 'admin' ? '#e9f0ff' : '#fefefe',
                                        border: '1px solid rgba(13,110,253,0.2)',
                                        boxShadow: '0 0 10px rgba(13, 110, 253, 0.05)',
                                    }}
                                >
                                    <h5
                                        className="mb-4 text-capitalize fw-semibold"
                                        style={{ borderBottom: '2px solid rgba(13, 110, 253, 0.5)', paddingBottom: '0.5rem' }}
                                    >
                                        {groupName === 'admin' ? 'Admin Info' : 'Tuition Details'}
                                    </h5>

                                    <Row className="gy-3">
                                        {fields.map(field => {
                                            const { name, label, col = 6, type = 'text', options: fieldOptions } = field;

                                            // Only show assignedTo to superadmin
                                            const options = fieldOptions;

                                            let value = formData[name];
                                            if (value === undefined || value === null) value = type === 'switch' ? false : '';

                                            if (name === 'tuitionCancelReasonPublic' && formData.status?.toLowerCase() !== 'cancel' && formData.status?.toLowerCase() !== 'suspended') {
                                                return null;
                                            }

                                            if (name === 'assignedTo' || name === 'guardian_source_medium') {
                                                if (name === 'assignedTo' && role !== 'superadmin') return null;
                                                const currentOptions = name === 'assignedTo' ? userOptions : marketingMediums;
                                                return (
                                                    <Col md={col} key={name}>
                                                        <Form.Group controlId={name}>
                                                            <Form.Label className="fw-semibold">{label}</Form.Label>
                                                            <Select
                                                                options={currentOptions}
                                                                value={currentOptions.find(opt => opt.value === value) || null}
                                                                onChange={(option) => setFormData(prev => ({ ...prev, [name]: option ? option.value : '' }))}
                                                                isClearable
                                                                placeholder={`Select ${label}...`}
                                                                isDisabled={saving}
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base, state) => ({
                                                                        ...base,
                                                                        border: '1.5px solid rgba(13,110,253,0.3)',
                                                                        boxShadow: state.isFocused
                                                                            ? '0 0 6px rgba(13,110,253,0.25)'
                                                                            : '0 0 4px rgba(13,110,253,0.12)',
                                                                        '&:hover': { borderColor: 'rgba(13,110,253,0.5)' },
                                                                        minHeight: '38px',
                                                                        borderRadius: '0.375rem',
                                                                        backgroundColor: 'white',
                                                                    }),
                                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                                                }}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                );
                                            }

                                            if (name === 'city') {
                                                return (
                                                    <Col md={col} key={name}>
                                                        <Form.Group controlId={name}>
                                                            <Form.Label className="fw-semibold">{label}</Form.Label>
                                                            <Select
                                                                options={cityOptions}
                                                                value={cityOptions.find(c => c.value === value) || null}
                                                                onChange={handleCityChange}
                                                                isClearable
                                                                placeholder={`Select or type ${label}...`}
                                                                isDisabled={saving}
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base, state) => ({
                                                                        ...base,
                                                                        border: '1.5px solid rgba(13,110,253,0.3)',
                                                                        boxShadow: state.isFocused
                                                                            ? '0 0 6px rgba(13,110,253,0.25)'
                                                                            : '0 0 4px rgba(13,110,253,0.12)',
                                                                        '&:hover': { borderColor: 'rgba(13,110,253,0.5)' },
                                                                        minHeight: '38px',
                                                                        borderRadius: '0.375rem',
                                                                        backgroundColor: 'white',
                                                                    }),
                                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                                                }}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                );
                                            }

                                            if (name === 'area') {
                                                return (
                                                    <Col md={col} key={name}>
                                                        <Form.Group controlId={name}>
                                                            <Form.Label className="fw-semibold">{label}</Form.Label>
                                                            <Select
                                                                options={areaOptions}
                                                                value={areaOptions.find(a => a.value === value) || null}
                                                                onChange={handleAreaChange}
                                                                isClearable
                                                                placeholder={`Select or type ${label}...`}
                                                                isDisabled={saving}
                                                                menuPortalTarget={document.body}
                                                                styles={{
                                                                    control: (base, state) => ({
                                                                        ...base,
                                                                        border: '1.5px solid rgba(13,110,253,0.3)',
                                                                        boxShadow: state.isFocused
                                                                            ? '0 0 6px rgba(13,110,253,0.25)'
                                                                            : '0 0 4px rgba(13,110,253,0.12)',
                                                                        '&:hover': { borderColor: 'rgba(13,110,253,0.5)' },
                                                                        minHeight: '38px',
                                                                        borderRadius: '0.375rem',
                                                                        backgroundColor: 'white',
                                                                    }),
                                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                                                }}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                );
                                            }

                                            if (type === 'select') {
                                                return (
                                                    <Col md={col} key={name}>
                                                        <Form.Group controlId={name}>
                                                            <Form.Label className="fw-semibold">{label}</Form.Label>
                                                            <Form.Select
                                                                name={name}
                                                                value={value}
                                                                onChange={(e) => handleInputChange(e, field)}
                                                                required
                                                                disabled={saving}
                                                                style={inputBorderStyle}
                                                            >
                                                                <option value="">Select {label}</option>
                                                                {options?.map(opt => (
                                                                    <option key={opt} value={opt}>{opt}</option>
                                                                ))}
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                );
                                            }

                                            if (type === 'switch') {
                                                return (
                                                    <Col md={col} key={name}>
                                                        <Form.Group controlId={name}>
                                                            <Form.Label className="fw-semibold d-block mb-2">{label}</Form.Label>
                                                            <div className="segmented-control">
                                                                <button
                                                                    type="button"
                                                                    className={`segmented-btn ${value ? 'active-yes' : ''}`}
                                                                    onClick={() => handleInputChange({ target: { name, checked: true } }, field)}
                                                                    disabled={saving}
                                                                >
                                                                    Yes
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`segmented-btn ${!value ? 'active-no' : ''}`}
                                                                    onClick={() => handleInputChange({ target: { name, checked: false } }, field)}
                                                                    disabled={saving}
                                                                >
                                                                    No
                                                                </button>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                );
                                            }
                                            if (type === 'textarea') {
                                                return (
                                                    <Col md={col} key={name}>
                                                        <Form.Group controlId={name}>
                                                            <Form.Label className="fw-semibold">{label}</Form.Label>
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={3}
                                                                name={name}
                                                                value={value}
                                                                onChange={(e) => handleInputChange(e, field)}
                                                                disabled={saving}
                                                                style={inputBorderStyle}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                );
                                            }

                                            const isCancelReasonPublic = name === 'tuitionCancelReasonPublic';
                                            const customStyle = isCancelReasonPublic ? {
                                                ...inputBorderStyle,
                                                borderColor: '#dc3545',
                                                backgroundColor: '#fff5f5',
                                                borderWidth: '2px',
                                                boxShadow: '0 0 6px rgba(220, 53, 69, 0.2)'
                                            } : inputBorderStyle;

                                            return (
                                                <Col md={col} key={name}>
                                                    <Form.Group controlId={name}>
                                                        <Form.Label className="fw-semibold">
                                                            {label}
                                                            {isCancelReasonPublic && <span className="text-danger ms-1">*</span>}
                                                        </Form.Label>
                                                        <Form.Control
                                                            type={type}
                                                            name={name}
                                                            value={value}
                                                            onChange={(e) => handleInputChange(e, field)}
                                                            required={isCancelReasonPublic ? true : false}
                                                            disabled={saving}
                                                            style={customStyle}
                                                            placeholder={isCancelReasonPublic ? 'Please state the reason for cancel/suspended' : ''}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </div>
                            ))}
                        </Form>
                    </div>
                </Modal.Body>

                <Modal.Footer
                    style={{
                        backgroundColor: '#f8f9fa',
                        borderTop: '3px solid rgba(13,110,253,0.3)',
                        position: 'sticky',
                        bottom: 0,
                        zIndex: 1050,
                    }}
                    className="d-flex justify-content-end gap-2"
                >
                    <Button variant="secondary" onClick={onHide} disabled={saving}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveTuition} disabled={saving}>
                        {saving ? (
                            <>
                                <Spinner animation="grow" size="sm" role="status" aria-hidden="true" className="me-2" />
                                Saving...
                            </>
                        ) : (
                            'Save'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
