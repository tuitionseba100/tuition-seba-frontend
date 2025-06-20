import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaInfoCircle, FaTrashAlt } from 'react-icons/fa'; // React Icons
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const PremiumTeacherPage = () => {
    const [reacrodsList, setReacrodsList] = useState([]);
    const [filteredTeacherList, setFilteredTeacherList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [nameSearchQuery, setnameSearchQuery] = useState('');
    const [premiumCodeSearchQuery, setPremiumCodeSearchQuery] = useState('');
    const [phoneSearchQuery, setPhoneSearchQuery] = useState('');
    const [addressSearchQuery, setAddressSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const fieldConfig = [
        // Personal Info
        { name: 'name', label: 'Name', col: 6, group: 'Personal Info' },
        {
            name: 'gender',
            label: 'Gender',
            col: 6,
            group: 'Personal Info',
            type: 'select',
            options: ['male', 'female']
        },
        { name: 'phone', label: 'Phone', col: 6, group: 'Personal Info' },
        { name: 'whatsapp', label: 'WhatsApp', col: 6, group: 'Personal Info' },
        { name: 'email', label: 'Email', col: 6, group: 'Personal Info' },
        { name: 'facebookLink', label: 'Facebook Link', col: 6, group: 'Personal Info' },
        { name: 'familyPhone', label: 'Family Phone', col: 6, group: 'Personal Info' },
        { name: 'friendPhone', label: 'Friend Phone', col: 6, group: 'Personal Info' },
        { name: 'city', label: 'City', col: 6, group: 'Personal Info' },
        { name: 'currentArea', label: 'Current Area', col: 6, group: 'Personal Info' },
        { name: 'fullAddress', label: 'Full Address', col: 6, group: 'Personal Info' },

        // Academic Info
        { name: 'university', label: 'University', col: 6, group: 'Academic Info' },
        { name: 'department', label: 'Department', col: 6, group: 'Academic Info' },
        { name: 'academicYear', label: 'Academic Year', col: 6, group: 'Academic Info' },
        { name: 'medium', label: 'Medium', col: 6, group: 'Academic Info' },
        { name: 'mastersDept', label: 'Masters Dept', col: 6, group: 'Academic Info' },
        { name: 'mastersUniversity', label: 'Masters University', col: 6, group: 'Academic Info' },
        { name: 'honorsDept', label: 'Honors Dept', col: 6, group: 'Academic Info' },
        { name: 'honorsUniversity', label: 'Honors University', col: 6, group: 'Academic Info' },
        { name: 'hscGroup', label: 'HSC Group', col: 6, group: 'Academic Info' },
        { name: 'hscResult', label: 'HSC Result', col: 6, group: 'Academic Info' },
        { name: 'sscGroup', label: 'SSC Group', col: 6, group: 'Academic Info' },
        { name: 'sscResult', label: 'SSC Result', col: 6, group: 'Academic Info' },

        // Teaching Profile
        { name: 'experience', label: 'Experience', col: 6, group: 'Teaching Profile' },
        { name: 'favoriteSubject', label: 'Favorite Subject', col: 6, group: 'Teaching Profile' },
        { name: 'expectedTuitionAreas', label: 'Expected Tuition Areas', col: 6, group: 'Teaching Profile' },
        { name: 'commentFromTeacher', label: 'Comment From Teacher', col: 6, group: 'Teaching Profile' },

        // Subscription & Payment Details
        { name: 'premiumCode', label: 'Premium Code', col: 6, group: 'Subscription & Payment Details' },
        { name: 'password', label: 'Password', col: 6, group: 'Subscription & Payment Details' },
        {
            name: 'status',
            label: 'Subscription Status',
            type: 'select',
            col: 6,
            options: ['pending', 'under review', 'pending payment', 'rejected', 'verified'],
            group: 'Subscription & Payment Details'
        },
        { name: 'transactionId', label: 'Transaction ID', col: 6, group: 'Subscription & Payment Details' },
        { name: 'paymentType', label: 'Payment Method', col: 6, group: 'Subscription & Payment Details' },
        { name: 'amount', label: 'Amount Paid', col: 6, group: 'Subscription & Payment Details' },

        // Notes & Feedback
        { name: 'comment', label: 'Comment from agent', col: 6, group: 'Notes & Feedback' }
    ];

    const summaryCardOptions = [
        { key: 'all', label: 'Total Applied', borderColor: 'dark', textColor: 'dark' },
        { key: 'pending', label: 'Pending', borderColor: 'warning', textColor: 'warning' },
        { key: 'under_review', label: 'Under Review', borderColor: 'info', textColor: 'info' },
        { key: 'pending_payment', label: 'Pending Payment', borderColor: 'primary', textColor: 'primary' },
        { key: 'rejected', label: 'Rejected', borderColor: 'danger', textColor: 'danger' },
        { key: 'verified', label: 'Verified', borderColor: 'success', textColor: 'success' },
    ];

    const initialData = fieldConfig.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
    }, {});
    const [formData, setFormData] = useState(initialData);
    useEffect(() => {
        fetchAllRecords();
    }, []);

    useEffect(() => {
        const filters = [
            {
                key: 'password',
                query: premiumCodeSearchQuery,
            },
            {
                key: 'name',
                query: nameSearchQuery,
            },
            {
                key: 'phone',
                query: phoneSearchQuery,
            },
            {
                key: 'address',
                query: addressSearchQuery,
            }
        ];

        let filteredData = reacrodsList.filter(item => {
            return filters.every(filter => {
                if (!filter.query) return true;
                const value = String(item[filter.key] || '').toLowerCase().trim();
                const query = String(filter.query).toLowerCase().trim();
                return value.includes(query);
            });
        });

        if (statusFilter) {
            filteredData = filteredData.filter(item => item.status === statusFilter);
        }

        if (genderFilter) {
            filteredData = filteredData.filter(item => item.gender === genderFilter);
        }

        setFilteredTeacherList(filteredData);
    }, [premiumCodeSearchQuery, nameSearchQuery, phoneSearchQuery, addressSearchQuery, statusFilter, genderFilter, reacrodsList]);

    const fetchAllRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/regTeacher/all');
            setReacrodsList(response.data);
            setFilteredTeacherList(response.data);
        } catch (err) {
            console.error('Error fetching records:', err);
            toast.error("Failed to load Teacher records.");
        }
        setLoading(false);
    };

    const handleShowDetails = (teacher) => {
        setSelectedTeacher(teacher);
        setShowDetailsModal(true);
    };


    const handleExportToExcel = () => {
        const headers = fieldConfig.map(f => f.label);

        const data = filteredTeacherList.map(item =>
            fieldConfig.map(f => String(item[f.name] ?? ""))
        );

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

        worksheet['!cols'] = fieldConfig.map(() => ({ wpx: 120 }));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Premium Teachers");
        XLSX.writeFile(workbook, `Premium Teachers_${formatDateTimeForFilename()}.xlsx`);
    };

    const formatDateTimeForFilename = (date = new Date()) => {
        const datePart = date.toLocaleDateString().replace(/\//g, '-');
        const timePart = date.toLocaleTimeString().replace(/:/g, '-');
        return `${datePart}_${timePart}`;
    };

    const handleSaveRecord = async () => {
        const updatingData = {
            ...formData,
            status: formData.status ? formData.status : "pending"
        };
        try {
            if (editingId) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/regTeacher/edit/${editingId}`, updatingData);
                toast.success("Teacher record updated successfully!");
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/regTeacher/add', updatingData);
                toast.success("Teacher record created successfully!");
            }
            setShowModal(false);
            fetchAllRecords();
        } catch (err) {
            console.error('Error saving Teacher record:', err);
            toast.error("Error saving Teacher record.");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const optionsDate = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };

        const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
        const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);

        return `${formattedDate} || ${formattedTime}`;
    };

    const handleEditTeacher = (teacher) => {
        setFormData(teacher);
        setEditingId(teacher._id);
        setShowModal(true);
    };

    const handleDeleteTeacher = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this record?");

        if (confirmDelete) {
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/regTeacher/delete/${id}`);
                toast.success("Deleted successfully!");
                fetchAllRecords();
            } catch (err) {
                console.error('Error:', err);
                toast.error("Error.");
            }
        } else {
            toast.info("Deletion canceled");
        }
    };

    const getEmptyFormData = () => {
        return fieldConfig.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {});
    };

    const getSummaryCounts = () => {
        const counts = {
            all: filteredTeacherList.length,
            pending: 0,
            under_review: 0,
            pending_payment: 0,
            rejected: 0,
            verified: 0,
        };

        filteredTeacherList.forEach(teacher => {
            if (!teacher.status) return;
            const normalizedStatus = teacher.status.toLowerCase().replace(/\s+/g, '_');
            if (counts.hasOwnProperty(normalizedStatus)) {
                counts[normalizedStatus]++;
            }
        });

        return counts;
    };
    const summaryCounts = getSummaryCounts();
    const handleResetFilters = () => {
        setnameSearchQuery('');
        setPremiumCodeSearchQuery('');
        setPhoneSearchQuery('');
        setAddressSearchQuery('');
        setStatusFilter('');
        setGenderFilter('');
        setFilteredTeacherList(reacrodsList);
    };

    return (
        <>
            <NavBarPage />
            <Container>
                <Header>
                    <h2 className='text-primary fw-bold'>Tuition Applications</h2>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setShowModal(true);
                            setEditingId(null);
                            setFormData(getEmptyFormData());
                        }}
                    >
                        Create Teacher
                    </Button>

                </Header>
                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            {summaryCardOptions.map(({ key, label, borderColor, textColor }) => (
                                <div key={key} className="col-6 col-sm-4 col-md-2 mb-3">
                                    <div className={`card p-3 shadow border-${borderColor}`}>
                                        <div className="d-flex flex-column align-items-center">
                                            <span className={`text-${textColor}`} style={{ fontWeight: 'bolder' }}>
                                                {label}
                                            </span>
                                            <span>{summaryCounts[key] ?? 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>

                {/* Search bar */}
                <Row className="mt-2 mb-3">
                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Premium Code)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Premium Code"
                            value={premiumCodeSearchQuery}
                            onChange={(e) => setPremiumCodeSearchQuery(e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Name)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Name"
                            value={nameSearchQuery}
                            onChange={(e) => setnameSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Phone Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Phone Number"
                            value={phoneSearchQuery}
                            onChange={(e) => setPhoneSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Address)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Address"
                            value={addressSearchQuery}
                            onChange={(e) => setAddressSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={1}>
                        <Form.Label className="fw-bold">Status</Form.Label>
                        <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="under review">Under Review</option>
                            <option value="pending payment">Pending Payment</option>
                            <option value="rejected">Rejected</option>
                            <option value="verified">Verified</option>
                        </Form.Select>
                    </Col>

                    <Col md={1}>
                        <Form.Label className="fw-bold">Gender</Form.Label>
                        <Form.Select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                            <option value="">All</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </Form.Select>
                    </Col>

                    <Col md={1} className="d-flex align-items-end">
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
                        <Card.Title>Premium Teacher List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Created At</th>
                                        <th>Premium Code</th>
                                        <th>Status</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Current Area</th>
                                        <th>University</th>
                                        <th>Academic Year</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="10" className="text-center">
                                                <div
                                                    className="d-flex justify-content-center align-items-center"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '90%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        width: '100vw',
                                                        height: '100vh',
                                                    }}
                                                >
                                                    <Spinner animation="border" variant="primary" size="lg" />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTeacherList
                                            .slice()
                                            .reverse()
                                            .map((item, index) => (
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.createdAt ? formatDate(item.createdAt) : ''}</td>
                                                    <td>{item.password}</td>
                                                    <td>
                                                        <span
                                                            className={`badge ${item.status === 'pending'
                                                                ? 'bg-warning text-dark'
                                                                : item.status === 'under review'
                                                                    ? 'bg-info'
                                                                    : item.status === 'pending payment'
                                                                        ? 'bg-primary'
                                                                        : item.status === 'rejected'
                                                                            ? 'bg-danger'
                                                                            : item.status === 'verified'
                                                                                ? 'bg-success'
                                                                                : 'bg-secondary'
                                                                }`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td>{item.name}</td>
                                                    <td>{item.phone}</td>
                                                    <td>{item.currentArea}</td>
                                                    <td>{item.university}</td>
                                                    <td>{item.academicYear}</td>
                                                    <td style={{ display: 'flex', gap: '8px' }}>
                                                        <Button variant="info" size="sm" onClick={() => handleShowDetails(item)}>
                                                            <FaInfoCircle />
                                                        </Button>

                                                        <Button variant="warning" onClick={() => handleEditTeacher(item)} size="sm">
                                                            <FaEdit />
                                                        </Button>
                                                        <Button variant="danger" onClick={() => handleDeleteTeacher(item._id)} size="sm">
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

                <Modal
                    show={showDetailsModal}
                    onHide={() => setShowDetailsModal(false)}
                    size="xl"
                    centered
                    scrollable
                >
                    <Modal.Header closeButton className="border-bottom-0">
                        <Modal.Title className="fw-bold fs-4">Teacher Details</Modal.Title>
                    </Modal.Header>

                    <Modal.Body
                        className="px-4 py-3"
                        style={{ maxHeight: '75vh', overflowY: 'auto' }}
                    >
                        {selectedTeacher?.password && (
                            <div className="mb-4">
                                <div
                                    className="w-100 rounded bg-primary text-white d-flex justify-content-center align-items-center shadow-sm"
                                    style={{ height: '60px', fontSize: '1.25rem', fontWeight: '600' }}
                                >
                                    Premium Code: <span className="ms-3">{selectedTeacher.password}</span>
                                </div>
                            </div>
                        )}

                        {selectedTeacher ? (
                            Object.entries(
                                fieldConfig.reduce((groups, field) => {
                                    (groups[field.group] = groups[field.group] || []).push(field);
                                    return groups;
                                }, {})
                            ).map(([groupName, fields]) => (
                                <section key={groupName} className="mb-4">
                                    <h5 className="border-bottom pb-2 mb-3 text-primary fw-semibold">{groupName}</h5>
                                    <div className="row gx-4 gy-4">
                                        {fields.map(({ name, label, type }) => {
                                            const value = selectedTeacher[name];
                                            return (
                                                <div
                                                    key={name}
                                                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                                                >
                                                    <div className="border rounded bg-white p-3 h-100 shadow-sm d-flex flex-column">
                                                        <small
                                                            className="mb-2 text-primary"
                                                            style={{
                                                                fontWeight: 900,
                                                                letterSpacing: '0.02em',
                                                            }}
                                                        >
                                                            {label}
                                                        </small>

                                                        <div
                                                            className="flex-grow-1 text-break"
                                                            style={{
                                                                fontWeight: type === 'password' ? '700' : '400',
                                                                fontSize: '1rem',
                                                                color: type === 'password' ? '#444' : '#222',
                                                                userSelect: 'text',
                                                            }}
                                                            title={type === 'password' ? value : undefined}
                                                        >
                                                            {type === 'password' ? '••••••' : value?.toString().trim() || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <p className="text-center text-muted fst-italic">No details available.</p>
                        )}
                    </Modal.Body>

                    <Modal.Footer className="border-top-0">
                        <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Create/Edit Tuition Modal */}
                {/* Create/Edit Tuition Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered scrollable>
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">{editingId ? "Edit Teacher" : "Create Teacher"}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            {Object.entries(
                                fieldConfig.reduce((groups, field) => {
                                    if (!groups[field.group]) groups[field.group] = [];
                                    groups[field.group].push(field);
                                    return groups;
                                }, {})
                            ).map(([groupName, fields]) => (
                                <div key={groupName} className="mb-4">
                                    <h5 className="fw-bold mb-3 border-bottom pb-1">{groupName}</h5>
                                    <Row>
                                        {fields.map((field, idx) => (
                                            <Col md={field.col || 6} key={idx}>
                                                <Form.Group controlId={field.name} className="mb-3">
                                                    <Form.Label className="fw-bold">{field.label}</Form.Label>

                                                    {field.type === "select" ? (
                                                        <Form.Control
                                                            as="select"
                                                            value={formData[field.name] || ""}
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, [field.name]: e.target.value })
                                                            }
                                                            required
                                                        >
                                                            <option value="">Select {field.label}</option>
                                                            {field.options.map((opt, i) => (
                                                                <option key={i} value={opt}>
                                                                    {opt}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
                                                    ) : (
                                                        <Form.Control
                                                            type={field.type || "text"}
                                                            value={formData[field.name] || ""}
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, [field.name]: e.target.value })
                                                            }
                                                            required
                                                        />
                                                    )}
                                                </Form.Group>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            ))}
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveRecord}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>


                <ToastContainer />
            </Container>
        </>
    );
};

export default PremiumTeacherPage;

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
