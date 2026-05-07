import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Paper, Typography, Avatar, Card, CardContent,
    Divider, List, ListItem, ListItemAvatar, ListItemText,
    Chip, Button, LinearProgress
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { getAssignmentsByClass } from '../../redux/assignmentRelated/assignmentHandle';
import { getAllNotices } from '../../redux/noticeRelated/noticeHandle';
import { calculateOverallAttendancePercentage, groupAttendanceBySubject, calculateSubjectAttendancePercentage } from '../../components/attendanceCalculator';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444'];

const StatCard = ({ icon, label, value, color, suffix, onClick }) => (
    <Card elevation={0} onClick={onClick} sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'grey.100',
        background: `linear-gradient(135deg, ${color}15 0%, #ffffff 100%)`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-3px)', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' } : {}
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

const StudentHomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userDetails, currentUser, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { assignmentsList } = useSelector((state) => state.assignment);
    const { noticesList } = useSelector((state) => state.notice);

    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const classID = currentUser.sclassName?._id;
    const collegeID = currentUser.college?._id || currentUser.college;

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, 'Student'));
        dispatch(getSubjectList(classID, 'ClassSubjects'));
        dispatch(getAssignmentsByClass(classID));
        if (collegeID) dispatch(getAllNotices(collegeID, 'Notice'));
    }, [dispatch, currentUser._id, classID, collegeID]);

    useEffect(() => {
        if (userDetails) setSubjectAttendance(userDetails.attendance || []);
    }, [userDetails]);

    const numberOfSubjects = subjectsList?.length || 0;
    const numberOfAssignments = Array.isArray(assignmentsList) ? assignmentsList.length : 0;
    const overallAttendance = calculateOverallAttendancePercentage(subjectAttendance);
    const groupedAttendance = groupAttendanceBySubject(subjectAttendance);
    const recentNotices = Array.isArray(noticesList) ? noticesList.slice(0, 4) : [];
    const pendingAssignments = Array.isArray(assignmentsList)
        ? assignmentsList.filter((a) => new Date(a.dueDate) >= new Date())
        : [];

    const isOverdue = (d) => new Date(d) < new Date();
    const isDueSoon = (d) => {
        const diff = (new Date(d) - new Date()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 3;
    };
    const formatDate = (d) => new Date(d).toLocaleDateString();

    return (
        <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            {/* Welcome Banner */}
            <Box sx={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                borderRadius: 3, p: 3, mb: 3, color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        Hello, {currentUser.name} 👋
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                        Class {currentUser.sclassName?.sclassName} · Roll No. {currentUser.rollNum}
                    </Typography>
                </Box>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(255,255,255,0.2)', fontSize: 24, fontWeight: 700 }}>
                    {String(currentUser.name).charAt(0).toUpperCase()}
                </Avatar>
            </Box>

            {/* Stat Cards */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<MenuBookIcon />} label="Subjects" value={numberOfSubjects}
                        color="#4f46e5" onClick={() => navigate('/Student/subjects')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<AssignmentTurnedInIcon />} label="Assignments" value={numberOfAssignments}
                        color="#8b5cf6" onClick={() => navigate('/Student/assignments')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<ChecklistIcon />} label="Attendance" value={Math.round(overallAttendance)}
                        color={overallAttendance >= 75 ? '#10b981' : '#ef4444'} suffix="%"
                        onClick={() => navigate('/Student/attendance')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<AnnouncementIcon />} label="Notices" value={recentNotices.length}
                        color="#f59e0b"
                    />
                </Grid>
            </Grid>

            {/* Low attendance warning */}
            {overallAttendance > 0 && overallAttendance < 75 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: '#fef2f2', borderRadius: 2, border: '1px solid #fecaca', mb: 3 }}>
                    <WarningAmberIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                    <Typography variant="body2" color="#991b1b" fontWeight={500}>
                        Your attendance is {overallAttendance.toFixed(1)}% — below the 75% requirement. Please attend more classes.
                    </Typography>
                </Box>
            )}

            <Grid container spacing={2.5}>
                {/* Attendance per Subject */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TrendingUpIcon sx={{ color: '#10b981', fontSize: 20 }} />
                                <Typography variant="subtitle1" fontWeight={700}>Attendance Overview</Typography>
                            </Box>
                            <Button size="small" onClick={() => navigate('/Student/attendance')}
                                sx={{ textTransform: 'none', color: '#10b981', fontSize: 12 }}>
                                Details
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        {/* Overall */}
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" fontWeight={600}>Overall</Typography>
                                <Typography variant="body2" fontWeight={700}
                                    color={overallAttendance >= 75 ? '#10b981' : '#ef4444'}>
                                    {overallAttendance.toFixed(1)}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min(overallAttendance, 100)}
                                sx={{
                                    height: 8, borderRadius: 4, bgcolor: '#f1f5f9',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: overallAttendance >= 75 ? '#10b981' : '#ef4444',
                                        borderRadius: 4
                                    }
                                }}
                            />
                        </Box>

                        {Object.keys(groupedAttendance).length > 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {Object.entries(groupedAttendance).map(([subName, { present, sessions }], i) => {
                                    const pct = calculateSubjectAttendancePercentage(present, sessions);
                                    return (
                                        <Box key={subName}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="caption" color="text.secondary">{subName}</Typography>
                                                <Typography variant="caption" fontWeight={600}
                                                    color={pct >= 75 ? '#10b981' : '#ef4444'}>
                                                    {present}/{sessions} ({pct}%)
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={Math.min(pct, 100)}
                                                sx={{
                                                    height: 5, borderRadius: 3, bgcolor: '#f1f5f9',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: COLORS[i % COLORS.length],
                                                        borderRadius: 3
                                                    }
                                                }}
                                            />
                                        </Box>
                                    );
                                })}
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                No attendance recorded yet
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Assignments */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AssignmentTurnedInIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
                                <Typography variant="subtitle1" fontWeight={700}>Assignments</Typography>
                            </Box>
                            <Button size="small" onClick={() => navigate('/Student/assignments')}
                                sx={{ textTransform: 'none', color: '#8b5cf6', fontSize: 12 }}>
                                View All
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 1.5 }} />
                        {Array.isArray(assignmentsList) && assignmentsList.length > 0 ? (
                            <List dense disablePadding>
                                {assignmentsList.slice(0, 5).map((a, i) => (
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
                                            label={isOverdue(a.dueDate) ? 'Overdue' : isDueSoon(a.dueDate) ? 'Due Soon' : formatDate(a.dueDate)}
                                            size="small"
                                            color={isOverdue(a.dueDate) ? 'error' : isDueSoon(a.dueDate) ? 'warning' : 'success'}
                                            sx={{ fontSize: 10 }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                                No assignments posted yet
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Notices */}
                <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <AnnouncementIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                            <Typography variant="subtitle1" fontWeight={700}>Recent Notices</Typography>
                        </Box>
                        <Divider sx={{ mb: 1.5 }} />
                        {recentNotices.length > 0 ? (
                            <Grid container spacing={1.5}>
                                {recentNotices.map((n) => (
                                    <Grid item xs={12} sm={6} key={n._id}>
                                        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'grey.100', bgcolor: '#fffbeb' }}>
                                            <Typography variant="body2" fontWeight={700}>{n.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {n.details?.substring(0, 80)}{n.details?.length > 80 ? '...' : ''}
                                            </Typography>
                                            <Typography variant="caption" color="#f59e0b" display="block" sx={{ mt: 0.5 }}>
                                                {formatDate(n.date)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                No notices yet
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StudentHomePage;
