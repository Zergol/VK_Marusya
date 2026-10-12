import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, register, clearError } from '../../store/authSlice';
import { addToast } from '../../store/toastSlice';
import type { AppDispatch } from '../../store';
import logoBlack from '../../assets/icons/marusya-black.svg';

interface AuthModalProps {
  onClose: () => void;
}

type AuthState = 'login' | 'register' | 'success';

function AuthModal({ onClose }: AuthModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [authState, setAuthState] = useState<AuthState>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: false,
      }));
    }
  };

  const validateLogin = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.password.trim()) newErrors.password = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.password.trim()) newErrors.password = true;
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = true;
    if (!formData.firstName.trim()) newErrors.firstName = true;
    if (!formData.lastName.trim()) newErrors.lastName = true;
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authState === 'login') {
      if (!validateLogin()) return;
      try {
        await dispatch(login({
          email: formData.email,
          password: formData.password,
        })).unwrap();
        console.info('Вы успешно вошли');
        onClose();
        setFormData({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
        setErrors({});
      } catch (error: any) {
        let message = 'Ошибка авторизации';
        const data = error?.response?.data;
        if (data?.result === false) {
          message = 'Неверный email или пароль';
        } else if (data?.message) {
          message = data.message;
        } else if (data?.error) {
          message = data.error;
        }
        dispatch(addToast({ message, type: 'error' }));
      }
    } else {
      if (!validateRegister()) return;
      try {
        await dispatch(register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        })).unwrap();
        setAuthState('success');
        setFormData({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
        setErrors({});
      } catch (error: any) {
        let message = 'Ошибка регистрации';
        const data = error?.response?.data;
        if (error?.response?.status === 409 || /already exists|уже используется/i.test(error?.message || '')) {
          message = 'Этот email уже используется';
        } else if (data?.message) {
          message = data.message;
        } else if (data?.error) {
          message = data.error;
        }
        dispatch(addToast({ message, type: 'error' }));
      }
    }
  };

  const goToLogin = () => {
    setAuthState('login');
    setErrors({});
    dispatch(clearError());
  };

  const goToRegister = () => {
    setAuthState('register');
    setErrors({});
    dispatch(clearError());
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--auth" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="auth-modal__content">
          <div className="auth-modal__logo">
            <img src={logoBlack} alt="Маруся" className="auth-modal__logo-img" />
          </div>

          {authState === 'success' ? (
            <div className="auth-modal__success">
              <h2 className="auth-modal__success-title">Регистрация завершена</h2>
              <p className="auth-modal__success-text">Используйте вашу электронную почту для входа</p>
              <button className="btn btn--auth" onClick={goToLogin}>
                Войти
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              {authState === 'register' && (
                <h2 className="auth-form__title">Регистрация</h2>
              )}

              <div className="form-group">
                <span className="form-group__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#00000066" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  className={`form-group__input ${errors.email ? 'form-group__input--error' : ''}`}
                  placeholder="Электронная почта"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {authState === 'register' && (
                <>
                  <div className="form-group">
                    <span className="form-group__icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#00000066" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="firstName"
                      className={`form-group__input ${errors.firstName ? 'form-group__input--error' : ''}`}
                      placeholder="Имя"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <span className="form-group__icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#00000066" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="lastName"
                      className={`form-group__input ${errors.lastName ? 'form-group__input--error' : ''}`}
                      placeholder="Фамилия"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <span className="form-group__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.65 10C11.83 7.67 9.61 6 7 6C3.69 6 1 8.69 1 12C1 15.31 3.69 18 7 18C9.61 18 11.83 16.33 12.65 14H17V18H21V14H23V10H12.65ZM7 14C5.9 14 5 13.1 5 12C5 10.9 5.9 10 7 10C8.1 10 9 10.9 9 12C9 13.1 8.1 14 7 14Z" fill="#00000066" />
                  </svg>
                </span>
                <input
                  type="password"
                  name="password"
                  className={`form-group__input ${errors.password ? 'form-group__input--error' : ''}`}
                  placeholder="Пароль"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {authState === 'register' && (
                <div className="form-group">
                  <span className="form-group__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.65 10C11.83 7.67 9.61 6 7 6C3.69 6 1 8.69 1 12C1 15.31 3.69 18 7 18C9.61 18 11.83 16.33 12.65 14H17V18H21V14H23V10H12.65ZM7 14C5.9 14 5 13.1 5 12C5 10.9 5.9 10 7 10C8.1 10 9 10.9 9 12C9 13.1 8.1 14 7 14Z" fill="#00000066" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-group__input ${errors.confirmPassword ? 'form-group__input--error' : ''}`}
                    placeholder="Подтвердите пароль"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              )}

              <button type="submit" className="btn btn--auth">
                {authState === 'login' ? 'Войти' : 'Создать аккаунт'}
              </button>
            </form>
          )}

          <button
            className="auth-modal__toggle"
            onClick={authState === 'login' ? goToRegister : goToLogin}
          >
            {authState === 'login' ? 'Регистрация' : 'У меня есть пароль'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
