import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card, Nav, Tab, Badge, Pagination } from 'react-bootstrap';
import { FaEdit, FaInfoCircle, FaTrashAlt, FaWhatsapp, FaChevronLeft, FaChevronRight, FaSearch, FaTimes, FaGlobe, FaGooglePlay, FaUserPlus, FaCamera, FaTrash, FaUserCircle, FaExternalLinkAlt, FaCheckCircle, FaIdCard, FaImages, FaFileAlt, FaGraduationCap, FaExpandAlt, FaShieldAlt, FaPhoneAlt, FaTimesCircle, FaAward } from 'react-icons/fa'; // React Icons
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import locationsBd from '../data/DivisonWiseLocation.json';
import CreatableSelect from 'react-select/creatable';
import { compressImageUnderMaxKB } from '../utilities/imageCompressor';

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
    const [activeModalTab, setActiveModalTab] = useState('applications');
    const [proposalsList, setProposalsList] = useState([]);
    const [proposalsLoading, setProposalsLoading] = useState(false);
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
    const [showSmsModal, setShowSmsModal] = useState(false);
    const [smsMessage, setSmsMessage] = useState('');
    const [smsRecipient, setSmsRecipient] = useState('');
    const [saving, setSaving] = useState(false);

    // Profile Photo State
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoSizeKB, setPhotoSizeKB] = useState(null);
    const [pendingPhotoFile, setPendingPhotoFile] = useState(null);
    const [pendingPhotoPreview, setPendingPhotoPreview] = useState(null);

    // NID Front State
    const [uploadingNidFront, setUploadingNidFront] = useState(false);
    const [nidFrontSizeKB, setNidFrontSizeKB] = useState(null);
    const [pendingNidFrontFile, setPendingNidFrontFile] = useState(null);
    const [pendingNidFrontPreview, setPendingNidFrontPreview] = useState(null);

    // NID Back State
    const [uploadingNidBack, setUploadingNidBack] = useState(false);
    const [nidBackSizeKB, setNidBackSizeKB] = useState(null);
    const [pendingNidBackFile, setPendingNidBackFile] = useState(null);
    const [pendingNidBackPreview, setPendingNidBackPreview] = useState(null);

    // SSC Marksheet State
    const [uploadingSsc, setUploadingSsc] = useState(false);
    const [sscSizeKB, setSscSizeKB] = useState(null);
    const [pendingSscFile, setPendingSscFile] = useState(null);
    const [pendingSscPreview, setPendingSscPreview] = useState(null);

    // HSC Marksheet State
    const [uploadingHsc, setUploadingHsc] = useState(false);
    const [hscSizeKB, setHscSizeKB] = useState(null);
    const [pendingHscFile, setPendingHscFile] = useState(null);
    const [pendingHscPreview, setPendingHscPreview] = useState(null);

    // University ID / Slip State
    const [uploadingUniId, setUploadingUniId] = useState(false);
    const [uniIdSizeKB, setUniIdSizeKB] = useState(null);
    const [pendingUniIdFile, setPendingUniIdFile] = useState(null);
    const [pendingUniIdPreview, setPendingUniIdPreview] = useState(null);

    // Other Certificate 1 State
    const [uploadingOther1, setUploadingOther1] = useState(false);
    const [other1SizeKB, setOther1SizeKB] = useState(null);
    const [pendingOther1File, setPendingOther1File] = useState(null);
    const [pendingOther1Preview, setPendingOther1Preview] = useState(null);

    // Other Certificate 2 State
    const [uploadingOther2, setUploadingOther2] = useState(false);
    const [other2SizeKB, setOther2SizeKB] = useState(null);
    const [pendingOther2File, setPendingOther2File] = useState(null);
    const [pendingOther2Preview, setPendingOther2Preview] = useState(null);

    // Other Certificate 3 State
    const [uploadingOther3, setUploadingOther3] = useState(false);
    const [other3SizeKB, setOther3SizeKB] = useState(null);
    const [pendingOther3File, setPendingOther3File] = useState(null);
    const [pendingOther3Preview, setPendingOther3Preview] = useState(null);

    // Fullscreen Image Lightbox State
    const [enlargedImage, setEnlargedImage] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && enlargedImage) {
                setEnlargedImage(null);
            }
        };
        if (enlargedImage) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [enlargedImage]);

    const resetMediaPendingStates = () => {
        setPendingPhotoFile(null);
        setPendingPhotoPreview(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setPendingNidFrontFile(null);
        setPendingNidFrontPreview(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setPendingNidBackFile(null);
        setPendingNidBackPreview(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setPendingSscFile(null);
        setPendingSscPreview(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setPendingHscFile(null);
        setPendingHscPreview(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setPendingUniIdFile(null);
        setPendingUniIdPreview(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setPendingOther1File(null);
        setPendingOther1Preview(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setPendingOther2File(null);
        setPendingOther2Preview(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setPendingOther3File(null);
        setPendingOther3Preview(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setPhotoSizeKB(null);
        setNidFrontSizeKB(null);
        setNidBackSizeKB(null);
        setSscSizeKB(null);
        setHscSizeKB(null);
        setUniIdSizeKB(null);
        setOther1SizeKB(null);
        setOther2SizeKB(null);
        setOther3SizeKB(null);
    };

    const handleCloseModal = () => {
        resetMediaPendingStates();
        setShowModal(false);
    };

    const bannedStyle = { backgroundColor: '#000000', color: '#ffffff' };
    const spamStyle = { backgroundColor: '#dc3545', color: 'white' };
    const bestStyle = { backgroundColor: '#007bff', color: 'white' };
    const manualExpressStyle = { backgroundColor: '#28a745', color: 'white' };
    const dueStyle = { backgroundColor: '#FFFF00', color: 'black' };

    const getRowStyle = (tuition) => {
        if (tuition.isBanned) return bannedStyle;
        if (tuition.isSpam) return spamStyle;
        if (tuition.hasDue) return dueStyle;
        if (tuition.isBest) return bestStyle;
        if (tuition.isExpress) return manualExpressStyle;
        return {};
    };

    // Status History Modal State
    const [showStatusHistoryModal, setShowStatusHistoryModal] = useState(false);
    const [statusHistoryList, setStatusHistoryList] = useState([]);
    const [statusHistoryLoading, setStatusHistoryLoading] = useState(false);
    const [statusHistoryTarget, setStatusHistoryTarget] = useState({ name: '', module: '' });

    const handleShowStatusHistory = async (moduleName, id, label) => {
        setStatusHistoryTarget({ name: label, module: moduleName });
        setShowStatusHistoryModal(true);
        setStatusHistoryLoading(true);
        try {
            const response = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/statusHistory/history/${moduleName}/${id}`, {
                headers: { Authorization: token }
            });
            setStatusHistoryList(response.data);
        } catch (err) {
            console.error('Error fetching status history:', err);
        } finally {
            setStatusHistoryLoading(false);
        }
    };

    // Info Verified Modal State
    const [showInfoVerifiedModal, setShowInfoVerifiedModal] = useState(false);
    const [targetInfoTeacher, setTargetInfoTeacher] = useState(null);
    const [infoVerifiedToggle, setInfoVerifiedToggle] = useState(false);
    const [infoVerifiedUpdating, setInfoVerifiedUpdating] = useState(false);

    const handleOpenInfoVerifiedModal = (teacher) => {
        setTargetInfoTeacher(teacher);
        setInfoVerifiedToggle(Boolean(teacher.isInfoVerified));
        setShowInfoVerifiedModal(true);
    };

    const handleSaveInfoVerified = async () => {
        if (!targetInfoTeacher) return;
        const currentStatus = Boolean(targetInfoTeacher.isInfoVerified);
        if (infoVerifiedToggle === currentStatus) {
            toast.info("Nothing to update");
            return;
        }

        const confirmMsg = infoVerifiedToggle
            ? `Are you sure you want to mark "${targetInfoTeacher.name}" (${targetInfoTeacher.premiumCode || 'No Code'}) as Info Verified?`
            : `Are you sure you want to mark "${targetInfoTeacher.name}" (${targetInfoTeacher.premiumCode || 'No Code'}) as NOT Info Verified?`;

        if (!window.confirm(confirmMsg)) {
            return;
        }

        setInfoVerifiedUpdating(true);
        try {
            const username = localStorage.getItem('username');
            await axios.put(
                `https://tuition-seba-backend-1.onrender.com/api/regTeacher/edit/${targetInfoTeacher._id}`,
                {
                    isInfoVerified: infoVerifiedToggle,
                    updatedBy: username
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            toast.success("Info verification status updated successfully!");
            setShowInfoVerifiedModal(false);
            fetchTableData();
            fetchSummary();
        } catch (err) {
            console.error("Error updating info verified status:", err);
            toast.error(err.response?.data?.message || err.message || "Failed to update info verification status.");
        } finally {
            setInfoVerifiedUpdating(false);
        }
    };

    const [searchInputs, setSearchInputs] = useState({
        premiumCode: '',
        name: '',
        phone: '',
        department: '',
        currentArea: '',
        status: '',
        gender: '',
        uniCode: '',
        referStatus: '',
        referPersonPhone: '',
        isInfoVerified: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        premiumCode: '',
        name: '',
        phone: '',
        department: '',
        currentArea: '',
        status: '',
        gender: '',
        uniCode: '',
        referStatus: '',
        referPersonPhone: '',
        isInfoVerified: ''
    });

    const searchFields = [
        { key: 'premiumCode', label: 'Premium Code', type: 'text', col: 2 },
        { key: 'name', label: 'Name', type: 'text', col: 2 },
        { key: 'phone', label: 'Phone / WP / Alt', type: 'text', col: 2 },
        { key: 'department', label: 'Department', type: 'text', col: 2 },
        { key: 'uniCode', label: 'UniCode', type: 'select', options: ['CMC', 'CUET', 'CU Science', 'CU Arts', 'CU Commerce', 'CVASU', 'Private Science', 'Private Commerce', 'Private Arts', 'National Science', 'National Arts', 'National Commerce', 'Arabic', 'NC English', 'BC English', 'Special'], col: 2 },
        { key: 'currentArea', label: 'Area', type: 'text', col: 2 },
        { key: 'status', label: 'Status', type: 'select', options: ['pending', 'under review', 'pending payment', 'Must Advance', 'After Confirmation', 'After Salary', '30% Advance', 'rejected', 'Free - Must Advance', 'verified', 'suspended', 'Not interested'], col: 2 },
        { key: 'gender', label: 'Gender', type: 'select', options: ['male', 'female'], col: 2 },
        { key: 'referStatus', label: 'Refer Status', type: 'select', options: ['pending', 'in review', 'canceled', 'spam', 'paid'], col: 2 },
        { key: 'referPersonPhone', label: 'Referred Phone', type: 'text', col: 2 },
        { key: 'isInfoVerified', label: 'Info Verified', type: 'select', options: ['true', 'false'], col: 2 }
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
        { name: 'status', label: 'Subscription Status', type: 'select', col: 6, options: ['pending', 'under review', 'pending payment', 'Must Advance', 'After Confirmation', 'After Salary', '30% Advance', 'rejected', 'Free - Must Advance', 'verified', 'suspended', 'Not interested'], group: 'Subscription & Payment Details' },
        { name: 'uniCode', label: 'Uni Code', type: 'select', col: 6, options: ['CMC', 'CUET', 'CU Science', 'CU Arts', 'CU Commerce', 'CVASU', 'Private Science', 'Private Commerce', 'Private Arts', 'National Science', 'National Arts', 'National Commerce', 'Arabic', 'NC English', 'BC English', 'Special'], group: 'Subscription & Payment Details' },
        { name: 'transactionId', label: 'Transaction ID', col: 6, group: 'Subscription & Payment Details' },
        { name: 'paymentType', label: 'Payment Method', col: 6, group: 'Subscription & Payment Details' },
        { name: 'amount', label: 'Amount Paid', col: 6, group: 'Subscription & Payment Details' },
        { name: 'paymentDate', label: 'Payment Date', type: 'date', col: 6, group: 'Subscription & Payment Details' },
        { name: 'isBiodataShow', label: 'Show Biodata?', col: 6, group: 'Subscription & Payment Details', type: 'checkbox' },
        { name: 'isInfoVerified', label: 'Info Verified?', col: 6, group: 'Subscription & Payment Details', type: 'checkbox' },

        // Notes & Feedback
        { name: 'comment', label: 'Comment from agent', col: 6, group: 'Notes & Feedback' },
        { name: 'rating', label: 'Rating', col: 6, group: 'Notes & Feedback', type: 'star-rating' },

        // Referral Info
        { name: 'referPersonPhone', label: 'Refer Person Phone', col: 6, group: 'Referral Info' },
        { name: 'referStatus', label: 'Refer Status', type: 'select', col: 6, options: ['pending', 'in review', 'canceled', 'spam', 'paid'], group: 'Referral Info' },
        { name: 'referComment', label: 'Refer Comment', col: 6, group: 'Referral Info' },
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

    const initialData = {
        ...fieldConfig.reduce((acc, field) => {
            acc[field.name] = field.type === 'checkbox' ? false : (field.type === 'star-rating' ? 0 : '');
            return acc;
        }, {}),
        photo: '',
        nidPhoto: '',
        nidFront: '',
        nidBack: '',
        sscMarksheet: '',
        hscMarksheet: '',
        universityIdCard: '',
        otherDoc1: '',
        otherDoc2: '',
        otherDoc3: ''
    };
    const [formData, setFormData] = useState(initialData);

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
            uniCode: '',
            referStatus: '',
            referPersonPhone: '',
            isInfoVerified: ''
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
        setProposalsLoading(true);
        setShowTuitionApplyModal(true);
        setActiveModalTab('applications');
        
        // Fetch Applications
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
        } finally {
            setApplyLoading(false);
        }

        // Fetch Proposals
        try {
            const response = await axios.get(
                `https://tuition-seba-backend-1.onrender.com/api/sms/logs`,
                {
                    params: { premiumCode, limit: 100, category: 'Proposal' },
                    headers: { Authorization: token }
                }
            );
            if (response.data?.success) {
                setProposalsList(response.data.logs || []);
            }
        } catch (err) {
            console.error('Error fetching SMS proposals:', err);
            setProposalsList([]);
        } finally {
            setProposalsLoading(false);
        }
    };

    const handleCloseTuitionApplyModal = () => {
        setShowTuitionApplyModal(false);
        setTuitionApplyList([]);
        setProposalsList([]);
        setSelectedPremiumCode('');
    };

    const handleExportToExcel = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/regTeacher/summary`, {
                params: { ...appliedFilters, allData: true },
                headers: { Authorization: token }
            });
            const teachersToExport = res.data.allData || [];

            const headers = fieldConfig.map(f => f.label);

            const data = teachersToExport.map(item =>
                fieldConfig.map(f => String(item[f.name] ?? ""))
            );

            const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

            worksheet['!cols'] = fieldConfig.map(() => ({ wpx: 120 }));

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Premium Teachers");
            XLSX.writeFile(workbook, `Premium Teachers_${formatDateTimeForFilename()}.xlsx`);
        } catch (err) {
            console.error('Error exporting to Excel:', err);
            toast.error("Failed to export records.");
        }
        setLoading(false);
    };

    const formatDateTimeForFilename = (date = new Date()) => {
        const datePart = date.toLocaleDateString().replace(/\//g, '-');
        const timePart = date.toLocaleTimeString().replace(/:/g, '-');
        return `${datePart}_${timePart}`;
    };

    const uploadMediaWithFallback = async (file, endpointPath) => {
        const PRIMARY_URL = `https://tuition-seba-backend-1.onrender.com/api/upload/${endpointPath}`;
        const FALLBACK_URL = `https://tuition-seba-backend-production-ac2d.up.railway.app/api/upload/${endpointPath}`;

        const uploadData = new FormData();
        uploadData.append('photo', file);

        let resultData = null;

        // Try Primary (Render)
        try {
            const response = await fetch(PRIMARY_URL, {
                method: 'POST',
                headers: { Authorization: token },
                body: uploadData
            });

            if (response.ok) {
                resultData = await response.json();
            } else if ([502, 503, 504].includes(response.status)) {
                throw new Error(`Primary server returned status ${response.status}`);
            } else {
                const errJson = await response.json().catch(() => ({}));
                throw new Error(errJson.message || `Upload failed with status ${response.status}`);
            }
        } catch (primaryErr) {
            console.warn(`Primary Render upload failed for ${endpointPath}, switching to Railway fallback...`, primaryErr);

            // Try Fallback (Railway)
            const fallbackData = new FormData();
            fallbackData.append('photo', file);

            const fallbackResponse = await fetch(FALLBACK_URL, {
                method: 'POST',
                headers: { Authorization: token },
                body: fallbackData
            });

            if (!fallbackResponse.ok) {
                const errJson = await fallbackResponse.json().catch(() => ({}));
                throw new Error(errJson.message || `Fallback upload failed with status ${fallbackResponse.status}`);
            }

            resultData = await fallbackResponse.json();
        }

        if (resultData && resultData.url) {
            return resultData;
        }
        throw new Error('No URL returned from upload server');
    };

    const handleSaveRecord = async () => {
        const amount = formData.amount;
        const paymentDate = formData.paymentDate;

        const hasAmount = amount !== undefined && amount !== null && String(amount).trim() !== '';
        const hasPaymentDate = paymentDate !== undefined && paymentDate !== null && String(paymentDate).trim() !== '';

        if (hasAmount && !hasPaymentDate) {
            toast.warning("পেমেন্ট অ্যামাউন্ট দেওয়া হয়েছে, দয়া করে পেমেন্টের তারিখটি সিলেক্ট করুন।");
            return;
        }

        if (hasPaymentDate && !hasAmount) {
            toast.warning("পেমেন্টের তারিখ দেওয়া হয়েছে, দয়া করে পেমেন্ট অ্যামাউন্টটি লিখুন।");
            return;
        }

        if (hasAmount) {
            const amountStr = String(amount).trim();
            const amountRegex = /^\d+(\.\d+)?$/;
            if (!amountRegex.test(amountStr)) {
                toast.warning("Amount paid - only numbers allowed.");
                return;
            }
        }

        const updatingData = {
            ...formData,
            status: formData.status ? formData.status : "pending"
        };
        const username = localStorage.getItem('username');

        // Trigger SMS verification modal if status is verified/Must Advance/After Confirmation/After Salary/30% Advance/Free - Must Advance, we are editing, and SMS wasn't already sent
        const smsTriggerStatuses = ['verified', 'Must Advance', 'After Confirmation', 'After Salary', '30% Advance', 'Free - Must Advance'];
        if (smsTriggerStatuses.includes(updatingData.status) && editingId && !formData.isSmsSent) {
            const premCode = formData.premiumCode || '';
            const recipient = formData.phone || '';
            const msg = `Dear teacher, your profile has been verified. Code: ${premCode} (keep it secret). You can now apply for tuitions. -Tuition Seba Forum`;
            setSmsRecipient(recipient);
            setSmsMessage(msg);
            setShowSmsModal(true);
            return;
        }

        try {
            setSaving(true);

            // Upload pending photo on Save
            if (pendingPhotoFile) {
                setUploadingPhoto(true);
                const photoRes = await uploadMediaWithFallback(pendingPhotoFile, 'teacher-photo');
                updatingData.photo = photoRes.url;
            }

            // Upload pending NID Front on Save
            if (pendingNidFrontFile) {
                setUploadingNidFront(true);
                const nidFrontRes = await uploadMediaWithFallback(pendingNidFrontFile, 'teacher-nid');
                updatingData.nidPhoto = nidFrontRes.url;
                updatingData.nidFront = nidFrontRes.url;
            } else if (updatingData.nidFront || updatingData.nidPhoto) {
                const existingNid = updatingData.nidFront || updatingData.nidPhoto;
                updatingData.nidPhoto = existingNid;
                updatingData.nidFront = existingNid;
            }

            // Upload pending NID Back on Save
            if (pendingNidBackFile) {
                setUploadingNidBack(true);
                const nidBackRes = await uploadMediaWithFallback(pendingNidBackFile, 'teacher-nid-back');
                updatingData.nidBack = nidBackRes.url;
            }

            // Upload pending SSC Marksheet on Save
            if (pendingSscFile) {
                setUploadingSsc(true);
                const sscRes = await uploadMediaWithFallback(pendingSscFile, 'teacher-ssc');
                updatingData.sscMarksheet = sscRes.url;
            }

            // Upload pending HSC Marksheet on Save
            if (pendingHscFile) {
                setUploadingHsc(true);
                const hscRes = await uploadMediaWithFallback(pendingHscFile, 'teacher-hsc');
                updatingData.hscMarksheet = hscRes.url;
            }

            // Upload pending University ID on Save
            if (pendingUniIdFile) {
                setUploadingUniId(true);
                const uniIdRes = await uploadMediaWithFallback(pendingUniIdFile, 'teacher-uni-id');
                updatingData.universityIdCard = uniIdRes.url;
            }

            // Upload pending Other Doc 1 on Save
            if (pendingOther1File) {
                setUploadingOther1(true);
                const other1Res = await uploadMediaWithFallback(pendingOther1File, 'teacher-other-1');
                updatingData.otherDoc1 = other1Res.url;
            }

            // Upload pending Other Doc 2 on Save
            if (pendingOther2File) {
                setUploadingOther2(true);
                const other2Res = await uploadMediaWithFallback(pendingOther2File, 'teacher-other-2');
                updatingData.otherDoc2 = other2Res.url;
            }

            // Upload pending Other Doc 3 on Save
            if (pendingOther3File) {
                setUploadingOther3(true);
                const other3Res = await uploadMediaWithFallback(pendingOther3File, 'teacher-other-3');
                updatingData.otherDoc3 = other3Res.url;
            }

            if (editingId) {
                const updatedData = {
                    ...updatingData,
                    updatedBy: username
                };
                await axios.put(
                    `https://tuition-seba-backend-1.onrender.com/api/regTeacher/edit/${editingId}`,
                    updatedData,
                    {
                        headers: {
                            Authorization: token
                        }
                    }
                );
                toast.success("Teacher record updated successfully!");
            } else {
                const newData = {
                    ...updatingData,
                    createdBy: username
                };
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/regTeacher/add', newData);
                toast.success("Teacher record created successfully!");
            }
            resetMediaPendingStates();
            setShowModal(false);
            fetchTableData();
            fetchSummary();

        } catch (err) {
            console.error('Error saving Teacher record:', err);
            toast.error(err.message || "Error saving Teacher record.");
        } finally {
            setSaving(false);
            setUploadingPhoto(false);
            setUploadingNidFront(false);
            setUploadingNidBack(false);
            setUploadingSsc(false);
            setUploadingHsc(false);
            setUploadingUniId(false);
            setUploadingOther1(false);
            setUploadingOther2(false);
            setUploadingOther3(false);
        }
    };

    const handleSendVerificationSmsAndSave = async () => {
        const username = localStorage.getItem('username');
        const code = formData.premiumCode || '';

        if (code && !smsMessage.includes(code)) {
            toast.warning(`Validation failed: The premium code (${code}) must be present in the SMS message body.`);
            return;
        }

        try {
            setSaving(true);

            // 1. Update the teacher status to selected status and set isSmsSent to true
            const updatedData = {
                ...formData,
                status: formData.status || 'pending',
                isSmsSent: true,
                updatedBy: username
            };

            // Upload pending photo on Save
            if (pendingPhotoFile) {
                setUploadingPhoto(true);
                const photoRes = await uploadMediaWithFallback(pendingPhotoFile, 'teacher-photo');
                updatedData.photo = photoRes.url;
            }

            // Upload pending NID Front on Save
            if (pendingNidFrontFile) {
                setUploadingNidFront(true);
                const nidFrontRes = await uploadMediaWithFallback(pendingNidFrontFile, 'teacher-nid');
                updatedData.nidPhoto = nidFrontRes.url;
                updatedData.nidFront = nidFrontRes.url;
            } else if (updatedData.nidFront || updatedData.nidPhoto) {
                const existingNid = updatedData.nidFront || updatedData.nidPhoto;
                updatedData.nidPhoto = existingNid;
                updatedData.nidFront = existingNid;
            }

            // Upload pending NID Back on Save
            if (pendingNidBackFile) {
                setUploadingNidBack(true);
                const nidBackRes = await uploadMediaWithFallback(pendingNidBackFile, 'teacher-nid-back');
                updatedData.nidBack = nidBackRes.url;
            }

            // Upload pending SSC Marksheet on Save
            if (pendingSscFile) {
                setUploadingSsc(true);
                const sscRes = await uploadMediaWithFallback(pendingSscFile, 'teacher-ssc');
                updatedData.sscMarksheet = sscRes.url;
            }

            // Upload pending HSC Marksheet on Save
            if (pendingHscFile) {
                setUploadingHsc(true);
                const hscRes = await uploadMediaWithFallback(pendingHscFile, 'teacher-hsc');
                updatedData.hscMarksheet = hscRes.url;
            }

            // Upload pending University ID on Save
            if (pendingUniIdFile) {
                setUploadingUniId(true);
                const uniIdRes = await uploadMediaWithFallback(pendingUniIdFile, 'teacher-uni-id');
                updatedData.universityIdCard = uniIdRes.url;
            }

            // Upload pending Other Doc 1 on Save
            if (pendingOther1File) {
                setUploadingOther1(true);
                const other1Res = await uploadMediaWithFallback(pendingOther1File, 'teacher-other-1');
                updatedData.otherDoc1 = other1Res.url;
            }

            // Upload pending Other Doc 2 on Save
            if (pendingOther2File) {
                setUploadingOther2(true);
                const other2Res = await uploadMediaWithFallback(pendingOther2File, 'teacher-other-2');
                updatedData.otherDoc2 = other2Res.url;
            }

            // Upload pending Other Doc 3 on Save
            if (pendingOther3File) {
                setUploadingOther3(true);
                const other3Res = await uploadMediaWithFallback(pendingOther3File, 'teacher-other-3');
                updatedData.otherDoc3 = other3Res.url;
            }

            await axios.put(
                `https://tuition-seba-backend-1.onrender.com/api/regTeacher/edit/${editingId}`,
                updatedData,
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            // 2. Send verification SMS
            const smsRes = await axios.post(
                `https://tuition-seba-backend-1.onrender.com/api/sms/send-single`,
                {
                    phone: smsRecipient,
                    message: smsMessage,
                    premiumCode: formData.premiumCode,
                    category: 'Verification'
                },
                {
                    headers: {
                        Authorization: token,
                        'x-user-name': username
                    }
                }
            );

            if (smsRes.data && !smsRes.data.success) {
                console.error("Verification SMS sending failed:", smsRes.data);
                toast.warning(`Teacher updated, but SMS failed: ${smsRes.data.statusMessage || 'Unknown API status error'}`);
            } else {
                toast.success("Teacher record updated and Verification SMS sent successfully!");
            }
            resetMediaPendingStates();
            setShowSmsModal(false);
            setShowModal(false);
            fetchTableData();
            fetchSummary();
        } catch (err) {
            console.error('Error saving record or sending SMS:', err);
            if (err.response) {
                console.error('API Error Response Data:', err.response.data);
                console.error('API Error Response Status:', err.response.status);
            }
            toast.error(`Error: ${err.response?.data?.message || err.message || 'Unknown error occurred'}`);
        } finally {
            setSaving(false);
            setUploadingPhoto(false);
            setUploadingNidFront(false);
            setUploadingNidBack(false);
            setUploadingSsc(false);
            setUploadingHsc(false);
            setUploadingUniId(false);
            setUploadingOther1(false);
            setUploadingOther2(false);
            setUploadingOther3(false);
        }
    };

    const handleSaveWithoutSms = async () => {
        const username = localStorage.getItem('username');
        try {
            setSaving(true);
            // Update the teacher status to selected status and set isSmsSent to false
            const updatedData = {
                ...formData,
                status: formData.status || 'pending',
                isSmsSent: false,
                updatedBy: username
            };

            // Upload pending photo on Save
            if (pendingPhotoFile) {
                setUploadingPhoto(true);
                const photoRes = await uploadMediaWithFallback(pendingPhotoFile, 'teacher-photo');
                updatedData.photo = photoRes.url;
            }

            // Upload pending NID Front on Save
            if (pendingNidFrontFile) {
                setUploadingNidFront(true);
                const nidFrontRes = await uploadMediaWithFallback(pendingNidFrontFile, 'teacher-nid');
                updatedData.nidPhoto = nidFrontRes.url;
                updatedData.nidFront = nidFrontRes.url;
            } else if (updatedData.nidFront || updatedData.nidPhoto) {
                const existingNid = updatedData.nidFront || updatedData.nidPhoto;
                updatedData.nidPhoto = existingNid;
                updatedData.nidFront = existingNid;
            }

            // Upload pending NID Back on Save
            if (pendingNidBackFile) {
                setUploadingNidBack(true);
                const nidBackRes = await uploadMediaWithFallback(pendingNidBackFile, 'teacher-nid-back');
                updatedData.nidBack = nidBackRes.url;
            }

            // Upload pending SSC Marksheet on Save
            if (pendingSscFile) {
                setUploadingSsc(true);
                const sscRes = await uploadMediaWithFallback(pendingSscFile, 'teacher-ssc');
                updatedData.sscMarksheet = sscRes.url;
            }

            // Upload pending HSC Marksheet on Save
            if (pendingHscFile) {
                setUploadingHsc(true);
                const hscRes = await uploadMediaWithFallback(pendingHscFile, 'teacher-hsc');
                updatedData.hscMarksheet = hscRes.url;
            }

            // Upload pending University ID on Save
            if (pendingUniIdFile) {
                setUploadingUniId(true);
                const uniIdRes = await uploadMediaWithFallback(pendingUniIdFile, 'teacher-uni-id');
                updatedData.universityIdCard = uniIdRes.url;
            }

            // Upload pending Other Doc 1 on Save
            if (pendingOther1File) {
                setUploadingOther1(true);
                const other1Res = await uploadMediaWithFallback(pendingOther1File, 'teacher-other-1');
                updatedData.otherDoc1 = other1Res.url;
            }

            // Upload pending Other Doc 2 on Save
            if (pendingOther2File) {
                setUploadingOther2(true);
                const other2Res = await uploadMediaWithFallback(pendingOther2File, 'teacher-other-2');
                updatedData.otherDoc2 = other2Res.url;
            }

            // Upload pending Other Doc 3 on Save
            if (pendingOther3File) {
                setUploadingOther3(true);
                const other3Res = await uploadMediaWithFallback(pendingOther3File, 'teacher-other-3');
                updatedData.otherDoc3 = other3Res.url;
            }

            await axios.put(
                `https://tuition-seba-backend-1.onrender.com/api/regTeacher/edit/${editingId}`,
                updatedData,
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            toast.success("Teacher record updated successfully (SMS bypassed)!");
            resetMediaPendingStates();
            setShowSmsModal(false);
            setShowModal(false);
            fetchTableData();
            fetchSummary();
        } catch (err) {
            console.error('Error saving record:', err);
            toast.error("Error occurred while saving.");
        } finally {
            setSaving(false);
            setUploadingPhoto(false);
            setUploadingNidFront(false);
            setUploadingNidBack(false);
            setUploadingSsc(false);
            setUploadingHsc(false);
            setUploadingUniId(false);
            setUploadingOther1(false);
            setUploadingOther2(false);
            setUploadingOther3(false);
        }
    };

    const formatPhoneForWhatsApp = (rawPhone) => {
        if (!rawPhone) return '';
        const digits = String(rawPhone).replace(/\D/g, '');
        if (!digits) return '';

        if (digits.startsWith('880')) {
            return digits;
        }
        if (digits.startsWith('0')) {
            return '88' + digits;
        }
        if (digits.startsWith('88')) {
            return '880' + digits.slice(2);
        }
        if (digits.startsWith('1')) {
            return '880' + digits;
        }
        return digits;
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
        resetMediaPendingStates();
        const formattedTeacher = { ...teacher };
        if (formattedTeacher.paymentDate) {
            formattedTeacher.paymentDate = new Date(formattedTeacher.paymentDate).toISOString().split('T')[0];
        }
        setFormData(formattedTeacher);
        setAreaList(areaOptions[teacher.city] || []);
        setEditingId(teacher._id);
        setShowModal(true);
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Compress on client side to guaranteed < 100KB
            const { file: compressedFile, sizeKB } = await compressImageUnderMaxKB(file, 95);
            setPhotoSizeKB(sizeKB);

            if (pendingPhotoPreview) {
                URL.revokeObjectURL(pendingPhotoPreview);
            }
            const previewUrl = URL.createObjectURL(compressedFile);
            setPendingPhotoFile(compressedFile);
            setPendingPhotoPreview(previewUrl);

            toast.info(`Photo selected (${sizeKB} KB). Click "Save" below to upload and save.`);
        } catch (err) {
            console.error('Photo processing error:', err);
            toast.error(err.message || 'Failed to process photo');
        } finally {
            if (e.target) e.target.value = '';
        }
    };

    const handleRemovePhoto = () => {
        if (pendingPhotoPreview) {
            URL.revokeObjectURL(pendingPhotoPreview);
        }
        setPendingPhotoFile(null);
        setPendingPhotoPreview(null);
        setFormData(prev => ({ ...prev, photo: '' }));
        setPhotoSizeKB(null);
        toast.info('Photo removed from form. Click "Save" below to apply changes.');
    };

    const handleNidFrontUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const { file: compressedFile, sizeKB } = await compressImageUnderMaxKB(file, 95, 1200);
            setNidFrontSizeKB(sizeKB);

            if (pendingNidFrontPreview) {
                URL.revokeObjectURL(pendingNidFrontPreview);
            }
            const previewUrl = URL.createObjectURL(compressedFile);
            setPendingNidFrontFile(compressedFile);
            setPendingNidFrontPreview(previewUrl);

            toast.info(`NID (Front) selected (${sizeKB} KB). Click "Save" below to upload and save.`);
        } catch (err) {
            console.error('NID (Front) processing error:', err);
            toast.error(err.message || 'Failed to process NID (Front) document');
        } finally {
            if (e.target) e.target.value = '';
        }
    };

    const handleRemoveNidFront = () => {
        if (pendingNidFrontPreview) {
            URL.revokeObjectURL(pendingNidFrontPreview);
        }
        setPendingNidFrontFile(null);
        setPendingNidFrontPreview(null);
        setFormData(prev => ({ ...prev, nidFront: '' }));
        setNidFrontSizeKB(null);
        toast.info('NID (Front) document removed from form. Click "Save" below to apply changes.');
    };

    const handleNidBackUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const { file: compressedFile, sizeKB } = await compressImageUnderMaxKB(file, 95, 1200);
            setNidBackSizeKB(sizeKB);

            if (pendingNidBackPreview) {
                URL.revokeObjectURL(pendingNidBackPreview);
            }
            const previewUrl = URL.createObjectURL(compressedFile);
            setPendingNidBackFile(compressedFile);
            setPendingNidBackPreview(previewUrl);

            toast.info(`NID (Back) selected (${sizeKB} KB). Click "Save" below to upload and save.`);
        } catch (err) {
            console.error('NID (Back) processing error:', err);
            toast.error(err.message || 'Failed to process NID (Back) document');
        } finally {
            if (e.target) e.target.value = '';
        }
    };

    const handleRemoveNidBack = () => {
        if (pendingNidBackPreview) {
            URL.revokeObjectURL(pendingNidBackPreview);
        }
        setPendingNidBackFile(null);
        setPendingNidBackPreview(null);
        setFormData(prev => ({ ...prev, nidBack: '' }));
        setNidBackSizeKB(null);
        toast.info('NID (Back) document removed from form. Click "Save" below to apply changes.');
    };

    const handleSscUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const { file: compressedFile, sizeKB } = await compressImageUnderMaxKB(file, 95, 1200);
            setSscSizeKB(sizeKB);

            if (pendingSscPreview) {
                URL.revokeObjectURL(pendingSscPreview);
            }
            const previewUrl = URL.createObjectURL(compressedFile);
            setPendingSscFile(compressedFile);
            setPendingSscPreview(previewUrl);

            toast.info(`SSC Marksheet selected (${sizeKB} KB). Click "Save" below to upload and save.`);
        } catch (err) {
            console.error('SSC Marksheet processing error:', err);
            toast.error(err.message || 'Failed to process SSC Marksheet');
        } finally {
            if (e.target) e.target.value = '';
        }
    };

    const handleRemoveSsc = () => {
        if (pendingSscPreview) {
            URL.revokeObjectURL(pendingSscPreview);
        }
        setPendingSscFile(null);
        setPendingSscPreview(null);
        setFormData(prev => ({ ...prev, sscMarksheet: '' }));
        setSscSizeKB(null);
        toast.info('SSC Marksheet removed from form. Click "Save" below to apply changes.');
    };

    const handleHscUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const { file: compressedFile, sizeKB } = await compressImageUnderMaxKB(file, 95, 1200);
            setHscSizeKB(sizeKB);

            if (pendingHscPreview) {
                URL.revokeObjectURL(pendingHscPreview);
            }
            const previewUrl = URL.createObjectURL(compressedFile);
            setPendingHscFile(compressedFile);
            setPendingHscPreview(previewUrl);

            toast.info(`HSC Marksheet selected (${sizeKB} KB). Click "Save" below to upload and save.`);
        } catch (err) {
            console.error('HSC Marksheet processing error:', err);
            toast.error(err.message || 'Failed to process HSC Marksheet');
        } finally {
            if (e.target) e.target.value = '';
        }
    };

    const handleRemoveHsc = () => {
        if (pendingHscPreview) {
            URL.revokeObjectURL(pendingHscPreview);
        }
        setPendingHscFile(null);
        setPendingHscPreview(null);
        setFormData(prev => ({ ...prev, hscMarksheet: '' }));
        setHscSizeKB(null);
        toast.info('HSC Marksheet removed from form. Click "Save" below to apply changes.');
    };

    const handleUniIdUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const { file: compressedFile, sizeKB } = await compressImageUnderMaxKB(file, 95, 1200);
            setUniIdSizeKB(sizeKB);

            if (pendingUniIdPreview) {
                URL.revokeObjectURL(pendingUniIdPreview);
            }
            const previewUrl = URL.createObjectURL(compressedFile);
            setPendingUniIdFile(compressedFile);
            setPendingUniIdPreview(previewUrl);

            toast.info(`University ID / Admission Slip selected (${sizeKB} KB). Click "Save" below to upload and save.`);
        } catch (err) {
            console.error('University ID processing error:', err);
            toast.error(err.message || 'Failed to process University ID / Admission Slip');
        } finally {
            if (e.target) e.target.value = '';
        }
    };

    const handleRemoveUniId = () => {
        if (pendingUniIdPreview) {
            URL.revokeObjectURL(pendingUniIdPreview);
        }
        setPendingUniIdFile(null);
        setPendingUniIdPreview(null);
        setFormData(prev => ({ ...prev, universityIdCard: '' }));
        setUniIdSizeKB(null);
        toast.info('University ID / Admission Slip removed from form. Click "Save" below to apply changes.');
    };

    const handleOther1Upload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const { file: compressedFile, sizeKB } = await compressImageUnderMaxKB(file, 95, 1200);
            setOther1SizeKB(sizeKB);

            if (pendingOther1Preview) {
                URL.revokeObjectURL(pendingOther1Preview);
            }
            const previewUrl = URL.createObjectURL(compressedFile);
            setPendingOther1File(compressedFile);
            setPendingOther1Preview(previewUrl);

            toast.info(`Certificate 1 selected (${sizeKB} KB). Click "Save" below to upload and save.`);
        } catch (err) {
            console.error('Certificate 1 processing error:', err);
            toast.error(err.message || 'Failed to process Certificate 1');
        } finally {
            if (e.target) e.target.value = '';
        }
    };

    const handleRemoveOther1 = () => {
        if (pendingOther1Preview) {
            URL.revokeObjectURL(pendingOther1Preview);
        }
        setPendingOther1File(null);
        setPendingOther1Preview(null);
        setFormData(prev => ({ ...prev, otherDoc1: '' }));
        setOther1SizeKB(null);
        toast.info('Certificate 1 removed from form. Click "Save" below to apply changes.');
    };

    const handleOther2Upload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const { file: compressedFile, sizeKB } = await compressImageUnderMaxKB(file, 95, 1200);
            setOther2SizeKB(sizeKB);

            if (pendingOther2Preview) {
                URL.revokeObjectURL(pendingOther2Preview);
            }
            const previewUrl = URL.createObjectURL(compressedFile);
            setPendingOther2File(compressedFile);
            setPendingOther2Preview(previewUrl);

            toast.info(`Certificate 2 selected (${sizeKB} KB). Click "Save" below to upload and save.`);
        } catch (err) {
            console.error('Certificate 2 processing error:', err);
            toast.error(err.message || 'Failed to process Certificate 2');
        } finally {
            if (e.target) e.target.value = '';
        }
    };

    const handleRemoveOther2 = () => {
        if (pendingOther2Preview) {
            URL.revokeObjectURL(pendingOther2Preview);
        }
        setPendingOther2File(null);
        setPendingOther2Preview(null);
        setFormData(prev => ({ ...prev, otherDoc2: '' }));
        setOther2SizeKB(null);
        toast.info('Certificate 2 removed from form. Click "Save" below to apply changes.');
    };

    const handleOther3Upload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const { file: compressedFile, sizeKB } = await compressImageUnderMaxKB(file, 95, 1200);
            setOther3SizeKB(sizeKB);

            if (pendingOther3Preview) {
                URL.revokeObjectURL(pendingOther3Preview);
            }
            const previewUrl = URL.createObjectURL(compressedFile);
            setPendingOther3File(compressedFile);
            setPendingOther3Preview(previewUrl);

            toast.info(`Certificate 3 selected (${sizeKB} KB). Click "Save" below to upload and save.`);
        } catch (err) {
            console.error('Certificate 3 processing error:', err);
            toast.error(err.message || 'Failed to process Certificate 3');
        } finally {
            if (e.target) e.target.value = '';
        }
    };

    const handleRemoveOther3 = () => {
        if (pendingOther3Preview) {
            URL.revokeObjectURL(pendingOther3Preview);
        }
        setPendingOther3File(null);
        setPendingOther3Preview(null);
        setFormData(prev => ({ ...prev, otherDoc3: '' }));
        setOther3SizeKB(null);
        toast.info('Certificate 3 removed from form. Click "Save" below to apply changes.');
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
        const data = fieldConfig.reduce((acc, field) => {
            acc[field.name] = field.type === 'checkbox' ? false : (field.type === 'star-rating' ? 0 : '');
            return acc;
        }, {});
        data.photo = '';
        data.nidPhoto = '';
        data.nidFront = '';
        data.nidBack = '';
        data.sscMarksheet = '';
        data.hscMarksheet = '';
        data.universityIdCard = '';
        data.otherDoc1 = '';
        data.otherDoc2 = '';
        data.otherDoc3 = '';
        return data;
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
        "Free - Must Advance": { bg: "#35ebccff", color: "#000" }, // brown
        "verified": { bg: "#4CAF50", color: "#fff" }, // green
        "rejected": { bg: "#F44336", color: "#fff" }, // red
        "suspended": { bg: "#424242", color: "#fff" }, // dark gray
        "Not interested": { bg: "#6c757d", color: "#fff" }, // gray
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
                            resetMediaPendingStates();
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

                {/* Search bar inside Card */}
                <Card className="mt-2 mb-2 shadow-sm">
                    <Card.Body className="py-2 px-3">
                        <h6 className="text-primary fw-bold mb-2">Search & Filters</h6>
                        <Row className="g-2">
                            {searchFields.map(({ key, label, type, options, col }) => (
                                <Col md={col} key={key}>
                                    <Form.Label className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>{label}</Form.Label>

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
                                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                control: (base) => ({ ...base, minHeight: '31px', height: '31px' }),
                                                valueContainer: (base) => ({ ...base, height: '31px', padding: '0 6px', fontSize: '0.85rem' }),
                                                input: (base) => ({ ...base, margin: '0px' }),
                                                indicatorsContainer: (base) => ({ ...base, height: '31px' }),
                                                dropdownIndicator: (base) => ({ ...base, padding: '2px' }),
                                                clearIndicator: (base) => ({ ...base, padding: '2px' })
                                            }}
                                        />
                                    ) : type === 'select' ? (
                                        <Form.Select
                                            size="sm"
                                            style={{ fontSize: '0.85rem' }}
                                            value={searchInputs[key]}
                                            onChange={(e) => handleSearchInputChange(key, e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        >
                                            <option value="">All</option>
                                            {options.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt === 'true' ? 'Verified' : opt === 'false' ? 'Not Verified' : opt}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    ) : (
                                        <Form.Control
                                            size="sm"
                                            style={{ fontSize: '0.85rem' }}
                                            type="text"
                                            placeholder={`Search by ${label}`}
                                            value={searchInputs[key]}
                                            onChange={(e) => handleSearchInputChange(key, e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        />
                                    )}
                                </Col>
                            ))}

                            {/* Spacer to align buttons to the rightmost column of the 2nd row */}
                            <Col md={2}></Col>

                            <Col md={2} className="d-flex align-items-end">
                                <Row className="g-1 w-100">
                                    <Col xs={6}>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={handleSearch}
                                            className="d-flex align-items-center justify-content-center w-100"
                                            disabled={loading}
                                            style={{ height: '31px' }}
                                        >
                                            {loading ? <Spinner animation="border" size="sm" /> : <FaSearch />}
                                        </Button>
                                    </Col>
                                    <Col xs={6}>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={handleResetFilters}
                                            className="d-flex align-items-center justify-content-center w-100"
                                            style={{ height: '31px' }}
                                        >
                                            <FaTimes />
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>



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
                                        <th>Created/Updated By</th>
                                        <th>Premium Code</th>
                                        <th>Uni Code</th>
                                        <th>Status</th>
                                        <th>Info Verified</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Phone (WP)</th>
                                        <th>Hons. Dept.</th>
                                        <th>Hons. Uni..</th>
                                        <th>Academic Year</th>
                                        <th>Current Area</th>
                                        <th>Full Address</th>
                                        <th>Refer Phone</th>
                                        <th>Refer Status</th>
                                        <th>Refer Comment</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="18" className="text-center">
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
                                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                                            <span style={{ fontWeight: '700', fontSize: '1rem' }}>
                                                                {(currentPage - 1) * 50 + index + 1}
                                                            </span>
                                                            {item.referPersonPhone && item.referPersonPhone.trim() !== '' && (
                                                                <span
                                                                    title={`Referred by: ${item.referPersonPhone}`}
                                                                    style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '3px',
                                                                        backgroundColor: '#e8f5e9',
                                                                        color: '#2e7d32',
                                                                        padding: '2px 8px',
                                                                        borderRadius: '12px',
                                                                        fontSize: '0.65rem',
                                                                        fontWeight: 'bold',
                                                                        textTransform: 'uppercase',
                                                                        border: '1px solid #a5d6a7',
                                                                        boxShadow: '0 1px 3px rgba(46,125,50,0.15)'
                                                                    }}
                                                                >
                                                                    <FaUserPlus style={{ fontSize: '0.6rem' }} /> Refer
                                                                </span>
                                                            )}
                                                            {item.isSmsSent && (
                                                                <span
                                                                    title="Verification SMS Sent"
                                                                    style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        backgroundColor: '#e3f2fd',
                                                                        color: '#0d6efd',
                                                                        padding: '2px 8px',
                                                                        borderRadius: '12px',
                                                                        fontSize: '0.65rem',
                                                                        fontWeight: 'bold',
                                                                        textTransform: 'uppercase',
                                                                        border: '1px solid #90caf9',
                                                                        marginTop: '2px'
                                                                    }}
                                                                >
                                                                    SMS Sent
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-column gap-1 align-items-start">
                                                            <span className="badge bg-secondary">
                                                                CB: {item.createdBy || ''}
                                                            </span>
                                                            <span className="badge bg-info text-dark">
                                                                UB: {item.updatedBy || ''}
                                                            </span>
                                                        </div>
                                                    </td>
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
                                                            onClick={() => handleShowStatusHistory('RegTeacher', item._id, item.name)}
                                                            style={{
                                                                backgroundColor: statusStyles[item.status]?.bg || defaultStatusStyle.bg,
                                                                color: statusStyles[item.status]?.color || defaultStatusStyle.color,
                                                                padding: "3px 10px",
                                                                borderRadius: "5px",
                                                                fontWeight: "600",
                                                                fontSize: "12px",
                                                                textTransform: "capitalize",
                                                                display: "inline-block",
                                                                cursor: 'pointer'
                                                            }}
                                                            title="Click to view status history"
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </td>

                                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                        <div
                                                            onClick={() => handleOpenInfoVerifiedModal(item)}
                                                            style={{ cursor: 'pointer', display: 'inline-block' }}
                                                            title="Click to update Info Verified status"
                                                        >
                                                            {item.isInfoVerified ? (
                                                                <span
                                                                    style={{
                                                                        backgroundColor: '#e8f5e9',
                                                                        color: '#2e7d32',
                                                                        padding: '3px 8px',
                                                                        borderRadius: '5px',
                                                                        fontWeight: '600',
                                                                        fontSize: '12px',
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '4px',
                                                                        border: '1px solid #a5d6a7',
                                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                                    }}
                                                                >
                                                                    <FaCheckCircle style={{ fontSize: '0.7rem' }} /> Verified
                                                                </span>
                                                            ) : (
                                                                <span
                                                                    style={{
                                                                        backgroundColor: '#ffebee',
                                                                        color: '#c62828',
                                                                        padding: '3px 8px',
                                                                        borderRadius: '5px',
                                                                        fontWeight: '600',
                                                                        fontSize: '12px',
                                                                        display: 'inline-block',
                                                                        border: '1px solid #ffcdd2',
                                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                                    }}
                                                                >
                                                                    Not Verified
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td>{item.name}</td>
                                                    <td>{item.phone}</td>
                                                    <td>{item.whatsapp}</td>
                                                    <td>{item.honorsDept}</td>
                                                    <td>{item.honorsUniversity}</td>
                                                    <td>{item.academicYear}</td>
                                                    <td>{item.currentArea}</td>
                                                    <td>{item.fullAddress}</td>
                                                    <td>{item.referPersonPhone}</td>
                                                    <td>
                                                        {item.referStatus && (
                                                            <span
                                                                style={{
                                                                    backgroundColor:
                                                                        item.referStatus === 'paid' ? '#4CAF50' :
                                                                            item.referStatus === 'in review' ? '#2196F3' :
                                                                                item.referStatus === 'pending' ? '#FF9800' :
                                                                                    item.referStatus === 'canceled' ? '#F44336' :
                                                                                        item.referStatus === 'spam' ? '#9E9E9E' : '#BDBDBD',
                                                                    color: item.referStatus === 'pending' ? '#000' : '#fff',
                                                                    padding: '3px 10px',
                                                                    borderRadius: '5px',
                                                                    fontWeight: '600',
                                                                    fontSize: '12px',
                                                                    textTransform: 'capitalize',
                                                                    display: 'inline-block'
                                                                }}
                                                            >
                                                                {item.referStatus}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>{item.referComment}</td>
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
                        {!loading && totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-4">
                                <Pagination className="pagination-rounded-pill flex-wrap justify-content-center">
                                    <Pagination.Prev
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <FaChevronLeft className="me-1" /> Previous
                                    </Pagination.Prev>

                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 2 && page <= currentPage + 2)
                                        ) {
                                            return (
                                                <Pagination.Item
                                                    key={page}
                                                    active={page === currentPage}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </Pagination.Item>
                                            );
                                        } else if (page === currentPage - 3 || page === currentPage + 3) {
                                            return <Pagination.Ellipsis key={page} disabled />;
                                        }
                                        return null;
                                    })}

                                    <Pagination.Next
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next <FaChevronRight className="ms-1" />
                                    </Pagination.Next>
                                </Pagination>
                            </div>
                        )}
                    </Card.Body>
                </Card>

                <style>{`
                    .teacher-details-modal-full {
                        max-width: calc(100vw - 20px) !important;
                        width: calc(100vw - 20px) !important;
                        margin: 10px auto !important;
                        padding: 0 !important;
                    }
                    .teacher-details-modal-full .modal-content {
                        height: calc(100vh - 20px) !important;
                        max-height: calc(100vh - 20px) !important;
                        border-radius: 14px !important;
                        display: flex !important;
                        flex-direction: column !important;
                        overflow: hidden !important;
                    }
                    .teacher-details-modal-full .modal-body {
                        flex: 1 1 auto !important;
                        max-height: none !important;
                        overflow-y: auto !important;
                    }
                `}</style>

                <Modal
                    show={showDetailsModal}
                    onHide={() => setShowDetailsModal(false)}
                    dialogClassName="teacher-details-modal-full"
                    centered
                    scrollable
                >
                    <Modal.Header closeButton className="border-bottom-0 pb-2">
                        <Modal.Title className="fw-bold fs-4">Teacher Details</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="px-4 py-3">
                        {selectedTeacher && (
                            <Card className="mb-3 border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                {/* Top Header: Compact summary & actions */}
                                <div className="px-3 py-2 bg-light border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2">
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        <h5 className="fw-bold mb-0 text-dark">{selectedTeacher.name || 'Unnamed Teacher'}</h5>
                                        <span className="badge bg-primary px-2 py-1" style={{ fontSize: '0.78rem' }}>
                                            Code: {selectedTeacher.premiumCode || 'N/A'}
                                        </span>
                                        <span
                                            className="badge text-uppercase px-2 py-1"
                                            style={{
                                                fontSize: '0.75rem',
                                                backgroundColor: statusStyles[selectedTeacher.status]?.bg || '#6c757d',
                                                color: statusStyles[selectedTeacher.status]?.color || '#fff'
                                            }}
                                        >
                                            {selectedTeacher.status || 'Pending'}
                                        </span>
                                        {selectedTeacher.isInfoVerified && (
                                            <span
                                                className="badge bg-success px-2 py-1 d-inline-flex align-items-center gap-1"
                                                style={{ fontSize: '0.75rem' }}
                                            >
                                                <FaCheckCircle size={10} /> Info Verified
                                            </span>
                                        )}
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="d-flex align-items-center gap-1 py-1 px-2"
                                            style={{ fontSize: '0.8rem' }}
                                            onClick={() => {
                                                setShowDetailsModal(false);
                                                handleEditTeacher(selectedTeacher);
                                            }}
                                        >
                                            <FaEdit size={12} /> Edit Teacher
                                        </Button>
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            className="d-flex align-items-center gap-1 py-1 px-2"
                                            style={{ fontSize: '0.8rem' }}
                                            onClick={() => handleShare(selectedTeacher)}
                                        >
                                            <FaWhatsapp size={13} /> Share CV
                                        </Button>
                                    </div>
                                </div>

                                <Card.Body className="p-3">
                                    {/* Profile Photo + Teacher Details Row */}
                                    <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3 mb-3">
                                        {/* Profile Photo Thumbnail */}
                                        <div className="flex-shrink-0 text-center">
                                            <div
                                                className="position-relative shadow-sm rounded overflow-hidden"
                                                style={{
                                                    width: '105px',
                                                    height: '110px',
                                                    backgroundColor: '#f8fafc',
                                                    border: selectedTeacher.photo ? '2px solid #0d6efd' : '2px dashed #cbd5e1',
                                                    cursor: selectedTeacher.photo ? 'pointer' : 'default',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onClick={() => {
                                                    if (selectedTeacher.photo) {
                                                        setEnlargedImage({
                                                            url: selectedTeacher.photo,
                                                            title: `${selectedTeacher.name || 'Teacher'} - Profile Photo`
                                                        });
                                                    }
                                                }}
                                                title={selectedTeacher.photo ? 'Click to enlarge full-screen' : 'No photo uploaded'}
                                            >
                                                {selectedTeacher.photo ? (
                                                    <>
                                                        <img
                                                            src={selectedTeacher.photo}
                                                            alt={selectedTeacher.name || 'Profile'}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                        <div
                                                            className="position-absolute bottom-0 start-0 end-0 text-white text-center py-1"
                                                            style={{
                                                                background: 'rgba(0,0,0,0.65)',
                                                                fontSize: '0.68rem',
                                                                lineHeight: 1
                                                            }}
                                                        >
                                                            <FaExpandAlt className="me-1" size={9} /> Enlarge
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="d-flex flex-column align-items-center justify-content-center text-muted p-1">
                                                        <FaUserCircle style={{ fontSize: '2.5rem', color: '#94a3b8' }} />
                                                        <span style={{ fontSize: '0.68rem', color: '#64748b' }} className="fw-semibold mt-1">No Photo</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-1" style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '500' }}>
                                                Profile Photo
                                            </div>
                                        </div>

                                        {/* Teacher Core Attributes */}
                                        <div className="flex-grow-1 w-100">
                                            {/* Badges */}
                                            <div className="d-flex flex-wrap gap-1 mb-2">
                                                {selectedTeacher.gender && (
                                                    <span className="badge bg-light text-dark border text-capitalize px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                        {selectedTeacher.gender}
                                                    </span>
                                                )}
                                                {selectedTeacher.uniCode && (
                                                    <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                        Uni: {selectedTeacher.uniCode}
                                                    </span>
                                                )}
                                                {selectedTeacher.city && (
                                                    <span className="badge bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                        {selectedTeacher.city}
                                                    </span>
                                                )}
                                                {selectedTeacher.currentArea && (
                                                    <span className="badge bg-light text-secondary border px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                        {selectedTeacher.currentArea}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Contact & Info Grid */}
                                            <div className="row g-1 small text-secondary">
                                                {selectedTeacher.phone && (
                                                    <div className="col-12 col-md-6 d-flex align-items-center gap-2 py-1">
                                                        <span className="text-muted fw-semibold">Phone:</span>
                                                        <span className="fw-bold text-dark">{selectedTeacher.phone}</span>
                                                        {formatPhoneForWhatsApp(selectedTeacher.whatsapp || selectedTeacher.phone) && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-success py-0 px-2 d-inline-flex align-items-center gap-1"
                                                                style={{ fontSize: '0.72rem', height: '22px' }}
                                                                onClick={() => {
                                                                    const target = formatPhoneForWhatsApp(selectedTeacher.whatsapp || selectedTeacher.phone);
                                                                    window.open(`https://api.whatsapp.com/send?phone=${target}`, '_blank');
                                                                }}
                                                            >
                                                                <FaWhatsapp /> WhatsApp
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                {selectedTeacher.whatsapp && selectedTeacher.whatsapp !== selectedTeacher.phone && (
                                                    <div className="col-12 col-md-6 d-flex align-items-center gap-2 py-1">
                                                        <span className="text-muted fw-semibold">WhatsApp:</span>
                                                        <span className="fw-bold text-dark">{selectedTeacher.whatsapp}</span>
                                                        {formatPhoneForWhatsApp(selectedTeacher.whatsapp) && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-success py-0 px-2 d-inline-flex align-items-center gap-1"
                                                                style={{ fontSize: '0.72rem', height: '22px' }}
                                                                onClick={() => {
                                                                    const target = formatPhoneForWhatsApp(selectedTeacher.whatsapp);
                                                                    window.open(`https://api.whatsapp.com/send?phone=${target}`, '_blank');
                                                                }}
                                                            >
                                                                <FaWhatsapp /> Chat
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                {selectedTeacher.honorsUniversity && (
                                                    <div className="col-12 col-md-6 py-1">
                                                        <span className="text-muted fw-semibold">University:</span>{' '}
                                                        <span className="text-dark fw-medium">
                                                            {selectedTeacher.honorsUniversity} {selectedTeacher.honorsDept ? `(${selectedTeacher.honorsDept})` : ''}
                                                        </span>
                                                    </div>
                                                )}

                                                {selectedTeacher.academicYear && (
                                                    <div className="col-12 col-md-6 py-1">
                                                        <span className="text-muted fw-semibold">Academic Year:</span>{' '}
                                                        <span className="text-dark fw-medium">{selectedTeacher.academicYear}</span>
                                                    </div>
                                                )}

                                                {selectedTeacher.experience && (
                                                    <div className="col-12 col-md-6 py-1">
                                                        <span className="text-muted fw-semibold">Experience:</span>{' '}
                                                        <span className="text-dark fw-medium">{selectedTeacher.experience}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Documents Strip */}
                                    <div className="pt-2 border-top">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <span className="fw-semibold text-secondary d-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                                                <FaIdCard className="text-primary" /> Verification & Academic Documents
                                            </span>
                                            <span className="badge bg-light text-secondary border" style={{ fontSize: '0.72rem' }}>
                                                {[selectedTeacher.nidPhoto || selectedTeacher.nidFront, selectedTeacher.nidBack, selectedTeacher.sscMarksheet, selectedTeacher.hscMarksheet, selectedTeacher.universityIdCard, selectedTeacher.otherDoc1, selectedTeacher.otherDoc2, selectedTeacher.otherDoc3].filter(Boolean).length} of 8 Attached
                                            </span>
                                        </div>

                                        <Row className="g-2">
                                            {[
                                                { label: 'NID Front / Birth Reg', key: 'nidPhoto', fallbackKey: 'nidFront', icon: <FaIdCard style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                                { label: 'NID Back Part', key: 'nidBack', icon: <FaIdCard style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                                { label: 'SSC Marksheet', key: 'sscMarksheet', icon: <FaFileAlt style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                                { label: 'HSC Marksheet', key: 'hscMarksheet', icon: <FaFileAlt style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                                { label: 'University ID / Slip', key: 'universityIdCard', icon: <FaGraduationCap style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                                { label: 'Other Certificate 1', key: 'otherDoc1', icon: <FaAward style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                                { label: 'Other Certificate 2', key: 'otherDoc2', icon: <FaAward style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                                { label: 'Other Certificate 3', key: 'otherDoc3', icon: <FaAward style={{ fontSize: '1.4rem' }} className="text-secondary opacity-50" /> },
                                            ].map(doc => {
                                                const docUrl = selectedTeacher[doc.key] || (doc.fallbackKey ? selectedTeacher[doc.fallbackKey] : null);
                                                return (
                                                    <Col xs={6} sm={4} md={3} lg={3} key={doc.key}>
                                                        <div
                                                            className="h-100 p-2 rounded d-flex flex-column justify-content-between"
                                                            style={{
                                                                backgroundColor: docUrl ? '#ffffff' : '#f8fafc',
                                                                border: docUrl ? '1px solid #cbd5e1' : '1px dashed #e2e8f0',
                                                                transition: 'all 0.2s ease',
                                                                boxShadow: docUrl ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                                                            }}
                                                        >
                                                            {/* Document Preview Box */}
                                                            <div
                                                                className="w-100 rounded overflow-hidden position-relative d-flex align-items-center justify-content-center mb-1"
                                                                style={{
                                                                    height: '80px',
                                                                    backgroundColor: docUrl ? '#ffffff' : '#f1f5f9',
                                                                    cursor: docUrl ? 'pointer' : 'default',
                                                                    border: docUrl ? '1px solid #e2e8f0' : 'none'
                                                                }}
                                                                onClick={() => {
                                                                    if (docUrl) {
                                                                        setEnlargedImage({
                                                                            url: docUrl,
                                                                            title: `${selectedTeacher.name || 'Teacher'} - ${doc.label}`
                                                                        });
                                                                    }
                                                                }}
                                                                title={docUrl ? `Click to enlarge ${doc.label}` : `No ${doc.label} attached`}
                                                            >
                                                                {docUrl ? (
                                                                    <>
                                                                        <img
                                                                            src={docUrl}
                                                                            alt={doc.label}
                                                                            style={{
                                                                                maxWidth: '100%',
                                                                                maxHeight: '100%',
                                                                                objectFit: 'contain',
                                                                                display: 'block'
                                                                            }}
                                                                        />
                                                                        <div
                                                                            className="position-absolute bottom-0 start-0 end-0 text-white text-center py-1"
                                                                            style={{
                                                                                background: 'rgba(0,0,0,0.65)',
                                                                                fontSize: '0.65rem',
                                                                                lineHeight: 1
                                                                            }}
                                                                        >
                                                                            <FaExpandAlt className="me-1" size={8} /> Click to Enlarge
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="d-flex flex-column align-items-center justify-content-center text-muted p-1">
                                                                        {doc.icon}
                                                                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }} className="mt-1">Not Attached</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Label & Status Pill */}
                                                            <div className="text-center w-100">
                                                                <div
                                                                    className="fw-semibold text-dark text-truncate"
                                                                    style={{ fontSize: '0.72rem' }}
                                                                    title={doc.label}
                                                                >
                                                                    {doc.label}
                                                                </div>
                                                                <span
                                                                    className={`badge ${docUrl ? 'bg-success text-white' : 'bg-light text-muted border'} px-2 py-0 mt-1`}
                                                                    style={{ fontSize: '0.65rem' }}
                                                                >
                                                                    {docUrl ? 'Attached' : 'Empty'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}
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
                                            } else if (type === 'date' && value) {
                                                // Parse directly from ISO string — no Date() conversion, no timezone shift
                                                try {
                                                    const iso = String(value);
                                                    const [datePart, timePart] = iso.split('T');
                                                    const [year, month, day] = datePart.split('-');
                                                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                                    const dateStr = `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
                                                    if (timePart) {
                                                        const [hh, mm] = timePart.replace('Z', '').split(':');
                                                        const h = parseInt(hh);
                                                        const ampm = h >= 12 ? 'PM' : 'AM';
                                                        const h12 = h % 12 === 0 ? 12 : h % 12;
                                                        displayValue = `${dateStr}, ${h12}:${mm} ${ampm} (UTC)`;
                                                    } else {
                                                        displayValue = dateStr;
                                                    }
                                                } catch {
                                                    displayValue = String(value);
                                                }
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
                <Modal show={showModal} onHide={handleCloseModal} size="xl" centered scrollable>
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold text-primary">{editingId ? "Edit Teacher" : "Create Teacher"}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {/* Document Uploads Section - 3 Rows x 3 Columns (9 Total Documents) */}
                        <div className="mb-4">
                            <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                                <FaIdCard /> Teacher Photos & Documents (Auto-compressed &lt; 100 KB)
                            </h6>

                            {/* Row 1: Profile Photo, NID Front, NID Back */}
                            <Row className="g-3 mb-3">
                                {/* 1. Profile Photo */}
                                <Col xs={12} sm={6} md={4}>
                                    <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                {(pendingPhotoPreview || formData.photo) ? (
                                                    <img
                                                        src={pendingPhotoPreview || formData.photo}
                                                        alt="Teacher Profile"
                                                        style={{
                                                            width: '75px',
                                                            height: '80px',
                                                            borderRadius: '6px',
                                                            objectFit: 'cover',
                                                            backgroundColor: '#f1f3f5',
                                                            border: pendingPhotoFile ? '2px solid #ffc107' : '2px solid #0d6efd',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => setEnlargedImage({ url: pendingPhotoPreview || formData.photo, title: `${formData.name || 'Teacher'} - Profile Photo` })}
                                                        title="Click to view enlarged image"
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '75px',
                                                            height: '80px',
                                                            borderRadius: '6px',
                                                            backgroundColor: '#dee2e6',
                                                            color: '#6c757d',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1.5rem',
                                                            border: '2px dashed #adb5bd'
                                                        }}
                                                    >
                                                        <FaCamera />
                                                        <span style={{ fontSize: '0.55rem' }} className="mt-1">No Photo</span>
                                                    </div>
                                                )}
                                                {uploadingPhoto && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '6px',
                                                            backgroundColor: 'rgba(255,255,255,0.85)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Spinner animation="border" size="sm" variant="primary" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }} title="Profile Photo">Profile Photo</h6>
                                                <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                    Max 100 KB
                                                    {photoSizeKB && (
                                                        <span className={`ms-1 badge ${pendingPhotoFile ? 'bg-warning text-dark' : 'bg-success'}`} style={{ fontSize: '0.65rem' }}>
                                                            {pendingPhotoFile ? `${photoSizeKB} KB*` : `${photoSizeKB} KB`}
                                                        </span>
                                                    )}
                                                </small>

                                                <div className="d-flex flex-wrap gap-1 align-items-center">
                                                    <label className={`btn btn-sm btn-primary d-inline-flex align-items-center gap-1 mb-0 py-1 px-2 ${uploadingPhoto ? 'disabled' : ''}`} style={{ cursor: uploadingPhoto ? 'not-allowed' : 'pointer', fontSize: '0.72rem' }}>
                                                        <FaCamera size={10} />
                                                        {uploadingPhoto ? '...' : ((pendingPhotoPreview || formData.photo) ? 'Change' : 'Select')}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handlePhotoUpload}
                                                            style={{ display: 'none' }}
                                                            disabled={uploadingPhoto || saving}
                                                        />
                                                    </label>

                                                    {(pendingPhotoPreview || formData.photo) && (
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={handleRemovePhoto}
                                                            disabled={uploadingPhoto || saving}
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaTrash size={10} />
                                                        </Button>
                                                    )}

                                                    {formData.photo && !pendingPhotoPreview && (
                                                        <a
                                                            href={formData.photo}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaExternalLinkAlt size={9} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            {pendingPhotoFile ? (
                                                <small className="text-warning fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaInfoCircle size={10} /> Uploads on Save
                                                </small>
                                            ) : formData.photo ? (
                                                <small className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaCheckCircle size={10} /> Saved
                                                </small>
                                            ) : (
                                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>No photo</small>
                                            )}
                                        </div>
                                    </div>
                                </Col>

                                {/* 2. NID Front */}
                                <Col xs={12} sm={6} md={4}>
                                    <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                {(pendingNidFrontPreview || formData.nidPhoto || formData.nidFront) ? (
                                                    <img
                                                        src={pendingNidFrontPreview || formData.nidPhoto || formData.nidFront}
                                                        alt="NID Front"
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            objectFit: 'cover',
                                                            backgroundColor: '#f1f3f5',
                                                            border: pendingNidFrontFile ? '2px solid #ffc107' : '2px solid #198754',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => setEnlargedImage({ url: pendingNidFrontPreview || formData.nidPhoto || formData.nidFront, title: `${formData.name || 'Teacher'} - NID Front / Birth Certificate` })}
                                                        title="Click to view enlarged image"
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            backgroundColor: '#dee2e6',
                                                            color: '#6c757d',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1.4rem',
                                                            border: '2px dashed #adb5bd'
                                                        }}
                                                    >
                                                        <FaIdCard />
                                                        <span style={{ fontSize: '0.55rem' }}>No NID (F)</span>
                                                    </div>
                                                )}
                                                {uploadingNidFront && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '6px',
                                                            backgroundColor: 'rgba(255,255,255,0.85)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Spinner animation="border" size="sm" variant="success" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }} title="NID Front / Birth Certificate (Provide Birth Certificate if no NID)">NID Front / Birth Reg</h6>
                                                <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                    Max 100 KB
                                                    {nidFrontSizeKB && (
                                                        <span className={`ms-1 badge ${pendingNidFrontFile ? 'bg-warning text-dark' : 'bg-success'}`} style={{ fontSize: '0.65rem' }}>
                                                            {pendingNidFrontFile ? `${nidFrontSizeKB} KB*` : `${nidFrontSizeKB} KB`}
                                                        </span>
                                                    )}
                                                </small>

                                                <div className="d-flex flex-wrap gap-1 align-items-center">
                                                    <label className={`btn btn-sm btn-success d-inline-flex align-items-center gap-1 mb-0 py-1 px-2 ${uploadingNidFront ? 'disabled' : ''}`} style={{ cursor: uploadingNidFront ? 'not-allowed' : 'pointer', fontSize: '0.72rem' }} title="If teacher has no NID, upload Birth Certificate">
                                                        <FaIdCard size={10} />
                                                        {uploadingNidFront ? '...' : ((pendingNidFrontPreview || formData.nidPhoto || formData.nidFront) ? 'Change' : 'Select')}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleNidFrontUpload}
                                                            style={{ display: 'none' }}
                                                            disabled={uploadingNidFront || saving}
                                                        />
                                                    </label>

                                                    {(pendingNidFrontPreview || formData.nidPhoto || formData.nidFront) && (
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={handleRemoveNidFront}
                                                            disabled={uploadingNidFront || saving}
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaTrash size={10} />
                                                        </Button>
                                                    )}

                                                    {(formData.nidPhoto || formData.nidFront) && !pendingNidFrontPreview && (
                                                        <a
                                                            href={formData.nidPhoto || formData.nidFront}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaExternalLinkAlt size={9} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            {pendingNidFrontFile ? (
                                                <small className="text-warning fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaInfoCircle size={10} /> Uploads on Save
                                                </small>
                                            ) : (formData.nidPhoto || formData.nidFront) ? (
                                                <small className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaCheckCircle size={10} /> Saved
                                                </small>
                                            ) : (
                                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>No NID / Birth Cert</small>
                                            )}
                                        </div>
                                    </div>
                                </Col>

                                {/* 3. NID Back */}
                                <Col xs={12} sm={6} md={4}>
                                    <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                {(pendingNidBackPreview || formData.nidBack) ? (
                                                    <img
                                                        src={pendingNidBackPreview || formData.nidBack}
                                                        alt="NID Back"
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            objectFit: 'cover',
                                                            backgroundColor: '#f1f3f5',
                                                            border: pendingNidBackFile ? '2px solid #ffc107' : '2px solid #198754',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => setEnlargedImage({ url: pendingNidBackPreview || formData.nidBack, title: `${formData.name || 'Teacher'} - NID Back` })}
                                                        title="Click to view enlarged image"
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            backgroundColor: '#dee2e6',
                                                            color: '#6c757d',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1.4rem',
                                                            border: '2px dashed #adb5bd'
                                                        }}
                                                    >
                                                        <FaIdCard />
                                                        <span style={{ fontSize: '0.55rem' }}>No NID (B)</span>
                                                    </div>
                                                )}
                                                {uploadingNidBack && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '6px',
                                                            backgroundColor: 'rgba(255,255,255,0.85)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Spinner animation="border" size="sm" variant="success" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }} title="NID Back Part">NID Back Part</h6>
                                                <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                    Max 100 KB
                                                    {nidBackSizeKB && (
                                                        <span className={`ms-1 badge ${pendingNidBackFile ? 'bg-warning text-dark' : 'bg-success'}`} style={{ fontSize: '0.65rem' }}>
                                                            {pendingNidBackFile ? `${nidBackSizeKB} KB*` : `${nidBackSizeKB} KB`}
                                                        </span>
                                                    )}
                                                </small>

                                                <div className="d-flex flex-wrap gap-1 align-items-center">
                                                    <label className={`btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1 mb-0 py-1 px-2 ${uploadingNidBack ? 'disabled' : ''}`} style={{ cursor: uploadingNidBack ? 'not-allowed' : 'pointer', fontSize: '0.72rem' }}>
                                                        <FaIdCard size={10} />
                                                        {uploadingNidBack ? '...' : ((pendingNidBackPreview || formData.nidBack) ? 'Change' : 'Select')}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleNidBackUpload}
                                                            style={{ display: 'none' }}
                                                            disabled={uploadingNidBack || saving}
                                                        />
                                                    </label>

                                                    {(pendingNidBackPreview || formData.nidBack) && (
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={handleRemoveNidBack}
                                                            disabled={uploadingNidBack || saving}
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaTrash size={10} />
                                                        </Button>
                                                    )}

                                                    {formData.nidBack && !pendingNidBackPreview && (
                                                        <a
                                                            href={formData.nidBack}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaExternalLinkAlt size={9} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            {pendingNidBackFile ? (
                                                <small className="text-warning fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaInfoCircle size={10} /> Uploads on Save
                                                </small>
                                            ) : formData.nidBack ? (
                                                <small className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaCheckCircle size={10} /> Saved
                                                </small>
                                            ) : (
                                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>No document</small>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {/* Row 2: SSC Marksheet, HSC Marksheet, University ID / Admission Slip */}
                            <Row className="g-3 mb-3">
                                {/* 4. SSC Marksheet */}
                                <Col xs={12} sm={6} md={4}>
                                    <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                {(pendingSscPreview || formData.sscMarksheet) ? (
                                                    <img
                                                        src={pendingSscPreview || formData.sscMarksheet}
                                                        alt="SSC Marksheet"
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            objectFit: 'cover',
                                                            backgroundColor: '#f1f3f5',
                                                            border: pendingSscFile ? '2px solid #ffc107' : '2px solid #0d6efd',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => setEnlargedImage({ url: pendingSscPreview || formData.sscMarksheet, title: `${formData.name || 'Teacher'} - SSC Marksheet` })}
                                                        title="Click to view enlarged image"
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            backgroundColor: '#dee2e6',
                                                            color: '#6c757d',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1.4rem',
                                                            border: '2px dashed #adb5bd'
                                                        }}
                                                    >
                                                        <FaFileAlt />
                                                        <span style={{ fontSize: '0.55rem' }}>No SSC</span>
                                                    </div>
                                                )}
                                                {uploadingSsc && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '6px',
                                                            backgroundColor: 'rgba(255,255,255,0.85)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Spinner animation="border" size="sm" variant="primary" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }} title="SSC Marksheet">SSC Marksheet</h6>
                                                <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                    Max 100 KB
                                                    {sscSizeKB && (
                                                        <span className={`ms-1 badge ${pendingSscFile ? 'bg-warning text-dark' : 'bg-success'}`} style={{ fontSize: '0.65rem' }}>
                                                            {pendingSscFile ? `${sscSizeKB} KB*` : `${sscSizeKB} KB`}
                                                        </span>
                                                    )}
                                                </small>

                                                <div className="d-flex flex-wrap gap-1 align-items-center">
                                                    <label className={`btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 mb-0 py-1 px-2 ${uploadingSsc ? 'disabled' : ''}`} style={{ cursor: uploadingSsc ? 'not-allowed' : 'pointer', fontSize: '0.72rem' }}>
                                                        <FaFileAlt size={10} />
                                                        {uploadingSsc ? '...' : ((pendingSscPreview || formData.sscMarksheet) ? 'Change' : 'Select')}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleSscUpload}
                                                            style={{ display: 'none' }}
                                                            disabled={uploadingSsc || saving}
                                                        />
                                                    </label>

                                                    {(pendingSscPreview || formData.sscMarksheet) && (
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={handleRemoveSsc}
                                                            disabled={uploadingSsc || saving}
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaTrash size={10} />
                                                        </Button>
                                                    )}

                                                    {formData.sscMarksheet && !pendingSscPreview && (
                                                        <a
                                                            href={formData.sscMarksheet}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaExternalLinkAlt size={9} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            {pendingSscFile ? (
                                                <small className="text-warning fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaInfoCircle size={10} /> Uploads on Save
                                                </small>
                                            ) : formData.sscMarksheet ? (
                                                <small className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaCheckCircle size={10} /> Saved
                                                </small>
                                            ) : (
                                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>No document</small>
                                            )}
                                        </div>
                                    </div>
                                </Col>

                                {/* 5. HSC Marksheet */}
                                <Col xs={12} sm={6} md={4}>
                                    <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                {(pendingHscPreview || formData.hscMarksheet) ? (
                                                    <img
                                                        src={pendingHscPreview || formData.hscMarksheet}
                                                        alt="HSC Marksheet"
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            objectFit: 'cover',
                                                            backgroundColor: '#f1f3f5',
                                                            border: pendingHscFile ? '2px solid #ffc107' : '2px solid #0d6efd',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => setEnlargedImage({ url: pendingHscPreview || formData.hscMarksheet, title: `${formData.name || 'Teacher'} - HSC Marksheet` })}
                                                        title="Click to view enlarged image"
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            backgroundColor: '#dee2e6',
                                                            color: '#6c757d',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1.4rem',
                                                            border: '2px dashed #adb5bd'
                                                        }}
                                                    >
                                                        <FaFileAlt />
                                                        <span style={{ fontSize: '0.55rem' }}>No HSC</span>
                                                    </div>
                                                )}
                                                {uploadingHsc && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '6px',
                                                            backgroundColor: 'rgba(255,255,255,0.85)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Spinner animation="border" size="sm" variant="primary" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }} title="HSC Marksheet">HSC Marksheet</h6>
                                                <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                    Max 100 KB
                                                    {hscSizeKB && (
                                                        <span className={`ms-1 badge ${pendingHscFile ? 'bg-warning text-dark' : 'bg-success'}`} style={{ fontSize: '0.65rem' }}>
                                                            {pendingHscFile ? `${hscSizeKB} KB*` : `${hscSizeKB} KB`}
                                                        </span>
                                                    )}
                                                </small>

                                                <div className="d-flex flex-wrap gap-1 align-items-center">
                                                    <label className={`btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 mb-0 py-1 px-2 ${uploadingHsc ? 'disabled' : ''}`} style={{ cursor: uploadingHsc ? 'not-allowed' : 'pointer', fontSize: '0.72rem' }}>
                                                        <FaFileAlt size={10} />
                                                        {uploadingHsc ? '...' : ((pendingHscPreview || formData.hscMarksheet) ? 'Change' : 'Select')}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleHscUpload}
                                                            style={{ display: 'none' }}
                                                            disabled={uploadingHsc || saving}
                                                        />
                                                    </label>

                                                    {(pendingHscPreview || formData.hscMarksheet) && (
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={handleRemoveHsc}
                                                            disabled={uploadingHsc || saving}
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaTrash size={10} />
                                                        </Button>
                                                    )}

                                                    {formData.hscMarksheet && !pendingHscPreview && (
                                                        <a
                                                            href={formData.hscMarksheet}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaExternalLinkAlt size={9} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            {pendingHscFile ? (
                                                <small className="text-warning fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaInfoCircle size={10} /> Uploads on Save
                                                </small>
                                            ) : formData.hscMarksheet ? (
                                                <small className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaCheckCircle size={10} /> Saved
                                                </small>
                                            ) : (
                                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>No document</small>
                                            )}
                                        </div>
                                    </div>
                                </Col>

                                {/* 6. University ID / Admission Slip */}
                                <Col xs={12} sm={6} md={4}>
                                    <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                {(pendingUniIdPreview || formData.universityIdCard) ? (
                                                    <img
                                                        src={pendingUniIdPreview || formData.universityIdCard}
                                                        alt="University ID / Slip"
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            objectFit: 'cover',
                                                            backgroundColor: '#f1f3f5',
                                                            border: pendingUniIdFile ? '2px solid #ffc107' : '2px solid #0d6efd',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => setEnlargedImage({ url: pendingUniIdPreview || formData.universityIdCard, title: `${formData.name || 'Teacher'} - University ID` })}
                                                        title="Click to view enlarged image"
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            backgroundColor: '#dee2e6',
                                                            color: '#6c757d',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1.4rem',
                                                            border: '2px dashed #adb5bd'
                                                        }}
                                                    >
                                                        <FaGraduationCap />
                                                        <span style={{ fontSize: '0.55rem' }}>No Uni ID</span>
                                                    </div>
                                                )}
                                                {uploadingUniId && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '6px',
                                                            backgroundColor: 'rgba(255,255,255,0.85)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Spinner animation="border" size="sm" variant="primary" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }} title="University ID / Slip">Uni ID / Slip</h6>
                                                <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                    Max 100 KB
                                                    {uniIdSizeKB && (
                                                        <span className={`ms-1 badge ${pendingUniIdFile ? 'bg-warning text-dark' : 'bg-success'}`} style={{ fontSize: '0.65rem' }}>
                                                            {pendingUniIdFile ? `${uniIdSizeKB} KB*` : `${uniIdSizeKB} KB`}
                                                        </span>
                                                    )}
                                                </small>

                                                <div className="d-flex flex-wrap gap-1 align-items-center">
                                                    <label className={`btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 mb-0 py-1 px-2 ${uploadingUniId ? 'disabled' : ''}`} style={{ cursor: uploadingUniId ? 'not-allowed' : 'pointer', fontSize: '0.72rem' }}>
                                                        <FaGraduationCap size={10} />
                                                        {uploadingUniId ? '...' : ((pendingUniIdPreview || formData.universityIdCard) ? 'Change' : 'Select')}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleUniIdUpload}
                                                            style={{ display: 'none' }}
                                                            disabled={uploadingUniId || saving}
                                                        />
                                                    </label>

                                                    {(pendingUniIdPreview || formData.universityIdCard) && (
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={handleRemoveUniId}
                                                            disabled={uploadingUniId || saving}
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaTrash size={10} />
                                                        </Button>
                                                    )}

                                                    {formData.universityIdCard && !pendingUniIdPreview && (
                                                        <a
                                                            href={formData.universityIdCard}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaExternalLinkAlt size={9} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            {pendingUniIdFile ? (
                                                <small className="text-warning fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaInfoCircle size={10} /> Uploads on Save
                                                </small>
                                            ) : formData.universityIdCard ? (
                                                <small className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaCheckCircle size={10} /> Saved
                                                </small>
                                            ) : (
                                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>No document</small>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {/* Row 3: Other Certificate 1, Other Certificate 2, Other Certificate 3 */}
                            <Row className="g-3">
                                {/* 7. Other Certificate 1 */}
                                <Col xs={12} sm={6} md={4}>
                                    <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                {(pendingOther1Preview || formData.otherDoc1) ? (
                                                    <img
                                                        src={pendingOther1Preview || formData.otherDoc1}
                                                        alt="Certificate 1"
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            objectFit: 'cover',
                                                            backgroundColor: '#f1f3f5',
                                                            border: pendingOther1File ? '2px solid #ffc107' : '2px solid #0d6efd',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => setEnlargedImage({ url: pendingOther1Preview || formData.otherDoc1, title: `${formData.name || 'Teacher'} - Certificate 1` })}
                                                        title="Click to view enlarged image"
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            backgroundColor: '#dee2e6',
                                                            color: '#6c757d',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1.4rem',
                                                            border: '2px dashed #adb5bd'
                                                        }}
                                                    >
                                                        <FaAward />
                                                        <span style={{ fontSize: '0.55rem' }}>No Cert 1</span>
                                                    </div>
                                                )}
                                                {uploadingOther1 && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '6px',
                                                            backgroundColor: 'rgba(255,255,255,0.85)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Spinner animation="border" size="sm" variant="primary" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }} title="Other Certificate 1">Other Certificate 1</h6>
                                                <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                    Max 100 KB
                                                    {other1SizeKB && (
                                                        <span className={`ms-1 badge ${pendingOther1File ? 'bg-warning text-dark' : 'bg-success'}`} style={{ fontSize: '0.65rem' }}>
                                                            {pendingOther1File ? `${other1SizeKB} KB*` : `${other1SizeKB} KB`}
                                                        </span>
                                                    )}
                                                </small>

                                                <div className="d-flex flex-wrap gap-1 align-items-center">
                                                    <label className={`btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 mb-0 py-1 px-2 ${uploadingOther1 ? 'disabled' : ''}`} style={{ cursor: uploadingOther1 ? 'not-allowed' : 'pointer', fontSize: '0.72rem' }}>
                                                        <FaAward size={10} />
                                                        {uploadingOther1 ? '...' : ((pendingOther1Preview || formData.otherDoc1) ? 'Change' : 'Select')}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleOther1Upload}
                                                            style={{ display: 'none' }}
                                                            disabled={uploadingOther1 || saving}
                                                        />
                                                    </label>

                                                    {(pendingOther1Preview || formData.otherDoc1) && (
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={handleRemoveOther1}
                                                            disabled={uploadingOther1 || saving}
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaTrash size={10} />
                                                        </Button>
                                                    )}

                                                    {formData.otherDoc1 && !pendingOther1Preview && (
                                                        <a
                                                            href={formData.otherDoc1}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaExternalLinkAlt size={9} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            {pendingOther1File ? (
                                                <small className="text-warning fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaInfoCircle size={10} /> Uploads on Save
                                                </small>
                                            ) : formData.otherDoc1 ? (
                                                <small className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaCheckCircle size={10} /> Saved
                                                </small>
                                            ) : (
                                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>No document</small>
                                            )}
                                        </div>
                                    </div>
                                </Col>

                                {/* 8. Other Certificate 2 */}
                                <Col xs={12} sm={6} md={4}>
                                    <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                {(pendingOther2Preview || formData.otherDoc2) ? (
                                                    <img
                                                        src={pendingOther2Preview || formData.otherDoc2}
                                                        alt="Certificate 2"
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            objectFit: 'cover',
                                                            backgroundColor: '#f1f3f5',
                                                            border: pendingOther2File ? '2px solid #ffc107' : '2px solid #0d6efd',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => setEnlargedImage({ url: pendingOther2Preview || formData.otherDoc2, title: `${formData.name || 'Teacher'} - Certificate 2` })}
                                                        title="Click to view enlarged image"
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            backgroundColor: '#dee2e6',
                                                            color: '#6c757d',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1.4rem',
                                                            border: '2px dashed #adb5bd'
                                                        }}
                                                    >
                                                        <FaAward />
                                                        <span style={{ fontSize: '0.55rem' }}>No Cert 2</span>
                                                    </div>
                                                )}
                                                {uploadingOther2 && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '6px',
                                                            backgroundColor: 'rgba(255,255,255,0.85)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Spinner animation="border" size="sm" variant="primary" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }} title="Other Certificate 2">Other Certificate 2</h6>
                                                <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                    Max 100 KB
                                                    {other2SizeKB && (
                                                        <span className={`ms-1 badge ${pendingOther2File ? 'bg-warning text-dark' : 'bg-success'}`} style={{ fontSize: '0.65rem' }}>
                                                            {pendingOther2File ? `${other2SizeKB} KB*` : `${other2SizeKB} KB`}
                                                        </span>
                                                    )}
                                                </small>

                                                <div className="d-flex flex-wrap gap-1 align-items-center">
                                                    <label className={`btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 mb-0 py-1 px-2 ${uploadingOther2 ? 'disabled' : ''}`} style={{ cursor: uploadingOther2 ? 'not-allowed' : 'pointer', fontSize: '0.72rem' }}>
                                                        <FaAward size={10} />
                                                        {uploadingOther2 ? '...' : ((pendingOther2Preview || formData.otherDoc2) ? 'Change' : 'Select')}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleOther2Upload}
                                                            style={{ display: 'none' }}
                                                            disabled={uploadingOther2 || saving}
                                                        />
                                                    </label>

                                                    {(pendingOther2Preview || formData.otherDoc2) && (
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={handleRemoveOther2}
                                                            disabled={uploadingOther2 || saving}
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaTrash size={10} />
                                                        </Button>
                                                    )}

                                                    {formData.otherDoc2 && !pendingOther2Preview && (
                                                        <a
                                                            href={formData.otherDoc2}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaExternalLinkAlt size={9} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            {pendingOther2File ? (
                                                <small className="text-warning fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaInfoCircle size={10} /> Uploads on Save
                                                </small>
                                            ) : formData.otherDoc2 ? (
                                                <small className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaCheckCircle size={10} /> Saved
                                                </small>
                                            ) : (
                                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>No document</small>
                                            )}
                                        </div>
                                    </div>
                                </Col>

                                {/* 9. Other Certificate 3 */}
                                <Col xs={12} sm={6} md={4}>
                                    <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                {(pendingOther3Preview || formData.otherDoc3) ? (
                                                    <img
                                                        src={pendingOther3Preview || formData.otherDoc3}
                                                        alt="Certificate 3"
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            objectFit: 'cover',
                                                            backgroundColor: '#f1f3f5',
                                                            border: pendingOther3File ? '2px solid #ffc107' : '2px solid #0d6efd',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => setEnlargedImage({ url: pendingOther3Preview || formData.otherDoc3, title: `${formData.name || 'Teacher'} - Certificate 3` })}
                                                        title="Click to view enlarged image"
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '80px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            backgroundColor: '#dee2e6',
                                                            color: '#6c757d',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1.4rem',
                                                            border: '2px dashed #adb5bd'
                                                        }}
                                                    >
                                                        <FaAward />
                                                        <span style={{ fontSize: '0.55rem' }}>No Cert 3</span>
                                                    </div>
                                                )}
                                                {uploadingOther3 && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '6px',
                                                            backgroundColor: 'rgba(255,255,255,0.85)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Spinner animation="border" size="sm" variant="primary" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }} title="Other Certificate 3">Other Certificate 3</h6>
                                                <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                    Max 100 KB
                                                    {other3SizeKB && (
                                                        <span className={`ms-1 badge ${pendingOther3File ? 'bg-warning text-dark' : 'bg-success'}`} style={{ fontSize: '0.65rem' }}>
                                                            {pendingOther3File ? `${other3SizeKB} KB*` : `${other3SizeKB} KB`}
                                                        </span>
                                                    )}
                                                </small>

                                                <div className="d-flex flex-wrap gap-1 align-items-center">
                                                    <label className={`btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 mb-0 py-1 px-2 ${uploadingOther3 ? 'disabled' : ''}`} style={{ cursor: uploadingOther3 ? 'not-allowed' : 'pointer', fontSize: '0.72rem' }}>
                                                        <FaAward size={10} />
                                                        {uploadingOther3 ? '...' : ((pendingOther3Preview || formData.otherDoc3) ? 'Change' : 'Select')}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleOther3Upload}
                                                            style={{ display: 'none' }}
                                                            disabled={uploadingOther3 || saving}
                                                        />
                                                    </label>

                                                    {(pendingOther3Preview || formData.otherDoc3) && (
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={handleRemoveOther3}
                                                            disabled={uploadingOther3 || saving}
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaTrash size={10} />
                                                        </Button>
                                                    )}

                                                    {formData.otherDoc3 && !pendingOther3Preview && (
                                                        <a
                                                            href={formData.otherDoc3}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{ fontSize: '0.72rem' }}
                                                            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        >
                                                            <FaExternalLinkAlt size={9} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            {pendingOther3File ? (
                                                <small className="text-warning fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaInfoCircle size={10} /> Uploads on Save
                                                </small>
                                            ) : formData.otherDoc3 ? (
                                                <small className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                    <FaCheckCircle size={10} /> Saved
                                                </small>
                                            ) : (
                                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>No document</small>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

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
                        <Button variant="secondary" onClick={handleCloseModal} disabled={saving}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveRecord} disabled={saving}>
                            {saving ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    {uploadingPhoto || uploadingNidFront || uploadingNidBack || uploadingSsc || uploadingHsc || uploadingUniId || uploadingOther1 || uploadingOther2 || uploadingOther3 ? 'Uploading images...' : 'Saving...'}
                                </>
                            ) : (
                                editingId ? 'Update Teacher' : 'Save Teacher'
                            )}
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
                            Teacher Activities - Code: {selectedPremiumCode}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="px-4 py-3" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                        <Tab.Container activeKey={activeModalTab} onSelect={k => setActiveModalTab(k)}>
                            <Nav variant="tabs" className="mb-3">
                                <Nav.Item>
                                    <Nav.Link eventKey="applications" className="fw-bold">
                                        Applications ({tuitionApplyList.length})
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="proposals" className="fw-bold">
                                        Proposals/SMS ({proposalsList.length})
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>

                            <Tab.Content>
                                <Tab.Pane eventKey="applications">
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
                                                    <div className="col-md-4 col-6 mb-2">
                                                        <div className="bg-white p-2 rounded border h-100">
                                                            <small className="text-primary mb-1 d-block">Teacher Name</small>
                                                            <div className="fw-bold">{tuitionApplyList[0]?.name || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-6 mb-2">
                                                        <div className="bg-white p-2 rounded border h-100">
                                                            <small className="text-primary mb-1 d-block">Total</small>
                                                            <div className="fw-bold text-success">{tuitionApplyList.length}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-12 mb-2">
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
                                                        <th>Tuition Code</th>
                                                        <th>Phone</th>
                                                        <th>Status</th>
                                                        <th>Comment For Teacher</th>
                                                        <th>Applied At</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tuitionApplyList.map((apply, index) => {
                                                        const rowStyle = getRowStyle(apply);
                                                        return (
                                                            <tr key={index}>
                                                                <td style={{ ...rowStyle, textAlign: 'center', verticalAlign: 'middle', minWidth: '80px' }}>
                                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                                                        <span style={{ fontWeight: '700', fontSize: '1rem' }}>
                                                                            {index + 1}
                                                                        </span>
                                                                        {apply.isAppApply
                                                                            ? (
                                                                                <span style={{
                                                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                                    backgroundColor: '#01875f', color: '#fff',
                                                                                    padding: '2px 8px', borderRadius: '12px',
                                                                                    fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase',
                                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                                }}>
                                                                                    <FaGooglePlay style={{ fontSize: '0.6rem' }} /> App
                                                                                </span>
                                                                            )
                                                                            : (
                                                                                <span style={{
                                                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                                    backgroundColor: '#1a73e8', color: '#fff',
                                                                                    padding: '2px 8px', borderRadius: '12px',
                                                                                    fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase',
                                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                                }}>
                                                                                    <FaGlobe style={{ fontSize: '0.6rem' }} /> Web
                                                                                </span>
                                                                            )}
                                                                    </div>
                                                                </td>

                                                                <td style={rowStyle}>{apply.tuitionCode}</td>

                                                                <td style={rowStyle}>{apply.phone}</td>
                                                                <td style={rowStyle}>
                                                                    <div className="d-flex flex-column align-items-center gap-1">
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
                                                                        {apply.hasDue && (
                                                                            <span className="badge bg-warning text-dark">
                                                                                ডিউ আছে
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td style={rowStyle}>{apply.commentForTeacher}</td>
                                                                <td style={rowStyle}>{formatDate(apply.appliedAt)}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </Table>
                                        </>
                                    ) : (
                                        <div className="text-center py-5">
                                            <p className="text-muted fst-italic">No tuition applications found for this premium code.</p>
                                        </div>
                                    )}
                                </Tab.Pane>

                                <Tab.Pane eventKey="proposals">
                                    {proposalsLoading ? (
                                        <div className="text-center py-5">
                                            <Spinner animation="border" variant="primary" />
                                            <p className="mt-2">Loading proposals...</p>
                                        </div>
                                    ) : proposalsList.length > 0 ? (
                                        <>
                                            {/* Summary Section for Proposals */}
                                            <div className="mb-4 p-3 bg-light rounded shadow-sm">
                                                <div className="row text-center g-2">
                                                    <div className="col-md-6 col-6 mb-2">
                                                        <div className="bg-white p-2 rounded border h-100">
                                                            <small className="text-primary mb-1 d-block">Total Proposals Sent</small>
                                                            <div className="fw-bold text-success">{proposalsList.length}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-6 mb-2">
                                                        <div className="bg-white p-2 rounded border h-100">
                                                            <small className="text-primary mb-1 d-block">Total Applied</small>
                                                            <div className="fw-bold text-info">
                                                                {proposalsList.filter(p => p.hasApplied).length}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Table striped bordered hover responsive className="text-center align-middle">
                                                <thead className="table-primary">
                                                    <tr>
                                                        <th>SL</th>
                                                        <th>Time</th>
                                                        <th>Tuition Code</th>
                                                        <th>Recipient Phone</th>
                                                        <th>Message</th>
                                                        <th>Sent By</th>
                                                        <th>Applied?</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {proposalsList.map((prop, idx) => (
                                                        <tr key={prop._id}>
                                                            <td style={{ fontWeight: '700' }}>{idx + 1}</td>
                                                            <td>{formatDate(prop.createdAt)}</td>
                                                            <td>
                                                                {prop.tuitionCode ? (
                                                                    <Badge bg="primary">{prop.tuitionCode}</Badge>
                                                                ) : (
                                                                    <span className="text-muted">-</span>
                                                                )}
                                                            </td>
                                                            <td>{prop.phone}</td>
                                                            <td className="text-start small" style={{ maxWidth: '300px', wordBreak: 'break-word' }}>
                                                                {prop.message}
                                                            </td>
                                                            <td>{prop.sentBy}</td>
                                                            <td>
                                                                {prop.hasApplied ? (
                                                                    <Badge bg="info">
                                                                        Applied ({prop.applicationStatus || 'pending'})
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge bg="secondary">No</Badge>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <Badge bg={prop.status === 'success' ? 'success' : 'danger'}>
                                                                    {prop.status.toUpperCase()}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </>
                                    ) : (
                                        <div className="text-center py-5">
                                            <p className="text-muted fst-italic">No SMS proposals found for this premium code.</p>
                                        </div>
                                    )}
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </Modal.Body>

                    <Modal.Footer className="border-top-0">
                        <Button variant="secondary" onClick={handleCloseTuitionApplyModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Status History Timeline Modal */}
                <Modal show={showStatusHistoryModal} onHide={() => setShowStatusHistoryModal(false)} centered>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="fw-bold">Status History - {statusHistoryTarget.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-light" style={{ padding: '24px' }}>
                        {statusHistoryLoading ? (
                            <div className="text-center my-4">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : statusHistoryList.length === 0 ? (
                            <div className="text-center my-4 text-muted fw-bold">
                                No status changes logged yet for this record.
                            </div>
                        ) : (
                            <div className="alternating-timeline" style={{ position: 'relative', padding: '20px 0' }}>
                                {/* Central line */}
                                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '3px', backgroundColor: '#dee2e6', transform: 'translateX(-50%)' }} />

                                {statusHistoryList.map((log, index) => {
                                    const isLeft = index % 2 === 0;
                                    return (
                                        <div key={log._id} className="d-flex align-items-center mb-4 position-relative" style={{ minHeight: '80px' }}>
                                            {/* Left Card */}
                                            <div className="w-50 pe-4 text-end" style={{ visibility: isLeft ? 'visible' : 'hidden' }}>
                                                {isLeft && (
                                                    <div className="card p-3 shadow-sm border-0 d-inline-block text-start w-100" style={{ borderRadius: '12px', borderLeft: '4px solid #0d6efd' }}>
                                                        <div className="mb-1">
                                                            <span className="fw-bold text-dark fs-6 text-capitalize">
                                                                {log.oldStatus || 'Creation'} &rarr; <span className="text-primary">{log.newStatus}</span>
                                                            </span>
                                                        </div>
                                                        <div className="text-secondary mb-2" style={{ fontSize: '12.5px' }}>
                                                            Changed by: <span className="badge bg-secondary">{log.changedBy}</span>
                                                        </div>
                                                        <small className="text-muted" style={{ fontSize: '11px' }}>
                                                            {new Date(log.timestamp).toLocaleString('en-GB', {
                                                                day: '2-digit', month: 'short', year: 'numeric',
                                                                hour: '2-digit', minute: '2-digit', hour12: true
                                                            })}
                                                        </small>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Dot indicator in the center */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: '50%',
                                                    backgroundColor: index === 0 ? '#0d6efd' : '#adb5bd',
                                                    border: '3px solid #fff',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    zIndex: 5
                                                }}
                                            />

                                            {/* Right Card */}
                                            <div className="w-50 ps-4 text-start" style={{ visibility: !isLeft ? 'visible' : 'hidden' }}>
                                                {!isLeft && (
                                                    <div className="card p-3 shadow-sm border-0 d-inline-block text-start w-100" style={{ borderRadius: '12px', borderLeft: '4px solid #0d6efd' }}>
                                                        <div className="mb-1">
                                                            <span className="fw-bold text-dark fs-6 text-capitalize">
                                                                {log.oldStatus || 'Creation'} &rarr; <span className="text-primary">{log.newStatus}</span>
                                                            </span>
                                                        </div>
                                                        <div className="text-secondary mb-2" style={{ fontSize: '12.5px' }}>
                                                            Changed by: <span className="badge bg-secondary">{log.changedBy}</span>
                                                        </div>
                                                        <small className="text-muted" style={{ fontSize: '11px' }}>
                                                            {new Date(log.timestamp).toLocaleString('en-GB', {
                                                                day: '2-digit', month: 'short', year: 'numeric',
                                                                hour: '2-digit', minute: '2-digit', hour12: true
                                                            })}
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowStatusHistoryModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Info Verified Quick Update Modal */}
                <Modal
                    show={showInfoVerifiedModal}
                    onHide={() => setShowInfoVerifiedModal(false)}
                    centered
                    dialogClassName="modal-dialog-centered"
                    contentClassName="border-0 shadow-lg"
                    style={{ zIndex: 10050 }}
                >
                    <div style={{ borderRadius: '14px', overflow: 'hidden', backgroundColor: '#fff' }}>
                        {/* Header */}
                        <div
                            className="px-4 py-3 d-flex align-items-center justify-content-between text-white"
                            style={{
                                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                                borderBottom: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <div
                                    style={{
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '9px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backdropFilter: 'blur(4px)'
                                    }}
                                >
                                    <FaShieldAlt size={16} />
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold" style={{ fontSize: '0.98rem', letterSpacing: '-0.2px' }}>
                                        Info Verification
                                    </h6>
                                    <small style={{ fontSize: '0.72rem', opacity: 0.9 }}>Profile verification status</small>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                style={{ opacity: 0.85, fontSize: '0.8rem' }}
                                onClick={() => setShowInfoVerifiedModal(false)}
                            />
                        </div>

                        {/* Body */}
                        <Modal.Body className="p-3 p-sm-4" style={{ backgroundColor: '#f8fafc' }}>
                            {targetInfoTeacher && (
                                <div className="d-flex flex-column gap-3">
                                    {/* Teacher Info Card */}
                                    <div
                                        className="p-3 bg-white border shadow-sm"
                                        style={{ borderRadius: '12px', borderColor: '#e2e8f0' }}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <div
                                                style={{
                                                    width: '42px',
                                                    height: '42px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                                    color: '#1d4ed8',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: '700',
                                                    fontSize: '1.1rem',
                                                    flexShrink: 0
                                                }}
                                            >
                                                {targetInfoTeacher.name ? targetInfoTeacher.name.charAt(0).toUpperCase() : 'T'}
                                            </div>
                                            <div className="overflow-hidden flex-grow-1">
                                                <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.95rem' }}>
                                                    {targetInfoTeacher.name || 'Unnamed Teacher'}
                                                </div>
                                                <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
                                                    <span
                                                        className="badge px-2 py-1 d-inline-flex align-items-center gap-1"
                                                        style={{
                                                            backgroundColor: '#eff6ff',
                                                            color: '#1d4ed8',
                                                            border: '1px solid #bfdbfe',
                                                            fontSize: '0.72rem',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        <FaIdCard size={10} /> {targetInfoTeacher.premiumCode || 'No Code'}
                                                    </span>
                                                    {targetInfoTeacher.phone && (
                                                        <span
                                                            className="badge px-2 py-1 d-inline-flex align-items-center gap-1"
                                                            style={{
                                                                backgroundColor: '#f1f5f9',
                                                                color: '#475569',
                                                                border: '1px solid #cbd5e1',
                                                                fontSize: '0.72rem',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            <FaPhoneAlt size={9} /> {targetInfoTeacher.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interactive Toggle Card */}
                                    <div
                                        onClick={() => setInfoVerifiedToggle(prev => !prev)}
                                        className="p-3 border"
                                        style={{
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            backgroundColor: infoVerifiedToggle ? '#f0fdf4' : '#ffffff',
                                            borderColor: infoVerifiedToggle ? '#86efac' : '#e2e8f0',
                                            boxShadow: infoVerifiedToggle ? '0 4px 12px rgba(16, 185, 129, 0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-3">
                                                <div
                                                    style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        borderRadius: '10px',
                                                        backgroundColor: infoVerifiedToggle ? '#dcfce7' : '#f1f5f9',
                                                        color: infoVerifiedToggle ? '#16a34a' : '#94a3b8',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    {infoVerifiedToggle ? <FaCheckCircle size={19} /> : <FaTimesCircle size={19} />}
                                                </div>
                                                <div>
                                                    <div className="fw-bold" style={{ fontSize: '0.92rem', color: infoVerifiedToggle ? '#15803d' : '#334155' }}>
                                                        {infoVerifiedToggle ? 'Info Verified' : 'Not Verified'}
                                                    </div>
                                                    <small className="text-muted d-block" style={{ fontSize: '0.74rem', marginTop: '1px' }}>
                                                        {infoVerifiedToggle ? 'Documents & information verified' : 'Click card to toggle verification'}
                                                    </small>
                                                </div>
                                            </div>

                                            <Form.Check
                                                type="switch"
                                                id="info-verified-switch-action"
                                                style={{ fontSize: '1.4rem', cursor: 'pointer' }}
                                                checked={infoVerifiedToggle}
                                                onChange={(e) => setInfoVerifiedToggle(e.target.checked)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Modal.Body>

                        {/* Footer */}
                        <div
                            className="px-4 py-3 bg-white d-flex align-items-center justify-content-end gap-2"
                            style={{ borderTop: '1px solid #e2e8f0' }}
                        >
                            <Button
                                variant="light"
                                className="px-3 py-2 fw-semibold"
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    color: '#475569',
                                    fontSize: '0.85rem'
                                }}
                                onClick={() => setShowInfoVerifiedModal(false)}
                                disabled={infoVerifiedUpdating}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="px-4 py-2 fw-semibold d-flex align-items-center gap-2 text-white border-0"
                                style={{
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                    fontSize: '0.85rem',
                                    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)'
                                }}
                                onClick={handleSaveInfoVerified}
                                disabled={infoVerifiedUpdating}
                            >
                                {infoVerifiedUpdating ? (
                                    <>
                                        <Spinner size="sm" animation="border" className="me-1" /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle size={13} /> Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Verification SMS Modal */}
                <Modal show={showSmsModal} onHide={() => setShowSmsModal(false)} contentClassName="border border-3 border-success rounded-3 shadow-lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold text-success">Send Verification SMS</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="alert alert-info py-2 fw-bold mb-3">
                            Sending SMS to: {formData.phone || 'N/A'}
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Recipient Phone</Form.Label>
                            <Form.Control
                                type="text"
                                value={smsRecipient}
                                onChange={(e) => setSmsRecipient(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Message Body</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6}
                                value={smsMessage}
                                onChange={(e) => setSmsMessage(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowSmsModal(false)} disabled={saving}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSaveWithoutSms} disabled={saving}>
                            {saving ? <><Spinner animation="border" size="sm" className="me-2" />Saving...</> : 'Save Without SMS'}
                        </Button>
                        <Button variant="success" onClick={handleSendVerificationSmsAndSave} disabled={saving}>
                            {saving ? <><Spinner animation="border" size="sm" className="me-2" />Sending...</> : 'Send SMS & Save'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Fullscreen Image Lightbox Modal */}
                {enlargedImage && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            backdropFilter: 'blur(5px)',
                            zIndex: 99999,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '16px'
                        }}
                        onClick={() => setEnlargedImage(null)}
                    >
                        {/* Top Bar */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '14px 24px',
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)',
                                color: '#fff',
                                zIndex: 100000
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <FaImages className="text-info fs-5" />
                                <span className="fw-bold fs-6 text-white text-truncate" style={{ maxWidth: '60vw' }}>
                                    {enlargedImage.title || 'Document Preview'}
                                </span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <a
                                    href={enlargedImage.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                                    style={{ fontSize: '0.8rem' }}
                                    title="Open original image in new tab"
                                >
                                    <FaExternalLinkAlt size={11} /> New Tab
                                </a>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '34px', height: '34px', fontSize: '16px' }}
                                    onClick={() => setEnlargedImage(null)}
                                    title="Close (or press Esc to return to modal)"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        {/* Image Canvas */}
                        <div
                            style={{
                                maxWidth: '92vw',
                                maxHeight: '84vh',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={enlargedImage.url}
                                alt={enlargedImage.title || 'Enlarged Preview'}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '84vh',
                                    width: 'auto',
                                    height: 'auto',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
                                }}
                            />
                        </div>

                        <div
                            className="text-white-50 small mt-2 d-flex align-items-center gap-1"
                            style={{ fontSize: '0.78rem' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            Click background or press <kbd className="bg-secondary text-white px-1 rounded">Esc</kbd> to return to modal
                        </div>
                    </div>
                )}

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

  .pagination-rounded-pill .page-item .page-link {
    border-radius: 50px;
    margin: 0 3px;
    border: none;
    padding: 8px 14px;
    font-weight: 600;
    color: #444;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .pagination-rounded-pill .page-item.active .page-link {
    background-color: #0d6efd;
    color: white;
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
