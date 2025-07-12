import { Link } from "react-router";
import styles from "../main.module.css";

export const ProductCard = ({ id, name, price, imageUrl }) => {
  return (
    <div className={styles.card}>
      {imageUrl && <img src={imageUrl} alt={name} />}
      <h3>{name}</h3>
      <p className={styles.price}>${price}</p>
      <Link to={`/product/${id}`} className={styles.buyButton}>
        Buy
      </Link>
    </div>
  );
};
