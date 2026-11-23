import React, { useState } from 'react';
import { MapPin, Check, Sparkles, ShieldCheck, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubPageHeader } from '../components/Layout';
import { APPLIANCE_CATALOG, APPLIANCE_PROVIDERS } from '../data/mockData';

export const ApplianceBookingPage: React.FC<{ initialProvider?: string }> = ({
  initialProvider = 'jd',
}) => {
  const { addresses, selectedAddressId, navigate, createOrder, setActiveTab, showToast } = useApp();
  const currentAddr = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];

  const [providerId, setProviderId] = useState(initialProvider);
  const [selectedApplianceId, setSelectedApplianceId] = useState(APPLIANCE_CATALOG[0].id);
  const [condition, setCondition] = useState<'good' | 'minor' | 'broken'>('good');
  const [needUninstall, setNeedUninstall] = useState(true);
  const [timeSlot, setTimeSlot] = useState('明天 10:00-12:00');
  const [remarks, setRemarks] = useState('');

  const provider = APPLIANCE_PROVIDERS.find((p) => p.id === providerId) ?? APPLIANCE_PROVIDERS[0];
  const appliance = APPLIANCE_CATALOG.find((a) => a.id === selectedApplianceId) ?? APPLIANCE_CATALOG[0];

  const conditionFactor = condition === 'good' ? 1.15 : condition === 'minor' ? 0.85 : 0.6;
  const conditionLabel =
    condition === 'good' ? '完好可用' : condition === 'minor' ? '轻微故障/老化' : '无法开机/废旧机';

  const baseValuation = Math.round(appliance.basePrice * conditionFactor);
  const subsidyBonus = provider.id === 'jd' ? Math.round(baseValuation * 0.1) : 15;
  const totalPayout = baseValuation + subsidyBonus;
  const points = provider.id === 'crra' ? 240 : 160;

  const handleSubmit = () => {
    if (!currentAddr) {
      showToast('请先选择上门回收地址', 'warning');
      return;
    }
    createOrder({
      category: 'appliance',
      categoryLabel: '家电回收预约',
      status: 'pending',
      appointmentTime: timeSlot,
      addressText: `${currentAddr.region}${currentAddr.street} ${currentAddr.community} ${currentAddr.detail}`,
      contactName: currentAddr.contactName,
      contactPhone: currentAddr.phone,
      providerName: provider.name,
      itemsSummary: `${appliance.name}（${conditionLabel}）×1`,
      estimatedAmount: totalPayout,
      isFee: false,
      estimatedPoints: points,
      estimatedWeightKg: appliance.weightKg,
      remarks: `${needUninstall ? '需免费上门拆机；' : ''}${remarks.trim()}`.replace(/；$/, '') || undefined,
    });
    showToast(`已成功预约${provider.name}上门回收！预估返现 ¥${totalPayout}`, 'success');
    navigate({ name: 'tabs' });
    setActiveTab('orders');
  };

  return (
    <div className="min-h-full bg-[#F4F8F6] pb-28">
      <SubPageHeader title="家电回收预约" />

      <div className="p-4 space-y-3.5">
        {/* Provider Switcher */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-950/5 space-y-2.5">
          <div className="text-[13px] font-bold text-slate-900">合作家电回收企业</div>
          <div className="grid grid-cols-3 gap-2">
            {APPLIANCE_PROVIDERS.map((p) => {
              const active = p.id === providerId;
              return (
                <button
                  key={p.id}
                  onClick={() => setProviderId(p.id)}
                  className={`p-2.5 rounded-2xl border-2 text-center transition ${
                    active ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-slate-50'
                  }`}
                >
                  <div
                    className="w-9 h-9 mx-auto rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: p.accent }}
                  >
                    {p.name.slice(0, 2)}
                  </div>
                  <div className="text-[12px] font-bold text-slate-900 mt-1.5">{p.name}</div>
                  <div className="text-[10px] text-emerald-700">{p.tag}</div>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {provider.features.map((f) => (
              <span
                key={f}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium inline-flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> {f}
              </span>
            ))}
          </div>
        </div>

        {/* Appliance Grid */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-950/5 space-y-3">
          <div className="text-[13px] font-bold text-slate-900">
            <span className="text-rose-500">*</span> 选择回收家电品类
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {APPLIANCE_CATALOG.map((item) => {
              const active = item.id === selectedApplianceId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedApplianceId(item.id)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    active
                      ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                      : 'border-slate-100 bg-slate-50/70 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[11px] font-bold text-emerald-700 tabular-nums">
                      约¥{item.basePrice}起
                    </span>
                  </div>
                  <div className="text-[13px] font-bold text-slate-900 mt-1.5">{item.name}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{item.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Machine Condition */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-950/5 space-y-3">
          <div className="text-[13px] font-bold text-slate-900">家电当前状态</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'good', label: '完好可用', sub: '估价上浮15%' },
              { id: 'minor', label: '轻微故障', sub: '外观完整' },
              { id: 'broken', label: '无法开机', sub: '正规拆解补贴' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCondition(c.id as typeof condition)}
                className={`p-2.5 rounded-xl border text-center transition ${
                  condition === c.id
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-slate-100 bg-slate-50 text-slate-600'
                }`}
              >
                <div className="text-[12px] font-bold">{c.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{c.sub}</div>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-800">
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>需要工程师免费拆机搬运</span>
            </div>
            <button
              onClick={() => setNeedUninstall((v) => !v)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                needUninstall ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  needUninstall ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Live Valuation Breakdown */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-4 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-emerald-100">智能即时估价（含绿色补贴）</div>
              <div className="text-3xl font-black tabular-nums mt-1">¥ {totalPayout}</div>
            </div>
            <div className="text-right text-[11px] space-y-1 text-emerald-100">
              <div>基础回收价：¥{baseValuation}</div>
              <div>环保加价补贴：+¥{subsidyBonus}</div>
              <div className="text-amber-300 font-bold">同步奖励 +{points} 积分</div>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center gap-1.5 text-[11px] text-emerald-50">
            <ShieldCheck className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>当面质检 · 即时打款至微信/银行卡 · 正规无害化绿色拆解</span>
          </div>
        </div>

        {/* Address & Time */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-950/5 space-y-3">
          <button
            onClick={() => navigate({ name: 'address_list', selectMode: true })}
            className="w-full flex items-center justify-between text-left pb-3 border-b border-slate-100"
          >
            {currentAddr ? (
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-slate-900">
                  {currentAddr.contactName} {currentAddr.phone}
                </div>
                <div className="text-[12px] text-slate-500 truncate mt-0.5">
                  {currentAddr.region} {currentAddr.community} {currentAddr.detail}
                </div>
              </div>
            ) : (
              <span className="text-rose-600 font-semibold text-[13px]">* 请选择上门地址</span>
            )}
            <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
          </button>

          <div>
            <div className="text-[12px] font-semibold text-slate-600 mb-2">预约上门时段</div>
            <div className="grid grid-cols-2 gap-2">
              {['明天 10:00-12:00', '明天 14:00-16:00', '后天 10:00-12:00', '周末上午'].map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 rounded-xl text-[12px] font-semibold border transition ${
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

          <input
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="选填：如空调外机位置、品牌型号等备注"
            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-[13px]"
          />
        </div>
      </div>

      {/* Bottom Sticky Submit */}
      <div className="sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 flex items-center justify-between gap-3 z-30">
        <div>
          <div className="text-[11px] text-slate-500">预计到手回收款</div>
          <div className="text-xl font-extrabold text-emerald-600 tabular-nums">
            ¥{totalPayout}
            <span className="text-[11px] font-medium text-amber-600 ml-1.5">+{points}分</span>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-[14px] shadow-lg shadow-emerald-600/25 flex items-center gap-1 active:scale-95 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>免费上门回收</span>
        </button>
      </div>
    </div>
  );
};
