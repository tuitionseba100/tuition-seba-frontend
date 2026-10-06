import{r as o,j as e,N as j,e as y,R as f,f as x,aS as N,aT as v,B as w,S as C,aU as S,aw as F,A as L,d as X,y as l,a as k,g as _}from"./index-4XyAQfHM.js";import{d as i}from"./styled-components.browser.esm-BYeEUAai.js";import{F as a}from"./Form-cvecZf2_.js";const G="'Hind Siliguri', 'Inter', sans-serif",q=()=>{const[s,d]=o.useState({type:"complain",category:"payment_issue",name:"",phone:"",teacherCode:"",description:""}),[c,m]=o.useState(!1),[u,p]=o.useState(!1),r=(t,n)=>{d(g=>({...g,[t]:n}))},b=async t=>{if(t.preventDefault(),!s.name.trim()||!s.phone.trim()||!s.description.trim()){l.error("অনুগ্রহ করে সবগুলি বাধ্যতামূলক ফিল্ড পূরণ করুন।");return}m(!0);try{await k.post("https://tuition-seba-backend-1.onrender.com/api/complaintSuggestion/submit",s),p(!0),l.success("আপনার আবেদনটি সফলভাবে জমা হয়েছে।")}catch(n){console.error("Submission error:",n),l.error(n.response?.data?.message||"আবেদন জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।")}finally{m(!1)}};return e.jsxs(e.Fragment,{children:[e.jsx(j,{}),e.jsxs(z,{style:{fontFamily:G},children:[e.jsx(y,{className:"d-flex justify-content-center align-items-center",children:e.jsx(A,{className:"border-0 shadow-lg p-4 p-md-5 rounded-4",children:e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"text-center mb-4 pb-3 border-bottom",children:[e.jsx("h2",{className:"fw-bold text-primary mb-3",children:"অভিযোগ অথবা পরামর্শ"}),e.jsx("div",{className:"p-3 mb-3 bg-light rounded-3 shadow-sm border border-primary border-opacity-10",children:e.jsx("p",{className:"mb-0 text-muted",style:{fontSize:"15px",lineHeight:"1.6"},children:"সম্মানিত গ্রাহক, টিউশন সেবা ফোরাম-এর প্রতি আপনার অটুট আস্থা ও ভালোবাসার জন্য আমরা আন্তরিকভাবে কৃতজ্ঞ। আমাদের সেবাকে আপনার জন্য আরও নিখুঁত ও আরামদায়ক করে তুলতে আপনার সুচিন্তিত পরামর্শ বা যেকোনো অভিযোগ আমাদের কাছে অমূল্য সম্পদ। অনুগ্রহ করে নির্দ্বিধায় আপনার মতামত আমাদের জানান, আপনার সর্বোচ্চ সন্তুষ্টি নিশ্চিত করতে আমরা সবসময় আপনার পাশে আছি।"})}),e.jsx("p",{className:"text-muted small mt-2",children:"নিচের ফর্মে আপনার সঠিক তথ্য এবং বিস্তারিত বিবরণ দিয়ে আবেদনটি সম্পন্ন করুন।"})]}),e.jsxs(a,{onSubmit:b,children:[e.jsxs(f,{className:"mb-4 text-center",children:[e.jsx(x,{xs:6,children:e.jsxs(h,{active:s.type==="complain",onClick:()=>r("type","complain"),className:"p-3 rounded-3 cursor-pointer",children:[e.jsx(N,{size:24,className:"mb-2 text-danger"}),e.jsx("div",{className:"fw-bold",children:"অভিযোগ করুন"})]})}),e.jsx(x,{xs:6,children:e.jsxs(h,{active:s.type==="suggestion",onClick:()=>r("type","suggestion"),className:"p-3 rounded-3 cursor-pointer",children:[e.jsx(v,{size:24,className:"mb-2 text-success"}),e.jsx("div",{className:"fw-bold",children:"পরামর্শ দিন"})]})})]}),e.jsxs(a.Group,{className:"mb-3",children:[e.jsxs(a.Label,{className:"fw-semibold text-secondary",children:["ক্যাটাগরি নির্বাচন করুন ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs(a.Select,{value:s.category,onChange:t=>r("category",t.target.value),className:"rounded-3 py-2",children:[e.jsx("option",{value:"payment_issue",children:"পেমেন্ট সংক্রান্ত সমস্যা"}),e.jsx("option",{value:"agent_behavior",children:"এজেন্টের ব্যবহার/আচরণ"}),e.jsx("option",{value:"technical_issue",children:"অ্যাপ বা ওয়েবসাইট সংক্রান্ত সমস্যা"}),e.jsx("option",{value:"tuition_issue",children:"টিউশন সংক্রান্ত সমস্যা"}),e.jsx("option",{value:"other",children:"অন্যান্য"})]})]}),e.jsxs(a.Group,{className:"mb-3",children:[e.jsxs(a.Label,{className:"fw-semibold text-secondary",children:["আপনার নাম ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx(a.Control,{type:"text",placeholder:"আপনার নাম লিখুন",value:s.name,onChange:t=>r("name",t.target.value),className:"rounded-3 py-2",required:!0})]}),e.jsxs(a.Group,{className:"mb-3",children:[e.jsxs(a.Label,{className:"fw-semibold text-secondary",children:["মোবাইল নম্বর ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx(a.Control,{type:"tel",placeholder:"০১XXXXXXXXX",value:s.phone,onChange:t=>r("phone",t.target.value),className:"rounded-3 py-2",required:!0})]}),e.jsxs(a.Group,{className:"mb-3",children:[e.jsx(a.Label,{className:"fw-semibold text-secondary",children:"টিচার কোড (যদি থাকে)"}),e.jsx(a.Control,{type:"text",placeholder:"যেমন: TS-১২৩৪",value:s.teacherCode,onChange:t=>r("teacherCode",t.target.value),className:"rounded-3 py-2"})]}),e.jsxs(a.Group,{className:"mb-4",children:[e.jsxs(a.Label,{className:"fw-semibold text-secondary",children:["বিস্তারিত বিবরণ ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx(a.Control,{as:"textarea",rows:4,placeholder:"আপনার অভিযোগ বা পরামর্শের বিস্তারিত এখানে লিখুন...",value:s.description,onChange:t=>r("description",t.target.value),className:"rounded-3",required:!0})]}),e.jsx(w,{type:"submit",variant:"primary",className:"w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm",disabled:c,children:c?e.jsx(C,{animation:"border",size:"sm"}):e.jsxs(e.Fragment,{children:[e.jsx(S,{})," ",s.type==="complain"?"অভিযোগ পাঠান":"পরামর্শ পাঠান"]})})]})]})})}),e.jsx(F,{}),e.jsx(L,{show:u,handleClose:()=>{d({type:"complain",category:"payment_issue",name:"",phone:"",teacherCode:"",description:""}),p(!1)},title:s.type==="complain"?"অভিযোগ সফল!":"পরামর্শ সফল!",message:`আপনার ${s.type==="complain"?"অভিযোগটি":"পরামর্শটি"} সফলভাবে আমাদের কাছে জমা হয়েছে। আমরা দ্রুত এটি পর্যালোচনা করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করব।`})]}),e.jsx(X,{})]})},z=i.div`
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  min-height: 100vh;
  padding-top: 40px;
  padding-bottom: 60px;

  @media (max-width: 768px) {
    padding-top: 15px;
    padding-bottom: 30px;
  }
`,A=i(_)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  max-width: 580px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  
  .fw-extrabold {
    font-weight: 800;
  }
`,h=i.div`
  border: 2px solid ${s=>s.active?"var(--bs-primary)":"#e5e7eb"};
  background: ${s=>s.active?"#eff6ff":"#fff"};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;export{q as default};
