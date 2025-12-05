import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaSearch, FaChevronLeft, FaChevronRight, FaBell, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import Select from 'react-select';

const LeadPage = () => {
    const [leadList, setLeadList] = useState([]);
    const [exportList, setExportList] = useState([]);
    const [filteredLeadList, setFilteredLeadList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [leadData, setLeadData] = useState({
        tuitionCode: '',
        phone: '',
        name: '',
        employeeId: '',
        employeeName: '',
        status: '',
        note: '',
        followUpDate: '',
        followUpComment: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusCounts, setStatusCounts] = useState({
        pending: 0,
        employeeAssigned: 0,
        underReview: 0,
        confirmed: 0,
        cancel: 0,
        suspended: 0,
        total: 0
    });
    const statusOptions = [
        'pending',
        'employee assigned',
        'under review',
        'confirmed',
        'cancel',
        'suspended'
    ];
    const [searchInputs, setSearchInputs] = useState({
        tuitionCode: '',
        phone: '',
        status: ''
    });
    const [appliedFilters, setAppliedFilters] = useState({
        tuitionCode: '',
        phone: '',
        status: ''
    });
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const [userList, setUserList] = useState([]);
    const [dueTodayList, setDueTodayList] = useState([]);
    const [showDueModal, setShowDueModal] = useState(false);
    const [loadingDueToday, setLoadingDueToday] = useState(false);

    const fetchDueTodayList = async () => {
        setLoadingDueToday(true);
        try {
            const response = await axios.get(
                'https://tuition-seba-backend-1.onrender.com/api/lead/today-followups',
                { headers: { Authorization: token } }
            );
            setDueTodayList(response.data);
        } catch (err) {
            toast.error("Failed to fetch today's follow-ups.");
        }
        setLoadingDueToday(false);
    };

    useEffect(() => {
        fetchDueTodayList();
    }, []);

    useEffect(() => {
        fetchLeadRecords();
        fetchUsers();
    }, [appliedFilters, currentPage]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/user/users');
            setUserList(response.data);
        } catch (err) {
            console.error('Error:', err);
            toast.error("Failed.");
        }
    };

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
        if (e.key === 'Enter') handleSearch();
    };

    const handleResetFilters = () => {
        const resetFilters = { tuitionCode: '', phone: '', status: '' };
        setSearchInputs(resetFilters);
        setAppliedFilters(resetFilters);
        setCurrentPage(1);
    };

    const fetchLeadRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/lead/getTableData', {
                params: {
                    page: currentPage,
                    tuitionCode: appliedFilters.tuitionCode,
                    phone: appliedFilters.phone,
                    status: appliedFilters.status
                },
                headers: { Authorization: token },
            });
            setLeadList(response.data.data);
            setFilteredLeadList(response.data.data);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            fetchCardSummary();
        } catch (err) {
            toast.error("Failed to load lead records.");
        }
        setLoading(false);
    };

    const fetchCardSummary = () => {
        axios.get('https://tuition-seba-backend-1.onrender.com/api/lead/summary', {
            params: {
                tuitionCode: appliedFilters.tuitionCode,
                phone: appliedFilters.phone,
                status: appliedFilters.status
            },
            headers: { Authorization: token },
        })
            .then(response => {
                setStatusCounts({
                    pending: response.data.pending,
                    employeeAssigned: response.data.employeeAssigned,
                    underReview: response.data.underReview,
                    confirmed: response.data.confirmed,
                    cancel: response.data.cancel,
                    suspended: response.data.suspended,
                    total: response.data.total
                });
                setExportList(response.data.data);
            })
            .catch(() => { });
    };

    const handleSaveRequest = async () => {
        const updatedData = {
            ...leadData,
            createdBy: username
        };

        if (leadData.employeeId) {
            const selectedEmployee = userList.find(user => user._id === leadData.employeeId);
            if (selectedEmployee) {
                updatedData.employeeName = selectedEmployee.name;
            }
        }

        try {
            if (editingId) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/lead/edit/${editingId}`, updatedData, {
                    headers: { Authorization: token },
                });
                toast.success("Record updated successfully!");
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/lead/add', updatedData, {
                    headers: { Authorization: token },
                });
                toast.success("Record created successfully!");
            }
            setShowModal(false);
            fetchLeadRecords();
        } catch {
            toast.error("Error saving record.");
        }
    };

    const handleDeleteRecord = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/lead/delete/${id}`, {
                    headers: { Authorization: token },
                });
                toast.success("Record deleted successfully!");
                fetchLeadRecords();
            } catch {
                toast.error("Error deleting record.");
            }
        }
    };

    const openEditModal = (rowData) => {
        setEditingId(rowData._id);
        setLeadData({
            tuitionCode: rowData.tuitionCode || '',
            phone: rowData.phone || '',
            name: rowData.name || '',
            employeeId: rowData.employeeId || '',
            employeeName: rowData.employeeName || '',
            status: rowData.status || '',
            note: rowData.note || '',
            followUpDate: rowData.followUpDate ? new Date(rowData.followUpDate).toISOString().slice(0, 16) : '',
            followUpComment: rowData.followUpComment || ''
        });
        setShowModal(true);
    };

    const formatDate = (dateString) => {
        const [datePart, timePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-');
        const [hour24, minute] = timePart.split(':');

        const hour12 = ((+hour24 + 11) % 12) + 1;
        const ampm = +hour24 >= 12 ? 'PM' : 'AM';

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const formattedDate = `${day} ${monthNames[+month - 1]} ${year}`;
        const formattedTime = `${hour12.toString().padStart(2, '0')}:${minute} ${ampm}`;

        return `${formattedDate} || ${formattedTime}`;
    };

    const formatMongoDate = (mongoDate) => {
        const date = new Date(mongoDate); // MongoDB ISODate or timestamp
        const optionsDate = { day: '2-digit', month: 'long', year: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };

        const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
        const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);

        return `${formattedDate} || ${formattedTime}`;
    };

    const handleExportToExcel = () => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
        const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');
        const fileName = `Lead_List_${formattedDate}_${formattedTime}`;
        const tableHeaders = ["Tuition Code", "Phone", "Name", "Employee ID", "Employee Name", "Created By", "Status", "Note", "Follow Up Date", "Follow Up Comment", "Created At", "Updated At"];
        const tableData = [...exportList].reverse().map(data => [
            data.tuitionCode ?? "",
            data.phone ?? "",
            data.name ?? "",
            data.employeeId ?? "",
            data.employeeName ?? "",
            data.createdBy ?? "",
            data.status ?? "",
            data.note ?? "",
            data.followUpDate ? formatDate(data.followUpDate) : "",
            data.followUpComment ?? "",
            data.createdAt ? formatMongoDate(data.createdAt) : "",
            data.updatedAt ? formatMongoDate(data.updatedAt) : ""
        ]);
        const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);
        worksheet['!cols'] = Array(tableHeaders.length).fill({ wpx: 140 });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    return (
        <>
            <NavBarPage />
            <Container>
                <Header>
                    <h2 className='text-primary fw-bold'>Lead Management Dashboard</h2>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setShowModal(true);
                            setEditingId(null);
                            setLeadData({
                                tuitionCode: '',
                                phone: '',
                                name: '',
                                employeeId: '',
                                employeeName: '',
                                status: '',
                                note: '',
                                followUpDate: '',
                                followUpComment: ''
                            });
                        }}
                    >
                        Create Lead Record
                    </Button>
                </Header>

                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total</span>
                                        <span>{statusCounts.total}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-warning">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-warning" style={{ fontWeight: 'bolder' }}>Pending</span>
                                        <span>{statusCounts.pending}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-info">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-info" style={{ fontWeight: 'bolder' }}>Employee Assigned</span>
                                        <span>{statusCounts.employeeAssigned}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-secondary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-secondary" style={{ fontWeight: 'bolder' }}>Under Review</span>
                                        <span>{statusCounts.underReview}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-success">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-success" style={{ fontWeight: 'bolder' }}>Confirmed</span>
                                        <span>{statusCounts.confirmed}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-danger">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-danger" style={{ fontWeight: 'bolder' }}>Cancel</span>
                                        <span>{statusCounts.cancel}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Row className="mt-2 mb-3">
                    <Col md={3}>
                        <Form.Label className="fw-bold">Tuition Code</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Tuition Code"
                            value={searchInputs.tuitionCode}
                            onChange={(e) => handleSearchInputChange('tuitionCode', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>

                    <Col md={3}>
                        <Form.Label className="fw-bold">Phone</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter phone"
                            value={searchInputs.phone}
                            onChange={(e) => handleSearchInputChange('phone', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>

                    <Col md={3}>
                        <Form.Label className="fw-bold">Status</Form.Label>
                        <Form.Select
                            value={searchInputs.status}
                            onChange={(e) => handleSearchInputChange('status', e.target.value)}
                        >
                            <option value="">All</option>
                            {statusOptions.map((option, idx) => (
                                <option key={idx} value={option}>
                                    {option}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>

                    <Col md={1} className="d-flex align-items-end">
                        <Button variant="success" onClick={handleSearch} className="w-100">
                            <FaSearch /> Search
                        </Button>
                    </Col>

                    <Col md={1} className="d-flex align-items-end">
                        <Button variant="danger" onClick={handleResetFilters} className="w-100">
                            Reset
                        </Button>
                    </Col>
                </Row>

                <div className="d-flex align-items-center justify-content-center mb-3">
                    <h5 className="me-3 d-flex align-items-center gap-2">
                        <FaBell className="text-primary" />
                        <span>
                            Follow up today: {loadingDueToday ? (
                                <Spinner animation="border" size="sm" className="ms-2" />
                            ) : dueTodayList.length}
                        </span>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip">Click to see details</Tooltip>}
                        >
                            <Button size="sm" onClick={() => setShowDueModal(true)} className="ms-2">
                                <FaInfoCircle />
                            </Button>
                        </OverlayTrigger>
                    </h5>
                </div>


                {role === "superadmin" && (
                    <Button
                        variant="success"
                        className="mb-3"
                        onClick={handleExportToExcel}
                        disabled={exportList.length === 0}
                    >
                        {exportList.length === 0 ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            'Export to Excel'
                        )}
                    </Button>
                )}

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Lead List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Created At</th>
                                        <th>Created By</th>
                                        <th>Tuition Code</th>
                                        <th>Phone</th>
                                        <th>Name</th>
                                        <th>Assigned Employee</th>
                                        <th>Created By</th>
                                        <th>Status</th>
                                        <th>Comment</th>
                                        <th>Follow Up Date</th>
                                        <th>FU Comment</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="12" className="text-center" style={{ minHeight: '200px' }}>
                                                <Spinner animation="border" variant="primary" size="lg" />
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLeadList.map((rowData, index) => (
                                            <tr key={rowData._id}>
                                                <td>{(currentPage - 1) * 50 + index + 1}</td>
                                                <td>{rowData.createdAt ? formatMongoDate(rowData.createdAt) : '-'}</td>
                                                <td>{rowData.createdBy}</td>
                                                <td>{rowData.tuitionCode}</td>
                                                <td>{rowData.phone}</td>
                                                <td>{rowData.name}</td>
                                                <td>{rowData.employeeName}</td>
                                                <td>{rowData.createdBy}</td>
                                                <td>
                                                    <span
                                                        className={`badge 
                                                            ${rowData.status === "pending" ? "bg-warning text-dark" : ""}  
                                                            ${rowData.status === "employee assigned" ? "bg-info text-dark" : ""}  
                                                            ${rowData.status === "under review" ? "bg-secondary text-light" : ""}  
                                                            ${rowData.status === "confirmed" ? "bg-success" : ""}  
                                                            ${rowData.status === "cancel" ? "bg-danger" : ""}
                                                            ${rowData.status === "suspended" ? "bg-dark" : ""}
                                                        `}
                                                    >
                                                        {rowData.status}
                                                    </span>
                                                </td>
                                                <td>{rowData.note}</td>
                                                <td>{rowData.followUpDate ? formatDate(rowData.followUpDate) : '-'}</td>
                                                <td>{rowData.followUpComment}</td>
                                                <td style={{ display: 'flex', gap: '8px' }}>
                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Edit Record</Tooltip>}>
                                                        <Button variant="primary" onClick={() => openEditModal(rowData)}>
                                                            <FaEdit />
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Delete Record</Tooltip>}>
                                                        <Button variant="danger" onClick={() => handleDeleteRecord(rowData._id)}>
                                                            <FaTrashAlt />
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
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Next <FaChevronRight />
                            </Button>
                        </div>
                    </Card.Body>
                </Card>

                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">
                            {editingId ? "Edit Lead Record" : "Create Lead Record"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="tuitionCode">
                                        <Form.Label className="fw-bold">Tuition Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={leadData.tuitionCode}
                                            onChange={(e) => setLeadData({ ...leadData, tuitionCode: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="phone">
                                        <Form.Label className="fw-bold">Phone</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={leadData.phone}
                                            onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={6}>
                                    <Form.Group controlId="name">
                                        <Form.Label className="fw-bold">Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={leadData.name}
                                            onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="employeeId">
                                        <Form.Label className="fw-bold">Employee Name</Form.Label>
                                        <Select
                                            options={userList.map(user => ({
                                                value: user._id,
                                                label: user.name?.trim() ? user.name : user.username
                                            }))}
                                            value={userList.find(user => user._id === leadData.employeeId) ? {
                                                value: userList.find(user => user._id === leadData.employeeId)._id,
                                                label: userList.find(user => user._id === leadData.employeeId).name?.trim()
                                                    ? userList.find(user => user._id === leadData.employeeId).name
                                                    : userList.find(user => user._id === leadData.employeeId).username
                                            } : null}
                                            onChange={(selectedOption) => setLeadData({ ...leadData, employeeId: selectedOption.value })}
                                            placeholder="Select Employee"
                                            isSearchable
                                        />
                                    </Form.Group>

                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={6}>
                                    <Form.Group controlId="status">
                                        <Form.Label className="fw-bold">Status</Form.Label>
                                        <Form.Select
                                            value={leadData.status}
                                            onChange={(e) => setLeadData({ ...leadData, status: e.target.value })}
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
                                <Col md={6}>
                                    <Form.Group controlId="note">
                                        <Form.Label className="fw-bold">Note</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={leadData.note}
                                            onChange={(e) => setLeadData({ ...leadData, note: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={6}>
                                    <Form.Group controlId="followUpDate">
                                        <Form.Label className="fw-bold">Follow Up Date</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={leadData.followUpDate}
                                            onChange={(e) => setLeadData({ ...leadData, followUpDate: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="followUpComment">
                                        <Form.Label className="fw-bold">Follow Up Comment</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={leadData.followUpComment}
                                            onChange={(e) => setLeadData({ ...leadData, followUpComment: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveRequest}>
                            {editingId ? "Update" : "Save"}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showDueModal} onHide={() => setShowDueModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Today's Follow-Ups</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {loadingDueToday ? (
                            <div className="text-center my-4">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : dueTodayList.length === 0 ? (
                            <p>No follow-ups for today.</p>
                        ) : (
                            <Table striped bordered hover responsive>
                                <thead className="table-primary">
                                    <tr>
                                        <th>SL</th>
                                        <th>Tuition Code</th>
                                        <th>Phone</th>
                                        <th>Name</th>
                                        <th>Employee Name</th>
                                        <th>Status</th>
                                        <th>Note</th>
                                        <th>Follow Up Date</th>
                                        <th>Follow Up Comment</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dueTodayList.map((lead, idx) => (
                                        <tr key={lead._id}>
                                            <td>{idx + 1}</td>
                                            <td>{lead.tuitionCode}</td>
                                            <td>{lead.phone}</td>
                                            <td>{lead.name}</td>
                                            <td>{lead.employeeName}</td>
                                            <td>
                                                <span
                                                    className={`badge 
                                        ${lead.status === "pending" ? "bg-warning text-dark" : ""}  
                                        ${lead.status === "employee assigned" ? "bg-info text-dark" : ""}  
                                        ${lead.status === "under review" ? "bg-secondary text-light" : ""}  
                                        ${lead.status === "confirmed" ? "bg-success" : ""}  
                                        ${lead.status === "cancel" ? "bg-danger" : ""}
                                        ${lead.status === "suspended" ? "bg-dark" : ""}`}
                                                >
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td>{lead.note}</td>
                                            <td>{lead.followUpDate ? formatMongoDate(lead.followUpDate) : '-'}</td>
                                            <td>{lead.followUpComment}</td>
                                            <td style={{ display: 'flex', gap: '8px' }}>
                                                <OverlayTrigger placement="top" overlay={<Tooltip>Edit Record</Tooltip>}>
                                                    <Button variant="primary" onClick={() => openEditModal(lead)}>
                                                        <FaEdit />
                                                    </Button>
                                                </OverlayTrigger>
                                                <OverlayTrigger placement="top" overlay={<Tooltip>Delete Record</Tooltip>}>
                                                    <Button variant="danger" onClick={() => handleDeleteRecord(lead._id)}>
                                                        <FaTrashAlt />
                                                    </Button>
                                                </OverlayTrigger>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDueModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
            <ToastContainer />
        </>
    );
};

const Container = styled.div`
    padding: 2rem;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
`;

export default LeadPage;
