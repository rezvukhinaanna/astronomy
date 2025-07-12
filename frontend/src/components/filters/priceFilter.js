import styles from "./filters.module.css";

export const PriceFilter = ({ minPrice, maxPrice, setMinPrice, setMaxPrice, applyFilter }) => (
  <div className={styles.priceFilterContainer}>
    <input
      type="number"
      placeholder="Min price"
      value={minPrice || ""}
      onChange={(e) => setMinPrice(e.target.value)}
      className={styles.priceInput}
    />
    <span className={styles.priceSeparator}>-</span>
    <input
      type="number"
      placeholder="Max price"
      value={maxPrice || ""}
      onChange={(e) => setMaxPrice(e.target.value)}
      className={styles.priceInput}
    />
    {/* <button onClick={applyFilter} className={styles.filterButton}>
      Apply
    </button> */}
    <button 
  onClick={() => {
    setMinPrice("");
    setMaxPrice("");
    applyFilter();
  }} 
  className={styles.filterButton}
>
  Reset
</button>
  </div>
);