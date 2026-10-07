import{j as e,M as o,B as d,bc as Ke,r as i,a as k,y as l,bu as ae,c9 as Ve,bj as Ye,aD as we,aH as qe,c_ as Je,be as te,g as le,R as ke,f as j,as as Xe,bH as Qe,a$ as B,S as re,c$ as ve,k as Ze,n as Ne,W as es,d0 as ss,bL as Se,bB as as,by as ts,s as ne,bJ as rs,bK as ns,bf as is,bg as ls,aw as os}from"./index-DXeo9WSE.js";import{N as ds,T as Ce}from"./NavbarPage-Bs0fdJao.js";import{d as m}from"./styled-components.browser.esm-DOV6zWSv.js";import{F as r}from"./Form-B6k_hlOj.js";import{O as cs,T as ms}from"./OverlayTrigger-RagrxLWq.js";import"./mergeOptionsWithPopperConfig-D96InVuq.js";const xs=({show:a,onHide:p,onConfirm:W,title:O="Confirm Action",message:M="Are you sure you want to proceed?",confirmText:G="Yes",cancelText:E="Cancel",confirmVariant:n="danger",isLoading:c=!1})=>e.jsxs(o,{show:a,onHide:p,centered:!0,children:[e.jsx(o.Header,{closeButton:!0,children:e.jsx(o.Title,{children:O})}),e.jsx(o.Body,{children:e.jsx("p",{className:"mb-0",children:M})}),e.jsxs(o.Footer,{children:[e.jsx(d,{variant:"secondary",onClick:p,disabled:c,children:E}),e.jsx(d,{variant:n,onClick:W,disabled:c,children:c?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm me-2",role:"status","aria-hidden":"true"}),"Processing..."]}):G})]})]}),hs=m.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 3rem;
  font-family: 'Poppins', sans-serif;
`,ps=m.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
`,us=m.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;

  h2 {
    font-weight: 700;
    color: #0d6efd;
    margin-bottom: 0.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    color: #6c757d;
    font-size: 0.88rem;
    margin-bottom: 0;
  }
`,gs=m.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`,C=m.div`
  background: white;
  border-radius: 12px;
  padding: 0.85rem 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .icon-box {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    flex-shrink: 0;
    
    &.blue { background: #e0f2fe; color: #0284c7; }
    &.purple { background: #ede9fe; color: #7c3aed; }
    &.green { background: #dcfce7; color: #16a34a; }
    &.emerald { background: #d1fae5; color: #059669; }
    &.red { background: #fee2e2; color: #dc2626; }
    &.indigo { background: #e0e7ff; color: #4338ca; }
  }

  .content {
    min-width: 0;
    h4 { 
      margin: 0; 
      font-weight: 700; 
      color: #1e293b; 
      font-size: 1.2rem;
      line-height: 1.2;
    }
    p { 
      margin: 0; 
      font-size: 0.75rem; 
      font-weight: 600;
      color: #64748b; 
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`,fs=m(le)`
  border: 0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 1.25rem;
  background: #ffffff;
`,js=m(le)`
  border: 0;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  background: #ffffff;
  overflow: hidden;
`,bs=m.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.88rem;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.25);
  flex-shrink: 0;
`,ie=m.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  transition: all 0.15s ease;
  background: white;
  color: ${a=>a.$variant==="danger"?"#ef4444":a.$variant==="primary"?"#2563eb":a.$variant==="purple"?"#7c3aed":"#475569"};
  
  &:hover {
    background: ${a=>a.$variant==="danger"?"#fef2f2":a.$variant==="primary"?"#eff6ff":a.$variant==="purple"?"#f5f3ff":"#f1f5f9"};
    color: ${a=>a.$variant==="danger"?"#b91c1c":a.$variant==="primary"?"#1d4ed8":a.$variant==="purple"?"#6d28d9":"#0f172a"};
    border-color: ${a=>a.$variant==="danger"?"#fca5a5":a.$variant==="primary"?"#93c5fd":a.$variant==="purple"?"#c4b5fd":"#cbd5e1"};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Le=m.div`
  width: 38px;
  height: 20px;
  background: ${a=>a.$active?"#ef4444":"#22c55e"};
  border-radius: 50px;
  padding: 2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  position: relative;
  border: 1px solid ${a=>a.$active?"#dc2626":"#16a34a"};
  
  .knob {
    width: 14px;
    height: 14px;
    background: white;
    border-radius: 50%;
    transition: all 0.2s ease;
    transform: ${a=>a.$active?"translateX(18px)":"translateX(0)"};
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  }
  
  &:hover {
    filter: brightness(1.05);
  }
`,ys=m.div`
  background: #f8fafc;
  border-radius: 10px;
  padding: 0.75rem 0.85rem;
  border: 1px solid #e2e8f0;

  .permission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.45rem 0.55rem;
  }
`,ws=m.label`
  background: white;
  padding: 0.42rem 0.65rem;
  border-radius: 6px;
  border: 1px solid ${a=>a.$checked?"#93c5fd":"#e2e8f0"};
  background: ${a=>a.$checked?"#eff6ff":"#ffffff"};
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
    background: ${a=>a.$checked?"#e0f2fe":"#f8fafc"};
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
    color: ${a=>a.$checked?"#1e3a8a":"#334155"};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    line-height: 1.2;
  }
`,ks=m.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  
  .loader-content {
    background: white;
    padding: 2rem 2.5rem;
    border-radius: 16px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.12);
    text-align: center;
    border: 1px solid #edf2f7;
  }
`,L=[{key:"tuition",label:"Tuitions"},{key:"tuitionApply",label:"Tuition Apply"},{key:"guardianApply",label:"Guardian Apply"},{key:"premiumTeacher",label:"Premium Teachers"},{key:"payment",label:"Guardian Payments"},{key:"teacherPayment",label:"Teacher Payments"},{key:"refund",label:"Refund Requests"},{key:"serviceCharge",label:"Service Charges"},{key:"task",label:"Tasks"},{key:"lead",label:"Leads"},{key:"attendance",label:"Attendance"},{key:"complaints",label:"Complaints & Suggestions"},{key:"chat",label:"Live Chat"},{key:"internalChat",label:"Team Chat"},{key:"smsLogs",label:"SMS Logs"},{key:"spamBest",label:"Spam / Best"},{key:"general",label:"Global Search"},{key:"settings",label:"Settings"}],zs=()=>{const a=Ke(),[p,W]=i.useState([]),[O,M]=i.useState(!1),[G,E]=i.useState(!1),[n,c]=i.useState({username:"",password:"",name:"",role:"admin",permissions:[],autoLock:!1,perHourTk:""}),[u,_]=i.useState(null),[Ae,K]=i.useState(!1),[oe,V]=i.useState(null),[de,b]=i.useState(!1),[ze,y]=i.useState(""),[v,ce]=i.useState(""),[A,me]=i.useState("ALL"),[z,xe]=i.useState("ALL"),[w,H]=i.useState(1),[g,Ue]=i.useState(15),[Pe,he]=i.useState(null),[pe,Te]=i.useState([]),[$e,Y]=i.useState(!1),[Fe,Me]=i.useState(null),[Ee,ue]=i.useState(!1),[q,ge]=i.useState(null),[U,J]=i.useState(""),[X,fe]=i.useState(!1),f=localStorage.getItem("token"),Q=localStorage.getItem("role");i.useEffect(()=>{f||a("/admin/login")},[f,a]),i.useEffect(()=>{I()},[]);const I=async()=>{M(!0);try{const s=await k.get("https://tuition-seba-backend-1.onrender.com/api/user/users",{headers:{Authorization:f}});W(s.data||[])}catch(s){s.response&&(s.response.status===401||s.response.status===403)?(localStorage.removeItem("token"),localStorage.removeItem("role"),a("/admin/login"),l.error("Session expired. Please log in again.")):l.error("Error fetching users"),console.error("Error fetching users:",s)}finally{M(!1)}},N=i.useMemo(()=>{const s=p.length;let t=0,x=0,h=0,T=0,$=0;for(let F=0;F<p.length;F++){const R=p[F];R.role==="superadmin"?t++:R.role==="manager"?x++:h++,R.isLocked&&T++,R.autoLock&&$++}return{total:s,superadmins:t,managers:x,admins:h,locked:T,nightLock:$}},[p]),S=i.useMemo(()=>p.filter(s=>{const t=!v.trim()||s.username&&s.username.toLowerCase().includes(v.toLowerCase())||s.name&&s.name.toLowerCase().includes(v.toLowerCase()),x=A==="ALL"||s.role===A,h=z==="ALL"?!0:z==="LOCKED"?!!s.isLocked:!s.isLocked;return t&&x&&h}),[p,v,A,z]),D=Math.ceil(S.length/g)||1,Z=i.useMemo(()=>{const s=(w-1)*g;return S.slice(s,s+g)},[S,w,g]);i.useEffect(()=>{H(1)},[v,A,z,g]);const je=()=>{ce(""),me("ALL"),xe("ALL"),H(1)},He=s=>{ge(s),J(""),fe(!1),ue(!0)},ee=()=>{ue(!1),ge(null),J("")},be=async()=>{if(!U||!U.trim()){l.error("Please enter a new password");return}if(U.trim().length<4){l.error("Password must be at least 4 characters long");return}b(!0),y("Updating password...");try{await k.put(`https://tuition-seba-backend-1.onrender.com/api/user/change-password/${q._id}`,{newPassword:U.trim()},{headers:{Authorization:f}}),l.success(`Password updated successfully for ${q.name}`),ee()}catch(s){const t=s.response?.data?.message||"Error updating password";l.error(t)}finally{b(!1),y("")}},Ie=async s=>{he(s);try{await k.put(`https://tuition-seba-backend-1.onrender.com/api/user/toggle-lock/${s}`,{},{headers:{Authorization:f}}),await I(),l.success("User lock status updated")}catch(t){l.error(t.response?.data?.message||"Error toggling lock"),console.error("Lock error:",t)}finally{he(null)}},De=async s=>{Me(s),b(!0),y("Fetching login history...");try{const t=await k.get(`https://tuition-seba-backend-1.onrender.com/api/user/history/${s._id}`,{headers:{Authorization:f}});Te(t.data||[]),Y(!0)}catch(t){l.error("Error fetching login history"),console.error("History error:",t)}finally{b(!1),y("")}},Re=s=>{V(s),K(!0)},Be=async()=>{if(oe){b(!0),y("Deleting user...");try{await k.delete(`https://tuition-seba-backend-1.onrender.com/api/user/delete/${oe}`,{headers:{Authorization:f}}),await I(),l.success("User deleted successfully"),K(!1),V(null)}catch(s){s.response&&(s.response.status===401||s.response.status===403)?(localStorage.removeItem("token"),localStorage.removeItem("role"),a("/admin/login"),l.error("Session expired. Please log in again.")):l.error("Error deleting user"),console.error("Error deleting user:",s)}finally{b(!1),y("")}}},We=()=>{K(!1),V(null),l.info("Deletion cancelled")},ye=(s=null)=>{s?(_(s),c({username:s.username,password:"",name:s.name,role:s.role,permissions:s.permissions||[],autoLock:s.autoLock||!1,perHourTk:s.perHourTk!==void 0&&s.perHourTk!==null?s.perHourTk:s.salary!==void 0?s.salary:""})):(_(null),c({username:"",password:"",name:"",role:"admin",permissions:[],autoLock:!1,perHourTk:""})),E(!0)},se=()=>{E(!1),c({username:"",password:"",name:"",role:"admin",permissions:[],autoLock:!1,perHourTk:""}),_(null)},P=s=>{const{name:t,value:x}=s.target;c(h=>({...h,[t]:x}))},Oe=s=>{const t=[...n.permissions];t.includes(s)?c(x=>({...x,permissions:t.filter(h=>h!==s)})):c(x=>({...x,permissions:[...t,s]}))},Ge=()=>{const s=L.map(t=>t.key);n.permissions.length===s.length?c(t=>({...t,permissions:[]})):c(t=>({...t,permissions:s}))},_e=async()=>{if(!n.username||!n.username.trim()){l.error("Username is required");return}if(!n.name||!n.name.trim()){l.error("Name is required");return}if(!u&&(!n.password||!n.password.trim())){l.error("Password is required for new accounts");return}if(n.role!=="superadmin"&&(!n.permissions||n.permissions.length===0)){l.error(`Please select at least one permission for ${n.role} role`);return}b(!0),y(u?"Updating user...":"Creating user...");try{u?(await k.put(`https://tuition-seba-backend-1.onrender.com/api/user/edit/${u._id}`,n,{headers:{Authorization:f}}),l.success("User updated successfully")):(await k.post("https://tuition-seba-backend-1.onrender.com/api/user/register",n,{headers:{Authorization:f}}),l.success("User added successfully")),await I(),se()}catch(s){if(s.response&&(s.response.status===401||s.response.status===403))localStorage.removeItem("token"),localStorage.removeItem("role"),a("/admin/login"),l.error("Session expired. Please log in again.");else{const t=s.response?.data?.message||s.response?.data?.error||"Error saving user";l.error(t)}console.error("Error saving user:",s)}finally{b(!1),y("")}};return e.jsxs(hs,{children:[e.jsx(ds,{}),e.jsxs(ps,{children:[e.jsxs(us,{children:[e.jsxs("div",{children:[e.jsxs("h2",{children:[e.jsx(ae,{})," User Management"]}),e.jsx("p",{children:"Manage administrator accounts, permissions, and security controls"})]}),e.jsxs(d,{variant:"primary",className:"fw-bold d-flex align-items-center gap-2 shadow-sm rounded-pill px-4 py-2",onClick:()=>ye(),children:[e.jsx(Ve,{})," Add New User"]})]}),e.jsxs(gs,{children:[e.jsxs(C,{children:[e.jsx("div",{className:"icon-box blue",children:e.jsx(Ye,{})}),e.jsxs("div",{className:"content",children:[e.jsx("h4",{children:N.total}),e.jsx("p",{children:"Total Users"})]})]}),e.jsxs(C,{children:[e.jsx("div",{className:"icon-box purple",children:e.jsx(ae,{})}),e.jsxs("div",{className:"content",children:[e.jsx("h4",{children:N.superadmins}),e.jsx("p",{children:"Super Admins"})]})]}),e.jsxs(C,{children:[e.jsx("div",{className:"icon-box emerald",children:e.jsx(we,{})}),e.jsxs("div",{className:"content",children:[e.jsx("h4",{children:N.managers}),e.jsx("p",{children:"Managers"})]})]}),e.jsxs(C,{children:[e.jsx("div",{className:"icon-box green",children:e.jsx(qe,{})}),e.jsxs("div",{className:"content",children:[e.jsx("h4",{children:N.admins}),e.jsx("p",{children:"Admins"})]})]}),e.jsxs(C,{children:[e.jsx("div",{className:"icon-box red",children:e.jsx(Je,{})}),e.jsxs("div",{className:"content",children:[e.jsx("h4",{children:N.locked}),e.jsx("p",{children:"Locked Accounts"})]})]}),e.jsxs(C,{children:[e.jsx("div",{className:"icon-box indigo",children:e.jsx(te,{})}),e.jsxs("div",{className:"content",children:[e.jsx("h4",{children:N.nightLock}),e.jsx("p",{children:"Night Lock"})]})]})]}),e.jsx(fs,{children:e.jsx(le.Body,{className:"p-3",children:e.jsxs(ke,{className:"g-2 align-items-end",children:[e.jsxs(j,{xs:12,md:5,children:[e.jsx(r.Label,{className:"fw-bold text-muted small mb-1",children:"SEARCH USER"}),e.jsxs("div",{className:"d-flex align-items-center bg-light rounded px-3 border",style:{height:"38px"},children:[e.jsx(Xe,{className:"text-secondary me-2"}),e.jsx(r.Control,{type:"text",placeholder:"Search by name or username...",value:v,onChange:s=>ce(s.target.value),className:"border-0 bg-transparent shadow-none p-0",style:{fontSize:"0.88rem"}})]})]}),e.jsxs(j,{xs:6,md:3,children:[e.jsx(r.Label,{className:"fw-bold text-muted small mb-1",children:"ROLE"}),e.jsxs(r.Select,{value:A,onChange:s=>me(s.target.value),size:"sm",style:{height:"38px",fontSize:"0.88rem"},children:[e.jsx("option",{value:"ALL",children:"All Roles"}),e.jsx("option",{value:"superadmin",children:"Super Admin"}),e.jsx("option",{value:"manager",children:"Manager"}),e.jsx("option",{value:"admin",children:"Admin"})]})]}),e.jsxs(j,{xs:6,md:2,children:[e.jsx(r.Label,{className:"fw-bold text-muted small mb-1",children:"LOCK STATUS"}),e.jsxs(r.Select,{value:z,onChange:s=>xe(s.target.value),size:"sm",style:{height:"38px",fontSize:"0.88rem"},children:[e.jsx("option",{value:"ALL",children:"All Status"}),e.jsx("option",{value:"ACTIVE",children:"Active / Unlocked"}),e.jsx("option",{value:"LOCKED",children:"Locked"})]})]}),e.jsx(j,{xs:12,md:2,className:"d-flex gap-2",children:e.jsxs(d,{variant:"outline-secondary",size:"sm",className:"w-100 d-flex align-items-center justify-content-center gap-1",onClick:je,style:{height:"38px"},children:[e.jsx(Qe,{size:12})," Reset"]})})]})})}),e.jsxs(js,{children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center p-3 border-bottom bg-light",children:[e.jsxs("div",{className:"fw-bold text-dark d-flex align-items-center gap-2",style:{fontSize:"0.95rem"},children:[e.jsx("span",{children:"User Accounts"}),e.jsx(B,{bg:"primary",pill:!0,style:{fontSize:"0.75rem"},children:S.length})]}),e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx("span",{className:"text-muted small",children:"Show:"}),e.jsxs(r.Select,{size:"sm",value:g,onChange:s=>Ue(Number(s.target.value)),style:{width:"80px",height:"32px",fontSize:"0.82rem"},children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:15,children:"15"}),e.jsx("option",{value:25,children:"25"}),e.jsx("option",{value:50,children:"50"}),e.jsx("option",{value:100,children:"100"})]})]})]}),O?e.jsxs("div",{className:"text-center py-5",children:[e.jsx(re,{animation:"border",variant:"primary"}),e.jsx("p",{className:"mt-2 text-muted small",children:"Loading user accounts..."})]}):e.jsx("div",{className:"table-responsive",children:e.jsxs(Ce,{hover:!0,className:"align-middle text-center mb-0",style:{fontSize:"0.88rem"},children:[e.jsx("thead",{className:"bg-light text-muted",style:{borderBottom:"2px solid #e2e8f0"},children:e.jsxs("tr",{children:[e.jsx("th",{style:{width:"50px"},className:"py-3",children:"#"}),e.jsx("th",{className:"text-start py-3",style:{minWidth:"220px"},children:"User Details"}),e.jsx("th",{className:"py-3",style:{minWidth:"130px"},children:"Role"}),e.jsx("th",{className:"py-3",style:{minWidth:"140px"},children:"Status & Access"}),e.jsx("th",{className:"py-3",style:{minWidth:"130px"},children:"Permissions"}),e.jsx("th",{className:"py-3",style:{minWidth:"130px"},children:"Security"}),Q==="superadmin"&&e.jsx("th",{className:"py-3",style:{width:"90px"},children:"Lock"}),e.jsx("th",{className:"text-end py-3 pe-4",style:{minWidth:"120px"},children:"Actions"})]})}),e.jsx("tbody",{children:Z.length>0?Z.map((s,t)=>{const x=(w-1)*g+t+1,h=s.role==="superadmin"?"primary":s.role==="manager"?"success":"secondary";return e.jsxs("tr",{style:{borderBottom:"1px solid #f1f5f9",background:s.isLocked?"#fffafa":"transparent"},children:[e.jsx("td",{className:"text-muted fw-bold",children:x}),e.jsx("td",{className:"text-start",children:e.jsxs("div",{className:"d-flex align-items-center gap-2.5",children:[e.jsx(bs,{children:s.name?s.name.charAt(0).toUpperCase():"U"}),e.jsxs("div",{style:{minWidth:0},children:[e.jsx("div",{className:`fw-bold text-truncate ${s.isLocked?"text-danger":"text-dark"}`,style:{maxWidth:"180px"},title:s.name,children:s.name}),e.jsxs("div",{className:"text-muted small text-truncate",style:{maxWidth:"180px",fontSize:"0.78rem"},children:["@",s.username]}),s.perHourTk>0&&e.jsxs("div",{className:"text-primary mt-0.5",style:{fontSize:"0.72rem",fontWeight:"700"},children:["৳",s.perHourTk,"/hr"]})]})]})}),e.jsx("td",{children:e.jsxs(B,{bg:h,className:"text-uppercase px-2 py-1 fw-bold",style:{fontSize:"0.72rem",letterSpacing:"0.03em"},children:[s.role==="superadmin"&&e.jsx(ae,{className:"me-1"}),s.role==="manager"&&e.jsx(we,{className:"me-1"}),s.role==="admin"&&e.jsx(ve,{className:"me-1"}),s.role]})}),e.jsx("td",{children:e.jsxs("div",{className:"d-flex flex-column align-items-center gap-1",children:[e.jsx(B,{bg:s.role==="superadmin"?"primary":s.isLocked?"danger":"success",className:"px-2 py-0.5",style:{fontSize:"0.7rem",fontWeight:"700"},children:s.role==="superadmin"?"SUPER":s.isLocked?"LOCKED":"ACTIVE"}),s.autoLock?e.jsxs("div",{className:"d-inline-flex align-items-center gap-1 bg-dark text-white px-2 py-0.5 rounded",style:{fontSize:"0.64rem",fontWeight:"700"},children:[e.jsx(te,{size:8})," NIGHT LOCK"]}):e.jsxs("div",{className:"d-inline-flex align-items-center gap-1 bg-light text-secondary border px-2 py-0.5 rounded",style:{fontSize:"0.64rem",fontWeight:"700"},children:[e.jsx(Ze,{size:8,className:"text-success"})," 24/7 ACCESS"]})]})}),e.jsx("td",{children:s.role==="superadmin"?e.jsx("span",{className:"badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1",style:{fontSize:"0.72rem",fontWeight:"600"},children:"All Access (Super)"}):e.jsx(cs,{placement:"top",overlay:e.jsx(ms,{id:`tooltip-perm-${s._id}`,children:(s.permissions||[]).map(T=>{const $=L.find(F=>F.key===T);return $?$.label:T}).join(", ")||"No permissions assigned"}),children:e.jsxs("span",{className:"badge bg-light text-secondary border px-2 py-1",style:{fontSize:"0.72rem",fontWeight:"600",cursor:"pointer"},children:[(s.permissions||[]).length," / ",L.length," Modules"]})})}),e.jsx("td",{children:e.jsxs(d,{size:"sm",variant:"outline-warning",className:"text-dark fw-semibold d-inline-flex align-items-center gap-1 px-2 py-1",style:{fontSize:"0.74rem",borderRadius:"6px"},onClick:()=>He(s),title:"Change user password",children:[e.jsx(Ne,{size:10,className:"text-warning"}),e.jsx("span",{children:"Change Pass"})]})}),Q==="superadmin"&&e.jsx("td",{children:s.role!=="superadmin"?e.jsxs("div",{className:"d-flex justify-content-center align-items-center gap-1.5",title:s.isLocked?"Unlock User":"Lock User",children:[Pe===s._id?e.jsx(re,{animation:"border",size:"sm",variant:"primary",style:{width:"1.1rem",height:"1.1rem"}}):e.jsx(Le,{$active:s.isLocked,onClick:()=>Ie(s._id),children:e.jsx("div",{className:"knob"})}),s.isLocked?e.jsx(es,{size:11,color:"#dc2626"}):e.jsx(ss,{size:11,color:"#94a3b8"})]}):e.jsx("span",{className:"text-muted small",children:"-"})}),e.jsx("td",{className:"text-end pe-4",children:e.jsxs("div",{className:"d-inline-flex gap-1.5 align-items-center",children:[e.jsx(ie,{$variant:"purple",onClick:()=>De(s),title:"Login History",children:e.jsx(Se,{size:13})}),e.jsx(ie,{$variant:"primary",onClick:()=>ye(s),title:"Edit User",children:e.jsx(as,{size:13})}),e.jsx(ie,{$variant:"danger",onClick:()=>Re(s._id),title:"Delete User",children:e.jsx(ts,{size:13})})]})})]},s._id)}):e.jsx("tr",{children:e.jsx("td",{colSpan:Q==="superadmin"?8:7,className:"py-5 text-muted",children:e.jsxs("div",{className:"d-flex flex-column align-items-center justify-content-center",children:[e.jsx(ne,{size:28,className:"text-secondary mb-2 opacity-50"}),e.jsx("span",{className:"fw-semibold",children:"No user records match your search or filter"}),e.jsx(d,{variant:"link",size:"sm",onClick:je,className:"mt-1",children:"Clear search & filters"})]})})})})]})}),D>1&&e.jsxs("div",{className:"d-flex justify-content-between align-items-center p-3 border-top bg-light flex-wrap gap-2",children:[e.jsxs("span",{className:"text-muted small",children:["Showing ",Z.length>0?(w-1)*g+1:0," to ",Math.min(w*g,S.length)," of ",S.length," users"]}),e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsxs(d,{variant:"outline-primary",size:"sm",className:"d-flex align-items-center gap-1 rounded-pill px-3",disabled:w===1,onClick:()=>H(s=>Math.max(s-1,1)),children:[e.jsx(rs,{size:10})," Prev"]}),e.jsxs("span",{className:"fw-bold text-primary small px-2",children:[w," / ",D]}),e.jsxs(d,{variant:"outline-primary",size:"sm",className:"d-flex align-items-center gap-1 rounded-pill px-3",disabled:w===D,onClick:()=>H(s=>Math.min(s+1,D)),children:["Next ",e.jsx(ns,{size:10})]})]})]})]}),e.jsxs(o,{show:G,onHide:se,centered:!0,size:"lg",contentClassName:"border-0 shadow-lg",style:{borderRadius:"1rem"},children:[e.jsx(o.Header,{closeButton:!0,className:"py-3 px-4 bg-light border-bottom",children:e.jsxs(o.Title,{className:"fs-5 fw-bold text-primary d-flex align-items-center gap-2",children:[e.jsx(ve,{}),e.jsx("span",{children:u?"Update User Details":"Register New Account"})]})}),e.jsx(o.Body,{className:"p-4",children:e.jsxs(r,{children:[e.jsxs(ke,{className:"g-3",children:[e.jsx(j,{md:6,children:e.jsxs(r.Group,{controlId:"formName",children:[e.jsx(r.Label,{className:"fw-bold text-dark small",children:"Full Name"}),e.jsx(r.Control,{type:"text",placeholder:"e.g. John Doe",name:"name",value:n.name,onChange:P})]})}),e.jsx(j,{md:6,children:e.jsxs(r.Group,{controlId:"formUsername",children:[e.jsx(r.Label,{className:"fw-bold text-dark small",children:"Username"}),e.jsx(r.Control,{type:"text",placeholder:"e.g. johndoe123",name:"username",value:n.username,onChange:P,disabled:!!u})]})}),!u&&e.jsx(j,{md:6,children:e.jsxs(r.Group,{controlId:"formPassword",children:[e.jsx(r.Label,{className:"fw-bold text-dark small",children:"Access Password"}),e.jsx(r.Control,{type:"password",placeholder:"Enter secure password",name:"password",value:n.password,onChange:P})]})}),e.jsx(j,{md:6,children:e.jsxs(r.Group,{controlId:"formRole",children:[e.jsx(r.Label,{className:"fw-bold text-dark small",children:"System Role"}),e.jsxs(r.Select,{name:"role",value:n.role,onChange:P,children:[e.jsx("option",{value:"admin",children:"Admin"}),e.jsx("option",{value:"manager",children:"Manager"}),e.jsx("option",{value:"superadmin",children:"Super Admin"})]})]})}),e.jsx(j,{md:6,children:e.jsxs(r.Group,{controlId:"formPerHourTk",children:[e.jsx(r.Label,{className:"fw-bold text-dark small",children:"Per Hour Rate (TK)"}),e.jsx(r.Control,{type:"number",placeholder:"e.g. 100",name:"perHourTk",value:n.perHourTk,onChange:P})]})})]}),n.role!=="superadmin"&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"mt-3 mb-3 p-2.5 px-3 bg-light rounded-3 border",children:e.jsxs("div",{className:"row align-items-center",children:[e.jsxs("div",{className:"col-md-7",children:[e.jsxs("div",{className:"fw-bold text-dark",style:{fontSize:"0.82rem"},children:[e.jsx(te,{className:"text-primary me-1.5"})," Night Lock (12AM - 7AM)"]}),e.jsx("div",{className:"text-muted",style:{fontSize:"0.74rem"},children:"Restrict login access during night hours in BD (GMT+6)."})]}),e.jsxs("div",{className:"col-md-5 d-flex justify-content-end align-items-center gap-2",children:[e.jsx("span",{className:`fw-bold ${n.autoLock?"text-primary":"text-muted"}`,style:{fontSize:"0.74rem"},children:n.autoLock?"ACTIVE":"DISABLED"}),e.jsx(Le,{$active:n.autoLock,onClick:()=>c(s=>({...s,autoLock:!s.autoLock})),children:e.jsx("div",{className:"knob"})})]})]})}),e.jsxs("div",{className:"mt-3 mb-2",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-2",children:[e.jsxs("div",{children:[e.jsx(r.Label,{className:"fw-bold mb-0 text-dark",style:{fontSize:"0.85rem"},children:"Access Permissions"}),e.jsxs("div",{className:"text-muted",style:{fontSize:"0.75rem"},children:[n.permissions.length," of ",L.length," modules selected"]})]}),e.jsx(d,{variant:"outline-primary",size:"sm",onClick:Ge,className:"rounded-pill px-3 py-1 fw-semibold",style:{fontSize:"0.74rem"},children:n.permissions.length===L.length?"Revoke All":"Grant All"})]}),e.jsx(ys,{children:e.jsx("div",{className:"permission-grid",children:L.map(s=>{const t=n.permissions.includes(s.key);return e.jsxs(ws,{$checked:t,htmlFor:`perm-${s.key}`,children:[e.jsx("input",{type:"checkbox",id:`perm-${s.key}`,checked:t,onChange:()=>Oe(s.key)}),e.jsx("span",{className:"perm-text",title:s.label,children:s.label})]},s.key)})})}),e.jsxs("div",{className:"mt-2 text-muted d-flex align-items-center gap-1.5",style:{fontSize:"0.74rem"},children:[e.jsx(ne,{color:"#4299e1",size:12}),e.jsx("span",{children:"Finance, Logs, Reports & User management are strictly restricted to Super Admins."})]})]})]})]})}),e.jsxs(o.Footer,{className:"bg-light border-0 p-3",children:[e.jsx(d,{variant:"secondary",onClick:se,className:"fw-semibold px-4",children:"Cancel"}),e.jsx(d,{variant:"primary",onClick:_e,className:"fw-semibold px-4",children:u?"Save Changes":"Create Account"})]})]}),e.jsx(xs,{show:Ae,onHide:We,onConfirm:Be,title:"Delete User",message:"Are you sure you want to delete this user? This action cannot be undone.",confirmText:"Delete User",confirmVariant:"danger",isLoading:de}),e.jsxs(o,{show:$e,onHide:()=>Y(!1),centered:!0,size:"xl",contentClassName:"border-0 shadow-lg",style:{borderRadius:"1rem"},children:[e.jsx(o.Header,{closeButton:!0,className:"py-3 px-4 bg-light border-bottom",children:e.jsxs(o.Title,{className:"fs-5 fw-bold text-primary d-flex align-items-center gap-2",children:[e.jsx(Se,{}),e.jsxs("span",{children:["Login Activity: ",Fe?.name]})]})}),e.jsx(o.Body,{className:"p-0",style:{maxHeight:"650px",overflowY:"auto"},children:pe.length>0?e.jsx("div",{className:"table-responsive",children:e.jsxs(Ce,{hover:!0,className:"mb-0 align-middle text-center",style:{fontSize:"0.85rem"},children:[e.jsx("thead",{className:"bg-light sticky-top",children:e.jsxs("tr",{style:{borderBottom:"2px solid #e2e8f0"},children:[e.jsx("th",{className:"px-3 py-2.5 text-muted small text-uppercase fw-bold text-start",children:"Login Date"}),e.jsx("th",{className:"px-3 py-2.5 text-muted small text-uppercase fw-bold",children:"Time"}),e.jsx("th",{className:"px-3 py-2.5 text-muted small text-uppercase fw-bold text-start",children:"Device & OS"}),e.jsx("th",{className:"px-3 py-2.5 text-muted small text-uppercase fw-bold text-start",children:"User Agent"}),e.jsx("th",{className:"px-3 py-2.5 text-muted small text-uppercase fw-bold text-end pe-4",children:"IP Address"})]})}),e.jsx("tbody",{children:pe.map((s,t)=>e.jsxs("tr",{style:{borderBottom:"1px solid #f1f5f9"},children:[e.jsx("td",{className:"px-3 py-2.5 fw-bold text-dark text-start",children:new Date(s.timestamp).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}),e.jsx("td",{className:"px-3 py-2.5 text-secondary",children:new Date(s.timestamp).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}),e.jsx("td",{className:"px-3 py-2.5 text-start",children:e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx(B,{bg:s.userAgent?.includes("Mobile")?"info":"primary",className:"bg-opacity-10 text-primary border border-primary px-2 py-0.5",children:s.userAgent?.includes("Mobile")?"Mobile":"Desktop"}),e.jsx("span",{className:"small text-muted",children:s.userAgent?.match(/\(([^)]+)\)/)?.[1]?.split(";")[0]||"Unknown OS"})]})}),e.jsx("td",{className:"px-3 py-2.5 text-start",children:e.jsx("div",{className:"text-muted small text-truncate",style:{maxWidth:"280px"},title:s.userAgent,children:s.userAgent})}),e.jsx("td",{className:"px-3 py-2.5 text-end pe-4",children:e.jsx("code",{className:"bg-light px-2 py-1 rounded text-dark border small",children:s.ip==="::1"?"127.0.0.1":s.ip})})]},t))})]})}):e.jsxs("div",{className:"text-center py-5 text-muted",children:[e.jsx(ne,{size:28,className:"mb-2 opacity-50"}),e.jsx("p",{className:"mb-0",children:"No login records found for this account."})]})}),e.jsx(o.Footer,{className:"bg-light border-0 p-3",children:e.jsx(d,{variant:"secondary",onClick:()=>Y(!1),className:"px-4 fw-semibold",children:"Close"})})]}),e.jsxs(o,{show:Ee,onHide:ee,centered:!0,contentClassName:"border-0 shadow-lg",style:{borderRadius:"1rem"},children:[e.jsx(o.Header,{closeButton:!0,className:"py-3 px-4 bg-light border-bottom",children:e.jsxs(o.Title,{className:"fs-5 fw-bold text-dark d-flex align-items-center gap-2",children:[e.jsx(Ne,{className:"text-warning"}),e.jsxs("span",{children:["Change Password: ",q?.name]})]})}),e.jsx(o.Body,{className:"p-4",children:e.jsx(r,{onSubmit:s=>{s.preventDefault(),be()},children:e.jsxs(r.Group,{controlId:"formChangeNewPassword",children:[e.jsx(r.Label,{className:"fw-bold text-dark small",children:"New Password"}),e.jsxs("div",{className:"position-relative",children:[e.jsx(r.Control,{type:X?"text":"password",placeholder:"Enter new password (min 4 characters)",value:U,onChange:s=>J(s.target.value),autoFocus:!0}),e.jsx("button",{type:"button",onClick:()=>fe(!X),style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#94a3b8",cursor:"pointer",display:"flex",alignItems:"center",padding:0},children:X?e.jsx(is,{size:14}):e.jsx(ls,{size:14})})]}),e.jsx(r.Text,{className:"text-muted",style:{fontSize:"0.78rem"},children:"The new password will be securely hashed with bcrypt upon saving."})]})})}),e.jsxs(o.Footer,{className:"bg-light border-0 p-3",children:[e.jsx(d,{variant:"secondary",onClick:ee,className:"fw-semibold px-3",children:"Cancel"}),e.jsx(d,{variant:"primary",onClick:be,className:"fw-semibold px-4",children:"Update Password"})]})]}),de&&e.jsx(ks,{children:e.jsxs("div",{className:"loader-content",children:[e.jsx(re,{animation:"border",variant:"primary",size:"lg"}),e.jsx("h5",{className:"mt-3 fw-bold text-primary mb-1",children:ze}),e.jsx("p",{className:"text-muted small mb-0",children:"Please wait, performing action..."})]})}),e.jsx(os,{})]})]})};export{zs as default};
