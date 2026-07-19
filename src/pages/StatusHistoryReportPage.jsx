import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Spinner, Badge } from 'react-bootstrap';
import { FaCalendarAlt, FaFilter, FaSearch, FaHistory, FaUserCheck, FaBookOpen, FaUndo, FaTag } from 'react-icons/fa';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

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
        startDate: '',
        endDate: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        moduleName: '',
        changedBy: '',
        tuitionCode: '',
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

    const handleApplyFilters = () => {
        setAppliedFilters(filters);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        const reset = {
            moduleName: '',
            changedBy: '',
            tuitionCode: '',
            startDate: '',
            endDate: ''
        };
        setFilters(reset);
        setAppliedFilters(reset);
        setCurrentPage(1);
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
                const diff = today.getDate() - day + (day === 0 ? -6 : 1);
                start.setDate(diff);
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

    if (role !== 'superadmin') {
        return null;
    }

    return (
        <>
            <NavBarPage />
            <StyledContainer fluid>
                <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
                    <div>
                        <h2 className="text-primary fw-extrabold d-flex align-items-center gap-2 mb-1" style={{ letterSpacing: '-0.5px' }}>
                            <FaHistory /> Report Dashboard
                        </h2>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="text-muted small">Monitor and audit status logs across modules</span>
                            <span className="text-secondary opacity-50 d-none d-sm-inline">•</span>
                            <span className="text-success fw-bold px-2 py-0.5 bg-soft-success rounded-pill" style={{ fontSize: '11px' }}>
                                Active since: 16 July 2026
                            </span>
                        </div>
                    </div>
                    <Button 
                        variant="primary" 
                        onClick={fetchTodayStats} 
                        disabled={statsLoading}
                        className="px-4 py-2 rounded-pill shadow-sm"
                    >
                        {statsLoading ? <Spinner animation="border" size="sm" /> : "Refresh Metrics"}
                    </Button>
                </div>

                {/* Today's KPI Widgets */}
                <Row className="mb-4 g-4">
                    <Col md={3}>
                        <PremiumStatsCard className="shadow-sm border-0 bg-gradient-success text-white p-4 rounded-4">
                            <Card.Body className="p-0">
                                <div className="d-flex align-items-center gap-4 mb-2">
                                    <div className="icon-wrapper bg-white-20 rounded-4 p-3 d-flex align-items-center justify-content-center">
                                        <FaUserCheck size={28} />
                                    </div>
                                    <div>
                                        <span className="text-white-70 text-uppercase tracking-wider fs-7">Teachers Verified Today</span>
                                        <h2 className="fw-extrabold mb-0 mt-1" style={{ fontSize: '2rem' }}>{todayStats.verifiedTeachersCount}</h2>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '10px', marginTop: '10px' }}>
                                    <Row className="g-2 text-center" style={{ fontSize: '10.5px' }}>
                                        <Col xs={6} style={{ borderRight: '1px solid rgba(255, 255, 255, 0.15)' }}>
                                            <div className="text-white-70 text-uppercase fw-semibold">Verified</div>
                                            <div className="fw-bold fs-6">{todayStats.verifiedBreakdown?.verified || 0}</div>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="text-white-70 text-uppercase fw-semibold">Confirmed</div>
                                            <div className="fw-bold fs-6">{todayStats.verifiedBreakdown?.afterConfirmation || 0}</div>
                                        </Col>
                                        <Col xs={6} style={{ borderRight: '1px solid rgba(255, 255, 255, 0.15)', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '4px' }}>
                                            <div className="text-white-70 text-uppercase fw-semibold">After Salary</div>
                                            <div className="fw-bold fs-6">{todayStats.verifiedBreakdown?.afterSalary || 0}</div>
                                        </Col>
                                        <Col xs={6} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '4px' }}>
                                            <div className="text-white-70 text-uppercase fw-semibold">30% Adv</div>
                                            <div className="fw-bold fs-6">{todayStats.verifiedBreakdown?.advance30 || 0}</div>
                                        </Col>
                                    </Row>
                                </div>
                            </Card.Body>
                        </PremiumStatsCard>
                    </Col>
                    <Col md={3}>
                        <PremiumStatsCard className="shadow-sm border-0 bg-gradient-info text-white p-4 rounded-4">
                            <Card.Body className="p-0">
                                <div className="d-flex align-items-center gap-4 mb-2">
                                    <div className="icon-wrapper bg-white-20 rounded-4 p-3 d-flex align-items-center justify-content-center">
                                        <FaBookOpen size={28} />
                                    </div>
                                    <div>
                                        <span className="text-white-70 text-uppercase tracking-wider fs-7">Tuitions Confirmed Today</span>
                                        <h2 className="fw-extrabold mb-0 mt-1" style={{ fontSize: '2rem' }}>{todayStats.confirmedTuitionsCount}</h2>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '10px', marginTop: '10px' }}>
                                    <Row className="g-2 text-center" style={{ fontSize: '10.5px' }}>
                                        <Col xs={6}>
                                            <div className="p-2 rounded bg-danger text-white border border-danger border-opacity-50">
                                                <div className="text-uppercase fw-semibold" style={{ fontSize: '9px', opacity: 0.95 }}>Canceled</div>
                                                <div className="fw-bold fs-6">{todayStats.cancelledTuitionsCount || 0}</div>
                                            </div>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="p-2 rounded bg-danger text-white border border-danger border-opacity-50">
                                                <div className="text-uppercase fw-semibold" style={{ fontSize: '9px', opacity: 0.95 }}>Suspended</div>
                                                <div className="fw-bold fs-6">{todayStats.suspendedTuitionsCount || 0}</div>
                                            </div>
                                        </Col>
                                        {/* Ghost second row to balance Card 1 height */}
                                        <Col xs={12} style={{ opacity: 0, pointerEvents: 'none', paddingTop: '4px' }}>
                                            <div className="fw-semibold">Placeholder</div>
                                            <div className="fw-bold fs-6">0</div>
                                        </Col>
                                    </Row>
                                </div>
                            </Card.Body>
                        </PremiumStatsCard>
                    </Col>
                    <Col md={3}>
                        <PremiumStatsCard className="shadow-sm border-0 bg-gradient-warning text-dark p-4 rounded-4">
                            <Card.Body className="p-0">
                                <div className="d-flex align-items-center gap-4 mb-2">
                                    <div className="icon-wrapper bg-black-10 rounded-4 p-3 d-flex align-items-center justify-content-center">
                                        <FaUserCheck size={28} />
                                    </div>
                                    <div>
                                        <span className="text-dark-70 text-uppercase tracking-wider fs-7">Applications Confirmed Today</span>
                                        <h2 className="fw-extrabold mb-0 mt-1" style={{ fontSize: '2rem' }}>{todayStats.confirmedApplicationsCount}</h2>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)', paddingTop: '10px', marginTop: '10px' }}>
                                    <Row className="g-2 text-center" style={{ fontSize: '10.5px' }}>
                                        <Col xs={6} style={{ borderRight: '1px solid rgba(0, 0, 0, 0.08)' }}>
                                            <div className="text-dark-70 text-uppercase fw-semibold">Selected</div>
                                            <div className="fw-bold fs-6">{todayStats.applyBreakdown?.selected || 0}</div>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="text-dark-70 text-uppercase fw-semibold">Confirmed</div>
                                            <div className="fw-bold fs-6">{todayStats.applyBreakdown?.confirmed || 0}</div>
                                        </Col>
                                        {/* Ghost second row to balance Card 1 height */}
                                        <Col xs={12} style={{ opacity: 0, pointerEvents: 'none', paddingTop: '4px' }}>
                                            <div className="fw-semibold">Placeholder</div>
                                            <div className="fw-bold fs-6">0</div>
                                        </Col>
                                    </Row>
                                </div>
                            </Card.Body>
                        </PremiumStatsCard>
                    </Col>
                    <Col md={3}>
                        <PremiumStatsCard className="shadow-sm border-0 bg-gradient-primary text-white p-4 rounded-4">
                            <Card.Body className="p-0">
                                <div className="d-flex align-items-center gap-4 mb-2">
                                    <div className="icon-wrapper bg-white-20 rounded-4 p-3 d-flex align-items-center justify-content-center">
                                        <FaBookOpen size={28} />
                                    </div>
                                    <div>
                                        <span className="text-white-70 text-uppercase tracking-wider fs-7">Tuitions Created Today</span>
                                        <h2 className="fw-extrabold mb-0 mt-1" style={{ fontSize: '2rem' }}>{todayStats.tuitionsCreatedTodayCount}</h2>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '10px', marginTop: '10px' }}>
                                    <Row className="g-2 text-center" style={{ fontSize: '10.5px' }}>
                                        <Col xs={6} style={{ borderRight: '1px solid rgba(255, 255, 255, 0.15)' }}>
                                            <div className="text-white-70 text-uppercase fw-semibold">Created</div>
                                            <div className="fw-bold fs-6">{todayStats.tuitionsCreatedTodayCount}</div>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="text-white-70 text-uppercase fw-semibold">Deleted</div>
                                            <div className="fw-bold fs-6">{todayStats.tuitionsDeletedTodayCount || 0}</div>
                                        </Col>
                                        {/* Ghost second row to balance Card 1 height */}
                                        <Col xs={12} style={{ opacity: 0, pointerEvents: 'none', paddingTop: '4px' }}>
                                            <div className="fw-semibold">Placeholder</div>
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
                                <Col md={3}>
                                    <Form.Label className="fw-semibold text-secondary small">Section</Form.Label>
                                    <Form.Select
                                        value={filters.moduleName}
                                        onChange={(e) => handleFilterChange('moduleName', e.target.value)}
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
                                    <Form.Label className="fw-semibold text-secondary small">Tuition Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search Tuition Code"
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
                                    <Button variant="success" className="w-100 py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center" type="submit" title="Search">
                                        <FaSearch />
                                    </Button>
                                    <Button variant="danger" className="w-100 py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center" onClick={handleResetFilters} title="Reset">
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
                                            <td colSpan="6" className="py-5">
                                                <div className="d-flex flex-column align-items-center gap-2">
                                                    <Spinner animation="border" variant="primary" />
                                                    <span className="text-muted small fw-semibold">Loading logs...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : historyList.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-5 text-muted fw-bold">
                                                No updates found matching the filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        historyList.map(log => (
                                            <tr key={log._id}>
                                                <td className="fw-semibold text-secondary">
                                                    {new Date(log.timestamp).toLocaleString('en-GB', {
                                                        day: '2-digit', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit', hour12: true
                                                    })}
                                                </td>
                                                <td>
                                                    <span className={`badge ${
                                                        log.module === 'RegTeacher' ? 'bg-soft-primary' :
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
            </StyledContainer>
            <ToastContainer />
        </>
    );
};

export default StatusHistoryReportPage;

const StyledContainer = styled(Container)`
  padding: 30px;
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
    background-color: #0f172a !important;
    border-color: #1e293b;
    padding: 14px;
  }
  
  .custom-reports-table td {
    padding: 14px;
    font-size: 14px;
    border-color: #e2e8f0;
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
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12) !important;
  }
`;
