import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const repoRoot = resolve(import.meta.dirname, "..");
const expoHome = resolve(repoRoot, ".expo-home");
const mobileDir = resolve(repoRoot, "apps/mobile");
const appDir = resolve(mobileDir, "app");
const mobileNodeModules = resolve(mobileDir, "node_modules");
const repoNodeModules = resolve(repoRoot, "node_modules");
const mobileDistDir = resolve(mobileDir, "dist");
const requireFromMobile = createRequire(resolve(mobileDir, "package.json"));

mkdirSync(expoHome, { recursive: true });

const expoRouterPackageJson = requireFromMobile.resolve("expo-router/package.json");
const expoRouterDir = dirname(expoRouterPackageJson);
const routerAppRoot = relative(expoRouterDir, appDir).split("\\").join("/");
const normalizedRouterAppRoot = routerAppRoot.startsWith(".")
  ? routerAppRoot
  : `./${routerAppRoot}`;

const routerContextFiles = [
  "_ctx.js",
  "_ctx.web.js",
  "_ctx.ios.js",
  "_ctx.android.js",
  "_ctx-html.js",
];

const backups = [];

const writeStaticHostFiles = () => {
  const indexHtmlPath = resolve(mobileDistDir, "index.html");
  const notFoundHtmlPath = resolve(mobileDistDir, "+not-found.html");
  const fallbackHtml = readFileSync(indexHtmlPath, "utf8");
  const notFoundHtml = (() => {
    try {
      return readFileSync(notFoundHtmlPath, "utf8");
    } catch {
      return fallbackHtml;
    }
  })();

  writeFileSync(resolve(mobileDistDir, "_redirects"), "/* /index.html 200\n");
  writeFileSync(
    resolve(mobileDistDir, "_headers"),
    ["/_expo/static/*", "  Cache-Control: public, max-age=31536000, immutable", ""].join("\n"),
  );
  writeFileSync(resolve(mobileDistDir, "404.html"), notFoundHtml);
};

try {
  for (const file of routerContextFiles) {
    const filePath = resolve(expoRouterDir, file);
    const source = readFileSync(filePath, "utf8");
    backups.push({ filePath, source });
    writeFileSync(
      filePath,
      source
        .replaceAll("process.env.EXPO_ROUTER_APP_ROOT", JSON.stringify(normalizedRouterAppRoot))
        .replaceAll("process.env.EXPO_ROUTER_IMPORT_MODE", JSON.stringify("sync")),
    );
  }

  const result = spawnSync("npx", ["expo", "export", "--platform", "web"], {
    cwd: mobileDir,
    env: {
      ...process.env,
      HOME: expoHome,
      EXPO_NO_TELEMETRY: "1",
      EXPO_NO_METRO_WORKSPACE_ROOT: "1",
      NODE_PATH: [mobileNodeModules, repoNodeModules, process.env.NODE_PATH]
        .filter(Boolean)
        .join(":"),
    },
    stdio: "inherit",
  });

  if (typeof result.status === "number") {
    if (result.status === 0) {
      writeStaticHostFiles();
    }

    process.exit(result.status);
  }

  process.exit(1);
} finally {
  for (const backup of backups) {
    writeFileSync(backup.filePath, backup.source);
  }
  rmSync(expoHome, { recursive: true, force: true });
}
