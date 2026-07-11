import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut, FiGrid } from 'react-icons/fi';
import { useAuthStore } from '../../../stores/auth.store';
import { useCartStore } from '../../../stores/cart.store';
import { useThemeStore } from '../../../stores/theme.store';
import { UserRole } from '../../../types';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const itemCount = useCartStore((s) => s.getItemCount());
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navbar__container}>
        {/* Brand */}
        <Link to="/" className={styles.navbar__brand}>
          <span className={styles['navbar__brand-icon']}>🍽️</span>
          <span>OrderSystem</span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.navbar__nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navbar__link} ${isActive ? styles['navbar__link--active'] : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/restaurants"
            className={({ isActive }) =>
              `${styles.navbar__link} ${isActive ? styles['navbar__link--active'] : ''}`
            }
          >
            Restaurants
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `${styles.navbar__link} ${isActive ? styles['navbar__link--active'] : ''}`
              }
            >
              My Orders
            </NavLink>
          )}
          {isAuthenticated && user?.role === UserRole.RESTAURANT_OWNER && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${styles.navbar__link} ${isActive ? styles['navbar__link--active'] : ''}`
              }
            >
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Actions */}
        <div className={styles.navbar__actions}>
          {/* Theme Toggle */}
          <button
            className={styles['navbar__theme-btn']}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>

          {/* Cart */}
          {isAuthenticated && user?.role === UserRole.CUSTOMER && (
            <Link to="/cart" className={styles['navbar__cart-btn']}>
              <FiShoppingCart />
              {itemCount > 0 && (
                <span className={styles['navbar__cart-badge']}>{itemCount}</span>
              )}
            </Link>
          )}

          {/* Auth / User Menu */}
          {isAuthenticated && user ? (
            <div className={styles['navbar__user-menu']} ref={dropdownRef}>
              <button
                className={styles['navbar__user-btn']}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className={styles['navbar__user-avatar']}>
                  {getInitials(user.name)}
                </div>
                <span>{user.name}</span>
              </button>

              {showDropdown && (
                <div className={styles.navbar__dropdown}>
                  <Link
                    to="/profile"
                    className={styles['navbar__dropdown-item']}
                    onClick={() => setShowDropdown(false)}
                  >
                    <FiUser /> Profile
                  </Link>
                  {user.role === UserRole.RESTAURANT_OWNER && (
                    <Link
                      to="/dashboard"
                      className={styles['navbar__dropdown-item']}
                      onClick={() => setShowDropdown(false)}
                    >
                      <FiGrid /> Dashboard
                    </Link>
                  )}
                  <button
                    className={`${styles['navbar__dropdown-item']} ${styles['navbar__dropdown-item--danger']}`}
                    onClick={handleLogout}
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/auth/login"
                className={`${styles['navbar__auth-btn']} ${styles['navbar__auth-btn--login']}`}
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className={`${styles['navbar__auth-btn']} ${styles['navbar__auth-btn--signup']}`}
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile Toggle */}
          <button
            className={styles['navbar__mobile-toggle']}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}
