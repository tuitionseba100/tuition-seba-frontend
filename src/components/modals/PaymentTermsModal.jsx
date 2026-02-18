import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styled, { createGlobalStyle } from 'styled-components';

const BanglaFont = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Mina:wght@400;700&display=swap');
  
  .premium-payment-modal, 
  .premium-payment-modal h1, 
  .premium-payment-modal h2, 
  .premium-payment-modal h3, 
  .premium-payment-modal h4, 
  .premium-payment-modal h5, 
  .premium-payment-modal h6, 
  .premium-payment-modal p, 
  .premium-payment-modal span, 
  .premium-payment-modal li, 
  .premium-payment-modal div {
    font-family: 'Mina', sans-serif !important;
  }
`;

const ModalContent = styled.div`
  border: none;
  border-radius: 24px !important;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
`;

const GradientHeader = styled(Modal.Header)`
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
  border: none;
  padding: 2rem !important;
  
  .modal-title {
    color: white;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .btn-close {
    filter: brightness(0) invert(1);
    opacity: 0.8;
    &:hover { opacity: 1; }
  }
`;

const StyledBody = styled(Modal.Body)`
  padding: 2.5rem !important;
  color: #334155;

  @media (max-width: 768px) {
    padding: 1.5rem !important;
  }
`;

const HighlightBox = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 16px;
  border-left: 4px solid #6366f1;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.6;
`;

const SectionTitle = styled.h6`
  color: #4f46e5;
  font-weight: 700;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.15rem;
`;

const FeeCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const MethodList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 1.5rem;
`;

const MethodItem = styled.div`
  background: #f1f5f9;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #475569;
`;

const AlertBanner = styled.div`
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  font-size: 0.95rem;
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

const InfoCard = styled.div`
  background: #f0f9ff;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #bae6fd;
  margin-bottom: 2rem;

  h6 { color: #0369a1; font-weight: 700; }
  p { color: #0c4a6e; margin-bottom: 8px; font-size: 1rem; }
  ol { margin: 0; padding-left: 1.25rem; color: #075985; }
`;

const TrustSection = styled.div`
  padding: 1.5rem 0;
  border-top: 1px solid #f1f5f9;
`;

const PaymentTermsModal = ({ show, handleClose }) => {
  return (
    <>
      <BanglaFont />
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        backdrop="static"
        className="premium-payment-modal"
        contentAs={ModalContent}
      >
        <GradientHeader closeButton>
          <Modal.Title id="paymentTermsLabel">
            <span style={{ fontSize: '1.5rem' }}>📜</span> Payment Terms & Conditions - TSF
          </Modal.Title>
        </GradientHeader>

        <StyledBody>
          <HighlightBox>
            Tuition Seba Forum শিক্ষক ও অভিভাবকের মধ্যে নিরাপদ ও স্বচ্ছ লেনদেন নিশ্চিত করতে একটি নির্দিষ্ট মিডিয়া ফি সিস্টেম অনুসরণ করে তাই পেমেন্ট করার পর অবশ্যই অনালাইন বা অফলাইন রশিদ বুঝে নিবেন।
          </HighlightBox>

          <SectionTitle>🔹 মিডিয়া ফি কাঠামো</SectionTitle>
          <FeeCard>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
              <li className="d-flex align-items-center gap-2">
                <span style={{ color: '#6366f1' }}>●</span>
                <strong>মোট মিডিয়া ফি:</strong> প্রথম মাসের বেতনের ৬০%
              </li>
              <li className="d-flex align-items-center gap-2">
                <span style={{ color: '#6366f1' }}>●</span>
                <strong>৩০% অগ্রিম:</strong> অভিভাবকের নম্বর নেওয়ার পূর্বে
              </li>
              <li className="d-flex align-items-start gap-2">
                <span style={{ color: '#6366f1', marginTop: '6px' }}>●</span>
                <div>
                  <strong>বাকি ৩০%:</strong> প্রথম মাসের বেতন পাওয়ার পর
                  <div className="text-danger fw-bold mt-1" style={{ fontSize: '0.9rem' }}>
                    [বেতন পাওয়ার পর বকেয়া পরিশোধ করতে হবে। কোনোভাবেই ২৪ ঘন্টার বেশি সময় নেয়া যাবে না]
                  </div>
                </div>
              </li>
            </ul>
          </FeeCard>

          <SectionTitle>🔹 পেমেন্ট পদ্ধতি</SectionTitle>
          <p className="mb-3 fw-medium">অগ্রিম ও বকেয়া পরিশোধ করা যাবে:</p>
          <MethodList>
            <MethodItem><span>✅</span> অনলাইনে বিকাশ, নগদ, রকেট থেকে</MethodItem>
            <MethodItem><span>✅</span> সরাসরি অফিস পেমেন্ট</MethodItem>
          </MethodList>

          <AlertBanner>
            <span>⚠️</span>
            <div>আমাদের ওয়েবসাইট ও অ্যাপে দেওয়া অফিসিয়াল নম্বর ব্যতীত অন্য কোনো মাধ্যমে লেনদেন গ্রহণযোগ্য নয়।</div>
          </AlertBanner>

          <InfoCard>
            <SectionTitle style={{ color: '#0369a1' }}>🔹 অগ্রিম ফি সংক্রান্ত নীতি</SectionTitle>
            <p>অগ্রিম ফি প্রদান বাধ্যতামূলক। অভিভাবকের নম্বর শেয়ারের পূর্বে অগ্রিম পরিশোধ করতে হবে।</p>
            <h6 className="mt-3 mb-2">অগ্রিম ফি চালুর উদ্দেশ্য:</h6>
            <ol>
              <li>টিউশন কনফার্মেশন নিশ্চিত করা</li>
              <li>অপ্রয়োজনীয় বাতিল বা সময় নষ্ট কমানো</li>
              <li>শিক্ষক ও প্রতিষ্ঠানের উভয়ের দায়বদ্ধতা নিশ্চিত করা</li>
            </ol>
          </InfoCard>

          <SectionTitle>🔹 অগ্রিম ফি রিফান্ড</SectionTitle>
          <p className="mb-4">
            টিউশন কনফার্ম না হলে বা ক্যান্সেল হলে আপনার রিফান্ডের আবেদন করার সর্বোচ্চ <strong>৭২ ঘণ্টার</strong> মধ্যে যাচাই-বাছাই করে অগ্রিম টাকা ফেরত প্রদান করা হবে। আমরা স্বচ্ছ ও নিরাপদ লেনদেনে প্রতিশ্রুতিবদ্ধ।
          </p>

          <TrustSection>
            <SectionTitle>🔹 আমাদের বিশ্বাসযোগ্যতা</SectionTitle>
            <p className="mb-3">Tuition Seba Forum একটি নিবন্ধিত ও বিশ্বস্ত প্ল্যাটফর্ম:</p>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {['ট্রেড লাইসেন্সপ্রাপ্ত', 'নিজস্ব অফিস সুবিধা', 'অফিসিয়াল অ্যাপ ও ওয়েবসাইট'].map((item, i) => (
                <span key={i} className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill">
                  ✅ {item}
                </span>
              ))}
            </div>
            <p className="fw-bold text-success mb-0">আমরা দীর্ঘদিন ধরে সততার সাথে সেবা প্রদান করে আসছি।</p>
          </TrustSection>

          <div className="mt-4 p-4 rounded-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <h6 className="fw-bold mb-2">❓ সহায়তা প্রয়োজন?</h6>
            <p className="mb-0 text-muted">কোনো বিষয় বুঝতে অসুবিধা হলে আমাদের সাথে নির্দ্বিধায় যোগাযোগ করুন।</p>
          </div>
        </StyledBody>

        <Modal.Footer className="border-0 p-4 pt-0">
          <Button
            variant="dark"
            className="px-5 py-2 fw-bold rounded-pill shadow-sm"
            onClick={handleClose}
            style={{ transition: 'all 0.3s' }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PaymentTermsModal;
