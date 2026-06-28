"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";

import { RestaurantLogoFileSchema } from "@/src/features/restaurants/schemas/restaurant-logo.schema";

type ImageUploadFieldProps = {
  label: string;
  imageAlt: string;
  emptyText: string;
  removeText: string;
  value?: File;
  currentImageUrl?: string;
  onChange: (file?: File) => void;
  onRemoveCurrentImage?: () => void;
  disabled?: boolean;
};

export function ImageUploadField({
  label,
  imageAlt,
  emptyText,
  removeText,
  value,
  currentImageUrl,
  onChange,
  onRemoveCurrentImage,
  disabled = false,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = useMemo(
    () => (value ? URL.createObjectURL(value) : undefined),
    [value],
  );

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const imageUrl = preview ?? currentImageUrl;

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

  const handleRemove = () => {
    onChange(undefined);

    if (currentImageUrl && !preview) {
      onRemoveCurrentImage?.();
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
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
      <label className="text-sm font-medium">{label}</label>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.click();
          }
        }}
        className="flex min-h-56 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition hover:bg-muted/40">
        {imageUrl ? (
          <div className="relative h-48 w-full">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              unoptimized
              sizes="100vw"
              className="rounded-md object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImagePlus className="size-8" />
            <span className="text-sm">{emptyText}</span>
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

      {imageUrl && (
        <button
          type="button"
          disabled={disabled}
          onClick={handleRemove}
          className="inline-flex items-center gap-2 text-sm text-destructive disabled:cursor-not-allowed disabled:opacity-50">
          <Trash2 className="size-4" />
          {removeText}
        </button>
      )}
    </div>
  );
}
