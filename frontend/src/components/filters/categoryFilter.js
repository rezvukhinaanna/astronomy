import styles from "./filters.module.css";

export const CategoryFilter = ({ category, setCategory, applyFilter }) => (
  <div className={styles.categoryFilterContainer}>
    <select
      value={category || ""}
      onChange={(e) => setCategory(e.target.value)}
      className={styles.categorySelect}
    >
      <option value="">All Categories</option>
      <option value="books">Books</option>
      <option value="telescopes">Telescopes</option>
      <option value="other">Other</option>
    </select>
    <button 
      onClick={() => {
        setCategory("");
        applyFilter();
      }} 
      className={styles.filterButton}
    >
      Reset
    </button>
  </div>
);