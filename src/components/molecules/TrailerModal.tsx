import { useState, useEffect, useRef } from 'react';

interface TrailerModalProps {
  trailerUrl: string;
  movieTitle: string;
  onClose: () => void;
}

function TrailerModal({ trailerUrl, movieTitle, onClose }: TrailerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="trailer-overlay" onClick={onClose}>
      <div
        className="trailer-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="trailer__close-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="trailer__video-container">
          {isLoading && (
            <div className="trailer__loader">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" stroke="#FFFFFF80" strokeWidth="4" strokeLinecap="round" strokeDasharray="80" strokeDashoffset="20">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 20 20"
                    to="360 20 20"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
          )}

          <iframe
            ref={videoRef}
            className="trailer__video"
            src={isPlaying ? `${trailerUrl}?autoplay=1` : trailerUrl}
            title="Трейлер"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />

          {isPlaying && (
            <div className="trailer__overlay" onClick={handleVideoClick}>
              <div className="trailer__overlay-content">
                <span className="trailer__overlay-title">{movieTitle}</span>
              </div>
              <button className="trailer__play-btn" onClick={(e) => { e.stopPropagation(); setIsPlaying(false); }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M10 8L16 12L10 16V8Z" fill="#000000" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;
