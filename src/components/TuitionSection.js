import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TuitionCard from './TuitionCard';

const TuitionSection = () => {
    const [tuitions, setTuitions] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [genderFilter, setGenderFilter] = useState('All');
    const [codeSearch, setCodeSearch] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        axios.get('https://tuition-seba-backend-1.onrender.com/api/tuition/available')
            .then(res => {
                setTuitions(res.data);
                setFiltered(res.data);
            })
            .catch(err => console.error('API fetch failed:', err));
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
        setCurrentPage(1);
    }, [genderFilter, codeSearch, locationSearch, tuitions]);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentTuitions = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return (
        <div className="container my-4">
            <h3 className="text-center mb-4">Available Tuitions</h3>

            {/* Filters */}
            <div className="row mb-3">
                <div className="col-md-3">
                    <select className="form-select" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                        <option value="All">Filter by Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <input type="text" className="form-control" placeholder="Search by tuition code"
                        value={codeSearch} onChange={(e) => setCodeSearch(e.target.value)} />
                </div>
                <div className="col-md-3">
                    <input type="text" className="form-control" placeholder="Search by location"
                        value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} />
                </div>
                <div className="col-md-3">
                    <button className="btn btn-outline-primary w-100" onClick={() => {
                        setGenderFilter('All');
                        setCodeSearch('');
                        setLocationSearch('');
                    }}>Reset Filters</button>
                </div>
            </div>

            <div className="row">
                {currentTuitions.map((tuition, idx) => (
                    <div key={idx} className="col-md-4">
                        <TuitionCard tuition={tuition} />
                    </div>
                ))}
            </div>

            <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default TuitionSection;
