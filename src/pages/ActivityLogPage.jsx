import React, { useState, useEffect, useCallback } from 'react';
import { Container as BootstrapContainer, Card, Table, Form, Button, Spinner, Badge as BootstrapBadge, Modal, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { FaSearch, FaUndo, FaEye, FaFileCsv, FaHistory, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import moment from 'moment';
import NavBarPage from './NavbarPage';
import axios from 'axios';

const PageContainer = styled.div`
  padding: 30px;
  background-color: #f4f4f9;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  h2 {
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const StatCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.2s;
  &:hover { transform: translateY(-5px); }
  .card-title { font-size: 0.85rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
  .card-value { font-size: 1.8rem; font-weight: 700; color: #1e293b; }
`;

const FilterCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 25px;
  background: white;
`;

const StyledTable = styled(Table)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  
  thead {
    background: #f8fafc;
    th {
      border-bottom: 2px solid #e2e8f0;
      color: #475569;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      padding: 15px;
    }
  }
  
  tbody td {
    padding: 15px;
    vertical-align: middle;
    color: #1e293b;
    border-bottom: 1px solid #f1f5f9;
  }
`;

const ActionBadge = styled(BootstrapBadge)`
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.7rem;
  background-color: ${props => {
    switch(props.action) {
      case 'Create': return '#dcfce7 !important; color: #15803d !important;';
      case 'Edit': return '#fef9c3 !important; color: #854d0e !important;';
      case 'Delete': return '#fee2e2 !important; color: #b91c1c !important;';
      default: return '#f1f5f9 !important; color: #475569 !important;';
    }
  }};
`;

const ModuleBadge = styled(BootstrapBadge)`
  background-color: #e0f2fe !important;
  color: #0369a1 !important;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 0.75rem;
`;

const TuitionCodeBadge = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: monospace;
  border: 1px solid #e5e7eb;
`;

const DiffContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .diff-item {
    display: grid;
    grid-template-columns: 120px 1fr 1fr;
    gap: 10px;
    align-items: center;
    padding: 8px;
    border-radius: 6px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    font-size: 0.85rem;
  }
  
  .field-name { font-weight: 700; color: #64748b; }
  .val-before { color: #b91c1c; text-decoration: line-through; background: #fee2e2; padding: 2px 4px; border-radius: 3px; }
  .val-after { color: #15803d; background: #dcfce7; padding: 2px 4px; border-radius: 3px; font-weight: 600; }
`;

const ActivityLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalLogs, setTotalLogs] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [users, setUsers] = useState([]);
    const [modules, setModules] = useState([]);
    const [exporting, setExporting] = useState(false);
    const [summary, setSummary] = useState({ total: 0, today: 0, create: 0, edit: 0, delete: 0 });
    const [selectedLog, setSelectedLog] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        user: '',
        module: '',
        startDate: '',
        endDate: '',
        tuitionCode: '',
        action: ''
    });

    const API_URL = 'https://tuition-seba-backend-1.onrender.com';

    const fetchLogs = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 50,
                user: filters.user,
                module: filters.module,
                startDate: filters.startDate,
                endDate: filters.endDate,
                tuitionCode: filters.tuitionCode,
                action: filters.action
            };
            const res = await axios.get(`${API_URL}/api/activity-log`, { params });
            setLogs(res.data.logs || []);
            setTotalLogs(res.data.total);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
            
            const summaryRes = await axios.get(`${API_URL}/api/activity-log/summary`, { params: filters });
            setSummary(summaryRes.data);
        } catch (err) {
            console.error('Failed to fetch logs', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchOptions = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/activity-log/filter-options`);
            setUsers(res.data.users || []);
            setModules(res.data.modules || []);
        } catch (err) {
            console.error('Failed to fetch options', err);
        }
    };

    useEffect(() => {
        fetchOptions();
        fetchLogs(1);
    }, [fetchLogs]);

    const handleSearch = () => fetchLogs(1);
    
    const handleReset = () => {
        setFilters({ user: '', module: '', startDate: '', endDate: '', tuitionCode: '', action: '' });
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const params = new URLSearchParams(filters).toString();
            const token = localStorage.getItem('token');
            window.open(`${API_URL}/api/activity-log/export?${params}&token=${token}`, '_blank');
        } catch (err) {
            console.error('Export failed', err);
        } finally {
            setExporting(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchLogs(newPage);
        }
    };

    // Advanced Pagination Items
    const getPaginationItems = () => {
        const items = [];
        const maxVisible = 7;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) items.push(i);
        } else {
            items.push(1);
            if (currentPage > 4) items.push('...');
            
            const start = Math.max(2, currentPage - 2);
            const end = Math.min(totalPages - 1, currentPage + 2);
            
            for (let i = start; i <= end; i++) {
                if (!items.includes(i)) items.push(i);
            }
            
            if (currentPage < totalPages - 3) items.push('...');
            if (!items.includes(totalPages)) items.push(totalPages);
        }
        return items;
    };

    const formatDetailsSummary = (log) => {
        if (log.action === 'Create') return `New ${log.module} created`;
        if (log.action === 'Delete') {
            const important = log.details?.importantFields || {};
            const identifier = important.guardianNumber || important.tutorNumber || important.personalPhone || 'record';
            return `Removed ${log.module} (${identifier})`;
        }
        if (log.action === 'Edit' && log.details?.after) {
            const fields = Object.keys(log.details.after);
            return `Updated: ${fields.join(', ')}`;
        }
        return 'View details for information';
    };

    return (
        <>
            <NavBarPage />
            <PageContainer>
            <BootstrapContainer fluid>
                <Header>
                    <h2><FaHistory /> System Activity Logs</h2>
                    <Button variant="success" onClick={handleExport} disabled={exporting}>
                        <FaFileCsv className="me-2" /> {exporting ? 'Exporting...' : 'Export to CSV'}
                    </Button>
                </Header>

                {/* Summary Cards */}
                <Row className="mb-4">
                    {[
                        { title: 'Total Logs', value: summary.total, color: '#3b82f6' },
                        { title: "Today's Logs", value: summary.today, color: '#8b5cf6' },
                        { title: 'Created', value: summary.create, color: '#10b981' },
                        { title: 'Edited', value: summary.edit, color: '#f59e0b' },
                        { title: 'Deleted', value: summary.delete, color: '#ef4444' }
                    ].map((item, idx) => (
                        <Col key={idx}>
                            <StatCard>
                                <Card.Body>
                                    <div className="card-title">{item.title}</div>
                                    <div className="card-value" style={{ color: item.color }}>{item.value}</div>
                                </Card.Body>
                            </StatCard>
                        </Col>
                    ))}
                </Row>

                {/* Filters */}
                <FilterCard>
                    <Card.Body className="p-4">
                        <Row className="g-3 align-items-end">
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold">User</Form.Label>
                                    <Form.Select 
                                        value={filters.user} 
                                        onChange={e => {
                                            const val = e.target.value;
                                            setFilters(prev => ({...prev, user: val}));
                                            // fetchLogs(1) will be triggered by useEffect
                                        }}
                                    >
                                        <option value="">All Users</option>
                                        <option value="Teacher">Teacher (Public)</option>
                                        <option value="System">System (Auto)</option>
                                        {users?.filter(u => u !== 'Teacher' && u !== 'System').map(u => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Module</Form.Label>
                                    <Form.Select 
                                        value={filters.module} 
                                        onChange={e => setFilters(prev => ({...prev, module: e.target.value}))}
                                    >
                                        <option value="">All Modules</option>
                                        {modules?.map(m => <option key={m} value={m}>{m}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={1}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Action</Form.Label>
                                    <Form.Select 
                                        value={filters.action} 
                                        onChange={e => setFilters(prev => ({...prev, action: e.target.value}))}
                                    >
                                        <option value="">All</option>
                                        <option value="Create">Create</option>
                                        <option value="Edit">Edit</option>
                                        <option value="Delete">Delete</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Tuition Code</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="T-XXXX"
                                        value={filters.tuitionCode} 
                                        onChange={e => setFilters({...filters, tuitionCode: e.target.value})}
                                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Start Date</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        value={filters.startDate} 
                                        onChange={e => setFilters({...filters, startDate: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold">End Date</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        value={filters.endDate} 
                                        onChange={e => setFilters({...filters, endDate: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2} className="d-flex gap-2">
                                <Button variant="primary" className="flex-grow-1" onClick={handleSearch}>
                                    <FaSearch className="me-2" /> Search
                                </Button>
                                <Button variant="outline-secondary" onClick={handleReset}>
                                    <FaUndo />
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </FilterCard>

                {/* Table */}
                <StyledTable responsive hover bordered striped>
                    <thead>
                        <tr className="table-primary">
                            <th>SL</th>
                            <th>Timestamp</th>
                            <th>User</th>
                            <th>Module</th>
                            <th>Tuition Code</th>
                            <th>Action</th>
                            <th>Summary</th>
                            <th className="text-center">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center p-5">
                                    <Spinner animation="border" variant="primary" />
                                    <div className="mt-2 text-muted">Loading activity data...</div>
                                </td>
                            </tr>
                        ) : logs.length > 0 ? (
                            logs.map((log, index) => (
                                <tr key={log._id}>
                                    <td>{(currentPage - 1) * 50 + index + 1}</td>
                                    <td>
                                        <div className="fw-semibold">{moment(log.timestamp).format('DD MMM YYYY')}</div>
                                        <div className="text-muted small">{moment(log.timestamp).format('hh:mm A')}</div>
                                    </td>
                                    <td><div className="fw-bold">{log.user}</div></td>
                                    <td><ModuleBadge>{log.module}</ModuleBadge></td>
                                    <td>
                                        {log.tuitionCode ? <TuitionCodeBadge>{log.tuitionCode}</TuitionCodeBadge> : <span className="text-muted small">-</span>}
                                    </td>
                                    <td>
                                        <ActionBadge action={log.action}>{log.action}</ActionBadge>
                                    </td>
                                    <td><div className="small text-muted">{formatDetailsSummary(log)}</div></td>
                                    <td className="text-center">
                                        <Button 
                                            variant="outline-info" 
                                            size="sm"
                                            onClick={() => { setSelectedLog(log); setShowModal(true); }}
                                        >
                                            <FaEye />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center p-5 text-muted">
                                    No logs found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </StyledTable>

                {/* Advanced Pagination */}
                <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap pb-5">
                    <Button
                        variant="outline-primary"
                        className="rounded-pill px-3"
                        disabled={currentPage === 1 || loading}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <FaChevronLeft className="me-1" /> Previous
                    </Button>

                    {getPaginationItems().map((item, idx) => (
                        item === '...' ? (
                            <span key={`dots-${idx}`} className="px-2 text-muted">...</span>
                        ) : (
                            <Button
                                key={item}
                                variant={currentPage === item ? 'primary' : 'outline-primary'}
                                className="rounded-circle"
                                style={{ width: '40px', height: '40px', padding: 0 }}
                                onClick={() => handlePageChange(item)}
                                disabled={loading}
                            >
                                {item}
                            </Button>
                        )
                    ))}

                    <Button
                        variant="outline-primary"
                        className="rounded-pill px-3"
                        disabled={currentPage === totalPages || loading}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next <FaChevronRight className="ms-1" />
                    </Button>
                </div>

                {/* Details Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title className="fw-bold">Activity Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                        {selectedLog && (
                            <Row className="g-4">
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="text-muted small fw-bold">TIMESTAMP</label>
                                        <div className="fw-bold">{moment(selectedLog.timestamp).format('DD MMMM YYYY, hh:mm:ss A')}</div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-muted small fw-bold">USER</label>
                                        <div className="fw-bold">{selectedLog.user}</div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="text-muted small fw-bold">MODULE</label>
                                        <div><ModuleBadge>{selectedLog.module}</ModuleBadge></div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-muted small fw-bold">ACTION</label>
                                        <div><ActionBadge action={selectedLog.action}>{selectedLog.action}</ActionBadge></div>
                                    </div>
                                </Col>
                                
                                {selectedLog.tuitionCode && (
                                    <Col md={12}>
                                        <div className="p-3 rounded bg-light border">
                                            <label className="text-muted small fw-bold d-block mb-1">ASSOCIATED TUITION CODE</label>
                                            <TuitionCodeBadge style={{ fontSize: '1rem' }}>{selectedLog.tuitionCode}</TuitionCodeBadge>
                                        </div>
                                    </Col>
                                )}

                                <Col md={12}>
                                    <label className="text-muted small fw-bold mb-2">MODIFIED DATA</label>
                                    
                                    {selectedLog.action === 'Edit' && selectedLog.details.after ? (
                                        <DiffContainer>
                                            <div className="diff-header small fw-bold text-muted px-2 mb-1">
                                                <span>FIELD</span>
                                                <span>BEFORE</span>
                                                <span>AFTER</span>
                                            </div>
                                            {Object.keys(selectedLog.details.after).map(key => (
                                                <div key={key} className="diff-item">
                                                    <span className="field-name">{key}</span>
                                                    <span className="val-before">{String(selectedLog.details.before?.[key] || 'N/A')}</span>
                                                    <span className="val-after">{String(selectedLog.details.after[key])}</span>
                                                </div>
                                            ))}
                                        </DiffContainer>
                                    ) : selectedLog.action === 'Delete' ? (
                                        <div className="p-3 rounded bg-danger bg-opacity-10 border border-danger border-opacity-20">
                                            <div className="fw-bold text-danger mb-2">Record Deleted</div>
                                            <div className="small">
                                                {Object.entries(selectedLog.details.importantFields || {}).map(([k, v]) => (
                                                    <div key={k}><strong>{k}:</strong> {String(v)}</div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-3 rounded bg-success bg-opacity-10 border border-success border-opacity-20 text-success fw-bold text-center">
                                            Initial creation of the record.
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </BootstrapContainer>
        </PageContainer>
        </>
    );
};

export default ActivityLogPage;
