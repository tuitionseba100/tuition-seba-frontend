import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import TuitionCard from './TuitionCard';

const TuitionSection = () => {
    const [tuitions, setTuitions] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [genderFilter, setGenderFilter] = useState('All');
    const [codeSearch, setCodeSearch] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 6;
    const maxPageButtons = 20;
    const containerRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        axios.get('https://tuition-seba-backend-1.onrender.com/api/tuition/available')
            .then(res => {
                setTuitions(res.data);
                setFiltered(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('API fetch failed:', err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const gender = genderFilter.toLowerCase();
        const codeQuery = codeSearch.trim().toLowerCase();
        const locationQuery = locationSearch.trim().toLowerCase();

        const filteredResults = tuitions.filter(tuition => {
            const wantedTeacher = tuition.wantedTeacher?.toLowerCase() || '';
            const tuitionCode = tuition.tuitionCode?.toString().toLowerCase() || '';
            const location = tuition.location?.toLowerCase() || '';
            const area = tuition.area?.toLowerCase() || '';

            const hasBothGenders = /male\s*\/\s*female|female\s*\/\s*male/.test(wantedTeacher);
            const matchesGender =
                gender === 'all' ||
                (gender === 'male' && (wantedTeacher.startsWith('male') || hasBothGenders)) ||
                (gender === 'female' && (wantedTeacher.startsWith('female') || hasBothGenders));

            const matchesCode = !codeQuery || tuitionCode.includes(codeQuery);

            const matchesLocation = !locationQuery || location.includes(locationQuery) || area.includes(locationQuery);

            return matchesGender && matchesCode && matchesLocation;
        });

        setFiltered(filteredResults);
        setCurrentPage(1);  // Reset page to 1 when filters change
    }, [genderFilter, codeSearch, locationSearch, tuitions]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentTuitions = filtered.slice().reverse().slice(indexOfFirst, indexOfLast);

    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons;
        let end = Math.min(start + maxPageButtons, totalPages);
        let pages = [];
        for (let i = start + 1; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="container my-4" ref={containerRef}>
            <h3 className="text-center mb-4">Available Tuitions</h3>

            {/* Filters */}
            <div className="row mb-3">
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={genderFilter}
                        onChange={(e) => setGenderFilter(e.target.value)}
                    >
                        <option value="All">Filter by Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by tuition code"
                        value={codeSearch}
                        onChange={(e) => setCodeSearch(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by location"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <button
                        className="btn btn-outline-primary w-100"
                        onClick={() => {
                            setGenderFilter('All');
                            setCodeSearch('');
                            setLocationSearch('');
                            setCurrentPage(1);  // Reset page on filter reset
                        }}
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            <div className="mb-3 text-center fw-bold" style={{ color: '#333' }}>
                Page: <span style={{ color: '#007bff' }}>{currentPage}</span> / <span style={{ color: '#007bff' }}>{totalPages}</span>, Found <span style={{ color: '#007bff' }}>{filtered.length}</span> tuitions out of <span style={{ color: '#007bff' }}>{tuitions.length}</span>
            </div>

            {loading ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '200px',
                    }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <div className="spinner" />
                        <div
                            style={{
                                marginTop: 10,
                                fontSize: 18,
                                fontWeight: '500',
                                color: '#007bff',
                            }}
                        >
                            Loading tuitions...
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="row">
                        {currentTuitions.map((tuition, idx) => (
                            <div key={idx} className="col-md-4">
                                <TuitionCard tuition={tuition} />
                            </div>
                        ))}
                    </div>

                    <nav className="d-flex justify-content-center mt-4">
                        <ul className="pagination flex-wrap">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    aria-label="Previous"
                                    onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                                >
                                    &laquo;
                                </button>
                            </li>

                            {getPaginationGroup().map((pageNum) => (
                                <li
                                    key={pageNum}
                                    className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                                >
                                    <button className="page-link" onClick={() => onPageChange(pageNum)}>
                                        {pageNum}
                                    </button>
                                </li>
                            ))}

                            <li
                                className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''
                                    }`}
                            >
                                <button
                                    className="page-link"
                                    aria-label="Next"
                                    onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                                >
                                    &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                </>
            )}

            <style>{`
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #cce5ff;
                    border-top: 4px solid #007bff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default TuitionSection;
