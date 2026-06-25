"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import {
  Form,
  FormInput,
  FormSelect,
  FormSubmit,
} from "@/src/shared/components/forms";
import { useGetMenuCategories } from "@/src/features/menu-categories/hooks/use-get-menu-categories";

import { useCreateMenuItem } from "../hooks/use-create-menu-item";
import { CreateMenuItemSchema } from "../schemas/menu-item.schema";
import type { CreateMenuItemInput } from "../types/menu-item.types";

type CreateMenuItemFormProps = {
  onSuccess?: () => void;
};

export function CreateMenuItemForm({ onSuccess }: CreateMenuItemFormProps) {
  const { data: categories = [] } = useGetMenuCategories();

  const form = useForm<CreateMenuItemInput>({
    resolver: zodResolver(
      CreateMenuItemSchema,
    ) as Resolver<CreateMenuItemInput>,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      imageUrl: "",
      isAvailable: true,
    },
  });

  const { mutate, isPending } = useCreateMenuItem();

  const onSubmit = (input: CreateMenuItemInput) => {
    mutate(input, {
      onSuccess: () => {
        form.reset({
          name: "",
          description: "",
          price: 0,
          categoryId: "",
          imageUrl: "",
          isAvailable: true,
        });

        onSuccess?.();
      },
    });
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <FormInput
        name="name"
        label="Nombre"
        placeholder="Ej: Pizza muzzarella"
      />

      <FormInput
        name="description"
        label="Descripción"
        placeholder="Ej: Salsa de tomate, muzzarella y aceitunas"
      />

      <FormInput name="price" label="Precio" type="number" placeholder="0" />

      <FormSelect name="categoryId" label="Categoría" defaultValue="">
        <option value="">Sin categoría</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </FormSelect>

      <FormInput name="imageUrl" label="Imagen URL" placeholder="https://..." />

      <FormSubmit
        value="Crear item"
        loadingText="Creando..."
        disabled={isPending}
      />
    </Form>
  );
}
