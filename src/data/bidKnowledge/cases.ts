/**
 * 历史投标案例分析
 * 每次完成新项目投标后，将关键信息和材料映射关系补充到此文件
 */

export interface BidCase {
  projectName: string;
  date: string;
  budget: string;
  elevatorCount: string;
  bidder: string;
  keyContent: string[];
  scoreMapping: {
    scoreItem: string;
    source: string;
    reuseLevel: "✅ 直接复用" | "🟡 需改写" | "🔴 需从零写";
    note: string;
  }[];
}

export const historicalCases: BidCase[] = [
  {
    projectName: "绍兴市人民医院电梯维修保养项目",
    date: "2026-06",
    budget: "1,558,200.00 元",
    elevatorCount: "47台（直梯40+扶梯4+杂物梯3）",
    bidder: "奥的斯机电电梯有限公司",
    keyContent: [
      "项目编号: 330600263010070000036-SXJHCG-2026-N0053",
      "采购方式: 分散采购-公开招标（服务）",
      "投标截止: 2026年6月12日 09:30",
      "特定资格: 特种设备安装改造维修许可证（电梯）",
      "评标方式: 综合评分法（商务技术70分 + 价格30分）",
    ],
    scoreMapping: [
      {
        scoreItem: "ISO三体系证书",
        source: "上虞商技（管理体系认证板块）",
        reuseLevel: "✅ 直接复用",
        note: "改项目名称即可",
      },
      {
        scoreItem: "管理制度",
        source: "上虞商技有框架",
        reuseLevel: "🔴 需从零写",
        note: "每个项目管理架构不同",
      },
      {
        scoreItem: "人员持证≥10人",
        source: "上虞商技人员清单模板",
        reuseLevel: "🟡 需改写",
        note: "替换人员信息和证书编号",
      },
      {
        scoreItem: "技术负责人技师二级",
        source: "上虞商技示例",
        reuseLevel: "🟡 需改写",
        note: "替换人选和证书",
      },
      {
        scoreItem: "同类业绩",
        source: "上虞商技+桐乡业绩表",
        reuseLevel: "✅ 直接复用",
        note: "模板直接可用，更新项目列表",
      },
      {
        scoreItem: "数字化管理",
        source: "上虞商技（OES/DOCTOR OTIS/SERVICE TOOL/OTIS CONNECT）",
        reuseLevel: "✅ 直接复用",
        note: "四大系统介绍内容全套可用",
      },
      {
        scoreItem: "应急处理方案",
        source: "上虞商技",
        reuseLevel: "✅ 直接复用",
        note: "内容完整，改项目名称",
      },
      {
        scoreItem: "培训方案",
        source: "上虞商技有零散内容",
        reuseLevel: "🔴 需从零写",
        note: "需整合扩充为完整方案",
      },
      {
        scoreItem: "灭菌方案",
        source: "上虞商技有防疫段落",
        reuseLevel: "🟡 需改写",
        note: "可参考改写，补充医院场景内容",
      },
      {
        scoreItem: "售后服务",
        source: "上虞商技+商务标",
        reuseLevel: "✅ 直接复用",
        note: "全套可直接用",
      },
      {
        scoreItem: "备品配件承诺函",
        source: "上虞商技有模板",
        reuseLevel: "🟡 需改写",
        note: "改格式和项目信息",
      },
    ],
  },
];

// 历史标书文件索引
// 原始 .doc/.docx/.pdf 文件存放在项目根目录的 bid-documents/ 中（已 gitignore，不会上传公网）
// 文件名: 上虞人民医院商务技术文件.doc / 商务标（中心医院）.docx / 绍兴人民医院投标资料.docx / 桐乡一院标书.doc / 价格标（中心医院）.docx
export const historicalFileIndex = {
  localPath: "bid-documents/",  // 原始文件存放目录
  files: {
    "上虞人民医院商务技术文件": {
      chars: 38210,
      keySections: [
        "评分对应表", "人员清单", "管理体系认证", "类似业绩",
        "维保服务方案", "应急方案", "数字化方案", "配件承诺",
      ],
      note: "最丰富的来源，涵盖大部分评分项",
    },
    "商务标（中心医院）": {
      chars: 11671,
      keySections: [
        "奥的斯机电服务介绍", "全国网络", "技术团队",
        "培训体系", "安全标准", "全球安全规范",
      ],
      note: "公司实力介绍可全套复用",
    },
    "绍兴人民医院投标资料": {
      chars: 8048,
      keySections: [
        "投标函", "法定代表人授权委托书", "开标一览表模板",
      ],
      note: "公司抬头完全一致，资格文件部分可直接用",
    },
    "桐乡一院标书": {
      chars: 16637,
      keySections: ["维保方案", "报价表", "类似业绩表", "配件报价表"],
      note: "嘉兴分公司抬头",
    },
    "价格标（中心医院）": {
      chars: 844,
      keySections: ["投标函格式"],
      note: "格式参考",
    },
  },
};
