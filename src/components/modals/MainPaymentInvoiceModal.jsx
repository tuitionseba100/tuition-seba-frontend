import React, { useRef, useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaPrint, FaTimes } from "react-icons/fa";

const MainPaymentInvoiceModal = ({ payment, show, onClose }) => {
    const invoiceRef = useRef();
    const [logoBase64, setLogoBase64] = useState("");

    useEffect(() => {
        const getBase64Image = async (url) => {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch {
                return "";
            }
        };
        getBase64Image("/logo512.png").then(setLogoBase64);
    }, []);

    const formatDate = (dateVal) => {
        if (!dateVal) return "-";
        const d = new Date(dateVal);
        return !isNaN(d.getTime())
            ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(d)
            : dateVal;
    };

    const formatCurrency = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? "0.00" : num.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Extract all recorded installments
    const installments = [];
    if (payment) {
        if (payment.receivedTk || payment.paymentReceivedDate || payment.paymentType || payment.paymentNumber) {
            installments.push({
                no: "1st Installment",
                amount: parseFloat(payment.receivedTk) || 0,
                date: formatDate(payment.paymentReceivedDate),
                type: payment.paymentType || "Cash/Online",
                number: payment.paymentNumber || "-"
            });
        }
        if (payment.receivedTk2 || payment.paymentReceivedDate2 || payment.paymentType2 || payment.paymentNumber2) {
            installments.push({
                no: "2nd Installment",
                amount: parseFloat(payment.receivedTk2) || 0,
                date: formatDate(payment.paymentReceivedDate2),
                type: payment.paymentType2 || "Cash/Online",
                number: payment.paymentNumber2 || "-"
            });
        }
        if (payment.receivedTk3 || payment.paymentReceivedDate3 || payment.paymentType3 || payment.paymentNumber3) {
            installments.push({
                no: "3rd Installment",
                amount: parseFloat(payment.receivedTk3) || 0,
                date: formatDate(payment.paymentReceivedDate3),
                type: payment.paymentType3 || "Cash/Online",
                number: payment.paymentNumber3 || "-"
            });
        }
        if (payment.receivedTk4 || payment.paymentReceivedDate4 || payment.paymentType4 || payment.paymentNumber4) {
            installments.push({
                no: "4th Installment",
                amount: parseFloat(payment.receivedTk4) || 0,
                date: formatDate(payment.paymentReceivedDate4),
                type: payment.paymentType4 || "Cash/Online",
                number: payment.paymentNumber4 || "-"
            });
        }
    }

    const totalFee = parseFloat(payment?.totalPaymentTk || 0);
    const discount = parseFloat(payment?.discount || 0);
    const hasDiscount = discount > 0;
    const netPayable = Math.max(0, totalFee - discount);
    const totalReceived = parseFloat(payment?.totalReceivedTk || 0);
    const dueAmount = parseFloat(payment?.duePayment || 0);
    const isFullyPaid = payment?.paymentStatus === "fully paid" || (totalReceived >= netPayable && netPayable > 0);

    // Standardized Clean PDF File Name
    const rawCode = payment?.tuitionCode || "TSF";
    const cleanCode = rawCode.replace(/[^a-zA-Z0-9_-]/g, "");
    const rawTutor = payment?.tutorName || "Teacher";
    const cleanTutor = rawTutor.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
    const todayStr = new Date().toISOString().slice(0, 10);
    const pdfFileName = `Invoice_${cleanCode}_${cleanTutor}_${todayStr}`;

    const receiptNo = payment?._id 
        ? `TSF-REC-${payment._id.slice(-6).toUpperCase()}` 
        : `TSF-REC-${cleanCode}`;

    const handlePrint = () => {
        if (!invoiceRef.current) return;
        const invoiceHtml = invoiceRef.current.outerHTML;
        const printWindow = window.open("", "_blank", "width=920,height=880");
        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${pdfFileName}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 0;
              color: #0f172a;
              background: #ffffff;
              font-size: 11px;
              line-height: 1.5;
              -webkit-font-smoothing: antialiased;
            }
            .invoice-wrapper {
              width: 100%;
              max-width: 185mm;
              margin: 0 auto;
              position: relative;
              background: #ffffff;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
          </style>
        </head>
        <body>
          <div class="invoice-wrapper">
            ${invoiceHtml}
          </div>
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.focus();

        const runPrint = () => {
            printWindow.print();
            printWindow.close();
        };

        let checkInterval = setInterval(() => {
            if (printWindow.document.readyState === "complete") {
                clearInterval(checkInterval);
                setTimeout(runPrint, 250);
            }
        }, 50);

        setTimeout(() => {
            clearInterval(checkInterval);
            runPrint();
        }, 2500);
    };

    if (!payment) return null;

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton className="border-bottom py-2.5 px-3 bg-white">
                <div className="d-flex align-items-center justify-content-between w-100 pe-3">
                    <div>
                        <span className="fw-bold text-dark fs-6">Money Receipt Preview</span>
                        <span className="text-muted ms-2" style={{ fontSize: "11.5px" }}>
                            File: <code className="text-dark fw-bold font-monospace">{pdfFileName}.pdf</code>
                        </span>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body className="p-3 p-md-4" style={{ backgroundColor: "#334155", maxHeight: "86vh", overflowY: "auto" }}>
                <div
                    ref={invoiceRef}
                    style={{
                        maxWidth: "710px",
                        margin: "0 auto",
                        padding: "36px 42px",
                        backgroundColor: "#ffffff",
                        color: "#0f172a",
                        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                        fontSize: "11px",
                        lineHeight: "1.5",
                        borderRadius: "4px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        position: "relative"
                    }}
                >
                    {/* Centered Watermark Logo */}
                    {logoBase64 && (
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "360px",
                                height: "360px",
                                opacity: "0.035",
                                pointerEvents: "none",
                                zIndex: 0
                            }}
                        >
                            <img
                                src={logoBase64}
                                alt="TSF Watermark"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    filter: "grayscale(100%)"
                                }}
                            />
                        </div>
                    )}

                    {/* Content Layer */}
                    <div style={{ position: "relative", zIndex: 1 }}>
                        {/* Header: Organization Identity & Receipt Meta */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "18px", borderBottom: "1.5px solid #0f172a" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                {logoBase64 ? (
                                    <img src={logoBase64} alt="TSF Logo" style={{ height: "56px", width: "56px", objectFit: "contain" }} />
                                ) : (
                                    <div style={{ width: "52px", height: "52px", backgroundColor: "#0f172a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "16px", borderRadius: "4px" }}>
                                        TSF
                                    </div>
                                )}
                                <div>
                                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px", lineHeight: "1.2" }}>
                                        TUITION SEBA FORUM
                                    </div>
                                    <div style={{ fontSize: "10px", fontWeight: "600", color: "#64748b", letterSpacing: "0.2px", marginBottom: "3px" }}>
                                        A Trusted Platform for Professional Tuition Management
                                    </div>
                                    <div style={{ fontSize: "10px", color: "#475569", lineHeight: "1.35" }}>
                                        Masjid Goli, 2 No. Gate, Chattogram, Bangladesh<br />
                                        Hotlines: +880 1633-920928, +880 1714-045039 • tuitionsebaforum.com
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px", textTransform: "uppercase", lineHeight: "1.1" }}>
                                    MONEY RECEIPT
                                </div>
                                <div style={{ fontSize: "10.5px", color: "#475569", marginTop: "4px" }}>
                                    <div>Receipt No: <strong style={{ color: "#0f172a", fontFamily: "monospace" }}>{receiptNo}</strong></div>
                                    <div>Date: <strong style={{ color: "#0f172a" }}>{formatDate(new Date())}</strong></div>
                                    <div style={{ marginTop: "2px" }}>
                                        Status:{" "}
                                        <strong style={{ 
                                            color: isFullyPaid ? "#166534" : dueAmount > 0 ? "#991b1b" : "#b45309",
                                            textTransform: "uppercase"
                                        }}>
                                            {isFullyPaid ? "Paid in Full" : dueAmount > 0 ? "Payment Due" : "Partial Payment"}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bill To & Tuition Information (Clean 2-Column Split) */}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #e2e8f0" }}>
                            <div style={{ width: "48%" }}>
                                <div style={{ fontSize: "9.5px", fontWeight: "700", textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.4px", marginBottom: "4px" }}>
                                    Issued To (Teacher)
                                </div>
                                <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a", marginBottom: "2px" }}>
                                    {payment.tutorName || "-"}
                                </div>
                                <div style={{ color: "#475569", fontSize: "11px" }}>
                                    Phone: <span style={{ fontFamily: "monospace", color: "#0f172a" }}>{payment.tutorNumber || "-"}</span>
                                </div>
                                {payment.paymentNumber && (
                                    <div style={{ color: "#475569", fontSize: "11px" }}>
                                        Sender A/C: <span style={{ fontFamily: "monospace", color: "#0f172a" }}>{payment.paymentNumber}</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ width: "48%", textAlign: "right" }}>
                                <div style={{ fontSize: "9.5px", fontWeight: "700", textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.4px", marginBottom: "4px" }}>
                                    Tuition Details
                                </div>
                                <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a", marginBottom: "2px", fontFamily: "monospace" }}>
                                    Tuition Code: {payment.tuitionCode || "-"}
                                </div>
                                {payment.tuitionSalary ? (
                                    <div style={{ color: "#475569", fontSize: "11px" }}>
                                        Monthly Salary: <strong style={{ color: "#0f172a" }}>৳ {formatCurrency(payment.tuitionSalary)}</strong>
                                    </div>
                                ) : null}
                                {payment.isVerified && payment.verifiedBy && (
                                    <div style={{ color: "#166534", fontSize: "10.5px", fontWeight: "600", marginTop: "2px" }}>
                                        ✓ Verified Profile
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fee Particulars Table */}
                        <div style={{ marginTop: "16px", marginBottom: "16px" }}>
                            <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", letterSpacing: "0.4px", marginBottom: "5px" }}>
                                Fee Particulars
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1.5px solid #0f172a", backgroundColor: "#f8fafc" }}>
                                        <th style={{ padding: "6px 8px", textAlign: "left", color: "#0f172a", fontWeight: "700", fontSize: "10px", textTransform: "uppercase", width: "6%" }}>SL</th>
                                        <th style={{ padding: "6px 8px", textAlign: "left", color: "#0f172a", fontWeight: "700", fontSize: "10px", textTransform: "uppercase", width: hasDiscount ? "46%" : "54%" }}>Description</th>
                                        <th style={{ padding: "6px 8px", textAlign: "right", color: "#0f172a", fontWeight: "700", fontSize: "10px", textTransform: "uppercase", width: hasDiscount ? "16%" : "20%" }}>Agreed Fee</th>
                                        {hasDiscount && (
                                            <th style={{ padding: "6px 8px", textAlign: "right", color: "#0f172a", fontWeight: "700", fontSize: "10px", textTransform: "uppercase", width: "16%" }}>Discount</th>
                                        )}
                                        <th style={{ padding: "6px 8px", textAlign: "right", color: "#0f172a", fontWeight: "700", fontSize: "10px", textTransform: "uppercase", width: hasDiscount ? "16%" : "20%" }}>Net Payable</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                                        <td style={{ padding: "8px 8px", color: "#64748b" }}>01</td>
                                        <td style={{ padding: "8px 8px" }}>
                                            <div style={{ fontWeight: "700", color: "#0f172a" }}>Tuition Media & Management Service Charge</div>
                                            <div style={{ fontSize: "10px", color: "#64748b" }}>Tuition Code Ref: {payment.tuitionCode || "TSF"}</div>
                                        </td>
                                        <td style={{ padding: "8px 8px", textAlign: "right", color: "#475569" }}>৳ {formatCurrency(totalFee)}</td>
                                        {hasDiscount && (
                                            <td style={{ padding: "8px 8px", textAlign: "right", color: "#dc2626", fontWeight: "600" }}>
                                                - ৳ {formatCurrency(discount)}
                                            </td>
                                        )}
                                        <td style={{ padding: "8px 8px", textAlign: "right", fontWeight: "700", color: "#0f172a" }}>৳ {formatCurrency(netPayable)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Installments History Ledger Table */}
                        <div style={{ marginBottom: "18px" }}>
                            <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", letterSpacing: "0.4px", marginBottom: "5px" }}>
                                Payment Transaction Record
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #0f172a", backgroundColor: "#f8fafc" }}>
                                        <th style={{ padding: "6px 8px", textAlign: "left", color: "#0f172a", fontWeight: "700", fontSize: "10px", textTransform: "uppercase", width: "22%" }}>Installment</th>
                                        <th style={{ padding: "6px 8px", textAlign: "left", color: "#0f172a", fontWeight: "700", fontSize: "10px", textTransform: "uppercase", width: "18%" }}>Payment Date</th>
                                        <th style={{ padding: "6px 8px", textAlign: "left", color: "#0f172a", fontWeight: "700", fontSize: "10px", textTransform: "uppercase", width: "20%" }}>Method</th>
                                        <th style={{ padding: "6px 8px", textAlign: "left", color: "#0f172a", fontWeight: "700", fontSize: "10px", textTransform: "uppercase", width: "22%" }}>Payer A/C / Ref</th>
                                        <th style={{ padding: "6px 8px", textAlign: "right", color: "#0f172a", fontWeight: "700", fontSize: "10px", textTransform: "uppercase", width: "18%" }}>Received (৳)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {installments.length > 0 ? (
                                        installments.map((inst, idx) => (
                                            <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                                <td style={{ padding: "6px 8px", fontWeight: "600", color: "#0f172a" }}>{inst.no}</td>
                                                <td style={{ padding: "6px 8px", color: "#475569" }}>{inst.date}</td>
                                                <td style={{ padding: "6px 8px", color: "#475569" }}>{inst.type}</td>
                                                <td style={{ padding: "6px 8px", color: "#64748b", fontFamily: "monospace" }}>{inst.number}</td>
                                                <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: "600", color: "#166534" }}>৳ {formatCurrency(inst.amount)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                                            <td colSpan="5" style={{ padding: "8px", textAlign: "center", color: "#94a3b8" }}>
                                                No installment transactions recorded.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Financial Ledger (Right) & Notes (Left) */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "36px" }}>
                            {/* Left Side: Notes & Due Notice */}
                            <div style={{ width: "50%" }}>
                                {payment.comment && (
                                    <div style={{ fontSize: "10.5px", marginBottom: "8px" }}>
                                        <div style={{ fontWeight: "700", color: "#475569", textTransform: "uppercase", fontSize: "9.5px", marginBottom: "2px" }}>Note / Remarks</div>
                                        <div style={{ color: "#334151" }}>{payment.comment}</div>
                                    </div>
                                )}

                                {dueAmount > 0 && (
                                    <div style={{ fontSize: "10.5px", padding: "6px 10px", backgroundColor: "#fef2f2", borderLeft: "3px solid #dc2626", borderRadius: "2px", color: "#991b1b" }}>
                                        <div style={{ fontWeight: "700", fontSize: "9.5px", textTransform: "uppercase", marginBottom: "1px" }}>Payment Notice</div>
                                        <div>Outstanding Balance: <strong>৳ {formatCurrency(dueAmount)}</strong></div>
                                        {payment.duePayDate && (
                                            <div>Payment Deadline: <strong>{formatDate(payment.duePayDate)}</strong></div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Calculation Summary */}
                            <div style={{ width: "42%" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: "3px 0", color: "#64748b" }}>Total Agreed Fee:</td>
                                            <td style={{ padding: "3px 0", textAlign: "right", color: "#0f172a" }}>৳ {formatCurrency(totalFee)}</td>
                                        </tr>
                                        {hasDiscount && (
                                            <tr>
                                                <td style={{ padding: "3px 0", color: "#64748b" }}>Discount Applied:</td>
                                                <td style={{ padding: "3px 0", textAlign: "right", color: "#dc2626", fontWeight: "600" }}>- ৳ {formatCurrency(discount)}</td>
                                            </tr>
                                        )}
                                        <tr style={{ borderTop: "1px solid #e2e8f0" }}>
                                            <td style={{ padding: "4px 0", color: "#0f172a", fontWeight: "600" }}>Net Payable:</td>
                                            <td style={{ padding: "4px 0", textAlign: "right", color: "#0f172a", fontWeight: "700" }}>৳ {formatCurrency(netPayable)}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "3px 0", color: "#166534", fontWeight: "600" }}>Total Received (Paid):</td>
                                            <td style={{ padding: "3px 0", textAlign: "right", color: "#166534", fontWeight: "700" }}>৳ {formatCurrency(totalReceived)}</td>
                                        </tr>
                                        <tr style={{ borderTop: "1.5px solid #0f172a" }}>
                                            <td style={{ padding: "6px 0", fontWeight: "800", color: dueAmount > 0 ? "#991b1b" : "#166534", fontSize: "11.5px" }}>
                                                Balance Due:
                                            </td>
                                            <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "800", fontSize: "12.5px", color: dueAmount > 0 ? "#991b1b" : "#166534" }}>
                                                ৳ {formatCurrency(dueAmount)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Formal Signatures */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: "16px" }}>
                            <div style={{ textAlign: "center", width: "170px" }}>
                                <div style={{ borderTop: "1px solid #0f172a", marginBottom: "4px" }}></div>
                                <div style={{ fontSize: "10.5px", color: "#475569" }}>Teacher / Payer's Signature</div>
                            </div>

                            <div style={{ textAlign: "center", width: "190px" }}>
                                <div style={{ borderTop: "1px solid #0f172a", marginBottom: "4px" }}></div>
                                <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#0f172a" }}>Authorized Signature</div>
                                <div style={{ fontSize: "9.5px", color: "#64748b" }}>Tuition Seba Forum</div>
                            </div>
                        </div>

                        {/* System Footer Note */}
                        <div style={{ textAlign: "center", fontSize: "8.5px", color: "#94a3b8", marginTop: "24px", letterSpacing: "0.2px" }}>
                            Official System-Generated Receipt • Tuition Seba Forum • System Generated Copy
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between py-2 px-3 bg-white border-top">
                <Button variant="outline-secondary" size="sm" onClick={onClose}>
                    <FaTimes className="me-1" /> Close
                </Button>
                <div className="d-flex align-items-center gap-2">
                    <span className="text-muted small d-none d-sm-inline">
                        Default PDF File Name: <strong className="font-monospace text-dark">{pdfFileName}.pdf</strong>
                    </span>
                    <Button variant="dark" size="sm" onClick={handlePrint} className="px-4 fw-bold d-flex align-items-center gap-2">
                        <FaPrint /> Print / Save PDF
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default MainPaymentInvoiceModal;
