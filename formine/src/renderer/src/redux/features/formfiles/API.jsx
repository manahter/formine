import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showSnackbar } from "../snackbar/Slice";

// Asenkron veri çekme
export const fetchFormfiles = createAsyncThunk(
  'formfiles/fetchFormfiles',
  async () => {
    const apiUrl = window.API_URL + "/formfiles";

    const response = await axios.get(apiUrl);

    return response.data
  }
);

export const removeFormfiles = createAsyncThunk(
  'formfiles/removeFormfiles',
  async (uuid) => {
    const apiUrl = window.API_URL + "/formfiles/remove/" + uuid;

    const response = await axios.get(apiUrl).catch(
      () => dispatch(showSnackbar({ message: 'An error occurred!', state: "error" }))
    );

    return response.data;
  }
);

export const openFormfile = createAsyncThunk(
  'formfiles/openFormfile',
  async (uuid, { dispatch }) => {
    const apiUrl = window.API_URL + "/formfiles/open/" + uuid;

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
