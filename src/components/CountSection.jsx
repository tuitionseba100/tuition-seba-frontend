import React, { useState, useEffect, useRef } from 'react';
import { FaChalkboardTeacher, FaBookOpen, FaUsers } from 'react-icons/fa';

const StatsSection = () => {
    const stats = [
        { title: "Registered Tutors", count: 6000, suffix: "+", icon: FaChalkboardTeacher },
        { title: "Available Tuitions", count: 100, suffix: "+", icon: FaBookOpen },
        { title: "Registered Guardians", count: 5000, suffix: "+", icon: FaUsers }
    ];

    const AnimatedNumber = ({ number, duration = 2000, suffix = '', start }) => {
        const [current, setCurrent] = useState(0);

        useEffect(() => {
            if (!start) return;
            let startNum = 0;
            const increment = number / (duration / 50);
            const interval = setInterval(() => {
                startNum += increment;
                if (startNum >= number) {
                    startNum = number;
                    clearInterval(interval);
                }
                setCurrent(Math.floor(startNum));
            }, 50);

            return () => clearInterval(interval);
        }, [number, duration, start]);

        return <>{current}{suffix}</>;
    };

    const sectionRef = useRef();
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="stats-section"
            style={{
                background: 'linear-gradient(135deg, #55b3e7 0%, #4a9fd1 100%)',
                padding: '30px 15px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Decorative elements */}
            <div style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '150px',
                height: '150px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '50%',
                zIndex: 1
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                width: '100px',
                height: '100px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '50%',
                zIndex: 1
            }} />

            <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div
                                key={index}
                                style={{
                                    background: 'rgba(255,255,255,0.95)',
                                    borderRadius: '16px',
                                    padding: '25px 20px',
                                    textAlign: 'center',
                                    boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.12)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)';
                                }}
                            >
                                {/* Card shine effect */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: '-100%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                    transition: 'left 0.6s',
                                    pointerEvents: 'none'
                                }} />

                                <div style={{
                                    background: 'linear-gradient(135deg, #55b3e7, #4a9fd1)',
                                    borderRadius: '50%',
                                    width: '55px',
                                    height: '55px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 15px',
                                    boxShadow: '0 3px 15px rgba(85,179,231,0.3)'
                                }}>
                                    <IconComponent style={{ color: 'white', fontSize: '20px' }} />
                                </div>

                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: '800',
                                    marginBottom: '6px',
                                    background: 'linear-gradient(135deg, #55b3e7, #4a9fd1)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    <AnimatedNumber number={stat.count} suffix={stat.suffix} start={inView} />
                                </div>

                                <h3 style={{
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: '#2d3748',
                                    margin: '0',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                }}>
                                    {stat.title}
                                </h3>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
