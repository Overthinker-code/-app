import type { Address } from '../types';

export function bookingContact(address: Address) {
  return {
    addressText: `${address.region}${address.street} ${address.community} ${address.detail}`,
    contactName: address.contactName,
    contactPhone: address.phone,
  };
}

export function setBookingQuantity(quantities: Record<string, number>, id: string, quantity: number) {
  if (quantity !== 0) return { ...quantities, [id]: quantity };
  const next = { ...quantities };
  delete next[id];
  return next;
}
