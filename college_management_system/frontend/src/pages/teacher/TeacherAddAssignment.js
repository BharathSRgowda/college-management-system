import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { addAssignment } from '../../redux/assignmentRelated/assignmentHandle';
import { resetStatus } from '../../redux/assignmentRelated/assignmentSlice';
import Popup from '../../components/Popup';

const TeacherAddAssignment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.assignment);
    const { status } = useSelector((state) => state.assignment);

    const classID = currentUser.teachSclass?._id;
    const subjectID = currentUser.teachSubject?._id;
    const subjectName = currentUser.teachSubject?.subName || 'Your Subject';
    const adminID = currentUser.college?._id || currentUser.college;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (status === 'added') {
            navigate('/Teacher/assignments');
            dispatch(resetStatus());
        } else if (error) {
            setMessage('Network Error');
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, error, navigate, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        setLoader(true);
        dispatch(addAssignment({
            title,
            description,
            dueDate,
            subjectId: subjectID,
            sclassId: classID,
            adminID,
            createdBy: 'Teacher',
        }));
    };

    return (
        <>
            <div className="register">
                <form className="registerForm" onSubmit={submitHandler}>
                    <span className="registerTitle">Add Assignment</span>
                    <p style={{ color: '#666', marginBottom: '10px', textAlign: 'center' }}>
                        Subject: <strong>{subjectName}</strong>
                    </p>

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

                    <button className="registerButton" type="submit" disabled={loader}>
                        {loader ? <CircularProgress size={24} color="inherit" /> : 'Add Assignment'}
                    </button>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default TeacherAddAssignment;
