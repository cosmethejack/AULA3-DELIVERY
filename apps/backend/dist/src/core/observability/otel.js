"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_node_1 = require("@opentelemetry/sdk-node");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const exporter_metrics_otlp_http_1 = require("@opentelemetry/exporter-metrics-otlp-http");
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const serviceName = process.env.OTEL_SERVICE_NAME || "delivery-backend";
const exporterEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318";
const sdk = new sdk_node_1.NodeSDK({
    resource: (0, resources_1.resourceFromAttributes)({
        [semantic_conventions_1.ATTR_SERVICE_NAME]: serviceName,
        [semantic_conventions_1.ATTR_SERVICE_VERSION]: "0.1.0",
    }),
    traceExporter: new exporter_trace_otlp_http_1.OTLPTraceExporter({ url: `${exporterEndpoint}/v1/traces` }),
    metricReader: new sdk_metrics_1.PeriodicExportingMetricReader({
        exporter: new exporter_metrics_otlp_http_1.OTLPMetricExporter({ url: `${exporterEndpoint}/v1/metrics` }),
        exportIntervalMillis: 60000,
    }),
    instrumentations: [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()],
});
sdk.start();
process.on("SIGTERM", () => {
    sdk.shutdown().catch(console.error);
});
//# sourceMappingURL=otel.js.map