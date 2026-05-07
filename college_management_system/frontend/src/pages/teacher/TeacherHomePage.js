import React, { useEffect } from 'react';
import {
    Box, Grid, Paper, Typography, Avatar, Card, CardContent,
    Divider, List, ListItem, ListItemAvatar, ListItemText,
    Chip, Button
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AddIcon from '@mui/icons-material/Add';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import { getAssignmentsByClass } from '../../redux/assignmentRelated/assignmentHandle';
import { getAllNotices } from '../../redux/noticeRelated/noticeHandle';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6'];

const StatCard = ({ icon, label, value, color, suffix }) => (
    <Card elevation={0} sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'grey.100',
        background: `linear-gradient(135deg, ${color}15 0%, #ffffff 100%)`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }
    }}>
        <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {label}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ color, mt: 0.5, lineHeight: 1.2 }}>
                        <CountUp start={0} end={value || 0} duration={2} suffix={suffix || ''} />
                    </Typography>
                </Box>
                <Avatar sx={{ bgcolor: `${color}20`, width: 44, height: 44 }}>
                    {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
                </Avatar>
            </Box>
        </CardContent>
    </Card>
);

const TeacherHomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.user);
    const { subjectDetails, sclassStudents } = useSelector((state) => state.sclass);
    const { assignmentsList } = useSelector((state) => state.assignment);
    const { noticesList } = useSelector((state) => state.notice);

    const classID = currentUser.teachSclass?._id;
    const subjectID = currentUser.teachSubject?._id;
    const collegeID = currentUser.college?._id || currentUser.college;

    useEffect(() => {
        if (subjectID) dispatch(getSubjectDetails(subjectID, 'Subject'));
        if (classID) {
            dispatch(getClassStudents(classID));
            dispatch(getAssignmentsByClass(classID));
        }
        if (collegeID) dispatch(getAllNotices(collegeID, 'Notice'));
    }, [dispatch, subjectID, classID, collegeID]);

    const numberOfStudents = sclassStudents?.length || 0;
    const numberOfSessions = subjectDetails?.sessions || 0;
    const numberOfAssignments = Array.isArray(assignmentsList) ? assignmentsList.length : 0;
    const recentNotices = Array.isArray(noticesList) ? noticesList.slice(0, 4) : [];
    const recentAssignments = Array.isArray(assignmentsList) ? assignmentsList.slice(0, 4) : [];

    const isOverdue = (d) => new Date(d) < new Date();
    const formatDate = (d) => new Date(d).toLocaleDateString();

    return (
        <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            {/* Welcome Banner */}
            <Box sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: 3, p: 3, mb: 3, color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        Welcome, {currentUser.name} 👋
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                        {currentUser.teachSclass?.sclassName
                            ? `Teaching ${currentUser.teachSubject?.subName || 'your subject'} · Class ${currentUser.teachSclass.sclassName}`
                            : 'No class assigned yet'}
                    </Typography>
                </Box>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(255,255,255,0.2)', fontSize: 24, fontWeight: 700 }}>
                    {String(currentUser.name).charAt(0).toUpperCase()}
                </Avatar>
            </Box>

            {/* Stat Cards */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<PeopleAltIcon />} label="Class Students" value={numberOfStudents} color="#4f46e5" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<AccessTimeIcon />} label="Total Sessions" value={numberOfSessions} color="#10b981" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<AssignmentTurnedInIcon />} label="Assignments Posted" value={numberOfAssignments} color="#8b5cf6" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<AnnouncementIcon />} label="Notices" value={recentNotices.length} color="#f59e0b" />
                </Grid>
            </Grid>

            {/* Quick Actions */}
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'grey.100', mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Quick Actions</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/Teacher/assignments/add')}
                        sx={{ bgcolor: '#8b5cf6', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#7c3aed' } }}
                    >
                        Add Assignment
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ChecklistIcon />}
                        onClick={() => navigate('/Teacher/class')}
                        sx={{ borderColor: '#10b981', color: '#10b981', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#f0fdf4' } }}
                    >
                        Take Attendance
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<PeopleAltIcon />}
                        onClick={() => navigate('/Teacher/class')}
                        sx={{ borderColor: '#4f46e5', color: '#4f46e5', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#eef2ff' } }}
                    >
                        View Class
                    </Button>
                </Box>
            </Paper>

            {/* Bottom Row */}
            <Grid container spacing={2.5}>
                {/* Recent Assignments */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AssignmentTurnedInIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
                                <Typography variant="subtitle1" fontWeight={700}>My Assignments</Typography>
                            </Box>
                            <Button size="small" onClick={() => navigate('/Teacher/assignments')}
                                sx={{ textTransform: 'none', color: '#8b5cf6', fontSize: 12 }}>
                                View All
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 1.5 }} />
                        {recentAssignments.length > 0 ? (
                            <List dense disablePadding>
                                {recentAssignments.map((a, i) => (
                                    <ListItem key={a._id} disablePadding sx={{ py: 0.8 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: `${COLORS[i % COLORS.length]}20`, width: 34, height: 34 }}>
                                                <AssignmentTurnedInIcon sx={{ fontSize: 16, color: COLORS[i % COLORS.length] }} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="body2" fontWeight={600}>{a.title}</Typography>}
                                            secondary={a.subject?.subName || '—'}
                                        />
                                        <Chip
                                            label={isOverdue(a.dueDate) ? 'Overdue' : formatDate(a.dueDate)}
                                            size="small"
                                            color={isOverdue(a.dueDate) ? 'error' : 'success'}
                                            sx={{ fontSize: 10 }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                <Typography variant="body2" color="text.secondary">No assignments posted yet</Typography>
                                <Button size="small" startIcon={<AddIcon />} onClick={() => navigate('/Teacher/assignments/add')}
                                    sx={{ mt: 1, textTransform: 'none', color: '#8b5cf6' }}>
                                    Post First Assignment
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Recent Notices */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <AnnouncementIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                            <Typography variant="subtitle1" fontWeight={700}>Notices</Typography>
                        </Box>
                        <Divider sx={{ mb: 1.5 }} />
                        {recentNotices.length > 0 ? (
                            <List dense disablePadding>
                                {recentNotices.map((n) => (
                                    <ListItem key={n._id} disablePadding sx={{ py: 0.8 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: '#fef3c7', width: 34, height: 34 }}>
                                                <AnnouncementIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="body2" fontWeight={600}>{n.title}</Typography>}
                                            secondary={n.details?.substring(0, 45) + (n.details?.length > 45 ? '...' : '')}
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', ml: 1 }}>
                                            {formatDate(n.date)}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                <Typography variant="body2" color="text.secondary">No notices yet</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Class Students Progress */}
                {sclassStudents && sclassStudents.length > 0 && (
                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PeopleAltIcon sx={{ color: '#4f46e5', fontSize: 20 }} />
                                    <Typography variant="subtitle1" fontWeight={700}>
                                        Class {currentUser.teachSclass?.sclassName} — Students
                                    </Typography>
                                </Box>
                                <Button size="small" onClick={() => navigate('/Teacher/class')}
                                    sx={{ textTransform: 'none', color: '#4f46e5', fontSize: 12 }}>
                                    Manage Class
                                </Button>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={1.5}>
                                {sclassStudents.slice(0, 8).map((student, i) => (
                                    <Grid item xs={6} sm={4} md={3} key={student._id}>
                                        <Box sx={{
                                            display: 'flex', alignItems: 'center', gap: 1,
                                            p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'grey.100',
                                            bgcolor: 'white', cursor: 'pointer',
                                            '&:hover': { bgcolor: '#f8fafc', borderColor: '#4f46e5' }
                                        }}
                                            onClick={() => navigate('/Teacher/class')}
                                        >
                                            <Avatar sx={{ width: 30, height: 30, bgcolor: COLORS[i % COLORS.length] + '20', fontSize: 12, fontWeight: 700, color: COLORS[i % COLORS.length] }}>
                                                {student.name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box sx={{ overflow: 'hidden' }}>
                                                <Typography variant="caption" fontWeight={600} noWrap>{student.name}</Typography>
                                                <Typography variant="caption" color="text.secondary" display="block">Roll {student.rollNum}</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                                {sclassStudents.length > 8 && (
                                    <Grid item xs={6} sm={4} md={3}>
                                        <Box sx={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            p: 1.5, borderRadius: 2, border: '1px dashed', borderColor: 'grey.300',
                                            cursor: 'pointer', '&:hover': { bgcolor: '#f8fafc' }
                                        }} onClick={() => navigate('/Teacher/class')}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                +{sclassStudents.length - 8} more
                                            </Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default TeacherHomePage;
