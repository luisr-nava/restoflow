"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { signUpAction } from "../actions/auth.actions";
import type { SignUpInput } from "../types/auth.types";

export function useSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: SignUpInput) => signUpAction(input),
    onSuccess: ({ error, success }) => {
      if (error) {
        toast.error(error);
        return;
      }

      if (success) {
        toast.success(success);
        router.push("/auth/sign-in");
      }
    },
  });
}

