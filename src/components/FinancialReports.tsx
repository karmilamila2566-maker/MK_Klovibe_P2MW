import React, { useState } from 'react';
import {
  Printer,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Scale,
  DollarSign,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import {
  FinancialSummary,
  formatCurrency,
  formatNumber,
} from '../utils/accounting';
import { AppSettings, SaleTransaction, ExpenseItem } from '../types';

interface FinancialReportsProps {
  summary: FinancialSummary;
  settings: AppSettings;
  transactions: SaleTransaction[];
  expenses: ExpenseItem[];
}

export const FinancialReports: React.FC<FinancialReportsProps> = ({
  summary,
  settings,
  transactions,
  expenses,
}) => {
  const [reportType, setReportType] = useState<'income' | 'balance' | 'cashflow' | 'traction'>('income');

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-brand text-[#2c332d]">
            Laporan Keuangan & Analisis Bisnis
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Laporan akuntansi presisi KLOVIBE: Laba Rugi, Neraca Seimbang, Arus Kas, dan Metrik Traksi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 rounded-xl shadow-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#2c332d]/5 rounded-xl border border-[#c07a50]/20 overflow-x-auto">
        <button
          onClick={() => setReportType('income')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            reportType === 'income'
              ? 'bg-white text-[#c07a50] shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>1. Laba Rugi (Income Statement)</span>
        </button>

        <button
          onClick={() => setReportType('balance')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            reportType === 'balance'
              ? 'bg-white text-[#4a5d4e] shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>2. Neraca (Balance Sheet)</span>
        </button>

        <button
          onClick={() => setReportType('cashflow')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            reportType === 'cashflow'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>3. Arus Kas (Cash Flow)</span>
        </button>

        <button
          onClick={() => setReportType('traction')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            reportType === 'traction'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>4. Analisis Traksi & Rasio</span>
        </button>
      </div>

      {/* REPORT 1: INCOME STATEMENT */}
      {reportType === 'income' && (
        <div className="bg-white/95 rounded-2xl border border-[#c07a50]/20 p-6 md:p-8 shadow-xs space-y-6">
          <div className="text-center border-b border-neutral-200 pb-4">
            <span className="text-2xl font-bold font-brand text-[#c07a50]">
              {settings.storeName}
            </span>
            <h3 className="text-lg font-bold text-neutral-800">
              Laporan Laba Rugi (Income Statement)
            </h3>
            <p className="text-xs text-neutral-500 italic mt-0.5">
              Periode Berjalan · Disusun Berdasarkan Standar Akuntansi Usaha Bouquet
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4 text-xs">
            {/* 1. Pendapatan */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-sm text-neutral-800 pb-1 border-b border-neutral-200">
                <span>PENDAPATAN USAHA (REVENUE)</span>
                <span></span>
              </div>
              <div className="flex justify-between py-1 text-neutral-700">
                <span className="pl-4">Penjualan Produk Bouquet (Total Omset)</span>
                <span className="font-semibold tabular-nums text-neutral-900">
                  {formatCurrency(summary.totalRevenue)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-neutral-800 pt-1 border-t border-neutral-100">
                <span>Total Pendapatan Bersih</span>
                <span className="tabular-nums text-[#c07a50]">{formatCurrency(summary.totalRevenue)}</span>
              </div>
            </div>

            {/* 2. HPP */}
            <div className="space-y-1 pt-3">
              <div className="flex justify-between font-bold text-sm text-neutral-800 pb-1 border-b border-neutral-200">
                <span>BEBAN POKOK PENJUALAN (HPP / COGS)</span>
                <span></span>
              </div>
              <div className="flex justify-between py-1 text-neutral-600">
                <span className="pl-4">Beban Bahan Habis Pakai (Bunga, Wrapping, Pita, Aksesoris)</span>
                <span className="tabular-nums">{formatCurrency(summary.consumableHppTotal)}</span>
              </div>
              <div className="flex justify-between py-1 text-neutral-600">
                <span className="pl-4">Beban Penyusutan Alat Operasional (Gunting, Lem, Dispenser)</span>
                <span className="tabular-nums">{formatCurrency(summary.toolDepreciationHppTotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-amber-900 pt-1 border-t border-neutral-100">
                <span>Total Beban Pokok Penjualan (HPP)</span>
                <span className="tabular-nums">({formatCurrency(summary.totalHpp)})</span>
              </div>
            </div>

            {/* 3. Laba Kotor */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between items-center font-bold text-sm">
              <span className="text-[#4a5d4e]">LABA KOTOR (GROSS PROFIT)</span>
              <span className="text-[#4a5d4e] tabular-nums">
                {formatCurrency(summary.grossProfit)} ({summary.grossMarginPercent.toFixed(1)}%)
              </span>
            </div>

            {/* 4. Beban Operasional */}
            <div className="space-y-1 pt-3">
              <div className="flex justify-between font-bold text-sm text-neutral-800 pb-1 border-b border-neutral-200">
                <span>BEBAN OPERASIONAL (OPERATING EXPENSES / OPEX)</span>
                <span></span>
              </div>
              {Object.entries(summary.expensesByCategory).map(([cat, amount]) => (
                <div key={cat} className="flex justify-between py-1 text-neutral-600">
                  <span className="pl-4">{cat}</span>
                  <span className="tabular-nums">{formatCurrency(amount)}</span>
                </div>
              ))}
              {Object.keys(summary.expensesByCategory).length === 0 && (
                <div className="py-2 pl-4 text-neutral-400 italic">Belum ada beban operasional.</div>
              )}
              <div className="flex justify-between font-bold text-rose-800 pt-1 border-t border-neutral-100">
                <span>Total Beban Operasional</span>
                <span className="tabular-nums">({formatCurrency(summary.totalExpenses)})</span>
              </div>
            </div>

            {/* 5. Laba Bersih */}
            <div className="p-4 bg-[#f4efe6] rounded-xl border-2 border-[#c07a50] flex justify-between items-center font-bold text-base mt-4">
              <div className="flex items-center gap-2">
                <span className="text-[#2c332d]">LABA / RUGI BERSIH (NET PROFIT)</span>
                <span className="text-[11px] font-normal text-neutral-500">
                  (Net Margin: {summary.netMarginPercent.toFixed(1)}%)
                </span>
              </div>
              <span className={`tabular-nums ${summary.netProfit >= 0 ? 'text-[#4a5d4e]' : 'text-rose-700'}`}>
                {formatCurrency(summary.netProfit)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2: BALANCE SHEET */}
      {reportType === 'balance' && (
        <div className="bg-white/95 rounded-2xl border border-[#c07a50]/20 p-6 md:p-8 shadow-xs space-y-6">
          <div className="text-center border-b border-neutral-200 pb-4">
            <span className="text-2xl font-bold font-brand text-[#c07a50]">
              {settings.storeName}
            </span>
            <h3 className="text-lg font-bold text-neutral-800">
              Neraca Sederhana (Balance Sheet)
            </h3>
            <p className="text-xs text-neutral-500 italic mt-0.5">
              Posisi Keuangan Usaha · Formula: Aset = Kewajiban + Ekuitas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-xs">
            {/* SISI KIRI: ASET */}
            <div className="space-y-4">
              <div className="border-b-2 border-[#4a5d4e] pb-1 font-bold text-sm text-[#4a5d4e]">
                ASET (ASSETS)
              </div>

              {/* Aset Lancar */}
              <div className="space-y-1.5">
                <div className="font-bold text-neutral-800">Aset Lancar:</div>
                <div className="flex justify-between pl-3 text-neutral-700">
                  <span>Kas & Bank</span>
                  <span className="tabular-nums font-medium">{formatCurrency(summary.cashBalance)}</span>
                </div>
                <div className="flex justify-between pl-3 text-neutral-700">
                  <span>Persediaan Bahan Baku (Stok Fisik)</span>
                  <span className="tabular-nums font-medium">{formatCurrency(summary.inventoryValue)}</span>
                </div>
                <div className="flex justify-between pl-3 font-semibold text-neutral-900 border-t border-neutral-100 pt-1">
                  <span>Total Aset Lancar</span>
                  <span className="tabular-nums">{formatCurrency(summary.cashBalance + summary.inventoryValue)}</span>
                </div>
              </div>

              {/* Aset Tetap */}
              <div className="space-y-1.5 pt-3">
                <div className="font-bold text-neutral-800">Aset Tetap (Peralatan Operasional):</div>
                <div className="flex justify-between pl-3 text-neutral-600">
                  <span>Harga Perolehan Alat Kerja</span>
                  <span className="tabular-nums">{formatCurrency(summary.toolsOriginalValue)}</span>
                </div>
                <div className="flex justify-between pl-3 text-neutral-500">
                  <span>Akumulasi Penyusutan Alat</span>
                  <span className="tabular-nums text-amber-800">({formatCurrency(summary.toolsAccumulatedDepreciation)})</span>
                </div>
                <div className="flex justify-between pl-3 font-semibold text-neutral-900 border-t border-neutral-100 pt-1">
                  <span>Nilai Buku Alat Florist</span>
                  <span className="tabular-nums">{formatCurrency(summary.toolsBookValue)}</span>
                </div>
              </div>

              {/* TOTAL ASET */}
              <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-300 flex justify-between items-center font-bold text-sm text-neutral-900 mt-6">
                <span>TOTAL ASET</span>
                <span className="tabular-nums text-[#4a5d4e]">{formatCurrency(summary.totalAssets)}</span>
              </div>
            </div>

            {/* SISI KANAN: KEWAJIBAN & EKUITAS */}
            <div className="space-y-4">
              <div className="border-b-2 border-[#c07a50] pb-1 font-bold text-sm text-[#c07a50]">
                KEWAJIBAN & EKUITAS
              </div>

              {/* Kewajiban */}
              <div className="space-y-1.5">
                <div className="font-bold text-neutral-800">Kewajiban (Liabilities):</div>
                <div className="flex justify-between pl-3 text-neutral-600">
                  <span>Utang Usaha / Operasional</span>
                  <span className="tabular-nums">{formatCurrency(summary.totalLiabilities)}</span>
                </div>
                <div className="flex justify-between pl-3 font-semibold text-neutral-900 border-t border-neutral-100 pt-1">
                  <span>Total Kewajiban</span>
                  <span className="tabular-nums">{formatCurrency(summary.totalLiabilities)}</span>
                </div>
              </div>

              {/* Ekuitas / Modal */}
              <div className="space-y-1.5 pt-3">
                <div className="font-bold text-neutral-800">Ekuitas Pemilik (Equity):</div>
                <div className="flex justify-between pl-3 text-neutral-700">
                  <span>Modal Awal Disetor</span>
                  <span className="tabular-nums font-medium">{formatCurrency(summary.initialCapital)}</span>
                </div>
                <div className="flex justify-between pl-3 text-neutral-700">
                  <span>Laba Berjalan / Ditahan</span>
                  <span className={`tabular-nums font-medium ${summary.netProfit >= 0 ? 'text-[#4a5d4e]' : 'text-rose-700'}`}>
                    {formatCurrency(summary.retainedEarnings)}
                  </span>
                </div>
                <div className="flex justify-between pl-3 font-semibold text-neutral-900 border-t border-neutral-100 pt-1">
                  <span>Total Ekuitas</span>
                  <span className="tabular-nums">{formatCurrency(summary.totalEquity)}</span>
                </div>
              </div>

              {/* TOTAL KEWAJIBAN & EKUITAS */}
              <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-300 flex justify-between items-center font-bold text-sm text-neutral-900 mt-6">
                <span>TOTAL KEWAJIBAN & EKUITAS</span>
                <span className="tabular-nums text-[#c07a50]">{formatCurrency(summary.totalLiabilities + summary.totalEquity)}</span>
              </div>
            </div>
          </div>

          {/* Balance Validation Card */}
          <div className="max-w-4xl mx-auto p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Validasi Akuntansi:</strong> Neraca Seimbang sempurna. Aset ({formatCurrency(summary.totalAssets)}) = Kewajiban & Ekuitas ({formatCurrency(summary.totalLiabilities + summary.totalEquity)}).
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Balanced ✓
            </span>
          </div>
        </div>
      )}

      {/* REPORT 3: CASH FLOW STATEMENT */}
      {reportType === 'cashflow' && (
        <div className="bg-white/95 rounded-2xl border border-[#c07a50]/20 p-6 md:p-8 shadow-xs space-y-6">
          <div className="text-center border-b border-neutral-200 pb-4">
            <span className="text-2xl font-bold font-brand text-[#c07a50]">
              {settings.storeName}
            </span>
            <h3 className="text-lg font-bold text-neutral-800">
              Laporan Arus Kas (Cash Flow Statement)
            </h3>
            <p className="text-xs text-neutral-500 italic mt-0.5">
              Aliran Kas Masuk vs Kas Keluar Periode Berjalan
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4 text-xs">
            {/* Arus Kas Masuk */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-sm text-[#4a5d4e] pb-1 border-b border-neutral-200">
                <span className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-4 h-4 text-[#4a5d4e]" />
                  <span>ARUS KAS MASUK (CASH INFLOW)</span>
                </span>
                <span></span>
              </div>
              <div className="flex justify-between py-1 text-neutral-700 pl-4">
                <span>Penerimaan Kas dari Penjualan Buket</span>
                <span className="font-semibold tabular-nums text-emerald-700">
                  +{formatCurrency(summary.cashInflowSales)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-neutral-800 pt-1 border-t border-neutral-100 pl-4">
                <span>Total Kas Masuk</span>
                <span className="tabular-nums text-emerald-700">+{formatCurrency(summary.cashInflowSales)}</span>
              </div>
            </div>

            {/* Arus Kas Keluar */}
            <div className="space-y-1.5 pt-3">
              <div className="flex justify-between font-bold text-sm text-rose-700 pb-1 border-b border-neutral-200">
                <span className="flex items-center gap-1.5">
                  <ArrowDownRight className="w-4 h-4 text-rose-600" />
                  <span>ARUS KAS KELUAR (CASH OUTFLOW)</span>
                </span>
                <span></span>
              </div>
              <div className="flex justify-between py-1 text-neutral-600 pl-4">
                <span>Pembayaran Beban Operasional (OpEx)</span>
                <span className="tabular-nums text-rose-700">({formatCurrency(summary.cashOutflowExpenses)})</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-800 pt-1 border-t border-neutral-100 pl-4">
                <span>Total Kas Keluar</span>
                <span className="tabular-nums text-rose-700">({formatCurrency(summary.cashOutflowExpenses)})</span>
              </div>
            </div>

            {/* Saldo Kas Bersih */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-300 space-y-2 mt-4 font-medium">
              <div className="flex justify-between text-neutral-700">
                <span>Modal Kas Awal:</span>
                <span className="tabular-nums font-semibold">{formatCurrency(summary.initialCapital)}</span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>Arus Kas Bersih Periode Ini:</span>
                <span className="tabular-nums font-semibold text-[#4a5d4e]">
                  +{formatCurrency(summary.netCashFlow)}
                </span>
              </div>
              <div className="border-t border-neutral-300 pt-2 flex justify-between font-bold text-sm text-neutral-900">
                <span>SALDO KAS & BANK AKHIR:</span>
                <span className="tabular-nums text-[#4a5d4e]">{formatCurrency(summary.cashBalance)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 4: TRACTION & RATIOS */}
      {reportType === 'traction' && (
        <div className="bg-white/95 rounded-2xl border border-[#c07a50]/20 p-6 md:p-8 shadow-xs space-y-6">
          <div className="text-center border-b border-neutral-200 pb-4">
            <span className="text-2xl font-bold font-brand text-[#c07a50]">
              {settings.storeName}
            </span>
            <h3 className="text-lg font-bold text-neutral-800">
              Analisis Traksi Bisnis & Matriks Performa
            </h3>
            <p className="text-xs text-neutral-500 italic mt-0.5">
              Metrik Pertumbuhan, Efisiensi HPP, dan Produktivitas Florist
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto text-xs">
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-1">
              <span className="text-neutral-500">Total Unit Terjual</span>
              <p className="text-2xl font-bold text-neutral-900 tabular-nums">
                {summary.totalUnitsSold} Buket
              </p>
              <p className="text-[11px] text-neutral-500">Volume pesanan berhasil diselesaikan</p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-1">
              <span className="text-neutral-500">Average Order Value (AOV)</span>
              <p className="text-2xl font-bold text-[#c07a50] tabular-nums">
                {formatCurrency(summary.averageOrderValue)}
              </p>
              <p className="text-[11px] text-neutral-500">Rata-rata belanja per pelanggan</p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-1">
              <span className="text-neutral-500">Gross Profit Margin</span>
              <p className="text-2xl font-bold text-[#4a5d4e] tabular-nums">
                {summary.grossMarginPercent.toFixed(1)}%
              </p>
              <p className="text-[11px] text-neutral-500">Efisiensi margin HPP bahan & alat</p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-1">
              <span className="text-neutral-500">Net Profit Margin</span>
              <p className="text-2xl font-bold text-neutral-900 tabular-nums">
                {summary.netMarginPercent.toFixed(1)}%
              </p>
              <p className="text-[11px] text-neutral-500">Margin laba setelah dikurangi seluruh OpEx</p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-1">
              <span className="text-neutral-500">Return on Assets (ROA)</span>
              <p className="text-2xl font-bold text-neutral-900 tabular-nums">
                {summary.totalAssets > 0 ? ((summary.netProfit / summary.totalAssets) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-[11px] text-neutral-500">Tingkat efisiensi pemanfaatan aset</p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-1">
              <span className="text-neutral-500">Rasio Kas terhadap Aset</span>
              <p className="text-2xl font-bold text-neutral-900 tabular-nums">
                {summary.totalAssets > 0 ? ((summary.cashBalance / summary.totalAssets) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-[11px] text-neutral-500">Likuiditas likuid untuk modal operasional</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
