import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Card, Button, Table, Modal, Form,
    Nav, Badge, Spinner
} from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    FaPlus, FaMinus, FaFilter, FaTrash, FaEdit,
    FaWallet, FaArrowUp, FaArrowDown, FaCalendarAlt,
    FaCoins, FaChartLine, FaHistory, FaGlobe
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import moment from 'moment';
import NavBarPage from './NavbarPage';

const IncomeExpensePage = () => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, profit: 0 });
    const [todaySummary, setTodaySummary] = useState({ totalIncome: 0, totalExpense: 0, profit: 0 });
    const [monthSummary, setMonthSummary] = useState({ totalIncome: 0, totalExpense: 0, profit: 0 });
    const [overallSummary, setOverallSummary] = useState({ totalIncome: 0, totalExpense: 0, profit: 0 });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        type: 'income',
        amount: '',
        category: '',
        note: '',
        date: moment().format('YYYY-MM-DD')
    });
    const [filter, setFilter] = useState('month'); // today, week, month, year, custom
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
    const [customDates, setCustomDates] = useState({ startDate: '', endDate: '' });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const categories = {
        all: ['Media Fee', 'Premium Subscription Fee', 'Registration Fee', 'Consultancy', 'Salary', 'Office Rent', 'Electricity Bill', 'Marketing', 'Internet', 'Repairs', 'Food', 'Transport', 'Nasta Bill', 'Bonus', 'Facebook Advertisements', 'Offline Advertisements', 'Mobile Bills', 'Equipment Cost', 'BM Collect', 'Refund', 'Official Cost', 'Others'],
        income: ['Media Fee', 'Premium Subscription Fee', 'Registration Fee', 'Consultancy', 'Bonus', 'Others'],
        expense: ['Salary', 'Office Rent', 'Electricity Bill', 'Marketing', 'Internet', 'Repairs', 'Food', 'Transport', 'Nasta Bill', 'Facebook Advertisements', 'Offline Advertisements', 'Mobile Bills', 'Equipment Cost', 'BM Collect', 'Refund', 'Official Cost', 'Others']
    };

    useEffect(() => {
        fetchData();
    }, [filter, customDates, selectedCategory]);

    const getRangeDates = () => {
        let start, end = moment().endOf('day').format('YYYY-MM-DD');
        if (filter === 'today') start = moment().startOf('day').format('YYYY-MM-DD');
        else if (filter === 'week') start = moment().startOf('week').format('YYYY-MM-DD');
        else if (filter === 'month') {
            start = moment(selectedMonth).startOf('month').format('YYYY-MM-DD');
            end = moment(selectedMonth).endOf('month').format('YYYY-MM-DD');
        }
        else if (filter === 'year') start = moment().startOf('year').format('YYYY-MM-DD');
        else if (filter === 'custom') {
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
            const [transRes, summaryRes, todayRes, monthRes, overallRes] = await Promise.all([
                axios.get(`https://tuition-seba-backend-1.onrender.com/api/transaction/all?startDate=${start}&endDate=${end}&category=${selectedCategory}`, { headers }),
                axios.get(`https://tuition-seba-backend-1.onrender.com/api/transaction/summary?startDate=${start}&endDate=${end}&category=${selectedCategory}`, { headers }),
                axios.get(`https://tuition-seba-backend-1.onrender.com/api/transaction/summary?startDate=${todayStart}&endDate=${todayEnd}`, { headers }),
                axios.get(`https://tuition-seba-backend-1.onrender.com/api/transaction/summary?startDate=${monthStart}&endDate=${monthEnd}`, { headers }),
                axios.get(`https://tuition-seba-backend-1.onrender.com/api/transaction/summary`, { headers })
            ]);
            setTransactions(transRes.data);
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

    const handleShowModal = (transaction = null) => {
        if (transaction) {
            setEditMode(true);
            setCurrentId(transaction._id);
            setFormData({
                type: transaction.type,
                amount: transaction.amount,
                category: transaction.category,
                note: transaction.note,
                date: moment(transaction.date).format('YYYY-MM-DD')
            });
        } else {
            setEditMode(false);
            setFormData({
                type: 'income',
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
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/transaction/edit/${currentId}`, submitData, { headers });
                toast.success('Transaction updated');
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/transaction/add', submitData, { headers });
                toast.success('Transaction added');
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
            await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/transaction/delete/${id}`, {
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

    return (
        <>
            <NavBarPage />
            <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-primary">Finance Management</h2>
                    <Button variant="primary" onClick={() => handleShowModal()} className="rounded-pill px-4">
                        <FaPlus className="me-2" /> Add Transaction
                    </Button>
                </div>

                {/* Power-Overview Summary Grid */}
                <Row className="mb-5 g-3">
                    {[
                        { title: "Today's Stats", data: todaySummary, mainColor: "#4f46e5", icon: <FaCoins />, label: "TODAY" },
                        { title: "Monthly Performance", data: monthSummary, mainColor: "#10b981", icon: <FaChartLine />, label: "THIS MONTH" },
                        { title: "Selected Period", data: summary, mainColor: "#f59e0b", icon: <FaHistory />, label: "FILTERED" },
                        { title: "Overall Summary", data: overallSummary, mainColor: "#ec4899", icon: <FaGlobe />, label: "OVERALL" }
                    ].map((item, idx) => (
                        <Col lg={3} md={6} key={idx}>
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: idx * 0.1 }} whileHover={{ y: -5 }}>
                                <Card className="border-0 shadow-lg" style={{ borderRadius: '24px', background: '#fff', overflow: 'hidden' }}>
                                    <div className="px-3 py-1 text-white fw-bold x-small text-center" style={{ backgroundColor: item.mainColor, letterSpacing: '1px', fontSize: '10px' }}>
                                        {item.label}
                                    </div>
                                    <Card.Body className="p-3">
                                        <div className="text-center mb-3">
                                            <div className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>Net Profit</div>
                                            <h3 className={`fw-black mb-0 ${item.data.profit >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontWeight: '900' }}>
                                                ৳{item.data.profit.toLocaleString()}
                                            </h3>
                                        </div>

                                        <div className="row g-2">
                                            <div className="col-6">
                                                <div className="p-2 rounded-4 bg-success bg-opacity-10 text-center h-100 border border-success border-opacity-10">
                                                    <div className="text-success small fw-bold text-uppercase mb-1" style={{ fontSize: '0.6rem' }}>Income</div>
                                                    <h6 className="fw-bold text-success mb-0" style={{ fontSize: '0.9rem' }}>৳{item.data.totalIncome.toLocaleString()}</h6>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="p-2 rounded-4 bg-danger bg-opacity-10 text-center h-100 border border-danger border-opacity-10">
                                                    <div className="text-danger small fw-bold text-uppercase mb-1" style={{ fontSize: '0.6rem' }}>Expense</div>
                                                    <h6 className="fw-bold text-danger mb-0" style={{ fontSize: '0.9rem' }}>৳{item.data.totalExpense.toLocaleString()}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>

                {/* Filter Toolbar */}
                <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
                    <Card.Body className="p-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <Nav variant="pills" activeKey={filter} onSelect={(k) => setFilter(k)} className="custom-pills bg-light p-1 rounded-pill">
                                <Nav.Item><Nav.Link eventKey="today" className="small rounded-pill py-1">Today</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="week" className="small rounded-pill py-1">Week</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="month" className="small rounded-pill py-1">Month</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="year" className="small rounded-pill py-1">Year</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="custom" className="small rounded-pill py-1">Dates</Nav.Link></Nav.Item>
                            </Nav>
                            {filter === 'month' && (
                                <div className="animate__animated animate__fadeIn">
                                    <Form.Control
                                        size="sm" type="month"
                                        style={{ width: '160px', borderRadius: '10px' }}
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                    />
                                </div>
                            )}
                            {filter === 'custom' && (
                                <div className="d-flex gap-2 align-items-center animate__animated animate__fadeIn">
                                    <Form.Control size="sm" type="date" style={{ width: '130px', borderRadius: '10px' }} value={customDates.startDate} onChange={(e) => setCustomDates({ ...customDates, startDate: e.target.value })} />
                                    <span className="small text-muted">to</span>
                                    <Form.Control size="sm" type="date" style={{ width: '130px', borderRadius: '10px' }} value={customDates.endDate} onChange={(e) => setCustomDates({ ...customDates, endDate: e.target.value })} />
                                </div>
                            )}
                        </div>

                        <div className="d-flex gap-2 align-items-center flex-grow-1" style={{ maxWidth: '400px' }}>
                            <Form.Select
                                size="sm"
                                className="rounded-pill border-0 bg-light px-3"
                                style={{ height: '38px' }}
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Filter by Category (All)</option>
                                {categories.all.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </Form.Select>
                            <Button variant="light" className="rounded-circle shadow-sm" onClick={() => { setFilter('month'); setSelectedCategory(''); setCustomDates({ startDate: '', endDate: '' }) }} title="Reset Filters">
                                <FaFilter size={14} />
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
                <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                    <Card.Header className="bg-white py-3 border-0">
                        <h5 className="fw-bold mb-0">Recent Transactions</h5>
                    </Card.Header>
                    <div className="table-responsive">
                        <Table hover className="align-middle border-0 mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="border-0 px-4">Date & Time</th>
                                    <th className="border-0">Type</th>
                                    <th className="border-0">Category</th>
                                    <th className="border-0">Amount</th>
                                    <th className="border-0">Created By</th>
                                    <th className="border-0">Updated By</th>
                                    <th className="border-0 text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                                ) : transactions.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-5 text-muted">No transactions found</td></tr>
                                ) : transactions.map(t => (
                                    <tr key={t._id}>
                                        <td className="px-4">
                                            <div className="fw-bold">{moment(t.date).format('DD MMM YYYY')}</div>
                                            <div className="text-muted small">{moment(t.date).format('hh:mm A')}</div>
                                        </td>
                                        <td>
                                            <Badge bg={t.type === 'income' ? 'success' : 'danger'} className="text-capitalize px-3 rounded-pill">
                                                {t.type}
                                            </Badge>
                                        </td>
                                        <td className="fw-semibold">{t.category}</td>
                                        <td className={`fw-bold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                            {t.type === 'income' ? '+' : '-'} ৳{t.amount.toLocaleString()}
                                        </td>
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
                        </Table>
                    </div>
                </Card>

                {/* Add/Edit Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton className="border-0">
                        <Modal.Title className="fw-bold">{editMode ? 'Edit Transaction' : 'Add Transaction'}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body className="py-0">
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Transaction Type</Form.Label>
                                <div className="d-flex gap-3">
                                    <Form.Check
                                        type="radio" label="Income" name="type" id="income"
                                        checked={formData.type === 'income'}
                                        onChange={() => setFormData({ ...formData, type: 'income', category: '' })}
                                    />
                                    <Form.Check
                                        type="radio" label="Expense" name="type" id="expense"
                                        checked={formData.type === 'expense'}
                                        onChange={() => setFormData({ ...formData, type: 'expense', category: '' })}
                                    />
                                </div>
                            </Form.Group>
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
                                    {categories[formData.type].map(cat => (
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
                                    editMode ? 'Update Transaction' : 'Save Transaction'
                                )}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

                <style>{`
                .custom-pills .nav-link {
                    color: #666;
                    padding: 0.5rem 1rem;
                    transition: all 0.3s ease;
                }
                .custom-pills .nav-link.active {
                    background-color: #0d6efd !important;
                    box-shadow: 0 4px 10px rgba(13, 110, 253, 0.2);
                }
                .nav-pills .nav-link:hover:not(.active) {
                    background-color: #e9ecef;
                }
                .table thead th {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #888;
                }
            `}</style>
            </Container>
        </>
    );
};

export default IncomeExpensePage;
