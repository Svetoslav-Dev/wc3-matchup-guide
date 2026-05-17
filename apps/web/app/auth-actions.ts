"use server";

import { redirect } from "next/navigation";
import { authenticateUser, authRuntimeReady, registerUser, removeAuthCookie, setAuthCookie } from "../lib/auth";
import { loginSchema, registerSchema } from "../lib/validation";

export async function loginAction(formData: FormData) {
  if (!authRuntimeReady()) {
    redirect("/login?error=config");
  }

  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    redirect("/login?error=invalid");
  }

  const user = await authenticateUser(parsed.data.email, parsed.data.password);

  if (!user) {
    redirect("/login?error=credentials");
  }

  await setAuthCookie(user);
  redirect("/login?status=logged-in");
}

export async function registerAction(formData: FormData) {
  if (!authRuntimeReady()) {
    redirect("/register?error=config");
  }

  const parsed = registerSchema.safeParse({
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    redirect("/register?error=invalid");
  }

  try {
    const user = await registerUser(parsed.data);
    await setAuthCookie(user);
    redirect("/register?status=created");
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";

    if (message.includes("Email")) {
      redirect("/register?error=email");
    }

    if (message.includes("Username")) {
      redirect("/register?error=username");
    }

    redirect("/register?error=unknown");
  }
}

export async function logoutAction() {
  await removeAuthCookie();
  redirect("/login?status=logged-out");
}

