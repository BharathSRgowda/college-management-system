import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Paper, Typography, Avatar, Button, IconButton, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, TextField, InputAdornment, TablePagination
} from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';

const ShowSubjects = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectsList, loading, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector((state) => state.user);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, 'AllSubjects'));
    }, [currentUser._id, dispatch]);

    const filtered = Array.isArray(subjectsList)
        ? subjectsList.filter(
              (s) =>
                  s.subName?.toLowerCase().includes(search.toLowerCase()) ||
                  s.subCode?.toLowerCase().includes(search.toLowerCase()) ||
                  s.sclassName?.sclassName?.toLowerCase().includes(search.toLowerCase())
          )
        : [];

    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const subjectColor = (name) => {
        const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        return colors[name?.charCodeAt(0) % colors.length] || '#4f46e5';
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#8b5cf620', width: 44, height: 44 }}>
                        <MenuBookIcon sx={{ color: '#8b5cf6' }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>Subjects</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {filtered.length} subject{filtered.length !== 1 ? 's' : ''} found
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<PostAddIcon />}
                    onClick={() => navigate('/Admin/subjects/chooseclass')}
                    sx={{ bgcolor: '#8b5cf6', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#7c3aed' } }}
                >
                    Add Subject
                </Button>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.100' }}>
                    <TextField
                        size="small"
                        placeholder="Search by name, code or class..."
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
                        <Typography color="text.secondary">Loading subjects...</Typography>
                    </Box>
                ) : response || filtered.length === 0 ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <MenuBookIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                        <Typography variant="h6" color="text.secondary">No subjects found</Typography>
                        <Button
                            variant="contained"
                            startIcon={<PostAddIcon />}
                            sx={{ mt: 2, bgcolor: '#8b5cf6', borderRadius: 2, textTransform: 'none' }}
                            onClick={() => navigate('/Admin/subjects/chooseclass')}
                        >
                            Add First Subject
                        </Button>
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Subject</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Code</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Class</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Sessions</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginated.map((subject) => (
                                        <TableRow key={subject._id} hover sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: subjectColor(subject.subName) + '20', fontSize: 13, fontWeight: 700, color: subjectColor(subject.subName) }}>
                                                        {subject.subName?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Typography variant="body2" fontWeight={600}>{subject.subName}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={subject.subCode} size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 600, fontSize: 11, fontFamily: 'monospace' }} />
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={subject.sclassName?.sclassName} size="small" variant="outlined" sx={{ borderColor: '#8b5cf6', color: '#8b5cf6', fontWeight: 600 }} />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                    <Typography variant="body2">{subject.sessions}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                    <Tooltip title="View Subject">
                                                        <IconButton size="small"
                                                            onClick={() => navigate(`/Admin/subjects/subject/${subject.sclassName?._id}/${subject._id}`)}
                                                            sx={{ bgcolor: '#8b5cf610', '&:hover': { bgcolor: '#8b5cf620' } }}>
                                                            <VisibilityIcon sx={{ fontSize: 16, color: '#8b5cf6' }} />
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

export default ShowSubjects;
