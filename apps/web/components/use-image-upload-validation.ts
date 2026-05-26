"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type ImageFolder = "Heroes" | "Units" | "Maps" | "Races" | "Buildings" | "Items";

const MAX_UPLOAD_BYTES: Record<ImageFolder, number> = {
  Heroes: 2 * 1024 * 1024,
  Units: 2 * 1024 * 1024,
  Races: 2 * 1024 * 1024,
  Buildings: 2 * 1024 * 1024,
  Items: 2 * 1024 * 1024,
  Maps: 4 * 1024 * 1024,
};

const limitLabel = (folder: ImageFolder) => `${MAX_UPLOAD_BYTES[folder] / (1024 * 1024)}MB`;

const errorMessage = (folder: ImageFolder) =>
  `Image is too large. ${folder === "Maps" ? "Map images" : "Images"} must be ${limitLabel(folder)} or smaller.`;

export function useImageUploadValidation(folder: ImageFolder) {
  const [imageError, setImageError] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const validateFile = (file: File | null | undefined) => {
    if (!file) {
      setImageError("");
      setSelectedFileName("");
      return true;
    }

    if (file.size > MAX_UPLOAD_BYTES[folder]) {
      setImageError(errorMessage(folder));
      setSelectedFileName("");
      return false;
    }

    setImageError("");
    setSelectedFileName(file.name);
    return true;
  };

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!validateFile(file)) {
      event.currentTarget.value = "";
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const input = event.currentTarget.elements.namedItem("imageUpload");
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const file = input.files?.[0];
    if (!validateFile(file)) {
      event.preventDefault();
    }
  };

  return {
    imageError,
    imageLimitLabel: limitLabel(folder),
    selectedFileName,
    onImageChange,
    onSubmit,
  };
}
