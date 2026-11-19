// lib/midtrans.ts — pembayaran donasi & submit tool via Midtrans Snap.
// Memakai endpoint /api/midtrans-token yang SUDAH live production di Vercel
// (server key ada di env Vercel, tidak pernah disentuh dari browser).
// Snap JS sudah dimuat di index.html (client key publik).

export interface SnapResult {
  orderId: string;
  token: string;
  redirectUrl?: string;
}

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        callbacks: {
          onSuccess?: (r: unknown) => void;
          onPending?: (r: unknown) => void;
          onError?: (r: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export function makeOrderId(prefix: 'DONASI' | 'SUBMIT'): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${prefix}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${Math.floor(Math.random() * 900 + 100)}`;
}

export async function requestSnapToken(orderId: string, amount: number, slug: string, title: string): Promise<SnapResult> {
  const res = await fetch('/api/midtrans-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, amount, slug, title }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) {
    throw new Error(data?.error || 'Gagal membuat token pembayaran Midtrans.');
  }
  return { orderId: data.orderId || orderId, token: data.token, redirectUrl: data.redirectUrl };
}

export async function checkPaymentStatus(orderId: string): Promise<{ isPaid: boolean; status?: string }> {
  const res = await fetch(`/api/midtrans-status?orderId=${encodeURIComponent(orderId)}`);
  const data = await res.json().catch(() => ({}));
  return { isPaid: Boolean(data?.isPaid), status: data?.status };
}

/** Buka popup Snap. Resolve true kalau pembayaran selesai/pending (lalu diverifikasi server). */
export function payWithSnap(token: string): Promise<'success' | 'pending' | 'error' | 'closed'> {
  return new Promise((resolve) => {
    if (!window.snap) {
      resolve('error');
      return;
    }
    window.snap.pay(token, {
      onSuccess: () => resolve('success'),
      onPending: () => resolve('pending'),
      onError: () => resolve('error'),
      onClose: () => resolve('closed'),
    });
  });
}
