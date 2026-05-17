import { NextResponse } from "next/server";
import { deleteRace, updateRace } from "@warcraft3-guide-hub/db";
import { requireAdminApiAccess } from "../../../../../lib/admin";
import { adminRaceSchema } from "../../../../../lib/validation";

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
    return NextResponse.json({ error: "Invalid race id." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = adminRaceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const race = await updateRace(id, parsed.data);

    if (!race) {
      return NextResponse.json({ error: "Race not found." }, { status: 404 });
    }

    return NextResponse.json({ data: race });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Race update failed." },
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
    return NextResponse.json({ error: "Invalid race id." }, { status: 400 });
  }

  const removed = await deleteRace(id);

  if (!removed) {
    return NextResponse.json({ error: "Race not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
