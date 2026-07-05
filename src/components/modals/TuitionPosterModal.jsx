import React, { useState, useRef } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import { FaDownload, FaTimes, FaGlobe, FaPhoneAlt, FaGooglePlay } from 'react-icons/fa';

const LOGO = '/img/TSF LOGO TRANSPARENT.png';

const LogoBlock = ({ invert = false }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={LOGO} alt="TSF" style={{ height: '28px', objectFit: 'contain', filter: invert ? 'brightness(0) invert(1)' : 'none' }} onError={e => e.target.style.display = 'none'} />
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '13px', color: invert ? '#fff' : '#1e3a8a', lineHeight: 1.2 }}>
            <div>Tuition Seba</div>
            <div style={{ opacity: 0.7, fontSize: '10px', letterSpacing: '0.5px' }}>Forum</div>
        </div>
    </div>
);

// ══════════════════════════════════════════════════
// TEMPLATE 1: MODERN LIGHT
// ══════════════════════════════════════════════════
const ModernLightTemplate = ({ tuition }) => {
    const formattedSalary = tuition.salary && /taka|tk/i.test(tuition.salary.toString())
        ? tuition.salary
        : (tuition.salary ? `${tuition.salary.toString().trim()} taka` : 'Negotiable');

    return (
        <div style={{
            width: 600,
            height: 820,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Hind Siliguri', 'Poppins', sans-serif",
            color: '#1e293b',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            border: '12px solid #f1f5f9'
        }}>
            <div style={{ height: '5px', width: '100%', background: 'linear-gradient(90deg, #1e3a8a, #3b82f6, #10b981)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px 10px 28px' }}>
                <LogoBlock />
                <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', borderRadius: '30px', padding: '5px 16px', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', color: '#fff', textTransform: 'uppercase' }}>TUTOR WANTED</div>
            </div>
            <div style={{ padding: '0 28px', margin: '5px 0' }}>
                <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)', border: '1.5px dashed #cbd5e1', borderRadius: '16px', padding: '12px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, marginBottom: '2px' }}>TUITION CODE</div>
                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#1e3a8a', letterSpacing: '1px', lineHeight: 1 }}>{tuition.tuitionCode}</div>
                </div>
            </div>
            <div style={{ padding: '0 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Wanted Teacher / শিক্ষক আবশ্যক</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{tuition.wantedTeacher || 'Any'}</div>
                    </div>
                    <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Students / শিক্ষার্থী</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{tuition.student || 'N/A'}</div>
                    </div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Institute / প্রতিষ্ঠান</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{tuition.institute || 'Not specified'}</div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Class / শ্রেণী</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{tuition.class || 'N/A'}</div>
                    </div>
                    <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Medium / মাধ্যম</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{tuition.medium || 'N/A'}</div>
                    </div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Subject / বিষয়</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#2563eb' }}>{tuition.subject || 'N/A'}</div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Weekly / দিন</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{tuition.day ? `${tuition.day} days` : 'N/A'}</div>
                    </div>
                    <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Timing / সময়</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{(!tuition.time || tuition.time === 'undefined') ? 'Negotiable' : tuition.time}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#059669', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Salary / বেতন</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#059669' }}>{formattedSalary}</div>
                    </div>
                    <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Joining / শুরু</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{tuition.joining || 'N/A'}</div>
                    </div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Location / এলাকা</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{tuition.location}{tuition.area ? `, ${tuition.area}` : ''}</div>
                </div>
            </div>
            <div style={{ padding: '16px 28px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '11px', fontWeight: 800, color: '#1e3a8a' }}>
                    <span>🌐 Website: www.tuitionseba.com</span>
                    <span>🤖 App: Search "Tuition Seba Forum" in Play Store</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '11px', fontWeight: 800, color: '#1e3a8a', marginTop: '2px' }}>
                    <span>🔑 Job ID: {tuition.tuitionCode}</span>
                    <span>☎ Helpline: 09613 441122</span>
                </div>
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════
// TEMPLATE 2: DARK NEON
// ══════════════════════════════════════════════════
const DarkNeonTemplate = ({ tuition }) => {
    const formattedSalary = tuition.salary && /taka|tk/i.test(tuition.salary.toString())
        ? tuition.salary
        : (tuition.salary ? `${tuition.salary.toString().trim()} taka` : 'Negotiable');

    return (
        <div style={{
            width: 600,
            height: 820,
            background: 'linear-gradient(135deg, #090d16 0%, #111827 100%)',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Hind Siliguri', 'Poppins', sans-serif",
            color: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            border: '12px solid #1e293b'
        }}>
            <div style={{ height: '5px', width: '100%', background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px 10px 28px' }}>
                <LogoBlock invert />
                <div style={{ background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)', borderRadius: '30px', padding: '5px 16px', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', color: '#fff', textTransform: 'uppercase' }}>TUTOR WANTED</div>
            </div>
            <div style={{ padding: '0 28px', margin: '5px 0' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1.5px dashed rgba(139, 92, 246, 0.4)', borderRadius: '16px', padding: '12px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, marginBottom: '2px' }}>TUITION CODE</div>
                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '1px', lineHeight: 1 }}>{tuition.tuitionCode}</div>
                </div>
            </div>
            <div style={{ padding: '0 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Wanted Teacher / শিক্ষক আবশ্যক</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{tuition.wantedTeacher || 'Any'}</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Students / শিক্ষার্থী</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{tuition.student || 'N/A'}</div>
                    </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 12px' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Institute / প্রতিষ্ঠান</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{tuition.institute || 'Not specified'}</div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Class / শ্রেণী</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{tuition.class || 'N/A'}</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Medium / মাধ্যম</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{tuition.medium || 'N/A'}</div>
                    </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 12px' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Subject / বিষয়</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#38bdf8' }}>{tuition.subject || 'N/A'}</div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Weekly / দিন</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{tuition.day ? `${tuition.day} days` : 'N/A'}</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Timing / সময়</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{(!tuition.time || tuition.time === 'undefined') ? 'Negotiable' : tuition.time}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, background: 'rgba(236, 72, 153, 0.05)', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#f472b6', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Salary / বেতন</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#f472b6' }}>{formattedSalary}</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Joining / শুরু</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{tuition.joining || 'N/A'}</div>
                    </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 12px' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>Location / এলাকা</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{tuition.location}{tuition.area ? `, ${tuition.area}` : ''}</div>
                </div>
            </div>
            <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>
                    <span>🌐 Website: www.tuitionseba.com</span>
                    <span>🤖 App: Search "Tuition Seba Forum" in Play Store</span>
                </div>
                <div style={{ height: '1px', width: '100%', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>
                    <span>🔑 Job ID: {tuition.tuitionCode}</span>
                    <span>☎ Helpline: 09613 441122</span>
                </div>
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════
// TEMPLATE 3: VINTAGE EYE-CATCHY
// ══════════════════════════════════════════════════
const VintageTemplate = ({ tuition }) => {
    const formattedSalary = tuition.salary && /taka|tk/i.test(tuition.salary.toString())
        ? tuition.salary
        : (tuition.salary ? `${tuition.salary.toString().trim()} taka` : 'Negotiable');

    return (
        <div style={{
            width: 600,
            height: 820,
            background: '#fbf6ed',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Hind Siliguri', Georgia, serif",
            color: '#2d2218',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            border: '14px double #8c6d4f',
            padding: '4px'
        }}>
            <div style={{ border: '1px solid #cbd5e1', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #8c6d4f', paddingBottom: '12px' }}>
                    <LogoBlock />
                    <div style={{ border: '1.5px solid #8c6d4f', padding: '3px 12px', fontSize: '11px', fontWeight: 800, color: '#8c6d4f', letterSpacing: '2px', textTransform: 'uppercase' }}>TUTOR WANTED</div>
                </div>

                {/* Job Code Highlight */}
                <div style={{ textAlign: 'center', margin: '12px 0' }}>
                    <div style={{ fontSize: '10px', color: '#8c6d4f', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 700, marginBottom: '2px' }}>TUITION CODE</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2d2218', letterSpacing: '1px', fontFamily: 'Georgia, serif' }}>{tuition.tuitionCode}</div>
                    <div style={{ height: '3px', width: '80px', borderTop: '1px solid #8c6d4f', borderBottom: '1px solid #8c6d4f', margin: '6px auto 0' }} />
                </div>

                {/* Grid for Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, background: '#fefcf8', border: '1px solid #dcd1be', padding: '8px 10px' }}>
                            <div style={{ fontSize: '9px', color: '#8c6d4f', fontWeight: 800, textTransform: 'uppercase' }}>Wanted Teacher / শিক্ষক আবশ্যক</div>
                            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{tuition.wantedTeacher || 'Any'}</div>
                        </div>
                        <div style={{ flex: 1, background: '#fefcf8', border: '1px solid #dcd1be', padding: '8px 10px' }}>
                            <div style={{ fontSize: '9px', color: '#8c6d4f', fontWeight: 800, textTransform: 'uppercase' }}>Students / শিক্ষার্থী</div>
                            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{tuition.student || 'N/A'}</div>
                        </div>
                    </div>

                    <div style={{ background: '#fefcf8', border: '1px solid #dcd1be', padding: '8px 10px' }}>
                        <div style={{ fontSize: '9px', color: '#8c6d4f', fontWeight: 800, textTransform: 'uppercase' }}>Institute / প্রতিষ্ঠান</div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{tuition.institute || 'Not specified'}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, background: '#fefcf8', border: '1px solid #dcd1be', padding: '8px 10px' }}>
                            <div style={{ fontSize: '9px', color: '#8c6d4f', fontWeight: 800, textTransform: 'uppercase' }}>Class / শ্রেণী</div>
                            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{tuition.class || 'N/A'}</div>
                        </div>
                        <div style={{ flex: 1, background: '#fefcf8', border: '1px solid #dcd1be', padding: '8px 10px' }}>
                            <div style={{ fontSize: '9px', color: '#8c6d4f', fontWeight: 800, textTransform: 'uppercase' }}>Medium / মাধ্যম</div>
                            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{tuition.medium || 'N/A'}</div>
                        </div>
                    </div>

                    <div style={{ background: '#fefcf8', border: '1px solid #dcd1be', padding: '8px 10px' }}>
                        <div style={{ fontSize: '9px', color: '#8c6d4f', fontWeight: 800, textTransform: 'uppercase' }}>Subject / বিষয়</div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#8c6d4f' }}>{tuition.subject || 'N/A'}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, background: '#fefcf8', border: '1px solid #dcd1be', padding: '8px 10px' }}>
                            <div style={{ fontSize: '9px', color: '#8c6d4f', fontWeight: 800, textTransform: 'uppercase' }}>Weekly / দিন</div>
                            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{tuition.day ? `${tuition.day} days` : 'N/A'}</div>
                        </div>
                        <div style={{ flex: 1, background: '#fefcf8', border: '1px solid #dcd1be', padding: '8px 10px' }}>
                            <div style={{ fontSize: '9px', color: '#8c6d4f', fontWeight: 800, textTransform: 'uppercase' }}>Timing / সময়</div>
                            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{(!tuition.time || tuition.time === 'undefined') ? 'Negotiable' : tuition.time}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, background: '#f8f1e5', border: '1.5px solid #8c6d4f', padding: '8px 10px' }}>
                            <div style={{ fontSize: '9px', color: '#8c6d4f', fontWeight: 800, textTransform: 'uppercase' }}>Salary / বেতন</div>
                            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#5c4033' }}>{formattedSalary}</div>
                        </div>
                        <div style={{ flex: 1, background: '#fefcf8', border: '1px solid #dcd1be', padding: '8px 10px' }}>
                            <div style={{ fontSize: '9px', color: '#8c6d4f', fontWeight: 800, textTransform: 'uppercase' }}>Joining / শুরু</div>
                            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{tuition.joining || 'N/A'}</div>
                        </div>
                    </div>

                    <div style={{ background: '#fefcf8', border: '1px solid #dcd1be', padding: '8px 10px' }}>
                        <div style={{ fontSize: '9px', color: '#8c6d4f', fontWeight: 800, textTransform: 'uppercase' }}>Location / এলাকা</div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{tuition.location}{tuition.area ? `, ${tuition.area}` : ''}</div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ borderTop: '2px solid #8c6d4f', paddingTop: '10px', marginTop: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2d2218', fontStyle: 'italic' }}>
                        🌐 Apply via Website: www.tuitionseba.com
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2d2218', fontStyle: 'italic' }}>
                        📱 App: Search "Tuition Seba Forum" in Play Store
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#8c6d4f', marginTop: '3px' }}>
                        ☎ Helpline: 09613 441122
                    </div>
                </div>
            </div>
        </div>
    );
};

const TuitionPosterModal = ({ show, onHide, tuition }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('modern'); // 'modern' | 'dark' | 'vintage'
    const [downloading, setDownloading] = useState(false);
    const downloadRef = useRef(null);

    const handleDownload = async () => {
        if (!downloadRef.current || !tuition) return;
        setDownloading(true);
        try {
            await document.fonts.ready;
            const canvas = await html2canvas(downloadRef.current, {
                scale: 3,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false
            });
            const a = document.createElement('a');
            a.download = `tsf-tuition-${tuition.tuitionCode}-${selectedTemplate}-${Date.now()}.png`;
            a.href = canvas.toDataURL('image/png', 1.0);
            a.click();
            toast.success('✅ Poster downloaded successfully!');
        } catch (err) {
            console.error(err);
            toast.error('Download failed');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="md">
            <Modal.Header closeButton className="bg-white border-bottom">
                <Modal.Title className="fs-6 fw-bold text-dark">Tuition Poster Generator</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light p-4 d-flex flex-column align-items-center">

                {/* Design Template Selector */}
                <div className="d-flex gap-2 mb-4 w-100 justify-content-center">
                    <Button
                        variant={selectedTemplate === 'modern' ? 'primary' : 'outline-primary'}
                        size="sm"
                        onClick={() => setSelectedTemplate('modern')}
                        className="rounded-pill px-3"
                    >
                        Modern Light
                    </Button>
                    <Button
                        variant={selectedTemplate === 'dark' ? 'dark' : 'outline-dark'}
                        size="sm"
                        onClick={() => setSelectedTemplate('dark')}
                        className="rounded-pill px-3"
                    >
                        Dark Neon
                    </Button>
                    <Button
                        variant={selectedTemplate === 'vintage' ? 'warning' : 'outline-warning'}
                        size="sm"
                        onClick={() => setSelectedTemplate('vintage')}
                        className="rounded-pill px-3 text-dark"
                    >
                        Vintage Eye-catchy
                    </Button>
                </div>

                {/* Poster Preview */}
                <div style={{
                    boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transform: 'scale(0.8)',
                    transformOrigin: 'top center',
                    height: 656, // Matches scaled height of 820 (0.8 * 820)
                    marginBottom: '10px'
                }}>
                    {selectedTemplate === 'modern' && <ModernLightTemplate tuition={tuition} />}
                    {selectedTemplate === 'dark' && <DarkNeonTemplate tuition={tuition} />}
                    {selectedTemplate === 'vintage' && <VintageTemplate tuition={tuition} />}
                </div>

                {/* Off-screen high-res container */}
                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                    <div ref={downloadRef}>
                        {selectedTemplate === 'modern' && <ModernLightTemplate tuition={tuition} />}
                        {selectedTemplate === 'dark' && <DarkNeonTemplate tuition={tuition} />}
                        {selectedTemplate === 'vintage' && <VintageTemplate tuition={tuition} />}
                    </div>
                </div>

                <div className="w-100 d-flex justify-content-center gap-3 mt-3">
                    <Button
                        variant="secondary"
                        onClick={onHide}
                        className="d-flex align-items-center gap-2"
                        disabled={downloading}
                    >
                        <FaTimes /> Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleDownload}
                        className="d-flex align-items-center gap-2"
                        disabled={downloading}
                    >
                        {downloading ? (
                            <>
                                <Spinner animation="border" size="sm" /> Generating...
                            </>
                        ) : (
                            <>
                                <FaDownload /> Download Poster
                            </>
                        )}
                    </Button>
                </div>
            </Modal.Body>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Hind+Siliguri:wght@400;600;700&display=swap');`}</style>
        </Modal>
    );
};

export default TuitionPosterModal;
