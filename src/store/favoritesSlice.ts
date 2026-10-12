import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFavorites, addToFavorites, removeFromFavorites } from '../services/api';
import type { Movie } from '../types';

interface FavoritesState {
  items: Movie[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk<Movie[]>('favorites/fetch', async () => {
  return await getFavorites();
});

export const addFavorite = createAsyncThunk<void, number>(
  'favorites/add',
  async (movieId, { dispatch }) => {
    await addToFavorites(movieId);
    await dispatch(fetchFavorites());
  }
);

export const removeFavorite = createAsyncThunk<void, number>(
  'favorites/remove',
  async (movieId, { dispatch }) => {
    await removeFromFavorites(movieId);
    await dispatch(fetchFavorites());
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки избранного';
      });
  },
});

export default favoritesSlice.reducer;
