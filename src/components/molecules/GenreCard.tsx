import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Genre } from '../../types';
import placeholderSvg from '../../assets/icons/genre-placeholder.svg';

interface GenreCardProps {
  genre: Genre;
}

function GenreCard({ genre }: GenreCardProps) {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState<string>(genre.image || placeholderSvg);

  const handleError = useCallback(() => {
    setImageSrc(placeholderSvg);
  }, []);

  return (
    <div
      className="genre-card"
      onClick={() => navigate(`/genre/${genre.name}`)}
    >
      <img
        src={imageSrc}
        alt={genre.name}
        className={`genre-card__image${imageSrc === placeholderSvg ? ' placeholder' : ''}`}
        onError={handleError}
      />
      <h3 className="genre-card__title">{genre.name}</h3>
    </div>
  );
}

export default GenreCard;
