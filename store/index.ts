
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { refreshTokenThunk, logout } from './slices/authSlice';
import api, { setupInterceptors } from '@/utils/axios';


export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Set up axios interceptors after store is created
setupInterceptors(store, refreshTokenThunk, logout);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;