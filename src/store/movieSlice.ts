import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getMovies,
  getTop10Movies,
  getRandomMovie,
  getMovieById,
} from '../services/api';
import type { Movie, MovieFilters } from '../types';

interface MovieState {
  current: Movie | null;
  top10: Movie[];
  random: Movie | null;
  filtered: Movie[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  current: null,
  top10: [],
  random: null,
  filtered: [],
  total: 0,
  hasMore: true,
  isLoading: false,
  error: null,
};

export const fetchTop10 = createAsyncThunk<Movie[]>('movie/fetchTop10', async () => {
  return await getTop10Movies();
});

export const fetchRandomMovie = createAsyncThunk<Movie>('movie/fetchRandom', async () => {
  return await getRandomMovie();
});

export const fetchMovieById = createAsyncThunk<Movie, number>(
  'movie/fetchById',
  async (id) => {
    return await getMovieById(id);
  }
);

export const fetchFilteredMovies = createAsyncThunk<
  Movie[],
  MovieFilters
>('movie/fetchFiltered', async (filters) => {
  return await getMovies(filters);
});

export const fetchMoviesByGenre = createAsyncThunk<
  Movie[],
  { genre: string; page: number; limit: number }
>('movie/fetchMoviesByGenre', async ({ genre, page, limit }) => {
  return await getMovies({ genre, page, limit });
});

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetFiltered: (state) => {
      state.filtered = [];
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Top 10
      .addCase(fetchTop10.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTop10.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.isLoading = false;
        state.top10 = action.payload;
      })
      .addCase(fetchTop10.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки топа';
      })
      // Fetch Random
      .addCase(fetchRandomMovie.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRandomMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.isLoading = false;
        state.random = action.payload;
      })
      .addCase(fetchRandomMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки случайного фильма';
      })
      // Fetch Movie By Id
      .addCase(fetchMovieById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMovieById.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.isLoading = false;
        state.current = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки фильма';
      })
      // Fetch Filtered
      .addCase(fetchFilteredMovies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchFilteredMovies.fulfilled,
        (state, action: PayloadAction<Movie[]>) => {
          state.isLoading = false;
          state.filtered = action.payload;
          state.total = action.payload.length;
        }
      )
      .addCase(fetchFilteredMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки фильмов';
      })
      // Fetch Movies By Genre
      .addCase(fetchMoviesByGenre.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        state.isLoading = false;
        const { page, limit } = action.meta.arg;
        const movies = action.payload;
        state.filtered = page === 1 ? movies : [...state.filtered, ...movies];
        state.hasMore = movies.length === limit;
      })
      .addCase(fetchMoviesByGenre.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки фильмов по жанру';
      });
  },
});

export const { clearError, resetFiltered } = movieSlice.actions;
export default movieSlice.reducer;
