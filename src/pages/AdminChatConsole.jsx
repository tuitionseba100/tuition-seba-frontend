import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import NavBarPage from './NavbarPage';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { BsChatSquareDots, BsSendFill, BsPeopleFill, BsCheckCircleFill, BsLock, BsArrowDownShort, BsTrash } from 'react-icons/bs';
import { axiosWithFallback as axios } from '../services/fetchWithFallback';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';

const BASE_URL = 'https://tuition-seba-backend-1.onrender.com';



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
    if (e.key === 'Enter') {
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
              <div className="d-flex flex-column h-100 flex-grow-1" style={{ height: 'calc(100vh - 100px)', position: 'relative' }}>
                {/* Header */}
                <div className="p-3 bg-white border-bottom d-flex justify-content-between align-items-center shadow-sm">
                  <div>
                    <h5 className="fw-bold mb-1">{activeName}</h5>
                    <small className="text-muted">
                      Phone: <strong>{activePhone}</strong> | Code: <strong>{activePremiumCode}</strong>
                    </small>
                  </div>
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
                        className={`d-flex flex-column ${
                          msg.sender === 'agent' ? 'align-items-end' : 'align-items-start'
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
                                className={`px-3 py-2 rounded-4 shadow-sm ${
                                  msg.sender === 'agent'
                                    ? 'bg-primary text-white rounded-bottom-end-0'
                                    : msg.sender === 'bot'
                                    ? 'bg-info-subtle border border-info-subtle text-info-emphasis rounded-bottom-start-0'
                                    : 'bg-white text-dark rounded-bottom-start-0'
                                }`}
                                style={{ wordBreak: 'break-word' }}
                              >
                                {renderMessageText(msg.text)}
                              </div>
                              {/* Unsend button on hover - only for agent/bot messages */}
                              {(msg.sender === 'agent' || msg.sender === 'bot') && (
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
                        <small className="text-muted mt-1 px-2" style={{ fontSize: '0.65rem' }}>
                          {msg.senderName || (msg.sender === 'bot' ? 'Bot' : 'Agent')} • {formatDateTime(msg.createdAt)}
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
