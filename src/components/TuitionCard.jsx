import React, { useState } from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import {
    FaChalkboardTeacher, FaUsers, FaUniversity, FaBook,
    FaLanguage, FaBookOpen, FaCalendarDay, FaClock,
    FaMoneyBill, FaMapMarkerAlt, FaCalendarCheck
} from 'react-icons/fa';
import ApplyModal from '../components/modals/ApplyModal';

const TuitionCard = ({ tuition }) => {
    const [showModal, setShowModal] = useState(false);

    const handleApplyClick = (tuition) => {
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

    return (
        <>
            <Card className="mx-auto my-3 shadow-sm" style={{ maxWidth: '400px' }}>
                <Card.Header className="bg-primary text-white d-flex align-items-center gap-2">
                    <FaChalkboardTeacher />
                    <span>Tuition Code: {tuition.tuitionCode}</span>
                </Card.Header>

                <ListGroup variant="flush" className="p-3" style={{ fontSize: '0.9rem' }}>
                    <ListGroup.Item>
                        <FaChalkboardTeacher className="text-primary me-2" />
                        <strong>Wanted Teacher:</strong> {tuition.wantedTeacher}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FaUsers className="text-primary me-2" />
                        <strong>Number of Students:</strong> {tuition.student}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FaUniversity className="text-primary me-2" />
                        <strong>Institute:</strong> {tuition.institute || '-'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FaBook className="text-primary me-2" />
                        <strong>Class:</strong> {tuition.class}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FaLanguage className="text-primary me-2" />
                        <strong>Medium:</strong> {tuition.medium}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FaBookOpen className="text-primary me-2" />
                        <strong>Subject:</strong> {tuition.subject}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FaCalendarDay className="text-primary me-2" />
                        <strong>Day:</strong> {tuition.day}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FaClock className="text-primary me-2" />
                        <strong>Time:</strong> {tuition.time}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FaMoneyBill className="text-primary me-2" />
                        <strong>Salary:</strong> {tuition.salary} Taka
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FaMapMarkerAlt className="text-primary me-2" />
                        <strong>Location:</strong> {tuition.location}{tuition.area ? `, ${tuition.area}` : ''}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FaCalendarCheck className="text-primary me-2" />
                        <strong>Joining:</strong> {tuition.joining}
                    </ListGroup.Item>
                </ListGroup>

                <Card.Footer className="text-center">
                    <Button
                        variant="primary"
                        className="rounded-pill px-4"
                        onClick={() => handleApplyClick(tuition)}
                    >
                        📩 Apply Now
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
