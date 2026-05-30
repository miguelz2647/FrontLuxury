import React, { createContext, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'brutal_cart';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { items: [] };
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, size, qty = 1, variacionId = null } = action;
      const key = `${product.id}__${size}`;
      const existing = state.items.find((i) => i.key === key);
      let items;
      if (existing) {
        items = state.items.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      } else {
        items = [
          ...state.items,
          {
            key,
            variacionId,   // Id de ProductoVariacion — usado en PaymentForm para Id_Producto_Variacion
            id:    product.id,
            name:  product.name,
            brand: product.brand,
            price: product.price,
            image: product.image,
            size,
            qty,
          },
        ];
      }
      return { ...state, items };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.key !== action.key) };
    case 'SET_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.key === action.key ? { ...i, qty: Math.max(1, action.qty) } : i
        ),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = {
    items:      state.items,
    count:      state.items.reduce((acc, i) => acc + i.qty, 0),
    subtotal:   state.items.reduce((acc, i) => acc + i.qty * i.price, 0),
    // variacionId es opcional — no rompe nada si no se pasa
    addItem:    (product, size, qty = 1, variacionId = null) =>
                  dispatch({ type: 'ADD', product, size, qty, variacionId }),
    removeItem: (key) => dispatch({ type: 'REMOVE', key }),
    setQty:     (key, qty) => dispatch({ type: 'SET_QTY', key, qty }),
    clear:      () => dispatch({ type: 'CLEAR' }),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
