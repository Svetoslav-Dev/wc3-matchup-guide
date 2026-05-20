"use server";

import { writeFile } from "node:fs/promises";
import { join } from "node:path";

type ImageFolder = "Heroes" | "Units" | "Maps" | "Races" | "Buildings" | "Items";

export async function uploadImage(file: File, folder: ImageFolder): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return null;

  const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `${baseName}.${ext}`;
  const publicDir = join(process.cwd(), "public", "images", folder);
  const filePath = join(publicDir, fileName);

  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  return `/images/${folder}/${fileName}`;
}
