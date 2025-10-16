import {
  Counter,
  Gauge,
  Histogram,
  Summary,
  Registry,
  collectDefaultMetrics,
} from "prom-client";

import { MetricServiceClient } from "./MetricServiceClient";

// Import configs
import { Configs } from "src/utils/configs";

// Import types
import type {
  TPrometheusCounterParams,
  TPrometheusGaugeParams,
  TPrometheusHistogramParams,
  TPrometheusSummaryParams,
} from "./type";

export class PrometheusClient extends MetricServiceClient<Registry> {
  static Registry = new Registry();

  constructor() {
    super();
  }

  init() {
    PrometheusClient.Registry.setDefaultLabels({
      service: Configs.ServiceName,
    });

    collectDefaultMetrics({ register: PrometheusClient.Registry });
  }

  /**
   * Create request collector (counter).
   *
   * @param instance
   * @returns counter collector
   */
  static createRequestCollector(instance: PrometheusClient) {
    return instance.createCounter({
      name: "http_requests_total",
      help: "Total of request per route and method",
      labelNames: ["method", "route"],
    });
  }

  createCounter(params: TPrometheusCounterParams) {
    return new Counter({
      name: params.name,
      help: params.help,
      labelNames: params.labelNames || [],
      registers: [PrometheusClient.Registry],
    });
  }

  createGauge(params: TPrometheusGaugeParams) {
    return new Gauge({
      name: params.name,
      help: params.help,
      labelNames: params.labelNames || [],
      registers: [PrometheusClient.Registry],
    });
  }

  createHistogram(params: TPrometheusHistogramParams) {
    return new Histogram({
      name: params.name,
      help: params.help,
      buckets: params.buckets || [0.1, 0.5, 1, 2, 5],
      labelNames: params.labelNames || [],
      registers: [PrometheusClient.Registry],
    });
  }

  createSummary(params: TPrometheusSummaryParams) {
    return new Summary({
      name: params.name,
      help: params.help,
      percentiles: params.percentiles || [0.5, 0.9, 0.99],
      labelNames: params.labelNames || [],
      registers: [PrometheusClient.Registry],
    });
  }

  async getMetrics(): Promise<string> {
    return await PrometheusClient.Registry.metrics();
  }

  getRegistry() {
    return PrometheusClient.Registry;
  }
}
