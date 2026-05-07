import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    Button,
    Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StudentSideBar from './StudentSideBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import StudentHomePage from './StudentHomePage';
import StudentProfile from './StudentProfile';
import StudentSubjects from './StudentSubjects';
import ViewStdAttendance from './ViewStdAttendance';
import StudentComplain from './StudentComplain';
import StudentAssignments from './StudentAssignments';
import Logout from '../Logout'
import AccountMenu from '../../components/AccountMenu';
import { AppBar, Drawer } from '../../components/styles';
import { useDispatch } from 'react-redux';
import { authSuccess } from '../../redux/userRelated/userSlice';

const StudentDashboard = () => {
    const [open, setOpen] = useState(true);
    const dispatch = useDispatch();
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const isImpersonating = Boolean(localStorage.getItem('originalAdmin'));

    const switchBackToAdmin = () => {
        const original = localStorage.getItem('originalAdmin');
        if (original) {
            localStorage.removeItem('originalAdmin');
            dispatch(authSuccess(JSON.parse(original)));
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar open={open} position='absolute'>
                    <Toolbar sx={{ pr: '24px' }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Student Dashboard
                        </Typography>
                        {isImpersonating && (
                            <>
                                <Chip
                                    label="Preview Mode"
                                    size="small"
                                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mr: 1, fontSize: 11 }}
                                />
                                <Button
                                    onClick={switchBackToAdmin}
                                    size="small"
                                    startIcon={<AdminPanelSettingsIcon />}
                                    sx={{
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        borderRadius: 2,
                                        mr: 1,
                                        textTransform: 'none',
                                        fontSize: 12,
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    Back to Admin
                                </Button>
                            </>
                        )}
                        <AccountMenu />
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open} sx={open ? styles.drawerStyled : styles.hideDrawer}>
                    <Toolbar sx={styles.toolBarStyled}>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <StudentSideBar />
                    </List>
                </Drawer>
                <Box component="main" sx={styles.boxStyled}>
                    <Toolbar />
                    <Routes>
                        <Route path="/" element={<StudentHomePage />} />
                        <Route path="/Student/dashboard" element={<StudentHomePage />} />
                        <Route path="/Student/profile" element={<StudentProfile />} />
                        <Route path="/Student/subjects" element={<StudentSubjects />} />
                        <Route path="/Student/attendance" element={<ViewStdAttendance />} />
                        <Route path="/Student/complain" element={<StudentComplain />} />
                        <Route path="/Student/assignments" element={<StudentAssignments />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path='*' element={<Navigate to="/" />} />
                    </Routes>
                </Box>
            </Box>
        </>
    );
}

export default StudentDashboard

const styles = {
    boxStyled: {
        backgroundColor: (theme) =>
            theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    toolBarStyled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
    },
    drawerStyled: {
        display: "flex"
    },
    hideDrawer: {
        display: 'flex',
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
}