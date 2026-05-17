import { NextResponse } from "next/server";
import { createBuild } from "@warcraft3-guide-hub/db";
import { requireAdminApiAccess } from "../../../../lib/admin";
import { adminBuildSchema } from "../../../../lib/validation";

export async function POST(request: Request) {
  const access = await requireAdminApiAccess(request);

  if (!access.ok) {
    return access.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = adminBuildSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const build = await createBuild({
      ...parsed.data,
      createdByUserId: access.user.id,
    });

    return NextResponse.json({ data: build }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Build creation failed." },
      { status: 400 },
    );
  }
}
