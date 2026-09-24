import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Scissors,
  Flower2,
  AlertCircle,
  Package,
  Layers,
  Search,
  PlusCircle,
  MinusCircle,
  CheckCircle,
} from 'lucide-react';
import {
  ConsumableItem,
  DurableTool,
  ConsumableCategory,
} from '../types';
import { formatCurrency, formatNumber } from '../utils/accounting';
import { ConfirmModal } from './ConfirmModal';

interface InventoryManagerProps {
  consumables: ConsumableItem[];
  tools: DurableTool[];
  onSaveConsumable: (item: ConsumableItem) => void;
  onDeleteConsumable: (id: string) => void;
  onUpdateStock: (id: string, delta: number) => void;
  onSaveTool: (tool: DurableTool) => void;
  onDeleteTool: (id: string) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  consumables,
  tools,
  onSaveConsumable,
  onDeleteConsumable,
  onUpdateStock,
  onSaveTool,
  onDeleteTool,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'consumables' | 'tools'>('consumables');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal Consumable
  const [isConsumableModalOpen, setIsConsumableModalOpen] = useState(false);
  const [editingConsumable, setEditingConsumable] = useState<ConsumableItem | null>(null);
  const [cName, setCName] = useState('');
  const [cCategory, setCCategory] = useState<ConsumableCategory>('bunga');
  const [cUnit, setCUnit] = useState('tangkai');
  const [cCost, setCCost] = useState<string>('5000');
  const [cStock, setCStock] = useState<string>('50');
  const [cMinAlert, setCMinAlert] = useState<string>('15');

  // Modal Tool
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<DurableTool | null>(null);
  const [tName, setTName] = useState('');
  const [tPrice, setTPrice] = useState<string>('100000');
  const [tDate, setTDate] = useState(new Date().toISOString().split('T')[0]);
  const [tCapacity, setTCapacity] = useState<string>('800');
  const [tUsed, setTUsed] = useState<string>('0');
  const [tNotes, setTNotes] = useState('');

  // Confirmation Modals (Yes/No)
  const [consumableToDelete, setConsumableToDelete] = useState<ConsumableItem | null>(null);
  const [toolToDelete, setToolToDelete] = useState<DurableTool | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Open consumable modal
  const openNewConsumable = () => {
    setEditingConsumable(null);
    setCName('');
    setCCategory('bunga');
    setCUnit('tangkai');
    setCCost('5000');
    setCStock('50');
    setCMinAlert('15');
    setIsConsumableModalOpen(true);
  };

  const openEditConsumable = (item: ConsumableItem) => {
    setEditingConsumable(item);
    setCName(item.name);
    setCCategory(item.category);
    setCUnit(item.unit);
    setCCost(String(item.costPerUnit));
    setCStock(String(item.stock));
    setCMinAlert(String(item.minStockAlert));
    setIsConsumableModalOpen(true);
  };

  const handleSaveConsumable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim()) return;

    const item: ConsumableItem = {
      id: editingConsumable ? editingConsumable.id : `c-${Date.now()}`,
      name: cName.trim(),
      category: cCategory,
      unit: cUnit.trim() || 'pcs',
      costPerUnit: Math.max(0, Number(cCost) || 0),
      stock: Math.max(0, Number(cStock) || 0),
      minStockAlert: Math.max(0, Number(cMinAlert) || 0),
    };

    onSaveConsumable(item);
    setIsConsumableModalOpen(false);
    showNotification(editingConsumable ? `Bahan "${item.name}" berhasil diperbarui!` : `Bahan "${item.name}" berhasil ditambahkan!`);
  };

  const confirmDeleteConsumable = () => {
    if (!consumableToDelete) return;
    onDeleteConsumable(consumableToDelete.id);
    showNotification(`Bahan "${consumableToDelete.name}" telah dihapus.`);
    setConsumableToDelete(null);
  };

  // Open tool modal
  const openNewTool = () => {
    setEditingTool(null);
    setTName('');
    setTPrice('100000');
    setTDate(new Date().toISOString().split('T')[0]);
    setTCapacity('800');
    setTUsed('0');
    setTNotes('');
    setIsToolModalOpen(true);
  };

  const openEditTool = (tool: DurableTool) => {
    setEditingTool(tool);
    setTName(tool.name);
    setTPrice(String(tool.purchasePrice));
    setTDate(tool.purchaseDate || new Date().toISOString().split('T')[0]);
    setTCapacity(String(tool.estimatedUsageCount));
    setTUsed(String(tool.totalUsedCount));
    setTNotes(tool.notes || '');
    setIsToolModalOpen(true);
  };

  const handleSaveTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim()) return;

    const tool: DurableTool = {
      id: editingTool ? editingTool.id : `t-${Date.now()}`,
      name: tName.trim(),
      purchasePrice: Math.max(0, Number(tPrice) || 0),
      purchaseDate: tDate,
      estimatedUsageCount: Math.max(1, Number(tCapacity) || 1),
      totalUsedCount: Math.max(0, Number(tUsed) || 0),
      notes: tNotes.trim(),
    };

    onSaveTool(tool);
    setIsToolModalOpen(false);
    showNotification(editingTool ? `Alat "${tool.name}" berhasil diperbarui!` : `Alat "${tool.name}" berhasil ditambahkan!`);
  };

  const confirmDeleteTool = () => {
    if (!toolToDelete) return;
    onDeleteTool(toolToDelete.id);
    showNotification(`Alat "${toolToDelete.name}" telah dihapus.`);
    setToolToDelete(null);
  };

  // Filtered consumables
  const filteredConsumables = consumables.filter((c) => {
    const matchesQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  // Filtered tools
  const filteredTools = tools.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Totals
  const totalConsumableValue = consumables.reduce((acc, c) => acc + (c.stock * c.costPerUnit), 0);
  const totalToolsOriginalCost = tools.reduce((acc, t) => acc + t.purchasePrice, 0);
  const totalToolsDepreciation = tools.reduce((acc, t) => {
    const depr = t.estimatedUsageCount > 0 ? (t.purchasePrice / t.estimatedUsageCount) * t.totalUsedCount : 0;
    return acc + Math.min(t.purchasePrice, depr);
  }, 0);
  const totalToolsBookValue = Math.max(0, totalToolsOriginalCost - totalToolsDepreciation);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#4a5d4e] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header & Sub-tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-brand text-[#2c332d]">
            Manajemen Inventaris & Aset Florist
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Kelola stok bahan habis pakai serta aset alat operasional dengan kalkulasi penyusutan presisi.
          </p>
        </div>

        {/* Sub-tab Pill Controls */}
        <div className="flex items-center gap-1 bg-[#2c332d]/5 p-1 rounded-xl border border-[#c07a50]/20">
          <button
            onClick={() => { setActiveSubTab('consumables'); setSearchQuery(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'consumables'
                ? 'bg-white text-[#c07a50] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Flower2 className="w-3.5 h-3.5" />
            <span>1. Bahan Sekali Pakai ({consumables.length})</span>
          </button>
          <button
            onClick={() => { setActiveSubTab('tools'); setSearchQuery(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'tools'
                ? 'bg-white text-[#4a5d4e] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>2. Alat Operasional ({tools.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CONSUMABLES */}
      {activeSubTab === 'consumables' && (
        <div className="space-y-4">
          {/* Summary Metric & Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/90 p-4 rounded-xl border border-[#c07a50]/20 shadow-xs">
              <span className="text-xs text-neutral-500">Nilai Aset Persediaan Bahan</span>
              <p className="text-lg font-bold text-[#c07a50] tabular-nums mt-1">
                {formatCurrency(totalConsumableValue)}
              </p>
              <span className="text-[11px] text-neutral-400">Total modal tertanam di bahan baku</span>
            </div>

            <div className="bg-white/90 p-4 rounded-xl border border-[#c07a50]/20 shadow-xs">
              <span className="text-xs text-neutral-500">Total Ragam Bahan</span>
              <p className="text-lg font-bold text-neutral-800 tabular-nums mt-1">
                {consumables.length} Jenis
              </p>
              <span className="text-[11px] text-neutral-400">Bunga, wrapping, pita, aksesoris</span>
            </div>

            <div className="bg-white/90 p-4 rounded-xl border border-[#c07a50]/20 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-500">Stok Perlu Perhatian</span>
                <p className="text-lg font-bold text-amber-700 tabular-nums mt-1">
                  {consumables.filter((c) => c.stock <= c.minStockAlert).length} Item
                </p>
              </div>
              <button
                onClick={openNewConsumable}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#c07a50] hover:bg-[#a8653e] text-white rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Bahan</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari bahan (misal: Mawar, Wrapping, Pita)..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white/90 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-[#c07a50]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs bg-white/90 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-[#c07a50]"
              >
                <option value="all">Semua Kategori</option>
                <option value="bunga">Bunga</option>
                <option value="wrapping">Kertas Wrapping</option>
                <option value="pita">Pita</option>
                <option value="aksesoris">Aksesoris & Kartu</option>
                <option value="perekat">Perekat / Lem</option>
                <option value="kemasan">Kemasan</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Consumables Table */}
          <div className="bg-white/95 rounded-2xl border border-[#c07a50]/20 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f4efe6]/50 border-b border-[#c07a50]/15 text-[11px] font-semibold text-neutral-600">
                    <th className="py-3 px-4">Nama Bahan</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Satuan</th>
                    <th className="py-3 px-3 text-right">Harga Beli / Unit</th>
                    <th className="py-3 px-3 text-center">Sisa Stok</th>
                    <th className="py-3 px-3 text-right">Nilai Aset Stok</th>
                    <th className="py-3 px-3 text-center">Update Cepat</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {filteredConsumables.map((item) => {
                    const isLow = item.stock <= item.minStockAlert;
                    const stockValue = item.stock * item.costPerUnit;

                    return (
                      <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-neutral-800">
                          <div className="flex items-center gap-2">
                            <span>{item.name}</span>
                            {isLow && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                Stok Tipis
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-neutral-500 capitalize">{item.category}</td>
                        <td className="py-3 px-3 text-neutral-600">{item.unit}</td>
                        <td className="py-3 px-3 text-right font-medium text-neutral-800 tabular-nums">
                          {formatCurrency(item.costPerUnit)}
                        </td>
                        <td className="py-3 px-3 text-center font-bold tabular-nums">
                          <span className={isLow ? 'text-amber-700' : 'text-neutral-800'}>
                            {formatNumber(item.stock)}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-[#c07a50] tabular-nums">
                          {formatCurrency(stockValue)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => {
                                onUpdateStock(item.id, -1);
                                showNotification(`Stok ${item.name} dikurangi 1`);
                              }}
                              title="Kurangi 1 stok"
                              className="p-1 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-200 rounded cursor-pointer"
                            >
                              <MinusCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                onUpdateStock(item.id, 5);
                                showNotification(`Stok ${item.name} ditambah 5`);
                              }}
                              title="Tambah 5 stok (Restock)"
                              className="p-1 text-[#4a5d4e] hover:bg-[#4a5d4e]/10 rounded cursor-pointer"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => openEditConsumable(item)}
                              className="p-1.5 text-neutral-500 hover:text-[#c07a50] hover:bg-neutral-100 rounded-lg cursor-pointer transition"
                              title="Edit Bahan"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setConsumableToDelete(item)}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition"
                              title="Hapus Bahan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredConsumables.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-xs text-neutral-400">
                        Tidak ada bahan yang sesuai pencarian. Klik "+ Tambah Bahan" untuk membuat baru.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: OPERATIONAL TOOLS (DEPRECIATION) */}
      {activeSubTab === 'tools' && (
        <div className="space-y-4">
          {/* Summary Metric & Educational Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/90 p-4 rounded-xl border border-[#4a5d4e]/20 shadow-xs">
              <span className="text-xs text-neutral-500">Harga Perolehan Alat Total</span>
              <p className="text-lg font-bold text-neutral-800 tabular-nums mt-1">
                {formatCurrency(totalToolsOriginalCost)}
              </p>
              <span className="text-[11px] text-neutral-400">Total belanja modal alat kerja</span>
            </div>

            <div className="bg-white/90 p-4 rounded-xl border border-[#4a5d4e]/20 shadow-xs">
              <span className="text-xs text-neutral-500">Akumulasi Penyusutan (Terserap)</span>
              <p className="text-lg font-bold text-amber-800 tabular-nums mt-1">
                {formatCurrency(totalToolsDepreciation)}
              </p>
              <span className="text-[11px] text-neutral-400">Sudah dibebankan ke HPP produk</span>
            </div>

            <div className="bg-white/90 p-4 rounded-xl border border-[#4a5d4e]/20 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-500">Nilai Buku Aset Tetap Saat Ini</span>
                <p className="text-lg font-bold text-[#4a5d4e] tabular-nums mt-1">
                  {formatCurrency(totalToolsBookValue)}
                </p>
              </div>
              <button
                onClick={openNewTool}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#4a5d4e] hover:bg-[#3d4c40] text-white rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Alat</span>
              </button>
            </div>
          </div>

          {/* Educational Accounting Guidance */}
          <div className="bg-[#4a5d4e]/10 border border-[#4a5d4e]/20 rounded-xl p-4 text-xs text-neutral-700 flex items-start gap-3">
            <Scissors className="w-5 h-5 text-[#4a5d4e] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#4a5d4e]">
                Metode Akuntansi Penyusutan Alat Operasional Florist:
              </span>
              <p className="mt-1 leading-relaxed text-[11px] text-neutral-600">
                Alat seperti gunting bunga (Rp 120.000) dan tembakan lem (Rp 75.000) digunakan untuk ratusan rangkaian buket.
                Sistem menghitung <strong>Depresiasi Satuan = Harga Perolehan / Kapasitas Pemakaian</strong>. Setiap kali buket terjual, nilai buku alat disusutkan dan dibebankan ke HPP secara proporsional.
              </p>
            </div>
          </div>

          {/* Tools Table */}
          <div className="bg-white/95 rounded-2xl border border-[#c07a50]/20 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f4efe6]/50 border-b border-[#c07a50]/15 text-[11px] font-semibold text-neutral-600">
                    <th className="py-3 px-4">Nama Alat Operasional</th>
                    <th className="py-3 px-3">Tgl Beli</th>
                    <th className="py-3 px-3 text-right">Harga Beli</th>
                    <th className="py-3 px-3 text-center">Estimasi Kapasitas</th>
                    <th className="py-3 px-3 text-right">Beban Penyusutan / Buket</th>
                    <th className="py-3 px-3 text-center">Siklus Terpakai</th>
                    <th className="py-3 px-3 text-right">Akumulasi Depresiasi</th>
                    <th className="py-3 px-3 text-right">Nilai Buku Sisa</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {filteredTools.map((tool) => {
                    const deprPerUnit = tool.estimatedUsageCount > 0 ? tool.purchasePrice / tool.estimatedUsageCount : 0;
                    const accum = deprPerUnit * tool.totalUsedCount;
                    const bookVal = Math.max(0, tool.purchasePrice - accum);

                    return (
                      <tr key={tool.id} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-neutral-800">
                          <div>{tool.name}</div>
                          {tool.notes && (
                            <span className="text-[10px] text-neutral-400 italic">{tool.notes}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-neutral-500 font-mono text-[11px]">{tool.purchaseDate}</td>
                        <td className="py-3 px-3 text-right font-medium text-neutral-800 tabular-nums">
                          {formatCurrency(tool.purchasePrice)}
                        </td>
                        <td className="py-3 px-3 text-center font-medium text-neutral-700 tabular-nums">
                          {formatNumber(tool.estimatedUsageCount)} buket
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-[#c07a50] tabular-nums">
                          {formatCurrency(deprPerUnit)}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-[#4a5d4e] tabular-nums">
                          {tool.totalUsedCount} kali
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-amber-800 tabular-nums">
                          {formatCurrency(accum)}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-neutral-900 tabular-nums">
                          {formatCurrency(bookVal)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => openEditTool(tool)}
                              className="p-1.5 text-neutral-500 hover:text-[#4a5d4e] hover:bg-neutral-100 rounded-lg cursor-pointer transition"
                              title="Edit Alat"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setToolToDelete(tool)}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition"
                              title="Hapus Alat"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTools.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-xs text-neutral-400">
                        Tidak ada alat operasional yang terdaftar. Klik "+ Tambah Alat" untuk membuat baru.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit Consumable */}
      {isConsumableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#c07a50]/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-800 font-brand">
                {editingConsumable ? 'Edit Bahan Sekali Pakai' : 'Tambah Bahan Sekali Pakai'}
              </h3>
              <button
                onClick={() => setIsConsumableModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConsumable} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Nama Bahan Baku *</label>
                <input
                  type="text"
                  required
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  placeholder="Contoh: Mawar Merah Semi-Holland"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#c07a50]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Kategori</label>
                  <select
                    value={cCategory}
                    onChange={(e) => setCCategory(e.target.value as ConsumableCategory)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                  >
                    <option value="bunga">Bunga</option>
                    <option value="wrapping">Kertas Wrapping</option>
                    <option value="pita">Pita</option>
                    <option value="aksesoris">Aksesoris / Kartu</option>
                    <option value="perekat">Perekat / Lem</option>
                    <option value="kemasan">Kemasan Luar</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Satuan</label>
                  <input
                    type="text"
                    required
                    value={cUnit}
                    onChange={(e) => setCUnit(e.target.value)}
                    placeholder="tangkai, lembar, meter, pcs"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Harga Beli / Satuan (IDR) *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={cCost}
                    onChange={(e) => setCCost(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-semibold text-[#c07a50]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Stok Saat Ini *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={cStock}
                    onChange={(e) => setCStock(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Batas Minimum Peringatan Stok</label>
                <input
                  type="number"
                  min="0"
                  value={cMinAlert}
                  onChange={(e) => setCMinAlert(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsConsumableModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-[#c07a50] hover:bg-[#a8653e] rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Simpan Bahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit Durable Tool */}
      {isToolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#4a5d4e]/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-800 font-brand">
                {editingTool ? 'Edit Alat Operasional' : 'Tambah Alat Operasional'}
              </h3>
              <button
                onClick={() => setIsToolModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTool} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Nama Alat *</label>
                <input
                  type="text"
                  required
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  placeholder="Contoh: Gunting Bunga Khusus Florist"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#4a5d4e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Harga Beli / Perolehan (IDR) *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={tPrice}
                    onChange={(e) => setTPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-semibold text-[#4a5d4e]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Tanggal Pembelian</label>
                  <input
                    type="date"
                    required
                    value={tDate}
                    onChange={(e) => setTDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Estimasi Total Kapasitas Pakai *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={tCapacity}
                    onChange={(e) => setTCapacity(e.target.value)}
                    placeholder="Contoh: 800 buket"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                  <p className="text-[10px] text-neutral-400 mt-0.5">Berapa buket alat ini bisa digunakan</p>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Sudah Digunakan (Buket)</label>
                  <input
                    type="number"
                    min="0"
                    value={tUsed}
                    onChange={(e) => setTUsed(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Live Preview Depreciation Calculation */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Beban Penyusutan per Buket:</span>
                  <span className="font-bold text-[#c07a50] tabular-nums">
                    {formatCurrency(Number(tCapacity) > 0 ? Number(tPrice) / Number(tCapacity) : 0)} / buket
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Nilai Buku Aset Sisa:</span>
                  <span className="font-bold text-[#4a5d4e] tabular-nums">
                    {formatCurrency(Math.max(0, Number(tPrice) - ((Number(tCapacity) > 0 ? Number(tPrice) / Number(tCapacity) : 0) * Number(tUsed))))}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Catatan / Merek Alat</label>
                <input
                  type="text"
                  value={tNotes}
                  onChange={(e) => setTNotes(e.target.value)}
                  placeholder="Merek Oasis, garansi 1 tahun, dsb."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsToolModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-[#4a5d4e] hover:bg-[#3d4c40] rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Simpan Alat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Consumable (Yes/No) */}
      <ConfirmModal
        isOpen={!!consumableToDelete}
        title="Hapus Bahan Sekali Pakai?"
        message={`Apakah Anda yakin ingin menghapus bahan baku "${consumableToDelete?.name}"? Sisa stok tercatat: ${consumableToDelete?.stock} ${consumableToDelete?.unit}.`}
        confirmLabel="Ya, Hapus Bahan"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={confirmDeleteConsumable}
        onCancel={() => setConsumableToDelete(null)}
      />

      {/* Confirmation Modal: Delete Tool (Yes/No) */}
      <ConfirmModal
        isOpen={!!toolToDelete}
        title="Hapus Alat Operasional?"
        message={`Apakah Anda yakin ingin menghapus alat "${toolToDelete?.name}"? Akumulasi pemakaian dan nilai penyusutan alat ini akan dihapus.`}
        confirmLabel="Ya, Hapus Alat"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={confirmDeleteTool}
        onCancel={() => setToolToDelete(null)}
      />
    </div>
  );
};
