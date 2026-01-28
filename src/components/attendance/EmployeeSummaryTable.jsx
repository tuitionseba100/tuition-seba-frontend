import React from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { motion } from 'framer-motion';

const SummaryContainer = styled(motion.div)`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  margin-bottom: 30px;
`;

const TableHeader = styled.div`
  padding: 20px;
  background: #f0fff4;
  border-bottom: 1px solid #e2e8f0;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #2f855a;
  }
`;

const EmployeeSummaryTable = ({ summary }) => {
    if (!summary || summary.length === 0) return null;

    return (
        <SummaryContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
        >
            <TableHeader>
                <h3>Employee Performance Summary</h3>
            </TableHeader>
            <Table responsive hover className="mb-0">
                <thead className="bg-light">
                    <tr>
                        <th>Employee</th>
                        <th>Username</th>
                        <th>Total Records</th>
                        <th>Completed</th>
                        <th>In Progress</th>
                        <th>Avg Duration (hrs)</th>
                    </tr>
                </thead>
                <tbody>
                    {summary.map((emp) => (
                        <tr key={emp.userId}>
                            <td><strong>{emp.name}</strong></td>
                            <td>{emp.userName}</td>
                            <td className="text-center">{emp.totalRecords}</td>
                            <td className="text-center text-success fw-bold">{emp.completedRecords}</td>
                            <td className="text-center text-warning fw-bold">{emp.totalRecords - emp.completedRecords}</td>
                            <td className="text-center">{emp.avgHours}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </SummaryContainer>
    );
};

export default EmployeeSummaryTable;
