import React, { useState, useEffect, useMemo } from 'react';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import NavBarPage from './NavbarPage';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserClock, FaSignInAlt, FaSignOutAlt, FaCalendarAlt, FaSearch, FaTrash, FaEdit, FaSpinner, FaCheckCircle, FaChartPie, FaChartBar } from 'react-icons/fa';
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

    const fetchSummary = async (sFilter = summaryFilter, sUserFilter = summaryUserFilter) => {
        setIsSummaryLoading(true);
        setShowSummaryModal(true);
        try {
            const params = {
                filter: sFilter || 'runningMonth',
            };
            if (sUserFilter?.value) {
                params.userFilter = sUserFilter.value;
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
                            onClick={fetchSummary}
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
            <Modal show={showSummaryModal} onHide={() => setShowSummaryModal(false)} size="xl" centered>
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
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-3">SL</th>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Total Sessions</th>
                                        <th>Days Present</th>
                                        <th>Total Hours</th>
                                        <th>Avg Hours / Session</th>
                                        <th>Avg Hours / Day</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSummaryData.map((user, idx) => (
                                        <tr key={idx}>
                                            <td className="ps-3 text-muted fw-bold">{idx + 1}</td>
                                            <td className="fw-bold text-dark">{user.name}</td>
                                            <td className="text-muted">{user.userName}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="fw-bold fs-6">{user.totalSessions}</span>
                                                    {user.runningSessions > 0 && (
                                                        <span className="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1">
                                                            <small>Running: {user.runningSessions}</small>
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1 fw-bold">
                                                    {user.totalDaysPresent}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="fw-bold text-dark">
                                                    {parseFloat(user.totalHours).toLocaleString('en-US', { maximumFractionDigits: 1 })} hrs
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${parseFloat(user.avgHours) >= 8 ? 'bg-success' : parseFloat(user.avgHours) >= 5 ? 'bg-warning text-dark' : 'bg-danger'} bg-opacity-100 text-white px-2 py-1`}>
                                                    {parseFloat(user.avgHours).toFixed(1)} hrs
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${parseFloat(user.avgHoursPerDay) >= 8 ? 'bg-success' : parseFloat(user.avgHoursPerDay) >= 5 ? 'bg-warning text-dark' : 'bg-danger'} bg-opacity-100 text-white px-2 py-1`}>
                                                    {parseFloat(user.avgHoursPerDay).toFixed(1)} hrs
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
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
