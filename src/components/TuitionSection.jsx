import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import TuitionCard from './TuitionCard';
import { FiRefreshCcw } from 'react-icons/fi';
import { Spinner } from 'react-bootstrap';

const TuitionSection = () => {
    const [tuitions, setTuitions] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [genderFilter, setGenderFilter] = useState('All');
    const [codeSearch, setCodeSearch] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [generalSearch, setGeneralSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const itemsPerPage = 6;
    const maxPageButtons = 20;
    const containerRef = useRef(null);

    const normalize = (val) => val?.toString().trim().toLowerCase() || '';

    useEffect(() => {
        setLoading(true);
        axios
            .get('https://tuition-seba-backend-1.onrender.com/api/tuition/available')
            .then((res) => {
                setTuitions(res.data);
                setFiltered(res.data);
            })
            .catch((err) => console.error('API fetch failed:', err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const gender = normalize(genderFilter);
        const codeQuery = normalize(codeSearch);
        const locationQuery = normalize(locationSearch);
        const generalQuery = normalize(generalSearch);

        const filteredResults = tuitions.filter((t) => {
            const wantedTeacher = normalize(t.wantedTeacher);
            const tuitionCode = normalize(t.tuitionCode);
            const location = normalize(t.location);
            const area = normalize(t.area);
            const city = normalize(t.city);
            const student = normalize(t.student);
            const className = normalize(t.class);
            const medium = normalize(t.medium);
            const subject = normalize(t.subject);
            const time = normalize(t.time);
            const day = normalize(t.day);
            const salary = normalize(t.salary);
            const joining = normalize(t.joining);

            const hasBothGenders = /male\s*\/\s*female|female\s*\/\s*male/.test(wantedTeacher);
            const matchesGender =
                gender === 'all' ||
                (gender === 'male' && (wantedTeacher.startsWith('male') || hasBothGenders)) ||
                (gender === 'female' && (wantedTeacher.startsWith('female') || hasBothGenders));

            const matchesCode = !codeQuery || tuitionCode.includes(codeQuery);
            const matchesLocation = !locationQuery || location.includes(locationQuery) || area.includes(locationQuery);

            const matchesGeneral =
                !generalQuery ||
                tuitionCode.includes(generalQuery) ||
                wantedTeacher.includes(generalQuery) ||
                student.includes(generalQuery) ||
                className.includes(generalQuery) ||
                medium.includes(generalQuery) ||
                subject.includes(generalQuery) ||
                time.includes(generalQuery) ||
                day.includes(generalQuery) ||
                salary.includes(generalQuery) ||
                location.includes(generalQuery) ||
                area.includes(generalQuery) ||
                city.includes(generalQuery) ||
                joining.includes(generalQuery);

            return matchesGender && matchesCode && matchesLocation && matchesGeneral;
        });

        setFiltered(filteredResults);
        setCurrentPage(1);
    }, [genderFilter, codeSearch, locationSearch, generalSearch, tuitions]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentTuitions = filtered.slice().reverse().slice(indexOfFirst, indexOfLast);

    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons;
        let end = Math.min(start + maxPageButtons, totalPages);
        return Array.from({ length: end - start }, (_, i) => start + i + 1);
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const resetFilters = () => {
        setGenderFilter('All');
        setCodeSearch('');
        setLocationSearch('');
        setGeneralSearch('');
        setCurrentPage(1);
    };

    return (
        <div className="container my-4" ref={containerRef}>
            <h3 className="text-center mb-4">Available Tuitions</h3>

            {/* Filters */}
            <div className="row mb-3 g-2">
                <div className="col-md-2">
                    <select className="form-select" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                        <option value="All">Filter by Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by tuition code"
                        value={codeSearch}
                        onChange={(e) => setCodeSearch(e.target.value)}
                    />
                </div>
                <div className="col-md-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by location"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="General search (anything)"
                        value={generalSearch}
                        onChange={(e) => setGeneralSearch(e.target.value)}
                    />
                </div>
                <div className="col-md-2 d-flex align-items-center justify-content-center">
                    <button
                        className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                        onClick={resetFilters}
                    >
                        <FiRefreshCcw className="me-2" /> Reset
                    </button>
                </div>
            </div>

            <div className="mb-3 text-center fw-bold" style={{ color: '#333' }}>
                Page: <span style={{ color: '#007bff' }}>{currentPage}</span> /{' '}
                <span style={{ color: '#007bff' }}>{totalPages}</span>, Found{' '}
                <span style={{ color: '#007bff' }}>{filtered.length}</span> tuitions out of{' '}
                <span style={{ color: '#007bff' }}>{tuitions.length}</span>
            </div>

            {loading ? (
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                    <div className="mt-3 fw-semibold text-primary">Loading tuitions...</div>
                </div>
            ) : (
                <>
                    <div className="row">
                        {currentTuitions.length > 0 ? (
                            currentTuitions.map((tuition, idx) => (
                                <div key={idx} className="col-md-4 mb-3">
                                    <TuitionCard tuition={tuition} />
                                </div>
                            ))
                        ) : (
                            <p className="text-center">No tuitions found.</p>
                        )}
                    </div>

                    {/* Pagination */}
                    <nav className="d-flex justify-content-center mt-4">
                        <ul className="pagination flex-wrap">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}>
                                    &laquo;
                                </button>
                            </li>

                            {getPaginationGroup().map((pageNum) => (
                                <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => onPageChange(pageNum)}>
                                        {pageNum}
                                    </button>
                                </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}>
                                    &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                </>
            )}
        </div>
    );
};

export default TuitionSection;
