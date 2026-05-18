import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../lib/auth";
import { registerAction } from "../auth-actions";

const errorMessages: Record<string, string> = {
  config: "Registration is unavailable until DATABASE_URL and JWT_SECRET are configured.",
  invalid: "Enter a valid username, email, and password.",
  email: "That email is already registered.",
  username: "That username is already taken.",
  unknown: "Registration failed.",
};

const statusMessages: Record<string, string> = {
  created: "Account created and signed in.",
};

type Props = {
  searchParams?: Promise<{ error?: string; status?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const [user, params] = await Promise.all([getSessionUser(), searchParams]);
  const errorMessage = params?.error ? errorMessages[params.error] : undefined;
  const statusMessage = params?.status ? statusMessages[params.status] : undefined;

  return (
    <div className="page-shell auth-shell">
      <section className="form-panel auth-modal">
        <div className="section-head auth-modal__head">
          <p className="section-label">Registration</p>
          <h1>Create Account</h1>
          <p className="page-intro">Create an account and track your preferred openings.</p>
        </div>
        {statusMessage ? <p className="status-banner">{statusMessage}</p> : null}
        {errorMessage ? <p className="status-banner">{errorMessage}</p> : null}
        {user ? <p className="muted">Current session: {user.email} ({user.role})</p> : null}
        <form action={registerAction} className="page-stack">
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" type="text" placeholder="BlademasterMain" />
          </div>
          <div className="field">
            <label htmlFor="register-email">Email</label>
            <input id="register-email" name="email" type="email" placeholder="moonwellmanager@azeroth.gg" />
          </div>
          <div className="field">
            <label htmlFor="register-password">Password</label>
            <input id="register-password" name="password" type="password" placeholder="NoMoreMilitiaCalls" />
          </div>
          <button className="button" type="submit" disabled={!hasDatabaseUrl() || !process.env.JWT_SECRET}>
            Create Account
          </button>
        </form>
      </section>
      <div className="auth-note">
        <p>Registration enforces unique email and username checks, hashes passwords, and issues a session cookie immediately.</p>
        <p>Role defaults remain <code>user</code> unless changed by an admin-side workflow later.</p>
      </div>
    </div>
  );
}
