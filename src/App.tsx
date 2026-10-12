import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { fetchTop10, fetchRandomMovie } from './store/movieSlice';
import { fetchGenres } from './store/genreSlice';
import { fetchProfile } from './store/authSlice';
import PageTransition from './components/organisms/PageTransition';
import Layout from './components/organisms/Layout';
import HomePage from './pages/HomePage';
import GenresPage from './pages/GenresPage';
import GenrePage from './pages/GenrePage';
import MoviePage from './pages/MoviePage';
import AccountPage from './pages/AccountPage';
import Preloader from './components/molecules/Preloader';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth !== 'true') {
      dispatch(fetchProfile());
    }
    dispatch(fetchTop10());
    dispatch(fetchRandomMovie());
    dispatch(fetchGenres());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloaderVisible(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isPreloaderVisible && <Preloader />}
      <BrowserRouter>
        <Routes>
          <Route element={<PageTransition />}>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="genres" element={<GenresPage />} />
              <Route path="genre/:genreName" element={<GenrePage />} />
              <Route path="movie/:movieId" element={<MoviePage />} />
              <Route path="account" element={<AccountPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
