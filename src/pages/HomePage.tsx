import React, { useState } from 'react';
import {
  MapPin,
  ScanLine,
  QrCode,
  ChevronRight,
  ChevronDown,
  Search,
  Recycle,
  Sofa,
  HardHat,
  Tv,
  Building2,
  ClipboardCheck,
  Navigation,
  Store,
  CalendarClock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DAILY_MARKET_PRICES } from '../data/mockData';
import { ItemIcon, NanjingSkylineBanner, NingLogoMark } from '../components/NanjingVisuals';
import { CommunityPickerModal } from '../components/Modals';

export const HomePage: React.FC = () => {
  const { user, navigate, setShowScanner, setShowQrModal, setShowAppliancePicker } = useApp();
  const [communityOpen, setCommunityOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ name: 'usage_guide', initialQuery: quickQuery.trim() });
  };

  return (
    <div className="min-h-full bg-[#F4F4F1] pb-6">
      {/* Nanjing Editorial Header */}
      <div className="relative h-[142px] overflow-hidden border-b border-[#E2E6E2]">
        <NanjingSkylineBanner className="w-full h-full" />

        <div className="absolute inset-0 px-4 pt-4 pb-3 flex flex-col justify-between">
          {/* Top Brand & Utility Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <NingLogoMark className="w-8 h-8" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[17px] font-bold tracking-tight text-zinc-900">
                    宁回收
                  </span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/85 border border-[#D4DFDA] text-[#1D6F5A]">
                    南京
                  </span>
                </div>
                <p className="text-[10.5px] text-zinc-500 -mt-0.5">南京生活回收与清运服务</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowQrModal(true)}
                aria-label="交投码"
                className="h-8 px-2.5 rounded-lg bg-white/90 border border-[#DCE3DF] text-zinc-700 text-[12px] font-medium flex items-center gap-1 active:bg-zinc-100 transition"
              >
                <QrCode className="w-3.5 h-3.5 text-[#1D6F5A]" />
                <span>交投码</span>
              </button>
              <button
                onClick={() => setShowScanner(true)}
                aria-label="扫一扫"
                className="h-8 px-2.5 rounded-lg bg-[#1D6F5A] text-white text-[12px] font-medium flex items-center gap-1 active:bg-[#175C4A] transition"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>扫一扫</span>
              </button>
            </div>
          </div>

          {/* Location Selector */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCommunityOpen(true)}
              className="inline-flex items-center gap-1 bg-white/92 border border-[#DCE3DF] rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium text-zinc-800 active:bg-zinc-50 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-[#1D6F5A] shrink-0" />
              <span>{user.district} · {user.community}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>
            <button
              onClick={() => navigate({ name: 'nearby_stations', stationType: 'smart_machine' })}
              className="text-[11.5px] font-medium text-[#1D6F5A] bg-white/85 px-2.5 py-1.5 rounded-lg border border-[#DCE3DF]"
            >
              最近回收柜 160m
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3.5 pt-3 space-y-3">
        {/* Inline Waste Classification Search */}
        <form onSubmit={handleQuickSearch} className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="查南京分类：小龙虾壳、鸭骨、旧床垫、电池..."
            className="w-full h-10 pl-9 pr-16 rounded-xl bg-white border border-[#E6E6E1] text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#1D6F5A]"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#F4F4F1] text-[11.5px] font-medium text-zinc-700 hover:bg-zinc-200/70 transition"
          >
            查分类
          </button>
        </form>

        {/* Primary Service Hero Card: 可回收物交投 */}
        <div className="bg-white rounded-xl border border-[#E6E6E1] overflow-hidden">
          <button
            onClick={() => navigate({ name: 'recyclables_hub' })}
            className="w-full p-4 text-left flex items-center justify-between gap-3 active:bg-zinc-50/80 transition"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#EDF5F2] text-[#1D6F5A] flex items-center justify-center shrink-0">
                <Recycle className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-bold text-zinc-900">可回收物交投</h2>
                  <span className="text-[10.5px] font-medium px-1.5 py-0.5 rounded bg-[#EDF5F2] text-[#1D6F5A]">
                    即时结算
                  </span>
                </div>
                <p className="text-[12px] text-zinc-500 mt-0.5 truncate">
                  纸箱、塑料瓶、金属、旧衣 · 扫码投递或上门收
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
          </button>

          {/* 3 Direct Channel Shortcuts */}
          <div className="grid grid-cols-3 border-t border-[#F0F0EC] divide-x divide-[#F0F0EC] bg-[#FAFAF8]">
            <button
              onClick={() => navigate({ name: 'nearby_stations', stationType: 'smart_machine' })}
              className="py-2.5 px-2 flex items-center justify-center gap-1.5 text-[12px] font-medium text-zinc-700 hover:text-[#1D6F5A] active:bg-zinc-100 transition"
            >
              <Navigation className="w-3.5 h-3.5 text-[#1D6F5A]" />
              <span>附近回收柜</span>
            </button>
            <button
              onClick={() => navigate({ name: 'nearby_stations', stationType: 'fixed_station' })}
              className="py-2.5 px-2 flex items-center justify-center gap-1.5 text-[12px] font-medium text-zinc-700 hover:text-[#1D6F5A] active:bg-zinc-100 transition"
            >
              <Store className="w-3.5 h-3.5 text-[#1D6F5A]" />
              <span>固定交投点</span>
            </button>
            <button
              onClick={() => navigate({ name: 'recyclables_booking' })}
              className="py-2.5 px-2 flex items-center justify-center gap-1.5 text-[12px] font-medium text-zinc-700 hover:text-[#1D6F5A] active:bg-zinc-100 transition"
            >
              <CalendarClock className="w-3.5 h-3.5 text-[#1D6F5A]" />
              <span>预约上门</span>
            </button>
          </div>
        </div>

        {/* 3-Card Asymmetric Utility Grid: 大件 / 装修 / 家电 */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => navigate({ name: 'bulky_booking' })}
            className="bg-white rounded-xl border border-[#E6E6E1] p-3 text-left flex flex-col justify-between min-h-[116px] active:bg-zinc-50 transition"
          >
            <div className="w-9 h-9 rounded-lg bg-[#FDF4EC] text-[#B45309] flex items-center justify-center">
              <Sofa className="w-5 h-5" />
            </div>
            <div className="mt-2.5">
              <div className="text-[13.5px] font-bold text-zinc-900">大件清运</div>
              <div className="text-[11px] text-zinc-500 mt-0.5 leading-tight">沙发床垫衣柜</div>
              <div className="text-[11px] font-semibold text-[#B45309] mt-1 tabular-nums">¥40 起</div>
            </div>
          </button>

          <button
            onClick={() => navigate({ name: 'renovation_hub' })}
            className="bg-white rounded-xl border border-[#E6E6E1] p-3 text-left flex flex-col justify-between min-h-[116px] active:bg-zinc-50 transition"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F1F3F5] text-[#475569] flex items-center justify-center">
              <HardHat className="w-5 h-5" />
            </div>
            <div className="mt-2.5">
              <div className="text-[13.5px] font-bold text-zinc-900">装修垃圾</div>
              <div className="text-[11px] text-zinc-500 mt-0.5 leading-tight">规范电子联单</div>
              <div className="text-[11px] font-semibold text-zinc-700 mt-1 tabular-nums">¥7.5/袋起</div>
            </div>
          </button>

          <button
            onClick={() => setShowAppliancePicker(true)}
            className="bg-white rounded-xl border border-[#E6E6E1] p-3 text-left flex flex-col justify-between min-h-[116px] active:bg-zinc-50 transition"
          >
            <div className="w-9 h-9 rounded-lg bg-[#EDF6F6] text-[#0F766E] flex items-center justify-center">
              <Tv className="w-5 h-5" />
            </div>
            <div className="mt-2.5">
              <div className="text-[13.5px] font-bold text-zinc-900">家电回收</div>
              <div className="text-[11px] text-zinc-500 mt-0.5 leading-tight">免费拆机估价</div>
              <div className="text-[11px] font-semibold text-[#0F766E] mt-1">以旧换新</div>
            </div>
          </button>
        </div>

        {/* Account Compact Strip */}
        <div className="bg-white rounded-xl border border-[#E6E6E1] px-3.5 py-3 flex items-center justify-between">
          <div className="grid grid-cols-3 gap-4 flex-1">
            <div>
              <div className="text-[11px] text-zinc-500">可用积分</div>
              <div className="text-[16px] font-bold text-zinc-900 tabular-nums mt-0.5">
                {user.points}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-zinc-500">累计收益</div>
              <div className="text-[16px] font-bold text-[#1D6F5A] tabular-nums mt-0.5">
                ¥{user.totalCashEarned.toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-zinc-500">累计减碳</div>
              <div className="text-[16px] font-bold text-zinc-900 tabular-nums mt-0.5">
                {user.carbonSavedKg.toFixed(1)}
                <span className="text-[10.5px] font-normal text-zinc-500 ml-0.5">kg</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate({ name: 'points_mall' })}
            className="shrink-0 pl-3 border-l border-[#F0F0EC] text-[12px] font-semibold text-[#1D6F5A] flex items-center gap-0.5"
          >
            <span>兑换</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Today's Nanjing Reference Market Prices */}
        <div className="bg-white rounded-xl border border-[#E6E6E1] p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h3 className="text-[14px] font-bold text-zinc-900">南京今日废品参考价</h3>
              <p className="text-[11px] text-zinc-400">主城区交投点实时挂牌均价</p>
            </div>
            <button
              onClick={() => navigate({ name: 'recyclables_booking' })}
              className="text-[12px] font-medium text-[#1D6F5A] flex items-center"
            >
              <span>去预约</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {DAILY_MARKET_PRICES.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate({ name: 'recyclables_booking' })}
                className="rounded-lg bg-[#FAFAF8] border border-[#ECECE8] p-2.5 text-left hover:border-[#1D6F5A]/40 transition"
              >
                <div className="flex items-center justify-between">
                  <ItemIcon id={item.id} className="w-4 h-4 text-zinc-600" />
                  <span
                    className={`text-[10px] font-medium tabular-nums ${
                      item.trend.startsWith('+') ? 'text-[#1D6F5A]' : 'text-zinc-400'
                    }`}
                  >
                    {item.trend}
                  </span>
                </div>
                <div className="text-[12px] font-medium text-zinc-800 mt-1.5 truncate">
                  {item.shortName}
                </div>
                <div className="text-[13.5px] font-bold text-zinc-900 tabular-nums mt-0.5">
                  ¥{item.price.toFixed(item.price < 1 ? 2 : 1)}
                  <span className="text-[10px] font-normal text-zinc-400">/kg</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Local Civic Utilities */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => navigate({ name: 'renovation_units' })}
            className="bg-white rounded-xl border border-[#E6E6E1] p-3 text-left flex items-center gap-2.5 active:bg-zinc-50 transition"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-zinc-900 truncate">备案清运单位</div>
              <div className="text-[11px] text-zinc-500 truncate">城管资质与收费表</div>
            </div>
          </button>

          <button
            onClick={() => navigate({ name: 'usage_guide' })}
            className="bg-white rounded-xl border border-[#E6E6E1] p-3 text-left flex items-center gap-2.5 active:bg-zinc-50 transition"
          >
            <div className="w-9 h-9 rounded-lg bg-[#EDF5F2] text-[#1D6F5A] flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-zinc-900 truncate">南京分类自测</div>
              <div className="text-[11px] text-zinc-500 truncate">
                {user.quizClaimed ? '已通过 · 随时复查' : '5题速测领 20 积分'}
              </div>
            </div>
          </button>
        </div>

        {/* Subtle Civic Footer */}
        <div className="pt-2 pb-1 text-center text-[11px] text-zinc-400">
          依据《南京市生活垃圾管理条例》提供便民回收与清运指引
        </div>
      </div>

      <CommunityPickerModal open={communityOpen} onClose={() => setCommunityOpen(false)} />
    </div>
  );
};
