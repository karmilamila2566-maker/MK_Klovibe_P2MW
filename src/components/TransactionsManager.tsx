import React, { useState } from 'react';
import {
  Plus,
  Receipt,
  Search,
  Filter,
  Trash2,
  Edit2,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  SaleTransaction,
  BouquetProduct,
  ConsumableItem,
  DurableTool,
  PaymentMethod,
  PaymentStatus,
} from '../types';
import {
  calculateProductHpp,
  formatCurrency,
  formatNumber,
} from '../utils/accounting';
import { ConfirmModal } from './ConfirmModal';

interface TransactionsManagerProps {
  transactions: SaleTransaction[];
  products: BouquetProduct[];
  consumables: ConsumableItem[];
  tools: DurableTool[];
  onSaveTransaction: (transaction: SaleTransaction, isNew: boolean) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionsManager: React.FC<TransactionsManagerProps> = ({
  transactions,
  products,
  consumables,
  tools,
  onSaveTransaction,
  onDeleteTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<SaleTransaction | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<SaleTransaction | null>(null);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [customPrice, setCustomPrice] = useState<number>(products[0]?.sellingPrice || 250000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Transfer Bank');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Lunas');
  const [notes, setNotes] = useState('');

  // Confirmation Modal
  const [transactionToDelete, setTransactionToDelete] = useState<SaleTransaction | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const openNewTransaction = () => {
    setEditingTransaction(null);
    setDate(new Date().toISOString().split('T')[0]);
    setCustomerName('');
    setCustomerPhone('');
    const firstProduct = products[0];
    if (firstProduct) {
      setSelectedProductId(firstProduct.id);
      setCustomPrice(firstProduct.sellingPrice);
    } else {
      setSelectedProductId('');
      setCustomPrice(200000);
    }
    setQuantity(1);
    setPaymentMethod('Transfer Bank');
    setPaymentStatus('Lunas');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditTransaction = (trx: SaleTransaction) => {
    setEditingTransaction(trx);
    setDate(trx.date);
    setCustomerName(trx.customerName);
    setCustomerPhone(trx.customerPhone || '');
    setSelectedProductId(trx.productId);
    setQuantity(trx.quantity);
    setCustomPrice(trx.sellingPrice);
    setPaymentMethod(trx.paymentMethod);
    setPaymentStatus(trx.paymentStatus);
    setNotes(trx.notes || '');
    setIsModalOpen(true);
  };

  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setCustomPrice(prod.sellingPrice);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !selectedProductId) return;

    const currentProduct = products.find((p) => p.id === selectedProductId);
    if (!currentProduct) return;

    // Calculate precise HPP for this product
    const productHppData = calculateProductHpp(currentProduct, consumables, tools);
    const unitHpp = productHppData.totalHpp;

    const unitPrice = Number(customPrice) || currentProduct.sellingPrice;
    const qty = Math.max(1, Number(quantity) || 1);
    const totalRev = unitPrice * qty;
    const totalHpp = unitHpp * qty;
    const grossProfit = totalRev - totalHpp;

    const trxToSave: SaleTransaction = {
      id: editingTransaction ? editingTransaction.id : `trx-${Date.now()}`,
      invoiceNumber: editingTransaction
        ? editingTransaction.invoiceNumber
        : `INV-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${String(transactions.length + 1).padStart(3, '0')}`,
      date,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      productId: currentProduct.id,
      productName: currentProduct.name,
      quantity: qty,
      sellingPrice: unitPrice,
      totalRevenue: totalRev,
      unitHpp,
      totalHpp,
      grossProfit,
      paymentMethod,
      paymentStatus,
      notes: notes.trim(),
    };

    onSaveTransaction(trxToSave, !editingTransaction);
    setIsModalOpen(false);
    showNotification(
      editingTransaction
        ? `Transaksi "${trxToSave.invoiceNumber}" berhasil diperbarui!`
        : `Transaksi baru untuk "${trxToSave.customerName}" berhasil dicatat!`
    );
  };

  const confirmDeleteTransaction = () => {
    if (!transactionToDelete) return;
    onDeleteTransaction(transactionToDelete.id);
    showNotification(`Transaksi "${transactionToDelete.invoiceNumber}" telah dihapus.`);
    setTransactionToDelete(null);
  };

  // Filtered transactions
  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals for filtered list
  const totalRevenue = filtered.reduce((acc, t) => acc + t.totalRevenue, 0);
  const totalGrossProfit = filtered.reduce((acc, t) => acc + t.grossProfit, 0);
  const totalUnits = filtered.reduce((acc, t) => acc + t.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#4a5d4e] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-brand text-[#2c332d]">
            Pencatatan Transaksi & Penjualan Bouquet
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Setiap transaksi otomatis memotong stok bahan dan mencatat siklus penyusutan alat secara real-time.
          </p>
        </div>

        <button
          onClick={openNewTransaction}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#c07a50] hover:bg-[#a8653e] rounded-xl shadow-xs transition cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>+ Catat Penjualan Baru</span>
        </button>
      </div>

      {/* Financial Metrics Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/90 p-4 rounded-xl border border-[#c07a50]/20 shadow-xs">
          <span className="text-xs text-neutral-500">Omset Penjualan Terfilter</span>
          <p className="text-xl font-bold text-[#c07a50] tabular-nums mt-1">
            {formatCurrency(totalRevenue)}
          </p>
          <span className="text-[11px] text-neutral-400">{filtered.length} transaksi</span>
        </div>

        <div className="bg-white/90 p-4 rounded-xl border border-[#c07a50]/20 shadow-xs">
          <span className="text-xs text-neutral-500">Laba Kotor Terfilter</span>
          <p className="text-xl font-bold text-[#4a5d4e] tabular-nums mt-1">
            {formatCurrency(totalGrossProfit)}
          </p>
          <span className="text-[11px] text-neutral-400">
            Margin: {totalRevenue > 0 ? ((totalGrossProfit / totalRevenue) * 100).toFixed(1) : 0}%
          </span>
        </div>

        <div className="bg-white/90 p-4 rounded-xl border border-[#c07a50]/20 shadow-xs">
          <span className="text-xs text-neutral-500">Total Unit Terjual</span>
          <p className="text-xl font-bold text-neutral-800 tabular-nums mt-1">
            {totalUnits} Buket
          </p>
          <span className="text-[11px] text-neutral-400">
            Rata-rata: {filtered.length > 0 ? formatCurrency(totalRevenue / filtered.length) : 'Rp 0'} / trx
          </span>
        </div>
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pelanggan, nomor faktur, atau produk..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white/90 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-[#c07a50]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white/90 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-[#c07a50]"
          >
            <option value="all">Semua Status Bayar</option>
            <option value="Lunas">Lunas</option>
            <option value="DP (Sebagian)">DP (Sebagian)</option>
            <option value="Belum Lunas">Belum Lunas</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/95 rounded-2xl border border-[#c07a50]/20 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f4efe6]/50 border-b border-[#c07a50]/15 text-[11px] font-semibold text-neutral-600">
                <th className="py-3 px-4">No. Faktur & Tanggal</th>
                <th className="py-3 px-3">Pelanggan</th>
                <th className="py-3 px-3">Produk Bouquet</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Total Omset</th>
                <th className="py-3 px-3 text-right">Laba Kotor</th>
                <th className="py-3 px-3 text-center">Status Bayar</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {filtered.map((trx) => (
                <tr key={trx.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-neutral-800 text-[11px]">
                      {trx.invoiceNumber}
                    </div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{trx.date}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-neutral-800">{trx.customerName}</div>
                    {trx.customerPhone && (
                      <div className="text-[11px] text-neutral-400">{trx.customerPhone}</div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-neutral-700">
                    <div className="font-medium line-clamp-1">{trx.productName}</div>
                    <div className="text-[11px] text-neutral-400">
                      @ {formatCurrency(trx.sellingPrice)}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-bold tabular-nums">
                    {trx.quantity}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#c07a50] tabular-nums">
                    {formatCurrency(trx.totalRevenue)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#4a5d4e] tabular-nums">
                    +{formatCurrency(trx.grossProfit)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        trx.paymentStatus === 'Lunas'
                          ? 'bg-emerald-100 text-emerald-800'
                          : trx.paymentStatus === 'DP (Sebagian)'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {trx.paymentStatus === 'Lunas' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      <span>{trx.paymentStatus}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setSelectedInvoice(trx)}
                        className="p-1.5 text-neutral-500 hover:text-[#4a5d4e] hover:bg-neutral-100 rounded-lg cursor-pointer transition"
                        title="Lihat Invoice Cetak"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditTransaction(trx)}
                        className="p-1.5 text-neutral-500 hover:text-[#c07a50] hover:bg-neutral-100 rounded-lg cursor-pointer transition"
                        title="Edit Transaksi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setTransactionToDelete(trx)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-neutral-400 space-y-2">
                    <Receipt className="w-8 h-8 mx-auto text-neutral-300" />
                    <p>Belum ada transaksi penjualan samsek.</p>
                    <button
                      onClick={openNewTransaction}
                      className="px-3 py-1.5 text-xs bg-[#c07a50] text-white rounded-lg cursor-pointer"
                    >
                      + Catat Penjualan Pertama
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Catat Transaksi Baru / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#c07a50]/20 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-800 font-brand">
                {editingTransaction ? 'Edit Data Transaksi' : 'Catat Penjualan Bouquet Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Tanggal Transaksi *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Status Pembayaran</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                  >
                    <option value="Lunas">Lunas</option>
                    <option value="DP (Sebagian)">DP (Sebagian)</option>
                    <option value="Belum Lunas">Belum Lunas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Nama Pelanggan *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Siti Rahma"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Pilih Produk Bouquet *</label>
                {products.length === 0 ? (
                  <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-xs">
                    Belum ada produk buket! Harap buat resep produk terlebih dahulu di tab "Kalkulator HPP".
                  </div>
                ) : (
                  <select
                    required
                    value={selectedProductId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white font-medium"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatCurrency(p.sellingPrice)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Jumlah Buket (Qty) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Harga Satuan (IDR) *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-bold text-[#c07a50]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Metode Pembayaran</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                  >
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="QRIS">QRIS</option>
                    <option value="Tunai">Tunai</option>
                    <option value="Shopee/Tokopedia">Shopee/Tokopedia</option>
                    <option value="Kartu Debit">Kartu Debit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Total Transaksi</label>
                  <div className="w-full px-3 py-2 bg-neutral-100 rounded-lg font-bold text-neutral-800 tabular-nums">
                    {formatCurrency((Number(customPrice) || 0) * (Number(quantity) || 1))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Catatan Tambahan (Ucapan / Request)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Request pita warna pink, ucapan selamat ulang tahun..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={products.length === 0}
                  className="px-5 py-2 text-white bg-[#c07a50] hover:bg-[#a8653e] disabled:bg-neutral-300 rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#c07a50]/20 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
              <div>
                <span className="text-lg font-bold font-brand text-[#c07a50]">KLOVIBE FLORIST</span>
                <p className="text-[11px] text-neutral-500 italic">Crafted Moments, Enduring Love</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-[#f4efe6]/50 p-2.5 rounded-lg border border-[#c07a50]/20">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">No. Faktur</span>
                  <div className="font-mono font-bold text-neutral-800">{selectedInvoice.invoiceNumber}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Tanggal</span>
                  <div className="font-semibold text-neutral-800">{selectedInvoice.date}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-neutral-500 text-[11px]">Kepada Pelanggan:</div>
                <div className="font-bold text-neutral-800">{selectedInvoice.customerName}</div>
                {selectedInvoice.customerPhone && (
                  <div className="text-neutral-500">{selectedInvoice.customerPhone}</div>
                )}
              </div>

              <div className="border-t border-b border-neutral-200 py-2 space-y-1.5">
                <div className="flex justify-between font-semibold text-neutral-800">
                  <span>{selectedInvoice.productName}</span>
                  <span className="tabular-nums">x{selectedInvoice.quantity}</span>
                </div>
                <div className="flex justify-between text-neutral-500 text-[11px]">
                  <span>Harga Satuan: {formatCurrency(selectedInvoice.sellingPrice)}</span>
                  <span className="font-bold text-neutral-800 tabular-nums">
                    {formatCurrency(selectedInvoice.totalRevenue)}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-right pt-1">
                <div className="flex justify-between text-sm font-bold text-neutral-900">
                  <span>Total Pembayaran:</span>
                  <span className="text-[#c07a50]">{formatCurrency(selectedInvoice.totalRevenue)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>Metode: {selectedInvoice.paymentMethod}</span>
                  <span className="font-semibold text-emerald-700">Status: {selectedInvoice.paymentStatus}</span>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div className="bg-neutral-50 p-2 rounded-lg text-[11px] text-neutral-600 border border-neutral-200">
                  <span className="font-semibold">Catatan:</span> {selectedInvoice.notes}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 text-xs font-semibold text-white bg-[#4a5d4e] hover:bg-[#3d4c40] rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Faktur</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Transaction (Yes/No) */}
      <ConfirmModal
        isOpen={!!transactionToDelete}
        title="Hapus Transaksi Penjualan?"
        message={`Apakah Anda yakin ingin menghapus transaksi "${transactionToDelete?.invoiceNumber}" (${transactionToDelete?.customerName} - ${transactionToDelete?.productName})? Stok bahan yang sebelumnya terpotong akan dikembalikan secara otomatis ke inventaris.`}
        confirmLabel="Ya, Hapus Transaksi"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={confirmDeleteTransaction}
        onCancel={() => setTransactionToDelete(null)}
      />
    </div>
  );
};
