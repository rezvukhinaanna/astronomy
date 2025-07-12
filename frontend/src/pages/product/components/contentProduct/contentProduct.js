import { useState } from "react";
import styles from "./contentProduct.module.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  CLOSE_MODAL,
  openModal,
  removeProductAsync,
} from "../../../../actions";
import { Modal } from "../../../../components";
import { ROLE } from "../../../../constants";
import { toast } from "react-toastify";

export const ContentProduct = ({
  product: {
    id,
    imageUrl,
    category,
    name,
    author,
    price,
    discount,
    material,
    year,
    pages,
    stars,
    reviews,
    details,
    description,
  },
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);
  const modal = useSelector((state) => state.app.modal);
  const userRole = useSelector((state) => state.user.roleId);

  const onProductRemove = (id) => {
    dispatch(
      openModal({
        text: "Are you sure you want to delete the product?",
        onConfirm: () => {
          dispatch(removeProductAsync(id)).then(() => {
            navigate("/");
          });
          dispatch(CLOSE_MODAL);
        },
        onCancel: () => dispatch(CLOSE_MODAL),
      })
    );
  };

  const handleAddToCart = () => {
    if (userRole === ROLE.GUEST) {
      toast.info(
        "Пожалуйста, зарегистрируйтесь, чтобы добавить товар в корзину",
        {
          theme: "colored",
          style: {
            borderLeft: "6px solid purple",
            background: "#f0f0ff",
            color: "#3a006a",
            width: "600px",
          },
        }
      );
      return;
    }

    dispatch(addToCart({ id, name, price, imageUrl }));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className={styles.product}>
      {modal.isOpen && (
        <Modal
          text={modal.text}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      )}
      <div className={styles.container}>
        <div className={styles.leftSection}>
          {userRole === ROLE.ADMIN && (
            <div className={styles.editItem}>
              <button className={styles.editIcon}>
                <i
                  class="fa fa-pencil-square-o"
                  aria-hidden="true"
                  onClick={() => navigate(`/product/${id}/edit`)}
                >
                  {" "}
                  Edit
                </i>
              </button>
              <button className={styles.editIcon}>
                <i
                  class="fa fa-times"
                  aria-hidden="true"
                  onClick={() => onProductRemove(id)}
                >
                  {" "}
                  Delete
                </i>
              </button>
            </div>
          )}

          <div className={styles.imageWrapper}>
            <img
              src={imageUrl}
              alt="pictur of product"
              className={styles.bookImage}
              loading="lazy"
            />
            <div className={styles.imageOverlay} />
          </div>

          <div className={styles.bookInfo}>
            <h2 className={styles.bookTitle}>{name}</h2>
            <p className={styles.author}>{author}</p>
            <div className={styles.priceWrapper}>
              <span className={styles.price}>${price}</span>
              <span className={styles.discount}>${discount}</span>
            </div>
            <button
              className={`${styles.button} ${isAdded ? styles.added : ""}`}
              onClick={handleAddToCart}
            >
              {isAdded ? "Added to cart!" : "Add to cart"}
            </button>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.quickDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>🏷️</span>
              <span>{category}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>📖</span>
              <span>{material}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>📅</span>
              <span>{year}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>📚</span>
              <span>{pages} pages</span>
            </div>
          </div>

          <div className={styles.descriptionCard}>
            <h3 className={styles.sectionTitle}>About the Book</h3>
            <p className={styles.description}>{description}</p>
          </div>

          <div className={styles.detailsCard}>
            <h3 className={styles.sectionTitle}>Details & Features</h3>
            <ul className={styles.featuresList}>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                {details}
              </li>
              {/* <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                Companion to the Emmy and Peabody Award-winning TV series
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                Translated into over 20 languages worldwide
              </li> */}
            </ul>
          </div>

          <div className={styles.ratingSection}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={styles.star}>
                  {i < 4 ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className={styles.ratingText}>
              {stars}/5 ({reviews} reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
