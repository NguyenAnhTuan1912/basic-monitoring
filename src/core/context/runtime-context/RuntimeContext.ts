import { Context } from "../context/Context";

import type { Readable } from "stream";
import type { AppError, ClientError } from "../../error";

/**
 * Trong mỗi runtime khác nhau sẽ có các input khác nhau, vì thế mà
 * mình sẽ cần phải tạo ra một tiêu chuẩn để cho core có thể dùng được
 * gì từ những runtime đó mà không cần phải sử dụng trực tiếp runtime
 * đó trong phần definition của core. Ví dụ như với Express, mình sẽ có
 * Request, Response và NextFunction nhưng các runtime khác thì có thể
 * sẽ có các chuẩn input khác nhau. Đó là lý do vì sao mà mình phải
 * định nghĩa ra Runtime Context để chuẩn hoá.
 *
 * Trong này thì mình có thể thấy là context nó bao gồm cả properties
 * và methods. Trong đó bạn có thể thấy có nhiều methods lấy input
 * (tiền tố get) và có nhiều methods gửi output (tiền tố send).
 *
 * Ngoài ra thì còn có một số hàm khác nữa.
 */
export abstract class RuntimeContext extends Context {
  /** Name of runtime */
  public runtime: string;

  /**
   * Kết quả của lần thực thi trước nếu đang ở trong pipeline.
   */
  public prevResult?: any;

  /**
   * Cho biết là có thể dùng context này hay không?
   */
  public canStop!: boolean;

  constructor() {
    super();

    this.runtime = "";
    this.prevResult = undefined;
    this.canStop = false;
  }

  /**
   * Dừng việc thực thi context lại.
   */
  stop() {
    this.canStop = true;
  }

  /**
   * Gán giá trị http status code.
   *
   * @abstract
   * @param status - Mã http status code hợp lệ.
   */
  abstract setHTTPStatus(status: number): void;

  /**
   * Lấy body trong HTTP Request (Payload), nếu request có body.
   *
   * @abstract
   * @returns
   */
  abstract getBody<T = unknown>(): Promise<T>;

  /**
   * Lấy dữ liệu tạm thời đã được lưu trong context với key.
   *
   * @abstract
   * @param key - key của dữ liệu đã lưu.
   *
   * @returns
   */
  abstract getTempData<T = unknown>(key: string): Promise<T>;

  /**
   * Lấy phần query trong URL.
   *
   * @abstract
   * @returns
   */
  abstract getQuery<T = unknown>(): Promise<T>;

  /**
   * Lấy các tham số ở trong phần pathname của URL.
   *
   * @abstract
   * @returns
   */
  abstract getParams<T = unknown>(): Promise<T>;

  /**
   * Lấy Request Headers.
   *
   * @abstract
   * @returns
   */
  abstract getHeaders<T = unknown>(): Promise<T>;

  /**
   * Thiết lập giá trị mới cho body, hoặc là update.
   *
   * @abstract
   * @param body - body mới hoặc một phần body mới.
   */
  abstract setBody(body: ((oldBody: any) => any) | any): void;

  /**
   * Thêm dữ liệu tạm thời vào trong context với key.
   *
   * @abstract
   * @param key - key của dữ liệu.
   * @param data - dữ liệu cần lưu.
   */
  abstract addTempData<T = unknown>(key: string, data: T): void;

  /**
   * Gửi lại Client bên ngoài runtime (requester) một Streaming Response.
   *
   * @abstract
   * @param stream - dữ liệu truyền về là một dạng stream.
   * @param contentType - kiểu content trả về, phải phù hợp với stream.
   */
  abstract sendStreaming(source: Readable | Buffer, contentType?: string): void;

  /**
   * Gửi lại Client bên ngoài runtime (requester) một JSON Response.
   *
   * @abstract
   * @param data - dữ liệu trả về (kết quả).
   * @param meta - các thông tin thêm trong quá trình thực hiện hoặc là của chính kết quả.
   */
  abstract sendJson(data: unknown, meta?: unknown): void;

  /**
   * Gửi lại Client bên ngoài runtime (requester) một HTML Response.
   *
   * @abstract
   * @param htmlStr - một chuỗi trả về theo chuẩn HTML.
   */
  abstract sendHTML(htmlStr: string): void;

  /**
   * Gửi lại Client bên ngoài runtime (requester) một Error Response theo chuẩn JSON.
   *
   * @abstract
   * @param error - lỗi phản hồi, có thể là `ClientErrror` hoặc `AppError`.
   */
  abstract sendError(error: AppError | ClientError): void;

  /**
   * Hàm next trong một số runtime.
   *
   * @abstract
   */
  abstract next?(p: any): void;
}
