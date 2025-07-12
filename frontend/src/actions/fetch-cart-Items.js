import { request } from "../utils";

export const fetchCartItems = () => async (dispatch, getState) => {
  const { user } = getState();
  if (!user?.id) return;

  dispatch({ type: "FETCH_CART_START" });

  try {
    const response = await request(`/cart`, "GET");
    
    // Преобразуем объект в массив, если нужно
    const itemsArray = Array.isArray(response) 
      ? response 
      : Object.values(response).filter(item => item && item.id);
    
    console.log('Processed cart items:', itemsArray); // Добавьте этот лог
    
    dispatch({
      type: "SET_CART_ITEMS",
      payload: itemsArray
    });
  } catch (error) {
    console.error("Ошибка при загрузке корзины:", error);
    dispatch({ type: "FETCH_CART_ERROR", payload: error.message });
  }
};
