import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { USERTYPE } from 'constant';
import axios from 'utils/axios'; // Adjust the import path according to your project structure

const initialState = {
  roles: [], // Empty array initially
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10,
    lastPageNo: 1
  },
  loading: false,
  error: null
};

const API = {
  [USERTYPE.iscabProvider]: {
    CREATE: '/cabProvidersRole/add',
    UPDATE: '/cabProvidersRole/edit/permissions',
    DELETE: '/cabProvidersRole/delete',
    DETAILS: '/cabProvidersRole?roleID=',
    ALL: '/cabProvidersRole/all'
  },
  [USERTYPE.isVendor]: {
    CREATE: '/vendorsRole/add',
    UPDATE: '/vendorsRole/edit/permissions',
    DELETE: '/vendorsRole/delete',
    DETAILS: '/vendorsRole?roleID=',
    ALL: '/vendorsRole/all'
  }
};

export const fetchAllRoles = createAsyncThunk('roles/fetchAll', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const userType = state.auth.userType;
    const response = await axios.get(API[userType].ALL);
    return response?.data?.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    reset: () => initialState, // Reset state to initial state on logout
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        state.roles = action.payload || []; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchAllRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

// Export the reducer and actions
export const { reset, resetError } = roleSlice.actions;
export const roleReducer = roleSlice.reducer;
