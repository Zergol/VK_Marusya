function Loader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={`loader loader--${size}`}>
      <div className="loader__spinner" />
    </div>
  );
}

export default Loader;
