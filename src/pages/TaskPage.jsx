import React, { useState, useEffect } from 'react';
import TaskModal from '../components/modals/TaskModal';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';


const TaskPage = () => {
    const [taskList, setTaskList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [tuitionCodeSearchQuery, setTuitionCodeSearchQuery] = useState('');
    const [employeeNameSearchQuery, setEmployeeNameSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const token = localStorage.getItem('token');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const limit = 20;

    const [appliedFilters, setAppliedFilters] = useState({
        tuitionCode: '',
        employeeName: '',
        status: ''
    });

    const [totalTaskCount, setTotalTaskCount] = useState(0);
    const [todayTaskCount, setTodayTaskCount] = useState(0);
    const [completedTodayCount, setCompletedTodayCount] = useState(0);
    const [pendingTaskCount, setPendingTaskCount] = useState(0);
    const [completedTaskCount, setCompletedTaskCount] = useState(0);
    const [todayPendingTaskCount, setTodayPendingTaskCount] = useState(0);
    const [todayOngoingTaskCount, setTodayOngoingTaskCount] = useState(0);
    const [totalOngoingTaskCount, setTotalOngoingTaskCount] = useState(0);

    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [completingTask, setCompletingTask] = useState(null);
    const [completionComment, setCompletionComment] = useState('');

    const userRole = localStorage.getItem('role');

    useEffect(() => {
        fetchTaskRecords(1);
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/user/users', {
                headers: { Authorization: token },
            });
            setUserList(response.data);
        } catch (err) {
            console.error('Error:', err);
            toast.error("Failed.");
        }
    };

    const fetchTaskRecords = async (page = 1, filters = appliedFilters) => {
        setLoading(true);
        try {
            const params = {
                page,
                limit,
                tuitionCode: filters.tuitionCode,
                employeeName: filters.employeeName,
                status: filters.status
            };
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/taskData/all', {
                headers: { Authorization: token },
                params
            });
            setTaskList(response.data.data);
            setTotalPages(response.data.totalPages);
            setTotalRecords(response.data.totalRecords);
            setCurrentPage(response.data.currentPage);
            fetchSummaryCounts(filters);
        } catch (err) {
            console.error('Error fetching task records:', err);
            toast.error("Failed to load task records.");
        }
        setLoading(false);
    };

    const fetchSummaryCounts = async (filters = appliedFilters) => {
        try {
            const params = {
                tuitionCode: filters.tuitionCode,
                employeeName: filters.employeeName
            };
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/taskData/summary', {
                headers: { Authorization: token },
                params
            });
            const data = response.data;
            setTotalTaskCount(data.total);
            setTodayTaskCount(data.todayAssigned);
            setTodayPendingTaskCount(data.todayPending);
            setCompletedTodayCount(data.todayCompleted);
            setCompletedTaskCount(data.totalCompleted);
            setPendingTaskCount(data.totalPending);
            setTotalOngoingTaskCount(data.totalOngoing);
            setTodayOngoingTaskCount(data.todayOngoing);
        } catch (err) {
            console.error('Error fetching summary:', err);
        }
    };

    const handleSearch = () => {
        const filters = {
            tuitionCode: tuitionCodeSearchQuery,
            employeeName: employeeNameSearchQuery,
            status: statusFilter
        };
        setAppliedFilters(filters);
        fetchTaskRecords(1, filters);
    };

    const handlePageChange = (page) => {
        fetchTaskRecords(page);
    };

    const isOverdue = (deadline, status) => {
        if (!deadline || status === 'completed') return false;
        return new Date(deadline) < new Date();
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
            "Employee Name", "Tuition Code", "Assigned At", "Deadline", "Status", "Task", "Comment"
        ];

        const tableData = taskList.map(task => [
            String(task.employeeName ?? ""),
            String(task.tuitionCode ?? ""),
            task.createdAt ? formatDate(task.createdAt) : "",
            task.deadline ? formatDate(task.deadline) : "N/A",
            String(task.status ?? ""),
            String(task.task ?? ""),
            String(task.comment ?? ""),
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);

        worksheet['!cols'] = [
            { wpx: 90 },
            { wpx: 140 },
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

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    const handleSaveTask = async (data) => {
        try {
            if (editingTask) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/taskData/edit/${editingTask._id}`, data);
                toast.success("Task updated successfully!");
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/taskData/add', data);
                toast.success("Task created successfully!");
            }
            setShowModal(false);
            fetchTaskRecords(currentPage);
        } catch (err) {
            console.error('Error saving task:', err);
            toast.error("Error saving task.");
        }
    };

    const handleDeleteTask = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task record?");

        if (confirmDelete) {
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/taskData/delete/${id}`);
                toast.success("task record deleted successfully!");
                fetchTaskRecords(currentPage);
            } catch (err) {
                console.error('Error deleting task record:', err);
                toast.error("Error deleting task record.");
            }
        } else {
            toast.info("Deletion canceled");
        }
    };

    const handleCompleteTaskClick = (task) => {
        setCompletingTask(task);
        setCompletionComment(task.comment || '');
        setShowCompleteModal(true);
    };

    const handleConfirmComplete = async () => {
        try {
            const data = {
                ...completingTask,
                status: 'completed',
                comment: completionComment
            };
            await axios.put(`https://tuition-seba-backend-1.onrender.com/api/taskData/edit/${completingTask._id}`, data);
            toast.success("Task completed successfully!");
            setShowCompleteModal(false);
            fetchTaskRecords(currentPage);
        } catch (err) {
            console.error('Error completing task:', err);
            toast.error("Error updating task.");
        }
    };

    const handleResetFilters = () => {
        setStatusFilter('');
        setTuitionCodeSearchQuery('');
        setEmployeeNameSearchQuery('');
        const resetFilters = {
            tuitionCode: '',
            employeeName: '',
            status: ''
        };
        setAppliedFilters(resetFilters);
        fetchTaskRecords(1, resetFilters);
    };

    return (
        <>
            <NavBarPage />
            <Container>
                <Header>
                    <h2 className='text-primary fw-bold'>Task Dashboard</h2>
                    <Button variant="primary" onClick={() => { setEditingTask(null); setShowModal(true); }}>
                        Create Task
                    </Button>
                </Header>

                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary h-100">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Task</span>
                                        <span>{totalTaskCount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary h-100">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Assigned Today</span>
                                        <span>{todayTaskCount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-danger h-100">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-danger" style={{ fontWeight: 'bolder' }}>Pending Today</span>
                                        <span>{todayPendingTaskCount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-success h-100">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-success" style={{ fontWeight: 'bolder' }}>Completed Today</span>
                                        <span>{completedTodayCount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-danger h-100">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-danger" style={{ fontWeight: 'bolder' }}>Total Pending</span>
                                        <span>{pendingTaskCount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-success h-100">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-success" style={{ fontWeight: 'bolder' }}>Total Completed</span>
                                        <span>{completedTaskCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                {/* Search bar */}
                <Row className="mt-2 mb-3">
                    {userRole === 'superadmin' && (
                        <Col md={2}>
                            <Form.Label className="fw-bold">Search (Employee Name)</Form.Label>
                            <CreatableSelect
                                isClearable
                                options={userList.map(user => ({ label: user.name, value: user.name }))}
                                onChange={(newValue) =>
                                    setEmployeeNameSearchQuery(newValue ? newValue.value : '')
                                }
                                value={
                                    employeeNameSearchQuery
                                        ? { label: employeeNameSearchQuery, value: employeeNameSearchQuery }
                                        : null
                                }
                                placeholder="Search by employee name"
                                styles={{
                                    menu: (provided) => ({
                                        ...provided,
                                        zIndex: 9999,
                                        position: 'absolute',
                                    }),
                                }}
                            />

                        </Col>
                    )}

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Tuition Code)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Tuition Code"
                            value={tuitionCodeSearchQuery}
                            onChange={(e) => setTuitionCodeSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Status</Form.Label>
                        <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </Form.Select>
                    </Col>

                    <Col md={2} className="d-flex align-items-end gap-2">
                        <Button variant="primary" onClick={handleSearch} className="w-100">
                            Search
                        </Button>
                        <Button variant="danger" onClick={handleResetFilters} className="w-100">
                            Reset
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
                                        <th>Deadline</th>
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
                                        taskList.map((task, index) => (
                                            <tr key={task._id}>
                                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                                <td>{task.employeeName}</td>
                                                <td>{task.tuitionCode}</td>
                                                <td>{task.createdAt ? formatDate(task.createdAt) : ''}</td>
                                                <td>
                                                    {task.deadline ? (
                                                        <div className={isOverdue(task.deadline, task.status) ? 'text-danger fw-bold' : ''}>
                                                            {formatDate(task.deadline)}
                                                            {isOverdue(task.deadline, task.status) && (
                                                                <div><span className="badge bg-danger mt-1">OVERDUE</span></div>
                                                            )}
                                                        </div>
                                                    ) : 'N/A'}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge 
                                                            ${task.status === "pending" ? "bg-danger" : ""}  
                                                            ${task.status === "ongoing" ? "bg-warning text-dark" : ""}
                                                            ${task.status === "completed" ? "bg-success" : ""}
                                                            `}
                                                    >
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td>{task.task}</td>
                                                <td>{task.comment}</td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                    {task.status !== 'completed' && (
                                                        <Button variant="success" onClick={() => handleCompleteTaskClick(task)} title="Complete Task">
                                                            <FaCheckCircle />
                                                        </Button>
                                                    )}
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

                        {/* Pagination Controls */}
                        {!loading && totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-4">
                                <Button
                                    variant="outline-primary"
                                    className="mx-1"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <span className="align-self-center mx-3">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline-primary"
                                    className="mx-1"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>

                <TaskModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    onSave={handleSaveTask}
                    editingTask={editingTask}
                    userList={userList}
                    userRole={userRole}
                />

                {/* Complete Task Modal */}
                <Modal show={showCompleteModal} onHide={() => setShowCompleteModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Complete Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to mark this task as <strong>Completed</strong>?</p>
                        <Form.Group controlId="completeComment">
                            <Form.Label className="fw-bold">Completion Comment (Optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter any final notes..."
                                value={completionComment}
                                onChange={(e) => setCompletionComment(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCompleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="success" onClick={handleConfirmComplete}>
                            Confirm Completion
                        </Button>
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
