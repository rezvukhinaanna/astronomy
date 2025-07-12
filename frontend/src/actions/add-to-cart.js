import { request } from "../utils";

export const addToCart = (productId, quantity = 1) => async (dispatch, getState) => {
  const { user } = getState();
  if (!user?.id) return;
console.log('productId',productId, quantity)
  try {
    // Убедитесь, что отправляете только ID товара
    await request("/cart", "POST", { 
      productId: typeof productId === 'object' ? productId.id : productId,
      quantity 
    });
    console.log('productId',productId, quantity)
    dispatch({ 
      type: "ADD_TO_CART", 
      payload: { 
        id: typeof productId === 'object' ? productId.id : productId,
        quantity 
      } 
    });
  } catch (error) {
    console.error("Ошибка при добавлении в корзину:", error);
  }
};