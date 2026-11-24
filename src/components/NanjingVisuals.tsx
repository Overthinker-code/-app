import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Package,
  Milk,
  Wrench,
  Shirt,
  Wine,
  Cpu,
  Sofa,
  BedDouble,
  DoorClosed,
  Armchair,
  BookMarked,
  Refrigerator,
  Waves,
  Wind,
  Tv,
  Flame,
  Microwave,
  Monitor,
  Plug,
  ShoppingBag,
  TrainFront,
  Ticket,
  Store,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const NingLogoMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" rx="9" fill="#1D6F5A" />
    <path
      d="M11 16.5C11.8 12.8 15 10 19 10C22.2 10 24.9 11.8 26.2 14.5"
      stroke="#FFFFFF"
      strokeWidth="2.3"
      strokeLinecap="round"
    />
    <path d="M23.2 14.4L26.5 14.9L26.9 11.6" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M25 19.5C24.2 23.2 21 26 17 26C13.8 26 11.1 24.2 9.8 21.5"
      stroke="#A7F3D0"
      strokeWidth="2.3"
      strokeLinecap="round"
    />
    <path d="M12.8 21.6L9.5 21.1L9.1 24.4" stroke="#A7F3D0" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="18" cy="18" r="2.2" fill="#FFFFFF" />
  </svg>
);

/**
 * 真实可扫描 SVG 二维码组件（基于 qrcode 库生成标准 QR Matrix）
 */
export const RealQrCode: React.FC<{ value: string; size?: number; className?: string }> = ({
  value,
  size = 180,
  className = '',
}) => {
  const [qrImage, setQrImage] = useState<{ value: string; size: number; src: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    QRCode.toString(value, {
      type: 'svg',
      margin: 1,
      width: size,
      color: { dark: '#18181B', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    })
      .then((svg) => {
        if (mounted) setQrImage({ value, size, src: `data:image/svg+xml,${encodeURIComponent(svg)}` });
      })
      .catch(() => {
        if (mounted) setQrImage(null);
      });
    return () => {
      mounted = false;
    };
  }, [value, size]);

  if (qrImage?.value !== value || qrImage.size !== size) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-lg bg-zinc-100 animate-pulse ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`overflow-hidden rounded-lg ${className}`}
    >
      <img src={qrImage.src} alt="演示二维码" className="block w-full h-full" />
    </div>
  );
};

const ITEM_ICONS: Record<string, LucideIcon> = {
  paper: Package,
  plastic: Milk,
  metal: Wrench,
  textile: Shirt,
  glass: Wine,
  ewaste: Cpu,
  'sofa-3': Sofa,
  'sofa-1': Armchair,
  chair: Armchair,
  mattress: BedDouble,
  bedframe: BedDouble,
  wardrobe: DoorClosed,
  table: BookMarked,
  bookshelf: BookMarked,
  fridge: Refrigerator,
  washer: Waves,
  ac: Wind,
  tv: Tv,
  heater: Flame,
  microwave: Microwave,
  pc: Monitor,
  small: Plug,
  'rw-1': ShoppingBag,
  'rw-2': TrainFront,
  'rw-3': Ticket,
  'rw-4': Store,
};

export function ItemIcon({ id, className = 'w-4 h-4' }: { id: string; className?: string }) {
  const Icon = Object.hasOwn(ITEM_ICONS, id) ? ITEM_ICONS[id] : Package;
  return <Icon className={className} />;
}
