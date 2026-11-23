import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  ScanLine,
  Map as MapIcon,
  List,
  Phone,
  Check,
  Camera,
  AlertCircle,
  Sparkles,
  Building2,
  Package,
  Store,
  Warehouse,
  CalendarClock,
  Plus,
  Minus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubPageHeader } from '../components/Layout';
import {
  DAILY_MARKET_PRICES,
  RECYCLABLE_PROVIDERS,
  STATION_POINTS,
} from '../data/mockData';
import { EmptyInboxIllustration } from '../components/ServiceIllustrations';

/* ===================== 1. 可回收物交投总览页 ===================== */
export const RecyclablesHubPage: React.FC = () => {
  const { navigate } = useApp();

  const channels = [
    {
      title: '智能回收机',
      subtitle: '24h 扫码开箱 · 自动称重秒返现',
      desc: '具备“高低值统收、自动计量、实时返现、数据联网”功能，居民可扫码交投废纸、金属、塑料、旧衣物等可回收物，并获得现金与环保积分奖励。',
      btnText: '附近智能回收机',
      accentText: 'text-emerald-700',
      accentBg: 'bg-emerald-50 border-emerald-200/70',
      btnCls: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
      icon: Package,
      onClick: () => navigate({ name: 'nearby_stations', stationType: 'smart_machine' }),
    },
    {
      title: '固定交投点',
      subtitle: '社区专人值守 · 现场称重结算',
      desc: '是指以人工定时值守回收的形式，在小区、社区设立的便于交投可回收物的场所，面向居民提供全品类可回收物便民回收服务。',
      btnText: '附近固定交投点',
      accentText: 'text-sky-700',
      accentBg: 'bg-sky-50 border-sky-200/70',
      btnCls: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20',
      icon: Store,
      onClick: () => navigate({ name: 'nearby_stations', stationType: 'fixed_station' }),
    },
    {
      title: '中转站（分拣中心）',
      subtitle: '大宗交投直收 · 规范分选打包',
      desc: '是对可回收物进行集中回收、存储，并具有分选、打包、转运等功能的回收场所，亦面向居民与商户提供大宗可回收物直收服务。',
      btnText: '附近回收站(中心)',
      accentText: 'text-orange-700',
      accentBg: 'bg-orange-50 border-orange-200/70',
      btnCls: 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20',
      icon: Warehouse,
      onClick: () => navigate({ name: 'nearby_stations', stationType: 'sorting_center' }),
    },
    {
      title: '预约交投（上门回收）',
      subtitle: '敬老助残关怀 · 满5公斤免费上门',
      desc: '针对年长、行动不便人士或家有大宗纸箱/废品的居民提供预约上门回收服务，回收物总重量建议大于5公斤，透明称重即时结款。',
      btnText: '去预约',
      accentText: 'text-teal-700',
      accentBg: 'bg-teal-50 border-teal-200/70',
      btnCls: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-emerald-600/20',
      icon: CalendarClock,
      onClick: () => navigate({ name: 'recyclables_booking' }),
    },
  ];

  return (
    <div className="min-h-full bg-gradient-to-b from-[#E6F8F2] via-[#F2FBF9] to-[#F4F8F6] pb-8">
      <SubPageHeader title="可回收物交投" />
      <div className="p-4 space-y-3.5">
        {channels.map((ch) => {
          const Icon = ch.icon;
          return (
            <div
              key={ch.title}
              className="bg-white rounded-3xl p-4 shadow-[0_6px_22px_-8px_rgba(15,23,42,0.08)] border border-emerald-950/5"
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${ch.accentBg} ${ch.accentText}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`text-[17px] font-extrabold ${ch.accentText}`}>{ch.title}</h2>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">{ch.subtitle}</p>
                </div>
              </div>
              <p className="text-[13px] leading-relaxed text-slate-600 mt-3">{ch.desc}</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={ch.onClick}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-semibold shadow-md active:scale-95 transition ${ch.btnCls}`}
                >
                  {ch.btnText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ===================== 2. 附近投递点（支持地图+列表切换） ===================== */
export const NearbyStationsPage: React.FC<{
  stationType: 'smart_machine' | 'fixed_station' | 'sorting_center';
}> = ({ stationType }) => {
  const { user, setShowScanner, showToast } = useApp();
  const [maxMeters, setMaxMeters] = useState<number>(3000);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeStationId, setActiveStationId] = useState<string | null>(null);

  const titleMap = {
    smart_machine: '智能回收机',
    fixed_station: '固定交投点',
    sorting_center: '回收站（分拣中心）',
  };

  const distances = [
    { label: '500m', value: 500 },
    { label: '1公里', value: 1000 },
    { label: '3公里', value: 3000 },
    { label: '5公里', value: 5000 },
  ];

  const list = STATION_POINTS.filter(
    (s) => s.type === stationType && s.distanceMeters <= maxMeters
  ).sort((a, b) => a.distanceMeters - b.distanceMeters);

  const selectedStation = list.find((s) => s.id === activeStationId) ?? list[0];

  const formatDist = (m: number) => (m < 1000 ? `${m}m` : `${(m / 1000).toFixed(1)}km`);

  return (
    <div className="min-h-full bg-[#F4F8F6] pb-8">
      <SubPageHeader
        title={titleMap[stationType]}
        rightAction={
          <button
            onClick={() => setViewMode((v) => (v === 'list' ? 'map' : 'list'))}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[12px] font-semibold active:scale-95 transition"
          >
            {viewMode === 'list' ? <MapIcon className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
            <span>{viewMode === 'list' ? '地图' : '列表'}</span>
          </button>
        }
      />

      {/* Distance Filter Pills */}
      <div className="sticky top-13 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100">
        <div className="grid grid-cols-4 gap-2">
          {distances.map((d) => {
            const active = maxMeters === d.value;
            return (
              <button
                key={d.value}
                onClick={() => setMaxMeters(d.value)}
                className={`py-1.5 rounded-full text-[13px] font-semibold transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            当前定位：{user.community}附近
          </span>
          <span className="font-medium text-emerald-700">找到 {list.length} 个可用点位</span>
        </div>
      </div>

      {/* Visual Interactive Map View */}
      {viewMode === 'map' && (
        <div className="p-4 space-y-3">
          <div className="relative h-72 rounded-3xl overflow-hidden bg-[#E3F4EC] border border-emerald-200 shadow-inner">
            {/* Stylized Beijing street grid */}
            <svg className="absolute inset-0 w-full h-full opacity-55" viewBox="0 0 400 300">
              <path d="M0 70 H400 M0 155 H400 M0 235 H400" stroke="#FFFFFF" strokeWidth="10" />
              <path d="M90 0 V300 M205 0 V300 M315 0 V300" stroke="#FFFFFF" strokeWidth="10" />
              <path d="M20 280 Q150 200 380 40" stroke="#A7F3D0" strokeWidth="14" fill="none" />
              <rect x="115" y="90" width="70" height="48" rx="10" fill="#BBF7D0" />
              <rect x="230" y="175" width="68" height="46" rx="10" fill="#BAE6FD" />
            </svg>

            {/* User center dot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="w-4 h-4 rounded-full bg-sky-500 ring-4 ring-sky-400/35 shadow" />
              <span className="mt-1 px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-slate-700 shadow-sm">
                我的位置
              </span>
            </div>

            {/* Station Pins */}
            {list.map((st) => {
              const active = selectedStation?.id === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStationId(st.id)}
                  style={{ left: `${st.xPercent}%`, top: `${st.yPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform ${
                    active ? 'scale-115 z-20' : 'scale-100 z-10'
                  }`}
                >
                  <div
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1 whitespace-nowrap ${
                      active
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/40'
                        : 'bg-white text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{formatDist(st.distanceMeters)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedStation && (
            <div className="bg-white rounded-2xl p-4 shadow-md border border-emerald-100">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900">{selectedStation.name}</h3>
                  <p className="text-[12px] text-slate-500 mt-0.5">{selectedStation.address}</p>
                </div>
                <span className="shrink-0 text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {formatDist(selectedStation.distanceMeters)}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => showToast(`已为您规划前往「${selectedStation.name}」的步行导航`, 'info')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-[12px] font-semibold flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" /> 导航前往
                </button>
                <button
                  onClick={() => setShowScanner(true)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-[12px] font-semibold flex items-center justify-center gap-1"
                >
                  <ScanLine className="w-3.5 h-3.5" /> 扫码投递
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="p-4 space-y-3">
          {list.length === 0 ? (
            <div className="py-16 flex flex-col items-center text-center">
              <EmptyInboxIllustration className="w-24 h-24" />
              <p className="text-[15px] font-bold text-slate-700 mt-3">当前范围内暂无投递点</p>
              <p className="text-[12px] text-slate-400 mt-1">可切换至「3公里」或「5公里」查看更多站点</p>
              <button
                onClick={() => setMaxMeters(5000)}
                className="mt-4 px-5 py-2 rounded-full bg-emerald-600 text-white text-[13px] font-semibold"
              >
                扩大至 5 公里搜索
              </button>
            </div>
          ) : (
            list.map((st) => (
              <div
                key={st.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-bold text-slate-900">{st.name}</h3>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                          st.status === 'online'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {st.status === 'online' ? '正常开放' : '格口偏满'}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-500 mt-1 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{st.address}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{st.hours}</span>
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[14px] font-extrabold text-emerald-600 tabular-nums">
                      {formatDist(st.distanceMeters)}
                    </div>
                    <div className="text-[10px] text-slate-400">距您约{Math.max(2, Math.round(st.distanceMeters / 75))}分钟</div>
                  </div>
                </div>

                {/* Live Capacity Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-500">当前柜体余量</span>
                    <span className="font-semibold text-slate-700 tabular-nums">
                      空闲 {100 - st.capacityPercent}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        st.capacityPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${st.capacityPercent}%` }}
                    />
                  </div>
                </div>

                {/* Categories + Highlight */}
                <div className="flex flex-wrap gap-1.5">
                  {st.categories.map((c) => (
                    <span
                      key={c}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="text-[12px] font-medium text-emerald-700 bg-emerald-50/70 px-3 py-1.5 rounded-xl">
                  💡 {st.priceHighlight}
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => showToast(`已打开前往「${st.name}」的路线导航`, 'info')}
                    className="py-2 rounded-xl border border-slate-200 text-slate-700 text-[12px] font-semibold flex items-center justify-center gap-1 active:scale-95 transition"
                  >
                    <Navigation className="w-3.5 h-3.5 text-sky-600" />
                    <span>导航前往</span>
                  </button>
                  {stationType === 'smart_machine' ? (
                    <button
                      onClick={() => setShowScanner(true)}
                      className="py-2 rounded-xl bg-emerald-600 text-white text-[12px] font-semibold flex items-center justify-center gap-1 active:scale-95 transition"
                    >
                      <ScanLine className="w-3.5 h-3.5" />
                      <span>扫码投递</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => showToast(`正在模拟致电站点：${st.phone ?? '010-64378821'}`, 'info')}
                      className="py-2 rounded-xl bg-emerald-600 text-white text-[12px] font-semibold flex items-center justify-center gap-1 active:scale-95 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>联系站点</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

/* ===================== 3. 可回收物预约交投页 ===================== */
export const RecyclablesBookingPage: React.FC = () => {
  const { addresses, selectedAddressId, navigate, createOrder, setActiveTab, showToast } = useApp();
  const currentAddr = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];

  const [providerId, setProviderId] = useState(RECYCLABLE_PROVIDERS[0].id);
  const [weights, setWeights] = useState<Record<string, number>>({
    paper: 4,
    plastic: 2,
  });
  const [timeSlot, setTimeSlot] = useState('明天 09:00-11:00');
  const [remarks, setRemarks] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const timeSlots = ['今天 16:00-18:00', '明天 09:00-11:00', '明天 14:00-16:00', '后天 10:00-12:00'];

  const updateWeight = (id: string, delta: number) => {
    setWeights((prev) => {
      const next = Math.max(0, Number(((prev[id] ?? 0) + delta).toFixed(1)));
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const estimatedCash = Object.entries(weights).reduce((sum, [id, kg]) => {
    const item = DAILY_MARKET_PRICES.find((p) => p.id === id);
    return sum + (item ? item.price * kg : 0);
  }, 0);
  const estimatedPoints = Math.round(totalWeight * 10);

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files)
      .slice(0, 4 - photos.length)
      .forEach((f) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setPhotos((prev) => [...prev.slice(0, 3), reader.result as string]);
          }
        };
        reader.readAsDataURL(f);
      });
  };

  const handleSubmit = () => {
    if (!currentAddr) {
      showToast('请先添加并选择回收地址', 'warning');
      return;
    }
    if (totalWeight <= 0) {
      showToast('请至少选择一种回收品类和预估重量', 'warning');
      return;
    }
    const provider = RECYCLABLE_PROVIDERS.find((p) => p.id === providerId)!;
    const summary = Object.entries(weights)
      .map(([id, kg]) => {
        const cat = DAILY_MARKET_PRICES.find((p) => p.id === id);
        return `${cat?.name.split('/')[0] ?? id} ${kg}kg`;
      })
      .join('、');

    createOrder({
      category: 'recyclable',
      categoryLabel: '可回收物预约交投',
      status: 'pending',
      appointmentTime: timeSlot,
      addressText: `${currentAddr.region}${currentAddr.street} ${currentAddr.community} ${currentAddr.detail}`,
      contactName: currentAddr.contactName,
      contactPhone: currentAddr.phone,
      providerName: provider.name,
      itemsSummary: summary,
      estimatedAmount: Number(estimatedCash.toFixed(2)),
      isFee: false,
      estimatedPoints,
      estimatedWeightKg: totalWeight,
      remarks: remarks.trim() || undefined,
      photos,
    });

    showToast('预约交投下单成功！已奖励 +15 下单积分', 'success');
    navigate({ name: 'tabs' });
    setActiveTab('orders');
  };

  return (
    <div className="min-h-full bg-[#F4F8F6] pb-28">
      <SubPageHeader title="预约交投" />

      <div className="p-4 space-y-3.5">
        {/* Warm Tip */}
        <div className="rounded-2xl bg-sky-50 border-l-4 border-sky-500 px-3.5 py-2.5 text-[12px] text-sky-900 leading-relaxed">
          <span className="font-bold">温馨提示：</span>
          针对年长、行动不便人士及大宗交投居民提供上门回收服务，回收物总重量建议大于 <span className="font-bold text-sky-700">5公斤</span>。
        </div>

        {/* Address Card */}
        <button
          onClick={() => navigate({ name: 'address_list', selectMode: true })}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 text-left flex items-center justify-between gap-3 active:scale-[0.99] transition"
        >
          {currentAddr ? (
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                  回收地
                </span>
                <span className="text-[14px] font-bold text-slate-900">
                  {currentAddr.contactName} {currentAddr.phone}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-1 truncate">
                {currentAddr.region} {currentAddr.community} {currentAddr.detail}
              </p>
            </div>
          ) : (
            <span className="text-[14px] font-semibold text-rose-600">* 请选择回收地（必选）</span>
          )}
          <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
        </button>

        {/* Service Enterprise Picker */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 space-y-2.5">
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>
              <span className="text-rose-500">*</span> 选择服务企业
            </span>
          </div>
          <div className="space-y-2">
            {RECYCLABLE_PROVIDERS.map((p) => {
              const active = providerId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setProviderId(p.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                    active
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-slate-100 bg-slate-50/60'
                  }`}
                >
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      ★ {p.rating} · {p.response} · {p.tag}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      active ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category & Weight Selector */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-900">
              <span className="text-rose-500">*</span> 选择回收品类及预估重量
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums ${
                totalWeight >= 5
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              合计 {totalWeight.toFixed(1)} kg
            </span>
          </div>

          <div className="space-y-2">
            {DAILY_MARKET_PRICES.map((item) => {
              const kg = weights[item.id] ?? 0;
              return (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                    kg > 0 ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-100 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-emerald-700 font-medium tabular-nums">
                        参考价 ¥{item.price.toFixed(1)}/kg
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateWeight(item.id, -1)}
                      className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-90 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-11 text-center text-[13px] font-bold text-slate-900 tabular-nums">
                      {kg}kg
                    </span>
                    <button
                      onClick={() => updateWeight(item.id, 1)}
                      className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center active:scale-90 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalWeight > 0 && totalWeight < 5 && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-3 py-2 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>当前预估重量不足 5kg，建议攒够 5kg 上门或使用附近24h智能回收机投递</span>
            </div>
          )}
        </div>

        {/* Time Slot */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5">
          <div className="text-[13px] font-bold text-slate-900 mb-2.5">预约上门时段</div>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setTimeSlot(slot)}
                className={`py-2 px-2.5 rounded-xl text-[12px] font-semibold border transition ${
                  timeSlot === slot
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-100 bg-slate-50 text-slate-600'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Cross-link banner matching original mini-program */}
        <div className="rounded-2xl bg-sky-50 border border-sky-100 px-3.5 py-2.5 flex items-center justify-between gap-2">
          <span className="text-[12px] text-sky-900 font-medium">
            温馨提示：大件垃圾/装修垃圾有偿清运
          </span>
          <button
            onClick={() => navigate({ name: 'bulky_booking' })}
            className="shrink-0 px-3.5 py-1 rounded-full bg-sky-500 text-white text-[12px] font-semibold active:scale-95 transition"
          >
            去看看
          </button>
        </div>

        {/* Photos & Remarks */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 space-y-3">
          <div className="text-[13px] font-bold text-slate-900">现场照片与备注</div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {photos.map((src, i) => (
              <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                <img src={src} alt="上传照片" className="w-full h-full object-cover" />
              </div>
            ))}
            {photos.length < 4 && (
              <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-emerald-400 hover:text-emerald-600 transition">
                <Camera className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">{photos.length}/4</span>
                <input type="file" accept="image/*" multiple onChange={handlePhotoAdd} className="hidden" />
              </label>
            )}
          </div>
          <div className="relative">
            <textarea
              maxLength={200}
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="如您有特殊需求（如需要敬老助搬、纸箱较多等），可在此区域描述"
              className="w-full rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 resize-none"
            />
            <span className="absolute right-3 bottom-2 text-[11px] text-slate-400 tabular-nums">
              {remarks.length}/200
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Checkout Bar */}
      <div className="sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 flex items-center justify-between gap-3 z-30">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-slate-500">预估收益</span>
            <span className="text-xl font-extrabold text-emerald-600 tabular-nums">
              ¥{estimatedCash.toFixed(2)}
            </span>
          </div>
          <div className="text-[11px] text-amber-600 font-medium flex items-center gap-1 tabular-nums">
            <Sparkles className="w-3 h-3" />
            <span>预计可得 +{estimatedPoints} 环保积分</span>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-[14px] shadow-lg shadow-emerald-600/25 active:scale-95 transition"
        >
          确认预约
        </button>
      </div>
    </div>
  );
};
