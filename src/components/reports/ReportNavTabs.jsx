import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaHistory, FaChartPie, FaBookOpen, FaTag, FaReceipt } from 'react-icons/fa';
import styled from 'styled-components';

const reportTabs = [
    { path: '/admin/reports/status-history', label: 'Status History', icon: FaHistory },
    { path: '/admin/reports/payment-route', label: 'Payment Report', icon: FaChartPie },
    { path: '/admin/reports/overall-payment', label: 'Overall Payment Report', icon: FaBookOpen },
    { path: '/admin/reports/marketing', label: 'Marketing Report', icon: FaTag },
    { path: '/admin/reports/expense', label: 'Expense Report', icon: FaReceipt },
];

const ReportNavTabs = ({ activePath }) => {
    const location = useLocation();
    const currentPath = activePath || location.pathname;

    return (
        <NavWrapper className="mb-4">
            <Nav variant="pills" className="custom-pills border-0">
                {reportTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentPath === tab.path || (tab.path === '/admin/reports/status-history' && currentPath === '/admin/reports');
                    return (
                        <Nav.Item key={tab.path}>
                            <Nav.Link
                                as={Link}
                                to={tab.path}
                                className={`d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`}
                            >
                                <Icon /> {tab.label}
                            </Nav.Link>
                        </Nav.Item>
                    );
                })}
            </Nav>
        </NavWrapper>
    );
};

export default ReportNavTabs;

const NavWrapper = styled.div`
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
`;
