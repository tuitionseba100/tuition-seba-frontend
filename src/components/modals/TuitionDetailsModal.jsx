import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

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

    { name: 'status', label: 'Status', group: 'admin', col: 6, type: 'select', options: ['available', 'given number', 'guardian meet', 'demo class running', 'confirm', 'cancel'] },
    { name: 'note', label: 'Comment', group: 'admin', col: 6, type: 'text' },
    { name: 'tutorNumber', label: 'Teacher Number', group: 'admin', col: 6, type: 'text' },
    { name: 'lastAvailableCheck', label: 'Last Available Check', group: 'admin', col: 6, type: 'datetime-local' },
    { name: 'lastUpdate', label: 'Last Update', group: 'admin', col: 6, type: 'datetime-local' },
    { name: 'lastUpdateComment', label: 'Last Update Comment', group: 'admin', col: 6, type: 'text' },

    { name: 'nextUpdateDate', label: 'Next Update Date', group: 'admin', col: 6, type: 'datetime-local' },
    { name: 'nextUpdateComment', label: 'Next Update Comment', group: 'admin', col: 6, type: 'text' },

    { name: 'comment1', label: 'Comment 1', group: 'admin', col: 6, type: 'text' },
    { name: 'comment2', label: 'Comment 2', group: 'admin', col: 6, type: 'text' },

    { name: 'isPublish', label: 'Publish', group: 'admin', col: 4, type: 'switch', defaultValue: false },
    { name: 'isUrgent', label: 'Is Emergency?', group: 'admin', col: 4, type: 'switch', defaultValue: false },
    { name: 'isWhatsappApply', label: 'Apply via WhatsApp?', group: 'admin', col: 4, type: 'switch', defaultValue: false },
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


export default function TuitionDetailsModal({ show, onHide, detailsData }) {
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
                <Modal.Title className="fw-bold">Tuition Details</Modal.Title>
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
