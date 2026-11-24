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
  AlertCircle,
} from 'lucide-react';
import { MAX_BOOKING_PHOTOS, useBookingPhotos } from '../components/useBookingPhotos';
import { useApp } from '../context/AppContext';
import { SubPageHeader } from '../components/Layout';
import { BULKY_ITEMS_CATALOG, BULKY_PROVIDERS } from '../data/mockData';
import { ItemIcon } from '../components/NanjingVisuals';

export const BulkyBookingPage: React.FC = () => {
  const { addresses, selectedAddressId, navigate, createOrder, setActiveTab, showToast } = useApp();
  const currentAddr = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];

  const [providerId, setProviderId] = useState(BULKY_PROVIDERS[0].id);
  const [counts, setCounts] = useState<Record<string, number>>({ mattress: 1 });
  const [hasElevator, setHasElevator] = useState(true);
  const [floor, setFloor] = useState(3);
  const [timeSlot, setTimeSlot] = useState('明天 14:00-16:00');
  const { photos, processingPhotos, addPhotos, removePhoto } = useBookingPhotos((message) => showToast(message, 'warning'));
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

  const handleSubmit = () => {
    if (processingPhotos) return;
    if (!currentAddr) {
      showToast('请先选择清运地址', 'warning');
      return;
    }
    if (totalItems === 0) {
      showToast('请至少选择一件大件物品', 'warning');
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
      categoryLabel: '大件家具清运',
      status: 'pending',
      appointmentTime: timeSlot,
      addressText: `${currentAddr.region}${currentAddr.street} ${currentAddr.community} ${currentAddr.detail}`,
      contactName: currentAddr.contactName,
      contactPhone: currentAddr.phone,
      providerName: provider.name,
      itemsSummary: summary,
      estimatedAmount: totalEstimated,
      isFee: true,
      estimatedPoints: totalItems * 30,
      estimatedWeightKg: totalItems * 22,
      hasElevator,
      remarks: remarks.trim() || undefined,
      photos,
    });

    showToast('大件清运演示预约已创建', 'success');
    navigate({ name: 'tabs' });
    setActiveTab('orders');
  };

  return (
    <div className="min-h-full bg-[#F4F4F1]">
      <SubPageHeader title="大件垃圾预约清运" />

      <div className="p-3.5 space-y-3">
        {/* Visual Hero Banner */}
        <div className="relative h-28 rounded-xl overflow-hidden border border-black/8">
          <img src="/images/svc-bulky.jpg" alt="大件家具清运" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/15" />
          <div className="absolute inset-0 px-4 flex items-center justify-between text-white">
            <div>
              <div className="text-[16px] font-bold">大件家具规范清运</div>
              <div className="text-[11.5px] text-white/80 mt-0.5">沙发 · 床垫 · 衣柜 · 明码标价</div>
            </div>
            <button
              onClick={() => setShowPriceTable(true)}
              className="px-2.5 py-1.5 rounded-lg bg-white/90 text-zinc-900 text-[11.5px] font-semibold inline-flex items-center gap-1"
            >
              <ReceiptText className="w-3.5 h-3.5 text-[#B45309]" />
              <span>价目表</span>
            </button>
          </div>
        </div>

        {/* Address */}
        <button
          onClick={() => navigate({ name: 'address_list', selectMode: true })}
          className="w-full bg-white rounded-xl p-3.5 border border-[#E6E6E1] text-left flex items-center justify-between gap-3"
        >
          {currentAddr ? (
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[#FDF4EC] text-[#B45309]">
                  清运地址
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
            <span className="text-[14px] font-medium text-rose-700">* 请选择清运地址</span>
          )}
          <MapPin className="w-4.5 h-4.5 text-[#B45309] shrink-0" />
        </button>

        {/* Provider */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-2">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-zinc-900">
            <Building2 className="w-4 h-4 text-[#B45309]" />
            <span>清运承运单位</span>
          </div>
          {BULKY_PROVIDERS.map((p) => {
            const active = providerId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setProviderId(p.id)}
                className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition ${
                  active ? 'border-[#B45309] bg-[#FDF4EC]/60' : 'border-[#ECECE8] bg-[#FAFAF8]'
                }`}
              >
                <div>
                  <div className="text-[13px] font-semibold text-zinc-900">{p.name}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    评分 {p.rating} · {p.badge} · 起步 ¥{p.minOrder}
                  </div>
                </div>
                <div
                  className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                    active ? 'border-[#B45309] bg-[#B45309] text-white' : 'border-zinc-300'
                  }`}
                >
                  {active && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Item Catalog + Price Table */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-semibold text-zinc-900">选择大件物品</span>
            <button
              onClick={() => setShowPriceTable(true)}
              className="inline-flex items-center gap-1 text-[12px] font-medium text-[#1D6F5A] bg-[#EDF5F2] px-2.5 py-1 rounded-lg"
            >
              <ReceiptText className="w-3.5 h-3.5" />
              <span>参考价格表</span>
            </button>
          </div>

          <div className="divide-y divide-[#F0F0EC]">
            {BULKY_ITEMS_CATALOG.map((item) => {
              const qty = counts[item.id] ?? 0;
              return (
                <div key={item.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F4F4F1] text-zinc-700 flex items-center justify-center">
                      <ItemIcon id={item.id} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-zinc-900">{item.name}</div>
                      <div className="text-[11px] text-zinc-500">
                        <span className="font-semibold text-[#B45309] tabular-nums">¥{item.unitPrice}/{item.unit}</span> · {item.note}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changeCount(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-[#F4F4F1] flex items-center justify-center text-zinc-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-[13px] font-semibold text-zinc-900 tabular-nums">
                      {qty}
                    </span>
                    <button
                      onClick={() => changeCount(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-[#B45309] text-white flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Elevator & Time */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-zinc-900">楼栋电梯情况</span>
            <div className="flex items-center gap-2">
              {[
                { val: true, label: '有电梯' },
                { val: false, label: '无电梯' },
              ].map((opt) => (
                <button
                  key={String(opt.val)}
                  onClick={() => setHasElevator(opt.val)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition ${
                    hasElevator === opt.val
                      ? 'border-[#1D6F5A] bg-[#EDF5F2] text-[#1D6F5A]'
                      : 'border-[#E6E6E1] text-zinc-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {!hasElevator && (
            <div className="rounded-lg bg-[#FDF4EC] px-3 py-2.5 flex items-center justify-between">
              <div className="text-[12px] text-amber-950">
                <div className="font-medium">步梯搬运楼层（¥15/层）</div>
                <div className="text-[11px] text-[#B45309] tabular-nums">当前搬运费 ¥{stairFee}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFloor((f) => Math.max(1, f - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-amber-200 flex items-center justify-center"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-semibold text-[13px] text-amber-950 tabular-nums">
                  {floor}楼
                </span>
                <button
                  onClick={() => setFloor((f) => Math.min(8, f + 1))}
                  className="w-7 h-7 rounded-lg bg-[#B45309] text-white flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-[#F0F0EC]">
            <div className="text-[12px] font-medium text-zinc-600 mb-2">期望清运时段</div>
            <div className="grid grid-cols-2 gap-2">
              {['明天 09:00-11:00', '明天 14:00-16:00', '后天 09:00-11:00', '周末全天'].map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 rounded-lg text-[12px] font-medium border transition ${
                    timeSlot === slot
                      ? 'border-[#B45309] bg-[#FDF4EC] text-[#B45309]'
                      : 'border-[#ECECE8] bg-[#FAFAF8] text-zinc-600'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Photos & Remarks */}
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-2.5">
          <div className="text-[13px] font-semibold text-zinc-900">现场照片（最多 4 张）与备注</div>
          <div className="flex items-center gap-2 flex-wrap">
            {photos.map((src, i) => (
              <div key={i} className="relative w-15 h-15 rounded-lg overflow-hidden border border-[#E6E6E1]">
                <img src={src} alt="大件照片" className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-zinc-900/75 text-white flex items-center justify-center"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            {photos.length < MAX_BOOKING_PHOTOS && (
              <label className="w-15 h-15 rounded-lg border border-dashed border-zinc-300 bg-[#FAFAF8] flex flex-col items-center justify-center text-zinc-400 cursor-pointer">
                <Camera className="w-4.5 h-4.5" />
                <span className="text-[10px] mt-0.5 tabular-nums">{photos.length}/{MAX_BOOKING_PHOTOS}</span>
                <input type="file" accept="image/*" multiple disabled={processingPhotos} onChange={addPhotos} className="hidden" />
              </label>
            )}
          </div>
          {processingPhotos && <p role="status" className="text-[11px] text-zinc-500">正在处理照片…</p>}
          <div className="relative">
            <textarea
              maxLength={200}
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="请备注物品尺寸、是否需要现场拆解、小区货车进出时段等"
              className="w-full rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] p-2.5 text-[13px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#B45309] resize-none"
            />
            <span className="absolute right-2.5 bottom-2 text-[10.5px] text-zinc-400 tabular-nums">
              {remarks.length}/200
            </span>
          </div>
        </div>

        <div className="flex items-start gap-1.5 px-1 text-[11px] text-zinc-500">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-zinc-400" />
          <span>下单后工作人员将在 2 小时内致电确认上门细节，清运完成同步出具电子联单。</span>
        </div>
      </div>

      {/* Bottom Submit */}
      <div className="sticky bottom-0 inset-x-0 bg-white border-t border-[#E6E6E1] px-4 py-3 flex items-center justify-between gap-3 z-30">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-zinc-500">参考清运费</span>
            <span className="text-lg font-bold text-[#B45309] tabular-nums">¥{totalEstimated}</span>
          </div>
          <div className="text-[11px] text-zinc-400 tabular-nums">
            已选 {totalItems} 件 · 完成后得 +{totalItems * 30} 积分
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={processingPhotos}
          className="px-6 py-2.5 rounded-lg bg-[#B45309] active:opacity-90 text-white font-semibold text-[14px]"
        >
          提交预约
        </button>
      </div>

      {/* Reference Price Table Modal */}
      {showPriceTable && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center animate-fade-in"
          onClick={() => setShowPriceTable(false)}
        >
          <div
            className="w-full max-w-[414px] max-h-[80vh] bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3.5 border-b border-[#E6E6E1] flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-zinc-900">南京市大件垃圾清运参考价目表</h3>
              <button
                onClick={() => setShowPriceTable(false)}
                className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-[#E6E6E1] text-zinc-500">
                    <th className="py-2 font-medium">物品名称</th>
                    <th className="py-2 font-medium">参考单价</th>
                    <th className="py-2 font-medium">说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0EC]">
                  {BULKY_ITEMS_CATALOG.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 font-medium text-zinc-900">{item.name}</td>
                      <td className="py-2.5 font-semibold text-[#B45309] tabular-nums">
                        ¥{item.unitPrice}/{item.unit}
                      </td>
                      <td className="py-2.5 text-zinc-500">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-[11px] text-zinc-400 leading-relaxed">
                * 以上价格含楼下装车与正规大件拆解处置费；老旧无电梯小区按 15 元/层加收人工搬运费。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
