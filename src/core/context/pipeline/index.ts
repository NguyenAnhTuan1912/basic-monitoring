import { Context } from "../context/Context";
import { Step } from "./Step";

import { AppError, isStandardError } from "../../error";

// Import types
import { RuntimeContext } from "../runtime-context";
import { InternalContext } from "../internal-context";
import type { TStepExecutor } from "./Step";
import type { TPipelineRunState } from "./type";

/**
 * Lớp định nghĩa một pipeline.
 *
 * Khi các steps được chạy trong một pipeline, thì step sau có
 * thể sẽ có được kết quả từ step trước đó. Trong trường hợp này
 * thì kết quả đó sẽ được hiểu là params cho step tiếp theo.
 * Chính vì thế, khi sử dụng pipeline trong core thì mình phải lưu ý.
 */
export class Pipeline<TContext extends Context = any> {
  public name: string;

  private _steps: Array<Step<TContext, unknown>>;

  constructor(name: string) {
    this.name = name;
    this._steps = [];
  }

  /**
   * Process runtime result.
   *
   * @param ctx
   * @returns
   */
  static processRuntimeResult(ctx: RuntimeContext) {
    if (isStandardError(ctx.prevResult)) {
      return ctx.sendError(ctx.prevResult);
    }

    return ctx.sendJson(ctx.prevResult);
  }

  /**
   * Process error in context.
   *
   * @param ctx
   * @param error
   * @returns
   */
  static processError(ctx: Context, error: any) {
    if (error instanceof Error) {
      error = new AppError(error.message).asHTTPError("InternalServerError");
      (ctx as any)["prevResult"] = error;
    }

    if (ctx instanceof RuntimeContext) {
      return Pipeline.processRuntimeResult(ctx);
    }

    ctx.stop();
  }

  /**
   * Trả về các steps trong một pipeline.
   *
   * @returns
   */
  getSteps() {
    return this._steps;
  }

  /**
   * Thêm một step mới vào trong pipeline.
   *
   * @param executor - executor của step.
   * @param ctxType - kiểu context mà step chạy.
   */
  addStep<TResult = unknown>(executor: TStepExecutor<TContext, TResult>) {
    const newStep = new Step<TContext, TResult>(executor);

    this._steps.push(newStep);

    return this;
  }

  /**
   * Chạy pipeline theo context được truyền vào.
   */
  async run(ctx: TContext) {
    let currentResult: any;

    for (const step of this._steps) {
      let maybePromise = step.execute(ctx);

      try {
        if (maybePromise instanceof Promise) {
          currentResult = await maybePromise;
        } else {
          currentResult = maybePromise;
        }
      } catch (error: any) {
        // Stop run
        if (error instanceof Error || error instanceof AppError) {
          Pipeline.processError(ctx, error);
        }
        return;
      }

      (ctx as any)["prevResult"] = currentResult;

      // Stop run
      if (currentResult instanceof Error || currentResult instanceof AppError) {
        Pipeline.processError(ctx, currentResult);
      }

      // Process post step execution
      if (ctx.canStop) break;
    }

    return currentResult;
  }
}
