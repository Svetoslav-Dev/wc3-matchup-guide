"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { loginAction, registerAction } from "../app/auth-actions";

const loginErrorMessages: Record<string, string> = {
  config: "Authentication is unavailable until DATABASE_URL and JWT_SECRET are configured.",
  invalid: "Enter a valid email and password.",
  credentials: "The email or password is incorrect.",
};

const loginStatusMessages: Record<string, string> = {
  "logged-in": "Login successful.",
  "logged-out": "You have been logged out.",
};

const registerErrorMessages: Record<string, string> = {
  config: "Registration is unavailable until DATABASE_URL and JWT_SECRET are configured.",
  invalid: "Enter a valid username, email, and password.",
  mismatch: "Passwords do not match.",
  email: "That email is already registered.",
  username: "That username is already taken.",
  unknown: "Registration failed.",
};

const registerStatusMessages: Record<string, string> = {
  created: "Account created and signed in.",
};

const buildHref = (pathname: string, searchParams: URLSearchParams, auth: "login" | "register" | null) => {
  const params = new URLSearchParams(searchParams.toString());

  params.delete("auth");
  params.delete("error");
  params.delete("status");

  if (auth) {
    params.set("auth", auth);
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

const getReturnTo = (pathname: string, searchParams: URLSearchParams) => buildHref(pathname, searchParams, null);

export function AuthModalLauncher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const authMode = searchParams.get("auth");
  const error = searchParams.get("error");
  const status = searchParams.get("status");
  const isLoginOpen = authMode === "login";
  const isRegisterOpen = authMode === "register";
  const closeHref = buildHref(pathname, searchParams, null);
  const returnTo = getReturnTo(pathname, searchParams);

  const title = isRegisterOpen ? "Create Account" : "Login";
  const intro = isRegisterOpen
    ? "Create an account and track your preferred openings."
    : "Log in to save builds and manage content.";

  const message = isRegisterOpen
    ? (status ? registerStatusMessages[status] : undefined) ?? (error ? registerErrorMessages[error] : undefined)
    : (status ? loginStatusMessages[status] : undefined) ?? (error ? loginErrorMessages[error] : undefined);
  const isError = Boolean(error);
  const isLoggedOut = status === "logged-out";

  return (
    <>
      <div className="auth-trigger">
        <Link href={buildHref(pathname, searchParams, "login")} className="button button--ghost">
          Log In
        </Link>
        <Link href={buildHref(pathname, searchParams, "register")} className="button button--ghost">
          Register
        </Link>
      </div>
      {isLoginOpen || isRegisterOpen ? (
        <div className="modal-backdrop" role="presentation">
          <Link href={closeHref} className="modal-backdrop__scrim" aria-label="Close authentication dialog" />
          <section className="form-panel auth-modal auth-modal--overlay" aria-modal="true" role="dialog" aria-label={title}>
            <div className="auth-modal__bar">
              <p className="section-label">{isRegisterOpen ? "Registration" : "Authentication"}</p>
              <Link href={closeHref} className="button button--ghost auth-modal__close">
                Close
              </Link>
            </div>
            <div className="section-head auth-modal__head">
              <h1>{title}</h1>
              <p className="page-intro">{intro}</p>
            </div>
            {message ? (
              <p className={`status-banner${isError || isLoggedOut ? " status-banner--error" : ""}`}>
                {message}
              </p>
            ) : null}
            {isRegisterOpen ? (
              <form action={registerAction} className="page-stack">
                <input type="hidden" name="returnTo" value={returnTo} />
                <input type="hidden" name="authMode" value="register" />
                <div className="field">
                  <label htmlFor="modal-username">Username</label>
                  <input id="modal-username" name="username" type="text" placeholder="BlademasterMain" />
                </div>
                <div className="field">
                  <label htmlFor="modal-register-email">Email</label>
                  <input
                    id="modal-register-email"
                    name="email"
                    type="email"
                    placeholder="moonwellmanager@azeroth.gg"
                  />
                </div>
                <div className="field">
                  <label htmlFor="modal-register-password">Password</label>
                  <input
                    id="modal-register-password"
                    name="password"
                    type="password"
                    placeholder="NoMoreMilitiaCalls"
                  />
                </div>
                <div className="field">
                  <label htmlFor="modal-confirm-password">Confirm Password</label>
                  <input
                    id="modal-confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="NoMoreMilitiaCalls"
                  />
                </div>
                <button className="button" type="submit">
                  Create Account
                </button>
              </form>
            ) : (
              <form action={loginAction} className="page-stack">
                <input type="hidden" name="returnTo" value={returnTo} />
                <input type="hidden" name="authMode" value="login" />
                <div className="field">
                  <label htmlFor="modal-login-email">Email</label>
                  <input
                    id="modal-login-email"
                    name="email"
                    type="email"
                    placeholder="blademastermain@azeroth.gg"
                  />
                </div>
                <div className="field">
                  <label htmlFor="modal-login-password">Password</label>
                  <input
                    id="modal-login-password"
                    name="password"
                    type="password"
                    placeholder="GruntTaxAgain"
                  />
                </div>
                <button className="button" type="submit">
                  Log In
                </button>
              </form>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
