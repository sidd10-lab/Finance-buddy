import React, { useState } from 'react';
import { PieChart as PieIcon } from 'lucide-react';
import { ExpenseItem } from '../../types';

interface ExpenseDonutChartProps {
  expenses: ExpenseItem[];
  lang?: string;
}

export const ExpenseDonutChart: React.FC<ExpenseDonutChartProps> = ({
  expenses,
  lang = 'hi'
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Group expenses by category
  const expenseList = expenses.filter(e => e.type === 'expense');
  const total = expenseList.reduce((acc, curr) => acc + curr.amount, 0) || 1;

  const categoryMap: Record<string, { label: string; amount: number; color: string; icon: string }> = {
    grocery: { label: lang === 'en' ? 'Ration & Kitchen' : 'राशन व घरेलू', amount: 0, color: '#f59e0b', icon: '🌾' },
    health: { label: lang === 'en' ? 'Health & Medicine' : 'दवा व स्वास्थ्य', amount: 0, color: '#f43f5e', icon: '💊' },
    dairy: { label: lang === 'en' ? 'Cattle Feed' : 'पशु चारा व पोषण', amount: 0, color: '#10b981', icon: '🐄' },
    other: { label: lang === 'en' ? 'Household Essentials' : 'अन्य जरूरतें', amount: 0, color: '#6366f1', icon: '🛒' }
  };

  expenseList.forEach(e => {
    if (categoryMap[e.category]) {
      categoryMap[e.category].amount += e.amount;
    } else {
      categoryMap.other.amount += e.amount;
    }
  });

  const slices = Object.entries(categoryMap).map(([key, item]) => ({
    key,
    ...item,
    percentage: Math.round((item.amount / total) * 100)
  })).filter(s => s.amount > 0);

  // Fallback slice if no expenses logged
  const activeSlices = slices.length > 0 ? slices : [
    { key: 'grocery', label: lang === 'en' ? 'Ration' : 'राशन खर्च', amount: 80, color: '#f59e0b', icon: '🌾', percentage: 53 },
    { key: 'health', label: lang === 'en' ? 'Medicine' : 'दवा खर्च', amount: 150, color: '#f43f5e', icon: '💊', percentage: 47 }
  ];

  // Calculate SVG donut stroke offsets
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1626]/95 via-[#09111e]/90 to-slate-950 p-5 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            {lang === 'en' ? 'Expense Distribution' : 'खर्च का वर्गवार वितरण'}
          </h4>
        </div>
        <span className="text-[10px] font-bold text-slate-400 bg-white/[0.06] px-2 py-0.5 rounded-full border border-white/10">
          {lang === 'en' ? 'AI Categorized' : 'AI वर्गीकृत'}
        </span>
      </div>

      {/* SVG Donut Chart with Centered Readout */}
      <div className="flex items-center justify-center my-3">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg viewBox="0 0 110 110" className="w-full h-full -rotate-90">
            {activeSlices.map((slice) => {
              const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += slice.percentage;

              const isHovered = activeCategory === slice.key;

              return (
                <circle
                  key={slice.key}
                  cx="55"
                  cy="55"
                  r={radius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={isHovered ? "14" : "10"}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setActiveCategory(slice.key)}
                  onMouseLeave={() => setActiveCategory(null)}
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-medium text-slate-400 uppercase">
              {lang === 'en' ? 'Total' : 'कुल व्यय'}
            </span>
            <span className="text-lg font-black text-white font-mono tracking-tight">
              ₹{total > 1 ? total : 230}
            </span>
          </div>
        </div>
      </div>

      {/* Legend Chips */}
      <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
        {activeSlices.slice(0, 3).map((slice) => (
          <div
            key={slice.key}
            onMouseEnter={() => setActiveCategory(slice.key)}
            onMouseLeave={() => setActiveCategory(null)}
            className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeCategory === slice.key ? 'bg-white/[0.08] shadow-sm' : 'hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
              <span className="text-slate-200 text-[11px] font-medium flex items-center gap-1">
                <span>{slice.icon}</span>
                <span>{slice.label}</span>
              </span>
            </div>
            <span className="font-mono text-[11px] font-bold text-slate-300">
              {slice.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
