import React, { useEffect, useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Tooltip,
    OverlayTrigger,
} from 'react-bootstrap';

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

    const fetchData = () => {
        setLoading(true);
        fetch('http://localhost:5001/api/dashboard/all')
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

    React.useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!summaryData) return <div>Loading dashboard...</div>;

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
                {/* Summary Cards */}
                <Row className="mb-4">
                    <Col md={4} lg={2}>
                        <Card style={{ ...cardStyle, backgroundColor: '#007bff' }}>
                            Total Tuitions
                            <h3>{summaryData.totalTuitions}</h3>
                        </Card>
                    </Col>
                    <Col md={4} lg={2}>
                        <Card style={{ ...cardStyle, backgroundColor: '#28a745' }}>
                            Active Tuitions
                            <h3>{summaryData.activeTuitions}</h3>
                        </Card>
                    </Col>
                    <Col md={4} lg={2}>
                        <Card style={{ ...cardStyle, backgroundColor: '#ffc107', color: 'black' }}>
                            Pending Tuition Apps
                            <h3>{summaryData.pendingTuitionApps}</h3>
                        </Card>
                    </Col>
                    <Col md={4} lg={2}>
                        <Card style={{ ...cardStyle, backgroundColor: '#fd7e14' }}>
                            Total Best
                            <h3>{summaryData.totalBest}</h3>
                        </Card>
                    </Col>
                    <Col md={4} lg={2}>
                        <Card style={{ ...cardStyle, backgroundColor: '#17a2b8' }}>
                            Total Spam
                            <h3>{summaryData.totalSpam}</h3>
                        </Card>
                    </Col>
                    <Col md={4} lg={2}>
                        <Card style={{ ...cardStyle, backgroundColor: '#dc3545' }}>
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
            </Container>

            {/* Refresh Icon Button */}
            <OverlayTrigger
                placement="top"
                overlay={loading ? <Tooltip id="refresh-tooltip">Refreshing data...</Tooltip> : <></>}
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
            </OverlayTrigger>

            {/* Spin animation */}
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </>
    );
};

export default Dashboard;
