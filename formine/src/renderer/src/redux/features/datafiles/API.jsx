import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showSnackbar } from "../snackbar/Slice";

// Asenkron veri çekme
export const fetchDatafiles = createAsyncThunk(
  'datafiles/fetchDatafiles',
  async () => {
    const apiUrl = window.API_URL + "/datafiles";

    const response = await axios.get(apiUrl);

    return response.data
  }
);

export const removeDatafiles = createAsyncThunk(
  'datafiles/removeDatafiles',
  async (uuid) => {
    const apiUrl = window.API_URL + "/datafiles/remove/" + uuid;

    const response = await axios.get(apiUrl).catch(
      () => dispatch(showSnackbar({ message: 'An error occurred!', state: "error" }))
    );

    return response.data;
  }
);

export const openDatafile = createAsyncThunk(
  'datafiles/openDatafile',
  async (uuid, { dispatch }) => {
    const apiUrl = window.API_URL + "/datafiles/open/" + uuid;

    dispatch(showSnackbar({ message: 'Open request sent' }))

    const response = await axios.get(apiUrl).catch(
      () => dispatch(showSnackbar({ message: 'An error occurred!', state: "error" }))
    );

    if (!response.data) {
      dispatch(showSnackbar({ message: 'An error occurred!', state: "error" }))
    }
    return response.data;
  }
);

export const fetchColumns = createAsyncThunk(
  'datafiles/fetchColumns',
  async (uuid) => {
    if (!uuid) {
      return []
    }
    const apiUrl = window.API_URL + "/datafiles/columns/" + uuid;

    const response = await axios.get(apiUrl);

    return response.data || []
  }
);