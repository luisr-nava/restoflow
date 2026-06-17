"use server";

import { dashboardService } from "../services/dashboard.service";

export async function getDashboardDataAction() {
  return dashboardService.getDashboardData();
}
