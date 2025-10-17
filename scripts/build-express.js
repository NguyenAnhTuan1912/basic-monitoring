const path = require("path");

const esbuild = require("esbuild");

const ROOT_DIR = path.resolve("src/runtimes", "express");
const ENTRYPOINT = path.resolve(ROOT_DIR, "app.ts");
const OUT_DIR = path.resolve("build", "express");
const TSCONFIG_FILE = path.resolve("tsconfig.json");

esbuild
  .build({
    entryPoints: [ENTRYPOINT],
    bundle: true,
    outdir: OUT_DIR,
    tsconfig: TSCONFIG_FILE,
    platform: "node",
    sourcemap: true,

    external: ["swagger-ui-express", "swagger-ui-dist"],
  })
  .catch(() => process.exit(1));
