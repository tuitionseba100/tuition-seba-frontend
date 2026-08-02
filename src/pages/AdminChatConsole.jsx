import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import NavBarPage from './NavbarPage';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { BsChatSquareDots, BsSendFill, BsPeopleFill, BsCheckCircleFill, BsLock } from 'react-icons/bs';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';

const BASE_URL = window.location.origin.includes('localhost')
  ? 'http://localhost:5001'
  : 'https://tuition-seba-backend-1.onrender.com';

let socket;

export default function AdminChatConsole() {
  const [sessions, setSessions] = useState([]);
  const [activePhone, setActivePhone] = useState(null);
  const [activeName, setActiveName] = useState('');
  const [activePremiumCode, setActivePremiumCode] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [memberTyping, setMemberTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Connect to Socket.io
    socket = io(BASE_URL);

    socket.on('receive_message', (msg) => {
      if (activePhone && msg.phone === activePhone) {
        setMessages((prev) => [...prev, msg]);
        // Auto mark as read if active
        axios.post(`${BASE_URL}/api/chat/read/${activePhone}`, {}, {
          headers: { Authorization: token }
        });
      }
    });

    socket.on('session_updated', loadSessions);

    socket.on('display_typing', ({ isTyping, role }) => {
      if (role === 'member') {
        setMemberTyping(isTyping);
      }
    });

    loadSessions();

    const interval = setInterval(loadSessions, 10000);

    return () => {
      clearInterval(interval);
      if (socket) socket.disconnect();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [activePhone]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadSessions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/chat/sessions`, {
        headers: { Authorization: token }
      });
      setSessions(res.data);
    } catch (err) {
      console.error('Error loading sessions:', err);
    }
  };

  const selectSession = async (phone, name, premiumCode) => {
    setActivePhone(phone);
    setActiveName(name);
    setActivePremiumCode(premiumCode);
    setLoadingHistory(true);

    if (socket) {
      socket.emit('join_room', {
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

      // Load History
      const res = await axios.get(`${BASE_URL}/api/chat/history/${phone}`, {
        headers: { Authorization: token }
      });
      setMessages(res.data);
      loadSessions();
    } catch (err) {
      console.error('Error loading history:', err);
      toast.error('Failed to load chat history.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!socket || !activePhone) return;

    socket.emit('typing', { phone: activePhone, isTyping: true, role: 'agent' });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { phone: activePhone, isTyping: false, role: 'agent' });
    }, 1500);
  };

  const sendAgentMessage = () => {
    if (!input.trim() || !activePhone || !socket) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit('typing', { phone: activePhone, isTyping: false, role: 'agent' });

    socket.emit('send_message', {
      phone: activePhone,
      premiumCode: 'AGENT',
      sender: 'agent',
      senderName: localStorage.getItem('username') || 'Support Agent',
      text: input
    });
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendAgentMessage();
    }
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
      <NavBarPage />
      <StyledContainer fluid>
        <Row className="h-100 g-0 shadow-lg rounded-3 overflow-hidden" style={{ background: '#ffffff', minHeight: 'calc(100vh - 100px)' }}>
          
          {/* Chat List Sidebar */}
          <Col md={4} className="border-end d-flex flex-column" style={{ background: '#f8f9fa' }}>
            <div className="p-3 border-bottom d-flex align-items-center gap-2 bg-primary text-white">
              <BsPeopleFill size={20} />
              <h5 className="mb-0 fw-bold">Active Chats</h5>
            </div>
            <div className="flex-grow-1 overflow-auto p-2" style={{ maxHeight: 'calc(100vh - 160px)' }}>
              {sessions.length === 0 ? (
                <div className="text-center text-muted mt-5">No active sessions.</div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session._id}
                    onClick={() => selectSession(session.phone, session.name, session.premiumCode)}
                    className={`p-3 mb-2 rounded-3 cursor-pointer transition-all d-flex justify-content-between align-items-center ${
                      session.phone === activePhone ? 'bg-primary text-white shadow-sm' : 'bg-white border text-dark hover-bg'
                    }`}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="fw-bold text-truncate">{session.name}</div>
                      <div style={{ fontSize: '0.75rem', marginTop: '2px' }} className={session.phone === activePhone ? 'text-white-50' : 'text-muted'}>
                        Phone: {session.phone} | Code: {session.premiumCode}
                      </div>
                      <small className={`text-truncate d-block mt-1 ${session.phone === activePhone ? 'text-white-50' : 'text-muted'}`}>
                        {session.lastMessage}
                      </small>
                    </div>
                    {session.unreadCount > 0 && (
                      <Badge bg="danger" pill className="ms-2">
                        {session.unreadCount}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </Col>

          {/* Active Chat Feed */}
          <Col md={8} className="d-flex flex-column" style={{ background: '#f0f2f5' }}>
            {activePhone ? (
              <div className="d-flex flex-column h-100 flex-grow-1" style={{ height: 'calc(100vh - 100px)' }}>
                {/* Header */}
                <div className="p-3 bg-white border-bottom d-flex justify-content-between align-items-center shadow-sm">
                  <div>
                    <h5 className="fw-bold mb-1">{activeName}</h5>
                    <small className="text-muted">
                      Phone: <strong>{activePhone}</strong> | Code: <strong>{activePremiumCode}</strong>
                    </small>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3" style={{ height: '0px' }}>
                  {loadingHistory ? (
                    <div className="text-center text-muted my-auto">Loading message history...</div>
                  ) : (
                    messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`d-flex flex-column ${
                          msg.sender === 'agent' ? 'align-items-end' : 'align-items-start'
                        }`}
                      >
                        <div
                          className={`px-3 py-2 rounded-4 max-w-70 shadow-sm ${
                            msg.sender === 'agent'
                              ? 'bg-primary text-white rounded-bottom-end-0'
                              : msg.sender === 'bot'
                              ? 'bg-info-subtle border border-info-subtle text-info-emphasis rounded-bottom-start-0'
                              : 'bg-white text-dark rounded-bottom-start-0'
                          }`}
                          style={{ maxWidth: '75%', wordBreak: 'break-word' }}
                        >
                          {renderMessageText(msg.text)}
                        </div>
                        <small className="text-muted mt-1 px-2" style={{ fontSize: '0.65rem' }}>
                          {msg.senderName}
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
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-top shadow-sm">
                  <Form onSubmit={(e) => { e.preventDefault(); sendAgentMessage(); }} className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Type your reply here..."
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="rounded-pill px-4"
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
      <ToastContainer />
    </>
  );
}

const StyledContainer = styled(Container)`
  padding: 20px;
  background: #eef1f6;
  min-height: calc(100vh - 70px);

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
`;
