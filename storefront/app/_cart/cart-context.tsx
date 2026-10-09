"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { DEFAULT_CURRENCY_CODE } from "../../shopify/constants";
import { Cart, CartItem, Product, ProductVariant } from "../../shopify/types";

export const CART_STORAGE_KEY = "photon_shopify_cart";

type UpdateType = "plus" | "minus" | "delete";

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { merchandiseId: string; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: { variant: ProductVariant; product: Product };
    }
  | {
      type: "SET_CART";
      payload: Cart;
    };

type CartContextType = {
  cart: Cart | undefined;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateCartItem(
  item: CartItem,
  updateType: UpdateType,
): CartItem | null {
  if (updateType === "delete") return null;

  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString(),
  );

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product,
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      variantImage: variant.image,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
}

function updateCartTotals(
  lines: CartItem[],
): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0,
  );
  const currencyCode =
    lines[0]?.cost.totalAmount.currencyCode ?? DEFAULT_CURRENCY_CODE;

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function createEmptyCart(): Cart {
  return {
    id: CART_STORAGE_KEY,
    checkoutUrl: `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/cart/`,
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: DEFAULT_CURRENCY_CODE },
      totalAmount: { amount: "0", currencyCode: DEFAULT_CURRENCY_CODE },
      totalTaxAmount: { amount: "0", currencyCode: DEFAULT_CURRENCY_CODE },
    },
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state ?? createEmptyCart();

  switch (action.type) {
    case "SET_CART": {
      return action.payload;
    }
    case "ADD_ITEM": {
      const { variant, product } = action.payload;
      const existingItem = currentCart.lines.find(
        (item) => item.merchandise.id === variant.id,
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product,
      );

      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item,
          )
        : [...currentCart.lines, updatedItem];
      const updatedCart = {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };

      return updatedCart;
    }
    case "UPDATE_ITEM": {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) =>
          item.merchandise.id === merchandiseId
            ? updateCartItem(item, updateType)
            : item,
        )
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        return {
          ...currentCart,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentCart.cost,
            totalAmount: { ...currentCart.cost.totalAmount, amount: "0" },
          },
        };
      }
      const updatedCart = {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };

      return updatedCart;
    }
    default: {
      return currentCart;
    }
  }
}

function loadCartFromStorage(): Cart | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load cart from storage:", error);
  }
  return undefined;
}

/**
 * Cart state lives in the browser (localStorage) until checkout.
 * Starts empty on the server and first render, then loads the saved cart
 * after mount so hydration matches.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, createEmptyCart);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadCartFromStorage();
    if (stored) dispatch({ type: "SET_CART", payload: stored });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage unavailable (private mode etc.) - cart still works this visit
    }
  }, [cart, hydrated]);

  const value = useMemo(
    () => ({
      cart,
      updateCartItem: (merchandiseId: string, updateType: UpdateType) =>
        dispatch({
          type: "UPDATE_ITEM",
          payload: { merchandiseId, updateType },
        }),
      addCartItem: (variant: ProductVariant, product: Product) =>
        dispatch({ type: "ADD_ITEM", payload: { variant, product } }),
    }),
    [cart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
