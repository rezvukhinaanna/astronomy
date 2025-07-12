const initialState = {
  items: [],
  loading: false,
  error: null,
  optimisticUpdates: {}
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    // Обработка загрузки корзины
    case "FETCH_CART_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "SET_CART_ITEMS":
      // Убедитесь, что payload - массив и содержит нужные поля
      const processedItems = Array.isArray(action.payload)
        ? action.payload
            .map(item => ({
              id: item.id || item._id?.toString(),
              name: item.name,
              price: item.price || 0,
              imageUrl: item.imageUrl,
              quantity: item.quantity || 1
            }))
            .filter(item => item.id) // Фильтруем элементы без ID
        : [];
      
      console.log('Processed items in reducer:', processedItems); // Логируем
      
      return {
        ...state,
        items: processedItems,
        loading: false,
        error: null
      };

    case "FETCH_CART_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Добавление товара (оптимистичное обновление)
    case "ADD_TO_CART":
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        console.log(existingItem)
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };

    // Удаление товара
    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    // Изменение количества
    case "CHANGE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

// Оптимистичное обновление quantity
    case "UPDATE_CART_ITEM_OPTIMISTIC":
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [action.payload.productId]: 'pending'
        }
      };
    
    // Подтверждение обновления
    case "UPDATE_CART_ITEM_SUCCESS":
      return {
        ...state,
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [action.payload.productId]: 'confirmed'
        }
      };
    
    // Оптимистичное удаление
    case "REMOVE_CART_ITEM_OPTIMISTIC":
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [action.payload]: 'pending'
        }
      };

    default:
      return state;
  }
};
