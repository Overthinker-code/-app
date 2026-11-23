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
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getUserLevel } from '../data/mockData';

export const ProfilePage: React.FC = () => {
  const { user, orders, setActiveTab, navigate, setShowScanner, setShowQrModal, resetLocalData } = useApp();
  const level = getUserLevel(user.points);
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const maskedPhone = user.phone.length === 11
    ? `${user.phone.slice(0, 3)}****${user.phone.slice(7)}`
    : user.phone;

  const menuGroups = [
    [
      { icon: ScanLine, label: '扫一扫', right: '开箱投递', onClick: () => setShowScanner(true) },
      { icon: QrCode, label: '交投二维码', right: '实名码', onClick: () => setShowQrModal(true) },
      { icon: Gift, label: '积分兑换', right: `${user.points} 分`, onClick: () => navigate({ name: 'points_mall' }) },
    ],
    [
      { icon: UserCog, label: '个人资料', right: '', onClick: () => navigate({ name: 'profile_info' }) },
      { icon: ClipboardList, label: '全部订单', right: `${orders.length} 笔`, onClick: () => setActiveTab('orders') },
      { icon: MapPin, label: '地址管理', right: user.community, onClick: () => navigate({ name: 'address_list' }) },
    ],
    [
      { icon: BookOpen, label: '分类查询与说明', right: '', onClick: () => navigate({ name: 'usage_guide' }) },
      { icon: FileText, label: '用户协议与隐私', right: '', onClick: () => navigate({ name: 'user_agreement' }) },
    ],
  ];

  return (
    <div className="min-h-full bg-[#F4F4F1] pb-8">
      {/* Scenic Nanjing Xuanwu Lake + Zifeng Tower Atmospheric Profile Header */}
      <div className="relative h-[168px] overflow-hidden">
        <img
          src="/images/nj-hero-zifeng.jpg"
          alt="玄武湖与紫峰大厦"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-[#F4F4F1]" />

        <div className="absolute inset-x-4 top-6 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate({ name: 'profile_info' })}
            className="flex items-center gap-3 text-left min-w-0"
          >
            <div className="w-13 h-13 rounded-full bg-white/95 text-[#1D6F5A] text-[18px] font-bold flex items-center justify-center shrink-0 shadow-sm">
              {user.nickname.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-bold text-white drop-shadow-xs truncate">
                  {user.nickname}
                </h2>
                <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded bg-white/90 text-[#1D6F5A]">
                  {level.level}
                </span>
              </div>
              <p className="text-[12px] text-white/90 mt-0.5 tabular-nums drop-shadow-xs">
                {maskedPhone} · {user.district} {user.community}
              </p>
            </div>
          </button>
          <ChevronRight className="w-4 h-4 text-white/85 shrink-0" />
        </div>
      </div>

      {/* Overlapping Compact Stats Card */}
      <div className="px-3.5 -mt-12 relative z-10 space-y-3">
        <div className="bg-white rounded-xl border border-[#E6E6E1] p-3.5 shadow-xs">
          <div className="grid grid-cols-3 divide-x divide-[#F0F0EC]">
            <button onClick={() => navigate({ name: 'points_mall' })} className="text-center">
              <div className="text-[17px] font-bold text-zinc-900 tabular-nums">{user.points}</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">可用积分</div>
            </button>
            <div className="text-center">
              <div className="text-[17px] font-bold text-[#1D6F5A] tabular-nums">
                ¥{user.totalCashEarned.toFixed(1)}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">累计收益</div>
            </div>
            <div className="text-center">
              <div className="text-[17px] font-bold text-zinc-900 tabular-nums">
                {completedCount} 次
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">已完成</div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#F0F0EC] flex items-center gap-3">
            <span className="text-[11px] font-medium text-zinc-500 shrink-0">{level.name}</span>
            <div className="flex-1 h-1.5 rounded-full bg-[#ECECE8] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1D6F5A]"
                style={{ width: `${Math.max(8, level.progress)}%` }}
              />
            </div>
            <span className="text-[11px] text-zinc-500 tabular-nums shrink-0">
              {user.points}/{level.nextPoints}
            </span>
          </div>
        </div>

        {/* Clean Single-Line Grouped List (Cut redundant subtitles!) */}
        {menuGroups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="bg-white rounded-xl border border-[#E6E6E1] overflow-hidden divide-y divide-[#F0F0EC]"
          >
            {group.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full px-3.5 py-3 flex items-center justify-between gap-3 active:bg-zinc-50 transition text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-[18px] h-[18px] text-zinc-600 shrink-0" />
                    <span className="text-[14px] font-medium text-zinc-900">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.right && <span className="text-[12px] text-zinc-400 tabular-nums">{item.right}</span>}
                    <ChevronRight className="w-4 h-4 text-zinc-300" />
                  </div>
                </button>
              );
            })}
          </div>
        ))}

        <button
          onClick={resetLocalData}
          className="w-full py-2.5 rounded-xl bg-white border border-[#E6E6E1] text-[12px] font-medium text-zinc-400 flex items-center justify-center gap-1.5 active:bg-zinc-50 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>恢复初始数据</span>
        </button>
      </div>
    </div>
  );
};
