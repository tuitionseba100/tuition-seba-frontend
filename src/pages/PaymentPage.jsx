import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaInfoCircle, FaBell, FaPrint } from 'react-icons/fa';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import PaymentInvoice from "../components/Invoice";

const PaymentPage = () => {
    const [paymentList, setPaymentList] = useState([]);
    const [filteredPaymentList, setFilteredPaymentList] = useState([]);
    const [teacherPaymentList, setTeacherPaymentList] = useState([]);
    const [filteredTeacherPaymentList, setFilteredTeacherPaymentList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [teacherEditingId, setTeacherEditingId] = useState(null);
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
    const [statusFilter, setStatusFilter] = useState('');
    const [tuitionCodeSearchQuery, setTuitionCodeSearchQuery] = useState('');
    const [teacherNumberSearchQuery, setTeacherNumberSearchQuery] = useState('');
    const [paymentNumberSearchQuery, setPaymentNumberSearchQuery] = useState('');

    const [teacherStatusFilter, setTeacherStatusFilter] = useState('');
    const [teacherTuitionCodeSearchQuery, setTeacherTuitionCodeSearchQuery] = useState('');
    const [teacherNumberTeacherSearchQuery, setTeacherNumberTeacherSearchQuery] = useState('');
    const [teacherPaymentNumberSearchQuery, setTeacherPaymentNumberSearchQuery] = useState('');

    const [totalPaymentTK, setTotalPaymentTK] = useState(0);
    const [totalPaymentsCount, setTotalPaymentsCount] = useState(0);
    const [totalTeacherPaymentTK, setTotalTeacherPaymentTK] = useState(0);
    const [totalTeacherPaymentsCount, setTotalTeacherPaymentsCount] = useState(0);
    const [totalTeacherPaymentTKToday, setTotalTeacherPaymentTKToday] = useState(0);
    const [totalTeacherPaymentsTodayCount, setTotalTeacherPaymentsTodayCount] = useState(0);
    const [totalPaymentTKToday, setTotalPaymentTKToday] = useState(0);
    const [totalPaymentsTodayCount, setTotalPaymentsTodayCount] = useState(0);
    const [totalDues, setTotalDues] = useState(0);
    const [totalDuesCount, setTotalDuesCount] = useState(0);
    const [dueTodayList, setDueTodayList] = useState([]);
    const [showDueModal, setShowDueModal] = useState(false);
    const role = localStorage.getItem('role');

    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    const handlePrintClick = (payment) => {
        setSelectedPayment(payment);
        setShowInvoiceModal(true);
    };

    const handleCloseModal = () => {
        setShowInvoiceModal(false);
        setSelectedPayment(null);
    };

    useEffect(() => {
        fetchPaymentRecords();
        fetchTeacherPaymentRecords();
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
        const totalTk = filteredData.reduce((sum, payment) => sum + parseFloat(payment.totalReceivedTk || 0), 0);
        const todayDateString = new Date().toISOString().split('T')[0];

        const totalCountToday = filteredData.filter(payment => {
            const paymentDateString = new Date(payment.paymentReceivedDate).toISOString().split('T')[0];
            return paymentDateString === todayDateString;
        }).length;

        const totalTkToday = filteredData
            .filter(payment => new Date(payment.paymentReceivedDate).toISOString().split('T')[0] === todayDateString)
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

    useEffect(() => {
        let filteredTeacherData = teacherPaymentList;
        if (teacherStatusFilter) {
            filteredTeacherData = filteredTeacherData.filter(payment => payment.status === teacherStatusFilter);
        }

        if (teacherTuitionCodeSearchQuery) {
            filteredTeacherData = filteredTeacherData.filter(payment =>
                String(payment.tuitionCode).toLowerCase().includes(String(teacherTuitionCodeSearchQuery).toLowerCase())
            );
        }

        if (teacherNumberTeacherSearchQuery) {
            filteredTeacherData = filteredTeacherData.filter(tuition =>
                String(tuition.personalPhone).toLowerCase().includes(String(teacherNumberTeacherSearchQuery).toLowerCase())
            );
        }

        if (teacherPaymentNumberSearchQuery) {
            filteredTeacherData = filteredTeacherData.filter(tuition =>
                String(tuition.paymentNumber).toLowerCase().includes(String(teacherPaymentNumberSearchQuery).toLowerCase())
            );
        }

        const totalCount = filteredTeacherData.length;
        const totalTk = filteredTeacherData.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);
        const todayDateString = new Date().toISOString().split('T')[0];

        const totalCountToday = filteredTeacherData.filter(payment => {
            const paymentDateString = new Date(payment.requestedAt).toISOString().split('T')[0];
            return paymentDateString === todayDateString;
        }).length;

        const totalTkToday = filteredTeacherData
            .filter(payment => new Date(payment.requestedAt).toISOString().split('T')[0] === todayDateString)
            .reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);


        setTotalTeacherPaymentsCount(totalCount);
        setTotalTeacherPaymentTK(totalTk);
        setTotalTeacherPaymentsTodayCount(totalCountToday);
        setTotalTeacherPaymentTKToday(totalTkToday);

        setFilteredTeacherPaymentList(filteredTeacherData);
    }, [teacherStatusFilter, teacherTuitionCodeSearchQuery, teacherNumberTeacherSearchQuery, teacherPaymentNumberSearchQuery, teacherPaymentList]);

    const fetchPaymentRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/payment/all');
            setPaymentList(response.data);
            setFilteredPaymentList(response.data);
        } catch (err) {
            console.error('Error fetching payment records:', err);
            toast.error("Failed to load payment records.");
        }
        setLoading(false);
    };

    const fetchTeacherPaymentRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/teacherPayment/all');
            setTeacherPaymentList(response.data);
            setFilteredTeacherPaymentList(response.data);
        } catch (err) {
            console.error('Error fetching payment records:', err);
            toast.error("Failed to load payment records.");
        }
        setLoading(false);
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

    const handleExportToExcel = () => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
        const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');

        const fileName = `Payment List_${formattedDate}_${formattedTime}`;

        const tableHeaders = [
            "Tuition Code", "Status", "Payment Received Date", "Due Payment Date", "Teacher Name", "Teacher Number", "Payment Number", "Payment Type", "Received TK", "Due TK", "Total Received TK", "Comment"
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
            String(payment.totalReceivedTk ?? ""),
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

    const handleTeacherTableExportToExcel = () => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
        const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');

        const fileName = `Teacher Payment List_${formattedDate}_${formattedTime}`;

        const tableHeaders = [
            "SL", "Tuition Code", "Payment Status", "Submitted At", "Teacher Name", "Teacher Number", "Payment Number", "Transaction ID", "Payment Type", "Amount", "Comment"
        ];

        const tableData = filteredTeacherPaymentList.slice().reverse().map((payment, index) => [
            index + 1,
            String(payment.tuitionCode ?? ""),
            String(payment.status ?? ""),
            payment.requestedAt ? formatDate(payment.requestedAt) : "",
            String(payment.name ?? ""),
            String(payment.personalPhone ?? ""),
            String(payment.paymentNumber ?? ""),
            String(payment.transactionId ?? ""),
            String(payment.paymentType ?? ""),
            String(payment.amount ?? ""),
            String(payment.comment ?? ""),
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);

        worksheet['!cols'] = [
            { wpx: 40 },  // SL
            { wpx: 90 },  // Tuition Code
            { wpx: 140 }, // Payment Status
            { wpx: 140 }, // Submitted At
            { wpx: 140 }, // Teacher Name
            { wpx: 100 }, // Teacher Number
            { wpx: 100 }, // Payment Number
            { wpx: 100 }, // Transaction ID
            { wpx: 100 }, // Payment Type
            { wpx: 80 },  // Amount
            { wpx: 140 }, // Comment
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Teacher Payments");

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };


    const handleSavePayment = async () => {
        if (!paymentData.tuitionId || paymentData.tuitionId.trim() === '') {
            toast.error("Please enter a tuition code.");
            return;
        }

        const updatedPaymentData = {
            ...paymentData,
            tuitionCode: paymentData.tuitionId
        };
        console.log('Sending payment data:', updatedPaymentData);
        try {
            if (editingId) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/payment/edit/${editingId}`, updatedPaymentData);
                toast.success("Payment record updated successfully!");
            } else {
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

    const handleSaveTeacherPayment = async () => {
        if (!teacherPaymentData.tuitionCode || teacherPaymentData.tuitionCode.trim() === '') {
            toast.error("Please type a tuition code.");
            return;
        }

        try {
            if (teacherEditingId) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/teacherPayment/edit/${teacherEditingId}`, teacherPaymentData);
                toast.success("Teacher payment record updated successfully!");
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/teacherPayment/add', teacherPaymentData);
                toast.success("Teacher payment record created successfully!");
            }
            setShowTeacherModal(false);
            fetchTeacherPaymentRecords();
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

    const handleEditTeacherPayment = (payment) => {
        setTeacherPaymentData(payment);
        setTeacherEditingId(payment._id);
        setShowTeacherModal(true);
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

    const handleResetFilters = () => {
        setStatusFilter('');
        setTuitionCodeSearchQuery('');
        setTeacherNumberSearchQuery('');
        setPaymentNumberSearchQuery('');
        setFilteredPaymentList(paymentList);
    };

    const handleTeacherResetFilters = () => {
        setTeacherStatusFilter('');
        setTeacherTuitionCodeSearchQuery('');
        setTeacherNumberTeacherSearchQuery('');
        setTeacherPaymentNumberSearchQuery('');
        setFilteredTeacherPaymentList(teacherPaymentList);
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
                        className="mb-3"
                        onClick={handleExportToExcel}
                    >
                        Export to Excel
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
                    </Card.Body>
                </Card>

                <hr></hr>

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
                                                <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Approved Payments(TK)</span>
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

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>--</span>
                                        <span>--</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>--</span>
                                        <span>--</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Card.Body>
                </Card>

                <Row className="mt-2 mb-3">
                    <Col md={2}>
                        <Form.Label className="fw-bold">Payment Status</Form.Label>
                        <Form.Select value={teacherStatusFilter} onChange={(e) => setTeacherStatusFilter(e.target.value)}>
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
                            value={teacherTuitionCodeSearchQuery}
                            onChange={(e) => setTeacherTuitionCodeSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Teacher Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Teacher Number"
                            value={teacherNumberTeacherSearchQuery}
                            onChange={(e) => setTeacherNumberTeacherSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Payment Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Payment Number"
                            value={teacherPaymentNumberSearchQuery}
                            onChange={(e) => setTeacherPaymentNumberSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2} className="d-flex align-items-end">
                        <Button variant="danger" onClick={handleTeacherResetFilters} className="w-100">
                            Reset Filters
                        </Button>
                    </Col>
                </Row>

                {role === "superadmin" && (
                    <Button variant="success" className="mb-3" onClick={handleTeacherTableExportToExcel}>
                        Export to Excel
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
                                        <th>Tuition Code</th>
                                        <th>Payment Status</th>
                                        <th>Submiited At</th>
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
                                        filteredTeacherPaymentList.slice().reverse().map((payment, index) => (
                                            <tr key={payment._id}>
                                                <td>{index + 1}</td>
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
                                                <td>{payment.comment}</td>
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

                <ToastContainer />
            </Container>

            {selectedPayment && (
                <PaymentInvoice
                    show={showInvoiceModal}
                    onClose={handleCloseModal}
                    payment={selectedPayment}
                />
            )}
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
