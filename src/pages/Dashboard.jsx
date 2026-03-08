import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Tooltip,
    OverlayTrigger,
    Button,
    Modal,
    Form,
} from 'react-bootstrap';
import { FaSyncAlt, FaSun, FaCloudSun, FaMoon, FaEdit, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import NavBarPage from './NavbarPage';

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip as ReTooltip,
    Legend,
    LineChart,
    Line,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

const cardStyle = {
    padding: '20px',
    borderRadius: '8px',
    color: 'white',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '600',
};

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [summaryData, setSummaryData] = useState(null);
    const [recentTuitionApplications, setRecentTuitionApplications] = useState([]);
    const [recentTeacherApplications, setRecentTeacherApplications] = useState([]);
    const [recentTeacherPayments, setRecentTeacherPayments] = useState([]);
    const [refundRequests, setRefundRequests] = useState([]);
    const [monthlyTuitionApplications, setMonthlyTuitionApplications] = useState([]);
    const [applicationStatusBreakdown, setApplicationStatusBreakdown] = useState([]);
    const [monthlyPaymentInflow, setMonthlyPaymentInflow] = useState([]);
    const [refundTrends, setRefundTrends] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState(null);
    const [editingPayment, setEditingPayment] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const role = localStorage.getItem('role');

    const fetchPaymentSummary = () => {
        Promise.all([
            fetch('https://tuition-seba-backend-1.onrender.com/api/payment/summary').then(res => res.json()),
            fetch('https://tuition-seba-backend-1.onrender.com/api/teacherPayment/summary').then(res => res.json())
        ])
            .then(([paymentRes, teacherPaymentRes]) => {
                setPaymentSummary({
                    totalPaymentsCount: paymentRes.totalPaymentsCount,
                    totalPaymentTK: paymentRes.totalPaymentTK,
                    totalPaymentsTodayCount: paymentRes.totalPaymentsTodayCount,
                    totalPaymentTKToday: paymentRes.totalPaymentTKToday,
                    totalDues: paymentRes.totalDues,
                    totalDuesCount: paymentRes.totalDuesCount,
                    totalTeacherPayments: teacherPaymentRes.totalPayments,
                    totalTeacherPaymentsCount: teacherPaymentRes.totalPaymentsCount
                });
            })
            .catch(err => console.error('Error fetching payment summaries:', err));
    };

    const fetchData = () => {
        setLoading(true);
        if (role === 'superadmin') {
            fetchPaymentSummary();
        }
        fetch('https://tuition-seba-backend-1.onrender.com/api/dashboard/all')
            .then((res) => res.json())
            .then((data) => {
                setSummaryData(data.summaryData);
                setRecentTuitionApplications(data.recentTuitionApplications);
                setRecentTeacherApplications(data.recentTeacherApplications);
                setRecentTeacherPayments(data.recentTeacherPayments);
                setRefundRequests(data.refundRequests);
                setMonthlyTuitionApplications(data.monthlyTuitionApplications);
                setApplicationStatusBreakdown(data.applicationStatusBreakdown);
                setMonthlyPaymentInflow(data.monthlyPaymentInflow);
                setRefundTrends(data.refundTrends);
            })
            .catch((err) => console.error('Dashboard fetch error:', err))
            .finally(() => setLoading(false));
    };

    const handleDeletePayment = async (id) => {
        if (window.confirm('Are you sure you want to delete this payment record?')) {
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/teacherPayment/delete/${id}`);
                toast.success('Payment deleted successfully');
                fetchData();
            } catch (err) {
                console.error('Delete error:', err);
                toast.error('Failed to delete payment');
            }
        }
    };

    const handleEditPayment = (payment) => {
        setEditingPayment({ ...payment });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put(`https://tuition-seba-backend-1.onrender.com/api/teacherPayment/edit/${editingPayment._id}`, editingPayment);
            toast.success('Payment updated successfully');
            setShowEditModal(false);
            fetchData();
        } catch (err) {
            console.error('Update error:', err);
            toast.error('Failed to update payment');
        }
    };

    React.useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!summaryData) {
        return (
            <>
                <style>{`
                    @keyframes pulse {
                        0% { opacity: 0.6; }
                        50% { opacity: 1; }
                        100% { opacity: 0.6; }
                    }
                    .skeleton-box {
                        background-color: #e0e0e0;
                        border-radius: 8px;
                        animation: pulse 1.5s ease-in-out infinite;
                        width: 100%;
                        display: inline-block;
                    }
                `}</style>
                <NavBarPage />
                <Container fluid style={{ padding: '20px' }}>
                    <div className="text-center mb-4">
                        <h2 style={{ color: '#007bff', fontWeight: 'bold' }}>Dashboard Loading</h2>
                        <p className="text-muted">Preparing your data overview...</p>
                    </div>

                    {/* Summary Cards Skeleton */}
                    {role === 'superadmin' && (
                        <Row className="mb-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <Col key={i} md={4} lg={2}>
                                    <div className="skeleton-box" style={{ height: '100px', marginBottom: '20px', backgroundColor: '#d1e7ff' }} />
                                </Col>
                            ))}
                        </Row>
                    )}
                    <Row className="mb-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Col key={i} md={4} lg={2}>
                                <div className="skeleton-box" style={{ height: '100px', marginBottom: '20px' }} />
                            </Col>
                        ))}
                    </Row>

                    {/* Tables Skeleton */}
                    <Row className="mb-4">
                        <Col lg={6} className="mb-4">
                            <div className="skeleton-box" style={{ height: '350px' }} />
                        </Col>
                        <Col lg={6} className="mb-4">
                            <div className="skeleton-box" style={{ height: '350px' }} />
                        </Col>
                    </Row>

                    {/* Charts Skeleton */}
                    <Row>
                        <Col lg={6} className="mb-4">
                            <div className="skeleton-box" style={{ height: '280px' }} />
                        </Col>
                        <Col lg={6} className="mb-4">
                            <div className="skeleton-box" style={{ height: '280px' }} />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }

    return (
        <>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
            <NavBarPage />
            <Container fluid style={{ padding: '20px' }}>
                {/* Welcome Message Section */}
                <Row className="mb-4 mt-2">
                    <Col>
                        <Card style={{
                            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '24px',
                            padding: '40px',
                            color: 'white',
                            boxShadow: '0 20px 40px rgba(37, 117, 252, 0.25)',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    display: 'inline-block',
                                    padding: '6px 15px',
                                    borderRadius: '50px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    marginBottom: '15px',
                                    backdropFilter: 'blur(5px)'
                                }}>
                                    Dashboard Overview
                                </div>
                                <h1 style={{ fontWeight: 800, fontSize: '2.8rem', marginBottom: '10px', letterSpacing: '-1px' }}>
                                    {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}, {localStorage.getItem('username') || 'Admin'}! 👋
                                </h1>
                                <p style={{ fontSize: '1.2rem', opacity: 0.9, fontWeight: 500, marginBottom: 0 }}>
                                    We're glad to see you back. Have a productive day!
                                </p>
                            </div>

                            {/* Time-based Icon */}
                            <div style={{
                                position: 'relative',
                                zIndex: 1,
                                fontSize: '6rem',
                                opacity: 0.8,
                                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {new Date().getHours() < 12 ? <FaSun /> : new Date().getHours() < 18 ? <FaCloudSun /> : <FaMoon />}
                            </div>

                            {/* Floating Decorative Elements */}
                            <div style={{
                                position: 'absolute',
                                right: '-30px',
                                top: '-30px',
                                width: '180px',
                                height: '180px',
                                background: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: '50%',
                                pointerEvents: 'none'
                            }} />
                            <div style={{
                                position: 'absolute',
                                left: '10%',
                                bottom: '-30px',
                                width: '120px',
                                height: '120px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '50%',
                                pointerEvents: 'none'
                            }} />
                        </Card>
                    </Col>
                </Row>
                {/* Payment Summary Cards (Superadmin only) */}
                {role === 'superadmin' && paymentSummary && (
                    <Row className="mb-4">
                        <Col md={4} lg={2}>
                            <Card style={{ ...cardStyle, backgroundColor: '#007bff' }}>
                                Total Payment (TK)
                                <h3>৳ {paymentSummary.totalPaymentTK?.toLocaleString()}</h3>
                            </Card>
                        </Col>
                        <Col md={4} lg={2}>
                            <Card style={{ ...cardStyle, backgroundColor: '#28a745' }}>
                                Payments Today (TK)
                                <h3>৳ {paymentSummary.totalPaymentTKToday?.toLocaleString()}</h3>
                            </Card>
                        </Col>
                        <Col md={4} lg={2}>
                            <Card style={{ ...cardStyle, backgroundColor: '#ffc107', color: 'black' }}>
                                Total Dues (TK)
                                <h3>৳ {paymentSummary.totalDues?.toLocaleString()}</h3>
                            </Card>
                        </Col>
                        <Col md={4} lg={2}>
                            <Card style={{ ...cardStyle, backgroundColor: '#fd7e14' }}>
                                Teacher Payments
                                <h3>৳ {paymentSummary.totalTeacherPayments?.toLocaleString()}</h3>
                            </Card>
                        </Col>
                        <Col md={4} lg={2}>
                            <Card style={{ ...cardStyle, backgroundColor: '#17a2b8' }}>
                                Dues Count
                                <h3>{paymentSummary.totalDuesCount}</h3>
                            </Card>
                        </Col>
                        <Col md={4} lg={2}>
                            <Card style={{ ...cardStyle, backgroundColor: '#dc3545' }}>
                                Payments Count Today
                                <h3>{paymentSummary.totalPaymentsTodayCount}</h3>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Tuition Summary Cards (Always visible) */}
                <Row className="mb-4">
                    <Col md={4} lg={2}>
                        <Card style={{ ...cardStyle, backgroundColor: '#4b39b5' }}>
                            Total Tuitions
                            <h3>{summaryData.totalTuitions}</h3>
                        </Card>
                    </Col>
                    <Col md={4} lg={2}>
                        <Card style={{ ...cardStyle, backgroundColor: '#10b981' }}>
                            Active Tuitions
                            <h3>{summaryData.activeTuitions}</h3>
                        </Card>
                    </Col>
                    <Col md={4} lg={2}>
                        <Card style={{ ...cardStyle, backgroundColor: '#f59e0b', color: 'white' }}>
                            Pending Tuition Apps
                            <h3>{summaryData.pendingTuitionApps}</h3>
                        </Card>
                    </Col>
                    <Col md={4} lg={2}>
                        <Card style={{ ...cardStyle, backgroundColor: '#8b5cf6' }}>
                            Total Best
                            <h3>{summaryData.totalBest}</h3>
                        </Card>
                    </Col>
                    <Col md={4} lg={2}>
                        <Card style={{ ...cardStyle, backgroundColor: '#3b82f6' }}>
                            Total Spam
                            <h3>{summaryData.totalSpam}</h3>
                        </Card>
                    </Col>
                    <Col md={4} lg={2}>
                        <Card style={{ ...cardStyle, backgroundColor: '#ef4444' }}>
                            Verified Teachers
                            <h3>{summaryData.totalTeachers}</h3>
                        </Card>
                    </Col>
                </Row>

                {/* Recent Tuition Applications & Teacher Applications */}
                <Row className="mb-4">
                    <Col lg={6} className="mb-4">
                        <Card>
                            <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 900, color: '#0d6efd' }}>Recent Tuition Applications</span>
                                <button
                                    className="btn btn-link p-0"
                                    style={{ fontSize: '0.9rem' }}
                                    onClick={() => window.location.href = '/admin/tuition'}
                                >
                                    View All
                                </button>
                            </Card.Header>

                            <Card.Body style={{ padding: 0, maxHeight: 300, overflowY: 'auto' }}>
                                <Table striped hover responsive="md" style={{ marginBottom: 0 }}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Tuition Code</th>
                                            <th>Premium Code</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTuitionApplications.length > 0 ? (
                                            recentTuitionApplications.map((app) => (
                                                <tr key={app.id || app._id}>
                                                    <td>{app.name || app.studentName}</td>
                                                    <td>{app.tuitionCode}</td>
                                                    <td>{app.premiumCode?.trim() || 'N/A'}</td>
                                                    <td>{app.status}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="4" className="text-center">No recent tuition applications.</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6} className="mb-4">
                        <Card>
                            <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 900, color: '#0d6efd' }}>Recent Teacher Applications</span>
                                <button
                                    className="btn btn-link p-0"
                                    style={{ fontSize: '0.9rem' }}
                                    onClick={() => window.location.href = '/admin/premiumTeacher'}
                                >
                                    View All
                                </button>
                            </Card.Header>
                            <Card.Body style={{ padding: 0, maxHeight: 300, overflowY: 'auto' }}>
                                <Table striped hover responsive="md" style={{ marginBottom: 0 }}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTeacherApplications.length > 0 ? (
                                            recentTeacherApplications.map((app) => (
                                                <tr key={app.id || app._id}>
                                                    <td>{app.name}</td>
                                                    <td>{app.phone}</td>
                                                    <td>{app.status}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="3" className="text-center">No recent teacher applications.</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-4">
                    {role === 'superadmin' && (
                        <Col lg={6} className="mb-4">
                            <Card>
                                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 900, color: '#0d6efd' }}>Recent Teacher Payments</span>
                                    <button
                                        className="btn btn-link p-0"
                                        style={{ fontSize: '0.9rem' }}
                                        onClick={() => window.location.href = '/admin/payment'}
                                    >
                                        View All
                                    </button>
                                </Card.Header>
                                <Card.Body style={{ padding: 0, maxHeight: 300, overflowY: 'auto' }}>
                                    <Table striped hover responsive="md" style={{ marginBottom: 0 }}>
                                        <thead>
                                            <tr>
                                                <th>Tuition Code</th>
                                                <th>Payment No.</th>
                                                <th>Personal No.</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentTeacherPayments.length > 0 ? (
                                                recentTeacherPayments.map((p) => (
                                                    <tr key={p.id || p._id}>
                                                        <td>{p.tuitionCode}</td>
                                                        <td>{p.paymentNumber}</td>
                                                        <td>{p.personalPhone}</td>
                                                        <td>৳ {p.amount?.toLocaleString() || p.receivedTk?.toLocaleString()}</td>
                                                        <td>{p.status}</td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <Button variant="outline-warning" size="sm" onClick={() => handleEditPayment(p)}>
                                                                    <FaEdit />
                                                                </Button>
                                                                <Button variant="outline-danger" size="sm" onClick={() => handleDeletePayment(p._id)}>
                                                                    <FaTrashAlt />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="5" className="text-center">No recent teacher payments.</td></tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}

                    {role === 'superadmin' && (
                        <Col lg={6} className="mb-4">
                            <Card>
                                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 900, color: '#0d6efd' }}>Refund Requests</span>
                                    <button
                                        className="btn btn-link p-0"
                                        style={{ fontSize: '0.9rem' }}
                                        onClick={() => window.location.href = '/admin/refund'}
                                    >
                                        View All
                                    </button>
                                </Card.Header>
                                <Card.Body style={{ padding: 0, maxHeight: 300, overflowY: 'auto' }}>
                                    <Table striped hover responsive="md" style={{ marginBottom: 0 }}>
                                        <thead>
                                            <tr>
                                                <th>Tuition Code</th>
                                                <th>Payment No.</th>
                                                <th>Personal No.</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {refundRequests.length > 0 ? (
                                                refundRequests.map((r) => (
                                                    <tr key={r.id || r._id}>
                                                        <td>{r.tuitionCode}</td>
                                                        <td>{r.paymentNumber}</td>
                                                        <td>{r.personalPhone}</td>
                                                        <td>৳ {r.amount?.toLocaleString() || r.receivedTk?.toLocaleString()}</td>
                                                        <td>{r.status}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="5" className="text-center">No refund requests.</td></tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>

                {/* Charts Section */}
                <Row>
                    <Col lg={6} className="mb-4" style={{ height: 300 }}>
                        <Card style={{ padding: '10px' }}>
                            <Card.Header>Monthly Tuition Applications</Card.Header>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={monthlyTuitionApplications}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <ReTooltip />
                                    <Legend />
                                    <Bar dataKey="applications" fill="#007bff" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                    <Col lg={6} className="mb-4" style={{ height: 300 }}>
                        <Card style={{ padding: '10px' }}>
                            <Card.Header>Application Status Breakdown</Card.Header>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={applicationStatusBreakdown}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        label
                                    >
                                        {applicationStatusBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <ReTooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                </Row>

                {role === 'superadmin' && (
                    <Row>
                        <Col lg={6} className="mb-4" style={{ height: 300 }}>
                            <Card style={{ padding: '10px' }}>
                                <Card.Header>Monthly Payment Inflow</Card.Header>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={monthlyPaymentInflow}>
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <ReTooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="payments" stroke="#28a745" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>

                        <Col lg={6} className="mb-4" style={{ height: 300 }}>
                            <Card style={{ padding: '10px' }}>
                                <Card.Header>Refund Trends</Card.Header>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={refundTrends}>
                                        <XAxis
                                            dataKey="month"
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis />
                                        <ReTooltip />
                                        <Legend />
                                        <Bar dataKey="refunds" fill="#dc3545" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container >

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)' }}>
                    <Modal.Title className="fw-bold">✏️ Edit Payment Status</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {editingPayment && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Status</Form.Label>
                                <Form.Select
                                    value={editingPayment.status}
                                    onChange={(e) => setEditingPayment({ ...editingPayment, status: e.target.value })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="under review">Under review</option>
                                    <option value="received">Received</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="returned">Returned</option>
                                    <option value="deposit">Deposit</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={editingPayment.amount || ''}
                                    onChange={(e) => setEditingPayment({ ...editingPayment, amount: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Note</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={editingPayment.note || ''}
                                    onChange={(e) => setEditingPayment({ ...editingPayment, note: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />

            {/* Refresh Icon Button */}
            < OverlayTrigger
                placement="top"
                overlay={loading ? <Tooltip id="refresh-tooltip">Refreshing data...</Tooltip> : <></>
                }
            >
                <div
                    onClick={fetchData}
                    style={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        backgroundColor: '#007bff',
                        borderRadius: '50%',
                        padding: 12,
                        boxShadow: '0 0 10px rgba(0,123,255,0.6)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                    }}
                    role="button"
                    aria-label="Refresh dashboard data"
                >
                    <FaSyncAlt
                        size={24}
                        color="white"
                        style={{
                            animation: loading ? 'spin 1s linear infinite' : 'none',
                            transformOrigin: 'center center',
                        }}
                    />
                </div>
            </OverlayTrigger >

            {/* Spin animation */}
            < style > {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style >
        </>
    );
};

export default Dashboard;
