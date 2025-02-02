import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // React Icons
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const TuitionPage = () => {
    const [tuitionList, setTuitionList] = useState([]);
    const [filteredTuitionList, setFilteredTuitionList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [publishFilter, setPublishFilter] = useState('');
    const [tuitionData, setTuitionData] = useState({
        tuitionCode: '',
        isPublish: true,
        wantedTeacher: '',
        student: '',
        class: '',
        medium: '',
        subject: '',
        time: '',
        day: '',
        salary: '',
        location: '',
        guardianNumber: '',
        status: '',
        joining: ''
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTuitionRecords();
    }, []);

    useEffect(() => {
        let filteredData = tuitionList;
        if (searchQuery) {
            filteredData = filteredData.filter(tuition =>
                tuition.tuitionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tuition.guardianNumber.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (publishFilter) {
            const isPublished = publishFilter === "Yes";
            filteredData = filteredData.filter(tuition => tuition.isPublish === isPublished);
        }
        setFilteredTuitionList(filteredData);
    }, [searchQuery, publishFilter, tuitionList]);

    const fetchTuitionRecords = async () => {
        try {
            const response = await axios.get('https://tuition-seba-backend.onrender.com/api/tuition/all');
            setTuitionList(response.data);
            setFilteredTuitionList(response.data);
            console.log(localStorage.getItem('token'));
        } catch (err) {
            console.error('Error fetching tuition records:', err);
            toast.error("Failed to load tuition records.");
        }
    };

    const handleSaveTuition = async () => {
        const updatedTuitionData = {
            ...tuitionData,
            status: tuitionData.status ? tuitionData.status : "available"
        };
        try {
            if (editingId) {
                await axios.put(`https://tuition-seba-backend.onrender.com/api/tuition/edit/${editingId}`, updatedTuitionData);
                toast.success("Tuition record updated successfully!");
            } else {
                await axios.post('https://tuition-seba-backend.onrender.com/api/tuition/add', updatedTuitionData);
                toast.success("Tuition record created successfully!");
            }
            setShowModal(false);
            fetchTuitionRecords();
        } catch (err) {
            console.error('Error saving tuition record:', err);
            toast.error("Error saving tuition record.");
        }
    };

    const handleEditTuition = (tuition) => {
        setTuitionData(tuition);
        setEditingId(tuition._id);
        setShowModal(true);
    };

    const handleDeleteTuition = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this tuition record?");

        if (confirmDelete) {
            try {
                await axios.delete(`https://tuition-seba-backend.onrender.com/api/tuition/delete/${id}`);
                toast.success("Tuition record deleted successfully!");
                fetchTuitionRecords();
            } catch (err) {
                console.error('Error deleting tuition record:', err);
                toast.error("Error deleting tuition record.");
            }
        } else {
            toast.info("Deletion canceled");
        }
    };


    return (
        <>
            <NavBarPage />
            <Container>

                <Header>
                    <h2 className='fw-bold text-primary'>Tuition Dashboard</h2>
                    <Button variant="primary" onClick={() => { setShowModal(true); setEditingId(null); setTuitionData({ tuitionCode: '', wantedTeacher: '', student: '', class: '', medium: '', subject: '', time: '', salary: '', location: '', guardianNumber: '', joining: '' }) }}>
                        Create Tuition
                    </Button>
                </Header>

                {/* Search bar */}
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Label className="fw-bold">Search (Tuition code or guardian number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Tuition Code or Guardian Number"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Col>
                    <Col md={3}>
                        <Form.Label className="fw-bold">Publish Status</Form.Label>
                        <Form.Select value={publishFilter} onChange={(e) => setPublishFilter(e.target.value)}>
                            <option value="">All</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </Form.Select>
                    </Col>
                </Row>


                <Table striped bordered hover responsive="lg" className="mt-4">
                    <thead className="table-primary">
                        <tr>
                            <th>SL</th> {/* Added Serial column */}
                            <th>Tuition Code</th>
                            <th>isPublished</th>
                            <th>Status</th>
                            <th>Teacher</th>
                            <th>Student</th>
                            <th>Class</th>
                            <th>Medium</th>
                            <th>Subject</th>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Salary</th>
                            <th>Location</th>
                            <th>Guardian No.</th>
                            <th>Joining Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTuitionList.slice().reverse().map((tuition, index) => (
                            <tr key={tuition._id}>
                                <td>{index + 1}</td>
                                <td>{tuition.tuitionCode}</td>
                                <td className={tuition.isPublish ? "text-success fw-bold" : "text-danger fw-bold"}>
                                    {tuition.isPublish ? "Yes" : "No"}
                                </td>
                                <td>
                                    <span
                                        className={`badge 
            ${tuition.status === "available" ? "bg-success" : ""}
            ${tuition.status === "given number" ? "bg-primary" : ""}
            ${tuition.status === "demo class running" ? "bg-warning" : ""}
            ${tuition.status === "confirm" ? "bg-info" : ""}
            ${tuition.status === "cancel" ? "bg-danger" : ""}`}
                                    >
                                        {tuition.status}
                                    </span>
                                </td>

                                <td>{tuition.wantedTeacher}</td>
                                <td>{tuition.student}</td>
                                <td>{tuition.class}</td>
                                <td>{tuition.medium}</td>
                                <td>{tuition.subject}</td>
                                <td>{tuition.day}</td>
                                <td>{tuition.time === "undefined" ? " " : tuition.time}</td>
                                <td>{tuition.salary}</td>
                                <td>{tuition.location}</td>
                                <td>{tuition.guardianNumber}</td>
                                <td>{tuition.joining}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleEditTuition(tuition)} className="mr-2">
                                        <FaEdit />
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDeleteTuition(tuition._id)}>
                                        <FaTrashAlt />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>


                {/* Create/Edit Tuition Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{editingId ? "Edit Tuition" : "Create Tuition"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="isPublish">
                                        <Form.Label>Publish</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={tuitionData.isPublish ? "Yes" : "No"} // Set the initial value based on isPublish
                                            onChange={(e) => setTuitionData({ ...tuitionData, isPublish: e.target.value === "Yes" })}
                                        >
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId="tuitionCode">
                                        <Form.Label>Tuition Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.tuitionCode}
                                            onChange={(e) => setTuitionData({ ...tuitionData, tuitionCode: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId="wantedTeacher">
                                        <Form.Label>Wanted Teacher</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.wantedTeacher}
                                            onChange={(e) => setTuitionData({ ...tuitionData, wantedTeacher: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="student">
                                        <Form.Label>Student</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.student}
                                            onChange={(e) => setTuitionData({ ...tuitionData, student: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="class">
                                        <Form.Label>Class</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.class}
                                            onChange={(e) => setTuitionData({ ...tuitionData, class: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="medium">
                                        <Form.Label>Medium</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.medium}
                                            onChange={(e) => setTuitionData({ ...tuitionData, medium: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="subject">
                                        <Form.Label>Subject</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.subject}
                                            onChange={(e) => setTuitionData({ ...tuitionData, subject: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="day">
                                        <Form.Label>Day</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.day}
                                            onChange={(e) => setTuitionData({ ...tuitionData, day: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="time">
                                        <Form.Label>Time</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.time}
                                            onChange={(e) => setTuitionData({ ...tuitionData, time: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="salary">
                                        <Form.Label>Salary</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.salary}
                                            onChange={(e) => setTuitionData({ ...tuitionData, salary: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="location">
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.location}
                                            onChange={(e) => setTuitionData({ ...tuitionData, location: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="joining">
                                        <Form.Label>Joining Date</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.joining}
                                            onChange={(e) => setTuitionData({ ...tuitionData, joining: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="guardianNumber">
                                        <Form.Label>Guardian Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.guardianNumber}
                                            onChange={(e) => setTuitionData({ ...tuitionData, guardianNumber: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="status">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={tuitionData.status}
                                            onChange={(e) => setTuitionData({ ...tuitionData, status: e.target.value })}
                                            required
                                        >
                                            <option value="available">Available</option>
                                            <option value="given number">Given Number</option>
                                            <option value="demo class running">Demo Class Running</option>
                                            <option value="confirm">Confirm</option>
                                            <option value="cancel">Cancel</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSaveTuition}>Save</Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer />
            </Container>
        </>
    );
};

export default TuitionPage;

// Styled Components
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
