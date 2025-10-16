import { AppError } from "./AppError";
import { ClientError } from "./ClientError";

export * from "./AppError";
export * from "./ClientError";
export * from "./type";

/**
 * Kiểm tra xem nếu một lỗi có phải là lỗi tiêu chuẩn (AppError, ClientError).
 *
 * @param err - lỗi từ nguồn chưa biết.
 * @returns
 */
export function isStandardError(err: any) {
  return err instanceof AppError || err instanceof ClientError;
}
