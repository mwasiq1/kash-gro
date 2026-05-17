/**
 * Smart build script that handles both local dev and Vercel deployments.
 *
 * On Vercel, npm eats the --filter flag but exposes it as npm_config_filter.
 * When a filter is detected, we skip Turbo entirely and build directly:
 *   1. Build the shared package (tsc)
 *   2. Build the target Next.js app (next build)
 *
 * Locally (no filter), we use Turbo for the full parallel build.
 */
const { execSync } = require("child_process");
const path = require("path");

const filter = process.env.npm_config_filter || process.env.TURBO_FILTER;
const root = path.resolve(__dirname, "..");

function run(cmd, cwd) {
  const label = path.relative(root, cwd) || ".";
  console.log(`\n> [${label}] ${cmd}\n`);
  execSync(cmd, { stdio: "inherit", cwd });
}

if (filter) {
  console.log(`\n🔧 Filtered build detected: building "${filter}" only\n`);

  // Step 1: Build the shared package
  run("npx tsc", path.join(root, "packages", "shared"));

  // Step 2: Build the target Next.js app
  run("npx next build", path.join(root, "apps", filter));
} else {
  console.log("\n🔧 Full monorepo build via Turbo\n");
  run("npx turbo run build", root);
}
