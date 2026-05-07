import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Paper, Box, Button, Typography, IconButton, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { getAssignmentsByClass, deleteAssignment } from '../../redux/assignmentRelated/assignmentHandle';

const TeacherAssignments = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.user);
    const { assignmentsList, loading, response } = useSelector((state) => state.assignment);

    const classID = currentUser.teachSclass?._id;

    useEffect(() => {
        if (classID) {
            dispatch(getAssignmentsByClass(classID));
        }
    }, [dispatch, classID]);

    const handleDelete = (id) => {
        dispatch(deleteAssignment(id));
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toString() !== 'Invalid Date' ? d.toISOString().substring(0, 10) : '—';
    };

    const isOverdue = (dueDate) => new Date(dueDate) < new Date();
    const isDueSoon = (dueDate) => {
        const diff = (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 3;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                    <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Class Assignments
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/Teacher/assignments/add')}
                >
                    Add Assignment
                </Button>
            </Box>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : response ? (
                <Box sx={{ textAlign: 'center', mt: 5 }}>
                    <Typography variant="h6" color="text.secondary">No assignments yet</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/Teacher/assignments/add')}
                    >
                        Add First Assignment
                    </Button>
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#1976d2' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Due Date</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created By</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(assignmentsList) && assignmentsList.map((assignment) => (
                                <TableRow key={assignment._id} hover>
                                    <TableCell>{assignment.title}</TableCell>
                                    <TableCell sx={{ maxWidth: 200 }}>
                                        <Typography noWrap title={assignment.description}>
                                            {assignment.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{assignment.subject?.subName || '—'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={formatDate(assignment.dueDate)}
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
                                    <TableCell>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(assignment._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default TeacherAssignments;
