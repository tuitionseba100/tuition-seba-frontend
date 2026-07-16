import React, { useState } from "react";
import {
    Button,
    Form,
    Toast,
    ToastContainer,
} from "react-bootstrap";
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import './LoginPage.css';

// Animated Flower Particle Component with custom emoji (different types/colors)
const WelcomingFlower = ({ delay, side, emoji }) => {
    const isLeft = side === "left";
    return (
        <motion.span
            className="welcoming-flower"
            initial={{ opacity: 0, scale: 0.4, x: isLeft ? -30 : 30, y: 10 }}
            animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0.4, 1.2, 0.9, 0.5],
                x: isLeft ? [-30, -10, -5, 10] : [30, 10, 5, -10],
                y: [10, -40, -90, -140],
                rotate: [0, 120, 240, 360]
            }}
            transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: "easeOut",
                delay: delay
            }}
            style={{
                position: "absolute",
                fontSize: "18px",
                pointerEvents: "none",
                bottom: "60px",
                left: isLeft ? "40px" : "auto",
                right: isLeft ? "auto" : "40px",
                zIndex: 8
            }}
        >
            {emoji}
        </motion.span>
    );
};

// SVG Chibi Dancing Agent Component
const ChibiDancingAgent = ({ type }) => {
    const isCap = type === "cap";
    return (
        <svg viewBox="0 0 40 40" className="chibi-agent-svg">
            <defs>
                <linearGradient id="chibiSuit" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="chibiSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffedd5" />
                    <stop offset="100%" stopColor="#fed7aa" />
                </linearGradient>
            </defs>
            {/* Body / Suit */}
            <path d="M 12 35 C 12 28, 16 26, 20 26 C 24 26, 28 28, 28 35 Z" fill="url(#chibiSuit)" />
            {/* Shirt / Tie */}
            <path d="M 18 26 L 20 30 L 22 26 Z" fill="#ffffff" />
            <path d="M 19.5 29 L 20.5 29 L 21 34 L 20 36 L 19 34 Z" fill={isCap ? "#3b82f6" : "#ef4444"} />
            {/* Head */}
            <circle cx="20" cy="18" r="8" fill="url(#chibiSkin)" />
            {/* Cool Glasses */}
            <rect x="14" y="15" width="5" height="4" rx="1" fill="#0f172a" stroke="#6366f1" strokeWidth="0.5" />
            <rect x="21" y="15" width="5" height="4" rx="1" fill="#0f172a" stroke="#6366f1" strokeWidth="0.5" />
            <line x1="19" y1="17" x2="21" y2="17" stroke="#6366f1" strokeWidth="0.8" />
            {/* Hat / Cap */}
            {isCap ? (
                // Backwards blue cap
                <g>
                    <path d="M 13 14 C 13 8, 27 8, 27 14 Z" fill="#3b82f6" />
                    <path d="M 27 14 L 32 16 L 31 18 L 27 15 Z" fill="#2563eb" />
                </g>
            ) : (
                // Spy Fedora
                <g>
                    <path d="M 14 12 C 14 6, 26 6, 26 12 Z" fill="#334155" />
                    <rect x="11" y="12" width="18" height="2" rx="0.5" fill="#334155" />
                    <rect x="13.8" y="10.8" width="12.4" height="1.2" fill="#ef4444" />
                </g>
            )}
        </svg>
    );
};

// SVG Suited & Tied Hacker Mascot Component (Sneaky & Slap Interactive)
const InteractiveSuitedHackerMascot = ({ username, password, isUsernameFocused, isPasswordFocused, showPassword, hasError, loading }) => {
    const usernameLength = username ? username.length : 0;
    const passwordLength = password ? password.length : 0;

    // Detect Slap trigger
    const isSlapped = isPasswordFocused && passwordLength >= 6;
    const isSneaking = isPasswordFocused && passwordLength >= 4 && passwordLength <= 5;
    
    // Sneaky Eye movements: looking left and right suspiciously on keypresses
    let pupilX = 0;
    let pupilY = 0;

    if (isUsernameFocused && usernameLength > 0) {
        pupilX = (usernameLength % 3 === 0) ? -6 : (usernameLength % 3 === 1) ? 6 : 0;
        pupilY = 2;
    } else if (isPasswordFocused) {
        pupilY = -2;
        pupilX = showPassword || isSneaking ? -4 : 0; // Look left when sneaking around the board
    }

    // Sunglasses animation
    let glassesAnimate = { y: 0, rotate: 0 };
    if (hasError) {
        glassesAnimate = { y: 9, rotate: -6 }; 
    } else if (isSlapped) {
        glassesAnimate = { y: 13, rotate: -24 }; // Knocked extremely crooked!
    } else if (isSneaking || (isPasswordFocused && showPassword)) {
        glassesAnimate = { y: 4, rotate: 3 }; 
    }

    // Default coordinates
    let leftHandOffset = { x: 0, y: 0 };
    let rightHandOffset = { x: 0, y: 0 };
    let clipboardAnimate = { y: 80, rotate: 15, scale: 0.8, opacity: 0 };
    let tieAnimate = { rotate: 0, y: 0 };
    let headAnimate = { x: 0, y: 0, scale: 1, rotate: 0 };

    if (isPasswordFocused) {
        if (isSlapped) {
            // KNOCKED BACK BY THE SLAP!
            headAnimate = { x: 16, y: -4, rotate: 26, scale: 0.95 };
            clipboardAnimate = { y: 8, rotate: 14, scale: 0.9, opacity: 0.8 };
            leftHandOffset = { x: -16, y: -24 };
            rightHandOffset = { x: 26, y: -28 };
            tieAnimate = { rotate: 20, y: -2 };
        } else if (isSneaking) {
            // SNEAKY PEEK: Slides head to the left and tilts it to peek around the clipboard
            headAnimate = { x: -9, y: 3, scale: 1, rotate: -12 };
            clipboardAnimate = { y: -5, rotate: 5, scale: 1, opacity: 1 };
            leftHandOffset = { x: -22, y: -38 };
            rightHandOffset = { x: 20, y: -36 };
        } else {
            // Covering eyes fully
            clipboardAnimate = { y: -22, rotate: 0, scale: 1.05, opacity: 1 };
            leftHandOffset = { x: -21, y: -52 };
            rightHandOffset = { x: 21, y: -52 };
        }
    } else if (loading) {
        // Frantic speed typing
        leftHandOffset = {
            y: [0, -6, 0, -6, 0],
            x: [0, 2, -2, 2, 0],
            transition: { repeat: Infinity, duration: 0.2 }
        };
        rightHandOffset = {
            y: [-3, 3, -3, 3, -3],
            x: [0, -2, 2, -2, 0],
            transition: { repeat: Infinity, duration: 0.2 }
        };
        tieAnimate = { 
            rotate: [0, -5, 5, -5, 0],
            transition: { repeat: Infinity, duration: 0.4 }
        };
    } else if (isUsernameFocused && usernameLength > 0) {
        // Sneaky typing (shielding with left arm, tilting head)
        const isEven = usernameLength % 2 === 0;
        headAnimate = { 
            rotate: isEven ? -8 : 8,
            y: 4,
            scale: 1.03
        };
        leftHandOffset = { x: -24, y: -32 }; 
        rightHandOffset = { y: isEven ? -4 : 4, x: isEven ? -2 : 2 };
    }

    if (hasError) {
        tieAnimate = { 
            rotate: [0, -12, 12, -12, 12, 0],
            y: [0, 2, -2, 2, 0],
            transition: { duration: 0.5 }
        };
        headAnimate = {
            x: [0, -6, 6, -6, 6, 0],
            transition: { duration: 0.5 }
        };
    }

    const baseLeftHand = { cx: 34, cy: 86 };
    const baseRightHand = { cx: 66, cy: 86 };

    const currentLeftHand = {
        x: baseLeftHand.cx + (leftHandOffset.x && typeof leftHandOffset.x === 'number' ? leftHandOffset.x : 0),
        y: baseLeftHand.cy + (leftHandOffset.y && typeof leftHandOffset.y === 'number' ? leftHandOffset.y : 0)
    };
    const currentRightHand = {
        x: baseRightHand.cx + (rightHandOffset.x && typeof rightHandOffset.x === 'number' ? rightHandOffset.x : 0),
        y: baseRightHand.cy + (rightHandOffset.y && typeof rightHandOffset.y === 'number' ? rightHandOffset.y : 0)
    };

    const leftArmPath = `M 20 78 C 18 64, ${currentLeftHand.x - 12} ${currentLeftHand.y + 6}, ${currentLeftHand.x} ${currentLeftHand.y}`;
    const rightArmPath = `M 80 78 C 82 64, ${currentRightHand.x + 12} ${currentRightHand.y + 6}, ${currentRightHand.x} ${currentRightHand.y}`;

    return (
        <svg viewBox="0 0 100 100" className="mascot-svg">
            <defs>
                {/* Suit Gradients */}
                <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                {/* Tie Gradient */}
                <linearGradient id="tieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
                {/* Skin tone */}
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffedd5" />
                    <stop offset="100%" stopColor="#fed7aa" />
                </linearGradient>
                {/* Fedora Hat Gradient */}
                <linearGradient id="fedoraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
            </defs>

            {/* Suited Shoulders / Body */}
            <path d="M 15 90 C 15 72, 28 68, 50 68 C 72 68, 85 72, 85 90 Z" fill="url(#suitGrad)" />
            
            {/* White Shirt V-Neck */}
            <path d="M 43 68 L 50 78 L 57 68 Z" fill="#ffffff" />
            
            {/* Dark Tie */}
            <motion.path 
                d="M 48 76 L 52 76 L 53 90 L 50 94 L 47 90 Z" 
                fill="url(#tieGrad)" 
                transform-origin="50 76"
                animate={tieAnimate}
            />

            {/* Suit Lapels */}
            <path d="M 32 68 L 44 79 L 41 84 Z" fill="#0f172a" />
            <path d="M 68 68 L 56 79 L 59 84 Z" fill="#0f172a" />

            {/* Hacker Face & Head group */}
            <motion.g 
                transform-origin="50 46"
                animate={headAnimate}
                transition={{ type: "spring", stiffness: 120, damping: 10 }}
            >
                {/* Head Shape */}
                <circle cx="50" cy="46" r="17.5" fill="url(#skinGrad)" />

                {/* Secret Agent Hair */}
                <path d="M 33 42 C 33 34, 67 34, 67 42 Z" fill="#0f172a" />

                {/* Slick hair tufts */}
                <path d="M 31 43 Q 29 46 32 48" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                <path d="M 69 43 Q 71 46 68 48" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

                {/* Shocked/Normal eyes behind sunglasses */}
                <g className="hacker-eyes">
                    <circle cx="43" cy="43" r="2.5" fill="#ffffff" />
                    <circle cx="57" cy="43" r="2.5" fill="#ffffff" />
                    <circle cx="43" cy="43" r="1" fill="#000000" />
                    <circle cx="57" cy="43" r="1" fill="#000000" />
                </g>

                {/* Animated Sunglasses */}
                <motion.g 
                    animate={glassesAnimate}
                    transition={{ type: "spring", stiffness: 160, damping: 12 }}
                >
                    <rect x="35" y="41" width="11" height="6" rx="1" fill="#0f172a" stroke="#6366f1" strokeWidth="1" />
                    <rect x="54" y="41" width="11" height="6" rx="1" fill="#0f172a" stroke="#6366f1" strokeWidth="1" />
                    <line x1="46" y1="43" x2="54" y2="43" stroke="#6366f1" strokeWidth="1.5" />
                    <motion.g
                        animate={{ x: pupilX, y: pupilY }}
                        transition={{ type: "spring", stiffness: 180, damping: 10 }}
                    >
                        <line x1="38" y1="43" x2="43" y2="46" stroke="#818cf8" strokeWidth="1.2" opacity="0.8" />
                        <line x1="57" y1="43" x2="62" y2="46" stroke="#818cf8" strokeWidth="1.2" opacity="0.8" />
                    </motion.g>
                </motion.g>

                {/* Mouth (Worried vs Slapped shock vs normal) */}
                <path d={isSlapped ? "M 45 54 Q 50 56 55 54" : hasError ? "M 46 53 Q 50 49 54 53" : "M 47 52 Q 50 54 53 52"} fill="none" stroke="#9a3412" strokeWidth="1.5" strokeLinecap="round" />

                {/* Red Slap Mark on Left Cheek */}
                {isSlapped && (
                    <g opacity="0.85">
                        <path d="M 58 48 Q 59 45 61 46 C 63 47, 61 51, 58 53" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="58" y1="50" x2="63" y2="48" stroke="#f43f5e" strokeWidth="1.2" />
                        <line x1="57" y1="51" x2="62" y2="50" stroke="#f43f5e" strokeWidth="1.2" />
                    </g>
                )}

                {/* Fedora Hat Section */}
                <g>
                    <path d="M 34 26 L 36.5 15 C 38 12.5, 62 12.5, 63.5 15 L 66 26 Z" fill="url(#fedoraGrad)" stroke="#0f172a" strokeWidth="1" />
                    <path d="M 44 14.5 Q 50 17 56 14.5" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                    <path d="M 33.3 26 L 34 22.5 C 40 21, 60 21, 66 22.5 L 66.7 26 Z" fill="#6366f1" />
                    <text x="50" y="25" fill="#ffffff" fontSize="3.2" fontFamily="sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="0.2" filter="drop-shadow(0 0 3px #a855f7)">TSF</text>
                    <path d="M 24 28 Q 50 31.5 76 28 C 78.5 28, 78.5 26, 76 26 Q 50 29.5 24 26 C 21.5 26, 21.5 28, 24 28 Z" fill="url(#fedoraGrad)" stroke="#0f172a" strokeWidth="0.8" />
                </g>
            </motion.g>

            {/* "TOP SECRET" Clipboard */}
            <motion.g
                animate={clipboardAnimate}
                transition={{ type: "spring", stiffness: 140, damping: 13 }}
                transform-origin="50 50"
            >
                <rect x="30" y="32" width="40" height="26" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                <rect x="44" y="29" width="12" height="5" rx="1.5" fill="#94a3b8" />
                <rect x="33" y="37" width="34" height="18" fill="#f8fafc" />
                <text x="50" y="45" fill="#ef4444" fontSize="4.2" fontFamily="monospace" fontWeight="800" textAnchor="middle">TOP SECRET</text>
                <text x="50" y="51" fill="#475569" fontSize="2.8" fontFamily="monospace" textAnchor="middle">••••••••</text>
            </motion.g>

            {/* Laptop Base */}
            <path d="M 22 84 L 78 84 L 83 93 L 17 93 Z" fill="#475569" stroke="#64748b" strokeWidth="1" />
            <line x1="26" y1="84" x2="74" y2="84" stroke={hasError ? "#ef4444" : isSlapped ? "#ef4444" : "#6366f1"} strokeWidth="2.5" />

            {/* Sleeves / Arms */}
            <g fill="none" stroke="url(#suitGrad)" strokeWidth="6.5" strokeLinecap="round">
                <motion.path 
                    d={leftArmPath} 
                    animate={{ d: leftArmPath }}
                    transition={{ type: "spring", stiffness: 140, damping: 13 }}
                />
                <motion.path 
                    d={rightArmPath} 
                    animate={{ d: rightArmPath }}
                    transition={{ type: "spring", stiffness: 140, damping: 13 }}
                />
            </g>

            {/* Wrists */}
            <g fill="#ffffff">
                <motion.circle 
                    cx={currentLeftHand.x} 
                    cy={currentLeftHand.y} 
                    r="4" 
                    animate={{ cx: currentLeftHand.x, cy: currentLeftHand.y }}
                    transition={{ type: "spring", stiffness: 140, damping: 13 }}
                />
                <motion.circle 
                    cx={currentRightHand.x} 
                    cy={currentRightHand.y} 
                    r="4" 
                    animate={{ cx: currentRightHand.x, cy: currentRightHand.y }}
                    transition={{ type: "spring", stiffness: 140, damping: 13 }}
                />
            </g>

            {/* Hands */}
            <g fill="#fed7aa" stroke="#0f172a" strokeWidth="0.8">
                <motion.circle 
                    cx={currentLeftHand.x} 
                    cy={currentLeftHand.y} 
                    r="3.2" 
                    animate={{ cx: currentLeftHand.x, cy: currentLeftHand.y }}
                    transition={{ type: "spring", stiffness: 140, damping: 13 }}
                />
                <motion.circle 
                    cx={currentRightHand.x} 
                    cy={currentRightHand.y} 
                    r="3.2" 
                    animate={{ cx: currentRightHand.x, cy: currentRightHand.y }}
                    transition={{ type: "spring", stiffness: 140, damping: 13 }}
                />
            </g>

            {/* COMIC SLAP ACTION OVERLAY! */}
            {isSlapped && (
                <motion.g
                    initial={{ scale: 0, rotate: -40, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 10 }}
                    transform-origin="28 42"
                >
                    <path d="M 28 35 L 34 38 L 30 44 L 38 43 L 38 50 L 43 45 L 49 48 L 47 41 L 52 38 L 45 36 L 43 29 L 39 34 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                    <path d="M 12 48 C 12 40, 16 38, 22 41 C 24 38, 28 40, 29 44 C 31 42, 34 44, 33 48 C 32 50, 31 51, 28 51 M 12 48 L 18 54 L 26 53 L 28 51 Z" fill="#ef4444" opacity="0.9" />
                    <rect x="36" y="24" width="16" height="8" rx="2" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                    <path d="M 40 32 L 37 36 L 43 32 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                    <text x="44" y="29" fill="#ffffff" fontSize="3.8" fontFamily="Impact, sans-serif" fontWeight="900" textAnchor="middle">SLAP!</text>
                </motion.g>
            )}
        </svg>
    );
};

const Login = () => {
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required"),
    });

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(
                "https://tuition-seba-backend-1.onrender.com/api/user/login",
                {
                    username: values.username,
                    password: values.password,
                }
            );
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("permissions", JSON.stringify(response.data.permissions || []));
            navigate("/admin/dashboard");
        } catch (err) {
            setError("Invalid username or password");
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    // Different flower emojis thrown
    const leftFlowers = ["🌸", "🌹", "🌷"];
    const rightFlowers = ["🌻", "🌼", "🌺"];

    return (
        <div className="login-container">
            <div className="glow-blob-3" />
            
            <div className="login-content-wrapper">
                <Formik
                    initialValues={{ username: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        errors,
                        touched,
                    }) => (
                        <>
                            {/* Left Side: Interactive Mascot Character */}
                            <motion.div 
                                className="login-mascot-section"
                                initial={{ opacity: 0, x: -60 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <motion.div 
                                    className="mascot-img-container"
                                    animate={{ 
                                        y: [0, -4, 0],
                                    }}
                                    transition={{ 
                                        duration: 6, 
                                        repeat: Infinity, 
                                        ease: "easeInOut" 
                                    }}
                                >
                                    <InteractiveSuitedHackerMascot 
                                        username={values.username}
                                        password={values.password}
                                        isUsernameFocused={isUsernameFocused}
                                        isPasswordFocused={isPasswordFocused}
                                        showPassword={showPassword}
                                        hasError={showError}
                                        loading={loading}
                                    />
                                    <div className="mascot-shadow" />
                                </motion.div>
                            </motion.div>

                            {/* Right Side: Login Card */}
                            <motion.div 
                                className="login-form-section"
                                initial={{ opacity: 0, x: 60 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className="login-card-wrapper">
                                    <div className="login-card">
                                        <motion.img
                                            src="/img/TSF LOGO.png"
                                            alt="TSF Logo"
                                            className="login-logo"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.2, duration: 0.6 }}
                                        />

                                        <motion.h2 
                                            className="login-title"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.6 }}
                                        >
                                            Welcome Back
                                        </motion.h2>
                                        <motion.p 
                                            className="login-subtitle"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4, duration: 0.6 }}
                                        >
                                            Sign in to access your admin dashboard
                                        </motion.p>

                                        <Form noValidate onSubmit={handleSubmit}>
                                            <motion.div 
                                                className="form-group"
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5, duration: 0.5 }}
                                            >
                                                <label className="form-label">Username</label>
                                                <div className="custom-input-wrapper">
                                                    <FaUser className="custom-input-icon" />
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter username"
                                                        name="username"
                                                        value={values.username}
                                                        onChange={handleChange}
                                                        onFocus={() => setIsUsernameFocused(true)}
                                                        onBlur={() => setIsUsernameFocused(false)}
                                                        isInvalid={touched.username && errors.username}
                                                        className="form-control"
                                                    />
                                                </div>
                                                {touched.username && errors.username && (
                                                    <div className="error-feedback">{errors.username}</div>
                                                )}
                                            </motion.div>

                                            <motion.div 
                                                className="form-group"
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6, duration: 0.5 }}
                                            >
                                                <label className="form-label">Password</label>
                                                <div className="custom-input-wrapper">
                                                    <FaLock className="custom-input-icon" />
                                                    <Form.Control
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter password"
                                                        name="password"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        onFocus={() => setIsPasswordFocused(true)}
                                                        onBlur={() => setIsPasswordFocused(false)}
                                                        isInvalid={touched.password && errors.password}
                                                        className="form-control password-input"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="password-toggle-btn"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                    >
                                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </button>
                                                </div>
                                                {touched.password && errors.password && (
                                                    <div className="error-feedback">{errors.password}</div>
                                                )}
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.7, duration: 0.5 }}
                                            >
                                                <Button
                                                    type="submit"
                                                    className="btn-login"
                                                    disabled={loading}
                                                >
                                                    {loading && <div className="btn-spinner" />}
                                                    {loading ? "Logging in..." : "Login"}
                                                </Button>
                                            </motion.div>
                                        </Form>

                                        <motion.div 
                                            className="login-footer"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.8, duration: 0.6 }}
                                        >
                                            <p>Need help? <a href="#">Contact Support</a></p>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </Formik>
            </div>

            {/* Bottom Dancing Chibi Agents, Welcoming speechbubble, & flower shower */}
            <div className="bottom-dancing-agents-section">
                {/* Left side throwing cherry blossoms, roses, and tulips */}
                <WelcomingFlower delay={0} side="left" emoji={leftFlowers[0]} />
                <WelcomingFlower delay={1.2} side="left" emoji={leftFlowers[1]} />
                <WelcomingFlower delay={2.4} side="left" emoji={leftFlowers[2]} />

                <motion.div 
                    className="chibi-agent-wrapper-left"
                    animate={{ 
                        y: [0, -12, 0],
                        x: [-5, 5, -5],
                        rotate: [-10, 10, -10]
                    }}
                    transition={{ 
                        repeat: Infinity, 
                        duration: 1.5, 
                        ease: "easeInOut" 
                    }}
                >
                    <ChibiDancingAgent type="fedora" />
                </motion.div>

                <div className="dancing-agents-welcome-card">
                    <p className="welcome-headline">Welcome Agent</p>
                    <p className="welcome-subline">Have a productive day!</p>
                </div>

                <motion.div 
                    className="chibi-agent-wrapper-right"
                    animate={{ 
                        y: [-12, 0, -12],
                        x: [5, -5, 5],
                        rotate: [10, -10, 10]
                    }}
                    transition={{ 
                        repeat: Infinity, 
                        duration: 1.5, 
                        ease: "easeInOut" 
                    }}
                >
                    <ChibiDancingAgent type="cap" />
                </motion.div>

                {/* Right side throwing sunflowers, daisies, and hibiscus */}
                <WelcomingFlower delay={0.6} side="right" emoji={rightFlowers[0]} />
                <WelcomingFlower delay={1.8} side="right" emoji={rightFlowers[1]} />
                <WelcomingFlower delay={3.0} side="right" emoji={rightFlowers[2]} />
            </div>

            <ToastContainer position="top-end" className="toast-container">
                <Toast
                    onClose={() => setShowError(false)}
                    show={showError}
                    delay={3000}
                    autohide
                    bg="danger"
                >
                    <Toast.Body className="text-white">{error}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default Login;