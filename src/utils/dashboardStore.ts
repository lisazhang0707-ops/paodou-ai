// Dashboard data persistence via localStorage
// Stores financial records, customer records, and KPI targets

export interface FinancialRecord {
  period: string;          // YYYY-MM
  revenue: number;
  cost: number;
  fixedCost: number;
  variableCost: number;
  grossProfit: number;
  netProfit: number;
  cashFlow: number;
  budgetRevenue: number;
  budgetCost: number;
}

export interface CustomerRecord {
  id: string;
  name: string;
  segment: string;         // 企业 / 政府 / SMB
  acquisitionDate: string; // YYYY-MM-DD
  totalRevenue: number;
  orderCount: number;
  lastOrderDate: string;   // YYYY-MM-DD
  avgOrderValue: number;
  lifetimeMonths: number;
}

export interface CompetitorRecord {
  name: string;
  estimatedMarketShare: number;
  strengths: string[];
  weaknesses: string[];
  recentMoves: string[];
  threatLevel: "high" | "medium" | "low";
}

export interface SalesRecord {
  period: string;
  leads: number;
  qualifiedLeads: number;
  proposals: number;
  deals: number;
  revenue: number;
  avgDealSize: number;
  cycleDays: number;
  repId: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  tenure: number;
  revenueYTD: number;
  quotaAttainment: number;
  skills: Record<string, number>;
  flightRisk: number;
}

const STORAGE_PREFIX = "paodou_dashboard_";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return fallback;
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch { /* localStorage full */ }
}

// ── Financial Records ──

export function getFinancialRecords(): FinancialRecord[] {
  return read<FinancialRecord[]>("financials", []);
}

export function saveFinancialRecord(record: FinancialRecord): void {
  const records = getFinancialRecords();
  const idx = records.findIndex((r) => r.period === record.period);
  if (idx >= 0) {
    records[idx] = record;
  } else {
    records.push(record);
  }
  write("financials", records);
}

export function deleteFinancialRecord(period: string): void {
  const records = getFinancialRecords().filter((r) => r.period !== period);
  write("financials", records);
}

export function importFinancialCSV(csvText: string): number {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return 0;
  const records = getFinancialRecords();
  let count = 0;
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(",").map((v) => v.trim());
    if (vals.length < 4) continue;
    const record: FinancialRecord = {
      period: vals[0],
      revenue: parseFloat(vals[1]) || 0,
      cost: parseFloat(vals[2]) || 0,
      fixedCost: parseFloat(vals[3]) || 0,
      variableCost: parseFloat(vals[4]) || 0,
      grossProfit: (parseFloat(vals[1]) || 0) - (parseFloat(vals[2]) || 0),
      netProfit: parseFloat(vals[5]) || 0,
      cashFlow: parseFloat(vals[6]) || 0,
      budgetRevenue: parseFloat(vals[7]) || 0,
      budgetCost: parseFloat(vals[8]) || 0,
    };
    const idx = records.findIndex((r) => r.period === record.period);
    if (idx >= 0) records[idx] = record;
    else records.push(record);
    count++;
  }
  // sort by period
  records.sort((a, b) => a.period.localeCompare(b.period));
  write("financials", records);
  return count;
}

// ── Customer Records ──

export function getCustomerRecords(): CustomerRecord[] {
  return read<CustomerRecord[]>("customers", []);
}

export function saveCustomerRecord(record: CustomerRecord): void {
  const records = getCustomerRecords();
  const idx = records.findIndex((r) => r.id === record.id);
  if (idx >= 0) {
    records[idx] = record;
  } else {
    records.push(record);
  }
  write("customers", records);
}

export function deleteCustomerRecord(id: string): void {
  const records = getCustomerRecords().filter((r) => r.id !== id);
  write("customers", records);
}

// ── Sales Records ──

export function getSalesRecords(): SalesRecord[] {
  return read<SalesRecord[]>("sales", []);
}

export function saveSalesRecord(record: SalesRecord): void {
  const records = getSalesRecords();
  const idx = records.findIndex((r) => r.period === record.period && r.repId === record.repId);
  if (idx >= 0) records[idx] = record;
  else records.push(record);
  write("sales", records);
}

// ── Competitors ──

export function getCompetitors(): CompetitorRecord[] {
  return read<CompetitorRecord[]>("competitors", []);
}

export function saveCompetitor(record: CompetitorRecord): void {
  const records = getCompetitors();
  const idx = records.findIndex((r) => r.name === record.name);
  if (idx >= 0) records[idx] = record;
  else records.push(record);
  write("competitors", records);
}

export function deleteCompetitor(name: string): void {
  const records = getCompetitors().filter((r) => r.name !== name);
  write("competitors", records);
}

// ── Team Members ──

export function getTeamMembers(): TeamMember[] {
  return read<TeamMember[]>("team", []);
}

export function saveTeamMember(member: TeamMember): void {
  const members = getTeamMembers();
  const idx = members.findIndex((r) => r.id === member.id);
  if (idx >= 0) members[idx] = member;
  else members.push(member);
  write("team", members);
}

export function deleteTeamMember(id: string): void {
  const members = getTeamMembers().filter((r) => r.id !== id);
  write("team", members);
}
