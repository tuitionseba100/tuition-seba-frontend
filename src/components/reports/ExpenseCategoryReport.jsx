import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Form, Button, Spinner, Badge, Modal, Pagination } from 'react-bootstrap';
import { FaCalendarAlt, FaFilter, FaSearch, FaUndo, FaMinus, FaWallet, FaReceipt, FaEye, FaListAlt, FaChartBar, FaChartPie } from 'react-icons/fa';
import { axiosWithFallback as axios } from '../../services/fetchWithFallback';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ExpenseCategoryReport = () => {
    const token = localStorage.getItem('token');
    const initialToday = new Date();
    const initialTodayStr = `${initialToday.getFullYear()}-${String(initialToday.getMonth() + 1).padStart(2, '0')}-${String(initialToday.getDate()).padStart(2, '0')}`;

    const [expenseReportData, setExpenseReportData] = useState({
        summary: [],
        timeline: [],
        totalExpense: 0,
        totalCount: 0,
        avgPerTransaction: 0,
        topCategory: 'N/A',
        distinctCategories: []
    });
    const [expenseLoading, setExpenseLoading] = useState(false);
    const [expenseFilters, setExpenseFilters] = useState({ startDate: initialTodayStr, endDate: initialTodayStr, category: 'all' });
    const [appliedExpenseFilters, setAppliedExpenseFilters] = useState({ startDate: initialTodayStr, endDate: initialTodayStr, category: 'all' });

    // Category Items Modal State
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [selectedExpenseCategory, setSelectedExpenseCategory] = useState('');
    const [expenseModalData, setExpenseModalData] = useState({ items: [], totalCount: 0, totalAmount: 0, currentPage: 1, totalPages: 1 });
    const [expenseModalLoading, setExpenseModalLoading] = useState(false);
    const [expenseModalPage, setExpenseModalPage] = useState(1);

    useEffect(() => {
        fetchExpenseCategoryReport();
    }, [appliedExpenseFilters]);

    const fetchExpenseCategoryReport = async () => {
        setExpenseLoading(true);
        try {
            const params = { ...appliedExpenseFilters };
            if (params.category === 'all') delete params.category;
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/report/expense-by-category', {
                params,
                headers: { Authorization: token }
            });
            setExpenseReportData(res.data);
        } catch (error) {
            console.error('Error fetching expense category report:', error);
            toast.error('Failed to load expense category report');
        } finally {
            setExpenseLoading(false);
        }
    };

    const fetchExpenseCategoryItems = async (catName, pageNum = 1) => {
        setExpenseModalLoading(true);
        try {
            const params = {
                category: catName,
                startDate: appliedExpenseFilters.startDate,
                endDate: appliedExpenseFilters.endDate,
                page: pageNum,
                limit: 15
            };
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/report/expense-category-items', {
                params,
                headers: { Authorization: token }
            });
            setExpenseModalData(res.data);
            setExpenseModalPage(pageNum);
        } catch (error) {
            console.error('Error fetching category items:', error);
            toast.error('Failed to load category expense items');
        } finally {
            setExpenseModalLoading(false);
        }
    };

    const handleOpenExpenseCategoryModal = (catName) => {
        setSelectedExpenseCategory(catName);
        setShowExpenseModal(true);
        fetchExpenseCategoryItems(catName, 1);
    };

    const handleExpenseModalPageChange = (newPage) => {
        if (newPage >= 1 && newPage <= expenseModalData.totalPages) {
            fetchExpenseCategoryItems(selectedExpenseCategory, newPage);
        }
    };

    const handleExpenseFilterChange = (field, value) => {
        setExpenseFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyExpenseFilters = () => {
        setAppliedExpenseFilters(expenseFilters);
    };

    const handleResetExpenseFilters = () => {
        const reset = { startDate: initialTodayStr, endDate: initialTodayStr, category: 'all' };
        setExpenseFilters(reset);
        setAppliedExpenseFilters(reset);
    };

    const handleExpensePresetSelect = (preset) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (preset) {
            case 'allTime':
                setExpenseFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
                setAppliedExpenseFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
                return;
            case 'today':
                break;
            case 'yesterday':
                start.setDate(today.getDate() - 1);
                end.setDate(today.getDate() - 1);
                break;
            case 'thisWeek': {
                const day = today.getDay();
                start.setDate(today.getDate() - day);
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
            ...expenseFilters,
            startDate: formatDate(start),
            endDate: formatDate(end)
        };
        setExpenseFilters(newFilters);
        setAppliedExpenseFilters(newFilters);
    };

    return (
        <div>
            {/* Header Title & Refresh Button */}
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                <div>
                    <h5 className="text-primary fw-extrabold d-flex align-items-center gap-2 mb-0" style={{ letterSpacing: '-0.3px', fontSize: '1.15rem' }}>
                        <FaReceipt /> Expense Report by Category
                    </h5>
                    <span className="text-muted" style={{ fontSize: '11.5px' }}>Analyze company spending breakdown and metrics by category</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Badge bg="light" text="dark" className="border px-2 py-1 fw-medium shadow-sm rounded-pill" style={{ fontSize: '11px' }}>
                        Total Categories: {expenseReportData?.summary?.length || 0}
                    </Badge>
                    <Button
                        variant="primary"
                        onClick={fetchExpenseCategoryReport}
                        disabled={expenseLoading}
                        className="px-2 py-0 rounded-pill shadow-sm"
                        size="sm"
                        style={{ fontSize: '11.5px', height: '26px' }}
                    >
                        {expenseLoading ? <Spinner animation="border" size="sm" /> : "Refresh"}
                    </Button>
                </div>
            </div>

            {/* Compact Expense KPI Ribbon */}
            <Row className="mb-2 g-2">
                <Col md={4}>
                    <PremiumStatsCard className="shadow-sm bg-white border border-danger p-2 px-3 rounded-3" style={{ borderWidth: '1.5px !important' }}>
                        <Card.Body className="p-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="icon-wrapper bg-danger bg-opacity-10 text-danger rounded-2 p-1 px-2 d-flex align-items-center justify-content-center">
                                        <FaMinus size={15} />
                                    </div>
                                    <div>
                                        <div className="text-muted text-uppercase fw-bold" style={{ fontSize: '10.5px', letterSpacing: '0.4px' }}>Total Expense</div>
                                        <h4 className="fw-extrabold text-danger mb-0" style={{ fontSize: '1.35rem', lineHeight: '1.2' }}>
                                            {expenseLoading ? <Spinner animation="border" size="sm" /> : `৳ ${(expenseReportData.totalExpense || 0).toLocaleString()}`}
                                        </h4>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded" style={{ fontSize: '10.5px' }}>
                                        {(expenseReportData.summary || []).length} Categories
                                    </span>
                                </div>
                            </div>
                        </Card.Body>
                    </PremiumStatsCard>
                </Col>
                <Col md={4}>
                    <PremiumStatsCard className="shadow-sm bg-white border border-primary p-2 px-3 rounded-3" style={{ borderWidth: '1.5px !important' }}>
                        <Card.Body className="p-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="icon-wrapper bg-primary bg-opacity-10 text-primary rounded-2 p-1 px-2 d-flex align-items-center justify-content-center">
                                        <FaListAlt size={15} />
                                    </div>
                                    <div>
                                        <div className="text-muted text-uppercase fw-bold" style={{ fontSize: '10.5px', letterSpacing: '0.4px' }}>Transactions Count</div>
                                        <h4 className="fw-extrabold text-primary mb-0" style={{ fontSize: '1.35rem', lineHeight: '1.2' }}>
                                            {expenseLoading ? <Spinner animation="border" size="sm" /> : (expenseReportData.totalCount || 0).toLocaleString()}
                                        </h4>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded" style={{ fontSize: '10.5px' }}>
                                        Total Entries
                                    </span>
                                </div>
                            </div>
                        </Card.Body>
                    </PremiumStatsCard>
                </Col>
                <Col md={4}>
                    <PremiumStatsCard className="shadow-sm bg-white border border-warning p-2 px-3 rounded-3" style={{ borderWidth: '1.5px !important' }}>
                        <Card.Body className="p-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="icon-wrapper bg-warning bg-opacity-10 text-warning rounded-2 p-1 px-2 d-flex align-items-center justify-content-center flex-shrink-0">
                                        <FaReceipt size={15} />
                                    </div>
                                    <div>
                                        <div className="text-muted text-uppercase fw-bold" style={{ fontSize: '10.5px', letterSpacing: '0.4px' }}>Top Category</div>
                                        <h4 className="fw-extrabold text-dark mb-0" style={{ fontSize: '1.15rem', lineHeight: '1.2' }}>
                                            {expenseLoading ? <Spinner animation="border" size="sm" /> : (expenseReportData.topCategory || 'N/A')}
                                        </h4>
                                    </div>
                                </div>
                                <div className="text-end flex-shrink-0 ms-2">
                                    <span className="badge bg-warning-subtle text-dark border border-warning-subtle px-2 py-1 rounded fw-bold" style={{ fontSize: '10.5px' }}>
                                        {expenseReportData.summary && expenseReportData.summary.length > 0 ? `${expenseReportData.summary[0].percentage}%` : '-'}
                                    </span>
                                </div>
                            </div>
                        </Card.Body>
                    </PremiumStatsCard>
                </Col>
            </Row>

            {/* Compact Expense Filter Card */}
            <Card className="shadow-sm border-0 mb-2 rounded-3 filter-card">
                <Card.Body className="p-2 px-3">
                    <Row className="g-2 align-items-center">
                        <Col lg={3} sm={6}>
                            <div className="d-flex align-items-center gap-1">
                                <span className="text-secondary fw-semibold small" style={{ minWidth: '38px', fontSize: '11.5px' }}>From:</span>
                                <Form.Control
                                    type="date"
                                    size="sm"
                                    value={expenseFilters.startDate}
                                    onChange={(e) => handleExpenseFilterChange('startDate', e.target.value)}
                                    className="rounded-2"
                                    style={{ fontSize: '12px' }}
                                />
                            </div>
                        </Col>
                        <Col lg={3} sm={6}>
                            <div className="d-flex align-items-center gap-1">
                                <span className="text-secondary fw-semibold small" style={{ minWidth: '24px', fontSize: '11.5px' }}>To:</span>
                                <Form.Control
                                    type="date"
                                    size="sm"
                                    value={expenseFilters.endDate}
                                    onChange={(e) => handleExpenseFilterChange('endDate', e.target.value)}
                                    className="rounded-2"
                                    style={{ fontSize: '12px' }}
                                />
                            </div>
                        </Col>
                        <Col lg={4} sm={8}>
                            <div className="d-flex align-items-center gap-1">
                                <span className="text-secondary fw-semibold small" style={{ minWidth: '58px', fontSize: '11.5px' }}>Category:</span>
                                <Form.Select
                                    size="sm"
                                    value={expenseFilters.category}
                                    onChange={(e) => handleExpenseFilterChange('category', e.target.value)}
                                    className="rounded-2"
                                    style={{ fontSize: '12px' }}
                                >
                                    <option value="all">All Categories</option>
                                    {(expenseReportData.distinctCategories || []).map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </Form.Select>
                            </div>
                        </Col>
                        <Col lg={2} sm={4} className="d-flex gap-1">
                            <Button
                                variant="success"
                                size="sm"
                                className="w-100 rounded-2 shadow-sm d-flex align-items-center justify-content-center gap-1 py-1"
                                onClick={handleApplyExpenseFilters}
                                title="Apply Filters"
                                style={{ fontSize: '12px' }}
                            >
                                <FaSearch size={11} /> Filter
                            </Button>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="rounded-2 shadow-sm d-flex align-items-center justify-content-center px-2 py-1"
                                onClick={handleResetExpenseFilters}
                                title="Reset Filters"
                                style={{ fontSize: '12px' }}
                            >
                                <FaUndo size={11} />
                            </Button>
                        </Col>
                    </Row>
                    <div className="d-flex align-items-center gap-1 mt-2 flex-wrap pt-1 border-top">
                        <span className="text-secondary fw-semibold small d-flex align-items-center gap-1 me-1" style={{ fontSize: '11px' }}>
                            <FaCalendarAlt className="text-primary" size={11} /> Quick:
                        </span>
                        {['today', 'yesterday', 'thisWeek', 'thisMonth', 'lastMonth', 'last7Days', 'last30Days', 'allTime'].map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                className="preset-btn py-0 px-2 rounded-pill"
                                style={{ fontSize: '11px', height: '22px', lineHeight: '20px' }}
                                onClick={() => handleExpensePresetSelect(preset)}
                            >
                                {preset === 'allTime' ? 'All Time' : preset.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </button>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            {/* Breakdown Table */}
            {expenseLoading ? (
                <div className="d-flex justify-content-center py-4">
                    <Spinner animation="border" variant="primary" size="sm" />
                </div>
            ) : (
                <Card className="shadow-sm border-0 rounded-3 mb-2 list-card">
                    <Card.Body className="p-2 px-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center gap-2">
                                <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                                    Category Spending Breakdown
                                </span>
                                <span className="badge bg-secondary-subtle text-dark px-2" style={{ fontSize: '11px' }}>
                                    {(expenseReportData.summary || []).length} categories
                                </span>
                            </div>
                        </div>

                        <div className="table-responsive rounded-2 border shadow-sm" style={{ maxHeight: "550px", overflowY: "auto" }}>
                            <Table hover striped bordered className="align-middle text-center mb-0 custom-reports-table table-sm" style={{ fontSize: '12.5px' }}>
                                <thead className="table-dark sticky-top">
                                    <tr>
                                        <th style={{ width: '50px', padding: '6px 4px' }}>SL</th>
                                        <th className="text-start ps-3" style={{ padding: '6px 8px' }}>CATEGORY NAME</th>
                                        <th style={{ width: '120px', padding: '6px 8px' }}>COUNT</th>
                                        <th style={{ width: '160px', padding: '6px 8px' }}>TOTAL SPENT (৳)</th>
                                        <th style={{ minWidth: '150px', width: '220px', padding: '6px 8px' }}>% OF TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!expenseReportData.summary || expenseReportData.summary.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4 text-muted fw-bold" style={{ fontSize: '12px' }}>
                                                No expense records found for the selected date range & filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {expenseReportData.summary.map((item, index) => (
                                                <tr
                                                    key={item.category}
                                                    className="hover-bg-light transition-all"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleOpenExpenseCategoryModal(item.category)}
                                                    title="Click to view category entries"
                                                >
                                                    <td className="fw-bold text-muted" style={{ padding: '5px 4px' }}>{index + 1}</td>
                                                    <td className="text-start ps-3 fw-bold text-dark" style={{ padding: '5px 8px' }}>
                                                        <span className="badge bg-secondary-soft text-dark px-2 py-1 rounded me-1">
                                                            {item.category}
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold text-primary" style={{ padding: '5px 8px' }}>
                                                        {item.count}
                                                    </td>
                                                    <td className="text-danger fw-bold" style={{ padding: '5px 8px', fontSize: '13px' }}>
                                                        ৳ {item.totalAmount.toLocaleString()}
                                                    </td>
                                                    <td style={{ padding: '5px 8px' }}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="progress flex-grow-1" style={{ height: '6px', backgroundColor: '#e2e8f0' }}>
                                                                <div
                                                                    className="progress-bar bg-danger"
                                                                    role="progressbar"
                                                                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                                                                    aria-valuenow={item.percentage}
                                                                    aria-valuemin="0"
                                                                    aria-valuemax="100"
                                                                />
                                                            </div>
                                                            <span className="fw-bold text-muted" style={{ minWidth: '38px', fontSize: '11px' }}>
                                                                {item.percentage}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="bg-light border-top border-2">
                                                <td colSpan={2} className="ps-3 fw-bold text-primary text-end" style={{ padding: '6px 8px' }}>TOTAL</td>
                                                <td className="fw-extrabold text-primary" style={{ padding: '6px 8px' }}>
                                                    {(expenseReportData.totalCount || 0).toLocaleString()}
                                                </td>
                                                <td className="fw-extrabold text-danger" style={{ padding: '6px 8px', fontSize: '13.5px' }}>
                                                    ৳ {(expenseReportData.totalExpense || 0).toLocaleString()}
                                                </td>
                                                <td className="fw-bold text-muted" style={{ padding: '6px 8px', fontSize: '11px' }}>100.0%</td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            )}

            {/* Expense Category Items Modal */}
            <Modal
                show={showExpenseModal}
                onHide={() => setShowExpenseModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="fw-bold text-primary d-flex align-items-center gap-2">
                        <FaReceipt /> Category: <span className="text-dark">{selectedExpenseCategory}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-3 bg-light p-3 rounded-3 border">
                        <div>
                            <span className="text-muted small">Period: </span>
                            <strong className="text-dark">
                                {appliedExpenseFilters.startDate || 'Start'} to {appliedExpenseFilters.endDate || 'End'}
                            </strong>
                        </div>
                        <div className="d-flex gap-3">
                            <div>
                                <span className="text-muted small">Total Entries: </span>
                                <strong className="text-primary">{expenseModalData.totalCount}</strong>
                            </div>
                            <div>
                                <span className="text-muted small">Total Spent: </span>
                                <strong className="text-danger">৳ {(expenseModalData.totalAmount || 0).toLocaleString()}</strong>
                            </div>
                        </div>
                    </div>

                    {expenseModalLoading ? (
                        <div className="d-flex justify-content-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : expenseModalData.items && expenseModalData.items.length > 0 ? (
                        <>
                            <div className="table-responsive rounded-3 border shadow-sm mb-3">
                                <Table hover className="mb-0 text-center align-middle" size="sm">
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: '50px' }}>SL</th>
                                            <th>Date</th>
                                            <th>Amount (৳)</th>
                                            <th>Created By</th>
                                            {selectedExpenseCategory === 'Salary' && <th>Salary User / Month</th>}
                                            <th className="text-start ps-3">Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenseModalData.items.map((item, idx) => (
                                            <tr key={item._id}>
                                                <td className="fw-bold text-muted">{((expenseModalPage - 1) * 15) + idx + 1}</td>
                                                <td className="text-dark small">
                                                    {item.date ? new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                                </td>
                                                <td className="fw-extrabold text-danger">
                                                    ৳ {(item.amount || 0).toLocaleString()}
                                                </td>
                                                <td>
                                                    <Badge bg="secondary" className="px-2">{item.createdBy || 'System'}</Badge>
                                                </td>
                                                {selectedExpenseCategory === 'Salary' && (
                                                    <td className="small">
                                                        <strong>{item.salaryUser || '-'}</strong>
                                                        {item.salaryMonth && <span className="text-muted ms-1">({item.salaryMonth})</span>}
                                                    </td>
                                                )}
                                                <td className="text-start ps-3 small text-muted">
                                                    {item.note || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            {expenseModalData.totalPages > 1 && (
                                <div className="d-flex justify-content-end">
                                    <Pagination size="sm" className="mb-0">
                                        <Pagination.Prev
                                            onClick={() => handleExpenseModalPageChange(expenseModalPage - 1)}
                                            disabled={expenseModalPage === 1}
                                        />
                                        {[...Array(expenseModalData.totalPages)].map((_, i) => (
                                            <Pagination.Item
                                                key={i + 1}
                                                active={expenseModalPage === i + 1}
                                                onClick={() => handleExpenseModalPageChange(i + 1)}
                                            >
                                                {i + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next
                                            onClick={() => handleExpenseModalPageChange(expenseModalPage + 1)}
                                            disabled={expenseModalPage === expenseModalData.totalPages}
                                        />
                                    </Pagination>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-5 text-muted fw-bold">
                            No expense records found for this category in the selected period.
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ExpenseCategoryReport;

const PremiumStatsCard = styled(Card)`
  height: 100%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
  cursor: default;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15) !important;
  }
`;
