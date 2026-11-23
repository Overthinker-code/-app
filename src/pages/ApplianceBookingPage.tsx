import React, { useState } from 'react';
import { MapPin, Check, ShieldCheck, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubPageHeader } from '../components/Layout';
import { APPLIANCE_CATALOG, APPLIANCE_PROVIDERS } from '../data/mockData';
import { ItemIcon } from '../components/NanjingVisuals';

export const ApplianceBookingPage: React.FC<{ initialProvider?: string }> = ({
  initialProvider = 'suning',
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
    condition === 'good' ? '完好可用' : condition === 'minor' ? '轻微故障' : '无法开机';

  const baseValuation = Math.round(appliance.basePrice * conditionFactor);
  const subsidyBonus = provider.id === 'jd' ? Math.round(baseValuation * 0.1) : 15;
  const totalPayout = baseValuation + subsidyBonus;
  const points = provider.id === 'crra' ? 220 : 150;

  const handleSubmit = () => {
    if (!currentAddr) {
      showToast('请先选择上门地址', 'warning');
      return;
    }
    createOrder({
      category: 'appliance',
      categoryLabel: '废旧家电回收',
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
      remarks: `${needUninstall ? '需上门拆机；' : ''}${remarks.trim()}`.replace(/；$/, '') || undefined,
    });
    showToast(`已预约${provider.name}，参考估价 ¥${totalPayout}`, 'success');
    navigate({ name: 'tabs' });
    setActiveTab('orders');
  };

  return (
    <div className="min-h-full bg-[#F4F4F1]">
      <SubPageHeader title="废旧家电回收" />

      <div className="p-3.5 space-y-3">
        {/* Provider Selector */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-2.5">
          <div className="text-[13px] font-semibold text-zinc-900">南京合作家电回收商</div>
          <div className="grid grid-cols-3 gap-2">
            {APPLIANCE_PROVIDERS.map((p) => {
              const active = p.id === providerId;
              return (
                <button
                  key={p.id}
                  onClick={() => setProviderId(p.id)}
                  className={`p-2.5 rounded-lg border text-center transition ${
                    active ? 'border-[#1D6F5A] bg-[#EDF5F2]/60' : 'border-[#ECECE8] bg-[#FAFAF8]'
                  }`}
                >
                  <div
                    className="w-8 h-8 mx-auto rounded-lg text-white font-bold text-xs flex items-center justify-center"
                    style={{ backgroundColor: p.accent }}
                  >
                    {p.name.slice(0, 2)}
                  </div>
                  <div className="text-[12px] font-semibold text-zinc-900 mt-1.5 truncate">
                    {p.name.replace('（南京站）', '')}
                  </div>
                  <div className="text-[10px] text-zinc-500">{p.tag}</div>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {provider.features.map((f) => (
              <span
                key={f}
                className="text-[11px] px-2 py-0.5 rounded bg-[#F4F4F1] text-zinc-600 inline-flex items-center gap-1"
              >
                <Check className="w-3 h-3 text-[#1D6F5A]" /> {f}
              </span>
            ))}
          </div>
        </div>

        {/* Appliance Catalog */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-2.5">
          <div className="text-[13px] font-semibold text-zinc-900">选择回收品类</div>
          <div className="grid grid-cols-2 gap-2">
            {APPLIANCE_CATALOG.map((item) => {
              const active = item.id === selectedApplianceId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedApplianceId(item.id)}
                  className={`p-2.5 rounded-lg border text-left transition ${
                    active ? 'border-[#1D6F5A] bg-[#EDF5F2]/50' : 'border-[#ECECE8] bg-[#FAFAF8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-7 rounded-md bg-white border border-[#E6E6E1] text-zinc-700 flex items-center justify-center">
                      <ItemIcon id={item.id} className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#1D6F5A] tabular-nums">
                      约¥{item.basePrice}起
                    </span>
                  </div>
                  <div className="text-[13px] font-semibold text-zinc-900 mt-2">{item.name}</div>
                  <div className="text-[10.5px] text-zinc-500 truncate mt-0.5">{item.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Condition & Uninstall */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-3">
          <div className="text-[13px] font-semibold text-zinc-900">机器当前成色</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'good', label: '完好可用', sub: '估价上浮' },
              { id: 'minor', label: '轻微故障', sub: '外观完好' },
              { id: 'broken', label: '无法开机', sub: '残值拆解' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCondition(c.id as typeof condition)}
                className={`p-2 rounded-lg border text-center transition ${
                  condition === c.id
                    ? 'border-[#1D6F5A] bg-[#EDF5F2] text-zinc-900'
                    : 'border-[#ECECE8] bg-[#FAFAF8] text-zinc-600'
                }`}
              >
                <div className="text-[12.5px] font-semibold">{c.label}</div>
                <div className="text-[10.5px] text-zinc-400 mt-0.5">{c.sub}</div>
              </button>
            ))}
          </div>

          <div className="pt-2.5 border-t border-[#F0F0EC] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-800">
              <Wrench className="w-4 h-4 text-[#1D6F5A]" />
              <span>需要工程师免费拆机搬运</span>
            </div>
            <button
              onClick={() => setNeedUninstall((v) => !v)}
              className={`w-10 h-5.5 rounded-full transition-colors p-0.5 ${
                needUninstall ? 'bg-[#1D6F5A]' : 'bg-zinc-300'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                  needUninstall ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Visual Valuation Banner */}
        <div className="relative h-28 rounded-xl overflow-hidden border border-black/8">
          <img
            src="/images/svc-washer.jpg"
            alt="废旧家电回收"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#134E3F]/92 via-[#1D6F5A]/75 to-black/35" />
          <div className="absolute inset-0 px-4 flex items-center justify-between text-white">
            <div>
              <div className="text-[11px] text-white/80">在线参考估价（含补贴）</div>
              <div className="text-2xl font-bold tabular-nums mt-0.5">¥ {totalPayout}</div>
              <div className="text-[10.5px] text-emerald-200 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>免费拆机 · 当面结款</span>
              </div>
            </div>
            <div className="text-right text-[11px] space-y-0.5 text-white/85 tabular-nums">
              <div>基础价 ¥{baseValuation}</div>
              <div>补贴 +¥{subsidyBonus}</div>
              <div className="font-semibold text-white">+{points} 积分</div>
            </div>
          </div>
        </div>

        {/* Address & Time */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-3">
          <button
            onClick={() => navigate({ name: 'address_list', selectMode: true })}
            className="w-full flex items-center justify-between text-left pb-3 border-b border-[#F0F0EC]"
          >
            {currentAddr ? (
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold text-zinc-900 tabular-nums">
                  {currentAddr.contactName} {currentAddr.phone}
                </div>
                <div className="text-[12px] text-zinc-500 truncate mt-0.5">
                  {currentAddr.region} {currentAddr.community} {currentAddr.detail}
                </div>
              </div>
            ) : (
              <span className="text-rose-700 font-medium text-[13px]">* 请选择上门地址</span>
            )}
            <MapPin className="w-4.5 h-4.5 text-[#1D6F5A] shrink-0" />
          </button>

          <div>
            <div className="text-[12px] font-medium text-zinc-600 mb-2">期望上门时段</div>
            <div className="grid grid-cols-2 gap-2">
              {['明天 10:00-12:00', '明天 14:00-16:00', '后天 10:00-12:00', '周末上午'].map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 rounded-lg text-[12px] font-medium border transition ${
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

          <input
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="选填：如空调外机位置、品牌型号等备注"
            className="w-full rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] px-3 py-2 text-[13px]"
          />
        </div>
      </div>

      {/* Bottom Sticky Submit */}
      <div className="sticky bottom-0 inset-x-0 bg-white border-t border-[#E6E6E1] px-4 py-3 flex items-center justify-between gap-3 z-30">
        <div>
          <div className="text-[11px] text-zinc-500">参考回收价</div>
          <div className="text-lg font-bold text-[#1D6F5A] tabular-nums">
            ¥{totalPayout}
            <span className="text-[11px] font-normal text-zinc-500 ml-1.5">+{points}分</span>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-lg bg-[#1D6F5A] active:bg-[#175C4A] text-white font-semibold text-[14px]"
        >
          预约免费上门
        </button>
      </div>
    </div>
  );
};
