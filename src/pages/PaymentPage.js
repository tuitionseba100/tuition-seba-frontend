import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaInfoCircle, FaBell } from 'react-icons/fa';
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
        duePayment: '',
        paymentStatus: '',
        comment: '',
    });
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [tuitionCodeSearchQuery, setTuitionCodeSearchQuery] = useState('');
    const [teacherNumberSearchQuery, setTeacherNumberSearchQuery] = useState('');
    const [paymentNumberSearchQuery, setPaymentNumberSearchQuery] = useState('');
    const [tuitionList, setTuitionList] = useState([]);
    const [totalPaymentTK, setTotalPaymentTK] = useState(0);
    const [totalPaymentsCount, setTotalPaymentsCount] = useState(0);
    const [totalPaymentTKToday, setTotalPaymentTKToday] = useState(0);
    const [totalPaymentsTodayCount, setTotalPaymentsTodayCount] = useState(0);
    const [totalDues, setTotalDues] = useState(0);
    const [totalDuesCount, setTotalDuesCount] = useState(0);
    const [dueTodayList, setDueTodayList] = useState([]);
    const [showDueModal, setShowDueModal] = useState(false);

    useEffect(() => {
        fetchPaymentRecords();
        fetchTuitions();
    }, []);

    useEffect(() => {
        let filteredData = paymentList;
        if (statusFilter) {
            filteredData = filteredData.filter(payment => payment.paymentStatus === statusFilter);
        }

        if (tuitionCodeSearchQuery) {
            filteredData = filteredData.filter(payment =>
                String(payment.tuitionCode).toLowerCase().includes(String(tuitionCodeSearchQuery).toLowerCase())
            );
        }

        if (teacherNumberSearchQuery) {
            filteredData = filteredData.filter(tuition =>
                String(tuition.tutorNumber).toLowerCase().includes(String(teacherNumberSearchQuery).toLowerCase())
            );
        }

        if (paymentNumberSearchQuery) {
            filteredData = filteredData.filter(tuition =>
                String(tuition.paymentNumber).toLowerCase().includes(String(paymentNumberSearchQuery).toLowerCase())
            );
        }

        const totalCount = filteredData.length;
        const totalTk = filteredData.reduce((sum, payment) => sum + parseFloat(payment.receivedTk || 0), 0);
        const totalCountToday = filteredData.filter(payment => new Date(payment.paymentReceivedDate).toDateString() === new Date().toDateString()).length;
        const totalTkToday = filteredData.filter(payment => new Date(payment.paymentReceivedDate).toDateString() === new Date().toDateString())
            .reduce((sum, payment) => sum + parseFloat(payment.receivedTk || 0), 0);
        const totalDues = filteredData.reduce((sum, payment) => sum + parseFloat(payment.duePayment || 0), 0);
        const totalDuesCount = filteredData.filter(payment => parseFloat(payment.duePayment || 0) > 0).length;


        setTotalPaymentsCount(totalCount);
        setTotalPaymentTK(totalTk);
        setTotalPaymentsTodayCount(totalCountToday);
        setTotalPaymentTKToday(totalTkToday);
        setTotalDues(totalDues);
        setTotalDuesCount(totalDuesCount);

        setFilteredPaymentList(filteredData);
    }, [statusFilter, tuitionCodeSearchQuery, teacherNumberSearchQuery, paymentNumberSearchQuery, paymentList]);

    const fetchTuitions = async () => {
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/tuition/all');
            setTuitionList(response.data);
        } catch (err) {
            console.error('Error fetching tuitions:', err);
            toast.error("Failed to load tuitions.");
        }
    };

    const fetchPaymentRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/payment/all');
            setPaymentList(response.data);
            filterDuePayments(response.data);
            setFilteredPaymentList(response.data);
        } catch (err) {
            console.error('Error fetching payment records:', err);
            toast.error("Failed to load payment records.");
        }
        setLoading(false);
    };

    const filterDuePayments = (payments) => {
        const today = new Date().toISOString().split('T')[0];

        const dueToday = payments.filter(payment => {
            if (!payment.duePayDate) return false;

            const dueDateObj = new Date(payment.duePayDate);
            if (isNaN(dueDateObj.getTime())) return false;

            const dueDate = dueDateObj.toISOString().split('T')[0];
            return dueDate === today;
        });

        setDueTodayList(dueToday);
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

        const fileName = `Payment List_${formattedDate}_${formattedTime}`;

        const tableHeaders = [
            "Tuition Code", "Status", "Payment Received Date", "Due Payment Date", "Teacher Name", "Teacher Number", "Payment Number", "Payment Type", "Received TK", "Due TK", "Comment"
        ];

        const tableData = filteredPaymentList.map(payment => [
            String(payment.tuitionCode ?? ""),
            String(payment.paymentStatus ?? ""),
            payment.paymentReceivedDate ? formatDate(payment.paymentReceivedDate) : "",
            payment.duePayDate ? formatDate(payment.duePayDate) : "",
            String(payment.tutorName ?? ""),
            String(payment.tutorNumber ?? ""),
            String(payment.paymentNumber ?? ""),
            String(payment.paymentType ?? ""),
            String(payment.receivedTk ?? ""),
            String(payment.duePayment ?? ""),
            String(payment.comment ?? ""),
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);

        worksheet['!cols'] = [
            { wpx: 90 },  // Tuition Code
            { wpx: 140 },   // date
            { wpx: 140 },   // name
            { wpx: 100 },  // number
            { wpx: 100 },  //number
            { wpx: 100 },   // type
            { wpx: 100 },    // id
            { wpx: 80 },
            { wpx: 80 },
            { wpx: 140 },
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const handleSavePayment = async () => {
        if (!paymentData.tuitionId || paymentData.tuitionId.trim() === '') {
            toast.error("Please select a tuition code.");
            return;
        }

        const selectedTuition = tuitionList.find(tuition => tuition._id === paymentData.tuitionId);
        const updatedPaymentData = {
            ...paymentData,
            tuitionCode: selectedTuition.tuitionCode
        };
        console.log('Sending payment data:', updatedPaymentData);
        try {
            if (editingId) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/payment/edit/${editingId}`, updatedPaymentData);
                toast.success("Tuition record updated successfully!");
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/payment/add', updatedPaymentData);
                toast.success("Tuition record created successfully!");
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

    const handleResetFilters = () => {
        setStatusFilter('');
        setTuitionCodeSearchQuery('');
        setTeacherNumberSearchQuery('');
        setPaymentNumberSearchQuery('');
        setFilteredPaymentList(paymentList);
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
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Payments(TK)</span>
                                        <span>TK. {totalPaymentTK}</span>
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
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Dues(TK)</span>
                                        <span>TK. {totalDues}</span>
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
                        <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
                            value={tuitionCodeSearchQuery}
                            onChange={(e) => setTuitionCodeSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Teacher Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Teacher Number"
                            value={teacherNumberSearchQuery}
                            onChange={(e) => setTeacherNumberSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Payment Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Payment Number"
                            value={paymentNumberSearchQuery}
                            onChange={(e) => setPaymentNumberSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2} className="d-flex align-items-end">
                        <Button variant="danger" onClick={handleResetFilters} className="w-100">
                            Reset Filters
                        </Button>
                    </Col>

                </Row>

                <div className='d-flex align-items-center justify-content-center'>
                    <h5 className='me-3 d-flex align-items-center'>
                        Due to be paid today: {dueTodayList.length}{' '}
                        <OverlayTrigger
                            placement="top" // Position of the tooltip
                            overlay={<Tooltip id="tooltip">Click to see details</Tooltip>}
                        >
                            <Button size='sm' onClick={() => setShowDueModal(true)} className='ms-2'>
                                <FaInfoCircle />
                            </Button>
                        </OverlayTrigger>
                    </h5>
                </div>


                <Button variant="success" className="mb-3" onClick={handleExportToExcel}>
                    Export to Excel
                </Button>

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Payment List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Tuition Code</th>
                                        <th>Payment Status</th>
                                        <th>Payment Received Date</th>
                                        <th>Due Payment Date</th>
                                        <th>Teacher Name</th>
                                        <th>Teacher Number</th>
                                        <th>Payment Number</th>
                                        <th>Payment Type</th>
                                        <th>Received TK</th>
                                        <th>Due TK</th>
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
                                        filteredPaymentList.slice().reverse().map((payment, index) => (
                                            <tr key={payment._id}>
                                                <td>{index + 1}</td>
                                                <td>{payment.tuitionCode}</td>
                                                <td>
                                                    <span
                                                        className={`badge 
                                                            ${payment.paymentStatus === "pending payment" ? "bg-danger" : ""}  
                                                            ${payment.paymentStatus === "pending due" ? "bg-info text-dark" : ""}  
                                                            ${payment.paymentStatus === "fully paid" ? "bg-success" : ""}
                                                            `}
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
                    </Card.Body>
                </Card>

                {/* Create/Edit Payment Modal */}
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
                                        <Select
                                            options={tuitionList.map(tuition => ({
                                                value: tuition._id,
                                                label: tuition.tuitionCode
                                            }))}
                                            value={tuitionList.find(tuition => tuition._id === paymentData.tuitionId) ? {
                                                value: tuitionList.find(tuition => tuition._id === paymentData.tuitionId)._id,
                                                label: tuitionList.find(tuition => tuition._id === paymentData.tuitionId).tuitionCode
                                            } : null}

                                            onChange={(selectedOption) => setPaymentData({ ...paymentData, tuitionId: selectedOption.value })}
                                            placeholder="Select Tuition Code"
                                            isSearchable
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId="paymentReceivedDate">
                                        <Form.Label className="fw-bold">Payment Received Date</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={paymentData.paymentReceivedDate ? new Date(new Date(paymentData.paymentReceivedDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => setPaymentData({ ...paymentData, paymentReceivedDate: e.target.value })}
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
                                            type="text"
                                            value={paymentData.duePayment}
                                            onChange={(e) => setPaymentData({ ...paymentData, duePayment: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
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
                                            value={paymentData.duePayDate ? new Date(new Date(paymentData.duePayDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => setPaymentData({ ...paymentData, duePayDate: e.target.value })}
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
