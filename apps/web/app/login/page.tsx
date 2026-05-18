import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../lib/auth";
import { loginAction } from "../auth-actions";

const errorMessages: Record<string, string> = {
  config: "Authentication is unavailable until DATABASE_URL and JWT_SECRET are configured.",
  invalid: "Enter a valid email and password.",
  credentials: "The email or password is incorrect.",
};

const statusMessages: Record<string, string> = {
  "logged-in": "Login successful.",
  "logged-out": "You have been logged out.",
};

type Props = {
  searchParams?: Promise<{ error?: string; status?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const [user, params] = await Promise.all([getSessionUser(), searchParams]);
  const errorMessage = params?.error ? errorMessages[params.error] : undefined;
  const statusMessage = params?.status ? statusMessages[params.status] : undefined;

  return (
    <div className="page-shell auth-shell">
      <section className="form-panel auth-modal">
        <div className="section-head auth-modal__head">
          <p className="section-label">Authentication</p>
          <h1>Login</h1>
          <p className="page-intro">Log in to save builds and manage content.</p>
        </div>
        {statusMessage ? <p className="status-banner">{statusMessage}</p> : null}
        {errorMessage ? <p className="status-banner">{errorMessage}</p> : null}
        {user ? <p className="muted">Current session: {user.email} ({user.role})</p> : null}
        <form action={loginAction} className="page-stack">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="blademastermain@azeroth.gg" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="GruntTaxAgain" />
          </div>
          <button className="button" type="submit" disabled={!hasDatabaseUrl() || !process.env.JWT_SECRET}>
            Log In
          </button>
        </form>
      </section>
      <div className="auth-note">
        <p>Successful login sets the same JWT-backed HTTP-only cookie used by favorites and admin protections.</p>
        <p>Demo accounts work once migrations and seed data are applied to a real PostgreSQL database.</p>
      </div>
    </div>
  );
}
