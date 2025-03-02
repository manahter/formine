import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'snackbar',

    initialState: {
        message: '',
        open: false,
        state: 'success',
    },
    
    reducers: {
        showSnackbar: (state, action) => {
            state.message = action.payload?.message;
            state.state = action.payload.state || 'success';
            state.open = true;
        },
        hideSnackbar: (state) => {
            state.open = false;
        },
    },
});

export const { showSnackbar, hideSnackbar } = slice.actions;
export default slice.reducer;
