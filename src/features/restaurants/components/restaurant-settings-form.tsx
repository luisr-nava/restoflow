"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormInput,
  FormSelect,
  FormSubmit,
} from "@/src/shared/components/forms";

import { UpdateRestaurantSchema } from "../schemas/restaurant.schema";
import { useGetRestaurantSettings } from "../hooks/use-get-restaurant-settings";
import { useUpdateRestaurantSettings } from "../hooks/use-update-restaurant-settings";
import type { UpdateRestaurantInput } from "../types/restaurant.types";

export function RestaurantSettingsForm() {
  const { data, isLoading } = useGetRestaurantSettings();
  const { mutateAsync } = useUpdateRestaurantSettings();

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
    await mutateAsync(input);
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <p className="text-sm text-muted-foreground">
          Cargando configuración...
        </p>
      </div>
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
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
          </FormSelect>

          <FormSelect name="timezone" label="Zona horaria">
            <option value="America/Argentina/Buenos_Aires">
              Argentina - Buenos Aires
            </option>
            <option value="UTC">UTC</option>
          </FormSelect>
        </div>

        <FormInput name="logoUrl" label="Logo URL" placeholder="https://..." />

        <FormSubmit value="Guardar configuración" loadingText="Guardando..." />
      </Form>
    </div>
  );
}
