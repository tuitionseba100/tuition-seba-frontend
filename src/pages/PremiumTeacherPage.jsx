import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaInfoCircle, FaTrashAlt, FaWhatsapp, FaChevronLeft, FaChevronRight, FaSearch, FaTimes } from 'react-icons/fa'; // React Icons
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Select from 'react-select';

const PremiumTeacherPage = () => {
    const [reacrodsList, setReacrodsList] = useState([]);
    const [exportList, setExportList] = useState([]);
    const [filteredTeacherList, setFilteredTeacherList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedCity, setSelectedCity] = useState('');
    const [areaList, setAreaList] = useState([]);
    const token = localStorage.getItem('token');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [summaryCounts, setSummaryCounts] = useState({});
    const role = localStorage.getItem('role');

    const [searchInputs, setSearchInputs] = useState({
        premiumCode: '',
        name: '',
        phone: '',
        currentArea: '',
        status: '',
        gender: '',
        uniCode: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        premiumCode: '',
        name: '',
        phone: '',
        currentArea: '',
        status: '',
        gender: '',
        uniCode: ''
    });

    const searchFields = [
        { key: 'premiumCode', label: 'Premium Code', type: 'text', col: 2 },
        {
            key: 'uniCode', label: 'UniCode', type: 'select', options: ['CMC', 'CUET', 'CU Science', 'CU Arts', 'CU Commerce', 'CVASU', 'Private Science', 'Private Commerce', 'Private Arts', 'National Science', 'National Arts', 'National Commerce', 'Arabic', 'NC English', 'BC English', 'Special']
            , col: 1
        },
        { key: 'name', label: 'Name', type: 'text', col: 2 },
        { key: 'phone', label: 'Phone|Alt.|WhatsApp', type: 'text', col: 2 },
        { key: 'currentArea', label: 'Area', type: 'text', col: 2 },
        { key: 'status', label: 'Status', type: 'select', options: ['pending', 'under review', 'pending payment', 'rejected', 'verified', 'suspended'], col: 1 },
        { key: 'gender', label: 'Gender', type: 'select', options: ['male', 'female'], col: 1 }
    ];

    const fieldConfig = [
        // Personal Info
        { name: 'name', label: 'Name', col: 6, group: 'Personal Info' },
        { name: 'gender', label: 'Gender', col: 6, group: 'Personal Info', type: 'select', options: ['male', 'female'] },
        { name: 'phone', label: 'Phone', col: 6, group: 'Personal Info' },
        { name: 'alternativePhone', label: 'Alternative Phone', col: 6, group: 'Personal Info' },
        { name: 'whatsapp', label: 'WhatsApp', col: 6, group: 'Personal Info' },
        { name: 'email', label: 'Email', col: 6, group: 'Personal Info' },
        { name: 'facebookLink', label: 'Facebook Link', col: 6, group: 'Personal Info' },
        { name: 'familyPhone', label: 'Family Phone', col: 6, group: 'Personal Info' },
        { name: 'friendPhone', label: 'Friend Phone', col: 6, group: 'Personal Info' },
        { name: 'city', label: 'City', col: 6, group: 'Personal Info' },
        { name: 'currentArea', label: 'Current Area', col: 6, group: 'Personal Info' },
        { name: 'fullAddress', label: 'Full Address', col: 6, group: 'Personal Info' },

        // Academic Info
        { name: 'academicYear', label: 'Academic Year', type: 'select', options: ['1st', '2nd', '3rd', '4th', '5th/masters', 'completed'], col: 6, group: 'Academic Info' },
        { name: 'medium', label: 'Medium', col: 6, group: 'Academic Info' },
        { name: 'mastersDept', label: 'Masters Dept', col: 6, group: 'Academic Info' },
        { name: 'mastersUniversity', label: 'Masters University', col: 6, group: 'Academic Info' },
        { name: 'honorsDept', label: 'Honors Dept', col: 6, group: 'Academic Info' },
        { name: 'honorsUniversity', label: 'Honors University', col: 6, group: 'Academic Info' },
        { name: 'hscGroup', label: 'HSC Group', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Vocational'], col: 6, group: 'Academic Info' },
        { name: 'hscResult', label: 'HSC Result', col: 6, group: 'Academic Info' },
        { name: 'sscGroup', label: 'SSC Group', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Vocational'], col: 6, group: 'Academic Info' },
        { name: 'sscResult', label: 'SSC Result', col: 6, group: 'Academic Info' },

        // Teaching Profile
        { name: 'experience', label: 'Experience', col: 6, group: 'Teaching Profile' },
        { name: 'favoriteSubject', label: 'Favorite Subject', col: 6, group: 'Teaching Profile' },
        { name: 'expectedTuitionAreas', label: 'Expected Tuition Areas', col: 6, group: 'Teaching Profile' },
        { name: 'commentFromTeacher', label: 'Comment From Teacher', col: 6, group: 'Teaching Profile' },

        // Subscription & Payment Details
        { name: 'premiumCode', label: 'Premium Code', col: 6, group: 'Subscription & Payment Details' },
        { name: 'password', label: 'Password', col: 6, group: 'Subscription & Payment Details' },
        { name: 'status', label: 'Subscription Status', type: 'select', col: 6, options: ['pending', 'under review', 'pending payment', 'rejected', 'verified', 'suspended'], group: 'Subscription & Payment Details' },
        { name: 'uniCode', label: 'Uni Code', type: 'select', col: 6, options: ['CMC', 'CUET', 'CU Science', 'CU Arts', 'CU Commerce', 'CVASU', 'Private Science', 'Private Commerce', 'Private Arts', 'National Science', 'National Arts', 'National Commerce', 'Arabic', 'NC English', 'BC English', 'Special'], group: 'Subscription & Payment Details' },
        { name: 'transactionId', label: 'Transaction ID', col: 6, group: 'Subscription & Payment Details' },
        { name: 'paymentType', label: 'Payment Method', col: 6, group: 'Subscription & Payment Details' },
        { name: 'amount', label: 'Amount Paid', col: 6, group: 'Subscription & Payment Details' },

        // Notes & Feedback
        { name: 'comment', label: 'Comment from agent', col: 6, group: 'Notes & Feedback' }
    ];

    const cityOptions = [
        { value: 'chittagong', label: 'Chittagong' },
        { value: 'dhaka', label: 'Dhaka' },
    ];

    const areaOptions = {
        chittagong: [
            "2 no gate area", "Agrabad", "Anwara", "Alkaran", "Anderkilla", "Aturar Depo", "Banskhali", "Bandartilla", "Bahaddarhat", "Baizid",
            "Bagmaniram", "Bakalia", "Boxirhat", "Chandgao", "Chawkbazar", "Colonel Hut",
            "CU Campus", "Dewan Bazar", "Dewanhat", "East Halishahar", "East Madarbari", "Enayet Bazar",
            "Firingee Bazar", "Foy's Lake", "GEC", "Gosaildanga", "Hathazari", "Halishahar", "Jamal Khan",
            "Kalamia Bazar", "Kaptai Rasthar Matha", "Kotowali", "Karnaphuli", "Khulshi", "Lalkhan Bazar", "Muradpur", "Nasirabad",
            "New Market", "North Agrabad", "North Halishahar", "North Kattali", "North Middle Halishahar",
            "North Patenga", "Notun Bridge", "Oxygen", "Patharghata", "Pathantooly", "Patenga", "Pahartali",
            "Panchlaish", "Rahattarpool", "Saraipara", "Sholokbahar", "South Agrabad", "South Halishahar",
            "South Kattali", "South Middle Halishahar", "South Patenga", "South Pahartali", "Stillmill Bazar", "West Halishahar", "Wasa",
            "West Madarbari"
        ].map(a => ({ value: a, label: a })),

        dhaka: [
            "Adabor", "Badda", "Banani", "Bhasantek", "Biman Bandar", "Cantonment",
            "Dakshinkhan", "Darus Salam", "Demra", "Dhanmondi", "Gendaria", "Gulshan",
            "Hazaribagh", "Jatrabari", "Kafrul", "Kalabagan", "Kamrangir Char", "Khilgaon",
            "Khilkhet", "Kotwali", "Lalbagh", "Mirpur", "Mohammadpur", "Motijheel",
            "New Market", "Pallabi", "Paltan", "Ramna", "Rampura", "Sabujbagh", "Shah Ali",
            "Shahbagh", "Sher E Bangla Nagar", "Shyampur", "Sutrapur", "Tejgaon", "Turag",
            "Uttara", "Uttar Khan"
        ].map(a => ({ value: a, label: a }))
    };

    const summaryCardOptions = [
        { key: 'total', label: 'Total Applied', borderColor: 'dark', textColor: 'dark' },
        { key: 'pending', label: 'Pending', borderColor: 'warning', textColor: 'warning' },
        { key: 'under_review', label: 'Under Review', borderColor: 'info', textColor: 'info' },
        { key: 'pending_payment', label: 'Pending Payment', borderColor: 'primary', textColor: 'primary' },
        { key: 'rejected', label: 'Rejected', borderColor: 'danger', textColor: 'danger' },
        { key: 'verified', label: 'Verified', borderColor: 'success', textColor: 'success' },
    ];

    const initialData = fieldConfig.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
    }, {});
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        fetchTableData();
    }, []);

    useEffect(() => {
        fetchTableData();
    }, [appliedFilters, currentPage]);

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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/regTeacher/getTableData`, {
                params: {
                    page: currentPage,
                    ...appliedFilters
                },
                headers: { Authorization: token }
            });

            setReacrodsList(response.data.data);
            setFilteredTeacherList(response.data.data);
            setTotalPages(response.data.totalPages);
            fetchSummary();
        } catch (err) {
            console.error('Error fetching paginated records:', err);
            toast.error("Failed to load Teacher records.");
        }
        setLoading(false);
    };

    const handleResetFilters = () => {
        const resetFilters = {
            premiumCode: '',
            name: '',
            phone: '',
            currentArea: '',
            status: '',
            gender: '',
            uniCode: ''
        };
        setSearchInputs(resetFilters);
        setAppliedFilters(resetFilters);
        setCurrentPage(1);
    };

    const fetchSummary = async () => {
        try {
            const res = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/regTeacher/summary`, {
                params: appliedFilters,
                headers: { Authorization: token }
            });
            setExportList(res.data.allData);
            setSummaryCounts(res.data);
        } catch (err) {
            console.error('Error fetching summary:', err);
        }
    };

    const handleShowDetails = (teacher) => {
        setSelectedTeacher(teacher);
        setShowDetailsModal(true);
    };

    const handleExportToExcel = () => {
        const headers = fieldConfig.map(f => f.label);

        const data = exportList.map(item =>
            fieldConfig.map(f => String(item[f.name] ?? ""))
        );

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

        worksheet['!cols'] = fieldConfig.map(() => ({ wpx: 120 }));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Premium Teachers");
        XLSX.writeFile(workbook, `Premium Teachers_${formatDateTimeForFilename()}.xlsx`);
    };

    const formatDateTimeForFilename = (date = new Date()) => {
        const datePart = date.toLocaleDateString().replace(/\//g, '-');
        const timePart = date.toLocaleTimeString().replace(/:/g, '-');
        return `${datePart}_${timePart}`;
    };

    const handleSaveRecord = async () => {
        const updatingData = {
            ...formData,
            status: formData.status ? formData.status : "pending"
        };
        try {
            if (editingId) {
                await axios.put(
                    `https://tuition-seba-backend-1.onrender.com/api/regTeacher/edit/${editingId}`,
                    updatingData,
                    {
                        headers: {
                            Authorization: token
                        }
                    }
                );
                toast.success("Teacher record updated successfully!");
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/regTeacher/add', updatingData);
                toast.success("Teacher record created successfully!");
            }
            setShowModal(false);
            fetchTableData();
            fetchSummary();

        } catch (err) {
            console.error('Error saving Teacher record:', err);
            toast.error("Error saving Teacher record.");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const optionsDate = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };

        const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
        const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);

        return `${formattedDate} || ${formattedTime}`;
    };

    const handleEditTeacher = (teacher) => {
        setFormData(teacher);
        setAreaList(areaOptions[teacher.city] || []);
        setEditingId(teacher._id);
        setShowModal(true);
    };

    const handleDeleteTeacher = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this record?");

        if (confirmDelete) {
            try {
                await axios.delete(
                    `https://tuition-seba-backend-1.onrender.com/api/regTeacher/delete/${id}`,
                    {
                        headers: {
                            Authorization: token
                        }
                    }
                );
                toast.success("Deleted successfully!");
                fetchTableData();
                fetchSummary();

            } catch (err) {
                console.error('Error:', err);
                toast.error("Error.");
            }
        } else {
            toast.info("Deletion canceled");
        }
    };

    const getEmptyFormData = () => {
        return fieldConfig.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {});
    };

    const handleShare = (teacherDetails) => {
        const getValue = (val) => val || 'N/A';

        const message =
            `টিউশন সেবা ফোরাম (আস্থা ও বিশ্বস্ততায় একধাপ এগিয়ে)\n` +
            `যোগাযোগ: 01633920928\n` +
            `ওয়েবসাইট: www.tuitionsebaforum.com\n\n` +

            `*Verified Premium Tutor*\n` +
            `Premium Code: *${getValue(teacherDetails.premiumCode)}*\n\n` +

            `*Teacher CV*\n` +
            `Name: *${getValue(teacherDetails.name)}*\n` +
            `Area: *${getValue(teacherDetails.currentArea)}*\n\n` +

            `*Academic Qualifications*\n` +
            `Honours University: *${getValue(teacherDetails.honorsUniversity)}*\n` +
            `Department: *${getValue(teacherDetails.honorsDept)}*\n` +
            `HSC - Group: *${getValue(teacherDetails.hscGroup)}*, Result: *${getValue(teacherDetails.hscResult)}*\n` +
            `SSC - Group: *${getValue(teacherDetails.sscGroup)}*, Result: *${getValue(teacherDetails.sscResult)}*\n\n` +

            `*Experience*: ${getValue(teacherDetails.experience)}\n` +
            `*Address*: ${getValue(teacherDetails.fullAddress)}\n` +
            `*Favorite Subject*: ${getValue(teacherDetails.favoriteSubject)}`;

        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const statusColors = {
        'pending': { bg: 'bg-warning', text: 'text-dark' },
        'under review': { bg: 'bg-info', text: 'text-dark' },
        'pending payment': { bg: 'bg-primary', text: 'text-white' },
        'rejected': { bg: 'bg-danger', text: 'text-white' },
        'verified': { bg: 'bg-success', text: 'text-white' },
        'suspended': { bg: 'bg-dark', text: 'text-white' }
    };

    return (
        <>
            <NavBarPage />
            <Container>
                <Header>
                    <h2 className='text-primary fw-bold'>Premium Teachers</h2>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setShowModal(true);
                            setEditingId(null);
                            setFormData(getEmptyFormData());
                        }}
                    >
                        Create Teacher
                    </Button>

                </Header>
                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            {summaryCardOptions.map(({ key, label, borderColor, textColor }) => (
                                <div key={key} className="col-6 col-sm-4 col-md-2 mb-3">
                                    <div className={`card p-3 shadow border-${borderColor}`}>
                                        <div className="d-flex flex-column align-items-center">
                                            <span className={`text-${textColor}`} style={{ fontWeight: 'bolder' }}>
                                                {label}
                                            </span>
                                            <span>{summaryCounts[key] ?? 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>

                {/* Search bar */}
                <Row className="mt-2 mb-3">
                    {searchFields.map(({ key, label, type, options, col }) => (
                        <Col md={col} key={key}>
                            <Form.Label className="fw-bold">{label}</Form.Label>

                            {key === 'currentArea' ? (
                                <Form.Select
                                    value={searchInputs.currentArea}
                                    onChange={(e) => handleSearchInputChange('currentArea', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                >
                                    <option value="">All</option>
                                    {[
                                        ...areaOptions.chittagong.map(a => ({ ...a, city: 'Chittagong' })),
                                        ...areaOptions.dhaka.map(a => ({ ...a, city: 'Dhaka' }))
                                    ]
                                        .sort((a, b) => a.value.localeCompare(b.value))
                                        .map((opt, index) => (
                                            <option key={`${opt.value}-${opt.city}-${index}`} value={opt.value}>
                                                {`${opt.value} (${opt.city})`}
                                            </option>
                                        ))
                                    }
                                </Form.Select>
                            ) : type === 'select' ? (
                                <Form.Select
                                    value={searchInputs[key]}
                                    onChange={(e) => handleSearchInputChange(key, e.target.value)}
                                    onKeyPress={handleKeyPress}
                                >
                                    <option value="">All</option>
                                    {options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </Form.Select>
                            ) : (
                                <Form.Control
                                    type="text"
                                    placeholder={`Search by ${label}`}
                                    value={searchInputs[key]}
                                    onChange={(e) => handleSearchInputChange(key, e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            )}
                        </Col>
                    ))}

                    <Col md={1} className="d-flex align-items-end">
                        <Row className="g-1 w-100">
                            <Col xs={6}>
                                <Button
                                    variant="success"
                                    onClick={handleSearch}
                                    className="d-flex align-items-center justify-content-center w-100"
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaSearch />}
                                </Button>
                            </Col>
                            <Col xs={6}>
                                <Button
                                    variant="danger"
                                    onClick={handleResetFilters}
                                    className="d-flex align-items-center justify-content-center w-100"
                                >
                                    <FaTimes />
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {role === "superadmin" && (
                    <Button
                        variant="success"
                        className="mb-3 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleExportToExcel}
                        disabled={exportList.length === 0}
                    >
                        {exportList.length === 0 ? (
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
                        <Card.Title>Premium Teacher List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Premium Code</th>
                                        <th>Uni Code</th>
                                        <th>Status</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Phone (WP)</th>
                                        <th>Hons. Dept.</th>
                                        <th>Hons. Uni..</th>
                                        <th>Academic Year</th>
                                        <th>Current Area</th>
                                        <th>Full Address</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="10" className="text-center">
                                                <div
                                                    className="d-flex justify-content-center align-items-center"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '90%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        width: '100vw',
                                                        height: '100vh',
                                                    }}
                                                >
                                                    <Spinner animation="border" variant="primary" size="lg" />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTeacherList
                                            .map((item, index) => (
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.premiumCode}</td>
                                                    <td>{item.uniCode}</td>

                                                    <td>
                                                        <span
                                                            className={`badge ${statusColors[item.status]?.bg || 'bg-secondary'} ${statusColors[item.status]?.text || 'text-white'}`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td>{item.name}</td>
                                                    <td>{item.phone}</td>
                                                    <td>{item.whatsapp}</td>
                                                    <td>{item.honorsDept}</td>
                                                    <td>{item.honorsUniversity}</td>
                                                    <td>{item.academicYear}</td>
                                                    <td>{item.currentArea}</td>
                                                    <td>{item.fullAddress}</td>
                                                    <td style={{ display: 'flex', gap: '8px' }}>
                                                        <Button variant="info" size="sm" onClick={() => handleShowDetails(item)}>
                                                            <FaInfoCircle />
                                                        </Button>

                                                        <Button variant="warning" onClick={() => handleEditTeacher(item)} size="sm">
                                                            <FaEdit />
                                                        </Button>
                                                        <Button variant="danger" onClick={() => handleDeleteTeacher(item._id)} size="sm">
                                                            <FaTrashAlt />
                                                        </Button>
                                                        <Button variant="success" onClick={() => handleShare(item)}>
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

                <Modal
                    show={showDetailsModal}
                    onHide={() => setShowDetailsModal(false)}
                    size="xl"
                    centered
                    scrollable
                >
                    <Modal.Header closeButton className="border-bottom-0">
                        <Modal.Title className="fw-bold fs-4">Teacher Details</Modal.Title>
                    </Modal.Header>

                    <Modal.Body
                        className="px-4 py-3"
                        style={{ maxHeight: '75vh', overflowY: 'auto' }}
                    >
                        {selectedTeacher?.password && (
                            <div className="mb-4">
                                <div
                                    className="w-100 rounded bg-primary text-white d-flex justify-content-center align-items-center shadow-sm"
                                    style={{ height: '60px', fontSize: '1.25rem', fontWeight: '600' }}
                                >
                                    Premium Code: <span className="ms-3">{selectedTeacher.premiumCode}</span>
                                </div>
                            </div>
                        )}

                        {selectedTeacher ? (
                            Object.entries(
                                fieldConfig.reduce((groups, field) => {
                                    (groups[field.group] = groups[field.group] || []).push(field);
                                    return groups;
                                }, {})
                            ).map(([groupName, fields]) => (
                                <section key={groupName} className="mb-4">
                                    <h5 className="border-bottom pb-2 mb-3 text-primary fw-semibold">{groupName}</h5>
                                    <div className="row gx-4 gy-4">
                                        {fields.map(({ name, label, type }) => {
                                            const value = selectedTeacher[name];
                                            return (
                                                <div
                                                    key={name}
                                                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                                                >
                                                    <div className="border rounded bg-white p-3 h-100 shadow-sm d-flex flex-column">
                                                        <small
                                                            className="mb-2 text-primary"
                                                            style={{
                                                                fontWeight: 900,
                                                                letterSpacing: '0.02em',
                                                            }}
                                                        >
                                                            {label}
                                                        </small>

                                                        <div
                                                            className="flex-grow-1 text-break"
                                                            style={{
                                                                fontWeight: type === 'password' ? '700' : '400',
                                                                fontSize: '1rem',
                                                                color: type === 'password' ? '#444' : '#222',
                                                                userSelect: 'text',
                                                            }}
                                                            title={type === 'password' ? value : undefined}
                                                        >
                                                            {type === 'password' ? '••••••' : value?.toString().trim() || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <p className="text-center text-muted fst-italic">No details available.</p>
                        )}
                    </Modal.Body>

                    <Modal.Footer className="border-top-0">
                        <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Create/Edit Tuition Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered scrollable>
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold text-primary">{editingId ? "Edit Teacher" : "Create Teacher"}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            {Object.entries(
                                fieldConfig.reduce((groups, field) => {
                                    if (!groups[field.group]) groups[field.group] = [];
                                    groups[field.group].push(field);
                                    return groups;
                                }, {})
                            ).map(([groupName, fields]) => (
                                <div key={groupName} className="mb-4">
                                    <h5 className="fw-bold mb-3 text-primary border-bottom pb-1">{groupName}</h5>
                                    <Row>
                                        {fields.map((field, idx) => (
                                            <Col md={field.col || 6} key={idx}>
                                                <Form.Group controlId={field.name} className="mb-3">
                                                    <Form.Label className="fw-bold">{field.label}</Form.Label>

                                                    {field.name === "city" ? (
                                                        <Select
                                                            options={cityOptions}
                                                            value={cityOptions.find((opt) => opt.value === formData.city) || null}
                                                            onChange={(selected) => {
                                                                const cityVal = selected?.value || "";
                                                                setSelectedCity(cityVal);
                                                                setFormData({ ...formData, city: cityVal, currentArea: "" });
                                                                setAreaList(areaOptions[cityVal] || []);
                                                            }}
                                                            placeholder="Select City"
                                                            isClearable
                                                            isSearchable
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    minHeight: "38px",
                                                                    fontSize: "0.875rem",
                                                                }),
                                                                menu: (base) => ({ ...base, fontSize: "0.875rem" }),
                                                            }}
                                                        />
                                                    ) : field.name === "currentArea" ? (
                                                        <Select
                                                            options={areaList}
                                                            value={areaList.find((opt) => opt.value === formData.currentArea) || null}
                                                            onChange={(selected) =>
                                                                setFormData({ ...formData, currentArea: selected?.value || "" })
                                                            }
                                                            placeholder="Select Area"
                                                            isClearable
                                                            isSearchable
                                                            isDisabled={!formData.city}
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    minHeight: "38px",
                                                                    fontSize: "0.875rem",
                                                                }),
                                                                menu: (base) => ({ ...base, fontSize: "0.875rem" }),
                                                            }}
                                                        />
                                                    ) : field.type === "select" ? (
                                                        <Form.Control
                                                            as="select"
                                                            value={formData[field.name] || ""}
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, [field.name]: e.target.value })
                                                            }
                                                            required
                                                        >
                                                            <option value="">Select {field.label}</option>
                                                            {field.options.map((opt, i) => (
                                                                <option key={i} value={opt}>
                                                                    {opt}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
                                                    ) : (
                                                        <Form.Control
                                                            type={field.type || "text"}
                                                            value={formData[field.name] || ""}
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, [field.name]: e.target.value })
                                                            }
                                                            required
                                                        />
                                                    )}
                                                </Form.Group>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            ))}
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveRecord}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>


                <ToastContainer />
            </Container>
        </>
    );
};

export default PremiumTeacherPage;

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
