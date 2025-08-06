import React, { useState } from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import {
    FaChalkboardTeacher, FaUsers, FaUniversity, FaBook,
    FaLanguage, FaBookOpen, FaCalendarDay, FaClock,
    FaMoneyBill, FaMapMarkerAlt, FaCalendarCheck, FaWhatsapp, FaGlobe
} from 'react-icons/fa';
import ApplyModal from '../components/modals/ApplyModal';

const TuitionCard = ({ tuition }) => {
    const [showModal, setShowModal] = useState(false);

    const handleApplyClick = () => {
        if (tuition.isWhatsappApply) {
            redirectToWhatsApp(tuition);
        } else {
            setShowModal(true);
        }
    };

    const redirectToWhatsApp = (tuitionDetails) => {
        const phoneNumber = '+8801540376020';
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
Salary: ${tuitionDetails.salary}
Location: ${tuitionDetails.location}${area}
Joining: ${tuitionDetails.joining}

এই টিউশনটা (${tuitionDetails.tuitionCode}) কি এখনো আছে?`.trim();

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const infoRow = (icon, label, value) => (
        <ListGroup.Item
            className="d-flex justify-content-between align-items-center"
            style={{
                padding: '10px 16px',
                fontSize: '1rem',
                border: 'none',
                borderBottom: '1px solid #e9ecef',
                background: '#fff'
            }}
        >
            <div className="d-flex align-items-center text-primary fw-semibold">
                <span className="me-2">{icon}</span>
                {label}
            </div>
            <div className="text-black fw-bold text-end" style={{ maxWidth: '55%' }}>
                {value || '-'}
            </div>
        </ListGroup.Item>
    );

    return (
        <>
            <Card
                className="mx-auto mb-2 shadow-sm"
                style={{
                    maxWidth: '460px',
                    borderRadius: '0px',
                    border: '1px solid #dee2e6',
                    overflow: 'hidden',
                    background: '#fff',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Card.Header
                    className="bg-primary text-white d-flex justify-content-center align-items-center gap-2"
                    style={{
                        fontSize: '1.4rem',
                        fontWeight: '700',
                        padding: '10px 8px',
                        letterSpacing: '0.05em',
                        textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                        borderBottom: '3px solid #0d6efd',
                    }}
                >
                    <FaChalkboardTeacher style={{ fontSize: '1.6rem' }} />
                    <span>Tuition Code: {tuition.tuitionCode}</span>
                </Card.Header>

                <ListGroup variant="flush" style={{ flexGrow: 1 }}>
                    {infoRow(<FaChalkboardTeacher />, 'Wanted Teacher', tuition.wantedTeacher)}
                    {infoRow(<FaUsers />, 'Students', tuition.student)}
                    {infoRow(<FaUniversity />, 'Institute', tuition.institute)}
                    {infoRow(<FaBook />, 'Class', tuition.class)}
                    {infoRow(<FaLanguage />, 'Medium', tuition.medium)}
                    {infoRow(<FaBookOpen />, 'Subject', tuition.subject)}
                    {infoRow(<FaCalendarDay />, 'Day', tuition.day)}
                    {infoRow(<FaClock />, 'Time', tuition.time)}
                    {infoRow(<FaMoneyBill />, 'Salary', `${tuition.salary} Taka`)}
                    {infoRow(<FaMapMarkerAlt />, 'Location', `${tuition.location}${tuition.area ? ', ' + tuition.area : ''}`)}
                    {infoRow(<FaCalendarCheck />, 'Joining', tuition.joining)}
                </ListGroup>

                <Card.Footer className="text-center" style={{ marginTop: 'auto' }}>
                    <Button
                        variant="primary"
                        className="rounded-pill px-4 d-inline-flex align-items-center gap-2"
                        onClick={() => handleApplyClick(tuition)}
                    >
                        {tuition.isWhatsappApply ? (
                            <>
                                <FaWhatsapp /> Apply Now
                            </>
                        ) : (
                            <>
                                <FaGlobe /> Apply Now
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
