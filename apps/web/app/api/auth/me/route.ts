import { NextResponse } from "next/server";
import { getRequestSessionUser } from "../../../../lib/auth";

export async function GET(request: Request) {
  const user = await getRequestSessionUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ data: user });
}
