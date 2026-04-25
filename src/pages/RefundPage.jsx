import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card, Spinner, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaWhatsapp, FaSearch, FaUndo, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import WhatsAppRefundModal from '../components/modals/WhatsAppRefundModal';

const RefundPage = () => {
    const [refundList, setRefundList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [refundData, setRefundData] = useState({
        tuitionCode: '',
        paymentType: '',
        paymentNumber: '',
        personalPhone: '',
        amount: '',
        name: '',
        note: '',
        comment: '',
        status: '',
        commentFromAgent: '',
        returnDate: ''
    });

    // Pagination & Search States
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const limit = 20;

    const [searchInputs, setSearchInputs] = useState({
        tuitionCode: '',
        paymentNumber: '',
        personalPhone: '',
        status: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        tuitionCode: '',
        paymentNumber: '',
        personalPhone: '',
        status: ''
    });

    const [statusCounts, setStatusCounts] = useState({
        total: 0,
        pending: 0,
        underReview: 0,
        approved: 0,
        rejected: 0,
        completed: 0,
        cancelled: 0
    });

    const role = localStorage.getItem('role');

    // WhatsApp share modal state
    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
    const [whatsAppRefund, setWhatsAppRefund] = useState(null);

    const handleOpenWhatsApp = (refund) => {
        setWhatsAppRefund(refund);
        setShowWhatsAppModal(true);
    };

    const fetchRefundApplyRecords = useCallback(async (page = 1, filters = appliedFilters) => {
        setLoading(true);
        try {
            const params = {
                page,
                limit,
                tuitionCode: filters.tuitionCode,
                paymentNumber: filters.paymentNumber,
                personalPhone: filters.personalPhone,
                status: filters.status
            };
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/refund/all', { params });
            setRefundList(response.data.data);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
            setTotalRecords(response.data.totalRecords);
        } catch (err) {
            console.error('Error:', err);
            toast.error("Failed to fetch records.");
        }
        setLoading(false);
    }, [appliedFilters]);

    const fetchSummaryCounts = async () => {
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/refund/summary');
            setStatusCounts(response.data);
        } catch (err) {
            console.error('Error fetching summary:', err);
        }
    };

    useEffect(() => {
        fetchRefundApplyRecords(1);
        fetchSummaryCounts();
    }, [fetchRefundApplyRecords]);

    const handleSearchInputChange = (e) => {
        const { name, value } = e.target;
        setSearchInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        setAppliedFilters(searchInputs);
        setCurrentPage(1);
        fetchRefundApplyRecords(1, searchInputs);
    };

    const handleResetFilters = () => {
        const resetState = {
            tuitionCode: '',
            paymentNumber: '',
            personalPhone: '',
            status: ''
        };
        setSearchInputs(resetState);
        setAppliedFilters(resetState);
        setCurrentPage(1);
        fetchRefundApplyRecords(1, resetState);
    };

    const handlePageChange = (pageNumber) => {
        fetchRefundApplyRecords(pageNumber);
    };

    const handleExportToExcel = async () => {
        // For export, we might want to fetch ALL data based on current filters but without limit
        // Or just export the current filtered list if we add an export-all endpoint
        setLoading(true);
        try {
            const params = {
                tuitionCode: appliedFilters.tuitionCode,
                paymentNumber: appliedFilters.paymentNumber,
                personalPhone: appliedFilters.personalPhone,
                status: appliedFilters.status,
                limit: 10000 // Large limit for export
            };
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/refund/all', { params });
            const allFilteredData = response.data.data;

            const now = new Date();
            const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
            const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');
            const fileName = `Refund List_${formattedDate}_${formattedTime}`;

            const tableHeaders = [
                "Applied At", "Status", "Tuition Code", "Created By", "Updated By",
                "Payment Number Type", "Payment Number", "Name", "Return Amount",
                "Return Date", "Personal Phone", "Comment (Teacher)", "Comment From Agent"
            ];

            const tableData = allFilteredData.map(item => [
                item.requestedAt ? formatDate(item.requestedAt) : "",
                String(item.status ?? ""),
                String(item.tuitionCode ?? ""),
                String(item.createdBy ?? ""),
                String(item.updatedBy ?? ""),
                String(item.paymentType ?? ""),
                String(item.paymentNumber ?? ""),
                String(item.name ?? ""),
                String(item.amount ?? ""),
                String(item.returnDate ?? ""),
                String(item.personalPhone ?? ""),
                String(item.note ?? ""),
                String(item.commentFromAgent ?? "")
            ]);

            const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Refund Applications");
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
            toast.success("Export successful!");
        } catch (err) {
            console.error('Export Error:', err);
            toast.error("Export failed.");
        }
        setLoading(false);
    };

    const handleSaveRequest = async () => {
        const username = localStorage.getItem('username');
        const updatedTuitionData = {
            ...refundData,
            status: refundData.status ? refundData.status : "pending"
        };
        try {
            if (editingId) {
                const updatedData = { ...updatedTuitionData, updatedBy: username };
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/refund/edit/${editingId}`, updatedData);
                toast.success("Refund record updated successfully!");
            } else {
                const newData = { ...updatedTuitionData, createdBy: username };
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/refund/add', newData);
                toast.success("Refund record added successfully!");
            }
            setShowModal(false);
            fetchRefundApplyRecords(currentPage);
            fetchSummaryCounts();
        } catch (err) {
            console.error('Error:', err);
            toast.error("Operation failed.");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const optionsDate = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };
        return `${new Intl.DateTimeFormat('en-GB', optionsDate).format(date)} || ${new Intl.DateTimeFormat('en-GB', optionsTime).format(date)}`;
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
    };

    const handleEditApply = (data) => {
        setRefundData({
            ...data,
            returnDate: data.returnDate ? data.returnDate.split('T')[0] : ''
        });
        setEditingId(data._id);
        setShowModal(true);
    };

    const handleDeleteRecord = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/refund/delete/${id}`);
                toast.success("Record deleted successfully!");
                fetchRefundApplyRecords(currentPage);
                fetchSummaryCounts();
            } catch (err) {
                console.error('Error:', err);
                toast.error("Deletion failed.");
            }
        }
    };

    return (
        <>
            <NavBarPage />
            <Container>
                <Header>
                    <h2 className='text-primary fw-bold'>Refund Applications</h2>
                    <Button variant="primary" onClick={() => { setShowModal(true); setEditingId(null); setRefundData({ tuitionCode: '', paymentType: '', paymentNumber: '', personalPhone: '', amount: '', name: '', note: '', status: '', commentFromAgent: '', returnDate: '' }) }}>
                        Create Refund
                    </Button>
                </Header>
                
                <Card className="mt-4 shadow-sm border-0">
                    <Card.Body>
                        <Row className="text-center g-3">
                            {[
                                { label: 'Total', count: statusCounts.total, color: 'dark' },
                                { label: 'Pending', count: statusCounts.pending, color: 'primary' },
                                { label: 'Under Review', count: statusCounts.underReview, color: 'info' },
                                { label: 'Approved', count: statusCounts.approved, color: 'success' },
                                { label: 'Rejected', count: statusCounts.rejected, color: 'danger' },
                                { label: 'Completed', count: statusCounts.completed, color: 'success' }
                            ].map((stat, idx) => (
                                <Col key={idx} xs={6} sm={4} md={2}>
                                    <div className={`card p-2 shadow-sm border-${stat.color}`}>
                                        <small className={`text-${stat.color} fw-bold`}>{stat.label}</small>
                                        <h5 className="mb-0">{stat.count}</h5>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>

                {/* Search & Filter Bar */}
                <Card className="mt-4 shadow-sm border-0">
                    <Card.Body>
                        <Row className="g-3 align-items-end">
                            <Col md={3}>
                                <Form.Label className="fw-bold small">Tuition Code</Form.Label>
                                <Form.Control
                                    name="tuitionCode"
                                    placeholder="Search Tuition Code"
                                    value={searchInputs.tuitionCode}
                                    onChange={handleSearchInputChange}
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Label className="fw-bold small">Payment Phone</Form.Label>
                                <Form.Control
                                    name="paymentNumber"
                                    placeholder="Search Phone"
                                    value={searchInputs.paymentNumber}
                                    onChange={handleSearchInputChange}
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Label className="fw-bold small">Personal Phone</Form.Label>
                                <Form.Control
                                    name="personalPhone"
                                    placeholder="Search Phone"
                                    value={searchInputs.personalPhone}
                                    onChange={handleSearchInputChange}
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Label className="fw-bold small">Status</Form.Label>
                                <Form.Select name="status" value={searchInputs.status} onChange={handleSearchInputChange}>
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="under review">Under Review</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </Form.Select>
                            </Col>
                            <Col md={3} className="d-flex gap-2">
                                <Button variant="primary" onClick={handleSearch} className="flex-grow-1">
                                    <FaSearch className="me-1" /> Search
                                </Button>
                                <Button variant="outline-secondary" onClick={handleResetFilters}>
                                    <FaUndo />
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <div className="d-flex justify-content-between align-items-center mt-4">
                    {role === "superadmin" && (
                        <Button variant="success" size="sm" onClick={handleExportToExcel}>
                            Export to Excel ({totalRecords})
                        </Button>
                    )}
                    <div className="text-muted small">Showing {refundList.length} of {totalRecords} records</div>
                </div>

                <Card className="mt-3 shadow-sm border-0">
                    <Card.Body className="p-0">
                        <div style={{ maxHeight: "700px", overflowY: "auto" }}>
                            <Table striped hover responsive className="mb-0">
                                <thead className="table-primary sticky-top">
                                    <tr>
                                        <th>SL</th>
                                        <th>Applied At</th>
                                        <th>Status</th>
                                        <th>Tuition Code</th>
                                        <th>Created By</th>
                                        <th>Updated By</th>
                                        <th>Payment Number Type</th>
                                        <th>Payment Number</th>
                                        <th>Name</th>
                                        <th>Return Amount</th>
                                        <th>Return Date</th>
                                        <th>Personal Phone</th>
                                        <th>Comment (Teacher)</th>
                                        <th>Comment From Agent</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="15" className="text-center py-5">
                                                <Spinner animation="border" variant="primary" />
                                            </td>
                                        </tr>
                                    ) : refundList.length === 0 ? (
                                        <tr>
                                            <td colSpan="15" className="text-center py-4">No records found.</td>
                                        </tr>
                                    ) : (
                                        refundList.map((item, index) => (
                                            <tr key={item._id} className={item.status === 'completed' ? 'table-success' : ''}>
                                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                                <td className="small text-nowrap">{item.requestedAt ? formatDate(item.requestedAt) : '-'}</td>
                                                <td>
                                                    <span className={`badge ${
                                                        item.status === "pending" ? "bg-warning text-dark" :           
                                                        item.status === "under review" ? "bg-info" :                
                                                        item.status === "approved" ? "bg-primary" :                       
                                                        item.status === "rejected" ? "bg-danger" :                     
                                                        item.status === "completed" ? "bg-success" :                   
                                                        item.status === "cancelled" ? "bg-secondary" : "bg-light text-dark"
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td>{item.tuitionCode}</td>
                                                <td>{item.createdBy || '-'}</td>
                                                <td>{item.updatedBy || '-'}</td>
                                                <td>{item.paymentType}</td>
                                                <td>{item.paymentNumber}</td>
                                                <td>{item.name}</td>
                                                <td>{item.amount}</td>
                                                <td 
                                                    className="fw-bold" 
                                                    style={{ 
                                                        color: item.status === 'completed' ? '#155724' : '#0d6efd' 
                                                    }}
                                                >
                                                    {formatDateOnly(item.returnDate)}
                                                </td>
                                                <td>{item.personalPhone}</td>
                                                <td className="small">{item.note}</td>
                                                <td className="small">{item.commentFromAgent}</td>
                                                <td>
                                                    <div className="d-flex gap-1 justify-content-center">
                                                        <Button variant="warning" size="sm" onClick={() => handleEditApply(item)}><FaEdit /></Button>
                                                        <Button variant="danger" size="sm" onClick={() => handleDeleteRecord(item._id)}><FaTrashAlt /></Button>
                                                        <Button variant="success" size="sm" onClick={() => handleOpenWhatsApp(item)}><FaWhatsapp /></Button>
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
                {!loading && totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination className="pagination-rounded-pill">
                            <Pagination.Prev 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft className="me-1" /> Prev
                            </Pagination.Prev>
                            
                            {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                // Show first, last, and pages around current
                                if (page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                                    return (
                                        <Pagination.Item 
                                            key={page} 
                                            active={page === currentPage}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </Pagination.Item>
                                    );
                                } else if (page === currentPage - 3 || page === currentPage + 3) {
                                    return <Pagination.Ellipsis key={page} />;
                                }
                                return null;
                            })}

                            <Pagination.Next 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                            >
                                Next <FaChevronRight className="ms-1" />
                            </Pagination.Next>
                        </Pagination>
                    </div>
                )}

                {/* Create/Edit Refund Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">{editingId ? "Edit Refund Record" : "Create Refund Record"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-light">
                        <Form>
                            {/* Teacher Section */}
                            <div className="bg-white p-3 rounded shadow-sm mb-4 border-start border-primary border-4">
                                <h6 className="text-primary pb-2 mb-3 fw-bold uppercase">Teacher Section</h6>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Tuition Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={refundData.tuitionCode}
                                                onChange={(e) => setRefundData({ ...refundData, tuitionCode: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={refundData.name}
                                                onChange={(e) => setRefundData({ ...refundData, name: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Payment Number Type</Form.Label>
                                            <Form.Select
                                                value={refundData.paymentType}
                                                onChange={(e) => setRefundData({ ...refundData, paymentType: e.target.value })}
                                                required
                                            >
                                                <option value="">Select</option>
                                                <option value="bkash">Bkash Personal</option>
                                                <option value="nagad">Nagad Personal</option>
                                                <option value="cash">Cash</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Payment Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={refundData.paymentNumber}
                                                onChange={(e) => setRefundData({ ...refundData, paymentNumber: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Personal Phone No.</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={refundData.personalPhone}
                                                onChange={(e) => setRefundData({ ...refundData, personalPhone: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Amount</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={refundData.amount}
                                                onChange={(e) => setRefundData({ ...refundData, amount: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Comment From Teacher</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={refundData.note}
                                                onChange={(e) => setRefundData({ ...refundData, note: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>

                            {/* Agent Section */}
                            <div className="p-3 rounded shadow-sm mb-2 border-start border-success border-4" style={{ backgroundColor: '#f0f9f4', border: '1px solid #dee2e6' }}>
                                <h6 className="text-success pb-2 mb-3 fw-bold uppercase">Agent Section</h6>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small text-success">Status</Form.Label>
                                            <Form.Select
                                                value={refundData.status}
                                                onChange={(e) => setRefundData({ ...refundData, status: e.target.value })}
                                                required
                                            >
                                                <option value="">Select</option>
                                                <option value="pending">Pending</option>
                                                <option value="under review">Under Review</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small text-success">Return Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={refundData.returnDate || ''}
                                                onChange={(e) => setRefundData({ ...refundData, returnDate: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small text-success">Comment From Agent</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={refundData.commentFromAgent}
                                                onChange={(e) => setRefundData({ ...refundData, commentFromAgent: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSaveRequest} disabled={loading}>
                            {loading ? <Spinner size="sm" /> : "Save Changes"}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <WhatsAppRefundModal
                    show={showWhatsAppModal}
                    onHide={() => setShowWhatsAppModal(false)}
                    refundData={whatsAppRefund}
                />
                <ToastContainer />
            </Container>
        </>
    );
};

export default RefundPage;

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
