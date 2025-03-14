import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';

const UserPage = () => {
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'admin' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/user/users');
            setUserList(response.data);
        } catch (err) {
            setError('Error fetching users');
            toast.error('Error fetching users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/user/delete/${id}`);
            fetchUsers();
            toast.success('User deleted successfully');
        } catch (err) {
            setError('Error deleting user');
            toast.error('Error deleting user');
            console.error('Error deleting user:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewUser({ username: '', password: '', name: '', role: 'admin' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSaveUser = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log(newUser);
            await axios.post('https://tuition-seba-backend-1.onrender.com/api/user/register', newUser);
            fetchUsers();
            handleCloseModal();
            toast.success('User added successfully');
        } catch (err) {
            setError('Error adding user');
            toast.error('Error adding user');
            console.error('Error adding user:', err);
        } finally {
            setLoading(false);
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
                    <Button variant="primary" onClick={handleOpenModal} className="btn btn-primary">Add New User</Button>
                </div>
                {loading && <p>Loading...</p>}
                <Table striped bordered hover responsive className="mt-4">
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
                                <td>
                                    <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>
                                        <FaTrashAlt />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Modal for adding new user */}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New User</Modal.Title>
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

                            {/* Role dropdown */}
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
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal} className="rounded-pill">
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveUser} className="rounded-pill">
                            Save User
                        </Button>
                    </Modal.Footer>
                </Modal>
                <ToastContainer />
            </div>
        </>
    );
};

export default UserPage;
