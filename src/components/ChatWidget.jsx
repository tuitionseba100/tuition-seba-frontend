import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { BsChatDotsFill, BsX, BsArrowRightShort, BsTelephone, BsKey, BsSendFill, BsRobot, BsCircleFill, BsWhatsapp, BsArrowDownShort, BsLightbulb, BsFileEarmarkPerson, BsBoxArrowUpRight } from 'react-icons/bs';
import { fetchWithFallback } from '../services/fetchWithFallback';
import './ChatWidget.css';

const BASE_URL = 'https://tuition-seba-backend-1.onrender.com';



export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
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

  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const teacherDataRef = useRef(null);

  const feedRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socketRef = useRef(null);

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
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('@user_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.premiumCode) setPremiumCode(parsed.premiumCode);
        }
      } catch (err) {
        console.error('Error loading settings in ChatWidget:', err);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOpenChat = async (event) => {
      setIsOpen(true);
      const tuitionCode = event.detail?.tuitionCode;
      if (!tuitionCode) return;
      const tuitionDetails = event.detail?.tuitionDetails;
      
      const formatMessage = (details) => {
        if (!details) return `আমি এই টিউশনে (${tuitionCode}) অ্যাপ্লাই করতে চাই।`;
        const area = details.area ? `, ${details.area}` : '';
        return `📢 **[Tuition Apply]**

Tuition Code: ${details.tuitionCode}
Wanted Teacher: ${details.wantedTeacher || ''}
Number of Students: ${details.student || ''}
Class: ${details.class || ''}
Medium: ${details.medium || ''}
Subject: ${details.subject || ''}
Day: ${details.day || ''}
Time: ${details.time || ''}
Salary: ${details.salary && /taka|tk/i.test(details.salary.toString()) ? details.salary : (details.salary ? details.salary.toString().trim() + ' taka' : '')}${details.mediaFee && details.mediaFee.trim() !== '' ? `\nMedia Fee: ${details.mediaFee}` : ''}
Location: ${details.location || ''}${area}
Joining: ${details.joining || ''}

এই টিউশনটা (${details.tuitionCode}) কি এখনো আছে?`.trim();
      };

      const applyMsg = formatMessage(tuitionDetails);
      
      const tuitionId = event.detail?.tuitionId;
      
      let currentUser = user;
      if (!currentUser) {
        try {
          const saved = localStorage.getItem('@user_settings');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.phone && parsed.premiumCode) {
              setPhone(parsed.phone);
              setPremiumCode(parsed.premiumCode);
              
              const res = await fetchWithFallback(`${BASE_URL}/api/regTeacher/check-apply-possible`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: parsed.phone, premiumCode: parsed.premiumCode })
              });
              const data = await res.json();
              if (data.success) {
                const teacherFullData = data.data.data;
                teacherDataRef.current = teacherFullData;
                currentUser = {
                  name: teacherFullData.name || 'Premium Member',
                  phone: data.data.phone,
                  premiumCode: data.data.premiumCode
                };
                setUser(currentUser);
                
                const histRes = await fetchWithFallback(`${BASE_URL}/api/chat/history/${currentUser.phone}?limit=20`);
                const histData = await histRes.json();
                if (histData.length === 0) {
                  setMessages([{ sender: 'bot', text: `Welcome, **${currentUser.name}**! 💬\n\nPlease type your message below a support representative will reply directly.` }]);
                } else {
                  setMessages(histData);
                  setHasMore(histData.length === 20);
                }
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (currentUser) {
        setTimeout(async () => {
          if (socketRef.current) {
            // Show temporary loading status message in the chat feed
            const tempId = 'temp-loading-' + Date.now();
            setMessages(prev => [...prev, {
              _id: tempId,
              sender: 'bot',
              text: `⏳ **আবেদন করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...**`,
              createdAt: new Date().toISOString()
            }]);

            try {
              // Attempt to save the tuition application record in the database
              const teacher = teacherDataRef.current || {};
              const applyRes = await fetchWithFallback(`${BASE_URL}/api/tuitionApply/add-web`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  premiumCode: currentUser.premiumCode,
                  tuitionCode: tuitionCode,
                  tuitionId: tuitionId,
                  name: teacher.name || currentUser.name || 'Premium Member',
                  phone: teacher.phone || currentUser.phone,
                  institute: teacher.institute || '',
                  department: teacher.department || '',
                  academicYear: teacher.academicYear || '',
                  address: teacher.address || '',
                  comment: 'Applied via Live Chat',
                  agentComment: 'Chat Apply',
                })
              });

              const applyData = await applyRes.json();

              // Remove temporary loading message
              setMessages(prev => prev.filter(m => m._id !== tempId));

              if (!applyRes.ok) {
                // If backend returned an error (e.g. already applied), show a nice notice locally in the chat feed
                // without emitting to socket so that it is not saved to the chat history database.
                setMessages(prev => [...prev, {
                  _id: 'local-error-' + Date.now(),
                  sender: 'bot',
                  senderName: 'System',
                  text: `⚠️ **আবেদন করা হয়নি (${tuitionCode}):** ${applyData.message || 'দুঃখিত, কোনো একটি ত্রুটি ঘটেছে।'}`
                }]);
                return;
              }

              // Send the member's application message if save succeeded
              socketRef.current.emit('send_message', {
                phone: currentUser.phone,
                premiumCode: currentUser.premiumCode,
                sender: 'member',
                senderName: currentUser.name,
                text: applyMsg
              });

              // Fetch autoComment if tuitionId is available
              let autoComment = '';
              if (tuitionId) {
                try {
                  const commentRes = await fetchWithFallback(`${BASE_URL}/api/tuitionApply/get-auto-comment/${tuitionId}`);
                  const commentData = await commentRes.json();
                  if (commentData && commentData.comment) {
                    autoComment = commentData.comment;
                  }
                } catch (e) {
                  console.error('Error fetching auto comment for chat apply:', e);
                }
              }

              // Emit success response after a small delay (500ms) to ensure correct order
              setTimeout(() => {
                socketRef.current.emit('send_message', {
                  phone: currentUser.phone,
                  premiumCode: currentUser.premiumCode,
                  sender: 'bot',
                  senderName: 'System',
                  text: `🎉 **আপনার আবেদনটি সফল হয়েছে!**\n\nখুব শীঘ্রই আমাদের একজন প্রতিনিধি এখানে চ্যাটে আপনার সাথে যোগাযোগ করবেন। অনুগ্রহ করে অপেক্ষা করুন।`
                });
              }, 500);

              // Auto-comment message if available after a slightly longer delay (1000ms)
              if (autoComment) {
                setTimeout(() => {
                  socketRef.current.emit('send_message', {
                    phone: currentUser.phone,
                    premiumCode: currentUser.premiumCode,
                    sender: 'bot-auto-comment',
                    senderName: 'System',
                    text: autoComment
                  });
                }, 1000);
              }
            } catch (err) {
              console.error('Error saving tuition apply in database during chat flow:', err);
              // Remove temporary loading message
              setMessages(prev => prev.filter(m => m._id !== tempId));
              // Fallback to sending standard message if API fails
              socketRef.current.emit('send_message', {
                phone: currentUser.phone,
                premiumCode: currentUser.premiumCode,
                sender: 'member',
                senderName: currentUser.name,
                text: applyMsg
              });
            }
          } else {
            setInput(applyMsg);
          }
        }, 800);
      } else {
        setInput(applyMsg);
      }
    };

    window.addEventListener('openChatWidget', handleOpenChat);
    return () => window.removeEventListener('openChatWidget', handleOpenChat);
  }, [user]);

  useEffect(() => {
    if (isOpen && !user) {
      try {
        const saved = localStorage.getItem('@user_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.phone && parsed.premiumCode) {
            setPhone(parsed.phone);
            setPremiumCode(parsed.premiumCode);
            // inline auto-verify helper
            (async () => {
              try {
                const res = await fetchWithFallback(`${BASE_URL}/api/regTeacher/check-apply-possible`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ phone: parsed.phone, premiumCode: parsed.premiumCode })
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
                  setUser(verifiedUser);
                  
                  const histRes = await fetchWithFallback(`${BASE_URL}/api/chat/history/${verifiedUser.phone}?limit=20`);
                  const histData = await histRes.json();
                  if (histData.length === 0) {
                    setMessages([{ sender: 'bot', text: `Welcome, **${verifiedUser.name}**! 💬\n\nPlease type your message below a support representative will reply directly.` }]);
                  } else {
                    setMessages(histData);
                    setHasMore(histData.length === 20);
                  }
                }
              } catch (err) {
                console.error('Auto verify failed:', err);
              }
            })();
          }
        }
      } catch (err) {
        console.error('Error auto loading settings:', err);
      }
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (user && isOpen) {
      setShowTooltip(true);
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowTooltip(false);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (!user || !isOpen) return;

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
  }, [user, isOpen]);

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
        setUser(verifiedUser);
        
        // Load history (Initial load limit = 20)
        const histRes = await fetchWithFallback(`${BASE_URL}/api/chat/history/${verifiedUser.phone}?limit=20`);
        const histData = await histRes.json();
        
        if (histData.length === 0) {
          setMessages([
            {
              sender: 'bot',
              text: `Welcome, **${verifiedUser.name}**! 💬\n\nPlease type your message below a support representative will reply directly.`
            }
          ]);
        } else {
          setMessages(histData);
          setHasMore(histData.length === 20);
        }
      } else {
        setError(data.message || 'Verification failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to chat server failed.');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (messages.length === 0 || !user) return;
    const firstMsgTimestamp = messages[0].createdAt;
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
    <div className="ts-chat-widget-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      
      {/* WhatsApp Button and Label (Only visible when chat window is closed) */}
      {!isOpen && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a
            href="whatsapp://send?phone=+8801571305804"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            title="Chat with us on WhatsApp"
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: '#25D366',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              color: 'white',
              flexShrink: 0,
              textDecoration: 'none',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
            }}
          >
            <BsWhatsapp size={20} />
          </a>
        </div>
      )}

      {/* Live Chat Button and Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
        {!isOpen && (
          <span className="ts-chat-label" onClick={() => setIsOpen(true)}>
            Live Chat
          </span>
        )}
        
        {/* Floating Toggle Button */}
        <button 
          className="ts-chat-widget-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Live Chat"
          title="Live Support Chat"
        >
          {isOpen ? <BsX size={22} /> : <BsChatDotsFill size={18} />}
        </button>

        {/* Chat Window */}
        {isOpen && (
          <div className="ts-chat-widget-window">
            {!user ? (
              <div className="ts-chat-screen ts-verify-screen">
                <button className="ts-verify-close-btn" onClick={() => setIsOpen(false)} aria-label="Close">
                  <BsX size={24} />
                </button>
                <div className="ts-verify-header">
                  <div className="ts-verify-badge">TSF Chat System</div>
                  <h3>সরাসরি লাইভ চ্যাট</h3>
                  <p>ফোন নম্বর ও প্রিমিয়াম কোড দিয়ে ভেরিফাই করে সরাসরি আমাদের সাপোর্ট এজেন্টের সাথে চ্যাট শুরু করুন।</p>
                </div>
                
                <form onSubmit={handleVerify} className="ts-verify-form">
                  <div className="ts-form-group">
                    <label>Phone Number</label>
                    <div className="ts-input-wrapper">
                      <BsTelephone className="ts-input-icon" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 01711223344"
                        required
                      />
                    </div>
                  </div>
                  <div className="ts-form-group">
                    <label>Premium Code</label>
                    <div className="ts-input-wrapper">
                      <BsKey className="ts-input-icon" />
                      <input
                        type="text"
                        value={premiumCode}
                        onChange={(e) => setPremiumCode(e.target.value)}
                        placeholder="e.g. PREM-9021"
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="ts-verify-btn" disabled={loading}>
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <>Verify & Join <BsArrowRightShort size={20} /></>
                    )}
                  </button>
                  {error && <div className="ts-error-msg">{error}</div>}
                </form>
              </div>
            ) : (
              <div className="ts-chat-screen ts-chat-active-screen">
                <div className="ts-chat-header">
                  <BsRobot size={22} className="ts-header-avatar" />
                  <div className="ts-header-info">
                    <h4>{user.name}</h4>
                    <div className="ts-online-status">
                      <BsCircleFill className={`ts-status-dot ${agentOnline ? 'online' : 'bot'}`} size={8} />
                      <span>{agentOnline ? 'Agent Online' : 'Bot Active'}</span>
                    </div>
                  </div>
                  <button className="ts-active-close-btn" onClick={() => setIsOpen(false)} aria-label="Close">
                    <BsX size={24} />
                  </button>
                </div>
                
                <div ref={feedRef} className="ts-messages-container" onScroll={handleScroll}>
                  {hasMore && (
                    <button 
                      onClick={loadMoreMessages} 
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#0066cc',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        padding: '4px 0',
                        display: 'block',
                        margin: '0 auto 8px auto',
                        fontWeight: '600',
                        textDecoration: 'underline'
                      }}
                    >
                      Load previous messages
                    </button>
                  )}
                  {messages.filter(msg => !msg.isUnsent).map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.sender === 'member' ? 'flex-end' : 'flex-start',
                        width: '100%'
                      }}
                    >
                      <div 
                        className={`ts-message ${msg.sender}`}
                        style={msg.sender === 'bot-auto-comment' ? {
                          backgroundColor: '#fff8e1',
                          border: '1px solid #ffecb3',
                          color: '#795548',
                          borderRadius: '12px',
                          padding: '10px 14px',
                          margin: '4px 0',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          maxWidth: '90%'
                        } : {}}
                      >
                        {renderMessageText(msg.text)}
                      </div>
                      <small
                        style={{
                          fontSize: '0.65rem',
                          color: '#888',
                          marginTop: '2px',
                          marginBottom: '6px',
                          padding: '0 4px',
                          alignSelf: msg.sender === 'member' ? 'flex-end' : 'flex-start'
                        }}
                      >
                        {formatDateTime(msg.createdAt)}{msg.sender === 'member' && !msg.isRead && ' • Unseen'}
                      </small>
                    </div>
                  ))}
                  {agentTyping && (
                    <div className="ts-typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  )}
                </div>
                
                {showScrollBottom && (
                  <button className="ts-scroll-bottom-btn" onClick={scrollToBottom} aria-label="Scroll to bottom">
                    <BsArrowDownShort size={20} />
                  </button>
                )}
                
                {/* Suggestions Panel */}
                {!input.trim() && (
                  <div className="ts-widget-suggestions">
                    <button
                      onClick={() => {
                        const now = new Date().toISOString();
                        setMessages(prev => [...prev, { sender: 'member', text: 'আমার সর্বশেষ সিভি দেখতে চাই', createdAt: now }]);
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
                      className="ts-widget-suggestion-btn"
                      style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderColor: '#dbeafe', color: '#1d4ed8' }}
                    >
                      সিভি দেখতে চাই
                    </button>
                    <button
                      onClick={() => {
                        const now = new Date().toISOString();
                        setMessages(prev => [...prev, { sender: 'member', text: 'আমার অ্যাপ্লাইগুলোর কি অবস্থা?', createdAt: now }]);
                        setTimeout(() => {
                          const updateText = `📢 **আপনার অ্যাপ্লাই করা টিউশনগুলোর আপডেট**\n\nআপনার অ্যাপ্লাই করা টিউশনগুলোর সর্বশেষ অবস্থা জানতে নিচের লিংকে ক্লিক করুন:\n\n🔗 **https://www.tuitionsebaforum.com/apply-updates**\n\nউক্ত পেজে আপনার ফোন নম্বর ও প্রিমিয়াম কোড দিয়ে লগইন করলে আপনার সকল অ্যাপ্লাই এর বর্তমান স্ট্যাটাস দেখতে পারবেন।`;
                          setMessages(prev => [...prev, { sender: 'bot', text: updateText, createdAt: new Date().toISOString() }]);
                        }, 500);
                      }}
                      className="ts-widget-suggestion-btn"
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
                      className="ts-widget-suggestion-btn"
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
                      className="ts-widget-suggestion-btn"
                      style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', borderColor: '#ffe4e6', color: '#e11d48' }}
                    >
                      রিফান্ড
                    </button>
                  </div>
                )}

                <div className="ts-input-area">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a message..."
                  />
                  <button className="ts-send-btn" onClick={handleSend}>
                    <BsSendFill size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
