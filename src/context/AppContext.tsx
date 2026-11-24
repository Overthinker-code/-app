import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type {
  Address,
  AppRoute,
  RecycleOrder,
  TabId,
  UserProfile,
} from '../types';
import { DEFAULT_DATA, loadLocalData, STORAGE_KEY } from './localData';
import type { LocalData } from './localData';

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'info' | 'warning';
}

type EditableProfile = Pick<UserProfile, 'nickname' | 'phone' | 'gender' | 'birthday' | 'birthdayLocked' | 'district' | 'community'>;

interface AppContextType {
  user: UserProfile;
  updateUser: (patch: Partial<EditableProfile>) => void;
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
  storageIssue: boolean;
  toast: ToastMessage | null;
  showToast: (text: string, type?: ToastMessage['type']) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snapshot, setSnapshot] = useState(loadLocalData);
  const snapshotRef = useRef(snapshot);
  const { user, addresses, selectedAddressId, orders } = snapshot.data;

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [routeStack, setRouteStack] = useState<AppRoute[]>([{ name: 'tabs' }]);
  const [showScanner, setShowScanner] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAppliancePicker, setShowAppliancePicker] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const syncStorage = (event: StorageEvent) => {
      if ((event.key !== STORAGE_KEY && event.key !== null) || event.storageArea !== localStorage) return;
      const cleared = event.newValue === null;
      // Keep this tab's unsaved edits on ordinary updates. A reset also clears this tab.
      if (!cleared && snapshotRef.current.storageIssue) return;

      const next = loadLocalData();
      if (next.storageIssue) return;
      snapshotRef.current = next;
      setSnapshot(next);
      if (cleared) {
        setRouteStack([{ name: 'tabs' }]);
        setActiveTab('home');
        setShowScanner(false);
        setShowQrModal(false);
        setShowAppliancePicker(false);
        setToast(null);
      }
    };
    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);

  const saveData = (data: LocalData, reset = false) => {
    let storageIssue = false;
    try {
      if (reset) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      storageIssue = true;
    }
    // Set the live snapshot before the next action, even if React has not rendered yet.
    const next = { data, storageIssue };
    snapshotRef.current = next;
    setSnapshot(next);
    return !storageIssue;
  };

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

  const updateUser = (patch: Partial<EditableProfile>) => {
    const data = snapshotRef.current.data;
    saveData({ ...data, user: { ...data.user, ...patch } });
  };

  const setSelectedAddressId = (id: string) => {
    const data = snapshotRef.current.data;
    if (id !== data.selectedAddressId && data.addresses.some((address) => address.id === id)) {
      saveData({ ...data, selectedAddressId: id });
    }
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    const data = snapshotRef.current.data;
    const newAddr: Address = { ...addr, id: 'addr-nj-' + Date.now() };
    const otherAddresses = newAddr.isDefault
      ? data.addresses.map((address) => ({ ...address, isDefault: false }))
      : data.addresses;
    saveData({
      ...data,
      addresses: [newAddr, ...otherAddresses],
      selectedAddressId: newAddr.isDefault || otherAddresses.length === 0 ? newAddr.id : data.selectedAddressId,
    });
    return newAddr;
  };

  const updateAddress = (id: string, patch: Partial<Address>) => {
    const data = snapshotRef.current.data;
    if (!data.addresses.some((address) => address.id === id)) return;
    saveData({
      ...data,
      addresses: data.addresses.map((address) => {
        if (address.id === id) return { ...address, ...patch };
        return patch.isDefault ? { ...address, isDefault: false } : address;
      }),
    });
  };

  const deleteAddress = (id: string) => {
    const data = snapshotRef.current.data;
    const next = data.addresses.filter((address) => address.id !== id);
    if (next.length === data.addresses.length) return;
    saveData({
      ...data,
      addresses: next,
      selectedAddressId: data.selectedAddressId === id ? next[0]?.id ?? '' : data.selectedAddressId,
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
          desc: `模拟派单对象：${input.providerName}`,
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
    const data = snapshotRef.current.data;
    saveData({
      ...data,
      orders: [newOrder, ...data.orders],
      user: { ...data.user, points: data.user.points + 10 },
    });
    return newOrder;
  };

  const cancelOrder = (id: string) => {
    const data = snapshotRef.current.data;
    const target = data.orders.find((order) => order.id === id);
    if (target?.status !== 'pending' && target?.status !== 'assigned') return;

    const shortTime = formatNow().slice(5);
    saveData({
      ...data,
      orders: data.orders.map((order) => order === target
        ? {
            ...order,
            status: 'cancelled',
            timeline: [
              ...order.timeline,
              { time: shortTime, title: '订单已取消', desc: '居民主动取消本次预约', done: true },
            ],
          }
        : order),
    });
    showToast('已取消该预约单', 'info');
  };

  const completeOrder = (id: string) => {
    const data = snapshotRef.current.data;
    const target = data.orders.find((order) => order.id === id);
    if (target?.status !== 'pending' && target?.status !== 'assigned') return;

    const shortTime = formatNow().slice(5);
    const carbonGain = Number((target.estimatedWeightKg * 1.45).toFixed(1));
    const { user } = data;
    saveData({
      ...data,
      orders: data.orders.map((order) => order === target
        ? {
            ...order,
            status: 'completed',
            timeline: [
              ...order.timeline.map((item) => ({ ...item, done: true })),
              {
                time: shortTime,
                title: '核验完成并已结算',
                desc: order.isFee
                  ? `已完成合规清运，联单 ${order.manifestNo ?? ''} 已归档，+${order.estimatedPoints} 积分`
                  : `回收款 ¥${order.estimatedAmount.toFixed(2)} 已结算，+${order.estimatedPoints} 积分`,
                done: true,
              },
            ],
          }
        : order),
      user: {
        ...user,
        points: user.points + target.estimatedPoints,
        carbonSavedKg: Number((user.carbonSavedKg + carbonGain).toFixed(1)),
        totalCashEarned: target.isFee
          ? user.totalCashEarned
          : Number((user.totalCashEarned + target.estimatedAmount).toFixed(2)),
      },
    });
    showToast(`演示结算完成，+${target.estimatedPoints} 积分`, 'success');
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
    const data = snapshotRef.current.data;
    const { user } = data;
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
    saveData({
      ...data,
      orders: [order, ...data.orders],
      user: {
        ...user,
        points: user.points + points,
        carbonSavedKg: Number((user.carbonSavedKg + carbonGain).toFixed(1)),
        totalCashEarned: Number((user.totalCashEarned + cashEarned).toFixed(2)),
      },
    });
  };

  const redeemReward = (pointsCost: number, rewardName: string) => {
    const data = snapshotRef.current.data;
    if (!Number.isSafeInteger(pointsCost) || pointsCost <= 0) return false;
    if (data.user.points < pointsCost) {
      showToast('当前积分不足', 'warning');
      return false;
    }
    saveData({ ...data, user: { ...data.user, points: data.user.points - pointsCost } });
    showToast(`已兑换「${rewardName}」`, 'success');
    return true;
  };

  const claimQuizReward = () => {
    const data = snapshotRef.current.data;
    if (data.user.quizClaimed) return;
    saveData({ ...data, user: { ...data.user, points: data.user.points + 20, quizClaimed: true } });
    showToast('测验完成，已发放 +20 积分', 'success');
  };

  const resetLocalData = () => {
    const cleared = saveData(DEFAULT_DATA, true);
    setRouteStack([{ name: 'tabs' }]);
    setActiveTab('home');
    showToast(cleared ? '已恢复初始数据' : '浏览器未能清除已保存的数据', cleared ? 'info' : 'warning');
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
        storageIssue: snapshot.storageIssue,
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
