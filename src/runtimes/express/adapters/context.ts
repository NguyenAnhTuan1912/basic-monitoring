import { Readable } from "stream";

// Import from core
import { AppError } from "../../../core/error/AppError";
import { RuntimeContext } from "../../../core/context/runtime-context";

// Import types
import type { Request, Response, NextFunction } from "express";
import { ClientError } from "../../../core/error";

/**
 * Xác định Runtime cho Express, bao gồm các hàm, thuộc tính.
 */
export class ExpressRuntimeContext extends RuntimeContext {
  private _req: Request;
  private _res: Response;
  private _next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    super();
    this.runtime = "express";

    this._req = req;
    this._res = res;
    this._next = next;
  }

  async getBody<T = any>() {
    return this._req.body as Promise<T>;
  }

  async getQuery<T = any>() {
    return this._req.query as unknown as Promise<T>;
  }

  async getParams<T = any>() {
    return this._req.params as unknown as Promise<T>;
  }

  async getHeaders<T = any>() {
    return this._req.headers as unknown as Promise<T>;
  }

  async getTempData<T = any>(key: string) {
    return this._res.locals[key] as unknown as Promise<T>;
  }

  setBody(update: any | ((oldBody?: any) => any)) {
    if (typeof update === "function") {
      this._req.body = update(this._req.body);
    }

    this._req.body = update;
  }

  addTempData<T = any>(key: string, data: T) {
    this._res.locals[key] = data;
  }

  setHTTPStatus(status: number) {
    this._res.status(status);
  }

  sendJson(data: any, meta: any) {
    return this._res.json({ data, meta });
  }

  sendHTML(htmlStr: string) {
    return this._res.send(htmlStr);
  }

  sendError(error: AppError | ClientError) {
    return this._res.status(error.statusCode).json({ error: error.toPlain() });
  }

  sendStreaming(source: any, contentType = "application/octet-stream") {
    this._res.setHeader("Content-Type", contentType);
    this._res.setHeader("Transfer-Encoding", "chunked");

    if (Buffer.isBuffer(source)) {
      const stream = Readable.from(source);
      stream.pipe(this._res);

      stream.on("error", (err) => {
        const error = new AppError(err.message);
        this._res.status(500).json({ error: error.toPlain() });
      });
    } else if (typeof (source as Readable).pipe === "function") {
      source.pipe(this._res);

      source.on("error", (err: any) => {
        const error = new AppError(err.message);
        this._res.status(500).json({ error: error.toPlain() });
      });
    } else {
      this._res.status(500).end("Invalid stream source");
    }
  }

  next(p: Parameters<NextFunction>) {
    this._next(p);
  }
}
