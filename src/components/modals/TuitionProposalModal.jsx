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

    const [teachers, setTeachers] = useState([]);
    const [selectedTeacherIds, setSelectedTeacherIds] = useState([]);
    const [smsHistory, setSmsHistory] = useState([]);

    // Filters
    const [statusFilter, setStatusFilter] = useState('verified');
    const [genderFilter, setGenderFilter] = useState('');
    const [areaFilter, setAreaFilter] = useState('');

    // SMS Template
    const [template, setTemplate] = useState('');

    const city = tuition?.city?.toLowerCase() || 'chittagong';
    const areaList = locationData.areaOptions[city] || [];
    const selectAreaOptions = areaList.map(area => ({ value: area, label: area }));
    const currentAreaOption = selectAreaOptions.find(opt => opt.value === areaFilter) || (areaFilter ? { value: areaFilter, label: areaFilter } : null);

    // Set initial filters and template when tuition changes
    useEffect(() => {
        if (tuition) {
            // Determine default gender filter based on tuition's wantedTeacher field
            const wanted = tuition.wantedTeacher ? tuition.wantedTeacher.toLowerCase() : '';
            if (wanted.includes('female')) {
                setGenderFilter('Female');
            } else if (wanted.includes('male')) {
                setGenderFilter('Male');
            } else {
                setGenderFilter('');
            }

            // Set default template pre-populated with actual values
            const code = tuition.tuitionCode || '';
            const cls = tuition.class || '';
            const subj = tuition.subject || '';
            const area = tuition.area || '';
            const salary = tuition.salary || '';

            const defaultTemplate = `[Tuition Alert]\nCode: ${code}\nClass: ${cls} (${subj})\nArea: ${area}\nSalary: ${salary}\nApply: tuitionsebaforum.com\nWhatsApp: 01571305804`;
            setTemplate(defaultTemplate);

            const initialArea = tuition.area || '';
            setAreaFilter(initialArea);

            // Fetch matched teachers
            fetchMatchedTeachers('verified', wanted.includes('female') ? 'Female' : wanted.includes('male') ? 'Male' : '', initialArea);
            // Fetch SMS history
            fetchSmsHistory();
        }
    }, [tuition]);

    const handleFilterChange = (status, gender, area) => {
        setStatusFilter(status);
        setGenderFilter(gender);
        setAreaFilter(area);
    };

    const handleApplyFilters = () => {
        fetchMatchedTeachers(statusFilter, genderFilter, areaFilter);
    };

    const fetchMatchedTeachers = async (status, gender, areaVal) => {
        if (!tuition?._id) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = {};
            if (status) params.status = status;
            if (gender) params.gender = gender;
            if (areaVal !== undefined) params.area = areaVal;

            const response = await axios.get(`https://tuition-seba-backend-1-lpfs.onrender.com/api/tuition/${tuition._id}/match-teachers`, {
                headers: { Authorization: token },
                params
            });
            if (response.data?.success) {
                const fetchedTeachers = response.data.teachers || [];
                setTeachers(fetchedTeachers);
                // Pre-select only those who have not applied yet
                setSelectedTeacherIds(fetchedTeachers.filter(t => !t.hasApplied).map(t => t._id));
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



    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const appliedTeachersCount = teachers.filter(t => t.hasApplied).length;
            if (appliedTeachersCount > 0) {
                const proceed = window.confirm(`Warning: ${appliedTeachersCount} of the matched teachers have already applied for this tuition. Do you want to select them as well?`);
                if (proceed) {
                    setSelectedTeacherIds(teachers.map(t => t._id));
                } else {
                    setSelectedTeacherIds(teachers.filter(t => !t.hasApplied).map(t => t._id));
                }
            } else {
                setSelectedTeacherIds(teachers.map(t => t._id));
            }
        } else {
            setSelectedTeacherIds([]);
        }
    };

    const handleSelectTeacher = (id) => {
        const isCurrentlySelected = selectedTeacherIds.includes(id);
        
        if (!isCurrentlySelected) {
            const teacher = teachers.find(t => t._id === id);
            if (teacher && teacher.hasApplied) {
                const proceed = window.confirm(`Warning: Teacher ${teacher.name} (Code: ${teacher.premiumCode}) has already applied for this tuition. Are you sure you want to select them?`);
                if (!proceed) return;
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

    const handleSendProposals = async () => {
        if (selectedTeacherIds.length === 0) {
            toast.warning('Please select at least one teacher');
            return;
        }
        if (!template.trim()) {
            toast.warning('SMS message cannot be empty');
            return;
        }

        const selectedTeachers = teachers.filter(t => selectedTeacherIds.includes(t._id));

        if (template.length > 160) {
            toast.error('Cannot send: SMS messages cannot exceed the 160-character limit.');
            return;
        }

        const appliedSelectedCount = selectedTeachers.filter(t => t.hasApplied).length;
        if (appliedSelectedCount > 0) {
            const proceedApplied = window.confirm(`Warning: ${appliedSelectedCount} of the selected teachers have already applied for this tuition. Are you sure you want to send proposals to them?`);
            if (!proceedApplied) return;
        }

        const confirmSend = window.confirm(`Are you sure you want to send proposals to ${selectedTeachers.length} teachers?`);
        if (!confirmSend) return;

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username') || 'Admin';

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
                    <div className="bg-white p-3 rounded mb-3 border d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div><strong>Class:</strong> {tuition.class}</div>
                        <div><strong>Subjects:</strong> {tuition.subject}</div>
                        <div><strong>Salary:</strong> {tuition.salary}</div>
                        <div><strong>Area:</strong> <Badge bg="primary">{tuition.area}</Badge></div>
                        <div><strong>Wanted:</strong> <Badge bg="info">{tuition.wantedTeacher || 'Any'}</Badge></div>
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
                                <Col lg={8}>
                                    <div className="bg-white p-3 rounded border mb-3">
                                        <h6 className="fw-bold border-bottom pb-2 mb-3">Matched Teachers ({teachers.length})</h6>
                                        
                                        <Row className="gy-2 mb-3 align-items-end">
                                            <Col md={3}>
                                                <Form.Group>
                                                    <Form.Label className="small fw-semibold">Teacher Status</Form.Label>
                                                    <Form.Select 
                                                        value={statusFilter} 
                                                        onChange={(e) => handleFilterChange(e.target.value, genderFilter, areaFilter)}
                                                    >
                                                        <option value="">All Statuses</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="under review">Under Review</option>
                                                        <option value="pending payment">Pending Payment</option>
                                                        <option value="Must Advance">Must Advance</option>
                                                        <option value="After Confirmation">After Confirmation</option>
                                                        <option value="After Salary">After Salary</option>
                                                        <option value="30% Advance">30% Advance</option>
                                                        <option value="rejected">Rejected</option>
                                                        <option value="Free - Must Advance">Free - Must Advance</option>
                                                        <option value="verified">Verified</option>
                                                        <option value="suspended">Suspended</option>
                                                        <option value="Not interested">Not interested</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={3}>
                                                <Form.Group>
                                                    <Form.Label className="small fw-semibold">Gender</Form.Label>
                                                    <Form.Select 
                                                        value={genderFilter} 
                                                        onChange={(e) => handleFilterChange(statusFilter, e.target.value, areaFilter)}
                                                    >
                                                        <option value="">All Genders</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={3}>
                                                <Form.Group>
                                                    <Form.Label className="small fw-semibold">Area Match</Form.Label>
                                                    <Select 
                                                        options={selectAreaOptions}
                                                        value={currentAreaOption}
                                                        onChange={(option) => handleFilterChange(statusFilter, genderFilter, option ? option.value : '')}
                                                        isClearable
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
                                            <Col md={3}>
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
                                                        {teachers.map(t => (
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
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                {/* Right Side: SMS Template and Preview */}
                                <Col lg={4}>
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
                                            onClick={handleSendProposals}
                                            disabled={sending || selectedTeacherIds.length === 0 || chars > 160}
                                        >
                                            {sending ? (
                                                <>
                                                    <Spinner animation="grow" size="sm" className="me-2" />
                                                    Sending ({selectedTeacherIds.length})...
                                                </>
                                            ) : (
                                                `Send Proposals (${selectedTeacherIds.length})`
                                            )}
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
        </>
    );
}
