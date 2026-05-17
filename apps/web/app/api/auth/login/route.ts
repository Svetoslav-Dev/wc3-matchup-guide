import { NextResponse } from "next/server";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { appendAuthCookie, authenticateUser, signAuthToken } from "../../../../lib/auth";
import { loginSchema } from "../../../../lib/validation";

export async function POST(request: Request) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return NextResponse.json(
      { error: "Authentication requires DATABASE_URL and JWT_SECRET." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const user = await authenticateUser(parsed.data.email, parsed.data.password);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = await signAuthToken(user);
  const response = NextResponse.json({ data: user, token });
  await appendAuthCookie(response, user);
  response.headers.set("cache-control", "no-store");
  return response;
}
