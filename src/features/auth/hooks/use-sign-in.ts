"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { signInAction } from "../actions/auth.actions";
import type { SignInInput } from "../types/auth.types";

export function useSignIn() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: SignInInput) => signInAction(input),
    onSuccess: ({ error, success }) => {
      if (error) {
        toast.error(error);
        return;
      }

      if (success) {
        toast.success(success);
        router.push("/onboarding/restaurant");
      }
    },
  });
}

