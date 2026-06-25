import { z } from "zod";

export const RESTAURANT_LOGO_MAX_SIZE = 2 * 1024 * 1024;

export const RESTAURANT_LOGO_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const RestaurantLogoFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= RESTAURANT_LOGO_MAX_SIZE, {
    error: "El logo no puede superar los 2 MB",
  })
  .refine(
    (file) =>
      RESTAURANT_LOGO_ALLOWED_TYPES.includes(
        file.type as (typeof RESTAURANT_LOGO_ALLOWED_TYPES)[number],
      ),
    {
      error: "El logo debe ser una imagen JPG, PNG o WEBP",
    },
  );

export const OptionalRestaurantLogoFileSchema =
  RestaurantLogoFileSchema.optional();
