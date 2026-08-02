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
        console.error('Error loading saved settings in ChatWidget:', err);
      }
    }
  }, [isOpen]);

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

  const renderTextWithLinks = (text) => {
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
              return <strong key={pIdx}>{renderTextWithLinks(part)}</strong>;
            }
            const subParts = part.split('*');
            return subParts.map((subPart, sIdx) => {
              if (sIdx % 2 === 1) {
                return <em key={sIdx}>{renderTextWithLinks(subPart)}</em>;
              }
              return renderTextWithLinks(subPart);
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
                  <h3>Live Support</h3>
                  <p>Connect with Tuition Seba agents in real time.</p>
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
                      <div className={`ts-message ${msg.sender}`}>
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
                {showSuggestions && (
                  <div className="ts-widget-suggestions">
                    <button
                      onClick={() => {
                        setShowSuggestions(false);
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
                            td.status ? `**স্ট্যাটাস**: ${td.status}` : null,
                          ].filter(Boolean).join('\n');
                          setMessages(prev => [...prev, { sender: 'bot', text: cvText, createdAt: new Date().toISOString() }]);
                        }, 500);
                      }}
                      className="ts-widget-suggestion-btn"
                    >
                      <BsFileEarmarkPerson size={13} /> আমার সর্বশেষ সিভি দেখতে চাই
                    </button>
                    <button
                      onClick={() => {
                        setShowSuggestions(false);
                        const now = new Date().toISOString();
                        setMessages(prev => [...prev, { sender: 'member', text: 'আমার অ্যাপ্লাইগুলোর কি অবস্থা?', createdAt: now }]);
                        setTimeout(() => {
                          const updateText = `📢 **আপনার অ্যাপ্লাই করা টিউশনগুলোর আপডেট**\n\nআপনার অ্যাপ্লাই করা টিউশনগুলোর সর্বশেষ অবস্থা জানতে নিচের লিংকে ক্লিক করুন:\n\n🔗 **https://www.tuitionsebaforum.com/apply-updates**\n\nউক্ত পেজে আপনার ফোন নম্বর ও প্রিমিয়াম কোড দিয়ে লগইন করলে আপনার সকল অ্যাপ্লাই এর বর্তমান স্ট্যাটাস দেখতে পারবেন।`;
                          setMessages(prev => [...prev, { sender: 'bot', text: updateText, createdAt: new Date().toISOString() }]);
                        }, 500);
                      }}
                      className="ts-widget-suggestion-btn"
                    >
                      <BsBoxArrowUpRight size={12} /> আমার অ্যাপ্লাইগুলোর কি অবস্থা
                    </button>
                  </div>
                )}

                <div className="ts-input-area">
                  <button
                    onClick={() => setShowSuggestions(prev => !prev)}
                    className="ts-widget-bulb-btn"
                    style={{ opacity: showSuggestions ? 1 : 0.55 }}
                    title="সাজেশন দেখুন"
                  >
                    <BsLightbulb size={18} />
                  </button>
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
