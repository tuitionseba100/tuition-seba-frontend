import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import { toast, ToastContainer } from 'react-toastify';
import {
    FaSearch,
    FaSyncAlt,
    FaUserPlus,
    FaBullhorn,
    FaShieldAlt,
    FaUserTie,
    FaBriefcase,
    FaClipboardList,
    FaHandHoldingUsd,
    FaWallet,
    FaHistory,
    FaLayerGroup
} from 'react-icons/fa';

const cardStyle = {
    padding: '24px',
    borderRadius: '12px',
    color: 'white',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '1.25rem',
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const optionsDate = { day: '2-digit', month: 'long', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
    const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);
    return `${formattedDate} || ${formattedTime}`;
};

const GeneralPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('phone'); // 'phone' or 'tuition'
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const matchSummary = useMemo(() => {
        if (!results) return [];
        const summary = [
            { id: 'guardianApplies', label: 'Guardian Applies', count: results.guardianApplies?.length || 0, icon: <FaUserPlus />, gradient: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' },
            { id: 'leads', label: 'Leads', count: results.leads?.length || 0, icon: <FaBullhorn />, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { id: 'phones', label: 'Spam/Best/Express', count: results.phones?.length || 0, icon: <FaShieldAlt />, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
            { id: 'teachers', label: 'Teachers', count: results.teachers?.length || 0, icon: <FaUserTie />, gradient: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)' },
            { id: 'tuitions', label: 'Tuitions', count: results.tuitions?.length || 0, icon: <FaBriefcase />, gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
            { id: 'tuitionApplies', label: 'Tuition Application', count: results.tuitionApplies?.length || 0, icon: <FaClipboardList />, gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
            { id: 'teacherPayments', label: 'Teacher Payments', count: results.teacherPayments?.length || 0, icon: <FaHandHoldingUsd />, gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
            { id: 'payments', label: 'Payments', count: results.payments?.length || 0, icon: <FaWallet />, gradient: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)' },
            { id: 'refunds', label: 'Refunds', count: results.refunds?.length || 0, icon: <FaHistory />, gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
            { id: 'taskDatas', label: 'Task Data', count: results.taskDatas?.length || 0, icon: <FaLayerGroup />, gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
        ];
        return summary.filter(item => item.count > 0);
    }, [results]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchTerm) {
            toast.error(`Please enter a ${searchType === 'phone' ? 'phone number' : 'tuition code'}`);
            return;
        }

        setLoading(true);
        try {
            const endpoint = searchType === 'phone'
                ? `https://tuition-seba-backend-1.onrender.com/api/generalSearch/phone/${searchTerm}`
                : `https://tuition-seba-backend-1.onrender.com/api/generalSearch/tuition/${searchTerm}`;

            const response = await axios.get(endpoint);
            setResults(response.data);
            const totalMatches = Object.values(response.data).reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0);

            if (totalMatches === 0) {
                toast.info(`No records found for this ${searchType === 'phone' ? 'phone number' : 'tuition code'}`);
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
            <Card id={id} className="mb-4 shadow-sm mt-4" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3" style={{ fontWeight: '800', fontSize: '1.3rem' }}>
                    <span>{title}</span>
                    <Badge bg="light" text="dark" className="fs-6">{data.length}</Badge>
                </Card.Header>
                <Card.Body className="p-0">
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <Table striped bordered hover responsive className="mb-0" style={{ fontSize: '1.15rem' }}>
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
                {/* Clean Header Section */}
                <div className="mb-5">
                    <h2 className="text-primary fw-bold display-6 mb-2">Global Search</h2>
                    <p className="text-muted lead">Lookup records across all system modules by Phone or Tuition Code.</p>
                </div>

                {/* Refined Search Card */}
                <Card className="mb-4 shadow-sm border-0 bg-white" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <Card.Body className="p-3 p-md-4">
                        <Form onSubmit={handleSearch}>
                            <Row className="justify-content-center">
                                <Col lg={10}>
                                    <div className="search-bar-integrated d-flex flex-column flex-md-row gap-0 shadow-sm border-0 bg-white" style={{ borderRadius: '12px', border: '2px solid #007bff', overflow: 'hidden' }}>
                                        <div className="px-3 py-1 border-end d-none d-md-flex align-items-center bg-light">
                                            <Form.Select
                                                value={searchType}
                                                onChange={(e) => setSearchType(e.target.value)}
                                                className="border-0 bg-transparent fw-bold text-primary py-0 mt-1"
                                                style={{ minWidth: '160px', cursor: 'pointer', outline: 'none', boxShadow: 'none', fontSize: '1.2rem' }}
                                            >
                                                <option value="phone">Phone No</option>
                                                <option value="tuition">Tuition Code</option>
                                            </Form.Select>
                                        </div>

                                        {/* Mobile Select */}
                                        <div className="d-md-none p-2 border-bottom">
                                            <Form.Select
                                                value={searchType}
                                                onChange={(e) => setSearchType(e.target.value)}
                                                className="border-0 bg-transparent fw-bold text-primary w-100 py-0"
                                            >
                                                <option value="phone">Phone Number Search</option>
                                                <option value="tuition">Tuition Code Search</option>
                                            </Form.Select>
                                        </div>

                                        <div className="flex-grow-1 d-flex align-items-center px-4 py-1">
                                            <Form.Control
                                                type="text"
                                                placeholder={searchType === 'phone' ? "Enter phone number (e.g. 017...)" : "Enter tuition code (e.g. TS-1234)"}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="border-0 shadow-none fs-4 py-0"
                                                style={{ outline: 'none' }}
                                            />
                                        </div>

                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={loading}
                                            className="px-5 py-2 fw-bold d-flex align-items-center justify-content-center fs-5"
                                            style={{ minWidth: '180px', borderRadius: '0' }}
                                        >
                                            {loading ? <Spinner animation="border" size="sm" /> : <><FaSearch className="me-2" /> SEARCH</>}
                                        </Button>
                                    </div>
                                    <div className="mt-3 text-center text-muted fs-6">
                                        <span className="me-3 fw-bold">Quick Search:</span>
                                        <Badge bg="light" text="dark" className="me-2 px-3 py-2 cursor-pointer grow-on-hover shadow-sm fs-6" style={{ cursor: 'pointer' }} onClick={() => setSearchType('phone')}>Phone Search</Badge>
                                        <Badge bg="light" text="dark" className="px-3 py-2 cursor-pointer grow-on-hover shadow-sm fs-6" style={{ cursor: 'pointer' }} onClick={() => setSearchType('tuition')}>Tuition Code Search</Badge>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Summary Section */}
                {results && !loading && matchSummary.length > 0 && (
                    <div className="mt-4 mb-5">
                        <div className="d-flex align-items-center mb-4">
                            <h3 className="fw-bold mb-0 text-dark display-6" style={{ fontSize: '2rem' }}>Search Insights</h3>
                            <hr className="flex-grow-1 ms-3 opacity-10" />
                        </div>
                        <Row className="g-3">
                            {matchSummary.map((item) => (
                                <Col key={item.id} xs={6} sm={4} md={3} lg={2} xl={2}>
                                    <div
                                        onClick={() => scrollToCategory(item.id)}
                                        className="summary-card-elegant h-100 p-3 rounded-4 shadow-sm d-flex flex-column align-items-center justify-content-center text-center transition-all position-relative"
                                        style={{
                                            background: 'white',
                                            cursor: 'pointer',
                                            minHeight: '110px',
                                            border: '2px solid #007bff',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: '0 4px 12px rgba(0,123,255,0.08)'
                                        }}
                                    >
                                        <div className="label-text mb-1 text-uppercase fw-black text-dark" style={{ fontSize: '0.9rem', letterSpacing: '0.02em' }}>
                                            {item.label}
                                        </div>
                                        <div className="count-text h1 mb-0 fw-black" style={{ color: '#1a252f' }}>
                                            {item.count}
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>

                        <style>{`
                            .summary-card-elegant {
                                border: 2px solid #007bff !important;
                            }
                            .summary-card-elegant:hover {
                                transform: translateY(-8px);
                                box-shadow: 0 12px 24px rgba(0,123,255,0.15) !important;
                                border-color: #0056b3 !important;
                                background-color: #f8fbff !important;
                            }
                            .fw-black {
                                font-weight: 900;
                            }
                        `}</style>
                    </div>
                )}

                {loading && (
                    <div className="text-center my-5 py-5">
                        <Spinner animation="border" variant="primary" style={{ width: '3.5rem', height: '3.5rem', borderWidth: '0.25em' }} />
                        <p className="mt-3 fw-bold text-primary h5">Searching records...</p>
                    </div>
                )}

                {results && !loading && (
                    <div className="results-container">
                        {renderTable("guardianApplies", "Guardian Applications", results.guardianApplies, [
                            { key: 'studentName', label: 'Student Name' },
                            { key: 'phone', label: 'Phone' },
                            { key: 'tuitionCode', label: 'Tuition Code' },
                            { key: 'appliedAt', label: 'Applied Date', render: (item) => formatDate(item.appliedAt) },
                            { key: 'status', label: 'Status' }
                        ])}

                        {renderTable("leads", "Leads", results.leads, [
                            { key: 'name', label: 'Name' },
                            { key: 'phone', label: 'Phone' },
                            { key: 'status', label: 'Status' },
                            { key: 'tuitionCode', label: 'Code' }
                        ])}

                        {renderTable("phones", "Spam/Best/Express", results.phones, [
                            { key: 'phone', label: 'Phone' },
                            {
                                label: 'Status',
                                render: (item) => (
                                    <div className="d-flex gap-1 flex-wrap">
                                        {item.isSpam && <Badge bg="danger" className="rounded-pill px-3">Spam</Badge>}
                                        {item.isBest && <Badge bg="success" className="rounded-pill px-3">Best</Badge>}
                                        {item.isExpress && <Badge bg="info" className="rounded-pill px-3 text-white">Express</Badge>}
                                        {!item.isSpam && !item.isBest && !item.isExpress && <Badge bg="secondary" className="rounded-pill px-3">Normal</Badge>}
                                    </div>
                                )
                            },
                            { key: 'note', label: 'Note' }
                        ])}

                        {renderTable("teachers", "Registered Teachers", results.teachers, [
                            { key: 'premiumCode', label: 'Premium Code' },
                            { key: 'name', label: 'Name' },
                            { key: 'phone', label: 'Primary Phone' },
                            { key: 'alternativePhone', label: 'Alt Phone' },
                            { key: 'whatsapp', label: 'WhatsApp' },
                            { key: 'status', label: 'Status' }
                        ])}

                        {renderTable("tuitions", "Tuition Records", results.tuitions, [
                            { key: 'tuitionCode', label: 'Code' },
                            { key: 'city', label: 'Location' },
                            { key: 'area', label: 'Area' },
                            { key: 'guardianNumber', label: 'Guardian' },
                            { key: 'tutorNumber', label: 'Tutor' },
                            { key: 'status', label: 'Status' },
                            { key: 'lastUpdate', label: 'Last Update', render: (item) => formatDate(item.lastUpdate) },
                            { key: 'lastUpdateComment', label: 'L. Update Comment' },
                            { key: 'nextUpdateDate', label: 'Next Update', render: (item) => formatDate(item.nextUpdateDate) },
                            { key: 'nextUpdateComment', label: 'N. Update Comment' }
                        ])}

                        {renderTable("tuitionApplies", "Tutor Applications", results.tuitionApplies, [
                            { key: 'name', label: 'Tutor' },
                            { key: 'phone', label: 'Phone' },
                            { key: 'tuitionCode', label: 'Code' },
                            { key: 'status', label: 'Status' }
                        ])}

                        {renderTable("teacherPayments", "Teacher Payments", results.teacherPayments, [
                            { key: 'tuitionCode', label: 'Code' },
                            { key: 'personalPhone', label: 'Teacher No' },
                            { key: 'amount', label: 'Amount' },
                            { key: 'status', label: 'Status' }
                        ])}

                        {renderTable("payments", "Payments", results.payments, [
                            { key: 'tuitionCode', label: 'Code' },
                            { key: 'tutorNumber', label: 'Teacher No' },
                            { key: 'receivedTk', label: 'Last Received TK' },
                            { key: 'duePayment', label: 'Due TK' },
                            { key: 'totalReceivedTk', label: 'Total Received TK' },
                            { key: 'paymentStatus', label: 'Status' }
                        ])}

                        {renderTable("refunds", "Refund Requests", results.refunds, [
                            { key: 'tuitionCode', label: 'Code' },
                            { key: 'personalPhone', label: 'Teacher No' },
                            { key: 'amount', label: 'Amount' },
                            { key: 'status', label: 'Status' }
                        ])}

                        {renderTable("taskDatas", "Task Data", results.taskDatas, [
                            { key: 'tuitionCode', label: 'Code' },
                            { key: 'taskType', label: 'Type' },
                            { key: 'status', label: 'Status' },
                            { key: 'note', label: 'Note' }
                        ])}

                        {matchSummary.length === 0 && (
                            <div className="text-center my-5 py-5 bg-white border shadow-sm rounded-4">
                                <FaSearch className="text-muted opacity-25 display-1 mb-3" />
                                <h3 className="fw-bold text-dark">No matches found</h3>
                                <p className="text-muted mb-0">We couldn't find any results for "{searchTerm}".</p>
                            </div>
                        )}
                    </div>
                )}
            </Container>
            <ToastContainer position="bottom-right" theme="colored" />
            <style>
                {`
                    body {
                        background-color: #f7f9fc;
                        font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    }

                    .grow-on-hover {
                        transition: all 0.2s ease-in-out;
                    }
                    .grow-on-hover:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 15px rgba(0,0,0,0.1) !important;
                    }

                    .search-bar-integrated {
                        transition: border-color 0.3s, box-shadow 0.3s;
                    }
                    .search-bar-integrated:focus-within {
                        border-color: #007bff !important;
                        box-shadow: 0 0 0 4px rgba(0,123,255,0.1) !important;
                    }

                    .table thead th {
                        background-color: #f8f9fa;
                        font-weight: 700;
                        text-transform: uppercase;
                        font-size: 0.75rem;
                        letter-spacing: 0.5px;
                        color: #555;
                        border-bottom: 2px solid #dee2e6;
                    }

                    .card {
                        transition: transform 0.3s;
                    }
                `}
            </style>
        </>
    );
};

export default GeneralPage;
