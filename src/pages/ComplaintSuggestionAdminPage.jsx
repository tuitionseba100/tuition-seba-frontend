import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Spinner, Badge, Modal } from 'react-bootstrap';
import { FaTrash, FaEdit, FaSearch, FaFilter, FaBullhorn, FaLightbulb, FaUndo, FaShieldAlt } from 'react-icons/fa';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';

const ComplaintSuggestionAdminPage = () => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [summary, setSummary] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, dismissed: 0, spam: 0 });

    // Filters
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        isSpam: '',
        search: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        type: '',
        status: '',
        isSpam: '',
        search: ''
    });

    // Update Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState('Pending');
    const [adminComment, setAdminComment] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchSubmissions();
        fetchSummary();
    }, [appliedFilters, currentPage]);

    const fetchSummary = async () => {
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/complaintSuggestion/summary', {
                headers: { Authorization: token }
            });
            setSummary(res.data);
        } catch (err) {
            console.error('Error fetching summary:', err);
        }
    };

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/complaintSuggestion/list', {
                params: {
                    page: currentPage,
                    limit: 25,
                    ...appliedFilters
                },
                headers: { Authorization: token }
            });
            setDataList(res.data.data);
            setTotalPages(res.data.totalPages);
            setTotalRecords(res.data.totalRecords);
        } catch (err) {
            console.error('Error fetching submissions:', err);
            toast.error('Failed to load complaints and suggestions.');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyFilters = (e) => {
        if (e) e.preventDefault();
        setAppliedFilters(filters);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        const reset = { type: '', status: '', isSpam: '', search: '' };
        setFilters(reset);
        setAppliedFilters(reset);
        setCurrentPage(1);
    };

    const openEditModal = (item) => {
        setSelectedItem(item);
        setStatusUpdate(item.status);
        setAdminComment(item.adminComment || '');
        setShowEditModal(true);
    };

    const handleUpdateStatus = async () => {
        setUpdating(true);
        try {
            await axios.put(`https://tuition-seba-backend-1.onrender.com/api/complaintSuggestion/${selectedItem._id}/status`, {
                status: statusUpdate,
                adminComment: adminComment
            }, {
                headers: { Authorization: token }
            });
            toast.success('Status updated successfully!');
            setShowEditModal(false);
            fetchSubmissions();
            fetchSummary();
        } catch (err) {
            console.error('Update error:', err);
            toast.error('Failed to update status.');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/complaintSuggestion/${id}`, {
                headers: { Authorization: token }
            });
            toast.success('Record deleted successfully!');
            fetchSubmissions();
            fetchSummary();
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Failed to delete record.');
        }
    };

    const getCategoryLabel = (cat) => {
        const map = {
            'payment_issue': 'পেমেন্ট সংক্রান্ত সমস্যা',
            'agent_behavior': 'এজেন্টের ব্যবহার/আচরণ',
            'technical_issue': 'অ্যাপ বা ওয়েবসাইট সংক্রান্ত সমস্যা',
            'tuition_issue': 'টিউশন সংক্রান্ত সমস্যা',
            'other': 'অন্যান্য'
        };
        return map[cat] || cat;
    };

    const handleExportCSV = async () => {
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/complaintSuggestion/list', {
                params: {
                    page: 1,
                    limit: 5000,
                    ...appliedFilters
                },
                headers: { Authorization: token }
            });
            const dataToExport = res.data.data;
            if (!dataToExport || dataToExport.length === 0) {
                toast.warn("No data available to export.");
                return;
            }

            // Convert to CSV
            const headers = ["Date", "Type", "Category", "Name", "Phone", "Teacher Code", "Description", "Status", "Admin Comment"];
            const csvRows = [headers.join(",")];

            for (const item of dataToExport) {
                const values = [
                    new Date(item.createdAt).toLocaleString(),
                    item.type,
                    item.category,
                    `"${item.name.replace(/"/g, '""')}"`,
                    item.phone,
                    item.teacherCode || "",
                    `"${item.description.replace(/"/g, '""')}"`,
                    item.status,
                    `"${(item.adminComment || "").replace(/"/g, '""')}"`
                ];
                csvRows.push(values.join(","));
            }

            const csvString = "\ufeff" + csvRows.join("\n");
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `complaints_export_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Export failed:", err);
            toast.error("Failed to export data.");
        }
    };

    return (
        <>
            <NavBarPage />
            <StyledContainer fluid>
                <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
                    <div>
                        <h2 className="text-primary fw-bold mb-1">
                            Complaints & Suggestions
                        </h2>
                    </div>
                </div>

                {/* Summary Metrics Cards */}
                <Card className="shadow-sm border-0 mb-4 rounded-3">
                    <Card.Body className="p-3">
                        <Row className="g-3 text-center">
                            <Col xs={6} sm={4} md={2}>
                                <div className="card p-3 shadow-sm border-primary h-100">
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <span className="text-primary fw-bold mb-1" style={{ fontSize: '12px' }}>Total Submissions</span>
                                        <span className="fs-5 fw-bold text-dark">{summary.total}</span>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={6} sm={4} md={2}>
                                <div className="card p-3 shadow-sm border-primary h-100">
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <span className="text-primary fw-bold mb-1" style={{ fontSize: '12px' }}>Pending</span>
                                        <span className="fs-5 fw-bold text-dark">{summary.pending}</span>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={6} sm={4} md={2}>
                                <div className="card p-3 shadow-sm border-primary h-100">
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <span className="text-primary fw-bold mb-1" style={{ fontSize: '12px' }}>In Progress</span>
                                        <span className="fs-5 fw-bold text-dark">{summary.inProgress}</span>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={6} sm={4} md={2}>
                                <div className="card p-3 shadow-sm border-primary h-100">
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <span className="text-primary fw-bold mb-1" style={{ fontSize: '12px' }}>Resolved</span>
                                        <span className="fs-5 fw-bold text-dark">{summary.resolved}</span>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={6} sm={4} md={2}>
                                <div className="card p-3 shadow-sm border-primary h-100">
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <span className="text-primary fw-bold mb-1" style={{ fontSize: '12px' }}>Dismissed</span>
                                        <span className="fs-5 fw-bold text-dark">{summary.dismissed}</span>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={6} sm={4} md={2}>
                                <div className="card p-3 shadow-sm border-primary h-100">
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <span className="text-primary fw-bold mb-1" style={{ fontSize: '12px' }}>Spam Phones</span>
                                        <span className="fs-5 fw-bold text-dark">{summary.spam}</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Filters Row */}
                <Card className="shadow-sm border-0 mb-4 rounded-3">
                    <Card.Body className="p-4">
                        <Form onSubmit={handleApplyFilters}>
                            <Row className="g-3 align-items-end">
                                <Col md={3}>
                                    <Form.Label className="fw-semibold text-secondary small">Search Submitter (Name, Phone, Teacher Code)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search Phone, Name, or Code"
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        className="rounded-3"
                                    />
                                </Col>
                                <Col md={2}>
                                    <Form.Label className="fw-semibold text-secondary small">Type Filter</Form.Label>
                                    <Form.Select
                                        value={filters.type}
                                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                        className="rounded-3"
                                    >
                                        <option value="">All Types</option>
                                        <option value="complain">Complaint (অভিযোগ)</option>
                                        <option value="suggestion">Suggestion (পরামর্শ)</option>
                                    </Form.Select>
                                </Col>
                                <Col md={2}>
                                    <Form.Label className="fw-semibold text-secondary small">Status Filter</Form.Label>
                                    <Form.Select
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                        className="rounded-3"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Dismissed">Dismissed</option>
                                        <option value="Spam (Dismissed)">Spam (Dismissed)</option>
                                    </Form.Select>
                                </Col>
                                <Col md={2}>
                                    <Form.Label className="fw-semibold text-secondary small">Spam Status</Form.Label>
                                    <Form.Select
                                        value={filters.isSpam}
                                        onChange={(e) => setFilters({ ...filters, isSpam: e.target.value })}
                                        className="rounded-3"
                                    >
                                        <option value="">All Submissions</option>
                                        <option value="true">Spam Phones Only</option>
                                    </Form.Select>
                                </Col>
                                <Col md={3} className="d-flex gap-2">
                                    <Button variant="success" className="py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center flex-grow-1 fw-bold" type="submit">
                                        <FaSearch className="me-2" /> Search
                                    </Button>
                                    <Button variant="danger" className="py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center flex-grow-1 fw-bold" onClick={handleResetFilters}>
                                        Reset
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <Button variant="success" className="rounded-3 px-3 py-2 fw-semibold" onClick={handleExportCSV}>
                                        Export Data
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Submissions List */}
                <Card className="shadow-sm border-0 rounded-4 list-card">
                    <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <Card.Title className="fw-extrabold text-dark mb-0" style={{ fontSize: '1.25rem' }}>Submissions Trail</Card.Title>
                                <small className="text-muted">Total records found: {totalRecords}</small>
                            </div>
                        </div>

                        <div className="table-responsive rounded-3 shadow-sm" style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table hover striped bordered className="align-middle text-center mb-0 custom-admin-table">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Category</th>
                                        <th>Submitter Details</th>
                                        <th>Teacher Code</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="9" className="py-5">
                                                <div className="d-flex flex-column align-items-center gap-2">
                                                    <Spinner animation="border" variant="primary" />
                                                    <span className="text-muted small fw-semibold">Loading data...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : dataList.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="py-5 text-muted fw-bold">
                                                No complaints or suggestions found.
                                            </td>
                                        </tr>
                                    ) : (
                                        dataList.map((item, index) => (
                                            <tr key={item._id} className={item.isSpam ? 'table-danger' : item.isBest ? 'table-success' : ''}>
                                                <td className="fw-bold text-muted">{(currentPage - 1) * 25 + index + 1}</td>
                                                <td className="fw-semibold text-secondary" style={{ fontSize: '12px' }}>
                                                    {new Date(item.createdAt).toLocaleString('en-GB', {
                                                        day: '2-digit', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit', hour12: true
                                                    })}
                                                </td>
                                                <td>
                                                    {item.type === 'complain' ? (
                                                        <span className="badge bg-soft-danger px-3 py-2 rounded-pill fw-bold text-danger">
                                                            <FaBullhorn /> Complaint
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-soft-success px-3 py-2 rounded-pill fw-bold text-success">
                                                            <FaLightbulb /> Suggestion
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="fw-semibold text-dark" style={{ fontSize: '13px' }}>
                                                    {getCategoryLabel(item.category)}
                                                </td>
                                                <td>
                                                    <div className="text-start">
                                                        <div className="fw-bold">{item.name}</div>
                                                        <div className="text-secondary font-monospace" style={{ fontSize: '12px' }}>
                                                            {item.phone}
                                                        </div>
                                                        <div className="mt-1 d-flex gap-1 flex-wrap">
                                                            {item.isSpam && (
                                                                <Badge bg="danger" className="text-uppercase rounded-pill" style={{ fontSize: '9px' }}>
                                                                    Spam Phone
                                                                </Badge>
                                                            )}
                                                            {item.isBest && (
                                                                <Badge bg="success" className="text-uppercase rounded-pill" style={{ fontSize: '9px' }}>
                                                                    Best Phone
                                                                </Badge>
                                                            )}
                                                            {item.spamCount > 0 && (
                                                                <Badge bg="dark" className="text-uppercase rounded-pill" style={{ fontSize: '9px' }}>
                                                                    Spam Submissions: {item.spamCount}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="fw-bold font-monospace text-primary">{item.teacherCode || '-'}</span>
                                                </td>
                                                <td className="text-start text-muted" style={{ maxWidth: '300px', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.description}>
                                                    {item.description}
                                                </td>
                                                <td>
                                                    <Badge bg={
                                                        item.status === 'Pending' ? 'warning' :
                                                        item.status === 'In Progress' ? 'info' :
                                                        item.status === 'Resolved' ? 'success' :
                                                        item.status === 'Spam (Dismissed)' ? 'danger' : 'secondary'
                                                    } className="px-3 py-2 rounded-pill">
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        {role === 'superadmin' && (
                                                            <>
                                                                <Button variant="outline-primary" size="sm" className="rounded-circle" onClick={() => openEditModal(item)} title="Edit Status">
                                                                    <FaEdit size={12} />
                                                                </Button>
                                                                <Button variant="outline-danger" size="sm" className="rounded-circle" onClick={() => handleDelete(item._id)} title="Delete">
                                                                    <FaTrash size={12} />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
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

            {/* Edit Status Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title className="fw-bold">
                        Review {selectedItem?.type === 'complain' ? 'Complaint' : 'Suggestion'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedItem && (
                        <>
                            <Row className="mb-3 pb-3 border-bottom">
                                <Col md={6}>
                                    <div className="text-secondary small fw-bold text-uppercase">Submitter</div>
                                    <div className="fw-bold fs-5 text-dark">{selectedItem.name}</div>
                                    <div className="font-monospace text-secondary">{selectedItem.phone}</div>
                                    <div className="mt-1">
                                        {selectedItem.isSpam && <Badge bg="danger" className="me-1">Spam Phone</Badge>}
                                        {selectedItem.isBest && <Badge bg="success">Best Phone</Badge>}
                                    </div>
                                </Col>
                                <Col md={6} className="border-start">
                                    <div className="text-secondary small fw-bold text-uppercase">Teacher Code</div>
                                    <div className="fw-bold fs-5 text-primary">{selectedItem.teacherCode || 'N/A'}</div>
                                    <div className="text-secondary small fw-bold text-uppercase mt-2">Category</div>
                                    <div className="fw-bold text-dark">{getCategoryLabel(selectedItem.category)}</div>
                                </Col>
                            </Row>
                            <div className="mb-4">
                                <div className="text-secondary small fw-bold text-uppercase mb-1">Details Description</div>
                                <div className="p-3 bg-light rounded-3 text-dark fs-6" style={{ whiteSpace: 'pre-wrap' }}>
                                    {selectedItem.description}
                                </div>
                            </div>
                            <hr />
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-secondary">Update Status</Form.Label>
                                    <Form.Select
                                        value={statusUpdate}
                                        onChange={(e) => setStatusUpdate(e.target.value)}
                                        className="rounded-3 py-2"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Dismissed">Dismissed</option>
                                        <option value="Spam (Dismissed)">Spam (Dismissed)</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-secondary">Admin Comment / Actions Taken</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Describe the solution or action taken regarding this complain/suggestion..."
                                        value={adminComment}
                                        onChange={(e) => setAdminComment(e.target.value)}
                                        className="rounded-3"
                                    />
                                </Form.Group>
                            </Form>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <Button variant="secondary" className="rounded-pill px-4" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" className="rounded-pill px-4" onClick={handleUpdateStatus} disabled={updating}>
                        {updating ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer />
        </>
    );
};

export default ComplaintSuggestionAdminPage;

const StyledContainer = styled(Container)`
  padding: 30px;
  background: #f8fafc;
  min-height: 100vh;
  
  .fw-extrabold {
    font-weight: 800;
  }

  .bg-soft-danger {
    background-color: #fef2f2;
    color: #991b1b;
    border: 1px solid #fee2e2;
  }

  .bg-soft-success {
    background-color: #f0fdf4;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  .custom-admin-table {
    border: 1px solid #e2e8f0;
  }

  .custom-admin-table th {
    font-weight: 700;
    font-size: 13.5px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 14px;
  }

  .custom-admin-table td {
    padding: 14px;
    font-size: 14px;
    border-color: #e2e8f0;
  }
`;
