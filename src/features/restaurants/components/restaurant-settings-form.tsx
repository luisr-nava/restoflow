"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RestaurantLogoUploadField } from "./restaurant-logo-upload-field";
import { useUploadRestaurantLogo } from "../hooks/use-upload-restaurant-logo";

import {
  Form,
  FormInput,
  FormSelect,
  FormSubmit,
} from "@/src/shared/components/forms";
import { EmptyState, LoadingState } from "@/src/shared/components/states";

import {
  RESTAURANT_SETTINGS_CURRENCY_OPTIONS,
  RESTAURANT_SETTINGS_TIMEZONE_OPTIONS,
} from "../constants/restaurant-options";
import { UpdateRestaurantSchema } from "../schemas/restaurant.schema";
import { useGetRestaurantSettings } from "../hooks/use-get-restaurant-settings";
import { useUpdateRestaurantSettings } from "../hooks/use-update-restaurant-settings";
import type { UpdateRestaurantInput } from "../types/restaurant.types";

function RestaurantSettingsLoadingSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <LoadingState
        label="Cargando configuración..."
        className="border-0 bg-transparent px-0 pt-0"
      />

      <div className="space-y-4">
        <div className="h-10 rounded-lg border border-border bg-background" />
        <div className="h-10 rounded-lg border border-border bg-background" />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-10 rounded-lg border border-border bg-background" />
          <div className="h-10 rounded-lg border border-border bg-background" />
        </div>

        <div className="h-10 rounded-lg border border-border bg-background" />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-10 rounded-lg border border-border bg-background" />
          <div className="h-10 rounded-lg border border-border bg-background" />
        </div>

        <div className="h-10 rounded-lg border border-border bg-background" />

        <div className="h-11 w-48 rounded-lg bg-foreground/10" />
      </div>
    </div>
  );
}

export function RestaurantSettingsForm() {
  const { data, isLoading, isError } = useGetRestaurantSettings();
  const { mutateAsync, isPending: isUpdatingSettings } =
    useUpdateRestaurantSettings();

  const { mutateAsync: uploadRestaurantLogo, isPending: isUploadingLogo } =
    useUploadRestaurantLogo();

  const form = useForm<UpdateRestaurantInput>({
    resolver: zodResolver(UpdateRestaurantSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      taxId: "",
      currency: "ARS",
      timezone: "America/Argentina/Buenos_Aires",
      logoUrl: "",
    },
  });
  const logoFile = useWatch({
    control: form.control,
    name: "logoFile",
  });
  const logoUrl = useWatch({
    control: form.control,
    name: "logoUrl",
  });

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    form.reset({
      name: data.data.name,
      address: data.data.address,
      phone: data.data.phone ?? "",
      email: data.data.email ?? "",
      taxId: data.data.tax_id ?? "",
      currency: data.data.currency,
      timezone: data.data.timezone,
      logoUrl: data.data.logo_url ?? "",
    });
  }, [data?.data, form]);

  async function onSubmit(input: UpdateRestaurantInput) {
    const { logoFile, ...restaurantData } = input;

    let logoUrl = restaurantData.logoUrl;

    if (logoFile) {
      const result = await uploadRestaurantLogo(logoFile);

      if (!result) {
        return;
      }

      logoUrl = result.publicUrl;
    }

    await mutateAsync({
      ...restaurantData,
      logoUrl,
    });
  }

  if (isLoading) {
    return <RestaurantSettingsLoadingSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        title="No se pudo cargar la configuración"
        description="Intentá recargar la página o volver a iniciar sesión."
      />
    );
  }

  if (!data?.data) {
    return (
      <EmptyState
        title="No encontramos la configuración del restaurante"
        description="Si el problema continúa, revisá que tu usuario pertenezca a un restaurante."
      />
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          Información del restaurante
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Actualizá los datos principales del restaurante.
        </p>
      </div>

      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <FormInput name="name" label="Nombre" placeholder="Restoflow" />
        <FormInput
          name="address"
          label="Dirección"
          placeholder="Av. Corrientes 1234"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            name="phone"
            label="Teléfono"
            placeholder="+54 11 1234-5678"
          />

          <FormInput
            name="email"
            label="Email"
            placeholder="restaurante@email.com"
          />
        </div>
        <FormInput
          name="taxId"
          label="CUIT / Tax ID"
          placeholder="20-12345678-9"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormSelect name="currency" label="Moneda">
            {RESTAURANT_SETTINGS_CURRENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FormSelect>

          <FormSelect name="timezone" label="Zona horaria">
            {RESTAURANT_SETTINGS_TIMEZONE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FormSelect>
        </div>
        <RestaurantLogoUploadField
          value={logoFile}
          currentImageUrl={logoUrl}
          disabled={isUploadingLogo || isUpdatingSettings}
          onChange={(file) => {
            form.setValue("logoFile", file, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          onRemoveCurrentImage={() => {
            form.setValue("logoUrl", "", {
              shouldDirty: true,
              shouldValidate: true,
            });
            form.setValue("logoFile", undefined, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />
        <FormSubmit
          value="Guardar configuración"
          loadingText="Guardando..."
          disabled={isUploadingLogo || isUpdatingSettings}
        />{" "}
      </Form>
    </div>
  );
}
