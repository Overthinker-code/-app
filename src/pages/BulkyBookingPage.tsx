import React, { useState } from 'react';
import {
  MapPin,
  Check,
  Camera,
  Plus,
  Minus,
  X,
  Building2,
  ReceiptText,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubPageHeader } from '../components/Layout';
import { BULKY_ITEMS_CATALOG, BULKY_PROVIDERS } from '../data/mockData';

export const BulkyBookingPage: React.FC = () => {
  const { addresses, selectedAddressId, navigate, createOrder, setActiveTab, showToast } = useApp();
  const currentAddr = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];

  const [providerId, setProviderId] = useState(BULKY_PROVIDERS[0].id);
  const [counts, setCounts] = useState<Record<string, number>>({ mattress: 1 });
  const [hasElevator, setHasElevator] = useState(true);
  const [floor, setFloor] = useState(3);
  const [timeSlot, setTimeSlot] = useState('明天 14:00-16:00');
  const [photos, setPhotos] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');
  const [showPriceTable, setShowPriceTable] = useState(false);

  const changeCount = (id: string, delta: number) => {
    setCounts((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const itemsCost = Object.entries(counts).reduce((sum, [id, qty]) => {
    const item = BULKY_ITEMS_CATALOG.find((c) => c.id === id);
    return sum + (item ? item.unitPrice * qty : 0);
  }, 0);

  const totalItems = Object.values(counts).reduce((a, b) => a + b, 0);
  const stairFee = hasElevator || totalItems === 0 ? 0 : Math.max(0, floor - 1) * 15;
  const totalEstimated = itemsCost + stairFee;

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

  const handleAddSamplePhoto = () => {
    if (photos.length >= 4) return;
    setPhotos((prev) => [...prev, '/images/card-bulky.jpg']);
    showToast('已添加演示现场照片', 'info');
  };

  const handleSubmit = () => {
    if (!currentAddr) {
      showToast('请先选择回收清运地址', 'warning');
      return;
    }
    if (totalItems === 0) {
      showToast('请至少选择一件需要清运的大件物品', 'warning');
      return;
    }
    const provider = BULKY_PROVIDERS.find((p) => p.id === providerId)!;
    const summary = Object.entries(counts)
      .map(([id, qty]) => {
        const item = BULKY_ITEMS_CATALOG.find((c) => c.id === id);
        return `${item?.name ?? id} ×${qty}`;
      })
      .join('、');

    createOrder({
      category: 'bulky',
      categoryLabel: '大件垃圾预约清运',
      status: 'pending',
      appointmentTime: timeSlot,
      addressText: `${currentAddr.region}${currentAddr.street} ${currentAddr.community} ${currentAddr.detail}`,
      contactName: currentAddr.contactName,
      contactPhone: currentAddr.phone,
      providerName: provider.name,
      itemsSummary: summary,
      estimatedAmount: totalEstimated,
      isFee: true,
      estimatedPoints: totalItems * 35,
      estimatedWeightKg: totalItems * 22,
      hasElevator,
      remarks: remarks.trim() || undefined,
      photos,
    });

    showToast('大件清运预约已提交！工作人员将尽快与您联系', 'success');
    navigate({ name: 'tabs' });
    setActiveTab('orders');
  };

  return (
    <div className="min-h-full bg-[#F4F8F6] pb-28">
      <SubPageHeader title="大件垃圾预约清运" />

      <div className="p-4 space-y-3.5">
        {/* Top Tip */}
        <div className="rounded-2xl bg-sky-50 border-l-4 border-sky-500 px-3.5 py-2.5 text-[12px] text-sky-900">
          温馨提示：参考价透明公示，最终上门价格以回收企业现场核验为准。
        </div>

        {/* Address */}
        <button
          onClick={() => navigate({ name: 'address_list', selectMode: true })}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 text-left flex items-center justify-between gap-3 active:scale-[0.99] transition"
        >
          {currentAddr ? (
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-700">
                  清运地址
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
          <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
        </button>

        {/* Service Enterprise */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 space-y-2.5">
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
            <Building2 className="w-4 h-4 text-orange-500" />
            <span>
              <span className="text-rose-500">*</span> 服务企业
            </span>
          </div>
          {BULKY_PROVIDERS.map((p) => {
            const active = providerId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setProviderId(p.id)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                  active ? 'border-orange-400 bg-orange-50/50' : 'border-slate-100 bg-slate-50/70'
                }`}
              >
                <div>
                  <div className="text-[13px] font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    ★ {p.rating} · {p.badge} · 起步价 ¥{p.minOrder}
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    active ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300'
                  }`}
                >
                  {active && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Item Selector + Transparent Price Table Button */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-900">
              <span className="text-rose-500">*</span> 请选择大件物品
            </span>
            <button
              onClick={() => setShowPriceTable(true)}
              className="inline-flex items-center gap-1 text-[12px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full active:scale-95 transition"
            >
              <ReceiptText className="w-3.5 h-3.5" />
              <span>价格表&gt;&gt;&gt;</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {BULKY_ITEMS_CATALOG.map((item) => {
              const qty = counts[item.id] ?? 0;
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition ${
                    qty > 0 ? 'border-orange-300 bg-orange-50/35' : 'border-slate-100 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-[13px] font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500">
                        <span className="font-bold text-orange-600 tabular-nums">¥{item.unitPrice}/{item.unit}</span> · {item.note}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changeCount(item.id, -1)}
                      className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-90 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-[13px] font-bold text-slate-900 tabular-nums">
                      {qty}
                    </span>
                    <button
                      onClick={() => changeCount(item.id, 1)}
                      className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center active:scale-90 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Elevator Toggle */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-900">
              <span className="text-rose-500">*</span> 是否有电梯
            </span>
            <div className="flex items-center gap-3">
              {[
                { val: true, label: '有电梯' },
                { val: false, label: '无电梯' },
              ].map((opt) => (
                <button
                  key={String(opt.val)}
                  onClick={() => setHasElevator(opt.val)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition ${
                    hasElevator === opt.val
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-500'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      hasElevator === opt.val ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {hasElevator === opt.val && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {!hasElevator && (
            <div className="rounded-xl bg-amber-50 p-3 flex items-center justify-between">
              <div className="text-[12px] text-amber-900">
                <div className="font-semibold">所在楼层（步梯搬运费 ¥15/层）</div>
                <div className="text-[11px] text-amber-700">当前加收 ¥{stairFee}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFloor((f) => Math.max(1, f - 1))}
                  className="w-7 h-7 rounded-full bg-white border border-amber-200 flex items-center justify-center"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-[13px] text-amber-900 tabular-nums">
                  {floor}楼
                </span>
                <button
                  onClick={() => setFloor((f) => Math.min(8, f + 1))}
                  className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Pickup time */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[12px] font-semibold text-slate-600 mb-2">期望上门时间</div>
            <div className="grid grid-cols-2 gap-2">
              {['明天 09:00-11:00', '明天 14:00-16:00', '后天 09:00-11:00', '周末全天均可'].map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 rounded-xl text-[12px] font-semibold border transition ${
                    timeSlot === slot
                      ? 'border-orange-400 bg-orange-50 text-orange-800'
                      : 'border-slate-100 bg-slate-50 text-slate-600'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="rounded-2xl bg-white border border-rose-100 p-3.5 flex items-start gap-2 text-[12px]">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-slate-700 leading-relaxed">
            温馨提示：下单完成后由工作人员与您联系完成上门清运，
            <span className="text-rose-600 font-semibold">实际价格请以回收企业现场核验金额为准。</span>
          </p>
        </div>

        {/* Upload Photos (up to 4) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-900">
              <span className="text-rose-500">*</span> 上传照片（最多添加4张）
            </span>
            <button
              onClick={handleAddSamplePhoto}
              className="text-[11px] font-semibold text-emerald-600 hover:underline"
            >
              + 一键填入示例图
            </button>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {photos.map((src, i) => (
              <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                <img src={src} alt="大件照片" className="w-full h-full object-cover" />
                <button
                  onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-slate-900/70 text-white flex items-center justify-center"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            {photos.length < 4 && (
              <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-orange-400 hover:text-orange-600 transition">
                <Camera className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">{photos.length}/4</span>
                <input type="file" accept="image/*" multiple onChange={handlePhotoAdd} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Remarks */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5">
          <div className="text-[13px] font-bold text-slate-900 mb-2">备注信息</div>
          <div className="relative">
            <textarea
              maxLength={200}
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="请备注物品尺寸、是否需要现场拆解、小区货车进出要求等详细信息"
              className="w-full rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-400 resize-none"
            />
            <span className="absolute right-3 bottom-2 text-[11px] text-slate-400 tabular-nums">
              {remarks.length}/200
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Submit */}
      <div className="sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 flex items-center justify-between gap-3 z-30">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-slate-500">参考清运费</span>
            <span className="text-xl font-extrabold text-orange-600 tabular-nums">
              ¥{totalEstimated}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            已选 {totalItems} 件 · 完成后赠 +{totalItems * 35} 积分
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="px-7 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[14px] shadow-lg shadow-orange-500/25 active:scale-95 transition"
        >
          预约下单
        </button>
      </div>

      {/* Price Table Modal */}
      {showPriceTable && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[2px] flex items-end sm:items-center justify-center animate-fade-in"
          onClick={() => setShowPriceTable(false)}
        >
          <div
            className="w-full max-w-[430px] max-h-[82vh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-slate-900">北京市大件垃圾清运参考价格表</h3>
              <button
                onClick={() => setShowPriceTable(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 font-semibold">物品名称</th>
                    <th className="py-2 font-semibold">参考单价</th>
                    <th className="py-2 font-semibold">服务说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {BULKY_ITEMS_CATALOG.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 font-semibold text-slate-900">
                        {item.icon} {item.name}
                      </td>
                      <td className="py-2.5 font-bold text-orange-600 tabular-nums">
                        ¥{item.unitPrice}/{item.unit}
                      </td>
                      <td className="py-2.5 text-slate-500">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
                * 以上价格包含北京市正规资源化拆解处置费及楼下装车费；无电梯楼栋按15元/层加收人工搬运费。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
