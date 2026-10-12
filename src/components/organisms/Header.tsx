import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getMovies } from '../../services/api';
import type { Movie } from '../../types';
import AuthModal from '../molecules/AuthModal';
import logoWhite from '../../assets/icons/marusya-white.svg';
import { getRatingStyle, formatRating } from '../../utils/rating';
import { translateGenre, formatDuration } from '../../utils/genre';

function Header() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const mobileSearchBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (mobileSearchBtnRef.current?.contains(target)) return;

      if ((target as Element).closest?.('.header__search-mobile-overlay')) return;

      if (searchWrapperRef.current && !searchWrapperRef.current.contains(target)) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.classList.add('search-open');
    } else {
      document.body.classList.remove('search-open');
    }
    return () => {
      document.body.classList.remove('search-open');
    };
  }, [isSearchOpen]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const movies = await getMovies({ page: 1, limit: 50 });
        const filtered = movies.filter((m: Movie) =>
          m.title.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        setSearchResults(filtered);
      } catch (error) {
        console.error('Ошибка поиска:', error);
      }
    }, 300);
  };

  const handleResultClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <>
      <header className="header">
        <div className="header__container">
          <NavLink to="/" className="header__logo">
            <img src={logoWhite} alt="Маруся" className="header__logo-img" />
          </NavLink>

          <nav className="header__nav">
            <NavLink
              to="/"
              className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
            >
              Главная
            </NavLink>
            <NavLink
              to="/genres"
              className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
            >
              Жанры
            </NavLink>

            <div
              className="header__search-wrapper"
              ref={searchWrapperRef}
            >
              <div
                className="header__search-input"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#FFFFFF80" strokeWidth="2" />
                  <path d="M16 16L21 21" stroke="#FFFFFF80" strokeWidth="2" />
                </svg>
                {isSearchOpen ? (
                  <input
                    type="text"
                    className="header__search-input-field"
                    placeholder="Введите название фильма"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                ) : (
                  <span className="header__search-placeholder">Поиск</span>
                )}

                {isSearchOpen && (
                  <button
                    className="header__search-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="#FFFFFF80" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>

              {isSearchOpen && (
                <div className="header__search-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="header__search-dropdown-inner">
                    {searchResults.length > 0 && (
                      <div className="header__search-results">
                        {searchResults.map((movie) => (
                          <div
                            key={movie.id}
                            className="header__search-result"
                            onClick={() => handleResultClick(movie.id)}
                          >
                            <img src={movie.posterUrl} alt={movie.title} className="header__search-result-cover" />
                            <div className="header__search-result-info">
                              <div className="header__search-result-meta">
                                <span className="header__search-result-rating" style={{ background: getRatingStyle(Number(movie.tmdbRating)).background }}>
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 0l2.5 5 5.5.8-4 3.9.9 5.3L8 12.5 3.1 15l.9-5.3-4-3.9L5.5 5z" />
                                  </svg>
                                  {formatRating(Number(movie.tmdbRating))}
                                </span>
                                <span className="header__search-result-year">{movie.releaseYear}</span>
                                {movie.genres && movie.genres[0] && (
                                  <span className="header__search-result-genre">{translateGenre(movie.genres[0])}</span>
                                )}
                                <span className="header__search-result-duration">{formatDuration(movie.runtime)}</span>
                              </div>
                              <span className="header__search-result-title">{movie.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="header__mobile-icons">
            <NavLink to="/genres" className="header__mobile-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="#FFFFFF" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="#FFFFFF" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="#FFFFFF" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </NavLink>
            <button
              type="button"
              className="header__mobile-icon"
              ref={mobileSearchBtnRef}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#FFFFFF" strokeWidth="2" />
                <path d="M16 16L21 21" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </button>
            <button className="header__mobile-icon" onClick={handleProfileClick}>
              <svg width="24" height="24" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 21C0 16.5817 3.58172 13 8 13C12.4183 13 16 16.5817 16 21H14C14 17.6863 11.3137 15 8 15C4.68629 15 2 17.6863 2 21H0ZM8 12C4.685 12 2 9.315 2 6C2 2.685 4.685 0 8 0C11.315 0 14 2.685 14 6C14 9.315 11.315 12 8 12ZM8 10C10.21 10 12 8.21 12 6C12 3.79 10.21 2 8 2C5.79 2 4 3.79 4 6C4 8.21 5.79 10 8 10Z" fill="#FFFFFF" />
              </svg>
            </button>
          </div>

          <button
            className="header__auth-btn"
            onClick={handleProfileClick}
          >
            {isAuthenticated ? user?.surname || user?.lastName || 'Профиль' : 'Войти'}
          </button>
        </div>

        {isAuthOpen && (
          <AuthModal onClose={() => setIsAuthOpen(false)} />
        )}

        {/* MOBILE SEARCH MODAL */}
        {isSearchOpen && (
          <div className="header__search-mobile-overlay" onClick={() => { setIsSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}>
            <div className="header__search-mobile-modal" onClick={(e) => e.stopPropagation()}>
              <div className="header__search-mobile-input">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#FFFFFF80" strokeWidth="2" />
                  <path d="M16 16L21 21" stroke="#FFFFFF80" strokeWidth="2" />
                </svg>
                <input
                  type="text"
                  className="header__search-mobile-input-field"
                  placeholder="Поиск"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  ref={(el) => el?.focus()}
                />
                <button
                  type="button"
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="#FFFFFF80" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="header__search-mobile-results">
                  {searchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className="header__search-result"
                      onClick={() => handleResultClick(movie.id)}
                    >
                      <img src={movie.posterUrl} alt={movie.title} className="header__search-result-cover" />
                      <div className="header__search-result-info">
                        <div className="header__search-result-meta">
                          <span className="header__search-result-rating" style={{ background: getRatingStyle(Number(movie.tmdbRating)).background }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M8 0l2.5 5 5.5.8-4 3.9.9 5.3L8 12.5 3.1 15l.9-5.3-4-3.9L5.5 5z" />
                            </svg>
                            {formatRating(Number(movie.tmdbRating))}
                          </span>
                          <span className="header__search-result-year">{movie.releaseYear}</span>
                          {movie.genres && movie.genres[0] && (
                            <span className="header__search-result-genre">{translateGenre(movie.genres[0])}</span>
                          )}
                          <span className="header__search-result-duration">{formatDuration(movie.runtime)}</span>
                        </div>
                        <span className="header__search-result-title">{movie.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
