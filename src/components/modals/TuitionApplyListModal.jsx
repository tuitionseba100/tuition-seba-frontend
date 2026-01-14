import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

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
    const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [tuitionData, setTuitionData] = useState({
        status: "pending",
        comment: "",
        commentForTeacher: "",
        agentComment: "",
    });
    const [focusField, setFocusField] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (!show || !tuitionId) return;
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
        });
        setEditingId(tuition._id);
        setShowEditModal(true);
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

    const spamStyle = { backgroundColor: '#dc3545', color: 'white' };
    const bestStyle = { backgroundColor: '#007bff', color: 'white' };
    const dueStyle = { backgroundColor: '#FFFF00', color: 'black' };

    const getRowStyle = (tuition) => {
        if (tuition.hasDue) return dueStyle;
        if (tuition.isSpam) return spamStyle;
        if (tuition.isBest) return bestStyle;
        return {};
    };

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
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-light position-relative">
                    {loading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : appliedList.length > 0 ? (
                        <div
                            style={{
                                maxHeight: "80vh",
                                overflowY: "auto",
                                overflowX: "auto",
                            }}
                        >
                            <Table
                                striped
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
                                    {appliedList.map((app, index) => {
                                        const style = getRowStyle(app);
                                        return (
                                            <tr key={app._id}>
                                                <td style={style}>{index + 1}</td>
                                                <td style={style}>{app.updatedBy || ""}</td>
                                                <td style={style}>{app.premiumCode}</td>
                                                <td style={style}>{app.phone}</td>
                                                <td style={style}>{app.name}</td>
                                                <td style={style}>{app.institute}</td>
                                                <td style={style}>{app.department}</td>
                                                <td style={style}>{app.academicYear}</td>
                                                <td style={style}>{app.address}</td>
                                                <td style={style}>{formatDate(app.appliedAt)}</td>
                                                <td style={style}>{app.status}</td>
                                                <td style={style}>{app.comment}</td>
                                                <td style={style}>{app.commentForTeacher}</td>
                                                <td style={style}>{app.agentComment}</td>
                                                <td style={style} className="d-flex justify-content-center gap-2">
                                                    <Button
                                                        variant="warning"
                                                        onClick={() => handleEditTuition(app)}
                                                        disabled={deletingId === app._id}
                                                        aria-label={`Edit application for ${app.name}`}
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button
                                                        variant="danger"
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
                    ) : (
                        <div className="text-center text-muted py-4">
                            <h5>No applications found for this tuition.</h5>
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
                            <Col md={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label className="fw-bold">Status</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={tuitionData.status}
                                        onChange={(e) =>
                                            setTuitionData({ ...tuitionData, status: e.target.value })
                                        }
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
                                        <option value="cancel">Cancelled</option>
                                        <option value="cancelled by guardian">Cancelled By Guardian</option>
                                        <option value="cancelled by teacher">Cancelled By Teacher</option>
                                        <option value="shortlisted">Shortlisted</option>
                                        <option value="requested for payment">Requested for Payment</option>
                                        <option value="meet to office">Meet to office</option>
                                        <option value="selected">Selected</option>
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

        </>
    );
}

export default AppliedListModal;
