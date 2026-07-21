import React, { useState, useRef, useCallback, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';

const LOGO = '/img/TSF LOGO TRANSPARENT.png';

const WhatsAppIcon = ({ size = 11, color = '#25D366' }) => (
    <svg viewBox="0 0 448 512" style={{ width: size, height: size, fill: color, display: 'inline-block', verticalAlign: 'middle', marginLeft: '3px', marginRight: '3px' }}>
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
    </svg>
);

const LogoBlock = ({ size = 26, invert = false, color = '#1a1a1a' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src={LOGO} alt="TSF" style={{ height: `${size}px`, objectFit: 'contain', filter: invert ? 'brightness(0) invert(1)' : 'none' }} onError={e => e.target.style.display = 'none'} />
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '11px', color, lineHeight: 1.2 }}>
            <div>Tuition Seba</div>
            <div style={{ opacity: 0.65, fontSize: '9px', letterSpacing: '0.5px' }}>Forum</div>
        </div>
    </div>
);

const SignatureBlock = ({ name, color = '#1a3c70', invert = false }) => {
    const isDefault = name === 'Md Mahedi Hasan';
    
    if (isDefault) {
        return (
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '22px', overflow: 'visible' }}>
                <img 
                    src="/signature.png?v=1.0.5" 
                    alt="Signature" 
                    style={{ 
                        height: '35px', 
                        objectFit: 'contain',
                        marginTop: '-5px',
                        filter: invert ? 'brightness(0) invert(1)' : 'none'
                    }} 
                />
            </div>
        );
    }

    // Fallback if custom text is provided in the input field
    return (
        <div style={{ position: 'relative', display: 'inline-block', transform: 'rotate(-2deg) skewX(-6deg) translateY(-1px)', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ 
                fontFamily: "'Alex Brush', 'Great Vibes', 'Herr Von Muellerhoff', cursive, sans-serif", 
                fontSize: '11px', 
                color: color, 
                fontWeight: 500,
                letterSpacing: '0.4px',
                whiteSpace: 'nowrap',
                display: 'block',
                textShadow: '0.2px 0.2px 0px rgba(0,0,0,0.08)'
            }}>
                {name}
            </span>
            <svg width="48" height="5" viewBox="0 0 120 15" style={{ position: 'absolute', bottom: '-2px', left: '10%', right: '10%', opacity: 0.8, pointerEvents: 'none' }}>
                <path d="M 5,11 Q 45,2 80,10 T 115,7" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
        </div>
    );
};

const VerifiedStamp = ({ theme = 'gold' }) => {
    let bg = 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)';
    let border = '3px solid #fff';
    let color = '#fff';
    let shadow = '0 10px 25px rgba(16,185,129,0.45)';

    if (theme === 'gold') {
        bg = 'linear-gradient(135deg, #ffe082 0%, #fbbf24 30%, #d97706 70%, #92400e 100%)';
        border = '3px solid #fff';
        color = '#fff';
        shadow = '0 10px 25px rgba(217,119,6,0.5), 0 0 15px rgba(251,191,36,0.3)';
    } else if (theme === 'dark') {
        bg = 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)';
        border = '3px solid #fbbf24';
        color = '#fbbf24';
        shadow = '0 10px 25px rgba(2,44,34,0.6)';
    } else if (theme === 'chalk') {
        bg = 'rgba(255, 255, 255, 0.08)';
        border = '2px dashed rgba(255,255,255,0.7)';
        color = '#ffffff';
        shadow = 'none';
    } else if (theme === 'wax') {
        bg = 'radial-gradient(circle at 35% 35%, #f43f5e 0%, #e11d48 50%, #9f1239 100%)';
        border = '3px solid #fda4af';
        color = '#ffffff';
        shadow = '0 6px 15px rgba(159,18,57,0.5)';
    }

    return (
        <div style={{
            position: 'absolute',
            bottom: '-12px',
            right: '-12px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: bg,
            border: border,
            boxShadow: shadow,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            color: color,
            fontFamily: 'Poppins, sans-serif',
            userSelect: 'none',
            transform: 'rotate(-8deg)',
        }}>
            {/* Inner dashed ring for certificate seal aesthetic */}
            <div style={{
                position: 'absolute',
                inset: 3,
                border: theme === 'dark' ? '1px dashed rgba(251,191,36,0.4)' : (theme === 'chalk' ? '1px dashed rgba(255,255,255,0.3)' : (theme === 'wax' ? '1px dashed rgba(255,255,255,0.3)' : '1px dashed rgba(255,255,255,0.4)')),
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />
            <div style={{ fontSize: '7.5px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', lineHeight: 1, opacity: 0.95 }}>TSF</div>
            <div style={{ fontSize: '15px', fontWeight: 950, lineHeight: 1.1, marginTop: '2px', marginBottom: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>✓</div>
            <div style={{ fontSize: '6.5px', fontWeight: 900, letterSpacing: '0.5px', textTransform: 'uppercase', lineHeight: 1, opacity: 0.95 }}>VERIFIED</div>
        </div>
    );
};

const WatermarkBlock = ({ invert = false }) => (
    <div style={{
        position: 'absolute',
        top: '52%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-25deg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: invert ? 0.015 : 0.03,
        pointerEvents: 'none',
        zIndex: 0,
        userSelect: 'none'
    }}>
        <img 
            src="/img/TSF LOGO TRANSPARENT.png" 
            alt="" 
            style={{ 
                width: '180px', 
                height: '180px', 
                objectFit: 'contain',
                filter: invert ? 'brightness(0) invert(1)' : 'none',
                marginBottom: '10px'
            }} 
        />
        <div style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '56px',
            fontWeight: 900,
            letterSpacing: '4px',
            color: invert ? '#fff' : '#0f172a',
            lineHeight: 1
        }}>
            TSF
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
            <WatermarkBlock invert={true} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${accentColor},transparent)`, zIndex: 1 }} />
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
                    <div style={{ display: 'flex', gap: 3 }}>{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 16, color: s <= stars ? accentColor : 'rgba(255,255,255,0.12)' }}>★</span>)}</div>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: 1 }}>{tagline}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: accentColor, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span>☎</span>
                    <WhatsAppIcon size={12} />
                    <span>{helpline}</span>
                </span>
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
            <WatermarkBlock invert={false} />
            <div style={{ height: 4, background: accentColor, position: 'relative', zIndex: 1 }} />
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
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 5 }}>{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 14, color: s <= stars ? accentColor : '#ddd' }}>★</span>)}</div>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '13px 32px', borderTop: '1px solid #e0dbd3', display: 'flex', justifyContent: 'space-between', background: '#fff' }}>
                <span style={{ fontSize: 10, color: '#bbb', letterSpacing: 1 }}>{tagline}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#333', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span>☎</span>
                    <WhatsAppIcon size={12} />
                    <span>{helpline}</span>
                </span>
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
            <WatermarkBlock invert={true} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 15%,rgba(255,255,255,0.03) 0%,transparent 55%)', zIndex: 1 }} />
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
                    <div style={{ display: 'flex', gap: 3 }}>{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 16, color: s <= stars ? accentColor : 'rgba(255,255,255,0.1)' }}>★</span>)}</div>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>{tagline}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span>☎</span>
                    <WhatsAppIcon size={12} />
                    <span>{helpline}</span>
                </span>
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
            <WatermarkBlock invert={false} />
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: accentColor, zIndex: 1 }} />
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
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 7 }}>{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 15, color: s <= stars ? accentColor : '#d4c9bc' }}>★</span>)}</div>
                    </div>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '13px 40px', borderTop: '2px solid #e4ddd4', display: 'flex', justifyContent: 'space-between', background: '#ede8e0' }}>
                <span style={{ fontSize: 10, color: '#bbb', letterSpacing: 1 }}>{tagline}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2d2218', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span>☎</span>
                    <WhatsAppIcon size={12} />
                    <span>{helpline}</span>
                </span>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   TEACHER — 1: PROFESSIONAL SPLIT
   Dark left sidebar + white right photo panel
══════════════════════════════════════════════════ */
const T1ProfessionalSplit = ({ data }) => {
    const { tutorName, university, monthYear, stars, rating, tutorImage, secondaryImage, badgeLabel, primaryColor = '#1d4ed8', helpline, issueDate, authorizedSignature, authorizedTitle } = data;
    return (
        <div style={{ width: 600, height: 780, background: '#fff', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif", display: 'flex' }}>
            <WatermarkBlock invert={false} />
            <div style={{ width: 210, flexShrink: 0, background: 'linear-gradient(180deg,#111827 0%,#1f2937 100%)', display: 'flex', flexDirection: 'column', padding: '28px 22px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: 120, height: 120, borderRadius: '50%', background: `${primaryColor}22` }} />
                <LogoBlock invert color="#fff" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 28, gap: 5 }}>
                    <div style={{ fontSize: 9, color: `${primaryColor}cc`, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>{badgeLabel}</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{(monthYear || '').split(' ')[0]}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: primaryColor, letterSpacing: 1 }}>{(monthYear || '').split(' ')[1]}</div>
                    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {[1, 0.55, 0.25].map((op, i) => <div key={i} style={{ height: 2, width: `${68 - i * 18}px`, background: `rgba(255,255,255,${op})`, borderRadius: 2 }} />)}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Helpline</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span>☎</span>
                        <WhatsAppIcon size={12} />
                        <span>{helpline}</span>
                    </div>
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
                        <div style={{ display: 'flex', gap: 2 }}>{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 18, color: s <= stars ? '#f59e0b' : '#e5e7eb' }}>★</span>)}</div>
                        <span style={{ fontSize: 16, fontWeight: 800, color: primaryColor }}>{rating}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12, borderTop: '1px dashed #e2e8f0', paddingTop: 10 }}>
                        <div>
                            <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date of Award</div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#334155' }}>{issueDate}</div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <SignatureBlock name={authorizedSignature} color="#1b3a4b" />
                            <div style={{ height: 1, width: 80, background: '#cbd5e1', margin: '4px 0 2px' }} />
                            <div style={{ fontSize: 8, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{authorizedTitle}</div>
                        </div>
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
    const { tutorName, university, monthYear, stars, rating, tutorImage, badgeLabel, primaryColor = '#065f46', accentGold = '#d97706', helpline, issueDate, authorizedSignature, authorizedTitle } = data;
    return (
        <div style={{ width: 600, height: 780, background: '#fffef9', border: '16px solid #1c2b1e', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif", boxSizing: 'border-box' }}>
            <WatermarkBlock invert={false} />
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
                <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: 16 }}>{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 18, color: s <= stars ? accentGold : '#ddd' }}>★</span>)}</div>
            </div>
            <div style={{ position: 'absolute', bottom: 20, left: 40, right: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 12, borderTop: '1.5px solid #e8e4d6' }}>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 8, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Issue Date</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#1c2b1e' }}>{issueDate}</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 140, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SignatureBlock name={authorizedSignature} color="#0f2942" />
                    <div style={{ height: 1, width: 90, background: `${accentGold}66`, margin: '6px auto 4px' }} />
                    <div style={{ fontSize: 8, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{authorizedTitle}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 8, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Verification</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#1c2b1e', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <span>☎</span>
                        <WhatsAppIcon size={11} color="#1c2b1e" />
                        <span>{helpline}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   TEACHER — 3: MODERN DARK (clean, no gimmicks)
   Slate dark, photo card, gradient pill badge
══════════════════════════════════════════════════ */
const T3ModernDark = ({ data }) => {
    const { tutorName, university, monthYear, stars, rating, tutorImage, badgeLabel, primaryColor = '#7c3aed', secondaryColor = '#db2777', helpline, issueDate, authorizedSignature, authorizedTitle } = data;
    return (
        <div style={{ width: 600, height: 780, background: 'linear-gradient(160deg,#0f172a 0%,#1e293b 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <WatermarkBlock invert={true} />
            <div style={{ height: 3, background: `linear-gradient(90deg,${primaryColor},${secondaryColor})`, position: 'relative', zIndex: 1 }} />
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
                    <div style={{ display: 'flex', gap: 3 }}>{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 20, color: s <= stars ? '#f59e0b' : 'rgba(255,255,255,0.1)' }}>★</span>)}</div>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{rating}</span>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date of Issue</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{issueDate}</div>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: 140, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <SignatureBlock name={authorizedSignature} color="#38bdf8" invert={true} />
                        <div style={{ height: 1, width: 90, background: 'rgba(255,255,255,0.15)', margin: '6px auto 4px' }} />
                        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{authorizedTitle}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Helpline</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <span>☎</span>
                            <WhatsAppIcon size={11} color="rgba(255,255,255,0.8)" />
                            <span>{helpline}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   TEACHER — 4: NATURAL SAGE
   Sage green, arch photo, clean editorial
══════════════════════════════════════════════════ */
const T4NaturalSage = ({ data }) => {
    const { tutorName, university, monthYear, stars, rating, tutorImage, badgeLabel, primaryColor = '#166534', helpline, issueDate, authorizedSignature, authorizedTitle } = data;
    return (
        <div style={{ width: 600, height: 780, background: '#edf4f0', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <WatermarkBlock invert={false} />
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
                    <div style={{ display: 'flex', gap: 3 }}>{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 20, color: s <= stars ? '#f59e0b' : '#cde0d5' }}>★</span>)}</div>
                    <div style={{ width: 1, height: 26, background: '#c8ddd4' }} />
                    <span style={{ fontSize: 22, fontWeight: 900, color: primaryColor }}>{rating}</span>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #c8ddd4', background: '#e0eee6' }}>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 8, color: '#7ba08d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Awarded Date</div>
                    <div style={{ fontSize: 11, color: '#1c3328', fontWeight: 600 }}>{issueDate}</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 140, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SignatureBlock name={authorizedSignature} color="#1c3328" />
                    <div style={{ height: 1, width: 90, background: '#c8ddd4', margin: '4px auto 4px' }} />
                    <div style={{ fontSize: 8, color: '#7ba08d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{authorizedTitle}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 8, color: '#7ba08d', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>TSF Helpline</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#1c3328', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <span>☎</span>
                        <WhatsAppIcon size={11} color="#1c3328" />
                        <span>{helpline}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   GUARDIAN — 5: MODERN COLORFUL
   Vibrant mesh gradient with glassmorphism review card
══════════════════════════════════════════════════ */
const G5ModernColorful = ({ data }) => {
    const { headline, quote, name, location, stars, profileImage, helpline, tagline } = data;
    return (
        <div style={{ width: 600, height: 750, background: '#ffffff', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <WatermarkBlock invert={false} />
            {/* Fine Modular Grid System */}
            <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', pointerEvents: 'none', opacity: 0.65 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={`col-${i}`} style={{ gridColumnStart: i + 2, gridColumnEnd: i + 2, gridRowStart: 1, gridRowEnd: 9, borderLeft: '1px solid #f1f5f9', position: 'relative' }} />
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={`row-${i}`} style={{ gridRowStart: i + 2, gridRowEnd: i + 2, gridColumnStart: 1, gridColumnEnd: 7, borderTop: '1px solid #f1f5f9' }} />
                ))}
            </div>
            
            {/* Tiny Coordinates / Plus Marks at Grid Intersections */}
            {[[100, 187.5], [200, 375], [300, 187.5], [400, 562.5], [500, 375]].map(([x, y], idx) => (
                <div key={`plus-${idx}`} style={{ position: 'absolute', left: x - 5, top: y - 7, fontSize: 11, color: '#cbd5e1', fontWeight: 300, pointerEvents: 'none' }}>+</div>
            ))}

            {/* Glowing 3D-like Color Bubbles */}
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, rgba(236,72,153,0.18) 0%, rgba(99,102,241,0.12) 50%, transparent 80%)', filter: 'blur(8px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-5%', left: '-8%', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, rgba(6,182,212,0.18) 0%, rgba(99,102,241,0.1) 60%, transparent 85%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
            
            {/* Scattered Crisp Translucent Spheres */}
            <div style={{ position: 'absolute', top: '15%', left: '12%', width: '42px', height: '42px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85) 0%, rgba(236,72,153,0.3) 60%, rgba(236,72,153,0.6) 100%)', boxShadow: '0 8px 24px rgba(236,72,153,0.12)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '48%', right: '8%', width: '28px', height: '28px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85) 0%, rgba(6,182,212,0.25) 60%, rgba(6,182,212,0.5) 100%)', boxShadow: '0 6px 18px rgba(6,182,212,0.1)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '30%', left: '6%', width: '20px', height: '20px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85) 0%, rgba(234,179,8,0.3) 60%, rgba(234,179,8,0.5) 100%)', boxShadow: '0 4px 12px rgba(234,179,8,0.12)', pointerEvents: 'none' }} />

            {/* Header Content */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 32px', position: 'relative', zIndex: 2 }}>
                <LogoBlock color="#0f172a" />
                <div style={{ background: 'linear-gradient(135deg, #4f46e5, #ec4899)', borderRadius: 24, padding: '6px 18px', fontSize: 10, color: '#fff', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', boxShadow: '0 6px 16px rgba(79,70,229,0.25)' }}>অভিভাবক রিভিউ</div>
            </div>

            {/* Premium Frosted Card */}
            <div style={{ position: 'relative', zIndex: 2, margin: '15px 32px 0', background: 'rgba(255,255,255,0.92)', border: '1.5px solid #f1f5f9', borderRadius: '28px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(15,23,42,0.08)' }}>
                {/* Decorative Quote Icon */}
                <div style={{ position: 'absolute', top: -18, left: 32, width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 900, boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>“</div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <div style={{ width: 4, height: 26, background: 'linear-gradient(180deg, #6366f1, #ec4899)', borderRadius: 2 }} />
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.3px' }}>{headline}</h2>
                </div>
                <p style={{ fontSize: 16, lineHeight: 1.85, color: '#334155', margin: 0, textAlign: 'justify', fontStyle: 'italic' }}>"{quote}"</p>
            </div>

            {/* Profile Block */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 18, margin: '32px 32px' }}>
                <div style={{ width: 76, height: 76, borderRadius: '50%', border: '2.5px solid #fff', overflow: 'hidden', flexShrink: 0, boxShadow: '0 10px 25px rgba(15,23,42,0.1)', background: '#fff' }}>
                    {profileImage ? <img src={profileImage} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 26, fontWeight: 800 }}>{name.charAt(0)}</div>}
                </div>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 850, color: '#0f172a', marginBottom: 3, letterSpacing: '-0.2px' }}>{name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>{location}</div>
                    <div style={{ display: 'flex', gap: 3 }}>{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 15, color: s <= stars ? '#fbbf24' : '#e2e8f0' }}>★</span>)}</div>
                </div>
            </div>

            {/* Bottom Contact Line */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 32px', borderTop: '1px solid #f1f5f9', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                <span style={{ fontSize: 10, color: '#94a3b8', letterSpacing: '1px', fontWeight: 600 }}>{tagline}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'linear-gradient(135deg, #4f46e5, #ec4899)', padding: '6px 14px', borderRadius: 24, boxShadow: '0 4px 12px rgba(79,70,229,0.2)' }}>
                    <span>☎</span>
                    <WhatsAppIcon size={12} color="#fff" />
                    <span>{helpline}</span>
                </span>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   TEACHER — 5: VIBRANT MESH
   Vibrant tech mesh background, neon gradient pill, clean signature
══════════════════════════════════════════════════ */
const T5VibrantMesh = ({ data }) => {
    const { tutorName, university, monthYear, stars, rating, tutorImage, badgeLabel, helpline, issueDate, authorizedSignature, authorizedTitle } = data;
    return (
        <div style={{ width: 600, height: 780, background: '#ffffff', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <WatermarkBlock invert={false} />
            {/* Fine Modular Grid System */}
            <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', pointerEvents: 'none', opacity: 0.65 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={`col-${i}`} style={{ gridColumnStart: i + 2, gridColumnEnd: i + 2, gridRowStart: 1, gridRowEnd: 9, borderLeft: '1px solid #f1f5f9', position: 'relative' }} />
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={`row-${i}`} style={{ gridRowStart: i + 2, gridRowEnd: i + 2, gridColumnStart: 1, gridColumnEnd: 7, borderTop: '1px solid #f1f5f9' }} />
                ))}
            </div>
            
            {/* Tiny Coordinates / Plus Marks at Grid Intersections */}
            {[[100, 195], [200, 390], [300, 195], [400, 585], [500, 390]].map(([x, y], idx) => (
                <div key={`plus-${idx}`} style={{ position: 'absolute', left: x - 5, top: y - 7, fontSize: 11, color: '#cbd5e1', fontWeight: 300, pointerEvents: 'none' }}>+</div>
            ))}

            {/* Glowing 3D-like Color Bubbles */}
            <div style={{ position: 'absolute', top: '-8%', right: '-8%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, rgba(2,132,199,0.15) 0%, rgba(124,58,237,0.1) 50%, transparent 80%)', filter: 'blur(8px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-5%', right: '-8%', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, rgba(236,72,153,0.15) 0%, rgba(6,182,212,0.1) 60%, transparent 85%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
            
            {/* Nested Orbital Circles behind Photo */}
            <div style={{ position: 'absolute', top: '100px', left: '196px', width: '208px', height: '238px', borderRadius: '28px', border: '1.5px dashed rgba(99,102,241,0.25)', pointerEvents: 'none', zIndex: 1 }} />
            <div style={{ position: 'absolute', top: '90px', left: '186px', width: '228px', height: '258px', borderRadius: '36px', border: '1px solid rgba(236,72,153,0.18)', pointerEvents: 'none', zIndex: 1 }} />

            {/* 3D Colored Spheres floating around */}
            <div style={{ position: 'absolute', top: '25%', right: '15%', width: '46px', height: '46px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #ff85a2 0%, #ec4899 55%, #ad1d53 100%)', boxShadow: '0 8px 20px rgba(236,72,153,0.2)', pointerEvents: 'none', zIndex: 1 }} />
            <div style={{ position: 'absolute', bottom: '32%', left: '10%', width: '34px', height: '34px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #7dd3fc 0%, #0284c7 60%, #034b72 100%)', boxShadow: '0 6px 15px rgba(2,132,199,0.18)', pointerEvents: 'none', zIndex: 1 }} />
            <div style={{ position: 'absolute', top: '40%', left: '10%', width: '22px', height: '22px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #ffe082 0%, #ffb300 65%, #b37d00 100%)', boxShadow: '0 4px 10px rgba(255,179,0,0.15)', pointerEvents: 'none', zIndex: 1 }} />

            {/* Header Content */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', position: 'relative', zIndex: 2 }}>
                <LogoBlock color="#0f172a" />
                <div style={{ background: '#f1f5f9', border: '1.5px solid #cbd5e1', borderRadius: 20, padding: '5px 14px', fontSize: 10, color: '#475569', fontWeight: 800, letterSpacing: 1 }}>{monthYear}</div>
            </div>

            {/* Tutor Image Container */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginTop: 15, zIndex: 2 }}>
                <div style={{ width: 176, height: 206, borderRadius: 24, overflow: 'hidden', border: '4.5px solid #fff', boxShadow: '0 15px 35px rgba(15,23,42,0.15)', background: '#fff' }}>
                    {tutorImage ? <img src={tutorImage} alt={tutorName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} /> : <div style={{ width: '100%', height: '100%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 50 }}>👤</span></div>}
                </div>
                <div style={{ position: 'absolute', bottom: -14, background: 'linear-gradient(90deg, #ec4899, #f43f5e)', borderRadius: 20, padding: '6px 22px', boxShadow: '0 6px 16px rgba(236,72,153,0.35)' }}>
                    <span style={{ fontSize: 10, color: '#fff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>🏆 {badgeLabel}</span>
                </div>
            </div>

            {/* Tutor Details Panel */}
            <div style={{ position: 'relative', zIndex: 2, margin: '38px 32px 0', background: '#ffffff', border: '1.5px solid #f1f5f9', borderRadius: 28, padding: '22px 24px', boxShadow: '0 20px 40px rgba(15,23,42,0.06)' }}>
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                    <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.3px' }}>{tutorName}</h2>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.4, fontWeight: 600 }}>{university}</p>
                </div>
                <div style={{ height: 1, background: '#f1f5f9', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 3 }}>{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 18, color: s <= stars ? '#fbbf24' : '#e2e8f0' }}>★</span>)}</div>
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{rating}</span>
                </div>
            </div>

            {/* Bottom Contact / Signature Bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 32px', borderTop: '1px solid #f1f5f9', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Date of Issue</div>
                        <div style={{ fontSize: 11, color: '#0f172a', fontWeight: 700 }}>{issueDate}</div>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: 140, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <SignatureBlock name={authorizedSignature} color="#1a3c70" invert={false} />
                        <div style={{ height: 1, width: 90, background: '#e2e8f0', margin: '6px auto 4px' }} />
                        <div style={{ fontSize: 8, color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{authorizedTitle}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Helpline</div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'linear-gradient(135deg, #0284c7, #4f46e5)', padding: '5px 12px', borderRadius: 24, boxShadow: '0 4px 12px rgba(2,132,199,0.2)' }}>
                            <span>☎</span>
                            <WhatsAppIcon size={11} color="#fff" />
                            <span>{helpline}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* Premium Highlighted Brand Header */
const PremiumHeader = ({ invert = false, accentColor = '#d97706' }) => {
    const textColor = invert ? '#ffffff' : '#1e1b4b';
    const subColor = invert ? accentColor : '#4f46e5';
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: '100%' }}>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                background: invert ? 'rgba(255,255,255,0.06)' : 'rgba(79,70,229,0.05)', 
                padding: '10px 26px', 
                borderRadius: 30, 
                border: `1.5px solid ${invert ? 'rgba(255,255,255,0.15)' : 'rgba(79,70,229,0.15)'}`, 
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)' 
            }}>
                <img src={LOGO} alt="TSF Logo" style={{ height: 32, objectFit: 'contain', filter: invert ? 'brightness(0) invert(1)' : 'none' }} />
                <div style={{ width: 1.5, height: 26, background: invert ? 'rgba(255,255,255,0.25)' : 'rgba(79,70,229,0.25)' }} />
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 15, color: textColor, letterSpacing: '0.6px', textTransform: 'uppercase', lineHeight: 1 }}>Tuition Seba</div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 10, color: subColor, letterSpacing: '2.5px', textTransform: 'uppercase', lineHeight: 1, marginTop: 3 }}>Forum</div>
                </div>
            </div>
        </div>
    );
};

/* Premium Colorful Flower Decoration */
const PremiumFlower = ({ size = 30, color = '#ec4899' }) => (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))' }}>
        {/* Detailed Leaves */}
        <path d="M50 50 Q30 20 20 30 Q20 50 50 50" fill="#10b981" />
        <path d="M50 50 Q70 80 80 70 Q80 50 50 50" fill="#10b981" />
        {/* Flower Petals */}
        <circle cx="50" cy="30" r="16" fill={color} />
        <circle cx="50" cy="70" r="16" fill={color} />
        <circle cx="30" cy="50" r="16" fill={color} />
        <circle cx="70" cy="50" r="16" fill={color} />
        {/* Core center */}
        <circle cx="50" cy="50" r="12" fill="#facc15" />
    </svg>
);

/* ══════════════════════════════════════════════════
   WELCOME TEACHER — 1: ROYAL WELCOME
   Deep navy, glowing gold frame, sparkles, premium
   ══════════════════════════════════════════════════ */
const WT1RoyalWelcome = ({ data }) => {
    const { teacherName, designation, university, welcomeMessage, teacherImage, primaryColor = '#1e3a8a', accentColor = '#fbbf24', helpline, tagline, imageZoom = 1, imageOffsetX = 0, imageOffsetY = 0, imageRotate = 0 } = data;
    return (
        <div style={{ width: 600, height: 780, background: 'radial-gradient(circle at center, #0f1123 0%, #05060b 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <WatermarkBlock invert={true} />
            
            {/* Elegant light beams/glows */}
            <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 60%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            
            {/* Ornate gold corner elements */}
            {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
                <div key={`${v}-${h}`} style={{ position: 'absolute', [v]: 24, [h]: 24, width: 28, height: 28, borderTop: v === 'top' ? `3px solid ${accentColor}` : 'none', borderBottom: v === 'bottom' ? `3px solid ${accentColor}` : 'none', borderLeft: h === 'left' ? `3px solid ${accentColor}` : 'none', borderRight: h === 'right' ? `3px solid ${accentColor}` : 'none', zIndex: 1 }} />
            ))}
            
            {/* Double golden border frame */}
            <div style={{ position: 'absolute', inset: 16, border: '1px solid rgba(251,191,36,0.15)', pointerEvents: 'none', zIndex: 1 }} />
            <div style={{ position: 'absolute', inset: 20, border: '2px solid rgba(251,191,36,0.25)', pointerEvents: 'none', zIndex: 1 }} />

            {/* Top Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 44, position: 'relative', zIndex: 2 }}>
                <PremiumHeader invert={true} accentColor={accentColor} />
                <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 50, height: 1, background: `linear-gradient(90deg, transparent, ${accentColor})` }} />
                    <span style={{ fontSize: 11, color: accentColor, textTransform: 'uppercase', letterSpacing: 6, fontWeight: 900 }}>Welcome</span>
                    <div style={{ width: 50, height: 1, background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
                </div>
                <h1 style={{ margin: '6px 0 0', fontSize: 34, fontWeight: 950, color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', textShadow: '0 4px 20px rgba(251,191,36,0.4)', fontFamily: 'Poppins' }}>OUR NEW TEACHER</h1>
            </div>

            {/* Portrait Frame with orbit decorations */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28, position: 'relative', zIndex: 2 }}>
                <div style={{ position: 'relative', width: 180, height: 180 }}>
                    {/* Ring glow */}
                    <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: `1.5px dashed rgba(251,191,36,0.3)` }} />
                    <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: `1px solid rgba(251,191,36,0.15)` }} />
                    
                    {/* Main Image Container */}
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `4px solid ${accentColor}`, boxShadow: '0 12px 36px rgba(0,0,0,0.6), 0 0 25px rgba(251,191,36,0.25)', overflow: 'hidden', background: '#090a0f' }}>
                        {teacherImage ? (
                            <img 
                                src={teacherImage} 
                                alt={teacherName} 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    transform: `scale(${imageZoom}) translate(${imageOffsetX}px, ${imageOffsetY}px) rotate(${imageRotate}deg)`,
                                    transformOrigin: 'center center'
                                }} 
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontSize: 72 }}>👤</div>
                        )}
                    </div>
                    
                    {/* Floating Verified Stamp */}
                    <VerifiedStamp theme="gold" />
                </div>
            </div>

            {/* Details Panel */}
            <div style={{ textAlign: 'center', padding: '26px 44px 0', position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{teacherName}</div>
                <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,191,36,0.02))', border: `1.5px solid ${accentColor}55`, borderRadius: 8, padding: '4px 18px', fontSize: 12.5, fontWeight: 800, color: accentColor, marginTop: 10, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    {designation}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, margin: '18px 0 14px' }}>
                    {[1, 2, 3, 4, 5].map(i => <span key={i} style={{ color: accentColor, fontSize: 15 }}>★</span>)}
                </div>

                {/* Welcome Message Panel - Styled like a premium testimonial block */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '20px 24px', backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden' }}>
                    {/* Translucent giant quote marks */}
                    <div style={{ position: 'absolute', top: -5, left: 10, fontSize: 48, color: `${accentColor}1a`, fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>“</div>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        {welcomeMessage}
                    </p>
                    <div style={{ position: 'absolute', bottom: -20, right: 10, fontSize: 48, color: `${accentColor}1a`, fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>”</div>
                </div>
            </div>

            {/* Bottom Footer Bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '22px 38px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(5,8,18,0.92)', zIndex: 2 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.6px', fontWeight: 600 }}>{tagline}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: accentColor, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <span>☎</span>
                    <WhatsAppIcon size={12} color={accentColor} />
                    <span>{helpline}</span>
                </span>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   WELCOME TEACHER — 2: MODERN CREATIVE
   Mesh gradient background, glassmorphism card, bold
   ══════════════════════════════════════════════════ */
const WT2ModernCreative = ({ data }) => {
    const { teacherName, designation, university, welcomeMessage, teacherImage, primaryColor = '#4f46e5', accentColor = '#f43f5e', helpline, tagline, imageZoom = 1, imageOffsetX = 0, imageOffsetY = 0, imageRotate = 0 } = data;
    return (
        <div style={{ width: 600, height: 780, background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 40%, #fae8ff 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <WatermarkBlock invert={false} />
            
            {/* Visual background textures and blobs to fill space */}
            <div style={{ position: 'absolute', top: '-5%', right: '-5%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 70%)', filter: 'blur(25px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '5%', left: '-8%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,94,0.2) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 75%)', filter: 'blur(35px)', pointerEvents: 'none' }} />

            {/* Glowing design accents */}
            <div style={{ position: 'absolute', top: '160px', left: '60px', width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #818cf8, #c084fc)', opacity: 0.65, filter: 'blur(1px)' }} />
            <div style={{ position: 'absolute', bottom: '260px', right: '50px', width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #f472b6, #fb7185)', opacity: 0.55, filter: 'blur(2px)' }} />

            {/* Header section */}
            <div style={{ padding: '24px 32px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, position: 'relative', zIndex: 2 }}>
                <PremiumHeader invert={false} />
                <div style={{ background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`, borderRadius: 24, padding: '6px 20px', fontSize: 10, color: '#fff', fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', boxShadow: '0 6px 16px rgba(99,102,241,0.3)' }}>NEW MEMBER</div>
            </div>

            {/* Welcome banner text */}
            <div style={{ textAlign: 'center', marginTop: 18, position: 'relative', zIndex: 2 }}>
                <h1 style={{ margin: 0, fontSize: 52, fontWeight: 950, background: `linear-gradient(135deg, #1e1b4b 20%, ${primaryColor} 60%, ${accentColor} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1.8px', textTransform: 'uppercase', lineHeight: 1 }}>WELCOME</h1>
                <div style={{ fontSize: 14, color: primaryColor, fontWeight: 800, letterSpacing: 4, marginTop: 6, textTransform: 'uppercase' }}>OUR NEW TEACHER</div>
            </div>

            {/* Main glass card - Expanded to capture space */}
            <div style={{ margin: '26px 28px 0', background: 'rgba(255, 255, 255, 0.72)', border: '1.5px solid rgba(255, 255, 255, 0.95)', borderRadius: 32, padding: '28px 32px', boxShadow: '0 25px 50px rgba(30,27,75,0.08)', backdropFilter: 'blur(12px)', position: 'relative', zIndex: 2 }}>
                
                <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
                    {/* Large profile image with corner Verified stamp */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: 150, height: 185, borderRadius: 24, overflow: 'hidden', border: '5px solid #fff', boxShadow: '0 12px 30px rgba(0,0,0,0.1)', background: '#e2e8f0' }}>
                            {teacherImage ? (
                                <img 
                                    src={teacherImage} 
                                    alt={teacherName} 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover',
                                        transform: `scale(${imageZoom}) translate(${imageOffsetX}px, ${imageOffsetY}px) rotate(${imageRotate}deg)`,
                                        transformOrigin: 'center center'
                                    }} 
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc', fontSize: 56 }}>👤</div>
                            )}
                        </div>
                        <VerifiedStamp theme="green" />
                    </div>

                    {/* Teacher Text Credentials */}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 24, fontWeight: 950, color: '#1e1b4b', marginBottom: 6, letterSpacing: '-0.3px' }}>{teacherName}</div>
                        <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.08)', border: '1.5px solid rgba(99,102,241,0.18)', borderRadius: 10, padding: '4px 14px', fontSize: 13, fontWeight: 800, color: primaryColor, marginBottom: 10 }}>
                            {designation}
                        </div>
                        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{university}</div>
                    </div>
                </div>

                <div style={{ height: 1.5, background: 'linear-gradient(90deg, rgba(99,102,241,0.15), transparent)', margin: '22px 0' }} />

                {/* Message block */}
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.85, color: '#2e2a72', fontWeight: 500, textAlign: 'justify' }}>
                    {welcomeMessage}
                </p>
            </div>

            {/* Footer with gradient action badge */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 32px', borderTop: '1px solid rgba(30,27,75,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.85)', zIndex: 2 }}>
                <span style={{ fontSize: 11, color: '#475569', fontWeight: 700 }}>{tagline}</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '5px', background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`, padding: '8px 18px', borderRadius: 24, boxShadow: '0 6px 16px rgba(99,102,241,0.25)' }}>
                    <span>☎</span>
                    <WhatsAppIcon size={11} color="#fff" />
                    <span>{helpline}</span>
                </span>
            </div>
        </div>
    );
};

const WT3MinimalistEditorial = ({ data }) => {
    const { teacherName, designation, university, welcomeMessage, teacherImage, primaryColor = '#1e3a1f', accentColor = '#c2410c', helpline, tagline, imageZoom = 1, imageOffsetX = 0, imageOffsetY = 0, imageRotate = 0 } = data;
    return (
        <div style={{ width: 600, height: 780, background: '#fdfcf9', border: '24px solid #1e3a1f', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif", boxSizing: 'border-box' }}>
            <WatermarkBlock invert={false} />
            <div style={{ position: 'absolute', inset: 6, border: '1px solid rgba(30,58,31,0.18)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 10, border: '1.5px dashed rgba(194,65,12,0.25)', pointerEvents: 'none' }} />
            
            {/* Top header area */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 24, borderBottom: '1.5px solid #eae6df', paddingBottom: 18, margin: '0 32px', position: 'relative', zIndex: 2 }}>
                <PremiumHeader invert={false} accentColor={accentColor} />
                <div style={{ marginTop: 14, fontSize: 11, color: accentColor, textTransform: 'uppercase', letterSpacing: 5, fontWeight: 900 }}>WELCOME OUR NEW TEACHER</div>
            </div>

            {/* Layout Grid */}
            <div style={{ display: 'flex', padding: '28px 36px 0', gap: 28, position: 'relative', zIndex: 2 }}>
                {/* Portrait Column */}
                <div style={{ width: 210, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ position: 'relative', width: 210, height: 260, border: '2px solid #1e3a1f', padding: 6, background: '#fff', boxSizing: 'border-box', boxShadow: '0 10px 25px rgba(30,58,31,0.08)' }}>
                        <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: '#f5f0eb' }}>
                            {teacherImage ? (
                                <img 
                                    src={teacherImage} 
                                    alt={teacherName} 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover',
                                        transform: `scale(${imageZoom}) translate(${imageOffsetX}px, ${imageOffsetY}px) rotate(${imageRotate}deg)`,
                                        transformOrigin: 'center center'
                                    }} 
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2cbd2', fontSize: 64 }}>👤</div>
                            )}
                        </div>
                        <VerifiedStamp theme="dark" />
                    </div>
                </div>

                {/* Information details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ borderLeft: `4px solid ${primaryColor}`, paddingLeft: 18 }}>
                        <span style={{ fontSize: 11, color: '#8c8275', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 800 }}>Introducing Our New Tutor</span>
                        <h2 style={{ margin: '8px 0 8px', fontSize: 26, fontWeight: 900, color: '#1e3a1f', letterSpacing: '-0.5px', lineHeight: 1.25 }}>{teacherName}</h2>
                        <div style={{ fontSize: 14, fontWeight: 800, color: accentColor, fontStyle: 'italic', marginBottom: 6 }}>{designation}</div>
                        <div style={{ fontSize: 12.5, color: '#686156', fontWeight: 600 }}>{university}</div>
                    </div>
                    
                    {/* Bullet Credentials */}
                    <div style={{ marginTop: 22, borderTop: '1px dashed #eae6df', paddingTop: 16 }}>
                        {['Verified Profile Details', 'Expert Academic Curriculum', '5.0 Highly Rated Instructor'].map((txt, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#57534e', marginBottom: 6, fontWeight: 600 }}>
                                <span style={{ color: primaryColor, fontWeight: 900 }}>✓</span>
                                <span>{txt}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Welcome Quote/Message Block */}
            <div style={{ padding: '24px 36px 0', position: 'relative', zIndex: 2 }}>
                <div style={{ borderTop: '1.5px solid #eae6df', paddingTop: 20, position: 'relative' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: accentColor, position: 'absolute', top: 10, left: -6 }}>“</span>
                    <p style={{ margin: 0, paddingLeft: 16, fontSize: 14, lineHeight: 1.9, color: '#292524', fontStyle: 'italic', fontFamily: "'Hind Siliguri', Georgia, serif", textAlign: 'justify' }}>
                        {welcomeMessage}
                    </p>
                </div>
            </div>

            {/* Bottom Info Bar */}
            <div style={{ position: 'absolute', bottom: 18, left: 36, right: 36, borderTop: '1.5px solid #eae6df', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                <span style={{ fontSize: 10.5, color: '#7c7267', letterSpacing: 1.2, fontWeight: 700 }}>{tagline}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1e3a1f', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>☎</span>
                    <WhatsAppIcon size={12} color="#1e3a1f" />
                    <span>{helpline}</span>
                </span>
            </div>
        </div>
    );
};

/* Helper Flower Decoration */
const FlowerDecoration = ({ size = 42, color1 = '#ec4899', color2 = '#f43f5e' }) => (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
        <circle cx="50" cy="50" r="13" fill="#facc15" />
        <circle cx="50" cy="22" r="18" fill={color1} />
        <circle cx="50" cy="78" r="18" fill={color1} />
        <circle cx="22" cy="50" r="18" fill={color2} />
        <circle cx="78" cy="50" r="18" fill={color2} />
        <circle cx="31" cy="31" r="16" fill="#10b981" />
        <circle cx="69" cy="69" r="16" fill="#3b82f6" />
        <circle cx="31" cy="69" r="16" fill="#f59e0b" />
        <circle cx="69" cy="31" r="16" fill="#8b5cf6" />
    </svg>
);

/* ══════════════════════════════════════════════════
   WELCOME TEACHER — 4: FLORAL FIESTA
   pastel rainbow background, 4-corner colorful flowers
   ══════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════
   WELCOME TEACHER — 4: FLORAL FIESTA
   pastel rainbow background, 4-corner colorful flowers
   ══════════════════════════════════════════════════ */
const WT4FloralFiesta = ({ data }) => {
    const { teacherName, designation, university, welcomeMessage, teacherImage, primaryColor = '#db2777', accentColor = '#2563eb', helpline, tagline, imageZoom = 1, imageOffsetX = 0, imageOffsetY = 0, imageRotate = 0 } = data;
    return (
        <div style={{ width: 600, height: 780, background: 'linear-gradient(135deg, #fff7ed 0%, #fae8ff 50%, #e0f2fe 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <WatermarkBlock invert={false} />
            
            {/* Elegant Floral Frame Accents (Placed around the border without overlapping text) */}
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 3 }}><PremiumFlower size={38} color="#ec4899" /></div>
            <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 3 }}><PremiumFlower size={38} color="#f43f5e" /></div>
            <div style={{ position: 'absolute', bottom: 76, left: 20, zIndex: 3 }}><PremiumFlower size={38} color="#3b82f6" /></div>
            <div style={{ position: 'absolute', bottom: 76, right: 20, zIndex: 3 }}><PremiumFlower size={38} color="#a855f7" /></div>
            <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}><PremiumFlower size={30} color="#f97316" /></div>
            <div style={{ position: 'absolute', bottom: 76, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}><PremiumFlower size={30} color="#10b981" /></div>
            <div style={{ position: 'absolute', top: '45%', left: 20, transform: 'translateY(-50%)', zIndex: 3 }}><PremiumFlower size={30} color="#06b6d4" /></div>
            <div style={{ position: 'absolute', top: '45%', right: 20, transform: 'translateY(-50%)', zIndex: 3 }}><PremiumFlower size={30} color="#e11d48" /></div>
            
            {/* Decorative inner frame */}
            <div style={{ position: 'absolute', top: 36, bottom: 92, left: 36, right: 36, border: '3px solid #fbcfe8', borderRadius: 20, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 40, bottom: 96, left: 40, right: 40, border: '1px dashed #93c5fd', borderRadius: 16, pointerEvents: 'none' }} />

            {/* Header Content */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 52, position: 'relative', zIndex: 2 }}>
                <PremiumHeader invert={false} accentColor={accentColor} />
                <div style={{ marginTop: 18, fontSize: 13, color: '#be185d', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 4 }}>
                    ✿ Welcome ✿
                </div>
                <h1 style={{ margin: '6px 0 0', fontSize: 34, fontWeight: 950, color: '#4c1d95', letterSpacing: '0.5px' }}>OUR NEW TEACHER</h1>
            </div>

            {/* Photo frame */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, position: 'relative', zIndex: 2 }}>
                <div style={{ position: 'relative', width: 170, height: 170 }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '6px solid #fff', boxShadow: '0 10px 25px rgba(219,39,119,0.15)', overflow: 'hidden', background: '#f5f5f5' }}>
                        {teacherImage ? (
                            <img 
                                src={teacherImage} 
                                alt={teacherName} 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    transform: `scale(${imageZoom}) translate(${imageOffsetX}px, ${imageOffsetY}px) rotate(${imageRotate}deg)`,
                                    transformOrigin: 'center center'
                                }} 
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#db2777', fontSize: 56 }}>👤</div>
                        )}
                    </div>
                    <VerifiedStamp theme="green" />
                </div>
            </div>

            {/* Details Panel */}
            <div style={{ textAlign: 'center', padding: '20px 42px 0', position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#312e81', letterSpacing: '-0.3px' }}>{teacherName}</div>
                <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #fbcfe8, #c7d2fe)', borderRadius: 20, padding: '4px 16px', fontSize: 12.5, fontWeight: 800, color: '#4c1d95', marginTop: 8 }}>
                    {designation}
                </div>
                <div style={{ fontSize: 12, color: '#4b5563', marginTop: 6, fontWeight: 600 }}>{university}</div>

                {/* Message */}
                <div style={{ background: '#fff', border: '1.5px solid #fbcfe8', borderRadius: 20, padding: '16px 20px', marginTop: 18, boxShadow: '0 8px 24px rgba(219,39,119,0.04)' }}>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: '#4c1d95', fontStyle: 'italic', fontWeight: 500 }}>
                        "{welcomeMessage}"
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderTop: '1.5px solid #fbcfe8', zIndex: 2 }}>
                <span style={{ fontSize: 10.5, color: '#6b7280', fontWeight: 700 }}>{tagline}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#be185d', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span>☎</span>
                    <WhatsAppIcon size={12} color="#be185d" />
                    <span>{helpline}</span>
                </span>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   WELCOME TEACHER — 5: LADY TEACHER PINK
   Cherry blossom pink layout, elegant curves, premium
   ══════════════════════════════════════════════════ */
const WT5PinkLady = ({ data }) => {
    const { teacherName, designation, university, welcomeMessage, teacherImage, primaryColor = '#db2777', accentColor = '#fda4af', helpline, tagline, imageZoom = 1, imageOffsetX = 0, imageOffsetY = 0, imageRotate = 0 } = data;
    return (
        <div style={{ width: 600, height: 780, background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fcc5d8 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <WatermarkBlock invert={false} />
            
            {/* Elegant glowing background sparkles */}
            <div style={{ position: 'absolute', top: '10%', left: '15%', fontSize: 22, color: '#f43f5e', opacity: 0.35 }}>🌸</div>
            <div style={{ position: 'absolute', top: '25%', right: '12%', fontSize: 16, color: '#f43f5e', opacity: 0.25 }}>🌸</div>
            <div style={{ position: 'absolute', bottom: '25%', left: '10%', fontSize: 18, color: '#f43f5e', opacity: 0.3 }}>🌸</div>
            <div style={{ position: 'absolute', bottom: '15%', right: '18%', fontSize: 20, color: '#f43f5e', opacity: 0.4 }}>🌸</div>

            {/* Glowing accents */}
            <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: 380, height: 280, background: 'radial-gradient(circle, rgba(244,63,94,0.18) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

            {/* Delicate border */}
            <div style={{ position: 'absolute', inset: 16, border: '1px solid rgba(244,63,94,0.2)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 20, border: '2px solid #fda4af', pointerEvents: 'none' }} />

            {/* Header Content */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40, position: 'relative', zIndex: 2 }}>
                <PremiumHeader invert={false} accentColor={accentColor} />
                <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: 4, fontWeight: 800 }}>Welcome to TSF Family</span>
                </div>
                <h1 style={{ margin: '6px 0 0', fontSize: 32, fontWeight: 900, color: '#9d174d', letterSpacing: '0.5px' }}>WELCOME OUR NEW TEACHER</h1>
            </div>

            {/* Elegant Oval Frame for Photo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 26, position: 'relative', zIndex: 2 }}>
                <div style={{ position: 'relative', width: 170, height: 210 }}>
                    {/* Ring decoration */}
                    <div style={{ position: 'absolute', inset: -8, borderRadius: '85px 85px 85px 85px', border: '1px dashed #fda4af' }} />
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '85px 85px 85px 85px', border: '4px solid #fff', boxShadow: '0 12px 30px rgba(244,63,94,0.18)', overflow: 'hidden', background: '#ffe4e6' }}>
                        {teacherImage ? (
                            <img 
                                src={teacherImage} 
                                alt={teacherName} 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    transform: `scale(${imageZoom}) translate(${imageOffsetX}px, ${imageOffsetY}px) rotate(${imageRotate}deg)`,
                                    transformOrigin: 'center center'
                                }} 
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fda4af', fontSize: 60 }}>👤</div>
                        )}
                    </div>
                    <VerifiedStamp theme="green" />
                </div>
            </div>

            {/* Teacher Details */}
            <div style={{ textAlign: 'center', padding: '24px 44px 0', position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#9d174d', letterSpacing: '-0.3px' }}>{teacherName}</div>
                <div style={{ display: 'inline-block', background: 'rgba(244,63,94,0.06)', border: '1.5px solid #f43f5e44', borderRadius: 8, padding: '3px 14px', fontSize: 12.5, fontWeight: 800, color: '#f43f5e', marginTop: 8 }}>
                    {designation}
                </div>
                <div style={{ fontSize: 12, color: '#881337', opacity: 0.7, marginTop: 6, fontWeight: 600 }}>{university}</div>

                {/* Quote block */}
                <div style={{ background: 'rgba(255, 255, 255, 0.75)', border: '1.5px solid rgba(244,63,94,0.15)', borderRadius: 22, padding: '18px 22px', marginTop: 20, boxShadow: '0 8px 24px rgba(244,63,94,0.05)', backdropFilter: 'blur(5px)' }}>
                    <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.8, color: '#4c0519', fontStyle: 'italic', fontWeight: 500 }}>
                        "{welcomeMessage}"
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 36px', borderTop: '1px solid rgba(244,63,94,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.8)', zIndex: 2 }}>
                <span style={{ fontSize: 10.5, color: '#9d174d', fontWeight: 600 }}>{tagline}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#f43f5e', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span>☎</span>
                    <WhatsAppIcon size={12} color="#f43f5e" />
                    <span>{helpline}</span>
                </span>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   WELCOME TEACHER — 6: EMERALD GOLD LUXURY
   Deep emerald forest green gradient, premium gold borders & frames
   ══════════════════════════════════════════════════ */
const WT6EmeraldGold = ({ data }) => {
    const { teacherName, designation, university, welcomeMessage, teacherImage, helpline, tagline, imageZoom = 1, imageOffsetX = 0, imageOffsetY = 0, imageRotate = 0 } = data;
    return (
        <div style={{ width: 600, height: 780, background: 'linear-gradient(135deg, #022c22 0%, #023e2f 40%, #011c15 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <WatermarkBlock invert={true} />
            
            {/* Glowing gold spheres in background */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            
            {/* Golden corner geometric frames */}
            <div style={{ position: 'absolute', top: 20, left: 20, width: 24, height: 24, borderLeft: '3px solid #fbbf24', borderTop: '3px solid #fbbf24' }} />
            <div style={{ position: 'absolute', top: 20, right: 20, width: 24, height: 24, borderRight: '3px solid #fbbf24', borderTop: '3px solid #fbbf24' }} />
            <div style={{ position: 'absolute', bottom: 76, left: 20, width: 24, height: 24, borderLeft: '3px solid #fbbf24', borderBottom: '3px solid #fbbf24' }} />
            <div style={{ position: 'absolute', bottom: 76, right: 20, width: 24, height: 24, borderRight: '3px solid #fbbf24', borderBottom: '3px solid #fbbf24' }} />
            
            {/* Inner golden border */}
            <div style={{ position: 'absolute', top: 28, bottom: 84, left: 28, right: 28, border: '1px solid rgba(251,191,36,0.2)', pointerEvents: 'none' }} />
            
            {/* Header Content */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 45, position: 'relative', zIndex: 2 }}>
                <PremiumHeader invert={true} accentColor="#fbbf24" />
                <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #fbbf24)' }} />
                    <span style={{ fontSize: 12, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 5, fontWeight: 800 }}>Welcome New Member</span>
                    <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, #fbbf24, transparent)' }} />
                </div>
                <h1 style={{ margin: '6px 0 0', fontSize: 32, fontWeight: 950, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>WELCOME OUR NEW TEACHER</h1>
            </div>

            {/* Premium Gold Frame for Profile Picture */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28, position: 'relative', zIndex: 2 }}>
                <div style={{ position: 'relative', width: 176, height: 176 }}>
                    {/* Ring glow */}
                    <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '2px solid rgba(251,191,36,0.3)', boxShadow: '0 0 20px rgba(251,191,36,0.15)' }} />
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(135deg, #fbbf24, #d97706)', padding: 4 }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#022c22' }}>
                            {teacherImage ? (
                                <img 
                                    src={teacherImage} 
                                    alt={teacherName} 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover',
                                        transform: `scale(${imageZoom}) translate(${imageOffsetX}px, ${imageOffsetY}px) rotate(${imageRotate}deg)`,
                                        transformOrigin: 'center center'
                                    }} 
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', fontSize: 60 }}>👤</div>
                            )}
                        </div>
                    </div>
                    <VerifiedStamp theme="gold" />
                </div>
            </div>

            {/* Teacher Details */}
            <div style={{ textAlign: 'center', padding: '24px 44px 0', position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{teacherName}</div>
                <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(217,119,6,0.12))', border: '1.5px solid #fbbf2488', borderRadius: 8, padding: '4px 16px', fontSize: 13, fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {designation}
                </div>
                <div style={{ fontSize: 12.5, color: '#a7f3d0', marginTop: 8, fontWeight: 600, opacity: 0.85 }}>{university}</div>

                {/* Elegant gold quote card */}
                <div style={{ background: 'rgba(5, 46, 32, 0.6)', border: '1.5px solid rgba(251,191,36,0.25)', borderRadius: 22, padding: '20px 24px', marginTop: 22, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)' }}>
                    <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.85, color: '#f3f4f6', fontStyle: 'italic', fontWeight: 500 }}>
                        "{welcomeMessage}"
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 38px', borderTop: '1px solid rgba(251,191,36,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(1, 28, 21, 0.95)', zIndex: 2 }}>
                <span style={{ fontSize: 11, color: '#a7f3d0', fontWeight: 600, opacity: 0.75 }}>{tagline}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#fbbf24', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>☎</span>
                    <WhatsAppIcon size={12} color="#fbbf24" />
                    <span>{helpline}</span>
                </span>
            </div>
        </div>
    );
};

const WT7ClassroomChalkboard = ({ data }) => {
    const { teacherName, designation, university, welcomeMessage, teacherImage, helpline, tagline, imageZoom = 1, imageOffsetX = 0, imageOffsetY = 0, imageRotate = 0 } = data;
    return (
        <div style={{ width: 600, height: 780, background: 'linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <WatermarkBlock invert={true} />
            
            {/* Background 3D Classroom Wall styling */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, #475569 40px, #475569 42px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', background: 'radial-gradient(circle at 50% 0%, rgba(251,191,36,0.15) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

            {/* Suspended 3D Chalkboard (hanging from wires) */}
            <div style={{ position: 'absolute', top: 40, left: 32, right: 32, height: 470, background: '#13261f', border: '12px solid #5c3015', borderRadius: 6, boxShadow: '0 25px 50px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.8), 0 0 0 2px #7c2d12', boxSizing: 'border-box', zIndex: 2 }}>
                {/* Board Suspension Wires */}
                <div style={{ position: 'absolute', top: -55, left: '20%', width: 2, height: 45, background: '#64748b', zIndex: 1 }} />
                <div style={{ position: 'absolute', top: -55, right: '20%', width: 2, height: 45, background: '#64748b', zIndex: 1 }} />

                {/* Chalk Dust Texture */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: 'radial-gradient(circle, #fff 10%, transparent 11%), radial-gradient(circle, #fff 10%, transparent 11%)', backgroundSize: '15px 15px', backgroundPosition: '0 0, 8px 8px', pointerEvents: 'none' }} />
                
                {/* Chalk-drawn mathematical/scientific doodles */}
                <div style={{ position: 'absolute', top: 15, left: 15, color: 'rgba(255,255,255,0.12)', fontFamily: 'monospace', fontSize: 11, userSelect: 'none', lineHeight: 1.4 }}>
                    E = mc²<br/>H₂O + CO₂<br/>Δx · Δp ≥ ℏ
                </div>
                <div style={{ position: 'absolute', top: 15, right: 15, color: 'rgba(255,255,255,0.12)', fontFamily: 'monospace', fontSize: 11, textAlign: 'right', userSelect: 'none', lineHeight: 1.4 }}>
                    f(x) = ∫ y dx<br/>π ≈ 3.14159<br/>a² + b² = c²
                </div>

                {/* Chalkboard Header */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20, width: '100%' }}>
                    <PremiumHeader invert={true} accentColor="#fbbf24" />
                    <h1 style={{ 
                        margin: '14px 0 0', 
                        fontSize: 30, 
                        fontWeight: 700, 
                        color: 'rgba(255, 255, 255, 0.95)', 
                        letterSpacing: '1px', 
                        textTransform: 'uppercase', 
                        fontFamily: "'Cabin Sketch', 'Poppins', sans-serif",
                        textShadow: '0 0 2px rgba(255, 255, 255, 0.85), 1px 1px 2px rgba(255, 255, 255, 0.3), -1px -1px 0px rgba(0, 0, 0, 0.15)'
                    }}>
                        WELCOME OUR NEW TEACHER
                    </h1>
                </div>

                {/* Chalk-drawn quote box holding the Welcome Message */}
                <div style={{ margin: '40px 28px 0', border: '1.5px solid rgba(255, 255, 255, 0.2)', borderRadius: 12, padding: '24px 20px', background: 'rgba(255, 255, 255, 0.01)', boxShadow: 'inset 0 0 8px rgba(255, 255, 255, 0.01)' }}>
                    <p style={{ 
                        margin: 0, 
                        fontSize: 14.5, 
                        lineHeight: 1.95, 
                        color: 'rgba(255, 255, 255, 0.9)', 
                        fontStyle: 'italic', 
                        fontWeight: 600, 
                        textAlign: 'center',
                        textShadow: '0 0 1px rgba(255, 255, 255, 0.65), 1px 1px 1px rgba(255, 255, 255, 0.3), -1px -1px 0px rgba(0, 0, 0, 0.1)'
                    }}>
                        "{welcomeMessage}"
                    </p>
                </div>

                {/* Wooden Chalk Ledge with chalks */}
                <div style={{ position: 'absolute', bottom: -12, left: -12, right: -12, height: 12, background: '#7c2d12', borderTop: '2px solid #9a3412', borderRadius: '0 0 4px 4px', boxShadow: '0 8px 16px rgba(0,0,0,0.4)', display: 'flex', gap: 10, paddingLeft: 20 }}>
                    <div style={{ width: 14, height: 5, background: '#fff', borderRadius: 1.5, transform: 'rotate(2deg)', boxShadow: '1px 1px 2px rgba(0,0,0,0.3)', marginTop: -2 }} />
                    <div style={{ width: 18, height: 5, background: '#fef08a', borderRadius: 1.5, transform: 'rotate(-4deg)', boxShadow: '1px 1px 2px rgba(0,0,0,0.3)', marginTop: -2 }} />
                </div>
            </div>

            {/* 3D Classroom Wooden Desk surface in lower section */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 250, zIndex: 3, pointerEvents: 'none' }}>
                
                {/* 3D Perspective Table Top */}
                <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: -100, 
                    right: -100, 
                    height: 100, 
                    background: 'linear-gradient(to bottom, #a16207 0%, #78350f 100%)', 
                    transform: 'perspective(400px) rotateX(24deg)', 
                    transformOrigin: 'bottom center',
                    boxShadow: '0 -15px 35px rgba(0,0,0,0.65), inset 0 3px 6px rgba(255,255,255,0.15)',
                    borderBottom: '4px solid #451a03'
                }} />

                {/* Vertical Desk Front Facing Wood Panel */}
                <div style={{ 
                    position: 'absolute', 
                    top: 96, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: 'linear-gradient(to bottom, #78350f 0%, #451a03 100%)',
                    boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.5)'
                }} />

                {/* 3D Standing Picture Frame (Left Side) */}
                <div style={{ 
                    position: 'absolute', 
                    top: -110, 
                    left: 60, 
                    width: 210, 
                    height: 210, 
                    zIndex: 4, 
                    transform: 'perspective(500px) rotateY(-10deg) rotateX(8deg) rotateZ(1deg)',
                    transformOrigin: 'bottom center',
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.55)',
                        filter: 'blur(12px)',
                        transform: 'translate(18px, 22px) scale(0.95)',
                        borderRadius: 14,
                        zIndex: -1
                    }} />

                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '42%',
                        width: 32,
                        height: 120,
                        background: '#3f1f0a',
                        transform: 'rotateX(-30deg) translateZ(-40px)',
                        boxShadow: '4px 4px 10px rgba(0,0,0,0.7)',
                        zIndex: -1
                    }} />

                    <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        borderRadius: 14, 
                        border: '8px solid #f8fafc', 
                        boxShadow: 'inset 0 0 12px rgba(0,0,0,0.25), 0 15px 35px rgba(0,0,0,0.5)', 
                        overflow: 'hidden', 
                        background: '#1e293b', 
                        boxSizing: 'border-box',
                        position: 'relative'
                    }}>
                        {teacherImage ? (
                            <img 
                                src={teacherImage} 
                                alt={teacherName} 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    transform: `scale(${imageZoom}) translate(${imageOffsetX}px, ${imageOffsetY}px) rotate(${imageRotate}deg)`,
                                    transformOrigin: 'center center'
                                }} 
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 64 }}>👤</div>
                        )}
                        <VerifiedStamp theme="wax" />
                    </div>
                </div>

                {/* 3D Standing Clipboard Details Board (Right Side) */}
                <div style={{ 
                    position: 'absolute', 
                    top: -100, 
                    left: 290, 
                    width: 250, 
                    height: 180, 
                    zIndex: 4, 
                    transform: 'perspective(500px) rotateY(10deg) rotateX(8deg) rotateZ(-1deg)',
                    transformOrigin: 'bottom center',
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.55)',
                        filter: 'blur(12px)',
                        transform: 'translate(14px, 22px) scale(0.95)',
                        borderRadius: 12,
                        zIndex: -1
                    }} />

                    {/* Clipboard body */}
                    <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        borderRadius: 12, 
                        background: '#fef3c7', 
                        border: '5px solid #d97706', 
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05), 0 15px 35px rgba(0,0,0,0.5)', 
                        padding: '24px 18px 18px', 
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative'
                    }}>
                        {/* Metal Clip at top of clipboard */}
                        <div style={{ position: 'absolute', top: -10, width: 60, height: 20, background: '#94a3b8', border: '2px solid #64748b', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 6px rgba(0,0,0,0.2)' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#475569' }} />
                        </div>

                        <div style={{ fontSize: 22, fontWeight: 950, color: '#7c2d12', textAlign: 'center', letterSpacing: '-0.3px', lineHeight: 1.2 }}>{teacherName}</div>
                        <div style={{ background: '#d97706', borderRadius: 8, padding: '3px 12px', fontSize: 11, fontWeight: 800, color: '#fff', marginTop: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {designation}
                        </div>
                        <div style={{ fontSize: 12, color: '#451a03', marginTop: 8, fontWeight: 700, textAlign: 'center' }}>{university}</div>
                    </div>
                </div>

                {/* 3D Standing Pencil Holder Cup on the Desk (Far Right) */}
                <div style={{ position: 'absolute', top: -25, left: 545, width: 34, height: 60, zIndex: 4, transform: 'perspective(400px) rotateX(10deg)' }}>
                    <div style={{ position: 'absolute', bottom: -4, left: 1, width: 32, height: 7, background: 'rgba(0,0,0,0.5)', filter: 'blur(2.5px)', borderRadius: '50%' }} />
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 70%, #92400e 100%)', borderRadius: '3px 3px 5px 5px', borderTop: '2px solid #b45309', boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.2), 0 6px 12px rgba(0,0,0,0.4)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: -26, left: 6, width: 4, height: 32, background: '#ef4444', transform: 'rotate(-12deg)', borderRadius: '1px 1px 0 0' }} />
                        <div style={{ position: 'absolute', top: -22, left: 14, width: 4, height: 28, background: '#3b82f6', transform: 'rotate(8deg)', borderRadius: '1px 1px 0 0' }} />
                        <div style={{ position: 'absolute', top: -28, left: 22, width: 4, height: 34, background: '#10b981', transform: 'rotate(3deg)', borderRadius: '1px 1px 0 0' }} />
                    </div>
                </div>

                {/* 3D Red Apple on the Desk (Far Left) */}
                <div style={{ position: 'absolute', top: -10, left: 15, width: 28, height: 28, zIndex: 5 }}>
                    <div style={{ position: 'absolute', bottom: -3, left: 2, width: 24, height: 6, background: 'rgba(0,0,0,0.6)', filter: 'blur(2.5px)', borderRadius: '50%' }} />
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #f43f5e 0%, #be123c 60%, #4c0519 100%)', boxShadow: '0 5px 10px rgba(0,0,0,0.3)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', width: 1.5, height: 6, background: '#78350f' }} />
                        <div style={{ position: 'absolute', top: -5, left: '56%', width: 4, height: 6, background: '#10b981', borderRadius: '0 5px 0 5px', transform: 'rotate(25deg)' }} />
                    </div>
                </div>
            </div>

            {/* Footer Bar overlaying desk front panel */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 36px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#3f1f0a', zIndex: 4 }}>
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{tagline}</span>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: '#fbbf24', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span>☎</span>
                    <WhatsAppIcon size={12} color="#fbbf24" />
                    <span>{helpline}</span>
                </span>
            </div>
        </div>
    );
};


/* ══════════════════════════════════════════════════
   WELCOME TEACHER — 8: 3D ART GALLERY EXHIBITION
   Luxurious spotlight wall with deep 3D ornate gold frame and acrylic message panel
   ══════════════════════════════════════════════════ */
const WT8GalleryExhibition = ({ data }) => {
    const { teacherName, designation, university, welcomeMessage, teacherImage, helpline, tagline, imageZoom = 1, imageOffsetX = 0, imageOffsetY = 0, imageRotate = 0 } = data;
    return (
        <div style={{ width: 600, height: 780, background: 'linear-gradient(135deg, #0b091a 0%, #03001e 50%, #02000a 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
            <WatermarkBlock invert={true} />
            
            {/* Cyberpunk Grid Background Overlay */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.04, background: 'linear-gradient(90deg, #fff 1px, transparent 1px) 0 0 / 40px 40px, linear-gradient(0deg, #fff 1px, transparent 1px) 0 0 / 40px 40px', pointerEvents: 'none' }} />
            
            {/* Glowing Neon Abstract Geometries in Background */}
            {/* Giant soft purple background ring */}
            <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 440, height: 440, borderRadius: '50%', border: '2px solid rgba(168, 85, 247, 0.15)', boxShadow: '0 0 60px rgba(168, 85, 247, 0.08), inset 0 0 60px rgba(168, 85, 247, 0.08)', zIndex: 1, pointerEvents: 'none' }} />

            {/* Glowing cyan diagonal beams */}
            <div style={{ position: 'absolute', top: -100, left: '10%', width: 2, height: 600, background: 'linear-gradient(to bottom, transparent, #06b6d4, transparent)', opacity: 0.3, transform: 'rotate(25deg)', zIndex: 1 }} />
            <div style={{ position: 'absolute', top: 200, right: '10%', width: 2, height: 600, background: 'linear-gradient(to bottom, transparent, #ec38bc, transparent)', opacity: 0.3, transform: 'rotate(25deg)', zIndex: 1 }} />

            {/* Header section with glowing title */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 32, position: 'relative', zIndex: 3 }}>
                <PremiumHeader invert={true} accentColor="#00f2fe" />
                <h1 style={{ 
                    margin: '14px 0 0', 
                    fontSize: 25, 
                    fontWeight: 950, 
                    color: '#ffffff', 
                    letterSpacing: '2px', 
                    textTransform: 'uppercase', 
                    textShadow: '0 0 10px rgba(0, 242, 254, 0.6), 0 0 20px rgba(168, 85, 247, 0.4)'
                }}>
                    WELCOME NEW TEACHER
                </h1>
            </div>

            {/* 3D Floating Holographic Photo Frame */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28, position: 'relative', zIndex: 3 }}>
                {/* Neon back glow */}
                <div style={{ position: 'absolute', width: 230, height: 230, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,242,254,0.2) 0%, transparent 70%)', filter: 'blur(10px)', zIndex: -1 }} />

                <div style={{ 
                    position: 'relative', 
                    width: 210, 
                    height: 210, 
                    borderRadius: '50%',
                    padding: 6,
                    background: 'linear-gradient(135deg, #00f2fe 0%, #a855f7 100%)',
                    boxShadow: '0 20px 50px rgba(0,242,254,0.35), inset 0 0 15px rgba(255,255,255,0.4)',
                }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#0a0915', border: '2px solid rgba(255,255,255,0.1)' }}>
                        {teacherImage ? (
                            <img 
                                src={teacherImage} 
                                alt={teacherName} 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    transform: `scale(${imageZoom}) translate(${imageOffsetX}px, ${imageOffsetY}px) rotate(${imageRotate}deg)`,
                                    transformOrigin: 'center center'
                                }} 
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 64 }}>👤</div>
                        )}
                    </div>

                    {/* Gold Verified Stamp overlapping on corner */}
                    <div style={{ position: 'absolute', bottom: 6, right: 12, transform: 'scale(1.05)' }}>
                        <VerifiedStamp theme="gold" />
                    </div>
                </div>
            </div>

            {/* Glassmorphic Credentials Plate (Floats below the frame) */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, position: 'relative', zIndex: 3 }}>
                <div style={{ 
                    background: 'rgba(255, 255, 255, 0.04)', 
                    border: '1.5px solid rgba(255, 255, 255, 0.12)', 
                    borderRadius: 12, 
                    padding: '12px 36px', 
                    boxShadow: '0 15px 35px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(16px)',
                    textAlign: 'center',
                    minWidth: 260
                }}>
                    <div style={{ fontSize: 22, fontWeight: 950, color: '#ffffff', letterSpacing: '-0.3px' }}>{teacherName}</div>
                    
                    <div style={{ 
                        display: 'inline-block',
                        background: 'linear-gradient(90deg, #00f2fe, #4facfe)',
                        borderRadius: 30, 
                        padding: '3px 14px', 
                        fontSize: 9.5, 
                        fontWeight: 900, 
                        color: '#03001e', 
                        marginTop: 8, 
                        textTransform: 'uppercase', 
                        letterSpacing: '1px',
                        boxShadow: '0 4px 10px rgba(0,242,254,0.3)'
                    }}>
                        {designation}
                    </div>
                    
                    <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginTop: 6 }}>{university}</div>
                </div>
            </div>

            {/* Large Frosted Glass Message Panel (Fills the bottom space perfectly) */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, padding: '0 40px', position: 'relative', zIndex: 3 }}>
                <div style={{ 
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)', 
                    border: '1.5px solid rgba(255, 255, 255, 0.08)', 
                    borderRadius: 18, 
                    padding: '24px 28px', 
                    boxShadow: '0 25px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)', 
                    backdropFilter: 'blur(20px)',
                    boxSizing: 'border-box'
                }}>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.85, color: '#e2e8f0', fontStyle: 'italic', fontWeight: 500, textAlign: 'center' }}>
                        "{welcomeMessage}"
                    </p>
                </div>
            </div>

            {/* 3D Reflective Floating Neon Spheres (Adds extreme depth and matches empty spots) */}
            {/* Left Cyan sphere */}
            <div style={{ 
                position: 'absolute', 
                bottom: 120, 
                left: 30, 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                background: 'radial-gradient(circle at 30% 30%, #00f2fe 0%, #090919 75%, #000 100%)',
                boxShadow: '0 12px 24px rgba(0,242,254,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
                zIndex: 4,
                pointerEvents: 'none'
            }} />
            {/* Right Purple sphere */}
            <div style={{ 
                position: 'absolute', 
                bottom: 150, 
                right: 30, 
                width: 44, 
                height: 44, 
                borderRadius: '50%', 
                background: 'radial-gradient(circle at 30% 30%, #a855f7 0%, #090919 75%, #000 100%)',
                boxShadow: '0 15px 30px rgba(168,85,247,0.35), inset 0 2px 4px rgba(255,255,255,0.2)',
                zIndex: 4,
                pointerEvents: 'none'
            }} />

            {/* Footer Bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 36px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(3, 0, 30, 0.95)', zIndex: 5 }}>
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{tagline}</span>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: '#00f2fe', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span>☎</span>
                    <WhatsAppIcon size={12} color="#00f2fe" />
                    <span>{helpline}</span>
                </span>
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
    const [wtTpl, setWtTpl] = useState(1);
    const [downloading, setDownloading] = useState(false);
    const posterRef = useRef(null);
    const downloadRef = useRef(null);
    const containerRef = useRef(null);
    const [scale, setScale] = useState(0.85);

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                const availableWidth = width - 60;
                const newScale = Math.min(1, Math.max(0.2, availableWidth / 600));
                setScale(newScale);
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const [gData, setGData] = useState({
        headline: 'অভিভাবকের অভিজ্ঞতা',
        quote: 'আমার সন্তানের জীবন বদলে দিয়েছে এই প্ল্যাটফর্ম। সঠিক টিউটর খোঁজা এখন অনেক সহজ। Tuition Seba Forum-এর সেবা সত্যিই প্রশংসনীয়।',
        name: 'নাম লিখুন', location: 'এলাকা, শহর', stars: 5, profileImage: null,
        accentColor: '#c8973a', helpline: '01633 920928', tagline: '১ প্ল্যাটফর্মেই টিউটর ও টিউশন',
    });
    const [tData, setTData] = useState({
        tutorName: 'টিউটরের নাম', university: 'University / Institution Name',
        monthYear: 'মে ২০২৬', stars: 5, rating: '5.0',
        tutorImage: null, secondaryImage: null, badgeLabel: 'TUTOR OF THE MONTH',
        primaryColor: '#1d4ed8', secondaryColor: '#db2777', accentGold: '#d97706',
        helpline: '01633 920928',
        issueDate: '13 July 2026',
        authorizedSignature: 'Md Mahedi Hasan',
        authorizedTitle: 'Authorized Signature',
    });
    const [wtData, setWtData] = useState({
        teacherName: 'তানজিলা রহমান',
        designation: 'Chemistry Specialist',
        university: 'Dhaka University',
        welcomeMessage: 'আমরা অত্যন্ত আনন্দিত ও গর্বিত যে, তানজিলা রহমান আমাদের Tuition Seba Forum-এ একজন সম্মানিত টিউটর হিসেবে যোগদান করেছেন। আমরা তাঁর উজ্জ্বল ভবিষ্যৎ ও সাফল্য কামনা করি।',
        teacherImage: null,
        primaryColor: '#4f46e5',
        accentColor: '#f43f5e',
        helpline: '01633 920928',
        tagline: 'Tuition Seba Forum - Platform for Best Tutors',
        imageZoom: 1.0,
        imageOffsetX: 0,
        imageOffsetY: 0,
        imageRotate: 0
    });

    const updG = (k, v) => setGData(p => ({ ...p, [k]: v }));
    const updT = (k, v) => setTData(p => ({ ...p, [k]: v }));
    const updWT = (k, v) => setWtData(p => ({ ...p, [k]: v }));

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
            await document.fonts.ready;
            const canvas = await html2canvas(downloadRef.current, {
                scale: 3,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
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
            {[1, 2, 3, 4, 5].map(s => (
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

    const gTplNames = { 1: 'Midnight Gold', 2: 'Light Editorial', 3: 'Navy Card', 4: 'Warm Minimal', 5: 'Modern Colorful' };
    const tTplNames = { 1: 'Professional Split', 2: 'Award Elegant', 3: 'Modern Dark', 4: 'Natural Sage', 5: 'Vibrant Mesh' };
    const wtTplNames = { 1: 'Royal Welcome', 2: 'Modern Creative', 3: 'Minimalist Editorial', 4: 'Floral Fiesta', 5: 'Lady Teacher Pink', 6: 'Emerald Gold', 7: 'Classroom Design', 8: '3D Gallery Wall' };

    const activeTpl = category === 'guardian' ? gTpl : (category === 'teacher' ? tTpl : wtTpl);
    const setActiveTpl = category === 'guardian' ? setGTpl : (category === 'teacher' ? setTTpl : setWtTpl);
    const tplNames = category === 'guardian' ? gTplNames : (category === 'teacher' ? tTplNames : wtTplNames);
    const mainColor = category === 'guardian' ? '#c8973a' : (category === 'teacher' ? '#1d4ed8' : '#10b981');
    const targetHeight = (category === 'guardian') ? 750 : 780;

    return (
        <div style={{ fontFamily: 'Poppins,sans-serif' }}>
            <div className="poster-header" style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)', borderRadius: 20, padding: '20px 26px', marginBottom: 22, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 36px rgba(79,70,229,0.35)', position: 'relative', overflow: 'hidden' }}>
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

            <div className="poster-tabs" style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                {[
                    { key: 'guardian', icon: '👨‍👩‍👧', label: 'Guardian Review', color: '#c8973a' },
                    { key: 'teacher', icon: '🏆', label: 'Teacher Recognition', color: '#1d4ed8' },
                    { key: 'welcome_teacher', icon: '👋', label: 'Welcome Teacher', color: '#10b981' }
                ].map(t => (
                    <button key={t.key} onClick={() => setCategory(t.key)} style={{ padding: '10px 22px', borderRadius: 12, border: `2px solid ${category === t.key ? t.color : '#e2e8f0'}`, background: category === t.key ? t.color : '#fff', color: category === t.key ? '#fff' : '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Poppins', display: 'flex', alignItems: 'center', gap: 7, boxShadow: category === t.key ? `0 4px 14px ${t.color}44` : 'none', transition: 'all 0.15s' }}>
                        <span>{t.icon}</span>{t.label}
                    </button>
                ))}
            </div>

            <div className="poster-style-selector" style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '11px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0 }}>Style:</span>
                <div style={{ display: 'flex', gap: 8 }}>
                    {Object.keys(tplNames).map(Number).map(id => {
                        const sel = activeTpl === id;
                        return (
                            <button key={id} onClick={() => setActiveTpl(id)} style={{ width: 36, height: 36, borderRadius: 9, border: sel ? 'none' : '1.5px solid #cbd5e1', background: sel ? mainColor : '#fff', color: sel ? '#fff' : '#475569', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Poppins', boxShadow: sel ? `0 3px 10px ${mainColor}44` : 'none', transition: 'all 0.15s' }}>{id}</button>
                        );
                    })}
                </div>
                <span style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', marginLeft: 'auto' }}>{tplNames[activeTpl]}</span>
            </div>

            <div className="poster-layout" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <div className="poster-controls" style={{ width: 290, flexShrink: 0, background: '#fff', borderRadius: 18, border: '1.5px solid #e2e8f0', padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxHeight: '82vh', overflowY: 'auto' }}>
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
                    </>) : category === 'teacher' ? (<>
                        <div style={fw}><label style={lbl}>Tutor Name</label><input style={inp} value={tData.tutorName} onChange={e => updT('tutorName', e.target.value)} /></div>
                        <div style={fw}><label style={lbl}>University / Institution</label><input style={inp} value={tData.university} onChange={e => updT('university', e.target.value)} /></div>
                        <div style={fw}><label style={lbl}>Month &amp; Year</label><input style={inp} value={tData.monthYear} onChange={e => updT('monthYear', e.target.value)} /></div>
                        <div style={fw}><label style={lbl}>Badge Label</label><input style={inp} value={tData.badgeLabel} onChange={e => updT('badgeLabel', e.target.value)} /></div>
                        <div style={{ display: 'flex', gap: 12, ...fw }}>
                            <div style={{ flex: 1 }}><label style={lbl}>Issue / Award Date</label><input style={inp} value={tData.issueDate || ''} onChange={e => updT('issueDate', e.target.value)} /></div>
                            <div style={{ flex: 1 }}><label style={lbl}>Signatory Title</label><input style={inp} value={tData.authorizedTitle || ''} onChange={e => updT('authorizedTitle', e.target.value)} /></div>
                        </div>
                        <ImgField label="Tutor Photo" val={tData.tutorImage} onUp={e => onImg(e, updT, 'tutorImage')} onRm={() => updT('tutorImage', null)} h="70px" w="52px" />
                        {tTpl === 1 && <ImgField label="Secondary Photo" val={tData.secondaryImage} onUp={e => onImg(e, updT, 'secondaryImage')} onRm={() => updT('secondaryImage', null)} h="50px" w="65px" />}
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, marginBottom: 12 }}>
                            <label style={{ ...lbl, color: '#6366f1', marginBottom: 8 }}>🎨 Colors</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                {tTpl === 1 && [['primaryColor', 'Primary']].map(([k, l]) => <div key={k}><div style={lbl}>{l}</div><input type="color" defaultValue={tData[k]} onChange={e => updT(k, e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', padding: 2 }} /></div>)}
                                {tTpl === 2 && [['primaryColor', 'Primary'], ['accentGold', 'Gold']].map(([k, l]) => <div key={k}><div style={lbl}>{l}</div><input type="color" defaultValue={tData[k]} onChange={e => updT(k, e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', padding: 2 }} /></div>)}
                                {tTpl === 3 && [['primaryColor', 'Color 1'], ['secondaryColor', 'Color 2']].map(([k, l]) => <div key={k}><div style={lbl}>{l}</div><input type="color" defaultValue={tData[k]} onChange={e => updT(k, e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', padding: 2 }} /></div>)}
                                {tTpl === 4 && [['primaryColor', 'Accent']].map(([k, l]) => <div key={k}><div style={lbl}>{l}</div><input type="color" defaultValue={tData[k]} onChange={e => updT(k, e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', padding: 2 }} /></div>)}
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                            <div style={fw}><label style={lbl}>Helpline</label><input style={inp} value={tData.helpline} onChange={e => updT('helpline', e.target.value)} /></div>
                        </div>
                    </>) : (<>
                        <div style={fw}><label style={lbl}>Teacher Name</label><input style={inp} value={wtData.teacherName} onChange={e => updWT('teacherName', e.target.value)} /></div>
                        <div style={fw}><label style={lbl}>Designation</label><input style={inp} value={wtData.designation} onChange={e => updWT('designation', e.target.value)} /></div>
                        <div style={fw}><label style={lbl}>University / Institution</label><input style={inp} value={wtData.university} onChange={e => updWT('university', e.target.value)} /></div>
                        <div style={fw}><label style={lbl}>Welcome Message</label><textarea style={{ ...inp, height: 95, resize: 'vertical' }} value={wtData.welcomeMessage} onChange={e => updWT('welcomeMessage', e.target.value)} /></div>
                        
                        <ImgField label="Teacher Photo" val={wtData.teacherImage} onUp={e => onImg(e, updWT, 'teacherImage')} onRm={() => updWT('teacherImage', null)} h="70px" w="56px" />
                        
                        {/* Image adjustments controls */}
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, marginBottom: 14 }}>
                            <label style={{ ...lbl, color: '#10b981', marginBottom: 10 }}>📐 Adjust Picture</label>
                            
                            <div style={{ marginBottom: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
                                    <span>ZOOM ({wtData.imageZoom.toFixed(2)}x)</span>
                                    <button onClick={() => updWT('imageZoom', 1.0)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: 10, padding: 0 }}>Reset</button>
                                </div>
                                <input type="range" min="0.5" max="2.5" step="0.05" value={wtData.imageZoom} onChange={e => updWT('imageZoom', parseFloat(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: '#10b981' }} />
                            </div>

                            <div style={{ marginBottom: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
                                    <span>POSITION X ({wtData.imageOffsetX}px)</span>
                                    <button onClick={() => updWT('imageOffsetX', 0)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: 10, padding: 0 }}>Reset</button>
                                </div>
                                <input type="range" min="-150" max="150" step="1" value={wtData.imageOffsetX} onChange={e => updWT('imageOffsetX', parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: '#10b981' }} />
                            </div>

                            <div style={{ marginBottom: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
                                    <span>POSITION Y ({wtData.imageOffsetY}px)</span>
                                    <button onClick={() => updWT('imageOffsetY', 0)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: 10, padding: 0 }}>Reset</button>
                                </div>
                                <input type="range" min="-150" max="150" step="1" value={wtData.imageOffsetY} onChange={e => updWT('imageOffsetY', parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: '#10b981' }} />
                            </div>

                            <div style={{ marginBottom: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
                                    <span>ROTATION ({wtData.imageRotate}°)</span>
                                    <button onClick={() => updWT('imageRotate', 0)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: 10, padding: 0 }}>Reset</button>
                                </div>
                                <input type="range" min="-180" max="180" step="5" value={wtData.imageRotate} onChange={e => updWT('imageRotate', parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: '#10b981' }} />
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, marginBottom: 12 }}>
                            <label style={{ ...lbl, color: '#10b981', marginBottom: 8 }}>🎨 Colors</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                {wtTpl === 1 && [['accentColor', 'Accent Gold']].map(([k, l]) => <div key={k}><div style={lbl}>{l}</div><input type="color" defaultValue={wtData[k]} onChange={e => updWT(k, e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', padding: 2 }} /></div>)}
                                {wtTpl === 2 && [['primaryColor', 'Primary Purple'], ['accentColor', 'Accent Red']].map(([k, l]) => <div key={k}><div style={lbl}>{l}</div><input type="color" defaultValue={wtData[k]} onChange={e => updWT(k, e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', padding: 2 }} /></div>)}
                                {wtTpl === 3 && [['primaryColor', 'Border Green'], ['accentColor', 'Accent Orange']].map(([k, l]) => <div key={k}><div style={lbl}>{l}</div><input type="color" defaultValue={wtData[k]} onChange={e => updWT(k, e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', padding: 2 }} /></div>)}
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                            <div style={fw}><label style={lbl}>Helpline</label><input style={inp} value={wtData.helpline} onChange={e => updWT('helpline', e.target.value)} /></div>
                            <div style={fw}><label style={lbl}>Tagline</label><input style={inp} value={wtData.tagline} onChange={e => updWT('tagline', e.target.value)} /></div>
                        </div>
                    </>)}
                </div>

                {/* Preview */}
                <div className="poster-preview-container" ref={containerRef} style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ background: 'repeating-conic-gradient(#f1f5f9 0% 25%,#fff 0% 50%) 0 0/18px 18px', borderRadius: 18, padding: 26, border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                        <div style={{
                            width: 600 * scale,
                            height: targetHeight * scale,
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: `translate(-50%, 0) scale(${scale})`,
                                transformOrigin: 'top center',
                                width: 600,
                                height: targetHeight,
                            }}>
                                <div ref={posterRef} style={{ width: 600, overflow: 'hidden' }}>
                                    {category === 'guardian' && gTpl === 1 && <G1MidnightGold data={gData} />}
                                    {category === 'guardian' && gTpl === 2 && <G2LightEditorial data={gData} />}
                                    {category === 'guardian' && gTpl === 3 && <G3NavyCard data={gData} />}
                                    {category === 'guardian' && gTpl === 4 && <G4WarmMinimal data={gData} />}
                                    {category === 'guardian' && gTpl === 5 && <G5ModernColorful data={gData} />}
                                    {category === 'teacher' && tTpl === 1 && <T1ProfessionalSplit data={tData} />}
                                    {category === 'teacher' && tTpl === 2 && <T2AwardElegant data={tData} />}
                                    {category === 'teacher' && tTpl === 3 && <T3ModernDark data={tData} />}
                                    {category === 'teacher' && tTpl === 4 && <T4NaturalSage data={tData} />}
                                    {category === 'teacher' && tTpl === 5 && <T5VibrantMesh data={tData} />}
                                    {category === 'welcome_teacher' && wtTpl === 1 && <WT1RoyalWelcome data={wtData} />}
                                    {category === 'welcome_teacher' && wtTpl === 2 && <WT2ModernCreative data={wtData} />}
                                    {category === 'welcome_teacher' && wtTpl === 3 && <WT3MinimalistEditorial data={wtData} />}
                                    {category === 'welcome_teacher' && wtTpl === 4 && <WT4FloralFiesta data={wtData} />}
                                    {category === 'welcome_teacher' && wtTpl === 5 && <WT5PinkLady data={wtData} />}
                                    {category === 'welcome_teacher' && wtTpl === 6 && <WT6EmeraldGold data={wtData} />}
                                    {category === 'welcome_teacher' && wtTpl === 7 && <WT7ClassroomChalkboard data={wtData} />}
                                    {category === 'welcome_teacher' && wtTpl === 8 && <WT8GalleryExhibition data={wtData} />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 10 }}>Preview at {Math.round(scale * 100)}% — exported PNG is 3× full resolution</p>
                </div>
            </div>

            {/* Hidden export element to guarantee 100% exact full-size rendering for download */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <div ref={downloadRef} style={{ width: 600, overflow: 'hidden' }}>
                    {category === 'guardian' && gTpl === 1 && <G1MidnightGold data={gData} />}
                    {category === 'guardian' && gTpl === 2 && <G2LightEditorial data={gData} />}
                    {category === 'guardian' && gTpl === 3 && <G3NavyCard data={gData} />}
                    {category === 'guardian' && gTpl === 4 && <G4WarmMinimal data={gData} />}
                    {category === 'guardian' && gTpl === 5 && <G5ModernColorful data={gData} />}
                    {category === 'teacher' && tTpl === 1 && <T1ProfessionalSplit data={tData} />}
                    {category === 'teacher' && tTpl === 2 && <T2AwardElegant data={tData} />}
                    {category === 'teacher' && tTpl === 3 && <T3ModernDark data={tData} />}
                    {category === 'teacher' && tTpl === 4 && <T4NaturalSage data={tData} />}
                    {category === 'teacher' && tTpl === 5 && <T5VibrantMesh data={tData} />}
                    {category === 'welcome_teacher' && wtTpl === 1 && <WT1RoyalWelcome data={wtData} />}
                    {category === 'welcome_teacher' && wtTpl === 2 && <WT2ModernCreative data={wtData} />}
                    {category === 'welcome_teacher' && wtTpl === 3 && <WT3MinimalistEditorial data={wtData} />}
                    {category === 'welcome_teacher' && wtTpl === 4 && <WT4FloralFiesta data={wtData} />}
                    {category === 'welcome_teacher' && wtTpl === 5 && <WT5PinkLady data={wtData} />}
                    {category === 'welcome_teacher' && wtTpl === 6 && <WT6EmeraldGold data={wtData} />}
                    {category === 'welcome_teacher' && wtTpl === 7 && <WT7ClassroomChalkboard data={wtData} />}
                    {category === 'welcome_teacher' && wtTpl === 8 && <WT8GalleryExhibition data={wtData} />}
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Hind+Siliguri:wght@400;600;700&family=Great+Vibes&family=Herr+Von+Muellerhoff&family=Cabin+Sketch:wght@700&display=swap');

                @media (max-width: 991px) {
                    .poster-header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 16px !important;
                    }
                    .poster-header button {
                        width: 100% !important;
                        justify-content: center !important;
                    }
                    .poster-tabs {
                        flex-wrap: wrap !important;
                    }
                    .poster-tabs button {
                        flex: 1 !important;
                        justify-content: center !important;
                    }
                    .poster-style-selector {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 8px !important;
                    }
                    .poster-style-selector span {
                        margin-left: 0 !important;
                    }
                    .poster-layout {
                        flex-direction: column !important;
                    }
                    .poster-controls {
                        width: 100% !important;
                        max-height: none !important;
                    }
                    .poster-preview-container {
                        width: 100% !important;
                        margin-top: 20px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default PosterGenerator;
