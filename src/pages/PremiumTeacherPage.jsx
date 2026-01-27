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
import locationsBd from '../data/DivisonWiseLocation.json';
import CreatableSelect from 'react-select/creatable';

const PremiumTeacherPage = () => {
    const [reacrodsList, setReacrodsList] = useState([]);
    const [exportList, setExportList] = useState([]);
    const [filteredTeacherList, setFilteredTeacherList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [showTuitionApplyModal, setShowTuitionApplyModal] = useState(false);
    const [tuitionApplyList, setTuitionApplyList] = useState([]);
    const [selectedPremiumCode, setSelectedPremiumCode] = useState('');
    const [applyLoading, setApplyLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');
    const [areaList, setAreaList] = useState([]);
    const token = localStorage.getItem('token');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [summaryCounts, setSummaryCounts] = useState({});
    const role = localStorage.getItem('role');
    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [districtList, setDistrictList] = useState([]);
    const [thanaList, setThanaList] = useState([]);

    const [searchInputs, setSearchInputs] = useState({
        premiumCode: '',
        name: '',
        phone: '',
        department: '',
        currentArea: '',
        status: '',
        gender: '',
        uniCode: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        premiumCode: '',
        name: '',
        phone: '',
        department: '',
        currentArea: '',
        status: '',
        gender: '',
        uniCode: ''
    });

    const searchFields = [
        { key: 'premiumCode', label: 'Premium Code', type: 'text', col: 1 },
        { key: 'department', label: 'Department', type: 'text', col: 1 },
        {
            key: 'uniCode', label: 'UniCode', type: 'select', options: ['CMC', 'CUET', 'CU Science', 'CU Arts', 'CU Commerce', 'CVASU', 'Private Science', 'Private Commerce', 'Private Arts', 'National Science', 'National Arts', 'National Commerce', 'Arabic', 'NC English', 'BC English', 'Special']
            , col: 1
        },
        { key: 'name', label: 'Name', type: 'text', col: 2 },
        { key: 'phone', label: 'Phone|Alt.|WhatsApp', type: 'text', col: 2 },
        { key: 'currentArea', label: 'Area', type: 'text', col: 2 },
        { key: 'status', label: 'Status', type: 'select', options: ['pending', 'under review', 'pending payment', 'Must Advance', 'After Confirmation', 'After Salary', '30% Advance', 'rejected', 'verified', 'suspended'], col: 1 },
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
        { name: 'division', label: 'Division', col: 6, group: 'Personal Info' },
        { name: 'district', label: 'District', col: 6, group: 'Personal Info' },
        { name: 'thana', label: 'Thana', col: 6, group: 'Personal Info' },

        // Academic Info
        { name: 'academicYear', label: 'Academic Year', type: 'select', options: ['1st', '2nd', '3rd', '4th', '5th/masters', 'completed'], col: 6, group: 'Academic Info' },
        { name: 'medium', label: 'Medium', col: 6, group: 'Academic Info' },
        { name: 'mastersDept', label: 'Masters Dept', col: 6, group: 'Academic Info' },
        { name: 'mastersUniversity', label: 'Masters University', col: 6, group: 'Academic Info' },
        { name: 'honorsDept', label: 'Honors Dept', col: 6, group: 'Academic Info' },
        { name: 'honorsUniversity', label: 'Honors University', col: 6, group: 'Academic Info' },
        { name: 'college', label: 'HSC College', col: 6, group: 'Academic Info' },
        { name: 'hscGroup', label: 'HSC Group', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Vocational'], col: 6, group: 'Academic Info' },
        { name: 'hscResult', label: 'HSC Result', col: 6, group: 'Academic Info' },
        { name: 'school', label: 'SSC School', col: 6, group: 'Academic Info' },
        { name: 'sscGroup', label: 'SSC Group', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Vocational'], col: 6, group: 'Academic Info' },
        { name: 'sscResult', label: 'SSC Result', col: 6, group: 'Academic Info' },
        { name: 'isResultShow', label: 'Show SSC & HSC Result?', col: 12, group: 'Academic Info', type: 'checkbox' },

        // Teaching Profile
        { name: 'experience', label: 'Experience', col: 6, group: 'Teaching Profile' },
        { name: 'favoriteSubject', label: 'Favorite Subject', col: 6, group: 'Teaching Profile' },
        { name: 'expectedTuitionAreas', label: 'Expected Tuition Areas', col: 6, group: 'Teaching Profile' },
        { name: 'commentFromTeacher', label: 'Comment From Teacher', col: 6, group: 'Teaching Profile' },

        // Subscription & Payment Details
        { name: 'premiumCode', label: 'Premium Code', col: 6, group: 'Subscription & Payment Details' },
        { name: 'password', label: 'Password', col: 6, group: 'Subscription & Payment Details' },
        { name: 'status', label: 'Subscription Status', type: 'select', col: 6, options: ['pending', 'under review', 'pending payment', 'Must Advance', 'After Confirmation', 'After Salary', '30% Advance', 'rejected', 'verified', 'suspended'], group: 'Subscription & Payment Details' },
        { name: 'uniCode', label: 'Uni Code', type: 'select', col: 6, options: ['CMC', 'CUET', 'CU Science', 'CU Arts', 'CU Commerce', 'CVASU', 'Private Science', 'Private Commerce', 'Private Arts', 'National Science', 'National Arts', 'National Commerce', 'Arabic', 'NC English', 'BC English', 'Special'], group: 'Subscription & Payment Details' },
        { name: 'transactionId', label: 'Transaction ID', col: 6, group: 'Subscription & Payment Details' },
        { name: 'paymentType', label: 'Payment Method', col: 6, group: 'Subscription & Payment Details' },
        { name: 'amount', label: 'Amount Paid', col: 6, group: 'Subscription & Payment Details' },
        { name: 'isBiodataShow', label: 'Show Biodata?', col: 12, group: 'Subscription & Payment Details', type: 'checkbox' },

        // Notes & Feedback
        { name: 'comment', label: 'Comment from agent', col: 6, group: 'Notes & Feedback' },
        { name: 'rating', label: 'Rating', col: 6, group: 'Notes & Feedback', type: 'star-rating' }
    ];

    const cityOptions = [
        { value: 'chittagong', label: 'Chittagong' },
        { value: 'dhaka', label: 'Dhaka' },
    ];

    const areaOptions = {
        chittagong: [
            "2 Number Gate", "Agrabad", "Agrbad CDA", "Ak Khan", "Akbarshah", "Alongkar", "Aman bazar", "Ambagan", "Andorkillah", "Aturar Depo", "Baddarhat", "Baklia accese road", "Baluchara", "Bandartila", "Baroquerter", "Barek Building", "Baizid", "Bahir Signal", "Boropol", "Cement Crossing", "Chawkbazar", "Chandgao", "Chowmohoni", "City Gate", "Commerce college road", "Cornelhut", "CRB", "Cuna Factory road", "Customs", "CU Campus",
            "Dampara", "Dewanbazar", "Dewanhat", "Didar Market", "Eidgah kacha rasta", "Firingibazar", "Firozsah", "Foyezlake", "Freeport", "Gec", "Halishohor", "Hathazari", "Jamalkhan", "Jubilee Road", "Kajir dewri", "Kalurghat", "Kalamia Bazar", "Kapasgola", "Kaptai Rastar Matha", "Katgor", "Khaja Road", "Khulsi", "Kodomtoli", "Kotoali", "Lalkhan Bazar", "Love lane", "Majirghat", "Miler Matha", "Muradpur", "Nalapara", "Nandan kanon",
            "New Market", "Nimtola", "Noton Bridge", "Noyabazar", "Oxyzen", "Panchlaish", "Patharghata", "Pahartali", "Patenga", "Polytechnic More", "Rahattarpol", "Sadharghat", "Sagorika", "Saltgola Crossing", "Shershah", "Solokbohor", "Soloshohor", "Stillmil Bazar", "Tiger Pass", "Vatiyari", "Wasa", "West Madarbari"
        ].map(a => ({ value: a, label: a })),

        dhaka: [
            "Coming Soon"
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
        acc[field.name] = field.type === 'checkbox' ? false : (field.type === 'star-rating' ? 0 : '');
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
            department: '',
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

    const handleShowTuitionApply = async (premiumCode) => {
        setSelectedPremiumCode(premiumCode);
        setApplyLoading(true);
        setShowTuitionApplyModal(true);
        try {
            const response = await axios.get(
                `https://tuition-seba-backend-1.onrender.com/api/tuitionApply/byPremiumCode`,
                {
                    params: { premiumCode },
                    headers: { Authorization: token }
                }
            );
            setTuitionApplyList(response.data);
        } catch (err) {
            console.error('Error fetching tuition applies:', err);
            toast.error("Failed to load tuition applications.");
            setTuitionApplyList([]);
        }
        setApplyLoading(false);
    };

    const handleCloseTuitionApplyModal = () => {
        setShowTuitionApplyModal(false);
        setTuitionApplyList([]);
        setSelectedPremiumCode('');
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
            acc[field.name] = field.type === 'checkbox' ? false : (field.type === 'star-rating' ? 0 : '');
            return acc;
        }, {});
    };

    const handleShare = (teacherDetails) => {
        const hasValue = (v) => v !== undefined && v !== null && String(v).trim() !== '';

        const lines = [
            `টিউশন সেবা ফোরাম (আস্থা ও বিশ্বস্ততায় একধাপ এগিয়ে)`,
            `যোগাযোগ: 01633920928`,
            `ওয়েবসাইট: www.tuitionsebaforum.com`,
            ``,
            `*Verified Premium Tutor*`,
            `Premium Code: *${teacherDetails.premiumCode || 'N/A'}*`,
            ``,
            `*Teacher CV*`,
            `Name: *${teacherDetails.name || 'N/A'}*`,
            `Area: *${teacherDetails.currentArea || 'N/A'}*`,
            ``,
            `*Academic Qualifications*`,

            ...(hasValue(teacherDetails.mastersUniversity) ? [`Masters University: *${teacherDetails.mastersUniversity}*`] : []),
            ...(hasValue(teacherDetails.mastersDept) ? [`Masters Department: *${teacherDetails.mastersDept}*`] : []),
            `Honours University: *${teacherDetails.honorsUniversity || 'N/A'}*`,
            `Academic Year: *${teacherDetails.academicYear || 'N/A'}*`,
            `Department: *${teacherDetails.honorsDept || 'N/A'}*`,
        ];

        if (hasValue(teacherDetails.college)) {
            lines.push(`College (HSC): *${teacherDetails.college}*`);
        }

        if (hasValue(teacherDetails.hscGroup) || hasValue(teacherDetails.hscResult)) {
            lines.push(
                `HSC - Group: *${teacherDetails.hscGroup || 'N/A'}*, Result: *${teacherDetails.hscResult || 'N/A'}*`
            );
        }

        if (hasValue(teacherDetails.school)) {
            lines.push(`School (SSC): *${teacherDetails.school}*`);
        }

        if (hasValue(teacherDetails.sscGroup) || hasValue(teacherDetails.sscResult)) {
            lines.push(
                `SSC - Group: *${teacherDetails.sscGroup || 'N/A'}*, Result: *${teacherDetails.sscResult || 'N/A'}*`
            );
        }

        lines.push(
            ``,
            `*Experience*: ${teacherDetails.experience || 'N/A'}`,
            `*Address*: ${teacherDetails.fullAddress || 'N/A'}`,
            `*Favorite Subject*: ${teacherDetails.favoriteSubject || 'N/A'}`
        );

        const message = lines.join('\n');
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const statusStyles = {
        "pending": { bg: "#FFD966", color: "#000" }, // yellow
        "under review": { bg: "#9DDCF9", color: "#000" }, // sky
        "pending payment": { bg: "#6FA8DC", color: "#fff" }, // blue
        "Must Advance": { bg: "#FF9900", color: "#fff" }, // orange
        "After Confirmation": { bg: "#009688", color: "#fff" }, // teal
        "After Salary": { bg: "#673AB7", color: "#fff" }, // deep purple
        "30% Advance": { bg: "#795548", color: "#fff" }, // brown
        "verified": { bg: "#4CAF50", color: "#fff" }, // green
        "rejected": { bg: "#F44336", color: "#fff" }, // red
        "suspended": { bg: "#424242", color: "#fff" }, // dark gray
    };

    const defaultStatusStyle = { bg: "#BDBDBD", color: "#000" };

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
                                <CreatableSelect
                                    isClearable
                                    value={
                                        searchInputs.currentArea
                                            ? { label: searchInputs.currentArea, value: searchInputs.currentArea }
                                            : null
                                    }
                                    onChange={(newValue) =>
                                        handleSearchInputChange('currentArea', newValue ? newValue.value : '')
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSearch();
                                    }}
                                    options={[
                                        ...areaOptions.chittagong.map((a) => ({ ...a, city: 'Chittagong' })),
                                        ...areaOptions.dhaka.map((a) => ({ ...a, city: 'Dhaka' }))
                                    ]
                                        .sort((a, b) => a.value.localeCompare(b.value))
                                        .map((opt) => ({ value: opt.value, label: `${opt.value} (${opt.city})` }))}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                    }}
                                />
                            ) : type === 'select' ? (
                                <Form.Select
                                    value={searchInputs[key]}
                                    onChange={(e) => handleSearchInputChange(key, e.target.value)}
                                    onKeyPress={handleKeyPress}
                                >
                                    <option value="">All</option>
                                    {options.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
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
                                                    <td>
                                                        <span
                                                            className="text-primary fw-bold"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleShowTuitionApply(item.premiumCode)}
                                                        >
                                                            {item.premiumCode}
                                                        </span>
                                                    </td>
                                                    <td>{item.uniCode}</td>

                                                    <td>
                                                        <span
                                                            style={{
                                                                backgroundColor: statusStyles[item.status]?.bg || defaultStatusStyle.bg,
                                                                color: statusStyles[item.status]?.color || defaultStatusStyle.color,
                                                                padding: "3px 10px",
                                                                borderRadius: "5px",
                                                                fontWeight: "600",
                                                                fontSize: "12px",
                                                                textTransform: "capitalize",
                                                                display: "inline-block"
                                                            }}
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
                                            let displayValue;
                                            if (type === 'password') {
                                                displayValue = '••••••';
                                            } else if (type === 'checkbox') {
                                                displayValue = value ? 'Yes' : 'No';
                                            } else if (type === 'star-rating') {
                                                displayValue = (
                                                    <div className="d-flex align-items-center">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <span
                                                                key={star}
                                                                style={{
                                                                    color: value >= star ? '#ffc107' : '#ddd',
                                                                    fontSize: '16px'
                                                                }}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                        <span className="ms-2">{value || '0'} star{value !== 1 ? 's' : ''}</span>
                                                    </div>
                                                );
                                            } else {
                                                displayValue = value !== undefined && value !== null && value !== '' ? String(value).trim() : 'N/A';
                                            }

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
                                                            {displayValue}
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
                                                    {field.type !== 'checkbox' && <Form.Label className="fw-bold">{field.label}</Form.Label>}

                                                    {/* Division Dropdown */}
                                                    {field.name === "division" ? (
                                                        <Select
                                                            options={locationsBd.map(d => ({ value: d.Division, label: d.Division }))}
                                                            value={selectedDivision ? { value: selectedDivision, label: selectedDivision } : null}
                                                            onChange={(selected) => {
                                                                const div = selected?.value || "";
                                                                setSelectedDivision(div);
                                                                setFormData({ ...formData, division: div, district: "", thana: "" });

                                                                const distList = locationsBd.find(d => d.Division === div)?.Districts || [];
                                                                setDistrictList(distList.map(d => ({ value: d.District, label: d.District, thanas: d.Thanas })));
                                                                setThanaList([]);
                                                                setSelectedDistrict('');
                                                            }}
                                                            placeholder="Select Division"
                                                            isClearable
                                                        />
                                                    ) : field.name === "district" ? (
                                                        <Select
                                                            options={districtList}
                                                            value={selectedDistrict ? { value: selectedDistrict, label: selectedDistrict } : null}
                                                            onChange={(selected) => {
                                                                const dist = selected?.value || "";
                                                                setSelectedDistrict(dist);
                                                                setFormData({ ...formData, district: dist, thana: "" });

                                                                const thanas = districtList.find(d => d.value === dist)?.thanas || [];
                                                                setThanaList(thanas.map(t => ({ value: t, label: t })));
                                                            }}
                                                            placeholder="Select District"
                                                            isClearable
                                                            isDisabled={!selectedDivision}
                                                        />
                                                    ) : field.name === "thana" ? (
                                                        <Select
                                                            options={thanaList}
                                                            value={thanaList.find(t => t.value === formData.thana) || null}
                                                            onChange={(selected) =>
                                                                setFormData({ ...formData, thana: selected?.value || "" })
                                                            }
                                                            placeholder="Select Thana"
                                                            isClearable
                                                            isDisabled={!selectedDistrict}
                                                        />
                                                    ) : field.name === "city" ? (
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
                                                        />
                                                    ) : field.type === "checkbox" ? (
                                                        <div className="d-flex align-items-center" style={{ paddingTop: '6px' }}>
                                                            <Form.Check
                                                                type="switch"
                                                                id={field.name}
                                                                checked={!!formData[field.name]}
                                                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                                                                label={
                                                                    <>
                                                                        <span className="fw-bold">{field.label}</span>
                                                                        <small className="ms-2 text-muted">{formData[field.name] ? 'Yes' : 'No'}</small>
                                                                    </>
                                                                }
                                                            />
                                                        </div>
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
                                                    ) : field.type === "star-rating" ? (
                                                        <div className="star-rating">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <span
                                                                    key={star}
                                                                    onClick={() => setFormData({ ...formData, [field.name]: star })}
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        color: formData[field.name] >= star ? '#ffc107' : '#ddd',
                                                                        fontSize: '24px',
                                                                        marginRight: '4px'
                                                                    }}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                            <span style={{ marginLeft: '8px', fontSize: '14px', color: '#666' }}>
                                                                {formData[field.name] || '0'} star{formData[field.name] !== 1 ? 's' : ''}
                                                            </span>
                                                        </div>
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

                {/* Tuition Apply List Modal */}
                <Modal
                    show={showTuitionApplyModal}
                    onHide={handleCloseTuitionApplyModal}
                    size="xl"
                    centered
                    scrollable
                >
                    <Modal.Header closeButton className="border-bottom-0">
                        <Modal.Title className="fw-bold fs-4">
                            Tuition Applications
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="px-4 py-3" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                        {applyLoading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2">Loading applications...</p>
                            </div>
                        ) : tuitionApplyList.length > 0 ? (
                            <>
                                {/* Summary Section */}
                                <div className="mb-4 p-3 bg-light rounded shadow-sm">
                                    <div className="row text-center g-2">
                                        <div className="col-md-3 col-6 mb-2">
                                            <div className="bg-white p-2 rounded border h-100">
                                                <small className="text-primary mb-1 d-block">Premium Code</small>
                                                <div className="fw-bold">{selectedPremiumCode}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 mb-2">
                                            <div className="bg-white p-2 rounded border h-100">
                                                <small className="text-primary mb-1 d-block">Teacher Name</small>
                                                <div className="fw-bold">{tuitionApplyList[0]?.name || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 mb-2">
                                            <div className="bg-white p-2 rounded border h-100">
                                                <small className="text-primary mb-1 d-block">Total</small>
                                                <div className="fw-bold text-success">{tuitionApplyList.length}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 mb-2">
                                            <div className="bg-white p-2 rounded border h-100">
                                                <small className="text-primary mb-1 d-block">Status Summary</small>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <span className="badge bg-warning text-dark">
                                                        Selected: {tuitionApplyList.filter(a => a.status === 'selected').length}
                                                    </span>
                                                    <span className="badge bg-info text-white">
                                                        Shortlisted: {tuitionApplyList.filter(a => a.status === 'shortlisted').length}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Table striped bordered hover responsive className="text-center">
                                    <thead className="table-primary">
                                        <tr>
                                            <th>SL</th>
                                            <th>Premium Code</th>
                                            <th>Tuition Code</th>
                                            <th>Teacher Name</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                            <th>Applied At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tuitionApplyList.map((apply, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{apply.premiumCode}</td>
                                                <td>{apply.tuitionCode}</td>
                                                <td>{apply.name}</td>
                                                <td>{apply.phone}</td>
                                                <td>
                                                    <span
                                                        style={apply.status === 'pending' ? {
                                                            backgroundColor: '#FFD966',
                                                            color: '#000',
                                                            padding: '3px 10px',
                                                            borderRadius: '5px',
                                                            fontWeight: '600',
                                                            fontSize: '12px',
                                                            textTransform: 'capitalize',
                                                            display: 'inline-block'
                                                        } : {
                                                            backgroundColor: '#4CAF50',
                                                            color: '#fff',
                                                            padding: '3px 10px',
                                                            borderRadius: '5px',
                                                            fontWeight: '600',
                                                            fontSize: '12px',
                                                            textTransform: 'capitalize',
                                                            display: 'inline-block'
                                                        }}
                                                    >
                                                        {apply.status}
                                                    </span>
                                                </td>
                                                <td>{formatDate(apply.appliedAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </>
                        ) : (
                            <div className="text-center py-5">
                                <p className="text-muted fst-italic">No tuition applications found for this premium code.</p>
                            </div>
                        )}
                    </Modal.Body>

                    <Modal.Footer className="border-top-0">
                        <Button variant="secondary" onClick={handleCloseTuitionApplyModal}>
                            Close
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
