export const promMetricConfig = {
  httpRequestsTotal: {
    type: "counter",
    config: {
      name: "http_requests_total",
      help: "Tổng số các requests theo route và method",
      labelNames: ["method", "route"],
    },
  },
  httpRequestsStatusTotal: {
    type: "counter",
    config: {
      name: "http_requests_statuscode_total",
      help: "Tổng số các requests theo status code.",
      labelNames: ["status_code"],
    },
  },
  httpConcurrentRequests: {
    type: "gauge",
    config: {
      name: "http_concurrent_requests",
      help: "Số các requests đồng thời theo route và method trong một khoảng thời gian.",
      labelNames: ["method", "route"],
    },
  },
};
