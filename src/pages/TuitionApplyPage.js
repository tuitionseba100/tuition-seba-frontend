import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // React Icons
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Select from 'react-select';

const TuitionPage = () => {
    const [tuitionList, setTuitionApplyList] = useState([]);
    const [filteredTuitionList, setFilteredTuitionApplyList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [tuitionData, setTuitionData] = useState({
        tuitionCode: '',
        tuitionId: '',
        name: '',
        phone: '',
        institute: '',
        department: '',
        address: '',
        comment: '',
        commentForTeacher: ''
    });
    const [tuitionCodeSearch, setTuitionCodeSearch] = useState('');
    const [phoneSearch, setPhoneSearch] = useState('');

    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [allTuitionList, setAllTuitionList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusCounts, setStatusCounts] = useState({
        pending: 0,
        calledInterested: 0,
        calledNoResponse: 0,
        refertoBM: 0,
        shortlisted: 0,
        requestedForPayment: 0,
        total: 0
    });

    useEffect(() => {
        fetchTuitionApplyRecords();
        fetchAllTuitions();
    }, []);

    useEffect(() => {
        fetchTuitionApplyRecords(currentPage);
        fetchCardSummary();
    }, [currentPage, tuitionCodeSearch, phoneSearch, statusFilter]);

    const fetchTuitionApplyRecords = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/tuitionApply/getTableData', {
                params: {
                    page,
                    tuitionCode: tuitionCodeSearch,
                    phone: phoneSearch,
                    status: statusFilter
                }
            });

            setTuitionApplyList(response.data.data);
            setFilteredTuitionApplyList(response.data.data);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error('Error fetching tuition records:', err);
            toast.error("Failed to load tuition apply records.");
        }
        setLoading(false);
    };


    const fetchCardSummary = () => {
        axios.get('https://tuition-seba-backend-1.onrender.com/api/tuitionApply/summary', {
            params: {
                tuitionCode: tuitionCodeSearch,
                phone: phoneSearch,
                status: statusFilter
            }
        })
            .then(response => {
                setStatusCounts({
                    pending: response.data.pending,
                    calledInterested: response.data.calledInterested,
                    calledNoResponse: response.data.calledNoResponse,
                    refertoBM: response.data.refertoBM,
                    shortlisted: response.data.shortlisted,
                    requestedForPayment: response.data.requestedForPayment,
                    total: response.data.total
                });
            })
            .catch(error => {
                console.error('Error fetching card summary:', error);
            });
    };

    const fetchAllTuitions = async () => {
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/tuition/all');
            setAllTuitionList(response.data);
        } catch (err) {
            console.error('Error fetching tuitions:', err);
            toast.error("Failed to load tuitions.");
        }
    };

    const handleExportToExcel = () => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
        const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');

        const fileName = `TuitionList_${formattedDate}_${formattedTime}`;

        const tableHeaders = [
            "Tuition Code", "Name", "Phone", "Institute", "Department", "Address",
            "Status", "Comment", "Applied At", "Comment For Teacher"
        ];

        const tableData = filteredTuitionList.map(tuition => [
            String(tuition.tuitionCode ?? ""),
            String(tuition.name ?? ""),
            String(tuition.phone ?? ""),
            String(tuition.institute ?? ""),
            String(tuition.department ?? ""),
            String(tuition.address ?? ""),
            String(tuition.status ?? ""),
            String(tuition.comment ?? ""),
            String(tuition.appliedAt ?? ""),
            String(tuition.commentForTeacher ?? "")
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);

        worksheet['!cols'] = [
            { wpx: 100 },  // Tuition Code
            { wpx: 50 },   // Published
            { wpx: 50 },   // Urgent
            { wpx: 150 },  // Wanted Teacher
            { wpx: 100 },  // Student
            { wpx: 50 },   // Class
            { wpx: 80 },   // Medium
            { wpx: 100 },
            { wpx: 50 },
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tuition Applications");

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const handleSaveTuition = async () => {
        const selectedTuition = allTuitionList.find(tuition => tuition._id === tuitionData.tuitionId);

        const updatedTuitionData = {
            ...tuitionData,
            tuitionCode: selectedTuition.tuitionCode,
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
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/tuitionApply/delete/${id}`);
                toast.success("Tuition record deleted successfully!");
                fetchTuitionApplyRecords();
            } catch (err) {
                console.error('Error deleting tuition apply record:', err);
                toast.error("Error deleting tuition apply record.");
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
                    <Button variant="primary" onClick={() => { setShowModal(true); setEditingId(null); setTuitionData({ tuitionCode: '', name: '', phone: '', institute: '', department: '', address: '', status: '', comment: '', commentForTeacher: '' }) }}>
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
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Referred To BM</span>
                                        <span>{statusCounts.refertoBM}</span>
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
                            value={tuitionCodeSearch}
                            onChange={(e) => {
                                setCurrentPage(1);
                                setTuitionCodeSearch(e.target.value);
                            }}
                        />
                    </Col>

                    <Col md={3}>
                        <Form.Label className="fw-bold">Search by Phone</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g. 017xxxxxxxx"
                            value={phoneSearch}
                            onChange={(e) => {
                                setCurrentPage(1);
                                setPhoneSearch(e.target.value);
                            }}
                        />
                    </Col>

                    <Col md={3}>
                        <Form.Label className="fw-bold">Status Filter</Form.Label>
                        <Form.Select
                            value={statusFilter}
                            onChange={(e) => {
                                setCurrentPage(1);
                                setStatusFilter(e.target.value);
                            }}
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="called (interested)">Called (Interested)</option>
                            <option value="called (no response)">Called (No Response)</option>
                            <option value="called (guardian no response)">Called Guardian(No Response)</option>
                            <option value="cancel">Cancelled</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="requested for payment">Requested for Payment</option>
                            <option value="meet to office">Meet to office</option>
                            <option value="selected">Selected</option>
                            <option value="refer to bm">Refer to BM</option>
                        </Form.Select>
                    </Col>

                    <Col md={3} className="d-flex align-items-end">
                        <Button variant="danger" onClick={() => {
                            setTuitionCodeSearch('');
                            setPhoneSearch('');
                            setStatusFilter('');
                            setCurrentPage(1);
                        }} className="w-100">
                            Reset
                        </Button>
                    </Col>
                </Row>

                <Button variant="success" className="mb-3" onClick={handleExportToExcel}>
                    Export to Excel
                </Button>

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Tuition List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Applied At</th>
                                        <th>Status</th>
                                        <th>Premium Code</th>
                                        <th>Tuition Code</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Institute</th>
                                        <th>Department</th>
                                        <th>Address</th>
                                        <th>Comment</th>
                                        <th>Comment For Teacher</th>
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
                                                <td>{index + 1}</td>
                                                <td>{tuition.appliedAt ? formatDate(tuition.appliedAt) : ''}</td>
                                                <td>
                                                    <span
                                                        className={`badge 
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
                                                            }
                                                                `}
                                                    >
                                                        {tuition.status}
                                                    </span>
                                                </td>
                                                <td>{tuition.premiumCode}</td>
                                                <td>{tuition.tuitionCode}</td>
                                                <td>{tuition.name}</td>
                                                <td>{tuition.phone}</td>
                                                <td>{tuition.institute}</td>
                                                <td>{tuition.department}</td>
                                                <td>{tuition.address}</td>
                                                <td>{tuition.comment}</td>
                                                <td>{tuition.commentForTeacher}</td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                    <Button variant="warning" onClick={() => handleEditTuition(tuition)} className="mr-2">
                                                        <FaEdit />
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleDeleteTuition(tuition._id)}>
                                                        <FaTrashAlt />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </Table>
                        </div>
                        <div className="d-flex justify-content-center my-3">
                            <Button
                                variant="secondary"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="mx-2"
                            >
                                Previous
                            </Button>
                            <span className="fw-bold align-self-center">Page {currentPage} of {totalPages}</span>
                            <Button
                                variant="secondary"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="mx-2"
                            >
                                Next
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
                                    <Form.Group controlId="tuitionId">
                                        <Form.Label className="fw-bold">Tuition Code</Form.Label>
                                        <Select
                                            options={allTuitionList.map(tuition => ({
                                                value: tuition._id,
                                                label: tuition.tuitionCode
                                            }))}
                                            value={allTuitionList.find(tuition => tuition._id === tuitionData.tuitionId) ? {
                                                value: allTuitionList.find(tuition => tuition._id === tuitionData.tuitionId)._id,
                                                label: allTuitionList.find(tuition => tuition._id === tuitionData.tuitionId).tuitionCode
                                            } : null}

                                            onChange={(selectedOption) => setTuitionData({ ...tuitionData, tuitionId: selectedOption.value })}
                                            placeholder="Select Tuition Code"
                                            isSearchable
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
                                <Col md={4}>
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
                                <Col md={4}>
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
                                <Col md={4}>
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
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSaveTuition}>Save</Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer />
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
