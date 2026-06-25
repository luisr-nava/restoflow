"use client";

import { useMutation } from "@tanstack/react-query";

import { uploadRestaurantLogoAction } from "../actions/restaurant-logo.actions";

export function useUploadRestaurantLogo() {
  return useMutation({
    mutationFn: async (file?: File) => {
      const result = await uploadRestaurantLogoAction(file);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
}
