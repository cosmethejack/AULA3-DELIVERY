import { Injectable, LoggerService, Scope } from "@nestjs/common";
import { trace } from "@opentelemetry/api";

const SENSITIVE_KEYS = ["password", "token", "authorization", "secret"];
const REDACTED = "[REDACTED]";

/** Ofusca valores de chaves sensíveis antes de serializar o log. */
export function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redact);
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = SENSITIVE_KEYS.includes(key.toLowerCase()) ? REDACTED : redact(val);
    }
    return out;
  }
  return value;
}

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
  private userId = "";
  private requestId = "";

  /** Injeta ids de correlação da requisição atual (via interceptor). */
  setContext(ids: { userId?: string; requestId?: string }) {
    this.userId = ids.userId ?? "";
    this.requestId = ids.requestId ?? "";
  }

  log(message: unknown, context?: string) {
    this.write("info", message, context);
  }
  error(message: unknown, traceStr?: string, context?: string) {
    this.write("error", message, context, traceStr);
  }
  warn(message: unknown, context?: string) {
    this.write("warn", message, context);
  }
  debug(message: unknown, context?: string) {
    this.write("debug", message, context);
  }
  verbose(message: unknown, context?: string) {
    this.write("verbose", message, context);
  }

  private write(level: string, message: unknown, context?: string, traceStr?: string) {
    const span = trace.getActiveSpan();
    const spanCtx = span?.spanContext();

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      service: "backend",
      trace_id: spanCtx?.traceId ?? "",
      span_id: spanCtx?.spanId ?? "",
      request_id: this.requestId,
      user_id: this.userId,
      message: redact(message),
      context,
      trace: traceStr,
    };

    const line = JSON.stringify(entry);
    // eslint-disable-next-line no-console -- sink final do logging estruturado
    if (level === "error") console.error(line);
    // eslint-disable-next-line no-console -- sink final do logging estruturado
    else console.log(line);
  }
}
