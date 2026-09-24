export type ConsumableCategory = 'bunga' | 'wrapping' | 'pita' | 'aksesoris' | 'perekat' | 'kemasan' | 'lainnya';

export interface ConsumableItem {
  id: string;
  name: string;
  category: ConsumableCategory;
  unit: string; // tangkai, lembar, meter, pcs, roll, gram
  costPerUnit: number; // Harga beli per unit
  stock: number; // Sisa stok
  minStockAlert: number;
}

export interface DurableTool {
  id: string;
  name: string;
  purchasePrice: number; // Harga perolehan
  purchaseDate: string;
  estimatedUsageCount: number; // Estimasi total unit bouquet sampai rusak/ganti (misal 500, 1000)
  totalUsedCount: number; // Berapa kali sudah dipakai dalam produksi
  // Depresiasi per unit = purchasePrice / estimatedUsageCount
  notes?: string;
}

export interface RecipeConsumable {
  consumableId: string;
  quantity: number; // Jumlah yang dipakai per 1 bouquet
}

export interface RecipeTool {
  toolId: string;
  usageMultiplier: number; // Default 1 unit pemakaian depresiasi
}

export interface BouquetProduct {
  id: string;
  name: string;
  sku: string;
  category: string; // Hand Bouquet, Bloom Box, Money Bouquet, Single Rose, Graduation, Wedding
  description?: string;
  sellingPrice: number; // Harga Jual yang ditetapkan
  consumables: RecipeConsumable[];
  tools: RecipeTool[];
  laborCostEstimate: number; // Biaya jasa perakitan florist opsional
}

export type PaymentMethod = 'Transfer Bank' | 'QRIS' | 'Tunai' | 'Shopee/Tokopedia' | 'Kartu Debit';
export type PaymentStatus = 'Lunas' | 'DP (Sebagian)' | 'Belum Lunas';

export interface SaleTransaction {
  id: string;
  invoiceNumber: string;
  date: string; // YYYY-MM-DD
  customerName: string;
  customerPhone?: string;
  productId: string;
  productName: string;
  quantity: number;
  sellingPrice: number;
  totalRevenue: number;
  unitHpp: number;
  totalHpp: number;
  grossProfit: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
}

export type ExpenseCategory = 
  | 'Sewa Tempat / Kios'
  | 'Listrik & Utilitas'
  | 'Gaji / Upah Asisten'
  | 'Pemasaran & Iklan'
  | 'Transportasi & Pengantaran'
  | 'Packaging & Plastik Pelindung'
  | 'Perawatan & Perlengkapan Toko'
  | 'Lain-lain';

export interface ExpenseItem {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface AppSettings {
  storeName: string;
  slogan: string;
  ownerName: string;
  currency: string;
  initialCapital: number; // Modal Awal Disetor (Equity awal)
  bgImageBase64: string | null;
  bgOpacity: number; // 0 to 100
  bgBlur: number; // 0 to 20 px
}
