import React, { useState } from 'react';
import {
  MapPin,
  ScanLine,
  QrCode,
  ChevronRight,
  ChevronDown,
  Search,
  Navigation,
  CalendarClock,
  Building2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DAILY_MARKET_PRICES } from '../data/mockData';
import { NingLogoMark } from '../components/NanjingVisuals';
import { CommunityPickerModal } from '../components/Modals';

const QUICK_ACTIONS = [
  { title: '附近回收点', Icon: Navigation, route: { name: 'nearby_stations', stationType: 'smart_machine' } },
  { title: '预约上门', Icon: CalendarClock, route: { name: 'recyclables_booking' } },
  { title: '备案单位', Icon: Building2, route: { name: 'renovation_units' } },
] as const;

export const HomePage: React.FC = () => {
  const { user, navigate, setShowScanner, setShowQrModal, setShowAppliancePicker } = useApp();
  const [communityOpen, setCommunityOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ name: 'usage_guide', initialQuery: quickQuery.trim() });
  };

  const serviceCards = [
    {
      title: '可回收物',
      tag: '扫码秒结',
      price: '¥1.1/kg起',
      image: '/images/svc-recyclables.jpg',
      onClick: () => navigate({ name: 'recyclables_hub' }),
    },
    {
      title: '大件清运',
      tag: '家具拆运',
      price: '¥40起',
      image: '/images/svc-bulky.jpg',
      onClick: () => navigate({ name: 'bulky_booking' }),
    },
    {
      title: '装修垃圾',
      tag: '电子联单',
      price: '¥7.5/袋',
      image: '/images/svc-renovation.jpg',
      onClick: () => navigate({ name: 'renovation_hub' }),
    },
    {
      title: '废旧家电',
      tag: '免费拆机',
      price: '以旧换新',
      image: '/images/svc-appliances.jpg',
      onClick: () => setShowAppliancePicker(true),
    },
  ];

  const storyCards = [
    {
      image: '/images/nj-ming-forest.jpg', alt: '南京分类自测', title: '南京分类自测', subtitle: '5题速测四分类',
      badge: user.quizClaimed ? '已通关' : '+20 积分', badgeStyle: 'text-[#1D6F5A]', route: { name: 'usage_guide' },
    },
    {
      image: '/images/nj-ming-wall.jpg', alt: '积分兑好礼', title: '积分兑出行金', subtitle: '金陵通 · 清运券',
      badge: `${user.points} 分`, badgeStyle: 'text-zinc-900 tabular-nums', route: { name: 'points_mall' },
    },
  ] as const;

  return (
    <div className="min-h-full bg-[#F4F4F1] pb-6">
      {/* Immersive Real Nanjing Xuanwu Lake + Purple Mountain Hero */}
      <div className="relative h-[214px] overflow-hidden">
        <img
          src="/images/nj-hero-xuanwu.jpg"
          alt="南京玄武湖与紫金山"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-[#F4F4F1]" />

        {/* Top Bar */}
        <div className="absolute top-0 inset-x-0 px-4 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NingLogoMark className="w-7 h-7 shadow-sm" />
            <span className="text-[17px] font-bold tracking-tight text-white drop-shadow-sm">
              宁回收
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-md text-white border border-white/25">
              南京 · 演示
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowQrModal(true)}
              aria-label="交投码"
              className="h-8 px-2.5 rounded-lg bg-white/90 backdrop-blur-md text-zinc-900 text-[12px] font-medium flex items-center gap-1 shadow-xs active:scale-95 transition"
            >
              <QrCode className="w-3.5 h-3.5 text-[#1D6F5A]" />
              <span>交投码</span>
            </button>
            <button
              onClick={() => setShowScanner(true)}
              aria-label="扫一扫"
              className="h-8 px-2.5 rounded-lg bg-[#1D6F5A] text-white text-[12px] font-medium flex items-center gap-1 shadow-xs active:scale-95 transition"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>扫一扫</span>
            </button>
          </div>
        </div>

        {/* Location Pill + Headline */}
        <div className="absolute bottom-9 inset-x-4 flex items-end justify-between gap-2">
          <div>
            <button
              onClick={() => setCommunityOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[12px] font-medium border border-white/20"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>{user.district} · {user.community}</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/75" />
            </button>
          </div>
          <button
            onClick={() => navigate({ name: 'nearby_stations', stationType: 'smart_machine' })}
            className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-[#1D6F5A] shadow-xs"
          >
            最近回收柜 160m
          </button>
        </div>
      </div>

      {/* Main Visual Content */}
      <div className="px-3.5 -mt-5 relative z-10 space-y-3.5">
        {/* Floating Search Bar */}
        <form onSubmit={handleQuickSearch} className="relative shadow-sm rounded-xl">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="查分类：小龙虾壳、旧床垫、电池..."
            className="w-full h-11 pl-10 pr-16 rounded-xl bg-white border border-[#E6E6E1] text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#1D6F5A]"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1D6F5A] text-[11.5px] font-medium text-white"
          >
            查询
          </button>
        </form>

        {/* 2x2 Editorial Photo Service Grid (High Visual Impact, Minimal Text) */}
        <div className="grid grid-cols-2 gap-2.5">
          {serviceCards.map((card) => (
            <button
              key={card.title}
              onClick={card.onClick}
              className="group relative h-[138px] rounded-xl overflow-hidden text-left border border-black/8 shadow-xs active:scale-[0.985] transition"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

              {/* Top-left compact price pill */}
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[10.5px] font-bold text-zinc-900 tabular-nums">
                {card.price}
              </span>

              {/* Bottom concise title */}
              <div className="absolute bottom-2.5 inset-x-3 flex items-end justify-between">
                <div>
                  <div className="text-[16px] font-bold text-white leading-tight drop-shadow-xs">
                    {card.title}
                  </div>
                  <div className="text-[11px] text-white/80 mt-0.5">{card.tag}</div>
                </div>
                <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {QUICK_ACTIONS.map(({ title, Icon, route }) => (
            <button
              key={title}
              onClick={() => navigate(route)}
              className="bg-white rounded-xl border border-[#E6E6E1] py-2.5 px-2 flex flex-col items-center gap-1 active:bg-zinc-50 transition"
            >
              <Icon className="w-4 h-4 text-[#1D6F5A]" />
              <span className="text-[12px] font-medium text-zinc-800">{title}</span>
            </button>
          ))}
        </div>

        {/* Horizontal Photo Gallery: 今日参考价 */}
        <div>
          <div className="flex items-center justify-between px-0.5 mb-2">
            <h2 className="text-[14px] font-bold text-zinc-900">南京今日参考价</h2>
            <button
              onClick={() => navigate({ name: 'recyclables_booking' })}
              className="text-[12px] font-medium text-[#1D6F5A] flex items-center"
            >
              <span>预约变现</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-0.5">
            {DAILY_MARKET_PRICES.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => navigate({ name: 'recyclables_booking' })}
                className="shrink-0 w-[112px] bg-white rounded-xl border border-[#E6E6E1] overflow-hidden text-left active:scale-[0.98] transition"
              >
                <div className="relative h-[74px] w-full overflow-hidden bg-zinc-100">
                  <img
                    src={item.image}
                    alt={item.shortName}
                    className="w-full h-full object-cover"
                  />
                  {item.trend.startsWith('+') && (
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-[#1D6F5A]/90 text-white text-[9.5px] font-semibold tabular-nums">
                      {item.trend}
                    </span>
                  )}
                </div>
                <div className="p-2">
                  <div className="text-[12px] font-semibold text-zinc-800 truncate">{item.shortName}</div>
                  <div className="text-[13.5px] font-bold text-[#1D6F5A] tabular-nums mt-0.5">
                    ¥{item.price.toFixed(1)}
                    <span className="text-[10px] font-normal text-zinc-400">/kg</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {storyCards.map((card) => (
            <button
              key={card.title}
              onClick={() => navigate(card.route)}
              className="relative h-[96px] rounded-xl overflow-hidden text-left border border-black/8 active:scale-[0.985] transition"
            >
              <img src={card.image} alt={card.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
              <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded bg-white/90 text-[10px] font-bold ${card.badgeStyle}`}>
                {card.badge}
              </span>
              <div className="absolute bottom-2.5 left-3 right-2 text-white">
                <div className="text-[14px] font-bold">{card.title}</div>
                <div className="text-[10.5px] text-white/80">{card.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <CommunityPickerModal open={communityOpen} onClose={() => setCommunityOpen(false)} />
    </div>
  );
};
