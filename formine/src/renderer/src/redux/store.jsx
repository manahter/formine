import { configureStore } from '@reduxjs/toolkit';
import formfilesReducer from './features/formfiles/Slice';
import datafilesReducer from './features/datafiles/Slice';
import mappingsReducer from './features/mappings/Slice';
import snackbarReducer from './features/snackbar/Slice';

const store = configureStore({
  reducer: {
    formfiles: formfilesReducer,
    datafiles: datafilesReducer,
    mappings: mappingsReducer,
    snackbar: snackbarReducer,
  },
});


export default store