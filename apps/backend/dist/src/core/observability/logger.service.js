"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogger = void 0;
const common_1 = require("@nestjs/common");
let AppLogger = class AppLogger {
    log(message, context) {
        this.write("info", message, context);
    }
    error(message, trace, context) {
        this.write("error", message, context, trace);
    }
    warn(message, context) {
        this.write("warn", message, context);
    }
    debug(message, context) {
        this.write("debug", message, context);
    }
    verbose(message, context) {
        this.write("verbose", message, context);
    }
    write(level, message, context, trace) {
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
        }
        else {
            console.log(JSON.stringify(entry));
        }
    }
};
exports.AppLogger = AppLogger;
exports.AppLogger = AppLogger = __decorate([
    (0, common_1.Injectable)()
], AppLogger);
//# sourceMappingURL=logger.service.js.map