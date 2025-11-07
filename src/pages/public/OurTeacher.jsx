import React, { useState, useEffect } from 'react';
import {
    FaMapMarkerAlt,
    FaGraduationCap,
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
    FaBookOpen,
    FaCalendarAlt,
    FaMale,
    FaFemale
} from 'react-icons/fa';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

export default function OurTeacher() {
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 12;

    useEffect(() => {
        fetchTeachers();
    }, []);

    useEffect(() => {
        filterTeachers();
    }, [searchTerm, teachers]);

    const fetchTeachers = async () => {
        try {
            const response = await fetch('https://tuition-seba-backend-1.onrender.com/api/regTeacher/public-teachers');
            const data = await response.json();
            setTeachers(data);
            setFilteredTeachers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setLoading(false);
        }
    };

    const filterTeachers = () => {
        const filtered = teachers.filter(teacher =>
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.premiumCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.thana?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTeachers(filtered);
        setCurrentPage(1);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTeachers = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

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
        gridContainer: { maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '26px', padding: '0 15px' },
        card: {
            background: '#fff',
            borderRadius: '20px',
            padding: '26px',
            border: '1px solid #e0e7ff',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
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
        pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '50px', flexWrap: 'wrap' },
        pageBtn: { minWidth: '38px', height: '38px', padding: '0 12px', background: '#fff', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '12px', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
        pageBtnActive: { background: '#3b82f6', color: '#fff', borderColor: '#3b82f6' },
        pageBtnDisabled: { opacity: 0.4, cursor: 'not-allowed' },
        loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: '#64748b' },
        spinner: { width: '45px', height: '45px', border: '4px solid #e2e8f0', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '18px' },
        noResults: { textAlign: 'center', color: '#64748b', padding: '60px 20px', fontSize: '1rem' }
    };

    const keyframes = `
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .grid-container { grid-template-columns: 1fr !important; } }
    `;

    const pageWindow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + pageWindow - 1);
    if (endPage - startPage < pageWindow - 1) {
        startPage = Math.max(1, endPage - pageWindow + 1);
    }
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <>
            <NavBar />
            <style>{keyframes}</style>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Premium Teachers</h1>
                    <p style={styles.subtitle}>Find qualified teacher easily</p>
                </div>

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

                {loading ? (
                    <div style={styles.loading}>
                        <div style={styles.spinner}></div>
                        <div>Loading...</div>
                    </div>
                ) : filteredTeachers.length === 0 ? (
                    <div style={styles.noResults}>No teachers found</div>
                ) : (
                    <>
                        <div style={styles.gridContainer} className="grid-container">
                            {currentTeachers.map(teacher => (
                                <TeacherCard key={teacher._id} teacher={teacher} styles={styles} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div style={styles.pagination}>
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    style={{ ...styles.pageBtn, ...(currentPage === 1 && styles.pageBtnDisabled) }}
                                >
                                    <FaChevronLeft size={18} />
                                </button>

                                {pageNumbers.map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        style={{ ...styles.pageBtn, ...(currentPage === pageNum && styles.pageBtnActive) }}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{ ...styles.pageBtn, ...(currentPage === totalPages && styles.pageBtnDisabled) }}
                                >
                                    <FaChevronRight size={18} />
                                </button>
                            </div>
                        )}
                        <Footer />
                    </>
                )}
            </div>
        </>
    );
}

function TeacherCard({ teacher, styles }) {
    const [isHovered, setIsHovered] = useState(false);
    const GenderIcon = teacher.gender?.toLowerCase() === 'male' ? FaMale : FaFemale;

    const avatarGradient = teacher.gender?.toLowerCase() === 'male'
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
            <div style={styles.cardHeader}>
                <div
                    style={{
                        ...styles.avatar,
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        background: avatarGradient
                    }}
                >
                    <GenderIcon style={styles.avatarIcon} />
                </div>

                <div style={styles.cardInfo}>
                    <h3 style={{ ...styles.name, color: '#1e40af', fontSize: '1.25rem' }}>{teacher.name}</h3>
                    <div style={{ ...styles.code }}>#{teacher.premiumCode}</div>
                    <div style={styles.gender}><GenderIcon /> {teacher.gender}</div>
                </div>
            </div>

            <div style={styles.infoSection}>
                {teacher.currentArea || teacher.thana || teacher.district ? (
                    <div style={styles.infoRow}>
                        <FaMapMarkerAlt style={styles.infoIcon} size={16} />
                        <div style={styles.infoText}>
                            <div style={styles.infoLabel}>Location</div>
                            <span style={{ fontWeight: '600', color: '#0f172a' }}>
                                {[teacher.currentArea, teacher.thana, teacher.district].filter(Boolean).join(', ')}
                            </span>
                        </div>
                    </div>
                ) : null}

                {teacher.honorsDept && (
                    <div style={styles.infoRow}>
                        <FaGraduationCap style={styles.infoIcon} size={16} />
                        <div style={styles.infoText}>
                            <div style={styles.infoLabel}>Honors</div>
                            <span style={{ fontWeight: '600', color: '#1e40af' }}>
                                {teacher.honorsDept}
                                {teacher.honorsUniversity && ` - ${teacher.honorsUniversity}`}
                            </span>
                        </div>
                    </div>
                )}

                {teacher.mastersDept && (
                    <div style={styles.infoRow}>
                        <FaBookOpen style={styles.infoIcon} size={16} />
                        <div style={styles.infoText}>
                            <div style={styles.infoLabel}>Masters</div>
                            <span style={{ fontWeight: '600', color: '#1e40af' }}>
                                {teacher.mastersDept}
                                {teacher.mastersUniversity && ` - ${teacher.mastersUniversity}`}
                            </span>
                        </div>
                    </div>
                )}

                {teacher.academicYear && (
                    <div style={styles.infoRow}>
                        <FaCalendarAlt style={styles.infoIcon} size={16} />
                        <div style={styles.infoText}>
                            <div style={styles.infoLabel}>Academic Year</div>
                            <span style={{ fontWeight: '600', color: '#0f172a' }}>{teacher.academicYear}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
