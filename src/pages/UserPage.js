import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';

const UserPage = () => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user');
            setUserList(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/user/delete/${id}`);
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    return (
        <div>
            <h2>User List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map((user) => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.status}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserPage;
