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

const RefundPage = () => {
    const [refundList, setRefundList] = useState([]);
    const [filteredRefundList, setFilteredRefundList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [refundData, setRefundData] = useState({
        tuitionCode: '',
        paymentType: '',
        paymentNumber: '',
        personalPhone: '',
        amount: '',
        name: '',
        note: '',
        comment: '',
        status: '',
        commentFromAgent: ''
    });
    const [tuitionCodeSearchQuery, setTuitionCodeSearchQuery] = useState('');
    const [paymentPhoneSearchQuery, setPaymentPhoneSearchQuery] = useState('');
    const [personalPhoneSearchQuery, setPersonalPhoneSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [statusCounts, setStatusCounts] = useState({
        pending: 0,
        underReview: 0,
        approved: 0,
        rejected: 0,
        completed: 0,
        cancelled: 0
    });
    const role = localStorage.getItem('role');
    useEffect(() => {
        fetchRefundApplyRecords();
    }, []);

    useEffect(() => {
        let filteredData = refundList;
        if (tuitionCodeSearchQuery) {
            filteredData = filteredData.filter(tuition =>
                tuition.tuitionCode.toLowerCase().includes(tuitionCodeSearchQuery.toLowerCase())
            );
        }
        if (paymentPhoneSearchQuery) {
            filteredData = filteredData.filter(tuition =>
                String(tuition.paymentNumber).trim().toLowerCase().includes(String(paymentPhoneSearchQuery).trim().toLowerCase())
            );
        }

        if (personalPhoneSearchQuery) {
            filteredData = filteredData.filter(tuition =>
                String(tuition.personalPhone).trim().toLowerCase().includes(String(personalPhoneSearchQuery).trim().toLowerCase())
            );
        }

        if (statusFilter) {
            filteredData = filteredData.filter(tuition => tuition.status === statusFilter);
        }

        const statusCounts = filteredData.reduce((counts, tuition) => {
            if (tuition.status === 'pending') counts.pending++;
            if (tuition.status === 'under review') counts.underReview++;
            if (tuition.status === 'approved') counts.approved++;
            if (tuition.status === 'rejected') counts.rejected++;
            if (tuition.status === 'completed') counts.completed++;
            if (tuition.status === 'cancelled') counts.cancelled++;
            return counts;
        }, {
            pending: 0,
            underReview: 0,
            approved: 0,
            rejected: 0,
            completed: 0,
            cancelled: 0
        });

        setStatusCounts(statusCounts);

        setFilteredRefundList(filteredData);
    }, [tuitionCodeSearchQuery, paymentPhoneSearchQuery, personalPhoneSearchQuery, statusFilter, refundList]);

    const fetchRefundApplyRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/refund/all');
            setRefundList(response.data);
            setFilteredRefundList(response.data);
        } catch (err) {
            console.error('Error:', err);
            toast.error("Failed.");
        }
        setLoading(false);
    };

    const handleExportToExcel = () => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
        const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');

        const fileName = `Refund List_${formattedDate}_${formattedTime}`;

        const tableHeaders = [
            "Applied At",
            "Status",
            "Tuition Code",
            "Created By",
            "Updated By",
            "Payment Number Type",
            "Payment Number",
            "Name",
            "Return Amount",
            "Personal Phone",
            "Comment (Teacher)",
            "Comment From Agent"
        ];

        const tableData = filteredRefundList.map(item => [
            item.requestedAt ? formatDate(item.requestedAt) : "",
            String(item.status ?? ""),
            String(item.tuitionCode ?? ""),
            String(item.createdBy ?? ""),
            String(item.updatedBy ?? ""),
            String(item.paymentType ?? ""),
            String(item.paymentNumber ?? ""),
            String(item.name ?? ""),
            String(item.amount ?? ""),
            String(item.personalPhone ?? ""),
            String(item.note ?? ""),
            String(item.commentFromAgent ?? "")
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);

        worksheet['!cols'] = [
            { wpx: 100 },
            { wpx: 80 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 90 },
            { wpx: 110 },
            { wpx: 110 },
            { wpx: 120 },
            { wpx: 90 },
            { wpx: 120 },
            { wpx: 140 },
            { wpx: 140 },
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Refund Applications");

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const handleSaveRequest = async () => {
        const username = localStorage.getItem('username');
        const updatedTuitionData = {
            ...refundData,
            status: refundData.status ? refundData.status : "pending"
        };
        try {
            if (editingId) {
                const updatedData = {
                    ...updatedTuitionData,
                    updatedBy: username
                };
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/refund/edit/${editingId}`, updatedData);
                toast.success("Refund record updated successfully!");
            } else {
                const newData = {
                    ...updatedTuitionData,
                    createdBy: username
                };
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/refund/add', newData);
                toast.success("Refund record updated successfully!");
            }
            setShowModal(false);
            fetchRefundApplyRecords();
        } catch (err) {
            console.error('Error:', err);
            toast.error("Error.");
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

    const handleEditApply = (data) => {
        setRefundData(data);
        setEditingId(data._id);
        setShowModal(true);
    };

    const handleDeleteRecord = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this  record?");

        if (confirmDelete) {
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/refund/delete/${id}`);
                toast.success("Tuition record deleted successfully!");
                fetchRefundApplyRecords();
            } catch (err) {
                console.error('Error deleting apply record:', err);
                toast.error("Error deleting apply record.");
            }
        } else {
            toast.info("Deletion canceled");
        }
    };

    const handleResetFilters = () => {
        setTuitionCodeSearchQuery('');
        setPersonalPhoneSearchQuery('');
        setPaymentPhoneSearchQuery('');
        setStatusFilter('');
        setFilteredRefundList(refundList);
    };

    return (
        <>
            <NavBarPage />
            <Container>
                <Header>
                    <h2 className='text-primary fw-bold'>Refund Applications</h2>
                    <Button variant="primary" onClick={() => { setShowModal(true); setEditingId(null); setRefundData({ tuitionCode: '', paymentType: '', paymentNumber: '', personalPhone: '', amount: '', name: '', note: '', status: '', commentFromAgent: '' }) }}>
                        Create Refund
                    </Button>
                </Header>
                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-dark">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-dark" style={{ fontWeight: 'bolder' }}>Total Applied</span>
                                        <span>{filteredRefundList.length}</span>
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
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Under Review</span>
                                        <span>{statusCounts.underReview}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Approved</span>
                                        <span>{statusCounts.approved}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Rejected</span>
                                        <span>{statusCounts.rejected}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Completed</span>
                                        <span>{statusCounts.completed}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                {/* Search bar */}
                <Row className="mt-2 mb-3">
                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Tuition Code)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Tuition Code"
                            value={tuitionCodeSearchQuery}
                            onChange={(e) => setTuitionCodeSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Payment Phone Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Phone Number"
                            value={paymentPhoneSearchQuery}
                            onChange={(e) => setPaymentPhoneSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Personal Phone Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Phone Number"
                            value={personalPhoneSearchQuery}
                            onChange={(e) => setPersonalPhoneSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Status</Form.Label>
                        <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="under review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </Form.Select>
                    </Col>

                    <Col md={1} className="d-flex align-items-end">
                        <Button variant="danger" onClick={handleResetFilters} className="w-100">
                            Reset Filters
                        </Button>
                    </Col>

                </Row>

                {role === "superadmin" && (
                    <Button
                        variant="success"
                        className="mb-3"
                        onClick={handleExportToExcel}
                    >
                        Export to Excel
                    </Button>
                )}

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Request List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Applied At</th>
                                        <th>Status</th>
                                        <th>Tuition Code</th>
                                        <th>Created By</th>
                                        <th>Updated By</th>
                                        <th>Payment Number Type</th>
                                        <th>Payment Number</th>
                                        <th>Name</th>
                                        <th>Return Amount</th>
                                        <th>Personal Phone Number</th>
                                        <th>Comment (Teacher)</th>
                                        <th>Comment From Agent</th>
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
                                        filteredRefundList.slice().reverse().map((item, index) => (
                                            <tr key={item._id}>
                                                <td>{index + 1}</td>
                                                <td>{item.requestedAt ? formatDate(item.requestedAt) : ''}</td>
                                                <td>
                                                    <span
                                                        className={`badge 
                                                        ${item.status === "pending" ? "bg-warning text-dark" :           // Yellow
                                                                item.status === "under review" ? "bg-info" :                // Blue
                                                                    item.status === "approved" ? "bg-primary" :                       // Light blue
                                                                        item.status === "rejected" ? "bg-danger" :                     // Red
                                                                            item.status === "completed" ? "bg-success" :                   // Green ✅
                                                                                item.status === "cancelled" ? "bg-secondary text-white" :      // Gray
                                                                                    "bg-light text-dark"                                           // Default fallback
                                                            }`}
                                                    >

                                                        {item.status}
                                                    </span>
                                                </td>

                                                <td>{item.tuitionCode}</td>
                                                <td>{item.createdBy || '-'}</td>
                                                <td>{item.updatedBy || '-'}</td>
                                                <td>{item.paymentType}</td>
                                                <td>{item.paymentNumber}</td>
                                                <td>{item.name}</td>
                                                <td>{item.amount}</td>
                                                <td>{item.personalPhone}</td>
                                                <td>{item.note}</td>
                                                <td>{item.commentFromAgent}</td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                    <Button variant="warning" onClick={() => handleEditApply(item)} className="mr-2">
                                                        <FaEdit />
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleDeleteRecord(item._id)}>
                                                        <FaTrashAlt />
                                                    </Button>
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
                        <Modal.Title className="fw-bold">{editingId ? "Edit Refund Record" : "Create Refund Record"}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="tuitionCode">
                                        <Form.Label className="fw-bold">Tuition Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={refundData.tuitionCode}
                                            onChange={(e) => setRefundData({ ...refundData, tuitionCode: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="paymentType">
                                        <Form.Label className="fw-bold">Payment Number Type</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={refundData.paymentType}
                                            onChange={(e) => setRefundData({ ...refundData, paymentType: e.target.value })}
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="bkash">Bkash Personal</option>
                                            <option value="nagad">Nagad Personal</option>
                                            <option value="cash">Cash</option>
                                        </Form.Control>

                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="paymentNumber">
                                        <Form.Label className="fw-bold">Payment Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={refundData.paymentNumber}
                                            onChange={(e) => setRefundData({ ...refundData, paymentNumber: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="name">
                                        <Form.Label className="fw-bold">Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={refundData.name}
                                            onChange={(e) => setRefundData({ ...refundData, name: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="personalPhone">
                                        <Form.Label className="fw-bold">Personal Phone No.</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={refundData.personalPhone}
                                            onChange={(e) => setRefundData({ ...refundData, personalPhone: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="amount">
                                        <Form.Label className="fw-bold">Amount</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={refundData.amount}
                                            onChange={(e) => setRefundData({ ...refundData, amount: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="status">
                                        <Form.Label className="fw-bold">Status</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={refundData.status}
                                            onChange={(e) => setRefundData({ ...refundData, status: e.target.value })}
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="pending">Pending</option>
                                            <option value="under review">Under Review</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </Form.Control>

                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="note">
                                        <Form.Label className="fw-bold">Comment From Teacher</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={refundData.note}
                                            onChange={(e) => setRefundData({ ...refundData, note: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="commentFromAgent">
                                        <Form.Label className="fw-bold">Comment From Agent</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={refundData.commentFromAgent}
                                            onChange={(e) => setRefundData({ ...refundData, commentFromAgent: e.target.value })}
                                            required
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

                <ToastContainer />
            </Container>
        </>
    );
};

export default RefundPage;

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
