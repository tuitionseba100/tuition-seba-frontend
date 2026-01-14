import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa'; // React Icons
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';

import Select from 'react-select';
import LoadingCard from '../components/modals/LoadingCard';

const TuitionPage = () => {
    const [tuitionList, setTuitionApplyList] = useState([]);

    const [filteredTuitionList, setFilteredTuitionApplyList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [tuitionData, setTuitionData] = useState({
        tuitionCode: '',
        tuitionId: '',
        premiumCode: '',
        name: '',
        phone: '',
        institute: '',
        department: '',
        academicYear: '',
        address: '',
        comment: '',
        commentForTeacher: '',
        agentComment: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [allTuitionList, setAllTuitionList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [statusCounts, setStatusCounts] = useState({
        pending: 0,
        calledInterested: 0,
        calledNoResponse: 0,
        selected: 0,
        shortlisted: 0,
        requestedForPayment: 0,
        total: 0
    });
    const spamStyle = { backgroundColor: '#dc3545', color: 'white' };
    const bestStyle = { backgroundColor: '#007bff', color: 'white' };
    const manualExpressStyle = { backgroundColor: '#28a745', color: 'white' };
    const dueStyle = { backgroundColor: '#FFFF00', color: 'black' };
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    const [searchInputs, setSearchInputs] = useState({
        tuitionCode: '',
        phone: '',
        statusFilter: ''
    });

    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedExportStatus, setSelectedExportStatus] = useState('');

    const [appliedFilters, setAppliedFilters] = useState({
        tuitionCode: '',
        phone: '',
        statusFilter: ''
    });

    const getRowStyle = (tuition) => {
        if (tuition.hasDue) return dueStyle;
        if (tuition.isSpam) return spamStyle;
        if (tuition.isBest) return bestStyle;
        if (tuition.isExpress) return manualExpressStyle;
        return {};
    };

    const getButtonVariant = (tuition, defaultVariant) => {
        if (tuition.isSpam) return 'light';
        if (tuition.isBest) return 'primary';
        return defaultVariant;
    };

    useEffect(() => {
        fetchTuitionApplyRecords();
    }, []);

    useEffect(() => {
        fetchTuitionApplyRecords();
    }, [appliedFilters, currentPage]);

    const handleSearchInputChange = (field, value) => {
        setSearchInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSearch = () => {
        setAppliedFilters(searchInputs);
        setCurrentPage(1);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const fetchTuitionApplyRecords = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/tuitionApply/getTableData', {
                params: {
                    page: currentPage,
                    tuitionCode: appliedFilters.tuitionCode,
                    phone: appliedFilters.phone,
                    status: appliedFilters.statusFilter
                }
            });

            setTuitionApplyList(response.data.data);
            setFilteredTuitionApplyList(response.data.data);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            fetchCardSummary();
        } catch (err) {
            console.error('Error fetching tuition records:', err);
            toast.error("Failed to load tuition apply records.");
        }
        setLoading(false);
    };

    const handleResetFilters = () => {
        const resetFilters = {
            tuitionCode: '',
            phone: '',
            statusFilter: ''
        };
        setSearchInputs(resetFilters);
        setAppliedFilters(resetFilters);
        setCurrentPage(1);
    };

    const fetchCardSummary = () => {
        axios.get('https://tuition-seba-backend-1.onrender.com/api/tuitionApply/summary', {
            params: {
                tuitionCode: appliedFilters.tuitionCode,
                phone: appliedFilters.phone,
                status: appliedFilters.statusFilter
            }
        })
            .then(response => {
                setStatusCounts({
                    pending: response.data.pending,
                    calledInterested: response.data.calledInterested,
                    calledNoResponse: response.data.calledNoResponse,
                    selected: response.data.selected,
                    shortlisted: response.data.shortlisted,
                    requestedForPayment: response.data.requestedForPayment,
                    total: response.data.total
                });
            })
            .catch(error => {
                console.error('Error fetching card summary:', error);
                // Show a user-friendly message about CORS or network issues
                if (error.code === 'ERR_NETWORK') {
                    console.warn('Network error occurred. This may be due to CORS policy. Please check backend configuration.');
                }
            });
    };

    const handleExportToExcel = async () => {
        setShowExportModal(true);
    };

    const handleExportWithStatus = async () => {
        if (selectedExportStatus) {
            try {
                const statusForFileName = selectedExportStatus.replace(/\s+/g, '_').toLowerCase();
                const link = document.createElement('a');
                link.href = `https://tuition-seba-backend-1.onrender.com/api/tuitionApply/exportData?status=${selectedExportStatus}`;
                link.target = '_blank';
                // Match backend file naming and CSV extension
                link.download = selectedExportStatus.toLowerCase() === 'all'
                    ? 'tuition_apply_all.csv'
                    : `tuition_apply_${statusForFileName}.csv`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setShowExportModal(false);
                setSelectedExportStatus('');
            } catch (error) {
                console.error('Export failed:', error);
                toast.error('Export failed. Please try again.');
            }
        } else {
            toast.error('Please select a status to export.');
        }
    };

    const handleSaveTuition = async () => {
        setSaving(true);
        const username = localStorage.getItem('username');

        const updatedTuitionData = {
            ...tuitionData,
            updatedBy: username,
            status: tuitionData.status ? tuitionData.status : "pending"
        };
        try {
            if (editingId) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/tuitionApply/edit/${editingId}`, updatedTuitionData);
                toast.success("Tuition apply record updated successfully!");
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/tuitionApply/add', updatedTuitionData);
                toast.success("Tuition apply record created successfully!");
            }
            setShowModal(false);
            fetchTuitionApplyRecords();
        } catch (err) {
            console.error('Error saving tuition apply record:', err);
            toast.error("Error saving tuition apply record.");
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const optionsDate = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };

        const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
        const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);

        return `${formattedDate} || ${formattedTime}`;
    };

    const handleEditTuition = (tuition) => {
        setTuitionData(tuition);
        setEditingId(tuition._id);
        setShowModal(true);
    };

    const handleDeleteTuition = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this tuition apply record?");

        if (confirmDelete) {
            setDeleting(true);
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/tuitionApply/delete/${id}`);
                toast.success("Tuition record deleted successfully!");
                fetchTuitionApplyRecords();
            } catch (err) {
                console.error('Error deleting tuition apply record:', err);
                toast.error("Error deleting tuition apply record.");
            } finally {
                setDeleting(false);
            }
        } else {
            toast.info("Deletion canceled");
        }
    };

    return (
        <>
            <NavBarPage />
            <Container>

                <Header>
                    <h2 className='text-primary fw-bold'>Tuition Applications</h2>
                    <Button variant="primary" onClick={() => { setShowModal(true); setEditingId(null); setTuitionData({ tuitionCode: '', tuitionId: 'admin_created', premiumCode: '', name: '', phone: '', institute: '', department: '', academicYear: '', address: '', status: '', comment: '', commentForTeacher: '' }) }}>
                        Create Tuition Apply
                    </Button>
                </Header>
                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-dark">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-dark" style={{ fontWeight: 'bolder' }}>Total Applied</span>
                                        <span>{statusCounts.total}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Pending</span>
                                        <span>{statusCounts.pending}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Called (No Response)</span>
                                        <span>{statusCounts.calledNoResponse}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Shortlisted</span>
                                        <span>{statusCounts.shortlisted}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Requested for Payment</span>
                                        <span>{statusCounts.requestedForPayment}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Selected</span>
                                        <span>{statusCounts.selected}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                {/* Search bar */}
                <Row className="mt-2 mb-3">
                    <Col md={3}>
                        <Form.Label className="fw-bold">Search by Tuition Code</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g. TSF-1001"
                            value={searchInputs.tuitionCode}
                            onChange={(e) => handleSearchInputChange('tuitionCode', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>

                    <Col md={3}>
                        <Form.Label className="fw-bold">Search by Phone</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g. 017xxxxxxxx"
                            value={searchInputs.phone}
                            onChange={(e) => handleSearchInputChange('phone', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>

                    <Col md={3}>
                        <Form.Label className="fw-bold">Status Filter</Form.Label>
                        <Form.Select
                            value={searchInputs.statusFilter}
                            onChange={(e) => handleSearchInputChange('statusFilter', e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="called (interested)">Called (Interested)</option>
                            <option value="called (no response)">Called (No Response)</option>
                            <option value="called (guardian no response)">Called Guardian(No Response)</option>
                            <option value="cancel">Cancelled</option>
                            <option value="cancelled by guardian">Cancelled By Guardian</option>
                            <option value="cancelled by teacher">Cancelled By Teacher</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="requested for payment">Requested for Payment</option>
                            <option value="meet to office">Meet to office</option>
                            <option value="selected">Selected</option>
                            <option value="refer to bm">Refer to BM</option>
                        </Form.Select>
                    </Col>

                    <Col md={1} className="d-flex align-items-end">
                        <Button
                            variant="success"
                            onClick={handleSearch}
                            className="d-flex align-items-center justify-content-center gap-1 w-100"
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : <FaSearch />}
                            Search
                        </Button>
                    </Col>
                    <Col md={1} className="d-flex align-items-end">
                        <Button
                            variant="danger"
                            onClick={handleResetFilters}
                            className="d-flex align-items-center justify-content-center w-100"
                        >
                            Reset
                        </Button>
                    </Col>
                </Row>

                {role === "superadmin" && (
                    <Button
                        variant="success"
                        className="mb-3 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleExportToExcel}
                    >
                        Export Data
                    </Button>
                )}



                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Tuition Application List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Applied At</th>
                                        <th>Updated By</th>
                                        <th>Status</th>
                                        <th>Premium Code</th>
                                        <th>Tuition Code</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Institute</th>
                                        <th>Department</th>
                                        <th>Academic Year</th>
                                        <th>Address</th>
                                        <th>Comment</th>
                                        <th>Comment For Teacher</th>
                                        <th>Agent Comment</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="20" className="text-center">
                                                <div className="d-flex justify-content-center align-items-center" style={{ position: 'absolute', top: '90%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vh' }}>
                                                    <Spinner animation="border" variant="primary" size="lg" />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTuitionList.map((tuition, index) => (
                                            <tr key={tuition._id}>
                                                <td style={getRowStyle(tuition)}>
                                                    {index + 1} {tuition.isBest && <span style={{ color: '#000 !important' }}>⭐</span>}
                                                </td>

                                                <td style={getRowStyle(tuition)}>{tuition.appliedAt ? formatDate(tuition.appliedAt) : ''}</td>
                                                <td style={getRowStyle(tuition)}>{tuition.updatedBy}</td>
                                                <td style={getRowStyle(tuition)}>
                                                    <span className={`badge 
            ${tuition.status === "pending" ? "bg-success" :
                                                            tuition.status === "called (no response)" ? "bg-primary" :
                                                                tuition.status === "called (guardian no response)" ? "bg-info" :
                                                                    tuition.status === "called (interested)" ? "bg-info" :
                                                                        tuition.status === "cancel" ? "bg-danger" :
                                                                            tuition.status === "shortlisted" ? "bg-secondary" :
                                                                                tuition.status === "requested for payment" ? "bg-warning text-dark" :
                                                                                    tuition.status === "meet to office" ? "bg-dark" :
                                                                                        tuition.status === "selected" ? "bg-success" :
                                                                                            tuition.status === "refer to bm" ? "bg-info" :
                                                                                                "bg-secondary"
                                                        }`}>
                                                        {tuition.status}
                                                    </span>
                                                </td>
                                                <td style={getRowStyle(tuition)}>{tuition.premiumCode}</td>
                                                <td style={getRowStyle(tuition)}>{tuition.tuitionCode}</td>
                                                <td style={getRowStyle(tuition)}>{tuition.name}</td>
                                                <td style={getRowStyle(tuition)}>{tuition.phone}</td>
                                                <td style={getRowStyle(tuition)}>{tuition.institute}</td>
                                                <td style={getRowStyle(tuition)}>{tuition.department}</td>
                                                <td style={getRowStyle(tuition)}>{tuition.academicYear}</td>
                                                <td style={getRowStyle(tuition)}>{tuition.address}</td>
                                                <td style={getRowStyle(tuition)}>{tuition.comment}</td>
                                                <td style={getRowStyle(tuition)}>{tuition.commentForTeacher}</td>
                                                <td style={getRowStyle(tuition)}>{tuition.agentComment}</td>
                                                <td style={getRowStyle(tuition)} className="d-flex justify-content-start gap-2">
                                                    <Button
                                                        variant={getButtonVariant(tuition, 'warning')}
                                                        onClick={() => handleEditTuition(tuition)}
                                                        disabled={saving}
                                                    >
                                                        {saving ? (
                                                            <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                className="me-1"
                                                            />
                                                        ) : (
                                                            <FaEdit />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant={getButtonVariant(tuition, 'danger')}
                                                        onClick={() => handleDeleteTuition(tuition._id)}
                                                        disabled={deleting}
                                                    >
                                                        {deleting ? (
                                                            <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                className="me-1"
                                                            />
                                                        ) : (
                                                            <FaTrashAlt />
                                                        )}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </Table>
                        </div>
                        <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
                            <Button
                                variant="outline-primary"
                                className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                <FaChevronLeft /> Previous
                            </Button>

                            <span className="fw-semibold text-primary-emphasis fs-5">
                                Page {currentPage} of {totalPages}
                            </span>

                            <Button
                                variant="outline-primary"
                                className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Next <FaChevronRight />
                            </Button>
                        </div>

                    </Card.Body>
                </Card>

                {/* Create/Edit Tuition Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">{editingId ? "Edit Tuition" : "Create Tuition"}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="tuitionCode">
                                        <Form.Label className="fw-bold">Tuition Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.tuitionCode}
                                            onChange={(e) => setTuitionData({ ...tuitionData, tuitionCode: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="name">
                                        <Form.Label className="fw-bold">Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.name}
                                            onChange={(e) => setTuitionData({ ...tuitionData, name: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="phone">
                                        <Form.Label className="fw-bold">Phone</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.phone}
                                            onChange={(e) => setTuitionData({ ...tuitionData, phone: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="institute">
                                        <Form.Label className="fw-bold">Institute</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.institute}
                                            onChange={(e) => setTuitionData({ ...tuitionData, institute: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="premiumCode">
                                        <Form.Label className="fw-bold">Premium Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.premiumCode || ''}
                                            onChange={(e) => setTuitionData({ ...tuitionData, premiumCode: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="department">
                                        <Form.Label className="fw-bold">Department</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.department}
                                            onChange={(e) => setTuitionData({ ...tuitionData, department: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="academicYear">
                                        <Form.Label className="fw-bold">Academic Year</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.academicYear}
                                            onChange={(e) => setTuitionData({ ...tuitionData, academicYear: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="address">
                                        <Form.Label className="fw-bold">Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.address}
                                            onChange={(e) => setTuitionData({ ...tuitionData, address: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="status">
                                        <Form.Label className="fw-bold">Status</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={tuitionData.status}
                                            onChange={(e) => setTuitionData({ ...tuitionData, status: e.target.value })}
                                            required
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="called (interested)">Called (Interested)</option>
                                            <option value="called (no response)">Called (No Response)</option>
                                            <option value="called (guardian no response)">Called Guardian(No Response)</option>
                                            <option value="cancel">Cancelled</option>
                                            <option value="cancelled by guardian">Cancelled By Guardian</option>
                                            <option value="cancelled by teacher">Cancelled By Teacher</option>
                                            <option value="shortlisted">Shortlisted</option>
                                            <option value="requested for payment">Requested for Payment</option>
                                            <option value="meet to office">Meet to office</option>
                                            <option value="selected">Selected</option>
                                            <option value="refer to bm">Refer to BM</option>

                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="comment">
                                        <Form.Label className="fw-bold">Comment</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.comment}
                                            onChange={(e) => setTuitionData({ ...tuitionData, comment: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="commentForTeacher">
                                        <Form.Label className="fw-bold">Comment For Teacher</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.commentForTeacher}
                                            onChange={(e) => setTuitionData({ ...tuitionData, commentForTeacher: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Group controlId="agentComment">
                                        <Form.Label className="fw-bold">Agent Comment</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.agentComment}
                                            onChange={(e) => setTuitionData({ ...tuitionData, agentComment: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>Close</Button>
                        <Button variant="primary" onClick={handleSaveTuition} disabled={saving}>
                            {saving ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        className="me-2"
                                    />
                                    Saving...
                                </>
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer />

                {/* Loading spinners for save and delete operations */}
                <LoadingCard show={saving} message="Saving tuition record..." />
                <LoadingCard show={deleting} message="Deleting tuition record..." />

                {/* Export Modal */}
                <Modal show={showExportModal} onHide={() => {
                    setShowExportModal(false);
                    setSelectedExportStatus('');
                }} centered>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="w-100 text-center fw-bold">
                            Select Status for Export
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4 bg-light">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Select Status:</Form.Label>
                            <Form.Select
                                value={selectedExportStatus}
                                onChange={(e) => setSelectedExportStatus(e.target.value)}
                                className="form-control-lg"
                            >
                                <option value="">-- Select Status --</option>
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="called (interested)">Called (Interested)</option>
                                <option value="called (no response)">Called (No Response)</option>
                                <option value="called (guardian no response)">Called Guardian(No Response)</option>
                                <option value="cancel">Cancelled</option>
                                <option value="cancelled by guardian">Cancelled By Guardian</option>
                                <option value="cancelled by teacher">Cancelled By Teacher</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="requested for payment">Requested for Payment</option>
                                <option value="meet to office">Meet to office</option>
                                <option value="selected">Selected</option>
                                <option value="refer to bm">Refer to BM</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="bg-light">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowExportModal(false);
                                setSelectedExportStatus('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleExportWithStatus}
                            disabled={!selectedExportStatus}
                        >
                            Export
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        </>
    );
};

export default TuitionPage;

// Styled Components
const Container = styled.div`
  padding: 30px;
  background: #f4f4f9;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h2 {
    font-family: 'Arial', sans-serif;
    color: #333;
  }
`;