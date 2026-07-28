import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Row, Col, Card, Spinner, Modal } from 'react-bootstrap';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import { toast } from 'react-toastify';

const SavedGuardiansTab = () => {
    const [existingGuardians, setExistingGuardians] = useState([]);
    const [existingLoading, setExistingLoading] = useState(false);
    const [existingPage, setExistingPage] = useState(1);
    const [existingTotalPages, setExistingTotalPages] = useState(1);
    const [existingTotalRecords, setExistingTotalRecords] = useState(0);

    const [existingSearchPhone, setExistingSearchPhone] = useState('');
    const [existingSearchArea, setExistingSearchArea] = useState('');
    const [existingSearchSubject, setExistingSearchSubject] = useState('');
    const [existingSearchClass, setExistingSearchClass] = useState('');
    const [existingSearchStatus, setExistingSearchStatus] = useState('');

    const [existingAppliedPhone, setExistingAppliedPhone] = useState('');
    const [existingAppliedArea, setExistingAppliedArea] = useState('');
    const [existingAppliedSubject, setExistingAppliedSubject] = useState('');
    const [existingAppliedClass, setExistingAppliedClass] = useState('');
    const [existingAppliedStatus, setExistingAppliedStatus] = useState('');

    const [selectedTuition, setSelectedTuition] = useState(null);
    const [tuitionModalLoading, setTuitionModalLoading] = useState(false);
    const [showTuitionModal, setShowTuitionModal] = useState(false);

    const handleShowTuitionDetails = async (code) => {
        setTuitionModalLoading(true);
        setShowTuitionModal(true);
        try {
            const response = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/guardianApply/tuition-details/${code}`);
            setSelectedTuition(response.data);
        } catch (err) {
            console.error("Error fetching tuition details:", err);
            toast.error("Failed to load tuition details.");
            setShowTuitionModal(false);
        } finally {
            setTuitionModalLoading(false);
        }
    };

    const escapeRegex = (str) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const fetchExistingGuardians = async () => {
        setExistingLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/guardianApply/existing-guardians', {
                params: {
                    page: existingPage,
                    phone: existingAppliedPhone,
                    area: existingAppliedArea,
                    subject: existingAppliedSubject,
                    studentClass: existingAppliedClass,
                    statusFilter: existingAppliedStatus,
                    limit: 50
                }
            });
            setExistingGuardians(response.data.data);
            setExistingTotalPages(response.data.totalPages);
            setExistingTotalRecords(response.data.totalRecords);
        } catch (err) {
            console.error('Error fetching existing guardians:', err);
            toast.error("Failed to load saved guardians.");
        }
        setExistingLoading(false);
    };

    useEffect(() => {
        fetchExistingGuardians();
    }, [existingPage, existingAppliedPhone, existingAppliedArea, existingAppliedSubject, existingAppliedClass, existingAppliedStatus]);

    const handleExistingSearch = () => {
        setExistingAppliedPhone(existingSearchPhone);
        setExistingAppliedArea(existingSearchArea);
        setExistingAppliedSubject(existingSearchSubject);
        setExistingAppliedClass(existingSearchClass);
        setExistingAppliedStatus(existingSearchStatus);
        setExistingPage(1);
    };

    const handleExistingReset = () => {
        setExistingSearchPhone('');
        setExistingSearchArea('');
        setExistingSearchSubject('');
        setExistingSearchClass('');
        setExistingSearchStatus('');
        setExistingAppliedPhone('');
        setExistingAppliedArea('');
        setExistingAppliedSubject('');
        setExistingAppliedClass('');
        setExistingAppliedStatus('');
        setExistingPage(1);
    };

    const getRowClass = (guardian) => {
        if (guardian.isSpam) return 'row-spam-bg';
        if (guardian.isBestGuardian) return 'row-best-bg';
        return '';
    };

    return (
        <>
            <style>{`
                tr.row-spam-bg td {
                    background-color: #ffebee !important;
                    color: #c62828 !important;
                }
                tr.row-best-bg td {
                    background-color: #e8f5e9 !important;
                    color: #2e7d32 !important;
                }
            `}</style>
            {/* Search bar for Saved Guardians */}
            <Row className="mt-2 mb-3 gy-2">
                <Col md={3}>
                    <Form.Label className="fw-bold">Search by Phone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="e.g. 017xxxxxxxx"
                        value={existingSearchPhone}
                        onChange={(e) => setExistingSearchPhone(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleExistingSearch()}
                    />
                </Col>

                <Col md={3}>
                    <Form.Label className="fw-bold">Search by Area</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="e.g. Chittagong"
                        value={existingSearchArea}
                        onChange={(e) => setExistingSearchArea(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleExistingSearch()}
                    />
                </Col>

                <Col md={3}>
                    <Form.Label className="fw-bold">Status Filter</Form.Label>
                    <Form.Select
                        value={existingSearchStatus}
                        onChange={(e) => setExistingSearchStatus(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="spam">Spam Guardian</option>
                        <option value="best">Best Guardian</option>
                    </Form.Select>
                </Col>

                <Col md={3} className="d-flex align-items-end gap-2">
                    <Button
                        variant="success"
                        onClick={handleExistingSearch}
                        className="d-flex align-items-center justify-content-center gap-1 w-50"
                        disabled={existingLoading}
                        style={{ height: '38px' }}
                    >
                        {existingLoading ? <Spinner animation="border" size="sm" /> : <FaSearch />} Search
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleExistingReset}
                        className="d-flex align-items-center justify-content-center w-50"
                        style={{ height: '38px' }}
                    >
                        Reset
                    </Button>
                </Col>
            </Row>

            {/* Saved Guardians List Table */}
            <Card className="mt-4">
                <Card.Body>
                    <Card.Title className="mb-3">Saved Guardian List ({existingTotalRecords})</Card.Title>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <Table striped bordered hover responsive="lg">
                            <thead className="table-primary" style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                                <tr>
                                    <th>SL</th>
                                    <th>Guardian Number</th>
                                    <th>Tuition Codes</th>
                                    <th>Area</th>
                                    <th>Behavior Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {existingLoading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                                <Spinner animation="border" variant="primary" size="lg" />
                                            </div>
                                        </td>
                                    </tr>
                                ) : existingGuardians.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">No records found.</td>
                                    </tr>
                                ) : (
                                    existingGuardians.map((guardian, index) => (
                                        <tr key={index} className={getRowClass(guardian)}>
                                            <td>{(existingPage - 1) * 50 + index + 1}</td>
                                            <td>{guardian.guardianNumber || '—'}</td>
                                            <td>
                                                {guardian.tuitionCodes && guardian.tuitionCodes.length > 0 ? (
                                                    guardian.tuitionCodes.map((code, idx) => (
                                                        <span 
                                                            key={idx} 
                                                            className="badge bg-secondary me-1"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleShowTuitionDetails(code)}
                                                        >
                                                            {code}
                                                        </span>
                                                    ))
                                                ) : '—'}
                                            </td>
                                            <td>
                                                {guardian.areas && guardian.areas.length > 0 ? (
                                                    guardian.areas.filter(a => a).map((area, idx) => (
                                                        <span key={idx} className="badge bg-info text-dark me-1">
                                                            {area}
                                                        </span>
                                                    ))
                                                ) : '—'}
                                            </td>
                                            <td>{guardian.guardianBehavior || '—'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
                        <Button
                            variant="outline-primary"
                            className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                            disabled={existingPage === 1}
                            onClick={() => setExistingPage(prev => prev - 1)}
                        >
                            <FaChevronLeft /> Previous
                        </Button>

                        <span className="fw-semibold text-primary-emphasis fs-5">
                            Page {existingPage} of {existingTotalPages}
                        </span>

                        <Button
                            variant="outline-primary"
                            className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                            disabled={existingPage === existingTotalPages}
                            onClick={() => setExistingPage(prev => prev + 1)}
                        >
                            Next <FaChevronRight />
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Tuition Details Modal */}
            <Modal show={showTuitionModal} onHide={() => setShowTuitionModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title className="fw-bold">
                        Tuition Details: {selectedTuition ? selectedTuition.tuitionCode : ''}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-light">
                    {tuitionModalLoading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : selectedTuition ? (
                        <div className="p-3">
                            <Row className="gy-3">
                                <Col md={6}>
                                    <strong>Created Date:</strong>
                                    <div className="text-secondary">
                                        {selectedTuition.createdAt ? new Date(selectedTuition.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' }) : '—'}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <strong>Status:</strong>
                                    <div className="text-secondary">{selectedTuition.status || '—'}</div>
                                </Col>
                                <Col md={6}>
                                    <strong>Class:</strong>
                                    <div className="text-secondary">{selectedTuition.class || '—'}</div>
                                </Col>
                                <Col md={6}>
                                    <strong>Subject:</strong>
                                    <div className="text-secondary">{selectedTuition.subject || '—'}</div>
                                </Col>
                                <Col md={6}>
                                    <strong>Location/Area:</strong>
                                    <div className="text-secondary">{selectedTuition.location || selectedTuition.area || '—'}</div>
                                </Col>
                                <Col md={6}>
                                    <strong>Salary:</strong>
                                    <div className="text-secondary">{selectedTuition.salary || '—'}</div>
                                </Col>
                                <Col md={6}>
                                    <strong>Medium:</strong>
                                    <div className="text-secondary">{selectedTuition.medium || '—'}</div>
                                </Col>
                                <Col md={6}>
                                    <strong>Wanted Teacher Gender:</strong>
                                    <div className="text-secondary">{selectedTuition.wantedTeacher || '—'}</div>
                                </Col>
                                <Col md={12}>
                                    <strong>Guardian Behavior:</strong>
                                    <div className="p-2 border rounded bg-white text-secondary mt-1">
                                        {selectedTuition.guardianBehavior || 'No notes available.'}
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <strong>Notes / Comments:</strong>
                                    <div className="p-2 border rounded bg-white text-secondary mt-1">
                                        {selectedTuition.note || 'No comments.'}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    ) : (
                        <div className="text-center text-muted">No details found.</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTuitionModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SavedGuardiansTab;
