import type {
  Address,
  DisposalUnit,
  KnowledgeArticle,
  RecycleOrder,
  StationPoint,
  UserProfile,
  WasteSearchItem,
} from '../types';

export const DEFAULT_USER: UserProfile = {
  nickname: '回收使者13036160091',
  phone: '13036160091',
  gender: 'unset',
  birthday: '',
  birthdayLocked: false,
  community: '丽岛花园',
  points: 320,
  carbonSavedKg: 18.6,
  totalCashEarned: 46.8,
  avatarId: 'eco-avatar',
};

export const LEVEL_TIERS = [
  { level: 'V1', name: '京彩新星', minPoints: 0, maxPoints: 300 },
  { level: 'V2', name: '环保先锋', minPoints: 300, maxPoints: 800 },
  { level: 'V3', name: '绿色卫士', minPoints: 800, maxPoints: 2000 },
  { level: 'V4', name: '零碳大使', minPoints: 2000, maxPoints: 5000 },
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

export const BEIJING_COMMUNITIES = [
  { name: '丽岛花园', district: '朝阳区', street: '酒仙桥街道' },
  { name: '望京西园三区', district: '朝阳区', street: '望京街道' },
  { name: '太阳公元', district: '朝阳区', street: '太阳宫乡' },
  { name: '回龙观龙腾苑', district: '昌平区', street: '龙泽园街道' },
  { name: '中关村科育小区', district: '海淀区', street: '中关村街道' },
  { name: '广安门外红居街', district: '西城区', street: '广安门外街道' },
];

export const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    contactName: '张明',
    phone: '13036160091',
    region: '北京市朝阳区',
    street: '酒仙桥街道',
    community: '丽岛花园',
    detail: '3号楼2单元802室',
    isDefault: true,
  },
  {
    id: 'addr-2',
    contactName: '张明（父母家）',
    phone: '13810294418',
    region: '北京市海淀区',
    street: '中关村街道',
    community: '中关村科育小区',
    detail: '12号楼1单元401室',
    isDefault: false,
  },
];

export const DAILY_MARKET_PRICES = [
  { id: 'paper', name: '黄板纸/纸箱', price: 1.2, unit: '元/kg', trend: '+0.1', icon: '📦', carbonPerKg: 1.3 },
  { id: 'plastic', name: '塑料瓶/PET', price: 1.8, unit: '元/kg', trend: '+0.2', icon: '🧴', carbonPerKg: 2.1 },
  { id: 'metal', name: '废铁/铝罐', price: 2.6, unit: '元/kg', trend: '持平', icon: '🥫', carbonPerKg: 3.5 },
  { id: 'textile', name: '旧衣物/织物', price: 0.8, unit: '元/kg', trend: '+0.1', icon: '👕', carbonPerKg: 2.8 },
  { id: 'glass', name: '废玻璃瓶', price: 0.4, unit: '元/kg', trend: '持平', icon: '🍾', carbonPerKg: 0.7 },
  { id: 'ewaste', name: '小型电子废品', price: 4.5, unit: '元/kg', trend: '+0.3', icon: '🔌', carbonPerKg: 4.2 },
];

export const RECYCLABLE_PROVIDERS = [
  { id: 'prov-1', name: '京彩绿能社区回收服务队', rating: 4.9, response: '平均25分钟响应', tag: '官方认证 · 高低值统收' },
  { id: 'prov-2', name: '朝阳环卫爱分类便民队', rating: 4.8, response: '平均40分钟响应', tag: '支持敬老免费搬运' },
  { id: 'prov-3', name: '首钢资源循环服务站', rating: 4.9, response: '当日预约当日达', tag: '大宗纸箱/金属优选' },
];

export const STATION_POINTS: StationPoint[] = [
  // 智能回收机
  {
    id: 'st-sm-1',
    type: 'smart_machine',
    name: '丽岛花园北门智能回收站 #01',
    address: '北京市朝阳区酒仙桥路丽岛花园北门西侧20米',
    distanceMeters: 180,
    hours: '24小时全天候开放',
    status: 'online',
    capacityPercent: 34,
    categories: ['纸类', '塑料', '金属', '织物'],
    priceHighlight: '统收 0.8~1.5 元/kg · 秒到账',
    xPercent: 48,
    yPercent: 44,
  },
  {
    id: 'st-sm-2',
    type: 'smart_machine',
    name: '丽岛花园中心广场智能柜 #02',
    address: '北京市朝阳区丽岛花园5号楼南侧小广场',
    distanceMeters: 420,
    hours: '24小时全天候开放',
    status: 'online',
    capacityPercent: 62,
    categories: ['纸类', '塑料', '金属', '玻璃'],
    priceHighlight: '支持扫码开门 · 返现金+积分',
    xPercent: 66,
    yPercent: 32,
  },
  {
    id: 'st-sm-3',
    type: 'smart_machine',
    name: '酒仙桥晶都国际智慧回收亭',
    address: '北京市朝阳区酒仙桥路14号院东门',
    distanceMeters: 880,
    hours: '24小时全天候开放',
    status: 'busy',
    capacityPercent: 86,
    categories: ['纸类', '塑料', '旧衣物'],
    priceHighlight: '夜间投递享双倍环保积分',
    xPercent: 28,
    yPercent: 62,
  },
  {
    id: 'st-sm-4',
    type: 'smart_machine',
    name: '将台路颐堤港社区绿色微站',
    address: '北京市朝阳区酒仙桥路18号南广场',
    distanceMeters: 2150,
    hours: '06:00 - 23:00',
    status: 'online',
    capacityPercent: 24,
    categories: ['纸类', '塑料', '金属', '有害垃圾'],
    priceHighlight: '满1kg赠10环保积分',
    xPercent: 78,
    yPercent: 72,
  },
  // 固定交投点
  {
    id: 'st-fx-1',
    type: 'fixed_station',
    name: '丽岛花园物业东侧固定交投点',
    address: '北京市朝阳区丽岛花园物业服务中心旁',
    distanceMeters: 260,
    hours: '每日 07:30 - 11:30 / 15:00 - 19:00',
    status: 'online',
    capacityPercent: 40,
    categories: ['纸板', '书刊', '塑料', '金属', '旧衣', '小家电'],
    phone: '010-64378821',
    priceHighlight: '专人值守称重 · 现场微信结算',
    xPercent: 56,
    yPercent: 50,
  },
  {
    id: 'st-fx-2',
    type: 'fixed_station',
    name: '红霞路社区可回收物便民驿站',
    address: '北京市朝阳区红霞路甲5号社区广场',
    distanceMeters: 940,
    hours: '每日 08:00 - 18:30',
    status: 'online',
    capacityPercent: 52,
    categories: ['全品类可回收物', '过期药品/电池'],
    phone: '010-64362910',
    priceHighlight: '支持敬老预约上门',
    xPercent: 34,
    yPercent: 36,
  },
  {
    id: 'st-fx-3',
    type: 'fixed_station',
    name: '望京南湖东园环保交投小屋',
    address: '北京市朝阳区南湖东园二区北门',
    distanceMeters: 2850,
    hours: '每日 08:00 - 19:00',
    status: 'online',
    capacityPercent: 28,
    categories: ['纸类', '塑料', '玻璃', '金属', '家具拆解'],
    phone: '010-64715590',
    priceHighlight: '低值玻璃/泡沫免费代收',
    xPercent: 22,
    yPercent: 24,
  },
  // 中转站（分拣中心）
  {
    id: 'st-sc-1',
    type: 'sorting_center',
    name: '朝阳酒仙桥再生资源绿色分拣中心',
    address: '北京市朝阳区酒仙桥北路甲10号环保产业园',
    distanceMeters: 1650,
    hours: '周一至周日 07:00 - 20:00',
    status: 'online',
    capacityPercent: 45,
    categories: ['大宗废纸', '废旧金属', '塑料打包', '低值回收物'],
    phone: '010-84561120',
    priceHighlight: '大宗交投享出厂直收价',
    xPercent: 72,
    yPercent: 42,
  },
  {
    id: 'st-sc-2',
    type: 'sorting_center',
    name: '朝阳东坝循环经济分拣中转站',
    address: '北京市朝阳区东坝中街环保物流基地3号库',
    distanceMeters: 4200,
    hours: '每日 06:30 - 19:30',
    status: 'online',
    capacityPercent: 58,
    categories: ['全品类分选', '大件拆解', '废纺再生'],
    phone: '010-84327765',
    priceHighlight: '企事业单位可签定期清运协议',
    xPercent: 82,
    yPercent: 66,
  },
];

export const BULKY_ITEMS_CATALOG = [
  { id: 'sofa-3', name: '三人位沙发', category: '客厅家具', unitPrice: 80, unit: '张', icon: '🛋️', note: '含拆解搬运' },
  { id: 'sofa-1', name: '单人沙发/躺椅', category: '客厅家具', unitPrice: 40, unit: '张', icon: '🪑', note: '常规尺寸' },
  { id: 'mattress', name: '双人弹簧床垫', category: '卧室家具', unitPrice: 60, unit: '张', icon: '🛏️', note: '1.5m/1.8m通用' },
  { id: 'wardrobe', name: '大衣柜（拆解）', category: '卧室家具', unitPrice: 120, unit: '组', icon: '🚪', note: '含现场安全拆板' },
  { id: 'bedframe', name: '实木/板式床架', category: '卧室家具', unitPrice: 70, unit: '张', icon: '🪵', note: '含床头柜加15元' },
  { id: 'table', name: '餐桌/书桌', category: '桌椅柜', unitPrice: 50, unit: '张', icon: '🍽️', note: '大理石台面另议' },
  { id: 'bookshelf', name: '书柜/电视柜', category: '桌椅柜', unitPrice: 45, unit: '个', icon: '📚', note: '长度2米内' },
  { id: 'chair', name: '餐椅/办公转椅', category: '桌椅柜', unitPrice: 15, unit: '把', icon: '💺', note: '满3把享8折' },
];

export const BULKY_PROVIDERS = [
  { id: 'bp-1', name: '北京环卫集团大件清运专队', rating: 4.9, badge: '市政直营 · 明码标价', minOrder: 50 },
  { id: 'bp-2', name: '京城绿盾再生拆解服务有限公司', rating: 4.8, badge: '自带工具 · 专业拆装', minOrder: 40 },
];

export const DISPOSAL_UNITS: DisposalUnit[] = [
  {
    id: 'du-1',
    name: '北京中翔路桥公路材料有限公司资源化处置场',
    district: '昌平区',
    address: '北京市昌平区回龙观镇西半壁店村',
    manager: '王立军',
    phone: '13701137655',
    creditGrade: 'AAA',
    rating: 4.9,
    orderCount: 1286,
    distanceKm: 8.4,
    pricing: {
      perBag: 8,
      perCubicMeter: 160,
      minCharge: 180,
      note: '标准编织袋（90×120cm）装袋七分满，含正规联单与无害化资源处置费',
    },
  },
  {
    id: 'du-2',
    name: '通州市政垡头建筑垃圾临时贮存场站',
    district: '通州区',
    address: '北京市通州区潞城镇武兴路7号B2237室',
    manager: '陈滨',
    phone: '13716117987',
    creditGrade: 'AA',
    rating: 4.8,
    orderCount: 942,
    distanceKm: 12.6,
    pricing: {
      perBag: 7.5,
      perCubicMeter: 150,
      minCharge: 150,
      note: '支持小区定点集中清运，砖渣与木料分类装袋可享9折优惠',
    },
  },
  {
    id: 'du-3',
    name: '朝阳环卫绿源装修垃圾资源化处置中心',
    district: '朝阳区',
    address: '北京市朝阳区金盏乡长店环保产业园2号门',
    manager: '李建华',
    phone: '13910883421',
    creditGrade: 'AAA',
    rating: 4.95,
    orderCount: 1640,
    distanceKm: 5.2,
    pricing: {
      perBag: 8.5,
      perCubicMeter: 170,
      minCharge: 160,
      note: '朝阳区最快2小时响应派车，支持电子联单实时追踪处置去向',
    },
  },
  {
    id: 'du-4',
    name: '海淀京西绿色再生建材处置场',
    district: '海淀区',
    address: '北京市海淀区苏家坨镇前沙涧工业区西侧',
    manager: '赵志强',
    phone: '13601228940',
    creditGrade: 'AA',
    rating: 4.7,
    orderCount: 718,
    distanceKm: 15.8,
    pricing: {
      perBag: 8,
      perCubicMeter: 155,
      minCharge: 180,
      note: '可开具北京市建筑垃圾规范处置证明，支持物业批量结算',
    },
  },
];

export const APPLIANCE_PROVIDERS = [
  {
    id: 'jd',
    name: '京东回收',
    slogan: '极速上门 · 拆旧换新最高补贴15%',
    accent: '#E1251B',
    tag: '官方合作',
    features: ['免费拆机搬运', '当面质检秒打款', '支持以旧换新券'],
  },
  {
    id: 'crra',
    name: '中再生回收',
    slogan: '国家队正规拆解 · 环保补贴直达',
    accent: '#059669',
    tag: '央企资质',
    features: ['持证无害化拆解', '全品类家电通收', '额外赠双倍积分'],
  },
  {
    id: 'jc-self',
    name: '京彩绿色直收',
    slogan: '社区便民直收 · 透明估价零套路',
    accent: '#0284C7',
    tag: '本市直营',
    features: ['丽岛花园1小时达', '坏机/老旧机照收', '支持现金+积分'],
  },
];

export const APPLIANCE_CATALOG = [
  { id: 'fridge', name: '电冰箱', icon: '🧊', basePrice: 160, weightKg: 48, desc: '单门/双门/对开门' },
  { id: 'washer', name: '洗衣机', icon: '🌀', basePrice: 120, weightKg: 40, desc: '滚筒/波轮全自动' },
  { id: 'ac', name: '空调（挂机/柜机）', icon: '❄️', basePrice: 240, weightKg: 35, desc: '含专业高空免费拆机' },
  { id: 'tv', name: '液晶电视', icon: '📺', basePrice: 90, weightKg: 18, desc: '32-75寸平板电视' },
  { id: 'heater', name: '热水器', icon: '🚿', basePrice: 80, weightKg: 22, desc: '电热水器/燃气热水器' },
  { id: 'microwave', name: '微波炉/烤箱', icon: '🍳', basePrice: 35, weightKg: 12, desc: '台式/嵌入式厨电' },
  { id: 'pc', name: '电脑/显示器', icon: '💻', basePrice: 110, weightKg: 8, desc: '台式机/笔记本/显示器' },
  { id: 'small', name: '小家电组合', icon: '⚡', basePrice: 25, weightKg: 6, desc: '电风扇/水壶/电饭煲等' },
];

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-1',
    tab: 'policy',
    title: '北京市建筑垃圾处置管理规定',
    source: '北京市城市管理委员会官网',
    date: '2026-03-15',
    tag: '政策法规',
    summary: '明确居民装饰装修垃圾实行分类袋装、定点投放、规范收运和资源化利用管理要求。',
    content: [
      '第一条 为加强本市建筑垃圾处置管理，推进建筑垃圾源头减量与资源化综合利用，改善城乡人居环境，根据《中华人民共和国固体废物污染环境防治法》及《北京市生活垃圾管理条例》，制定本规定。',
      '第二条 居民装饰装修房屋产生的装修垃圾，应当与生活垃圾分别收集，采用标准编织袋袋装化投放，并堆放至物业管理单位指定的装修垃圾暂存点。',
      '第三条 鼓励居民通过「京彩回收」等官方认可平台预约具备合法资质的收运处服务单位进行上门清运，严禁将装修垃圾混入生活垃圾桶或随意倾倒。',
      '第四条 收运单位应当公示收费标准，清运完成后向居民提供规范的电子处置联单，确保建筑垃圾进入正规资源化处置场。',
    ],
  },
  {
    id: 'art-2',
    tab: 'policy',
    title: '北京市城市管理委员会等部门关于进一步加强建筑垃圾分类处置和资源化综合利用工作的意见',
    source: '北京市城市管理委员会官网',
    date: '2026-05-20',
    tag: '政策解读',
    summary: '全面推广“袋装清运+扫码溯源+再生建材利用”模式，打通社区最后一公里回收闭环。',
    content: [
      '一、总体目标：构建覆盖全市居住小区的装修垃圾和大件垃圾便民预约清运网络，资源化综合利用率提升至90%以上。',
      '二、推行“互联网+清运”透明计价：各区公示经审核的收运处服务单位目录、信用等级及按袋/按方参考价格，保障居民知情权与选择权。',
      '三、深化可回收物“高低值统收”：推广社区24小时智能回收机与固定交投点，鼓励废玻璃、旧纺织物、泡沫塑料等低值可回收物应收尽收。',
    ],
  },
  {
    id: 'art-3',
    tab: 'guide',
    title: '装修垃圾分类装袋标准指南（90×120cm）',
    source: '京彩环保课堂',
    date: '2026-08-10',
    tag: '投放指南',
    summary: '砖石渣土、木板金属与有害涂料分开装袋，不仅更环保，还能享受清运折扣。',
    content: [
      '1. 砖渣混凝土类：使用加厚90×120cm编织袋装至七分满（约30-40斤），扎紧袋口便于人工搬运。',
      '2. 木板木材与门窗：拔除突出铁钉并捆扎整齐，单捆长度建议控制在1.5米以内。',
      '3. 废金属与纸箱：属于高值可回收物，建议直接通过首页「可回收物交投」变现，无需支付清运费！',
      '4. 油漆桶与胶水罐：属于有害垃圾，切勿混入砖渣袋，请投递至社区红色有害垃圾桶。',
    ],
  },
  {
    id: 'art-4',
    tab: 'guide',
    title: '大件家具与废旧家电拆解清运小贴士',
    source: '京彩环保课堂',
    date: '2026-09-02',
    tag: '投放指南',
    summary: '提前清空柜体、拍照上传尺寸、确认电梯情况，让上门清运省心省钱。',
    content: [
      '1. 大件家具预约前，请拍摄清晰全景照片（最多4张），方便回收师傅评估所需车辆与拆解工具。',
      '2. 废旧家电切勿私自拆解制冷剂管路或主板，正规回收企业提供免费安全拆机与现结补贴。',
      '3. 若旧家具九成新仍可使用，可在备注中说明，优先对接社区公益二手循环流转。',
    ],
  },
  {
    id: 'art-5',
    tab: 'activity',
    title: '「绿动京城」秋季环保积分双倍兑好礼活动',
    source: '京彩回收官方活动',
    date: '2026-11-01',
    tag: '进行中',
    summary: '11月期间通过智能回收机或上门预约交投可回收物，积分翻倍，可兑地铁券与生活用品！',
    content: [
      '活动时间：2026年11月1日 - 2026年11月30日。',
      '活动规则：活动期间每次完成可回收物交投或废旧家电回收，均可获得双倍京彩环保积分！',
      '兑换好礼：前往「我的 -> 环保积分兑换」即可使用积分兑换可降解垃圾袋、北京一卡通环保金、社区咖啡立减券等实用好礼。',
    ],
  },
];

export const WASTE_CLASSIFICATION_DB: WasteSearchItem[] = [
  { name: '快递纸箱 / 报纸 / 书本', category: '可回收物', tip: '压扁捆扎后可投智能回收机或预约上门，约1.2元/kg', actionRoute: 'recyclables_hub' },
  { name: '矿泉水瓶 / 饮料瓶', category: '可回收物', tip: '倒空液体、踩扁拧紧瓶盖后投递，约1.8元/kg', actionRoute: 'recyclables_hub' },
  { name: '易拉罐 / 废铁锅', category: '可回收物', tip: '金属类回收价值高，可直接称重返现', actionRoute: 'recyclables_hub' },
  { name: '旧衣服 / 毛绒玩具 / 床单', category: '可回收物', tip: '保持干燥洁净装袋投递至智能回收机或预约交投', actionRoute: 'recyclables_hub' },
  { name: '旧沙发 / 弹簧床垫 / 大衣柜', category: '大件垃圾', tip: '属于大件垃圾，请通过「大件垃圾预约」正规清运', actionRoute: 'bulky_booking' },
  { name: '砖块 / 瓷砖 / 水泥渣土 / 马桶', category: '装修垃圾', tip: '使用编织袋装袋后通过「装修垃圾预约」交由正规处置场', actionRoute: 'renovation_hub' },
  { name: '废旧冰箱 / 洗衣机 / 空调 / 电视', category: '废旧家电', tip: '含贵金属及制冷剂，请使用「家电回收预约」免费拆机并领返现', actionRoute: 'appliance_booking' },
  { name: '废充电电池 / 过期药品 / 荧光灯管 / 油漆桶', category: '有害垃圾', tip: '请轻放至社区红色「有害垃圾」收集容器，切勿混投' },
  { name: '剩饭剩菜 / 果皮菜叶 / 茶叶渣', category: '厨余垃圾', tip: '沥干水分后破袋投放至绿色「厨余垃圾」桶' },
  { name: '污染外卖盒 / 卫生纸 / 烟头 / 陶瓷碎片', category: '其他垃圾', tip: '难以回收且无害，请投放至灰色「其他垃圾」桶' },
  { name: '玻璃酒瓶 / 酱油瓶', category: '可回收物', tip: '洗净晾干后投放至固定交投点或智能回收机玻璃格口', actionRoute: 'recyclables_hub' },
  { name: '旧手机 / 充电宝 / 数据线', category: '可回收物', tip: '建议清除个人隐私数据后通过电子废品或家电回收交投', actionRoute: 'appliance_booking' },
];

export const INITIAL_ORDERS: RecycleOrder[] = [
  {
    id: 'ord-1001',
    orderNo: 'JC202611220841',
    category: 'recyclable',
    categoryLabel: '可回收物交投',
    status: 'completed',
    createdAt: '2026-11-22 10:15',
    appointmentTime: '2026-11-22 14:00-16:00',
    addressText: '北京市朝阳区酒仙桥街道 丽岛花园 3号楼2单元802室',
    contactName: '张明',
    contactPhone: '13036160091',
    providerName: '京彩绿能社区回收服务队',
    itemsSummary: '黄板纸/纸箱 8.5kg、塑料瓶 2.2kg',
    estimatedAmount: 14.16,
    isFee: false,
    estimatedPoints: 85,
    estimatedWeightKg: 10.7,
    collector: {
      name: '王师傅',
      phone: '13800138901',
      plateNo: '京A·绿8821',
    },
    timeline: [
      { time: '11-22 10:15', title: '预约提交成功', desc: '系统已受理您的可回收物上门预约', done: true },
      { time: '11-22 10:28', title: '回收员已接单', desc: '王师傅（京彩绿能）已接单，准备上门', done: true },
      { time: '11-22 14:20', title: '现场称重完成', desc: '实测总重 10.7kg，环保碳减排 15.6kg', done: true },
      { time: '11-22 14:22', title: '结算完成', desc: '收益 ¥14.16 已发放，+85环保积分', done: true },
    ],
  },
  {
    id: 'ord-1002',
    orderNo: 'JC202611231620',
    category: 'appliance',
    categoryLabel: '家电回收预约',
    status: 'assigned',
    createdAt: '2026-11-23 16:20',
    appointmentTime: '2026-11-24 10:00-12:00',
    addressText: '北京市朝阳区酒仙桥街道 丽岛花园 3号楼2单元802室',
    contactName: '张明',
    contactPhone: '13036160091',
    providerName: '京东回收',
    itemsSummary: '滚筒洗衣机（完好可用）×1',
    estimatedAmount: 135,
    isFee: false,
    estimatedPoints: 180,
    estimatedWeightKg: 40,
    remarks: '有电梯，提前半小时电话联系即可',
    collector: {
      name: '刘工（家电拆机师）',
      phone: '13911226688',
      plateNo: '京Q·9H201',
    },
    timeline: [
      { time: '11-23 16:20', title: '预约下单成功', desc: '已选择京东回收上门服务', done: true },
      { time: '11-23 16:35', title: '已指派工程师', desc: '刘工将于明日 10:00-12:00 免费上门拆运', done: true },
      { time: '待进行', title: '上门验机与打款', desc: '当面质检并即时结算回收款与积分', done: false },
    ],
  },
  {
    id: 'ord-1003',
    orderNo: 'JC202611231805',
    category: 'bulky',
    categoryLabel: '大件垃圾预约',
    status: 'pending',
    createdAt: '2026-11-23 18:05',
    appointmentTime: '2026-11-25 14:00-16:00',
    addressText: '北京市朝阳区酒仙桥街道 丽岛花园 3号楼2单元802室',
    contactName: '张明',
    contactPhone: '13036160091',
    providerName: '北京环卫集团大件清运专队',
    itemsSummary: '双人弹簧床垫 ×1、餐椅 ×2',
    estimatedAmount: 90,
    isFee: true,
    estimatedPoints: 60,
    estimatedWeightKg: 35,
    hasElevator: true,
    remarks: '小区北门可进货车，有货梯',
    timeline: [
      { time: '11-23 18:05', title: '预约提交成功', desc: '等待北京环卫大件清运专队确认派车', done: true },
      { time: '待确认', title: '调度派车中', desc: '工作人员将在2小时内致电确认上门时间', done: false },
      { time: '待进行', title: '上门清运完成', desc: '完成清运并送往大件资源化拆解中心', done: false },
    ],
  },
];

export const POINTS_REWARDS = [
  { id: 'rw-1', name: '可降解分类垃圾袋（3卷装）', points: 120, stock: 58, icon: '🛍️', desc: '加厚环保玉米淀粉材质，蓝/绿/灰三色' },
  { id: 'rw-2', name: '北京公交地铁绿色出行金 ¥5', points: 250, stock: 120, icon: '🚇', desc: '核销后直接抵扣北京一卡通乘车费' },
  { id: 'rw-3', name: '社区便民咖啡 10元代金券', points: 300, stock: 24, icon: '☕', desc: '酒仙桥/望京合作低碳咖啡馆通用' },
  { id: 'rw-4', name: '大件清运 20元抵扣券', points: 400, stock: 40, icon: '🎫', desc: '预约大件或装修垃圾清运立减20元' },
];
