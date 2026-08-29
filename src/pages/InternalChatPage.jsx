import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Container, Row, Col, Form, Button, Badge, Modal, Spinner } from 'react-bootstrap';
import { BsChatSquareDotsFill, BsPeopleFill, BsSendFill, BsPlusCircleFill, BsSearch, BsThreeDotsVertical, BsTrash, BsPersonCircle } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import NavBarPage from './NavbarPage';

const BASE_URL = 'https://tuition-seba-backend-1.onrender.com';

const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });
};

const AVATAR_COLORS = [
    '#0d6efd', '#6f42c1', '#d63384', '#fd7e14', '#198754',
    '#0dcaf0', '#6610f2', '#20c997', '#dc3545', '#ffc107',
];
const getAvatarColor = (name = '') => {
    let hash = 0;
    for (let c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const Avatar = ({ name, size = 36, online }) => (
    <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: getAvatarColor(name),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700,
            fontSize: size < 32 ? 11 : 14,
        }}>
            {getInitials(name)}
        </div>
        {online !== undefined && (
            <span style={{
                position: 'absolute', bottom: 1, right: 1,
                width: 9, height: 9, borderRadius: '50%',
                background: online ? '#198754' : '#adb5bd',
                border: '2px solid #fff',
            }} />
        )}
    </div>
);

// ── Task Card Component ───────────────────────────────────────────────────────
const TASK_STATUS_CONFIG = {
    pending:   { accent: '#f59e0b', pillBg: '#fef3c7', pillText: '#92400e', label: '⏳ Pending',   dotColor: '#f59e0b' },
    in_review: { accent: '#3b82f6', pillBg: '#dbeafe', pillText: '#1e3a8a', label: '🔄 In Review', dotColor: '#3b82f6' },
    done:      { accent: '#10b981', pillBg: '#d1fae5', pillText: '#065f46', label: '✅ Done',       dotColor: '#10b981' },
};

const TaskCard = ({ msg, users, username, role, onUpdateStatus }) => {
    const sc = TASK_STATUS_CONFIG[msg.taskStatus] || TASK_STATUS_CONFIG.pending;
    const assignee = users.find(u => u.username === msg.taskAssignedTo);
    const assigneeName = assignee?.name || msg.taskAssignedTo || '';
    const assigneeInitials = assigneeName
        ? assigneeName.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '??';
    const canUpdate = (msg.taskAssignedTo === username || role === 'superadmin') && !msg.isUnsent;

    return (
        <div style={{
            background: '#fff',
            borderRadius: 12,
            minWidth: 250,
            maxWidth: 300,
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            overflow: 'hidden',
            border: '1px solid #f1f5f9',
        }}>
            {/* Colored top bar */}
            <div style={{ height: 4, background: sc.accent, borderRadius: '12px 12px 0 0' }} />

            <div style={{ padding: '12px 14px 14px' }}>
                {/* Header row: TASK label + status pill */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{
                        fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                        letterSpacing: 1.2, color: sc.accent,
                    }}>
                        📋 Task
                    </span>
                    <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 10px',
                        borderRadius: 20, background: sc.pillBg, color: sc.pillText,
                    }}>
                        {sc.label}
                    </span>
                </div>

                {/* Title */}
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: msg.taskDescription ? 5 : 10, lineHeight: 1.35 }}>
                    {msg.taskTitle}
                </div>

                {/* Description */}
                {msg.taskDescription && (
                    <div style={{
                        fontSize: 12, color: '#64748b', lineHeight: 1.5,
                        marginBottom: 10, paddingBottom: 10,
                        borderBottom: '1px solid #f1f5f9',
                    }}>
                        {msg.taskDescription}
                    </div>
                )}

                {/* Assignee row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: msg.taskDueDate ? 6 : 0 }}>
                    <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: sc.accent, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 800, flexShrink: 0,
                    }}>
                        {assigneeInitials}
                    </div>
                    <div>
                        <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1 }}>Assigned to</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', lineHeight: 1.4 }}>{assigneeName}</div>
                    </div>
                </div>

                {/* Due date */}
                {msg.taskDueDate && (
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, marginBottom: 2 }}>
                        📅 Due {new Date(msg.taskDueDate).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                )}

                {/* Action buttons */}
                {canUpdate && msg.taskStatus !== 'done' && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                        {msg.taskStatus === 'pending' && (
                            <button
                                onClick={() => onUpdateStatus(msg._id, 'in_review')}
                                style={{
                                    flex: 1, fontSize: 11, fontWeight: 700, padding: '7px 0',
                                    borderRadius: 8, cursor: 'pointer',
                                    border: 'none', background: '#dbeafe', color: '#1e40af',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#bfdbfe'}
                                onMouseLeave={e => e.currentTarget.style.background = '#dbeafe'}
                            >
                                🔄 In Review
                            </button>
                        )}
                        <button
                            onClick={() => onUpdateStatus(msg._id, 'done')}
                            style={{
                                flex: 1, fontSize: 11, fontWeight: 700, padding: '7px 0',
                                borderRadius: 8, cursor: 'pointer',
                                border: 'none', background: '#10b981', color: '#fff',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                            onMouseLeave={e => e.currentTarget.style.background = '#10b981'}
                        >
                            ✅ Mark Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


export default function InternalChatPage() {
    const username = localStorage.getItem('username') || '';
    const role = localStorage.getItem('role') || '';
    const token = localStorage.getItem('token') || '';

    // Helper: auth + username headers for every internal-chat request
    const authHeaders = () => ({
        Authorization: token,
        'x-user-name': username,
    });

    // Lock page scroll so only internal panes scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimerRef = useRef(null);
    const inputRef = useRef(null);

    const [myName, setMyName] = useState(username);
    const [users, setUsers] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [text, setText] = useState('');
    const [search, setSearch] = useState('');
    const [typingInfo, setTypingInfo] = useState({});
    const [contextMenu, setContextMenu] = useState(null);
    const [unreadSummary, setUnreadSummary] = useState({});

    // Group modal
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
    const [creatingGroup, setCreatingGroup] = useState(false);

    // Manage modal
    const [showManageModal, setShowManageModal] = useState(null);
    const [deletingGroup, setDeletingGroup] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Task modal
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskAssignedTo, setTaskAssignedTo] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');

    // ── Socket ────────────────────────────────────────────────────────────────
    useEffect(() => {
        const socket = io(BASE_URL);
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join_internal_room', { username });
        });

        socket.on('receive_internal_message', (msg) => {
            setMessages(prev => {
                if (prev.find(m => m._id === msg._id)) return prev;
                return [...prev, msg];
            });
        });

        // Real-time task status update — patch taskStatus on the message in place
        socket.on('internal_task_status_updated', ({ messageId, status }) => {
            setMessages(prev => prev.map(m => m._id === messageId ? { ...m, taskStatus: status } : m));
        });

        socket.on('internal_conversation_updated', (updated) => {
            if (!updated.participants?.includes(username)) {
                setConversations(prev => prev.filter(c => c._id !== updated._id));
                setActiveConv(prev => prev?._id === updated._id ? null : prev);
                return;
            }
            setConversations(prev => {
                const idx = prev.findIndex(c => c._id === updated._id);
                const next = idx === -1 ? [...prev, updated] : prev.map((c, i) => i === idx ? updated : c);
                return next.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
            });
            const myCount = updated.unreadCounts?.[username] || 0;
            setUnreadSummary(prev => ({ ...prev, [updated._id]: myCount }));
        });

        socket.on('internal_conversation_created', (conv) => {
            if (conv.participants?.includes(username)) {
                setConversations(prev => prev.find(c => c._id === conv._id) ? prev : [conv, ...prev]);
            }
        });

        socket.on('internal_conversation_deleted', ({ conversationId }) => {
            setConversations(prev => prev.filter(c => c._id !== conversationId));
            setActiveConv(prev => prev?._id === conversationId ? null : prev);
        });

        socket.on('internal_display_typing', ({ conversationId, senderId, senderName, isTyping }) => {
            if (senderId === username) return;
            setTypingInfo(prev => ({ ...prev, [conversationId]: isTyping ? { senderName } : null }));
        });

        socket.on('internal_message_unsent', ({ messageId }) => {
            setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isUnsent: true } : m));
        });

        return () => socket.disconnect();
    }, [username]);

    // ── Initial data ──────────────────────────────────────────────────────────
    useEffect(() => {
        fetchUsers();
        fetchConversations();
        fetchUnreadSummary();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/internal-chat/users`, { headers: authHeaders() });
            setUsers(res.data);
            const me = res.data.find(u => u.username === username);
            if (me) setMyName(me.name);
        } catch { }
    };

    const fetchConversations = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/internal-chat/conversations`, { headers: authHeaders() });
            setConversations(res.data);
        } catch { }
    };

    const fetchUnreadSummary = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/internal-chat/unread-summary`, { headers: authHeaders() });
            setUnreadSummary(res.data.perConversation || {});
        } catch { }
    };

    // ── Select conversation ───────────────────────────────────────────────────
    const selectConversation = async (conv) => {
        setActiveConv(conv);
        setMessages([]);
        setHasMore(false);
        try {
            const res = await axios.get(`${BASE_URL}/api/internal-chat/messages/${conv._id}?limit=30`, { headers: authHeaders() });
            setMessages(res.data);
            setHasMore(res.data.length === 30);
        } catch { }
        try {
            await axios.post(`${BASE_URL}/api/internal-chat/read/${conv._id}`, {}, { headers: authHeaders() });
            setUnreadSummary(prev => ({ ...prev, [conv._id]: 0 }));
        } catch { }
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    // ── Start DM ──────────────────────────────────────────────────────────────
    const startDm = async (targetUsername) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/internal-chat/conversations/dm`, { targetUsername }, { headers: authHeaders() });
            const conv = res.data;
            setConversations(prev => prev.find(c => c._id === conv._id) ? prev : [conv, ...prev]);
            selectConversation(conv);
        } catch { toast.error('Could not start conversation'); }
    };

    // ── Load more ─────────────────────────────────────────────────────────────
    const loadMore = async () => {
        if (!activeConv || loadingMore || !hasMore) return;
        setLoadingMore(true);
        try {
            const oldest = messages[0]?.createdAt;
            const res = await axios.get(`${BASE_URL}/api/internal-chat/messages/${activeConv._id}?limit=30&before=${oldest}`, { headers: authHeaders() });
            setMessages(prev => [...res.data, ...prev]);
            setHasMore(res.data.length === 30);
        } catch { }
        setLoadingMore(false);
    };

    // ── Send ──────────────────────────────────────────────────────────────────
    const sendMessage = () => {
        const trimmed = text.trim();
        if (!trimmed || !activeConv) return;
        socketRef.current?.emit('send_internal_message', {
            conversationId: activeConv._id,
            senderId: username,
            senderName: myName,
            text: trimmed,
        });
        setText('');
        clearTimeout(typingTimerRef.current);
        socketRef.current?.emit('internal_typing', {
            conversationId: activeConv._id,
            senderId: username,
            senderName: myName,
            isTyping: false,
            participants: activeConv.participants,
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
        if (!activeConv) return;
        socketRef.current?.emit('internal_typing', {
            conversationId: activeConv._id,
            senderId: username,
            senderName: myName,
            isTyping: true,
            participants: activeConv.participants,
        });
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
            socketRef.current?.emit('internal_typing', {
                conversationId: activeConv._id,
                senderId: username,
                senderName: myName,
                isTyping: false,
                participants: activeConv.participants,
            });
        }, 2000);
    };

    // ── Unsend ────────────────────────────────────────────────────────────────
    const unsendMessage = async (messageId) => {
        try {
            await axios.patch(`${BASE_URL}/api/internal-chat/message/${messageId}/unsend`, {}, { headers: authHeaders() });
        } catch { toast.error('Could not unsend'); }
        setContextMenu(null);
    };

    // ── Create group ──────────────────────────────────────────────────────────
    const createGroup = async () => {
        if (!groupName.trim()) { toast.error('Group name required'); return; }
        if (selectedGroupMembers.length < 1) { toast.error('Select at least 1 member'); return; }
        setCreatingGroup(true);
        try {
            await axios.post(`${BASE_URL}/api/internal-chat/conversations/group`, {
                name: groupName.trim(),
                participants: selectedGroupMembers,
            }, { headers: authHeaders() });
            setShowGroupModal(false);
            setGroupName('');
            setSelectedGroupMembers([]);
            fetchConversations();
            toast.success('Group created!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create group');
        }
        setCreatingGroup(false);
    };

    const deleteGroup = async (convId) => {
        setDeletingGroup(true);
        try {
            await axios.delete(`${BASE_URL}/api/internal-chat/conversations/${convId}`, { headers: authHeaders() });
            setShowManageModal(null);
            setShowDeleteConfirm(false);
            toast.success('Group deleted');
        } catch { toast.error('Failed to delete group'); }
        setDeletingGroup(false);
    };

    const removeParticipant = async (participantUsername) => {
        if (!showManageModal) return;
        const updatedParticipants = showManageModal.participants.filter(p => p !== participantUsername);
        try {
            const res = await axios.patch(
                `${BASE_URL}/api/internal-chat/conversations/${showManageModal._id}/participants`,
                { participants: updatedParticipants },
                { headers: authHeaders() }
            );
            setShowManageModal(res.data);
            if (activeConv?._id === res.data._id) {
                setActiveConv(res.data);
            }
            toast.success(`Removed ${participantUsername} from group`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove member');
        }
    };

    // ── Assign Task ───────────────────────────────────────────────────────────
    const assignTask = () => {
        if (!taskTitle.trim()) { toast.error('Task title is required'); return; }
        if (!taskAssignedTo) { toast.error('Please select an employee to assign'); return; }
        // Send task through the existing socket message pipeline — same as a regular message
        socketRef.current?.emit('send_internal_message', {
            conversationId: activeConv._id,
            senderId: username,
            senderName: myName,
            type: 'task',
            taskData: {
                title: taskTitle.trim(),
                description: taskDesc.trim(),
                assignedTo: taskAssignedTo,
                dueDate: taskDueDate || null,
            },
        });
        setShowTaskModal(false);
        setTaskTitle(''); setTaskDesc(''); setTaskAssignedTo(''); setTaskDueDate('');
        toast.success('Task assigned!');
    };

    // ── Update Task Status ────────────────────────────────────────────────────
    const updateTaskStatus = async (taskId, status) => {
        try {
            await axios.patch(`${BASE_URL}/api/internal-chat/messages/${taskId}/task-status`, { status }, { headers: authHeaders() });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update task');
        }
    };

    // ── Auto-scroll ───────────────────────────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const getConvDisplayName = (conv) => {
        if (!conv) return '';
        if (conv.type === 'group') return conv.name;
        const other = conv.participants.find(p => p !== username);
        const u = users.find(u => u.username === other);
        return u ? u.name : other;
    };

    const getConvSubtitle = (conv) => {
        if (!conv) return '';
        if (conv.type === 'group') {
            return `${conv.participants.length} members`;
        }
        const other = conv.participants.find(p => p !== username);
        const u = users.find(u => u.username === other);
        return u ? u.role : other;
    };

    const filteredConvs = conversations.filter(c =>
        getConvDisplayName(c).toLowerCase().includes(search.toLowerCase())
    );
    const filteredUsers = users.filter(u =>
        u.username !== username &&
        // Admin cannot see locked users; superadmin sees everyone
        (role === 'superadmin' || !u.isLocked) &&
        (u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()))
    );

    const totalUnread = Object.values(unreadSummary).reduce((a, b) => a + b, 0);

    // group messages by date
    const groupedMessages = [];
    let lastDate = '';
    for (const msg of messages) {
        const label = formatDateLabel(msg.createdAt);
        if (label !== lastDate) { groupedMessages.push({ type: 'date', label }); lastDate = label; }
        groupedMessages.push({ type: 'message', data: msg });
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            <NavBarPage />
            <ToastContainer position="top-right" autoClose={3000} />

            <Container fluid className="p-0" style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
                <Row className="g-0 flex-grow-1 overflow-hidden" style={{ background: '#ffffff', height: '100%' }}>

                    {/* ── SIDEBAR ── */}
                    <Col md={4} lg={3} className="d-flex flex-column border-end" style={{ background: '#f8f9fa', height: '100%', overflow: 'hidden' }}>

                        {/* Sidebar header */}
                        <div className="p-3 border-bottom bg-primary text-white d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <BsChatSquareDotsFill size={20} />
                                <h5 className="mb-0 fw-bold">Team Chat</h5>
                                {totalUnread > 0 && (
                                    <Badge bg="danger" pill style={{ fontSize: 10 }}>{totalUnread}</Badge>
                                )}
                            </div>
                            {role === 'superadmin' && (
                                <Button
                                    variant="light"
                                    size="sm"
                                    className="d-flex align-items-center gap-1 fw-bold"
                                    style={{ fontSize: 12 }}
                                    onClick={() => setShowGroupModal(true)}
                                >
                                    <BsPlusCircleFill size={13} /> Group
                                </Button>
                            )}
                        </div>

                        {/* Search */}
                        <div className="p-2 border-bottom bg-white">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text bg-white border-end-0">
                                    <BsSearch size={13} className="text-muted" />
                                </span>
                                <Form.Control
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="border-start-0 ps-0"
                                    style={{ boxShadow: 'none' }}
                                />
                            </div>
                        </div>

                        <div className="flex-grow-1" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                            {/* Conversations */}
                            {filteredConvs.length > 0 && (
                                <>
                                    <div className="px-3 pt-2 pb-1">
                                        <small className="text-muted fw-semibold text-uppercase" style={{ fontSize: 10, letterSpacing: 1 }}>
                                            Conversations
                                        </small>
                                    </div>
                                    {filteredConvs.map(conv => {
                                        const name = getConvDisplayName(conv);
                                        const unread = unreadSummary[conv._id] || 0;
                                        const isActive = activeConv?._id === conv._id;
                                        const isGroup = conv.type === 'group';
                                        return (
                                            <div
                                                key={conv._id}
                                                onClick={() => selectConversation(conv)}
                                                className={`d-flex align-items-center gap-2 px-3 py-2 cursor-pointer ${isActive ? 'bg-primary text-white' : 'hover-bg'}`}
                                                style={{ borderLeft: isActive ? '3px solid #fff' : '3px solid transparent', cursor: 'pointer' }}
                                            >
                                                <Avatar name={name} size={40} />
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <div className="d-flex align-items-center gap-1">
                                                        <span className="fw-semibold text-truncate" style={{ fontSize: 14, color: isActive ? '#fff' : '#212529' }}>
                                                            {name}
                                                        </span>
                                                        {isGroup && (
                                                            <Badge bg={isActive ? 'light' : 'secondary'} text={isActive ? 'primary' : undefined} style={{ fontSize: 9 }}>
                                                                Group
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-truncate" style={{ fontSize: 12, color: isActive ? 'rgba(255,255,255,0.75)' : '#6c757d', maxWidth: 160 }}>
                                                        {conv.lastMessage ? `${conv.lastSenderName}: ${conv.lastMessage}` : 'No messages yet'}
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column align-items-end gap-1">
                                                    {unread > 0 && <Badge bg="danger" pill style={{ fontSize: 10 }}>{unread > 99 ? '99+' : unread}</Badge>}
                                                    {isGroup && role === 'superadmin' && (
                                                        <span
                                                            onClick={e => { e.stopPropagation(); setShowManageModal(conv); }}
                                                            style={{ color: isActive ? '#fff' : '#6c757d', cursor: 'pointer' }}
                                                        >
                                                            <BsThreeDotsVertical size={14} />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}

                            {/* All employees */}
                            <div className="px-3 pt-3 pb-1">
                                <small className="text-muted fw-semibold text-uppercase" style={{ fontSize: 10, letterSpacing: 1 }}>
                                    <BsPeopleFill size={11} className="me-1" />All Employees
                                </small>
                            </div>
                            {filteredUsers.map(u => (
                                <div
                                    key={u._id}
                                    onClick={() => startDm(u.username)}
                                    className="d-flex align-items-center gap-2 px-3 py-2"
                                    style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#e9ecef'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Avatar name={u.name} size={34} />
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#212529' }}>{u.name}</div>
                                        <div style={{ fontSize: 11, color: '#6c757d', textTransform: 'capitalize' }}>{u.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Col>

                    {/* ── CHAT AREA ── */}
                    <Col className="d-flex flex-column" style={{ background: '#fff', height: '100%', overflow: 'hidden' }}>
                        {activeConv ? (
                            <>

                                {/* Chat header */}
                                <div className="p-3 border-bottom d-flex align-items-center gap-3 bg-white shadow-sm">
                                    <Avatar name={getConvDisplayName(activeConv)} size={44} />
                                    <div>
                                        <div className="fw-bold" style={{ fontSize: 16, color: '#212529' }}>
                                            {getConvDisplayName(activeConv)}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#6c757d', textTransform: 'capitalize' }}>
                                            {getConvSubtitle(activeConv)}
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-grow-1 p-3" style={{ background: '#f8f9fa', overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
                                    {hasMore && (
                                        <div className="text-center mb-2">
                                            <Button variant="outline-secondary" size="sm" onClick={loadMore} disabled={loadingMore}>
                                                {loadingMore ? <Spinner size="sm" /> : '↑ Load older messages'}
                                            </Button>
                                        </div>
                                    )}

                                    {groupedMessages.map((item, i) => {
                                        if (item.type === 'date') {
                                            return (
                                                <div key={`d-${i}`} className="text-center my-3">
                                                    <span className="badge bg-light text-secondary border" style={{ fontSize: 11 }}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        const msg = item.data;
                                        const isMine = msg.senderId === username;

                                        // ── Task card – renders in message flow (left/right aligned) ──
                                        if (msg.type === 'task') {
                                            return (
                                                <div key={msg._id || i} className={`d-flex mb-3 ${isMine ? 'justify-content-end' : 'justify-content-start'}`}>
                                                    {!isMine && (
                                                        <div className="me-2 align-self-end">
                                                            <Avatar name={msg.senderName} size={28} />
                                                        </div>
                                                    )}
                                                    <div style={{ maxWidth: '75%' }}>
                                                        {!isMine && activeConv.type === 'group' && (
                                                            <div style={{ fontSize: 11, color: '#6c757d', marginBottom: 2, marginLeft: 2 }}>
                                                                {msg.senderName}
                                                            </div>
                                                        )}
                                                        <TaskCard
                                                            msg={msg}
                                                            users={users}
                                                            username={username}
                                                            role={role}
                                                            onUpdateStatus={updateTaskStatus}
                                                        />
                                                        <div className={`mt-1 ${isMine ? 'text-end' : 'text-start'}`} style={{ fontSize: 10, color: '#adb5bd' }}>
                                                            {formatTime(msg.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        // ── Regular text message ──
                                        return (
                                            <div key={msg._id || i} className={`d-flex mb-2 ${isMine ? 'justify-content-end' : 'justify-content-start'}`}>
                                                {!isMine && (
                                                    <div className="me-2 align-self-end">
                                                        <Avatar name={msg.senderName} size={28} />
                                                    </div>
                                                )}
                                                <div style={{ maxWidth: '65%' }}>
                                                    {!isMine && activeConv.type === 'group' && (
                                                        <div style={{ fontSize: 11, color: '#6c757d', marginBottom: 2, marginLeft: 2 }}>
                                                            {msg.senderName}
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`px-3 py-2 rounded-3 ${isMine ? 'bg-primary text-white' : 'bg-white border text-dark'}`}
                                                        style={{
                                                            fontSize: 14, lineHeight: 1.5,
                                                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                                            cursor: isMine && !msg.isUnsent ? 'context-menu' : 'default',
                                                            borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                                        }}
                                                        onContextMenu={isMine && !msg.isUnsent ? (e) => {
                                                            e.preventDefault();
                                                            setContextMenu({ x: e.clientX, y: e.clientY, messageId: msg._id });
                                                        } : undefined}
                                                    >
                                                        {msg.isUnsent ? (
                                                            <span className="fst-italic" style={{ opacity: 0.6, fontSize: 13 }}>
                                                                🚫 Message deleted
                                                            </span>
                                                        ) : msg.text}
                                                    </div>
                                                    <div className={`mt-1 ${isMine ? 'text-end' : 'text-start'}`} style={{ fontSize: 10, color: '#adb5bd' }}>
                                                        {formatTime(msg.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {typingInfo[activeConv._id]?.senderName && (
                                        <div className="text-primary fst-italic" style={{ fontSize: 12, paddingLeft: 4 }}>
                                            {typingInfo[activeConv._id].senderName} is typing…
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-3 border-top bg-white d-flex align-items-end gap-2">
                                    {/* Assign Task button — superadmin only */}
                                    {role === 'superadmin' && (
                                        <Button
                                            variant="outline-warning"
                                            title="Assign a task"
                                            onClick={() => { setTaskAssignedTo(''); setShowTaskModal(true); }}
                                            style={{ borderRadius: '50%', width: 42, height: 42, padding: 0, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            📋
                                        </Button>
                                    )}
                                    <Form.Control
                                        ref={inputRef}
                                        as="textarea"
                                        rows={1}
                                        placeholder="Write a message… (Enter to send)"
                                        value={text}
                                        onChange={handleTextChange}
                                        onKeyDown={handleKeyDown}
                                        style={{ resize: 'none', borderRadius: 20, paddingLeft: 16, boxShadow: 'none', maxHeight: 100 }}
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={sendMessage}
                                        disabled={!text.trim()}
                                        style={{ borderRadius: '50%', width: 42, height: 42, padding: 0, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <BsSendFill size={16} />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 text-muted" style={{ minHeight: 0 }}>
                                <FiUsers size={56} className="mb-3 text-secondary opacity-25" />
                                <h5 className="fw-bold text-secondary">Team Chat</h5>
                                <p className="text-center" style={{ maxWidth: 260, fontSize: 14 }}>
                                    Select a conversation or click on an employee name to start a DM.
                                </p>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>

            {/* ── Context menu ── */}
            {contextMenu && (
                <div
                    style={{
                        position: 'fixed', top: contextMenu.y, left: contextMenu.x,
                        background: '#fff', border: '1px solid #dee2e6',
                        borderRadius: 8, padding: '4px 0', zIndex: 99999,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)', minWidth: 150,
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <div
                        className="d-flex align-items-center gap-2 px-3 py-2 text-danger"
                        style={{ cursor: 'pointer', fontSize: 13 }}
                        onClick={() => unsendMessage(contextMenu.messageId)}
                        onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <BsTrash size={13} /> Unsend Message
                    </div>
                </div>
            )}

            {/* ── Assign Task Modal ── */}
            <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)} centered>
                <Modal.Header closeButton className="bg-warning text-dark">
                    <Modal.Title style={{ fontSize: 17 }}>
                        📋 Assign Task
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Task Title <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            placeholder="e.g. Follow up with guardian"
                            value={taskTitle}
                            onChange={e => setTaskTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Description <span className="text-muted fw-normal">(optional)</span></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Add details..."
                            value={taskDesc}
                            onChange={e => setTaskDesc(e.target.value)}
                            style={{ resize: 'none' }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Assign To <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                            value={taskAssignedTo}
                            onChange={e => setTaskAssignedTo(e.target.value)}
                        >
                            <option value="">— Select employee —</option>
                            {activeConv?.participants
                                .filter(p => p !== username)
                                .map(p => {
                                    const u = users.find(u => u.username === p);
                                    return (
                                        <option key={p} value={p}>
                                            {u ? `${u.name} (${u.role})` : p}
                                        </option>
                                    );
                                })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label className="fw-semibold">Due Date <span className="text-muted fw-normal">(optional)</span></Form.Label>
                        <Form.Control
                            type="date"
                            value={taskDueDate}
                            onChange={e => setTaskDueDate(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTaskModal(false)}>Cancel</Button>
                    <Button variant="warning" onClick={assignTask}>
                        📋 Assign Task
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ── Create Group Modal ── */}

            <Modal show={showGroupModal} onHide={() => setShowGroupModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title style={{ fontSize: 18 }}>
                        <BsPlusCircleFill className="me-2" />New Group Chat
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Group Name</Form.Label>
                        <Form.Control
                            placeholder="Enter group name..."
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Label className="fw-semibold">Select Members</Form.Label>
                    <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: 8 }}>
                        {users.filter(u => u.username !== username).map(u => {
                            const sel = selectedGroupMembers.includes(u.username);
                            return (
                                <div
                                    key={u._id}
                                    onClick={() => setSelectedGroupMembers(prev =>
                                        sel ? prev.filter(p => p !== u.username) : [...prev, u.username]
                                    )}
                                    className={`d-flex align-items-center gap-2 p-2 ${sel ? 'bg-primary bg-opacity-10' : ''}`}
                                    style={{ cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}
                                >
                                    <Avatar name={u.name} size={30} />
                                    <div className="flex-grow-1">
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                                        <div style={{ fontSize: 11, color: '#6c757d', textTransform: 'capitalize' }}>{u.role}</div>
                                    </div>
                                    {sel && <Badge bg="primary" style={{ fontSize: 10 }}>✓</Badge>}
                                </div>
                            );
                        })}
                    </div>
                    {selectedGroupMembers.length > 0 && (
                        <div className="mt-2">
                            <small className="text-muted">{selectedGroupMembers.length} member(s) selected</small>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowGroupModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={createGroup} disabled={creatingGroup}>
                        {creatingGroup ? <Spinner size="sm" className="me-1" /> : null}
                        Create Group
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ── Manage Group Modal ── */}
            <Modal show={!!showManageModal} onHide={() => { setShowManageModal(null); setShowDeleteConfirm(false); }} centered>
                <Modal.Header closeButton className="border-bottom">
                    <Modal.Title style={{ fontSize: 17 }}>
                        <BsPeopleFill className="me-2 text-primary" />
                        {showManageModal?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="fw-semibold mb-2 text-muted" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Members ({showManageModal?.participants?.length})
                    </p>
                    <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                        {showManageModal?.participants?.map(p => {
                            const u = users.find(u => u.username === p);
                            return (
                                <div key={p} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                                    <div className="d-flex align-items-center gap-2">
                                        <Avatar name={u?.name || p} size={30} />
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600 }}>{u?.name || p}</div>
                                            <div style={{ fontSize: 11, color: '#6c757d', textTransform: 'capitalize' }}>{u?.role}</div>
                                        </div>
                                    </div>
                                    {role === 'superadmin' && p !== username && (
                                        <Button
                                            variant="link"
                                            className="text-danger p-0 text-decoration-none"
                                            style={{ fontSize: 12, fontWeight: 600 }}
                                            onClick={() => removeParticipant(p)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Inline delete confirmation */}
                    {showDeleteConfirm && (
                        <div className="mt-3 p-3 rounded-3 border border-danger bg-danger bg-opacity-10">
                            <div className="fw-semibold text-danger mb-1" style={{ fontSize: 14 }}>
                                ⚠️ Delete this group?
                            </div>
                            <div style={{ fontSize: 12, color: '#6c757d', marginBottom: 10 }}>
                                This will permanently delete the group and all its messages. This action cannot be undone.
                            </div>
                            <div className="d-flex gap-2">
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => deleteGroup(showManageModal._id)}
                                    disabled={deletingGroup}
                                >
                                    {deletingGroup ? <Spinner size="sm" className="me-1" /> : <BsTrash className="me-1" />}
                                    Yes, Delete
                                </Button>
                                <Button variant="outline-secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowManageModal(null); setShowDeleteConfirm(false); }}>Close</Button>
                    {!showDeleteConfirm && (
                        <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                            <BsTrash className="me-1" /> Delete Group
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Close context menu on click */}
            {contextMenu && (
                <div
                    style={{ position: 'fixed', inset: 0, zIndex: 99998 }}
                    onClick={() => setContextMenu(null)}
                />
            )}
        </>
    );
}
