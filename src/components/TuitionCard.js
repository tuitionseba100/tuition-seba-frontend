import React, { useState } from 'react';
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
            <div style={{ maxWidth: '400px', margin: '0 auto', background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <div style={{ background: '#007bff', color: 'white', padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaChalkboardTeacher />
                    <span>Tuition Code: {tuition.tuitionCode}</span>
                </div>
                <div style={{ padding: '20px', fontSize: '15px' }}>
                    <p><FaChalkboardTeacher style={{ color: '#007bff' }} /> <strong>Wanted Teacher:</strong> {tuition.wantedTeacher}</p>
                    <p><FaUsers style={{ color: '#007bff' }} /> <strong>Number of Students:</strong> {tuition.student}</p>
                    <p><FaUniversity style={{ color: '#007bff' }} /> <strong>Institute:</strong> {tuition.institute || ''}</p>
                    <p><FaBook style={{ color: '#007bff' }} /> <strong>Class:</strong> {tuition.class}</p>
                    <p><FaLanguage style={{ color: '#007bff' }} /> <strong>Medium:</strong> {tuition.medium}</p>
                    <p><FaBookOpen style={{ color: '#007bff' }} /> <strong>Subject:</strong> {tuition.subject}</p>
                    <p><FaCalendarDay style={{ color: '#007bff' }} /> <strong>Day:</strong> {tuition.day}</p>
                    <p><FaClock style={{ color: '#007bff' }} /> <strong>Time:</strong> {tuition.time}</p>
                    <p><FaMoneyBill style={{ color: '#007bff' }} /> <strong>Salary:</strong> {tuition.salary} Taka</p>
                    <p><FaMapMarkerAlt style={{ color: '#007bff' }} /> <strong>Location:</strong> {tuition.location}{tuition.area ? ', ' + tuition.area : ''}</p>
                    <p><FaCalendarCheck style={{ color: '#007bff' }} /> <strong>Joining:</strong> {tuition.joining}</p>
                </div>
                <div style={{ textAlign: 'center', padding: '10px' }}>
                    <button
                        onClick={() => handleApplyClick(tuition)}
                        style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '25px',
                            cursor: 'pointer'
                        }}>
                        📩 Apply Now
                    </button>
                </div>
            </div>

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
