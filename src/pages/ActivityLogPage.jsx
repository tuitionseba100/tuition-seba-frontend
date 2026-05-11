import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container as BootstrapContainer, Card, Table, Form, Button, Spinner, Badge as BootstrapBadge, Modal, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { FaSearch, FaUndo, FaEye, FaFileCsv, FaHistory } from 'react-icons/fa';
import moment from 'moment';

const PageContainer = styled.div`
  padding: 30px;
  background: #f4f4f9;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  h2 {
    font-family: 'Arial', sans-serif;
    color: #333;
    font-weight: 700;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const FilterCard = styled(Card)`
  border: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-radius: 12px;
  margin-bottom: 25px;
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
  background-color: ${props => 
    props.action === 'Create' ? '#dcfce7' : 
    props.action === 'Edit' ? '#fef9c3' : 
    props.action === 'Delete' ? '#fee2e2' : '#f1f5f9'};
  color: ${props => 
    props.action === 'Create' ? '#166534' : 
    props.action === 'Edit' ? '#854d0e' : 
    props.action === 'Delete' ? '#991b1b' : '#475569'};
`;

const ModuleBadge = styled.span`
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const TuitionCodeBadge = styled.span`
  background: #f3f4f6;
  color: #374151;
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

    // Filter states
    const [filters, setFilters] = useState({
        user: '',
        module: '',
        startDate: '',
        endDate: '',
        tuitionCode: ''
    });

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
                tuitionCode: filters.tuitionCode
            };
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/activity-log`, { params });
            setLogs(res.data.logs || []);
            setTotalLogs(res.data.total);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
            
            // Also fetch summary for cards
            const summaryRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/activity-log/summary`, { params });
            setSummary(summaryRes.data);
        } catch (err) {
            console.error('Failed to fetch logs', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchOptions = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/activity-log/filter-options`);
            setUsers(res.data.users);
            setModules(res.data.modules);
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
        setFilters({ user: '', module: '', startDate: '', endDate: '', tuitionCode: '' });
        // fetchLogs will be triggered by the useEffect due to dependency on filters
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/activity-log/export`, {
                params: filters,
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `activity_logs_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export failed', err);
        } finally {
            setExporting(false);
        }
    };

    const [selectedLog, setSelectedLog] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const formatDetailsSummary = (log) => {
        if (log.action === 'Create') return `New ${log.module} created`;
        if (log.action === 'Delete') return `${log.module} removed`;
        if (log.action === 'Edit' && log.details.after) {
            const keys = Object.keys(log.details.after);
            return `Updated: ${keys.join(', ')}`;
        }
        return 'N/A';
    };

    return (
        <PageContainer>
            <BootstrapContainer fluid>
                <Header>
                    <h2><FaHistory /> System Activity Logs</h2>
                    <Button variant="success" onClick={handleExport} disabled={exporting || loading}>
                        {exporting ? <Spinner size="sm" /> : <FaFileCsv className="me-2" />} Export CSV
                    </Button>
                </Header>

                {/* Summary Cards */}
                <Row className="mb-4">
                    {[
                        { label: 'Total Logs', value: summary.total, color: 'primary' },
                        { label: 'Today', value: summary.today, color: 'info' },
                        { label: 'Created', value: summary.create, color: 'success' },
                        { label: 'Edited', value: summary.edit, color: 'warning' },
                        { label: 'Deleted', value: summary.delete, color: 'danger' }
                    ].map((item, idx) => (
                        <Col key={idx} xs={6} md={2} className="mb-3">
                            <Card className={`text-center shadow-sm border-${item.color}`}>
                                <Card.Body className="p-3">
                                    <div className={`text-${item.color} fw-bold small text-uppercase`}>{item.label}</div>
                                    <div className="fs-4 fw-bold">{item.value}</div>
                                </Card.Body>
                            </Card>
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
                                        onChange={e => setFilters({...filters, user: e.target.value})}
                                    >
                                        <option value="">All Users</option>
                                        {users?.map(u => <option key={u} value={u}>{u}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Module</Form.Label>
                                    <Form.Select 
                                        value={filters.module} 
                                        onChange={e => setFilters({...filters, module: e.target.value})}
                                    >
                                        <option value="">All Modules</option>
                                        {modules?.map(m => <option key={m} value={m}>{m}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Tuition Code</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Search Code..."
                                        value={filters.tuitionCode} 
                                        onChange={e => setFilters({...filters, tuitionCode: e.target.value})}
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
                                <Button variant="primary" className="flex-grow-1" onClick={handleSearch} disabled={loading}>
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
                <Card className="border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <StyledTable hover responsive className="mb-0">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>User</th>
                                <th>Module</th>
                                <th>Action / Tuition Code</th>
                                <th>Summary</th>
                                <th className="text-center">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-5">
                                        <Spinner animation="border" variant="primary" />
                                        <div className="mt-2 text-muted">Loading activity data...</div>
                                    </td>
                                </tr>
                            ) : logs.length > 0 ? (
                                logs.map(log => (
                                    <tr key={log._id}>
                                        <td>
                                            <div className="fw-semibold">{moment(log.timestamp).format('DD MMM YYYY')}</div>
                                            <div className="text-muted small">{moment(log.timestamp).format('hh:mm A')}</div>
                                        </td>
                                        <td><div className="fw-bold">{log.user}</div></td>
                                        <td><ModuleBadge>{log.module}</ModuleBadge></td>
                                        <td>
                                            <div className="d-flex flex-column gap-1">
                                                <ActionBadge action={log.action}>{log.action}</ActionBadge>
                                                {log.tuitionCode && <TuitionCodeBadge>{log.tuitionCode}</TuitionCodeBadge>}
                                            </div>
                                        </td>
                                        <td><span className="text-muted small">{formatDetailsSummary(log)}</span></td>
                                        <td className="text-center">
                                            <Button variant="link" size="sm" onClick={() => { setSelectedLog(log); setShowModal(true); }}>
                                                <FaEye size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-5 text-muted">No logs found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </StyledTable>
                </Card>

                {/* Pagination */}
                <div className="mt-4 d-flex justify-content-between align-items-center">
                    <div className="text-muted small fw-bold">
                        Showing page {currentPage} of {totalPages} ({totalLogs} total)
                    </div>
                    <div className="d-flex gap-1">
                        <Button 
                            variant="outline-primary" 
                            size="sm" 
                            disabled={currentPage === 1 || loading}
                            onClick={() => fetchLogs(currentPage - 1)}
                        >
                            Previous
                        </Button>
                        {[...Array(Math.max(0, Math.min(5, Number(totalPages) || 0)))].map((_, i) => {
                            const pageNum = i + 1; // Simplification
                            return (
                                <Button 
                                    key={pageNum}
                                    variant={currentPage === pageNum ? 'primary' : 'outline-primary'}
                                    size="sm"
                                    onClick={() => fetchLogs(pageNum)}
                                    disabled={loading}
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}
                        <Button 
                            variant="outline-primary" 
                            size="sm" 
                            disabled={currentPage === totalPages || loading}
                            onClick={() => fetchLogs(currentPage + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>

                {/* Details Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title className="fw-bold h5">Activity Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                        {selectedLog && (
                            <>
                                <Row className="mb-4">
                                    <Col md={4}>
                                        <label className="text-muted small fw-bold text-uppercase">Module</label>
                                        <div className="mt-1"><ModuleBadge className="fs-6">{selectedLog.module}</ModuleBadge></div>
                                    </Col>
                                    <Col md={4}>
                                        <label className="text-muted small fw-bold text-uppercase">Action</label>
                                        <div className="mt-1"><ActionBadge action={selectedLog.action} className="fs-6">{selectedLog.action}</ActionBadge></div>
                                    </Col>
                                    <Col md={4}>
                                        <label className="text-muted small fw-bold text-uppercase">Tuition Code</label>
                                        <div className="mt-1"><TuitionCodeBadge className="fs-6">{selectedLog.tuitionCode || 'N/A'}</TuitionCodeBadge></div>
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col md={4}>
                                        <label className="text-muted small fw-bold text-uppercase">User</label>
                                        <div className="mt-1 fw-bold">{selectedLog.user}</div>
                                    </Col>
                                    <Col md={8}>
                                        <label className="text-muted small fw-bold text-uppercase">Timestamp</label>
                                        <div className="mt-1 text-secondary">{moment(selectedLog.timestamp).format('DD MMMM YYYY, hh:mm:ss A')}</div>
                                    </Col>
                                </Row>

                                <div className="mb-2">
                                    <label className="text-muted small fw-bold text-uppercase">Resource ID</label>
                                    <div className="text-secondary small font-monospace">{selectedLog.resourceId}</div>
                                </div>

                                <hr className="my-4" />

                                <label className="text-muted small fw-bold text-uppercase mb-3 d-block">Data Changes</label>
                                {selectedLog.action === 'Edit' ? (
                                    <DiffContainer>
                                        {Object.keys(selectedLog.details.after || {}).map(key => (
                                            <div className="diff-item" key={key}>
                                                <span className="field-name">{key}</span>
                                                <span className="val-before">{JSON.stringify(selectedLog.details.before[key])}</span>
                                                <span className="val-after">{JSON.stringify(selectedLog.details.after[key])}</span>
                                            </div>
                                        ))}
                                    </DiffContainer>
                                ) : selectedLog.action === 'Delete' ? (
                                    <div className="bg-danger-subtle p-3 rounded border border-danger-subtle">
                                        <div className="fw-bold text-danger mb-2">Deleted Record Data:</div>
                                        {Object.entries(selectedLog.details.importantFields || {}).map(([k, v]) => (
                                            <div key={k} className="small mb-1">
                                                <strong className="text-uppercase">{k}:</strong> {v}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-light rounded text-center text-muted border border-dashed">
                                        Full resource created. Navigate to the {selectedLog.module} module to view.
                                    </div>
                                )}
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="bg-light">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </BootstrapContainer>
        </PageContainer>
    );
};

export default ActivityLogPage;
