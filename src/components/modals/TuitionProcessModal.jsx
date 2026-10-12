import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Badge, Spinner, Card, Row, Col } from 'react-bootstrap';
import { 
    FaCheckCircle, FaClock, FaUser, FaCommentAlt, FaArrowRight, 
    FaTimesCircle, FaMoneyBillWave, FaPaperPlane, FaPhoneAlt, 
    FaChalkboardTeacher, FaHistory, FaShareAlt, FaRedo, FaExclamationTriangle,
    FaHourglassHalf
} from 'react-icons/fa';
import { axiosWithFallback as axios } from '../../services/fetchWithFallback';
import { toast } from 'react-toastify';
import CreatableSelect from 'react-select/creatable';

const CANCEL_REASONS = [
    'Guardian Found Teacher',
    'Guardian No Response',
    'No Suitable Teacher Available',
    'Salary Issue',
    'Location Issue',
    'Time/Day Issue',
    'Guardian Cancelled',
    'Student/Family Issue',
    'Tuition Temporarily Not Required',
    'Others'
];

export default function TuitionProcessModal({ show, onHide, tuition, onProcessUpdated, onCopyTuition }) {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [processData, setProcessData] = useState(null);

    // Form inputs for status transition
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedSubStatus, setSelectedSubStatus] = useState('');
    const [transitionComment, setTransitionComment] = useState('');
    const [tutorNumber, setTutorNumber] = useState('');
    const [cancelReason, setCancelReason] = useState(CANCEL_REASONS[0]);

    const fetchProcessData = async () => {
        if (!tuition?._id) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`https://tuition-seba-backend-1.onrender.com/api/tuition-process/${tuition._id}`, {
                headers: { Authorization: token }
            });
            setProcessData(res.data);
            setSelectedStatus(res.data.tuition?.status || 'available');
            setSelectedSubStatus(res.data.tuition?.subStatus || '');
            setTutorNumber(res.data.tuition?.tutorNumber || '');
        } catch (err) {
            console.error('Error fetching process data:', err);
            toast.error('Failed to load tuition process details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show && tuition?._id) {
            fetchProcessData();
            setTransitionComment('');
        }
    }, [show, tuition?._id]);

    // Auto-update sub-status options when main status changes
    const handleStatusSelect = (statusVal) => {
        setSelectedStatus(statusVal);
        if (statusVal === 'CV Sent') {
            setSelectedSubStatus('Call Guardian To check if liked any cv');
        } else if (statusVal === 'given number') {
            setSelectedSubStatus('given number');
        } else if (statusVal === 'demo class running') {
            setSelectedSubStatus('1st demo class');
        } else if (statusVal === 'available') {
            setSelectedSubStatus('');
        } else if (statusVal === 'confirm') {
            setSelectedSubStatus('confirmed');
        } else if (statusVal === 'request for payment') {
            setSelectedSubStatus('payment_requested');
        } else if (statusVal === 'payment completed') {
            setSelectedSubStatus('payment_complete');
        } else if (statusVal === 'guardian meet') {
            setSelectedSubStatus('guardian_meet');
        } else if (statusVal === 'refer BM') {
            setSelectedSubStatus('refer_bm');
        } else if (statusVal === 'suspended') {
            setSelectedSubStatus('suspended');
        } else if (statusVal === 'guardian no response') {
            setSelectedSubStatus('no_response');
        } else {
            setSelectedSubStatus('');
        }
    };

    const handleQuickAction = (statusVal, subStatusVal = '', defaultComment = '') => {
        setSelectedStatus(statusVal);
        setSelectedSubStatus(subStatusVal);
        if (defaultComment) setTransitionComment(defaultComment);
    };

    const handleSubmitTransition = async (e) => {
        e.preventDefault();
        if (!tuition?._id) return;

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                status: selectedStatus,
                subStatus: selectedSubStatus,
                comment: transitionComment,
                tutorNumber: tutorNumber || undefined,
                cancelReason: selectedStatus === 'cancel' ? cancelReason : undefined
            };

            const res = await axios.post(
                `https://tuition-seba-backend-1.onrender.com/api/tuition-process/status-change/${tuition._id}`,
                payload,
                { headers: { Authorization: token } }
            );

            toast.success('Status updated successfully & logged in history!');
            setTransitionComment('');
            if (onProcessUpdated) onProcessUpdated(res.data.tuition);
            fetchProcessData();
        } catch (err) {
            console.error('Error updating status transition:', err);
            toast.error(err.response?.data?.message || 'Failed to update process status');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getTimeDifference = (dateA, dateB) => {
        if (!dateA || !dateB) return '-';
        const tA = new Date(dateA).getTime();
        const tB = new Date(dateB).getTime();
        if (isNaN(tA) || isNaN(tB)) return '-';

        const diffMs = Math.abs(tA - tB);
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return '< 1m';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) {
            const remMins = diffMins % 60;
            return remMins > 0 ? `${diffHours}h ${remMins}m` : `${diffHours}h`;
        }
        const remHours = diffHours % 24;
        return remHours > 0 ? `${diffDays}d ${remHours}h` : `${diffDays}d`;
    };

    if (!tuition) return null;

    const currentStatus = (processData?.tuition?.status || tuition?.status || '').toLowerCase();
    const currentSubStatus = (processData?.tuition?.subStatus || tuition?.subStatus || '').toLowerCase();
    const applicantsCount = processData?.applicantsCount || 0;
    const isProposal = !!(processData?.tuition?.isProposal || tuition?.isProposal);
    const isPaymentCompleted = !!processData?.computedSummary?.isPaymentCompleted;
    const isPaymentPending = currentStatus === 'confirm' && !isPaymentCompleted;
    const isCancel = currentStatus === 'cancel';
    const latestHistory = processData?.history && processData.history.length > 0 ? processData.history[0] : null;

    const historyLogs = processData?.history || [];
    const applicantsList = processData?.applicants || [];
    const proposalLog = historyLogs.find(h => 
        h.subStatus?.toLowerCase()?.includes('proposal') || 
        h.newStatus?.toLowerCase()?.includes('proposal') || 
        h.comment?.toLowerCase()?.includes('proposal')
    ) || (tuition.isProposal ? { changedBy: tuition.updatedBy || tuition.createdBy || 'Staff', timestamp: tuition.updatedAt || tuition.createdAt } : null);

    const isProposalSent = !!(isProposal || proposalLog || tuition.isProposal);
    const isGuardianNegotiation = currentStatus === 'guardian negotiation' || currentSubStatus === 'guardian negotiation' || currentSubStatus.includes('negotiation');

    // Node state checkers for the handwritten flowchart
    const isNodeActive = (nodeKey) => {
        switch (nodeKey) {
            case 'available':
                return currentStatus === 'available' || currentStatus === 'given number' || currentStatus === 'demo class running' || currentStatus === 'confirm' || currentStatus === 'cv sent';
            case 'post':
                return tuition.isPublish || processData?.tuition?.lastPublishedDate;
            case 'not_apply':
                return applicantsCount === 0 && !isCancel && !isGuardianNegotiation && !currentSubStatus.includes('proposal');
            case 'proposal':
                return !isProposalSent && currentSubStatus.includes('proposal');
            case 'negotiation':
                return isGuardianNegotiation;
            case 'apply':
                return applicantsCount > 0;
            case 'cv_sent':
                return currentStatus === 'cv sent' || processData?.computedSummary?.isCvSent;
            case 'call_guardian':
                return currentSubStatus === 'call guardian to check if liked any cv' || currentStatus === 'cv sent';
            case 'given_number':
                return currentStatus === 'given number';
            case 'guardian_meet':
                return currentStatus === 'guardian meet' || currentStatus === 'demo class running' || currentStatus === '1st demo class' || currentStatus === '2nd demo class' || currentStatus === 'confirm';
            case 'demo':
                return currentStatus === 'demo class running' || currentStatus === '1st demo class' || currentStatus === '2nd demo class';
            case 'back_available':
                return !!backAvailLog && currentStatus === 'available';
            case 'confirmed':
                return currentStatus === 'confirm';
            case 'payment_pending':
                return isPaymentPending || currentStatus === 'request for payment' || currentStatus === 'payment pending';
            case 'payment_complete':
                return isPaymentCompleted || currentStatus === 'payment completed' || currentStatus === 'payment complete';
            case 'cancel':
                return isCancel;
            default:
                return false;
        }
    };

    const formatShortTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d)) return '';
        return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const cancelLog = historyLogs.find(h => h.newStatus?.toLowerCase() === 'cancel');
    const hadCancel = !!cancelLog || Boolean(processData?.tuition?.tuitionCancelReason || tuition?.tuitionCancelReason);
    const showCancel = isCancel || hadCancel;
    const cancelReasonText = processData?.tuition?.tuitionCancelReason || tuition?.tuitionCancelReason || cancelLog?.comment || '';
    const cancelUser = cancelLog?.changedBy || processData?.tuition?.updatedBy || tuition?.updatedBy;
    const cancelTime = cancelLog?.timestamp || processData?.tuition?.updatedAt || tuition?.updatedAt;

    // Step Event Log Finders (Who & When for each node)
    const initialAvailLog = [...historyLogs].reverse().find(h => h.newStatus?.toLowerCase() === 'available');
    const createMeta = {
        user: processData?.computedSummary?.createdBy || tuition.createdBy || 'System',
        timestamp: processData?.computedSummary?.createdAt || tuition.createdAt,
        comment: initialAvailLog?.comment || tuition.lastUpdateComment || tuition.agentComment || tuition.note || null
    };

    const postLog = historyLogs.find(h => h.newStatus === 'published' || h.subStatus === 'published') || 
        (tuition.isPublish ? { changedBy: tuition.createdBy || 'System', timestamp: tuition.lastPublishedDate || tuition.createdAt, comment: null } : null);

    const firstApp = applicantsList.length > 0 ? applicantsList[applicantsList.length - 1] : null;
    const applyMeta = firstApp ? { user: firstApp.name || 'Tutor', timestamp: firstApp.createdAt, comment: firstApp.coverLetter || firstApp.comment || null } : null;

    const cvSentLog = historyLogs.find(h => h.newStatus?.toLowerCase() === 'cv sent');
    const cvLikedLog = historyLogs.find(h => h.newStatus?.toLowerCase() === 'cv sent - check if liked' || h.subStatus?.toLowerCase() === 'call guardian to check if liked any cv');
    const givenNumberLog = historyLogs.find(h => h.newStatus?.toLowerCase() === 'given number' || h.newStatus?.toLowerCase() === 'contact shared' || h.subStatus?.toLowerCase()?.includes('given number'));
    const guardianMeetLog = historyLogs.find(h => h.newStatus?.toLowerCase() === 'guardian meet' || h.subStatus?.toLowerCase()?.includes('guardian_meet') || h.subStatus?.toLowerCase()?.includes('guardian meet'));
    const demo1Log = historyLogs.find(h => h.newStatus?.toLowerCase() === '1st demo class' || h.newStatus?.toLowerCase() === 'demo class running');
    const demo2Log = historyLogs.find(h => h.newStatus?.toLowerCase() === '2nd demo class');
    const confirmLog = historyLogs.find(h => h.newStatus?.toLowerCase() === 'confirm');
    const reqPayLog = historyLogs.find(h => h.newStatus?.toLowerCase() === 'request for payment');
    const paymentMeta = (processData?.paymentInfo?.paymentStatus?.toLowerCase() === 'paid' || processData?.computedSummary?.isPaymentCompleted) ? {
        user: 'Accounts',
        timestamp: processData?.paymentInfo?.paymentReceivedDate || processData?.tuition?.updatedAt,
        comment: processData?.paymentInfo?.note || 'Payment Received'
    } : null;
    const demoFailedLog = historyLogs.find(h => h.newStatus?.toLowerCase() === 'demo class failed');
    const backAvailLog = historyLogs.find(h => h.newStatus?.toLowerCase() === 'available' && (h.oldStatus?.toLowerCase()?.includes('demo') || h.oldStatus?.toLowerCase() === 'given number'));
    const negotiationLog = historyLogs.find(h => h.newStatus?.toLowerCase() === 'guardian negotiation' || h.subStatus?.toLowerCase()?.includes('negotiation'));

    // Time Passed (Gaps) Between Adjacent Steps
    const gap_avail_post = postLog ? getTimeDifference(postLog.timestamp, createMeta.timestamp) : null;
    const gap_post_notapply = (applicantsCount === 0 && postLog) ? getTimeDifference(new Date(), postLog.timestamp) : null;
    const gap_post_apply = (applyMeta && postLog) ? getTimeDifference(applyMeta.timestamp, postLog.timestamp) : null;
    const gap_apply_cv = cvSentLog ? getTimeDifference(cvSentLog.timestamp, applyMeta?.timestamp || postLog?.timestamp) : null;
    const gap_cv_liked = cvLikedLog ? getTimeDifference(cvLikedLog.timestamp, cvSentLog?.timestamp) : null;
    const gap_liked_given = givenNumberLog ? getTimeDifference(givenNumberLog.timestamp, cvLikedLog?.timestamp || cvSentLog?.timestamp) : null;
    const gap_given_meet = guardianMeetLog ? getTimeDifference(guardianMeetLog.timestamp, givenNumberLog?.timestamp || cvLikedLog?.timestamp || cvSentLog?.timestamp) : null;
    const gap_meet_demo1 = demo1Log ? getTimeDifference(demo1Log.timestamp, guardianMeetLog?.timestamp || givenNumberLog?.timestamp) : null;
    const gap_demo1_demo2 = demo2Log ? getTimeDifference(demo2Log.timestamp, demo1Log?.timestamp) : null;
    const gap_demo_confirm = confirmLog ? getTimeDifference(confirmLog.timestamp, demo2Log?.timestamp || demo1Log?.timestamp || contactShareLog?.timestamp) : null;
    const gap_confirm_reqpay = reqPayLog ? getTimeDifference(reqPayLog.timestamp, confirmLog?.timestamp) : null;
    const gap_reqpay_paid = paymentMeta ? getTimeDifference(paymentMeta.timestamp, reqPayLog?.timestamp || confirmLog?.timestamp) : null;
    const gap_demo_failed = demoFailedLog ? getTimeDifference(demoFailedLog.timestamp, demo1Log?.timestamp || contactShareLog?.timestamp) : null;
    const gap_failed_backavail = backAvailLog ? getTimeDifference(backAvailLog.timestamp, demoFailedLog?.timestamp) : null;
    const gap_post_proposal = proposalLog ? getTimeDifference(proposalLog.timestamp, postLog?.timestamp) : null;
    const gap_proposal_negotiation = negotiationLog ? getTimeDifference(negotiationLog.timestamp, proposalLog?.timestamp || postLog?.timestamp) : null;

    const renderFlowArrow = (gapTime, label = null) => (
        <div className="d-flex flex-column align-items-center justify-content-center px-0" style={{ minWidth: label ? '34px' : '16px', flexShrink: 1 }}>
            {label && (
                <span 
                    className="text-muted fw-semibold" 
                    style={{ fontSize: '0.50rem', marginBottom: '1px', whiteSpace: 'nowrap', lineHeight: 1 }}
                >
                    {label}
                </span>
            )}
            {gapTime ? (
                <span 
                    className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle px-1 py-0 shadow-sm" 
                    style={{ fontSize: '0.52rem', fontWeight: '700', marginBottom: '1px', whiteSpace: 'nowrap' }} 
                    title="Time passed between these 2 steps"
                >
                    +{gapTime}
                </span>
            ) : (
                !label && <div style={{ height: '10px' }} />
            )}
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                <line x1="0" y1="4" x2="10" y2="4" stroke="#94a3b8" strokeWidth="1.5" />
                <polygon points="9,1 13,4 9,7" fill="#94a3b8" />
            </svg>
        </div>
    );

    const renderSvgFork = (height = 145) => (
        <div className="d-flex align-items-center justify-content-center px-0" style={{ height: `${height}px`, width: '22px', flexShrink: 0 }}>
            <svg width="22" height={height} viewBox={`0 0 22 ${height}`} fill="none">
                {/* Stem from Post */}
                <line x1="0" y1={height / 2} x2="9" y2={height / 2} stroke="#64748b" strokeWidth="1.5" />
                
                {/* Vertical bracket line */}
                <path d={`M 9 ${height / 4} L 9 ${3 * height / 4}`} stroke="#64748b" strokeWidth="1.5" />
                
                {/* Top branch to Track 1 */}
                <path d={`M 9 ${height / 4} L 18 ${height / 4}`} stroke="#64748b" strokeWidth="1.5" />
                <polygon points={`16,${height / 4 - 3} 21,${height / 4} 16,${height / 4 + 3}`} fill="#64748b" />
                
                {/* Bottom branch to Track 2 */}
                <path d={`M 9 ${3 * height / 4} L 18 ${3 * height / 4}`} stroke="#64748b" strokeWidth="1.5" />
                <polygon points={`16,${3 * height / 4 - 3} 21,${3 * height / 4} 16,${3 * height / 4 + 3}`} fill="#64748b" />
            </svg>
        </div>
    );

    const renderOutcomeFork = (height = 80) => (
        <div className="d-flex align-items-center justify-content-center px-0" style={{ height: `${height}px`, width: '18px', flexShrink: 0 }}>
            <svg width="18" height={height} viewBox={`0 0 18 ${height}`} fill="none">
                {/* Stem from 2nd Demo */}
                <line x1="0" y1={height / 2} x2="7" y2={height / 2} stroke="#64748b" strokeWidth="1.5" />
                
                {/* Vertical bracket */}
                <path d={`M 7 ${height / 4} L 7 ${3 * height / 4}`} stroke="#64748b" strokeWidth="1.5" />
                
                {/* Top branch to Confirmed */}
                <path d={`M 7 ${height / 4} L 15 ${height / 4}`} stroke="#16a34a" strokeWidth="1.5" />
                <polygon points={`13,${height / 4 - 3} 17,${height / 4} 13,${height / 4 + 3}`} fill="#16a34a" />
                
                {/* Bottom branch to Demo Failed */}
                <path d={`M 7 ${3 * height / 4} L 15 ${3 * height / 4}`} stroke="#dc2626" strokeWidth="1.5" />
                <polygon points={`13,${3 * height / 4 - 3} 17,${3 * height / 4} 13,${3 * height / 4 + 3}`} fill="#dc2626" />
            </svg>
        </div>
    );

    const renderFlowNode = ({
        title,
        user,
        time,
        comment = null,
        extraInfo = null,
        isActive = false,
        isDone = false,
        variant = 'default',
        onClick = null,
    }) => {
        let borderColor = '#cbd5e1';
        let bgColor = '#ffffff';
        let titleColor = '#1e293b';

        if (isActive) {
            if (variant === 'success') {
                borderColor = '#16a34a';
                bgColor = '#f0fdf4';
                titleColor = '#15803d';
            } else if (variant === 'danger') {
                borderColor = '#dc2626';
                bgColor = '#fef2f2';
                titleColor = '#b91c1c';
            } else if (variant === 'warning') {
                borderColor = '#d97706';
                bgColor = '#fffbeb';
                titleColor = '#b45309';
            } else {
                borderColor = '#2563eb';
                bgColor = '#eff6ff';
                titleColor = '#1d4ed8';
            }
        } else if (isDone) {
            borderColor = '#86efac';
            bgColor = '#f0fdf4';
            titleColor = '#15803d';
        }

        const trimmedComment = typeof comment === 'string' ? comment.trim() : (comment ? String(comment).trim() : '');

        return (
            <div 
                className={`flow-node-card text-center ${isActive ? 'flow-node-active' : ''} ${isDone && !isActive ? 'flow-node-done' : ''}`}
                style={{
                    borderColor,
                    backgroundColor: bgColor,
                    cursor: onClick ? 'pointer' : 'default',
                }}
                onClick={onClick || undefined}
                role={onClick ? 'button' : undefined}
                tabIndex={onClick ? 0 : undefined}
            >
                <div className="d-flex align-items-center justify-content-center gap-1">
                    <span className="flow-node-title" style={{ color: titleColor }}>
                        {title}
                    </span>
                    {isActive && (
                        <span className="flow-active-dot" title="Current Active Step" />
                    )}
                    {isDone && !isActive && (
                        <span className="badge bg-success text-white rounded-pill px-1 py-0" style={{ fontSize: '0.55rem', lineHeight: '1.2' }} title="Done / Completed">
                            ✓ Done
                        </span>
                    )}
                </div>
                {extraInfo && <div className="flow-node-meta text-muted mt-1">{extraInfo}</div>}
                {(user || time) && (
                    <div className="flow-node-meta mt-1">
                        {user && <span>👤 {user}</span>}
                        {user && time && <span> • </span>}
                        {time && <span>🕒 {formatShortTime(time)}</span>}
                    </div>
                )}
                {trimmedComment && (
                    <div 
                        className="flow-node-comment mt-1 px-1" 
                        title={`Comment: ${trimmedComment}`}
                    >
                        💬 {trimmedComment}
                    </div>
                )}
            </div>
        );
    };

    // Determine which milestone step the tuition was at when it was cancelled
    const cancelStepKey = (() => {
        if (!showCancel) return null;

        const old = (cancelLog?.oldStatus || '').toLowerCase();
        const oldSub = (cancelLog?.subStatus || '').toLowerCase();

        // 1. Check explicitly from cancelLog's previous status and sub-status
        if (old.includes('confirm') || old.includes('payment') || old.includes('request for payment')) return 'confirmed';
        if (old.includes('1st demo')) return 'demo1';
        if (old.includes('demo')) return 'demo';
        if (old.includes('guardian meet') || old.includes('guardian_meet') || old.includes('meet')) return 'guardian_meet';
        if (old.includes('given number') || old.includes('contact')) return 'given_number';
        if (old.includes('liked') || oldSub.includes('liked')) return 'cv_liked';
        if (old.includes('cv')) return 'cv_sent';
        if (old.includes('negotiation') || oldSub.includes('negotiation')) return 'negotiation';
        if (old.includes('proposal') || oldSub.includes('proposal')) return 'proposal';
        if (old.includes('apply')) return 'apply';

        // 2. Fallback based on furthest milestone recorded in history or summary
        if (confirmLog) return 'confirmed';
        if (demo2Log) return 'demo';
        if (demo1Log) return 'demo1';
        if (guardianMeetLog) return 'guardian_meet';
        if (givenNumberLog) return 'given_number';
        if (cvLikedLog) return 'cv_liked';
        if (cvSentLog) return 'cv_sent';
        if (applicantsCount > 0) return 'apply';
        if (isGuardianNegotiation || negotiationLog) return 'negotiation';
        if (isProposalSent || proposalLog) return 'proposal';
        if (applicantsCount === 0 && (tuition.isPublish || postLog)) return 'not_apply';
        return 'post';
    })();

    const isTrack1Cancel = showCancel && ['not_apply', 'proposal', 'negotiation'].includes(cancelStepKey);
    const isTrack2Cancel = showCancel && ['apply', 'cv_sent', 'cv_liked', 'given_number', 'guardian_meet', 'demo1', 'demo', 'confirmed'].includes(cancelStepKey);

    const renderCancelNode = (gapTime = null) => (
        <div className="d-flex align-items-center flex-shrink-0">
            {renderFlowArrow(gapTime, 'Cancelled')}
            {renderFlowNode({
                title: 'Cancelled',
                user: cancelUser,
                time: cancelTime,
                comment: cancelReasonText,
                extraInfo: cancelReasonText ? `Reason: ${cancelReasonText}` : (cancelLog?.oldStatus ? `From: ${cancelLog.oldStatus}` : null),
                isActive: isCancel,
                isDone: !isCancel && hadCancel,
                variant: 'danger',
                onClick: () => handleStatusSelect('cancel')
            })}
        </div>
    );

    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            size="xl" 
            dialogClassName="modal-95w"
            centered 
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: '#fff' }}>
                <Modal.Title className="fw-bold d-flex align-items-center gap-2 fs-5">
                    <span role="img" aria-label="flow">📋</span>
                    <span>Tuition Lifecycle Process:</span>
                    <Badge bg="warning" text="dark" className="fs-6">{tuition.tuitionCode}</Badge>
                    <span className="badge bg-light text-primary ms-2" style={{ fontSize: '0.8rem' }}>
                        {tuition.class || 'Class'} • {tuition.subject || 'Subject'} • {tuition.salary || 'Salary'} Tk
                    </span>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-3 bg-light" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted fw-bold">Loading Process Lifecycle & History...</p>
                    </div>
                ) : (
                    <>
                        {/* 1. VISUAL FLOWCHART (PROPER FLOWCHART WITH TREE BRANCHING) */}
                        <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '12px' }}>
                            <Card.Header className="bg-white fw-bold d-flex align-items-center justify-content-between py-2 border-bottom">
                                <span className="text-primary d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                                    <FaShareAlt /> Operational Flowchart
                                </span>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    {latestHistory && (
                                        <span className="badge bg-light text-dark border d-inline-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                            <FaUser className="text-primary small" /> Last: <strong>{latestHistory.changedBy || 'System'}</strong> ({formatDateTime(latestHistory.timestamp)})
                                        </span>
                                    )}
                                    <span className="badge bg-warning text-dark border d-inline-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                        <FaHourglassHalf className="small" /> In Current Step: <strong>{getTimeDifference(new Date(), latestHistory?.timestamp || tuition.createdAt)}</strong>
                                    </span>
                                    <span className="badge bg-secondary">Applicants: {applicantsCount}</span>
                                    <span className={`badge ${currentStatus === 'cancel' ? 'bg-danger' : currentStatus === 'confirm' ? 'bg-success' : 'bg-primary'}`}>
                                        Status: {processData?.tuition?.status || tuition?.status}
                                    </span>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-3" style={{ background: '#f8fafc' }}>
                                <div className="flowchart-canvas p-2 w-100">
                                    <div className="d-flex align-items-center w-100">
                                        
                                        {/* ROOT PIPELINE: 1. Available -> 2. Post */}
                                        <div className="d-flex align-items-center flex-shrink-0">
                                            {renderFlowNode({
                                                title: 'Available',
                                                user: createMeta.user,
                                                time: createMeta.timestamp,
                                                comment: createMeta.comment,
                                                isActive: isNodeActive('available')
                                            })}

                                            {renderFlowArrow(gap_avail_post)}

                                            {renderFlowNode({
                                                title: 'Post',
                                                user: postLog?.changedBy,
                                                time: postLog?.timestamp,
                                                comment: postLog?.comment,
                                                isActive: isNodeActive('post')
                                            })}

                                            {showCancel && cancelStepKey === 'post' && renderCancelNode(cancelLog ? getTimeDifference(cancelLog.timestamp, postLog?.timestamp || createMeta.timestamp) : null)}
                                        </div>

                                        {/* SVG TREE FORK CONNECTOR */}
                                        {renderSvgFork(145)}

                                        {/* TWO DISTINCT OPERATIONAL LANES */}
                                        <div className="d-flex flex-column flex-grow-1 position-relative" style={{ gap: '16px' }}>
                                            
                                            {/* TRACK 1: 0 APPLICANTS LANE */}
                                            <div className={`flow-lane ${isCancel && isTrack1Cancel ? 'lane-cancel-active' : (applicantsCount === 0 && !isCancel ? 'lane-active' : '')}`}>
                                                <div className="d-flex align-items-center">
                                                    {renderFlowNode({
                                                        title: 'No Applicants (0)',
                                                        extraInfo: gap_post_notapply ? `⏱️ ${gap_post_notapply}` : null,
                                                        isActive: isNodeActive('not_apply'),
                                                        variant: 'warning'
                                                    })}

                                                    {showCancel && cancelStepKey === 'not_apply' && renderCancelNode(cancelLog ? getTimeDifference(cancelLog.timestamp, postLog?.timestamp) : null)}

                                                    {renderFlowArrow(gap_post_proposal)}

                                                    {/* Send Proposal */}
                                                    {renderFlowNode({
                                                        title: 'Send Proposal',
                                                        user: proposalLog?.changedBy,
                                                        time: proposalLog?.timestamp,
                                                        comment: proposalLog?.comment,
                                                        isDone: isProposalSent,
                                                        isActive: isNodeActive('proposal'),
                                                        variant: isProposalSent ? 'success' : 'default'
                                                    })}

                                                    {showCancel && cancelStepKey === 'proposal' && renderCancelNode(cancelLog ? getTimeDifference(cancelLog.timestamp, proposalLog?.timestamp) : null)}

                                                    {renderFlowArrow(gap_proposal_negotiation)}

                                                    {renderFlowNode({
                                                        title: 'Guardian Negotiation',
                                                        user: negotiationLog?.changedBy,
                                                        time: negotiationLog?.timestamp,
                                                        comment: negotiationLog?.comment,
                                                        isActive: isGuardianNegotiation,
                                                        onClick: () => handleStatusSelect('guardian negotiation')
                                                    })}

                                                    {showCancel && cancelStepKey === 'negotiation' && renderCancelNode(cancelLog ? getTimeDifference(cancelLog.timestamp, negotiationLog?.timestamp) : null)}

                                                    {renderFlowArrow(null)}

                                                    <div 
                                                        className="flow-node-card p-1 text-center" 
                                                        style={{ 
                                                             minWidth: '95px', 
                                                             borderStyle: 'dashed',
                                                             opacity: isGuardianNegotiation ? 1 : 0.6
                                                         }}
                                                        title={isGuardianNegotiation ? "Create a clone/repost of this tuition" : "Repost is only available when current step is Guardian Negotiation"}
                                                    >
                                                        <Button 
                                                            variant={isGuardianNegotiation ? "primary" : "secondary"}
                                                            size="sm" 
                                                            className="py-1 px-2 fw-bold w-100"
                                                            style={{ fontSize: '0.72rem', borderRadius: '5px' }}
                                                            disabled={!isGuardianNegotiation}
                                                            onClick={() => {
                                                                if (!isGuardianNegotiation) return;
                                                                onHide();
                                                                if (onCopyTuition) onCopyTuition(processData?.tuition || tuition);
                                                            }}
                                                        >
                                                            + Repost (New)
                                                        </Button>
                                                        {!isGuardianNegotiation && (
                                                            <div className="text-muted mt-1" style={{ fontSize: '0.55rem', lineHeight: 1.1 }}>
                                                                (Negotiation only)
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* TRACK 2: TUTORS APPLIED LANE */}
                                            <div className={`flow-lane ${isCancel && isTrack2Cancel ? 'lane-cancel-active' : (applicantsCount > 0 && !isCancel ? 'lane-active' : '')}`}>
                                                <div className="d-flex align-items-center">
                                                    {renderFlowNode({
                                                        title: `Applications (${applicantsCount})`,
                                                        user: applyMeta?.user,
                                                        time: applyMeta?.timestamp,
                                                        comment: applyMeta?.comment,
                                                        isActive: isNodeActive('apply')
                                                    })}

                                                    {showCancel && cancelStepKey === 'apply' && renderCancelNode(cancelLog ? getTimeDifference(cancelLog.timestamp, applyMeta?.timestamp) : null)}

                                                    {renderFlowArrow(gap_apply_cv)}

                                                    {renderFlowNode({
                                                        title: 'CV Sent',
                                                        user: cvSentLog?.changedBy,
                                                        time: cvSentLog?.timestamp,
                                                        comment: cvSentLog?.comment,
                                                        isActive: currentStatus === 'cv sent'
                                                    })}

                                                    {showCancel && cancelStepKey === 'cv_sent' && renderCancelNode(cancelLog ? getTimeDifference(cancelLog.timestamp, cvSentLog?.timestamp) : null)}

                                                    {renderFlowArrow(gap_cv_liked)}

                                                    {renderFlowNode({
                                                        title: 'Check if Liked',
                                                        user: cvLikedLog?.changedBy,
                                                        time: cvLikedLog?.timestamp,
                                                        comment: cvLikedLog?.comment,
                                                        isActive: currentStatus === 'cv sent - check if liked'
                                                    })}

                                                    {showCancel && cancelStepKey === 'cv_liked' && renderCancelNode(cancelLog ? getTimeDifference(cancelLog.timestamp, cvLikedLog?.timestamp) : null)}

                                                    {renderFlowArrow(gap_liked_given)}

                                                    {renderFlowNode({
                                                        title: 'Given Number',
                                                        user: givenNumberLog?.changedBy,
                                                        time: givenNumberLog?.timestamp,
                                                        comment: givenNumberLog?.comment,
                                                        extraInfo: (processData?.tuition?.tutorNumber || tuition?.tutorNumber) ? `📞 ${processData?.tuition?.tutorNumber || tuition?.tutorNumber}` : null,
                                                        isActive: isNodeActive('given_number'),
                                                        isDone: !!givenNumberLog || isNodeActive('guardian_meet') || isNodeActive('demo'),
                                                        onClick: () => handleStatusSelect('given number')
                                                    })}

                                                    {showCancel && cancelStepKey === 'given_number' && renderCancelNode(cancelLog ? getTimeDifference(cancelLog.timestamp, givenNumberLog?.timestamp) : null)}

                                                    {renderFlowArrow(gap_given_meet)}

                                                    {renderFlowNode({
                                                        title: 'Guardian Meet',
                                                        user: guardianMeetLog?.changedBy,
                                                        time: guardianMeetLog?.timestamp,
                                                        comment: guardianMeetLog?.comment,
                                                        isActive: isNodeActive('guardian_meet'),
                                                        isDone: !!guardianMeetLog || isNodeActive('demo'),
                                                        onClick: () => handleStatusSelect('guardian meet')
                                                    })}

                                                    {showCancel && cancelStepKey === 'guardian_meet' && renderCancelNode(cancelLog ? getTimeDifference(cancelLog.timestamp, guardianMeetLog?.timestamp) : null)}

                                                    {renderFlowArrow(gap_meet_demo1)}

                                                    {renderFlowNode({
                                                        title: '1st Demo Class',
                                                        user: demo1Log?.changedBy,
                                                        time: demo1Log?.timestamp,
                                                        comment: demo1Log?.comment,
                                                        isActive: currentStatus === '1st demo class' || currentStatus === 'demo class running'
                                                    })}

                                                    {showCancel && cancelStepKey === 'demo1' && renderCancelNode(cancelLog ? getTimeDifference(cancelLog.timestamp, demo1Log?.timestamp) : null)}

                                                    {renderFlowArrow(gap_demo1_demo2)}

                                                    {renderFlowNode({
                                                        title: '2nd Demo Class',
                                                        user: demo2Log?.changedBy,
                                                        time: demo2Log?.timestamp,
                                                        comment: demo2Log?.comment,
                                                        isActive: currentStatus === '2nd demo class'
                                                    })}

                                                    {showCancel && cancelStepKey === 'demo' && renderCancelNode(cancelLog ? getTimeDifference(cancelLog.timestamp, demo2Log?.timestamp || demo1Log?.timestamp) : null)}

                                                    {/* RESOLUTION OUTCOME FORK */}
                                                    {renderOutcomeFork(85)}

                                                    {/* RESOLUTION BRANCHES: SUCCESS OR FAILED */}
                                                    <div className="d-flex flex-column gap-1 flex-shrink-0">
                                                        {/* SUCCESS PATH */}
                                                        <div className="d-flex align-items-center">
                                                            {renderFlowNode({
                                                                title: 'Confirmed',
                                                                user: confirmLog?.changedBy,
                                                                time: confirmLog?.timestamp,
                                                                comment: confirmLog?.comment,
                                                                isActive: currentStatus === 'confirm',
                                                                variant: 'success'
                                                            })}

                                                            {showCancel && cancelStepKey === 'confirmed' && renderCancelNode(cancelLog ? getTimeDifference(cancelLog.timestamp, confirmLog?.timestamp) : null)}

                                                            {renderFlowArrow(gap_confirm_reqpay)}

                                                            {renderFlowNode({
                                                                title: 'Request for Payment',
                                                                user: reqPayLog?.changedBy,
                                                                time: reqPayLog?.timestamp,
                                                                comment: reqPayLog?.comment,
                                                                isActive: currentStatus === 'request for payment' || isPaymentPending,
                                                                variant: 'success'
                                                            })}

                                                            {renderFlowArrow(gap_reqpay_paid)}

                                                            {renderFlowNode({
                                                                title: 'Payment Completed',
                                                                user: paymentMeta?.user,
                                                                time: paymentMeta?.timestamp,
                                                                comment: paymentMeta?.comment,
                                                                isActive: isPaymentCompleted,
                                                                variant: 'success'
                                                            })}
                                                        </div>

                                                        {/* FAILED PATH */}
                                                        <div className="d-flex align-items-center">
                                                            {renderFlowNode({
                                                                title: 'Demo Class Failed',
                                                                user: demoFailedLog?.changedBy,
                                                                time: demoFailedLog?.timestamp,
                                                                comment: demoFailedLog?.comment,
                                                                isActive: currentStatus === 'demo class failed',
                                                                variant: 'danger'
                                                            })}

                                                            {renderFlowArrow(gap_failed_backavail)}

                                                            {renderFlowNode({
                                                                title: 'Available',
                                                                user: backAvailLog?.changedBy,
                                                                time: backAvailLog?.timestamp,
                                                                comment: backAvailLog?.comment,
                                                                isActive: isNodeActive('back_available'),
                                                                onClick: () => handleStatusSelect('available')
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* 2. SIMPLE & CLEAN STATUS UPDATE SECTION */}
                        <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '12px', background: '#ffffff' }}>
                            <Card.Header className="bg-white py-2 border-bottom">
                                <span className="fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                                    <FaCommentAlt className="text-primary" /> Update Status
                                </span>
                            </Card.Header>
                            <Card.Body className="p-3">
                                <Form onSubmit={handleSubmitTransition}>
                                    <Row className="g-2 align-items-end">
                                        {/* Status Dropdown */}
                                        <Col md={selectedStatus === 'cancel' ? 3 : (selectedStatus === 'given number' || selectedStatus === 'confirm' || selectedStatus?.includes('demo') ? 3 : 4)}>
                                            <Form.Group>
                                                <Form.Label className="fw-semibold text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                                                    Target Status
                                                </Form.Label>
                                                <Form.Select 
                                                    size="sm"
                                                    value={selectedStatus} 
                                                    onChange={(e) => handleStatusSelect(e.target.value)}
                                                    className="fw-bold text-dark border-secondary-subtle"
                                                    style={{ minHeight: '38px', borderRadius: '8px' }}
                                                >
                                                    <option value="available">Available</option>
                                                    <option value="guardian negotiation">Guardian Negotiation</option>
                                                    <option value="CV Sent">CV Sent</option>
                                                    <option value="CV Sent - Check if liked">CV Sent - Check if liked</option>
                                                    <option value="given number">Given Number</option>
                                                    <option value="guardian meet">Guardian Meet</option>
                                                    <option value="demo class running">Demo Class Running</option>
                                                    <option value="1st demo class">1st Demo Class</option>
                                                    <option value="2nd demo class">2nd Demo Class</option>
                                                    <option value="demo class failed">Demo Class Failed</option>
                                                    <option value="confirm">Confirm</option>
                                                    <option value="request for payment">Request for Payment</option>
                                                    <option value="payment completed">Payment Completed</option>
                                                    <option value="refer BM">Refer BM</option>
                                                    <option value="suspended">Suspended</option>
                                                    <option value="guardian no response">Guardian No Response</option>
                                                    <option value="cancel">Cancel</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        {/* Cancellation Reason (Only when cancel selected) */}
                                        {selectedStatus === 'cancel' && (
                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold text-danger mb-1" style={{ fontSize: '0.8rem' }}>
                                                        Cancellation Reason
                                                    </Form.Label>
                                                    <CreatableSelect 
                                                        isClearable
                                                        placeholder="Select or type custom reason..."
                                                        options={CANCEL_REASONS.map(r => ({ value: r, label: r }))}
                                                        value={cancelReason ? { value: cancelReason, label: cancelReason } : null}
                                                        onChange={(selected) => setCancelReason(selected ? selected.value : '')}
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            control: (base) => ({
                                                                ...base,
                                                                minHeight: '38px',
                                                                fontSize: '0.82rem',
                                                                borderRadius: '8px',
                                                                borderColor: '#dc3545',
                                                                boxShadow: 'none'
                                                            }),
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        )}

                                        {/* Tutor Phone Number (When relevant) */}
                                        {(selectedStatus === 'given number' || selectedStatus === 'confirm' || selectedStatus?.includes('demo')) && (
                                            <Col md={3}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                                                        Tutor Phone (Optional)
                                                    </Form.Label>
                                                    <Form.Control 
                                                        size="sm"
                                                        type="text" 
                                                        placeholder="01XXXXXXXXX" 
                                                        value={tutorNumber}
                                                        onChange={(e) => setTutorNumber(e.target.value)}
                                                        style={{ minHeight: '38px', borderRadius: '8px' }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        )}

                                        {/* Transition Comment / Note */}
                                        <Col md={selectedStatus === 'cancel' ? 3 : (selectedStatus === 'given number' || selectedStatus === 'confirm' || selectedStatus?.includes('demo') ? 4 : 6)}>
                                            <Form.Group>
                                                <Form.Label className="fw-semibold text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                                                    Comment / Note
                                                </Form.Label>
                                                <Form.Control 
                                                    type="text"
                                                    size="sm"
                                                    placeholder="Type comment (e.g. guardian liked cv)..."
                                                    value={transitionComment}
                                                    onChange={(e) => setTransitionComment(e.target.value)}
                                                    style={{ minHeight: '38px', borderRadius: '8px' }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* Save Button */}
                                        <Col md={2} className="text-end">
                                            <Button 
                                                type="submit" 
                                                variant="primary" 
                                                size="sm" 
                                                disabled={submitting}
                                                className="w-100 fw-bold shadow-sm"
                                                style={{ minHeight: '38px', borderRadius: '8px' }}
                                            >
                                                {submitting ? <Spinner size="sm" animation="border" /> : 'Update Status'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>

                        {/* 3. LOG HISTORY & AUDIT TRAIL */}
                        <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                            <Card.Header className="bg-white fw-bold d-flex align-items-center justify-content-between py-2 border-bottom">
                                <span className="text-dark d-flex align-items-center gap-2">
                                    <FaHistory className="text-secondary" /> Complete Log History & Comment Audit Trail
                                </span>
                                <Badge bg="light" text="dark" className="border">
                                    Total Logs: {processData?.history?.length || 0}
                                </Badge>
                            </Card.Header>
                            <Card.Body className="p-0">
                                {processData?.history && processData.history.length > 0 ? (
                                    <div className="table-responsive" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                                        <table className="table table-sm table-hover align-middle mb-0" style={{ fontSize: '0.82rem' }}>
                                            <thead className="table-light sticky-top">
                                                <tr>
                                                    <th style={{ width: '160px' }}>Date & Time</th>
                                                    <th style={{ width: '120px' }}>User</th>
                                                    <th style={{ width: '180px' }}>Status Transition</th>
                                                    <th style={{ width: '150px' }}>Sub-Status</th>
                                                    <th style={{ width: '160px' }}>Time Passed (Between Steps)</th>
                                                    <th>Transition Comment</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {processData.history.map((log, idx) => {
                                                    const prevLog = processData.history[idx + 1];
                                                    const prevTimestamp = prevLog ? prevLog.timestamp : (processData?.computedSummary?.createdAt || tuition.createdAt);
                                                    const timePassed = getTimeDifference(log.timestamp, prevTimestamp);

                                                    return (
                                                        <tr key={log._id || idx}>
                                                            <td className="text-muted">
                                                                <FaClock className="me-1 small" />
                                                                {formatDateTime(log.timestamp)}
                                                            </td>
                                                            <td>
                                                                <span className="badge bg-light text-dark border">
                                                                    <FaUser className="me-1 small text-primary" />
                                                                    {log.changedBy || 'System'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-1">
                                                                    <span className="badge bg-secondary">{log.oldStatus || 'none'}</span>
                                                                    <span>➔</span>
                                                                    <span className="badge bg-primary">{log.newStatus}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {log.subStatus ? (
                                                                    <span className="badge bg-info text-dark">{log.subStatus}</span>
                                                                ) : '-'}
                                                            </td>
                                                            <td>
                                                                {prevLog ? (
                                                                    <span className="badge bg-light text-dark border d-inline-flex align-items-center gap-1" title={`Time passed since previous action (${formatDateTime(prevTimestamp)})`}>
                                                                        <FaHourglassHalf className="text-primary small" /> +{timePassed}
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge bg-light text-muted border d-inline-flex align-items-center gap-1" title="Time passed since tuition creation">
                                                                        <FaClock className="text-secondary small" /> {timePassed} from create
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {log.comment ? (
                                                                    <span className="text-dark fw-semibold" style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', display: 'inline-block' }}>
                                                                        💬 {log.comment}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-muted italic">-</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-muted small">
                                        No status history logs recorded for this tuition yet.
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </>
                )}
            </Modal.Body>

            <Modal.Footer className="py-2 bg-light d-flex justify-content-between">
                <span className="text-muted small">
                    Created: {formatDateTime(processData?.computedSummary?.createdAt)} by {processData?.computedSummary?.createdBy || 'System'}
                </span>
                <Button variant="secondary" size="sm" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>

            {/* Custom Embedded CSS for Flow Diagram */}
            <style>{`
                .modal-95w {
                    max-width: 95vw !important;
                    width: 95vw !important;
                }
                .flowchart-canvas {
                    width: 100% !important;
                    background: #ffffff;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
                }
                .flow-lane {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 4px 6px;
                    transition: all 0.2s ease-in-out;
                }
                .flow-lane.lane-active {
                    border-color: #3b82f6;
                    background: #f0f7ff;
                    box-shadow: 0 1px 6px rgba(59, 130, 246, 0.08);
                }
                .flow-lane.lane-cancel-active {
                    border-color: #ef4444;
                    background: #fff5f5;
                    box-shadow: 0 1px 6px rgba(239, 68, 68, 0.12);
                }
                .flow-node-card {
                    min-width: 80px;
                    max-width: 140px;
                    padding: 5px 8px;
                    border-radius: 6px;
                    border: 1px solid #cbd5e1;
                    background: #ffffff;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
                    transition: all 0.15s ease-in-out;
                    flex: 0 0 auto;
                }
                .flow-node-card:hover {
                    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
                    transform: translateY(-1px);
                }
                .flow-node-active {
                    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15), 0 1px 4px rgba(37, 99, 235, 0.12) !important;
                }
                .flow-node-title {
                    font-size: 0.72rem;
                    font-weight: 700;
                    line-height: 1.25;
                    white-space: normal;
                    word-break: break-word;
                }
                .flow-node-meta {
                    font-size: 0.58rem;
                    color: #475569;
                    line-height: 1.2;
                    white-space: normal;
                    word-break: break-word;
                }
                .flow-node-comment {
                    font-size: 0.58rem;
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    color: #334155;
                    line-height: 1.25;
                    white-space: normal;
                    word-break: break-word;
                    margin: 3px auto 0;
                    padding: 2px 4px;
                    font-weight: 500;
                    text-align: center;
                }
                .flow-active-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #2563eb;
                    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
                    animation: pulseDot 1.5s infinite;
                    flex-shrink: 0;
                }
                @keyframes pulseDot {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
                }
            `}</style>
        </Modal>
    );
}
