import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card, Spinner, Tooltip, OverlayTrigger, Popover } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaInfoCircle, FaBell, FaChevronLeft, FaChevronRight, FaPlus, FaFilter, FaFileExport, FaMoneyBillWave, FaExclamationCircle, FaCheckCircle, FaSearch, FaHistory, FaWhatsapp, FaUndo, FaUserPlus } from 'react-icons/fa';
import GeneralPaymentRecordModal from '../components/modals/GeneralPaymentRecordModal';
import GeneralPaymentViewModal from '../components/modals/GeneralPaymentViewModal';
import WhatsAppPaymentMessageModal from '../components/modals/WhatsAppPaymentMessageModal';
import PaymentAssignModal from '../components/modals/PaymentAssignModal';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import moment from 'moment';

const StyledModal = styled(Modal)`
    .modal-dialog {
        max-width: calc(100vw - 20px) !important;
        height: calc(100vh - 20px) !important;
        margin: 10px !important;
        display: flex;
        align-items: center;
    }
    .modal-content {
        max-height: calc(100vh - 20px) !important;
        height: calc(100vh - 20px) !important;
        border-radius: 12px;
        border: none;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    .modal-body {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
`;

const CustomTable = styled(Table)`
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 0;
    
    thead th {
        background-color: #0d6efd !important; /* Professional Blue */
        color: white !important;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 0.05em;
        padding: 12px 10px;
        position: sticky;
        top: 0;
        z-index: 20;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        white-space: nowrap;
    }

    tbody td {
        padding: 10px;
        vertical-align: middle;
        border: 1px solid #dee2e6 !important;
        font-size: 0.95rem; /* Larger text */
        color: #000000 !important;
        font-weight: 600;
    }

    /* Target the Due Tk column (4th column) */
    tbody td:nth-child(4) {
        color: #dc3545 !important;
        font-weight: 900; /* Maximum boldness */
        font-size: 1.05rem; /* Even larger for emphasis */
    }

    tbody tr {
        transition: background-color 0.15s ease;
        &:hover {
            background-color: #f1f5f9 !important;
        }
    }

    &.unverified-table .unverified-row td {
        background-color: #ffd1d1 !important;
    }

    /* Sticky Actions Column - Only applied when .sticky-actions is present */
    &.sticky-actions {
        thead th:last-child {
            position: sticky !important;
            right: 0;
            z-index: 30;
            background-color: #0d6efd !important;
            box-shadow: -2px 0 5px rgba(0,0,0,0.1);
        }

        tbody td:last-child {
            position: sticky !important;
            right: 0;
            z-index: 10;
            background-color: white !important;
            box-shadow: -2px 0 5px rgba(0,0,0,0.05);
            border-left: 2px solid #dee2e6 !important;
        }

        /* Override sticky background for unverified rows */
        .unverified-row td:last-child {
            background-color: #ffd1d1 !important;
        }

        /* Maintain hover effect for sticky cell */
        tbody tr:hover td:last-child {
            background-color: #f1f5f9 !important;
        }

        .unverified-row:hover td:last-child {
            background-color: #ffb3b3 !important; /* Slightly darker red on hover */
        }
    }
`;

const PaymentPage = () => {
    const [paymentList, setPaymentList] = useState([]);
    const [filteredPaymentList, setFilteredPaymentList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [selectedPaymentForEdit, setSelectedPaymentForEdit] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showWhatsappModal, setShowWhatsappModal] = useState(false);
    const [whatsappPaymentData, setWhatsappPaymentData] = useState(null);

    const [searchInputs, setSearchInputs] = useState({
        tuitionCode: '',
        tutorNumber: '',
        paymentNumber: '',
        paymentStatus: '',
        paymentType: '',
        assignedTo: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        tuitionCode: '',
        tutorNumber: '',
        paymentNumber: '',
        paymentStatus: '',
        paymentType: '',
        assignedTo: ''
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
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsData, setDetailsData] = useState(null);
    const [userOptions, setUserOptions] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedPaymentForAssign, setSelectedPaymentForAssign] = useState(null);
    const [showAutoMigrate, setShowAutoMigrate] = useState(false);
    const [isMigrating, setIsMigrating] = useState(false);
    const [showMigrateModal, setShowMigrateModal] = useState(false);
    const [selectedMigrationIds, setSelectedMigrationIds] = useState([]);

    const handleOpenAssignModal = (payment) => {
        setSelectedPaymentForAssign(payment);
        setShowAssignModal(true);
    };
    const [expandedComments, setExpandedComments] = useState({});
    const toggleComment = (id, type) => {
        setExpandedComments(prev => ({
            ...prev,
            [`${id}-${type}`]: !prev[`${id}-${type}`]
        }));
    };

    const role = localStorage.getItem('role');

    const renderCommentWithPopover = (text, maxLength = 20) => {
        if (!text) return '-';
        if (text.length <= maxLength) return text;

        const popover = (
            <Popover id="comment-popover" className="shadow-lg border-primary rounded-3" style={{ minWidth: '350px' }}>
                <Popover.Header as="h3" className="bg-primary text-white py-2 fw-bold d-flex align-items-center gap-2 fs-6">
                    <FaHistory /> Administrative Log
                </Popover.Header>
                <Popover.Body className="p-3 bg-light rounded-bottom-3" style={{ maxWidth: '450px' }}>
                    <div className="d-flex gap-2 align-items-start">
                        <div className="bg-white p-3 rounded-2 border shadow-sm w-100 position-relative">
                            <span className="text-muted small d-block mb-2 border-bottom pb-1 fw-bold fst-italic">Full Details</span>
                            <p className="mb-0 text-dark" style={{ lineHeight: '1.5', whiteSpace: 'pre-wrap', fontSize: '1.1rem' }}>{text}</p>
                        </div>
                    </div>
                </Popover.Body>
            </Popover>
        );

        return (
            <div className="d-flex align-items-center justify-content-center gap-1">
                <span className="text-truncate" style={{ maxWidth: '100px' }}>{text.substring(0, maxLength)}...</span>
                <OverlayTrigger
                    trigger={['hover', 'focus']}
                    placement="top"
                    overlay={popover}
                >
                    <span style={{ cursor: 'help' }} className="d-inline-flex">
                        <FaInfoCircle className="text-primary" style={{ fontSize: '0.85rem' }} />
                    </span>
                </OverlayTrigger>
            </div>
        );
    };

    const handleVerifyPayment = async (id) => {
        if (!window.confirm("Are you sure you want to verify this payment? This action cannot be undone.")) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            const response = await axios.put(`https://tuition-seba-backend-1.onrender.com/api/payment/verify/${id}`, { verifiedBy: username }, {
                headers: { Authorization: token }
            });
            if (response.status === 200) {
                toast.success('Payment verified successfully!');
                fetchPaymentRecords(); // Refresh data
                fetchTuitionAlertToday(); // Refresh alerts
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to verify payment');
        }
    };

    useEffect(() => {
        fetchPaymentRecords();
        fetchUsers();
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
            paymentType: '',
            assignedTo: ''
        };
        setSearchInputs(resetFilters);
        setAppliedFilters(resetFilters);
        setCurrentPage(1);
    };

    const fetchUsers = async () => {
        if (role === 'superadmin' || role === 'admin') {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/user/users', {
                    headers: { Authorization: token }
                });
                const options = [
                    { value: 'assigned', label: '--- Assigned ---' },
                    { value: 'unassigned', label: '--- Unassigned ---' },
                    ...response.data.map(user => ({
                        value: user.username,
                        label: `${user.name} (${user.username})`
                    }))
                ];
                setUserOptions(options);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        }
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
                    paymentType: appliedFilters.paymentType,
                    assignedTo: appliedFilters.assignedTo
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
                    paymentType: appliedFilters.paymentType,
                    assignedTo: appliedFilters.assignedTo
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

    const fetchTuitionAlertToday = async () => {
        try {
            const currentUsername = localStorage.getItem('username');
            const alertParams = {};
            if (role !== 'superadmin') {
                alertParams.assignedTo = currentUsername;
            }
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/payment/alert-today', { params: alertParams });
            setDueTodayList(res.data);
        } catch (err) {
            console.error('Error fetching tuition due today:', err);
            toast.error("Failed to load tuition alerts for today.");
        }
    };

    useEffect(() => {
        fetchTuitionAlertToday();
    }, []);

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const hours = now.getHours();

            // Only show between 10:00 PM and 11:59 PM
            const isNightTime = hours === 22 || hours === 23;
            const hasData = dueTodayList.length > 0;
            setShowAutoMigrate(isNightTime && hasData);
        };

        checkTime();
        const interval = setInterval(checkTime, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [dueTodayList]);

    const handleAutoMigrate = async () => {
        if (selectedMigrationIds.length === 0) {
            toast.error("Please select at least one payment to migrate.");
            return;
        }

        if (!window.confirm(`Are you sure you want to migrate ${selectedMigrationIds.length} selected payment(s) from today to tomorrow?`)) {
            return;
        }

        setIsMigrating(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://tuition-seba-backend-1.onrender.com/api/payment/auto-migrate', {
                paymentIds: selectedMigrationIds
            }, {
                headers: { Authorization: token }
            });
            toast.success(response.data.message);
            setShowMigrateModal(false);
            setSelectedMigrationIds([]);
            await fetchTuitionAlertToday();
            await fetchPaymentRecords();
        } catch (error) {
            console.error('Migration failed:', error);
            toast.error(error.response?.data?.message || 'Migration failed. Please try again.');
        } finally {
            setIsMigrating(false);
        }
    };

    const toggleMigrationSelection = (id) => {
        setSelectedMigrationIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAllMigration = () => {
        if (selectedMigrationIds.length === dueTodayList.length) {
            setSelectedMigrationIds([]);
        } else {
            setSelectedMigrationIds(dueTodayList.map(p => p._id));
        }
    };

    const openMigrateModal = () => {
        setSelectedMigrationIds(dueTodayList.map(p => p._id));
        setShowMigrateModal(true);
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        // Treat stored UTC as local time to match existing data pattern
        return moment(isoString.replace('Z', '')).format('DD MMM YYYY, hh:mm A');
    };



    const handleSavePayment = async (data) => {
        if (!data.tuitionId || data.tuitionId.trim() === '') {
            toast.error("Please enter a tuition code.");
            return;
        }

        const username = localStorage.getItem('username');

        const updatedPaymentData = {
            ...data,
            tuitionCode: data.tuitionId
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
            setEditingId(null);
            setSelectedPaymentForEdit(null);
            fetchPaymentRecords();
            fetchTuitionAlertToday();
        } catch (err) {
            console.error('Error saving payemnt record:', err);
            toast.error("Error saving payment record.");
        }
    };

    const handleEditPayment = (payment) => {
        setSelectedPaymentForEdit(payment);
        setEditingId(payment._id);
        setShowModal(true);
    };

    const handleViewDetails = (payment) => {
        setDetailsData(payment);
        setShowDetailsModal(true);
    };

    const handleDeletePayment = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this payment record?");

        if (confirmDelete) {
            setIsDeleting(true);
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/payment/delete/${id}`);
                toast.success("Payment record deleted successfully!");
                fetchPaymentRecords();
                fetchTuitionAlertToday();
                setIsDeleting(false);
                setShowModal(false);
                setEditingId(null);
                setSelectedPaymentForEdit(null);
                setShowDetailsModal(false);
            } catch (err) {
                console.error('Error deleting payment record:', err);
                toast.error("Error deleting payment record.");
                setIsDeleting(false);
            }
        } else {
            toast.info("Deletion canceled");
        }
    };

    const handleWhatsAppClick = (payment) => {
        setWhatsappPaymentData(payment);
        setShowWhatsappModal(true);
    };

    return (
        <>
            <NavBarPage />
            {isDeleting && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999
                }}>
                    <Spinner animation="border" variant="danger" size="lg" />
                    <h5 className="mt-3 text-danger fw-bold">Deleting...</h5>
                </div>
            )}
            <style>{`
                .modal-backdrop.show {
                    opacity: 0.7 !important;
                    backdrop-filter: blur(4px);
                }
                .modal-95w {
                    max-width: 95% !important;
                }
            `}</style>
            <Container>

                <Header>
                    <h2 className='text-primary fw-bold'>Payment Dashboard</h2>
                    <div className="d-flex gap-2">
                        {showAutoMigrate && (
                            <Button 
                                variant="warning" 
                                className="fw-bold" 
                                onClick={openMigrateModal} 
                                style={{ borderRadius: '30px', padding: '8px 24px' }}
                            >
                                Auto Migrate Update Today
                            </Button>
                        )}
                        <Button variant="primary" onClick={() => { setEditingId(null); setSelectedPaymentForEdit(null); setShowModal(true); }}>
                            Create Payment Record
                        </Button>
                    </div>
                </Header>

                {role === 'superadmin' && (
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
                )}

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

                    {(role === 'superadmin' || role === 'admin') && (
                        <Col md={2}>
                            <Form.Label className="fw-bold">Assigned To</Form.Label>
                            <Select
                                options={userOptions}
                                value={userOptions.find(u => u.value === searchInputs.assignedTo) || null}
                                onChange={(option) => handleSearchInputChange('assignedTo', option ? option.value : '')}
                                isClearable
                                placeholder="Employee"
                                menuPortalTarget={document.body}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '38px',
                                        borderRadius: '0.375rem'
                                    }),
                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                }}
                            />
                        </Col>
                    )}

                    <Col md={1} className="d-flex align-items-end">
                        <Button
                            variant="success"
                            onClick={handleSearch}
                            className="w-100 d-flex align-items-center justify-content-center"
                            disabled={loading}
                            title="Search"
                            style={{ height: '38px' }}
                        >
                            <FaSearch />
                        </Button>
                    </Col>

                    <Col md={1} className="d-flex align-items-end">
                        <Button
                            variant="danger"
                            onClick={handleResetFilters}
                            className="w-100 d-flex align-items-center justify-content-center"
                            title="Reset"
                            style={{ height: '38px' }}
                        >
                            <FaUndo />
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
                            <CustomTable striped hover className="unverified-table sticky-actions">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Created At</th>
                                        <th>Tuition Code</th>
                                        <th>Created By</th>
                                        <th>Updated By</th>
                                        <th>Payment Status</th>
                                        <th>Assigned To</th>
                                        <th>Installment Details</th>
                                        <th>Teacher Name</th>
                                        <th>Teacher Number</th>
                                        <th>Payment Number</th>
                                        <th>Total Payment TK</th>
                                        <th>Total Received TK</th>
                                        <th>Discount</th>
                                        <th>Due TK</th>
                                        <th>Due Payment Date</th>
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
                                            <tr key={payment._id} className={!payment.isVerified ? 'unverified-row' : ''}>
                                                <td>{(currentPage - 1) * 50 + index + 1}</td>
                                                <td>{formatDate(payment.createdAt)}</td>
                                                <td>
                                                    <div className="d-flex flex-column align-items-center gap-1">
                                                        <span className="fw-bold">{payment.tuitionCode}</span>
                                                        {payment.isVerified ? (
                                                            <span className="text-success" style={{ fontSize: '0.65rem' }}>
                                                                <FaCheckCircle /> Verified by <span className="text-primary fw-bold ms-1" style={{ fontSize: '0.75rem' }}>{payment.verifiedBy}</span>
                                                            </span>
                                                        ) : (
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                className="d-flex align-items-center gap-1 px-2 py-1 shadow-sm border-0 rounded-pill"
                                                                style={{ fontSize: '0.65rem', fontWeight: 'bold', transition: 'all 0.2s' }}
                                                                onClick={() => handleVerifyPayment(payment._id)}
                                                            >
                                                                <FaCheckCircle /> Verify
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
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
                                                <td>
                                                    <span className={`badge ${payment.assignedTo ? 'bg-success' : ''}`} style={!payment.assignedTo ? { backgroundColor: '#6c757d' } : {}}>
                                                        {payment.assignedTo || 'Unassigned'}
                                                    </span>
                                                </td>
                                                <td style={{ minWidth: "180px" }}>
                                                    <table className="table table-sm table-borderless mb-0" style={{ fontSize: '0.75rem' }}>
                                                        <thead className="border-bottom text-muted">
                                                            <tr style={{ fontSize: '0.65rem' }}>
                                                                <th className="p-0">Inst.</th>
                                                                <th className="p-0 text-center">Amt</th>
                                                                <th className="p-0 text-end">Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {payment.receivedTk ? (
                                                                <tr className="border-bottom-sm">
                                                                    <td className="p-0">1st</td>
                                                                    <td className="p-0 text-center text-primary">{payment.receivedTk}</td>
                                                                    <td className="p-0 text-end text-muted" style={{ whiteSpace: 'nowrap' }}>
                                                                        {formatDate(payment.paymentReceivedDate).split(',')[0]}
                                                                    </td>
                                                                </tr>
                                                            ) : null}
                                                            {payment.receivedTk2 || payment.paymentReceivedDate2 ? (
                                                                <tr className="border-bottom-sm">
                                                                    <td className="p-0">2nd</td>
                                                                    <td className="p-0 text-center text-primary">{payment.receivedTk2 || 0}</td>
                                                                    <td className="p-0 text-end text-muted" style={{ whiteSpace: 'nowrap' }}>
                                                                        {formatDate(payment.paymentReceivedDate2).split(',')[0]}
                                                                    </td>
                                                                </tr>
                                                            ) : null}
                                                            {payment.receivedTk3 || payment.paymentReceivedDate3 ? (
                                                                <tr className="border-bottom-sm">
                                                                    <td className="p-0">3rd</td>
                                                                    <td className="p-0 text-center text-primary">{payment.receivedTk3 || 0}</td>
                                                                    <td className="p-0 text-end text-muted" style={{ whiteSpace: 'nowrap' }}>
                                                                        {formatDate(payment.paymentReceivedDate3).split(',')[0]}
                                                                    </td>
                                                                </tr>
                                                            ) : null}
                                                            {payment.receivedTk4 || payment.paymentReceivedDate4 ? (
                                                                <tr>
                                                                    <td className="p-0">4th</td>
                                                                    <td className="p-0 text-center text-primary">{payment.receivedTk4 || 0}</td>
                                                                    <td className="p-0 text-end text-muted" style={{ whiteSpace: 'nowrap' }}>
                                                                        {formatDate(payment.paymentReceivedDate4).split(',')[0]}
                                                                    </td>
                                                                </tr>
                                                            ) : null}
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td>{payment.tutorName}</td>
                                                <td>{payment.tutorNumber}</td>
                                                <td>{payment.paymentNumber}</td>
                                                <td>{payment.totalPaymentTk}</td>
                                                <td>{payment.totalReceivedTk}</td>
                                                <td>{payment.discount || 0}</td>
                                                <td>{payment.duePayment}</td>
                                                <td>{payment.duePayDate ? formatDate(payment.duePayDate) : ''}</td>
                                                <td>{payment.comment}</td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                    <Button variant="success" onClick={() => handleWhatsAppClick(payment)} className="mr-2" style={{ background: '#25D366', borderColor: '#25D366' }}>
                                                        <FaWhatsapp />
                                                    </Button>
                                                    <Button variant="info" onClick={() => handleViewDetails(payment)} className="mr-2">
                                                        <FaInfoCircle />
                                                    </Button>
                                                    <Button variant="warning" onClick={() => handleEditPayment(payment)} className="mr-2">
                                                        <FaEdit />
                                                    </Button>
                                                    {role === 'superadmin' && (
                                                        <Button variant="danger" onClick={() => handleDeletePayment(payment._id)}>
                                                            <FaTrashAlt />
                                                        </Button>
                                                    )}
                                                    {role === 'superadmin' && (
                                                        <Button variant="dark" onClick={() => handleOpenAssignModal(payment)} title="Assign Employee">
                                                            <FaUserPlus />
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </CustomTable>
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

                {/* Specialized Modals Extracted for Performance */}
                <GeneralPaymentRecordModal
                    show={showModal}
                    onHide={() => {
                        setShowModal(false);
                        setEditingId(null);
                        setSelectedPaymentForEdit(null);
                    }}
                    editingId={editingId}
                    initialData={selectedPaymentForEdit}
                    onSave={handleSavePayment}
                    onDelete={handleDeletePayment}
                />

                <GeneralPaymentViewModal
                    show={showDetailsModal}
                    onHide={() => setShowDetailsModal(false)}
                    detailsData={detailsData}
                    formatDate={formatDate}
                    onEdit={handleEditPayment}
                    onDelete={handleDeletePayment}
                />

                {/* Other Modals */}
                <StyledModal show={showDueModal} onHide={() => setShowDueModal(false)} centered>
                    <Modal.Header closeButton className="bg-primary text-white border-0 py-3">
                        <Modal.Title className="w-100 text-center fw-bold d-flex align-items-center justify-content-center gap-2">
                            <FaBell className="text-warning" />
                            <span>Due Payments Today: {dueTodayList.length}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0 bg-white d-flex flex-column">
                        {dueTodayList.length > 0 ? (
                            <div style={{ flex: 1, overflow: "auto", width: '100%' }}>
                                <CustomTable striped hover className="unverified-table">
                                    <thead className="text-center">
                                        <tr>
                                            <th>SL</th>
                                            <th>Payment Received Date</th>
                                            <th>Tuition Code</th>
                                            <th>Due Tk</th>
                                            <th>Teacher Name</th>
                                            <th>Teacher Number</th>
                                            <th>Assigned To</th>
                                            <th>Follow Up Date</th>
                                            <th>Follow Up Comment</th>
                                            <th>Next Due Pay Date</th>
                                            <th>Next Due Pay Date Comment</th>
                                            <th>Comment</th>
                                            <th style={{ width: '180px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dueTodayList.map((payment, index) => (
                                            <tr key={index} className={`align-middle text-center ${!payment.isVerified ? 'unverified-row' : ''}`}>
                                                <td>{index + 1}</td>
                                                <td>{payment.paymentReceivedDate ? formatDate(payment.paymentReceivedDate) : '-'}</td>
                                                <td>
                                                    <div className="d-flex flex-column align-items-center gap-1">
                                                        <span className="fw-bold">{payment.tuitionCode}</span>
                                                        {payment.isVerified ? (
                                                            <span className="text-success" style={{ fontSize: '0.65rem' }}>
                                                                <FaCheckCircle /> Verified by <span className="text-primary fw-bold ms-1" style={{ fontSize: '0.75rem' }}>{payment.verifiedBy}</span>
                                                            </span>
                                                        ) : (
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                className="d-flex align-items-center gap-1 px-2 py-1 shadow-sm border-0 rounded-pill"
                                                                style={{ fontSize: '0.65rem', fontWeight: 'bold', transition: 'all 0.2s' }}
                                                                onClick={() => handleVerifyPayment(payment._id)}
                                                            >
                                                                <FaCheckCircle /> Verify
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="fw-bold text-danger">{payment.duePayment}</td>
                                                <td>{payment.tutorName}</td>
                                                <td>{payment.tutorNumber}</td>
                                                <td>
                                                    <span className={`badge ${payment.assignedTo ? 'bg-success' : ''}`} style={!payment.assignedTo ? { backgroundColor: '#6c757d' } : {}}>
                                                        {payment.assignedTo || 'Unassigned'}
                                                    </span>
                                                </td>
                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                    {payment.followUpDate ? formatDate(payment.followUpDate) : '-'}
                                                </td>
                                                <td>
                                                    {payment.followUpComment || '-'}
                                                </td>
                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                    {payment.duePayDate ? formatDate(payment.duePayDate) : '-'}
                                                </td>
                                                <td>
                                                    {payment.duePayDateComment || '-'}
                                                </td>
                                                <td>
                                                    {renderCommentWithPopover(payment.comment)}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                    <Button variant="success" onClick={() => handleWhatsAppClick(payment)} className="mr-2" style={{ background: '#25D366', borderColor: '#25D366' }}>
                                                        <FaWhatsapp />
                                                    </Button>
                                                    <Button variant="info" onClick={() => handleViewDetails(payment)} className="mr-2">
                                                        <FaInfoCircle />
                                                    </Button>
                                                    <Button variant="warning" onClick={() => handleEditPayment(payment)} className="mr-2">
                                                        <FaEdit />
                                                    </Button>
                                                    {role === 'superadmin' && (
                                                        <Button variant="danger" onClick={() => handleDeletePayment(payment._id)}>
                                                            <FaTrashAlt />
                                                        </Button>
                                                    )}
                                                    {role === 'superadmin' && (
                                                        <Button variant="dark" onClick={() => handleOpenAssignModal(payment)} title="Assign Employee">
                                                            <FaUserPlus />
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </CustomTable>
                            </div>
                        ) : (
                            <div className="text-center text-muted py-5 my-auto">
                                <FaExclamationCircle size={48} className="mb-3 opacity-20" />
                                <h5>No due payments to be paid today</h5>
                            </div>
                        )}
                    </Modal.Body>
                </StyledModal>

                {/* Export Modal */}
                <Modal show={showExportModal} onHide={() => {
                    setShowExportModal(false);
                    setSelectedExportStatus('');
                }} centered contentClassName="shadow-lg">
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

                <WhatsAppPaymentMessageModal
                    show={showWhatsappModal}
                    onHide={() => {
                        setShowWhatsappModal(false);
                        setWhatsappPaymentData(null);
                    }}
                    paymentData={whatsappPaymentData}
                    formatDate={formatDate}
                />

                <PaymentAssignModal
                    show={showAssignModal}
                    onHide={() => setShowAssignModal(false)}
                    payment={selectedPaymentForAssign}
                    fetchPaymentRecords={fetchPaymentRecords}
                    fetchAlertData={fetchTuitionAlertToday}
                />

                {/* Auto Migrate Modal */}
                <Modal show={showMigrateModal} onHide={() => !isMigrating && setShowMigrateModal(false)} size="lg" backdrop={isMigrating ? 'static' : true} keyboard={!isMigrating}>
                    <Modal.Header closeButton={!isMigrating}>
                        <Modal.Title>Auto Migrate Payments (Today to Tomorrow)</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3 d-flex justify-content-between align-items-center">
                            <span className="fw-bold">Total payments due today: {dueTodayList.length}</span>
                            <Button variant="outline-primary" size="sm" onClick={handleSelectAllMigration}>
                                {selectedMigrationIds.length === dueTodayList.length ? 'Deselect All' : 'Select All'}
                            </Button>
                        </div>
                        <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                            <Table striped bordered hover size="sm">
                                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                                    <tr>
                                        <th className="text-center">Select</th>
                                        <th>Tuition Code</th>
                                        <th>Status</th>
                                        <th>Current Due Pay Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dueTodayList.map(p => (
                                        <tr key={p._id}>
                                            <td className="text-center">
                                                <Form.Check 
                                                    type="checkbox"
                                                    checked={selectedMigrationIds.includes(p._id)}
                                                    onChange={() => toggleMigrationSelection(p._id)}
                                                />
                                            </td>
                                            <td>{p.tuitionCode}</td>
                                            <td>
                                                <span className={`badge ${p.paymentStatus === 'fully paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                    {p.paymentStatus}
                                                </span>
                                            </td>
                                            <td>{formatDate(p.duePayDate)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <div className="mt-3 text-muted small">
                            * Selected payments will have their "Due Payment Date" moved to tomorrow and "Updated By" set to "auto migration".
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {isMigrating && <span className="text-danger fw-bold me-auto">⚠️ Please don't close while updating...</span>}
                        <Button variant="secondary" onClick={() => setShowMigrateModal(false)} disabled={isMigrating}>Cancel</Button>
                        <Button 
                            variant="warning" 
                            className="fw-bold"
                            onClick={handleAutoMigrate} 
                            disabled={isMigrating || selectedMigrationIds.length === 0}
                        >
                            {isMigrating ? <Spinner animation="border" size="sm" /> : `Migrate Selected (${selectedMigrationIds.length})`}
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