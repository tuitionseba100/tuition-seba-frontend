import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { FaRedo, FaDownload, FaTimes } from 'react-icons/fa';
import { Button, Form, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';

const FilterContainer = styled(motion.div)`
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 30px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterSection = ({
    filter, setFilter,
    userFilter, setUserFilter,
    searchTerm, setSearchTerm,
    dateRange, setDateRange,
    users,
    onRefresh,
    onExport,
    onReset,
    autoRefresh,
    setAutoRefresh,
    loading,
    lastRefresh
}) => {

    const filterOptions = [
        { value: 'today', label: 'Today' },
        { value: 'last7days', label: 'Last 7 Days' },
        { value: 'lastMonth', label: 'Last Month' },
        { value: 'custom', label: 'Custom Range' },
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

    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: '8px',
            borderColor: '#e2e8f0',
            padding: '2px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#cbd5e0'
            }
        })
    };

    return (
        <FilterContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Header>
                <h3>Filters & Controls</h3>
                <ControlGroup>
                    <Button
                        variant={autoRefresh ? "success" : "light"}
                        size="sm"
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className="d-flex align-items-center"
                    >
                        <FaRedo className={`me-2 ${loading ? 'fa-spin' : ''}`} />
                        {autoRefresh ? "Auto On" : "Auto Off"}
                    </Button>
                    <Button variant="light" size="sm" onClick={onRefresh}>
                        <FaRedo className="me-2" /> Refresh
                    </Button>
                    <Button variant="success" size="sm" onClick={onExport}>
                        <FaDownload className="me-2" /> Export
                    </Button>
                </ControlGroup>
            </Header>

            <Row className="g-3">
                <Col md={3}>
                    <Form.Label className="small fw-bold text-muted">Time Period</Form.Label>
                    <Select
                        value={filterOptions.find(option => option.value === filter)}
                        onChange={(selected) => setFilter(selected.value)}
                        options={filterOptions}
                        styles={customSelectStyles}
                    />
                </Col>

                {filter === 'custom' && (
                    <Col md={6}>
                        <Row>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted">Start Date</Form.Label>
                                <div className="custom-date-picker-wrapper" style={{ border: '1px solid #ced4da', borderRadius: '0.375rem', padding: '0.375rem 0.75rem' }}>
                                    <DatePicker
                                        value={dateRange.start}
                                        onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                                        clearIcon={null}
                                        disableClock={true}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted">End Date</Form.Label>
                                <div className="custom-date-picker-wrapper" style={{ border: '1px solid #ced4da', borderRadius: '0.375rem', padding: '0.375rem 0.75rem' }}>
                                    <DatePicker
                                        value={dateRange.end}
                                        onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                                        clearIcon={null}
                                        disableClock={true}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                )}

                <Col md={3}>
                    <Form.Label className="small fw-bold text-muted">Search User</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                </Col>

                {localStorage.getItem('role') === 'superadmin' && (
                    <Col md={3}>
                        <Form.Label className="small fw-bold text-muted">Filter by User</Form.Label>
                        <Select
                            value={userFilter}
                            onChange={setUserFilter}
                            options={userOptions}
                            styles={customSelectStyles}
                            isClearable
                            placeholder="All Users"
                        />
                    </Col>
                )}

                <Col md={2} className="d-flex align-items-end">
                    <Button variant="outline-danger" className="w-100" onClick={onReset}>
                        <FaTimes className="me-2" /> Reset
                    </Button>
                </Col>
            </Row>

            {autoRefresh && lastRefresh && (
                <div className="text-end mt-2">
                    <small className="text-muted">Last updated: {lastRefresh.toLocaleTimeString()}</small>
                </div>
            )}
        </FilterContainer>
    );
};

export default FilterSection;
