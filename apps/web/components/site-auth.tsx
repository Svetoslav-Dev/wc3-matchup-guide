import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { AuthModalLauncher } from "./auth-modal-launcher";
import { getSessionUser } from "../lib/auth";
import { logoutAction } from "../app/auth-actions";

export async function SiteAuth() {
  const user = await getSessionUser();

  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return <span className="muted">Auth offline</span>;
  }

  if (!user) {
    return <AuthModalLauncher />;
  }

  return (
    <div className="inline-actions">
      <span className="muted">
        Signed in as <strong>{user.username}</strong>
      </span>
      <form action={logoutAction}>
        <button className="button button--ghost" type="submit">
          Log Out
        </button>
      </form>
    </div>
  );
}
