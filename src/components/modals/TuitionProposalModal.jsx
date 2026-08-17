import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Row, Col, Spinner, Badge, Nav, Tab } from 'react-bootstrap';
import { axiosWithFallback as axios } from '../../services/fetchWithFallback';
import { toast } from 'react-toastify';
import Select from 'react-select';
import locationData from '../../data/locations.json';

const modalStyles = `
    .custom-proposal-modal {
        max-width: 95% !important;
        width: 95% !important;
    }
    .custom-proposal-modal .modal-content {
        min-height: 85vh !important;
        height: 85vh !important;
        display: flex !important;
        flex-direction: column !important;
    }
    .custom-proposal-modal .modal-body {
        flex: 1 !important;
        overflow-y: auto !important;
    }
`;

export default function TuitionProposalModal({ show, onHide, tuition }) {
    const [activeTab, setActiveTab] = useState('send');
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [teachers, setTeachers] = useState([]);
    const [selectedTeacherIds, setSelectedTeacherIds] = useState([]);
    const [smsHistory, setSmsHistory] = useState([]);

    // Filters
    const [statusFilter, setStatusFilter] = useState(['verified']);
    const [genderFilter, setGenderFilter] = useState('');
    const [areaFilter, setAreaFilter] = useState([]);
    const [unicodeFilter, setUnicodeFilter] = useState([]);
    const [deptFilter, setDeptFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // SMS Template
    const [template, setTemplate] = useState('');

    const city = tuition?.city?.toLowerCase() || 'chittagong';
    const areaList = locationData.areaOptions[city] || [];
    const selectAreaOptions = areaList.map(area => ({ value: area, label: area }));

    const pageSize = 50;
    const totalPages = Math.ceil(teachers.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedTeachers = teachers.slice(startIndex, startIndex + pageSize);

    // Set initial filters and template when tuition changes
    useEffect(() => {
        if (tuition) {
            // Determine default gender filter based on tuition's wantedTeacher field
            const wanted = tuition.wantedTeacher ? tuition.wantedTeacher.toLowerCase() : '';
            let initialGender = '';
            if (wanted.includes('female')) {
                initialGender = 'female';
            } else if (wanted.includes('male')) {
                initialGender = 'male';
            }
            setGenderFilter(initialGender);
            setUnicodeFilter([]);
            setStatusFilter(['verified']);
            setDeptFilter('');

            // Set default template pre-populated with actual values
            const code = tuition.tuitionCode || '';
            const cls = tuition.class || '';
            const subj = tuition.subject || '';
            const area = tuition.area || '';
            const salary = tuition.salary || '';

            const defaultTemplate = `[Tuition Alert]\nCode: ${code}\nClass: ${cls} (${subj})\nArea: ${area}\nSalary: ${salary}\nApply: tuitionsebaforum.com\nWhatsApp: 01571305804`;
            setTemplate(defaultTemplate);

            const initialAreas = tuition.area ? tuition.area.split(',').map(a => a.trim()).filter(Boolean) : [];
            setAreaFilter(initialAreas);

            // Fetch matched teachers
            fetchMatchedTeachers(['verified'], initialGender, initialAreas, [], '');
            // Fetch SMS history
            fetchSmsHistory();
        }
    }, [tuition]);

    const handleFilterChange = (status, gender, area, unicode, dept) => {
        setStatusFilter(status);
        setGenderFilter(gender);
        setAreaFilter(area);
        setUnicodeFilter(unicode);
        setDeptFilter(dept);
    };

    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'pending', label: 'Pending' },
        { value: 'under review', label: 'Under Review' },
        { value: 'pending payment', label: 'Pending Payment' },
        { value: 'Must Advance', label: 'Must Advance' },
        { value: 'After Confirmation', label: 'After Confirmation' },
        { value: 'After Salary', label: 'After Salary' },
        { value: '30% Advance', label: '30% Advance' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'Free - Must Advance', label: 'Free - Must Advance' },
        { value: 'verified', label: 'Verified' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'Not interested', label: 'Not interested' }
    ];

    const unicodeOptions = [
        { value: 'all', label: 'All Unicode' },
        ...['CMC', 'CUET', 'CU Science', 'CU Arts', 'CU Commerce', 'CVASU', 'Private Science', 'Private Commerce', 'Private Arts', 'National Science', 'National Arts', 'National Commerce', 'Arabic', 'NC English', 'BC English', 'Special'].map(opt => ({ value: opt, label: opt }))
    ];

    const areaOptions = [
        { value: 'all', label: 'All Areas' },
        ...selectAreaOptions
    ];

    const handleStatusFilterChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(o => o.value) : [];
        let finalValues = values;
        if (values.includes('all')) {
            if (values[values.length - 1] === 'all') {
                finalValues = ['all'];
            } else {
                finalValues = values.filter(v => v !== 'all');
            }
        }
        handleFilterChange(finalValues, genderFilter, areaFilter, unicodeFilter, deptFilter);
    };

    const handleUnicodeFilterChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(o => o.value) : [];
        let finalValues = values;
        if (values.includes('all')) {
            if (values[values.length - 1] === 'all') {
                finalValues = ['all'];
            } else {
                finalValues = values.filter(v => v !== 'all');
            }
        }
        handleFilterChange(statusFilter, genderFilter, areaFilter, finalValues, deptFilter);
    };

    const handleAreaFilterChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(o => o.value) : [];
        let finalValues = values;
        if (values.includes('all')) {
            if (values[values.length - 1] === 'all') {
                finalValues = ['all'];
            } else {
                finalValues = values.filter(v => v !== 'all');
            }
        }
        handleFilterChange(statusFilter, genderFilter, finalValues, unicodeFilter, deptFilter);
    };

    const handleApplyFilters = () => {
        fetchMatchedTeachers(statusFilter, genderFilter, areaFilter, unicodeFilter, deptFilter);
    };

    const fetchMatchedTeachers = async (statusVal, gender, areaVal, unicodeVal, deptVal) => {
        if (!tuition?._id) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = {};
            params.status = (statusVal && statusVal.length > 0 && !statusVal.includes('all')) ? statusVal.join(',') : 'all';
            if (gender) params.gender = gender;
            params.area = (areaVal && areaVal.length > 0 && !areaVal.includes('all')) ? areaVal.join(',') : 'all';
            params.unicode = (unicodeVal && unicodeVal.length > 0 && !unicodeVal.includes('all')) ? unicodeVal.join(',') : 'all';
            if (deptVal) params.department = deptVal;

            const response = await axios.get(`https://tuition-seba-backend-1-lpfs.onrender.com/api/tuition/${tuition._id}/match-teachers`, {
                headers: { Authorization: token },
                params
            });
            if (response.data?.success) {
                const fetchedTeachers = response.data.teachers || [];
                setTeachers(fetchedTeachers);
                setSelectedTeacherIds([]); // No teachers pre-selected initially
                setCurrentPage(1); // Reset page to 1 on fresh match
            } else {
                toast.error('Failed to load matching teachers');
            }
        } catch (error) {
            console.error('Error matching teachers:', error);
            toast.error('Error loading matched teachers');
        } finally {
            setLoading(false);
        }
    };

    const fetchSmsHistory = async () => {
        if (!tuition?._id) return;
        setHistoryLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://tuition-seba-backend-1-lpfs.onrender.com/api/tuition/${tuition._id}/sms-history`, {
                headers: { Authorization: token }
            });
            if (response.data?.success) {
                setSmsHistory(response.data.logs || []);
            }
        } catch (error) {
            console.error('Error fetching SMS history:', error);
        } finally {
            setHistoryLoading(false);
        }
    };



    const isValidBDPhoneNumber = (phone) => {
        if (!phone) return false;
        const cleanPhone = phone.trim();
        return /^(?:\+8801|8801|01)\d{9}$/.test(cleanPhone);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const invalidCount = teachers.filter(t => !isValidBDPhoneNumber(t.phone)).length;
            if (invalidCount > 0) {
                toast.warning(`Filtered out ${invalidCount} teachers with invalid phone number formats.`);
            }

            const validTeachers = teachers.filter(t => isValidBDPhoneNumber(t.phone));
            const appliedTeachersCount = validTeachers.filter(t => t.hasApplied).length;
            
            if (appliedTeachersCount > 0) {
                const proceed = window.confirm(`Warning: ${appliedTeachersCount} of the matched teachers have already applied for this tuition. Do you want to select them as well?`);
                if (proceed) {
                    setSelectedTeacherIds(validTeachers.map(t => t._id));
                } else {
                    setSelectedTeacherIds(validTeachers.filter(t => !t.hasApplied).map(t => t._id));
                }
            } else {
                setSelectedTeacherIds(validTeachers.map(t => t._id));
            }
        } else {
            setSelectedTeacherIds([]);
        }
    };

    const handleSelectTeacher = (id) => {
        const isCurrentlySelected = selectedTeacherIds.includes(id);
        
        if (!isCurrentlySelected) {
            const teacher = teachers.find(t => t._id === id);
            if (teacher) {
                if (!isValidBDPhoneNumber(teacher.phone)) {
                    toast.error(`Invalid Phone Number format: "${teacher.phone || 'empty'}" for teacher ${teacher.name}. Phone number must be 11 digits (starting with 01) or 13/14 digits with 88 prefix.`);
                    return;
                }
                if (teacher.hasApplied) {
                    const proceed = window.confirm(`Warning: Teacher ${teacher.name} (Code: ${teacher.premiumCode}) has already applied for this tuition. Are you sure you want to select them?`);
                    if (!proceed) return;
                }
            }
        }

        setSelectedTeacherIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const calculateSmsParts = (text) => {
        const isUnicode = /[^\u0000-\u007F]/.test(text);
        const charCount = text.length;
        let limit = 160;
        let concatLimit = 153;

        if (isUnicode) {
            limit = 70;
            concatLimit = 67;
        }

        if (charCount <= limit) {
            return { chars: charCount, parts: 1, limit, isUnicode };
        } else {
            const parts = Math.ceil(charCount / concatLimit);
            return { chars: charCount, parts, limit: concatLimit, isUnicode };
        }
    };

    const { chars, parts, isUnicode } = calculateSmsParts(template);

    const handleOpenConfirmation = () => {
        if (selectedTeacherIds.length === 0) {
            toast.warning('Please select at least one teacher');
            return;
        }
        if (!template.trim()) {
            toast.warning('SMS message cannot be empty');
            return;
        }
        if (template.length > 160) {
            toast.error('Cannot send: SMS messages cannot exceed the 160-character limit.');
            return;
        }

        const selectedTeachers = teachers.filter(t => selectedTeacherIds.includes(t._id));
        const invalidTeachers = selectedTeachers.filter(t => !isValidBDPhoneNumber(t.phone));
        if (invalidTeachers.length > 0) {
            const invalidNames = invalidTeachers.map(t => `${t.name} (${t.phone || 'empty'})`).join(', ');
            toast.error(`Cannot send: The following selected teachers have invalid phone numbers: ${invalidNames}. Please deselect them before sending.`);
            return;
        }

        setShowConfirmModal(true);
    };

    const handleSendProposals = async () => {
        setSending(true);
        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username') || 'Admin';
            const selectedTeachers = teachers.filter(t => selectedTeacherIds.includes(t._id));

            // Construct messages for /api/sms/send-dynamic
            const messages = selectedTeachers.map(teacher => {
                return {
                    msisdn: teacher.phone,
                    smstext: template,
                    tuitionCode: tuition.tuitionCode,
                    premiumCode: teacher.premiumCode || '',
                    category: 'Proposal'
                };
            });

            const response = await axios.post('https://tuition-seba-backend-1-lpfs.onrender.com/api/sms/send-dynamic', 
                { messages, category: 'Proposal' },
                { headers: { Authorization: token, 'x-user-name': username } }
            );

            if (response.data?.success) {
                toast.success(`Successfully queued SMS proposals for ${selectedTeachers.length} teachers!`);
                setShowConfirmModal(false);
                fetchSmsHistory();
                setActiveTab('history');
            } else {
                toast.error(response.data?.statusMessage || 'Failed to send proposals');
            }
        } catch (error) {
            console.error('Error sending proposals:', error);
            toast.error(error.response?.data?.statusMessage || 'Error sending proposals');
        } finally {
            setSending(false);
        }
    };



    return (
        <>
            <style>{modalStyles}</style>
            <Modal show={show} onHide={onHide} dialogClassName="custom-proposal-modal" centered backdrop="static">
            <Modal.Header closeButton style={{ backgroundColor: '#0d6efd', color: 'white' }}>
                <Modal.Title className="fw-bold">
                    ✉️ Match & Send Proposals {tuition && `- Code: ${tuition.tuitionCode}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light">
                {tuition && (
                    <div className="bg-white p-3 rounded mb-3 border">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2 pb-2 border-bottom">
                            <div><strong>Class:</strong> {tuition.class}</div>
                            <div><strong>Subjects:</strong> {tuition.subject}</div>
                            <div><strong>Salary:</strong> {tuition.salary}</div>
                            <div><strong>Area:</strong> <Badge bg="primary">{tuition.area}</Badge></div>
                            <div><strong>Wanted:</strong> <Badge bg="info">{tuition.wantedTeacher || 'Any'}</Badge></div>
                        </div>
                        {tuition.note && (
                            <div className="small text-secondary">
                                <strong>Guardian Demand:</strong> {tuition.note}
                            </div>
                        )}
                    </div>
                )}

                <Tab.Container activeKey={activeTab} onSelect={k => {
                    setActiveTab(k);
                    if (k === 'history') fetchSmsHistory();
                }}>
                    <Nav variant="tabs" className="mb-3">
                        <Nav.Item>
                            <Nav.Link eventKey="send" className="fw-bold">Send Proposals</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="history" className="fw-bold">SMS History ({smsHistory.length})</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Tab.Content>
                        <Tab.Pane eventKey="send">
                            <Row>
                                {/* Left Side: Filters & Teachers List */}
                                <Col lg={9}>
                                    <div className="bg-white p-3 rounded border mb-3">
                                        <h6 className="fw-bold border-bottom pb-2 mb-3">Matched Teachers ({teachers.length})</h6>
                                        
                                        <Row className="gy-2 mb-3 align-items-end">
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label className="small fw-semibold">Teacher Status</Form.Label>
                                                    <Select 
                                                        isMulti
                                                        options={statusOptions}
                                                        value={statusOptions.filter(opt => statusFilter.includes(opt.value))}
                                                        onChange={handleStatusFilterChange}
                                                        placeholder="Status..."
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
                                                        menuPortalTarget={document.body}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={1}>
                                                <Form.Group>
                                                    <Form.Label className="small fw-semibold">Gender</Form.Label>
                                                    <Form.Select 
                                                        value={genderFilter} 
                                                        onChange={(e) => handleFilterChange(statusFilter, e.target.value, areaFilter, unicodeFilter, deptFilter)}
                                                    >
                                                        <option value="">All Genders</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label className="small fw-semibold">UniCode</Form.Label>
                                                    <Select 
                                                        isMulti
                                                        options={unicodeOptions}
                                                        value={unicodeOptions.filter(opt => unicodeFilter.includes(opt.value))}
                                                        onChange={handleUnicodeFilterChange}
                                                        placeholder="Unicode..."
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
                                                        menuPortalTarget={document.body}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label className="small fw-semibold">Department</Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        value={deptFilter} 
                                                        onChange={(e) => handleFilterChange(statusFilter, genderFilter, areaFilter, unicodeFilter, e.target.value)}
                                                        placeholder="Search Dept..."
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={3}>
                                                <Form.Group>
                                                    <Form.Label className="small fw-semibold">Area Match</Form.Label>
                                                    <Select 
                                                        isMulti
                                                        options={areaOptions}
                                                        value={areaOptions.filter(opt => areaFilter.includes(opt.value))}
                                                        onChange={handleAreaFilterChange}
                                                        placeholder="Select Area..."
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
                                                        menuPortalTarget={document.body}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Button 
                                                        variant="primary" 
                                                        className="w-100 fw-bold d-flex align-items-center justify-content-center"
                                                        onClick={handleApplyFilters}
                                                        style={{ height: '38px' }}
                                                    >
                                                        🔍 Apply Filters
                                                    </Button>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {loading ? (
                                            <div className="text-center py-5">
                                                <Spinner animation="border" variant="primary" />
                                                <div className="mt-2 text-muted">Searching matched teachers...</div>
                                            </div>
                                        ) : teachers.length === 0 ? (
                                            <div className="text-center py-5 text-muted">
                                                No teachers matched the area "{tuition?.area}" and selected filters.
                                            </div>
                                        ) : (
                                            <div style={{ maxHeight: '58vh', overflowY: 'auto' }}>
                                                <Table striped bordered hover size="sm" responsive className="align-middle">
                                                    <thead className="table-dark" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                        <tr>
                                                            <th className="text-center" style={{ width: '40px' }}>
                                                                <Form.Check 
                                                                    type="checkbox"
                                                                    checked={teachers.length > 0 && selectedTeacherIds.length === teachers.filter(t => !t.hasApplied).length}
                                                                    onChange={handleSelectAll}
                                                                />
                                                            </th>
                                                            <th>Premium Code</th>
                                                            <th>Unicode</th>
                                                            <th>Name</th>
                                                            <th>Phone</th>
                                                            <th>Gender</th>
                                                            <th>Status</th>
                                                            <th>Applied?</th>
                                                            <th>Current Area</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {paginatedTeachers.map(t => (
                                                            <tr key={t._id} style={t.hasApplied ? { backgroundColor: '#f3f4f6', color: '#6c757d' } : undefined}>
                                                                <td className="text-center">
                                                                    <Form.Check 
                                                                        type="checkbox"
                                                                        checked={selectedTeacherIds.includes(t._id)}
                                                                        onChange={() => handleSelectTeacher(t._id)}
                                                                    />
                                                                </td>
                                                                <td className="fw-semibold text-primary">{t.premiumCode || '-'}</td>
                                                                <td className="fw-semibold text-secondary">{t.uniCode || '-'}</td>
                                                                <td>{t.name}</td>
                                                                <td>{t.phone}</td>
                                                                <td>{t.gender}</td>
                                                                <td>
                                                                    <Badge bg={t.status === 'verified' ? 'success' : 'secondary'}>
                                                                        {t.status}
                                                                    </Badge>
                                                                </td>
                                                                <td>
                                                                    {t.hasApplied ? (
                                                                        <Badge bg="info">
                                                                            Applied ({t.applicationStatus || 'pending'})
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge bg="secondary">No</Badge>
                                                                    )}
                                                                </td>
                                                                <td>{t.currentArea || '-'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                
                                                {totalPages > 1 && (
                                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                                        <div className="text-muted small">
                                                            Showing {startIndex + 1} - {Math.min(startIndex + pageSize, teachers.length)} of {teachers.length} teachers
                                                        </div>
                                                        <div className="d-flex gap-1 align-items-center">
                                                            <Button 
                                                                variant="outline-primary" 
                                                                size="sm" 
                                                                disabled={currentPage === 1}
                                                                onClick={() => setCurrentPage(p => p - 1)}
                                                            >
                                                                Previous
                                                            </Button>
                                                            <span className="small fw-bold px-2">
                                                                Page {currentPage} of {totalPages}
                                                            </span>
                                                            <Button 
                                                                variant="outline-primary" 
                                                                size="sm" 
                                                                disabled={currentPage === totalPages}
                                                                onClick={() => setCurrentPage(p => p + 1)}
                                                            >
                                                                Next
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                {/* Right Side: SMS Template and Preview */}
                                <Col lg={3}>
                                    <div className="bg-white p-3 rounded border mb-3">
                                        <h6 className="fw-bold border-bottom pb-2 mb-3">SMS Message Template</h6>
                                        <Form.Group className="mb-2">
                                            <Form.Control 
                                                as="textarea" 
                                                rows={6}
                                                value={template}
                                                onChange={e => setTemplate(e.target.value)}
                                                placeholder="Write SMS message here..."
                                                style={{ fontSize: '0.9rem' }}
                                            />
                                        </Form.Group>

                                        <div className="p-2 bg-light rounded border mb-3" style={{ fontSize: '0.8rem' }}>
                                            <div className="d-flex justify-content-between text-muted">
                                                <span>Characters: <strong style={chars > 160 ? { color: '#dc3545' } : undefined}>{chars} / 160</strong></span>
                                                <span>SMS Parts: <strong>{parts}</strong></span>
                                                <span>Encoding: <strong>{isUnicode ? 'Unicode' : 'GSM/English'}</strong></span>
                                            </div>
                                            {chars > 160 && (
                                                <div className="text-danger small mt-1 fw-bold text-center">
                                                    ⚠️ Exceeds 160-character limit!
                                                </div>
                                            )}
                                        </div>

                                        <Button 
                                            variant="primary" 
                                            className="w-100 fw-bold" 
                                            onClick={handleOpenConfirmation}
                                            disabled={selectedTeacherIds.length === 0 || chars > 160}
                                        >
                                            Send Proposals ({selectedTeacherIds.length})
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Tab.Pane>

                        <Tab.Pane eventKey="history">
                            <div className="bg-white p-3 rounded border">
                                <h6 className="fw-bold border-bottom pb-2 mb-3">Previous Proposals History</h6>
                                {historyLoading ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <div className="mt-2 text-muted">Loading SMS logs...</div>
                                    </div>
                                ) : smsHistory.length === 0 ? (
                                    <div className="text-center py-5 text-muted">
                                        No proposals have been sent for this tuition yet.
                                    </div>
                                ) : (
                                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                        <Table striped bordered hover size="sm" responsive className="align-middle">
                                            <thead className="table-dark" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                <tr>
                                                    <th>Recipient</th>
                                                    <th>Premium Code</th>
                                                    <th>Message</th>
                                                    <th>Date/Time</th>
                                                    <th>Sender</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {smsHistory.map(log => (
                                                    <tr key={log._id}>
                                                        <td>{log.phone}</td>
                                                        <td className="fw-bold text-info">{log.premiumCode || '-'}</td>
                                                        <td className="small" style={{ maxWidth: '300px', wordBreak: 'break-word' }}>{log.message}</td>
                                                        <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                                            {new Date(log.createdAt).toLocaleString()}
                                                        </td>
                                                        <td>{log.sentBy}</td>
                                                        <td>
                                                            <Badge bg={log.status === 'success' ? 'success' : 'danger'}>
                                                                {log.status}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={sending}>Close</Button>
            </Modal.Footer>
        </Modal>

        {/* Confirmation Modal */}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} size="lg" centered backdrop="static" style={{ zIndex: 1055 }}>
            <Modal.Header closeButton className="bg-warning text-dark">
                <Modal.Title className="fw-bold">⚠️ Confirm Sending Proposals</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light">
                {/* Warning if already applied */}
                {teachers.filter(t => selectedTeacherIds.includes(t._id) && t.hasApplied).length > 0 && (
                    <div className="alert alert-danger fw-semibold py-2 px-3 mb-3" style={{ fontSize: '0.9rem' }}>
                        ⚠️ Warning: {teachers.filter(t => selectedTeacherIds.includes(t._id) && t.hasApplied).length} of the selected teachers have already applied for this tuition.
                    </div>
                )}
                
                <h6 className="fw-bold mb-2">Message Body Preview:</h6>
                <div className="p-3 border rounded bg-white mb-3" style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                    {template}
                </div>

                <h6 className="fw-bold mb-2">Selected Recipients ({selectedTeacherIds.length}):</h6>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="border rounded bg-white p-2">
                    <Table striped hover size="sm" className="mb-0 align-middle" style={{ fontSize: '0.85rem' }}>
                        <thead>
                            <tr>
                                <th>Premium Code</th>
                                <th>Unicode</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Applied?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.filter(t => selectedTeacherIds.includes(t._id)).map(t => (
                                <tr key={t._id}>
                                    <td>{t.premiumCode || '-'}</td>
                                    <td>{t.uniCode || '-'}</td>
                                    <td>{t.name}</td>
                                    <td>{t.phone}</td>
                                    <td>{t.hasApplied ? <Badge bg="danger">Yes</Badge> : <Badge bg="secondary">No</Badge>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowConfirmModal(false)} disabled={sending}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSendProposals} disabled={sending}>
                    {sending ? (
                        <>
                            <Spinner animation="grow" size="sm" className="me-2" />
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
}
