import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Paper, Typography, Avatar, Button, IconButton, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, TextField, InputAdornment, TablePagination
} from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import ClassIcon from '@mui/icons-material/Class';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { useSelector as useReduxSelector } from 'react-redux';

const ShowClasses = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { sclassesList, loading, getresponse } = useSelector((state) => state.sclass);
    const { studentsList } = useReduxSelector((state) => state.student);
    const { currentUser } = useSelector((state) => state.user);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    useEffect(() => {
        dispatch(getAllSclasses(currentUser._id, 'Sclass'));
    }, [currentUser._id, dispatch]);

    const filtered = Array.isArray(sclassesList)
        ? sclassesList.filter((c) => c.sclassName?.toLowerCase().includes(search.toLowerCase()))
        : [];

    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const classColor = (name) => {
        const colors = ['#f59e0b', '#4f46e5', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];
        return colors[name?.charCodeAt(0) % colors.length] || '#f59e0b';
    };

    const getStudentCount = (classId) => {
        if (!Array.isArray(studentsList)) return 0;
        return studentsList.filter((s) => s.sclassName?._id === classId || s.sclassName === classId).length;
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#f59e0b20', width: 44, height: 44 }}>
                        <ClassIcon sx={{ color: '#f59e0b' }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>Classes</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {filtered.length} class{filtered.length !== 1 ? 'es' : ''} found
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddCardIcon />}
                    onClick={() => navigate('/Admin/addclass')}
                    sx={{ bgcolor: '#f59e0b', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#d97706' } }}
                >
                    Add Class
                </Button>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.100' }}>
                    <TextField
                        size="small"
                        placeholder="Search classes..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment>,
                        }}
                        sx={{ width: 300, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                </Box>

                {loading ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <Typography color="text.secondary">Loading classes...</Typography>
                    </Box>
                ) : getresponse || filtered.length === 0 ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <ClassIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                        <Typography variant="h6" color="text.secondary">No classes found</Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddCardIcon />}
                            sx={{ mt: 2, bgcolor: '#f59e0b', borderRadius: 2, textTransform: 'none' }}
                            onClick={() => navigate('/Admin/addclass')}
                        >
                            Add First Class
                        </Button>
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Class Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Students</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginated.map((cls) => {
                                        const studentCount = getStudentCount(cls._id);
                                        const color = classColor(cls.sclassName);
                                        return (
                                            <TableRow key={cls._id} hover sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                                <TableCell onClick={() => navigate('/Admin/classes/class/' + cls._id)} sx={{ cursor: 'pointer' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Avatar sx={{ width: 36, height: 36, bgcolor: color + '20', fontSize: 14, fontWeight: 700, color }}>
                                                            {cls.sclassName?.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Typography variant="body2" fontWeight={700}>{cls.sclassName}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={`${studentCount} student${studentCount !== 1 ? 's' : ''}`}
                                                        size="small"
                                                        sx={{ bgcolor: studentCount > 0 ? '#4f46e510' : '#f1f5f9', color: studentCount > 0 ? '#4f46e5' : 'text.secondary', fontWeight: 600 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                        <Tooltip title="View Class">
                                                            <IconButton size="small" onClick={() => navigate('/Admin/classes/class/' + cls._id)}
                                                                sx={{ bgcolor: '#f59e0b10', '&:hover': { bgcolor: '#f59e0b20' } }}>
                                                                <VisibilityIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Add Subjects">
                                                            <IconButton size="small" onClick={() => navigate('/Admin/addsubject/' + cls._id)}
                                                                sx={{ bgcolor: '#8b5cf610', '&:hover': { bgcolor: '#8b5cf620' } }}>
                                                                <PostAddIcon sx={{ fontSize: 16, color: '#8b5cf6' }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Add Students">
                                                            <IconButton size="small" onClick={() => navigate('/Admin/class/addstudents/' + cls._id)}
                                                                sx={{ bgcolor: '#4f46e510', '&:hover': { bgcolor: '#4f46e520' } }}>
                                                                <PersonAddIcon sx={{ fontSize: 16, color: '#4f46e5' }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
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

export default ShowClasses;
