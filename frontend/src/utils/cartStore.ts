import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StickerType = 
  | 'die-cut'
  | 'kiss-cut'
  | 'circular'
  | 'oval'
  | 'square'
  | 'rectangle'
  | 'sheet';

export type StickerMaterial = 'gloss' | 'matte' | 'holographic';

export interface CartItem {
  id: string;
  imageId: string;
  previewUrl: string;
  rotation: number;
  borderWidth: number;
  borderColor: string;
  stickerType: StickerType;
  material: StickerMaterial;
  quantity: number;
  price: number;
  createdAt: number;
  text?: string;
  textProps?: {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, updates: Partial<Omit<CartItem, 'id' | 'createdAt'>>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Calculate price based on sticker type, material, and quantity
export const calculatePrice = (type: StickerType, material: StickerMaterial, quantity: number): number => {
  // Base prices for different sticker types
  const basePrice: Record<StickerType, number> = {
    'die-cut': 3.5,
    'kiss-cut': 3.5,
    'circular': 3.0,
    'oval': 3.0,
    'square': 2.5,
    'rectangle': 2.5,
    'sheet': 5.0
  };

  // Material multipliers
  const materialMultiplier: Record<StickerMaterial, number> = {
    'gloss': 1.0,
    'matte': 1.1,
    'holographic': 1.5
  };

  // Quantity discount tiers
  let quantityMultiplier = 1.0;
  if (quantity >= 50) quantityMultiplier = 0.8;
  else if (quantity >= 20) quantityMultiplier = 0.9;
  else if (quantity >= 10) quantityMultiplier = 0.95;

  // Calculate final price
  const unitPrice = basePrice[type] * materialMultiplier[material];
  const totalPrice = unitPrice * quantity * quantityMultiplier;
  
  return parseFloat(totalPrice.toFixed(2));
};

export const useCartStore = create<CartStore>(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
          items: [...state.items, { ...item, id, createdAt: Date.now() }]
        }));
      },
      
      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          )
        }));
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const total = get().items.reduce((sum, item) => sum + item.price, 0);
        return parseFloat(total.toFixed(2));
      }
    }),
    {
      name: 'sticker-craft-cart', // Local storage key
    }
  )
);
