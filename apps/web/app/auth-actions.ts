"use server";

import { redirect } from "next/navigation";
import { authenticateUser, authRuntimeReady, registerUser, removeAuthCookie, setAuthCookie } from "../lib/auth";
import { loginSchema, registerSchema } from "../lib/validation";

const normalizeReturnTo = (value: FormDataEntryValue | null) => {
  const raw = String(value ?? "").trim();

  if (!raw.startsWith("/")) {
    return "/";
  }

  return raw;
};

const withStatus = (returnTo: string, params: Record<string, string | undefined>) => {
  const [path, query = ""] = returnTo.split("?");
  const searchParams = new URLSearchParams(query);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
  });

  const nextQuery = searchParams.toString();
  return nextQuery ? `${path}?${nextQuery}` : path;
};

export async function loginAction(formData: FormData) {
  const returnTo = normalizeReturnTo(formData.get("returnTo"));
  const authMode = String(formData.get("authMode") ?? "login");

  if (!authRuntimeReady()) {
    redirect(withStatus(returnTo, { auth: authMode, error: "config", status: undefined }));
  }

  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    redirect(withStatus(returnTo, { auth: authMode, error: "invalid", status: undefined }));
  }

  const user = await authenticateUser(parsed.data.email, parsed.data.password);

  if (!user) {
    redirect(withStatus(returnTo, { auth: authMode, error: "credentials", status: undefined }));
  }

  await setAuthCookie(user);
  redirect(withStatus(returnTo, { auth: undefined, error: undefined, status: "logged-in" }));
}

export async function registerAction(formData: FormData) {
  const returnTo = normalizeReturnTo(formData.get("returnTo"));
  const authMode = String(formData.get("authMode") ?? "register");

  if (!authRuntimeReady()) {
    redirect(withStatus(returnTo, { auth: authMode, error: "config", status: undefined }));
  }

  const parsed = registerSchema.safeParse({
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    redirect(withStatus(returnTo, { auth: authMode, error: "invalid", status: undefined }));
  }

  try {
    const user = await registerUser(parsed.data);
    await setAuthCookie(user);
    redirect(withStatus(returnTo, { auth: undefined, error: undefined, status: "created" }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";

    if (message.includes("Email")) {
      redirect(withStatus(returnTo, { auth: authMode, error: "email", status: undefined }));
    }

    if (message.includes("Username")) {
      redirect(withStatus(returnTo, { auth: authMode, error: "username", status: undefined }));
    }

    redirect(withStatus(returnTo, { auth: authMode, error: "unknown", status: undefined }));
  }
}

export async function logoutAction() {
  await removeAuthCookie();
  redirect("/login?status=logged-out");
}
