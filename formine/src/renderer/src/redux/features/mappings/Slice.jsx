// src/features/placemarks/slice.js
import { createSlice } from '@reduxjs/toolkit';
import { savePresets, loadPresets } from './API';

const exampleData = [
  {datacol: "Col1", formcell: "A2"},
  {datacol: "Col2", formcell: "B2"},
  {datacol: "Col3", formcell: "C2"},
  {datacol: "Col4", formcell: "A5"},
  {datacol: "Col5", formcell: "D2"},
  {datacol: "Col6", formcell: "A7"},
  {datacol: "Col7", formcell: "S2"},
]

const slice = createSlice({
  name: 'mappings',

  initialState: {
    status: 'idle',  // 'idle', 'loading', 'succeeded', 'failed'
    errors: [],
    items: [],
    selected: null,
  },

  reducers: {
    // Sadece senkron işlem yapan reducer'lar
    reset:(state) => {
      state.errors = []
      state.items = []
      state.selected = null
    },

    addItem: (state, action) => {
      state.items = state.items.filter(item => item.formcell !== action.payload.formcell)
      state.items.unshift(action.payload)
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.formcell !== action.payload)
    },
  },

  extraReducers: (builder) => {
    builder
      // -----------------------------------------
      // fetchForms API durumu
      // -----------------------------------------
      // savePresets API durumu
      .addCase(savePresets.pending, (state) => {
        state.status = 'loading';
        state.errors = []
      })
      .addCase(savePresets.fulfilled, (state, action) => {
        state.status = action.payload ? 'succeeded' : 'failed';
      })
      .addCase(savePresets.rejected, (state, action) => {
        state.status = 'failed';
        state.errors = action.error.message;
      })

      // -----------------------------------------
      // loadPresets API durumu
      .addCase(loadPresets.pending, (state) => {
        state.status = 'loading';
        state.errors = []
        state.presets = []
      })
      .addCase(loadPresets.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadPresets.rejected, (state, action) => {
        state.status = 'failed';
        state.errors = action.error.message;
      })
  },
});

export const {
  reset, addItem, removeItem,
} = slice.actions;

export default slice.reducer;
