"use client";

import { ImageUploadField } from "@/src/shared/components/ui/ImageUploadField";

type RestaurantLogoUploadFieldProps = {
  value?: File;
  currentImageUrl?: string;
  onChange: (file?: File) => void;
  onRemoveCurrentImage?: () => void;
  disabled?: boolean;
};

export function RestaurantLogoUploadField({
  value,
  currentImageUrl,
  onChange,
  onRemoveCurrentImage,
  disabled = false,
}: RestaurantLogoUploadFieldProps) {
  return (
    <ImageUploadField
      label="Logo del restaurante (opcional)"
      imageAlt="Logo del restaurante"
      emptyText="Arrastrá una imagen o hacé click para seleccionarla"
      removeText="Quitar logo"
      value={value}
      currentImageUrl={currentImageUrl}
      onChange={onChange}
      onRemoveCurrentImage={onRemoveCurrentImage}
      disabled={disabled}
    />
  );
}
