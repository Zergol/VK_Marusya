import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { removeToast } from '../../store/toastSlice';

function Toast() {
  const dispatch = useDispatch<AppDispatch>();
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
          onClick={() => dispatch(removeToast(toast.id))}
        >
          <span className="toast__icon">
            {toast.type === 'error' ? '✕' : toast.type === 'success' ? '✓' : 'ℹ'}
          </span>
          <span className="toast__message">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

export default Toast;
