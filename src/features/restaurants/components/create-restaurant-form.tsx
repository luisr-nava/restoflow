"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RestaurantLogoUploadField } from "./restaurant-logo-upload-field";
import { useUploadRestaurantLogo } from "../hooks/use-upload-restaurant-logo";

import {
  Form,
  FormInput,
  FormSelect,
  FormSubmit,
} from "@/src/shared/components/forms";
import {
  CREATE_RESTAURANT_CURRENCY_OPTIONS,
  CREATE_RESTAURANT_TIMEZONE_OPTIONS,
} from "../constants/restaurant-options";

import { useCreateRestaurant } from "../hooks/use-create-restaurant";
import { CreateRestaurantSchema } from "../schemas/restaurant.schema";
import type { CreateRestaurantInput } from "../types/restaurant.types";

export function CreateRestaurantForm() {
  const form = useForm<CreateRestaurantInput>({
    resolver: zodResolver(CreateRestaurantSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      taxId: "",
      currency: "ARS",
      timezone: "America/Argentina/Buenos_Aires",
      logoUrl: "",
      logoFile: undefined,
    },
  });
  const { mutateAsync: uploadRestaurantLogo, isPending: isUploadingLogo } =
    useUploadRestaurantLogo();
  const { mutate: createRestaurant } = useCreateRestaurant();

  const onSubmit = async (data: CreateRestaurantInput) => {
    const { logoFile, ...restaurantData } = data;

    let logoUrl = restaurantData.logoUrl;

    if (logoFile) {
      const result = await uploadRestaurantLogo(logoFile);

      if (!result) {
        return;
      }

      logoUrl = result.publicUrl;
    }

    createRestaurant({
      ...restaurantData,
      logoUrl,
    });
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormInput
        name="name"
        label="Nombre del restaurante"
        placeholder="Mi Restaurante"
      />

      <FormInput
        name="address"
        label="Dirección"
        placeholder="Av. Corrientes 1234"
      />

      <FormInput name="phone" label="Teléfono" placeholder="+54 11 1234 5678" />

      <FormInput
        name="email"
        label="Email"
        placeholder="contacto@restaurante.com"
      />

      <FormInput
        name="taxId"
        label="CUIT / Tax ID"
        placeholder="20-12345678-9"
      />

      <FormSelect name="currency" label="Moneda">
        {CREATE_RESTAURANT_CURRENCY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </FormSelect>

      <FormSelect name="timezone" label="Zona horaria">
        {CREATE_RESTAURANT_TIMEZONE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </FormSelect>
      <RestaurantLogoUploadField
        value={form.watch("logoFile")}
        disabled={isUploadingLogo}
        onChange={(file) => {
          form.setValue("logoFile", file, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
      <FormSubmit
        value="Crear restaurante"
        loadingText="Creando restaurante..."
        disabled={isUploadingLogo}
      />
    </Form>
  );
}

