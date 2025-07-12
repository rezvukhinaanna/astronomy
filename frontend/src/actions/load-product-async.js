import { request } from "../utils/request";
import { setProductData } from "./set-product-data";

export const loadProductAsync = (productId) => (dispatch) =>
  request(`/products/${productId}`).then((productData) => {
    if (productData.product) {
      dispatch(setProductData(productData.product));
    }
    return productData;
  });
