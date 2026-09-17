import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Form, Row, Col, Spinner, Badge, Modal, Card, Pagination } from 'react-bootstrap';
import { 
    FaSearch, 
    FaUndo, 
    FaEdit, 
    FaTrashAlt, 
    FaWhatsapp, 
    FaCalendarAlt, 
    FaChevronLeft, 
    FaChevronRight, 
    FaBell,
    FaInfoCircle,
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
    const limit = 15;

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
                    limit,
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

    // Open Add Standalone modal
    const handleOpenCreateSc = () => {
        setScEditingId(null);
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
        setScFormOpen(true);
    };

    // Open Edit modal
    const handleOpenEditSc = (sc) => {
        setScEditingId(sc._id);
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
            status: sc.status || 'completed'
        });
        setScFormOpen(true);
    };

    // Save Create / Edit
    const handleSaveStandaloneSc = async (e) => {
        e.preventDefault();
        try {
            const username = localStorage.getItem('username') || 'Admin';
            if (scEditingId) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/serviceCharge/edit/${scEditingId}`, {
                    ...scFormData,
                    updatedBy: username
                });
                toast.success("Service charge updated successfully!");
            } else {
                await axios.post(`https://tuition-seba-backend-1.onrender.com/api/serviceCharge/add`, {
                    ...scFormData,
                    createdBy: username
                });
                toast.success("Service charge added successfully!");
            }
            setScFormOpen(false);
            fetchServiceCharges(scCurrentPage);
            fetchServiceChargeSummary();
        } catch (err) {
            console.error('Save service charge error:', err);
            toast.error(err.response?.data?.message || "Failed to save service charge.");
        }
    };

    // Delete Standalone
    const handleDeleteSc = async (id) => {
        if (window.confirm("Are you sure you want to delete this service charge record?")) {
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/serviceCharge/delete/${id}`);
                toast.success("Service charge deleted successfully!");
                fetchServiceCharges(scCurrentPage);
                fetchServiceChargeSummary();
            } catch (err) {
                console.error('Delete service charge error:', err);
                toast.error("Failed to delete record.");
            }
        }
    };

    // Toggle "To Be Paid Today" filter
    const handleToggleToBePaidToday = () => {
        const nextVal = !scSearch.toBePaidToday;
        const newSearch = { ...scSearch, toBePaidToday: nextVal };
        setScSearch(newSearch);
        fetchServiceCharges(1, newSearch);
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
    };

    return (
        <>
            <NavBarPage />
            <Container>
                {/* Header Section */}
                <Header>
                    <h2 className='text-primary fw-bold mb-0'>Service Charges</h2>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={handleOpenCreateSc} className="rounded-3 shadow-sm px-4">
                            + Add Service Charge
                        </Button>
                    </div>
                </Header>

                {/* Summary Cards */}
                <Card className="mt-4 shadow-sm border-0">
                    <Card.Body>
                        <div className="d-flex flex-nowrap overflow-auto gap-2 pb-2 text-center" style={{ scrollbarWidth: 'thin' }}>
                            {[
                                { label: 'Today', count: `${scSummary.today?.toLocaleString() || 0} ৳`, color: 'primary' },
                                { label: 'This Week', count: `${scSummary.week?.toLocaleString() || 0} ৳`, color: 'info' },
                                { label: 'This Month', count: `${scSummary.month?.toLocaleString() || 0} ৳`, color: 'success' },
                                { label: 'Total', count: `${scSummary.total?.toLocaleString() || 0} ৳`, color: 'dark' },
                                { label: 'To Be Paid Today', count: `${scSummary.toBePaidTodayCount || 0}`, color: 'warning' }
                            ].map((stat, idx) => (
                                <div 
                                    key={idx} 
                                    className={`card p-2 shadow-sm border-${stat.color} flex-fill`} 
                                    style={{ 
                                        minWidth: '130px', 
                                        cursor: stat.label === 'To Be Paid Today' ? 'pointer' : 'default',
                                        backgroundColor: stat.label === 'To Be Paid Today' && scSearch.toBePaidToday ? '#fff3cd' : 'inherit'
                                    }}
                                    onClick={stat.label === 'To Be Paid Today' ? handleToggleToBePaidToday : undefined}
                                    title={stat.label === 'To Be Paid Today' ? "Click to filter service charges to be paid today" : ""}
                                >
                                    <small className={`text-${stat.color} fw-bold text-nowrap`}>
                                        {stat.label === 'To Be Paid Today' && <FaCalendarAlt className="me-1" />}
                                        {stat.label}
                                    </small>
                                    <h5 className="mb-0">{stat.count}</h5>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>

                {/* Search & Filter Bar */}
                <Card className="mt-4 shadow-sm border-0">
                    <Card.Body>
                        <Row className="g-3 align-items-end">
                            <Col md={3}>
                                <Form.Label className="fw-bold small">Tuition Code</Form.Label>
                                <Form.Control
                                    placeholder="Search Tuition Code"
                                    value={scSearch.tuitionCode}
                                    onChange={(e) => setScSearch(prev => ({ ...prev, tuitionCode: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchServiceCharges(1)}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label className="fw-bold small">Phone Number</Form.Label>
                                <Form.Control
                                    placeholder="Search Phone"
                                    value={scSearch.phone}
                                    onChange={(e) => setScSearch(prev => ({ ...prev, phone: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchServiceCharges(1)}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label className="fw-bold small">Status</Form.Label>
                                <Form.Select
                                    value={scSearch.status}
                                    onChange={(e) => {
                                        const newStatus = e.target.value;
                                        const newSearch = { ...scSearch, status: newStatus };
                                        setScSearch(newSearch);
                                        fetchServiceCharges(1, newSearch);
                                    }}
                                >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </Form.Select>
                            </Col>
                            <Col md={3} className="d-flex gap-2">
                                <Button variant="primary" onClick={() => fetchServiceCharges(1)} className="flex-grow-1">
                                    <FaSearch className="me-1" /> Search
                                </Button>
                                <Button variant="outline-secondary" onClick={() => {
                                    const reset = { tuitionCode: '', phone: '', status: '', toBePaidToday: false };
                                    setScSearch(reset);
                                    fetchServiceCharges(1, reset);
                                }}>
                                    <FaUndo />
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* To be done today notification */}
                <div className="d-flex align-items-center justify-content-center mt-3">
                    <h5 className="me-3 d-flex align-items-center gap-2 mb-0">
                        <FaBell className="text-primary" />
                        <span>Service charges to be paid today: {scSummary.toBePaidTodayCount || 0}</span>
                        <Button 
                            size="sm" 
                            variant={scSearch.toBePaidToday ? "warning" : "outline-primary"} 
                            onClick={handleToggleToBePaidToday} 
                            className="ms-2"
                        >
                            <FaInfoCircle className="me-1" />
                            {scSearch.toBePaidToday ? "Showing Today (Click to Reset)" : "Filter Today"}
                        </Button>
                    </h5>
                </div>

                {/* Table Section */}
                <Card className="mt-3 shadow-sm border-0">
                    <Card.Body className="p-0">
                        <div style={{ maxHeight: "700px", overflowY: "auto" }}>
                            <Table striped hover responsive className="mb-0">
                                <thead className="table-primary sticky-top">
                                    <tr>
                                        <th>SL</th>
                                        <th>Date</th>
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
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scLoading ? (
                                        <tr>
                                            <td colSpan="13" className="text-center py-5">
                                                <Spinner animation="border" variant="primary" />
                                            </td>
                                        </tr>
                                    ) : scList.length === 0 ? (
                                        <tr>
                                            <td colSpan="13" className="text-center py-4">No records found.</td>
                                        </tr>
                                    ) : (
                                        scList.map((sc, index) => (
                                            <tr key={sc._id} className={sc.status === 'completed' ? 'table-success' : ''}>
                                                <td>{(scCurrentPage - 1) * limit + index + 1}</td>
                                                <td className="small text-nowrap">{formatDateOnly(sc.date)}</td>
                                                <td className="fw-bold text-nowrap" style={{ color: sc.status === 'completed' ? '#155724' : '#0d6efd' }}>
                                                    {formatDateOnly(sc.nextPaymentDate)}
                                                </td>
                                                <td><span className="fw-bold text-primary">{sc.tuitionCode || '-'}</span></td>
                                                <td>{sc.name || '-'}</td>
                                                <td>{sc.personalPhone || sc.paymentNumber || '-'}</td>
                                                <td className="fw-bold text-dark">৳{sc.amount}</td>
                                                <td>{sc.createdBy || '-'}</td>
                                                <td>{sc.updatedBy || '-'}</td>
                                                <td className="small text-muted" style={{ maxWidth: '180px' }}>{sc.comment || '-'}</td>
                                                <td className="small text-muted" style={{ maxWidth: '180px' }}>{sc.nextComment || '-'}</td>
                                                <td className="text-center">
                                                    <span className={`badge ${
                                                        (sc.status || 'completed') === 'completed' ? 'bg-success' :
                                                        (sc.status || 'completed') === 'pending' ? 'bg-warning text-dark' :
                                                        (sc.status || 'completed') === 'cancelled' ? 'bg-secondary' :
                                                        'bg-light text-dark'
                                                    }`}>
                                                        {sc.status || 'completed'}
                                                    </span>
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
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>

                {/* Pagination Controls */}
                {!scLoading && scTotalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination className="pagination-rounded-pill">
                            <Pagination.Prev
                                onClick={() => fetchServiceCharges(scCurrentPage - 1)}
                                disabled={scCurrentPage === 1}
                            >
                                <FaChevronLeft className="me-1" /> Prev
                            </Pagination.Prev>

                            {[...Array(scTotalPages)].map((_, i) => {
                                const page = i + 1;
                                if (page === 1 || page === scTotalPages || (page >= scCurrentPage - 2 && page <= scCurrentPage + 2)) {
                                    return (
                                        <Pagination.Item
                                            key={page}
                                            active={page === scCurrentPage}
                                            onClick={() => fetchServiceCharges(page)}
                                        >
                                            {page}
                                        </Pagination.Item>
                                    );
                                } else if (page === scCurrentPage - 3 || page === scCurrentPage + 3) {
                                    return <Pagination.Ellipsis key={page} />;
                                }
                                return null;
                            })}

                            <Pagination.Next
                                onClick={() => fetchServiceCharges(scCurrentPage + 1)}
                                disabled={scCurrentPage === scTotalPages}
                            >
                                Next <FaChevronRight className="ms-1" />
                            </Pagination.Next>
                        </Pagination>
                    </div>
                )}

                {/* Create/Edit Service Charge Modal */}
                <Modal show={scFormOpen} onHide={() => setScFormOpen(false)} centered size="lg">
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fw-bold ps-2">
                            {scEditingId ? "Edit Service Charge" : "Add Standalone Service Charge"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4" style={{ backgroundColor: '#fdfdfd' }}>
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
            </Container>
        </>
    );
};

export default ServiceChargePage;

// Styled Components
const Container = styled.div`
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;

  .pagination-rounded-pill .page-item .page-link {
    border-radius: 50px;
    margin: 0 4px;
    border: none;
    padding: 8px 16px;
    font-weight: 600;
    color: #444;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .pagination-rounded-pill .page-item.active .page-link {
    background-color: #0d6efd;
    color: white;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
