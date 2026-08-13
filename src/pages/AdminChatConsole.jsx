import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import NavBarPage from './NavbarPage';
import { Container, Row, Col, Card, Button, Form, Badge, Modal } from 'react-bootstrap';
import { BsChatSquareDots, BsSendFill, BsPeopleFill, BsCheckCircleFill, BsLock, BsArrowDownShort, BsTrash, BsInfoCircle, BsWhatsapp, BsClipboard } from 'react-icons/bs';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';

const BASE_URL = 'https://tuition-seba-backend-a0pb.onrender.com';



export default function AdminChatConsole() {
  const [sessions, setSessions] = useState([]);
  const [activePhone, setActivePhone] = useState(null);
  const [activeName, setActiveName] = useState('');
  const [activePremiumCode, setActivePremiumCode] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [memberTyping, setMemberTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const feedRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const token = localStorage.getItem('token');
  const activePhoneRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchQueryRef = useRef('');
  const socketRef = useRef(null);
  const role = localStorage.getItem('role');

  // Teacher details modal states
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loadingTeacher, setLoadingTeacher] = useState(false);

  const fetchTeacherDetails = async (phone) => {
    if (!phone) return;
    setLoadingTeacher(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/regTeacher/getTableData?phone=${phone}`, {
        headers: { Authorization: token }
      });
      if (res.data && res.data.data && res.data.data.length > 0) {
        setSelectedTeacher(res.data.data[0]);
        setShowTeacherModal(true);
      } else {
        toast.info('No teacher profile found for this phone number.');
      }
    } catch (err) {
      console.error('Error fetching teacher details:', err);
      toast.error('Failed to load teacher details.');
    } finally {
      setLoadingTeacher(false);
    }
  };

  const getCVText = (teacherDetails) => {
    if (!teacherDetails) return '';
    const hasValue = (v) => v !== undefined && v !== null && String(v).trim() !== '';

    const lines = [
      `টিউশন সেবা ফোরাম (আস্থা ও বিশ্বস্ততায় একধাপ এগিয়ে)`,
      `যোগাযোগ: 01633920928`,
      `ওয়েবসাইট: www.tuitionsebaforum.com`,
      ``,
      `*Verified Premium Tutor*`,
      `Premium Code: *${teacherDetails.premiumCode || 'N/A'}*`,
      ``,
      `*Teacher CV*`,
      `Name: *${teacherDetails.name || 'N/A'}*`,
      `Area: *${teacherDetails.currentArea || 'N/A'}*`,
      ``,
      `*Academic Qualifications*`,

      ...(hasValue(teacherDetails.mastersUniversity) ? [`Masters University: *${teacherDetails.mastersUniversity}*`] : []),
      ...(hasValue(teacherDetails.mastersDept) ? [`Masters Department: *${teacherDetails.mastersDept}*`] : []),
      `Honours University: *${teacherDetails.honorsUniversity || 'N/A'}*`,
      `Academic Year: *${teacherDetails.academicYear || 'N/A'}*`,
      `Department: *${teacherDetails.honorsDept || 'N/A'}*`,
    ];

    if (hasValue(teacherDetails.college)) {
      lines.push(`College (HSC): *${teacherDetails.college}*`);
    }

    if (hasValue(teacherDetails.hscGroup) || hasValue(teacherDetails.hscResult)) {
      lines.push(
        `HSC - Group: *${teacherDetails.hscGroup || 'N/A'}*, Result: *${teacherDetails.hscResult || 'N/A'}*`
      );
    }

    if (hasValue(teacherDetails.school)) {
      lines.push(`School (SSC): *${teacherDetails.school}*`);
    }

    if (hasValue(teacherDetails.sscGroup) || hasValue(teacherDetails.sscResult)) {
      lines.push(
        `SSC - Group: *${teacherDetails.sscGroup || 'N/A'}*, Result: *${teacherDetails.sscResult || 'N/A'}*`
      );
    }

    lines.push(
      ``,
      `*Experience*: ${teacherDetails.experience || 'N/A'}`,
      `*Address*: ${teacherDetails.fullAddress || 'N/A'}`,
      `*Favorite Subject*: ${teacherDetails.favoriteSubject || 'N/A'}`
    );

    return lines.join('\n');
  };

  const handleShareToWhatsApp = (teacherDetails) => {
    const message = getCVText(teacherDetails);
    if (!message) return;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCopyCV = async (teacherDetails) => {
    const message = getCVText(teacherDetails);
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      toast.success('CV copied to clipboard successfully!');
    } catch (err) {
      console.error('Failed to copy CV:', err);
      toast.error('Failed to copy CV to clipboard.');
    }
  };

  const handleDeleteChat = async (phone) => {
    if (!window.confirm(`Are you sure you want to permanently delete all chat history and session for ${activeName} (${phone})? This action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/api/chat/session/${phone}`, {
        headers: { Authorization: token }
      });
      toast.success('Chat session deleted successfully.');
      setActivePhone(null);
      setActiveName('');
      setActivePremiumCode('');
      setMessages([]);
      loadSessions();
    } catch (err) {
      console.error('Error deleting chat session:', err);
      toast.error(err.response?.data?.message || 'Failed to delete chat session.');
    }
  };
  const username = localStorage.getItem('username');

  const handleUnsendMessage = async (messageId) => {
    try {
      await axios.patch(`${BASE_URL}/api/chat/message/${messageId}/unsend`, { username }, {
        headers: { Authorization: token }
      });
      setMessages(prev => prev.map(msg =>
        msg._id === messageId ? { ...msg, isUnsent: true, deletedBy: username } : msg
      ));
      toast.success('Message unsent.');
    } catch (err) {
      console.error('Error unsending message:', err);
      toast.error(err.response?.data?.message || 'Failed to unsend message.');
    }
  };

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

  useEffect(() => {
    activePhoneRef.current = activePhone;
  }, [activePhone]);

  useEffect(() => {
    // Connect to Socket.io
    socketRef.current = io(BASE_URL);

    socketRef.current.on('receive_message', (msg) => {
      if (activePhoneRef.current && msg.phone === activePhoneRef.current) {
        setMessages((prev) => [...prev, msg]);
        // Auto mark as read if active
        axios.post(`${BASE_URL}/api/chat/read/${activePhoneRef.current}`, {}, {
          headers: { Authorization: token }
        });
      }
    });

    socketRef.current.on('session_updated', loadSessions);

    socketRef.current.on('display_typing', ({ isTyping, role }) => {
      if (role === 'member') {
        setMemberTyping(isTyping);
      }
    });

    socketRef.current.on('message_unsent', ({ messageId, phone, deletedBy }) => {
      if (activePhoneRef.current && phone === activePhoneRef.current) {
        setMessages(prev => prev.map(msg =>
          msg._id === messageId ? { ...msg, isUnsent: true, deletedBy } : msg
        ));
      }
    });

    loadSessions();

    const interval = setInterval(loadSessions, 10000);

    return () => {
      clearInterval(interval);
      if (socketRef.current) socketRef.current.disconnect();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);

  const loadSessions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/chat/sessions?search=${searchQueryRef.current}`, {
        headers: { Authorization: token }
      });
      setSessions(res.data);
    } catch (err) {
      console.error('Error loading sessions:', err);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    searchQueryRef.current = val;
    loadSessions();
  };

  const selectSession = async (phone, name, premiumCode) => {
    setActivePhone(phone);
    setActiveName(name);
    setActivePremiumCode(premiumCode);
    setLoadingHistory(true);

    if (socketRef.current) {
      socketRef.current.emit('join_room', {
        phone,
        name: localStorage.getItem('username') || 'Support Agent',
        role: 'agent'
      });
    }

    try {
      // Mark as read
      await axios.post(`${BASE_URL}/api/chat/read/${phone}`, {}, {
        headers: { Authorization: token }
      });

      // Load History (Initial load limit = 20)
      const res = await axios.get(`${BASE_URL}/api/chat/history/${phone}?limit=20`, {
        headers: { Authorization: token }
      });
      setMessages(res.data);
      setHasMore(res.data.length === 20);
      loadSessions();
    } catch (err) {
      console.error('Error loading history:', err);
      toast.error('Failed to load chat history.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadMoreMessages = async () => {
    if (messages.length === 0 || !activePhone) return;
    const firstMsgTimestamp = messages[0].createdAt;
    try {
      const res = await axios.get(`${BASE_URL}/api/chat/history/${activePhone}?before=${firstMsgTimestamp}&limit=20`, {
        headers: { Authorization: token }
      });
      if (res.data.length > 0) {
        setMessages((prev) => [...res.data, ...prev]);
        setHasMore(res.data.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more messages:', err);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!socketRef.current || !activePhone) return;

    socketRef.current.emit('typing', { phone: activePhone, isTyping: true, role: 'agent' });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('typing', { phone: activePhone, isTyping: false, role: 'agent' });
    }, 1500);
  };

  const sendAgentMessage = () => {
    if (!input.trim() || !activePhone || !socketRef.current) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketRef.current.emit('typing', { phone: activePhone, isTyping: false, role: 'agent' });

    socketRef.current.emit('send_message', {
      phone: activePhone,
      premiumCode: 'AGENT',
      sender: 'agent',
      senderName: localStorage.getItem('username') || 'Support Agent',
      text: input
    });
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendAgentMessage();
    }
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
      <NavBarPage />
      <StyledContainer fluid>
        <Row className="h-100 g-0 shadow-lg rounded-3 overflow-hidden" style={{ background: '#ffffff', minHeight: 'calc(100vh - 100px)' }}>

          {/* Chat List Sidebar */}
          <Col md={4} className="border-end d-flex flex-column" style={{ background: '#f8f9fa' }}>
            <div className="p-3 border-bottom d-flex align-items-center gap-2 bg-primary text-white">
              <BsPeopleFill size={20} />
              <h5 className="mb-0 fw-bold">Active Chats</h5>
            </div>
            <div className="p-2 border-bottom bg-white">
              <Form.Control
                type="text"
                placeholder="Search phone or premium code..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="rounded-pill px-3 py-1.5 fs-7"
              />
            </div>
            <div className="flex-grow-1 overflow-auto p-2" style={{ maxHeight: 'calc(100vh - 210px)' }}>
              {sessions.length === 0 ? (
                <div className="text-center text-muted mt-5">No active sessions.</div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session._id}
                    onClick={() => selectSession(session.phone, session.name, session.premiumCode)}
                    className={`p-3 mb-2 rounded-3 cursor-pointer transition-all d-flex justify-content-between align-items-center ${session.phone === activePhone ? 'bg-primary text-white shadow-sm' : 'bg-white border text-dark hover-bg'
                      }`}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="fw-bold text-truncate">{session.name}</div>
                      <div style={{ fontSize: '0.75rem', marginTop: '2px' }} className={session.phone === activePhone ? 'text-white-50' : 'text-muted'}>
                        Phone: {session.phone} | Code: {session.premiumCode}
                      </div>
                      <small className={`text-truncate d-block mt-1 ${session.phone === activePhone ? 'text-white-50' : 'text-muted'}`}>
                        <strong>
                          {session.lastSender === 'agent'
                            ? 'You: '
                            : session.lastSender === 'member'
                              ? 'Teacher: '
                              : session.lastSender
                                ? 'Bot: '
                                : ''}
                        </strong>
                        {session.lastMessage}
                      </small>
                    </div>
                    <div className="d-flex flex-column align-items-end ms-2 gap-1" style={{ flexShrink: 0 }}>
                      {session.unreadCount > 0 && (
                        <Badge bg="danger" pill style={{ fontSize: '0.7rem' }}>
                          {session.unreadCount}
                        </Badge>
                      )}
                      {session.lastSender && session.lastSender !== 'agent' && (
                        <Badge
                          bg={session.phone === activePhone ? "light" : "warning"}
                          text={session.phone === activePhone ? "primary" : "dark"}
                          pill
                          style={{ fontSize: '0.65rem', fontWeight: 'bold' }}
                          title="Last message from member (waiting for agent reply)"
                        >
                          Waiting
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Col>

          {/* Active Chat Feed */}
          <Col md={8} className="d-flex flex-column" style={{ background: '#f0f2f5' }}>
            {activePhone ? (
              <div className="d-flex flex-column h-100 flex-grow-1" style={{ height: 'calc(100vh - 100px)', position: 'relative' }}>
                {/* Header */}
                <div className="p-3 bg-white border-bottom d-flex justify-content-between align-items-center shadow-sm">
                  <div>
                    <h5 className="fw-bold mb-1">{activeName}</h5>
                    <small className="text-muted">
                      Phone: <strong>{activePhone}</strong> | Code: <strong>{activePremiumCode}</strong>
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => fetchTeacherDetails(activePhone)}
                      disabled={loadingTeacher}
                      className="d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill fw-bold"
                    >
                      {loadingTeacher ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        <BsInfoCircle size={15} />
                      )}
                      Teacher Info
                    </Button>

                    {role === 'superadmin' && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteChat(activePhone)}
                        className="d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill fw-bold"
                      >
                        <BsTrash size={15} /> Delete Chat
                      </Button>
                    )}
                  </div>
                </div>

                {/* Messages Feed */}
                <div ref={feedRef} className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3" style={{ height: '0px' }} onScroll={handleScroll}>
                  {hasMore && !loadingHistory && (
                    <Button variant="link" size="sm" onClick={loadMoreMessages} className="d-block mx-auto text-muted mb-2 text-decoration-none">
                      Load previous messages
                    </Button>
                  )}
                  {loadingHistory ? (
                    <div className="text-center text-muted my-auto">Loading message history...</div>
                  ) : (
                    messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`d-flex flex-column ${(msg.sender === 'agent' || msg.sender === 'bot' || msg.sender === 'bot-auto-comment') ? 'align-items-end' : 'align-items-start'
                          }`}
                      >
                        <div className="position-relative ts-msg-bubble-wrap" style={{ maxWidth: '75%' }}>
                          {msg.isUnsent ? (
                            <div
                              className="px-3 py-2 rounded-4 shadow-sm"
                              style={{
                                background: '#fef2f2',
                                border: '1px solid #fca5a5',
                                wordBreak: 'break-word',
                                opacity: 0.7
                              }}
                            >
                              <div style={{ color: '#dc2626', textDecoration: 'line-through', fontSize: '0.85rem' }}>
                                {renderMessageText(msg.text)}
                              </div>
                              <div style={{ color: '#ef4444', fontSize: '0.68rem', fontStyle: 'italic', marginTop: '4px' }}>
                                🚫 Deleted by {msg.deletedBy || 'Admin'}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div
                                className={`px-3 py-2 rounded-4 shadow-sm ${msg.sender === 'agent'
                                  ? 'bg-primary text-white rounded-bottom-end-0'
                                  : msg.sender === 'bot'
                                    ? 'bg-info-subtle border border-info-subtle text-info-emphasis rounded-bottom-end-0'
                                    : msg.sender === 'bot-auto-comment'
                                      ? 'bg-warning-subtle border border-warning-subtle text-warning-emphasis rounded-bottom-end-0'
                                      : 'bg-white text-dark rounded-bottom-start-0'
                                  }`}
                                style={{ wordBreak: 'break-word' }}
                              >
                                {renderMessageText(msg.text)}
                              </div>
                              {/* Unsend button on hover - only for agent/bot messages */}
                              {(msg.sender === 'agent' || msg.sender === 'bot' || msg.sender === 'bot-auto-comment') && (
                                <button
                                  onClick={() => handleUnsendMessage(msg._id)}
                                  className="ts-unsend-btn"
                                  title="Unsend this message"
                                >
                                  <BsTrash size={12} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                        <small className="text-muted mt-1 px-2" style={{ fontSize: '0.65rem', alignSelf: (msg.sender === 'agent' || msg.sender === 'bot' || msg.sender === 'bot-auto-comment') ? 'flex-end' : 'flex-start' }}>
                          {msg.senderName || (msg.sender === 'bot' ? 'Bot' : msg.sender === 'bot-auto-comment' ? 'System' : 'Agent')} • {formatDateTime(msg.createdAt)}
                        </small>
                      </div>
                    ))
                  )}
                  {memberTyping && (
                    <div className="d-flex align-items-start flex-column">
                      <div className="bg-white px-3 py-2 rounded-4 shadow-sm d-flex gap-1 align-items-center">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
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

                {/* Input Area */}
                <div className="p-3 bg-white border-top shadow-sm">
                  <Form onSubmit={(e) => { e.preventDefault(); sendAgentMessage(); }} className="d-flex gap-2">
                    <Form.Control
                      as="textarea"
                      rows={1}
                      placeholder="Type your reply here..."
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="px-4 py-2"
                      style={{
                        borderRadius: '20px',
                        resize: 'none',
                        maxHeight: '120px',
                        overflowY: 'auto'
                      }}
                    />
                    <Button type="submit" variant="primary" className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                      <BsSendFill size={16} />
                    </Button>
                  </Form>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center m-auto text-muted">
                <BsChatSquareDots size={48} className="mb-3 text-secondary" />
                <h5>No Chat Selected</h5>
                <p>Click on an active chat session from the list to start messaging.</p>
              </div>
            )}
          </Col>
        </Row>
      </StyledContainer>

      {/* Teacher Details Modal */}
      {selectedTeacher && (
        <Modal show={showTeacherModal} onHide={() => setShowTeacherModal(false)} size="lg" centered>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title className="fw-bold">
              👨‍🏫 Teacher Details: {selectedTeacher.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
            <Row className="g-3">
              {/* Profile Overview */}
              <Col md={12}>
                <Card className="border-0 shadow-sm p-3 mb-2" style={{ borderRadius: '12px' }}>
                  <h6 className="text-primary fw-bold mb-3 border-bottom pb-2">Profile Overview</h6>
                  <Row>
                    <Col md={4}><strong>Premium Code:</strong> {selectedTeacher.premiumCode || 'N/A'}</Col>
                    <Col md={4}><strong>University Code:</strong> {selectedTeacher.uniCode || 'N/A'}</Col>
                    <Col md={4}><strong>Status:</strong> <Badge bg={selectedTeacher.status === 'verified' ? 'success' : selectedTeacher.status === 'suspended' ? 'danger' : 'warning'}>{selectedTeacher.status}</Badge></Col>
                  </Row>
                </Card>
              </Col>

              {/* Personal Information */}
              <Col md={6}>
                <Card className="border-0 shadow-sm p-3 h-100" style={{ borderRadius: '12px' }}>
                  <h6 className="text-primary fw-bold mb-3 border-bottom pb-2">Personal & Contact Info</h6>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                    <li><strong>Phone:</strong> {selectedTeacher.phone || 'N/A'}</li>
                    <li><strong>Alternative Phone:</strong> {selectedTeacher.alternativePhone || 'N/A'}</li>
                    <li><strong>WhatsApp:</strong> {selectedTeacher.whatsapp || 'N/A'}</li>
                    <li><strong>Gender:</strong> {selectedTeacher.gender || 'N/A'}</li>
                    <li><strong>Current Area:</strong> {selectedTeacher.currentArea || 'N/A'}</li>
                    <li><strong>Address:</strong> {selectedTeacher.fullAddress || 'N/A'}</li>
                  </ul>
                </Card>
              </Col>

              {/* Academic Background */}
              <Col md={6}>
                <Card className="border-0 shadow-sm p-3 h-100" style={{ borderRadius: '12px' }}>
                  <h6 className="text-primary fw-bold mb-3 border-bottom pb-2">Academic & Professional</h6>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                    <li><strong>Honors Univ:</strong> {selectedTeacher.honorsUniversity || 'N/A'}</li>
                    <li><strong>Honors Dept:</strong> {selectedTeacher.honorsDept || 'N/A'}</li>
                    <li><strong>Masters Univ:</strong> {selectedTeacher.mastersUniversity || 'N/A'}</li>
                    <li><strong>Masters Dept:</strong> {selectedTeacher.mastersDept || 'N/A'}</li>
                    <li><strong>Academic Year:</strong> {selectedTeacher.academicYear || 'N/A'}</li>
                    <li><strong>SSC Result:</strong> {selectedTeacher.sscResult || 'N/A'} ({selectedTeacher.sscGroup || 'N/A'})</li>
                    <li><strong>HSC Result:</strong> {selectedTeacher.hscResult || 'N/A'} ({selectedTeacher.hscGroup || 'N/A'})</li>
                  </ul>
                </Card>
              </Col>

              {/* Experience and Tutoring Preferences */}
              <Col md={12}>
                <Card className="border-0 shadow-sm p-3" style={{ borderRadius: '12px' }}>
                  <h6 className="text-primary fw-bold mb-3 border-bottom pb-2">Tutoring Preferences</h6>
                  <Row>
                    <Col md={6}><strong>Experience:</strong> {selectedTeacher.experience || 'N/A'}</Col>
                    <Col md={6}><strong>Favorite Subjects:</strong> {selectedTeacher.favoriteSubject || 'N/A'}</Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 bg-light p-3">
            <div className="me-auto d-flex gap-2">
              <Button
                variant="success"
                onClick={() => handleShareToWhatsApp(selectedTeacher)}
                className="px-4 py-2 rounded-pill fw-bold d-flex align-items-center gap-2"
                style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
              >
                <BsWhatsapp size={18} /> Share CV to WhatsApp
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleCopyCV(selectedTeacher)}
                className="px-4 py-2 rounded-pill fw-bold d-flex align-items-center gap-2"
              >
                <BsClipboard size={18} /> Copy CV
              </Button>
            </div>
            <Button variant="secondary" onClick={() => setShowTeacherModal(false)} className="px-4 py-2 rounded-pill fw-bold">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <ToastContainer />
    </>
  );
}

const StyledContainer = styled(Container)`
  padding: 20px;
  background: #eef1f6;
  min-height: calc(100vh - 70px);

  /* Sleek Scrollbars */
  .overflow-auto::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .overflow-auto::-webkit-scrollbar-track {
    background: transparent;
  }
  .overflow-auto::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 3px;
  }
  .overflow-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.25);
  }

  .hover-bg:hover {
    background-color: #f1f3f5 !important;
  }

  .typing-dot {
    width: 6px;
    height: 6px;
    background: #adb5bd;
    border-radius: 50%;
    display: inline-block;
    animation: bounce 1.3s infinite ease-in-out;
  }

  .typing-dot:nth-child(2) { animation-delay: 0.15s; }
  .typing-dot:nth-child(3) { animation-delay: 0.3s; }

  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-5px); }
  }

  /* Unsend button - hidden by default, shown on hover */
  .ts-msg-bubble-wrap .ts-unsend-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -32px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1px solid #e2e8f0;
    background: white;
    color: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    padding: 0;
  }

  .ts-msg-bubble-wrap:hover .ts-unsend-btn {
    opacity: 1;
  }

  .ts-msg-bubble-wrap .ts-unsend-btn:hover {
    background: #fef2f2;
    border-color: #fca5a5;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
  }

  /* For right-aligned (agent) messages, show button on the left */
  .align-items-end .ts-msg-bubble-wrap .ts-unsend-btn {
    right: auto;
    left: -32px;
  }
`;
