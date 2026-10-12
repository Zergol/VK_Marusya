import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

function PageTransition() {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      setDirection(location.pathname > prevPathRef.current ? 'forward' : 'back');
      setIsAnimating(true);
      prevPathRef.current = location.pathname;

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <div className={`page-transition page-transition--${direction}`}>
      <div className={`page-transition__content ${isAnimating ? 'page-transition__content--animating' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default PageTransition;
