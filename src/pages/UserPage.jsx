import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Spinner } from 'react-bootstrap';
import { FaTrashAlt, FaEdit, FaSearch, FaUserShield, FaUserCog, FaPlus, FaCheckCircle, FaTimesCircle, FaKey, FaInfoCircle, FaEye, FaEyeSlash, FaLock, FaUnlock, FaHistory, FaMoon } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarPage from './NavbarPage';
import styled, { keyframes } from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmationModal from '../components/modals/ConfirmationModal';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const PageContainer = styled.div`
  background: radial-gradient(at 0% 0%, rgba(66, 153, 225, 0.05) 0, transparent 50%), 
              radial-gradient(at 50% 0%, rgba(128, 90, 213, 0.05) 0, transparent 50%), 
              radial-gradient(at 100% 0%, rgba(246, 173, 85, 0.05) 0, transparent 50%);
  background-color: #f8fafc;
  min-height: 100vh;
  padding-bottom: 5rem;
  font-family: 'Poppins', sans-serif;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 3rem 10px;
  animation: ${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TitleArea = styled.div`
  h2 {
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.25rem;
  }
  p {
    color: #718096;
    margin-bottom: 0;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #a0aec0;
  }

  input {
    padding: 0.6rem 1rem 0.6rem 2.8rem;
    border-radius: 50px;
    border: 1px solid #e2e8f0;
    width: 100%;
    transition: all 0.3s;
    background: white;

    &:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
    }
  }
`;

const AddButton = styled(Button)`
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(66, 153, 225, 0.2);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(66, 153, 225, 0.3);
  }
`;

const StyledTableCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #edf2f7;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2.2fr 1.5fr 1.2fr 1.5fr 1.5fr 140px;
  gap: 1rem;
  padding: 0 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  align-items: center;
  
  span {
    font-size: 0.75rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (max-width: 992px) {
    display: none;
  }
`;

const UserRowCard = styled.div`
  background: ${props => props.isLocked ? '#fffafa' : 'white'};
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 2.2fr 1.5fr 1.2fr 1.5fr 1.5fr 140px;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${props => props.isLocked ? '#fee2e2' : 'rgba(226, 232, 240, 0.6)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    border-color: ${props => props.isLocked ? '#fecaca' : 'rgba(66, 153, 225, 0.4)'};
  }

  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 10px rgba(118, 75, 162, 0.2);
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? '#10b981' : '#f59e0b'};
  display: inline-block;
  margin-right: 8px;
  box-shadow: 0 0 0 3px ${props => props.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
`;

const RoleBadge = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  
  background: ${props => props.role === 'superadmin' ? 'rgba(235, 248, 255, 1)' : 'rgba(247, 250, 252, 1)'};
  color: ${props => props.role === 'superadmin' ? '#2b6cb0' : '#4a5568'};
  border: 1px solid ${props => props.role === 'superadmin' ? '#bee3f8' : '#e2e8f0'};
`;

const ActionBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f1f5f9;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: ${props => props.variant === 'danger' ? '#ef4444' : '#64748b'};
  
  &:hover {
    background: ${props => props.variant === 'danger' ? '#fef2f2' : '#f8fafc'};
    color: ${props => props.variant === 'danger' ? '#b91c1c' : '#334155'};
    border-color: ${props => props.variant === 'danger' ? '#fee2e2' : '#e2e8f0'};
    transform: translateY(-1px);
  }
`;

const ToggleSwitch = styled.div`
  width: 48px;
  height: 24px;
  background: ${props => props.$active ? '#ef4444' : '#22c55e'};
  border-radius: 50px;
  padding: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 1px solid ${props => props.$active ? '#dc2626' : '#16a34a'};
  
  .knob {
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: ${props => props.$active ? 'translateX(24px)' : 'translateX(0)'};
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  &:hover {
    filter: brightness(1.05);
  }
`;

const ModalHeaderStyled = styled(Modal.Header)`
  background: #f8fafc;
  border-bottom: 1px solid #edf2f7;
  padding: 1.5rem;
  
  .modal-title {
    font-weight: 700;
    color: #1a202c;
  }
`;

const FormGroup = styled(Form.Group)`
  margin-bottom: 1.5rem;
  
  label {
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  input, select {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    transition: all 0.3s;
    
    &:focus {
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }
  }
`;

const PermissionSection = styled.div`
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #edf2f7;

  .permission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.75rem;
  }
`;

const PermissionCheck = styled(Form.Check)`
  label {
    font-weight: 500 !important;
    font-size: 0.85rem !important;
    color: #4a5568 !important;
    cursor: pointer;
  }
  
  .form-check-input {
    cursor: pointer;
    &:checked {
      background-color: #4299e1;
      border-color: #4299e1;
    }
  }
`;

const ProcessingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  
  .loader-content {
    background: white;
    padding: 2.5rem;
    border-radius: 24px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    text-align: center;
    border: 1px solid #edf2f7;
    animation: ${fadeIn} 0.3s ease-out;
  }
`;

const SkeletonLine = styled.div`
  height: 30px;
  background: #f1f5f9;
  border-radius: 4px;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

const AVAILABLE_MODULES = [
    { key: 'tuition', label: 'Tuitions' },
    { key: 'payment', label: 'Payments' },
    { key: 'teacherPayment', label: 'Teacher Payments' },
    { key: 'refund', label: 'Refund' },
    { key: 'guardianApply', label: 'Guardian' },
    { key: 'task', label: 'Task' },
    { key: 'tuitionApply', label: 'Tuition Apply' },
    { key: 'premiumTeacher', label: 'Premium' },
    { key: 'spamBest', label: 'Spam/Best' },
    { key: 'lead', label: 'Lead' },
    { key: 'general', label: 'Search' }
];

const HistoryItem = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
  
  &:hover {
    background: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  .details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .timestamp {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.95rem;
  }
  
  .device-info {
    color: #64748b;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .ip-badge {
    background: #f1f5f9;
    color: #475569;
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.75rem;
    font-weight: 600;
  }
`;

const UserPage = () => {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'admin', permissions: [], autoLock: false });
    const [editingUser, setEditingUser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processMessage, setProcessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showPasswords, setShowPasswords] = useState({});
    const [lockingUserId, setLockingUserId] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyUser, setHistoryUser] = useState(null);
    const token = localStorage.getItem('token');
    const currentUserRole = localStorage.getItem('role');

    const togglePasswordVisibility = (userId) => {
        setShowPasswords(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    const handleToggleLock = async (userId) => {
        setLockingUserId(userId);
        try {
            await axios.put(`https://tuition-seba-backend-1.onrender.com/api/user/toggle-lock/${userId}`, {}, {
                headers: { Authorization: token }
            });
            await fetchUsers();
            toast.success('User lock status updated');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error toggling lock');
            console.error('Lock error:', err);
        } finally {
            setLockingUserId(null);
        }
    };

    const fetchHistory = async (user) => {
        setHistoryUser(user);
        setIsProcessing(true);
        setProcessMessage('Fetching login history...');
        try {
            const response = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/user/history/${user._id}`, {
                headers: { Authorization: token }
            });
            setHistoryData(response.data);
            setShowHistoryModal(true);
        } catch (err) {
            toast.error('Error fetching login history');
            console.error('History error:', err);
        } finally {
            setIsProcessing(false);
            setProcessMessage('');
        }
    };

    // Check if user has valid token, otherwise redirect to login
    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/user/users', {
                headers: { Authorization: token }
            });
            setUserList(response.data);
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                navigate('/admin/login');
                toast.error('Session expired. Please log in again.');
            } else {
                setError('Error fetching users');
                toast.error('Error fetching users');
            }
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        setUserToDelete(id);
        setShowConfirmModal(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        setIsProcessing(true);
        setProcessMessage('Deleting user...');
        setError(null);
        try {
            await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/user/delete/${userToDelete}`, {
                headers: { Authorization: token }
            });
            await fetchUsers();
            toast.success('User deleted successfully');
            setShowConfirmModal(false);
            setUserToDelete(null);
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                navigate('/admin/login');
                toast.error('Session expired. Please log in again.');
            } else {
                setError('Error deleting user');
                toast.error('Error deleting user');
            }
            console.error('Error deleting user:', err);
        } finally {
            setIsProcessing(false);
            setProcessMessage('');
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setUserToDelete(null);
        toast.info('Deletion cancelled');
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setNewUser({
                username: user.username,
                password: user.password,
                name: user.name,
                role: user.role,
                permissions: user.permissions || [],
                autoLock: user.autoLock || false
            });
        } else {
            setEditingUser(null);
            setNewUser({ username: '', password: '', name: '', role: 'admin', permissions: [], autoLock: false });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewUser({ username: '', password: '', name: '', role: 'admin', permissions: [], autoLock: false });
        setEditingUser(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handlePermissionChange = (moduleKey) => {
        const currentPermissions = [...newUser.permissions];
        if (currentPermissions.includes(moduleKey)) {
            setNewUser({
                ...newUser,
                permissions: currentPermissions.filter(p => p !== moduleKey)
            });
        } else {
            setNewUser({
                ...newUser,
                permissions: [...currentPermissions, moduleKey]
            });
        }
    };

    const handleCheckAll = () => {
        const allKeys = AVAILABLE_MODULES.map(m => m.key);
        if (newUser.permissions.length === allKeys.length) {
            setNewUser({ ...newUser, permissions: [] });
        } else {
            setNewUser({ ...newUser, permissions: allKeys });
        }
    };

    const handleSaveUser = async () => {
        // Validation
        if (!newUser.username || !newUser.username.trim()) {
            toast.error('Username is required');
            return;
        }
        if (!newUser.name || !newUser.name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (!newUser.password || !newUser.password.trim()) {
            toast.error('Password is required');
            return;
        }
        if (newUser.role === 'admin' && (!newUser.permissions || newUser.permissions.length === 0)) {
            toast.error('Please select at least one permission for admin role');
            return;
        }

        setIsProcessing(true);
        setProcessMessage(editingUser ? 'Updating user...' : 'Creating user...');
        setError(null);
        try {
            if (editingUser) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/user/edit/${editingUser._id}`, newUser, {
                    headers: { Authorization: token }
                });
                toast.success('User updated successfully');
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/user/register', newUser, {
                    headers: { Authorization: token }
                });
                toast.success('User added successfully');
            }
            await fetchUsers();
            handleCloseModal();
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                navigate('/admin/login');
                toast.error('Session expired. Please log in again.');
            } else {
                const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Error saving user';
                setError(errorMsg);
                toast.error(errorMsg);
            }
            console.error('Error saving user:', err);
        } finally {
            setIsProcessing(false);
            setProcessMessage('');
        }
    };

    const filteredUsers = userList.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageContainer>
            <NavBarPage />
            <ContentWrapper>
                <HeaderSection>
                    <TitleArea>
                        <h2>User Management</h2>
                        <p>Manage administrator accounts and access permissions</p>
                    </TitleArea>

                    <div className="d-flex gap-3 flex-wrap">
                        <SearchContainer>
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Search by name or username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </SearchContainer>

                        <AddButton variant="primary" onClick={() => handleOpenModal()}>
                            <FaPlus /> Add New User
                        </AddButton>
                    </div>
                </HeaderSection>

                {loading ? (
                    <div className="d-flex flex-column gap-3">
                        {[1, 2, 3, 4].map(i => <SkeletonLine key={i} />)}
                    </div>
                ) : (
                    <div>
                        <TableHeader>
                            <span>Full Name</span>
                            <span>Username</span>
                            <span>Status</span>
                            <span>Credentials</span>
                            <span>Access Role</span>
                            <span className="text-end">Actions</span>
                        </TableHeader>

                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                            <UserRowCard key={user._id} $isLocked={user.isLocked}>
                                <div className="d-flex align-items-center gap-3">
                                    <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
                                    <div>
                                        <div className={`fw-bold ${user.isLocked ? 'text-danger' : 'text-dark'}`}>{user.name}</div>
                                        <div className="text-muted small d-lg-none">{user.username}</div>
                                    </div>
                                </div>

                                <div className="d-none d-lg-block">
                                    <span className="text-secondary fw-medium">{user.username}</span>
                                </div>

                                <div>
                                    <div className="d-flex flex-column">
                                        <span className={`fw-bold small ${user.role === 'superadmin' ? 'text-primary' : (user.isLocked ? 'text-danger' : 'text-success')}`} style={{ letterSpacing: '0.02em' }}>
                                            {user.role === 'superadmin' ? 'SUPER' : (user.isLocked ? 'LOCKED' : 'UNLOCKED')}
                                        </span>
                                        <div className="d-flex align-items-center mt-1 flex-wrap gap-2">
                                            {user.autoLock ? (
                                                <div className="d-flex align-items-center gap-1 bg-dark text-white px-2 py-0.5 rounded" style={{ fontSize: '0.65rem', fontWeight: '700' }}>
                                                    <FaMoon size={8} /> 
                                                    <span>NIGHT LOCK</span>
                                                </div>
                                            ) : (
                                                <div className="d-flex align-items-center gap-1 bg-light text-secondary border px-2 py-0.5 rounded" style={{ fontSize: '0.65rem', fontWeight: '700' }}>
                                                    <FaCheckCircle size={8} className="text-success" /> 
                                                    <span>24/7 ACCESS</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="d-flex align-items-center gap-2">
                                        <div
                                            className="d-flex align-items-center gap-2"
                                            style={{
                                                background: '#f8fafc',
                                                padding: '4px 10px',
                                                borderRadius: '8px',
                                                border: '1px solid #f1f5f9',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => togglePasswordVisibility(user._id)}
                                        >
                                            <FaKey size={12} style={{ color: '#94a3b8' }} />
                                            <span style={{
                                                fontFamily: 'monospace',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                color: '#334155',
                                                minWidth: '70px'
                                            }}>
                                                {showPasswords[user._id] ? user.password : '••••••••'}
                                            </span>
                                            <div style={{ color: '#94a3b8', display: 'flex' }}>
                                                {showPasswords[user._id] ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <RoleBadge role={user.role}>
                                        {user.role === 'superadmin' ? <FaUserShield /> : <FaUserCog />}
                                        {user.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                    </RoleBadge>
                                </div>

                                <div>
                                    <div className="d-flex gap-3 justify-content-end align-items-center">
                                        {currentUserRole === 'superadmin' && user.role !== 'superadmin' && (
                                            <div className="d-flex align-items-center gap-2" title={user.isLocked ? 'Unlock User' : 'Lock User'}>
                                                {lockingUserId === user._id ? (
                                                    <Spinner animation="border" size="sm" variant="primary" style={{ width: '1.25rem', height: '1.25rem' }} />
                                                ) : (
                                                    <ToggleSwitch
                                                        $active={user.isLocked}
                                                        onClick={() => handleToggleLock(user._id)}
                                                    >
                                                        <div className="knob" />
                                                    </ToggleSwitch>
                                                )}
                                                {user.isLocked ? <FaLock size={12} color="#dc2626" /> : <FaUnlock size={12} color="#94a3b8" />}
                                            </div>
                                        )}
                                        <div className="vr" style={{ height: '24px', opacity: 0.1 }}></div>
                                        <ActionBtn
                                            onClick={() => fetchHistory(user)}
                                            title="Login History"
                                            style={{ color: '#6366f1' }}
                                        >
                                            <FaHistory size={14} />
                                        </ActionBtn>
                                        <ActionBtn
                                            onClick={() => handleOpenModal(user)}
                                            title="Edit User"
                                        >
                                            <FaEdit size={14} />
                                        </ActionBtn>
                                        <ActionBtn
                                            variant="danger"
                                            onClick={() => handleDeleteUser(user._id)}
                                            disabled={deleting}
                                            title="Delete User"
                                        >
                                            {deleting && userToDelete === user._id ? (
                                                <Spinner animation="border" size="sm" />
                                            ) : (
                                                <FaTrashAlt size={14} />
                                            )}
                                        </ActionBtn>
                                    </div>
                                </div>
                            </UserRowCard>
                        )) : (
                            <div className="text-center py-5 bg-white rounded-4 border border-dashed">
                                <div className="text-muted mb-2">No users found</div>
                                <Button variant="link" onClick={() => setSearchTerm('')}>Clear search</Button>
                            </div>
                        )}
                    </div>
                )}

                <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    centered
                    size="lg"
                    contentClassName="border-0 shadow-lg"
                    style={{ borderRadius: '1rem' }}
                >
                    <ModalHeaderStyled closeButton>
                        <Modal.Title>{editingUser ? 'Update User Details' : 'Register New Account'}</Modal.Title>
                    </ModalHeaderStyled>
                    <Modal.Body className="p-4">
                        <Form>
                            <div className="row">
                                <div className="col-md-6">
                                    <FormGroup controlId="formName">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="John Doe"
                                            name="name"
                                            value={newUser.name}
                                            onChange={handleInputChange}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup controlId="formUsername">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="johndoe123"
                                            name="username"
                                            value={newUser.username}
                                            onChange={handleInputChange}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup controlId="formPassword">
                                        <Form.Label>Access Password</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Strong password"
                                            name="password"
                                            value={newUser.password}
                                            onChange={handleInputChange}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup controlId="formRole">
                                        <Form.Label>System Role</Form.Label>
                                        <Form.Select
                                            name="role"
                                            value={newUser.role}
                                            onChange={handleInputChange}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="superadmin">Super Admin</option>
                                        </Form.Select>
                                    </FormGroup>
                                </div>
                                </div>

                            {newUser.role === 'admin' && (
                                <>
                                    <div className="mt-4 p-3 bg-light rounded-3 border">
                                        <div className="row align-items-center">
                                            <div className="col-md-7">
                                                <div className="fw-bold text-dark">
                                                    <FaMoon className="text-primary me-2" /> Night Lock (12AM - 7AM)
                                                </div>
                                                <div className="small text-muted mt-1">
                                                    Automatically restrict login access during night hours in Bangladesh (GMT+6).
                                                </div>
                                            </div>
                                            <div className="col-md-5 d-flex justify-content-end align-items-center gap-3">
                                                <span className={`small fw-bold ${newUser.autoLock ? 'text-primary' : 'text-muted'}`}>
                                                    {newUser.autoLock ? 'ACTIVE' : 'DISABLED'}
                                                </span>
                                                <ToggleSwitch 
                                                    $active={newUser.autoLock} 
                                                    onClick={() => setNewUser({ ...newUser, autoLock: !newUser.autoLock })}
                                                >
                                                    <div className="knob" />
                                                </ToggleSwitch>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <Form.Label className="fw-bold mb-0 text-dark">Access Permissions</Form.Label>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={handleCheckAll}
                                            className="text-decoration-none fw-semibold"
                                        >
                                            {newUser.permissions.length === AVAILABLE_MODULES.length ? 'Revoke All' : 'Grant All'}
                                        </Button>
                                    </div>
                                    <PermissionSection>
                                        <div className="permission-grid">
                                            {AVAILABLE_MODULES.map((module) => (
                                                <PermissionCheck
                                                    key={module.key}
                                                    type="checkbox"
                                                    id={`perm-${module.key}`}
                                                    label={module.label}
                                                    checked={newUser.permissions.includes(module.key)}
                                                    onChange={() => handlePermissionChange(module.key)}
                                                />
                                            ))}
                                        </div>
                                    </PermissionSection>
                                    <div className="mt-3 small text-muted d-flex align-items-center gap-2">
                                        <FaInfoCircle color="#4299e1" />
                                        <span>Attendance is public. Finance & User management are restricted to Super Admins.</span>
                                    </div>
                                </div>
                                </>
                            )}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="bg-light border-0 p-3">
                        <Button variant="link" onClick={handleCloseModal} className="text-decoration-none text-muted fw-semibold">
                            Cancel
                        </Button>
                        <AddButton variant="primary" onClick={handleSaveUser}>
                            {editingUser ? 'Save Changes' : 'Create Account'}
                        </AddButton>
                    </Modal.Footer>
                </Modal>

                <ConfirmationModal
                    show={showConfirmModal}
                    onHide={cancelDelete}
                    onConfirm={confirmDeleteUser}
                    title="Delete User"
                    message="Are you sure you want to delete this user? This action cannot be undone."
                    confirmText="Delete User"
                    confirmVariant="danger"
                    isLoading={isProcessing}
                />

                <Modal 
                    show={showHistoryModal} 
                    onHide={() => setShowHistoryModal(false)}
                    centered
                    size="xl"
                    contentClassName="border-0 shadow-2xl"
                    style={{ borderRadius: '1.5rem' }}
                >
                    <ModalHeaderStyled closeButton>
                        <Modal.Title className="d-flex align-items-center gap-2">
                            <FaHistory className="text-primary" />
                            <span>Login Activity: {historyUser?.name}</span>
                        </Modal.Title>
                    </ModalHeaderStyled>
                    <Modal.Body className="p-0" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                        {historyData.length > 0 ? (
                            <div className="table-responsive">
                                <Table hover responsive className="mb-0 align-middle">
                                    <thead className="bg-light sticky-top">
                                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                            <th className="px-4 py-3 text-muted small text-uppercase fw-bold">Login Date</th>
                                            <th className="px-4 py-3 text-muted small text-uppercase fw-bold">Time</th>
                                            <th className="px-4 py-3 text-muted small text-uppercase fw-bold">Device & OS</th>
                                            <th className="px-4 py-3 text-muted small text-uppercase fw-bold">Full User Agent</th>
                                            <th className="px-4 py-3 text-muted small text-uppercase fw-bold text-end">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.map((log, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td className="px-4 py-3 fw-bold text-dark">
                                                    {new Date(log.timestamp).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-4 py-3 text-secondary">
                                                    {new Date(log.timestamp).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className={`badge ${log.userAgent.includes('Mobile') ? 'bg-info' : 'bg-primary'} bg-opacity-10 text-${log.userAgent.includes('Mobile') ? 'info' : 'primary'} px-2 py-1`}>
                                                            {log.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}
                                                        </span>
                                                        <span className="small text-muted">
                                                            {log.userAgent.match(/\(([^)]+)\)/)?.[1]?.split(';')[0] || 'Unknown OS'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }} title={log.userAgent}>
                                                        {log.userAgent}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-end">
                                                    <code className="bg-light px-2 py-1 rounded text-dark border small" style={{ letterSpacing: '0.05em' }}>
                                                        {log.ip === '::1' ? '127.0.0.1' : log.ip}
                                                    </code>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-5 text-muted">
                                <FaInfoCircle size={24} className="mb-2 opacity-20" />
                                <p>No login records found for this account.</p>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="bg-light border-0 p-3">
                        <Button variant="secondary" onClick={() => setShowHistoryModal(false)} className="px-4 fw-semibold">
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {isProcessing && (
                    <ProcessingOverlay>
                        <div className="loader-content">
                            <Spinner animation="border" variant="primary" size="lg" />
                            <h4 className="mt-3 fw-bold text-primary">{processMessage}</h4>
                            <p className="text-muted mb-0">Please wait, performing action...</p>
                        </div>
                    </ProcessingOverlay>
                )}

                <ToastContainer />
            </ContentWrapper>
        </PageContainer>
    );
};

export default UserPage;
