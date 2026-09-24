import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaChevronLeft, FaChevronRight, FaSearch, FaUndo, FaBell, FaInfoCircle } from 'react-icons/fa';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const BASE_URL = 'https://tuition-seba-backend-1.onrender.com/api/phone';

const PhonePage = () => {
    const [phoneList, setPhoneList] = useState([]);
    const [filteredPhoneList, setFilteredPhoneList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [phoneData, setPhoneData] = useState({
        phone: '',
        note: '',
        isSpam: false,
        isBest: false,
        isExpress: false,
        isActive: false,
        isBestGuardian: false,
        isBanned: false,
        lastFollowUpDate: '',
        lastFollowUpComment: '',
        nextFollowUpDate: '',
        nextFollowUpComment: '',
    });
    // Follow-up today
    const [followUpTodayList, setFollowUpTodayList] = useState([]);
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [filterFollowUpToday, setFilterFollowUpToday] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsItem, setDetailsItem] = useState(null);
    const [searchInputs, setSearchInputs] = useState({
        phone: '',
        type: ''
    });
    const [appliedFilters, setAppliedFilters] = useState({
        phone: '',
        type: ''
    });

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [summaryCounts, setSummaryCounts] = useState({
        total: 0,
        spam: 0,
        best: 0,
        express: 0,
        bestGuardian: 0,
        banned: 0
    });
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchRecords();
        fetchSummaryCounts();
        fetchFollowUpToday();
    }, [currentPage, appliedFilters]);

    const handleSearch = () => {
        setAppliedFilters({ ...searchInputs });
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        const resetState = { phone: '', type: '' };
        setSearchInputs(resetState);
        setAppliedFilters(resetState);
        setCurrentPage(1);
        setFilterFollowUpToday(false);
    };


    const fetchRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/all`, {
                params: {
                    page: currentPage,
                    limit: 20,
                    phone: appliedFilters.phone,
                    type: appliedFilters.type
                }
            });
            setPhoneList(response.data.data);
            setFilteredPhoneList(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error('Error:', err);
            toast.error("Failed to load records.");
        }
        setLoading(false);
    };

    const fetchSummaryCounts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/summary`);
            setSummaryCounts(response.data);
        } catch (err) {
            console.error('Error fetching summary:', err);
        }
    };

    const fetchFollowUpToday = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/alert-today`);
            setFollowUpTodayList(response.data || []);
        } catch (err) {
            console.error('Error fetching follow-up today:', err);
        }
    };

    const handleExportToExcel = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/export`, {
                params: {
                    phone: appliedFilters.phone,
                    type: appliedFilters.type
                }
            });
            const exportData = response.data;

            const now = new Date();
            const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
            const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');

            const fileName = `phone List_${formattedDate}_${formattedTime}`;

            const tableHeaders = [
                "Created At",
                "Phone",
                "Note",
                "IsActive",
                "IsExpress",
                "IsSpam",
                "IsBest",
                "IsBest Guardian",
                "Is Banned",
                "Created By",
                "Updated By",
                "Last Follow Up Date",
                "Last Follow Up Comment",
                "Next Follow Up Date",
                "Next Follow Up Comment",
            ];

            const tableData = exportData.map(item => [
                item.createdAt ? formatDate(item.createdAt) : "",
                String(item.phone ?? ""),
                String(item.note ?? ""),
                String(item.isActive ?? ""),
                String(item.isExpress ?? ""),
                String(item.isSpam ?? ""),
                String(item.isBest ?? ""),
                String(item.isBestGuardian ?? ""),
                String(item.isBanned ?? ""),
                String(item.createdBy ?? ""),
                String(item.updatedBy ?? ""),
                item.lastFollowUpDate ? formatDate(item.lastFollowUpDate) : "",
                String(item.lastFollowUpComment ?? ""),
                item.nextFollowUpDate ? formatDate(item.nextFollowUpDate) : "",
                String(item.nextFollowUpComment ?? ""),
            ]);

            const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "SPAM_BEST");

            XLSX.writeFile(workbook, `${fileName}.xlsx`);
        } catch (err) {
            console.error('Export error:', err);
            toast.error("Failed to export.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveRequest = async () => {
        const phone = phoneData.phone?.trim();

        if (!phone) {
            toast.error("Phone number is required.");
            return;
        }

        // Validation: Only digits and / are allowed
        if (!/^[0-9/]+$/.test(phone)) {
            toast.error("Only numbers (0-9) and '/' are allowed in phone field.");
            return;
        }

        const inputNumbers = phone.split('/').map(n => n.trim()).filter(n => n);

        if (inputNumbers.length === 0) {
            toast.error("Please enter a valid phone number.");
            return;
        }

        // Check for self-duplicates in the input
        const uniqueNumbers = new Set(inputNumbers);
        if (uniqueNumbers.size !== inputNumbers.length) {
            toast.error("Duplicate phone number entered in the same record. The same number cannot be added twice.");
            return;
        }

        // Validation: Each number must start with 0
        for (const num of inputNumbers) {
            if (!num.startsWith('0')) {
                toast.error(`Each phone number must start with '0'. Invalid: ${num}`);
                return;
            }
        }

        // Client-side quick check against existing loaded records
        const duplicateInList = phoneList.find(record => {
            if (editingId && record._id === editingId) return false;
            if (!record.phone) return false;
            const existingNums = record.phone.split('/').map(n => n.trim()).filter(n => n);
            return inputNumbers.some(inNum => existingNums.includes(inNum));
        });

        if (duplicateInList) {
            toast.error(`Phone number already exists in record: ${duplicateInList.phone}`);
            return;
        }

        const username = localStorage.getItem('username');

        const updatedData = {
            ...phoneData,
            phone: inputNumbers.join('/'),
            lastFollowUpDate: phoneData.lastFollowUpDate || null,
            nextFollowUpDate: phoneData.nextFollowUpDate || null,
        };
        try {
            if (editingId) {
                updatedData.updatedBy = username;
                await axios.put(`${BASE_URL}/edit/${editingId}`, updatedData);
                toast.success("phone record updated successfully!");
            } else {
                updatedData.createdBy = username;
                await axios.post(`${BASE_URL}/add`, updatedData);
                toast.success("phone record created successfully!");
            }
            setShowModal(false);
            fetchRecords();
            fetchSummaryCounts();
            fetchFollowUpToday();
        } catch (err) {
            console.error('Error:', err);
            const errorMessage = err.response?.data?.message || err.response?.data || err.message || "Error saving record.";
            toast.error(errorMessage);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const optionsDate = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };
        const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
        const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);
        return `${formattedDate} || ${formattedTime}`;
    };

    const formatDateInput = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        if (isNaN(d)) return '';
        return d.toISOString().split('T')[0];
    };

    const handleEditRecord = (data) => {
        setPhoneData({
            phone: data.phone ?? '',
            note: data.note ?? '',
            isSpam: !!data.isSpam,
            isExpress: !!data.isExpress,
            isBest: !!data.isBest,
            isActive: !!data.isActive,
            isBestGuardian: !!data.isBestGuardian,
            isBanned: !!data.isBanned,
            lastFollowUpDate: formatDateInput(data.lastFollowUpDate),
            lastFollowUpComment: data.lastFollowUpComment ?? '',
            nextFollowUpDate: formatDateInput(data.nextFollowUpDate),
            nextFollowUpComment: data.nextFollowUpComment ?? '',
        });
        setEditingId(data._id);
        setShowModal(true);
    };

    const handleDeleteRecord = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this  record?");

        if (confirmDelete) {
            try {
                await axios.delete(`${BASE_URL}/delete/${id}`);
                toast.success("Record deleted successfully!");
                fetchRecords();
                fetchSummaryCounts();
                fetchFollowUpToday();
            } catch (err) {
                console.error('Error deleting record:', err);
                toast.error("Error deleting record.");
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
                    <h2 className='text-primary fw-bold'>SPAM & BEST Phone Numbers</h2>
                    <div className="d-flex gap-2">
                        <Button
                            variant="primary"
                            onClick={() => {
                                setShowModal(true);
                                setEditingId(null);
                                setPhoneData({ phone: '', note: '', isSpam: false, isBest: false, isExpress: false, isActive: false, isBestGuardian: false, isBanned: false, lastFollowUpDate: '', lastFollowUpComment: '', nextFollowUpDate: '', nextFollowUpComment: '' });
                            }}
                        >
                            Create Phone Record
                        </Button>
                    </div>
                </Header>
                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-dark">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-dark" style={{ fontWeight: 'bolder' }}>Total</span>
                                        <span>{summaryCounts?.total || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border border-danger">
                                    <div className="d-flex flex-column align-items-center text-danger">
                                        <span style={{ fontWeight: 'bolder' }}>Total Spam</span>
                                        <span>{summaryCounts?.spam || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border border-primary">
                                    <div className="d-flex flex-column align-items-center text-primary">
                                        <span style={{ fontWeight: 'bolder' }}>Total Best Teacher</span>
                                        <span>{summaryCounts?.best || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border border-success">
                                    <div className="d-flex flex-column align-items-center text-success">
                                        <span style={{ fontWeight: 'bolder' }}>Total Express Teacher</span>
                                        <span>{summaryCounts?.express || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border border-info">
                                    <div className="d-flex flex-column align-items-center text-info">
                                        <span style={{ fontWeight: 'bolder' }}>Total Best Guardian</span>
                                        <span>{summaryCounts?.bestGuardian || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border border-dark">
                                    <div className="d-flex flex-column align-items-center text-dark">
                                        <span style={{ fontWeight: 'bolder' }}>Total Banned</span>
                                        <span>{summaryCounts?.banned || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                {/* Search bar */}
                <Row className="mt-2 mb-3">
                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Phone Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Phone Number"
                            value={searchInputs.phone}
                            onChange={(e) => setSearchInputs({ ...searchInputs, phone: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </Col>

                    <Col md="auto">
                        <Form.Label className="fw-bold d-block">Type Filter</Form.Label>
                        <div className="d-flex flex-wrap align-items-center border rounded px-3 bg-white" style={{ minHeight: '38px', paddingBottom: '2px', paddingTop: '6px' }}>
                            <Form.Check
                                inline
                                type="radio"
                                id="typeFilterAll"
                                label="All"
                                name="typeFilter"
                                value=""
                                checked={searchInputs.type === ''}
                                onChange={(e) => setSearchInputs({ ...searchInputs, type: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Form.Check
                                inline
                                type="radio"
                                id="typeFilterSpam"
                                label="Spam"
                                name="typeFilter"
                                value="spam"
                                checked={searchInputs.type === 'spam'}
                                onChange={(e) => setSearchInputs({ ...searchInputs, type: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Form.Check
                                inline
                                type="radio"
                                id="typeFilterBest"
                                label="Best Teacher"
                                name="typeFilter"
                                value="best"
                                checked={searchInputs.type === 'best'}
                                onChange={(e) => setSearchInputs({ ...searchInputs, type: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Form.Check
                                inline
                                type="radio"
                                id="typeFilterExpress"
                                label="Express"
                                name="typeFilter"
                                value="express"
                                checked={searchInputs.type === 'express'}
                                onChange={(e) => setSearchInputs({ ...searchInputs, type: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Form.Check
                                inline
                                type="radio"
                                id="typeFilterBestGuardian"
                                label="Best Guardian"
                                name="typeFilter"
                                value="bestGuardian"
                                checked={searchInputs.type === 'bestGuardian'}
                                onChange={(e) => setSearchInputs({ ...searchInputs, type: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Form.Check
                                inline
                                type="radio"
                                id="typeFilterBanned"
                                label="Banned"
                                name="typeFilter"
                                value="banned"
                                checked={searchInputs.type === 'banned'}
                                onChange={(e) => setSearchInputs({ ...searchInputs, type: e.target.value })}
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

                {/* Follow Up Today Banner */}
                <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 mb-3">
                    <h5 className="me-3 d-flex align-items-center gap-2 mb-0">
                        <FaBell className="text-primary" />
                        <span>Phone Follow Up Today: {followUpTodayList.length}</span>
                        <Button
                            size="sm"
                            variant={filterFollowUpToday ? "warning" : "outline-primary"}
                            onClick={() => setFilterFollowUpToday(v => !v)}
                            className="ms-1"
                        >
                            {filterFollowUpToday ? "Showing Today (Click to Reset)" : "Filter Today"}
                        </Button>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-phone-followup">Click to see follow-up list modal</Tooltip>}
                        >
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={() => setShowFollowUpModal(true)}
                                className="ms-1"
                            >
                                View Modal
                            </Button>
                        </OverlayTrigger>
                    </h5>
                </div>

                {role === "superadmin" && (
                    <Button
                        variant="success"
                        className="mb-3"
                        onClick={handleExportToExcel}
                    >
                        Export to Excel
                    </Button>
                )}

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Created By / Updated By</th>
                                        <th>Created At</th>
                                        <th>Phone</th>
                                        <th>Note</th>
                                        <th>Type</th>
                                        <th>Is Spam</th>
                                        <th>Is Best Teacher</th>
                                        <th>Is Express</th>
                                        <th>Is Best Guardian</th>
                                        <th>Is Banned</th>
                                        <th>Is Active</th>
                                        <th>Last Follow Up Date</th>
                                        <th>Last Follow Up Comment</th>
                                        <th>Next Follow Up Date</th>
                                        <th>Next Follow Up Comment</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="24" className="text-center">
                                                <Spinner animation="border" variant="primary" />
                                            </td>
                                        </tr>
                                    ) : (
                                        (filterFollowUpToday ? filteredPhoneList.filter(i => followUpTodayList.some(f => f._id === i._id)) : filteredPhoneList).map((item, index) => (

                                            <tr key={item._id}>
                                                <td>{(currentPage - 1) * 20 + index + 1}</td>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <span className="badge rounded-pill fw-normal text-start mb-1" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9', padding: '0.4em 0.8em' }} title="Created By">CB: {item.createdBy || '-'}</span>
                                                        <span className="badge rounded-pill fw-normal text-start" style={{ backgroundColor: '#e3f2fd', color: '#1565c0', border: '1px solid #bbdefb', padding: '0.4em 0.8em' }} title="Updated By">UB: {item.updatedBy || '-'}</span>
                                                    </div>
                                                </td>
                                                <td>{item.createdAt ? formatDate(item.createdAt) : ''}</td>
                                                <td
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: item.isSpam ? '#dc3545' : item.isBanned ? '#dc3545' : '#007bff'
                                                    }}
                                                >
                                                    {item.phone}
                                                </td>
                                                <td>{item.note}</td>
                                                <td className="fw-bold">
                                                    {[
                                                        item.isBest && <span key="best" className="text-primary">Best Teacher</span>,
                                                        item.isBestGuardian && <span key="bg" className="text-info">Best Guardian</span>,
                                                        item.isSpam && <span key="spam" className="text-danger">Spam</span>,
                                                        item.isExpress && <span key="express" className="text-success">Express Teacher</span>,
                                                        item.isBanned && <span key="banned" className="text-dark">Banned</span>
                                                    ]
                                                        .filter(Boolean)
                                                        .reduce((acc, curr, idx) => (
                                                            acc === null ? [curr] : [...acc, <span key={`amp-${idx}`} className="text-dark mx-1">&</span>, curr]
                                                        ), null)}
                                                </td>
                                                <td
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: item.isSpam ? '#dc3545' : '#007bff'
                                                    }}>{item.isSpam ? 'Yes' : 'No'}</td>
                                                <td
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: item.isBest ? '#dc3545' : '#007bff'
                                                    }}>{item.isBest ? 'Yes' : 'No'}</td>
                                                <td
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: item.isExpress ? 'green' : 'black'
                                                    }}
                                                >
                                                    {item.isExpress ? 'Yes' : 'No'}
                                                </td>
                                                <td
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: item.isBestGuardian ? '#dc3545' : '#007bff'
                                                    }}>{item.isBestGuardian ? 'Yes' : 'No'}</td>
                                                <td
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: item.isBanned ? '#dc3545' : '#007bff'
                                                    }}>{item.isBanned ? 'Yes' : 'No'}</td>
                                                <td>{item.isActive ? 'Yes' : 'No'}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                    {item.lastFollowUpDate ? <Badge bg="secondary">{formatDate(item.lastFollowUpDate)}</Badge> : '-'}
                                                </td>
                                                <td>{item.lastFollowUpComment || '-'}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                    {item.nextFollowUpDate ? <Badge bg="primary">{formatDate(item.nextFollowUpDate)}</Badge> : '-'}
                                                </td>
                                                <td>{item.nextFollowUpComment || '-'}</td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                    <Button variant="info" onClick={() => { setDetailsItem(item); setShowDetailsModal(true); }} title="View Details">
                                                        <FaInfoCircle />
                                                    </Button>
                                                    <Button variant="warning" onClick={() => handleEditRecord(item)} className="mr-2">
                                                        <FaEdit />
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleDeleteRecord(item._id)}>
                                                        <FaTrashAlt />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </Table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
                            <Button
                                variant="outline-primary"
                                className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            >
                                Next <FaChevronRight />
                            </Button>
                        </div>
                    </Card.Body>
                </Card>

                {/* Create/Edit Tuition Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">
                            {editingId ? "Edit Phone Record" : "Create Phone Record"}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="p-4">
                        <Form>
                            <div className="mb-4">
                                <h6 className="text-muted fw-bold mb-3 border-bottom pb-2">Primary Information</h6>
                                <Row className="g-3">
                                    <Col md={12}>
                                        <Form.Group controlId="phone">
                                            <Form.Label className="fw-bold">Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter phone number(s), separated by /"
                                                value={phoneData.phone ?? ''}
                                                onChange={(e) =>
                                                    setPhoneData({ ...phoneData, phone: e.target.value })
                                                }
                                                className="shadow-sm"
                                            />
                                            <Form.Text className="d-block mt-1" style={{ fontSize: '0.9rem', color: '#e57373', fontWeight: '500' }}>
                                                ফোন নম্বর অবশ্যই ০ দিয়ে শুরু হতে হবে। একাধিক নম্বর দিলে '/' ব্যবহার করুন (যেমন: ০১৭... / ০১৮...)।
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group controlId="note">
                                            <Form.Label className="fw-bold">Note</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Add relevant notes here..."
                                                value={phoneData.note ?? ''}
                                                onChange={(e) =>
                                                    setPhoneData({ ...phoneData, note: e.target.value })
                                                }
                                                className="shadow-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>

                            <div>
                                <h6 className="text-muted fw-bold mb-3 border-bottom pb-2">Flags & Statuses</h6>
                                <Row className="g-3">
                                    <Col sm={6} md={4}>
                                        <div className="p-3 border rounded shadow-sm h-100 d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
                                            <Form.Check
                                                type="switch"
                                                id="isActive"
                                                label="Is Active?"
                                                className="fw-bold text-dark w-100"
                                                checked={!!phoneData.isActive}
                                                onChange={(e) =>
                                                    setPhoneData({ ...phoneData, isActive: e.target.checked })
                                                }
                                            />
                                        </div>
                                    </Col>

                                    <Col sm={6} md={4}>
                                        <div className="p-3 border border-danger rounded shadow-sm h-100 d-flex align-items-center bg-white">
                                            <Form.Check
                                                type="switch"
                                                id="isSpam"
                                                label={<span className="text-danger">Is Spam?</span>}
                                                className="fw-bold w-100"
                                                checked={!!phoneData.isSpam}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    if (isChecked && (phoneData.isBest || phoneData.isBestGuardian || phoneData.isExpress)) {
                                                        toast.warning("A number cannot be Spam while having a positive tag!");
                                                        return;
                                                    }
                                                    setPhoneData({ ...phoneData, isSpam: isChecked });
                                                }}
                                            />
                                        </div>
                                    </Col>

                                    <Col sm={6} md={4}>
                                        <div className="p-3 border border-primary rounded shadow-sm h-100 d-flex align-items-center bg-white">
                                            <Form.Check
                                                type="switch"
                                                id="isBest"
                                                label={<span className="text-primary">Best Teacher?</span>}
                                                className="fw-bold w-100"
                                                checked={!!phoneData.isBest}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    if (isChecked && phoneData.isSpam) {
                                                        toast.warning("A number cannot be marked as Best Teacher if it is Spam!");
                                                        return;
                                                    }
                                                    setPhoneData({ ...phoneData, isBest: isChecked });
                                                }}
                                            />
                                        </div>
                                    </Col>

                                    <Col sm={6} md={4}>
                                        <div className="p-3 border border-success rounded shadow-sm h-100 d-flex align-items-center bg-white">
                                            <Form.Check
                                                type="switch"
                                                id="isExpress"
                                                label={<span className="text-success">Express Teacher?</span>}
                                                className="fw-bold w-100"
                                                checked={!!phoneData.isExpress}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    if (isChecked && phoneData.isSpam) {
                                                        toast.warning("A number cannot be marked as Express Teacher if it is Spam!");
                                                        return;
                                                    }
                                                    setPhoneData({ ...phoneData, isExpress: isChecked });
                                                }}
                                            />
                                        </div>
                                    </Col>

                                    <Col sm={6} md={4}>
                                        <div className="p-3 border border-info rounded shadow-sm h-100 d-flex align-items-center bg-white">
                                            <Form.Check
                                                type="switch"
                                                id="isBestGuardian"
                                                label={<span className="text-info">Best Guardian?</span>}
                                                className="fw-bold w-100"
                                                checked={!!phoneData.isBestGuardian}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    if (isChecked && phoneData.isSpam) {
                                                        toast.warning("A number cannot be marked as Best Guardian if it is Spam!");
                                                        return;
                                                    }
                                                    setPhoneData({ ...phoneData, isBestGuardian: isChecked });
                                                }}
                                            />
                                        </div>
                                    </Col>

                                    <Col sm={6} md={4}>
                                        <div className="p-3 border border-dark rounded shadow-sm h-100 d-flex align-items-center bg-white">
                                            <Form.Check
                                                type="switch"
                                                id="isBanned"
                                                label={<span className="text-dark">Is Banned?</span>}
                                                className="fw-bold w-100"
                                                checked={!!phoneData.isBanned}
                                                onChange={(e) =>
                                                    setPhoneData({ ...phoneData, isBanned: e.target.checked })
                                                }
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            {/* Follow Up Section */}
                            <div className="mt-4">
                                <h6 className="text-muted fw-bold mb-3 border-bottom pb-2">Follow Up</h6>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group controlId="lastFollowUpDate">
                                            <Form.Label className="fw-bold">Last Follow Up Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={phoneData.lastFollowUpDate ?? ''}
                                                onChange={(e) => setPhoneData({ ...phoneData, lastFollowUpDate: e.target.value })}
                                                className="shadow-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="lastFollowUpComment">
                                            <Form.Label className="fw-bold">Last Follow Up Comment</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="What happened in last follow up..."
                                                value={phoneData.lastFollowUpComment ?? ''}
                                                onChange={(e) => setPhoneData({ ...phoneData, lastFollowUpComment: e.target.value })}
                                                className="shadow-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="nextFollowUpDate">
                                            <Form.Label className="fw-bold text-primary">Next Follow Up Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={phoneData.nextFollowUpDate ?? ''}
                                                onChange={(e) => setPhoneData({ ...phoneData, nextFollowUpDate: e.target.value })}
                                                className="shadow-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="nextFollowUpComment">
                                            <Form.Label className="fw-bold text-primary">Next Follow Up Comment</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="What to do in next follow up..."
                                                value={phoneData.nextFollowUpComment ?? ''}
                                                onChange={(e) => setPhoneData({ ...phoneData, nextFollowUpComment: e.target.value })}
                                                className="shadow-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer className="bg-light">
                        <Button variant="outline-secondary" className="px-4 fw-bold" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" className="px-4 fw-bold shadow-sm" onClick={handleSaveRequest}>
                            {editingId ? "Save Changes" : "Create Record"}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Follow Up Today Modal */}
                <Modal show={showFollowUpModal} onHide={() => setShowFollowUpModal(false)} size="xl">
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="flex-grow-1 text-center fw-bold">
                            <FaBell className="text-warning" />
                            <span className="ms-2">Phone Follow Up Today: {followUpTodayList.length}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0 bg-light">
                        {followUpTodayList.length > 0 ? (
                            <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                <table className="table table-striped table-bordered table-hover mb-0">
                                    <thead className="bg-dark text-white text-center" style={{ position: 'sticky', top: 0 }}>
                                        <tr>
                                            <th>SL</th>
                                            <th>Phone</th>
                                            <th>Note</th>
                                            <th>Type</th>
                                            <th>Created By / Updated By</th>
                                            <th>Last Follow Up Date</th>
                                            <th>Last Follow Up Comment</th>
                                            <th>Next Follow Up Date</th>
                                            <th>Next Follow Up Comment</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {followUpTodayList.map((item, idx) => (
                                            <tr key={item._id} className="align-middle text-center">
                                                <td>{idx + 1}</td>
                                                <td style={{ fontWeight: 'bold', color: item.isSpam ? '#dc3545' : '#007bff' }}>{item.phone}</td>
                                                <td className="text-start">{item.note || '-'}</td>
                                                <td className="fw-bold">
                                                    {[item.isBest && 'Best Teacher', item.isBestGuardian && 'Best Guardian', item.isSpam && 'Spam', item.isExpress && 'Express', item.isBanned && 'Banned'].filter(Boolean).join(' & ')}
                                                </td>
                                                <td className="text-start">
                                                    <div className="d-flex flex-column gap-1">
                                                        <span className="badge rounded-pill fw-normal" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9' }}>CB: {item.createdBy || '-'}</span>
                                                        <span className="badge rounded-pill fw-normal" style={{ backgroundColor: '#e3f2fd', color: '#1565c0', border: '1px solid #bbdefb' }}>UB: {item.updatedBy || '-'}</span>
                                                    </div>
                                                </td>
                                                <td><Badge bg="secondary">{formatDate(item.lastFollowUpDate)}</Badge></td>
                                                <td className="text-start">{item.lastFollowUpComment || '-'}</td>
                                                <td><Badge bg="primary">{formatDate(item.nextFollowUpDate)}</Badge></td>
                                                <td className="text-start">{item.nextFollowUpComment || '-'}</td>
                                                <td>
                                                    <Button variant="warning" size="sm" onClick={() => { setShowFollowUpModal(false); handleEditRecord(item); }}>
                                                        <FaEdit />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center text-muted py-5">
                                <h5>No phone follow-ups scheduled for today.</h5>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowFollowUpModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>

                {/* Details Modal */}
                <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
                    <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #1565c0, #0d47a1)', color: '#fff', padding: '12px 20px' }}>
                        <Modal.Title className="fw-bold d-flex align-items-center gap-2" style={{ fontSize: '1rem' }}>
                            <FaInfoCircle className="text-warning" />
                            {detailsItem?.phone || 'Phone Details'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0">
                        {detailsItem && (
                            <table className="table table-sm table-borderless mb-0" style={{ fontSize: '0.875rem' }}>
                                <tbody>
                                    <tr style={{ background: '#f0f4ff' }}>
                                        <td className="fw-semibold text-muted ps-3 py-2" style={{ width: '40%' }}>Tags</td>
                                        <td className="py-2 pe-3">
                                            <div className="d-flex flex-wrap gap-1">
                                                {detailsItem.isBest && <Badge bg="primary" style={{ fontSize: '0.75rem' }}>Best Teacher</Badge>}
                                                {detailsItem.isBestGuardian && <Badge bg="info" style={{ fontSize: '0.75rem' }}>Best Guardian</Badge>}
                                                {detailsItem.isSpam && <Badge bg="danger" style={{ fontSize: '0.75rem' }}>Spam</Badge>}
                                                {detailsItem.isExpress && <Badge bg="success" style={{ fontSize: '0.75rem' }}>Express</Badge>}
                                                {detailsItem.isBanned && <Badge bg="dark" style={{ fontSize: '0.75rem' }}>Banned</Badge>}
                                                {detailsItem.isActive && <Badge bg="secondary" style={{ fontSize: '0.75rem' }}>Active</Badge>}
                                                {!detailsItem.isBest && !detailsItem.isBestGuardian && !detailsItem.isSpam && !detailsItem.isExpress && !detailsItem.isBanned && <span className="text-muted">—</span>}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold text-muted ps-3 py-2">Note</td>
                                        <td className="py-2 pe-3">{detailsItem.note || '—'}</td>
                                    </tr>
                                    <tr style={{ background: '#f0f4ff' }}>
                                        <td className="fw-semibold text-muted ps-3 py-2">Created By</td>
                                        <td className="py-2 pe-3 fw-semibold" style={{ color: '#2e7d32' }}>{detailsItem.createdBy || '—'}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold text-muted ps-3 py-2">Updated By</td>
                                        <td className="py-2 pe-3 fw-semibold" style={{ color: '#1565c0' }}>{detailsItem.updatedBy || '—'}</td>
                                    </tr>
                                    <tr style={{ background: '#f0f4ff' }}>
                                        <td className="fw-semibold text-muted ps-3 py-2">Created At</td>
                                        <td className="py-2 pe-3">{detailsItem.createdAt ? formatDate(detailsItem.createdAt) : '—'}</td>
                                    </tr>
                                    <tr className="table-active">
                                        <td colSpan={2} className="fw-bold text-primary ps-3 py-1" style={{ fontSize: '0.78rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Follow Up</td>
                                    </tr>
                                    <tr style={{ background: '#f0f4ff' }}>
                                        <td className="fw-semibold text-muted ps-3 py-2">Last Follow Up</td>
                                        <td className="py-2 pe-3">
                                            {detailsItem.lastFollowUpDate ? <><Badge bg="secondary" style={{ fontSize: '0.75rem' }}>{formatDate(detailsItem.lastFollowUpDate)}</Badge><div className="text-muted small mt-1">{detailsItem.lastFollowUpComment || ''}</div></> : '—'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold text-muted ps-3 py-2">Next Follow Up</td>
                                        <td className="py-2 pe-3">
                                            {detailsItem.nextFollowUpDate ? <><Badge bg="primary" style={{ fontSize: '0.75rem' }}>{formatDate(detailsItem.nextFollowUpDate)}</Badge><div className="text-muted small mt-1">{detailsItem.nextFollowUpComment || ''}</div></> : '—'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </Modal.Body>
                    <Modal.Footer style={{ padding: '8px 16px', borderTop: '1px solid #e9ecef' }}>
                        <Button size="sm" variant="warning" onClick={() => { setShowDetailsModal(false); handleEditRecord(detailsItem); }}>
                            <FaEdit className="me-1" /> Edit
                        </Button>
                        <Button size="sm" variant="outline-secondary" onClick={() => setShowDetailsModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer />
            </Container>
        </>
    );
};

export default PhonePage;

// Styled Components
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
