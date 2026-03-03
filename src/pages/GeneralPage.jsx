import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import { toast, ToastContainer } from 'react-toastify';
import { FaSearch, FaSyncAlt } from 'react-icons/fa';

const cardStyle = {
    padding: '20px',
    borderRadius: '8px',
    color: 'white',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '600',
};

const GeneralPage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const matchSummary = useMemo(() => {
        if (!results) return [];
        return [
            { id: 'guardianApplies', label: 'Guardian Applies', count: results.guardianApplies.length, bgColor: '#007bff' },
            { id: 'leads', label: 'Leads', count: results.leads.length, bgColor: '#6610f2' },
            { id: 'phones', label: 'Spam/Best/Express', count: results.phones.length, bgColor: '#dc3545' },
            { id: 'teachers', label: 'Teachers', count: results.teachers.length, bgColor: '#28a745' },
            { id: 'tuitions', label: 'Tuitions', count: results.tuitions.length, bgColor: '#ffc107', color: 'black' },
            { id: 'tuitionApplies', label: 'Tuition Application', count: results.tuitionApplies.length, bgColor: '#17a2b8' },
            { id: 'teacherPayments', label: 'Teacher Payments', count: results.teacherPayments.length, bgColor: '#20c997' },
            { id: 'payments', label: 'Student Payments', count: results.payments.length, bgColor: '#6f42c1' },
            { id: 'refunds', label: 'Refunds', count: results.refunds.length, bgColor: '#fd7e14' },
        ].filter(item => item.count > 0);
    }, [results]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!phoneNumber) {
            toast.error("Please enter a phone number");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/generalSearch/phone/${phoneNumber}`);
            setResults(response.data);
            const totalMatches = Object.values(response.data).reduce((acc, curr) => acc + curr.length, 0);

            if (totalMatches === 0) {
                toast.info("No records found for this phone number");
            } else {
                toast.success(`Search completed. Found ${totalMatches} records.`);
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error(error.response?.data?.message || "Something went wrong during search");
        } finally {
            setLoading(false);
        }
    };

    const scrollToCategory = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const renderTable = (id, title, data, columns) => {
        if (!data || data.length === 0) return null;

        return (
            <Card id={id} className="mb-4 shadow-sm mt-4">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center" style={{ fontWeight: '900' }}>
                    <span>{title}</span>
                    <Badge bg="light" text="dark">{data.length}</Badge>
                </Card.Header>
                <Card.Body className="p-0">
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <Table striped bordered hover responsive className="mb-0">
                            <thead className="table-light sticky-top">
                                <tr>
                                    {columns.map((col, idx) => <th key={idx}>{col.label}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, idx) => (
                                    <tr key={item._id || idx}>
                                        {columns.map((col, cIdx) => (
                                            <td key={cIdx}>
                                                {col.render ? col.render(item) : (item[col.key] || '-')}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        );
    };

    return (
        <>
            <NavBarPage />
            <Container fluid className="px-4 py-4">
                <div className="mb-4">
                    <h2 className="text-primary fw-bold">General Phone Search</h2>
                    <p className="text-muted">Lookup any phone number across all system modules.</p>
                </div>

                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <Form onSubmit={handleSearch}>
                            <Row className="align-items-end">
                                <Col md={8}>
                                    <Form.Label className="fw-bold">Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter phone number (e.g. 017...)"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        size="lg"
                                    />
                                </Col>
                                <Col md={4}>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                        size="lg"
                                        className="w-100 mt-2 mt-md-0"
                                    >
                                        {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <FaSearch className="me-2" />}
                                        SEARCH
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Summary Section */}
                {results && !loading && matchSummary.length > 0 && (
                    <div className="mt-4">
                        <h4 className="fw-bold mb-3">Search Summary</h4>
                        <Row>
                            {matchSummary.map((item) => (
                                <Col key={item.id} md={4} lg={2}>
                                    <Card
                                        style={{ ...cardStyle, backgroundColor: item.bgColor, color: item.color || 'white', cursor: 'pointer' }}
                                        onClick={() => scrollToCategory(item.id)}
                                    >
                                        <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>{item.label}</div>
                                        <h3 className="mb-0">{item.count}</h3>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

                {loading && (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 fw-bold text-primary">Searching databases...</p>
                    </div>
                )}

                {results && !loading && (
                    <div className="results-container">
                        {renderTable("guardianApplies", "Guardian Applications", results.guardianApplies, [
                            { key: 'studentName', label: 'Student Name' },
                            { key: 'phone', label: 'Phone' },
                            { key: 'tuitionCode', label: 'Tuition Code' },
                            { key: 'status', label: 'Status' }
                        ])}

                        {renderTable("leads", "Leads", results.leads, [
                            { key: 'name', label: 'Name' },
                            { key: 'phone', label: 'Phone' },
                            { key: 'category', label: 'Category' },
                            { key: 'status', label: 'Status' }
                        ])}

                        {renderTable("phones", "Spam/Best/Express Status", results.phones, [
                            { key: 'phone', label: 'Phone' },
                            {
                                label: 'Status',
                                render: (item) => (
                                    <div className="d-flex gap-1">
                                        {item.isSpam && <Badge bg="danger">Spam</Badge>}
                                        {item.isBest && <Badge bg="success">Best</Badge>}
                                        {item.isExpress && <Badge bg="info">Express</Badge>}
                                        {!item.isSpam && !item.isBest && !item.isExpress && <Badge bg="secondary">Normal</Badge>}
                                    </div>
                                )
                            },
                            { key: 'note', label: 'Note' }
                        ])}

                        {renderTable("teachers", "Registered Teachers", results.teachers, [
                            { key: 'name', label: 'Name' },
                            { key: 'phone', label: 'Primary Phone' },
                            { key: 'alternativePhone', label: 'Alt Phone' },
                            { key: 'whatsapp', label: 'WhatsApp' },
                            { key: 'status', label: 'Status' }
                        ])}

                        {renderTable("tuitions", "Tuitions", results.tuitions, [
                            { key: 'tuitionCode', label: 'Code' },
                            { key: 'guardianNumber', label: 'Guardian' },
                            { key: 'tutorNumber', label: 'Tutor' },
                            { key: 'status', label: 'Status' }
                        ])}

                        {renderTable("tuitionApplies", "Tuition Applications", results.tuitionApplies, [
                            { key: 'name', label: 'Tutor' },
                            { key: 'phone', label: 'Phone' },
                            { key: 'tuitionCode', label: 'Code' },
                            { key: 'status', label: 'Status' }
                        ])}

                        {renderTable("teacherPayments", "Teacher Payments", results.teacherPayments, [
                            { key: 'tuitionCode', label: 'Code' },
                            { key: 'paymentNumber', label: 'Payment No' },
                            { key: 'amount', label: 'Amount' },
                            { key: 'status', label: 'Status' }
                        ])}

                        {renderTable("payments", "Student Payments", results.payments, [
                            { key: 'tuitionCode', label: 'Code' },
                            { key: 'paymentNumber', label: 'Payment No' },
                            { key: 'receivedTk', label: 'Amount' },
                            { key: 'status', label: 'Status' }
                        ])}

                        {renderTable("refunds", "Refund Requests", results.refunds, [
                            { key: 'tuitionCode', label: 'Code' },
                            { key: 'paymentNumber', label: 'Payment No' },
                            { key: 'amount', label: 'Amount' },
                            { key: 'status', label: 'Status' }
                        ])}

                        {matchSummary.length === 0 && (
                            <div className="text-center my-5">
                                <h3 className="text-muted">No records found</h3>
                            </div>
                        )}
                    </div>
                )}
            </Container>
            <ToastContainer position="bottom-right" />
        </>
    );
};

export default GeneralPage;
