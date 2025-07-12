import styles from './footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3>My Website</h3>
          <p>Immerse yourself in the world of astronomy.</p>
        </div>
        <div className={styles.section}>
          <h4>Contacts</h4>
          <p>Email: info@astrowebsite.com</p>
          <p>Phone: +7 (999) 123-45-67</p>
        </div>
      </div>
      <div className={styles.bottom}>
        © {new Date().getFullYear()} Astronomy Website. All rights reserved.
      </div>
    </footer>
  );
};
