import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Paper, Typography, Avatar, Button, Chip, Grid,
    Divider, IconButton, LinearProgress, Card, CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails } = useSelector((state) => state.teacher);

    useEffect(() => {
        dispatch(getTeacherDetails(params.id));
    }, [dispatch, params.id]);

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <LinearProgress sx={{ borderRadius: 2 }} />
                <Typography sx={{ mt: 2 }} color="text.secondary">Loading teacher details...</Typography>
            </Box>
        );
    }

    const hasSubject = Boolean(teacherDetails?.teachSubject?.subName);
    const avatarColor = '#10b981';

    return (
        <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <IconButton onClick={() => navigate('/Admin/teachers')} sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'grey.200' }}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h5" fontWeight={700}>Teacher Profile</Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Profile Card */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.100', textAlign: 'center' }}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: avatarColor, fontSize: 32, fontWeight: 700, mx: 'auto', mb: 2 }}>
                            {teacherDetails?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h6" fontWeight={700}>{teacherDetails?.name}</Typography>
                        <Chip label="Teacher" size="small" sx={{ mt: 0.5, bgcolor: '#10b98120', color: '#10b981', fontWeight: 600 }} />

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, textAlign: 'left' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SchoolIcon sx={{ fontSize: 18, color: '#10b981' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Class</Typography>
                                    <Typography variant="body2" fontWeight={600}>{teacherDetails?.teachSclass?.sclassName || '—'}</Typography>
                                </Box>
                            </Box>
                            {teacherDetails?.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EmailIcon sx={{ fontSize: 18, color: '#4f46e5' }} />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Email</Typography>
                                        <Typography variant="body2" fontWeight={600}>{teacherDetails.email}</Typography>
                                    </Box>
                                </Box>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SupervisorAccountIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">College</Typography>
                                    <Typography variant="body2" fontWeight={600}>{teacherDetails?.college?.collegeName || '—'}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Subject Info */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <BookIcon sx={{ color: '#4f46e5' }} />
                            <Typography variant="h6" fontWeight={600}>Subject Assignment</Typography>
                        </Box>

                        {hasSubject ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.100', borderRadius: 2, bgcolor: '#f8fafc' }}>
                                    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="subtitle1" fontWeight={700}>{teacherDetails?.teachSubject?.subName}</Typography>
                                            <Chip label="Assigned" size="small" color="success" />
                                        </Box>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: 'grey.100', textAlign: 'center' }}>
                                                    <AccessTimeIcon sx={{ color: '#4f46e5', mb: 0.5 }} />
                                                    <Typography variant="h5" fontWeight={700} color="#4f46e5">
                                                        {teacherDetails?.teachSubject?.sessions}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">Total Sessions</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: 'grey.100', textAlign: 'center' }}>
                                                    <SchoolIcon sx={{ color: '#10b981', mb: 0.5 }} />
                                                    <Typography variant="h5" fontWeight={700} color="#10b981">
                                                        {teacherDetails?.teachSclass?.sclassName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">Assigned Class</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                <Button
                                    variant="outlined"
                                    startIcon={<BookIcon />}
                                    onClick={() => navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`)}
                                    sx={{ borderRadius: 2, textTransform: 'none', borderColor: '#4f46e5', color: '#4f46e5' }}
                                >
                                    Change Subject
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <BookIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>No Subject Assigned</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    This teacher needs a subject to start teaching.
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<BookIcon />}
                                    onClick={() => navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`)}
                                    sx={{ bgcolor: '#f59e0b', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#d97706' } }}
                                >
                                    Assign Subject Now
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TeacherDetails;
