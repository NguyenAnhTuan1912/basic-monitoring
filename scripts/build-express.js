const path = require("path");

const chalk = require("chalk");
const esbuild = require("esbuild");

const ROOT_DIR = path.resolve("src/runtimes", "express");
const ENTRYPOINT = path.resolve(ROOT_DIR, "app.ts");
const OUT_DIR = path.resolve("build", "express");
const TSCONFIG_FILE = path.resolve("tsconfig.json");

const start = performance.now();

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
  .then(() => {
    const duration = performance.now() - start;
    console.log(
      "Build time:",
      chalk.default.yellow((duration / 1000).toFixed(3)),
      "s",
    );
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
