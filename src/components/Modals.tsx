import React, { useEffect, useState } from 'react';
import {
  X,
  ScanLine,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Sun,
  MapPin,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { APPLIANCE_PROVIDERS, BEIJING_COMMUNITIES, DAILY_MARKET_PRICES } from '../data/mockData';

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
  const points = Math.round(weight * 12);

  const handleFinishDropoff = () => {
    addQuickDropoff(
      weight,
      cash,
      points,
      `${user.community}北门智能回收站 #01`,
      selectedCat.name
    );
    setStep('done');
    showToast(`投递成功！返现 ¥${cash}，+${points} 环保积分`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-[390px] bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-[15px]">智能回收机 · 扫码交投</span>
          </div>
          <button
            onClick={() => setShowScanner(false)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'scanning' && (
          <div className="p-6 flex flex-col items-center">
            <div className="relative w-56 h-56 rounded-2xl bg-slate-800/80 border border-emerald-400/30 overflow-hidden flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl-md" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr-md" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl-md" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br-md" />
              {/* Scan line */}
              <div className="absolute top-3 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-scan-line" />
              <div className="text-center px-4">
                <p className="text-xs text-emerald-300 font-medium">对准回收机屏幕二维码</p>
                <p className="text-[11px] text-slate-400 mt-1">自动识别柜门并实时称重返现</p>
              </div>
            </div>

            <button
              onClick={() => setStep('opened')}
              className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-[14px] shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition"
            >
              模拟扫码开箱（{user.community} #01柜）
            </button>
            <p className="mt-2.5 text-[11px] text-slate-400">
              演示模式：点击上方按钮体验完整扫码称重返现流程
            </p>
          </div>
        )}

        {step === 'opened' && (
          <div className="p-5 space-y-4">
            <div className="rounded-2xl bg-emerald-500/15 border border-emerald-400/30 p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-emerald-300">投递口已自动开启</p>
                <p className="text-[11px] text-slate-300">{user.community}北门智能回收站 #01</p>
              </div>
            </div>

            <div>
              <label className="text-[12px] text-slate-400 block mb-2">选择投递品类</label>
              <div className="grid grid-cols-3 gap-2">
                {DAILY_MARKET_PRICES.slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat)}
                    className={`p-2 rounded-xl border text-left transition ${
                      selectedCat.id === cat.id
                        ? 'bg-emerald-500/20 border-emerald-400 text-white'
                        : 'bg-slate-800/70 border-white/10 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-base">{cat.icon}</div>
                    <div className="text-[11px] font-medium truncate mt-0.5">{cat.name.split('/')[0]}</div>
                    <div className="text-[10px] text-emerald-300 tabular-nums">¥{cat.price}/kg</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[12px] mb-1.5">
                <span className="text-slate-400">模拟称重净重</span>
                <span className="font-bold text-emerald-300 text-base tabular-nums">{weight.toFixed(1)} kg</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>

            <div className="rounded-2xl bg-slate-800 p-3.5 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">预计实时返现</div>
                <div className="text-xl font-bold text-emerald-400 tabular-nums">¥ {cash.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-slate-400">同步奖励积分</div>
                <div className="text-base font-semibold text-amber-300 tabular-nums">+{points} 积分</div>
              </div>
            </div>

            <button
              onClick={handleFinishDropoff}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold text-[14px] active:scale-[0.98] transition"
            >
              关门并立即结算
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">交投结算成功！</h3>
              <p className="text-[13px] text-slate-300 mt-1">
                本次投递 {selectedCat.name} {weight.toFixed(1)}kg，已为您减少碳排放 {(weight * 1.6).toFixed(1)}kg
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-2xl bg-slate-800 p-3">
                <div className="text-[11px] text-slate-400">到账现金</div>
                <div className="text-lg font-bold text-emerald-400 tabular-nums">+¥{cash.toFixed(2)}</div>
              </div>
              <div className="rounded-2xl bg-slate-800 p-3">
                <div className="text-[11px] text-slate-400">环保积分</div>
                <div className="text-lg font-bold text-amber-300 tabular-nums">+{points}</div>
              </div>
            </div>
            <button
              onClick={() => setShowScanner(false)}
              className="w-full py-3 rounded-2xl bg-white text-slate-900 font-semibold text-[14px] active:scale-[0.98] transition"
            >
              完成并返回
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
  const [seed, setSeed] = useState(1);
  const [bright, setBright] = useState(false);

  useEffect(() => {
    if (!showQrModal) return;
    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setSeed((s) => s + 1);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [showQrModal]);

  if (!showQrModal) return null;

  // Deterministic pseudo-QR matrix so it looks crisp & authentic and refreshes when seed changes
  const size = 15;
  const cells: boolean[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      const inFinder =
        (r < 4 && c < 4) ||
        (r < 4 && c >= size - 4) ||
        (r >= size - 4 && c < 4);
      if (inFinder) {
        const lr = r < 4 ? r : r - (size - 4);
        const lc = c < 4 ? c : c - (size - 4);
        return lr === 0 || lr === 3 || lc === 0 || lc === 3 || (lr >= 1 && lr <= 2 && lc >= 1 && lc <= 2);
      }
      return ((r * 17 + c * 31 + seed * 13 + r * c) % 7) < 3;
    })
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div
        className={`w-full max-w-[360px] rounded-3xl overflow-hidden shadow-2xl animate-slide-up transition ${
          bright ? 'bg-white ring-4 ring-emerald-300/60' : 'bg-white'
        }`}
      >
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-4 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[16px]">居民专属交投二维码</h3>
            <p className="text-[11px] text-emerald-100 mt-0.5">在智能回收机或固定交投点出示扫码</p>
          </div>
          <button
            onClick={() => setShowQrModal(false)}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="flex items-center gap-2.5 mb-4">
            <img
              src="/images/eco-avatar.jpg"
              alt="头像"
              className="w-10 h-10 rounded-full object-cover border border-emerald-100"
            />
            <div>
              <div className="text-[14px] font-bold text-slate-900">{user.nickname}</div>
              <div className="text-[11px] text-slate-500">ID: JC-{user.phone.slice(-6)} · {user.community}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-inner">
            <div className="grid grid-cols-15 gap-[3px] w-44 h-44 bg-white p-2 rounded-xl">
              {cells.flatMap((row, r) =>
                row.map((on, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={`rounded-[1.5px] ${on ? 'bg-slate-900' : 'bg-transparent'}`}
                  />
                ))
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-[12px] text-slate-500">
            <button
              onClick={() => {
                setSeed((s) => s + 1);
                setCountdown(60);
              }}
              className="flex items-center gap-1 text-emerald-600 font-medium hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>刷新 ({countdown}s)</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setBright((b) => !b)}
              className="flex items-center gap-1 text-slate-600 font-medium"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>{bright ? '已增亮' : '扫码增亮'}</span>
            </button>
          </div>

          <div className="mt-4 w-full rounded-xl bg-emerald-50/80 px-3.5 py-2.5 text-[11px] text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>动态加密身份码，扫码交投后收益与积分将自动归入您的账户</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppliancePickerModal: React.FC = () => {
  const { showAppliancePicker, setShowAppliancePicker, navigate } = useApp();
  const [selected, setSelected] = useState<string>('jd');

  if (!showAppliancePicker) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[2px] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-[360px] bg-white rounded-3xl p-5 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[17px] font-bold text-slate-900">请选择家电回收企业</h3>
          <button
            onClick={() => setShowAppliancePicker(false)}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {APPLIANCE_PROVIDERS.map((p) => {
            const active = selected === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`w-full p-3.5 rounded-2xl border-2 text-left transition flex items-center gap-3 ${
                  active
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-100 bg-slate-50/60 hover:border-slate-200'
                }`}
              >
                <div
                  className="w-11 h-11 rounded-xl text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: p.accent }}
                >
                  {p.name.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[14px] text-slate-900">{p.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-medium">
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.slogan}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    active ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300'
                  }`}
                >
                  {active && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={() => setShowAppliancePicker(false)}
            className="py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold text-[14px] active:scale-[0.98] transition"
          >
            取消
          </button>
          <button
            onClick={() => {
              setShowAppliancePicker(false);
              navigate({ name: 'appliance_booking', initialProvider: selected });
            }}
            className="py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-[14px] shadow-md shadow-emerald-600/20 active:scale-[0.98] transition"
          >
            立即预约
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
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[2px] flex items-end sm:items-center justify-center animate-fade-in">
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[16px] font-bold text-slate-900">切换当前所在社区</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[12px] text-slate-500 mb-3">用于精准匹配您周边的智能回收机、固定交投点与清运服务队</p>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {BEIJING_COMMUNITIES.map((c) => {
            const active = user.community === c.name;
            return (
              <button
                key={c.name}
                onClick={() => {
                  updateUser({ community: c.name });
                  showToast(`已切换至「${c.name}」`, 'success');
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                  active
                    ? 'border-emerald-500 bg-emerald-50/60'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-[14px] font-semibold text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-slate-500">北京市{c.district} · {c.street}</div>
                  </div>
                </div>
                {active && (
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    当前
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
