import React from 'react';
import { Modal, Button, Row, Col, Table } from 'react-bootstrap';

const GeneralPaymentViewModal = ({ show, onHide, detailsData, formatDate }) => {
    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton style={{ background: '#0d6efd', color: 'white' }}>
                <Modal.Title className="fw-bold">🔎 Payment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {detailsData && (
                    <div className="container-fluid">
                        <Row className="mb-4">
                            <Col md={6}>
                                <h6 className="text-muted text-uppercase small fw-bold">Tuition Information</h6>
                                <div className="bg-light p-3 rounded">
                                    <p className="mb-1"><strong>Tuition Code:</strong> {detailsData.tuitionCode}</p>
                                    <p className="mb-1"><strong>Tutor Name:</strong> {detailsData.tutorName}</p>
                                    <p className="mb-1"><strong>Tutor Number:</strong> {detailsData.tutorNumber}</p>
                                </div>
                            </Col>
                            <Col md={6}>
                                <h6 className="text-muted text-uppercase small fw-bold">Payment Status</h6>
                                <div className="bg-light p-3 rounded h-100">
                                    <div className="mb-2">
                                        <strong>Status:</strong> <span className={`badge ${detailsData.paymentStatus === "fully paid" ? "bg-success" : "bg-danger"}`}>{detailsData.paymentStatus}</span>
                                    </div>
                                    <p className="mb-1"><strong>Reference:</strong> {detailsData.reference || 'N/A'}</p>
                                    <p className="mb-1"><strong>Created By:</strong> {detailsData.createdBy}</p>
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-4">
                            <Col md={12}>
                                <h6 className="text-muted text-uppercase small fw-bold">Financial Summary</h6>
                                <div className="table-responsive">
                                    <Table bordered className="mb-0">
                                        <thead className="table-secondary">
                                            <tr>
                                                <th>Last Received</th>
                                                <th>Due Amount</th>
                                                <th>Total Received</th>
                                                <th>Method</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-primary fw-bold">TK. {detailsData.receivedTk}</td>
                                                <td className="text-danger fw-bold">TK. {detailsData.duePayment}</td>
                                                <td className="text-success fw-bold">TK. {detailsData.totalReceivedTk}</td>
                                                <td>{detailsData.paymentType} {detailsData.paymentNumber ? `(${detailsData.paymentNumber})` : ''}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-4">
                            <Col md={6}>
                                <h6 className="text-muted text-uppercase small fw-bold">Timeline</h6>
                                <div className="bg-light p-3 rounded">
                                    <p className="mb-1 small text-muted">Created: {detailsData.createdAt}</p>
                                    <p className="mb-1"><strong>Received:</strong> {formatDate(detailsData.paymentReceivedDate)}</p>
                                    <p className="mb-1"><strong>Due Date:</strong> {formatDate(detailsData.duePayDate)}</p>
                                </div>
                            </Col>
                            <Col md={6}>
                                <h6 className="text-muted text-uppercase small fw-bold">Transaction</h6>
                                <div className="bg-light p-3 rounded h-100">
                                    <p className="mb-1"><strong>Transaction ID:</strong> {detailsData.transactionId || 'N/A'}</p>
                                    <p className="mb-1"><strong>Updated By:</strong> {detailsData.updatedBy || 'N/A'}</p>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <h6 className="text-muted text-uppercase small fw-bold">Notes & Comments</h6>
                                <div className="bg-light p-3 rounded">
                                    {detailsData.comment && <div className="mb-3 pb-2 border-bottom"><strong>General:</strong> {detailsData.comment}</div>}
                                    <Row>
                                        <Col md={4} className="border-end"><small className="text-muted d-block">Comment 1</small>{detailsData.comment1 || '-'}</Col>
                                        <Col md={4} className="border-end"><small className="text-muted d-block">Comment 2</small>{detailsData.comment2 || '-'}</Col>
                                        <Col md={4}><small className="text-muted d-block">Comment 3</small>{detailsData.comment3 || '-'}</Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default React.memo(GeneralPaymentViewModal);
