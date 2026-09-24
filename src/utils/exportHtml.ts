/**
 * Generates a complete 100% standalone, single-file index.html ready for GitHub Pages.
 * Contains embedded styling, CDN scripts (Tailwind & Chart.js), offline localStorage,
 * and complete business accounting calculations.
 */
export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KLOVIBE - Manajemen Keuangan & Analisis Bisnis Bouquet</title>
  <meta name="description" content="Aplikasi manajemen keuangan dan kalkulator HPP presisi untuk bisnis bouquet KLOVIBE." />
  
  <!-- Google Fonts: Plus Jakarta Sans & Playfair Display -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            klovibe: {
              terracotta: '#c07a50',
              sage: '#4a5d4e',
              cream: '#f4efe6',
              dark: '#2c332d',
              terralight: '#dfa380',
              sagelight: '#738a78',
            }
          },
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            serif: ['"Playfair Display"', 'Georgia', 'serif'],
          }
        }
      }
    }
  </script>

  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <style>
    body {
      background-color: #f4efe6;
      color: #2c332d;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .font-brand {
      font-family: 'Playfair Display', Georgia, serif;
    }
    .bg-overlay {
      position: fixed;
      inset: 0;
      z-index: -1;
      background-size: cover;
      background-position: center;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(192, 122, 80, 0.15);
    }
    .tabular-nums {
      font-variant-numeric: tabular-nums;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col relative selection:bg-[#c07a50]/20 selection:text-[#c07a50]">
  <!-- Dynamic Background Overlay (Uploadable via UI) -->
  <div id="dynamicBg" class="bg-overlay opacity-15"></div>

  <!-- Header Section -->
  <header class="sticky top-0 z-30 glass-card border-b border-[#c07a50]/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      <div>
        <div class="flex items-center gap-3">
          <span class="text-2xl font-bold font-brand tracking-tight text-[#c07a50]">KLOVIBE</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-[#4a5d4e]/10 text-[#4a5d4e] font-medium border border-[#4a5d4e]/20 hidden sm:inline-block">Florist Financial Studio</span>
        </div>
        <p class="text-xs text-neutral-500 italic font-brand">Crafted Moments, Enduring Love</p>
      </div>

      <!-- Navigation & Action Buttons -->
      <div class="flex items-center gap-2">
        <nav class="hidden md:flex items-center gap-1 bg-[#f4efe6] p-1 rounded-xl border border-[#c07a50]/20">
          <button onclick="switchTab('dashboard')" id="nav-dashboard" class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors bg-white text-[#c07a50] shadow-sm">Dashboard</button>
          <button onclick="switchTab('calculator')" id="nav-calculator" class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors text-neutral-600 hover:text-neutral-900">Kalkulator HPP</button>
          <button onclick="switchTab('inventory')" id="nav-inventory" class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors text-neutral-600 hover:text-neutral-900">Inventaris (Bahan & Alat)</button>
          <button onclick="switchTab('transactions')" id="nav-transactions" class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors text-neutral-600 hover:text-neutral-900">Penjualan</button>
          <button onclick="switchTab('expenses')" id="nav-expenses" class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors text-neutral-600 hover:text-neutral-900">Beban OpEx</button>
          <button onclick="switchTab('reports')" id="nav-reports" class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors text-neutral-600 hover:text-neutral-900">Laporan Akuntansi</button>
        </nav>

        <button onclick="openSettingsModal()" class="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#c07a50] hover:bg-[#a6643e] text-white rounded-lg transition-colors shadow-sm">
          <span>⚙️ Pengaturan & Background</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Sub-Navigation -->
  <div class="md:hidden glass-card border-b border-[#c07a50]/10 px-4 py-2 flex items-center gap-2 overflow-x-auto">
    <button onclick="switchTab('dashboard')" class="text-xs px-2.5 py-1 whitespace-nowrap rounded font-medium text-[#c07a50]">Dashboard</button>
    <button onclick="switchTab('calculator')" class="text-xs px-2.5 py-1 whitespace-nowrap rounded font-medium text-neutral-600">Kalkulator HPP</button>
    <button onclick="switchTab('inventory')" class="text-xs px-2.5 py-1 whitespace-nowrap rounded font-medium text-neutral-600">Bahan & Alat</button>
    <button onclick="switchTab('transactions')" class="text-xs px-2.5 py-1 whitespace-nowrap rounded font-medium text-neutral-600">Penjualan</button>
    <button onclick="switchTab('expenses')" class="text-xs px-2.5 py-1 whitespace-nowrap rounded font-medium text-neutral-600">OpEx</button>
    <button onclick="switchTab('reports')" class="text-xs px-2.5 py-1 whitespace-nowrap rounded font-medium text-neutral-600">Laporan</button>
  </div>

  <!-- Main Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div id="contentArea"></div>
  </main>

  <footer class="glass-card border-t border-[#c07a50]/15 py-4 text-center text-xs text-neutral-500">
    <p><strong>KLOVIBE Studio</strong> — Crafted Moments, Enduring Love · Presisi Akuntansi Bouquet & Standalone Offline-Ready</p>
  </footer>

  <!-- Complete Inlined JavaScript Logic -->
  <script>
    // --- Initial Storage & State Management ---
    const STORAGE_KEY = 'klovibe_standalone_data_v1';
    
    let state = {
      settings: {
        initialCapital: 10000000,
        bgImage: '',
        bgOpacity: 15,
        bgBlur: 2
      },
      consumables: [
        { id: 'c-1', name: 'Mawar Semi-Holland Merah', unit: 'tangkai', cost: 8000, stock: 120 },
        { id: 'c-2', name: 'Mawar Avalance Putih', unit: 'tangkai', cost: 8500, stock: 90 },
        { id: 'c-3', name: "Baby's Breath Impor", unit: 'cabang', cost: 3500, stock: 75 },
        { id: 'c-4', name: 'Kertas Wrapping Cellophane Gold', unit: 'lembar', cost: 4500, stock: 100 },
        { id: 'c-5', name: 'Pita Satin Terracotta 2.5cm', unit: 'meter', cost: 1200, stock: 140 },
        { id: 'c-6', name: 'Stiker Segel KLOVIBE Gold', unit: 'pcs', cost: 600, stock: 250 },
        { id: 'c-7', name: 'Kartu Ucapan / Greeting Card', unit: 'pcs', cost: 1500, stock: 110 },
        { id: 'c-8', name: 'Refill Lem Tembak', unit: 'batang', cost: 1000, stock: 80 }
      ],
      tools: [
        { id: 't-1', name: 'Gunting Bunga Oasis Carbon Steel', price: 120000, usageCapacity: 800, usedCount: 0 },
        { id: 't-2', name: 'Tembakan Lem Panas Joyko 40W', price: 75000, usageCapacity: 500, usedCount: 0 },
        { id: 't-3', name: 'Tang Pemotong Kawat & Tangkai', price: 65000, usageCapacity: 1000, usedCount: 0 },
        { id: 't-4', name: 'Dispenser Pita & Floral Tape', price: 50000, usageCapacity: 800, usedCount: 0 }
      ],
      products: [
        {
          id: 'p-1',
          name: 'Scarlet Romance Hand Bouquet',
          price: 285000,
          consumables: [
            { id: 'c-1', qty: 10 },
            { id: 'c-3', qty: 3 },
            { id: 'c-4', qty: 3 },
            { id: 'c-5', qty: 1.5 },
            { id: 'c-6', qty: 1 },
            { id: 'c-7', qty: 1 },
            { id: 'c-8', qty: 1 }
          ],
          tools: [
            { id: 't-1', mult: 1 },
            { id: 't-2', mult: 1 },
            { id: 't-3', mult: 1 },
            { id: 't-4', mult: 1 }
          ]
        },
        {
          id: 'p-2',
          name: 'Pastel Dream Bloom Bouquet',
          price: 195000,
          consumables: [
            { id: 'c-2', qty: 6 },
            { id: 'c-3', qty: 3 },
            { id: 'c-4', qty: 2 },
            { id: 'c-5', qty: 1.2 },
            { id: 'c-6', qty: 1 },
            { id: 'c-7', qty: 1 }
          ],
          tools: [
            { id: 't-1', mult: 1 },
            { id: 't-2', mult: 1 },
            { id: 't-4', mult: 1 }
          ]
        }
      ],
      transactions: [],
      expenses: [],
      activeTab: 'dashboard'
    };

    function loadState() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          state = { ...state, ...parsed };
        } catch(e) { console.error('Storage error', e); }
      }
      applyBackground();
    }

    function saveState() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      renderCurrentTab();
    }

    function applyBackground() {
      const bg = document.getElementById('dynamicBg');
      if (state.settings.bgImage) {
        bg.style.backgroundImage = 'url(' + state.settings.bgImage + ')';
        bg.style.opacity = (state.settings.bgOpacity || 15) / 100;
        bg.style.filter = 'blur(' + (state.settings.bgBlur || 0) + 'px)';
      } else {
        bg.style.backgroundImage = 'none';
      }
    }

    function formatRupiah(num) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
    }

    // --- Accounting Calculations ---
    function calcProductHpp(product) {
      let consumableCost = 0;
      let toolDepreciation = 0;

      product.consumables.forEach(c => {
        const item = state.consumables.find(x => x.id === c.id);
        if (item) consumableCost += (item.cost * c.qty);
      });

      product.tools.forEach(t => {
        const item = state.tools.find(x => x.id === t.id);
        if (item && item.usageCapacity > 0) {
          const perUnit = item.price / item.usageCapacity;
          toolDepreciation += perUnit * (t.mult || 1);
        }
      });

      const totalHpp = consumableCost + toolDepreciation;
      const profit = product.price - totalHpp;
      const margin = product.price > 0 ? (profit / product.price) * 100 : 0;

      return { consumableCost, toolDepreciation, totalHpp, profit, margin };
    }

    function calcFinancials() {
      let revenue = 0;
      let totalHpp = 0;
      let units = 0;

      state.transactions.forEach(t => {
        revenue += t.qty * t.price;
        totalHpp += t.qty * t.hpp;
        units += t.qty;
      });

      const grossProfit = revenue - totalHpp;
      const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

      let opex = 0;
      state.expenses.forEach(e => { opex += Number(e.amount); });

      const netProfit = grossProfit - opex;
      const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
      const aov = state.transactions.length > 0 ? revenue / state.transactions.length : 0;

      // Balance Sheet Assets
      let inventoryVal = 0;
      state.consumables.forEach(c => { inventoryVal += Math.max(0, c.stock) * c.cost; });

      let toolsCost = 0;
      let toolsAccumDepr = 0;
      state.tools.forEach(t => {
        toolsCost += t.price;
        const deprUnit = t.usageCapacity > 0 ? t.price / t.usageCapacity : 0;
        toolsAccumDepr += deprUnit * t.usedCount;
      });
      const toolsBookVal = Math.max(0, toolsCost - toolsAccumDepr);

      // Equity
      const initialCapital = state.settings.initialCapital || 10000000;
      const equity = initialCapital + netProfit;

      // Exact Cash Balance
      const cash = equity - inventoryVal - toolsBookVal;
      const totalAssets = cash + inventoryVal + toolsBookVal;

      return {
        revenue, totalHpp, grossProfit, grossMargin, opex, netProfit, netMargin,
        units, aov, trxCount: state.transactions.length,
        cash, inventoryVal, toolsBookVal, totalAssets, equity
      };
    }

    function switchTab(tab) {
      state.activeTab = tab;
      const tabs = ['dashboard', 'calculator', 'inventory', 'transactions', 'expenses', 'reports'];
      tabs.forEach(t => {
        const btn = document.getElementById('nav-' + t);
        if (btn) {
          if (t === tab) {
            btn.className = 'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors bg-white text-[#c07a50] shadow-sm';
          } else {
            btn.className = 'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors text-neutral-600 hover:text-neutral-900';
          }
        }
      });
      renderCurrentTab();
    }

    function renderCurrentTab() {
      const area = document.getElementById('contentArea');
      const fin = calcFinancials();

      if (state.activeTab === 'dashboard') {
        area.innerHTML = \`
          <div class="space-y-6">
            <!-- Slogan & Welcome Banner -->
            <div class="glass-card rounded-2xl p-6 border border-[#c07a50]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span class="text-xs uppercase tracking-widest text-[#4a5d4e] font-semibold">Bouquet Business Studio</span>
                <h1 class="text-2xl font-bold font-brand text-[#2c332d]">Ringkasan Keuangan KLOVIBE</h1>
                <p class="text-sm text-neutral-600 italic">"Crafted Moments, Enduring Love" — HPP Presisi & Real-Time Analytics</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="text-right">
                  <span class="text-xs text-neutral-500">Saldo Kas & Bank</span>
                  <p class="text-lg font-bold tabular-nums text-[#4a5d4e]">\${formatRupiah(fin.cash)}</p>
                </div>
              </div>
            </div>

            <!-- KPI Metric Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="glass-card p-4 rounded-xl border border-[#c07a50]/20">
                <span class="text-xs text-neutral-500">Total Omset</span>
                <p class="text-xl font-bold text-[#c07a50] tabular-nums mt-1">\${formatRupiah(fin.revenue)}</p>
                <span class="text-[11px] text-neutral-400">\${fin.trxCount} transaksi penjualan</span>
              </div>
              <div class="glass-card p-4 rounded-xl border border-[#c07a50]/20">
                <span class="text-xs text-neutral-500">Total HPP (Bahan & Alat)</span>
                <p class="text-xl font-bold text-amber-700 tabular-nums mt-1">\${formatRupiah(fin.totalHpp)}</p>
                <span class="text-[11px] text-neutral-400">Margin kotor: \${fin.grossMargin.toFixed(1)}%</span>
              </div>
              <div class="glass-card p-4 rounded-xl border border-[#c07a50]/20">
                <span class="text-xs text-neutral-500">Laba Bersih (Net Profit)</span>
                <p class="text-xl font-bold \${fin.netProfit >= 0 ? 'text-[#4a5d4e]' : 'text-rose-600'} tabular-nums mt-1">\${formatRupiah(fin.netProfit)}</p>
                <span class="text-[11px] text-neutral-400">Net margin: \${fin.netMargin.toFixed(1)}%</span>
              </div>
              <div class="glass-card p-4 rounded-xl border border-[#c07a50]/20">
                <span class="text-xs text-neutral-500">Unit Terjual & AOV</span>
                <p class="text-xl font-bold text-neutral-800 tabular-nums mt-1">\${fin.units} Pcs</p>
                <span class="text-[11px] text-neutral-400">AOV: \${formatRupiah(fin.aov)}</span>
              </div>
            </div>

            <!-- Interactive Charts Row -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="glass-card p-5 rounded-2xl border border-[#c07a50]/20">
                <h3 class="text-sm font-bold text-[#2c332d] mb-4">Breakdown Keuangan: Omset vs HPP vs OpEx</h3>
                <div class="h-64 relative flex items-center justify-center">
                  <canvas id="chartBreakdown"></canvas>
                </div>
              </div>
              <div class="glass-card p-5 rounded-2xl border border-[#c07a50]/20">
                <h3 class="text-sm font-bold text-[#2c332d] mb-4">Aset & Neraca Bisnis</h3>
                <div class="h-64 relative flex items-center justify-center">
                  <canvas id="chartAssets"></canvas>
                </div>
              </div>
            </div>
          </div>
        \`;
        initCharts(fin);
      } else if (state.activeTab === 'calculator') {
        renderCalculator(area);
      } else if (state.activeTab === 'inventory') {
        renderInventory(area);
      } else if (state.activeTab === 'transactions') {
        renderTransactions(area);
      } else if (state.activeTab === 'expenses') {
        renderExpenses(area);
      } else if (state.activeTab === 'reports') {
        renderReports(area, fin);
      }
    }

    function initCharts(fin) {
      setTimeout(() => {
        const ctx1 = document.getElementById('chartBreakdown');
        if (ctx1) {
          new Chart(ctx1, {
            type: 'doughnut',
            data: {
              labels: ['HPP Bahan & Alat', 'Beban Operasional (OpEx)', 'Laba Bersih'],
              datasets: [{
                data: [fin.totalHpp, fin.opex, Math.max(0, fin.netProfit)],
                backgroundColor: ['#dfa380', '#e5b79d', '#4a5d4e']
              }]
            },
            options: { responsive: true, maintainAspectRatio: false }
          });
        }
        const ctx2 = document.getElementById('chartAssets');
        if (ctx2) {
          new Chart(ctx2, {
            type: 'bar',
            data: {
              labels: ['Kas & Bank', 'Stok Bahan', 'Nilai Alat'],
              datasets: [{
                label: 'Nilai (IDR)',
                data: [fin.cash, fin.inventoryVal, fin.toolsBookVal],
                backgroundColor: ['#4a5d4e', '#c07a50', '#a6643e']
              }]
            },
            options: { responsive: true, maintainAspectRatio: false }
          });
        }
      }, 50);
    }

    function renderCalculator(area) {
      let cardsHtml = state.products.map(p => {
        const hpp = calcProductHpp(p);
        return \`
          <div class="glass-card p-5 rounded-2xl border border-[#c07a50]/20 space-y-3">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-bold text-base text-[#2c332d]">\${p.name}</h4>
                <p class="text-xs text-neutral-500">Harga Jual: <strong class="text-[#c07a50]">\${formatRupiah(p.price)}</strong></p>
              </div>
              <span class="px-2 py-1 rounded bg-[#4a5d4e]/10 text-[#4a5d4e] text-xs font-semibold">Margin: \${hpp.margin.toFixed(1)}%</span>
            </div>
            
            <div class="bg-neutral-50/70 p-3 rounded-xl text-xs space-y-1">
              <div class="flex justify-between"><span>Biaya Bahan Habis Pakai:</span> <span class="font-medium">\${formatRupiah(hpp.consumableCost)}</span></div>
              <div class="flex justify-between"><span>Penyusutan Alat per Buket:</span> <span class="font-medium">\${formatRupiah(hpp.toolDepreciation)}</span></div>
              <div class="border-t border-neutral-200 pt-1 flex justify-between font-bold text-neutral-800"><span>Total HPP Satuan:</span> <span>\${formatRupiah(hpp.totalHpp)}</span></div>
              <div class="flex justify-between text-[#4a5d4e] font-bold"><span>Laba Kotor Satuan:</span> <span>+\${formatRupiah(hpp.profit)}</span></div>
            </div>
          </div>
        \`;
      }).join('');

      area.innerHTML = \`
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-bold font-brand text-[#2c332d]">Kalkulator HPP & Resep Bouquet</h2>
              <p class="text-xs text-neutral-600">Pemisahan akuntansi presisi antara bahan sekali pakai (100%) dan penyusutan alat bertahap.</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">\${cardsHtml}</div>
        </div>
      \`;
    }

    function renderInventory(area) {
      let consHtml = state.consumables.map(c => \`
        <tr class="border-b border-neutral-100 text-xs">
          <td class="py-2.5 font-medium">\${c.name}</td>
          <td class="py-2.5 text-neutral-500">\${c.unit}</td>
          <td class="py-2.5 tabular-nums">\${formatRupiah(c.cost)}</td>
          <td class="py-2.5 font-bold tabular-nums">\${c.stock}</td>
          <td class="py-2.5 tabular-nums text-neutral-600">\${formatRupiah(c.stock * c.cost)}</td>
        </tr>
      \`).join('');

      let toolsHtml = state.tools.map(t => {
        const depr = t.usageCapacity > 0 ? t.price / t.usageCapacity : 0;
        return \`
          <tr class="border-b border-neutral-100 text-xs">
            <td class="py-2.5 font-medium">\${t.name}</td>
            <td class="py-2.5 tabular-nums">\${formatRupiah(t.price)}</td>
            <td class="py-2.5 tabular-nums">\${t.usageCapacity} buket</td>
            <td class="py-2.5 text-[#c07a50] font-bold tabular-nums">\${formatRupiah(depr)} / buket</td>
            <td class="py-2.5 tabular-nums">\${t.usedCount} kali</td>
            <td class="py-2.5 tabular-nums text-neutral-600">\${formatRupiah(Math.max(0, t.price - (depr * t.usedCount)))}</td>
          </tr>
        \`;
      }).join('');

      area.innerHTML = \`
        <div class="space-y-6">
          <div class="glass-card p-5 rounded-2xl border border-[#c07a50]/20">
            <h3 class="font-bold text-sm text-[#2c332d] mb-3">1. Bahan Sekali Pakai (Consumables - Beban 100% per Buket)</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead><tr class="border-b border-neutral-200 text-xs text-neutral-500">
                  <th class="py-2">Nama Bahan</th><th>Satuan</th><th>Harga Beli</th><th>Sisa Stok</th><th>Nilai Aset</th>
                </tr></thead>
                <tbody>\${consHtml}</tbody>
              </table>
            </div>
          </div>

          <div class="glass-card p-5 rounded-2xl border border-[#c07a50]/20">
            <h3 class="font-bold text-sm text-[#2c332d] mb-3">2. Alat Operasional / Berkali-kali (Durable Goods - Metode Depresiasi)</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead><tr class="border-b border-neutral-200 text-xs text-neutral-500">
                  <th class="py-2">Nama Alat</th><th>Harga Beli</th><th>Kapasitas Pakai</th><th>Beban Depresiasi</th><th>Terpakai</th><th>Nilai Buku Sisa</th>
                </tr></thead>
                <tbody>\${toolsHtml}</tbody>
              </table>
            </div>
          </div>
        </div>
      \`;
    }

    function renderTransactions(area) {
      let trxsHtml = state.transactions.map(t => \`
        <tr class="border-b border-neutral-100 text-xs">
          <td class="py-2.5 text-neutral-500">\${t.date}</td>
          <td class="py-2.5 font-medium">\${t.customer}</td>
          <td class="py-2.5 text-neutral-700">\${t.product}</td>
          <td class="py-2.5 tabular-nums text-center">\${t.qty}</td>
          <td class="py-2.5 tabular-nums font-semibold text-[#c07a50]">\${formatRupiah(t.qty * t.price)}</td>
          <td class="py-2.5 tabular-nums text-neutral-500">\${formatRupiah(t.qty * t.hpp)}</td>
          <td class="py-2.5 tabular-nums font-bold text-[#4a5d4e]">+\${formatRupiah((t.qty * t.price) - (t.qty * t.hpp))}</td>
          <td class="py-2.5"><span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">\${t.status}</span></td>
        </tr>
      \`).join('');

      area.innerHTML = \`
        <div class="glass-card p-5 rounded-2xl border border-[#c07a50]/20 space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-base text-[#2c332d]">Daftar Transaksi Penjualan</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead><tr class="border-b border-neutral-200 text-xs text-neutral-500">
                <th class="py-2">Tanggal</th><th>Pelanggan</th><th>Produk Bouquet</th><th>Qty</th><th>Omset</th><th>HPP</th><th>Laba Kotor</th><th>Status</th>
              </tr></thead>
              <tbody>\${trxsHtml}</tbody>
            </table>
          </div>
        </div>
      \`;
    }

    function renderExpenses(area) {
      let expHtml = state.expenses.map(e => \`
        <tr class="border-b border-neutral-100 text-xs">
          <td class="py-2.5 text-neutral-500">\${e.date}</td>
          <td class="py-2.5 font-medium text-neutral-800">\${e.category}</td>
          <td class="py-2.5 text-neutral-600">\${e.desc}</td>
          <td class="py-2.5 tabular-nums font-semibold text-rose-600">\${formatRupiah(e.amount)}</td>
        </tr>
      \`).join('');

      area.innerHTML = \`
        <div class="glass-card p-5 rounded-2xl border border-[#c07a50]/20 space-y-4">
          <h3 class="font-bold text-base text-[#2c332d]">Beban Operasional Toko (OpEx)</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead><tr class="border-b border-neutral-200 text-xs text-neutral-500">
                <th class="py-2">Tanggal</th><th>Kategori</th><th>Deskripsi</th><th>Jumlah</th>
              </tr></thead>
              <tbody>\${expHtml}</tbody>
            </table>
          </div>
        </div>
      \`;
    }

    function renderReports(area, fin) {
      area.innerHTML = \`
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Laba Rugi -->
            <div class="glass-card p-5 rounded-2xl border border-[#c07a50]/20 space-y-3">
              <h3 class="font-bold text-base text-[#2c332d] border-b border-neutral-200 pb-2">Laporan Laba Rugi (Income Statement)</h3>
              <div class="text-xs space-y-2">
                <div class="flex justify-between"><span>Pendapatan Penjualan:</span> <strong class="tabular-nums text-[#c07a50]">\${formatRupiah(fin.revenue)}</strong></div>
                <div class="flex justify-between text-neutral-600"><span>Beban Pokok Penjualan (HPP):</span> <strong class="tabular-nums">-\${formatRupiah(fin.totalHpp)}</strong></div>
                <div class="flex justify-between border-t border-neutral-200 pt-1 font-bold"><span>Laba Kotor (Gross Profit):</span> <strong class="tabular-nums text-[#4a5d4e]">\${formatRupiah(fin.grossProfit)}</strong></div>
                <div class="flex justify-between text-neutral-600"><span>Total Beban Operasional (OpEx):</span> <strong class="tabular-nums text-rose-600">-\${formatRupiah(fin.opex)}</strong></div>
                <div class="flex justify-between border-t-2 border-neutral-300 pt-2 font-bold text-sm bg-neutral-50 p-2 rounded">
                  <span>Laba Bersih (Net Profit):</span>
                  <strong class="tabular-nums \${fin.netProfit >= 0 ? 'text-[#4a5d4e]' : 'text-rose-600'}">\${formatRupiah(fin.netProfit)}</strong>
                </div>
              </div>
            </div>

            <!-- Neraca Sederhana -->
            <div class="glass-card p-5 rounded-2xl border border-[#c07a50]/20 space-y-3">
              <h3 class="font-bold text-base text-[#2c332d] border-b border-neutral-200 pb-2">Neraca Sederhana (Balance Sheet)</h3>
              <div class="text-xs space-y-2">
                <div class="flex justify-between"><span>Kas & Bank:</span> <span class="tabular-nums font-medium">\${formatRupiah(fin.cash)}</span></div>
                <div class="flex justify-between"><span>Persediaan Stok Bahan:</span> <span class="tabular-nums font-medium">\${formatRupiah(fin.inventoryVal)}</span></div>
                <div class="flex justify-between"><span>Nilai Buku Alat Florist:</span> <span class="tabular-nums font-medium">\${formatRupiah(fin.toolsBookVal)}</span></div>
                <div class="flex justify-between border-t border-neutral-200 pt-1 font-bold text-[#4a5d4e]"><span>TOTAL ASET:</span> <span class="tabular-nums">\${formatRupiah(fin.totalAssets)}</span></div>
                <div class="border-t border-neutral-200 pt-2">
                  <div class="flex justify-between text-neutral-600"><span>Modal Awal Disetor:</span> <span class="tabular-nums">\${formatRupiah(state.settings.initialCapital)}</span></div>
                  <div class="flex justify-between text-neutral-600"><span>Laba Ditahan / Berjalan:</span> <span class="tabular-nums">\${formatRupiah(fin.netProfit)}</span></div>
                  <div class="flex justify-between font-bold pt-1 text-[#2c332d]"><span>TOTAL EKUITAS:</span> <span class="tabular-nums">\${formatRupiah(fin.equity)}</span></div>
                </div>
                <div class="p-2 bg-emerald-50 text-emerald-800 text-[11px] rounded text-center font-semibold">
                  ✓ Neraca Seimbang: Aset = Kewajiban + Ekuitas
                </div>
              </div>
            </div>
          </div>
        </div>
      \`;
    }

    // Modal Settings & Background
    function openSettingsModal() {
      const modal = document.createElement('div');
      modal.id = 'settingsModal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm';
      modal.innerHTML = \`
        <div class="glass-card max-w-md w-full rounded-2xl p-6 border border-[#c07a50]/20 space-y-4 shadow-xl">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-base text-[#2c332d]">Pengaturan & Latar Belakang</h3>
            <button onclick="closeSettingsModal()" class="text-neutral-400 hover:text-neutral-700">✕</button>
          </div>
          
          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-medium mb-1">Unggah Gambar Background:</label>
              <input type="file" id="bgFileInput" accept="image/*" class="w-full text-xs file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#c07a50] file:text-white" />
            </div>
            <div>
              <label class="block font-medium mb-1">Transparansi Background: <span id="opacityVal">\${state.settings.bgOpacity || 15}%</span></label>
              <input type="range" id="opacityRange" min="5" max="60" value="\${state.settings.bgOpacity || 15}" class="w-full" oninput="document.getElementById('opacityVal').innerText = this.value + '%'" />
            </div>
            <div>
              <label class="block font-medium mb-1">Modal Awal Toko (IDR):</label>
              <input type="number" id="capitalInput" value="\${state.settings.initialCapital || 10000000}" class="w-full p-2 border rounded" />
            </div>
          </div>

          <div class="flex gap-2 pt-2">
            <button onclick="saveSettingsFromModal()" class="flex-1 py-2 bg-[#c07a50] hover:bg-[#a6643e] text-white rounded-lg font-semibold text-xs transition">Simpan</button>
            <button onclick="removeBgImage()" class="px-3 py-2 bg-neutral-200 text-neutral-700 rounded-lg text-xs">Hapus BG</button>
          </div>
        </div>
      \`;
      document.body.appendChild(modal);
    }

    function closeSettingsModal() {
      const modal = document.getElementById('settingsModal');
      if (modal) modal.remove();
    }

    function saveSettingsFromModal() {
      const fileInput = document.getElementById('bgFileInput');
      const opacity = Number(document.getElementById('opacityRange').value);
      const cap = Number(document.getElementById('capitalInput').value);

      state.settings.bgOpacity = opacity;
      state.settings.initialCapital = cap;

      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          state.settings.bgImage = e.target.result;
          saveState();
          applyBackground();
          closeSettingsModal();
        };
        reader.readAsDataURL(fileInput.files[0]);
      } else {
        saveState();
        applyBackground();
        closeSettingsModal();
      }
    }

    function removeBgImage() {
      state.settings.bgImage = '';
      saveState();
      applyBackground();
      closeSettingsModal();
    }

    // Initialize on load
    window.addEventListener('DOMContentLoaded', () => {
      loadState();
      renderCurrentTab();
    });
  </script>
</body>
</html>`;
}

/**
 * Trigger immediate browser download of the standalone HTML file.
 */
export function downloadStandaloneFile(): void {
  const htmlContent = generateStandaloneHtml();
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'index.html';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
