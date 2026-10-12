import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Header from './Header';
import Footer from './Footer';
import Toast from '../molecules/Toast';
import Loader from '../molecules/Loader';

function Layout() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const location = useLocation();

  // SHOW LOADER
  if (isLoading) {
    return (
      <div className="app">
        <Header />
        <main className="main">
          <div className="loader-container">
            <Loader size="lg" />
          </div>
        </main>
        <Footer />
        <Toast />
      </div>
    );
  }

  if (location.pathname === '/account' && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app">
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

export default Layout;
