import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { FaClock } from 'react-icons/fa';
import DateTimePicker from 'react-datetime-picker';
import * as XLSX from 'xlsx';
import NavBarPage from './NavbarPage';
import SummaryCards from '../components/attendance/SummaryCards';
import FilterSection from '../components/attendance/FilterSection';
import AttendanceTable from '../components/attendance/AttendanceTable';
import EmployeeSummaryTable from '../components/attendance/EmployeeSummaryTable';
import styled from 'styled-components';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

const PageContainer = styled.div`
  background: linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%);
  min-height: 100vh;
  padding-bottom: 50px;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 15px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h2 {
    font-weight: 700;
    color: #1a202c;
    margin: 0;
  }
`;

const pulse = styled.keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);

  .loading-content {
    text-align: center;
    animation: ${pulse} 2s infinite ease-in-out;
  }

  .loading-icon {
    font-size: 4rem;
    color: #4a5568;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 1.8rem;
    color: #2d3748;
    margin-bottom: 10px;
    font-weight: 700;
  }
  
  p {
    color: #718096;
    font-size: 1.1rem;
  }
`;

const AttendancePage = () => {
    // State
    const [attendance, setAttendance] = useState([]);
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [filter, setFilter] = useState('today');
    const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });
    const [users, setUsers] = useState([]);
    const [userFilter, setUserFilter] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    // Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAttendance, setEditingAttendance] = useState(null);
    const [editStartTime, setEditStartTime] = useState(new Date());
    const [editEndTime, setEditEndTime] = useState(new Date());

    // Action Loading State
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState({ title: '', subtitle: '' });

    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    // Initial Fetch
    useEffect(() => {
        fetchAttendance();
        fetchUsers();
    }, []);

    // Auto Refresh
    useEffect(() => {
        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                fetchAttendance();
                setLastRefresh(new Date());
            }, 30000);
        }
        return () => clearInterval(interval);
    }, [autoRefresh]);

    // Apply Filters
    useEffect(() => {
        applyFilter();
        setCurrentPage(1);
    }, [filter, userFilter, attendance, searchTerm, dateRange]);

    const fetchAttendance = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/attendance', {
                headers: { Authorization: token },
            });
            setAttendance(response.data);
        } catch (error) {
            toast.error('Error fetching attendance');
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/user/users', {
                headers: { Authorization: token },
            });
            setUsers(response.data);
        } catch (error) {
            toast.error('Error fetching users');
        }
    }, [token]);

    const startDay = async () => {
        setActionLoading(true);
        setActionMessage({
            title: "Good Morning! ☀️",
            subtitle: "Starting your day... Have a productive one!"
        });
        try {
            await axios.post('https://tuition-seba-backend-1.onrender.com/api/attendance/start', {}, {
                headers: { Authorization: token },
            });
            // Small delay to let the user see the nice message
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Day started');
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error starting day');
        } finally {
            setActionLoading(false);
        }
    };

    const endDay = async () => {
        setActionLoading(true);
        setActionMessage({
            title: "Good Night! 🌙",
            subtitle: "Ending your day... Great work today!"
        });
        try {
            const response = await axios.put('https://tuition-seba-backend-1.onrender.com/api/attendance/end', {}, {
                headers: { Authorization: token },
            });
            // Small delay to let the user see the nice message
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success(`Day ended (${response.data.duration})`);
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error ending day');
        } finally {
            setActionLoading(false);
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

            toast.success('Record updated successfully');
            setShowEditModal(false);
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating attendance');
        }
    };

    const applyFilter = () => {
        const now = new Date();
        let filtered = [...attendance];

        if (filter === 'today') {
            filtered = filtered.filter(entry => {
                const startDate = new Date(entry.startTime);
                return startDate.toDateString() === now.toDateString();
            });
        } else if (filter === 'last7days') {
            const last7Days = new Date();
            last7Days.setDate(now.getDate() - 7);
            filtered = filtered.filter(entry => new Date(entry.startTime) >= last7Days);
        } else if (filter === 'lastMonth') {
            const lastMonth = new Date();
            lastMonth.setMonth(now.getMonth() - 1);
            lastMonth.setDate(1);
            filtered = filtered.filter(entry => new Date(entry.startTime) >= lastMonth);
        } else if (filter === 'custom') {
            if (dateRange.start && dateRange.end) {
                const start = new Date(dateRange.start);
                start.setHours(0, 0, 0, 0);
                const end = new Date(dateRange.end);
                end.setHours(23, 59, 59, 999);

                filtered = filtered.filter(entry => {
                    const entryDate = new Date(entry.startTime);
                    return entryDate >= start && entryDate <= end;
                });
            }
        } else {
            const monthIndex = new Date(`${filter} 1, ${now.getFullYear()}`).getMonth();
            filtered = filtered.filter(entry => new Date(entry.startTime).getMonth() === monthIndex);
        }

        if (userFilter) {
            filtered = filtered.filter(entry => entry.userId === userFilter.value);
        }

        if (searchTerm.trim()) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(entry =>
                entry.userName?.toLowerCase().includes(lowerSearch) ||
                entry.name?.toLowerCase().includes(lowerSearch)
            );
        }

        // Sort by startTime descending (recent first)
        filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        setFilteredAttendance(filtered);
    };

    // Memoized Calculations
    const todaySummary = useMemo(() => {
        if (!attendance.length) return null;

        const now = new Date();
        const todayRecords = attendance.filter(entry => {
            const startDate = new Date(entry.startTime);
            return startDate.toDateString() === now.toDateString();
        });

        const totalRecords = todayRecords.length;
        const completedRecords = todayRecords.filter(a => a.endTime).length;
        const runningRecords = todayRecords.filter(a => !a.endTime).length;

        let totalMinutes = 0;
        todayRecords.forEach(entry => {
            if (entry.endTime) {
                let minutes = 0;
                if (entry.duration && entry.duration.includes(':')) {
                    const [h, m] = entry.duration.split(':').map(Number);
                    minutes = (h * 60) + m;
                } else {
                    const start = new Date(entry.startTime);
                    const end = new Date(entry.endTime);
                    minutes = (end - start) / (1000 * 60);
                }
                totalMinutes += minutes;
            }
        });

        const avgHours = totalMinutes > 0 ? (totalMinutes / 60 / completedRecords).toFixed(2) : 0;

        return { totalRecords, completedRecords, runningRecords, totalMinutes, avgHours };
    }, [attendance]);

    // Keep filtered summary for other uses if needed, or remove if unused. 
    // The user specifically asked for "Today" stats in the cards.
    const attendanceSummary = useMemo(() => {
        if (!filteredAttendance.length) return null;

        const totalRecords = filteredAttendance.length;
        const completedRecords = filteredAttendance.filter(a => a.endTime).length;
        const runningRecords = filteredAttendance.filter(a => !a.endTime).length;

        let totalMinutes = 0;
        filteredAttendance.forEach(entry => {
            if (entry.endTime) {
                let minutes = 0;
                if (entry.duration && entry.duration.includes(':')) {
                    const [h, m] = entry.duration.split(':').map(Number);
                    minutes = (h * 60) + m;
                } else {
                    const start = new Date(entry.startTime);
                    const end = new Date(entry.endTime);
                    minutes = (end - start) / (1000 * 60);
                }
                totalMinutes += minutes;
            }
        });

        const avgHours = totalMinutes > 0 ? (totalMinutes / 60 / completedRecords).toFixed(2) : 0;

        return { totalRecords, completedRecords, runningRecords, totalMinutes, avgHours };
    }, [filteredAttendance]);

    const displaySummary = useMemo(() => {
        if (!todaySummary || !attendanceSummary) return null;
        return {
            totalRecords: todaySummary.totalRecords, // Based on Today only
            completedRecords: attendanceSummary.completedRecords, // Based on Filter
            runningRecords: attendanceSummary.runningRecords, // Based on Filter
            avgHours: attendanceSummary.avgHours // Based on Filter
        };
    }, [todaySummary, attendanceSummary]);

    const employeeSummary = useMemo(() => {
        if (!filteredAttendance.length) return [];
        const summary = {};
        filteredAttendance.forEach(entry => {
            const userId = entry.userId;
            if (!summary[userId]) {
                summary[userId] = {
                    userId,
                    name: entry.name,
                    userName: entry.userName,
                    totalRecords: 0,
                    completedRecords: 0,
                    totalMinutes: 0,
                };
            }
            summary[userId].totalRecords += 1;
            if (entry.endTime) {
                summary[userId].completedRecords += 1;

                let minutes = 0;
                if (entry.duration && entry.duration.includes(':')) {
                    const [h, m] = entry.duration.split(':').map(Number);
                    minutes = (h * 60) + m;
                } else {
                    const start = new Date(entry.startTime);
                    const end = new Date(entry.endTime);
                    minutes = (end - start) / (1000 * 60);
                }
                summary[userId].totalMinutes += minutes;
            }
        });

        Object.values(summary).forEach(emp => {
            if (emp.completedRecords > 0) {
                emp.avgHours = (emp.totalMinutes / 60 / emp.completedRecords).toFixed(2);
            } else {
                emp.avgHours = 0;
            }
        });

        return Object.values(summary).sort((a, b) => b.totalMinutes - a.totalMinutes);
    }, [filteredAttendance]);



    const exportToExcel = useCallback(() => {
        if (!filteredAttendance.length) return;
        const worksheetData = filteredAttendance.map(entry => ({
            Username: entry.userName || '',
            Name: entry.name || '',
            'Start Time': new Date(entry.startTime).toLocaleString(),
            'End Time': entry.endTime ? new Date(entry.endTime).toLocaleString() : 'Running',
            Duration: entry.duration || 'N/A',
            Status: entry.endTime ? 'Completed' : 'In Progress'
        }));

        const ws = XLSX.utils.json_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
        XLSX.writeFile(wb, `attendance_${new Date().toISOString().slice(0, 10)}.xlsx`);
        toast.success('Excel file downloaded!');
    }, [filteredAttendance]);

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
        setDateRange({ start: new Date(), end: new Date() });
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAttendance.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);

    return (
        <PageContainer>
            <NavBarPage />
            <ContentWrapper>
                <PageHeader>
                    <h2>Attendance Tracker</h2>
                    <div>
                        <Button variant="success" onClick={startDay} className="me-2 shadow-sm rounded-pill px-4">
                            <FaClock className="me-2" /> Start Day
                        </Button>
                        <Button variant="danger" onClick={endDay} className="shadow-sm rounded-pill px-4">
                            <FaClock className="me-2" /> End Day
                        </Button>
                    </div>
                </PageHeader>

                <SummaryCards summary={displaySummary} />

                <FilterSection
                    filter={filter}
                    setFilter={setFilter}
                    userFilter={userFilter}
                    setUserFilter={setUserFilter}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    users={users}
                    onRefresh={fetchAttendance}
                    onExport={exportToExcel}
                    onReset={resetFilters}
                    autoRefresh={autoRefresh}
                    setAutoRefresh={setAutoRefresh}
                    loading={loading}
                    lastRefresh={lastRefresh}
                />

                <AttendanceTable
                    attendance={currentItems}
                    loading={loading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onEdit={openEditModal}
                    onDelete={deleteAttendance}
                    userRole={userRole}
                />

                <EmployeeSummaryTable summary={employeeSummary} />

            </ContentWrapper>

            {/* Edit Modal */}
            {editingAttendance && (
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title>Edit Attendance Record</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Employee</Form.Label>
                                <Form.Control type="text" value={`${editingAttendance.name} (${editingAttendance.userName})`} disabled className="bg-light" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Start Time</Form.Label>
                                <div className="d-block">
                                    <DateTimePicker
                                        onChange={setEditStartTime}
                                        value={editStartTime}
                                        disableClock={true}
                                        className="form-control"
                                        clearIcon={null}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>End Time</Form.Label>
                                <div className="d-block">
                                    <DateTimePicker
                                        onChange={setEditEndTime}
                                        value={editEndTime}
                                        disableClock={true}
                                        className="form-control"
                                        clearIcon={null}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => setShowEditModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            )}

            <ToastContainer position="bottom-right" theme="colored" />

            {actionLoading && (
                <LoadingOverlay>
                    <div className="loading-content">
                        <div className="loading-icon">
                            {actionMessage.title.includes('Morning') ? '☀️' : '🌙'}
                        </div>
                        <h3>{actionMessage.title}</h3>
                        <p>{actionMessage.subtitle}</p>
                    </div>
                </LoadingOverlay>
            )}
        </PageContainer>
    );
};

export default AttendancePage;
