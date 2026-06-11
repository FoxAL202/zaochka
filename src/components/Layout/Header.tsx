import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import type { RootState, AppDispatch } from '../../store';
import { logoutThunk } from '../../store/authSlice';
import styles from './Header.module.css';

export default function Header() {
  const { user } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          Заявки
        </Link>

        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <Link
            to="/"
            className={`${styles.link} ${isActive('/') ? styles.active : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Каталог
          </Link>

          {user ? (
            <>
              <Link
                to="/create"
                className={`${styles.link} ${isActive('/create') ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Создать заявку
              </Link>
              <Link
                to="/my-requests"
                className={`${styles.link} ${isActive('/my-requests') ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Мои заявки
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link
                    to="/admin/objects"
                    className={`${styles.link} ${isActive('/admin/objects') ? styles.active : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Категории
                  </Link>
                  <Link
                    to="/admin/requests"
                    className={`${styles.link} ${isActive('/admin/requests') ? styles.active : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Заявки (админ)
                  </Link>
                </>
              )}
              <span className={styles.userName}>{user.name}</span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${styles.link} ${isActive('/login') ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Войти
              </Link>
              <Link
                to="/register"
                className={`${styles.link} ${isActive('/register') ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
