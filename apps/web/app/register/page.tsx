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
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Registration</p>
        <h1 className="page-title">Create an account and track your preferred openings.</h1>
        <p className="page-intro">
          Registration now submits through a server action with server-side validation, uniqueness checks, and immediate session creation.
        </p>
      </div>
      {statusMessage ? <p className="status-banner">{statusMessage}</p> : null}
      {errorMessage ? <p className="status-banner">{errorMessage}</p> : null}
      <div className="form-grid">
        <section className="form-panel">
          <h2>Create Account</h2>
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
        <section className="form-panel">
          <h2>Live Flow</h2>
          <p>Registration enforces unique email and username checks, hashes passwords, and issues a session cookie immediately.</p>
          <p>Role defaults remain <code>user</code> unless changed by an admin-side workflow later.</p>
        </section>
      </div>
    </div>
  );
}
