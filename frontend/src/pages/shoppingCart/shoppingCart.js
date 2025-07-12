import styles from "./shoppingCart.module.css";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCartItems } from "../../actions";
import { updateCartItem, removeCartItem } from "../../actions/cart-actions";
import { Loader } from "../../components"; // Импорт компонента Loader

export const ShoppingCart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => ({
    items: state.cart.items || [],
    loading: state.cart.loading,
    error: state.cart.error
  }));
  
  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const [isProcessing, setIsProcessing] = useState(false); // Для операций обновления/удаления

  if (loading) return <Loader />; // Заменяем текстовый лоадер на компонент Loader
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    setIsProcessing(true);
    try {
      await dispatch(updateCartItem(id, newQuantity));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async (id) => {
    setIsProcessing(true);
    try {
      await dispatch(removeCartItem(id));
    } finally {
      setIsProcessing(false);
    }
  };

  const total = items
    .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
    .toFixed(2);

  return (
    <div className={styles.container}>
      {isProcessing && <Loader />} {/* Лоадер для операций обновления/удаления */}
      
      <h1 className={styles.title}>Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is empty</p>
          <button
            className={styles.continueShopping}
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th className={styles.leftAlign}>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className={styles.productCell}>
                    <div>
                      <div className={styles.productName}>{item.name}</div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className={styles.removeButton}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Remove"}
                      </button>
                    </div>
                  </td>
                  <td className={styles.price}>
                    ${item.price ? item.price.toFixed(2) : '0.00'}
                  </td>
                  <td>
                    <div className={styles.quantityControl}>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className={styles.quantityBtn}
                        disabled={item.quantity <= 1 || isProcessing}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className={styles.quantityBtn}
                        disabled={isProcessing}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className={styles.price}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>
            <div className={styles.summaryText}>
              <span>Total amount: </span>
              <span>${total}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};