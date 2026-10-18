import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card, Badge, Spinner, Pagination, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
    FaEdit, FaTrashAlt, FaChevronLeft, FaChevronRight, FaSearch, 
    FaGlobe, FaGooglePlay, FaUndo, FaCopy, FaCheckCircle, 
    FaClock, FaCalendarAlt, FaComments, FaHistory, FaTimesCircle,
    FaClipboardList, FaUserTimes, FaBell, FaInfoCircle, FaExclamationCircle
} from 'react-icons/fa';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import LoadingCard from '../components/modals/LoadingCard';
import TuitionDetailsModal from '../components/modals/TuitionDetailsModal';
import CustomErrorModal from '../components/modals/CustomErrorModal';
import TeacherDetailsModal, { formatTeacherCvText } from '../components/modals/TeacherDetailsModal';
import { usePublicSettings } from '../context/PublicSettingsContext';

const CANCEL_CATEGORIES = [
    'Salary Issue',
    'Location/Distance Issue',
    'Time/Day Schedule Mismatch',
    'Subject Issue',
    'Teacher Personal/Family Issue',
    'Teacher Exams/Busy',
    'Guardian No Response',
    'Guardian Behavior Issue',
    'Teacher Not Interested',
    'Teacher Demand Not Met',
    'Others'
];

const TuitionApplyCancelledPage = () => {
    const [tuitionList, setTuitionList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [togglingDoneId, setTogglingDoneId] = useState(null);
    const [copyingCvId, setCopyingCvId] = useState(null);
    const [role] = useState(localStorage.getItem('role') || '');

    // Search & Filter State
    const [searchInputs, setSearchInputs] = useState({
        tuitionCode: '',
        premiumCode: '',
        phone: '',
        followUpFilter: '', // '', 'pending', 'done'
        cancelCategory: '',
        dueToday: false
    });
    const [appliedFilters, setAppliedFilters] = useState({
        tuitionCode: '',
        premiumCode: '',
        phone: '',
        followUpFilter: '',
        cancelCategory: '',
        dueToday: false
    });

    // Due Today Alert State
    const [dueTodayList, setDueTodayList] = useState([]);
    const [showDueModal, setShowDueModal] = useState(false);
    const [openedFromDueModal, setOpenedFromDueModal] = useState(false);
    const [openedFromDueModalForEdit, setOpenedFromDueModalForEdit] = useState(false);

    // Follow Up Modal State
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [selectedApplyForFollowUp, setSelectedApplyForFollowUp] = useState(null);
    const [followUpFormData, setFollowUpFormData] = useState({
        followUpDate: '',
        followUpComment: '',
        cancelCategory: '',
        isFollowUpDone: false
    });
    const [savingFollowUp, setSavingFollowUp] = useState(false);

    // Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [isFullEditEnabled, setIsFullEditEnabled] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [tuitionData, setTuitionData] = useState({
        tuitionCode: '',
        tuitionId: '',
        premiumCode: '',
        name: '',
        phone: '',
        institute: '',
        department: '',
        academicYear: '',
        address: '',
        status: 'cancelled by teacher',
        comment: '',
        commentForTeacher: '',
        agentComment: '',
        followUpDate: '',
        followUpComment: '',
        cancelCategory: '',
        isFollowUpDone: false
    });

    // Modals
    const [detailsModalShow, setDetailsModalShow] = useState(false);
    const [tuitionDetails, setTuitionDetails] = useState(null);
    const [fetchingDetails, setFetchingDetails] = useState(false);
    const [selectedTeacherForModal, setSelectedTeacherForModal] = useState(null);
    const [showTeacherDetailsModal, setShowTeacherDetailsModal] = useState(false);
    const [fetchingTeacherCode, setFetchingTeacherCode] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Status History Modal
    const [showStatusHistoryModal, setShowStatusHistoryModal] = useState(false);
    const [statusHistoryList, setStatusHistoryList] = useState([]);
    const [statusHistoryLoading, setStatusHistoryLoading] = useState(false);
    const [statusHistoryTarget, setStatusHistoryTarget] = useState({ id: null, name: '' });

    // Comment Conversation Modal (Teacher or Agent)
    const [commentModalData, setCommentModalData] = useState({
        show: false,
        title: 'Comment For Teacher',
        label: 'Message for Teacher:',
        comment: '',
        name: '',
        phone: '',
        tuitionCode: '',
        premiumCode: ''
    });

    const handleOpenCommentModal = (item, type = 'teacher') => {
        const isAgent = type === 'agent';
        setCommentModalData({
            show: true,
            title: isAgent ? 'Agent Comment' : 'Comment For Teacher',
            label: isAgent ? 'Agent Internal Comment / Notes:' : 'Message for Teacher:',
            comment: isAgent ? (item.agentComment || '') : (item.commentForTeacher || ''),
            name: item.name || '',
            phone: item.phone || '',
            tuitionCode: item.tuitionCode || '',
            premiumCode: item.premiumCode || ''
        });
    };

    const { whatsappNumber } = usePublicSettings();

    const bannedStyle = { backgroundColor: '#000000', color: '#ffffff' };
    const spamStyle = { backgroundColor: '#dc3545', color: 'white' };
    const bestStyle = { backgroundColor: '#007bff', color: 'white' };
    const manualExpressStyle = { backgroundColor: '#28a745', color: 'white' };
    const dueStyle = { backgroundColor: '#FFFF00', color: 'black' };

    const getRowStyle = (item) => {
        if (item.isBanned) return bannedStyle;
        if (item.isSpam) return spamStyle;
        if (item.hasDue || item.hasScDue) return dueStyle;
        if (item.isBest) return bestStyle;
        if (item.isExpress) return manualExpressStyle;
        return {};
    };

    const formatDateInput = (dateStr) => {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return '';
            return new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Asia/Dhaka',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).format(d);
        } catch {
            return '';
        }
    };

    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return String(dateStr);
            return d.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                timeZone: 'Asia/Dhaka'
            });
        } catch {
            return String(dateStr);
        }
    };

    // appliedAt is stored with Bangladesh time in its UTC component (matching TuitionApplyPage)
    const formatAppliedAt = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return String(dateStr);
            return d.toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'UTC'
            });
        } catch {
            return String(dateStr);
        }
    };

    // Standard UTC timestamps (like StatusHistory Date.now) formatted in Bangladesh time
    const formatLogTimestamp = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return String(dateStr);
            return d.toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Dhaka'
            });
        } catch {
            return String(dateStr);
        }
    };

    const formatCancelledAt = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return String(dateStr);
            return d.toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Dhaka'
            });
        } catch {
            return String(dateStr);
        }
    };

    const getFollowUpStatusInfo = (followUpDateStr, isFollowUpDone) => {
        if (!followUpDateStr) return null;
        if (isFollowUpDone) {
            return { type: 'done', label: 'Done', diffDays: 0 };
        }

        const targetDateStr = formatDateInput(followUpDateStr); // YYYY-MM-DD in Asia/Dhaka
        if (!targetDateStr) return null;

        const todayDateStr = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Dhaka',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date());

        const dTarget = new Date(`${targetDateStr}T00:00:00+06:00`);
        const dToday = new Date(`${todayDateStr}T00:00:00+06:00`);
        const diffTime = dToday.getTime() - dTarget.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return {
                type: 'due_today',
                label: 'Due Today',
                diffDays: 0
            };
        } else if (diffDays > 0) {
            return {
                type: 'overdue',
                label: diffDays === 1 ? 'Overdue by 1 day' : `Overdue by ${diffDays} days`,
                diffDays
            };
        } else {
            const upcomingDays = Math.abs(diffDays);
            return {
                type: 'upcoming',
                label: upcomingDays === 1 ? 'Due Tomorrow' : `Due in ${upcomingDays} days`,
                diffDays
            };
        }
    };

    const isDateTodayOrPast = (dateStr) => {
        if (!dateStr) return false;
        try {
            const inputDateBD = formatDateInput(dateStr);
            if (!inputDateBD) return false;
            const todayBD = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Asia/Dhaka',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).format(new Date());
            return inputDateBD <= todayBD;
        } catch {
            return false;
        }
    };

    const fetchRecords = async (page = 1, filtersOverride = null) => {
        const filters = filtersOverride || appliedFilters;
        setLoading(true);
        try {
            const params = {
                page,
                tuitionCode: (filters.tuitionCode || '').trim(),
                premiumCode: (filters.premiumCode || '').trim(),
                phone: (filters.phone || '').trim(),
                status: 'cancelled by teacher'
            };

            if (filters.followUpFilter === 'pending') {
                params.isFollowUpDone = 'false';
            } else if (filters.followUpFilter === 'done') {
                params.isFollowUpDone = 'true';
            }

            if (filters.cancelCategory) {
                params.cancelCategory = filters.cancelCategory;
            }

            if (filters.dueToday) {
                params.dueToday = 'true';
            }

            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/tuitionApply/getTableData', { params });
            const data = Array.isArray(response.data?.data) ? response.data.data : [];
            setTuitionList(data);
            setFilteredList(data);
            setCurrentPage(response.data?.currentPage || page);
            setTotalPages(Math.max(1, response.data?.totalPages || 1));
            setTotalRecords(response.data?.totalRecords || data.length);
        } catch (err) {
            console.error('Error fetching cancelled records:', err);
            toast.error('Failed to load cancelled teacher records.');
        } finally {
            setLoading(false);
        }
    };

    const fetchDueTodayAlert = async () => {
        try {
            const res = await axios.get('https://tuition-seba-backend-1.onrender.com/api/tuitionApply/alert-today');
            setDueTodayList(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Error fetching due today alert:', err);
        }
    };

    const handleToggleDueToday = () => {
        const nextVal = !appliedFilters.dueToday;
        const newFilters = { ...appliedFilters, dueToday: nextVal };
        setSearchInputs(prev => ({ ...prev, dueToday: nextVal }));
        setAppliedFilters(newFilters);
        setCurrentPage(1);
        fetchRecords(1, newFilters);
    };

    useEffect(() => {
        fetchRecords(1);
        fetchDueTodayAlert();
    }, []);

    const handleSearch = () => {
        setAppliedFilters(searchInputs);
        setCurrentPage(1);
        fetchRecords(1, searchInputs);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const handleReset = () => {
        const resetFilters = {
            tuitionCode: '',
            premiumCode: '',
            phone: '',
            followUpFilter: '',
            cancelCategory: '',
            dueToday: false
        };
        setSearchInputs(resetFilters);
        setAppliedFilters(resetFilters);
        setCurrentPage(1);
        fetchRecords(1, resetFilters);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            fetchRecords(newPage, appliedFilters);
        }
    };

    // Quick toggle for isFollowUpDone directly in table row
    const handleQuickToggleFollowUpDone = async (item) => {
        const targetId = item._id;
        setTogglingDoneId(targetId);
        const nextVal = !item.isFollowUpDone;
        const currentUsername = localStorage.getItem('username') || '';
        const payload = {
            isFollowUpDone: nextVal,
            followUpTakenBy: nextVal 
                ? (item.followUpTakenBy || currentUsername) 
                : (item.followUpTakenBy || '')
        };

        try {
            const res = await axios.put(`https://tuition-seba-backend-1.onrender.com/api/tuitionApply/edit/${targetId}`, payload);
            const updated = res.data;

            // 1. Optimistic update in table lists
            setFilteredList(prev => prev.map(t => String(t._id) === String(targetId) ? { ...t, ...payload, ...updated } : t));
            setTuitionList(prev => prev.map(t => String(t._id) === String(targetId) ? { ...t, ...payload, ...updated } : t));

            // 2. Optimistic update in Due Today list
            setDueTodayList(prev => {
                if (nextVal) {
                    return prev.filter(t => String(t._id) !== String(targetId));
                } else if (isDateTodayOrPast(item.followUpDate)) {
                    return prev.map(t => String(t._id) === String(targetId) ? { ...t, ...payload, ...updated } : t);
                }
                return prev;
            });

            toast.success(nextVal ? 'Marked follow-up as DONE!' : 'Unmarked follow-up as pending.');

            // 3. Re-fetch both table records and alert list in parallel
            await Promise.all([
                fetchRecords(currentPage, appliedFilters),
                fetchDueTodayAlert()
            ]);
        } catch (err) {
            console.error('Error toggling follow-up done:', err);
            toast.error('Failed to update follow-up status.');
        } finally {
            setTogglingDoneId(null);
        }
    };

    // Open dedicated Follow Up modal
    const handleOpenFollowUpModal = (item, fromDueModal = false) => {
        setSelectedApplyForFollowUp(item);
        setFollowUpFormData({
            followUpDate: formatDateInput(item.followUpDate),
            followUpComment: item.followUpComment || '',
            cancelCategory: item.cancelCategory || '',
            isFollowUpDone: !!item.isFollowUpDone,
            followUpTakenBy: item.followUpTakenBy || ''
        });
        setOpenedFromDueModal(fromDueModal);
        if (fromDueModal) {
            setShowDueModal(false);
        }
        setShowFollowUpModal(true);
    };

    const handleCloseFollowUpModal = () => {
        setShowFollowUpModal(false);
        if (openedFromDueModal) {
            setShowDueModal(true);
            setOpenedFromDueModal(false);
        }
    };

    // Save Follow Up changes from modal
    const handleSaveFollowUp = async () => {
        if (!selectedApplyForFollowUp) return;
        setSavingFollowUp(true);
        const targetId = selectedApplyForFollowUp._id;
        try {
            const currentUsername = localStorage.getItem('username') || '';
            const payload = {
                followUpDate: followUpFormData.followUpDate || null,
                followUpComment: followUpFormData.followUpComment || '',
                cancelCategory: followUpFormData.cancelCategory || '',
                isFollowUpDone: followUpFormData.isFollowUpDone,
                followUpTakenBy: followUpFormData.isFollowUpDone 
                    ? (followUpFormData.followUpTakenBy || currentUsername) 
                    : (followUpFormData.followUpTakenBy || '')
            };

            const res = await axios.put(`https://tuition-seba-backend-1.onrender.com/api/tuitionApply/edit/${targetId}`, payload);
            const updated = res.data;

            // 1. Optimistic update in table lists
            setFilteredList(prev => prev.map(t => String(t._id) === String(targetId) ? { ...t, ...payload, ...updated } : t));
            setTuitionList(prev => prev.map(t => String(t._id) === String(targetId) ? { ...t, ...payload, ...updated } : t));

            // 2. Optimistic update in Due Today list
            const isStillDue = !payload.isFollowUpDone && isDateTodayOrPast(payload.followUpDate);
            setDueTodayList(prev => {
                if (!isStillDue) {
                    return prev.filter(t => String(t._id) !== String(targetId));
                }
                return prev.map(t => String(t._id) === String(targetId) ? { ...t, ...payload, ...updated } : t);
            });

            toast.success('Follow-up details saved successfully!');
            setShowFollowUpModal(false);

            // Re-open due modal if follow-up was initiated from it
            if (openedFromDueModal) {
                setShowDueModal(true);
                setOpenedFromDueModal(false);
            }

            // 3. Re-fetch both table records and alert list in parallel
            await Promise.all([
                fetchRecords(currentPage, appliedFilters),
                fetchDueTodayAlert()
            ]);
        } catch (err) {
            console.error('Error saving follow-up:', err);
            toast.error(err.response?.data?.message || 'Failed to save follow-up details.');
        } finally {
            setSavingFollowUp(false);
        }
    };

    // Full Edit record
    const handleEditTuition = (item, fromDueModal = false) => {
        setTuitionData({
            ...item,
            followUpDate: formatDateInput(item.followUpDate),
            followUpComment: item.followUpComment || '',
            cancelCategory: item.cancelCategory || '',
            isFollowUpDone: !!item.isFollowUpDone,
            followUpTakenBy: item.followUpTakenBy || ''
        });
        setEditingId(item._id);
        setIsFullEditEnabled(false);
        setOpenedFromDueModalForEdit(fromDueModal);
        if (fromDueModal) {
            setShowDueModal(false);
        }
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        if (openedFromDueModalForEdit) {
            setShowDueModal(true);
            setOpenedFromDueModalForEdit(false);
        }
    };

    const handleSaveFullEdit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const targetId = editingId;
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...tuitionData,
                followUpDate: tuitionData.followUpDate || null
            };

            const res = await axios.put(`https://tuition-seba-backend-1.onrender.com/api/tuitionApply/edit/${targetId}`, payload, {
                headers: { Authorization: token }
            });
            const updated = res.data;

            // 1. Optimistic update in table lists
            setFilteredList(prev => prev.map(t => String(t._id) === String(targetId) ? { ...t, ...payload, ...updated } : t));
            setTuitionList(prev => prev.map(t => String(t._id) === String(targetId) ? { ...t, ...payload, ...updated } : t));

            // 2. Optimistic update in Due Today list
            const isStillDue = !payload.isFollowUpDone && isDateTodayOrPast(payload.followUpDate);
            setDueTodayList(prev => {
                if (!isStillDue) {
                    return prev.filter(t => String(t._id) !== String(targetId));
                }
                return prev.map(t => String(t._id) === String(targetId) ? { ...t, ...payload, ...updated } : t);
            });

            toast.success('Tuition application updated successfully!');
            setShowEditModal(false);

            if (openedFromDueModalForEdit) {
                setShowDueModal(true);
                setOpenedFromDueModalForEdit(false);
            }

            // 3. Re-fetch both table records and alert list in parallel
            await Promise.all([
                fetchRecords(currentPage, appliedFilters),
                fetchDueTodayAlert()
            ]);
        } catch (err) {
            console.error('Error updating tuition apply:', err);
            toast.error(err.response?.data?.message || 'Error updating record.');
        } finally {
            setSaving(false);
        }
    };

    // Delete record
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        setDeleting(true);
        try {
            await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/tuitionApply/delete/${id}`);

            // 1. Optimistic deletion in table lists and due list
            setFilteredList(prev => prev.filter(t => String(t._id) !== String(id)));
            setTuitionList(prev => prev.filter(t => String(t._id) !== String(id)));
            setDueTodayList(prev => prev.filter(t => String(t._id) !== String(id)));

            toast.success('Record deleted successfully!');

            // 2. Re-fetch both table records and alert list in parallel
            await Promise.all([
                fetchRecords(currentPage, appliedFilters),
                fetchDueTodayAlert()
            ]);
        } catch (err) {
            console.error('Error deleting record:', err);
            toast.error('Failed to delete record.');
        } finally {
            setDeleting(false);
        }
    };

    // Teacher Details modal helper
    const handleOpenTeacherDetails = async (premiumCode) => {
        if (!premiumCode) {
            toast.info('No premium code available.');
            return;
        }
        const clean = String(premiumCode).trim();
        setFetchingTeacherCode(clean);
        const token = localStorage.getItem('token');
        try {
            let teacher = null;
            try {
                const res = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/regTeacher/byPremiumCode/${encodeURIComponent(clean)}`, {
                    headers: { Authorization: token }
                });
                teacher = res.data;
            } catch {
                const res = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/regTeacher/getTableData`, {
                    params: { premiumCode: clean },
                    headers: { Authorization: token }
                });
                const list = res.data?.data || [];
                teacher = list.find(t => String(t.premiumCode).trim().toLowerCase() === clean.toLowerCase()) || list[0];
            }
            if (teacher) {
                setSelectedTeacherForModal(teacher);
                setShowTeacherDetailsModal(true);
            } else {
                toast.error(`No teacher details found for Code: ${clean}`);
            }
        } catch (e) {
            console.error('Error fetching teacher:', e);
            toast.error('Failed to load teacher details.');
        } finally {
            setFetchingTeacherCode(null);
        }
    };

    // Tuition details modal helper - matches TuitionApplyPage pattern
    const handleShowDetails = async (tuitionId, tuitionCode) => {
        if ((!tuitionId || tuitionId === 'admin_created') && !tuitionCode) {
            toast.info("No detailed tuition data available for this application.");
            return;
        }
        setFetchingDetails(true);
        try {
            let foundData = null;
            if (tuitionId && tuitionId !== 'admin_created') {
                try {
                    const response = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/tuition/${tuitionId}`);
                    if (response.data) {
                        foundData = response.data;
                    }
                } catch (e) {
                    console.warn('Failed to fetch by tuitionId, trying by tuitionCode:', e);
                }
            }
            if (!foundData && tuitionCode) {
                const response = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/tuition/byCodePublic?tuitionCode=${encodeURIComponent(String(tuitionCode).trim())}`);
                if (response.data) {
                    foundData = response.data;
                }
            }

            if (foundData) {
                setTuitionDetails(foundData);
                setDetailsModalShow(true);
            } else {
                toast.error("Tuition details not found.");
            }
        } catch (err) {
            console.error('Error fetching tuition details:', err);
            toast.error("Failed to fetch tuition details.");
        } finally {
            setFetchingDetails(false);
        }
    };

    const handleOpenTuitionDetails = (itemOrId, maybeCode) => {
        if (typeof itemOrId === 'object' && itemOrId !== null) {
            handleShowDetails(itemOrId.tuitionId, itemOrId.tuitionCode);
        } else {
            handleShowDetails(itemOrId, maybeCode || itemOrId);
        }
    };

    // Copy CV helper
    const handleCopyCv = async (item) => {
        if (!item.premiumCode) {
            toast.warn('No Teacher Code (premiumCode) available to copy CV.');
            return;
        }
        setCopyingCvId(item._id);
        const token = localStorage.getItem('token');
        try {
            let teacher = null;
            try {
                const res = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/regTeacher/byPremiumCode/${encodeURIComponent(item.premiumCode)}`, {
                    headers: { Authorization: token }
                });
                teacher = res.data;
            } catch {
                const res = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/regTeacher/getTableData`, {
                    params: { premiumCode: item.premiumCode },
                    headers: { Authorization: token }
                });
                const list = res.data?.data || [];
                teacher = list.find(t => String(t.premiumCode).trim().toLowerCase() === String(item.premiumCode).trim().toLowerCase()) || list[0];
            }

            if (!teacher) {
                toast.error(`No teacher record found for ${item.premiumCode}`);
                return;
            }

            const cvText = formatTeacherCvText(teacher, {
                tuitionCode: item.tuitionCode,
                whatsappNumber: whatsappNumber || '01633920928'
            });

            await navigator.clipboard.writeText(cvText);
            toast.success(`CV for Teacher ${item.premiumCode} copied to clipboard!`);
        } catch (err) {
            console.error('Failed to copy CV:', err);
            toast.error('Failed to copy teacher CV.');
        } finally {
            setCopyingCvId(null);
        }
    };

    // Status History
    const handleShowStatusHistory = async (module, id, name) => {
        setStatusHistoryTarget({ id, name });
        setShowStatusHistoryModal(true);
        setStatusHistoryLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/status-history/${module}/${id}`, {
                headers: { Authorization: token }
            });
            setStatusHistoryList(res.data || []);
        } catch (err) {
            console.error('Error fetching status history:', err);
            toast.error('Failed to load status history.');
        } finally {
            setStatusHistoryLoading(false);
        }
    };

    return (
        <>
            <NavBarPage />
            <Container>
                {/* Navigation Tabs */}
                <div className="mb-3 mt-0">
                    <div className="custom-pills">
                        <Link
                            to="/admin/tuitionApply"
                            className="nav-link"
                        >
                            <FaClipboardList /> All Applications
                        </Link>
                        <Link
                            to="/admin/tuitionApplyCancelled"
                            className="nav-link active"
                        >
                            <FaUserTimes /> Teacher Cancelled Follow-up
                        </Link>
                    </div>
                </div>

                <Header>
                    <h2 className="text-primary fw-bold">Teacher Cancelled Applications</h2>
                </Header>

                {/* Filters */}
                <Card className="mt-2 mb-3 border-0 shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '12px' }}>
                    <Card.Body className="p-3">
                        <Row className="g-2 align-items-end">
                            <Col md={2}>
                                <Form.Label className="fw-bold small mb-1">Tuition Code</Form.Label>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="e.g. TSF-1001"
                                    value={searchInputs.tuitionCode}
                                    onChange={(e) => setSearchInputs({ ...searchInputs, tuitionCode: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                />
                            </Col>

                            <Col md={2}>
                                <Form.Label className="fw-bold small mb-1">Teacher Code</Form.Label>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="e.g. T-1234"
                                    value={searchInputs.premiumCode}
                                    onChange={(e) => setSearchInputs({ ...searchInputs, premiumCode: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                />
                            </Col>

                            <Col md={2}>
                                <Form.Label className="fw-bold small mb-1">Phone</Form.Label>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="e.g. 017xxxxxxxx"
                                    value={searchInputs.phone}
                                    onChange={(e) => setSearchInputs({ ...searchInputs, phone: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                />
                            </Col>

                            <Col md={2}>
                                <Form.Label className="fw-bold small mb-1">Follow-up Status</Form.Label>
                                <Form.Select
                                    size="sm"
                                    value={searchInputs.followUpFilter}
                                    onChange={(e) => {
                                        const updated = { ...searchInputs, followUpFilter: e.target.value };
                                        setSearchInputs(updated);
                                        setAppliedFilters(updated);
                                        setCurrentPage(1);
                                        fetchRecords(1, updated);
                                    }}
                                >
                                    <option value="">All Follow-ups</option>
                                    <option value="pending">⏳ Pending Follow-up</option>
                                    <option value="done">✅ Follow-up Done</option>
                                </Form.Select>
                            </Col>

                            <Col md={3}>
                                <Form.Label className="fw-bold small mb-1">Cancel Category</Form.Label>
                                <Form.Select
                                    size="sm"
                                    value={searchInputs.cancelCategory}
                                    onChange={(e) => {
                                        const updated = { ...searchInputs, cancelCategory: e.target.value };
                                        setSearchInputs(updated);
                                        setAppliedFilters(updated);
                                        setCurrentPage(1);
                                        fetchRecords(1, updated);
                                    }}
                                >
                                    <option value="">All Cancel Categories</option>
                                    {CANCEL_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </Form.Select>
                            </Col>

                            <Col xs="auto" className="d-flex gap-1 align-items-end">
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={handleSearch}
                                    disabled={loading}
                                    title="Search"
                                    style={{ height: '31px', width: '36px' }}
                                    className="d-flex align-items-center justify-content-center"
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaSearch />}
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={handleReset}
                                    title="Reset"
                                    style={{ height: '31px', width: '36px' }}
                                    className="d-flex align-items-center justify-content-center"
                                >
                                    <FaUndo />
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Due Today Alert Bar (matching PaymentPage) */}
                <div className="d-flex align-items-center justify-content-center my-3">
                    <h5 className="me-3 d-flex align-items-center gap-2 mb-0">
                        <FaBell className="text-primary" />
                        <span>Due to follow up today: {dueTodayList.length}</span>
                        <Button 
                            size="sm" 
                            variant={appliedFilters.dueToday ? "warning" : "outline-primary"} 
                            onClick={handleToggleDueToday} 
                            className="ms-2"
                        >
                            <FaInfoCircle className="me-1" />
                            {appliedFilters.dueToday ? "Showing Today (Click to Reset)" : "Filter Today"}
                        </Button>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-due">Click to see details modal</Tooltip>}
                        >
                            <Button size="sm" variant="outline-secondary" onClick={() => setShowDueModal(true)} className="ms-1">
                                View Modal
                            </Button>
                        </OverlayTrigger>
                    </h5>
                </div>

                {/* Table Card */}
                <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                    <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="fw-bold text-dark mb-0">
                                Total Cancelled Records: <span className="text-danger">{totalRecords}</span>
                            </h6>
                            <span className="text-muted small">
                                Showing page {currentPage} of {totalPages}
                            </span>
                        </div>

                        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            <Table bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th style={{ width: '40px', minWidth: '40px' }} className="text-center">SL</th>
                                        <th style={{ width: '105px', minWidth: '105px' }}>Cancelled At</th>
                                        <th style={{ width: '95px', minWidth: '95px' }}>Follow-up Date</th>
                                        <th style={{ width: '50px', minWidth: '50px' }} className="text-center">Done?</th>
                                        <th style={{ width: '130px', minWidth: '125px' }}>Cancel Category</th>
                                        <th style={{ width: '85px', minWidth: '80px' }}>Updated By</th>
                                        <th style={{ minWidth: '90px' }}>Teacher Code</th>
                                        <th style={{ minWidth: '80px' }}>Tuition Code</th>
                                        <th style={{ minWidth: '105px' }}>Name & Phone</th>
                                        <th style={{ minWidth: '100px', maxWidth: '125px' }}>Institute / Dept</th>
                                        <th style={{ minWidth: '65px', maxWidth: '85px' }}>Comment</th>
                                        <th style={{ minWidth: '110px', maxWidth: '140px' }}>Comment For Teacher</th>
                                        <th style={{ minWidth: '110px', maxWidth: '140px' }}>Agent Comment</th>
                                        <th style={{ minWidth: '90px', maxWidth: '120px' }}>Follow-up Comment</th>
                                        <th style={{ width: '115px', minWidth: '115px', position: 'sticky', right: 0, zIndex: 3, backgroundColor: '#cfe2ff' }} className="text-center sticky-action-col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="15" className="text-center py-5">
                                                <Spinner animation="border" variant="danger" />
                                                <div className="text-muted small mt-2">Loading cancelled teacher records...</div>
                                            </td>
                                        </tr>
                                    ) : filteredList.length === 0 ? (
                                        <tr>
                                            <td colSpan="15" className="text-center py-5 text-muted fw-bold">
                                                No cancelled applications found.
                                            </td>
                                        </tr>
                                    ) : (
                                    filteredList.map((item, index) => {
                                        const isDue = !item.isFollowUpDone && isDateTodayOrPast(item.followUpDate);
                                        const rowStyle = getRowStyle(item);
                                        const activeRowType = item.isBanned ? 'banned' 
                                            : item.isSpam ? 'spam' 
                                            : (item.hasDue || item.hasScDue) ? 'due' 
                                            : item.isBest ? 'best' 
                                            : item.isExpress ? 'express' 
                                            : 'default';
                                        const isDarkBg = activeRowType === 'banned' || activeRowType === 'spam' || activeRowType === 'best' || activeRowType === 'express';
                                        const isDueBg = activeRowType === 'due';
                                        const linkColor = isDueBg ? '#000' : (isDarkBg ? '#fff' : '#0d6efd');
                                        const textColor = isDarkBg ? '#fff' : '#000';
                                        const subTextColor = isDarkBg ? 'rgba(255,255,255,0.85)' : (isDueBg ? '#212529' : '#6c757d');

                                        return (
                                            <tr key={item._id} className={(!isDarkBg && !isDueBg && item.isFollowUpDone) ? 'table-light' : ''}>
                                                <td style={{ ...rowStyle, width: '40px', minWidth: '40px', color: textColor, padding: '4px 2px' }} className="text-center fw-bold">
                                                    {(currentPage - 1) * 50 + index + 1} {item.isBanned && <span title="Banned">🚫</span>} {item.isBest && <span title="Best">⭐</span>}
                                                    <div>
                                                        {item.isAppApply ? (
                                                            <span className="badge bg-success" style={{ fontSize: '0.6rem' }}>
                                                                <FaGooglePlay className="me-1" />App
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-primary" style={{ fontSize: '0.6rem' }}>
                                                                <FaGlobe className="me-1" />Web
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td style={{ ...rowStyle, color: textColor, whiteSpace: 'nowrap', width: '105px', minWidth: '105px', padding: '4px 4px' }}>
                                                    <div style={{ lineHeight: '1.2' }}>
                                                        {item.cancelledAt && (
                                                            <div style={{ fontSize: '0.73rem' }}>
                                                                <span style={{ fontWeight: '700', color: isDarkBg ? '#ff8585' : '#dc3545' }}>Cancelled: </span>
                                                                <span className="fw-bold">{formatCancelledAt(item.cancelledAt)}</span>
                                                            </div>
                                                        )}
                                                        {item.appliedAt && (
                                                            <div style={{ fontSize: '0.68rem', marginTop: '1px' }}>
                                                                <span style={{ fontWeight: '700', color: isDarkBg ? '#ffeb3b' : '#0d6efd' }}>Applied: </span>
                                                                <span style={{ fontWeight: '500', color: isDarkBg ? 'rgba(255,255,255,0.95)' : '#495057' }}>
                                                                    {formatAppliedAt(item.appliedAt)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {!item.cancelledAt && !item.appliedAt && (
                                                            <span className="text-muted small">-</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Follow Up Date */}
                                                <td style={{ ...rowStyle, whiteSpace: 'nowrap' }}>
                                                    {item.followUpDate ? (() => {
                                                        const statusInfo = getFollowUpStatusInfo(item.followUpDate, item.isFollowUpDone);
                                                        if (!statusInfo) return formatDateDisplay(item.followUpDate);

                                                        return (
                                                            <div className="d-flex flex-column align-items-center gap-1">
                                                                {/* Scheduled Date Display */}
                                                                <span className="fw-bold" style={{ fontSize: '0.8rem', color: isDarkBg ? '#fff' : '#212529' }}>
                                                                    <FaCalendarAlt className="me-1 opacity-75" />
                                                                    {formatDateDisplay(item.followUpDate)}
                                                                </span>

                                                                {/* Urgency Badge */}
                                                                {statusInfo.type === 'due_today' && (
                                                                    <span 
                                                                        className="badge bg-warning text-dark px-2 py-1 shadow-sm d-flex align-items-center gap-1"
                                                                        style={{ fontSize: '0.7rem', fontWeight: '700' }}
                                                                    >
                                                                        <FaBell className="text-danger" /> Due Today
                                                                    </span>
                                                                )}
                                                                {statusInfo.type === 'overdue' && (
                                                                    <span 
                                                                        className="badge bg-danger text-white px-2 py-1 shadow-sm d-flex align-items-center gap-1"
                                                                        style={{ fontSize: '0.7rem', fontWeight: '700' }}
                                                                    >
                                                                        <FaExclamationCircle /> Overdue by {statusInfo.diffDays}d
                                                                    </span>
                                                                )}
                                                                {statusInfo.type === 'upcoming' && (
                                                                    <span 
                                                                        className="badge bg-info-subtle text-primary border border-info-subtle px-2 py-1 d-flex align-items-center gap-1"
                                                                        style={{ fontSize: '0.68rem', fontWeight: '600' }}
                                                                    >
                                                                        <FaClock /> {statusInfo.label}
                                                                    </span>
                                                                )}
                                                                {statusInfo.type === 'done' && (
                                                                    <span 
                                                                        className="badge bg-secondary text-white px-2 py-1 d-flex align-items-center gap-1"
                                                                        style={{ fontSize: '0.68rem' }}
                                                                    >
                                                                        <FaCheckCircle /> Done
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })() : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>

                                                {/* Follow Up Done (Quick Toggle: Yes / No, and Taken By if present) */}
                                                <td style={{ ...rowStyle, width: '55px', minWidth: '55px', padding: '4px 2px' }} className="text-center">
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className={`btn btn-sm py-0 px-2 fw-bold border-0 ${
                                                                item.isFollowUpDone 
                                                                    ? 'btn-success text-white' 
                                                                    : 'btn-outline-danger'
                                                            }`}
                                                            style={{ fontSize: '0.72rem', borderRadius: '12px', minWidth: '38px' }}
                                                            onClick={() => handleQuickToggleFollowUpDone(item)}
                                                            disabled={togglingDoneId === item._id}
                                                            title={item.isFollowUpDone ? 'Click to unmark (set Pending)' : 'Click to mark Follow-up as Completed'}
                                                        >
                                                            {togglingDoneId === item._id ? (
                                                                <Spinner animation="border" size="sm" style={{ width: '10px', height: '10px' }} />
                                                            ) : (
                                                                item.isFollowUpDone ? 'Yes' : 'No'
                                                            )}
                                                        </button>
                                                    </div>
                                                    {item.followUpTakenBy ? (
                                                        <div style={{ fontSize: '0.72rem', marginTop: '2px', color: subTextColor }} title={`Follow-up taken by: ${item.followUpTakenBy}`}>
                                                            By: <span className="fw-semibold" style={{ color: textColor }}>{item.followUpTakenBy}</span>
                                                        </div>
                                                    ) : null}
                                                </td>

                                                {/* Cancel Category */}
                                                <td style={{ ...rowStyle, width: '130px', minWidth: '125px', padding: '4px 6px' }}>
                                                    {item.cancelCategory ? (
                                                        <Badge 
                                                            bg={item.isSpam ? 'dark' : 'danger'} 
                                                            className="text-wrap text-start fw-semibold" 
                                                            style={{ 
                                                                fontSize: '0.72rem', 
                                                                padding: '3px 6px', 
                                                                lineHeight: '1.25',
                                                                whiteSpace: 'normal',
                                                                wordBreak: 'break-word',
                                                                display: 'inline-block',
                                                                maxWidth: '100%'
                                                            }}
                                                        >
                                                            {item.cancelCategory}
                                                        </Badge>
                                                    ) : ''}
                                                </td>

                                                <td style={{ ...rowStyle, width: '85px', minWidth: '80px', whiteSpace: 'nowrap', color: textColor, padding: '4px 6px' }}>
                                                    {item.updatedBy || ''}
                                                </td>

                                                {/* Premium Code (Teacher Code) & Teacher Status */}
                                                <td style={rowStyle}>
                                                    <div>
                                                        <div>
                                                            {item.premiumCode ? (
                                                                <span
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        textDecoration: 'underline',
                                                                        fontWeight: '700',
                                                                        color: linkColor
                                                                    }}
                                                                    onClick={() => handleOpenTeacherDetails(item.premiumCode)}
                                                                    title={`Click to view Teacher Details (${item.premiumCode})`}
                                                                >
                                                                    {fetchingTeacherCode === item.premiumCode ? (
                                                                        <Spinner animation="border" size="sm" style={{ width: '11px', height: '11px' }} />
                                                                    ) : (
                                                                        item.premiumCode
                                                                    )}
                                                                </span>
                                                            ) : ''}
                                                        </div>
                                                        {item.regTeacherStatus && (
                                                            <div style={{ fontSize: '11px', color: subTextColor, marginTop: '2px', textTransform: 'capitalize', fontWeight: isDueBg ? '600' : 'normal' }}>
                                                                ({item.regTeacherStatus})
                                                            </div>
                                                        )}
                                                        {(item.hasDue || item.hasScDue) && (
                                                            <table 
                                                                className="table table-sm table-bordered mb-0 mt-1 shadow-sm" 
                                                                style={{ fontSize: '0.72rem', minWidth: '105px', backgroundColor: '#fff8db', borderColor: '#ffeeba' }}
                                                            >
                                                                <thead>
                                                                    <tr style={{ backgroundColor: '#ffdf7e', fontSize: '0.68rem' }} className="text-center">
                                                                        <th className="py-0 px-1 text-dark" style={{ backgroundColor: '#ffdf7e' }}>Due</th>
                                                                        <th className="py-0 px-1 text-dark" style={{ backgroundColor: '#ffdf7e' }}>Amount</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {item.hasDue && (
                                                                        <tr>
                                                                            <td className="py-0 px-1 fw-bold text-dark text-center" title="Tuition Charge Due" style={{ backgroundColor: '#fff8db' }}>
                                                                                TC{item.dueCount ? ` (${item.dueCount})` : ''}
                                                                            </td>
                                                                            <td className="py-0 px-1 text-end fw-bold text-danger" style={{ backgroundColor: '#fff8db' }}>৳{Number(item.dueAmount).toLocaleString()}</td>
                                                                        </tr>
                                                                    )}
                                                                    {item.hasScDue && (
                                                                        <tr>
                                                                            <td className="py-0 px-1 fw-bold text-dark text-center" title="Service Charge Due" style={{ backgroundColor: '#fff8db' }}>
                                                                                SC{item.scDueCount ? ` (${item.scDueCount})` : ''}
                                                                            </td>
                                                                            <td className="py-0 px-1 text-end fw-bold text-danger" style={{ backgroundColor: '#fff8db' }}>৳{Number(item.scDueAmount).toLocaleString()}</td>
                                                                        </tr>
                                                                    )}
                                                                    {item.hasDue && item.hasScDue && (
                                                                        <tr style={{ backgroundColor: '#ffe8a1', borderTop: '1.5px solid #deb887' }}>
                                                                            <td className="py-0 px-1 fw-bold text-dark text-center" title="Total Due Count" style={{ backgroundColor: '#ffe8a1' }}>
                                                                                ({(item.dueCount || 0) + (item.scDueCount || 0)})
                                                                            </td>
                                                                            <td className="py-0 px-1 text-end fw-bold text-danger" style={{ backgroundColor: '#ffe8a1' }}>
                                                                                ৳{Number((item.dueAmount || 0) + (item.scDueAmount || 0)).toLocaleString()}
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Tuition Code */}
                                                <td style={rowStyle}>
                                                    <div className="d-flex flex-column gap-1">
                                                        {item.tuitionCode ? (
                                                            <span
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    textDecoration: 'underline',
                                                                    fontWeight: '700',
                                                                    color: linkColor
                                                                }}
                                                                onClick={() => handleShowDetails(item.tuitionId, item.tuitionCode)}
                                                            >
                                                                {item.tuitionCode}
                                                            </span>
                                                        ) : ''}
                                                        {item.tuitionStatus && (
                                                            <span
                                                                className={`badge text-wrap ${item.tuitionStatus.toLowerCase() === 'available' ? 'bg-success blink-available' : 'bg-secondary'}`}
                                                                style={{
                                                                    fontSize: '0.7rem',
                                                                    maxWidth: 'fit-content',
                                                                    backgroundColor: item.tuitionStatus.toLowerCase() === 'available' ? '#198754' : (item.hasDue ? '#6c757d' : isDarkBg ? 'rgba(255,255,255,0.25)' : undefined),
                                                                    color: '#fff'
                                                                }}
                                                            >
                                                                {item.tuitionStatus}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Name & Phone */}
                                                <td style={rowStyle}>
                                                    <div className="fw-semibold" style={{ fontSize: '0.86rem', color: isDarkBg ? '#fff' : (isDueBg ? '#000' : '#0d6efd') }}>
                                                        {item.name || ''}
                                                    </div>
                                                    {item.phone && (
                                                        <div 
                                                            className="fw-bold" 
                                                            style={{ color: isDarkBg ? '#fff' : '#000', fontSize: '0.82rem', marginTop: '2px' }}
                                                        >
                                                            {item.phone}
                                                        </div>
                                                    )}
                                                </td>

                                                <td style={{ ...rowStyle, color: textColor, maxWidth: '125px', padding: '4px 4px' }}>
                                                    <div className="fw-semibold small">{item.institute || ''}</div>
                                                    <div style={{ fontSize: '0.72rem', color: subTextColor }}>
                                                        {item.department || ''} {item.academicYear ? `(${item.academicYear})` : ''}
                                                    </div>
                                                </td>

                                                {/* Comment */}
                                                <td style={{ ...rowStyle, color: textColor, maxWidth: '85px', padding: '4px 4px' }}>
                                                    <span className="small">{item.comment || ''}</span>
                                                </td>

                                                {/* Comment For Teacher */}
                                                <td style={{ ...rowStyle, color: textColor, minWidth: '110px', maxWidth: '140px', padding: '4px 4px' }}>
                                                    {item.commentForTeacher ? (
                                                        item.commentForTeacher.length > 45 ? (
                                                            <div className="small">
                                                                <span>{item.commentForTeacher.substring(0, 45)}...</span>
                                                                <Button
                                                                    variant="link"
                                                                    size="sm"
                                                                    className="p-0 ms-1 text-decoration-none d-inline-flex align-items-center"
                                                                    style={{
                                                                        fontSize: '0.72rem',
                                                                        fontWeight: '700',
                                                                        color: isDarkBg ? '#ffeb3b' : '#0d6efd',
                                                                        verticalAlign: 'baseline',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    onClick={() => handleOpenCommentModal(item, 'teacher')}
                                                                    title="Click to view full teacher comment"
                                                                >
                                                                    <FaInfoCircle className="me-1" size={12} />
                                                                    Info
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <span className="small">{item.commentForTeacher}</span>
                                                        )
                                                    ) : (
                                                        <span className="text-muted small">-</span>
                                                    )}
                                                </td>

                                                {/* Agent Comment */}
                                                <td style={{ ...rowStyle, color: textColor, minWidth: '110px', maxWidth: '140px', padding: '4px 4px' }}>
                                                    {item.agentComment ? (
                                                        item.agentComment.length > 45 ? (
                                                            <div className="small">
                                                                <span>{item.agentComment.substring(0, 45)}...</span>
                                                                <Button
                                                                    variant="link"
                                                                    size="sm"
                                                                    className="p-0 ms-1 text-decoration-none d-inline-flex align-items-center"
                                                                    style={{
                                                                        fontSize: '0.72rem',
                                                                        fontWeight: '700',
                                                                        color: isDarkBg ? '#ffeb3b' : '#0d6efd',
                                                                        verticalAlign: 'baseline',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    onClick={() => handleOpenCommentModal(item, 'agent')}
                                                                    title="Click to view full agent comment"
                                                                >
                                                                    <FaInfoCircle className="me-1" size={12} />
                                                                    Info
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <span className="small">{item.agentComment}</span>
                                                        )
                                                    ) : (
                                                        <span className="text-muted small">-</span>
                                                    )}
                                                </td>

                                                {/* Follow Up Comment */}
                                                <td style={{ ...rowStyle, maxWidth: '120px', padding: '4px 4px' }}>
                                                    {item.followUpComment ? (
                                                        <div className="small fw-semibold" style={{ color: textColor }}>
                                                            <FaComments className="me-1" style={{ color: isDarkBg ? '#fff' : (isDueBg ? '#000' : '#0d6efd') }} />
                                                            {item.followUpComment}
                                                        </div>
                                                    ) : ''}
                                                </td>

                                                {/* Actions: Edit, Follow Up and Delete (Icon Only, Sticky Right) */}
                                                <td 
                                                    style={{ 
                                                        ...rowStyle, 
                                                        whiteSpace: 'nowrap',
                                                        width: '115px',
                                                        minWidth: '115px',
                                                        position: 'sticky',
                                                        right: 0,
                                                        zIndex: 1,
                                                        backgroundColor: rowStyle.backgroundColor || '#ffffff',
                                                        padding: '4px 2px'
                                                    }} 
                                                    className="text-center sticky-action-col"
                                                >
                                                    <div className="d-flex align-items-center justify-content-center gap-1">
                                                        {/* Edit action button */}
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            className="d-inline-flex align-items-center justify-content-center p-0"
                                                            style={{ width: '31px', height: '31px' }}
                                                            onClick={() => handleEditTuition(item)}
                                                            title="Edit Record"
                                                        >
                                                            <FaEdit size={13} />
                                                        </Button>

                                                        {/* Follow Up action button */}
                                                        <Button
                                                            variant="warning"
                                                            size="sm"
                                                            className="d-inline-flex align-items-center justify-content-center p-0"
                                                            style={{ width: '31px', height: '31px' }}
                                                            onClick={() => handleOpenFollowUpModal(item)}
                                                            title="Follow Up"
                                                        >
                                                            <FaCalendarAlt size={13} />
                                                        </Button>

                                                        {/* Delete button */}
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            className="d-inline-flex align-items-center justify-content-center p-0"
                                                            style={{ width: '31px', height: '31px' }}
                                                            onClick={() => handleDelete(item._id)}
                                                            disabled={deleting}
                                                            title="Delete Record"
                                                        >
                                                            <FaTrashAlt size={13} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                    )}
                                </tbody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 pt-2 border-top gap-2">
                            <span className="text-muted small">
                                Page {currentPage} of {totalPages} ({totalRecords} records)
                            </span>
                            {totalPages > 1 && (
                                <Pagination size="sm" className="mb-0">
                                    <Pagination.Prev
                                        disabled={currentPage <= 1 || loading}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        <FaChevronLeft className="me-1" /> Prev
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
                                                    onClick={() => handlePageChange(page)}
                                                    disabled={loading}
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
                                        disabled={currentPage >= totalPages || loading}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        Next <FaChevronRight className="ms-1" />
                                    </Pagination.Next>
                                </Pagination>
                            )}
                        </div>
                    </Card.Body>
                </Card>

                {/* Dedicated Follow-Up Modal */}
                <Modal 
                    show={showFollowUpModal} 
                    onHide={handleCloseFollowUpModal}
                    centered
                >
                    <Modal.Header closeButton className="bg-warning text-dark">
                        <Modal.Title className="fw-bold fs-6">
                            <FaCalendarAlt className="me-2" />
                            Teacher Cancelled Follow-up: {selectedApplyForFollowUp?.tuitionCode}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedApplyForFollowUp && (
                            <div className="mb-3 p-2 bg-light rounded border">
                                <div className="small fw-bold text-dark">{selectedApplyForFollowUp.name} ({selectedApplyForFollowUp.premiumCode || 'No Code'})</div>
                                <div className="text-muted small">Phone: {selectedApplyForFollowUp.phone} | Tuition: {selectedApplyForFollowUp.tuitionCode}</div>
                            </div>
                        )}

                        <Form>
                            <Form.Group className="mb-3" controlId="followUpCancelCategory">
                                <Form.Label className="fw-bold small">Cancel Category</Form.Label>
                                <Form.Select
                                    value={followUpFormData.cancelCategory}
                                    onChange={(e) => setFollowUpFormData({ ...followUpFormData, cancelCategory: e.target.value })}
                                >
                                    <option value="">-- Select Cancel Category --</option>
                                    {CANCEL_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="followUpDate">
                                <Form.Label className="fw-bold small">Follow-up Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={followUpFormData.followUpDate}
                                    onChange={(e) => setFollowUpFormData({ ...followUpFormData, followUpDate: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="followUpComment">
                                <Form.Label className="fw-bold small">Follow-up Comment / Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter teacher feedback, why cancelled, or next steps..."
                                    value={followUpFormData.followUpComment}
                                    onChange={(e) => setFollowUpFormData({ ...followUpFormData, followUpComment: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="isFollowUpDoneCheckbox">
                                <Form.Check
                                    type="checkbox"
                                    id="follow-up-done-check"
                                    label="Mark as Follow-up Completed"
                                    className="fw-bold text-success"
                                    checked={followUpFormData.isFollowUpDone}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        const currentUsername = localStorage.getItem('username') || '';
                                        setFollowUpFormData(prev => ({
                                            ...prev,
                                            isFollowUpDone: checked,
                                            followUpTakenBy: checked ? (prev.followUpTakenBy || currentUsername) : prev.followUpTakenBy
                                        }));
                                    }}
                                />
                            </Form.Group>

                            {followUpFormData.isFollowUpDone && (
                                <Form.Group className="mb-2" controlId="followUpTakenBy">
                                    <Form.Label className="fw-bold small">Follow-up Taken By</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        placeholder="Username"
                                        value={followUpFormData.followUpTakenBy}
                                        onChange={(e) => setFollowUpFormData({ ...followUpFormData, followUpTakenBy: e.target.value })}
                                    />
                                </Form.Group>
                            )}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={handleCloseFollowUpModal}>
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            size="sm" 
                            className="fw-bold" 
                            onClick={handleSaveFollowUp}
                            disabled={savingFollowUp}
                        >
                            {savingFollowUp ? <Spinner animation="border" size="sm" /> : 'Save Follow-up'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Full Edit Modal */}
                <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg" centered>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="fs-6 fw-bold">Edit Tuition Application</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSaveFullEdit}>
                            <Row className="g-3">
                                <Col md={4}>
                                    <Form.Label className="fw-bold small">Tuition Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        value={tuitionData.tuitionCode}
                                        onChange={(e) => setTuitionData({ ...tuitionData, tuitionCode: e.target.value })}
                                        disabled={!isFullEditEnabled}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="fw-bold small">Teacher Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        value={tuitionData.premiumCode}
                                        onChange={(e) => setTuitionData({ ...tuitionData, premiumCode: e.target.value })}
                                        disabled={!isFullEditEnabled}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="fw-bold small">Applicant Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        value={tuitionData.name}
                                        onChange={(e) => setTuitionData({ ...tuitionData, name: e.target.value })}
                                        disabled={!isFullEditEnabled}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="fw-bold small">Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        value={tuitionData.phone}
                                        onChange={(e) => setTuitionData({ ...tuitionData, phone: e.target.value })}
                                        disabled={!isFullEditEnabled}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="fw-bold small">Status</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        value={tuitionData.status}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const updates = { status: val };
                                            if (val === 'cancelled by teacher') {
                                                updates.commentForTeacher = 'আপনি এই টিউশনটি নিতে পারবেন না বলে জানিয়েছেন। ভবিষ্যতে কোনো টিউশনে আবেদন করার আগে বেতন, সময়, লোকেশনসহ অন্যান্য বিষয় ভালোভাবে যাচাই করে নিশ্চিত হয়ে আবেদন করার অনুরোধ রইল। কোনো বিষয়ে পরিবর্তন বা আলোচনা প্রয়োজন হলে অনুগ্রহ করে কমেন্টস-এ উল্লেখ করবেন। অভিভাবক আপনার সিভি পছন্দ করার পর যেন আপনার পক্ষ থেকে টিউশনটি বাতিল করার প্রয়োজন না হয়, সেদিকে বিশেষভাবে খেয়াল রাখবেন। আপনার সহযোগিতা কামনা করছি। ধন্যবাদ।';
                                            } else if (val === 'cancelled by guardian') {
                                                updates.commentForTeacher = 'দুঃখিত, অভিভাবক আপনার সিভি পছন্দ করেনি। আমাদের অন্য এভেইলেবল টিউশনগুলোতে এপ্লাই করুন।';
                                            }
                                            setTuitionData({ ...tuitionData, ...updates });
                                        }}
                                    >
                                        <option value="cancelled by teacher">Cancelled By Teacher</option>
                                        <option value="cancelled by guardian">Cancelled By Guardian</option>
                                        <option value="pending">Pending</option>
                                        <option value="called (interested)">Called (Interested)</option>
                                        <option value="called (no response)">Called (No Response)</option>
                                        <option value="shortlisted">Shortlisted</option>
                                        <option value="selected">Selected</option>
                                        <option value="cancel">Cancelled</option>
                                    </Form.Select>
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="fw-bold small">Cancel Category</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        value={tuitionData.cancelCategory}
                                        onChange={(e) => setTuitionData({ ...tuitionData, cancelCategory: e.target.value })}
                                    >
                                        <option value="">-- None --</option>
                                        {CANCEL_CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="fw-bold small">Follow-up Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        size="sm"
                                        value={tuitionData.followUpDate}
                                        onChange={(e) => setTuitionData({ ...tuitionData, followUpDate: e.target.value })}
                                    />
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="fw-bold small">Follow-up Completed?</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        label="Mark as Follow-up Completed"
                                        className="mt-2 fw-bold text-success"
                                        checked={tuitionData.isFollowUpDone}
                                        onChange={(e) => setTuitionData({ ...tuitionData, isFollowUpDone: e.target.checked })}
                                    />
                                </Col>
                                <Col md={12}>
                                    <Form.Label className="fw-bold small">Follow-up Comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        size="sm"
                                        value={tuitionData.followUpComment}
                                        onChange={(e) => setTuitionData({ ...tuitionData, followUpComment: e.target.value })}
                                    />
                                </Col>
                                <Col md={12}>
                                    <Form.Label className="fw-bold small">Teacher Comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        size="sm"
                                        value={tuitionData.commentForTeacher}
                                        onChange={(e) => setTuitionData({ ...tuitionData, commentForTeacher: e.target.value })}
                                    />
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
                                <Button variant="secondary" size="sm" onClick={handleCloseEditModal}>
                                    Cancel
                                </Button>
                                <Button variant="primary" size="sm" type="submit" disabled={saving}>
                                    {saving ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Tuition Details Modal & Loading */}
                <LoadingCard show={fetchingDetails} message="Fetching tuition details..." />

                {detailsModalShow && tuitionDetails && !fetchingDetails && (
                    <TuitionDetailsModal
                        show={detailsModalShow}
                        onHide={() => setDetailsModalShow(false)}
                        detailsData={tuitionDetails}
                    />
                )}

                {/* Teacher Details Modal */}
                {selectedTeacherForModal && (
                    <TeacherDetailsModal
                        show={showTeacherDetailsModal}
                        onHide={() => {
                            setShowTeacherDetailsModal(false);
                            setSelectedTeacherForModal(null);
                        }}
                        teacher={selectedTeacherForModal}
                    />
                )}

                {/* Status History Modal */}
                <Modal show={showStatusHistoryModal} onHide={() => setShowStatusHistoryModal(false)} centered>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="fw-bold fs-6">Status History - {statusHistoryTarget.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-3">
                        {statusHistoryLoading ? (
                            <div className="text-center py-4">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : statusHistoryList.length === 0 ? (
                            <div className="text-center py-4 text-muted fw-bold">
                                No status history logged.
                            </div>
                        ) : (
                            <div className="timeline-container">
                                {statusHistoryList.map(log => (
                                    <div key={log._id} className="p-2 mb-2 border-start border-3 border-primary bg-light rounded">
                                        <div className="fw-bold text-dark small text-capitalize">
                                            {log.oldStatus || 'Creation'} &rarr; <span className="text-primary">{log.newStatus}</span>
                                        </div>
                                        <div className="text-secondary extra-small">
                                            By: <span className="badge bg-secondary">{log.changedBy}</span> | {formatLogTimestamp(log.timestamp)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Modal.Body>
                </Modal>

                {/* Conversation Modal for Comment for Teacher or Agent */}
                <Modal 
                    show={commentModalData.show} 
                    onHide={() => setCommentModalData(prev => ({ ...prev, show: false }))} 
                    centered
                >
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title className="fs-6 fw-bold d-flex align-items-center gap-2">
                            <FaComments />
                            <span>{commentModalData.title}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-3 bg-light">
                        {/* Conversation Header Card */}
                        <div className="bg-white p-2 px-3 rounded shadow-sm border mb-3">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-1">
                                <div>
                                    <span className="fw-bold text-dark">{commentModalData.name || 'Teacher'}</span>
                                    {commentModalData.premiumCode && (
                                        <span className="badge bg-secondary ms-2" style={{ fontSize: '0.7rem' }}>
                                            {commentModalData.premiumCode}
                                        </span>
                                    )}
                                </div>
                                <span className="badge bg-primary" style={{ fontSize: '0.72rem' }}>
                                    Tuition: {commentModalData.tuitionCode || '-'}
                                </span>
                            </div>
                            {commentModalData.phone && (
                                <div className="text-muted small mt-1">
                                    Phone: <span className="fw-semibold text-dark">{commentModalData.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* Conversation Bubble */}
                        <div className="p-3 bg-white rounded-3 shadow-sm border position-relative">
                            <div className="d-flex align-items-center gap-2 mb-2 text-primary fw-bold small border-bottom pb-2">
                                <FaComments />
                                <span>{commentModalData.label}</span>
                            </div>
                            <div 
                                style={{ 
                                    whiteSpace: 'pre-wrap', 
                                    fontSize: '0.88rem', 
                                    lineHeight: '1.6', 
                                    color: '#212529',
                                    maxHeight: '300px',
                                    overflowY: 'auto'
                                }}
                            >
                                {commentModalData.comment}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-between">
                        <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={() => {
                                navigator.clipboard.writeText(commentModalData.comment);
                                toast.success("Comment copied to clipboard!");
                            }}
                        >
                            <FaCopy className="me-1" /> Copy Message
                        </Button>
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => setCommentModalData(prev => ({ ...prev, show: false }))}
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Due Today Modal (matching PaymentPage style) */}
                <StyledModal show={showDueModal} onHide={() => setShowDueModal(false)} centered>
                    <Modal.Header closeButton className="bg-primary text-white border-0 py-3">
                        <Modal.Title className="w-100 text-center fw-bold d-flex align-items-center justify-content-center gap-2">
                            <FaBell className="text-warning" />
                            <span>Due Follow-ups Today: {dueTodayList.length}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0 bg-white d-flex flex-column">
                        {dueTodayList.length > 0 ? (
                            <div style={{ flex: 1, overflow: "auto", width: '100%', maxHeight: '65vh' }}>
                                <Table striped hover responsive className="mb-0">
                                    <thead className="table-primary" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                        <tr className="text-center align-middle">
                                            <th style={{ width: '45px' }}>SL</th>
                                            <th style={{ minWidth: '120px' }}>Follow-up Date</th>
                                            <th style={{ minWidth: '120px' }}>Cancelled At</th>
                                            <th>Teacher Code</th>
                                            <th>Tuition Code</th>
                                            <th>Name & Phone</th>
                                            <th>Cancel Category</th>
                                            <th>Follow-up Comment</th>
                                            <th>Comment</th>
                                            <th style={{ width: '90px', minWidth: '90px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dueTodayList.map((item, index) => {
                                            const rowStyle = getRowStyle(item);
                                            const activeRowType = item.isBanned ? 'banned' 
                                                : item.isSpam ? 'spam' 
                                                : (item.hasDue || item.hasScDue) ? 'due' 
                                                : item.isBest ? 'best' 
                                                : item.isExpress ? 'express' 
                                                : 'default';
                                            const isDarkBg = activeRowType === 'banned' || activeRowType === 'spam' || activeRowType === 'best' || activeRowType === 'express';
                                            const isDueBg = activeRowType === 'due';
                                            const linkColor = isDueBg ? '#000' : (isDarkBg ? '#fff' : '#0d6efd');
                                            const textColor = isDarkBg ? '#fff' : '#000';
                                            const subTextColor = isDarkBg ? 'rgba(255,255,255,0.85)' : (isDueBg ? '#212529' : '#6c757d');

                                            return (
                                                <tr key={item._id || index} className="align-middle text-center">
                                                    <td style={{ ...rowStyle, width: '45px', color: textColor }}>
                                                        {index + 1} {item.isBanned && <span title="Banned">🚫</span>} {item.isBest && <span title="Best">⭐</span>}
                                                    </td>
                                                    <td style={{ ...rowStyle, whiteSpace: 'nowrap' }}>
                                                        {item.followUpDate ? (() => {
                                                            const statusInfo = getFollowUpStatusInfo(item.followUpDate, item.isFollowUpDone);
                                                            return (
                                                                <div className="d-flex flex-column align-items-center gap-1">
                                                                    <span className="fw-bold" style={{ fontSize: '0.8rem' }}>
                                                                        {formatDateDisplay(item.followUpDate)}
                                                                    </span>
                                                                    {statusInfo?.type === 'due_today' && (
                                                                        <span className="badge bg-warning text-dark px-2 py-0" style={{ fontSize: '0.68rem', fontWeight: '700' }}>
                                                                            Due Today
                                                                        </span>
                                                                    )}
                                                                    {statusInfo?.type === 'overdue' && (
                                                                        <span className="badge bg-danger text-white px-2 py-0" style={{ fontSize: '0.68rem', fontWeight: '700' }}>
                                                                            Overdue ({statusInfo.diffDays}d)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })() : '-'}
                                                    </td>
                                                    <td style={{ ...rowStyle, whiteSpace: 'nowrap' }}>
                                                        {item.cancelledAt ? (
                                                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle" style={{ fontSize: '0.75rem' }}>
                                                                {formatCancelledAt(item.cancelledAt)}
                                                            </span>
                                                        ) : '-'}
                                                    </td>
                                                    <td style={rowStyle}>
                                                        <div>
                                                            <div>
                                                                {item.premiumCode ? (
                                                                    <span 
                                                                        className="fw-bold font-monospace"
                                                                        style={{ 
                                                                            cursor: 'pointer', 
                                                                            textDecoration: 'underline',
                                                                            color: linkColor
                                                                        }}
                                                                        onClick={() => {
                                                                            setShowDueModal(false);
                                                                            handleOpenTeacherDetails(item.premiumCode);
                                                                        }}
                                                                        title={`Click to view Teacher Details (${item.premiumCode})`}
                                                                    >
                                                                        {item.premiumCode}
                                                                    </span>
                                                                ) : '-'}
                                                            </div>
                                                            {item.regTeacherStatus && (
                                                                <div style={{ fontSize: '11px', color: subTextColor, marginTop: '2px', textTransform: 'capitalize', fontWeight: isDueBg ? '600' : 'normal' }}>
                                                                    ({item.regTeacherStatus})
                                                                </div>
                                                            )}
                                                            {(item.hasDue || item.hasScDue) && (
                                                                <table 
                                                                    className="table table-sm table-bordered mb-0 mt-1 shadow-sm" 
                                                                    style={{ fontSize: '0.72rem', minWidth: '105px', backgroundColor: '#fff8db', borderColor: '#ffeeba' }}
                                                                >
                                                                    <thead>
                                                                        <tr style={{ backgroundColor: '#ffdf7e', fontSize: '0.68rem' }} className="text-center">
                                                                            <th className="py-0 px-1 text-dark" style={{ backgroundColor: '#ffdf7e' }}>Due</th>
                                                                            <th className="py-0 px-1 text-dark" style={{ backgroundColor: '#ffdf7e' }}>Amount</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {item.hasDue && (
                                                                            <tr>
                                                                                <td className="py-0 px-1 fw-bold text-dark text-center" title="Tuition Charge Due" style={{ backgroundColor: '#fff8db' }}>
                                                                                    TC{item.dueCount ? ` (${item.dueCount})` : ''}
                                                                                </td>
                                                                                <td className="py-0 px-1 text-end fw-bold text-danger" style={{ backgroundColor: '#fff8db' }}>৳{Number(item.dueAmount).toLocaleString()}</td>
                                                                            </tr>
                                                                        )}
                                                                        {item.hasScDue && (
                                                                            <tr>
                                                                                <td className="py-0 px-1 fw-bold text-dark text-center" title="Service Charge Due" style={{ backgroundColor: '#fff8db' }}>
                                                                                    SC{item.scDueCount ? ` (${item.scDueCount})` : ''}
                                                                                </td>
                                                                                <td className="py-0 px-1 text-end fw-bold text-danger" style={{ backgroundColor: '#fff8db' }}>৳{Number(item.scDueAmount).toLocaleString()}</td>
                                                                            </tr>
                                                                        )}
                                                                        {item.hasDue && item.hasScDue && (
                                                                            <tr style={{ backgroundColor: '#ffe8a1', borderTop: '1.5px solid #deb887' }}>
                                                                                <td className="py-0 px-1 fw-bold text-dark text-center" title="Total Due Count" style={{ backgroundColor: '#ffe8a1' }}>
                                                                                    ({(item.dueCount || 0) + (item.scDueCount || 0)})
                                                                                </td>
                                                                                <td className="py-0 px-1 text-end fw-bold text-danger" style={{ backgroundColor: '#ffe8a1' }}>
                                                                                    ৳{Number((item.dueAmount || 0) + (item.scDueAmount || 0)).toLocaleString()}
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td style={rowStyle}>
                                                        <div className="d-flex flex-column gap-1 align-items-center">
                                                            {item.tuitionCode ? (
                                                                <span
                                                                    className="fw-bold"
                                                                    style={{ 
                                                                        cursor: 'pointer', 
                                                                        textDecoration: 'underline',
                                                                        color: linkColor
                                                                    }}
                                                                    onClick={() => {
                                                                        setShowDueModal(false);
                                                                        handleShowDetails(item.tuitionId, item.tuitionCode);
                                                                    }}
                                                                >
                                                                    {item.tuitionCode}
                                                                </span>
                                                            ) : '-'}
                                                            {item.tuitionStatus && (
                                                                <span
                                                                    className={`badge text-wrap ${item.tuitionStatus.toLowerCase() === 'available' ? 'bg-success blink-available' : 'bg-secondary'}`}
                                                                    style={{
                                                                        fontSize: '0.7rem',
                                                                        maxWidth: 'fit-content',
                                                                        backgroundColor: item.tuitionStatus.toLowerCase() === 'available' ? '#198754' : (item.hasDue ? '#6c757d' : isDarkBg ? 'rgba(255,255,255,0.25)' : undefined),
                                                                        color: '#fff'
                                                                    }}
                                                                >
                                                                    {item.tuitionStatus}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td style={rowStyle} className="text-start">
                                                        <div className="fw-semibold" style={{ fontSize: '0.86rem', color: isDarkBg ? '#fff' : (isDueBg ? '#000' : '#0d6efd') }}>
                                                            {item.name || ''}
                                                        </div>
                                                        {item.phone && (
                                                            <div 
                                                                className="fw-bold" 
                                                                style={{ color: isDarkBg ? '#fff' : '#000', fontSize: '0.82rem', marginTop: '2px' }}
                                                            >
                                                                {item.phone}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={{ ...rowStyle, minWidth: '125px', maxWidth: '140px', padding: '4px 6px' }}>
                                                        {item.cancelCategory ? (
                                                            <Badge 
                                                                bg={item.isSpam ? 'dark' : 'danger'} 
                                                                className="text-wrap text-start fw-semibold" 
                                                                style={{ 
                                                                    fontSize: '0.72rem', 
                                                                    padding: '3px 6px', 
                                                                    lineHeight: '1.25',
                                                                    whiteSpace: 'normal',
                                                                    wordBreak: 'break-word',
                                                                    display: 'inline-block',
                                                                    maxWidth: '100%'
                                                                }}
                                                            >
                                                                {item.cancelCategory}
                                                            </Badge>
                                                        ) : '-'}
                                                    </td>
                                                    <td style={rowStyle} className="text-start">
                                                        <span style={{ color: textColor }}>
                                                            {item.followUpComment || '-'}
                                                        </span>
                                                    </td>
                                                    <td style={{ ...rowStyle, color: subTextColor }} className="text-start small">
                                                        {item.comment || '-'}
                                                    </td>
                                                    <td style={rowStyle}>
                                                        <div className="d-flex align-items-center justify-content-center gap-1">
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                className="d-inline-flex align-items-center justify-content-center p-0"
                                                                style={{ width: '31px', height: '31px' }}
                                                                onClick={() => handleEditTuition(item, true)}
                                                                title="Edit Record"
                                                            >
                                                                <FaEdit size={13} />
                                                            </Button>
                                                            <Button
                                                                variant="warning"
                                                                size="sm"
                                                                className="d-inline-flex align-items-center justify-content-center p-0"
                                                                style={{ width: '31px', height: '31px' }}
                                                                onClick={() => handleOpenFollowUpModal(item, true)}
                                                                title="Follow Up"
                                                            >
                                                                <FaCalendarAlt size={13} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center text-muted py-5 my-auto">
                                <FaExclamationCircle size={48} className="mb-3 opacity-25" />
                                <h5>No follow-ups due today</h5>
                            </div>
                        )}
                    </Modal.Body>
                </StyledModal>

                <CustomErrorModal
                    show={!!errorMessage}
                    message={errorMessage}
                    onClose={() => setErrorMessage('')}
                />
            </Container>
        </>
    );
};

export default TuitionApplyCancelledPage;

const Container = styled.div`
  padding: 10px 25px 25px 25px;
  background: #f4f4f9;
  min-height: 90vh;

  @keyframes blink-animation {
    0% { opacity: 1; }
    50% { opacity: 0.15; }
    100% { opacity: 1; }
  }

  .blink-available {
    animation: blink-animation 1.2s infinite;
    background-color: #198754 !important;
    color: #ffffff !important;
    font-weight: bold;
  }

  .custom-pills {
    background-color: #e2e8f0;
    padding: 4px;
    border-radius: 10px;
    display: inline-flex;
    gap: 4px;
    flex-wrap: wrap;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.04);
  }
  .custom-pills .nav-link {
    color: #475569;
    font-weight: 600;
    border-radius: 8px;
    padding: 8px 20px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    font-size: 14.5px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .custom-pills .nav-link:hover {
    color: #0f172a;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .custom-pills .nav-link.active {
    background-color: #ffffff !important;
    color: #1d4ed8 !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08) !important;
    font-weight: 700;
  }

  /* Table borders, crisp row separators, and distinct header column separators */
  table.table {
    border-collapse: separate !important;
    border-spacing: 0 !important;
    border: 1px solid #dee2e6 !important;
    width: 100%;
  }

  table.table th,
  table.table td {
    border-right: 1px solid #dee2e6 !important;
    border-bottom: 1px solid #dee2e6 !important;
    vertical-align: middle;
    padding: 5px 5px !important;
  }

  .sticky-action-col {
    position: sticky !important;
    right: 0 !important;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.08) !important;
  }

  table.table thead th {
    background-color: #cfe2ff !important;
    border-right: 1px solid #9ec5fe !important;
    border-bottom: 2px solid #86b7fe !important;
    border-top: 1px solid #dee2e6 !important;
    box-shadow: inset -1px 0 0 #9ec5fe, inset 0 -2px 0 #86b7fe !important;
  }

  table.table thead th:last-child {
    border-right: none !important;
    box-shadow: inset 0 -2px 0 #86b7fe !important;
  }

  table.table tbody tr {
    border-bottom: 1px solid #dee2e6 !important;
  }

  table.table tbody tr:hover {
    background-color: #f8fafc;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const StyledModal = styled(Modal)`
  .modal-dialog {
    max-width: 95vw !important;
    margin: 1.75rem auto;
  }
  .modal-content {
    border-radius: 12px;
    overflow: hidden;
    border: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    max-height: 85vh;
  }
`;
