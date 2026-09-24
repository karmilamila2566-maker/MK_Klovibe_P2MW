/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { HppCalculator } from './components/HppCalculator';
import { InventoryManager } from './components/InventoryManager';
import { TransactionsManager } from './components/TransactionsManager';
import { ExpensesManager } from './components/ExpensesManager';
import { FinancialReports } from './components/FinancialReports';
import { SettingsModal } from './components/SettingsModal';

import {
  ConsumableItem,
  DurableTool,
  BouquetProduct,
  SaleTransaction,
  ExpenseItem,
  AppSettings,
} from './types';
import {
  getAppStorage,
  saveToStorage,
  resetAppStorage,
  STORAGE_KEYS,
  INITIAL_CONSUMABLES,
  INITIAL_TOOLS,
  INITIAL_PRODUCTS,
  INITIAL_TRANSACTIONS,
  INITIAL_EXPENSES,
  INITIAL_SETTINGS,
} from './utils/storage';
import { calculateFinancialSummary } from './utils/accounting';
import { downloadStandaloneFile } from './utils/exportHtml';

export default function App() {
  // Load initial state from localStorage (fresh session starts with 0 transactions)
  const initial = useMemo(() => getAppStorage(), []);

  const [consumables, setConsumables] = useState<ConsumableItem[]>(initial.consumables);
  const [tools, setTools] = useState<DurableTool[]>(initial.tools);
  const [products, setProducts] = useState<BouquetProduct[]>(initial.products);
  const [transactions, setTransactions] = useState<SaleTransaction[]>(initial.transactions);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initial.expenses);
  const [settings, setSettings] = useState<AppSettings>(initial.settings);

  // Active view tab & modals
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to localStorage whenever states change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CONSUMABLES, consumables);
  }, [consumables]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TOOLS, tools);
  }, [tools]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  }, [transactions]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  }, [expenses]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  // Real-Time Financial Accounting Summary
  const financialSummary = useMemo(() => {
    return calculateFinancialSummary(transactions, expenses, consumables, tools, settings);
  }, [transactions, expenses, consumables, tools, settings]);

  // --- CRUD Handlers: Consumables ---
  const handleSaveConsumable = (item: ConsumableItem) => {
    setConsumables((prev) => {
      const idx = prev.findIndex((c) => c.id === item.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = item;
        return updated;
      }
      return [item, ...prev];
    });
  };

  const handleDeleteConsumable = (id: string) => {
    setConsumables((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateStock = (id: string, delta: number) => {
    setConsumables((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stock: Math.max(0, c.stock + delta) } : c))
    );
  };

  // --- CRUD Handlers: Durable Tools ---
  const handleSaveTool = (tool: DurableTool) => {
    setTools((prev) => {
      const idx = prev.findIndex((t) => t.id === tool.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = tool;
        return updated;
      }
      return [tool, ...prev];
    });
  };

  const handleDeleteTool = (id: string) => {
    setTools((prev) => prev.filter((t) => t.id !== id));
  };

  // --- CRUD Handlers: Products & Recipes ---
  const handleSaveProduct = (product: BouquetProduct) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = product;
        return updated;
      }
      return [product, ...prev];
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // --- CRUD Handlers: Transactions (With Automatic Stock & Tool Deduction & Rollback) ---
  const handleSaveTransaction = (trx: SaleTransaction, isNew: boolean) => {
    if (isNew) {
      // Find the product recipe and deduct stock of consumables + increment tool usage
      const product = products.find((p) => p.id === trx.productId);
      if (product) {
        // 1. Deduct consumables
        const deductionMap = new Map<string, number>();
        for (const item of product.consumables) {
          const totalQty = item.quantity * trx.quantity;
          deductionMap.set(item.consumableId, (deductionMap.get(item.consumableId) || 0) + totalQty);
        }

        setConsumables((prev) =>
          prev.map((c) => {
            const deduction = deductionMap.get(c.id);
            if (deduction) {
              return { ...c, stock: Math.max(0, c.stock - deduction) };
            }
            return c;
          })
        );

        // 2. Increment tool cycles
        const toolUsageMap = new Map<string, number>();
        for (const item of product.tools) {
          const cycles = (item.usageMultiplier || 1) * trx.quantity;
          toolUsageMap.set(item.toolId, (toolUsageMap.get(item.toolId) || 0) + cycles);
        }

        setTools((prev) =>
          prev.map((t) => {
            const added = toolUsageMap.get(t.id);
            if (added) {
              return { ...t, totalUsedCount: t.totalUsedCount + added };
            }
            return t;
          })
        );
      }

      setTransactions((prev) => [trx, ...prev]);
    } else {
      // Editing existing transaction: Reconcile stock and tool usage
      const oldTrx = transactions.find((t) => t.id === trx.id);
      if (oldTrx) {
        const oldProduct = products.find((p) => p.id === oldTrx.productId);
        const newProduct = products.find((p) => p.id === trx.productId);

        // Calculate net changes for consumables
        const consumableDelta = new Map<string, number>();
        if (oldProduct) {
          for (const item of oldProduct.consumables) {
            consumableDelta.set(
              item.consumableId,
              (consumableDelta.get(item.consumableId) || 0) + item.quantity * oldTrx.quantity
            );
          }
        }
        if (newProduct) {
          for (const item of newProduct.consumables) {
            consumableDelta.set(
              item.consumableId,
              (consumableDelta.get(item.consumableId) || 0) - item.quantity * trx.quantity
            );
          }
        }

        setConsumables((prev) =>
          prev.map((c) => {
            const delta = consumableDelta.get(c.id);
            if (delta !== undefined) {
              return { ...c, stock: Math.max(0, c.stock + delta) };
            }
            return c;
          })
        );

        // Calculate net changes for tools
        const toolDelta = new Map<string, number>();
        if (oldProduct) {
          for (const item of oldProduct.tools) {
            toolDelta.set(
              item.toolId,
              (toolDelta.get(item.toolId) || 0) - (item.usageMultiplier || 1) * oldTrx.quantity
            );
          }
        }
        if (newProduct) {
          for (const item of newProduct.tools) {
            toolDelta.set(
              item.toolId,
              (toolDelta.get(item.toolId) || 0) + (item.usageMultiplier || 1) * trx.quantity
            );
          }
        }

        setTools((prev) =>
          prev.map((t) => {
            const delta = toolDelta.get(t.id);
            if (delta !== undefined) {
              return { ...t, totalUsedCount: Math.max(0, t.totalUsedCount + delta) };
            }
            return t;
          })
        );
      }

      setTransactions((prev) => prev.map((t) => (t.id === trx.id ? trx : t)));
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const found = transactions.find((t) => t.id === id);
    if (!found) return;

    // Rollback stock and tool usage
    const product = products.find((p) => p.id === found.productId);
    if (product) {
      const rollbackMap = new Map<string, number>();
      for (const item of product.consumables) {
        const totalQty = item.quantity * found.quantity;
        rollbackMap.set(item.consumableId, (rollbackMap.get(item.consumableId) || 0) + totalQty);
      }

      setConsumables((prev) =>
        prev.map((c) => {
          const rollback = rollbackMap.get(c.id);
          if (rollback) {
            return { ...c, stock: c.stock + rollback };
          }
          return c;
        })
      );

      const toolRollbackMap = new Map<string, number>();
      for (const item of product.tools) {
        const cycles = (item.usageMultiplier || 1) * found.quantity;
        toolRollbackMap.set(item.toolId, (toolRollbackMap.get(item.toolId) || 0) + cycles);
      }

      setTools((prev) =>
        prev.map((t) => {
          const sub = toolRollbackMap.get(t.id);
          if (sub) {
            return { ...t, totalUsedCount: Math.max(0, t.totalUsedCount - sub) };
          }
          return t;
        })
      );
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // --- CRUD Handlers: Expenses (OpEx) ---
  const handleSaveExpense = (exp: ExpenseItem) => {
    setExpenses((prev) => {
      const idx = prev.findIndex((e) => e.id === exp.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = exp;
        return updated;
      }
      return [exp, ...prev];
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // --- Reset & Import/Export Data ---
  const handleResetData = () => {
    resetAppStorage();
    setConsumables(INITIAL_CONSUMABLES);
    setTools(INITIAL_TOOLS);
    setProducts(INITIAL_PRODUCTS);
    setTransactions(INITIAL_TRANSACTIONS); // starts with 0 transactions
    setExpenses(INITIAL_EXPENSES); // starts with 0 expenses
    setSettings(INITIAL_SETTINGS);
    showToast('Data berhasil diatur ulang: 0 transaksi (mulai dari awal)!');
  };

  const handleExportJson = () => {
    const data = {
      consumables,
      tools,
      products,
      transactions,
      expenses,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `klovibe_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data berhasil diekspor ke file JSON!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.consumables) setConsumables(data.consumables);
        if (data.tools) setTools(data.tools);
        if (data.products) setProducts(data.products);
        if (data.transactions) setTransactions(data.transactions);
        if (data.expenses) setExpenses(data.expenses);
        if (data.settings) setSettings(data.settings);
        showToast('Data berhasil di-import dan diperbarui!');
        setIsSettingsModalOpen(false);
      } catch (err) {
        showToast('Gagal memuat file JSON. Pastikan format valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-[#c07a50]/20 selection:text-[#c07a50]">
      {/* Dynamic Background Image Overlay (Saved in localStorage / Base64) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          backgroundImage: settings.bgImageBase64
            ? `url(${settings.bgImageBase64})`
            : `radial-gradient(circle at 10% 20%, rgba(192, 122, 80, 0.05) 0%, transparent 40%),
               radial-gradient(circle at 90% 80%, rgba(74, 93, 78, 0.06) 0%, transparent 40%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: settings.bgImageBase64 ? (settings.bgOpacity || 15) / 100 : 1,
          filter: settings.bgImageBase64 && settings.bgBlur ? `blur(${settings.bgBlur}px)` : 'none',
        }}
      />

      {/* Global In-App Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#4a5d4e] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        settings={settings}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onDownloadHtml={downloadStandaloneFile}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 relative">
        {activeTab === 'dashboard' && (
          <Dashboard
            summary={financialSummary}
            transactions={transactions}
            consumables={consumables}
            tools={tools}
            products={products}
            settings={settings}
            onNavigate={setActiveTab}
            onOpenNewTransaction={() => setActiveTab('transactions')}
            onOpenNewProduct={() => setActiveTab('calculator')}
          />
        )}

        {activeTab === 'calculator' && (
          <HppCalculator
            products={products}
            consumables={consumables}
            tools={tools}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onNavigateToInventory={() => setActiveTab('inventory')}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryManager
            consumables={consumables}
            tools={tools}
            onSaveConsumable={handleSaveConsumable}
            onDeleteConsumable={handleDeleteConsumable}
            onUpdateStock={handleUpdateStock}
            onSaveTool={handleSaveTool}
            onDeleteTool={handleDeleteTool}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsManager
            transactions={transactions}
            products={products}
            consumables={consumables}
            tools={tools}
            onSaveTransaction={handleSaveTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesManager
            expenses={expenses}
            onSaveExpense={handleSaveExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {activeTab === 'reports' && (
          <FinancialReports
            summary={financialSummary}
            settings={settings}
            transactions={transactions}
            expenses={expenses}
          />
        )}
      </main>

      {/* Aesthetic Footer */}
      <footer className="z-10 relative bg-[#f4efe6]/80 backdrop-blur-xs border-t border-[#c07a50]/20 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#c07a50] font-brand">{settings.storeName}</span>
            <span>·</span>
            <span className="italic font-brand">"{settings.slogan}"</span>
          </div>
          <div>
            <span>Sistem Manajemen Keuangan & HPP Bouquet · Presisi Akuntansi · Offline-First</span>
          </div>
        </div>
      </footer>

      {/* Settings & Customization Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        settings={settings}
        onClose={() => setIsSettingsModalOpen(false)}
        onSaveSettings={setSettings}
        onDownloadHtml={downloadStandaloneFile}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onResetData={handleResetData}
      />
    </div>
  );
}
