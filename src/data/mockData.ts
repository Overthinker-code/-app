import type {
  Address,
  DisposalUnit,
  KnowledgeArticle,
  QuizQuestion,
  RecycleOrder,
  StationPoint,
  UserProfile,
  WasteSearchItem,
} from '../types';

export const DEFAULT_USER: UserProfile = {
  nickname: '陈思远',
  phone: '13851426209',
  gender: 'male',
  birthday: '',
  birthdayLocked: false,
  district: '玄武区',
  community: '银城东苑',
  points: 340,
  carbonSavedKg: 21.4,
  totalCashEarned: 58.6,
  quizClaimed: false,
};

export const LEVEL_TIERS = [
  { level: 'Lv.1', name: '普通居民', minPoints: 0, maxPoints: 300 },
  { level: 'Lv.2', name: '分类达人', minPoints: 300, maxPoints: 800 },
  { level: 'Lv.3', name: '社区环保员', minPoints: 800, maxPoints: 2000 },
  { level: 'Lv.4', name: '金陵绿行者', minPoints: 2000, maxPoints: 5000 },
];

export function getUserLevel(points: number) {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_TIERS[i].minPoints) {
      const curr = LEVEL_TIERS[i];
      const next = LEVEL_TIERS[i + 1];
      const progress = next
        ? Math.min(100, Math.round(((points - curr.minPoints) / (next.minPoints - curr.minPoints)) * 100))
        : 100;
      return { ...curr, nextPoints: next?.minPoints ?? curr.maxPoints, progress };
    }
  }
  return { ...LEVEL_TIERS[0], nextPoints: 300, progress: 0 };
}

export interface NanjingCommunity {
  name: string;
  district: string;
  street: string;
  lat: number;
  lng: number;
}

export const NANJING_COMMUNITIES: NanjingCommunity[] = [
  { name: '银城东苑', district: '玄武区', street: '孝陵卫街道', lat: 32.0365, lng: 118.8542 },
  { name: '仁恒江湾城', district: '建邺区', street: '沙洲街道', lat: 32.0086, lng: 118.7168 },
  { name: '中海凤凰熙岸', district: '鼓楼区', street: '凤凰街道', lat: 32.0492, lng: 118.7421 },
  { name: '万科金域蓝湾', district: '秦淮区', street: '光华路街道', lat: 32.0128, lng: 118.8214 },
  { name: '仙林亚东城', district: '栖霞区', street: '仙林街道', lat: 32.0942, lng: 118.9186 },
  { name: '景枫翠湖苑', district: '江宁区', street: '东山街道', lat: 31.9334, lng: 118.8205 },
  { name: '雅居乐滨江国际', district: '江北新区', street: '顶山街道', lat: 32.1045, lng: 118.6725 },
];

export const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-nj-1',
    contactName: '陈思远',
    phone: '13851426209',
    region: '南京市玄武区',
    street: '孝陵卫街道',
    community: '银城东苑',
    detail: '18幢2单元501室',
    isDefault: true,
  },
  {
    id: 'addr-nj-2',
    contactName: '陈建国',
    phone: '13951783042',
    region: '南京市鼓楼区',
    street: '凤凰街道',
    community: '中海凤凰熙岸',
    detail: '5幢1单元1102室',
    isDefault: false,
  },
];

export const DAILY_MARKET_PRICES = [
  { id: 'paper', name: '黄板纸 / 快递箱', shortName: '废纸箱', price: 1.1, unit: '元/kg', trend: '+0.05', carbonPerKg: 1.3 },
  { id: 'plastic', name: 'PET 塑料瓶', shortName: '塑料瓶', price: 1.6, unit: '元/kg', trend: '持平', carbonPerKg: 2.1 },
  { id: 'metal', name: '废铁 / 易拉罐', shortName: '废金属', price: 2.4, unit: '元/kg', trend: '+0.1', carbonPerKg: 3.5 },
  { id: 'textile', name: '旧衣物 / 家纺', shortName: '旧衣物', price: 0.7, unit: '元/kg', trend: '持平', carbonPerKg: 2.8 },
  { id: 'glass', name: '玻璃瓶（完整）', shortName: '废玻璃', price: 0.35, unit: '元/kg', trend: '持平', carbonPerKg: 0.7 },
  { id: 'ewaste', name: '旧数码 / 线材', shortName: '小电子', price: 4.2, unit: '元/kg', trend: '+0.2', carbonPerKg: 4.2 },
];

export const RECYCLABLE_PROVIDERS = [
  { id: 'nj-prov-1', name: '南京城环便民回收服务队', rating: 4.9, response: '通常30分钟内接单', tag: '商务部门备案 · 高低值统收' },
  { id: 'nj-prov-2', name: '玄武洁小宝再生资源驿站', rating: 4.8, response: '当日预约当日上门', tag: '支持高龄老人免费下楼搬运' },
  { id: 'nj-prov-3', name: '金陵供销再生回收直营队', rating: 4.9, response: '大宗纸箱/书刊优选', tag: '电子秤当面复核结算' },
];

export const STATION_POINTS: StationPoint[] = [
  // 智能回收机
  {
    id: 'st-sm-1',
    type: 'smart_machine',
    name: '银城东苑西门智能回收柜 #01',
    district: '玄武区',
    address: '南京市玄武区钟灵街银城东苑西门北侧15米',
    lat: 32.0372,
    lng: 118.8529,
    distanceMeters: 160,
    hours: '24小时开放',
    status: 'online',
    capacityPercent: 32,
    categories: ['纸类', '塑料', '金属', '织物'],
    priceHighlight: '统收 0.8~1.5 元/kg，关门即结算',
  },
  {
    id: 'st-sm-2',
    type: 'smart_machine',
    name: '孝陵卫地铁站南广场回收亭 #04',
    district: '玄武区',
    address: '南京市玄武区中山门大街孝陵卫站2号口旁',
    lat: 32.0338,
    lng: 118.8576,
    distanceMeters: 440,
    hours: '24小时开放',
    status: 'online',
    capacityPercent: 58,
    categories: ['纸类', '塑料', '金属', '玻璃'],
    priceHighlight: '支持扫码开门，余额满1元可提现',
  },
  {
    id: 'st-sm-3',
    type: 'smart_machine',
    name: '钟山花园城东区智慧分类屋',
    district: '玄武区',
    address: '南京市玄武区卫岗21号东门车棚旁',
    lat: 32.0389,
    lng: 118.8435,
    distanceMeters: 920,
    hours: '06:00 - 23:00',
    status: 'busy',
    capacityPercent: 84,
    categories: ['纸类', '塑料', '旧衣物'],
    priceHighlight: '晚间 19:00-22:00 投递积分加倍',
  },
  {
    id: 'st-sm-4',
    type: 'smart_machine',
    name: '月牙湖公园南岸社区回收点',
    district: '秦淮区',
    address: '南京市秦淮区苜蓿园大街梅花山庄西门',
    lat: 32.0241,
    lng: 118.8318,
    distanceMeters: 2380,
    hours: '24小时开放',
    status: 'online',
    capacityPercent: 27,
    categories: ['纸类', '塑料', '金属', '废电池'],
    priceHighlight: '支持废电池与过期药品专口投放',
  },
  // 固定交投点
  {
    id: 'st-fx-1',
    type: 'fixed_station',
    name: '银城东苑物业东侧便民交投点',
    district: '玄武区',
    address: '南京市玄武区银城东苑物业管理处东侧',
    lat: 32.0361,
    lng: 118.8560,
    distanceMeters: 210,
    hours: '每日 07:30-11:30 / 15:00-18:30',
    status: 'online',
    capacityPercent: 42,
    categories: ['纸板', '书刊', '塑料', '金属', '旧衣', '小家电'],
    phone: '025-84431208',
    priceHighlight: '专人复秤，现场微信或余额结算',
  },
  {
    id: 'st-fx-2',
    type: 'fixed_station',
    name: '下马坊社区可回收物服务站',
    district: '玄武区',
    address: '南京市玄武区中山门大街下马坊社区中心旁',
    lat: 32.0382,
    lng: 118.8458,
    distanceMeters: 860,
    hours: '每日 08:00 - 18:00',
    status: 'online',
    capacityPercent: 51,
    categories: ['全品类可回收物', '玻璃瓶代收'],
    phone: '025-84426519',
    priceHighlight: '低值玻璃瓶、泡沫箱免费代收',
  },
  {
    id: 'st-fx-3',
    type: 'fixed_station',
    name: '河西建邺奥体新城交投驿站',
    district: '建邺区',
    address: '南京市建邺区江东中路奥体东门社区广场',
    lat: 32.0095,
    lng: 118.7320,
    distanceMeters: 4650,
    hours: '每日 08:00 - 19:00',
    status: 'online',
    capacityPercent: 30,
    categories: ['纸类', '金属', '小家电', '旧书籍'],
    phone: '025-87762910',
    priceHighlight: '支持预约上门与大件暂存对接',
  },
  // 中转站（分拣中心）
  {
    id: 'st-sc-1',
    type: 'sorting_center',
    name: '玄武孝陵卫再生资源绿色分拣中心',
    district: '玄武区',
    address: '南京市玄武区宁杭公路甲18号环卫产业园',
    lat: 32.0298,
    lng: 118.8695,
    distanceMeters: 1620,
    hours: '每日 07:00 - 19:30',
    status: 'online',
    capacityPercent: 46,
    categories: ['大宗废纸', '废旧金属', '塑料打包', '低值回收物'],
    phone: '025-84391160',
    priceHighlight: '50kg 以上大宗交投按分拣直收价计费',
  },
  {
    id: 'st-sc-2',
    type: 'sorting_center',
    name: '栖霞马群再生资源集散中转站',
    district: '栖霞区',
    address: '南京市栖霞区马群科技园青马路6号',
    lat: 32.0540,
    lng: 118.8982,
    distanceMeters: 4480,
    hours: '每日 06:30 - 19:00',
    status: 'online',
    capacityPercent: 55,
    categories: ['全品类分选', '大件拆解', '废纺再生'],
    phone: '025-85327704',
    priceHighlight: '支持沿街商铺与物业定期清运签约',
  },
];

export const BULKY_ITEMS_CATALOG = [
  { id: 'sofa-3', name: '三人位沙发', category: '客厅家具', unitPrice: 80, unit: '张', note: '含拆解与楼下装车' },
  { id: 'sofa-1', name: '单人沙发 / 休闲椅', category: '客厅家具', unitPrice: 40, unit: '张', note: '常规尺寸' },
  { id: 'mattress', name: '双人弹簧床垫', category: '卧室家具', unitPrice: 60, unit: '张', note: '1.5m / 1.8m 通用' },
  { id: 'wardrobe', name: '大衣柜（需拆板）', category: '卧室家具', unitPrice: 120, unit: '组', note: '含现场安全拆解' },
  { id: 'bedframe', name: '实木 / 板式床架', category: '卧室家具', unitPrice: 70, unit: '张', note: '附带床头柜另加15元' },
  { id: 'table', name: '餐桌 / 书桌', category: '桌椅柜', unitPrice: 50, unit: '张', note: '石材台面现场确认' },
  { id: 'bookshelf', name: '书柜 / 电视柜', category: '桌椅柜', unitPrice: 45, unit: '个', note: '长度 2 米以内' },
  { id: 'chair', name: '餐椅 / 办公椅', category: '桌椅柜', unitPrice: 15, unit: '把', note: '3把及以上享8折' },
];

export const BULKY_PROVIDERS = [
  { id: 'bp-1', name: '南京城管大件垃圾规范清运专队', rating: 4.9, badge: '属地环卫直管 · 明码标价', minOrder: 50 },
  { id: 'bp-2', name: '金陵再生大件拆解服务有限公司', rating: 4.8, badge: '自带拆装工具 · 合规处置', minOrder: 40 },
];

export const DISPOSAL_UNITS: DisposalUnit[] = [
  {
    id: 'du-1',
    name: '南京城建环境玄武建筑垃圾资源化处置中心',
    district: '玄武区',
    address: '南京市玄武区马群街道仙林大道南侧环保园区3号门',
    manager: '周明海',
    phone: '13851894421',
    licenseNo: '宁城管备〔2026〕0108号',
    creditGrade: 'AAA',
    rating: 4.9,
    orderCount: 1420,
    distanceKm: 4.6,
    pricing: {
      perBag: 8,
      perCubicMeter: 160,
      minCharge: 160,
      note: '标准编织袋（90×120cm）装七分满；开具南京市装修垃圾规范处置电子联单',
    },
  },
  {
    id: 'du-2',
    name: '建邺河西“五小”工程装修垃圾清运服务处',
    district: '建邺区',
    address: '南京市建邺区双闸街道扬子江大道南段清运基地',
    manager: '陆志远',
    phone: '13913827745',
    licenseNo: '宁城管备〔2026〕0214号',
    creditGrade: 'AAA',
    rating: 4.85,
    orderCount: 1185,
    distanceKm: 11.2,
    pricing: {
      perBag: 8.5,
      perCubicMeter: 165,
      minCharge: 170,
      note: '覆盖河西新城及主城区，支持物业集中报备与电子联单核验',
    },
  },
  {
    id: 'du-3',
    name: '江宁东山绿色建材再生处置场',
    district: '江宁区',
    address: '南京市江宁区淳化街道工业集中区东侧18号',
    manager: '孙立群',
    phone: '13770556192',
    licenseNo: '宁城管备〔2026〕0329号',
    creditGrade: 'AA',
    rating: 4.8,
    orderCount: 936,
    distanceKm: 13.5,
    pricing: {
      perBag: 7.5,
      perCubicMeter: 150,
      minCharge: 150,
      note: '砖渣混凝土与废木料分袋装运可享 9 折清运优惠',
    },
  },
  {
    id: 'du-4',
    name: '江北新区扬子建筑垃圾资源化消纳场',
    district: '江北新区',
    address: '南京市江北新区盘城街道浦六北路216号',
    manager: '许国强',
    phone: '13605178830',
    licenseNo: '宁江北备〔2026〕0047号',
    creditGrade: 'AA',
    rating: 4.75,
    orderCount: 804,
    distanceKm: 17.8,
    pricing: {
      perBag: 7.5,
      perCubicMeter: 145,
      minCharge: 150,
      note: '接入江北新区装修垃圾闭环监管系统，车辆北斗轨迹全程可查',
    },
  },
];

export const APPLIANCE_PROVIDERS = [
  {
    id: 'jd',
    name: '京东回收（南京站）',
    slogan: '免费上门拆机 · 支持以旧换新补贴',
    accent: '#C81E1E',
    tag: '官方合作',
    features: ['免费拆机搬运', '当面验机打款', '可领换新补贴'],
  },
  {
    id: 'crra',
    name: '中再生江苏拆解中心',
    slogan: '合规无害化拆解 · 坏机老旧机通收',
    accent: '#1D6F5A',
    tag: '持证拆解',
    features: ['南京本地直营车队', '全品类旧机通收', '额外赠双倍积分'],
  },
  {
    id: 'suning',
    name: '苏宁帮客绿色回收',
    slogan: '南京本土服务网点 · 主城最快2小时达',
    accent: '#B45309',
    tag: '南京本土',
    features: ['空调高空免费拆', '老小区免费下楼', '现场即时结款'],
  },
];

export const APPLIANCE_CATALOG = [
  { id: 'fridge', name: '电冰箱', basePrice: 160, weightKg: 48, desc: '单门 / 双门 / 对开门' },
  { id: 'washer', name: '洗衣机', basePrice: 120, weightKg: 40, desc: '滚筒 / 波轮全自动' },
  { id: 'ac', name: '空调（挂机 / 柜机）', basePrice: 240, weightKg: 35, desc: '含专业拆机服务' },
  { id: 'tv', name: '平板电视', basePrice: 90, weightKg: 18, desc: '32-75 寸液晶电视' },
  { id: 'heater', name: '热水器', basePrice: 80, weightKg: 22, desc: '电热水器 / 燃气热水器' },
  { id: 'microwave', name: '微波炉 / 烤箱', basePrice: 35, weightKg: 12, desc: '台式 / 嵌入式厨电' },
  { id: 'pc', name: '电脑 / 显示器', basePrice: 110, weightKg: 8, desc: '台式机 / 笔记本 / 屏幕' },
  { id: 'small', name: '小家电组合', basePrice: 25, weightKg: 6, desc: '电扇 / 水壶 / 电饭煲等' },
];

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-nj-1',
    tab: 'policy',
    title: '《南京市生活垃圾管理条例》居民分类投放核心要点',
    source: '南京市城市管理局',
    date: '2026-04-12',
    tag: '条例解读',
    summary: '明确南京市实行可回收物、有害垃圾、厨余垃圾、其他垃圾四分类标准，大件与装修垃圾严禁混投。',
    content: [
      '一、分类标准：南京市生活垃圾分为可回收物（蓝）、有害垃圾（红）、厨余垃圾（绿）、其他垃圾（灰）四类。',
      '二、大件垃圾管理：废旧沙发、床垫、衣柜等体积较大的废弃家具，不得投放到普通生活垃圾收集点，应投放至物业指定的大件垃圾暂存点或线上预约合规车辆上门清运。',
      '三、装修垃圾规范：居民装饰装修产生的砖渣、瓷砖、水泥块等应采用标准编织袋袋装化，与生活垃圾分别归集，预约经南京市城管部门备案的清运单位规范外运处置。',
      '四、资源化激励：鼓励市民通过小区智能回收箱、便民交投点交售高低值可回收物，所获积分可兑换金陵通出行券或生活物资。',
    ],
  },
  {
    id: 'art-nj-2',
    tab: 'policy',
    title: '南京主城区及江北新区装修垃圾“电子联单”清运指引',
    source: '南京市建筑垃圾管理处',
    date: '2026-06-18',
    tag: '办事指南',
    summary: '通过线上平台报备清运后自动生成电子联单，一车一单全程追踪，杜绝黑车偷倒乱收费。',
    content: [
      '1. 居民装修开工前，可向小区物业报备，或在「宁回收 -> 装修垃圾预约」中选择所属行政区、街道与小区，如实填写预估袋数或方数。',
      '2. 系统公示具备《城市建筑垃圾处置核准证》的正规清运处置企业及按袋/按方参考收费标准，居民自主比价下单。',
      '3. 车辆进场清运时由师傅扫码核验，完成后自动生成南京市规范处置电子联单，可在订单详情中随时查看和下载凭证。',
    ],
  },
  {
    id: 'art-nj-3',
    tab: 'guide',
    title: '南京居民装修垃圾装袋与堆放规范（90×120cm）',
    source: '宁回收服务指引',
    date: '2026-08-05',
    tag: '投放指南',
    summary: '砖石渣土、废木板与可回收纸箱分开归集，清运更省钱、现场不扬尘。',
    content: [
      '1. 砖渣与碎瓷砖：使用加厚 90×120cm 编织袋装至七分满（每袋约 15-20kg），扎紧袋口防止撒漏。',
      '2. 门窗与木板：拔除裸露铁钉，捆扎长度控制在 1.5 米以内，便于装车。',
      '3. 纸箱与废金属：卫浴纸箱、旧水龙头、铝合金窗框属于高值可回收物，建议直接通过「可回收物交投」卖钱，不要作为装修垃圾付费清运。',
      '4. 油漆桶与胶罐：属于有害垃圾，应单独投放至小区红色有害垃圾收集箱。',
    ],
  },
  {
    id: 'art-nj-4',
    tab: 'guide',
    title: '废旧家电以旧换新与安全拆机注意事项',
    source: '宁回收服务指引',
    date: '2026-09-14',
    tag: '投放指南',
    summary: '空调制冷剂与老旧显像管含受控物质，切勿私自拆解，请由持证人员免费上门拆运。',
    content: [
      '1. 预约前请确认家电大致尺寸及楼栋电梯情况；空调外机如需高空作业，正规合作企业（如苏宁帮客、京东回收）均配备持证高空作业人员。',
      '2. 废旧手机、电脑交投前请提前备份并清除个人数据，恢复出厂设置。',
      '3. 即使旧家电无法通电开机，仍具备拆解残值，可通过本平台预约合规拆解并领取残值补贴与积分。',
    ],
  },
  {
    id: 'art-nj-5',
    tab: 'activity',
    title: '南京秋季「梧桐叶落 · 换新返积分」社区便民回收活动',
    source: '南京社区便民通知',
    date: '2026-11-01',
    tag: '进行中',
    summary: '11月每周六上午在玄武、鼓楼、建邺重点小区增设流动称重点，交投满 5kg 额外加赠 50 积分。',
    content: [
      '活动时间：2026年11月1日 — 2026年11月30日。',
      '活动范围：玄武区、鼓楼区、建邺区、秦淮区、栖霞区合作小区智能回收机及便民交投点。',
      '活动说明：活动期间参与废纸箱、旧衣物或旧家电交投，结算积分可前往「我的 -> 积分兑换」换取南京地铁出行券、金陵通充值金或分类垃圾袋。',
    ],
  },
];

export const WASTE_CLASSIFICATION_DB: WasteSearchItem[] = [
  { name: '快递纸箱 / 报纸 / 杂志', aliases: '纸盒 书本 纸板', category: '可回收物', tip: '拆平压扁捆扎后投放智能回收机或预约上门，约 1.1 元/kg', actionRoute: 'recyclables_hub' },
  { name: '矿泉水瓶 / 饮料瓶', aliases: '塑料瓶 PET 奶茶塑料杯', category: '可回收物', tip: '倒空液体、压扁拧紧瓶盖后投入蓝色回收箱或智能柜', actionRoute: 'recyclables_hub' },
  { name: '易拉罐 / 废铁锅 / 铝合金', aliases: '金属 铝罐 铁皮', category: '可回收物', tip: '清理残留液体后交投，金属回收单价较高', actionRoute: 'recyclables_hub' },
  { name: '旧衣服 / 床单 / 毛绒玩具', aliases: '纺织品 鞋子 包包', category: '可回收物', tip: '保持干燥洁净装袋投递，勿混入沾油污破布', actionRoute: 'recyclables_hub' },
  { name: '玻璃酒瓶 / 酱油瓶', aliases: '玻璃 瓶子', category: '可回收物', tip: '洗净晾干后轻放至固定交投点或智能柜玻璃口；碎玻璃请包好投其他垃圾', actionRoute: 'recyclables_hub' },
  { name: '小龙虾壳 / 盐水鸭骨 / 鱼刺', aliases: '鸭骨 虾壳 蟹壳 果皮 菜叶', category: '厨余垃圾', tip: '南京标准中：小龙虾壳、鸡鸭小骨头、瓜果皮核均属厨余垃圾，请沥干破袋投放绿桶' },
  { name: '猪大骨 / 牛大骨 / 榴莲壳 / 椰子壳', aliases: '大棒骨 硬贝壳 玉米衣', category: '其他垃圾', tip: '质地坚硬难以生化堆肥处理，按南京分类标准投入灰色「其他垃圾」桶' },
  { name: '外卖餐盒 / 纸杯 / 污染塑料袋', aliases: '外卖盒 奶茶杯 卫生纸 烟头', category: '其他垃圾', tip: '倒净残余食物和汤汁（入厨余），受油污污染的餐盒与纸巾投灰色「其他垃圾」桶' },
  { name: '废充电电池 / 纽扣电池 / 荧光灯管', aliases: '电池 锂电池 蓄电池 灯管', category: '有害垃圾', tip: '含重金属及汞元素，请轻放至小区红色「有害垃圾」收集容器；普通无汞干电池可投其他垃圾' },
  { name: '过期药品 / 水银温度计 / 油漆桶', aliases: '药片 农药 胶水 杀虫剂', category: '有害垃圾', tip: '请连同原包装或密封袋投入红色有害垃圾桶，切勿拆散混入生活垃圾' },
  { name: '旧沙发 / 弹簧床垫 / 大衣柜', aliases: '家具 床架 书桌 餐桌', category: '大件垃圾', tip: '禁止丢弃在楼道或普通垃圾桶旁，请通过「大件家具清运」预约规范收运', actionRoute: 'bulky_booking' },
  { name: '砖块 / 碎瓷砖 / 水泥渣土 / 旧马桶', aliases: '装修 建筑垃圾 木板 门窗', category: '装修垃圾', tip: '按袋装化要求堆放，通过「装修垃圾清运」预约南京城管备案处置单位', actionRoute: 'renovation_hub' },
  { name: '废旧冰箱 / 洗衣机 / 空调 / 电视', aliases: '家电 热水器 微波炉 电脑', category: '废旧家电', tip: '含制冷剂及可再生贵金属，请使用「废旧家电回收」免费拆机并领返现', actionRoute: 'appliance_booking' },
];

export const NANJING_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    item: '吃完的南京盐水鸭骨头 / 小龙虾壳',
    context: '按《南京市生活垃圾管理条例》分类标准，应投入哪个桶？',
    options: ['可回收物', '厨余垃圾', '有害垃圾', '其他垃圾'],
    answer: '厨余垃圾',
    explanation: '鸡鸭小骨头、小龙虾壳、鱼刺易腐可生化处理，在南京属于「厨余垃圾」；但猪牛大棒骨属于「其他垃圾」。',
  },
  {
    id: 'q2',
    item: '喝完未洗净、沾满奶盖的纸质奶茶杯',
    context: '将剩余液体倒入下水道后，空杯身应如何投放？',
    options: ['可回收物', '厨余垃圾', '有害垃圾', '其他垃圾'],
    answer: '其他垃圾',
    explanation: '一次性纸杯内壁覆有防水塑料膜且受饮品污染，难以再生利用，沥干后应投入灰色「其他垃圾」桶。',
  },
  {
    id: 'q3',
    item: '家用过期感冒药（连带铝塑泡罩板）',
    context: '家中整理出的过期药品应当怎么处理？',
    options: ['可回收物', '厨余垃圾', '有害垃圾', '其他垃圾'],
    answer: '有害垃圾',
    explanation: '过期药品属于「有害垃圾」，请保留外包装直接投放至小区红色有害垃圾收集容器，防止污染水源。',
  },
  {
    id: 'q4',
    item: '拆完快递后的干爽瓦楞纸箱',
    context: '撕掉多余胶带压扁后，正确的去向是？',
    options: ['可回收物', '厨余垃圾', '有害垃圾', '其他垃圾'],
    answer: '可回收物',
    explanation: '干净干燥的快递纸箱属于高值「可回收物」，可以直接扫码投进小区智能回收柜变现。',
  },
  {
    id: 'q5',
    item: '坚硬的猪大棒骨与榴莲外壳',
    context: '煲汤剩下的大棒骨为什么不能进厨余垃圾桶？',
    options: ['可回收物', '厨余垃圾', '有害垃圾', '其他垃圾'],
    answer: '其他垃圾',
    explanation: '大棒骨和榴莲壳质地极硬，易损坏厨余垃圾粉碎设备且难以降解，应投入「其他垃圾」桶。',
  },
];

export const INITIAL_ORDERS: RecycleOrder[] = [
  {
    id: 'ord-nj-1001',
    orderNo: 'NJ202611220841',
    manifestNo: 'LD-NJ-XW-202611220041',
    category: 'recyclable',
    categoryLabel: '可回收物上门回收',
    status: 'completed',
    createdAt: '2026-11-22 10:15',
    appointmentTime: '2026-11-22 14:00-16:00',
    addressText: '南京市玄武区孝陵卫街道 银城东苑 18幢2单元501室',
    contactName: '陈思远',
    contactPhone: '13851426209',
    providerName: '南京城环便民回收服务队',
    itemsSummary: '废纸箱 9.5kg、PET 塑料瓶 2.5kg',
    estimatedAmount: 14.45,
    isFee: false,
    estimatedPoints: 90,
    estimatedWeightKg: 12.0,
    collector: {
      name: '周师傅',
      phone: '13851092231',
      plateNo: '苏A·D8216',
    },
    timeline: [
      { time: '11-22 10:15', title: '预约已提交', desc: '订单已推送至南京城环便民回收服务队', done: true },
      { time: '11-22 10:26', title: '师傅已接单', desc: '周师傅（苏A·D8216）已确认下午上门时段', done: true },
      { time: '11-22 14:18', title: '现场电子秤复核', desc: '实测净重 12.0kg，已现场确认品类单价', done: true },
      { time: '11-22 14:20', title: '结算完成', desc: '回收款 ¥14.45 已发放，同步累计 +90 积分', done: true },
    ],
  },
  {
    id: 'ord-nj-1002',
    orderNo: 'NJ202611231510',
    manifestNo: 'LD-NJ-XW-202611230189',
    category: 'appliance',
    categoryLabel: '废旧家电回收',
    status: 'assigned',
    createdAt: '2026-11-23 15:10',
    appointmentTime: '2026-11-24 10:00-12:00',
    addressText: '南京市玄武区孝陵卫街道 银城东苑 18幢2单元501室',
    contactName: '陈思远',
    contactPhone: '13851426209',
    providerName: '苏宁帮客绿色回收',
    itemsSummary: '滚筒洗衣机（完好可用）×1',
    estimatedAmount: 153,
    isFee: false,
    estimatedPoints: 160,
    estimatedWeightKg: 40,
    remarks: '有电梯，进西门前可提前电话联系',
    collector: {
      name: '刘工',
      phone: '13951648820',
      plateNo: '苏A·9H302',
    },
    timeline: [
      { time: '11-23 15:10', title: '预约已提交', desc: '已选择苏宁帮客南京网点上门回收', done: true },
      { time: '11-23 15:24', title: '已指派工程师', desc: '刘工将于明日 10:00-12:00 免费上门拆运', done: true },
      { time: '待上门', title: '现场验机与打款', desc: '核验成色后当面结算回收款并开具凭证', done: false },
    ],
  },
  {
    id: 'ord-nj-1003',
    orderNo: 'NJ202611231805',
    manifestNo: 'LD-NJ-XW-202611230276',
    category: 'bulky',
    categoryLabel: '大件家具清运',
    status: 'pending',
    createdAt: '2026-11-23 18:05',
    appointmentTime: '2026-11-25 14:00-16:00',
    addressText: '南京市玄武区孝陵卫街道 银城东苑 18幢2单元501室',
    contactName: '陈思远',
    contactPhone: '13851426209',
    providerName: '南京城管大件垃圾规范清运专队',
    itemsSummary: '双人弹簧床垫 ×1、餐椅 ×2',
    estimatedAmount: 90,
    isFee: true,
    estimatedPoints: 60,
    estimatedWeightKg: 35,
    hasElevator: true,
    remarks: '床垫已靠玄关放好，小区西门可进厢货',
    timeline: [
      { time: '11-23 18:05', title: '清运预约已提交', desc: '等待玄武区大件清运调度中心派车', done: true },
      { time: '待确认', title: '调度派车确认', desc: '工作人员将在2小时内致电确认上门细节', done: false },
      { time: '待服务', title: '规范清运与拆解', desc: '清运至大件拆解中心并生成电子联单', done: false },
    ],
  },
];

export const POINTS_REWARDS = [
  { id: 'rw-1', name: '分类垃圾袋（蓝绿灰 3 卷装）', points: 120, stock: 64, tag: '居家实用', desc: '加厚平口 45×50cm，符合南京分类投放色标' },
  { id: 'rw-2', name: '金陵通 / 南京地铁出行金 ¥5', points: 250, stock: 140, tag: '交通出行', desc: '兑换码直接充值至金陵通或地铁乘车账户' },
  { id: 'rw-3', name: '大件 / 装修清运 20元抵扣券', points: 360, stock: 42, tag: '清运立减', desc: '预约南京主城大件家具或装修垃圾清运直接抵扣' },
  { id: 'rw-4', name: '社区便民超市 15元满减券', points: 420, stock: 28, tag: '便民商超', desc: '玄武、鼓楼、建邺合作社区生鲜店满30可用' },
];
