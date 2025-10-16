export type TStepExecutor<TContext, TResult> = (
  ctx: TContext,
) => Promise<TResult> | TResult;

/**
 * Lớp định nghĩa bước xử lý trong một pipeline
 *
 * @template TResult
 */
export class Step<TContext = unknown, TResult = unknown> {
  private _executor?: TStepExecutor<TContext, TResult>;

  constructor(executor?: TStepExecutor<TContext, TResult>) {
    if (executor) this._executor = executor;
  }

  /**
   * Gán executor cho Step
   *
   * @param executor - là một hàm
   */
  setExecutor(executor: TStepExecutor<TContext, TResult>) {
    this._executor = executor;
  }

  /**
   * Thực thi executor của một Step
   *
   * @param ctx - ngữ cảnh thực thi, có thể là runtime (RuntimeContext)
   * hoặc trong core (InternalContext)
   */
  execute(ctx: TContext) {
    if (!this._executor) throw new Error("Executor of Step is not set");
    return this._executor(ctx);
  }
}
