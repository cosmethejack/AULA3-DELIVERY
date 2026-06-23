import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { Roles } from "../../core/auth/roles.decorator";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("summary")
  @Roles("ADMIN")
  summary() {
    return this.dashboardService.summary();
  }
}
