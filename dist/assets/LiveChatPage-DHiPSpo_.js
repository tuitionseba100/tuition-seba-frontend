import{r as a,aV as de,j as t,N as ce,e as me,aW as H,aX as pe,aY as ue,B as w,S as he,aZ as xe,R as fe,f as U,a_ as ge,a$ as P,b0 as be,b1 as ye,d as we,aw as je,h as A,y as W,g as X}from"./index-Bk6jmH2m.js";import{d as f}from"./styled-components.browser.esm-D6zil3Ad.js";import{F as m}from"./Form-B-3rUo4i.js";const Se="'Hind Siliguri', 'Inter', sans-serif",j="https://tuition-seba-backend-1.onrender.com";function Ie(){const[S,D]=a.useState(""),[v,R]=a.useState(""),[o,G]=a.useState(null),[z,L]=a.useState(!1),[I,N]=a.useState(""),[g,l]=a.useState([]),[b,M]=a.useState(""),[Ce,K]=a.useState(!1),[q,J]=a.useState(!1),[V,k]=a.useState(!1),[T,B]=a.useState(!1),[Z,O]=a.useState(!1),[$e,Ae]=a.useState(!1),[De,C]=a.useState(!1),i=a.useRef(null),E=a.useRef(null),u=a.useRef(null),h=a.useRef(null),Q=s=>{const{scrollTop:e,scrollHeight:r,clientHeight:n}=s.target;r-e-n>150?O(!0):O(!1)},ee=()=>{u.current&&u.current.scrollTo({top:u.current.scrollHeight,behavior:"smooth"})};a.useEffect(()=>{try{const s=localStorage.getItem("@user_settings");if(s){const e=JSON.parse(s);e.phone&&D(e.phone),e.premiumCode&&R(e.premiumCode)}}catch(s){console.error("Error loading saved settings in LiveChatPage:",s)}},[]),a.useEffect(()=>{u.current&&(u.current.scrollTop=u.current.scrollHeight)},[g]),a.useEffect(()=>{if(o){C(!0);const s=setTimeout(()=>{C(!1)},2e3);return()=>clearTimeout(s)}else C(!1)},[o]),a.useEffect(()=>{if(o)return i.current=de(j),i.current.emit("join_room",{phone:o.phone,name:o.name,role:"member"}),i.current.on("receive_message",s=>{s.phone===o.phone&&l(e=>[...e,s])}),i.current.on("agent_status",({agentOnline:s})=>{K(s)}),i.current.on("display_typing",({isTyping:s,role:e})=>{e==="agent"&&J(s)}),i.current.on("message_unsent",({messageId:s,phone:e})=>{e===o.phone&&l(r=>r.map(n=>n._id===s?{...n,isUnsent:!0}:n))}),()=>{i.current&&(i.current.emit("leave_room",{phone:o.phone,role:"member"}),i.current.disconnect()),h.current&&clearTimeout(h.current)}},[o]);const te=async s=>{if(s.preventDefault(),!(!S.trim()||!v.trim())){N(""),L(!0);try{const r=await(await A(`${j}/api/regTeacher/check-apply-possible`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:S,premiumCode:v})})).json();if(r.success){const n=r.data.data;E.current=n;const d={name:n.name||"Premium Member",phone:r.data.phone,premiumCode:r.data.premiumCode,chatToken:r.data.chatToken},p={userName:d.name,phone:d.phone,premiumCode:d.premiumCode,chatToken:d.chatToken,areas:n.currentArea?[n.currentArea]:[]};localStorage.setItem("@user_settings",JSON.stringify(p)),window.dispatchEvent(new Event("userSettingsUpdated")),G(d);const c=await(await A(`${j}/api/chat/history/${d.phone}?limit=20&chatToken=${d.chatToken}`)).json();c.length===0?l([{sender:"bot",text:`সম্মানিত **${d.name}**, টিউশন সেবা লাইভ চ্যাটে আপনাকে স্বাগতম! 💬

অনুগ্রহ করে নিচে আপনার প্রশ্ন বা বার্তাটি লিখুন। আমাদের একজন কাস্টমার রিপ্রেজেন্টেティブ দ্রুত এখানে সরাসরি আপনাকে উত্তর দেবেন।`}]):(l(c),k(c.length===20))}else N(r.message||"ভেরিফিকেশন ব্যর্থ হয়েছে। অনুগ্রহ করে সঠিক মোবাইল নম্বর ও প্রিমিয়াম কোড দিন।"),W.error(r.message||"ভেরিফিকেশন ব্যর্থ হয়েছে। অনুগ্রহ করে সঠিক মোবাইল নম্বর ও প্রিমিয়াম কোড দিন।")}catch(e){console.error(e),N("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।"),W.error("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।")}finally{L(!1)}}},se=async()=>{if(g.length===0||!o||T)return;const s=g[0].createdAt;B(!0);try{const r=await(await A(`${j}/api/chat/history/${o.phone}?before=${s}&limit=20&chatToken=${o.chatToken}`)).json();r.length>0?(l(n=>[...r,...n]),k(r.length===20)):k(!1)}catch(e){console.error("Error loading more messages:",e)}finally{B(!1)}},re=s=>{M(s.target.value),!(!i.current||!o)&&(i.current.emit("typing",{phone:o.phone,isTyping:!0,role:"member"}),h.current&&clearTimeout(h.current),h.current=setTimeout(()=>{i.current.emit("typing",{phone:o.phone,isTyping:!1,role:"member"})},1500))},Y=()=>{!b.trim()||!o||(h.current&&clearTimeout(h.current),i.current&&(i.current.emit("typing",{phone:o.phone,isTyping:!1,role:"member"}),i.current.emit("send_message",{phone:o.phone,premiumCode:o.premiumCode,sender:"member",senderName:o.name,text:b})),M(""))},ne=s=>{s.key==="Enter"&&Y()},oe=s=>{const e=s?new Date(s):new Date,r=new Date().getFullYear(),n=e.getFullYear();return e.toLocaleString([],{...n!==r&&{year:"numeric"},month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0})},$=s=>{const e=/(https?:\/\/[^\s]+)/g;return s.split(e).map((n,d)=>{if(e.test(n))return t.jsx("a",{href:n,target:"_blank",rel:"noopener noreferrer",style:{color:"inherit",textDecoration:"underline",fontWeight:600},children:n},d);const p=/(01[3-9]\d{2}-?\d{6})/g;return p.test(n)?n.split(p).map((c,y)=>{if(p.test(c)){const ie=c.replace("-","");return t.jsxs("span",{onClick:_=>{_.stopPropagation(),navigator.clipboard.writeText(ie);const x=_.currentTarget,le=x.innerHTML;x.innerHTML="Copied! ✅",x.style.backgroundColor="#d1fae5",x.style.color="#065f46",setTimeout(()=>{x.innerHTML=le,x.style.backgroundColor="#f1f5f9",x.style.color="#0f172a"},1200)},title:"Click to copy number",style:{cursor:"pointer",backgroundColor:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:"4px",padding:"1px 6px",fontFamily:"monospace",fontWeight:"bold",color:"#0f172a",display:"inline-flex",alignItems:"center",gap:"4px",userSelect:"all",fontSize:"0.9em",margin:"0 2px",transition:"all 0.15s ease"},children:[c," 📋"]},y)}return c}):n})},ae=s=>s.split(`
`).map((e,r)=>{const n=e.split("**");return t.jsxs("span",{children:[r>0&&t.jsx("br",{}),n.map((d,p)=>p%2===1?t.jsx("strong",{children:$(d)},p):d.split("*").map((c,y)=>y%2===1?t.jsx("em",{children:$(c)},y):$(c)))]},r)});return t.jsxs(t.Fragment,{children:[t.jsx(ce,{}),t.jsx(ve,{style:{fontFamily:Se},children:t.jsx(me,{className:"d-flex justify-content-center align-items-start h-100 py-2",children:o?t.jsx(ke,{className:"border-0 shadow-lg rounded-4 overflow-hidden w-100",children:t.jsxs(fe,{className:"g-0 h-100",children:[t.jsxs(U,{md:4,className:"bg-primary text-white p-3 p-md-4 d-flex flex-column justify-content-between border-end border-primary-dark d-none d-md-flex",children:[t.jsxs("div",{children:[t.jsxs("div",{className:"text-center mb-2 mb-md-4",children:[t.jsx("div",{className:"d-inline-flex p-2 p-md-3 bg-white bg-opacity-10 rounded-circle mb-2 mb-md-3",children:t.jsx(ge,{size:32,className:"text-white"})}),t.jsx("h4",{className:"fw-bold fs-5 mb-1",children:o.name}),t.jsx(P,{bg:"light",text:"primary",className:"px-3 py-1.5 rounded-pill fw-bold",children:o.premiumCode})]}),t.jsxs("div",{className:"mt-4 pt-3 border-top border-white border-opacity-10 d-none d-md-block",children:[t.jsx("h6",{className:"fw-semibold text-white-50 uppercase mb-3",style:{fontSize:"0.75rem",letterSpacing:"1px"},children:"USER DETAILS"}),t.jsx("div",{className:"d-flex flex-column gap-2",style:{fontSize:"0.9rem"},children:t.jsxs("div",{children:["মোবাইল: ",t.jsx("strong",{children:o.phone})]})})]})]}),t.jsx("div",{className:"bg-white bg-opacity-10 p-3 rounded-3 mt-4 d-none d-md-block",style:{fontSize:"0.8rem",lineHeight:"1.5"},children:"👋 টিউশন সেবা ফোরামে আপনাকে স্বাগতম। আপনি এখন আমাদের লাইভ সাপোর্ট প্যানেলে যুক্ত আছেন। আপনার প্রশ্ন বা সমস্যাটি নিচে লিখে পাঠান, আমাদের কাস্টমার রিপ্রেজেন্টেটিভ দ্রুত উত্তর প্রদান করবেন।"})]}),t.jsxs(U,{md:8,className:"d-flex flex-column bg-white h-100 ts-chat-main-col",children:[t.jsxs("div",{className:"p-3 border-bottom d-flex align-items-center justify-content-between bg-light",children:[t.jsxs("div",{className:"d-flex align-items-center gap-2",children:[t.jsx("div",{className:"p-2 bg-primary-subtle text-primary rounded-circle",children:t.jsx(H,{size:18})}),t.jsxs("div",{children:[t.jsx("h6",{className:"mb-0 fw-bold text-dark",children:"লাইভ চ্যাট অ্যাসিস্ট্যান্ট"}),t.jsx("small",{className:"text-muted",style:{fontSize:"0.75rem"},children:"Tuition Seba Help Desk"})]})]}),t.jsxs("div",{className:"d-md-none text-end",children:[t.jsx("div",{className:"fw-semibold text-dark text-truncate",style:{fontSize:"0.85rem",maxWidth:"140px"},children:o.name}),t.jsx(P,{bg:"primary",style:{fontSize:"0.68rem",padding:"4px 8px"},children:o.premiumCode})]})]}),t.jsxs("div",{ref:u,className:"flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3 bg-light bg-opacity-50 ts-msg-feed-box",onScroll:Q,children:[V&&t.jsx(w,{variant:"link",size:"sm",onClick:se,className:"d-block mx-auto text-decoration-none fw-bold",disabled:T,children:T?"Loading messages...":"Load previous messages"}),g.filter(s=>!s.isUnsent).map((s,e)=>t.jsxs("div",{className:`d-flex flex-column ${s.sender==="member"?"align-items-end":"align-items-start"}`,children:[t.jsx(Te,{className:`px-3 py-2.5 rounded-3 shadow-sm ${s.sender==="member"?"bg-primary text-white rounded-bottom-end-0":s.sender==="bot"?"bg-info-subtle border border-info-subtle text-info-emphasis rounded-bottom-start-0":"bg-white text-dark border rounded-bottom-start-0"}`,children:ae(s.text)}),t.jsxs("small",{className:"text-muted mt-1 px-1",style:{fontSize:"0.65rem"},children:[oe(s.createdAt),s.sender==="member"&&!s.isRead&&" • Unseen"]})]},e)),q&&t.jsx("div",{className:"d-flex align-items-start flex-column",children:t.jsxs("div",{className:"bg-white px-3 py-2 rounded-pill shadow-sm d-flex gap-1.5 align-items-center border",children:[t.jsx("span",{className:"dot-jump"}),t.jsx("span",{className:"dot-jump"}),t.jsx("span",{className:"dot-jump"})]})})]}),Z&&t.jsx(w,{onClick:ee,style:{position:"absolute",bottom:"80px",right:"25px",width:"40px",height:"40px",borderRadius:"50%",backgroundColor:"#ffffff",border:"1px solid #e2e8f0",color:"#1e293b",boxShadow:"0 4px 12px rgba(0, 0, 0, 0.15)",zIndex:100,padding:0},className:"d-flex align-items-center justify-content-center",children:t.jsx(be,{size:24})}),!b.trim()&&t.jsxs("div",{className:"px-3 py-1 border-top bg-white d-flex gap-2",style:{borderTop:"1px solid #e2e8f0",overflowX:"auto",flexWrap:"nowrap",scrollbarWidth:"none"},children:[t.jsx("button",{onClick:()=>{const s=new Date().toISOString();l(e=>[...e,{sender:"member",text:"আমার সর্বশেষ সিভি দেখতে চাই",createdAt:s}]),setTimeout(()=>{const e=E.current;if(!e){l(n=>[...n,{sender:"bot",text:"দুঃখিত, আপনার সিভি তথ্য লোড করা সম্ভব হয়নি।",createdAt:new Date().toISOString()}]);return}const r=[`📋 **${e.name||"N/A"} এর সিভি**`,"","👤 **ব্যক্তিগত তথ্য**",`**নাম**: **${e.name||"N/A"}**`,`**লিঙ্গ**: ${e.gender||"N/A"}`,`**ফোন**: ${e.phone||"N/A"}`,e.email?`**ইমেইল**: ${e.email}`:null,e.currentArea?`**বর্তমান এলাকা**: ${e.currentArea}`:null,e.district?`**জেলা**: ${e.district}`:null,e.thana?`**থানা**: ${e.thana}`:null,"","🎓 **শিক্ষাগত যোগ্যতা**",e.university?`**বিশ্ববিদ্যালয়**: **${e.university}**`:null,e.department?`**বিভাগ**: ${e.department}`:null,e.academicYear?`**শিক্ষাবর্ষ**: ${e.academicYear}`:null,e.medium?`**মাধ্যম**: ${e.medium}`:null,e.honorsUniversity?`**অনার্স বিশ্ববিদ্যালয়**: ${e.honorsUniversity}`:null,e.honorsDept?`**অনার্স বিভাগ**: ${e.honorsDept}`:null,e.mastersUniversity?`**মাস্টার্স বিশ্ববিদ্যালয়**: ${e.mastersUniversity}`:null,e.mastersDept?`**মাস্টার্স বিভাগ**: ${e.mastersDept}`:null,e.college?`**কলেজ**: ${e.college}`:null,e.hscGroup?`**এইচএসসি গ্রুপ**: ${e.hscGroup}`:null,e.hscResult?`**এইচএসসি ফলাফল**: ${e.hscResult}`:null,e.school?`**স্কুল**: ${e.school}`:null,e.sscGroup?`**এসএসসি গ্রুপ**: ${e.sscGroup}`:null,e.sscResult?`**এসএসসি ফলাফল**: ${e.sscResult}`:null,"","📚 **টিউশন তথ্য**",e.experience?`**অভিজ্ঞতা**: ${e.experience}`:null,e.favoriteSubject?`**পছন্দের বিষয়**: ${e.favoriteSubject}`:null,e.expectedTuitionAreas?`**পছন্দের এলাকা**: ${e.expectedTuitionAreas}`:null,`**প্রিমিয়াম কোড**: **${e.premiumCode||"N/A"}**`].filter(Boolean).join(`
`);l(n=>[...n,{sender:"bot",text:r,createdAt:new Date().toISOString()}])},500)},className:"ts-suggestion-chip",style:{background:"linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",borderColor:"#dbeafe",color:"#1d4ed8"},children:"সিভি দেখতে চাই"}),t.jsx("button",{onClick:()=>{const s=new Date().toISOString();l(e=>[...e,{sender:"member",text:"আমার অ্যাপ্লাইগুলোর কি অবস্থা?",createdAt:s}]),setTimeout(()=>{const e=`📢 **আপনার অ্যাপ্লাই করা টিউশনগুলোর আপডেট**

আপনার অ্যাপ্লাই করা টিউশনগুলোর সর্বশেষ অবস্থা জানতে নিচের লিংকে ক্লিক করুন:

🔗 **https://www.tuitionsebaforum.com/apply-updates**

উক্ত পেজে আপনার ফোন নম্বর ও প্রিমিয়াম কোড দিয়ে লগইন করলে আপনার সকল অ্যাপ্লাই এর বর্তমান স্ট্যাটাস দেখতে পারবেন।`;l(r=>[...r,{sender:"bot",text:e,createdAt:new Date().toISOString()}])},500)},className:"ts-suggestion-chip",style:{background:"linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",borderColor:"#dcfce7",color:"#15803d"},children:"অ্যাপ্লাই আপডেট"}),t.jsx("button",{onClick:()=>{const s=new Date().toISOString();l(e=>[...e,{sender:"member",text:"পেমেন্ট নম্বর জানতে চাই",createdAt:s}]),setTimeout(()=>{const e=`💳 **আমাদের সাথে লেনদেন করুন নিচের দেওয়া নাম্বারে:**

🔹 **বিকাশ (Payment)**: **01973920728** (সবচেয়ে উত্তম ও দ্রুততম নিশ্চিত মাধ্যম)

🔹 **বিকাশ (Send Money)**: **01633920928**

🔹 **নগদ (Send Money)**: **01633-920928**

🔹 **রকেট (Send Money)**: **01633-920928**

📢 **বিঃদ্রঃ**: দ্রুত ভেরিফিকেশন ও নিরাপদ লেনদেনের জন্য **bKash Payment** অপশন ব্যবহার করার অনুরোধ করা হচ্ছে। অন্য মাধ্যমে টাকা পাঠালে অবশ্যই লেনদেনের স্ক্রিনশট সংরক্ষণ করুন।

💡 **টিপস**: যেকোনো নম্বরের ওপর ক্লিক করলেই নম্বরটি অটো কপি হয়ে যাবে। টাকা পাঠানোর পূর্বে অবশ্যই নম্বরটি পুনরায় ভালো করে চেক করে নেবেন।

ধন্যবাদ।`;l(r=>[...r,{sender:"bot",text:e,createdAt:new Date().toISOString()}])},500)},className:"ts-suggestion-chip",style:{background:"linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",borderColor:"#fef3c7",color:"#b45309"},children:"পেমেন্ট নম্বর"}),t.jsx("button",{onClick:()=>{const s=new Date().toISOString();l(e=>[...e,{sender:"member",text:"রিফান্ড সংক্রান্ত সাহায্য চাই",createdAt:s}]),setTimeout(()=>{const e=`📌 **রিফান্ড বা টিউশন সংক্রান্ত সহায়তার নির্দেশিকা**

নিচের লিঙ্কে ক্লিক করে:
✅ **রিফান্ড নিন**
✅ **পলিসি দেখুন**
✅ **অফিসিয়াল লেনদেনের নম্বর দেখুন**

টিউশন বাতিল বা কোনো সমস্যা হলে ফর্মটি পূরণ করুন এবং বিস্তারিত লিখুন।
🕒 **অফিস ৭২ ঘণ্টার মধ্যে সমস্যার সমাধান করবে।**

**ফর্ম পূরণ ও রিফান্ডের জন্য**:
➡️ “**Request Refund**” অপশনটি নির্বাচন করুন
🔗 **https://www.tuitionsebaforum.com/payment**`;l(r=>[...r,{sender:"bot",text:e,createdAt:new Date().toISOString()}])},500)},className:"ts-suggestion-chip",style:{background:"linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",borderColor:"#ffe4e6",color:"#e11d48"},children:"রিফান্ড"})]}),t.jsx("div",{className:"p-3 border-top bg-white",children:t.jsxs(m,{onSubmit:s=>{s.preventDefault(),Y()},className:"d-flex gap-2 align-items-center",children:[t.jsx(m.Control,{type:"text",placeholder:"আপনার বার্তাটি এখানে লিখুন...",value:b,onChange:re,onKeyDown:ne,className:"rounded-pill px-4",style:{fontSize:"0.9rem"}}),t.jsx(w,{type:"submit",variant:"primary",className:"rounded-circle d-flex align-items-center justify-content-center",style:{width:"42px",height:"42px",flexShrink:0},children:t.jsx(ye,{size:16})})]})})]})]})}):t.jsxs(Ne,{className:"border-0 shadow-lg p-4 p-md-5 rounded-4",children:[t.jsxs("div",{className:"text-center mb-4 pb-3 border-bottom",children:[t.jsx("div",{className:"d-inline-flex p-3 bg-primary-subtle rounded-circle mb-3 text-primary",children:t.jsx(H,{size:36})}),t.jsx("h3",{className:"fw-bold text-primary mb-2",children:"লাইভ চ্যাট সাপোর্ট"}),t.jsx("p",{className:"text-muted mb-0",children:"আমাদের সাপোর্ট টিমের সাথে সরাসরি লাইভ চ্যাট করতে আপনার তথ্য দিন।"})]}),t.jsxs(m,{onSubmit:te,children:[t.jsxs(m.Group,{className:"mb-3",children:[t.jsxs(m.Label,{className:"fw-semibold text-secondary",children:["মোবাইল নম্বর ",t.jsx("span",{className:"text-danger",children:"*"})]}),t.jsxs("div",{className:"position-relative",children:[t.jsx(pe,{className:"position-absolute text-muted",style:{left:"14px",top:"50%",transform:"translateY(-50%)",zIndex:10}}),t.jsx(m.Control,{type:"tel",placeholder:"০১XXXXXXXXX",value:S,onChange:s=>D(s.target.value),style:{paddingLeft:"38px"},className:"rounded-3 py-2.5",required:!0})]})]}),t.jsxs(m.Group,{className:"mb-4",children:[t.jsxs(m.Label,{className:"fw-semibold text-secondary",children:["প্রিমিয়াম কোড ",t.jsx("span",{className:"text-danger",children:"*"})]}),t.jsxs("div",{className:"position-relative",children:[t.jsx(ue,{className:"position-absolute text-muted",style:{left:"14px",top:"50%",transform:"translateY(-50%)",zIndex:10}}),t.jsx(m.Control,{type:"text",placeholder:"যেমন: PREM-১২৩৪",value:v,onChange:s=>R(s.target.value),style:{paddingLeft:"38px"},className:"rounded-3 py-2.5",required:!0})]})]}),t.jsx(w,{type:"submit",variant:"primary",className:"w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm",disabled:z,children:z?t.jsx(he,{animation:"border",size:"sm"}):t.jsxs(t.Fragment,{children:["ভেরিফাই করুন ও চ্যাট শুরু করুন ",t.jsx(xe,{size:22})]})}),I&&t.jsx("div",{className:"text-danger text-center mt-3 small fw-bold",children:I})]})]})})}),t.jsx(we,{}),t.jsx(je,{})]})}const ve=f.div`
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 15px 0 100px 0;

  @media (max-width: 768px) {
    padding: 10px 0 80px 0;
  }

  /* Custom Sleek Scrollbar */
  .overflow-auto::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .overflow-auto::-webkit-scrollbar-track {
    background: transparent;
  }
  .overflow-auto::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.12);
    border-radius: 3px;
  }
  .overflow-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.25);
  }

  /* Dot animation for typing */
  .dot-jump {
    width: 6px;
    height: 6px;
    background: #adb5bd;
    border-radius: 50%;
    display: inline-block;
    animation: bounce-jump 1.3s infinite ease-in-out;
  }
  .dot-jump:nth-child(2) { animation-delay: 0.15s; }
  .dot-jump:nth-child(3) { animation-delay: 0.3s; }

  @keyframes bounce-jump {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-5px); }
  }
`,Ne=f(X)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  max-width: 500px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.5);
`,ke=f(X)`
  max-width: 960px;
  width: 100%;
  height: 600px;
  background: white;
  border: none;
  
  .ts-chat-main-col {
    min-height: 520px;
    position: relative;
  }

  .ts-msg-feed-box {
    height: 360px;
  }
  
  @media (max-width: 768px) {
    height: calc(100vh - 160px);
    min-height: 480px;
    
    .row {
      flex-direction: column;
      height: 100%;
    }

    .ts-chat-main-col {
      height: 100%;
      min-height: unset;
    }

    .ts-msg-feed-box {
      flex: 1;
      height: auto !important;
      padding: 16px !important;
    }
  }

  .ts-suggestion-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 12px;
    border: 1px solid #dbeafe;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    color: #1d4ed8;
    font-size: 0.65rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .ts-suggestion-chip:hover {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border-color: #93c5fd;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }

  .ts-suggestion-chip:active {
    transform: translateY(0);
  }
`,Te=f.div`
  max-width: 75%;
  word-break: break-word;
  font-size: 0.88rem;
  line-height: 1.45;
`;f.div`
  position: absolute;
  bottom: 40px;
  left: -10px;
  background: #f59e0b;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.35);
  animation: ts-tooltip-bounce 2s infinite ease-in-out;
  pointer-events: none;
  z-index: 100;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 20px;
    border-width: 4px 4px 0;
    border-style: solid;
    border-color: #f59e0b transparent;
    display: block;
    width: 0;
  }

  @keyframes ts-tooltip-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
`;export{Ie as default};
