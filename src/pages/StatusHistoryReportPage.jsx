import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Spinner, Badge, Tabs, Tab, Nav, Modal, Pagination, Dropdown } from 'react-bootstrap';
import { FaCalendarAlt, FaFilter, FaSearch, FaHistory, FaUserCheck, FaBookOpen, FaUndo, FaTag, FaChartPie, FaWallet, FaMinus, FaBalanceScale, FaColumns, FaChartBar } from 'react-icons/fa';
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
    { value: 'created', label: 'Tuition Created', module: 'Tuition' },
    { value: 'confirm', label: 'Confirm', module: 'Tuition' },
    { value: 'cancel', label: 'Cancel', module: 'Tuition' },
    { value: 'suspend', label: 'Suspend', module: 'Tuition' },
    { value: 'published', label: 'Published', module: 'Tuition' },
    { value: 'unpublished', label: 'Unpublished', module: 'Tuition' },
    { value: 'deleted', label: 'Tuition Deleted', module: 'Tuition' },
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

    // Marketing Report States
    const [marketingReportData, setMarketingReportData] = useState({ summary: [] });
    const [marketingLoading, setMarketingLoading] = useState(false);
    const [marketingFilters, setMarketingFilters] = useState({ startDate: initialTodayStr, endDate: initialTodayStr, medium: '' });
    const [appliedMarketingFilters, setAppliedMarketingFilters] = useState({ startDate: initialTodayStr, endDate: initialTodayStr, medium: '' });
    const [marketingMediums, setMarketingMediums] = useState([]);

    // Overall Table Column Visibility State with LocalStorage
    const overallColumnsConfig = [
        { key: 'sl', label: 'SL' },
        { key: 'paymentAmount', label: 'Payment Amount' },
        { key: 'paymentCount', label: 'Payment Count' },
        { key: 'premiumFeeAmount', label: 'Premium Teacher Fee' },
        { key: 'premiumFeeCount', label: 'Fee Count' },
        { key: 'serviceChargeAmount', label: 'Service Charge' },
        { key: 'serviceChargeCount', label: 'Service Charge Count' },
        { key: 'totalIncome', label: 'Total Income' },
        { key: 'refundAmount', label: 'Refund Amount' },
        { key: 'refundCount', label: 'Refund Count' },
        { key: 'expenseAmount', label: 'Expense Amount' },
    ];

    const [visibleOverallColumns, setVisibleOverallColumns] = useState(() => {
        try {
            const saved = localStorage.getItem('overallReport_visibleColumns');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading visible columns from localStorage:', e);
        }
        return overallColumnsConfig.reduce((acc, col) => ({ ...acc, [col.key]: true }), {});
    });

    const toggleOverallColumn = (colKey) => {
        setVisibleOverallColumns(prev => {
            const updated = { ...prev, [colKey]: !prev[colKey] };
            try {
                localStorage.setItem('overallReport_visibleColumns', JSON.stringify(updated));
            } catch (e) {
                console.error('Error saving visible columns to localStorage:', e);
            }
            return updated;
        });
    };

    const isColVisible = (key) => key === 'date' || key === 'balance' || visibleOverallColumns[key] !== false;

    // Details Modal State
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [detailsType, setDetailsType] = useState('payment');
    const [detailsData, setDetailsData] = useState([]);
    const [detailsAllData, setDetailsAllData] = useState(null);
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

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const showTodaySuffix = (!appliedFilters.startDate || appliedFilters.startDate === todayStr) && 
                            (!appliedFilters.endDate || appliedFilters.endDate === todayStr) &&
                            appliedFilters.isAllTime !== 'true';

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
            fetchSettings();
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

    const fetchSettings = async () => {
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/settings/marketing_mediums', {
                headers: { Authorization: token }
            });
            if (res.data && res.data.value) setMarketingMediums(res.data.value);
        } catch (err) {
            console.error('Error fetching marketing mediums:', err);
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

    useEffect(() => {
        if (role === 'superadmin' && activeTab === 'marketing') {
            fetchMarketingReport();
        }
    }, [role, appliedMarketingFilters, activeTab]);

    const fetchMarketingReport = async () => {
        setMarketingLoading(true);
        try {
            const queryParams = new URLSearchParams(appliedMarketingFilters).toString();
            const res = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/report/marketing?${queryParams}`, {
                headers: { Authorization: token }
            });
            setMarketingReportData(res.data);
        } catch (error) {
            console.error('Error fetching marketing report:', error);
            toast.error('Failed to load marketing report');
        } finally {
            setMarketingLoading(false);
        }
    };

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
                'created': 'Tuition',
                'confirm': 'Tuition',
                'cancel': 'Tuition',
                'suspend': 'Tuition',
                'deleted': 'Tuition',
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
                'created': 'Tuition',
                'confirm': 'Tuition',
                'cancel': 'Tuition',
                'suspend': 'Tuition',
                'deleted': 'Tuition',
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
            if (type === 'all') {
                setDetailsAllData(res.data);
            } else {
                setDetailsData(res.data.data);
                setDetailsPage(res.data.currentPage);
                setDetailsTotalPages(res.data.totalPages);
                setDetailsTotalAmount(res.data.totalAmount || 0);
            }
        } catch (err) {
            console.error('Error fetching date details:', err);
            toast.error("Failed to load details.");
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleDateClick = (dateStr, type = 'payment') => {
        setSelectedDate(dateStr);
        const reqType = activeTab === 'overall' ? 'all' : type;
        setDetailsType(reqType);
        setShowDetailsModal(true);
        setDetailsPage(1);
        fetchDateDetails(dateStr, reqType, 1);
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
            case 'allTime': {
                const newFilters = {
                    ...filters,
                    startDate: '',
                    endDate: '',
                    isAllTime: 'true'
                };
                setFilters(newFilters);
                setAppliedFilters(newFilters);
                setCurrentPage(1);
                return;
            }
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
            endDate: formatDate(end),
            isAllTime: 'false'
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
        const reset = { startDate: initialTodayStr, endDate: initialTodayStr };
        setPaymentFilters(reset);
        setAppliedPaymentFilters(reset);
    };

    const handlePaymentPresetSelect = (preset) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (preset) {
            case 'allTime':
                setPaymentFilters({ startDate: '', endDate: '' });
                setAppliedPaymentFilters({ startDate: '', endDate: '' });
                return;
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

    const handleMarketingPresetSelect = (preset) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (preset) {
            case 'allTime':
                setMarketingFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
                setAppliedMarketingFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
                return;
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
            ...marketingFilters,
            startDate: formatDate(start),
            endDate: formatDate(end)
        };
        setMarketingFilters(newFilters);
        setAppliedMarketingFilters(newFilters);
    };

    const handleOverallFilterChange = (field, value) => {
        setOverallFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyOverallFilters = () => {
        setAppliedOverallFilters(overallFilters);
    };

    const handleResetOverallFilters = () => {
        const reset = { startDate: initialTodayStr, endDate: initialTodayStr };
        setOverallFilters(reset);
        setAppliedOverallFilters(reset);
    };

    const handleOverallPresetSelect = (preset) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (preset) {
            case 'allTime':
                setOverallFilters({ startDate: '', endDate: '' });
                setAppliedOverallFilters({ startDate: '', endDate: '' });
                return;
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
                        <Nav.Item>
                            <Nav.Link eventKey="marketing">
                                <span className="d-flex align-items-center gap-2"><FaTag /> Marketing Report</span>
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
                                            (সঠিক রেজাল্ট দেখতে চাইলে ১৬ জুলাই ২০২৬ এর পরের রিপোর্ট দেখুন)
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
                            ) : activeTab === 'marketing' ? (
                                <>
                                    <h4 className="text-primary fw-extrabold d-flex align-items-center gap-2 mb-1" style={{ letterSpacing: '-0.5px' }}>
                                        <FaTag /> Marketing Report
                                    </h4>
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        <span className="text-muted small" style={{ fontSize: '12px' }}>Track tuition acquisitions by marketing medium</span>
                                        <span className="text-secondary opacity-50 d-none d-sm-inline">&#8226;</span>
                                        <span className="text-success fw-bold px-2 py-0.5 bg-soft-success rounded-pill" style={{ fontSize: '10px' }}>
                                            (সঠিক রেজাল্ট দেখতে চাইলে ২৩ জুলাই ২০২৬ এর পরের রিপোর্ট দেখুন)
                                        </span>
                                        <Badge bg="light" text="dark" className="border px-3 py-1 fw-medium shadow-sm rounded-pill ms-2">
                                            Total Tuitions: {marketingReportData?.summary?.reduce((acc, curr) => acc + curr.count, 0) || 0}
                                        </Badge>
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
                            {activeTab === 'marketing' && (
                                <Button
                                    variant="primary"
                                    onClick={fetchMarketingReport}
                                    disabled={marketingLoading}
                                    className="px-3 py-1 rounded-pill shadow-sm"
                                    size="sm"
                                >
                                    {marketingLoading ? <Spinner animation="border" size="sm" /> : "Refresh Report"}
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
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Teachers Verified{showTodaySuffix ? ' Today' : ''}</span>
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
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Tuitions Confirmed{showTodaySuffix ? ' Today' : ''}</span>
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
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Applications Confirmed{showTodaySuffix ? ' Today' : ''}</span>
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
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Tuitions Created{showTodaySuffix ? ' Today' : ''}</span>
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
                                                { label: 'All Time', key: 'allTime', extra: '(Active since: 16 July 2026)' },
                                            ].map((item) => (
                                                <button
                                                    key={item.key}
                                                    type="button"
                                                    className="preset-btn"
                                                    onClick={() => handlePresetSelect(item.key)}
                                                >
                                                    {item.label} {item.extra && <span className="opacity-75 ms-1" style={{ fontSize: '10.5px' }}>{item.extra}</span>}
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
                                        {['today', 'yesterday', 'thisWeek', 'thisMonth', 'lastMonth', 'last7Days', 'last30Days', 'allTime'].map((preset) => (
                                            <button
                                                key={preset}
                                                type="button"
                                                className="preset-btn"
                                                onClick={() => handlePaymentPresetSelect(preset)}
                                            >
                                                {preset === 'allTime' ? 'All Time' : preset.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
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
                            <Row className="mb-3 g-3 mt-1 flex-nowrap" style={{ overflowX: 'auto' }}>
                                <Col style={{ minWidth: '180px', flex: '1' }}>
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
                                <Col style={{ minWidth: '200px', flex: '1' }}>
                                    <PremiumStatsCard className="shadow-sm bg-white border border-info p-2 px-3 rounded-4" style={{ borderWidth: '2px !important' }}>
                                        <Card.Body className="p-0">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <div className="icon-wrapper bg-info bg-opacity-10 text-info rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                    <FaWallet size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Premium Teacher Fee</span>
                                                    <h2 className="fw-extrabold text-dark mb-0 mt-1" style={{ fontSize: '1.75rem' }}>৳ {overallReportData.totalPremiumFeeAmount?.toLocaleString() || 0}</h2>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '6px', marginTop: '6px' }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>Total Records</div>
                                                    <div className="fw-bold fs-6 text-info">{overallReportData.totalPremiumFeeCount || 0}</div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </PremiumStatsCard>
                                </Col>
                                <Col style={{ minWidth: '200px', flex: '1' }}>
                                    <PremiumStatsCard className="shadow-sm bg-white border border-info p-2 px-3 rounded-4" style={{ borderWidth: '2px !important' }}>
                                        <Card.Body className="p-0">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <div className="icon-wrapper bg-info bg-opacity-10 text-info rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                    <FaWallet size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Service Charge</span>
                                                    <h2 className="fw-extrabold text-dark mb-0 mt-1" style={{ fontSize: '1.75rem' }}>৳ {overallReportData.totalServiceChargeAmount?.toLocaleString() || 0}</h2>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '6px', marginTop: '6px' }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>Total Records</div>
                                                    <div className="fw-bold fs-6 text-info">{overallReportData.totalServiceChargeCount || 0}</div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </PremiumStatsCard>
                                </Col>
                                <Col style={{ minWidth: '200px', flex: '1' }}>
                                    <PremiumStatsCard className="shadow-sm bg-white border border-success p-2 px-3 rounded-4" style={{ borderWidth: '2px !important', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}>
                                        <Card.Body className="p-0">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <div className="icon-wrapper bg-success bg-opacity-15 text-success rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                    <FaChartPie size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Total Income</span>
                                                    <h2 className="fw-extrabold text-success mb-0 mt-1" style={{ fontSize: '1.75rem' }}>৳ {((overallReportData.totalPaymentAmount || 0) + (overallReportData.totalPremiumFeeAmount || 0) + (overallReportData.totalServiceChargeAmount || 0)).toLocaleString()}</h2>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '6px', marginTop: '6px' }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>Payment + Teacher Fee + Service Charge</div>
                                                    <div className="fw-bold fs-6 text-success">-</div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </PremiumStatsCard>
                                </Col>
                                <Col style={{ minWidth: '180px', flex: '1' }}>
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
                                <Col style={{ minWidth: '180px', flex: '1' }}>
                                    <PremiumStatsCard className="shadow-sm bg-white border border-warning p-2 px-3 rounded-4" style={{ borderWidth: '2px !important' }}>
                                        <Card.Body className="p-0">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <div className="icon-wrapper bg-warning bg-opacity-10 text-warning rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                    <FaMinus size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Total Expense</span>
                                                    <h2 className="fw-extrabold text-dark mb-0 mt-1" style={{ fontSize: '1.75rem' }}>৳ {overallReportData.totalExpenseAmount?.toLocaleString() || 0}</h2>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '6px', marginTop: '6px' }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>Total Transactions</div>
                                                    <div className="fw-bold fs-6 text-warning">{overallReportData.totalExpenseCount || 0}</div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </PremiumStatsCard>
                                </Col>
                                <Col style={{ minWidth: '200px', flex: '1' }}>
                                    <PremiumStatsCard className="shadow-sm bg-white border border-primary p-2 px-3 rounded-4" style={{ borderWidth: '2px !important' }}>
                                        <Card.Body className="p-0">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <div className="icon-wrapper bg-primary bg-opacity-10 text-primary rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                    <FaBalanceScale size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Total Balance</span>
                                                    <h2 className="fw-extrabold text-dark mb-0 mt-1" style={{ fontSize: '1.75rem' }}>৳ {(((overallReportData.totalPaymentAmount || 0) + (overallReportData.totalPremiumFeeAmount || 0) + (overallReportData.totalServiceChargeAmount || 0)) - (overallReportData.totalExpenseAmount || 0)).toLocaleString()}</h2>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '6px', marginTop: '6px' }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="text-dark text-uppercase fw-bold" style={{ fontSize: '11px' }}>Total Income - Expense</div>
                                                    <div className="fw-bold fs-6 text-primary">-</div>
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
                                        {['today', 'yesterday', 'thisWeek', 'thisMonth', 'lastMonth', 'last7Days', 'last30Days', 'allTime'].map((preset) => (
                                            <button
                                                key={preset}
                                                type="button"
                                                className="preset-btn"
                                                onClick={() => handleOverallPresetSelect(preset)}
                                            >
                                                {preset === 'allTime' ? 'All Time' : preset.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
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
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="fw-bold mb-0 text-dark">Combined Breakdown</h6>
                                            <Dropdown autoClose="outside" align="end">
                                                <Dropdown.Toggle variant="outline-primary" size="sm" className="d-flex align-items-center gap-2 rounded-pill px-3 shadow-sm border-2 fw-semibold">
                                                    <FaColumns size={14} /> Customize Columns
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className="shadow-lg p-3 border-0 rounded-4" style={{ minWidth: '280px', zIndex: 1050 }}>
                                                    <div className="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                                                        <span className="fw-bold text-dark small">Display Columns</span>
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            className="p-0 text-decoration-none small text-primary fw-semibold"
                                                            onClick={() => {
                                                                const allTrue = overallColumnsConfig.reduce((acc, col) => ({ ...acc, [col.key]: true }), {});
                                                                setVisibleOverallColumns(allTrue);
                                                                localStorage.setItem('overallReport_visibleColumns', JSON.stringify(allTrue));
                                                            }}
                                                        >
                                                            Select All
                                                        </Button>
                                                    </div>
                                                    <div className="d-flex flex-column gap-1" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                        {overallColumnsConfig.map(col => (
                                                            <label
                                                                key={col.key}
                                                                htmlFor={`col-toggle-${col.key}`}
                                                                className="d-flex align-items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover-bg-light m-0"
                                                                style={{ userSelect: 'none' }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input mt-0 flex-shrink-0 cursor-pointer"
                                                                    id={`col-toggle-${col.key}`}
                                                                    checked={isColVisible(col.key)}
                                                                    onChange={() => toggleOverallColumn(col.key)}
                                                                />
                                                                <span className="small text-dark fw-medium" style={{ fontSize: '13px' }}>
                                                                    {col.label}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        <div className="table-responsive rounded-3 shadow-sm" style={{ maxHeight: "450px", overflowY: "auto" }}>
                                            <Table hover striped bordered className="align-middle text-center mb-0 custom-reports-table">
                                                <thead className="table-dark sticky-top">
                                                    <tr>
                                                        {isColVisible('sl') && <th>SL</th>}
                                                        <th className="text-start">Date</th>
                                                        {isColVisible('paymentAmount') && <th>Payment Amount (৳)</th>}
                                                        {isColVisible('paymentCount') && <th>Payment Count</th>}
                                                        {isColVisible('premiumFeeAmount') && <th className="text-info">Premium Teacher Fee (৳)</th>}
                                                        {isColVisible('premiumFeeCount') && <th className="text-info">Fee Count</th>}
                                                        {isColVisible('serviceChargeAmount') && <th className="text-info">Service Charge (৳)</th>}
                                                        {isColVisible('serviceChargeCount') && <th className="text-info">Charge Count</th>}
                                                        {isColVisible('totalIncome') && <th className="text-success">Total Income (৳)</th>}
                                                        {isColVisible('refundAmount') && <th className="text-danger">Refund Amount (৳)</th>}
                                                        {isColVisible('refundCount') && <th className="text-danger">Refund Count</th>}
                                                        {isColVisible('expenseAmount') && <th className="text-warning">Expense Amount (৳)</th>}
                                                        <th className="text-primary">Balance (৳)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {overallReportData.data && overallReportData.data.length > 0 ? (
                                                        overallReportData.data.map((row, idx) => (
                                                            <tr key={idx}>
                                                                {isColVisible('sl') && <td className="fw-bold text-dark">{idx + 1}</td>}
                                                                <td className="text-start fw-bold">
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <a href="#" className="text-decoration-none text-primary" onClick={(e) => { e.preventDefault(); handleDateClick(row.date, 'payment'); }}>
                                                                            {new Date(row.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                                {isColVisible('paymentAmount') && <td className="fw-semibold text-success">৳ {row.paymentAmount.toLocaleString()}</td>}
                                                                {isColVisible('paymentCount') && <td className="fw-semibold text-success">{row.paymentCount.toLocaleString()}</td>}
                                                                {isColVisible('premiumFeeAmount') && <td className="fw-semibold text-info">৳ {row.premiumFeeAmount?.toLocaleString() || 0}</td>}
                                                                {isColVisible('premiumFeeCount') && <td className="fw-semibold text-info">{row.premiumFeeCount?.toLocaleString() || 0}</td>}
                                                                {isColVisible('serviceChargeAmount') && <td className="fw-semibold text-info">৳ {row.serviceChargeAmount?.toLocaleString() || 0}</td>}
                                                                {isColVisible('serviceChargeCount') && <td className="fw-semibold text-info">{row.serviceChargeCount?.toLocaleString() || 0}</td>}
                                                                {isColVisible('totalIncome') && <td className="fw-semibold text-success fw-bold">৳ {((row.paymentAmount || 0) + (row.premiumFeeAmount || 0) + (row.serviceChargeAmount || 0)).toLocaleString()}</td>}
                                                                {isColVisible('refundAmount') && <td className="fw-semibold text-danger">৳ {row.refundAmount?.toLocaleString() || 0}</td>}
                                                                {isColVisible('refundCount') && <td className="fw-semibold text-danger">{row.refundCount?.toLocaleString() || 0}</td>}
                                                                {isColVisible('expenseAmount') && <td className="fw-semibold text-warning">৳ {row.expenseAmount?.toLocaleString() || 0}</td>}
                                                                <td className="fw-semibold text-primary">৳ {(((row.paymentAmount || 0) + (row.premiumFeeAmount || 0) + (row.serviceChargeAmount || 0)) - (row.expenseAmount || 0)).toLocaleString()}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={(overallColumnsConfig.filter(col => isColVisible(col.key)).length + 2) || 2} className="py-4 text-muted fw-bold">No combined data found for the selected period.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )}
                        </Tab.Pane>
                        <Tab.Pane eventKey="marketing">
                            <Card className="shadow-sm border-0 mb-3 rounded-4 filter-card">
                                <Card.Body className="p-2 px-3">
                                    <h6 className="fw-bold mb-2 d-flex align-items-center gap-2 text-dark">
                                        <FaFilter className="text-primary" /> Marketing Filters
                                    </h6>
                                    <Row className="g-2">
                                        <Col md={2}>
                                            <Form.Label className="fw-semibold text-secondary small mb-1">Start Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={marketingFilters.startDate}
                                                onChange={(e) => setMarketingFilters({ ...marketingFilters, startDate: e.target.value, month: '' })}
                                                className="rounded-3 shadow-none border-primary"
                                                size="sm"
                                            />
                                        </Col>
                                        <Col md={2}>
                                            <Form.Label className="fw-semibold text-secondary small mb-1">End Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={marketingFilters.endDate}
                                                onChange={(e) => setMarketingFilters({ ...marketingFilters, endDate: e.target.value, month: '' })}
                                                className="rounded-3 shadow-none border-primary"
                                                size="sm"
                                            />
                                        </Col>
                                        <Col md={2}>
                                            <Form.Label className="fw-semibold text-secondary small mb-1">By Month</Form.Label>
                                            <Form.Control
                                                type="month"
                                                value={marketingFilters.month || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val) {
                                                        const [year, month] = val.split('-');
                                                        const startDate = `${year}-${month}-01`;
                                                        const endDate = new Date(year, month, 0).toISOString().split('T')[0];
                                                        setMarketingFilters({ ...marketingFilters, month: val, startDate, endDate });
                                                    } else {
                                                        setMarketingFilters({ ...marketingFilters, month: '' });
                                                    }
                                                }}
                                                className="rounded-3 shadow-none border-primary"
                                                size="sm"
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <Form.Label className="fw-semibold text-secondary small mb-1">Marketing Medium</Form.Label>
                                            <Form.Select
                                                value={marketingFilters.medium}
                                                onChange={(e) => setMarketingFilters({ ...marketingFilters, medium: e.target.value })}
                                                className="rounded-3 shadow-none border-primary"
                                                size="sm"
                                            >
                                                <option value="">All Mediums</option>
                                                {marketingMediums.map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                        <Col md={3} className="d-flex align-items-end gap-2">
                                            <Button variant="success" className="w-100 rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ height: '31px' }} onClick={() => setAppliedMarketingFilters(marketingFilters)} title="Search">
                                                <FaSearch className="me-1" /> Search
                                            </Button>
                                            <Button variant="danger" className="w-100 rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ height: '31px' }} onClick={() => {
                                                const resetFilters = { startDate: initialTodayStr, endDate: initialTodayStr, medium: '', month: '' };
                                                setMarketingFilters(resetFilters);
                                                setAppliedMarketingFilters(resetFilters);
                                            }} title="Reset">
                                                <FaUndo />
                                            </Button>
                                        </Col>
                                    </Row>
                                    <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                                        <span className="text-secondary fw-semibold small d-flex align-items-center gap-1" style={{ fontSize: '11.5px' }}>
                                            <FaCalendarAlt className="text-primary" /> Quick Ranges:
                                        </span>
                                        {['today', 'yesterday', 'thisWeek', 'thisMonth', 'lastMonth', 'last7Days', 'last30Days', 'allTime'].map((preset) => (
                                            <button
                                                key={preset}
                                                type="button"
                                                className="preset-btn"
                                                onClick={() => handleMarketingPresetSelect(preset)}
                                            >
                                                {preset === 'allTime' ? 'All Time' : preset.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </button>
                                        ))}
                                    </div>
                                </Card.Body>
                            </Card>

                            {marketingLoading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-2 text-muted">Loading marketing data...</p>
                                </div>
                            ) : (
                                <>
                                    {(() => {
                                        const allMediumsSet = new Set(marketingMediums.map(m => (m || '').toLowerCase()));
                                        const extraMediums = (marketingReportData?.summary || []).filter(s => !allMediumsSet.has((s.medium || 'unknown').toLowerCase()));
                                        let combinedMediums = [
                                            ...marketingMediums.map(med => {
                                                const found = (marketingReportData?.summary || []).find(s => (s.medium || 'unknown').toLowerCase() === (med || '').toLowerCase());
                                                return found || { medium: med, count: 0, revenue: 0, totalRevenue: 0, cancelled: 0, suspended: 0, expense: 0 };
                                            }),
                                            ...extraMediums
                                        ];

                                        if (appliedMarketingFilters.medium) {
                                            combinedMediums = combinedMediums.filter(m => (m.medium || '').toLowerCase() === appliedMarketingFilters.medium.toLowerCase());
                                        }

                                        combinedMediums.sort((a, b) => (b.count || 0) - (a.count || 0));

                                        const totalAcquired = combinedMediums.reduce((acc, curr) => acc + (curr.count || 0), 0);
                                        const totalRevenue = combinedMediums.reduce((acc, curr) => acc + (curr.revenue || curr.totalRevenue || 0), 0);
                                        const totalCancelled = combinedMediums.reduce((acc, curr) => acc + (curr.cancelled || 0), 0);
                                        const totalSuspended = combinedMediums.reduce((acc, curr) => acc + (curr.suspended || 0), 0);
                                        const totalExpense = combinedMediums.reduce((acc, curr) => acc + (curr.expense || 0), 0);

                                        return (
                                            <>
                                                <Row className="g-3 mb-4">
                                                    <Col>
                                                        <PremiumStatsCard className="shadow-sm bg-white border border-primary p-2 px-3 rounded-4 h-100" style={{ borderWidth: '2px !important' }}>
                                                            <Card.Body className="p-0">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <div className="icon-wrapper bg-primary bg-opacity-10 text-primary rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                                        <FaBookOpen size={24} />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Total Tuition Got</span>
                                                                        <h2 className="fw-extrabold text-primary mb-0 mt-1" style={{ fontSize: '1.75rem' }}>{totalAcquired}</h2>
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                        </PremiumStatsCard>
                                                    </Col>
                                                    <Col>
                                                        <PremiumStatsCard className="shadow-sm bg-white border border-success p-2 px-3 rounded-4 h-100" style={{ borderWidth: '2px !important' }}>
                                                            <Card.Body className="p-0">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <div className="icon-wrapper bg-success bg-opacity-10 text-success rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                                        <FaWallet size={24} />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Total Revenue</span>
                                                                        <h2 className="fw-extrabold text-success mb-0 mt-1" style={{ fontSize: '1.75rem' }}>৳ {totalRevenue.toLocaleString()}</h2>
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                        </PremiumStatsCard>
                                                    </Col>
                                                    <Col>
                                                        <PremiumStatsCard className="shadow-sm bg-white border border-info p-2 px-3 rounded-4 h-100" style={{ borderWidth: '2px !important' }}>
                                                            <Card.Body className="p-0">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <div className="icon-wrapper bg-info bg-opacity-10 text-info rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                                        <FaMinus size={24} />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Total Expense</span>
                                                                        <h2 className="fw-extrabold text-info mb-0 mt-1" style={{ fontSize: '1.75rem' }}>৳ {totalExpense.toLocaleString()}</h2>
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                        </PremiumStatsCard>
                                                    </Col>
                                                    <Col>
                                                        <PremiumStatsCard className="shadow-sm bg-white border border-danger p-2 px-3 rounded-4 h-100" style={{ borderWidth: '2px !important' }}>
                                                            <Card.Body className="p-0">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <div className="icon-wrapper bg-danger bg-opacity-10 text-danger rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                                        <FaMinus size={24} />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Total Cancelled</span>
                                                                        <h2 className="fw-extrabold text-danger mb-0 mt-1" style={{ fontSize: '1.75rem' }}>{totalCancelled}</h2>
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                        </PremiumStatsCard>
                                                    </Col>
                                                    <Col>
                                                        <PremiumStatsCard className="shadow-sm bg-white border border-warning p-2 px-3 rounded-4 h-100" style={{ borderWidth: '2px !important' }}>
                                                            <Card.Body className="p-0">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <div className="icon-wrapper bg-warning bg-opacity-10 text-warning rounded-3 p-2 d-flex align-items-center justify-content-center">
                                                                        <FaTag size={24} />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-dark text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.85rem' }}>Total Suspended</span>
                                                                        <h2 className="fw-extrabold text-warning mb-0 mt-1" style={{ fontSize: '1.75rem' }}>{totalSuspended}</h2>
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                        </PremiumStatsCard>
                                                    </Col>
                                                </Row>
                                                
                                                <Card className="shadow-sm border-0 rounded-4 mb-3 list-card">
                                                    <Card.Body className="p-4">
                                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                                            <div>
                                                                <Card.Title className="fw-extrabold text-dark mb-0" style={{ fontSize: '1.25rem' }}>Acquisition Summary</Card.Title>
                                                                <small className="text-muted">Currently displaying {combinedMediums.length} mediums</small>
                                                            </div>
                                                        </div>
                                                        <div className="table-responsive rounded-3 shadow-sm" style={{ maxHeight: "550px", overflowY: "auto" }}>
                                                            <Table hover striped bordered className="align-middle text-center mb-0 custom-reports-table">
                                                                <thead className="table-dark sticky-top">
                                                                    <tr>
                                                                        <th style={{ width: '60px' }}>SL</th>
                                                                        <th>MARKETING MEDIUM</th>
                                                                        <th>TUITION GOT</th>
                                                                        <th>REVENUE</th>
                                                                        <th>EXPENSE</th>
                                                                        <th>PROFIT/LOSS</th>
                                                                        <th>CANCELLED</th>
                                                                        <th>SUSPENDED</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {combinedMediums.length === 0 ? (
                                                                        <tr>
                                                                            <td colSpan={8} className="text-center py-4 text-muted">No data found for the selected period</td>
                                                                        </tr>
                                                                    ) : (
                                                                        <>
                                                                            {combinedMediums.map((item, index) => (
                                                                                <tr 
                                                                                    key={item.medium || 'unknown'}
                                                                                    className="hover-bg-light transition-all"
                                                                                >
                                                                                    <td className="fw-bold text-muted">{index + 1}</td>
                                                                                    <td className="px-4 fw-semibold text-dark">{(item.medium || 'Unknown').toUpperCase()}</td>
                                                                                    <td className="fw-bold text-dark">{item.count || 0}</td>
                                                                                    <td className="text-success small fw-semibold">৳ {(item.revenue || item.totalRevenue || 0).toLocaleString()}</td>
                                                                                    <td className="text-info small fw-semibold">৳ {(item.expense || 0).toLocaleString()}</td>
                                                                                    <td className={`small fw-bold ${((item.revenue || item.totalRevenue || 0) - (item.expense || 0)) >= 0 ? 'text-success' : 'text-danger'}`}>
                                                                                        ৳ {((item.revenue || item.totalRevenue || 0) - (item.expense || 0)).toLocaleString()}
                                                                                    </td>
                                                                                    <td className="text-danger small fw-semibold">{item.cancelled || 0}</td>
                                                                                    <td className="text-warning small fw-semibold">{item.suspended || 0}</td>
                                                                                </tr>
                                                                            ))}
                                                                            <tr className="bg-light border-top border-2">
                                                                                <td colSpan={2} className="px-4 fw-bold text-primary text-end">TOTAL</td>
                                                                                <td className="fw-extrabold text-primary">
                                                                                    {combinedMediums.reduce((acc, curr) => acc + (curr.count || 0), 0)}
                                                                                </td>
                                                                                <td className="text-success small fw-bold">
                                                                                    ৳ {combinedMediums.reduce((acc, curr) => acc + (curr.revenue || curr.totalRevenue || 0), 0).toLocaleString()}
                                                                                </td>
                                                                                <td className="text-info small fw-bold">
                                                                                    ৳ {combinedMediums.reduce((acc, curr) => acc + (curr.expense || 0), 0).toLocaleString()}
                                                                                </td>
                                                                                <td className={`small fw-extrabold ${combinedMediums.reduce((acc, curr) => acc + (curr.revenue || curr.totalRevenue || 0) - (curr.expense || 0), 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                                                                                    ৳ {combinedMediums.reduce((acc, curr) => acc + (curr.revenue || curr.totalRevenue || 0) - (curr.expense || 0), 0).toLocaleString()}
                                                                                </td>
                                                                                <td className="text-danger small fw-bold">
                                                                                    {combinedMediums.reduce((acc, curr) => acc + (curr.cancelled || 0), 0)}
                                                                                </td>
                                                                                <td className="text-warning small fw-bold">
                                                                                    {combinedMediums.reduce((acc, curr) => acc + (curr.suspended || 0), 0)}
                                                                                </td>
                                                                            </tr>
                                                                        </>
                                                                    )}
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </>
                                        );
                                    })()}
                                </>
                            )}
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>

                {/* Details Modal */}
                <style>{`
                    .custom-huge-modal {
                        width: 95vw !important;
                        max-width: 95vw !important;
                    }
                    .custom-huge-modal .modal-content {
                        height: 90vh;
                        max-height: 90vh;
                    }
                `}</style>
                <Modal 
                    show={showDetailsModal} 
                    onHide={() => setShowDetailsModal(false)} 
                    size={detailsType === 'all' ? undefined : 'lg'}
                    dialogClassName={detailsType === 'all' ? 'custom-huge-modal' : ''}
                    centered
                >
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title className="fw-bold text-primary">
                            Details for {selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : ''}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0">
                        {activeTab === 'overall' && detailsType !== 'all' && (
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
                                    <Nav.Item>
                                        <Nav.Link active={detailsType === 'expense'} onClick={() => handleDetailsTypeChange('expense')} className="px-4 py-2 fw-semibold text-warning">
                                            Expenses
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                        )}
                        
                        <div className="p-4 pt-3 bg-white">
                            {detailsLoading ? (
                                <div className="d-flex justify-content-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : detailsType === 'all' ? (
                                detailsAllData ? (
                                    <Row className="g-4">
                                        <Col lg={3}>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6 className="fw-bold text-success mb-0 d-flex align-items-center gap-2">
                                                    <FaChartPie /> Payments
                                                </h6>
                                                <span className="badge bg-success bg-opacity-10 text-success fw-bold fs-6">৳ {detailsAllData.payments.totalAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="table-responsive border rounded-3 shadow-sm" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                                                <Table hover className="mb-0 text-center align-middle" size="sm">
                                                    <thead className="table-light sticky-top shadow-sm">
                                                        <tr>
                                                            <th>SL</th>
                                                            <th>Code</th>
                                                            <th>Route</th>
                                                            <th>Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {detailsAllData.payments.data.length > 0 ? detailsAllData.payments.data.map((item, idx) => (
                                                            <tr key={item._id}>
                                                                <td className="fw-bold text-muted">{idx + 1}</td>
                                                                <td className="fw-bold">{item.tuitionCode}</td>
                                                                <td><Badge bg="info" className="px-2">{item.route}</Badge></td>
                                                                <td className="text-success fw-bold">৳ {item.amount.toLocaleString()}</td>
                                                            </tr>
                                                        )) : <tr><td colSpan="4" className="text-muted py-4 fw-bold">No payments</td></tr>}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Col>
                                        <Col lg={3}>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6 className="fw-bold text-danger mb-0 d-flex align-items-center gap-2">
                                                    <FaUndo /> Refunds
                                                </h6>
                                                <span className="badge bg-danger bg-opacity-10 text-danger fw-bold fs-6">৳ {detailsAllData.refunds.totalAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="table-responsive border rounded-3 shadow-sm" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                                                <Table hover className="mb-0 text-center align-middle" size="sm">
                                                    <thead className="table-light sticky-top shadow-sm">
                                                        <tr>
                                                            <th>SL</th>
                                                            <th>Code</th>
                                                            <th>Route</th>
                                                            <th>Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {detailsAllData.refunds.data.length > 0 ? detailsAllData.refunds.data.map((item, idx) => (
                                                            <tr key={item._id}>
                                                                <td className="fw-bold text-muted">{idx + 1}</td>
                                                                <td className="fw-bold">{item.tuitionCode}</td>
                                                                <td><Badge bg="danger" className="px-2">{item.route}</Badge></td>
                                                                <td className="text-danger fw-bold">৳ {item.amount.toLocaleString()}</td>
                                                            </tr>
                                                        )) : <tr><td colSpan="4" className="text-muted py-4 fw-bold">No refunds</td></tr>}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Col>
                                        <Col lg={3}>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6 className="fw-bold text-warning mb-0 d-flex align-items-center gap-2">
                                                    <FaMinus /> Expenses
                                                </h6>
                                                <span className="badge bg-warning bg-opacity-10 text-warning fw-bold fs-6">৳ {detailsAllData.expenses.totalAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="table-responsive border rounded-3 shadow-sm" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                                                <Table hover className="mb-0 text-center align-middle" size="sm">
                                                    <thead className="table-light sticky-top shadow-sm">
                                                        <tr>
                                                            <th>SL</th>
                                                            <th>Category</th>
                                                            <th>Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {detailsAllData.expenses.data.length > 0 ? detailsAllData.expenses.data.map((item, idx) => (
                                                            <tr key={item._id}>
                                                                <td className="fw-bold text-muted">{idx + 1}</td>
                                                                <td className="fw-bold">{item.tuitionCode}</td>
                                                                <td className="text-warning fw-bold">৳ {item.amount.toLocaleString()}</td>
                                                            </tr>
                                                        )) : <tr><td colSpan="3" className="text-muted py-4 fw-bold">No expenses</td></tr>}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Col>
                                        {detailsAllData.premiumFees && (
                                            <Col lg={3}>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <h6 className="fw-bold text-info mb-0 d-flex align-items-center gap-2">
                                                        <FaWallet /> Premium Teacher Fee
                                                    </h6>
                                                    <span className="badge bg-info bg-opacity-10 text-info fw-bold fs-6">৳ {detailsAllData.premiumFees.totalAmount.toLocaleString()}</span>
                                                </div>
                                                <div className="table-responsive border rounded-3 shadow-sm" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                                                    <Table hover className="mb-0 text-center align-middle" size="sm">
                                                        <thead className="table-light sticky-top shadow-sm">
                                                            <tr>
                                                                <th>SL</th>
                                                                <th>Name</th>
                                                                <th>Code</th>
                                                                <th>Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {detailsAllData.premiumFees.data.length > 0 ? detailsAllData.premiumFees.data.map((item, idx) => (
                                                                <tr key={item._id}>
                                                                    <td className="fw-bold text-muted">{idx + 1}</td>
                                                                    <td className="fw-bold" style={{ fontSize: '12px' }}>{item.name}</td>
                                                                    <td className="text-muted font-monospace" style={{ fontSize: '11px' }}>{item.premiumCode}</td>
                                                                    <td className={`fw-bold ${item.isNumeric ? 'text-info' : 'text-danger'}`}>
                                                                        {item.isNumeric ? `৳ ${item.amount.toLocaleString()}` : <span title="Non-numeric amount">{item.amountRaw}</span>}
                                                                    </td>
                                                                </tr>
                                                            )) : <tr><td colSpan="4" className="text-muted py-4 fw-bold">No premium teacher fees</td></tr>}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Col>
                                        )}
                                    </Row>
                                ) : (
                                    <div className="text-center py-5 text-muted fw-bold">No records found for this date.</div>
                                )
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
                                                    {detailsType === 'expense' ? <th>Category</th> : <th>Tuition Code</th>}
                                                    {detailsType === 'payment' && <th>Tutor Number</th>}
                                                    {detailsType !== 'expense' && <th>Route</th>}
                                                    <th>{detailsType === 'payment' ? 'Received Amount (৳)' : detailsType === 'refund' ? 'Refund Amount (৳)' : 'Expense Amount (৳)'}</th>
                                                    <th>Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {detailsData.map((item, idx) => (
                                                    <tr key={item._id}>
                                                        <td className="fw-bold text-dark">{((detailsPage - 1) * 20) + idx + 1}</td>
                                                        <td className="fw-bold">{item.tuitionCode}</td>
                                                        {detailsType === 'payment' && <td className="text-muted">{item.tutorNumber}</td>}
                                                        {detailsType !== 'expense' && <td><Badge bg={item.route === 'Bkash' ? 'danger' : 'info'} className="px-2 py-1">{item.route}</Badge></td>}
                                                        <td className={`fw-bold ${detailsType === 'payment' ? 'text-success' : detailsType === 'refund' ? 'text-danger' : 'text-warning'}`}>
                                                            ৳ {item.amount.toLocaleString()}
                                                        </td>
                                                        <td className="text-muted small">
                                                            {new Date(item.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            {detailsData.length > 0 && (
                                                <tfoot className="table-light">
                                                    <tr>
                                                        <td colSpan={detailsType === 'payment' ? 4 : detailsType === 'expense' ? 2 : 3} className="text-end pe-4 fw-extrabold text-dark text-uppercase tracking-wider">
                                                            Total Amount
                                                        </td>
                                                        <td className={`fw-extrabold fs-6 ${detailsType === 'payment' ? 'text-success' : detailsType === 'refund' ? 'text-danger' : 'text-warning'}`}>
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
