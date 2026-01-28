import React from 'react';
import styled from 'styled-components';
import { Table, Button, Badge, Spinner, Pagination } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TableContainer = styled(motion.div)`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  margin-bottom: 30px;
`;

const TableHeader = styled.div`
  padding: 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
  }
`;

const StyledTable = styled(Table)`
  margin-bottom: 0;
  
  th {
    background: #f7fafc;
    color: #4a5568;
    font-weight: 600;
    border-bottom: 2px solid #e2e8f0;
    vertical-align: middle;
  }

  td {
    vertical-align: middle;
    color: #2d3748;
  }

  tbody tr:hover {
    background-color: #f1f5f9;
  }
`;

const AttendanceTable = ({
    attendance,
    loading,
    currentPage,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
    userRole
}) => {

    const getPaginationItems = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            if (
                number === 1 ||
                number === totalPages ||
                (number >= currentPage - 1 && number <= currentPage + 1)
            ) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => onPageChange(number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            } else if (
                (number === currentPage - 2 && currentPage > 3) ||
                (number === currentPage + 2 && currentPage < totalPages - 2)
            ) {
                items.push(<Pagination.Ellipsis key={`ellipsis-${number}`} />);
            }
        }
        return items;
    };

    return (
        <TableContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <TableHeader>
                <h3>Attendance Records</h3>
                <span className="text-muted small">
                    Page {currentPage} of {totalPages}
                </span>
            </TableHeader>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Loading records...</p>
                </div>
            ) : (
                <>
                    <StyledTable responsive hover>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Name</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Duration</th>
                                <th>Status</th>
                                {userRole === 'superadmin' && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.length === 0 ? (
                                <tr>
                                    <td colSpan={userRole === 'superadmin' ? 7 : 6} className="text-center py-4">
                                        <div className="text-muted">No attendance records found</div>
                                    </td>
                                </tr>
                            ) : (
                                attendance.map((entry) => (
                                    <tr key={entry._id}>
                                        <td>
                                            <div className="fw-bold">{entry.userName}</div>
                                        </td>
                                        <td>{entry.name}</td>
                                        <td>{new Date(entry.startTime).toLocaleString()}</td>
                                        <td>
                                            {entry.endTime ? new Date(entry.endTime).toLocaleString() : (
                                                <span className="text-warning fst-italic">Running...</span>
                                            )}
                                        </td>
                                        <td>{entry.duration || '-'}</td>
                                        <td>
                                            <Badge bg={entry.endTime ? 'success' : 'warning'} pill>
                                                {entry.endTime ? 'Completed' : 'In Progress'}
                                            </Badge>
                                        </td>
                                        {userRole === 'superadmin' && (
                                            <td>
                                                <Button
                                                    variant="light"
                                                    size="sm"
                                                    className="text-primary me-2 shadow-sm"
                                                    onClick={() => onEdit(entry)}
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    variant="light"
                                                    size="sm"
                                                    className="text-danger shadow-sm"
                                                    onClick={() => onDelete(entry._id)}
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </StyledTable>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center p-3">
                            <Pagination className="mb-0">
                                <Pagination.Prev
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                />
                                {getPaginationItems()}
                                <Pagination.Next
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                />
                            </Pagination>
                        </div>
                    )}
                </>
            )}
        </TableContainer>
    );
};

export default AttendanceTable;
