import React from 'react';
import {
  ScanLine,
  QrCode,
  UserCog,
  ClipboardList,
  MapPin,
  BookOpen,
  FileText,
  ChevronRight,
  Gift,
  Leaf,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getUserLevel } from '../data/mockData';

export const ProfilePage: React.FC = () => {
  const { user, orders, setActiveTab, navigate, setShowScanner, setShowQrModal } = useApp();
  const level = getUserLevel(user.points);
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  const menuItems = [
    {
      icon: ScanLine,
      label: '扫一扫',
      sub: '扫描智能回收机开箱投递',
      color: 'text-emerald-600 bg-emerald-50',
      onClick: () => setShowScanner(true),
    },
    {
      icon: QrCode,
      label: '交投二维码',
      sub: '出示居民专属动态身份码',
      color: 'text-sky-600 bg-sky-50',
      onClick: () => setShowQrModal(true),
    },
    {
      icon: UserCog,
      label: '完善信息',
      sub: '昵称、性别、生日与手机号',
      color: 'text-indigo-600 bg-indigo-50',
      onClick: () => navigate({ name: 'profile_info' }),
    },
    {
      icon: ClipboardList,
      label: '全部订单',
      sub: `共 ${orders.length} 笔回收与清运记录`,
      color: 'text-teal-600 bg-teal-50',
      onClick: () => setActiveTab('orders'),
    },
    {
      icon: MapPin,
      label: '地址管理',
      sub: '管理常用回收与清运地址',
      color: 'text-orange-600 bg-orange-50',
      onClick: () => navigate({ name: 'address_list' }),
    },
    {
      icon: BookOpen,
      label: '使用说明与分类查询',
      sub: '全流程指南 + 垃圾分类速查',
      color: 'text-amber-600 bg-amber-50',
      onClick: () => navigate({ name: 'usage_guide' }),
    },
    {
      icon: FileText,
      label: '用户协议',
      sub: '用户服务须知与隐私保护政策',
      color: 'text-slate-600 bg-slate-100',
      onClick: () => navigate({ name: 'user_agreement' }),
    },
  ];

  return (
    <div className="min-h-full bg-[#F4F8F6] pb-8">
      {/* Top Eco Gradient Profile Header */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 pt-8 pb-16 px-5 text-white relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 bottom-0 w-36 h-36 rounded-full bg-emerald-200/20 blur-xl" />

        <div className="relative z-10 flex items-center gap-4">
          <button
            onClick={() => navigate({ name: 'profile_info' })}
            className="relative shrink-0"
          >
            <img
              src="/images/eco-avatar.jpg"
              alt="头像"
              className="w-16 h-16 rounded-full object-cover ring-4 ring-white/40 shadow-lg bg-white"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow text-[10px] font-bold">
              ✓
            </span>
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="text-[18px] font-extrabold truncate">{user.nickname}</h2>
            <p className="text-[12px] text-emerald-50/90 mt-0.5">
              {user.community} · 累计完成 {completedCount} 次绿色交投
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-11 relative z-10 space-y-3.5">
        {/* V1-V4 Level Card */}
        <div className="bg-white rounded-3xl p-4 shadow-[0_8px_24px_-8px_rgba(6,95,70,0.12)] border border-emerald-950/5">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black italic bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {level.level}
              </span>
              <span className="text-[16px] font-bold text-slate-900">{level.name}</span>
            </div>
            <button
              onClick={() => navigate({ name: 'points_mall' })}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-semibold shadow-sm active:scale-95 transition"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>积分商城</span>
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-slate-500">当前环保积分</span>
              <span className="font-bold text-emerald-700 tabular-nums">
                {user.points} / {level.nextPoints}
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${Math.max(8, level.progress)}%` }}
              />
            </div>
          </div>

          {/* Carbon Ledger Strip */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
            <div className="rounded-xl bg-emerald-50/70 p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-700 font-extrabold text-[15px] tabular-nums">
                <Leaf className="w-3.5 h-3.5" />
                {user.carbonSavedKg.toFixed(1)}kg
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">碳减排成就</div>
            </div>
            <div className="rounded-xl bg-sky-50/70 p-2.5 text-center">
              <div className="text-sky-700 font-extrabold text-[15px] tabular-nums">
                ¥{user.totalCashEarned.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">累计返现收益</div>
            </div>
            <div className="rounded-xl bg-amber-50/70 p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-700 font-extrabold text-[15px] tabular-nums">
                <Award className="w-3.5 h-3.5" />
                {Math.max(1, Math.round(user.carbonSavedKg / 18))}棵
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">等效植树量</div>
            </div>
          </div>
        </div>

        {/* 7 Menu Items Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-950/5 divide-y divide-slate-100">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full px-4 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 active:bg-slate-100/60 transition text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-slate-900">{item.label}</div>
                    <div className="text-[11px] text-slate-400 truncate">{item.sub}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
