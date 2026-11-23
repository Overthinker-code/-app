import React, { useState } from 'react';
import {
  CalendarPlus,
  ClipboardList,
  Building2,
  Search,
  Star,
  Phone,
  MapPin,
  Check,
  X,
  ChevronRight,
  ShieldCheck,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubPageHeader } from '../components/Layout';
import { BEIJING_COMMUNITIES, DISPOSAL_UNITS, KNOWLEDGE_ARTICLES } from '../data/mockData';
import type { DisposalUnit, KnowledgeArticle } from '../types';

/* ===================== 1. 装修垃圾清运统一中心页（彻底重塑原割裂H5页） ===================== */
export const RenovationHubPage: React.FC = () => {
  const { user, navigate, setActiveTab } = useApp();
  const [articleTab, setArticleTab] = useState<'policy' | 'guide' | 'activity'>('policy');
  const [readingArticle, setReadingArticle] = useState<KnowledgeArticle | null>(null);

  const filteredArticles = KNOWLEDGE_ARTICLES.filter((a) => a.tab === articleTab);

  return (
    <div className="min-h-full bg-[#F4F8F6] pb-8">
      <SubPageHeader title="装修垃圾清运服务" />

      <div className="p-4 space-y-4">
        {/* Top Resident Eco Card */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-slate-800 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/images/eco-avatar.jpg"
                alt="用户"
                className="w-12 h-12 rounded-2xl object-cover bg-white ring-2 ring-white/30"
              />
              <div>
                <div className="text-[15px] font-bold">{user.nickname}</div>
                <div className="text-[11px] text-emerald-100 mt-0.5">
                  居民用户 · {user.community}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-emerald-200">环保积分</div>
              <div className="text-xl font-extrabold text-amber-300 tabular-nums">{user.points}</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              全市正规持证建筑垃圾处置场直连
            </span>
            <span>电子联单可查</span>
          </div>
        </div>

        {/* 3 Core Action Tiles */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-950/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h2 className="text-[15px] font-bold text-slate-900">装修垃圾清运</h2>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => navigate({ name: 'renovation_booking' })}
              className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-3.5 flex flex-col items-center text-center gap-2 active:scale-95 transition"
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <span className="text-[13px] font-bold text-slate-900">去预约</span>
            </button>

            <button
              onClick={() => {
                navigate({ name: 'tabs' });
                setActiveTab('orders');
              }}
              className="rounded-2xl bg-sky-50/70 border border-sky-100 p-3.5 flex flex-col items-center text-center gap-2 active:scale-95 transition"
            >
              <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="text-[13px] font-bold text-slate-900">我的订单</span>
            </button>

            <button
              onClick={() => navigate({ name: 'renovation_units' })}
              className="rounded-2xl bg-amber-50/70 border border-amber-100 p-3.5 flex flex-col items-center text-center gap-2 active:scale-95 transition"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-bold text-slate-900 leading-tight">收运处服务单位</span>
            </button>
          </div>
        </div>

        {/* Policy / Guide / Activity Knowledge Center */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-950/5">
          <div className="text-center mb-3">
            <span className="text-[14px] font-extrabold text-slate-800 tracking-wide">
              垃圾分类 · 我们一起来
            </span>
          </div>

          <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-100 mb-3.5">
            {[
              { id: 'policy', label: '政策法规' },
              { id: 'guide', label: '投放指南' },
              { id: 'activity', label: '活动信息' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setArticleTab(t.id as typeof articleTab)}
                className={`py-2 rounded-xl text-[12px] font-bold transition ${
                  articleTab === t.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filteredArticles.map((art) => (
              <button
                key={art.id}
                onClick={() => setReadingArticle(art)}
                className="w-full p-3.5 rounded-2xl bg-[#F8FBF9] border border-emerald-100/80 text-left hover:border-emerald-300 transition active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[14px] font-bold text-slate-900 leading-snug">{art.title}</h3>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                </div>
                <p className="text-[12px] text-slate-500 mt-1.5 line-clamp-2">{art.summary}</p>
                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                    {art.source}
                  </span>
                  <span className="text-slate-400 tabular-nums">{art.date}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Article Reader Modal */}
      {readingArticle && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[2px] flex items-end sm:items-center justify-center animate-fade-in"
          onClick={() => setReadingArticle(null)}
        >
          <div
            className="w-full max-w-[430px] max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-700 text-[13px] font-bold">
                <FileText className="w-4 h-4" />
                <span>{readingArticle.tag}</span>
              </div>
              <button
                onClick={() => setReadingArticle(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-3">
              <h3 className="text-[17px] font-extrabold text-slate-900 leading-snug">
                {readingArticle.title}
              </h3>
              <div className="text-[11px] text-slate-400">
                来源：{readingArticle.source} · 发布日期：{readingArticle.date}
              </div>
              <div className="pt-2 space-y-3 text-[13.5px] leading-relaxed text-slate-700">
                {readingArticle.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===================== 2. 装修垃圾预约 2步向导 ===================== */
export const RenovationBookingPage: React.FC = () => {
  const { user, addresses, selectedAddressId, navigate, createOrder, setActiveTab, showToast } = useApp();
  const currentAddr = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];

  const [step, setStep] = useState<1 | 2>(1);
  const [district, setDistrict] = useState('朝阳区');
  const [street, setStreet] = useState(currentAddr?.street ?? '酒仙桥街道');
  const [community, setCommunity] = useState(currentAddr?.community ?? user.community);
  const [date, setDate] = useState('2026-11-26');
  const [unitType, setUnitType] = useState<'bag' | 'cubic'>('bag');
  const [amount, setAmount] = useState<number>(25);
  const [selectedUnitId, setSelectedUnitId] = useState(DISPOSAL_UNITS[2].id);
  const [remarks, setRemarks] = useState('');

  const selectedUnit = DISPOSAL_UNITS.find((u) => u.id === selectedUnitId) ?? DISPOSAL_UNITS[0];
  const calcFee = (u: DisposalUnit) => {
    const raw = unitType === 'bag' ? amount * u.pricing.perBag : amount * u.pricing.perCubicMeter;
    return Math.max(u.pricing.minCharge, Math.round(raw));
  };

  const handleConfirm = () => {
    const fee = calcFee(selectedUnit);
    createOrder({
      category: 'renovation',
      categoryLabel: '装修垃圾预约清运',
      status: 'pending',
      appointmentTime: `${date} 上午`,
      addressText: `北京市${district}${street} ${community} ${currentAddr?.detail ?? ''}`,
      contactName: currentAddr?.contactName ?? user.nickname,
      contactPhone: currentAddr?.phone ?? user.phone,
      providerName: selectedUnit.name,
      itemsSummary: `装修垃圾约 ${amount} ${unitType === 'bag' ? '袋（90×120cm）' : '立方米(m³)'}`,
      estimatedAmount: fee,
      isFee: true,
      estimatedPoints: 120,
      estimatedWeightKg: unitType === 'bag' ? amount * 15 : amount * 800,
      remarks: remarks.trim() || undefined,
    });
    showToast('装修垃圾清运预约成功！正规电子联单已生成', 'success');
    navigate({ name: 'tabs' });
    setActiveTab('orders');
  };

  return (
    <div className="min-h-full bg-[#F4F8F6] pb-28">
      <SubPageHeader title="装修垃圾预约" />

      <div className="p-4 space-y-4">
        {/* 2-Step Indicator */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 flex items-center justify-around">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[12px] font-bold flex items-center justify-center">
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-[12px] font-bold text-slate-900 mt-1">选择小区与清运量</span>
          </div>
          <div className={`h-0.5 w-16 rounded-full ${step === 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
          <div className="flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center ${
                step === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              2
            </div>
            <span className={`text-[12px] font-bold mt-1 ${step === 2 ? 'text-slate-900' : 'text-slate-400'}`}>
              选择正规处置场
            </span>
          </div>
        </div>

        {step === 1 ? (
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-950/5 space-y-4">
            {/* Quick Community Presets */}
            <div>
              <label className="text-[12px] font-bold text-slate-700 block mb-2">
                <span className="text-rose-500">*</span> 选择所在区域与小区
              </label>
              <div className="grid grid-cols-2 gap-2 mb-2.5">
                {BEIJING_COMMUNITIES.slice(0, 4).map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setDistrict(c.district);
                      setStreet(c.street);
                      setCommunity(c.name);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      community === c.name
                        ? 'border-emerald-500 bg-emerald-50/70'
                        : 'border-slate-100 bg-slate-50'
                    }`}
                  >
                    <div className="text-[12px] font-bold text-slate-900">{c.name}</div>
                    <div className="text-[10px] text-slate-500">{c.district} · {c.street}</div>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="所属区域"
                  className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-[13px]"
                />
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="所属街道"
                  className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-[13px]"
                />
              </div>
              <input
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                placeholder="手动输入或修改小区名称"
                className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-[13px]"
              />
            </div>

            {/* Date */}
            <div>
              <label className="text-[12px] font-bold text-slate-700 block mb-1.5">
                <span className="text-rose-500">*</span> 预约清运日期
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-[13px] font-medium"
              />
            </div>

            {/* Estimated Volume */}
            <div>
              <label className="text-[12px] font-bold text-slate-700 block mb-1.5">
                <span className="text-rose-500">*</span> 预估清运量
              </label>
              <div className="flex gap-2 mb-2.5">
                <button
                  onClick={() => {
                    setUnitType('bag');
                    setAmount(25);
                  }}
                  className={`flex-1 py-2 rounded-xl text-[12px] font-bold border transition ${
                    unitType === 'bag'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  按标准袋（90×120cm）
                </button>
                <button
                  onClick={() => {
                    setUnitType('cubic');
                    setAmount(2);
                  }}
                  className={`flex-1 py-2 rounded-xl text-[12px] font-bold border transition ${
                    unitType === 'cubic'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  按体积（立方米 m³）
                </button>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5">
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 1))}
                  className="flex-1 bg-transparent text-[16px] font-bold text-slate-900 focus:outline-none tabular-nums"
                />
                <span className="text-[13px] font-semibold text-slate-500">
                  {unitType === 'bag' ? '袋' : 'm³'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {unitType === 'bag'
                  ? '提示：1标准袋约装七分满（约15kg），一般两居室局改约20-40袋'
                  : '提示：1立方米约合20标准编织袋'}
              </p>
            </div>

            <div>
              <label className="text-[12px] font-bold text-slate-700 block mb-1.5">备注说明</label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="例如：已堆放至小区东门装修垃圾暂存点"
                className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-[13px] resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200/70 px-3.5 py-2.5 text-[12px] text-emerald-900">
              已按您的地址（{district} · {community}）及预估量（{amount}{unitType === 'bag' ? '袋' : 'm³'}）匹配正规持证处置场：
            </div>

            {DISPOSAL_UNITS.map((u) => {
              const active = selectedUnitId === u.id;
              const fee = calcFee(u);
              return (
                <button
                  key={u.id}
                  onClick={() => setSelectedUnitId(u.id)}
                  className={`w-full bg-white rounded-2xl p-4 border-2 text-left transition ${
                    active ? 'border-emerald-500 shadow-md' : 'border-transparent shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-[14px] text-slate-900 leading-snug">{u.name}</div>
                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      信用 {u.creditGrade}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{u.district}</span>
                    <span>距您 {u.distanceKm}km</span>
                    <span className="text-amber-600 font-semibold">★ {u.rating}</span>
                    <span>已服务 {u.orderCount} 单</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">{u.pricing.note}</p>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      参考单价：¥{u.pricing.perBag}/袋 · ¥{u.pricing.perCubicMeter}/m³
                    </span>
                    <span className="text-[16px] font-extrabold text-emerald-700 tabular-nums">
                      估价 ¥{fee}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 grid grid-cols-2 gap-3 z-30">
        {step === 1 ? (
          <>
            <button
              onClick={() => navigate({ name: 'renovation_hub' })}
              className="py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-[14px]"
            >
              取消
            </button>
            <button
              onClick={() => setStep(2)}
              className="py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-[14px] shadow-md"
            >
              下一步：选处置场
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setStep(1)}
              className="py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-[14px]"
            >
              上一步
            </button>
            <button
              onClick={handleConfirm}
              className="py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-[14px] shadow-md flex items-center justify-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>确认预约 ¥{calcFee(selectedUnit)}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ===================== 3. 收运处服务单位名录 ===================== */
export const RenovationUnitsPage: React.FC = () => {
  const { showToast, navigate } = useApp();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'orders' | 'distance' | 'rating'>('orders');
  const [pricingModal, setPricingModal] = useState<DisposalUnit | null>(null);

  const units = DISPOSAL_UNITS.filter(
    (u) => u.name.includes(query) || u.district.includes(query) || u.address.includes(query)
  ).sort((a, b) => {
    if (sortBy === 'orders') return b.orderCount - a.orderCount;
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    return b.rating - a.rating;
  });

  return (
    <div className="min-h-full bg-[#F4F8F6] pb-8">
      <SubPageHeader title="收运处服务单位" />

      <div className="sticky top-13 z-20 bg-white border-b border-slate-100 px-4 pt-3 pb-2 space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="请输入处置场所名称或区域（如朝阳/昌平）"
            className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-100 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div className="grid grid-cols-3 text-center text-[12px]">
          {[
            { id: 'orders', label: '按照订单量推荐' },
            { id: 'distance', label: '按照距离推荐' },
            { id: 'rating', label: '按照评分推荐' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id as typeof sortBy)}
              className={`pb-2 border-b-2 font-semibold transition ${
                sortBy === s.id
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {units.map((u) => (
          <div key={u.id} className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 space-y-2.5">
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
              <h3 className="text-[14px] font-bold text-slate-900 leading-snug">{u.name}</h3>
              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                {u.creditGrade}级信用
              </span>
            </div>
            <div className="space-y-1.5 text-[12px]">
              <div className="flex gap-3">
                <span className="text-slate-400 w-16 shrink-0">所属区域</span>
                <span className="text-slate-800 font-medium">{u.district}（距您 {u.distanceKm}km）</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-400 w-16 shrink-0">处置地址</span>
                <span className="text-slate-700 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  {u.address}
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-400 w-16 shrink-0">负责人</span>
                <span className="text-slate-800">{u.manager}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-400 w-16 shrink-0">联系方式</span>
                <button
                  onClick={() => showToast(`已复制联系电话：${u.phone}`, 'info')}
                  className="text-emerald-700 font-semibold inline-flex items-center gap-1 tabular-nums"
                >
                  <Phone className="w-3 h-3" /> {u.phone}
                </button>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-400 w-16 shrink-0">用户评价</span>
                <span className="text-amber-600 font-bold inline-flex items-center gap-1 tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {u.rating} 分（已服务 {u.orderCount} 单）
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setPricingModal(u)}
                className="px-4 py-1.5 rounded-full border border-emerald-600 text-emerald-700 text-[12px] font-semibold active:scale-95 transition"
              >
                查看收费标准
              </button>
              <button
                onClick={() => navigate({ name: 'renovation_booking' })}
                className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-[12px] font-semibold active:scale-95 transition"
              >
                立即预约
              </button>
            </div>
          </div>
        ))}
      </div>

      {pricingModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPricingModal(null)}
        >
          <div
            className="w-full max-w-[360px] bg-white rounded-3xl p-5 shadow-2xl animate-slide-up space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] font-bold text-slate-900">{pricingModal.name}</h3>
              <button
                onClick={() => setPricingModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                <div className="text-[11px] text-emerald-700">按标准袋清运</div>
                <div className="text-xl font-extrabold text-emerald-700 tabular-nums mt-0.5">
                  ¥{pricingModal.pricing.perBag}
                  <span className="text-[11px] font-normal">/袋</span>
                </div>
              </div>
              <div className="rounded-2xl bg-sky-50 p-3 text-center">
                <div className="text-[11px] text-sky-700">按体积清运</div>
                <div className="text-xl font-extrabold text-sky-700 tabular-nums mt-0.5">
                  ¥{pricingModal.pricing.perCubicMeter}
                  <span className="text-[11px] font-normal">/m³</span>
                </div>
              </div>
            </div>
            <div className="text-[12px] text-slate-600 bg-slate-50 rounded-xl p-3 leading-relaxed">
              <div>最低起步价：<span className="font-bold text-slate-900">¥{pricingModal.pricing.minCharge}</span></div>
              <div className="mt-1">{pricingModal.pricing.note}</div>
            </div>
            <button
              onClick={() => {
                setPricingModal(null);
                navigate({ name: 'renovation_booking' });
              }}
              className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold text-[13px]"
            >
              预约此处置场
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
