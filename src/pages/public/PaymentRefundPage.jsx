import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { FaInfoCircle } from 'react-icons/fa';
import PaymentModal from '../../components/modals/PaymentModal';
import RefundModal from '../../components/modals/RefundModal';
import PaymentTermsModal from '../../components/modals/PaymentTermsModal';
import RefundTermsModal from '../../components/modals/RefundTermsModal';
import SmallPaymentOptions from '../../components/SmallPaymentOptions';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const PaymentRefundPage = () => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [showPaymentTerms, setShowPaymentTerms] = useState(false);
    const [showRefundTerms, setShowRefundTerms] = useState(false);

    return (
        <>
            <NavBar />
            <Container className="my-5">
                <ToastContainer position="top-center" autoClose={2500} />
                <SmallPaymentOptions />
                <Row className="justify-content-center mb-4">
                    <Col md={8}>
                        <Card className="shadow-sm rounded-4 p-4 border-0">
                            <p className="text-center mb-4">
                                টিউশন সেবা ফোরাম-এ পেমেন্ট করতে নিচের ফর্মটি পূরণ করুন। অথবা আমাদের কল করুন:{" "}
                                <span className="fw-bold text-success">01633920928</span>
                            </p>

                            <div className="mb-4">
                                <Row className="text-center">
                                    <Col xs={12} md={6} className="mb-3 mb-md-0">
                                        <div className="d-flex justify-content-center align-items-center bg-light p-3 rounded-3 shadow-sm">
                                            <span className="fw-semibold me-2 text-primary">পেমেন্টের শর্তাবলি</span>
                                            <FaInfoCircle
                                                size={20}
                                                style={{ color: 'blue', cursor: 'pointer' }}
                                                title="View Payment Terms"
                                                onClick={() => setShowPaymentTerms(true)}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <div className="d-flex justify-content-center align-items-center bg-light p-3 rounded-3 shadow-sm">
                                            <span className="fw-semibold me-2 text-danger">রিফান্ডের শর্তাবলি</span>
                                            <FaInfoCircle
                                                size={20}
                                                style={{ color: 'red', cursor: 'pointer' }}
                                                title="View Refund Terms"
                                                onClick={() => setShowRefundTerms(true)}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            <hr />

                            <div className="text-center mb-2">
                                <p className="fw-bold mb-2">Choose an Action</p>
                                <Row className="justify-content-center">
                                    <Col xs={12} sm={6} className="mb-2">
                                        <Button
                                            variant="primary"
                                            className="w-100 rounded-3"
                                            onClick={() => setShowPaymentModal(true)}
                                        >
                                            Make Payment
                                        </Button>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Button
                                            variant="danger"
                                            className="w-100 rounded-3"
                                            onClick={() => setShowRefundModal(true)}
                                        >
                                            Request Refund
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <PaymentModal show={showPaymentModal} handleClose={() => setShowPaymentModal(false)} />
                <RefundModal show={showRefundModal} handleClose={() => setShowRefundModal(false)} />
                <PaymentTermsModal show={showPaymentTerms} handleClose={() => setShowPaymentTerms(false)} />
                <RefundTermsModal show={showRefundTerms} handleClose={() => setShowRefundTerms(false)} />
            </Container>
            <Footer />
        </>
    );
};

export default PaymentRefundPage;
