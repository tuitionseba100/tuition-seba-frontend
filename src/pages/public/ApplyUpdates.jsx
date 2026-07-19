import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Badge, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { FiPhone, FiSearch, FiRefreshCw, FiClock, FiCheckCircle, FiXCircle, FiInfo, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { fetchWithFallback } from '../../services/fetchWithFallback';

const BANGLA_FONT = "'Hind Siliguri', sans-serif";

const ApplyUpdates = () => {
    const [phone, setPhone] = useState('');
    const [tuitionData, setTuitionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);
    
    // Modal states for tuition details
    const [selectedTuition, setSelectedTuition] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const fetchTuitionStatus = useCallback(async (phoneToSearch) => {
        if (!phoneToSearch) return;
        
        if (!/^\d{11}$/.test(phoneToSearch)) {
            setError('দয়াকরে ১১ ডিজিটের সঠিক মোবাইল নম্বরটি লিখুন');
            return;
        }

        setLoading(true);
        setError('');
        setTuitionData([]);
        setSearched(false);

        try {
            const response = await fetchWithFallback(
                `https://tuition-seba-backend-1.onrender.com/api/tuitionApply/getTuitionStatusesByPhone?phone=${phoneToSearch}`
            );

            if (!response.ok) {
                let errorMessage = `সার্ভার ত্রুটি (Status: ${response.status})`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (e) {
                    // Ignore JSON parse error
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setTuitionData(data);
            setSearched(true);
        } catch (err) {
            setError(err.message || 'নেটওয়ার্কে সমস্যা হচ্ছে, আবার চেষ্টা করুন।');
            toast.error(err.message || 'নেটওয়ার্কে সমস্যা হচ্ছে, আবার চেষ্টা করুন।');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('@user_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.phone) {
                    setPhone(parsed.phone);
                    fetchTuitionStatus(parsed.phone);
                }
            }
        } catch (e) {
            console.error('Error loading settings', e);
        }
    }, [fetchTuitionStatus]);

    const handleShowDetails = async (tuitionCode) => {
        setModalLoading(true);
        setSelectedTuition(null);
        setShowModal(true);
        try {
            const response = await fetchWithFallback(
                `https://tuition-seba-backend-1.onrender.com/api/tuition/byCodePublic?tuitionCode=${tuitionCode}`
            );
            if (!response.ok) {
                throw new Error('টিউশন কোড পাওয়া যায়নি');
            }
            const data = await response.json();
            setSelectedTuition(data);
        } catch (err) {
            toast.error(err.message || 'টিউশন ডিটেইলস লোড করতে সমস্যা হয়েছে');
            setShowModal(false);
        } finally {
            setModalLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (phone.trim()) {
            fetchTuitionStatus(phone.trim());
        } else {
            setError('দয়াকরে আপনার ফোন নম্বরটি লিখুন');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const optionsDate = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
        };
        const optionsTime = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC',
        };
        const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
        const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);
        return { date: formattedDate, time: formattedTime };
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
            case 'confirmed':
            case 'selected':
                return '#10B981';
            case 'pending':
                return '#F59E0B';
            case 'rejected':
            case 'cancel':
            case 'cancelled':
            case 'cancelled by guardian':
            case 'cancelled by teacher':
                return '#EF4444';
            default:
                return '#3B82F6';
        }
    };

    const getStatusBgColor = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
            case 'confirmed':
            case 'selected':
                return '#ecfdf5';
            case 'pending':
                return '#fffbeb';
            case 'rejected':
            case 'cancel':
            case 'cancelled':
            case 'cancelled by guardian':
            case 'cancelled by teacher':
                return '#fef2f2';
            default:
                return '#eff6ff';
        }
    };

    const getRowBgColor = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
            case 'confirmed':
            case 'selected':
                return '#f0fdf4';
            case 'rejected':
            case 'cancel':
            case 'cancelled':
            case 'cancelled by guardian':
            case 'cancelled by teacher':
                return '#fef2f2';
            default:
                return '#ffffff';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
            case 'confirmed':
            case 'selected':
                return <FiCheckCircle size={13} />;
            case 'pending':
                return <FiClock size={13} />;
            case 'rejected':
            case 'cancel':
            case 'cancelled':
            case 'cancelled by guardian':
            case 'cancelled by teacher':
                return <FiXCircle size={13} />;
            default:
                return <FiInfo size={13} />;
        }
    };

    return (
        <>
            {/* Import Hind Siliguri for beautiful Bangla typography */}
            <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            <div className="apply-updates-root">
                <NavBar />
                <ToastContainer position="top-center" autoClose={3000} />

                {/* ===== PREMIUM HERO HEADER ===== */}
                <div className="au-hero">
                    {/* Animated background blobs */}
                    <div className="au-blob au-blob-1" />
                    <div className="au-blob au-blob-2" />
                    <div className="au-blob au-blob-3" />

                    <Container style={{ position: 'relative', zIndex: 2 }}>
                        <div className="au-hero-inner">
                            {/* Top badge */}
                            <div className="au-hero-badge">
                                <span className="au-badge-dot" />
                                <span>লাইভ ট্র্যাকিং সিস্টেম</span>
                            </div>

                            {/* Main title */}
                            <h1 className="au-hero-title">
                                আবেদনের
                                <span className="au-hero-title-accent"> স্ট্যাটাস</span>
                            </h1>

                            {/* Subtitle */}
                            <p className="au-hero-subtitle">
                                রিয়েল-টাইমে আপনার টিউশন আবেদনের আপডেট ট্র্যাক করুন
                            </p>
                        </div>
                    </Container>
                </div>

                <Container className="au-main-container">
                    {/* Search Panel */}
                    <div className="au-search-card">
                        <Form onSubmit={handleSearch}>
                            <div className="au-search-row">
                                <div className="au-search-input-wrap">
                                    <label className="au-search-label">আপনার ফোন নম্বর দিন</label>
                                    <div className="au-input-container">
                                        <span className="au-input-icon">
                                            <FiPhone size={16} />
                                        </span>
                                        <input
                                            type="tel"
                                            placeholder="01XXXXXXXXX"
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(e.target.value);
                                                setError('');
                                            }}
                                            maxLength={11}
                                            className="au-input"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="au-search-btn"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" />
                                            <span>খোঁজা হচ্ছে...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiSearch size={18} />
                                            <span>স্ট্যাটাস দেখুন</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </Form>

                        {error && (
                            <div className="au-error">
                                <FiAlertCircle size={15} />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Empty State */}
                    {searched && tuitionData.length === 0 && !loading && (
                        <div className="au-empty-state">
                            <FiInfo size={48} strokeWidth={1} />
                            <h3>এই নম্বরে কোনো আবেদন পাওয়া যায়নি</h3>
                            <p>
                                এই নম্বর দিয়ে কোনো টিউশন আবেদন পাওয়া যায়নি। যদি কোনো অসুবিধা ফেস করেন তবে অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।
                            </p>
                        </div>
                    )}

                    {/* Results */}
                    {tuitionData.length > 0 && (
                        <div className="au-results">
                            <div className="au-results-header">
                                <h2 className="au-results-title">আপনার আবেদনসমূহ</h2>
                                <div className="au-results-actions">
                                    <button
                                        onClick={() => fetchTuitionStatus(phone)}
                                        disabled={loading}
                                        className="au-refresh-btn"
                                        title="রিফ্রেশ করুন"
                                    >
                                        <FiRefreshCw className={loading ? 'au-spin' : ''} size={15} />
                                    </button>
                                    <span className="au-count-badge">
                                        {tuitionData.length} টি আবেদন
                                    </span>
                                </div>
                            </div>

                            {/* Standalone card/table for each apply */}
                            <div className="au-applies-list" style={{ marginTop: '24px' }}>
                                {tuitionData.slice().reverse().map((item, index) => {
                                    const { date, time } = formatDate(item.appliedAt);
                                    const statusColor = getStatusColor(item.status);
                                    const statusBg = getStatusBgColor(item.status);
                                    const rowBg = getRowBgColor(item.status);

                                    return (
                                        <div key={index} className="au-apply-item" style={{
                                            background: '#ffffff',
                                            borderRadius: '16px',
                                            border: '1.5px solid #e2e8f0',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                            marginBottom: '28px',
                                            overflow: 'hidden',
                                            fontFamily: BANGLA_FONT,
                                            transition: 'transform 0.2s, box-shadow 0.2s'
                                        }}>
                                            {/* Header bar of the apply card */}
                                            <div style={{
                                                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                                                padding: '14px 20px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                gap: '12px'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span style={{
                                                        background: '#ffffff',
                                                        color: '#1e40af',
                                                        fontWeight: '800',
                                                        borderRadius: '50%',
                                                        width: '28px',
                                                        height: '28px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '13px'
                                                    }}>{tuitionData.length - index}</span>
                                                    
                                                    <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '15px', letterSpacing: '0.3px' }}>
                                                        টিউশন কোড: {item.tuitionCode}
                                                    </span>

                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleShowDetails(item.tuitionCode)}
                                                        style={{
                                                            background: 'rgba(255, 255, 255, 0.15)',
                                                            border: '1.5px solid rgba(255, 255, 255, 0.3)',
                                                            color: '#ffffff',
                                                            borderRadius: '20px',
                                                            padding: '3px 12px',
                                                            fontSize: '12px',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            fontFamily: BANGLA_FONT
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#ffffff';
                                                            e.currentTarget.style.color = '#1e40af';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                                                            e.currentTarget.style.color = '#ffffff';
                                                        }}
                                                    >
                                                        <FiInfo size={12} style={{ marginRight: '4px' }} />
                                                        বিস্তারিত
                                                    </button>
                                                </div>

                                                <span className="au-status-pill" style={{
                                                    color: statusColor,
                                                    backgroundColor: statusBg,
                                                    borderColor: statusColor + '30',
                                                    margin: 0,
                                                    padding: '5px 14px',
                                                    fontSize: '12.5px',
                                                    fontWeight: '700',
                                                    borderRadius: '30px',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}>
                                                    {getStatusIcon(item.status)}
                                                    {item.status}
                                                </span>
                                            </div>

                                            {/* Structured Table style inside the card */}
                                            <div className="table-responsive" style={{ margin: 0 }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14.5px', color: '#334155' }}>
                                                    <tbody>
                                                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                            <td style={{ width: '35%', padding: '12px 20px', background: '#f8fafc', fontWeight: '600', color: '#475569', borderRight: '1px solid #e2e8f0' }}>
                                                                আবেদন সিরিয়াল (Apply Serial)
                                                            </td>
                                                            <td style={{ padding: '12px 20px' }}>
                                                                {item.serialNumber ? (
                                                                    <span>
                                                                        আপনি এই টিউশনে <strong style={{ color: '#2563eb', fontSize: '16px' }}>#{item.serialNumber}</strong> নম্বর আবেদনকারী (মোট আবেদনকারী: {item.totalApplies} জন)
                                                                    </span>
                                                                ) : '-'}
                                                            </td>
                                                        </tr>
                                                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                            <td style={{ padding: '12px 20px', background: '#f8fafc', fontWeight: '600', color: '#475569', borderRight: '1px solid #e2e8f0' }}>
                                                                আবেদনের সময় (Apply Date/Time)
                                                            </td>
                                                            <td style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none' }}>
                                                                <FiClock size={13} style={{ color: '#64748b' }} />
                                                                <span>{date}, {time}</span>
                                                            </td>
                                                        </tr>
                                                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                            <td style={{ padding: '12px 20px', background: '#f8fafc', fontWeight: '600', color: '#475569', borderRight: '1px solid #e2e8f0' }}>
                                                                অভিভাবকের চাহিদা (Guardian Demand)
                                                            </td>
                                                            <td style={{ padding: '12px 20px', color: '#1e293b', fontWeight: '700' }}>
                                                                {item.guardianDemandForPublic && item.guardianDemandForPublic.trim() ? item.guardianDemandForPublic : 'অভিজ্ঞ শিক্ষক চাইছে ভালো দেখে'}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ padding: '14px 20px', background: '#f8fafc', fontWeight: '600', color: '#475569', borderRight: '1px solid #e2e8f0' }}>
                                                                TSF এজেন্টের মন্তব্য (Agent Comment)
                                                            </td>
                                                            <td style={{ padding: '14px 20px', backgroundColor: rowBg }}>
                                                                {item.commentForTeacher ? (
                                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: statusColor, fontWeight: '600' }}>
                                                                        <FiMessageSquare size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                                                                        <span>{item.commentForTeacher}</span>
                                                                    </div>
                                                                ) : item.status.toLowerCase() === 'pending' ? (
                                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#475569', fontStyle: 'italic' }}>
                                                                        <FiAlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0, color: '#3b82f6' }} />
                                                                        <span>আপনার আবেদনটি বর্তমানে রিভিউ চলছে। অনুগ্রহ করে অপেক্ষা করুন।</span>
                                                                    </div>
                                                                ) : (
                                                                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>কোনো মন্তব্য নেই</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </Container>

                {/* Tuition Details Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered className="au-details-modal">
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fw-bold fs-5 text-dark" style={{ fontFamily: BANGLA_FONT }}>
                            টিউশন আবেদনের বিস্তারিত তথ্য
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pt-3" style={{ fontFamily: BANGLA_FONT }}>
                        {modalLoading ? (
                            <div className="d-flex flex-column align-items-center py-5">
                                <Spinner animation="border" variant="primary" className="mb-2" />
                                <span className="text-secondary small">তথ্য লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</span>
                            </div>
                        ) : selectedTuition ? (
                            <div className="tuition-detail-card">
                                <div className="detail-header-badge mb-3">
                                    <span className="badge bg-primary px-3 py-2 rounded-pill font-sans">
                                        Code: {selectedTuition.tuitionCode}
                                    </span>
                                </div>
                                
                                <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                        <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Wanted Teacher</span>
                                        <span className="detail-value" style={{ fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>{selectedTuition.wantedTeacher || '-'}</span>
                                    </div>
                                    <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                        <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Students</span>
                                        <span className="detail-value" style={{ fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>{selectedTuition.student || '-'}</span>
                                    </div>
                                    <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                        <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Institute</span>
                                        <span className="detail-value" style={{ fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>{selectedTuition.institute || '-'}</span>
                                    </div>
                                    <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                        <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Class</span>
                                        <span className="detail-value" style={{ fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>{selectedTuition.class || '-'}</span>
                                    </div>
                                    <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                        <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Medium</span>
                                        <span className="detail-value" style={{ fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>{selectedTuition.medium || '-'}</span>
                                    </div>
                                    <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                        <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Subject</span>
                                        <span className="detail-value" style={{ fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>{selectedTuition.subject || '-'}</span>
                                    </div>
                                    <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                        <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Day</span>
                                        <span className="detail-value" style={{ fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>{selectedTuition.day || '-'}</span>
                                    </div>
                                    <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                        <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Time</span>
                                        <span className="detail-value" style={{ fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>{selectedTuition.time || '-'}</span>
                                    </div>
                                    <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                        <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Salary</span>
                                        <span className="detail-value text-success" style={{ fontSize: '14px', color: '#10b981', fontWeight: '700' }}>
                                            {selectedTuition.salary && /taka|tk/i.test(selectedTuition.salary.toString()) 
                                                ? selectedTuition.salary 
                                                : (selectedTuition.salary ? selectedTuition.salary.toString().trim() + ' taka' : '-')}
                                        </span>
                                    </div>
                                    {selectedTuition.mediaFee && selectedTuition.mediaFee.trim() !== '' && (
                                        <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                            <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Media Fee</span>
                                            <span className="detail-value" style={{ fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>{selectedTuition.mediaFee}</span>
                                        </div>
                                    )}
                                    <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                        <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Location</span>
                                        <span className="detail-value" style={{ fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>
                                            {selectedTuition.location || ''}{selectedTuition.area ? ', ' + selectedTuition.area : ''}
                                        </span>
                                    </div>
                                    <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                        <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Joining</span>
                                        <span className="detail-value" style={{ fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>{selectedTuition.joining || '-'}</span>
                                    </div>
                                </div>

                                {selectedTuition.studentGender && (
                                    <div className="detail-item-full mt-3" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                        <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>শিক্ষার্থীর লিঙ্গ (Student Gender):</span>
                                        <span className="detail-value" style={{ fontSize: '14.5px', color: '#1e293b', fontWeight: '700' }}>{selectedTuition.studentGender}</span>
                                    </div>
                                )}

                                <div className="detail-item-full mt-3" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                    <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Guardian Demand</span>
                                    <p className="detail-value-desc" style={{ fontSize: '13.5px', color: '#475569', background: '#f8fafc', borderRadius: '8px', padding: '10px 12px', margin: '4px 0 0 0', borderLeft: '3px solid #3b82f6', fontWeight: 600 }}>
                                        {selectedTuition.note && selectedTuition.note.trim() ? selectedTuition.note : 'অভিজ্ঞ শিক্ষক চাইছে ভালো দেখে'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-danger">
                                কোনো তথ্য পাওয়া যায়নি
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="secondary" className="rounded-pill px-4" onClick={() => setShowModal(false)} style={{ fontFamily: BANGLA_FONT }}>
                            বন্ধ করুন
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Footer />
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                /* ===== ROOT ===== */
                .apply-updates-root .au-header,
                .apply-updates-root .au-header *,
                .apply-updates-root .au-main-container,
                .apply-updates-root .au-main-container * {
                    font-family: ${BANGLA_FONT} !important;
                    box-sizing: border-box;
                }
                .apply-updates-root {
                    background: #f1f5f9;
                    min-height: 100vh;
                }

                /* ===== PREMIUM HERO ===== */
                .au-hero {
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(135deg, #0d1b4b 0%, #1a2d6b 40%, #1e3a8a 70%, #1d4ed8 100%);
                    padding: 14px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .au-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(70px);
                    opacity: 0.18;
                    pointer-events: none;
                }
                .au-blob-1 {
                    width: 380px; height: 380px;
                    background: radial-gradient(circle, #60a5fa, #3b82f6);
                    top: -200px; left: -80px;
                    animation: blobFloat1 8s ease-in-out infinite;
                }
                .au-blob-2 {
                    width: 280px; height: 280px;
                    background: radial-gradient(circle, #818cf8, #6366f1);
                    top: -140px; right: 5%;
                    animation: blobFloat2 10s ease-in-out infinite;
                }
                .au-blob-3 {
                    width: 220px; height: 220px;
                    background: radial-gradient(circle, #34d399, #10b981);
                    bottom: -160px; right: 30%;
                    animation: blobFloat1 12s ease-in-out infinite reverse;
                }
                @keyframes blobFloat1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(30px, -20px) scale(1.08); }
                }
                @keyframes blobFloat2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-20px, 15px) scale(1.05); }
                }
                .au-hero-inner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 4px;
                }
                .au-hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255,255,255,0.10);
                    border: 1px solid rgba(255,255,255,0.18);
                    backdrop-filter: blur(6px);
                    border-radius: 30px;
                    padding: 3px 12px;
                    font-size: 11px;
                    font-weight: 600;
                    color: #bfdbfe;
                    letter-spacing: 0.3px;
                    margin-bottom: 2px;
                }
                .au-badge-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #34d399;
                    display: inline-block;
                    box-shadow: 0 0 0 3px rgba(52,211,153,0.3);
                    animation: pulseDot 2s ease-in-out infinite;
                }
                @keyframes pulseDot {
                    0%, 100% { box-shadow: 0 0 0 3px rgba(52,211,153,0.3); }
                    50% { box-shadow: 0 0 0 6px rgba(52,211,153,0.1); }
                }
                .au-hero-title {
                    color: #f8fafc;
                    font-size: 22px;
                    font-weight: 800;
                    margin: 0;
                    line-height: 1.2;
                    letter-spacing: -0.3px;
                    text-shadow: 0 2px 20px rgba(0,0,0,0.3);
                }
                .au-hero-title-accent {
                    background: linear-gradient(90deg, #60a5fa, #818cf8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .au-hero-subtitle {
                    color: #93c5fd;
                    font-size: 13px;
                    font-weight: 400;
                    margin: 0;
                    max-width: 480px;
                    line-height: 1.5;
                    opacity: 0.9;
                }
                @media (max-width: 480px) {
                    .au-hero-title { font-size: 18px; }
                    .au-hero-subtitle { font-size: 12px; }
                    .au-hero { padding: 12px 0; }
                }

                /* ===== MAIN ===== */
                .au-main-container {
                    padding-top: 28px;
                    padding-bottom: 60px;
                    max-width: 1100px !important;
                }

                /* ===== SEARCH CARD ===== */
                .au-search-card {
                    background: #ffffff;
                    border-radius: 16px;
                    padding: 24px 28px;
                    margin-bottom: 32px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                }
                .au-search-row {
                    display: flex;
                    align-items: flex-end;
                    gap: 16px;
                }
                .au-search-input-wrap {
                    flex: 1;
                }
                .au-search-label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    color: #475569;
                    margin-bottom: 8px;
                }
                .au-input-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .au-input-icon {
                    position: absolute;
                    left: 14px;
                    color: #3b82f6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(59,130,246,0.08);
                }
                .au-input {
                    width: 100%;
                    height: 48px;
                    padding: 0 16px 0 54px;
                    border: 1.5px solid #cbd5e1;
                    border-radius: 12px;
                    font-size: 15px;
                    color: #1e293b;
                    background: #ffffff;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .au-input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
                }
                .au-input::placeholder { color: #94a3b8; }

                .au-search-btn {
                    height: 48px;
                    padding: 0 28px;
                    border: none;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    color: #fff;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    white-space: nowrap;
                    transition: opacity 0.2s, transform 0.15s;
                    box-shadow: 0 2px 8px rgba(37,99,235,0.25);
                }
                .au-search-btn:hover:not(:disabled) {
                    opacity: 0.92;
                    transform: translateY(-1px);
                }
                .au-search-btn:disabled {
                    background: #94a3b8;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .au-error {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 14px;
                    padding: 10px 14px;
                    border-radius: 10px;
                    background: #fef2f2;
                    color: #dc2626;
                    font-size: 13px;
                    font-weight: 500;
                    border: 1px solid #fecaca;
                }

                /* ===== EMPTY STATE ===== */
                .au-empty-state {
                    text-align: center;
                    padding: 56px 24px;
                    background: #fff;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    margin-bottom: 24px;
                }
                .au-empty-state svg {
                    color: #cbd5e1;
                    margin-bottom: 16px;
                }
                .au-empty-state h3 {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 8px;
                }
                .au-empty-state p {
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.65;
                    max-width: 420px;
                    margin: 0 auto;
                }

                /* ===== RESULTS HEADER ===== */
                .au-results {
                    animation: au-fade-in 0.35s ease-out;
                }
                .au-results-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                .au-results-title {
                    font-size: 19px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                    padding-left: 14px;
                    border-left: 4px solid #2563eb;
                }
                .au-results-actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .au-refresh-btn {
                    width: 36px;
                    height: 36px;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    background: #fff;
                    color: #2563eb;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
                }
                .au-refresh-btn:hover:not(:disabled) {
                    background: #eff6ff;
                    border-color: #bfdbfe;
                }
                .au-count-badge {
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    color: #fff;
                    font-size: 13px;
                    font-weight: 700;
                    padding: 6px 16px;
                    border-radius: 20px;
                }

                /* ===== ANIMATIONS ===== */
                .au-spin {
                    animation: au-spin-anim 1s linear infinite;
                }
                @keyframes au-spin-anim {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes au-fade-in {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 640px) {
                    .au-header { padding: 14px 0; }
                    .au-header-title { font-size: 18px; }
                    .au-header-subtitle { font-size: 12px; }
                    .au-search-card { padding: 18px 16px; }
                    .au-search-row {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .au-search-btn {
                        width: 100%;
                        justify-content: center;
                    }
                    .au-main-container { padding-top: 20px; }
                    .au-results-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }
                    
                    /* Custom stacking rules for table-like look inside card on mobile */
                    .au-apply-item table tr {
                        display: flex;
                        flex-direction: column;
                        border-bottom: 1.5px solid #e2e8f0;
                    }
                    .au-apply-item table tr td {
                        width: 100% !important;
                        border-right: none !important;
                    }
                }
            `}} />
        </>
    );
};

export default ApplyUpdates;
