"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Route } from "next";
import { staffLogoutAction } from "../actions/staff-auth.action";

export function useStaffLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => staffLogoutAction(),
    onSuccess: (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(response.success);
      router.push("/staff/login" as Route);
      router.refresh();
    },
    onError: () => {
      toast.error("No se pudo cerrar sesión");
    },
  });
}

