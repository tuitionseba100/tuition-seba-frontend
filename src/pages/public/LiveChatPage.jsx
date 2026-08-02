import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { BsChatDotsFill, BsX, BsArrowRightShort, BsTelephone, BsKey, BsSendFill, BsRobot, BsCircleFill } from 'react-icons/bs';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const BANGLA_FONT = "'Hind Siliguri', 'Inter', sans-serif";

const BASE_URL = window.location.origin.includes('localhost')
  ? 'http://localhost:5001'
  : 'https://tuition-seba-backend-1.onrender.com';

let socket;

export default function LiveChatPage() {
  const [phone, setPhone] = useState('');
  const [premiumCode, setPremiumCode] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [agentOnline, setAgentOnline] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Autofill user settings if available on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('@user_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.premiumCode) setPremiumCode(parsed.premiumCode);
      }
    } catch (err) {
      console.error('Error loading saved settings in LiveChatPage:', err);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Connect to Socket.io when user is verified
  useEffect(() => {
    if (!user) return;

    // Connect to Socket.io
    socket = io(BASE_URL);

    socket.emit('join_room', { phone: user.phone, name: user.name, role: 'member' });

    socket.on('receive_message', (msg) => {
      if (msg.phone === user.phone) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on('agent_status', ({ agentOnline }) => {
      setAgentOnline(agentOnline);
    });

    socket.on('display_typing', ({ isTyping, role }) => {
      if (role === 'agent') {
        setAgentTyping(isTyping);
      }
    });

    return () => {
      if (socket) {
        socket.emit('leave_room', { phone: user.phone, role: 'member' });
        socket.disconnect();
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [user]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !premiumCode.trim()) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/regTeacher/check-apply-possible`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, premiumCode })
      });
      const data = await res.json();

      if (data.success) {
        const verifiedUser = {
          name: data.data.data.name || 'Premium Member',
          phone: data.data.phone,
          premiumCode: data.data.premiumCode
        };
        setUser(verifiedUser);
        
        // Load history (Initial load limit = 20)
        const histRes = await fetch(`${BASE_URL}/api/chat/history/${verifiedUser.phone}?limit=20`);
        const histData = await histRes.json();
        
        if (histData.length === 0) {
          setMessages([
            {
              sender: 'bot',
              text: `সম্মানিত **${verifiedUser.name}**, টিউশন সেবা লাইভ চ্যাটে আপনাকে স্বাগতম! 💬\n\nঅনুগ্রহ করে নিচে আপনার প্রশ্ন বা বার্তাটি লিখুন। আমাদের একজন কাস্টমার রিপ্রেজেন্টেティブ দ্রুত এখানে সরাসরি আপনাকে উত্তর দেবেন।`
            }
          ]);
        } else {
          setMessages(histData);
          setHasMore(histData.length === 20);
        }
      } else {
        setError(data.message || 'ভেরিফিকেশন ব্যর্থ হয়েছে। অনুগ্রহ করে সঠিক মোবাইল নম্বর ও প্রিমিয়াম কোড দিন।');
        toast.error(data.message || 'ভেরিফিকেশন ব্যর্থ হয়েছে। অনুগ্রহ করে সঠিক মোবাইল নম্বর ও প্রিমিয়াম কোড দিন।');
      }
    } catch (err) {
      console.error(err);
      setError('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।');
      toast.error('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (messages.length === 0 || !user || loadingMore) return;
    const firstMsgTimestamp = messages[0].createdAt;
    setLoadingMore(true);
    try {
      const res = await fetch(`${BASE_URL}/api/chat/history/${user.phone}?before=${firstMsgTimestamp}&limit=20`);
      const data = await res.json();
      if (data.length > 0) {
        setMessages((prev) => [...data, ...prev]);
        setHasMore(data.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more messages:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!socket || !user) return;

    socket.emit('typing', { phone: user.phone, isTyping: true, role: 'member' });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { phone: user.phone, isTyping: false, role: 'member' });
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim() || !user) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit('typing', { phone: user.phone, isTyping: false, role: 'member' });

    socket.emit('send_message', {
      phone: user.phone,
      premiumCode: user.premiumCode,
      sender: 'member',
      senderName: user.name,
      text: input
    });
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const renderMessageText = (text) => {
    return text.split('\n').map((line, idx) => {
      const parts = line.split('**');
      return (
        <span key={idx}>
          {idx > 0 && <br />}
          {parts.map((part, pIdx) => {
            if (pIdx % 2 === 1) {
              return <strong key={pIdx}>{part}</strong>;
            }
            const subParts = part.split('*');
            return subParts.map((subPart, sIdx) => {
              if (sIdx % 2 === 1) {
                return <em key={sIdx}>{subPart}</em>;
              }
              return subPart;
            });
          })}
        </span>
      );
    });
  };

  return (
    <>
      <NavBar />
      <PageWrapper style={{ fontFamily: BANGLA_FONT }}>
        <Container className="d-flex justify-content-center align-items-center h-100 py-4">
          {!user ? (
            /* Premium Verification Form Card */
            <CardWrapper className="border-0 shadow-lg p-4 p-md-5 rounded-4">
              <div className="text-center mb-4 pb-3 border-bottom">
                <div className="d-inline-flex p-3 bg-primary-subtle rounded-circle mb-3 text-primary">
                  <BsChatDotsFill size={36} />
                </div>
                <h3 className="fw-bold text-primary mb-2">লাইভ চ্যাট সাপোর্ট</h3>
                <p className="text-muted mb-0">আমাদের সাপোর্ট টিমের সাথে সরাসরি লাইভ চ্যাট করতে আপনার তথ্য দিন।</p>
              </div>

              <Form onSubmit={handleVerify}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-secondary">
                    মোবাইল নম্বর <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="position-relative">
                    <BsTelephone className="position-absolute text-muted" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} />
                    <Form.Control
                      type="tel"
                      placeholder="০১XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                      className="rounded-3 py-2.5"
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary">
                    প্রিমিয়াম কোড <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="position-relative">
                    <BsKey className="position-absolute text-muted" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} />
                    <Form.Control
                      type="text"
                      placeholder="যেমন: PREM-১২৩৪"
                      value={premiumCode}
                      onChange={(e) => setPremiumCode(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                      className="rounded-3 py-2.5"
                      required
                    />
                  </div>
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
                    <>ভেরিফাই করুন ও চ্যাট শুরু করুন <BsArrowRightShort size={22} /></>
                  )}
                </Button>
                {error && <div className="text-danger text-center mt-3 small fw-bold">{error}</div>}
              </Form>
            </CardWrapper>
          ) : (
            /* Premium Chat Interface Wrapper */
            <ChatInterfaceWrapper className="border-0 shadow-lg rounded-4 overflow-hidden w-100">
              <Row className="g-0 h-100">
                {/* Left Information Panel */}
                <Col md={4} className="bg-primary text-white p-3 p-md-4 d-flex flex-column justify-content-between border-end border-primary-dark">
                  <div>
                    <div className="text-center mb-2 mb-md-4">
                      <div className="d-inline-flex p-2 p-md-3 bg-white bg-opacity-10 rounded-circle mb-2 mb-md-3">
                        <BsRobot size={32} className="text-white" />
                      </div>
                      <h4 className="fw-bold fs-5 mb-1">{user.name}</h4>
                      <Badge bg="light" text="primary" className="px-3 py-1.5 rounded-pill fw-bold">
                        {user.premiumCode}
                      </Badge>
                    </div>

                    <div className="mt-4 pt-3 border-top border-white border-opacity-10 d-none d-md-block">
                      <h6 className="fw-semibold text-white-50 uppercase mb-3" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>USER DETAILS</h6>
                      <div className="d-flex flex-column gap-2" style={{ fontSize: '0.9rem' }}>
                        <div>মোবাইল: <strong>{user.phone}</strong></div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          স্ট্যাটাস: 
                          <span className="d-inline-flex align-items-center gap-1.5 fw-semibold">
                            <BsCircleFill className={agentOnline ? 'text-success' : 'text-warning'} size={8} />
                            {agentOnline ? 'Agent Active' : 'Bot Active'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-10 p-3 rounded-3 mt-4 d-none d-md-block" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
                    👋 টিউশন সেবা ফোরামে আপনাকে স্বাগতম। আপনি এখন আমাদের লাইভ সাপোর্ট প্যানেলে যুক্ত আছেন। আপনার প্রশ্ন বা সমস্যাটি নিচে লিখে পাঠান, আমাদের কাস্টমার রিপ্রেজেন্টেটিভ দ্রুত উত্তর প্রদান করবেন।
                  </div>
                </Col>

                {/* Right Messages & Feed Window */}
                <Col md={8} className="d-flex flex-column bg-white h-100 ts-chat-main-col">
                  {/* Active Header */}
                  <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light">
                    <div className="d-flex align-items-center gap-2">
                      <div className="p-2 bg-primary-subtle text-primary rounded-circle">
                        <BsChatDotsFill size={18} />
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold text-dark">লাইভ চ্যাট অ্যাসিস্ট্যান্ট</h6>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>Tuition Seba Help Desk</small>
                      </div>
                    </div>
                  </div>

                  {/* Message Logs Feed */}
                  <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3 bg-light bg-opacity-50 ts-msg-feed-box">
                    {hasMore && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        onClick={loadMoreMessages} 
                        className="d-block mx-auto text-decoration-none fw-bold"
                        disabled={loadingMore}
                      >
                        {loadingMore ? 'Loading messages...' : 'Load previous messages'}
                      </Button>
                    )}

                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`d-flex flex-column ${
                          msg.sender === 'member' ? 'align-items-end' : 'align-items-start'
                        }`}
                      >
                        <MessageBubble 
                          className={`px-3 py-2.5 rounded-3 shadow-sm ${
                            msg.sender === 'member'
                              ? 'bg-primary text-white rounded-bottom-end-0'
                              : msg.sender === 'bot'
                              ? 'bg-info-subtle border border-info-subtle text-info-emphasis rounded-bottom-start-0'
                              : 'bg-white text-dark border rounded-bottom-start-0'
                          }`}
                        >
                          {renderMessageText(msg.text)}
                        </MessageBubble>
                        <small className="text-muted mt-1 px-1" style={{ fontSize: '0.65rem' }}>
                          {msg.senderName}
                        </small>
                      </div>
                    ))}

                    {agentTyping && (
                      <div className="d-flex align-items-start flex-column">
                        <div className="bg-white px-3 py-2 rounded-pill shadow-sm d-flex gap-1.5 align-items-center border">
                          <span className="dot-jump"></span>
                          <span className="dot-jump"></span>
                          <span className="dot-jump"></span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Input Bar */}
                  <div className="p-3 border-top bg-white">
                    <Form 
                      onSubmit={(e) => { 
                        e.preventDefault(); 
                        handleSend(); 
                      }} 
                      className="d-flex gap-2"
                    >
                      <Form.Control
                        type="text"
                        placeholder="আপনার বার্তাটি এখানে লিখুন..."
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="rounded-pill px-4"
                        style={{ fontSize: '0.9rem' }}
                      />
                      <Button 
                        type="submit" 
                        variant="primary" 
                        className="rounded-circle d-flex align-items-center justify-content-center" 
                        style={{ width: '42px', height: '42px', flexShrink: 0 }}
                      >
                        <BsSendFill size={16} />
                      </Button>
                    </Form>
                  </div>
                </Col>
              </Row>
            </ChatInterfaceWrapper>
          )}
        </Container>
      </PageWrapper>
      <Footer />
      <ToastContainer />
    </>
  );
}

const PageWrapper = styled.div`
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  padding: 40px 0;

  @media (max-width: 768px) {
    padding: 20px 0;
  }

  /* Custom Sleek Scrollbar */
  .overflow-auto::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .overflow-auto::-webkit-scrollbar-track {
    background: transparent;
  }
  .overflow-auto::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.12);
    border-radius: 3px;
  }
  .overflow-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.25);
  }

  /* Dot animation for typing */
  .dot-jump {
    width: 6px;
    height: 6px;
    background: #adb5bd;
    border-radius: 50%;
    display: inline-block;
    animation: bounce-jump 1.3s infinite ease-in-out;
  }
  .dot-jump:nth-child(2) { animation-delay: 0.15s; }
  .dot-jump:nth-child(3) { animation-delay: 0.3s; }

  @keyframes bounce-jump {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-5px); }
  }
`;

const CardWrapper = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  max-width: 500px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.5);
`;

const ChatInterfaceWrapper = styled(Card)`
  max-width: 960px;
  width: 100%;
  height: 600px;
  background: white;
  border: none;
  
  .ts-chat-main-col {
    min-height: 520px;
  }

  .ts-msg-feed-box {
    height: 360px;
  }
  
  @media (max-width: 768px) {
    height: auto;
    
    .row {
      flex-direction: column;
    }

    .ts-chat-main-col {
      min-height: 380px;
    }

    .ts-msg-feed-box {
      height: 300px;
      padding: 16px !important;
    }
  }
`;

const MessageBubble = styled.div`
  max-width: 75%;
  word-break: break-word;
  font-size: 0.88rem;
  line-height: 1.45;
`;
