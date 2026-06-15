"use client";

import { useMutation } from "@tanstack/react-query";
import { requestPasswordResetAction } from "../actions/auth.actions";
import type { ForgotPasswordInput } from "../types/auth.types";
import toast from "react-hot-toast";

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (input: ForgotPasswordInput) => {
      const result = await requestPasswordResetAction(input);

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result) => {
      toast.success(result.success);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

