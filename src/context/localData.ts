import { DEFAULT_ADDRESSES, DEFAULT_USER, INITIAL_ORDERS } from '../data/mockData';
import type { Address, OrderTimelineItem, RecycleOrder, UserProfile } from '../types';

export const STORAGE_KEY = 'ninghuishou_nj_v2';

export interface LocalData {
  user: UserProfile;
  addresses: Address[];
  selectedAddressId: string;
  orders: RecycleOrder[];
}

export const DEFAULT_DATA: LocalData = {
  user: DEFAULT_USER,
  addresses: DEFAULT_ADDRESSES,
  selectedAddressId: DEFAULT_ADDRESSES[0].id,
  orders: INITIAL_ORDERS,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasStrings(record: Record<string, unknown>, keys: string[]) {
  return keys.every((key) => typeof record[key] === 'string');
}

function isAddress(value: unknown): value is Address {
  return isRecord(value)
    && hasStrings(value, ['id', 'contactName', 'phone', 'region', 'street', 'community', 'detail'])
    && typeof value.isDefault === 'boolean';
}

function isTimelineItem(value: unknown): value is OrderTimelineItem {
  return isRecord(value)
    && hasStrings(value, ['time', 'title', 'desc'])
    && typeof value.done === 'boolean';
}

type OrderCore = Omit<RecycleOrder, 'manifestNo' | 'remarks' | 'hasElevator' | 'photos' | 'collector' | 'timeline'>;

function isOrderCore(value: unknown): value is OrderCore & Record<string, unknown> {
  return isRecord(value)
    && hasStrings(value, [
      'id', 'orderNo', 'categoryLabel', 'createdAt', 'appointmentTime', 'addressText',
      'contactName', 'contactPhone', 'providerName', 'itemsSummary',
    ])
    && ['recyclable', 'bulky', 'renovation', 'appliance'].some((category) => category === value.category)
    && ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'].some((status) => status === value.status)
    && typeof value.isFee === 'boolean'
    && [value.estimatedAmount, value.estimatedPoints, value.estimatedWeightKg].every(Number.isFinite);
}

function isCollector(value: unknown): value is NonNullable<RecycleOrder['collector']> {
  return isRecord(value) && hasStrings(value, ['name', 'phone'])
    && (value.plateNo === undefined || typeof value.plateNo === 'string');
}

function restoreOrder(value: unknown): RecycleOrder[] {
  if (!isOrderCore(value)) return [];

  return [{
    ...value,
    manifestNo: typeof value.manifestNo === 'string' ? value.manifestNo : undefined,
    remarks: typeof value.remarks === 'string' ? value.remarks : undefined,
    hasElevator: typeof value.hasElevator === 'boolean' ? value.hasElevator : undefined,
    photos: Array.isArray(value.photos) ? value.photos.filter((photo) => typeof photo === 'string') : undefined,
    collector: isCollector(value.collector) ? value.collector : undefined,
    timeline: Array.isArray(value.timeline) ? value.timeline.filter(isTimelineItem) : [],
  }];
}

function restoreUser(value: unknown): UserProfile {
  if (!isRecord(value)) return DEFAULT_USER;

  const user = { ...DEFAULT_USER };
  for (const key of ['nickname', 'phone', 'birthday', 'district', 'community'] as const) {
    if (typeof value[key] === 'string') user[key] = value[key];
  }
  for (const key of ['points', 'carbonSavedKg', 'totalCashEarned'] as const) {
    if (typeof value[key] === 'number' && Number.isFinite(value[key])) user[key] = value[key];
  }
  for (const key of ['birthdayLocked', 'quizClaimed'] as const) {
    if (typeof value[key] === 'boolean') user[key] = value[key];
  }
  if (value.gender === 'male' || value.gender === 'female' || value.gender === 'unset') {
    user.gender = value.gender;
  }
  return user;
}

export function loadLocalData(): { data: LocalData; storageIssue: boolean } {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return { data: DEFAULT_DATA, storageIssue: true };
  }

  try {
    const saved: unknown = raw ? JSON.parse(raw) : null;
    if (isRecord(saved)) {
      const addresses = Array.isArray(saved.addresses) ? saved.addresses.filter(isAddress) : DEFAULT_ADDRESSES;
      const selected = addresses.find((address) => address.id === saved.selectedAddressId);
      return {
        data: {
          user: restoreUser(saved.user),
          addresses,
          selectedAddressId: (selected ?? addresses[0])?.id ?? '',
          orders: Array.isArray(saved.orders) ? saved.orders.flatMap(restoreOrder) : INITIAL_ORDERS,
        },
        storageIssue: false,
      };
    }
  } catch {
    // Keep the stored value intact until the resident makes a change.
  }
  return { data: DEFAULT_DATA, storageIssue: false };
}
