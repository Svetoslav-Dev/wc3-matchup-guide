"use server";

import { existsSync } from "node:fs";
import { readdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

type ImageFolder = "Heroes" | "Units" | "Maps" | "Races" | "Buildings" | "Items";

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
  if (!ext || !["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return null;

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
