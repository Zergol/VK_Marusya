export interface Movie {
  id: number;
  title: string;
  originalTitle?: string;
  plot: string;
  posterUrl: string;
  releaseYear: number;
  tmdbRating: number;
  runtime: number;
  genres: string[];
  trailerUrl?: string;
  trailerYouTubeId?: string;
  backdropUrl?: string;
  director?: string;
  production?: string;
  awardsSummary?: string;
  language?: string;
  budget?: number;
  revenue?: number;
}

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  surname?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ApiError {
  message: string;
}

export interface MovieFilters {
  genre?: string;
  page?: number;
  limit?: number;
}

export interface Genre {
  name: string;
  image: string;
}

export interface ModalState {
  isAuthModalOpen: boolean;
  isSearchModalOpen: boolean;
  isTrailerModalOpen: boolean;
  selectedMovie: Movie | null;
}
