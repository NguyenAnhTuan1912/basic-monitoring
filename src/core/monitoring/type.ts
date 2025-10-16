export type TBaseParams = {
  name: string;
  help: string;
  labelNames?: Array<string>;
};

export type TPrometheusCounterParams = TBaseParams & {};

export type TPrometheusGaugeParams = TBaseParams & {};

export type TPrometheusHistogramParams = TBaseParams & {
  buckets?: Array<number>;
};

export type TPrometheusSummaryParams = TBaseParams & {
  percentiles?: Array<number>;
};
