export type TabId = 'home' | 'orders' | 'profile';

export type OrderCategory = 'recyclable' | 'bulky' | 'renovation' | 'appliance';

export type OrderStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface UserProfile {
  nickname: string;
  phone: string;
  gender: 'male' | 'female' | 'unset';
  birthday: string;
  birthdayLocked: boolean;
  district: string;
  community: string;
  points: number;
  carbonSavedKg: number;
  totalCashEarned: number;
  quizClaimed: boolean;
}

export interface Address {
  id: string;
  contactName: string;
  phone: string;
  region: string;    // 南京市玄武区
  street: string;    // 孝陵卫街道
  community: string; // 银城东苑
  detail: string;    // 18幢2单元501室
  isDefault: boolean;
}

export interface StationPoint {
  id: string;
  type: 'smart_machine' | 'fixed_station' | 'sorting_center';
  name: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  hours: string;
  status: 'online' | 'busy' | 'maintenance';
  capacityPercent: number;
  categories: string[];
  phone?: string;
  priceHighlight: string;
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
  manifestNo?: string; // 南京清运电子联单编号
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
  estimatedAmount: number;
  isFee: boolean;
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
  licenseNo: string;
  creditGrade: 'AAA' | 'AA' | 'A';
  rating: number;
  orderCount: number;
  distanceKm: number;
  pricing: {
    perBag: number;
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
  aliases?: string;
  category: '可回收物' | '厨余垃圾' | '有害垃圾' | '其他垃圾' | '大件垃圾' | '装修垃圾' | '废旧家电';
  tip: string;
  actionRoute?: string;
}

export interface QuizQuestion {
  id: string;
  item: string;
  context: string;
  options: ('可回收物' | '厨余垃圾' | '有害垃圾' | '其他垃圾')[];
  answer: '可回收物' | '厨余垃圾' | '有害垃圾' | '其他垃圾';
  explanation: string;
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
  | { name: 'address_list'; selectMode?: boolean }
  | { name: 'address_edit'; editId?: string }
  | { name: 'usage_guide'; initialQuery?: string }
  | { name: 'user_agreement' }
  | { name: 'points_mall' };
