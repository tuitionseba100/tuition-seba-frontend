import React, { useState, useEffect, useRef } from 'react';
import { Container, Modal, Button, Badge } from 'react-bootstrap';
import { 
    FaStar, 
    FaCheckCircle, 
    FaQuoteLeft, 
    FaChevronLeft, 
    FaChevronRight, 
    FaFacebook, 
    FaUserCheck,
    FaExpandAlt
} from 'react-icons/fa';

const reviewsData = [
    {
        id: 1,
        name: "Md Arshad Ullah",
        designation: "ভেরিফাইড শিক্ষক",
        image: "/img/reviews/review1.png",
        stars: 5,
        highlight: "বিগত তিন বছর যাবত তাদের কাছ থেকে নিয়মিত টিউশন নিয়ে আসছি। কথা ও কাজে খুব একটিভ, টিউশন ক্যানসেল হলে সময়মতো রিফান্ড দেয়। তাদের ব্যবহার মাশাল্লাহ খুব ভালো।",
        fullText: "মাশাআল্লাহ, টিউশন ফোরাম মিডিয়াটি চমৎকার সেবা দিয়ে যাচ্ছেন, আমি বিগত তিন বছর যাবত তাদের কাছ থেকে নিয়মিত টিউশন নিয়ে আসছি আলহামদুলিল্লাহ তাদের কথা কাজে খুব একটিভ এবং তাদের ব্যবহার মাশাল্লাহ অনেক সুন্দর।"
    },
    {
        id: 2,
        name: "Tania Akter Shimu",
        designation: "ভেরিফাইড শিক্ষিকা",
        image: "/img/reviews/review2.png",
        stars: 5,
        highlight: "Tuition seba forum এর মাধ্যমে টিউশন পাওয়ার অভিজ্ঞতা সত্যিই চমৎকার। পুরো প্রক্রিয়া ও তাদের আন্তরিকতা, দ্রুত যোগাযোগ প্রশংসনীয়। কর্তৃপক্ষকে আন্তরিক ধন্যবাদ!",
        fullText: "Tuition seba forum এর মাধ্যমে টিউশন পাওয়ার অভিজ্ঞতা সত্যিই চমৎকার। পুরো প্রক্রিয়া ও তাদের আন্তরিকতা দ্রুত যোগাযোগ প্রশংসনীয়। তাদের দায়িত্বশীলতা আমাকে মুগ্ধ করেছে।"
    },
    {
        id: 3,
        name: "Monisha Dey Tushi",
        designation: "ভেরিফাইড শিক্ষিকা",
        image: "/img/reviews/review3.png",
        stars: 5,
        highlight: "Tuition seba Forum সত্যিই অনন্য এবং অতুলনীয়। এই পেইজ থেকে টিউশনি পেয়ে খুবই উপকৃত হয়েছি। এটি একটি বিশ্বাসযোগ্য ও নির্ভরযোগ্য প্ল্যাটফর্ম।",
        fullText: "Tuition seba Forum সত্যিই অনন্য এবং অতুলনীয়। আমি এই পেইজ থেকে টিউশনি পেয়ে খুবই উপকৃত হয়েছি। এটি একটি বিশ্বাসযোগ্য ও নির্ভরযোগ্য প্ল্যাটফর্ম।"
    },
    {
        id: 4,
        name: "মাওলানা সাইফুল ইসলাম",
        designation: "ভেরিফাইড শিক্ষক",
        image: "/img/reviews/review4.png",
        stars: 5,
        highlight: "অভিজ্ঞতা সত্যিই প্রশংসার দাবীদার। পুরো প্রক্রিয়ায় আন্তরিকতা, দ্রুত যোগাযোগ ও পেশাদারিত্ব প্রশংসনীয়। শিক্ষক ও অভিভাবকদের জন্য এটি অত্যন্ত নির্ভরযোগ্য প্ল্যাটফর্ম।",
        fullText: "Tuition Seba Forum-এর মাধ্যমে টিউশনি পাওয়ার অভিজ্ঞতা সত্যিই প্রশংসার দাবীদার। পুরো প্রক্রিয়ায় তাদের আন্তরিকতা, দ্রুত যোগাযোগ ও পেশাদারিত্ব প্রশংসনীয়।"
    },
    {
        id: 5,
        name: "Mohammad Shariar",
        designation: "ভেরিফাইড শিক্ষক",
        image: "/img/reviews/review5.png",
        stars: 5,
        highlight: "খুবই সুন্দর ও আন্তরিকভাবে টিউটরদের সঙ্গে শিক্ষার্থীদের যোগাযোগ করিয়ে দেয়। তাদের ব্যবস্থাপনা, ব্যবহার ও সহযোগিতা সত্যিই প্রশংসনীয়। সততা ও দায়িত্বশীলতায় তারা অনন্য।",
        fullText: "Tuition Seba Forum খুবই সুন্দর ও আন্তরিকভাবে টিউটরদের সঙ্গে শিক্ষার্থীদের যোগাযোগ করিয়ে দেয়। তাদের ব্যবস্থাপনা, ব্যবহার ও সহযোগিতা সত্যিই প্রশংসনীয়।"
    }
];

const HappyClients = () => {
    const [selectedReviewIndex, setSelectedReviewIndex] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const scrollContainerRef = useRef(null);

    // Duplicated reviews 4 times for continuous, smooth left-to-right infinite scrolling
    const loopedReviews = [...reviewsData, ...reviewsData, ...reviewsData, ...reviewsData];

    const activeReview = selectedReviewIndex !== null ? reviewsData[selectedReviewIndex % reviewsData.length] : null;

    const handleNext = () => {
        if (selectedReviewIndex !== null) {
            setSelectedReviewIndex((selectedReviewIndex + 1) % reviewsData.length);
        }
    };

    const handlePrev = () => {
        if (selectedReviewIndex !== null) {
            setSelectedReviewIndex((selectedReviewIndex - 1 + reviewsData.length) % reviewsData.length);
        }
    };

    const scrollManual = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -420 : 420;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedReviewIndex === null) return;
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') setSelectedReviewIndex(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedReviewIndex]);

    return (
        <section
            id="happy-clients"
            className="reviews-section-area position-relative"
            style={{
                background: 'linear-gradient(180deg, #f8fafd 0%, #ffffff 40%, #ffffff 60%, #f4f7fc 100%)',
                padding: '80px 0 70px 0',
                overflow: 'hidden'
            }}
        >
            {/* Ambient Background Glow Elements */}
            <div className="ambient-glow glow-top-left" />
            <div className="ambient-glow glow-bottom-right" />

            <Container fluid="lg" className="position-relative" style={{ zIndex: 2 }}>
                {/* Header Section */}
                <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-2 rounded-pill bg-primary bg-opacity-10 text-primary fw-semibold small shadow-sm border border-primary border-opacity-10">
                        <FaFacebook style={{ color: '#1877F2', fontSize: '16px' }} />
                        <span>১০০% আসল শিক্ষক মতামত ও রিভিউ</span>
                    </div>

                    <h2
                        className="reviews-heading mt-1 mb-2"
                        style={{
                            fontWeight: '800',
                            fontSize: '2.4rem',
                            color: '#0d2d59',
                            letterSpacing: '-0.5px'
                        }}
                    >
                        আমাদের সম্মানিত শিক্ষকদের মতামত ও অভিজ্ঞতা
                    </h2>

                    <div
                        style={{
                            height: '4px',
                            width: '75px',
                            background: 'linear-gradient(90deg, #004085, #1877F2)',
                            margin: '12px auto 16px auto',
                            borderRadius: '4px'
                        }}
                    />

                    <p
                        className="text-secondary mx-auto mb-3"
                        style={{
                            fontSize: '1.05rem',
                            maxWidth: '720px',
                            lineHeight: 1.6
                        }}
                    >
                        Tuition Seba Forum থেকে নিয়মিত ও নির্ভরযোগ্য টিউশন পেয়ে সম্মানিত শিক্ষকরা আমাদের অফিসিয়াল ফেসবুক পেইজে কী বলছেন — এক নজরে সরাসরি তাদের মন্তব্যগুলো দেখুন।
                    </p>

                    {/* Controls Bar: Sleek Navigation Arrows */}
                    <div className="d-flex justify-content-center align-items-center gap-2 mt-3 mb-2">
                        <button
                            onClick={() => scrollManual('left')}
                            className="review-scroll-nav-btn"
                            title="বামে স্ক্রোল করুন"
                            aria-label="Scroll Left"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={() => scrollManual('right')}
                            className="review-scroll-nav-btn"
                            title="ডানে স্ক্রোল করুন"
                            aria-label="Scroll Right"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            </Container>

            {/* Continuous Single-Line Left-to-Right Scrolling Marquee */}
            <div 
                className="reviews-marquee-outer-container position-relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Left & Right Soft Fade Gradients */}
                <div className="fade-mask mask-left" />
                <div className="fade-mask mask-right" />

                <div 
                    ref={scrollContainerRef}
                    className={`reviews-marquee-track ${isPaused ? 'paused' : ''}`}
                >
                    {loopedReviews.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="review-single-card-wrap"
                        >
                            <div 
                                className="review-card-item rounded-4 bg-white shadow-sm"
                                onClick={() => setSelectedReviewIndex(index % reviewsData.length)}
                            >
                                {/* Top Gradient Accent Bar */}
                                <div className="card-top-accent" />

                                <div className="p-3 p-md-4">
                                    {/* Author Info & Rating */}
                                    <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                                        <div className="d-flex align-items-center gap-3">
                                            <div 
                                                className="author-avatar-monogram shadow-sm flex-shrink-0"
                                            >
                                                {item.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h6 className="mb-1 fw-bold text-dark text-truncate" title={item.name} style={{ fontSize: '0.98rem' }}>
                                                    {item.name}
                                                </h6>
                                                <div className="d-flex align-items-center gap-1 text-success small fw-semibold">
                                                    <FaCheckCircle style={{ color: '#10b981', fontSize: '0.85rem' }} />
                                                    <span style={{ fontSize: '0.8rem' }}>{item.designation}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 5 Stars */}
                                        <div className="stars-wrapper d-flex align-items-center gap-1">
                                            {[...Array(item.stars)].map((_, s) => (
                                                <FaStar key={s} className="star-icon" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Highlight Quote */}
                                    <div className="review-quote-box mb-3">
                                        <FaQuoteLeft className="quote-icon me-1" />
                                        <span className="fst-italic text-secondary" style={{ fontSize: '0.88rem', lineHeight: '1.55' }}>
                                            "{item.highlight}"
                                        </span>
                                    </div>

                                    {/* Clean Screenshot Thumbnail Frame */}
                                    <div className="review-image-frame position-relative rounded-3 overflow-hidden border">
                                        <img
                                            src={item.image}
                                            alt={`${item.name} Review`}
                                            className="w-100 review-img"
                                            style={{
                                                height: '210px',
                                                objectFit: 'contain',
                                                backgroundColor: '#f8fafc',
                                                display: 'block'
                                            }}
                                            loading="lazy"
                                        />
                                        
                                        {/* Minimal Hover Overlay */}
                                        <div className="review-zoom-overlay d-flex align-items-center justify-content-center">
                                            <div className="zoom-btn-pill px-3 py-2 rounded-pill bg-white text-primary shadow fw-bold small d-flex align-items-center gap-2">
                                                <FaExpandAlt />
                                                <span>বড় করে দেখুন</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Clean Assurance Banner */}
            <Container className="text-center mt-4 pt-3 position-relative" style={{ zIndex: 2 }}>
                <div className="d-inline-flex align-items-center gap-2 p-2 px-4 rounded-pill bg-white border shadow-sm">
                    <FaUserCheck className="text-success fs-5" />
                    <span className="text-dark fw-bold small">
                        প্রতিটি রিভিউ ১০০% আসল ও সম্মানিত শিক্ষকদের ফেসবুক মন্তব্য থেকে সংগৃহীত
                    </span>
                    <Badge bg="primary" className="ms-1 px-2 py-1 rounded-pill">ভেরিফাইড</Badge>
                </div>
            </Container>

            {/* Lightbox Modal for Full View */}
            <Modal
                show={selectedReviewIndex !== null}
                onHide={() => setSelectedReviewIndex(null)}
                centered
                size="lg"
                dialogClassName="review-gallery-modal"
            >
                {activeReview && (
                    <>
                        <Modal.Header 
                            closeButton 
                            className="border-0 px-4 pt-3 pb-2"
                            style={{ background: '#f8fafd' }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div 
                                    className="author-avatar-monogram shadow-sm"
                                    style={{ width: '44px', height: '44px', fontSize: '1.1rem' }}
                                >
                                    {activeReview.name.charAt(0)}
                                </div>
                                <div>
                                    <h5 className="mb-0 fw-bold text-dark">{activeReview.name}</h5>
                                    <div className="d-flex align-items-center gap-1 text-success small fw-semibold">
                                        <FaCheckCircle style={{ color: '#10b981' }} /> {activeReview.designation}
                                    </div>
                                </div>
                            </div>
                        </Modal.Header>

                        <Modal.Body className="p-3 p-md-4 text-center bg-white position-relative">
                            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '340px' }}>
                                <img
                                    src={activeReview.image}
                                    alt={activeReview.name}
                                    className="img-fluid rounded-3 shadow border"
                                    style={{
                                        maxHeight: '68vh',
                                        width: 'auto',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>

                            {/* Modal Navigation Buttons */}
                            <button
                                onClick={handlePrev}
                                className="lightbox-nav-btn prev-btn"
                                title="পূর্ববর্তী রিভিউ"
                                aria-label="Previous"
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                onClick={handleNext}
                                className="lightbox-nav-btn next-btn"
                                title="পরবর্তী রিভিউ"
                                aria-label="Next"
                            >
                                <FaChevronRight />
                            </button>
                        </Modal.Body>

                        <Modal.Footer className="border-0 d-flex justify-content-between align-items-center bg-light px-4 py-2">
                            <span className="small text-muted fw-semibold">
                                রিভিউ {(selectedReviewIndex % reviewsData.length) + 1} / {reviewsData.length}
                            </span>

                            <div className="d-flex gap-2">
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm" 
                                    className="rounded-pill px-3 shadow-sm"
                                    onClick={handlePrev}
                                >
                                    <FaChevronLeft className="me-1 small" /> পূর্ববর্তী
                                </Button>
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    className="rounded-pill px-3 shadow-sm"
                                    style={{ background: '#004085', borderColor: '#004085' }}
                                    onClick={handleNext}
                                >
                                    পরবর্তী <FaChevronRight className="ms-1 small" />
                                </Button>
                            </div>
                        </Modal.Footer>
                    </>
                )}
            </Modal>

            {/* Component Styles */}
            <style>
                {`
                /* Ambient Background Glow */
                .ambient-glow {
                    position: absolute;
                    width: 450px;
                    height: 450px;
                    border-radius: 50%;
                    filter: blur(100px);
                    pointer-events: none;
                    z-index: 1;
                }
                .glow-top-left {
                    top: -100px;
                    left: -100px;
                    background: rgba(0, 64, 133, 0.05);
                }
                .glow-bottom-right {
                    bottom: -100px;
                    right: -100px;
                    background: rgba(24, 119, 242, 0.05);
                }

                /* Outer Marquee Container */
                .reviews-marquee-outer-container {
                    width: 100%;
                    overflow-x: hidden;
                    position: relative;
                    padding: 15px 0 25px 0;
                }

                /* Edge Fade Gradients */
                .fade-mask {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 120px;
                    z-index: 5;
                    pointer-events: none;
                }
                .mask-left {
                    left: 0;
                    background: linear-gradient(to right, rgba(248, 250, 253, 1) 0%, rgba(248, 250, 253, 0) 100%);
                }
                .mask-right {
                    right: 0;
                    background: linear-gradient(to left, rgba(244, 247, 252, 1) 0%, rgba(244, 247, 252, 0) 100%);
                }

                /* Single Line Marquee Track (Left to Right Animation) */
                .reviews-marquee-track {
                    display: flex;
                    flex-wrap: nowrap;
                    gap: 26px;
                    width: max-content;
                    animation: marqueeScrollLeftToRight 135s linear infinite;
                    will-change: transform;
                    overflow-x: visible;
                }

                .reviews-marquee-track.paused {
                    animation-play-state: paused !important;
                }

                /* Left to Right Scrolling: moves elements smoothly to the right */
                @keyframes marqueeScrollLeftToRight {
                    0% {
                        transform: translateX(calc(-100% / 2));
                    }
                    100% {
                        transform: translateX(0);
                    }
                }

                /* Single Card Sizing */
                .review-single-card-wrap {
                    width: 390px;
                    min-width: 390px;
                    flex-shrink: 0;
                }

                /* Card Design & Elevation */
                .review-card-item {
                    border: 1px solid #e5edf5;
                    cursor: pointer;
                    transition: transform 0.35s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.35s ease, border-color 0.35s ease;
                    position: relative;
                    overflow: hidden;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .card-top-accent {
                    height: 4px;
                    width: 100%;
                    background: linear-gradient(90deg, #004085 0%, #1877F2 100%);
                }

                .review-card-item:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 18px 38px rgba(0, 64, 133, 0.13) !important;
                    border-color: #1877F2 !important;
                }

                /* Avatar Monogram */
                .author-avatar-monogram {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    color: #ffffff;
                    background: linear-gradient(135deg, #004085 0%, #1877F2 100%);
                    font-size: 1rem;
                    border: 2px solid #ffffff;
                }

                /* Rating Stars */
                .star-icon {
                    color: #f59e0b;
                    font-size: 0.95rem;
                }

                /* Quote Box */
                .quote-icon {
                    color: #004085;
                    opacity: 0.3;
                    font-size: 0.8rem;
                }

                .review-quote-box {
                    min-height: 60px;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* Image Thumbnail Frame & Overlay */
                .review-image-frame {
                    background-color: #f8fafc;
                    border-color: #e2e8f0 !important;
                }

                .review-img {
                    transition: transform 0.4s ease;
                }

                .review-card-item:hover .review-img {
                    transform: scale(1.03);
                }

                .review-zoom-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(13, 45, 89, 0.65);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    backdrop-filter: blur(2px);
                }

                .review-card-item:hover .review-zoom-overlay {
                    opacity: 1;
                }

                .zoom-btn-pill {
                    transform: translateY(8px);
                    transition: transform 0.3s ease;
                }

                .review-card-item:hover .zoom-btn-pill {
                    transform: translateY(0);
                }

                /* Navigation & Lightbox Buttons */
                .review-scroll-nav-btn {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    border: 1px solid #d2dfea;
                    background: #ffffff;
                    color: #004085;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
                }

                .review-scroll-nav-btn:hover {
                    background: #004085;
                    color: #ffffff;
                    border-color: #004085;
                    transform: scale(1.1);
                }

                .lightbox-nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.18);
                    color: #004085;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    z-index: 10;
                }

                .lightbox-nav-btn:hover {
                    background: #004085;
                    color: #ffffff;
                    transform: translateY(-50%) scale(1.12);
                }

                .prev-btn { left: 15px; }
                .next-btn { right: 15px; }

                /* Responsive Adjustments */
                @media (max-width: 768px) {
                    .review-single-card-wrap {
                        width: 320px;
                        min-width: 320px;
                    }
                    .fade-mask {
                        width: 40px;
                    }
                    .reviews-heading {
                        font-size: 1.8rem !important;
                    }
                }

                @media (max-width: 576px) {
                    .review-single-card-wrap {
                        width: 290px;
                        min-width: 290px;
                    }
                    .lightbox-nav-btn {
                        width: 36px;
                        height: 36px;
                        font-size: 0.85rem;
                    }
                    .prev-btn { left: 6px; }
                    .next-btn { right: 6px; }
                }
                `}
            </style>
        </section>
    );
};

export default HappyClients;
