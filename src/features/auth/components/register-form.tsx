"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormInput,
  FormSelect,
  FormTextArea,
  FormToggle,
  FormSubmit,
} from "@/components/forms";

import { z } from "zod";

const RestaurantSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  category: z.string().min(1, "La categoría es obligatoria"),
  description: z.string().min(1, "La descripción es obligatoria"),
  acceptsDelivery: z.boolean(),
});

type RestaurantInput = z.infer<typeof RestaurantSchema>;

export function RestaurantForm() {
  const form = useForm<RestaurantInput>({
    resolver: zodResolver(RestaurantSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      acceptsDelivery: false,
    },
  });

  const onSubmit = async () => {};

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormInput
        name="name"
        label="Nombre"
        placeholder="Nombre del restaurante"
      />

      <FormSelect name="category" label="Categoría">
        <option value="">Seleccionar</option>
        <option value="restaurant">Restaurante</option>
        <option value="bar">Bar</option>
        <option value="cafeteria">Cafetería</option>
      </FormSelect>

      <FormTextArea
        name="description"
        label="Descripción"
        placeholder="Descripción del restaurante"
        rows={4}
      />

      <div className="flex items-center gap-3">
        <FormToggle name="acceptsDelivery" />
        <span className="text-sm text-text">Acepta delivery</span>
      </div>
      <FormSubmit value="Guardar" loadingText="Guardando..." />
    </Form>
  );
}
