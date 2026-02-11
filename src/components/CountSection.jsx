import React, { useState, useEffect, useRef } from 'react';
import { FaChalkboardTeacher, FaBookOpen, FaUsers } from 'react-icons/fa';

const StatsSection = () => {
    const stats = [
        { title: "Registered Tutors", count: 12000, suffix: "+", icon: FaChalkboardTeacher, color: '#61dafb' },
        { title: "Available Tuitions", count: 500, suffix: "+", icon: FaBookOpen, color: '#ffd700' },
        { title: "Registered Guardians", count: 10000, suffix: "+", icon: FaUsers, color: '#4ade80' }
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

        return <>{current.toLocaleString()}{suffix}</>;
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

    const wavePath = "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z";

    return (
        <div style={{ position: 'relative', marginTop: '60px', marginBottom: '80px', overflow: 'visible' }}>
            {/* Wave Animation Styles */}
            <style>
                {`
                @keyframes wave-move {
                    0% { transform: translateX(0); }
                    50% { transform: translateX(-5%); }
                    100% { transform: translateX(0); }
                }
                .sea-wave {
                    animation: wave-move 10s ease-in-out infinite;
                    will-change: transform;
                }
                .sea-wave-delayed {
                    animation: wave-move 15s ease-in-out infinite;
                    animation-delay: -2s;
                    will-change: transform;
                }
                `}
            </style>

            {/* Top Sea Tide Area */}
            <div style={{
                position: 'absolute',
                top: '-51px',
                left: 0,
                width: '100%',
                height: '55px',
                overflow: 'hidden',
                lineHeight: 0,
                transform: 'rotate(180deg)',
                zIndex: 3,
                pointerEvents: 'none',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
            }}>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" shapeRendering="geometricPrecision" style={{ position: 'absolute', width: '120%', height: '100%', left: '-10%', top: '-2px' }} className="sea-wave-delayed">
                    <path d={wavePath} fill="#004085" opacity="0.4" />
                </svg>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" shapeRendering="geometricPrecision" style={{ position: 'absolute', width: '115%', height: '100%', left: '-7.5%', top: '-1px' }} className="sea-wave">
                    <path d={wavePath} fill="#004085" opacity="0.6" />
                </svg>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" shapeRendering="geometricPrecision" style={{ position: 'absolute', width: '110%', height: '100%', left: '-5%', top: '-0.5px' }}>
                    <path d={wavePath} fill="#004085" />
                </svg>
            </div>

            <section
                ref={sectionRef}
                className="stats-section"
                style={{
                    background: 'linear-gradient(180deg, #004085 0%, #0066cc 100%)',
                    padding: '60px 15px',
                    position: 'relative',
                    overflow: 'visible',
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: '220px',
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none'
                }}
            >
                <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px',
                        padding: '0 10px'
                    }}>
                        {stats.map((stat, index) => {
                            const IconComponent = stat.icon;
                            return (
                                <div
                                    key={index}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '20px',
                                        padding: '25px 20px',
                                        textAlign: 'center',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                                        e.currentTarget.style.boxShadow = `0 15px 35px rgba(0,0,0,0.2), 0 0 15px ${stat.color}22`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
                                    }}
                                >
                                    <div style={{
                                        background: stat.color + '20',
                                        borderRadius: '15px',
                                        width: '55px',
                                        height: '55px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 15px',
                                        border: `1px solid ${stat.color}44`
                                    }}>
                                        <IconComponent style={{ color: stat.color, fontSize: '24px' }} />
                                    </div>

                                    <div style={{
                                        fontSize: '2.2rem',
                                        fontWeight: '800',
                                        marginBottom: '5px',
                                        color: '#fff',
                                        textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                    }}>
                                        <AnimatedNumber number={stat.count} suffix={stat.suffix} start={inView} />
                                    </div>

                                    <h3 style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '700',
                                        color: 'rgba(255,255,255,0.8)',
                                        margin: '0',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                    }}>
                                        {stat.title}
                                    </h3>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Bottom Sea Tide Area */}
            <div style={{
                position: 'absolute',
                bottom: '-51px',
                left: 0,
                width: '100%',
                height: '55px',
                overflow: 'hidden',
                lineHeight: 0,
                zIndex: 3,
                pointerEvents: 'none',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
            }}>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" shapeRendering="geometricPrecision" style={{ position: 'absolute', width: '120%', height: '100%', left: '-15%', top: '2px' }} className="sea-wave-delayed">
                    <path d={wavePath} fill="#0066cc" opacity="0.4" />
                </svg>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" shapeRendering="geometricPrecision" style={{ position: 'absolute', width: '115%', height: '100%', left: '-10%', top: '1px' }} className="sea-wave">
                    <path d={wavePath} fill="#0066cc" opacity="0.6" />
                </svg>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" shapeRendering="geometricPrecision" style={{ position: 'absolute', width: '110%', height: '100%', left: '-5%', top: '0.5px' }}>
                    <path d={wavePath} fill="#0066cc" />
                </svg>
            </div>
        </div>
    );
};

export default StatsSection;
