// Import types
import type { TBaseErrorDetail, TErrorDetails } from "./type";

export const HTTPServerErrorDict = {
  InternalServerError: {
    Status: 500,
    Code: "INTERNAL_SERVER_ERROR",
  },
  NotImplemented: {
    Status: 501,
    Code: "NOT_IMPLEMENTED",
  },
  BadGateway: {
    Status: 502,
    Code: "BAD_GATEWAY",
  },
  ServiceUnavailable: {
    Status: 503,
    Code: "SERVICE_UNAVAILABLE",
  },
  GatewayTimeout: {
    Status: 504,
    Code: "GATEWAY_TIMEOUT",
  },
  HttpVersionNotSupported: {
    Status: 505,
    Code: "HTTP_VERSION_NOT_SUPPortED",
  },
} as const;

export type UHTTPServerErrorType = keyof typeof HTTPServerErrorDict;

/**
 * Lớp định nghĩa lỗi từ App hoặc phản hồi từ App.
 */
export class AppError extends Error {
  public statusCode: number;
  public code?: string | undefined;
  public details?: TErrorDetails | undefined;

  constructor(
    message: string,
    statusCode = 500,
    code?: string,
    details?: TErrorDetails,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
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

  /**
   * Thêm chi tiết lỗi vào tổng lỗi.
   *
   * @param detail - chi tiết lỗi.
   *
   * @returns
   */
  addErrorDetail(detail: TBaseErrorDetail) {
    if (!this.details) this.details = { reasons: [detail] };
    else if (this.details && !this.details.reasons) {
      this.details.reasons = [detail];
    } else {
      this.details.reasons?.push(detail);
    }

    return this;
  }

  /**
   * Xem error này chính là HTTP Error.
   *
   * @param name - tên loại của HTTP Error.
   */
  asHTTPError(name: string) {
    this.statusCode = HTTPServerErrorDict[name as UHTTPServerErrorType].Status;
    this.code = HTTPServerErrorDict[name as UHTTPServerErrorType].Code;

    return this;
  }

  /**
   * Trả về error là một plain object.
   *
   * @returns
   */
  toPlain() {
    return {
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}
