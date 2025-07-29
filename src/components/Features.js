import React from 'react';
import { FaUserCheck, FaGraduationCap, FaExternalLinkAlt } from 'react-icons/fa';

const Features = () => {
    const cardStyle = {
        borderRadius: '14px',
        boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        width: '100%',
        maxWidth: '540px',
        backgroundColor: '#fff',
    };

    const iconCircleStyle = (bgColor) => ({
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: bgColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontSize: '24px',
        flexShrink: 0,
    });

    const containerStyle = {
        display: 'flex',
        gap: '25px',
        padding: '40px',
        backgroundColor: '#f7f9fb',
        justifyContent: 'center',
        flexWrap: 'wrap',
    };

    const linkStyle = (color) => ({
        color,
        fontWeight: 'bold',
        textDecoration: 'none',
        fontSize: '14px',
        display: 'inline-flex',
        alignItems: 'center',
        marginTop: '8px',
        gap: '5px',
    });

    return (
        <div style={containerStyle}>
            {/* Card 1 */}
            <div style={{ ...cardStyle, borderLeft: '5px solid #2f6bf0' }}>
                <div style={iconCircleStyle('#2f6bf0')}>
                    <FaUserCheck />
                </div>
                <div>
                    <h6 style={{ fontWeight: 'bold' }}>
                        প্রিমিয়াম <span style={{ color: '#2f6bf0' }}>ভেরিফায়েড</span> শিক্ষক হিসেবে যুক্ত হন
                    </h6>
                    <p style={{ marginBottom: '4px', fontSize: '14px', color: '#555' }}>
                        বিশেষ সুযোগ-সুবিধা পেতে আজই রেজিস্ট্রেশন করুন।
                    </p>
                    <a href="#" style={linkStyle('#2f6bf0')}>
                        <FaExternalLinkAlt /> এখানে ক্লিক করুন
                    </a>
                </div>
            </div>

            {/* Card 2 */}
            <div style={{ ...cardStyle, borderLeft: '5px solid #3cb371' }}>
                <div style={iconCircleStyle('#3cb371')}>
                    <FaGraduationCap />
                </div>
                <div>
                    <h6 style={{ fontWeight: 'bold' }}>আপনার টিউশন আপডেট</h6>
                    <p style={{ marginBottom: '4px', fontSize: '14px', color: '#555' }}>
                        আপনার আবেদনকৃত টিউশনগুলোর আপডেট জানতে
                    </p>
                    <a href="#" style={linkStyle('#3cb371')}>
                        <FaExternalLinkAlt /> এখানে ক্লিক করুন
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Features;
