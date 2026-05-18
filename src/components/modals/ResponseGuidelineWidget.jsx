import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

const ResponseGuidelineWidget = () => {
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [guidelines, setGuidelines] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [preference, setPreference] = useState(localStorage.getItem('response_guideline_preference') || '');

    useEffect(() => {
        if (role) {
            fetchGuidelines();
        }
    }, [role]);

    useEffect(() => {
        if (showModal) {
            const savedPref = localStorage.getItem('response_guideline_preference');
            if (savedPref) {
                setSearchQuery(savedPref);
            } else {
                setSearchQuery('');
            }
        }
    }, [showModal]);

    const handleSavePreference = () => {
        const query = searchQuery.trim();
        if (query) {
            localStorage.setItem('response_guideline_preference', query);
            setPreference(query);
        }
    };

    const handleClearPreference = () => {
        localStorage.removeItem('response_guideline_preference');
        setPreference('');
    };

    const fetchGuidelines = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/settings/response_guidelines`, {
                headers: { Authorization: token }
            });
            if (res.data && Array.isArray(res.data.value)) {
                setGuidelines(res.data.value);
            }
        } catch (error) {
            console.error('Error fetching response guidelines:', error);
        }
    };

    const handleCopy = (reply, id) => {
        navigator.clipboard.writeText(reply);
        setCopiedId(id);
        setTimeout(() => {
            setCopiedId(null);
        }, 1500);
    };

    const getTopicColorClass = (topic) => {
        if (!topic) return 'text-dark';
        const lowerTopic = topic.toLowerCase();
        if (lowerTopic.includes('refund')) return 'text-danger';
        if (lowerTopic.includes('payment')) return 'text-success';
        if (lowerTopic.includes('tuition') || lowerTopic.includes('apply')) return 'text-primary';
        return 'text-dark';
    };

    const filteredGuidelines = guidelines.filter(g => {
        const query = searchQuery.toLowerCase();
        return (g.topic || '').toLowerCase().includes(query) || (g.reply || '').toLowerCase().includes(query);
    });

    if (!role) return null;

    return (
        <>
            {/* Floating Conversation Helper Button */}
            <div 
                className="position-fixed floating-chat-button"
                style={{
                    bottom: '25px',
                    left: '25px',
                    zIndex: 2000,
                }}
            >
                <button
                    onClick={() => { setShowModal(true); fetchGuidelines(); }}
                    className="btn btn-primary d-flex align-items-center justify-content-center shadow-lg rounded-circle position-relative"
                    style={{
                        width: '46px',
                        height: '46px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        border: 'none',
                        transition: 'all 0.3s ease',
                    }}
                    title="রেসপন্স গাইডলাইন (Response Guidelines)"
                >
                    <i className="fas fa-comments fs-5 text-white"></i>
                </button>
            </div>

            {/* Guidelines Search & Quick Copy Modal */}
            <Modal 
                show={showModal} 
                onHide={() => { setShowModal(false); setSearchQuery(''); }}
                backdrop="true"
                dialogClassName="response-guidelines-modal"
                className="bangla-font response-guidelines-wrapper-modal"
            >
                <Modal.Header closeButton className="border-0 pb-0 pt-2" style={{ background: '#f8fafc' }}>
                    <Modal.Title className="fw-bold text-dark w-100 text-center font-sans m-0" style={{ fontSize: '1.35rem' }}>
                        💡 রেসপন্স হেল্পার (Response Helper)
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 py-3 d-flex flex-column" style={{ background: '#f8fafc', overflow: 'hidden' }}>
                    
                    {/* Search Field Wrapper */}
                    <div className="mb-2 position-relative">
                        <i className="fas fa-search position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.05rem' }}></i>
                        <input
                            type="text"
                            className="form-control rounded-pill bg-white shadow-sm border-0 font-sans"
                            style={{ 
                                paddingLeft: '40px', 
                                paddingRight: '20px', 
                                height: '44px', 
                                fontSize: '1.1rem',
                                outline: 'none'
                            }}
                            placeholder="টপিক বা কীওয়ার্ড দিয়ে সার্চ করুন..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Saved Preference Banner if active */}
                    {preference && (
                        <div 
                            className="d-flex align-items-center mb-2 px-3 py-1 rounded-3 text-warning-emphasis font-sans border border-warning-subtle" 
                            style={{ 
                                fontSize: '0.85rem', 
                                gap: '8px',
                                background: '#fffbeb'
                            }}
                        >
                            <i className="fas fa-star text-warning" style={{ fontSize: '0.9rem' }}></i>
                            <span>আপনার সেভ করা প্রেফারেন্সগুলা: <strong>"{preference}"</strong></span>
                            {searchQuery !== preference && (
                                <button 
                                    onClick={() => setSearchQuery(preference)} 
                                    className="btn btn-sm btn-warning text-dark rounded-pill py-0 px-2.5 ms-auto fw-bold"
                                    style={{ fontSize: '0.75rem', height: '22px', display: 'flex', alignItems: 'center' }}
                                >
                                    Apply
                                </button>
                            )}
                            <button 
                                onClick={handleClearPreference} 
                                className={`btn btn-sm btn-link text-danger fw-bold text-decoration-none ${searchQuery === preference ? 'ms-auto' : ''}`}
                                style={{ fontSize: '0.8rem', padding: 0 }}
                            >
                                Clear
                            </button>
                        </div>
                    )}

                    {/* Interactive suggestions pills & Save Preference Button */}
                    <div className="d-flex flex-wrap gap-2 align-items-center mb-2 px-1">
                        <span className="text-secondary extra-small fw-bold font-sans me-1">
                            <i className="fas fa-magic me-1"></i> কুইক সার্চ (Quick Search):
                        </span>
                        {[
                            { label: 'refund', query: 'refund' },
                            { label: 'payment', query: 'payment' },
                            { label: 'tuition', query: 'tuition' },
                            { label: 'tuition apply', query: 'tuition apply' }
                        ].map((sug, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSearchQuery(sug.query)}
                                className={`btn btn-sm rounded-pill px-3 py-1 font-sans fw-semibold transition-all border ${searchQuery === sug.query ? 'btn-success text-white border-success' : 'btn-outline-success bg-success-subtle border-success-subtle text-success'}`}
                                style={{ fontSize: '0.85rem' }}
                            >
                                {sug.label}
                            </button>
                        ))}
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="btn btn-sm btn-link text-secondary font-sans text-decoration-none extra-small fw-bold"
                            >
                                <i className="fas fa-times-circle me-1"></i> Clear
                            </button>
                        )}

                        {/* Save Current Search as Preference Button placed elegantly at the end of the row */}
                        {searchQuery.trim() && searchQuery.trim() !== preference && (
                            <button
                                onClick={handleSavePreference}
                                className="btn btn-warning text-dark rounded-pill fw-bold px-3 py-1 shadow-sm d-flex align-items-center justify-content-center border-0 font-sans ms-auto"
                                style={{ 
                                    fontSize: '0.8rem',
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap'
                                }}
                                title="এটিকে ডিফল্ট সার্চ হিসেবে সেভ করুন"
                            >
                                <i className="fas fa-save me-1"></i> Save Preference
                            </button>
                        )}
                    </div>

                    {/* Guidelines List Container - Flex scroll */}
                    <div className="flex-grow-1" style={{ overflowY: 'auto', borderRadius: '12px' }}>
                        <table className="table table-hover align-middle mb-0 bg-white shadow-sm rounded-3 overflow-hidden">
                            <thead className="table-light">
                                <tr className="font-sans" style={{ fontSize: '0.9rem' }}>
                                    <th className="py-2 ps-3 text-secondary" style={{ width: '35%' }}>যদি জিজ্ঞেস করে (If Asked)</th>
                                    <th className="py-2 text-secondary" style={{ width: '45%' }}>উত্তর দিন (Say This)</th>
                                    <th className="py-2 text-end pe-3 text-secondary" style={{ width: '20%' }}>অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGuidelines.length > 0 ? (
                                    filteredGuidelines.map((item, idx) => (
                                        <tr key={idx} className="hover-lift">
                                            {/* Topic Column with custom dynamic colors */}
                                            <td 
                                                className={`fw-bold ps-3 py-3 ${getTopicColorClass(item.topic)}`}
                                                style={{ 
                                                    borderLeft: '5px solid #f59e0b',
                                                    fontSize: '1.25rem',
                                                    lineHeight: '1.4'
                                                }}
                                            >
                                                {item.topic}
                                            </td>
                                            {/* Say This Column */}
                                            <td 
                                                className="text-secondary py-3"
                                                style={{ 
                                                    fontSize: '1.2rem',
                                                    lineHeight: '1.5',
                                                    whiteSpace: 'pre-line'
                                                }}
                                            >
                                                {item.reply}
                                            </td>
                                            {/* Action Column */}
                                            <td className="text-end pe-3 py-3">
                                                <button
                                                    onClick={() => handleCopy(item.reply, idx)}
                                                    className={`btn btn-md rounded-pill px-4 py-2 font-sans fw-bold transition-all shadow-sm ${copiedId === idx ? 'btn-success text-white border-success' : 'btn-outline-warning border-warning text-warning hover-bg-warning hover-text-white'}`}
                                                    style={{ fontSize: '1.05rem', minWidth: '110px' }}
                                                >
                                                    {copiedId === idx ? (
                                                        <>
                                                            <i className="fas fa-check me-1"></i> Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="far fa-copy me-1"></i> Copy
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center text-muted py-5 font-sans" style={{ fontSize: '1.1rem' }}>
                                            <i className="fas fa-search me-2"></i> কোনো গাইডলাইন পাওয়া যায়নি!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-2 pb-4 px-3 justify-content-center" style={{ background: '#f8fafc' }}>
                    <button 
                        onClick={() => { setShowModal(false); setSearchQuery(''); }}
                        className="btn btn-close-guidelines rounded-pill py-3 fw-bold font-sans w-100"
                        style={{ fontSize: '1.25rem' }}
                    >
                        <i className="fas fa-times-circle me-2"></i> বন্ধ করুন (Close)
                    </button>
                </Modal.Footer>
            </Modal>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
                
                .bangla-font,
                .bangla-font *:not(.fas) {
                    font-family: 'Hind Siliguri', sans-serif !important;
                }
                .font-sans {
                    font-family: inherit !important;
                }
                
                .hover-bg-warning:hover {
                    background-color: #f59e0b !important;
                    color: white !important;
                }
                .hover-text-white:hover {
                    color: white !important;
                }
                .btn-close-guidelines {
                    background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%) !important;
                    border: none !important;
                    color: white !important;
                    box-shadow: 0 4px 12px rgba(225, 29, 72, 0.2) !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                .btn-close-guidelines:hover {
                    transform: scale(1.02) translateY(-1px) !important;
                    box-shadow: 0 8px 24px rgba(225, 29, 72, 0.45) !important;
                }
                .btn-close-guidelines:active {
                    transform: scale(0.98) translateY(0) !important;
                }
                .extra-small {
                    font-size: 0.75rem;
                }
                .floating-chat-button button {
                    animation: floatEntrance 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), floatPulse 2.5s infinite;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                .floating-chat-button button:hover {
                    transform: scale(1.15) rotate(10deg) translateY(-2px);
                    box-shadow: 0 12px 24px rgba(217, 119, 6, 0.4) !important;
                }
                .floating-chat-button button i {
                    transition: transform 0.3s ease;
                }
                .floating-chat-button button:hover i {
                    transform: scale(1.1);
                }
                @keyframes floatEntrance {
                    0% { transform: scale(0) rotate(-45deg); opacity: 0; }
                    100% { transform: scale(1) rotate(0); opacity: 1; }
                }
                @keyframes floatPulse {
                    0% {
                        box-shadow: 0 4px 10px rgba(217, 119, 6, 0.25);
                    }
                    50% {
                        box-shadow: 0 8px 24px rgba(217, 119, 6, 0.55), 0 0 0 10px rgba(217, 119, 6, 0.15);
                    }
                    100% {
                        box-shadow: 0 4px 10px rgba(217, 119, 6, 0.25);
                    }
                }
                .hover-lift {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .hover-lift:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.05) !important;
                }
                
                /* Strict 10px gap from all 4 sides */
                .response-guidelines-wrapper-modal {
                    padding: 0 !important;
                    overflow: hidden !important;
                }
                .response-guidelines-wrapper-modal .modal-dialog.response-guidelines-modal {
                    position: fixed !important;
                    top: 10px !important;
                    bottom: 10px !important;
                    left: 10px !important;
                    right: 10px !important;
                    margin: 0 !important;
                    max-width: none !important;
                    width: auto !important;
                    height: auto !important;
                    display: flex !important;
                }
                .response-guidelines-modal .modal-content {
                    height: 100% !important;
                    width: 100% !important;
                    display: flex !important;
                    flex-direction: column !important;
                    border: none !important;
                    border-radius: 16px !important;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.2) !important;
                    overflow: hidden !important;
                }
            `}</style>
        </>
    );
};

export default ResponseGuidelineWidget;
