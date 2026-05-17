import { NextResponse } from "next/server";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { appendAuthCookie, registerUser, signAuthToken } from "../../../../lib/auth";
import { registerSchema } from "../../../../lib/validation";

export async function POST(request: Request) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return NextResponse.json(
      { error: "Authentication requires DATABASE_URL and JWT_SECRET." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const user = await registerUser(parsed.data);
    const token = await signAuthToken(user);
    const response = NextResponse.json({ data: user, token }, { status: 201 });
    await appendAuthCookie(response, user);
    response.headers.set("cache-control", "no-store");
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed." },
      { status: 409 },
    );
  }
}
