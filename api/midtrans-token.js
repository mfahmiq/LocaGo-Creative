// Vercel Serverless Function: Generate Midtrans Snap Transaction Token
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { amount, slug, title, orderId: customOrderId } = req.body || {};
    const donationAmount = Math.max(3000, parseInt(amount || 3000, 10));
    const orderId = customOrderId || `LOCAGO-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 899 + 100)}`;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error('Missing MIDTRANS_SERVER_KEY in environment variables');
      return res.status(500).json({ error: 'Server key Midtrans belum dikonfigurasi di environment Vercel.' });
    }

    const isSandbox = serverKey.startsWith('SB-');
    const snapUrl = isSandbox ? 'https://app.sandbox.midtrans.com/snap/v1/transactions' : 'https://app.midtrans.com/snap/v1/transactions';

    const authHeader = 'Basic ' + Buffer.from(serverKey + ':').toString('base64');

    const snapPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: donationAmount
      },
      item_details: [
        {
          id: (slug || 'digital-product').slice(0, 50),
          price: donationAmount,
          quantity: 1,
          name: (title || 'Source Code & Digital Product').slice(0, 50)
        }
      ],
      customer_details: {
        first_name: 'Supporter',
        email: 'supporter@locago.my.id'
      },
      enabled_payments: ['qris', 'gopay', 'shopeepay', 'bca_va', 'bni_va', 'bri_va', 'mandiri_va', 'other_qris']
    };

    const midtransRes = await fetch(snapUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(snapPayload)
    });

    const data = await midtransRes.json();
    if (!midtransRes.ok || !data.token) {
      console.error('Midtrans API error response:', data);
      return res.status(midtransRes.status || 500).json({
        error: (data.error_messages && data.error_messages.join(', ')) || 'Gagal menghasilkan token pembayaran Midtrans',
        details: data
      });
    }

    return res.status(200).json({
      orderId,
      token: data.token,
      redirectUrl: data.redirect_url
    });
  } catch (err) {
    console.error('Error generating Midtrans token:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
