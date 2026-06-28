"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { ImageUploadField } from "@/src/shared/components/ui/ImageUploadField";
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
      imageFile: undefined,
      isAvailable: item.is_available,
    },
  });

  const { mutate, isPending } = useUpdateMenuItem();

  const onSubmit = (input: UpdateMenuItemInput) => {
    mutate(input, {
      onSuccess: () => {
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

      <ImageUploadField
        label="Imagen del plato (opcional)"
        imageAlt="Imagen del plato"
        emptyText="Arrastrá una imagen o hacé click para seleccionarla"
        removeText="Quitar imagen"
        value={form.getValues("imageFile")}
        currentImageUrl={form.getValues("imageUrl")}
        disabled={isPending}
        onChange={(file) => {
          form.setValue("imageFile", file, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        onRemoveCurrentImage={() => {
          form.setValue("imageUrl", "", {
            shouldDirty: true,
            shouldValidate: true,
          });
          form.setValue("imageFile", undefined, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
      <FormSubmit
        value="Guardar cambios"
        loadingText="Guardando..."
        disabled={isPending}
      />
    </Form>
  );
}



