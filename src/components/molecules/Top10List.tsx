import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Movie } from '../../types';
import placeholderSvg from '../../assets/icons/genre-placeholder.svg';

interface Top10CardProps {
  movie: Movie;
  place: number;
  onClick: (id: number) => void;
}

function Top10Card({ movie, place, onClick }: Top10CardProps) {
  const [imageSrc, setImageSrc] = useState<string>(movie.posterUrl || placeholderSvg);

  const handleError = useCallback(() => {
    setImageSrc(placeholderSvg);
  }, []);

  return (
    <div className="top10__card" onClick={() => onClick(movie.id)}>
      <img
        src={imageSrc}
        alt={movie.title}
        className={`top10__card-img${imageSrc === placeholderSvg ? ' placeholder' : ''}`}
        onError={handleError}
      />
      <span className="top10__card-place">{place}</span>
    </div>
  );
}

function Top10List() {
  const navigate = useNavigate();
  const top10 = useSelector((state: RootState) => state.movie.top10);

  const handleMovieClick = (id: number) => {
    navigate(`/movie/${id}`);
  };

  return (
    <section className="top10">
      <h2 className="top10__title">Топ 10 фильмов</h2>

      <div className="top10__row">
        {top10.map((movie, index) => (
          <Top10Card
            key={movie.id}
            movie={movie}
            place={index + 1}
            onClick={handleMovieClick}
          />
        ))}
      </div>
    </section>
  );
}

export default Top10List;
