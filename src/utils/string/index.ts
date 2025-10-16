import fs from "fs";
import path from "path";

// Import configs
import { Configs } from "../configs";

/**
 * Generate valid path.
 * @param parts
 * @returns
 */
export function getPath(...parts: Array<string>) {
  let result = "";

  for (const part of parts) {
    if (part == "") continue;
    if (part[0] !== "/") result += "/" + part;
    else result += part.replace(/\/+/, "/");
  }

  if (result[0] !== "/") return "/" + result;

  return result;
}

/**
 * @returns root dir of codebase.
 */
export function getRootDir() {
  return path.resolve(getSrcPath(), "..");
}

/**
 * @param parts
 * @returns root dir is merged with /path/to/dir.
 */
export function getRootDirTo(...parts: Array<string>) {
  return path.resolve(getRootDir(), ...parts);
}

/**
 * @returns source path of codebase.
 */
export function getSrcPath() {
  let cwd = process.cwd();
  const srcPath = Configs.SrcPath;
  const packageJsonPath = "package.json";

  while (!cwd.endsWith(srcPath)) {
    const paths = fs.readdirSync(cwd);
    let count = 0;

    // List current directory to find `src` and `package.json`
    for (const _path of paths) {
      if (_path === srcPath || _path === packageJsonPath) {
        count++;
      }

      if (count == 2) {
        cwd = path.resolve(cwd, srcPath);
        return cwd;
      }
    }

    // If not, go to outside
    cwd = path.resolve(cwd, "..");
  }

  return cwd;
}
