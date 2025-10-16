// Import types
import type { RuntimeContext } from "src/core/context/runtime-context";

/**
 * Dịch thành tiếng mèo.
 *
 * @param ctx
 */
export async function translateToMeow(ctx: RuntimeContext) {
  const body = (await ctx.getBody()) as any;
  const message = body["message"];

  const meows = ["meow", "mew", "nya", "purr"];
  return message
    .split(" ")
    .map(() => meows[Math.floor(Math.random() * meows.length)])
    .join(" ");
}
