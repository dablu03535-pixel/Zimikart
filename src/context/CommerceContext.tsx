import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { CartLine } from '@/types/models';

/**
 * Cart + wishlist live in this browser's localStorage only (no server, no account).
 * Prices here are snapshots for display; a real backend must re-price at checkout.
 */
const CART_KEY = 'avani.cart.v1';
const WISH_KEY = 'avani.wishlist.v1';

interface State { cart: CartLine[]; wishlist: string[] }
type Action =
  | { type: 'add'; line: CartLine }
  | { type: 'qty'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }
  | { type: 'wish'; id: string };

function load<T>(key: string, guard: (v: unknown) => v is T, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return guard(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

const isCart = (v: unknown): v is CartLine[] =>
  Array.isArray(v) && v.every((l) => typeof l === 'object' && l !== null && typeof (l as CartLine).key === 'string' && typeof (l as CartLine).quantity === 'number');
const isIds = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const existing = state.cart.find((l) => l.key === action.line.key);
      if (existing) {
        return { ...state, cart: state.cart.map((l) => (l.key === existing.key ? { ...l, quantity: Math.min(l.maxQuantity, l.quantity + action.line.quantity) } : l)) };
      }
      return { ...state, cart: [...state.cart, action.line] };
    }
    case 'qty':
      return { ...state, cart: state.cart.map((l) => (l.key === action.key ? { ...l, quantity: Math.max(1, Math.min(l.maxQuantity, action.quantity)) } : l)) };
    case 'remove':
      return { ...state, cart: state.cart.filter((l) => l.key !== action.key) };
    case 'clear':
      return { ...state, cart: [] };
    case 'wish':
      return { ...state, wishlist: state.wishlist.includes(action.id) ? state.wishlist.filter((i) => i !== action.id) : [...state.wishlist, action.id] };
  }
}

interface CommerceValue {
  cart: CartLine[];
  wishlist: string[];
  cartCount: number;
  subtotal: number;
  mrpTotal: number;
  addToCart: (line: CartLine) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWished: (productId: string) => boolean;
}

const Ctx = createContext<CommerceValue | null>(null);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, (): State => ({
    cart: load(CART_KEY, isCart, []),
    wishlist: load(WISH_KEY, isIds, []),
  }));

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
      window.localStorage.setItem(WISH_KEY, JSON.stringify(state.wishlist));
    } catch {
      /* storage unavailable (private mode / quota): keep working in memory */
    }
  }, [state]);

  const addToCart = useCallback((line: CartLine) => dispatch({ type: 'add', line }), []);
  const setQuantity = useCallback((key: string, quantity: number) => dispatch({ type: 'qty', key, quantity }), []);
  const removeLine = useCallback((key: string) => dispatch({ type: 'remove', key }), []);
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), []);
  const toggleWishlist = useCallback((id: string) => dispatch({ type: 'wish', id }), []);

  const value = useMemo<CommerceValue>(
    () => ({
      cart: state.cart,
      wishlist: state.wishlist,
      cartCount: state.cart.reduce((n, l) => n + l.quantity, 0),
      subtotal: state.cart.reduce((n, l) => n + l.unitPrice * l.quantity, 0),
      mrpTotal: state.cart.reduce((n, l) => n + l.mrp * l.quantity, 0),
      addToCart, setQuantity, removeLine, clearCart, toggleWishlist,
      isWished: (id) => state.wishlist.includes(id),
    }),
    [state, addToCart, setQuantity, removeLine, clearCart, toggleWishlist],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCommerce(): CommerceValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCommerce must be used inside <CommerceProvider>');
  return v;
}
