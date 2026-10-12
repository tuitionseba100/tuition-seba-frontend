import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { axiosWithFallback as axios } from '../../services/fetchWithFallback';
import { toast } from "react-toastify";
import { FaEdit, FaTrashAlt, FaGlobe, FaGooglePlay, FaCopy } from "react-icons/fa";
import TeacherDetailsModal, { formatTeacherCvText } from "./TeacherDetailsModal";
import { usePublicSettings } from "../../context/PublicSettingsContext";

const inputStyle = {
    borderRadius: "5px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1.5px solid #ced4da",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
};

const inputFocusStyle = {
    borderColor: "#0d6efd",
    boxShadow: "0 0 8px rgba(13, 110, 253, 0.6)",
    outline: "none",
};

function AppliedListModal({ tuitionId, tuitionCode, show, onHide }) {
    const [appliedList, setAppliedList] = useState([]);
    const [teacherCodeFilter, setTeacherCodeFilter] = useState("");
    const [phoneFilter, setPhoneFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [togglingCvId, setTogglingCvId] = useState(null);
    const [cvConfirmModal, setCvConfirmModal] = useState({ show: false, tuition: null });
    const [tuitionData, setTuitionData] = useState({
        status: "pending",
        comment: "",
        commentForTeacher: "",
        agentComment: "",
        isCvSent: false,
    });
    const [focusField, setFocusField] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Teacher Details Modal State (from premiumCode click)
    const [selectedTeacherForModal, setSelectedTeacherForModal] = useState(null);
    const [showTeacherDetailsModal, setShowTeacherDetailsModal] = useState(false);
    const [fetchingTeacherCode, setFetchingTeacherCode] = useState(null);

    const handleOpenTeacherDetailsByPremiumCode = async (premiumCode) => {
        if (!premiumCode || !String(premiumCode).trim()) {
            toast.info("No premium code available for this applicant.");
            return;
        }
        const cleanCode = String(premiumCode).trim();
        setFetchingTeacherCode(cleanCode);
        const token = localStorage.getItem('token');

        try {
            let teacher = null;
            // 1. Try dedicated byPremiumCode endpoint
            try {
                const res = await axios.get(
                    `https://tuition-seba-backend-1.onrender.com/api/regTeacher/byPremiumCode/${encodeURIComponent(cleanCode)}`,
                    { headers: { Authorization: token } }
                );
                teacher = res.data;
            } catch (e) {
                // 2. Fallback to getTableData search
                const res = await axios.get(
                    `https://tuition-seba-backend-1.onrender.com/api/regTeacher/getTableData`,
                    {
                        params: { premiumCode: cleanCode },
                        headers: { Authorization: token }
                    }
                );
                const list = res.data?.data || [];
                teacher = list.find(t => String(t.premiumCode).trim().toLowerCase() === cleanCode.toLowerCase()) || list[0];
            }

            if (teacher) {
                setSelectedTeacherForModal(teacher);
                setShowTeacherDetailsModal(true);
            } else {
                toast.error(`No teacher details found for Premium Code: ${cleanCode}`);
            }
        } catch (err) {
            console.error("Error fetching teacher details:", err);
            toast.error("Failed to load teacher details");
        } finally {
            setFetchingTeacherCode(null);
        }
    };

    const { whatsappNumber } = usePublicSettings();
    const [copyingCvId, setCopyingCvId] = useState(null);

    const handleCopyCv = async (app) => {
        if (!app.premiumCode || !String(app.premiumCode).trim()) {
            toast.info("No premium code available for this applicant.");
            return;
        }

        const cleanCode = String(app.premiumCode).trim();
        setCopyingCvId(app._id);
        const token = localStorage.getItem('token');

        try {
            let teacher = null;
            try {
                const res = await axios.get(
                    `https://tuition-seba-backend-1.onrender.com/api/regTeacher/byPremiumCode/${encodeURIComponent(cleanCode)}`,
                    { headers: { Authorization: token } }
                );
                teacher = res.data;
            } catch (e) {
                const res = await axios.get(
                    `https://tuition-seba-backend-1.onrender.com/api/regTeacher/getTableData`,
                    {
                        params: { premiumCode: cleanCode },
                        headers: { Authorization: token }
                    }
                );
                const list = res.data?.data || [];
                teacher = list.find(t => String(t.premiumCode).trim().toLowerCase() === cleanCode.toLowerCase()) || list[0];
            }

            if (!teacher) {
                toast.error(`Teacher details not found for Premium Code: ${cleanCode}`);
                return;
            }

            const text = formatTeacherCvText(teacher, whatsappNumber);
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }

            toast.success(`Teacher CV (${cleanCode}) copied to clipboard!`);
        } catch (err) {
            console.error("Error copying CV:", err);
            toast.error("Failed to copy CV to clipboard");
        } finally {
            setCopyingCvId(null);
        }
    };

    useEffect(() => {
        if (!show || !tuitionId) return;
        setTeacherCodeFilter("");
        setPhoneFilter("");
        setStatusFilter("");
        setLoading(true);
        axios
            .get(
                `https://tuition-seba-backend-1.onrender.com/api/tuitionApply/appliedListByTuitionId?tuitionId=${tuitionId}`
            )
            .then((res) => setAppliedList(res.data))
            .catch(() => setAppliedList([]))
            .finally(() => setLoading(false));
    }, [tuitionId, show]);

    const handleEditTuition = (tuition) => {
        setTuitionData({
            status: tuition.status || "pending",
            comment: tuition.comment || "",
            commentForTeacher: tuition.commentForTeacher || "",
            agentComment: tuition.agentComment || "",
            isCvSent: !!tuition.isCvSent,
        });
        setEditingId(tuition._id);
        setShowEditModal(true);
    };

    const handleRequestToggleCvSent = (tuition) => {
        setCvConfirmModal({ show: true, tuition });
    };

    const handleConfirmToggleCvSent = async () => {
        const targetTuition = cvConfirmModal.tuition;
        if (!targetTuition || !targetTuition._id) return;

        setTogglingCvId(targetTuition._id);
        try {
            const nextStatus = !targetTuition.isCvSent;
            const res = await axios.put(
                `https://tuition-seba-backend-1.onrender.com/api/tuitionApply/toggle-cv-sent/${targetTuition._id}`,
                { isCvSent: nextStatus }
            );
            const actualStatus = res.data?.isCvSent !== undefined ? res.data.isCvSent : nextStatus;

            setAppliedList((prev) =>
                prev.map((item) =>
                    item._id === targetTuition._id ? { ...item, isCvSent: actualStatus } : item
                )
            );

            toast.success(
                actualStatus
                    ? `Marked CV as Sent for ${targetTuition.name || 'teacher'}!`
                    : `Unmarked CV Sent for ${targetTuition.name || 'teacher'}`
            );
            setCvConfirmModal({ show: false, tuition: null });
        } catch (err) {
            console.error('Error toggling CV Sent:', err);
            toast.error(err.response?.data?.message || 'Failed to update CV Sent status');
        } finally {
            setTogglingCvId(null);
        }
    };

    const handleDeleteTuition = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this tuition apply record?"
        );
        if (confirmDelete) {
            try {
                setDeletingId(id);
                await axios.delete(
                    `https://tuition-seba-backend-1.onrender.com/api/tuitionApply/delete/${id}`
                );
                toast.success("Tuition record deleted successfully!");
                setAppliedList(appliedList.filter((item) => item._id !== id));
            } catch {
                toast.error("Error deleting tuition apply record.");
            } finally {
                setDeletingId(null);
            }
        } else {
            toast.info("Deletion canceled");
        }
    };

    const handleSaveTuition = async () => {
        try {
            setSaving(true);
            const username = localStorage.getItem('username');

            const updatedTuitionData = {
                ...tuitionData,
                updatedBy: username
            };

            await axios.put(
                `https://tuition-seba-backend-1.onrender.com/api/tuitionApply/edit/${editingId}`,
                updatedTuitionData
            );
            toast.success("Tuition apply record updated successfully!");
            setAppliedList((prev) =>
                prev.map((item) =>
                    item._id === editingId ? { ...item, ...updatedTuitionData } : item
                )
            );
            setShowEditModal(false);
        } catch {
            toast.error("Error saving tuition apply record.");
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const optionsDate = {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
        };
        const optionsTime = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC",
        };
        const formattedDate = new Intl.DateTimeFormat("en-GB", optionsDate).format(
            date
        );
        const formattedTime = new Intl.DateTimeFormat("en-GB", optionsTime).format(
            date
        );
        return `${formattedDate} || ${formattedTime}`;
    };

    const handleFocus = (field) => setFocusField(field);
    const handleBlur = () => setFocusField(null);

    const bannedStyle = { backgroundColor: '#000000', color: '#ffffff' };
    const spamStyle = { backgroundColor: '#dc3545', color: 'white' };
    const bestStyle = { backgroundColor: '#007bff', color: 'white' };
    const manualExpressStyle = { backgroundColor: '#28a745', color: 'white' };
    const dueStyle = { backgroundColor: '#FFFF00', color: 'black' };

    const getRowStyle = (tuition) => {
        if (tuition.isBanned) return bannedStyle;
        if (tuition.isSpam) return spamStyle;
        if (tuition.hasDue || tuition.hasScDue) return dueStyle;
        if (tuition.isBest) return bestStyle;
        if (tuition.isExpress) return manualExpressStyle;
        return {};
    };

    const getButtonVariant = (tuition, defaultVariant) => {
        if (tuition.isBanned) return 'light';
        if (tuition.isSpam) return 'light';
        if (tuition.isBest) return 'primary';
        return defaultVariant;
    };

    const filteredList = appliedList.filter((app) => {
        if (teacherCodeFilter.trim()) {
            const code = String(app.premiumCode || "").toLowerCase();
            if (!code.includes(teacherCodeFilter.trim().toLowerCase())) return false;
        }
        if (phoneFilter.trim()) {
            const phone = String(app.phone || "").toLowerCase();
            if (!phone.includes(phoneFilter.trim().toLowerCase())) return false;
        }
        if (statusFilter) {
            const appStatus = String(app.status || "").toLowerCase();
            const targetStatus = statusFilter.toLowerCase();
            if (appStatus !== targetStatus) return false;
        }
        return true;
    });

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                centered
                size="xl"
                dialogClassName="custom-size-modal with-border-modal"
            >
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title className="w-100 text-center fw-bold">
                        Applied List for Tuition Code:{" "}
                        <span className="text-warning">{tuitionCode || "N/A"}</span> — Total:{" "}
                        {appliedList.length}
                        {(teacherCodeFilter || phoneFilter || statusFilter) && (
                            <span className="ms-2 fs-6 text-light opacity-75">
                                (Filtered: {filteredList.length})
                            </span>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-light position-relative">
                    {/* Top Filters */}
                    <div className="bg-white p-3 rounded shadow-sm border mb-3">
                        <Row className="g-2 align-items-end">
                            <Col md={4} sm={12}>
                                <Form.Label className="fw-bold small mb-1">Teacher Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Search Teacher Code (e.g. 102)"
                                    value={teacherCodeFilter}
                                    onChange={(e) => setTeacherCodeFilter(e.target.value)}
                                    size="sm"
                                />
                            </Col>
                            <Col md={4} sm={12}>
                                <Form.Label className="fw-bold small mb-1">Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Search Phone (e.g. 017...)"
                                    value={phoneFilter}
                                    onChange={(e) => setPhoneFilter(e.target.value)}
                                    size="sm"
                                />
                            </Col>
                            <Col md={3} sm={10}>
                                <Form.Label className="fw-bold small mb-1">Status Filter</Form.Label>
                                <Form.Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    size="sm"
                                >
                                    <option value="">All</option>
                                    <option value="pending">Pending</option>
                                    <option value="called (interested)">Called (Interested)</option>
                                    <option value="called (no response)">Called (No Response)</option>
                                    <option value="called (guardian no response)">Called Guardian(No Response)</option>
                                    <option value="CV Sent">CV Sent</option>
                                    <option value="CV Sent - Liked">CV Sent - Liked</option>
                                    <option value="cancel">Cancelled</option>
                                    <option value="cancelled by guardian">Cancelled By Guardian</option>
                                    <option value="cancelled by teacher">Cancelled By Teacher</option>
                                    <option value="shortlisted">Shortlisted</option>
                                    <option value="requested for payment">Requested for Payment</option>
                                    <option value="meet to office">Meet to office</option>
                                    <option value="selected">Selected</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="refer to bm">Refer to BM</option>
                                </Form.Select>
                            </Col>
                            {(teacherCodeFilter || phoneFilter || statusFilter) && (
                                <Col md={1} sm={2} className="d-flex">
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="w-100"
                                        onClick={() => {
                                            setTeacherCodeFilter("");
                                            setPhoneFilter("");
                                            setStatusFilter("");
                                        }}
                                        title="Clear filters"
                                    >
                                        Reset
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </div>

                    {loading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : filteredList.length > 0 ? (
                        <div
                            style={{
                                maxHeight: "80vh",
                                overflowY: "auto",
                                overflowX: "auto",
                            }}
                        >
                            <Table
                                bordered
                                hover
                                style={{
                                    display: "block",
                                    minWidth: "1000px",
                                }}
                                className="shadow-sm text-center align-middle"
                            >
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <th>SL</th>
                                        <th>Updated By</th>
                                        <th>Premium Code</th>
                                        <th>Phone</th>
                                        <th>Name</th>
                                        <th>Institute</th>
                                        <th>Department</th>
                                        <th>Academic Year</th>
                                        <th>Address</th>
                                        <th>Applied At</th>
                                        <th>Status</th>
                                        <th>Comment</th>
                                        <th>Comment For Teacher</th>
                                        <th>Agent Comment</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredList.map((app, index) => {
                                        const style = getRowStyle(app);
                                        return (
                                            <tr key={app._id}>
                                                <td style={{ ...style, textAlign: 'center', verticalAlign: 'middle', minWidth: '80px' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                                        <span style={{ fontWeight: '700', fontSize: '1rem' }}>
                                                            {index + 1} {app.isBanned && <span title="Banned">🚫</span>} {app.isBest && <span title="Best">⭐</span>}
                                                        </span>
                                                        {app.isAppApply
                                                            ? (
                                                                <span style={{
                                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                    backgroundColor: '#01875f', color: '#fff',
                                                                    padding: '2px 8px', borderRadius: '12px',
                                                                    fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase',
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                }}>
                                                                    <FaGooglePlay style={{ fontSize: '0.6rem' }} /> App
                                                                </span>
                                                            )
                                                            : (
                                                                <span style={{
                                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                    backgroundColor: '#1a73e8', color: '#fff',
                                                                    padding: '2px 8px', borderRadius: '12px',
                                                                    fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase',
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                }}>
                                                                    <FaGlobe style={{ fontSize: '0.6rem' }} /> Web
                                                                </span>
                                                            )}
                                                    </div>
                                                </td>
                                                <td style={style}>{app.updatedBy || ""}</td>
                                                <td style={style}>
                                                    <div>
                                                        <div>
                                                            <span
                                                                style={{
                                                                    cursor: app.premiumCode ? 'pointer' : 'default',
                                                                    color: (app.hasDue || app.hasScDue) ? '#000' : (app.isBanned || app.isSpam || app.isBest || app.isExpress) ? '#fff' : '#0d6efd',
                                                                    textDecoration: app.premiumCode ? 'underline' : 'none',
                                                                    fontWeight: '700'
                                                                }}
                                                                onClick={() => app.premiumCode && handleOpenTeacherDetailsByPremiumCode(app.premiumCode)}
                                                                title={app.premiumCode ? `Click to view Teacher Details (${app.premiumCode})` : 'No premium code'}
                                                            >
                                                                {fetchingTeacherCode === app.premiumCode && (
                                                                    <span className="spinner-border spinner-border-sm me-1" role="status" style={{ width: '11px', height: '11px' }} />
                                                                )}
                                                                {app.premiumCode || 'N/A'}
                                                            </span>
                                                        </div>
                                                        {app.regTeacherStatus && (
                                                            <div style={{ fontSize: '11px', color: (app.isBanned || app.isSpam || app.isBest || app.isExpress) ? 'rgba(255,255,255,0.7)' : '#6c757d', marginTop: '2px', textTransform: 'capitalize' }}>
                                                                ({app.regTeacherStatus})
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={style}>{app.phone}</td>
                                                <td style={style}>{app.name}</td>
                                                <td style={style}>{app.institute}</td>
                                                <td style={style}>{app.department}</td>
                                                <td style={style}>{app.academicYear}</td>
                                                <td style={style}>{app.address}</td>
                                                <td style={style}>{formatDate(app.appliedAt)}</td>
                                                <td style={style}>
                                                    <div className="d-flex flex-column align-items-center gap-1">
                                                        <span className={`badge 
                                 ${app.status === "pending" ? "bg-success" :
                                                                app.status === "called (no response)" ? "bg-primary" :
                                                                    app.status === "called (guardian no response)" ? "bg-info" :
                                                                        app.status === "called (interested)" ? "bg-info" :
                                                                            (app.status === "CV Sent" || app.status?.toLowerCase() === "cv sent") ? "bg-primary" :
                                                                                (app.status === "CV Sent - Liked" || app.status?.toLowerCase() === "cv sent - liked") ? "bg-success" :
                                                                                app.status === "cancel" ? "bg-danger" :
                                                                                app.status === "shortlisted" ? "bg-secondary" :
                                                                                    app.status === "requested for payment" ? "bg-warning text-dark" :
                                                                                        app.status === "meet to office" ? "bg-dark" :
                                                                                            app.status === "selected" ? "bg-success" :
                                                                                                app.status === "confirmed" ? "bg-success" :
                                                                                                    app.status === "refer to bm" ? "bg-info" :
                                                                                                        "bg-secondary"
                                                            }`}>
                                                            {app.status}
                                                        </span>
                                                        {(app.hasDue || app.hasScDue) && (
                                                            <table 
                                                                className="table table-sm table-bordered mb-0 mt-1 shadow-sm" 
                                                                style={{ fontSize: '0.72rem', minWidth: '105px', backgroundColor: '#fff8db', borderColor: '#ffeeba' }}
                                                            >
                                                                <thead>
                                                                    <tr style={{ backgroundColor: '#ffdf7e', fontSize: '0.68rem' }} className="text-center">
                                                                        <th className="py-0 px-1 text-dark">Due</th>
                                                                        <th className="py-0 px-1 text-dark">Amount</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {app.hasDue && (
                                                                        <tr>
                                                                            <td className="py-0 px-1 fw-bold text-dark text-center" title="Tuition Charge Due">
                                                                                TC{app.dueCount ? ` (${app.dueCount})` : ''}
                                                                            </td>
                                                                            <td className="py-0 px-1 text-end fw-bold text-danger">৳{Number(app.dueAmount).toLocaleString()}</td>
                                                                        </tr>
                                                                    )}
                                                                    {app.hasScDue && (
                                                                        <tr>
                                                                            <td className="py-0 px-1 fw-bold text-dark text-center" title="Service Charge Due">
                                                                                SC{app.scDueCount ? ` (${app.scDueCount})` : ''}
                                                                            </td>
                                                                            <td className="py-0 px-1 text-end fw-bold text-danger">৳{Number(app.scDueAmount).toLocaleString()}</td>
                                                                        </tr>
                                                                    )}
                                                                    {app.hasDue && app.hasScDue && (
                                                                        <tr style={{ backgroundColor: '#ffe8a1', borderTop: '1.5px solid #deb887' }}>
                                                                            <td className="py-0 px-1 fw-bold text-dark text-center" title="Total Due Count">
                                                                                ({(app.dueCount || 0) + (app.scDueCount || 0)})
                                                                            </td>
                                                                            <td className="py-0 px-1 text-end fw-bold text-danger">
                                                                                ৳{Number((app.dueAmount || 0) + (app.scDueAmount || 0)).toLocaleString()}
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={style}>{app.comment}</td>
                                                <td style={style}>{app.commentForTeacher}</td>
                                                <td style={style}>{app.agentComment}</td>
                                                <td style={style} className="d-flex justify-content-center gap-2 align-items-center">
                                                    <Button
                                                        variant={app.isBanned || app.isSpam ? 'light' : 'primary'}
                                                        size="sm"
                                                        className="d-inline-flex align-items-center gap-1 py-1 px-2"
                                                        style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                                                        onClick={() => handleCopyCv(app)}
                                                        disabled={copyingCvId === app._id}
                                                        title={app.premiumCode ? `Copy Teacher CV (${app.premiumCode})` : 'No premium code'}
                                                    >
                                                        {copyingCvId === app._id ? (
                                                            <>
                                                                <Spinner
                                                                    as="span"
                                                                    animation="border"
                                                                    size="sm"
                                                                    role="status"
                                                                    style={{ width: '12px', height: '12px', borderWidth: '1.5px' }}
                                                                />
                                                                <span>Copying...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaCopy size={11} />
                                                                <span>Copy CV</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant={getButtonVariant(app, 'warning')}
                                                        onClick={() => handleEditTuition(app)}
                                                        disabled={deletingId === app._id}
                                                        aria-label={`Edit application for ${app.name}`}
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button
                                                        variant={getButtonVariant(app, 'danger')}
                                                        onClick={() => handleDeleteTuition(app._id)}
                                                        disabled={deletingId === app._id}
                                                        aria-label={`Delete application for ${app.name}`}
                                                    >
                                                        <FaTrashAlt />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </Table>
                        </div>
                    ) : appliedList.length === 0 ? (
                        <div className="text-center text-muted py-4">
                            <h5>No applications found for this tuition.</h5>
                        </div>
                    ) : (
                        <div className="text-center text-muted py-4">
                            <h5>No applications match the filter criteria.</h5>
                        </div>
                    )}

                    {deletingId && (
                        <div className="simple-overlay">
                            <div className="simple-card d-flex align-items-center gap-2">
                                <Spinner animation="border" size="sm" />
                                Deleting...
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <Modal
                show={showEditModal}
                onHide={() => !saving && setShowEditModal(false)}
                size="lg"
                centered
                dialogClassName="with-border-modal"
            >
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title className="fw-bold">Edit Tuition Application</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{ opacity: saving ? 0.5 : 1, pointerEvents: saving ? "none" : "auto" }}
                    className="position-relative"
                >
                    <Form>
                        <Row>
                            <Col md={12}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label className="fw-bold">Status</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={tuitionData.status}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const updates = { status: val };
                                            if (val === 'CV Sent') {
                                                updates.commentForTeacher = 'আপনার সিভি অভিভাবক এর কাছে পাঠানো হয়েছে। অভিভাবক সিভি পছন্দ করলে আমরা দ্রুত সময়ের মধ্যে যোগাযোগ করবো। আমাদের অন্যান্য এভেইলেবল টিউশনগুলো দেখুন পছন্দ হলে এপ্লাই করুন।';
                                            } else if (val === 'CV Sent - Liked') {
                                                updates.commentForTeacher = 'অভিভাবক আপনার সিভি পছন্দ করেছেন, দ্রুত যোগাযোগ করুন Whatsapp +8801577665717';
                                            }
                                            setTuitionData({ ...tuitionData, ...updates });
                                        }}
                                        onFocus={() => handleFocus("status")}
                                        onBlur={handleBlur}
                                        style={{
                                            ...inputStyle,
                                            ...(focusField === "status" ? inputFocusStyle : {}),
                                        }}
                                        disabled={saving}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="called (interested)">Called (Interested)</option>
                                        <option value="called (no response)">Called (No Response)</option>
                                        <option value="called (guardian no response)">
                                            Called Guardian(No Response)
                                        </option>
                                        <option value="CV Sent">CV Sent</option>
                                        <option value="CV Sent - Liked">CV Sent - Liked</option>
                                        <option value="cancel">Cancelled</option>
                                        <option value="cancelled by guardian">Cancelled By Guardian</option>
                                        <option value="cancelled by teacher">Cancelled By Teacher</option>
                                        <option value="shortlisted">Shortlisted</option>
                                        <option value="requested for payment">Requested for Payment</option>
                                        <option value="meet to office">Meet to office</option>
                                        <option value="selected">Selected</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="refer to bm">Refer to BM</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="comment" className="mb-3">
                                    <Form.Label className="fw-bold">Comment</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={tuitionData.comment}
                                        onChange={(e) =>
                                            setTuitionData({ ...tuitionData, comment: e.target.value })
                                        }
                                        onFocus={() => handleFocus("comment")}
                                        onBlur={handleBlur}
                                        style={{
                                            ...inputStyle,
                                            ...(focusField === "comment" ? inputFocusStyle : {}),
                                        }}
                                        disabled={saving}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="commentForTeacher" className="mb-3">
                                    <Form.Label className="fw-bold">Comment For Teacher</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={tuitionData.commentForTeacher}
                                        onChange={(e) =>
                                            setTuitionData({
                                                ...tuitionData,
                                                commentForTeacher: e.target.value,
                                            })
                                        }
                                        onFocus={() => handleFocus("commentForTeacher")}
                                        onBlur={handleBlur}
                                        style={{
                                            ...inputStyle,
                                            ...(focusField === "commentForTeacher" ? inputFocusStyle : {}),
                                        }}
                                        disabled={saving}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="agentComment" className="mb-3">
                                    <Form.Label className="fw-bold">Agent Comment</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={tuitionData.agentComment}
                                        onChange={(e) =>
                                            setTuitionData({
                                                ...tuitionData,
                                                agentComment: e.target.value,
                                            })
                                        }
                                        onFocus={() => handleFocus("agentComment")}
                                        onBlur={handleBlur}
                                        style={{
                                            ...inputStyle,
                                            ...(focusField === "agentComment" ? inputFocusStyle : {}),
                                        }}
                                        disabled={saving}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                    {saving && (
                        <div className="simple-overlay">
                            <div className="simple-card d-flex align-items-center gap-2">
                                <Spinner animation="border" size="sm" />
                                Updating...
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={saving}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveTuition} disabled={saving}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal >

            {/* CV Sent Confirmation Modal */}
            <Modal
                show={cvConfirmModal.show}
                onHide={() => setCvConfirmModal({ show: false, tuition: null })}
                centered
                size="sm"
            >
                <Modal.Header closeButton style={{ background: cvConfirmModal.tuition?.isCvSent ? '#fff3cd' : '#d1e7dd' }}>
                    <Modal.Title className="fs-6 fw-bold">
                        {cvConfirmModal.tuition?.isCvSent ? '⚠️ Unmark CV Sent?' : '📄 Confirm CV Sent'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-3">
                    <p className="mb-0" style={{ fontSize: '0.88rem' }}>
                        {cvConfirmModal.tuition?.isCvSent ? (
                            <>
                                Are you sure you want to mark CV as <strong>NOT SENT</strong> for{' '}
                                <strong>{cvConfirmModal.tuition?.name || 'this applicant'}</strong>?
                            </>
                        ) : (
                            <>
                                Are you sure you want to mark CV as <strong>SENT</strong> for{' '}
                                <strong>{cvConfirmModal.tuition?.name || 'this applicant'}</strong> ({tuitionCode || cvConfirmModal.tuition?.tuitionCode})?
                            </>
                        )}
                    </p>
                </Modal.Body>
                <Modal.Footer className="py-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setCvConfirmModal({ show: false, tuition: null })}
                        disabled={togglingCvId !== null}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={cvConfirmModal.tuition?.isCvSent ? "warning" : "success"}
                        size="sm"
                        className="fw-bold"
                        onClick={handleConfirmToggleCvSent}
                        disabled={togglingCvId !== null}
                    >
                        {togglingCvId !== null ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            cvConfirmModal.tuition?.isCvSent ? "Yes, Unmark" : "Yes, Mark Sent"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            <style>{`
        .with-border-modal .modal-content {
          border: 3px solid #0d6efd;
          border-radius: 0.3rem;
          box-sizing: border-box;
        }

        .custom-size-modal {
          max-width: 90% !important; /* width */
          width: 90% !important;
          height: 90% !important; /* height */
        }

        .custom-size-modal .modal-content {
          height: 100% !important; /* fill height */
        }

        .custom-size-modal .modal-body {
          height: calc(100% - 60px - 60px); /* subtract header + footer height */
          overflow-y: auto;
        }

        .simple-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(255, 255, 255, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1051;
          border-radius: 0.3rem;
        }
        .simple-card {
          background: #0d6efd;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.25rem;
          font-weight: 600;
          font-size: 1.1rem;
          box-shadow: 0 0 8px rgba(13,110,253,0.5);
        }
      `}</style>

            <TeacherDetailsModal
                show={showTeacherDetailsModal}
                onHide={() => setShowTeacherDetailsModal(false)}
                teacher={selectedTeacherForModal}
            />
        </>
    );
}

export default AppliedListModal;
