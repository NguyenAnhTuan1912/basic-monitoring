import { Context } from "../context/Context";

import type { RuntimeContext } from "../runtime-context/RuntimeContext";

/**
 * Lớp đại diện cho internal context.
 */
export class InternalContext<TParams = unknown> extends Context {
  /**
   * Tham số chính của hàm/module.
   */
  public params: Partial<TParams> & Record<string, any>;

  /**
   * Kết quả của lần thực thi trước nếu đang ở trong pipeline.
   */
  public prevResult?: any;

  /**
   * Context từ runtime.
   */
  public runtimeCtx?: RuntimeContext;

  /**
   * Một số các tham số thêm cho hàm/module để xử lý.
   */
  public options?: {
    /**
     * Cho biết là context ở ngoài hàm/module này có thể bắt được lỗi hay không?
     * Nếu không thì mình phải xử lý dữ liệu rồi trả về undefined hoặc null
     * hoặc [] hoặc bất cứ giá trị nào. Mặc định là `true`.
     */
    canCatchError: boolean;
  } & Record<string, any>;

  constructor() {
    super();

    this.params = {};
    this.runtimeCtx = undefined;

    this.options = {
      canCatchError: false,
    };
  }
}
