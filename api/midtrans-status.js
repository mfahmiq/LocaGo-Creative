// Vercel Serverless Function: Check Midtrans Transaction Status
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const orderId = req.query?.orderId;
  if (!orderId) {
    return res.status(400).json({ error: 'Missing orderId parameter' });
  }

  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error('Missing MIDTRANS_SERVER_KEY in environment variables');
      return res.status(500).json({ error: 'Server key Midtrans belum dikonfigurasi di environment Vercel.' });
    }

    const isSandbox = serverKey.startsWith('SB-');
    const apiUrl = isSandbox 
      ? `https://api.sandbox.midtrans.com/v2/${encodeURIComponent(orderId)}/status`
      : `https://api.midtrans.com/v2/${encodeURIComponent(orderId)}/status`;

    const authHeader = 'Basic ' + Buffer.from(serverKey + ':').toString('base64');

    const statusRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': authHeader
      }
    });

    const data = await statusRes.json();
    const isPaid = ['settlement', 'capture'].includes(data.transaction_status);

    return res.status(200).json({
      orderId,
      status: data.transaction_status || 'pending',
      statusCode: data.status_code,
      isPaid
    });
  } catch (err) {
    console.error('Error checking Midtrans status:', err);
    return res.status(500).json({ error: err.message || 'Failed to check status' });
  }
}
