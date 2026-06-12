import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Rocket, Activity, Box, Users, ChevronRight, Terminal } from "lucide-react";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Starfield } from "./components/Starfield";
import { cn } from "./utils";

const CONTRACT_ADDRESS = "FB2W73DapKJwqscJ4pLZn2CyYrgMrWsafSoRbD7hpump";

interface TokenData {
  priceUsd?: string;
  fdv?: number;
  volume?: { h24?: number };
  priceChange?: { h24?: number };
  liquidity?: { usd?: number };
}

interface AdminData {
  totalAirdropped: number;
  wallets: { address: string; amount: number; txHash: string; date: string }[];
}

export function Home() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch token data via our proxy
    fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRACT_ADDRESS}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.pairs && data.pairs.length > 0) {
          setTokenData(data.pairs[0]);
        }
      })
      .catch((err) => console.error("Error fetching token data:", err));

    // Fetch admin data
    fetch("/api/airdrop-data")
      .then((res) => res.json())
      .then((data) => setAdminData(data))
      .catch((err) => console.error("Error fetching admin data:", err));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (val?: number) => {
    if (!val) return "$0.00";
    if (val > 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val > 1000) return `$${(val / 1000).toFixed(2)}K`;
    return `$${val.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-transparent text-neutral-300 font-sans selection:bg-white/30 relative overflow-hidden">
      <Starfield />
      {/* Space Background Effects Removed */}


      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10 border-b border-white/5 mb-8">
        <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <img src="https://raw.githubusercontent.com/heil-kaizen/spacedrop/main/spacedrop-wordmark.png" alt="SPACEDROP" className="h-8 md:h-10 mt-1 object-contain" />
        </Link>
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6">
          <Link to="/docs" className="font-mono text-xs sm:text-sm font-bold tracking-widest text-white hover:text-neutral-300 uppercase transition-colors">
            Docs
          </Link>
          <a href="https://x.com/SpaceDroponSOL" target="_blank" rel="noopener noreferrer" className="text-white hover:text-neutral-300 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-5 sm:h-5 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <div className="relative group cursor-pointer ml-1 sm:ml-2" onClick={handleCopy}>
            <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:bg-white/30 transition-all"></div>
            <div className="relative border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors">
              <span className="font-mono text-[10px] sm:text-xs font-bold text-white tracking-widest uppercase">
                {copied ? "COPIED" : `CA: ${CONTRACT_ADDRESS.slice(0, 4)}...${CONTRACT_ADDRESS.slice(-4)}`}
              </span>
              <Copy className="w-3 h-3 text-neutral-300" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pb-24 relative z-10">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-16 py-20 items-center">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-[6rem] font-mono font-black tracking-tighter leading-[0.9] text-white">
              INFINITE <br className="hidden md:block" />
              <span className="text-neutral-600">&gt;&gt;&gt;</span> <br />
              REWARDS<span className="text-white">↗</span>
              <span className="block mt-8 text-neutral-400 text-4xl md:text-6xl tracking-tight">
                DESTINATION: <br />ORBIT.
              </span>
            </h1>

            <div className="space-y-4 font-mono text-base md:text-lg text-neutral-400 border-l-4 border-white/20 pl-6">
              <p className="flex items-center gap-2">
                <span className="text-white">&gt;</span> Hold <span className="text-white font-bold">$SPACEDROP</span> · earn tokenized <span className="text-white font-bold">$SPCX</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-white">~</span> Every trade fuels automatic buybacks + airdrops
              </p>
              <p className="flex items-center gap-2">
                <span className="text-white">&gt;</span> SpaceX is public. The loop never stops.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <a href={`https://raydium.io/swap/?outputCurrency=${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer">
                <Button className="h-14 px-8 font-black uppercase tracking-widest text-sm group font-mono bg-white text-[#0b0913] hover:bg-neutral-200 cursor-pointer">
                   Buy $SPACEDROP
                   <Rocket className="w-5 h-5 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </a>
              <Button 
                variant="outline" 
                className="h-14 px-8 font-bold uppercase tracking-widest text-sm font-mono border-2 cursor-pointer"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                How Rewards Work
              </Button>
            </div>
          </div>

          <div className="relative">
            <Card className="p-1 aspect-square md:aspect-auto md:h-[500px] flex flex-col justify-between border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                   MISSION LOG // TERMINAL
                   <span className="ml-auto opacity-50">$SPCX REWARDS · LIVE ∞</span>
                </div>
                
                <div className="font-mono text-sm font-bold space-y-2 text-green-500/80 uppercase">
                  <p>SYSTEM BOOT SEQUENCE INITIATED...</p>
                  <p>&gt; SYNCING REWARDS ENGINE...</p>
                  <p>&gt; SCANNING HOLDER DATABASE (MIN: 1M $SPACEDROP)...</p>
                  <p>&gt; BUYBACK QUEUE ACTIVE</p>
                  <p>&gt; AIRDROP VECTOR LOCKED</p>
                  <p className="text-white">&gt; TOTAL DISTRIBUTED: {adminData?.totalAirdropped || 0} SPCX</p>
                  <p className="animate-pulse">_</p>
                </div>
              </div>

            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-y border-white/10 font-mono">
          <div className="space-y-2">
            <div className="text-xs text-neutral-500 uppercase font-bold tracking-widest">Price</div>
            <div className="text-2xl md:text-4xl font-black tracking-tighter text-white">
              ${tokenData?.priceUsd || "0.000000"}
            </div>
            {tokenData?.priceChange?.h24 !== undefined && (
              <div className={cn("text-sm font-bold tracking-widest mt-2", tokenData.priceChange.h24 >= 0 ? "text-green-500" : "text-red-500")}>
                {tokenData.priceChange.h24 >= 0 ? "+" : ""}{tokenData.priceChange.h24}% · 24H
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="text-xs text-neutral-500 uppercase font-bold tracking-widest">Market Cap</div>
            <div className="text-2xl md:text-4xl font-black tracking-tighter text-white">{formatCurrency(tokenData?.fdv)}</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-neutral-500 uppercase font-bold tracking-widest">Volume 24H</div>
            <div className="text-2xl md:text-4xl font-black tracking-tighter text-white">{formatCurrency(tokenData?.volume?.h24)}</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-neutral-500 uppercase font-bold tracking-widest">Liquidity</div>
            <div className="text-2xl md:text-4xl font-black tracking-tighter text-white">{formatCurrency(tokenData?.liquidity?.usd)}</div>
          </div>
        </section>

        {/* The Loop Section */}
        <section id="how-it-works" className="py-24">
          <h2 className="font-mono text-2xl font-black tracking-tight text-white mb-12 flex items-center gap-4 uppercase border-b border-white/10 pb-6">
            <Activity className="w-6 h-6 text-neutral-400" />
            THE_LOOP.EXE // HOW REWARDS WORK
          </h2>
          <div className="grid md:grid-cols-4 gap-6 font-mono">
            <Card className="space-y-4 col-span-1 border-white/10 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all group">
               <div className="text-6xl font-black opacity-10 group-hover:opacity-40 transition-opacity">01</div>
               <h3 className="font-black text-white uppercase tracking-widest text-sm group-hover:text-neutral-300 transition-colors">Trade Happens</h3>
               <p className="text-sm text-neutral-400 leading-relaxed group-hover:text-white transition-colors">
                 Every buy/sell routes a slice into the engine via smart contract protocol. Volume feeds the machine.
               </p>
            </Card>
            <Card className="space-y-4 col-span-1 border-white/10 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all group">
               <div className="text-6xl font-black opacity-10 group-hover:opacity-40 transition-opacity">02</div>
               <h3 className="font-black text-white uppercase tracking-widest text-sm group-hover:text-neutral-300 transition-colors">Engine Buys SPCX</h3>
               <p className="text-sm text-neutral-400 leading-relaxed group-hover:text-white transition-colors">
                 The treasury takes those routed fees and market-buys tokenized SPCX directly on Solana DEXs.
               </p>
            </Card>
            <Card className="space-y-4 col-span-1 border-white/10 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all group">
               <div className="text-6xl font-black opacity-10 group-hover:opacity-40 transition-opacity">03</div>
               <h3 className="font-black text-white uppercase tracking-widest text-sm flex justify-between items-start group-hover:text-neutral-300 transition-colors">
                 Holders Paid 
               </h3>
               <p className="text-sm text-neutral-400 leading-relaxed group-hover:text-white transition-colors">
                 SPCX is manually airdropped to all eligible wallets proportional to holdings. No claiming. Min 1M $SPACEDROP required.
               </p>
            </Card>
            <Card className="space-y-4 col-span-1 border-white/10 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all group">
               <div className="text-6xl font-black opacity-10 group-hover:opacity-40 transition-opacity">04</div>
               <h3 className="font-black text-white uppercase tracking-widest text-sm flex justify-between items-start group-hover:text-neutral-300 transition-colors">
                 Loop Compounds 
               </h3>
               <p className="text-sm text-neutral-400 leading-relaxed group-hover:text-white transition-colors">
                 More volume &rarr; more buybacks &rarr; more rewards &rarr; to infinity.
               </p>
            </Card>
          </div>
        </section>

        {/* Crew Manifest (Recent Airdrops) */}
        <section className="py-12">
           <h2 className="font-mono text-2xl font-black tracking-widest text-white mb-8 flex items-center gap-4 border-b border-white/10 pb-6 uppercase">
            <Users className="w-6 h-6 text-neutral-400" />
            Crew Manifest // Distributions
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-sm">
              <thead className="text-neutral-500 border-b-2 border-white/10 uppercase tracking-widest font-bold">
                <tr>
                  <th className="pb-4 font-black">Rank</th>
                  <th className="pb-4 font-black">Wallet</th>
                  <th className="pb-4 font-black text-right">SPCX Airdropped</th>
                  <th className="pb-4 font-black text-right hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300 font-bold">
                {adminData?.wallets && adminData.wallets.length > 0 ? (
                  adminData.wallets.map((w, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 opacity-50 font-black">#{i + 1}</td>
                      <td className="py-4 text-white">
                        {w.address.slice(0, 6)}...{w.address.slice(-4)}
                      </td>
                      <td className="py-4 text-right text-green-400 font-black tracking-widest">+{w.amount}</td>
                      <td className="py-4 text-right hidden md:table-cell opacity-50">{new Date(w.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-neutral-500">
                      // HOLDER MANIFEST SYNCING... <br />
                      No airdrops distributed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
