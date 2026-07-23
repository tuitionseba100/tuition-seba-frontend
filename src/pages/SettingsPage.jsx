import React, { useState, useEffect } from 'react';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { Modal, Button, Form } from 'react-bootstrap';
import NavbarPage from './NavbarPage';
import locationData from '../data/locations.json';
import PosterGenerator from '../components/PosterGenerator';

const API_BASE_URL = 'https://tuition-seba-backend-1.onrender.com';

const SettingsPage = () => {
    const [role] = useState(localStorage.getItem('role'));
    const [users, setUsers] = useState([]);
    const [allSettings, setAllSettings] = useState([]);
    const [settings, setSettings] = useState({
        payment_auto_assign_user: [],
        tuition_auto_assign_user: [],
        status_change_auto_assign_user: [],
        cancel_status_change_auto_assign_user: []
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('assignment'); // 'assignment' or 'area'
    const [removingTarget, setRemovingTarget] = useState(null); // { key, userId }
    const [areaGroups, setAreaGroups] = useState([]); // [{ name: '', areas: [] }]
    const [newGroup, setNewGroup] = useState({ name: '', areas: [] });
    const [isEditingArea, setIsEditingArea] = useState(null); // index of group being edited
    const [deletingGroupIdx, setDeletingGroupIdx] = useState(null);

    const [guidelines, setGuidelines] = useState([]); // [{ id, topic, reply }]
    const [newGuideline, setNewGuideline] = useState({ topic: '', reply: '' });
    const [isEditingGuideline, setIsEditingGuideline] = useState(null); // index of guideline being edited
    const [deletingGuidelineIdx, setDeletingGuidelineIdx] = useState(null);

    const [marketingMediums, setMarketingMediums] = useState([]);
    const [newMedium, setNewMedium] = useState('');
    const [isEditingMedium, setIsEditingMedium] = useState(null);
    const [deletingMediumIdx, setDeletingMediumIdx] = useState(null);

    const [cityAreas, setCityAreas] = useState([]); // [{ cityName: '', areas: [] }]
    const [newCityNameOnly, setNewCityNameOnly] = useState('');
    const [selectedCityForArea, setSelectedCityForArea] = useState('');
    const [newAreasList, setNewAreasList] = useState([]);
    const [areaInput, setAreaInput] = useState('');
    const [deletingCityIdx, setDeletingCityIdx] = useState(null);
    const [deletingAreaTarget, setDeletingAreaTarget] = useState(null); // { cIdx, aIdx }
    const [showDeleteCityModal, setShowDeleteCityModal] = useState(false);
    const [cityToDelete, setCityToDelete] = useState(null); // { index, cityName }
    const [deleteCityInput, setDeleteCityInput] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [selectedAssignments, setSelectedAssignments] = useState({
        payment_auto_assign_user: [],
        tuition_auto_assign_user: [],
        status_change_auto_assign_user: [],
        cancel_status_change_auto_assign_user: []
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [cityAreaSearch, setCityAreaSearch] = useState(''); // Global search string for cities/areas

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const [usersRes, allSettingsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/user/users`, { headers: { Authorization: token } }),
                axios.get(`${API_BASE_URL}/api/settings`, { headers: { Authorization: token } })
            ]);

            // Ensure users is an array
            const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
            setUsers(usersData);

            // Map settings to state
            const settingsData = Array.isArray(allSettingsRes.data) ? allSettingsRes.data : [];
            setAllSettings(settingsData);

            const settingsObj = {
                payment_auto_assign_user: [],
                tuition_auto_assign_user: [],
                status_change_auto_assign_user: [],
                cancel_status_change_auto_assign_user: []
            };

            settingsData.forEach(s => {
                if (settingsObj.hasOwnProperty(s.key)) {
                    // Normalize value to an array
                    if (Array.isArray(s.value)) {
                        settingsObj[s.key] = s.value;
                    } else if (s.value) {
                        settingsObj[s.key] = [s.value];
                    } else {
                        settingsObj[s.key] = [];
                    }
                }
            });

            // Extract area groups
            const areaSetting = settingsData.find(s => s.key === 'area_groups');
            if (areaSetting && Array.isArray(areaSetting.value)) {
                setAreaGroups(areaSetting.value);
            }

            // Extract city areas
            const cityAreaSetting = settingsData.find(s => s.key === 'city_areas');
            if (cityAreaSetting && Array.isArray(cityAreaSetting.value)) {
                setCityAreas(cityAreaSetting.value);
            }

            // Extract response guidelines
            const guidelinesSetting = settingsData.find(s => s.key === 'response_guidelines');
            if (guidelinesSetting && Array.isArray(guidelinesSetting.value)) {
                setGuidelines(guidelinesSetting.value);
            }

            // Extract marketing mediums
            const marketingMediumsSetting = settingsData.find(s => s.key === 'marketing_mediums');
            if (marketingMediumsSetting && Array.isArray(marketingMediumsSetting.value) && marketingMediumsSetting.value.length > 0) {
                setMarketingMediums(marketingMediumsSetting.value);
            } else {
                setMarketingMediums([
                    "Facebook Advertisement",
                    "Facebook Group / Page",
                    "Street Poster / Banner",
                    "Friend / Family Reference",
                    "Google Search",
                    "YouTube Video",
                    "Instagram Ad",
                    "Leaflet / Flyer Distribution",
                    "From a Current Teacher",
                    "From a Current Guardian",
                    "Newspaper Advertisement",
                    "WhatsApp Group / Message",
                    "Local Coaching Center",
                    "School / College Notice Board",
                    "LinkedIn",
                    "TikTok / Shorts Video",
                    "Email Newsletter",
                    "Website Blog / Article",
                    "Word of Mouth",
                    "Others"
                ]);
            }

            setSettings(settingsObj);
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSetting = async (key, valueOverride = null, submodule = 'personnel_assignment', mode = 'append') => {
        const value = valueOverride !== null ? valueOverride : selectedAssignments[key];

        // If it's a manual save from dropdown, we want to ensure selection
        if (valueOverride === null && (!value || (Array.isArray(value) && value.length === 0))) {
            toast.error('Please select at least one user to assign');
            return;
        }

        // Duplicate check for append mode
        if (mode === 'append' && Array.isArray(value)) {
            const currentUsers = settings[key] || [];
            const duplicates = value.filter(u => currentUsers.includes(u));
            if (duplicates.length > 0) {
                toast.error(`${duplicates.join(', ')} already assigned to this module`);
                return;
            }
        }

        try {
            setIsSaving(true);
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/settings`, {
                key,
                value,
                submodule,
                mode
            }, {
                headers: { Authorization: token }
            });

            toast.success(mode === 'append' ? 'User(s) added successfully' : 'Settings updated successfully');

            // Clear selections if it was an append operation
            if (mode === 'append') {
                setSelectedAssignments(prev => ({ ...prev, [key]: [] }));
            }

            // Refresh settings list
            const res = await axios.get(`${API_BASE_URL}/api/settings`, {
                headers: { Authorization: token }
            });
            const freshSettings = Array.isArray(res.data) ? res.data : [];
            setAllSettings(freshSettings);

            // Sync the 'settings' state for the form dropdowns
            const settingsObj = { ...settings };
            freshSettings.forEach(s => {
                if (settingsObj.hasOwnProperty(s.key)) {
                    if (Array.isArray(s.value)) {
                        settingsObj[s.key] = s.value;
                    } else if (s.value) {
                        settingsObj[s.key] = [s.value];
                    } else {
                        settingsObj[s.key] = [];
                    }
                }
            });
            setSettings(settingsObj);

            // Extract area groups if exists
            const areaSetting = freshSettings.find(s => s.key === 'area_groups');
            if (areaSetting && Array.isArray(areaSetting.value)) {
                setAreaGroups(areaSetting.value);
            }

            // Extract city areas if exists
            const cityAreaSetting = freshSettings.find(s => s.key === 'city_areas');
            if (cityAreaSetting && Array.isArray(cityAreaSetting.value)) {
                setCityAreas(cityAreaSetting.value);
            }

            // Extract response guidelines if exists
            const guidelinesSetting = freshSettings.find(s => s.key === 'response_guidelines');
            if (guidelinesSetting && Array.isArray(guidelinesSetting.value)) {
                setGuidelines(guidelinesSetting.value);
            }
        } catch (error) {
            console.error('Error saving setting:', error);
            toast.error('Failed to save setting');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveUser = async (key, userId) => {
        const currentSetting = allSettings.find(s => s.key === key);
        if (!currentSetting) return;

        const user = users.find(u => u.username === userId || u._id === userId);
        try {
            setRemovingTarget({ key, userId });
            const currentValues = settings[key] || [];
            const newValues = currentValues.filter(id => id !== userId);
            await handleSaveSetting(key, newValues, 'personnel_assignment', 'overwrite');
        } finally {
            setRemovingTarget(null);
        }
    };

    const handleSaveAreaGroups = async (updatedGroups = areaGroups) => {
        try {
            setIsSaving(true);
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/settings`, {
                key: 'area_groups',
                value: updatedGroups,
                submodule: 'area_group'
            }, {
                headers: { Authorization: token }
            });
            toast.success('Area groups saved successfully');
            setAreaGroups(updatedGroups);
            setIsEditingArea(null);
            setNewGroup({ name: '', areas: [] });
        } catch (error) {
            console.error('Error saving area groups:', error);
            toast.error('Failed to save area groups');
        } finally {
            setIsSaving(false);
        }
    };

    const addAreaGroup = () => {
        if (!newGroup.name || newGroup.areas.length === 0) {
            toast.warning('Please provide a group name and select at least one area');
            return;
        }

        let updated;
        if (isEditingArea !== null) {
            updated = areaGroups.map((g, i) => i === isEditingArea ? newGroup : g);
        } else {
            updated = [...areaGroups, newGroup];
        }

        handleSaveAreaGroups(updated);
    };

    const editAreaGroup = (index) => {
        const group = areaGroups[index];
        setNewGroup({ ...group });
        setIsEditingArea(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteAreaGroup = async (index) => {
        if (!window.confirm('Are you sure you want to delete this area group?')) return;
        setDeletingGroupIdx(index);
        const updated = areaGroups.filter((_, i) => i !== index);
        await handleSaveAreaGroups(updated);
        setDeletingGroupIdx(null);
    };

    const handleSaveCityAreas = async (updatedCityAreas = cityAreas) => {
        try {
            setIsSaving(true);
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/settings`, {
                key: 'city_areas',
                value: updatedCityAreas,
                submodule: 'city_area'
            }, {
                headers: { Authorization: token }
            });
            toast.success('City Areas saved successfully');
            setCityAreas(updatedCityAreas);

            setNewCityNameOnly('');
            setNewAreasList([]);
            setAreaInput('');
        } catch (error) {
            console.error('Error saving city areas:', error);
            toast.error('Failed to save city areas');
        } finally {
            setIsSaving(false);
        }
    };

    const createOnlyCity = () => {
        if (!newCityNameOnly.trim()) {
            toast.warning('Please provide a city name');
            return;
        }
        if (cityAreas.some(c => c.cityName.toLowerCase() === newCityNameOnly.trim().toLowerCase())) {
            toast.warning('City already exists');
            return;
        }
        const updated = [...cityAreas, { cityName: newCityNameOnly.trim(), areas: [] }];
        handleSaveCityAreas(updated);
    };

    const handleAddAreaToDraftList = () => {
        if (areaInput.trim() !== '') {
            if (newAreasList.includes(areaInput.trim())) {
                toast.warning('Area already added to draft list');
                return;
            }
            setNewAreasList(prev => [...prev, areaInput.trim()]);
            setAreaInput('');
        }
    };

    const handleRemoveAreaFromDraftList = (indexToRemove) => {
        setNewAreasList(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const saveAreasToSelectedCity = () => {
        if (!selectedCityForArea) {
            toast.warning('Please select a city first');
            return;
        }
        if (newAreasList.length === 0) {
            toast.warning('Please add at least one area to the list');
            return;
        }

        const updated = cityAreas.map(c => {
            if (c.cityName === selectedCityForArea) {
                const existingAreas = c.areas || [];
                const mergedAreas = [...new Set([...existingAreas, ...newAreasList])];
                return { ...c, areas: mergedAreas };
            }
            return c;
        });

        handleSaveCityAreas(updated);
    };

    const deleteCityArea = (index) => {
        setCityToDelete({ index, cityName: cityAreas[index].cityName });
        setDeleteCityInput('');
        setShowDeleteCityModal(true);
    };

    const confirmDeleteCityArea = async () => {
        if (!cityToDelete) return;

        if (deleteCityInput.trim() !== cityToDelete.cityName) {
            toast.error('City name does not match.');
            return;
        }

        setDeletingCityIdx(cityToDelete.index);
        setShowDeleteCityModal(false);
        const updated = cityAreas.filter((_, i) => i !== cityToDelete.index);
        await handleSaveCityAreas(updated);
        setDeletingCityIdx(null);
        setCityToDelete(null);
        setDeleteCityInput('');
    };

    const deleteAreaFromCity = async (cityIndex, areaIndex) => {
        if (!window.confirm('Are you sure you want to remove this area?')) return;
        setDeletingAreaTarget({ cIdx: cityIndex, aIdx: areaIndex });
        const updated = cityAreas.map((c, i) => {
            if (i === cityIndex) {
                return { ...c, areas: c.areas.filter((_, aIdx) => aIdx !== areaIndex) };
            }
            return c;
        });
        await handleSaveCityAreas(updated);
        setDeletingAreaTarget(null);
    };

    const handleSaveGuidelines = async (updatedGuidelines = guidelines) => {
        try {
            setIsSaving(true);
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/settings`, {
                key: 'response_guidelines',
                value: updatedGuidelines,
                submodule: 'response_guideline'
            }, {
                headers: { Authorization: token }
            });
            toast.success('Guidelines saved successfully');
            setGuidelines(updatedGuidelines);
            setIsEditingGuideline(null);
            setNewGuideline({ topic: '', reply: '' });
        } catch (error) {
            console.error('Error saving guidelines:', error);
            toast.error('Failed to save guidelines');
        } finally {
            setIsSaving(false);
        }
    };

    const addGuideline = () => {
        if (!newGuideline.topic.trim() || !newGuideline.reply.trim()) {
            toast.warning('Please provide both a topic/scenario and a reply');
            return;
        }

        let updated;
        if (isEditingGuideline !== null) {
            updated = guidelines.map((g, i) => i === isEditingGuideline ? newGuideline : g);
        } else {
            updated = [...guidelines, { ...newGuideline, id: Date.now().toString() }];
        }

        handleSaveGuidelines(updated);
    };

    const editGuideline = (index) => {
        const guideline = guidelines[index];
        setNewGuideline({ ...guideline });
        setIsEditingGuideline(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteGuideline = async (index) => {
        if (!window.confirm('Are you sure you want to delete this guideline?')) return;
        setDeletingGuidelineIdx(index);
        const updated = guidelines.filter((_, i) => i !== index);
        await handleSaveGuidelines(updated);
        setDeletingGuidelineIdx(null);
    };

    const handleSaveMediums = async (updatedMediums) => {
        try {
            setIsSaving(true);
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/settings`, {
                key: 'marketing_mediums',
                value: updatedMediums,
                submodule: 'general',
                mode: 'replace'
            }, {
                headers: { Authorization: token }
            });
            toast.success('Mediums saved successfully');
            setMarketingMediums(updatedMediums);
            setIsEditingMedium(null);
            setNewMedium('');
        } catch (error) {
            console.error('Error saving mediums:', error);
            toast.error('Failed to save mediums');
        } finally {
            setIsSaving(false);
        }
    };

    const addMedium = () => {
        if (!newMedium.trim()) {
            toast.warning('Please provide a medium name');
            return;
        }

        let updated;
        if (isEditingMedium !== null) {
            updated = marketingMediums.map((m, i) => i === isEditingMedium ? newMedium : m);
        } else {
            updated = [...marketingMediums, newMedium];
        }

        handleSaveMediums(updated);
    };

    const editMedium = (index) => {
        setNewMedium(marketingMediums[index]);
        setIsEditingMedium(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteMedium = async (index) => {
        if (!window.confirm('Are you sure you want to delete this medium?')) return;
        setDeletingMediumIdx(index);
        const updated = marketingMediums.filter((_, i) => i !== index);
        await handleSaveMediums(updated);
        setDeletingMediumIdx(null);
    };

    // Prepare all areas from JSON
    const allAvailableAreas = Object.values(locationData.areaOptions).flat().filter(a => a !== 'Coming Soon').map(a => ({ value: a, label: a }));

    const handleChange = (key, value) => {
        setSelectedAssignments(prev => ({ ...prev, [key]: value }));
    };

    const getDisplayName = (username) => {
        if (Array.isArray(username)) {
            return username.map(u => {
                const user = users.find(usr => usr.username === u);
                return user ? `${user.name} (${user.username})` : u;
            }).join(', ');
        }
        const user = users.find(u => u.username === username);
        return user ? `${user.name} (${user.username})` : (username || '');
    };

    const userOptions = Array.isArray(users) ? users.map(user => ({
        value: user.username,
        label: `${user.name} (${user.username})`
    })) : [];

    const targetKeys = [
        'payment_auto_assign_user',
        'tuition_auto_assign_user',
        'status_change_auto_assign_user',
        'cancel_status_change_auto_assign_user'
    ];

    // Create a base list from allSettings that are personnel assignments
    let baseSettings = allSettings.filter(s => {
        return s.submodule === 'personnel_assignment' || (!s.submodule && s.key.includes('user'));
    });

    // Ensure all target keys are present
    targetKeys.forEach(key => {
        if (!baseSettings.find(s => s.key === key)) {
            baseSettings.push({ key, value: [], submodule: 'personnel_assignment' });
        }
    });

    const filteredSettings = baseSettings.filter(s => {
        const keyMatch = String(s.key || '').toLowerCase().includes(searchTerm.toLowerCase());
        const valueMatch = String(s.value || '').toLowerCase().includes(searchTerm.toLowerCase());
        const userMatch = String(getDisplayName(s.value)).toLowerCase().includes(searchTerm.toLowerCase());
        return keyMatch || valueMatch || userMatch;
    }).sort((a, b) => {
        const order = {
            'payment_auto_assign_user': 1,
            'tuition_auto_assign_user': 2,
            'status_change_auto_assign_user': 3,
            'cancel_status_change_auto_assign_user': 4
        };
        const orderA = order[a.key] || 99;
        const orderB = order[b.key] || 99;
        return orderA - orderB;
    });

    if (loading) {
        return (
            <>
                <NavbarPage />
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavbarPage />
            <div className="container-fluid p-0 p-md-3">
                <ToastContainer />

                {/* Mobile Header with Hamburger */}
                <div className="d-flex d-md-none align-items-center justify-content-between p-3 bg-white border-bottom shadow-sm mb-3">
                    <h5 className="fw-bold mb-0 text-dark">Settings</h5>
                    <button
                        className="btn btn-primary btn-sm rounded-3 px-3"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} me-2`}></i>
                        Menu
                    </button>
                </div>

                <div className="d-flex flex-column flex-md-row g-0">
                    {/* Ultra-Slim Sidebar - Mobile Overlay / Desktop Sidebar */}
                    <div className={`settings-sidebar pe-md-3 border-end ${isSidebarOpen ? 'active' : ''}`} style={{ width: '170px', flexShrink: 0, minHeight: 'calc(100vh - 100px)' }}>
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{ top: '20px' }}>
                            <div className="card-header border-0 bg-white p-2 px-3">
                                <h6 className="fw-bold mb-0 text-dark">Settings</h6>
                            </div>
                            <div className="card-body p-1 bg-light">
                                <div className="d-flex flex-column gap-1">
                                    <button
                                        onClick={() => { setActiveTab('assignment'); setIsSidebarOpen(false); }}
                                        className={`btn w-100 text-start d-flex align-items-start p-2 px-3 rounded-3 transition-all border-0 ${activeTab === 'assignment' ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-secondary hover-bg-white'}`}
                                    >
                                        <i className={`fas fa-user-tag mt-1 me-2 ${activeTab === 'assignment' ? 'text-white' : 'text-primary'}`} style={{ fontSize: '0.8rem' }}></i>
                                        <span className="fw-bold" style={{ fontSize: '0.7rem', lineHeight: '1.2' }}>Personnel assignment</span>
                                    </button>

                                    <button
                                        onClick={() => { setActiveTab('area'); setIsSidebarOpen(false); }}
                                        className={`btn w-100 text-start d-flex align-items-start p-2 px-3 rounded-3 transition-all border-0 ${activeTab === 'area' ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-secondary hover-bg-white'}`}
                                    >
                                        <i className={`fas fa-map-marked-alt mt-1 me-2 ${activeTab === 'area' ? 'text-white' : 'text-success'}`} style={{ fontSize: '0.8rem' }}></i>
                                        <span className="fw-bold" style={{ fontSize: '0.7rem', lineHeight: '1.2' }}>Area grouping</span>
                                    </button>

                                    <button
                                        onClick={() => { setActiveTab('cityArea'); setIsSidebarOpen(false); }}
                                        className={`btn w-100 text-start d-flex align-items-start p-2 px-3 rounded-3 transition-all border-0 ${activeTab === 'cityArea' ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-secondary hover-bg-white'}`}
                                    >
                                        <i className={`fas fa-city mt-1 me-2 ${activeTab === 'cityArea' ? 'text-white' : 'text-info'}`} style={{ fontSize: '0.8rem' }}></i>
                                        <span className="fw-bold" style={{ fontSize: '0.7rem', lineHeight: '1.2' }}>City(Area) Settings</span>
                                    </button>

                                    <button
                                        onClick={() => { setActiveTab('guidelines'); setIsSidebarOpen(false); }}
                                        className={`btn w-100 text-start d-flex align-items-start p-2 px-3 rounded-3 transition-all border-0 ${activeTab === 'guidelines' ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-secondary hover-bg-white'}`}
                                    >
                                        <i className={`fas fa-comment-dots mt-1 me-2 ${activeTab === 'guidelines' ? 'text-white' : 'text-warning'}`} style={{ fontSize: '0.8rem' }}></i>
                                        <span className="fw-bold" style={{ fontSize: '0.7rem', lineHeight: '1.2' }}>Response Guidelines</span>
                                    </button>

                                    <button
                                        onClick={() => { setActiveTab('mediums'); setIsSidebarOpen(false); }}
                                        className={`btn w-100 text-start d-flex align-items-start p-2 px-3 rounded-3 transition-all border-0 ${activeTab === 'mediums' ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-secondary hover-bg-white'}`}
                                    >
                                        <i className={`fas fa-bullhorn mt-1 me-2 ${activeTab === 'mediums' ? 'text-white' : 'text-primary'}`} style={{ fontSize: '0.8rem' }}></i>
                                        <span className="fw-bold" style={{ fontSize: '0.7rem', lineHeight: '1.2' }}>Marketing Mediums</span>
                                    </button>

                                    {role === 'superadmin' && (
                                        <button
                                            onClick={() => { setActiveTab('generator'); setIsSidebarOpen(false); }}
                                            className={`btn w-100 text-start d-flex align-items-start p-2 px-3 rounded-3 transition-all border-0 ${activeTab === 'generator' ? 'shadow-sm text-white' : 'bg-transparent text-secondary hover-bg-white'}`}
                                            style={activeTab === 'generator' ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}
                                        >
                                            <i className={`fas fa-magic mt-1 me-2 ${activeTab === 'generator' ? 'text-white' : 'text-purple'}`} style={{ fontSize: '0.8rem', color: activeTab === 'generator' ? '#fff' : '#8b5cf6' }}></i>
                                            <span className="fw-bold" style={{ fontSize: '0.7rem', lineHeight: '1.2' }}>Poster Generator</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Backdrop for mobile sidebar */}
                    {isSidebarOpen && (
                        <div
                            className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-25 z-index-dropdown"
                            style={{ zIndex: 1040 }}
                            onClick={() => setIsSidebarOpen(false)}
                        ></div>
                    )}

                    {/* Content Area */}
                    <div className="flex-grow-1 ps-md-4 p-3 p-md-0 overflow-hidden">
                        {activeTab === 'assignment' ? (
                            <>
                                <div className="card border-0 shadow-lg mb-4 overflow-hidden" style={{ borderRadius: '20px' }}>
                                    <div className="card-header py-2 px-4 border-0" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)', color: 'white' }}>
                                        <h2 className="mb-0 fw-bold d-flex align-items-center fs-4">
                                            <i className="fas fa-sliders-h me-3"></i>
                                            Auto assignment settings
                                        </h2>
                                        <p className="mb-0 opacity-80 extra-small">Control system automation and personnel assignments</p>
                                    </div>
                                    <div className="card-body p-3 bg-white">
                                        <div className="row g-3">
                                            {/* Payment Auto Assign */}
                                            <div className="col-12 col-md-6 col-lg-3">
                                                <div className="bg-white p-3 rounded-4 shadow-sm border-start border-primary border-4 h-100">
                                                    <div className="d-flex align-items-center mb-3">
                                                        <div className="bg-primary-subtle text-primary p-2 rounded-circle me-3">
                                                            <i className="fas fa-credit-card"></i>
                                                        </div>
                                                        <div>
                                                            <h5 className="mb-0 fw-bold" style={{ fontSize: '0.85rem' }}>Payment</h5>
                                                            <p className="text-muted extra-small mb-0">Auto-assign new payments</p>
                                                        </div>
                                                    </div>
                                                    <Select
                                                        className="mb-3 shadow-sm"
                                                        classNamePrefix="select"
                                                        isMulti
                                                        value={userOptions.filter(opt => (selectedAssignments.payment_auto_assign_user || []).includes(opt.value))}
                                                        onChange={(selected) => handleChange('payment_auto_assign_user', selected ? selected.map(opt => opt.value) : [])}
                                                        options={userOptions}
                                                        placeholder="Add personnel..."
                                                        isClearable
                                                        isDisabled={isSaving}
                                                        menuPosition="fixed"
                                                        styles={{
                                                            control: (base, state) => ({
                                                                ...base,
                                                                border: '2px solid #f1f5f9',
                                                                backgroundColor: 'white',
                                                                borderRadius: '0.75rem',
                                                                padding: '2px',
                                                                minHeight: 'auto',
                                                                boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.1)' : 'none',
                                                                borderColor: state.isFocused ? '#0d6efd' : '#f1f5f9',
                                                                '&:hover': {
                                                                    borderColor: '#0d6efd'
                                                                }
                                                            }),
                                                            multiValue: (base) => ({
                                                                ...base,
                                                                backgroundColor: '#e7f1ff',
                                                                borderRadius: '6px',
                                                                padding: '2px 4px'
                                                            }),
                                                            multiValueLabel: (base) => ({
                                                                ...base,
                                                                color: '#0d6efd',
                                                                fontWeight: '600',
                                                                fontSize: '0.75rem'
                                                            }),
                                                            multiValueRemove: (base) => ({
                                                                ...base,
                                                                color: '#0d6efd',
                                                                '&:hover': {
                                                                    backgroundColor: '#0d6efd',
                                                                    color: 'white',
                                                                    borderRadius: '4px'
                                                                }
                                                            })
                                                        }}
                                                    />
                                                    <button
                                                        className="btn w-100 rounded-3 shadow-sm hover-lift text-white fw-bold py-2 mt-auto d-flex align-items-center justify-content-center"
                                                        style={{ background: 'linear-gradient(to right, #0d6efd, #0b5ed7)', border: 'none', fontSize: '0.85rem' }}
                                                        onClick={() => handleSaveSetting('payment_auto_assign_user')}
                                                        disabled={isSaving}
                                                    >
                                                        {isSaving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-user-plus me-2"></i>}
                                                        Update Assignment
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Tuition Auto Assign */}
                                            <div className="col-12 col-md-6 col-lg-3">
                                                <div className="bg-white p-3 rounded-4 shadow-sm border-start border-success border-4 h-100">
                                                    <div className="d-flex align-items-center mb-3">
                                                        <div className="bg-success-subtle text-success p-2 rounded-circle me-3">
                                                            <i className="fas fa-graduation-cap"></i>
                                                        </div>
                                                        <div>
                                                            <h5 className="mb-0 fw-bold" style={{ fontSize: '0.85rem' }}>Tuition</h5>
                                                            <p className="text-muted extra-small mb-0">Auto-assign new tuitions</p>
                                                        </div>
                                                    </div>
                                                    <Select
                                                        className="mb-3 shadow-sm"
                                                        classNamePrefix="select"
                                                        isMulti
                                                        value={userOptions.filter(opt => (selectedAssignments.tuition_auto_assign_user || []).includes(opt.value))}
                                                        onChange={(selected) => handleChange('tuition_auto_assign_user', selected ? selected.map(opt => opt.value) : [])}
                                                        options={userOptions}
                                                        placeholder="Add personnel..."
                                                        isClearable
                                                        isDisabled={isSaving}
                                                        menuPosition="fixed"
                                                        styles={{
                                                            control: (base, state) => ({
                                                                ...base,
                                                                border: '2px solid #f1f5f9',
                                                                backgroundColor: 'white',
                                                                borderRadius: '0.75rem',
                                                                padding: '2px',
                                                                minHeight: 'auto',
                                                                boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(16, 185, 129, 0.1)' : 'none',
                                                                borderColor: state.isFocused ? '#10b981' : '#f1f5f9',
                                                                '&:hover': {
                                                                    borderColor: '#10b981'
                                                                }
                                                            }),
                                                            multiValue: (base) => ({
                                                                ...base,
                                                                backgroundColor: '#ecfdf5',
                                                                borderRadius: '6px',
                                                                padding: '2px 4px'
                                                            }),
                                                            multiValueLabel: (base) => ({
                                                                ...base,
                                                                color: '#059669',
                                                                fontWeight: '600',
                                                                fontSize: '0.75rem'
                                                            }),
                                                            multiValueRemove: (base) => ({
                                                                ...base,
                                                                color: '#059669',
                                                                '&:hover': {
                                                                    backgroundColor: '#059669',
                                                                    color: 'white',
                                                                    borderRadius: '4px'
                                                                }
                                                            })
                                                        }}
                                                    />
                                                    <button
                                                        className="btn w-100 rounded-3 shadow-sm hover-lift text-white fw-bold py-2 mt-auto d-flex align-items-center justify-content-center"
                                                        style={{ background: 'linear-gradient(to right, #10b981, #059669)', border: 'none', fontSize: '0.85rem' }}
                                                        onClick={() => handleSaveSetting('tuition_auto_assign_user')}
                                                        disabled={isSaving}
                                                    >
                                                        {isSaving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-user-plus me-2"></i>}
                                                        Update Assignment
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Status Change Auto Assign */}
                                            <div className="col-12 col-md-6 col-lg-3">
                                                <div className="bg-white p-3 rounded-4 shadow-sm border-start border-warning border-4 h-100">
                                                    <div className="d-flex align-items-center mb-3">
                                                        <div className="bg-warning-subtle text-warning p-2 rounded-circle me-3">
                                                            <i className="fas fa-exchange-alt"></i>
                                                        </div>
                                                        <div>
                                                            <h5 className="mb-0 fw-bold" style={{ fontSize: '0.85rem' }}>Status Change</h5>
                                                            <p className="text-muted extra-small mb-0" style={{ fontSize: '0.65rem', lineHeight: '1.2' }}>Given Number, Guardian Meet, Demo Running</p>
                                                        </div>
                                                    </div>
                                                    <Select
                                                        className="mb-3 shadow-sm"
                                                        classNamePrefix="select"
                                                        isMulti
                                                        value={userOptions.filter(opt => (selectedAssignments.status_change_auto_assign_user || []).includes(opt.value))}
                                                        onChange={(selected) => handleChange('status_change_auto_assign_user', selected ? selected.map(opt => opt.value) : [])}
                                                        options={userOptions}
                                                        placeholder="Add personnel..."
                                                        isClearable
                                                        isDisabled={isSaving}
                                                        menuPosition="fixed"
                                                        styles={{
                                                            control: (base, state) => ({
                                                                ...base,
                                                                border: '2px solid #f1f5f9',
                                                                backgroundColor: 'white',
                                                                borderRadius: '0.75rem',
                                                                padding: '2px',
                                                                minHeight: 'auto',
                                                                boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(245, 158, 11, 0.1)' : 'none',
                                                                borderColor: state.isFocused ? '#f59e0b' : '#f1f5f9',
                                                                '&:hover': {
                                                                    borderColor: '#f59e0b'
                                                                }
                                                            }),
                                                            multiValue: (base) => ({
                                                                ...base,
                                                                backgroundColor: '#fffbeb',
                                                                borderRadius: '6px',
                                                                padding: '2px 4px'
                                                            }),
                                                            multiValueLabel: (base) => ({
                                                                ...base,
                                                                color: '#d97706',
                                                                fontWeight: '600',
                                                                fontSize: '0.75rem'
                                                            }),
                                                            multiValueRemove: (base) => ({
                                                                ...base,
                                                                color: '#d97706',
                                                                '&:hover': {
                                                                    backgroundColor: '#d97706',
                                                                    color: 'white',
                                                                    borderRadius: '4px'
                                                                }
                                                            })
                                                        }}
                                                    />
                                                    <button
                                                        className="btn w-100 rounded-3 shadow-sm hover-lift text-white fw-bold py-2 mt-auto d-flex align-items-center justify-content-center"
                                                        style={{ background: 'linear-gradient(to right, #f59e0b, #d97706)', border: 'none', fontSize: '0.85rem' }}
                                                        onClick={() => handleSaveSetting('status_change_auto_assign_user')}
                                                        disabled={isSaving}
                                                    >
                                                        {isSaving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-user-plus me-2"></i>}
                                                        Update Assignment
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Cancel Status Change Auto Assign */}
                                            <div className="col-12 col-md-6 col-lg-3">
                                                <div className="bg-white p-3 rounded-4 shadow-sm border-start border-danger border-4 h-100">
                                                    <div className="d-flex align-items-center mb-3">
                                                        <div className="bg-danger-subtle text-danger p-2 rounded-circle me-3">
                                                            <i className="fas fa-times-circle"></i>
                                                        </div>
                                                        <div>
                                                            <h5 className="mb-0 fw-bold" style={{ fontSize: '0.85rem' }}>Cancel Status</h5>
                                                            <p className="text-muted extra-small mb-0" style={{ fontSize: '0.65rem', lineHeight: '1.2' }}>Tuition status change to Cancel</p>
                                                        </div>
                                                    </div>
                                                    <Select
                                                        className="mb-3 shadow-sm"
                                                        classNamePrefix="select"
                                                        isMulti
                                                        value={userOptions.filter(opt => (selectedAssignments.cancel_status_change_auto_assign_user || []).includes(opt.value))}
                                                        onChange={(selected) => handleChange('cancel_status_change_auto_assign_user', selected ? selected.map(opt => opt.value) : [])}
                                                        options={userOptions}
                                                        placeholder="Add personnel..."
                                                        isClearable
                                                        isDisabled={isSaving}
                                                        menuPosition="fixed"
                                                        styles={{
                                                            control: (base, state) => ({
                                                                ...base,
                                                                border: '2px solid #f1f5f9',
                                                                backgroundColor: 'white',
                                                                borderRadius: '0.75rem',
                                                                padding: '2px',
                                                                minHeight: 'auto',
                                                                boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(220, 53, 69, 0.1)' : 'none',
                                                                borderColor: state.isFocused ? '#dc3545' : '#f1f5f9',
                                                                '&:hover': {
                                                                    borderColor: '#dc3545'
                                                                }
                                                            }),
                                                            multiValue: (base) => ({
                                                                ...base,
                                                                backgroundColor: '#f8d7da',
                                                                borderRadius: '6px',
                                                                padding: '2px 4px'
                                                            }),
                                                            multiValueLabel: (base) => ({
                                                                ...base,
                                                                color: '#dc3545',
                                                                fontWeight: '600',
                                                                fontSize: '0.75rem'
                                                            }),
                                                            multiValueRemove: (base) => ({
                                                                ...base,
                                                                color: '#dc3545',
                                                                '&:hover': {
                                                                    backgroundColor: '#dc3545',
                                                                    color: 'white',
                                                                    borderRadius: '4px'
                                                                }
                                                            })
                                                        }}
                                                    />
                                                    <button
                                                        className="btn w-100 rounded-3 shadow-sm hover-lift text-white fw-bold py-2 mt-auto d-flex align-items-center justify-content-center"
                                                        style={{ background: 'linear-gradient(to right, #dc3545, #b02a37)', border: 'none', fontSize: '0.85rem' }}
                                                        onClick={() => handleSaveSetting('cancel_status_change_auto_assign_user')}
                                                        disabled={isSaving}
                                                    >
                                                        {isSaving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-user-plus me-2"></i>}
                                                        Update Assignment
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Settings Summary List */}
                                <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                                    <div className="card-header py-3 px-4 border-0 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3"
                                        style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)', color: 'white' }}>
                                        <div>
                                            <h3 className="mb-0 fw-bold fs-5">
                                                <i className="fas fa-tasks me-2 text-warning"></i>
                                                System Configuration Overview
                                            </h3>
                                            <p className="mb-0 opacity-75 extra-small">Detailed view of currently active automation rules</p>
                                        </div>
                                        <div className="position-relative w-100" style={{ maxWidth: '250px' }}>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm ps-4 rounded-pill border-0 shadow-sm"
                                                placeholder="Filter settings..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            <i className="fas fa-search position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem' }}></i>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="table-responsive">
                                            <table className="table table-hover mb-0">
                                                <thead className="bg-white border-bottom">
                                                    <tr>
                                                        <th className="px-4 py-2 border-0 text-muted text-uppercase extra-small fw-bold" style={{ letterSpacing: '0.5px' }}>Configuration Key</th>
                                                        <th className="px-4 py-2 border-0 text-muted text-uppercase extra-small fw-bold" style={{ letterSpacing: '0.5px' }}>Assigned Personnel</th>
                                                        <th className="px-4 py-2 border-0 text-end text-muted text-uppercase extra-small fw-bold" style={{ letterSpacing: '0.5px' }}>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredSettings.length > 0 ? filteredSettings.map((s, index) => (
                                                        <tr key={index} className="align-middle">
                                                            <td className="px-4 py-2">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-light p-2 rounded-3 me-3 text-secondary" style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                        <i className={s.key.includes('payment') ? 'fas fa-credit-card' : (s.key.includes('tuition') || s.key.includes('status_change')) ? 'fas fa-graduation-cap' : 'fas fa-sync-alt'}></i>
                                                                    </div>
                                                                    <span className="fw-semibold text-dark text-capitalize" style={{ fontSize: '0.85rem' }}>
                                                                        {s.key === 'status_change_auto_assign_user'
                                                                            ? 'Tuition status change auto assign user (Given Number, Guardian Meet, Demo class Running)'
                                                                            : s.key === 'cancel_status_change_auto_assign_user'
                                                                                ? 'Tuition status change auto assign user (Cancel)'
                                                                                : s.key.replace(/_/g, ' ')}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <div className="d-flex flex-wrap gap-2">
                                                                    {(() => {
                                                                        const values = Array.isArray(s.value) ? s.value : (s.value ? [s.value] : []);
                                                                        if (values.length === 0) return <span className="text-muted extra-small italic">Not assigned</span>;

                                                                        return values.map((val, i) => {
                                                                            const user = users.find(u => u.username === val || u._id === val);
                                                                            const name = user ? user.username : (typeof val === 'string' ? val : 'Unknown');

                                                                            return (
                                                                                <div
                                                                                    key={i}
                                                                                    className="badge bg-light text-dark border rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 shadow-sm transition-all"
                                                                                    style={{ fontSize: '0.8rem' }}
                                                                                >
                                                                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '20px', height: '20px', fontSize: '10px' }}>
                                                                                        {name.charAt(0).toUpperCase()}
                                                                                    </div>
                                                                                    {name}
                                                                                    <button
                                                                                        className="btn btn-link p-0 text-danger hover-scale transition-all"
                                                                                        onClick={() => handleRemoveUser(s.key, val)}
                                                                                        title="Remove User"
                                                                                        disabled={isSaving}
                                                                                    >
                                                                                        {removingTarget?.key === s.key && removingTarget?.userId === val ? (
                                                                                            <span className="spinner-border spinner-border-sm" style={{ width: '12px', height: '12px' }}></span>
                                                                                        ) : (
                                                                                            <i className="fas fa-times-circle"></i>
                                                                                        )}
                                                                                    </button>
                                                                                </div>
                                                                            );
                                                                        });
                                                                    })()}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-end">
                                                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2">
                                                                    <i className="fas fa-circle me-1 small"></i>
                                                                    Active
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan="3" className="text-center py-4 text-muted small">
                                                                {searchTerm ? `No results matching "${searchTerm}"` : 'No active configurations found.'}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : activeTab === 'area' ? (
                            <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                                <div className="card-header py-3 px-4 border-0" style={{ background: 'linear-gradient(135deg, #198754 0%, #157347 100%)', color: 'white' }}>
                                    <h2 className="mb-0 fw-bold d-flex align-items-center fs-4">
                                        <i className="fas fa-map-marked-alt me-3"></i>
                                        Area Grouping
                                    </h2>
                                    <p className="mb-0 opacity-80 extra-small">Create and manage regional area clusters</p>
                                </div>
                                <div className="card-body p-4 bg-white">
                                    {/* Create/Edit New Group */}
                                    <div className={`p-4 rounded-4 mb-4 border shadow-sm transition-all ${isEditingArea !== null ? 'bg-warning-subtle border-warning' : 'bg-light border-success-subtle'}`}>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className={`fw-bold mb-0 ${isEditingArea !== null ? 'text-warning-emphasis' : 'text-success'}`}>
                                                {isEditingArea !== null ? <><i className="fas fa-edit me-2"></i>Edit Area Group</> : <><i className="fas fa-plus-circle me-2"></i>Create New Area Group</>}
                                            </h5>
                                            {isEditingArea !== null && (
                                                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => { setIsEditingArea(null); setNewGroup({ name: '', areas: [] }); }}>
                                                    Cancel Edit
                                                </button>
                                            )}
                                        </div>
                                        <div className="row g-3 align-items-end">
                                            <div className="col-12 col-md-4">
                                                <label className="form-label fw-semibold text-secondary small">Group Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control rounded-3 border-0 shadow-sm"
                                                    placeholder="e.g. South Zone"
                                                    value={newGroup.name}
                                                    onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                                                    disabled={isSaving}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label fw-semibold text-secondary small">Select Areas</label>
                                                <Select
                                                    isMulti
                                                    options={allAvailableAreas}
                                                    className="shadow-sm"
                                                    classNamePrefix="select"
                                                    value={allAvailableAreas.filter(opt => newGroup.areas.includes(opt.value))}
                                                    onChange={(selected) => setNewGroup(prev => ({ ...prev, areas: selected ? selected.map(o => o.value) : [] }))}
                                                    placeholder="Pick areas..."
                                                    isDisabled={isSaving}
                                                    styles={{
                                                        control: (base) => ({
                                                            ...base,
                                                            borderRadius: '0.75rem',
                                                            border: 'none',
                                                            padding: '2px'
                                                        })
                                                    }}
                                                />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <button
                                                    className={`btn w-100 rounded-3 fw-bold py-2 shadow-sm hover-lift d-flex align-items-center justify-content-center ${isEditingArea !== null ? 'btn-warning' : 'btn-success'}`}
                                                    onClick={addAreaGroup}
                                                    disabled={isSaving}
                                                >
                                                    {isSaving ? (
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                    ) : (
                                                        <i className={`fas ${isEditingArea !== null ? 'fa-save' : 'fa-plus'} me-2`}></i>
                                                    )}
                                                    {isEditingArea !== null ? 'Update' : 'Create'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Existing Groups List */}
                                    <div className="table-responsive rounded-4 border">
                                        <table className="table table-hover mb-0">
                                            <thead className="bg-light border-bottom">
                                                <tr>
                                                    <th className="px-4 py-3 border-0 text-muted extra-small fw-bold">Group Name</th>
                                                    <th className="px-4 py-3 border-0 text-muted extra-small fw-bold">Areas</th>
                                                    <th className="px-4 py-3 border-0 text-end text-muted extra-small fw-bold">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {areaGroups.length > 0 ? areaGroups.map((group, idx) => (
                                                    <tr key={idx} className="align-middle">
                                                        <td className="px-4 py-3">
                                                            <span className="fw-bold text-dark">{group.name}</span>
                                                            <div className="text-muted extra-small">{group.areas.length} areas included</div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="d-flex flex-wrap gap-1">
                                                                {group.areas.map((area, aIdx) => (
                                                                    <div key={aIdx} className="area-capsule" style={{ background: '#ecfdf5', borderColor: '#d1fae5', color: '#065f46' }}>
                                                                        <span>{area}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-end">
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <button
                                                                    className="btn btn-outline-primary btn-sm rounded-pill px-3 hover-lift"
                                                                    onClick={() => editAreaGroup(idx)}
                                                                    disabled={isSaving}
                                                                >
                                                                    <i className="fas fa-edit me-1"></i> Edit
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm rounded-pill px-3 hover-lift d-flex align-items-center justify-content-center"
                                                                    onClick={() => deleteAreaGroup(idx)}
                                                                    disabled={isSaving}
                                                                >
                                                                    {isSaving && deletingGroupIdx === idx ? (
                                                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                                                    ) : (
                                                                        <i className="fas fa-trash-alt me-1"></i>
                                                                    )}
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="3" className="text-center py-5 text-muted">
                                                            <i className="fas fa-map-marker-alt opacity-25 mb-3 d-block" style={{ fontSize: '3rem' }}></i>
                                                            <p className="mb-0">No area groups created yet.</p>
                                                            <small>Use the form above to cluster areas into zones.</small>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'cityArea' ? (
                            <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                                <div className="card-header py-3 px-4 border-0 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3"
                                    style={{ background: 'linear-gradient(135deg, #0dcaf0 0%, #087990 100%)', color: 'white' }}>
                                    <div>
                                        <h2 className="mb-0 fw-bold d-flex align-items-center fs-4">
                                            <i className="fas fa-city me-3"></i>
                                            City & Area Setup
                                        </h2>
                                        <p className="mb-0 opacity-80 extra-small">Create and manage Cities and their corresponding Areas</p>
                                    </div>
                                    <div className="position-relative w-100" style={{ maxWidth: '250px' }}>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm ps-4 rounded-pill border-0 shadow-sm"
                                            placeholder="Search City or Area..."
                                            value={cityAreaSearch}
                                            onChange={(e) => setCityAreaSearch(e.target.value)}
                                        />
                                        <i className="fas fa-search position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem' }}></i>
                                    </div>
                                </div>
                                <div className="card-body p-4 bg-white">
                                    <div className="row g-3 mb-4">
                                        {/* 1. Create New City */}
                                        <div className="col-12 col-xl-4">
                                            <div className="p-3 rounded-4 border shadow-sm transition-all bg-light border-info-subtle h-100">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <h6 className="fw-bold mb-0 text-info">
                                                        <i className="fas fa-plus-circle me-2"></i>Create New City
                                                    </h6>
                                                </div>
                                                <div className="row g-2 align-items-end">
                                                    <div className="col-12 col-sm-8">
                                                        <label className="form-label fw-semibold text-secondary small mb-1">City Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm rounded-3 border-0 shadow-sm"
                                                            placeholder="e.g. Dhaka"
                                                            value={newCityNameOnly}
                                                            onChange={(e) => setNewCityNameOnly(e.target.value)}
                                                            disabled={isSaving}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-sm-4">
                                                        <button
                                                            className="btn btn-info btn-sm text-white w-100 rounded-3 fw-bold shadow-sm hover-lift d-flex align-items-center justify-content-center"
                                                            onClick={createOnlyCity}
                                                            disabled={isSaving}
                                                        >
                                                            {isSaving ? (
                                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                            ) : (
                                                                <i className="fas fa-save me-1"></i>
                                                            )}
                                                            Create City
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 2. Add Areas to City */}
                                        <div className="col-12 col-xl-8">
                                            <div className="p-3 rounded-4 border shadow-sm transition-all bg-light border-primary-subtle h-100">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <h6 className="fw-bold mb-0 text-primary">
                                                        <i className="fas fa-layer-group me-2"></i>Add Areas to City
                                                    </h6>
                                                </div>
                                                <div className="row g-2">
                                                    <div className="col-12 col-sm-4">
                                                        <label className="form-label fw-semibold text-secondary small mb-1">Select City</label>
                                                        <select
                                                            className="form-select form-select-sm rounded-3 border-0 shadow-sm"
                                                            value={selectedCityForArea}
                                                            onChange={(e) => setSelectedCityForArea(e.target.value)}
                                                            disabled={isSaving}
                                                        >
                                                            <option value="">-- City --</option>
                                                            {cityAreas.map((c, idx) => (
                                                                <option key={idx} value={c.cityName}>{c.cityName}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="col-12 col-sm-5">
                                                        <label className="form-label fw-semibold text-secondary small mb-1">Add Area</label>
                                                        <div className="d-flex gap-2">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm rounded-3 border-0 shadow-sm"
                                                                placeholder="e.g. Mirpur"
                                                                value={areaInput}
                                                                onChange={(e) => setAreaInput(e.target.value)}
                                                                onKeyPress={(e) => { if (e.key === 'Enter') handleAddAreaToDraftList(); }}
                                                                disabled={isSaving}
                                                            />
                                                            <button
                                                                className="btn btn-primary btn-sm rounded-3 px-3 shadow-sm"
                                                                onClick={handleAddAreaToDraftList}
                                                                disabled={isSaving || !areaInput.trim()}
                                                            >
                                                                Add
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-3 d-flex align-items-end">
                                                        <button
                                                            className="btn btn-primary btn-sm w-100 rounded-3 fw-bold shadow-sm hover-lift d-flex align-items-center justify-content-center"
                                                            onClick={saveAreasToSelectedCity}
                                                            disabled={isSaving}
                                                        >
                                                            {isSaving ? (
                                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                            ) : (
                                                                <i className="fas fa-save me-1"></i>
                                                            )}
                                                            Save Areas
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Added Areas List */}
                                                {newAreasList.length > 0 && (
                                                    <div className="mt-2 pt-2 border-top border-primary-subtle">
                                                        <div className="d-flex flex-wrap gap-1">
                                                            {newAreasList.map((area, idx) => (
                                                                <div key={idx} className="area-capsule" style={{ background: '#eef2ff', borderColor: '#e0e7ff', color: '#4338ca' }}>
                                                                    <span>{area}</span>
                                                                    <button
                                                                        className="delete-area-btn"
                                                                        onClick={() => handleRemoveAreaFromDraftList(idx)}
                                                                        title="Remove from list"
                                                                    >
                                                                        <i className="fas fa-times"></i>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Existing Cities List */}
                                    <div className="table-responsive rounded-4 border">
                                        <table className="table table-hover mb-0">
                                            <thead className="bg-light border-bottom">
                                                <tr>
                                                    <th className="px-4 py-3 border-0 text-muted extra-small fw-bold">City Name</th>
                                                    <th className="px-4 py-3 border-0 text-muted extra-small fw-bold">Areas</th>
                                                    <th className="px-4 py-3 border-0 text-end text-muted extra-small fw-bold">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cityAreas.length > 0 ? cityAreas
                                                    .map((city, realIdx) => ({ ...city, realIdx }))
                                                    .filter(city => {
                                                        const term = cityAreaSearch.toLowerCase();
                                                        return city.cityName.toLowerCase().includes(term) || (city.areas || []).some(a => a.toLowerCase().includes(term));
                                                    })
                                                    .map((city, displayIdx) => {
                                                        const idx = city.realIdx;
                                                        return (
                                                            <tr key={displayIdx} className="align-middle">
                                                                <td className="px-4 py-3">
                                                                    <span className="fw-bold text-dark">{city.cityName}</span>
                                                                    <div className="text-muted extra-small">{city.areas?.length || 0} areas</div>
                                                                </td>
                                                                <td className="px-4 py-3" style={{ minWidth: '400px' }}>
                                                                    <div className="d-flex flex-wrap gap-1">
                                                                        {(() => {
                                                                            const allAreas = city.areas || [];
                                                                            const searchTerm = cityAreaSearch.toLowerCase();
                                                                            const filteredAreas = searchTerm
                                                                                ? allAreas.filter(a => a.toLowerCase().includes(searchTerm))
                                                                                : allAreas;

                                                                            return (
                                                                                <>
                                                                                    {filteredAreas.map((area, aIdx) => {
                                                                                        const actualIdx = allAreas.indexOf(area);
                                                                                        return (
                                                                                            <div key={aIdx} className="area-capsule">
                                                                                                <span>{area}</span>
                                                                                                <button
                                                                                                    className="delete-area-btn"
                                                                                                    onClick={() => deleteAreaFromCity(idx, actualIdx)}
                                                                                                    disabled={isSaving}
                                                                                                    title="Remove area"
                                                                                                >
                                                                                                    {isSaving && deletingAreaTarget?.cIdx === idx && deletingAreaTarget?.aIdx === actualIdx ? (
                                                                                                        <span className="spinner-border spinner-border-sm" style={{ width: '0.8rem', height: '0.8rem' }}></span>
                                                                                                    ) : (
                                                                                                        <i className="fas fa-times"></i>
                                                                                                    )}
                                                                                                </button>
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                                    {filteredAreas.length === 0 && (
                                                                                        <span className="text-muted small italic p-2">No areas found</span>
                                                                                    )}
                                                                                </>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-end">
                                                                    <div className="d-flex justify-content-end gap-2">
                                                                        <button
                                                                            className="btn btn-outline-danger btn-sm rounded-pill px-3 hover-lift d-flex align-items-center justify-content-center"
                                                                            onClick={() => deleteCityArea(idx)}
                                                                            disabled={isSaving}
                                                                        >
                                                                            {isSaving && deletingCityIdx === idx ? (
                                                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                                            ) : (
                                                                                <i className="fas fa-trash-alt me-1"></i>
                                                                            )}
                                                                            Delete City
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }) : (
                                                    <tr>
                                                        <td colSpan="3" className="text-center py-5 text-muted">
                                                            <i className="fas fa-city opacity-25 mb-3 d-block" style={{ fontSize: '3rem' }}></i>
                                                            <p className="mb-0">{cityAreaSearch ? 'No results matching your search.' : 'No City/Areas configured yet.'}</p>
                                                            <small>{cityAreaSearch ? 'Try a different search term.' : 'Use the form above to add your first City and its Areas.'}</small>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'guidelines' ? (
                            <div className="card border-0 shadow-lg overflow-hidden bangla-font" style={{ borderRadius: '20px' }}>
                                <div className="card-header py-3 px-4 border-0 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3"
                                    style={{ background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)', color: 'white' }}>
                                    <div>
                                        <h2 className="mb-0 fw-bold d-flex align-items-center fs-4">
                                            <i className="fas fa-comment-dots me-3 text-dark"></i>
                                            <span className="text-dark">রেসপন্স গাইডলাইন (Response Guidelines)</span>
                                        </h2>
                                        <p className="mb-0 text-dark opacity-80 extra-small">Add preset scenarios and guidelines for employees to reply to queries</p>
                                    </div>
                                </div>
                                <div className="card-body p-4 bg-white">
                                    {/* Create/Edit Guidelines Form */}
                                    <div className={`p-4 rounded-4 mb-4 border shadow-sm transition-all ${isEditingGuideline !== null ? 'bg-warning-subtle border-warning' : 'bg-light border-warning-subtle'}`}>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className={`fw-bold mb-0 text-dark`}>
                                                {isEditingGuideline !== null ? <><i className="fas fa-edit me-2 text-warning"></i>গাইডলাইন এডিট করুন (Edit Guideline)</> : <><i className="fas fa-plus-circle me-2 text-success"></i>নতুন গাইডলাইন যোগ করুন (Create Guideline)</>}
                                            </h5>
                                            {isEditingGuideline !== null && (
                                                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => { setIsEditingGuideline(null); setNewGuideline({ topic: '', reply: '' }); }}>
                                                    Cancel Edit
                                                </button>
                                            )}
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-12 col-md-5">
                                                <label className="form-label fw-semibold text-secondary small">টপিক / বিষয় / প্রশ্ন (Topic or Scenario Query)</label>
                                                <input
                                                    type="text"
                                                    className="form-control rounded-3 border-0 shadow-sm font-sans"
                                                    placeholder="যেমন: শিক্ষক রিফান্ড চাইলে..."
                                                    value={newGuideline.topic}
                                                    onChange={(e) => setNewGuideline(prev => ({ ...prev, topic: e.target.value }))}
                                                    disabled={isSaving}
                                                />
                                            </div>
                                            <div className="col-12 col-md-5">
                                                <label className="form-label fw-semibold text-secondary small">preset উত্তর / রেসপন্স (Preset Reply Guideline)</label>
                                                <textarea
                                                    className="form-control rounded-3 border-0 shadow-sm font-sans"
                                                    placeholder="যেমন: ৩ দিনের মধ্যে দিচ্ছি।"
                                                    rows="1"
                                                    value={newGuideline.reply}
                                                    onChange={(e) => setNewGuideline(prev => ({ ...prev, reply: e.target.value }))}
                                                    disabled={isSaving}
                                                    style={{ resize: 'none' }}
                                                />
                                            </div>
                                            <div className="col-12 col-md-2 d-flex align-items-end">
                                                <button
                                                    className={`btn w-100 rounded-3 fw-bold py-2 shadow-sm hover-lift d-flex align-items-center justify-content-center text-white ${isEditingGuideline !== null ? 'btn-warning' : 'btn-success'}`}
                                                    onClick={addGuideline}
                                                    disabled={isSaving}
                                                >
                                                    {isSaving ? (
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                    ) : (
                                                        <i className={`fas ${isEditingGuideline !== null ? 'fa-save' : 'fa-plus'} me-2`}></i>
                                                    )}
                                                    {isEditingGuideline !== null ? 'Update' : 'Add'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Existing Guidelines List */}
                                    <div className="table-responsive rounded-4 border">
                                        <table className="table table-hover mb-0">
                                            <thead className="bg-light border-bottom">
                                                <tr>
                                                    <th className="px-4 py-3 border-0 text-muted extra-small fw-bold" style={{ width: '40%' }}>টপিক / বিষয় (Topic / Scenario)</th>
                                                    <th className="px-4 py-3 border-0 text-muted extra-small fw-bold" style={{ width: '45%' }}>preset উত্তর (Preset Reply)</th>
                                                    <th className="px-4 py-3 border-0 text-end text-muted extra-small fw-bold" style={{ width: '15%' }}>অ্যাকশন (Actions)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {guidelines.length > 0 ? guidelines.map((g, idx) => (
                                                    <tr key={idx} className="align-middle">
                                                        <td className="px-4 py-3">
                                                            <span className="fw-bold text-dark font-sans">{g.topic}</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-secondary font-sans">{g.reply}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-end">
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <button
                                                                    className="btn btn-outline-primary btn-sm rounded-pill px-3 hover-lift"
                                                                    onClick={() => editGuideline(idx)}
                                                                    disabled={isSaving}
                                                                >
                                                                    <i className="fas fa-edit me-1"></i> Edit
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm rounded-pill px-3 hover-lift d-flex align-items-center justify-content-center"
                                                                    onClick={() => deleteGuideline(idx)}
                                                                    disabled={isSaving}
                                                                >
                                                                    {isSaving && deletingGuidelineIdx === idx ? (
                                                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                                                    ) : (
                                                                        <i className="fas fa-trash-alt me-1"></i>
                                                                    )}
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="3" className="text-center py-5 text-muted">
                                                            <i className="fas fa-comment-slash opacity-25 mb-3 d-block" style={{ fontSize: '3rem' }}></i>
                                                            <p className="mb-0">কোনো গাইডলাইন এখনও তৈরি করা হয়নি।</p>
                                                            <small>উপরের ফর্মটি ব্যবহার করে আপনার প্রথম রেসপন্স গাইডলাইন তৈরি করুন।</small>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'mediums' ? (
                            <div className="card border-0 shadow-sm mb-3 overflow-hidden" style={{ borderRadius: '12px' }}>
                                <div className="card-header py-3 px-4 border-0" style={{ background: 'linear-gradient(135deg, #475569 0%, #334155 100%)', color: 'white' }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h2 className="mb-0 fw-bold d-flex align-items-center fs-5">
                                                <i className="fas fa-bullhorn me-2"></i>
                                                Marketing Mediums
                                            </h2>
                                            <p className="mb-0 opacity-80" style={{ fontSize: '0.7rem' }}>Manage options for "How did you hear about us?"</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body p-3 bg-white">
                                    <div className={`p-3 rounded-3 mb-3 border shadow-sm transition-all ${isEditingMedium !== null ? 'bg-warning-subtle border-warning' : 'bg-light border-secondary-subtle'}`}>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5 className={`fw-bold mb-0 text-dark`}>
                                                {isEditingMedium !== null ? <><i className="fas fa-edit me-2 text-warning"></i>Edit Medium</> : <><i className="fas fa-plus-circle me-2 text-success"></i>Add New Medium</>}
                                            </h5>
                                            {isEditingMedium !== null && (
                                                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => { setIsEditingMedium(null); setNewMedium(''); }}>
                                                    Cancel Edit
                                                </button>
                                            )}
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-12 col-md-10">
                                                <label className="form-label fw-semibold text-secondary small">Medium Name (e.g. Facebook Advertisement, Street Poster)</label>
                                                <input
                                                    type="text"
                                                    className="form-control rounded-3 border-0 shadow-sm font-sans"
                                                    placeholder="e.g. Facebook Advertisement"
                                                    value={newMedium}
                                                    onChange={(e) => setNewMedium(e.target.value)}
                                                    disabled={isSaving}
                                                />
                                            </div>
                                            <div className="col-12 col-md-2 d-flex align-items-end">
                                                <button
                                                    className={`btn w-100 rounded-3 fw-bold py-2 shadow-sm hover-lift d-flex align-items-center justify-content-center text-white ${isEditingMedium !== null ? 'btn-warning' : 'btn-success'}`}
                                                    onClick={addMedium}
                                                    disabled={isSaving}
                                                >
                                                    {isSaving ? (
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                    ) : (
                                                        <i className={`fas ${isEditingMedium !== null ? 'fa-save' : 'fa-plus'} me-2`}></i>
                                                    )}
                                                    {isEditingMedium !== null ? 'Update' : 'Add'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-responsive rounded-3 border">
                                        <table className="table table-sm table-hover mb-0">
                                            <thead className="bg-light border-bottom">
                                                <tr>
                                                    <th className="px-4 py-2 border-0 text-muted fw-bold">Medium Name</th>
                                                    <th className="px-4 py-2 border-0 text-end text-muted fw-bold" style={{ width: '20%' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {marketingMediums.length > 0 ? marketingMediums.map((m, idx) => (
                                                    <tr key={idx} className="align-middle">
                                                        <td className="px-4 py-2">
                                                            <span className="fw-semibold text-dark font-sans">{m}</span>
                                                        </td>
                                                        <td className="px-4 py-2 text-end">
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <button
                                                                    className="btn btn-outline-primary btn-sm rounded-pill hover-lift px-3"
                                                                    onClick={() => editMedium(idx)}
                                                                    disabled={isSaving}
                                                                >
                                                                    <i className="fas fa-edit me-1"></i> Edit
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm rounded-pill hover-lift px-3 d-flex align-items-center justify-content-center"
                                                                    onClick={() => deleteMedium(idx)}
                                                                    disabled={isSaving}
                                                                >
                                                                    {isSaving && deletingMediumIdx === idx ? (
                                                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                                                    ) : (
                                                                        <i className="fas fa-trash-alt me-1"></i>
                                                                    )}
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="2" className="text-center py-4 text-muted">
                                                            <i className="fas fa-bullhorn opacity-25 mb-3 d-block" style={{ fontSize: '3rem' }}></i>
                                                            <p className="mb-0">No marketing mediums added yet.</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'generator' && role === 'superadmin' ? (
                            <div className="p-2">
                                <PosterGenerator />
                            </div>
                        ) : null}
                    </div>
                </div>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
                    
                    .bangla-font,
                    .bangla-font *:not(.fas) {
                        font-family: 'Hind Siliguri', sans-serif !important;
                    }

                    .hover-lift {
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                    }
                    .hover-lift:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
                    }
                    .user-pill-hover {
                        cursor: default;
                        transition: all 0.2s ease;
                    }
                    .user-pill-hover:hover {
                        transform: scale(1.05);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                        background-color: #f8fafc !important;
                        z-index: 1;
                    }
                    .hover-danger:hover {
                        color: #dc3545 !important;
                        transform: scale(1.2);
                    }
                    .transition-all {
                        transition: all 0.2s ease-in-out;
                    }
                    .hover-bg-white:hover {
                        background-color: white !important;
                        color: #0d6efd !important;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    }
                    .italic {
                        font-style: italic;
                    }
                    .rounded-4 { border-radius: 1rem !important; }
                    .bg-primary-subtle { background-color: #cfe2ff; }
                    .bg-success-subtle { background-color: #d1e7dd; }
                    .bg-warning-subtle { background-color: #fff3cd; }
                    .badge { font-size: 0.65rem; letter-spacing: 0.5px; }
                    .extra-small { font-size: 0.75rem; }

                    /* Area Capsule Redesign */
                    .area-capsule {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        padding: 4px 12px;
                        background: #ffffff;
                        border: 1px solid #e2e8f0;
                        border-radius: 10px;
                        font-size: 0.8rem;
                        font-weight: 500;
                        color: #334155;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                        margin: 3px;
                    }
                    .area-capsule:hover {
                        transform: translateY(-2px);
                        border-color: #0ea5e9;
                        color: #0284c7;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                        background: #f0f9ff;
                    }
                    .area-capsule .delete-area-btn {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 22px;
                        height: 22px;
                        border-radius: 50%;
                        background: transparent;
                        color: #94a3b8;
                        border: none;
                        transition: all 0.2s;
                        padding: 0;
                        cursor: pointer;
                    }
                    .area-capsule:hover .delete-area-btn {
                        color: #ef4444;
                        background: #fee2e2;
                    }
                    .area-capsule .delete-area-btn:hover {
                        transform: rotate(90deg) scale(1.1);
                        background: #ef4444;
                        color: white;
                    }
                    .area-search-wrapper {
                        position: relative;
                        margin-bottom: 12px;
                        max-width: 300px;
                    }
                    .area-search-wrapper input {
                        padding-left: 35px;
                        border-radius: 12px;
                        border: 2px solid #f1f5f9;
                        font-size: 0.85rem;
                        height: 38px;
                        background: #f8fafc;
                        transition: all 0.2s;
                    }
                    .area-search-wrapper input:focus {
                        background: white;
                        border-color: #0ea5e9;
                        box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
                        outline: none;
                    }
                    .show-more-areas {
                        font-size: 0.8rem;
                        font-weight: 700;
                        color: #0284c7;
                        background: #f0f9ff;
                        border: 2px dashed #bae6fd;
                        border-radius: 12px;
                        padding: 6px 16px;
                        cursor: pointer;
                        transition: all 0.2s;
                        margin: 4px;
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                    }
                    .show-more-areas:hover {
                        background: #e0f2fe;
                        border-style: solid;
                        border-color: #0ea5e9;
                        color: #0369a1;
                        transform: scale(1.02);
                    }

                    @media (max-width: 768px) {
                        .settings-sidebar {
                            position: fixed;
                            top: 0;
                            left: -170px;
                            height: 100vh !important;
                            background: white;
                            z-index: 1050;
                            transition: all 0.3s ease;
                            padding-top: 20px;
                            box-shadow: 0 0 15px rgba(0,0,0,0.1);
                        }
                        .settings-sidebar.active {
                            left: 0;
                        }
                        .table-responsive {
                            font-size: 0.8rem;
                        }
                        .card-header h2 {
                            font-size: 1.2rem !important;
                        }
                        .card-header h3 {
                            font-size: 1.1rem !important;
                        }
                    }
                `}</style>

                {/* Delete City Confirmation Modal */}
                <Modal show={showDeleteCityModal} onHide={() => setShowDeleteCityModal(false)} centered backdrop="static" className="bangla-font">
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="text-danger fw-bold fs-5">
                            <i className="fas fa-exclamation-triangle me-2"></i>শহর ডিলিট করুন
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="mb-2">আপনি <strong className="text-dark font-sans">{cityToDelete?.cityName}</strong> শহর এবং এর আওতাভুক্ত সকল এরিয়া ডিলিট করতে যাচ্ছেন।</p>
                        <p className="text-danger small fw-bold mb-4">ডিলিট হলে আর ফেরত পাওয়া যাবে না।</p>
                        <Form.Group>
                            <Form.Label className="small fw-semibold text-secondary">নিশ্চিত করতে অনুগ্রহ করে <strong className="text-dark font-sans">{cityToDelete?.cityName}</strong> লিখুন:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="এখানে শহরের নাম লিখুন..."
                                value={deleteCityInput}
                                onChange={(e) => setDeleteCityInput(e.target.value)}
                                className="rounded-3 border-secondary-subtle font-sans"
                                autoComplete="off"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="light" className="rounded-pill px-4 text-secondary fw-bold" onClick={() => setShowDeleteCityModal(false)}>
                            বাতিল
                        </Button>
                        <Button
                            variant="danger"
                            className="rounded-pill px-4 d-flex align-items-center fw-bold"
                            onClick={confirmDeleteCityArea}
                            disabled={deleteCityInput.trim() !== cityToDelete?.cityName || (isSaving && deletingCityIdx !== null)}
                        >
                            {isSaving && deletingCityIdx !== null ? (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            ) : null}
                            শহর ডিলিট করুন
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </>
    );
};

export default SettingsPage;
