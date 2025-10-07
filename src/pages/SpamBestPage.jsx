import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const PhonePage = () => {
    const [phoneList, setPhoneList] = useState([]);
    const [filteredPhoneList, setFilteredPhoneList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [phoneData, setPhoneData] = useState({
        phone: '',
        note: '',
        isSpam: false,
        isBest: false,
        isExpress: false,
        isActive: false,
    });
    const [phoneSearchQuery, setPhoneSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [typeFilter, setTypeFilter] = useState('');
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {
        let filteredData = phoneList;

        if (phoneSearchQuery) {
            filteredData = filteredData.filter(x =>
                String(x.phone).trim().toLowerCase().includes(String(phoneSearchQuery).trim().toLowerCase())
            );
        }

        if (typeFilter === "spam") {
            filteredData = filteredData.filter(x => x.isSpam === true);
        } else if (typeFilter === "best") {
            filteredData = filteredData.filter(x => x.isBest === true);
        }
        else if (typeFilter === "express") {
            filteredData = filteredData.filter(x => x.isExpress === true);
        }

        setFilteredPhoneList(filteredData);
    }, [phoneSearchQuery, typeFilter, phoneList]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/phone/all');
            setPhoneList(response.data);
            setFilteredPhoneList(response.data);
        } catch (err) {
            console.error('Error:', err);
            toast.error("Failed.");
        }
        setLoading(false);
    };

    const handleExportToExcel = () => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
        const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');

        const fileName = `phone List_${formattedDate}_${formattedTime}`;

        const tableHeaders = [
            "Created At",
            "Phone",
            "Note",
            "IsActive",
            "IsExpress",
            "IsSpam",
            "IsBest"
        ];

        const tableData = filteredPhoneList.map(item => [
            item.createdAt ? formatDate(item.createdAt) : "",
            String(item.phone ?? ""),
            String(item.note ?? ""),
            String(item.isActive ?? ""),
            String(item.isExpress ?? ""),
            String(item.isSpam ?? ""),
            String(item.isBest ?? ""),
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);

        worksheet['!cols'] = [
            { wpx: 100 },
            { wpx: 50 },
            { wpx: 50 },
            { wpx: 150 },
            { wpx: 100 },
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "SPAM_BEST");

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const handleSaveRequest = async () => {

        const updatedData = {
            ...phoneData
        };
        try {
            if (editingId) {
                await axios.put(`https://tuition-seba-backend-1.onrender.com/api/phone/edit/${editingId}`, updatedData);
                toast.success("phone record updated successfully!");
            } else {
                await axios.post('https://tuition-seba-backend-1.onrender.com/api/phone/add', updatedData);
                toast.success("phone record updated successfully!");
            }
            setShowModal(false);
            fetchRecords();
        } catch (err) {
            console.error('Error:', err);
            toast.error("Error.");
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

    const handleEditRecord = (data) => {
        setPhoneData({
            phone: data.phone ?? '',
            note: data.note ?? '',
            isSpam: !!data.isSpam,
            isExpress: !!data.isExpress,
            isBest: !!data.isBest,
            isActive: !!data.isActive,
        });
        setEditingId(data._id);
        setShowModal(true);
    };

    const handleDeleteRecord = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this  record?");

        if (confirmDelete) {
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/phone/delete/${id}`);
                toast.success("Record deleted successfully!");
                fetchRecords();
            } catch (err) {
                console.error('Error deleting record:', err);
                toast.error("Error deleting record.");
            }
        } else {
            toast.info("Deletion canceled");
        }
    };

    const handleResetFilters = () => {
        setPhoneSearchQuery('');
        setTypeFilter('');
        setFilteredPhoneList(phoneList);
    };

    return (
        <>
            <NavBarPage />
            <Container>
                <Header>
                    <h2 className='text-primary fw-bold'>SPAM & BEST Phone Numbers</h2>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setShowModal(true);
                            setEditingId(null);
                            setPhoneData({ phone: '', note: '', isSpam: false, isActive: false });
                        }}
                    >
                        Create Phone Record
                    </Button>
                </Header>
                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-dark">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-dark" style={{ fontWeight: 'bolder' }}>Total</span>
                                        <span>{filteredPhoneList.length}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border border-danger">
                                    <div className="d-flex flex-column align-items-center text-danger">
                                        <span style={{ fontWeight: 'bolder' }}>Total Spam</span>
                                        <span>{filteredPhoneList.filter(item => item.isSpam === true).length}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border border-primary">
                                    <div className="d-flex flex-column align-items-center text-primary">
                                        <span style={{ fontWeight: 'bolder' }}>Total Best Teacher</span>
                                        <span>{filteredPhoneList.filter(item => item.isBest === true).length}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border border-success">
                                    <div className="d-flex flex-column align-items-center text-success">
                                        <span style={{ fontWeight: 'bolder' }}>Total Express Teacher</span>
                                        <span>{filteredPhoneList.filter(item => item.isExpress === true).length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                {/* Search bar */}
                <Row className="mt-2 mb-3">
                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Phone Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Phone Number"
                            value={phoneSearchQuery}
                            onChange={(e) => setPhoneSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={1}>
                        <Form.Label className="fw-bold">Type Filter</Form.Label>
                        <Form.Select
                            value={typeFilter}
                            onChange={(e) => {
                                setTypeFilter(e.target.value);
                            }}
                        >
                            <option value="">All</option>
                            <option value="spam">Spam</option>
                            <option value="best">Best Teacher</option>
                            <option value="express">Express</option>
                        </Form.Select>
                    </Col>

                    <Col md={1} className="d-flex align-items-end">
                        <Button variant="danger" onClick={handleResetFilters} className="w-100">
                            Reset Filters
                        </Button>
                    </Col>

                </Row>

                {role === "superadmin" && (
                    <Button
                        variant="success"
                        className="mb-3"
                        onClick={handleExportToExcel}
                    >
                        Export to Excel
                    </Button>
                )}

                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Created At</th>
                                        <th>Phone</th>
                                        <th>Note</th>
                                        <th>Is Spam</th>
                                        <th>Is Best Teacher</th>
                                        <th>Is Express</th>
                                        <th>Is Active</th>
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
                                        filteredPhoneList.slice().reverse().map((item, index) => (

                                            <tr key={item._id}>
                                                <td>{index + 1}</td>
                                                <td>{item.createdAt ? formatDate(item.createdAt) : ''}</td>
                                                <td
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: item.isSpam ? '#dc3545' : '#007bff'
                                                    }}
                                                >
                                                    {item.phone}
                                                </td>
                                                <td>{item.note}</td>
                                                <td
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: item.isSpam ? '#dc3545' : '#007bff'
                                                    }}>{item.isSpam ? 'Yes' : 'No'}</td>
                                                <td
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: item.isBest ? '#dc3545' : '#007bff'
                                                    }}>{item.isBest ? 'Yes' : 'No'}</td>
                                                <td
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: item.isExpress ? 'green' : 'black'
                                                    }}
                                                >
                                                    {item.isExpress ? 'Yes' : 'No'}
                                                </td>
                                                <td>{item.isActive ? 'Yes' : 'No'}</td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                    <Button variant="warning" onClick={() => handleEditRecord(item)} className="mr-2">
                                                        <FaEdit />
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleDeleteRecord(item._id)}>
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

                {/* Create/Edit Tuition Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">
                            {editingId ? "Edit Phone Record" : "Create Phone Record"}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="phone">
                                        <Form.Label className="fw-bold">Phone</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={phoneData.phone ?? ''}
                                            onChange={(e) =>
                                                setPhoneData({ ...phoneData, phone: e.target.value })
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mt-3">
                                <Col md={12}>
                                    <Form.Group controlId="note">
                                        <Form.Label className="fw-bold">Note</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={phoneData.note ?? ''}
                                            onChange={(e) =>
                                                setPhoneData({ ...phoneData, note: e.target.value })
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mt-3">
                                <Col md={3}>
                                    <Form.Group controlId="isSpam">
                                        <Form.Check
                                            type="checkbox"
                                            label="Is Spam?"
                                            checked={!!phoneData.isSpam}
                                            onChange={(e) =>
                                                setPhoneData({ ...phoneData, isSpam: e.target.checked })
                                            }
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={3}>
                                    <Form.Group controlId="isBest">
                                        <Form.Check
                                            type="checkbox"
                                            label="Is Best?"
                                            checked={!!phoneData.isBest}
                                            onChange={(e) =>
                                                setPhoneData({ ...phoneData, isBest: e.target.checked })
                                            }
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={3}>
                                    <Form.Group controlId="isActive">
                                        <Form.Check
                                            type="checkbox"
                                            label="Is Active?"
                                            checked={!!phoneData.isActive}
                                            onChange={(e) =>
                                                setPhoneData({ ...phoneData, isActive: e.target.checked })
                                            }
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={3}>
                                    <Form.Group controlId="isExpress">
                                        <Form.Check
                                            type="checkbox"
                                            label="Is Express?"
                                            checked={!!phoneData.isExpress}
                                            onChange={(e) =>
                                                setPhoneData({ ...phoneData, isExpress: e.target.checked })
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSaveRequest}>Save</Button>
                    </Modal.Footer>
                </Modal>


                <ToastContainer />
            </Container>
        </>
    );
};

export default PhonePage;

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
