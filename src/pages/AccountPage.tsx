import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { fetchFavorites, removeFavorite } from '../store/favoritesSlice';
import { logout } from '../store/authSlice';
import MovieCard from '../components/molecules/MovieCard';
import Loader from '../components/molecules/Loader';

const favoriteIcon = (
  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 0C17.5376 0 20 2.5 20 6C20 13 12.5 17 10 18.5C7.5 17 0 13 0 6C0 2.5 2.5 0 5.5 0C7.35997 0 9 1 10 2C11 1 12.64 0 14.5 0ZM10.9339 15.6038C11.8155 15.0485 12.61 14.4955 13.3549 13.9029C16.3337 11.533 18 8.9435 18 6C18 3.64076 16.463 2 14.5 2C13.4241 2 12.2593 2.56911 11.4142 3.41421L10 4.82843L8.5858 3.41421C7.74068 2.56911 6.5759 2 5.5 2C3.55906 2 2 3.6565 2 6C2 8.9435 3.66627 11.533 6.64514 13.9029C7.39 14.4955 8.1845 15.0485 9.0661 15.6038C9.3646 15.7919 9.6611 15.9729 10 16.1752C10.3389 15.9729 10.6354 15.7919 10.9339 15.6038Z" fill="white" />
  </svg>
);

const settingsIcon = (
  <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 21C0 16.5817 3.58172 13 8 13C12.4183 13 16 16.5817 16 21H14C14 17.6863 11.3137 15 8 15C4.68629 15 2 17.6863 2 21H0ZM8 12C4.685 12 2 9.315 2 6C2 2.685 4.685 0 8 0C11.315 0 14 2.685 14 6C14 9.315 11.315 12 8 12ZM8 10C10.21 10 12 8.21 12 6C12 3.79 10.21 2 8 2C5.79 2 4 3.79 4 6C4 8.21 5.79 10 8 10Z" fill="white" />
  </svg>
);

type TabType = 'favorites' | 'settings';

function AccountPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isLoadingFavorites = useSelector((state: RootState) => state.favorites.isLoading);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [activeTab, setActiveTab] = useState<TabType>('favorites');

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      console.log('Вы вышли из аккаунта');
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  const handleRemoveFavorite = async (movieId: number) => {
    try {
      await dispatch(removeFavorite(movieId)).unwrap();
      console.log('Фильм удалён из избранного');
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="account-page">
        <p>Пожалуйста, авторизуйтесь</p>
        <button className="btn btn--primary" onClick={() => navigate('/')}>
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className="account-page">
      <h1 className="account-page__title">Мой аккаунт</h1>

      <div className="account-page__tabs">
        <button
          className={`account-page__tab ${activeTab === 'favorites' ? 'account-page__tab--active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          {favoriteIcon}
          <span>Избранные фильмы</span>
        </button>
        <button
          className={`account-page__tab ${activeTab === 'settings' ? 'account-page__tab--active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          {settingsIcon}
          <span>Настройка аккаунта</span>
        </button>
      </div>

      {activeTab === 'favorites' && (
        <div className="account-page__content">
          {isLoadingFavorites ? (
            <Loader />
          ) : (
            <div className="account-page__grid">
              {favorites.map((movie) => (
                <div key={movie.id} className="account-page__movie-card">
                  <MovieCard movie={movie} />
                  <button
                    className="account-page__remove-btn"
                    onClick={() => handleRemoveFavorite(movie.id)}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 1L1 11M1 1L11 11" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="account-page__settings">
          <div className="account-page__settings-info">
            <div className="account-page__settings-item">
              <div className="account-page__settings-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white" />
                </svg>
              </div>
              <div className="account-page__settings-text">
                <span className="account-page__settings-label">Имя Фамилия</span>
                <span className="account-page__settings-value">
                  {user.name || user.firstName || '—'} {user.surname || user.lastName || '—'}
                </span>
              </div>
            </div>
            <div className="account-page__settings-item">
              <div className="account-page__settings-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="white" />
                </svg>
              </div>
              <div className="account-page__settings-text">
                <span className="account-page__settings-label">Электронная почта</span>
                <span className="account-page__settings-value">{user.email}</span>
              </div>
            </div>
          </div>
          <button className="btn btn--primary account-page__logout-btn" onClick={handleLogout}>
            Выйти из аккаунта
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountPage;
