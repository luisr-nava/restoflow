"use client";

import { useQuery } from "@tanstack/react-query";

import { getPaymentMethodsAction } from "../actions/report.actions";

export function usePaymentMethods() {
  return useQuery({
    queryKey: ["reports", "payment-methods"],
    queryFn: getPaymentMethodsAction,
  });
}
