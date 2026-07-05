import React, { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';

const LOGO = '/img/TSF LOGO TRANSPARENT.png';

const LogoBlock = ({ size = 26, invert = false, color = '#1a1a1a' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src={LOGO} alt="TSF" style={{ height: `${size}px`, objectFit: 'contain', filter: invert ? 'brightness(0) invert(1)' : 'none' }} onError={e => e.target.style.display = 'none'} />
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '11px', color, lineHeight: 1.2 }}>
            <div>Tuition Seba</div>
            <div style={{ opacity: 0.65, fontSize: '9px', letterSpacing: '0.5px' }}>Forum</div>
        </div>
    </div>
);

/* ══════════════════════════════════════════════════
   GUARDIAN — 1: MIDNIGHT GOLD
   Dark charcoal, warm gold accent, clean editorial
══════════════════════════════════════════════════ */
const G1MidnightGold = ({ data }) => {
    const { headline, quote, name, location, stars, profileImage, accentColor = '#c8973a', helpline, tagline } = data;
    return (
        <div style={{ width: 600, height: 750, background: 'linear-gradient(160deg,#111827 0%,#1f2937 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${accentColor},transparent)` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px' }}>
                <LogoBlock invert color="#fff" />
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase' }}>অভিভাবক সমীক্ষা</div>
            </div>
            <div style={{ position: 'absolute', top: 55, left: 20, fontFamily: 'Georgia,serif', fontSize: 180, color: `${accentColor}14`, lineHeight: 1, pointerEvents: 'none' }}>"</div>
            <div style={{ padding: '4px 32px 20px', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
                <div style={{ width: 3, height: 28, background: accentColor, borderRadius: 2, flexShrink: 0 }} />
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff' }}>{headline}</h2>
            </div>
            <div style={{ padding: '0 36px', position: 'relative' }}>
                <p style={{ fontSize: 16.5, lineHeight: 1.88, color: 'rgba(255,255,255,0.78)', margin: 0, textAlign: 'justify' }}>{quote}</p>
            </div>
            <div style={{ margin: '28px 32px', height: 1, background: `linear-gradient(90deg,${accentColor}55,transparent)` }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '0 32px' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', border: `2px solid ${accentColor}66`, overflow: 'hidden', flexShrink: 0, background: `${accentColor}18` }}>
                    {profileImage ? <img src={profileImage} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontSize: 28, fontWeight: 700 }}>{name.charAt(0)}</div>}
                </div>
                <div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{location}</div>
                    <div style={{ display: 'flex', gap: 3 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 16, color: s <= stars ? accentColor : 'rgba(255,255,255,0.12)' }}>★</span>)}</div>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: 1 }}>{tagline}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: accentColor }}>☎ {helpline}</span>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   GUARDIAN — 2: LIGHT EDITORIAL
   Warm white, centered serif quote, elegant minimal
══════════════════════════════════════════════════ */
const G2LightEditorial = ({ data }) => {
    const { headline, quote, name, location, stars, profileImage, accentColor = '#b45309', helpline, tagline } = data;
    return (
        <div style={{ width: 600, height: 750, background: '#fafaf8', border: '1px solid #e8e3da', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif", boxSizing: 'border-box' }}>
            <div style={{ height: 4, background: accentColor }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px' }}>
                <LogoBlock color="#1a1a1a" />
                <div style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}40`, borderRadius: 20, padding: '4px 14px', fontSize: 10, color: accentColor, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Review</div>
            </div>
            <div style={{ textAlign: 'center', fontFamily: 'Georgia,serif', fontSize: 72, color: accentColor, lineHeight: 0.75, opacity: 0.22, margin: '4px 0' }}>"</div>
            <div style={{ padding: '12px 50px', textAlign: 'center' }}>
                <h2 style={{ margin: '0 0 18px', fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>{headline}</h2>
                <p style={{ fontSize: 16, lineHeight: 1.9, color: '#4a4540', margin: 0, fontStyle: 'italic', fontFamily: "'Hind Siliguri', Georgia, serif" }}>{quote}</p>
            </div>
            <div style={{ textAlign: 'center', fontFamily: 'Georgia,serif', fontSize: 72, color: accentColor, lineHeight: 0.75, opacity: 0.22, margin: '14px 0' }}>"</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 44px' }}>
                <div style={{ flex: 1, height: 1, background: '#e0dbd3' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor }} />
                <div style={{ flex: 1, height: 1, background: '#e0dbd3' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${accentColor}44`, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
                    {profileImage ? <img src={profileImage} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: `${accentColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontSize: 22, fontWeight: 700 }}>{name.charAt(0)}</div>}
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>{name}</div>
                    <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{location}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 5 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 14, color: s <= stars ? accentColor : '#ddd' }}>★</span>)}</div>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '13px 32px', borderTop: '1px solid #e0dbd3', display: 'flex', justifyContent: 'space-between', background: '#fff' }}>
                <span style={{ fontSize: 10, color: '#bbb', letterSpacing: 1 }}>{tagline}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>☎ {helpline}</span>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   GUARDIAN — 3: NAVY CARD
   Deep navy, frosted card, single accent
══════════════════════════════════════════════════ */
const G3NavyCard = ({ data }) => {
    const { headline, quote, name, location, stars, profileImage, accentColor = '#38bdf8', helpline, tagline } = data;
    return (
        <div style={{ width: 600, height: 750, background: 'linear-gradient(140deg,#0f2444 0%,#0d1d38 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 15%,rgba(255,255,255,0.03) 0%,transparent 55%)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '26px 32px' }}>
                <LogoBlock invert color="#fff" />
                <div style={{ width: 38, height: 38, borderRadius: '50%', border: `1px solid ${accentColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: accentColor, fontSize: 14 }}>✦</span>
                </div>
            </div>
            <div style={{ margin: '0 28px 0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px 28px 24px' }}>
                <div style={{ fontSize: 10, color: accentColor, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>{headline}</div>
                <p style={{ fontSize: 16.5, lineHeight: 1.88, color: 'rgba(255,255,255,0.82)', margin: 0 }}>{quote}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, margin: '24px 28px 0', padding: '20px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${accentColor}77`, flexShrink: 0 }}>
                    {profileImage ? <img src={profileImage} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: `${accentColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontSize: 24, fontWeight: 700 }}>{name.charAt(0)}</div>}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{location}</div>
                    <div style={{ display: 'flex', gap: 3 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 16, color: s <= stars ? accentColor : 'rgba(255,255,255,0.1)' }}>★</span>)}</div>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>{tagline}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>☎ {helpline}</span>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   GUARDIAN — 4: WARM MINIMAL
   Beige background, two-column, serif quote, clean
══════════════════════════════════════════════════ */
const G4WarmMinimal = ({ data }) => {
    const { headline, quote, name, location, stars, profileImage, accentColor = '#92400e', helpline, tagline } = data;
    return (
        <div style={{ width: 600, height: 750, background: '#f7f3ed', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: accentColor }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 32px 28px 40px' }}>
                <LogoBlock color="#2d2218" />
                <div style={{ fontSize: 10, color: '#bbb', textTransform: 'uppercase', letterSpacing: 2 }}>অভিভাবক মতামত</div>
            </div>
            <div style={{ padding: '0 40px 22px', borderBottom: '1px solid #e4ddd4' }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#2d2218' }}>{headline}</h2>
            </div>
            <div style={{ display: 'flex', padding: '28px 0', minHeight: 300 }}>
                <div style={{ flex: 1, padding: '0 30px 0 40px', borderRight: '1px solid #e4ddd4' }}>
                    <div style={{ fontFamily: 'Georgia,serif', fontSize: 44, color: accentColor, lineHeight: 0.8, marginBottom: 14, opacity: 0.6 }}>"</div>
                    <p style={{ fontSize: 15.5, lineHeight: 1.9, color: '#4a3a2c', margin: 0, fontStyle: 'italic', fontFamily: "'Hind Siliguri', Georgia, serif", textAlign: 'justify' }}>{quote}</p>
                </div>
                <div style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 10 }}>
                    <div style={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${accentColor}77`, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
                        {profileImage ? <img src={profileImage} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: `${accentColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontSize: 30, fontWeight: 700 }}>{name.charAt(0)}</div>}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#2d2218' }}>{name}</div>
                        <div style={{ fontSize: 11, color: '#999', marginTop: 3 }}>{location}</div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 7 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 15, color: s <= stars ? accentColor : '#d4c9bc' }}>★</span>)}</div>
                    </div>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '13px 40px', borderTop: '2px solid #e4ddd4', display: 'flex', justifyContent: 'space-between', background: '#ede8e0' }}>
                <span style={{ fontSize: 10, color: '#bbb', letterSpacing: 1 }}>{tagline}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2d2218' }}>☎ {helpline}</span>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   TEACHER — 1: PROFESSIONAL SPLIT
   Dark left sidebar + white right photo panel
══════════════════════════════════════════════════ */
const T1ProfessionalSplit = ({ data }) => {
    const { tutorName, university, monthYear, stars, rating, tutorImage, secondaryImage, badgeLabel, primaryColor = '#1d4ed8', helpline } = data;
    return (
        <div style={{ width: 600, height: 780, background: '#fff', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif", display: 'flex' }}>
            <div style={{ width: 210, flexShrink: 0, background: 'linear-gradient(180deg,#111827 0%,#1f2937 100%)', display: 'flex', flexDirection: 'column', padding: '28px 22px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: 120, height: 120, borderRadius: '50%', background: `${primaryColor}22` }} />
                <LogoBlock invert color="#fff" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 28, gap: 5 }}>
                    <div style={{ fontSize: 9, color: `${primaryColor}cc`, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>{badgeLabel}</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{(monthYear || '').split(' ')[0]}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: primaryColor, letterSpacing: 1 }}>{(monthYear || '').split(' ')[1]}</div>
                    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {[1,0.55,0.25].map((op, i) => <div key={i} style={{ height: 2, width: `${68 - i*18}px`, background: `rgba(255,255,255,${op})`, borderRadius: 2 }} />)}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Helpline</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{helpline}</div>
                </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#f1f5f9' }}>
                    {tutorImage ? <img src={tutorImage} alt={tutorName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 80 }}>👤</span></div>}
                    {secondaryImage && (
                        <div style={{ position: 'absolute', bottom: 12, right: 12, width: 88, height: 70, borderRadius: 10, overflow: 'hidden', border: '3px solid #fff', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
                            <img src={secondaryImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}
                </div>
                <div style={{ padding: '18px 22px', borderTop: `3px solid ${primaryColor}`, background: '#fff' }}>
                    <div style={{ fontSize: 19, fontWeight: 800, color: '#111827', marginBottom: 3 }}>{tutorName}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 12, lineHeight: 1.4 }}>{university}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 2 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 18, color: s <= stars ? '#f59e0b' : '#e5e7eb' }}>★</span>)}</div>
                        <span style={{ fontSize: 16, fontWeight: 800, color: primaryColor }}>{rating}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   TEACHER — 2: AWARD ELEGANT
   Modern certificate, gold accents, framed photo
══════════════════════════════════════════════════ */
const T2AwardElegant = ({ data }) => {
    const { tutorName, university, monthYear, stars, rating, tutorImage, badgeLabel, primaryColor = '#065f46', accentGold = '#d97706', helpline } = data;
    return (
        <div style={{ width: 600, height: 780, background: '#fffef9', border: '16px solid #1c2b1e', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif", boxSizing: 'border-box' }}>
            <div style={{ position: 'absolute', top: 6, bottom: 6, left: 6, right: 6, border: `1.5px solid ${accentGold}55`, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '22px 32px 16px', borderBottom: `1px solid #e8e4d6` }}>
                <LogoBlock color="#1c2b1e" />
                <div style={{ marginTop: 10, fontSize: 11, color: accentGold, textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700 }}>Certificate of Recognition</div>
                <div style={{ height: 1, width: 80, background: `${accentGold}66`, margin: '8px auto 0' }} />
                <div style={{ fontSize: 12, color: '#aaa', fontStyle: 'italic', marginTop: 6 }}>This is proudly awarded to</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
                <div style={{ width: 170, height: 195, border: `3px solid ${accentGold}`, padding: 4, background: '#fff' }}>
                    {tutorImage ? <img src={tutorImage} alt={tutorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: '#f5f0e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 55 }}>👤</span></div>}
                </div>
            </div>
            <div style={{ textAlign: 'center', padding: '18px 32px 0' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#1c2b1e', letterSpacing: '-0.3px' }}>{tutorName}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4, fontStyle: 'italic' }}>{university}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '18px 0', borderTop: '1px solid #e8e4d6', borderBottom: '1px solid #e8e4d6', padding: '13px 0' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 9, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Award</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: primaryColor }}>{badgeLabel}</div>
                    </div>
                    <div style={{ width: 1, height: 28, background: '#e0dbd3' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 9, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Period</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>{monthYear}</div>
                    </div>
                    <div style={{ width: 1, height: 28, background: '#e0dbd3' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 9, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Rating</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: accentGold }}>{rating} ★</div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: 16 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 18, color: s <= stars ? accentGold : '#ddd' }}>★</span>)}</div>
            </div>
            <div style={{ position: 'absolute', bottom: 16, left: 40, right: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #e8e4d6' }}>
                <div style={{ fontSize: 11, color: '#999', fontStyle: 'italic' }}>Authorized by TSF</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>☎ {helpline}</div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   TEACHER — 3: MODERN DARK (clean, no gimmicks)
   Slate dark, photo card, gradient pill badge
══════════════════════════════════════════════════ */
const T3ModernDark = ({ data }) => {
    const { tutorName, university, monthYear, stars, rating, tutorImage, badgeLabel, primaryColor = '#7c3aed', secondaryColor = '#db2777', helpline } = data;
    return (
        <div style={{ width: 600, height: 780, background: 'linear-gradient(160deg,#0f172a 0%,#1e293b 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <div style={{ height: 3, background: `linear-gradient(90deg,${primaryColor},${secondaryColor})` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 32px' }}>
                <LogoBlock invert color="#fff" />
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>{monthYear}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', margin: '0 32px' }}>
                <div style={{ width: 220, height: 250, borderRadius: 16, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.07)', boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}>
                    {tutorImage ? <img src={tutorImage} alt={tutorName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} /> : <div style={{ width: '100%', height: '100%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 60 }}>👤</span></div>}
                </div>
                <div style={{ position: 'absolute', bottom: -14, background: `linear-gradient(90deg,${primaryColor},${secondaryColor})`, borderRadius: 20, padding: '6px 22px', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
                    <span style={{ fontSize: 10, color: '#fff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>🏆 {badgeLabel}</span>
                </div>
            </div>
            <div style={{ margin: '30px 32px 0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                <div style={{ textAlign: 'center', marginBottom: 14 }}>
                    <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#fff' }}>{tutorName}</h2>
                    <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{university}</p>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '14px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 3 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 20, color: s <= stars ? '#f59e0b' : 'rgba(255,255,255,0.1)' }}>★</span>)}</div>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{rating}</span>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>Tuition Seba Forum</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>☎ {helpline}</span>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   TEACHER — 4: NATURAL SAGE
   Sage green, arch photo, clean editorial
══════════════════════════════════════════════════ */
const T4NaturalSage = ({ data }) => {
    const { tutorName, university, monthYear, stars, rating, tutorImage, badgeLabel, primaryColor = '#166534', helpline } = data;
    return (
        <div style={{ width: 600, height: 780, background: '#edf4f0', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 170, height: 170, borderRadius: '50%', background: '#d4e8de' }} />
            <div style={{ position: 'absolute', bottom: -30, left: -30, width: 130, height: 130, borderRadius: '50%', background: '#d4e8de' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '26px 32px', position: 'relative' }}>
                <LogoBlock color="#1c3328" />
                <div style={{ fontSize: 10, color: '#8aab9a', textTransform: 'uppercase', letterSpacing: 2 }}>{monthYear}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 190, height: 230, borderRadius: '95px 95px 0 0', overflow: 'hidden', border: '5px solid #fff', boxShadow: '0 8px 28px rgba(0,0,0,0.07)' }}>
                    {tutorImage ? <img src={tutorImage} alt={tutorName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} /> : <div style={{ width: '100%', height: '100%', background: '#d4e8de', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 40 }}>🌿</span></div>}
                </div>
            </div>
            <div style={{ padding: '22px 44px', textAlign: 'center', position: 'relative' }}>
                <div style={{ fontSize: 10, color: primaryColor, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 6 }}>{badgeLabel}</div>
                <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: '#1c3328', letterSpacing: '-0.3px' }}>{tutorName}</h2>
                <p style={{ margin: '0 0 18px', fontSize: 12, color: '#8aab9a', lineHeight: 1.5 }}>{university}</p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, padding: '16px 0', borderTop: '1px solid #c8ddd4', borderBottom: '1px solid #c8ddd4' }}>
                    <div style={{ display: 'flex', gap: 3 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 20, color: s <= stars ? '#f59e0b' : '#cde0d5' }}>★</span>)}</div>
                    <div style={{ width: 1, height: 26, background: '#c8ddd4' }} />
                    <span style={{ fontSize: 22, fontWeight: 900, color: primaryColor }}>{rating}</span>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '13px 32px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #c8ddd4', background: '#e0eee6' }}>
                <span style={{ fontSize: 10, color: '#8aab9a' }}>Tuition Seba Forum</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1c3328' }}>☎ {helpline}</span>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
const PosterGenerator = () => {
    const [category, setCategory] = useState('guardian');
    const [gTpl, setGTpl] = useState(1);
    const [tTpl, setTTpl] = useState(1);
    const [downloading, setDownloading] = useState(false);
    const posterRef = useRef(null);
    const downloadRef = useRef(null);

    const [gData, setGData] = useState({
        headline: 'অভিভাবকের অভিজ্ঞতা',
        quote: 'আমার সন্তানের জীবন বদলে দিয়েছে এই প্ল্যাটফর্ম। সঠিক টিউটর খোঁজা এখন অনেক সহজ। Tuition Seba Forum-এর সেবা সত্যিই প্রশংসনীয়।',
        name: 'নাম লিখুন', location: 'এলাকা, শহর', stars: 5, profileImage: null,
        accentColor: '#c8973a', helpline: '09613 441122', tagline: '১ প্ল্যাটফর্মেই টিউটর ও টিউশন',
    });
    const [tData, setTData] = useState({
        tutorName: 'টিউটরের নাম', university: 'University / Institution Name',
        monthYear: 'মে ২০২৬', stars: 5, rating: '5.0',
        tutorImage: null, secondaryImage: null, badgeLabel: 'TUTOR OF THE MONTH',
        primaryColor: '#1d4ed8', secondaryColor: '#db2777', accentGold: '#d97706',
        helpline: '09613 441122',
    });

    const updG = (k, v) => setGData(p => ({ ...p, [k]: v }));
    const updT = (k, v) => setTData(p => ({ ...p, [k]: v }));

    const onImg = useCallback((e, upd, key) => {
        const f = e.target.files[0];
        if (!f?.type.startsWith('image/')) return;
        const r = new FileReader();
        r.onload = ev => upd(key, ev.target.result);
        r.readAsDataURL(f);
    }, []);

    const download = async () => {
        if (!downloadRef.current) return;
        setDownloading(true);
        try {
            // Await font readiness to ensure Google Fonts (like Hind Siliguri) render correctly
            await document.fonts.ready;

            const canvas = await html2canvas(downloadRef.current, { 
                scale: 3, 
                useCORS: true, 
                allowTaint: true, 
                backgroundColor: null, 
                logging: false 
            });
            const a = document.createElement('a');
            a.download = `tsf-poster-${Date.now()}.png`;
            a.href = canvas.toDataURL('image/png', 1.0);
            a.click();
            toast.success('✅ Poster downloaded!');
        } catch (err) { 
            console.error(err);
            toast.error('Download failed'); 
        } finally { 
            setDownloading(false); 
        }
    };

    const inp = { width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', background: '#fafbff', color: '#1e293b', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' };
    const lbl = { fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 5, display: 'block' };
    const fw = { marginBottom: 14 };

    const Stars = ({ val, onChange }) => (
        <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
            {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => onChange(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: s <= val ? '#f59e0b' : '#d1d5db', padding: 0, lineHeight: 1 }}>★</button>
            ))}
        </div>
    );

    const ImgField = ({ label, val, onUp, onRm, h = '50px', w = '50px' }) => (
        <div style={fw}>
            <label style={lbl}>{label}</label>
            <input type="file" accept="image/*" onChange={onUp} style={{ ...inp, padding: '5px 8px', cursor: 'pointer' }} />
            {val && <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={val} alt="" style={{ width: w, height: h, borderRadius: 8, objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                <button onClick={onRm} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins' }}>✕ Remove</button>
            </div>}
        </div>
    );

    const gTplNames = { 1: 'Midnight Gold', 2: 'Light Editorial', 3: 'Navy Card', 4: 'Warm Minimal' };
    const tTplNames = { 1: 'Professional Split', 2: 'Award Elegant', 3: 'Modern Dark', 4: 'Natural Sage' };

    const activeTpl = category === 'guardian' ? gTpl : tTpl;
    const setActiveTpl = category === 'guardian' ? setGTpl : setTTpl;
    const tplNames = category === 'guardian' ? gTplNames : tTplNames;
    const mainColor = category === 'guardian' ? '#c8973a' : '#1d4ed8';

    return (
        <div style={{ fontFamily: 'Poppins,sans-serif' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)', borderRadius: 20, padding: '20px 26px', marginBottom: 22, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 36px rgba(79,70,229,0.35)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -20, top: -20, width: 130, height: 130, borderRadius: '50%', background: 'rgba(167,139,250,0.12)' }} />
                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                        <span style={{ fontSize: 20 }}>🎨</span>
                        <h2 style={{ margin: 0, fontWeight: 900, fontSize: 19 }}>Poster Generator</h2>
                    </div>
                    <p style={{ margin: 0, opacity: 0.6, fontSize: 11 }}>Choose category → select template → edit → download high-res PNG</p>
                </div>
                <button onClick={download} disabled={downloading} style={{ background: downloading ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 22px', fontWeight: 800, fontSize: 13, cursor: downloading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'Poppins', whiteSpace: 'nowrap', position: 'relative', zIndex: 1, boxShadow: downloading ? 'none' : '0 4px 16px rgba(245,158,11,0.45)' }}>
                    {downloading ? <><span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13, borderWidth: 2 }} /> Generating…</> : <><i className="fas fa-download" /> Download PNG</>}
                </button>
            </div>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                {[{ key: 'guardian', icon: '👨‍👩‍👧', label: 'Guardian Review', color: '#c8973a' }, { key: 'teacher', icon: '🏆', label: 'Teacher Recognition', color: '#1d4ed8' }].map(t => (
                    <button key={t.key} onClick={() => setCategory(t.key)} style={{ padding: '10px 22px', borderRadius: 12, border: `2px solid ${category === t.key ? t.color : '#e2e8f0'}`, background: category === t.key ? t.color : '#fff', color: category === t.key ? '#fff' : '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Poppins', display: 'flex', alignItems: 'center', gap: 7, boxShadow: category === t.key ? `0 4px 14px ${t.color}44` : 'none', transition: 'all 0.15s' }}>
                        <span>{t.icon}</span>{t.label}
                    </button>
                ))}
            </div>

            {/* Template selector */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '11px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0 }}>Style:</span>
                <div style={{ display: 'flex', gap: 8 }}>
                    {[1,2,3,4].map(id => {
                        const sel = activeTpl === id;
                        return (
                            <button key={id} onClick={() => setActiveTpl(id)} style={{ width: 36, height: 36, borderRadius: 9, border: sel ? 'none' : '1.5px solid #cbd5e1', background: sel ? mainColor : '#fff', color: sel ? '#fff' : '#475569', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Poppins', boxShadow: sel ? `0 3px 10px ${mainColor}44` : 'none', transition: 'all 0.15s' }}>{id}</button>
                        );
                    })}
                </div>
                <span style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', marginLeft: 'auto' }}>{tplNames[activeTpl]}</span>
            </div>

            {/* Layout */}
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                {/* Controls */}
                <div style={{ width: 290, flexShrink: 0, background: '#fff', borderRadius: 18, border: '1.5px solid #e2e8f0', padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxHeight: '82vh', overflowY: 'auto' }}>
                    <h5 style={{ margin: '0 0 16px', fontWeight: 800, color: '#1e293b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
                        <i className="fas fa-sliders-h" style={{ color: '#6366f1' }} /> Edit Content
                    </h5>
                    {category === 'guardian' ? (<>
                        <div style={fw}><label style={lbl}>Headline</label><input style={inp} value={gData.headline} onChange={e => updG('headline', e.target.value)} /></div>
                        <div style={fw}><label style={lbl}>Review / Quote</label><textarea style={{ ...inp, height: 95, resize: 'vertical' }} value={gData.quote} onChange={e => updG('quote', e.target.value)} /></div>
                        <div style={fw}><label style={lbl}>Name</label><input style={inp} value={gData.name} onChange={e => updG('name', e.target.value)} /></div>
                        <div style={fw}><label style={lbl}>Location</label><input style={inp} value={gData.location} onChange={e => updG('location', e.target.value)} /></div>
                        <div style={fw}><label style={lbl}>Stars</label><Stars val={gData.stars} onChange={v => updG('stars', v)} /></div>
                        <ImgField label="Profile Photo" val={gData.profileImage} onUp={e => onImg(e, updG, 'profileImage')} onRm={() => updG('profileImage', null)} />
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, marginBottom: 12 }}>
                            <label style={{ ...lbl, color: '#6366f1', marginBottom: 8 }}>🎨 Accent Color</label>
                            <input type="color" defaultValue={gData.accentColor} onChange={e => updG('accentColor', e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', padding: 2 }} />
                        </div>
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                            <div style={fw}><label style={lbl}>Helpline</label><input style={inp} value={gData.helpline} onChange={e => updG('helpline', e.target.value)} /></div>
                            <div style={fw}><label style={lbl}>Tagline</label><input style={inp} value={gData.tagline} onChange={e => updG('tagline', e.target.value)} /></div>
                        </div>
                    </>) : (<>
                        <div style={fw}><label style={lbl}>Tutor Name</label><input style={inp} value={tData.tutorName} onChange={e => updT('tutorName', e.target.value)} /></div>
                        <div style={fw}><label style={lbl}>University / Institution</label><input style={inp} value={tData.university} onChange={e => updT('university', e.target.value)} /></div>
                        <div style={fw}><label style={lbl}>Month &amp; Year</label><input style={inp} value={tData.monthYear} onChange={e => updT('monthYear', e.target.value)} /></div>
                        <div style={fw}><label style={lbl}>Badge Label</label><input style={inp} value={tData.badgeLabel} onChange={e => updT('badgeLabel', e.target.value)} /></div>
                        <div style={{ display: 'flex', gap: 12, ...fw }}>
                            <div style={{ flex: 1 }}><label style={lbl}>Stars</label><Stars val={tData.stars} onChange={v => updT('stars', v)} /></div>
                            <div><label style={lbl}>Rating</label><input style={{ ...inp, width: 68 }} value={tData.rating} onChange={e => updT('rating', e.target.value)} /></div>
                        </div>
                        <ImgField label="Tutor Photo" val={tData.tutorImage} onUp={e => onImg(e, updT, 'tutorImage')} onRm={() => updT('tutorImage', null)} h="70px" w="52px" />
                        {tTpl === 1 && <ImgField label="Secondary Photo" val={tData.secondaryImage} onUp={e => onImg(e, updT, 'secondaryImage')} onRm={() => updT('secondaryImage', null)} h="50px" w="65px" />}
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, marginBottom: 12 }}>
                            <label style={{ ...lbl, color: '#6366f1', marginBottom: 8 }}>🎨 Colors</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                {tTpl === 1 && [['primaryColor','Primary']].map(([k,l]) => <div key={k}><div style={lbl}>{l}</div><input type="color" defaultValue={tData[k]} onChange={e => updT(k, e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', padding: 2 }} /></div>)}
                                {tTpl === 2 && [['primaryColor','Primary'],['accentGold','Gold']].map(([k,l]) => <div key={k}><div style={lbl}>{l}</div><input type="color" defaultValue={tData[k]} onChange={e => updT(k, e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', padding: 2 }} /></div>)}
                                {tTpl === 3 && [['primaryColor','Color 1'],['secondaryColor','Color 2']].map(([k,l]) => <div key={k}><div style={lbl}>{l}</div><input type="color" defaultValue={tData[k]} onChange={e => updT(k, e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', padding: 2 }} /></div>)}
                                {tTpl === 4 && [['primaryColor','Accent']].map(([k,l]) => <div key={k}><div style={lbl}>{l}</div><input type="color" defaultValue={tData[k]} onChange={e => updT(k, e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', padding: 2 }} /></div>)}
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                            <div style={fw}><label style={lbl}>Helpline</label><input style={inp} value={tData.helpline} onChange={e => updT('helpline', e.target.value)} /></div>
                        </div>
                    </>)}
                </div>

                {/* Preview */}
                <div style={{ flex: 1 }}>
                    <div style={{ background: 'repeating-conic-gradient(#f1f5f9 0% 25%,#fff 0% 50%) 0 0/18px 18px', borderRadius: 18, padding: 26, border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
                        <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                            <div ref={posterRef} style={{ width: 600, overflow: 'hidden' }}>
                                {category === 'guardian' && gTpl === 1 && <G1MidnightGold data={gData} />}
                                {category === 'guardian' && gTpl === 2 && <G2LightEditorial data={gData} />}
                                {category === 'guardian' && gTpl === 3 && <G3NavyCard data={gData} />}
                                {category === 'guardian' && gTpl === 4 && <G4WarmMinimal data={gData} />}
                                {category === 'teacher' && tTpl === 1 && <T1ProfessionalSplit data={tData} />}
                                {category === 'teacher' && tTpl === 2 && <T2AwardElegant data={tData} />}
                                {category === 'teacher' && tTpl === 3 && <T3ModernDark data={tData} />}
                                {category === 'teacher' && tTpl === 4 && <T4NaturalSage data={tData} />}
                            </div>
                        </div>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 10 }}>Preview at 85% — exported PNG is 3× full resolution</p>
                </div>
            </div>

            {/* Hidden export element to guarantee 100% exact full-size rendering for download */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <div ref={downloadRef} style={{ width: 600, overflow: 'hidden' }}>
                    {category === 'guardian' && gTpl === 1 && <G1MidnightGold data={gData} />}
                    {category === 'guardian' && gTpl === 2 && <G2LightEditorial data={gData} />}
                    {category === 'guardian' && gTpl === 3 && <G3NavyCard data={gData} />}
                    {category === 'guardian' && gTpl === 4 && <G4WarmMinimal data={gData} />}
                    {category === 'teacher' && tTpl === 1 && <T1ProfessionalSplit data={tData} />}
                    {category === 'teacher' && tTpl === 2 && <T2AwardElegant data={tData} />}
                    {category === 'teacher' && tTpl === 3 && <T3ModernDark data={tData} />}
                    {category === 'teacher' && tTpl === 4 && <T4NaturalSage data={tData} />}
                </div>
            </div>

            <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Hind+Siliguri:wght@400;600;700&display=swap');`}</style>
        </div>
    );
};

export default PosterGenerator;
