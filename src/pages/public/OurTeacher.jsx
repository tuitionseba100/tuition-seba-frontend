import React, { useState, useEffect, useMemo } from 'react';
import {
    FaMapMarkerAlt,
    FaGraduationCap,
    FaSearch,
    FaBookOpen,
    FaCalendarAlt,
    FaMale,
    FaFemale
} from 'react-icons/fa';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Pagination } from '@mui/material';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import ApplySuccessModal from '../../components/modals/ApplySuccessModal';
import { ButtonGroup } from 'react-bootstrap';

export default function OurTeacher() {
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState(''); // '' means all
    const [loading, setLoading] = useState(true);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const teachersPerPage = 50;

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await fetch('https://tuition-seba-backend-1.onrender.com/api/regTeacher/public-teachers');
            const data = await response.json();
            setTeachers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setLoading(false);
        }
    };

    // Memoized filtered teachers to avoid recalculating on every render
    const memoizedFilteredTeachers = useMemo(() => {
        let filtered = teachers;

        // Apply search term filter
        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            filtered = filtered.filter((teacher) =>
                Object.values(teacher).some((value) => {
                    if (!value) return false;
                    return String(value).toLowerCase().includes(term);
                })
            );
        }

        // Apply gender filter
        if (genderFilter) {
            filtered = filtered.filter(teacher =>
                teacher.gender && teacher.gender.toLowerCase() === genderFilter.toLowerCase()
            );
        }

        return filtered;
    }, [teachers, searchTerm, genderFilter]);

    // Calculate pagination
    const indexOfLastTeacher = currentPage * teachersPerPage;
    const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
    const currentTeachers = memoizedFilteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
    const totalPages = Math.ceil(memoizedFilteredTeachers.length / teachersPerPage);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, genderFilter]);

    const resetFilters = () => {
        setSearchTerm('');
        setGenderFilter('');
    };



    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #f0f4f8, #e0e7ff)',
            padding: '30px 20px 60px',
            fontFamily: '"Inter", sans-serif',
        },
        header: { textAlign: 'center', marginBottom: '30px' },
        title: { color: '#1e293b', fontSize: '1.6rem', fontWeight: '700', marginBottom: '6px' },
        subtitle: { color: '#475569', fontSize: '1rem', fontWeight: '400' },
        searchWrapper: { maxWidth: '600px', margin: '0 auto 40px', position: 'relative' },
        searchInput: {
            width: '100%',
            padding: '14px 22px 14px 48px',
            fontSize: '1rem',
            border: '1px solid #cbd5e1',
            borderRadius: '14px',
            outline: 'none',
            background: '#fff',
            color: '#1e293b',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
        },
        searchIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' },
        filterContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '800px',
            margin: '0 auto 30px',
            flexWrap: 'wrap',
            gap: '15px'
        },
        searchWrapper: {
            width: '40%',
            position: 'relative'
        },
        genderFilterWrapper: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'nowrap' },
        filterLabel: { fontSize: '0.9rem', fontWeight: '500', color: '#475569' },
        genderFilterButtons: { display: 'flex', gap: '8px' },
        genderButton: {
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: '#fff',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap'
        },
        genderButtonActive: {
            background: '#3b82f6',
            color: '#fff',
            borderColor: '#3b82f6'
        },
        resetButton: {
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid #ef4444',
            background: '#fff',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
        },
        gridContainer: { maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '26px', padding: '0 15px' },
        card: {
            background: '#fff',
            borderRadius: '20px',
            padding: '26px',
            border: '1px solid #e0e7ff',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
        },
        cardHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' },
        avatar: {
            width: '65px',
            height: '65px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        },
        avatarIcon: { color: '#fff', width: '32px', height: '32px' },
        cardInfo: { flex: 1, minWidth: 0 },
        name: { fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        code: { display: 'inline-block', fontSize: '0.8rem', fontWeight: '600', color: '#fff', background: '#3b82f6', padding: '5px 12px', borderRadius: '10px', letterSpacing: '0.3px', marginTop: '4px' },
        gender: { fontSize: '0.85rem', color: '#64748b', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' },
        infoSection: { display: 'flex', flexDirection: 'column', gap: '14px' },
        infoRow: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
        infoIcon: { color: '#3b82f6', flexShrink: 0, marginTop: '2px' },
        infoText: { flex: 1, fontSize: '0.95rem', color: '#334155', lineHeight: '1.5' },
        infoLabel: { fontSize: '0.8rem', color: '#64748b', fontWeight: '500', marginBottom: '2px' },

        loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: '#64748b' },
        spinner: { width: '45px', height: '45px', border: '4px solid #e2e8f0', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '18px' },
        noResults: { textAlign: 'center', color: '#64748b', padding: '60px 20px', fontSize: '1rem' }
    };

    const keyframes = `
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .grid-container { grid-template-columns: 1fr !important; } }
    `;



    return (
        <>
            <NavBar />
            <style>{keyframes}</style>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Premium Teachers</h1>
                    <p style={styles.subtitle}>Find qualified teacher easily</p>
                    <p style={styles.stats}>10,000+ registered teachers available nationwide</p>
                </div>

                <div style={styles.filterContainer}>
                    <div style={styles.searchWrapper}>
                        <FaSearch style={styles.searchIcon} size={18} />
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                        />
                    </div>

                    <div style={styles.genderFilterWrapper}>
                        <span style={styles.filterLabel}>Gender:</span>
                        <div style={styles.genderFilterButtons}>
                            <button
                                style={{
                                    ...styles.genderButton,
                                    ...(genderFilter === '' && styles.genderButtonActive)
                                }}
                                onClick={() => setGenderFilter('')}
                            >
                                All
                            </button>
                            <button
                                style={{
                                    ...styles.genderButton,
                                    ...(genderFilter === 'male' && styles.genderButtonActive)
                                }}
                                onClick={() => setGenderFilter('male')}
                            >
                                <FaMale style={{ marginRight: '6px' }} /> Male
                            </button>
                            <button
                                style={{
                                    ...styles.genderButton,
                                    ...(genderFilter === 'female' && styles.genderButtonActive)
                                }}
                                onClick={() => setGenderFilter('female')}
                            >
                                <FaFemale style={{ marginRight: '6px' }} /> Female
                            </button>
                        </div>
                    </div>

                    <button
                        style={styles.resetButton}
                        onClick={resetFilters}
                    >
                        Reset
                    </button>
                </div>

                {loading ? (
                    <div style={styles.loading}>
                        <div style={styles.spinner}></div>
                        <div>Loading...</div>
                    </div>
                ) : memoizedFilteredTeachers.length === 0 ? (
                    <div style={styles.noResults}>No teachers found</div>
                ) : (
                    <>
                        <div style={styles.gridContainer} className="grid-container">
                            {currentTeachers.map(teacher => (
                                <TeacherCard key={teacher._id} teacher={teacher} styles={styles} onRequest={() => { setSelectedTeacher(teacher); setShowRequestModal(true); }} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '30px',
                                marginBottom: '40px'
                            }}>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={(event, page) => setCurrentPage(page)}
                                    color="primary"
                                    size="large"
                                    showFirstButton
                                    showLastButton
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
            <RequestTeacherModal
                show={showRequestModal}
                onHide={() => setShowRequestModal(false)}
                teacher={selectedTeacher}
                onSaved={() => setShowRequestModal(false)}
            />
            <ToastContainer position="top-center" />
        </>
    );
}

function TeacherCard({ teacher, styles, onRequest }) {
    const [isHovered, setIsHovered] = useState(false);

    const isMale = teacher.gender?.toLowerCase() === 'male';
    const GenderIcon = isMale ? FaMale : FaFemale;

    const avatarGradient = isMale
        ? 'linear-gradient(135deg, #3b82f6, #60a5fa)'
        : 'linear-gradient(135deg, #ec4899, #f472b6)';

    return (
        <div
            style={{
                ...styles.card,
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: isHovered
                    ? '0 16px 28px rgba(0, 0, 0, 0.12)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div style={styles.cardHeader}>
                <div
                    style={{
                        ...styles.avatar,
                        background: avatarGradient,
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                    }}
                >
                    <GenderIcon style={styles.avatarIcon} />
                </div>

                <div style={styles.cardInfo}>
                    <h3 style={{ ...styles.name, color: '#1e40af', fontSize: '1.25rem' }}>
                        {teacher.name}
                    </h3>

                    <div style={styles.code}>Teacher Code: #{teacher.premiumCode}</div>

                    <div style={styles.gender}>
                        <GenderIcon /> {teacher.gender}
                    </div>
                </div>
            </div>

            {/* Info */}
            <div style={styles.infoSection}>
                {/* Location */}
                {(teacher.currentArea || teacher.thana || teacher.district) && (
                    <div style={styles.infoRow}>
                        <FaMapMarkerAlt style={styles.infoIcon} size={16} />
                        <div style={styles.infoText}>
                            <div style={styles.infoLabel}>Location</div>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>
                                {[teacher.currentArea, teacher.thana, teacher.district]
                                    .filter(Boolean)
                                    .join(', ')}
                            </span>
                        </div>
                    </div>
                )}

                {/* Honors */}
                {teacher.honorsDept && (
                    <div style={styles.infoRow}>
                        <FaGraduationCap style={styles.infoIcon} size={16} />
                        <div style={styles.infoText}>
                            <div style={styles.infoLabel}>Honors</div>
                            <span style={{ fontWeight: 600, color: '#1e40af' }}>
                                {teacher.honorsDept}
                                {teacher.honorsUniversity && ` - ${teacher.honorsUniversity}`}
                            </span>
                        </div>
                    </div>
                )}

                {/* Masters */}
                {teacher.mastersDept && (
                    <div style={styles.infoRow}>
                        <FaBookOpen style={styles.infoIcon} size={16} />
                        <div style={styles.infoText}>
                            <div style={styles.infoLabel}>Masters</div>
                            <span style={{ fontWeight: 600, color: '#1e40af' }}>
                                {teacher.mastersDept}
                                {teacher.mastersUniversity && ` - ${teacher.mastersUniversity}`}
                            </span>
                        </div>
                    </div>
                )}

                {/* Academic Year */}
                {teacher.academicYear && (
                    <div style={styles.infoRow}>
                        <FaCalendarAlt style={styles.infoIcon} size={16} />
                        <div style={styles.infoText}>
                            <div style={styles.infoLabel}>Academic Year</div>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>
                                {teacher.academicYear}
                            </span>
                        </div>
                    </div>
                )}

                {teacher.isResultShow && (teacher.sscResult || teacher.hscResult) && (
                    <div style={styles.infoRow}>
                        <FaBookOpen style={styles.infoIcon} size={16} />
                        <div style={styles.infoText}>
                            <div style={styles.infoLabel}>Result</div>

                            {teacher.sscResult && (
                                <div>
                                    <strong>SSC:</strong> {teacher.sscResult}
                                </div>
                            )}

                            {teacher.hscResult && (
                                <div>
                                    <strong>HSC:</strong> {teacher.hscResult}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
                <button
                    className="btn btn-primary"
                    style={{ padding: '8px 12px', borderRadius: '10px', fontWeight: 600 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRequest && onRequest(teacher);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    Request Teacher
                </button>
            </div>
        </div>
    );
}

function RequestTeacherModal({ show, onHide, teacher, onSaved }) {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
        studentClass: '',
        status: '',
        comment: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (show) {
            // Reset form when modal opens
            setForm({
                name: '',
                phone: '',
                address: '',
                studentClass: '',
                status: '',
                comment: ''
            });
        }
    }, [show]);

    const handleChange = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

    const handleSubmit = async () => {
        if (!form.phone || form.phone.trim() === '') {
            toast.error('সঠিক ফোন নাম্বার লিখুন।');
            return;
        }

        const payload = {
            name: form.name,
            phone: form.phone,
            address: form.address,
            studentClass: form.studentClass,
            status: form.status,
            comment: form.comment,
            teacherId: teacher?._id || null,
            teacherCode: teacher?.premiumCode || null
        };

        try {
            const response = await axios.post('https://tuition-seba-backend-1.onrender.com/api/guardianApply/add', payload);
            if (response && (response.status === 200 || response.status === 201)) {
                toast.success('Request submitted successfully');
                setShowSuccess(true);
                setForm({
                    name: '', phone: '', address: '', studentClass: '', status: '', comment: ''
                });
                onSaved && onSaved();
            } else {
                toast.error('Error submitting request');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred. Please try again later.');
        }
    };

    // Premium modal styling
    const modalStyles = {
        header: {
            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
            color: 'white',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            border: 'none',
            padding: '1.2rem 1.5rem'
        },
        title: {
            fontWeight: '700',
            fontSize: '1.3rem',
            margin: 0
        },
        footer: {
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            padding: '1rem 1.5rem',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px'
        },
        formLabel: {
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '0.5rem',
            fontSize: '0.9rem'
        },
        formControl: {
            borderRadius: '10px',
            padding: '10px 14px',
            border: '1px solid #cbd5e1',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        },
        teacherInfo: {
            background: 'linear-gradient(to right, #f0f4f8, #e0e7ff)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            border: '1px solid #c7d2fe'
        },
        teacherName: {
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#1e40af',
            marginBottom: '0.25rem'
        },
        teacherCode: {
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#fff',
            background: '#3b82f6',
            padding: '4px 10px',
            borderRadius: '8px',
            display: 'inline-block',
            marginBottom: '0.5rem'
        },
        teacherGender: {
            fontSize: '0.9rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        },
        buttonPrimary: {
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            border: 'none',
            padding: '10px 24px',
            fontWeight: '600',
            fontSize: '1rem',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
            transition: 'all 0.3s ease'
        },
        buttonSecondary: {
            background: '#e2e8f0',
            color: '#475569',
            border: 'none',
            padding: '10px 24px',
            fontWeight: '600',
            fontSize: '1rem',
            borderRadius: '10px',
            transition: 'all 0.3s ease'
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} size="lg" centered>
                <Modal.Header style={modalStyles.header}>
                    <div style={{ flex: 1 }}>
                        <Modal.Title style={modalStyles.title}>Request Teacher</Modal.Title>
                        {teacher && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <div style={modalStyles.teacherInfo}>
                                    <div style={modalStyles.teacherName}>{teacher.name}</div>
                                    <div style={modalStyles.teacherCode}>Teacher Code: #{teacher.premiumCode}</div>
                                    <div style={modalStyles.teacherGender}>
                                        {teacher.gender?.toLowerCase() === 'male' ? (
                                            <FaMale style={{ color: '#3b82f6' }} />
                                        ) : (
                                            <FaFemale style={{ color: '#ec4899' }} />
                                        )}
                                        {teacher.gender}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onHide}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                        ×
                    </button>
                </Modal.Header>

                <Modal.Body style={{ padding: '1.5rem' }}>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="name">
                                    <Form.Label style={modalStyles.formLabel}>আপনার নাম</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        style={modalStyles.formControl}
                                        placeholder="Enter your full name"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="phone">
                                    <Form.Label style={modalStyles.formLabel}>আপনার সচল মোবাইল নাম্বার লিখুন <span style={{ color: '#ef4444' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={form.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        style={modalStyles.formControl}
                                        placeholder="Enter your phone number"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mt-3">
                            <Col md={6}>
                                <Form.Group controlId="address">
                                    <Form.Label style={modalStyles.formLabel}>আপনার বাসার ঠিকানা লিখুন</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={form.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        style={modalStyles.formControl}
                                        placeholder="Enter your address"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="studentClass">
                                    <Form.Label style={modalStyles.formLabel}>ছাত্র/ছাত্রী কোন ক্লাসে পড়ে?</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={form.studentClass}
                                        onChange={(e) => handleChange('studentClass', e.target.value)}
                                        style={modalStyles.formControl}
                                        placeholder="Enter student class"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>



                        <Row className="mt-3">
                            <Col md={12}>
                                <Form.Group controlId="comment">
                                    <Form.Label style={modalStyles.formLabel}>কেমন শিক্ষক খুঁজছেন সংক্ষেপে নিচে লিখুন</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={form.comment}
                                        onChange={(e) => handleChange('comment', e.target.value)}
                                        style={{
                                            ...modalStyles.formControl,
                                            minHeight: '100px'
                                        }}
                                        placeholder="Enter any additional comments or requirements"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>

                <Modal.Footer style={modalStyles.footer}>
                    <Button
                        style={modalStyles.buttonSecondary}
                        onClick={onHide}
                        onMouseEnter={(e) => e.target.style.background = '#cbd5e1'}
                        onMouseLeave={(e) => e.target.style.background = '#e2e8f0'}
                    >
                        Cancel
                    </Button>
                    <Button
                        style={modalStyles.buttonPrimary}
                        onClick={handleSubmit}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Submit Request
                    </Button>
                </Modal.Footer>
            </Modal>

            <ApplySuccessModal show={showSuccess} handleClose={() => setShowSuccess(false)} />
        </>
    );
}
