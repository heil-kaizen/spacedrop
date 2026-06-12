import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

// Initialize data file for airdrop admin
const DATA_FILE = path.join(process.cwd(), "airdropData.json");

const defaultData = {
  totalAirdropped: 0,
  wallets: [],
};

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API constraints
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "orbit2026";

  // --- API Routes ---

  // Get Admin Data (Public to read)
  app.get("/api/airdrop-data", (req, res) => {
    try {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  // Update Admin Data (Protected)
  app.post("/api/airdrop-data", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const newData = req.body;
      fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
      res.json({ success: true, data: newData });
    } catch (error) {
      res.status(500).json({ error: "Failed to save data" });
    }
  });

  // Token Info Proxy
  app.get("/api/token-info/:address", async (req, res) => {
    try {
      const address = req.params.address;
      // Using dexscreener as it's reliable and doesn't require keys usually
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
      const data = await response.json();
      
      // We will parse the logic on the frontend, but let's just return the raw data
      res.json(data);
    } catch (error) {
      console.error("Error fetching token info:", error);
      res.status(500).json({ error: "Failed to fetch token info" });
    }
  });

  // --- Vite Middleware (Development) ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // --- Static Serving (Production) ---
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
