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
        payment_auto_assign_user: '',
        tuition_auto_assign_user: '',
        status_change_auto_assign_user: ''
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
                payment_auto_assign_user: '',
                tuition_auto_assign_user: '',
                status_change_auto_assign_user: ''
            };

            settingsData.forEach(s => {
                if (settingsObj.hasOwnProperty(s.key)) {
                    settingsObj[s.key] = s.value;
                }
            });

            setSettings(settingsObj);
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSetting = async (key) => {
        const value = settings[key];
        
        if (!value) {
            toast.error('Please select a user');
            return;
        }

        // Check if this user is already assigned to another setting
        const alreadyAssigned = allSettings.find(s => s.key !== key && s.value === value);
        if (alreadyAssigned) {
            toast.error(`This user is already assigned to "${alreadyAssigned.key.replace(/_/g, ' ')}"`);
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
        const user = users.find(u => u.username === username);
        return user ? `${user.name} (${user.username})` : username;
    };

    const userOptions = Array.isArray(users) ? users.map(user => ({
        value: user.username,
        label: `${user.name} (${user.username})`
    })) : [];

    const filteredSettings = allSettings.filter(s => {
        const keyMatch = s.key.toLowerCase().includes(searchTerm.toLowerCase());
        const valueMatch = String(s.value).toLowerCase().includes(searchTerm.toLowerCase());
        const userMatch = s.key.includes('user') && getDisplayName(s.value).toLowerCase().includes(searchTerm.toLowerCase());
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
                        <div className="card border-0 shadow-lg mb-3" style={{ borderRadius: '15px' }}>
                            <div className="card-header bg-primary text-white p-3">
                                <h2 className="mb-0 fw-bold fs-4">
                                    <i className="fas fa-cog me-2"></i>
                                    Superadmin Settings
                                </h2>
                                <p className="mb-0 opacity-75 small">Configure system-wide automation settings</p>
                            </div>
                            <div className="card-body p-3 bg-light">
                                
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
                                                value={userOptions.find(opt => opt.value === settings.payment_auto_assign_user) || null}
                                                onChange={(selected) => handleChange('payment_auto_assign_user', selected ? selected.value : '')}
                                                options={userOptions}
                                                placeholder="Search & Select User..."
                                                isClearable
                                                menuPosition="fixed"
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        border: 'none',
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '0.5rem',
                                                        padding: '2px'
                                                    })
                                                }}
                                            />
                                            <button 
                                                className="btn btn-primary w-100 rounded-3 shadow-sm hover-lift"
                                                onClick={() => handleSaveSetting('payment_auto_assign_user')}
                                            >
                                                Save
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
                                                value={userOptions.find(opt => opt.value === settings.tuition_auto_assign_user) || null}
                                                onChange={(selected) => handleChange('tuition_auto_assign_user', selected ? selected.value : '')}
                                                options={userOptions}
                                                placeholder="Search & Select User..."
                                                isClearable
                                                menuPosition="fixed"
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        border: 'none',
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '0.5rem',
                                                        padding: '2px'
                                                    })
                                                }}
                                            />
                                            <button 
                                                className="btn btn-success w-100 rounded-3 shadow-sm hover-lift"
                                                onClick={() => handleSaveSetting('tuition_auto_assign_user')}
                                            >
                                                Save
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
                                                value={userOptions.find(opt => opt.value === settings.status_change_auto_assign_user) || null}
                                                onChange={(selected) => handleChange('status_change_auto_assign_user', selected ? selected.value : '')}
                                                options={userOptions}
                                                placeholder="Search & Select User..."
                                                isClearable
                                                menuPosition="fixed"
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        border: 'none',
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '0.5rem',
                                                        padding: '2px'
                                                    })
                                                }}
                                            />
                                            <button 
                                                className="btn btn-warning w-100 rounded-3 shadow-sm hover-lift"
                                                onClick={() => handleSaveSetting('status_change_auto_assign_user')}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Settings Summary List */}
                        <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '15px' }}>
                            <div className="card-header bg-secondary text-white p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <div>
                                    <h3 className="mb-0 fw-bold fs-5">
                                        <i className="fas fa-list-ul me-2"></i>
                                        Active Configurations
                                    </h3>
                                    <p className="mb-0 opacity-75 extra-small">Summary of currently active system settings</p>
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
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-3 py-2 border-0 small">Setting Key</th>
                                                <th className="px-3 py-2 border-0 small">Assigned Value</th>
                                                <th className="px-3 py-2 border-0 text-end small">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSettings.length > 0 ? filteredSettings.map((s, index) => (
                                                <tr key={index}>
                                                    <td className="px-3 py-2 align-middle">
                                                        <span className="badge bg-secondary-subtle text-secondary text-uppercase border px-2 py-1">
                                                            {s.key.replace(/_/g, ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 align-middle fw-bold small">
                                                        {s.key.includes('user') ? getDisplayName(s.value) : s.value}
                                                    </td>
                                                    <td className="px-3 py-2 align-middle text-end">
                                                        <span className="text-success small">
                                                            <i className="fas fa-check-circle me-1"></i>
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
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
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
