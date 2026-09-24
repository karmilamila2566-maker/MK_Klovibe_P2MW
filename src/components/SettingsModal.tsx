import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sliders,
  DollarSign,
  Download,
  RotateCcw,
  Trash2,
  FileJson,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { AppSettings } from '../types';
import { formatCurrency } from '../utils/accounting';
import { ConfirmModal } from './ConfirmModal';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  onClose: () => void;
  onSaveSettings: (settings: AppSettings) => void;
  onDownloadHtml: () => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSaveSettings,
  onDownloadHtml,
  onExportJson,
  onImportJson,
  onResetData,
}) => {
  if (!isOpen) return null;

  const [storeName, setStoreName] = useState(settings.storeName || 'KLOVIBE');
  const [slogan, setSlogan] = useState(settings.slogan || 'Crafted Moments, Enduring Love');
  const [initialCapital, setInitialCapital] = useState<string>(
    String(settings.initialCapital ?? 10000000)
  );
  const [bgImageBase64, setBgImageBase64] = useState<string | null>(settings.bgImageBase64 || null);
  const [bgOpacity, setBgOpacity] = useState(settings.bgOpacity ?? 15);
  const [bgBlur, setBgBlur] = useState(settings.bgBlur ?? 2);
  const [isSavedAlert, setIsSavedAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Confirmations
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isRemoveBgConfirmOpen, setIsRemoveBgConfirmOpen] = useState(false);

  // File upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit ~3MB for localStorage safety
    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage('Ukuran file gambar maksimal 3MB agar performa browser tetap optimal.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setBgImageBase64(base64);
    };
    reader.onerror = () => {
      setErrorMessage('Gagal membaca file gambar. Silakan coba file lain.');
    };
    reader.readAsDataURL(file);
  };

  const confirmRemoveBg = () => {
    setBgImageBase64(null);
    setIsRemoveBgConfirmOpen(false);
  };

  const confirmResetFloristData = () => {
    setIsResetConfirmOpen(false);
    onResetData();
    onClose();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      ...settings,
      storeName: storeName.trim() || 'KLOVIBE',
      slogan: slogan.trim() || 'Crafted Moments, Enduring Love',
      initialCapital: Math.max(0, Number(initialCapital) || 0),
      bgImageBase64,
      bgOpacity: Number(bgOpacity),
      bgBlur: Number(bgBlur),
    };

    onSaveSettings(updated);
    setIsSavedAlert(true);
    setTimeout(() => {
      setIsSavedAlert(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#c07a50]/20 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#c07a50]" />
            <h3 className="text-base font-bold text-neutral-800 font-brand">
              Pengaturan & Kustomisasi Estetika
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Brand Identity */}
          <div className="space-y-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="font-bold text-neutral-800">1. Identitas Brand Florist</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 mb-1">Nama Usaha / Toko</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-brand font-bold text-[#c07a50]"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-1">Modal Awal Disetor (Equity)</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(e.target.value)}
                  placeholder="Contoh: 8250000"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-semibold tabular-nums"
                />
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  {formatCurrency(Number(initialCapital) || 0)}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-neutral-600 mb-1">Slogan Brand</label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg italic"
              />
            </div>
          </div>

          {/* Background Customization */}
          <div className="space-y-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="font-bold text-neutral-800">
                2. Kustomisasi Latar Belakang (Upload Background)
              </div>
              {bgImageBase64 && (
                <button
                  type="button"
                  onClick={() => setIsRemoveBgConfirmOpen(true)}
                  className="text-rose-600 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus Background</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-neutral-500">
              Unggah foto bunga atau studio florist Anda. Gambar akan tersimpan otomatis di browser (localStorage / Base64).
            </p>

            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-dashed border-[#c07a50] rounded-xl text-neutral-700 hover:bg-[#c07a50]/5 cursor-pointer transition">
                <Upload className="w-4 h-4 text-[#c07a50]" />
                <span className="font-medium text-[11px]">
                  {bgImageBase64 ? 'Ganti Foto Background' : 'Pilih Gambar (JPG, PNG)'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {bgImageBase64 && (
                <div className="w-12 h-12 rounded-lg border border-neutral-300 overflow-hidden relative shrink-0">
                  <img
                    src={bgImageBase64}
                    alt="Preview BG"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Opacity & Blur Sliders */}
            {bgImageBase64 && (
              <div className="space-y-2 pt-2 border-t border-neutral-200/60">
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-600 mb-1">
                    <span>Transparansi Latar Belakang (Opacity):</span>
                    <span className="font-bold">{bgOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    value={bgOpacity}
                    onChange={(e) => setBgOpacity(Number(e.target.value))}
                    className="w-full accent-[#c07a50] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-neutral-600 mb-1">
                    <span>Efek Blur Halus (Kejernihan Teks):</span>
                    <span className="font-bold">{bgBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={bgBlur}
                    onChange={(e) => setBgBlur(Number(e.target.value))}
                    className="w-full accent-[#c07a50] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* GitHub Deployment & Backup Tools */}
          <div className="space-y-2 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="font-bold text-neutral-800">3. Siap Deploy GitHub Pages & Backup Data</div>
            <p className="text-[11px] text-neutral-500">
              Unduh file tunggal <code>index.html</code> mandiri untuk dipasang langsung ke repository GitHub Pages Anda tanpa server berbayar.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={onDownloadHtml}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#4a5d4e] hover:bg-[#3d4c40] text-white rounded-lg font-semibold text-[11px] transition shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh index.html</span>
              </button>

              <button
                type="button"
                onClick={onExportJson}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 rounded-lg font-medium text-[11px] transition cursor-pointer"
              >
                <FileJson className="w-3.5 h-3.5 text-neutral-500" />
                <span>Export Data JSON</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 text-[11px]">
              <label className="text-[#c07a50] hover:underline cursor-pointer">
                <span>Restore / Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportJson}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="text-neutral-500 hover:text-neutral-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Contoh Florist</span>
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            {isSavedAlert ? (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                <CheckCircle className="w-4 h-4" />
                <span>Pengaturan berhasil disimpan!</span>
              </span>
            ) : <span />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-white bg-[#c07a50] hover:bg-[#a8653e] rounded-xl font-semibold shadow-xs cursor-pointer"
              >
                Simpan Pengaturan
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal: Reset Data (Yes/No) */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Atur Ulang Data Florist?"
        message="Apakah Anda yakin ingin mengatur ulang data aplikasi? Seluruh data transaksi penjualan akan dikosongkan (mulai dari nol) dan data master bahan dikembalikan ke kondisi awal."
        confirmLabel="Ya, Atur Ulang"
        cancelLabel="Batal"
        variant="warning"
        onConfirm={confirmResetFloristData}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Confirmation Modal: Remove Background (Yes/No) */}
      <ConfirmModal
        isOpen={isRemoveBgConfirmOpen}
        title="Hapus Gambar Latar Belakang?"
        message="Apakah Anda yakin ingin menghapus gambar latar belakang yang telah diunggah?"
        confirmLabel="Ya, Hapus Gambar"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={confirmRemoveBg}
        onCancel={() => setIsRemoveBgConfirmOpen(false)}
      />
    </div>
  );
};
