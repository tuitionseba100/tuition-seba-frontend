import React, { useState, useEffect, useMemo, useRef } from 'react';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import { Button, Modal, Form, Row, Col, Table } from 'react-bootstrap';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import NavBarPage from './NavbarPage';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserClock, FaSignInAlt, FaSignOutAlt, FaCalendarAlt, FaSearch, FaTrash, FaEdit, FaSpinner, FaCheckCircle, FaChartPie, FaChartBar, FaPrint, FaFileInvoiceDollar, FaHistory, FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import { checkDayStarted } from '../utilities/checkDayStarted';

// --- Styled Components ---

const PageContainer = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 2rem;
  font-family: 'Poppins', sans-serif;
`;

const ContentWrapper = styled(motion.div)`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  
  h2 {
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  .icon-box {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    
    &.blue { background: #e3f2fd; color: #1976d2; }
    &.green { background: #e8f5e9; color: #2e7d32; }
    &.orange { background: #fff3e0; color: #ef6c00; }
    &.purple { background: #f3e5f5; color: #7b1fa2; }
    &.teal { background: #e0f2f1; color: #00897b; }
  }

  .content {
    h4 { margin: 0; font-weight: 700; color: #333; }
    p { margin: 0; font-size: 0.9rem; color: #666; }
  }
`;

const ControlsCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const StyledTable = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;

  h5 {
    padding: 1rem 1.5rem;
    margin: 0;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    font-weight: 600;
    color: #495057;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    
    thead {
      background: #f8f9fa;
      th {
        padding: 1rem;
        font-weight: 600;
        color: #495057;
        border-bottom: 2px solid #e9ecef;
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid #e9ecef;
        transition: background 0.2s;
        
        &:hover {
          background: #f1f3f5;
        }

        td {
          padding: 1rem;
          color: #333;
          vertical-align: middle;
        }
      }
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  
  .page-info {
    color: #6c757d;
  }

  .pagination-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .spinner {
    font-size: 3rem;
    color: #4caf50;
    margin-bottom: 1rem;
    animation: spin 1s linear infinite;
  }
  
  h3 {
    color: #2c3e50;
    font-weight: 600;
  }

  @keyframes spin { 100% { transform: rotate(360deg); } }
`;

const DatePickerWrapper = styled.div`
  width: 100%;
  
  .react-datetime-picker {
    width: 100%;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    padding: 0.375rem 0.75rem;
    background-color: #fff;
  }
  
  .react-datetime-picker__wrapper {
    border: none;
  }
  
  .react-calendar {
    border: none;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    border-radius: 8px;
    font-family: inherit;
  }
`;

const TimeDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  .time {
    font-size: 1.1rem;
    font-weight: 700;
    color: #2c3e50;
  }
  
  .date {
    font-size: 0.8rem;
    color: #6c757d;
  }
`;

// --- Main Component ---

const AttendancePage = () => {
    // State
    const [attendance, setAttendance] = useState([]);
    const [filter, setFilter] = useState('today');
    const [users, setUsers] = useState([]);
    const [userFilter, setUserFilter] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [summaryData, setSummaryData] = useState([]);
    const [summaryFilter, setSummaryFilter] = useState('runningMonth');
    const [summaryUserFilter, setSummaryUserFilter] = useState(null);
    const [summarySearchTerm, setSummarySearchTerm] = useState('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [printTargetUser, setPrintTargetUser] = useState(null);
    const [showSalaryHistoryModal, setShowSalaryHistoryModal] = useState(false);
    const [salaryHistoryTargetUser, setSalaryHistoryTargetUser] = useState(null);
    const [salaryHistoryData, setSalaryHistoryData] = useState([]);
    const [isSalaryHistoryLoading, setIsSalaryHistoryLoading] = useState(false);
    const [logoBase64, setLogoBase64] = useState('');
    const [signatureBase64, setSignatureBase64] = useState('');
    const printReportRef = useRef(null);
    const [editingAttendance, setEditingAttendance] = useState(null);
    const [editStartTime, setEditStartTime] = useState(new Date());
    const [editEndTime, setEditEndTime] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isDayStarted, setIsDayStarted] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        const getBase64Image = async (url) => {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch {
                return '';
            }
        };

        getBase64Image('/img/TUITION SEBA FORUM TF.png').then(data => {
            if (data) setLogoBase64(data);
            else getBase64Image('/img/TSF LOGO TRANSPARENT.png').then(d2 => {
                if (d2) setLogoBase64(d2);
                else getBase64Image('/logo512.png').then(setLogoBase64);
            });
        });

        getBase64Image('/signature.png').then(setSignatureBase64);
    }, []);

    useEffect(() => {
        if (userRole === 'superadmin') {
            fetchUsers();
        }
    }, []);

    useEffect(() => {
        fetchAttendance(filter, userFilter);
    }, [filter, userFilter]);

    const fetchAttendance = async (currentFilter = filter, currentUserFilter = userFilter) => {
        setIsLoadingData(true);
        try {
            const params = {
                filter: currentFilter || 'today',
            };
            if (currentUserFilter?.value) {
                params.userFilter = currentUserFilter.value;
            }

            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/attendance', {
                params,
                headers: { Authorization: token },
            });
            
            const rawData = Array.isArray(response.data) ? response.data : [];
            
            // Pre-process & cache date properties ONCE for high-speed rendering
            const currentUsername = localStorage.getItem('username');
            let hasActive = false;

            const processed = rawData.map(entry => {
                const sDate = new Date(entry.startTime);
                const sTimeMs = sDate.getTime();
                const sDateStr = sDate.toDateString();
                const eDate = entry.endTime ? new Date(entry.endTime) : null;
                const eTimeMs = eDate ? eDate.getTime() : null;

                if (!entry.endTime && (userRole !== 'superadmin' || entry.userName === currentUsername)) {
                    hasActive = true;
                }

                return {
                    ...entry,
                    startTimeMs: sTimeMs,
                    endTimeMs: eTimeMs,
                    startDateStr: sDateStr,
                    startYear: sDate.getFullYear(),
                    startMonth: sDate.getMonth(),
                    formattedStartTime: sDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    formattedStartDate: sDate.toLocaleDateString('en-GB'),
                    formattedEndTime: eDate ? eDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
                    formattedEndDate: eDate ? eDate.toLocaleDateString('en-GB') : null,
                };
            });

            setAttendance(processed);
            setIsDayStarted(hasActive);
        } catch (error) {
            toast.error('Error fetching attendance');
        } finally {
            setIsLoadingData(false);
        }
    };

    const fetchSummary = async (sFilter, sUserFilter) => {
        const activeFilter = (typeof sFilter === 'string' ? sFilter : summaryFilter) || 'runningMonth';
        const activeUserFilter = (sUserFilter && sUserFilter.value !== undefined) ? sUserFilter : (sUserFilter === null ? null : summaryUserFilter);
        
        setIsSummaryLoading(true);
        setShowSummaryModal(true);
        try {
            const params = {
                filter: activeFilter,
            };
            if (activeUserFilter?.value) {
                params.userFilter = activeUserFilter.value;
            }

            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/attendance/summary', {
                params,
                headers: { Authorization: token },
            });
            setSummaryData(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            toast.error('Error fetching employee summary');
            setSummaryData([]);
        } finally {
            setIsSummaryLoading(false);
        }
    };

    const filteredSummaryData = useMemo(() => {
        if (!summaryData.length) return [];
        if (!summarySearchTerm.trim()) return summaryData;
        const lower = summarySearchTerm.toLowerCase();
        return summaryData.filter(user =>
            user.name?.toLowerCase().includes(lower) ||
            user.userName?.toLowerCase().includes(lower)
        );
    }, [summaryData, summarySearchTerm]);

    const resetSummaryFilters = () => {
        setSummaryFilter('runningMonth');
        setSummaryUserFilter(null);
        setSummarySearchTerm('');
        fetchSummary('runningMonth', null);
    };

    const openSalaryHistory = async (user) => {
        setSalaryHistoryTargetUser(user);
        setShowSalaryHistoryModal(true);
        setIsSalaryHistoryLoading(true);
        try {
            const response = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/expense/salary-history/${user.userName}`, {
                headers: { Authorization: token },
            });
            setSalaryHistoryData(response.data?.history || []);
        } catch (error) {
            toast.error('Error fetching salary payment history');
            setSalaryHistoryData([]);
        } finally {
            setIsSalaryHistoryLoading(false);
        }
    };

    const handlePrintStatement = () => {
        if (!printReportRef.current) {
            window.print();
            return;
        }
        const reportHtml = printReportRef.current.outerHTML;
        const printWindow = window.open('', '_blank', 'width=920,height=900');
        if (!printWindow) {
            window.print();
            return;
        }
        const rawUser = printTargetUser?.userName || 'Employee';
        const cleanUser = rawUser.trim().replace(/\s+/g, '_');
        const todayStr = new Date().toISOString().slice(0, 10);
        const docTitle = `Salary_Statement_${cleanUser}_${todayStr}`;

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${docTitle}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 0;
              color: #0f172a;
              background: #ffffff;
              font-size: 11px;
              line-height: 1.5;
              -webkit-font-smoothing: antialiased;
            }
            .statement-wrapper {
              width: 100%;
              max-width: 185mm;
              margin: 0 auto;
              position: relative;
              background: #ffffff;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
          </style>
        </head>
        <body>
          <div class="statement-wrapper">
            ${reportHtml}
          </div>
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.focus();

        const runPrint = () => {
            printWindow.print();
            printWindow.close();
        };

        let checkInterval = setInterval(() => {
            if (printWindow.document.readyState === 'complete') {
                clearInterval(checkInterval);
                setTimeout(runPrint, 250);
            }
        }, 50);

        setTimeout(() => {
            clearInterval(checkInterval);
            runPrint();
        }, 2500);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/user/users', {
                headers: { Authorization: token },
            });
            setUsers(response.data);
        } catch (error) {
            toast.error('Error fetching users');
        }
    };

    const filteredAttendance = useMemo(() => {
        if (!attendance.length) return [];

        if (!searchTerm.trim()) {
            return attendance;
        }

        const lowerSearch = searchTerm.toLowerCase();
        return attendance.filter(entry =>
            entry.userName?.toLowerCase().includes(lowerSearch) ||
            entry.name?.toLowerCase().includes(lowerSearch)
        );
    }, [attendance, searchTerm]);

    // Statistics Calculation (Single fast loop on loaded records)
    const stats = useMemo(() => {
        const todayStr = new Date().toDateString();
        let totalPresentTodaySet = new Set();
        let activeSessionsCount = 0;
        let totalHoursFiltered = 0;
        let completedSessionsCount = 0;

        for (let i = 0; i < filteredAttendance.length; i++) {
            const entry = filteredAttendance[i];
            if (entry.startDateStr === todayStr) {
                totalPresentTodaySet.add(entry.userId);
            }
            if (!entry.endTimeMs) {
                activeSessionsCount++;
            } else if (entry.startTimeMs) {
                totalHoursFiltered += (entry.endTimeMs - entry.startTimeMs) / 3600000;
                completedSessionsCount++;
            }
        }

        const avgHours = completedSessionsCount > 0
            ? (totalHoursFiltered / completedSessionsCount).toFixed(1)
            : '0.0';

        return {
            totalPresentToday: totalPresentTodaySet.size,
            activeSessions: activeSessionsCount,
            filteredCount: filteredAttendance.length,
            avgHoursFiltered: avgHours
        };
    }, [filteredAttendance]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
    const paginatedAttendance = useMemo(() => {
        return filteredAttendance.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredAttendance, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, userFilter, searchTerm]);

    const handleAction = async (actionType) => {
        setIsActionLoading(true);
        setLoadingMessage(actionType === 'start' ? 'Starting your day... Have a productive one!' : 'Ending your day... Great work today!');

        try {
            const url = actionType === 'start'
                ? 'https://tuition-seba-backend-1.onrender.com/api/attendance/start'
                : 'https://tuition-seba-backend-1.onrender.com/api/attendance/end';

            const method = actionType === 'start' ? axios.post : axios.put;

            const response = await method(url, {}, { headers: { Authorization: token } });

            // Wait a bit to show the nice message
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success(actionType === 'start' ? 'Day started successfully' : `Day ended. Duration: ${response.data.duration || 'Recorded'}`);
            fetchAttendance();

            // Update the day started state
            if (actionType === 'start') {
                setIsDayStarted(true);
            } else {
                setIsDayStarted(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || `Error ${actionType}ing day`);
        } finally {
            setIsActionLoading(false);
        }
    };

    const deleteAttendance = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/attendance/${id}`, {
                headers: { Authorization: token },
            });
            toast.success('Attendance record deleted');
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting record');
        }
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`https://tuition-seba-backend-1.onrender.com/api/attendance/edit/${editingAttendance._id}`, {
                startTime: editStartTime.toISOString(),
                endTime: editEndTime ? editEndTime.toISOString() : '',
            }, {
                headers: { Authorization: token },
            });

            toast.success('Attendance record updated successfully');
            setShowEditModal(false);
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating attendance');
        }
    };

    const openEditModal = (entry) => {
        setEditingAttendance(entry);
        setEditStartTime(new Date(entry.startTime));
        setEditEndTime(entry.endTime ? new Date(entry.endTime) : null);
        setShowEditModal(true);
    };

    const resetFilters = () => {
        setFilter('today');
        setUserFilter(null);
        setSearchTerm('');
    };

    const filterOptions = [
        { value: 'all', label: 'All Records' },
        { value: 'today', label: 'Today' },
        { value: 'last7days', label: 'Last 7 Days' },
        { value: 'runningMonth', label: 'Running Month' },
        { value: 'lastMonth', label: 'Last Month' },
        { value: 'january', label: 'January' },
        { value: 'february', label: 'February' },
        { value: 'march', label: 'March' },
        { value: 'april', label: 'April' },
        { value: 'may', label: 'May' },
        { value: 'june', label: 'June' },
        { value: 'july', label: 'July' },
        { value: 'august', label: 'August' },
        { value: 'september', label: 'September' },
        { value: 'october', label: 'October' },
        { value: 'november', label: 'November' },
        { value: 'december', label: 'December' }
    ];

    const userOptions = users.map(user => ({ value: user._id, label: user.name }));

    return (
        <PageContainer>
            <NavBarPage />

            <AnimatePresence>
                {isActionLoading && (
                    <LoadingOverlay
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <FaSpinner className="spinner" />
                        <motion.h3
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {loadingMessage}
                        </motion.h3>
                    </LoadingOverlay>
                )}
            </AnimatePresence>

            <ContentWrapper initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <HeaderSection>
                    <h2><FaUserClock style={{ color: '#4caf50' }} /> Attendance Dashboard</h2>
                    <div>
                        <Button
                            variant="outline-primary"
                            size="lg"
                            className="me-3 shadow-sm fw-semibold"
                            onClick={() => fetchSummary('runningMonth')}
                        >
                            <FaChartBar className="me-2" />
                            Employee Summary
                        </Button>
                        <Button
                            variant={isDayStarted ? "secondary" : "success"}
                            size="lg"
                            className="me-3 shadow-sm"
                            onClick={() => !isDayStarted && handleAction('start')}
                            disabled={isDayStarted}
                        >
                            <FaSignInAlt className="me-2" />
                            {isDayStarted ? (
                                <span>Day Already Started</span>
                            ) : (
                                <span>Start Day</span>
                            )}
                        </Button>
                        <Button
                            variant={isDayStarted ? "danger" : "secondary"}
                            size="lg"
                            className="shadow-sm"
                            onClick={() => isDayStarted && handleAction('end')}
                            disabled={!isDayStarted}
                        >
                            <FaSignOutAlt className="me-2" />
                            {isDayStarted ? (
                                <span>End Day</span>
                            ) : (
                                <span>Day Not Started Yet</span>
                            )}
                        </Button>
                    </div>
                </HeaderSection>

                <StatsGrid>
                    <StatCard>
                        <div className="icon-box green"><FaUserClock /></div>
                        <div className="content">
                            <h4>{stats.totalPresentToday}</h4>
                            <p>People Present Today</p>
                        </div>
                    </StatCard>
                    <StatCard>
                        <div className="icon-box blue"><FaSpinner /></div>
                        <div className="content">
                            <h4>{stats.activeSessions}</h4>
                            <p>Active Sessions Now</p>
                        </div>
                    </StatCard>
                    <StatCard>
                        <div className="icon-box purple"><FaCheckCircle /></div>
                        <div className="content">
                            <h4>{stats.filteredCount}</h4>
                            <p>Total Records (Filtered)</p>
                        </div>
                    </StatCard>
                    <StatCard>
                        <div className="icon-box orange"><FaChartPie /></div>
                        <div className="content">
                            <h4>{stats.avgHoursFiltered} hrs</h4>
                            <p>Avg Hours (Filtered)</p>
                        </div>
                    </StatCard>
                </StatsGrid>

                <ControlsCard>
                    <Row className="g-3">
                        <Col md={3}>
                            <Form.Label className="fw-bold text-muted small">FILTER BY DATE</Form.Label>
                            <Select
                                value={filterOptions.find(option => option.value === filter)}
                                onChange={(selectedOption) => setFilter(selectedOption.value)}
                                options={filterOptions}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label className="fw-bold text-muted small">SEARCH USER</Form.Label>
                            <div className="d-flex align-items-center bg-light rounded px-2 border">
                                <FaSearch className="text-secondary" />
                                <Form.Control
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-0 bg-transparent shadow-none"
                                />
                            </div>
                        </Col>
                        {userRole === 'superadmin' && (
                            <Col md={3}>
                                <Form.Label className="fw-bold text-muted small">FILTER BY USER</Form.Label>
                                <Select
                                    value={userFilter}
                                    onChange={setUserFilter}
                                    options={userOptions}
                                    isClearable
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </Col>
                        )}
                        <Col md={userRole === 'superadmin' ? 3 : 6} className="d-flex align-items-end justify-content-end">
                            <Button variant="outline-dark" onClick={resetFilters}>
                                Reset Filters
                            </Button>
                        </Col>
                    </Row>
                </ControlsCard>

                {/* Detailed Log moved above Summary */}
                <StyledTable>
                    <h5><FaCalendarAlt className="text-primary" /> Detailed Log</h5>
                    {isLoadingData && (
                        <div className="text-center py-4">
                            <FaSpinner className="spinner" />
                            <p className="mt-2 text-muted">Loading attendance data...</p>
                        </div>
                    )}
                    <table className="table mb-0">
                        <thead>
                            <tr>
                                <th>SL</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Duration</th>
                                {userRole === 'superadmin' && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoadingData && paginatedAttendance.length === 0 ? (
                                <tr>
                                    <td colSpan={userRole === 'superadmin' ? 10 : 9} className="text-center py-5 text-muted">
                                        <div className="d-flex flex-column align-items-center">
                                            <FaCalendarAlt size={40} className="mb-3 opacity-25" />
                                            <h5>No attendance records found</h5>
                                            <p className="mb-0">Try adjusting your filters or start a new day.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : !isLoadingData ? (
                                paginatedAttendance.map((entry, idx) => (
                                    <tr key={entry._id}>
                                        <td className="text-muted fw-bold">
                                            {((currentPage - 1) * itemsPerPage) + idx + 1}
                                        </td>
                                        <td className="fw-bold">{entry.name}</td>
                                        <td className="text-muted">{entry.userName}</td>
                                        <td>
                                            <TimeDisplay>
                                                <span className="time">
                                                    {entry.formattedStartTime || (entry.startTime ? new Date(entry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-')}
                                                </span>
                                                <span className="date">
                                                    {entry.formattedStartDate || (entry.startTime ? new Date(entry.startTime).toLocaleDateString('en-GB') : '-')}
                                                </span>
                                            </TimeDisplay>
                                        </td>
                                        <td>
                                            {entry.endTime ? (
                                                <TimeDisplay>
                                                    <span className="time">
                                                        {entry.formattedEndTime || new Date(entry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="date">
                                                        {entry.formattedEndDate || new Date(entry.endTime).toLocaleDateString('en-GB')}
                                                    </span>
                                                </TimeDisplay>
                                            ) : (
                                                <span className="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1">
                                                    Running...
                                                </span>
                                            )}
                                        </td>
                                        <td>{entry.duration || '-'}</td>
                                        {userRole === 'superadmin' && (
                                            <td>
                                                <Button variant="link" className="p-0 me-3 text-primary" onClick={() => openEditModal(entry)}>
                                                    <FaEdit size={18} />
                                                </Button>
                                                <Button variant="link" className="p-0 text-danger" onClick={() => deleteAttendance(entry._id)}>
                                                    <FaTrash size={16} />
                                                </Button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : null}
                        </tbody>
                    </table>
                </StyledTable>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <PaginationContainer>
                        <div className="page-info">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAttendance.length)} of {filteredAttendance.length} entries
                        </div>
                        <div className="pagination-buttons">
                            <Button
                                variant="outline-primary"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            >
                                Previous
                            </Button>
                            {(() => {
                                const pages = [];
                                const maxButtons = 5;
                                let start = Math.max(1, currentPage - 2);
                                let end = Math.min(totalPages, start + maxButtons - 1);
                                if (end - start < maxButtons - 1) {
                                    start = Math.max(1, end - maxButtons + 1);
                                }

                                if (start > 1) {
                                    pages.push(
                                        <Button key={1} variant={currentPage === 1 ? "primary" : "outline-primary"} onClick={() => setCurrentPage(1)}>1</Button>
                                    );
                                    if (start > 2) {
                                        pages.push(<span key="dots-start" className="px-2 py-1 text-muted align-self-center">...</span>);
                                    }
                                }

                                for (let i = start; i <= end; i++) {
                                    pages.push(
                                        <Button
                                            key={i}
                                            variant={currentPage === i ? "primary" : "outline-primary"}
                                            onClick={() => setCurrentPage(i)}
                                        >
                                            {i}
                                        </Button>
                                    );
                                }

                                if (end < totalPages) {
                                    if (end < totalPages - 1) {
                                        pages.push(<span key="dots-end" className="px-2 py-1 text-muted align-self-center">...</span>);
                                    }
                                    pages.push(
                                        <Button key={totalPages} variant={currentPage === totalPages ? "primary" : "outline-primary"} onClick={() => setCurrentPage(totalPages)}>{totalPages}</Button>
                                    );
                                }

                                return pages;
                            })()}
                            <Button
                                variant="outline-primary"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            >
                                Next
                            </Button>
                        </div>
                    </PaginationContainer>
                )}

                {/* End of ContentWrapper */}
            </ContentWrapper>

            {/* Employee Summary Modal */}
            <Modal show={showSummaryModal} onHide={() => setShowSummaryModal(false)} size="xl" dialogClassName="modal-extra-large" centered>
                <Modal.Header closeButton className="bg-light border-0">
                    <Modal.Title className="d-flex align-items-center gap-2 fw-bold text-primary">
                        <FaChartBar /> Employee Summary ({filteredSummaryData.length} Employees)
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    {/* Modal Filter Controls */}
                    <div className="p-3 bg-light border-bottom">
                        <Row className="g-2 align-items-end">
                            <Col md={userRole === 'superadmin' ? 3 : 4}>
                                <Form.Label className="fw-bold text-muted small mb-1">PERIOD / DATE</Form.Label>
                                <Select
                                    value={filterOptions.find(option => option.value === summaryFilter)}
                                    onChange={(selectedOption) => {
                                        const newFilter = selectedOption.value;
                                        setSummaryFilter(newFilter);
                                        fetchSummary(newFilter, summaryUserFilter);
                                    }}
                                    options={filterOptions}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </Col>
                            {userRole === 'superadmin' && (
                                <Col md={3}>
                                    <Form.Label className="fw-bold text-muted small mb-1">EMPLOYEE</Form.Label>
                                    <Select
                                        value={summaryUserFilter}
                                        onChange={(selectedOption) => {
                                            setSummaryUserFilter(selectedOption);
                                            fetchSummary(summaryFilter, selectedOption);
                                        }}
                                        options={userOptions}
                                        isClearable
                                        placeholder="All Employees"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                </Col>
                            )}
                            <Col md={userRole === 'superadmin' ? 4 : 5}>
                                <Form.Label className="fw-bold text-muted small mb-1">SEARCH</Form.Label>
                                <div className="d-flex align-items-center bg-white rounded px-2 border" style={{ height: '38px' }}>
                                    <FaSearch className="text-secondary me-2" />
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by name/username..."
                                        value={summarySearchTerm}
                                        onChange={(e) => setSummarySearchTerm(e.target.value)}
                                        className="border-0 bg-transparent shadow-none p-0"
                                    />
                                </div>
                            </Col>
                            <Col md={userRole === 'superadmin' ? 2 : 3} className="d-flex justify-content-end">
                                <Button
                                    variant="outline-secondary"
                                    className="w-100"
                                    style={{ height: '38px' }}
                                    onClick={resetSummaryFilters}
                                >
                                    Reset
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {isSummaryLoading ? (
                        <div className="text-center py-5">
                            <FaSpinner className="spinner text-primary" style={{ fontSize: '2rem' }} />
                            <p className="mt-2 text-muted">Calculating employee summary...</p>
                        </div>
                    ) : filteredSummaryData.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FaChartBar size={40} className="mb-3 opacity-25" />
                            <h5>No employee summaries available for the selected filter</h5>
                        </div>
                    ) : (
                        <div className="table-responsive" style={{ maxHeight: 'calc(82vh - 130px)', overflowY: 'auto' }}>
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light sticky-top" style={{ top: 0, zIndex: 1 }}>
                                    <tr>
                                        <th className="ps-3">SL</th>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Sessions</th>
                                        <th>Days</th>
                                        <th>Total Hours</th>
                                        <th>Avg/Day</th>
                                        <th className="text-end">Est. Salary</th>
                                        <th className="text-end">Paid (TK)</th>
                                        <th className="text-end">Due (TK)</th>
                                        <th className="text-center pe-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSummaryData.map((user, idx) => {
                                        const calculatedSalary = (user.perHourTk && user.perHourTk > 0)
                                            ? Math.round(user.perHourTk * parseFloat(user.totalHours || 0))
                                            : (user.runningMonthSalary || null);
                                        const paidVal = Number(user.paid || 0);
                                        const dueVal = calculatedSalary !== null ? Math.max(0, calculatedSalary - paidVal) : null;

                                        return (
                                            <tr key={idx}>
                                                <td className="ps-3 text-muted fw-bold">{idx + 1}</td>
                                                <td className="fw-bold text-dark">{user.name}</td>
                                                <td className="text-muted small">{user.userName}</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-1.5">
                                                        <span className="fw-bold">{user.totalSessions}</span>
                                                        {user.runningSessions > 0 && (
                                                            <span className="badge bg-success bg-opacity-10 text-success border border-success px-1.5 py-0.5" style={{ fontSize: '0.68rem' }}>
                                                                Active
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1 fw-bold">
                                                        {user.totalDaysPresent}d
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="fw-bold text-dark">
                                                        {parseFloat(user.totalHours).toFixed(1)} hrs
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${parseFloat(user.avgHoursPerDay) >= 8 ? 'bg-success' : parseFloat(user.avgHoursPerDay) >= 5 ? 'bg-warning text-dark' : 'bg-danger'} bg-opacity-100 text-white px-2 py-1`} style={{ fontSize: '0.72rem' }}>
                                                        {parseFloat(user.avgHoursPerDay).toFixed(1)}h
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    {calculatedSalary !== null && calculatedSalary !== undefined ? (
                                                        <div>
                                                            <span className="fw-bold text-success">
                                                                ৳{calculatedSalary.toLocaleString()}
                                                            </span>
                                                            {user.perHourTk > 0 && (
                                                                <div className="text-muted" style={{ fontSize: '0.68rem' }}>
                                                                    ৳{user.perHourTk}/hr
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">—</span>
                                                    )}
                                                </td>
                                                <td className="text-end">
                                                    {paidVal > 0 ? (
                                                        <span className="fw-bold text-primary">
                                                            ৳{paidVal.toLocaleString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted small">৳0</span>
                                                    )}
                                                </td>
                                                <td className="text-end">
                                                    {dueVal !== null ? (
                                                        <span className={`fw-bold ${dueVal > 0 ? 'text-danger' : 'text-success'}`}>
                                                            ৳{dueVal.toLocaleString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted">—</span>
                                                    )}
                                                </td>
                                                <td className="text-center pe-3">
                                                    <div className="d-flex align-items-center justify-content-center gap-1 flex-wrap">
                                                        <Button
                                                            variant="outline-success"
                                                            size="sm"
                                                            className="d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill shadow-none"
                                                            style={{ fontSize: '0.73rem', fontWeight: '600' }}
                                                            onClick={() => openSalaryHistory(user)}
                                                            title="View Salary History"
                                                        >
                                                            <FaHistory size={11} />
                                                            <span>Salary History</span>
                                                        </Button>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            className="d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill shadow-none"
                                                            style={{ fontSize: '0.73rem', fontWeight: '600' }}
                                                            onClick={() => {
                                                                setPrintTargetUser({
                                                                    ...user,
                                                                    calculatedSalary,
                                                                    paidVal,
                                                                    dueVal
                                                                });
                                                                setShowPrintModal(true);
                                                            }}
                                                            title="Print Statement Report"
                                                        >
                                                            <FaPrint size={11} />
                                                            <span>Statement</span>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 bg-light">
                    <Button variant="secondary" onClick={() => setShowSummaryModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Salary Payment History Modal */}
            <Modal show={showSalaryHistoryModal} onHide={() => setShowSalaryHistoryModal(false)} size="lg" centered>
                <Modal.Header closeButton className="border-0 bg-light pb-2">
                    <Modal.Title className="fs-5 d-flex align-items-center gap-2 text-success fw-bold">
                        <FaHistory /> Salary Payment History: {salaryHistoryTargetUser?.name || 'Employee'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3 p-md-4">
                    {salaryHistoryTargetUser && (
                        <div>
                            {/* Employee Header Quick Info */}
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-3 mb-3 bg-light rounded-3 border">
                                <div>
                                    <div className="fw-bold fs-6 text-dark">{salaryHistoryTargetUser.name}</div>
                                    <div className="text-muted small">Username: <span className="font-monospace fw-semibold">{salaryHistoryTargetUser.userName}</span></div>
                                    {salaryHistoryTargetUser.perHourTk > 0 && (
                                        <div className="text-muted small">Hourly Rate: <strong className="text-dark">৳{salaryHistoryTargetUser.perHourTk}/hr</strong></div>
                                    )}
                                </div>
                                <div className="text-sm-end">
                                    <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-1.5 rounded-pill fw-bold" style={{ fontSize: '0.85rem' }}>
                                        Total Paid: ৳{salaryHistoryData.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0).toLocaleString()}
                                    </span>
                                    <div className="text-muted small mt-1">{salaryHistoryData.length} Payment Voucher{salaryHistoryData.length !== 1 ? 's' : ''}</div>
                                </div>
                            </div>

                            {/* History Table */}
                            {isSalaryHistoryLoading ? (
                                <div className="text-center py-4">
                                    <FaSpinner className="spinner text-success" style={{ fontSize: '2rem' }} />
                                    <p className="mt-2 text-muted">Loading payment records...</p>
                                </div>
                            ) : salaryHistoryData.length === 0 ? (
                                <div className="text-center py-5 text-muted bg-white rounded border">
                                    <FaMoneyBillWave size={36} className="mb-2 opacity-25" />
                                    <h6 className="fw-bold">No salary payment records found</h6>
                                    <p className="small mb-0">No expense vouchers with category 'Salary' have been recorded for this employee yet.</p>
                                </div>
                            ) : (
                                <div className="table-responsive border rounded-3 overflow-hidden">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-3" style={{ width: '60px' }}>SL</th>
                                                <th>Payment Date</th>
                                                <th className="text-end">Amount (BDT)</th>
                                                <th>Note / Voucher Ref</th>
                                                <th className="pe-3">Recorded By</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {salaryHistoryData.map((item, idx) => (
                                                <tr key={item._id || idx}>
                                                    <td className="ps-3 text-muted fw-bold">{idx + 1}</td>
                                                    <td className="fw-semibold text-dark">
                                                        {item.date ? new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                                    </td>
                                                    <td className="text-end fw-bold text-success">
                                                        ৳{Number(item.amount || 0).toLocaleString()}
                                                    </td>
                                                    <td className="text-muted small">
                                                        {item.note || <span className="fst-italic opacity-50">Salary disbursement</span>}
                                                    </td>
                                                    <td className="pe-3 text-muted small">
                                                        {item.createdBy || 'Admin'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 bg-light d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => setShowSalaryHistoryModal(false)}>
                        Close
                    </Button>
                    {salaryHistoryTargetUser && (
                        <Button
                            variant="primary"
                            className="d-inline-flex align-items-center gap-1.5 fw-semibold"
                            onClick={() => {
                                const calculatedSalary = (salaryHistoryTargetUser.perHourTk && salaryHistoryTargetUser.perHourTk > 0)
                                    ? Math.round(salaryHistoryTargetUser.perHourTk * parseFloat(salaryHistoryTargetUser.totalHours || 0))
                                    : (salaryHistoryTargetUser.runningMonthSalary || null);
                                const paidVal = Number(salaryHistoryTargetUser.paid || 0);
                                const dueVal = calculatedSalary !== null ? Math.max(0, calculatedSalary - paidVal) : null;

                                setShowSalaryHistoryModal(false);
                                setPrintTargetUser({
                                    ...salaryHistoryTargetUser,
                                    calculatedSalary,
                                    paidVal,
                                    dueVal
                                });
                                setShowPrintModal(true);
                            }}
                        >
                            <FaPrint size={13} /> View / Print Statement
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Printable Employee Statement Modal */}
            <Modal show={showPrintModal} onHide={() => setShowPrintModal(false)} size="lg" centered dialogClassName="modal-statement-dialog">
                <Modal.Header closeButton className="border-bottom py-2.5 px-3 bg-white">
                    <div className="d-flex align-items-center justify-content-between w-100 pe-3">
                        <div>
                            <span className="fw-bold text-dark fs-6">Official Statement Preview</span>
                            <span className="text-muted ms-2" style={{ fontSize: '11.5px' }}>
                                Employee: <code className="text-dark fw-bold font-monospace">{printTargetUser?.userName || 'statement'}</code>
                            </span>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className="p-3 p-md-4" style={{ backgroundColor: '#334155', maxHeight: '86vh', overflowY: 'auto' }}>
                    {printTargetUser && (
                        <div
                            ref={printReportRef}
                            id="printable-employee-report"
                            style={{
                                maxWidth: '750px',
                                margin: '0 auto',
                                padding: '32px 38px',
                                backgroundColor: '#ffffff',
                                color: '#0f172a',
                                fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                                fontSize: '11px',
                                lineHeight: '1.5',
                                borderRadius: '4px',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                position: 'relative'
                            }}
                        >
                            {/* Watermark Logo */}
                            {logoBase64 && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '340px',
                                        height: '340px',
                                        opacity: '0.035',
                                        pointerEvents: 'none',
                                        zIndex: 0
                                    }}
                                >
                                    <img
                                        src={logoBase64}
                                        alt="TSF Watermark"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'grayscale(100%)' }}
                                    />
                                </div>
                            )}

                            {/* Main Content */}
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                {/* Header: Left (Logo & Info) and Right (Statement Title & Meta) side by side */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1.5px solid #0f172a', gap: '16px' }}>
                                    {/* Left Side */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '58%' }}>
                                        {logoBase64 ? (
                                            <img src={logoBase64} alt="TSF Logo" style={{ height: '52px', width: 'auto', maxWidth: '120px', objectFit: 'contain', flexShrink: 0 }} />
                                        ) : (
                                            <div style={{ width: '48px', height: '48px', backgroundColor: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px', borderRadius: '4px', flexShrink: 0 }}>
                                                TSF
                                            </div>
                                        )}
                                        <div>
                                            <div style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px', lineHeight: '1.2' }}>
                                                TUITION SEBA FORUM
                                            </div>
                                            <div style={{ fontSize: '9.5px', fontWeight: '600', color: '#64748b', letterSpacing: '0.1px', marginBottom: '2px' }}>
                                                A Trusted Platform for Professional Tuition Management
                                            </div>
                                            <div style={{ fontSize: '9.5px', color: '#475569', lineHeight: '1.3' }}>
                                                Masjid Goli, 2 No. Gate, Chattogram, Bangladesh<br />
                                                Hotlines: +880 1633-920928, +880 1714-045039 • tuitionsebaforum.com
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side */}
                                    <div style={{ textAlign: 'right', minWidth: '220px', flexShrink: 0 }}>
                                        <div style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px', textTransform: 'uppercase', lineHeight: '1.2' }}>
                                            SALARY STATEMENT
                                        </div>
                                        <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '4px', lineHeight: '1.4' }}>
                                            <div>Statement ID: <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>TSF-SAL-{(printTargetUser.userName || 'EMP').toUpperCase()}-{new Date().getFullYear()}{String(new Date().getMonth() + 1).padStart(2, '0')}</strong></div>
                                            <div>Issue Date: <strong style={{ color: '#0f172a' }}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></div>
                                            <div style={{ marginTop: '2px' }}>
                                                Status:{" "}
                                                <strong style={{
                                                    color: (printTargetUser.dueVal === 0 && Number(printTargetUser.paidVal) > 0) ? '#166534' : (printTargetUser.dueVal > 0) ? '#991b1b' : '#b45309',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {(printTargetUser.dueVal === 0 && Number(printTargetUser.paidVal) > 0) ? 'Settled in Full' : (printTargetUser.dueVal > 0) ? 'Payment Due' : 'Under Review'}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2-Column Employee & Period Information Split */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid #e2e8f0', gap: '16px' }}>
                                    <div style={{ width: '50%' }}>
                                        <div style={{ fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.4px', marginBottom: '4px' }}>
                                            Employee Details
                                        </div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>
                                            {printTargetUser.name}
                                        </div>
                                        <div style={{ color: '#475569', fontSize: '11px' }}>
                                            Username: <span style={{ fontFamily: 'monospace', color: '#0f172a', fontWeight: '600' }}>{printTargetUser.userName}</span>
                                        </div>
                                        <div style={{ color: '#475569', fontSize: '11px' }}>
                                            Agreed Hourly Rate: <strong style={{ color: '#0f172a' }}>{printTargetUser.perHourTk > 0 ? `৳ ${printTargetUser.perHourTk} / hr` : 'Standard / Fixed'}</strong>
                                        </div>
                                    </div>

                                    <div style={{ width: '50%', textAlign: 'right' }}>
                                        <div style={{ fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.4px', marginBottom: '4px' }}>
                                            Settlement Period
                                        </div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>
                                            {filterOptions.find(f => f.value === summaryFilter)?.label || summaryFilter}
                                        </div>
                                        <div style={{ color: '#475569', fontSize: '11px' }}>
                                            Logged Sessions: <strong style={{ color: '#0f172a' }}>{printTargetUser.totalSessions} Sessions ({printTargetUser.totalDaysPresent} Days)</strong>
                                        </div>
                                        <div style={{ color: '#475569', fontSize: '11px' }}>
                                            Daily Average: <strong style={{ color: '#0f172a' }}>{parseFloat(printTargetUser.avgHoursPerDay).toFixed(1)} hrs / day</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Attendance Metrics Summary (4 Grid Cards) */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '14px', marginBottom: '16px' }}>
                                    <div style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                                        <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Days Present</div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>{printTargetUser.totalDaysPresent} Days</div>
                                    </div>
                                    <div style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                                        <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Sessions Logged</div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>{printTargetUser.totalSessions}</div>
                                    </div>
                                    <div style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                                        <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total Hours</div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#2563eb', marginTop: '2px' }}>{parseFloat(printTargetUser.totalHours).toFixed(1)} hrs</div>
                                    </div>
                                    <div style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                                        <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Hourly Rate</div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                                            {printTargetUser.perHourTk > 0 ? `৳${printTargetUser.perHourTk}/hr` : '—'}
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Ledger Breakdown Table */}
                                <div style={{ marginBottom: '22px' }}>
                                    <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.4px', marginBottom: '5px' }}>
                                        Compensation & Settlement Breakdown
                                    </div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1.5px solid #0f172a', backgroundColor: '#f8fafc' }}>
                                                <th style={{ padding: '6px 8px', textAlign: 'left', color: '#0f172a', fontWeight: '700', fontSize: '10px', textTransform: 'uppercase', width: '6%' }}>SL</th>
                                                <th style={{ padding: '6px 8px', textAlign: 'left', color: '#0f172a', fontWeight: '700', fontSize: '10px', textTransform: 'uppercase', width: '48%' }}>Description</th>
                                                <th style={{ padding: '6px 8px', textAlign: 'center', color: '#0f172a', fontWeight: '700', fontSize: '10px', textTransform: 'uppercase', width: '18%' }}>Quantity / Hours</th>
                                                <th style={{ padding: '6px 8px', textAlign: 'right', color: '#0f172a', fontWeight: '700', fontSize: '10px', textTransform: 'uppercase', width: '14%' }}>Rate (BDT)</th>
                                                <th style={{ padding: '6px 8px', textAlign: 'right', color: '#0f172a', fontWeight: '700', fontSize: '10px', textTransform: 'uppercase', width: '14%' }}>Amount (BDT)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '8px 8px', color: '#64748b' }}>01</td>
                                                <td style={{ padding: '8px 8px' }}>
                                                    <div style={{ fontWeight: '700', color: '#0f172a' }}>Verified Working Hours Compensation</div>
                                                    <div style={{ fontSize: '10px', color: '#64748b' }}>Based on verified attendance sessions for {filterOptions.find(f => f.value === summaryFilter)?.label || summaryFilter}</div>
                                                </td>
                                                <td style={{ padding: '8px 8px', textAlign: 'center', color: '#0f172a', fontWeight: '600' }}>{parseFloat(printTargetUser.totalHours).toFixed(1)} hrs</td>
                                                <td style={{ padding: '8px 8px', textAlign: 'right', color: '#475569' }}>{printTargetUser.perHourTk > 0 ? `৳ ${printTargetUser.perHourTk}` : '—'}</td>
                                                <td style={{ padding: '8px 8px', textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>
                                                    {printTargetUser.calculatedSalary !== null ? `৳ ${printTargetUser.calculatedSalary.toLocaleString()}` : '—'}
                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                                <td colSpan="4" style={{ padding: '6px 8px', textAlign: 'right', fontWeight: '600', color: '#334155' }}>
                                                    Total Gross Earned Salary:
                                                </td>
                                                <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: '800', color: '#166534', fontSize: '11.5px' }}>
                                                    {printTargetUser.calculatedSalary !== null ? `৳ ${printTargetUser.calculatedSalary.toLocaleString()}` : '—'}
                                                </td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td colSpan="4" style={{ padding: '6px 8px', textAlign: 'right', fontWeight: '600', color: '#64748b' }}>
                                                    Less: Total Disbursed / Paid (Recorded in Expenses):
                                                </td>
                                                <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: '700', color: '#2563eb' }}>
                                                    ৳ {Number(printTargetUser.paidVal || 0).toLocaleString()}
                                                </td>
                                            </tr>
                                            <tr style={{ borderTop: '1.5px solid #0f172a', backgroundColor: '#ffffff' }}>
                                                <td colSpan="4" style={{ padding: '8px 8px', textAlign: 'right', fontWeight: '800', color: '#0f172a', fontSize: '11.5px' }}>
                                                    Net Payable Due Balance:
                                                </td>
                                                <td style={{
                                                    padding: '8px 8px',
                                                    textAlign: 'right',
                                                    fontWeight: '800',
                                                    fontSize: '13px',
                                                    color: (printTargetUser.dueVal > 0) ? '#dc2626' : '#166534'
                                                }}>
                                                    {printTargetUser.dueVal !== null ? `৳ ${printTargetUser.dueVal.toLocaleString()}` : '—'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Formal Signatures Section */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '28px', marginTop: '24px' }}>
                                    <div style={{ textAlign: 'center', width: '160px' }}>
                                        <div style={{ borderTop: '1px solid #0f172a', marginBottom: '4px' }}></div>
                                        <div style={{ fontSize: '10.5px', color: '#475569' }}>Prepared By (HR)</div>
                                    </div>

                                    <div style={{ textAlign: 'center', width: '160px' }}>
                                        <div style={{ borderTop: '1px solid #0f172a', marginBottom: '4px' }}></div>
                                        <div style={{ fontSize: '10.5px', color: '#475569' }}>Employee Signature</div>
                                    </div>

                                    <div style={{ textAlign: 'center', width: '180px' }}>
                                        {signatureBase64 && (
                                            <div style={{ height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2px' }}>
                                                <img src={signatureBase64} alt="TSF Authority Signature" style={{ maxHeight: '34px', objectFit: 'contain' }} />
                                            </div>
                                        )}
                                        <div style={{ borderTop: '1px solid #0f172a', marginBottom: '4px' }}></div>
                                        <div style={{ fontSize: '10.5px', fontWeight: '700', color: '#0f172a' }}>Authorized Signatory</div>
                                        <div style={{ fontSize: '9.5px', color: '#64748b' }}>Tuition Seba Forum</div>
                                    </div>
                                </div>

                                {/* System Footer Note */}
                                <div style={{ textAlign: 'center', fontSize: '8.5px', color: '#94a3b8', marginTop: '28px', letterSpacing: '0.2px' }}>
                                    Official System-Generated Statement • Tuition Seba Forum • System Generated Copy
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between py-2 px-3 bg-white border-top">
                    <Button variant="outline-secondary" size="sm" onClick={() => setShowPrintModal(false)}>
                        <FaTimes className="me-1" /> Close
                    </Button>
                    <div className="d-flex align-items-center gap-2">
                        <Button variant="dark" size="sm" onClick={handlePrintStatement} className="px-4 fw-bold d-flex align-items-center gap-2">
                            <FaPrint /> Print / Save PDF
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

            <style>{`
                .modal-extra-large {
                    max-width: 96vw !important;
                    width: 96vw !important;
                }
                .modal-statement-dialog {
                    max-width: 840px !important;
                    width: 840px !important;
                }
                @media (max-width: 880px) {
                    .modal-statement-dialog {
                        max-width: 96vw !important;
                        width: 96vw !important;
                    }
                }
                @media (min-width: 1400px) {
                    .modal-extra-large {
                        max-width: 93vw !important;
                        width: 93vw !important;
                    }
                }
                @media (min-width: 1800px) {
                    .modal-extra-large {
                        max-width: 88vw !important;
                        width: 88vw !important;
                    }
                }
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-employee-report, #printable-employee-report * {
                        visibility: visible;
                    }
                    #printable-employee-report {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 15px !important;
                        box-shadow: none !important;
                    }
                    .modal-backdrop, .modal-header, .modal-footer {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title>Edit Attendance</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingAttendance && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>User</Form.Label>
                                <Form.Control type="text" value={`${editingAttendance.name} (${editingAttendance.userName})`} disabled className="bg-light" />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Time</Form.Label>
                                        <DatePickerWrapper>
                                            <DateTimePicker
                                                onChange={setEditStartTime}
                                                value={editStartTime}
                                                disableClock={true}
                                                className="form-control border-0 p-0"
                                            />
                                        </DatePickerWrapper>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>End Time</Form.Label>
                                        <DatePickerWrapper>
                                            <DateTimePicker
                                                onChange={setEditEndTime}
                                                value={editEndTime}
                                                disableClock={true}
                                                clearIcon={null}
                                                className="form-control border-0 p-0"
                                            />
                                        </DatePickerWrapper>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" onClick={() => setShowEditModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="bottom-right" theme="colored" />
        </PageContainer>
    );
};

export default AttendancePage;
