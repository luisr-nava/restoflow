export type SalesSummary = {
  totalSales: number;
  totalOrders: number;
  averageTicket: number;
  closedTables: number;
};

export type TopProduct = {
  name: string;
  quantity: number;
  total: number;
};

export type TopCategory = {
  name: string;
  quantity: number;
  total: number;
};

export type PaymentMethodReport = {
  method: "CASH" | "CARD" | "TRANSFER" | "ACCOUNT";
  total: number;
};
