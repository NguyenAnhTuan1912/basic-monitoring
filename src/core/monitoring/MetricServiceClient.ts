/**
 * A base class for client of metric service.
 */
export abstract class MetricServiceClient<TRegistry = unknown> {
  constructor() {
    this.init();
  }

  /**
   * Initialize all settings.
   */
  abstract init(): void;

  /**
   * Create new counter element for metric collector.
   *
   * @param params
   * @returns
   */
  abstract createCounter(params: any): any;

  /**
   * Create new gauge element for metric collector.
   *
   * @param params
   * @returns
   */
  abstract createGauge(params: any): any;

  /**
   * Create new histogram element for metric collector.
   *
   * @param params
   * @returns
   */
  abstract createHistogram(params: any): any;

  /**
   * Create new summary element for metric collector.
   *
   * @param params
   * @returns
   */
  abstract createSummary(params: any): any;

  /**
   * @return collected metrics.
   */
  abstract getMetrics(): Promise<any>;

  /**
   * @return metric registry.
   */
  abstract getRegistry(): TRegistry;
}
