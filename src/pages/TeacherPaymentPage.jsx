import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaPrint, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import PaymentInvoice from "../components/Invoice";

const TeacherPaymentPage = () => {
    const [filteredTeacherPaymentList, setFilteredTeacherPaymentList] = useState([]);
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [teacherEditingId, setTeacherEditingId] = useState(null);
    const [teacherPaymentData, setTeacherPaymentData] = useState({
        tuitionCode: '',
        paymentType: '',
        paymentNumber: '',
        transactionId: '',
        personalPhone: '',
        amount: '',
        discount: '',
        dueAmount: '',
        totalAmount: '',
        name: '',
        note: '',
        status: '',
    });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchInputs, setSearchInputs] = useState({
        tuitionCode: '',
        personalPhone: '',
        paymentNumber: '',
        status: '',
        paymentType: ''
    });
    const [appliedFilters, setAppliedFilters] = useState({
        tuitionCode: '',
        personalPhone: '',
        paymentNumber: '',
        status: '',
        paymentType: ''
    });
    const [totalTeacherPaymentTK, setTotalTeacherPaymentTK] = useState(0);
    const [totalTeacherPaymentsCount, setTotalTeacherPaymentsCount] = useState(0);
    const [totalTeacherPaymentTKToday, setTotalTeacherPaymentTKToday] = useState(0);
    const [totalTeacherPaymentsTodayCount, setTotalTeacherPaymentsTodayCount] = useState(0);
    const [totalTeacherApprovedPaymentsCount, setTotalTeacherApprovedPaymentsCount] = useState(0);
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedExportStatus, setSelectedExportStatus] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const role = localStorage.getItem('role');

    const handlePrintClick = (payment) => {
        setSelectedPayment(payment);
        setShowInvoiceModal(true);
    };

    const handleCloseModal = () => {
        setShowInvoiceModal(false);
        setSelectedPayment(null);
    };

    useEffect(() => {
        fetchTeacherPaymentRecords();
    }, []);

    useEffect(() => {
        fetchTeacherPaymentRecords();
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

    const fetchTeacherPaymentRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/teacherPayment/getTableData', {
                params: {
                    page: currentPage,
                    tuitionCode: appliedFilters.tuitionCode,
                    personalPhone: appliedFilters.personalPhone,
                    paymentNumber: appliedFilters.paymentNumber,
                    status: appliedFilters.status,
                    paymentType: appliedFilters.paymentType
                }
            });

            setFilteredTeacherPaymentList(response.data.data);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);

            fetchTeacherSummary();
        } catch (err) {
            console.error('Error fetching payment records:', err);
            toast.error("Failed to load payment records.");
        }
        setLoading(false);
    };

    const fetchTeacherSummary = async () => {
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/teacherPayment/summary', {
                params: {
                    tuitionCode: appliedFilters.tuitionCode,
                    personalPhone: appliedFilters.personalPhone,
                    paymentNumber: appliedFilters.paymentNumber,
                    status: appliedFilters.status,
                    paymentType: appliedFilters.paymentType
                }
            });

            setTotalTeacherPaymentsCount(res.data.totalPaymentsCount);
            setTotalTeacherPaymentTK(res.data.totalPayments);
            setTotalTeacherPaymentsTodayCount(res.data.totalPaymentsTodayCount);
            setTotalTeacherPaymentTKToday(res.data.totalPaymentsToday);
            setTotalTeacherApprovedPaymentsCount(res.data.totalApprovedPaymentsCount);
        } catch (err) {
            console.error('Error fetching summary:', err);
        }
    };

    const formatDate = (isoString) => {
        if (!isoString) return '-';

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

    const handleExportToCsv = async () => {
        setShowExportModal(true);
    };

    const handleExportWithStatus = async () => {
        if (selectedExportStatus) {
            try {
                const statusForFileName = selectedExportStatus.replace(/\s+/g, '_').toLowerCase();
                const link = document.createElement('a');
                link.href = `https://tuition-seba-backend-1.onrender.com/api/teacherPayment/exportData?status=${selectedExportStatus}`;
                link.target = '_blank';
                link.download = selectedExportStatus.toLowerCase() === 'all'
                    ? 'teacher_payments_all.csv'
                    : `teacher_payments_${statusForFileName}.csv`;

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

    const handleSaveTeacherPayment = async () => {
        if (!teacherPaymentData.tuitionCode || teacherPaymentData.tuitionCode.trim() === '') {
            toast.error("Please type a tuition code.");
            return;
        }

        const username = localStorage.getItem('username');
        
        try {
            if (teacherEditingId) {
                const updatedData = {
                    ...teacherPaymentData,
                    updatedBy: username
                };
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/teacherPayment/edit/${teacherEditingId}`, updatedData);
                toast.success("Teacher payment record updated successfully!");
            } else {
                const newData = {
                    ...teacherPaymentData,
                    createdBy: username
                };
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/teacherPayment/add', newData);
                toast.success("Teacher payment record created successfully!");
            }
            setShowTeacherModal(false);
            fetchTeacherPaymentRecords();
        } catch (err) {
            console.error('Error saving payment record:', err);
            toast.error("Error saving payment record.");
        }
    };

    const handleEditTeacherPayment = (payment) => {
        setTeacherPaymentData(payment);
        setTeacherEditingId(payment._id);
        setShowTeacherModal(true);
    };

    const handleTeacherDeletePayment = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this payment record?");

        if (confirmDelete) {
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/teacherPayment/delete/${id}`);
                toast.success("Payment record deleted successfully!");
                fetchTeacherPaymentRecords();
            } catch (err) {
                console.error('Error deleting payment record:', err);
                toast.error("Error deleting payment record.");
            }
        } else {
            toast.info("Deletion canceled");
        }
    };

    const handleTeacherResetFilters = () => {
        const resetFilters = {
            tuitionCode: '',
            personalPhone: '',
            paymentNumber: '',
            status: '',
            paymentType: ''
        };
        setSearchInputs(resetFilters);
        setAppliedFilters(resetFilters);
        setCurrentPage(1);
    };

    return (
        <>
            <NavBarPage />
            <Container>

                <Header>
                    <h2 className='text-primary fw-bold'>Teacher Payment Dashboard</h2>
                    <Button variant="primary" onClick={() => { setShowTeacherModal(true); setTeacherEditingId(null); setTeacherPaymentData({ tuitionCode: '', paymentType: '', paymentNumber: '', transactionId: '', personalPhone: '', amount: '', name: '', note: '', status: '' }) }}>
                        Create Teacher Payment Record
                    </Button>
                </Header>
                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total payments Count</span>
                                        <span>{totalTeacherPaymentsCount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        {role === 'superadmin' ? (
                                            <>
                                                <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Payments(TK)</span>
                                                <span>TK. {totalTeacherPaymentTK}</span>
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
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Approved Payments Count</span>
                                        <span>{totalTeacherApprovedPaymentsCount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Payments Count Today</span>
                                        <span>{totalTeacherPaymentsTodayCount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Payments(TK) Today</span>
                                        <span>TK. {totalTeacherPaymentTKToday}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Card.Body>
                </Card>

                <Row className="mt-2 mb-3">
                    <Col md={2}>
                        <Form.Label className="fw-bold">Payment Status</Form.Label>
                        <Form.Select
                            value={searchInputs.status}
                            onChange={(e) => handleSearchInputChange('status', e.target.value)}
                            onKeyPress={handleKeyPress}
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="under review">Under review</option>
                            <option value="received">Received</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="returned">Returned</option>
                            <option value="deposit">Deposit</option>
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
                            value={searchInputs.personalPhone}
                            onChange={(e) => handleSearchInputChange('personalPhone', e.target.value)}
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
                        <Button variant="danger" onClick={handleTeacherResetFilters} className="w-100">
                            Reset
                        </Button>
                    </Col>
                </Row>

                {role === "superadmin" && (
                    <Button variant="success" className="mb-3" onClick={handleExportToCsv}>
                        Export to CSV
                    </Button>
                )}

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Teacher Payment List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Created By</th>
                                        <th>Updated By</th>
                                        <th>Tuition Code</th>
                                        <th>Payment Status</th>
                                        <th>Submitted At</th>
                                        <th>Teacher Name</th>
                                        <th>Teacher Number</th>
                                        <th>Payment Number</th>
                                        <th>Transaction ID</th>
                                        <th>Payment Type</th>
                                        <th>Amount</th>
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
                                        filteredTeacherPaymentList.map((payment, index) => (
                                            <tr key={payment._id}>
                                                <td>{index + 1}</td>
                                                <td>{payment.createdBy || '-'}</td>
                                                <td>{payment.updatedBy || '-'}</td>
                                                <td>{payment.tuitionCode}</td>
                                                <td>
                                                    <span
                                                        className={`badge 
                                                            ${payment.status === "pending" ? "bg-primary" : ""}  
                                                            ${payment.status === "under review" ? "bg-warning" : ""}  
                                                            ${payment.status === "received" ? "bg-success" : ""}  
                                                            ${payment.status === "cancelled" ? "bg-danger" : ""}  
                                                            ${payment.status === "returned" ? "bg-info" : ""}  
                                                            ${payment.status === "deposit" ? "bg-primary" : ""}`}
                                                    >
                                                        {payment.status}
                                                    </span>

                                                </td>
                                                <td>{payment.requestedAt ? formatDate(payment.requestedAt) : ''}</td>
                                                <td>{payment.name}</td>
                                                <td>{payment.personalPhone}</td>
                                                <td>{payment.paymentNumber}</td>
                                                <td>{payment.transactionId}</td>
                                                <td>{payment.paymentType}</td>
                                                <td>{payment.amount}</td>
                                                <td>{payment.note}</td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                    <Button variant="warning" onClick={() => handleEditTeacherPayment(payment)} className="mr-2">
                                                        <FaEdit />
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleTeacherDeletePayment(payment._id)}>
                                                        <FaTrashAlt />
                                                    </Button>
                                                    <Button variant="info" onClick={() => handlePrintClick(payment)}>
                                                        <FaPrint />
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

                {/* Teacher Create/Edit Payment Modal */}
                <Modal show={showTeacherModal} onHide={() => setShowTeacherModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">
                            {teacherEditingId ? "Edit Teacher Payment" : "Create Teacher Payment"}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="tuitionId">
                                        <Form.Label className="fw-bold">Tuition Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={teacherPaymentData.tuitionCode}
                                            onChange={(e) =>
                                                setTeacherPaymentData({ ...teacherPaymentData, tuitionCode: e.target.value })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="paymentType">
                                        <Form.Label className="fw-bold">Payment Type</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={teacherPaymentData.paymentType}
                                            onChange={(e) =>
                                                setTeacherPaymentData({ ...teacherPaymentData, paymentType: e.target.value })
                                            }
                                            required
                                        >
                                            <option value="">Select Payment type</option>
                                            <option value="bkash">Bkash</option>
                                            <option value="nagad">Nagad</option>
                                            <option value="cash">Cash</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="paymentNumber">
                                        <Form.Label className="fw-bold">Payment Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={teacherPaymentData.paymentNumber}
                                            onChange={(e) =>
                                                setTeacherPaymentData({ ...teacherPaymentData, paymentNumber: e.target.value })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="transactionId">
                                        <Form.Label className="fw-bold">Transaction ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={teacherPaymentData.transactionId}
                                            onChange={(e) =>
                                                setTeacherPaymentData({ ...teacherPaymentData, transactionId: e.target.value })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="amount">
                                        <Form.Label className="fw-bold">Payment Amount</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={teacherPaymentData.amount}
                                            onChange={(e) =>
                                                setTeacherPaymentData({ ...teacherPaymentData, amount: e.target.value })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="name">
                                        <Form.Label className="fw-bold">Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={teacherPaymentData.name}
                                            onChange={(e) =>
                                                setTeacherPaymentData({ ...teacherPaymentData, name: e.target.value })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="personalPhone">
                                        <Form.Label className="fw-bold">Contact Number/Whatsapp Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={teacherPaymentData.personalPhone}
                                            onChange={(e) =>
                                                setTeacherPaymentData({ ...teacherPaymentData, personalPhone: e.target.value })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="note">
                                        <Form.Label className="fw-bold">Note</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={teacherPaymentData.note}
                                            onChange={(e) =>
                                                setTeacherPaymentData({ ...teacherPaymentData, note: e.target.value })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col
                                    md={6}
                                    className="bg-warning bg-opacity-25 border border-warning rounded p-3 mb-3"
                                >
                                    <Form.Group controlId="status">
                                        <Form.Label className="fw-bold text-dark">Payment Status</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={teacherPaymentData.status}
                                            onChange={(e) =>
                                                setTeacherPaymentData({
                                                    ...teacherPaymentData,
                                                    status: e.target.value,
                                                })
                                            }
                                            required
                                            className="fw-semibold"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="under review">Under review</option>
                                            <option value="received">Received</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="returned">Returned</option>
                                            <option value="deposit">Deposit</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="discount">
                                        <Form.Label className="fw-bold">Discount</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={teacherPaymentData.discount}
                                            onChange={(e) =>
                                                setTeacherPaymentData({ ...teacherPaymentData, discount: e.target.value })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId="totalAmount">
                                        <Form.Label className="fw-bold">Total Amount</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={teacherPaymentData.totalAmount}
                                            onChange={(e) =>
                                                setTeacherPaymentData({ ...teacherPaymentData, totalAmount: e.target.value })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId="dueAmount">
                                        <Form.Label className="fw-bold">Due Amount</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={teacherPaymentData.dueAmount}
                                            onChange={(e) =>
                                                setTeacherPaymentData({ ...teacherPaymentData, dueAmount: e.target.value })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowTeacherModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveTeacherPayment}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer />
            </Container>

            {selectedPayment && (
                <PaymentInvoice
                    show={showInvoiceModal}
                    onClose={handleCloseModal}
                    payment={selectedPayment}
                />
            )}

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
                            <option value="under review">Under review</option>
                            <option value="received">Received</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="returned">Returned</option>
                            <option value="deposit">Deposit</option>
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
        </>
    );
};

export default TeacherPaymentPage;

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
