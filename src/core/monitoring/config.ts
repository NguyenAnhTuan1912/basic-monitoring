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
  httpRequestDurationSeconds: {
    type: "histogram",
    config: {
      name: "http_request_duration_seconds",
      help: "Phân bố tần suất thời gian server thực hiện một request.",
      labelNames: ["method", "route"],
      // Mình đo từ 5ms -> 10ms -> 10s
      buckets: [
        0.005,
        0.01,
        0.025,
        0.05,
        0.1,
        0.25,
        0.5,
        1,
        2.5,
        5,
        10,
        Infinity,
      ],
    },
  },
};
