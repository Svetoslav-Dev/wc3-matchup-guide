import { NextResponse } from "next/server";
import { createUnit } from "@warcraft3-guide-hub/db";
import { requireAdminApiAccess } from "../../../../lib/admin";
import { adminUnitSchema } from "../../../../lib/validation";

export async function POST(request: Request) {
  const access = await requireAdminApiAccess(request);

  if (!access.ok) {
    return access.response;
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
    const unit = await createUnit(parsed.data);
    return NextResponse.json({ data: unit }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unit creation failed." },
      { status: 400 },
    );
  }
}
