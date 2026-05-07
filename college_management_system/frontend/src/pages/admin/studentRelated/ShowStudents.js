import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Paper, Typography, Button, IconButton, Tooltip, Avatar,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, TextField, InputAdornment, TablePagination
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChecklistIcon from '@mui/icons-material/Checklist';
import GradeIcon from '@mui/icons-material/Grade';
import SearchIcon from '@mui/icons-material/Search';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';

const ShowStudents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { studentsList, loading, response } = useSelector((state) => state.student);
    const { currentUser } = useSelector((state) => state.user);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    const filtered = Array.isArray(studentsList)
        ? studentsList.filter(
              (s) =>
                  s.name.toLowerCase().includes(search.toLowerCase()) ||
                  String(s.rollNum).includes(search) ||
                  s.sclassName?.sclassName?.toLowerCase().includes(search.toLowerCase())
          )
        : [];

    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const avatarColor = (name) => {
        const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        return colors[name?.charCodeAt(0) % colors.length] || '#4f46e5';
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#4f46e520', width: 44, height: 44 }}>
                        <PeopleAltIcon sx={{ color: '#4f46e5' }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>Students</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {filtered.length} student{filtered.length !== 1 ? 's' : ''} found
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => navigate('/Admin/addstudents')}
                    sx={{ bgcolor: '#4f46e5', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#4338ca' } }}
                >
                    Add Student
                </Button>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                {/* Search Bar */}
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.100' }}>
                    <TextField
                        size="small"
                        placeholder="Search by name, roll number or class..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment>,
                        }}
                        sx={{ width: 340, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                </Box>

                {loading ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <Typography color="text.secondary">Loading students...</Typography>
                    </Box>
                ) : response || filtered.length === 0 ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <PeopleAltIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                        <Typography variant="h6" color="text.secondary">No students found</Typography>
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            sx={{ mt: 2, bgcolor: '#4f46e5', borderRadius: 2, textTransform: 'none' }}
                            onClick={() => navigate('/Admin/addstudents')}
                        >
                            Add First Student
                        </Button>
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Student</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Roll No.</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Class</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginated.map((student) => (
                                        <TableRow key={student._id} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f8fafc' } }}>
                                            <TableCell onClick={() => navigate('/Admin/students/student/' + student._id)}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 36, height: 36, bgcolor: avatarColor(student.name), fontSize: 14, fontWeight: 700 }}>
                                                        {student.name?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Typography variant="body2" fontWeight={600}>{student.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell onClick={() => navigate('/Admin/students/student/' + student._id)}>
                                                <Chip label={student.rollNum} size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 600, fontSize: 12 }} />
                                            </TableCell>
                                            <TableCell onClick={() => navigate('/Admin/students/student/' + student._id)}>
                                                <Chip label={student.sclassName?.sclassName} size="small" variant="outlined" sx={{ borderColor: '#4f46e5', color: '#4f46e5', fontWeight: 600 }} />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                    <Tooltip title="View Profile">
                                                        <IconButton size="small" onClick={() => navigate('/Admin/students/student/' + student._id)}
                                                            sx={{ bgcolor: '#4f46e510', '&:hover': { bgcolor: '#4f46e520' } }}>
                                                            <VisibilityIcon sx={{ fontSize: 16, color: '#4f46e5' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Take Attendance">
                                                        <IconButton size="small" onClick={() => navigate('/Admin/students/student/attendance/' + student._id)}
                                                            sx={{ bgcolor: '#10b98110', '&:hover': { bgcolor: '#10b98120' } }}>
                                                            <ChecklistIcon sx={{ fontSize: 16, color: '#10b981' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Enter Marks">
                                                        <IconButton size="small" onClick={() => navigate('/Admin/students/student/marks/' + student._id)}
                                                            sx={{ bgcolor: '#f59e0b10', '&:hover': { bgcolor: '#f59e0b20' } }}>
                                                            <GradeIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={filtered.length}
                            page={page}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
                            rowsPerPageOptions={[5, 8, 15, 25]}
                        />
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default ShowStudents;
