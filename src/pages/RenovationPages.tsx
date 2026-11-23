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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubPageHeader } from '../components/Layout';
import { DISPOSAL_UNITS, KNOWLEDGE_ARTICLES, NANJING_COMMUNITIES } from '../data/mockData';
import type { DisposalUnit, KnowledgeArticle } from '../types';

/* ===================== 1. 装修垃圾清运中心 ===================== */
export const RenovationHubPage: React.FC = () => {
  const { user, navigate, setActiveTab } = useApp();
  const [articleTab, setArticleTab] = useState<'policy' | 'guide' | 'activity'>('policy');
  const [readingArticle, setReadingArticle] = useState<KnowledgeArticle | null>(null);

  const filteredArticles = KNOWLEDGE_ARTICLES.filter((a) => a.tab === articleTab);

  return (
    <div className="min-h-full bg-[#F4F4F1] pb-8">
      <SubPageHeader title="装修垃圾清运" />

      <div className="p-3.5 space-y-3">
        {/* Resident Status Banner */}
        <div className="rounded-xl bg-[#263238] p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[15px] font-semibold">{user.nickname}</div>
              <div className="text-[11.5px] text-zinc-300 mt-0.5">
                南京市{user.district} · {user.community}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10.5px] text-zinc-400">可用积分</div>
              <div className="text-lg font-bold tabular-nums">{user.points}</div>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-300">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              南京市城管部门备案清运单位直连
            </span>
            <span>一车一电子联单</span>
          </div>
        </div>

        {/* 3 Action Tiles */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1]">
          <div className="text-[13px] font-semibold text-zinc-900 mb-2.5">清运服务办理</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => navigate({ name: 'renovation_booking' })}
              className="rounded-lg bg-[#EDF5F2] border border-[#D4E6DF] p-3 flex flex-col items-center text-center gap-1.5"
            >
              <CalendarPlus className="w-5 h-5 text-[#1D6F5A]" />
              <span className="text-[12.5px] font-semibold text-zinc-900">预约清运</span>
            </button>

            <button
              onClick={() => {
                navigate({ name: 'tabs' });
                setActiveTab('orders');
              }}
              className="rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] p-3 flex flex-col items-center text-center gap-1.5"
            >
              <ClipboardList className="w-5 h-5 text-zinc-700" />
              <span className="text-[12.5px] font-semibold text-zinc-900">清运订单</span>
            </button>

            <button
              onClick={() => navigate({ name: 'renovation_units' })}
              className="rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] p-3 flex flex-col items-center text-center gap-1.5"
            >
              <Building2 className="w-5 h-5 text-zinc-700" />
              <span className="text-[12.5px] font-semibold text-zinc-900">备案单位</span>
            </button>
          </div>
        </div>

        {/* Policy / Guide / Activity */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1]">
          <div className="grid grid-cols-3 p-1 rounded-lg bg-[#F4F4F1] mb-3">
            {[
              { id: 'policy', label: '政策法规' },
              { id: 'guide', label: '投放指南' },
              { id: 'activity', label: '社区通知' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setArticleTab(t.id as typeof articleTab)}
                className={`py-1.5 rounded-md text-[12px] font-semibold transition ${
                  articleTab === t.id ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="divide-y divide-[#F0F0EC]">
            {filteredArticles.map((art) => (
              <button
                key={art.id}
                onClick={() => setReadingArticle(art)}
                className="w-full py-3 first:pt-1 last:pb-1 text-left flex items-start justify-between gap-2.5"
              >
                <div className="min-w-0">
                  <h3 className="text-[13.5px] font-semibold text-zinc-900 leading-snug">{art.title}</h3>
                  <p className="text-[12px] text-zinc-500 mt-1 line-clamp-2">{art.summary}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-zinc-400">
                    <span>{art.source}</span>
                    <span>·</span>
                    <span className="tabular-nums">{art.date}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Article Reader */}
      {readingArticle && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center animate-fade-in"
          onClick={() => setReadingArticle(null)}
        >
          <div
            className="w-full max-w-[414px] max-h-[84vh] bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3.5 border-b border-[#E6E6E1] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#1D6F5A] text-[13px] font-semibold">
                <FileText className="w-4 h-4" />
                <span>{readingArticle.tag}</span>
              </div>
              <button
                onClick={() => setReadingArticle(null)}
                className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-3">
              <h3 className="text-[16px] font-bold text-zinc-900 leading-snug">{readingArticle.title}</h3>
              <div className="text-[11px] text-zinc-400">
                {readingArticle.source} · {readingArticle.date}
              </div>
              <div className="pt-1 space-y-2.5 text-[13px] leading-relaxed text-zinc-700">
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
  const [district, setDistrict] = useState(user.district || '玄武区');
  const [street, setStreet] = useState(currentAddr?.street ?? '孝陵卫街道');
  const [community, setCommunity] = useState(currentAddr?.community ?? user.community);
  const [date, setDate] = useState('2026-11-26');
  const [unitType, setUnitType] = useState<'bag' | 'cubic'>('bag');
  const [amount, setAmount] = useState<number>(25);
  const [selectedUnitId, setSelectedUnitId] = useState(DISPOSAL_UNITS[0].id);
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
      categoryLabel: '装修垃圾清运',
      status: 'pending',
      appointmentTime: `${date} 上午`,
      addressText: `南京市${district}${street} ${community} ${currentAddr?.detail ?? ''}`,
      contactName: currentAddr?.contactName ?? user.nickname,
      contactPhone: currentAddr?.phone ?? user.phone,
      providerName: selectedUnit.name,
      itemsSummary: `装修垃圾约 ${amount} ${unitType === 'bag' ? '袋（90×120cm）' : '立方米(m³)'}`,
      estimatedAmount: fee,
      isFee: true,
      estimatedPoints: 100,
      estimatedWeightKg: unitType === 'bag' ? amount * 15 : amount * 800,
      remarks: remarks.trim() || undefined,
    });
    showToast('清运预约已提交，电子联单已生成', 'success');
    navigate({ name: 'tabs' });
    setActiveTab('orders');
  };

  return (
    <div className="min-h-full bg-[#F4F4F1]">
      <SubPageHeader title="装修垃圾预约" />

      <div className="p-3.5 space-y-3">
        {/* Step Bar */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] flex items-center justify-around">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1D6F5A] text-white text-[11px] font-bold flex items-center justify-center">
              {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
            </span>
            <span className="text-[12.5px] font-semibold text-zinc-900">小区与清运量</span>
          </div>
          <div className={`h-[1.5px] w-10 ${step === 2 ? 'bg-[#1D6F5A]' : 'bg-zinc-200'}`} />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                step === 2 ? 'bg-[#1D6F5A] text-white' : 'bg-zinc-200 text-zinc-500'
              }`}
            >
              2
            </span>
            <span className={`text-[12.5px] font-semibold ${step === 2 ? 'text-zinc-900' : 'text-zinc-400'}`}>
              选择备案处置场
            </span>
          </div>
        </div>

        {step === 1 ? (
          <div className="bg-white rounded-xl p-4 border border-[#E6E6E1] space-y-3.5">
            <div>
              <label className="text-[12px] font-semibold text-zinc-700 block mb-2">
                南京所在区与小区
              </label>
              <div className="grid grid-cols-2 gap-2 mb-2.5">
                {NANJING_COMMUNITIES.slice(0, 4).map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setDistrict(c.district);
                      setStreet(c.street);
                      setCommunity(c.name);
                    }}
                    className={`p-2 rounded-lg border text-left transition ${
                      community === c.name
                        ? 'border-[#1D6F5A] bg-[#EDF5F2]/60'
                        : 'border-[#ECECE8] bg-[#FAFAF8]'
                    }`}
                  >
                    <div className="text-[12.5px] font-semibold text-zinc-900">{c.name}</div>
                    <div className="text-[10.5px] text-zinc-500">{c.district} · {c.street}</div>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="行政区"
                  className="rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] px-3 py-2 text-[13px]"
                />
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="街道"
                  className="rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] px-3 py-2 text-[13px]"
                />
              </div>
              <input
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                placeholder="小区名称"
                className="mt-2 w-full rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] px-3 py-2 text-[13px]"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-zinc-700 block mb-1.5">预约清运日期</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] px-3 py-2 text-[13px]"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-zinc-700 block mb-1.5">预估清运量</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => {
                    setUnitType('bag');
                    setAmount(25);
                  }}
                  className={`py-2 rounded-lg text-[12px] font-medium border ${
                    unitType === 'bag'
                      ? 'border-[#1D6F5A] bg-[#EDF5F2] text-[#1D6F5A]'
                      : 'border-[#E6E6E1] text-zinc-600'
                  }`}
                >
                  按标准袋（90×120cm）
                </button>
                <button
                  onClick={() => {
                    setUnitType('cubic');
                    setAmount(2);
                  }}
                  className={`py-2 rounded-lg text-[12px] font-medium border ${
                    unitType === 'cubic'
                      ? 'border-[#1D6F5A] bg-[#EDF5F2] text-[#1D6F5A]'
                      : 'border-[#E6E6E1] text-zinc-600'
                  }`}
                >
                  按方数（立方米 m³）
                </button>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] px-3 py-2">
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 1))}
                  className="flex-1 bg-transparent text-[15px] font-bold text-zinc-900 focus:outline-none tabular-nums"
                />
                <span className="text-[13px] text-zinc-500">{unitType === 'bag' ? '袋' : 'm³'}</span>
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-zinc-700 block mb-1.5">备注</label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="例如：已装袋堆放至西门装修垃圾暂存点"
                className="w-full rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] p-2.5 text-[13px] resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="rounded-lg bg-[#EDF5F2] px-3 py-2 text-[12px] text-zinc-700">
              {district} · {community} · 预估 {amount}{unitType === 'bag' ? '袋' : 'm³'} — 请选择备案处置单位：
            </div>

            {DISPOSAL_UNITS.map((u) => {
              const active = selectedUnitId === u.id;
              const fee = calcFee(u);
              return (
                <button
                  key={u.id}
                  onClick={() => setSelectedUnitId(u.id)}
                  className={`w-full bg-white rounded-xl p-3.5 border text-left transition ${
                    active ? 'border-[#1D6F5A] ring-1 ring-[#1D6F5A]' : 'border-[#E6E6E1]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-[13.5px] text-zinc-900 leading-snug">{u.name}</div>
                    <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#EDF5F2] text-[#1D6F5A]">
                      {u.creditGrade}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1 tabular-nums">
                    {u.licenseNo} · 距您 {u.distanceKm}km · 评分 {u.rating}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">{u.pricing.note}</p>
                  <div className="mt-2.5 pt-2 border-t border-[#F0F0EC] flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 tabular-nums">
                      ¥{u.pricing.perBag}/袋 · ¥{u.pricing.perCubicMeter}/m³
                    </span>
                    <span className="text-[15px] font-bold text-[#1D6F5A] tabular-nums">
                      参考 ¥{fee}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="sticky bottom-0 inset-x-0 bg-white border-t border-[#E6E6E1] px-4 py-3 grid grid-cols-2 gap-2.5 z-30">
        {step === 1 ? (
          <>
            <button
              onClick={() => navigate({ name: 'renovation_hub' })}
              className="py-2.5 rounded-lg border border-[#E6E6E1] text-zinc-600 font-medium text-[13.5px]"
            >
              取消
            </button>
            <button
              onClick={() => setStep(2)}
              className="py-2.5 rounded-lg bg-[#1D6F5A] text-white font-semibold text-[13.5px]"
            >
              下一步：选处置场
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setStep(1)}
              className="py-2.5 rounded-lg border border-[#E6E6E1] text-zinc-600 font-medium text-[13.5px]"
            >
              上一步
            </button>
            <button
              onClick={handleConfirm}
              className="py-2.5 rounded-lg bg-[#1D6F5A] text-white font-semibold text-[13.5px] tabular-nums"
            >
              确认预约 ¥{calcFee(selectedUnit)}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ===================== 3. 南京备案清运处置单位名录 ===================== */
export const RenovationUnitsPage: React.FC = () => {
  const { showToast, navigate } = useApp();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'orders' | 'distance' | 'rating'>('distance');
  const [pricingModal, setPricingModal] = useState<DisposalUnit | null>(null);

  const units = DISPOSAL_UNITS.filter(
    (u) => u.name.includes(query) || u.district.includes(query) || u.address.includes(query)
  ).sort((a, b) => {
    if (sortBy === 'orders') return b.orderCount - a.orderCount;
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    return b.rating - a.rating;
  });

  return (
    <div className="min-h-full bg-[#F4F4F1] pb-8">
      <SubPageHeader title="备案收运处服务单位" />

      <div className="sticky top-12 z-20 bg-white border-b border-[#E6E6E1] px-3.5 pt-2.5 pb-1.5 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索处置单位名称或南京行政区（玄武/建邺/江北）"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F4F4F1] text-[12.5px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-3 text-center text-[12px]">
          {[
            { id: 'distance', label: '按距离优先' },
            { id: 'orders', label: '按订单量' },
            { id: 'rating', label: '按评价分' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id as typeof sortBy)}
              className={`pb-1.5 border-b-2 font-medium transition ${
                sortBy === s.id
                  ? 'border-[#1D6F5A] text-zinc-900 font-semibold'
                  : 'border-transparent text-zinc-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3.5 space-y-2.5">
        {units.map((u) => (
          <div key={u.id} className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-2">
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#F0F0EC]">
              <div>
                <h3 className="text-[14px] font-semibold text-zinc-900 leading-snug">{u.name}</h3>
                <div className="text-[11px] text-zinc-400 mt-0.5 tabular-nums">{u.licenseNo}</div>
              </div>
              <span className="shrink-0 text-[10.5px] font-semibold px-1.5 py-0.5 rounded bg-[#EDF5F2] text-[#1D6F5A]">
                {u.creditGrade}级
              </span>
            </div>
            <div className="space-y-1 text-[12px]">
              <div className="flex gap-3">
                <span className="text-zinc-400 w-14 shrink-0">所在区</span>
                <span className="text-zinc-800">{u.district}（距您 {u.distanceKm}km）</span>
              </div>
              <div className="flex gap-3">
                <span className="text-zinc-400 w-14 shrink-0">地址</span>
                <span className="text-zinc-600 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                  {u.address}
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-zinc-400 w-14 shrink-0">负责人</span>
                <span className="text-zinc-800">{u.manager}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-zinc-400 w-14 shrink-0">电话</span>
                <button
                  onClick={() => showToast(`已复制电话 ${u.phone}`, 'info')}
                  className="text-[#1D6F5A] font-medium inline-flex items-center gap-1 tabular-nums"
                >
                  <Phone className="w-3 h-3" /> {u.phone}
                </button>
              </div>
              <div className="flex gap-3">
                <span className="text-zinc-400 w-14 shrink-0">口碑</span>
                <span className="text-amber-700 font-semibold inline-flex items-center gap-1 tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {u.rating} 分（已服务 {u.orderCount} 单）
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setPricingModal(u)}
                className="px-3.5 py-1.5 rounded-lg border border-[#E6E6E1] text-zinc-700 text-[12px] font-medium"
              >
                收费标准
              </button>
              <button
                onClick={() => navigate({ name: 'renovation_booking' })}
                className="px-3.5 py-1.5 rounded-lg bg-[#1D6F5A] text-white text-[12px] font-semibold"
              >
                去预约
              </button>
            </div>
          </div>
        ))}
      </div>

      {pricingModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPricingModal(null)}
        >
          <div
            className="w-full max-w-[350px] bg-white rounded-2xl p-4 shadow-2xl animate-slide-up space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[14.5px] font-semibold text-zinc-900">{pricingModal.name}</h3>
              <button
                onClick={() => setPricingModal(null)}
                className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-[#EDF5F2] p-3 text-center">
                <div className="text-[11px] text-zinc-600">按标准袋</div>
                <div className="text-lg font-bold text-[#1D6F5A] tabular-nums mt-0.5">
                  ¥{pricingModal.pricing.perBag}<span className="text-[11px] font-normal">/袋</span>
                </div>
              </div>
              <div className="rounded-lg bg-[#F4F4F1] p-3 text-center">
                <div className="text-[11px] text-zinc-600">按体积计费</div>
                <div className="text-lg font-bold text-zinc-900 tabular-nums mt-0.5">
                  ¥{pricingModal.pricing.perCubicMeter}<span className="text-[11px] font-normal">/m³</span>
                </div>
              </div>
            </div>
            <div className="text-[12px] text-zinc-600 bg-[#FAFAF8] border border-[#E6E6E1] rounded-lg p-3 leading-relaxed">
              <div>起步价：<span className="font-semibold text-zinc-900">¥{pricingModal.pricing.minCharge}</span></div>
              <div className="mt-1">{pricingModal.pricing.note}</div>
            </div>
            <button
              onClick={() => {
                setPricingModal(null);
                navigate({ name: 'renovation_booking' });
              }}
              className="w-full py-2.5 rounded-lg bg-[#1D6F5A] text-white font-semibold text-[13px]"
            >
              选择该单位预约
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
