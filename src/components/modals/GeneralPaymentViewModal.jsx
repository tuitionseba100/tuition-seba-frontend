import React from 'react';
import { Modal, Button, Row, Col, Table } from 'react-bootstrap';

const GeneralPaymentViewModal = ({ show, onHide, detailsData, formatDate, onEdit, onDelete }) => {
    return (
        <Modal show={show} onHide={onHide} size="lg" centered contentClassName="shadow-lg">
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
                                    <p className="mb-1"><strong>Salary:</strong> TK. {detailsData.tuitionSalary || 0}</p>
                                    <p className="mb-1"><strong>Total Payment:</strong> TK. {detailsData.totalPaymentTk || 0}</p>
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
                                    <Table bordered className="mb-0 text-center">
                                        <thead className="table-secondary">
                                            <tr>
                                                <th>Inst.</th>
                                                <th>Amount</th>
                                                <th>Method</th>
                                                <th>Number</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1st</td>
                                                <td className="text-primary fw-bold">TK. {detailsData.receivedTk}</td>
                                                <td className="text-muted small">{detailsData.paymentType || '-'}</td>
                                                <td className="small">{detailsData.paymentNumber || '-'}</td>
                                                <td>{formatDate(detailsData.paymentReceivedDate)}</td>
                                            </tr>
                                            {detailsData.receivedTk2 || detailsData.paymentReceivedDate2 ? (
                                                <tr>
                                                    <td>2nd</td>
                                                    <td className="text-primary fw-bold">TK. {detailsData.receivedTk2 || 0}</td>
                                                    <td className="text-muted small">{detailsData.paymentType2 || '-'}</td>
                                                    <td className="small">{detailsData.paymentNumber2 || '-'}</td>
                                                    <td>{formatDate(detailsData.paymentReceivedDate2)}</td>
                                                </tr>
                                            ) : null}
                                            {detailsData.receivedTk3 || detailsData.paymentReceivedDate3 ? (
                                                <tr>
                                                    <td>3rd</td>
                                                    <td className="text-primary fw-bold">TK. {detailsData.receivedTk3 || 0}</td>
                                                    <td className="text-muted small">{detailsData.paymentType3 || '-'}</td>
                                                    <td className="small">{detailsData.paymentNumber3 || '-'}</td>
                                                    <td>{formatDate(detailsData.paymentReceivedDate3)}</td>
                                                </tr>
                                            ) : null}
                                            {detailsData.receivedTk4 || detailsData.paymentReceivedDate4 ? (
                                                <tr>
                                                    <td>4th</td>
                                                    <td className="text-primary fw-bold">TK. {detailsData.receivedTk4 || 0}</td>
                                                    <td className="text-muted small">{detailsData.paymentType4 || '-'}</td>
                                                    <td className="small">{detailsData.paymentNumber4 || '-'}</td>
                                                    <td>{formatDate(detailsData.paymentReceivedDate4)}</td>
                                                </tr>
                                            ) : null}
                                            <tr className="table-info fw-bold">
                                                <td>Discount</td>
                                                <td colSpan="4">
                                                    TK. {detailsData.discount || 0}
                                                </td>
                                            </tr>
                                            <tr className="table-warning fw-bold align-middle" style={{ fontSize: '1.05rem', backgroundColor: '#fff3cd' }}>
                                                <td className="text-dark">Due Amount</td>
                                                <td colSpan="4" className="text-danger">TK. {detailsData.duePayment}</td>
                                            </tr>
                                            <tr className="table-success fw-bold align-middle" style={{ fontSize: '1.1rem' }}>
                                                <td className="text-success">Total Received</td>
                                                <td colSpan="4" className="text-success">TK. {detailsData.totalReceivedTk}</td>
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
            <Modal.Footer className="d-flex justify-content-between bg-light">
                <div>
                    <Button variant="danger" onClick={() => onDelete(detailsData._id)} className="me-2">
                        🗑️ Delete
                    </Button>
                    <Button variant="warning" onClick={() => onEdit(detailsData)}>
                        ✏️ Edit
                    </Button>
                </div>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default React.memo(GeneralPaymentViewModal);
