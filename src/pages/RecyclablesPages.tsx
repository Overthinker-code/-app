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
  Building2,
  Package,
  Store,
  Warehouse,
  CalendarClock,
  Plus,
  Minus,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubPageHeader } from '../components/Layout';
import {
  DAILY_MARKET_PRICES,
  NANJING_COMMUNITIES,
  RECYCLABLE_PROVIDERS,
  STATION_POINTS,
} from '../data/mockData';
import { ItemIcon } from '../components/NanjingVisuals';
import { NanjingMap } from '../components/NanjingMap';

/* ===================== 1. 可回收物交投总览（图文精简版） ===================== */
export const RecyclablesHubPage: React.FC = () => {
  const { navigate } = useApp();

  const channels = [
    {
      title: '智能回收柜',
      tag: '24h 扫码秒结',
      image: '/images/mat-bottles.jpg',
      icon: Package,
      onClick: () => navigate({ name: 'nearby_stations', stationType: 'smart_machine' }),
    },
    {
      title: '固定交投点',
      tag: '专人复秤结算',
      image: '/images/mat-metal.jpg',
      icon: Store,
      onClick: () => navigate({ name: 'nearby_stations', stationType: 'fixed_station' }),
    },
    {
      title: '分拣中心',
      tag: '大宗直收价',
      image: '/images/mat-textile.jpg',
      icon: Warehouse,
      onClick: () => navigate({ name: 'nearby_stations', stationType: 'sorting_center' }),
    },
    {
      title: '预约上门',
      tag: '满5kg免费收',
      image: '/images/svc-recyclables.jpg',
      icon: CalendarClock,
      onClick: () => navigate({ name: 'recyclables_booking' }),
    },
  ];

  return (
    <div className="min-h-full bg-[#F4F4F1] pb-8">
      <SubPageHeader title="可回收物交投" />

      <div className="p-3.5 space-y-3">
        {/* Visual Hero Strip */}
        <div className="relative h-32 rounded-xl overflow-hidden border border-black/8">
          <img
            src="/images/svc-recyclables.jpg"
            alt="可回收物"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div className="absolute inset-y-0 left-4 flex flex-col justify-center text-white">
            <span className="text-[11px] text-emerald-300 font-medium">南京高低值统收</span>
            <h2 className="text-[18px] font-bold mt-0.5">纸箱 · 塑料 · 金属 · 旧衣</h2>
            <p className="text-[11.5px] text-white/80 mt-0.5">就近扫码投递或预约上门</p>
          </div>
        </div>

        {/* 2x2 Visual Channel Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {channels.map((ch) => {
            const Icon = ch.icon;
            return (
              <button
                key={ch.title}
                onClick={ch.onClick}
                className="bg-white rounded-xl border border-[#E6E6E1] overflow-hidden text-left active:scale-[0.985] transition"
              >
                <div className="relative h-24 w-full overflow-hidden">
                  <img src={ch.image} alt={ch.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-white/90 text-[#1D6F5A] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-bold text-zinc-900">{ch.title}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{ch.tag}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ===================== 2. 附近投递点（真实 Leaflet 南京地图 + 列表） ===================== */
export const NearbyStationsPage: React.FC<{
  stationType: 'smart_machine' | 'fixed_station' | 'sorting_center';
}> = ({ stationType }) => {
  const { user, setShowScanner, showToast } = useApp();
  const [maxMeters, setMaxMeters] = useState<number>(1000);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeStationId, setActiveStationId] = useState<string | null>(null);

  const titleMap = {
    smart_machine: '附近智能回收柜',
    fixed_station: '附近固定交投点',
    sorting_center: '附近分拣中心',
  };

  const distances = [
    { label: '500m', value: 500 },
    { label: '1公里', value: 1000 },
    { label: '3公里', value: 3000 },
    { label: '5公里', value: 5000 },
  ];

  const userCommunity =
    NANJING_COMMUNITIES.find((c) => c.name === user.community) ?? NANJING_COMMUNITIES[0];

  const list = STATION_POINTS.filter(
    (s) => s.type === stationType && s.distanceMeters <= maxMeters
  ).sort((a, b) => a.distanceMeters - b.distanceMeters);

  const selectedStation = list.find((s) => s.id === activeStationId) ?? list[0];
  const formatDist = (m: number) => (m < 1000 ? `${m}m` : `${(m / 1000).toFixed(1)}km`);

  return (
    <div className="min-h-full bg-[#F4F4F1] pb-8">
      <SubPageHeader
        title={titleMap[stationType]}
        rightAction={
          <button
            onClick={() => setViewMode((v) => (v === 'list' ? 'map' : 'list'))}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EDF5F2] text-[#1D6F5A] text-[12px] font-medium"
          >
            {viewMode === 'list' ? <MapIcon className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
            <span>{viewMode === 'list' ? '地图' : '列表'}</span>
          </button>
        }
      />

      {/* Distance Filter Bar */}
      <div className="sticky top-12 z-20 bg-white px-3.5 py-2.5 border-b border-[#E6E6E1]">
        <div className="grid grid-cols-4 gap-1.5">
          {distances.map((d) => {
            const active = maxMeters === d.value;
            return (
              <button
                key={d.value}
                onClick={() => setMaxMeters(d.value)}
                className={`py-1.5 rounded-lg text-[12px] font-medium transition ${
                  active
                    ? 'bg-[#1D6F5A] text-white'
                    : 'bg-[#F4F4F1] text-zinc-600'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#1D6F5A]" />
            南京市{user.district} · {user.community}附近
          </span>
          <span className="font-medium text-zinc-700 tabular-nums">共 {list.length} 处点位</span>
        </div>
      </div>

      {/* Real Nanjing Leaflet Map View */}
      {viewMode === 'map' && (
        <div className="p-3.5 space-y-3">
          <NanjingMap
            centerLat={userCommunity.lat}
            centerLng={userCommunity.lng}
            radiusMeters={maxMeters}
            stations={list}
            selectedId={selectedStation?.id ?? null}
            onSelect={(id) => setActiveStationId(id)}
          />

          {selectedStation ? (
            <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-[14.5px] font-semibold text-zinc-900">{selectedStation.name}</h3>
                  <p className="text-[12px] text-zinc-500 mt-0.5">{selectedStation.address}</p>
                  <p className="text-[11px] text-zinc-400 mt-1">{selectedStation.hours} · {selectedStation.priceHighlight}</p>
                </div>
                <span className="shrink-0 text-[12px] font-semibold text-[#1D6F5A] bg-[#EDF5F2] px-2 py-0.5 rounded tabular-nums">
                  {formatDist(selectedStation.distanceMeters)}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => showToast(`已发起前往「${selectedStation.name}」的步行路线`, 'info')}
                  className="py-2 rounded-lg border border-[#E6E6E1] text-zinc-700 text-[12px] font-medium flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#1D6F5A]" /> 路线导航
                </button>
                <button
                  onClick={() => setShowScanner(true)}
                  className="py-2 rounded-lg bg-[#1D6F5A] text-white text-[12px] font-semibold flex items-center justify-center gap-1"
                >
                  <ScanLine className="w-3.5 h-3.5" /> 扫码开箱
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-4 border border-[#E6E6E1] text-center text-[12.5px] text-zinc-500">
              当前距离范围内暂无点位，请切换至 3 公里或 5 公里查看
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="p-3.5 space-y-2.5">
          {list.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[14px] font-semibold text-zinc-700">当前范围内暂无投递点</p>
              <p className="text-[12px] text-zinc-400 mt-1">切换至 3 公里或 5 公里查看更多南京网点</p>
              <button
                onClick={() => setMaxMeters(5000)}
                className="mt-4 px-4 py-2 rounded-lg bg-[#1D6F5A] text-white text-[12.5px] font-medium"
              >
                扩大至 5 公里
              </button>
            </div>
          ) : (
            list.map((st) => (
              <div
                key={st.id}
                className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-[14.5px] font-semibold text-zinc-900">{st.name}</h3>
                      <span
                        className={`text-[10.5px] font-medium px-1.5 py-0.5 rounded ${
                          st.status === 'online'
                            ? 'bg-[#EDF5F2] text-[#1D6F5A]'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {st.status === 'online' ? '正常开放' : '容量偏满'}
                      </span>
                    </div>
                    <p className="text-[12px] text-zinc-500 mt-1">{st.address}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{st.hours}</span>
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[14px] font-bold text-[#1D6F5A] tabular-nums">
                      {formatDist(st.distanceMeters)}
                    </div>
                    <div className="text-[10.5px] text-zinc-400">约{Math.max(2, Math.round(st.distanceMeters / 75))}分钟</div>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-zinc-500">当前柜体余量</span>
                    <span className="font-medium text-zinc-700 tabular-nums">
                      空闲 {100 - st.capacityPercent}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#ECECE8] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        st.capacityPercent > 80 ? 'bg-amber-600' : 'bg-[#1D6F5A]'
                      }`}
                      style={{ width: `${st.capacityPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {st.categories.map((c) => (
                    <span
                      key={c}
                      className="text-[11px] px-2 py-0.5 rounded bg-[#F4F4F1] text-zinc-600"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="text-[11.5px] text-zinc-600 bg-[#FAFAF8] border border-[#F0F0EC] px-2.5 py-1.5 rounded-lg">
                  {st.priceHighlight}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <button
                    onClick={() => showToast(`已打开前往「${st.name}」的步行导航`, 'info')}
                    className="py-2 rounded-lg border border-[#E6E6E1] text-zinc-700 text-[12px] font-medium flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#1D6F5A]" />
                    <span>导航</span>
                  </button>
                  {stationType === 'smart_machine' ? (
                    <button
                      onClick={() => setShowScanner(true)}
                      className="py-2 rounded-lg bg-[#1D6F5A] text-white text-[12px] font-semibold flex items-center justify-center gap-1"
                    >
                      <ScanLine className="w-3.5 h-3.5" />
                      <span>扫码投递</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => showToast(`已复制联系电话 ${st.phone ?? '025-84431208'}`, 'info')}
                      className="py-2 rounded-lg bg-[#1D6F5A] text-white text-[12px] font-semibold flex items-center justify-center gap-1"
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

/* ===================== 3. 可回收物上门预约 ===================== */
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
      showToast('请先选择回收地址', 'warning');
      return;
    }
    if (totalWeight <= 0) {
      showToast('请至少选择一种品类和重量', 'warning');
      return;
    }
    const provider = RECYCLABLE_PROVIDERS.find((p) => p.id === providerId)!;
    const summary = Object.entries(weights)
      .map(([id, kg]) => {
        const cat = DAILY_MARKET_PRICES.find((p) => p.id === id);
        return `${cat?.shortName ?? id} ${kg}kg`;
      })
      .join('、');

    createOrder({
      category: 'recyclable',
      categoryLabel: '可回收物上门回收',
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

    showToast('预约已提交，师傅接单后将致电联系', 'success');
    navigate({ name: 'tabs' });
    setActiveTab('orders');
  };

  return (
    <div className="min-h-full bg-[#F4F4F1]">
      <SubPageHeader title="预约上门回收" />

      <div className="p-3.5 space-y-3">
        <div className="rounded-lg bg-[#EDF5F2] border-l-3 border-[#1D6F5A] px-3 py-2 text-[12px] text-zinc-700 leading-relaxed">
          高龄及行动不便居民或大宗旧物可预约上门，建议总重量满 <span className="font-semibold text-zinc-900">5 公斤</span>。
        </div>

        {/* Address */}
        <button
          onClick={() => navigate({ name: 'address_list', selectMode: true })}
          className="w-full bg-white rounded-xl p-3.5 border border-[#E6E6E1] text-left flex items-center justify-between gap-3"
        >
          {currentAddr ? (
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[#EDF5F2] text-[#1D6F5A]">
                  上门地址
                </span>
                <span className="text-[14px] font-semibold text-zinc-900 tabular-nums">
                  {currentAddr.contactName} {currentAddr.phone}
                </span>
              </div>
              <p className="text-[12px] text-zinc-500 mt-1 truncate">
                {currentAddr.region} {currentAddr.community} {currentAddr.detail}
              </p>
            </div>
          ) : (
            <span className="text-[14px] font-medium text-rose-700">* 请选择回收地址</span>
          )}
          <MapPin className="w-4.5 h-4.5 text-[#1D6F5A] shrink-0" />
        </button>

        {/* Service Enterprise */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-2">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-zinc-900">
            <Building2 className="w-4 h-4 text-[#1D6F5A]" />
            <span>选择回收服务队</span>
          </div>
          {RECYCLABLE_PROVIDERS.map((p) => {
            const active = providerId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setProviderId(p.id)}
                className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition ${
                  active ? 'border-[#1D6F5A] bg-[#EDF5F2]/50' : 'border-[#ECECE8] bg-[#FAFAF8]'
                }`}
              >
                <div>
                  <div className="text-[13px] font-semibold text-zinc-900">{p.name}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    评分 {p.rating} · {p.response} · {p.tag}
                  </div>
                </div>
                <div
                  className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                    active ? 'border-[#1D6F5A] bg-[#1D6F5A] text-white' : 'border-zinc-300'
                  }`}
                >
                  {active && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Categories & Weights */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-zinc-900">选择品类与预估重量</span>
            <span
              className={`text-[11.5px] font-semibold px-2 py-0.5 rounded tabular-nums ${
                totalWeight >= 5 ? 'bg-[#EDF5F2] text-[#1D6F5A]' : 'bg-amber-50 text-amber-800'
              }`}
            >
              合计 {totalWeight.toFixed(1)} kg
            </span>
          </div>

          <div className="divide-y divide-[#F0F0EC]">
            {DAILY_MARKET_PRICES.map((item) => {
              const kg = weights[item.id] ?? 0;
              return (
                <div key={item.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F4F4F1] text-zinc-700 flex items-center justify-center">
                      <ItemIcon id={item.id} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-zinc-900">{item.name}</div>
                      <div className="text-[11px] text-zinc-500 tabular-nums">
                        参考 ¥{item.price.toFixed(item.price < 1 ? 2 : 1)}/kg
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateWeight(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-[#F4F4F1] flex items-center justify-center text-zinc-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-[13px] font-semibold text-zinc-900 tabular-nums">
                      {kg}kg
                    </span>
                    <button
                      onClick={() => updateWeight(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-[#1D6F5A] text-white flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalWeight > 0 && totalWeight < 5 && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-2 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>当前不足 5kg，建议攒满后上门或直接投递小区智能回收柜</span>
            </div>
          )}
        </div>

        {/* Time Slot */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1]">
          <div className="text-[13px] font-semibold text-zinc-900 mb-2">期望上门时段</div>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setTimeSlot(slot)}
                className={`py-2 px-2 rounded-lg text-[12px] font-medium border transition ${
                  timeSlot === slot
                    ? 'border-[#1D6F5A] bg-[#EDF5F2] text-[#1D6F5A]'
                    : 'border-[#ECECE8] bg-[#FAFAF8] text-zinc-600'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Cross link */}
        <div className="rounded-xl bg-white border border-[#E6E6E1] px-3.5 py-2.5 flex items-center justify-between gap-2">
          <span className="text-[12px] text-zinc-600">大件旧家具或装修砖渣？</span>
          <button
            onClick={() => navigate({ name: 'bulky_booking' })}
            className="text-[12px] font-semibold text-[#1D6F5A] flex items-center"
          >
            <span>大件清运入口</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Photos & Remarks */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-2.5">
          <div className="text-[13px] font-semibold text-zinc-900">现场照片与备注</div>
          <div className="flex items-center gap-2 flex-wrap">
            {photos.map((src, i) => (
              <div key={i} className="w-15 h-15 rounded-lg overflow-hidden border border-[#E6E6E1]">
                <img src={src} alt="上传照片" className="w-full h-full object-cover" />
              </div>
            ))}
            {photos.length < 4 && (
              <label className="w-15 h-15 rounded-lg border border-dashed border-zinc-300 bg-[#FAFAF8] flex flex-col items-center justify-center text-zinc-400 cursor-pointer">
                <Camera className="w-4.5 h-4.5" />
                <span className="text-[10px] mt-0.5 tabular-nums">{photos.length}/4</span>
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
              placeholder="选填：如需要上楼协助搬运、纸箱较多等情况"
              className="w-full rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] p-2.5 text-[13px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#1D6F5A] resize-none"
            />
            <span className="absolute right-2.5 bottom-2 text-[10.5px] text-zinc-400 tabular-nums">
              {remarks.length}/200
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Checkout Footer */}
      <div className="sticky bottom-0 inset-x-0 bg-white border-t border-[#E6E6E1] px-4 py-3 flex items-center justify-between gap-3 z-30">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-zinc-500">预估收益</span>
            <span className="text-lg font-bold text-[#1D6F5A] tabular-nums">
              ¥{estimatedCash.toFixed(2)}
            </span>
          </div>
          <div className="text-[11px] text-zinc-400 tabular-nums">
            结算预计得 +{estimatedPoints} 积分
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-lg bg-[#1D6F5A] active:bg-[#175C4A] text-white font-semibold text-[14px] transition"
        >
          提交预约
        </button>
      </div>
    </div>
  );
};
