// Import types
import type { RuntimeContext } from "src/core/context/runtime-context";

/**
 * Đánh giá code được bỏ vào (vui).
 *
 * @param ctx
 */
export async function rateMyCode(ctx: RuntimeContext) {
  const body = (await ctx.getBody()) as any;
  const code = body["code"];

  const scores = [
    "10/10 — Code như nghệ thuật 🎨",
    "7/10 — Cũng ổn, nhưng hơi thiếu ngoặc } ở đâu đó thì phải 😬",
    "5/10 — Stack Overflow approve 👍",
    "2/10 — Có thể chạy… nếu bạn cầu nguyện đủ mạnh 🙏",
    "0/10 — Vừa đọc xong VSCode tự tắt luôn 😭",
  ];
  const random = Math.floor(Math.random() * scores.length);

  return `Đánh giá cho đoạn code của bạn: ${scores[random]}. Code: ${code}`;
}
