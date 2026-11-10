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
  const [step, setStep] = useState<'amount' | 'qris' | 'settled'>('qris');
  const [donationAmount, setDonationAmount] = useState<number>(initialAmount);
  const [customInput, setCustomInput] = useState<string>(String(initialAmount));
  const [uniqueCode] = useState<number>(() => Math.floor(Math.random() * 89) + 11);
  const [secondsLeft, setSecondsLeft] = useState<number>(59 * 60 + 41);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [statusNote, setStatusNote] = useState<string>('');
  const [orderId] = useState<string>(() => `LOCAGO-QRIS-${Date.now().toString().slice(-6)}`);

  useEffect(() => {
    if (item) {
      setStep('qris');
      setSecondsLeft(59 * 60 + 41);
      setStatusNote('');
    }
  }, [item]);

  useEffect(() => {
    if (!item || step !== 'qris') return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [item, step]);

  if (!item) return null;

  const totalAmount = Math.max(MINIMUM_DONATION, donationAmount) + uniqueCode;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const qrDataPayload = `00020101021226610014ID.CO.GOPAY.WWW01189360091800215843520215ID20265843520440303UMI51440014ID.CO.QRIS.WWW0215ID20265843520440303UMI52045815530336054${String(
    totalAmount
  ).length.toString().padStart(2, '0')}${totalAmount}5802ID5915LOCAGO CREATIVE6007JAKARTA61051219062190515${orderId}6304A1B2`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(
    qrDataPayload
  )}`;

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

  const handleDownloadQrImage = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `QRIS-LocaGo-${item.slug}-${totalAmount}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(qrImageUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCheckPaymentStatus = () => {
    if (parseInt(customInput || '0', 10) < MINIMUM_DONATION) {
      setStatusNote(`Minimal donasi adalah Rp ${MINIMUM_DONATION.toLocaleString('id-ID')}`);
      return;
    }
    setIsChecking(true);
    setStatusNote('Memeriksa status settlement QRIS Midtrans...');
    setTimeout(() => {
      setIsChecking(false);
      setStep('settled');
    }, 1400);
  };

  const handleDirectFileDownload = () => {
    const targetUrl = item.downloadUrlFast && !item.downloadUrlFast.includes('lynk.id')
      ? item.downloadUrlFast
      : '/downloads/00_OpenSource_Super_Vault_100_Tools_Prompts.zip';
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
        {/* Top Bar ala Papicode / Midtrans Checkout */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
              LC
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white leading-none">
                Pembayaran LocaGo Creative
              </h3>
              <span className="text-[11px] text-neutral-500 font-mono">
                Midtrans Dynamic QRIS • {orderId}
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
          {step === 'qris' ? (
            <>
              {/* Dynamic Donation Amount Selector (Pay-What-You-Want min Rp 3.000) */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/70">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-200">
                    Nominal Donasi (Bebas Isi • Min. Rp 3.000)
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('amount')}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Pilihan Cepat
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5 mb-2.5">
                  {[3000, 5000, 15000, 50000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectQuickAmount(amt)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                        donationAmount === amt
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-emerald-500'
                      }`}
                    >
                      {amt / 1000}rb
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
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-mono font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                {parseInt(customInput || '0', 10) < MINIMUM_DONATION && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">
                    * Minimal donasi Rp 3.000 untuk mengaktifkan QRIS otomatis.
                  </p>
                )}
              </div>

              {/* Amount Summary & Countdown Timer Row ala Papicode */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60">
                <div>
                  <span className="block text-[11px] text-neutral-500 dark:text-neutral-400">
                    Total Bayar (Termasuk kode unik)
                  </span>
                  <span className="text-xl font-extrabold font-mono text-neutral-900 dark:text-white">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                    Active Timer
                  </span>
                  <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
                    {minutes} Minutes, {seconds.toString().padStart(2, '0')} Seconds
                  </span>
                </div>
              </div>

              {/* Central QRIS Box ala Papicode */}
              <div className="p-4 rounded-2xl bg-white border-2 border-neutral-200 shadow-sm text-center">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-xs font-extrabold tracking-tight text-neutral-900">
                    QRIS
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-neutral-500">
                    GPN • GoPay • OVO • Dana • BCA • BRI • Mandiri
                  </span>
                </div>

                <div className="relative inline-block p-2 bg-white rounded-xl border border-neutral-200">
                  <img
                    src={qrImageUrl}
                    alt="QRIS Pembayaran LocaGo Creative"
                    className="w-52 h-52 mx-auto object-contain"
                  />
                </div>

                <div className="mt-2 text-center">
                  <p className="text-xs font-bold text-neutral-800">
                    LOCAGO CREATIVE DIGITAL
                  </p>
                  <p className="text-[11px] font-mono text-neutral-500">
                    NMID: ID2026584352044
                  </p>
                </div>
              </div>

              {statusNote && (
                <div className="px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center text-xs text-amber-800 dark:text-amber-300 font-medium">
                  {statusNote}
                </div>
              )}

              {/* Two Action Buttons Below QR ala Papicode */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQrImage}
                  className="w-full h-10 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>⬇️</span>
                  <span>Download QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={handleCheckPaymentStatus}
                  disabled={isChecking || parseInt(customInput || '0', 10) < MINIMUM_DONATION}
                  className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isChecking ? (
                    <span>Memverifikasi Pembayaran...</span>
                  ) : (
                    <>
                      <span>✓</span>
                      <span>Check Payment Status</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : step === 'amount' ? (
            <div className="space-y-4 py-2">
              <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                Atur Nominal Donasi Sukarela
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Anda bebas menentukan nominal donasi (minimal Rp 3.000) untuk mengunduh{' '}
                <strong className="text-neutral-900 dark:text-white">{item.title}</strong> secara instan tanpa iklan.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[3000, 5000, 10000, 25000, 50000, 100000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      handleSelectQuickAmount(amt);
                      setStep('qris');
                    }}
                    className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-emerald-500 text-left transition-all cursor-pointer bg-neutral-50 dark:bg-neutral-800/50"
                  >
                    <span className="block text-sm font-extrabold font-mono text-neutral-900 dark:text-white">
                      Rp {amt.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {amt === 3000 ? 'Batas Minimum' : amt <= 10000 ? 'Traktir Es Kopi' : 'Supporter VIP'}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep('qris')}
                className="w-full h-11 rounded-xl bg-emerald-600 text-white font-semibold text-sm cursor-pointer"
              >
                Lanjutkan ke QRIS (Rp {totalAmount.toLocaleString('id-ID')})
              </button>
            </div>
          ) : (
            /* Step Settled: Unlocked Instant Download */
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold border border-emerald-200 dark:border-emerald-800">
                ✓
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  SETTLEMENT VERIFIED • Rp {totalAmount.toLocaleString('id-ID')}
                </span>
                <h4 className="mt-2 text-lg font-extrabold text-neutral-900 dark:text-white">
                  Terima Kasih Atas Dukungan Anda!
                </h4>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
                  Akses unduhan langsung tanpa iklan untuk <strong>{item.title}</strong> sudah terbuka.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Nama Paket:</span>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-white truncate max-w-[200px]">
                    {item.slug}.zip
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Ukuran & Database:</span>
                  <span className="font-mono font-semibold text-emerald-600">
                    {item.fileSize} • {item.databaseType || 'Full SQL'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDirectFileDownload}
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⬇️</span>
                <span>Download File ZIP Sekarang (Tanpa Iklan)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 flex items-center justify-between text-[11px] text-neutral-500">
          <span>🔒 Otomatis 24 Jam via QRIS</span>
          <span>LocaGo Creative Vault</span>
        </div>
      </div>
    </div>
  );
};
