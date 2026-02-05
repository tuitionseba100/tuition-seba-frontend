import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaInfoCircle, FaBell, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const PaymentPage = () => {
    const [paymentList, setPaymentList] = useState([]);
    const [filteredPaymentList, setFilteredPaymentList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [paymentData, setPaymentData] = useState({
        tuitionCode: '',
        tuitionId: '',
        paymentReceivedDate: '',
        duePayDate: '',
        tutorName: '',
        tutorNumber: '',
        paymentNumber: '',
        paymentType: '',
        receivedTk: '',
        totalReceivedTk: '',
        duePayment: '',
        paymentStatus: '',
        comment: '',
    });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchInputs, setSearchInputs] = useState({
        tuitionCode: '',
        tutorNumber: '',
        paymentNumber: '',
        paymentStatus: '',
        paymentType: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        tuitionCode: '',
        tutorNumber: '',
        paymentNumber: '',
        paymentStatus: '',
        paymentType: ''
    });

    const [summaryCounts, setSummaryCounts] = useState({
        totalPaymentsCount: 0,
        totalPaymentTK: 0,
        totalPaymentsTodayCount: 0,
        totalPaymentTKToday: 0,
        totalDues: 0,
        totalDuesCount: 0
    });

    const [totalPaymentTK, setTotalPaymentTK] = useState(0);
    const [totalPaymentsCount, setTotalPaymentsCount] = useState(0);
    const [totalPaymentTKToday, setTotalPaymentTKToday] = useState(0);
    const [totalPaymentsTodayCount, setTotalPaymentsTodayCount] = useState(0);
    const [totalDues, setTotalDues] = useState(0);
    const [totalDuesCount, setTotalDuesCount] = useState(0);
    const [dueTodayList, setDueTodayList] = useState([]);
    const [showDueModal, setShowDueModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedExportStatus, setSelectedExportStatus] = useState('');
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchPaymentRecords();
    }, []);

    useEffect(() => {
        fetchPaymentRecords();
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

    const handleResetFilters = () => {
        const resetFilters = {
            tuitionCode: '',
            tutorNumber: '',
            paymentNumber: '',
            paymentStatus: '',
            paymentType: ''
        };
        setSearchInputs(resetFilters);
        setAppliedFilters(resetFilters);
        setCurrentPage(1);
    };

    const fetchPaymentRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/payment/getTableData', {
                params: {
                    page: currentPage,
                    tuitionCode: appliedFilters.tuitionCode,
                    tutorNumber: appliedFilters.tutorNumber,
                    paymentNumber: appliedFilters.paymentNumber,
                    paymentStatus: appliedFilters.paymentStatus,
                    paymentType: appliedFilters.paymentType
                }
            });

            setPaymentList(response.data.data);
            setFilteredPaymentList(response.data.data);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);

            // Fetch summary data
            fetchSummary();
        } catch (err) {
            console.error('Error fetching payment records:', err);
            toast.error("Failed to load payment records.");
        }
        setLoading(false);
    };

    const fetchSummary = async () => {
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/payment/summary', {
                params: {
                    tuitionCode: appliedFilters.tuitionCode,
                    tutorNumber: appliedFilters.tutorNumber,
                    paymentNumber: appliedFilters.paymentNumber,
                    paymentStatus: appliedFilters.paymentStatus,
                    paymentType: appliedFilters.paymentType
                }
            });

            setSummaryCounts(res.data);
            setTotalPaymentsCount(res.data.totalPaymentsCount);
            setTotalPaymentTK(res.data.totalPaymentTK);
            setTotalPaymentsTodayCount(res.data.totalPaymentsTodayCount);
            setTotalPaymentTKToday(res.data.totalPaymentTKToday);
            setTotalDues(res.data.totalDues);
            setTotalDuesCount(res.data.totalDuesCount);
        } catch (err) {
            console.error('Error fetching summary:', err);
        }
    };

    const handleExportToExcel = async () => {
        setShowExportModal(true);
    };

    const handleExportWithStatus = async () => {
        if (selectedExportStatus) {
            try {
                const statusForFileName = selectedExportStatus.replace(/\s+/g, '_').toLowerCase();
                const link = document.createElement('a');
                link.href = `https://tuition-seba-backend-1.onrender.com/api/payment/exportData?paymentStatus=${selectedExportStatus}`;
                link.target = '_blank';
                link.download = selectedExportStatus.toLowerCase() === 'all'
                    ? 'payments_all.csv'
                    : `payments_${statusForFileName}.csv`;

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

    useEffect(() => {
        const fetchTuitionAlertToday = async () => {
            try {
                const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/payment/alert-today');
                setDueTodayList(res.data);
            } catch (err) {
                console.error('Error fetching tuition due today:', err);
                toast.error("Failed to load tuition alerts for today.");
            }
        };

        fetchTuitionAlertToday();
    }, []);

    const formatDate = (isoString) => {
        if (!isoString) return '';

        const localString = isoString.endsWith('Z') ? isoString.slice(0, -1) : isoString;

        const dt = new Date(localString);

        if (isNaN(dt)) return isoString;

        return dt.toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };



    const handleSavePayment = async () => {
        if (!paymentData.tuitionId || paymentData.tuitionId.trim() === '') {
            toast.error("Please enter a tuition code.");
            return;
        }

        const username = localStorage.getItem('username');

        const updatedPaymentData = {
            ...paymentData,
            tuitionCode: paymentData.tuitionId
        };

        try {
            if (editingId) {
                updatedPaymentData.updatedBy = username;
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/payment/edit/${editingId}`, updatedPaymentData);
                toast.success("Payment record updated successfully!");
            } else {
                updatedPaymentData.createdBy = username;
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/payment/add', updatedPaymentData);
                toast.success("Payment record created successfully!");
            }
            setShowModal(false);
            fetchPaymentRecords();
        } catch (err) {
            console.error('Error saving payemnt record:', err);
            toast.error("Error saving payment record.");
        }
    };

    const handleEditPayment = (payment) => {
        setPaymentData(payment);
        setEditingId(payment._id);
        setShowModal(true);
    };

    const handleDeletePayment = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this payment record?");

        if (confirmDelete) {
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/payment/delete/${id}`);
                toast.success("Payment record deleted successfully!");
                fetchPaymentRecords();
            } catch (err) {
                console.error('Error deleting payment record:', err);
                toast.error("Error deleting payment record.");
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
                    <h2 className='text-primary fw-bold'>Payment Dashboard</h2>
                    <Button variant="primary" onClick={() => { setShowModal(true); setEditingId(null); setPaymentData({ tuitionCode: '', tuitionId: '', paymentReceivedDate: '', paymentType: '', transactionId: '', receivedTk: '', duePayment: '', comment: '' }) }}>
                        Create Payment Record
                    </Button>
                </Header>

                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total payments Count</span>
                                        <span>{totalPaymentsCount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        {role === 'superadmin' ? (
                                            <>
                                                <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Payments(TK)</span>
                                                <span>TK. {totalPaymentTK}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>&nbsp;</span>
                                                <span>&nbsp;</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Payments Count Today</span>
                                        <span>{totalPaymentsTodayCount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Payments(TK) Today</span>
                                        <span>TK. {totalPaymentTKToday}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Dues Count</span>
                                        <span>{totalDuesCount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        {role === 'superadmin' ? (
                                            <>
                                                <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Dues(TK)</span>
                                                <span>TK. {totalDues}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>&nbsp;</span>
                                                <span>&nbsp;</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Card.Body>
                </Card>

                {/* Search bar */}
                <Row className="mt-2 mb-3">
                    <Col md={2}>
                        <Form.Label className="fw-bold">Payment Status</Form.Label>
                        <Form.Select
                            value={searchInputs.paymentStatus}
                            onChange={(e) => handleSearchInputChange('paymentStatus', e.target.value)}
                            onKeyPress={handleKeyPress}
                        >
                            <option value="">All</option>
                            <option value="pending payment">Pending Payment</option>
                            <option value="pending due">Pending Due</option>
                            <option value="fully paid">Fully Paid</option>
                        </Form.Select>
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Tuition Code)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Tuition Code"
                            value={searchInputs.tuitionCode}
                            onChange={(e) => handleSearchInputChange('tuitionCode', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Teacher Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Teacher Number"
                            value={searchInputs.tutorNumber}
                            onChange={(e) => handleSearchInputChange('tutorNumber', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Payment Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Payment Number"
                            value={searchInputs.paymentNumber}
                            onChange={(e) => handleSearchInputChange('paymentNumber', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>

                    <Col md={2} className="d-flex align-items-end">
                        <Button
                            variant="success"
                            onClick={handleSearch}
                            className="w-100"
                            disabled={loading}
                        >
                            Search
                        </Button>
                    </Col>

                    <Col md={2} className="d-flex align-items-end">
                        <Button
                            variant="danger"
                            onClick={handleResetFilters}
                            className="w-100"
                        >
                            Reset
                        </Button>
                    </Col>
                </Row>

                <div className="d-flex align-items-center justify-content-center">
                    <h5 className="me-3 d-flex align-items-center gap-2">
                        <FaBell className="text-primary" />
                        <span>Due to be paid today: {dueTodayList.length}</span>
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
                        className="mb-3 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleExportToExcel}
                    >
                        Export to CSV
                    </Button>
                )}

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Payment List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Tuition Code</th>
                                        <th>Created By</th>
                                        <th>Updated By</th>
                                        <th>Payment Status</th>
                                        <th>Payment Received Date</th>
                                        <th>Due Payment Date</th>
                                        <th>Teacher Name</th>
                                        <th>Teacher Number</th>
                                        <th>Payment Number</th>
                                        <th>Payment Type</th>
                                        <th>Last Received TK</th>
                                        <th>Due TK</th>
                                        <th>Total Received TK</th>
                                        <th>Comment</th>
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
                                        filteredPaymentList.map((payment, index) => (
                                            <tr key={payment._id}>
                                                <td>{(currentPage - 1) * 50 + index + 1}</td>
                                                <td>{payment.tuitionCode}</td>
                                                <td>{payment.createdBy}</td>
                                                <td>{payment.updatedBy}</td>
                                                <td>
                                                    <span
                                                        className={`badge 
                                                            ${payment.paymentStatus === "pending payment" ? "bg-danger" : ""}  
                                                            ${payment.paymentStatus === "pending due" ? "bg-info text-dark" : ""}  
                                                            ${payment.paymentStatus === "fully paid" ? "bg-success" : ""}`}
                                                    >
                                                        {payment.paymentStatus}
                                                    </span>
                                                </td>
                                                <td>{payment.paymentReceivedDate ? formatDate(payment.paymentReceivedDate) : ''}</td>
                                                <td>{payment.duePayDate ? formatDate(payment.duePayDate) : ''}</td>
                                                <td>{payment.tutorName}</td>
                                                <td>{payment.tutorNumber}</td>
                                                <td>{payment.paymentNumber}</td>
                                                <td>{payment.paymentType}</td>
                                                <td>{payment.receivedTk}</td>
                                                <td>{payment.duePayment}</td>
                                                <td>{payment.totalReceivedTk}</td>
                                                <td>{payment.comment}</td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                    <Button variant="warning" onClick={() => handleEditPayment(payment)} className="mr-2">
                                                        <FaEdit />
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleDeletePayment(payment._id)}>
                                                        <FaTrashAlt />
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

                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">{editingId ? "Edit Payment" : "Create Payment"}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="tuitionId">
                                        <Form.Label className="fw-bold">Tuition Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={paymentData.tuitionId}
                                            onChange={(e) => setPaymentData({ ...paymentData, tuitionId: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId="paymentReceivedDate">
                                        <Form.Label className="fw-bold">Payment Received Date</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={paymentData.paymentReceivedDate
                                                ? paymentData.paymentReceivedDate.slice(0, 16)
                                                : ''
                                            }
                                            onChange={(e) => {
                                                if (!e.target.value) {
                                                    setPaymentData({ ...paymentData, paymentReceivedDate: '' });
                                                } else {
                                                    const localDate = new Date(e.target.value);
                                                    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
                                                    setPaymentData({ ...paymentData, paymentReceivedDate: utcDate.toISOString() });
                                                }
                                            }}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="tutorName">
                                        <Form.Label className="fw-bold">Tutor Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={paymentData.tutorName}
                                            onChange={(e) => setPaymentData({ ...paymentData, tutorName: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="tutorNumber">
                                        <Form.Label className="fw-bold">Tutor Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={paymentData.tutorNumber}
                                            onChange={(e) => setPaymentData({ ...paymentData, tutorNumber: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="paymentNumber">
                                        <Form.Label className="fw-bold">Payment Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={paymentData.paymentNumber}
                                            onChange={(e) => setPaymentData({ ...paymentData, paymentNumber: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="receivedTk">
                                        <Form.Label className="fw-bold">Received Tk</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={paymentData.receivedTk}
                                            onChange={(e) => setPaymentData({ ...paymentData, receivedTk: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId="duePayment">
                                        <Form.Label className="fw-bold">Due Payment</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={paymentData.duePayment}
                                            onChange={(e) => setPaymentData({ ...paymentData, duePayment: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId="totalReceivedTk">
                                        <Form.Label className="fw-bold">Total Received</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={paymentData.totalReceivedTk}
                                            onChange={(e) => setPaymentData({ ...paymentData, totalReceivedTk: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="paymentType">
                                        <Form.Label className="fw-bold">Payment Type</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={paymentData.paymentType}
                                            onChange={(e) => setPaymentData({ ...paymentData, paymentType: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="paymentStatus">
                                        <Form.Label className="fw-bold">Payment Status</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={paymentData.paymentStatus}
                                            onChange={(e) => setPaymentData({ ...paymentData, paymentStatus: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Payment Status</option>
                                            <option value="pending payment">Pending Payment</option>
                                            <option value="pending due">Pending Due</option>
                                            <option value="fully paid">Fully Paid</option>

                                        </Form.Control>
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId="duePayDate">
                                        <Form.Label className="fw-bold">Due Payment Date</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={paymentData.duePayDate ? paymentData.duePayDate.slice(0, 16) : ''}
                                            onChange={(e) => {
                                                if (!e.target.value) {
                                                    setPaymentData({ ...paymentData, duePayDate: '' });
                                                } else {
                                                    const localDate = new Date(e.target.value);
                                                    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
                                                    setPaymentData({ ...paymentData, duePayDate: utcDate.toISOString() });
                                                }
                                            }}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="comment">
                                        <Form.Label className="fw-bold">Comment</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            value={paymentData.comment}
                                            onChange={(e) => setPaymentData({ ...paymentData, comment: e.target.value })}
                                            required
                                        />
                                    </Form.Group>

                                </Col>
                            </Row>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSavePayment}>Save</Button>
                    </Modal.Footer>
                </Modal>


                {/* Due Payments Modal */}
                <Modal show={showDueModal} onHide={() => setShowDueModal(false)} centered size="lg">
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="w-100 text-center fw-bold">
                            <FaBell className="text-warning" />
                            <span className="ms-2">Due Payments Today: {dueTodayList.length}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4 bg-light">
                        {dueTodayList.length > 0 ? (
                            <Table responsive striped bordered hover className="shadow-sm">
                                <thead className="bg-dark text-white text-center">
                                    <tr>
                                        <th>Payment Received Date</th>
                                        <th>Tuition Code</th>
                                        <th>Due Tk</th>
                                        <th>Teacher Name</th>
                                        <th>Teacher Number</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dueTodayList.map((payment, index) => (
                                        <tr key={index} className="align-middle text-center">
                                            <td>{payment.paymentReceivedDate ? formatDate(payment.paymentReceivedDate) : '-'}</td>
                                            <td>{payment.tuitionCode}</td>
                                            <td className="fw-bold text-danger">{payment.duePayment}</td>
                                            <td>{payment.tutorName}</td>
                                            <td>{payment.tutorNumber}</td>
                                            <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                <Button variant="warning" onClick={() => handleEditPayment(payment)} className="mr-2">
                                                    <FaEdit />
                                                </Button>
                                                <Button variant="danger" onClick={() => handleDeletePayment(payment._id)}>
                                                    <FaTrashAlt />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="text-center text-muted py-4">
                                <h5>No due payments to be paid today</h5>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>

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
                                <option value="pending payment">Pending Payment</option>
                                <option value="pending due">Pending Due</option>
                                <option value="fully paid">Fully Paid</option>
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

                <ToastContainer />
            </Container>
        </>
    );
};

export default PaymentPage;

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