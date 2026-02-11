import React, { useState } from 'react';
import { Card, Button, ListGroup, Badge } from 'react-bootstrap';
import {
    FaChalkboardTeacher, FaUsers, FaUniversity, FaBook,
    FaLanguage, FaBookOpen, FaCalendarDay, FaClock,
    FaMoneyBill, FaMapMarkerAlt, FaCalendarCheck, FaWhatsapp, FaGlobe
} from 'react-icons/fa';
import ApplyModal from '../components/modals/ApplyModal';

const TuitionCard = ({ tuition }) => {
    const [showModal, setShowModal] = useState(false);

    // Check if tuition is new (created within 3 days)
    const isNewTuition = () => {
        if (!tuition.createdAt) return false;
        const createdDate = new Date(tuition.createdAt);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - createdDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3;
    };

    const handleApplyClick = () => {
        if (tuition.isWhatsappApply) {
            redirectToWhatsApp(tuition);
        } else {
            setShowModal(true);
        }
    };

    const redirectToWhatsApp = (tuitionDetails) => {
        const phoneNumber = '+8801571305804';
        const area = tuitionDetails.area ? `, ${tuitionDetails.area}` : '';

        const message = `
Tuition Code: ${tuitionDetails.tuitionCode}
Wanted Teacher: ${tuitionDetails.wantedTeacher}
Number of Students: ${tuitionDetails.student}
Class: ${tuitionDetails.class}
Medium: ${tuitionDetails.medium}
Subject: ${tuitionDetails.subject}
Day: ${tuitionDetails.day}
Time: ${tuitionDetails.time}
Salary: ${tuitionDetails.salary && /taka|tk/i.test(tuitionDetails.salary.toString()) ? tuitionDetails.salary : (tuitionDetails.salary ? tuitionDetails.salary.toString().trim() + ' taka' : '')}
Location: ${tuitionDetails.location}${area}
Joining: ${tuitionDetails.joining}

এই টিউশনটা (${tuitionDetails.tuitionCode}) কি এখনো আছে?`.trim();

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const infoRow = (icon, label, value) => (
        <div
            className="d-flex justify-content-between align-items-center mb-2 mx-3"
            style={{
                padding: '10px 15px',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #f1f5f9',
                transition: 'all 0.2s ease',
            }}
        >
            <div className="d-flex align-items-center text-secondary fw-semibold">
                <span className="me-2" style={{ color: '#0066cc', fontSize: '1rem' }}>{icon}</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{label}</span>
            </div>
            <div className="text-dark fw-bold text-end" style={{ maxWidth: '65%', fontSize: '0.9rem' }}>
                {value || '-'}
            </div>
        </div>
    );

    return (
        <>
            <Card
                className="mx-auto mb-4 border-0"
                style={{
                    maxWidth: '460px',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    background: '#fff',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                }}
            >
                {isNewTuition() && (
                    <Badge
                        bg="danger"
                        className="position-absolute top-0 start-0 m-2"
                        style={{
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            padding: '5px 10px',
                            zIndex: 10
                        }}
                    >
                        NEW
                    </Badge>
                )}
                <Card.Header
                    className="text-white d-flex justify-content-center align-items-center gap-2"
                    style={{
                        background: 'linear-gradient(135deg, #004085 0%, #0066cc 100%)',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        padding: '15px 10px',
                        letterSpacing: '0.5px',
                        borderBottom: 'none',
                    }}
                >
                    <FaChalkboardTeacher style={{ fontSize: '1.4rem', color: '#61dafb' }} />
                    <span>Tuition Code: {tuition.tuitionCode}</span>
                </Card.Header>

                <div style={{ flexGrow: 1, paddingTop: '20px', paddingBottom: '10px' }}>
                    {infoRow(<FaChalkboardTeacher />, 'Wanted Teacher', tuition.wantedTeacher)}
                    {infoRow(<FaUsers />, 'Students', tuition.student)}
                    {infoRow(<FaUniversity />, 'Institute', tuition.institute)}
                    {infoRow(<FaBook />, 'Class', tuition.class)}
                    {infoRow(<FaLanguage />, 'Medium', tuition.medium)}
                    {infoRow(<FaBookOpen />, 'Subject', tuition.subject)}
                    {infoRow(<FaCalendarDay />, 'Day', tuition.day)}
                    {infoRow(<FaClock />, 'Time', tuition.time)}
                    {infoRow(<FaMoneyBill />, 'Salary', tuition.salary && /taka|tk/i.test(tuition.salary.toString()) ? tuition.salary : (tuition.salary ? tuition.salary.toString().trim() + ' taka' : ''))}
                    {infoRow(<FaMapMarkerAlt />, 'Location', `${tuition.location}${tuition.area ? ', ' + tuition.area : ''}`)}
                    {infoRow(<FaCalendarCheck />, 'Joining', tuition.joining)}
                </div>

                <Card.Footer className="text-center bg-white border-0 pb-4 pt-2">
                    <Button
                        variant="primary"
                        className="rounded-pill px-5 py-2 d-inline-flex align-items-center gap-2 fw-bold"
                        style={{
                            background: tuition.isWhatsappApply ? '#25D366' : 'linear-gradient(135deg, #004085 0%, #0066cc 100%)',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
                        }}
                        onClick={() => handleApplyClick(tuition)}
                    >
                        {tuition.isWhatsappApply ? (
                            <>
                                <FaWhatsapp fontSize="1.2rem" /> Apply Now
                            </>
                        ) : (
                            <>
                                <FaGlobe fontSize="1.1rem" /> Apply Now
                            </>
                        )}
                    </Button>
                </Card.Footer>
            </Card>

            {!tuition.isWhatsappApply && (
                <ApplyModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    tuitionCode={tuition.tuitionCode}
                    tuitionId={tuition._id}
                />
            )}
        </>
    );
};

export default TuitionCard;
