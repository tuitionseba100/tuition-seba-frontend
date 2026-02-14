import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { BsInfoCircle, BsXCircle } from 'react-icons/bs';
import { FaCheckCircle, FaUserEdit } from 'react-icons/fa';

const TeacherBenefitInfoModal = ({ show, handleClose }) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            scrollable
            centered
            className="premium-modal"
        >
            <Modal.Header
                closeButton
                style={{
                    background: 'linear-gradient(135deg, #004085 0%, #0066cc 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.5rem 2rem'
                }}
            >
                <Modal.Title className="d-flex align-items-center">
                    <div className="bg-white rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <BsInfoCircle style={{ color: '#004085', fontSize: '20px' }} />
                    </div>
                    <span className="fw-bold">রেজিস্টার্ড শিক্ষক হওয়ার সুবিধা ও শর্তাবলী</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: '#fcfdfe', padding: '2rem' }}>
                <div className="mb-4">
                    <h5 className="fw-bold text-primary mb-3">আসসালামু আলাইকুম</h5>
                    <p className="text-muted" style={{ lineHeight: '1.7' }}>
                        আমাদের ভেরিফাইড টিচার প্রজেক্টে আপনাকে স্বাগতম। টিউশন সেবা ফোরাম দীর্ঘসময় ধরে সততা ও বিশ্বস্ততার সঙ্গে সেবা প্রদান করে আসছে।
                        ভেরিফাইড টিচার বলতে আমরা বুঝাচ্ছি একজন শিক্ষক যার যাবতীয় ডকুমেন্টস যাচাইকৃত, যা অভিভাবক ও শিক্ষক উভয়ের জন্যই নিরাপদ।
                    </p>
                </div>

                <div className="benefit-section mb-4">
                    <div className="d-flex align-items-center mb-3">
                        <div style={{ width: '4px', height: '24px', backgroundColor: '#ffd700', marginRight: '10px', borderRadius: '2px' }}></div>
                        <h6 className="fw-bold mb-0" style={{ color: '#004085' }}>ভেরিফাইড টিচার হলে কি কি সুবিধা পাবেন?</h6>
                    </div>
                    <div className="row g-3">
                        {[
                            "টিউশন কনফার্ম হওয়ার আগে কোনো টাকা দেয়ার ঝামেলা নেই।",
                            "মিডিয়া ফি কনফার্ম এর পর ৩০% এবং বাকি ৩০% প্রথম বেতন পাওয়ার পর।",
                            "বাসার কাছাকাছি টিউশন আসলে সরাসরি মোবাইলে মেসেজ এলার্ট।",
                            "বিশেষ পরিস্থিতিতে সর্বোচ্চ সহযোগিতা ও অগ্রাধিকার।"
                        ].map((benefit, i) => (
                            <div key={i} className="col-md-6">
                                <div className="p-3 rounded-3" style={{ background: '#f0f7ff', border: '1px solid #e1effe', height: '100%' }}>
                                    <div className="d-flex align-items-start">
                                        <FaCheckCircle className="text-success mt-1 me-2" flex-shrink-0 />
                                        <span style={{ fontSize: '0.9rem', color: '#444' }}>{benefit}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="process-section mb-4 p-4 rounded-4" style={{ background: 'linear-gradient(135deg, #004085 0%, #0066cc 100%)', color: 'white' }}>
                    <h6 className="fw-bold mb-3 d-flex align-items-center">
                        <FaUserEdit className="me-2" /> কিভাবে ভেরিফাইড টিচার হবেন?
                    </h6>
                    <div className="mb-3" style={{ fontSize: '0.9rem', opacity: '0.9' }}>
                        ১. ওয়েবসাইটে রেজিষ্ট্রেশন করে নির্ভুল তথ্য প্রদান করুন।<br />
                        ২. WhatsApp-এ আইডি কার্ড/ভর্তি রসিদ ও NID-র ছবি প্রদান করুন।<br />
                        ৩. ভেরিফাইড টিচার ফি <strong>৩০০ টাকা</strong> (অফেরতযোগ্য) প্রদান করুন।
                    </div>
                    <div className="bg-white bg-opacity-10 p-3 rounded-3" style={{ fontSize: '0.85rem' }}>
                        <div className="mb-1"><strong>পেমেন্ট মাধ্যম সমূহ:</strong></div>
                        <div className="d-flex flex-wrap gap-2">
                            <span>বিকাশ পার্সোনালঃ 01633-920928</span> |
                            <span>বিকাশ মার্চেন্টঃ 01714-045039</span> |
                            <span>নগদঃ 01633-920928</span>
                        </div>
                    </div>
                </div>

                <div className="terms-section">
                    <div className="d-flex align-items-center mb-3">
                        <div style={{ width: '4px', height: '24px', backgroundColor: '#dc3545', marginRight: '10px', borderRadius: '2px' }}></div>
                        <h6 className="fw-bold mb-0" style={{ color: '#004085' }}>গুরুত্বপূর্ণ শর্তাবলী</h6>
                    </div>
                    <ul className="list-unstyled">
                        {[
                            "টিউশন কনফার্ম হওয়ার পর ১ সপ্তাহের মধ্যে ৩০% মিডিয়া ফি প্রদান করতে হবে।",
                            "বেতন পাওয়ার ১ দিনের মধ্যে বকেয়া ৩০% মিডিয়া ফি পরিশোধ করতে হবে।",
                            "বৈধ কারণ ছাড়া নিজ ইচ্ছেমতো টিউশন বাতিল করা যাবে না।",
                            "যোগাযোগের ক্ষেত্রে অন্তত ১ দিনের মধ্যে রেসপন্স করতে হবে।"
                        ].map((term, i) => (
                            <li key={i} className="mb-2 d-flex align-items-start" style={{ fontSize: '0.9rem', color: '#555' }}>
                                <div className="me-2 mt-1" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#666', flexShrink: 0 }}></div>
                                {term}
                            </li>
                        ))}
                    </ul>
                    <div className="alert alert-danger border-0 mt-3" style={{ borderRadius: '10px', fontSize: '0.85rem' }}>
                        <strong>সতর্কবার্তা:</strong> পাওনা টাকা না দিয়ে যোগাযোগ বন্ধ করলে আইনগত ব্যবস্থা নেয়া হবে এবং এর জন্য সৃষ্ট মানহানির দায়ভার টিউশন সেবা ফোরাম গ্রহণ করবে না।
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer style={{ border: 'none', padding: '1.5rem', backgroundColor: '#fcfdfe' }}>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                    style={{ borderRadius: '10px', padding: '8px 25px', fontWeight: '600' }}
                >
                    <BsXCircle className="me-2" /> বন্ধ করুন
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TeacherBenefitInfoModal;
