import React from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import NavBarPage from '../NavbarPage';
import ReportNavTabs from '../../components/reports/ReportNavTabs';
import ExpenseCategoryReport from '../../components/reports/ExpenseCategoryReport';
import { ToastContainer } from 'react-toastify';

const ExpenseReportPage = () => {
    const role = localStorage.getItem('role');

    if (role !== 'superadmin') {
        return null;
    }

    return (
        <>
            <NavBarPage />
            <StyledContainer fluid>
                <ReportNavTabs activePath="/admin/reports/expense" />
                <ExpenseCategoryReport />
            </StyledContainer>
            <ToastContainer />
        </>
    );
};

export default ExpenseReportPage;

const StyledContainer = styled(Container)`
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
`;
