import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FaPaperPlane, FaBullhorn, FaLightbulb } from 'react-icons/fa';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import { axiosWithFallback as axios } from '../../services/fetchWithFallback';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import ApplySuccessModal from '../../components/modals/ApplySuccessModal';

const BANGLA_FONT = "'Hind Siliguri', 'Inter', sans-serif";


const ComplaintSuggestionPage = () => {
    const [formData, setFormData] = useState({
        type: 'complain',
        category: 'payment_issue',
        name: '',
        phone: '',
        teacherCode: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.name.trim() || !formData.phone.trim() || !formData.description.trim()) {
            toast.error('অনুগ্রহ করে সবগুলি বাধ্যতামূলক ফিল্ড পূরণ করুন।');
            return;
        }

        setLoading(true);
        try {
            await axios.post('https://tuition-seba-backend-1.onrender.com/api/complaintSuggestion/submit', formData);
            setSubmitted(true);
            toast.success('আপনার আবেদনটি সফলভাবে জমা হয়েছে।');
        } catch (err) {
            console.error('Submission error:', err);
            toast.error(err.response?.data?.message || 'আবেদন জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavBar />
            
            <PageWrapper style={{ fontFamily: BANGLA_FONT }}>
                <Container className="d-flex justify-content-center align-items-center">
                    <CardWrapper className="border-0 shadow-lg p-4 p-md-5 rounded-4">
                        <>
                            <div className="text-center mb-4 pb-3 border-bottom">
                                <h2 className="fw-bold text-primary mb-3">অভিযোগ অথবা পরামর্শ</h2>
                                <div className="p-3 mb-3 bg-light rounded-3 shadow-sm border border-primary border-opacity-10">
                                    <p className="mb-0 text-muted" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                                        সম্মানিত গ্রাহক, টিউশন সেবা ফোরাম-এর প্রতি আপনার অটুট আস্থা ও ভালোবাসার জন্য আমরা আন্তরিকভাবে কৃতজ্ঞ। আমাদের সেবাকে আপনার জন্য আরও নিখুঁত ও আরামদায়ক করে তুলতে আপনার সুচিন্তিত পরামর্শ বা যেকোনো অভিযোগ আমাদের কাছে অমূল্য সম্পদ। অনুগ্রহ করে নির্দ্বিধায় আপনার মতামত আমাদের জানান, আপনার সর্বোচ্চ সন্তুষ্টি নিশ্চিত করতে আমরা সবসময় আপনার পাশে আছি।
                                    </p>
                                </div>
                                <p className="text-muted small mt-2">
                                    নিচের ফর্মে আপনার সঠিক তথ্য এবং বিস্তারিত বিবরণ দিয়ে আবেদনটি সম্পন্ন করুন।
                                </p>
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-4 text-center">
                                    <Col xs={6}>
                                        <TypeCard 
                                            active={formData.type === 'complain'} 
                                            onClick={() => handleInputChange('type', 'complain')}
                                            className="p-3 rounded-3 cursor-pointer"
                                        >
                                            <FaBullhorn size={24} className="mb-2 text-danger" />
                                            <div className="fw-bold">অভিযোগ করুন</div>
                                        </TypeCard>
                                    </Col>
                                    <Col xs={6}>
                                        <TypeCard 
                                            active={formData.type === 'suggestion'} 
                                            onClick={() => handleInputChange('type', 'suggestion')}
                                            className="p-3 rounded-3 cursor-pointer"
                                        >
                                            <FaLightbulb size={24} className="mb-2 text-success" />
                                            <div className="fw-bold">পরামর্শ দিন</div>
                                        </TypeCard>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold text-secondary">
                                        ক্যাটাগরি নির্বাচন করুন <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        className="rounded-3 py-2"
                                    >
                                        <option value="payment_issue">পেমেন্ট সংক্রান্ত সমস্যা</option>
                                        <option value="agent_behavior">এজেন্টের ব্যবহার/আচরণ</option>
                                        <option value="technical_issue">অ্যাপ বা ওয়েবসাইট সংক্রান্ত সমস্যা</option>
                                        <option value="tuition_issue">টিউশন সংক্রান্ত সমস্যা</option>
                                        <option value="other">অন্যান্য</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold text-secondary">
                                        আপনার নাম <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="আপনার নাম লিখুন"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="rounded-3 py-2"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold text-secondary">
                                        মোবাইল নম্বর <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="০১XXXXXXXXX"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="rounded-3 py-2"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold text-secondary">
                                        টিচার কোড (যদি থাকে)
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="যেমন: TS-১২৩৪"
                                        value={formData.teacherCode}
                                        onChange={(e) => handleInputChange('teacherCode', e.target.value)}
                                        className="rounded-3 py-2"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-secondary">
                                        বিস্তারিত বিবরণ <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="আপনার অভিযোগ বা পরামর্শের বিস্তারিত এখানে লিখুন..."
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="rounded-3"
                                        required
                                    />
                                </Form.Group>

                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    className="w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        <>
                                            <FaPaperPlane /> {formData.type === 'complain' ? 'অভিযোগ পাঠান' : 'পরামর্শ পাঠান'}
                                        </>
                                    )}
                                </Button>
                            </Form>
                        </>
                    </CardWrapper>
                </Container>
                <ToastContainer />
                <ApplySuccessModal 
                    show={submitted} 
                    handleClose={() => {
                        setFormData({
                            type: 'complain',
                            category: 'payment_issue',
                            name: '',
                            phone: '',
                            teacherCode: '',
                            description: ''
                        });
                        setSubmitted(false);
                    }}
                    title={formData.type === 'complain' ? 'অভিযোগ সফল!' : 'পরামর্শ সফল!'}
                    message={`আপনার ${formData.type === 'complain' ? 'অভিযোগটি' : 'পরামর্শটি'} সফলভাবে আমাদের কাছে জমা হয়েছে। আমরা দ্রুত এটি পর্যালোচনা করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করব।`}
                />
            </PageWrapper>
        <Footer />
    </>
    );
};

export default ComplaintSuggestionPage;

const PageWrapper = styled.div`
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  min-height: 100vh;
  padding-top: 40px;
  padding-bottom: 60px;

  @media (max-width: 768px) {
    padding-top: 15px;
    padding-bottom: 30px;
  }
`;

const CardWrapper = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  max-width: 580px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  
  .fw-extrabold {
    font-weight: 800;
  }
`;

const TypeCard = styled.div`
  border: 2px solid ${props => props.active ? 'var(--bs-primary)' : '#e5e7eb'};
  background: ${props => props.active ? '#eff6ff' : '#fff'};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;
