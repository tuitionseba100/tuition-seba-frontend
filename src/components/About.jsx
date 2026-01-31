import React from "react";
import { Container, Row, Col, Button, Image, Card } from "react-bootstrap";
import { FaWhatsapp, FaFacebookF, FaPhoneAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";


const AboutUs = () => {
    return (
        <section id="about-us" style={{ backgroundColor: "#f4f7fa", padding: "60px 0" }}>
            <Container>
                <Card className="shadow-lg border-0 p-4 rounded-4">
                    <Row className="align-items-center">
                        <Col md={4} className="text-center mb-4 mb-md-0">
                            <Image
                                src="/img/Mahedi.jpeg"
                                roundedCircle
                                fluid
                                style={{
                                    width: "180px",
                                    height: "180px",
                                    objectFit: "cover",
                                    border: "4px solid #0d6efd",
                                }}
                                alt="Md Mahedi Hasan"
                            />
                            <h5 className="mt-4 fw-bold text-dark">Md Mahedi Hasan</h5>
                            <p className="text-muted mb-3">Founder & CEO</p>
                            <div>
                                <Button
                                    variant="success"
                                    href="https://wa.me/88001633920928"
                                    target="_blank"
                                    className="me-2 px-3"
                                >
                                    <FaWhatsapp className="me-2" />
                                    WhatsApp
                                </Button>
                                <Button
                                    variant="primary"
                                    href="https://facebook.com"
                                    target="_blank"
                                    className="px-3"
                                >
                                    <FaFacebookF className="me-2" />
                                    Facebook
                                </Button>
                            </div>
                        </Col>

                        <Col md={8}>
                            <h3 className="fw-semibold text-primary mb-3">About Tuition Seba Forum</h3>
                            <p style={{ lineHeight: "1.8", fontSize: "16px", color: "#333" }}>
                                Tuition Seba Forum একটি সুপ্রতিষ্ঠিত এবং বাংলাদেশের অন্যতম একটি টিউশন
                                মিডিয়া। আমাদের রয়েছে নিজস্ব অফিস ও দীর্ঘ কয়েক বছরের টিউশন ও গৃহশিক্ষক ও
                                শিক্ষিকা দেয়ার অভিজ্ঞতা। আস্থা ও বিশ্বস্ততায় আমরা একধাপ এগিয়ে।
                            </p>
                        </Col>
                    </Row>

                    <hr className="my-5" />

                    <Row>
                        <Col md={6} className="mb-4 mb-md-0">
                            <h5 className="fw-bold text-dark mb-3">
                                <FaMapMarkerAlt className="me-2 text-danger" />
                                Our Location
                            </h5>
                            <p style={{ lineHeight: "1.8", fontSize: "15px", color: "#555" }}>
                                ২ নাম্বার গেইট এর বিপ্লব উদ্যানের অপজিটে মসজিদ গলির মুখে ঢুকে জাস্ট ১
                                মিনিট লাগবে, হাতের বামে ১ম বিল্ডিং, ৯২৪, মোশারফ মার্কেট এর ৩য় তলায়।
                                খুব সহজে খুজে পাওয়ার জন্য আমাদের বিলবোর্ড দেয়া আছে। শাহজালাল
                                ডিপার্টমেনন্টাল স্টোরের উপরে ৩য় তলায় অফিস।
                            </p>
                        </Col>

                        <Col md={6}>
                            <h5 className="fw-bold text-dark mb-3">
                                <FaPhoneAlt className="me-2 text-success" />
                                Contact
                            </h5>
                            <p style={{ fontSize: "15px", color: "#555" }}>
                                <strong>Phone:</strong> 01633920928<br />
                                <FaClock className="me-2 mt-2 text-warning" />
                                <strong>Office Time:</strong> প্রতিদিন সকাল ১০টা থেকে রাত ১০টা পর্যন্ত<br />
                                <span style={{ color: "#dc3545" }}>★ শুক্রবার বন্ধ</span>
                            </p>
                        </Col>
                    </Row>
                </Card>
            </Container>
        </section>
    );
};

export default AboutUs;
