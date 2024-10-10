import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios';

const initialState = {
  zoneTypes: [], // Empty array initially
  loading: false,
  error: null
};

export const fetchAllZoneTypes = createAsyncThunk('zoneTypes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/zoneType/all');
    return response?.data?.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Create the slice for zone names
const zoneTypeSlice = createSlice({
  name: 'zoneTypes',
  initialState,
  reducers: {
    reset: () => initialState, // Reset state to initial state
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllZoneTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllZoneTypes.fulfilled, (state, action) => {
        state.zoneTypes = action.payload; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchAllZoneTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

// Export the reducer and actions
export const { reset, resetError } = zoneTypeSlice.actions;
export const zoneTypeReducer = zoneTypeSlice.reducer;
