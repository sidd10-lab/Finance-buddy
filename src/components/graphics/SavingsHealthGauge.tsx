import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';

interface SavingsHealthGaugeProps {
  score?: number; // 0 to 100
  lang?: string;
  totalIncome: number;
  totalExpense: number;
}

export const SavingsHealthGauge: React.FC<SavingsHealthGaugeProps> = ({
  score = 78,
  lang = 'hi',
  totalIncome,
  totalExpense
}) => {
  // Arc calculation for semi-circle gauge (radius = 70)
  const radius = 70;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1827]/95 via-[#0a121e]/90 to-slate-950 p-5 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            {lang === 'en' ? 'Financial Health Index' : 'सखी वित्तीय स्वास्थ्य स्कोर'}
          </h4>
        </div>
        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
          {score >= 70 ? (lang === 'en' ? 'Excellent' : 'उत्कृष्ट') : (lang === 'en' ? 'Good' : 'संतोषजनक')}
        </span>
      </div>

      {/* SVG Semi-Circle Gauge */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg viewBox="0 0 180 105" className="w-44 h-28 overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 20 95 A 70 70 0 0 1 160 95"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <path
            d="M 20 95 A 70 70 0 0 1 160 95"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter="url(#gaugeGlow)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-3xl font-black text-white font-mono tracking-tight drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">
            {score}
            <span className="text-sm text-slate-400 font-normal">/100</span>
          </span>
          <span className="text-[10px] text-emerald-300 font-semibold tracking-wide">
            {lang === 'en' ? 'High Savings Ratio' : 'मजबूत बचत अनुपात'}
          </span>
        </div>
      </div>

      {/* Micro-metrics pills */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.08] text-center">
        <div className="p-2 bg-white/[0.03] rounded-xl border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 block">{lang === 'en' ? 'Savings Rate' : 'बचत दर'}</span>
          <span className="text-xs font-bold text-emerald-400 font-mono">
            {totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%
          </span>
        </div>
        <div className="p-2 bg-white/[0.03] rounded-xl border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 block">{lang === 'en' ? 'Debt Risk' : 'ऋण जोखिम'}</span>
          <span className="text-xs font-bold text-emerald-300 font-mono">0% (सुरक्षित)</span>
        </div>
      </div>
    </div>
  );
};
