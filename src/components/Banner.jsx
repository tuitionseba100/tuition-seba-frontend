import React from 'react';

const TutorSection = () => {
    const sectionStyle = {
        background: 'linear-gradient(180deg, #55b3e7 0%, #55b3e7 100%)',
        padding: '60px 20px',
        textAlign: 'center',
        color: 'white',
    };

    const titleStyle = {
        fontWeight: '700',
        fontSize: '2rem',
        marginBottom: '10px',
    };

    const subtitleStyle = {
        fontWeight: '400',
        fontSize: '1rem',
        marginBottom: '30px',
    };

    const buttonPrimaryStyle = {
        backgroundColor: 'white',
        color: 'black',
        fontWeight: '700',
        borderRadius: '25px',
        padding: '10px 25px',
        border: 'none',
        marginRight: '15px',
    };

    const buttonSecondaryStyle = {
        backgroundColor: 'transparent',
        color: 'white',
        fontWeight: '700',
        borderRadius: '25px',
        padding: '10px 25px',
        border: '2px solid white',
    };

    return (
        <section style={sectionStyle}>
            <h2 style={titleStyle}>Find the perfect tutor or tuition services</h2>
            <p style={subtitleStyle}>
                Connect with expert tutors tailored to your educational needs
            </p>
            <div>
                <button style={buttonPrimaryStyle}>AVAILABLE TUITIONS</button>
                <button style={buttonSecondaryStyle}>FIND TUTOR</button>
            </div>
        </section>
    );
};

export default TutorSection;
