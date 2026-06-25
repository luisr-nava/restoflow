"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Form, FormInput, FormSubmit } from "@/src/shared/components/forms";

import { useUpdateMenuCategory } from "../hooks/use-update-menu-category";
import { UpdateMenuCategorySchema } from "../schemas/menu-category.schema";
import type {
  MenuCategory,
  UpdateMenuCategoryInput,
} from "../types/menu-category.types";

type UpdateMenuCategoryFormProps = {
  category: MenuCategory;
  onSuccess?: () => void;
};

export function UpdateMenuCategoryForm({
  category,
  onSuccess,
}: UpdateMenuCategoryFormProps) {
  const form = useForm<UpdateMenuCategoryInput>({
    resolver: zodResolver(
      UpdateMenuCategorySchema,
    ) as Resolver<UpdateMenuCategoryInput>,
    defaultValues: {
      categoryId: category.id,
      name: category.name,
    },
  });

  const { mutate, isPending } = useUpdateMenuCategory();

  const onSubmit = (input: UpdateMenuCategoryInput) => {
    mutate(input, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" {...form.register("categoryId")} />

      <FormInput name="name" label="Nombre" placeholder="Ej: Bebidas" />

      <FormSubmit
        value="Guardar cambios"
        loadingText="Guardando..."
        disabled={isPending}
      />
    </Form>
  );
}
