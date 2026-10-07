import{cn as ae,j as e,aG as C,bL as re,cZ as ne,at as le,dd as ie,bq as S,b2 as de,r as n,a as H,y as Y,a$ as O,B as E,S as g,R as I,f as x,g as c,de as oe,dh as ce,as as xe,bH as pe,a3 as me,M as w,aw as ge,e as he}from"./index-CvPrlWQM.js";import{d as M}from"./styled-components.browser.esm-Dy1xj6Xe.js";import{T as U,N as be}from"./NavbarPage-CiGAirgp.js";import{F}from"./Form-jlTn_Y2b.js";import{P as v}from"./Pagination-jWscS8CJ.js";const fe=[{path:"/admin/reports/status-history",label:"Status History",icon:re},{path:"/admin/reports/payment-route",label:"Payment Report",icon:ne},{path:"/admin/reports/overall-payment",label:"Overall Payment Report",icon:le},{path:"/admin/reports/marketing",label:"Marketing Report",icon:ie},{path:"/admin/reports/expense",label:"Expense Report",icon:S}],ye=({activePath:h})=>{const b=ae(),l=h||b.pathname;return e.jsx(ue,{className:"mb-4",children:e.jsx(C,{variant:"pills",className:"custom-pills border-0",children:fe.map(a=>{const k=a.icon,o=l===a.path||a.path==="/admin/reports/status-history"&&l==="/admin/reports";return e.jsx(C.Item,{children:e.jsxs(C.Link,{as:de,to:a.path,className:`d-flex align-items-center gap-2 ${o?"active":""}`,children:[e.jsx(k,{})," ",a.label]})},a.path)})})})},ue=M.div`
  .custom-pills {
    background-color: #e2e8f0;
    padding: 4px;
    border-radius: 10px;
    display: inline-flex;
    gap: 4px;
    flex-wrap: wrap;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.04);
  }
  .custom-pills .nav-link {
    color: #475569;
    font-weight: 600;
    border-radius: 8px;
    padding: 8px 20px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    font-size: 14px;
    text-decoration: none;
  }
  .custom-pills .nav-link:hover {
    color: #0f172a;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .custom-pills .nav-link.active {
    background-color: #ffffff !important;
    color: #1d4ed8 !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08) !important;
    font-weight: 700;
  }
`,je=()=>{const h=localStorage.getItem("token"),b=new Date,l=`${b.getFullYear()}-${String(b.getMonth()+1).padStart(2,"0")}-${String(b.getDate()).padStart(2,"0")}`,[a,k]=n.useState({summary:[],timeline:[],totalExpense:0,totalCount:0,avgPerTransaction:0,topCategory:"N/A",distinctCategories:[]}),[o,A]=n.useState(!1),[f,u]=n.useState({startDate:l,endDate:l,category:"all"}),[p,j]=n.useState({startDate:l,endDate:l,category:"all"}),[G,L]=n.useState(!1),[N,Z]=n.useState(""),[i,_]=n.useState({items:[],totalCount:0,totalAmount:0,currentPage:1,totalPages:1}),[q,P]=n.useState(!1),[m,Q]=n.useState(1);n.useEffect(()=>{R()},[p]);const R=async()=>{A(!0);try{const t={...p};t.category==="all"&&delete t.category;const s=await H.get("https://tuition-seba-backend-1.onrender.com/api/report/expense-by-category",{params:t,headers:{Authorization:h}});k(s.data)}catch(t){console.error("Error fetching expense category report:",t),Y.error("Failed to load expense category report")}finally{A(!1)}},B=async(t,s=1)=>{P(!0);try{const r={category:t,startDate:p.startDate,endDate:p.endDate,page:s,limit:15},y=await H.get("https://tuition-seba-backend-1.onrender.com/api/report/expense-category-items",{params:r,headers:{Authorization:h}});_(y.data),Q(s)}catch(r){console.error("Error fetching category items:",r),Y.error("Failed to load category expense items")}finally{P(!1)}},J=t=>{Z(t),L(!0),B(t,1)},z=t=>{t>=1&&t<=i.totalPages&&B(N,t)},D=(t,s)=>{u(r=>({...r,[t]:s}))},K=()=>{j(f)},V=()=>{const t={startDate:l,endDate:l,category:"all"};u(t),j(t)},X=t=>{const s=new Date;let r=new Date,y=new Date;switch(t){case"allTime":u(d=>({...d,startDate:"",endDate:""})),j(d=>({...d,startDate:"",endDate:""}));return;case"today":break;case"yesterday":r.setDate(s.getDate()-1),y.setDate(s.getDate()-1);break;case"thisWeek":{const d=s.getDay();r.setDate(s.getDate()-d);break}case"thisMonth":r=new Date(s.getFullYear(),s.getMonth(),1);break;case"lastMonth":r=new Date(s.getFullYear(),s.getMonth()-1,1),y=new Date(s.getFullYear(),s.getMonth(),0);break;case"last7Days":r.setDate(s.getDate()-6);break;case"last30Days":r.setDate(s.getDate()-29);break;default:return}const W=d=>{const ee=d.getFullYear(),te=String(d.getMonth()+1).padStart(2,"0"),se=String(d.getDate()).padStart(2,"0");return`${ee}-${te}-${se}`},$={...f,startDate:W(r),endDate:W(y)};u($),j($)};return e.jsxs("div",{children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2",children:[e.jsxs("div",{children:[e.jsxs("h5",{className:"text-primary fw-extrabold d-flex align-items-center gap-2 mb-0",style:{letterSpacing:"-0.3px",fontSize:"1.15rem"},children:[e.jsx(S,{})," Expense Report by Category"]}),e.jsx("span",{className:"text-muted",style:{fontSize:"11.5px"},children:"Analyze company spending breakdown and metrics by category"})]}),e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsxs(O,{bg:"light",text:"dark",className:"border px-2 py-1 fw-medium shadow-sm rounded-pill",style:{fontSize:"11px"},children:["Total Categories: ",a?.summary?.length||0]}),e.jsx(E,{variant:"primary",onClick:R,disabled:o,className:"px-2 py-0 rounded-pill shadow-sm",size:"sm",style:{fontSize:"11.5px",height:"26px"},children:o?e.jsx(g,{animation:"border",size:"sm"}):"Refresh"})]})]}),e.jsxs(I,{className:"mb-2 g-2",children:[e.jsx(x,{md:4,children:e.jsx(T,{className:"shadow-sm bg-white border border-danger p-2 px-3 rounded-3",style:{borderWidth:"1.5px !important"},children:e.jsx(c.Body,{className:"p-0",children:e.jsxs("div",{className:"d-flex align-items-center justify-content-between",children:[e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx("div",{className:"icon-wrapper bg-danger bg-opacity-10 text-danger rounded-2 p-1 px-2 d-flex align-items-center justify-content-center",children:e.jsx(oe,{size:15})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-muted text-uppercase fw-bold",style:{fontSize:"10.5px",letterSpacing:"0.4px"},children:"Total Expense"}),e.jsx("h4",{className:"fw-extrabold text-danger mb-0",style:{fontSize:"1.35rem",lineHeight:"1.2"},children:o?e.jsx(g,{animation:"border",size:"sm"}):`৳ ${(a.totalExpense||0).toLocaleString()}`})]})]}),e.jsx("div",{className:"text-end",children:e.jsxs("span",{className:"badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded",style:{fontSize:"10.5px"},children:[(a.summary||[]).length," Categories"]})})]})})})}),e.jsx(x,{md:4,children:e.jsx(T,{className:"shadow-sm bg-white border border-primary p-2 px-3 rounded-3",style:{borderWidth:"1.5px !important"},children:e.jsx(c.Body,{className:"p-0",children:e.jsxs("div",{className:"d-flex align-items-center justify-content-between",children:[e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx("div",{className:"icon-wrapper bg-primary bg-opacity-10 text-primary rounded-2 p-1 px-2 d-flex align-items-center justify-content-center",children:e.jsx(ce,{size:15})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-muted text-uppercase fw-bold",style:{fontSize:"10.5px",letterSpacing:"0.4px"},children:"Transactions Count"}),e.jsx("h4",{className:"fw-extrabold text-primary mb-0",style:{fontSize:"1.35rem",lineHeight:"1.2"},children:o?e.jsx(g,{animation:"border",size:"sm"}):(a.totalCount||0).toLocaleString()})]})]}),e.jsx("div",{className:"text-end",children:e.jsx("span",{className:"badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded",style:{fontSize:"10.5px"},children:"Total Entries"})})]})})})}),e.jsx(x,{md:4,children:e.jsx(T,{className:"shadow-sm bg-white border border-warning p-2 px-3 rounded-3",style:{borderWidth:"1.5px !important"},children:e.jsx(c.Body,{className:"p-0",children:e.jsxs("div",{className:"d-flex align-items-center justify-content-between",children:[e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx("div",{className:"icon-wrapper bg-warning bg-opacity-10 text-warning rounded-2 p-1 px-2 d-flex align-items-center justify-content-center flex-shrink-0",children:e.jsx(S,{size:15})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-muted text-uppercase fw-bold",style:{fontSize:"10.5px",letterSpacing:"0.4px"},children:"Top Category"}),e.jsx("h4",{className:"fw-extrabold text-dark mb-0",style:{fontSize:"1.15rem",lineHeight:"1.2"},children:o?e.jsx(g,{animation:"border",size:"sm"}):a.topCategory||"N/A"})]})]}),e.jsx("div",{className:"text-end flex-shrink-0 ms-2",children:e.jsx("span",{className:"badge bg-warning-subtle text-dark border border-warning-subtle px-2 py-1 rounded fw-bold",style:{fontSize:"10.5px"},children:a.summary&&a.summary.length>0?`${a.summary[0].percentage}%`:"-"})})]})})})})]}),e.jsx(c,{className:"shadow-sm border-0 mb-2 rounded-3 filter-card",children:e.jsxs(c.Body,{className:"p-2 px-3",children:[e.jsxs(I,{className:"g-2 align-items-center",children:[e.jsx(x,{lg:3,sm:6,children:e.jsxs("div",{className:"d-flex align-items-center gap-1",children:[e.jsx("span",{className:"text-secondary fw-semibold small",style:{minWidth:"38px",fontSize:"11.5px"},children:"From:"}),e.jsx(F.Control,{type:"date",size:"sm",value:f.startDate,onChange:t=>D("startDate",t.target.value),className:"rounded-2",style:{fontSize:"12px"}})]})}),e.jsx(x,{lg:3,sm:6,children:e.jsxs("div",{className:"d-flex align-items-center gap-1",children:[e.jsx("span",{className:"text-secondary fw-semibold small",style:{minWidth:"24px",fontSize:"11.5px"},children:"To:"}),e.jsx(F.Control,{type:"date",size:"sm",value:f.endDate,onChange:t=>D("endDate",t.target.value),className:"rounded-2",style:{fontSize:"12px"}})]})}),e.jsx(x,{lg:4,sm:8,children:e.jsxs("div",{className:"d-flex align-items-center gap-1",children:[e.jsx("span",{className:"text-secondary fw-semibold small",style:{minWidth:"58px",fontSize:"11.5px"},children:"Category:"}),e.jsxs(F.Select,{size:"sm",value:f.category,onChange:t=>D("category",t.target.value),className:"rounded-2",style:{fontSize:"12px"},children:[e.jsx("option",{value:"all",children:"All Categories"}),(a.distinctCategories||[]).map(t=>e.jsx("option",{value:t,children:t},t))]})]})}),e.jsxs(x,{lg:2,sm:4,className:"d-flex gap-1",children:[e.jsxs(E,{variant:"success",size:"sm",className:"w-100 rounded-2 shadow-sm d-flex align-items-center justify-content-center gap-1 py-1",onClick:K,title:"Apply Filters",style:{fontSize:"12px"},children:[e.jsx(xe,{size:11})," Filter"]}),e.jsx(E,{variant:"outline-secondary",size:"sm",className:"rounded-2 shadow-sm d-flex align-items-center justify-content-center px-2 py-1",onClick:V,title:"Reset Filters",style:{fontSize:"12px"},children:e.jsx(pe,{size:11})})]})]}),e.jsxs("div",{className:"d-flex align-items-center gap-1 mt-2 flex-wrap pt-1 border-top",children:[e.jsxs("span",{className:"text-secondary fw-semibold small d-flex align-items-center gap-1 me-1",style:{fontSize:"11px"},children:[e.jsx(me,{className:"text-primary",size:11})," Quick:"]}),["today","yesterday","thisWeek","thisMonth","lastMonth","last7Days","last30Days","allTime"].map(t=>e.jsx("button",{type:"button",className:"preset-btn py-0 px-2 rounded-pill",style:{fontSize:"11px",height:"22px",lineHeight:"20px"},onClick:()=>X(t),children:t==="allTime"?"All Time":t.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase())},t))]})]})}),o?e.jsx("div",{className:"d-flex justify-content-center py-4",children:e.jsx(g,{animation:"border",variant:"primary",size:"sm"})}):e.jsx(c,{className:"shadow-sm border-0 rounded-3 mb-2 list-card",children:e.jsxs(c.Body,{className:"p-2 px-3",children:[e.jsx("div",{className:"d-flex justify-content-between align-items-center mb-2",children:e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx("span",{className:"fw-bold text-dark",style:{fontSize:"13px"},children:"Category Spending Breakdown"}),e.jsxs("span",{className:"badge bg-secondary-subtle text-dark px-2",style:{fontSize:"11px"},children:[(a.summary||[]).length," categories"]})]})}),e.jsx("div",{className:"table-responsive rounded-2 border shadow-sm",style:{maxHeight:"550px",overflowY:"auto"},children:e.jsxs(U,{hover:!0,striped:!0,bordered:!0,className:"align-middle text-center mb-0 custom-reports-table table-sm",style:{fontSize:"12.5px"},children:[e.jsx("thead",{className:"table-dark sticky-top",children:e.jsxs("tr",{children:[e.jsx("th",{style:{width:"50px",padding:"6px 4px"},children:"SL"}),e.jsx("th",{className:"text-start ps-3",style:{padding:"6px 8px"},children:"CATEGORY NAME"}),e.jsx("th",{style:{width:"120px",padding:"6px 8px"},children:"COUNT"}),e.jsx("th",{style:{width:"160px",padding:"6px 8px"},children:"TOTAL SPENT (৳)"}),e.jsx("th",{style:{minWidth:"150px",width:"220px",padding:"6px 8px"},children:"% OF TOTAL"})]})}),e.jsx("tbody",{children:!a.summary||a.summary.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,className:"text-center py-4 text-muted fw-bold",style:{fontSize:"12px"},children:"No expense records found for the selected date range & filters."})}):e.jsxs(e.Fragment,{children:[a.summary.map((t,s)=>e.jsxs("tr",{className:"hover-bg-light transition-all",style:{cursor:"pointer"},onClick:()=>J(t.category),title:"Click to view category entries",children:[e.jsx("td",{className:"fw-bold text-muted",style:{padding:"5px 4px"},children:s+1}),e.jsx("td",{className:"text-start ps-3 fw-bold text-dark",style:{padding:"5px 8px"},children:e.jsx("span",{className:"badge bg-secondary-soft text-dark px-2 py-1 rounded me-1",children:t.category})}),e.jsx("td",{className:"fw-bold text-primary",style:{padding:"5px 8px"},children:t.count}),e.jsxs("td",{className:"text-danger fw-bold",style:{padding:"5px 8px",fontSize:"13px"},children:["৳ ",t.totalAmount.toLocaleString()]}),e.jsx("td",{style:{padding:"5px 8px"},children:e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx("div",{className:"progress flex-grow-1",style:{height:"6px",backgroundColor:"#e2e8f0"},children:e.jsx("div",{className:"progress-bar bg-danger",role:"progressbar",style:{width:`${Math.min(t.percentage,100)}%`},"aria-valuenow":t.percentage,"aria-valuemin":"0","aria-valuemax":"100"})}),e.jsxs("span",{className:"fw-bold text-muted",style:{minWidth:"38px",fontSize:"11px"},children:[t.percentage,"%"]})]})})]},t.category)),e.jsxs("tr",{className:"bg-light border-top border-2",children:[e.jsx("td",{colSpan:2,className:"ps-3 fw-bold text-primary text-end",style:{padding:"6px 8px"},children:"TOTAL"}),e.jsx("td",{className:"fw-extrabold text-primary",style:{padding:"6px 8px"},children:(a.totalCount||0).toLocaleString()}),e.jsxs("td",{className:"fw-extrabold text-danger",style:{padding:"6px 8px",fontSize:"13.5px"},children:["৳ ",(a.totalExpense||0).toLocaleString()]}),e.jsx("td",{className:"fw-bold text-muted",style:{padding:"6px 8px",fontSize:"11px"},children:"100.0%"})]})]})})]})})]})}),e.jsxs(w,{show:G,onHide:()=>L(!1),size:"lg",centered:!0,children:[e.jsx(w.Header,{closeButton:!0,className:"bg-light",children:e.jsxs(w.Title,{className:"fw-bold text-primary d-flex align-items-center gap-2",children:[e.jsx(S,{})," Category: ",e.jsx("span",{className:"text-dark",children:N})]})}),e.jsxs(w.Body,{className:"p-4 bg-white",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-3 bg-light p-3 rounded-3 border",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-muted small",children:"Period: "}),e.jsxs("strong",{className:"text-dark",children:[p.startDate||"Start"," to ",p.endDate||"End"]})]}),e.jsxs("div",{className:"d-flex gap-3",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-muted small",children:"Total Entries: "}),e.jsx("strong",{className:"text-primary",children:i.totalCount})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-muted small",children:"Total Spent: "}),e.jsxs("strong",{className:"text-danger",children:["৳ ",(i.totalAmount||0).toLocaleString()]})]})]})]}),q?e.jsx("div",{className:"d-flex justify-content-center py-5",children:e.jsx(g,{animation:"border",variant:"primary"})}):i.items&&i.items.length>0?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"table-responsive rounded-3 border shadow-sm mb-3",children:e.jsxs(U,{hover:!0,className:"mb-0 text-center align-middle",size:"sm",children:[e.jsx("thead",{className:"table-light",children:e.jsxs("tr",{children:[e.jsx("th",{style:{width:"50px"},children:"SL"}),e.jsx("th",{children:"Date"}),e.jsx("th",{children:"Amount (৳)"}),e.jsx("th",{children:"Created By"}),N==="Salary"&&e.jsx("th",{children:"Salary User / Month"}),e.jsx("th",{className:"text-start ps-3",children:"Note"})]})}),e.jsx("tbody",{children:i.items.map((t,s)=>e.jsxs("tr",{children:[e.jsx("td",{className:"fw-bold text-muted",children:(m-1)*15+s+1}),e.jsx("td",{className:"text-dark small",children:t.date?new Date(t.date).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):"-"}),e.jsxs("td",{className:"fw-extrabold text-danger",children:["৳ ",(t.amount||0).toLocaleString()]}),e.jsx("td",{children:e.jsx(O,{bg:"secondary",className:"px-2",children:t.createdBy||"System"})}),N==="Salary"&&e.jsxs("td",{className:"small",children:[e.jsx("strong",{children:t.salaryUser||"-"}),t.salaryMonth&&e.jsxs("span",{className:"text-muted ms-1",children:["(",t.salaryMonth,")"]})]}),e.jsx("td",{className:"text-start ps-3 small text-muted",children:t.note||"-"})]},t._id))})]})}),i.totalPages>1&&e.jsx("div",{className:"d-flex justify-content-end",children:e.jsxs(v,{size:"sm",className:"mb-0",children:[e.jsx(v.Prev,{onClick:()=>z(m-1),disabled:m===1}),[...Array(i.totalPages)].map((t,s)=>e.jsx(v.Item,{active:m===s+1,onClick:()=>z(s+1),children:s+1},s+1)),e.jsx(v.Next,{onClick:()=>z(m+1),disabled:m===i.totalPages})]})})]}):e.jsx("div",{className:"text-center py-5 text-muted fw-bold",children:"No expense records found for this category in the selected period."})]})]})]})},T=M(c)`
  height: 100%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
  cursor: default;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15) !important;
  }
`,De=()=>localStorage.getItem("role")!=="superadmin"?null:e.jsxs(e.Fragment,{children:[e.jsx(be,{}),e.jsxs(Ne,{fluid:!0,children:[e.jsx(ye,{activePath:"/admin/reports/expense"}),e.jsx(je,{})]}),e.jsx(ge,{})]}),Ne=M(he)`
  padding: 15px;
  background: #f8fafc;
  min-height: 100vh;
  
  .bg-gradient-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
  .bg-gradient-info {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  }
  .bg-gradient-warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  .bg-gradient-primary {
    background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
  }
  
  .bg-white-20 {
    background-color: rgba(255, 255, 255, 0.18);
  }
  
  .bg-black-10 {
    background-color: rgba(0, 0, 0, 0.08);
  }
  
  .tracking-wider {
    letter-spacing: 0.8px;
    font-size: 11px;
    font-weight: 700;
  }
  
  .fw-extrabold {
    font-weight: 800;
  }
  
  .bg-soft-primary {
    background-color: #eff6ff;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  }
  
  .bg-soft-info {
    background-color: #f0fdfa;
    color: #115e59;
    border: 1px solid #ccfbf1;
  }
  
  .bg-soft-success {
    background-color: #f0fdf4;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  .bg-secondary-soft {
    background-color: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
  }
  
  .preset-btn {
    font-size: 11px;
    background-color: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0 !important;
    padding: 4px 12px;
    border-radius: 50px;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .preset-btn:hover {
    background-color: #eff6ff;
    color: #2563eb;
    border-color: #bfdbfe !important;
    transform: translateY(-1px);
  }
  .preset-btn:active {
    transform: translateY(0);
  }
  
  .custom-reports-table {
    border: 1px solid #e2e8f0;
  }
  
  .custom-reports-table th {
    font-weight: 700;
    font-size: 13.5px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    background-color: #1d4ed8 !important;
    color: #ffffff !important;
    border-color: #1e40af;
    padding: 10px;
  }
  
  .custom-reports-table td {
    padding: 10px;
    font-size: 14px;
    border-color: #e2e8f0;
  }
`;export{De as default};
