"use server";

import { createBuild, updateBuild } from "@warcraft3-guide-hub/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSessionUser } from "../../lib/auth";
import { formDataToAdminBuildInput } from "../../lib/admin-forms";
import { deleteBuildForUser, getUserBuildById } from "../../lib/content";
import { adminBuildSchema } from "../../lib/validation";

export async function createUserBuildAction(formData: FormData) {
  const user = await requireSessionUser();
  let input: ReturnType<typeof formDataToAdminBuildInput>;
  try {
    input = formDataToAdminBuildInput(formData);
  } catch {
    redirect("/builds/submit?status=validation-error&fields=stepsInput");
  }

  const isPublished = formData.get("publishMode") === "publish";
  const parsed = adminBuildSchema.safeParse({ ...input, isPublished });

  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((i) => i.path.join("."))
      .filter(Boolean)
      .join(", ");
    redirect(`/builds/submit?status=validation-error&fields=${encodeURIComponent(missing)}`);
  }

  const build = await createBuild({
    ...parsed.data,
    createdByUserId: user.id,
  });

  if (!build) {
    redirect("/builds/submit?status=server-error");
  }

  revalidatePath("/builds");
  revalidatePath("/builds/submit");
  redirect(`/builds/submit?status=submitted&newBuildId=${build.id}`);
}

export async function updateUserBuildAction(formData: FormData) {
  const user = await requireSessionUser();
  const buildId = Number.parseInt(String(formData.get("buildId") ?? ""), 10);

  if (!Number.isFinite(buildId) || buildId < 1) {
    redirect("/builds/submit?status=server-error");
  }

  const existing = await getUserBuildById(user.id, buildId);
  if (!existing) redirect("/builds/submit?status=server-error");

  let input: ReturnType<typeof formDataToAdminBuildInput>;
  try {
    input = formDataToAdminBuildInput(formData);
  } catch {
    redirect(`/builds/submit?edit=${buildId}&status=validation-error&fields=stepsInput`);
  }

  const isPublished = formData.get("publishMode") === "publish" || existing.isPublished;
  const parsed = adminBuildSchema.safeParse({ ...input, isPublished });

  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((i) => i.path.join("."))
      .filter(Boolean)
      .join(", ");
    redirect(`/builds/submit?edit=${buildId}&status=validation-error&fields=${encodeURIComponent(missing)}`);
  }

  await updateBuild(buildId, parsed.data);
  revalidatePath("/builds");
  revalidatePath("/builds/submit");
  redirect("/builds/submit?status=updated");
}

export async function deleteUserBuildAction(formData: FormData) {
  const user = await requireSessionUser();
  const buildId = Number.parseInt(String(formData.get("buildId") ?? ""), 10);

  if (!Number.isFinite(buildId) || buildId < 1) {
    throw new Error("Invalid build id.");
  }

  await deleteBuildForUser(user.id, buildId);
  revalidatePath("/builds");
  revalidatePath("/builds/submit");
  redirect("/builds/submit?status=removed");
}
