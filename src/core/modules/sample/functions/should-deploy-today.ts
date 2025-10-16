// Import types
import type { RuntimeContext } from "src/core/context/runtime-context";

/**
 * Quyết định xem hôm nay có nên deploy không ???
 *
 * @param ctx
 */
export async function shouldIDeployToday(ctx: RuntimeContext) {
  const roll = Math.random();

  if (roll < 0.3) return "Triển thôi! CI/CD đang mỉm cười với bạn 😎";
  if (roll < 0.7) return "Hmmm... có thể deploy, nhưng nhớ backup trước nhé 🤔";

  return "Không! Mercury đang retrograde, deploy là toang 🔥";
}
