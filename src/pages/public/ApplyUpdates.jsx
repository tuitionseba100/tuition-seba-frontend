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

    const getStatusTextBangla = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
            case 'confirmed':
            case 'selected':
                return 'অনুমোদিত';
            case 'pending':
                return 'রিভিউ চলছে';
            case 'rejected':
            case 'cancel':
            case 'cancelled':
            case 'cancelled by guardian':
            case 'cancelled by teacher':
                return 'বাতিল করা হয়েছে';
            default:
                return status;
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
                
                {/* Compact Premium Header */}
                <div className="au-header">
                    <Container>
                        <div className="au-header-inner">
                            <h1 className="au-header-title">আবেদনের স্ট্যাটাস</h1>
                            <p className="au-header-subtitle">রিয়েল-টাইমে আপনার টিউশন আবেদনের আপডেট ট্র্যাক করুন</p>
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

                            {/* Premium Table */}
                            <div className="au-table-wrap">
                                <table className="au-table">
                                    <thead>
                                        <tr>
                                            <th className="au-th au-th-sl">SL</th>
                                            <th className="au-th au-th-info">টিউশন ডিটেইলস</th>
                                            <th className="au-th au-th-status">বর্তমান অবস্থা</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tuitionData.slice().reverse().map((item, index) => {
                                            const { date, time } = formatDate(item.appliedAt);
                                            const statusColor = getStatusColor(item.status);
                                            const statusBg = getStatusBgColor(item.status);
                                            const rowBg = getRowBgColor(item.status);

                                            return (
                                                <React.Fragment key={index}>
                                                    <tr className="au-row" style={{ backgroundColor: rowBg }}>
                                                        <td className="au-td au-td-sl">
                                                            <span className="au-sl-badge">{index + 1}</span>
                                                        </td>
                                                        <td className="au-td au-td-info">
                                                             <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                                                 <span className="au-code">
                                                                     <span className="au-code-label">টিউশন কোড:</span> {item.tuitionCode}
                                                                 </span>
                                                                 <button 
                                                                     type="button" 
                                                                     onClick={() => handleShowDetails(item.tuitionCode)}
                                                                     className="au-info-btn"
                                                                     title="টিউশন ডিটেইলস দেখুন"
                                                                     style={{
                                                                         display: 'inline-flex',
                                                                         alignItems: 'center',
                                                                         gap: '4px',
                                                                         background: 'rgba(59, 130, 246, 0.08)',
                                                                         border: '1px solid rgba(59, 130, 246, 0.2)',
                                                                         color: '#2563eb',
                                                                         borderRadius: '6px',
                                                                         padding: '2px 8px',
                                                                         fontSize: '11px',
                                                                         fontWeight: 600,
                                                                         cursor: 'pointer',
                                                                         marginLeft: '10px',
                                                                         transition: 'all 0.2s',
                                                                         fontFamily: BANGLA_FONT
                                                                     }}
                                                                 >
                                                                     <FiInfo size={13} style={{ marginRight: '3px' }} />
                                                                     <span>বিস্তারিত</span>
                                                                 </button>
                                                                 {item.serialNumber && (
                                                                     <span className="au-serial-tag" style={{
                                                                         display: 'inline-flex',
                                                                         alignItems: 'center',
                                                                         background: '#f1f5f9',
                                                                         color: '#475569',
                                                                         fontSize: '11px',
                                                                         padding: '2px 8px',
                                                                         borderImage: 'none',
                                                                         borderRadius: '6px',
                                                                         fontWeight: 500,
                                                                         border: '1px solid #e2e8f0',
                                                                         fontFamily: BANGLA_FONT
                                                                     }}>
                                                                         আবেদন সিরিয়াল: <strong style={{ color: '#2563eb', marginLeft: '3px' }}>#{item.serialNumber}</strong> / {item.totalApplies}
                                                                     </span>
                                                                 )}
                                                             </div>
                                                            <span className="au-date">
                                                                <FiClock size={11} />
                                                                আবেদনের সময়: {date}, {time}
                                                            </span>
                                                        </td>
                                                        <td className="au-td au-td-status">
                                                            <span
                                                                className="au-status-pill"
                                                                style={{
                                                                    color: statusColor,
                                                                    backgroundColor: statusBg,
                                                                    borderColor: statusColor + '30'
                                                                }}
                                                            >
                                                                {getStatusIcon(item.status)}
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    {/* Comment row */}
                                                    <tr className="au-comment-row" style={{ backgroundColor: rowBg }}>
                                                        <td colSpan={3} className="au-td-comment">
                                                            {item.commentForTeacher ? (
                                                                <div className="au-comment-box au-comment-agent">
                                                                    <div className="au-comment-label">
                                                                        <FiMessageSquare size={13} />
                                                                        <span>TSF এজেন্টের মন্তব্য :</span>
                                                                    </div>
                                                                    <div className="au-comment-text">{item.commentForTeacher}</div>
                                                                </div>
                                                            ) : item.status.toLowerCase() === 'pending' ? (
                                                                <div className="au-comment-box au-comment-pending">
                                                                    <div className="au-comment-label au-label-pending">
                                                                        <FiAlertCircle size={13} />
                                                                        <span>সিস্টেম নোটিফিকেশন :</span>
                                                                    </div>
                                                                    <div className="au-comment-text au-text-pending">
                                                                        আপনার আবেদনটি বর্তমানে রিভিউ চলছে। অনুগ্রহ করে অপেক্ষা করুন।
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="au-comment-box au-comment-empty">
                                                                    <div className="au-comment-label au-label-muted">
                                                                        <FiMessageSquare size={12} />
                                                                        <span>TSF এজেন্টের মন্তব্য :</span>
                                                                    </div>
                                                                    <div className="au-comment-text au-text-muted-italic">কোনো মন্তব্য নেই</div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
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
                                
                                {selectedTuition.requirements && (
                                    <div className="detail-item-full mt-3" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                        <span className="detail-label" style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>অন্যান্য শর্তাবলী (Requirements):</span>
                                        <p className="detail-value-desc" style={{ fontSize: '13.5px', color: '#475569', background: '#f8fafc', borderRadius: '8px', padding: '10px 12px', margin: '4px 0 0 0', borderLeft: '3px solid #3b82f6' }}>{selectedTuition.requirements}</p>
                                    </div>
                                )}
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

                /* ===== COMPACT HEADER ===== */
                .au-header {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    padding: 18px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                }
                .au-header-inner {
                    text-align: center;
                }
                .au-header-title {
                    color: #f8fafc;
                    font-size: 22px;
                    font-weight: 700;
                    margin: 0 0 2px 0;
                    letter-spacing: -0.3px;
                }
                .au-header-subtitle {
                    color: #94a3b8;
                    font-size: 13px;
                    font-weight: 400;
                    margin: 0;
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

                /* ===== PREMIUM TABLE ===== */
                .au-table-wrap {
                    background: #ffffff;
                    border-radius: 14px;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.02);
                }
                .au-table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }
                .au-table thead {
                    background: #f8fafc;
                    border-bottom: 2px solid #e2e8f0;
                }
                .au-th {
                    padding: 12px 18px;
                    font-size: 11px;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    text-align: left;
                    white-space: nowrap;
                }
                .au-th-sl { width: 56px; text-align: center; }
                .au-th-info { }
                .au-th-status { width: 180px; text-align: right; padding-right: 24px; }

                .au-row {
                    transition: background-color 0.15s;
                }
                .au-row:hover {
                    filter: brightness(0.98);
                }
                .au-td {
                    padding: 14px 18px;
                    vertical-align: middle;
                }
                .au-td-sl {
                    text-align: center;
                    width: 56px;
                }
                .au-sl-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    border-radius: 8px;
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    font-size: 12px;
                    font-weight: 800;
                    color: #64748b;
                }
                .au-td-info {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                }
                .au-code {
                    font-size: 15px;
                    font-weight: 700;
                    color: #1e293b;
                    letter-spacing: 0.2px;
                }
                .au-code-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }
                .au-date {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 12px;
                    color: #94a3b8;
                    font-weight: 500;
                }
                .au-td-status {
                    text-align: right;
                    width: 180px;
                    padding-right: 24px;
                }
                .au-status-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 5px 14px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: capitalize;
                    border: 1px solid;
                    white-space: nowrap;
                }

                /* Comment Row */
                .au-comment-row td {
                    border-bottom: 1px dashed #e2e8f0;
                }
                .au-td-comment {
                    padding: 0 18px 14px 18px;
                }
                .au-comment-box {
                    padding: 10px 14px;
                    border-radius: 10px;
                    border-left: 4px solid;
                }
                .au-comment-agent {
                    background: #f8fafc;
                    border-color: #e2e8f0;
                    border-left-color: #64748b;
                }
                .au-comment-pending {
                    background: rgba(245,158,11,0.04);
                    border-color: rgba(245,158,11,0.12);
                    border-left-color: #d97706;
                }
                .au-comment-empty {
                    background: #f8fafc;
                    border-color: #e2e8f0;
                    border-left-color: #cbd5e1;
                }
                .au-comment-label {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    font-weight: 700;
                    color: #475569;
                    margin-bottom: 4px;
                }
                .au-label-pending { color: #d97706; }
                .au-label-muted { color: #94a3b8; }
                .au-comment-text {
                    font-size: 13px;
                    line-height: 1.6;
                    color: #334155;
                }
                .au-text-pending { color: #b45309; }
                .au-text-muted-italic {
                    color: #94a3b8;
                    font-style: italic;
                    font-size: 12px;
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

                    /* Mobile table: stack layout */
                    .au-table thead { display: none; }
                    .au-table, .au-table tbody, .au-table tr, .au-table td {
                        display: block;
                        width: 100%;
                    }
                    .au-row {
                        padding: 14px 16px 4px;
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        gap: 8px;
                        border-bottom: none;
                    }
                    .au-td { padding: 0; }
                    .au-td-sl {
                        width: auto;
                        text-align: left;
                    }
                    .au-td-info {
                        flex: 1;
                        min-width: 0;
                        flex-direction: row;
                        align-items: center;
                        gap: 6px;
                        flex-wrap: wrap;
                    }
                    .au-code { font-size: 14px; }
                    .au-td-status {
                        width: 100%;
                        text-align: left;
                        padding-right: 0;
                        margin-top: 4px;
                    }
                    .au-comment-row td {
                        padding: 6px 16px 16px;
                    }
                    .au-td-comment {
                        padding: 0;
                    }
                    .au-th-status { width: auto; }
                }
            `}} />
        </>
    );
};

export default ApplyUpdates;
