import { useMutation } from "@tanstack/react-query";
import { resendVerificationAction } from "../actions/auth.actions";
import toast from "react-hot-toast";

export function useResendVerification() {
  return useMutation({
    mutationFn: async (email: string) => {
      const result = await resendVerificationAction(email);

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

