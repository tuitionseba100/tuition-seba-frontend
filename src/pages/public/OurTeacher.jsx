import React, { useState, useEffect, useRef, Suspense } from 'react';
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
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { ToastContainer } from 'react-toastify';

// Lazy load the modal to improve performance
const RequestTeacherModal = React.lazy(() => import('../../components/modals/RequestTeacherModal'));

export default function OurTeacher() {
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGender, setSelectedGender] = useState('all');
    const [loading, setLoading] = useState(true);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const resultsRef = useRef(null);

    useEffect(() => {
        fetchTeachers();
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 600);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        filterTeachers();
    }, [searchTerm, selectedGender, teachers]);

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
        let filtered = teachers;

        if (selectedGender !== 'all') {
            filtered = filtered.filter(t =>
                t.gender?.toLowerCase() === selectedGender
            );
        }

        const term = searchTerm.trim().toLowerCase();
        if (term) {
            filtered = filtered.filter((teacher) =>
                Object.values(teacher).some((value) => {
                    if (!value) return false;
                    return String(value).toLowerCase().includes(term);
                })
            );
        }

        setFilteredTeachers(filtered);
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedGender('all');
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openModal = (teacher) => {
        setSelectedTeacher(teacher);
        setShowRequestModal(true);
    };

    return (
        <>
            <NavBar />
            <ToastContainer position="top-center" />

            <section className="py-5 bg-light" style={{ minHeight: '100vh' }}>
                <div className="container py-4">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h1 className="display-5 fw-bold text-primary mb-3">Premium Teachers</h1>
                        <p className="lead text-muted mb-2">Find qualified teachers easily</p>
                        <p className="text-secondary fs-5">10,000+ registered teachers available nationwide</p>
                    </div>

                    {/* Smaller Filter Card */}
                    <div className="row justify-content-center mb-4">
                        <div className="col-lg-8">
                            <div className="card shadow-sm border-0">
                                <div className="card-body p-3"> {/* Reduced padding */}
                                    <div className="row g-3 align-items-center"> {/* align-items-center for tighter layout */}
                                        {/* Search */}
                                        <div className="col-md-6">
                                            <div className="position-relative">
                                                <FaSearch className="position-absolute top-50 start-3 translate-middle-y text-muted" size={18} />
                                                <input
                                                    type="text"
                                                    className="form-control ps-5 rounded-pill"
                                                    placeholder="Search teachers..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Gender Filter */}
                                        <div className="col-md-3">
                                            <select
                                                className="form-select rounded-pill"
                                                value={selectedGender}
                                                onChange={(e) => setSelectedGender(e.target.value)}
                                            >
                                                <option value="all">All</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                        </div>

                                        {/* Reset Button */}
                                        <div className="col-md-3">
                                            <button
                                                onClick={handleReset}
                                                className="btn btn-outline-secondary w-100 rounded-pill"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div ref={resultsRef}>
                        {loading ? (
                            <div className="text-center py-5 my-5">
                                <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem' }}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-4 text-muted fs-5">Loading teachers...</p>
                            </div>
                        ) : filteredTeachers.length === 0 ? (
                            <div className="text-center py-5 my-5">
                                <div className="display-1 text-muted mb-4">😔</div>
                                <h3 className="text-muted">No teachers found</h3>
                                <p className="text-secondary">Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            <>
                                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                                    {filteredTeachers.map(teacher => (
                                        <div key={teacher._id} className="col">
                                            <TeacherCard
                                                teacher={teacher}
                                                onRequest={() => openModal(teacher)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center mt-5">
                                    <p className="text-muted fs-5">
                                        Showing <strong>{filteredTeachers.length}</strong> teacher{filteredTeachers.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <Footer />

            {/* Lazy Loaded Modal with Fallback */}
            <Suspense fallback={
                <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}>
                    <div className="d-flex justify-content-center align-items-center vh-100">
                        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
                    </div>
                </div>
            }>
                <RequestTeacherModal
                    show={showRequestModal}
                    onHide={() => setShowRequestModal(false)}
                    teacher={selectedTeacher}
                    onSaved={() => setShowRequestModal(false)}
                />
            </Suspense>

            {/* Back to Top Button */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="btn btn-primary btn-lg rounded-circle shadow-lg position-fixed"
                    style={{
                        bottom: '30px',
                        right: '30px',
                        zIndex: 1000,
                        width: '60px',
                        height: '60px'
                    }}
                    aria-label="Back to top"
                >
                    <FaArrowUp size={24} />
                </button>
            )}
        </>
    );
}

function TeacherCard({ teacher, onRequest }) {
    const isMale = teacher.gender?.toLowerCase() === 'male';
    const GenderIcon = isMale ? FaMale : FaFemale;

    return (
        <div
            className="card h-100 border-0 shadow-sm hover-shadow-lg transition-all"
            style={{
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                    <div
                        className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-3"
                        style={{
                            width: '70px',
                            height: '70px',
                            background: isMale
                                ? 'linear-gradient(135deg, #3b82f6, #60a5fa)'
                                : 'linear-gradient(135deg, #ec4899, #f472b6)',
                            color: 'white'
                        }}
                    >
                        <GenderIcon size={32} />
                    </div>
                    <div className="ms-3 flex-grow-1">
                        <h5 className="mb-1 fw-bold text-primary">{teacher.name}</h5>
                        <span className="badge bg-primary text-white px-3 py-2 rounded-pill">
                            #{teacher.premiumCode}
                        </span>
                        <div className="mt-2 text-muted small">
                            <GenderIcon className="me-1" />
                            {teacher.gender}
                        </div>
                    </div>
                </div>

                <div className="flex-grow-1">
                    {(teacher.currentArea || teacher.thana || teacher.district) && (
                        <div className="d-flex mb-3">
                            <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                            <div className="ms-3">
                                <small className="text-muted d-block">Location</small>
                                <strong>
                                    {[teacher.currentArea, teacher.thana, teacher.district]
                                        .filter(Boolean)
                                        .join(', ')}
                                </strong>
                            </div>
                        </div>
                    )}

                    {teacher.honorsDept && (
                        <div className="d-flex mb-3">
                            <FaGraduationCap className="text-primary mt-1 flex-shrink-0" />
                            <div className="ms-3">
                                <small className="text-muted d-block">Honors</small>
                                <strong className="text-primary">
                                    {teacher.honorsDept}
                                    {teacher.honorsUniversity && ` - ${teacher.honorsUniversity}`}
                                </strong>
                            </div>
                        </div>
                    )}

                    {teacher.mastersDept && (
                        <div className="d-flex mb-3">
                            <FaBookOpen className="text-primary mt-1 flex-shrink-0" />
                            <div className="ms-3">
                                <small className="text-muted d-block">Masters</small>
                                <strong className="text-primary">
                                    {teacher.mastersDept}
                                    {teacher.mastersUniversity && ` - ${teacher.mastersUniversity}`}
                                </strong>
                            </div>
                        </div>
                    )}

                    {teacher.academicYear && (
                        <div className="d-flex mb-3">
                            <FaCalendarAlt className="text-primary mt-1 flex-shrink-0" />
                            <div className="ms-3">
                                <small className="text-muted d-block">Academic Year</small>
                                <strong>{teacher.academicYear}</strong>
                            </div>
                        </div>
                    )}

                    {teacher.isResultShow && (teacher.sscResult || teacher.hscResult) && (
                        <div className="d-flex mb-3">
                            <FaBookOpen className="text-primary mt-1 flex-shrink-0" />
                            <div className="ms-3">
                                <small className="text-muted d-block">Results</small>
                                {teacher.sscResult && <div><strong>SSC:</strong> {teacher.sscResult}</div>}
                                {teacher.hscResult && <div><strong>HSC:</strong> {teacher.hscResult}</div>}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRequest();
                        }}
                        className="btn btn-primary btn-lg w-100 rounded-pill shadow-sm fw-semibold"
                    >
                        Request Teacher
                    </button>
                </div>
            </div>
        </div>
    );
}