import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import NavBarPage from './NavbarPage';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const [summaryData, setSummaryData] = useState(null);
    const [recentTuitionApplications, setRecentTuitionApplications] = useState([]);
    const [recentTeacherApplications, setRecentTeacherApplications] = useState([]);
    const [recentTeacherPayments, setRecentTeacherPayments] = useState([]);
    const [refundRequests, setRefundRequests] = useState([]);
    const [monthlyTuitionApplications, setMonthlyTuitionApplications] = useState([]);
    const [applicationStatusBreakdown, setApplicationStatusBreakdown] = useState([]);
    const [monthlyPaymentInflow, setMonthlyPaymentInflow] = useState([]);
    const [refundTrends, setRefundTrends] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/dashboard/all')
            .then(res => res.json())
            .then(data => {
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
            .catch(err => console.error(err));
    }, []);

    if (!summaryData) return <div>Loading...</div>;

    return (
        <>
            <NavBarPage />
            <Container fluid style={{ padding: '20px' }}>
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

                <Row className="mb-4">
                    <Col lg={6} className="mb-4">
                        <Card>
                            <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Recent Tuition Applications</span>
                                <button
                                    className="btn btn-link p-0"
                                    style={{ fontSize: '0.9rem' }}
                                    onClick={() => navigate('/admin/tuition')}
                                >
                                    View All
                                </button>
                            </Card.Header>
                            <Card.Body style={{ padding: 0 }}>
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
                                        {recentTuitionApplications.map((app) => (
                                            <tr key={app.id}>
                                                <td>{app.name || app.studentName}</td>
                                                <td>{app.tuitionCode}</td>
                                                <td>{app.premiumCode?.trim() ? app.premiumCode : 'N/A'}</td>
                                                <td>{app.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6} className="mb-4">
                        <Card>
                            <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Recent Teacher Applications</span>
                                <button
                                    className="btn btn-link p-0"
                                    style={{ fontSize: '0.9rem' }}
                                    onClick={() => navigate('/admin/premiumTeacher')}
                                >
                                    View All
                                </button>
                            </Card.Header>
                            <Card.Body style={{ padding: 0 }}>
                                <Table striped hover responsive="md" style={{ marginBottom: 0 }}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTeacherApplications.map((app) => (
                                            <tr key={app.id}>
                                                <td>{app.name}</td>
                                                <td>{app.phone}</td>
                                                <td>{app.status}</td>
                                            </tr>
                                        ))}
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
                                <span>Recent Teacher Payments</span>
                                <button
                                    className="btn btn-link p-0"
                                    style={{ fontSize: '0.9rem' }}
                                    onClick={() => navigate('/admin/payment')}
                                >
                                    View All
                                </button>
                            </Card.Header>
                            <Card.Body style={{ padding: 0 }}>
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
                                        {recentTeacherPayments.map((p) => (
                                            <tr key={p.id}>
                                                <td>{p.tuitionCode}</td>
                                                <td>{p.paymentNumber}</td>
                                                <td>{p.personalPhone}</td>
                                                <td>৳ {p.amount?.toLocaleString() || p.receivedTk?.toLocaleString()}</td>
                                                <td>{p.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6} className="mb-4">
                        <Card>
                            <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Refund Requests</span>
                                <button
                                    className="btn btn-link p-0"
                                    style={{ fontSize: '0.9rem' }}
                                    onClick={() => navigate('/admin/refund')}
                                >
                                    View All
                                </button>
                            </Card.Header>
                            <Card.Body style={{ padding: 0 }}>
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
                                        {refundRequests.map((r) => (
                                            <tr key={r.id}>
                                                <td>{r.tuitionCode}</td>
                                                <td>{r.paymentNumber}</td>
                                                <td>{r.personalPhone}</td>
                                                <td>৳ {r.amount?.toLocaleString() || r.receivedTk?.toLocaleString()}</td>
                                                <td>{r.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col lg={6} className="mb-4" style={{ height: 300 }}>
                        <Card style={{ padding: '10px' }}>
                            <Card.Header>Monthly Tuition Applications</Card.Header>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={monthlyTuitionApplications}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
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
                                    <Tooltip />
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
                                    <Tooltip />
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
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="refunds" fill="#dc3545" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                </Row>
            </Container>
        </>
    );
};

export default Dashboard;
