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

import { useUpdateMenuItem } from "../hooks/use-update-menu-item";
import { UpdateMenuItemSchema } from "../schemas/menu-item.schema";
import type { MenuItem, UpdateMenuItemInput } from "../types/menu-item.types";

type UpdateMenuItemFormProps = {
  item: MenuItem;
  onSuccess?: () => void;
};

export function UpdateMenuItemForm({
  item,
  onSuccess,
}: UpdateMenuItemFormProps) {
  const { data: categories = [] } = useGetMenuCategories();

  const form = useForm<UpdateMenuItemInput>({
    resolver: zodResolver(
      UpdateMenuItemSchema,
    ) as Resolver<UpdateMenuItemInput>,
    defaultValues: {
      menuItemId: item.id,
      name: item.name,
      description: item.description ?? "",
      price: item.price,
      categoryId: item.category_id ?? "",
      imageUrl: item.image_url ?? "",
      isAvailable: item.is_available,
    },
  });

  const { mutate, isPending } = useUpdateMenuItem();

  const onSubmit = (input: UpdateMenuItemInput) => {
    mutate(input, {
      onSuccess: (response) => {
        if (response.error) {
          return;
        }

        onSuccess?.();
      },
    });
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" {...form.register("menuItemId")} />

      <FormInput
        name="name"
        label="Nombre"
        placeholder="Ej: Pizza muzzarella"
      />

      <FormInput
        name="description"
        label="Descripción"
        placeholder="Ej: Salsa, queso y aceitunas"
      />

      <FormInput name="price" label="Precio" type="number" placeholder="0" />

      <FormSelect name="categoryId" label="Categoría">
        <option value="">Sin categoría</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </FormSelect>

      <FormInput name="imageUrl" label="Imagen URL" placeholder="https://..." />

      <FormSubmit
        value="Guardar cambios"
        loadingText="Guardando..."
        disabled={isPending}
      />
    </Form>
  );
}
