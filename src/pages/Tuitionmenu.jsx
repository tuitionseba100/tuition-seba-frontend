import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaWhatsapp, FaChevronLeft, FaChevronRight, FaGlobe, FaInfoCircle, FaBell, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import TuitionModal from '../components/modals/TuitionCreateEditModal';
import TuitionDetailsModal from '../components/modals/TuitionDetailsModal';
import LoadingCard from '../components/modals/LoadingCard';
import AppliedListModal from '../components/modals/TuitionApplyListModal';

const TuitionPage = () => {
    const [tuitionList, setTuitionList] = useState([]);
    const [filteredTuitionList, setFilteredTuitionList] = useState([]);
    const [excelTuitionList, setExcelTuitionList] = useState([]);

    const [searchInputs, setSearchInputs] = useState({
        tuitionCode: '',
        guardianNumber: '',
        teacherNumber: '',
        publishFilter: '',
        urgentFilter: '',
        statusFilter: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        tuitionCode: '',
        guardianNumber: '',
        teacherNumber: '',
        publishFilter: '',
        urgentFilter: '',
        statusFilter: ''
    });

    const [loading, setLoading] = useState(false);
    const [publishCount, setPublishCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [selectedTuition, setSelectedTuition] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsData, setDetailsData] = useState(null);
    const [tuitionNeedsUpdateList, setTuitionNeedsUpdateList] = useState([]);
    const [tuitionNeedsPaymentCreation, setTuitionNeedsPaymentCreation] = useState([]);
    const [showUpdateListModal, setShowUpdateListModal] = useState(false);
    const [showPaymentPendingModal, setShowPaymentPendingModal] = useState(false);

    const [showAppliedModal, setShowAppliedModal] = useState(false);
    const [selectedTuitionId, setSelectedTuitionId] = useState(null);
    const [selectedTuitionCode, setSelectedTuitionCode] = useState(null);
    const role = localStorage.getItem('role');

    const openAppliedListModal = (tuition) => {
        setSelectedTuitionId(tuition._id);
        setSelectedTuitionCode(tuition.tuitionCode);
        setShowAppliedModal(true);
    };

    const handleShowDetails = (tuition) => {
        setDetailsData(tuition);
        setShowDetailsModal(true);
    };

    const handleCreate = () => {
        setSelectedTuition(null);
        setEditingId(null);
        setShowModal(true);
    };

    const handleEdit = (tuition) => {
        setSelectedTuition(tuition);
        setEditingId(tuition._id);
        setShowModal(true);
    };

    const [statusCounts, setStatusCounts] = useState({
        available: 0,
        givenNumber: 0,
        demoClassRunning: 0,
        confirm: 0,
        cancel: 0
    });

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

    const handleResetFilters = () => {
        const resetFilters = {
            tuitionCode: '',
            guardianNumber: '',
            teacherNumber: '',
            publishFilter: '',
            urgentFilter: '',
            statusFilter: ''
        };
        setSearchInputs(resetFilters);
        setAppliedFilters(resetFilters);
        setCurrentPage(1);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        fetchTuitionRecords();
    }, []);

    useEffect(() => {
        fetchTuitionRecords();
    }, [appliedFilters, currentPage]);

    useEffect(() => {
        const fetchAlertData = async () => {
            try {
                const [alertRes, pendingRes] = await Promise.all([
                    axios.get('https://tuition-seba-backend-1.onrender.com/api/tuition/alert-today'),
                    axios.get('https://tuition-seba-backend-1.onrender.com/api/tuition/pending-payment-creation')
                ]);

                setTuitionNeedsUpdateList(alertRes.data);
                setTuitionNeedsPaymentCreation(pendingRes.data);
            } catch (err) {
                console.error('Error fetching tuition data:', err);
                toast.error("Failed to load tuition data.");
            }
        };

        fetchAlertData();
    }, []);

    const fetchTuitionRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/tuition/getTableData', {
                params: {
                    page: currentPage,
                    tuitionCode: appliedFilters.tuitionCode,
                    guardianNumber: appliedFilters.guardianNumber,
                    tutorNumber: appliedFilters.teacherNumber,
                    isPublish: appliedFilters.publishFilter === "Yes" ? 'true' : appliedFilters.publishFilter === "No" ? 'false' : undefined,
                    isUrgent: appliedFilters.urgentFilter === "Yes" ? 'true' : appliedFilters.urgentFilter === "No" ? 'false' : undefined,
                    status: appliedFilters.statusFilter
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
                    tuitionCode: appliedFilters.tuitionCode,
                    guardianNumber: appliedFilters.guardianNumber,
                    tutorNumber: appliedFilters.teacherNumber,
                    isPublish: appliedFilters.publishFilter === "Yes" ? 'true' : appliedFilters.publishFilter === "No" ? 'false' : undefined,
                    isUrgent: appliedFilters.urgentFilter === "Yes" ? 'true' : appliedFilters.urgentFilter === "No" ? 'false' : undefined,
                    status: appliedFilters.statusFilter
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
            "Tuition Code", "Wanted Teacher", "Student",
            "Institute", "Class", "Medium",
            "Subject", "Day", "Time",
            "Salary", "City", "Area",
            "Location", "Joining Date", "Guardian Number",
            "Status", "Comment", "Teacher Number",
            "Last Available Check", "Last Update", "Last Update Comment",
            "Next Update Date", "Next Update Comment",
            "Comment 1", "Comment 2",
            "Publish", "Is Emergency?", "Apply via WhatsApp?",
            "Payment Created?"
        ];

        const tableData = excelTuitionList.map(tuition => [
            String(tuition.tuitionCode ?? ""),
            String(tuition.wantedTeacher ?? ""),
            String(tuition.student ?? ""),
            String(tuition.institute ?? ""),
            String(tuition.class ?? ""),
            String(tuition.medium ?? ""),
            String(tuition.subject ?? ""),
            String(tuition.day ?? ""),
            String(tuition.time ?? "").replace("undefined", ""),
            String(tuition.salary ?? ""),
            String(tuition.city ?? ""),
            String(tuition.area ?? ""),
            String(tuition.location ?? ""),
            String(tuition.joining ?? ""),
            String(tuition.guardianNumber ?? ""),
            String(tuition.status ?? ""),
            String(tuition.note ?? ""),
            String(tuition.tutorNumber ?? ""),
            tuition.lastAvailableCheck ? String(tuition.lastAvailableCheck).substring(0, 16) : "",
            tuition.lastUpdate ? String(tuition.lastUpdate).substring(0, 16) : "",
            String(tuition.lastUpdateComment ?? ""),
            tuition.nextUpdateDate ? String(tuition.nextUpdateDate).substring(0, 16) : "",
            String(tuition.nextUpdateComment ?? ""),
            String(tuition.comment1 ?? ""),
            String(tuition.comment2 ?? ""),
            tuition.isPublish ? 'Yes' : 'No',
            tuition.isUrgent ? 'Yes' : 'No',
            tuition.isWhatsappApply ? 'Yes' : 'No',
            tuition.isPaymentCreated ? 'Yes' : 'No',
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);

        worksheet['!cols'] = [
            { wpx: 100 }, { wpx: 120 }, { wpx: 100 },
            { wpx: 120 }, { wpx: 80 }, { wpx: 80 },
            { wpx: 100 }, { wpx: 70 }, { wpx: 60 },
            { wpx: 80 }, { wpx: 80 }, { wpx: 80 },
            { wpx: 100 }, { wpx: 90 }, { wpx: 100 },
            { wpx: 100 }, { wpx: 120 }, { wpx: 100 },
            { wpx: 140 }, { wpx: 140 }, { wpx: 140 },
            { wpx: 140 }, { wpx: 140 }, { wpx: 100 },
            { wpx: 100 }, { wpx: 60 }, { wpx: 70 }, { wpx: 70 }
            , { wpx: 70 }
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tuitions");

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const handleDeleteTuition = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this tuition record?");
        if (confirmDelete) {
            try {
                setDeleteLoading(true);
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/tuition/delete/${id}`);
                toast.success("Tuition record deleted successfully!");
                await fetchTuitionRecords();
                await fetchSummaryCounts();
            } catch (err) {
                console.error(err);
                toast.error("Error deleting tuition record.");
            } finally {
                setDeleteLoading(false);
            }
        } else {
            toast.info("Deletion canceled");
        }
    };

    const handleShare = (tuitionDetails) => {
        const phoneNumber = '+8801571305804';
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

        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

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

    const statusColors = {
        "available": { bg: "bg-success", text: "text-white" },
        "given number": { bg: "bg-primary", text: "text-white" },
        "guardian meet": { bg: "bg-secondary", text: "text-white" },
        "demo class running": { bg: "bg-warning", text: "text-dark" },
        "confirm": { bg: "bg-info", text: "text-dark" },
        "cancel": { bg: "bg-danger", text: "text-white" },
        "suspended": { bg: "bg-dark", text: "text-white" }
    };

    return (
        <>
            <NavBarPage />
            <Container>

                <Header>
                    <h2 className='text-primary fw-bold'>Tuition Dashboard</h2>
                    <Button variant="primary" onClick={handleCreate}>
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


                <Row className="mt-2 mb-3">
                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Tuition Code)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Tuition Code"
                            value={searchInputs.tuitionCode}
                            onChange={(e) => handleSearchInputChange('tuitionCode', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Guardian Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Guardian Number"
                            value={searchInputs.guardianNumber}
                            onChange={(e) => handleSearchInputChange('guardianNumber', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Teacher Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Teacher Number"
                            value={searchInputs.teacherNumber}
                            onChange={(e) => handleSearchInputChange('teacherNumber', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>

                    <Col md={1}>
                        <Form.Label className="fw-bold">Publish Status</Form.Label>
                        <Form.Select
                            value={searchInputs.publishFilter}
                            onChange={(e) => handleSearchInputChange('publishFilter', e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </Form.Select>
                    </Col>

                    <Col md={1}>
                        <Form.Label className="fw-bold">Emergency</Form.Label>
                        <Form.Select
                            value={searchInputs.urgentFilter}
                            onChange={(e) => handleSearchInputChange('urgentFilter', e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="Yes">Urgent</option>
                            <option value="No">Not Urgent</option>
                        </Form.Select>
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Status</Form.Label>
                        <Form.Select
                            value={searchInputs.statusFilter}
                            onChange={(e) => handleSearchInputChange('statusFilter', e.target.value)}
                        >
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
                        <Button
                            variant="success"
                            onClick={handleSearch}
                            className="d-flex align-items-center justify-content-center gap-1 w-100"
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : <FaSearch />}
                            Search
                        </Button>
                    </Col>
                    <Col md={1} className="d-flex align-items-end">
                        <Button
                            variant="danger"
                            onClick={handleResetFilters}
                            className="d-flex align-items-center justify-content-center w-100"
                        >
                            Reset
                        </Button>
                    </Col>

                </Row>

                <div className="d-flex align-items-center justify-content-center">
                    <h5 className="me-3 d-flex align-items-center gap-2">
                        <FaBell className="text-primary" />
                        <span>Tuitions needs update today: {tuitionNeedsUpdateList.length}</span>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip">Click to see list</Tooltip>}
                        >
                            <Button size="sm" onClick={() => setShowUpdateListModal(true)} className="ms-2">
                                <FaInfoCircle />
                            </Button>
                        </OverlayTrigger>
                    </h5>
                    <h5 className="me-3 d-flex align-items-center gap-2">
                        <FaBell className="text-primary" />
                        <span>Pending payment creation: {tuitionNeedsPaymentCreation.length}</span>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip">Click to see list</Tooltip>}
                        >
                            <Button size="sm" onClick={() => setShowPaymentPendingModal(true)} className="ms-2">
                                <FaInfoCircle />
                            </Button>
                        </OverlayTrigger>
                    </h5>
                </div>

                {role === "superadmin" && (
                    <Button
                        variant="success"
                        className="mb-3 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleExportToExcel}
                        disabled={excelTuitionList.length === 0}
                    >
                        {excelTuitionList.length === 0 ? (
                            <>
                                <Spinner animation="border" size="sm" role="status" />
                                <span>Preparing export...</span>
                            </>
                        ) : (
                            'Export to Excel'
                        )}
                    </Button>
                )}

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Tuition List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Created/Updated By</th>
                                        <th>Tuition Code</th>
                                        <th>Apply Type</th>
                                        <th>Published?</th>
                                        <th>Status</th>
                                        <th>Payment Created?</th>
                                        <th>Last Available Check</th>
                                        <th>Last Update</th>
                                        <th>Last Update Comment</th>
                                        <th>Next Update</th>
                                        <th>Next Update Comment</th>
                                        <th>Teacher</th>
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
                                        <th>Comment</th>
                                        <th style={{ position: 'sticky', right: 0, zIndex: 3, minWidth: '150px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="23" className="text-center">
                                                <div className="d-flex justify-content-center align-items-center" style={{ position: 'absolute', top: '90%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vh' }}>
                                                    <Spinner animation="border" variant="primary" size="lg" />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTuitionList.map((tuition, index) => (
                                            <tr key={tuition._id}>
                                                <td>{index + 1}</td>
                                                <td>{tuition.updatedBy}</td>
                                                <td
                                                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'none' }}
                                                    onClick={() => openAppliedListModal(tuition)}
                                                    title="Click to see applied list"
                                                >
                                                    {tuition.tuitionCode}
                                                </td>
                                                <td>
                                                    {tuition.isWhatsappApply ? (
                                                        <span style={{ color: 'green', fontWeight: 'bold' }}>
                                                            <FaWhatsapp /> Whatsapp
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: 'blue', fontWeight: 'bold' }}>
                                                            <FaGlobe /> Website
                                                        </span>
                                                    )}
                                                </td>

                                                <td className={tuition.isPublish ? "text-success fw-bold" : "text-danger fw-bold"}>
                                                    {tuition.isPublish ? "Yes" : "No"}
                                                </td>
                                                <td>
                                                    <span className={`badge ${statusColors[tuition.status]?.bg || "bg-light"} ${statusColors[tuition.status]?.text || "text-dark"}`}>
                                                        {tuition.status}
                                                    </span>
                                                </td>
                                                <td className={tuition.isPaymentCreated ? "text-success fw-bold" : "text-danger fw-bold"}>
                                                    {tuition.isPaymentCreated ? "Yes" : "No"}
                                                </td>
                                                <td>{formatDateTimeDisplay(tuition.lastAvailableCheck)}</td>
                                                <td>{formatDateTimeDisplay(tuition.lastUpdate)}</td>
                                                <td>{tuition.lastUpdateComment || '-'}</td>
                                                <td>{formatDateTimeDisplay(tuition.nextUpdateDate)}</td>
                                                <td>{tuition.nextUpdateComment || '-'}</td>
                                                <td>{tuition.wantedTeacher}</td>
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
                                                <td>{tuition.note}</td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px', position: 'sticky', right: 0, zIndex: 2 }}>

                                                    <Button variant="info" onClick={() => handleShowDetails(tuition)} title="View Details">
                                                        <FaInfoCircle />
                                                    </Button>

                                                    <Button variant="warning" onClick={() => handleEdit(tuition)} className="mr-2">
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

                <Modal show={showUpdateListModal} onHide={() => setShowUpdateListModal(false)} centered size="xl">
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="w-100 text-center fw-bold">
                            <FaBell className="text-warning" />
                            <span className="ms-2">Tuition needs update Today: {tuitionNeedsUpdateList.length}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4 bg-light">
                        {tuitionNeedsUpdateList.length > 0 ? (
                            <Table responsive striped bordered hover className="shadow-sm">
                                <thead className="bg-dark text-white text-center">
                                    <tr>
                                        <th>Tuition Code</th>
                                        <th>Created By/Updated By</th>
                                        <th>Last Available Check</th>
                                        <th>Last Update</th>
                                        <th>Next Update Date</th>
                                        <th>Status</th>
                                        <th>Teacher Number</th>
                                        <th>Guardian Number</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tuitionNeedsUpdateList.map((tuition, index) => (
                                        <tr key={index} className="align-middle text-center">
                                            <td>{tuition.tuitionCode}</td>
                                            <td>{tuition.updatedBy}</td>
                                            <td>{formatDateTimeDisplay(tuition.lastAvailableCheck)}</td>
                                            <td>{formatDateTimeDisplay(tuition.lastUpdate)}</td>
                                            <td>{formatDateTimeDisplay(tuition.nextUpdateDate)}</td>
                                            <td>{tuition.status}</td>
                                            <td>{tuition.tutorNumber}</td>
                                            <td>{tuition.guardianNumber}</td>
                                            <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                <Button variant="info" onClick={() => handleShowDetails(tuition)} title="View Details">
                                                    <FaInfoCircle />
                                                </Button>

                                                <Button variant="warning" onClick={() => handleEdit(tuition)} className="mr-2">
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
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="text-center text-muted py-4">
                                <h5>No tuition needs update check today.</h5>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>

                <Modal show={showPaymentPendingModal} onHide={() => setShowPaymentPendingModal(false)} centered size="xl">
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="w-100 text-center fw-bold">
                            <FaBell className="text-warning" />
                            <span className="ms-2">
                                Tuition needs payment creation: {tuitionNeedsPaymentCreation.length}
                            </span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4 bg-light">
                        {tuitionNeedsPaymentCreation.length > 0 ? (
                            <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                                <Table responsive striped bordered hover className="shadow-sm mb-0">
                                    <thead className="bg-dark text-white text-center">
                                        <tr>
                                            <th>SL</th>
                                            <th>Tuition Code</th>
                                            <th>Teacher Number</th>
                                            <th>Salary</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tuitionNeedsPaymentCreation.map((tuition, index) => (
                                            <tr key={index} className="align-middle text-center">
                                                <td>{index + 1}</td>
                                                <td>{tuition.tuitionCode}</td>
                                                <td>{tuition.tutorNumber}</td>
                                                <td>{tuition.salary}</td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                    <Button variant="info" onClick={() => handleShowDetails(tuition)} title="View Details">
                                                        <FaInfoCircle />
                                                    </Button>
                                                    <Button variant="warning" onClick={() => handleEdit(tuition)}>
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
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center text-muted py-4">
                                <h5>No tuition needs payment creation.</h5>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>

                <TuitionModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    editingData={selectedTuition}
                    editingId={editingId}
                    fetchTuitionRecords={fetchTuitionRecords}
                    fetchSummaryCounts={fetchSummaryCounts}
                />

                <TuitionDetailsModal
                    show={showDetailsModal}
                    onHide={() => setShowDetailsModal(false)}
                    detailsData={detailsData}
                />

                <AppliedListModal
                    tuitionId={selectedTuitionId}
                    tuitionCode={selectedTuitionCode}
                    show={showAppliedModal}
                    onHide={() => setShowAppliedModal(false)}
                />

                <LoadingCard show={deleteLoading} message="Deleting..." />

                <ToastContainer />
            </Container>
        </>
    );
};

export default TuitionPage;

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