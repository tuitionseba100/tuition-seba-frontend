import React, { useEffect, useState, useCallback } from 'react';
import { axiosWithFallback as axios } from '../../services/fetchWithFallback';
import TuitionCard from '../../components/TuitionCard';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { Spinner } from 'react-bootstrap';
import { FiRefreshCcw, FiMapPin, FiAlertCircle } from 'react-icons/fi';

const TuitionSection = () => {
    const [tuitions, setTuitions] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [genderFilter, setGenderFilter] = useState('All');
    const [codeSearch, setCodeSearch] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [generalSearch, setGeneralSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [userSettings, setUserSettings] = useState(null);

    const loadUserSettings = useCallback(() => {
        try {
            const saved = localStorage.getItem('@user_settings');
            if (saved) {
                setUserSettings(JSON.parse(saved));
            } else {
                setUserSettings(null);
            }
        } catch (e) {
            console.error('Error reading user settings', e);
            setUserSettings(null);
        }
    }, []);

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
        loadUserSettings();
        const handler = () => loadUserSettings();
        window.addEventListener('userSettingsUpdated', handler);
        return () => window.removeEventListener('userSettingsUpdated', handler);
    }, [loadUserSettings]);

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

                {/* Preferred Areas Banner */}
                {(() => {
                    const activeAreas = (userSettings?.areas || []).filter(a => a.trim() !== '');
                    if (activeAreas.length > 0) {
                        const areaStats = activeAreas.map(ua => {
                            const count = tuitions.filter(t => {
                                const area = (t.area || '').trim().toLowerCase();
                                const location = (t.location || '').trim().toLowerCase();
                                const uaLower = ua.trim().toLowerCase();
                                return area.includes(uaLower) || location.includes(uaLower);
                            }).length;
                            return { name: ua, count };
                        });
                        const totalCount = areaStats.reduce((sum, a) => sum + a.count, 0);
                        return (
                            <div style={{
                                background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                                border: '1px solid #93C5FD',
                                borderRadius: 12,
                                padding: '16px 20px',
                                marginBottom: 20,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FiMapPin style={{ color: '#2563EB', fontSize: 18 }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#1E3A5F', fontSize: 14 }}>আপনার সিলেক্ট করা এরিয়া</div>
                                        <div style={{ fontSize: 12, color: '#1E40AF' }}>
                                            আপনার এরিয়াগুলোতে মোট <strong style={{ color: '#2563EB' }}>{totalCount}</strong> টি টিউশন আছে
                                        </div>
                                        <div style={{ fontSize: 11, color: '#64748B', marginTop: 3 }}>
                                            এরিয়া যোগ বা মুছে ফেলতে উপরের <strong>Settings</strong> (⚙️) এ যান।
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {areaStats.map((item, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setLocationSearch(item.name)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 6,
                                                padding: '6px 14px',
                                                borderRadius: 20,
                                                border: locationSearch.toLowerCase() === item.name.toLowerCase() ? '2px solid #2563EB' : '1px solid #BFDBFE',
                                                background: locationSearch.toLowerCase() === item.name.toLowerCase() ? '#2563EB' : '#fff',
                                                color: locationSearch.toLowerCase() === item.name.toLowerCase() ? '#fff' : '#1E3A5F',
                                                fontWeight: 600,
                                                fontSize: 13,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            {item.name}
                                            <span style={{
                                                background: locationSearch.toLowerCase() === item.name.toLowerCase() ? 'rgba(255,255,255,0.25)' : '#EFF6FF',
                                                color: locationSearch.toLowerCase() === item.name.toLowerCase() ? '#fff' : '#2563EB',
                                                padding: '2px 8px',
                                                borderRadius: 10,
                                                fontSize: 11,
                                                fontWeight: 800,
                                            }}>{item.count}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div style={{
                                background: 'linear-gradient(135deg, #FFF7ED 0%, #FFF1E6 100%)',
                                border: '1px solid #FED7AA',
                                borderRadius: 12,
                                padding: '14px 20px',
                                marginBottom: 20,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                            }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <FiAlertCircle style={{ color: '#C2410C', fontSize: 18 }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#C2410C', fontSize: 13 }}>আপনার এলাকা সিলেক্ট করুন</div>
                                    <div style={{ fontSize: 12, color: '#7C2D12' }}>
                                        নিজের এলাকার সব টিউশন অফার সবার আগে দেখতে উপরের <strong>Settings</strong> (⚙️) থেকে আপনার এরিয়াটি সেভ করুন।
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })()}

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
            <Footer />
        </>
    );
};

export default TuitionSection;
