import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Spinner, Badge, Tabs, Tab, Nav, Modal, Pagination } from 'react-bootstrap';
import { FaCalendarAlt, FaFilter, FaSearch, FaHistory, FaUserCheck, FaBookOpen, FaUndo, FaTag, FaChartPie, FaWallet } from 'react-icons/fa';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const allStatusOptions = [
    { value: 'verified', label: 'Verified', module: 'RegTeacher' },
    { value: 'after confirmation', label: 'After Confirmation', module: 'RegTeacher' },
    { value: 'after salary', label: 'After Salary', module: 'RegTeacher' },
    { value: '30% advance', label: '30% Advance', module: 'RegTeacher' },
    { value: 'confirm', label: 'Confirm', module: 'Tuition' },
    { value: 'cancel', label: 'Cancel', module: 'Tuition' },
    { value: 'suspend', label: 'Suspend', module: 'Tuition' },
    { value: 'selected', label: 'Selected', module: 'TuitionApply' },
    { value: 'confirmed', label: 'Confirmed', module: 'TuitionApply' }
];

const StatusHistoryReportPage = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    // Stats states
    const [todayStats, setTodayStats] = useState({
        verifiedTeachersCount: 0,
        confirmedTuitionsCount: 0,
        cancelledTuitionsCount: 0,
        suspendedTuitionsCount: 0,
        confirmedApplicationsCount: 0,
        tuitionsCreatedTodayCount: 0,
        tuitionsDeletedTodayCount: 0,
        verifiedBreakdown: {
            verified: 0,
            afterConfirmation: 0,
            afterSalary: 0,
            advance30: 0
        },
        applyBreakdown: {
            selected: 0,
            confirmed: 0
        }
    });
    const [statsLoading, setStatsLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    // Tab State
    const [activeTab, setActiveTab] = useState('status');

    // Payment Report States
    const initialToday = new Date();
    const initialTodayStr = `${initialToday.getFullYear()}-${String(initialToday.getMonth() + 1).padStart(2, '0')}-${String(initialToday.getDate()).padStart(2, '0')}`;

    const [paymentReportData, setPaymentReportData] = useState({ data: [], routeData: [], dateData: [], totalAmount: 0, totalCount: 0 });
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentFilters, setPaymentFilters] = useState({ startDate: initialTodayStr, endDate: initialTodayStr });
    const [appliedPaymentFilters, setAppliedPaymentFilters] = useState({ startDate: initialTodayStr, endDate: initialTodayStr });

    // Overall Payment Report States
    const [overallReportData, setOverallReportData] = useState({ data: [], totalPaymentAmount: 0, totalPaymentCount: 0, totalRefundAmount: 0, totalRefundCount: 0 });
    const [overallLoading, setOverallLoading] = useState(false);
    const [overallFilters, setOverallFilters] = useState({ startDate: initialTodayStr, endDate: initialTodayStr });
    const [appliedOverallFilters, setAppliedOverallFilters] = useState({ startDate: initialTodayStr, endDate: initialTodayStr });

    // Details Modal State
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [detailsType, setDetailsType] = useState('payment');
    const [detailsData, setDetailsData] = useState([]);
    const [detailsPage, setDetailsPage] = useState(1);
    const [detailsTotalPages, setDetailsTotalPages] = useState(1);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsTotalAmount, setDetailsTotalAmount] = useState(0);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    // List and filter states
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [filters, setFilters] = useState({
        moduleName: '',
        changedBy: '',
        tuitionCode: '',
        newStatus: '',
        startDate: '',
        endDate: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        moduleName: '',
        changedBy: '',
        tuitionCode: '',
        newStatus: '',
        startDate: '',
        endDate: ''
    });

    const [usersList, setUsersList] = useState([]);

    // Check permissions - strictly Superadmin only
    useEffect(() => {
        if (role !== 'superadmin') {
            toast.error("Access denied. Superadmin permission required.");
            navigate("/admin/dashboard");
        }
    }, [role, navigate]);

    // Fetch users list
    useEffect(() => {
        if (role === 'superadmin') {
            fetchUsers();
        }
    }, [role]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/user/users', {
                headers: { Authorization: token }
            });
            setUsersList(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    // Fetch Stats and Data
    useEffect(() => {
        if (role === 'superadmin') {
            fetchTodayStats();
        }
    }, [role, appliedFilters]);

    useEffect(() => {
        if (role === 'superadmin') {
            fetchHistoryList();
        }
    }, [role, appliedFilters, currentPage]);

    useEffect(() => {
        if (role === 'superadmin' && activeTab === 'payment') {
            fetchPaymentReport();
        }
    }, [role, appliedPaymentFilters, activeTab]);

    useEffect(() => {
        if (role === 'superadmin' && activeTab === 'overall') {
            fetchOverallReport();
        }
    }, [role, appliedOverallFilters, activeTab]);

    const fetchPaymentReport = async () => {
        setPaymentLoading(true);
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/payment/route-report', {
                params: appliedPaymentFilters,
                headers: { Authorization: token }
            });
            setPaymentReportData(res.data);
        } catch (err) {
            console.error('Error fetching payment report:', err);
            toast.error("Failed to load payment route report.");
        } finally {
            setPaymentLoading(false);
        }
    };

    const fetchOverallReport = async () => {
        setOverallLoading(true);
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/payment/overall-report', {
                params: appliedOverallFilters,
                headers: { Authorization: token }
            });
            setOverallReportData(res.data);
        } catch (err) {
            console.error('Error fetching overall report:', err);
            toast.error("Failed to load overall payment report.");
        } finally {
            setOverallLoading(false);
        }
    };

    const fetchTodayStats = async () => {
        setStatsLoading(true);
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/statusHistory/today-report', {
                params: appliedFilters,
                headers: { Authorization: token }
            });
            setTodayStats(res.data);
        } catch (err) {
            console.error('Error fetching today stats:', err);
            toast.error("Failed to load today's report stats.");
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchHistoryList = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/statusHistory/list', {
                params: {
                    page: currentPage,
                    limit: 25,
                    ...appliedFilters
                },
                headers: { Authorization: token }
            });
            setHistoryList(res.data.data);
            setTotalPages(res.data.totalPages);
            setTotalRecords(res.data.totalRecords);
        } catch (err) {
            console.error('Error fetching status history:', err);
            toast.error("Failed to load status history list.");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleModuleChange = (value) => {
        setFilters(prev => {
            const nextFilters = { ...prev, moduleName: value };
            const statusToSectionMap = {
                'verified': 'RegTeacher',
                'after confirmation': 'RegTeacher',
                'after salary': 'RegTeacher',
                '30% advance': 'RegTeacher',
                'confirm': 'Tuition',
                'cancel': 'Tuition',
                'suspend': 'Tuition',
                'selected': 'TuitionApply',
                'confirmed': 'TuitionApply'
            };
            if (prev.newStatus && statusToSectionMap[prev.newStatus] !== value && value !== '') {
                nextFilters.newStatus = '';
            }
            return nextFilters;
        });
    };

    const handleStatusChange = (value) => {
        setFilters(prev => {
            const nextFilters = { ...prev, newStatus: value };
            const statusToSectionMap = {
                'verified': 'RegTeacher',
                'after confirmation': 'RegTeacher',
                'after salary': 'RegTeacher',
                '30% advance': 'RegTeacher',
                'confirm': 'Tuition',
                'cancel': 'Tuition',
                'suspend': 'Tuition',
                'selected': 'TuitionApply',
                'confirmed': 'TuitionApply'
            };
            if (value && statusToSectionMap[value]) {
                nextFilters.moduleName = statusToSectionMap[value];
            }
            return nextFilters;
        });
    };

    const handleApplyFilters = () => {
        setAppliedFilters(filters);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        const reset = {
            moduleName: '',
            changedBy: '',
            tuitionCode: '',
            newStatus: '',
            startDate: '',
            endDate: ''
        };
        setFilters(reset);
        setAppliedFilters(reset);
        setCurrentPage(1);
    };

    const fetchDateDetails = async (dateStr, type, pageNum) => {
        setDetailsLoading(true);
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/payment/date-details', {
                params: { date: dateStr, type, page: pageNum, limit: 20 },
                headers: { Authorization: token }
            });
            setDetailsData(res.data.data);
            setDetailsPage(res.data.currentPage);
            setDetailsTotalPages(res.data.totalPages);
            setDetailsTotalAmount(res.data.totalAmount || 0);
        } catch (err) {
            console.error('Error fetching date details:', err);
            toast.error("Failed to load details.");
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleDateClick = (dateStr, type = 'payment') => {
        setSelectedDate(dateStr);
        setDetailsType(type);
        setShowDetailsModal(true);
        setDetailsPage(1);
        fetchDateDetails(dateStr, type, 1);
    };

    const handleDetailsPageChange = (newPage) => {
        if (newPage >= 1 && newPage <= detailsTotalPages) {
            fetchDateDetails(selectedDate, detailsType, newPage);
        }
    };

    const handleDetailsTypeChange = (type) => {
        setDetailsType(type);
        setDetailsPage(1);
        fetchDateDetails(selectedDate, type, 1);
    };

    const handlePresetSelect = (preset) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (preset) {
            case 'today':
                break;
            case 'yesterday':
                start.setDate(today.getDate() - 1);
                end.setDate(today.getDate() - 1);
                break;
            case 'thisWeek': {
                const day = today.getDay();
                start.setDate(today.getDate() - day);
                break;
            }
            case 'thisMonth':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'lastMonth':
                start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                end = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            case 'last7Days':
                start.setDate(today.getDate() - 6);
                break;
            case 'last30Days':
                start.setDate(today.getDate() - 29);
                break;
            default:
                return;
        }

        const formatDate = (date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };

        const newFilters = {
            ...filters,
            startDate: formatDate(start),
            endDate: formatDate(end)
        };
        setFilters(newFilters);
        setAppliedFilters(newFilters);
        setCurrentPage(1);
    };

    const handlePaymentFilterChange = (field, value) => {
        setPaymentFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyPaymentFilters = () => {
        setAppliedPaymentFilters(paymentFilters);
    };

    const handleResetPaymentFilters = () => {
        const reset = { startDate: '', endDate: '' };
        setPaymentFilters(reset);
        setAppliedPaymentFilters(reset);
    };

    const handlePaymentPresetSelect = (preset) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (preset) {
            case 'today':
                break;
            case 'yesterday':
                start.setDate(today.getDate() - 1);
                end.setDate(today.getDate() - 1);
                break;
            case 'thisWeek': {
                const day = today.getDay();
                start.setDate(today.getDate() - day);
                break;
            }
            case 'thisMonth':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'lastMonth':
                start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                end = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            case 'last7Days':
                start.setDate(today.getDate() - 6);
                break;
            case 'last30Days':
                start.setDate(today.getDate() - 29);
                break;
            default:
                return;
        }

        const formatDate = (date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };

        const newFilters = {
            startDate: formatDate(start),
            endDate: formatDate(end)
        };
        setPaymentFilters(newFilters);
        setAppliedPaymentFilters(newFilters);
    };

    const handleOverallFilterChange = (field, value) => {
        setOverallFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyOverallFilters = () => {
        setAppliedOverallFilters(overallFilters);
    };

    const handleResetOverallFilters = () => {
        const reset = { startDate: '', endDate: '' };
        setOverallFilters(reset);
        setAppliedOverallFilters(reset);
    };

    const handleOverallPresetSelect = (preset) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (preset) {
            case 'today':
                break;
            case 'yesterday':
                start.setDate(today.getDate() - 1);
                end.setDate(today.getDate() - 1);
                break;
            case 'thisWeek': {
                const day = today.getDay();
                start.setDate(today.getDate() - day);
                break;
            }
            case 'thisMonth':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'lastMonth':
                start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                end = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            case 'last7Days':
                start.setDate(today.getDate() - 6);
                break;
            case 'last30Days':
                start.setDate(today.getDate() - 29);
                break;
            default:
                return;
        }

        const formatDate = (date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };

        const newFilters = {
            startDate: formatDate(start),
            endDate: formatDate(end)
        };
        setOverallFilters(newFilters);
        setAppliedOverallFilters(newFilters);
    };

    const handleExportCSV = async () => {
        setExporting(true);
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/statusHistory/export-csv', {
                params: {
                    ...appliedFilters
                },
                headers: { Authorization: token },
                responseType: 'blob'
            });

            const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `status_history_report_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("CSV export downloaded successfully!");
        } catch (err) {
            console.error("Export error:", err);
            toast.error("Failed to export status history data.");
        } finally {
            setExporting(false);
        }
    };

    if (role !== 'superadmin') {
        return null;
    }

    return (
        <>
            <NavBarPage />
            <StyledContainer fluid>
                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                    <Nav variant="pills" className="mb-4 custom-pills border-0">
                        <Nav.Item>
                            <Nav.Link eventKey="status">
                                <span className="d-flex align-items-center gap-2"><FaHistory /> Status History</span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="payment">
                                <span className="d-flex align-items-center gap-2"><FaChartPie /> Payment Report</span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="overall">
                                <span className="d-flex align-items-center gap-2"><FaBookOpen /> Overall Payment Report</span>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <div className="d-flex justify-content-between align-items-center mb-3 mt-0">
                        <div>
                            {activeTab === 'status' ? (
                                <>
                                    <h4 className="text-primary fw-extrabold d-flex align-items-center gap-2 mb-1" style={{ letterSpacing: '-0.5px' }}>
                                        <FaHistory /> Status History Report
                                    </h4>
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        <span className="text-muted small">Monitor and audit status logs across modules</span>
                                        <span className="text-secondary opacity-50 d-none d-sm-inline">•</span>
                                        <span className="text-success fw-bold px-2 py-0.5 bg-soft-success rounded-pill" style={{ fontSize: '10px' }}>
                                            Active since: 16 July 2026
                                        </span>
                                    </div>
                                </>
                            ) : activeTab === 'payment' ? (
                                <>
                                    <h4 className="text-primary fw-extrabold d-flex align-items-center gap-2 mb-1" style={{ letterSpacing: '-0.5px' }}>
                                        <FaChartPie /> Payment Route Report
                                    </h4>
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        <span className="text-muted small" style={{ fontSize: '12px' }}>Analyze revenue and transactions by payment method</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h4 className="text-primary fw-extrabold d-flex align-items-center gap-2 mb-1" style={{ letterSpacing: '-0.5px' }}>
                                        <FaBookOpen /> Overall Payment Report
                                    </h4>
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        <span className="text-muted small" style={{ fontSize: '12px' }}>Consolidated daily view of Payments and Refunds</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="d-flex gap-2">
                            {activeTab === 'status' && (
                                <>
                                    <Button
                                        variant="outline-primary"
                                        onClick={handleExportCSV}
                                        disabled={exporting}
                                        className="px-3 py-1 rounded-pill shadow-sm d-flex align-items-center gap-2"
                                        size="sm"
                                    >
                                        {exporting ? <Spinner animation="border" size="sm" /> : "Export CSV"}
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={fetchTodayStats}
                                        disabled={statsLoading}
                                        className="px-3 py-1 rounded-pill shadow-sm"
                                        size="sm"
                                    >
                                        {statsLoading ? <Spinner animation="border" size="sm" /> : "Refresh Metrics"}
                                    </Button>
                                </>
                            )}
                            {activeTab === 'payment' && (
                                <Button
                                    variant="primary"
                                    onClick={fetchPaymentReport}
                                    disabled={paymentLoading}
                                    className="px-3 py-1 rounded-pill shadow-sm"
                                    size="sm"
                                >
                                    {paymentLoading ? <Spinner animation="border" size="sm" /> : "Refresh Report"}
                                </Button>
                            )}
                        </div>
                    </div>

                    <Tab.Content>
                        <Tab.Pane eventKey="status">
                            {/* Today's KPI Widgets */}
                            <Row className="mb-4 g-4 mt-1">
                                <Col md={3}>
                                    <PremiumStatsCard className="shadow-sm bg-white border border-success p-2 px-3 rounded-4" style={{ borderWidth: '2px !important' }}>
                                        <Card.Body className="p-0">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <div className="icon-wrapper bg-success bg-opacity-10 text-success rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                    <FaUserCheck size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Teachers Verified Today</span>
                                                    <h2 className="fw-extrabold text-dark mb-0 mt-1" style={{ fontSize: '1.75rem' }}>{todayStats.verifiedTeachersCount}</h2>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '6px', marginTop: '6px' }}>
                                                <Row className="g-2 text-center text-dark" style={{ fontSize: '12.5px' }}>
                                                    <Col xs={6} style={{ borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}>
                                                        <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>Verified</div>
                                                        <div className="fw-bold fs-6">{todayStats.verifiedBreakdown?.verified || 0}</div>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>Confirmed</div>
                                                        <div className="fw-bold fs-6">{todayStats.verifiedBreakdown?.afterConfirmation || 0}</div>
                                                    </Col>
                                                    <Col xs={6} style={{ borderRight: '1px solid rgba(0, 0, 0, 0.1)', borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '4px' }}>
                                                        <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>After Salary</div>
                                                        <div className="fw-bold fs-6">{todayStats.verifiedBreakdown?.afterSalary || 0}</div>
                                                    </Col>
                                                    <Col xs={6} style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '4px' }}>
                                                        <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>30% Adv</div>
                                                        <div className="fw-bold fs-6">{todayStats.verifiedBreakdown?.advance30 || 0}</div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card.Body>
                                    </PremiumStatsCard>
                                </Col>
                                <Col md={3}>
                                    <PremiumStatsCard className="shadow-sm bg-white border border-info p-2 px-3 rounded-4" style={{ borderWidth: '2px !important' }}>
                                        <Card.Body className="p-0">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <div className="icon-wrapper bg-info bg-opacity-10 text-info rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                    <FaBookOpen size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Tuitions Confirmed Today</span>
                                                    <h2 className="fw-extrabold text-dark mb-0 mt-1" style={{ fontSize: '1.75rem' }}>{todayStats.confirmedTuitionsCount}</h2>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '6px', marginTop: '6px' }}>
                                                <Row className="g-2 text-center text-dark" style={{ fontSize: '12.5px' }}>
                                                    <Col xs={6}>
                                                        <div className="p-1 rounded bg-danger bg-opacity-10 text-danger border border-danger border-opacity-50">
                                                            <div className="text-uppercase fw-bold" style={{ fontSize: '11px' }}>Canceled</div>
                                                            <div className="fw-bold fs-6">{todayStats.cancelledTuitionsCount || 0}</div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <div className="p-1 rounded bg-danger bg-opacity-10 text-danger border border-danger border-opacity-50">
                                                            <div className="text-uppercase fw-bold" style={{ fontSize: '11px' }}>Suspended</div>
                                                            <div className="fw-bold fs-6">{todayStats.suspendedTuitionsCount || 0}</div>
                                                        </div>
                                                    </Col>
                                                    {/* Ghost second row to balance Card 1 height */}
                                                    <Col xs={12} style={{ opacity: 0, pointerEvents: 'none', paddingTop: '4px' }}>
                                                        <div className="fw-bold">Placeholder</div>
                                                        <div className="fw-bold fs-6">0</div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card.Body>
                                    </PremiumStatsCard>
                                </Col>
                                <Col md={3}>
                                    <PremiumStatsCard className="shadow-sm bg-white border border-warning p-2 px-3 rounded-4" style={{ borderWidth: '2px !important' }}>
                                        <Card.Body className="p-0">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <div className="icon-wrapper bg-warning bg-opacity-10 text-warning rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                    <FaUserCheck size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Applications Confirmed Today</span>
                                                    <h2 className="fw-extrabold text-dark mb-0 mt-1" style={{ fontSize: '1.75rem' }}>{todayStats.confirmedApplicationsCount}</h2>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '6px', marginTop: '6px' }}>
                                                <Row className="g-2 text-center text-dark" style={{ fontSize: '12.5px' }}>
                                                    <Col xs={6} style={{ borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}>
                                                        <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>Selected</div>
                                                        <div className="fw-bold fs-6">{todayStats.applyBreakdown?.selected || 0}</div>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>Confirmed</div>
                                                        <div className="fw-bold fs-6">{todayStats.applyBreakdown?.confirmed || 0}</div>
                                                    </Col>
                                                    {/* Ghost second row to balance Card 1 height */}
                                                    <Col xs={12} style={{ opacity: 0, pointerEvents: 'none', paddingTop: '4px' }}>
                                                        <div className="fw-bold">Placeholder</div>
                                                        <div className="fw-bold fs-6">0</div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card.Body>
                                    </PremiumStatsCard>
                                </Col>
                                <Col md={3}>
                                    <PremiumStatsCard className="shadow-sm bg-white border border-primary p-2 px-3 rounded-4" style={{ borderWidth: '2px !important' }}>
                                        <Card.Body className="p-0">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <div className="icon-wrapper bg-primary bg-opacity-10 text-primary rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                    <FaBookOpen size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Tuitions Created Today</span>
                                                    <h2 className="fw-extrabold text-dark mb-0 mt-1" style={{ fontSize: '1.75rem' }}>{todayStats.tuitionsCreatedTodayCount}</h2>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '6px', marginTop: '6px' }}>
                                                <Row className="g-2 text-center text-dark" style={{ fontSize: '12.5px' }}>
                                                    <Col xs={6} style={{ borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}>
                                                        <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>Created</div>
                                                        <div className="fw-bold fs-6">{todayStats.tuitionsCreatedTodayCount}</div>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>Deleted</div>
                                                        <div className="fw-bold fs-6">{todayStats.tuitionsDeletedTodayCount || 0}</div>
                                                    </Col>
                                                    {/* Ghost second row to balance Card 1 height */}
                                                    <Col xs={12} style={{ opacity: 0, pointerEvents: 'none', paddingTop: '4px' }}>
                                                        <div className="fw-bold">Placeholder</div>
                                                        <div className="fw-bold fs-6">0</div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card.Body>
                                    </PremiumStatsCard>
                                </Col>
                            </Row>

                            {/* Filters Row */}
                            <Card className="shadow-sm border-0 mb-4 rounded-4 filter-card">
                                <Card.Body className="p-4">
                                    <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
                                        <FaFilter className="text-primary" /> Filter Options
                                    </h5>
                                    <Form onSubmit={(e) => { e.preventDefault(); handleApplyFilters(); }}>
                                        <Row className="g-3">
                                            <Col md={2}>
                                                <Form.Label className="fw-semibold text-secondary small">Section</Form.Label>
                                                <Form.Select
                                                    value={filters.moduleName}
                                                    onChange={(e) => handleModuleChange(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleApplyFilters(); }}
                                                    className="rounded-3"
                                                >
                                                    <option value="">All Sections</option>
                                                    <option value="RegTeacher">Registered Teachers</option>
                                                    <option value="TuitionApply">Tuition Applications</option>
                                                    <option value="Tuition">Tuition Jobs</option>
                                                </Form.Select>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Label className="fw-semibold text-secondary small">Transition Status</Form.Label>
                                                <Form.Select
                                                    value={filters.newStatus}
                                                    onChange={(e) => handleStatusChange(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleApplyFilters(); }}
                                                    className="rounded-3"
                                                >
                                                    <option value="">All Statuses</option>
                                                    {allStatusOptions
                                                        .filter(opt => !filters.moduleName || opt.module === filters.moduleName)
                                                        .map(opt => (
                                                            <option key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </option>
                                                        ))
                                                    }
                                                </Form.Select>
                                            </Col>
                                            <Col md={1}>
                                                <Form.Label className="fw-semibold text-secondary small">Code</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Code"
                                                    value={filters.tuitionCode}
                                                    onChange={(e) => handleFilterChange('tuitionCode', e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleApplyFilters(); }}
                                                    className="rounded-3"
                                                />
                                            </Col>
                                            <Col md={2}>
                                                <Form.Label className="fw-semibold text-secondary small">Performed By</Form.Label>
                                                <CreatableSelect
                                                    isClearable
                                                    placeholder="Select or type user"
                                                    options={usersList.map(u => ({ value: u.username, label: `${u.name || u.username || ''} (${u.username || ''})` }))}
                                                    value={filters.changedBy ? { value: filters.changedBy, label: filters.changedBy } : null}
                                                    onChange={(newValue) => {
                                                        handleFilterChange('changedBy', newValue ? newValue.value : '');
                                                    }}
                                                    onInputChange={(inputValue, { action }) => {
                                                        if (action === 'input-change') {
                                                            handleFilterChange('changedBy', inputValue);
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleApplyFilters();
                                                        }
                                                    }}
                                                    styles={{
                                                        control: (base) => ({
                                                            ...base,
                                                            borderRadius: '0.375rem',
                                                            borderColor: '#dee2e6',
                                                            minHeight: '38px',
                                                            boxShadow: 'none',
                                                            '&:hover': {
                                                                borderColor: '#86b7fe'
                                                            }
                                                        }),
                                                        menu: (base) => ({
                                                            ...base,
                                                            zIndex: 9999
                                                        })
                                                    }}
                                                    formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
                                                />
                                            </Col>
                                            <Col md={2}>
                                                <Form.Label className="fw-semibold text-secondary small">Start Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={filters.startDate}
                                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleApplyFilters(); }}
                                                    className="rounded-3"
                                                />
                                            </Col>
                                            <Col md={2}>
                                                <Form.Label className="fw-semibold text-secondary small">End Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={filters.endDate}
                                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleApplyFilters(); }}
                                                    className="rounded-3"
                                                />
                                            </Col>
                                            <Col md={1} className="d-flex align-items-end gap-2">
                                                <Button variant="success" className="w-100 rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ height: '38px' }} type="submit" title="Search">
                                                    <FaSearch />
                                                </Button>
                                                <Button variant="danger" className="w-100 rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ height: '38px' }} onClick={handleResetFilters} title="Reset">
                                                    <FaUndo />
                                                </Button>
                                            </Col>
                                        </Row>
                                        <div className="d-flex align-items-center gap-2 mt-3 flex-wrap">
                                            <span className="text-secondary fw-semibold small d-flex align-items-center gap-1" style={{ fontSize: '11.5px' }}>
                                                <FaCalendarAlt className="text-primary" /> Quick Ranges:
                                            </span>
                                            {[
                                                { label: 'Today', key: 'today' },
                                                { label: 'Yesterday', key: 'yesterday' },
                                                { label: 'This Week', key: 'thisWeek' },
                                                { label: 'This Month', key: 'thisMonth' },
                                                { label: 'Last Month', key: 'lastMonth' },
                                                { label: 'Last 7 Days', key: 'last7Days' },
                                                { label: 'Last 30 Days', key: 'last30Days' },
                                            ].map((item) => (
                                                <button
                                                    key={item.key}
                                                    type="button"
                                                    className="preset-btn"
                                                    onClick={() => handlePresetSelect(item.key)}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>

                            {/* History list card */}
                            <Card className="shadow-sm border-0 rounded-4 list-card">
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div>
                                            <Card.Title className="fw-extrabold text-dark mb-0" style={{ fontSize: '1.25rem' }}>Update Trail Logs</Card.Title>
                                            <small className="text-muted">Currently displaying {totalRecords} records</small>
                                        </div>
                                    </div>
                                    <div className="table-responsive rounded-3 shadow-sm" style={{ maxHeight: "550px", overflowY: "auto" }}>
                                        <Table hover striped bordered className="align-middle text-center mb-0 custom-reports-table">
                                            <thead className="table-dark sticky-top">
                                                <tr>
                                                    <th>SL</th>
                                                    <th>Timestamp</th>
                                                    <th>Section</th>
                                                    <th>Tuition / Premium Code</th>
                                                    <th>Target ID</th>
                                                    <th>State Transition</th>
                                                    <th>Performed By</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan="7" className="py-5">
                                                            <div className="d-flex flex-column align-items-center gap-2">
                                                                <Spinner animation="border" variant="primary" />
                                                                <span className="text-muted small fw-semibold">Loading logs...</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : historyList.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="py-5 text-muted fw-bold">
                                                            No updates found matching the filters.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    historyList.map((log, index) => (
                                                        <tr key={log._id}>
                                                            <td className="fw-bold text-dark">{((currentPage - 1) * 25) + index + 1}</td>
                                                            <td className="fw-semibold text-secondary">
                                                                {new Date(log.timestamp).toLocaleString('en-GB', {
                                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                                    hour: '2-digit', minute: '2-digit', hour12: true
                                                                })}
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${log.module === 'RegTeacher' ? 'bg-soft-primary' :
                                                                        log.module === 'Tuition' ? 'bg-soft-info' : 'bg-soft-success'
                                                                    } px-3 py-2 rounded-pill fw-bold`}>
                                                                    {log.module === 'RegTeacher' ? 'Premium Teacher' :
                                                                        log.module === 'Tuition' ? 'Tuition' : 'Tuition Apply'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="fw-bold text-primary font-monospace">
                                                                    {log.tuitionCode || '-'}
                                                                </span>
                                                            </td>
                                                            <td className="text-muted font-monospace" style={{ fontSize: '11.5px' }}>
                                                                {log.resourceId}
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center justify-content-center gap-2">
                                                                    <span className="badge bg-secondary-soft text-capitalize fw-bold">{log.oldStatus || "Created"}</span>
                                                                    <span className="text-muted fw-bold">&rarr;</span>
                                                                    <span className="badge bg-success-soft text-capitalize fw-bold">{log.newStatus}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className="badge bg-dark-soft px-3 py-2 fw-bold font-monospace">{log.changedBy}</span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <Button
                                            variant="outline-primary"
                                            disabled={currentPage === 1 || loading}
                                            onClick={() => setCurrentPage(p => p - 1)}
                                            className="px-4 py-2 rounded-pill shadow-sm"
                                        >
                                            Previous
                                        </Button>
                                        <span className="fw-semibold text-secondary">Page {currentPage} of {totalPages}</span>
                                        <Button
                                            variant="outline-primary"
                                            disabled={currentPage === totalPages || loading}
                                            onClick={() => setCurrentPage(p => p + 1)}
                                            className="px-4 py-2 rounded-pill shadow-sm"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Tab.Pane>

                        <Tab.Pane eventKey="payment">
                            <Row className="mb-3 g-4 mt-1">
                                <Col md={3}>
                                    <PremiumStatsCard className="shadow-sm bg-white border border-success p-2 px-3 rounded-4" style={{ borderWidth: '2px !important' }}>
                                        <Card.Body className="p-0">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <div className="icon-wrapper bg-success bg-opacity-10 text-success rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                    <FaBookOpen size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Total Revenue</span>
                                                    <h2 className="fw-extrabold text-dark mb-0 mt-1" style={{ fontSize: '1.75rem' }}>
                                                        {paymentLoading ? <Spinner animation="border" size="sm" /> : `৳ ${paymentReportData.totalAmount?.toLocaleString()}`}
                                                    </h2>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </PremiumStatsCard>
                                </Col>
                                <Col md={3}>
                                    <PremiumStatsCard className="shadow-sm bg-white border border-primary p-2 px-3 rounded-4" style={{ borderWidth: '2px !important' }}>
                                        <Card.Body className="p-0">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <div className="icon-wrapper bg-primary bg-opacity-10 text-primary rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                    <FaTag size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Total Transactions</span>
                                                    <h2 className="fw-extrabold text-dark mb-0 mt-1" style={{ fontSize: '1.75rem' }}>
                                                        {paymentLoading ? <Spinner animation="border" size="sm" /> : paymentReportData.totalCount?.toLocaleString()}
                                                    </h2>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </PremiumStatsCard>
                                </Col>
                            </Row>

                            <Card className="shadow-sm border-0 mb-3 rounded-4 filter-card">
                                <Card.Body className="p-2 px-3">
                                    <h6 className="fw-bold mb-2 d-flex align-items-center gap-2 text-dark">
                                        <FaFilter className="text-primary" /> Payment Filters
                                    </h6>
                                    <Row className="g-3">
                                        <Col md={3}>
                                            <Form.Label className="fw-semibold text-secondary small">Start Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={paymentFilters.startDate}
                                                onChange={(e) => handlePaymentFilterChange('startDate', e.target.value)}
                                                className="rounded-3"
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <Form.Label className="fw-semibold text-secondary small">End Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={paymentFilters.endDate}
                                                onChange={(e) => handlePaymentFilterChange('endDate', e.target.value)}
                                                className="rounded-3"
                                            />
                                        </Col>
                                        <Col md={2} className="d-flex align-items-end gap-2">
                                            <Button variant="success" className="w-100 rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ height: '38px' }} onClick={handleApplyPaymentFilters} title="Search">
                                                <FaSearch />
                                            </Button>
                                            <Button variant="danger" className="w-100 rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ height: '38px' }} onClick={handleResetPaymentFilters} title="Reset">
                                                <FaUndo />
                                            </Button>
                                        </Col>
                                    </Row>
                                    <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                                        <span className="text-secondary fw-semibold small d-flex align-items-center gap-1" style={{ fontSize: '11.5px' }}>
                                            <FaCalendarAlt className="text-primary" /> Quick Ranges:
                                        </span>
                                        {['today', 'yesterday', 'thisWeek', 'thisMonth', 'lastMonth', 'last7Days', 'last30Days'].map((preset) => (
                                            <button
                                                key={preset}
                                                type="button"
                                                className="preset-btn"
                                                onClick={() => handlePaymentPresetSelect(preset)}
                                            >
                                                {preset.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </button>
                                        ))}
                                    </div>
                                </Card.Body>
                            </Card>

                            {paymentLoading ? (
                                <div className="d-flex justify-content-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : (
                                <>

                                    {paymentReportData.data && paymentReportData.data.length > 0 && (
                                        <Row className="g-3 mb-3">
                                            <Col md={12}>
                                                <Card className="shadow-sm border-0 rounded-4 h-100">
                                                    <Card.Body className="p-3">
                                                        <h6 className="fw-bold mb-3 text-dark">Revenue by Date</h6>
                                                        <div style={{ width: '100%', height: 220 }}>
                                                            <ResponsiveContainer>
                                                                <BarChart data={paymentReportData.dateData || paymentReportData.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                                    <XAxis
                                                                        dataKey="date"
                                                                        axisLine={false}
                                                                        tickLine={false}
                                                                        tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                                    />
                                                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(tick) => `৳${tick / 1000}k`} />
                                                                    <Tooltip
                                                                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                                    />
                                                                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                                                </BarChart>
                                                            </ResponsiveContainer>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    )}

                                    <Card className="shadow-sm border-0 rounded-4 mb-3">
                                        <Card.Body className="p-2 px-3">
                                            <h6 className="fw-bold mb-2 text-dark">Detailed Breakdown</h6>
                                            <div className="table-responsive rounded-3 shadow-sm" style={{ maxHeight: "350px", overflowY: "auto" }}>
                                                <Table hover striped bordered className="align-middle text-center mb-0 custom-reports-table">
                                                    <thead className="table-dark sticky-top">
                                                        <tr>
                                                            <th>SL</th>
                                                            <th className="text-start">Date</th>
                                                            <th>Total Amount (৳)</th>
                                                            <th>Transactions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {paymentReportData.dateData && paymentReportData.dateData.length > 0 ? (
                                                            paymentReportData.dateData.map((row, idx) => (
                                                                <tr key={idx}>
                                                                    <td className="fw-bold text-dark">{idx + 1}</td>
                                                                    <td className="text-start fw-bold">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            <a href="#" className="text-decoration-none text-primary" onClick={(e) => { e.preventDefault(); handleDateClick(row.date, 'payment'); }}>
                                                                                {new Date(row.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                            </a>
                                                                        </div>
                                                                    </td>
                                                                    <td className="fw-semibold text-success">৳ {row.amount.toLocaleString()}</td>
                                                                    <td className="fw-semibold">{row.count.toLocaleString()}</td>
                                                                </tr>
                                                            ))
                                                        ) : paymentReportData.data && paymentReportData.data.length > 0 ? (
                                                            paymentReportData.data.map((row, idx) => (
                                                                <tr key={idx}>
                                                                    <td className="fw-bold text-dark">{idx + 1}</td>
                                                                    <td className="text-start fw-bold">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            {row.route}
                                                                        </div>
                                                                    </td>
                                                                    <td className="fw-semibold text-success">৳ {row.amount.toLocaleString()}</td>
                                                                    <td className="fw-semibold">{row.count.toLocaleString()}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="4" className="py-4 text-muted fw-bold">No payment data found for the selected period.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </>
                            )}
                        </Tab.Pane>

                        <Tab.Pane eventKey="overall">
                            <Row className="mb-3 g-4 mt-1">
                                <Col md={6}>
                                    <PremiumStatsCard className="shadow-sm bg-white border border-success p-2 px-3 rounded-4" style={{ borderWidth: '2px !important' }}>
                                        <Card.Body className="p-0">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <div className="icon-wrapper bg-success bg-opacity-10 text-success rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                    <FaChartPie size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Total Payments</span>
                                                    <h2 className="fw-extrabold text-dark mb-0 mt-1" style={{ fontSize: '1.75rem' }}>৳ {overallReportData.totalPaymentAmount?.toLocaleString() || 0}</h2>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '6px', marginTop: '6px' }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>Total Transactions</div>
                                                    <div className="fw-bold fs-6 text-success">{overallReportData.totalPaymentCount}</div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </PremiumStatsCard>
                                </Col>
                                <Col md={6}>
                                    <PremiumStatsCard className="shadow-sm bg-white border border-danger p-2 px-3 rounded-4" style={{ borderWidth: '2px !important' }}>
                                        <Card.Body className="p-0">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <div className="icon-wrapper bg-danger bg-opacity-10 text-danger rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                    <FaUndo size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Total Refunds</span>
                                                    <h2 className="fw-extrabold text-dark mb-0 mt-1" style={{ fontSize: '1.75rem' }}>৳ {overallReportData.totalRefundAmount?.toLocaleString() || 0}</h2>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '6px', marginTop: '6px' }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>Total Transactions</div>
                                                    <div className="fw-bold fs-6 text-danger">{overallReportData.totalRefundCount}</div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </PremiumStatsCard>
                                </Col>
                            </Row>

                            <Card className="shadow-sm border-0 mb-3 rounded-4 filter-card">
                                <Card.Body className="p-2 px-3">
                                    <h6 className="fw-bold mb-2 d-flex align-items-center gap-2 text-dark">
                                        <FaFilter className="text-primary" /> Overall Filters
                                    </h6>
                                    <Row className="g-3">
                                        <Col md={3}>
                                            <Form.Label className="fw-semibold text-secondary small">Start Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={overallFilters.startDate}
                                                onChange={(e) => handleOverallFilterChange('startDate', e.target.value)}
                                                className="rounded-3"
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <Form.Label className="fw-semibold text-secondary small">End Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={overallFilters.endDate}
                                                onChange={(e) => handleOverallFilterChange('endDate', e.target.value)}
                                                className="rounded-3"
                                            />
                                        </Col>
                                        <Col md={2} className="d-flex align-items-end gap-2">
                                            <Button variant="success" className="w-100 rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ height: '38px' }} onClick={handleApplyOverallFilters} title="Search">
                                                <FaSearch />
                                            </Button>
                                            <Button variant="danger" className="w-100 rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ height: '38px' }} onClick={handleResetOverallFilters} title="Reset">
                                                <FaUndo />
                                            </Button>
                                        </Col>
                                    </Row>
                                    <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                                        <span className="text-secondary fw-semibold small d-flex align-items-center gap-1" style={{ fontSize: '11.5px' }}>
                                            <FaCalendarAlt className="text-primary" /> Quick Ranges:
                                        </span>
                                        {['today', 'yesterday', 'thisWeek', 'thisMonth', 'lastMonth', 'last7Days', 'last30Days'].map((preset) => (
                                            <button
                                                key={preset}
                                                type="button"
                                                className="preset-btn"
                                                onClick={() => handleOverallPresetSelect(preset)}
                                            >
                                                {preset.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </button>
                                        ))}
                                    </div>
                                </Card.Body>
                            </Card>

                            {overallLoading ? (
                                <div className="d-flex justify-content-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : (
                                <Card className="shadow-sm border-0 rounded-4 mb-3">
                                    <Card.Body className="p-2 px-3">
                                        <h6 className="fw-bold mb-2 text-dark">Combined Breakdown</h6>
                                        <div className="table-responsive rounded-3 shadow-sm" style={{ maxHeight: "450px", overflowY: "auto" }}>
                                            <Table hover striped bordered className="align-middle text-center mb-0 custom-reports-table">
                                                <thead className="table-dark sticky-top">
                                                    <tr>
                                                        <th>SL</th>
                                                        <th className="text-start">Date</th>
                                                        <th>Payment Amount (৳)</th>
                                                        <th>Payment Transactions</th>
                                                        <th className="text-danger">Refund Amount (৳)</th>
                                                        <th className="text-danger">Refund Transactions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {overallReportData.data && overallReportData.data.length > 0 ? (
                                                        overallReportData.data.map((row, idx) => (
                                                            <tr key={idx}>
                                                                <td className="fw-bold text-dark">{idx + 1}</td>
                                                                <td className="text-start fw-bold">
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <a href="#" className="text-decoration-none text-primary" onClick={(e) => { e.preventDefault(); handleDateClick(row.date, 'payment'); }}>
                                                                            {new Date(row.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                                <td className="fw-semibold text-success">৳ {row.paymentAmount.toLocaleString()}</td>
                                                                <td className="fw-semibold text-success">{row.paymentCount.toLocaleString()}</td>
                                                                <td className="fw-semibold text-danger">৳ {row.refundAmount.toLocaleString()}</td>
                                                                <td className="fw-semibold text-danger">{row.refundCount.toLocaleString()}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="6" className="py-4 text-muted fw-bold">No combined data found for the selected period.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )}
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>

                {/* Details Modal */}
                <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title className="fw-bold text-primary">
                            Details for {selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0">
                        {activeTab === 'overall' && (
                            <div className="px-4 pt-3 pb-2 border-bottom">
                                <Nav variant="pills" className="custom-pills">
                                    <Nav.Item>
                                        <Nav.Link active={detailsType === 'payment'} onClick={() => handleDetailsTypeChange('payment')} className="px-4 py-2 fw-semibold">
                                            Payments
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link active={detailsType === 'refund'} onClick={() => handleDetailsTypeChange('refund')} className="px-4 py-2 fw-semibold text-danger">
                                            Refunds
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                        )}
                        
                        <div className="p-4 pt-3">
                            {detailsLoading ? (
                                <div className="d-flex justify-content-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : detailsData.length === 0 ? (
                                <div className="text-center py-5 text-muted fw-bold">
                                    No records found for this date.
                                </div>
                            ) : (
                                <>
                                    <div className="table-responsive rounded-3 border shadow-sm mb-3">
                                        <Table hover className="mb-0 text-center align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>SL</th>
                                                    <th>Tuition Code</th>
                                                    {detailsType === 'payment' && <th>Tutor Number</th>}
                                                    <th>Route</th>
                                                    <th>{detailsType === 'payment' ? 'Received Amount (৳)' : 'Refund Amount (৳)'}</th>
                                                    <th>Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {detailsData.map((item, idx) => (
                                                    <tr key={item._id}>
                                                        <td className="fw-bold text-dark">{((detailsPage - 1) * 20) + idx + 1}</td>
                                                        <td className="fw-bold">{item.tuitionCode}</td>
                                                        {detailsType === 'payment' && <td className="text-muted">{item.tutorNumber}</td>}
                                                        <td><Badge bg={item.route === 'Bkash' ? 'danger' : 'info'} className="px-2 py-1">{item.route}</Badge></td>
                                                        <td className={`fw-bold ${detailsType === 'payment' ? 'text-success' : 'text-danger'}`}>
                                                            ৳ {item.amount.toLocaleString()}
                                                        </td>
                                                        <td className="text-muted small">
                                                            {new Date(item.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            {detailsData.length > 0 && (
                                                <tfoot className="table-light">
                                                    <tr>
                                                        <td colSpan={detailsType === 'payment' ? 4 : 3} className="text-end pe-4 fw-extrabold text-dark text-uppercase tracking-wider">
                                                            Total Amount
                                                        </td>
                                                        <td className={`fw-extrabold fs-6 ${detailsType === 'payment' ? 'text-success' : 'text-danger'}`}>
                                                            ৳ {detailsTotalAmount.toLocaleString()}
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                </tfoot>
                                            )}
                                        </Table>
                                    </div>
                                    
                                    {detailsTotalPages > 1 && (
                                        <div className="d-flex justify-content-end">
                                            <Pagination size="sm" className="mb-0">
                                                <Pagination.Prev onClick={() => handleDetailsPageChange(detailsPage - 1)} disabled={detailsPage === 1} />
                                                <Pagination.Item active>{detailsPage}</Pagination.Item>
                                                <Pagination.Next onClick={() => handleDetailsPageChange(detailsPage + 1)} disabled={detailsPage === detailsTotalPages} />
                                            </Pagination>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </Modal.Body>
                </Modal>

            </StyledContainer>
            <ToastContainer />
        </>
    );
};

export default StatusHistoryReportPage;

const StyledContainer = styled(Container)`
  padding: 15px;
  background: #f8fafc;
  min-height: 100vh;
  
  .bg-gradient-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
  .bg-gradient-info {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  }
  .bg-gradient-warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  .bg-gradient-primary {
    background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
  }
  
  .bg-white-20 {
    background-color: rgba(255, 255, 255, 0.18);
  }
  
  .bg-black-10 {
    background-color: rgba(0, 0, 0, 0.08);
  }
  
  .tracking-wider {
    letter-spacing: 0.8px;
    font-size: 11px;
    font-weight: 700;
  }
  
  .fw-extrabold {
    font-weight: 800;
  }
  
  /* Soft colored badges custom class */
  .bg-soft-primary {
    background-color: #eff6ff;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  }
  
  .bg-soft-info {
    background-color: #f0fdfa;
    color: #115e59;
    border: 1px solid #ccfbf1;
  }
  
  .bg-soft-success {
    background-color: #f0fdf4;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  .bg-secondary-soft {
    background-color: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
  }
  
  .bg-success-soft {
    background-color: #ecfdf5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }
  
  .bg-dark-soft {
    background-color: #f8fafc;
    color: #0f172a;
    border: 1px solid #e2e8f0;
  }

  .preset-btn {
    font-size: 11px;
    background-color: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0 !important;
    padding: 4px 12px;
    border-radius: 50px;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .preset-btn:hover {
    background-color: #eff6ff;
    color: #2563eb;
    border-color: #bfdbfe !important;
    transform: translateY(-1px);
  }
  .preset-btn:active {
    transform: translateY(0);
  }
  
  /* Table styling enhancements */
  .custom-reports-table {
    border: 1px solid #e2e8f0;
  }
  
  .custom-reports-table th {
    font-weight: 700;
    font-size: 13.5px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    background-color: #1d4ed8 !important;
    color: #ffffff !important;
    border-color: #1e40af;
    padding: 10px;
  }
  
  .custom-reports-table td {
    padding: 10px;
    font-size: 14px;
    border-color: #e2e8f0;
  }
  
  .custom-pills {
    background-color: #e2e8f0;
    padding: 4px;
    border-radius: 10px;
    display: inline-flex;
    gap: 4px;
    flex-wrap: wrap;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.04);
  }
  .custom-pills .nav-link {
    color: #475569;
    font-weight: 600;
    border-radius: 8px;
    padding: 8px 20px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    font-size: 14.5px;
  }
  .custom-pills .nav-link:hover {
    color: #0f172a;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .custom-pills .nav-link.active {
    background-color: #ffffff !important;
    color: #1d4ed8 !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08) !important;
    font-weight: 700;
  }
`;

const PremiumStatsCard = styled(Card)`
  height: 100%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
  cursor: default;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15) !important;
  }
`;
