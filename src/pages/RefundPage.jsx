import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card, Spinner, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaWhatsapp, FaSearch, FaUndo, FaChevronLeft, FaChevronRight, FaBell } from 'react-icons/fa';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import WhatsAppRefundModal from '../components/modals/WhatsAppRefundModal';

const RefundPage = () => {
    const [refundList, setRefundList] = useState([]);
    const [loading, setLoading] = useState(false);
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
        commentFromAgent: '',
        returnDate: ''
    });

    const [teacherSectionEditable, setTeacherSectionEditable] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [originalData, setOriginalData] = useState(null);

    const [refundsDueToday, setRefundsDueToday] = useState([]);
    const [showDueTodayModal, setShowDueTodayModal] = useState(false);

    // Pagination & Search States
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const limit = 20;

    const [searchInputs, setSearchInputs] = useState({
        tuitionCode: '',
        paymentNumber: '',
        personalPhone: '',
        status: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        tuitionCode: '',
        paymentNumber: '',
        personalPhone: '',
        status: ''
    });

    const [statusCounts, setStatusCounts] = useState({
        total: 0,
        pending: 0,
        underReview: 0,
        approved: 0,
        rejected: 0,
        completed: 0,
        cancelled: 0
    });

    const role = localStorage.getItem('role');

    // WhatsApp share modal state
    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
    const [whatsAppRefund, setWhatsAppRefund] = useState(null);

    const handleOpenWhatsApp = (refund) => {
        setWhatsAppRefund(refund);
        setShowWhatsAppModal(true);
    };

    const fetchRefundApplyRecords = useCallback(async (page = 1, filters = appliedFilters) => {
        setLoading(true);
        try {
            const params = {
                page,
                limit,
                tuitionCode: filters.tuitionCode,
                paymentNumber: filters.paymentNumber,
                personalPhone: filters.personalPhone,
                status: filters.status
            };
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/refund/all', { params });
            setRefundList(response.data.data);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
            setTotalRecords(response.data.totalRecords);
        } catch (err) {
            console.error('Error:', err);
            toast.error("Failed to fetch records.");
        }
        setLoading(false);
    }, [appliedFilters]);

    const fetchSummaryCounts = async () => {
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/refund/summary');
            setStatusCounts(response.data);
        } catch (err) {
            console.error('Error fetching summary:', err);
        }
    };

    const fetchAlertToday = async () => {
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/refund/alert-today');
            setRefundsDueToday(response.data);
        } catch (err) {
            console.error('Error fetching today alerts:', err);
        }
    };

    useEffect(() => {
        fetchAlertToday();
    }, []);

    useEffect(() => {
        fetchRefundApplyRecords(1);
        fetchSummaryCounts();
    }, [fetchRefundApplyRecords]);

    const handleSearchInputChange = (e) => {
        const { name, value } = e.target;
        setSearchInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        setAppliedFilters(searchInputs);
        setCurrentPage(1);
        fetchRefundApplyRecords(1, searchInputs);
    };

    const handleResetFilters = () => {
        const resetState = {
            tuitionCode: '',
            paymentNumber: '',
            personalPhone: '',
            status: ''
        };
        setSearchInputs(resetState);
        setAppliedFilters(resetState);
        setCurrentPage(1);
        fetchRefundApplyRecords(1, resetState);
    };

    const handlePageChange = (pageNumber) => {
        fetchRefundApplyRecords(pageNumber);
    };

    const handleExportToExcel = async () => {
        // For export, we might want to fetch ALL data based on current filters but without limit
        // Or just export the current filtered list if we add an export-all endpoint
        setLoading(true);
        try {
            const params = {
                tuitionCode: appliedFilters.tuitionCode,
                paymentNumber: appliedFilters.paymentNumber,
                personalPhone: appliedFilters.personalPhone,
                status: appliedFilters.status,
                limit: 10000 // Large limit for export
            };
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/refund/all', { params });
            const allFilteredData = response.data.data;

            const now = new Date();
            const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
            const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');
            const fileName = `Refund List_${formattedDate}_${formattedTime}`;

            const tableHeaders = [
                "Applied At", "Status", "Tuition Code", "Created By", "Updated By",
                "Payment Number Type", "Payment Number", "Name", "Return Amount",
                "Return Date", "Personal Phone", "Comment (Teacher)", "Comment From Agent"
            ];

            const tableData = allFilteredData.map(item => [
                item.requestedAt ? formatDate(item.requestedAt) : "",
                String(item.status ?? ""),
                String(item.tuitionCode ?? ""),
                String(item.createdBy ?? ""),
                String(item.updatedBy ?? ""),
                String(item.paymentType ?? ""),
                String(item.paymentNumber ?? ""),
                String(item.name ?? ""),
                String(item.amount ?? ""),
                String(item.returnDate ?? ""),
                String(item.personalPhone ?? ""),
                String(item.note ?? ""),
                String(item.commentFromAgent ?? "")
            ]);

            const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Refund Applications");
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
            toast.success("Export successful!");
        } catch (err) {
            console.error('Export Error:', err);
            toast.error("Export failed.");
        }
        setLoading(false);
    };

    const performSave = async () => {
        const username = localStorage.getItem('username');
        const updatedTuitionData = {
            ...refundData,
            status: refundData.status ? refundData.status : "pending"
        };
        setLoading(true);
        try {
            if (editingId) {
                const updatedData = { ...updatedTuitionData, updatedBy: username };
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/refund/edit/${editingId}`, updatedData);
                toast.success("Refund record updated successfully!");
            } else {
                const newData = { ...updatedTuitionData, createdBy: username };
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/refund/add', newData);
                toast.success("Refund record added successfully!");
            }
            setShowConfirmModal(false);
            setShowModal(false);
            fetchRefundApplyRecords(currentPage);
            fetchSummaryCounts();
            fetchAlertToday();
        } catch (err) {
            console.error('Error:', err);
            toast.error("Operation failed.");
        }
        setLoading(false);
    };

    const handleSaveRequest = () => {
        if (editingId) {
            const changes = getChanges();
            if (changes.length === 0) {
                toast.info("No changes detected.");
                setShowModal(false);
                return;
            }
            setShowConfirmModal(true);
        } else {
            performSave();
        }
    };

    const getChanges = () => {
        if (!originalData) return [];
        const changes = [];
        const fields = [
            { key: 'tuitionCode', label: 'Tuition Code' },
            { key: 'name', label: 'Name' },
            { key: 'paymentType', label: 'Payment Type' },
            { key: 'paymentNumber', label: 'Payment Number' },
            { key: 'personalPhone', label: 'Personal Phone' },
            { key: 'amount', label: 'Amount' },
            { key: 'note', label: 'Teacher Comment' },
            { key: 'status', label: 'Status' },
            { key: 'returnDate', label: 'Return Date' },
            { key: 'commentFromAgent', label: 'Agent Comment' }
        ];

        fields.forEach(field => {
            const oldValue = String(originalData[field.key] || '').trim();
            const newValue = String(refundData[field.key] || '').trim();
            
            if (oldValue !== newValue) {
                changes.push({
                    label: field.label,
                    old: oldValue || '(empty)',
                    new: newValue || '(empty)'
                });
            }
        });
        return changes;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const optionsDate = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };
        return `${new Intl.DateTimeFormat('en-GB', optionsDate).format(date)} || ${new Intl.DateTimeFormat('en-GB', optionsTime).format(date)}`;
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
    };

    const handleEditApply = (data) => {
        const formattedData = {
            ...data,
            returnDate: data.returnDate ? data.returnDate.split('T')[0] : ''
        };
        setRefundData(formattedData);
        setOriginalData(formattedData);
        setEditingId(data._id);
        setTeacherSectionEditable(false);
        setShowModal(true);
    };

    const handleCreateNew = () => {
        setRefundData({
            tuitionCode: '',
            paymentType: '',
            paymentNumber: '',
            personalPhone: '',
            amount: '',
            name: '',
            note: '',
            comment: '',
            status: 'pending',
            commentFromAgent: '',
            returnDate: ''
        });
        setEditingId(null);
        setTeacherSectionEditable(true);
        setShowModal(true);
    };

    const handleDeleteRecord = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/refund/delete/${id}`);
                toast.success("Record deleted successfully!");
                fetchRefundApplyRecords(currentPage);
                fetchSummaryCounts();
            } catch (err) {
                console.error('Error:', err);
                toast.error("Deletion failed.");
            }
        }
    };

    return (
        <>
            <NavBarPage />
            <Container>
                <Header>
                    <h2 className='text-primary fw-bold mb-0'>Refund Applications</h2>
                    <Button variant="primary" onClick={handleCreateNew} className="rounded-3 shadow-sm px-4">
                        + Create Refund
                    </Button>
                </Header>
                
                <Card className="mt-4 shadow-sm border-0">
                    <Card.Body>
                        <Row className="text-center g-3">
                            {[
                                { label: 'Total', count: statusCounts.total, color: 'dark' },
                                { label: 'Pending', count: statusCounts.pending, color: 'primary' },
                                { label: 'Under Review', count: statusCounts.underReview, color: 'info' },
                                { label: 'Approved', count: statusCounts.approved, color: 'success' },
                                { label: 'Rejected', count: statusCounts.rejected, color: 'danger' },
                                { label: 'Completed', count: statusCounts.completed, color: 'success' }
                            ].map((stat, idx) => (
                                <Col key={idx} xs={6} sm={4} md={2}>
                                    <div className={`card p-2 shadow-sm border-${stat.color}`}>
                                        <small className={`text-${stat.color} fw-bold`}>{stat.label}</small>
                                        <h5 className="mb-0">{stat.count}</h5>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>

                {/* Search & Filter Bar */}
                <Card className="mt-4 shadow-sm border-0">
                    <Card.Body>
                        <Row className="g-3 align-items-end">
                            <Col md={3}>
                                <Form.Label className="fw-bold small">Tuition Code</Form.Label>
                                <Form.Control
                                    name="tuitionCode"
                                    placeholder="Search Tuition Code"
                                    value={searchInputs.tuitionCode}
                                    onChange={handleSearchInputChange}
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Label className="fw-bold small">Payment Phone</Form.Label>
                                <Form.Control
                                    name="paymentNumber"
                                    placeholder="Search Phone"
                                    value={searchInputs.paymentNumber}
                                    onChange={handleSearchInputChange}
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Label className="fw-bold small">Personal Phone</Form.Label>
                                <Form.Control
                                    name="personalPhone"
                                    placeholder="Search Phone"
                                    value={searchInputs.personalPhone}
                                    onChange={handleSearchInputChange}
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Label className="fw-bold small">Status</Form.Label>
                                <Form.Select name="status" value={searchInputs.status} onChange={handleSearchInputChange}>
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="under review">Under Review</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </Form.Select>
                            </Col>
                            <Col md={3} className="d-flex gap-2">
                                <Button variant="primary" onClick={handleSearch} className="flex-grow-1">
                                    <FaSearch className="me-1" /> Search
                                </Button>
                                <Button variant="outline-secondary" onClick={handleResetFilters}>
                                    <FaUndo />
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {refundsDueToday.length > 0 && (
                    <div className="d-flex align-items-center justify-content-center my-4">
                        <h5 className="me-3 d-flex align-items-center gap-2 mb-0 py-3 px-5 bg-warning-subtle rounded-pill border border-warning-subtle shadow-sm">
                            <FaBell className="text-warning animate-bounce" />
                            <span className="fw-bold text-dark">Refunds to be done today: {refundsDueToday.length}</span>
                            <Button size="sm" variant="warning" onClick={() => setShowDueTodayModal(true)} className="ms-2 rounded-circle shadow-sm">
                                <FaInfoCircle />
                            </Button>
                        </h5>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt-4">
                    {role === "superadmin" && (
                        <Button variant="success" size="sm" onClick={handleExportToExcel}>
                            Export to Excel ({totalRecords})
                        </Button>
                    )}
                    <div className="text-muted small">Showing {refundList.length} of {totalRecords} records</div>
                </div>

                <Card className="mt-3 shadow-sm border-0">
                    <Card.Body className="p-0">
                        <div style={{ maxHeight: "700px", overflowY: "auto" }}>
                            <Table striped hover responsive className="mb-0">
                                <thead className="table-primary sticky-top">
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
                                        <th>Return Date</th>
                                        <th>Personal Phone</th>
                                        <th>Comment (Teacher)</th>
                                        <th>Comment From Agent</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="15" className="text-center py-5">
                                                <Spinner animation="border" variant="primary" />
                                            </td>
                                        </tr>
                                    ) : refundList.length === 0 ? (
                                        <tr>
                                            <td colSpan="15" className="text-center py-4">No records found.</td>
                                        </tr>
                                    ) : (
                                        refundList.map((item, index) => (
                                            <tr key={item._id} className={item.status === 'completed' ? 'table-success' : ''}>
                                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                                <td className="small text-nowrap">{item.requestedAt ? formatDate(item.requestedAt) : '-'}</td>
                                                <td>
                                                    <span className={`badge ${
                                                        item.status === "pending" ? "bg-warning text-dark" :           
                                                        item.status === "under review" ? "bg-info" :                
                                                        item.status === "approved" ? "bg-primary" :                       
                                                        item.status === "rejected" ? "bg-danger" :                     
                                                        item.status === "completed" ? "bg-success" :                   
                                                        item.status === "cancelled" ? "bg-secondary" : "bg-light text-dark"
                                                    }`}>
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
                                                <td 
                                                    className="fw-bold" 
                                                    style={{ 
                                                        color: item.status === 'completed' ? '#155724' : '#0d6efd' 
                                                    }}
                                                >
                                                    {formatDateOnly(item.returnDate)}
                                                </td>
                                                <td>{item.personalPhone}</td>
                                                <td className="small">{item.note}</td>
                                                <td className="small">{item.commentFromAgent}</td>
                                                <td>
                                                    <div className="d-flex gap-1 justify-content-center">
                                                        <Button variant="warning" size="sm" onClick={() => handleEditApply(item)}><FaEdit /></Button>
                                                        <Button variant="danger" size="sm" onClick={() => handleDeleteRecord(item._id)}><FaTrashAlt /></Button>
                                                        <Button variant="success" size="sm" onClick={() => handleOpenWhatsApp(item)}><FaWhatsapp /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>

                {/* Pagination Controls */}
                {!loading && totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination className="pagination-rounded-pill">
                            <Pagination.Prev 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft className="me-1" /> Prev
                            </Pagination.Prev>
                            
                            {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                // Show first, last, and pages around current
                                if (page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                                    return (
                                        <Pagination.Item 
                                            key={page} 
                                            active={page === currentPage}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </Pagination.Item>
                                    );
                                } else if (page === currentPage - 3 || page === currentPage + 3) {
                                    return <Pagination.Ellipsis key={page} />;
                                }
                                return null;
                            })}

                            <Pagination.Next 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                            >
                                Next <FaChevronRight className="ms-1" />
                            </Pagination.Next>
                        </Pagination>
                    </div>
                )}

                {/* Create/Edit Refund Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fw-bold ps-2">
                            {editingId ? "Edit Refund Application" : "Create New Refund Request"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4" style={{ backgroundColor: '#fdfdfd' }}>
                        <Form>
                            {/* Teacher Information Section */}
                            <div className="mb-4">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="d-flex align-items-center">
                                        <div style={{ width: '4px', height: '20px', backgroundColor: '#0d6efd', borderRadius: '2px', marginRight: '10px' }}></div>
                                        <h6 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '0.5px', fontSize: '0.95rem' }}>TEACHER INFORMATION</h6>
                                    </div>
                                    {editingId && (
                                        teacherSectionEditable ? (
                                            <Button 
                                                variant="outline-secondary" 
                                                size="sm" 
                                                onClick={() => setTeacherSectionEditable(false)}
                                                style={{ borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}
                                            >
                                                <FaUndo className="me-1" /> Disable Edit
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                onClick={() => setTeacherSectionEditable(true)}
                                                style={{ borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}
                                            >
                                                <FaEdit className="me-1" /> Edit Info
                                            </Button>
                                        )
                                    )}
                                </div>
                                <div 
                                    className="p-4 rounded-3 border shadow-sm bg-white" 
                                    style={{ 
                                        borderColor: '#f0f0f0',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Row className="g-4">
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold mb-2">TUITION CODE</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Code"
                                                    className="border p-2 px-3"
                                                    style={{ borderRadius: '8px', fontSize: '0.9rem', backgroundColor: !teacherSectionEditable ? '#f8f9fa' : '#fff' }}
                                                    value={refundData.tuitionCode}
                                                    onChange={(e) => setRefundData({ ...refundData, tuitionCode: e.target.value })}
                                                    required
                                                    readOnly={!teacherSectionEditable}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold mb-2">NAME</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Teacher Name"
                                                    className="border p-2 px-3"
                                                    style={{ borderRadius: '8px', fontSize: '0.9rem', backgroundColor: !teacherSectionEditable ? '#f8f9fa' : '#fff' }}
                                                    value={refundData.name}
                                                    onChange={(e) => setRefundData({ ...refundData, name: e.target.value })}
                                                    required
                                                    readOnly={!teacherSectionEditable}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold mb-2">PERSONAL PHONE</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Contact No"
                                                    className="border p-2 px-3"
                                                    style={{ borderRadius: '8px', fontSize: '0.9rem', backgroundColor: !teacherSectionEditable ? '#f8f9fa' : '#fff' }}
                                                    value={refundData.personalPhone}
                                                    onChange={(e) => setRefundData({ ...refundData, personalPhone: e.target.value })}
                                                    required
                                                    readOnly={!teacherSectionEditable}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold mb-2">PAYMENT TYPE</Form.Label>
                                                <Form.Select
                                                    className="border p-2 px-3"
                                                    style={{ borderRadius: '8px', fontSize: '0.9rem', backgroundColor: !teacherSectionEditable ? '#f8f9fa' : '#fff' }}
                                                    value={refundData.paymentType}
                                                    onChange={(e) => setRefundData({ ...refundData, paymentType: e.target.value })}
                                                    required
                                                    disabled={!teacherSectionEditable}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="bkash">Bkash Personal</option>
                                                    <option value="nagad">Nagad Personal</option>
                                                    <option value="cash">Cash</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold mb-2">PAYMENT NUMBER</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Account No"
                                                    className="border p-2 px-3"
                                                    style={{ borderRadius: '8px', fontSize: '0.9rem', backgroundColor: !teacherSectionEditable ? '#f8f9fa' : '#fff' }}
                                                    value={refundData.paymentNumber}
                                                    onChange={(e) => setRefundData({ ...refundData, paymentNumber: e.target.value })}
                                                    required
                                                    readOnly={!teacherSectionEditable}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold mb-2">REFUND AMOUNT</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Amount in BDT"
                                                    className="border p-2 px-3 fw-bold text-primary"
                                                    style={{ borderRadius: '8px', fontSize: '1rem', backgroundColor: !teacherSectionEditable ? '#f8f9fa' : '#f0f7ff' }}
                                                    value={refundData.amount}
                                                    onChange={(e) => setRefundData({ ...refundData, amount: e.target.value })}
                                                    required
                                                    readOnly={!teacherSectionEditable}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold mb-2">COMMENT FROM TEACHER</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    placeholder="Teacher's internal notes..."
                                                    className="border p-3"
                                                    style={{ borderRadius: '12px', fontSize: '0.9rem', backgroundColor: !teacherSectionEditable ? '#f8f9fa' : '#fff' }}
                                                    value={refundData.note}
                                                    onChange={(e) => setRefundData({ ...refundData, note: e.target.value })}
                                                    readOnly={!teacherSectionEditable}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>
                            </div>

                            {/* Agent Action Section */}
                            <div>
                                <div className="d-flex align-items-center mb-3">
                                    <div style={{ width: '4px', height: '20px', backgroundColor: '#198754', borderRadius: '2px', marginRight: '10px' }}></div>
                                    <h6 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '0.5px', fontSize: '0.95rem' }}>AGENT ACTION</h6>
                                </div>
                                <div className="p-4 rounded-3 border shadow-sm" style={{ backgroundColor: '#f8fffb', borderColor: '#e1f5e9' }}>
                                    <Row className="g-4">
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label className="text-success small fw-bold mb-2 text-uppercase">Update Status</Form.Label>
                                                <Form.Select
                                                    className="border shadow-sm p-2 px-3"
                                                    style={{ borderRadius: '8px', fontSize: '0.9rem', backgroundColor: '#fff', borderColor: '#ced4da' }}
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
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label className="text-success small fw-bold mb-2 text-uppercase">Return Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    className="border shadow-sm p-2 px-3"
                                                    style={{ borderRadius: '8px', fontSize: '0.9rem', backgroundColor: '#fff', borderColor: '#ced4da' }}
                                                    value={refundData.returnDate || ''}
                                                    onChange={(e) => setRefundData({ ...refundData, returnDate: e.target.value })}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group>
                                                <Form.Label className="text-success small fw-bold mb-2 text-uppercase">Comment From Agent</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    placeholder="Resolution details or agent feedback..."
                                                    className="border shadow-sm p-3"
                                                    style={{ borderRadius: '12px', fontSize: '0.9rem', backgroundColor: '#fff', borderColor: '#ced4da' }}
                                                    value={refundData.commentFromAgent}
                                                    onChange={(e) => setRefundData({ ...refundData, commentFromAgent: e.target.value })}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSaveRequest} disabled={loading}>
                            {loading ? <Spinner size="sm" /> : "Save Changes"}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <WhatsAppRefundModal
                    show={showWhatsAppModal}
                    onHide={() => setShowWhatsAppModal(false)}
                    refundData={whatsAppRefund}
                />

                {/* Refunds Due Today Modal */}
                <Modal show={showDueTodayModal} onHide={() => setShowDueTodayModal(false)} centered size="xl">
                    <Modal.Header closeButton className="bg-warning text-dark border-0">
                        <Modal.Title className="w-100 text-center fw-bold d-flex align-items-center justify-content-center gap-2">
                            <FaBell />
                            <span>Refunds to be done today: {refundsDueToday.length}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4 bg-light">
                        {refundsDueToday.length > 0 ? (
                            <div className="table-responsive rounded-3 shadow-sm bg-white">
                                <Table hover className="mb-0 align-middle">
                                    <thead className="bg-dark text-white">
                                        <tr className="text-center">
                                            <th className="py-3">SL</th>
                                            <th className="py-3">Tuition Code</th>
                                            <th className="py-3">Name</th>
                                            <th className="py-3">Phone</th>
                                            <th className="py-3">Amount</th>
                                            <th className="py-3">Status</th>
                                            <th className="py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {refundsDueToday.map((refund, index) => (
                                            <tr key={refund._id} className="text-center border-bottom">
                                                <td className="fw-bold text-muted">{index + 1}</td>
                                                <td className="fw-bold text-primary">{refund.tuitionCode}</td>
                                                <td>{refund.name}</td>
                                                <td>{refund.personalPhone}</td>
                                                <td className="fw-bold text-success">{refund.amount} TK</td>
                                                <td>
                                                    <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-3">
                                                        {refund.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <Button variant="outline-primary" size="sm" onClick={() => { setShowDueTodayModal(false); handleEditApply(refund); }}>
                                                            <FaEdit />
                                                        </Button>
                                                        <Button variant="outline-success" size="sm" onClick={() => handleOpenWhatsApp(refund)}>
                                                            <FaWhatsapp />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <h5 className="text-muted">No refunds scheduled for today.</h5>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="border-0 bg-light">
                        <Button variant="secondary" className="px-4" onClick={() => setShowDueTodayModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>

                {/* Save Confirmation Modal */}
                <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered size="md">
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="fw-bold fs-5">Confirm Changes</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                        <p className="mb-3 text-muted fw-bold small">The following changes will be saved:</p>
                        <div className="border rounded bg-light p-3">
                            {getChanges().map((change, idx) => (
                                <div key={idx} className="mb-3 last-child-mb-0">
                                    <div className="fw-bold text-dark small mb-1">{change.label}</div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="text-danger text-decoration-line-through small px-2 py-1 bg-white rounded border">{change.old}</span>
                                        <FaChevronRight className="text-muted small" />
                                        <span className="text-success fw-bold small px-2 py-1 bg-white rounded border">{change.new}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0 p-3 pt-0">
                        <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={performSave} disabled={loading}>
                            {loading ? <Spinner size="sm" /> : "Confirm & Save"}
                        </Button>
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
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;

  .pagination-rounded-pill .page-item .page-link {
    border-radius: 50px;
    margin: 0 4px;
    border: none;
    padding: 8px 16px;
    font-weight: 600;
    color: #444;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .pagination-rounded-pill .page-item.active .page-link {
    background-color: #0d6efd;
    color: white;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
