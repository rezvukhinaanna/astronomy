import styles from "./about.module.css";

export const About = () => {
  return (
    <div className={styles.about}>
      <h1 className={styles.heading}>About Us</h1>
      <p className={styles.subheading}>
        Welcome to our universe of knowledge and discovery. We connect curious
        minds with the cosmos through books, telescopes, and inspiration.
      </p>

      <div className={styles.contentSection}>
        <div className={styles.textBlock}>
          <p>
            Our store was born from a passion for astronomy and the written
            word. Whether you're just starting your journey among the stars or
            you're a seasoned stargazer, we offer hand-picked products that
            blend science, beauty, and imagination.
          </p>
          <p>
            From illustrated star maps to advanced telescopes, everything we
            offer is curated with love for those who look up and wonder. We
            believe that knowledge should inspire — and that wonder begins with
            a story.
          </p>
        </div>

        <div className={styles.imageBlock}>
          <img alt ='block pictur' src="https://images.unsplash.com/photo-1604446378430-76ea29a3b6c4?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
        </div>
        <p className={styles.quote}>
          “The cosmos is within us. We are made of star-stuff.” – Carl Sagan
        </p>
      </div>
    </div>
  );
};
