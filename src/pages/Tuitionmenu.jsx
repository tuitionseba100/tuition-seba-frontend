import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card, Tooltip, OverlayTrigger, Badge } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaWhatsapp, FaChevronLeft, FaChevronRight, FaGlobe, FaInfoCircle, FaBell, FaSearch, FaUndo, FaUserPlus } from 'react-icons/fa';
import Select from 'react-select';
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
import TuitionAssignModal from '../components/modals/TuitionAssignModal';
import locationData from '../data/locations.json';

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
        statusFilter: '',
        areaFilter: '',
        assignedTo: '',
        type: '',
        isReviewDone: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        tuitionCode: '',
        guardianNumber: '',
        teacherNumber: '',
        publishFilter: '',
        urgentFilter: '',
        statusFilter: '',
        areaFilter: '',
        assignedTo: '',
        type: '',
        isReviewDone: ''
    });

    const [userOptions, setUserOptions] = useState([]);

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
    const [showExportModal, setShowExportModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTuitionForAssign, setSelectedTuitionForAssign] = useState(null);
    const [selectedExportStatus, setSelectedExportStatus] = useState('');
    const role = localStorage.getItem('role');
    const currentUsername = localStorage.getItem('username');

    const openAppliedListModal = (tuition) => {
        setSelectedTuitionId(tuition._id);
        setSelectedTuitionCode(tuition.tuitionCode);
        setShowAppliedModal(true);
    };

    const handleShowDetails = React.useCallback((tuition) => {
        setDetailsData(tuition);
        setShowDetailsModal(true);
    }, []);

    const handleCreate = React.useCallback(() => {
        setSelectedTuition(null);
        setEditingId(null);
        setShowModal(true);
    }, []);

    const handleEdit = React.useCallback((tuition) => {
        setSelectedTuition(tuition);
        setEditingId(tuition._id);
        setShowModal(true);
    }, []);

    const handleOpenAssignModal = React.useCallback((tuition) => {
        setSelectedTuitionForAssign(tuition);
        setShowAssignModal(true);
    }, []);

    const [statusCounts, setStatusCounts] = useState({
        available: 0,
        givenNumber: 0,
        guardianMeet: 0,
        demoClassRunning: 0,
        confirm: 0,
        cancel: 0,
        total: 0,
        pendingApplyCount: 0
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
            statusFilter: '',
            areaFilter: '',
            assignedTo: '',
            type: '',
            isReviewDone: ''
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

    const fetchAlertData = async () => {
        try {
            const alertParams = {};
            if (role !== 'superadmin') {
                alertParams.assignedTo = currentUsername;
            }

            const [alertRes, pendingRes] = await Promise.all([
                axios.get('https://tuition-seba-backend-1.onrender.com/api/tuition/alert-today', { params: alertParams }),
                axios.get('https://tuition-seba-backend-1.onrender.com/api/tuition/pending-payment-creation')
            ]);

            setTuitionNeedsUpdateList(alertRes.data);
            setTuitionNeedsPaymentCreation(pendingRes.data);
        } catch (err) {
            console.error('Error fetching tuition data:', err);
            toast.error("Failed to load tuition data.");
        }
    };

    useEffect(() => {
        fetchAlertData();

        const fetchUsers = async () => {
            if (role === 'superadmin') {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/user/users', {
                        headers: { Authorization: token }
                    });
                    const users = response.data.map(user => ({
                        value: user.username,
                        label: `${user.name} (${user.username})`
                    }));
                    setUserOptions(users);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            } else if (role === 'admin') {
                const name = localStorage.getItem('name') || currentUsername;
                setUserOptions([{
                    value: currentUsername,
                    label: `${name} (${currentUsername})`
                }]);
            }
        };
        fetchUsers();
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
                    status: appliedFilters.statusFilter,
                    area: appliedFilters.areaFilter,
                    assignedTo: appliedFilters.assignedTo,
                    type: appliedFilters.type,
                    isReviewDone: appliedFilters.isReviewDone === "Yes" ? 'true' : appliedFilters.isReviewDone === "No" ? 'false' : undefined
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
            const params = {
                tuitionCode: appliedFilters.tuitionCode,
                guardianNumber: appliedFilters.guardianNumber,
                tutorNumber: appliedFilters.teacherNumber,
                isPublish: appliedFilters.publishFilter === "Yes" ? 'true' : appliedFilters.publishFilter === "No" ? 'false' : undefined,
                isUrgent: appliedFilters.urgentFilter === "Yes" ? 'true' : appliedFilters.urgentFilter === "No" ? 'false' : undefined,
                status: appliedFilters.statusFilter,
                area: appliedFilters.areaFilter,
                assignedTo: appliedFilters.assignedTo,
                type: appliedFilters.type,
                isReviewDone: appliedFilters.isReviewDone === "Yes" ? 'true' : appliedFilters.isReviewDone === "No" ? 'false' : undefined
            };

            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/tuition/summary', {
                params: params
            });
            setExcelTuitionList(res.data.data);
            setPublishCount(res.data.isPublishTrueCount || 0);
            setStatusCounts({
                available: res.data.available || 0,
                givenNumber: res.data.givenNumber || 0,
                guardianMeet: res.data.guardianMeet || 0,
                demoClassRunning: res.data.demoClassRunning || 0,
                confirm: res.data.confirm || 0,
                cancel: res.data.cancel || 0,
                total: res.data.total || 0,
                pendingApplyCount: res.data.pendingApplyCount || 0
            });
        } catch (err) {
            console.error('Error fetching summary counts:', err);
        }
    };

    const handleExportToExcel = async () => {
        setShowExportModal(true);
    };

    const handleExportWithStatus = async () => {
        if (selectedExportStatus) {
            try {
                const statusForFileName = selectedExportStatus.replace(/\s+/g, '_').toLowerCase();
                const link = document.createElement('a');
                link.href = `https://tuition-seba-backend-1.onrender.com/api/tuition/exportData?status=${selectedExportStatus}`;
                link.target = '_blank';
                // Match backend file naming and CSV extension
                link.download = `tuition_apply_${statusForFileName}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setShowExportModal(false);
                setSelectedExportStatus('');
            } catch (error) {
                console.error('Export failed:', error);
                toast.error('Export failed. Please try again.');
            }
        } else {
            toast.error('Please select a status to export.');
        }
    };

    const handleExportUpdateListAsExcel = () => {
        if (!tuitionNeedsUpdateList || tuitionNeedsUpdateList.length === 0) {
            toast.error("No data available to export.");
            return;
        }

        try {
            // Map data to a cleaner format for Excel
            const exportData = tuitionNeedsUpdateList.map(t => ({
                "Tuition Code": t.tuitionCode,
                "Status": t.status,
                "Comment": t.note,
                "Last Update Comment": t.lastUpdateComment,
                "Next Update Comment": t.nextUpdateComment,
                "Teacher Number": t.tutorNumber,
                "Guardian Number": t.guardianNumber,
                "Created By": t.createdBy,
                "Updated By": t.updatedBy
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);

            // Set custom column widths
            worksheet['!cols'] = [
                { wch: 15 }, // Tuition Code
                { wch: 18 }, // Status
                { wch: 40 }, // Comment
                { wch: 40 }, // Last Update Comment
                { wch: 40 }, // Next Update Comment
                { wch: 15 }, // Teacher Number
                { wch: 15 }, // Guardian Number
                { wch: 15 }, // Created By
                { wch: 15 }  // Updated By
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Update List Today");
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const timeStr = now.getHours().toString().padStart(2, '0') + "-" + now.getMinutes().toString().padStart(2, '0');
            XLSX.writeFile(workbook, `tuition_updates_${dateStr}_${timeStr}.xlsx`);
            toast.success("Excel file downloaded successfully!");
        } catch (error) {
            console.error("Excel export error:", error);
            toast.error("Failed to export Excel file.");
        }
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
                await fetchAlertData();
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

    const handleShare = React.useCallback((tuitionDetails) => {
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
            `Salary: ${tuitionDetails.salary && /taka|tk/i.test(tuitionDetails.salary.toString()) ? tuitionDetails.salary : (tuitionDetails.salary ? tuitionDetails.salary.toString().trim() + ' taka' : '')}\n` +
            `Location: ${tuitionDetails.location}, ${area}\n` +
            `Joining: ${tuitionDetails.joining}\n\n` +
            `Visit our website: www.tuitionsebaforum.com\n\n` +
            `Whatsapp: ${phoneNumber}`;

        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }, []);

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
        "suspended": { bg: "bg-dark", text: "text-white" },
        "refer BM": { bg: "bg-info", text: "text-dark" },
        "guardian no response": { bg: "bg-secondary", text: "text-white" },
        "request for payment": { bg: "bg-warning", text: "text-dark" },
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
                        <div className="row text-center" style={{ display: 'flex', flexWrap: 'wrap', margin: '0 -0.5rem' }}>
                            <div className="col-6 col-sm-3 mb-3" style={{ flex: '0 0 11.11%', maxWidth: '11.11%', padding: '0 0.5rem' }}>
                                <div className="card p-3 shadow border-primary" style={{ minHeight: '80px' }}>
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder', fontSize: '0.9rem' }}>Published</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{publishCount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-3 mb-3" style={{ flex: '0 0 11.11%', maxWidth: '11.11%', padding: '0 0.5rem' }}>
                                <div className="card p-3 shadow border-primary" style={{ minHeight: '80px' }}>
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder', fontSize: '0.9rem' }}>Total</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{statusCounts.total}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-3 mb-3" style={{ flex: '0 0 11.11%', maxWidth: '11.11%', padding: '0 0.5rem' }}>
                                <div className="card p-3 shadow border-primary" style={{ minHeight: '80px' }}>
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder', fontSize: '0.9rem' }}>Available</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{statusCounts.available}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-3 mb-3" style={{ flex: '0 0 11.11%', maxWidth: '11.11%', padding: '0 0.5rem' }}>
                                <div className="card p-3 shadow border-primary" style={{ minHeight: '80px' }}>
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder', fontSize: '0.9rem' }}>Given Number</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{statusCounts.givenNumber}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-3 mb-3" style={{ flex: '0 0 11.11%', maxWidth: '11.11%', padding: '0 0.5rem' }}>
                                <div className="card p-3 shadow border-primary" style={{ minHeight: '80px' }}>
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder', fontSize: '0.9rem' }}>Guardian Meet</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{statusCounts.guardianMeet}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-3 mb-3" style={{ flex: '0 0 11.11%', maxWidth: '11.11%', padding: '0 0.5rem' }}>
                                <div className="card p-3 shadow border-primary" style={{ minHeight: '80px' }}>
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder', fontSize: '0.9rem' }}>Demo Class Running</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{statusCounts.demoClassRunning}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-3 mb-3" style={{ flex: '0 0 11.11%', maxWidth: '11.11%', padding: '0 0.5rem' }}>
                                <div className="card p-3 shadow border-primary" style={{ minHeight: '80px' }}>
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder', fontSize: '0.9rem' }}>Confirm</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{statusCounts.confirm}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-3 mb-3" style={{ flex: '0 0 11.11%', maxWidth: '11.11%', padding: '0 0.5rem' }}>
                                <div className="card p-3 shadow border-danger" style={{ minHeight: '80px' }}>
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-danger" style={{ fontWeight: 'bolder', fontSize: '0.85rem' }}>Pending Apply</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{statusCounts.pendingApplyCount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-3 mb-3" style={{ flex: '0 0 11.11%', maxWidth: '11.11%', padding: '0 0.5rem' }}>
                                <div className="card p-3 shadow border-primary" style={{ minHeight: '80px' }}>
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder', fontSize: '0.9rem' }}>Cancel</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{statusCounts.cancel}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>


                <Row className="mt-2 mb-3">
                    <Col md={1}>
                        <Form.Label className="fw-bold text-nowrap">Code</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Code"
                            value={searchInputs.tuitionCode}
                            onChange={(e) => handleSearchInputChange('tuitionCode', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>

                    <Col md={1}>
                        <Form.Label className="fw-bold text-nowrap">Guardian</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Num"
                            value={searchInputs.guardianNumber}
                            onChange={(e) => handleSearchInputChange('guardianNumber', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>

                    <Col md={1}>
                        <Form.Label className="fw-bold text-nowrap">Teacher</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Num"
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
                            <option value="refer BM">Refer BM</option>
                            <option value="suspended">Suspended</option>
                            <option value="guardian no response">Guardian No response</option>
                            <option value="request for payment">Request for payment</option>
                        </Form.Select>
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Area</Form.Label>
                        <Form.Select
                            value={searchInputs.areaFilter}
                            onChange={(e) => handleSearchInputChange('areaFilter', e.target.value)}
                        >
                            <option value="">All Areas</option>
                            {locationData.areaOptions.chittagong.map((area, index) => (
                                <option key={index} value={area}>{area}</option>
                            ))}
                        </Form.Select>
                    </Col>

                    {(role === 'superadmin' || role === 'admin') && (
                        <Col md={2}>
                            <Form.Label className="fw-bold">Assigned To</Form.Label>
                            <Select
                                options={userOptions}
                                value={userOptions.find(u => u.value === searchInputs.assignedTo) || null}
                                onChange={(option) => handleSearchInputChange('assignedTo', option ? option.value : '')}
                                isClearable
                                placeholder="All"
                                menuPortalTarget={document.body}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '38px',
                                        borderRadius: '0.375rem',
                                    }),
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                }}
                            />
                        </Col>
                    )}

                    <Col md="auto">
                        <Form.Label className="fw-bold d-block">Type Filter</Form.Label>
                        <div className="d-flex flex-wrap align-items-center border rounded px-3 bg-white" style={{ minHeight: '38px' }}>
                            <Form.Check
                                inline
                                label="All"
                                name="typeGroup"
                                type="radio"
                                id="type-all"
                                checked={searchInputs.type === ''}
                                onChange={() => handleSearchInputChange('type', '')}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Form.Check
                                inline
                                label={<span className="text-danger">Spam</span>}
                                name="typeGroup"
                                type="radio"
                                id="type-spam"
                                checked={searchInputs.type === 'spam'}
                                onChange={() => handleSearchInputChange('type', 'spam')}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Form.Check
                                inline
                                label={<span className="text-info">Best Guardian</span>}
                                name="typeGroup"
                                type="radio"
                                id="type-bestGuardian"
                                checked={searchInputs.type === 'bestGuardian'}
                                onChange={() => handleSearchInputChange('type', 'bestGuardian')}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                    </Col>

                    <Col md="auto">
                        <Form.Label className="fw-bold d-block">Review Filter</Form.Label>
                        <div className="d-flex flex-wrap align-items-center border rounded px-3 bg-white" style={{ minHeight: '38px' }}>
                            <Form.Check
                                inline
                                label="All"
                                name="reviewGroup"
                                type="radio"
                                id="review-all"
                                checked={searchInputs.isReviewDone === ''}
                                onChange={() => handleSearchInputChange('isReviewDone', '')}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Form.Check
                                inline
                                label={<span className="text-success">Yes</span>}
                                name="reviewGroup"
                                type="radio"
                                id="review-yes"
                                checked={searchInputs.isReviewDone === 'Yes'}
                                onChange={() => handleSearchInputChange('isReviewDone', 'Yes')}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Form.Check
                                inline
                                label={<span className="text-secondary">No</span>}
                                name="reviewGroup"
                                type="radio"
                                id="review-no"
                                checked={searchInputs.isReviewDone === 'No'}
                                onChange={() => handleSearchInputChange('isReviewDone', 'No')}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                    </Col>

                    <Col md="auto" className="d-flex align-items-end">
                        <Button
                            variant="success"
                            onClick={handleSearch}
                            className="d-flex align-items-center justify-content-center"
                            disabled={loading}
                            title="Search"
                            style={{ width: "40px", height: "40px" }}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : <FaSearch />}
                        </Button>
                    </Col>
                    <Col md="auto" className="d-flex align-items-end">
                        <Button
                            variant="danger"
                            onClick={handleResetFilters}
                            className="d-flex align-items-center justify-content-center ms-2"
                            title="Reset Filters"
                            style={{ width: "40px", height: "40px" }}
                        >
                            <FaUndo />
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
                    >
                        Export to CSV
                    </Button>
                )}

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Tuition List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <MemoizedTuitionTable
                                tuitionList={filteredTuitionList}
                                loading={loading}
                                role={role}
                                formatDateTimeDisplay={formatDateTimeDisplay}
                                statusColors={statusColors}
                                handleShowDetails={handleShowDetails}
                                handleEdit={handleEdit}
                                handleDeleteTuition={handleDeleteTuition}
                                handleShare={handleShare}
                                handleOpenAssignModal={handleOpenAssignModal}
                                openAppliedListModal={openAppliedListModal}
                            />

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

                <Modal
                    show={showUpdateListModal}
                    onHide={() => setShowUpdateListModal(false)}
                    size="xl"
                    dialogClassName="modal-initial-size"
                >
                    <style>{`
                        .modal-initial-size {
                            max-width: calc(100vw - 40px) !important;
                            width: calc(100vw - 40px) !important;
                            height: calc(100vh - 40px) !important;
                            margin: 20px !important;
                            padding: 0 !important;
                        }
                        .modal-initial-size .modal-content {
                            height: 100% !important;
                            border-radius: 4px;
                        }
                    `}</style>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="flex-grow-1 text-center fw-bold">
                            <FaBell className="text-warning" />
                            <span className="ms-2">
                                Tuition needs update Today: {tuitionNeedsUpdateList.length} 
                                {tuitionNeedsUpdateList.filter(t => t.hasPendingApply).length > 0 && (
                                    <span className="ms-2 badge bg-danger">
                                        Pending Apply: {tuitionNeedsUpdateList.filter(t => t.hasPendingApply).length}
                                    </span>
                                )}
                            </span>
                        </Modal.Title>
                        {role === "superadmin" && (
                            <Button
                                variant="success"
                                size="sm"
                                onClick={handleExportUpdateListAsExcel}
                                className="d-flex align-items-center gap-1 fw-bold me-2"
                            >
                                <FaGlobe /> Export List (Excel)
                            </Button>
                        )}
                    </Modal.Header>
                    <Modal.Body className="p-0 bg-light">
                        {tuitionNeedsUpdateList.length > 0 ? (
                            <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                <table className="table table-striped table-bordered table-hover mb-0">
                                    <thead className="bg-dark text-white text-center sticky-header">
                                        <tr>
                                            <th>SL</th>
                                            <th>Tuition Code</th>
                                            <th>Created By/Updated By</th>
                                            <th>Comment</th>
                                            <th>Last Update Comment</th>
                                            <th>Next Update Comment</th>
                                            <th>Status</th>
                                            <th>Assigned To</th>
                                            <th>Teacher Number</th>
                                            <th>Guardian Number</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tuitionNeedsUpdateList.map((tuition, index) => (
                                            <tr 
                                                key={index} 
                                                className={`align-middle text-center ${tuition.isSpamGuardian ? "table-danger" : tuition.isBestGuardian ? "table-info" : ""}`}
                                            >
                                                <td>{index + 1}</td>
                                                <td
                                                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'none' }}
                                                    onClick={() => openAppliedListModal(tuition)}
                                                    title="Click to see applied list"
                                                >
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        {tuition.tuitionCode}
                                                        {tuition.hasPendingApply && (
                                                            <span 
                                                                className="badge bg-danger animate-pulse" 
                                                                style={{ 
                                                                    fontSize: '0.65rem',
                                                                    padding: '2px 4px',
                                                                    animation: 'blinker 1.5s linear infinite'
                                                                }}
                                                            >
                                                                Pending
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-start">
                                                    <span className="badge bg-success text-white me-2">CB: {tuition.createdBy || '-'}</span>
                                                    <span className="badge bg-primary text-white">UB: {tuition.updatedBy || '-'}</span>
                                                </td>
                                                <td>{tuition.note || '-'}</td>
                                                <td>{tuition.lastUpdateComment || '-'}</td>
                                                <td>{tuition.nextUpdateComment || '-'}</td>
                                                <td>{tuition.status}</td>
                                                <td>
                                                    <span className="badge bg-secondary">
                                                        {tuition.assignedTo || 'Unassigned'}
                                                    </span>
                                                </td>
                                                <td>{tuition.tutorNumber}</td>
                                                <td>
                                                    <div className="d-flex flex-column align-items-center">
                                                        <span>{tuition.guardianNumber}</span>
                                                        <div className="d-flex gap-1 mt-1">
                                                            {tuition.isSpamGuardian && <Badge bg="danger" style={{ fontSize: '0.6rem' }}>Spam</Badge>}
                                                            {tuition.isBestGuardian && <Badge bg="primary" style={{ fontSize: '0.6rem' }}>Best</Badge>}
                                                        </div>
                                                    </div>
                                                </td>
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
                                                    {role === 'superadmin' && (
                                                        <Button variant="dark" onClick={() => handleOpenAssignModal(tuition)} title="Assign Employee">
                                                            <FaUserPlus />
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                                {tuitionNeedsPaymentCreation.filter(t => t.hasPendingApply).length > 0 && (
                                    <span className="ms-2 badge bg-danger">
                                        Pending Apply: {tuitionNeedsPaymentCreation.filter(t => t.hasPendingApply).length}
                                    </span>
                                )}
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
                                            <tr 
                                                key={index} 
                                                className={`align-middle text-center ${tuition.isSpamGuardian ? "table-danger" : tuition.isBestGuardian ? "table-info" : ""}`}
                                            >
                                                <td>{index + 1}</td>
                                                <td
                                                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'none' }}
                                                    onClick={() => openAppliedListModal(tuition)}
                                                    title="Click to see applied list"
                                                >
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        {tuition.tuitionCode}
                                                        {tuition.hasPendingApply && (
                                                            <span 
                                                                className="badge bg-danger animate-pulse" 
                                                                style={{ 
                                                                    fontSize: '0.65rem',
                                                                    padding: '2px 4px',
                                                                    animation: 'blinker 1.5s linear infinite'
                                                                }}
                                                            >
                                                                Pending
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
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
                                                    {role === 'superadmin' && (
                                                        <Button variant="dark" onClick={() => handleOpenAssignModal(tuition)} title="Assign Employee">
                                                            <FaUserPlus />
                                                        </Button>
                                                    )}
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
                    fetchAlertData={fetchAlertData}
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

                {/* Export Modal */}
                <Modal show={showExportModal} onHide={() => {
                    setShowExportModal(false);
                    setSelectedExportStatus('');
                }} centered>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="w-100 text-center fw-bold">
                            Select Status for Export
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4 bg-light">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Select Status:</Form.Label>
                            <Form.Select
                                value={selectedExportStatus}
                                onChange={(e) => setSelectedExportStatus(e.target.value)}
                                className="form-control-lg"
                            >
                                <option value="">-- Select Status --</option>
                                <option value="all">All</option>
                                <option value="available">Available</option>
                                <option value="given number">Given Number</option>
                                <option value="guardian meet">Guardian Meet</option>
                                <option value="demo class running">Demo Class Running</option>
                                <option value="confirm">Confirm</option>
                                <option value="cancel">Cancel</option>
                                <option value="refer BM">Refer BM</option>
                                <option value="suspended">Suspended</option>
                                <option value="guardian no response">Guardian No response</option>
                                <option value="request for payment">Request for payment</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="bg-light">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowExportModal(false);
                                setSelectedExportStatus('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleExportWithStatus}
                            disabled={!selectedExportStatus}
                        >
                            Export
                        </Button>
                    </Modal.Footer>
                </Modal>

                <TuitionAssignModal
                    show={showAssignModal}
                    onHide={() => setShowAssignModal(false)}
                    tuition={selectedTuitionForAssign}
                    fetchTuitionRecords={fetchTuitionRecords}
                    fetchAlertData={fetchAlertData}
                />
            </Container >
        </>
    );
};

const MemoizedTuitionTable = React.memo(({
    tuitionList,
    loading,
    role,
    formatDateTimeDisplay,
    statusColors,
    handleShowDetails,
    handleEdit,
    handleDeleteTuition,
    handleShare,
    handleOpenAssignModal,
    openAppliedListModal
}) => {
    return (
        <Table striped bordered hover responsive="lg">
            <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                <tr>
                    <th>SL</th>
                    <th>Created By / Updated By</th>
                    <th>Tuition Code</th>
                    <th>Apply Type</th>
                    <th>Published?</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Reviewed?</th>
                    <th>Payment Created?</th>
                    <th>Last Available Check</th>
                    <th>Last Update</th>
                    <th>Last Update Comment</th>
                    <th>Next Update</th>
                    <th>Next Update Comment</th>
                    <th>Joining Date</th>
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
                        <td colSpan="28" className="text-center">
                            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                                <Spinner animation="border" variant="primary" size="lg" />
                            </div>
                        </td>
                    </tr>
                ) : tuitionList.length === 0 ? (
                    <tr>
                        <td colSpan="28" className="text-center py-4 text-muted">No records found matching your filters.</td>
                    </tr>
                ) : (
                    tuitionList.map((tuition, index) => (
                        <tr 
                            key={tuition._id}
                            className={tuition.isSpamGuardian ? "table-danger" : tuition.isBestGuardian ? "table-info" : ""}
                        >
                            <td>{index + 1}</td>
                            <td>
                                <div className="d-flex flex-column">
                                    <span className="badge bg-success text-start mb-1" title="Created By">CB: {tuition.createdBy || '-'}</span>
                                    <span className="badge bg-info text-start" title="Updated By">UB: {tuition.updatedBy || '-'}</span>
                                </div>
                            </td>
                            <td
                                style={{ color: 'blue', cursor: 'pointer', textDecoration: 'none' }}
                                onClick={() => openAppliedListModal(tuition)}
                                title="Click to see applied list"
                            >
                                <div className="d-flex align-items-center gap-2">
                                    {tuition.tuitionCode}
                                    {tuition.hasPendingApply && (
                                        <span 
                                            className="badge bg-danger animate-pulse" 
                                            style={{ 
                                                fontSize: '0.65rem',
                                                padding: '2px 4px',
                                                animation: 'blinker 1.5s linear infinite'
                                            }}
                                        >
                                            Pending
                                        </span>
                                    )}
                                </div>
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
                                <span className="badge bg-secondary">
                                    {tuition.assignedTo || 'Unassigned'}
                                </span>
                            </td>
                            <td>
                                <span className={`badge ${statusColors[tuition.status]?.bg || "bg-light"} ${statusColors[tuition.status]?.text || "text-dark"}`}>
                                    {tuition.status}
                                </span>
                            </td>
                            <td>
                                {tuition.isReviewDone ? (
                                    <span className="badge bg-success">Yes</span>
                                ) : (
                                    <span className="badge bg-secondary">No</span>
                                )}
                            </td>
                            <td className={tuition.isPaymentCreated ? "text-success fw-bold" : "text-danger fw-bold"}>
                                {tuition.isPaymentCreated ? "Yes" : "No"}
                            </td>
                            <td>{formatDateTimeDisplay(tuition.lastAvailableCheck)}</td>
                            <td>{formatDateTimeDisplay(tuition.lastUpdate)}</td>
                            <td>{tuition.lastUpdateComment || '-'}</td>
                            <td>{formatDateTimeDisplay(tuition.nextUpdateDate)}</td>
                            <td>{tuition.nextUpdateComment || '-'}</td>
                            <td>{tuition.joining}</td>
                            <td>{tuition.wantedTeacher}</td>
                            <td>{tuition.student}</td>
                            <td>{tuition.class}</td>
                            <td>{tuition.medium}</td>
                            <td>{tuition.subject}</td>
                            <td>{tuition.day}</td>
                            <td>{tuition.time === "undefined" ? " " : tuition.time}</td>
                            <td>{tuition.salary && /taka|tk/i.test(tuition.salary.toString()) ? tuition.salary : (tuition.salary ? tuition.salary.toString().trim() + ' taka' : '')}</td>
                            <td>{tuition.location}</td>
                            <td>{tuition.area ? tuition.area : ""}</td>
                            <td>
                                <div className="d-flex flex-column align-items-center">
                                    <span>{tuition.guardianNumber}</span>
                                    <div className="d-flex gap-1 mt-1">
                                        {tuition.isSpamGuardian && <Badge bg="danger" style={{ fontSize: '0.6rem' }}>Spam</Badge>}
                                        {tuition.isBestGuardian && <Badge bg="primary" style={{ fontSize: '0.6rem' }}>Best</Badge>}
                                    </div>
                                </div>
                            </td>
                            <td>{tuition.tutorNumber}</td>
                            <td>{tuition.note}</td>
                            <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px', position: 'sticky', right: 0, zIndex: 2, backgroundColor: '#fff' }}>
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
                                {role === 'superadmin' && (
                                    <Button variant="dark" onClick={() => handleOpenAssignModal(tuition)} title="Assign Employee">
                                        <FaUserPlus />
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );
});

export default TuitionPage;

// Sticky table header styles
const stickyHeaderStyles = `
  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #343a40 !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .table-responsive {
    position: relative;
  }
  
  table {
    border-collapse: separate;
  }
  
  th {
    background-color: inherit;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`;

// Inject styles into the document
const styleElement = document.createElement('style');
styleElement.innerHTML = stickyHeaderStyles;
document.head.appendChild(styleElement);

const Container = styled.div`
  padding: 30px;
  background: #f4f4f9;

  .form-check-input[type="radio"] {
    border: 2px solid #666;
    cursor: pointer;
  }
  
  .form-check-input[type="radio"]:checked {
    border-color: #0d6efd;
    background-color: #0d6efd;
  }
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
