import axios from 'axios';
import type { Movie, User, LoginData, RegisterData } from '../types';

const API_URL = 'https://cinemaguide.skillbox.cc';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints
// API - application/x-www-form-urlencoded
const sendForm = async (
  url: string,
  fields: Record<string, string>
): Promise<void> => {
  const form = new URLSearchParams(fields);
  const response = await fetch(API_URL + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    credentials: 'include',
    body: form.toString(),
  });
  const text = await response.text();
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(text);
  } catch {
    payload = { error: text };
  }
  // Response might be 200 with body {"error": "..."} (example, «User already exists»)
  const hasError =
    !response.ok ||
    Boolean(payload?.error) ||
    payload?.success === false;
  if (hasError) {
    const message =
      (payload?.message as string) ||
      (payload?.error as string) ||
      'Ошибка запроса';
    const error = new Error(message) as any;
    error.response = { status: response.status, data: payload };
    throw error;
  }
};

export const login = async (data: LoginData): Promise<void> => {
  await sendForm('/auth/login', {
    email: data.email,
    password: data.password,
  });
};

export const register = async (data: RegisterData): Promise<void> => {
  await sendForm('/user', {
    email: data.email,
    password: data.password,
    name: data.firstName,
    surname: data.lastName,
  });
};

export const logout = async (): Promise<void> => {
  await api.get('/auth/logout');
};

export const getProfile = async (): Promise<User> => {
  const response = await fetch(API_URL + '/profile', {
    credentials: 'include',
  });
  const data = await response.json();
  if (response.status === 401) {
    throw new Error('Unauthorized');
  }
  return data as User;
};

// Movie endpoints
export const getMovies = async (filters: {
  genre?: string;
  page?: number;
  limit?: number;
}): Promise<Movie[]> => {
  const params: Record<string, string | number> = {};
  if (filters.genre) params.genre = filters.genre;
  if (filters.page) params.page = filters.page;
  // According to the API documentation, the number of movies is specified by the count param
  if (filters.limit) params.count = filters.limit;

  const response = await api.get('/movie', { params });
  return response.data;
};

export const getTop10Movies = async (): Promise<Movie[]> => {
  const response = await api.get('/movie/top10');
  return response.data;
};

export const getRandomMovie = async (): Promise<Movie> => {
  const response = await api.get('/movie/random');
  return response.data;
};

export const getMovieById = async (id: number): Promise<Movie> => {
  const response = await api.get(`/movie/${id}`);
  return response.data;
};

export const getGenres = async (): Promise<string[]> => {
  const response = await api.get('/movie/genres');
  return response.data;
};

// Favorites endpoints
export const getFavorites = async (): Promise<Movie[]> => {
  const response = await api.get('/favorites');
  return response.data;
};

export const addToFavorites = async (movieId: number): Promise<void> => {
  const form = new URLSearchParams({ id: String(movieId) });
  const response = await fetch(API_URL + '/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    credentials: 'include',
    body: form.toString(),
  });
  if (!response.ok) {
    const text = await response.text();
    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
    const error = new Error((data?.message as string) || 'Ошибка добавления в избранное') as any;
    error.response = { status: response.status, data };
    throw error;
  }
};

export const removeFromFavorites = async (movieId: number): Promise<void> => {
  await api.delete(`/favorites/${movieId}`);
};
