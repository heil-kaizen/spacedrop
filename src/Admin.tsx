import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Copy, Plus, Trash2, ArrowLeft, Loader2, Save } from "lucide-react";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Starfield } from "./components/Starfield";

interface WalletData {
  address: string;
  amount: number;
  txHash: string;
  date: string;
}

interface AdminData {
  totalAirdropped: number;
  wallets: WalletData[];
}

export function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  
  // Form State
  const [newWallet, setNewWallet] = useState({ address: "", amount: "", txHash: "" });
  const [totalOverride, setTotalOverride] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Attempt to fetch data with this password to verify
    try {
      const res = await fetch("/api/airdrop-data", {
        headers: { "Authorization": `Bearer ${password}` } // Normally get is public, but let's test a save maybe?
      });
      // GET is public, so let's just do a dummy POST to verify
      const verifyRes = await fetch("/api/airdrop-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        // just post current data back to test auth without altering
        body: JSON.stringify(await res.json())
      });

      if (verifyRes.ok) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        alert("Invalid Password");
      }
    } catch (err) {
      alert("Error logging in");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const res = await fetch("/api/airdrop-data");
    const json = await res.json();
    setData(json);
    setTotalOverride(json.totalAirdropped.toString());
  };

  const handleSave = async (updatedData: AdminData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/airdrop-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
        alert("Saved successfully!");
      } else {
        alert("Failed to save");
      }
    } catch (err) {
      alert("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    if (!newWallet.address || !newWallet.amount) return;

    const newW: WalletData = {
      address: newWallet.address,
      amount: parseFloat(newWallet.amount),
      txHash: newWallet.txHash || "manual",
      date: new Date().toISOString()
    };

    const newData = {
      ...data,
      totalAirdropped: data.totalAirdropped + newW.amount, // Auto increment total
      wallets: [newW, ...data.wallets]
    };

    setTotalOverride(newData.totalAirdropped.toString());
    setNewWallet({ address: "", amount: "", txHash: "" });
    handleSave(newData);
  };

  const handleRemoveWallet = (index: number) => {
    if (!data) return;
    const newWallets = [...data.wallets];
    newWallets.splice(index, 1);
    const newData = { ...data, wallets: newWallets };
    handleSave(newData);
  };

  const handleUpdateTotal = () => {
    if (!data) return;
    const newData = { ...data, totalAirdropped: parseFloat(totalOverride) || 0 };
    handleSave(newData);
  };

  const [confirmWipe, setConfirmWipe] = useState(false);

  const handleWipeData = async () => {
    if (!confirmWipe) {
      setConfirmWipe(true);
      setTimeout(() => setConfirmWipe(false), 3000);
      return;
    }
    setLoading(true);
    try {
      const newData = { totalAirdropped: 0, wallets: [] };
      const res = await fetch("/api/airdrop-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify(newData)
      });
      if (res.ok) {
        setData(newData);
        setTotalOverride("0");
        setConfirmWipe(false);
      }
    } catch (err) {
      alert("Error wiping data");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6 text-white font-mono relative overflow-hidden">
        <Starfield />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[150px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-md">
          <Card className="w-full space-y-6 bg-black/40 border-white/20">
            <div className="space-y-2">
              <h1 className="text-2xl font-black uppercase tracking-widest text-white">Admin Access</h1>
              <p className="text-sm font-bold text-neutral-400">Enter clearance code to access mission control.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border-2 border-white/20 rounded-sm px-4 py-3 text-sm font-bold focus:outline-none focus:border-white transition-colors"
                autoFocus
              />
              <Button type="submit" className="w-full font-black uppercase tracking-widest h-12 bg-white text-black hover:bg-neutral-200" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "AUTHENTICATE"}
              </Button>
            </form>
            <Link to="/" className="block text-center text-xs opacity-50 hover:opacity-100 flex items-center justify-center gap-2 pt-4">
              <ArrowLeft className="w-4 h-4" /> Return to Base
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-neutral-300 font-mono p-6 relative overflow-hidden">
      <Starfield />
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <header className="flex justify-between items-center pb-6 border-b-2 border-white/10 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest">Mission Control</h1>
            <p className="text-sm font-bold opacity-50 uppercase tracking-widest">Manage SPCX Airdrop Distributions</p>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="font-black border-2 h-10 px-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> EXIT
            </Button>
          </Link>
        </header>

        {data && (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Control Panel */}
            <div className="space-y-8 col-span-1">
              <Card className="space-y-4 border-2 border-white/10">
                <h2 className="text-sm font-black text-white uppercase tracking-widest border-b-2 border-white/10 pb-3">Total Airdropped</h2>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={totalOverride}
                    onChange={(e) => setTotalOverride(e.target.value)}
                    className="w-full bg-black/50 border-2 border-white/10 rounded-sm px-3 py-2 text-sm font-bold focus:outline-hidden focus:border-white transition-colors"
                  />
                  <Button onClick={handleUpdateTotal} className="shrink-0 h-auto" disabled={loading}>
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs font-bold text-neutral-500">Manually override total if out of sync.</p>
              </Card>

              <Card className="space-y-4 border-2 border-white/10">
                <h2 className="text-sm font-black text-white uppercase tracking-widest border-b-2 border-white/10 pb-3">Log New Airdrop</h2>
                <form onSubmit={handleAddWallet} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Wallet Address</label>
                    <input 
                      type="text" 
                      required
                      value={newWallet.address}
                      onChange={(e) => setNewWallet({...newWallet, address: e.target.value})}
                      className="w-full bg-black/50 border-2 border-white/10 rounded-sm px-3 py-2 text-sm font-bold focus:outline-hidden focus:border-white transition-colors"
                      placeholder="Solana Address"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">SPCX Amount</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      step="any"
                      value={newWallet.amount}
                      onChange={(e) => setNewWallet({...newWallet, amount: e.target.value})}
                      className="w-full bg-black/50 border-2 border-white/10 rounded-sm px-3 py-2 text-sm font-bold focus:outline-hidden focus:border-white transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                  <Button type="submit" className="w-full font-black uppercase tracking-widest h-12 bg-white text-black hover:bg-neutral-200" disabled={loading}>
                    <Plus className="w-4 h-4 mr-2" /> ADD LOG
                  </Button>
                </form>
              </Card>
            </div>

            {/* Logs List */}
            <div className="col-span-2">
               <Card className="min-h-[500px] border-2 border-white/10">
                <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-white/10">
                  <h2 className="text-sm font-black tracking-widest text-white uppercase">Airdrop Manifest ({data.wallets.length})</h2>
                  <Button variant="outline" size="sm" onClick={handleWipeData} className="border-red-500/50 text-red-500 hover:bg-red-500/20 font-bold uppercase tracking-widest cursor-pointer px-4">
                    <Trash2 className="w-4 h-4 mr-2" /> {confirmWipe ? "SURE?" : "WIPE LOGS"}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {data.wallets.map((w, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-sm border-2 border-transparent hover:border-white/20 transition-colors group">
                      <div>
                        <div className="text-sm font-bold text-white">{w.address}</div>
                        <div className="text-xs font-bold text-neutral-500 mt-1">
                          {new Date(w.date).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-green-400 font-black tracking-widest">+{w.amount} SPCX</span>
                        <button 
                          onClick={() => handleRemoveWallet(i)}
                          className="text-neutral-500 hover:text-red-400 p-1 bg-black/40 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {data.wallets.length === 0 && (
                    <div className="text-center py-12 text-sm text-neutral-500 border border-dashed border-white/10 rounded-sm">
                      No logs found.
                    </div>
                  )}
                </div>
               </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
