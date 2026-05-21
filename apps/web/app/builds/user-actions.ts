"use server";

import { createBuild } from "@warcraft3-guide-hub/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSessionUser } from "../../lib/auth";
import { formDataToAdminBuildInput } from "../../lib/admin-forms";
import { deleteBuildForUser } from "../../lib/content";
import { adminBuildSchema } from "../../lib/validation";

export async function createUserBuildAction(formData: FormData) {
  const user = await requireSessionUser();
  const input = formDataToAdminBuildInput(formData);
  const parsed = adminBuildSchema.safeParse({
    ...input,
    isPublished: false,
  });

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
  redirect("/builds/submit?status=submitted");
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
