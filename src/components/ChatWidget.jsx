import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { BsChatDotsFill, BsX, BsArrowRightShort, BsTelephone, BsKey, BsSendFill, BsRobot, BsCircleFill, BsWhatsapp } from 'react-icons/bs';
import './ChatWidget.css';

const BASE_URL = window.location.origin.includes('localhost')
  ? 'http://localhost:5001'
  : 'https://tuition-seba-backend-1.onrender.com';

let socket;

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

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
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
  }, [user, isOpen]);

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
        
        // Load history
        const histRes = await fetch(`${BASE_URL}/api/chat/history/${verifiedUser.phone}`);
        const histData = await histRes.json();
        
        if (histData.length === 0) {
          setMessages([
            {
              sender: 'bot',
              text: `Welcome, **${verifiedUser.name}**! 🤖\nHow can we assist you? Please choose one of the options below:\n\n1. **Payment**\n2. **Status**\n3. **Agent**`
            }
          ]);
        } else {
          setMessages(histData);
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
                </div>
                
                <div className="ts-messages-container">
                  {messages.map((msg, i) => (
                    <div key={i} className={`ts-message ${msg.sender}`}>
                      {renderMessageText(msg.text)}
                    </div>
                  ))}
                  {agentTyping && (
                    <div className="ts-typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
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
