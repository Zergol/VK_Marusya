import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getProfile,
} from '../services/api';
import type { User, LoginData, RegisterData, AuthState } from '../types';

const savedUser = localStorage.getItem('user');
const savedAuth = localStorage.getItem('isAuthenticated');

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: savedAuth === 'true',
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk<User, LoginData>(
  'auth/login',
  async (data) => {
    await loginApi(data);
    // Name & Surname from GET /profile
    return await getProfile();
  }
);

export const register = createAsyncThunk<void, RegisterData>(
  'auth/register',
  async (data) => {
    await registerApi(data);
  }
);

export const fetchProfile = createAsyncThunk<User>(
  'auth/fetchProfile',
  async () => {
    const user = await getProfile();
    return user;
  }
);

export const logout = createAsyncThunk<void>(
  'auth/logout',
  async () => {
    await logoutApi();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('isAuthenticated', 'true');
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка входа';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('isAuthenticated', 'true');
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
