import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { showSnackbar } from "../snackbar/Slice";

// Asenkron veri çekme
export const savePresets = createAsyncThunk(
  'mappings/savePresets',
  async ({ uuid, presets }, { dispatch }) => {
    const apiUrl = window.API_URL + "/formfiles/savePresets";

    const response = await axios.post(apiUrl, { uuid, presets });

    const data = response.data

    if (data.success) {
      dispatch(showSnackbar({message: 'Presets saved successfully!'}));
    }
    else {
      dispatch(showSnackbar({message: 'Presets could not be saved!', state: 'error'}));
    }

    return data;
  }
);

export const loadPresets = createAsyncThunk(
  'mappings/loadPresets',
  async ({ uuid, checkCols }, { dispatch }) => {
    const apiUrl = window.API_URL + "/formfiles/loadPresets/" + uuid;

    const response = await axios.get(apiUrl);

    const data = response.data?.filter(item => checkCols.includes(item.datacol)) || [];

    if (data.length) {
      dispatch(showSnackbar({message: 'Presets loaded successfully!'}));
    }
    else {
      dispatch(showSnackbar({message: 'Preset not found!', state: 'warning'}));
    }
    

    // Seçili VERİ DOSYASI KOLONLARInda yer alanları filtreliyoruz
    return data
  }
);
