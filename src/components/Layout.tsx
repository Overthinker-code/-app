import React from 'react';
import { ChevronLeft, Home, ClipboardList, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { TabId } from '../types';

export const SubPageHeader: React.FC<{
  title: string;
  rightAction?: React.ReactNode;
}> = ({ title, rightAction }) => {
  const { goBack } = useApp();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-12 px-2.5 bg-white border-b border-[#E6E6E1] text-zinc-900">
      <button
        onClick={goBack}
        aria-label="返回"
        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-zinc-100 active:bg-zinc-200/70 transition"
      >
        <ChevronLeft className="w-5 h-5 text-zinc-800" />
      </button>
      <h1 className="text-[15px] font-semibold tracking-tight text-zinc-900 truncate max-w-[66%]">
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
    <nav className="sticky bottom-0 z-30 bg-white border-t border-[#E6E6E1] px-4 pt-1.5 pb-[max(0.5rem,var(--safe-bottom))]">
      <div className="grid grid-cols-3 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition ${
                active ? 'text-[#1D6F5A]' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-[21px] h-[21px] ${active ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
                {tab.id === 'orders' && activeOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-2.5 min-w-[15px] h-[15px] px-1 rounded-full bg-[#C81E1E] text-white text-[9.5px] font-semibold flex items-center justify-center tabular-nums">
                    {activeOrdersCount}
                  </span>
                )}
              </div>
              <span className={`text-[11px] ${active ? 'font-semibold' : 'font-normal'}`}>
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
      ? 'bg-amber-700 text-white'
      : toast.type === 'info'
      ? 'bg-zinc-800 text-white'
      : 'bg-[#18181B] text-white';
  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-[330px] pointer-events-none">
      <div
        className={`${styles} px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-medium text-center animate-slide-up whitespace-nowrap`}
      >
        {toast.text}
      </div>
    </div>
  );
};
