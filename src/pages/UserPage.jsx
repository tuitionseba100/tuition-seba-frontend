import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Spinner } from 'react-bootstrap';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarPage from './NavbarPage';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmationModal from '../components/modals/ConfirmationModal';

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

const UserPage = () => {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'admin', permissions: [] });
    const [editingUser, setEditingUser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processMessage, setProcessMessage] = useState('');
    const token = localStorage.getItem('token');

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
                permissions: user.permissions || []
            });
        } else {
            setEditingUser(null);
            setNewUser({ username: '', password: '', name: '', role: 'admin', permissions: [] });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewUser({ username: '', password: '', name: '', role: 'admin', permissions: [] });
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
                setError('Error saving user');
                toast.error('Error saving user');
            }
            console.error('Error saving user:', err);
        } finally {
            setIsProcessing(false);
            setProcessMessage('');
        }
    };

    return (
        <>
            <header>
                <NavBarPage />
            </header>
            <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="d-flex justify-content-between align-items-center">
                    <h2 className="mb-4">User List</h2>
                    <Button variant="primary" onClick={() => handleOpenModal()} className="btn btn-primary">Add New User</Button>
                </div>
                {loading ? (
                    <div className="mt-4">
                        <Table striped bordered hover responsive>
                            <thead className="table-primary">
                                <tr>
                                    <th>Username</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Password</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i}>
                                        <td><div className="skeleton-text"></div></td>
                                        <td><div className="skeleton-text w-75"></div></td>
                                        <td><div className="skeleton-text w-50"></div></td>
                                        <td><div className="skeleton-text"></div></td>
                                        <td><div className="skeleton-text w-50"></div></td>
                                        <td><div className="skeleton-text w-75"></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <style>{`
                            .skeleton-text {
                                height: 20px;
                                background-color: #e9ecef;
                                border-radius: 4px;
                                width: 100%;
                                animation: pulse 1.5s infinite ease-in-out;
                            }
                            @keyframes pulse {
                                0% { opacity: 0.6; }
                                50% { opacity: 1; }
                                100% { opacity: 0.6; }
                            }
                            .processing-overlay {
                                position: fixed;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: rgba(255, 255, 255, 0.8);
                                backdrop-filter: blur(4px);
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                z-index: 10000;
                            }
                            .loader-content {
                                background: white;
                                padding: 2rem;
                                border-radius: 1rem;
                                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                                text-align: center;
                            }
                        `}</style>
                    </div>
                ) : (
                    <Table striped bordered hover responsive className="mt-4 shadow-sm">
                        <thead className="table-primary">
                            <tr>
                                <th>Username</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Password</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.name}</td>
                                    <td>{user.status}</td>
                                    <td>{user.password}</td>
                                    <td>{user.role}</td>
                                    <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeleteUser(user._id)}
                                            disabled={deleting}
                                        >
                                            {deleting && userToDelete === user._id ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : (
                                                <FaTrashAlt />
                                            )}
                                        </Button>
                                        <Button variant="warning" onClick={() => handleOpenModal(user)} className="ml-2">
                                            <FaEdit />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                {/* Modal for adding/editing user */}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingUser ? 'Edit User' : 'Add New User'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    name="username"
                                    value={newUser.username}
                                    onChange={handleInputChange}
                                    className="rounded-pill"
                                />
                            </Form.Group>

                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter name"
                                    name="name"
                                    value={newUser.name}
                                    onChange={handleInputChange}
                                    className="rounded-pill"
                                />
                            </Form.Group>

                            <Form.Group controlId="formPassword" className="mt-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter password"
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleInputChange}
                                    className="rounded-pill"
                                />
                            </Form.Group>

                            <Form.Group controlId="formRole" className="mt-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="role"
                                    value={newUser.role}
                                    onChange={handleInputChange}
                                    className="rounded-pill"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Superadmin</option>
                                </Form.Control>
                            </Form.Group>

                            {newUser.role === 'admin' && (
                                <Form.Group className="mt-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="fw-bold mb-0">Module Permissions</Form.Label>
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm" 
                                            onClick={handleCheckAll}
                                            className="rounded-pill px-3"
                                        >
                                            {newUser.permissions.length === AVAILABLE_MODULES.length ? 'Uncheck All' : 'Check All'}
                                        </Button>
                                    </div>
                                    <div className="row g-2 p-3 border rounded bg-light">
                                        {AVAILABLE_MODULES.map((module) => (
                                            <div key={module.key} className="col-6">
                                                <Form.Check
                                                    type="checkbox"
                                                    id={`perm-${module.key}`}
                                                    label={module.label}
                                                    checked={newUser.permissions.includes(module.key)}
                                                    onChange={() => handlePermissionChange(module.key)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <Form.Text className="text-muted mt-2">
                                        Note: Attendance is visible to all users. Finance and Users are only for Superadmins.
                                    </Form.Text>
                                </Form.Group>
                            )}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal} className="rounded-pill">
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveUser} className="rounded-pill">
                            {editingUser ? 'Update User' : 'Save User'}
                        </Button>
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
                
                {isProcessing && (
                    <div className="processing-overlay">
                        <div className="loader-content">
                            <Spinner animation="border" variant="primary" size="lg" />
                            <h4 className="mt-3 fw-bold text-primary">{processMessage}</h4>
                            <p className="text-muted mb-0">Please wait, performing action...</p>
                        </div>
                    </div>
                )}
                
                <ToastContainer />
            </div>
        </>
    );
};

export default UserPage;
