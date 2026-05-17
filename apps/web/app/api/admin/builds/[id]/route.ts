import { NextResponse } from "next/server";
import { deleteBuild, updateBuild } from "@warcraft3-guide-hub/db";
import { requireAdminApiAccess } from "../../../../../lib/admin";
import { adminBuildSchema } from "../../../../../lib/validation";

type Props = {
  params: Promise<{ id: string }>;
};

const parseId = async (params: Props["params"]) => {
  const { id } = await params;
  const parsedId = Number.parseInt(id, 10);
  return Number.isFinite(parsedId) && parsedId > 0 ? parsedId : null;
};

export async function PUT(request: Request, { params }: Props) {
  const access = await requireAdminApiAccess(request);

  if (!access.ok) {
    return access.response;
  }

  const id = await parseId(params);

  if (!id) {
    return NextResponse.json({ error: "Invalid build id." }, { status: 400 });
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
    const build = await updateBuild(id, parsed.data);

    if (!build) {
      return NextResponse.json({ error: "Build not found." }, { status: 404 });
    }

    return NextResponse.json({ data: build });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Build update failed." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request, { params }: Props) {
  const access = await requireAdminApiAccess(request);

  if (!access.ok) {
    return access.response;
  }

  const id = await parseId(params);

  if (!id) {
    return NextResponse.json({ error: "Invalid build id." }, { status: 400 });
  }

  const removed = await deleteBuild(id);

  if (!removed) {
    return NextResponse.json({ error: "Build not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
