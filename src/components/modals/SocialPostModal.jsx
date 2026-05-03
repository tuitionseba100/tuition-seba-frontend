import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Table, Card, Badge, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCopy, FaWhatsapp, FaSearch, FaFilter, FaListUl, FaEye, FaCheckSquare, FaSquare, FaTimes } from 'react-icons/fa';
import locationData from '../../data/locations.json';
import styled from 'styled-components';

// Custom styles for react-select to match the UI
const selectStyles = {
    control: (base) => ({
        ...base,
        minHeight: '31px',
        fontSize: '0.85rem',
        borderRadius: '4px',
        borderColor: '#dee2e6',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#0d6efd'
        }
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '0 8px',
    }),
    indicatorsContainer: (base) => ({
        ...base,
        height: '31px',
    }),
    multiValue: (base) => ({
        ...base,
        margin: '1px',
        backgroundColor: '#e7f1ff',
        borderRadius: '4px'
    })
};

const StyledModal = styled(Modal)`
    .modal-dialog {
        max-width: calc(100% - 20px) !important;
        margin: 10px 10px 15px 10px !important;
        height: calc(100vh - 25px) !important;
    }
    .modal-content {
        height: 100% !important;
        display: flex;
        flex-direction: column;
        border-radius: 12px;
        border: none;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .modal-header {
        background: #f8f9fa;
        border-bottom: 1px solid #eee;
        border-radius: 12px 12px 0 0;
    }
    .modal-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 20px 20px 15px 20px;
        background: #fff;
        @media (max-width: 768px) {
            overflow-y: auto;
            display: block;
        }
    }

    /* Custom Scrollbar for the whole modal content */
    * {
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #a1a1a1;
        }
    }
`;

const FilterCard = styled(Card)`
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    margin-bottom: 20px;
    background: #fdfdfd;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    .card-body {
        padding: 15px;
    }
`;

const SectionTitle = styled.h6`
    font-weight: 700;
    color: #444;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
`;

const TuitionTableWrapper = styled.div`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    border: 1px solid #eee;
    border-radius: 8px;
    background: #fff;
    
    table {
        margin-bottom: 0;
    }
    
    thead th {
        background: #f1f3f5;
        color: #495057;
        font-weight: 600;
        border-top: none;
        position: sticky;
        top: 0;
        z-index: 10;
    }
    
    tbody tr:hover {
        background-color: #f8f9ff !important;
    }
    
    .selected-row {
        background-color: #e7f1ff !important;
    }
`;

const PreviewArea = styled(Form.Control)`
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 0.95rem;
    line-height: 1.5;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #ced4da;
    background-color: #fafafa;
    resize: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto !important;
    
    &:focus {
        background-color: #fff;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.05);
    }
`;

const ToggleBadge = styled(Badge)`
    cursor: pointer;
    padding: 6px 12px;
    margin: 2px;
    transition: all 0.2s;
    user-select: none;
    
    &.bg-primary {
        background-color: #0d6efd !important;
    }
    &.bg-light {
        background-color: #f1f3f5 !important;
        color: #6c757d;
        &:hover {
            background-color: #e9ecef !important;
        }
    }
`;

const SocialPostModal = ({ show, onHide }) => {
    const [loading, setLoading] = useState(false);
    const [tuitions, setTuitions] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [generatedText, setGeneratedText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        count: '10',
        area: [],
        status: [{ value: 'available', label: 'Available' }],
        startCode: '',
        endCode: ''
    });

    const statusOptions = [
        { value: 'available', label: 'Available' },
        { value: 'given number', label: 'Given Number' },
        { value: 'guardian meet', label: 'Guardian Meet' },
        { value: 'demo class running', label: 'Demo Class Running' },
        { value: 'confirm', label: 'Confirm' },
        { value: 'cancel', label: 'Cancel' },
        { value: 'refer BM', label: 'Refer BM' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'guardian no response', label: 'Guardian No response' },
        { value: 'request for payment', label: 'Request for payment' }
    ];

    const areaOptions = useMemo(() => 
        locationData.areaOptions.chittagong.map(area => ({ value: area, label: area }))
    , []);

    const [isWhatsAppFormat, setIsWhatsAppFormat] = useState(true);
    const [fieldConfig, setFieldConfig] = useState({
        tuitionCode: true,
        wantedTeacher: true,
        student: true,
        class: true,
        institute: true,
        medium: true,
        subject: true,
        day: true,
        time: true,
        salary: true,
        location: true,
        joining: true
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (selectedOptions, { name }) => {
        setFilters(prev => ({ ...prev, [name]: selectedOptions || [] }));
    };

    const toggleField = (field) => {
        setFieldConfig(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const fetchTuitions = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = {
                ...filters,
                area: filters.area.map(a => a.value).join(','),
                status: filters.status.map(s => s.value).join(',')
            };
            
            const response = await axios.get('https://tuition-seba-backend-1.onrender.com/api/tuition/post-data', {
                params,
                headers: { Authorization: token }
            });
            setTuitions(response.data);
            setSelectedIds(response.data.map(t => t._id)); // Select all by default
            toast.success(`Fetched ${response.data.length} tuitions`);
        } catch (error) {
            console.error('Error fetching tuitions:', error);
            toast.error('Failed to fetch tuitions');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const filteredTuitions = useMemo(() => {
        return tuitions.filter(t =>
            t.tuitionCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.subject?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [tuitions, searchTerm]);

    const generatePost = () => {
        const selected = tuitions.filter(t => selectedIds.includes(t._id));
        if (selected.length === 0) {
            toast.warn('Please select at least one tuition');
            return;
        }

        // Group selected tuitions by area
        const groupedByArea = selected.reduce((acc, t) => {
            const area = t.area || 'Other Areas';
            if (!acc[area]) acc[area] = [];
            acc[area].push(t);
            return acc;
        }, {});

        // Get areas that actually have tuitions in the selected set
        const areasWithTuition = Object.keys(groupedByArea);

        const b = isWhatsAppFormat ? "*" : "";
        let text = `${b}🌟 TUITION SEBA FORUM 🌟${b} \n`;
        text += `✨ ${b}Premium Tuition Opportunities${b} ✨\n\n`;
        
        if (areasWithTuition.length > 0) {
            const areaNames = areasWithTuition.join(', ');
            text += `🔥 ${b}${selected.length}+${b} Tuition Available at "${areaNames}" 🔥\n`;
        } else {
            text += `🔥 ${b}${selected.length}+${b} Tuition Available Right Now 🔥\n`;
        }
        text += "━━━━━━━━━━━━━━━━━━━━\n\n";

        areasWithTuition.forEach((area, areaIndex) => {
            // Section header for the area with count
            text += `📍 ${b}${area.toUpperCase()} (${groupedByArea[area].length})${b} 📍\n\n`;
            
            groupedByArea[area].forEach((t, index) => {
                if (fieldConfig.tuitionCode) text += `🆔 ${b}Code:${b} ${t.tuitionCode}\n`;
                if (fieldConfig.wantedTeacher) text += `👨‍🏫 ${b}Teacher:${b} ${t.wantedTeacher || 'N/A'}\n`;
                if (fieldConfig.student) text += `👥 ${b}Student:${b} ${t.student || 'N/A'}\n`;
                if (fieldConfig.class) text += `🎓 ${b}Class:${b} ${t.class || 'N/A'}\n`;
                if (fieldConfig.medium) text += `🌐 ${b}Medium:${b} ${t.medium || 'N/A'}\n`;
                if (fieldConfig.subject) text += `📚 ${b}Subject:${b} ${t.subject || 'N/A'}\n`;
                if (fieldConfig.salary) text += `💰 ${b}Salary:${b} ${t.salary || 'Negotiable'}\n`;
                if (fieldConfig.day) text += `📅 ${b}Days:${b} ${t.day || 'N/A'}\n`;
                if (fieldConfig.time) text += `⏰ ${b}Time:${b} ${t.time || 'N/A'}\n`;
                if (fieldConfig.location) text += `🏠 ${b}Location:${b} ${t.location || ''} ${t.area ? '(' + t.area + ')' : ''}\n`;
                if (fieldConfig.joining) text += `🚀 ${b}Joining:${b} ${t.joining || 'As soon as'}\n`;
                
                text += `\n📲 ${b}WhatsApp:${b} +8801571305804\n`;
                text += `📌 ${b}Apply Fast — Visit our Website/Apps${b}\n`;

                if (index < groupedByArea[area].length - 1) {
                    text += `\n--------------------------------\n\n`;
                }
            });

            if (areaIndex < areasWithTuition.length - 1) {
                text += `\n================================\n\n`;
            } else {
                text += `\n`;
            }
        });

        text += `━━━━━━━━━━━━━━━━━━━━\n`;
        text += `🚀 ${b}TUITION SEBA FORUM${b}\n`;
        text += `The Most Trusted Platform for Teachers & Guardians.`;

        setGeneratedText(text);
        toast.success('Post generated!');
    };

    const copyToClipboard = () => {
        if (!generatedText) return;
        navigator.clipboard.writeText(generatedText);
        toast.success('Copied to clipboard!');
    };

    const sendToWhatsapp = () => {
        if (!generatedText) return;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(generatedText)}`;
        window.open(url, '_blank');
    };

    return (
        <StyledModal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold text-primary">
                    <FaWhatsapp className="me-2 text-success" />
                    Tuition Post Generator
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="flex-grow-1 g-4" style={{ minHeight: 0 }}>
                    {/* Left Panel: Filters and List */}
                    <Col md={7} className="d-flex flex-column h-100">
                        <FilterCard>
                            <Card.Body>
                                <SectionTitle><FaFilter /> Advanced Filters</SectionTitle>
                                <Row className="g-2">
                                    <Col md={2}>
                                        <Form.Select name="count" value={filters.count} onChange={handleFilterChange} className="form-control-sm">
                                            <option value="5">Latest 5</option>
                                            <option value="10">Latest 10</option>
                                            <option value="20">Latest 20</option>
                                            <option value="50">Latest 50</option>
                                            <option value="100">Latest 100</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={5}>
                                        <Select
                                            isMulti
                                            name="area"
                                            options={areaOptions}
                                            value={filters.area}
                                            onChange={handleSelectChange}
                                            placeholder="Select Areas"
                                            styles={selectStyles}
                                        />
                                    </Col>
                                    <Col md={5}>
                                        <Select
                                            isMulti
                                            name="status"
                                            options={statusOptions}
                                            value={filters.status}
                                            onChange={handleSelectChange}
                                            placeholder="Select Status"
                                            styles={selectStyles}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <InputGroup size="sm">
                                            <InputGroup.Text className="bg-light">Codes</InputGroup.Text>
                                            <Form.Control
                                                placeholder="Start"
                                                name="startCode"
                                                value={filters.startCode}
                                                onChange={handleFilterChange}
                                            />
                                            <Form.Control
                                                placeholder="End"
                                                name="endCode"
                                                value={filters.endCode}
                                                onChange={handleFilterChange}
                                            />
                                        </InputGroup>
                                    </Col>
                                    <Col md={6}>
                                        <Button variant="primary" size="sm" onClick={fetchTuitions} disabled={loading} className="w-100 fw-bold">
                                            {loading ? <Spinner size="sm" animation="border" /> : <><FaSearch className="me-1" /> Fetch Tuitions</>}
                                        </Button>
                                    </Col>
                                </Row>

                                <hr className="my-3" />

                                <SectionTitle><FaListUl /> Field Configuration</SectionTitle>
                                <div className="d-flex flex-wrap gap-1">
                                    {Object.keys(fieldConfig).map(field => (
                                        <ToggleBadge
                                            key={field}
                                            className={fieldConfig[field] ? "bg-primary" : "bg-light"}
                                            onClick={() => toggleField(field)}
                                        >
                                            {fieldConfig[field] ? <FaCheckSquare className="me-1" /> : <FaSquare className="me-1" />}
                                            {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </ToggleBadge>
                                    ))}
                                </div>
                                <div className="mt-3 pt-2 border-top">
                                    <Form.Check 
                                        type="switch"
                                        id="whatsapp-format-switch"
                                        label="Format for WhatsApp (Bold Headers & Labels)"
                                        checked={isWhatsAppFormat}
                                        onChange={(e) => setIsWhatsAppFormat(e.target.checked)}
                                        className="fw-bold text-success"
                                    />
                                </div>
                            </Card.Body>
                        </FilterCard>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <SectionTitle className="mb-0"><FaEye /> Preview List ({selectedIds.length}/{tuitions.length} Selected)</SectionTitle>
                            <InputGroup size="sm" style={{ width: '250px' }}>
                                <InputGroup.Text><FaSearch /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Search in list..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </div>

                        <TuitionTableWrapper>
                            <Table hover size="sm" className="align-middle">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }} className="text-center">
                                            <Form.Check
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedIds(tuitions.map(t => t._id));
                                                    else setSelectedIds([]);
                                                }}
                                                checked={selectedIds.length === tuitions.length && tuitions.length > 0}
                                            />
                                        </th>
                                        <th>Code</th>
                                        <th>Area</th>
                                        <th>Class/Subject</th>
                                        {filters.status.length > 1 && <th>Status</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTuitions.map(t => (
                                        <tr
                                            key={t._id}
                                            onClick={() => handleToggleSelect(t._id)}
                                            className={selectedIds.includes(t._id) ? "selected-row" : ""}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td className="text-center">
                                                {selectedIds.includes(t._id) ? 
                                                    <FaCheckSquare className="text-primary" /> : 
                                                    <FaSquare className="text-light border" />
                                                }
                                            </td>
                                            <td className="fw-bold">{t.tuitionCode}</td>
                                            <td>{t.area}</td>
                                            <td>
                                                <div className="small fw-semibold">{t.class}</div>
                                                <div className="text-muted small">{t.subject}</div>
                                            </td>
                                            {filters.status.length > 1 && (
                                                <td>
                                                    <Badge bg="info" className="text-capitalize" style={{ fontSize: '0.7rem' }}>
                                                        {t.status}
                                                    </Badge>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {filteredTuitions.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-muted">
                                                {tuitions.length === 0 ? "Use filters and click Fetch to start." : "No results match your search."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </TuitionTableWrapper>
                    </Col>

                    {/* Right Panel: Preview */}
                    <Col md={5} className="d-flex flex-column h-100" style={{ minHeight: '400px' }}>
                        <SectionTitle><FaWhatsapp /> Post Content Preview</SectionTitle>
                        <div className="flex-grow-1 position-relative" style={{ minHeight: '200px' }}>
                            <PreviewArea
                                as="textarea"
                                value={generatedText}
                                onChange={(e) => setGeneratedText(e.target.value)}
                                placeholder="Generated text will appear here..."
                            />
                        </div>
                    </Col>
                </Row>

                {/* Bottom Action Bar */}
                <Row className="mt-3 g-3">
                    <Col md={7}>
                        <Button
                            variant="success"
                            className="w-100 py-2 fw-bold shadow-sm h-100 d-flex align-items-center justify-content-center"
                            onClick={generatePost}
                            disabled={selectedIds.length === 0}
                            style={{ fontSize: '1.1rem' }}
                        >
                            Generate Post Template
                        </Button>
                    </Col>
                    <Col md={5}>
                        <div className="d-flex gap-2 h-100">
                            <Button variant="outline-primary" className="flex-grow-1 py-2 fw-bold" onClick={copyToClipboard} disabled={!generatedText}>
                                <FaCopy className="me-2" /> Copy to Clipboard
                            </Button>
                            <Button variant="success" className="flex-grow-1 py-2 fw-bold shadow-sm" onClick={sendToWhatsapp} disabled={!generatedText}>
                                <FaWhatsapp className="me-2" /> Share on WhatsApp
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </StyledModal>
    );
};

export default SocialPostModal;
