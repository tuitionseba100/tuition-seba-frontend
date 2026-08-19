import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Tabs, Tab, Badge, Spinner } from 'react-bootstrap';
import { axiosWithFallback as axios } from '../../services/fetchWithFallback';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus } from 'react-icons/fa';

const BASE_URL = 'https://tuition-seba-backend-1-lpfs.onrender.com';

const smsTemplates = [
    {
        name: 'Teacher Verify',
        category: 'Verification',
        text: 'Dear teacher, your profile has been verified. Code: [Code] (keep it secret). You can now apply for tuitions. -Tuition Seba Forum'
    },
    {
        name: 'Tuition Alert (Proposal)',
        category: 'Proposal',
        text: '[Tuition Alert]\\nCode: [Code]\\nClass: [Class] ([Subject])\\nArea: [Area]\\nSalary: [Salary]\\nApply: tuitionsebaforum.com\\nWhatsApp: 01571305804'
    },
    {
        name: 'Guardian Publish (BN)',
        category: 'Guardian Publish Notification',
        text: 'সম্মানিত অভিভাবক, দক্ষ, অভিজ্ঞ ও মানসম্মত শিক্ষক খুঁজতে আমাদের ২৪ ঘণ্টা সময় দিন।\\nContact: 01891-644064 | Tuition Seba Forum'
    },
    {
        name: 'Guardian Publish (EN)',
        category: 'Guardian Publish Notification',
        text: 'Dear Guardian,\\nYour tutor request is active. Please wait 24h to find the best tutor. Avoid confirming via other tuition media.\\nContact: 01891-644064 | TSF'
    },
    {
        name: 'Guardian No Response (BN)',
        category: 'Guardian No Response',
        text: 'শিক্ষকের জন্য যোগাযোগ করেছিলেন, কিন্তু উত্তর পাইনি। এখনো দরকার হলে যোগাযোগ করুন।\\nContact: 01891-644064 | TSF'
    },
    {
        name: 'Guardian No Response (EN)',
        category: 'Guardian No Response',
        text: 'Dear Guardian,\\nWe tried reaching you about your tutor request but got no response. If still needed, please contact us soon.\\nContact: 01891-644064 | TSF'
    }
];

const CreateSmsModal = ({ show, onHide, onSuccess }) => {
    const [activeTab, setActiveTab] = useState('single');
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Form inputs
    const [phone, setPhone] = useState('');
    const [broadcastPhones, setBroadcastPhones] = useState(['']);
    const [message, setMessage] = useState('');
    const [categorySelect, setCategorySelect] = useState('General');
    const [customCategory, setCustomCategory] = useState('');
    const [tuitionCode, setTuitionCode] = useState('');
    const [premiumCode, setPremiumCode] = useState('');

    // Broadcast parsing states
    const [parsedPhones, setParsedPhones] = useState([]);
    const [duplicateCount, setDuplicateCount] = useState(0);
    const [invalidCount, setInvalidCount] = useState(0);

    // Character counter states
    const [charCount, setCharCount] = useState(0);
    const [smsParts, setSmsParts] = useState(1);
    const [isUnicode, setIsUnicode] = useState(false);

    // Categories list based on system usage
    const staticCategories = [
        { label: 'General', value: 'General' },
        { label: 'Proposal', value: 'Proposal' },
        { label: 'Teacher Verification', value: 'Verification' },
        { label: 'Guardian No Response', value: 'Guardian No Response' },
        { label: 'Guardian Publish Notification', value: 'Guardian Publish Notification' },
        { label: 'Other (Type custom)', value: 'Other' }
    ];

    // Phone normalization logic
    const normalizePhone = (num) => {
        let cleaned = num.replace(/[^\d+]/g, '').trim(); // Remove all non-digits/non-plus
        if (cleaned.startsWith('+8801')) {
            cleaned = cleaned.replace('+', '');
        } else if (cleaned.startsWith('01')) {
            cleaned = '88' + cleaned;
        }
        return cleaned;
    };

    // Validate if normalized number is standard Bangladeshi mobile
    const isValidBDMobile = (num) => {
        return /^8801[3-9]\d{8}$/.test(num);
    };

    // Dynamic field list actions
    const handleAddPhoneField = () => {
        setBroadcastPhones([...broadcastPhones, '']);
    };

    const handleRemovePhoneField = (index) => {
        if (broadcastPhones.length === 1) {
            setBroadcastPhones(['']);
        } else {
            setBroadcastPhones(broadcastPhones.filter((_, idx) => idx !== index));
        }
    };

    const handlePhoneChange = (index, value) => {
        const updated = [...broadcastPhones];
        updated[index] = value;
        setBroadcastPhones(updated);
    };

    const handleApplyTemplate = (tpl) => {
        // Clean double-escaped newlines if any
        let text = tpl.text.replace(/\\n/g, '\n');
        
        // Dynamically replace code placeholders if populated
        if (tpl.category === 'Verification' && premiumCode.trim()) {
            text = text.replace('[Code]', premiumCode.trim());
        } else if (tpl.category === 'Proposal' && tuitionCode.trim()) {
            text = text.replace('[Code]', tuitionCode.trim());
        }
        
        setMessage(text);
        setCategorySelect(tpl.category);
    };

    // Real-time broadcast phone parsing
    useEffect(() => {
        if (activeTab !== 'broadcast') return;

        const normalizedList = broadcastPhones
            .map(p => p.trim())
            .filter(Boolean)
            .map(p => normalizePhone(p));
        
        const validList = [];
        let dups = 0;
        let invalids = 0;

        const uniqueSet = new Set();

        normalizedList.forEach(num => {
            if (!isValidBDMobile(num)) {
                invalids++;
            } else if (uniqueSet.has(num)) {
                dups++;
            } else {
                uniqueSet.add(num);
                validList.push(num);
            }
        });

        setParsedPhones(validList);
        setDuplicateCount(dups);
        setInvalidCount(invalids);
    }, [broadcastPhones, activeTab]);

    // Real-time SMS character and parts count
    useEffect(() => {
        const len = message.length;
        setCharCount(len);

        if (len === 0) {
            setSmsParts(1);
            setIsUnicode(false);
            return;
        }

        // Detect Unicode (non-ASCII characters)
        const unicodeRegex = /[^\u0000-\u007F]/;
        const unicodeDetected = unicodeRegex.test(message);
        setIsUnicode(unicodeDetected);

        let parts = 1;
        if (unicodeDetected) {
            // Unicode SMS limits: 70 for 1st part, 67 for multi-part
            if (len <= 70) {
                parts = 1;
            } else {
                parts = Math.ceil(len / 67);
            }
        } else {
            // ASCII SMS limits: 160 for 1st part, 153 for multi-part
            if (len <= 160) {
                parts = 1;
            } else {
                parts = Math.ceil(len / 153);
            }
        }
        setSmsParts(parts);
    }, [message]);

    const isFormValid = () => {
        // 1. Message check
        if (!message.trim()) return false;
        if (smsParts > 3) return false;

        // 2. Category check
        const finalCategory = categorySelect === 'Other' ? customCategory.trim() : categorySelect;
        if (!finalCategory) return false;

        // 3. Phone check
        if (activeTab === 'single') {
            const normalized = normalizePhone(phone);
            if (!isValidBDMobile(normalized)) return false;
        } else {
            if (parsedPhones.length === 0) return false;
            if (duplicateCount > 0) return false;
        }

        // 4. Category-based code check
        if (finalCategory === 'Verification' && !premiumCode.trim()) return false;
        if (finalCategory === 'Proposal' && (!tuitionCode.trim() || !premiumCode.trim())) return false;
        if ((finalCategory === 'Guardian No Response' || finalCategory === 'Guardian Publish Notification') && !tuitionCode.trim()) return false;

        return true;
    };

    // Handle submit (triggers confirmation modal)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Determine final category value
        const finalCategory = categorySelect === 'Other' ? customCategory.trim() : categorySelect;
        if (!finalCategory) {
            toast.error('Please specify a category.');
            return;
        }

        // Validate Premium Code if category is Teacher Verification
        if (finalCategory === 'Verification' && !premiumCode.trim()) {
            toast.error('Premium Code is required for Teacher Verification.');
            return;
        }

        // Validate Tuition Code & Premium Code if category is Proposal
        if (finalCategory === 'Proposal') {
            if (!tuitionCode.trim() || !premiumCode.trim()) {
                toast.error('Both Tuition Code and Premium Code are required for Proposal.');
                return;
            }
        }

        // Validate Tuition Code if category is Guardian No Response or Guardian Publish Notification
        if (finalCategory === 'Guardian No Response' || finalCategory === 'Guardian Publish Notification') {
            if (!tuitionCode.trim()) {
                toast.error('Tuition Code is required for Guardian Notifications.');
                return;
            }
        }

        // 2. Validate message
        if (!message.trim()) {
            toast.error('SMS message body is required.');
            return;
        }

        if (smsParts > 3) {
            toast.error('Message is too long. Maximum allowed limit is 3 SMS parts.');
            return;
        }

        // 3. Validate Phone numbers
        if (activeTab === 'single') {
            const normalized = normalizePhone(phone);
            if (!isValidBDMobile(normalized)) {
                toast.error('Invalid Bangladesh mobile number format. (Must be 11-digit or include 88 prefix)');
                return;
            }
        } else {
            if (duplicateCount > 0) {
                toast.error('Duplicate phone numbers are not allowed. Please remove duplicates before sending.');
                return;
            }

            if (parsedPhones.length === 0) {
                toast.error('No valid phone numbers found to send.');
                return;
            }
        }

        setShowConfirmModal(true);
    };

    // Actual API dispatch handler called from confirmation modal
    const handleActualSend = async () => {
        const finalCategory = categorySelect === 'Other' ? customCategory.trim() : categorySelect;
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username') || 'Admin';
        const headers = {
            Authorization: token,
            'x-user-name': username
        };

        setLoading(true);

        try {
            if (activeTab === 'single') {
                const normalized = normalizePhone(phone);
                const response = await axios.post(
                    `${BASE_URL}/api/sms/send-single`,
                    {
                        phone: normalized,
                        message: message.trim(),
                        category: finalCategory,
                        tuitionCode: tuitionCode.trim() || '',
                        premiumCode: premiumCode.trim() || ''
                    },
                    { headers }
                );

                if (response.data?.success) {
                    toast.success('SMS sent successfully!');
                    handleResetForm();
                    onSuccess();
                    setShowConfirmModal(false);
                    onHide();
                } else {
                    toast.error(response.data?.statusMessage || 'Failed to send single SMS');
                }
            } else {
                const response = await axios.post(
                    `${BASE_URL}/api/sms/send-bulk`,
                    {
                        phones: parsedPhones,
                        message: message.trim(),
                        category: finalCategory,
                        tuitionCode: tuitionCode.trim() || '',
                        premiumCode: premiumCode.trim() || ''
                    },
                    { headers }
                );

                if (response.data?.success) {
                    toast.success(`Successfully sent SMS broadcast to ${parsedPhones.length} recipient(s)!`);
                    handleResetForm();
                    onSuccess();
                    setShowConfirmModal(false);
                    onHide();
                } else {
                    toast.error(response.data?.statusMessage || 'Failed to send broadcast SMS');
                }
            }
        } catch (err) {
            console.error('Send SMS API Error:', err);
            toast.error(err.response?.data?.statusMessage || err.response?.data?.message || 'Error occurred while sending SMS');
        } finally {
            setLoading(false);
        }
    };

    // Reset Form fields
    const handleResetForm = () => {
        setPhone('');
        setBroadcastPhones(['']);
        setMessage('');
        setCategorySelect('General');
        setCustomCategory('');
        setTuitionCode('');
        setPremiumCode('');
        setParsedPhones([]);
        setDuplicateCount(0);
        setInvalidCount(0);
    };

    const isSinglePhoneInvalid = phone.trim() !== '' && !isValidBDMobile(normalizePhone(phone));
    const isTuitionCodeRequired = categorySelect === 'Proposal' || categorySelect === 'Guardian No Response' || categorySelect === 'Guardian Publish Notification';
    const isPremiumCodeRequired = categorySelect === 'Verification' || categorySelect === 'Proposal';
    const isBroadcastEmpty = broadcastPhones.map(p => p.trim()).filter(Boolean).length === 0;

    return (
        <>
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold text-primary">Send New SMS</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-3"
                        id="sms-send-tabs"
                    >
                        <Tab eventKey="single" title="Single SMS">
                            <Form.Group className="mb-3" controlId="singlePhoneInput">
                                <Form.Label className="fw-bold d-flex justify-content-between align-items-center w-100">
                                    <span>Phone Number <span className="text-danger">*</span></span>
                                    {isSinglePhoneInvalid && (
                                        <span className="text-danger small fw-normal">Invalid Bangladesh format</span>
                                    )}
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter mobile number (e.g., 01712345678)"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required={activeTab === 'single'}
                                />
                                <Form.Text className="text-muted">
                                    Number will be normalized to standard Bangladesh mobile code format.
                                </Form.Text>
                            </Form.Group>
                        </Tab>

                        <Tab eventKey="broadcast" title="Broadcast (Bulk) SMS">
                            <Form.Group className="mb-3" controlId="broadcastPhonesInput">
                                <Form.Label className="fw-bold d-flex justify-content-between align-items-center mb-2 w-100">
                                    <span>Recipients ({broadcastPhones.length}) <span className="text-danger">*</span></span>
                                    <div className="d-flex align-items-center gap-2">
                                        {isBroadcastEmpty ? (
                                            <span className="text-danger small fw-normal me-2">Recipient list is empty</span>
                                        ) : duplicateCount > 0 ? (
                                            <span className="text-danger small fw-normal me-2">Duplicates not allowed</span>
                                        ) : invalidCount > 0 ? (
                                            <span className="text-danger small fw-normal me-2">Invalid format detected</span>
                                        ) : null}
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={handleAddPhoneField}
                                            className="d-flex align-items-center gap-1"
                                        >
                                            <FaPlus size={10} /> Add Recipient
                                        </Button>
                                    </div>
                                </Form.Label>
                                
                                <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
                                    {broadcastPhones.map((ph, idx) => (
                                        <Row key={idx} className="mb-2 align-items-center">
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder={`Phone number ${idx + 1} (e.g. 017XXXXXXXX)`}
                                                    value={ph}
                                                    onChange={(e) => handlePhoneChange(idx, e.target.value)}
                                                    required={activeTab === 'broadcast'}
                                                />
                                            </Col>
                                            <Col xs="auto">
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleRemovePhoneField(idx)}
                                                    disabled={broadcastPhones.length === 1 && ph === ''}
                                                    title="Remove field"
                                                    className="d-flex align-items-center justify-content-center"
                                                    style={{ width: '38px', height: '38px' }}
                                                >
                                                    <FaTrash size={12} />
                                                </Button>
                                            </Col>
                                        </Row>
                                    ))}
                                </div>

                                <div className="mt-3 d-flex flex-wrap gap-2">
                                    <Badge bg="success">
                                        Valid/Unique: {parsedPhones.length}
                                    </Badge>
                                    {duplicateCount > 0 && (
                                        <Badge bg="warning" className="text-dark">
                                            Duplicates Removed: {duplicateCount}
                                        </Badge>
                                    )}
                                    {invalidCount > 0 && (
                                        <Badge bg="danger">
                                            Invalid Format: {invalidCount}
                                        </Badge>
                                    )}
                                </div>
                            </Form.Group>
                        </Tab>
                    </Tabs>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="smsCategorySelect">
                                <Form.Label className="fw-bold">Category <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    value={categorySelect}
                                    onChange={(e) => setCategorySelect(e.target.value)}
                                >
                                    {staticCategories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        {categorySelect === 'Other' && (
                            <Col md={6}>
                                <Form.Group controlId="customCategoryInput">
                                    <Form.Label className="fw-bold d-flex justify-content-between align-items-center w-100">
                                        <span>Custom Category <span className="text-danger">*</span></span>
                                        {!customCategory.trim() && (
                                            <span className="text-danger small fw-normal">Required</span>
                                        )}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Type category name"
                                        value={customCategory}
                                        onChange={(e) => setCustomCategory(e.target.value)}
                                        required={categorySelect === 'Other'}
                                    />
                                </Form.Group>
                            </Col>
                        )}
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="smsTuitionCode">
                                <Form.Label className="fw-bold d-flex justify-content-between align-items-center w-100">
                                    <span>Tuition Code {isTuitionCodeRequired ? <span className="text-danger">*</span> : '(Optional)'}</span>
                                    {isTuitionCodeRequired && !tuitionCode.trim() && (
                                        <span className="text-danger small fw-normal">Required</span>
                                    )}
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g., T12345"
                                    value={tuitionCode}
                                    onChange={(e) => setTuitionCode(e.target.value)}
                                    required={isTuitionCodeRequired}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="smsPremiumCode">
                                <Form.Label className="fw-bold d-flex justify-content-between align-items-center w-100">
                                    <span>Premium Code {isPremiumCodeRequired ? <span className="text-danger">*</span> : '(Optional)'}</span>
                                    {isPremiumCodeRequired && !premiumCode.trim() && (
                                        <span className="text-danger small fw-normal">Required</span>
                                    )}
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g., P98765"
                                    value={premiumCode}
                                    onChange={(e) => setPremiumCode(e.target.value)}
                                    required={isPremiumCodeRequired}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="mb-3">
                        <Form.Label className="fw-bold d-block small mb-1 text-muted">Use Template Suggestions:</Form.Label>
                        <div className="d-flex flex-wrap gap-1">
                            {smsTemplates.map((tpl, index) => (
                                <Button
                                    key={index}
                                    type="button"
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleApplyTemplate(tpl)}
                                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                >
                                    {tpl.name}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Form.Group className="mb-2" controlId="smsMessageTextarea">
                        <Form.Label className="fw-bold d-flex justify-content-between align-items-center w-100">
                            <span>Message Body <span className="text-danger">*</span></span>
                            {!message.trim() ? (
                                <span className="text-danger small fw-normal">Required</span>
                            ) : smsParts > 3 ? (
                                <span className="text-danger small fw-normal">Exceeds max limit of 3 parts</span>
                            ) : null}
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Type your SMS content here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                        <div className="mt-2 d-flex justify-content-between text-muted small">
                            <span>
                                Character Count: <strong>{charCount}</strong>
                            </span>
                            <span>
                                SMS Encoding: <strong>{isUnicode ? 'Unicode' : 'ASCII'}</strong>
                            </span>
                            <span>
                                SMS Parts: <Badge bg={smsParts > 1 ? 'warning' : 'info'} className={smsParts > 1 ? 'text-dark' : ''}>{smsParts}</Badge>
                            </span>
                        </div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={loading}>
                        Cancel
                    </Button>
                    {isFormValid() && (
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Sending...
                                </>
                            ) : (
                                'Send SMS'
                            )}
                        </Button>
                    )}
                </Modal.Footer>
            </Form>
        </Modal>

        {/* Confirmation Modal */}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} size="md" centered backdrop="static">
            <Modal.Header closeButton className="bg-warning text-dark">
                <Modal.Title className="fw-bold">Confirm SMS Dispatch</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-muted mb-4">Please review the details below before sending the SMS:</p>
                
                <Row className="mb-2">
                    <Col xs={4} className="fw-bold text-secondary">Send Type:</Col>
                    <Col xs={8} className="text-dark fw-semibold">
                        {activeTab === 'single' ? 'Single SMS' : `Broadcast SMS (${parsedPhones.length} recipients)`}
                    </Col>
                </Row>
                
                <Row className="mb-2">
                    <Col xs={4} className="fw-bold text-secondary">Recipients:</Col>
                    <Col xs={8} className="text-dark text-break">
                        {activeTab === 'single' ? (
                            <code>{normalizePhone(phone)}</code>
                        ) : (
                            <div style={{ maxHeight: '100px', overflowY: 'auto', border: '1px solid #dee2e6', padding: '5px', borderRadius: '4px', background: '#f8f9fa' }}>
                                {parsedPhones.map((p, idx) => (
                                    <div key={idx} className="small"><code>{p}</code></div>
                                ))}
                            </div>
                        )}
                    </Col>
                </Row>
                
                <Row className="mb-2">
                    <Col xs={4} className="fw-bold text-secondary">Category:</Col>
                    <Col xs={8}>
                        <Badge bg="info" className="text-dark fw-semibold">
                            {categorySelect === 'Other' ? customCategory.trim() : categorySelect}
                        </Badge>
                    </Col>
                </Row>

                {(tuitionCode.trim() || premiumCode.trim()) && (
                    <Row className="mb-2">
                        <Col xs={4} className="fw-bold text-secondary">Codes:</Col>
                        <Col xs={8}>
                            {tuitionCode.trim() && <Badge bg="primary" className="me-1">Tuition: {tuitionCode.trim()}</Badge>}
                            {premiumCode.trim() && <Badge bg="secondary">Premium: {premiumCode.trim()}</Badge>}
                        </Col>
                    </Row>
                )}

                <Row className="mb-2">
                    <Col xs={4} className="fw-bold text-secondary">SMS Details:</Col>
                    <Col xs={8} className="small">
                        Parts: <strong>{smsParts}</strong> | Encoding: <strong>{isUnicode ? 'Unicode' : 'ASCII'}</strong>
                    </Col>
                </Row>

                <hr />

                <div className="mb-2 fw-bold text-secondary">Message Content:</div>
                <div className="bg-light p-3 rounded text-dark text-break" style={{ whiteSpace: 'pre-wrap', maxHeight: '150px', overflowY: 'auto', border: '1px solid #e9ecef' }}>
                    {message}
                </div>

                {smsParts > 1 && (
                    <div className="alert alert-warning mt-3 mb-0 py-2 small d-flex align-items-center">
                        <strong>Note:</strong> &nbsp; This is a multi-part SMS ({smsParts} parts) and will consume more credits.
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowConfirmModal(false)} disabled={loading}>
                    Back to Edit
                </Button>
                <Button variant="success" onClick={handleActualSend} disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Sending...
                        </>
                    ) : (
                        'Confirm & Send'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    );
};

export default CreateSmsModal;
