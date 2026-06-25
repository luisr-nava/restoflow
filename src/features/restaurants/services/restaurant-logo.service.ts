import { extname } from "path";

import { createClient } from "@/src/lib/supabase/server";

import {
  restaurantLogoRepository,
  type IRestaurantLogoRepository,
} from "../repositories/restaurant-logo.repository";
import type {
  UploadRestaurantLogoInput,
  UploadRestaurantLogoResult,
} from "../types/restaurant-logo.types";

class RestaurantLogoService {
  constructor(
    private readonly restaurantLogoRepository: IRestaurantLogoRepository,
  ) {}

  async uploadLogo(
    input: UploadRestaurantLogoInput,
  ): Promise<UploadRestaurantLogoResult> {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("No hay una sesión activa");
    }

    const extension = extname(input.file.name);

    const fileName = `${crypto.randomUUID()}${extension}`;

    const storagePath = `users/${user.id}/restaurant-logo/${fileName}`;

    const uploadResult = await this.restaurantLogoRepository.upload(
      supabase,
      storagePath,
      input.file,
    );

    if (uploadResult.error) {
      throw uploadResult.error;
    }

    const publicUrl = this.restaurantLogoRepository.getPublicUrl(
      supabase,
      uploadResult.path,
    );

    return {
      path: uploadResult.path,
      publicUrl,
    };
  }
}

export const restaurantLogoService = new RestaurantLogoService(
  restaurantLogoRepository,
);

