import { AppError } from "../error";

export class ResponsePayload<Data = any, Meta = any> {
  public data?: Data;
  public meta?: Meta;
  public error?: ReturnType<AppError["toPlain"]>;

  constructor() {}

  setData(data: Data) {
    this.data = data;
    return this;
  }

  setMeta(meta: Meta) {
    this.meta = meta;
    return this;
  }

  setError(error: ReturnType<AppError["toPlain"]>) {
    this.error = error;
    this.data = undefined;
    return this;
  }
}
