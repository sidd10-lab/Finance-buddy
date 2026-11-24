import React from 'react';
import { Wifi, CheckCircle2 } from 'lucide-react';

interface RuPayCardGraphicProps {
  cardHolderName: string;
  accountNumberMasked?: string;
  balance: number;
  lang?: string;
}

export const RuPayCardGraphic: React.FC<RuPayCardGraphicProps> = ({
  cardHolderName,
  accountNumberMasked = '6048 •••• •••• 3921',
  balance,
  lang = 'hi'
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-tr from-[#051829] via-[#092842] to-[#043328] border border-emerald-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.15)] holographic-shine group transition-all duration-500 hover:scale-[1.01]">
      {/* Background Holographic Geometric Patterns */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cardGrid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cardGrid)" />
          <circle cx="85%" cy="30%" r="140" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
          <circle cx="85%" cy="30%" r="100" fill="none" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px]">
        {/* Top Card Row */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-widest text-emerald-300 uppercase bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30">
                PMJDY RURAL PLATINUM
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                <CheckCircle2 className="w-2.5 h-2.5" />
                DBT LINKED
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-extrabold tracking-tight text-white drop-shadow-md">
              Bank of Maharashtra
            </h4>
          </div>

          {/* Contactless Wifi Pay Icon */}
          <div className="flex items-center gap-2">
            <Wifi className="w-6 h-6 text-white/80 rotate-90" />
          </div>
        </div>

        {/* Middle Row: EMV Chip + Hologram */}
        <div className="my-4 flex items-center justify-between">
          {/* Authentic EMV Chip SVG */}
          <div className="relative w-12 h-9 rounded-md bg-gradient-to-tr from-[#d4af37] via-[#f7e39a] to-[#c59a27] border border-[#a67c1e] shadow-md overflow-hidden p-1">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_transparent_40%,_black_100%)]" />
            <div className="w-full h-full border border-[#8a6314]/60 rounded-xs flex flex-col justify-around">
              <div className="border-b border-[#8a6314]/60 h-1/3" />
              <div className="border-b border-[#8a6314]/60 h-1/3" />
            </div>
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#8a6314]/80 -translate-y-1/2" />
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#8a6314]/80 -translate-x-1/2" />
          </div>

          {/* Balance display on card */}
          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase">
              {lang === 'en' ? 'Available Balance' : 'उपलब्ध बचत खाता शेष'}
            </span>
            <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              ₹{balance.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Bottom Row: Card Number, Name & RuPay Logo */}
        <div>
          {/* Embossed Card Number */}
          <div className="font-mono text-base sm:text-lg font-bold tracking-[0.2em] text-slate-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-3">
            {accountNumberMasked}
          </div>

          <div className="flex items-end justify-between">
            <div>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">
                CARD HOLDER
              </span>
              <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase drop-shadow">
                {cardHolderName}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase block">
                  EXPIRES
                </span>
                <span className="font-mono text-xs font-bold text-slate-200">
                  12/31
                </span>
              </div>

              {/* RuPay Logo Badge */}
              <div className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center gap-1 shadow-inner">
                <span className="font-black text-sm italic tracking-tighter text-white">
                  Ru<span className="text-orange-400">P</span><span className="text-emerald-400">ay</span>
                </span>
                <span className="text-[9px] font-extrabold text-amber-300 ml-0.5">🇮🇳</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
