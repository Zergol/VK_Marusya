import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getGenres as getGenresApi } from '../services/api';
import type { Genre } from '../types';

interface GenreState {
  list: Genre[];
  isLoading: boolean;
  error: string | null;
}

const getGenreImage = (name: string): string => {
  return `https://picsum.photos/seed/${encodeURIComponent(name)}/290/220`;
};

const initialState: GenreState = {
  list: [],
  isLoading: false,
  error: null,
};

export const fetchGenres = createAsyncThunk<Genre[]>('genre/fetchGenres', async () => {
  const genres = await getGenresApi();
  return genres.map((name: string) => ({
    name,
    image: getGenreImage(name),
  }));
});

const genreSlice = createSlice({
  name: 'genre',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки жанров';
      });
  },
});

export default genreSlice.reducer;
