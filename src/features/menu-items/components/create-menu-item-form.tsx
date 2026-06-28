"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { ImageUploadField } from "@/src/shared/components/ui/ImageUploadField";

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
      imageFile: undefined,
    },
  });

  const { mutate, isPending } = useCreateMenuItem();
  const imageFile = useWatch({
    control: form.control,
    name: "imageFile",
  });
  const imageUrl = useWatch({
    control: form.control,
    name: "imageUrl",
  });

  const onSubmit = (input: CreateMenuItemInput) => {
    mutate(input, {
      onSuccess: () => {
        form.reset({
          name: "",
          description: "",
          price: 0,
          categoryId: "",
          imageUrl: "",
          imageFile: undefined,
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

      <ImageUploadField
        label="Imagen del plato (opcional)"
        imageAlt="Imagen del plato"
        emptyText="Arrastrá una imagen o hacé click para seleccionarla"
        removeText="Quitar imagen"
        value={imageFile}
        currentImageUrl={imageUrl}
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
        value="Crear item"
        loadingText="Creando..."
        disabled={isPending}
      />
    </Form>
  );
}
