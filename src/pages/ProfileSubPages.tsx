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
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubPageHeader } from '../components/Layout';
import {
  POINTS_REWARDS,
  WASTE_CLASSIFICATION_DB,
} from '../data/mockData';
import { EmptyInboxIllustration } from '../components/ServiceIllustrations';

/* ===================== 1. 完善信息 ===================== */
export const ProfileInfoPage: React.FC = () => {
  const { user, updateUser, goBack, showToast } = useApp();
  const [nickname, setNickname] = useState(user.nickname);
  const [gender, setGender] = useState(user.gender);
  const [phone, setPhone] = useState(user.phone);
  const [birthday, setBirthday] = useState(user.birthday);

  const handleSave = () => {
    if (!nickname.trim()) {
      showToast('请输入用户昵称', 'warning');
      return;
    }
    updateUser({
      nickname: nickname.trim(),
      gender,
      phone: phone.trim() || user.phone,
      birthday,
      birthdayLocked: Boolean(birthday),
    });
    showToast('个人信息已保存', 'success');
    goBack();
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-[#E6F8F2] via-[#F4F8F6] to-[#F4F8F6] pb-8">
      <SubPageHeader title="完善信息" transparent />

      <div className="px-4 pt-4 space-y-5">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src="/images/eco-avatar.jpg"
              alt="头像"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg bg-white"
            />
            <span className="absolute bottom-0 inset-x-0 bg-slate-900/55 text-white text-[10px] font-medium text-center py-0.5 rounded-b-full">
              绿色认证
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-950/5 space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-slate-500 block mb-1.5">用户昵称</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200/80 px-4 py-3 text-[15px] font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-slate-500 block mb-1.5">性别</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'male', label: '♂ 男' },
                { id: 'female', label: '♀ 女' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGender(g.id as 'male' | 'female')}
                  className={`py-3 rounded-2xl font-bold text-[14px] border transition ${
                    gender === g.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-100 bg-slate-50 text-slate-500'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-slate-500 block mb-1.5">绑定手机号</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200/80 px-4 py-3 text-[15px] font-medium text-slate-700 tabular-nums"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-slate-500 block mb-1.5">生日</label>
            <input
              type="date"
              disabled={user.birthdayLocked}
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200/80 px-4 py-3 text-[14px] font-medium text-slate-800 disabled:opacity-60"
            />
            <div className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-rose-500 font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>{user.birthdayLocked ? '生日已设置并锁定' : '生日仅限设置一次，生日当月享双倍环保积分'}</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-[15px] shadow-md active:scale-[0.98] transition"
          >
            保存资料
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
    <div className="min-h-full bg-[#F4F8F6] pb-24">
      <SubPageHeader title={selectMode ? '选择回收地址' : '我的地址'} />

      <div className="p-4 space-y-3">
        {addresses.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center">
            <EmptyInboxIllustration className="w-24 h-24" />
            <p className="text-[15px] font-bold text-slate-700 mt-3">当前暂无地址</p>
            <p className="text-[12px] text-slate-400 mt-1">添加常用回收地址，预约上门更快捷</p>
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
                    showToast(`已选用「${addr.community}」地址`, 'success');
                    goBack();
                  }
                }}
                className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition ${
                  selectMode && isSelected ? 'border-emerald-500' : 'border-transparent'
                } ${selectMode ? 'cursor-pointer active:scale-[0.99]' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-slate-900">{addr.contactName}</span>
                      <span className="text-[13px] text-slate-500 tabular-nums">{addr.phone}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          默认
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-slate-600 mt-1.5 leading-snug">
                      {addr.region} {addr.street} {addr.community} {addr.detail}
                    </p>
                  </div>
                  {selectMode && isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[12px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateAddress(addr.id, { isDefault: true });
                      setSelectedAddressId(addr.id);
                      showToast('已设为默认地址', 'success');
                    }}
                    className={`flex items-center gap-1.5 font-medium ${
                      addr.isDefault ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        addr.isDefault ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {addr.isDefault && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                    <span>设为默认</span>
                  </button>

                  <div className="flex items-center gap-4 text-slate-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({ name: 'address_edit', editId: addr.id });
                      }}
                      className="flex items-center gap-1 hover:text-emerald-600"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> 编辑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAddress(addr.id);
                        showToast('地址已删除', 'info');
                      }}
                      className="flex items-center gap-1 hover:text-rose-600"
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

      <div className="sticky bottom-0 inset-x-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 z-30">
        <button
          onClick={() => navigate({ name: 'address_edit' })}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-[15px] shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98] transition"
        >
          <Plus className="w-5 h-5" />
          <span>新增地址</span>
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
  const [region, setRegion] = useState(existing?.region ?? '北京市朝阳区');
  const [street, setStreet] = useState(existing?.street ?? '酒仙桥街道');
  const [community, setCommunity] = useState(existing?.community ?? '丽岛花园');
  const [detail, setDetail] = useState(existing?.detail ?? '');
  const [isDefault, setIsDefault] = useState(existing?.isDefault ?? true);

  const handleSave = () => {
    if (!contactName.trim() || !phone.trim() || !detail.trim()) {
      showToast('请完整填写联系人、手机号和详细地址', 'warning');
      return;
    }
    if (existing) {
      updateAddress(existing.id, {
        contactName: contactName.trim(),
        phone: phone.trim(),
        region,
        street,
        community,
        detail: detail.trim(),
        isDefault,
      });
      showToast('地址修改成功', 'success');
    } else {
      addAddress({
        contactName: contactName.trim(),
        phone: phone.trim(),
        region,
        street,
        community,
        detail: detail.trim(),
        isDefault,
      });
      showToast('新地址已添加', 'success');
    }
    goBack();
  };

  return (
    <div className="min-h-full bg-[#F4F8F6] pb-10">
      <SubPageHeader title={existing ? '编辑地址' : '新增地址'} />

      <div className="p-4 space-y-3.5">
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-950/5 divide-y divide-slate-100">
          <div className="flex items-center gap-3 pb-3">
            <span className="w-16 text-[14px] font-bold text-slate-800">联系人</span>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="请填写联系人姓名"
              className="flex-1 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3 pt-3">
            <span className="w-16 text-[14px] font-bold text-slate-800">手机号</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请填写11位手机号"
              className="flex-1 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none tabular-nums"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-950/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-slate-800">省市区与小区</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="省、市、区"
              className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-[13px]"
            />
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="街道"
              className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-[13px]"
            />
          </div>
          <input
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            placeholder="小区名称（例如：丽岛花园）"
            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-[13px]"
          />
          <input
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="详细地址（例如：3号楼2单元802室）"
            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-[13px]"
          />

          <button
            onClick={() => setIsDefault((v) => !v)}
            className="flex items-center gap-2 pt-1 text-[13px] font-medium text-slate-700"
          >
            <span
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                isDefault ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
              }`}
            >
              {isDefault && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </span>
            <span>设为默认地址</span>
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-[15px] shadow-md active:scale-[0.98] transition"
        >
          确认地址
        </button>
      </div>
    </div>
  );
};

/* ===================== 4. 使用说明与智能垃圾分类查询器（彻底修复原小程序空白页！） ===================== */
export const UsageGuidePage: React.FC = () => {
  const { navigate, setShowAppliancePicker } = useApp();
  const [query, setQuery] = useState('');

  const results = WASTE_CLASSIFICATION_DB.filter(
    (item) =>
      !query.trim() ||
      item.name.includes(query.trim()) ||
      item.category.includes(query.trim()) ||
      item.tip.includes(query.trim())
  );

  const badgeStyle = (cat: string) => {
    if (cat === '可回收物') return 'bg-sky-50 text-sky-700 border-sky-200';
    if (cat === '大件垃圾') return 'bg-orange-50 text-orange-700 border-orange-200';
    if (cat === '装修垃圾') return 'bg-stone-100 text-stone-700 border-stone-300';
    if (cat === '废旧家电') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (cat === '有害垃圾') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (cat === '厨余垃圾') return 'bg-lime-50 text-lime-700 border-lime-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const handleQuickAction = (action?: string) => {
    if (action === 'recyclables_hub') navigate({ name: 'recyclables_hub' });
    else if (action === 'bulky_booking') navigate({ name: 'bulky_booking' });
    else if (action === 'renovation_hub') navigate({ name: 'renovation_hub' });
    else if (action === 'appliance_booking') setShowAppliancePicker(true);
  };

  return (
    <div className="min-h-full bg-[#F4F8F6] pb-10">
      <SubPageHeader title="使用说明与分类查询" />

      <div className="p-4 space-y-4">
        {/* Interactive Smart Waste Search */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-4 text-white shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-200" />
            <h2 className="text-[16px] font-bold">北京垃圾分类智能查询</h2>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入物品名称（如：纸箱、电池、床垫、砖块、冰箱）"
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white text-slate-900 text-[13px] placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['快递纸箱', '电池', '旧沙发', '砖块', '冰箱', '外卖盒'].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-[11px] font-medium transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-2.5">
          {results.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-emerald-950/5 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[14px] font-bold text-slate-900">{item.name}</span>
                <span className={`shrink-0 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle(item.category)}`}>
                  {item.category}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed">{item.tip}</p>
              {item.actionRoute && (
                <button
                  onClick={() => handleQuickAction(item.actionRoute)}
                  className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-emerald-600 pt-0.5"
                >
                  <span>前往对应回收通道</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 4-Step App Guide */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-950/5 space-y-3">
          <h3 className="text-[15px] font-bold text-slate-900">京彩回收使用指南</h3>
          <div className="space-y-2.5 text-[12.5px] text-slate-600">
            <div className="p-3 rounded-2xl bg-slate-50">
              <div className="font-bold text-slate-900">1. 可回收物日常变现</div>
              <p className="mt-0.5">纸箱、塑料瓶、金属、旧衣物等可随时扫码投递至社区「24h智能回收机」，称重秒到账；满5公斤支持预约上门。</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50">
              <div className="font-bold text-slate-900">2. 大件家具与装修垃圾清运</div>
              <p className="mt-0.5">选择物品数量或装袋数，查看公开透明价格表与持证处置场资质，一键预约正规车辆上门清运。</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50">
              <div className="font-bold text-slate-900">3. 废旧家电免费拆运领补贴</div>
              <p className="mt-0.5">对接京东回收、中再生等正规拆解企业，在线即时估价，工程师免费上门拆机并当面结款。</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50">
              <div className="font-bold text-slate-900">4. 环保积分与碳账本成长</div>
              <p className="mt-0.5">每次参与交投均可累计减碳量与环保积分，升级 V1–V4 会员等级，并在「积分商城」兑换实用环保好礼。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===================== 5. 用户协议与隐私协议 ===================== */
export const UserAgreementPage: React.FC = () => {
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div className="min-h-full bg-gradient-to-b from-[#E6F8F2] to-[#F4F8F6] pb-10">
      <SubPageHeader title="用户协议" />

      <div className="px-4 pt-3 flex gap-2.5">
        <button
          onClick={() => setTab('terms')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition ${
            tab === 'terms' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600'
          }`}
        >
          用户协议
        </button>
        <button
          onClick={() => setTab('privacy')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition ${
            tab === 'privacy' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600'
          }`}
        >
          隐私协议
        </button>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-950/5 space-y-4 text-[13px] leading-relaxed text-slate-700">
          {tab === 'terms' ? (
            <>
              <h2 className="text-[18px] font-extrabold text-slate-900">用户服务须知</h2>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-1">1. 用户注册须知</h3>
                <p>
                  用户必须是中国境内的居民，且具有完全的民事权利能力及民事行为能力。若您是未满18周岁的未成年人，您应在您的监护人监护、指导下并获得监护人同意的情况下，认真阅读并同意本协议后，方可使用京彩回收软件及相关服务。
                </p>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-1">2. 用户使用规则</h3>
                <p>
                  用户不得利用本平台或本平台服务从事任何不符合中国法律法规或侵犯他人权益的活动。居民在交投可回收物、预约大件垃圾或装修垃圾清运时，应如实申报品类并配合分类规范投放，不得混入易燃易爆或危险化学品。
                </p>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-1">3. 结算与积分规则</h3>
                <p>
                  可回收物及废旧家电回收价格根据当日市场行情及现场称重/质检结果实时结算；大件垃圾与装修垃圾有偿清运费用按照平台公示参考标准与清运企业现场核验确认。环保积分可用于平台权益兑换，不支持直接提现。
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-[18px] font-extrabold text-slate-900">隐私权保护政策</h2>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-1">1. 信息收集与使用</h3>
                <p>
                  为向您提供附近智能回收机定位、上门回收调度与订单结算服务，本平台将在您明确授权后收集必要的地理位置、联系人姓名、手机号及服务地址信息。
                </p>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-1">2. 数据安全保障</h3>
                <p>
                  我们采用行业标准的加密传输与本地安全存储机制保护您的个人信息。本演示版本所有个人资料、地址与订单均仅保存在您的浏览器本地存储中，不会上传至第三方服务器。
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===================== 6. 环保积分兑换商城（新增亮点功能） ===================== */
export const PointsMallPage: React.FC = () => {
  const { user, redeemReward } = useApp();

  return (
    <div className="min-h-full bg-[#F4F8F6] pb-10">
      <SubPageHeader title="环保积分商城" />

      <div className="p-4 space-y-4">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 text-white shadow-lg flex items-center justify-between">
          <div>
            <div className="text-[12px] text-amber-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 当前可用环保积分
            </div>
            <div className="text-3xl font-black tabular-nums mt-1">{user.points}</div>
            <div className="text-[11px] text-amber-100 mt-1">
              每一次垃圾分类交投都在创造绿色价值
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Gift className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="space-y-3">
          {POINTS_REWARDS.map((rw) => {
            const affordable = user.points >= rw.points;
            return (
              <div
                key={rw.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-2xl flex items-center justify-center shrink-0">
                    {rw.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-bold text-slate-900 truncate">{rw.name}</div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{rw.desc}</p>
                    <div className="text-[12px] font-extrabold text-amber-600 mt-1 tabular-nums">
                      {rw.points} 积分
                      <span className="text-[10px] font-normal text-slate-400 ml-2">余 {rw.stock} 件</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => redeemReward(rw.points, rw.name)}
                  className={`shrink-0 px-3.5 py-2 rounded-xl text-[12px] font-bold transition active:scale-95 ${
                    affordable
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  立即兑换
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
