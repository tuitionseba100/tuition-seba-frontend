import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaWhatsapp, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // React Icons
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const TuitionPage = () => {
    const [tuitionList, setTuitionList] = useState([]);
    const [filteredTuitionList, setFilteredTuitionList] = useState([]);
    const [excelTuitionList, setExcelTuitionList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [publishFilter, setPublishFilter] = useState('');
    const [urgentFilter, setUrgentFilter] = useState('');
    const [tuitionData, setTuitionData] = useState({
        tuitionCode: '',
        isPublish: true,
        isUrgent: false,
        wantedTeacher: '',
        student: '',
        institute: '',
        class: '',
        medium: '',
        subject: '',
        time: '',
        day: '',
        salary: '',
        location: '',
        area: '',
        guardianNumber: '',
        status: '',
        tutorNumber: '',
        joining: ''
    });
    const [tuitionCodeSearchQuery, setTuitionCodeSearchQuery] = useState('');
    const [gurdianNoSearchQuery, setGurdianNoSearchQuery] = useState('');
    const [teacherNoSearchQuery, setTeacherNoSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [areaSuggestions, setAreaSuggestions] = useState([]);
    const inputRef = useRef(null);
    const userRole = localStorage.getItem('role');
    const [publishCount, setPublishCount] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [statusCounts, setStatusCounts] = useState({
        available: 0,
        givenNumber: 0,
        demoClassRunning: 0,
        confirm: 0,
        cancel: 0
    });

    useEffect(() => {
        fetchTuitionRecords();
    }, []);

    useEffect(() => {
        fetchTuitionRecords();
    }, [tuitionCodeSearchQuery, gurdianNoSearchQuery, teacherNoSearchQuery, publishFilter, urgentFilter, statusFilter, currentPage]);

    const fetchTuitionRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/tuition/getTableData', {
                params: {
                    page: currentPage,
                    tuitionCode: tuitionCodeSearchQuery,
                    guardianNumber: gurdianNoSearchQuery,
                    tutorNumber: teacherNoSearchQuery,
                    isPublish: publishFilter === "Yes" ? 'true' : publishFilter === "No" ? 'false' : undefined,
                    isUrgent: urgentFilter === "Yes" ? 'true' : urgentFilter === "No" ? 'false' : undefined,
                    status: statusFilter
                }
            });

            setTuitionList(response.data.data);
            setFilteredTuitionList(response.data.data);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);

            fetchSummaryCounts();

        } catch (err) {
            console.error('Error fetching tuition records:', err);
            toast.error("Failed to load tuition records.");
        }
        setLoading(false);
    };

    const fetchSummaryCounts = async () => {
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/tuition/summary', {
                params: {
                    tuitionCode: tuitionCodeSearchQuery,
                    guardianNumber: gurdianNoSearchQuery,
                    tutorNumber: teacherNoSearchQuery,
                    isPublish: publishFilter === "Yes" ? 'true' : publishFilter === "No" ? 'false' : undefined,
                    isUrgent: urgentFilter === "Yes" ? 'true' : urgentFilter === "No" ? 'false' : undefined,
                    status: statusFilter
                }
            });
            setExcelTuitionList(res.data.data);
            setPublishCount(res.data.isPublishTrueCount || 0);
            setStatusCounts({
                available: res.data.available || 0,
                givenNumber: res.data.givenNumber || 0,
                demoClassRunning: res.data.demoClassRunning || 0,
                confirm: res.data.confirm || 0,
                cancel: res.data.cancel || 0
            });
        } catch (err) {
            console.error('Error fetching summary counts:', err);
        }
    };

    const handleExportToExcel = () => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
        const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');

        const fileName = `TuitionList_${formattedDate}_${formattedTime}`;

        const tableHeaders = [
            "Tuition Code", "Published", "Urgent", "Institute", "Wanted Teacher", "Student", "Class",
            "Medium", "Subject", "Time", "Day", "Salary", "Location", "Area",
            "Guardian Number", "Status", "Tutor Number", "Joining"
        ];
        console.log(excelTuitionList);
        const tableData = excelTuitionList.map(tuition => [
            String(tuition.tuitionCode ?? ""),
            tuition.isPublish ? 'Yes' : 'No',
            tuition.isUrgent ? 'Yes' : 'No',
            String(tuition.wantedTeacher ?? ""),
            String(tuition.institute ?? ""),
            String(tuition.student ?? ""),
            String(tuition.class ?? ""),
            String(tuition.medium ?? ""),
            String(tuition.subject ?? ""),
            String(tuition.time ?? "").replace("undefined", ""),
            String(tuition.day ?? ""),
            String(tuition.salary ?? ""),
            String(tuition.location ?? ""),
            String(tuition.area ?? ""),
            String(tuition.guardianNumber ?? ""),
            String(tuition.status ?? ""),
            String(tuition.tutorNumber ?? ""),
            String(tuition.joining ?? "")
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);

        worksheet['!cols'] = [
            { wpx: 100 },  // Tuition Code
            { wpx: 50 },   // Published
            { wpx: 50 },   // Urgent
            { wpx: 150 },  // Wanted Teacher
            { wpx: 100 },  // Student
            { wpx: 50 },   // Class
            { wpx: 80 },   // Medium
            { wpx: 100 },  // Subject
            { wpx: 50 },   // Time
            { wpx: 50 },   // Day
            { wpx: 70 },   // Salary
            { wpx: 100 },  // Location
            { wpx: 80 },   // Area
            { wpx: 100 },  // Guardian Number
            { wpx: 70 },   // Status
            { wpx: 100 },  // Tutor Number
            { wpx: 70 }    // Joining
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tuitions");

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const locations = [
        'Katghor', 'Oxyzen', 'Still Mill Bazar', 'Bondartila', 'Freeport', 'Saltgola Crossing', 'Customs', 'Barek Building',
        'Agrabad', 'Boropol', 'Halishohor', 'Dewanhat', 'Noya bazar', 'Madarbari', 'Lalkhan Bazar', 'Wasa',
        'Dampara', 'Ak khan', 'Khulsi', 'Kajir Dewri', 'Alongkar', 'Andorkilla', 'Jamal khan', 'Panchlish',
        'New Market', 'Bayezid', '2 No Gate', 'Sholosohor', 'Muradpur', 'Chakbazar', 'Baddarhat', 'Rahattarpul', 'GEC',
        'Aturar Depo', 'Kaptai Rastahar Matha', 'Chandgao', 'Baluchora', 'Kalamia Bazar', 'Akbor Shah', 'City Gate'
    ];

    const handleSaveTuition = async () => {
        const updatedTuitionData = {
            ...tuitionData,
            status: tuitionData.status ? tuitionData.status : "available"
        };
        try {
            if (editingId) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/tuition/edit/${editingId}`, updatedTuitionData);
                toast.success("Tuition record updated successfully!");
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/tuition/add', updatedTuitionData);
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
        setCurrentPage(1);
        setShowModal(true);
    };

    const handleDeleteTuition = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this tuition record?");

        if (confirmDelete) {
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/tuition/delete/${id}`);
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

    const handleShare = (tuitionDetails) => {
        const phoneNumber = '+8801540376020';
        const area = tuitionDetails.area ? tuitionDetails.area : '';
        const message = `Tuition Code: ${tuitionDetails.tuitionCode}\n` +
            `Wanted Teacher: ${tuitionDetails.wantedTeacher}\n` +
            `Number of Students: ${tuitionDetails.student}\n` +
            `Class: ${tuitionDetails.class}\n` +
            `Medium: ${tuitionDetails.medium}\n` +
            `Subject: ${tuitionDetails.subject}\n` +
            `Day: ${tuitionDetails.day}\n` +
            `Time: ${tuitionDetails.time}\n` +
            `Salary: ${tuitionDetails.salary}\n` +
            `Location: ${tuitionDetails.location}, ${area}\n` +
            `Joining: ${tuitionDetails.joining}\n\n` +
            `Visit our website: www.tuitionsebaforum.com\n\n` +
            `Whatsapp: ${phoneNumber}`;

        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleAreaChange = (e) => {
        const input = e.target.value;
        setTuitionData({ ...tuitionData, area: input });

        if (input.length > 0) {
            const filteredLocations = locations.filter(loc =>
                loc.toLowerCase().includes(input.toLowerCase())
            );
            setAreaSuggestions(filteredLocations);
        } else {
            setAreaSuggestions([]);
        }
    };

    const handleSelectArea = (selectedArea) => {
        setTuitionData({ ...tuitionData, area: selectedArea });
        setAreaSuggestions([]);
    };

    const handleResetFilters = () => {
        setTuitionCodeSearchQuery('');
        setGurdianNoSearchQuery('');
        setTeacherNoSearchQuery('');
        setPublishFilter('');
        setUrgentFilter('');
        setStatusFilter('');
        setFilteredTuitionList(tuitionList);
    };

    return (
        <>
            <NavBarPage />
            <Container>

                <Header>
                    <h2 className='text-primary fw-bold'>Tuition Dashboard</h2>
                    <Button variant="primary" onClick={() => { setShowModal(true); setEditingId(null); setTuitionData({ tuitionCode: '', wantedTeacher: '', student: '', class: '', medium: '', subject: '', time: '', salary: '', location: '', guardianNumber: '', joining: '' }) }}>
                        Create Tuition
                    </Button>
                </Header>
                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Published</span>
                                        <span>{publishCount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Available</span>
                                        <span>{statusCounts.available}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Given Number</span>
                                        <span>{statusCounts.givenNumber}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Demo Class Running</span>
                                        <span>{statusCounts.demoClassRunning}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Confirm</span>
                                        <span>{statusCounts.confirm}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Cancel</span>
                                        <span>{statusCounts.cancel}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Card.Body>
                </Card>

                {/* Search bar */}
                <Row className="mt-2 mb-3">
                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Tuition Code)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Tuition Code"
                            value={tuitionCodeSearchQuery}
                            onChange={(e) => setTuitionCodeSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Guardian Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Guardian Number"
                            value={gurdianNoSearchQuery}
                            onChange={(e) => setGurdianNoSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Teacher Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Teacher Number"
                            value={teacherNoSearchQuery}
                            onChange={(e) => setTeacherNoSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={1}>
                        <Form.Label className="fw-bold">Publish Status</Form.Label>
                        <Form.Select value={publishFilter} onChange={(e) => setPublishFilter(e.target.value)}>
                            <option value="">All</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </Form.Select>
                    </Col>
                    {/* Add Urgent filter */}
                    <Col md={1}>
                        <Form.Label className="fw-bold">Emergency Status</Form.Label>
                        <Form.Select value={urgentFilter} onChange={(e) => setUrgentFilter(e.target.value)}>
                            <option value="">All</option>
                            <option value="Yes">Urgent</option>
                            <option value="No">Not Urgent</option>
                        </Form.Select>
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Status</Form.Label>
                        <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">All</option>
                            <option value="available">Available</option>
                            <option value="given number">Given Number</option>
                            <option value="guardian meet">Guardian Meet</option>
                            <option value="demo class running">Demo Class Running</option>
                            <option value="confirm">Confirm</option>
                            <option value="cancel">Cancel</option>
                        </Form.Select>
                    </Col>

                    <Col md={1} className="d-flex align-items-end">
                        <Button variant="danger" onClick={handleResetFilters} className="w-100">
                            Reset Filters
                        </Button>
                    </Col>

                </Row>
                <Button variant="success" className="mb-3" onClick={handleExportToExcel}>
                    Export to Excel
                </Button>

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Tuition List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Tuition Code</th>
                                        <th>Published?</th>
                                        <th>Status</th>
                                        <th>Teacher</th>
                                        <th>Institute</th>
                                        <th>Student</th>
                                        <th>Class</th>
                                        <th>Medium</th>
                                        <th>Subject</th>
                                        <th>Day</th>
                                        <th>Time</th>
                                        <th>Salary</th>
                                        <th>Location</th>
                                        <th>Area</th>
                                        <th>Guardian No.</th>
                                        <th>Teacher No.</th>
                                        <th>Joining Date</th>
                                        <th>Comment</th>
                                        <th>Emergency?</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="20" className="text-center">
                                                <div className="d-flex justify-content-center align-items-center" style={{ position: 'absolute', top: '90%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vh' }}>
                                                    <Spinner animation="border" variant="primary" size="lg" />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTuitionList.map((tuition, index) => (
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
                            ${tuition.status === "guardian meet" ? "bg-secondary" : ""}
                            ${tuition.status === "demo class running" ? "bg-warning" : ""}
                            ${tuition.status === "confirm" ? "bg-info" : ""}
                            ${tuition.status === "cancel" ? "bg-danger" : ""}`}
                                                    >
                                                        {tuition.status}
                                                    </span>
                                                </td>

                                                <td>{tuition.wantedTeacher}</td>
                                                <td>{tuition.institute}</td>
                                                <td>{tuition.student}</td>
                                                <td>{tuition.class}</td>
                                                <td>{tuition.medium}</td>
                                                <td>{tuition.subject}</td>
                                                <td>{tuition.day}</td>
                                                <td>{tuition.time === "undefined" ? " " : tuition.time}</td>
                                                <td>{tuition.salary}</td>
                                                <td>{tuition.location}</td>
                                                <td>{tuition.area ? tuition.area : ""}</td>
                                                <td>{tuition.guardianNumber}</td>
                                                <td>{tuition.tutorNumber}</td>
                                                <td>{tuition.joining}</td>
                                                <td>{tuition.note}</td>
                                                <td className={tuition.isUrgent ? "text-success fw-bold" : "text-danger fw-bold"}>
                                                    {tuition.isUrgent ? "Yes" : "No"}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                    <Button variant="warning" onClick={() => handleEditTuition(tuition)} className="mr-2">
                                                        <FaEdit />
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleDeleteTuition(tuition._id)}>
                                                        <FaTrashAlt />
                                                    </Button>
                                                    <Button variant="success" onClick={() => handleShare(tuition)}>
                                                        <FaWhatsapp />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </Table>

                        </div>
                        <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
                            <Button
                                variant="outline-primary"
                                className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                <FaChevronLeft /> Previous
                            </Button>

                            <span className="fw-semibold text-primary-emphasis fs-5">
                                Page {currentPage} of {totalPages}
                            </span>

                            <Button
                                variant="outline-primary"
                                className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Next <FaChevronRight />
                            </Button>
                        </div>

                    </Card.Body>
                </Card>

                {/* Create/Edit Tuition Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">{editingId ? "Edit Tuition" : "Create Tuition"}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Form>
                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="isPublish">
                                        <Form.Label className="fw-bold">Publish</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={tuitionData.isPublish ? "Yes" : "No"}
                                            onChange={(e) => setTuitionData({ ...tuitionData, isPublish: e.target.value === "Yes" })}
                                        >
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group controlId="tuitionCode">
                                        <Form.Label className="fw-bold">Tuition Code</Form.Label>
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
                                        <Form.Label className="fw-bold">Wanted Teacher</Form.Label>
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
                                <Col md={4}>
                                    <Form.Group controlId="student">
                                        <Form.Label className="fw-bold">Student</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.student}
                                            onChange={(e) => setTuitionData({ ...tuitionData, student: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="institute">
                                        <Form.Label className="fw-bold">Institute</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.institute}
                                            onChange={(e) => setTuitionData({ ...tuitionData, institute: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="class">
                                        <Form.Label className="fw-bold">Class</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.class}
                                            onChange={(e) => setTuitionData({ ...tuitionData, class: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="medium">
                                        <Form.Label className="fw-bold">Medium</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.medium}
                                            onChange={(e) => setTuitionData({ ...tuitionData, medium: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="subject">
                                        <Form.Label className="fw-bold">Subject</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.subject}
                                            onChange={(e) => setTuitionData({ ...tuitionData, subject: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="day">
                                        <Form.Label className="fw-bold">Day</Form.Label>
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
                                        <Form.Label className="fw-bold">Time</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.time}
                                            onChange={(e) => setTuitionData({ ...tuitionData, time: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>

                                <Col md={6}>
                                    <Form.Group controlId="salary">
                                        <Form.Label className="fw-bold">Salary</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.salary}
                                            onChange={(e) => setTuitionData({ ...tuitionData, salary: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="area">
                                        <Form.Label className="fw-bold">Area</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.area}
                                            onChange={handleAreaChange}
                                            ref={inputRef} // Attach the ref to the input
                                        />
                                        {areaSuggestions.length > 0 && (
                                            <ul style={{
                                                listStyleType: "none",
                                                padding: "5px",
                                                margin: 0,
                                                border: "1px solid #ccc",
                                                position: "absolute",
                                                background: "white",
                                                zIndex: 1000,
                                                width: inputRef.current ? `${inputRef.current.offsetWidth}px` : 'auto', // Match input width
                                                maxHeight: "150px", // Show scrollbar if more than 5 items
                                                overflowY: "auto", // Enable vertical scrolling
                                                boxSizing: "border-box",
                                            }}>
                                                {areaSuggestions.map((area, index) => (
                                                    <li key={index} onClick={() => handleSelectArea(area)} style={{
                                                        padding: "5px",
                                                        cursor: "pointer",
                                                        borderBottom: "1px solid #eee"
                                                    }}>
                                                        {area}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </Form.Group>
                                </Col>

                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="location">
                                        <Form.Label className="fw-bold">Location</Form.Label>
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
                                        <Form.Label className="fw-bold">Joining Date</Form.Label>
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
                                        <Form.Label className="fw-bold">Guardian Number</Form.Label>
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
                                        <Form.Label className="fw-bold">Status</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={tuitionData.status}
                                            onChange={(e) => setTuitionData({ ...tuitionData, status: e.target.value })}
                                            required
                                        >
                                            <option value="available">Available</option>
                                            <option value="given number">Given Number</option>
                                            <option value="guardian meet">Guardian Meet</option>
                                            <option value="demo class running">Demo Class Running</option>
                                            <option value="confirm">Confirm</option>
                                            <option value="cancel">Cancel</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="tutorNumber">
                                        <Form.Label className="fw-bold">Teacher Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.tutorNumber}
                                            onChange={(e) => setTuitionData({ ...tuitionData, tutorNumber: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="note">
                                        <Form.Label className="fw-bold">Comment</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tuitionData.note}
                                            onChange={(e) => setTuitionData({ ...tuitionData, note: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="isUrgent">
                                        <Form.Label className="fw-bold">Is Emergency?</Form.Label>
                                        <Form.Check
                                            type="switch"
                                            id="isUrgentSwitch"
                                            label={tuitionData.isUrgent ? "Yes" : "No"}
                                            checked={tuitionData.isUrgent}
                                            onChange={(e) => setTuitionData({ ...tuitionData, isUrgent: e.target.checked })}
                                        />
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
