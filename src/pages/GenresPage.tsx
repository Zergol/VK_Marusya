import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchGenres } from '../store/genreSlice';
import GenreCard from '../components/molecules/GenreCard';
import Loader from '../components/molecules/Loader';

function GenresPage() {
  const dispatch = useDispatch<AppDispatch>();
  const genres = useSelector((state: RootState) => state.genre.list);
  const isLoading = useSelector((state: RootState) => state.genre.isLoading);

  useEffect(() => {
    if (genres.length === 0) {
      dispatch(fetchGenres());
    }
  }, [dispatch, genres.length]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="genres-page">
      <h1 className="genres-page__title">Жанры фильмов</h1>
      <div className="genres-page__grid">
        {genres.map((genre) => (
          <GenreCard key={genre.name} genre={genre} />
        ))}
      </div>
    </div>
  );
}

export default GenresPage;
