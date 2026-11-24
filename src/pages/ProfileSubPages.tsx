import React, { useState } from 'react';
import {
  AlertCircle,
  Check,
  MapPin,
  Plus,
  Trash2,
  Edit3,
  Search,
  ChevronRight,
  Gift,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubPageHeader } from '../components/Layout';
import {
  NANJING_QUIZ,
  POINTS_REWARDS,
  WASTE_CLASSIFICATION_DB,
} from '../data/mockData';
import { ItemIcon } from '../components/NanjingVisuals';

/* ===================== 1. 完善信息 ===================== */
export const ProfileInfoPage: React.FC = () => {
  const { user, updateUser, goBack, showToast } = useApp();
  const [nickname, setNickname] = useState(user.nickname);
  const [gender, setGender] = useState(user.gender);
  const [phone, setPhone] = useState(user.phone);
  const [birthday, setBirthday] = useState(user.birthday);

  const handleSave = () => {
    if (!nickname.trim()) {
      showToast('请输入姓名或昵称', 'warning');
      return;
    }
    updateUser({
      nickname: nickname.trim(),
      gender,
      phone: phone.trim() || user.phone,
      birthday,
      birthdayLocked: Boolean(birthday),
    });
    showToast('资料已保存', 'success');
    goBack();
  };

  return (
    <div className="min-h-full bg-[#F4F4F1] pb-8">
      <SubPageHeader title="完善信息" />

      <div className="p-3.5">
        <div className="bg-white rounded-xl p-4 border border-[#E6E6E1] space-y-4">
          <div>
            <label className="text-[12px] font-medium text-zinc-500 block mb-1.5">昵称 / 联系人</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] px-3 py-2.5 text-[14px] text-zinc-900 focus:outline-none focus:border-[#1D6F5A]"
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-zinc-500 block mb-1.5">性别</label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'male', label: '男' },
                { id: 'female', label: '女' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGender(g.id as 'male' | 'female')}
                  className={`py-2.5 rounded-lg font-medium text-[13.5px] border transition ${
                    gender === g.id
                      ? 'border-[#1D6F5A] bg-[#EDF5F2] text-[#1D6F5A]'
                      : 'border-[#E6E6E1] bg-[#FAFAF8] text-zinc-600'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-zinc-500 block mb-1.5">手机号</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] px-3 py-2.5 text-[14px] text-zinc-800 tabular-nums"
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-zinc-500 block mb-1.5">生日</label>
            <input
              type="date"
              disabled={user.birthdayLocked}
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] px-3 py-2.5 text-[13.5px] text-zinc-800 disabled:opacity-60"
            />
            <div className="mt-1.5 flex items-center gap-1 text-[11.5px] text-zinc-500">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>{user.birthdayLocked ? '生日已设定' : '生日设置后不可修改'}</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-lg bg-[#1D6F5A] text-white font-semibold text-[14px]"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===================== 2. 地址管理列表 ===================== */
export const AddressListPage: React.FC<{ selectMode?: boolean }> = ({ selectMode = false }) => {
  const {
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    updateAddress,
    deleteAddress,
    navigate,
    goBack,
    showToast,
  } = useApp();

  return (
    <div className="min-h-full bg-[#F4F4F1] flex flex-col">
      <SubPageHeader title={selectMode ? '选择服务地址' : '地址管理'} />

      <div className="p-3.5 space-y-2.5 flex-1">
        {addresses.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[14px] font-semibold text-zinc-700">暂无保存地址</p>
            <p className="text-[12px] text-zinc-400 mt-1">添加常用南京地址，预约更快捷</p>
          </div>
        ) : (
          addresses.map((addr) => {
            const isSelected = addr.id === selectedAddressId;
            return (
              <div
                key={addr.id}
                onClick={() => {
                  if (selectMode) {
                    setSelectedAddressId(addr.id);
                    showToast(`已选用 ${addr.community}`, 'success');
                    goBack();
                  }
                }}
                className={`bg-white rounded-xl p-3.5 border transition ${
                  selectMode && isSelected ? 'border-[#1D6F5A] ring-1 ring-[#1D6F5A]' : 'border-[#E6E6E1]'
                } ${selectMode ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14.5px] font-semibold text-zinc-900">{addr.contactName}</span>
                      <span className="text-[12.5px] text-zinc-500 tabular-nums">{addr.phone}</span>
                      {addr.isDefault && (
                        <span className="text-[10.5px] font-medium px-1.5 py-0.5 rounded bg-[#EDF5F2] text-[#1D6F5A]">
                          默认
                        </span>
                      )}
                    </div>
                    <p className="text-[12.5px] text-zinc-600 mt-1 leading-snug">
                      {addr.region} {addr.street} {addr.community} {addr.detail}
                    </p>
                  </div>
                  {selectMode && isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#1D6F5A] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#F0F0EC] flex items-center justify-between text-[12px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateAddress(addr.id, { isDefault: true });
                      setSelectedAddressId(addr.id);
                      showToast('已设为默认地址', 'success');
                    }}
                    className={`flex items-center gap-1.5 ${
                      addr.isDefault ? 'text-[#1D6F5A] font-medium' : 'text-zinc-400'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        addr.isDefault ? 'border-[#1D6F5A] bg-[#1D6F5A] text-white' : 'border-zinc-300'
                      }`}
                    >
                      {addr.isDefault && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                    <span>默认地址</span>
                  </button>

                  <div className="flex items-center gap-4 text-zinc-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({ name: 'address_edit', editId: addr.id });
                      }}
                      className="flex items-center gap-1 hover:text-zinc-900"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> 编辑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAddress(addr.id);
                        showToast('地址已删除', 'info');
                      }}
                      className="flex items-center gap-1 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> 删除
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="sticky bottom-0 inset-x-0 p-3.5 bg-white border-t border-[#E6E6E1] z-30">
        <button
          onClick={() => navigate({ name: 'address_edit' })}
          className="w-full py-2.5 rounded-lg bg-[#1D6F5A] text-white font-semibold text-[14px] flex items-center justify-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span>新增南京地址</span>
        </button>
      </div>
    </div>
  );
};

/* ===================== 3. 新增 / 编辑地址 ===================== */
export const AddressEditPage: React.FC<{ editId?: string }> = ({ editId }) => {
  const { addresses, addAddress, updateAddress, goBack, showToast } = useApp();
  const existing = addresses.find((a) => a.id === editId);

  const [contactName, setContactName] = useState(existing?.contactName ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [region, setRegion] = useState(existing?.region ?? '南京市玄武区');
  const [street, setStreet] = useState(existing?.street ?? '孝陵卫街道');
  const [community, setCommunity] = useState(existing?.community ?? '银城东苑');
  const [detail, setDetail] = useState(existing?.detail ?? '');
  const [isDefault, setIsDefault] = useState(existing?.isDefault ?? true);

  const handleSave = () => {
    if (!contactName.trim() || !phone.trim() || !detail.trim()) {
      showToast('请填写完整的联系人、手机号与楼幢门牌', 'warning');
      return;
    }
    const address = {
      contactName: contactName.trim(),
      phone: phone.trim(),
      region,
      street,
      community,
      detail: detail.trim(),
      isDefault,
    };
    if (existing) updateAddress(existing.id, address);
    else addAddress(address);
    showToast(existing ? '地址已更新' : '地址已添加', 'success');
    goBack();
  };

  return (
    <div className="min-h-full bg-[#F4F4F1] pb-10">
      <SubPageHeader title={existing ? '编辑地址' : '新增地址'} />

      <div className="p-3.5 space-y-3">
        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] divide-y divide-[#F0F0EC]">
          <div className="flex items-center gap-3 pb-3">
            <span className="w-16 text-[13.5px] font-medium text-zinc-700">联系人</span>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="请填写联系人姓名"
              className="flex-1 text-[13.5px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3 pt-3">
            <span className="w-16 text-[13.5px] font-medium text-zinc-700">手机号</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请填写 11 位手机号"
              className="flex-1 text-[13.5px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none tabular-nums"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[13.5px] font-medium text-zinc-700">南京所在区与详细门牌</span>
            <MapPin className="w-4 h-4 text-[#1D6F5A]" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="南京市XX区"
              className="rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] px-3 py-2 text-[13px]"
            />
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="街道"
              className="rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] px-3 py-2 text-[13px]"
            />
          </div>
          <input
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            placeholder="小区名称（如：银城东苑）"
            className="w-full rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] px-3 py-2 text-[13px]"
          />
          <input
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="楼幢单元门牌（如：18幢2单元501室）"
            className="w-full rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] px-3 py-2 text-[13px]"
          />

          <button
            onClick={() => setIsDefault((v) => !v)}
            className="flex items-center gap-2 pt-1 text-[13px] text-zinc-700"
          >
            <span
              className={`w-4.5 h-4.5 rounded border flex items-center justify-center ${
                isDefault ? 'bg-[#1D6F5A] border-[#1D6F5A] text-white' : 'border-zinc-300'
              }`}
            >
              {isDefault && <Check className="w-3 h-3 stroke-[3]" />}
            </span>
            <span>设为默认地址</span>
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-lg bg-[#1D6F5A] text-white font-semibold text-[14px]"
        >
          保存地址
        </button>
      </div>
    </div>
  );
};

/* ===================== 4. 使用说明 + 南京四分类查询 + 5题分类自测 ===================== */
export const UsageGuidePage: React.FC<{ initialQuery?: string }> = ({ initialQuery = '' }) => {
  const { user, navigate, setShowAppliancePicker, claimQuizReward } = useApp();
  const [mode, setMode] = useState<'lookup' | 'quiz' | 'guide'>('lookup');
  const [query, setQuery] = useState(initialQuery);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = query.trim();
  const results = WASTE_CLASSIFICATION_DB.filter(
    (item) =>
      !q ||
      item.name.includes(q) ||
      (item.aliases && item.aliases.includes(q)) ||
      item.category.includes(q) ||
      item.tip.includes(q)
  );

  const badgeStyle = (cat: string) => {
    if (cat === '可回收物') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (cat === '大件垃圾') return 'bg-[#FDF4EC] text-[#B45309] border-amber-200';
    if (cat === '装修垃圾') return 'bg-zinc-100 text-zinc-700 border-zinc-300';
    if (cat === '废旧家电') return 'bg-[#EDF5F2] text-[#1D6F5A] border-[#CDE4DC]';
    if (cat === '有害垃圾') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (cat === '厨余垃圾') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    return 'bg-zinc-100 text-zinc-600 border-zinc-200';
  };

  const handleQuickAction = (action?: string) => {
    if (action === 'recyclables_hub') navigate({ name: 'recyclables_hub' });
    else if (action === 'bulky_booking') navigate({ name: 'bulky_booking' });
    else if (action === 'renovation_hub') navigate({ name: 'renovation_hub' });
    else if (action === 'appliance_booking') setShowAppliancePicker(true);
  };

  const currQuiz = NANJING_QUIZ[quizIndex];

  const handlePickOption = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === currQuiz.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex + 1 < NANJING_QUIZ.length) {
      setQuizIndex((i) => i + 1);
      setPicked(null);
    } else {
      setFinished(true);
      claimQuizReward();
    }
  };

  return (
    <div className="min-h-full bg-[#F4F4F1] pb-10">
      <SubPageHeader title="分类查询与使用说明" />

      {/* Sub Tabs */}
      <div className="bg-white border-b border-[#E6E6E1] px-3.5 py-2">
        <div className="grid grid-cols-3 p-1 rounded-lg bg-[#F4F4F1]">
          {[
            { id: 'lookup', label: '南京分类查一查' },
            { id: 'quiz', label: '分类小测验' },
            { id: 'guide', label: '服务说明' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setMode(t.id as typeof mode)}
              className={`py-1.5 rounded-md text-[12px] font-semibold transition ${
                mode === t.id ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3.5 space-y-3">
        {/* Nanjing Ming Xiaoling Visual Banner */}
        <div className="relative h-24 rounded-xl overflow-hidden border border-black/8">
          <img
            src="/images/nj-ming-forest.jpg"
            alt="南京明孝陵红墙绿荫"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-y-0 left-3.5 flex flex-col justify-center text-white">
            <div className="text-[15px] font-bold">南京四分类速查</div>
            <div className="text-[11px] text-white/80 mt-0.5">可回收 · 厨余 · 有害 · 其他</div>
          </div>
        </div>

        {mode === 'lookup' && (
          <>
            <div className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="输入物品名：小龙虾壳、盐水鸭骨、电池、旧床垫..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#1D6F5A]"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['小龙虾壳', '猪大骨', '电池', '快递纸箱', '奶茶杯', '旧沙发', '砖块'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-0.5 rounded bg-[#F4F4F1] hover:bg-zinc-200/70 text-[11px] text-zinc-700 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {results.length === 0 ? (
                <div className="bg-white rounded-xl p-6 border border-[#E6E6E1] text-center text-[13px] text-zinc-500">
                  未检索到「{query}」，可尝试搜索大类关键词（如：塑料、纸箱、电池、家具）
                </div>
              ) : (
                results.map((item) => (
                  <div
                    key={item.name}
                    className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[14px] font-semibold text-zinc-900">{item.name}</span>
                      <span className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded border ${badgeStyle(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[12px] text-zinc-500 leading-relaxed">{item.tip}</p>
                    {item.actionRoute && (
                      <button
                        onClick={() => handleQuickAction(item.actionRoute)}
                        className="inline-flex items-center gap-0.5 text-[12px] font-medium text-[#1D6F5A] pt-0.5"
                      >
                        <span>前往对应回收通道</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {mode === 'quiz' && (
          <div className="bg-white rounded-xl p-4 border border-[#E6E6E1]">
            {finished ? (
              <div className="py-6 text-center space-y-3">
                <div className="text-[12px] text-zinc-500">南京四分类自测结果</div>
                <div className="text-3xl font-bold text-[#1D6F5A] tabular-nums">
                  {score} / {NANJING_QUIZ.length}
                </div>
                <p className="text-[12.5px] text-zinc-600">
                  {user.quizClaimed ? '20 积分奖励已记入账户，可随时重测巩固。' : '已完成全部题目。'}
                </p>
                <button
                  onClick={() => {
                    setQuizIndex(0);
                    setPicked(null);
                    setScore(0);
                    setFinished(false);
                  }}
                  className="px-5 py-2 rounded-lg bg-[#1D6F5A] text-white text-[13px] font-medium"
                >
                  再测一次
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-[11.5px] text-zinc-500">
                  <span>依据《南京市生活垃圾管理条例》</span>
                  <span className="font-semibold text-zinc-800 tabular-nums">
                    第 {quizIndex + 1} / {NANJING_QUIZ.length} 题
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#FAFAF8] border border-[#ECECE8]">
                  <div className="text-[15px] font-bold text-zinc-900">{currQuiz.item}</div>
                  <p className="text-[12px] text-zinc-500 mt-1">{currQuiz.context}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {currQuiz.options.map((opt) => {
                    const isPicked = picked === opt;
                    const isRight = opt === currQuiz.answer;
                    let cls = 'border-[#E6E6E1] bg-white text-zinc-800 hover:bg-zinc-50';
                    if (picked) {
                      if (isRight) cls = 'border-[#1D6F5A] bg-[#EDF5F2] text-[#1D6F5A] font-semibold';
                      else if (isPicked) cls = 'border-rose-400 bg-rose-50 text-rose-700';
                      else cls = 'border-[#ECECE8] bg-zinc-50 text-zinc-400';
                    }
                    return (
                      <button
                        key={opt}
                        onClick={() => handlePickOption(opt)}
                        className={`py-3 px-3 rounded-lg border text-[13px] flex items-center justify-between transition ${cls}`}
                      >
                        <span>{opt}</span>
                        {picked && isRight && <CheckCircle2 className="w-4 h-4 text-[#1D6F5A]" />}
                        {picked && isPicked && !isRight && <XCircle className="w-4 h-4 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>

                {picked && (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-[#FAFAF8] border border-[#E6E6E1] p-3 text-[12px] text-zinc-600 leading-relaxed">
                      <span className="font-semibold text-zinc-900">解析：</span>
                      {currQuiz.explanation}
                    </div>
                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-2.5 rounded-lg bg-[#1D6F5A] text-white font-semibold text-[13.5px]"
                    >
                      {quizIndex + 1 < NANJING_QUIZ.length ? '下一题' : '查看成绩并领积分'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {mode === 'guide' && (
          <div className="bg-white rounded-xl p-4 border border-[#E6E6E1] space-y-3 text-[12.5px] text-zinc-600">
            <h3 className="text-[14.5px] font-bold text-zinc-900">宁回收服务说明</h3>
            <div className="space-y-2.5 leading-relaxed">
              <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#F0F0EC]">
                <div className="font-semibold text-zinc-900">1. 可回收物交投</div>
                <p className="mt-0.5">纸箱、塑料瓶、旧衣等可在南京小区 24 小时智能回收柜扫码投递，关门自动称重结款；满 5kg 支持预约上门。</p>
              </div>
              <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#F0F0EC]">
                <div className="font-semibold text-zinc-900">2. 大件与装修垃圾清运</div>
                <p className="mt-0.5">直连南京市城管部门备案清运单位，事前公示参考单价与起步价，清运后生成可查验电子联单。</p>
              </div>
              <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#F0F0EC]">
                <div className="font-semibold text-zinc-900">3. 废旧家电以旧换新</div>
                <p className="mt-0.5">联合苏宁帮客、京东回收、中再生等正规网点提供免费拆机与残值即时结款服务。</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ===================== 5. 用户协议与隐私协议 ===================== */
export const UserAgreementPage: React.FC = () => {
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div className="min-h-full bg-[#F4F4F1] pb-10">
      <SubPageHeader title="用户协议与隐私政策" />

      <div className="px-3.5 pt-3 flex gap-2">
        <button
          onClick={() => setTab('terms')}
          className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition ${
            tab === 'terms' ? 'bg-[#1D6F5A] text-white' : 'bg-white border border-[#E6E6E1] text-zinc-600'
          }`}
        >
          用户服务协议
        </button>
        <button
          onClick={() => setTab('privacy')}
          className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition ${
            tab === 'privacy' ? 'bg-[#1D6F5A] text-white' : 'bg-white border border-[#E6E6E1] text-zinc-600'
          }`}
        >
          隐私保护政策
        </button>
      </div>

      <div className="p-3.5">
        <div className="bg-white rounded-xl p-4 border border-[#E6E6E1] space-y-3.5 text-[12.5px] leading-relaxed text-zinc-600">
          {tab === 'terms' ? (
            <>
              <h2 className="text-[16px] font-bold text-zinc-900">宁回收用户服务须知</h2>
              <div>
                <h3 className="text-[13.5px] font-semibold text-zinc-900 mb-1">1. 服务说明</h3>
                <p>
                  本应用演示回收点查询、上门预约、清运联单、家电估价和垃圾分类。预约、开柜、结算和积分兑换仅在本浏览器内模拟。
                </p>
              </div>
              <div>
                <h3 className="text-[13.5px] font-semibold text-zinc-900 mb-1">2. 规范投放责任</h3>
                <p>
                  居民在预约清运或投递可回收物时，应遵循《南京市生活垃圾管理条例》，如实填写物品品类与楼栋电梯条件，严禁将易燃易爆或危险化学废弃物混入日常废品或建筑渣土中。
                </p>
              </div>
              <div>
                <h3 className="text-[13.5px] font-semibold text-zinc-900 mb-1">3. 计价与电子联单</h3>
                <p>
                  可回收物及旧家电价格随市场行情动态更新，最终以现场电子秤复核或工程师验机结果为准；大件与装修垃圾有偿清运实行事前透明参考价与现场确认机制。
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-[16px] font-bold text-zinc-900">隐私权保护政策</h2>
              <div>
                <h3 className="text-[13.5px] font-semibold text-zinc-900 mb-1">1. 信息使用范围</h3>
                <p>
                  请使用示例资料体验预约。查看地图时，浏览器会向高德请求所选小区附近及当前视野的地图瓦片。
                </p>
              </div>
              <div>
                <h3 className="text-[13.5px] font-semibold text-zinc-900 mb-1">2. 本地数据存储</h3>
                <p>
                  资料、地址、订单和现场照片保存在此浏览器中。同一浏览器资料和网站地址下的使用者可以看到这些记录。可在「我的」页面点击「恢复初始数据」清除。
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===================== 6. 积分兑换 ===================== */
export const PointsMallPage: React.FC = () => {
  const { user, redeemReward } = useApp();

  return (
    <div className="min-h-full bg-[#F4F4F1] pb-10">
      <SubPageHeader title="积分兑换" />

      <div className="p-3.5 space-y-3">
        <div className="rounded-xl bg-[#1D6F5A] p-4 text-white flex items-center justify-between">
          <div>
            <div className="text-[11.5px] text-white/75">当前可用积分</div>
            <div className="text-3xl font-bold tabular-nums mt-0.5">{user.points}</div>
            <div className="text-[11px] text-white/75 mt-1">支持兑换金陵通出行金、清运抵扣券与分类袋</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="space-y-2.5">
          {POINTS_REWARDS.map((rw) => {
            const affordable = user.points >= rw.points;
            return (
              <div
                key={rw.id}
                className="bg-white rounded-xl p-3.5 border border-[#E6E6E1] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#F4F4F1] text-[#1D6F5A] flex items-center justify-center shrink-0">
                    <ItemIcon id={rw.id} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13.5px] font-semibold text-zinc-900 truncate">{rw.name}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">{rw.desc}</p>
                    <div className="text-[12px] font-bold text-[#1D6F5A] mt-1 tabular-nums">
                      {rw.points} 积分
                      <span className="text-[10.5px] font-normal text-zinc-400 ml-2">余 {rw.stock} 份</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => redeemReward(rw.points, rw.name)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition ${
                    affordable ? 'bg-[#1D6F5A] text-white' : 'bg-zinc-100 text-zinc-400'
                  }`}
                >
                  兑换
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
