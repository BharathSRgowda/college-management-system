import React, { useState } from 'react';
import {
    Box, Button, Menu, MenuItem, ListItemIcon, ListItemText,
    Typography, Divider, Chip, Avatar
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useDispatch, useSelector } from 'react-redux';
import { authSuccess } from '../redux/userRelated/userSlice';

/**
 * PanelSwitcher — lets the admin impersonate / switch to a student or teacher
 * panel without logging out. The original admin session is preserved in
 * localStorage under 'originalAdmin' so we can always switch back.
 */
const PanelSwitcher = () => {
    const dispatch = useDispatch();
    const { currentUser, currentRole } = useSelector((state) => state.user);
    const { studentsList } = useSelector((state) => state.student);
    const { teachersList } = useSelector((state) => state.teacher);

    const [anchorEl, setAnchorEl] = useState(null);
    const [subMenu, setSubMenu] = useState(null); // 'student' | 'teacher' | null
    const open = Boolean(anchorEl);

    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => { setAnchorEl(null); setSubMenu(null); };

    const isImpersonating = Boolean(localStorage.getItem('originalAdmin'));

    const switchToUser = (user) => {
        // Save original admin if not already saved
        if (!isImpersonating) {
            localStorage.setItem('originalAdmin', localStorage.getItem('user'));
        }
        dispatch(authSuccess(user));
        handleClose();
    };

    const switchBackToAdmin = () => {
        const original = localStorage.getItem('originalAdmin');
        if (original) {
            const adminUser = JSON.parse(original);
            localStorage.removeItem('originalAdmin');
            dispatch(authSuccess(adminUser));
        }
        handleClose();
    };

    const roleColor = {
        Admin: '#4f46e5',
        Teacher: '#10b981',
        Student: '#f59e0b',
    };

    const roleIcon = {
        Admin: <AdminPanelSettingsIcon fontSize="small" />,
        Teacher: <SchoolIcon fontSize="small" />,
        Student: <PersonIcon fontSize="small" />,
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isImpersonating && (
                    <Chip
                        label={`Viewing as ${currentRole}`}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 11 }}
                    />
                )}
                <Button
                    onClick={handleOpen}
                    size="small"
                    endIcon={<KeyboardArrowDownIcon />}
                    startIcon={<SwapHorizIcon />}
                    sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.4)',
                        border: '1px solid',
                        borderRadius: 2,
                        px: 1.5,
                        py: 0.5,
                        fontSize: 12,
                        textTransform: 'none',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' }
                    }}
                >
                    Switch Panel
                </Button>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 4,
                    sx: {
                        borderRadius: 2,
                        minWidth: 220,
                        mt: 1,
                        overflow: 'visible',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 20,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Current Panel
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: roleColor[currentRole] + '20' }}>
                            {React.cloneElement(roleIcon[currentRole] || <AdminPanelSettingsIcon fontSize="small" />, {
                                sx: { fontSize: 14, color: roleColor[currentRole] }
                            })}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>{currentRole} — {currentUser.name}</Typography>
                    </Box>
                </Box>

                <Divider />

                {isImpersonating && (
                    <>
                        <MenuItem onClick={switchBackToAdmin} sx={{ py: 1.2 }}>
                            <ListItemIcon>
                                <AdminPanelSettingsIcon fontSize="small" sx={{ color: '#4f46e5' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={<Typography variant="body2" fontWeight={600} color="#4f46e5">Back to Admin</Typography>}
                                secondary="Return to your admin account"
                            />
                        </MenuItem>
                        <Divider />
                    </>
                )}

                <Box sx={{ px: 2, pt: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Switch To
                    </Typography>
                </Box>

                {/* Switch to Teacher */}
                <MenuItem
                    onClick={() => setSubMenu(subMenu === 'teacher' ? null : 'teacher')}
                    sx={{ py: 1 }}
                >
                    <ListItemIcon>
                        <SchoolIcon fontSize="small" sx={{ color: '#10b981' }} />
                    </ListItemIcon>
                    <ListItemText primary={<Typography variant="body2">Teacher Panel</Typography>} />
                    <Typography variant="caption" color="text.secondary">
                        {teachersList?.length || 0} teachers
                    </Typography>
                </MenuItem>

                {subMenu === 'teacher' && (
                    <Box sx={{ bgcolor: '#f8fafc', mx: 1, borderRadius: 1, mb: 0.5 }}>
                        {Array.isArray(teachersList) && teachersList.length > 0 ? (
                            teachersList.slice(0, 6).map((teacher) => (
                                <MenuItem
                                    key={teacher._id}
                                    onClick={() => switchToUser({ ...teacher, role: 'Teacher' })}
                                    sx={{ py: 0.8, pl: 3 }}
                                >
                                    <ListItemIcon>
                                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#10b98120', fontSize: 11, color: '#10b981' }}>
                                            {teacher.name?.charAt(0)}
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography variant="body2">{teacher.name}</Typography>}
                                        secondary={teacher.teachSubject?.subName || 'No subject'}
                                    />
                                </MenuItem>
                            ))
                        ) : (
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography variant="caption" color="text.secondary">No teachers found</Typography>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Switch to Student */}
                <MenuItem
                    onClick={() => setSubMenu(subMenu === 'student' ? null : 'student')}
                    sx={{ py: 1 }}
                >
                    <ListItemIcon>
                        <PersonIcon fontSize="small" sx={{ color: '#f59e0b' }} />
                    </ListItemIcon>
                    <ListItemText primary={<Typography variant="body2">Student Panel</Typography>} />
                    <Typography variant="caption" color="text.secondary">
                        {studentsList?.length || 0} students
                    </Typography>
                </MenuItem>

                {subMenu === 'student' && (
                    <Box sx={{ bgcolor: '#f8fafc', mx: 1, borderRadius: 1, mb: 0.5 }}>
                        {Array.isArray(studentsList) && studentsList.length > 0 ? (
                            studentsList.slice(0, 6).map((student) => (
                                <MenuItem
                                    key={student._id}
                                    onClick={() => switchToUser({ ...student, role: 'Student' })}
                                    sx={{ py: 0.8, pl: 3 }}
                                >
                                    <ListItemIcon>
                                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#f59e0b20', fontSize: 11, color: '#f59e0b' }}>
                                            {student.name?.charAt(0)}
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography variant="body2">{student.name}</Typography>}
                                        secondary={student.sclassName?.sclassName || 'No class'}
                                    />
                                </MenuItem>
                            ))
                        ) : (
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography variant="caption" color="text.secondary">No students found</Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Menu>
        </>
    );
};

export default PanelSwitcher;
