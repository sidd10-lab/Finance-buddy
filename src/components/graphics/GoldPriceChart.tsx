import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, Activity } from 'lucide-react';

interface GoldPriceChartProps {
  currentPrice?: number;
  lang?: string;
}

export const GoldPriceChart: React.FC<GoldPriceChartProps> = ({
  currentPrice = 7450,
  lang = 'hi'
}) => {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  // 7-day realistic gold trend data (₹ per gram)
  const data = [
    { day: '18 Nov', price: 7180 },
    { day: '19 Nov', price: 7240 },
    { day: '20 Nov', price: 7210 },
    { day: '21 Nov', price: 7320 },
    { day: '22 Nov', price: 7390 },
    { day: '23 Nov', price: 7410 },
    { day: '24 Nov (Live)', price: currentPrice }
  ];

  const minPrice = 7100;
  const maxPrice = 7550;
  const height = 140;
  const width = 360;

  // Compute SVG coordinates
  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * (width - 40) + 20;
    const y = height - ((d.price - minPrice) / (maxPrice - minPrice)) * (height - 30) - 15;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (p.x - prev.x) / 2;
    const cpY2 = p.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1b1408]/90 via-[#130f06]/95 to-slate-950 p-4 border border-amber-500/30 shadow-[0_8px_30px_rgba(245,158,11,0.12)]">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1 font-mono">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            24K 99.9% MCX LIVE TICKER
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-400/30">
          <TrendingUp className="w-3 h-3" />
          <span>+14.2% YoY</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-3">
        <div>
          <span className="text-2xl font-black text-amber-200 font-mono tracking-tight drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 font-medium ml-1">/ {lang === 'en' ? 'gram' : 'ग्राम'}</span>
        </div>
        <span className="text-[11px] text-amber-400/90 font-medium bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
          {lang === 'en' ? 'Instant Buyback Ready' : 'तत्काल बैंक वापसी गारंटी'}
        </span>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Lines */}
          <line x1="20" y1="35" x2={width - 20} y2="35" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1="20" y1="75" x2={width - 20} y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1="20" y1="115" x2={width - 20} y2="115" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

          {/* Area fill */}
          <path d={areaD} fill="url(#goldGradient)" />

          {/* Gold Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#goldLine)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#goldGlow)"
          />

          {/* Data Points */}
          {points.map((p, i) => {
            const isLast = i === points.length - 1;
            const isHovered = activePoint === i;
            return (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setActivePoint(i)} onMouseLeave={() => setActivePoint(null)}>
                {isLast && (
                  <circle cx={p.x} cy={p.y} r="8" fill="#f59e0b" opacity="0.3" className="animate-ping" />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? "6" : isLast ? "5" : "3.5"}
                  fill={isLast ? "#fef08a" : "#f59e0b"}
                  stroke="#1c1408"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover / Live Tooltip */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>7 {lang === 'en' ? 'Days Ago: ₹7,180' : 'दिन पूर्व: ₹7,180'}</span>
          <span className="text-amber-300 font-bold">
            {activePoint !== null
              ? `${data[activePoint].day}: ₹${data[activePoint].price}`
              : `${lang === 'en' ? 'Today: ' : 'आज: '} ₹${currentPrice}`}
          </span>
          <span>+₹270 {lang === 'en' ? 'Gained' : 'मुनाफा'}</span>
        </div>
      </div>
    </div>
  );
};
