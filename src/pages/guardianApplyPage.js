import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import NavBarPage from './NavbarPage';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const GuardianApplyPage = () => {
    const [applyList, setApplyList] = useState([]);
    const [filteredApplyList, setFilteredApplyList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [areaSearchQuery, setAreaSearchQuery] = useState('');
    const [numberSearchQuery, setNumberSearchQuery] = useState('');
    const [totalApply, setTotalApply] = useState(0);

    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {
        let filteredData = applyList;

        if (areaSearchQuery) {
            filteredData = filteredData.filter(data =>
                String(data.address).toLowerCase().includes(String(areaSearchQuery).toLowerCase())
            );
        }
        if (numberSearchQuery) {
            filteredData = filteredData.filter(data =>
                String(data.phone).toLowerCase().includes(String(numberSearchQuery).toLowerCase())
            );
        }
        const totalApplyCount = filteredData.length;

        setTotalApply(totalApplyCount);

        setFilteredApplyList(filteredData);
    }, [areaSearchQuery, numberSearchQuery, applyList]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/guardianApply/all');
            setApplyList(response.data);
            setFilteredApplyList(response.data);
        } catch (err) {
            console.error('Error:', err);
            toast.error("Failed to load records.");
        }
        setLoading(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const optionsDate = { day: '2-digit', month: 'long', year: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };

        const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
        const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);

        return `${formattedDate} || ${formattedTime}`;
    };

    const handleExportToExcel = () => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
        const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');

        const fileName = `Guardian Apply List_${formattedDate}_${formattedTime}`;

        const tableHeaders = [
            "Guardian Name", "Applied Date", "Phone No.", "Address", "Student Class", "Teacher Gender", "Characteristics"
        ];

        const tableData = filteredApplyList.map(data => [
            String(data.name ?? ""),
            data.appliedAt ? formatDate(data.appliedAt) : "",
            String(data.phone ?? ""),
            String(data.address ?? ""),
            String(data.studentClass ?? ""),
            String(data.teacherGender ?? ""),
            String(data.characteristics ?? ""),
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);

        worksheet['!cols'] = [
            { wpx: 90 },
            { wpx: 140 },
            { wpx: 140 },
            { wpx: 140 },
            { wpx: 120 },
            { wpx: 120 },
            { wpx: 140 },
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Apply");

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const handleDeleteRecord = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this record?");

        if (confirmDelete) {
            try {
                await axios.delete(`https://tuition-seba-backend-1.onrender.com/api/guardianApply/delete/${id}`);
                toast.success("Eecord deleted successfully!");
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
        setAreaSearchQuery('');
        setNumberSearchQuery('');
        setFilteredApplyList(applyList);
    };

    return (
        <>
            <NavBarPage />
            <Container>

                <Header>
                    <h2 className='text-primary fw-bold'>Guardian Apply Dashboard</h2>
                </Header>

                <Card className="mt-4">
                    <Card.Body>
                        <div className="row text-center">
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>Total Apply</span>
                                        <span>{totalApply}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>--</span>
                                        <span>--</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>--</span>
                                        <span>--</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>--</span>
                                        <span>--</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>--</span>
                                        <span>--</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-4 col-md-2 mb-3">
                                <div className="card p-3 shadow border-primary">
                                    <div className="d-flex flex-column align-items-center">
                                        <span className="text-primary" style={{ fontWeight: 'bolder' }}>--</span>
                                        <span>--</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Card.Body>
                </Card>

                {/* Search bar */}
                <Row className="mt-2 mb-3">
                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Address)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Address"
                            value={areaSearchQuery}
                            onChange={(e) => setAreaSearchQuery(e.target.value)}
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Label className="fw-bold">Search (Phone Number)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search by Phone Number"
                            value={numberSearchQuery}
                            onChange={(e) => setNumberSearchQuery(e.target.value)}
                        />
                    </Col>

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
                        <Card.Title>Applied List</Card.Title>
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive="lg">
                                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Guardian Name</th>
                                        <th>Applied Date</th>
                                        <th>Phone No.</th>
                                        <th>Address</th>
                                        <th>Student Class</th>
                                        <th>Teacher Gender</th>
                                        <th>Teacher Characteristics</th>
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
                                        filteredApplyList.slice().reverse().map((rowData, index) => (
                                            <tr key={rowData._id}>
                                                <td>{index + 1}</td>
                                                <td>{rowData.name}</td>
                                                <td>{rowData.appliedDate ? formatDate(rowData.appliedDate) : ''}</td>
                                                <td>{rowData.phone}</td>
                                                <td>{rowData.studentClass}</td>
                                                <td>{rowData.teacherGender}</td>
                                                <td>{rowData.characteristics}</td>
                                                <td style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                                                    <Button variant="danger" onClick={() => handleDeleteRecord(rowData._id)}>
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

                <ToastContainer />
            </Container>
        </>
    );
};

export default GuardianApplyPage;

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
