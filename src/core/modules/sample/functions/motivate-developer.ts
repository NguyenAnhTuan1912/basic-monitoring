// Import types
import type { RuntimeContext } from "src/core/context/runtime-context";

/**
 * Lấy mốt số câu truyền động lực.
 *
 * @param ctx
 */
export async function motivateDeveloper(ctx: RuntimeContext) {
  const query = (await ctx.getQuery()) as any;
  const name = query["name"];

  const quotes = [
    "Code lỗi cũng là một cách để học — mà học hơi đau chút 😅",
    "Một bug ngã xuống, mười commit đứng lên 💥",
    "Không có bug nào là mãi mãi, chỉ có deadline là gần kề ⏰",
    "Cứ tin đi, code của bạn chạy được... trên máy của bạn 😎",
    "console.log() là bạn, debugger là tri kỷ 💻",
  ];
  const random = Math.floor(Math.random() * quotes.length);

  return `Hey ${name}, ${quotes[random]}`;
}
