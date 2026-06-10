export interface MonthlyRevenueData {
  month: string;
  revenue: number;
  orders: number;
}

export interface CategorySalesData {
  name: string;
  value: number;
  color: string;
}

export interface QuotationStatusData {
  name: string;
  count: number;
  color: string;
}

export interface TopProductData {
  name: string;
  sku: string;
  qty: number;
  revenue: number;
}

export const mockMonthlyRevenue: MonthlyRevenueData[] = [
  { month: "Jan", revenue: 850000, orders: 18 },
  { month: "Feb", revenue: 980000, orders: 22 },
  { month: "Mar", revenue: 1250000, orders: 28 },
  { month: "Apr", revenue: 1100000, orders: 25 },
  { month: "May", revenue: 1450000, orders: 32 },
  { month: "Jun", revenue: 1820000, orders: 38 } // Current month
];

export const mockCategorySales: CategorySalesData[] = [
  { name: "CV Cable", value: 720000, color: "#3b82f6" }, // Blue
  { name: "NYY Cable", value: 450000, color: "#10b981" }, // Emerald
  { name: "VCT Cable", value: 280000, color: "#f59e0b" }, // Amber
  { name: "THW Wire", value: 180000, color: "#8b5cf6" }, // Purple
  { name: "Aluminum Cable", value: 120000, color: "#ec4899" }, // Pink
  { name: "Others", value: 70000, color: "#6b7280" } // Gray
];

export const mockQuotationStatus: QuotationStatusData[] = [
  { name: "Accepted", count: 12, color: "#10b981" }, // Green
  { name: "Sent", count: 8, color: "#3b82f6" }, // Blue
  { name: "Draft", count: 5, color: "#6b7280" }, // Gray
  { name: "Rejected", count: 3, color: "#ef4444" }, // Red
  { name: "Expired", count: 4, color: "#f59e0b" } // Amber
];

export const mockTopProducts: TopProductData[] = [
  { sku: "CV-1X95-0.6/1KV", name: "CV Cable 1x95 sq.mm 0.6/1kV", qty: 2400, revenue: 984000 },
  { sku: "NYY-4X25-0.6/1KV", name: "NYY Cable 4x25 sq.mm 0.6/1kV", qty: 1100, revenue: 561000 },
  { sku: "VCT-4X2.5-450/750V", name: "VCT Cable 4x2.5 sq.mm 450/750V", qty: 6500, revenue: 422500 },
  { sku: "AL-THW-A-1X70-450/750V", name: "Aluminum Cable THW-A 1x70 sq.mm", qty: 8500, revenue: 335750 },
  { sku: "THW-1X10-450/750V", name: "THW Wire 1x10 sq.mm 450/750V", qty: 80, revenue: 116000 }
];
