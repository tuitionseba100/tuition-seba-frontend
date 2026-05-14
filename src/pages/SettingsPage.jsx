import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import NavbarPage from './NavbarPage';

const API_BASE_URL = 'https://tuition-seba-backend-1.onrender.com';

const SettingsPage = () => {
    const [users, setUsers] = useState([]);
    const [allSettings, setAllSettings] = useState([]);
    const [settings, setSettings] = useState({
        payment_auto_assign_user: [],
        tuition_auto_assign_user: [],
        status_change_auto_assign_user: []
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [usersRes, allSettingsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/user/users`),
                axios.get(`${API_BASE_URL}/api/settings`)
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
                status_change_auto_assign_user: []
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

            // setSettings(settingsObj);
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSetting = async (key) => {
        const value = settings[key];
        
        if (!value || (Array.isArray(value) && value.length === 0)) {
            toast.error('Please select at least one user');
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/api/settings`, {
                key: key,
                value: value
            });
            toast.success('Setting updated successfully');
            // Refresh settings list
            const res = await axios.get(`${API_BASE_URL}/api/settings`);
            setAllSettings(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Error saving setting:', error);
            toast.error('Failed to save setting');
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
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

    const filteredSettings = allSettings.filter(s => {
        const keyMatch = String(s.key || '').toLowerCase().includes(searchTerm.toLowerCase());
        const valueMatch = String(s.value || '').toLowerCase().includes(searchTerm.toLowerCase());
        const userMatch = s.key.includes('user') && String(getDisplayName(s.value)).toLowerCase().includes(searchTerm.toLowerCase());
        return keyMatch || valueMatch || userMatch;
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
            <div className="container-fluid p-2">
                <ToastContainer />
                <div className="row g-2 justify-content-center">
                    <div className="col-12">
                        <div className="card border-0 shadow-lg mb-4 overflow-hidden" style={{ borderRadius: '20px' }}>
                            <div className="card-header py-2 px-4 border-0" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)', color: 'white' }}>
                                <h2 className="mb-0 fw-bold d-flex align-items-center fs-4">
                                    <i className="fas fa-sliders-h me-3"></i>
                                    System Management
                                </h2>
                                <p className="mb-0 opacity-80 extra-small">Control system automation and personnel assignments</p>
                            </div>
                            <div className="card-body p-3 bg-white">
                                
                                <div className="row g-3">
                                    {/* Payment Auto Assign */}
                                    <div className="col-md-4">
                                        <div className="bg-white p-3 rounded-4 shadow-sm border-start border-primary border-4 h-100">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="bg-primary-subtle text-primary p-2 rounded-circle me-3">
                                                    <i className="fas fa-credit-card"></i>
                                                </div>
                                                <div>
                                                    <h5 className="mb-0 fw-bold">Payment</h5>
                                                    <p className="text-muted extra-small mb-0">Auto-assign new payments</p>
                                                </div>
                                            </div>
                                            <Select 
                                                className="mb-3 shadow-sm"
                                                classNamePrefix="select"
                                                isMulti
                                                value={userOptions.filter(opt => (settings.payment_auto_assign_user || []).includes(opt.value))}
                                                onChange={(selected) => handleChange('payment_auto_assign_user', selected ? selected.map(opt => opt.value) : [])}
                                                options={userOptions}
                                                placeholder="Search & Select User..."
                                                isClearable
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
                                                        fontWeight: '600'
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
                                                className="btn w-100 rounded-3 shadow-sm hover-lift text-white fw-bold py-2 mt-1"
                                                style={{ background: 'linear-gradient(to right, #0d6efd, #0b5ed7)', border: 'none' }}
                                                onClick={() => handleSaveSetting('payment_auto_assign_user')}
                                            >
                                                Update Assignment
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tuition Auto Assign */}
                                    <div className="col-md-4">
                                        <div className="bg-white p-3 rounded-4 shadow-sm border-start border-success border-4 h-100">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="bg-success-subtle text-success p-2 rounded-circle me-3">
                                                    <i className="fas fa-graduation-cap"></i>
                                                </div>
                                                <div>
                                                    <h5 className="mb-0 fw-bold">Tuition</h5>
                                                    <p className="text-muted extra-small mb-0">Auto-assign new tuitions</p>
                                                </div>
                                            </div>
                                            <Select 
                                                className="mb-3 shadow-sm"
                                                classNamePrefix="select"
                                                isMulti
                                                value={userOptions.filter(opt => (settings.tuition_auto_assign_user || []).includes(opt.value))}
                                                onChange={(selected) => handleChange('tuition_auto_assign_user', selected ? selected.map(opt => opt.value) : [])}
                                                options={userOptions}
                                                placeholder="Search & Select User..."
                                                isClearable
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
                                                        fontWeight: '600'
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
                                                className="btn w-100 rounded-3 shadow-sm hover-lift text-white fw-bold py-2 mt-1"
                                                style={{ background: 'linear-gradient(to right, #10b981, #059669)', border: 'none' }}
                                                onClick={() => handleSaveSetting('tuition_auto_assign_user')}
                                            >
                                                Update Assignment
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status Change Auto Assign */}
                                    <div className="col-md-4">
                                        <div className="bg-white p-3 rounded-4 shadow-sm border-start border-warning border-4 h-100">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="bg-warning-subtle text-warning p-2 rounded-circle me-3">
                                                    <i className="fas fa-exchange-alt"></i>
                                                </div>
                                                <div>
                                                    <h5 className="mb-0 fw-bold">Status Migration</h5>
                                                    <p className="text-muted extra-small mb-0">Assigned on status change</p>
                                                </div>
                                            </div>
                                            <Select 
                                                className="mb-3 shadow-sm"
                                                classNamePrefix="select"
                                                isMulti
                                                value={userOptions.filter(opt => (settings.status_change_auto_assign_user || []).includes(opt.value))}
                                                onChange={(selected) => handleChange('status_change_auto_assign_user', selected ? selected.map(opt => opt.value) : [])}
                                                options={userOptions}
                                                placeholder="Search & Select User..."
                                                isClearable
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
                                                        fontWeight: '600'
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
                                                className="btn w-100 rounded-3 shadow-sm hover-lift text-white fw-bold py-2 mt-1"
                                                style={{ background: 'linear-gradient(to right, #f59e0b, #d97706)', border: 'none' }}
                                                onClick={() => handleSaveSetting('status_change_auto_assign_user')}
                                            >
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
                                                                <i className={s.key.includes('payment') ? 'fas fa-credit-card' : s.key.includes('tuition') ? 'fas fa-graduation-cap' : 'fas fa-sync-alt'}></i>
                                                            </div>
                                                            <span className="fw-semibold text-dark text-capitalize">
                                                                {s.key.replace(/_/g, ' ')}
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
                                                                    const name = user ? user.username : val;
                                                                    const initials = name.charAt(0).toUpperCase();
                                                                    
                                                                    // Color logic based on setting type
                                                                    let themeColor = "#0d6efd"; // Default Primary
                                                                    let bgSubtle = "#e7f1ff";
                                                                    if (s.key.includes('tuition')) { themeColor = "#198754"; bgSubtle = "#d1e7dd"; }
                                                                    if (s.key.includes('status')) { themeColor = "#d97706"; bgSubtle = "#fff3cd"; }
                                                                    
                                                                    return (
                                                                        <div 
                                                                            key={i} 
                                                                            className="d-flex align-items-center rounded-pill shadow-sm px-2 py-1 user-pill-hover transition-all border"
                                                                            style={{ 
                                                                                fontSize: '0.8rem', 
                                                                                backgroundColor: 'white',
                                                                                borderColor: bgSubtle
                                                                            }}
                                                                        >
                                                                            <div 
                                                                                className="rounded-circle d-flex align-items-center justify-content-center me-2 text-white shadow-sm" 
                                                                                style={{ 
                                                                                    width: '20px', 
                                                                                    height: '20px', 
                                                                                    fontSize: '0.65rem', 
                                                                                    fontWeight: '800',
                                                                                    backgroundColor: themeColor
                                                                                }}
                                                                            >
                                                                                {initials}
                                                                            </div>
                                                                            <span className="fw-bold" style={{ color: themeColor, letterSpacing: '0.1px' }}>
                                                                                {name}
                                                                            </span>
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
                    .transition-all {
                        transition: all 0.2s ease-in-out;
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
