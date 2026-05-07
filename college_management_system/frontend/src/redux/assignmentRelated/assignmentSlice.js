import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    assignmentsList: [],
    loading: false,
    error: null,
    response: null,
    status: null,
};

const assignmentSlice = createSlice({
    name: 'assignment',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
            state.response = null;
            state.error = null;
        },
        getSuccess: (state, action) => {
            state.assignmentsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        addSuccess: (state, action) => {
            state.assignmentsList = [action.payload, ...state.assignmentsList];
            state.loading = false;
            state.status = 'added';
            state.error = null;
        },
        deleteSuccess: (state, action) => {
            state.assignmentsList = state.assignmentsList.filter(
                (a) => a._id !== action.payload
            );
            state.loading = false;
        },
        resetStatus: (state) => {
            state.status = null;
            state.error = null;
            state.response = null;
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    addSuccess,
    deleteSuccess,
    resetStatus
} = assignmentSlice.actions;

export const assignmentReducer = assignmentSlice.reducer;
