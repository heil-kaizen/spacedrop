import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Starfield } from "./components/Starfield";

export default function Docs() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = [
        "overview",
        "the-reward-loop",
        "compounding-physics",
        "tokenomics"
      ].map(id => document.getElementById(id)).filter(Boolean);
      
      let currentActive = "overview";
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            currentActive = el.id;
            break;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    {
      id: "overview",
      title: "Overview",
      content: (
        <div className="space-y-6 text-neutral-400 leading-relaxed text-sm md:text-base">
          <p>
            SPACEDROP is an autonomous reward engine on the Solana blockchain. Experience a decentralized protocol built from 
            immutable smart contracts, capturing transaction volume and redirecting it as tokenized equity.
          </p>
          <p>
            Most reward tokens trap your collection forever; most Web3 "engines" ship a spreadsheet with a token bolted on. SPACEDROP is the reward loop you love + real ownership + a genuinely autonomous treasury running live with the community.
          </p>
          <h3 className="text-xl font-bold text-white mt-12 mb-6">The three pillars</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-white mt-2 shrink-0"></span>
              <span><strong className="text-neutral-200">Autonomous Execution</strong> — a real decentralized engine with a protocol-based capture loop, not a manual chart.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-white mt-2 shrink-0"></span>
              <span><strong className="text-neutral-200">Truly transparent</strong> — see, verify, and track the treasury volume with others in a shared, on-chain ledger.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-white mt-2 shrink-0"></span>
              <span><strong className="text-neutral-200">Actually ownable</strong> — captured rewards mint to your wallet natively and trade on an open marketplace.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: "the-reward-loop",
      title: "The reward loop",
      content: (
        <div className="space-y-6 text-neutral-400 leading-relaxed text-sm md:text-base">
          <p>
            Earning is protocol-based: hold the token first, then capture the volume. Higher volume means a higher accumulation 
            rate — complexity is reduced, holding is rewarded.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-white mt-2 shrink-0"></span>
              <span><strong className="text-neutral-200">Initiate</strong> — Every single operational transaction—whether a buy or a sell—triggers the protocol's fee-capture mechanism.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-white mt-2 shrink-0"></span>
              <span><strong className="text-neutral-200">Route</strong> — A specific numerical slice of the volume is siphoned securely into the central treasury.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-white mt-2 shrink-0"></span>
              <span><strong className="text-neutral-200">Accumulate</strong> — The treasury engine is not static. Heavy network activity translates directly into higher accumulation velocity.</span>
            </li>
             <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-white mt-2 shrink-0"></span>
              <span><strong className="text-neutral-200">Acquire</strong> — Upon reaching programmable thresholds, the treasury goes algorithmic to execute market-price purchases.</span>
            </li>
             <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-white mt-2 shrink-0"></span>
              <span><strong className="text-neutral-200">Distribute</strong> — Proportional airdrops to all token holders seamlessly.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: "compounding-physics",
      title: "Compounding physics",
      content: (
        <div className="space-y-6 text-neutral-400 leading-relaxed text-sm md:text-base">
          <p>
            The loop is infinitely recursive. Volume generates fees. Fees buy SPCX. SPCX is airdropped to holders. A perpetual motion machine fueled entirely by decentralized market physics.
          </p>
        </div>
      )
    },
    {
      id: "tokenomics",
      title: "Tokenomics",
      content: (
        <div className="space-y-6 text-neutral-400 leading-relaxed text-sm md:text-base">
          <p>
            A carefully balanced ecosystem designed for long-term sustainability and rewarding early adopters. 
            No VC unlocks, no hidden team wallets. 100% fair launch mechanics.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-white mt-2 shrink-0"></span>
              <span><strong className="text-neutral-200">Supply</strong> — 1,000,000,000 capped total supply.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-white mt-2 shrink-0"></span>
              <span><strong className="text-neutral-200">Tax</strong> — 5% on buys and sells routes directly to the engine.</span>
            </li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-neutral-300 font-sans selection:bg-white/30 relative flex">
      <Starfield />

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#1a1824] h-screen sticky top-0 flex-col pt-8 pb-8 z-20 hidden md:flex shrink-0 overflow-y-auto bg-transparent relative">
        <div className="px-6">
            <Link to="/" className="flex items-center text-sm font-mono text-neutral-400 hover:text-white transition-colors mb-12">
            <ArrowLeft className="w-4 h-4 mr-2 text-neutral-500" /> Back to home
            </Link>
            
            <div className="text-[10px] font-mono tracking-widest text-[#5a5864] mb-4 uppercase">Docs</div>
        </div>
        <nav className="flex flex-col">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setActiveSection(section.id)}
              className={`text-left px-6 py-3 text-sm transition-colors ${
                activeSection === section.id
                  ? "bg-white/10 text-white border-l-4 border-white font-bold"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5 border-l-4 border-transparent"
              }`}
            >
              {section.title}
            </a>
          ))}
        </nav>
      </aside>

      {/* Mobile Header (visible only on small screens) */}
      <div className="md:hidden fixed top-0 w-full z-20 bg-[rgb(11,9,19)]/90 backdrop-blur-md border-b border-[#1a1824] p-4 flex justify-between items-center">
         <Link to="/" className="flex items-center text-sm font-mono text-neutral-400">
          <ArrowLeft className="w-4 h-4 mr-2" /> Home
        </Link>
        <span className="text-xs font-mono text-white/50 tracking-widest">DOCS</span>
      </div>

      {/* Main Content Pane */}
      <main className="flex-1 max-w-4xl px-8 md:px-20 py-24 md:py-24 z-20 relative">
        <div className="space-y-4 mb-20">
          <div className="text-white/50 text-[11px] font-bold font-mono tracking-widest uppercase">Documentation</div>
          <h1 className="text-4xl md:text-[3.5rem] font-black text-white tracking-tight leading-[1.1] pt-2">How SPACEDROP works.</h1>
          <div className="w-16 h-1 bg-white mt-8 mb-4"></div>
        </div>

        <div className="space-y-24">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-12">
              <h2 className="text-2xl md:text-[2rem] font-bold text-white mb-8 tracking-tight font-sans">{section.title}</h2>
              <div className="h-px w-full bg-[#1a1824] mb-8"></div>
              {section.content}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
