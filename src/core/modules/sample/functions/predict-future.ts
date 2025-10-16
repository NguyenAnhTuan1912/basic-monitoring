// Import types
import type { RuntimeContext } from "src/core/context/runtime-context";

/**
 * Trả về kết quả vui ở tương lai.
 *
 * @param ctx
 */
export function predictFuture(ctx: RuntimeContext) {
  const predictions = [
    "Bạn sẽ trở thành tỉ phú… trong game Monopoly 🤑",
    "Hôm nay bạn nên uống thêm một ly cà phê ☕",
    "Một con mèo sẽ nghĩ về bạn trong 3... 2... 1... 🐱",
    "Bạn sắp gõ sai một dòng code 😅",
    "Git commit tiếp theo của bạn sẽ phá build 🤖",
  ];
  const random = Math.floor(Math.random() * predictions.length);

  return predictions[random];
}
