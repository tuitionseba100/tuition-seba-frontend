import React, { useRef, useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const PaymentInvoice = ({ payment, show, onClose }) => {
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

  const handlePrint = () => {
    const invoiceHtml = invoiceRef.current.outerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Invoice</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
          <style>
            @page { size: A4; margin: 0; }
            body { font-family: 'Roboto', sans-serif; margin:0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .invoice-container { width: 210mm; height: 297mm; padding: 15mm; box-sizing: border-box; position: relative; background: #fff; color: #212529; font-size: 13px; }
            .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 60px; color: rgba(13,110,253,0.08); font-weight: bold; pointer-events: none; white-space: nowrap; z-index: 0; }
            .header-info h3 { margin: 0; font-size: 1.2rem; }
            .header-info p { margin: 0; font-size: 11px; }
            .invoice-title { font-size: 1.5rem; margin: 1rem 0; }
            .table-bordered th, .table-bordered td { border: 1px solid #0d6efd !important; vertical-align: middle; }
            .note-section { font-size: 11px; padding: 1rem; }
            a { text-decoration: none; color: #0d6efd; }
          </style>
        </head>
        <body>${invoiceHtml}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Body className="p-0">
        <div ref={invoiceRef} className="invoice-container">
          <div className="watermark">Tuition Seba Forum</div>

          <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom border-primary header-info" style={{ zIndex: 1, position: "relative" }}>
            <div className="d-flex align-items-center">
              {logoBase64 && (
                <a href="https://tuitionsebaforum.com" target="_blank" rel="noreferrer">
                  <img src={logoBase64} alt="Logo" style={{ height: "50px", marginRight: "10px", cursor: "pointer" }} />
                </a>
              )}
              <div>
                <h3>
                  <a href="https://tuitionsebaforum.com" target="_blank" rel="noreferrer" className="fw-bold text-primary">
                    Tuition Seba Forum
                  </a>
                </h3>
                <p className="text-muted">Masjid Goli, 2 Number Gate, Chattogram</p>
                <p className="text-muted">Phone: 01633-920928, 01714045039</p>
              </div>
            </div>
            <div className="text-end">
              <p className="mb-1 fw-bold text-primary">
                Date: <span className="fw-normal text-dark">
                  {`${String(new Date().getDate()).padStart(2, "0")}/${String(new Date().getMonth() + 1).padStart(2, "0")}/${new Date().getFullYear()}`}
                </span>

              </p>
              <p className="mb-0 fw-bold text-primary">
                Receipt No: <span className="fw-normal text-dark">{payment?._id}</span>
              </p>
            </div>
          </div>

          <h2 className="text-primary text-center invoice-title fw-bold">Payment Invoice</h2>

          <div className="mb-3">
            <h5 className="fw-bold text-primary mb-2">Personal Information</h5>
            <div style={{ display: "flex", gap: "10px", flexWrap: "nowrap" }}>
              <div style={{ flex: 1 }}>
                <div className="p-2 border border-primary rounded bg-light">
                  <span className="fw-bold text-primary">Name:</span> {payment?.name || "-"}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="p-2 border border-primary rounded bg-light">
                  <span className="fw-bold text-primary">Personal Phone:</span> {payment?.personalPhone || "-"}
                </div>
              </div>
            </div>
          </div>


          {/* Payment Details */}
          <div className="mb-3">
            <h5 className="fw-bold text-primary mb-2">Payment Details</h5>
            <table className="table table-bordered text-center">
              <tbody>
                <tr>
                  <th>Tuition Code</th>
                  <td>{payment?.tuitionCode || "-"}</td>
                  <th>Payment Type</th>
                  <td>{payment?.paymentType || "-"}</td>
                </tr>
                <tr>
                  <th>Payment Number</th>
                  <td>{payment?.paymentNumber || "-"}</td>
                  <th>Transaction ID</th>
                  <td>{payment?.transactionId || "-"}</td>
                </tr>
                <tr>
                  <th>Amount</th>
                  <td
                    style={{
                      color: "#0d6efd",
                      fontWeight: 900,
                      fontSize: "15px",
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                    }}
                  >
                    ৳ {parseFloat(payment?.amount || 0).toLocaleString()}
                  </td>
                  <th>Discount</th>
                  <td>{parseFloat(payment?.discount || 0).toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Due Amount</th>
                  <td>{parseFloat(payment?.dueAmount || 0).toLocaleString()}</td>
                  <th>Total Amount</th>
                  <td>{parseFloat(payment?.totalAmount || 0).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-end mt-3">
            <div className="text-center" style={{ width: "180px" }}>
              <div className="border-top border-dark my-2"></div>
              <span className="fw-bold">Authorized Signatory</span>
            </div>
          </div>

          <div className="note-section mt-3 bg-light rounded">
            <h5 className="fw-bold text-primary">শর্তাবলী:</h5>
            <ol className="text-muted" style={{ paddingLeft: "20px", margin: 0 }}>
              <li>অভিভাবকের নাম্বার পাওয়ার পর যত দ্রুত সম্ভব কথা বলে আমাদের জানাবেন। টিউশন কনফার্ম বা ক্যান্সেল হলে আমাদের জানাতে হবে। প্রথম এক মাস আমাদের সাথে নিয়মিত আপডেট দিতে হবে।</li>
              <li>অভিভাবকের সাথে মিডিয়া ফি নিয়ে কোনো ধরণের আলোচনা করা যাবে না।</li>
              <li>টিউশন কোনো কারণে বাতিল হলে আমাদেরকে অতিদ্রুত জানাতে হবে এবং ওয়েবসাইটে গিয়ে রিফান্ডের জন্য আবেদন করতে হবে।</li>
              <li>আপনি টিউশনে অনিয়মিত হলে, যথাসময়ে না গেলে, অথবা নির্ধারিত সময় পর্যন্ত না পড়ালে—সেক্ষেত্রে টিউশন বাতিল হলেও মিডিয়া ফি ফেরতযোগ্য হবে না।</li>
              <li>আপনার ব্যক্তিগত কারণে টিউশন ছেড়ে দিলে বা চালিয়ে যেতে না পারলে কোনো অবস্থাতেই মিডিয়া ফি ফেরত দেওয়া হবে না।</li>
              <li>সবশেষে, টিউশন সেবা ফোরাম শিক্ষক ও অভিভাবকদের আস্থার একটি জায়গা। তাই এমন কোনো আচরণ, বক্তব্য বা কার্যকলাপ করা যাবে না যা টিউশন সেবা ফোরামের সুনাম, বিশ্বাসযোগ্যতা ও সম্মানকে ক্ষতিগ্রস্ত করে।</li>
            </ol>
            <p className="text-primary text-center fw-bold mt-2 mb-0">
              <a href="https://tuitionsebaforum.com" target="_blank" rel="noreferrer">Visit: tuitionsebaforum.com</a>
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between border-top">
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={handlePrint}>Print Invoice</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentInvoice;
