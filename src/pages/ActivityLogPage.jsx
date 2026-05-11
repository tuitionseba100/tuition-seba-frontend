import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FaSearch, FaHistory, FaFilter, FaCalendarAlt, FaUser, FaLayerGroup, FaEye, FaFileCsv, FaUndo, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarPage from './NavbarPage';
import styled, { keyframes } from 'styled-components';
import { toast } from 'react-toastify';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  background-color: #f8fafc;
  min-height: 100vh;
  padding-bottom: 5rem;
  font-family: 'Poppins', sans-serif;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 3rem 10px;
  animation: ${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TitleArea = styled.div`
  h2 {
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.25rem;
  }
  p {
    color: #718096;
    margin-bottom: 0;
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-end;
  border: 1px solid #edf2f7;
`;

const FilterItem = styled.div`
  flex: 1;
  min-width: 200px;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 0.5rem;
    
    svg {
      color: #718096;
    }
  }

  input, select {
    width: 100%;
    padding: 0.6rem 1rem;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    font-size: 0.9rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }
  }
`;

const LogTableContainer = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #edf2f7;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.2fr 2fr 1fr 80px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  
  span {
    font-size: 0.75rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const LogRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.2fr 2fr 1fr 80px;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Badge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
  
  ${props => props.action === 'Create' && `
    background: #ecfdf5;
    color: #059669;
  `}
  
  ${props => props.action === 'Edit' && `
    background: #eff6ff;
    color: #2563eb;
  `}
  
  ${props => props.action === 'Delete' && `
    background: #fef2f2;
    color: #dc2626;
  `}
`;

const ModuleBadge = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a5568;
  background: #f1f5f9;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
`;

const ActionBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
    border-color: #cbd5e1;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 0 1rem;
`;

const DiffContainer = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 8px;

  .diff-item {
    margin-bottom: 0.75rem;
    border-bottom: 1px solid #334155;
    padding-bottom: 0.5rem;
    
    &:last-child {
      border-bottom: none;
    }
  }

  .field-name {
    color: #94a3b8;
    font-weight: 700;
    margin-bottom: 0.25rem;
    display: block;
  }

  .val-before {
    color: #fca5a5;
    display: block;
    &::before { content: "- "; }
  }

  .val-after {
    color: #86efac;
    display: block;
    &::before { content: "+ "; }
  }
`;

const ActivityLogPage = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchInputs, setSearchInputs] = useState({
        user: '',
        module: '',
        startDate: '',
        endDate: ''
    });
    const [appliedFilters, setAppliedFilters] = useState({
        user: '',
        module: '',
        startDate: '',
        endDate: ''
    });
    const [filterOptions, setFilterOptions] = useState({ users: [], modules: [] });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const [selectedLog, setSelectedLog] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        if (!token || role !== 'superadmin') {
            navigate('/admin/dashboard');
            toast.error('Only superadmin can access activity logs');
            return;
        }
        fetchFilterOptions();
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [currentPage, appliedFilters]);

    const fetchFilterOptions = async () => {
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/activityLog/filters', {
                headers: { Authorization: token }
            });
            setFilterOptions(res.data);
        } catch (err) {
            console.error('Error fetching filter options:', err);
        }
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                ...appliedFilters,
                page: currentPage,
                limit: 50
            });
            const res = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/activityLog/all?${queryParams}`, {
                headers: { Authorization: token }
            });
            setLogs(res.data.data);
            setTotalLogs(res.data.total);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            toast.error('Error fetching activity logs');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterInputChange = (e) => {
        const { name, value } = e.target;
        setSearchInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        setAppliedFilters(searchInputs);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        const reset = { user: '', module: '', startDate: '', endDate: '' };
        setSearchInputs(reset);
        setAppliedFilters(reset);
        setCurrentPage(1);
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const queryParams = new URLSearchParams(appliedFilters);
            window.open(`https://tuition-seba-backend-1.onrender.com/api/activityLog/exportData?${queryParams}&token=${token}`, '_blank');
            toast.success('Export started...');
        } catch (err) {
            toast.error('Export failed');
        } finally {
            setExporting(false);
        }
    };

    const formatDetails = (log) => {
        if (!log.details) return 'N/A';
        
        if (log.action === 'Delete') {
            const fields = log.details.importantFields || {};
            return Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join(', ');
        }
        
        if (log.action === 'Create') {
            return 'New resource created';
        }

        if (log.action === 'Edit') {
            const diff = log.details.before || {};
            return `${Object.keys(diff).length} fields updated`;
        }

        return 'N/A';
    };

    return (
        <PageContainer>
            <NavBarPage />
            <ContentWrapper>
                <HeaderSection>
                    <TitleArea>
                        <h2>System Activity Log</h2>
                        <p>Track all administrative actions across the system</p>
                    </TitleArea>
                </HeaderSection>

                <FilterSection>
                    <FilterItem>
                        <label><FaUser /> User</label>
                        <select name="user" value={searchInputs.user} onChange={handleFilterInputChange}>
                            <option value="">All Users</option>
                            {filterOptions.users.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </FilterItem>
                    
                    <FilterItem>
                        <label><FaLayerGroup /> Module</label>
                        <select name="module" value={searchInputs.module} onChange={handleFilterInputChange}>
                            <option value="">All Modules</option>
                            {filterOptions.modules.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </FilterItem>

                    <FilterItem>
                        <label><FaCalendarAlt /> Start Date</label>
                        <input type="date" name="startDate" value={searchInputs.startDate} onChange={handleFilterInputChange} />
                    </FilterItem>

                    <FilterItem>
                        <label><FaCalendarAlt /> End Date</label>
                        <input type="date" name="endDate" value={searchInputs.endDate} onChange={handleFilterInputChange} />
                    </FilterItem>

                    <div className="d-flex gap-2">
                        <Button variant="primary" style={{ borderRadius: '10px', height: '42px', fontWeight: '600' }} onClick={handleSearch} disabled={loading}>
                            {loading ? <Spinner size="sm" /> : <FaSearch style={{ marginRight: '8px' }} />} Search
                        </Button>
                        <Button variant="danger" style={{ borderRadius: '10px', height: '42px', fontWeight: '600' }} onClick={handleResetFilters}>
                            <FaUndo style={{ marginRight: '8px' }} /> Reset
                        </Button>
                    </div>
                </FilterSection>

                <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                    <div className="text-muted fw-bold">
                        Total Logs found: <span className="text-primary">{totalLogs}</span>
                    </div>
                    <Button variant="success" style={{ borderRadius: '10px', height: '42px', fontWeight: '600' }} onClick={handleExport} disabled={exporting}>
                        {exporting ? <Spinner size="sm" /> : <FaFileCsv style={{ marginRight: '8px' }} />} Export CSV
                    </Button>
                </div>

                <LogTableContainer>
                    <TableHeader>
                        <span>Date & Time</span>
                        <span>User</span>
                        <span>Action</span>
                        <span>Module</span>
                        <span>Summary</span>
                        <span>Details</span>
                    </TableHeader>

                    {loading ? (
                        <div className="p-5 text-center">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3 text-muted">Loading logs...</p>
                        </div>
                    ) : logs.length > 0 ? (
                        logs.map(log => (
                            <LogRow key={log._id}>
                                <div className="text-secondary small fw-medium">
                                    {new Date(log.timestamp).toLocaleString()}
                                </div>
                                <div className="fw-bold text-dark">{log.user}</div>
                                <div><Badge action={log.action}>{log.action}</Badge></div>
                                <div><ModuleBadge>{log.module}</ModuleBadge></div>
                                <div className="text-muted small truncate">{formatDetails(log)}</div>
                                <div>
                                    <ActionBtn onClick={() => { setSelectedLog(log); setShowModal(true); }}>
                                        <FaEye />
                                    </ActionBtn>
                                </div>
                            </LogRow>
                        ))
                    ) : (
                        <div className="p-5 text-center text-muted">No activity logs found matching the filters.</div>
                    )}
                </LogTableContainer>

                <PaginationContainer>
                    <div className="text-muted small fw-bold">
                        Showing page {currentPage} of {totalPages} ({totalLogs} total logs)
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        <Button 
                            variant="outline-primary" 
                            style={{ borderRadius: '50px', padding: '0.5rem 1.25rem', fontWeight: '600' }}
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            <FaChevronLeft style={{ marginRight: '5px' }} /> Previous
                        </Button>
                        <span className="fw-bold px-3">Page {currentPage}</span>
                        <Button 
                            variant="outline-primary"
                            style={{ borderRadius: '50px', padding: '0.5rem 1.25rem', fontWeight: '600' }}
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next <FaChevronRight style={{ marginLeft: '5px' }} />
                        </Button>
                    </div>
                </PaginationContainer>
            </ContentWrapper>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ background: '#f8fafc' }}>
                    <Modal.Title style={{ fontWeight: '700', fontSize: '1.25rem' }}>
                        Log Details - {selectedLog?.module}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '2rem' }}>
                    {selectedLog && (
                        <div>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase">Action Performed</label>
                                    <div className="mt-1"><Badge action={selectedLog.action}>{selectedLog.action}</Badge></div>
                                </div>
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase">Timestamp</label>
                                    <div className="mt-1 fw-semibold">{new Date(selectedLog.timestamp).toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase">User</label>
                                    <div className="mt-1 fw-bold">{selectedLog.user}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase">Resource ID</label>
                                    <div className="mt-1 text-secondary small" style={{ fontFamily: 'monospace' }}>{selectedLog.resourceId}</div>
                                </div>
                            </div>

                            <label className="text-muted small fw-bold text-uppercase mb-2">Data Changes</label>
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
                                <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                                    {Object.entries(selectedLog.details.importantFields || {}).map(([k, v]) => (
                                        <div key={k} className="mb-1">
                                            <strong className="text-danger">{k}:</strong> {v}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-3 bg-light rounded text-center text-muted border">
                                    Full resource data available in the system.
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </PageContainer>
    );
};

export default ActivityLogPage;
