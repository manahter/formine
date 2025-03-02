// src/features/placemarks/slice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchFormfiles, removeFormfiles, openFormfile } from './API';


const slice = createSlice({
  name: 'formfiles',

  initialState: {
    status: 'idle',  // 'idle', 'loading', 'succeeded', 'failed'
    errors: [],
    items: [],
    selected: null,
  },

  reducers: {
    // Sadece senkron işlem yapan reducer'lar
    selectFile: (state, action) => {
      const uuid = action.payload;
      state.selected = null

      state.items = state.items.map(file => {
        if (file.uuid === uuid) {
          state.selected = uuid;
        }
        return {
          ...file,
          selected: file.uuid === uuid
        };
      });
    },
  },

  extraReducers: (builder) => {
    builder
      // -----------------------------------------
      // fetchForms API durumu
      .addCase(fetchFormfiles.pending, (state) => {
        state.status = 'loading';
        state.errors = []
      })
      .addCase(fetchFormfiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.reverse();

        if (action.payload.length) {
          slice.caseReducers.selectFile(state, { payload: null })
        }
      })
      .addCase(fetchFormfiles.rejected, (state, action) => {
        state.status = 'failed';
        state.errors = action.error.message;
        state.items = []
      })

      // -----------------------------------------
      // removeFormfiles API durumu
      .addCase(removeFormfiles.pending, (state) => {
        state.status = 'loading';
        state.errors = []
      })
      .addCase(removeFormfiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.reverse();
        // Burayı güncelleyebiliriz. Çünkü silinen dosya seçili olabilir.
        if (state.selected && !state.items.find(file => file.uuid === state.selected)) {
          slice.caseReducers.selectFile(state, { payload: null });
        }
      })
      .addCase(removeFormfiles.rejected, (state, action) => {
        state.status = 'failed';
        state.errors = action.error.message;
        state.items = []
        slice.caseReducers.selectFile(state, { payload: null });
      })

      // -----------------------------------------
      // openForm API durumu
      .addCase(openFormfile.pending, (state) => {
        state.status = 'loading';
        state.errors = []
      })
      .addCase(openFormfile.fulfilled, (state, action) => {
        state.status = action.payload ? 'succeeded' : 'failed';
      })
      .addCase(openFormfile.rejected, (state, action) => {
        state.status = 'failed';
        state.errors = action.error.message;
        slice.caseReducers.selectFile(state, { payload: null });
      })
  },
});

export const {
  selectFile,
} = slice.actions;

export default slice.reducer;
