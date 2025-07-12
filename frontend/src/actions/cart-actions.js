import { request } from "../utils";

// cart-actions.js
export const updateCartItem = (productId, quantity) => async (dispatch, getState) => {
  const { user } = getState();
  if (!user?.id) return;

  try {
    // Оптимистичное обновление
    dispatch({ 
      type: "UPDATE_CART_ITEM_OPTIMISTIC",
      payload: { productId, quantity }
    });
    
    await request(`/cart/${productId}`, "PATCH", { quantity });
    
    // Подтверждение от сервера
    dispatch({ 
      type: "UPDATE_CART_ITEM_SUCCESS",
      payload: { productId, quantity }
    });
  } catch (error) {
    // Откат изменений при ошибке
    dispatch({ 
      type: "UPDATE_CART_ITEM_FAILURE",
      payload: { productId, error }
    });
  }
};

// cart-actions.js
export const removeCartItem = (productId) => async (dispatch, getState) => {
  const { user } = getState();
  if (!user?.id) return;

  try {
    // Оптимистичное удаление
    dispatch({ type: "REMOVE_CART_ITEM_OPTIMISTIC", payload: productId });
    
    await request(`/cart/${productId}`, "DELETE");
    
    // Подтверждение от сервера
    dispatch({ type: "REMOVE_CART_ITEM_SUCCESS", payload: productId });
  } catch (error) {
    // Откат изменений
    dispatch({ 
      type: "REMOVE_CART_ITEM_FAILURE", 
      payload: { productId, error } 
    });
  }
};