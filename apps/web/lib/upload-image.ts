"use server";

import { existsSync } from "node:fs";
import { readdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

type ImageFolder = "Heroes" | "Units" | "Maps" | "Races" | "Buildings" | "Items";

const MAX_UPLOAD_BYTES: Record<ImageFolder, number> = {
  Heroes: 2 * 1024 * 1024,
  Units: 2 * 1024 * 1024,
  Races: 2 * 1024 * 1024,
  Buildings: 2 * 1024 * 1024,
  Items: 2 * 1024 * 1024,
  Maps: 4 * 1024 * 1024,
};

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"] as const;

const getPublicRoot = () => {
  const candidates = [
    join(process.cwd(), "public"),
    join(process.cwd(), "apps", "web", "public"),
  ];

  return candidates.find((path) => existsSync(path)) ?? candidates[1];
};

export async function uploadImage(file: File, folder: ImageFolder, customName?: string): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
    throw new Error(`Unsupported image format. Use: ${ALLOWED_EXTENSIONS.join(", ")}.`);
  }

  const maxBytes = MAX_UPLOAD_BYTES[folder];
  if (file.size > maxBytes) {
    const limitMb = Math.round((maxBytes / (1024 * 1024)) * 10) / 10;
    throw new Error(`Image is too large. ${folder === "Maps" ? "Map images" : "Images"} must be ${limitMb}MB or smaller.`);
  }

  const raw = customName ?? file.name.replace(/\.[^.]+$/, "");
  const baseName = raw.replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `${baseName}.${ext}`;
  const publicDir = join(getPublicRoot(), "images", folder);
  const filePath = join(publicDir, fileName);

  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  return `/images/${folder}/${fileName}`;
}

// Deletes a file given its URL path, e.g. /images/Heroes/Archmage.png
export async function deleteImageByUrl(urlPath: string | null | undefined): Promise<void> {
  if (!urlPath) return;
  try {
    await unlink(join(getPublicRoot(), urlPath));
  } catch { /* file may not exist */ }
}

// Deletes a file given its base name (no extension), scanning the folder for a match
export async function deleteImageByFile(folder: ImageFolder, imageFile: string | null | undefined): Promise<void> {
  if (!imageFile) return;
  const dir = join(getPublicRoot(), "images", folder);
  try {
    const files = await readdir(dir);
    const baseName = imageFile.replace(/\.[^.]+$/, "");
    const match = files.find((f) => f === imageFile || f.replace(/\.[^.]+$/, "") === baseName);
    if (match) await unlink(join(dir, match));
  } catch { /* directory or file may not exist */ }
}
