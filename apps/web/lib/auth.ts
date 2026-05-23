import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import type { AuthUser, UserRole } from "@warcraft3-guide-hub/shared";
import { createUser, findUserByEmail, findUserById, findUserByUsername, sanitizeUser } from "@warcraft3-guide-hub/db";

const AUTH_COOKIE_NAME = "wc3_auth";
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

type AuthTokenPayload = {
  sub: string;
  role: UserRole;
  email: string;
  username: string;
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not set.");
  }

  return new TextEncoder().encode(secret);
};

export const authCookieName = AUTH_COOKIE_NAME;

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const verifyPassword = (password: string, passwordHash: string) => bcrypt.compare(password, passwordHash);

export const signAuthToken = async (user: AuthUser) =>
  new SignJWT({
    role: user.role,
    email: user.email,
    username: user.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${ONE_WEEK_IN_SECONDS}s`)
    .sign(getJwtSecret());

export const verifyAuthToken = async (token: string) => {
  const { payload } = await jwtVerify<AuthTokenPayload>(token, getJwtSecret());

  return {
    id: Number.parseInt(payload.sub, 10),
    email: payload.email,
    username: payload.username,
    role: payload.role,
  } satisfies AuthUser;
};

const getBearerToken = (request: Request) => {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
};

export const appendAuthCookie = async (response: NextResponse, user: AuthUser) => {
  const token = await signAuthToken(user);

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_WEEK_IN_SECONDS,
  });
};

export const clearAuthCookie = (response: NextResponse) => {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
};

export const setAuthCookie = async (user: AuthUser) => {
  const token = await signAuthToken(user);

  (await cookies()).set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_WEEK_IN_SECONDS,
  });
};

export const removeAuthCookie = async () => {
  (await cookies()).set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
};

export const authRuntimeReady = () => hasDatabaseUrl() && Boolean(process.env.JWT_SECRET);

export const getSessionUser = async () => {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
};

export const getRequestSessionUser = async (request: Request) => {
  if (!process.env.JWT_SECRET) {
    return null;
  }

  const bearerToken = getBearerToken(request);
  const cookieToken = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`))
    ?.split("=")[1];
  const token = bearerToken ?? cookieToken ?? null;

  if (!token) {
    return null;
  }

  try {
    const session = await verifyAuthToken(token);
    const user = await findUserById(session.id);

    return user ? sanitizeUser(user) : null;
  } catch {
    return null;
  }
};

export const requireSessionUser = async () => {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
};

export const requireRequestSessionUser = async (request: Request) => {
  const user = await getRequestSessionUser(request);

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
};

export const requireRole = async (role: UserRole) => {
  const user = await requireSessionUser();

  if (user.role !== role) {
    throw new Error("Forbidden");
  }

  return user;
};

export const requireRequestRole = async (request: Request, role: UserRole) => {
  const user = await requireRequestSessionUser(request);

  if (user.role !== role) {
    throw new Error("Forbidden");
  }

  return user;
};

export const registerUser = async (input: {
  email: string;
  username: string;
  password: string;
}) => {
  const email = input.email.trim().toLowerCase();
  const username = input.username.trim();

  const [existingEmail, existingUsername] = await Promise.all([
    findUserByEmail(email),
    findUserByUsername(username),
  ]);

  if (existingEmail) {
    throw new Error("Email is already registered.");
  }

  if (existingUsername) {
    throw new Error("Username is already taken.");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await createUser({
    email,
    username,
    passwordHash,
    role: "user",
  });

  return sanitizeUser(user);
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email.trim().toLowerCase());

  if (!user) {
    return null;
  }

  const validPassword = await verifyPassword(password, user.passwordHash);

  if (!validPassword) {
    return null;
  }

  return sanitizeUser(user);
};
