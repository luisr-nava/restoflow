"use client";

import { useReportsOverview } from "./use-reports-overview";

export function usePaymentMethods() {
  const query = useReportsOverview();

  return {
    ...query,
    data: query.data?.paymentMethods ?? [],
  };
}
