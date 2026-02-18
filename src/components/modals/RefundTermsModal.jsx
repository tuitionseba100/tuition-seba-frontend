import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styled, { createGlobalStyle } from 'styled-components';

const BanglaFont = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Mina:wght@400;700&display=swap');
  
  .premium-refund-modal, 
  .premium-refund-modal h1, 
  .premium-refund-modal h2, 
  .premium-refund-modal h3, 
  .premium-refund-modal h4, 
  .premium-refund-modal h5, 
  .premium-refund-modal h6, 
  .premium-refund-modal p, 
  .premium-refund-modal span, 
  .premium-refund-modal li, 
  .premium-refund-modal div {
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
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
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

const IntroSection = styled.div`
  background: #f1f5f9;
  padding: 1.25rem;
  border-radius: 16px;
  border-left: 4px solid #4f46e5;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  font-weight: 500;
`;

const PolicyList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PolicyItem = styled.li`
  display: flex;
  gap: 16px;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  margin-bottom: 8px;

  &:hover {
    background: #f8fafc;
    transform: translateX(4px);
  }

  span.number {
    background: #4f46e5;
    color: white;
    width: 28px;
    height: 28px;
    min-width: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .content {
    line-height: 1.6;
    font-size: 1.05rem;
  }
`;

const WarningBox = styled.div`
  background: #fff1f2;
  border: 1px dashed #fb7185;
  color: #be123c;
  padding: 1rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  font-weight: 600;
  text-align: center;
`;

const CommitmentBox = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #bbf7d0;
  
  h6 {
    color: #166534;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  p {
    color: #15803d;
    margin: 0;
    font-size: 0.95rem;
  }
`;

const RefundTermsModal = ({ show, handleClose }) => {
  return (
    <>
      <BanglaFont />
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        backdrop="static"
        className="premium-refund-modal"
        contentAs={ModalContent}
      >
        <GradientHeader closeButton>
          <Modal.Title id="refundTermsLabel">
            <span style={{ fontSize: '1.5rem' }}>📜</span> Refund Policy - TSF
          </Modal.Title>
        </GradientHeader>

        <StyledBody>
          <IntroSection>
            Tuition Seba Forum শিক্ষক ও অভিভাবকের মধ্যে একটি নির্ভরযোগ্য সংযোগ প্ল্যাটফর্ম। উভয় পক্ষের স্বার্থ ও ন্যায্যতা নিশ্চিত করতে নিচের নীতিমালা প্রযোজ্য।
          </IntroSection>

          <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
            <span style={{ color: '#4f46e5' }}>🔹</span> রিফান্ড নীতি
          </h5>

          <PolicyList>
            {[
              "প্রতিষ্ঠানের ভুল বা তথ্যগত অমিল থাকলে সম্পূর্ণ মিডিয়া ফি ফেরত প্রদান করা হবে।",
              "রিফান্ড সময়সীমা: সকল যাচাই-বাছাই শেষে সর্বোচ্চ ৭২ ঘণ্টার মধ্যে রিফান্ড সম্পন্ন করা হবে।",
              "শিক্ষক নিজ থেকে টিউশন বাতিল করলে বিশেষ কারণ ছাড়া রিফান্ড প্রযোজ্য হবে না। যৌক্তিক কারণ থাকলে আলোচনার মাধ্যমে সিদ্ধান্ত নেওয়া হবে।",
              "টিউশনে ১ম দিন সাক্ষাৎ এর সময় ছাত্র/ছাত্রী, ক্লাস, বিষয়, সময়, দিন, বেতন ও লোকেশন যাচাই করে আমাদের নিশ্চিত করবেন। সম্মতির পর অযৌক্তিক পরিবর্তন বা বাতিল করলে মিডিয়া ফি প্রযোজ্য হবে।",
              "ডেমো ক্লাসের মাধ্যমে উভয় পক্ষ সন্তুষ্ট হলে টিউশন কনফার্ম হবে। কনফার্ম হওয়ার পর অকারণে বাতিল করা যাবে না।",
              "কনফার্মের পর শিক্ষক নিজ থেকে বাতিল করলে সম্পূর্ণ মিডিয়া ফি প্রযোজ্য হবে, কারণ একটি টিউশন সংগ্রহ ও কনফার্ম করতে প্রতিষ্ঠানের ব্যয় হয়।",
              "প্রথম মাসের মধ্যে অভিভাবক বাতিল করলে প্রদত্ত মিডিয়া ফি ফেরতযোগ্য। তবে অভিভাবক প্রদত্ত বেতনের অর্ধেক আপনি পাবেন এবং বাকি অর্ধেক আমাদের দিতে হবে সার্ভিস চার্জ হিসেবে।",
              "প্রথম মাসের পর টিউশন ধরে রাখা শিক্ষক-এর দায়িত্বশীলতা ও পারফরম্যান্সের উপর নির্ভরশীল। এ সময়ের পর কোনো আর্থিক অভিযোগ গ্রহণযোগ্য নয়।",
              "নিয়মিত ও সময়মতো ক্লাস নেওয়া বাধ্যতামূলক।",
              "টিউশনে পড়ানোর সময় অপ্রয়োজনীয় মোবাইল ব্যবহার নিষিদ্ধ।",
              "ভুল পাঠদান, অবহেলা বা অশোভন আচরণের প্রমাণ পাওয়া গেলে ব্যবস্থা নেওয়া হবে।",
              "বেতন/সময়/দিন পরিবর্তন বা অযৌক্তিক কারণে টিউশন বাতিল করলে মিডিয়া ফি প্রযোজ্য হবে।",
              "আমাদের যেসব টিউশনে ২ ঘন্টা উল্লেখ থাকে তা ২ ঘন্টা এবং যেসব টিউশনে উল্লেখ থাকেনা সেসব টিউশনে আমাদের সময় সর্বনিম্ন দেড় ঘন্টা এবং সর্বোচ্চ দুইঘন্টা সময় নিয়ে পড়াতে হবে।"
            ].map((text, index) => (
              <PolicyItem key={index}>
                <span className="number">{index + 1}</span>
                <div className="content">{text}</div>
              </PolicyItem>
            ))}
          </PolicyList>

          <WarningBox>
            ⚠️ উপরোক্ত ৯, ১০, ১১, ১২ ও ১৩ এর কোনো রুলস না মানলে এর জন্য মিডিয়া ফি প্রযোজ্য হবে।
          </WarningBox>

          <CommitmentBox>
            <h6>✅ আমাদের অঙ্গীকার</h6>
            <p>
              আমরা ন্যায্যতা, স্বচ্ছতা এবং পেশাদার মান বজায় রেখে শিক্ষক ও অভিভাবকের জন্য নিরাপদ ও নির্ভরযোগ্য সেবা প্রদান করি। তাই আমাদের উপরোক্ত শর্তাবলীর কোনো কিছু না বুঝলে বা ব্যাখ্যার প্রয়োজন হলে আমাদের সাথে যোগাযোগ করুন।
            </p>
          </CommitmentBox>
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

export default RefundTermsModal;
