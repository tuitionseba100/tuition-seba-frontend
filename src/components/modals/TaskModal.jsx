import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';

const TaskModal = ({ show, handleClose, onSave, editingTask, userList }) => {
    const [taskData, setTaskData] = useState({
        tuitionCode: '',
        employeeName: '',
        employeeId: '',
        status: 'pending',
        task: '',
        comment: '',
        deadline: '',
    });

    useEffect(() => {
        if (editingTask) {
            // Convert ISO date to datetime-local format (YYYY-MM-DDTHH:mm)
            let formattedDeadline = '';
            if (editingTask.deadline) {
                const date = new Date(editingTask.deadline);
                // Adjust for local timezone offset manually to get correct input value
                const offset = date.getTimezoneOffset() * 60000;
                const localISODate = new Date(date.getTime() - offset).toISOString().slice(0, 16);
                formattedDeadline = localISODate;
            }

            setTaskData({
                ...editingTask,
                status: editingTask.status || 'pending',
                deadline: formattedDeadline
            });
        } else {
            setTaskData({
                tuitionCode: '',
                employeeName: '',
                employeeId: '',
                status: 'pending',
                task: '',
                comment: '',
                deadline: '',
            });
        }
    }, [editingTask, show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedEmployee = userList.find(user => user._id === taskData.employeeId);
        
        const finalData = {
            ...taskData,
            employeeName: selectedEmployee?.name || selectedEmployee?.username,
            employeeRole: selectedEmployee?.role,
        };
        
        onSave(finalData);
    };

    const handleQuickSelect = (hours) => {
        const date = new Date();
        date.setHours(date.getHours() + hours);
        const offset = date.getTimezoneOffset() * 60000;
        const localISODate = new Date(date.getTime() - offset).toISOString().slice(0, 16);
        setTaskData({ ...taskData, deadline: localISODate });
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            centered
            backdrop="static"
            contentClassName="shadow-lg rounded"
        >
            <Modal.Header
                closeButton
                style={{
                    backgroundColor: '#0d6efd',
                    color: 'white',
                    borderBottom: 'none',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1050,
                }}
                className="d-flex align-items-center justify-content-between"
            >
                <Modal.Title className="fw-bold">
                    {editingTask ? 'Edit Task Assignment' : 'Create New Task'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body
                className="bg-light"
                style={{
                    minHeight: '75vh',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    position: 'relative',
                    padding: '1rem 1.5rem',
                }}
            >
                <Form onSubmit={handleSubmit} className="h-100 d-flex flex-column">
                    <div className="flex-grow-1">
                        {/* Section 1: Assignee Info */}
                        <div
                            className="mb-4 p-3 rounded bg-white"
                            style={{
                                border: '1px solid rgba(13, 110, 253, 0.2)',
                                boxShadow: '0 0 10px rgba(13, 110, 253, 0.05)',
                            }}
                        >
                            <h6
                                className="mb-3 fw-bold"
                                style={{ borderBottom: '2px solid rgba(13, 110, 253, 0.5)', paddingBottom: '0.4rem', color: '#0d6efd', fontSize: '0.9rem' }}
                            >
                                Assignee Information
                            </h6>
                            
                            <Row className="gy-3">
                                <Col md={6}>
                                    <Form.Group controlId="employeeId">
                                        <Form.Label className="fw-bold text-dark small">Employee Name <span className="text-danger">*</span></Form.Label>
                                        <Select
                                            options={userList.map(user => ({
                                                value: user._id,
                                                label: user.name?.trim() ? user.name : user.username
                                            }))}
                                            value={userList.find(user => user._id === taskData.employeeId) ? {
                                                value: taskData.employeeId,
                                                label: userList.find(user => user._id === taskData.employeeId).name?.trim() 
                                                    ? userList.find(user => user._id === taskData.employeeId).name 
                                                    : userList.find(user => user._id === taskData.employeeId).username
                                            } : null}
                                            onChange={(selectedOption) => setTaskData({ ...taskData, employeeId: selectedOption.value })}
                                            placeholder="Search & Select Employee"
                                            isSearchable
                                            styles={selectStyles}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="tuitionCode">
                                        <Form.Label className="fw-bold text-dark small">Tuition Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g. T-1023"
                                            value={taskData.tuitionCode}
                                            onChange={(e) => setTaskData({ ...taskData, tuitionCode: e.target.value })}
                                            style={controlStyles}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>

                        {/* Section 2: Task Requirements */}
                        <div
                            className="mb-4 p-3 rounded bg-white"
                            style={{
                                border: '1px solid rgba(13, 110, 253, 0.2)',
                                boxShadow: '0 0 10px rgba(13, 110, 253, 0.05)',
                            }}
                        >
                            <h6
                                className="mb-3 fw-bold"
                                style={{ borderBottom: '2px solid rgba(13, 110, 253, 0.5)', paddingBottom: '0.4rem', color: '#0d6efd', fontSize: '0.9rem' }}
                            >
                                Task Requirements
                            </h6>
                            
                            <Row className="gy-3">
                                <Col md={4}>
                                    <Form.Group controlId="status">
                                        <Form.Label className="fw-bold text-dark small">Task Status <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            value={taskData.status}
                                            onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                                            style={controlStyles}
                                            required
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="ongoing">Ongoing</option>
                                            <option value="completed">Completed</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={8}>
                                    <Form.Group controlId="deadline">
                                        <Form.Label className="fw-bold text-dark small">Deadline (Date & Time)</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={taskData.deadline}
                                            onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
                                            style={controlStyles}
                                        />
                                        <div className="d-flex gap-2 flex-wrap mt-2">
                                            <Button variant="outline-primary" size="sm" onClick={() => handleQuickSelect(1)} style={quickSelectStyle}>+1h</Button>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleQuickSelect(2)} style={quickSelectStyle}>+2h</Button>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleQuickSelect(3)} style={quickSelectStyle}>+3h</Button>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleQuickSelect(4)} style={quickSelectStyle}>+4h</Button>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleQuickSelect(5)} style={quickSelectStyle}>+5h</Button>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleQuickSelect(6)} style={quickSelectStyle}>+6h</Button>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleQuickSelect(12)} style={quickSelectStyle}>+12h</Button>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleQuickSelect(24)} style={quickSelectStyle}>Tomorrow</Button>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleQuickSelect(48)} style={quickSelectStyle}>+2 Days</Button>
                                        </div>
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Form.Group controlId="task">
                                        <Form.Label className="fw-bold text-dark small">Task Description <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={6}
                                            placeholder="Instructions..."
                                            value={taskData.task}
                                            onChange={(e) => setTaskData({ ...taskData, task: e.target.value })}
                                            style={controlStyles}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Form.Group controlId="comment">
                                        <Form.Label className="fw-bold text-dark small">Comment (Employee)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Special instructions or notes for the employee..."
                                            value={taskData.comment}
                                            onChange={(e) => setTaskData({ ...taskData, comment: e.target.value })}
                                            style={controlStyles}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-auto pt-3 border-top">
                        <Button 
                            variant="secondary" 
                            onClick={handleClose}
                            className="px-4 py-2 fw-bold"
                            style={{ borderRadius: '0.25rem' }}
                        >
                            Discard
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="px-5 py-2 fw-bold"
                            style={{ 
                                borderRadius: '0.25rem',
                                boxShadow: '0 2px 4px rgba(13, 110, 253, 0.1)'
                            }}
                        >
                            {editingTask ? 'Update Task' : 'Save Task'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default TaskModal;

const controlStyles = {
    borderRadius: '0.25rem',
    border: '1px solid rgba(13, 110, 253, 0.3)',
    backgroundColor: '#fff',
    boxShadow: '0 0 4px rgba(13, 110, 253, 0.08)',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem'
};

const quickSelectStyle = {
    fontSize: '0.75rem',
    padding: '0.2rem 0.5rem',
    borderRadius: '0.25rem'
};

const selectStyles = {
    control: (base, state) => ({
        ...base,
        borderRadius: '0.25rem',
        border: state.isFocused ? '1px solid #0d6efd' : '1px solid rgba(13, 110, 253, 0.3)',
        boxShadow: state.isFocused ? '0 0 4px rgba(13, 110, 253, 0.08)' : 'none',
        minHeight: '38px',
        fontSize: '0.875rem',
        '&:hover': {
            borderColor: '#0d6efd'
        }
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '0 8px'
    }),
    indicatorsContainer: (base) => ({
        ...base,
        height: '36px'
    }),
    option: (base, state) => ({
        ...base,
        fontSize: '0.875rem',
        backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#f8f9fa' : 'white',
        color: state.isSelected ? 'white' : '#212529',
    })
};
