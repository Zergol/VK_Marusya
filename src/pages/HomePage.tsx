import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchTop10, fetchRandomMovie } from '../store/movieSlice';
import { addFavorite, removeFavorite, fetchFavorites } from '../store/favoritesSlice';
import AuthModal from '../components/molecules/AuthModal';
import TrailerModal from '../components/molecules/TrailerModal';
import Loader from '../components/molecules/Loader';
import RandomMovieCard from '../components/molecules/RandomMovieCard';
import Top10List from '../components/molecules/Top10List';

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const randomMovie = useSelector((state: RootState) => state.movie.random);
  const top10 = useSelector((state: RootState) => state.movie.top10);
  const isLoading = useSelector((state: RootState) => state.movie.isLoading);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTop10());
    dispatch(fetchRandomMovie());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [isAuthenticated, dispatch]);

  const handleToggleFavorite = async () => {
    if (!randomMovie) return;

    if (!isAuthenticated) {
      setIsAuthOpen(true);
      return;
    }

    try {
      const isInFav = favorites.some((f) => f.id === randomMovie.id);
      if (isInFav) {
        await dispatch(removeFavorite(randomMovie.id)).unwrap();
        console.log('Фильм удалён из избранного');
      } else {
        await dispatch(addFavorite(randomMovie.id)).unwrap();
        console.log('Фильм добавлен в избранное');
      }
    } catch (error) {
      console.error('Ошибка с избранным:', error);
    }
  };

  const handleOpenTrailer = () => {
    if (randomMovie?.trailerUrl) {
      setIsTrailerOpen(true);
    }
  };

  const isInFavorites = randomMovie ? favorites.some((f) => f.id === randomMovie.id) : false;

  return (
    <div className="home-page">
      <section className="home-page__random">
        <div className="home-page__random-container">
          {isLoading ? (
            <Loader />
          ) : randomMovie ? (
            <RandomMovieCard
              movie={randomMovie}
              onNewRandom={() => dispatch(fetchRandomMovie())}
              isInFavorites={isInFavorites}
              onToggleFavorite={handleToggleFavorite}
              onOpenTrailer={handleOpenTrailer}
            />
          ) : null}
        </div>
      </section>

      <section className="home-page__top">
        {top10.length > 0 ? (
          <Top10List />
        ) : (
          <Loader size="sm" />
        )}
      </section>

      {isAuthOpen && (
        <AuthModal onClose={() => setIsAuthOpen(false)} />
      )}

      {isTrailerOpen && randomMovie?.trailerUrl && (
        <TrailerModal
          trailerUrl={`https://www.youtube.com/embed/${randomMovie.trailerYouTubeId}`}
          movieTitle={randomMovie.title}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
    </div>
  );
}

export default HomePage;
