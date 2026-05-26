"use server";

import { createBuild, updateBuild } from "@warcraft3-guide-hub/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSessionUser } from "../../lib/auth";
import { formDataToAdminBuildInput, slugify } from "../../lib/admin-forms";
import { buildSlugExists, deleteBuildForUser, getUserBuildById } from "../../lib/content";
import { adminBuildSchema } from "../../lib/validation";

export type BuildFormFields = {
  raceSlug: string;
  matchupSlug: string;
  title: string;
  slug: string;
  summary: string;
  difficulty: string;
  strategyType: string;
  body: string;
  stepsInput: string;
  isPublished: string;
};

export type BuildActionState = {
  status: "idle" | "validation-error" | "server-error";
  fields?: BuildFormFields;
  missingFields?: string;
  errorMessage?: string;
  errorKey?: number;
};

const toUniqueSlug = async (base: string, excludeId?: number): Promise<string> => {
  if (!(await buildSlugExists(base, excludeId))) return base;
  for (let i = 2; i <= 99; i++) {
    const candidate = `${base}-${i}`;
    if (!(await buildSlugExists(candidate, excludeId))) return candidate;
  }
  return `${base}-${Date.now()}`;
};

const extractRawFields = (formData: FormData): BuildFormFields => ({
  raceSlug: String(formData.get("raceSlug") ?? ""),
  matchupSlug: String(formData.get("matchupSlug") ?? ""),
  title: String(formData.get("title") ?? ""),
  slug: String(formData.get("slug") ?? ""),
  summary: String(formData.get("summary") ?? ""),
  difficulty: String(formData.get("difficulty") ?? ""),
  strategyType: String(formData.get("strategyType") ?? ""),
  body: String(formData.get("body") ?? ""),
  stepsInput: String(formData.get("stepsInput") ?? ""),
  isPublished: String(formData.get("isPublished") ?? ""),
});

export async function createUserBuildAction(
  prevState: BuildActionState,
  formData: FormData
): Promise<BuildActionState> {
  const user = await requireSessionUser();
  const fields = extractRawFields(formData);
  const errorKey = (prevState.errorKey ?? 0) + 1;

  let input: ReturnType<typeof formDataToAdminBuildInput>;
  try {
    input = formDataToAdminBuildInput(formData);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Invalid build steps format.";
    return { status: "validation-error", fields, errorMessage, errorKey };
  }

  const slug = await toUniqueSlug(slugify(input.title));
  const isPublished = formData.get("publishMode") === "publish";
  const parsed = adminBuildSchema.safeParse({ ...input, slug, isPublished });

  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((i) => i.path.join("."))
      .filter(Boolean)
      .join(",");
    return { status: "validation-error", fields, missingFields: missing, errorKey };
  }

  let build;
  try {
    build = await createBuild({
      ...parsed.data,
      createdByUserId: user.id,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("slug") || msg.includes("unique") || msg.includes("duplicate")) {
      return { status: "validation-error", fields, errorMessage: "That URL identifier (slug) is already taken. Choose a different one.", errorKey };
    }
    return { status: "server-error", fields, errorKey };
  }

  if (!build) {
    return { status: "server-error", fields, errorKey };
  }

  revalidatePath("/builds");
  revalidatePath("/builds/my-builds");
  redirect(isPublished ? "/builds/my-builds?status=published" : "/builds/my-builds?status=draft");
}

export async function updateUserBuildAction(
  prevState: BuildActionState,
  formData: FormData
): Promise<BuildActionState> {
  const user = await requireSessionUser();
  const fields = extractRawFields(formData);
  const errorKey = (prevState.errorKey ?? 0) + 1;
  const buildId = Number.parseInt(String(formData.get("buildId") ?? ""), 10);

  if (!Number.isFinite(buildId) || buildId < 1) {
    return { status: "server-error", fields, errorKey };
  }

  const existing = await getUserBuildById(user.id, buildId);
  if (!existing) return { status: "server-error", fields, errorKey };

  let input: ReturnType<typeof formDataToAdminBuildInput>;
  try {
    input = formDataToAdminBuildInput(formData);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Invalid build steps format.";
    return { status: "validation-error", fields, errorMessage, errorKey };
  }

  const isPublished = formData.get("isPublished") === "on";
  const parsed = adminBuildSchema.safeParse({ ...input, slug: existing.slug, isPublished });

  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((i) => i.path.join("."))
      .filter(Boolean)
      .join(",");
    return { status: "validation-error", fields, missingFields: missing, errorKey };
  }

  try {
    await updateBuild(buildId, parsed.data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("slug") || msg.includes("unique") || msg.includes("duplicate")) {
      return { status: "validation-error", fields, errorMessage: "That URL identifier (slug) is already taken. Choose a different one.", errorKey };
    }
    return { status: "server-error", fields, errorKey };
  }

  revalidatePath("/builds");
  revalidatePath("/builds/my-builds");
  redirect("/builds/my-builds?status=updated");
}

export async function deleteUserBuildAction(formData: FormData) {
  const user = await requireSessionUser();
  const buildId = Number.parseInt(String(formData.get("buildId") ?? ""), 10);

  if (!Number.isFinite(buildId) || buildId < 1) {
    throw new Error("Invalid build id.");
  }

  await deleteBuildForUser(user.id, buildId);
  revalidatePath("/builds");
  revalidatePath("/builds/my-builds");
  redirect("/builds/my-builds?status=removed");
}
