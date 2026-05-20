import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { AuthModalLauncher } from "./auth-modal-launcher";
import { UserMenu } from "./user-menu";
import { getSessionUser } from "../lib/auth";

export async function SiteAuth() {
  const user = await getSessionUser();

  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return <span className="muted">Auth offline</span>;
  }

  if (!user) {
    return <AuthModalLauncher />;
  }

  return <UserMenu username={user.username} />;
}
