import React, { useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import {
    FaPrint, FaUser, FaCode, FaMoneyBill, FaPhoneAlt,
    FaCheckCircle, FaStickyNote, FaCalendarAlt
} from "react-icons/fa";

const PaymentInvoice = ({ payment, show, onClose }) => {
    const invoiceRef = useRef();

    const handlePrint = () => {
        const printContent = invoiceRef.current;
        const WinPrint = window.open("", "", "width=900,height=650");
        WinPrint.document.write(`<html><head><title>Invoice</title></head><body>${printContent.innerHTML}</body></html>`);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    };

    const invoiceItems = [
        { icon: <FaUser />, label: "Name", value: payment?.name },
        { icon: <FaCode />, label: "Tuition Code", value: payment?.tuitionCode },
        { icon: <FaMoneyBill />, label: "Payment Type", value: payment?.paymentType },
        { icon: <FaPhoneAlt />, label: "Payment Number", value: payment?.paymentNumber },
        { icon: <FaCheckCircle />, label: "Transaction ID", value: payment?.transactionId },

        { icon: <FaCheckCircle />, label: "Status", value: payment?.status },
        { icon: <FaStickyNote />, label: "Note", value: payment?.note },
    ];

    return (
        <Modal show={show} onHide={onClose} size="lg" centered dialogClassName="modal-90w" contentClassName="p-0">
            <Modal.Body
                style={{
                    width: "210mm",
                    minHeight: "297mm",
                    padding: "20mm",
                    background: "#fff",
                    fontFamily: "'Roboto', sans-serif",
                    color: "#222",
                    position: "relative",
                    overflow: "auto",
                }}
                ref={invoiceRef}
            >

                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "60px",
                        color: "rgba(0,0,0,0.05)",
                        fontWeight: "bold",
                        pointerEvents: "none",
                        whiteSpace: "nowrap",
                    }}
                >
                    Tuition Seba Forum
                </div>

                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "25px",
                        borderBottom: "2px solid #0d6efd",
                        paddingBottom: "10px",
                    }}
                >
                    <img
                        src="/img/TUITION SEBA FORUM TF.png"
                        alt="Logo"
                        style={{ maxHeight: "60px", borderRadius: "5px" }}
                    />
                    <div style={{ textAlign: "right", fontSize: "14px" }}>
                        <h3 style={{ margin: 0 }}>Tuition Seba Forum</h3>
                        <div>২ নাম্বার গেইট, Chattogram</div>
                        <div>Phone: +01633920928</div>
                    </div>
                </div>

                {/* Invoice Info */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "25px",
                        fontSize: "14px",
                    }}
                >
                    <div><FaCalendarAlt /> Date: {new Date().toLocaleDateString()}</div>
                    <div>Receipt No: {payment?._id}</div>
                </div>

                {/* Title */}
                <h2 style={{ textAlign: "center", color: "#0d6efd", marginBottom: "20px" }}>
                    Payment Invoice
                </h2>

                {/* Details Table */}
                <div style={{ border: "1px solid #ddd", borderRadius: "5px", overflow: "hidden", marginBottom: "20px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                        <tbody>
                            {invoiceItems.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                                    <th
                                        style={{
                                            width: "35%",
                                            backgroundColor: "#f9f9f9",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "10px",
                                            textAlign: "left",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {item.icon} {item.label}
                                    </th>
                                    <td style={{ padding: "10px" }}>{item.value || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Amount */}
                <div style={{ textAlign: "right", marginBottom: "40px" }}>
                    <div
                        style={{
                            display: "inline-block",
                            padding: "10px 25px",
                            border: "2px solid #0d6efd",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            fontSize: "18px",
                            color: "#0d6efd",
                        }}
                    >
                        ৳ {parseFloat(payment?.amount || 0).toLocaleString()}
                    </div>
                </div>

                {/* Signature */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "30px" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ borderTop: "1px solid #000", width: "200px", marginBottom: "5px" }} />
                        <span>Authorized Signatory</span>
                    </div>
                </div>

                {/* Terms */}
                <div style={{ fontSize: "13px", color: "#555", borderTop: "1px solid #ddd", paddingTop: "10px" }}>
                    <strong>শর্তাবলী:</strong>
                    <ol style={{ paddingLeft: "18px", lineHeight: "1.6" }}>
                        <li>অভিবাবক এর নাম্বার পাওয়ার পর যতদ্রুত সম্ভব আমাদের জানাবেন।</li>
                        <li>অভিভাবকের সাথে মিডিয়া ফি নিয়ে কোনো আলোচনা করা যাবে না।</li>
                        <li>টিউশন বাতিল হলে অতি দ্রুত জানাতে হবে এবং রিফান্ডের জন্য আবেদন করতে হবে।</li>
                        <li>অনিয়মিত উপস্থিতির ক্ষেত্রে মিডিয়া ফি ফেরতযোগ্য হবে না।</li>
                        <li>ব্যক্তিগত কারণে টিউশন ছেড়ে দিলে মিডিয়া ফি ফেরত দেওয়া হবে না।</li>
                        <li>টিউশন সেবা ফোরামের সুনাম ও বিশ্বাসকে ক্ষতিগ্রস্ত করা যাবে না।</li>
                    </ol>
                </div>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={handlePrint}>
                    <FaPrint style={{ marginRight: "5px" }} /> Print
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentInvoice;
