import React from 'react';
import { usePublicSettings } from '../context/PublicSettingsContext';
import { FaBullhorn, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NoticeBar = () => {
    const { publicNotice } = usePublicSettings();

    if (!publicNotice) {
        return null;
    }

    const isEnabled = publicNotice.enabled === true || publicNotice.enabled === 'true' || publicNotice.enabled === 1;
    const text = typeof publicNotice === 'string' ? publicNotice : (publicNotice.text || '');

    if (!isEnabled || !text || !text.trim()) {
        return null;
    }

    const {
        link = '',
        bgColor = '#002B5B',
        textColor = '#ffffff',
        badgeText = 'বিজ্ঞপ্তি',
        speed = 6
    } = typeof publicNotice === 'object' ? publicNotice : {};

    const isExternalLink = link && (link.startsWith('http://') || link.startsWith('https://'));

    const renderNoticeContent = () => {
        if (link && link.trim()) {
            if (isExternalLink) {
                return (
                    <a
                        href={link.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: textColor,
                            textDecoration: 'none',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        <span>{text}</span>
                        <FaExternalLinkAlt size={11} style={{ opacity: 0.8, marginLeft: 4 }} />
                    </a>
                );
            }
            return (
                <Link
                    to={link.trim()}
                    style={{
                        color: textColor,
                        textDecoration: 'none',
                        fontWeight: 500,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'opacity 0.2s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                    <span>{text}</span>
                    <FaExternalLinkAlt size={11} style={{ opacity: 0.8, marginLeft: 4 }} />
                </Link>
            );
        }

        return <span style={{ color: textColor, fontWeight: 500 }}>{text}</span>;
    };

    return (
        <div
            className="public-notice-marquee-wrapper"
            style={{
                backgroundColor: bgColor || '#002B5B',
                color: textColor || '#ffffff',
                width: '100%',
                position: 'relative',
                zIndex: 1030,
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                fontSize: '13.5px',
                lineHeight: '1.4',
                padding: '4px 0',
                userSelect: 'none'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: '100%',
                    padding: '0 12px',
                    gap: '10px'
                }}
            >
                {/* Notice Badge */}
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        backgroundColor: 'rgba(255, 255, 255, 0.18)',
                        backdropFilter: 'blur(4px)',
                        padding: '2px 10px',
                        borderRadius: '20px',
                        fontWeight: 700,
                        fontSize: '12px',
                        letterSpacing: '0.3px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.25)'
                    }}
                >
                    <FaBullhorn
                        style={{
                            color: '#ffdd00',
                            animation: 'noticeBellPulse 1.8s infinite ease-in-out',
                            fontSize: '12px'
                        }}
                    />
                    <span>{badgeText || 'বিজ্ঞপ্তি'}</span>
                </div>

                {/* Marquee Track */}
                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                    <marquee
                        behavior="scroll"
                        direction="left"
                        scrollamount={Number(speed) || 6}
                        onMouseOver={(e) => e.currentTarget.stop()}
                        onMouseOut={(e) => e.currentTarget.start()}
                        style={{
                            display: 'block',
                            width: '100%',
                            cursor: link ? 'pointer' : 'default',
                            verticalAlign: 'middle',
                            margin: 0,
                            padding: 0
                        }}
                    >
                        {renderNoticeContent()}
                    </marquee>
                </div>

                {/* Optional Action Button if link is present */}
                {link && link.trim() && (
                    <div style={{ flexShrink: 0, display: 'none' }} className="d-md-block">
                        {isExternalLink ? (
                            <a
                                href={link.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: textColor,
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    padding: '1px 8px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    textDecoration: 'none'
                                }}
                            >
                                দেখুন
                            </a>
                        ) : (
                            <Link
                                to={link.trim()}
                                className="btn btn-sm"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: textColor,
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    padding: '1px 8px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    textDecoration: 'none'
                                }}
                            >
                                দেখুন
                            </Link>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes noticeBellPulse {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    20% { transform: rotate(-15deg) scale(1.1); }
                    40% { transform: rotate(15deg) scale(1.1); }
                    60% { transform: rotate(-10deg) scale(1.05); }
                    80% { transform: rotate(10deg) scale(1.05); }
                }
            `}</style>
        </div>
    );
};

export default NoticeBar;
