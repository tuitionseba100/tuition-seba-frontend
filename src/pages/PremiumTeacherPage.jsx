import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card, Nav, Tab, Badge } from 'react-bootstrap';
import { FaEdit, FaInfoCircle, FaTrashAlt, FaWhatsapp, FaChevronLeft, FaChevronRight, FaSearch, FaTimes, FaGlobe, FaGooglePlay, FaUserPlus, FaCamera, FaTrash, FaUserCircle, FaExternalLinkAlt, FaCheckCircle, FaIdCard, FaImages, FaFileAlt, FaGraduationCap } from 'react-icons/fa'; // React Icons
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
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoSizeKB, setPhotoSizeKB] = useState(null);
    const [pendingPhotoFile, setPendingPhotoFile] = useState(null);
    const [pendingPhotoPreview, setPendingPhotoPreview] = useState(null);

    const [uploadingNid, setUploadingNid] = useState(false);
    const [nidSizeKB, setNidSizeKB] = useState(null);
    const [pendingNidFile, setPendingNidFile] = useState(null);
    const [pendingNidPreview, setPendingNidPreview] = useState(null);

    const [uploadingSsc, setUploadingSsc] = useState(false);
    const [sscSizeKB, setSscSizeKB] = useState(null);
    const [pendingSscFile, setPendingSscFile] = useState(null);
    const [pendingSscPreview, setPendingSscPreview] = useState(null);

    const [uploadingHsc, setUploadingHsc] = useState(false);
    const [hscSizeKB, setHscSizeKB] = useState(null);
    const [pendingHscFile, setPendingHscFile] = useState(null);
    const [pendingHscPreview, setPendingHscPreview] = useState(null);

    const [uploadingUniId, setUploadingUniId] = useState(false);
    const [uniIdSizeKB, setUniIdSizeKB] = useState(null);
    const [pendingUniIdFile, setPendingUniIdFile] = useState(null);
    const [pendingUniIdPreview, setPendingUniIdPreview] = useState(null);

    const resetMediaPendingStates = () => {
        setPendingPhotoFile(null);
        setPendingPhotoPreview(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setPendingNidFile(null);
        setPendingNidPreview(prev => {
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
        setPhotoSizeKB(null);
        setNidSizeKB(null);
        setSscSizeKB(null);
        setHscSizeKB(null);
        setUniIdSizeKB(null);
    };

    const handleCloseModal = () => {
        resetMediaPendingStates();
        setShowModal(false);
    };

    const spamStyle = { backgroundColor: '#dc3545', color: 'white' };
    const bestStyle = { backgroundColor: '#007bff', color: 'white' };
    const manualExpressStyle = { backgroundColor: '#28a745', color: 'white' };
    const dueStyle = { backgroundColor: '#FFFF00', color: 'black' };

    const getRowStyle = (tuition) => {
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
        referPersonPhone: ''
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
        referPersonPhone: ''
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
        { key: 'referPersonPhone', label: 'Referred Phone', type: 'text', col: 2 }
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
        { name: 'isBiodataShow', label: 'Show Biodata?', col: 12, group: 'Subscription & Payment Details', type: 'checkbox' },

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
        sscMarksheet: '',
        hscMarksheet: '',
        universityIdCard: ''
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
            referPersonPhone: ''
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

            // Upload pending NID on Save
            if (pendingNidFile) {
                setUploadingNid(true);
                const nidRes = await uploadMediaWithFallback(pendingNidFile, 'teacher-nid');
                updatingData.nidPhoto = nidRes.url;
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
            setUploadingNid(false);
            setUploadingSsc(false);
            setUploadingHsc(false);
            setUploadingUniId(false);
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

            // Upload pending NID on Save
            if (pendingNidFile) {
                setUploadingNid(true);
                const nidRes = await uploadMediaWithFallback(pendingNidFile, 'teacher-nid');
                updatedData.nidPhoto = nidRes.url;
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
            setUploadingNid(false);
            setUploadingSsc(false);
            setUploadingHsc(false);
            setUploadingUniId(false);
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

            // Upload pending NID on Save
            if (pendingNidFile) {
                setUploadingNid(true);
                const nidRes = await uploadMediaWithFallback(pendingNidFile, 'teacher-nid');
                updatedData.nidPhoto = nidRes.url;
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
            setUploadingNid(false);
            setUploadingSsc(false);
            setUploadingHsc(false);
            setUploadingUniId(false);
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

    const handleNidUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Compress on client side under 100KB (max 1200px dimension for document text)
            const { file: compressedFile, sizeKB } = await compressImageUnderMaxKB(file, 95, 1200);
            setNidSizeKB(sizeKB);

            if (pendingNidPreview) {
                URL.revokeObjectURL(pendingNidPreview);
            }
            const previewUrl = URL.createObjectURL(compressedFile);
            setPendingNidFile(compressedFile);
            setPendingNidPreview(previewUrl);

            toast.info(`NID document selected (${sizeKB} KB). Click "Save" below to upload and save.`);
        } catch (err) {
            console.error('NID processing error:', err);
            toast.error(err.message || 'Failed to process NID document');
        } finally {
            if (e.target) e.target.value = '';
        }
    };

    const handleRemoveNid = () => {
        if (pendingNidPreview) {
            URL.revokeObjectURL(pendingNidPreview);
        }
        setPendingNidFile(null);
        setPendingNidPreview(null);
        setFormData(prev => ({ ...prev, nidPhoto: '' }));
        setNidSizeKB(null);
        toast.info('NID document removed from form. Click "Save" below to apply changes.');
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
        data.sscMarksheet = '';
        data.hscMarksheet = '';
        data.universityIdCard = '';
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
                                                    {opt}
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
                                            <td colSpan="17" className="text-center">
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
                            <Card className="mb-4 shadow-sm border bg-white" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                {/* Gallery Header Bar */}
                                <div className="px-4 py-2 bg-light border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <FaImages className="text-primary fs-5" />
                                        <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>Photo Gallery & Document Preview</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="badge bg-primary fs-6 px-3 py-1">Code: {selectedTeacher.premiumCode || 'N/A'}</span>
                                        <span
                                            className="badge text-uppercase px-2 py-1"
                                            style={{
                                                backgroundColor: statusStyles[selectedTeacher.status]?.bg || '#6c757d',
                                                color: statusStyles[selectedTeacher.status]?.color || '#fff'
                                            }}
                                        >
                                            {selectedTeacher.status || 'Pending'}
                                        </span>
                                    </div>
                                </div>

                                <Card.Body className="p-3 p-md-4">
                                    {/* Top Row: Profile Photo & Teacher Summary */}
                                    <Row className="g-4 align-items-stretch mb-4">
                                        {/* Gallery Item 1: Profile Photo (Covered, Rectangular, Not Circle) */}
                                        <Col xs={12} sm={5} md={3}>
                                            <div className="d-flex flex-column h-100 align-items-center">
                                                <div
                                                    className="w-100 overflow-hidden shadow-sm border position-relative d-flex align-items-center justify-content-center"
                                                    style={{
                                                        borderRadius: '12px',
                                                        height: '240px',
                                                        backgroundColor: '#0f172a',
                                                        cursor: selectedTeacher.photo ? 'pointer' : 'default'
                                                    }}
                                                    onClick={() => selectedTeacher.photo && window.open(selectedTeacher.photo, '_blank')}
                                                    title={selectedTeacher.photo ? 'Click to open full photo in new tab' : 'No photo uploaded'}
                                                >
                                                    {selectedTeacher.photo ? (
                                                        <img
                                                            src={selectedTeacher.photo}
                                                            alt={selectedTeacher.name || 'Teacher Profile Photo'}
                                                            style={{
                                                                maxWidth: '100%',
                                                                maxHeight: '100%',
                                                                width: 'auto',
                                                                height: 'auto',
                                                                objectFit: 'contain',
                                                                display: 'block',
                                                                transition: 'transform 0.25s ease'
                                                            }}
                                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                        />
                                                    ) : (
                                                        <div className="h-100 w-100 d-flex flex-column align-items-center justify-content-center text-muted p-2">
                                                            <FaCamera style={{ fontSize: '2.5rem' }} className="mb-2 text-secondary opacity-50" />
                                                            <span className="small fw-semibold text-white-50">No Photo</span>
                                                        </div>
                                                    )}

                                                    {selectedTeacher.photo && (
                                                        <div
                                                            className="position-absolute bottom-0 start-0 end-0 p-1 text-white text-center"
                                                            style={{
                                                                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                                                fontSize: '0.72rem'
                                                            }}
                                                        >
                                                            <FaExternalLinkAlt className="me-1" /> View Full Image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-2 text-center">
                                                    <span className="badge bg-primary text-white fw-semibold px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                        Profile Photo
                                                    </span>
                                                </div>
                                            </div>
                                        </Col>

                                        {/* Teacher Quick Summary Card */}
                                        <Col xs={12} sm={7} md={9}>
                                            <div className="p-3 rounded border bg-light h-100 d-flex flex-column justify-content-between">
                                                <div>
                                                    <h3 className="fw-bold mb-2 text-dark">{selectedTeacher.name || 'Unnamed Teacher'}</h3>
                                                    
                                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                                        {selectedTeacher.uniCode && (
                                                            <span className="badge bg-info text-dark px-2 py-1">Uni: {selectedTeacher.uniCode}</span>
                                                        )}
                                                        {selectedTeacher.gender && (
                                                            <span className="badge bg-white text-dark border text-capitalize px-2 py-1">{selectedTeacher.gender}</span>
                                                        )}
                                                        {selectedTeacher.city && (
                                                            <span className="badge bg-secondary px-2 py-1">{selectedTeacher.city}</span>
                                                        )}
                                                        {selectedTeacher.currentArea && (
                                                            <span className="badge bg-white text-secondary border px-2 py-1">{selectedTeacher.currentArea}</span>
                                                        )}
                                                    </div>

                                                    <div className="small text-secondary mb-3">
                                                        {selectedTeacher.phone && (
                                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                                <strong>Phone:</strong>
                                                                <span className="fw-semibold text-dark">{selectedTeacher.phone}</span>
                                                                {formatPhoneForWhatsApp(selectedTeacher.whatsapp || selectedTeacher.phone) && (
                                                                    <Button
                                                                        variant="outline-success"
                                                                        size="sm"
                                                                        className="py-0 px-2"
                                                                        style={{ fontSize: '0.75rem' }}
                                                                        onClick={() => {
                                                                            const target = formatPhoneForWhatsApp(selectedTeacher.whatsapp || selectedTeacher.phone);
                                                                            window.open(`https://api.whatsapp.com/send?phone=${target}`, '_blank');
                                                                        }}
                                                                    >
                                                                        <FaWhatsapp className="me-1" /> WhatsApp
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        )}
                                                        {selectedTeacher.whatsapp && selectedTeacher.whatsapp !== selectedTeacher.phone && (
                                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                                <strong>WhatsApp:</strong>
                                                                <span className="fw-semibold text-dark">{selectedTeacher.whatsapp}</span>
                                                                {formatPhoneForWhatsApp(selectedTeacher.whatsapp) && (
                                                                    <Button
                                                                        variant="success"
                                                                        size="sm"
                                                                        className="py-0 px-2"
                                                                        style={{ fontSize: '0.75rem' }}
                                                                        onClick={() => {
                                                                            const target = formatPhoneForWhatsApp(selectedTeacher.whatsapp);
                                                                            window.open(`https://api.whatsapp.com/send?phone=${target}`, '_blank');
                                                                        }}
                                                                    >
                                                                        <FaWhatsapp className="me-1" /> Chat
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        )}
                                                        {selectedTeacher.honorsUniversity && (
                                                            <div className="mb-1">
                                                                <strong>University:</strong> {selectedTeacher.honorsUniversity} {selectedTeacher.honorsDept ? `(${selectedTeacher.honorsDept})` : ''}
                                                            </div>
                                                        )}
                                                        {selectedTeacher.academicYear && (
                                                            <div className="mb-1">
                                                                <strong>Academic Year:</strong> {selectedTeacher.academicYear}
                                                            </div>
                                                        )}
                                                        {selectedTeacher.experience && (
                                                            <div>
                                                                <strong>Experience:</strong> {selectedTeacher.experience}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-2 pt-2 border-top">
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="d-flex align-items-center gap-1"
                                                        onClick={() => {
                                                            setShowDetailsModal(false);
                                                            handleEditTeacher(selectedTeacher);
                                                        }}
                                                    >
                                                        <FaEdit /> Edit Teacher
                                                    </Button>
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        className="d-flex align-items-center gap-1"
                                                        onClick={() => handleShare(selectedTeacher)}
                                                    >
                                                        <FaWhatsapp /> Share CV
                                                    </Button>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* Bottom Row: Verification & Academic Credentials (4 Document Cards) */}
                                    <div className="pt-3 border-top">
                                        <h6 className="fw-bold text-secondary mb-3 d-flex align-items-center gap-2">
                                            <FaIdCard className="text-primary" /> Verification & Academic Documents
                                        </h6>
                                        <Row className="g-3">
                                            {[
                                                { label: 'NID / Birth Certificate', key: 'nidPhoto', icon: <FaIdCard style={{ fontSize: '2.3rem' }} className="mb-2 text-secondary opacity-50" /> },
                                                { label: 'SSC Marksheet', key: 'sscMarksheet', icon: <FaFileAlt style={{ fontSize: '2.3rem' }} className="mb-2 text-secondary opacity-50" /> },
                                                { label: 'HSC Marksheet', key: 'hscMarksheet', icon: <FaFileAlt style={{ fontSize: '2.3rem' }} className="mb-2 text-secondary opacity-50" /> },
                                                { label: 'University ID / Admission Slip', key: 'universityIdCard', icon: <FaGraduationCap style={{ fontSize: '2.3rem' }} className="mb-2 text-secondary opacity-50" /> },
                                            ].map(doc => {
                                                const docUrl = selectedTeacher[doc.key];
                                                return (
                                                    <Col xs={12} sm={6} md={3} key={doc.key}>
                                                        <div className="d-flex flex-column h-100 align-items-center p-2 rounded border bg-light">
                                                            <div
                                                                className="w-100 overflow-hidden shadow-sm border position-relative d-flex align-items-center justify-content-center"
                                                                style={{
                                                                    borderRadius: '8px',
                                                                    height: '190px',
                                                                    backgroundColor: '#0f172a',
                                                                    cursor: docUrl ? 'pointer' : 'default'
                                                                }}
                                                                onClick={() => docUrl && window.open(docUrl, '_blank')}
                                                                title={docUrl ? `Click to open ${doc.label} in new tab` : `No ${doc.label} attached`}
                                                            >
                                                                {docUrl ? (
                                                                    <img
                                                                        src={docUrl}
                                                                        alt={doc.label}
                                                                        style={{
                                                                            maxWidth: '100%',
                                                                            maxHeight: '100%',
                                                                            width: 'auto',
                                                                            height: 'auto',
                                                                            objectFit: 'contain',
                                                                            display: 'block',
                                                                            transition: 'transform 0.25s ease'
                                                                        }}
                                                                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                                    />
                                                                ) : (
                                                                    <div className="h-100 w-100 d-flex flex-column align-items-center justify-content-center text-muted p-2">
                                                                        {doc.icon}
                                                                        <span className="small fw-semibold text-white-50">Not Attached</span>
                                                                    </div>
                                                                )}

                                                                {docUrl && (
                                                                    <div
                                                                        className="position-absolute bottom-0 start-0 end-0 p-1 text-white text-center"
                                                                        style={{
                                                                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                                                            fontSize: '0.72rem'
                                                                        }}
                                                                    >
                                                                        <FaExternalLinkAlt className="me-1" /> View Full Document
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="mt-2 text-center w-100">
                                                                <div className="fw-semibold small text-dark text-truncate mb-1" title={doc.label}>
                                                                    {doc.label}
                                                                </div>
                                                                <span className={`badge ${docUrl ? 'bg-success text-white' : 'bg-light text-muted border'} fw-semibold px-2 py-1`} style={{ fontSize: '0.72rem' }}>
                                                                    {docUrl ? 'Uploaded' : 'Not Uploaded'}
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
                        {/* Profile Photo & NID/Birth Registration Uploader Row */}
                        <Row className="g-3 mb-4">
                            {/* Profile Photo Uploader */}
                            <Col md={6}>
                                <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <div style={{ position: 'relative' }}>
                                            {(pendingPhotoPreview || formData.photo) ? (
                                                <img
                                                    src={pendingPhotoPreview || formData.photo}
                                                    alt="Teacher Profile"
                                                    style={{
                                                        width: '80px',
                                                        height: '90px',
                                                        borderRadius: '8px',
                                                        objectFit: 'contain',
                                                        backgroundColor: '#f1f3f5',
                                                        border: pendingPhotoFile ? '2px solid #ffc107' : '2px solid #0d6efd',
                                                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => window.open(pendingPhotoPreview || formData.photo, '_blank')}
                                                    title="Click to view full image"
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '80px',
                                                        height: '90px',
                                                        borderRadius: '8px',
                                                        backgroundColor: '#dee2e6',
                                                        color: '#6c757d',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.8rem',
                                                        border: '2px dashed #adb5bd'
                                                    }}
                                                >
                                                    <FaCamera />
                                                    <span style={{ fontSize: '0.6rem' }} className="mt-1">No Photo</span>
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
                                                        borderRadius: '8px',
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

                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-0">Profile Photo</h6>
                                            <small className="text-muted d-block mb-1">
                                                Max 100 KB
                                                {photoSizeKB && (
                                                    <span className={`ms-2 badge ${pendingPhotoFile ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                        {pendingPhotoFile ? `Pending: ${photoSizeKB} KB` : `${photoSizeKB} KB`}
                                                    </span>
                                                )}
                                            </small>

                                            <div className="d-flex flex-wrap gap-1 align-items-center">
                                                <label className={`btn btn-sm btn-primary d-inline-flex align-items-center gap-1 mb-0 ${uploadingPhoto ? 'disabled' : ''}`} style={{ cursor: uploadingPhoto ? 'not-allowed' : 'pointer', fontSize: '0.78rem' }}>
                                                    <FaCamera />
                                                    {uploadingPhoto ? 'Uploading...' : ((pendingPhotoPreview || formData.photo) ? 'Change' : 'Select Photo')}
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
                                                        style={{ fontSize: '0.78rem' }}
                                                        className="d-inline-flex align-items-center gap-1"
                                                    >
                                                        <FaTrash /> Remove
                                                    </Button>
                                                )}

                                                {formData.photo && !pendingPhotoPreview && (
                                                    <a
                                                        href={formData.photo}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ fontSize: '0.78rem' }}
                                                        className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                                                    >
                                                        <FaExternalLinkAlt /> View
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {pendingPhotoFile ? (
                                            <small className="text-warning fw-semibold d-flex align-items-center gap-1">
                                                <FaInfoCircle /> Selected &mdash; will upload when you click Save
                                            </small>
                                        ) : formData.photo ? (
                                            <small className="text-success d-flex align-items-center gap-1">
                                                <FaCheckCircle /> Saved profile photo
                                            </small>
                                        ) : (
                                            <small className="text-muted">No photo selected</small>
                                        )}
                                    </div>
                                </div>
                            </Col>

                            {/* NID / Birth Registration Photo Uploader */}
                            <Col md={6}>
                                <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <div style={{ position: 'relative' }}>
                                            {(pendingNidPreview || formData.nidPhoto) ? (
                                                <img
                                                    src={pendingNidPreview || formData.nidPhoto}
                                                    alt="NID Document"
                                                    style={{
                                                        width: '100px',
                                                        height: '65px',
                                                        borderRadius: '6px',
                                                        objectFit: 'contain',
                                                        backgroundColor: '#f1f3f5',
                                                        border: pendingNidFile ? '2px solid #ffc107' : '2px solid #198754',
                                                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => window.open(pendingNidPreview || formData.nidPhoto, '_blank')}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '100px',
                                                        height: '65px',
                                                        borderRadius: '6px',
                                                        backgroundColor: '#dee2e6',
                                                        color: '#6c757d',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.6rem',
                                                        border: '2px dashed #adb5bd'
                                                    }}
                                                >
                                                    <FaIdCard />
                                                    <span style={{ fontSize: '0.6rem' }}>No NID</span>
                                                </div>
                                            )}
                                            {uploadingNid && (
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

                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-0">NID / Birth Certificate</h6>
                                            <small className="text-muted d-block mb-1">
                                                Max 100 KB
                                                {nidSizeKB && (
                                                    <span className={`ms-2 badge ${pendingNidFile ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                        {pendingNidFile ? `Pending: ${nidSizeKB} KB` : `${nidSizeKB} KB`}
                                                    </span>
                                                )}
                                            </small>

                                            <div className="d-flex flex-wrap gap-1 align-items-center">
                                                <label className={`btn btn-sm btn-success d-inline-flex align-items-center gap-1 mb-0 ${uploadingNid ? 'disabled' : ''}`} style={{ cursor: uploadingNid ? 'not-allowed' : 'pointer', fontSize: '0.78rem' }}>
                                                    <FaIdCard />
                                                    {uploadingNid ? 'Uploading...' : ((pendingNidPreview || formData.nidPhoto) ? 'Change NID' : 'Select NID')}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleNidUpload}
                                                        style={{ display: 'none' }}
                                                        disabled={uploadingNid || saving}
                                                    />
                                                </label>

                                                {(pendingNidPreview || formData.nidPhoto) && (
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={handleRemoveNid}
                                                        disabled={uploadingNid || saving}
                                                        style={{ fontSize: '0.78rem' }}
                                                        className="d-inline-flex align-items-center gap-1"
                                                    >
                                                        <FaTrash /> Remove
                                                    </Button>
                                                )}

                                                {formData.nidPhoto && !pendingNidPreview && (
                                                    <a
                                                        href={formData.nidPhoto}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ fontSize: '0.78rem' }}
                                                        className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                                                    >
                                                        <FaExternalLinkAlt /> View
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {pendingNidFile ? (
                                            <small className="text-warning fw-semibold d-flex align-items-center gap-1">
                                                <FaInfoCircle /> Selected &mdash; will upload when you click Save
                                            </small>
                                        ) : formData.nidPhoto ? (
                                            <small className="text-success d-flex align-items-center gap-1">
                                                <FaCheckCircle /> Saved NID document
                                            </small>
                                        ) : (
                                            <small className="text-muted">No document uploaded</small>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        {/* Academic & Verification Documents Upload Row */}
                        <Row className="g-3 mb-4">
                            {/* SSC Marksheet */}
                            <Col md={4}>
                                <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <div style={{ position: 'relative' }}>
                                            {(pendingSscPreview || formData.sscMarksheet) ? (
                                                <img
                                                    src={pendingSscPreview || formData.sscMarksheet}
                                                    alt="SSC Marksheet"
                                                    style={{
                                                        width: '85px',
                                                        height: '65px',
                                                        borderRadius: '6px',
                                                        objectFit: 'contain',
                                                        backgroundColor: '#f1f3f5',
                                                        border: pendingSscFile ? '2px solid #ffc107' : '2px solid #0d6efd',
                                                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => window.open(pendingSscPreview || formData.sscMarksheet, '_blank')}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '85px',
                                                        height: '65px',
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
                                                    <span style={{ fontSize: '0.6rem' }}>No SSC</span>
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
                                            <h6 className="fw-bold mb-0 text-truncate" title="SSC Marksheet">SSC Marksheet</h6>
                                            <small className="text-muted d-block mb-1">
                                                Max 100 KB
                                                {sscSizeKB && (
                                                    <span className={`ms-2 badge ${pendingSscFile ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                        {pendingSscFile ? `Pending: ${sscSizeKB} KB` : `${sscSizeKB} KB`}
                                                    </span>
                                                )}
                                            </small>

                                            <div className="d-flex flex-wrap gap-1 align-items-center">
                                                <label className={`btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 mb-0 ${uploadingSsc ? 'disabled' : ''}`} style={{ cursor: uploadingSsc ? 'not-allowed' : 'pointer', fontSize: '0.75rem' }}>
                                                    <FaFileAlt />
                                                    {uploadingSsc ? 'Uploading...' : ((pendingSscPreview || formData.sscMarksheet) ? 'Change' : 'Select')}
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
                                                        style={{ fontSize: '0.75rem' }}
                                                        className="d-inline-flex align-items-center gap-1 px-2"
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                )}

                                                {formData.sscMarksheet && !pendingSscPreview && (
                                                    <a
                                                        href={formData.sscMarksheet}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ fontSize: '0.75rem' }}
                                                        className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 px-2"
                                                    >
                                                        <FaExternalLinkAlt /> View
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {pendingSscFile ? (
                                            <small className="text-warning fw-semibold d-flex align-items-center gap-1">
                                                <FaInfoCircle /> Selected &mdash; uploads on Save
                                            </small>
                                        ) : formData.sscMarksheet ? (
                                            <small className="text-success d-flex align-items-center gap-1">
                                                <FaCheckCircle /> Saved SSC Marksheet
                                            </small>
                                        ) : (
                                            <small className="text-muted">No document uploaded</small>
                                        )}
                                    </div>
                                </div>
                            </Col>

                            {/* HSC Marksheet */}
                            <Col md={4}>
                                <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <div style={{ position: 'relative' }}>
                                            {(pendingHscPreview || formData.hscMarksheet) ? (
                                                <img
                                                    src={pendingHscPreview || formData.hscMarksheet}
                                                    alt="HSC Marksheet"
                                                    style={{
                                                        width: '85px',
                                                        height: '65px',
                                                        borderRadius: '6px',
                                                        objectFit: 'contain',
                                                        backgroundColor: '#f1f3f5',
                                                        border: pendingHscFile ? '2px solid #ffc107' : '2px solid #0d6efd',
                                                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => window.open(pendingHscPreview || formData.hscMarksheet, '_blank')}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '85px',
                                                        height: '65px',
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
                                                    <span style={{ fontSize: '0.6rem' }}>No HSC</span>
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
                                            <h6 className="fw-bold mb-0 text-truncate" title="HSC Marksheet">HSC Marksheet</h6>
                                            <small className="text-muted d-block mb-1">
                                                Max 100 KB
                                                {hscSizeKB && (
                                                    <span className={`ms-2 badge ${pendingHscFile ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                        {pendingHscFile ? `Pending: ${hscSizeKB} KB` : `${hscSizeKB} KB`}
                                                    </span>
                                                )}
                                            </small>

                                            <div className="d-flex flex-wrap gap-1 align-items-center">
                                                <label className={`btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 mb-0 ${uploadingHsc ? 'disabled' : ''}`} style={{ cursor: uploadingHsc ? 'not-allowed' : 'pointer', fontSize: '0.75rem' }}>
                                                    <FaFileAlt />
                                                    {uploadingHsc ? 'Uploading...' : ((pendingHscPreview || formData.hscMarksheet) ? 'Change' : 'Select')}
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
                                                        style={{ fontSize: '0.75rem' }}
                                                        className="d-inline-flex align-items-center gap-1 px-2"
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                )}

                                                {formData.hscMarksheet && !pendingHscPreview && (
                                                    <a
                                                        href={formData.hscMarksheet}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ fontSize: '0.75rem' }}
                                                        className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 px-2"
                                                    >
                                                        <FaExternalLinkAlt /> View
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {pendingHscFile ? (
                                            <small className="text-warning fw-semibold d-flex align-items-center gap-1">
                                                <FaInfoCircle /> Selected &mdash; uploads on Save
                                            </small>
                                        ) : formData.hscMarksheet ? (
                                            <small className="text-success d-flex align-items-center gap-1">
                                                <FaCheckCircle /> Saved HSC Marksheet
                                            </small>
                                        ) : (
                                            <small className="text-muted">No document uploaded</small>
                                        )}
                                    </div>
                                </div>
                            </Col>

                            {/* University ID / Admission Slip */}
                            <Col md={4}>
                                <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <div style={{ position: 'relative' }}>
                                            {(pendingUniIdPreview || formData.universityIdCard) ? (
                                                <img
                                                    src={pendingUniIdPreview || formData.universityIdCard}
                                                    alt="University ID / Admission Slip"
                                                    style={{
                                                        width: '85px',
                                                        height: '65px',
                                                        borderRadius: '6px',
                                                        objectFit: 'contain',
                                                        backgroundColor: '#f1f3f5',
                                                        border: pendingUniIdFile ? '2px solid #ffc107' : '2px solid #0d6efd',
                                                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => window.open(pendingUniIdPreview || formData.universityIdCard, '_blank')}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '85px',
                                                        height: '65px',
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
                                            <h6 className="fw-bold mb-0 text-truncate" title="University ID / Admission Slip">Uni ID / Slip</h6>
                                            <small className="text-muted d-block mb-1">
                                                Max 100 KB
                                                {uniIdSizeKB && (
                                                    <span className={`ms-2 badge ${pendingUniIdFile ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                        {pendingUniIdFile ? `Pending: ${uniIdSizeKB} KB` : `${uniIdSizeKB} KB`}
                                                    </span>
                                                )}
                                            </small>

                                            <div className="d-flex flex-wrap gap-1 align-items-center">
                                                <label className={`btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 mb-0 ${uploadingUniId ? 'disabled' : ''}`} style={{ cursor: uploadingUniId ? 'not-allowed' : 'pointer', fontSize: '0.75rem' }}>
                                                    <FaGraduationCap />
                                                    {uploadingUniId ? 'Uploading...' : ((pendingUniIdPreview || formData.universityIdCard) ? 'Change' : 'Select')}
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
                                                        style={{ fontSize: '0.75rem' }}
                                                        className="d-inline-flex align-items-center gap-1 px-2"
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                )}

                                                {formData.universityIdCard && !pendingUniIdPreview && (
                                                    <a
                                                        href={formData.universityIdCard}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ fontSize: '0.75rem' }}
                                                        className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 px-2"
                                                    >
                                                        <FaExternalLinkAlt /> View
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {pendingUniIdFile ? (
                                            <small className="text-warning fw-semibold d-flex align-items-center gap-1">
                                                <FaInfoCircle /> Selected &mdash; uploads on Save
                                            </small>
                                        ) : formData.universityIdCard ? (
                                            <small className="text-success d-flex align-items-center gap-1">
                                                <FaCheckCircle /> Saved Uni ID / Slip
                                            </small>
                                        ) : (
                                            <small className="text-muted">No document uploaded</small>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        </Row>

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
                                    {uploadingPhoto || uploadingNid ? 'Uploading images...' : 'Saving...'}
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
