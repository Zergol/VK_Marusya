import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchMovieById } from '../store/movieSlice';
import { addFavorite, removeFavorite, fetchFavorites } from '../store/favoritesSlice';
import TrailerModal from '../components/molecules/TrailerModal';
import AuthModal from '../components/molecules/AuthModal';
import Loader from '../components/molecules/Loader';
import { getRatingStyle, formatRating } from '../utils/rating';
import { translateGenre, formatDuration } from '../utils/genre';

function MoviePage() {
  const { movieId } = useParams<{ movieId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const movie = useSelector((state: RootState) => state.movie.current);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isLoading = useSelector((state: RootState) => state.movie.isLoading);

  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovieById(Number(movieId)));
    }
  }, [movieId, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [isAuthenticated, dispatch]);

  if (!movieId || isLoading || !movie) {
    return <Loader />;
  }

  const isInFavorites = isAuthenticated && favorites.some((f) => f.id === movie.id);

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      setIsAuthOpen(true);
      return;
    }

    try {
      if (isInFavorites) {
        await dispatch(removeFavorite(movie.id)).unwrap();
        console.log('Фильм удалён из избранного');
      } else {
        await dispatch(addFavorite(movie.id)).unwrap();
        console.log('Фильм добавлен в избранное');
      }
    } catch (error) {
      console.error('Ошибка с избранным:', error);
    }
  };

  const handleTrailerClick = () => {
    if (movie.trailerUrl) {
      setIsTrailerOpen(true);
    } else {
      console.warn('Трейлер отсутствует');
    }
  };

  const ratingStyle = getRatingStyle(Number(movie.tmdbRating));

  return (
    <div className="movie-page">
      <div className="movie-page__wallpaper">
        <div className="movie-page__info">
          <div className="movie-page__film-data">
            <div className="movie-page__meta-row">
              <span className={`movie-page__rating ${ratingStyle.className}`} style={{ background: ratingStyle.background }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0l2.5 5 5.5.8-4 3.9.9 5.3L8 12.5 3.1 15l.9-5.3-4-3.9L5.5 5z" />
                </svg>
                {formatRating(Number(movie.tmdbRating))}
              </span>
              <span className="movie-page__year">{movie.releaseYear}</span>
              {movie.genres && movie.genres[0] && (
                <span className="movie-page__genre">{translateGenre(movie.genres[0])}</span>
              )}
              <span className="movie-page__duration">{formatDuration(movie.runtime)}</span>
            </div>

            <h1 className="movie-page__title">{movie.title}</h1>
            <p className="movie-page__description">{movie.plot}</p>
          </div>

          <div className="movie-page__actions">
            <button className="btn btn--primary" onClick={handleTrailerClick}>
              Трейлер
            </button>

            <button
              className="btn btn--icon"
              onClick={handleAddToFavorites}
              title={isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill={isInFavorites ? '#FF7575' : 'none'} stroke={isInFavorites ? '#FF7575' : 'currentColor'} strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>

        <div className="movie-page__cover">
          <img src={movie.posterUrl} alt={movie.title} />
        </div>
      </div>

      <div className="movie-page__details">
        <h2 className="movie-page__details-title">О фильме</h2>
        <ul className="movie-page__details-list">
          {movie.language && (
            <li className="movie-page__details-item">
              <span className="movie-page__details-label">Язык оригинала</span>
              <span className="movie-page__details-dash" />
              <span className="movie-page__details-value">{movie.language}</span>
            </li>
          )}
          {movie.budget && (
            <li className="movie-page__details-item">
              <span className="movie-page__details-label">Бюджет</span>
              <span className="movie-page__details-dash" />
              <span className="movie-page__details-value">${movie.budget.toLocaleString('ru-RU')}</span>
            </li>
          )}
          {movie.revenue && (
            <li className="movie-page__details-item">
              <span className="movie-page__details-label">Выручка</span>
              <span className="movie-page__details-dash" />
              <span className="movie-page__details-value">${movie.revenue.toLocaleString('ru-RU')}</span>
            </li>
          )}
          {movie.director && (
            <li className="movie-page__details-item">
              <span className="movie-page__details-label">Режиссёр</span>
              <span className="movie-page__details-dash" />
              <span className="movie-page__details-value">{movie.director}</span>
            </li>
          )}
          {movie.production && (
            <li className="movie-page__details-item">
              <span className="movie-page__details-label">Продакшен</span>
              <span className="movie-page__details-dash" />
              <span className="movie-page__details-value">{movie.production}</span>
            </li>
          )}
          {movie.awardsSummary && (
            <li className="movie-page__details-item">
              <span className="movie-page__details-label">Награды</span>
              <span className="movie-page__details-dash" />
              <span className="movie-page__details-value">{movie.awardsSummary}</span>
            </li>
          )}
        </ul>
      </div>

      {isTrailerOpen && movie.trailerUrl && (
        <TrailerModal
          trailerUrl={`https://www.youtube.com/embed/${movie.trailerYouTubeId}`}
          movieTitle={movie.title}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}

      {isAuthOpen && (
        <AuthModal onClose={() => setIsAuthOpen(false)} />
      )}
    </div>
  );
}

export default MoviePage;
