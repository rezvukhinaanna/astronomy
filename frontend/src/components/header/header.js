import styles from "./header.module.css";
import { FaUserAlt, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ROLE } from "../../constants";
import { setUser } from "../../actions";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userRole = useSelector((state) => state.user.roleId);
  const userName = useSelector((state) => state.user.name);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Функция для закрытия меню
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    dispatch(setUser({ roleId: ROLE.GUEST, name: "", email: "" }));
    sessionStorage.removeItem("userData");
    navigate("/login");
    closeMenu(); // Закрываем меню при выходе
  };

  return (
    <header className={styles.header}>
      <Link className={styles.logoSection} to="/" onClick={closeMenu}>
        <i className="fa fa-moon-o" aria-hidden="true"></i>
        <span className={styles.logoText}>Astronomy</span>
      </Link>
      <div className={styles.leftSide}>
        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ""}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          {userRole !== ROLE.GUEST && <Link to="/cart" onClick={closeMenu}>Cart</Link>}
          {userRole === ROLE.ADMIN && <Link to="/product" onClick={closeMenu}>Create product</Link>}
        </nav>
        <div className={styles.actions}>
          {userRole === ROLE.GUEST ? (
            <div className={styles.userBox}>
              <Link to="/register" className={styles.signup} onClick={closeMenu}>
                Sign Up
              </Link>
              <button className={styles.iconButton}>
                <Link to="/login" className={styles.logoSection} onClick={closeMenu}>
                  <FaUserAlt />
                </Link>
              </button>
            </div>
          ) : (
            <div className={styles.userBox}>
              <span className={styles.userName}>{userName}</span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Выйти
              </button>
            </div>
          )}
          <button className={styles.iconButton} onClick={toggleMenu}>
            <FaBars />
          </button>
        </div>
      </div>
    </header>
  );
};
