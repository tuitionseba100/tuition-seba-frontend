import React from "react";
import { Modal, Button } from "react-bootstrap";
import {
    FaChalkboardTeacher,
    FaWhatsapp,
    FaUserEdit,
    FaMoneyBill,
    FaCheckCircle,
} from "react-icons/fa";

const PremiumTeacherModal = ({ show, handleClose }) => {
    const steps = [
        {
            icon: <FaWhatsapp />,
            title: "ধাপ ১",
            text: "WhatsApp-এ আপনার বর্তমান শিক্ষা প্রতিষ্ঠানের আইডি কার্ড বা ভর্তি রসিদের ছবি পাঠাতে হবে। আমরা এটি যাচাই করবো।",
        },
        {
            icon: <FaUserEdit />,
            title: "ধাপ ২",
            text: (
                <>
                    আমাদের ওয়েবসাইটে আপনার বায়োডাটা পূরণ করুন 👉{" "}
                    <a
                        href="https://www.tuitionsebaforum.com/teacherRegistration"
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontWeight: "bold", color: "blue" }}
                    >
                        https://www.tuitionsebaforum.com/teacherRegistration
                    </a>{" "}
                </>
            ),
        },

        {
            icon: <FaMoneyBill />,
            title: "ধাপ ৩",
            text: (
                <>
                    প্রিমিয়াম ফি: ২০০ টাকা (ফেরতযোগ্য নয়) <br />
                    <b>Bkash/Nagad (Personal): 01633920928</b> <br />
                    <b>Bkash App থেকে পেমেন্ট: 01714045039</b>
                </>
            ),
        },
        {
            icon: <FaCheckCircle />,
            title: "ধাপ ৪",
            text: "রেজিস্ট্রেশন সম্পন্ন হলে আপনি পাবেন রেজিস্টার সদস্য কোড। এরপর সব টিউশনে আবেদন করতে পারবেন আপনার কোড ব্যবহার করে।",
        },
    ];

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header
                closeButton
                style={{ background: "#0d6efd", color: "white", borderRadius: "10px 10px 0 0" }}
            >
                <Modal.Title>
                    <FaChalkboardTeacher style={{ marginRight: "8px" }} />
                    প্রিমিয়াম রেজিস্টার টিচার মেম্বারশিপ
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
                style={{
                    maxHeight: "70vh",
                    overflowY: "auto",
                    padding: "20px",
                    lineHeight: "1.7",
                }}
            >
                <h5 style={{ color: "#0d6efd", marginBottom: "15px" }}>আসসালামু আলাইকুম</h5>
                <p style={{ fontSize: "15px" }}>
                    আমরা বর্তমানে শুধুমাত্র <b>প্রিমিয়াম রেজিস্টার টিচারদের</b> টিউশন দিয়ে থাকি, কারণ আমরা চাই
                    আপনাদের সর্বোচ্চ মানের সেবা প্রদান করতে।
                </p>
                <p style={{ fontSize: "15px" }}>
                    আমরা গত ৫ বছর ধরে টিউশন মিডিয়া হিসেবে বিশ্বস্ততার সাথে কাজ করছি এবং অভিভাবক ও
                    শিক্ষক/শিক্ষিকাদের থেকে প্রচুর ইতিবাচক সাড়া পেয়েছি। <br />
                    প্রিমিয়াম রেজিস্টার টিচার মেম্বারশিপ নিলে আপনি একবার মেম্বার হয়ে সারাজীবনের জন্য আমাদের
                    সম্মানিত শিক্ষক/শিক্ষিকা হিসেবে যুক্ত থাকবেন।
                </p>

                <div
                    style={{
                        background: "#f1f8ff",
                        border: "1px solid #cce5ff",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                    }}
                >
                    <b>প্রশ্ন:</b> প্রিমিয়াম রেজিস্টার টিচার মেম্বারশিপ কি এখন নেওয়া যাবে? <br />
                    <b>উত্তর:</b> হ্যাঁ, নেওয়া যাবে। এজন্য কিছু ধাপ অনুসরণ করতে হবে:
                </div>

                <div style={{ marginTop: "10px" }}>
                    {steps.map((step, i) => (
                        <div key={i} style={{ display: "flex", marginBottom: "25px", position: "relative" }}>
                            <div
                                style={{
                                    minWidth: "45px",
                                    height: "45px",
                                    borderRadius: "50%",
                                    background: "#0d6efd",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontSize: "18px",
                                    zIndex: 2,
                                }}
                            >
                                {step.icon}
                            </div>
                            {i < steps.length - 1 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "45px",
                                        left: "21px",
                                        width: "3px",
                                        height: "100%",
                                        background: "#0d6efd",
                                        zIndex: 1,
                                    }}
                                ></div>
                            )}
                            <div style={{ marginLeft: "15px" }}>
                                <h6 style={{ fontWeight: "bold", color: "#0d6efd" }}>{step.title}</h6>
                                <p style={{ margin: 0 }}>{step.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        background: "#f8f9fa",
                        padding: "12px",
                        borderRadius: "8px",
                        marginTop: "20px",
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <b>বিঃদ্রঃ</b> মেম্বারশিপ না নিয়েও টিউশন নিতে পারবেন। এ ক্ষেত্রে{" "}
                    <b>৬০% মিডিয়া ফি অগ্রিম</b> দিতে হবে। আর মেম্বারশিপ থাকলে{" "}
                    <b>৩০% অগ্রিম এবং ৩০% বেতন পাওয়ার পর</b> দেয়ার সুযোগ আছে। <br />
                    📌 বিস্তারিত জানতে ভিজিট করুন:{" "}
                    <a href="https://www.tuitionsebaforum.com" target="_blank" rel="noreferrer">
                        www.tuitionsebaforum.com
                    </a>
                </div>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: "center" }}>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PremiumTeacherModal;
