import{r as o,h as k,y as B,j as e,N as O,aw as U,e as C,aK as $,S as W,aL as Y,aM as f,b as F,aN as _,aO as D,aP as J,M as u,B as Z,d as q,aQ as K,aR as Q}from"./index-Bk6jmH2m.js";import{F as V}from"./Form-B-3rUo4i.js";const l="'Hind Siliguri', sans-serif",te=()=>{const[m,y]=o.useState(""),[d,j]=o.useState([]),[c,N]=o.useState(!1),[S,p]=o.useState(""),[T,w]=o.useState(!1),[t,v]=o.useState(null),[R,h]=o.useState(!1),[I,z]=o.useState(!1),g=o.useCallback(async a=>{if(a){if(!/^\d{11}$/.test(a)){p("দয়াকরে ১১ ডিজিটের সঠিক মোবাইল নম্বরটি লিখুন");return}N(!0),p(""),j([]),w(!1);try{const s=await k(`https://tuition-seba-backend-1.onrender.com/api/tuitionApply/getTuitionStatusesByPhone?phone=${a}`);if(!s.ok){let r=`সার্ভার ত্রুটি (Status: ${s.status})`;try{const i=await s.json();i&&i.message&&(r=i.message)}catch{}throw new Error(r)}const n=await s.json();j(n),w(!0)}catch(s){p(s.message||"নেটওয়ার্কে সমস্যা হচ্ছে, আবার চেষ্টা করুন।"),B.error(s.message||"নেটওয়ার্কে সমস্যা হচ্ছে, আবার চেষ্টা করুন।")}finally{N(!1)}}},[]);o.useEffect(()=>{try{const a=localStorage.getItem("@user_settings");if(a){const s=JSON.parse(a);s.phone&&(y(s.phone),g(s.phone))}}catch(a){console.error("Error loading settings",a)}},[g]);const L=async a=>{z(!0),v(null),h(!0);try{const s=await k(`https://tuition-seba-backend-1.onrender.com/api/tuition/byCodePublic?tuitionCode=${a}`);if(!s.ok)throw new Error("টিউশন কোড পাওয়া যায়নি");const n=await s.json();v(n)}catch(s){B.error(s.message||"টিউশন ডিটেইলস লোড করতে সমস্যা হয়েছে"),h(!1)}finally{z(!1)}},P=a=>{a.preventDefault(),m.trim()?g(m.trim()):p("দয়াকরে আপনার ফোন নম্বরটি লিখুন")},E=a=>{const s=new Date(a),n={day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"},r={hour:"2-digit",minute:"2-digit",hour12:!0,timeZone:"UTC"},i=new Intl.DateTimeFormat("en-GB",n).format(s),b=new Intl.DateTimeFormat("en-GB",r).format(s);return{date:i,time:b}},A=a=>{switch(a.toLowerCase()){case"approved":case"confirmed":case"selected":return"#10B981";case"pending":return"#F59E0B";case"rejected":case"cancel":case"cancelled":case"cancelled by guardian":case"cancelled by teacher":return"#EF4444";default:return"#3B82F6"}},M=a=>{switch(a.toLowerCase()){case"approved":case"confirmed":case"selected":return"#ecfdf5";case"pending":return"#fffbeb";case"rejected":case"cancel":case"cancelled":case"cancelled by guardian":case"cancelled by teacher":return"#fef2f2";default:return"#eff6ff"}},X=a=>{switch(a.toLowerCase()){case"approved":case"confirmed":case"selected":return"#f0fdf4";case"rejected":case"cancel":case"cancelled":case"cancelled by guardian":case"cancelled by teacher":return"#fef2f2";default:return"#ffffff"}},G=a=>{switch(a.toLowerCase()){case"approved":case"confirmed":case"selected":return e.jsx(Q,{size:13});case"pending":return e.jsx(D,{size:13});case"rejected":case"cancel":case"cancelled":case"cancelled by guardian":case"cancelled by teacher":return e.jsx(K,{size:13});default:return e.jsx(f,{size:13})}};return e.jsxs(e.Fragment,{children:[e.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap",rel:"stylesheet"}),e.jsxs("div",{className:"apply-updates-root",children:[e.jsx(O,{}),e.jsx(U,{position:"top-center",autoClose:3e3}),e.jsxs("div",{className:"au-hero",children:[e.jsx("div",{className:"au-blob au-blob-1"}),e.jsx("div",{className:"au-blob au-blob-2"}),e.jsx("div",{className:"au-blob au-blob-3"}),e.jsx(C,{style:{position:"relative",zIndex:2},children:e.jsxs("div",{className:"au-hero-inner",children:[e.jsxs("div",{className:"au-hero-badge",children:[e.jsx("span",{className:"au-badge-dot"}),e.jsx("span",{children:"লাইভ ট্র্যাকিং সিস্টেম"})]}),e.jsxs("h1",{className:"au-hero-title",children:["আবেদনের",e.jsx("span",{className:"au-hero-title-accent",children:" স্ট্যাটাস"})]}),e.jsx("p",{className:"au-hero-subtitle",children:"রিয়েল-টাইমে আপনার টিউশন আবেদনের আপডেট ট্র্যাক করুন"})]})})]}),e.jsxs(C,{className:"au-main-container",children:[e.jsxs("div",{className:"au-search-card",children:[e.jsx(V,{onSubmit:P,children:e.jsxs("div",{className:"au-search-row",children:[e.jsxs("div",{className:"au-search-input-wrap",children:[e.jsx("label",{className:"au-search-label",children:"আপনার ফোন নম্বর দিন"}),e.jsxs("div",{className:"au-input-container",children:[e.jsx("span",{className:"au-input-icon",children:e.jsx($,{size:16})}),e.jsx("input",{type:"tel",placeholder:"01XXXXXXXXX",value:m,onChange:a=>{y(a.target.value),p("")},maxLength:11,className:"au-input"})]})]}),e.jsx("button",{type:"submit",className:"au-search-btn",disabled:c,children:c?e.jsxs(e.Fragment,{children:[e.jsx(W,{animation:"border",size:"sm"}),e.jsx("span",{children:"খোঁজা হচ্ছে..."})]}):e.jsxs(e.Fragment,{children:[e.jsx(Y,{size:18}),e.jsx("span",{children:"স্ট্যাটাস দেখুন"})]})})]})}),e.jsxs("div",{style:{marginTop:"12px",fontSize:"12.5px",color:"#64748b",fontFamily:l,display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx(f,{size:14,style:{color:"#3b82f6",flexShrink:0}}),e.jsx("span",{children:"সর্বশেষ ২ মাসের আবেদনের তথ্য দেখানো হচ্ছে।"})]}),S&&e.jsxs("div",{className:"au-error",children:[e.jsx(F,{size:15}),e.jsx("span",{children:S})]})]}),T&&d.length===0&&!c&&e.jsxs("div",{className:"au-empty-state",children:[e.jsx(f,{size:48,strokeWidth:1}),e.jsx("h3",{children:"এই নম্বরে কোনো আবেদন পাওয়া যায়নি"}),e.jsx("p",{children:"এই নম্বর দিয়ে গত ২ মাসে কোনো টিউশন আবেদন পাওয়া যায়নি। যদি কোনো অসুবিধা ফেস করেন তবে অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।"})]}),d.length>0&&e.jsxs("div",{className:"au-results",children:[e.jsxs("div",{className:"au-results-header",children:[e.jsxs("div",{children:[e.jsxs("h2",{className:"au-results-title",children:["আপনার আবেদনসমূহ ",e.jsx("span",{style:{fontSize:"12.5px",fontWeight:"600",color:"#2563eb",background:"#eff6ff",padding:"3px 10px",borderRadius:"12px",verticalAlign:"middle",border:"1px solid #bfdbfe",marginLeft:"6px"},children:"সর্বশেষ ২ মাস"})]}),e.jsxs("p",{style:{fontFamily:l,fontSize:"12.5px",color:"#64748b",margin:"4px 0 0 0",fontWeight:"500",lineHeight:"1.5"},children:["মোট আবেদনকারীর সংখ্যা বেশি দেখে ভয় পাবেন না — ",e.jsx("strong",{style:{color:"#1e40af"},children:"যোগ্যতা"})," ও ",e.jsx("strong",{style:{color:"#1e40af"},children:"গার্ডিয়ানের চাহিদার সাথে মিল"})," থাকলেই আপনি নির্বাচিত হবেন। আস্থা রাখুন।"]})]}),e.jsxs("div",{className:"au-results-actions",children:[e.jsx("button",{onClick:()=>g(m),disabled:c,className:"au-refresh-btn",title:"রিফ্রেশ করুন",children:e.jsx(_,{className:c?"au-spin":"",size:15})}),e.jsxs("span",{className:"au-count-badge",children:[d.length," টি আবেদন"]})]})]}),e.jsx("div",{className:"au-applies-list",style:{marginTop:"24px"},children:d.slice().reverse().map((a,s)=>{const{date:n,time:r}=E(a.appliedAt),i=A(a.status),b=M(a.status),H=X(a.status);return e.jsxs("div",{className:"au-apply-item",style:{background:"#ffffff",borderRadius:"16px",border:"1.5px solid #e2e8f0",boxShadow:"0 4px 12px rgba(0,0,0,0.03)",marginBottom:"28px",overflow:"hidden",fontFamily:l,transition:"transform 0.2s, box-shadow 0.2s"},children:[e.jsxs("div",{style:{background:"linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("span",{style:{background:"#ffffff",color:"#1e40af",fontWeight:"800",borderRadius:"50%",width:"28px",height:"28px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px"},children:d.length-s}),e.jsxs("span",{style:{color:"#ffffff",fontWeight:"700",fontSize:"15px",letterSpacing:"0.3px"},children:["টিউশন কোড: ",a.tuitionCode]}),e.jsxs("button",{type:"button",onClick:()=>L(a.tuitionCode),style:{background:"rgba(255, 255, 255, 0.15)",border:"1.5px solid rgba(255, 255, 255, 0.3)",color:"#ffffff",borderRadius:"20px",padding:"3px 12px",fontSize:"12px",fontWeight:"600",cursor:"pointer",transition:"all 0.2s",fontFamily:l},onMouseEnter:x=>{x.currentTarget.style.backgroundColor="#ffffff",x.currentTarget.style.color="#1e40af"},onMouseLeave:x=>{x.currentTarget.style.backgroundColor="rgba(255, 255, 255, 0.15)",x.currentTarget.style.color="#ffffff"},children:[e.jsx(f,{size:12,style:{marginRight:"4px"}}),"বিস্তারিত"]})]}),e.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap"},children:[a.tuitionStatus&&(a.tuitionStatus.toLowerCase()==="cancel"||a.tuitionStatus.toLowerCase()==="suspended")&&e.jsxs("span",{className:"au-status-pill",style:{color:"#334155",backgroundColor:"#f1f5f9",borderColor:"#cbd5e1",margin:0,padding:"5px 14px",fontSize:"12.5px",fontWeight:"700",borderRadius:"30px",display:"inline-flex",alignItems:"center",gap:"6px"},children:["Tuition: ",a.tuitionStatus.toUpperCase()]}),e.jsxs("span",{className:"au-status-pill",style:{color:i,backgroundColor:b,borderColor:i+"30",margin:0,padding:"5px 14px",fontSize:"12.5px",fontWeight:"700",borderRadius:"30px",display:"inline-flex",alignItems:"center",gap:"6px"},children:[G(a.status),a.status]})]})]}),e.jsx("div",{className:"table-responsive",style:{margin:0},children:e.jsx("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"14.5px",color:"#334155"},children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{borderBottom:"1px solid #e2e8f0"},children:[e.jsx("td",{style:{width:"35%",padding:"12px 20px",background:"#f8fafc",fontWeight:"600",color:"#475569",borderRight:"1px solid #e2e8f0"},children:"আবেদন সিরিয়াল (Apply Serial)"}),e.jsx("td",{style:{padding:"12px 20px"},children:a.serialNumber?e.jsxs("span",{children:["আপনি এই টিউশনে ",e.jsxs("strong",{style:{color:"#2563eb",fontSize:"16px"},children:["#",a.serialNumber]})," নম্বর আবেদনকারী (মোট আবেদনকারী: ",a.totalApplies," জন)"]}):"-"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #e2e8f0"},children:[e.jsx("td",{style:{padding:"12px 20px",background:"#f8fafc",fontWeight:"600",color:"#475569",borderRight:"1px solid #e2e8f0"},children:"আবেদনের সময় (Apply Date/Time)"}),e.jsxs("td",{style:{padding:"12px 20px",display:"flex",alignItems:"center",gap:"8px",border:"none"},children:[e.jsx(D,{size:13,style:{color:"#64748b"}}),e.jsxs("span",{children:[n,", ",r]})]})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #e2e8f0"},children:[e.jsx("td",{style:{padding:"12px 20px",background:"#f8fafc",fontWeight:"600",color:"#475569",borderRight:"1px solid #e2e8f0"},children:"অভিভাবকের চাহিদা (Guardian Demand)"}),e.jsx("td",{style:{padding:"12px 20px",color:"#1e293b",fontWeight:"700"},children:a.guardianDemandForPublic&&a.guardianDemandForPublic.trim()?a.guardianDemandForPublic:"অভিজ্ঞ শিক্ষক চাইছে ভালো দেখে"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"14px 20px",background:"#f8fafc",fontWeight:"600",color:"#475569",borderRight:"1px solid #e2e8f0"},children:"TSF এজেন্টের মন্তব্য (Agent Comment)"}),e.jsx("td",{style:{padding:"14px 20px",backgroundColor:H},children:a.commentForTeacher?e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"8px",color:i,fontWeight:"600"},children:[e.jsx(J,{size:16,style:{marginTop:"2px",flexShrink:0}}),e.jsx("span",{children:a.commentForTeacher})]}):a.status.toLowerCase()==="pending"?e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"8px",color:"#475569",fontStyle:"italic"},children:[e.jsx(F,{size:16,style:{marginTop:"2px",flexShrink:0,color:"#3b82f6"}}),e.jsx("span",{children:"আপনার আবেদনটি বর্তমানে রিভিউ চলছে। অনুগ্রহ করে অপেক্ষা করুন।"})]}):e.jsx("span",{style:{color:"#94a3b8",fontStyle:"italic"},children:"কোনো মন্তব্য নেই"})})]}),(a.tuitionStatus?.toLowerCase()==="cancel"||a.tuitionStatus?.toLowerCase()==="suspended")&&a.tuitionCancelReasonPublic&&a.tuitionCancelReasonPublic.trim()!==""&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"14px 20px",background:"#fef2f2",fontWeight:"600",color:"#dc2626",borderRight:"1px solid #e2e8f0",borderTop:"1px solid #e2e8f0"},children:"টিউশন বাতিলের কারণ (Cancel Reason)"}),e.jsx("td",{style:{padding:"14px 20px",backgroundColor:"#fff",borderTop:"1px solid #e2e8f0"},children:e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"8px",color:"#dc2626",fontWeight:"600"},children:[e.jsx(f,{size:16,style:{marginTop:"2px",flexShrink:0}}),e.jsx("span",{children:a.tuitionCancelReasonPublic})]})})]})]})})})]},s)})})]})]}),e.jsxs(u,{show:R,onHide:()=>h(!1),centered:!0,className:"au-details-modal",children:[e.jsx(u.Header,{closeButton:!0,className:"border-0 pb-0",children:e.jsx(u.Title,{className:"fw-bold fs-5 text-dark",style:{fontFamily:l},children:"টিউশন আবেদনের বিস্তারিত তথ্য"})}),e.jsx(u.Body,{className:"pt-3",style:{fontFamily:l},children:I?e.jsxs("div",{className:"d-flex flex-column align-items-center py-5",children:[e.jsx(W,{animation:"border",variant:"primary",className:"mb-2"}),e.jsx("span",{className:"text-secondary small",children:"তথ্য লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন..."})]}):t?e.jsxs("div",{className:"tuition-detail-card",children:[e.jsx("div",{className:"detail-header-badge mb-3",children:e.jsxs("span",{className:"badge bg-primary px-3 py-2 rounded-pill font-sans",children:["Code: ",t.tuitionCode]})}),e.jsxs("div",{className:"detail-grid",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[e.jsxs("div",{className:"detail-item",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"Wanted Teacher"}),e.jsx("span",{className:"detail-value",style:{fontSize:"14px",color:"#1e293b",fontWeight:"700"},children:t.wantedTeacher||"-"})]}),e.jsxs("div",{className:"detail-item",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"Students"}),e.jsx("span",{className:"detail-value",style:{fontSize:"14px",color:"#1e293b",fontWeight:"700"},children:t.student||"-"})]}),e.jsxs("div",{className:"detail-item",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"Institute"}),e.jsx("span",{className:"detail-value",style:{fontSize:"14px",color:"#1e293b",fontWeight:"700"},children:t.institute||"-"})]}),e.jsxs("div",{className:"detail-item",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"Class"}),e.jsx("span",{className:"detail-value",style:{fontSize:"14px",color:"#1e293b",fontWeight:"700"},children:t.class||"-"})]}),e.jsxs("div",{className:"detail-item",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"Medium"}),e.jsx("span",{className:"detail-value",style:{fontSize:"14px",color:"#1e293b",fontWeight:"700"},children:t.medium||"-"})]}),e.jsxs("div",{className:"detail-item",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"Subject"}),e.jsx("span",{className:"detail-value",style:{fontSize:"14px",color:"#1e293b",fontWeight:"700"},children:t.subject||"-"})]}),e.jsxs("div",{className:"detail-item",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"Day"}),e.jsx("span",{className:"detail-value",style:{fontSize:"14px",color:"#1e293b",fontWeight:"700"},children:t.day||"-"})]}),e.jsxs("div",{className:"detail-item",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"Time"}),e.jsx("span",{className:"detail-value",style:{fontSize:"14px",color:"#1e293b",fontWeight:"700"},children:t.time||"-"})]}),e.jsxs("div",{className:"detail-item",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"Salary"}),e.jsx("span",{className:"detail-value text-success",style:{fontSize:"14px",color:"#10b981",fontWeight:"700"},children:t.salary&&/taka|tk/i.test(t.salary.toString())?t.salary:t.salary?t.salary.toString().trim()+" taka":"-"})]}),t.mediaFee&&t.mediaFee.trim()!==""&&e.jsxs("div",{className:"detail-item",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"Media Fee"}),e.jsx("span",{className:"detail-value",style:{fontSize:"14px",color:"#1e293b",fontWeight:"700"},children:t.mediaFee})]}),e.jsxs("div",{className:"detail-item",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"Location"}),e.jsxs("span",{className:"detail-value",style:{fontSize:"14px",color:"#1e293b",fontWeight:"700"},children:[t.location||"",t.area?", "+t.area:""]})]}),e.jsxs("div",{className:"detail-item",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"Joining"}),e.jsx("span",{className:"detail-value",style:{fontSize:"14px",color:"#1e293b",fontWeight:"700"},children:t.joining||"-"})]}),e.jsxs("div",{className:"detail-item",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"Last Published Date"}),e.jsx("span",{className:"detail-value",style:{fontSize:"14px",color:"#1e293b",fontWeight:"700"},children:t.lastPublishedDate?new Date(t.lastPublishedDate).toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}):"-"})]}),e.jsxs("div",{className:"detail-item",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"বর্তমান অবস্থা"}),e.jsx("span",{className:"detail-value",style:{fontSize:"14px",color:"#1e293b",fontWeight:"700"},children:t.isPublish?"Published (প্রকাশিত)":"Not Published (অপ্রকাশিত)"})]})]}),t.studentGender&&e.jsxs("div",{className:"detail-item-full mt-3",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"শিক্ষার্থীর লিঙ্গ (Student Gender):"}),e.jsx("span",{className:"detail-value",style:{fontSize:"14.5px",color:"#1e293b",fontWeight:"700"},children:t.studentGender})]}),e.jsxs("div",{className:"detail-item-full mt-3",style:{display:"flex",flexDirection:"column",borderBottom:"1px solid #f1f5f9",paddingBottom:"8px"},children:[e.jsx("span",{className:"detail-label",style:{fontSize:"12px",color:"#64748b",fontWeight:"600",marginBottom:"4px"},children:"Guardian Demand"}),e.jsx("p",{className:"detail-value-desc",style:{fontSize:"13.5px",color:"#475569",background:"#f8fafc",borderRadius:"8px",padding:"10px 12px",margin:"4px 0 0 0",borderLeft:"3px solid #3b82f6",fontWeight:600},children:t.guardianDemandForPublic&&t.guardianDemandForPublic.trim()?t.guardianDemandForPublic:"অভিজ্ঞ শিক্ষক চাইছে ভালো দেখে"})]})]}):e.jsx("div",{className:"text-center py-4 text-danger",children:"কোনো তথ্য পাওয়া যায়নি"})}),e.jsx(u.Footer,{className:"border-0 pt-0",children:e.jsx(Z,{variant:"secondary",className:"rounded-pill px-4",onClick:()=>h(!1),style:{fontFamily:l},children:"বন্ধ করুন"})})]}),e.jsx(q,{})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
                /* ===== ROOT ===== */
                .apply-updates-root .au-header,
                .apply-updates-root .au-header *,
                .apply-updates-root .au-main-container,
                .apply-updates-root .au-main-container * {
                    font-family: ${l} !important;
                    box-sizing: border-box;
                }
                .apply-updates-root {
                    background: #f1f5f9;
                    min-height: 100vh;
                }

                /* ===== PREMIUM HERO ===== */
                .au-hero {
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(135deg, #0d1b4b 0%, #1a2d6b 40%, #1e3a8a 70%, #1d4ed8 100%);
                    padding: 14px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .au-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(70px);
                    opacity: 0.18;
                    pointer-events: none;
                }
                .au-blob-1 {
                    width: 380px; height: 380px;
                    background: radial-gradient(circle, #60a5fa, #3b82f6);
                    top: -200px; left: -80px;
                    animation: blobFloat1 8s ease-in-out infinite;
                }
                .au-blob-2 {
                    width: 280px; height: 280px;
                    background: radial-gradient(circle, #818cf8, #6366f1);
                    top: -140px; right: 5%;
                    animation: blobFloat2 10s ease-in-out infinite;
                }
                .au-blob-3 {
                    width: 220px; height: 220px;
                    background: radial-gradient(circle, #34d399, #10b981);
                    bottom: -160px; right: 30%;
                    animation: blobFloat1 12s ease-in-out infinite reverse;
                }
                @keyframes blobFloat1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(30px, -20px) scale(1.08); }
                }
                @keyframes blobFloat2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-20px, 15px) scale(1.05); }
                }
                .au-hero-inner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 4px;
                }
                .au-hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255,255,255,0.10);
                    border: 1px solid rgba(255,255,255,0.18);
                    backdrop-filter: blur(6px);
                    border-radius: 30px;
                    padding: 3px 12px;
                    font-size: 11px;
                    font-weight: 600;
                    color: #bfdbfe;
                    letter-spacing: 0.3px;
                    margin-bottom: 2px;
                }
                .au-badge-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #34d399;
                    display: inline-block;
                    box-shadow: 0 0 0 3px rgba(52,211,153,0.3);
                    animation: pulseDot 2s ease-in-out infinite;
                }
                @keyframes pulseDot {
                    0%, 100% { box-shadow: 0 0 0 3px rgba(52,211,153,0.3); }
                    50% { box-shadow: 0 0 0 6px rgba(52,211,153,0.1); }
                }
                .au-hero-title {
                    color: #f8fafc;
                    font-size: 22px;
                    font-weight: 800;
                    margin: 0;
                    line-height: 1.2;
                    letter-spacing: -0.3px;
                    text-shadow: 0 2px 20px rgba(0,0,0,0.3);
                }
                .au-hero-title-accent {
                    background: linear-gradient(90deg, #60a5fa, #818cf8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .au-hero-subtitle {
                    color: #93c5fd;
                    font-size: 13px;
                    font-weight: 400;
                    margin: 0;
                    max-width: 480px;
                    line-height: 1.5;
                    opacity: 0.9;
                }
                @media (max-width: 480px) {
                    .au-hero-title { font-size: 18px; }
                    .au-hero-subtitle { font-size: 12px; }
                    .au-hero { padding: 12px 0; }
                }

                /* ===== MAIN ===== */
                .au-main-container {
                    padding-top: 28px;
                    padding-bottom: 60px;
                    max-width: 1100px !important;
                }

                /* ===== SEARCH CARD ===== */
                .au-search-card {
                    background: #ffffff;
                    border-radius: 16px;
                    padding: 24px 28px;
                    margin-bottom: 32px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                }
                .au-search-row {
                    display: flex;
                    align-items: flex-end;
                    gap: 16px;
                }
                .au-search-input-wrap {
                    flex: 1;
                }
                .au-search-label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    color: #475569;
                    margin-bottom: 8px;
                }
                .au-input-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .au-input-icon {
                    position: absolute;
                    left: 14px;
                    color: #3b82f6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(59,130,246,0.08);
                }
                .au-input {
                    width: 100%;
                    height: 48px;
                    padding: 0 16px 0 54px;
                    border: 1.5px solid #cbd5e1;
                    border-radius: 12px;
                    font-size: 15px;
                    color: #1e293b;
                    background: #ffffff;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .au-input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
                }
                .au-input::placeholder { color: #94a3b8; }

                .au-search-btn {
                    height: 48px;
                    padding: 0 28px;
                    border: none;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    color: #fff;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    white-space: nowrap;
                    transition: opacity 0.2s, transform 0.15s;
                    box-shadow: 0 2px 8px rgba(37,99,235,0.25);
                }
                .au-search-btn:hover:not(:disabled) {
                    opacity: 0.92;
                    transform: translateY(-1px);
                }
                .au-search-btn:disabled {
                    background: #94a3b8;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .au-error {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 14px;
                    padding: 10px 14px;
                    border-radius: 10px;
                    background: #fef2f2;
                    color: #dc2626;
                    font-size: 13px;
                    font-weight: 500;
                    border: 1px solid #fecaca;
                }

                /* ===== EMPTY STATE ===== */
                .au-empty-state {
                    text-align: center;
                    padding: 56px 24px;
                    background: #fff;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    margin-bottom: 24px;
                }
                .au-empty-state svg {
                    color: #cbd5e1;
                    margin-bottom: 16px;
                }
                .au-empty-state h3 {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 8px;
                }
                .au-empty-state p {
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.65;
                    max-width: 420px;
                    margin: 0 auto;
                }

                /* ===== RESULTS HEADER ===== */
                .au-results {
                    animation: au-fade-in 0.35s ease-out;
                }
                .au-results-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                .au-results-title {
                    font-size: 19px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                    padding-left: 14px;
                    border-left: 4px solid #2563eb;
                }
                .au-results-actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .au-refresh-btn {
                    width: 36px;
                    height: 36px;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    background: #fff;
                    color: #2563eb;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
                }
                .au-refresh-btn:hover:not(:disabled) {
                    background: #eff6ff;
                    border-color: #bfdbfe;
                }
                .au-count-badge {
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    color: #fff;
                    font-size: 13px;
                    font-weight: 700;
                    padding: 6px 16px;
                    border-radius: 20px;
                }

                /* ===== ANIMATIONS ===== */
                .au-spin {
                    animation: au-spin-anim 1s linear infinite;
                }
                @keyframes au-spin-anim {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes au-fade-in {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 640px) {
                    .au-header { padding: 14px 0; }
                    .au-header-title { font-size: 18px; }
                    .au-header-subtitle { font-size: 12px; }
                    .au-search-card { padding: 18px 16px; }
                    .au-search-row {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .au-search-btn {
                        width: 100%;
                        justify-content: center;
                    }
                    .au-main-container { padding-top: 20px; }
                    .au-results-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }
                    
                    /* Custom stacking rules for table-like look inside card on mobile */
                    .au-apply-item table tr {
                        display: flex;
                        flex-direction: column;
                        border-bottom: 1.5px solid #e2e8f0;
                    }
                    .au-apply-item table tr td {
                        width: 100% !important;
                        border-right: none !important;
                    }
                }
            `}})]})};export{te as default};
