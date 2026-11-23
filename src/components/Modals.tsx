import React, { useEffect, useState } from 'react';
import {
  X,
  ScanLine,
  CheckCircle2,
  RefreshCw,
  Sun,
  MapPin,
  Check,
  ShieldCheck,
  Box,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { APPLIANCE_PROVIDERS, DAILY_MARKET_PRICES, NANJING_COMMUNITIES } from '../data/mockData';
import { ItemIcon, RealQrCode } from './NanjingVisuals';

export const ScannerModal: React.FC = () => {
  const { showScanner, setShowScanner, addQuickDropoff, showToast, user } = useApp();
  const [step, setStep] = useState<'scanning' | 'opened' | 'done'>('scanning');
  const [selectedCat, setSelectedCat] = useState(DAILY_MARKET_PRICES[0]);
  const [weight, setWeight] = useState(2.5);

  useEffect(() => {
    if (showScanner) {
      setStep('scanning');
      setWeight(2.5);
    }
  }, [showScanner]);

  if (!showScanner) return null;

  const cash = Number((selectedCat.price * weight).toFixed(2));
  const points = Math.round(weight * 10);
  const stationLabel = `${user.community}西门智能回收柜 #01`;

  const handleFinishDropoff = () => {
    addQuickDropoff(weight, cash, points, stationLabel, selectedCat.shortName);
    setStep('done');
    showToast(`入账 ¥${cash.toFixed(2)}，+${points} 积分`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-[376px] bg-zinc-900 text-white rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 animate-slide-up">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ScanLine className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-[14px]">扫码开箱投递</span>
          </div>
          <button
            onClick={() => setShowScanner(false)}
            className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'scanning' && (
          <div className="p-5 flex flex-col items-center">
            <div className="relative w-52 h-52 rounded-xl bg-zinc-950 border border-zinc-700 overflow-hidden flex items-center justify-center">
              <div className="absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-emerald-400" />
              <div className="absolute top-2.5 left-4 right-4 h-[1.5px] bg-emerald-400 animate-scan-line" />
              <div className="text-center px-4">
                <p className="text-[12px] text-zinc-200 font-medium">对准回收柜屏幕二维码</p>
                <p className="text-[11px] text-zinc-500 mt-1">识别机号后自动开启对应投口</p>
              </div>
            </div>

            <button
              onClick={() => setStep('opened')}
              className="mt-5 w-full py-3 rounded-lg bg-[#1D6F5A] hover:bg-[#175C4A] text-white font-semibold text-[14px] active:opacity-90 transition"
            >
              连接附近机柜（{user.community} #01）
            </button>
            <p className="mt-2 text-[11px] text-zinc-500">
              未调用摄像头时可直接选择附近机柜体验开箱称重
            </p>
          </div>
        )}

        {step === 'opened' && (
          <div className="p-4 space-y-4">
            <div className="rounded-xl bg-zinc-800/80 border border-zinc-700 p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1D6F5A]/25 text-emerald-300 flex items-center justify-center">
                <Box className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white">投递口已开启</p>
                <p className="text-[11px] text-zinc-400 truncate">{stationLabel}</p>
              </div>
            </div>

            <div>
              <label className="text-[12px] text-zinc-400 block mb-2">选择投递品类</label>
              <div className="grid grid-cols-3 gap-2">
                {DAILY_MARKET_PRICES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat)}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      selectedCat.id === cat.id
                        ? 'bg-[#1D6F5A]/25 border-emerald-500 text-white'
                        : 'bg-zinc-800/60 border-zinc-700/80 text-zinc-300'
                    }`}
                  >
                    <ItemIcon id={cat.id} className="w-4 h-4 text-emerald-400" />
                    <div className="text-[12px] font-medium truncate mt-1.5">{cat.shortName}</div>
                    <div className="text-[10.5px] text-zinc-400 tabular-nums">¥{cat.price}/kg</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[12px] mb-1.5">
                <span className="text-zinc-400">电子秤读数</span>
                <span className="font-bold text-white text-[15px] tabular-nums">{weight.toFixed(1)} kg</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full accent-[#1D6F5A]"
              />
            </div>

            <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-zinc-500">本次结算金额</div>
                <div className="text-lg font-bold text-emerald-400 tabular-nums">¥ {cash.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-zinc-500">预计积分</div>
                <div className="text-[14px] font-semibold text-zinc-200 tabular-nums">+{points} 分</div>
              </div>
            </div>

            <button
              onClick={handleFinishDropoff}
              className="w-full py-3 rounded-lg bg-[#1D6F5A] hover:bg-[#175C4A] font-semibold text-[14px] transition"
            >
              关门并确认结算
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="p-5 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold">投递结算完成</h3>
              <p className="text-[12px] text-zinc-400 mt-1">
                {selectedCat.shortName} {weight.toFixed(1)}kg · 订单已同步至「订单」记录
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-zinc-800 p-3">
                <div className="text-[11px] text-zinc-400">入账金额</div>
                <div className="text-base font-bold text-emerald-400 tabular-nums">+¥{cash.toFixed(2)}</div>
              </div>
              <div className="rounded-xl bg-zinc-800 p-3">
                <div className="text-[11px] text-zinc-400">获得积分</div>
                <div className="text-base font-bold text-white tabular-nums">+{points}</div>
              </div>
            </div>
            <button
              onClick={() => setShowScanner(false)}
              className="w-full py-2.5 rounded-lg bg-white text-zinc-900 font-semibold text-[13px]"
            >
              完成
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const QrCodeModal: React.FC = () => {
  const { showQrModal, setShowQrModal, user } = useApp();
  const [countdown, setCountdown] = useState(60);
  const [token, setToken] = useState(() => Date.now());
  const [bright, setBright] = useState(false);

  useEffect(() => {
    if (!showQrModal) return;
    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setToken(Date.now());
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [showQrModal]);

  if (!showQrModal) return null;

  const qrPayload = `ninghuishou://v1/dropoff?uid=NJ${user.phone.slice(-4)}&district=${encodeURIComponent(
    user.district
  )}&ts=${token}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4 animate-fade-in">
      <div
        className={`w-full max-w-[350px] rounded-2xl overflow-hidden shadow-2xl bg-white animate-slide-up ${
          bright ? 'ring-4 ring-white/80' : ''
        }`}
      >
        <div className="bg-[#1D6F5A] px-4 py-3.5 text-white flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[15px]">居民实名交投码</h3>
            <p className="text-[11px] text-white/75 mt-0.5">在南京各小区智能回收柜或交投点出示扫码</p>
          </div>
          <button
            onClick={() => setShowQrModal(false)}
            className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center">
          <div className="text-center mb-3">
            <div className="text-[14px] font-semibold text-zinc-900">{user.nickname}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5 tabular-nums">
              编号 NJ-{user.phone.slice(-6)} · {user.district} {user.community}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E6E6E1]">
            <RealQrCode value={qrPayload} size={184} />
          </div>

          <div className="mt-4 flex items-center gap-4 text-[12px] text-zinc-500">
            <button
              onClick={() => {
                setToken(Date.now());
                setCountdown(60);
              }}
              className="flex items-center gap-1 text-[#1D6F5A] font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="tabular-nums">刷新 ({countdown}s)</span>
            </button>
            <span className="text-zinc-300">|</span>
            <button
              onClick={() => setBright((b) => !b)}
              className="flex items-center gap-1 text-zinc-600 font-medium"
            >
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>{bright ? '已调亮' : '扫码增亮'}</span>
            </button>
          </div>

          <div className="mt-4 w-full rounded-lg bg-[#F4F4F1] px-3 py-2 text-[11px] text-zinc-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1D6F5A] shrink-0" />
            <span>每60秒动态刷新，投递完成后金额与积分自动记入当前账号</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppliancePickerModal: React.FC = () => {
  const { showAppliancePicker, setShowAppliancePicker, navigate } = useApp();
  const [selected, setSelected] = useState<string>('suning');

  if (!showAppliancePicker) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4 animate-fade-in">
      <div className="w-full max-w-[390px] bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-[16px] font-semibold text-zinc-900">选择家电回收服务商</h3>
          <button
            onClick={() => setShowAppliancePicker(false)}
            className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {APPLIANCE_PROVIDERS.map((p) => {
            const active = selected === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                  active
                    ? 'border-[#1D6F5A] bg-[#EDF5F2]/60'
                    : 'border-[#E6E6E1] bg-white hover:bg-zinc-50'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0"
                  style={{ backgroundColor: p.accent }}
                >
                  {p.name.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[13.5px] text-zinc-900">{p.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">{p.slogan}</p>
                </div>
                <div
                  className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                    active ? 'border-[#1D6F5A] bg-[#1D6F5A] text-white' : 'border-zinc-300'
                  }`}
                >
                  {active && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <button
            onClick={() => setShowAppliancePicker(false)}
            className="py-2.5 rounded-lg border border-[#E6E6E1] text-zinc-600 font-medium text-[13.5px]"
          >
            取消
          </button>
          <button
            onClick={() => {
              setShowAppliancePicker(false);
              navigate({ name: 'appliance_booking', initialProvider: selected });
            }}
            className="py-2.5 rounded-lg bg-[#1D6F5A] text-white font-semibold text-[13.5px]"
          >
            下一步估价
          </button>
        </div>
      </div>
    </div>
  );
};

export const CommunityPickerModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { user, updateUser, showToast } = useApp();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="w-full max-w-[414px] bg-white rounded-t-2xl sm:rounded-2xl p-4 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E6E1]">
          <div>
            <h3 className="text-[15px] font-semibold text-zinc-900">切换南京所在小区</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">用于匹配附近智能回收柜与属地清运车队</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-[#F0F0EC] max-h-72 overflow-y-auto mt-1">
          {NANJING_COMMUNITIES.map((c) => {
            const active = user.community === c.name;
            return (
              <button
                key={c.name}
                onClick={() => {
                  updateUser({ district: c.district, community: c.name });
                  showToast(`已切换至 ${c.district} · ${c.name}`, 'success');
                  onClose();
                }}
                className="w-full py-3 px-1 text-left flex items-center justify-between hover:bg-zinc-50 transition"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className={`w-4 h-4 ${active ? 'text-[#1D6F5A]' : 'text-zinc-400'}`} />
                  <div>
                    <div className="text-[14px] font-medium text-zinc-900">{c.name}</div>
                    <div className="text-[11px] text-zinc-500">南京市{c.district} · {c.street}</div>
                  </div>
                </div>
                {active && <Check className="w-4 h-4 text-[#1D6F5A]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
