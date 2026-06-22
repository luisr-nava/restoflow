"use client";

import { useQuery } from "@tanstack/react-query";

import { getPaymentMethodsAction } from "../actions/report.actions";
import { reportKeys } from "../query-keys/report.keys";

export function usePaymentMethods() {
  return useQuery({
    queryKey: reportKeys.paymentMethods,
    queryFn: getPaymentMethodsAction,
  });
}
