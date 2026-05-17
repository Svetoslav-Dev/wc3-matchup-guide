import { NextResponse } from "next/server";
import { deleteUnit, updateUnit } from "@warcraft3-guide-hub/db";
import { requireAdminApiAccess } from "../../../../../lib/admin";
import { adminUnitSchema } from "../../../../../lib/validation";

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
    return NextResponse.json({ error: "Invalid unit id." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = adminUnitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const unit = await updateUnit(id, parsed.data);

    if (!unit) {
      return NextResponse.json({ error: "Unit not found." }, { status: 404 });
    }

    return NextResponse.json({ data: unit });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unit update failed." },
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
    return NextResponse.json({ error: "Invalid unit id." }, { status: 400 });
  }

  const removed = await deleteUnit(id);

  if (!removed) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
