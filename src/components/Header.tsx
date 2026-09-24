import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Download,
  RotateCcw,
  LayoutDashboard,
  Calculator,
  Package,
  Receipt,
  Wallet,
  FileSpreadsheet,
} from 'lucide-react';
import { AppSettings } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface HeaderProps {
  settings: AppSettings;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSettings: () => void;
  onDownloadHtml: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  activeTab,
  onSelectTab,
  onOpenSettings,
  onDownloadHtml,
  onResetData,
}) => {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calculator', label: 'Kalkulator HPP', icon: Calculator },
    { id: 'inventory', label: 'Bahan & Alat', icon: Package },
    { id: 'transactions', label: 'Penjualan', icon: Receipt },
    { id: 'expenses', label: 'Beban OpEx', icon: Wallet },
    { id: 'reports', label: 'Laporan Akuntansi', icon: FileSpreadsheet },
  ];

  const handleConfirmReset = () => {
    setIsResetConfirmOpen(false);
    onResetData();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#f4efe6]/90 backdrop-blur-md border-b border-[#c07a50]/20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single element brand wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="text-left focus-visible:outline-hidden cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold font-brand tracking-tight text-[#c07a50]">
                  {settings.storeName || 'KLOVIBE'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#4a5d4e]/10 text-[#4a5d4e] border border-[#4a5d4e]/20">
                  <Sparkles className="w-3 h-3 text-[#4a5d4e]" />
                  Florist Studio
                </span>
              </div>
              <p className="text-[11px] text-[#4a5d4e] font-serif italic -mt-0.5">
                {settings.slogan || 'Crafted Moments, Enduring Love'}
              </p>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#2c332d]/5 p-1 rounded-xl border border-[#c07a50]/15">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#c07a50] shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#c07a50]' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadHtml}
              title="Unduh File index.html Mandiri (Siap Deploy GitHub Pages)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#4a5d4e] hover:bg-[#3d4c40] text-white rounded-lg transition-all shadow-xs whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export HTML</span>
            </button>

            <button
              onClick={onOpenSettings}
              title="Kustomisasi Background & Modal Usaha"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#c07a50] hover:bg-[#a8653e] text-white rounded-lg transition-all shadow-xs whitespace-nowrap cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Background & Opsi</span>
            </button>

            <button
              onClick={() => setIsResetConfirmOpen(true)}
              title="Reset ke Kondisi Awal (Mulai dari Nol Transaksi)"
              className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Scroller */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto border-t border-[#c07a50]/10 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#c07a50] text-white'
                    : 'text-neutral-600 hover:bg-white/60'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal for Reset Data (Yes/No) */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Atur Ulang Data Florist?"
        message="Apakah Anda yakin ingin mengatur ulang data aplikasi? Seluruh data transaksi penjualan akan dikosongkan (mulai dari nol transaksi samsek) dan stok master bahan dikembalikan ke kondisi awal."
        confirmLabel="Ya, Atur Ulang"
        cancelLabel="Batal"
        variant="warning"
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </header>
  );
};
