import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TuitionCard from '../../components/TuitionCard';
import NavBar from '../../components/NavBar';
import { Spinner } from 'react-bootstrap';
import { FiRefreshCcw } from 'react-icons/fi';

const TuitionSection = () => {
    const [tuitions, setTuitions] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [genderFilter, setGenderFilter] = useState('All');
    const [codeSearch, setCodeSearch] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [generalSearch, setGeneralSearch] = useState('');
    const [loading, setLoading] = useState(true);

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
        const gender = genderFilter.toLowerCase();
        const codeQuery = codeSearch.trim().toLowerCase();
        const locationQuery = locationSearch.trim().toLowerCase();
        const generalQuery = generalSearch.trim().toLowerCase();

        const filteredResults = tuitions.filter((tuition) => {
            // trim all values before comparing
            const wantedTeacher = tuition.wantedTeacher?.trim().toLowerCase() || '';
            const tuitionCode = tuition.tuitionCode?.toString().trim().toLowerCase() || '';
            const location = tuition.location?.trim().toLowerCase() || '';
            const area = tuition.area?.trim().toLowerCase() || '';
            const city = tuition.city?.trim().toLowerCase() || '';
            const student = tuition.student?.toString().trim().toLowerCase() || '';
            const className = tuition.class?.toString().trim().toLowerCase() || '';
            const medium = tuition.medium?.trim().toLowerCase() || '';
            const subject = tuition.subject?.trim().toLowerCase() || '';
            const time = tuition.time?.trim().toLowerCase() || '';
            const day = tuition.day?.toString().trim().toLowerCase() || '';
            const salary = tuition.salary?.trim().toLowerCase() || '';
            const joining = tuition.joining?.trim().toLowerCase() || '';

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
    }, [genderFilter, codeSearch, locationSearch, generalSearch, tuitions]);

    const resetFilters = () => {
        setGenderFilter('All');
        setCodeSearch('');
        setLocationSearch('');
        setGeneralSearch('');
    };

    return (
        <>
            <NavBar />
            <div className="container my-4">
                <h3 className="text-center mb-4">Available Tuitions</h3>

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
                            placeholder="Search by code"
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
                            placeholder="General search (any field)"
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

                <div className="row" style={{ minHeight: '200px' }}>
                    {loading ? (
                        <div className="d-flex flex-column justify-content-center align-items-center w-100" style={{ height: '200px' }}>
                            <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                            <p className="mt-3 text-primary fw-semibold">Loading tuitions, please wait...</p>
                        </div>
                    ) : filtered.length > 0 ? (
                        filtered.slice().reverse().map((tuition, idx) => (
                            <div key={idx} className="col-md-4 mb-3">
                                <TuitionCard tuition={tuition} />
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No tuitions found.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default TuitionSection;
