import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, MenuItem, Select, FormControl } from '@mui/material';
import { addAssignment } from '../../../redux/assignmentRelated/assignmentHandle';
import { resetStatus } from '../../../redux/assignmentRelated/assignmentSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';

const AddAssignment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.user);
    const { sclassesList, subjectsList } = useSelector((state) => state.sclass);
    const { status, error } = useSelector((state) => state.assignment);

    const adminID = currentUser._id;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        dispatch(getAllSclasses(adminID, 'Sclass'));
    }, [dispatch, adminID]);

    useEffect(() => {
        if (selectedClass) {
            dispatch(getSubjectList(selectedClass, 'ClassSubjects'));
            setSelectedSubject('');
        }
    }, [dispatch, selectedClass]);

    useEffect(() => {
        if (status === 'added') {
            navigate('/Admin/assignments');
            dispatch(resetStatus());
        } else if (error) {
            setMessage('Network Error');
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, error, navigate, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!selectedClass || !selectedSubject) {
            setMessage('Please select a class and subject');
            setShowPopup(true);
            return;
        }
        setLoader(true);
        dispatch(addAssignment({
            title,
            description,
            dueDate,
            subjectId: selectedSubject,
            sclassId: selectedClass,
            adminID,
            createdBy: 'Admin',
        }));
    };

    return (
        <>
            <div className="register">
                <form className="registerForm" onSubmit={submitHandler}>
                    <span className="registerTitle">Add Assignment</span>

                    <label>Title</label>
                    <input
                        className="registerInput"
                        type="text"
                        placeholder="Enter assignment title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label>Description</label>
                    <textarea
                        className="registerInput"
                        placeholder="Enter assignment description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '14px' }}
                        required
                    />

                    <label>Due Date</label>
                    <input
                        className="registerInput"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />

                    <label>Class</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            displayEmpty
                            required
                            sx={{ backgroundColor: '#f5f5f5' }}
                        >
                            <MenuItem value="" disabled>Select Class</MenuItem>
                            {sclassesList && sclassesList.map((cls) => (
                                <MenuItem key={cls._id} value={cls._id}>
                                    {cls.sclassName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <label>Subject</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            displayEmpty
                            required
                            disabled={!selectedClass}
                            sx={{ backgroundColor: '#f5f5f5' }}
                        >
                            <MenuItem value="" disabled>
                                {selectedClass ? 'Select Subject' : 'Select a class first'}
                            </MenuItem>
                            {subjectsList && subjectsList.map((sub) => (
                                <MenuItem key={sub._id} value={sub._id}>
                                    {sub.subName} ({sub.subCode})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <button className="registerButton" type="submit" disabled={loader}>
                        {loader ? <CircularProgress size={24} color="inherit" /> : 'Add Assignment'}
                    </button>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default AddAssignment;
