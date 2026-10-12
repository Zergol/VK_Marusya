import { useNavigate } from 'react-router-dom';
import type { Movie } from '../../types';
import { getRatingStyle, formatRating } from '../../utils/rating';

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();
  const ratingStyle = getRatingStyle(Number(movie.tmdbRating));

  return (
    <div
      className="movie-card"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="movie-card__cover">
        <img src={movie.posterUrl} alt={movie.title} />
        <span className={`movie-card__rating ${ratingStyle.className}`} style={{ background: ratingStyle.background }}>
          {formatRating(Number(movie.tmdbRating))}
        </span>
      </div>
      <h3 className="movie-card__title">{movie.title}</h3>
      <p className="movie-card__year">{movie.releaseYear}</p>
    </div>
  );
}

export default MovieCard;
