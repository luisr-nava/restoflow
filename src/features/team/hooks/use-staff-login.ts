"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { staffLoginAction } from "../actions/staff-auth.action";
import type { StaffLoginInput } from "../types/staff-auth.types";
import { Route } from "next";

export function useStaffLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: StaffLoginInput) => staffLoginAction(input),
    onSuccess: (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(response.success);

      if (response.role === "WAITER") {
        router.push("/staff/waiter" as Route);
        return;
      }

      if (response.role === "KITCHEN") {
        router.push("/staff/kitchen" as Route);
      }
    },
    onError: () => {
      toast.error("No se pudo iniciar sesión");
    },
  });
}

