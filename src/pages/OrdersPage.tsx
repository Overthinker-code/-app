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
  Sparkles,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { OrderCategory, OrderStatus, RecycleOrder } from '../types';
import { EmptyInboxIllustration } from '../components/ServiceIllustrations';

const CATEGORY_TABS: { id: 'all' | OrderCategory; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'recyclable', label: '可回收物' },
  { id: 'appliance', label: '家电回收' },
  { id: 'bulky', label: '大件垃圾' },
  { id: 'renovation', label: '装修垃圾' },
];

const STATUS_META: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: '待接单', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  assigned: { label: '已派单', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
  in_progress: { label: '服务中', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  completed: { label: '已完成', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: '已取消', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
};

const CAT_BADGE: Record<OrderCategory, string> = {
  recyclable: 'bg-cyan-50 text-cyan-700',
  bulky: 'bg-orange-50 text-orange-700',
  renovation: 'bg-stone-100 text-stone-700',
  appliance: 'bg-emerald-50 text-emerald-700',
};

export const OrdersPage: React.FC = () => {
  const { orders, cancelOrder, completeOrder, setActiveTab, showToast } = useApp();
  const [catFilter, setCatFilter] = useState<'all' | OrderCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    if (catFilter !== 'all' && o.category !== catFilter) return false;
    if (statusFilter === 'active' && (o.status === 'completed' || o.status === 'cancelled')) return false;
    if (statusFilter === 'completed' && o.status !== 'completed') return false;
    return true;
  });

  const selectedOrder: RecycleOrder | undefined = orders.find((o) => o.id === selectedOrderId);

  return (
    <div className="min-h-full bg-[#F4F8F6] pb-6">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[18px] font-bold text-slate-900">我的订单</h1>
          <button
            onClick={() => setActiveTab('home')}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建预约</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="grid grid-cols-5 gap-1.5 pb-0.5">
          {CATEGORY_TABS.map((tab) => {
            const active = catFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCatFilter(tab.id)}
                className={`py-1.5 rounded-full text-[11.5px] font-semibold transition text-center whitespace-nowrap ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Sub Status Filter */}
        <div className="flex items-center gap-4 mt-2.5 text-[12px]">
          {[
            { id: 'all', label: '全部状态' },
            { id: 'active', label: '进行中' },
            { id: 'completed', label: '已完成' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id as typeof statusFilter)}
              className={`pb-1 border-b-2 font-medium transition ${
                statusFilter === s.id
                  ? 'border-emerald-600 text-emerald-700 font-semibold'
                  : 'border-transparent text-slate-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </header>

      {/* Order Cards */}
      <div className="p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center">
            <EmptyInboxIllustration className="w-28 h-28" />
            <p className="text-[15px] font-bold text-slate-700 mt-3">暂无相关订单数据</p>
            <p className="text-[12px] text-slate-400 mt-1">去首页预约回收或扫码交投，开启低碳生活</p>
            <button
              onClick={() => setActiveTab('home')}
              className="mt-5 px-6 py-2.5 rounded-full bg-emerald-600 text-white text-[13px] font-semibold shadow-sm active:scale-95 transition"
            >
              立即去预约
            </button>
          </div>
        ) : (
          filtered.map((order) => {
            const st = STATUS_META[order.status];
            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 hover:border-emerald-200 transition cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg ${CAT_BADGE[order.category]}`}>
                      {order.categoryLabel}
                    </span>
                    <span className="text-[11px] text-slate-400 tabular-nums truncate">
                      {order.orderNo}
                    </span>
                  </div>
                  <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${st.cls}`}>
                    {st.label}
                  </span>
                </div>

                <div className="py-3 space-y-1.5">
                  <p className="text-[14px] font-bold text-slate-900">{order.itemsSummary}</p>
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                    <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{order.providerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>预约时间：{order.appointmentTime}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[12px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{order.addressText}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 mr-1.5">
                      {order.isFee ? '参考清运费' : '预估回收收益'}
                    </span>
                    <span
                      className={`text-[15px] font-extrabold tabular-nums ${
                        order.isFee ? 'text-orange-600' : 'text-emerald-600'
                      }`}
                    >
                      {order.isFee ? `¥${order.estimatedAmount.toFixed(0)}` : `+¥${order.estimatedAmount.toFixed(2)}`}
                    </span>
                    <span className="ml-2 text-[11px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md tabular-nums">
                      +{order.estimatedPoints}积分
                    </span>
                  </div>
                  <span className="text-[12px] text-slate-400 flex items-center">
                    详情 <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Detail Bottom Sheet */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[2px] flex items-end sm:items-center justify-center animate-fade-in"
          onClick={() => setSelectedOrderId(null)}
        >
          <div
            className="w-full max-w-[430px] max-h-[88vh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-slate-900">订单详情</h3>
                <p className="text-[11px] text-slate-400 tabular-nums">单号：{selectedOrder.orderNo}</p>
              </div>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {/* Status Summary */}
              <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-4 flex items-center justify-between">
                <div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${STATUS_META[selectedOrder.status].cls}`}>
                    {STATUS_META[selectedOrder.status].label}
                  </span>
                  <p className="text-[14px] font-bold text-slate-900 mt-2">{selectedOrder.itemsSummary}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5">{selectedOrder.providerName}</p>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-500">{selectedOrder.isFee ? '预估清运费' : '回收收益'}</div>
                  <div className={`text-xl font-extrabold tabular-nums ${selectedOrder.isFee ? 'text-orange-600' : 'text-emerald-600'}`}>
                    {selectedOrder.isFee ? `¥${selectedOrder.estimatedAmount}` : `+¥${selectedOrder.estimatedAmount.toFixed(2)}`}
                  </div>
                </div>
              </div>

              {/* Collector info */}
              {selectedOrder.collector && (
                <div className="rounded-2xl border border-slate-100 p-3.5 flex items-center justify-between bg-slate-50/70">
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">
                      服务专员：{selectedOrder.collector.name}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      车辆：{selectedOrder.collector.plateNo} · 电话：{selectedOrder.collector.phone}
                    </div>
                  </div>
                  <button
                    onClick={() => showToast(`正在模拟拨打 ${selectedOrder.collector?.phone}`, 'info')}
                    className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm active:scale-95 transition"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Address & Remarks */}
              <div className="rounded-2xl border border-slate-100 p-3.5 space-y-2 text-[12px]">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400 shrink-0">预约时间</span>
                  <span className="text-slate-800 font-medium text-right">{selectedOrder.appointmentTime}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400 shrink-0">联系人</span>
                  <span className="text-slate-800 font-medium text-right">
                    {selectedOrder.contactName} {selectedOrder.contactPhone}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400 shrink-0">服务地址</span>
                  <span className="text-slate-800 font-medium text-right">{selectedOrder.addressText}</span>
                </div>
                {selectedOrder.remarks && (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400 shrink-0">备注说明</span>
                    <span className="text-slate-700 text-right">{selectedOrder.remarks}</span>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-[13px] font-bold text-slate-900 mb-3">服务追踪进度</h4>
                <div className="space-y-3 pl-2">
                  {selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-5 pb-1 border-l-2 border-emerald-100 last:border-l-transparent">
                      <span
                        className={`absolute -left-[7px] top-0.5 w-3 h-3 rounded-full border-2 ${
                          step.done
                            ? 'bg-emerald-500 border-emerald-200'
                            : 'bg-white border-slate-300'
                        }`}
                      />
                      <div className="flex items-center justify-between">
                        <span className={`text-[13px] font-semibold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </span>
                        <span className="text-[11px] text-slate-400 tabular-nums">{step.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            {(selectedOrder.status === 'pending' || selectedOrder.status === 'assigned') && (
              <div className="p-4 border-t border-slate-100 grid grid-cols-2 gap-3 bg-slate-50/70">
                <button
                  onClick={() => {
                    cancelOrder(selectedOrder.id);
                    setSelectedOrderId(null);
                  }}
                  className="py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-[13px] flex items-center justify-center gap-1 active:scale-[0.98] transition"
                >
                  <XCircle className="w-4 h-4" />
                  <span>取消预约</span>
                </button>
                <button
                  onClick={() => completeOrder(selectedOrder.id)}
                  className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-[13px] flex items-center justify-center gap-1 shadow-sm active:scale-[0.98] transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>模拟完成结算</span>
                </button>
              </div>
            )}
            {selectedOrder.status === 'completed' && (
              <div className="p-4 border-t border-slate-100 bg-emerald-50/50 text-center text-[12px] text-emerald-700 font-medium flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>本订单已完成环保闭环，感谢您为北京减碳助力！</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
