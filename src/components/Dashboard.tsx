import React, { useMemo } from 'react';
import {
  TrendingUp,
  Receipt,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  PlusCircle,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  FinancialSummary,
  formatCurrency,
  formatNumber,
} from '../utils/accounting';
import {
  SaleTransaction,
  ConsumableItem,
  DurableTool,
  BouquetProduct,
  AppSettings,
} from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardProps {
  summary: FinancialSummary;
  transactions: SaleTransaction[];
  consumables: ConsumableItem[];
  tools: DurableTool[];
  products: BouquetProduct[];
  settings: AppSettings;
  onNavigate: (tab: string) => void;
  onOpenNewTransaction: () => void;
  onOpenNewProduct: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  summary,
  transactions,
  consumables,
  tools,
  products,
  settings,
  onNavigate,
  onOpenNewTransaction,
  onOpenNewProduct,
}) => {
  // Low stock alert items
  const lowStockItems = useMemo(() => {
    return consumables.filter((c) => c.stock <= c.minStockAlert);
  }, [consumables]);

  // Product sales performance
  const productPerformance = useMemo(() => {
    const map = new Map<string, { name: string; units: number; revenue: number; profit: number }>();
    for (const trx of transactions) {
      const existing = map.get(trx.productId) || {
        name: trx.productName,
        units: 0,
        revenue: 0,
        profit: 0,
      };
      existing.units += trx.quantity;
      existing.revenue += trx.totalRevenue;
      existing.profit += trx.grossProfit;
      map.set(trx.productId, existing);
    }
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [transactions]);

  // Chart 1: Revenue & Profit Trend
  const trendData = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const labels = sorted.map((t) => {
      const d = new Date(t.date);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    });
    const revenues = sorted.map((t) => t.totalRevenue);
    const profits = sorted.map((t) => t.grossProfit);

    return {
      labels: labels.length > 0 ? labels : ['Belum Ada Data'],
      datasets: [
        {
          label: 'Omset Penjualan (IDR)',
          data: revenues.length > 0 ? revenues : [0],
          borderColor: '#c07a50',
          backgroundColor: 'rgba(192, 122, 80, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
        },
        {
          label: 'Laba Kotor (IDR)',
          data: profits.length > 0 ? profits : [0],
          borderColor: '#4a5d4e',
          backgroundColor: 'rgba(74, 93, 78, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
        },
      ],
    };
  }, [transactions]);

  // Chart 2: Cost & Profit Breakdown Donut
  const donutData = useMemo(() => {
    const consHpp = summary.consumableHppTotal;
    const toolsHpp = summary.toolDepreciationHppTotal;
    const opex = summary.totalExpenses;
    const profit = Math.max(0, summary.netProfit);

    return {
      labels: ['Bahan Habis Pakai', 'Penyusutan Alat', 'Beban OpEx', 'Laba Bersih'],
      datasets: [
        {
          data: [consHpp, toolsHpp, opex, profit],
          backgroundColor: ['#dfa380', '#c07a50', '#a37f68', '#4a5d4e'],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  }, [summary]);

  // Chart 3: Best Seller Products
  const bestSellerData = useMemo(() => {
    const top = productPerformance.slice(0, 5);
    return {
      labels: top.map((p) => p.name.length > 18 ? p.name.slice(0, 18) + '...' : p.name),
      datasets: [
        {
          label: 'Unit Terjual',
          data: top.map((p) => p.units),
          backgroundColor: '#4a5d4e',
          borderRadius: 6,
        },
      ],
    };
  }, [productPerformance]);

  return (
    <div className="space-y-6">
      {/* Brand Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#c07a50]/15 via-[#f4efe6] to-[#4a5d4e]/15 border border-[#c07a50]/25 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#4a5d4e]">
                Ringkasan Bisnis & Real-Time Dashboard
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 text-[#c07a50] font-medium border border-[#c07a50]/20">
                Studio Florist
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-brand tracking-tight text-[#2c332d]">
              {settings.storeName} Florist Financial Hub
            </h1>
            <p className="text-xs md:text-sm text-neutral-600 font-serif italic mt-0.5">
              "{settings.slogan}" — Manajemen HPP presisi, pembukuan rapi, dan analisa profit berkelanjutan.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenNewTransaction}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#c07a50] hover:bg-[#a8653e] rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Catat Penjualan</span>
            </button>
            <button
              onClick={onOpenNewProduct}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#4a5d4e] bg-white hover:bg-neutral-50 border border-[#4a5d4e]/30 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Layers className="w-4 h-4" />
              <span>+ Buat Resep Buket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Omset */}
        <div className="bg-white/85 backdrop-blur-xs p-4 rounded-xl border border-[#c07a50]/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total Omset</span>
            <div className="p-1.5 rounded-lg bg-[#c07a50]/10 text-[#c07a50]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-[#c07a50] tabular-nums mt-2">
            {formatCurrency(summary.totalRevenue)}
          </p>
          <div className="flex items-center justify-between mt-1 text-[11px] text-neutral-500">
            <span>{summary.totalTransactions} Transaksi</span>
            <span className="text-[#4a5d4e] font-semibold">{summary.totalUnitsSold} Buket</span>
          </div>
        </div>

        {/* Total HPP Presisi */}
        <div className="bg-white/85 backdrop-blur-xs p-4 rounded-xl border border-[#c07a50]/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total HPP (COGS)</span>
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-amber-800 tabular-nums mt-2">
            {formatCurrency(summary.totalHpp)}
          </p>
          <div className="flex items-center justify-between mt-1 text-[11px] text-neutral-500">
            <span>Margin Kotor:</span>
            <span className="text-[#4a5d4e] font-semibold">{summary.grossMarginPercent.toFixed(1)}%</span>
          </div>
        </div>

        {/* Laba Bersih (Net Profit) */}
        <div className="bg-white/85 backdrop-blur-xs p-4 rounded-xl border border-[#c07a50]/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Laba Bersih (Net)</span>
            <div className={`p-1.5 rounded-lg ${summary.netProfit >= 0 ? 'bg-[#4a5d4e]/15 text-[#4a5d4e]' : 'bg-rose-100 text-rose-700'}`}>
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-xl font-bold tabular-nums mt-2 ${summary.netProfit >= 0 ? 'text-[#4a5d4e]' : 'text-rose-600'}`}>
            {formatCurrency(summary.netProfit)}
          </p>
          <div className="flex items-center justify-between mt-1 text-[11px] text-neutral-500">
            <span>Net Profit Margin:</span>
            <span className="font-semibold text-neutral-800">{summary.netMarginPercent.toFixed(1)}%</span>
          </div>
        </div>

        {/* Saldo Kas & Bank */}
        <div className="bg-white/85 backdrop-blur-xs p-4 rounded-xl border border-[#c07a50]/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Saldo Kas & Bank</span>
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-emerald-800 tabular-nums mt-2">
            {formatCurrency(summary.cashBalance)}
          </p>
          <div className="flex items-center justify-between mt-1 text-[11px] text-neutral-500">
            <span>Total Aset Bisnis:</span>
            <span className="font-semibold text-neutral-700">{formatCurrency(summary.totalAssets)}</span>
          </div>
        </div>
      </div>

      {/* Secondary Quick Metrics: AOV, OpEx, Stock, Balance */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white/60 p-3 rounded-lg border border-[#c07a50]/15 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-500">Average Order Value (AOV)</span>
            <p className="text-sm font-bold text-neutral-800 tabular-nums mt-0.5">
              {formatCurrency(summary.averageOrderValue)}
            </p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#c07a50]" />
        </div>

        <div className="bg-white/60 p-3 rounded-lg border border-[#c07a50]/15 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-500">Beban Operasional (OpEx)</span>
            <p className="text-sm font-bold text-rose-700 tabular-nums mt-0.5">
              {formatCurrency(summary.totalExpenses)}
            </p>
          </div>
          <Receipt className="w-4 h-4 text-neutral-400" />
        </div>

        <div className="bg-white/60 p-3 rounded-lg border border-[#c07a50]/15 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-500">Nilai Stok Bahan Sekali Pakai</span>
            <p className="text-sm font-bold text-neutral-800 tabular-nums mt-0.5">
              {formatCurrency(summary.inventoryValue)}
            </p>
          </div>
          <Package className="w-4 h-4 text-[#4a5d4e]" />
        </div>

        <div className="bg-white/60 p-3 rounded-lg border border-[#c07a50]/15 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-500">Nilai Buku Alat Operasional</span>
            <p className="text-sm font-bold text-neutral-800 tabular-nums mt-0.5">
              {formatCurrency(summary.toolsBookValue)}
            </p>
          </div>
          <Layers className="w-4 h-4 text-[#c07a50]" />
        </div>
      </div>

      {/* Stock Alert Warning Banner (If any) */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-amber-900">Perhatian: {lowStockItems.length} Bahan Baku Menipis</span>
            <p className="text-amber-800 mt-0.5">
              {lowStockItems.map((i) => `${i.name} (sisa ${i.stock} ${i.unit})`).join(', ')}.
            </p>
          </div>
          <button
            onClick={() => onNavigate('inventory')}
            className="text-xs font-semibold text-amber-800 underline hover:text-amber-900 whitespace-nowrap cursor-pointer"
          >
            Lihat Stok
          </button>
        </div>
      )}

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart (2 columns) */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-[#c07a50]/20 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#2c332d]">Tren Penjualan & Laba Kotor</h3>
              <p className="text-xs text-neutral-500">Performa transaksi terkini dalam kurun waktu</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#4a5d4e]/10 text-[#4a5d4e]">
              Real-Time
            </span>
          </div>
          <div className="h-64">
            <Line
              data={trendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.dataset.label}: ${formatCurrency(Number(context.raw))}`,
                    },
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      callback: (value) => `${Number(value) / 1000}k`,
                      font: { size: 10 },
                    },
                    grid: { color: 'rgba(0,0,0,0.04)' },
                  },
                  x: {
                    grid: { display: false },
                    ticks: { font: { size: 10 } },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Breakdown Donut Chart (1 column) */}
        <div className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-[#c07a50]/20 shadow-xs flex flex-col">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-[#2c332d]">Breakdown Biaya vs Laba</h3>
            <p className="text-xs text-neutral-500">Alokasi omset ke bahan, alat, operasional, & profit</p>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[220px]">
            <Doughnut
              data={donutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.label}: ${formatCurrency(Number(context.raw))}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Best Sellers & Quick Ledger Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Seller Bar Chart */}
        <div className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-[#c07a50]/20 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#2c332d]">Produk Terlaris (Best Seller)</h3>
              <p className="text-xs text-neutral-500">Volume unit buket yang paling diminati pembeli</p>
            </div>
            <button
              onClick={() => onNavigate('calculator')}
              className="text-xs text-[#c07a50] font-semibold hover:underline cursor-pointer"
            >
              Semua Resep →
            </button>
          </div>
          <div className="h-56">
            <Bar
              data={bestSellerData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: {
                    ticks: { precision: 0, font: { size: 10 } },
                    grid: { color: 'rgba(0,0,0,0.04)' },
                  },
                  y: {
                    ticks: { font: { size: 10 } },
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-[#c07a50]/20 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#2c332d]">Aktivitas Penjualan Terkini</h3>
              <p className="text-xs text-neutral-500">Transaksi pesanan buket terbaru</p>
            </div>
            <button
              onClick={() => onNavigate('transactions')}
              className="text-xs text-[#c07a50] font-semibold hover:underline cursor-pointer"
            >
              Lihat Semua ({transactions.length}) →
            </button>
          </div>

          <div className="divide-y divide-neutral-100">
            {transactions.slice(0, 4).map((trx) => (
              <div key={trx.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-neutral-800">{trx.customerName}</div>
                  <div className="text-neutral-500 text-[11px]">
                    {trx.productName} · {trx.quantity} unit
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#c07a50] tabular-nums">
                    {formatCurrency(trx.totalRevenue)}
                  </div>
                  <div className="text-[11px] text-[#4a5d4e] font-medium tabular-nums">
                    Laba +{formatCurrency(trx.grossProfit)}
                  </div>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="py-8 text-center text-xs text-neutral-400">
                Belum ada transaksi tercatat. Klik "+ Catat Penjualan" di atas.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
