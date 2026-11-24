import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  Truck,
  ChevronRight,
  X,
  Plus,
  FileCheck2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { OrderCategory, OrderStatus, RecycleOrder } from '../types';
import { RealQrCode } from '../components/NanjingVisuals';

const CATEGORY_TABS: { id: 'all' | OrderCategory; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'recyclable', label: '可回收物' },
  { id: 'appliance', label: '家电回收' },
  { id: 'bulky', label: '大件清运' },
  { id: 'renovation', label: '装修垃圾' },
];

const STATUS_META: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: '待派单', cls: 'bg-amber-50 text-amber-800 border-amber-200/80' },
  assigned: { label: '已派单', cls: 'bg-blue-50 text-blue-700 border-blue-200/80' },
  in_progress: { label: '清运中', cls: 'bg-zinc-100 text-zinc-800 border-zinc-200' },
  completed: { label: '已完成', cls: 'bg-[#EDF5F2] text-[#1D6F5A] border-[#CDE4DC]' },
  cancelled: { label: '已取消', cls: 'bg-zinc-100 text-zinc-500 border-zinc-200' },
};

const CAT_BADGE: Record<OrderCategory, string> = {
  recyclable: 'bg-[#EDF5F2] text-[#1D6F5A]',
  bulky: 'bg-[#FDF4EC] text-[#B45309]',
  renovation: 'bg-[#F1F3F5] text-[#475569]',
  appliance: 'bg-[#EDF6F6] text-[#0F766E]',
};

export const OrdersPage: React.FC = () => {
  const { orders, cancelOrder, completeOrder, setActiveTab, showToast } = useApp();
  const [catFilter, setCatFilter] = useState<'all' | OrderCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showManifest, setShowManifest] = useState(false);

  const filtered = orders.filter((o) => {
    if (catFilter !== 'all' && o.category !== catFilter) return false;
    if (statusFilter === 'active' && (o.status === 'completed' || o.status === 'cancelled')) return false;
    if (statusFilter === 'completed' && o.status !== 'completed') return false;
    return true;
  });

  const selectedOrder: RecycleOrder | undefined = orders.find((o) => o.id === selectedOrderId);
  const manifestParams = selectedOrder?.manifestNo && new URLSearchParams({
    no: selectedOrder.manifestNo,
    order: selectedOrder.orderNo,
    mode: 'demo',
  });

  return (
    <div className="min-h-full bg-[#F4F4F1] pb-6">
      <header className="sticky top-0 z-20 bg-white border-b border-[#E6E6E1] px-3.5 pt-3.5 pb-2.5">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[17px] font-bold text-zinc-900">我的订单</h1>
          <button
            onClick={() => setActiveTab('home')}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[#1D6F5A] bg-[#EDF5F2] px-2.5 py-1 rounded-lg active:opacity-80 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>去预约</span>
          </button>
        </div>

        {/* 5-Column Category Tabs (Never Clips) */}
        <div className="grid grid-cols-5 gap-1.5">
          {CATEGORY_TABS.map((tab) => {
            const active = catFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCatFilter(tab.id)}
                className={`py-1.5 rounded-lg text-[11.5px] font-medium transition text-center whitespace-nowrap ${
                  active
                    ? 'bg-[#1D6F5A] text-white'
                    : 'bg-[#F4F4F1] text-zinc-600 hover:bg-zinc-200/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-5 mt-2.5 text-[12px]">
          {[
            { id: 'all', label: '全部' },
            { id: 'active', label: '进行中' },
            { id: 'completed', label: '已完成' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id as typeof statusFilter)}
              className={`pb-1 border-b-2 transition ${
                statusFilter === s.id
                  ? 'border-[#1D6F5A] text-zinc-900 font-semibold'
                  : 'border-transparent text-zinc-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </header>

      <div className="p-3.5 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[14px] font-semibold text-zinc-700">暂无该分类订单</p>
            <p className="text-[12px] text-zinc-400 mt-1">可前往首页预约回收或清运服务</p>
            <button
              onClick={() => setActiveTab('home')}
              className="mt-4 px-5 py-2 rounded-lg bg-[#1D6F5A] text-white text-[13px] font-medium"
            >
              返回首页
            </button>
          </div>
        ) : (
          filtered.map((order) => {
            const st = STATUS_META[order.status];
            return (
              <div
                key={order.id}
                onClick={() => {
                  setSelectedOrderId(order.id);
                  setShowManifest(false);
                }}
                className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] active:bg-zinc-50/70 transition cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#F0F0EC]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${CAT_BADGE[order.category]}`}>
                      {order.categoryLabel}
                    </span>
                    <span className="text-[11px] text-zinc-400 tabular-nums truncate">
                      {order.orderNo}
                    </span>
                  </div>
                  <span className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded border ${st.cls}`}>
                    {st.label}
                  </span>
                </div>

                <div className="py-2.5 space-y-1.5">
                  <p className="text-[14px] font-semibold text-zinc-900">{order.itemsSummary}</p>
                  <div className="flex items-center gap-1.5 text-[12px] text-zinc-500">
                    <Truck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{order.providerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-zinc-500">
                    <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{order.appointmentTime}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[12px] text-zinc-500">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{order.addressText}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#F0F0EC] flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[11px] text-zinc-400">
                      {order.isFee ? '参考清运费' : '预估回收款'}
                    </span>
                    <span
                      className={`text-[15px] font-bold tabular-nums ${
                        order.isFee ? 'text-[#B45309]' : 'text-[#1D6F5A]'
                      }`}
                    >
                      {order.isFee ? `¥${order.estimatedAmount.toFixed(0)}` : `+¥${order.estimatedAmount.toFixed(2)}`}
                    </span>
                    <span className="text-[11px] text-zinc-500 tabular-nums">
                      · +{order.estimatedPoints}积分
                    </span>
                  </div>
                  <span className="text-[12px] text-zinc-400 flex items-center">
                    详情 <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Detail Sheet */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center animate-fade-in"
          onClick={() => setSelectedOrderId(null)}
        >
          <div
            className="w-full max-w-[414px] max-h-[86vh] bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3.5 border-b border-[#E6E6E1] flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-zinc-900">订单详情</h3>
                <p className="text-[11px] text-zinc-400 tabular-nums">单号 {selectedOrder.orderNo}</p>
              </div>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3.5">
              {/* Summary */}
              <div className="rounded-xl bg-[#FAFAF8] border border-[#E6E6E1] p-3.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${STATUS_META[selectedOrder.status].cls}`}>
                    {STATUS_META[selectedOrder.status].label}
                  </span>
                  <p className="text-[14px] font-semibold text-zinc-900 mt-2">{selectedOrder.itemsSummary}</p>
                  <p className="text-[12px] text-zinc-500 mt-0.5 truncate">{selectedOrder.providerName}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[11px] text-zinc-500">{selectedOrder.isFee ? '清运参考费' : '回收款'}</div>
                  <div className={`text-lg font-bold tabular-nums ${selectedOrder.isFee ? 'text-[#B45309]' : 'text-[#1D6F5A]'}`}>
                    {selectedOrder.isFee ? `¥${selectedOrder.estimatedAmount}` : `+¥${selectedOrder.estimatedAmount.toFixed(2)}`}
                  </div>
                </div>
              </div>

              {/* Electronic Manifest Toggle (电子联单) */}
              {manifestParams && (
                <div className="rounded-xl border border-[#DCE5E1] bg-[#F5FAF7] overflow-hidden">
                  <button
                    onClick={() => setShowManifest((v) => !v)}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-[#1D6F5A]" />
                      <div>
                        <div className="text-[12.5px] font-semibold text-zinc-900">南京清运 / 回收电子联单（演示）</div>
                        <div className="text-[11px] text-zinc-500 tabular-nums">编号 {selectedOrder.manifestNo}</div>
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium text-[#1D6F5A]">
                      {showManifest ? '收起凭证' : '查看联单'}
                    </span>
                  </button>

                  {showManifest && (
                    <div className="px-3.5 pb-3.5 pt-2 border-t border-[#DCE5E1] bg-white flex items-center gap-3.5">
                      <RealQrCode
                        value={`ninghuishou://manifest?${manifestParams}`}
                        size={88}
                        className="shrink-0 border border-[#E6E6E1] p-1"
                      />
                      <div className="text-[11px] text-zinc-600 space-y-1 min-w-0">
                        <div className="font-semibold text-zinc-900">联单样例，供本机演示</div>
                        <div>承运单位：{selectedOrder.providerName}</div>
                        {selectedOrder.collector?.plateNo && (
                          <div>备案车牌：{selectedOrder.collector.plateNo}</div>
                        )}
                        <div>预估净重：约 {selectedOrder.estimatedWeightKg} kg</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Collector */}
              {selectedOrder.collector && (
                <div className="rounded-xl border border-[#E6E6E1] p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-semibold text-zinc-900">
                      服务人员：{selectedOrder.collector.name}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5 tabular-nums">
                      车牌 {selectedOrder.collector.plateNo} · {selectedOrder.collector.phone}
                    </div>
                  </div>
                  <button
                    onClick={() => showToast(`已复制联系号码 ${selectedOrder.collector?.phone}`, 'info')}
                    className="h-8 px-3 rounded-lg bg-[#EDF5F2] text-[#1D6F5A] text-[12px] font-medium flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>联系</span>
                  </button>
                </div>
              )}

              {/* Order Info */}
              <div className="rounded-xl border border-[#E6E6E1] p-3 space-y-2 text-[12px]">
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-400 shrink-0">预约时间</span>
                  <span className="text-zinc-800 text-right">{selectedOrder.appointmentTime}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-400 shrink-0">联系人</span>
                  <span className="text-zinc-800 text-right tabular-nums">
                    {selectedOrder.contactName} {selectedOrder.contactPhone}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-400 shrink-0">服务地址</span>
                  <span className="text-zinc-800 text-right">{selectedOrder.addressText}</span>
                </div>
                {selectedOrder.remarks && (
                  <div className="flex justify-between gap-4">
                    <span className="text-zinc-400 shrink-0">备注</span>
                    <span className="text-zinc-700 text-right">{selectedOrder.remarks}</span>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-[12.5px] font-semibold text-zinc-800 mb-2.5">流转记录</h4>
                <div className="space-y-2.5 pl-2">
                  {selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-4 pb-1 border-l border-zinc-200 last:border-l-transparent">
                      <span
                        className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${
                          step.done ? 'bg-[#1D6F5A]' : 'bg-zinc-300'
                        }`}
                      />
                      <div className="flex items-center justify-between">
                        <span className={`text-[12.5px] font-medium ${step.done ? 'text-zinc-900' : 'text-zinc-400'}`}>
                          {step.title}
                        </span>
                        <span className="text-[11px] text-zinc-400 tabular-nums">{step.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {(selectedOrder.status === 'pending' || selectedOrder.status === 'assigned') && (
              <div className="p-3.5 border-t border-[#E6E6E1] grid grid-cols-2 gap-2.5 bg-[#FAFAF8]">
                <button
                  onClick={() => {
                    cancelOrder(selectedOrder.id);
                    setSelectedOrderId(null);
                  }}
                  className="py-2.5 rounded-lg border border-[#E6E6E1] bg-white text-zinc-600 font-medium text-[13px] flex items-center justify-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  <span>取消预约</span>
                </button>
                <button
                  onClick={() => completeOrder(selectedOrder.id)}
                  className="py-2.5 rounded-lg bg-[#1D6F5A] text-white font-semibold text-[13px] flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>确认演示结算</span>
                </button>
              </div>
            )}
            {selectedOrder.status === 'completed' && (
              <div className="px-4 py-3 border-t border-[#E6E6E1] bg-[#F5FAF7] text-center text-[12px] text-[#1D6F5A] font-medium">
                订单已完成归档，电子联单可长期留存查询
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
