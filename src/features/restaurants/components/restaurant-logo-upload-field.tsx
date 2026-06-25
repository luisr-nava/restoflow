"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { RestaurantLogoFileSchema } from "../schemas/restaurant-logo.schema";
type RestaurantLogoUploadFieldProps = {
  value?: File;
  onChange: (file?: File) => void;
  disabled?: boolean;
};

export function RestaurantLogoUploadField({
  value,
  onChange,
  disabled = false,
}: RestaurantLogoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    if (!value) {
      setPreview(undefined);
      return;
    }

    const url = URL.createObjectURL(value);

    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleSelect = (file?: File) => {
    if (!file) {
      onChange(undefined);
      return;
    }

    const result = RestaurantLogoFileSchema.safeParse(file);

    if (!result.success) {
      return;
    }

    onChange(result.data);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const file = event.dataTransfer.files[0];

    handleSelect(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Logo del restaurante (opcional)
      </label>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="flex min-h-56 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition hover:bg-muted/40">
        {preview ? (
          <img
            src={preview}
            alt="Logo del restaurante"
            className="max-h-48 max-w-full rounded-md object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImagePlus className="size-8" />
            <span className="text-sm">
              Arrastrá una imagen o hacé click para seleccionarla
            </span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={disabled}
        onChange={(event) => handleSelect(event.target.files?.[0])}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="inline-flex items-center gap-2 text-sm text-destructive">
          <Trash2 className="size-4" />
          Quitar logo
        </button>
      )}
    </div>
  );
}

