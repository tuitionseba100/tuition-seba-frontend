import React, { useState, useEffect, useMemo } from 'react';
import {
    FaMapMarkerAlt,
    FaGraduationCap,
    FaSearch,
    FaBookOpen,
    FaCalendarAlt,
    FaMale,
    FaFemale,
    FaArrowUp
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
    
    // State for scroll to top button visibility
    const [showScrollTop, setShowScrollTop] = useState(false);
    
    // Handle scroll event to show/hide scroll to top button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    // Function to scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

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
            padding: '16px 22px 16px 48px',
            fontSize: '1rem',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            outline: 'none',
            background: '#ffffff',
            color: '#1e293b',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            '&:focus': {
                borderColor: '#3b82f6',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
            }
        },
        searchIcon: { position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none', fontSize: '1.2rem' },
        filterContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '95%',
            maxWidth: '1200px',
            margin: '0 auto 30px',
            flexWrap: 'wrap',
            gap: '16px',
            padding: '20px',
            background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        },
        searchWrapper: {
            width: '100%',
            maxWidth: '500px',
            position: 'relative'
        },
        genderFilterWrapper: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' },
        filterLabel: { fontSize: '0.9rem', fontWeight: '500', color: '#475569' },
        genderFilterButtons: { display: 'flex', gap: '8px' },
        genderButton: {
            padding: '8px 12px',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            background: '#ffffff',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        },
        genderButtonActive: {
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: '#fff',
            borderColor: '#3b82f6',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
        },
        resetButton: {
            padding: '8px 12px',
            borderRadius: '12px',
            border: '2px solid #f87171',
            background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
            color: '#dc2626',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(239, 68, 68, 0.15)'
        },
        gridContainer: { maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px', padding: '0 15px' },
        card: {
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            position: 'relative',
            overflow: 'hidden'
        },
        cardHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', position: 'relative' },
        avatar: {
            width: '65px',
            height: '65px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)'
        },
        avatarIcon: { color: '#fff', width: '30px', height: '30px' },
        cardInfo: { flex: 1, minWidth: 0 },
        name: { fontSize: '1.2rem', fontWeight: '700', color: '#1e293b', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' },
        code: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: '700',
            color: '#fff',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            padding: '5px 12px',
            borderRadius: '18px',
            letterSpacing: '0.5px',
            marginTop: '4px',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        },
        gender: { fontSize: '0.85rem', color: '#64748b', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' },
        infoSection: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' },
        infoRow: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
        infoIcon: { color: '#4f46e5', flexShrink: 0, marginTop: '2px', fontSize: '1rem' },
        infoText: { flex: 1, fontSize: '0.95rem', color: '#374151', lineHeight: '1.5' },
        infoLabel: { fontSize: '0.8rem', color: '#6b7280', fontWeight: '600', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' },

        loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: '#64748b' },
        spinner: { width: '45px', height: '45px', border: '4px solid #e2e8f0', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '18px' },
        noResults: { textAlign: 'center', color: '#64748b', padding: '60px 20px', fontSize: '1rem' },
        
        // Scroll to top button styles
        scrollTopButton: {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
            zIndex: 1000,
            transition: 'all 0.3s ease',
            opacity: 0,
            visibility: 'hidden',
            transform: 'translateY(20px)'
        },
        scrollTopButtonVisible: {
            opacity: 1,
            visibility: 'visible',
            transform: 'translateY(0)'
        }
    };

    const keyframes = `
        @keyframes spin { to { transform: rotate(360deg); } }
        
        /* Responsive for tablet */
        @media (max-width: 1024px) {
            .filter-container {
                width: 98%;
                padding: 18px;
                gap: 14px;
            }
            
            .search-wrapper {
                width: 100%;
                max-width: none;
            }
            
            .grid-container { 
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important; 
            }
        }
        
        /* Responsive for small tablet */
        @media (max-width: 768px) {
            .filter-container {
                width: 98%;
                padding: 16px;
                gap: 12px;
            }
            
            .search-wrapper {
                width: 100%;
                max-width: none;
            }
            
            .grid-container { grid-template-columns: 1fr !important; }
            
            .gender-filter-wrapper {
                justify-content: center;
                width: 100%;
            }
            
            .gender-filter-buttons {
                justify-content: center;
            }
        }
        
        /* Responsive for mobile */
        @media (max-width: 480px) {
            .filter-container {
                padding: 14px;
                gap: 10px;
            }
            
            .search-input {
                padding: 14px 20px 14px 44px;
                font-size: 0.9rem;
            }
            
            .search-icon {
                left: 14px;
            }
            
            .gender-button {
                padding: 6px 10px;
                font-size: 0.8rem;
            }
            
            .reset-button {
                padding: 6px 10px;
                font-size: 0.8rem;
            }
        }
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

                <div style={styles.filterContainer} className="filter-container">
                    <div style={styles.searchWrapper} className="search-wrapper">
                        <FaSearch style={styles.searchIcon} className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search by area, university, department, etc..."
                            style={styles.searchInput}
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e2e8f0';
                                e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                            }}
                        />
                    </div>

                    <div style={styles.genderFilterWrapper} className="gender-filter-wrapper">
                        <span style={styles.filterLabel}>Gender:</span>
                        <div style={styles.genderFilterButtons} className="gender-filter-buttons">
                            <button
                                style={
                                    genderFilter === ''
                                        ? { ...styles.genderButton, ...styles.genderButtonActive }
                                        : styles.genderButton
                                }
                                className="gender-button"
                                onClick={() => setGenderFilter('')}
                            >
                                All
                            </button>
                            <button
                                style={
                                    genderFilter === 'male'
                                        ? { ...styles.genderButton, ...styles.genderButtonActive }
                                        : styles.genderButton
                                }
                                className="gender-button"
                                onClick={() => setGenderFilter('male')}
                            >
                                <FaMale style={{ marginRight: '6px' }} /> Male
                            </button>
                            <button
                                style={
                                    genderFilter === 'female'
                                        ? { ...styles.genderButton, ...styles.genderButtonActive }
                                        : styles.genderButton
                                }
                                className="gender-button"
                                onClick={() => setGenderFilter('female')}
                            >
                                <FaFemale style={{ marginRight: '6px' }} /> Female
                            </button>
                        </div>
                    </div>

                    <button
                        style={styles.resetButton}
                        className="reset-button"
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
            
            {/* Scroll to top button */}
            <button
                style={{
                    ...styles.scrollTopButton,
                    ...(showScrollTop ? styles.scrollTopButtonVisible : {})
                }}
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                <FaArrowUp size={20} />
            </button>
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
                    <h3 style={styles.name}>
                        {teacher.name}
                    </h3>

                    <div style={styles.code}>Code: #{teacher.premiumCode}</div>

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
                            <div style={styles.infoLabel}>Area</div>
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
                    style={{
                        padding: '10px 20px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        transition: 'all 0.3s ease',
                        marginTop: '15px'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRequest && onRequest(teacher);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }}
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
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        setIsSubmitting(true);

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
        } finally {
            setIsSubmitting(false);
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
                        disabled={isSubmitting}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        {isSubmitting ? (
                            <span>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Submitting...
                            </span>
                        ) : 'Submit Request'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <ApplySuccessModal show={showSuccess} handleClose={() => setShowSuccess(false)} />
        </>
    );
}
