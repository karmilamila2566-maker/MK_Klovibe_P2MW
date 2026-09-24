import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Layers,
  Scissors,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Tag,
} from 'lucide-react';
import {
  BouquetProduct,
  ConsumableItem,
  DurableTool,
  RecipeConsumable,
  RecipeTool,
} from '../types';
import {
  calculateProductHpp,
  formatCurrency,
  formatNumber,
} from '../utils/accounting';
import { ConfirmModal } from './ConfirmModal';

interface HppCalculatorProps {
  products: BouquetProduct[];
  consumables: ConsumableItem[];
  tools: DurableTool[];
  onSaveProduct: (product: BouquetProduct) => void;
  onDeleteProduct: (id: string) => void;
  onNavigateToInventory?: () => void;
}

export const HppCalculator: React.FC<HppCalculatorProps> = ({
  products,
  consumables,
  tools,
  onSaveProduct,
  onDeleteProduct,
  onNavigateToInventory,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<BouquetProduct | null>(
    products[0] || null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BouquetProduct | null>(null);

  // Form states for creating/editing recipe
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('Hand Bouquet');
  const [formDescription, setFormDescription] = useState('');
  const [formSellingPrice, setFormSellingPrice] = useState<string>('250000');
  const [formLaborCost, setFormLaborCost] = useState<string>('15000');
  const [formConsumables, setFormConsumables] = useState<RecipeConsumable[]>([]);
  const [formTools, setFormTools] = useState<RecipeTool[]>([]);

  // Confirmation Modal
  const [productToDelete, setProductToDelete] = useState<BouquetProduct | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku(`KB-BQ-${String(products.length + 1).padStart(2, '0')}`);
    setFormCategory('Hand Bouquet');
    setFormDescription('');
    setFormSellingPrice('200000');
    setFormLaborCost('15000');

    // Default template with first few consumables if available
    const defaultCons: RecipeConsumable[] = consumables.slice(0, 3).map((c) => ({
      consumableId: c.id,
      quantity: c.category === 'bunga' ? 5 : 1,
    }));
    setFormConsumables(defaultCons);

    // Default all tools with multiplier 1
    const defaultTools: RecipeTool[] = tools.map((t) => ({
      toolId: t.id,
      usageMultiplier: 1,
    }));
    setFormTools(defaultTools);

    setIsModalOpen(true);
  };

  const openEditProductModal = (product: BouquetProduct) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSku(product.sku);
    setFormCategory(product.category);
    setFormDescription(product.description || '');
    setFormSellingPrice(String(product.sellingPrice));
    setFormLaborCost(String(product.laborCostEstimate || 0));
    setFormConsumables([...product.consumables]);
    setFormTools([...product.tools]);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const productToSave: BouquetProduct = {
      id: editingProduct ? editingProduct.id : `p-${Date.now()}`,
      name: formName.trim(),
      sku: formSku.trim() || `KB-${Date.now().toString().slice(-4)}`,
      category: formCategory,
      description: formDescription.trim(),
      sellingPrice: Math.max(0, Number(formSellingPrice) || 0),
      laborCostEstimate: Math.max(0, Number(formLaborCost) || 0),
      consumables: formConsumables.filter((c) => c.quantity > 0),
      tools: formTools,
    };

    onSaveProduct(productToSave);
    setSelectedProduct(productToSave);
    setIsModalOpen(false);
    showNotification(
      editingProduct
        ? `Resep buket "${productToSave.name}" berhasil diperbarui!`
        : `Resep buket "${productToSave.name}" berhasil ditambahkan!`
    );
  };

  const confirmDeleteProduct = () => {
    if (!productToDelete) return;
    onDeleteProduct(productToDelete.id);
    if (selectedProduct?.id === productToDelete.id) {
      const remaining = products.filter((p) => p.id !== productToDelete.id);
      setSelectedProduct(remaining[0] || null);
    }
    showNotification(`Resep buket "${productToDelete.name}" telah dihapus.`);
    setProductToDelete(null);
  };

  // Recipe row operations
  const addConsumableRow = () => {
    if (consumables.length === 0) return;
    setFormConsumables((prev) => [
      ...prev,
      { consumableId: consumables[0].id, quantity: 1 },
    ]);
  };

  const removeConsumableRow = (index: number) => {
    setFormConsumables((prev) => prev.filter((_, i) => i !== index));
  };

  const updateConsumableRow = (index: number, consumableId: string, quantity: number) => {
    setFormConsumables((prev) =>
      prev.map((row, i) => (i === index ? { consumableId, quantity } : row))
    );
  };

  const toggleToolRow = (toolId: string) => {
    setFormTools((prev) => {
      const exists = prev.some((t) => t.toolId === toolId);
      if (exists) {
        return prev.filter((t) => t.toolId !== toolId);
      } else {
        return [...prev, { toolId, usageMultiplier: 1 }];
      }
    });
  };

  // Active product calculation
  const activeHpp = selectedProduct
    ? calculateProductHpp(selectedProduct, consumables, tools)
    : null;

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
            Kalkulator HPP Presisi & Resep Bouquet
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Pemisahan akuntansi presisi: Beban bahan sekali pakai (100%) vs penyusutan alat bertahap.
          </p>
        </div>

        <button
          onClick={openNewProductModal}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#c07a50] hover:bg-[#a8653e] rounded-xl shadow-xs transition cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Resep Buket Baru</span>
        </button>
      </div>

      {/* Products Grid & Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Product List */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-700 px-1">
            <span>Daftar Buket ({products.length})</span>
            <span className="text-[11px] text-neutral-400">Pilih untuk detail HPP</span>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {products.map((p) => {
              const hpp = calculateProductHpp(p, consumables, tools);
              const isSelected = selectedProduct?.id === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-white border-[#c07a50] shadow-md ring-1 ring-[#c07a50]/30'
                      : 'bg-white/80 hover:bg-white border-neutral-200/80 shadow-xs'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                        {p.sku}
                      </span>
                      <h3 className="font-bold text-sm text-neutral-800 line-clamp-1 mt-0.5">
                        {p.name}
                      </h3>
                      <span className="text-[11px] text-neutral-500">{p.category}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#c07a50] block tabular-nums">
                        {formatCurrency(p.sellingPrice)}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-[#4a5d4e]/10 text-[#4a5d4e]">
                        Margin: {hpp.grossMarginPercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>HPP: {formatCurrency(hpp.totalHpp)}</span>
                    <span className="text-[#4a5d4e] font-semibold">
                      Profit: +{formatCurrency(hpp.grossProfit)}
                    </span>
                  </div>
                </div>
              );
            })}

            {products.length === 0 && (
              <div className="bg-white/60 p-8 rounded-xl border border-dashed border-neutral-300 text-center text-xs text-neutral-500 space-y-3">
                <Layers className="w-8 h-8 text-neutral-300 mx-auto" />
                <p>Belum ada resep bouquet.</p>
                <button
                  onClick={openNewProductModal}
                  className="px-3 py-1.5 text-xs bg-[#c07a50] text-white rounded-lg cursor-pointer"
                >
                  + Tambah Resep Pertama
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed HPP Breakdown Card */}
        <div className="md:col-span-2 space-y-4">
          {selectedProduct && activeHpp ? (
            <div className="bg-white/95 rounded-2xl border border-[#c07a50]/20 shadow-xs p-6 space-y-6">
              {/* Product Header & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      {selectedProduct.sku}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#4a5d4e]/10 text-[#4a5d4e] font-medium">
                      {selectedProduct.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-brand text-[#2c332d] mt-1.5">
                    {selectedProduct.name}
                  </h3>
                  {selectedProduct.description && (
                    <p className="text-xs text-neutral-500 mt-1 max-w-xl">
                      {selectedProduct.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => openEditProductModal(selectedProduct)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg cursor-pointer transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Resep</span>
                  </button>
                  <button
                    onClick={() => setProductToDelete(selectedProduct)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>

              {/* Top Financial Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-neutral-50/80 p-3 rounded-xl border border-neutral-200">
                  <span className="text-[11px] text-neutral-500">Harga Jual Ditetapkan</span>
                  <p className="text-base font-bold text-[#c07a50] tabular-nums mt-0.5">
                    {formatCurrency(selectedProduct.sellingPrice)}
                  </p>
                </div>

                <div className="bg-neutral-50/80 p-3 rounded-xl border border-neutral-200">
                  <span className="text-[11px] text-neutral-500">Total HPP Satuan</span>
                  <p className="text-base font-bold text-amber-800 tabular-nums mt-0.5">
                    {formatCurrency(activeHpp.totalHpp)}
                  </p>
                </div>

                <div className="bg-neutral-50/80 p-3 rounded-xl border border-neutral-200">
                  <span className="text-[11px] text-neutral-500">Laba Kotor per Buket</span>
                  <p className="text-base font-bold text-[#4a5d4e] tabular-nums mt-0.5">
                    +{formatCurrency(activeHpp.grossProfit)}
                  </p>
                </div>

                <div className="bg-neutral-50/80 p-3 rounded-xl border border-neutral-200">
                  <span className="text-[11px] text-neutral-500">Margin Keuntungan</span>
                  <p className="text-base font-bold text-neutral-800 tabular-nums mt-0.5">
                    {activeHpp.grossMarginPercent.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Section 1: Consumables Breakdown */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                    <span>1. Bahan Habis Pakai (Consumables - Beban 100% Satuan)</span>
                  </h4>
                  <span className="text-xs font-bold text-[#c07a50] tabular-nums">
                    Subtotal: {formatCurrency(activeHpp.consumableCost)}
                  </span>
                </div>

                <div className="border border-neutral-200/80 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] text-neutral-500">
                        <th className="py-2 px-3">Bahan</th>
                        <th className="py-2 px-3 text-center">Pemakaian</th>
                        <th className="py-2 px-3 text-right">Harga Beli Satuan</th>
                        <th className="py-2 px-3 text-right">Subtotal Biaya</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {activeHpp.consumableBreakdown.map((row, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50/60">
                          <td className="py-2 px-3 font-medium text-neutral-800">{row.item.name}</td>
                          <td className="py-2 px-3 text-center text-neutral-600 tabular-nums">
                            {formatNumber(row.quantity)} {row.item.unit}
                          </td>
                          <td className="py-2 px-3 text-right text-neutral-500 tabular-nums">
                            {formatCurrency(row.item.costPerUnit)}
                          </td>
                          <td className="py-2 px-3 text-right font-semibold text-neutral-800 tabular-nums">
                            {formatCurrency(row.subtotal)}
                          </td>
                        </tr>
                      ))}
                      {activeHpp.consumableBreakdown.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-neutral-400 text-xs">
                            Belum ada bahan sekali pakai dalam resep ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 2: Durable Tools Depreciation Breakdown */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                    <span>2. Penyusutan Alat Operasional (Durable Goods Depreciation)</span>
                  </h4>
                  <span className="text-xs font-bold text-[#4a5d4e] tabular-nums">
                    Subtotal: {formatCurrency(activeHpp.toolDepreciationCost)}
                  </span>
                </div>

                <div className="border border-neutral-200/80 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] text-neutral-500">
                        <th className="py-2 px-3">Alat Kerja</th>
                        <th className="py-2 px-3 text-right">Harga Beli Alat</th>
                        <th className="py-2 px-3 text-center">Estimasi Kapasitas</th>
                        <th className="py-2 px-3 text-right">Beban Depresiasi / Buket</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {activeHpp.toolBreakdown.map((row, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50/60">
                          <td className="py-2 px-3 font-medium text-neutral-800">{row.tool.name}</td>
                          <td className="py-2 px-3 text-right text-neutral-500 tabular-nums">
                            {formatCurrency(row.tool.purchasePrice)}
                          </td>
                          <td className="py-2 px-3 text-center text-neutral-600 tabular-nums">
                            {formatNumber(row.tool.estimatedUsageCount)} buket
                          </td>
                          <td className="py-2 px-3 text-right font-semibold text-[#4a5d4e] tabular-nums">
                            {formatCurrency(row.depreciationPerUnit)}
                          </td>
                        </tr>
                      ))}
                      {activeHpp.toolBreakdown.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-neutral-400 text-xs">
                            Tidak ada alat operasional yang dikaitkan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/60 p-12 rounded-2xl border border-neutral-200 text-center text-neutral-400 space-y-2">
              <Layers className="w-10 h-10 mx-auto text-neutral-300" />
              <p className="text-sm">Silakan pilih buket di sebelah kiri untuk melihat rincian HPP presisi.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Buat/Edit Resep Produk Buket */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-[#c07a50]/20 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-800 font-brand">
                {editingProduct ? 'Edit Resep Buket' : 'Buat Resep Buket Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-neutral-700 mb-1">Nama Buket *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Scarlet Romance Hand Bouquet"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Kode SKU</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Kategori Buket</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                  >
                    <option value="Hand Bouquet">Hand Bouquet</option>
                    <option value="Bloom Box">Bloom Box</option>
                    <option value="Money Bouquet">Money Bouquet</option>
                    <option value="Graduation Bouquet">Graduation Bouquet</option>
                    <option value="Wedding Bouquet">Wedding Bouquet</option>
                    <option value="Single Flower">Single Flower</option>
                    <option value="Custom Bouquet">Custom Bouquet</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Harga Jual Rencana (IDR) *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formSellingPrice}
                    onChange={(e) => setFormSellingPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-bold text-[#c07a50]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Deskripsi Singkat Rangkaian</label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Kombinasi 10 mawar merah, baby breath, wrapping gold edge..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                />
              </div>

              {/* Recipe Consumables Editor */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-800">
                    Bahan Habis Pakai dalam 1 Buket (Consumables)
                  </span>
                  <button
                    type="button"
                    onClick={addConsumableRow}
                    className="text-xs text-[#c07a50] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Baris Bahan</span>
                  </button>
                </div>

                {consumables.length === 0 ? (
                  <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-xs">
                    Belum ada master bahan baku. Silakan buat bahan baku terlebih dahulu di tab Inventaris.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {formConsumables.map((row, idx) => {
                      const item = consumables.find((c) => c.id === row.consumableId);
                      return (
                        <div key={idx} className="flex items-center gap-2 bg-neutral-50 p-2 rounded-lg border border-neutral-200">
                          <select
                            value={row.consumableId}
                            onChange={(e) => updateConsumableRow(idx, e.target.value, row.quantity)}
                            className="flex-1 px-2 py-1.5 bg-white border border-neutral-300 rounded text-xs"
                          >
                            {consumables.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({formatCurrency(c.costPerUnit)}/{c.unit})
                              </option>
                            ))}
                          </select>

                          <div className="flex items-center gap-1 w-28 shrink-0">
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={row.quantity}
                              onChange={(e) => updateConsumableRow(idx, row.consumableId, Number(e.target.value))}
                              className="w-16 px-2 py-1.5 bg-white border border-neutral-300 rounded text-xs text-center font-bold"
                            />
                            <span className="text-[11px] text-neutral-500 truncate">{item?.unit}</span>
                          </div>

                          <span className="w-24 text-right font-medium text-xs tabular-nums shrink-0">
                            {formatCurrency((item?.costPerUnit || 0) * row.quantity)}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeConsumableRow(idx)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recipe Tools Toggle */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <span className="font-bold text-neutral-800 block">
                  Penyusutan Alat Operasional yang Terpakai
                </span>
                <p className="text-[11px] text-neutral-500">
                  Centang alat yang digunakan saat merangkai buket ini untuk membebankan biaya depresiasi secara otomatis.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {tools.map((tool) => {
                    const isChecked = formTools.some((t) => t.toolId === tool.id);
                    const depr = tool.estimatedUsageCount > 0 ? tool.purchasePrice / tool.estimatedUsageCount : 0;

                    return (
                      <label
                        key={tool.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                          isChecked
                            ? 'bg-[#4a5d4e]/10 border-[#4a5d4e]/40 text-[#2c332d]'
                            : 'bg-white border-neutral-200 text-neutral-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleToolRow(tool.id)}
                          className="rounded text-[#4a5d4e] accent-[#4a5d4e]"
                        />
                        <div className="truncate flex-1">
                          <div className="font-medium truncate">{tool.name}</div>
                          <div className="text-[10px] text-neutral-500">+{formatCurrency(depr)}/buket</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
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
                  Simpan Resep Buket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Product (Yes/No) */}
      <ConfirmModal
        isOpen={!!productToDelete}
        title="Hapus Resep Buket?"
        message={`Apakah Anda yakin ingin menghapus resep buket "${productToDelete?.name}"? Data resep ini akan dihapus permanen.`}
        confirmLabel="Ya, Hapus Resep"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={confirmDeleteProduct}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
};
