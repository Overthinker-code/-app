import React, { useState } from 'react';
import {
  MapPin,
  ScanLine,
  ChevronRight,
  ChevronsRight,
  Leaf,
  TrendingUp,
  Search,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DAILY_MARKET_PRICES, getUserLevel } from '../data/mockData';
import {
  AppliancesIllustration,
  RenovationIllustration,
  SmartKioskIllustration,
} from '../components/ServiceIllustrations';
import { CommunityPickerModal } from '../components/Modals';

export const HomePage: React.FC = () => {
  const { user, navigate, setShowScanner, setShowAppliancePicker } = useApp();
  const [communityOpen, setCommunityOpen] = useState(false);
  const level = getUserLevel(user.points);

  return (
    <div className="pb-6 bg-[#F4F8F6] min-h-full">
      {/* Hero Banner with Generated Beijing Temple of Heaven Art */}
      <div className="relative h-[228px] overflow-hidden">
        <img
          src="/images/hero-beijing-eco.jpg"
          alt="京彩回收 天坛绿城"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/10 via-transparent to-[#F4F8F6]" />

        {/* Top Bar Overlay */}
        <div className="absolute top-0 inset-x-0 pt-5 px-4 flex items-start justify-between">
          <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-white/70">
            <img
              src="/images/eco-avatar.jpg"
              alt="Logo"
              className="w-7 h-7 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[16px] font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 to-sky-700 bg-clip-text text-transparent">
                  京彩回收
                </span>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  北京
                </span>
              </div>
              <p className="text-[10px] text-slate-500 -mt-0.5">绿动京城 · 智慧循环</p>
            </div>
          </div>

          <button
            onClick={() => setShowScanner(true)}
            aria-label="扫码交投"
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/85 backdrop-blur-md text-slate-800 shadow-sm border border-white/80 hover:bg-white active:scale-95 transition"
          >
            <ScanLine className="w-4 h-4 text-emerald-600" />
            <span className="text-[12px] font-semibold">扫码交投</span>
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="px-4 -mt-12 relative z-10 space-y-3.5">
        {/* User & Location + Eco Stats Card */}
        <div className="bg-white rounded-3xl p-4 shadow-[0_8px_28px_-8px_rgba(6,95,70,0.10)] border border-emerald-950/5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="/images/eco-avatar.jpg"
                  alt="用户头像"
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-100 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-bold shadow">
                  {level.level}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold text-slate-900 truncate">
                    {user.nickname}
                  </span>
                </div>
                <button
                  onClick={() => setCommunityOpen(true)}
                  className="mt-1 inline-flex items-center gap-1 text-[12px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-0.5 rounded-full transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{user.community}</span>
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate({ name: 'points_mall' })}
              className="shrink-0 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-700 text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>兑好礼</span>
            </button>
          </div>

          {/* 3-Column Eco Metrics Ribbon */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-100">
            <button
              onClick={() => navigate({ name: 'points_mall' })}
              className="text-center rounded-xl py-1 hover:bg-emerald-50/50 transition"
            >
              <div className="text-[16px] font-extrabold text-emerald-600 tabular-nums">
                {user.points}
              </div>
              <div className="text-[11px] text-slate-500">环保积分</div>
            </button>
            <div className="text-center border-x border-slate-100 py-1">
              <div className="text-[16px] font-extrabold text-teal-600 tabular-nums">
                {user.carbonSavedKg.toFixed(1)}
                <span className="text-[10px] font-semibold ml-0.5">kg</span>
              </div>
              <div className="text-[11px] text-slate-500">累计减碳</div>
            </div>
            <div className="text-center py-1">
              <div className="text-[16px] font-extrabold text-slate-800 tabular-nums">
                ¥{user.totalCashEarned.toFixed(1)}
              </div>
              <div className="text-[11px] text-slate-500">累计收益</div>
            </div>
          </div>
        </div>

        {/* 4 Core Service Entry Cards */}
        <div className="space-y-3">
          {/* 1. 可回收物交投 */}
          <button
            onClick={() => navigate({ name: 'recyclables_hub' })}
            className="w-full relative overflow-hidden rounded-[22px] bg-gradient-to-r from-[#2196F3] via-[#1DB8E8] to-[#22D3EE] p-4 pr-2 text-left text-white shadow-[0_8px_20px_-6px_rgba(14,165,233,0.42)] active:scale-[0.985] transition flex items-center justify-between min-h-[104px]"
          >
            <div className="z-10 pl-1">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-semibold mb-1.5">
                <Leaf className="w-3 h-3" />
                <span>扫码秒返现 · 高低值统收</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[21px] font-extrabold tracking-tight drop-shadow-sm">
                  可回收物交投
                </span>
                <ChevronsRight className="w-5 h-5 text-white/90" />
              </div>
              <p className="text-[11px] text-white/85 mt-0.5">智能回收机 · 固定交投点 · 上门预约</p>
            </div>
            <div className="shrink-0 -mr-1">
              <SmartKioskIllustration className="w-[126px] h-[94px]" />
            </div>
          </button>

          {/* 2. 大件垃圾预约 */}
          <button
            onClick={() => navigate({ name: 'bulky_booking' })}
            className="w-full relative overflow-hidden rounded-[22px] bg-gradient-to-r from-[#E88D5A] via-[#F2A673] to-[#F3AE7E] p-4 pr-2 text-left text-white shadow-[0_8px_20px_-6px_rgba(234,88,12,0.34)] active:scale-[0.985] transition flex items-center justify-between min-h-[104px]"
          >
            <div className="z-10 pl-1">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-semibold mb-1.5">
                <span>家具拆解 · 透明价格表</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[21px] font-extrabold tracking-tight drop-shadow-sm">
                  大件垃圾预约
                </span>
                <ChevronsRight className="w-5 h-5 text-white/90" />
              </div>
              <p className="text-[11px] text-white/90 mt-0.5">沙发床垫衣柜 · 正规上门清运</p>
            </div>
            <div className="w-[106px] h-[92px] rounded-2xl overflow-hidden shrink-0 mr-1 shadow-inner">
              <img
                src="/images/card-bulky.jpg"
                alt="大件垃圾"
                className="w-full h-full object-cover scale-110"
              />
            </div>
          </button>

          {/* 3. 装修垃圾预约 */}
          <button
            onClick={() => navigate({ name: 'renovation_hub' })}
            className="w-full relative overflow-hidden rounded-[22px] bg-gradient-to-r from-[#87827E] via-[#9E9994] to-[#B8B3AD] p-4 pr-2 text-left text-white shadow-[0_8px_20px_-6px_rgba(87,83,78,0.35)] active:scale-[0.985] transition flex items-center justify-between min-h-[104px]"
          >
            <div className="z-10 pl-1">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-semibold mb-1.5">
                <span>持证处置场 · 电子联单溯源</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[21px] font-extrabold tracking-tight drop-shadow-sm">
                  装修垃圾预约
                </span>
                <ChevronsRight className="w-5 h-5 text-white/90" />
              </div>
              <p className="text-[11px] text-white/90 mt-0.5">袋装按袋/按方 · 政策与单位查询</p>
            </div>
            <div className="shrink-0 -mr-1">
              <RenovationIllustration className="w-[126px] h-[94px]" />
            </div>
          </button>

          {/* 4. 家电回收预约 */}
          <button
            onClick={() => setShowAppliancePicker(true)}
            className="w-full relative overflow-hidden rounded-[22px] bg-gradient-to-r from-[#22B573] via-[#34D399] to-[#5EEAD4] p-4 pr-2 text-left text-white shadow-[0_8px_20px_-6px_rgba(16,185,129,0.36)] active:scale-[0.985] transition flex items-center justify-between min-h-[104px]"
          >
            <div className="z-10 pl-1">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-semibold mb-1.5">
                <span>京东 / 中再生 · 免费上门拆机</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[21px] font-extrabold tracking-tight drop-shadow-sm">
                  家电回收预约
                </span>
                <ChevronsRight className="w-5 h-5 text-white/90" />
              </div>
              <p className="text-[11px] text-white/90 mt-0.5">在线即时估价 · 以旧换新补贴</p>
            </div>
            <div className="shrink-0 -mr-1">
              <AppliancesIllustration className="w-[126px] h-[94px]" />
            </div>
          </button>
        </div>

        {/* Today's Live Recyclable Price Strip */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-950/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h2 className="text-[14px] font-bold text-slate-900">今日回收参考价</h2>
            </div>
            <button
              onClick={() => navigate({ name: 'recyclables_booking' })}
              className="text-[11px] font-semibold text-emerald-600 flex items-center"
            >
              <span>预约变现</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-0.5">
            {DAILY_MARKET_PRICES.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate({ name: 'recyclables_booking' })}
                className="shrink-0 w-[108px] rounded-2xl bg-[#F6FAF8] border border-emerald-100/80 p-2.5 text-left hover:border-emerald-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100/70 px-1.5 py-0.5 rounded-full">
                    {item.trend}
                  </span>
                </div>
                <div className="text-[12px] font-semibold text-slate-800 truncate mt-1.5">
                  {item.name.split('/')[0]}
                </div>
                <div className="text-[14px] font-extrabold text-emerald-700 tabular-nums mt-0.5">
                  ¥{item.price.toFixed(1)}
                  <span className="text-[10px] font-normal text-slate-500">/{item.unit.split('/')[1]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Tools: Smart Waste Classifier & Policy Hub */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate({ name: 'usage_guide' })}
            className="bg-white rounded-2xl p-3.5 border border-emerald-950/5 shadow-sm text-left flex items-center gap-2.5 active:scale-[0.98] transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-slate-900">分类查一查</div>
              <div className="text-[11px] text-slate-500 truncate">不确定怎么扔？</div>
            </div>
          </button>

          <button
            onClick={() => navigate({ name: 'renovation_hub' })}
            className="bg-white rounded-2xl p-3.5 border border-emerald-950/5 shadow-sm text-left flex items-center gap-2.5 active:scale-[0.98] transition"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-slate-900">政策与活动</div>
              <div className="text-[11px] text-slate-500 truncate">双倍积分进行中</div>
            </div>
          </button>
        </div>

        {/* Slogan Footer */}
        <div className="pt-3 pb-2 text-center">
          <div className="inline-flex items-center gap-2 text-[14px] font-extrabold tracking-widest text-emerald-900/75">
            <span className="w-4 h-0.5 rounded-full bg-emerald-400" />
            <span>垃圾分类 我们一起来</span>
            <span className="w-4 h-0.5 rounded-full bg-emerald-400" />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">北京市生活垃圾与再生资源便民服务示范平台</p>
        </div>
      </div>

      <CommunityPickerModal open={communityOpen} onClose={() => setCommunityOpen(false)} />
    </div>
  );
};
