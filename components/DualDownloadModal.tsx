import React, { useState } from 'react';
import { SourceCodeItem } from '../types';
import { DONATION_URL_DEFAULT, WA_CONSULT_URL } from '../lib/data';

interface DualDownloadModalProps {
  item: SourceCodeItem | null;
  onClose: () => void;
}

export const DualDownloadModal: React.FC<DualDownloadModalProps> = ({ item, onClose }) => {
  const [activeTab, setActiveTab] = useState<'download' | 'tutorial'>('download');
  const [showQrisPreview, setShowQrisPreview] = useState(false);

  if (!item) return null;

  const handleSafelinkRedirect = () => {
    // Redirect to the multi-step article safelink loop on dwollopus.eu.org
    const safelinkUrl = `https://www.dwollopus.eu.org/2023/05/10-must-have-ai-tools-for-boosting-your.html?safelink=1&item=${encodeURIComponent(
      item.slug
    )}&step=1&max=8&hash=${Math.random().toString(36).substring(7)}`;
    window.open(safelinkUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFastPassRedirect = () => {
    // Open Saweria / Trakteer / QRIS donation page
    window.open(DONATION_URL_DEFAULT, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {item.category}
              </span>
              <span className="text-xs text-neutral-500 font-mono">📦 {item.fileSize}</span>
              {item.hasDatabase && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  💾 {item.databaseType}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white leading-snug">
              {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-100 dark:border-neutral-800 px-6 pt-2 bg-neutral-50/30 dark:bg-neutral-900/30">
          <button
            onClick={() => setActiveTab('download')}
            className={`pb-3 px-3 text-xs font-mono font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === 'download'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Pilihan Download
          </button>
          <button
            onClick={() => setActiveTab('tutorial')}
            className={`pb-3 px-3 text-xs font-mono font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === 'tutorial'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Panduan & Database SQL
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'download' ? (
            <div className="space-y-4">
              {/* Option 1: Fast Pass / Donasi */}
              <div className="relative p-5 rounded-xl border-2 border-emerald-500/80 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-sm transition-all hover:border-emerald-600">
                <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
                  Paling Cepat & Instan ⚡
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white text-base flex items-center gap-2">
                      <span>🚀 Jalur Cepat (Donasi Rp 2.000)</span>
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                      Langsung dapatkan link file ZIP Google Drive tanpa melewati iklan, tanpa countdown, dan tanpa jeda. Sekaligus mendukung kopi developer LocaGo Creative!
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={handleFastPassRedirect}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>☕ Donasi Rp 2.000 & Download Instan</span>
                      </button>
                      <button
                        onClick={() => setShowQrisPreview(!showQrisPreview)}
                        className="text-xs font-mono text-emerald-700 dark:text-emerald-400 underline hover:text-emerald-800 cursor-pointer"
                      >
                        {showQrisPreview ? 'Tutup Info QRIS' : 'Scan QRIS Langsung'}
                      </button>
                    </div>

                    {showQrisPreview && (
                      <div className="mt-3 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-center animate-fade-in">
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-300 font-medium mb-2">
                          Scan QRIS via GoPay, OVO, Dana, ShopeePay, atau Mobile Banking:
                        </p>
                        <div className="inline-block p-2 bg-white rounded-lg border border-neutral-300 shadow-inner">
                          <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://saweria.co/dwollopus"
                            alt="QRIS Donasi 2rb"
                            className="w-32 h-32 mx-auto object-contain"
                          />
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-2 font-mono">
                          Nominal minimal: Rp 2.000 • Link otomatis terbuka setelah verifikasi
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Option 2: Free Pass / Safelink Adsterra Loop */}
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-2">
                      <span>⏳ Jalur Gratis (Lewat Verifikasi Sponsor)</span>
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                      Download 100% gratis didukung oleh sponsor iklan. Anda akan diarahkan ke halaman artikel sponsor di <strong className="text-neutral-800 dark:text-neutral-200 font-mono">dwollopus.eu.org</strong> dan melewati countdown 15 detik beberapa kali sebelum membuka file.
                    </p>
                    <div className="mt-3">
                      <button
                        onClick={handleSafelinkRedirect}
                        className="px-4 py-2 rounded-lg bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Buka Halaman Sponsor (dwollopus.eu.org) →</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Modification CTA */}
              <div className="p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-center bg-white dark:bg-neutral-900">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                  Butuh bantuan instalasi, integrasi WhatsApp, atau penambahan fitur khusus untuk bisnis Anda?
                </p>
                <a
                  href={WA_CONSULT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span>💬 Hubungi Tim Engineer LocaGo Creative via WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            /* Tab Tutorial */
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Fitur Utama Aplikasi
                </h4>
                <ul className="space-y-1.5">
                  {item.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Langkah Instalasi & Setup Database
                </h4>
                <div className="space-y-2">
                  {item.tutorialSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-700/50 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 text-neutral-800 dark:text-neutral-200">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {item.hasDatabase && (
                <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 font-mono">
                  💡 <strong>Catatan Database:</strong> File SQL skema dan data dummy sudah dikemas di dalam folder utama file ZIP dengan nama <code className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">database.sql</code>.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex justify-between items-center text-xs text-neutral-500">
          <span>Lisensi: Bebas Komersial & Edukasi (Open License)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-mono cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
