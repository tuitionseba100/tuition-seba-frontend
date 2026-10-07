import{j as e,M as o,B as d,bc as Ke,r as l,a as k,y as i,bu as re,c9 as Ve,bj as qe,aD as we,aH as Ye,c_ as Je,be as ae,g as ie,R as ke,f as b,as as Xe,bH as Qe,a$ as B,S as te,c$ as ve,k as Ze,n as Ne,W as es,d0 as ss,bL as Se,bB as rs,by as as,s as ne,bJ as ts,bK as ns,bf as ls,bg as is,aw as os}from"./index-CvPrlWQM.js";import{N as ds,T as Ce}from"./NavbarPage-CiGAirgp.js";import{d as x}from"./styled-components.browser.esm-Dy1xj6Xe.js";import{F as t}from"./Form-jlTn_Y2b.js";import{O as cs,T as ms}from"./OverlayTrigger-V7KdhVEZ.js";import"./mergeOptionsWithPopperConfig-q8G57WxO.js";const xs=({show:r,onHide:p,onConfirm:W,title:O="Confirm Action",message:M="Are you sure you want to proceed?",confirmText:G="Yes",cancelText:E="Cancel",confirmVariant:n="danger",isLoading:c=!1})=>e.jsxs(o,{show:r,onHide:p,centered:!0,children:[e.jsx(o.Header,{closeButton:!0,children:e.jsx(o.Title,{children:O})}),e.jsx(o.Body,{children:e.jsx("p",{className:"mb-0",children:M})}),e.jsxs(o.Footer,{children:[e.jsx(d,{variant:"secondary",onClick:p,disabled:c,children:E}),e.jsx(d,{variant:n,onClick:W,disabled:c,children:c?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm me-2",role:"status","aria-hidden":"true"}),"Processing..."]}):G})]})]}),hs=x.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 3rem;
  font-family: 'Poppins', sans-serif;
  width: 100%;
`,ps=x.div`
  width: 100%;
  padding: 1.25rem 1.5rem;
`,us=x.div`
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
`,gs=x.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`,C=x.div`
  background: white;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  }

  .icon-box {
    width: 38px;
    height: 38px;
    border-radius: 8px;
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
`,fs=x(ie)`
  border: 1px solid #dee2e6;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  margin-bottom: 1.25rem;
  background: #ffffff;
`,bs=x(ie)`
  border: 1px solid #dee2e6;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
  background: #ffffff;
  overflow: hidden;
`,le=x.button`
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ced4da;
  transition: all 0.15s ease;
  background: white;
  color: ${r=>r.$variant==="danger"?"#dc3545":r.$variant==="primary"?"#0d6efd":r.$variant==="purple"?"#6f42c1":"#495057"};
  
  &:hover {
    background: ${r=>r.$variant==="danger"?"#f8d7da":r.$variant==="primary"?"#cfe2ff":r.$variant==="purple"?"#e2d9f3":"#e9ecef"};
    color: ${r=>r.$variant==="danger"?"#842029":r.$variant==="primary"?"#084298":r.$variant==="purple"?"#432874":"#212529"};
    border-color: ${r=>r.$variant==="danger"?"#f5c2c7":r.$variant==="primary"?"#b6d4fe":r.$variant==="purple"?"#c5b3e6":"#adb5bd"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Le=x.div`
  width: 36px;
  height: 18px;
  background: ${r=>r.$active?"#dc3545":"#198754"};
  border-radius: 50px;
  padding: 2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  position: relative;
  border: 1px solid ${r=>r.$active?"#b02a37":"#146c43"};
  
  .knob {
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    transition: all 0.2s ease;
    transform: ${r=>r.$active?"translateX(18px)":"translateX(0)"};
    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }
  
  &:hover {
    filter: brightness(1.05);
  }
`,js=x.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.75rem 0.85rem;
  border: 1px solid #ced4da;

  .permission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.45rem 0.55rem;
  }
`,ys=x.label`
  background: white;
  padding: 0.42rem 0.65rem;
  border-radius: 6px;
  border: 1px solid ${r=>r.$checked?"#86b7fe":"#dee2e6"};
  background: ${r=>r.$checked?"#e7f1ff":"#ffffff"};
  transition: all 0.15s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 34px;
  cursor: pointer;
  user-select: none;
  margin: 0;

  &:hover {
    border-color: #0d6efd;
    background: ${r=>r.$checked?"#cfe2ff":"#f8f9fa"};
  }

  input[type="checkbox"] {
    cursor: pointer;
    margin: 0 !important;
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    accent-color: #0d6efd;
  }

  .perm-text {
    font-weight: 500;
    font-size: 0.8rem;
    color: ${r=>r.$checked?"#084298":"#212529"};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    line-height: 1.2;
  }
`,ws=x.div`
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
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    text-align: center;
    border: 1px solid #dee2e6;
  }
`,L=[{key:"tuition",label:"Tuitions"},{key:"tuitionApply",label:"Tuition Apply"},{key:"guardianApply",label:"Guardian Apply"},{key:"premiumTeacher",label:"Premium Teachers"},{key:"payment",label:"Guardian Payments"},{key:"teacherPayment",label:"Teacher Payments"},{key:"refund",label:"Refund Requests"},{key:"serviceCharge",label:"Service Charges"},{key:"task",label:"Tasks"},{key:"lead",label:"Leads"},{key:"attendance",label:"Attendance"},{key:"complaints",label:"Complaints & Suggestions"},{key:"chat",label:"Live Chat"},{key:"internalChat",label:"Team Chat"},{key:"smsLogs",label:"SMS Logs"},{key:"spamBest",label:"Spam / Best"},{key:"general",label:"Global Search"},{key:"settings",label:"Settings"}],As=()=>{const r=Ke(),[p,W]=l.useState([]),[O,M]=l.useState(!1),[G,E]=l.useState(!1),[n,c]=l.useState({username:"",password:"",name:"",role:"admin",permissions:[],autoLock:!1,perHourTk:""}),[u,_]=l.useState(null),[Ae,K]=l.useState(!1),[oe,V]=l.useState(null),[de,j]=l.useState(!1),[ze,y]=l.useState(""),[v,ce]=l.useState(""),[A,me]=l.useState("ALL"),[z,xe]=l.useState("ALL"),[w,H]=l.useState(1),[g,Ue]=l.useState(15),[Pe,he]=l.useState(null),[pe,Te]=l.useState([]),[$e,q]=l.useState(!1),[Fe,Me]=l.useState(null),[Ee,ue]=l.useState(!1),[Y,ge]=l.useState(null),[U,J]=l.useState(""),[X,fe]=l.useState(!1),f=localStorage.getItem("token"),Q=localStorage.getItem("role");l.useEffect(()=>{f||r("/admin/login")},[f,r]),l.useEffect(()=>{I()},[]);const I=async()=>{M(!0);try{const s=await k.get("https://tuition-seba-backend-1.onrender.com/api/user/users",{headers:{Authorization:f}});W(s.data||[])}catch(s){s.response&&(s.response.status===401||s.response.status===403)?(localStorage.removeItem("token"),localStorage.removeItem("role"),r("/admin/login"),i.error("Session expired. Please log in again.")):i.error("Error fetching users"),console.error("Error fetching users:",s)}finally{M(!1)}},N=l.useMemo(()=>{const s=p.length;let a=0,m=0,h=0,T=0,$=0;for(let F=0;F<p.length;F++){const R=p[F];R.role==="superadmin"?a++:R.role==="manager"?m++:h++,R.isLocked&&T++,R.autoLock&&$++}return{total:s,superadmins:a,managers:m,admins:h,locked:T,nightLock:$}},[p]),S=l.useMemo(()=>p.filter(s=>{const a=!v.trim()||s.username&&s.username.toLowerCase().includes(v.toLowerCase())||s.name&&s.name.toLowerCase().includes(v.toLowerCase()),m=A==="ALL"||s.role===A,h=z==="ALL"?!0:z==="LOCKED"?!!s.isLocked:!s.isLocked;return a&&m&&h}),[p,v,A,z]),D=Math.ceil(S.length/g)||1,Z=l.useMemo(()=>{const s=(w-1)*g;return S.slice(s,s+g)},[S,w,g]);l.useEffect(()=>{H(1)},[v,A,z,g]);const be=()=>{ce(""),me("ALL"),xe("ALL"),H(1)},He=s=>{ge(s),J(""),fe(!1),ue(!0)},ee=()=>{ue(!1),ge(null),J("")},je=async()=>{if(!U||!U.trim()){i.error("Please enter a new password");return}if(U.trim().length<4){i.error("Password must be at least 4 characters long");return}j(!0),y("Updating password...");try{await k.put(`https://tuition-seba-backend-1.onrender.com/api/user/change-password/${Y._id}`,{newPassword:U.trim()},{headers:{Authorization:f}}),i.success(`Password updated successfully for ${Y.name}`),ee()}catch(s){const a=s.response?.data?.message||"Error updating password";i.error(a)}finally{j(!1),y("")}},Ie=async s=>{he(s);try{await k.put(`https://tuition-seba-backend-1.onrender.com/api/user/toggle-lock/${s}`,{},{headers:{Authorization:f}}),await I(),i.success("User lock status updated")}catch(a){i.error(a.response?.data?.message||"Error toggling lock"),console.error("Lock error:",a)}finally{he(null)}},De=async s=>{Me(s),j(!0),y("Fetching login history...");try{const a=await k.get(`https://tuition-seba-backend-1.onrender.com/api/user/history/${s._id}`,{headers:{Authorization:f}});Te(a.data||[]),q(!0)}catch(a){i.error("Error fetching login history"),console.error("History error:",a)}finally{j(!1),y("")}},Re=s=>{V(s),K(!0)},Be=async()=>{if(oe){j(!0),y("Deleting user...");try{await k.delete(`https://tuition-seba-backend-1.onrender.com/api/user/delete/${oe}`,{headers:{Authorization:f}}),await I(),i.success("User deleted successfully"),K(!1),V(null)}catch(s){s.response&&(s.response.status===401||s.response.status===403)?(localStorage.removeItem("token"),localStorage.removeItem("role"),r("/admin/login"),i.error("Session expired. Please log in again.")):i.error("Error deleting user"),console.error("Error deleting user:",s)}finally{j(!1),y("")}}},We=()=>{K(!1),V(null),i.info("Deletion cancelled")},ye=(s=null)=>{s?(_(s),c({username:s.username,password:"",name:s.name,role:s.role,permissions:s.permissions||[],autoLock:s.autoLock||!1,perHourTk:s.perHourTk!==void 0&&s.perHourTk!==null?s.perHourTk:s.salary!==void 0?s.salary:""})):(_(null),c({username:"",password:"",name:"",role:"admin",permissions:[],autoLock:!1,perHourTk:""})),E(!0)},se=()=>{E(!1),c({username:"",password:"",name:"",role:"admin",permissions:[],autoLock:!1,perHourTk:""}),_(null)},P=s=>{const{name:a,value:m}=s.target;c(h=>({...h,[a]:m}))},Oe=s=>{const a=[...n.permissions];a.includes(s)?c(m=>({...m,permissions:a.filter(h=>h!==s)})):c(m=>({...m,permissions:[...a,s]}))},Ge=()=>{const s=L.map(a=>a.key);n.permissions.length===s.length?c(a=>({...a,permissions:[]})):c(a=>({...a,permissions:s}))},_e=async()=>{if(!n.username||!n.username.trim()){i.error("Username is required");return}if(!n.name||!n.name.trim()){i.error("Name is required");return}if(!u&&(!n.password||!n.password.trim())){i.error("Password is required for new accounts");return}if(n.role!=="superadmin"&&(!n.permissions||n.permissions.length===0)){i.error(`Please select at least one permission for ${n.role} role`);return}j(!0),y(u?"Updating user...":"Creating user...");try{u?(await k.put(`https://tuition-seba-backend-1.onrender.com/api/user/edit/${u._id}`,n,{headers:{Authorization:f}}),i.success("User updated successfully")):(await k.post("https://tuition-seba-backend-1.onrender.com/api/user/register",n,{headers:{Authorization:f}}),i.success("User added successfully")),await I(),se()}catch(s){if(s.response&&(s.response.status===401||s.response.status===403))localStorage.removeItem("token"),localStorage.removeItem("role"),r("/admin/login"),i.error("Session expired. Please log in again.");else{const a=s.response?.data?.message||s.response?.data?.error||"Error saving user";i.error(a)}console.error("Error saving user:",s)}finally{j(!1),y("")}};return e.jsxs(hs,{children:[e.jsx(ds,{}),e.jsxs(ps,{children:[e.jsxs(us,{children:[e.jsxs("div",{children:[e.jsxs("h2",{children:[e.jsx(re,{})," User Management"]}),e.jsx("p",{children:"Manage administrator accounts, permissions, and security controls"})]}),e.jsxs(d,{variant:"primary",className:"fw-bold d-flex align-items-center gap-2 shadow-sm rounded-pill px-4 py-2",onClick:()=>ye(),children:[e.jsx(Ve,{})," Add New User"]})]}),e.jsxs(gs,{children:[e.jsxs(C,{children:[e.jsx("div",{className:"icon-box blue",children:e.jsx(qe,{})}),e.jsxs("div",{className:"content",children:[e.jsx("h4",{children:N.total}),e.jsx("p",{children:"Total Users"})]})]}),e.jsxs(C,{children:[e.jsx("div",{className:"icon-box purple",children:e.jsx(re,{})}),e.jsxs("div",{className:"content",children:[e.jsx("h4",{children:N.superadmins}),e.jsx("p",{children:"Super Admins"})]})]}),e.jsxs(C,{children:[e.jsx("div",{className:"icon-box emerald",children:e.jsx(we,{})}),e.jsxs("div",{className:"content",children:[e.jsx("h4",{children:N.managers}),e.jsx("p",{children:"Managers"})]})]}),e.jsxs(C,{children:[e.jsx("div",{className:"icon-box green",children:e.jsx(Ye,{})}),e.jsxs("div",{className:"content",children:[e.jsx("h4",{children:N.admins}),e.jsx("p",{children:"Admins"})]})]}),e.jsxs(C,{children:[e.jsx("div",{className:"icon-box red",children:e.jsx(Je,{})}),e.jsxs("div",{className:"content",children:[e.jsx("h4",{children:N.locked}),e.jsx("p",{children:"Locked Accounts"})]})]}),e.jsxs(C,{children:[e.jsx("div",{className:"icon-box indigo",children:e.jsx(ae,{})}),e.jsxs("div",{className:"content",children:[e.jsx("h4",{children:N.nightLock}),e.jsx("p",{children:"Night Lock"})]})]})]}),e.jsx(fs,{children:e.jsx(ie.Body,{className:"p-3",children:e.jsxs(ke,{className:"g-2 align-items-end",children:[e.jsxs(b,{xs:12,md:5,children:[e.jsx(t.Label,{className:"fw-bold text-muted small mb-1",children:"SEARCH USER"}),e.jsxs("div",{className:"d-flex align-items-center bg-light rounded px-3 border",style:{height:"38px",borderColor:"#ced4da"},children:[e.jsx(Xe,{className:"text-secondary me-2"}),e.jsx(t.Control,{type:"text",placeholder:"Search by name or username...",value:v,onChange:s=>ce(s.target.value),className:"border-0 bg-transparent shadow-none p-0",style:{fontSize:"0.88rem"}})]})]}),e.jsxs(b,{xs:6,md:3,children:[e.jsx(t.Label,{className:"fw-bold text-muted small mb-1",children:"ROLE"}),e.jsxs(t.Select,{value:A,onChange:s=>me(s.target.value),size:"sm",style:{height:"38px",fontSize:"0.88rem",borderColor:"#ced4da"},children:[e.jsx("option",{value:"ALL",children:"All Roles"}),e.jsx("option",{value:"superadmin",children:"Super Admin"}),e.jsx("option",{value:"manager",children:"Manager"}),e.jsx("option",{value:"admin",children:"Admin"})]})]}),e.jsxs(b,{xs:6,md:2,children:[e.jsx(t.Label,{className:"fw-bold text-muted small mb-1",children:"LOCK STATUS"}),e.jsxs(t.Select,{value:z,onChange:s=>xe(s.target.value),size:"sm",style:{height:"38px",fontSize:"0.88rem",borderColor:"#ced4da"},children:[e.jsx("option",{value:"ALL",children:"All Status"}),e.jsx("option",{value:"ACTIVE",children:"Active / Unlocked"}),e.jsx("option",{value:"LOCKED",children:"Locked"})]})]}),e.jsx(b,{xs:12,md:2,className:"d-flex gap-2",children:e.jsxs(d,{variant:"outline-secondary",size:"sm",className:"w-100 d-flex align-items-center justify-content-center gap-1",onClick:be,style:{height:"38px",borderColor:"#ced4da"},children:[e.jsx(Qe,{size:12})," Reset"]})})]})})}),e.jsxs(bs,{children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center p-3 border-bottom bg-light",children:[e.jsxs("div",{className:"fw-bold text-dark d-flex align-items-center gap-2",style:{fontSize:"0.95rem"},children:[e.jsx("span",{children:"User Accounts"}),e.jsx(B,{bg:"primary",pill:!0,style:{fontSize:"0.75rem"},children:S.length})]}),e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx("span",{className:"text-muted small",children:"Show:"}),e.jsxs(t.Select,{size:"sm",value:g,onChange:s=>Ue(Number(s.target.value)),style:{width:"80px",height:"32px",fontSize:"0.82rem",borderColor:"#ced4da"},children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:15,children:"15"}),e.jsx("option",{value:25,children:"25"}),e.jsx("option",{value:50,children:"50"}),e.jsx("option",{value:100,children:"100"})]})]})]}),O?e.jsxs("div",{className:"text-center py-5",children:[e.jsx(te,{animation:"border",variant:"primary"}),e.jsx("p",{className:"mt-2 text-muted small",children:"Loading user accounts..."})]}):e.jsx("div",{className:"table-responsive",children:e.jsxs(Ce,{bordered:!0,hover:!0,className:"align-middle text-center mb-0",style:{fontSize:"0.88rem",borderColor:"#dee2e6"},children:[e.jsx("thead",{style:{backgroundColor:"#f1f5f9",borderBottom:"2px solid #cbd5e1"},children:e.jsxs("tr",{children:[e.jsx("th",{style:{width:"50px",backgroundColor:"#f1f5f9"},className:"py-2.5 text-secondary fw-bold",children:"#"}),e.jsx("th",{className:"text-start py-2.5 text-secondary fw-bold",style:{minWidth:"180px",backgroundColor:"#f1f5f9"},children:"Full Name"}),e.jsx("th",{className:"text-start py-2.5 text-secondary fw-bold",style:{minWidth:"150px",backgroundColor:"#f1f5f9"},children:"Username"}),e.jsx("th",{className:"py-2.5 text-secondary fw-bold",style:{minWidth:"120px",backgroundColor:"#f1f5f9"},children:"Role"}),e.jsx("th",{className:"py-2.5 text-secondary fw-bold",style:{minWidth:"140px",backgroundColor:"#f1f5f9"},children:"Status & Access"}),e.jsx("th",{className:"py-2.5 text-secondary fw-bold",style:{minWidth:"130px",backgroundColor:"#f1f5f9"},children:"Permissions"}),e.jsx("th",{className:"py-2.5 text-secondary fw-bold",style:{minWidth:"120px",backgroundColor:"#f1f5f9"},children:"Security"}),Q==="superadmin"&&e.jsx("th",{className:"py-2.5 text-secondary fw-bold",style:{width:"85px",backgroundColor:"#f1f5f9"},children:"Lock"}),e.jsx("th",{className:"py-2.5 text-secondary fw-bold",style:{minWidth:"120px",backgroundColor:"#f1f5f9"},children:"Actions"})]})}),e.jsx("tbody",{children:Z.length>0?Z.map((s,a)=>{const m=(w-1)*g+a+1,h=s.role==="superadmin"?"primary":s.role==="manager"?"success":"secondary";return e.jsxs("tr",{style:{background:s.isLocked?"#fff5f5":"#ffffff"},children:[e.jsx("td",{className:"text-muted fw-bold",children:m}),e.jsxs("td",{className:"text-start",children:[e.jsx("div",{className:`fw-bold ${s.isLocked?"text-danger":"text-dark"}`,children:s.name}),s.perHourTk>0&&e.jsxs("div",{className:"text-primary mt-0.5",style:{fontSize:"0.72rem",fontWeight:"700"},children:["৳",s.perHourTk,"/hr"]})]}),e.jsx("td",{className:"text-start",children:e.jsx("code",{className:"text-dark bg-light px-2 py-0.5 rounded border",style:{fontSize:"0.82rem",fontWeight:"600"},children:s.username})}),e.jsx("td",{children:e.jsxs(B,{bg:h,className:"text-uppercase px-2 py-1 fw-bold",style:{fontSize:"0.72rem",letterSpacing:"0.03em"},children:[s.role==="superadmin"&&e.jsx(re,{className:"me-1"}),s.role==="manager"&&e.jsx(we,{className:"me-1"}),s.role==="admin"&&e.jsx(ve,{className:"me-1"}),s.role]})}),e.jsx("td",{children:e.jsxs("div",{className:"d-flex flex-column align-items-center gap-1",children:[e.jsx(B,{bg:s.role==="superadmin"?"primary":s.isLocked?"danger":"success",className:"px-2 py-0.5",style:{fontSize:"0.7rem",fontWeight:"700"},children:s.role==="superadmin"?"SUPER":s.isLocked?"LOCKED":"ACTIVE"}),s.autoLock?e.jsxs("div",{className:"d-inline-flex align-items-center gap-1 bg-dark text-white px-2 py-0.5 rounded",style:{fontSize:"0.64rem",fontWeight:"700"},children:[e.jsx(ae,{size:8})," NIGHT LOCK"]}):e.jsxs("div",{className:"d-inline-flex align-items-center gap-1 bg-light text-secondary border px-2 py-0.5 rounded",style:{fontSize:"0.64rem",fontWeight:"700"},children:[e.jsx(Ze,{size:8,className:"text-success"})," 24/7 ACCESS"]})]})}),e.jsx("td",{children:s.role==="superadmin"?e.jsx("span",{className:"badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1",style:{fontSize:"0.72rem",fontWeight:"600"},children:"All Access (Super)"}):e.jsx(cs,{placement:"top",overlay:e.jsx(ms,{id:`tooltip-perm-${s._id}`,children:(s.permissions||[]).map(T=>{const $=L.find(F=>F.key===T);return $?$.label:T}).join(", ")||"No permissions assigned"}),children:e.jsxs("span",{className:"badge bg-light text-secondary border px-2 py-1",style:{fontSize:"0.72rem",fontWeight:"600",cursor:"pointer"},children:[(s.permissions||[]).length," / ",L.length," Modules"]})})}),e.jsx("td",{children:e.jsxs(d,{size:"sm",variant:"outline-warning",className:"text-dark fw-semibold d-inline-flex align-items-center gap-1 px-2 py-1 border-warning",style:{fontSize:"0.74rem",borderRadius:"6px"},onClick:()=>He(s),title:"Change user password",children:[e.jsx(Ne,{size:10,className:"text-warning"}),e.jsx("span",{children:"Change Pass"})]})}),Q==="superadmin"&&e.jsx("td",{children:s.role!=="superadmin"?e.jsxs("div",{className:"d-flex justify-content-center align-items-center gap-1.5",title:s.isLocked?"Unlock User":"Lock User",children:[Pe===s._id?e.jsx(te,{animation:"border",size:"sm",variant:"primary",style:{width:"1.1rem",height:"1.1rem"}}):e.jsx(Le,{$active:s.isLocked,onClick:()=>Ie(s._id),children:e.jsx("div",{className:"knob"})}),s.isLocked?e.jsx(es,{size:11,color:"#dc2626"}):e.jsx(ss,{size:11,color:"#6c757d"})]}):e.jsx("span",{className:"text-muted small",children:"-"})}),e.jsx("td",{children:e.jsxs("div",{className:"d-inline-flex gap-1.5 align-items-center justify-content-center",children:[e.jsx(le,{$variant:"purple",onClick:()=>De(s),title:"Login History",children:e.jsx(Se,{size:13})}),e.jsx(le,{$variant:"primary",onClick:()=>ye(s),title:"Edit User",children:e.jsx(rs,{size:13})}),e.jsx(le,{$variant:"danger",onClick:()=>Re(s._id),title:"Delete User",children:e.jsx(as,{size:13})})]})})]},s._id)}):e.jsx("tr",{children:e.jsx("td",{colSpan:Q==="superadmin"?9:8,className:"py-5 text-muted",children:e.jsxs("div",{className:"d-flex flex-column align-items-center justify-content-center",children:[e.jsx(ne,{size:28,className:"text-secondary mb-2 opacity-50"}),e.jsx("span",{className:"fw-semibold",children:"No user records match your search or filter"}),e.jsx(d,{variant:"link",size:"sm",onClick:be,className:"mt-1",children:"Clear search & filters"})]})})})})]})}),D>1&&e.jsxs("div",{className:"d-flex justify-content-between align-items-center p-3 border-top bg-light flex-wrap gap-2",children:[e.jsxs("span",{className:"text-muted small",children:["Showing ",Z.length>0?(w-1)*g+1:0," to ",Math.min(w*g,S.length)," of ",S.length," users"]}),e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsxs(d,{variant:"outline-primary",size:"sm",className:"d-flex align-items-center gap-1 rounded-pill px-3",disabled:w===1,onClick:()=>H(s=>Math.max(s-1,1)),children:[e.jsx(ts,{size:10})," Prev"]}),e.jsxs("span",{className:"fw-bold text-primary small px-2",children:[w," / ",D]}),e.jsxs(d,{variant:"outline-primary",size:"sm",className:"d-flex align-items-center gap-1 rounded-pill px-3",disabled:w===D,onClick:()=>H(s=>Math.min(s+1,D)),children:["Next ",e.jsx(ns,{size:10})]})]})]})]}),e.jsxs(o,{show:G,onHide:se,centered:!0,size:"lg",contentClassName:"border-0 shadow-lg",style:{borderRadius:"1rem"},children:[e.jsx(o.Header,{closeButton:!0,className:"py-3 px-4 bg-light border-bottom",children:e.jsxs(o.Title,{className:"fs-5 fw-bold text-primary d-flex align-items-center gap-2",children:[e.jsx(ve,{}),e.jsx("span",{children:u?"Update User Details":"Register New Account"})]})}),e.jsx(o.Body,{className:"p-4",children:e.jsxs(t,{children:[e.jsxs(ke,{className:"g-3",children:[e.jsx(b,{md:6,children:e.jsxs(t.Group,{controlId:"formName",children:[e.jsx(t.Label,{className:"fw-bold text-dark small",children:"Full Name"}),e.jsx(t.Control,{type:"text",placeholder:"e.g. John Doe",name:"name",value:n.name,onChange:P})]})}),e.jsx(b,{md:6,children:e.jsxs(t.Group,{controlId:"formUsername",children:[e.jsx(t.Label,{className:"fw-bold text-dark small",children:"Username"}),e.jsx(t.Control,{type:"text",placeholder:"e.g. johndoe123",name:"username",value:n.username,onChange:P,disabled:!!u})]})}),!u&&e.jsx(b,{md:6,children:e.jsxs(t.Group,{controlId:"formPassword",children:[e.jsx(t.Label,{className:"fw-bold text-dark small",children:"Access Password"}),e.jsx(t.Control,{type:"password",placeholder:"Enter secure password",name:"password",value:n.password,onChange:P})]})}),e.jsx(b,{md:6,children:e.jsxs(t.Group,{controlId:"formRole",children:[e.jsx(t.Label,{className:"fw-bold text-dark small",children:"System Role"}),e.jsxs(t.Select,{name:"role",value:n.role,onChange:P,children:[e.jsx("option",{value:"admin",children:"Admin"}),e.jsx("option",{value:"manager",children:"Manager"}),e.jsx("option",{value:"superadmin",children:"Super Admin"})]})]})}),e.jsx(b,{md:6,children:e.jsxs(t.Group,{controlId:"formPerHourTk",children:[e.jsx(t.Label,{className:"fw-bold text-dark small",children:"Per Hour Rate (TK)"}),e.jsx(t.Control,{type:"number",placeholder:"e.g. 100",name:"perHourTk",value:n.perHourTk,onChange:P})]})})]}),n.role!=="superadmin"&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"mt-3 mb-3 p-2.5 px-3 bg-light rounded-3 border",children:e.jsxs("div",{className:"row align-items-center",children:[e.jsxs("div",{className:"col-md-7",children:[e.jsxs("div",{className:"fw-bold text-dark",style:{fontSize:"0.82rem"},children:[e.jsx(ae,{className:"text-primary me-1.5"})," Night Lock (12AM - 7AM)"]}),e.jsx("div",{className:"text-muted",style:{fontSize:"0.74rem"},children:"Restrict login access during night hours in BD (GMT+6)."})]}),e.jsxs("div",{className:"col-md-5 d-flex justify-content-end align-items-center gap-2",children:[e.jsx("span",{className:`fw-bold ${n.autoLock?"text-primary":"text-muted"}`,style:{fontSize:"0.74rem"},children:n.autoLock?"ACTIVE":"DISABLED"}),e.jsx(Le,{$active:n.autoLock,onClick:()=>c(s=>({...s,autoLock:!s.autoLock})),children:e.jsx("div",{className:"knob"})})]})]})}),e.jsxs("div",{className:"mt-3 mb-2",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-2",children:[e.jsxs("div",{children:[e.jsx(t.Label,{className:"fw-bold mb-0 text-dark",style:{fontSize:"0.85rem"},children:"Access Permissions"}),e.jsxs("div",{className:"text-muted",style:{fontSize:"0.75rem"},children:[n.permissions.length," of ",L.length," modules selected"]})]}),e.jsx(d,{variant:"outline-primary",size:"sm",onClick:Ge,className:"rounded-pill px-3 py-1 fw-semibold",style:{fontSize:"0.74rem"},children:n.permissions.length===L.length?"Revoke All":"Grant All"})]}),e.jsx(js,{children:e.jsx("div",{className:"permission-grid",children:L.map(s=>{const a=n.permissions.includes(s.key);return e.jsxs(ys,{$checked:a,htmlFor:`perm-${s.key}`,children:[e.jsx("input",{type:"checkbox",id:`perm-${s.key}`,checked:a,onChange:()=>Oe(s.key)}),e.jsx("span",{className:"perm-text",title:s.label,children:s.label})]},s.key)})})}),e.jsxs("div",{className:"mt-2 text-muted d-flex align-items-center gap-1.5",style:{fontSize:"0.74rem"},children:[e.jsx(ne,{color:"#4299e1",size:12}),e.jsx("span",{children:"Finance, Logs, Reports & User management are strictly restricted to Super Admins."})]})]})]})]})}),e.jsxs(o.Footer,{className:"bg-light border-0 p-3",children:[e.jsx(d,{variant:"secondary",onClick:se,className:"fw-semibold px-4",children:"Cancel"}),e.jsx(d,{variant:"primary",onClick:_e,className:"fw-semibold px-4",children:u?"Save Changes":"Create Account"})]})]}),e.jsx(xs,{show:Ae,onHide:We,onConfirm:Be,title:"Delete User",message:"Are you sure you want to delete this user? This action cannot be undone.",confirmText:"Delete User",confirmVariant:"danger",isLoading:de}),e.jsxs(o,{show:$e,onHide:()=>q(!1),centered:!0,size:"xl",contentClassName:"border-0 shadow-lg",style:{borderRadius:"1rem"},children:[e.jsx(o.Header,{closeButton:!0,className:"py-3 px-4 bg-light border-bottom",children:e.jsxs(o.Title,{className:"fs-5 fw-bold text-primary d-flex align-items-center gap-2",children:[e.jsx(Se,{}),e.jsxs("span",{children:["Login Activity: ",Fe?.name]})]})}),e.jsx(o.Body,{className:"p-0",style:{maxHeight:"650px",overflowY:"auto"},children:pe.length>0?e.jsx("div",{className:"table-responsive",children:e.jsxs(Ce,{bordered:!0,hover:!0,className:"mb-0 align-middle text-center",style:{fontSize:"0.85rem",borderColor:"#dee2e6"},children:[e.jsx("thead",{className:"bg-light sticky-top",style:{borderBottom:"2px solid #cbd5e1"},children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-3 py-2.5 text-secondary small text-uppercase fw-bold text-start",children:"Login Date"}),e.jsx("th",{className:"px-3 py-2.5 text-secondary small text-uppercase fw-bold",children:"Time"}),e.jsx("th",{className:"px-3 py-2.5 text-secondary small text-uppercase fw-bold text-start",children:"Device & OS"}),e.jsx("th",{className:"px-3 py-2.5 text-secondary small text-uppercase fw-bold text-start",children:"User Agent"}),e.jsx("th",{className:"px-3 py-2.5 text-secondary small text-uppercase fw-bold text-end pe-4",children:"IP Address"})]})}),e.jsx("tbody",{children:pe.map((s,a)=>e.jsxs("tr",{children:[e.jsx("td",{className:"px-3 py-2.5 fw-bold text-dark text-start",children:new Date(s.timestamp).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}),e.jsx("td",{className:"px-3 py-2.5 text-secondary",children:new Date(s.timestamp).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}),e.jsx("td",{className:"px-3 py-2.5 text-start",children:e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx(B,{bg:s.userAgent?.includes("Mobile")?"info":"primary",className:"bg-opacity-10 text-primary border border-primary px-2 py-0.5",children:s.userAgent?.includes("Mobile")?"Mobile":"Desktop"}),e.jsx("span",{className:"small text-muted",children:s.userAgent?.match(/\(([^)]+)\)/)?.[1]?.split(";")[0]||"Unknown OS"})]})}),e.jsx("td",{className:"px-3 py-2.5 text-start",children:e.jsx("div",{className:"text-muted small text-truncate",style:{maxWidth:"280px"},title:s.userAgent,children:s.userAgent})}),e.jsx("td",{className:"px-3 py-2.5 text-end pe-4",children:e.jsx("code",{className:"bg-light px-2 py-1 rounded text-dark border small",children:s.ip==="::1"?"127.0.0.1":s.ip})})]},a))})]})}):e.jsxs("div",{className:"text-center py-5 text-muted",children:[e.jsx(ne,{size:28,className:"mb-2 opacity-50"}),e.jsx("p",{className:"mb-0",children:"No login records found for this account."})]})}),e.jsx(o.Footer,{className:"bg-light border-0 p-3",children:e.jsx(d,{variant:"secondary",onClick:()=>q(!1),className:"px-4 fw-semibold",children:"Close"})})]}),e.jsxs(o,{show:Ee,onHide:ee,centered:!0,contentClassName:"border-0 shadow-lg",style:{borderRadius:"1rem"},children:[e.jsx(o.Header,{closeButton:!0,className:"py-3 px-4 bg-light border-bottom",children:e.jsxs(o.Title,{className:"fs-5 fw-bold text-dark d-flex align-items-center gap-2",children:[e.jsx(Ne,{className:"text-warning"}),e.jsxs("span",{children:["Change Password: ",Y?.name]})]})}),e.jsx(o.Body,{className:"p-4",children:e.jsx(t,{onSubmit:s=>{s.preventDefault(),je()},children:e.jsxs(t.Group,{controlId:"formChangeNewPassword",children:[e.jsx(t.Label,{className:"fw-bold text-dark small",children:"New Password"}),e.jsxs("div",{className:"position-relative",children:[e.jsx(t.Control,{type:X?"text":"password",placeholder:"Enter new password (min 4 characters)",value:U,onChange:s=>J(s.target.value),autoFocus:!0}),e.jsx("button",{type:"button",onClick:()=>fe(!X),style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#94a3b8",cursor:"pointer",display:"flex",alignItems:"center",padding:0},children:X?e.jsx(ls,{size:14}):e.jsx(is,{size:14})})]}),e.jsx(t.Text,{className:"text-muted",style:{fontSize:"0.78rem"},children:"The new password will be securely hashed with bcrypt upon saving."})]})})}),e.jsxs(o.Footer,{className:"bg-light border-0 p-3",children:[e.jsx(d,{variant:"secondary",onClick:ee,className:"fw-semibold px-3",children:"Cancel"}),e.jsx(d,{variant:"primary",onClick:je,className:"fw-semibold px-4",children:"Update Password"})]})]}),de&&e.jsx(ws,{children:e.jsxs("div",{className:"loader-content",children:[e.jsx(te,{animation:"border",variant:"primary",size:"lg"}),e.jsx("h5",{className:"mt-3 fw-bold text-primary mb-1",children:ze}),e.jsx("p",{className:"text-muted small mb-0",children:"Please wait, performing action..."})]})}),e.jsx(os,{})]})]})};export{As as default};
