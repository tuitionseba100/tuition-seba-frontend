import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { BsChatDotsFill, BsX, BsArrowRightShort, BsTelephone, BsKey, BsSendFill, BsRobot, BsCircleFill, BsArrowDownShort, BsLightbulb, BsFileEarmarkPerson, BsBoxArrowUpRight } from 'react-icons/bs';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { fetchWithFallback } from '../../services/fetchWithFallback';

const BANGLA_FONT = "'Hind Siliguri', 'Inter', sans-serif";

const BASE_URL = 'https://tuition-seba-backend-a0pb.onrender.com';



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
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const socketRef = useRef(null);
  const teacherDataRef = useRef(null);

  const feedRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight > 150) {
      setShowScrollBottom(true);
    } else {
      setShowScrollBottom(false);
    }
  };

  const scrollToBottom = () => {
    if (feedRef.current) {
      feedRef.current.scrollTo({
        top: feedRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

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
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (user) {
      setShowTooltip(true);
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowTooltip(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Connect to Socket.io
    socketRef.current = io(BASE_URL);

    socketRef.current.emit('join_room', { phone: user.phone, name: user.name, role: 'member' });

    socketRef.current.on('receive_message', (msg) => {
      if (msg.phone === user.phone) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socketRef.current.on('agent_status', ({ agentOnline }) => {
      setAgentOnline(agentOnline);
    });

    socketRef.current.on('display_typing', ({ isTyping, role }) => {
      if (role === 'agent') {
        setAgentTyping(isTyping);
      }
    });

    socketRef.current.on('message_unsent', ({ messageId, phone: msgPhone }) => {
      if (msgPhone === user.phone) {
        setMessages(prev => prev.map(msg =>
          msg._id === messageId ? { ...msg, isUnsent: true } : msg
        ));
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_room', { phone: user.phone, role: 'member' });
        socketRef.current.disconnect();
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
      const res = await fetchWithFallback(`${BASE_URL}/api/regTeacher/check-apply-possible`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, premiumCode })
      });
      const data = await res.json();

      if (data.success) {
        const teacherFullData = data.data.data;
        teacherDataRef.current = teacherFullData;
        const verifiedUser = {
          name: teacherFullData.name || 'Premium Member',
          phone: data.data.phone,
          premiumCode: data.data.premiumCode
        };

        // Save user settings to localStorage so they don't lose session
        const settingsData = {
          userName: verifiedUser.name,
          phone: verifiedUser.phone,
          premiumCode: verifiedUser.premiumCode,
          areas: teacherFullData.currentArea ? [teacherFullData.currentArea] : []
        };
        localStorage.setItem('@user_settings', JSON.stringify(settingsData));
        window.dispatchEvent(new Event('userSettingsUpdated'));

        setUser(verifiedUser);

        // Load history (Initial load limit = 20)
        const histRes = await fetchWithFallback(`${BASE_URL}/api/chat/history/${verifiedUser.phone}?limit=20`);
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
      const res = await fetchWithFallback(`${BASE_URL}/api/chat/history/${user.phone}?before=${firstMsgTimestamp}&limit=20`);
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
    if (!socketRef.current || !user) return;

    socketRef.current.emit('typing', { phone: user.phone, isTyping: true, role: 'member' });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('typing', { phone: user.phone, isTyping: false, role: 'member' });
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim() || !user) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (socketRef.current) {
      socketRef.current.emit('typing', { phone: user.phone, isTyping: false, role: 'member' });

      socketRef.current.emit('send_message', {
        phone: user.phone,
        premiumCode: user.premiumCode,
        sender: 'member',
        senderName: user.name,
        text: input
      });
    }
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const formatDateTime = (dateStr) => {
    const d = dateStr ? new Date(dateStr) : new Date();
    const currentYear = new Date().getFullYear();
    const messageYear = d.getFullYear();
    return d.toLocaleString([], {
      ...(messageYear !== currentYear && { year: 'numeric' }),
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderTextWithLinksAndCopies = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (urlRegex.test(part)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', fontWeight: 600 }}>
            {part}
          </a>
        );
      }

      const numRegex = /(01[3-9]\d{2}-?\d{6})/g;
      if (numRegex.test(part)) {
        const subParts = part.split(numRegex);
        return subParts.map((subPart, idx) => {
          if (numRegex.test(subPart)) {
            const cleanNum = subPart.replace('-', '');
            return (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(cleanNum);
                  const btn = e.currentTarget;
                  const originalHtml = btn.innerHTML;
                  btn.innerHTML = 'Copied! ✅';
                  btn.style.backgroundColor = '#d1fae5';
                  btn.style.color = '#065f46';
                  setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.style.backgroundColor = '#f1f5f9';
                    btn.style.color = '#0f172a';
                  }, 1200);
                }}
                title="Click to copy number"
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '1px 6px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  color: '#0f172a',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  userSelect: 'all',
                  fontSize: '0.9em',
                  margin: '0 2px',
                  transition: 'all 0.15s ease'
                }}
              >
                {subPart} 📋
              </span>
            );
          }
          return subPart;
        });
      }
      return part;
    });
  };

  const renderMessageText = (text) => {
    return text.split('\n').map((line, idx) => {
      const parts = line.split('**');
      return (
        <span key={idx}>
          {idx > 0 && <br />}
          {parts.map((part, pIdx) => {
            if (pIdx % 2 === 1) {
              return <strong key={pIdx}>{renderTextWithLinksAndCopies(part)}</strong>;
            }
            const subParts = part.split('*');
            return subParts.map((subPart, sIdx) => {
              if (sIdx % 2 === 1) {
                return <em key={sIdx}>{renderTextWithLinksAndCopies(subPart)}</em>;
              }
              return renderTextWithLinksAndCopies(subPart);
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
        <Container className="d-flex justify-content-center align-items-start h-100 py-2">
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
                <Col md={4} className="bg-primary text-white p-3 p-md-4 d-flex flex-column justify-content-between border-end border-primary-dark d-none d-md-flex">
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
                    {/* User Info (Mobile Only) */}
                    <div className="d-md-none text-end">
                      <div className="fw-semibold text-dark text-truncate" style={{ fontSize: '0.85rem', maxWidth: '140px' }}>{user.name}</div>
                      <Badge bg="primary" style={{ fontSize: '0.68rem', padding: '4px 8px' }}>{user.premiumCode}</Badge>
                    </div>
                  </div>


                  {/* Message Logs Feed */}
                  <div ref={feedRef} className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3 bg-light bg-opacity-50 ts-msg-feed-box" onScroll={handleScroll}>
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

                    {messages.filter(msg => !msg.isUnsent).map((msg, i) => (
                      <div
                        key={i}
                        className={`d-flex flex-column ${msg.sender === 'member' ? 'align-items-end' : 'align-items-start'
                          }`}
                      >
                        <MessageBubble
                          className={`px-3 py-2.5 rounded-3 shadow-sm ${msg.sender === 'member'
                            ? 'bg-primary text-white rounded-bottom-end-0'
                            : msg.sender === 'bot'
                              ? 'bg-info-subtle border border-info-subtle text-info-emphasis rounded-bottom-start-0'
                              : 'bg-white text-dark border rounded-bottom-start-0'
                            }`}
                        >
                          {renderMessageText(msg.text)}
                        </MessageBubble>
                        <small className="text-muted mt-1 px-1" style={{ fontSize: '0.65rem' }}>
                          {formatDateTime(msg.createdAt)}{msg.sender === 'member' && !msg.isRead && ' • Unseen'}
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
                  </div>

                  {showScrollBottom && (
                    <Button
                      onClick={scrollToBottom}
                      style={{
                        position: 'absolute',
                        bottom: '80px',
                        right: '25px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        color: '#1e293b',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 100,
                        padding: 0
                      }}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <BsArrowDownShort size={24} />
                    </Button>
                  )}

                  {/* Suggestions Panel */}
                  {!input.trim() && (
                    <div className="px-3 py-1 border-top bg-white d-flex gap-2" style={{ borderTop: '1px solid #e2e8f0', overflowX: 'auto', flexWrap: 'nowrap', scrollbarWidth: 'none' }}>
                      <button
                        onClick={() => {
                          const now = new Date().toISOString();
                          // Show user question on right
                          setMessages(prev => [...prev, { sender: 'member', text: 'আমার সর্বশেষ সিভি দেখতে চাই', createdAt: now }]);
                          // Show bot reply on left after brief delay
                          setTimeout(() => {
                            const td = teacherDataRef.current;
                            if (!td) {
                              setMessages(prev => [...prev, { sender: 'bot', text: 'দুঃখিত, আপনার সিভি তথ্য লোড করা সম্ভব হয়নি।', createdAt: new Date().toISOString() }]);
                              return;
                            }
                            const cvText = [
                              `📋 **${td.name || 'N/A'} এর সিভি**`,
                              ``,
                              `👤 **ব্যক্তিগত তথ্য**`,
                              `**নাম**: **${td.name || 'N/A'}**`,
                              `**লিঙ্গ**: ${td.gender || 'N/A'}`,
                              `**ফোন**: ${td.phone || 'N/A'}`,
                              td.email ? `**ইমেইল**: ${td.email}` : null,
                              td.currentArea ? `**বর্তমান এলাকা**: ${td.currentArea}` : null,
                              td.district ? `**জেলা**: ${td.district}` : null,
                              td.thana ? `**থানা**: ${td.thana}` : null,
                              ``,
                              `🎓 **শিক্ষাগত যোগ্যতা**`,
                              td.university ? `**বিশ্ববিদ্যালয়**: **${td.university}**` : null,
                              td.department ? `**বিভাগ**: ${td.department}` : null,
                              td.academicYear ? `**শিক্ষাবর্ষ**: ${td.academicYear}` : null,
                              td.medium ? `**মাধ্যম**: ${td.medium}` : null,
                              td.honorsUniversity ? `**অনার্স বিশ্ববিদ্যালয়**: ${td.honorsUniversity}` : null,
                              td.honorsDept ? `**অনার্স বিভাগ**: ${td.honorsDept}` : null,
                              td.mastersUniversity ? `**মাস্টার্স বিশ্ববিদ্যালয়**: ${td.mastersUniversity}` : null,
                              td.mastersDept ? `**মাস্টার্স বিভাগ**: ${td.mastersDept}` : null,
                              td.college ? `**কলেজ**: ${td.college}` : null,
                              td.hscGroup ? `**এইচএসসি গ্রুপ**: ${td.hscGroup}` : null,
                              td.hscResult ? `**এইচএসসি ফলাফল**: ${td.hscResult}` : null,
                              td.school ? `**স্কুল**: ${td.school}` : null,
                              td.sscGroup ? `**এসএসসি গ্রুপ**: ${td.sscGroup}` : null,
                              td.sscResult ? `**এসএসসি ফলাফল**: ${td.sscResult}` : null,
                              ``,
                              `📚 **টিউশন তথ্য**`,
                              td.experience ? `**অভিজ্ঞতা**: ${td.experience}` : null,
                              td.favoriteSubject ? `**পছন্দের বিষয়**: ${td.favoriteSubject}` : null,
                              td.expectedTuitionAreas ? `**পছন্দের এলাকা**: ${td.expectedTuitionAreas}` : null,
                              `**প্রিমিয়াম কোড**: **${td.premiumCode || 'N/A'}**`,

                            ].filter(Boolean).join('\n');
                            setMessages(prev => [...prev, { sender: 'bot', text: cvText, createdAt: new Date().toISOString() }]);
                          }, 500);
                        }}
                        className="ts-suggestion-chip"
                        style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderColor: '#dbeafe', color: '#1d4ed8' }}
                      >
                        সিভি দেখতে চাই
                      </button>
                      <button
                        onClick={() => {
                          const now = new Date().toISOString();
                          // Show user question on right
                          setMessages(prev => [...prev, { sender: 'member', text: 'আমার অ্যাপ্লাইগুলোর কি অবস্থা?', createdAt: now }]);
                          // Show bot reply on left after brief delay
                          setTimeout(() => {
                            const updateText = `📢 **আপনার অ্যাপ্লাই করা টিউশনগুলোর আপডেট**\n\nআপনার অ্যাপ্লাই করা টিউশনগুলোর সর্বশেষ অবস্থা জানতে নিচের লিংকে ক্লিক করুন:\n\n🔗 **https://www.tuitionsebaforum.com/apply-updates**\n\nউক্ত পেজে আপনার ফোন নম্বর ও প্রিমিয়াম কোড দিয়ে লগইন করলে আপনার সকল অ্যাপ্লাই এর বর্তমান স্ট্যাটাস দেখতে পারবেন।`;
                            setMessages(prev => [...prev, { sender: 'bot', text: updateText, createdAt: new Date().toISOString() }]);
                          }, 500);
                        }}
                        className="ts-suggestion-chip"
                        style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderColor: '#dcfce7', color: '#15803d' }}
                      >
                        অ্যাপ্লাই আপডেট
                      </button>
                      <button
                        onClick={() => {
                          const now = new Date().toISOString();
                          setMessages(prev => [...prev, { sender: 'member', text: 'পেমেন্ট নম্বর জানতে চাই', createdAt: now }]);
                          setTimeout(() => {
                            const paymentText = `💳 **আমাদের সাথে লেনদেন করুন নিচের দেওয়া নাম্বারে:**\n\n🔹 **বিকাশ (Payment)**: **01973920728** (সবচেয়ে উত্তম ও দ্রুততম নিশ্চিত মাধ্যম)\n\n🔹 **বিকাশ (Send Money)**: **01633920928**\n\n🔹 **নগদ (Send Money)**: **01633-920928**\n\n🔹 **রকেট (Send Money)**: **01633-920928**\n\n📢 **বিঃদ্রঃ**: দ্রুত ভেরিফিকেশন ও নিরাপদ লেনদেনের জন্য **bKash Payment** অপশন ব্যবহার করার অনুরোধ করা হচ্ছে। অন্য মাধ্যমে টাকা পাঠালে অবশ্যই লেনদেনের স্ক্রিনশট সংরক্ষণ করুন।\n\n💡 **টিপস**: যেকোনো নম্বরের ওপর ক্লিক করলেই নম্বরটি অটো কপি হয়ে যাবে। টাকা পাঠানোর পূর্বে অবশ্যই নম্বরটি পুনরায় ভালো করে চেক করে নেবেন।\n\nধন্যবাদ।`;
                            setMessages(prev => [...prev, { sender: 'bot', text: paymentText, createdAt: new Date().toISOString() }]);
                          }, 500);
                        }}
                        className="ts-suggestion-chip"
                        style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', borderColor: '#fef3c7', color: '#b45309' }}
                      >
                        পেমেন্ট নম্বর
                      </button>
                      <button
                        onClick={() => {
                          const now = new Date().toISOString();
                          setMessages(prev => [...prev, { sender: 'member', text: 'রিফান্ড সংক্রান্ত সাহায্য চাই', createdAt: now }]);
                          setTimeout(() => {
                            const refundText = `📌 **রিফান্ড বা টিউশন সংক্রান্ত সহায়তার নির্দেশিকা**\n\nনিচের লিঙ্কে ক্লিক করে:\n✅ **রিফান্ড নিন**\n✅ **পলিসি দেখুন**\n✅ **অফিসিয়াল লেনদেনের নম্বর দেখুন**\n\nটিউশন বাতিল বা কোনো সমস্যা হলে ফর্মটি পূরণ করুন এবং বিস্তারিত লিখুন।\n🕒 **অফিস ৭২ ঘণ্টার মধ্যে সমস্যার সমাধান করবে।**\n\n**ফর্ম পূরণ ও রিফান্ডের জন্য**:\n➡️ “**Request Refund**” অপশনটি নির্বাচন করুন\n🔗 **https://www.tuitionsebaforum.com/payment**`;
                            setMessages(prev => [...prev, { sender: 'bot', text: refundText, createdAt: new Date().toISOString() }]);
                          }, 500);
                        }}
                        className="ts-suggestion-chip"
                        style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', borderColor: '#ffe4e6', color: '#e11d48' }}
                      >
                        রিফান্ড
                      </button>
                    </div>
                  )}

                  {/* Chat Input Bar */}
                  <div className="p-3 border-top bg-white">
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                      }}
                      className="d-flex gap-2 align-items-center"
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
  align-items: flex-start;
  justify-content: center;
  padding: 15px 0 100px 0;

  @media (max-width: 768px) {
    padding: 10px 0 80px 0;
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
    position: relative;
  }

  .ts-msg-feed-box {
    height: 360px;
  }
  
  @media (max-width: 768px) {
    height: calc(100vh - 160px);
    min-height: 480px;
    
    .row {
      flex-direction: column;
      height: 100%;
    }

    .ts-chat-main-col {
      height: 100%;
      min-height: unset;
    }

    .ts-msg-feed-box {
      flex: 1;
      height: auto !important;
      padding: 16px !important;
    }
  }

  .ts-suggestion-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 12px;
    border: 1px solid #dbeafe;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    color: #1d4ed8;
    font-size: 0.65rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .ts-suggestion-chip:hover {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border-color: #93c5fd;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }

  .ts-suggestion-chip:active {
    transform: translateY(0);
  }
`;

const MessageBubble = styled.div`
  max-width: 75%;
  word-break: break-word;
  font-size: 0.88rem;
  line-height: 1.45;
`;

const BulbTooltip = styled.div`
  position: absolute;
  bottom: 40px;
  left: -10px;
  background: #f59e0b;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.35);
  animation: ts-tooltip-bounce 2s infinite ease-in-out;
  pointer-events: none;
  z-index: 100;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 20px;
    border-width: 4px 4px 0;
    border-style: solid;
    border-color: #f59e0b transparent;
    display: block;
    width: 0;
  }

  @keyframes ts-tooltip-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
`;
