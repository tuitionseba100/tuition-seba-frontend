import React, { useState, useEffect } from 'react';
import { Modal, Table } from 'react-bootstrap';
import axios from 'axios';

function AppliedListModal({ tuitionId, tuitionCode, show, onHide }) {
    const [appliedList, setAppliedList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!show || !tuitionId) return;

        setLoading(true);
        axios
            .get(`https://tuition-seba-backend-1.onrender.com/api/tuitionApply/appliedListByTuitionId?tuitionId=${tuitionId}`)
            .then((res) => setAppliedList(res.data))
            .catch(() => setAppliedList([]))
            .finally(() => setLoading(false));
    }, [tuitionId, show]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const optionsDate = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };

        const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
        const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);

        return `${formattedDate} || ${formattedTime}`;
    };

    return (
        <Modal show={show} onHide={onHide} centered size="xl">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title className="w-100 text-center fw-bold">
                    Applied List for Tuition Code:{' '}
                    <span className="text-warning">{tuitionCode || 'N/A'}</span> — Total: {appliedList.length}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4 bg-light">
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : appliedList.length > 0 ? (
                    <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                        <Table responsive striped bordered hover className="shadow-sm">
                            <thead className="bg-dark text-white text-center">
                                <tr>
                                    <th>SL</th>
                                    <th>Premium Code</th>
                                    <th>Phone</th>
                                    <th>Name</th>
                                    <th>Institute</th>
                                    <th>Department</th>
                                    <th>Address</th>
                                    <th>Applied At</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appliedList.map((app, index) => {
                                    const rowStyle = app.isBest
                                        ? { backgroundColor: '#0d6efd', color: 'white' }
                                        : app.isSpam
                                            ? { backgroundColor: '#dc3545', color: 'white' }
                                            : {};

                                    return (
                                        <tr key={app._id} className="align-middle text-center">
                                            <td style={rowStyle}>{index + 1}</td>
                                            <td style={rowStyle}>{app.premiumCode}</td>
                                            <td style={rowStyle}>{app.phone}</td>
                                            <td style={rowStyle}>{app.name}</td>
                                            <td style={rowStyle}>{app.institute}</td>
                                            <td style={rowStyle}>{app.department}</td>
                                            <td style={rowStyle}>{app.address}</td>
                                            <td style={rowStyle}>{formatDate(app.appliedAt)}</td>
                                            <td style={rowStyle}>{app.status}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center text-muted py-4">
                        <h5>No applications found for this tuition.</h5>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default AppliedListModal;
