import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import movieReducer from './movieSlice';
import genreReducer from './genreSlice';
import favoritesReducer from './favoritesSlice';
import toastReducer from './toastSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movie: movieReducer,
    genre: genreReducer,
    favorites: favoritesReducer,
    toast: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
