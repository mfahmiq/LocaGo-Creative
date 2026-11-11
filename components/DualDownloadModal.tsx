import React, { useState, useEffect } from 'react';
import { SourceCodeItem } from '../types';

interface DualDownloadModalProps {
  item: SourceCodeItem | null;
  onClose: () => void;
  initialAmount?: number;
}

const MINIMUM_DONATION = 3000;

export const DualDownloadModal: React.FC<DualDownloadModalProps> = ({
  item,
  onClose,
  initialAmount = 3000,
}) => {
  const [step, setStep] = useState<'checkout' | 'settled'>('checkout');
  const [donationAmount, setDonationAmount] = useState<number>(initialAmount);
  const [customInput, setCustomInput] = useState<string>(String(initialAmount));
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [statusNote, setStatusNote] = useState<string>('');
  const [orderId] = useState<string>(() => `LOCAGO-MID-${Date.now().toString().slice(-6)}`);

  useEffect(() => {
    if (item) {
      setStep('checkout');
      setStatusNote('');
    }
  }, [item]);

  if (!item) return null;

  const totalAmount = Math.max(MINIMUM_DONATION, donationAmount);

  const handleSelectQuickAmount = (amt: number) => {
    setDonationAmount(amt);
    setCustomInput(String(amt));
    setStatusNote('');
  };

  const handleCustomInputChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    setCustomInput(clean);
    const num = parseInt(clean || '0', 10);
    if (num >= MINIMUM_DONATION) {
      setDonationAmount(num);
      setStatusNote('');
    }
  };

  const handleSnapPay = async () => {
    const amountToPay = Math.max(MINIMUM_DONATION, parseInt(customInput || '0', 10) || donationAmount);
    setIsChecking(true);
    setStatusNote('Membuka gerbang pembayaran resmi Midtrans Snap...');
    try {
      const res = await fetch('/api/midtrans-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: amountToPay,
          slug: item.slug,
          title: item.title,
        }),
      });
      const data = await res.json();
      if (data.token && data.token !== 'mock-token' && (window as any).snap) {
        (window as any).snap.pay(data.token, {
          onSuccess: () => {
            setStep('settled');
            setIsChecking(false);
            handleDirectFileDownload();
          },
          onPending: () => {
            setStatusNote('Menunggu pembayaran diselesaikan di Midtrans...');
            setIsChecking(false);
          },
          onError: () => {
            setStatusNote('Pembayaran belum selesai atau dibatalkan.');
            setIsChecking(false);
          },
          onClose: () => {
            setIsChecking(false);
          },
        });
        return;
      }
      if (data.redirectUrl && data.redirectUrl !== '#') {
        window.open(data.redirectUrl, '_blank', 'noopener,noreferrer');
        setIsChecking(false);
        return;
      }
      if (data.error) {
        setStatusNote(`Gagal: ${data.error}`);
      } else {
        setStatusNote('Gagal membuka popup Midtrans. Silakan muat ulang halaman.');
      }
    } catch {
      setStatusNote('Terjadi kesalahan koneksi ke server Midtrans.');
    }
    setIsChecking(false);
  };

  const handleCheckPaymentStatus = async () => {
    setIsChecking(true);
    setStatusNote('Memeriksa status verifikasi pembayaran di Midtrans...');
    try {
      const res = await fetch(`/api/midtrans-status?orderId=${encodeURIComponent(orderId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.isPaid) {
          setIsChecking(false);
          setStep('settled');
          handleDirectFileDownload();
          return;
        }
      }
    } catch {
      // ignore
    }
    setTimeout(() => {
      setIsChecking(false);
      setStatusNote('Pembayaran belum terdeteksi. Silakan selesaikan pembayaran di pop-up Midtrans.');
    }, 1000);
  };

  const handleDirectFileDownload = () => {
    const targetUrl = item.downloadUrlFast && !item.downloadUrlFast.includes('lynk.id')
      ? item.downloadUrlFast
      : `/downloads/${item.slug}.zip`;
    const a = document.createElement('a');
    a.href = targetUrl;
    a.download = `${item.slug}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
              LC
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white leading-none">
                Pembayaran LocaGo Creative
              </h3>
              <span className="text-[11px] text-neutral-500 font-mono">
                Midtrans Official Gateway • {orderId}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {step === 'checkout' ? (
            <>
              {/* Item Info Summary Card */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/70">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
                      Direct ZIP Download
                    </span>
                    <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                      Ukuran: {item.fileSize} • {item.databaseType || 'Full SQL Database'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg flex-shrink-0">
                    📦
                  </div>
                </div>
              </div>

              {/* Dynamic Donation Amount Selector */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Nominal Donasi (Bebas Isi • Min. Rp 3.000)
                  </label>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Dukungan Kreator
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {[3000, 5000, 10000, 25000, 50000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectQuickAmount(amt)}
                      className={`py-1.5 px-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                        donationAmount === amt
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-neutral-50 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-emerald-500'
                      }`}
                    >
                      {amt >= 1000 ? `${amt / 1000}rb` : amt}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-neutral-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={customInput}
                    onChange={(e) => handleCustomInputChange(e.target.value)}
                    placeholder="Masukkan nominal donasi (min 3000)"
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs font-mono font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                {parseInt(customInput || '0', 10) < MINIMUM_DONATION && (
                  <p className="text-[11px] text-red-500 font-medium">
                    * Minimal donasi adalah Rp 3.000 untuk memproses transaksi.
                  </p>
                )}
              </div>

              {/* Supported Payment Channels Banner */}
              <div className="p-3.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-700/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  <span>Metode Pembayaran Resmi (Midtrans):</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">24 Jam Otomatis</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
                  <div className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 font-medium text-neutral-800 dark:text-neutral-200">
                    <span className="block font-bold text-emerald-600 dark:text-emerald-400">📱 QRIS</span>
                    <span className="text-[10px] text-neutral-500">Semua Bank & E-Wallet</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 font-medium text-neutral-800 dark:text-neutral-200">
                    <span className="block font-bold text-blue-600 dark:text-blue-400">⚡ GoPay</span>
                    <span className="text-[10px] text-neutral-500">GoPay & ShopeePay</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 font-medium text-neutral-800 dark:text-neutral-200">
                    <span className="block font-bold text-indigo-600 dark:text-indigo-400">🏦 VA Bank</span>
                    <span className="text-[10px] text-neutral-500">BCA, Mandiri, BRI, BNI</span>
                  </div>
                </div>
              </div>

              {/* Amount Summary Row */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
                <div>
                  <span className="block text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">
                    Total Pembayaran:
                  </span>
                  <span className="text-xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    <span>⚡</span> Instan Download
                  </span>
                </div>
              </div>

              {statusNote && (
                <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center text-xs text-amber-800 dark:text-amber-300 font-medium animate-fade-in">
                  {statusNote}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleSnapPay}
                  disabled={isChecking || parseInt(customInput || '0', 10) < MINIMUM_DONATION}
                  className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-extrabold text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isChecking ? (
                    <span>Membuka Midtrans Snap...</span>
                  ) : (
                    <>
                      <span>💳</span>
                      <span>Bayar Otomatis via Midtrans (Rp {totalAmount.toLocaleString('id-ID')})</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCheckPaymentStatus}
                  disabled={isChecking || parseInt(customInput || '0', 10) < MINIMUM_DONATION}
                  className="w-full h-10 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🔄</span>
                  <span>Sudah Bayar? Cek Status Verifikasi</span>
                </button>
              </div>
            </>
          ) : (
            /* Step Settled: Unlocked Instant Download */
            <div className="py-6 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl font-bold border-2 border-emerald-300 dark:border-emerald-700 shadow-sm">
                ✓
              </div>
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  SETTLEMENT VERIFIED • Rp {totalAmount.toLocaleString('id-ID')}
                </span>
                <h4 className="mt-2 text-xl font-extrabold text-neutral-900 dark:text-white">
                  Terima Kasih Atas Dukungan Anda!
                </h4>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
                  Akses unduhan paket lengkap untuk <strong>{item.title}</strong> telah terbuka otomatis.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Nama Berkas:</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white truncate max-w-[200px]">
                    {item.slug}.zip
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Ukuran & Format:</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.fileSize} • {item.databaseType || 'Full SQL Database'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Akses Unduhan:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Instan (Tanpa Iklan / Kupon)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDirectFileDownload}
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⬇️</span>
                <span>Download File ZIP Sekarang</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex items-center gap-1">
            <span>🔒</span>
            <span>Midtrans Official 256-bit Encrypted</span>
          </span>
          <span className="font-medium text-neutral-400">LocaGo Creative Vault</span>
        </div>
      </div>
    </div>
  );
};
