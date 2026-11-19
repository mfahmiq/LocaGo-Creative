// components/SubmitToolModal.tsx — Submit Tool Berbayar (tanpa login).
// Tier (Fahmi 2026-11-19, boost 30 hari):
//   Rp10.000–49.999  -> antrean moderasi (tampil kalau di-ACC)
//   Rp50.000+        -> AUTO-ACC langsung live, TAPI tetap lolos cek keamanan
//                       otomatis di server (URL hidup, bukan duplikat, bukan
//                       phishing/judi/porn/malware). Gagal cek = auto-tolak,
//                       refund diproses manual dikurangi fee Midtrans.
//   Upload media +Rp5.000/submit: maks 1 video demo (30 dtk / 50 MB) + 3 gambar.
// Setelah bayar terverifikasi, submitter langsung dapat link Portal Pelanggan
// (token UUID) di layar sukses — tanpa menunggu email/manual.
import React, { useRef, useState } from 'react';
import { X, Check, Loader2, Copy, ShieldCheck, Zap, ExternalLink, Video, Image as ImageIcon, Coffee } from 'lucide-react';
import { makeOrderId, requestSnapToken, payWithSnap, checkPaymentStatus } from '../lib/midtrans';
import { formatRupiah } from '../lib/utm';
import { supabase } from '../lib/supabase';
import { portalUrl } from '../lib/portal';

const CATEGORIES = ['AI Coding', 'AI Writing & SEO', 'Automation & No-Code', 'Video & Graphics', 'Voice & Audio AI'];
const PRESETS = [10000, 25000, 50000, 100000];
const MEDIA_FEE = 5000;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const SOCIALS = [
  { label: 'Threads', url: 'https://www.threads.com/@locagocreative' },
  { label: 'Instagram', url: 'https://www.instagram.com/locagocreative' },
  { label: 'YouTube', url: 'https://www.youtube.com/@locagocreative' },
];

type Phase = 'form' | 'paying' | 'verifying' | 'done' | 'error';

export const SubmitToolModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [toolName, setToolName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [pricing, setPricing] = useState('Freemium');
  const [description, setDescription] = useState('');
  const [contactWa, setContactWa] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [donation, setDonation] = useState<number>(25000);
  const [customDonation, setCustomDonation] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [phase, setPhase] = useState<Phase>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [portalToken, setPortalToken] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [boostUntil, setBoostUntil] = useState('');
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const donationAmount = customDonation ? Math.max(10000, Math.floor(Number(customDonation) || 0)) : donation;
  const hasMedia = Boolean(videoFile) || imageFiles.length > 0;
  const totalAmount = donationAmount + (hasMedia ? MEDIA_FEE : 0);
  const isAutoAcc = donationAmount >= 50000;

  const validateVideo = (file: File): Promise<string | null> =>
    new Promise((resolve) => {
      if (file.size > MAX_VIDEO_BYTES) return resolve('Video maksimal 50 MB.');
      const url = URL.createObjectURL(file);
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        if (v.duration > 31) resolve('Video demo maksimal 30 detik.');
        else resolve(null);
      };
      v.onerror = () => resolve(null); // tidak bisa dibaca: biarkan server/moderasi menilai
      v.src = url;
    });

  const handlePay = async () => {
    if (!toolName.trim() || !websiteUrl.trim() || description.trim().length < 20) {
      setErrorMsg('Lengkapi nama tool, URL resmi, dan deskripsi (minimal 20 karakter).');
      setPhase('error');
      return;
    }
    if (!contactWa.trim() && !contactEmail.trim()) {
      setErrorMsg('Isi minimal satu kontak: nomor WA atau email.');
      setPhase('error');
      return;
    }
    let url: URL;
    try {
      url = new URL(websiteUrl.trim());
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('bad');
    } catch {
      setErrorMsg('URL website resmi tidak valid (harus http/https).');
      setPhase('error');
      return;
    }
    if (donationAmount < 10000) {
      setErrorMsg('Donasi submit minimal Rp10.000.');
      setPhase('error');
      return;
    }
    setPhase('paying');
    setErrorMsg('');
    const orderId = makeOrderId('SUBMIT');
    try {
      // 1) Upload media dulu (kalau ada) ke bucket tool-media.
      const mediaUrls: string[] = [];
      if (videoFile) {
        const path = `submissions/${orderId}/${Date.now()}-demo-${videoFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { error } = await supabase.storage.from('tool-media').upload(path, videoFile, { upsert: false });
        if (error) throw new Error('Upload video gagal: ' + error.message);
        mediaUrls.push(supabase.storage.from('tool-media').getPublicUrl(path).data.publicUrl);
      }
      for (const f of imageFiles) {
        const path = `submissions/${orderId}/${Date.now()}-${f.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { error } = await supabase.storage.from('tool-media').upload(path, f, { upsert: false });
        if (error) throw new Error('Upload gambar gagal: ' + error.message);
        mediaUrls.push(supabase.storage.from('tool-media').getPublicUrl(path).data.publicUrl);
      }

      // 2) Token Midtrans + catat order di ledger donasi.
      const { token } = await requestSnapToken(orderId, totalAmount, 'submit-tool', `Submit Tool: ${toolName.trim().slice(0, 40)}`);
      await supabase.from('donations').insert({
        order_id: orderId, type: 'submit', amount: totalAmount, status: 'pending', tool_name: toolName.trim(),
      });

      // 3) Bayar via Snap.
      const result = await payWithSnap(token);
      if (result === 'closed' || result === 'error') {
        setErrorMsg(result === 'closed' ? 'Pembayaran ditutup sebelum selesai.' : 'Popup pembayaran gagal dibuka.');
        setPhase('error');
        return;
      }

      // 4) Verifikasi bayar, lalu submit ke server (cek keamanan + simpan).
      setPhase('verifying');
      const check = await checkPaymentStatus(orderId);
      if (check.isPaid) {
        await supabase.rpc('update_donation_status', { p_order_id: orderId, p_status: 'settlement' });
      }
      const res = await fetch('/api/submit-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId, donationAmount, mediaFee: hasMedia ? MEDIA_FEE : 0, mediaUrls,
          toolName: toolName.trim(), websiteUrl: url.toString(), category,
          pricingType: pricing, description: description.trim(),
          contactWa: contactWa.trim(), contactEmail: contactEmail.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data?.error || 'Submit gagal diproses. Hubungi WA LocaGo dengan Order ID ' + orderId + ' — pembayaran kamu tercatat dan akan diverifikasi manual.');
        setPhase('error');
        return;
      }
      setPortalToken(data.portal_token || '');
      setSubmitStatus(data.submit_status || 'pending');
      setBoostUntil(data.boost_until || '');
      setPhase('done');
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Terjadi kesalahan. Coba lagi.');
      setPhase('error');
    }
  };

  const copyPortalLink = async () => {
    try {
      await navigator.clipboard.writeText(portalUrl(portalToken));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full shadow-2xl relative my-8 text-neutral-900 dark:text-white max-h-[92vh] flex flex-col overflow-hidden">
        <button onClick={onClose} aria-label="Tutup" className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer p-1">
          <X className="w-5 h-5" />
        </button>

        {phase === 'done' ? (
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-xl font-bold">{submitStatus === 'auto_approved' ? 'Tool Kamu Langsung LIVE!' : 'Submit Berhasil — Menunggu Moderasi'}</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {submitStatus === 'auto_approved'
                ? `Donasi ${formatRupiah(donationAmount)} ≥ Rp50.000 dan lolos cek keamanan — "${toolName}" sudah tampil di katalog dengan boost 30 hari${boostUntil ? ` sampai ${new Date(boostUntil).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}.`
                : `"${toolName}" masuk antrean moderasi. Kami periksa 1x24 jam — kalau data kurang lengkap, kamu bisa perbaiki tanpa bayar lagi.`}
            </p>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4">
              <p className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 mb-1">PORTAL PELANGGAN KAMU</p>
              <p className="text-[11px] text-neutral-500 mb-3">Simpan link ini — satu-satunya akses untuk melihat status, ranking, dan trafik tool kamu. Tanpa login.</p>
              <button onClick={copyPortalLink} className="w-full px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                <Copy className="w-4 h-4" /> {copied ? 'Link Disalin!' : 'Salin Link Portal'}
              </button>
              <a href={portalUrl(portalToken)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 underline mt-3">
                Buka Portal Pelanggan <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="pt-1">
              <p className="text-xs font-mono font-bold mb-2">Lihat di mana tool kamu akan dipromosikan</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-mono font-bold flex items-center gap-1.5">
                    {s.label} <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-mono font-bold cursor-pointer">Tutup</button>
          </div>
        ) : (
          <>
            <div className="shrink-0 px-6 sm:px-8 pt-6 sm:pt-8">
              <h3 className="text-xl font-bold mb-1">Submit Tool Berbayar</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Daftarkan tool kamu ke AI Tool Library LocaGo. Tanpa login — cukup isi form, donasi, dan bayar via Midtrans (QRIS, GoPay, VA).
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 sm:px-8 pt-5 pb-4 space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium mb-1">Nama Tool *</label>
                <input type="text" required value={toolName} onChange={(e) => setToolName(e.target.value)} placeholder="Contoh: MyGenius AI" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium mb-1">Website Resmi *</label>
                <input type="url" required value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://mygenius.ai" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-medium mb-1">Kategori</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono">
                    {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-medium mb-1">Model Harga</label>
                  <select value={pricing} onChange={(e) => setPricing(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono">
                    <option value="Freemium">Freemium</option>
                    <option value="Free Trial">Free Trial</option>
                    <option value="Paid">Paid</option>
                    <option value="Free">100% Free</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono font-medium mb-1">Deskripsi Singkat * (min 20 karakter)</label>
                <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Apa yang dilakukan tool ini dan kenapa orang harus menggunakannya..." className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-medium mb-1">WhatsApp *</label>
                  <input type="text" value={contactWa} onChange={(e) => setContactWa(e.target.value)} placeholder="62812xxxx" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-mono font-medium mb-1">Email</label>
                  <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="kamu@email.com" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium mb-1">Donasi (min Rp10.000) — makin besar, makin atas urutannya</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {PRESETS.map((p) => (
                    <button key={p} type="button" onClick={() => { setDonation(p); setCustomDonation(''); }} className={`py-2 rounded-xl text-xs font-mono font-bold border cursor-pointer ${!customDonation && donation === p ? 'bg-purple-600 text-white border-purple-600' : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-purple-400'}`}>
                      {p / 1000}rb
                    </button>
                  ))}
                </div>
                <input type="number" min={10000} value={customDonation} onChange={(e) => setCustomDonation(e.target.value)} placeholder="Nominal lain (min Rp10.000)" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <div className="mt-2 space-y-1 text-[11px] leading-relaxed">
                  <p className="flex items-center gap-1.5 text-neutral-500"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Rp10.000–49.999: masuk antrean moderasi (1x24 jam).</p>
                  <p className="flex items-center gap-1.5 text-neutral-500"><Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Rp50.000+: AUTO-ACC langsung live + boost 30 hari (tetap lolos cek keamanan otomatis).</p>
                </div>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4">
                <label className="block text-xs font-mono font-medium mb-1">Upload Media (+Rp5.000) — opsional</label>
                <p className="text-[11px] text-neutral-500 mb-3">1 video demo maks 30 detik / 50 MB + maks 3 gambar. Media dipakai di halaman tool & bahan promosi reel.</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => videoRef.current?.click()} className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer">
                    <Video className="w-3.5 h-3.5" /> {videoFile ? `Video: ${videoFile.name.slice(0, 18)}` : 'Pilih Video Demo'}
                  </button>
                  <button type="button" onClick={() => imageRef.current?.click()} className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer">
                    <ImageIcon className="w-3.5 h-3.5" /> Gambar ({imageFiles.length}/3)
                  </button>
                </div>
                <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const err = await validateVideo(f);
                  if (err) { setErrorMsg(err); setPhase('error'); return; }
                  setVideoFile(f);
                }} />
                <input ref={imageRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                  const files = Array.from(e.target.files || []).filter((f) => f.size <= MAX_IMAGE_BYTES).slice(0, 3 - imageFiles.length);
                  setImageFiles((prev) => [...prev, ...files].slice(0, 3));
                }} />
                {(videoFile || imageFiles.length > 0) && (
                  <button type="button" onClick={() => { setVideoFile(null); setImageFiles([]); }} className="text-[11px] text-red-500 underline mt-2 cursor-pointer">Hapus semua media (−Rp5.000)</button>
                )}
              </div>

              <div>
                <p className="text-xs font-mono font-bold mb-2">Lihat di mana tool kamu akan dipromosikan</p>
                <div className="flex flex-wrap gap-2">
                  {SOCIALS.map((s) => (
                    <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-mono font-bold flex items-center gap-1.5">
                      {s.label} <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-500 mt-2">Top 10 donasi terbesar tiap minggu dipromosikan jadi reel video + postingan Threads LocaGo.</p>
              </div>

              {phase === 'error' && (
                <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{errorMsg}</p>
              )}
              {phase === 'error' && errorMsg.includes('ditolak') && (
                <p className="text-[11px] text-neutral-500">Jika submission ditolak karena tidak layak, refund diproses manual dikurangi fee Midtrans. Kalau data kurang lengkap, kamu bisa perbaiki tanpa bayar lagi — hubungi WA LocaGo.</p>
              )}

            </div>
            {/* Footer menempel di bawah modal (sticky): tombol Batal / Bayar
                selalu terlihat tanpa scroll, body form yang scroll. */}
            <div className="shrink-0 px-6 sm:px-8 pt-4 pb-6 sm:pb-8 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-xs font-mono border border-neutral-300 dark:border-neutral-700 cursor-pointer">Batal</button>
                <button
                  onClick={handlePay}
                  disabled={phase === 'paying' || phase === 'verifying'}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {phase === 'paying' || phase === 'verifying' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {phase === 'paying' ? 'Memproses Pembayaran...' : 'Memverifikasi...'}</>
                  ) : (
                    <><Coffee className="w-4 h-4" /> Bayar {formatRupiah(totalAmount)}{isAutoAcc ? ' — Auto-ACC' : ''} →</>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-neutral-400 text-center mt-3">Dengan submit, kamu menyetujui kurasi LocaGo: tool yang melanggar (scam, judi, malware, konten dewasa) ditolak/ditakedown tanpa pengembalian penuh.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
