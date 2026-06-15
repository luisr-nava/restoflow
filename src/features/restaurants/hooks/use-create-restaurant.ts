"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { createRestaurantAction } from "../actions/restaurant.actions";
import type { CreateRestaurantInput } from "../types/restaurant.types";
import toast from "react-hot-toast";

export function useCreateRestaurant() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: CreateRestaurantInput) => {
      const result = await createRestaurantAction(input);

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result) => {
      toast.success(result.success);
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

