import { existsSync } from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

const candidatePaths = [
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../../.env.local"),
  path.resolve(process.cwd(), "../../.env"),
];

for (const envPath of candidatePaths) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}
