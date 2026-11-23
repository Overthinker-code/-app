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
      {
        icon: ScanLine,
        label: '扫一扫',
        sub: '扫描社区回收柜开箱',
        onClick: () => setShowScanner(true),
      },
      {
        icon: QrCode,
        label: '交投二维码',
        sub: '居民实名动态身份码',
        onClick: () => setShowQrModal(true),
      },
      {
        icon: Gift,
        label: '积分兑换',
        sub: '金陵通出行金、分类袋、清运券',
        onClick: () => navigate({ name: 'points_mall' }),
      },
    ],
    [
      {
        icon: UserCog,
        label: '完善信息',
        sub: '昵称、手机号、生日设置',
        onClick: () => navigate({ name: 'profile_info' }),
      },
      {
        icon: ClipboardList,
        label: '全部订单',
        sub: `共 ${orders.length} 条回收与清运记录`,
        onClick: () => setActiveTab('orders'),
      },
      {
        icon: MapPin,
        label: '地址管理',
        sub: '管理南京常用回收与清运地址',
        onClick: () => navigate({ name: 'address_list' }),
      },
    ],
    [
      {
        icon: BookOpen,
        label: '使用说明与分类查询',
        sub: '南京四分类查询及小测验',
        onClick: () => navigate({ name: 'usage_guide' }),
      },
      {
        icon: FileText,
        label: '用户协议与隐私政策',
        sub: '服务条款与本地隐私说明',
        onClick: () => navigate({ name: 'user_agreement' }),
      },
    ],
  ];

  return (
    <div className="min-h-full bg-[#F4F4F1] pb-8">
      {/* Clean Solid Header */}
      <div className="bg-white border-b border-[#E6E6E1] px-4 pt-5 pb-4">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate({ name: 'profile_info' })}
            className="flex items-center gap-3 text-left min-w-0"
          >
            <div className="w-13 h-13 rounded-full bg-[#EDF5F2] border border-[#CDE4DC] text-[#1D6F5A] text-[18px] font-bold flex items-center justify-center shrink-0">
              {user.nickname.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-bold text-zinc-900 truncate">{user.nickname}</h2>
                <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded bg-[#EDF5F2] text-[#1D6F5A]">
                  {level.level} {level.name}
                </span>
              </div>
              <p className="text-[12px] text-zinc-500 mt-0.5 tabular-nums">
                {maskedPhone} · 南京市{user.district} {user.community}
              </p>
            </div>
          </button>
          <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
        </div>

        {/* Progress + Numbers */}
        <div className="mt-4 pt-3.5 border-t border-[#F0F0EC]">
          <div className="flex items-center justify-between text-[11.5px] mb-1.5">
            <span className="text-zinc-500">当前积分成长值</span>
            <span className="font-semibold text-zinc-800 tabular-nums">
              {user.points} / {level.nextPoints}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#ECECE8] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#1D6F5A] transition-all duration-300"
              style={{ width: `${Math.max(6, level.progress)}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3.5">
            <div className="rounded-lg bg-[#FAFAF8] border border-[#ECECE8] p-2.5 text-center">
              <div className="text-[15px] font-bold text-[#1D6F5A] tabular-nums">
                ¥{user.totalCashEarned.toFixed(2)}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">累计回收收益</div>
            </div>
            <div className="rounded-lg bg-[#FAFAF8] border border-[#ECECE8] p-2.5 text-center">
              <div className="text-[15px] font-bold text-zinc-900 tabular-nums">
                {user.carbonSavedKg.toFixed(1)}kg
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">累计减碳量</div>
            </div>
            <div className="rounded-lg bg-[#FAFAF8] border border-[#ECECE8] p-2.5 text-center">
              <div className="text-[15px] font-bold text-zinc-900 tabular-nums">
                {completedCount} 次
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">已归档交投</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Native-Style Lists */}
      <div className="p-3.5 space-y-3">
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
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-[18px] h-[18px] text-zinc-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[14px] font-medium text-zinc-900">{item.label}</div>
                      <div className="text-[11px] text-zinc-400 truncate">{item.sub}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0" />
                </button>
              );
            })}
          </div>
        ))}

        <button
          onClick={resetLocalData}
          className="w-full py-2.5 rounded-xl bg-white border border-[#E6E6E1] text-[12.5px] font-medium text-zinc-500 flex items-center justify-center gap-1.5 active:bg-zinc-50 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>恢复默认演示数据</span>
        </button>
      </div>
    </div>
  );
};
