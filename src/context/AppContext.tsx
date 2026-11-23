import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  Address,
  AppRoute,
  RecycleOrder,
  TabId,
  UserProfile,
} from '../types';
import {
  DEFAULT_ADDRESSES,
  DEFAULT_USER,
  INITIAL_ORDERS,
} from '../data/mockData';

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  user: UserProfile;
  updateUser: (patch: Partial<UserProfile>) => void;
  addresses: Address[];
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  addAddress: (addr: Omit<Address, 'id'>) => Address;
  updateAddress: (id: string, patch: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  orders: RecycleOrder[];
  createOrder: (order: Omit<RecycleOrder, 'id' | 'orderNo' | 'manifestNo' | 'createdAt' | 'timeline'>) => RecycleOrder;
  cancelOrder: (id: string) => void;
  completeOrder: (id: string) => void;
  addQuickDropoff: (weightKg: number, cashEarned: number, points: number, stationName: string, categoryText: string) => void;
  redeemReward: (pointsCost: number, rewardName: string) => boolean;
  claimQuizReward: () => void;
  resetLocalData: () => void;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  route: AppRoute;
  navigate: (next: AppRoute) => void;
  goBack: () => void;
  goHome: () => void;
  showScanner: boolean;
  setShowScanner: (v: boolean) => void;
  showQrModal: boolean;
  setShowQrModal: (v: boolean) => void;
  showAppliancePicker: boolean;
  setShowAppliancePicker: (v: boolean) => void;
  toast: ToastMessage | null;
  showToast: (text: string, type?: ToastMessage['type']) => void;
}

const STORAGE_KEY = 'ninghuishou_nj_v2';

const AppContext = createContext<AppContextType | null>(null);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const saved = loadState();
  const [user, setUser] = useState<UserProfile>(saved?.user ?? DEFAULT_USER);
  const [addresses, setAddresses] = useState<Address[]>(saved?.addresses ?? DEFAULT_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    saved?.selectedAddressId ?? (saved?.addresses?.[0]?.id ?? DEFAULT_ADDRESSES[0].id)
  );
  const [orders, setOrders] = useState<RecycleOrder[]>(saved?.orders ?? INITIAL_ORDERS);

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [routeStack, setRouteStack] = useState<AppRoute[]>([{ name: 'tabs' }]);
  const [showScanner, setShowScanner] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAppliancePicker, setShowAppliancePicker] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user, addresses, selectedAddressId, orders })
      );
    } catch {
      // ignore storage quota errors
    }
  }, [user, addresses, selectedAddressId, orders]);

  const showToast = (text: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now();
    setToast({ id, text, type });
    window.setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 2400);
  };

  const route = routeStack[routeStack.length - 1];

  const navigate = (next: AppRoute) => {
    setRouteStack((prev) => [...prev, next]);
  };

  const goBack = () => {
    setRouteStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : [{ name: 'tabs' }]));
  };

  const goHome = () => {
    setRouteStack([{ name: 'tabs' }]);
    setActiveTab('home');
  };

  const updateUser = (patch: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...patch }));
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = { ...addr, id: 'addr-nj-' + Date.now() };
    setAddresses((prev) => {
      const base = newAddr.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev;
      return [newAddr, ...base];
    });
    if (newAddr.isDefault || addresses.length === 0) {
      setSelectedAddressId(newAddr.id);
    }
    return newAddr;
  };

  const updateAddress = (id: string, patch: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) return { ...a, ...patch };
        if (patch.isDefault) return { ...a, isDefault: false };
        return a;
      })
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (selectedAddressId === id && next.length > 0) {
        setSelectedAddressId(next[0].id);
      }
      return next;
    });
  };

  const formatNow = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const createOrder: AppContextType['createOrder'] = (input) => {
    const nowStr = formatNow();
    const shortTime = nowStr.slice(5);
    const suffix = Date.now().toString().slice(-6);
    const orderNo = 'NJ2026' + suffix;
    const manifestNo = `LD-NJ-${suffix.slice(-4)}`;
    const newOrder: RecycleOrder = {
      ...input,
      id: 'ord-nj-' + Date.now(),
      orderNo,
      manifestNo,
      createdAt: nowStr,
      collector: {
        name: '王师傅',
        phone: '13851904412',
        plateNo: '苏A·D6185',
      },
      timeline: [
        {
          time: shortTime,
          title: '预约已提交',
          desc: `已推送至 ${input.providerName}`,
          done: true,
        },
        {
          time: '约30分钟内',
          title: '调度派单确认',
          desc: '清运/回收人员接单后将提前致电联系',
          done: false,
        },
        {
          time: '待服务',
          title: input.isFee ? '现场清运与联单核销' : '当面称重与结算',
          desc: input.isFee ? '规范收运至备案处置场并出具电子联单' : '确认重量成色后即时结款并计入积分',
          done: false,
        },
      ],
    };
    setOrders((prev) => [newOrder, ...prev]);
    setUser((prev) => ({
      ...prev,
      points: prev.points + 10,
    }));
    return newOrder;
  };

  const cancelOrder = (id: string) => {
    const shortTime = formatNow().slice(5);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: 'cancelled',
              timeline: [
                ...o.timeline,
                { time: shortTime, title: '订单已取消', desc: '居民主动取消本次预约', done: true },
              ],
            }
          : o
      )
    );
    showToast('已取消该预约单', 'info');
  };

  const completeOrder = (id: string) => {
    const target = orders.find((o) => o.id === id);
    if (!target || target.status === 'completed') return;
    const shortTime = formatNow().slice(5);
    const carbonGain = Number((target.estimatedWeightKg * 1.45).toFixed(1));
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: 'completed',
              timeline: [
                ...o.timeline.map((t) => ({ ...t, done: true })),
                {
                  time: shortTime,
                  title: '核验完成并已结算',
                  desc: o.isFee
                    ? `已完成合规清运，联单 ${o.manifestNo ?? ''} 已归档，+${o.estimatedPoints} 积分`
                    : `回收款 ¥${o.estimatedAmount.toFixed(2)} 已结算，+${o.estimatedPoints} 积分`,
                  done: true,
                },
              ],
            }
          : o
      )
    );
    setUser((prev) => ({
      ...prev,
      points: prev.points + target.estimatedPoints,
      carbonSavedKg: Number((prev.carbonSavedKg + carbonGain).toFixed(1)),
      totalCashEarned: target.isFee
        ? prev.totalCashEarned
        : Number((prev.totalCashEarned + target.estimatedAmount).toFixed(2)),
    }));
    showToast(`结算完成，+${target.estimatedPoints} 积分`, 'success');
  };

  const addQuickDropoff: AppContextType['addQuickDropoff'] = (
    weightKg,
    cashEarned,
    points,
    stationName,
    categoryText
  ) => {
    const nowStr = formatNow();
    const shortTime = nowStr.slice(5);
    const carbonGain = Number((weightKg * 1.6).toFixed(1));
    const suffix = Date.now().toString().slice(-6);
    const order: RecycleOrder = {
      id: 'ord-nj-' + Date.now(),
      orderNo: 'NJ2026' + suffix,
      manifestNo: `LD-NJ-SM-${suffix.slice(-4)}`,
      category: 'recyclable',
      categoryLabel: '智能回收柜投递',
      status: 'completed',
      createdAt: nowStr,
      appointmentTime: '现场扫码投递',
      addressText: stationName,
      contactName: user.nickname,
      contactPhone: user.phone,
      providerName: '宁回收社区智能终端',
      itemsSummary: `${categoryText} ${weightKg.toFixed(1)}kg`,
      estimatedAmount: cashEarned,
      isFee: false,
      estimatedPoints: points,
      estimatedWeightKg: weightKg,
      timeline: [
        { time: shortTime, title: '扫码开箱', desc: `已连接 ${stationName}`, done: true },
        { time: shortTime, title: '称重计量完成', desc: `品名：${categoryText}，净重 ${weightKg.toFixed(1)}kg`, done: true },
        { time: shortTime, title: '余额已入账', desc: `入账 ¥${cashEarned.toFixed(2)}，累计 +${points} 积分`, done: true },
      ],
    };
    setOrders((prev) => [order, ...prev]);
    setUser((prev) => ({
      ...prev,
      points: prev.points + points,
      carbonSavedKg: Number((prev.carbonSavedKg + carbonGain).toFixed(1)),
      totalCashEarned: Number((prev.totalCashEarned + cashEarned).toFixed(2)),
    }));
  };

  const redeemReward = (pointsCost: number, rewardName: string) => {
    if (user.points < pointsCost) {
      showToast('当前积分不足', 'warning');
      return false;
    }
    setUser((prev) => ({ ...prev, points: prev.points - pointsCost }));
    showToast(`已兑换「${rewardName}」`, 'success');
    return true;
  };

  const claimQuizReward = () => {
    if (user.quizClaimed) return;
    setUser((prev) => ({ ...prev, points: prev.points + 20, quizClaimed: true }));
    showToast('测验完成，已发放 +20 积分', 'success');
  };

  const resetLocalData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(DEFAULT_USER);
    setAddresses(DEFAULT_ADDRESSES);
    setSelectedAddressId(DEFAULT_ADDRESSES[0].id);
    setOrders(INITIAL_ORDERS);
    setRouteStack([{ name: 'tabs' }]);
    setActiveTab('home');
    showToast('已恢复初始数据', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        addAddress,
        updateAddress,
        deleteAddress,
        orders,
        createOrder,
        cancelOrder,
        completeOrder,
        addQuickDropoff,
        redeemReward,
        claimQuizReward,
        resetLocalData,
        activeTab,
        setActiveTab,
        route,
        navigate,
        goBack,
        goHome,
        showScanner,
        setShowScanner,
        showQrModal,
        setShowQrModal,
        showAppliancePicker,
        setShowAppliancePicker,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
