import{j as e,M as l,B as u,bc as ze,r as n,a as f,y as o,as as Ae,cq as Te,be as ae,k as Pe,n as te,bu as $e,aD as Me,c_ as Fe,S as R,W as Ee,c$ as He,bL as ne,bB as De,by as Ie,s as oe,bf as Be,bg as Re,aw as _e}from"./index-Bk6jmH2m.js";import{N as Oe,T as We}from"./NavbarPage-BX_O5xcW.js";import{d as i,m as le}from"./styled-components.browser.esm-D6zil3Ad.js";import{F as d}from"./Form-B-3rUo4i.js";const Ye=({show:r,onHide:N,onConfirm:L,title:U="Confirm Action",message:S="Are you sure you want to proceed?",confirmText:Y="Yes",cancelText:p="Cancel",confirmVariant:z="danger",isLoading:b=!1})=>e.jsxs(l,{show:r,onHide:N,centered:!0,children:[e.jsx(l.Header,{closeButton:!0,children:e.jsx(l.Title,{children:U})}),e.jsx(l.Body,{children:e.jsx("p",{className:"mb-0",children:S})}),e.jsxs(l.Footer,{children:[e.jsx(u,{variant:"secondary",onClick:N,disabled:b,children:p}),e.jsx(u,{variant:z,onClick:L,disabled:b,children:b?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm me-2",role:"status","aria-hidden":"true"}),"Processing..."]}):Y})]})]}),de=le`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`,Ge=le`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`,qe=i.div`
  background: radial-gradient(at 0% 0%, rgba(66, 153, 225, 0.05) 0, transparent 50%), 
              radial-gradient(at 50% 0%, rgba(128, 90, 213, 0.05) 0, transparent 50%), 
              radial-gradient(at 100% 0%, rgba(246, 173, 85, 0.05) 0, transparent 50%);
  background-color: #f8fafc;
  min-height: 100vh;
  padding-bottom: 5rem;
  font-family: 'Poppins', sans-serif;
`,Ke=i.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 3rem 10px;
  animation: ${de} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`,Ve=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`,Xe=i.div`
  h2 {
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.25rem;
  }
  p {
    color: #718096;
    margin-bottom: 0;
  }
`,Je=i.div`
  position: relative;
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #a0aec0;
  }

  input {
    padding: 0.6rem 1rem 0.6rem 2.8rem;
    border-radius: 50px;
    border: 1px solid #e2e8f0;
    width: 100%;
    transition: all 0.3s;
    background: white;

    &:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
    }
  }
`,_=i(u)`
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(66, 153, 225, 0.2);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(66, 153, 225, 0.3);
  }
`;i.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #edf2f7;
`;const Qe=i.div`
  display: grid;
  grid-template-columns: 2.2fr 1.5fr 1.2fr 1.5fr 1.5fr 140px;
  gap: 1rem;
  padding: 0 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  align-items: center;
  
  span {
    font-size: 0.75rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (max-width: 992px) {
    display: none;
  }
`,Ze=i.div`
  background: ${r=>r.isLocked?"#fffafa":"white"};
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 2.2fr 1.5fr 1.2fr 1.5fr 1.5fr 140px;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${r=>r.isLocked?"#fee2e2":"rgba(226, 232, 240, 0.6)"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    border-color: ${r=>r.isLocked?"#fecaca":"rgba(66, 153, 225, 0.4)"};
  }

  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
`,es=i.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 10px rgba(118, 75, 162, 0.2);
`;i.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${r=>r.active?"#10b981":"#f59e0b"};
  display: inline-block;
  margin-right: 8px;
  box-shadow: 0 0 0 3px ${r=>r.active?"rgba(16, 185, 129, 0.1)":"rgba(245, 158, 11, 0.1)"};
`;const ss=i.span`
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  
  background: ${r=>r.role==="superadmin"?"rgba(235, 248, 255, 1)":r.role==="manager"?"#ecfdf5":"rgba(247, 250, 252, 1)"};
  color: ${r=>r.role==="superadmin"?"#2b6cb0":r.role==="manager"?"#047857":"#4a5568"};
  border: 1px solid ${r=>r.role==="superadmin"?"#bee3f8":r.role==="manager"?"#a7f3d0":"#e2e8f0"};
`,O=i.button`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f1f5f9;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: ${r=>r.variant==="danger"?"#ef4444":"#64748b"};
  
  &:hover {
    background: ${r=>r.variant==="danger"?"#fef2f2":"#f8fafc"};
    color: ${r=>r.variant==="danger"?"#b91c1c":"#334155"};
    border-color: ${r=>r.variant==="danger"?"#fee2e2":"#e2e8f0"};
    transform: translateY(-1px);
  }
`,ie=i.div`
  width: 48px;
  height: 24px;
  background: ${r=>r.$active?"#ef4444":"#22c55e"};
  border-radius: 50px;
  padding: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 1px solid ${r=>r.$active?"#dc2626":"#16a34a"};
  
  .knob {
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: ${r=>r.$active?"translateX(24px)":"translateX(0)"};
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  &:hover {
    filter: brightness(1.05);
  }
`,W=i(l.Header)`
  background: #f8fafc;
  border-bottom: 1px solid #edf2f7;
  padding: 1.5rem;
  
  .modal-title {
    font-weight: 700;
    color: #1a202c;
  }
`,j=i(d.Group)`
  margin-bottom: 1rem;
  
  label {
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 0.35rem;
    font-size: 0.85rem;
  }
  
  input, select {
    padding: 0.55rem 0.85rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    font-size: 0.88rem;
    transition: all 0.2s;
    
    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
`,rs=i.div`
  background: #f8fafc;
  border-radius: 10px;
  padding: 0.75rem 0.85rem;
  border: 1px solid #e2e8f0;

  .permission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.45rem 0.55rem;
  }
`,as=i.label`
  background: white;
  padding: 0.42rem 0.65rem;
  border-radius: 6px;
  border: 1px solid ${r=>r.$checked?"#93c5fd":"#e2e8f0"};
  background: ${r=>r.$checked?"#f0f7ff":"#ffffff"};
  transition: all 0.15s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 34px;
  cursor: pointer;
  user-select: none;
  margin: 0;

  &:hover {
    border-color: #60a5fa;
    background: ${r=>r.$checked?"#eff6ff":"#f8fafc"};
  }

  input[type="checkbox"] {
    cursor: pointer;
    margin: 0 !important;
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    accent-color: #2563eb;
  }

  .perm-text {
    font-weight: 500;
    font-size: 0.8rem;
    color: ${r=>r.$checked?"#1e3a8a":"#334155"};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    line-height: 1.2;
  }
`,ts=i.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  
  .loader-content {
    background: white;
    padding: 2.5rem;
    border-radius: 24px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    text-align: center;
    border: 1px solid #edf2f7;
    animation: ${de} 0.3s ease-out;
  }
`,ns=i.div`
  height: 30px;
  background: #f1f5f9;
  border-radius: 4px;
  animation: ${Ge} 1.5s infinite ease-in-out;
`,w=[{key:"tuition",label:"Tuitions"},{key:"tuitionApply",label:"Tuition Apply"},{key:"guardianApply",label:"Guardian Apply"},{key:"premiumTeacher",label:"Premium Teachers"},{key:"payment",label:"Guardian Payments"},{key:"teacherPayment",label:"Teacher Payments"},{key:"refund",label:"Refund Requests"},{key:"serviceCharge",label:"Service Charges"},{key:"task",label:"Tasks"},{key:"lead",label:"Leads"},{key:"attendance",label:"Attendance"},{key:"complaints",label:"Complaints & Suggestions"},{key:"chat",label:"Live Chat"},{key:"internalChat",label:"Team Chat"},{key:"smsLogs",label:"SMS Logs"},{key:"spamBest",label:"Spam / Best"},{key:"general",label:"Global Search"},{key:"settings",label:"Settings"}];i.div`
  padding: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
  
  &:hover {
    background: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  .details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .timestamp {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.95rem;
  }
  
  .device-info {
    color: #64748b;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .ip-badge {
    background: #f1f5f9;
    color: #475569;
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.75rem;
    font-weight: 600;
  }
`;const xs=()=>{const r=ze(),[N,L]=n.useState([]),[U,S]=n.useState(!1),[Y,p]=n.useState(null),[z,b]=n.useState(!1),[t,c]=n.useState({username:"",password:"",name:"",role:"admin",permissions:[],autoLock:!1,perHourTk:""}),[x,A]=n.useState(null),[ce,T]=n.useState(!1),[P,$]=n.useState(null),[G,os]=n.useState(!1),[q,h]=n.useState(!1),[me,g]=n.useState(""),[M,K]=n.useState(""),[is,ls]=n.useState({}),[pe,V]=n.useState(null),[X,xe]=n.useState([]),[he,F]=n.useState(!1),[ge,ue]=n.useState(null),[fe,J]=n.useState(!1),[E,Q]=n.useState(null),[k,H]=n.useState(""),[D,Z]=n.useState(!1),m=localStorage.getItem("token"),be=localStorage.getItem("role"),ye=s=>{Q(s),H(""),Z(!1),J(!0)},I=()=>{J(!1),Q(null),H("")},ee=async()=>{if(!k||!k.trim()){o.error("Please enter a new password");return}if(k.trim().length<4){o.error("Password must be at least 4 characters long");return}h(!0),g("Updating password...");try{await f.put(`https://tuition-seba-backend-1.onrender.com/api/user/change-password/${E._id}`,{newPassword:k.trim()},{headers:{Authorization:m}}),o.success(`Password updated successfully for ${E.name}`),I()}catch(s){const a=s.response?.data?.message||"Error updating password";o.error(a)}finally{h(!1),g("")}},je=async s=>{V(s);try{await f.put(`https://tuition-seba-backend-1.onrender.com/api/user/toggle-lock/${s}`,{},{headers:{Authorization:m}}),await C(),o.success("User lock status updated")}catch(a){o.error(a.response?.data?.message||"Error toggling lock"),console.error("Lock error:",a)}finally{V(null)}},we=async s=>{ue(s),h(!0),g("Fetching login history...");try{const a=await f.get(`https://tuition-seba-backend-1.onrender.com/api/user/history/${s._id}`,{headers:{Authorization:m}});xe(a.data),F(!0)}catch(a){o.error("Error fetching login history"),console.error("History error:",a)}finally{h(!1),g("")}};n.useEffect(()=>{m||r("/admin/login")},[m,r]),n.useEffect(()=>{C()},[]);const C=async()=>{S(!0),p(null);try{const s=await f.get("https://tuition-seba-backend-1.onrender.com/api/user/users",{headers:{Authorization:m}});L(s.data)}catch(s){s.response&&(s.response.status===401||s.response.status===403)?(localStorage.removeItem("token"),localStorage.removeItem("role"),r("/admin/login"),o.error("Session expired. Please log in again.")):(p("Error fetching users"),o.error("Error fetching users")),console.error("Error fetching users:",s)}finally{S(!1)}},ke=async s=>{$(s),T(!0)},ve=async()=>{if(P){h(!0),g("Deleting user..."),p(null);try{await f.delete(`https://tuition-seba-backend-1.onrender.com/api/user/delete/${P}`,{headers:{Authorization:m}}),await C(),o.success("User deleted successfully"),T(!1),$(null)}catch(s){s.response&&(s.response.status===401||s.response.status===403)?(localStorage.removeItem("token"),localStorage.removeItem("role"),r("/admin/login"),o.error("Session expired. Please log in again.")):(p("Error deleting user"),o.error("Error deleting user")),console.error("Error deleting user:",s)}finally{h(!1),g("")}}},Ne=()=>{T(!1),$(null),o.info("Deletion cancelled")},se=(s=null)=>{s?(A(s),c({username:s.username,password:"",name:s.name,role:s.role,permissions:s.permissions||[],autoLock:s.autoLock||!1,perHourTk:s.perHourTk!==void 0&&s.perHourTk!==null?s.perHourTk:s.salary!==void 0?s.salary:""})):(A(null),c({username:"",password:"",name:"",role:"admin",permissions:[],autoLock:!1,perHourTk:""})),b(!0)},B=()=>{b(!1),c({username:"",password:"",name:"",role:"admin",permissions:[],autoLock:!1,perHourTk:""}),A(null)},v=s=>{const{name:a,value:y}=s.target;c({...t,[a]:y})},Se=s=>{const a=[...t.permissions];a.includes(s)?c({...t,permissions:a.filter(y=>y!==s)}):c({...t,permissions:[...a,s]})},Ce=()=>{const s=w.map(a=>a.key);t.permissions.length===s.length?c({...t,permissions:[]}):c({...t,permissions:s})},Le=async()=>{if(!t.username||!t.username.trim()){o.error("Username is required");return}if(!t.name||!t.name.trim()){o.error("Name is required");return}if(!x&&(!t.password||!t.password.trim())){o.error("Password is required for new accounts");return}if(t.role!=="superadmin"&&(!t.permissions||t.permissions.length===0)){o.error(`Please select at least one permission for ${t.role} role`);return}h(!0),g(x?"Updating user...":"Creating user..."),p(null);try{x?(await f.put(`https://tuition-seba-backend-1.onrender.com/api/user/edit/${x._id}`,t,{headers:{Authorization:m}}),o.success("User updated successfully")):(await f.post("https://tuition-seba-backend-1.onrender.com/api/user/register",t,{headers:{Authorization:m}}),o.success("User added successfully")),await C(),B()}catch(s){if(s.response&&(s.response.status===401||s.response.status===403))localStorage.removeItem("token"),localStorage.removeItem("role"),r("/admin/login"),o.error("Session expired. Please log in again.");else{const a=s.response?.data?.message||s.response?.data?.error||"Error saving user";p(a),o.error(a)}console.error("Error saving user:",s)}finally{h(!1),g("")}},re=N.filter(s=>s.username.toLowerCase().includes(M.toLowerCase())||s.name.toLowerCase().includes(M.toLowerCase()));return e.jsxs(qe,{children:[e.jsx(Oe,{}),e.jsxs(Ke,{children:[e.jsxs(Ve,{children:[e.jsxs(Xe,{children:[e.jsx("h2",{children:"User Management"}),e.jsx("p",{children:"Manage administrator accounts and access permissions"})]}),e.jsxs("div",{className:"d-flex gap-3 flex-wrap",children:[e.jsxs(Je,{children:[e.jsx(Ae,{}),e.jsx("input",{type:"text",placeholder:"Search by name or username...",value:M,onChange:s=>K(s.target.value)})]}),e.jsxs(_,{variant:"primary",onClick:()=>se(),children:[e.jsx(Te,{})," Add New User"]})]})]}),U?e.jsx("div",{className:"d-flex flex-column gap-3",children:[1,2,3,4].map(s=>e.jsx(ns,{},s))}):e.jsxs("div",{children:[e.jsxs(Qe,{children:[e.jsx("span",{children:"Full Name"}),e.jsx("span",{children:"Username"}),e.jsx("span",{children:"Status"}),e.jsx("span",{children:"Credentials"}),e.jsx("span",{children:"Access Role"}),e.jsx("span",{className:"text-end",children:"Actions"})]}),re.length>0?re.map(s=>e.jsxs(Ze,{$isLocked:s.isLocked,children:[e.jsxs("div",{className:"d-flex align-items-center gap-3",children:[e.jsx(es,{children:s.name.charAt(0).toUpperCase()}),e.jsxs("div",{children:[e.jsx("div",{className:`fw-bold ${s.isLocked?"text-danger":"text-dark"}`,children:s.name}),e.jsx("div",{className:"text-muted small d-lg-none",children:s.username}),s.perHourTk>0&&e.jsxs("div",{className:"text-muted",style:{fontSize:"0.72rem",fontWeight:"600"},children:["৳",s.perHourTk,"/hr"]})]})]}),e.jsx("div",{className:"d-none d-lg-block",children:e.jsx("span",{className:"text-secondary fw-medium",children:s.username})}),e.jsx("div",{children:e.jsxs("div",{className:"d-flex flex-column",children:[e.jsx("span",{className:`fw-bold small ${s.role==="superadmin"?"text-primary":s.isLocked?"text-danger":"text-success"}`,style:{letterSpacing:"0.02em"},children:s.role==="superadmin"?"SUPER":s.isLocked?"LOCKED":"UNLOCKED"}),e.jsx("div",{className:"d-flex align-items-center mt-1 flex-wrap gap-2",children:s.autoLock?e.jsxs("div",{className:"d-flex align-items-center gap-1 bg-dark text-white px-2 py-0.5 rounded",style:{fontSize:"0.65rem",fontWeight:"700"},children:[e.jsx(ae,{size:8}),e.jsx("span",{children:"NIGHT LOCK"})]}):e.jsxs("div",{className:"d-flex align-items-center gap-1 bg-light text-secondary border px-2 py-0.5 rounded",style:{fontSize:"0.65rem",fontWeight:"700"},children:[e.jsx(Pe,{size:8,className:"text-success"}),e.jsx("span",{children:"24/7 ACCESS"})]})})]})}),e.jsx("div",{children:e.jsxs("button",{type:"button",className:"d-flex align-items-center gap-2 border-0",style:{background:"#f8fafc",padding:"6px 12px",borderRadius:"8px",border:"1px solid #e2e8f0",cursor:"pointer",transition:"all 0.2s ease",color:"#475569",fontSize:"0.8rem",fontWeight:"600"},onMouseEnter:a=>{a.currentTarget.style.background="#fef3c7",a.currentTarget.style.borderColor="#fde68a",a.currentTarget.style.color="#b45309"},onMouseLeave:a=>{a.currentTarget.style.background="#f8fafc",a.currentTarget.style.borderColor="#e2e8f0",a.currentTarget.style.color="#475569"},onClick:()=>ye(s),title:"Click to change password",children:[e.jsx(te,{size:11,style:{color:"#d97706"}}),e.jsx("span",{children:"Change Password"})]})}),e.jsxs("div",{children:[e.jsxs(ss,{role:s.role,children:[s.role==="superadmin"?e.jsx($e,{}):s.role==="manager"?e.jsx(Me,{}):e.jsx(Fe,{}),s.role==="superadmin"?"Super Admin":s.role==="manager"?"Manager":"Admin"]}),s.role!=="superadmin"&&e.jsx("div",{className:"mt-1",children:e.jsxs("span",{className:"badge bg-light text-secondary border",style:{fontSize:"0.68rem",fontWeight:"600",cursor:"help"},title:(s.permissions||[]).map(a=>{const y=w.find(Ue=>Ue.key===a);return y?y.label:a}).join(", ")||"No permissions",children:[(s.permissions||[]).length," / ",w.length," Modules"]})})]}),e.jsx("div",{children:e.jsxs("div",{className:"d-flex gap-3 justify-content-end align-items-center",children:[be==="superadmin"&&s.role!=="superadmin"&&e.jsxs("div",{className:"d-flex align-items-center gap-2",title:s.isLocked?"Unlock User":"Lock User",children:[pe===s._id?e.jsx(R,{animation:"border",size:"sm",variant:"primary",style:{width:"1.25rem",height:"1.25rem"}}):e.jsx(ie,{$active:s.isLocked,onClick:()=>je(s._id),children:e.jsx("div",{className:"knob"})}),s.isLocked?e.jsx(Ee,{size:12,color:"#dc2626"}):e.jsx(He,{size:12,color:"#94a3b8"})]}),e.jsx("div",{className:"vr",style:{height:"24px",opacity:.1}}),e.jsx(O,{onClick:()=>we(s),title:"Login History",style:{color:"#6366f1"},children:e.jsx(ne,{size:14})}),e.jsx(O,{onClick:()=>se(s),title:"Edit User",children:e.jsx(De,{size:14})}),e.jsx(O,{variant:"danger",onClick:()=>ke(s._id),disabled:G,title:"Delete User",children:G&&P===s._id?e.jsx(R,{animation:"border",size:"sm"}):e.jsx(Ie,{size:14})})]})})]},s._id)):e.jsxs("div",{className:"text-center py-5 bg-white rounded-4 border border-dashed",children:[e.jsx("div",{className:"text-muted mb-2",children:"No users found"}),e.jsx(u,{variant:"link",onClick:()=>K(""),children:"Clear search"})]})]}),e.jsxs(l,{show:z,onHide:B,centered:!0,size:"lg",contentClassName:"border-0 shadow-xl",style:{borderRadius:"1rem"},children:[e.jsx(W,{closeButton:!0,className:"py-3 px-4",children:e.jsx(l.Title,{className:"fs-5",children:x?"Update User Details":"Register New Account"})}),e.jsx(l.Body,{className:"p-4",children:e.jsxs(d,{children:[e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-md-6",children:e.jsxs(j,{controlId:"formName",children:[e.jsx(d.Label,{children:"Full Name"}),e.jsx(d.Control,{type:"text",placeholder:"John Doe",name:"name",value:t.name,onChange:v})]})}),e.jsx("div",{className:"col-md-6",children:e.jsxs(j,{controlId:"formUsername",children:[e.jsx(d.Label,{children:"Username"}),e.jsx(d.Control,{type:"text",placeholder:"johndoe123",name:"username",value:t.username,onChange:v,disabled:!!x})]})}),!x&&e.jsx("div",{className:"col-md-6",children:e.jsxs(j,{controlId:"formPassword",children:[e.jsx(d.Label,{children:"Access Password"}),e.jsx(d.Control,{type:"password",placeholder:"Strong password",name:"password",value:t.password,onChange:v})]})}),e.jsx("div",{className:"col-md-6",children:e.jsxs(j,{controlId:"formRole",children:[e.jsx(d.Label,{children:"System Role"}),e.jsxs(d.Select,{name:"role",value:t.role,onChange:v,children:[e.jsx("option",{value:"admin",children:"Admin"}),e.jsx("option",{value:"manager",children:"Manager"}),e.jsx("option",{value:"superadmin",children:"Super Admin"})]})]})}),e.jsx("div",{className:"col-md-6",children:e.jsxs(j,{controlId:"formPerHourTk",children:[e.jsx(d.Label,{children:"Per Hour Rate (TK)"}),e.jsx(d.Control,{type:"number",placeholder:"e.g. 100",name:"perHourTk",value:t.perHourTk,onChange:v})]})})]}),t.role!=="superadmin"&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"mt-2 mb-3 p-2.5 px-3 bg-light rounded-3 border",children:e.jsxs("div",{className:"row align-items-center",children:[e.jsxs("div",{className:"col-md-7",children:[e.jsxs("div",{className:"fw-bold text-dark",style:{fontSize:"0.82rem"},children:[e.jsx(ae,{className:"text-primary me-1.5"})," Night Lock (12AM - 7AM)"]}),e.jsx("div",{className:"text-muted",style:{fontSize:"0.74rem"},children:"Restrict login access during night hours in BD (GMT+6)."})]}),e.jsxs("div",{className:"col-md-5 d-flex justify-content-end align-items-center gap-2",children:[e.jsx("span",{className:`fw-bold ${t.autoLock?"text-primary":"text-muted"}`,style:{fontSize:"0.74rem"},children:t.autoLock?"ACTIVE":"DISABLED"}),e.jsx(ie,{$active:t.autoLock,onClick:()=>c({...t,autoLock:!t.autoLock}),children:e.jsx("div",{className:"knob"})})]})]})}),e.jsxs("div",{className:"mt-3 mb-2",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-2",children:[e.jsxs("div",{children:[e.jsx(d.Label,{className:"fw-bold mb-0 text-dark",style:{fontSize:"0.85rem"},children:"Access Permissions"}),e.jsxs("div",{className:"text-muted",style:{fontSize:"0.75rem"},children:[t.permissions.length," of ",w.length," modules selected"]})]}),e.jsx(u,{variant:"outline-primary",size:"sm",onClick:Ce,className:"rounded-pill px-3 py-1 fw-semibold text-decoration-none",style:{fontSize:"0.74rem"},children:t.permissions.length===w.length?"Revoke All":"Grant All"})]}),e.jsx(rs,{children:e.jsx("div",{className:"permission-grid",children:w.map(s=>{const a=t.permissions.includes(s.key);return e.jsxs(as,{$checked:a,htmlFor:`perm-${s.key}`,children:[e.jsx("input",{type:"checkbox",id:`perm-${s.key}`,checked:a,onChange:()=>Se(s.key)}),e.jsx("span",{className:"perm-text",title:s.label,children:s.label})]},s.key)})})}),e.jsxs("div",{className:"mt-2 text-muted d-flex align-items-center gap-1.5",style:{fontSize:"0.74rem"},children:[e.jsx(oe,{color:"#4299e1",size:12}),e.jsx("span",{children:"Finance, Logs, Reports & User management are strictly restricted to Super Admins."})]})]})]})]})}),e.jsxs(l.Footer,{className:"bg-light border-0 p-3",children:[e.jsx(u,{variant:"link",onClick:B,className:"text-decoration-none text-muted fw-semibold",children:"Cancel"}),e.jsx(_,{variant:"primary",onClick:Le,children:x?"Save Changes":"Create Account"})]})]}),e.jsx(Ye,{show:ce,onHide:Ne,onConfirm:ve,title:"Delete User",message:"Are you sure you want to delete this user? This action cannot be undone.",confirmText:"Delete User",confirmVariant:"danger",isLoading:q}),e.jsxs(l,{show:he,onHide:()=>F(!1),centered:!0,size:"xl",contentClassName:"border-0 shadow-2xl",style:{borderRadius:"1.5rem"},children:[e.jsx(W,{closeButton:!0,children:e.jsxs(l.Title,{className:"d-flex align-items-center gap-2",children:[e.jsx(ne,{className:"text-primary"}),e.jsxs("span",{children:["Login Activity: ",ge?.name]})]})}),e.jsx(l.Body,{className:"p-0",style:{maxHeight:"700px",overflowY:"auto"},children:X.length>0?e.jsx("div",{className:"table-responsive",children:e.jsxs(We,{hover:!0,responsive:!0,className:"mb-0 align-middle",children:[e.jsx("thead",{className:"bg-light sticky-top",children:e.jsxs("tr",{style:{borderBottom:"2px solid #e2e8f0"},children:[e.jsx("th",{className:"px-4 py-3 text-muted small text-uppercase fw-bold",children:"Login Date"}),e.jsx("th",{className:"px-4 py-3 text-muted small text-uppercase fw-bold",children:"Time"}),e.jsx("th",{className:"px-4 py-3 text-muted small text-uppercase fw-bold",children:"Device & OS"}),e.jsx("th",{className:"px-4 py-3 text-muted small text-uppercase fw-bold",children:"Full User Agent"}),e.jsx("th",{className:"px-4 py-3 text-muted small text-uppercase fw-bold text-end",children:"IP Address"})]})}),e.jsx("tbody",{children:X.map((s,a)=>e.jsxs("tr",{style:{borderBottom:"1px solid #f1f5f9"},children:[e.jsx("td",{className:"px-4 py-3 fw-bold text-dark",children:new Date(s.timestamp).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}),e.jsx("td",{className:"px-4 py-3 text-secondary",children:new Date(s.timestamp).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}),e.jsx("td",{className:"px-4 py-3",children:e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx("span",{className:`badge ${s.userAgent.includes("Mobile")?"bg-info":"bg-primary"} bg-opacity-10 text-${s.userAgent.includes("Mobile")?"info":"primary"} px-2 py-1`,children:s.userAgent.includes("Mobile")?"Mobile":"Desktop"}),e.jsx("span",{className:"small text-muted",children:s.userAgent.match(/\(([^)]+)\)/)?.[1]?.split(";")[0]||"Unknown OS"})]})}),e.jsx("td",{className:"px-4 py-3",children:e.jsx("div",{className:"text-muted small text-truncate",style:{maxWidth:"300px"},title:s.userAgent,children:s.userAgent})}),e.jsx("td",{className:"px-4 py-3 text-end",children:e.jsx("code",{className:"bg-light px-2 py-1 rounded text-dark border small",style:{letterSpacing:"0.05em"},children:s.ip==="::1"?"127.0.0.1":s.ip})})]},a))})]})}):e.jsxs("div",{className:"text-center py-5 text-muted",children:[e.jsx(oe,{size:24,className:"mb-2 opacity-20"}),e.jsx("p",{children:"No login records found for this account."})]})}),e.jsx(l.Footer,{className:"bg-light border-0 p-3",children:e.jsx(u,{variant:"secondary",onClick:()=>F(!1),className:"px-4 fw-semibold",children:"Close"})})]}),e.jsxs(l,{show:fe,onHide:I,centered:!0,contentClassName:"border-0 shadow-xl",style:{borderRadius:"1rem"},children:[e.jsx(W,{closeButton:!0,className:"py-3 px-4",children:e.jsxs(l.Title,{className:"fs-5 d-flex align-items-center gap-2",children:[e.jsx(te,{className:"text-warning"}),e.jsxs("span",{children:["Change Password: ",E?.name]})]})}),e.jsx(l.Body,{className:"p-4",children:e.jsx(d,{onSubmit:s=>{s.preventDefault(),ee()},children:e.jsxs(j,{controlId:"formChangeNewPassword",children:[e.jsx(d.Label,{children:"New Password"}),e.jsxs("div",{className:"position-relative",children:[e.jsx(d.Control,{type:D?"text":"password",placeholder:"Enter new password (min 4 characters)",value:k,onChange:s=>H(s.target.value),autoFocus:!0}),e.jsx("button",{type:"button",onClick:()=>Z(!D),style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#94a3b8",cursor:"pointer",display:"flex",alignItems:"center",padding:0},children:D?e.jsx(Be,{size:14}):e.jsx(Re,{size:14})})]}),e.jsx(d.Text,{className:"text-muted",style:{fontSize:"0.78rem"},children:"The new password will be securely hashed with bcrypt upon saving."})]})})}),e.jsxs(l.Footer,{className:"bg-light border-0 p-3",children:[e.jsx(u,{variant:"link",onClick:I,className:"text-decoration-none text-muted fw-semibold",children:"Cancel"}),e.jsx(_,{variant:"primary",onClick:ee,children:"Update Password"})]})]}),q&&e.jsx(ts,{children:e.jsxs("div",{className:"loader-content",children:[e.jsx(R,{animation:"border",variant:"primary",size:"lg"}),e.jsx("h4",{className:"mt-3 fw-bold text-primary",children:me}),e.jsx("p",{className:"text-muted mb-0",children:"Please wait, performing action..."})]})}),e.jsx(_e,{})]})]})};export{xs as default};
