const { spawnSync } = require("child_process");
const path = require("path");

const filter = process.env.npm_config_filter || process.env.TURBO_FILTER;
const root = path.resolve(__dirname, "..");

function run(cmd, cwd) {
  console.log(`\n> [${path.relative(root, cwd) || "."}] ${cmd}\n`);
  const r = spawnSync("sh", ["-c", cmd], { stdio: "inherit", cwd, env: process.env });
  if (r.status !== 0) process.exit(r.status || 1);
}

if (filter) {
  console.log(`\n--- Building "${filter}" only ---`);
  console.log(`NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || "NOT SET"}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || "NOT SET"}\n`);

  // 1. Build shared package
  run("node ../../node_modules/typescript/bin/tsc", path.join(root, "packages", "shared"));

  // 2. Build the target app using its own package.json build script
  //    This avoids npx resolution issues entirely
  const appDir = path.join(root, "apps", filter);
  const nextBin = path.join(root, "node_modules", ".bin", "next");
  run(`${nextBin} build`, appDir);
} else {
  console.log("\n--- Full build via Turbo ---\n");
  run("npx turbo run build", root);
}
