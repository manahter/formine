// src/features/placemarks/slice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchDatafiles, removeDatafiles, openDatafile, fetchColumns } from './API';


const slice = createSlice({
  name: 'datafiles',

  initialState: {
    status: 'idle',  // 'idle', 'loading', 'succeeded', 'failed'
    errors: [],
    items: [],
    selected: null,
    cols: [],
    selectedCol: null,
  },

  reducers: {
    // Sadece senkron işlem yapan reducer'lar
    selectFile: (state, action) => {
      state.cols = []
      state.selectedCol = null

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

    selectCol: (state, action) => {
      state.selectedCol = action.payload
    },
  },

  extraReducers: (builder) => {
    builder
      // -----------------------------------------
      // fetchForms API durumu
      .addCase(fetchDatafiles.pending, (state) => {
        state.status = 'loading';
        state.errors = []
      })
      .addCase(fetchDatafiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.reverse();

        if (action.payload.length) {
          slice.caseReducers.selectFile(state, { payload: null })
        }
      })
      .addCase(fetchDatafiles.rejected, (state, action) => {
        state.status = 'failed';
        state.errors = action.error.message;
        state.items = []
      })

      // -----------------------------------------
      // removeDatafiles API durumu
      .addCase(removeDatafiles.pending, (state) => {
        state.status = 'loading';
        state.errors = []
      })
      .addCase(removeDatafiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.reverse();
        // Burayı güncelleyebiliriz. Çünkü silinen dosya seçili olabilir.
        if (state.selected && !state.items.find(file => file.uuid === state.selected)) {
          slice.caseReducers.selectFile(state, { payload: null })
        }
      })
      .addCase(removeDatafiles.rejected, (state, action) => {
        state.status = 'failed';
        state.errors = action.error.message;
        state.items = []
        slice.caseReducers.selectFile(state, { payload: null })
      })

      // -----------------------------------------
      // openForm API durumu
      .addCase(openDatafile.pending, (state) => {
        state.status = 'loading';
        state.errors = []
      })
      .addCase(openDatafile.fulfilled, (state, action) => {
        state.status = action.payload ? 'succeeded' : 'failed';
      })
      .addCase(openDatafile.rejected, (state, action) => {
        state.status = 'failed';
        state.errors = action.error.message;
        slice.caseReducers.selectFile(state, { payload: null })
      })

      // -----------------------------------------
      // fetchColumns API durumu
      .addCase(fetchColumns.pending, (state) => {
        state.status = 'loading';
        state.errors = []
      })
      .addCase(fetchColumns.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cols = action.payload;
      })
      .addCase(fetchColumns.rejected, (state, action) => {
        state.status = 'failed';
        state.errors = action.error.message;
      })
  },
});

export const {
  selectFile, selectCol,
} = slice.actions;

export default slice.reducer;
