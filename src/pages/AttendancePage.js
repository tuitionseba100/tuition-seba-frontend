import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import NavBarPage from './NavbarPage';

const AttendancePage = () => {
    const [attendance, setAttendance] = useState([]);
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [filter, setFilter] = useState('today');
    const [users, setUsers] = useState([]);
    const [userFilter, setUserFilter] = useState(null); // User filter state
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchAttendance();
        fetchUsers(); // Fetch users on mount
    }, []);

    useEffect(() => {
        applyFilter();
    }, [filter, userFilter, attendance]);

    const fetchAttendance = async () => {
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/attendance', {
                headers: { Authorization: token },
            });
            setAttendance(response.data);
        } catch (error) {
            toast.error('Error fetching attendance');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/user/users');
            setUsers(response.data);
        } catch (error) {
            toast.error('Error fetching users');
        }
    };

    const startDay = async () => {
        try {
            await axios.post('https://tuition-seba-backend-1.onrender.com/api/attendance/start', {}, {
                headers: { Authorization: token },
            });
            toast.success('Day started');
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error starting day');
        }
    };

    const endDay = async () => {
        try {
            const response = await axios.put('https://tuition-seba-backend-1.onrender.com/api/attendance/end', {}, {
                headers: { Authorization: token },
            });
            toast.success(`Day ended (${response.data.duration})`);
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error ending day');
        }
    };

    const deleteAttendance = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/attendance/${id}`, {
                headers: { Authorization: token },
            });
            toast.success('Attendance record deleted');
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting record');
        }
    };

    const applyFilter = () => {
        const now = new Date();
        let filtered = [...attendance];

        if (filter === 'today') {
            filtered = filtered.filter(entry => {
                const startDate = new Date(entry.startTime);
                return startDate.toDateString() === now.toDateString();
            });
        } else if (filter === 'last7days') {
            const last7Days = new Date();
            last7Days.setDate(now.getDate() - 7);
            filtered = filtered.filter(entry => new Date(entry.startTime) >= last7Days);
        } else if (filter === 'lastMonth') {
            const lastMonth = new Date();
            lastMonth.setMonth(now.getMonth() - 1);
            lastMonth.setDate(1);
            filtered = filtered.filter(entry => new Date(entry.startTime) >= lastMonth);
        } else {
            const monthIndex = new Date(`${filter} 1, ${now.getFullYear()}`).getMonth();
            filtered = filtered.filter(entry => new Date(entry.startTime).getMonth() === monthIndex);
        }

        if (userFilter) {
            filtered = filtered.filter(entry => entry.userId === userFilter.value); // Filter by selected user
        }

        setFilteredAttendance(filtered);
    };

    const filterOptions = [
        { value: 'today', label: 'Today' },
        { value: 'last7days', label: 'Last 7 Days' },
        { value: 'lastMonth', label: 'Last Month' },
        { value: 'january', label: 'January' },
        { value: 'february', label: 'February' },
        { value: 'march', label: 'March' },
        { value: 'april', label: 'April' },
        { value: 'may', label: 'May' },
        { value: 'june', label: 'June' },
        { value: 'july', label: 'July' },
        { value: 'august', label: 'August' },
        { value: 'september', label: 'September' },
        { value: 'october', label: 'October' },
        { value: 'november', label: 'November' },
        { value: 'december', label: 'December' }
    ];

    const userOptions = users.map(user => ({ value: user._id, label: user.name }));

    return (
        <>
            <NavBarPage />
            <div className="container mt-4">
                <h2>Attendance Tracker</h2>
                <Button variant="success" onClick={startDay} className="me-2">Start Day</Button>
                <Button variant="danger" onClick={endDay}>End Day</Button>

                <Row className="mt-3">
                    <Col md={4}>
                        <Form.Label className="fw-bold">Filter By Date</Form.Label>
                        <Select
                            value={filterOptions.find(option => option.value === filter)}
                            onChange={(selectedOption) => setFilter(selectedOption.value)}
                            options={filterOptions}
                            getOptionLabel={(e) => e.label}
                            getOptionValue={(e) => e.value}
                        />
                    </Col>

                    {localStorage.getItem('role') === 'superadmin' && (
                        <Col md={4}>
                            <Form.Label className="fw-bold">Filter By User</Form.Label>
                            <Select
                                value={userFilter}
                                onChange={setUserFilter}
                                options={userOptions}
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                                isClearable
                            />
                        </Col>
                    )}
                </Row>

                <Table striped bordered hover responsive className="mt-4">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            {localStorage.getItem('role') === 'superadmin' && (<th>Actions</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAttendance.length === 0 ? (
                            <tr>
                                <td colSpan={localStorage.getItem('role') === 'superadmin' ? 6 : 5} className="text-center">
                                    No attendance record found
                                </td>
                            </tr>
                        ) : (
                            filteredAttendance.map((entry) => (
                                <tr key={entry._id}>
                                    <td>{entry.userName}</td>
                                    <td>{entry.name}</td>
                                    <td>{new Date(entry.startTime).toLocaleString()}</td>
                                    <td>{entry.endTime ? new Date(entry.endTime).toLocaleString() : 'Running'}</td>
                                    <td>{entry.duration || 'N/A'}</td>
                                    {localStorage.getItem('role') === 'superadmin' && (
                                        <td>
                                            <Button variant="danger" size="sm" onClick={() => deleteAttendance(entry._id)}>
                                                Delete
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>

                <ToastContainer />
            </div>
        </>
    );
};

export default AttendancePage;
