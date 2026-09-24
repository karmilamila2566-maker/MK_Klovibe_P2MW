import React, { useState } from 'react';
import {
  Plus,
  Wallet,
  Receipt,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Building,
  Zap,
  Users,
  Megaphone,
  Truck,
  Box,
  MoreHorizontal,
  CheckCircle,
} from 'lucide-react';
import { ExpenseItem, ExpenseCategory, PaymentMethod } from '../types';
import { formatCurrency, formatNumber } from '../utils/accounting';
import { ConfirmModal } from './ConfirmModal';

interface ExpensesManagerProps {
  expenses: ExpenseItem[];
  onSaveExpense: (expense: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpensesManager: React.FC<ExpensesManagerProps> = ({
  expenses,
  onSaveExpense,
  onDeleteExpense,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ExpenseCategory>('Sewa Tempat / Kios');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('150000');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Transfer Bank');

  // Confirmation modal
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseItem | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const openNewExpense = () => {
    setEditingExpense(null);
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('Listrik & Utilitas');
    setDescription('');
    setAmount('150000');
    setPaymentMethod('Transfer Bank');
    setIsModalOpen(true);
  };

  const openEditExpense = (item: ExpenseItem) => {
    setEditingExpense(item);
    setDate(item.date);
    setCategory(item.category);
    setDescription(item.description);
    setAmount(String(item.amount));
    setPaymentMethod(item.paymentMethod);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || Number(amount) <= 0) return;

    const expenseToSave: ExpenseItem = {
      id: editingExpense ? editingExpense.id : `exp-${Date.now()}`,
      date,
      category,
      description: description.trim(),
      amount: Math.max(0, Number(amount) || 0),
      paymentMethod,
    };

    onSaveExpense(expenseToSave);
    setIsModalOpen(false);
    showNotification(
      editingExpense
        ? `Beban operasional "${expenseToSave.description}" berhasil diperbarui!`
        : `Beban operasional baru berhasil dicatat!`
    );
  };

  const confirmDeleteExpense = () => {
    if (!expenseToDelete) return;
    onDeleteExpense(expenseToDelete.id);
    showNotification(`Beban "${expenseToDelete.description}" telah dihapus.`);
    setExpenseToDelete(null);
  };

  // Filtered expenses
  const filtered = expenses.filter((e) => {
    const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalFilteredAmount = filtered.reduce((acc, e) => acc + e.amount, 0);

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  for (const exp of expenses) {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  }

  const categoryIcon = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'Sewa Tempat / Kios':
        return <Building className="w-3.5 h-3.5 text-[#c07a50]" />;
      case 'Listrik & Utilitas':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'Gaji / Upah Asisten':
        return <Users className="w-3.5 h-3.5 text-blue-500" />;
      case 'Pemasaran & Iklan':
        return <Megaphone className="w-3.5 h-3.5 text-purple-500" />;
      case 'Transportasi & Pengantaran':
        return <Truck className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Packaging & Plastik Pelindung':
        return <Box className="w-3.5 h-3.5 text-orange-500" />;
      default:
        return <MoreHorizontal className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

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
            Beban Operasional Toko (OpEx)
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Pencatatan pengeluaran di luar HPP material langsung (sewa kios, listrik pendingin bunga, iklan, transportasi).
          </p>
        </div>

        <button
          onClick={openNewExpense}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#c07a50] hover:bg-[#a8653e] rounded-xl shadow-xs transition cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>+ Catat Beban OpEx</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/90 p-4 rounded-xl border border-[#c07a50]/20 shadow-xs">
          <span className="text-xs text-neutral-500">Total Pengeluaran OpEx</span>
          <p className="text-xl font-bold text-rose-700 tabular-nums mt-1">
            {formatCurrency(totalFilteredAmount)}
          </p>
          <span className="text-[11px] text-neutral-400">{filtered.length} transaksi beban operasional</span>
        </div>

        <div className="bg-white/90 p-4 rounded-xl border border-[#c07a50]/20 shadow-xs">
          <span className="text-xs text-neutral-500">Kategori Beban Terbesar</span>
          <p className="text-lg font-bold text-neutral-800 truncate mt-1">
            {Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Belum Ada'}
          </p>
          <span className="text-[11px] text-neutral-400">
            {formatCurrency(Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[1] || 0)}
          </span>
        </div>

        <div className="bg-white/90 p-4 rounded-xl border border-[#c07a50]/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500">Dampak ke Laba Bersih</span>
            <p className="text-xs text-neutral-600 mt-1">
              Beban OpEx mengurangi laba kotor menjadi laba bersih riil.
            </p>
          </div>
          <Wallet className="w-7 h-7 text-neutral-300" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari deskripsi pengeluaran..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white/90 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-[#c07a50]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white/90 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-[#c07a50]"
          >
            <option value="all">Semua Kategori Beban</option>
            <option value="Sewa Tempat / Kios">Sewa Tempat / Kios</option>
            <option value="Listrik & Utilitas">Listrik & Utilitas</option>
            <option value="Gaji / Upah Asisten">Gaji / Upah Asisten</option>
            <option value="Pemasaran & Iklan">Pemasaran & Iklan</option>
            <option value="Transportasi & Pengantaran">Transportasi & Pengantaran</option>
            <option value="Packaging & Plastik Pelindung">Packaging Luar</option>
            <option value="Perawatan & Perlengkapan Toko">Perawatan Toko</option>
            <option value="Lain-lain">Lain-lain</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white/95 rounded-2xl border border-[#c07a50]/20 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f4efe6]/50 border-b border-[#c07a50]/15 text-[11px] font-semibold text-neutral-600">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-3">Kategori Beban</th>
                <th className="py-3 px-3">Deskripsi & Keterangan</th>
                <th className="py-3 px-3 text-right">Jumlah Biaya</th>
                <th className="py-3 px-3 text-center">Metode Bayar</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3 px-4 text-neutral-600 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{item.date}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-neutral-800">
                    <div className="flex items-center gap-1.5">
                      {categoryIcon(item.category)}
                      <span>{item.category}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-neutral-700">{item.description}</td>
                  <td className="py-3 px-3 text-right font-bold text-rose-700 tabular-nums">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="py-3 px-3 text-center text-neutral-500 text-[11px]">
                    {item.paymentMethod}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openEditExpense(item)}
                        className="p-1.5 text-neutral-500 hover:text-[#c07a50] hover:bg-neutral-100 rounded-lg cursor-pointer transition"
                        title="Edit Beban"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setExpenseToDelete(item)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition"
                        title="Hapus Beban"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-neutral-400 space-y-2">
                    <Receipt className="w-8 h-8 mx-auto text-neutral-300" />
                    <p>Belum ada catatan beban operasional (OpEx).</p>
                    <button
                      onClick={openNewExpense}
                      className="px-3 py-1.5 text-xs bg-[#c07a50] text-white rounded-lg cursor-pointer"
                    >
                      + Catat Beban Pertama
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Catat/Edit OpEx */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#c07a50]/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-800 font-brand">
                {editingExpense ? 'Edit Beban Operasional' : 'Catat Beban Operasional (OpEx)'}
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
                  <label className="block font-medium text-neutral-700 mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Jumlah Biaya (IDR) *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-bold text-rose-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Kategori Pengeluaran *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                >
                  <option value="Sewa Tempat / Kios">Sewa Tempat / Kios</option>
                  <option value="Listrik & Utilitas">Listrik & Utilitas (Chiller, Lampu)</option>
                  <option value="Gaji / Upah Asisten">Gaji / Upah Asisten</option>
                  <option value="Pemasaran & Iklan">Pemasaran & Iklan (Meta/TikTok Ads)</option>
                  <option value="Transportasi & Pengantaran">Transportasi & Pengantaran</option>
                  <option value="Packaging & Plastik Pelindung">Packaging Luar / Kardus Buket</option>
                  <option value="Perawatan & Perlengkapan Toko">Perawatan Toko</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Deskripsi / Keterangan *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Token listrik workshop florist & chiller mawar"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                />
              </div>

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
                  <option value="Kartu Debit">Kartu Debit</option>
                </select>
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
                  className="px-5 py-2 text-white bg-[#c07a50] hover:bg-[#a8653e] rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Simpan Beban OpEx
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Expense (Yes/No) */}
      <ConfirmModal
        isOpen={!!expenseToDelete}
        title="Hapus Beban Operasional?"
        message={`Apakah Anda yakin ingin menghapus catatan beban "${expenseToDelete?.description}" sebesar ${formatCurrency(expenseToDelete?.amount || 0)}? Tindakan ini akan mempengaruhi perhitungan laba bersih secara real-time.`}
        confirmLabel="Ya, Hapus Beban"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={confirmDeleteExpense}
        onCancel={() => setExpenseToDelete(null)}
      />
    </div>
  );
};
