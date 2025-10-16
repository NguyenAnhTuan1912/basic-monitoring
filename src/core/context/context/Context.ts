/**
 * Base class of context.
 */
export class Context {
  /**
   * Kết quả của lần thực thi trước nếu đang ở trong pipeline.
   */
  public prevResult?: any;

  /**
   * Cho biết có thể thực thi context nữa hay không?
   */
  public canStop: boolean;

  constructor() {
    this.canStop = false;
  }

  /**
   * Dừng việc thực thi context lại.
   */
  stop() {
    this.canStop = true;
  }
}
