import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';

const TuitionAssignModal = ({ show, onHide, tuition, fetchTuitionRecords }) => {
    const [assignedTo, setAssignedTo] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingUsers, setFetchingUsers] = useState(false);

    useEffect(() => {
        if (show) {
            setAssignedTo(tuition?.assignedTo || '');
            fetchUsers();
        }
    }, [show, tuition]);

    const fetchUsers = async () => {
        setFetchingUsers(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/user/users', {
                headers: { Authorization: token }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users list');
        } finally {
            setFetchingUsers(false);
        }
    };

    const handleAssign = async () => {
        if (!assignedTo) {
            toast.warning('Please select an employee');
            return;
        }

        const confirmAssign = window.confirm(`Are you sure you want to assign this tuition to ${assignedTo}?`);
        if (!confirmAssign) return;

        setLoading(true);
        try {
            const username = localStorage.getItem('username');
            await axios.put(`https://tuition-seba-backend-1.onrender.com/api/tuition/edit/${tuition._id}`, {
                assignedTo: assignedTo,
                updatedBy: username
            });
            toast.success(`Tuition assigned to ${assignedTo} successfully!`);
            fetchTuitionRecords();
            onHide();
        } catch (error) {
            console.error('Error assigning tuition:', error);
            toast.error('Failed to assign tuition');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Assign Employee - {tuition?.tuitionCode}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Select Employee</Form.Label>
                    {fetchingUsers ? (
                        <div className="text-center py-3">
                            <Spinner animation="border" size="sm" variant="primary" />
                            <span className="ms-2">Loading users...</span>
                        </div>
                    ) : (
                        <Select
                            options={users.map(user => ({ 
                                value: user.username, 
                                label: `${user.name} (${user.username})` 
                            }))}
                            value={users.find(u => u.username === assignedTo) ? { 
                                value: assignedTo, 
                                label: `${users.find(u => u.username === assignedTo).name} (${assignedTo})` 
                            } : null}
                            onChange={(option) => setAssignedTo(option ? option.value : '')}
                            isClearable
                            placeholder="Search or select employee..."
                            isDisabled={loading}
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    border: '1.5px solid rgba(13,110,253,0.3)',
                                    boxShadow: state.isFocused
                                        ? '0 0 6px rgba(13,110,253,0.25)'
                                        : '0 0 4px rgba(13,110,253,0.12)',
                                    '&:hover': { borderColor: 'rgba(13,110,253,0.5)' },
                                    minHeight: '42px',
                                    borderRadius: '0.375rem',
                                    backgroundColor: 'white',
                                }),
                                menuPortal: (base) => ({ ...base, zIndex: 9999 })
                            }}
                            menuPortalTarget={document.body}
                        />
                    )}
                </Form.Group>
                <div className="text-muted small">
                    <p>Current Assignment: <strong>{tuition?.assignedTo || 'Unassigned'}</strong></p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleAssign} disabled={loading || fetchingUsers}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Assign & Update'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TuitionAssignModal;
