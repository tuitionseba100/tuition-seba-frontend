import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import NavBarPage from './NavbarPage';

const AttendancePage = () => {
    const [attendance, setAttendance] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchAttendance();
    }, []);

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

    return (
        <>
            <NavBarPage />
            <div className="container mt-4">
                <h2>Attendance Tracker</h2>
                <Button variant="success" onClick={startDay} className="me-2">Start Day</Button>
                <Button variant="danger" onClick={endDay}>End Day</Button>

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
                        {attendance.map((entry) => (
                            <tr key={entry._id}>
                                <td>{entry.userName}</td>
                                <td>{entry.name}</td>
                                <td>{new Date(entry.startTime).toLocaleString()}</td>
                                <td>{entry.endTime ? new Date(entry.endTime).toLocaleString() : 'Running'}</td>
                                <td>{entry.duration || 'N/A'}</td>
                                {localStorage.getItem('role') === 'superadmin' && (
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => deleteAttendance(entry._id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <ToastContainer />
            </div>
        </>
    );
};

export default AttendancePage;
