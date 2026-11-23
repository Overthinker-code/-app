import React, { useEffect, useRef } from 'react';
import { Leaf, Smartphone, Recycle, ShieldCheck } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { BottomTabBar, ToastBanner } from './components/Layout';
import {
  AppliancePickerModal,
  QrCodeModal,
  ScannerModal,
} from './components/Modals';
import { HomePage } from './pages/HomePage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import {
  NearbyStationsPage,
  RecyclablesBookingPage,
  RecyclablesHubPage,
} from './pages/RecyclablesPages';
import { BulkyBookingPage } from './pages/BulkyBookingPage';
import {
  RenovationBookingPage,
  RenovationHubPage,
  RenovationUnitsPage,
} from './pages/RenovationPages';
import { ApplianceBookingPage } from './pages/ApplianceBookingPage';
import {
  AddressEditPage,
  AddressListPage,
  PointsMallPage,
  ProfileInfoPage,
  UsageGuidePage,
  UserAgreementPage,
} from './pages/ProfileSubPages';

const AppShell: React.FC = () => {
  const { activeTab, route } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [route, activeTab]);

  const renderScreen = () => {
    switch (route.name) {
      case 'tabs':
        if (activeTab === 'orders') return <OrdersPage />;
        if (activeTab === 'profile') return <ProfilePage />;
        return <HomePage />;
      case 'recyclables_hub':
        return <RecyclablesHubPage />;
      case 'nearby_stations':
        return <NearbyStationsPage stationType={route.stationType} />;
      case 'recyclables_booking':
        return <RecyclablesBookingPage />;
      case 'bulky_booking':
        return <BulkyBookingPage />;
      case 'renovation_hub':
        return <RenovationHubPage />;
      case 'renovation_booking':
        return <RenovationBookingPage />;
      case 'renovation_units':
        return <RenovationUnitsPage />;
      case 'appliance_booking':
        return <ApplianceBookingPage initialProvider={route.initialProvider} />;
      case 'profile_info':
        return <ProfileInfoPage />;
      case 'address_list':
        return <AddressListPage selectMode={route.selectMode} />;
      case 'address_edit':
        return <AddressEditPage editId={route.editId} />;
      case 'usage_guide':
        return <UsageGuidePage />;
      case 'user_agreement':
        return <UserAgreementPage />;
      case 'points_mall':
        return <PointsMallPage />;
      default:
        return <HomePage />;
    }
  };

  const showBottomTabs = route.name === 'tabs';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E2F2EC] via-[#EDF5F2] to-[#E6EFF4] flex items-center justify-center sm:py-6 sm:px-6">
      <div className="w-full max-w-[960px] flex items-center justify-center gap-10">
        {/* Desktop Ambient Info Side Panel (Hidden on small/mobile screens) */}
        <aside className="hidden lg:flex flex-col max-w-[340px] space-y-5">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white/80 border border-emerald-200/80 text-emerald-700 text-xs font-bold shadow-sm">
            <Leaf className="w-3.5 h-3.5" />
            <span>京彩回收 · 全功能智慧升级版 App</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
            废品回收与垃圾清运
            <span className="block text-emerald-600 mt-1">一站式绿色循环平台</span>
          </h1>
          <p className="text-[14px] text-slate-600 leading-relaxed">
            完整复刻并深度优化原微信小程序全部模块：统一视觉体系，补全附近回收机地图视图、大件透明价格表、装修垃圾双步向导、家电即时估价、全品类订单追踪与垃圾分类查询器。
          </p>
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3 bg-white/75 backdrop-blur-sm rounded-2xl p-3.5 border border-white">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Recycle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-slate-900">四大回收场景全闭环</div>
                <div className="text-[12px] text-slate-500">可回收物、大件家具、装修垃圾、废旧家电均支持完整下单与结算模拟</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/75 backdrop-blur-sm rounded-2xl p-3.5 border border-white">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-slate-900">原生级移动交互体验</div>
                <div className="text-[12px] text-slate-500">支持扫码开箱模拟、动态交投码、本地数据持久化与 PWA 主屏安装</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/75 backdrop-blur-sm rounded-2xl p-3.5 border border-white">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-slate-900">修复原版多处体验短板</div>
                <div className="text-[12px] text-slate-500">补全空使用说明、空投递点列表、割裂装修H5页及订单缺失分类</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile App Viewport Container */}
        <div className="w-full sm:w-[414px] h-[100dvh] sm:h-[820px] sm:max-h-[92vh] bg-[#F4F8F6] sm:rounded-[40px] sm:shadow-[0_24px_70px_-16px_rgba(6,78,59,0.28)] sm:ring-[10px] sm:ring-slate-900/90 overflow-hidden flex flex-col relative">
          <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative">
            {renderScreen()}
          </div>
          {showBottomTabs && <BottomTabBar />}
          <ToastBanner />
          <ScannerModal />
          <QrCodeModal />
          <AppliancePickerModal />
        </div>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
