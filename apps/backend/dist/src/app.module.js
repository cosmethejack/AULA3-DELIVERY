"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const database_module_1 = require("./core/database/database.module");
const orders_module_1 = require("./modules/orders/orders.module");
const payments_module_1 = require("./modules/payments/payments.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const catalog_module_1 = require("./modules/catalog/catalog.module");
const customers_module_1 = require("./modules/customers/customers.module");
const audit_module_1 = require("./core/audit/audit.module");
const audit_interceptor_1 = require("./core/audit/audit.interceptor");
const clerk_guard_1 = require("./core/auth/clerk.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            dashboard_module_1.DashboardModule,
            catalog_module_1.CatalogModule,
            customers_module_1.CustomersModule,
            audit_module_1.AuditModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: clerk_guard_1.ClerkGuard },
            { provide: core_1.APP_INTERCEPTOR, useClass: audit_interceptor_1.AuditInterceptor },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map