import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Card, Button, Table, Modal, Form,
    Badge, Spinner, Pagination
} from 'react-bootstrap';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import { toast } from 'react-toastify';
import {
    FaPlus, FaFilter, FaTrash, FaEdit,
    FaWallet, FaHistory, FaUndo, FaCalendarAlt
} from 'react-icons/fa';
import moment from 'moment';
import styled from 'styled-components';
import NavBarPage from './NavbarPage';

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CustomTable = styled(Table)`
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 0;
    
    thead th {
        background-color: #0d6efd !important;
        color: white !important;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 0.05em;
        padding: 12px 10px;
        position: sticky;
        top: 0;
        z-index: 20;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        white-space: nowrap;
    }

    tbody td {
        padding: 10px;
        vertical-align: middle;
        border: 1px solid #dee2e6 !important;
        font-size: 0.95rem;
        color: #000000 !important;
        font-weight: 600;
    }

    tbody tr {
        transition: background-color 0.15s ease;
        &:hover {
            background-color: #f1f5f9 !important;
        }
    }
`;

const ExpensePage = () => {
    const [expenses, setExpenses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [summary, setSummary] = useState({ totalExpense: 0 });
    const [todaySummary, setTodaySummary] = useState({ totalExpense: 0 });
    const [monthSummary, setMonthSummary] = useState({ totalExpense: 0 });
    const [overallSummary, setOverallSummary] = useState({ totalExpense: 0 });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        note: '',
        date: moment().format('YYYY-MM-DD')
    });
    const [filter, setFilter] = useState('month'); 
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
    const [customDates, setCustomDates] = useState({ startDate: '', endDate: '' });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const categories = ['Salary', 'Office Rent', 'Electricity Bill', 'Marketing', 'Internet', 'Repairs', 'Food', 'Transport', 'Nasta Bill', 'Mobile Bills', 'Equipment Cost', 'BM Collect', 'Refund', 'Refer Bonus', 'Official Cost', 'Others', 'FACEBOOK ADVERTISEMENT -WHATSAPP', 'FACEBOOK ADVERTISEMENT', 'STREET POSTER / BANNER', 'LEAFLET / FLYER DISTRIBUTION', 'SCHOOL / COLLEGE WALL POSTER', 'FACEBOOK ADVERTISEMENT-LEAD', 'LEMENITING POSTER', 'CNG STICKER'];

    useEffect(() => {
        fetchData();
    }, [filter, customDates, selectedCategory, selectedMonth, currentPage]);

    const getRangeDates = () => {
        let start = '', end = moment().endOf('day').format('YYYY-MM-DD');
        if (filter === 'today') {
            start = moment().startOf('day').format('YYYY-MM-DD');
        } else if (filter === 'week') {
            start = moment().startOf('week').format('YYYY-MM-DD');
        } else if (filter === 'month') {
            start = moment(selectedMonth).startOf('month').format('YYYY-MM-DD');
            end = moment(selectedMonth).endOf('month').format('YYYY-MM-DD');
        } else if (filter === 'year') {
            start = moment().startOf('year').format('YYYY-MM-DD');
        } else if (filter === 'custom') {
            start = customDates.startDate;
            end = customDates.endDate;
        }
        return { start, end };
    };

    const fetchData = async () => {
        setLoading(true);
        const { start, end } = getRangeDates();

        const todayStart = moment().startOf('day').format('YYYY-MM-DD');
        const todayEnd = moment().endOf('day').format('YYYY-MM-DD');
        const monthStart = moment().startOf('month').format('YYYY-MM-DD');
        const monthEnd = moment().endOf('month').format('YYYY-MM-DD');

        const token = localStorage.getItem('token');
        const headers = { Authorization: token };

        try {
            const [expRes, summaryRes, todayRes, monthRes, overallRes] = await Promise.all([
                axios.get(`https://tuition-seba-backend-1.onrender.com/api/expense/all?startDate=${start}&endDate=${end}&category=${selectedCategory}&page=${currentPage}&limit=50`, { headers }),
                axios.get(`https://tuition-seba-backend-1.onrender.com/api/expense/summary?startDate=${start}&endDate=${end}&category=${selectedCategory}`, { headers }),
                axios.get(`https://tuition-seba-backend-1.onrender.com/api/expense/summary?startDate=${todayStart}&endDate=${todayEnd}`, { headers }),
                axios.get(`https://tuition-seba-backend-1.onrender.com/api/expense/summary?startDate=${monthStart}&endDate=${monthEnd}`, { headers }),
                axios.get(`https://tuition-seba-backend-1.onrender.com/api/expense/summary`, { headers })
            ]);
            setExpenses(expRes.data.data || expRes.data);
            setTotalPages(expRes.data.totalPages || 1);
            setSummary(summaryRes.data);
            setTodaySummary(todayRes.data);
            setMonthSummary(monthRes.data);
            setOverallSummary(overallRes.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (expense = null) => {
        if (expense) {
            setEditMode(true);
            setCurrentId(expense._id);
            setFormData({
                amount: expense.amount,
                category: expense.category,
                note: expense.note || '',
                date: moment(expense.date).format('YYYY-MM-DD')
            });
        } else {
            setEditMode(false);
            setFormData({
                amount: '',
                category: '',
                note: '',
                date: moment().toISOString()
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const headers = { Authorization: token };

        const submitData = editMode
            ? { ...formData, updatedBy: username }
            : { ...formData, createdBy: username };

        try {
            if (editMode) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/expense/edit/${currentId}`, submitData, { headers });
                toast.success('Expense updated');
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/expense/add', submitData, { headers });
                toast.success('Expense added');
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            toast.error('Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        setDeletingId(id);
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/expense/delete/${id}`, {
                headers: { Authorization: token }
            });
            toast.success('Deleted');
            fetchData();
        } catch (err) {
            toast.error('Delete failed');
        } finally {
            setDeletingId(null);
        }
    };

    const handlePresetSelect = (preset) => {
        let start, end;
        switch (preset) {
            case 'today':
                start = moment().format('YYYY-MM-DD');
                end = moment().format('YYYY-MM-DD');
                break;
            case 'yesterday':
                start = moment().subtract(1, 'days').format('YYYY-MM-DD');
                end = moment().subtract(1, 'days').format('YYYY-MM-DD');
                break;
            case 'thisWeek':
                start = moment().startOf('week').format('YYYY-MM-DD');
                end = moment().endOf('week').format('YYYY-MM-DD');
                break;
            case 'thisMonth':
                start = moment().startOf('month').format('YYYY-MM-DD');
                end = moment().endOf('month').format('YYYY-MM-DD');
                break;
            case 'lastMonth':
                start = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
                end = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
                break;
            case 'last7Days':
                start = moment().subtract(7, 'days').format('YYYY-MM-DD');
                end = moment().format('YYYY-MM-DD');
                break;
            case 'last30Days':
                start = moment().subtract(30, 'days').format('YYYY-MM-DD');
                end = moment().format('YYYY-MM-DD');
                break;
            default:
                break;
        }
        if (start && end) {
            setFilter('custom');
            setCustomDates({ startDate: start, endDate: end });
            setCurrentPage(1);
        }
    };

    return (
        <>
            <NavBarPage />
            <Container fluid className="px-4">
                <Header>
                    <h2 className="fw-bold text-primary">Expense Management</h2>
                    <Button variant="primary" onClick={() => handleShowModal()}>
                        Create Expense
                    </Button>
                </Header>

                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            {[
                                { title: "Today's Expense", data: todaySummary },
                                { title: "This Month's Expense", data: monthSummary },
                                { title: "Selected Period Expense", data: summary },
                                { title: "Overall Expense", data: overallSummary }
                            ].map((item, idx) => (
                                <Col lg={3} md={6} key={idx} className="mb-3">
                                    <div className="card p-3 shadow border-danger h-100">
                                        <div className="text-danger mb-2" style={{ fontWeight: 'bolder' }}>{item.title}</div>
                                        <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                            <span className="text-danger" style={{ fontSize: '1.25rem', fontWeight: '900' }}>
                                                ৳{(item.data?.totalExpense ?? 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </div>
                    </Card.Body>
                </Card>

                {/* Quick Ranges */}
                <div className="d-flex align-items-center gap-2 mt-4 flex-wrap">
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

                {/* Filter Toolbar */}
                <Row className="mt-4 mb-3 align-items-end g-3">
                    <Col md={3}>
                        <Form.Label className="fw-bold">Date Filter Type</Form.Label>
                        <Form.Select
                            value={filter}
                            onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                            <option value="custom">Custom Dates</option>
                        </Form.Select>
                    </Col>
                    
                    {filter === 'month' && (
                        <Col md={2}>
                            <Form.Label className="fw-bold">Select Month</Form.Label>
                            <Form.Control
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
                            />
                        </Col>
                    )}
                    
                    {filter === 'custom' && (
                        <>
                            <Col md={2}>
                                <Form.Label className="fw-bold">Start Date</Form.Label>
                                <Form.Control type="date" value={customDates.startDate} onChange={(e) => { setCustomDates({ ...customDates, startDate: e.target.value }); setCurrentPage(1); }} />
                            </Col>
                            <Col md={2}>
                                <Form.Label className="fw-bold">End Date</Form.Label>
                                <Form.Control type="date" value={customDates.endDate} onChange={(e) => { setCustomDates({ ...customDates, endDate: e.target.value }); setCurrentPage(1); }} />
                            </Col>
                        </>
                    )}

                    <Col md={3}>
                        <Form.Label className="fw-bold">Category</Form.Label>
                        <Form.Select
                            value={selectedCategory}
                            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    
                    <Col md={1} className="d-flex align-items-end">
                        <Button 
                            variant="danger" 
                            className="w-100 d-flex align-items-center justify-content-center"
                            style={{ height: '38px' }}
                            onClick={() => { setFilter('month'); setSelectedCategory(''); setCustomDates({ startDate: '', endDate: '' }); setSelectedMonth(moment().format('YYYY-MM')); setCurrentPage(1); }} 
                            title="Reset Filters"
                        >
                            <FaUndo />
                        </Button>
                    </Col>
                </Row>

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Recent Expenses</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <CustomTable striped hover>
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Date & Time</th>
                                        <th>Category</th>
                                        <th>Amount</th>
                                        <th>Comment</th>
                                        <th>Created By</th>
                                        <th>Updated By</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                                ) : expenses.length === 0 ? (
                                    <tr><td colSpan="7" className="text-center py-5 text-muted">No expenses found</td></tr>
                                ) : expenses.map((t, index) => (
                                    <tr key={t._id}>
                                        <td className="fw-bold text-muted">{(currentPage - 1) * 50 + index + 1}</td>
                                        <td className="px-4">
                                            <div className="fw-bold">{moment(t.date).format('DD MMM YYYY')}</div>
                                            <div className="text-muted small">{moment(t.date).format('hh:mm A')}</div>
                                        </td>
                                        <td className="fw-semibold text-danger">{t.category}</td>
                                        <td className="fw-bold text-danger">
                                            ৳{t.amount.toLocaleString()}
                                        </td>
                                        <td className="small text-muted">{t.note || '-'}</td>
                                        <td className="small">{t.createdBy}</td>
                                        <td className="small">{t.updatedBy || '-'}</td>
                                        <td className="text-end px-4">
                                            <Button
                                                variant="light" size="sm"
                                                className="me-2 text-primary rounded-circle border-0 shadow-sm"
                                                onClick={() => handleShowModal(t)}
                                            >
                                                <FaEdit size={12} />
                                            </Button>
                                            <Button
                                                variant="light" size="sm"
                                                className="text-danger rounded-circle border-0 shadow-sm"
                                                onClick={() => handleDelete(t._id)}
                                                disabled={deletingId === t._id}
                                            >
                                                {deletingId === t._id ? <Spinner size="sm" animation="border" /> : <FaTrash size={12} />}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </CustomTable>
                        
                        {totalPages > 1 && (
                            <Pagination className="justify-content-center mt-4">
                                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                                <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} />
                                <Pagination.Item active>{currentPage} / {totalPages}</Pagination.Item>
                                <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} />
                                <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                            </Pagination>
                        )}
                    </div>
                    </Card.Body>
                </Card>

                {/* Add/Edit Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton className="border-0">
                        <Modal.Title className="fw-bold">{editMode ? 'Edit Expense' : 'Add Expense'}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body className="py-0">
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold">Amount (৳)</Form.Label>
                                        <Form.Control
                                            type="number" required placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="rounded-3"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold">Date & Time</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={moment(formData.date).format('YYYY-MM-DDTHH:mm')}
                                            onChange={(e) => setFormData({ ...formData, date: moment(e.target.value).toISOString() })}
                                            className="rounded-3 shadow-sm"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Category</Form.Label>
                                <Form.Select
                                    required value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="rounded-3"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Note (Optional)</Form.Label>
                                <Form.Control
                                    as="textarea" rows={2} placeholder="Add a note..."
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    className="rounded-3"
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className="border-0 pt-0">
                            <Button variant="light" onClick={() => setShowModal(false)} className="rounded-pill px-4">Cancel</Button>
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 rounded-pill py-2 fw-bold shadow-sm"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <><Spinner animation="border" size="sm" className="me-2" /> Saving...</>
                                ) : (
                                    editMode ? 'Update Expense' : 'Save Expense'
                                )}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                <style>{`
                    .preset-btn {
                        background: #eef2f7;
                        border: 1px solid #dce4ec;
                        color: #495057;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 11.5px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    .preset-btn:hover {
                        background: #0d6efd;
                        color: white;
                        border-color: #0d6efd;
                    }
                `}</style>
            </Container>
        </>
    );
};

export default ExpensePage;
