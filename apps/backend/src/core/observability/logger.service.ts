import { Injectable, LoggerService } from "@nestjs/common";

@Injectable()
export class AppLogger implements LoggerService {
  log(message: string, context?: string) {
    this.write("info", message, context);
  }
  error(message: string, trace?: string, context?: string) {
    this.write("error", message, context, trace);
  }
  warn(message: string, context?: string) {
    this.write("warn", message, context);
  }
  debug(message: string, context?: string) {
    this.write("debug", message, context);
  }
  verbose(message: string, context?: string) {
    this.write("verbose", message, context);
  }

  private write(level: string, message: string, context?: string, trace?: string) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      service: "backend",
      message,
      context,
      trace,
    };
    if (level === "error") {
      console.error(JSON.stringify(entry));
    } else {
      console.log(JSON.stringify(entry));
    }
  }
}
