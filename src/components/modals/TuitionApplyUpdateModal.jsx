import React, { useState } from 'react';
import { Modal, Button, Form, Table, Spinner, InputGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';

const TuitionUpdateModal = ({ show, handleClose }) => {
    const [phone, setPhone] = useState('');
    const [tuitionData, setTuitionData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTuitionStatus = async () => {
        if (!/^\d+$/.test(phone)) {
            toast.error('Please enter a valid phone number!');
            return;
        }

        setLoading(true);
        setTuitionData([]);

        try {
            const response = await fetch(
                `https://tuition-seba-backend-1.onrender.com/api/tuitionApply/getTuitionStatusesByPhone?phone=${phone}`
            );
            if (!response.ok) {
                throw new Error('Server error occurred!');
            }

            const data = await response.json();
            setTuitionData(data);
        } catch (error) {
            toast.error(error.message || 'Unexpected error!');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTuitionStatus();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const optionsDate = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };

        const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
        const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);

        return `${formattedDate} || ${formattedTime}`;
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} centered backdrop="static" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold fs-5">আবেদনকৃত টিউশন স্ট্যাটাস</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSearch}>
                        <Form.Label className="fw-semibold mb-2">Enter phone number:</Form.Label>
                        <InputGroup className="mb-4">
                            <Form.Control
                                type="text"
                                placeholder="যে নম্বর দিয়ে আবেদন করেছিলেন সেটি লিখুন"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                maxLength={15}
                                style={{ fontSize: '14px' }}
                            />
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />{' '}
                                        Loading...
                                    </>
                                ) : (
                                    'Search'
                                )}
                            </Button>
                        </InputGroup>
                    </Form>

                    <div style={{ overflowX: 'auto' }}>
                        <Table striped bordered hover responsive className="text-center" style={{ fontSize: '14px' }}>
                            <thead className="table-light fw-bold">
                                <tr>
                                    <th>Sl</th>
                                    <th>Application Date</th>
                                    <th>Tuition Code</th>
                                    <th>Status</th>
                                    <th>Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tuitionData.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-muted py-3">
                                            No data found.
                                        </td>
                                    </tr>
                                ) : (
                                    tuitionData.slice()
                                        .reverse().map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{formatDate(item.appliedAt)}</td>
                                                <td>{item.tuitionCode}</td>
                                                <td>{item.status}</td>
                                                <td>{item.commentForTeacher || '-'}</td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-center" autoClose={4000} hideProgressBar closeOnClick pauseOnHover />
        </>
    );
};

export default TuitionUpdateModal;
