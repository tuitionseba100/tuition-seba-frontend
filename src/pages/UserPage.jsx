import React, { useState, useEffect, useMemo } from 'react';
import { Button, Table, Modal, Form, Spinner, Card, Row, Col, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { 
    FaTrashAlt, 
    FaEdit, 
    FaSearch, 
    FaUserShield, 
    FaUserCog, 
    FaUserTie, 
    FaPlus, 
    FaCheckCircle, 
    FaKey, 
    FaInfoCircle, 
    FaEye, 
    FaEyeSlash, 
    FaLock, 
    FaUnlock, 
    FaHistory, 
    FaMoon, 
    FaUsers, 
    FaUserCheck, 
    FaUserLock, 
    FaChevronLeft, 
    FaChevronRight,
    FaUndo
} from 'react-icons/fa';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import { useNavigate } from 'react-router-dom';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmationModal from '../components/modals/ConfirmationModal';

// --- Styled Components ---

const PageContainer = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 3rem;
  font-family: 'Poppins', sans-serif;
  width: 100%;
`;

const ContentContainer = styled.div`
  width: 100%;
  padding: 1.25rem 1.5rem;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;

  h2 {
    font-weight: 700;
    color: #0d6efd;
    margin-bottom: 0.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    color: #6c757d;
    font-size: 0.88rem;
    margin-bottom: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  }

  .icon-box {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    flex-shrink: 0;
    
    &.blue { background: #e0f2fe; color: #0284c7; }
    &.purple { background: #ede9fe; color: #7c3aed; }
    &.green { background: #dcfce7; color: #16a34a; }
    &.emerald { background: #d1fae5; color: #059669; }
    &.red { background: #fee2e2; color: #dc2626; }
    &.indigo { background: #e0e7ff; color: #4338ca; }
  }

  .content {
    min-width: 0;
    h4 { 
      margin: 0; 
      font-weight: 700; 
      color: #1e293b; 
      font-size: 1.2rem;
      line-height: 1.2;
    }
    p { 
      margin: 0; 
      font-size: 0.75rem; 
      font-weight: 600;
      color: #64748b; 
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const FilterCard = styled(Card)`
  border: 1px solid #dee2e6;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  margin-bottom: 1.25rem;
  background: #ffffff;
`;

const TableCard = styled(Card)`
  border: 1px solid #dee2e6;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
  background: #ffffff;
  overflow: hidden;
`;

const ActionIconButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ced4da;
  transition: all 0.15s ease;
  background: white;
  color: ${props => props.$variant === 'danger' ? '#dc3545' : props.$variant === 'primary' ? '#0d6efd' : props.$variant === 'purple' ? '#6f42c1' : '#495057'};
  
  &:hover {
    background: ${props => props.$variant === 'danger' ? '#f8d7da' : props.$variant === 'primary' ? '#cfe2ff' : props.$variant === 'purple' ? '#e2d9f3' : '#e9ecef'};
    color: ${props => props.$variant === 'danger' ? '#842029' : props.$variant === 'primary' ? '#084298' : props.$variant === 'purple' ? '#432874' : '#212529'};
    border-color: ${props => props.$variant === 'danger' ? '#f5c2c7' : props.$variant === 'primary' ? '#b6d4fe' : props.$variant === 'purple' ? '#c5b3e6' : '#adb5bd'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CompactToggleSwitch = styled.div`
  width: 36px;
  height: 18px;
  background: ${props => props.$active ? '#dc3545' : '#198754'};
  border-radius: 50px;
  padding: 2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  position: relative;
  border: 1px solid ${props => props.$active ? '#b02a37' : '#146c43'};
  
  .knob {
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    transition: all 0.2s ease;
    transform: ${props => props.$active ? 'translateX(18px)' : 'translateX(0)'};
    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }
  
  &:hover {
    filter: brightness(1.05);
  }
`;

const PermissionSection = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.75rem 0.85rem;
  border: 1px solid #ced4da;

  .permission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.45rem 0.55rem;
  }
`;

const PermissionItem = styled.label`
  background: white;
  padding: 0.42rem 0.65rem;
  border-radius: 6px;
  border: 1px solid ${props => props.$checked ? '#86b7fe' : '#dee2e6'};
  background: ${props => props.$checked ? '#e7f1ff' : '#ffffff'};
  transition: all 0.15s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 34px;
  cursor: pointer;
  user-select: none;
  margin: 0;

  &:hover {
    border-color: #0d6efd;
    background: ${props => props.$checked ? '#cfe2ff' : '#f8f9fa'};
  }

  input[type="checkbox"] {
    cursor: pointer;
    margin: 0 !important;
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    accent-color: #0d6efd;
  }

  .perm-text {
    font-weight: 500;
    font-size: 0.8rem;
    color: ${props => props.$checked ? '#084298' : '#212529'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    line-height: 1.2;
  }
`;

const ProcessingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  
  .loader-content {
    background: white;
    padding: 2rem 2.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    text-align: center;
    border: 1px solid #dee2e6;
  }
`;

const AVAILABLE_MODULES = [
    { key: 'tuition', label: 'Tuitions' },
    { key: 'tuitionApply', label: 'Tuition Apply' },
    { key: 'guardianApply', label: 'Guardian Apply' },
    { key: 'premiumTeacher', label: 'Premium Teachers' },
    { key: 'payment', label: 'Guardian Payments' },
    { key: 'teacherPayment', label: 'Teacher Payments' },
    { key: 'refund', label: 'Refund Requests' },
    { key: 'serviceCharge', label: 'Service Charges' },
    { key: 'task', label: 'Tasks' },
    { key: 'lead', label: 'Leads' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'complaints', label: 'Complaints & Suggestions' },
    { key: 'chat', label: 'Live Chat' },
    { key: 'internalChat', label: 'Team Chat' },
    { key: 'smsLogs', label: 'SMS Logs' },
    { key: 'spamBest', label: 'Spam / Best' },
    { key: 'general', label: 'Global Search' },
    { key: 'settings', label: 'Settings' }
];

const UserPage = () => {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'admin', permissions: [], autoLock: false, perHourTk: '' });
    const [editingUser, setEditingUser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processMessage, setProcessMessage] = useState('');
    
    // Filters & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [lockFilter, setLockFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);

    const [lockingUserId, setLockingUserId] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyUser, setHistoryUser] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordTargetUser, setPasswordTargetUser] = useState(null);
    const [newPasswordInput, setNewPasswordInput] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);

    const token = localStorage.getItem('token');
    const currentUserRole = localStorage.getItem('role');

    // Auth verification
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
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/user/users', {
                headers: { Authorization: token }
            });
            setUserList(response.data || []);
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                navigate('/admin/login');
                toast.error('Session expired. Please log in again.');
            } else {
                toast.error('Error fetching users');
            }
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    // Summary Statistics
    const stats = useMemo(() => {
        const total = userList.length;
        let superadmins = 0;
        let managers = 0;
        let admins = 0;
        let locked = 0;
        let nightLock = 0;

        for (let i = 0; i < userList.length; i++) {
            const u = userList[i];
            if (u.role === 'superadmin') superadmins++;
            else if (u.role === 'manager') managers++;
            else admins++;

            if (u.isLocked) locked++;
            if (u.autoLock) nightLock++;
        }

        return { total, superadmins, managers, admins, locked, nightLock };
    }, [userList]);

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return userList.filter(user => {
            const matchesSearch = !searchTerm.trim() || 
                (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

            const matchesLock = 
                lockFilter === 'ALL' ? true :
                lockFilter === 'LOCKED' ? !!user.isLocked :
                !user.isLocked;

            return matchesSearch && matchesRole && matchesLock;
        });
    }, [userList, searchTerm, roleFilter, lockFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(start, start + itemsPerPage);
    }, [filteredUsers, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilter, lockFilter, itemsPerPage]);

    const handleResetFilters = () => {
        setSearchTerm('');
        setRoleFilter('ALL');
        setLockFilter('ALL');
        setCurrentPage(1);
    };

    // Password Modal Handlers
    const handleOpenPasswordModal = (user) => {
        setPasswordTargetUser(user);
        setNewPasswordInput('');
        setShowNewPassword(false);
        setShowPasswordModal(true);
    };

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
        setPasswordTargetUser(null);
        setNewPasswordInput('');
    };

    const handleSavePassword = async () => {
        if (!newPasswordInput || !newPasswordInput.trim()) {
            toast.error('Please enter a new password');
            return;
        }
        if (newPasswordInput.trim().length < 4) {
            toast.error('Password must be at least 4 characters long');
            return;
        }

        setIsProcessing(true);
        setProcessMessage('Updating password...');
        try {
            await axios.put(`https://tuition-seba-backend-1.onrender.com/api/user/change-password/${passwordTargetUser._id}`, {
                newPassword: newPasswordInput.trim()
            }, {
                headers: { Authorization: token }
            });
            toast.success(`Password updated successfully for ${passwordTargetUser.name}`);
            handleClosePasswordModal();
        } catch (err) {
            const msg = err.response?.data?.message || 'Error updating password';
            toast.error(msg);
        } finally {
            setIsProcessing(false);
            setProcessMessage('');
        }
    };

    // Lock Toggle
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

    // History Modal Handlers
    const fetchHistory = async (user) => {
        setHistoryUser(user);
        setIsProcessing(true);
        setProcessMessage('Fetching login history...');
        try {
            const response = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/user/history/${user._id}`, {
                headers: { Authorization: token }
            });
            setHistoryData(response.data || []);
            setShowHistoryModal(true);
        } catch (err) {
            toast.error('Error fetching login history');
            console.error('History error:', err);
        } finally {
            setIsProcessing(false);
            setProcessMessage('');
        }
    };

    // Delete Handlers
    const handleDeleteUser = (id) => {
        setUserToDelete(id);
        setShowConfirmModal(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        setIsProcessing(true);
        setProcessMessage('Deleting user...');
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

    // Add / Edit Modal Handlers
    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setNewUser({
                username: user.username,
                password: '',
                name: user.name,
                role: user.role,
                permissions: user.permissions || [],
                autoLock: user.autoLock || false,
                perHourTk: user.perHourTk !== undefined && user.perHourTk !== null ? user.perHourTk : (user.salary !== undefined ? user.salary : '')
            });
        } else {
            setEditingUser(null);
            setNewUser({ username: '', password: '', name: '', role: 'admin', permissions: [], autoLock: false, perHourTk: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewUser({ username: '', password: '', name: '', role: 'admin', permissions: [], autoLock: false, perHourTk: '' });
        setEditingUser(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (moduleKey) => {
        const currentPermissions = [...newUser.permissions];
        if (currentPermissions.includes(moduleKey)) {
            setNewUser(prev => ({
                ...prev,
                permissions: currentPermissions.filter(p => p !== moduleKey)
            }));
        } else {
            setNewUser(prev => ({
                ...prev,
                permissions: [...currentPermissions, moduleKey]
            }));
        }
    };

    const handleCheckAll = () => {
        const allKeys = AVAILABLE_MODULES.map(m => m.key);
        if (newUser.permissions.length === allKeys.length) {
            setNewUser(prev => ({ ...prev, permissions: [] }));
        } else {
            setNewUser(prev => ({ ...prev, permissions: allKeys }));
        }
    };

    const handleSaveUser = async () => {
        if (!newUser.username || !newUser.username.trim()) {
            toast.error('Username is required');
            return;
        }
        if (!newUser.name || !newUser.name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (!editingUser && (!newUser.password || !newUser.password.trim())) {
            toast.error('Password is required for new accounts');
            return;
        }
        if (newUser.role !== 'superadmin' && (!newUser.permissions || newUser.permissions.length === 0)) {
            toast.error(`Please select at least one permission for ${newUser.role} role`);
            return;
        }

        setIsProcessing(true);
        setProcessMessage(editingUser ? 'Updating user...' : 'Creating user...');
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
                toast.error(errorMsg);
            }
            console.error('Error saving user:', err);
        } finally {
            setIsProcessing(false);
            setProcessMessage('');
        }
    };

    return (
        <PageContainer>
            <NavBarPage />
            <ContentContainer>
                {/* Header */}
                <HeaderSection>
                    <div>
                        <h2><FaUserShield /> User Management</h2>
                        <p>Manage administrator accounts, permissions, and security controls</p>
                    </div>

                    <Button 
                        variant="primary" 
                        className="fw-bold d-flex align-items-center gap-2 shadow-sm rounded-pill px-4 py-2"
                        onClick={() => handleOpenModal()}
                    >
                        <FaPlus /> Add New User
                    </Button>
                </HeaderSection>

                {/* Quick Summary Stats */}
                <StatsGrid>
                    <StatCard>
                        <div className="icon-box blue"><FaUsers /></div>
                        <div className="content">
                            <h4>{stats.total}</h4>
                            <p>Total Users</p>
                        </div>
                    </StatCard>
                    <StatCard>
                        <div className="icon-box purple"><FaUserShield /></div>
                        <div className="content">
                            <h4>{stats.superadmins}</h4>
                            <p>Super Admins</p>
                        </div>
                    </StatCard>
                    <StatCard>
                        <div className="icon-box emerald"><FaUserTie /></div>
                        <div className="content">
                            <h4>{stats.managers}</h4>
                            <p>Managers</p>
                        </div>
                    </StatCard>
                    <StatCard>
                        <div className="icon-box green"><FaUserCheck /></div>
                        <div className="content">
                            <h4>{stats.admins}</h4>
                            <p>Admins</p>
                        </div>
                    </StatCard>
                    <StatCard>
                        <div className="icon-box red"><FaUserLock /></div>
                        <div className="content">
                            <h4>{stats.locked}</h4>
                            <p>Locked Accounts</p>
                        </div>
                    </StatCard>
                    <StatCard>
                        <div className="icon-box indigo"><FaMoon /></div>
                        <div className="content">
                            <h4>{stats.nightLock}</h4>
                            <p>Night Lock</p>
                        </div>
                    </StatCard>
                </StatsGrid>

                {/* Filter & Search Bar */}
                <FilterCard>
                    <Card.Body className="p-3">
                        <Row className="g-2 align-items-end">
                            <Col xs={12} md={5}>
                                <Form.Label className="fw-bold text-muted small mb-1">SEARCH USER</Form.Label>
                                <div className="d-flex align-items-center bg-light rounded px-3 border" style={{ height: '38px', borderColor: '#ced4da' }}>
                                    <FaSearch className="text-secondary me-2" />
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by name or username..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border-0 bg-transparent shadow-none p-0"
                                        style={{ fontSize: '0.88rem' }}
                                    />
                                </div>
                            </Col>

                            <Col xs={6} md={3}>
                                <Form.Label className="fw-bold text-muted small mb-1">ROLE</Form.Label>
                                <Form.Select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    size="sm"
                                    style={{ height: '38px', fontSize: '0.88rem', borderColor: '#ced4da' }}
                                >
                                    <option value="ALL">All Roles</option>
                                    <option value="superadmin">Super Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </Form.Select>
                            </Col>

                            <Col xs={6} md={2}>
                                <Form.Label className="fw-bold text-muted small mb-1">LOCK STATUS</Form.Label>
                                <Form.Select
                                    value={lockFilter}
                                    onChange={(e) => setLockFilter(e.target.value)}
                                    size="sm"
                                    style={{ height: '38px', fontSize: '0.88rem', borderColor: '#ced4da' }}
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="ACTIVE">Active / Unlocked</option>
                                    <option value="LOCKED">Locked</option>
                                </Form.Select>
                            </Col>

                            <Col xs={12} md={2} className="d-flex gap-2">
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm" 
                                    className="w-100 d-flex align-items-center justify-content-center gap-1"
                                    onClick={handleResetFilters}
                                    style={{ height: '38px', borderColor: '#ced4da' }}
                                >
                                    <FaUndo size={12} /> Reset
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </FilterCard>

                {/* Users Table Card */}
                <TableCard>
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
                        <div className="fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                            <span>User Accounts</span>
                            <Badge bg="primary" pill style={{ fontSize: '0.75rem' }}>
                                {filteredUsers.length}
                            </Badge>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <span className="text-muted small">Show:</span>
                            <Form.Select 
                                size="sm" 
                                value={itemsPerPage} 
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                style={{ width: '80px', height: '32px', fontSize: '0.82rem', borderColor: '#ced4da' }}
                            >
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </Form.Select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted small">Loading user accounts...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table bordered hover className="align-middle text-center mb-0" style={{ fontSize: '0.88rem', borderColor: '#dee2e6' }}>
                                <thead style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                    <tr>
                                        <th style={{ width: '50px', backgroundColor: '#f1f5f9' }} className="py-2.5 text-secondary fw-bold">#</th>
                                        <th className="text-start py-2.5 text-secondary fw-bold" style={{ minWidth: '180px', backgroundColor: '#f1f5f9' }}>Full Name</th>
                                        <th className="text-start py-2.5 text-secondary fw-bold" style={{ minWidth: '150px', backgroundColor: '#f1f5f9' }}>Username</th>
                                        <th className="py-2.5 text-secondary fw-bold" style={{ minWidth: '120px', backgroundColor: '#f1f5f9' }}>Role</th>
                                        <th className="py-2.5 text-secondary fw-bold" style={{ minWidth: '140px', backgroundColor: '#f1f5f9' }}>Status & Access</th>
                                        <th className="py-2.5 text-secondary fw-bold" style={{ minWidth: '130px', backgroundColor: '#f1f5f9' }}>Permissions</th>
                                        <th className="py-2.5 text-secondary fw-bold" style={{ minWidth: '120px', backgroundColor: '#f1f5f9' }}>Security</th>
                                        {currentUserRole === 'superadmin' && (
                                            <th className="py-2.5 text-secondary fw-bold" style={{ width: '85px', backgroundColor: '#f1f5f9' }}>Lock</th>
                                        )}
                                        <th className="py-2.5 text-secondary fw-bold" style={{ minWidth: '120px', backgroundColor: '#f1f5f9' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.length > 0 ? (
                                        paginatedUsers.map((user, index) => {
                                            const serialNo = (currentPage - 1) * itemsPerPage + index + 1;
                                            const roleBg = 
                                                user.role === 'superadmin' ? 'primary' :
                                                user.role === 'manager' ? 'success' : 'secondary';

                                            return (
                                                <tr key={user._id} style={{ background: user.isLocked ? '#fff5f5' : '#ffffff' }}>
                                                    <td className="text-muted fw-bold">{serialNo}</td>
                                                    
                                                    {/* Full Name */}
                                                    <td className="text-start">
                                                        <div className={`fw-bold ${user.isLocked ? 'text-danger' : 'text-dark'}`}>
                                                            {user.name}
                                                        </div>
                                                        {user.perHourTk > 0 && (
                                                            <div className="text-primary mt-0.5" style={{ fontSize: '0.72rem', fontWeight: '700' }}>
                                                                ৳{user.perHourTk}/hr
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Username */}
                                                    <td className="text-start">
                                                        <code className="text-dark bg-light px-2 py-0.5 rounded border" style={{ fontSize: '0.82rem', fontWeight: '600' }}>
                                                            {user.username}
                                                        </code>
                                                    </td>

                                                    {/* Role */}
                                                    <td>
                                                        <Badge bg={roleBg} className="text-uppercase px-2 py-1 fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.03em' }}>
                                                            {user.role === 'superadmin' && <FaUserShield className="me-1" />}
                                                            {user.role === 'manager' && <FaUserTie className="me-1" />}
                                                            {user.role === 'admin' && <FaUserCog className="me-1" />}
                                                            {user.role}
                                                        </Badge>
                                                    </td>

                                                    {/* Status & Access */}
                                                    <td>
                                                        <div className="d-flex flex-column align-items-center gap-1">
                                                            <Badge 
                                                                bg={user.role === 'superadmin' ? 'primary' : user.isLocked ? 'danger' : 'success'} 
                                                                className="px-2 py-0.5"
                                                                style={{ fontSize: '0.7rem', fontWeight: '700' }}
                                                            >
                                                                {user.role === 'superadmin' ? 'SUPER' : user.isLocked ? 'LOCKED' : 'ACTIVE'}
                                                            </Badge>

                                                            {user.autoLock ? (
                                                                <div className="d-inline-flex align-items-center gap-1 bg-dark text-white px-2 py-0.5 rounded" style={{ fontSize: '0.64rem', fontWeight: '700' }}>
                                                                    <FaMoon size={8} /> NIGHT LOCK
                                                                </div>
                                                            ) : (
                                                                <div className="d-inline-flex align-items-center gap-1 bg-light text-secondary border px-2 py-0.5 rounded" style={{ fontSize: '0.64rem', fontWeight: '700' }}>
                                                                    <FaCheckCircle size={8} className="text-success" /> 24/7 ACCESS
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Permissions */}
                                                    <td>
                                                        {user.role === 'superadmin' ? (
                                                            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1" style={{ fontSize: '0.72rem', fontWeight: '600' }}>
                                                                All Access (Super)
                                                            </span>
                                                        ) : (
                                                            <OverlayTrigger
                                                                placement="top"
                                                                overlay={
                                                                    <Tooltip id={`tooltip-perm-${user._id}`}>
                                                                        {(user.permissions || []).map(p => {
                                                                            const m = AVAILABLE_MODULES.find(mod => mod.key === p);
                                                                            return m ? m.label : p;
                                                                        }).join(', ') || 'No permissions assigned'}
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <span 
                                                                    className="badge bg-light text-secondary border px-2 py-1" 
                                                                    style={{ fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer' }}
                                                                >
                                                                    {(user.permissions || []).length} / {AVAILABLE_MODULES.length} Modules
                                                                </span>
                                                            </OverlayTrigger>
                                                        )}
                                                    </td>

                                                    {/* Security / Change Password */}
                                                    <td>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-warning"
                                                            className="text-dark fw-semibold d-inline-flex align-items-center gap-1 px-2 py-1 border-warning"
                                                            style={{ fontSize: '0.74rem', borderRadius: '6px' }}
                                                            onClick={() => handleOpenPasswordModal(user)}
                                                            title="Change user password"
                                                        >
                                                            <FaKey size={10} className="text-warning" />
                                                            <span>Change Pass</span>
                                                        </Button>
                                                    </td>

                                                    {/* Lock Toggle (SuperAdmin only) */}
                                                    {currentUserRole === 'superadmin' && (
                                                        <td>
                                                            {user.role !== 'superadmin' ? (
                                                                <div className="d-flex justify-content-center align-items-center gap-1.5" title={user.isLocked ? 'Unlock User' : 'Lock User'}>
                                                                    {lockingUserId === user._id ? (
                                                                        <Spinner animation="border" size="sm" variant="primary" style={{ width: '1.1rem', height: '1.1rem' }} />
                                                                    ) : (
                                                                        <CompactToggleSwitch
                                                                            $active={user.isLocked}
                                                                            onClick={() => handleToggleLock(user._id)}
                                                                        >
                                                                            <div className="knob" />
                                                                        </CompactToggleSwitch>
                                                                    )}
                                                                    {user.isLocked ? <FaLock size={11} color="#dc2626" /> : <FaUnlock size={11} color="#6c757d" />}
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted small">-</span>
                                                            )}
                                                        </td>
                                                    )}

                                                    {/* Actions */}
                                                    <td>
                                                        <div className="d-inline-flex gap-1.5 align-items-center justify-content-center">
                                                            <ActionIconButton
                                                                $variant="purple"
                                                                onClick={() => fetchHistory(user)}
                                                                title="Login History"
                                                            >
                                                                <FaHistory size={13} />
                                                            </ActionIconButton>

                                                            <ActionIconButton
                                                                $variant="primary"
                                                                onClick={() => handleOpenModal(user)}
                                                                title="Edit User"
                                                            >
                                                                <FaEdit size={13} />
                                                            </ActionIconButton>

                                                            <ActionIconButton
                                                                $variant="danger"
                                                                onClick={() => handleDeleteUser(user._id)}
                                                                title="Delete User"
                                                            >
                                                                <FaTrashAlt size={13} />
                                                            </ActionIconButton>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={currentUserRole === 'superadmin' ? 9 : 8} className="py-5 text-muted">
                                                <div className="d-flex flex-column align-items-center justify-content-center">
                                                    <FaInfoCircle size={28} className="text-secondary mb-2 opacity-50" />
                                                    <span className="fw-semibold">No user records match your search or filter</span>
                                                    <Button variant="link" size="sm" onClick={handleResetFilters} className="mt-1">
                                                        Clear search & filters
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    {/* Compact Pagination Bar */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light flex-wrap gap-2">
                            <span className="text-muted small">
                                Showing {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                            </span>

                            <div className="d-flex align-items-center gap-2">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="d-flex align-items-center gap-1 rounded-pill px-3"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                >
                                    <FaChevronLeft size={10} /> Prev
                                </Button>

                                <span className="fw-bold text-primary small px-2">
                                    {currentPage} / {totalPages}
                                </span>

                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="d-flex align-items-center gap-1 rounded-pill px-3"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                >
                                    Next <FaChevronRight size={10} />
                                </Button>
                            </div>
                        </div>
                    )}
                </TableCard>

                {/* Create / Edit User Modal */}
                <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    centered
                    size="lg"
                    contentClassName="border-0 shadow-lg"
                    style={{ borderRadius: '1rem' }}
                >
                    <Modal.Header closeButton className="py-3 px-4 bg-light border-bottom">
                        <Modal.Title className="fs-5 fw-bold text-primary d-flex align-items-center gap-2">
                            <FaUserCog />
                            <span>{editingUser ? 'Update User Details' : 'Register New Account'}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                        <Form>
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Group controlId="formName">
                                        <Form.Label className="fw-bold text-dark small">Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g. John Doe"
                                            name="name"
                                            value={newUser.name}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formUsername">
                                        <Form.Label className="fw-bold text-dark small">Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g. johndoe123"
                                            name="username"
                                            value={newUser.username}
                                            onChange={handleInputChange}
                                            disabled={!!editingUser}
                                        />
                                    </Form.Group>
                                </Col>
                                {!editingUser && (
                                    <Col md={6}>
                                        <Form.Group controlId="formPassword">
                                            <Form.Label className="fw-bold text-dark small">Access Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter secure password"
                                                name="password"
                                                value={newUser.password}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                )}
                                <Col md={editingUser ? 6 : 6}>
                                    <Form.Group controlId="formRole">
                                        <Form.Label className="fw-bold text-dark small">System Role</Form.Label>
                                        <Form.Select
                                            name="role"
                                            value={newUser.role}
                                            onChange={handleInputChange}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="manager">Manager</option>
                                            <option value="superadmin">Super Admin</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formPerHourTk">
                                        <Form.Label className="fw-bold text-dark small">Per Hour Rate (TK)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="e.g. 100"
                                            name="perHourTk"
                                            value={newUser.perHourTk}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {newUser.role !== 'superadmin' && (
                                <>
                                    <div className="mt-3 mb-3 p-2.5 px-3 bg-light rounded-3 border">
                                        <div className="row align-items-center">
                                            <div className="col-md-7">
                                                <div className="fw-bold text-dark" style={{ fontSize: '0.82rem' }}>
                                                    <FaMoon className="text-primary me-1.5" /> Night Lock (12AM - 7AM)
                                                </div>
                                                <div className="text-muted" style={{ fontSize: '0.74rem' }}>
                                                    Restrict login access during night hours in BD (GMT+6).
                                                </div>
                                            </div>
                                            <div className="col-md-5 d-flex justify-content-end align-items-center gap-2">
                                                <span className={`fw-bold ${newUser.autoLock ? 'text-primary' : 'text-muted'}`} style={{ fontSize: '0.74rem' }}>
                                                    {newUser.autoLock ? 'ACTIVE' : 'DISABLED'}
                                                </span>
                                                <CompactToggleSwitch
                                                    $active={newUser.autoLock}
                                                    onClick={() => setNewUser(prev => ({ ...prev, autoLock: !prev.autoLock }))}
                                                >
                                                    <div className="knob" />
                                                </CompactToggleSwitch>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 mb-2">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div>
                                                <Form.Label className="fw-bold mb-0 text-dark" style={{ fontSize: '0.85rem' }}>Access Permissions</Form.Label>
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                    {newUser.permissions.length} of {AVAILABLE_MODULES.length} modules selected
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={handleCheckAll}
                                                className="rounded-pill px-3 py-1 fw-semibold"
                                                style={{ fontSize: '0.74rem' }}
                                            >
                                                {newUser.permissions.length === AVAILABLE_MODULES.length ? 'Revoke All' : 'Grant All'}
                                            </Button>
                                        </div>
                                        <PermissionSection>
                                            <div className="permission-grid">
                                                {AVAILABLE_MODULES.map((module) => {
                                                    const isChecked = newUser.permissions.includes(module.key);
                                                    return (
                                                        <PermissionItem
                                                            key={module.key}
                                                            $checked={isChecked}
                                                            htmlFor={`perm-${module.key}`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id={`perm-${module.key}`}
                                                                checked={isChecked}
                                                                onChange={() => handlePermissionChange(module.key)}
                                                            />
                                                            <span className="perm-text" title={module.label}>
                                                                {module.label}
                                                            </span>
                                                        </PermissionItem>
                                                    );
                                                })}
                                            </div>
                                        </PermissionSection>
                                        <div className="mt-2 text-muted d-flex align-items-center gap-1.5" style={{ fontSize: '0.74rem' }}>
                                            <FaInfoCircle color="#4299e1" size={12} />
                                            <span>Finance, Logs, Reports & User management are strictly restricted to Super Admins.</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="bg-light border-0 p-3">
                        <Button variant="secondary" onClick={handleCloseModal} className="fw-semibold px-4">
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSaveUser} className="fw-semibold px-4">
                            {editingUser ? 'Save Changes' : 'Create Account'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete Confirmation Modal */}
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

                {/* Login History Modal */}
                <Modal
                    show={showHistoryModal}
                    onHide={() => setShowHistoryModal(false)}
                    centered
                    size="xl"
                    contentClassName="border-0 shadow-lg"
                    style={{ borderRadius: '1rem' }}
                >
                    <Modal.Header closeButton className="py-3 px-4 bg-light border-bottom">
                        <Modal.Title className="fs-5 fw-bold text-primary d-flex align-items-center gap-2">
                            <FaHistory />
                            <span>Login Activity: {historyUser?.name}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0" style={{ maxHeight: '650px', overflowY: 'auto' }}>
                        {historyData.length > 0 ? (
                            <div className="table-responsive">
                                <Table bordered hover className="mb-0 align-middle text-center" style={{ fontSize: '0.85rem', borderColor: '#dee2e6' }}>
                                    <thead className="bg-light sticky-top" style={{ borderBottom: '2px solid #cbd5e1' }}>
                                        <tr>
                                            <th className="px-3 py-2.5 text-secondary small text-uppercase fw-bold text-start">Login Date</th>
                                            <th className="px-3 py-2.5 text-secondary small text-uppercase fw-bold">Time</th>
                                            <th className="px-3 py-2.5 text-secondary small text-uppercase fw-bold text-start">Device & OS</th>
                                            <th className="px-3 py-2.5 text-secondary small text-uppercase fw-bold text-start">User Agent</th>
                                            <th className="px-3 py-2.5 text-secondary small text-uppercase fw-bold text-end pe-4">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.map((log, idx) => (
                                            <tr key={idx}>
                                                <td className="px-3 py-2.5 fw-bold text-dark text-start">
                                                    {new Date(log.timestamp).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-3 py-2.5 text-secondary">
                                                    {new Date(log.timestamp).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-3 py-2.5 text-start">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Badge bg={log.userAgent?.includes('Mobile') ? 'info' : 'primary'} className="bg-opacity-10 text-primary border border-primary px-2 py-0.5">
                                                            {log.userAgent?.includes('Mobile') ? 'Mobile' : 'Desktop'}
                                                        </Badge>
                                                        <span className="small text-muted">
                                                            {log.userAgent?.match(/\(([^)]+)\)/)?.[1]?.split(';')[0] || 'Unknown OS'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 text-start">
                                                    <div className="text-muted small text-truncate" style={{ maxWidth: '280px' }} title={log.userAgent}>
                                                        {log.userAgent}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 text-end pe-4">
                                                    <code className="bg-light px-2 py-1 rounded text-dark border small">
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
                                <FaInfoCircle size={28} className="mb-2 opacity-50" />
                                <p className="mb-0">No login records found for this account.</p>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="bg-light border-0 p-3">
                        <Button variant="secondary" onClick={() => setShowHistoryModal(false)} className="px-4 fw-semibold">
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Change Password Modal */}
                <Modal
                    show={showPasswordModal}
                    onHide={handleClosePasswordModal}
                    centered
                    contentClassName="border-0 shadow-lg"
                    style={{ borderRadius: '1rem' }}
                >
                    <Modal.Header closeButton className="py-3 px-4 bg-light border-bottom">
                        <Modal.Title className="fs-5 fw-bold text-dark d-flex align-items-center gap-2">
                            <FaKey className="text-warning" />
                            <span>Change Password: {passwordTargetUser?.name}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                        <Form onSubmit={(e) => { e.preventDefault(); handleSavePassword(); }}>
                            <Form.Group controlId="formChangeNewPassword">
                                <Form.Label className="fw-bold text-dark small">New Password</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type={showNewPassword ? 'text' : 'password'}
                                        placeholder="Enter new password (min 4 characters)"
                                        value={newPasswordInput}
                                        onChange={(e) => setNewPasswordInput(e.target.value)}
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#94a3b8',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: 0
                                        }}
                                    >
                                        {showNewPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                    </button>
                                </div>
                                <Form.Text className="text-muted" style={{ fontSize: '0.78rem' }}>
                                    The new password will be securely hashed with bcrypt upon saving.
                                </Form.Text>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="bg-light border-0 p-3">
                        <Button variant="secondary" onClick={handleClosePasswordModal} className="fw-semibold px-3">
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSavePassword} className="fw-semibold px-4">
                            Update Password
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Processing Overlay */}
                {isProcessing && (
                    <ProcessingOverlay>
                        <div className="loader-content">
                            <Spinner animation="border" variant="primary" size="lg" />
                            <h5 className="mt-3 fw-bold text-primary mb-1">{processMessage}</h5>
                            <p className="text-muted small mb-0">Please wait, performing action...</p>
                        </div>
                    </ProcessingOverlay>
                )}

                <ToastContainer />
            </ContentContainer>
        </PageContainer>
    );
};

export default UserPage;
