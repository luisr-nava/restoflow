"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormInput,
  FormSelect,
  FormSubmit,
} from "@/src/shared/components/forms";

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
    },
  });

  const { mutate: createRestaurant } = useCreateRestaurant();

  const onSubmit = (data: CreateRestaurantInput) => {
    createRestaurant(data);
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
        <option value="ARS">Peso Argentino (ARS)</option>
        <option value="USD">Dólar Estadounidense (USD)</option>
      </FormSelect>

      <FormSelect name="timezone" label="Zona horaria">
        <option value="America/Argentina/Buenos_Aires">Buenos Aires</option>
        <option value="America/Santiago">Santiago</option>
        <option value="America/Montevideo">Montevideo</option>
      </FormSelect>

      <FormSubmit
        value="Crear restaurante"
        loadingText="Creando restaurante..."
      />
    </Form>
  );
}
