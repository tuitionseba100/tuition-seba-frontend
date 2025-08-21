import React, { useRef } from "react";
import { Modal, Button } from "react-bootstrap";

const PaymentInvoice = ({ payment, show, onClose }) => {
    const invoiceRef = useRef();

    const handlePrint = () => {
        const printContent = invoiceRef.current;
        const WinPrint = window.open("", "", "width=900,height=650");
        WinPrint.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              color: #000;
              padding: 10mm;
              font-size: 12px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 15px;
            }
            th, td {
              padding: 6px 8px;
              border: 1px solid #000;
            }
            th {
              background: #f5f5f5;
              font-weight: bold;
              text-align: left;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 60px;
              color: rgba(0,0,0,0.05);
              font-weight: bold;
              pointer-events: none;
              white-space: nowrap;
              z-index: 0;
            }
            h2 {
              text-align: center;
              margin: 10px 0;
              font-size: 18px;
            }
            .header, .footer {
              text-align: center;
            }
            .clickable {
              cursor: pointer;
              color: #0d6efd;
              text-decoration: underline;
            }
            .signature {
              display: flex;
              justify-content: flex-end;
              margin-top: 10px;
            }
            .signature div {
              text-align: center;
              width: 150px;
            }
            .signature div div {
              border-top: 1px solid #000;
              margin-bottom: 5px;
            }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    };

    const isSecondType = payment?.paymentReceivedDate !== undefined;

    const invoiceItems = isSecondType
        ? [
            { label: "Receipt No", value: payment?._id },
            { label: "Tuition Code", value: payment?.tuitionCode },
            { label: "Tutor Name", value: payment?.tutorName },
            { label: "Tutor Phone", value: payment?.tutorNumber },
            { label: "Payment Number", value: payment?.paymentNumber },
            { label: "Payment Type", value: payment?.paymentType },
            { label: "Advance Payment", value: `৳ ${parseFloat(payment?.receivedTk || 0).toLocaleString()}` },
            { label: "Due Payment", value: payment?.duePayment > 0 ? `৳ ${parseFloat(payment.duePayment).toLocaleString()}` : "৳ 0" },
            { label: "Total Amount", value: `৳ ${(parseFloat(payment?.totalReceivedTk || 0) + parseFloat(payment?.duePayment || 0)).toLocaleString()}` },
            { label: "Payment Status", value: payment?.paymentStatus },
        ]
        : [
            { label: "Name", value: payment?.name },
            { label: "Tuition Code", value: payment?.tuitionCode },
            { label: "Payment Type", value: payment?.paymentType },
            { label: "Payment Number", value: payment?.paymentNumber },
            { label: "Transaction ID", value: payment?.transactionId },
            { label: "Status", value: payment?.status },
            { label: "Amount", value: `৳ ${parseFloat(payment?.amount || 0).toLocaleString()}` },
        ];

    const redirectToSite = () => {
        window.open("https://tuitionsebaforum.com", "_blank");
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered dialogClassName="modal-90w" contentClassName="p-0">
            <Modal.Body
                ref={invoiceRef}
                style={{
                    width: "210mm",
                    minHeight: "297mm",
                    position: "relative",
                    background: "#fff",
                    overflow: "auto",
                    padding: "10mm",
                    fontFamily: "'Roboto', sans-serif",
                    color: "#000",
                    fontSize: "12px",
                }}
            >
                {/* Watermark */}
                <div className="watermark">Tuition Seba Forum</div>

                {/* Header */}
                <div className="header" style={{ marginBottom: "15px", position: "relative", zIndex: 1 }}>
                    <h3 className="clickable" onClick={redirectToSite} style={{ margin: "0 0 3px 0" }}>Tuition Seba Forum</h3>
                    <p style={{ margin: 0 }}>Masjid Goli, 2 Number gate, Chattogram</p>
                    <p style={{ margin: 0 }}>Phone: 01633-920928, 01714045039</p>
                </div>

                {/* Date & Receipt */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "12px", zIndex: 1, position: "relative" }}>
                    <div>Date: {new Date().toLocaleDateString()}</div>
                    {!isSecondType && <div>Receipt No: {payment?._id}</div>}
                </div>

                {/* Invoice Title */}
                <h2>Payment Invoice</h2>

                {/* Invoice Table */}
                <div style={{ border: "1px solid #000", borderRadius: "3px", overflow: "hidden", marginBottom: "15px", zIndex: 1, position: "relative" }}>
                    <table>
                        <tbody>
                            {invoiceItems.map((item, idx) => (
                                <tr key={idx}>
                                    <th>{item.label}</th>
                                    <td>{item.value || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Signature */}
                <div className="signature">
                    <div>
                        <div></div>
                        <span>Authorized Signatory</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="footer">
                    <strong>শর্তাবলী:</strong>
                    <ol style={{ paddingLeft: "15px" }}>
                        <li>অভিভাবকের নাম্বার পাওয়ার পর যত দ্রুত সম্ভব কথা বলে আমাদের জানাবেন। টিউশন কনফার্ম বা ক্যান্সেল হলে আমাদের জানাতে হবে। প্রথম এক মাস আমাদের সাথে নিয়মিত আপডেট দিতে হবে।</li>
                        <li>অভিভাবকের সাথে মিডিয়া ফি নিয়ে কোনো ধরণের আলোচনা করা যাবে না।</li>
                        <li>টিউশন কোনো কারণে বাতিল হলে আমাদেরকে অতিদ্রুত জানাতে হবে এবং ওয়েবসাইটে গিয়ে রিফান্ডের জন্য আবেদন করতে হবে।</li>
                        <li>আপনি টিউশনে অনিয়মিত হলে, যথাসময়ে না গেলে, অথবা নির্ধারিত সময় পর্যন্ত না পড়ালে—সেক্ষেত্রে টিউশন বাতিল হলেও মিডিয়া ফি ফেরতযোগ্য হবে না।</li>
                        <li>আপনার ব্যক্তিগত কারণে টিউশন ছেড়ে দিলে বা চালিয়ে যেতে না পারলে কোনো অবস্থাতেই মিডিয়া ফি ফেরত দেওয়া হবে না।</li>
                        <li>সবশেষে, টিউশন সেবা ফোরাম শিক্ষক ও অভিভাবকদের আস্থার একটি জায়গা। তাই এমন কোনো আচরণ, বক্তব্য বা কার্যকলাপ করা যাবে না যা টিউশন সেবা ফোরামের সুনাম, বিশ্বাসযোগ্যতা ও সম্মানকে ক্ষতিগ্রস্ত করে।</li>
                    </ol>
                    <p className="clickable" onClick={redirectToSite} style={{ marginTop: "5px" }}>Visit: tuitionsebaforum.com</p>
                </div>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={handlePrint}>Print</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentInvoice;
