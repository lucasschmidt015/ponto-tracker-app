import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/utils/axios'; 

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
}

export interface CompanyInfo {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: UserInfo | null;
  company: CompanyInfo | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  user: null,
  company: null,
  isLoading: true,
};

const performLogin = async (email: string, password: string): Promise<{ access_token: string; refresh_token: string; user: UserInfo; company: CompanyInfo } | null> => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  if (!API_URL) {
    throw new Error('API URL is not defined');
  }
  try {
    const response = await api.post(`${API_URL}/auth/login`, { email, password }); // use api
    if (response.status !== 200) {
      return null;
    }
    return response.data;
  } catch (error) {
    return null;
  }
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const data = await performLogin(email, password);
    if (!data) {
      return null;
    }
    await AsyncStorage.setItem('token', data.access_token);
    await AsyncStorage.setItem('refreshToken', data.refresh_token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    await AsyncStorage.setItem('company', JSON.stringify(data.company));
    return { token: data.access_token, refreshToken: data.refresh_token, user: data.user, company: data.company };
  }
);

export const restoreToken = createAsyncThunk('auth/restoreToken', async (_, { dispatch }) => {
  const token = await AsyncStorage.getItem('token');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  const userStr = await AsyncStorage.getItem('user');
  const companyStr = await AsyncStorage.getItem('company');
  const user = userStr ? JSON.parse(userStr) : null;
  const company = companyStr ? JSON.parse(companyStr) : null;

  if (!token || !user?._id) {
    await dispatch(logout());
    return { token: null, refreshToken: null, user: null, company: null };
  }

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  let isValid = false;
  if (API_URL) {
    try {
      const response = await api.post(
        `${API_URL}/auth/validate`,
        { 
          token, 
          userId: user._id 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      isValid = response.data?.valid === true;
    } catch (e) {
      isValid = false;
    }
  }

  if (isValid) {
    return { token, refreshToken, user, company };
  }

  if (refreshToken && user?._id && API_URL) {
    try {
      const response = await api.post(
        `${API_URL}/auth/refresh`,
        { refreshToken, userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        const { access_token, refresh_token, user: newUser, company: newCompany } = response.data;
        await AsyncStorage.setItem('token', access_token);
        await AsyncStorage.setItem('refreshToken', refresh_token);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        await AsyncStorage.setItem('company', JSON.stringify(newCompany));
        return { token: access_token, refreshToken: refresh_token, user: newUser, company: newCompany };
      }
    } catch (e) {
      // Maybe add some message telling the user that his session has expired
    }
  }

  await dispatch(logout());
  return { token: null, refreshToken: null, user: null, company: null };
});



const performLogout = async (token?: string, userId?: string): Promise<void> => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  
  if (API_URL && userId) {
    try {
      await api.post(
        `${API_URL}/auth/logout`,
        { userId },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
    } catch (error) {
      
    }
  }

  try {
    await AsyncStorage.multiRemove(['token', 'refreshToken', 'user', 'company']);
  } catch (error) {
    throw new Error('Logout failed');
  }
};

export const logout = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const state = (getState() as any).auth;
  const token = state.token || (await AsyncStorage.getItem('token'));
  const userStr = state.user ? JSON.stringify(state.user) : (await AsyncStorage.getItem('user'));
  const user = userStr ? JSON.parse(userStr) : null;
  
  await performLogout(token, user?._id);
});

export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, dispatch }) => {
    const state = (getState() as any).auth;
    const refreshToken = state.refreshToken || (await AsyncStorage.getItem('refreshToken'));
    const user = state.user || JSON.parse((await AsyncStorage.getItem('user')) || 'null');
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    if (!API_URL || !refreshToken || !user?._id) {
      throw new Error('Missing API URL, refreshToken, or userId');
    }
    try {
      const response = await api.post(
        `${API_URL}/auth/refresh`,
        { refreshToken, userId: user._id },      
      );
      if (response.status !== 200) {
        throw new Error('Failed to refresh token');
      }
      const { access_token, refresh_token, user: newUser, company: newCompany } = response.data;
      await AsyncStorage.setItem('token', access_token);
      await AsyncStorage.setItem('refreshToken', refresh_token);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      await AsyncStorage.setItem('company', JSON.stringify(newCompany));
      return { token: access_token, refreshToken: refresh_token, user: newUser, company: newCompany };
    } catch (error) {
      await dispatch(logout());
      throw error;
    }
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(restoreToken.fulfilled, (state, action: PayloadAction<{ token: string | null; refreshToken: string | null; user: UserInfo | null; company: CompanyInfo | null }>) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.company = action.payload.company;
        state.isAuthenticated = !!action.payload.token;
        state.isLoading = false;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; refreshToken: string; user: UserInfo; company: CompanyInfo } | null>) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
          state.company = action.payload.company;
          state.isAuthenticated = true;
        } else {
          state.token = null;
          state.refreshToken = null;
          state.user = null;
          state.company = null;
          state.isAuthenticated = false;
        }
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, state => {
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        state.company = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action: PayloadAction<{ token: string; refreshToken: string; user: UserInfo; company: CompanyInfo } | undefined>) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
          state.company = action.payload.company;
          state.isAuthenticated = true;
        } else {
          state.token = null;
          state.refreshToken = null;
          state.user = null;
          state.company = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        state.company = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;