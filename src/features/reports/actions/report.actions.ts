"use server";

import { reportService } from "../services/report.service";

export async function getReportsOverviewAction() {
  return reportService.getReportsOverview();
}

export async function getSalesSummaryAction() {
  return reportService.getSalesSummary();
}

export async function getTopProductsAction() {
  return reportService.getTopProducts();
}

export async function getTopCategoriesAction() {
  return reportService.getTopCategories();
}

export async function getPaymentMethodsAction() {
  return reportService.getPaymentMethods();
}
