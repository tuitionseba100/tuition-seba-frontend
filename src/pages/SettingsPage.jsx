import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import NavbarPage from './NavbarPage';
import locationData from '../data/locations.json';

const API_BASE_URL = 'https://tuition-seba-backend-1.onrender.com';

const SettingsPage = () => {
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
    const [isSaving, setIsSaving] = useState(false);
    const [selectedAssignments, setSelectedAssignments] = useState({
        payment_auto_assign_user: [],
        tuition_auto_assign_user: [],
        status_change_auto_assign_user: [],
        cancel_status_change_auto_assign_user: []
    });

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

    const deleteAreaGroup = (index) => {
        if (!window.confirm('Are you sure you want to delete this area group?')) return;
        const updated = areaGroups.filter((_, i) => i !== index);
        handleSaveAreaGroups(updated);
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
            <div className="container-fluid p-3">
                <ToastContainer />
                <div className="d-flex g-0">
                    {/* Ultra-Slim Sidebar with Border */}
                    <div className="pe-3 border-end" style={{ width: '170px', flexShrink: 0, minHeight: 'calc(100vh - 100px)' }}>
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{ top: '20px' }}>
                            <div className="card-header border-0 bg-white p-2 px-3">
                                <h6 className="fw-bold mb-0 text-dark">Settings</h6>
                            </div>
                            <div className="card-body p-1 bg-light">
                                <div className="d-flex flex-column gap-1">
                                    <button 
                                        onClick={() => setActiveTab('assignment')}
                                        className={`btn w-100 text-start d-flex align-items-start p-2 px-3 rounded-3 transition-all border-0 ${activeTab === 'assignment' ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-secondary hover-bg-white'}`}
                                    >
                                        <i className={`fas fa-user-tag mt-1 me-2 ${activeTab === 'assignment' ? 'text-white' : 'text-primary'}`} style={{ fontSize: '0.8rem' }}></i>
                                        <span className="fw-bold" style={{ fontSize: '0.7rem', lineHeight: '1.2' }}>Personnel assignment</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => setActiveTab('area')}
                                        className={`btn w-100 text-start d-flex align-items-start p-2 px-3 rounded-3 transition-all border-0 ${activeTab === 'area' ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-secondary hover-bg-white'}`}
                                    >
                                        <i className={`fas fa-map-marked-alt mt-1 me-2 ${activeTab === 'area' ? 'text-white' : 'text-success'}`} style={{ fontSize: '0.8rem' }}></i>
                                        <span className="fw-bold" style={{ fontSize: '0.7rem', lineHeight: '1.2' }}>Area grouping</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-grow-1 ps-4">
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
                                    <div className="col-md-3">
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
                                    <div className="col-md-3">
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
                                    <div className="col-md-3">
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
                                    <div className="col-md-3">
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
                            <div className="card-header py-2 px-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-3" 
                                                                 style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)', color: 'white' }}>
                                <div>
                                    <h3 className="mb-0 fw-bold fs-5">
                                        <i className="fas fa-tasks me-2 text-warning"></i>
                                        System Configuration Overview
                                    </h3>
                                    <p className="mb-0 opacity-75 extra-small">Detailed view of currently active automation rules</p>
                                </div>
                                <div className="position-relative" style={{ width: '250px' }}>
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
                    ) : (
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
                                            <div className="col-md-4">
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
                                            <div className="col-md-6">
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
                                            <div className="col-md-2">
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
                                                                    <span key={aIdx} className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 extra-small">
                                                                        {area}
                                                                    </span>
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
                                                                    className="btn btn-outline-danger btn-sm rounded-pill px-3 hover-lift"
                                                                    onClick={() => deleteAreaGroup(idx)}
                                                                    disabled={isSaving}
                                                                >
                                                                    <i className="fas fa-trash-alt me-1"></i> Delete
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
                        )}
                    </div>
                </div>
                <style>{`
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
                `}</style>
            </div>
        </>
    );
};

export default SettingsPage;
