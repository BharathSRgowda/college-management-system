import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Paper, Typography, Avatar, Button, Chip, Grid, Card, CardContent,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tab, Tabs, Divider, IconButton, Tooltip, LinearProgress, Collapse
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChecklistIcon from '@mui/icons-material/Checklist';
import GradeIcon from '@mui/icons-material/Grade';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import {
    calculateOverallAttendancePercentage,
    calculateSubjectAttendancePercentage,
    groupAttendanceBySubject
} from '../../../components/attendanceCalculator';
import Popup from '../../../components/Popup';

const ViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();

    const { userDetails, loading } = useSelector((state) => state.user);
    const studentID = params.id;

    const [tab, setTab] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [openSubjects, setOpenSubjects] = useState({});

    useEffect(() => {
        dispatch(getUserDetails(studentID, 'Student'));
    }, [dispatch, studentID]);

    useEffect(() => {
        if (userDetails?.sclassName?._id) {
            dispatch(getSubjectList(userDetails.sclassName._id, 'ClassSubjects'));
        }
    }, [dispatch, userDetails]);

    const subjectAttendance = userDetails?.attendance || [];
    const subjectMarks = userDetails?.examResult || [];

    const overallAttendance = calculateOverallAttendancePercentage(subjectAttendance);
    const groupedAttendance = groupAttendanceBySubject(subjectAttendance);
    const avatarColor = '#4f46e5';

    const toggleSubject = (subId) => {
        setOpenSubjects((prev) => ({ ...prev, [subId]: !prev[subId] }));
    };

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <LinearProgress sx={{ borderRadius: 2 }} />
                <Typography sx={{ mt: 2 }} color="text.secondary">Loading student details...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            {/* Back + Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <IconButton onClick={() => navigate('/Admin/students')} sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'grey.200' }}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h5" fontWeight={700}>Student Profile</Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Left — Profile Card */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.100', textAlign: 'center' }}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: avatarColor, fontSize: 32, fontWeight: 700, mx: 'auto', mb: 2 }}>
                            {userDetails?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h6" fontWeight={700}>{userDetails?.name}</Typography>
                        <Chip label={`Roll No. ${userDetails?.rollNum}`} size="small" sx={{ mt: 0.5, bgcolor: '#f1f5f9', fontWeight: 600 }} />

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, textAlign: 'left' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SchoolIcon sx={{ fontSize: 18, color: '#4f46e5' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Class</Typography>
                                    <Typography variant="body2" fontWeight={600}>{userDetails?.sclassName?.sclassName || '—'}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon sx={{ fontSize: 18, color: '#10b981' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">College</Typography>
                                    <Typography variant="body2" fontWeight={600}>{userDetails?.college?.collegeName || '—'}</Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Attendance Summary */}
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">Overall Attendance</Typography>
                                <Typography variant="body2" fontWeight={700} color={overallAttendance >= 75 ? '#10b981' : '#ef4444'}>
                                    {overallAttendance.toFixed(1)}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min(overallAttendance, 100)}
                                sx={{
                                    height: 8, borderRadius: 4,
                                    bgcolor: '#f1f5f9',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: overallAttendance >= 75 ? '#10b981' : '#ef4444',
                                        borderRadius: 4
                                    }
                                }}
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Quick Actions */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<ChecklistIcon />}
                                onClick={() => navigate('/Admin/students/student/attendance/' + studentID)}
                                sx={{ bgcolor: '#10b981', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#059669' } }}
                            >
                                Take Attendance
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<GradeIcon />}
                                onClick={() => navigate('/Admin/students/student/marks/' + studentID)}
                                sx={{ bgcolor: '#f59e0b', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#d97706' } }}
                            >
                                Enter Marks
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right — Tabs */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
                        <Tabs
                            value={tab}
                            onChange={(e, v) => setTab(v)}
                            sx={{ borderBottom: '1px solid', borderColor: 'grey.100', px: 2 }}
                        >
                            <Tab label="Attendance" sx={{ textTransform: 'none', fontWeight: 600 }} />
                            <Tab label="Exam Marks" sx={{ textTransform: 'none', fontWeight: 600 }} />
                        </Tabs>

                        <Box sx={{ p: 3 }}>
                            {/* Attendance Tab */}
                            {tab === 0 && (
                                <>
                                    {Object.keys(groupedAttendance).length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <ChecklistIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                                            <Typography color="text.secondary">No attendance recorded yet</Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<ChecklistIcon />}
                                                sx={{ mt: 2, bgcolor: '#10b981', borderRadius: 2, textTransform: 'none' }}
                                                onClick={() => navigate('/Admin/students/student/attendance/' + studentID)}
                                            >
                                                Take First Attendance
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {Object.entries(groupedAttendance).map(([subName, { present, allData, subId, sessions }]) => {
                                                const pct = calculateSubjectAttendancePercentage(present, sessions);
                                                const isOpen = openSubjects[subId];
                                                return (
                                                    <Card key={subId} elevation={0} sx={{ border: '1px solid', borderColor: 'grey.100', borderRadius: 2 }}>
                                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Box sx={{ flex: 1 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                                        <Typography variant="body2" fontWeight={700}>{subName}</Typography>
                                                                        <Chip
                                                                            label={`${pct}%`}
                                                                            size="small"
                                                                            color={pct >= 75 ? 'success' : 'error'}
                                                                        />
                                                                    </Box>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {present} / {sessions} sessions attended
                                                                        </Typography>
                                                                    </Box>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={Math.min(pct, 100)}
                                                                        sx={{
                                                                            height: 6, borderRadius: 3,
                                                                            bgcolor: '#f1f5f9',
                                                                            '& .MuiLinearProgress-bar': {
                                                                                bgcolor: pct >= 75 ? '#10b981' : '#ef4444',
                                                                                borderRadius: 3
                                                                            }
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
                                                                    <Tooltip title="Change Attendance">
                                                                        <IconButton size="small"
                                                                            onClick={() => navigate(`/Admin/subject/student/attendance/${studentID}/${subId}`)}
                                                                            sx={{ bgcolor: '#4f46e510' }}>
                                                                            <ChecklistIcon sx={{ fontSize: 14, color: '#4f46e5' }} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title={isOpen ? 'Hide Details' : 'Show Details'}>
                                                                        <IconButton size="small" onClick={() => toggleSubject(subId)} sx={{ bgcolor: '#f1f5f9' }}>
                                                                            {isOpen ? <ExpandLessIcon sx={{ fontSize: 14 }} /> : <ExpandMoreIcon sx={{ fontSize: 14 }} />}
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            </Box>

                                                            <Collapse in={isOpen}>
                                                                <Box sx={{ mt: 2, borderTop: '1px solid', borderColor: 'grey.100', pt: 2 }}>
                                                                    <TableContainer>
                                                                        <Table size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Date</TableCell>
                                                                                    <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Status</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                {allData.map((d, i) => (
                                                                                    <TableRow key={i}>
                                                                                        <TableCell sx={{ fontSize: 12 }}>
                                                                                            {new Date(d.date).toLocaleDateString()}
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            <Chip
                                                                                                label={d.status}
                                                                                                size="small"
                                                                                                color={d.status === 'Present' ? 'success' : 'error'}
                                                                                                sx={{ fontSize: 10 }}
                                                                                            />
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </TableContainer>
                                                                </Box>
                                                            </Collapse>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </Box>
                                    )}
                                </>
                            )}

                            {/* Marks Tab */}
                            {tab === 1 && (
                                <>
                                    {!subjectMarks || subjectMarks.filter(r => r.subName && r.marksObtained).length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <GradeIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                                            <Typography color="text.secondary">No marks recorded yet</Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<GradeIcon />}
                                                sx={{ mt: 2, bgcolor: '#f59e0b', borderRadius: 2, textTransform: 'none' }}
                                                onClick={() => navigate('/Admin/students/student/marks/' + studentID)}
                                            >
                                                Enter First Marks
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                            {subjectMarks.filter(r => r.subName && r.marksObtained).map((result, i) => (
                                                <Card key={i} elevation={0} sx={{ border: '1px solid', borderColor: 'grey.100', borderRadius: 2 }}>
                                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                            <Typography variant="body2" fontWeight={700}>{result.subName?.subName}</Typography>
                                                            <Chip
                                                                label={`${result.marksObtained} / 100`}
                                                                size="small"
                                                                color={result.marksObtained >= 40 ? 'success' : 'error'}
                                                            />
                                                        </Box>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={Math.min(result.marksObtained, 100)}
                                                            sx={{
                                                                height: 6, borderRadius: 3,
                                                                bgcolor: '#f1f5f9',
                                                                '& .MuiLinearProgress-bar': {
                                                                    bgcolor: result.marksObtained >= 40 ? '#10b981' : '#ef4444',
                                                                    borderRadius: 3
                                                                }
                                                            }}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            ))}
                                            <Button
                                                variant="outlined"
                                                startIcon={<GradeIcon />}
                                                onClick={() => navigate('/Admin/students/student/marks/' + studentID)}
                                                sx={{ mt: 1, borderRadius: 2, textTransform: 'none', borderColor: '#f59e0b', color: '#f59e0b' }}
                                            >
                                                Update Marks
                                            </Button>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default ViewStudent;
