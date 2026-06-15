"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { verifyEmailAction } from "../actions/auth.actions";
import { VerifyEmailInput } from "../types/auth.types";
export function useVerifyEmail() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: VerifyEmailInput) => verifyEmailAction(input),

    onSuccess: ({ error, success }) => {
      if (error) {
        toast.error(error);
        return;
      }

      toast.success(success);
      router.push("/auth/sign-in");
    },
  });
}

