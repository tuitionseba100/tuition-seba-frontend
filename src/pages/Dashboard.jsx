import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaSun,
    FaCloudSun,
    FaMoon,
    FaSearch,
    FaGraduationCap,
    FaUserCheck,
    FaUsers,
    FaTasks,
    FaMoneyBillWave,
    FaHandHoldingUsd,
    FaUndoAlt,
    FaReceipt,
    FaComments,
    FaUserShield,
    FaSms,
    FaExclamationCircle,
    FaCalendarAlt,
    FaClipboardList,
    FaCheck,
    FaTrashAlt,
    FaBolt,
    FaShieldAlt,
    FaUserCircle,
    FaCog,
    FaHeadset,
    FaArrowRight,
    FaMapMarkerAlt,
    FaUserFriends,
    FaFileInvoiceDollar
} from 'react-icons/fa';
import NavBarPage from './NavbarPage';
import GlobalSearchModal from '../components/modals/GlobalSearchModal';

const Dashboard = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role') || 'staff';
    const username = localStorage.getItem('username') || 'Admin';
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showSearchModal, setShowSearchModal] = useState(false);

    // Permissions stored in localStorage
    const [permissions] = useState(() => {
        const stored = localStorage.getItem('permissions');
        try {
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    });

    // Scratchpad notes stored in localStorage
    const [scratchpadText, setScratchpadText] = useState(() => {
        return localStorage.getItem('tsf_dashboard_scratchpad') || '';
    });
    const [copiedNote, setCopiedNote] = useState(false);

    // Live clock timer
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleScratchpadChange = (e) => {
        const val = e.target.value;
        setScratchpadText(val);
        localStorage.setItem('tsf_dashboard_scratchpad', val);
    };

    const handleCopyScratchpad = () => {
        if (!scratchpadText) return;
        navigator.clipboard.writeText(scratchpadText);
        setCopiedNote(true);
        setTimeout(() => setCopiedNote(false), 2000);
    };

    const handleClearScratchpad = () => {
        if (window.confirm('Clear scratchpad note?')) {
            setScratchpadText('');
            localStorage.removeItem('tsf_dashboard_scratchpad');
        }
    };

    // Role & permission check function (identical to Navbar logic)
    const hasAccess = (to, permissionKey = null) => {
        if (role === 'superadmin') return true;

        // Strictly superadmin only modules
        if (
            to === '/admin/finance' ||
            to === '/admin/user' ||
            to === '/admin/activity-log' ||
            to === '/admin/reports'
        ) {
            return false;
        }

        // Permission-gated modules for staff
        if (permissionKey && !permissions.includes(permissionKey)) {
            return false;
        }

        return true;
    };

    // Greeting logic based on specified time brackets:
    // - Good morning: 5:00 AM – 11:59 AM
    // - Good afternoon: 12:00 PM – around 5:00 PM
    // - Good evening: around 5:00 PM – 9:00 PM
    // - Good night: after 9:00 PM (9:00 PM – 4:59 AM)
    const hours = currentTime.getHours();
    let greeting = 'Good Morning';
    let GreetingIcon = FaSun;

    if (hours >= 5 && hours < 12) {
        greeting = 'Good Morning';
        GreetingIcon = FaSun;
    } else if (hours >= 12 && hours < 17) {
        greeting = 'Good Afternoon';
        GreetingIcon = FaCloudSun;
    } else if (hours >= 17 && hours < 21) {
        greeting = 'Good Evening';
        GreetingIcon = FaMoon;
    } else {
        greeting = 'Good Night';
        GreetingIcon = FaMoon;
    }

    const rawHours = currentTime.getHours();
    const rawMinutes = currentTime.getMinutes();

    const hours12 = String(rawHours % 12 || 12).padStart(2, '0');
    const minutes = String(rawMinutes).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    const ampm = rawHours >= 12 ? 'PM' : 'AM';
    const currentDayOfWeek = currentTime.getDay(); // 0 = SUN, 1 = MON, ...

    const weekDays = [
        { label: 'MON', day: 1 },
        { label: 'TUE', day: 2 },
        { label: 'WED', day: 3 },
        { label: 'THU', day: 4 },
        { label: 'FRI', day: 5 },
        { label: 'SAT', day: 6 },
        { label: 'SUN', day: 0 }
    ];

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const formattedDate = currentTime.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Compact Square / Borgo Button definitions with distinct colors and logical grouping
    const rawSections = [
        {
            title: 'Tuition Management',
            items: [
                {
                    title: 'Tuitions',
                    to: '/admin/tuition',
                    permissionKey: 'tuition',
                    icon: FaGraduationCap,
                    bg: 'linear-gradient(145deg, #3b82f6 0%, #1d4ed8 100%)',
                    shadow: 'rgba(37, 99, 235, 0.3)'
                },
                {
                    title: 'Tuition Apply',
                    to: '/admin/tuitionApply',
                    permissionKey: 'tuitionApply',
                    icon: FaClipboardList,
                    bg: 'linear-gradient(145deg, #0284c7 0%, #0369a1 100%)',
                    shadow: 'rgba(2, 132, 199, 0.3)'
                },
                {
                    title: 'Guardian Apply',
                    to: '/admin/guardianApply',
                    permissionKey: 'guardianApply',
                    icon: FaUsers,
                    bg: 'linear-gradient(145deg, #10b981 0%, #047857 100%)',
                    shadow: 'rgba(16, 185, 129, 0.3)'
                },
                {
                    title: 'Premium Teachers',
                    to: '/admin/premiumTeacher',
                    permissionKey: 'premiumTeacher',
                    icon: FaUserCheck,
                    bg: 'linear-gradient(145deg, #f59e0b 0%, #d97706 100%)',
                    shadow: 'rgba(245, 158, 11, 0.3)'
                },
            ]
        },
        {
            title: 'Operations & Tasks',
            items: [
                {
                    title: 'Tasks',
                    to: '/admin/task',
                    permissionKey: 'task',
                    icon: FaTasks,
                    bg: 'linear-gradient(145deg, #8b5cf6 0%, #6d28d9 100%)',
                    shadow: 'rgba(139, 92, 246, 0.3)'
                },
                {
                    title: 'Leads',
                    to: '/admin/lead',
                    permissionKey: 'lead',
                    icon: FaBolt,
                    bg: 'linear-gradient(145deg, #ec4899 0%, #be185d 100%)',
                    shadow: 'rgba(236, 72, 153, 0.3)'
                },
                {
                    title: 'Attendance',
                    to: '/admin/attendance',
                    permissionKey: 'attendance',
                    icon: FaCalendarAlt,
                    bg: 'linear-gradient(145deg, #6366f1 0%, #4338ca 100%)',
                    shadow: 'rgba(99, 102, 241, 0.3)'
                },
                {
                    title: 'Complaints',
                    to: '/admin/complaints',
                    permissionKey: 'complaints',
                    icon: FaExclamationCircle,
                    bg: 'linear-gradient(145deg, #f97316 0%, #c2410c 100%)',
                    shadow: 'rgba(249, 115, 22, 0.3)'
                },
            ]
        },
        {
            title: 'Finance & Accounts',
            items: [
                {
                    title: 'Guardian Payments',
                    to: '/admin/payment',
                    permissionKey: 'payment',
                    icon: FaMoneyBillWave,
                    bg: 'linear-gradient(145deg, #059669 0%, #065f46 100%)',
                    shadow: 'rgba(5, 150, 105, 0.3)'
                },
                {
                    title: 'Teacher Payments',
                    to: '/admin/teacherPayment',
                    permissionKey: 'teacherPayment',
                    icon: FaHandHoldingUsd,
                    bg: 'linear-gradient(145deg, #2563eb 0%, #1e40af 100%)',
                    shadow: 'rgba(37, 99, 235, 0.3)'
                },
                {
                    title: 'Refund Requests',
                    to: '/admin/refund',
                    permissionKey: 'refund',
                    icon: FaUndoAlt,
                    bg: 'linear-gradient(145deg, #ef4444 0%, #b91c1c 100%)',
                    shadow: 'rgba(239, 68, 68, 0.3)'
                },
                {
                    title: 'Service Charges',
                    to: '/admin/service-charge',
                    permissionKey: 'serviceCharge',
                    icon: FaFileInvoiceDollar,
                    bg: 'linear-gradient(145deg, #0284c7 0%, #0369a1 100%)',
                    shadow: 'rgba(2, 132, 199, 0.3)'
                },
                {
                    title: 'Expense & Accounts',
                    to: '/admin/finance',
                    permissionKey: null,
                    icon: FaReceipt,
                    bg: 'linear-gradient(145deg, #475569 0%, #1e293b 100%)',
                    shadow: 'rgba(71, 85, 105, 0.3)'
                },
            ]
        },
        {
            title: 'Communications',
            items: [
                {
                    title: 'Live Chat',
                    to: '/admin/chat',
                    permissionKey: 'chat',
                    icon: FaHeadset,
                    bg: 'linear-gradient(145deg, #06b6d4 0%, #0e7490 100%)',
                    shadow: 'rgba(6, 182, 212, 0.3)'
                },
                {
                    title: 'Team Chat',
                    to: '/admin/internal-chat',
                    permissionKey: 'internalChat',
                    icon: FaComments,
                    bg: 'linear-gradient(145deg, #a855f7 0%, #7e22ce 100%)',
                    shadow: 'rgba(168, 85, 247, 0.3)'
                },
                {
                    title: 'SMS Logs',
                    to: '/admin/sms-logs',
                    permissionKey: 'smsLogs',
                    icon: FaSms,
                    bg: 'linear-gradient(145deg, #14b8a6 0%, #0f766e 100%)',
                    shadow: 'rgba(20, 184, 166, 0.3)'
                },
            ]
        },
        {
            title: 'Administration & Security',
            items: [
                {
                    title: 'User Management',
                    to: '/admin/user',
                    permissionKey: null,
                    icon: FaUserFriends,
                    bg: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                    shadow: 'rgba(30, 41, 59, 0.3)'
                },
                {
                    title: 'Activity Logs',
                    to: '/admin/activity-log',
                    permissionKey: null,
                    icon: FaShieldAlt,
                    bg: 'linear-gradient(145deg, #334155 0%, #0f172a 100%)',
                    shadow: 'rgba(51, 65, 85, 0.3)'
                },
                {
                    title: 'Spam & Best',
                    to: '/admin/spamBest',
                    permissionKey: 'spamBest',
                    icon: FaUserShield,
                    bg: 'linear-gradient(145deg, #f43f5e 0%, #be123c 100%)',
                    shadow: 'rgba(244, 63, 94, 0.3)'
                },
                {
                    title: 'Settings',
                    to: '/admin/settings',
                    permissionKey: 'settings',
                    icon: FaCog,
                    bg: 'linear-gradient(145deg, #64748b 0%, #334155 100%)',
                    shadow: 'rgba(100, 116, 139, 0.3)'
                },
            ]
        }
    ];

    // Filter items and sections strictly based on role and permissions
    const visibleSections = rawSections
        .map(section => ({
            ...section,
            items: section.items.filter(item => hasAccess(item.to, item.permissionKey))
        }))
        .filter(section => section.items.length > 0);

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '40px' }}>
            <NavBarPage />

            <Container fluid className="px-lg-4 px-3 pt-3">
                {/* Brand Theme Hero Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <Card
                        className="border-0 text-white mb-4 shadow position-relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 45%, #0284c7 85%, #0369a1 100%)',
                            borderRadius: '20px',
                            padding: '24px 30px',
                            boxShadow: '0 20px 40px -15px rgba(30, 64, 175, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.12) inset'
                        }}
                    >
                        {/* Ambient Background Light Orbs */}
                        <div
                            style={{
                                position: 'absolute',
                                right: '-40px',
                                top: '-40px',
                                width: '280px',
                                height: '280px',
                                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, rgba(255, 255, 255, 0) 70%)',
                                borderRadius: '50%',
                                pointerEvents: 'none'
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                left: '30%',
                                bottom: '-60px',
                                width: '240px',
                                height: '240px',
                                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
                                borderRadius: '50%',
                                pointerEvents: 'none'
                            }}
                        />

                        <Row className="align-items-center position-relative" style={{ zIndex: 1 }}>
                            {/* Left: Headline Greeting & Action Buttons */}
                            <Col lg={7} md={12} className="mb-3 mb-lg-0">
                                <div className="d-flex align-items-center gap-2 mb-2.5">
                                    <span
                                        className="rounded-pill px-3 py-1 fw-bold d-inline-flex align-items-center gap-2"
                                        style={{
                                            fontSize: '0.76rem',
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            color: '#1e40af',
                                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                                            border: '1px solid rgba(255, 255, 255, 0.6)'
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: '7px',
                                                height: '7px',
                                                borderRadius: '50%',
                                                backgroundColor: '#10b981',
                                                boxShadow: '0 0 6px #10b981',
                                                display: 'inline-block'
                                            }}
                                        />
                                        TSF Portal
                                    </span>
                                    <span
                                        className="rounded-pill px-3 py-1 text-capitalize fw-semibold d-inline-flex align-items-center gap-1.5"
                                        style={{
                                            fontSize: '0.76rem',
                                            letterSpacing: '0.4px',
                                            backgroundColor: 'rgba(15, 23, 42, 0.35)',
                                            border: '1px solid rgba(255, 255, 255, 0.22)',
                                            backdropFilter: 'blur(8px)',
                                            color: '#e0f2fe'
                                        }}
                                    >
                                        <FaUserCircle size={13} className="text-info" /> {role}
                                    </span>
                                </div>

                                {/* Prominently Highlighted Greeting Headline */}
                                <h1
                                    className="fw-bold mb-1 text-white d-flex align-items-center gap-2 flex-wrap"
                                    style={{
                                        fontSize: '2.35rem',
                                        letterSpacing: '-0.8px',
                                        lineHeight: 1.15
                                    }}
                                >
                                    <span>{greeting},</span>
                                    <span
                                        style={{
                                            background: 'linear-gradient(135deg, #ffffff 30%, #bae6fd 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            textShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                                        }}
                                    >
                                        {username}!
                                    </span>
                                    <motion.div
                                        animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
                                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                                        className="d-inline-flex"
                                    >
                                        <GreetingIcon className="text-warning" size={30} style={{ filter: 'drop-shadow(0 2px 10px rgba(245, 158, 11, 0.6))' }} />
                                    </motion.div>
                                </h1>

                                <p className="mb-2.5 d-flex align-items-center gap-1.5" style={{ fontSize: '0.92rem', color: 'rgba(224, 242, 254, 0.85)', letterSpacing: '0.2px' }}>
                                    <span>Tuition Seba Forum</span>
                                    <span>•</span>
                                    <span>Admin Console</span>
                                </p>

                                <div className="d-flex gap-2 flex-wrap align-items-center mt-2">
                                    <Button
                                        variant="light"
                                        size="sm"
                                        className="hero-action-btn fw-bold rounded-pill px-3.5 py-1.5 shadow-sm d-flex align-items-center gap-2"
                                        style={{
                                            color: '#1d4ed8',
                                            backgroundColor: '#ffffff',
                                            border: 'none',
                                            fontSize: '0.85rem'
                                        }}
                                        onClick={() => setShowSearchModal(true)}
                                    >
                                        <FaSearch size={12} /> Global Search
                                    </Button>
                                    {hasAccess('/admin/tuition', 'tuition') && (
                                        <Button
                                            variant="outline-light"
                                            size="sm"
                                            className="hero-action-btn fw-semibold rounded-pill px-3.5 py-1.5 d-flex align-items-center gap-2"
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                                                border: '1px solid rgba(255, 255, 255, 0.28)',
                                                backdropFilter: 'blur(6px)',
                                                fontSize: '0.85rem'
                                            }}
                                            onClick={() => navigate('/admin/tuition')}
                                        >
                                            <FaGraduationCap size={14} /> Tuitions
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline-light"
                                        size="sm"
                                        className="hero-action-btn fw-semibold rounded-pill px-3.5 py-1.5 d-flex align-items-center gap-2"
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.12)',
                                            border: '1px solid rgba(255, 255, 255, 0.28)',
                                            backdropFilter: 'blur(6px)',
                                            fontSize: '0.85rem'
                                        }}
                                        onClick={() => navigate('/admin/internal-chat')}
                                    >
                                        <FaComments size={14} /> Team Chat
                                    </Button>
                                </div>
                            </Col>

                            {/* Right: Digital LED Tabletop Alarm Clock Widget */}
                            <Col lg={5} md={12} className="mt-3 mt-lg-0">
                                <div className="d-flex flex-column align-items-center align-items-lg-end">
                                    {/* Tabletop Clock Casing with 3D Bevel & Gloss */}
                                    <div
                                        className="digital-clock-case"
                                        style={{
                                            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 35%, #020617 100%)',
                                            borderRadius: '16px',
                                            padding: '10px 14px 10px 14px',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
                                            maxWidth: '330px',
                                            width: '100%',
                                            position: 'relative'
                                        }}
                                    >
                                        {/* Physical Top Alarm/Snooze Buttons */}
                                        <div
                                            className="d-flex justify-content-center gap-2 position-absolute"
                                            style={{ top: '-4px', left: 0, right: 0 }}
                                        >
                                            <div style={{ width: '20px', height: '4px', backgroundColor: '#475569', borderRadius: '3px 3px 0 0', boxShadow: '0 -1px 2px rgba(0,0,0,0.5)' }} />
                                            <div style={{ width: '32px', height: '4px', backgroundColor: '#64748b', borderRadius: '3px 3px 0 0', boxShadow: '0 -1px 2px rgba(0,0,0,0.5)' }} />
                                            <div style={{ width: '20px', height: '4px', backgroundColor: '#475569', borderRadius: '3px 3px 0 0', boxShadow: '0 -1px 2px rgba(0,0,0,0.5)' }} />
                                        </div>

                                        {/* TSF Brand & Status Line */}
                                        <div className="d-flex align-items-center justify-content-between mb-1.5 px-1" style={{ fontSize: '0.74rem' }}>
                                            <div className="d-flex align-items-center gap-1.5" style={{ color: '#38bdf8' }}>
                                                <span
                                                    className="fw-bold px-2 py-0.5 rounded"
                                                    style={{
                                                        fontFamily: "'Orbitron', sans-serif",
                                                        fontSize: '0.72rem',
                                                        letterSpacing: '1.8px',
                                                        backgroundColor: 'rgba(56, 189, 248, 0.16)',
                                                        border: '1px solid rgba(56, 189, 248, 0.35)',
                                                        color: '#f0f9ff',
                                                        textShadow: '0 0 6px rgba(56, 189, 248, 0.8)'
                                                    }}
                                                >
                                                    TSF
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center gap-1" style={{ color: '#0ea5e9', fontSize: '0.68rem', fontWeight: 'bold' }}>
                                                <span className="led-pulse-dot" />
                                                <span style={{ letterSpacing: '0.5px' }}>{formattedDate}</span>
                                            </div>
                                        </div>

                                        {/* Main Dark Mirror Screen with Neon Digits */}
                                        <div
                                            className="d-flex align-items-center justify-content-between px-2.5 py-1.5 rounded-3"
                                            style={{
                                                backgroundColor: '#020617',
                                                border: '1px solid rgba(56, 189, 248, 0.22)',
                                                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.8)'
                                            }}
                                        >
                                            {/* Digital 7-Segment 12-Hour Time & AM/PM */}
                                            <div className="d-flex align-items-center justify-content-center flex-grow-1">
                                                {/* AM / PM LED Indicator Stack */}
                                                <div
                                                    className="d-flex flex-column justify-content-center me-1.5 pe-1 border-end"
                                                    style={{
                                                        borderColor: 'rgba(255, 255, 255, 0.1) !important',
                                                        fontFamily: "'Orbitron', monospace",
                                                        fontSize: '0.62rem',
                                                        lineHeight: '1.25',
                                                        minWidth: '22px'
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: ampm === 'AM' ? '#38bdf8' : '#0284c7',
                                                            opacity: ampm === 'AM' ? 1 : 0.22,
                                                            fontWeight: ampm === 'AM' ? 900 : 600,
                                                            textShadow: ampm === 'AM' ? '0 0 8px rgba(56, 189, 248, 0.95)' : 'none',
                                                            transform: ampm === 'AM' ? 'scale(1.08)' : 'scale(1)',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        AM
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: ampm === 'PM' ? '#38bdf8' : '#0284c7',
                                                            opacity: ampm === 'PM' ? 1 : 0.22,
                                                            fontWeight: ampm === 'PM' ? 900 : 600,
                                                            textShadow: ampm === 'PM' ? '0 0 8px rgba(56, 189, 248, 0.95)' : 'none',
                                                            transform: ampm === 'PM' ? 'scale(1.08)' : 'scale(1)',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        PM
                                                    </span>
                                                </div>

                                                {/* Hours (12-Hour Format) */}
                                                <span
                                                    className="led-number"
                                                    style={{
                                                        fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
                                                        fontSize: '2.4rem',
                                                        fontWeight: 900,
                                                        color: '#f0f9ff',
                                                        letterSpacing: '2px',
                                                        lineHeight: 1,
                                                        textShadow: '0 0 10px rgba(56, 189, 248, 0.95), 0 0 22px rgba(14, 165, 233, 0.7)'
                                                    }}
                                                >
                                                    {hours12}
                                                </span>

                                                {/* Center Colon */}
                                                <div className="d-flex align-items-center mx-1.5">
                                                    <span
                                                        className="digital-blinking-colon"
                                                        style={{
                                                            fontFamily: "'Orbitron', monospace",
                                                            fontSize: '2rem',
                                                            fontWeight: 900,
                                                            color: '#38bdf8',
                                                            lineHeight: 0.85,
                                                            textShadow: '0 0 12px rgba(56, 189, 248, 0.95)'
                                                        }}
                                                    >
                                                        :
                                                    </span>
                                                </div>

                                                {/* Minutes */}
                                                <span
                                                    className="led-number"
                                                    style={{
                                                        fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
                                                        fontSize: '2.4rem',
                                                        fontWeight: 900,
                                                        color: '#f0f9ff',
                                                        letterSpacing: '2px',
                                                        lineHeight: 1,
                                                        textShadow: '0 0 10px rgba(56, 189, 248, 0.95), 0 0 22px rgba(14, 165, 233, 0.7)'
                                                    }}
                                                >
                                                    {minutes}
                                                </span>

                                                {/* Small Seconds Sub-Display */}
                                                <div className="d-flex flex-column align-items-start ms-1 mb-auto pt-1">
                                                    <span
                                                        style={{
                                                            fontFamily: "'Orbitron', monospace",
                                                            fontSize: '0.88rem',
                                                            fontWeight: 800,
                                                            color: '#38bdf8',
                                                            lineHeight: 1,
                                                            textShadow: '0 0 8px rgba(56, 189, 248, 0.95)',
                                                            letterSpacing: '1px'
                                                        }}
                                                    >
                                                        {seconds}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontFamily: "'Orbitron', monospace",
                                                            fontSize: '0.5rem',
                                                            color: '#0284c7',
                                                            fontWeight: 700,
                                                            marginTop: '2px',
                                                            letterSpacing: '0.5px'
                                                        }}
                                                    >
                                                        SEC
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Right Vertical Days of Week Stack */}
                                            <div
                                                className="d-flex flex-column justify-content-between ps-2 border-start"
                                                style={{
                                                    borderColor: 'rgba(255, 255, 255, 0.12) !important',
                                                    fontSize: '0.62rem',
                                                    lineHeight: '1.25',
                                                    fontFamily: "'Orbitron', monospace",
                                                    minWidth: '32px'
                                                }}
                                            >
                                                {weekDays.map((wd, i) => {
                                                    const isActive = currentDayOfWeek === wd.day;
                                                    return (
                                                        <span
                                                            key={i}
                                                            style={{
                                                                color: isActive ? '#fde047' : '#0284c7',
                                                                opacity: isActive ? 1 : 0.28,
                                                                fontWeight: isActive ? 900 : 600,
                                                                textShadow: isActive ? '0 0 8px rgba(253, 224, 71, 0.95), 0 0 14px rgba(250, 204, 21, 0.7)' : 'none',
                                                                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            {wd.label}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Bottom Glowing Blue Neon Base Bar */}
                                        <div
                                            className="clock-neon-base"
                                            style={{
                                                height: '3px',
                                                background: 'linear-gradient(90deg, transparent 0%, #38bdf8 20%, #0ea5e9 50%, #38bdf8 80%, transparent 100%)',
                                                borderRadius: '3px',
                                                marginTop: '8px',
                                                boxShadow: '0 0 12px #0ea5e9, 0 4px 18px rgba(14, 165, 233, 0.85)'
                                            }}
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </motion.div>

                {/* Main Content Grid */}
                <Row className="g-4">
                    {/* Left Side: 2 Sections Per Row in a 2-Column Grid */}
                    <Col lg={8} md={12}>
                        <Row className="g-3">
                            {visibleSections.map((sec, secIdx) => (
                                <Col sm={6} xs={12} key={secIdx} className="mb-2">
                                    <div className="h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <h6 className="fw-bold text-secondary text-uppercase mb-0" style={{ fontSize: '0.75rem', letterSpacing: '0.6px' }}>
                                                {sec.title}
                                            </h6>
                                            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                                            <span className="badge bg-light text-muted border rounded-pill px-2 py-0.5" style={{ fontSize: '0.68rem' }}>
                                                {sec.items.length}
                                            </span>
                                        </div>
                                        <Row className="g-2">
                                            {sec.items.map((item, itemIdx) => {
                                                const ItemIcon = item.icon;
                                                return (
                                                    <Col xs={3} key={itemIdx}>
                                                        <div
                                                            className="compact-borgo-btn text-white"
                                                            style={{
                                                                background: item.bg,
                                                                borderRadius: '12px',
                                                                cursor: 'pointer',
                                                                padding: '6px 4px',
                                                                aspectRatio: '1 / 1',
                                                                width: '100%',
                                                                boxShadow: `0 4px 10px ${item.shadow || 'rgba(0,0,0,0.12)'}`,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                textAlign: 'center',
                                                                gap: '4px',
                                                                transition: 'all 0.16s cubic-bezier(0.16, 1, 0.3, 1)',
                                                                userSelect: 'none',
                                                                position: 'relative',
                                                                overflow: 'hidden'
                                                            }}
                                                            onClick={() => navigate(item.to)}
                                                            role="button"
                                                        >
                                                            {/* Center Compact Icon */}
                                                            <div
                                                                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                                                                style={{
                                                                    width: '26px',
                                                                    height: '26px',
                                                                    backgroundColor: 'rgba(255, 255, 255, 0.22)',
                                                                    fontSize: '0.9rem',
                                                                    backdropFilter: 'blur(4px)'
                                                                }}
                                                            >
                                                                <ItemIcon />
                                                            </div>

                                                            {/* Compact Title */}
                                                            <span
                                                                className="fw-bold text-white text-center"
                                                                style={{
                                                                    fontSize: '0.72rem',
                                                                    lineHeight: '1.15',
                                                                    letterSpacing: '0px',
                                                                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                                                    padding: '0 2px'
                                                                }}
                                                            >
                                                                {item.title}
                                                            </span>
                                                        </div>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Col>

                    {/* Right Side: Quick Scratchpad & Quick Actions */}
                    <Col lg={4} md={12}>
                        {/* Scratchpad */}
                        <Card className="border shadow-sm mb-3" style={{ borderRadius: '12px' }}>
                            <Card.Header className="bg-white border-bottom py-2.5 px-3 d-flex align-items-center justify-content-between">
                                <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                                    📝 Quick Scratchpad
                                </span>
                                <div className="d-flex gap-1">
                                    <Button
                                        variant={copiedNote ? 'success' : 'outline-primary'}
                                        size="sm"
                                        className="py-0 px-2 fw-semibold"
                                        style={{ fontSize: '0.75rem', height: '24px' }}
                                        onClick={handleCopyScratchpad}
                                        disabled={!scratchpadText.trim()}
                                    >
                                        {copiedNote ? <><FaCheck className="me-1" /> Copied</> : 'Copy'}
                                    </Button>
                                    {scratchpadText && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            className="py-0 px-2"
                                            style={{ fontSize: '0.75rem', height: '24px' }}
                                            onClick={handleClearScratchpad}
                                        >
                                            <FaTrashAlt size={10} />
                                        </Button>
                                    )}
                                </div>
                            </Card.Header>
                            <Card.Body className="p-2.5">
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder="Write quick phone numbers, tuition codes or notes here (auto-saved)..."
                                    value={scratchpadText}
                                    onChange={handleScratchpadChange}
                                    style={{
                                        resize: 'vertical',
                                        fontSize: '0.85rem',
                                        backgroundColor: '#fafafa',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px'
                                    }}
                                />
                                <div className="text-muted small mt-1 px-1 text-end" style={{ fontSize: '0.7rem' }}>
                                    {scratchpadText.length} characters
                                </div>
                            </Card.Body>
                        </Card>

                        {/* System Quick Links */}
                        <Card className="border shadow-sm mb-3" style={{ borderRadius: '12px' }}>
                            <Card.Header className="bg-white border-bottom py-2.5 px-3">
                                <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                                    ⚡ Quick Actions
                                </span>
                            </Card.Header>
                            <Card.Body className="p-2 d-flex flex-column gap-1">
                                <button
                                    className="btn btn-light text-start text-dark fw-semibold d-flex align-items-center justify-content-between p-2 rounded-2 border-0"
                                    style={{ fontSize: '0.88rem' }}
                                    onClick={() => setShowSearchModal(true)}
                                >
                                    <span><FaSearch className="text-primary me-2" size={13} /> Global Search</span>
                                    <FaArrowRight size={10} className="text-muted" />
                                </button>
                                <button
                                    className="btn btn-light text-start text-dark fw-semibold d-flex align-items-center justify-content-between p-2 rounded-2 border-0"
                                    style={{ fontSize: '0.88rem' }}
                                    onClick={() => navigate('/admin/attendance')}
                                >
                                    <span><FaCalendarAlt className="text-success me-2" size={13} /> Attendance Punch</span>
                                    <FaArrowRight size={10} className="text-muted" />
                                </button>
                                <button
                                    className="btn btn-light text-start text-dark fw-semibold d-flex align-items-center justify-content-between p-2 rounded-2 border-0"
                                    style={{ fontSize: '0.88rem' }}
                                    onClick={() => navigate('/admin/complaints')}
                                >
                                    <span><FaExclamationCircle className="text-danger me-2" size={13} /> Complaints</span>
                                    <FaArrowRight size={10} className="text-muted" />
                                </button>
                                {role === 'superadmin' && (
                                    <button
                                        className="btn btn-light text-start text-dark fw-semibold d-flex align-items-center justify-content-between p-2 rounded-2 border-0"
                                        style={{ fontSize: '0.88rem' }}
                                        onClick={() => navigate('/admin/settings')}
                                    >
                                        <span><FaCog className="text-secondary me-2" size={13} /> Platform Settings</span>
                                        <FaArrowRight size={10} className="text-muted" />
                                    </button>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Global Search Modal */}
            <GlobalSearchModal show={showSearchModal} onHide={() => setShowSearchModal(false)} />

            {/* Digital Clock & Compact Button Styles */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800;900&family=Share+Tech+Mono&display=swap');

                .digital-blinking-colon {
                    animation: colonBlink 1s infinite steps(1, start);
                }

                @keyframes colonBlink {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.18;
                    }
                }

                .led-pulse-dot {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #38bdf8;
                    box-shadow: 0 0 6px #38bdf8;
                    animation: dotPulse 2s infinite ease-in-out;
                }

                @keyframes dotPulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.3);
                        opacity: 0.5;
                    }
                }

                .hero-action-btn {
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                .hero-action-btn:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.08);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
                }
                .hero-action-btn:active {
                    transform: translateY(1px);
                }

                .compact-borgo-btn:hover {
                    transform: translateY(-3px) scale(1.03);
                    filter: brightness(1.08);
                }
                .compact-borgo-btn:active {
                    transform: translateY(1.5px) scale(0.97);
                    filter: brightness(0.95);
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
