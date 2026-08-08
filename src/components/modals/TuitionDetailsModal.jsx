import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { FaCopy } from 'react-icons/fa';

const fieldConfig = [
    { name: 'tuitionCode', label: 'Tuition Code', group: 'details', col: 4, type: 'text' },
    { name: 'wantedTeacher', label: 'Wanted Teacher', group: 'details', col: 4, type: 'text' },
    { name: 'student', label: 'Student', group: 'details', col: 4, type: 'text' },

    { name: 'institute', label: 'Institute', group: 'details', col: 4, type: 'text' },
    { name: 'class', label: 'Class', group: 'details', col: 4, type: 'text' },
    { name: 'medium', label: 'Medium', group: 'details', col: 4, type: 'text' },

    { name: 'subject', label: 'Subject', group: 'details', col: 4, type: 'text' },
    { name: 'day', label: 'Day', group: 'details', col: 4, type: 'text' },
    { name: 'time', label: 'Time', group: 'details', col: 4, type: 'text' },

    { name: 'salary', label: 'Salary', group: 'details', col: 4, type: 'text' },
    { name: 'city', label: 'City', group: 'details', col: 4, type: 'select' },
    { name: 'area', label: 'Area', group: 'details', col: 4, type: 'select' },

    { name: 'location', label: 'Location', group: 'details', col: 4, type: 'text' },
    { name: 'joining', label: 'Joining Date', group: 'details', col: 4, type: 'text' },
    { name: 'guardianNumber', label: 'Guardian Number', group: 'details', col: 4, type: 'text' },
    { name: 'mediaFee', label: 'Media Fee', group: 'details', col: 4, type: 'text' },

    { name: 'guardian_source_medium', label: 'গার্জিয়ান কিভাবে আমাদের সম্পর্কে জানলো', group: 'admin', col: 6, type: 'text' },
    { name: 'status', label: 'Status', group: 'admin', col: 6, type: 'select', options: ['available', 'given number', 'guardian meet', 'demo class running', 'confirm', 'cancel'] },
    { name: 'note', label: 'Guardian Demand (Agent)', group: 'admin', col: 6, type: 'text' },
    { name: 'guardianDemandForPublic', label: 'Guardian Demand (Public)', group: 'admin', col: 6, type: 'text' },
    { name: 'tuitionType', label: 'Tuition Type', group: 'admin', col: 6, type: 'text' },
    { name: 'tutorNumber', label: 'Teacher Number', group: 'admin', col: 6, type: 'text' },
    { name: 'lastAvailableCheck', label: 'Last Available Check', group: 'admin', col: 6, type: 'datetime-local' },
    { name: 'lastUpdate', label: 'Last Update', group: 'admin', col: 6, type: 'datetime-local' },
    { name: 'lastUpdateComment', label: 'Last Update Comment', group: 'admin', col: 6, type: 'text' },

    { name: 'nextUpdateDate', label: 'Next Update Date', group: 'admin', col: 6, type: 'datetime-local' },
    { name: 'nextUpdateComment', label: 'Next Update Comment', group: 'admin', col: 6, type: 'text' },

    { name: 'comment1', label: 'Cancel Teacher 1', group: 'admin', col: 6, type: 'text' },
    { name: 'comment2', label: 'Cancel Teacher 2', group: 'admin', col: 6, type: 'text' },
    { name: 'tuitionCancelReason', label: 'Tuition Cancel Reason', group: 'admin', col: 6, type: 'text' },
    { name: 'tuitionCancelReasonPublic', label: 'Tuition Cancel Reason Public', group: 'admin', col: 6, type: 'text' },
    { name: 'guardianBehavior', label: 'Guardian Behavior', group: 'admin', col: 6, type: 'text' },
    { name: 'agentComment', label: 'Agent Comment', group: 'admin', col: 12, type: 'text' },

    { name: 'isPublish', label: 'Publish', group: 'admin', col: 4, type: 'switch', defaultValue: false },
    { name: 'isUrgent', label: 'Is Emergency?', group: 'admin', col: 4, type: 'switch', defaultValue: false },
    { name: 'isWhatsappApply', label: 'Apply via WhatsApp?', group: 'admin', col: 4, type: 'switch', defaultValue: false },
    { name: 'isReviewDone', label: 'Review Done?', group: 'admin', col: 4, type: 'switch', defaultValue: false },
    { name: 'assignedTo', label: 'Assigned To', group: 'admin', col: 6, type: 'text' },
    { name: 'createdBy', label: 'Created By', group: 'admin', col: 6, type: 'text' },
    { name: 'updatedBy', label: 'Updated By', group: 'admin', col: 6, type: 'text' },
];

const formatDateTimeDisplay = (isoString) => {
    if (!isoString) return '-';

    const localString = isoString.endsWith('Z') ? isoString.slice(0, -1) : isoString;

    const dt = new Date(localString);

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

export default function TuitionDetailsModal({ show, onHide, detailsData, onCopy }) {
    const groups = fieldConfig.reduce((acc, field) => {
        acc[field.group] = acc[field.group] || [];
        acc[field.group].push(field);
        return acc;
    }, {});

    const displayValue = (field) => {
        const val = detailsData?.[field.name];

        if (field.type === 'switch') {
            return val ? 'Yes' : 'No';
        }

        if (field.type === 'datetime-local') {
            return formatDateTimeDisplay(val);
        }

        if (field.name === 'salary') {
            return val && /taka|tk/i.test(val.toString()) ? val : (val ? val.toString().trim() + ' taka' : '-');
        }

        return val || '-';
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            centered
            backdrop="static"
            keyboard={false}
            contentClassName="shadow-lg rounded"
            style={{ maxHeight: '90vh' }}
        >
            <Modal.Header
                closeButton
                style={{
                    backgroundColor: '#0d6efd',
                    color: 'white',
                    borderBottom: 'none',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1050,
                }}
                className="d-flex align-items-center justify-content-between"
            >
                <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                    Tuition Details
                    {detailsData?.assignedTo ? (
                        <span
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                backgroundColor: 'rgba(255,255,255,0.25)',
                                border: '1px solid rgba(255,255,255,0.5)',
                                borderRadius: '999px',
                                padding: '2px 10px',
                                letterSpacing: '0.02em',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            👤 {detailsData.assignedTo}
                        </span>
                    ) : (
                        <span
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '999px',
                                padding: '2px 10px',
                                opacity: 0.8,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Unassigned
                        </span>
                    )}
                    {onCopy && (
                        <Button
                            size="sm"
                            onClick={() => onCopy(detailsData)}
                            style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                borderRadius: '999px',
                                padding: '5px 16px',
                                whiteSpace: 'nowrap',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                                color: '#0d6efd',
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.15)',
                                letterSpacing: '0.02em',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'scale(1.06)';
                                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.2)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.15)';
                            }}
                            title="Copy this tuition data to a new create form"
                        >
                            <FaCopy style={{ fontSize: '0.85rem' }} /> Copy as New
                        </Button>
                    )}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body
                className="bg-light"
                style={{
                    maxHeight: 'calc(90vh - 140px)',
                    overflowY: 'auto',
                    position: 'relative',
                    padding: '1rem 1.5rem',
                }}
            >
                {Object.entries(groups).map(([groupName, fields]) => (
                    <div
                        key={groupName}
                        className="mb-5 p-3 rounded"
                        style={{
                            backgroundColor: groupName === 'admin' ? '#e9f0ff' : '#fefefe',
                            border: '1px solid rgba(13,110,253,0.2)',
                            boxShadow: '0 0 10px rgba(13, 110, 253, 0.05)',
                        }}
                    >
                        <h5
                            className="mb-4 text-capitalize fw-semibold"
                            style={{ borderBottom: '2px solid rgba(13, 110, 253, 0.5)', paddingBottom: '0.5rem' }}
                        >
                            {groupName === 'admin' ? 'Admin Info' : 'Tuition Details'}
                        </h5>

                        <Row className="gy-3">
                            {fields.map(field => (
                                <Col md={field.col || 6} key={field.name}>
                                    <div>
                                        <label className="fw-semibold">{field.label}</label>
                                        <div
                                            style={{
                                                minHeight: '38px',
                                                padding: '6px 12px',
                                                backgroundColor: 'white',
                                                borderRadius: '0.375rem',
                                                border: '1.5px solid rgba(13,110,253,0.3)',
                                                boxShadow: '0 0 6px rgba(13,110,253,0.12)',
                                                color: '#212529',
                                                userSelect: 'text',
                                                whiteSpace: 'pre-wrap',
                                            }}
                                        >
                                            {displayValue(field)}
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))}
                {/* Confirmation Follow-up History */}
                {(detailsData?.status === 'confirm' || (detailsData?.confirmationFollowUps && detailsData.confirmationFollowUps.length > 0)) && (
                    <div
                        className="mb-5 p-3 rounded"
                        style={{
                            backgroundColor: '#fff3cd',
                            border: '1px solid rgba(255, 193, 7, 0.4)',
                            boxShadow: '0 0 10px rgba(255, 193, 7, 0.05)',
                        }}
                    >
                        <h5
                            className="mb-4 text-capitalize fw-semibold"
                            style={{ borderBottom: '2px solid rgba(255, 193, 7, 0.8)', paddingBottom: '0.5rem', color: '#856404' }}
                        >
                            Confirmation Follow-up History
                        </h5>
                        {(!detailsData.confirmationFollowUps || detailsData.confirmationFollowUps.length === 0) ? (
                            <div className="text-muted text-center py-3">No confirmation follow-ups logged yet.</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered table-hover mb-0 bg-white">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>SL</th>
                                            <th>Last Follow-up Date</th>
                                            <th>Last Follow-up Comment</th>
                                            <th>Next Follow-up Date</th>
                                            <th>Next Follow-up Comment</th>
                                            <th>Guardian Feedback</th>
                                            <th>Created By</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailsData.confirmationFollowUps.map((followUp, idx) => (
                                            <tr key={followUp._id || idx}>
                                                <td>{idx + 1}</td>
                                                <td>{formatDateTimeDisplay(followUp.lastFollowUpDate)}</td>
                                                <td>{followUp.lastFollowUpComment || '-'}</td>
                                                <td>{formatDateTimeDisplay(followUp.nextFollowUpDate)}</td>
                                                <td>{followUp.nextFollowUpComment || '-'}</td>
                                                <td>{followUp.guardianFeedback || '-'}</td>
                                                <td>
                                                    <span className="badge bg-secondary">{followUp.createdBy || '-'}</span>
                                                </td>
                                                <td>{formatDateTimeDisplay(followUp.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer
                style={{
                    backgroundColor: '#f8f9fa',
                    borderTop: '3px solid rgba(13,110,253,0.3)',
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1050,
                }}
                className="d-flex justify-content-end"
            >
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
