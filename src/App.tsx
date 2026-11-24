import React, { useEffect, useRef } from 'react';
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
  const { activeTab, route, storageIssue } = useApp();
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
        return <UsageGuidePage initialQuery={route.initialQuery} />;
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
    <div className="min-h-screen bg-[#EAEAE6] flex items-center justify-center sm:py-5">
      <div className="w-full sm:w-[414px] h-[100dvh] sm:h-[812px] sm:max-h-[94vh] bg-[#F4F4F1] sm:rounded-[28px] sm:shadow-[0_18px_50px_-18px_rgba(0,0,0,0.22)] sm:border sm:border-black/10 overflow-hidden flex flex-col relative">
        {storageIssue && (
          <p role="status" className="px-3.5 py-2 text-[12px] bg-amber-50 text-amber-900 shrink-0">
            浏览器存储不可用或已满，本次更改可能在刷新后丢失。
          </p>
        )}
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
