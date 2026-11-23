export type TabId = 'home' | 'orders' | 'profile';

export type OrderCategory = 'recyclable' | 'bulky' | 'renovation' | 'appliance';

export type OrderStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface UserProfile {
  nickname: string;
  phone: string;
  gender: 'male' | 'female' | 'unset';
  birthday: string;
  birthdayLocked: boolean;
  community: string;
  points: number;
  carbonSavedKg: number;
  totalCashEarned: number;
  avatarId: string;
}

export interface Address {
  id: string;
  contactName: string;
  phone: string;
  region: string; // e.g., 北京市朝阳区
  street: string; // e.g., 望京街道
  community: string; // e.g., 丽岛花园
  detail: string; // e.g., 3号楼2单元802室
  isDefault: boolean;
}

export interface StationPoint {
  id: string;
  type: 'smart_machine' | 'fixed_station' | 'sorting_center';
  name: string;
  address: string;
  distanceMeters: number;
  hours: string;
  status: 'online' | 'busy' | 'maintenance';
  capacityPercent: number; // 0-100 full
  categories: string[];
  phone?: string;
  priceHighlight: string;
  xPercent: number; // for interactive visual map
  yPercent: number;
}

export interface OrderTimelineItem {
  time: string;
  title: string;
  desc: string;
  done: boolean;
}

export interface RecycleOrder {
  id: string;
  orderNo: string;
  category: OrderCategory;
  categoryLabel: string;
  status: OrderStatus;
  createdAt: string;
  appointmentTime: string;
  addressText: string;
  contactName: string;
  contactPhone: string;
  providerName: string;
  itemsSummary: string;
  estimatedAmount: number; // positive = payout to user, negative = service fee paid by user
  isFee: boolean; // true for paid hauling (bulky/renovation), false for cash payout (recyclable/appliance)
  estimatedPoints: number;
  estimatedWeightKg: number;
  remarks?: string;
  photos?: string[];
  hasElevator?: boolean;
  collector?: {
    name: string;
    phone: string;
    plateNo?: string;
  };
  timeline: OrderTimelineItem[];
}

export interface DisposalUnit {
  id: string;
  name: string;
  district: string;
  address: string;
  manager: string;
  phone: string;
  creditGrade: 'AAA' | 'AA' | 'A';
  rating: number;
  orderCount: number;
  distanceKm: number;
  pricing: {
    perBag: number; // 90x120cm standard bag
    perCubicMeter: number;
    minCharge: number;
    note: string;
  };
}

export interface KnowledgeArticle {
  id: string;
  tab: 'policy' | 'guide' | 'activity';
  title: string;
  source: string;
  date: string;
  tag: string;
  summary: string;
  content: string[];
}

export interface WasteSearchItem {
  name: string;
  category: '可回收物' | '厨余垃圾' | '有害垃圾' | '其他垃圾' | '大件垃圾' | '装修垃圾' | '废旧家电';
  tip: string;
  actionRoute?: string;
}

export type AppRoute =
  | { name: 'tabs' }
  | { name: 'recyclables_hub' }
  | { name: 'nearby_stations'; stationType: 'smart_machine' | 'fixed_station' | 'sorting_center' }
  | { name: 'recyclables_booking' }
  | { name: 'bulky_booking' }
  | { name: 'renovation_hub' }
  | { name: 'renovation_booking' }
  | { name: 'renovation_units' }
  | { name: 'appliance_booking'; initialProvider?: string }
  | { name: 'profile_info' }
  | { name: 'address_list'; selectMode?: boolean; returnTo?: AppRoute }
  | { name: 'address_edit'; editId?: string }
  | { name: 'usage_guide' }
  | { name: 'user_agreement' }
  | { name: 'points_mall' };
