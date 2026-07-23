// AI 产业链上市公司数据
// 来源：BOTZ ETF · AIQ ETF · 中证人工智能指数 930713 · 券商研报
// 更新时间：2026年6月

export type Market = "us" | "cn" | "hk" | "eu" | "jp" | "kr" | "tw" | "ipo";
export type ChainLevel = "upstream" | "midstream" | "downstream";

export interface Company {
  name: string;
  ticker: string;
  market: Market;
  url: string | null;
  chain: ChainLevel;
  subGroup: string;
}

export interface ChainMetaEntry {
  title: string;
  desc: string;
  num: string;
  color: string;
}

export type ChainSubGroups = Record<ChainLevel, string[]>;
export type MarketLabels = Record<Market, string>;

// ===== 公司数据 =====

export const LANDSCAPE_COMPANIES: Company[] = [
  {
    "name": "Synopsys",
    "ticker": "SNPS",
    "market": "us",
    "url": "https://www.synopsys.com",
    "chain": "upstream",
    "subGroup": "EDA / IP 设计"
  },
  {
    "name": "Cadence Design Systems",
    "ticker": "CDNS",
    "market": "us",
    "url": "https://www.cadence.com",
    "chain": "upstream",
    "subGroup": "EDA / IP 设计"
  },
  {
    "name": "Arm Holdings",
    "ticker": "ARM",
    "market": "us",
    "url": "https://www.arm.com",
    "chain": "upstream",
    "subGroup": "EDA / IP 设计"
  },
  {
    "name": "华大九天",
    "ticker": "301269 · 深交所",
    "market": "cn",
    "url": "https://www.empyrean-tech.com",
    "chain": "upstream",
    "subGroup": "EDA / IP 设计"
  },
  {
    "name": "ASML Holding",
    "ticker": "ASML",
    "market": "eu",
    "url": "https://www.asml.com",
    "chain": "upstream",
    "subGroup": "半导体设备"
  },
  {
    "name": "Applied Materials",
    "ticker": "AMAT",
    "market": "us",
    "url": "https://www.appliedmaterials.com",
    "chain": "upstream",
    "subGroup": "半导体设备"
  },
  {
    "name": "Lam Research",
    "ticker": "LRCX",
    "market": "us",
    "url": "https://www.lamresearch.com",
    "chain": "upstream",
    "subGroup": "半导体设备"
  },
  {
    "name": "KLA Corporation",
    "ticker": "KLAC",
    "market": "us",
    "url": "https://www.kla.com",
    "chain": "upstream",
    "subGroup": "半导体设备"
  },
  {
    "name": "北方华创",
    "ticker": "002371 · 深交所",
    "market": "cn",
    "url": "https://www.naura.com",
    "chain": "upstream",
    "subGroup": "半导体设备"
  },
  {
    "name": "中微公司",
    "ticker": "688012 · 上交所",
    "market": "cn",
    "url": "https://www.amec-inc.com",
    "chain": "upstream",
    "subGroup": "半导体设备"
  },
  {
    "name": "TSMC 台积电",
    "ticker": "TSM",
    "market": "us",
    "url": "https://www.tsmc.com",
    "chain": "upstream",
    "subGroup": "晶圆代工"
  },
  {
    "name": "Samsung Electronics",
    "ticker": "005930 · KRX",
    "market": "kr",
    "url": "https://www.samsung.com",
    "chain": "upstream",
    "subGroup": "晶圆代工"
  },
  {
    "name": "GlobalFoundries",
    "ticker": "GFS",
    "market": "us",
    "url": "https://gf.com",
    "chain": "upstream",
    "subGroup": "晶圆代工"
  },
  {
    "name": "中芯国际",
    "ticker": "688981 · 上交所 / 00981 · 港交所",
    "market": "cn",
    "url": "https://www.smics.com",
    "chain": "upstream",
    "subGroup": "晶圆代工"
  },
  {
    "name": "华虹半导体",
    "ticker": "01347 · 港交所",
    "market": "hk",
    "url": "https://www.huahonggrace.com",
    "chain": "upstream",
    "subGroup": "晶圆代工"
  },
  {
    "name": "SK Hynix",
    "ticker": "000660 · KRX",
    "market": "kr",
    "url": "https://www.skhynix.com",
    "chain": "upstream",
    "subGroup": "存储芯片 / HBM（AI 高带宽内存）"
  },
  {
    "name": "Micron Technology",
    "ticker": "MU",
    "market": "us",
    "url": "https://www.micron.com",
    "chain": "upstream",
    "subGroup": "存储芯片 / HBM（AI 高带宽内存）"
  },
  {
    "name": "Seagate Technology",
    "ticker": "STX",
    "market": "us",
    "url": "https://www.seagate.com",
    "chain": "upstream",
    "subGroup": "存储芯片 / HBM（AI 高带宽内存）"
  },
  {
    "name": "兆易创新",
    "ticker": "603986 · 上交所",
    "market": "cn",
    "url": "https://www.gigadevice.com",
    "chain": "upstream",
    "subGroup": "存储芯片 / HBM（AI 高带宽内存）"
  },
  {
    "name": "江波龙",
    "ticker": "301308 · 深交所",
    "market": "cn",
    "url": "https://www.longsys.com",
    "chain": "upstream",
    "subGroup": "存储芯片 / HBM（AI 高带宽内存）"
  },
  {
    "name": "北京君正",
    "ticker": "300223 · 深交所",
    "market": "cn",
    "url": "https://www.ingenic.com.cn",
    "chain": "upstream",
    "subGroup": "存储芯片 / HBM（AI 高带宽内存）"
  },
  {
    "name": "Arista Networks",
    "ticker": "ANET",
    "market": "us",
    "url": "https://www.arista.com",
    "chain": "upstream",
    "subGroup": "网络互联 / 光通信"
  },
  {
    "name": "Cisco Systems",
    "ticker": "CSCO",
    "market": "us",
    "url": "https://www.cisco.com",
    "chain": "upstream",
    "subGroup": "网络互联 / 光通信"
  },
  {
    "name": "Marvell Technology",
    "ticker": "MRVL",
    "market": "us",
    "url": "https://www.marvell.com",
    "chain": "upstream",
    "subGroup": "网络互联 / 光通信"
  },
  {
    "name": "中际旭创",
    "ticker": "300308 · 深交所",
    "market": "cn",
    "url": "https://www.zj-innolight.com",
    "chain": "upstream",
    "subGroup": "网络互联 / 光通信"
  },
  {
    "name": "新易盛",
    "ticker": "300502 · 深交所",
    "market": "cn",
    "url": "https://www.eoptolink.com",
    "chain": "upstream",
    "subGroup": "网络互联 / 光通信"
  },
  {
    "name": "天孚通信",
    "ticker": "300394 · 深交所",
    "market": "cn",
    "url": "https://www.tfcsz.com",
    "chain": "upstream",
    "subGroup": "网络互联 / 光通信"
  },
  {
    "name": "光迅科技",
    "ticker": "002281 · 深交所",
    "market": "cn",
    "url": "https://www.accelink.com",
    "chain": "upstream",
    "subGroup": "网络互联 / 光通信"
  },
  {
    "name": "Vertiv Holdings",
    "ticker": "VRT",
    "market": "us",
    "url": "https://www.vertiv.com",
    "chain": "upstream",
    "subGroup": "电力 / 散热 / 数据中心基础设施"
  },
  {
    "name": "Eaton Corporation",
    "ticker": "ETN",
    "market": "us",
    "url": "https://www.eaton.com",
    "chain": "upstream",
    "subGroup": "电力 / 散热 / 数据中心基础设施"
  },
  {
    "name": "Siemens AG",
    "ticker": "SIE · ETR",
    "market": "eu",
    "url": "https://www.siemens.com",
    "chain": "upstream",
    "subGroup": "电力 / 散热 / 数据中心基础设施"
  },
  {
    "name": "Schneider Electric",
    "ticker": "SU · EPA",
    "market": "eu",
    "url": "https://www.se.com",
    "chain": "upstream",
    "subGroup": "电力 / 散热 / 数据中心基础设施"
  },
  {
    "name": "英维克",
    "ticker": "002837 · 深交所",
    "market": "cn",
    "url": "http://www.envicool.com",
    "chain": "upstream",
    "subGroup": "电力 / 散热 / 数据中心基础设施"
  },
  {
    "name": "高澜股份",
    "ticker": "300499 · 深交所",
    "market": "cn",
    "url": "http://www.goaland.com.cn",
    "chain": "upstream",
    "subGroup": "电力 / 散热 / 数据中心基础设施"
  },
  {
    "name": "Equinix",
    "ticker": "EQIX",
    "market": "us",
    "url": "https://www.equinix.com",
    "chain": "upstream",
    "subGroup": "数据中心 / IDC"
  },
  {
    "name": "Digital Realty",
    "ticker": "DLR",
    "market": "us",
    "url": "https://www.digitalrealty.com",
    "chain": "upstream",
    "subGroup": "数据中心 / IDC"
  },
  {
    "name": "CoreWeave",
    "ticker": "CRWV",
    "market": "us",
    "url": "https://www.coreweave.com",
    "chain": "upstream",
    "subGroup": "数据中心 / IDC"
  },
  {
    "name": "万国数据",
    "ticker": "09698 · 港交所",
    "market": "hk",
    "url": "https://www.gds-services.com",
    "chain": "upstream",
    "subGroup": "数据中心 / IDC"
  },
  {
    "name": "光环新网",
    "ticker": "300383 · 深交所",
    "market": "cn",
    "url": "https://www.sinnet.com.cn",
    "chain": "upstream",
    "subGroup": "数据中心 / IDC"
  },
  {
    "name": "润泽科技",
    "ticker": "300442 · 深交所",
    "market": "cn",
    "url": "https://www.runzekj.com",
    "chain": "upstream",
    "subGroup": "数据中心 / IDC"
  },
  {
    "name": "宝信软件",
    "ticker": "600845 · 上交所",
    "market": "cn",
    "url": "https://www.baosight.com",
    "chain": "upstream",
    "subGroup": "数据中心 / IDC"
  },
  {
    "name": "NVIDIA 英伟达",
    "ticker": "NVDA",
    "market": "us",
    "url": "https://www.nvidia.com",
    "chain": "midstream",
    "subGroup": "AI 芯片 / GPU / ASIC"
  },
  {
    "name": "AMD 超威半导体",
    "ticker": "AMD",
    "market": "us",
    "url": "https://www.amd.com",
    "chain": "midstream",
    "subGroup": "AI 芯片 / GPU / ASIC"
  },
  {
    "name": "Intel 英特尔",
    "ticker": "INTC",
    "market": "us",
    "url": "https://www.intel.com",
    "chain": "midstream",
    "subGroup": "AI 芯片 / GPU / ASIC"
  },
  {
    "name": "Broadcom 博通",
    "ticker": "AVGO",
    "market": "us",
    "url": "https://www.broadcom.com",
    "chain": "midstream",
    "subGroup": "AI 芯片 / GPU / ASIC"
  },
  {
    "name": "Qualcomm",
    "ticker": "QCOM",
    "market": "us",
    "url": "https://www.qualcomm.com",
    "chain": "midstream",
    "subGroup": "AI 芯片 / GPU / ASIC"
  },
  {
    "name": "NXP Semiconductors",
    "ticker": "NXPI",
    "market": "us",
    "url": "https://www.nxp.com",
    "chain": "midstream",
    "subGroup": "AI 芯片 / GPU / ASIC"
  },
  {
    "name": "Infineon Technologies",
    "ticker": "IFX · ETR",
    "market": "eu",
    "url": "https://www.infineon.com",
    "chain": "midstream",
    "subGroup": "AI 芯片 / GPU / ASIC"
  },
  {
    "name": "寒武纪",
    "ticker": "688256 · 上交所",
    "market": "cn",
    "url": "https://www.cambricon.com",
    "chain": "midstream",
    "subGroup": "AI 芯片 / GPU / ASIC"
  },
  {
    "name": "海光信息",
    "ticker": "688041 · 上交所",
    "market": "cn",
    "url": "https://www.hygon.com",
    "chain": "midstream",
    "subGroup": "AI 芯片 / GPU / ASIC"
  },
  {
    "name": "澜起科技",
    "ticker": "688008 · 上交所",
    "market": "cn",
    "url": "https://www.montage-tech.com",
    "chain": "midstream",
    "subGroup": "AI 芯片 / GPU / ASIC"
  },
  {
    "name": "Horizon Robotics 地平线",
    "ticker": "09660 · 港交所",
    "market": "hk",
    "url": "https://www.horizon.ai",
    "chain": "midstream",
    "subGroup": "AI 芯片 / GPU / ASIC"
  },
  {
    "name": "Dell Technologies",
    "ticker": "DELL",
    "market": "us",
    "url": "https://www.dell.com",
    "chain": "midstream",
    "subGroup": "服务器 / 硬件 / 代工"
  },
  {
    "name": "Hewlett Packard Enterprise",
    "ticker": "HPE",
    "market": "us",
    "url": "https://www.hpe.com",
    "chain": "midstream",
    "subGroup": "服务器 / 硬件 / 代工"
  },
  {
    "name": "Super Micro Computer",
    "ticker": "SMCI",
    "market": "us",
    "url": "https://www.supermicro.com",
    "chain": "midstream",
    "subGroup": "服务器 / 硬件 / 代工"
  },
  {
    "name": "Foxconn 鸿海精密",
    "ticker": "2317 · TWSE",
    "market": "tw",
    "url": "https://www.honhai.com",
    "chain": "midstream",
    "subGroup": "服务器 / 硬件 / 代工"
  },
  {
    "name": "浪潮信息",
    "ticker": "000977 · 深交所",
    "market": "cn",
    "url": "https://www.ieisystem.com",
    "chain": "midstream",
    "subGroup": "服务器 / 硬件 / 代工"
  },
  {
    "name": "中科曙光",
    "ticker": "603019 · 上交所",
    "market": "cn",
    "url": "https://www.sugon.com",
    "chain": "midstream",
    "subGroup": "服务器 / 硬件 / 代工"
  },
  {
    "name": "紫光股份",
    "ticker": "000938 · 深交所",
    "market": "cn",
    "url": "https://www.unigroup.com.cn",
    "chain": "midstream",
    "subGroup": "服务器 / 硬件 / 代工"
  },
  {
    "name": "联想集团",
    "ticker": "00992 · 港交所",
    "market": "hk",
    "url": "https://www.lenovo.com",
    "chain": "midstream",
    "subGroup": "服务器 / 硬件 / 代工"
  },
  {
    "name": "Microsoft Azure",
    "ticker": "MSFT",
    "market": "us",
    "url": "https://www.microsoft.com",
    "chain": "midstream",
    "subGroup": "云计算 / 平台"
  },
  {
    "name": "Amazon AWS",
    "ticker": "AMZN",
    "market": "us",
    "url": "https://www.amazon.com",
    "chain": "midstream",
    "subGroup": "云计算 / 平台"
  },
  {
    "name": "Google Cloud",
    "ticker": "GOOGL",
    "market": "us",
    "url": "https://abc.xyz",
    "chain": "midstream",
    "subGroup": "云计算 / 平台"
  },
  {
    "name": "Oracle Cloud",
    "ticker": "ORCL",
    "market": "us",
    "url": "https://www.oracle.com",
    "chain": "midstream",
    "subGroup": "云计算 / 平台"
  },
  {
    "name": "IBM",
    "ticker": "IBM",
    "market": "us",
    "url": "https://www.ibm.com",
    "chain": "midstream",
    "subGroup": "云计算 / 平台"
  },
  {
    "name": "阿里巴巴",
    "ticker": "09988 · 港交所",
    "market": "hk",
    "url": "https://www.alibabagroup.com",
    "chain": "midstream",
    "subGroup": "云计算 / 平台"
  },
  {
    "name": "腾讯云",
    "ticker": "00700 · 港交所",
    "market": "hk",
    "url": "https://www.tencent.com",
    "chain": "midstream",
    "subGroup": "云计算 / 平台"
  },
  {
    "name": "金山云",
    "ticker": "03896 · 港交所",
    "market": "hk",
    "url": "https://www.ksyun.com",
    "chain": "midstream",
    "subGroup": "云计算 / 平台"
  },
  {
    "name": "Palantir Technologies",
    "ticker": "PLTR",
    "market": "us",
    "url": "https://www.palantir.com",
    "chain": "midstream",
    "subGroup": "大数据 / AI 平台 / 数据分析"
  },
  {
    "name": "Snowflake",
    "ticker": "SNOW",
    "market": "us",
    "url": "https://www.snowflake.com",
    "chain": "midstream",
    "subGroup": "大数据 / AI 平台 / 数据分析"
  },
  {
    "name": "MongoDB",
    "ticker": "MDB",
    "market": "us",
    "url": "https://www.mongodb.com",
    "chain": "midstream",
    "subGroup": "大数据 / AI 平台 / 数据分析"
  },
  {
    "name": "Datadog",
    "ticker": "DDOG",
    "market": "us",
    "url": "https://www.datadoghq.com",
    "chain": "midstream",
    "subGroup": "大数据 / AI 平台 / 数据分析"
  },
  {
    "name": "Elastic",
    "ticker": "ESTC",
    "market": "us",
    "url": "https://www.elastic.co",
    "chain": "midstream",
    "subGroup": "大数据 / AI 平台 / 数据分析"
  },
  {
    "name": "Confluent",
    "ticker": "CFLT",
    "market": "us",
    "url": "https://www.confluent.io",
    "chain": "midstream",
    "subGroup": "大数据 / AI 平台 / 数据分析"
  },
  {
    "name": "Accenture",
    "ticker": "ACN",
    "market": "us",
    "url": "https://www.accenture.com",
    "chain": "midstream",
    "subGroup": "大数据 / AI 平台 / 数据分析"
  },
  {
    "name": "昆仑万维",
    "ticker": "300418 · 深交所",
    "market": "cn",
    "url": "https://www.kunlun.com",
    "chain": "midstream",
    "subGroup": "大数据 / AI 平台 / 数据分析"
  },
  {
    "name": "Fanuc 发那科",
    "ticker": "6954 · TYO",
    "market": "jp",
    "url": "https://www.fanuc.com",
    "chain": "midstream",
    "subGroup": "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  },
  {
    "name": "Keyence 基恩士",
    "ticker": "6861 · TYO",
    "market": "jp",
    "url": "https://www.keyence.com",
    "chain": "midstream",
    "subGroup": "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  },
  {
    "name": "ABB Ltd",
    "ticker": "ABBN · SWX",
    "market": "eu",
    "url": "https://global.abb",
    "chain": "midstream",
    "subGroup": "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  },
  {
    "name": "SMC Corporation",
    "ticker": "6273 · TYO",
    "market": "jp",
    "url": "https://www.smcworld.com",
    "chain": "midstream",
    "subGroup": "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  },
  {
    "name": "Yaskawa Electric",
    "ticker": "6506 · TYO",
    "market": "jp",
    "url": "https://www.yaskawa.com",
    "chain": "midstream",
    "subGroup": "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  },
  {
    "name": "Daifuku 大福",
    "ticker": "6383 · TYO",
    "market": "jp",
    "url": "https://www.daifuku.com",
    "chain": "midstream",
    "subGroup": "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  },
  {
    "name": "Intuitive Surgical",
    "ticker": "ISRG",
    "market": "us",
    "url": "https://www.intuitive.com",
    "chain": "midstream",
    "subGroup": "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  },
  {
    "name": "Cognex",
    "ticker": "CGNX",
    "market": "us",
    "url": "https://www.cognex.com",
    "chain": "midstream",
    "subGroup": "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  },
  {
    "name": "Symbotic",
    "ticker": "SYM",
    "market": "us",
    "url": "https://www.symbotic.com",
    "chain": "midstream",
    "subGroup": "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  },
  {
    "name": "Rockwell Automation",
    "ticker": "ROK",
    "market": "us",
    "url": "https://www.rockwellautomation.com",
    "chain": "midstream",
    "subGroup": "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  },
  {
    "name": "汇川技术",
    "ticker": "300124 · 深交所",
    "market": "cn",
    "url": "https://www.inovance.com",
    "chain": "midstream",
    "subGroup": "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  },
  {
    "name": "绿的谐波",
    "ticker": "688017 · 上交所",
    "market": "cn",
    "url": "http://www.leaderdrive.com",
    "chain": "midstream",
    "subGroup": "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  },
  {
    "name": "拓斯达",
    "ticker": "300607 · 深交所",
    "market": "cn",
    "url": "https://www.topstarltd.com",
    "chain": "midstream",
    "subGroup": "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  },
  {
    "name": "Ubt ech 优必选",
    "ticker": "09880 · 港交所",
    "market": "hk",
    "url": "https://www.ubtrobot.com",
    "chain": "midstream",
    "subGroup": "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  },
  {
    "name": "ServiceNow",
    "ticker": "NOW",
    "market": "us",
    "url": "https://www.servicenow.com",
    "chain": "downstream",
    "subGroup": "AI 软件 / SaaS"
  },
  {
    "name": "Salesforce",
    "ticker": "CRM",
    "market": "us",
    "url": "https://www.salesforce.com",
    "chain": "downstream",
    "subGroup": "AI 软件 / SaaS"
  },
  {
    "name": "Adobe",
    "ticker": "ADBE",
    "market": "us",
    "url": "https://www.adobe.com",
    "chain": "downstream",
    "subGroup": "AI 软件 / SaaS"
  },
  {
    "name": "SAP SE",
    "ticker": "SAP",
    "market": "eu",
    "url": "https://www.sap.com",
    "chain": "downstream",
    "subGroup": "AI 软件 / SaaS"
  },
  {
    "name": "Shopify",
    "ticker": "SHOP",
    "market": "us",
    "url": "https://www.shopify.com",
    "chain": "downstream",
    "subGroup": "AI 软件 / SaaS"
  },
  {
    "name": "UiPath (RPA)",
    "ticker": "PATH",
    "market": "us",
    "url": "https://www.uipath.com",
    "chain": "downstream",
    "subGroup": "AI 软件 / SaaS"
  },
  {
    "name": "Twilio",
    "ticker": "TWLO",
    "market": "us",
    "url": "https://www.twilio.com",
    "chain": "downstream",
    "subGroup": "AI 软件 / SaaS"
  },
  {
    "name": "金山办公",
    "ticker": "688111 · 上交所",
    "market": "cn",
    "url": "https://www.wps.cn",
    "chain": "downstream",
    "subGroup": "AI 软件 / SaaS"
  },
  {
    "name": "第四范式",
    "ticker": "06682 · 港交所",
    "market": "hk",
    "url": "https://www.4paradigm.com",
    "chain": "downstream",
    "subGroup": "AI 软件 / SaaS"
  },
  {
    "name": "CrowdStrike",
    "ticker": "CRWD",
    "market": "us",
    "url": "https://www.crowdstrike.com",
    "chain": "downstream",
    "subGroup": "AI 网络安全"
  },
  {
    "name": "Palo Alto Networks",
    "ticker": "PANW",
    "market": "us",
    "url": "https://www.paloaltonetworks.com",
    "chain": "downstream",
    "subGroup": "AI 网络安全"
  },
  {
    "name": "SentinelOne",
    "ticker": "S",
    "market": "us",
    "url": "https://www.sentinelone.com",
    "chain": "downstream",
    "subGroup": "AI 网络安全"
  },
  {
    "name": "Zscaler",
    "ticker": "ZS",
    "market": "us",
    "url": "https://www.zscaler.com",
    "chain": "downstream",
    "subGroup": "AI 网络安全"
  },
  {
    "name": "Cloudflare",
    "ticker": "NET",
    "market": "us",
    "url": "https://www.cloudflare.com",
    "chain": "downstream",
    "subGroup": "AI 网络安全"
  },
  {
    "name": "CyberArk",
    "ticker": "CYBR",
    "market": "us",
    "url": "https://www.cyberark.com",
    "chain": "downstream",
    "subGroup": "AI 网络安全"
  },
  {
    "name": "Okta",
    "ticker": "OKTA",
    "market": "us",
    "url": "https://www.okta.com",
    "chain": "downstream",
    "subGroup": "AI 网络安全"
  },
  {
    "name": "Fortinet",
    "ticker": "FTNT",
    "market": "us",
    "url": "https://www.fortinet.com",
    "chain": "downstream",
    "subGroup": "AI 网络安全"
  },
  {
    "name": "奇安信",
    "ticker": "688561 · 上交所",
    "market": "cn",
    "url": "https://www.qianxin.com",
    "chain": "downstream",
    "subGroup": "AI 网络安全"
  },
  {
    "name": "深信服",
    "ticker": "300454 · 深交所",
    "market": "cn",
    "url": "https://www.sangfor.com.cn",
    "chain": "downstream",
    "subGroup": "AI 网络安全"
  },
  {
    "name": "Tempus AI",
    "ticker": "TEM",
    "market": "us",
    "url": "https://www.tempus.com",
    "chain": "downstream",
    "subGroup": "AI 医疗"
  },
  {
    "name": "Schrodinger",
    "ticker": "SDGR",
    "market": "us",
    "url": "https://www.schrodinger.com",
    "chain": "downstream",
    "subGroup": "AI 医疗"
  },
  {
    "name": "Recursion Pharma",
    "ticker": "RXRX",
    "market": "us",
    "url": "https://www.recursion.com",
    "chain": "downstream",
    "subGroup": "AI 医疗"
  },
  {
    "name": "AbCellera Biologics",
    "ticker": "ABCL",
    "market": "us",
    "url": "https://www.abcellera.com",
    "chain": "downstream",
    "subGroup": "AI 医疗"
  },
  {
    "name": "Doximity",
    "ticker": "DOCS",
    "market": "us",
    "url": "https://www.doximity.com",
    "chain": "downstream",
    "subGroup": "AI 医疗"
  },
  {
    "name": "Certara",
    "ticker": "CERT",
    "market": "us",
    "url": "https://www.certara.com",
    "chain": "downstream",
    "subGroup": "AI 医疗"
  },
  {
    "name": "GE HealthCare",
    "ticker": "GEHC",
    "market": "us",
    "url": "https://www.gehealthcare.com",
    "chain": "downstream",
    "subGroup": "AI 医疗"
  },
  {
    "name": "讯飞医疗",
    "ticker": "港股 · HKEX",
    "market": "hk",
    "url": "https://www.iflyhealth.com",
    "chain": "downstream",
    "subGroup": "AI 医疗"
  },
  {
    "name": "晶泰控股 XtalPi",
    "ticker": "港股 · HKEX",
    "market": "hk",
    "url": "https://www.xtalpi.com",
    "chain": "downstream",
    "subGroup": "AI 医疗"
  },
  {
    "name": "医渡科技",
    "ticker": "02158 · 港交所",
    "market": "hk",
    "url": "https://www.yiducloud.com",
    "chain": "downstream",
    "subGroup": "AI 医疗"
  },
  {
    "name": "Mobileye Global",
    "ticker": "MBLY",
    "market": "us",
    "url": "https://www.mobileye.com",
    "chain": "downstream",
    "subGroup": "自动驾驶 / ADAS / 激光雷达"
  },
  {
    "name": "Aurora Innovation",
    "ticker": "AUR",
    "market": "us",
    "url": "https://aurora.tech",
    "chain": "downstream",
    "subGroup": "自动驾驶 / ADAS / 激光雷达"
  },
  {
    "name": "Hesai Group 禾赛",
    "ticker": "HSAI",
    "market": "us",
    "url": "https://www.hesaitech.com",
    "chain": "downstream",
    "subGroup": "自动驾驶 / ADAS / 激光雷达"
  },
  {
    "name": "RoboSense 速腾聚创",
    "ticker": "02498 · 港交所",
    "market": "hk",
    "url": "https://www.robosense.cn",
    "chain": "downstream",
    "subGroup": "自动驾驶 / ADAS / 激光雷达"
  },
  {
    "name": "Tesla (FSD)",
    "ticker": "TSLA",
    "market": "us",
    "url": "https://www.tesla.com",
    "chain": "downstream",
    "subGroup": "自动驾驶 / ADAS / 激光雷达"
  },
  {
    "name": "Pony AI 小马智行",
    "ticker": "PONY",
    "market": "us",
    "url": "https://www.pony.ai",
    "chain": "downstream",
    "subGroup": "自动驾驶 / ADAS / 激光雷达"
  },
  {
    "name": "百度 Apollo",
    "ticker": "BIDU / 09888",
    "market": "us",
    "url": "https://www.baidu.com",
    "chain": "downstream",
    "subGroup": "自动驾驶 / ADAS / 激光雷达"
  },
  {
    "name": "小鹏汽车",
    "ticker": "XPEV / 09868",
    "market": "us",
    "url": "https://www.xiaopeng.com",
    "chain": "downstream",
    "subGroup": "自动驾驶 / ADAS / 激光雷达"
  },
  {
    "name": "德赛西威",
    "ticker": "002920 · 深交所",
    "market": "cn",
    "url": "https://www.desaysv.com",
    "chain": "downstream",
    "subGroup": "自动驾驶 / ADAS / 激光雷达"
  },
  {
    "name": "经纬恒润",
    "ticker": "688326 · 上交所",
    "market": "cn",
    "url": "https://www.hirain.com",
    "chain": "downstream",
    "subGroup": "自动驾驶 / ADAS / 激光雷达"
  },
  {
    "name": "伯特利 (制动)",
    "ticker": "603596 · 上交所",
    "market": "cn",
    "url": "https://www.btl-auto.com",
    "chain": "downstream",
    "subGroup": "自动驾驶 / ADAS / 激光雷达"
  },
  {
    "name": "韦尔股份 (CIS)",
    "ticker": "603501 · 上交所",
    "market": "cn",
    "url": "https://www.willsemi.com",
    "chain": "downstream",
    "subGroup": "自动驾驶 / ADAS / 激光雷达"
  },
  {
    "name": "SoundHound AI",
    "ticker": "SOUN",
    "market": "us",
    "url": "https://www.soundhound.com",
    "chain": "downstream",
    "subGroup": "AI 语音 / 交互 / 视觉"
  },
  {
    "name": "科大讯飞",
    "ticker": "002230 · 深交所",
    "market": "cn",
    "url": "https://www.iflytek.com",
    "chain": "downstream",
    "subGroup": "AI 语音 / 交互 / 视觉"
  },
  {
    "name": "海康威视",
    "ticker": "002415 · 深交所",
    "market": "cn",
    "url": "https://www.hikvision.com",
    "chain": "downstream",
    "subGroup": "AI 语音 / 交互 / 视觉"
  },
  {
    "name": "云从科技",
    "ticker": "688327 · 上交所",
    "market": "cn",
    "url": "https://www.cloudwalk.com",
    "chain": "downstream",
    "subGroup": "AI 语音 / 交互 / 视觉"
  },
  {
    "name": "芯原股份",
    "ticker": "688521 · 上交所",
    "market": "cn",
    "url": "https://www.verisilicon.com",
    "chain": "downstream",
    "subGroup": "AI 语音 / 交互 / 视觉"
  },
  {
    "name": "奥比中光 (3D视觉)",
    "ticker": "688322 · 上交所",
    "market": "cn",
    "url": "https://www.orbbec.com",
    "chain": "downstream",
    "subGroup": "AI 语音 / 交互 / 视觉"
  },
  {
    "name": "豪威集团 (图像传感)",
    "ticker": "688213 · 上交所",
    "market": "cn",
    "url": "https://www.omnivision-group.com",
    "chain": "downstream",
    "subGroup": "AI 语音 / 交互 / 视觉"
  },
  {
    "name": "Meta Platforms",
    "ticker": "META",
    "market": "us",
    "url": "https://www.meta.com",
    "chain": "downstream",
    "subGroup": "互联网 / AI 应用"
  },
  {
    "name": "Apple",
    "ticker": "AAPL",
    "market": "us",
    "url": "https://www.apple.com",
    "chain": "downstream",
    "subGroup": "互联网 / AI 应用"
  },
  {
    "name": "Netflix",
    "ticker": "NFLX",
    "market": "us",
    "url": "https://www.netflix.com",
    "chain": "downstream",
    "subGroup": "互联网 / AI 应用"
  },
  {
    "name": "Uber Technologies",
    "ticker": "UBER",
    "market": "us",
    "url": "https://www.uber.com",
    "chain": "downstream",
    "subGroup": "互联网 / AI 应用"
  },
  {
    "name": "AppLovin (AI广告)",
    "ticker": "APP",
    "market": "us",
    "url": "https://www.applovin.com",
    "chain": "downstream",
    "subGroup": "互联网 / AI 应用"
  },
  {
    "name": "The Trade Desk",
    "ticker": "TTD",
    "market": "us",
    "url": "https://www.thetradedesk.com",
    "chain": "downstream",
    "subGroup": "互联网 / AI 应用"
  },
  {
    "name": "腾讯控股",
    "ticker": "00700 · 港交所",
    "market": "hk",
    "url": "https://www.tencent.com",
    "chain": "downstream",
    "subGroup": "互联网 / AI 应用"
  },
  {
    "name": "美团",
    "ticker": "03690 · 港交所",
    "market": "hk",
    "url": "https://www.meituan.com",
    "chain": "downstream",
    "subGroup": "互联网 / AI 应用"
  },
  {
    "name": "小米集团",
    "ticker": "01810 · 港交所",
    "market": "hk",
    "url": "https://www.mi.com",
    "chain": "downstream",
    "subGroup": "互联网 / AI 应用"
  },
  {
    "name": "网易",
    "ticker": "09999 · 港交所",
    "market": "hk",
    "url": "https://www.netease.com",
    "chain": "downstream",
    "subGroup": "互联网 / AI 应用"
  },
  {
    "name": "京东集团",
    "ticker": "09618 · 港交所",
    "market": "hk",
    "url": "https://www.jd.com",
    "chain": "downstream",
    "subGroup": "互联网 / AI 应用"
  },
  {
    "name": "快手",
    "ticker": "01024 · 港交所",
    "market": "hk",
    "url": "https://www.kuaishou.com",
    "chain": "downstream",
    "subGroup": "互联网 / AI 应用"
  },
  {
    "name": "神州泰岳",
    "ticker": "300002 · 深交所",
    "market": "cn",
    "url": "https://www.ultrapower.com.cn",
    "chain": "downstream",
    "subGroup": "互联网 / AI 应用"
  },
  {
    "name": "Duolingo",
    "ticker": "DUOL",
    "market": "us",
    "url": "https://www.duolingo.com",
    "chain": "downstream",
    "subGroup": "AI 教育"
  },
  {
    "name": "Coursera",
    "ticker": "COUR",
    "market": "us",
    "url": "https://www.coursera.org",
    "chain": "downstream",
    "subGroup": "AI 教育"
  },
  {
    "name": "Tesla (Optimus)",
    "ticker": "TSLA",
    "market": "us",
    "url": "https://www.tesla.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "NVIDIA (Isaac / 机器人芯片)",
    "ticker": "NVDA",
    "market": "us",
    "url": "https://www.nvidia.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "Intuitive Surgical (手术机器人)",
    "ticker": "ISRG",
    "market": "us",
    "url": "https://www.intuitive.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "Symbotic (仓储机器人)",
    "ticker": "SYM",
    "market": "us",
    "url": "https://www.symbotic.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "Serve Robotics (配送机器人)",
    "ticker": "SERV",
    "market": "us",
    "url": "https://www.serverobotics.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "Aurora Innovation (自动驾驶)",
    "ticker": "AUR",
    "market": "us",
    "url": "https://aurora.tech",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "Rockwell Automation",
    "ticker": "ROK",
    "market": "us",
    "url": "https://www.rockwellautomation.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "奥比中光 (3D视觉传感器)",
    "ticker": "688322 · 上交所",
    "market": "cn",
    "url": "https://www.orbbec.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "柯力传感 (力传感器)",
    "ticker": "603662 · 上交所",
    "market": "cn",
    "url": "https://www.keli sensing.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "绿的谐波 (减速器/丝杠)",
    "ticker": "688017 · 上交所",
    "market": "cn",
    "url": "http://www.leaderdrive.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "拓普集团 (执行器/灵巧手)",
    "ticker": "601689 · 上交所",
    "market": "cn",
    "url": "https://www.tuopu.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "汇川技术 (伺服驱动)",
    "ticker": "300124 · 深交所",
    "market": "cn",
    "url": "https://www.inovance.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "拓斯达 (工业机器人)",
    "ticker": "300607 · 深交所",
    "market": "cn",
    "url": "https://www.topstarltd.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "中科创达 (机器人OS)",
    "ticker": "300496 · 深交所",
    "market": "cn",
    "url": "https://www.thundercomm.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "越疆 (协作机器人)",
    "ticker": "02432 · 港交所",
    "market": "hk",
    "url": "https://www.dobot.cn",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "地平线 (机器人端侧AI芯片)",
    "ticker": "09660 · 港交所",
    "market": "hk",
    "url": "https://www.horizon.ai",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "商汤-W (善惠人形机器人)",
    "ticker": "00020 · 港交所",
    "market": "hk",
    "url": "https://www.sensetime.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "Yaskawa Electric",
    "ticker": "6506 · TYO",
    "market": "jp",
    "url": "https://www.yaskawa.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "ABB Ltd",
    "ticker": "ABBN · SWX",
    "market": "eu",
    "url": "https://global.abb",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "Rainbow Robotics",
    "ticker": "277810 · KOSDAQ",
    "market": "kr",
    "url": "https://www.rainbow-robotics.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "Doosan Robotics",
    "ticker": "454910 · KRX",
    "market": "kr",
    "url": "https://www.doosanrobotics.com",
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "云深处 (Deep Robotics)",
    "ticker": "科创板已受理 · 四足行业应用全球第一",
    "market": "ipo",
    "url": null,
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "乐聚智能 (Leju Robotics)",
    "ticker": "创业板已受理 · 全尺寸人形\"夸父\"",
    "market": "ipo",
    "url": null,
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "银河通用 (GalaxyBot)",
    "ticker": "已完成股改 · 宁德时代工业落地",
    "market": "ipo",
    "url": null,
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "智元机器人 (Agibot)",
    "ticker": "已完成股改 · 3C工厂流水线作业",
    "market": "ipo",
    "url": null,
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "星海图 (Galaxea AI)",
    "ticker": "已完成股改",
    "market": "ipo",
    "url": null,
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "众擎机器人 (Engine AI)",
    "ticker": "已完成股改",
    "market": "ipo",
    "url": null,
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "星尘智能 (Stardust)",
    "ticker": "未上市 · 3C电子/汽车零部件仓储",
    "market": "ipo",
    "url": null,
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "Figure AI",
    "ticker": "未上市 · OpenAI合作/宝马工厂",
    "market": "ipo",
    "url": null,
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  },
  {
    "name": "卧安机器人 (SwitchBot)",
    "ticker": "港股 2025.12上市 · 家庭机器人",
    "market": "ipo",
    "url": null,
    "chain": "downstream",
    "subGroup": "具身智能 / 人形机器人"
  }
];

// ===== 层级元数据 =====

export const CHAIN_META: Record<ChainLevel, ChainMetaEntry> = {
  "upstream": {
    "title": "上游 — 基础设施层",
    "desc": "半导体设备 · 材料 · IP/EDA · 晶圆代工 · 存储 · 网络 · 电力 · 数据中心",
    "num": "上",
    "color": "#dc2626"
  },
  "midstream": {
    "title": "中游 — 算力与平台",
    "desc": "AI芯片 · 服务器 · 云计算 · 大数据平台 · 工业自动化",
    "num": "中",
    "color": "#ea580c"
  },
  "downstream": {
    "title": "下游 — 应用层",
    "desc": "软件SaaS · 网安AI · 医疗AI · 自动驾驶 · 语音交互 · 互联网 · 广告 · 教育",
    "num": "下",
    "color": "#6366f1"
  }
};

// ===== 子分组定义 =====

export const CHAIN_SUB_GROUPS: ChainSubGroups = {
  "upstream": [
    "EDA / IP 设计",
    "半导体设备",
    "晶圆代工",
    "存储芯片 / HBM（AI 高带宽内存）",
    "网络互联 / 光通信",
    "电力 / 散热 / 数据中心基础设施",
    "数据中心 / IDC"
  ],
  "midstream": [
    "AI 芯片 / GPU / ASIC",
    "服务器 / 硬件 / 代工",
    "云计算 / 平台",
    "大数据 / AI 平台 / 数据分析",
    "工业自动化 / 机器人（BOTZ ETF 核心持仓）"
  ],
  "downstream": [
    "AI 软件 / SaaS",
    "AI 网络安全",
    "AI 医疗",
    "自动驾驶 / ADAS / 激光雷达",
    "AI 语音 / 交互 / 视觉",
    "互联网 / AI 应用",
    "AI 教育",
    "具身智能 / 人形机器人"
  ]
};

// ===== 市场标签 =====

export const MARKET_LABELS: MarketLabels = {
  "us": "美股",
  "cn": "A股",
  "hk": "港股",
  "eu": "欧股",
  "jp": "日股",
  "kr": "韩股",
  "tw": "台股",
  "ipo": "IPO"
};

// ===== 辅助函数 =====

export function getMarketDistribution(): { name: string; value: number; market: Market }[] {
  var counts = new Map<Market, number>();
  for (var _i = 0; _i < LANDSCAPE_COMPANIES.length; _i++) {
    var c = LANDSCAPE_COMPANIES[_i];
    counts.set(c.market, (counts.get(c.market) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(function(_a) { var market = _a[0], value = _a[1]; return { name: MARKET_LABELS[market], value: value, market: market }; })
    .sort(function(a, b) { return b.value - a.value; });
}

export function getChainDistribution(): { name: string; value: number; chain: ChainLevel; color: string }[] {
  var counts = new Map<ChainLevel, number>();
  for (var _i = 0; _i < LANDSCAPE_COMPANIES.length; _i++) {
    var c = LANDSCAPE_COMPANIES[_i];
    counts.set(c.chain, (counts.get(c.chain) || 0) + 1);
  }
  var levels: ChainLevel[] = ["upstream", "midstream", "downstream"];
  return levels.map(function(chain) { return {
    name: CHAIN_META[chain].title,
    value: counts.get(chain) || 0,
    chain: chain,
    color: CHAIN_META[chain].color,
  };});
}

export function getSubGroupDistribution(): { name: string; value: number; chain: ChainLevel }[] {
  var counts = new Map<string, { value: number; chain: ChainLevel }>();
  for (var _i = 0; _i < LANDSCAPE_COMPANIES.length; _i++) {
    var c = LANDSCAPE_COMPANIES[_i];
    var entry = counts.get(c.subGroup);
    if (entry) {
      entry.value++;
    } else {
      counts.set(c.subGroup, { value: 1, chain: c.chain });
    }
  }
  return Array.from(counts.entries())
    .map(function(_a) { var name = _a[0], _b = _a[1], value = _b.value, chain = _b.chain; return { name: name, value: value, chain: chain }; })
    .sort(function(a, b) { return b.value - a.value; });
}

export function getChainMarketMatrix(): { chain: string; [marketLabel: string]: number | string }[] {
  var matrix = new Map<ChainLevel, Map<Market, number>>();
  for (var _i = 0; _i < 3; _i++) {
    var level: ChainLevel = ["upstream", "midstream", "downstream"][_i] as ChainLevel;
    matrix.set(level, new Map());
  }
  for (var _i = 0; _i < LANDSCAPE_COMPANIES.length; _i++) {
    var c = LANDSCAPE_COMPANIES[_i];
    var row = matrix.get(c.chain)!;
    row.set(c.market, (row.get(c.market) || 0) + 1);
  }
  var levels: ChainLevel[] = ["upstream", "midstream", "downstream"];
  return levels.map(function(level) {
    var entry: Record<string, number | string> = { chain: CHAIN_META[level].title };
    for (var _j = 0; _j < UNIQUE_MARKETS.length; _j++) {
      var market = UNIQUE_MARKETS[_j];
      entry[MARKET_LABELS[market]] = matrix.get(level)!.get(market) || 0;
    }
    return entry as { chain: string; [marketLabel: string]: number | string };
  });
}

export var UNIQUE_MARKETS: Market[] = (function() {
  var set = new Set<Market>();
  for (var _i = 0; _i < LANDSCAPE_COMPANIES.length; _i++) {
    set.add(LANDSCAPE_COMPANIES[_i].market);
  }
  return Array.from(set);
})();

export function getFinanceUrl(company: Company): { label: string; url: string } | null {
  if (company.market === "ipo") return null;
  
  if (company.market === "us") {
    var ticker = company.ticker.split("/")[0].trim();
    if (!ticker || ticker.length > 10) return null;
    return {
      label: "SEC EDGAR",
      url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=" + ticker + "&type=10-K",
    };
  }
  
  if (company.market === "cn") {
    var match = company.ticker.match(/^(\d{6})/);
    if (!match) return null;
    return {
      label: "巨潮资讯",
      url: "https://www.cninfo.com.cn/new/disclosure/stock?stockCode=" + match[1] + "&orgId=gssz" + match[1],
    };
  }
  
  if (company.market === "hk") {
    var match2 = company.ticker.match(/^(\d{5})/);
    if (!match2) return null;
    return {
      label: "披露易",
      url: "https://www.hkexnews.hk/listedco/listconews/advancedsearch/search_active_main.aspx?stockcode=" + match2[1],
    };
  }
  
  return null;
}
