import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Paper, Box, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { getAssignmentsByClass } from '../../redux/assignmentRelated/assignmentHandle';

const StudentAssignments = () => {
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);
    const { assignmentsList, loading } = useSelector((state) => state.assignment);

    const classID = currentUser.sclassName?._id;

    useEffect(() => {
        if (classID) {
            dispatch(getAssignmentsByClass(classID));
        }
    }, [dispatch, classID]);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toString() !== 'Invalid Date' ? d.toISOString().substring(0, 10) : '—';
    };

    const isOverdue = (dueDate) => new Date(dueDate) < new Date();
    const isDueSoon = (dueDate) => {
        const diff = (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 3;
    };

    const getDueLabel = (dueDate) => {
        if (isOverdue(dueDate)) return 'Overdue';
        if (isDueSoon(dueDate)) return `Due: ${formatDate(dueDate)} ⚠️`;
        return `Due: ${formatDate(dueDate)}`;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                My Assignments
            </Typography>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : !Array.isArray(assignmentsList) || assignmentsList.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 5 }}>
                    <Typography variant="h6" color="text.secondary">
                        No assignments posted yet
                    </Typography>
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#1976d2' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Due Date</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Posted By</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(assignmentsList) && assignmentsList.length > 0 ? (
                                assignmentsList.map((assignment, index) => (
                                    <TableRow key={assignment._id} hover>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Typography fontWeight="medium">{assignment.title}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 250 }}>
                                            {assignment.description}
                                        </TableCell>
                                        <TableCell>{assignment.subject?.subName || '—'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getDueLabel(assignment.dueDate)}
                                                color={
                                                    isOverdue(assignment.dueDate)
                                                        ? 'error'
                                                        : isDueSoon(assignment.dueDate)
                                                        ? 'warning'
                                                        : 'success'
                                                }
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{assignment.createdBy}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography color="text.secondary">No assignments found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default StudentAssignments;
