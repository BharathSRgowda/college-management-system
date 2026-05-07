import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Paper, Typography, Avatar, Button, IconButton, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, TextField, InputAdornment, TablePagination
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookIcon from '@mui/icons-material/Book';
import SearchIcon from '@mui/icons-material/Search';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';

const ShowTeachers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, response } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

    const filtered = Array.isArray(teachersList)
        ? teachersList.filter(
              (t) =>
                  t.name.toLowerCase().includes(search.toLowerCase()) ||
                  t.teachSclass?.sclassName?.toLowerCase().includes(search.toLowerCase()) ||
                  t.teachSubject?.subName?.toLowerCase().includes(search.toLowerCase())
          )
        : [];

    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const avatarColor = (name) => {
        const colors = ['#10b981', '#4f46e5', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        return colors[name?.charCodeAt(0) % colors.length] || '#10b981';
    };

    const noSubjectCount = Array.isArray(teachersList) ? teachersList.filter((t) => !t.teachSubject?.subName).length : 0;

    return (
        <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#10b98120', width: 44, height: 44 }}>
                        <SupervisorAccountIcon sx={{ color: '#10b981' }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>Teachers</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {filtered.length} teacher{filtered.length !== 1 ? 's' : ''}
                            {noSubjectCount > 0 && ` · ${noSubjectCount} need subject assignment`}
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => navigate('/Admin/teachers/chooseclass')}
                    sx={{ bgcolor: '#10b981', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#059669' } }}
                >
                    Add Teacher
                </Button>
            </Box>

            {/* Alert for unassigned subjects */}
            {noSubjectCount > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: '#fef3c7', borderRadius: 2, border: '1px solid #fde68a', mb: 2 }}>
                    <WarningAmberIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                    <Typography variant="body2" color="#92400e">
                        {noSubjectCount} teacher{noSubjectCount > 1 ? 's have' : ' has'} no subject assigned. Click "Assign Subject" to fix.
                    </Typography>
                </Box>
            )}

            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.100' }}>
                    <TextField
                        size="small"
                        placeholder="Search by name, class or subject..."
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
                        <Typography color="text.secondary">Loading teachers...</Typography>
                    </Box>
                ) : response || filtered.length === 0 ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <SupervisorAccountIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                        <Typography variant="h6" color="text.secondary">No teachers found</Typography>
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            sx={{ mt: 2, bgcolor: '#10b981', borderRadius: 2, textTransform: 'none' }}
                            onClick={() => navigate('/Admin/teachers/chooseclass')}
                        >
                            Add First Teacher
                        </Button>
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Teacher</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Class</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Subject</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginated.map((teacher) => (
                                        <TableRow key={teacher._id} hover sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                            <TableCell onClick={() => navigate('/Admin/teachers/teacher/' + teacher._id)} sx={{ cursor: 'pointer' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 36, height: 36, bgcolor: avatarColor(teacher.name), fontSize: 14, fontWeight: 700 }}>
                                                        {teacher.name?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Typography variant="body2" fontWeight={600}>{teacher.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={teacher.teachSclass?.sclassName} size="small" variant="outlined" sx={{ borderColor: '#10b981', color: '#10b981', fontWeight: 600 }} />
                                            </TableCell>
                                            <TableCell>
                                                {teacher.teachSubject?.subName ? (
                                                    <Chip label={teacher.teachSubject.subName} size="small" sx={{ bgcolor: '#4f46e510', color: '#4f46e5', fontWeight: 600 }} />
                                                ) : (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<BookIcon sx={{ fontSize: 14 }} />}
                                                        onClick={() => navigate(`/Admin/teachers/choosesubject/${teacher.teachSclass?._id}/${teacher._id}`)}
                                                        sx={{ borderColor: '#f59e0b', color: '#f59e0b', textTransform: 'none', fontSize: 11, borderRadius: 1.5, '&:hover': { bgcolor: '#fef3c7' } }}
                                                    >
                                                        Assign Subject
                                                    </Button>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                    <Tooltip title="View Details">
                                                        <IconButton size="small" onClick={() => navigate('/Admin/teachers/teacher/' + teacher._id)}
                                                            sx={{ bgcolor: '#10b98110', '&:hover': { bgcolor: '#10b98120' } }}>
                                                            <VisibilityIcon sx={{ fontSize: 16, color: '#10b981' }} />
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

export default ShowTeachers;
