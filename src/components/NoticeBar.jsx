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
        speed = 4
    } = typeof publicNotice === 'object' ? publicNotice : {};

    const isExternalLink = link && (link.startsWith('http://') || link.startsWith('https://'));

    const isProfileSettings = (url) => {
        if (!url) return false;
        const normalized = String(url).trim().toLowerCase();
        return (
            normalized === '/profile-settings' ||
            normalized === 'profile-settings' ||
            normalized === '#profile-settings' ||
            normalized === '/profile-setting' ||
            normalized === '/user-settings' ||
            normalized === '#user-settings'
        );
    };

    const handleOpenProfileSettings = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        window.dispatchEvent(new Event('openProfileSettings'));
    };

    const renderNoticeContent = () => {
        if (isProfileSettings(link)) {
            return (
                <span
                    onClick={handleOpenProfileSettings}
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
                    title="প্রোফাইল সেটিংস খুলতে ক্লিক করুন"
                >
                    <span>{text}</span>
                </span>
            );
        }

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

        return (
            <span
                onClick={handleOpenProfileSettings}
                style={{
                    color: textColor,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                title="প্রোফাইল সেটিংস খুলতে ক্লিক করুন"
            >
                {text}
            </span>
        );
    };

    return (
        <div
            className="public-notice-marquee-wrapper"
            style={{
                background: 'linear-gradient(90deg, #0b132b 0%, #1c2541 50%, #0b132b 100%)',
                color: '#ffffff',
                width: '100%',
                position: 'relative',
                zIndex: 1030,
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
                fontSize: '13.5px',
                lineHeight: '1.4',
                padding: '5px 0',
                userSelect: 'none'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: '100%',
                    padding: '0 14px',
                    gap: '12px'
                }}
            >
                {/* Notice Badge */}
                <div
                    onClick={handleOpenProfileSettings}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#0f172a',
                        padding: '2px 10px',
                        borderRadius: '20px',
                        fontWeight: 700,
                        fontSize: '11.5px',
                        letterSpacing: '0.3px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        boxShadow: '0 2px 6px rgba(245, 158, 11, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        cursor: 'pointer'
                    }}
                    title="প্রোফাইল সেটিংস খুলতে ক্লিক করুন"
                >
                    <FaBullhorn
                        style={{
                            color: '#0f172a',
                            animation: 'noticeBellPulse 1.8s infinite ease-in-out',
                            fontSize: '11.5px'
                        }}
                    />
                    <span>{badgeText || 'বিজ্ঞপ্তি'}</span>
                </div>

                {/* Continuous Seamless Smooth Marquee */}
                <div className="notice-continuous-marquee-track" style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    <div className="notice-marquee-group">
                        <div className="notice-marquee-item">{renderNoticeContent()}</div>
                        <span style={{ opacity: 0.4, fontSize: '18px', margin: '0 1.5rem', lineHeight: 1 }}>•</span>
                        <div className="notice-marquee-item">{renderNoticeContent()}</div>
                        <span style={{ opacity: 0.4, fontSize: '18px', margin: '0 1.5rem', lineHeight: 1 }}>•</span>
                    </div>
                    <div className="notice-marquee-group" aria-hidden="true">
                        <div className="notice-marquee-item">{renderNoticeContent()}</div>
                        <span style={{ opacity: 0.4, fontSize: '18px', margin: '0 1.5rem', lineHeight: 1 }}>•</span>
                        <div className="notice-marquee-item">{renderNoticeContent()}</div>
                        <span style={{ opacity: 0.4, fontSize: '18px', margin: '0 1.5rem', lineHeight: 1 }}>•</span>
                    </div>
                </div>

                {/* Optional Action Button if link is present */}
                {link && link.trim() && (
                    <div style={{ flexShrink: 0, display: 'none' }} className="d-md-block">
                        {isProfileSettings(link) ? (
                            <button
                                type="button"
                                onClick={handleOpenProfileSettings}
                                className="btn btn-sm"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    color: '#ffffff',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    padding: '1px 9px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.25)'
                                }}
                            >
                                সেটিংস
                            </button>
                        ) : isExternalLink ? (
                            <a
                                href={link.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    color: '#ffffff',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    padding: '1px 9px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.25)',
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
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    color: '#ffffff',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    padding: '1px 9px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.25)',
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
                .notice-continuous-marquee-track {
                    display: flex;
                    overflow: hidden;
                    user-select: none;
                    width: 100%;
                    cursor: default;
                    mask-image: linear-gradient(to right, transparent 0%, black 1.5%, black 98.5%, transparent 100%);
                    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 1.5%, black 98.5%, transparent 100%);
                }
                .notice-marquee-group {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    min-width: 100%;
                    animation: scrollContinuousMarquee 55s linear infinite;
                    will-change: transform;
                    transform: translate3d(0, 0, 0);
                    backface-visibility: hidden;
                    perspective: 1000px;
                }
                .notice-marquee-item {
                    display: inline-flex;
                    align-items: center;
                    white-space: nowrap;
                }
                .notice-continuous-marquee-track:hover .notice-marquee-group {
                    animation-play-state: paused;
                }
                @keyframes scrollContinuousMarquee {
                    0% {
                        transform: translate3d(0, 0, 0);
                    }
                    100% {
                        transform: translate3d(-100%, 0, 0);
                    }
                }
                @keyframes noticeBellPulse {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    20% { transform: rotate(-15deg) scale(1.15); }
                    40% { transform: rotate(15deg) scale(1.15); }
                    60% { transform: rotate(-10deg) scale(1.08); }
                    80% { transform: rotate(10deg) scale(1.08); }
                }
            `}</style>
        </div>
    );
};

export default NoticeBar;
