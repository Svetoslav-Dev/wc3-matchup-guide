import type { AuthUser } from "@warcraft3-guide-hub/shared";

declare global {
  var __wc3TestSessionUser: AuthUser | null | undefined;
}

export const setTestSessionUser = (user: AuthUser | null): void => {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Test session overrides are only available in NODE_ENV=test.");
  }
  globalThis.__wc3TestSessionUser = user;
};
