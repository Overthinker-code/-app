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

/**
 * 南京城市天际线简约线条插画（紫金山轮廓 + 紫峰大厦 + 明城墙垛口 + 梧桐叶）
 * 极简克制的暖青石双色调，去AI塑料感与渐变光晕
 */
export const NanjingSkylineBanner: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 414 148" fill="none" preserveAspectRatio="xMidYMax slice" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="njSky" x1="0" y1="0" x2="0" y2="148" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E7EFEA" />
        <stop offset="1" stopColor="#F4F4F1" />
      </linearGradient>
    </defs>
    <rect width="414" height="148" fill="url(#njSky)" />

    {/* 远景：紫金山柔缓山脊 */}
    <path
      d="M-10 124 C50 86, 118 74, 186 96 C236 112, 286 68, 356 84 C384 91, 404 98, 424 106 L424 148 L-10 148 Z"
      fill="#D7E5DE"
      fillOpacity="0.65"
    />

    {/* 中景建筑剪影：南京紫峰大厦 + 河西双塔线条 */}
    <g fill="#C2D6CC" fillOpacity="0.72">
      {/* 左侧城市楼宇 */}
      <rect x="34" y="88" width="16" height="44" rx="1" />
      <rect x="54" y="98" width="12" height="34" rx="1" />
      {/* 紫峰大厦（标志性阶梯锥顶） */}
      <path d="M292 132 V62 L299 54 V40 L302 24 L305 40 V54 L312 62 V132 Z" fill="#A9C4B8" />
      <path d="M296 74 H308 M296 86 H308 M296 98 H308" stroke="#E7EFEA" strokeWidth="1" strokeOpacity="0.8" />
      {/* 河西青奥双塔剪影 */}
      <path d="M332 132 L336 74 L344 74 L348 132 Z" />
      <path d="M352 132 L356 82 L364 82 L368 132 Z" />
      <rect x="374" y="96" width="14" height="36" rx="1" />
    </g>

    {/* 近景：南京明城墙垛口轮廓 */}
    <path
      d="M0 126 H24 V120 H34 V126 H46 V120 H56 V126 H68 V120 H78 V126 H92 V120 H102 V126 H116 V118 C124 114, 140 114, 148 118 V126 H166 V120 H176 V126 H190 V120 H200 V126 H220 V120 H230 V126 H248 V120 H258 V126 H280 V120 H290 V126 H414 V148 H0 Z"
      fill="#C8D2CB"
      fillOpacity="0.55"
    />
    {/* 拱形城门洞暗示 */}
    <path d="M126 140 V127 C126 123, 138 123, 138 127 V140 Z" fill="#E7EFEA" fillOpacity="0.7" />

    {/* 南京梧桐叶极简线稿点缀（右上） */}
    <g stroke="#1D6F5A" strokeOpacity="0.22" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M358 28 C365 20, 376 22, 374 32 C384 30, 386 42, 376 44 C380 51, 370 55, 366 48 C360 54, 351 48, 356 41 C348 39, 350 28, 358 28 Z" />
      <path d="M366 36 L376 58" />
    </g>
  </svg>
);

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

/**
 * 统一克制的线性图标映射（彻底替代所有 AI 味 Emoji）
 */
export const ItemIcon: React.FC<{ id: string; className?: string }> = ({
  id,
  className = 'w-4 h-4',
}) => {
  switch (id) {
    case 'paper':
      return <Package className={className} />;
    case 'plastic':
      return <Milk className={className} />;
    case 'metal':
      return <Wrench className={className} />;
    case 'textile':
      return <Shirt className={className} />;
    case 'glass':
      return <Wine className={className} />;
    case 'ewaste':
      return <Cpu className={className} />;
    case 'sofa-3':
      return <Sofa className={className} />;
    case 'sofa-1':
    case 'chair':
      return <Armchair className={className} />;
    case 'mattress':
    case 'bedframe':
      return <BedDouble className={className} />;
    case 'wardrobe':
      return <DoorClosed className={className} />;
    case 'table':
    case 'bookshelf':
      return <BookMarked className={className} />;
    case 'fridge':
      return <Refrigerator className={className} />;
    case 'washer':
      return <Waves className={className} />;
    case 'ac':
      return <Wind className={className} />;
    case 'tv':
      return <Tv className={className} />;
    case 'heater':
      return <Flame className={className} />;
    case 'microwave':
      return <Microwave className={className} />;
    case 'pc':
      return <Monitor className={className} />;
    case 'small':
      return <Plug className={className} />;
    case 'rw-1':
      return <ShoppingBag className={className} />;
    case 'rw-2':
      return <TrainFront className={className} />;
    case 'rw-3':
      return <Ticket className={className} />;
    case 'rw-4':
      return <Store className={className} />;
    default:
      return <Package className={className} />;
  }
};
