import {
  ConsumableItem,
  DurableTool,
  BouquetProduct,
  SaleTransaction,
  ExpenseItem,
  AppSettings,
} from '../types';

const STORAGE_KEYS = {
  CONSUMABLES: 'klovibe_consumables_v2',
  TOOLS: 'klovibe_tools_v2',
  PRODUCTS: 'klovibe_products_v2',
  TRANSACTIONS: 'klovibe_transactions_v2',
  EXPENSES: 'klovibe_expenses_v2',
  SETTINGS: 'klovibe_settings_v2',
};

export const INITIAL_SETTINGS: AppSettings = {
  storeName: 'KLOVIBE',
  slogan: 'Crafted Moments, Enduring Love',
  ownerName: 'Florist Studio',
  currency: 'IDR',
  initialCapital: 10000000, // Rp 10.000.000 modal awal disetor
  bgImageBase64: null,
  bgOpacity: 15,
  bgBlur: 2,
};

// Initial master inventory items for the florist workshop
export const INITIAL_CONSUMABLES: ConsumableItem[] = [
  {
    id: 'c-1',
    name: 'Mawar Semi-Holland Merah',
    category: 'bunga',
    unit: 'tangkai',
    costPerUnit: 8000,
    stock: 150,
    minStockAlert: 25,
  },
  {
    id: 'c-2',
    name: 'Mawar Avalance Putih Premium',
    category: 'bunga',
    unit: 'tangkai',
    costPerUnit: 8500,
    stock: 100,
    minStockAlert: 20,
  },
  {
    id: 'c-3',
    name: "Baby's Breath Impor Putih",
    category: 'bunga',
    unit: 'cabang',
    costPerUnit: 3500,
    stock: 80,
    minStockAlert: 15,
  },
  {
    id: 'c-4',
    name: 'Daun Eucalyptus Cinerea',
    category: 'bunga',
    unit: 'tangkai',
    costPerUnit: 2500,
    stock: 60,
    minStockAlert: 10,
  },
  {
    id: 'c-5',
    name: 'Kertas Wrapping Cellophane Gold Edge',
    category: 'wrapping',
    unit: 'lembar',
    costPerUnit: 4500,
    stock: 120,
    minStockAlert: 30,
  },
  {
    id: 'c-6',
    name: 'Kertas Korean Matte Nude Pink',
    category: 'wrapping',
    unit: 'lembar',
    costPerUnit: 5000,
    stock: 90,
    minStockAlert: 20,
  },
  {
    id: 'c-7',
    name: 'Pita Satin Premium Terracotta 2.5cm',
    category: 'pita',
    unit: 'meter',
    costPerUnit: 1200,
    stock: 150,
    minStockAlert: 30,
  },
  {
    id: 'c-8',
    name: 'Stiker Segel KLOVIBE Gold Foil',
    category: 'aksesoris',
    unit: 'pcs',
    costPerUnit: 600,
    stock: 300,
    minStockAlert: 50,
  },
  {
    id: 'c-9',
    name: 'Kartu Ucapan / Greeting Card Floral',
    category: 'aksesoris',
    unit: 'pcs',
    costPerUnit: 1500,
    stock: 120,
    minStockAlert: 20,
  },
  {
    id: 'c-10',
    name: 'Refill Isi Lem Tembak (Glue Sticks)',
    category: 'perekat',
    unit: 'batang',
    costPerUnit: 1000,
    stock: 100,
    minStockAlert: 15,
  },
];

// Durable tools with 0 usage cycles at start
export const INITIAL_TOOLS: DurableTool[] = [
  {
    id: 't-1',
    name: 'Gunting Bunga Khusus Florist (Oasis Carbon Steel)',
    purchasePrice: 120000,
    purchaseDate: '2026-01-10',
    estimatedUsageCount: 800, // Kapasitas 800 buket
    totalUsedCount: 0, // Mulai dari awal: 0 kali pakai
    notes: 'Penyusutan per buket: Rp 150',
  },
  {
    id: 't-2',
    name: 'Tembakan Lem Tembak Panas (Hot Glue Gun 40W)',
    purchasePrice: 75000,
    purchaseDate: '2026-01-12',
    estimatedUsageCount: 500, // Kapasitas 500 buket
    totalUsedCount: 0, // Mulai dari awal: 0 kali pakai
    notes: 'Penyusutan per buket: Rp 150',
  },
  {
    id: 't-3',
    name: 'Tang Pemotong Kawat & Tangkai Tebal',
    purchasePrice: 65000,
    purchaseDate: '2026-01-15',
    estimatedUsageCount: 1000, // Kapasitas 1000 buket
    totalUsedCount: 0, // Mulai dari awal: 0 kali pakai
    notes: 'Penyusutan per buket: Rp 65',
  },
  {
    id: 't-4',
    name: 'Dispenser Pita & Pemotong Tape Otomatis',
    purchasePrice: 50000,
    purchaseDate: '2026-01-20',
    estimatedUsageCount: 800, // Kapasitas 800 buket
    totalUsedCount: 0, // Mulai dari awal: 0 kali pakai
    notes: 'Penyusutan per buket: Rp 62.5',
  },
];

export const INITIAL_PRODUCTS: BouquetProduct[] = [
  {
    id: 'p-1',
    name: 'Scarlet Romance Hand Bouquet',
    sku: 'KB-SR-01',
    category: 'Hand Bouquet',
    description: 'Buket romantis 10 tangkai mawar merah Semi-Holland dipadukan baby breath dan wrapping gold-edge mewah.',
    sellingPrice: 285000,
    laborCostEstimate: 20000,
    consumables: [
      { consumableId: 'c-1', quantity: 10 },
      { consumableId: 'c-3', quantity: 3 },
      { consumableId: 'c-4', quantity: 2 },
      { consumableId: 'c-5', quantity: 3 },
      { consumableId: 'c-7', quantity: 1.5 },
      { consumableId: 'c-8', quantity: 1 },
      { consumableId: 'c-9', quantity: 1 },
      { consumableId: 'c-10', quantity: 1 },
    ],
    tools: [
      { toolId: 't-1', usageMultiplier: 1 },
      { toolId: 't-2', usageMultiplier: 1 },
      { toolId: 't-3', usageMultiplier: 1 },
      { toolId: 't-4', usageMultiplier: 1 },
    ],
  },
  {
    id: 'p-2',
    name: 'Pastel Dream Bloom Bouquet',
    sku: 'KB-PD-02',
    category: 'Hand Bouquet',
    description: 'Kombinasi mawar putih Avalance lembut, eucalyptus, dan wrapping Korean matte soft pink.',
    sellingPrice: 195000,
    laborCostEstimate: 15000,
    consumables: [
      { consumableId: 'c-2', quantity: 6 },
      { consumableId: 'c-3', quantity: 3 },
      { consumableId: 'c-4', quantity: 2 },
      { consumableId: 'c-6', quantity: 2 },
      { consumableId: 'c-7', quantity: 1.2 },
      { consumableId: 'c-8', quantity: 1 },
      { consumableId: 'c-9', quantity: 1 },
    ],
    tools: [
      { toolId: 't-1', usageMultiplier: 1 },
      { toolId: 't-2', usageMultiplier: 1 },
      { toolId: 't-4', usageMultiplier: 1 },
    ],
  },
  {
    id: 'p-3',
    name: 'Graduation Blossom Petite',
    sku: 'KB-GB-03',
    category: 'Graduation Bouquet',
    description: 'Buket wisuda ringkas dan elegan, 3 tangkai mawar, baby breath, dengan wrapping terracotta.',
    sellingPrice: 125000,
    laborCostEstimate: 10000,
    consumables: [
      { consumableId: 'c-1', quantity: 3 },
      { consumableId: 'c-3', quantity: 2 },
      { consumableId: 'c-5', quantity: 2 },
      { consumableId: 'c-7', quantity: 1.0 },
      { consumableId: 'c-8', quantity: 1 },
      { consumableId: 'c-9', quantity: 1 },
    ],
    tools: [
      { toolId: 't-1', usageMultiplier: 1 },
      { toolId: 't-4', usageMultiplier: 1 },
    ],
  },
];

// ZERO TRANSACTIONS: Starting completely fresh as requested by user
export const INITIAL_TRANSACTIONS: SaleTransaction[] = [];

// ZERO EXPENSES: Starting fresh
export const INITIAL_EXPENSES: ExpenseItem[] = [];

// Helper functions for localStorage
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load ${key} from localStorage`, err);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage`, err);
  }
}

export function getAppStorage() {
  // If old v1 keys exist in localStorage, remove old mock transactions so user starts with 0
  try {
    if (localStorage.getItem('klovibe_transactions_v1')) {
      localStorage.removeItem('klovibe_transactions_v1');
      localStorage.removeItem('klovibe_expenses_v1');
    }
  } catch (e) {
    // Ignore error
  }

  return {
    consumables: loadFromStorage<ConsumableItem[]>(STORAGE_KEYS.CONSUMABLES, INITIAL_CONSUMABLES),
    tools: loadFromStorage<DurableTool[]>(STORAGE_KEYS.TOOLS, INITIAL_TOOLS),
    products: loadFromStorage<BouquetProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS),
    transactions: loadFromStorage<SaleTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS),
    expenses: loadFromStorage<ExpenseItem[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES),
    settings: loadFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS),
  };
}

export function resetAppStorage(): void {
  localStorage.setItem(STORAGE_KEYS.CONSUMABLES, JSON.stringify(INITIAL_CONSUMABLES));
  localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(INITIAL_TOOLS));
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
}

export { STORAGE_KEYS };
