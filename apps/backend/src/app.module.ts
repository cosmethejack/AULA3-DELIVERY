import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { DatabaseModule } from "./core/database/database.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AuditModule } from "./core/audit/audit.module";
import { AuditInterceptor } from "./core/audit/audit.interceptor";
import { RequestIdInterceptor } from "./core/observability/request-id.interceptor";
import { ClerkGuard } from "./core/auth/clerk.guard";
import { AppController } from "./app.controller";
import { HealthController } from "./core/health/health.controller";
import { validateEnv } from "./core/config/env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["../../.env", ".env"],
      validate: validateEnv,
    }),
    DatabaseModule,
    OrdersModule,
    PaymentsModule,
    DashboardModule,
    CatalogModule,
    CategoriesModule,
    CustomersModule,
    AuthModule,
    AuditModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    { provide: APP_GUARD, useClass: ClerkGuard },
    { provide: APP_INTERCEPTOR, useClass: RequestIdInterceptor },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}
