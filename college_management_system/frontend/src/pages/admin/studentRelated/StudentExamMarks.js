import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Paper, Typography, Avatar, Button, MenuItem, Select,
    FormControl, InputLabel, TextField, CircularProgress, Chip,
    IconButton, Divider, Grid, InputAdornment
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GradeIcon from '@mui/icons-material/Grade';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import Popup from '../../../components/Popup';

const StudentExamMarks = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);

    const [studentID, setStudentID] = useState('');
    const [subjectName, setSubjectName] = useState('');
    const [chosenSubName, setChosenSubName] = useState('');
    const [marksObtained, setMarksObtained] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (situation === 'Student') {
            setStudentID(params.id);
            dispatch(getUserDetails(params.id, 'Student'));
        } else if (situation === 'Subject') {
            const { studentID, subjectID } = params;
            setStudentID(studentID);
            dispatch(getUserDetails(studentID, 'Student'));
            setChosenSubName(subjectID);
        }
    }, [situation]);

    useEffect(() => {
        if (userDetails?.sclassName && situation === 'Student') {
            dispatch(getSubjectList(userDetails.sclassName._id, 'ClassSubjects'));
        }
    }, [dispatch, userDetails]);

    useEffect(() => {
        if (response) { setLoader(false); setShowPopup(true); setMessage(response); }
        else if (error) { setLoader(false); setShowPopup(true); setMessage('Network error'); }
        else if (statestatus === 'added') {
            setLoader(false); setShowPopup(true); setMessage('Done Successfully');
            setMarksObtained(''); setSubjectName('');
        }
    }, [response, statestatus, error]);

    const changeHandler = (event) => {
        const selected = subjectsList.find((s) => s.subName === event.target.value);
        setSubjectName(selected.subName);
        setChosenSubName(selected._id);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (marksObtained < 0 || marksObtained > 100) {
            setMessage('Marks must be between 0 and 100');
            setShowPopup(true);
            return;
        }
        setLoader(true);
        dispatch(updateStudentFields(studentID, { subName: chosenSubName, marksObtained }, 'UpdateExamResult'));
    };

    // Find existing marks for selected subject
    const existingMarks = userDetails?.examResult?.find(
        (r) => r.subName?._id === chosenSubName || r.subName === chosenSubName
    );

    return (
        <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'grey.200' }}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h5" fontWeight={700}>Enter Exam Marks</Typography>
            </Box>

            {loading ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={10} md={6}>
                        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.100', overflow: 'hidden' }}>
                            {/* Student Info Header */}
                            <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ width: 52, height: 52, bgcolor: 'rgba(255,255,255,0.2)', fontSize: 20, fontWeight: 700 }}>
                                        {userDetails?.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700} color="white">{userDetails?.name}</Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                            <Chip label={`Roll: ${userDetails?.rollNum}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 11 }} />
                                            <Chip label={userDetails?.sclassName?.sclassName} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 11 }} />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <GradeIcon sx={{ color: '#f59e0b' }} />
                                    <Typography variant="subtitle1" fontWeight={600}>Mark Entry</Typography>
                                </Box>

                                <form onSubmit={submitHandler}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                        {situation === 'Student' && (
                                            <FormControl fullWidth required>
                                                <InputLabel>Select Subject</InputLabel>
                                                <Select value={subjectName} label="Select Subject" onChange={changeHandler}>
                                                    {Array.isArray(subjectsList) && subjectsList.map((sub) => (
                                                        <MenuItem key={sub._id} value={sub.subName}>{sub.subName}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}

                                        {situation === 'Subject' && (
                                            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                                                <Typography variant="caption" color="text.secondary">Subject</Typography>
                                                <Typography variant="body1" fontWeight={600}>{currentUser?.teachSubject?.subName || '—'}</Typography>
                                            </Box>
                                        )}

                                        {existingMarks && (
                                            <Box sx={{ p: 2, bgcolor: '#fef3c7', borderRadius: 2, border: '1px solid #fde68a' }}>
                                                <Typography variant="caption" color="#92400e">Current marks for this subject</Typography>
                                                <Typography variant="body1" fontWeight={700} color="#92400e">
                                                    {existingMarks.marksObtained} / 100
                                                </Typography>
                                            </Box>
                                        )}

                                        <TextField
                                            label="Marks Obtained"
                                            type="number"
                                            value={marksObtained}
                                            onChange={(e) => setMarksObtained(e.target.value)}
                                            required
                                            fullWidth
                                            inputProps={{ min: 0, max: 100 }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">/ 100</InputAdornment>
                                            }}
                                            helperText="Enter marks between 0 and 100"
                                        />

                                        <Divider />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            disabled={loader}
                                            sx={{ bgcolor: '#f59e0b', borderRadius: 2, textTransform: 'none', fontWeight: 600, py: 1.5, '&:hover': { bgcolor: '#d97706' } }}
                                        >
                                            {loader ? <CircularProgress size={22} color="inherit" /> : existingMarks ? 'Update Marks' : 'Save Marks'}
                                        </Button>
                                    </Box>
                                </form>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default StudentExamMarks;
