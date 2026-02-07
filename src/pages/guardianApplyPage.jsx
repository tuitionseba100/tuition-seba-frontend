import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const GuardianApplyPage = () => {
    const [guardianList, setGuardianApplyList] = useState([]);
    const [exportList, setExportList] = useState([]);
    const [filteredGuardianList, setFilteredGuardianApplyList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [newComment, setNewComment] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [tuitionData, setTuitionData] = useState({
        name: '',
        phone: '',
        address: '',
        teacherCode: '',
        studentClass: '',
        teacherGender: '',
        characteristics: '',
        status: '',
        comment: '',
    });
    const role = localStorage.getItem('role');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusCounts, setStatusCounts] = useState({
        pending: 0,
        no_response: 0,
        meeting_scheduled: 0,
        confirmed: 0,
        not_interested: 0
    });

    const statusOptions = [
        'pending',
        'called (interested)',
        'called (no response)',
        'meeting scheduled',
        'meeting done',
        'confirmed',
        'not interested'
    ];

    const [searchInputs, setSearchInputs] = useState({
        phone: '',
        address: '',
        statusFilter: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        phone: '',
        address: '',
        statusFilter: ''
    });

    useEffect(() => {
        fetchGuardianApplyRecords();
    }, []);

    useEffect(() => {
        fetchGuardianApplyRecords();
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

    const fetchGuardianApplyRecords = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/guardianApply/getTableData', {
                params: {
                    page: currentPage,
                    phone: appliedFilters.phone,
                    address: appliedFilters.address,
                    status: appliedFilters.statusFilter
                }
            });

            setGuardianApplyList(response.data.data);
            setFilteredGuardianApplyList(response.data.data);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            fetchCardSummary();
        } catch (err) {
            console.error('Error fetching guardian records:', err);
            toast.error("Failed to load guardian apply records.");
        }
        setLoading(false);
    };

    const handleResetFilters = () => {
        const resetFilters = {
            phone: '',
            address: '',
            statusFilter: ''
        };
        setSearchInputs(resetFilters);
        setAppliedFilters(resetFilters);
        setCurrentPage(1);
    };

    const fetchCardSummary = () => {
        axios.get('https://tuition-seba-backend-1.onrender.com/api/guardianApply/summary', {
            params: {
                page: currentPage,
                phone: appliedFilters.phone,
                address: appliedFilters.address.trim(),
                status: appliedFilters.statusFilter
            }
        })
            .then(response => {
                setStatusCounts({
                    pending: response.data.pending,
                    no_response: response.data.no_response,
                    meeting_scheduled: response.data.meeting_scheduled,
                    confirmed: response.data.confirmed,
                    total: response.data.total,
                    not_interested: response.data.not_interested
                });
                setExportList(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching card summary:', error);
            });
    };

    const handleSaveRequest = async () => {
        const username = localStorage.getItem('username');
        setLoading(true);

        const updatedData = {
            ...tuitionData
        };

        try {
            if (editingId) {
                updatedData.updatedBy = username;
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/guardianApply/edit/${editingId}`, updatedData);
                toast.success("Record updated successfully!");
            } else {
                updatedData.createdBy = username;
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/guardianApply/add', updatedData);
                toast.success("Record created successfully!");
            }
            setShowModal(false);
            fetchGuardianApplyRecords();
        } catch (err) {
            console.error('Error:', err);
            toast.error("Error.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const optionsDate = { day: '2-digit', month: 'long', year: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };

        const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
        const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);

        return `${formattedDate} || ${formattedTime}`;
    };

    const handleExportToExcel = () => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
        const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');

        const fileName = `Guardian Apply List_${formattedDate}_${formattedTime}`;

        const tableHeaders = [
            "Guardian Name", "Status", "Applied Date", "Phone No.", "Address", "Teacher Code", "Student Class", "Teacher Gender", "Characteristics", "Comment", "Created By", "Updated By"
        ];

        const tableData = [...exportList].reverse().map(data => [
            String(data.name ?? ""),
            String(data.Status ?? ""),
            data.appliedAt ? formatDate(data.appliedAt) : "",
            String(data.phone ?? ""),
            String(data.address ?? ""),
            String(data.teacherCode ?? ""),
            String(data.studentClass ?? ""),
            String(data.teacherGender ?? ""),
            String(data.characteristics ?? ""),
            String(data.comment ?? ""),
            String(data.createdBy ?? ""),
            String(data.updatedBy ?? ""),
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);

        worksheet['!cols'] = [
            { wpx: 140 },
            { wpx: 140 },
            { wpx: 140 },
            { wpx: 140 },
            { wpx: 120 },
            { wpx: 100 },
            { wpx: 120 },
            { wpx: 120 },
            { wpx: 200 },
            { wpx: 120 },
            { wpx: 120 },
            { wpx: 120 },
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Apply");

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const handleUpdateStatus = async () => {
        if (!selectedRecord || !newStatus) {
            toast.error("Please select a record and status");
            return;
        }

        if (selectedRecord.status === newStatus && selectedRecord.comment === newComment) {
            toast.info("No changes detected. Nothing to update!");
            return;
        }

        const username = localStorage.getItem('username');
        setStatusLoading(true);

        try {
            const response = await axios.put(
                `https://tuition-seba-backend-1.onrender.com/api/guardianApply/update-status/${selectedRecord._id}`,
                { status: newStatus, comment: newComment, updatedBy: username }
            );

            fetchGuardianApplyRecords();
            setShowStatusModal(false);
            setSelectedRecord(null);
            setNewStatus('');
            setNewComment('');

            toast.success("Status updated successfully!");
        } catch (err) {
            console.error('Error updating status:', err);
            toast.error("Failed to update status.");
        } finally {
            setStatusLoading(false);
        }
    };

    const openStatusUpdateModal = (record) => {
        setSelectedRecord(record);
        setNewStatus(record.status || '');
        setNewComment(record.comment || '');
        setShowStatusModal(true);
    };

    const handleDeleteRecord = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this record?");

        if (confirmDelete) {
            setDeleteLoading(true);
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/guardianApply/delete/${id}`);
                toast.success("Record deleted successfully!");
                fetchGuardianApplyRecords();
            } catch (err) {
                console.error('Error deleting record:', err);
                toast.error("Error deleting record.");
            } finally {
                setDeleteLoading(false);
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
                    <h2 className='text-primary fw-bold'>Guardian Apply Dashboard</h2>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setShowModal(true);
                            setEditingId(null);
                            setTuitionData({
                                name: '',
                                phone: '',
                                address: '',
                                studentClass: '',
                                teacherGender: '',
                                characteristics: '',
                                status: '',
                                comment: '',
                            });
                        }}
                    >
                        Create Apply Record
                    </Button>
                </Header>

                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Apply</span>
                                        <span>{statusCounts.total}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Pending</span>
                                        <span>{statusCounts.pending}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total No Response</span>
                                        <span>{statusCounts.no_response}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Meeting Scheduled</span>
                                        <span>{statusCounts.meeting_scheduled}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Confirmed</span>
                                        <span>{statusCounts.confirmed}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Not Interested</span>
                                        <span>{statusCounts.not_interested}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                {/* Search bar */}
                <Row className="mt-2 mb-3">

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
                        <Form.Label className="fw-bold">Search by Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g. ctg"
                            value={searchInputs.address}
                            onChange={(e) => handleSearchInputChange('address', e.target.value)}
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
                            <option value="meeting scheduled">Meeting Scheduled</option>
                            <option value="meeting done">Meeting Done</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="not interested">Not Interested</option>
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
                        disabled={exportList.length === 0}
                    >
                        {exportList.length === 0 ? (
                            <>
                                <Spinner animation="border" size="sm" role="status" />
                                <span>Preparing export...</span>
                            </>
                        ) : (
                            'Export to Excel'
                        )}
                    </Button>
                )}

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Applied List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Created By</th>
                                        <th>Updated By</th>
                                        <th>Guardian Name</th>
                                        <th>Applied Date</th>
                                        <th>Status</th>
                                        <th>Phone No.</th>
                                        <th>Address</th>
                                        <th>Teacher Code</th>
                                        <th>Student Class</th>
                                        <th>Teacher Gender</th>
                                        <th>Teacher Characteristics</th>
                                        <th>Comment (Agent)</th>
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
                                        filteredGuardianList.map((rowData, index) => (
                                            <tr key={rowData._id}>
                                                <td>{index + 1}</td>
                                                <td>{rowData.createdBy}</td>
                                                <td>{rowData.updatedBy}</td>
                                                <td>{rowData.name}</td>
                                                <td>{rowData.appliedAt ? formatDate(rowData.appliedAt) : ''}</td>
                                                <td>
                                                    <span
                                                        className={`badge 
                                                            ${rowData.status === "pending" ? "bg-warning text-dark" : ""}  
                                                            ${rowData.status === "called (interested)" ? "bg-primary text-light" : ""}  
                                                            ${rowData.status === "called (no response)" ? "bg-secondary text-light" : ""}  
                                                            ${rowData.status === "meeting scheduled" ? "bg-info text-dark" : ""}  
                                                            ${rowData.status === "meeting done" ? "bg-success text-light" : ""}  
                                                            ${rowData.status === "confirmed" ? "bg-success" : ""}  
                                                            ${rowData.status === "not interested" ? "bg-danger text-light" : ""}
                                                            `}
                                                    >
                                                        {rowData.status}
                                                    </span>
                                                </td>
                                                <td>{rowData.phone}</td>
                                                <td>{rowData.address}</td>
                                                <td>{rowData.teacherCode}</td>
                                                <td>{rowData.studentClass}</td>
                                                <td>{rowData.teacherGender}</td>
                                                <td>{rowData.characteristics}</td>
                                                <td>{rowData.comment}</td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>Update Status</Tooltip>}
                                                    >
                                                        <Button variant="primary" onClick={() => openStatusUpdateModal(rowData)}>
                                                            <FaEdit />
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>Delete Record</Tooltip>}
                                                    >
                                                        <Button 
                                                            variant="danger" 
                                                            onClick={() => handleDeleteRecord(rowData._id)}
                                                            disabled={deleteLoading}
                                                        >
                                                            {deleteLoading ? (
                                                                <Spinner animation="border" size="sm" />
                                                            ) : (
                                                                <FaTrashAlt />
                                                            )}
                                                        </Button>
                                                    </OverlayTrigger>
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
                        <Modal.Title className="fw-bold">
                            {editingId ? "Edit Record" : "Create Record"}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="name">
                                        <Form.Label className="fw-bold">Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.name}
                                            onChange={(e) => setTuitionData({ ...tuitionData, name: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="phone">
                                        <Form.Label className="fw-bold">Phone<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            required
                                            value={tuitionData.phone}
                                            onChange={(e) => setTuitionData({ ...tuitionData, phone: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mt-3">
                                <Col md={6}>
                                    <Form.Group controlId="address">
                                        <Form.Label className="fw-bold">Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.address}
                                            onChange={(e) => setTuitionData({ ...tuitionData, address: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="studentClass">
                                        <Form.Label className="fw-bold">Student Class</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.studentClass}
                                            onChange={(e) => setTuitionData({ ...tuitionData, studentClass: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mt-3">
                                <Col md={6}>
                                    <Form.Group controlId="teacherGender">
                                        <Form.Label className="fw-bold">Preferred Teacher Gender</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.teacherGender}
                                            onChange={(e) => setTuitionData({ ...tuitionData, teacherGender: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="characteristics">
                                        <Form.Label className="fw-bold">Characteristics</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.characteristics}
                                            onChange={(e) => setTuitionData({ ...tuitionData, characteristics: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mt-3">
                                <Col md={6}>
                                    <Form.Group controlId="teacherCode">
                                        <Form.Label className="fw-bold">Teacher Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.teacherCode}
                                            onChange={(e) => setTuitionData({ ...tuitionData, teacherCode: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mt-3">
                                <Col md={6}>
                                    <Form.Group controlId="status">
                                        <Form.Label className="fw-bold">Status</Form.Label>
                                        <Form.Select
                                            value={tuitionData.status}
                                            onChange={(e) => setTuitionData({ ...tuitionData, status: e.target.value })}
                                        >
                                            <option value="">Select Status</option>
                                            {statusOptions.map((option, idx) => (
                                                <option key={idx} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                </Col>
                            </Row>

                            <Row className="mt-3">
                                <Col md={12}>
                                    <Form.Group controlId="comment">
                                        <Form.Label className="fw-bold">Comment</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={tuitionData.comment}
                                            onChange={(e) => setTuitionData({ ...tuitionData, comment: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSaveRequest} disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Saving...
                                </>
                            ) : 'Save'}
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold text-primary">Update Status</Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <div className="p-4">
                            <h5 className="text-center mb-4">Guardian Details</h5>

                            <div className="d-flex justify-content-between mb-3">
                                <strong>Guardian Name:</strong>
                                <span>{selectedRecord?.name || 'N/A'}</span>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <strong>Phone Number:</strong>
                                <span>{selectedRecord?.phone || 'N/A'}</span>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <strong>Current Status:</strong>
                                <span>
                                    {selectedRecord?.status || 'N/A'}
                                </span>
                            </div>

                            <hr />
                            <Form.Group>
                                <Form.Label className="fw-bold">New Status</Form.Label>

                                <Form.Select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    aria-label="Select New Status"
                                >
                                    <option value="">Select Status</option>
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label className="fw-bold">Comment</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Enter comment"
                                />
                            </Form.Group>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleUpdateStatus} disabled={statusLoading}>
                            {statusLoading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Updating...
                                </>
                            ) : 'Update Status'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer />
            </Container>
        </>
    );
};

export default GuardianApplyPage;

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
