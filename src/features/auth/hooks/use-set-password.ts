"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setPasswordAction } from "../actions/auth.actions";
import type { SetPasswordInput } from "../types/auth.types";

export function useSetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: SetPasswordInput) => {
      const result = await setPasswordAction(input);

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result) => {
      toast.success(result.success);
      router.push("/auth/sign-in");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

