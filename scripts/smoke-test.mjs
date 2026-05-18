import { existsSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from "dotenv";

const repoRoot = resolve(import.meta.dirname, "..");
const envFiles = [".env.local", ".env"];

for (const envFile of envFiles) {
  const envPath = resolve(repoRoot, envFile);

  if (existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}

const baseUrl = (process.env.SMOKE_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
const apiUrl = (process.env.SMOKE_API_URL ?? (baseUrl ? `${baseUrl}/api` : "")).replace(/\/$/, "");

const defaultAdminEmail = process.env.SMOKE_ADMIN_EMAIL ?? "admin@example.com";
const defaultAdminPassword = process.env.SMOKE_ADMIN_PASSWORD ?? "demo123";

const randomSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

class Session {
  #cookies = new Map();

  applyCookies(response) {
    const rawCookies =
      typeof response.headers.getSetCookie === "function"
        ? response.headers.getSetCookie()
        : [response.headers.get("set-cookie")].filter(Boolean);

    for (const rawCookie of rawCookies) {
      const [pair] = rawCookie.split(";");
      const separatorIndex = pair.indexOf("=");

      if (separatorIndex <= 0) {
        continue;
      }

      const name = pair.slice(0, separatorIndex).trim();
      const value = pair.slice(separatorIndex + 1).trim();

      if (!value) {
        this.#cookies.delete(name);
      } else {
        this.#cookies.set(name, value);
      }
    }
  }

  header() {
    if (this.#cookies.size === 0) {
      return undefined;
    }

    return Array.from(this.#cookies.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  }
}

const results = [];

const addResult = (label, ok, detail) => {
  results.push({ label, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${detail}`);
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const requestJson = async (path, options = {}, session) => {
  const headers = new Headers(options.headers ?? {});

  if (options.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const cookie = session?.header();

  if (cookie) {
    headers.set("cookie", cookie);
  }

  const response = await fetch(`${path.startsWith("http") ? path : `${apiUrl}${path}`}`, {
    ...options,
    headers,
    body: typeof options.body === "string" ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  });

  session?.applyCookies(response);

  let json = null;

  try {
    json = await response.json();
  } catch {
    json = null;
  }

  return { response, json };
};

const requestText = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  return { response, text };
};

const testPublicSurface = async () => {
  const { response: homeResponse, text: homeHtml } = await requestText(baseUrl);
  assert(homeResponse.ok, `Expected home page 200, got ${homeResponse.status}.`);
  assert(homeHtml.includes("Warcraft"), "Expected home page HTML to contain project content.");
  addResult("Home page", true, "Rendered successfully.");

  const health = await requestJson("/health");
  assert(health.response.ok, `Expected /api/health 200, got ${health.response.status}.`);
  assert(health.json?.status === "ok", `Expected health status ok, got ${health.json?.status ?? "missing"}.`);
  assert(health.json?.readiness?.databaseConfigured === true, "Expected databaseConfigured=true.");
  assert(health.json?.readiness?.databaseReachable === true, "Expected databaseReachable=true.");
  assert(health.json?.readiness?.authConfigured === true, "Expected authConfigured=true.");
  addResult("Health endpoint", true, "Readiness flags are healthy.");

  const publicEndpoints = [
    ["/races", (json) => Array.isArray(json?.data) && json.data.length > 0],
    ["/races/orc", (json) => json?.data?.slug === "orc"],
    ["/heroes", (json) => Array.isArray(json?.data) && json.data.length > 0],
    ["/heroes/blademaster", (json) => json?.data?.slug === "blademaster"],
    ["/matchups", (json) => Array.isArray(json?.data) && json.data.length > 0],
    ["/matchups/orc-vs-human", (json) => json?.data?.slug === "orc-vs-human"],
    ["/builds?page=1&pageSize=5&race=orc", (json) => json?.page === 1 && json?.pageSize === 5 && Array.isArray(json?.data)],
    ["/builds/orc-grunt-raider-shadow-hunter", (json) => json?.data?.slug === "orc-grunt-raider-shadow-hunter"],
    ["/units", (json) => Array.isArray(json?.data) && json.data.length > 0],
    ["/maps", (json) => Array.isArray(json?.data) && json.data.length > 0],
  ];

  for (const [endpoint, validator] of publicEndpoints) {
    const result = await requestJson(endpoint);
    assert(result.response.ok, `Expected ${endpoint} 200, got ${result.response.status}.`);
    assert(validator(result.json), `Unexpected JSON shape for ${endpoint}.`);
  }

  addResult("Public API", true, "Core list/detail endpoints returned expected data.");
};

const testUserFlow = async () => {
  const user = new Session();
  const email = `smoke-${randomSuffix}@example.com`;
  const username = `smoke-${randomSuffix}`;
  const password = "demo123";

  const register = await requestJson(
    "/auth/register",
    {
      method: "POST",
      body: { email, username, password },
    },
    user,
  );

  assert(register.response.status === 201, `Expected register 201, got ${register.response.status}.`);
  assert(register.json?.data?.email === email, "Registered user email mismatch.");
  addResult("Register", true, "Created a new user and received a session.");

  const meAfterRegister = await requestJson("/auth/me", {}, user);
  assert(meAfterRegister.response.ok, `Expected /auth/me 200, got ${meAfterRegister.response.status}.`);
  assert(meAfterRegister.json?.data?.email === email, "Expected session user after registration.");
  addResult("Auth session", true, "Session cookie worked after registration.");

  const addFavorite = await requestJson(
    "/me/favorites",
    {
      method: "POST",
      body: { buildSlug: "orc-grunt-raider-shadow-hunter" },
    },
    user,
  );

  assert(addFavorite.response.status === 201, `Expected favorite create 201, got ${addFavorite.response.status}.`);
  const favoriteId = addFavorite.json?.data?.id;
  assert(typeof favoriteId === "number", "Expected favorite id from create response.");

  const listFavorites = await requestJson("/me/favorites", {}, user);
  assert(listFavorites.response.ok, `Expected favorites list 200, got ${listFavorites.response.status}.`);
  assert(
    Array.isArray(listFavorites.json?.data) &&
      listFavorites.json.data.some((favorite) => favorite.id === favoriteId),
    "Expected created favorite in favorites list.",
  );
  addResult("Favorites", true, "Create and list favorites worked.");

  const removeFavorite = await requestJson(`/me/favorites/${favoriteId}`, { method: "DELETE" }, user);
  assert(removeFavorite.response.ok, `Expected favorite delete 200, got ${removeFavorite.response.status}.`);
  addResult("Favorite removal", true, "Favorite deletion worked.");

  const logout = await requestJson("/auth/logout", { method: "POST" }, user);
  assert(logout.response.ok, `Expected logout 200, got ${logout.response.status}.`);

  const meAfterLogout = await requestJson("/auth/me", {}, user);
  assert(meAfterLogout.response.status === 401, `Expected /auth/me 401 after logout, got ${meAfterLogout.response.status}.`);
  addResult("Logout", true, "Logout cleared the session.");

  const login = await requestJson(
    "/auth/login",
    {
      method: "POST",
      body: { email, password },
    },
    user,
  );

  assert(login.response.ok, `Expected login 200, got ${login.response.status}.`);
  assert(login.json?.data?.email === email, "Expected login response for created user.");
  addResult("Login", true, "Created user could log back in.");

  const adminDenied = await requestJson(
    "/admin/builds",
    {
      method: "POST",
      body: {
        raceSlug: "orc",
        matchupSlug: "orc-vs-human",
        title: "Denied Build",
        slug: `denied-build-${randomSuffix}`,
        summary: "Permission check payload.",
        difficulty: "Intermediate",
        strategyType: "Timing",
        body: "This should be denied for a regular user.",
        isPublished: true,
        steps: [{ stepNumber: 1, supply: 10, timing: "0:35", instruction: "Queue peon" }],
      },
    },
    user,
  );

  assert(
    adminDenied.response.status === 401 || adminDenied.response.status === 403,
    `Expected admin denial 401/403, got ${adminDenied.response.status}.`,
  );
  addResult("Permission checks", true, "Regular user could not access admin mutation API.");
};

const testAdminFlow = async () => {
  const admin = new Session();

  const login = await requestJson(
    "/auth/login",
    {
      method: "POST",
      body: { email: defaultAdminEmail, password: defaultAdminPassword },
    },
    admin,
  );

  assert(login.response.ok, `Expected admin login 200, got ${login.response.status}.`);
  assert(login.json?.data?.role === "admin", "Expected admin role after admin login.");
  addResult("Admin login", true, "Demo admin credentials worked.");

  const buildSlug = `smoke-build-${randomSuffix}`;
  const matchupSlug = `smoke-matchup-${randomSuffix}`;

  const createBuildPayload = {
    raceSlug: "orc",
    matchupSlug: "orc-vs-human",
    title: "Smoke Test Build",
    slug: buildSlug,
    summary: "Automated smoke test build.",
    difficulty: "Intermediate",
    strategyType: "Timing",
    body: "Create, update, and delete flow validation.",
    isPublished: true,
    steps: [
      { stepNumber: 1, supply: 10, timing: "0:35", instruction: "Queue peon" },
      { stepNumber: 2, supply: 20, timing: "2:15", instruction: "Tech to tier 2" },
    ],
  };

  const createBuild = await requestJson("/admin/builds", { method: "POST", body: createBuildPayload }, admin);
  assert(createBuild.response.status === 201, `Expected build create 201, got ${createBuild.response.status}.`);
  const buildId = createBuild.json?.data?.id;
  assert(typeof buildId === "number", "Expected build id from create response.");

  const updateBuild = await requestJson(
    `/admin/builds/${buildId}`,
    {
      method: "PUT",
      body: {
        ...createBuildPayload,
        title: "Smoke Test Build Updated",
      },
    },
    admin,
  );
  assert(updateBuild.response.ok, `Expected build update 200, got ${updateBuild.response.status}.`);

  const deleteBuild = await requestJson(`/admin/builds/${buildId}`, { method: "DELETE" }, admin);
  assert(deleteBuild.response.ok, `Expected build delete 200, got ${deleteBuild.response.status}.`);
  addResult("Admin build CRUD", true, "Create, update, and delete worked.");

  const createMatchupPayload = {
    raceASlug: "orc",
    raceBSlug: "human",
    title: "Smoke Test Matchup",
    slug: matchupSlug,
    summary: "Automated smoke test matchup.",
    difficulty: "Demanding",
    earlyGamePlan: "Scout and pressure.",
    midGamePlan: "Hit a timing before expansion stabilizes.",
    lateGamePlan: "Split map and punish bad positioning.",
    commonMistakes: ["Overcommitting to low-value harassment"],
  };

  const createMatchup = await requestJson(
    "/admin/matchups",
    { method: "POST", body: createMatchupPayload },
    admin,
  );
  assert(createMatchup.response.status === 201, `Expected matchup create 201, got ${createMatchup.response.status}.`);
  const matchupId = createMatchup.json?.data?.id;
  assert(typeof matchupId === "number", "Expected matchup id from create response.");

  const updateMatchup = await requestJson(
    `/admin/matchups/${matchupId}`,
    {
      method: "PUT",
      body: {
        ...createMatchupPayload,
        title: "Smoke Test Matchup Updated",
      },
    },
    admin,
  );
  assert(updateMatchup.response.ok, `Expected matchup update 200, got ${updateMatchup.response.status}.`);

  const deleteMatchup = await requestJson(`/admin/matchups/${matchupId}`, { method: "DELETE" }, admin);
  assert(deleteMatchup.response.ok, `Expected matchup delete 200, got ${deleteMatchup.response.status}.`);
  addResult("Admin matchup CRUD", true, "Create, update, and delete worked.");
};

const main = async () => {
  if (!baseUrl || !apiUrl) {
    console.error("Missing SMOKE_BASE_URL or NEXT_PUBLIC_APP_URL, and SMOKE_API_URL could not be derived.");
    process.exit(1);
  }

  console.log("\nWC3 Matchup Guide smoke test\n");
  console.log(`Base URL: ${baseUrl}`);
  console.log(`API URL: ${apiUrl}\n`);

  try {
    await testPublicSurface();
    await testUserFlow();
    await testAdminFlow();
  } catch (error) {
    addResult("Smoke test", false, error instanceof Error ? error.message : "Unexpected failure.");
  }

  const failed = results.filter((result) => !result.ok);
  console.log("");

  if (failed.length > 0) {
    console.log(`Smoke test failed with ${failed.length} issue(s).`);
    process.exit(1);
  }

  console.log("Smoke test passed.");
};

main().catch((error) => {
  console.error("Smoke test crashed.", error);
  process.exit(1);
});
