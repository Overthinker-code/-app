import React from 'react';

export const SmartKioskIllustration: React.FC<{ className?: string }> = ({ className = 'w-28 h-24' }) => (
  <svg viewBox="0 0 160 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="kioskBody" x1="20" y1="16" x2="140" y2="112" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#DDF6FF" />
      </linearGradient>
      <linearGradient id="kioskRoof" x1="18" y1="12" x2="146" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="kioskScreen" x1="108" y1="36" x2="138" y2="96" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0284C7" />
        <stop offset="1" stopColor="#0369A1" />
      </linearGradient>
      <filter id="kioskShadow" x="6" y="8" width="148" height="118" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#0369A1" floodOpacity="0.22" />
      </filter>
    </defs>
    {/* Ground shadow */}
    <ellipse cx="82" cy="116" rx="64" ry="7" fill="#0369A1" fillOpacity="0.18" />
    <g filter="url(#kioskShadow)">
      {/* Side depth */}
      <path d="M138 22L146 27V106L138 110V22Z" fill="#047857" />
      {/* Main kiosk frame */}
      <rect x="18" y="20" width="122" height="90" rx="10" fill="url(#kioskBody)" stroke="#10B981" strokeWidth="3" />
      {/* Top canopy */}
      <path d="M14 23C14 17.5 18.5 13 24 13H134C139.5 13 144 17.5 144 23V30H14V23Z" fill="url(#kioskRoof)" />
      <rect x="44" y="18" width="70" height="6" rx="3" fill="#A7F3D0" fillOpacity="0.8" />

      {/* 4 Recycling Slots */}
      {/* Slot 1: Paper (Emerald) */}
      <rect x="26" y="37" width="18" height="64" rx="4" fill="#10B981" />
      <rect x="29" y="42" width="12" height="8" rx="2" fill="#064E3B" />
      <rect x="30" y="57" width="10" height="10" rx="2" fill="#ECFDF5" fillOpacity="0.9" />
      <rect x="30" y="72" width="10" height="4" rx="2" fill="#A7F3D0" />

      {/* Slot 2: Plastic (Sky) */}
      <rect x="47" y="37" width="18" height="64" rx="4" fill="#0EA5E9" />
      <rect x="50" y="42" width="12" height="8" rx="2" fill="#0C4A6E" />
      <circle cx="56" cy="62" r="5" fill="#E0F2FE" fillOpacity="0.95" />
      <rect x="51" y="72" width="10" height="4" rx="2" fill="#BAE6FD" />

      {/* Slot 3: Metal (Amber) */}
      <rect x="68" y="37" width="18" height="64" rx="4" fill="#F59E0B" />
      <rect x="71" y="42" width="12" height="8" rx="2" fill="#78350F" />
      <path d="M77 56L82 66H72L77 56Z" fill="#FEF3C7" />
      <rect x="72" y="72" width="10" height="4" rx="2" fill="#FDE68A" />

      {/* Slot 4: Textile/Glass (Rose/Violet) */}
      <rect x="89" y="37" width="16" height="64" rx="4" fill="#6366F1" />
      <rect x="92" y="42" width="10" height="8" rx="2" fill="#312E81" />
      <rect x="93" y="57" width="8" height="10" rx="2" fill="#E0E7FF" />

      {/* Smart Screen Panel */}
      <rect x="109" y="37" width="25" height="64" rx="5" fill="url(#kioskScreen)" />
      <rect x="113" y="43" width="17" height="22" rx="3" fill="#38BDF8" fillOpacity="0.35" stroke="#BAE6FD" strokeWidth="1" />
      {/* QR glow icon */}
      <rect x="117" y="47" width="9" height="9" rx="1.5" fill="#FFFFFF" />
      <rect x="119" y="49" width="2" height="2" fill="#0284C7" />
      <rect x="122" y="49" width="2" height="2" fill="#0284C7" />
      <rect x="119" y="52" width="5" height="2" fill="#0284C7" />
      <circle cx="121.5" cy="80" r="6" fill="#34D399" fillOpacity="0.25" stroke="#6EE7B7" strokeWidth="1.5" />
      <path d="M119 80L121 82L124.5 78" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const RenovationIllustration: React.FC<{ className?: string }> = ({ className = 'w-28 h-24' }) => (
  <svg viewBox="0 0 160 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="woodGrad" x1="80" y1="16" x2="142" y2="66" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="sackGrad" x1="20" y1="30" x2="72" y2="105" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#E7E5E4" />
      </linearGradient>
      <linearGradient id="brickGrad" x1="86" y1="86" x2="132" y2="112" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FB7185" />
        <stop offset="1" stopColor="#C2410C" />
      </linearGradient>
      <filter id="renoShadow" x="6" y="10" width="148" height="114" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#44403C" floodOpacity="0.22" />
      </filter>
    </defs>
    <ellipse cx="80" cy="114" rx="60" ry="8" fill="#44403C" fillOpacity="0.2" />
    <g filter="url(#renoShadow)">
      {/* Stacked Wooden Planks */}
      <g transform="rotate(-14 112 42)">
        <rect x="74" y="24" width="68" height="12" rx="3" fill="url(#woodGrad)" />
        <rect x="78" y="38" width="68" height="12" rx="3" fill="#F59E0B" />
        <rect x="70" y="52" width="68" height="12" rx="3" fill="#B45309" />
      </g>

      {/* Woven Rubble Sacks (Back) */}
      <path d="M52 38C52 32 62 28 70 30C78 32 84 42 84 62C84 82 78 96 64 96C50 96 46 82 46 62C46 50 48 42 52 38Z" fill="#D6D3D1" />
      <rect x="57" y="27" width="16" height="6" rx="3" fill="#A8A29E" />

      {/* Woven Rubble Sack (Front Left) */}
      <path d="M24 44C26 36 36 33 46 35C56 37 62 49 62 72C62 94 54 104 40 104C24 104 18 92 18 72C18 58 21 50 24 44Z" fill="url(#sackGrad)" stroke="#D6D3D1" strokeWidth="1.5" />
      <path d="M31 33L40 24L49 33" fill="#F5F5F4" stroke="#D6D3D1" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="31" y="33" width="18" height="5" rx="2.5" fill="#F97316" />
      <path d="M26 64H52M25 76H53M28 88H48" stroke="#E7E5E4" strokeWidth="2" strokeLinecap="round" />

      {/* Ceramic Sink */}
      <ellipse cx="86" cy="84" rx="26" ry="15" fill="#FFFFFF" stroke="#D6D3D1" strokeWidth="2" />
      <ellipse cx="86" cy="82" rx="18" ry="9" fill="#E7E5E4" />
      <circle cx="86" cy="83" r="3" fill="#78716C" />
      <path d="M86 68V76M82 68H90" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

      {/* Terracotta Bricks */}
      <rect x="102" y="92" width="24" height="12" rx="2.5" fill="url(#brickGrad)" />
      <rect x="114" y="80" width="24" height="12" rx="2.5" fill="#EA580C" />
      <rect x="88" y="98" width="22" height="11" rx="2.5" fill="#C2410C" />
      <circle cx="109" cy="98" r="1.5" fill="#FED7AA" />
      <circle cx="116" cy="98" r="1.5" fill="#FED7AA" />
    </g>
  </svg>
);

export const AppliancesIllustration: React.FC<{ className?: string }> = ({ className = 'w-28 h-24' }) => (
  <svg viewBox="0 0 160 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fridgeGrad" x1="86" y1="14" x2="132" y2="104" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#D1FAE5" />
      </linearGradient>
      <linearGradient id="washerGrad" x1="20" y1="42" x2="72" y2="106" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#E2E8F0" />
      </linearGradient>
      <linearGradient id="drumGrad" x1="34" y1="64" x2="58" y2="92" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
      <filter id="appShadow" x="8" y="8" width="144" height="114" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#065F46" floodOpacity="0.2" />
      </filter>
    </defs>
    <ellipse cx="82" cy="113" rx="60" ry="7" fill="#065F46" fillOpacity="0.18" />
    <g filter="url(#appShadow)">
      {/* Refrigerator */}
      <rect x="86" y="16" width="42" height="88" rx="8" fill="url(#fridgeGrad)" stroke="#A7F3D0" strokeWidth="2" />
      <line x1="86" y1="54" x2="128" y2="54" stroke="#6EE7B7" strokeWidth="2" />
      <rect x="92" y="34" width="3.5" height="14" rx="1.75" fill="#10B981" />
      <rect x="92" y="62" width="3.5" height="22" rx="1.75" fill="#10B981" />

      {/* TV Monitor behind washer */}
      <rect x="46" y="28" width="46" height="32" rx="5" fill="#1E293B" stroke="#475569" strokeWidth="2" />
      <rect x="50" y="32" width="38" height="24" rx="2.5" fill="#334155" />
      <path d="M54 50L64 40L72 47L82 37" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Washing Machine */}
      <rect x="20" y="46" width="52" height="60" rx="8" fill="url(#washerGrad)" stroke="#CBD5E1" strokeWidth="2" />
      <rect x="26" y="52" width="16" height="6" rx="2" fill="#94A3B8" />
      <circle cx="54" cy="55" r="3" fill="#10B981" />
      <circle cx="63" cy="55" r="3" fill="#0EA5E9" />
      <circle cx="46" cy="80" r="17" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3.5" />
      <circle cx="46" cy="80" r="12" fill="url(#drumGrad)" />
      <path d="M37 82C41 78 46 84 55 79" stroke="#E0F2FE" strokeWidth="2.2" strokeLinecap="round" />

      {/* Compact Microwave / Kettle */}
      <rect x="64" y="82" width="38" height="24" rx="5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.8" />
      <rect x="69" y="87" width="21" height="14" rx="2" fill="#334155" />
      <circle cx="95" cy="91" r="2.2" fill="#10B981" />
      <circle cx="95" cy="97" r="2.2" fill="#94A3B8" />

      {/* Desk Fan */}
      <circle cx="130" cy="76" r="14" fill="#ECFDF5" stroke="#10B981" strokeWidth="2.5" />
      <circle cx="130" cy="76" r="4" fill="#059669" />
      <path d="M130 90V104M121 104H139" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

export const EmptyInboxIllustration: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="48" fill="#ECFDF5" />
    <path d="M36 52L43 36H77L84 52V80C84 83.3 81.3 86 78 86H42C38.7 86 36 83.3 36 80V52Z" fill="#FFFFFF" stroke="#10B981" strokeWidth="3" strokeLinejoin="round" />
    <path d="M36 56H48L52 63H68L72 56H84" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M60 22V29M44 26L48 31M76 26L72 31" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
