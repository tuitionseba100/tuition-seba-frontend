import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Row, Col, Card, Spinner, Pagination, Badge, Modal } from 'react-bootstrap';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import { toast } from 'react-toastify';
import { FaSearch, FaTimes, FaEye } from 'react-icons/fa';
import moment from 'moment';
import styled from 'styled-components';
import NavBarPage from './NavbarPage';

const BASE_URL = 'https://tuition-seba-backend-1-lpfs.onrender.com';

const SmsLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(50);
    const [selectedMsg, setSelectedMsg] = useState('');
    const [showMsgModal, setShowMsgModal] = useState(false);

    const [searchInputs, setSearchInputs] = useState({
        search: '',
        category: '',
        status: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        search: '',
        category: '',
        status: ''
    });

    const fetchLogs = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { Authorization: token };

        const { search, category, status } = appliedFilters;

        try {
            const response = await axios.get(
                `${BASE_URL}/api/sms/logs?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(search)}&status=${status}&category=${encodeURIComponent(category)}`,
                { headers }
            );

            if (response.data?.success) {
                setLogs(response.data.logs || []);
                setTotalPages(response.data.totalPages || 1);
                setTotalLogs(response.data.total || 0);
            } else {
                toast.error(response.data?.message || 'Failed to fetch SMS logs');
            }
        } catch (err) {
            console.error('Fetch SMS Logs error:', err);
            toast.error(err.response?.data?.message || 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [currentPage, appliedFilters, limit]);

    const handleSearchInputChange = (field, value) => {
        setSearchInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSearch = () => {
        setAppliedFilters(searchInputs);
        setCurrentPage(1);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleResetFilters = () => {
        const resetFilters = {
            search: '',
            category: '',
            status: ''
        };
        setSearchInputs(resetFilters);
        setAppliedFilters(resetFilters);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        let items = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        items.push(
            <Pagination.Prev
                key="prev"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            />
        );

        if (startPage > 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
            }
        }

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </Pagination.Item>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
            }
            items.push(
                <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }

        items.push(
            <Pagination.Next
                key="next"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            />
        );

        return (
            <Pagination className="justify-content-center mt-3">
                {items}
            </Pagination>
        );
    };

    return (
        <>
            <NavBarPage />
            <Container>
                <Header>
                    <h2 className='text-primary fw-bold'>SMS Sent Logs</h2>
                </Header>

                {/* Search bar styled identically to Premium Teacher Page */}
                <Row className="mt-2 mb-3">
                    <Col md={4}>
                        <Form.Label className="fw-bold">Search</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by phone, message, sender, codes..."
                            value={searchInputs.search}
                            onChange={(e) => handleSearchInputChange('search', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Category</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Category..."
                            value={searchInputs.category}
                            onChange={(e) => handleSearchInputChange('category', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Status</Form.Label>
                        <Form.Select
                            value={searchInputs.status}
                            onChange={(e) => handleSearchInputChange('status', e.target.value)}
                            onKeyPress={handleKeyPress}
                        >
                            <option value="">All</option>
                            <option value="success">Success</option>
                            <option value="failed">Failed</option>
                        </Form.Select>
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Page Limit</Form.Label>
                        <Form.Select
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value))}
                        >
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                        </Form.Select>
                    </Col>

                    <Col md={2} className="d-flex align-items-end">
                        <Row className="g-1 w-100">
                            <Col xs={6}>
                                <Button
                                    variant="success"
                                    onClick={handleSearch}
                                    className="d-flex align-items-center justify-content-center w-100"
                                    disabled={loading}
                                    style={{ height: '38px' }}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaSearch />}
                                </Button>
                            </Col>
                            <Col xs={6}>
                                <Button
                                    variant="danger"
                                    onClick={handleResetFilters}
                                    className="d-flex align-items-center justify-content-center w-100"
                                    style={{ height: '38px' }}
                                >
                                    <FaTimes />
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>SMS Sent Logs ({totalLogs})</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Time</th>
                                        <th>Sent By</th>
                                        <th>Recipient Phone</th>
                                        <th>Category</th>
                                        <th>Tuition Code</th>
                                        <th>Premium Code</th>
                                        <th>Message</th>
                                        <th className="text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="9" className="text-center">
                                                <div className="d-flex justify-content-center align-items-center py-4">
                                                    <Spinner animation="border" variant="primary" />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : logs.length > 0 ? (
                                        logs.map((log, index) => (
                                            <tr key={log._id}>
                                                <td style={{ textAlign: 'center', fontWeight: '700', verticalAlign: 'middle' }}>
                                                    {(currentPage - 1) * limit + index + 1}
                                                </td>
                                                <td style={{ verticalAlign: 'middle' }}>
                                                    {moment(log.createdAt).format('YYYY-MM-DD hh:mm A')}
                                                </td>
                                                <td style={{ verticalAlign: 'middle' }}>{log.sentBy}</td>
                                                <td style={{ verticalAlign: 'middle' }}>{log.phone}</td>
                                                <td style={{ verticalAlign: 'middle' }}>
                                                    <Badge bg="secondary">{log.category || 'General'}</Badge>
                                                </td>
                                                <td style={{ verticalAlign: 'middle' }}>
                                                    {log.tuitionCode ? (
                                                        <>
                                                            <Badge bg="primary">{log.tuitionCode}</Badge>
                                                            {log.hasApplied ? (
                                                                <div className="mt-1">
                                                                    <Badge bg="info" style={{ fontSize: '0.75rem' }}>
                                                                        Applied ({log.applicationStatus || 'pending'})
                                                                    </Badge>
                                                                </div>
                                                            ) : (
                                                                <div className="mt-1">
                                                                    <Badge bg="secondary" style={{ fontSize: '0.75rem' }}>No</Badge>
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                                <td style={{ verticalAlign: 'middle' }}>
                                                    {log.premiumCode ? (
                                                        <Badge bg="info" className="text-dark">{log.premiumCode}</Badge>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                                <td
                                                    style={{
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        maxWidth: '200px',
                                                        verticalAlign: 'middle',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => {
                                                        setSelectedMsg(log.message);
                                                        setShowMsgModal(true);
                                                    }}
                                                    title="Click to view full message"
                                                >
                                                    {log.message && log.message.length > 35
                                                        ? `${log.message.substring(0, 35)}...`
                                                        : log.message
                                                    }
                                                    <FaEye className="text-primary ms-2" />
                                                </td>
                                                <td className="text-center" style={{ verticalAlign: 'middle' }}>
                                                    <Badge bg={log.status === 'success' ? 'success' : 'danger'}>
                                                        {log.status.toUpperCase()}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="text-center py-4 text-muted">
                                                No SMS logs found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>

                {!loading && renderPagination()}

                {/* SMS Content Detail Modal */}
                <Modal show={showMsgModal} onHide={() => setShowMsgModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold text-primary">SMS Message Content</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '1.05rem', lineHeight: '1.5' }}>
                            {selectedMsg}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowMsgModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default SmsLogPage;

// Styled Components matched exactly to PremiumTeacherPage
const Container = styled.div`
  padding: 30px;
  background: #f4f4f9;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h2 {
    font-family: 'Arial', sans-serif;
    color: #333;
  }
`;
