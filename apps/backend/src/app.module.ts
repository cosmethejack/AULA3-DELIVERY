import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { DatabaseModule } from "./core/database/database.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AuditModule } from "./core/audit/audit.module";
import { AuditInterceptor } from "./core/audit/audit.interceptor";
import { ClerkGuard } from "./core/auth/clerk.guard";
import { AppController } from "./app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    OrdersModule,
    PaymentsModule,
    DashboardModule,
    CatalogModule,
    CustomersModule,
    AuthModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: ClerkGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}
