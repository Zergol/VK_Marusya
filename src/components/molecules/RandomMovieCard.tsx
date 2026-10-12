import { useNavigate } from 'react-router-dom';
import type { Movie } from '../../types';
import { getRatingStyle, formatRating } from '../../utils/rating';
import { translateGenre, formatDuration } from '../../utils/genre';

interface RandomMovieCardProps {
  movie: Movie;
  onNewRandom: () => void;
  isInFavorites?: boolean;
  onToggleFavorite?: () => void;
  onOpenTrailer?: () => void;
}

function RandomMovieCard({ movie, onNewRandom, isInFavorites = false, onToggleFavorite, onOpenTrailer }: RandomMovieCardProps) {
  const navigate = useNavigate();

  const ratingStyle = getRatingStyle(Number(movie.tmdbRating));

  return (
    <div className="random-movie">
      <div className="random-movie__info">
        <div className="random-movie__meta">
          <span className={`random-movie__rating ${ratingStyle.className}`} style={{ background: ratingStyle.background }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0l2.5 5 5.5.8-4 3.9.9 5.3L8 12.5 3.1 15l.9-5.3-4-3.9L5.5 5z" />
            </svg>
            {formatRating(Number(movie.tmdbRating))}
          </span>
          <span className="random-movie__year">{movie.releaseYear}</span>
          {movie.genres && movie.genres[0] && (
            <span className="random-movie__genre">{translateGenre(movie.genres[0])}</span>
          )}
          <span className="random-movie__duration">{formatDuration(movie.runtime)}</span>
        </div>

        <h1 className="random-movie__title">{movie.title}</h1>
        <p className="random-movie__description">{movie.plot}</p>

        <div className="random-movie__actions">
          <button className="btn btn--primary" onClick={onOpenTrailer}>
            Трейлер
          </button>
          <button className="btn btn--secondary" onClick={() => navigate(`/movie/${movie.id}`)}>
            О фильме
          </button>
          <button
            className="btn btn--icon random-movie__favorite-btn"
            onClick={onToggleFavorite}
            title={isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
              <svg width="68" height="56" viewBox="0 0 68 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M38.5 19C41.5376 19 44 21.5 44 25C44 32 36.5 36 34 37.5C31.5 36 24 32 24 25C24 21.5 26.5 19 29.5 19C31.36 19 33 20 34 21C35 20 36.64 19 38.5 19ZM34.9339 34.6038C35.8155 34.0485 36.61 33.4955 37.3549 32.9029C40.3337 30.533 42 27.9435 42 25C42 22.6408 40.463 21 38.5 21C37.4241 21 36.2593 21.5691 35.4142 22.4142L34 23.8284L32.5858 22.4142C31.7407 21.5691 30.5759 21 29.5 21C27.5591 21 26 22.6565 26 25C26 27.9435 27.6663 30.533 30.6451 32.9029C31.39 33.4955 32.1845 34.0485 33.0661 34.6038C33.3646 34.7919 33.6611 34.9729 34 35.1752C34.3389 34.9729 34.6354 34.7919 34.9339 34.6038Z"
                  fill={isInFavorites ? '#FF7575' : 'white'} />
              </svg>
            </button>
          <button
            className="btn btn--icon random-movie__shuffle-btn"
            onClick={onNewRandom}
            title="Новый случайный фильм"
          >
            <svg width="68" height="56" viewBox="0 0 68 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34 20C36.7486 20 39.1749 21.3863 40.6156 23.5H38V25.5H44V19.5H42V21.9994C40.1762 19.5717 37.2724 18 34 18C28.4771 18 24 22.4771 24 28H26C26 23.5817 29.5817 20 34 20ZM42 28C42 32.4183 38.4183 36 34 36C31.2514 36 28.8251 34.6137 27.3844 32.5H30V30.5H24V36.5H26V34.0006C27.8238 36.4283 30.7276 38 34 38C39.5228 38 44 33.5228 44 28H42Z"
                fill="white" />
            </svg>
          </button>
        </div>
      </div>

      <div className="random-movie__cover">
        <img src={movie.posterUrl} alt={movie.title} />
      </div>
    </div>
  );
}

export default RandomMovieCard;
