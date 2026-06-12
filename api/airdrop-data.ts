import type { VercelRequest, VercelResponse } from '@vercel/node';

let temporaryData = {
  totalAirdropped: 0,
  wallets: [],
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "orbit2026";

  if (req.method === 'GET') {
    return res.status(200).json(temporaryData);
  }

  if (req.method === 'POST') {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Only parse body if it exists
    if (req.body) {
        temporaryData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }
    return res.status(200).json({ success: true, data: temporaryData });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
