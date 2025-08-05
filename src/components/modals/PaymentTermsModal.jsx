import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PaymentTermsModal = ({ show, handleClose }) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            size="lg"
            backdrop="static"
            contentClassName="rounded-5 shadow-lg overflow-hidden animate__animated animate__fadeIn"
            dialogClassName="modal-dialog-centered modal-lg"
        >
            <Modal.Header
                closeButton
                className="text-white p-4"
                style={{ background: 'linear-gradient(135deg, #6f42c1, #0d6efd)', borderBottom: 'none' }}
            >
                <Modal.Title id="paymentTermsLabel" className="fw-bold fs-4">
                    📜 Payment Terms and Condition
                </Modal.Title>
            </Modal.Header>

            <Modal.Body
                className="px-5 py-4 text-secondary"
                style={{ fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 500 }}
            >
                <h6 className="fw-semibold mb-3">Payment policy:</h6>
                <ul className="list-unstyled">
                    <li className="mb-2">
                        আসসালামু আলাইকুম, আমাদের মিডিয়া ফি সিস্টেম এমনভাবে করেছি যাতে আপনার এবং আমার উভয়ের সুবিধা হয়।
                        যেমনঃ আমাদের মিডিয়া ফি ৬০%। এর ৩০% অগ্রিম দিতে হবে এবং ৩০% বেতন পেয়ে দিয়ে দিবেন। ৩০% অগ্রিম আপনি
                        বিকাশে/নগদে/রকেটে বা অফিসে এসে দিতে পারবেন। যদি অফিসে আসতে পারেন তাহলে খুবই ভালো হবে।
                    </li>
                    <li className="mb-2">
                        অগ্রিম ৩০% দিতে না চাইলে আমরা আসলে দুঃখিত। বিগত চারবছরে অগ্রিম না নিয়ে কিছু কিছু দেয়ার চেষ্টা
                        করেছি। তারা নাম্বার পাওয়ার পর অনেক অযুহাত দেয় যা অগ্রহণযোগ্য এই যেমন কেউ কেউ বলে ভুলে গেছিলাম,
                        কল দিতে পারি নাই, পড়াবো না আব্বু আম্মু মানা করে, এমন নানা অযুহাত৷ এবং এগুলো তারা জানায় না পর্যন্ত।
                        আর আপনি ৩০% যা অগ্রিম দিবেন তা যদি টিউশন না হয় ক্যান্সেল হয় আপনি ক্লেইম করার ২৪ ঘন্টার মধ্যে টাকা
                        পেয়ে যাবেন৷ আজ পর্যন্ত টাকা রিটার্ন দেই নাই ঘুরাইছি এমন কোনো অভিযোগ নাই।
                    </li>
                    <li className="mb-2">
                        আমাদের কেন অগ্রিম দিবেন? আমরা বিগত চার বছর সততার সাথে লেনদেন করতেছি, আমাদের আছে ট্রেড
                        লাইসেন্স, আমাদের আছে অফিস, আমাদের আছে ওয়েবসাইট। এরপরেও আপনি যদি ভরসা করতে না পারেন আমরাও
                        আপনাকে ভরসা করতে পারছি না। আবারো আন্তরিকতার সাথে ধন্যবাদ
                    </li>
                </ul>

                <div
                    className="alert alert-info mt-4 border-0 shadow-sm rounded-4"
                    role="alert"
                    style={{ fontWeight: 500, fontSize: '1rem' }}
                >
                    ❓ <em>কোনো কিছু না বুঝলে বা ব্যাখ্যার প্রয়োজন হলে নির্দ্বিধায় যোগাযোগ করুন।</em>
                </div>
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer
                className="bg-light p-3 justify-content-end border-top"
                style={{ borderTopColor: '#dee2e6' }}
            >
                <Button
                    variant="dark"
                    className="px-4 py-2 rounded-pill d-flex align-items-center"
                    onClick={handleClose}
                >
                    <i className="bi bi-x-circle me-2" style={{ fontSize: '1.2rem' }}></i> Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentTermsModal;
