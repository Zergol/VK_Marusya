import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchMoviesByGenre } from '../store/movieSlice';
import MovieCard from '../components/molecules/MovieCard';
import Loader from '../components/molecules/Loader';

const chevronIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 8L16 20L24 32" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function GenrePage() {
  const { genreName } = useParams<{ genreName: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const movies = useSelector((state: RootState) => state.movie.filtered);
  const isLoading = useSelector((state: RootState) => state.movie.isLoading);
  const hasMore = useSelector((state: RootState) => state.movie.hasMore);

  const initialLimit = 15;
  const loadMoreLimit = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (genreName) {
      dispatch(fetchMoviesByGenre({ genre: genreName, page: 1, limit: initialLimit }));
      setPage(1);
    }
  }, [genreName, dispatch]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    dispatch(fetchMoviesByGenre({ genre: genreName!, page: nextPage, limit: loadMoreLimit }));
  };

  if (isLoading && movies.length === 0) {
    return <Loader />;
  }

  return (
    <div className="genre-page">
      <div className="genre-page__header">
        <button className="genre-page__back-btn" onClick={() => navigate('/genres')}>
          {chevronIcon}
        </button>
        <h1 className="genre-page__title">{genreName}</h1>
      </div>

      <div className="genre-page__grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {isLoading && movies.length > 0 && (
        <div className="genre-page__loading-more">
          <Loader size="sm" />
        </div>
      )}

      {hasMore && !isLoading && (
        <div className="genre-page__load-more">
          <button
            className="btn btn--primary"
            onClick={handleLoadMore}
          >
            Показать ещё
          </button>
        </div>
      )}
    </div>
  );
}

export default GenrePage;
