import React, { useEffect } from 'react';
import {
    Grid, Paper, Box, Typography, Avatar,
    LinearProgress, Divider, List, ListItem, ListItemAvatar,
    ListItemText, Chip, Card, CardContent
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SchoolIcon from '@mui/icons-material/School';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useDispatch, useSelector } from 'react-redux';
import CountUp from 'react-countup';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import { getAllNotices } from '../../redux/noticeRelated/noticeHandle';
import { getAllComplains } from '../../redux/complainRelated/complainHandle';
import { getAllAssignments } from '../../redux/assignmentRelated/assignmentHandle';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const StatCard = ({ icon, label, value, color, subtitle }) => (
    <Card elevation={0} sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'grey.100',
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, #ffffff 100%)`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }
    }}>
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 1 }}>
                        {label}
                    </Typography>
                    <Typography variant="h3" fontWeight={700} sx={{ color, lineHeight: 1 }}>
                        <CountUp start={0} end={value || 0} duration={2} />
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Avatar sx={{ bgcolor: `${color}20`, width: 52, height: 52 }}>
                    {React.cloneElement(icon, { sx: { color, fontSize: 26 } })}
                </Avatar>
            </Box>
        </CardContent>
    </Card>
);

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const { noticesList } = useSelector((state) => state.notice);
    const { complainsList } = useSelector((state) => state.complain);
    const { assignmentsList } = useSelector((state) => state.assignment);
    const { currentUser } = useSelector((state) => state.user);

    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, 'Sclass'));
        dispatch(getAllTeachers(adminID));
        dispatch(getAllNotices(adminID, 'Notice'));
        dispatch(getAllComplains(adminID, 'Complain'));
        dispatch(getAllAssignments(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList?.length || 0;
    const numberOfClasses = sclassesList?.length || 0;
    const numberOfTeachers = teachersList?.length || 0;
    const numberOfAssignments = Array.isArray(assignmentsList) ? assignmentsList.length : 0;
    const numberOfNotices = Array.isArray(noticesList) ? noticesList.length : 0;
    const numberOfComplains = Array.isArray(complainsList) ? complainsList.length : 0;

    // Build class distribution chart data
    const classChartData = Array.isArray(sclassesList)
        ? sclassesList.map((cls) => ({
            name: cls.sclassName,
            students: Array.isArray(studentsList)
                ? studentsList.filter((s) => s.sclassName?._id === cls._id || s.sclassName === cls._id).length
                : 0,
        }))
        : [];

    // Overview pie data
    const overviewData = [
        { name: 'Students', value: numberOfStudents },
        { name: 'Teachers', value: numberOfTeachers },
        { name: 'Classes', value: numberOfClasses },
        { name: 'Assignments', value: numberOfAssignments },
    ].filter((d) => d.value > 0);

    // Recent notices
    const recentNotices = Array.isArray(noticesList) ? noticesList.slice(0, 4) : [];

    // Recent assignments
    const recentAssignments = Array.isArray(assignmentsList) ? assignmentsList.slice(0, 4) : [];

    const formatDate = (d) => {
        const date = new Date(d);
        return date.toString() !== 'Invalid Date' ? date.toLocaleDateString() : '—';
    };

    const isOverdue = (d) => new Date(d) < new Date();

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', p: 3 }}>
            {/* Welcome Banner */}
            <Box sx={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                borderRadius: 3,
                p: 3,
                mb: 3,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        Welcome back, {currentUser.name} 👋
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                        Here's what's happening in your college today
                    </Typography>
                </Box>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(255,255,255,0.2)', fontSize: 24, fontWeight: 700 }}>
                    {String(currentUser.name).charAt(0).toUpperCase()}
                </Avatar>
            </Box>

            {/* Stat Cards */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard icon={<PeopleAltIcon />} label="Total Students" value={numberOfStudents} color="#4f46e5" subtitle="Enrolled" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard icon={<SupervisorAccountIcon />} label="Teachers" value={numberOfTeachers} color="#10b981" subtitle="Active" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard icon={<SchoolIcon />} label="Classes" value={numberOfClasses} color="#f59e0b" subtitle="Running" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard icon={<AssignmentTurnedInIcon />} label="Assignments" value={numberOfAssignments} color="#8b5cf6" subtitle="Posted" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard icon={<AnnouncementIcon />} label="Notices" value={numberOfNotices} color="#06b6d4" subtitle="Published" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <StatCard icon={<ReportProblemIcon />} label="Complains" value={numberOfComplains} color="#ef4444" subtitle="Received" />
                </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {/* Bar Chart - Students per Class */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.100', height: 320 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TrendingUpIcon sx={{ color: '#4f46e5', mr: 1 }} />
                            <Typography variant="h6" fontWeight={600}>Students per Class</Typography>
                        </Box>
                        {classChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={230}>
                                <BarChart data={classChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="students" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 230 }}>
                                <Typography color="text.secondary">No class data yet</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Pie Chart - Overview */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.100', height: 320 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <MenuBookIcon sx={{ color: '#10b981', mr: 1 }} />
                            <Typography variant="h6" fontWeight={600}>Overview</Typography>
                        </Box>
                        {overviewData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={230}>
                                <PieChart>
                                    <Pie
                                        data={overviewData}
                                        cx="50%"
                                        cy="45%"
                                        outerRadius={75}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                        labelLine={false}
                                    >
                                        {overviewData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 230 }}>
                                <Typography color="text.secondary">No data yet</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Bottom Row - Recent Activity */}
            <Grid container spacing={2.5}>
                {/* Recent Assignments */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AssignmentTurnedInIcon sx={{ color: '#8b5cf6', mr: 1 }} />
                                <Typography variant="h6" fontWeight={600}>Recent Assignments</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ mb: 1.5 }} />
                        {recentAssignments.length > 0 ? (
                            <List dense disablePadding>
                                {recentAssignments.map((a, i) => (
                                    <ListItem key={a._id} disablePadding sx={{ py: 0.8 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: `${COLORS[i % COLORS.length]}20`, width: 36, height: 36 }}>
                                                <AssignmentTurnedInIcon sx={{ fontSize: 18, color: COLORS[i % COLORS.length] }} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="body2" fontWeight={600}>{a.title}</Typography>}
                                            secondary={`${a.subject?.subName || '—'} · ${a.sclassName?.sclassName || '—'}`}
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
                            <Typography color="text.secondary" variant="body2" sx={{ py: 2, textAlign: 'center' }}>
                                No assignments posted yet
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Recent Notices */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AnnouncementIcon sx={{ color: '#06b6d4', mr: 1 }} />
                            <Typography variant="h6" fontWeight={600}>Recent Notices</Typography>
                        </Box>
                        <Divider sx={{ mb: 1.5 }} />
                        {recentNotices.length > 0 ? (
                            <List dense disablePadding>
                                {recentNotices.map((n, i) => (
                                    <ListItem key={n._id} disablePadding sx={{ py: 0.8 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: '#06b6d420', width: 36, height: 36 }}>
                                                <AnnouncementIcon sx={{ fontSize: 18, color: '#06b6d4' }} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="body2" fontWeight={600}>{n.title}</Typography>}
                                            secondary={n.details?.substring(0, 50) + (n.details?.length > 50 ? '...' : '')}
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDate(n.date)}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography color="text.secondary" variant="body2" sx={{ py: 2, textAlign: 'center' }}>
                                No notices yet
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Quick Stats Progress */}
                <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>College Capacity Overview</Typography>
                        <Grid container spacing={3}>
                            {[
                                { label: 'Student Enrollment', value: numberOfStudents, max: Math.max(numberOfStudents, 100), color: '#4f46e5' },
                                { label: 'Teacher Coverage', value: numberOfTeachers, max: Math.max(numberOfTeachers, 20), color: '#10b981' },
                                { label: 'Active Classes', value: numberOfClasses, max: Math.max(numberOfClasses, 10), color: '#f59e0b' },
                                { label: 'Assignments Posted', value: numberOfAssignments, max: Math.max(numberOfAssignments, 20), color: '#8b5cf6' },
                            ].map((item) => (
                                <Grid item xs={12} sm={6} md={3} key={item.label}>
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                                            <Typography variant="body2" fontWeight={600}>{item.value}</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={item.max > 0 ? Math.min((item.value / item.max) * 100, 100) : 0}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: `${item.color}20`,
                                                '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 4 }
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminHomePage;
