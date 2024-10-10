import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios'; // Adjust the import path according to your project structure

const initialState = {
  vehicleTypes: [], // Empty array initially
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10,
    lastPageNo: 1
  },
  loading: false,
  error: null
};

export const fetchAllVehicleTypesForAll = createAsyncThunk('vehicleTypes/fetchAll1', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/vehicleType/for/adding/vehicles');
    return response?.data?.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

export const fetchAllVehicleTypes = createAsyncThunk('vehicleTypes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/vehicleType`);
    return response?.data?.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

const vehicleType = createSlice({
  name: 'vehicleTypes',
  initialState,
  reducers: {
    reset: () => initialState, // Reset state to initial state on logout
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVehicleTypesForAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVehicleTypesForAll.fulfilled, (state, action) => {
        state.vehicleTypes = action.payload || []; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchAllVehicleTypesForAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchAllVehicleTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVehicleTypes.fulfilled, (state, action) => {
        state.vehicleTypes = action.payload || []; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchAllVehicleTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

// Export the reducer and actions
export const { reset, resetError } = vehicleType.actions;
export const vehicleTypeReducer = vehicleType.reducer;
