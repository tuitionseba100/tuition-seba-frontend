import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import { FaGift, FaUserCheck, FaBriefcase, FaEnvelopeOpenText } from 'react-icons/fa';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

export default function ReferPage() {
    const [activeTab, setActiveTab] = useState('teacher');

    return (
        <>
            <NavBar />
            <div style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                minHeight: '80vh',
                padding: '40px 0'
            }}>
                <Container>
                    {/* Header Announcement Section */}
                    <div style={{
                        background: 'linear-gradient(135deg, #004085 0%, #0066cc 100%)',
                        color: 'white',
                        borderRadius: '20px',
                        padding: '24px 30px',
                        marginBottom: '30px',
                        boxShadow: '0 15px 35px rgba(0, 64, 133, 0.15)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-30px',
                            right: '-30px',
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.05)'
                        }}></div>
                        <Row className="align-items-center">
                            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
                                <h1 style={{ fontWeight: '850', fontSize: '1.8rem', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', justifySelf: 'start', gap: '10px' }}>
                                    🎁 TSF রেফারেল প্রোগ্রাম
                                </h1>
                                <p style={{ fontSize: '0.92rem', opacity: 0.9, margin: 0, lineHeight: '1.5' }}>
                                    আপনার পরিচিত শিক্ষক বা টিউশন রেফার করে সহজে নিশ্চিত বোনাস ও আকর্ষণীয় কমিশন উপার্জন করুন!
                                </p>
                            </Col>
                            <Col md={6}>
                                <Row className="g-2 justify-content-center">
                                    <Col xs={6}>
                                        <div style={{
                                            background: 'rgba(255, 255, 255, 0.12)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: '12px',
                                            padding: '10px 12px',
                                            textAlign: 'center',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                                        }}>
                                            <div style={{ fontSize: '0.72rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#81c784', letterSpacing: '0.5px' }}>👨‍🏫 শিক্ষক রেফারে</div>
                                            <div style={{ fontSize: '1.15rem', fontWeight: '850', color: '#fff', margin: '2px 0' }}>৫০ টাকা বোনাস</div>
                                            <div style={{ fontSize: '0.65rem', opacity: 0.85, fontWeight: '600' }}>(আনলিমিটেড রেফার)</div>
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <div style={{
                                            background: 'rgba(255, 255, 255, 0.12)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: '12px',
                                            padding: '10px 12px',
                                            textAlign: 'center',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                                        }}>
                                            <div style={{ fontSize: '0.72rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#64b5f6', letterSpacing: '0.5px' }}>💼 টিউশন রেফারে</div>
                                            <div style={{ fontSize: '1.15rem', fontWeight: '850', color: '#fff', margin: '2px 0' }}>১৫% কমিশন</div>
                                            <div style={{ fontSize: '0.65rem', opacity: 0.85, fontWeight: '600' }}>(১ম মাসের বেতনের)</div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>

                    <Row className="justify-content-center">
                        <Col lg={10}>
                            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                                    {/* Tabs Styling */}
                                    <div style={{
                                        background: '#fff',
                                        borderBottom: '2px solid rgba(0, 0, 0, 0.05)',
                                        padding: '10px 20px 0'
                                    }}>
                                        <Nav variant="tabs" className="border-0 d-flex justify-content-center flex-wrap">
                                            <Nav.Item>
                                                <Nav.Link 
                                                    eventKey="teacher"
                                                    style={{
                                                        border: 'none',
                                                        borderBottom: activeTab === 'teacher' ? '4px solid #2E7D32' : '4px solid transparent',
                                                        color: activeTab === 'teacher' ? '#2E7D32' : '#6c757d',
                                                        fontWeight: '750',
                                                        fontSize: '0.98rem',
                                                        padding: '12px 18px',
                                                        transition: 'all 0.2s',
                                                        background: 'transparent',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    👨‍🏫 শিক্ষক রেফার সম্পর্কে জানতে এখানে ক্লিক করুন
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link 
                                                    eventKey="tuition"
                                                    style={{
                                                        border: 'none',
                                                        borderBottom: activeTab === 'tuition' ? '4px solid #1565C0' : '4px solid transparent',
                                                        color: activeTab === 'tuition' ? '#1565C0' : '#6c757d',
                                                        fontWeight: '750',
                                                        fontSize: '0.98rem',
                                                        padding: '12px 18px',
                                                        transition: 'all 0.2s',
                                                        background: 'transparent',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    💼 টিউশন রেফার সম্পর্কে জানতে এখানে ক্লিক করুন
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </div>

                                    <Card.Body style={{ padding: '40px 30px', background: '#ffffff' }}>
                                        <Tab.Content>
                                            {/* Teacher Referral Tab */}
                                            <Tab.Pane eventKey="teacher">
                                                <div>
                                                    <p style={{ fontSize: '1.05rem', color: '#2e4a32', marginBottom: '30px', lineHeight: '1.8', fontWeight: '500' }}>
                                                        বিশ্বস্ত শিক্ষক কমিউনিটি আরও বড় করতে এখন থেকে আপনি আপনার পরিচিত শিক্ষককে রেফার করে বোনাস উপার্জন করতে পারবেন।
                                                    </p>

                                                    <div style={{ marginBottom: '30px' }}>
                                                        <h4 style={{ fontWeight: '750', color: '#1b5e20', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <FaUserCheck /> কীভাবে কাজ করবে?
                                                        </h4>
                                                        <div style={{ background: '#f8faf8', border: '1px solid rgba(76, 175, 80, 0.12)', borderRadius: '16px', padding: '22px 25px' }}>
                                                            <p style={{ fontWeight: '700', marginBottom: '12px', fontSize: '1rem' }}>আপনার Phone Number ব্যবহার করে কোনো নতুন শিক্ষক রেজিস্ট্রেশন করলে:</p>
                                                            <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: '0 0 15px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                {['সফলভাবে রেজিস্ট্রেশন সম্পন্ন করলে', 'প্রয়োজনীয় তথ্য ও ডকুমেন্ট সাবমিট করলে', 'প্রোফাইল ভেরিফিকেশন সম্পন্ন হলে'].map((t, i) => (
                                                                    <li key={i} style={{ fontSize: '0.95rem', color: '#2e4a32', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                        <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>✓</span><span>{t}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            <p style={{ fontWeight: '700', margin: 0, fontSize: '1rem', color: '#1b5e20' }}>তাহলে সেটি একটি Valid Referral হিসেবে গণ্য হবে।</p>
                                                        </div>
                                                    </div>

                                                    <div style={{ background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(46, 125, 50, 0.03) 100%)', border: '1px solid rgba(76, 175, 80, 0.15)', borderRadius: '16px', padding: '22px 30px', marginBottom: '30px', textAlign: 'center' }}>
                                                        <h5 style={{ fontWeight: '800', color: '#1b5e20', marginBottom: '8px' }}>💰 Referral Bonus:</h5>
                                                        <p style={{ fontSize: '1.2rem', color: '#2E7D32', fontWeight: '800', margin: 0 }}>প্রতিটি সফল ও ভেরিফাইড শিক্ষক রেফারেলের জন্য আপনি পাবেন ৫০ টাকা বোনাস।</p>
                                                    </div>

                                                    <div style={{ marginBottom: '30px' }}>
                                                        <h4 style={{ fontWeight: '750', color: '#e65100', marginBottom: '15px' }}>📌 গুরুত্বপূর্ণ শর্তাবলী:</h4>
                                                        <div style={{ background: 'rgba(230, 81, 0, 0.04)', border: '1px solid rgba(230, 81, 0, 0.12)', borderRadius: '16px', padding: '22px 25px' }}>
                                                            <ul style={{ margin: 0, paddingLeft: 0, color: '#4e342e', fontSize: '0.92rem', lineHeight: '2.2', listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                                {[
                                                                    '১. শুধুমাত্র টিউশন সেবা ফোরাম-এর নিবন্ধিত শিক্ষকরা রেফার করতে পারবেন।',
                                                                    '২. ভুয়া, ডুপ্লিকেট বা অসম্পূর্ণ অ্যাকাউন্টের ক্ষেত্রে কোনো বোনাস প্রদান করা হবে না।',
                                                                    '৩. একই ব্যক্তি একাধিক অ্যাকাউন্ট খুললে referral বাতিল বলে গণ্য হবে।',
                                                                    '৪. Referral bonus নির্দিষ্ট সময় পর পর বিকাশ/নগদ বা মোবাইল রিচার্জে প্রদান করা হবে।',
                                                                    '৫. একজন শিক্ষক যত খুশি সংখ্যক referral করতে পারবেন।',
                                                                    '৬. টিউশন সেবা ফোরাম যেকোনো সময় এই প্রোগ্রামের নিয়মাবলী পরিবর্তন বা বাতিল করার অধিকার রাখে।'
                                                                ].map((t, i) => (<li key={i}>{t}</li>))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div style={{ marginBottom: '30px' }}>
                                                        <h4 style={{ fontWeight: '750', color: '#2e7d32', marginBottom: '15px' }}>🚀 কীভাবে Referral করবেন?</h4>
                                                        <div style={{ background: 'rgba(76,175,80,0.02)', border: '1px solid rgba(76,175,80,0.1)', borderRadius: '16px', padding: '22px 25px' }}>
                                                            <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                {[
                                                                    'আপনার পরিচিতদের টিউশন সেবা ফোরাম সম্পর্কে জানান',
                                                                    'আগ্রহী হলে তাদের ওয়েবসাইটে বায়োডাটা সম্পূর্ণ করতে বলুন',
                                                                    'Registration Form-এর "Refer" অপশনে আপনার Phone number ব্যবহার করতে বলুন'
                                                                ].map((t, i) => (
                                                                    <li key={i} style={{ fontSize: '0.95rem', color: '#2e4a32', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                        <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>•</span><span>{t}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid rgba(76, 175, 80, 0.1)' }}>
                                                        <h5 style={{ color: '#2e7d32', fontWeight: '750', fontSize: '1.1rem' }}>আজই আপনার শিক্ষক নেটওয়ার্ককে যুক্ত করুন টিউশন সেবা ফোরাম-এর সাথে।</h5>
                                                        <p style={{ fontSize: '0.95rem', color: '#2e4a32', fontWeight: '500', marginTop: '6px', margin: 0 }}>একসাথে গড়ে তুলি একটি বিশ্বস্ত ও স্মার্ট শিক্ষক কমিউনিটি।</p>
                                                    </div>
                                                </div>
                                            </Tab.Pane>

                                            {/* Tuition Referral Tab */}
                                            <Tab.Pane eventKey="tuition">
                                                <div>
                                                    <div style={{ background: 'linear-gradient(135deg, rgba(21, 101, 192, 0.06) 0%, rgba(21, 101, 192, 0.01) 100%)', border: '1px solid rgba(21, 101, 192, 0.12)', borderRadius: '16px', padding: '22px 25px', marginBottom: '30px' }}>
                                                        <p style={{ fontSize: '1rem', color: '#1a237e', fontWeight: '500', lineHeight: '1.8', margin: 0 }}>
                                                            আপনার পরিচিত কোনো অভিভাবক, শিক্ষার্থী বা প্রতিষ্ঠানের জন্য গৃহশিক্ষক প্রয়োজন?<br /><br />
                                                            এখন থেকে আপনার রেফারেন্সে কেউ যদি <strong>টিউশন সেবা ফোরাম</strong>-এর মাধ্যমে সফলভাবে শিক্ষক কনফার্ম করেন, তাহলে আপনাকে প্রদান করা হবে বিশেষ <strong>Referral Commission</strong>।
                                                        </p>
                                                    </div>

                                                    <div style={{ background: 'linear-gradient(135deg, rgba(21, 101, 192, 0.08) 0%, rgba(21, 101, 192, 0.02) 100%)', border: '1px solid rgba(21, 101, 192, 0.15)', borderRadius: '16px', padding: '22px 30px', marginBottom: '30px', textAlign: 'center' }}>
                                                        <h5 style={{ fontWeight: '800', color: '#1565C0', marginBottom: '8px' }}>💰 Referral Commission:</h5>
                                                        <p style={{ fontSize: '1.15rem', color: '#0d47a1', fontWeight: '800', margin: 0 }}>
                                                            সফলভাবে টিউশন কনফার্ম হলে শিক্ষকের প্রথম মাসের নির্ধারিত বেতনের <span style={{ fontSize: '1.3rem', color: '#1565C0' }}>১৫% পর্যন্ত</span> Referral Bonus প্রদান করা হবে।
                                                        </p>
                                                    </div>

                                                    <div style={{ marginBottom: '30px' }}>
                                                        <h4 style={{ fontWeight: '750', color: '#1565C0', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <FaBriefcase /> কীভাবে এটি কাজ করবে?
                                                        </h4>
                                                        <div style={{ background: 'rgba(21, 101, 192, 0.03)', border: '1px solid rgba(21, 101, 192, 0.1)', borderRadius: '16px', padding: '22px 25px' }}>
                                                            <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                {[
                                                                    'আপনি অভিভাবক বা শিক্ষার্থীর তথ্য আমাদের কাছে শেয়ার করবেন',
                                                                    'আমাদের টিম উপযুক্ত শিক্ষক ম্যানেজ করবে',
                                                                    'শিক্ষক সফলভাবে কনফার্ম ও ক্লাস শুরু করলে আপনার referral valid হিসেবে গণ্য হবে'
                                                                ].map((t, i) => (
                                                                    <li key={i} style={{ fontSize: '0.95rem', color: '#1a237e', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                        <span style={{ color: '#1565C0', fontWeight: 'bold' }}>✓</span><span>{t}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div style={{ marginBottom: '30px' }}>
                                                        <h4 style={{ fontWeight: '750', color: '#e65100', marginBottom: '15px' }}>📋 গুরুত্বপূর্ণ শর্তাবলী:</h4>
                                                        <div style={{ background: 'rgba(230, 81, 0, 0.04)', border: '1px solid rgba(230, 81, 0, 0.12)', borderRadius: '16px', padding: '22px 25px' }}>
                                                            <ul style={{ margin: 0, paddingLeft: 0, color: '#4e342e', fontSize: '0.92rem', lineHeight: '2.2', listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                                {[
                                                                    '১. যেকোনো ব্যক্তি Referral Partner হিসেবে যুক্ত হতে পারবেন।',
                                                                    '২. Referral claim করার জন্য অভিভাবকের তথ্য দেওয়ার সময় অবশ্যই আপনার নাম ও মোবাইল নম্বর উল্লেখ করতে হবে।',
                                                                    '৩. শুধুমাত্র সফলভাবে কনফার্ম হওয়া টিউশনের ক্ষেত্রেই Referral Commission প্রযোজ্য হবে।',
                                                                    '৪. শিক্ষক ক্লাস শুরু করার পর এবং প্রথম মাসের ফি সম্পন্ন হওয়ার পর কমিশন প্রদান করা হবে।',
                                                                    '৫. ভুয়া, অসম্পূর্ণ বা duplicate তথ্যের ক্ষেত্রে referral বাতিল বলে গণ্য হবে।',
                                                                    '৬. Tuition cancellation, payment dispute বা early discontinuation-এর ক্ষেত্রে কমিশন সমন্বয় করার অধিকার টিউশন সেবা ফোরাম সংরক্ষণ করে।',
                                                                    '৭. একজন Referral Partner যত খুশি সংখ্যক referral করতে পারবেন।'
                                                                ].map((t, i) => (<li key={i}>{t}</li>))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div style={{ marginBottom: '30px' }}>
                                                        <h4 style={{ fontWeight: '750', color: '#1565C0', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <FaEnvelopeOpenText /> কীভাবে শুরু করবেন?
                                                        </h4>
                                                        <div style={{ background: 'rgba(21, 101, 192, 0.03)', border: '1px solid rgba(21, 101, 192, 0.1)', borderRadius: '16px', padding: '22px 25px' }}>
                                                            <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                {[
                                                                    'অভিভাবকের প্রয়োজনীয় তথ্য সংগ্রহ করুন',
                                                                    'Website-এ Find Tutor option ব্যবহার করুন / আমাদের অফিসিয়াল নম্বরে তথ্য পাঠান: 01633920928 / 01891644064',
                                                                    'Referral হিসেবে নিজের নাম ও মোবাইল নম্বর উল্লেখ করুন',
                                                                    'Tuition successfully continue হলে কমিশন গ্রহণ করুন'
                                                                ].map((t, i) => (
                                                                    <li key={i} style={{ fontSize: '0.95rem', color: '#1a237e', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                        <span style={{ color: '#1565C0', fontWeight: 'bold' }}>•</span><span>{t}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid rgba(21, 101, 192, 0.1)' }}>
                                                        <h5 style={{ color: '#1565C0', fontWeight: '750', fontSize: '1.1rem', margin: 0 }}>আসুন একসাথে গড়ে তুলি একটি বিশ্বস্ত ও স্মার্ট টিউশন নেটওয়ার্ক।</h5>
                                                    </div>
                                                </div>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Card.Body>
                                </Tab.Container>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </>
    );
}
