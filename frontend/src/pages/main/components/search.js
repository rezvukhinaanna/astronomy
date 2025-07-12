import { Search as SearchIcon } from 'lucide-react';
import styles from '../main.module.css';

export const Search = ({ searchPhrase, onChange }) => (
  <div className={styles.searchBox}>
    <SearchIcon size={18} className={styles.searchIcon} />
    <input
      type="text"
      placeholder="Search products..."
      value={searchPhrase}
      onChange={onChange}
    />
  </div>
);
