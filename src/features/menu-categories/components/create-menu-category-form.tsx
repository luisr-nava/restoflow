"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormInput, FormSubmit } from "@/src/shared/components/forms";

import { useCreateMenuCategory } from "../hooks/use-create-menu-category";
import { CreateMenuCategorySchema } from "../schemas/menu-category.schema";
import type { CreateMenuCategoryInput } from "../types/menu-category.types";

type CreateMenuCategoryFormProps = {
  onSuccess?: () => void;
};

export function CreateMenuCategoryForm({
  onSuccess,
}: CreateMenuCategoryFormProps) {
  const form = useForm<CreateMenuCategoryInput>({
    resolver: zodResolver(CreateMenuCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate, isPending } = useCreateMenuCategory();

  const onSubmit = (input: CreateMenuCategoryInput) => {
    mutate(input, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <FormInput name="name" label="Nombre" placeholder="Ej: Pizzas" />

      <FormSubmit
        value="Crear categoría"
        loadingText="Creando..."
        disabled={isPending}
      />
    </Form>
  );
}
