import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    addSuccess,
    deleteSuccess,
} from './assignmentSlice';

// Fetch all assignments for a college (admin view)
export const getAllAssignments = (adminID) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/AssignmentList/${adminID}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

// Fetch assignments for a specific class (student/teacher view)
export const getAssignmentsByClass = (classID) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/AssignmentListByClass/${classID}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

// Add a new assignment
export const addAssignment = (fields) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/AssignmentCreate`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(addSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

// Delete a single assignment
export const deleteAssignment = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/Assignment/${id}`);
        dispatch(deleteSuccess(id));
    } catch (error) {
        dispatch(getError(error));
    }
};
