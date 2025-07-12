import styles from "../main.module.css";

export const Pagination = ({ page, lastPage, setPage }) => (
  <div className={styles.paginationContainer}>
    {Array.from({ length: lastPage }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => setPage(i + 1)}
        className={`${styles.paginationButton} ${
          page === i + 1 ? styles.paginationButtonActive : ""
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>
);
