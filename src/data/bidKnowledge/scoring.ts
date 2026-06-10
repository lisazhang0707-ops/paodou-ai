/**
 * 电梯维保标书评分细则
 * 基于综合评分法（商务技术70分 + 价格30分）
 * 新增评分规则或调整分值时直接修改此文件
 */

export interface ScoringItem {
  name: string;
  maxScore: number;
  type: "客观" | "主观";
  condition: string;      // 得分条件
  checkPoints: string[];  // 评分检查点
}

// 典型评分项（政府采购电梯维保标准模板）
export const standardScoring: ScoringItem[] = [
  {
    name: "ISO 9001/14001/45001 三体系证书",
    maxScore: 3,
    type: "客观",
    condition: "三张证书各1分，须提供国家认证认可平台截图",
    checkPoints: [
      "ISO 9001 证书是否在有效期内",
      "ISO 14001 证书是否在有效期内",
      "ISO 45001 证书是否在有效期内",
      "是否附带国家认证认可平台查询截图",
    ],
  },
  {
    name: "管理制度",
    maxScore: 5,
    type: "主观",
    condition: "综合评审（5,4,3,2,1,0.5,0分）",
    checkPoints: [
      "是否有总则/组织架构",
      "是否有日常保养制度",
      "是否有维修应急制度",
      "是否有质量管理制度",
      "是否有安全管理制度",
      "是否有沟通汇报机制",
      "内容是否有项目针对性（非通用模板）",
    ],
  },
  {
    name: "团队人员配置（持证人数）",
    maxScore: 5,
    type: "客观",
    condition: "≥10人=5分, ≥8人=3分, ≥5人=1分。需同时提供操作证复印件+社保证明",
    checkPoints: [
      "持证人员是否≥10人",
      "是否提供操作证复印件",
      "是否提供对应社保证明",
      "人员名单格式是否规范",
    ],
  },
  {
    name: "技术负责人资质",
    maxScore: 2,
    type: "客观",
    condition: "技师二级及以上职称证书+社保证明",
    checkPoints: [
      "是否提供技师二级或以上证书",
      "是否提供对应社保证明",
    ],
  },
  {
    name: "同类业绩",
    maxScore: 3,
    type: "客观",
    condition: "近3年（2023年1月1日后）同类项目，每个1分，最多3个",
    checkPoints: [
      "是否在2023年1月1日之后",
      "是否为同类项目（医院优先）",
      "是否提供合同关键页复印件",
      "项目金额是否达标",
    ],
  },
  {
    name: "数字化管理功能",
    maxScore: 5,
    type: "主观",
    condition: "综合评审",
    checkPoints: [
      "是否介绍OES在线服务系统",
      "是否介绍DOCTOR OTIS远程诊断",
      "是否介绍SERVICE TOOL维保工具",
      "是否介绍OTIS CONNECT物联网平台",
      "是否附系统界面截图",
      "是否有数字化服务报告示例",
    ],
  },
  {
    name: "应急处理方案",
    maxScore: 5,
    type: "主观",
    condition: "综合评审",
    checkPoints: [
      "是否有应急组织体系",
      "是否承诺响应时效（困人10分钟到场）",
      "是否有困人救援标准流程",
      "是否有故障分级处理（一般/较重/紧急）",
      "是否有重大节假日保障预案",
      "是否有年度演练计划",
    ],
  },
  {
    name: "培训方案",
    maxScore: 5,
    type: "主观",
    condition: "综合评审",
    checkPoints: [
      "是否有内部培训体系（入职/在岗/专项）",
      "是否有院方人员安全培训",
      "是否有五级巡检制度（日/周/月/季/年）",
      "是否有一梯一档管理方案",
      "培训内容是否具体可操作",
    ],
  },
  {
    name: "电梯灭菌方案",
    maxScore: 5,
    type: "主观",
    condition: "综合评审",
    checkPoints: [
      "是否有常规消毒制度（每日2次）",
      "是否有疫情期间专项消杀方案",
      "是否有杀菌设备升级方案",
      "是否有维保人员卫生管理制度",
      "是否有防疫物资储备清单",
    ],
  },
  {
    name: "售后服务",
    maxScore: 5,
    type: "主观",
    condition: "综合评审",
    checkPoints: [
      "是否有响应时间承诺",
      "是否有备件供应保障方案",
      "是否有技术支持体系",
      "是否有客户回访制度",
      "是否有全国服务网络支撑",
    ],
  },
  {
    name: "备品配件原厂承诺",
    maxScore: 4,
    type: "客观",
    condition: "提供承诺函（格式自拟），承诺原厂原配",
    checkPoints: [
      "是否承诺原厂原配",
      "是否有配件质量保证条款",
      "是否有供应时效承诺",
      "是否有价格上限承诺",
    ],
  },
];

// 主观分三档评审标准
export const subjectiveTiers = {
  excellent: {
    label: "5分档（优秀）",
    criteria: "结构完整+有具体细节（名称、流程、数据）+有项目针对性+有亮点（创新做法、案例佐证）",
  },
  passable: {
    label: "3分档（及格）",
    criteria: "有框架但内容泛泛、缺乏项目针对性、像通用模板套用",
  },
  poor: {
    label: "1分档（差）",
    criteria: "只有标题或寥寥几句，信息密度低",
  },
  none: {
    label: "0.5/0分档",
    criteria: "基本没写或完全跑题",
  },
};

// 价格分策略（30分）
export const pricingStrategy = {
  safeRange: "限价下浮3-8%",
  riskWarning: "过高丢分、过低可能被质疑低于成本",
  methods: ["低价优先法（最低价得满分）", "均价法（接近均价得高分）"],
};
