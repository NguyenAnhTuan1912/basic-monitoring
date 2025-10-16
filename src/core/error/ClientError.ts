import { AppError, UHTTPServerErrorType } from "./AppError";

// Import types
import type { TBaseErrorDetail, TErrorDetails } from "./type";

export const HTTPClientErrorDict = {
  BadRequest: {
    Status: 400,
    Code: "BAD_REQUEST",
  },
  Unauthorized: {
    Status: 401,
    Code: "UNAUTHORIZED",
  },
  Forbidden: {
    Status: 403,
    Code: "FORBIDDEN",
  },
  NotFound: {
    Status: 404,
    Code: "NOT_FOUND",
  },
  MethodNotAllowed: {
    Status: 405,
    Code: "METHOD_NOT_ALLOWED",
  },
  RequestTimeout: {
    Status: 408,
    Code: "REQUEST_TIMEOUT",
  },
  Conflict: {
    Status: 409,
    Code: "CONFLICT",
  },
  Gone: {
    Status: 410,
    Code: "GONE",
  },
  UnprocessableEntity: {
    Status: 422,
    Code: "UNPROCESSABLE_ENTITY",
  },
  TooManyRequests: {
    Status: 429,
    Code: "TOO_MANY_REQUESTS",
  },
} as const;

export type UHTTPClientErrorType = keyof typeof HTTPClientErrorDict;

/**
 * Lớp định nghĩa lỗi từ client hoặc là lỗi nội bộ của app.
 */
export class ClientError extends AppError {
  constructor(message: string, details?: TErrorDetails) {
    super(
      message,
      HTTPClientErrorDict.BadRequest.Status,
      HTTPClientErrorDict.BadRequest.Code,
      details,
    );
  }

  /**
   * Xem error này chính là HTTP Error.
   *
   * @param name - tên loại của HTTP Error.
   */
  asHTTPError(name: string) {
    this.statusCode = HTTPClientErrorDict[name as UHTTPClientErrorType].Status;
    this.code = HTTPClientErrorDict[name as UHTTPClientErrorType].Code;

    return this;
  }

  /**
   * Tạo ra một base error detail.
   *
   * @static
   * @returns
   */
  static createErrorDetail(source: string, desc: string): TBaseErrorDetail {
    return {
      source,
      desc,
    };
  }
}
