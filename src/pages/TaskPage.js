import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const TaskPage = () => {
    const [taskList, setTaskList] = useState([]);
    const [filteredTaskList, setFilteredTaskList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [taskData, setTaskData] = useState({
        tuitionCode: '',
        tuitionId: '',
        employeeName: '',
        employeeId: '',
        status: '',
        task: '',
        comment: '',
    });
    const [loading, setLoading] = useState(false);
    const [tuitionList, setTuitionList] = useState([]);
    const [userList, setUserList] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchTaskRecords();
        fetchTuitions();
        fetchUsers();
    }, []);


    const fetchTuitions = async () => {
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/tuition/all');
            setTuitionList(response.data);
        } catch (err) {
            console.error('Error fetching tuitions:', err);
            toast.error("Failed to load tuitions.");
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/user/users');
            setUserList(response.data);
        } catch (err) {
            console.error('Error:', err);
            toast.error("Failed.");
        }
    };

    const fetchTaskRecords = async () => {
        setLoading(true);
        try {
            console.log(token);
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/taskData/all', {
                headers: { Authorization: token },
            });
            setTaskList(response.data);
            setFilteredTaskList(response.data);
        } catch (err) {
            console.error('Error fetching task records:', err);
            toast.error("Failed to load task records.");
        }
        setLoading(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const optionsDate = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };

        const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
        const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);

        return `${formattedDate} || ${formattedTime}`;
    };

    const handleExportToExcel = () => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
        const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');

        const fileName = `Task List_${formattedDate}_${formattedTime}`;

        const tableHeaders = [
            "Employee Name", "Tuition Code", "Assigned At", "Status", "Task", "Comment"
        ];

        const tableData = filteredTaskList.map(task => [
            String(task.employeeName ?? ""),
            String(task.tuitionCode ?? ""),
            task.createdAt ? formatDate(task.createdAt) : "",
            String(task.status ?? ""),
            String(task.task ?? ""),
            String(task.comment ?? ""),
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);

        worksheet['!cols'] = [
            { wpx: 90 },
            { wpx: 140 },
            { wpx: 140 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const handleSaveTask = async () => {
        if (!taskData.employeeId || taskData.employeeId.trim() === '') {
            toast.error("Please select an employee.");
            return;
        }

        const selectedTuition = tuitionList.find(tuition => tuition._id === taskData.tuitionId);
        const selectedEmployee = userList.find(user => user._id === taskData.employeeId);
        const updatedTaskData = {
            ...taskData,
            tuitionCode: selectedTuition.tuitionCode,
            employeeName: selectedEmployee.name,
            employeeRole: selectedEmployee.role,
        };

        try {
            if (editingId) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/taskData/edit/${editingId}`, updatedTaskData);
                toast.success("Tuition record updated successfully!");
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/taskData/add', updatedTaskData);
                toast.success("Tuition record created successfully!");
            }
            setShowModal(false);
            fetchTaskRecords();
        } catch (err) {
            console.error('Error saving task record:', err);
            toast.error("Error saving task record.");
        }
    };

    const handleEditTask = (task) => {
        setTaskData(task);
        setEditingId(task._id);
        setShowModal(true);
    };

    const handleDeleteTask = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task record?");

        if (confirmDelete) {
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/taskData/delete/${id}`);
                toast.success("task record deleted successfully!");
                fetchTaskRecords();
            } catch (err) {
                console.error('Error deleting task record:', err);
                toast.error("Error deleting task record.");
            }
        } else {
            toast.info("Deletion canceled");
        }
    };

    const handleResetFilters = () => {
        setFilteredTaskList(taskList);
    };

    return (
        <>
            <NavBarPage />
            <Container>

                <Header>
                    <h2 className='text-primary fw-bold'>Task Dashboard</h2>
                    <Button variant="primary" onClick={() => { setShowModal(true); setEditingId(null); setTaskData({ employeeName: '', employeeId: '', tuitionCode: '', tuitionId: '', employeeRole: '', task: '', status: '', comment: '' }) }}>
                        Create Task
                    </Button>
                </Header>


                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Task Count</span>
                                        <span>0</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Task Assigned Today</span>
                                        <span>0</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Task Completed Today</span>
                                        <span>0</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Task Remaining</span>
                                        <span>0</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>--</span>
                                        <span>0</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>--</span>
                                        <span>0</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Card.Body>
                </Card>

                {/* Search bar */}
                <Row className="mt-2 mb-3">

                    <Col md={2} className="d-flex align-items-end">
                        <Button variant="danger" onClick={handleResetFilters} className="w-100">
                            Reset Filters
                        </Button>
                    </Col>
                </Row>

                <Button variant="success" className="mb-3" onClick={handleExportToExcel}>
                    Export to Excel
                </Button>

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Tasks List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Employee Name</th>
                                        <th>Tuition Code</th>
                                        <th>Assigned At</th>
                                        <th>Status</th>
                                        <th>Task</th>
                                        <th>Comment</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="20" className="text-center">
                                                <div className="d-flex justify-content-center align-items-center" style={{ position: 'absolute', top: '90%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vh' }}>
                                                    <Spinner animation="border" variant="primary" size="lg" />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTaskList.slice().reverse().map((task, index) => (
                                            <tr key={task._id}>
                                                <td>{index + 1}</td>
                                                <td>{task.employeeName}</td>
                                                <td>{task.tuitionCode}</td>
                                                <td>{task.createdAt ? formatDate(task.createdAt) : ''}</td>
                                                <td>
                                                    <span
                                                        className={`badge 
                                                            ${task.status === "pending" ? "bg-danger" : ""}  
                                                            ${task.status === "completed" ? "bg-success" : ""}
                                                            `}
                                                    >
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td>{task.task}</td>
                                                <td>{task.comment}</td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                    <Button variant="warning" onClick={() => handleEditTask(task)} className="mr-2">
                                                        <FaEdit />
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleDeleteTask(task._id)}>
                                                        <FaTrashAlt />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </Table>
                        </div>
                    </Card.Body>
                </Card>

                {/* Create/Edit Task Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">{editingId ? "Edit Task" : "Create Task"}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="employeeId">
                                        <Form.Label className="fw-bold">Employee Name</Form.Label>
                                        <Select
                                            options={userList.map(user => ({
                                                value: user._id,
                                                label: user.name?.trim() ? user.name : user.username
                                            }))}
                                            value={userList.find(user => user._id === taskData.employeeId) ? {
                                                value: userList.find(user => user._id === taskData.employeeId)._id,
                                                label: userList.find(user => user._id === taskData.employeeId).name?.trim()
                                                    ? userList.find(user => user._id === taskData.employeeId).name
                                                    : userList.find(user => user._id === taskData.employeeId).username
                                            } : null}
                                            onChange={(selectedOption) => setTaskData({ ...taskData, employeeId: selectedOption.value })}
                                            placeholder="Select Employee"
                                            isSearchable
                                        />
                                    </Form.Group>

                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="tuitionId">
                                        <Form.Label className="fw-bold">Tuition Code</Form.Label>
                                        <Select
                                            options={tuitionList.map(tuition => ({
                                                value: tuition._id,
                                                label: tuition.tuitionCode
                                            }))}
                                            value={tuitionList.find(tuition => tuition._id === taskData.tuitionId) ? {
                                                value: tuitionList.find(tuition => tuition._id === taskData.tuitionId)._id,
                                                label: tuitionList.find(tuition => tuition._id === taskData.tuitionId).tuitionCode
                                            } : null}

                                            onChange={(selectedOption) => setTaskData({ ...taskData, tuitionId: selectedOption.value })}
                                            placeholder="Select Tuition Code"
                                            isSearchable
                                        />
                                    </Form.Group>
                                </Col>

                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="status">
                                        <Form.Label className="fw-bold">Task Status</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={taskData.status}
                                            onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Task Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="task">
                                        <Form.Label className="fw-bold">Task</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            value={taskData.task}
                                            onChange={(e) => setTaskData({ ...taskData, task: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="comment">
                                        <Form.Label className="fw-bold">Comment</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            value={taskData.comment}
                                            onChange={(e) => setTaskData({ ...taskData, comment: e.target.value })}
                                            required
                                        />
                                    </Form.Group>

                                </Col>
                            </Row>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSaveTask}>Save</Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer />
            </Container>
        </>
    );
};

export default TaskPage;

// Styled Components
const Container = styled.div`
  padding: 30px;
  background: #f4f4f9;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h2 {
    font-family: 'Arial', sans-serif;
    color: #333;
  }
`;
