import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { axiosWithFallback as axios } from '../../services/fetchWithFallback';

export default function ConfirmationFollowUpModal({ show, onHide, tuition, onUpdateSuccess }) {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        lastFollowUpDate: new Date().toISOString().slice(0, 16),
        lastFollowUpComment: '',
        nextFollowUpDate: '',
        nextFollowUpComment: '',
        guardianFeedback: ''
    });

    const token = localStorage.getItem('token');

    // Pre-fill the form with the previously scheduled next follow-up details as default
    useEffect(() => {
        if (show && tuition) {
            const latest = tuition.confirmationFollowUps && tuition.confirmationFollowUps.length > 0
                ? tuition.confirmationFollowUps[tuition.confirmationFollowUps.length - 1]
                : null;

            setFormData({
                lastFollowUpDate: latest && latest.nextFollowUpDate
                    ? new Date(latest.nextFollowUpDate).toISOString().slice(0, 16)
                    : new Date().toISOString().slice(0, 16),
                lastFollowUpComment: latest && latest.nextFollowUpComment
                    ? latest.nextFollowUpComment
                    : '',
                nextFollowUpDate: '',
                nextFollowUpComment: '',
                guardianFeedback: ''
            });
        }
    }, [show, tuition]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.lastFollowUpDate || !formData.guardianFeedback) {
            toast.error('Please enter follow up date and guardian feedback.');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                createdBy: localStorage.getItem('username') || 'System'
            };

            const response = await axios.post(
                `https://tuition-seba-backend-1-lpfs.onrender.com/api/tuition/${tuition._id}/confirmation-followup`,
                payload,
                { headers: { Authorization: token } }
            );

            toast.success('Confirmation follow-up saved successfully!');

            if (onUpdateSuccess) {
                onUpdateSuccess(response.data);
            }
        } catch (error) {
            console.error('Error logging confirmation follow-up:', error);
            toast.error(error.response?.data?.message || 'Failed to save follow-up.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDateTimeDisplay = (isoString) => {
        if (!isoString) return '-';
        const dt = new Date(isoString);
        if (isNaN(dt)) return isoString;
        return dt.toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title className="fw-bold">
                    Confirmation Follow-up & History - {tuition?.tuitionCode}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light">
                <Row className="gy-4">
                    {/* Add New Follow-up Form */}
                    <Col lg={5}>
                        <div className="card p-3 shadow-sm border-0 h-100" style={{ borderRadius: '12px' }}>
                            <h5 className="mb-3 text-primary fw-bold" style={{ borderBottom: '2px solid #0d6efd', paddingBottom: '6px' }}>
                                Log New Follow-up
                            </h5>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Follow-up Date *</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="lastFollowUpDate"
                                        value={formData.lastFollowUpDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <div className="p-3 mb-3 rounded" style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd' }}>
                                    <span className="fw-bold text-sky-900 small d-block mb-1">
                                        📌 ফলো-আপের এজেন্ডা (আজ যা জিজ্ঞাসা করতে হবে)
                                    </span>
                                    <div className="text-secondary small" style={{ whiteSpace: 'pre-wrap' }}>
                                        {formData.lastFollowUpComment || 'No comment specified in previous schedule.'}
                                    </div>
                                </div>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold text-danger">অভিভাবক কি বললেন / Guardian Feedback *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="guardianFeedback"
                                        value={formData.guardianFeedback}
                                        onChange={handleChange}
                                        placeholder="অভিভাবক ফলো-আপে কি বললেন বিস্তারিত লিখুন..."
                                        required
                                    />
                                </Form.Group>

                                <div className="p-3 mb-3 rounded" style={{ backgroundColor: '#fff8e1', border: '1px solid #ffe082' }}>
                                    <h6 className="fw-bold text-warning-emphasis mb-3">
                                        ⏰ পরবর্তী ফলো-আপ সিডিউল (Next Follow-up)
                                    </h6>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold small">পরবর্তী ফলো-আপের তারিখ (Next Follow-up Date)</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            name="nextFollowUpDate"
                                            value={formData.nextFollowUpDate}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-0">
                                        <Form.Label className="fw-semibold small">পরবর্তী ফলো-আপের মন্তব্য (পরের বার কি জিজ্ঞাসা করতে হবে)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="nextFollowUpComment"
                                            value={formData.nextFollowUpComment}
                                            onChange={handleChange}
                                            placeholder="পরের বার ফলো-আপে কি জানতে চাওয়া হবে লিখুন..."
                                        />
                                    </Form.Group>
                                </div>

                                <Button variant="primary" type="submit" className="w-100 fw-bold mt-2" disabled={submitting}>
                                    {submitting ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                                    Save Follow-up
                                </Button>
                            </Form>
                        </div>
                    </Col>

                    {/* History Table */}
                    <Col lg={7}>
                        <div className="card p-3 shadow-sm border-0 h-100" style={{ borderRadius: '12px' }}>
                            <h5 className="mb-3 text-success fw-bold" style={{ borderBottom: '2px solid #198754', paddingBottom: '6px' }}>
                                Follow-up History
                            </h5>
                            {(!tuition?.confirmationFollowUps || tuition.confirmationFollowUps.length === 0) ? (
                                <div className="text-muted text-center py-5">No history found for this tuition.</div>
                            ) : (
                                <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                                    <Table striped bordered hover size="sm" className="bg-white mb-0">
                                        <thead className="table-dark sticky-top">
                                            <tr>
                                                <th>SL</th>
                                                <th>Follow-up</th>
                                                <th>Next Follow-up</th>
                                                <th>Guardian Feedback</th>
                                                <th>Agent</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...tuition.confirmationFollowUps].reverse().map((log, idx) => (
                                                <tr key={log._id || idx}>
                                                    <td>{tuition.confirmationFollowUps.length - idx}</td>
                                                    <td>
                                                        <div className="small fw-semibold">{formatDateTimeDisplay(log.lastFollowUpDate)}</div>
                                                        <div className="text-secondary">{log.lastFollowUpComment || '-'}</div>
                                                    </td>
                                                    <td>
                                                        <div className="small fw-semibold">{formatDateTimeDisplay(log.nextFollowUpDate)}</div>
                                                        <div className="text-secondary">{log.nextFollowUpComment || '-'}</div>
                                                    </td>
                                                    <td>{log.guardianFeedback || '-'}</td>
                                                    <td>
                                                        <span className="badge bg-secondary">{log.createdBy || '-'}</span>
                                                        <div className="text-muted small mt-1" style={{ fontSize: '0.65rem' }}>
                                                            {formatDateTimeDisplay(log.createdAt)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
