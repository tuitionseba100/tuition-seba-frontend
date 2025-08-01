import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const RefundTermsModal = ({ show, handleClose }) => {
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
            {/* Header with gradient background */}
            <Modal.Header
                closeButton
                className="text-white p-4"
                style={{ background: 'linear-gradient(135deg, #6f42c1, #0d6efd)', borderBottom: 'none' }}
            >
                <Modal.Title id="refundTermsLabel" className="fw-bold fs-4">
                    📜 রিফান্ড নীতিমালা
                </Modal.Title>
            </Modal.Header>

            {/* Modal Body */}
            <Modal.Body
                className="px-5 py-4 text-secondary"
                style={{ fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 500 }}
            >
                <h6 className="fw-semibold mb-3">ফি রিটার্ণ পলিসি:</h6>
                <ul className="list-unstyled">
                    <li className="mb-2">
                        <strong>১.</strong> অভিভাবক থেকে টিউশন কনফার্ম হওয়ার পরে এক সপ্তাহ পড়ানোর পর মানা করে দিলে মিডিয়া
                        ফি এর <strong>১০০%</strong> ফেরত পাবেন।
                    </li>
                    <li className="mb-2">
                        <strong>২.</strong> অভিভাবক থেকে টিউশন কনফার্ম হওয়ার পর দুই সপ্তাহ পড়ানোর পর মানা করে দিলে মিডিয়া
                        ফি এর <strong>৭৫%</strong> ফেরত পাবেন।
                    </li>
                    <li className="mb-2">
                        <strong>৩.</strong> অভিভাবক থেকে টিউশন কনফার্ম হওয়ার পর এক মাস পড়িয়েছেন। এক মাসের বেতন দিয়ে মানা করে
                        দিলে মিডিয়া ফি এর <strong>৫০%</strong> ফেরত পাবেন।
                    </li>
                    <li className="mb-2">
                        <strong>৪.</strong> আমার কোনো ভুল/কথার সাথে মিল না থাকলে <strong>পুরো টাকা ফেরত</strong>। বিশেষ কারণ
                        ছাড়া আপনি ছেড়ে দিলে পাবেন না। তবে যদি প্রাসঙ্গিক কোনো কারণ দেখাতে পারেন সে বিষয়ে কথা বলে উভয়
                        পক্ষ থেকে সিদ্ধান্ত নিবো। কোনো কিছু না বুঝতে পারলে আরও বিস্তারিত আলোচনার জন্য প্রশ্ন করুন আমাকে।
                    </li>
                    <li className="mb-2">
                        <strong>৫.</strong> প্রথম মাসের পর টিউশন ধরে রাখা আপনার দায়িত্বশীলতা এবং পারফরম্যান্সের নির্ভর করে। তাই
                        প্রথম মাসের বেতন পাওয়ার পর আর কোন অভিযোগ গ্রহণযোগ্য হবে না।
                    </li>
                    <li className="mb-2">
                        <strong>৬.</strong> টিউশন বাতিল হলে যেদিন বাতিল হয়েছে সেদিন থেকে ১৫ দিনের মধ্যে অন্য টিউশন রিপ্লেস
                        দেওয়া হবে। ১৫ দিনের মধ্যে রিপ্লেস না হলে পরবর্তী ৭ দিনের মধ্যে রিফান্ড পলিসি অনুযায়ী আপনার সার্ভিস
                        চার্জ রিফান্ড দেওয়া হবে।
                    </li>
                    <li className="mb-2">
                        <strong>৭.</strong> আপনি টিউশনে অনিয়মিত, যত সময় পড়ানোর কথা তত সময় দিচ্ছেন না সেক্ষেত্রে টিউশন চলে
                        গেলে কোন সার্ভিস চার্জ ফেরত দেওয়া হবে না।
                    </li>
                    <li className="mb-2">
                        <strong>৮.</strong> আপনার ব্যক্তিগত কারণে টিউশন চলে গেলে অথবা ছেড়ে দিলে কোন সার্ভিস চার্জ ফেরত দেওয়া
                        হবে না।
                    </li>
                    <li className="mb-2">
                        <strong>৯.</strong> মেয়ে টিচারদের ক্ষেত্রে গার্ডিয়ানের বাসায় প্রথম দিন যাওয়ার সময় অবশ্যই একজন পুরুষ
                        গার্ডিয়ান সাথে নিয়ে যাবেন।
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

export default RefundTermsModal;
