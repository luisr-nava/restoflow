export type DashboardSummary = {
  todaySales: number;
  activeOrders: number;
  occupiedTables: number;
  availableTables: number;
  kitchenOrders: number;
};

export type DashboardRecentOrder = {
  id: string;
  tableName: string;
  total: number;
  status: string;
  createdAt: string;
};

export type DashboardTopTable = {
  tableId: string;
  tableName: string;
  total: number;
};

export type DashboardSalesChartPoint = {
  hour: string;
  total: number;
};

export type DashboardData = {
  summary: DashboardSummary;
  recentOrders: DashboardRecentOrder[];
  topTables: DashboardTopTable[];
  salesChart: DashboardSalesChartPoint[];
};
