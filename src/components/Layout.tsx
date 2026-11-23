import React from 'react';
import { ChevronLeft, Home, ClipboardList, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { TabId } from '../types';

export const SubPageHeader: React.FC<{
  title: string;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}> = ({ title, rightAction, transparent = false }) => {
  const { goBack } = useApp();
  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between h-13 px-3 transition-colors ${
        transparent
          ? 'bg-transparent text-slate-900'
          : 'bg-white/90 backdrop-blur-md border-b border-emerald-950/5 text-slate-900'
      }`}
    >
      <button
        onClick={goBack}
        aria-label="返回"
        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 active:scale-95 transition"
      >
        <ChevronLeft className="w-5 h-5 text-slate-800" />
      </button>
      <h1 className="text-[16px] font-semibold tracking-tight text-slate-900 truncate max-w-[65%]">
        {title}
      </h1>
      <div className="min-w-9 flex items-center justify-end">{rightAction}</div>
    </header>
  );
};

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, orders } = useApp();
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'assigned' || o.status === 'in_progress'
  ).length;

  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'orders', label: '订单', icon: ClipboardList },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-lg border-t border-slate-200/70 px-4 pt-2 pb-[max(0.55rem,var(--safe-bottom))]">
      <div className="grid grid-cols-3 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-0.5 rounded-xl transition-all active:scale-95 ${
                active ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-[22px] h-[22px] ${active ? 'stroke-[2.4]' : 'stroke-[1.9]'}`} />
                {tab.id === 'orders' && activeOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums shadow-sm">
                    {activeOrdersCount}
                  </span>
                )}
              </div>
              <span className={`text-[11px] ${active ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const ToastBanner: React.FC = () => {
  const { toast } = useApp();
  if (!toast) return null;
  const styles =
    toast.type === 'warning'
      ? 'bg-amber-600 text-white'
      : toast.type === 'info'
      ? 'bg-slate-800 text-white'
      : 'bg-emerald-600 text-white';
  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 w-[88%] max-w-[350px] pointer-events-none">
      <div
        className={`${styles} px-4 py-2.5 rounded-2xl shadow-lg text-[13px] font-medium text-center animate-slide-up`}
      >
        {toast.text}
      </div>
    </div>
  );
};
