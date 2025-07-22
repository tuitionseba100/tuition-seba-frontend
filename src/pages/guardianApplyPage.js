import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const GuardianApplyPage = () => {
    const [applyList, setApplyList] = useState([]);
    const [filteredApplyList, setFilteredApplyList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [areaSearchQuery, setAreaSearchQuery] = useState('');
    const [numberSearchQuery, setNumberSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [totalApply, setTotalApply] = useState(0);
    const [totalPending, setTotalPending] = useState(0);
    const [totalMeetingScheduled, setTotalMeetingScheduled] = useState(0);
    const [totalConfirmed, setTotalConfirmed] = useState(0);
    const [totalNotInterested, setTotalNotInterested] = useState(0);
    const [totalNoResponse, setTotalNoResponse] = useState(0);


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
        studentClass: '',
        teacherGender: '',
        characteristics: '',
        status: '',
        comment: '',
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

    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {
        let filteredData = applyList;
        if (statusFilter) {
            filteredData = filteredData.filter(data => data.status === statusFilter);
        }

        if (areaSearchQuery) {
            filteredData = filteredData.filter(data =>
                String(data.address).toLowerCase().includes(String(areaSearchQuery).toLowerCase())
            );
        }
        if (numberSearchQuery) {
            filteredData = filteredData.filter(data =>
                String(data.phone).toLowerCase().includes(String(numberSearchQuery).toLowerCase())
            );
        }
        const totalApplyCount = filteredData.length;
        const totalPending = filteredData.filter(item => item.status === 'pending').length;
        const totalNoResponse = filteredData.filter(item => item.status === 'called (no response)').length;
        const totalMeetingScheduled = filteredData.filter(item => item.status === 'meeting scheduled').length;
        const totalConfirmed = filteredData.filter(item => item.status === 'confirmed').length;
        const totalNotIntersted = filteredData.filter(item => item.status === 'not interested').length;

        setTotalApply(totalApplyCount);
        setTotalPending(totalPending);
        setTotalMeetingScheduled(totalMeetingScheduled);
        setTotalConfirmed(totalConfirmed);
        setTotalNotInterested(totalNotIntersted);
        setTotalNoResponse(totalNoResponse);

        setFilteredApplyList(filteredData);
    }, [statusFilter, areaSearchQuery, numberSearchQuery, applyList]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/guardianApply/all');
            setApplyList(response.data);
            setFilteredApplyList(response.data);
        } catch (err) {
            console.error('Error:', err);
            toast.error("Failed to load records.");
        }
        setLoading(false);
    };

    const handleSaveRequest = async () => {

        const updatedData = {
            ...tuitionData
        };
        try {
            if (editingId) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/guardianApply/edit/${editingId}`, updatedData);
                toast.success("Record updated successfully!");
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/guardianApply/add', updatedData);
                toast.success("Record updated successfully!");
            }
            setShowModal(false);
            fetchRecords();
        } catch (err) {
            console.error('Error:', err);
            toast.error("Error.");
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
            "Guardian Name", "Status", "Applied Date", "Phone No.", "Address", "Student Class", "Teacher Gender", "Characteristics", "Comment"
        ];

        const tableData = filteredApplyList.map(data => [
            String(data.name ?? ""),
            String(data.Status ?? ""),
            data.appliedAt ? formatDate(data.appliedAt) : "",
            String(data.phone ?? ""),
            String(data.address ?? ""),
            String(data.studentClass ?? ""),
            String(data.teacherGender ?? ""),
            String(data.characteristics ?? ""),
            String(data.comment ?? ""),
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);

        worksheet['!cols'] = [
            { wpx: 140 },
            { wpx: 140 },
            { wpx: 140 },
            { wpx: 140 },
            { wpx: 120 },
            { wpx: 120 },
            { wpx: 200 },
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

        try {
            const response = await axios.put(
                `https://tuition-seba-backend-1.onrender.com/api/guardianApply/update-status/${selectedRecord._id}`,
                { status: newStatus, comment: newComment }
            );

            fetchRecords();
            setShowStatusModal(false);
            setSelectedRecord(null);
            setNewStatus('');
            setNewComment('');

            toast.success("Status updated successfully!");
        } catch (err) {
            console.error('Error updating status:', err);
            toast.error("Failed to update status.");
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
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/guardianApply/delete/${id}`);
                toast.success("Record deleted successfully!");
                fetchRecords();
            } catch (err) {
                console.error('Error deleting record:', err);
                toast.error("Error deleting record.");
            }
        } else {
            toast.info("Deletion canceled");
        }
    };

    const handleResetFilters = () => {
        setStatusFilter('');
        setAreaSearchQuery('');
        setNumberSearchQuery('');
        setFilteredApplyList(applyList);
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
                                        <span>{totalApply}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Pending</span>
                                        <span>{totalPending}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total No Response</span>
                                        <span>{totalNoResponse}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Meeting Scheduled</span>
                                        <span>{totalMeetingScheduled}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Confirmed</span>
                                        <span>{totalConfirmed}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Not Interested</span>
                                        <span>{totalNotInterested}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                {/* Search bar */}
                <Row className="mt-2 mb-3">
                    <Col md={2}>
                        <Form.Label className="fw-bold">Status</Form.Label>
                        <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Address)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Address"
                            value={areaSearchQuery}
                            onChange={(e) => setAreaSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Phone Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Phone Number"
                            value={numberSearchQuery}
                            onChange={(e) => setNumberSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2} className="d-flex align-items-end">
                        <Button variant="danger" onClick={handleResetFilters} className="w-100">
                            Reset Filters
                        </Button>
                    </Col>

                </Row>
                <Button variant="success" className="mb-3" onClick={handleExportToExcel}>
                    Export to Excel
                </Button>

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Applied List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Guardian Name</th>
                                        <th>Applied Date</th>
                                        <th>Status</th>
                                        <th>Phone No.</th>
                                        <th>Address</th>
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
                                        filteredApplyList.slice().reverse().map((rowData, index) => (
                                            <tr key={rowData._id}>
                                                <td>{index + 1}</td>
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
                        <Button variant="primary" onClick={handleSaveRequest}>Save</Button>
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
                        <Button variant="primary" onClick={handleUpdateStatus}>
                            Update Status
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
