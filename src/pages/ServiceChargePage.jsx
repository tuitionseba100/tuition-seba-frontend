import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Form, Row, Col, Spinner, Badge, Modal } from 'react-bootstrap';
import { 
    FaSearch, 
    FaUndo, 
    FaEdit, 
    FaTrashAlt, 
    FaWhatsapp, 
    FaCalendarAlt, 
    FaChevronLeft, 
    FaChevronRight, 
    FaPlus, 
    FaFileInvoiceDollar 
} from 'react-icons/fa';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components';
import NavBarPage from './NavbarPage';
import WhatsAppServiceChargeModal from '../components/modals/WhatsAppServiceChargeModal';

const ServiceChargePage = () => {
    // List & pagination state
    const [scList, setScList] = useState([]);
    const [scLoading, setScLoading] = useState(false);
    const [scCurrentPage, setScCurrentPage] = useState(1);
    const [scTotalPages, setScTotalPages] = useState(1);
    const [scTotalRecords, setScTotalRecords] = useState(0);

    // Summary statistics state
    const [scSummary, setScSummary] = useState({
        today: 0,
        week: 0,
        month: 0,
        total: 0,
        toBePaidTodayCount: 0
    });

    // Search & Filter state
    const [scSearch, setScSearch] = useState({
        tuitionCode: '',
        phone: '',
        status: '',
        toBePaidToday: false
    });

    // Standalone Create/Edit Form modal state
    const [scFormOpen, setScFormOpen] = useState(false);
    const [scEditingId, setScEditingId] = useState(null);
    const [scFormData, setScFormData] = useState({
        tuitionCode: '',
        name: '',
        paymentNumber: '',
        personalPhone: '',
        amount: '',
        comment: '',
        nextComment: '',
        date: new Date().toISOString().split('T')[0],
        nextPaymentDate: '',
        status: ''
    });

    // WhatsApp share modal state
    const [showWhatsAppScModal, setShowWhatsAppScModal] = useState(false);
    const [whatsAppSc, setWhatsAppSc] = useState(null);

    const handleOpenWhatsAppSc = (sc) => {
        setWhatsAppSc(sc);
        setShowWhatsAppScModal(true);
    };

    // Fetch service charges list
    const fetchServiceCharges = useCallback(async (page = 1, searchOverride = null) => {
        setScLoading(true);
        try {
            const filters = searchOverride !== null ? searchOverride : scSearch;
            const response = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/serviceCharge/all`, {
                params: {
                    page,
                    limit: 15,
                    tuitionCode: filters.tuitionCode,
                    phone: filters.phone,
                    status: filters.status,
                    toBePaidToday: filters.toBePaidToday
                }
            });
            setScList(response.data.data || []);
            setScTotalPages(response.data.totalPages || 1);
            setScCurrentPage(response.data.currentPage || 1);
            setScTotalRecords(response.data.totalRecords || 0);
        } catch (err) {
            console.error('Error fetching service charges:', err);
            toast.error("Failed to fetch service charges.");
        } finally {
            setScLoading(false);
        }
    }, [scSearch]);

    // Fetch summary statistics
    const fetchServiceChargeSummary = async () => {
        try {
            const response = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/serviceCharge/summary`);
            if (response.data) {
                setScSummary(response.data);
            }
        } catch (err) {
            console.error('Error fetching service charge summary:', err);
        }
    };

    useEffect(() => {
        fetchServiceCharges(1);
        fetchServiceChargeSummary();
    }, [fetchServiceCharges]);

    const handleToggleToBePaidToday = () => {
        const nextVal = !scSearch.toBePaidToday;
        const newSearch = { ...scSearch, toBePaidToday: nextVal };
        setScSearch(newSearch);
        fetchServiceCharges(1, newSearch);
    };

    const handleOpenCreateSc = () => {
        setScFormData({
            tuitionCode: '',
            name: '',
            paymentNumber: '',
            personalPhone: '',
            amount: '',
            comment: '',
            nextComment: '',
            date: new Date().toISOString().split('T')[0],
            nextPaymentDate: '',
            status: ''
        });
        setScEditingId(null);
        setScFormOpen(true);
    };

    const handleOpenEditSc = (sc) => {
        setScFormData({
            tuitionCode: sc.tuitionCode || '',
            name: sc.name || '',
            paymentNumber: sc.paymentNumber || '',
            personalPhone: sc.personalPhone || '',
            amount: sc.amount || '',
            comment: sc.comment || '',
            nextComment: sc.nextComment || '',
            date: sc.date ? sc.date.split('T')[0] : '',
            nextPaymentDate: sc.nextPaymentDate ? sc.nextPaymentDate.split('T')[0] : '',
            status: sc.status || 'pending'
        });
        setScEditingId(sc._id);
        setScFormOpen(true);
    };

    const handleSaveStandaloneSc = async (e) => {
        if (e) e.preventDefault();
        
        if (!scFormData.tuitionCode || !scFormData.name || !scFormData.personalPhone || !scFormData.amount || !scFormData.date) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const username = localStorage.getItem('username') || 'Admin';
        const headers = { 'x-user-name': username };

        try {
            if (scEditingId) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/serviceCharge/edit/${scEditingId}`, scFormData, { headers });
                toast.success("Service charge updated successfully!");
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/serviceCharge/add', scFormData, { headers });
                toast.success("Service charge added successfully!");
            }
            setScFormOpen(false);
            fetchServiceCharges(scCurrentPage);
            fetchServiceChargeSummary();
        } catch (err) {
            console.error('Error saving standalone service charge:', err);
            toast.error(err.response?.data?.message || "Failed to save service charge.");
        }
    };

    const handleDeleteSc = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service charge?")) return;

        const username = localStorage.getItem('username') || 'Admin';
        const headers = { 'x-user-name': username };

        try {
            await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/serviceCharge/delete/${id}`, { headers });
            toast.success("Service charge deleted successfully!");
            fetchServiceCharges(scCurrentPage);
            fetchServiceChargeSummary();
        } catch (err) {
            console.error('Error deleting service charge:', err);
            toast.error("Failed to delete service charge.");
        }
    };

    return (
        <>
            <NavBarPage />
            <PageWrapper>
                {/* Header Section */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                    <div>
                        <h3 className="fw-bold text-dark d-flex align-items-center gap-2 mb-1">
                            <FaFileInvoiceDollar className="text-primary" />
                            <span>Service Charge Management</span>
                        </h3>
                        <p className="text-muted small mb-0">
                            Track, collect, and manage service charges from registered teachers
                        </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <Button
                            variant={scSearch.toBePaidToday ? "warning" : "outline-warning"}
                            className="fw-bold d-flex align-items-center gap-1.5 shadow-sm text-dark px-3 py-2"
                            style={scSearch.toBePaidToday ? { backgroundColor: '#ffc107', borderColor: '#ffc107' } : {}}
                            onClick={handleToggleToBePaidToday}
                        >
                            <FaCalendarAlt />
                            <span>{scSearch.toBePaidToday ? "Showing: To Be Paid Today" : "To Be Paid Today"}</span>
                            {scSummary?.toBePaidTodayCount !== undefined && (
                                <Badge bg={scSearch.toBePaidToday ? "dark" : "danger"} className="ms-1">
                                    {scSummary.toBePaidTodayCount}
                                </Badge>
                            )}
                        </Button>
                        <Button variant="primary" className="fw-bold d-flex align-items-center gap-1.5 shadow-sm px-3 py-2" onClick={handleOpenCreateSc}>
                            <FaPlus /> <span>Add Service Charge</span>
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="d-flex flex-nowrap overflow-auto gap-3 pb-3 mb-4" style={{ scrollbarWidth: 'thin' }}>
                    {[
                        { label: 'Today Paid', count: `৳${scSummary.today?.toLocaleString() || 0}`, color: '#2563eb', bg: '#eff6ff' },
                        { label: 'This Week Paid', count: `৳${scSummary.week?.toLocaleString() || 0}`, color: '#0284c7', bg: '#f0f9ff' },
                        { label: 'This Month Paid', count: `৳${scSummary.month?.toLocaleString() || 0}`, color: '#059669', bg: '#ecfdf5' },
                        { label: 'Total Paid', count: `৳${scSummary.total?.toLocaleString() || 0}`, color: '#334155', bg: '#f8fafc' },
                        {
                            label: 'To Be Paid Today',
                            count: `${scSummary.toBePaidTodayCount || 0} Records`,
                            color: '#d97706',
                            bg: scSearch.toBePaidToday ? '#fef3c7' : '#fffbeb',
                            isToBePaid: true,
                            active: scSearch.toBePaidToday
                        }
                    ].map((stat, idx) => (
                        <StatCard
                            key={idx}
                            style={{
                                background: stat.bg,
                                borderColor: stat.active ? '#d97706' : '#e2e8f0',
                                cursor: stat.isToBePaid ? 'pointer' : 'default'
                            }}
                            onClick={stat.isToBePaid ? handleToggleToBePaidToday : undefined}
                            title={stat.isToBePaid ? "Click to toggle service charges to be paid today" : ""}
                        >
                            <div className="stat-label" style={{ color: stat.color }}>
                                {stat.isToBePaid && <FaCalendarAlt size={12} className="me-1" />}
                                {stat.label}
                            </div>
                            <div className="stat-value">{stat.count}</div>
                        </StatCard>
                    ))}
                </div>

                {/* Search & Filter Card */}
                <div className="card shadow-sm border-0 mb-4 p-3 rounded-3 bg-white">
                    <Row className="g-2 align-items-center">
                        <Col md={3}>
                            <Form.Label className="small text-muted fw-bold mb-1">Tuition Code</Form.Label>
                            <Form.Control
                                placeholder="Search by Tuition Code"
                                value={scSearch.tuitionCode}
                                onChange={(e) => setScSearch(prev => ({ ...prev, tuitionCode: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && fetchServiceCharges(1)}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label className="small text-muted fw-bold mb-1">Phone Number</Form.Label>
                            <Form.Control
                                placeholder="Search by Phone"
                                value={scSearch.phone}
                                onChange={(e) => setScSearch(prev => ({ ...prev, phone: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && fetchServiceCharges(1)}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label className="small text-muted fw-bold mb-1">Payment Status</Form.Label>
                            <Form.Select
                                value={scSearch.status}
                                onChange={(e) => {
                                    const newStatus = e.target.value;
                                    const newSearch = { ...scSearch, status: newStatus };
                                    setScSearch(newSearch);
                                    fetchServiceCharges(1, newSearch);
                                }}
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </Form.Select>
                        </Col>
                        <Col md={3} className="d-flex gap-2 align-items-end mt-3 mt-md-0">
                            <Button variant="primary" className="w-100 fw-semibold d-flex align-items-center justify-content-center gap-1.5" onClick={() => fetchServiceCharges(1)}>
                                <FaSearch /> <span>Search</span>
                            </Button>
                            <Button variant="outline-secondary" className="w-100 fw-semibold d-flex align-items-center justify-content-center gap-1.5" onClick={() => {
                                const reset = { tuitionCode: '', phone: '', status: '', toBePaidToday: false };
                                setScSearch(reset);
                                fetchServiceCharges(1, reset);
                            }}>
                                <FaUndo /> <span>Reset</span>
                            </Button>
                        </Col>
                    </Row>
                </div>

                {/* Table Section */}
                <div className="card shadow-sm border-0 rounded-3 bg-white overflow-hidden">
                    <div className="card-header bg-white py-3 px-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <span className="fw-bold text-dark">
                            Service Charge Records ({scTotalRecords})
                        </span>
                        {scSearch.toBePaidToday && (
                            <Badge bg="warning" text="dark" className="fw-bold px-2 py-1">
                                Filtered: To Be Paid Today
                            </Badge>
                        )}
                    </div>
                    {scLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <div className="mt-2 text-muted small">Loading records...</div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table responsive hover className="align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-3">Date</th>
                                        <th>Next Payment Date</th>
                                        <th>Tuition Code</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Amount</th>
                                        <th>Created By</th>
                                        <th>Updated By</th>
                                        <th>Last Comment</th>
                                        <th>Next Comment</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-center px-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scList.length > 0 ? scList.map(sc => (
                                        <tr key={sc._id}>
                                            <td className="px-3 text-nowrap">{sc.date ? new Date(sc.date).toLocaleDateString() : '-'}</td>
                                            <td className="text-nowrap">{sc.nextPaymentDate ? new Date(sc.nextPaymentDate).toLocaleDateString() : '-'}</td>
                                            <td><span className="fw-bold text-primary">{sc.tuitionCode || '-'}</span></td>
                                            <td>{sc.name || '-'}</td>
                                            <td>{sc.personalPhone || '-'}</td>
                                            <td className="fw-bold text-dark">৳{sc.amount}</td>
                                            <td>{sc.createdBy || '-'}</td>
                                            <td>{sc.updatedBy || '-'}</td>
                                            <td className="small text-muted" style={{ maxWidth: '180px' }}>{sc.comment || '-'}</td>
                                            <td className="small text-muted" style={{ maxWidth: '180px' }}>{sc.nextComment || '-'}</td>
                                            <td className="text-center">
                                                <Badge bg={
                                                    (sc.status || 'completed') === 'completed' ? 'success' :
                                                    (sc.status || 'completed') === 'cancelled' ? 'secondary' :
                                                    'warning'
                                                } className="text-uppercase" style={{ fontSize: '0.78rem' }}>
                                                    {sc.status || 'completed'}
                                                </Badge>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <Button variant="warning" size="sm" onClick={() => handleOpenEditSc(sc)} title="Edit">
                                                        <FaEdit />
                                                    </Button>
                                                    <Button variant="danger" size="sm" onClick={() => handleDeleteSc(sc._id)} title="Delete">
                                                        <FaTrashAlt />
                                                    </Button>
                                                    <Button variant="success" size="sm" onClick={() => handleOpenWhatsAppSc(sc)} title="Share via WhatsApp">
                                                        <FaWhatsapp />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="12" className="text-center py-5 text-muted">
                                                <FaFileInvoiceDollar size={32} className="text-muted opacity-50 mb-2" />
                                                <div>No service charges found.</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    {/* Pagination Footer */}
                    <div className="card-footer bg-white d-flex justify-content-between align-items-center p-3 border-top">
                        <div className="small text-muted">
                            Showing Page <strong>{scCurrentPage}</strong> of <strong>{scTotalPages || 1}</strong> ({scTotalRecords} records)
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled={scCurrentPage === 1 || scLoading}
                                onClick={() => fetchServiceCharges(scCurrentPage - 1)}
                            >
                                <FaChevronLeft /> Prev
                            </Button>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled={scCurrentPage >= scTotalPages || scLoading}
                                onClick={() => fetchServiceCharges(scCurrentPage + 1)}
                            >
                                Next <FaChevronRight />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Create/Edit Service Charge Modal */}
                <Modal show={scFormOpen} onHide={() => setScFormOpen(false)} centered size="lg">
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="fw-bold">
                            {scEditingId ? "Edit Service Charge" : "Add Standalone Service Charge"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                        <Form onSubmit={handleSaveStandaloneSc}>
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Tuition Code *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            required
                                            placeholder="e.g. T-1024"
                                            value={scFormData.tuitionCode}
                                            onChange={(e) => setScFormData({ ...scFormData, tuitionCode: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Teacher Name *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            required
                                            placeholder="Teacher Name"
                                            value={scFormData.name}
                                            onChange={(e) => setScFormData({ ...scFormData, name: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Personal Phone Number *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            required
                                            placeholder="01XXXXXXXXX"
                                            value={scFormData.personalPhone}
                                            onChange={(e) => setScFormData({ ...scFormData, personalPhone: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Payment / Bkash Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="01XXXXXXXXX"
                                            value={scFormData.paymentNumber}
                                            onChange={(e) => setScFormData({ ...scFormData, paymentNumber: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Amount (BDT) *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            required
                                            placeholder="Amount in BDT"
                                            value={scFormData.amount}
                                            onChange={(e) => setScFormData({ ...scFormData, amount: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Payment Date *</Form.Label>
                                        <Form.Control
                                            type="date"
                                            required
                                            value={scFormData.date}
                                            onChange={(e) => setScFormData({ ...scFormData, date: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Status</Form.Label>
                                        <Form.Select
                                            value={scFormData.status}
                                            onChange={(e) => setScFormData({ ...scFormData, status: e.target.value })}
                                        >
                                            <option value="">Default (Completed)</option>
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Last Comment / Notes</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            placeholder="Add last comment / notes..."
                                            value={scFormData.comment}
                                            onChange={(e) => setScFormData({ ...scFormData, comment: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Next Payment Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={scFormData.nextPaymentDate || ''}
                                            onChange={(e) => setScFormData({ ...scFormData, nextPaymentDate: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Next Comment / Follow-up Notes</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            placeholder="Add follow-up notes..."
                                            value={scFormData.nextComment || ''}
                                            onChange={(e) => setScFormData({ ...scFormData, nextComment: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button variant="secondary" onClick={() => setScFormOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit">
                                    {scEditingId ? "Save Changes" : "Create Service Charge"}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* WhatsApp Share Modal */}
                <WhatsAppServiceChargeModal
                    show={showWhatsAppScModal}
                    onHide={() => setShowWhatsAppScModal(false)}
                    sc={whatsAppSc}
                />

                <ToastContainer />
            </PageWrapper>
        </>
    );
};

export default ServiceChargePage;

// Styled Components
const PageWrapper = styled.div`
  padding: 24px;
  background: #f8f9fa;
  min-height: calc(100vh - 60px);
`;

const StatCard = styled.div`
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  min-width: 170px;
  flex: 1;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }

  .stat-label {
    font-size: 0.8rem;
    font-weight: 700;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f172a;
  }
`;
